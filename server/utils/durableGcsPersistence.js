/**
 * Durable Google Cloud Storage CAS Write-Through, 3-Way Ancestor Merge & Multi-Instance Sync Engine
 *
 * Eliminates BOTH Cloud Run scale-to-zero ephemeral disk resets AND multi-instance horizontal
 * last-writer-wins overwrites without requiring an external SQL database (`DATABASE_URL`),
 * while preserving 0ms synchronous POSIX atomic writes (.sync.tmp -> fs.renameSync).
 *
 * Architecture:
 * 1. Canonical DATA_DIR Resolution (`resolveDataDir`):
 *    Single shared directory resolver honoring `process.env.DATA_DIR` across all 15 managed stores.
 * 2. Cold-Start Generation-Pinned Hydration (`hydrateDataDirFromGcs`):
 *    Runs BEFORE `require('./indexCore')` constructs any `DataStore` or repository.
 *    Paginates through `gs://<SCOREX_GCS_STATE_BUCKET>/<PREFIX>/*.json`, pins object `generation`
 *    during media download (`?alt=media&generation=<gen>`), validates JSON fail-closed, records
 *    `knownGenerations` + immutable `baseJsonByPath` ancestor snapshots, purges any unhydrated
 *    baked local `RUNTIME_ONLY_STATE_FILES`, and seeds ONLY canonical starter stores
 *    (`SEEDABLE_CANONICAL_FILES`) using `ifGenerationMatch=0`—never `sessions.json` or `users.json`.
 * 3. Multi-Instance Optimistic Concurrency Control (`?ifGenerationMatch=<gen>`) + 3-Way Merge:
 *    Every GCS write specifies `?ifGenerationMatch=<expectedGen>`. If a peer Cloud Run instance
 *    mutated the object concurrently, GCS atomically rejects the stale write with `HTTP 412`.
 *    The writer immediately fetches the peer generation, absorbs any queued local burst writes,
 *    computes a deterministic record- & field-level 3-way structural merge
 *    (`threeWayMergeJsonState(base, remote, local)`—preserving concurrent creations, nested field
 *    edits, positional arrays, and non-resurrecting deletions), updates local disk + `DataStore`,
 *    and retries `?ifGenerationMatch=<newGen>`.
 * 4. Dirty-State Protection & Cross-Instance Read-After-Write Freshness (`refreshChangedFilesFromGcs`):
 *    Tracks `dirtyUnsyncedPaths` and `activeReadModifyWrites` so transient upload errors (`503`) or
 *    in-flight async read-modify-writes (`FileUserStore`) are NEVER clobbered by peer refreshes;
 *    dirty paths are 3-way merged with peer snapshots and automatically re-queued for upload.
 * 5. Immediate Parallel SIGTERM Drain (`flushAllPendingSyncs`):
 *    Flushes all in-flight and queued GCS uploads immediately on SIGTERM without waiting for idle
 *    HTTP keep-alive sockets to close.
 */

const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');
const { promisify } = require('util');

const execFileAsync = promisify(execFile);

const SEEDABLE_CANONICAL_FILES = new Set([
  'assessments.json',
  'dynamic_assessments.json',
  'custom_assessment_types.json',
  'genai_assessments.json',
  'ge_value_realization_dossiers.json',
  'eu_ai_dossiers.json',
  'feedback.json',
  'custom_questions.json'
]);

const RUNTIME_ONLY_STATE_FILES = new Set([
  'instance_object_versions.json',
  'users.json',
  'sessions.json',
  'assignments.json',
  'notifications.json',
  'user_feedback.json',
  'custom_question_assignments.json'
]);

const MANAGED_STATE_FILES = new Set([
  ...SEEDABLE_CANONICAL_FILES,
  ...RUNTIME_ONLY_STATE_FILES
]);

const METADATA_TOKEN_URL =
  'http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token';

let cachedToken = null;
let cachedTokenExpiresAtMs = 0;

// Keyed by canonical resolved local file path (path.resolve(filePath))
const pendingPayloads = new Map();
const activeWorkers = new Map();
const knownGenerations = new Map();
const baseJsonByPath = new Map();
const dirtyUnsyncedPaths = new Set();
const activeReadModifyWrites = new Map();

const externalSyncListeners = new Set();

let lastRemotePollAtMs = 0;
let inFlightRefreshPromise = null;

const telemetry = {
  enabled: false,
  concurrencyModel: 'gcs-cas-ifGenerationMatch-3way-merge',
  bucket: null,
  prefix: null,
  hydratedAt: null,
  hydrationFailed: false,
  hydratedFiles: [],
  seededFiles: [],
  lastSyncAt: null,
  lastRemoteRefreshAt: null,
  totalSyncedWrites: 0,
  casConflictsResolved: 0,
  peerUpdatesApplied: 0,
  lastError: null
};

function resolveDataDir() {
  if (process.env.DATA_DIR && String(process.env.DATA_DIR).trim()) {
    return path.resolve(String(process.env.DATA_DIR).trim());
  }
  return path.resolve(__dirname, '../../data');
}

function getGcsConfig() {
  const bucket = String(process.env.SCOREX_GCS_STATE_BUCKET || '').trim();
  const prefix = String(process.env.SCOREX_GCS_STATE_PREFIX || 'scorex-prod-v1')
    .trim()
    .replace(/^\/+|\/+$/g, '');
  const forceInTest = process.env.SCOREX_FORCE_GCS_SYNC_IN_TEST === '1';
  const isTestEnv =
    process.env.NODE_ENV === 'test' ||
    process.env.SCOREX_DISABLE_LISTEN === '1';
  const enabled = Boolean(bucket) && (!isTestEnv || forceInTest);
  return { enabled, bucket, prefix };
}

function isDurableGcsEnabled() {
  return getGcsConfig().enabled;
}

function beginExternalReadModifyWrite(filePath) {
  if (!filePath) return () => {};
  const canonicalPath = path.resolve(filePath);
  const prev = activeReadModifyWrites.get(canonicalPath) || 0;
  activeReadModifyWrites.set(canonicalPath, prev + 1);
  let released = false;
  return () => {
    if (released) return;
    released = true;
    endExternalReadModifyWrite(canonicalPath);
  };
}

function endExternalReadModifyWrite(filePath) {
  if (!filePath) return;
  const canonicalPath = path.resolve(filePath);
  const cur = activeReadModifyWrites.get(canonicalPath) || 0;
  if (cur <= 1) {
    activeReadModifyWrites.delete(canonicalPath);
  } else {
    activeReadModifyWrites.set(canonicalPath, cur - 1);
  }
}

function isPathReadModifyWriteLocked(canonicalPath) {
  return (activeReadModifyWrites.get(canonicalPath) || 0) > 0;
}

function registerExternalFileSyncListener(listener) {
  if (typeof listener === 'function') {
    externalSyncListeners.add(listener);
  }
  return () => externalSyncListeners.delete(listener);
}

function notifyExternalSyncListeners(canonicalPath, parsedData) {
  for (const listener of externalSyncListeners) {
    try {
      listener(canonicalPath, parsedData);
    } catch (_) {
      // Listener errors must never interrupt persistence pipeline
    }
  }
}

function writeAtomicLocalWithoutSyncTrigger(canonicalPath, jsonString, parsedData) {
  fs.mkdirSync(path.dirname(canonicalPath), { recursive: true });
  const tmpPath = `${canonicalPath}.${process.pid}.${Date.now()}.${Math.random().toString(36).slice(2, 7)}.gcs-sync.tmp`;
  fs.writeFileSync(tmpPath, jsonString, 'utf8');
  fs.renameSync(tmpPath, canonicalPath);
  notifyExternalSyncListeners(canonicalPath, parsedData);
}

// ============================================================================
// Deterministic 3-Way Structural Ancestor Merge (Base + Remote + Local)
// ============================================================================

function isPlainObject(val) {
  if (!val || typeof val !== 'object' || Array.isArray(val)) return false;
  const proto = Object.getPrototypeOf(val);
  return proto === Object.prototype || proto === null;
}

function stableDeepEqual(a, b) {
  if (a === b) return true;
  if (a === null || b === null || a === undefined || b === undefined) return false;
  if (typeof a !== typeof b) return false;
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!stableDeepEqual(a[i], b[i])) return false;
    }
    return true;
  }
  if (isPlainObject(a) && isPlainObject(b)) {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    for (const k of keysA) {
      if (!Object.prototype.hasOwnProperty.call(b, k)) return false;
      if (!stableDeepEqual(a[k], b[k])) return false;
    }
    return true;
  }
  return false;
}

function extractTimestampMs(obj) {
  if (!isPlainObject(obj)) return 0;
  const candidates = [
    obj.updatedAt,
    obj.updated_at,
    obj.lastSavedAt,
    obj.meta && obj.meta.updatedAt,
    obj.meta && obj.meta.lastUpdated,
    obj.released_at,
    obj.assigned_at,
    obj.createdAt,
    obj.created_at,
    obj.timestamp
  ];
  for (const raw of candidates) {
    if (typeof raw === 'string' && raw.length >= 8) {
      const ms = Date.parse(raw);
      if (Number.isFinite(ms) && ms > 0) return ms;
    } else if (typeof raw === 'number' && Number.isFinite(raw) && raw > 0) {
      return raw;
    }
  }
  return 0;
}

function getArrayItemKey(item, fileName = '') {
  // Primitive arrays (numeric score vectors like [1, 2, 3], ordered string lists, booleans)
  // MUST return null so `indexUniqueKeyedArray` treats them as atomic positional vectors
  // rather than unordered sets. Only plain entity objects with explicit identity fields are keyed.
  if (!isPlainObject(item)) return null;
  if (fileName === 'sessions.json' && item.sid) {
    return `sid:${String(item.sid)}`;
  }
  if (fileName === 'custom_question_assignments.json' && item.assessment_id && item.custom_question_id) {
    return `cqa:${String(item.assessment_id)}::${String(item.custom_question_id)}`;
  }
  if (item.id !== undefined && item.id !== null && String(item.id) !== '') {
    return `id:${String(item.id)}`;
  }
  if (item.sid !== undefined && item.sid !== null && String(item.sid) !== '') {
    return `sid:${String(item.sid)}`;
  }
  if (item.assessment_id && item.consumer_id) {
    return `asgn:${String(item.assessment_id)}::${String(item.consumer_id)}`;
  }
  if (item.assessment_id && item.custom_question_id) {
    return `cqa:${String(item.assessment_id)}::${String(item.custom_question_id)}`;
  }
  if (item.email) {
    return `email:${String(item.email).toLowerCase()}`;
  }
  return null;
}

function indexUniqueKeyedArray(arr, fileName) {
  if (!Array.isArray(arr)) return null;
  const map = new Map();
  for (const item of arr) {
    const key = getArrayItemKey(item, fileName);
    if (!key || map.has(key)) {
      return null; // Positional or non-uniquely-keyed array; treat atomically
    }
    map.set(key, item);
  }
  return map;
}

function mergeValuesThreeWay(baseVal, remoteVal, localVal, fileName = '', preferLocalOnTie = true) {
  if (stableDeepEqual(remoteVal, localVal)) return localVal;
  if (stableDeepEqual(baseVal, remoteVal)) return localVal;
  if (stableDeepEqual(baseVal, localVal)) return remoteVal;

  if (isPlainObject(remoteVal) && isPlainObject(localVal)) {
    return mergePlainObjectsThreeWay(
      isPlainObject(baseVal) ? baseVal : {},
      remoteVal,
      localVal,
      fileName,
      preferLocalOnTie
    );
  }

  if (Array.isArray(remoteVal) && Array.isArray(localVal)) {
    return mergeArraysThreeWay(
      Array.isArray(baseVal) ? baseVal : [],
      remoteVal,
      localVal,
      fileName,
      preferLocalOnTie
    );
  }

  return preferLocalOnTie ? localVal : remoteVal;
}

function mergePlainObjectsThreeWay(baseObj, remoteObj, localObj, fileName = '', preferLocalOnTie = true) {
  const bObj = isPlainObject(baseObj) ? baseObj : {};
  const rObj = isPlainObject(remoteObj) ? remoteObj : {};
  const lObj = isPlainObject(localObj) ? localObj : {};

  const remoteTs = extractTimestampMs(rObj);
  const localTs = extractTimestampMs(lObj);
  const preferLocal =
    remoteTs > 0 && localTs > 0 && remoteTs !== localTs
      ? localTs >= remoteTs
      : preferLocalOnTie;

  const allKeys = new Set([
    ...Object.keys(rObj),
    ...Object.keys(lObj),
    ...Object.keys(bObj)
  ]);

  const out = {};
  for (const key of allKeys) {
    const inB = Object.prototype.hasOwnProperty.call(bObj, key);
    const inR = Object.prototype.hasOwnProperty.call(rObj, key);
    const inL = Object.prototype.hasOwnProperty.call(lObj, key);

    if (!inR && !inL) continue;

    const bVal = inB ? bObj[key] : undefined;
    const rVal = inR ? rObj[key] : undefined;
    const lVal = inL ? lObj[key] : undefined;

    if (inR && inL && stableDeepEqual(rVal, lVal)) {
      out[key] = lVal;
      continue;
    }

    // Remote unchanged since Base -> apply Local's intent (add, edit, or delete)
    if (inB === inR && (!inB || stableDeepEqual(bVal, rVal))) {
      if (inL) out[key] = lVal;
      continue;
    }

    // Local unchanged since Base -> apply Remote's intent (add, edit, or delete)
    if (inB === inL && (!inB || stableDeepEqual(bVal, lVal))) {
      if (inR) out[key] = rVal;
      continue;
    }

    // Both changed differently since Base:
    // If one side deleted while the other side actively modified, preserve the active edit.
    if (!inR && inL) {
      out[key] = lVal;
      continue;
    }
    if (inR && !inL) {
      out[key] = rVal;
      continue;
    }

    out[key] = mergeValuesThreeWay(bVal, rVal, lVal, fileName, preferLocal);
  }
  return out;
}

function mergeArraysThreeWay(baseArr, remoteArr, localArr, fileName = '', preferLocalOnTie = true) {
  const bArr = Array.isArray(baseArr) ? baseArr : [];
  const rArr = Array.isArray(remoteArr) ? remoteArr : [];
  const lArr = Array.isArray(localArr) ? localArr : [];

  const bMap = indexUniqueKeyedArray(bArr, fileName);
  const rMap = indexUniqueKeyedArray(rArr, fileName);
  const lMap = indexUniqueKeyedArray(lArr, fileName);

  if (!bMap || !rMap || !lMap) {
    if (stableDeepEqual(bArr, rArr)) return lArr;
    if (stableDeepEqual(bArr, lArr)) return rArr;
    return preferLocalOnTie ? lArr : rArr;
  }

  const orderedKeys = new Set([
    ...rMap.keys(),
    ...lMap.keys(),
    ...bMap.keys()
  ]);

  const merged = [];
  for (const key of orderedKeys) {
    const inB = bMap.has(key);
    const inR = rMap.has(key);
    const inL = lMap.has(key);

    if (!inR && !inL) continue;

    const bVal = bMap.get(key);
    const rVal = rMap.get(key);
    const lVal = lMap.get(key);

    if (inR && inL && stableDeepEqual(rVal, lVal)) {
      merged.push(lVal);
      continue;
    }
    if (inB === inR && (!inB || stableDeepEqual(bVal, rVal))) {
      if (inL) merged.push(lVal);
      continue;
    }
    if (inB === inL && (!inB || stableDeepEqual(bVal, lVal))) {
      if (inR) merged.push(rVal);
      continue;
    }
    if (!inR && inL) {
      merged.push(lVal);
      continue;
    }
    if (inR && !inL) {
      merged.push(rVal);
      continue;
    }
    merged.push(mergeValuesThreeWay(bVal, rVal, lVal, fileName, preferLocalOnTie));
  }

  // Secondary uniqueness invariant for users.json (prevent concurrent duplicate email registration
  // while preserving any service/non-email entries verbatim)
  if (fileName === 'users.json') {
    const byEmail = new Map();
    const passthrough = [];
    for (const user of merged) {
      if (!isPlainObject(user) || !user.email) {
        passthrough.push(user);
        continue;
      }
      const emailKey = String(user.email).toLowerCase();
      if (!byEmail.has(emailKey)) {
        byEmail.set(emailKey, user);
      } else {
        const existing = byEmail.get(emailKey);
        const existingCreated = Date.parse(existing.created_at || '') || Number.MAX_SAFE_INTEGER;
        const candidateCreated = Date.parse(user.created_at || '') || Number.MAX_SAFE_INTEGER;
        if (candidateCreated < existingCreated) {
          byEmail.set(emailKey, user);
        }
      }
    }
    if (byEmail.size > 0) return [...byEmail.values(), ...passthrough];
  }

  return merged;
}

function threeWayMergeJsonState(baseParsed, remoteParsed, localParsed, fileName = '') {
  return mergeValuesThreeWay(baseParsed, remoteParsed, localParsed, fileName, true);
}

// ============================================================================
// OAuth2 Token & GCS JSON v1 Transport (Generation-Pinned + CAS Preconditions)
// ============================================================================

async function getAccessToken() {
  if (process.env.SCOREX_GCS_ACCESS_TOKEN) {
    return process.env.SCOREX_GCS_ACCESS_TOKEN.trim();
  }
  const now = Date.now();
  if (cachedToken && now < cachedTokenExpiresAtMs - 60_000) {
    return cachedToken;
  }

  // 1. Cloud Run / GCE Metadata Server (0ms local link-local hop)
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2500);
    const resp = await fetch(METADATA_TOKEN_URL, {
      headers: { 'Metadata-Flavor': 'Google' },
      signal: controller.signal
    });
    clearTimeout(timer);
    if (resp.ok) {
      const body = await resp.json();
      if (body && body.access_token) {
        cachedToken = body.access_token;
        cachedTokenExpiresAtMs = now + (Number(body.expires_in) || 3000) * 1000;
        return cachedToken;
      }
    }
  } catch (_) {
    // Fall through to local gcloud CLI if running outside GCE/Cloud Run
  }

  // 2. Non-blocking async local developer workstation fallback via gcloud CLI
  try {
    const { stdout } = await execFileAsync('gcloud', ['auth', 'print-access-token'], {
      encoding: 'utf8',
      timeout: 5000
    });
    const cliToken = String(stdout || '').trim();
    if (cliToken) {
      cachedToken = cliToken;
      cachedTokenExpiresAtMs = now + 45 * 60 * 1000;
      return cliToken;
    }
  } catch (err) {
    const wrapped = new Error(`Unable to acquire GCS OAuth2 token from metadata server or gcloud: ${err.message}`);
    telemetry.lastError = wrapped.message;
    throw wrapped;
  }

  const emptyErr = new Error('Empty OAuth2 access token returned for GCS durable state sync');
  telemetry.lastError = emptyErr.message;
  throw emptyErr;
}

function getHeaderValue(resp, headerName) {
  if (!resp || !resp.headers) return null;
  if (typeof resp.headers.get === 'function') {
    return resp.headers.get(headerName);
  }
  const lower = headerName.toLowerCase();
  for (const [k, v] of Object.entries(resp.headers)) {
    if (String(k).toLowerCase() === lower) return v;
  }
  return null;
}

async function listAllPrefixObjects(encodedBucket, listPrefix, token) {
  const allItems = [];
  let pageToken = '';
  for (let page = 0; page < 20; page++) {
    const tokenParam = pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : '';
    const listUrl =
      `https://storage.googleapis.com/storage/v1/b/${encodedBucket}/o` +
      `?prefix=${encodeURIComponent(listPrefix)}&maxResults=200` +
      `&fields=${encodeURIComponent('items(name,size,generation,updated),nextPageToken')}${tokenParam}`;
    const listResp = await fetch(listUrl, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!listResp.ok) {
      const errBody = await listResp.text().catch(() => '');
      throw new Error(`GCS list HTTP ${listResp.status}: ${errBody.slice(0, 200)}`);
    }
    const listJson = await listResp.json();
    if (Array.isArray(listJson.items)) {
      allItems.push(...listJson.items);
    }
    if (!listJson.nextPageToken) break;
    pageToken = listJson.nextPageToken;
  }
  return allItems;
}

async function fetchRemoteObjectSnapshot(bucket, objectName, token, pinnedGeneration = null) {
  const encodedBucket = encodeURIComponent(bucket);
  const encodedObject = encodeURIComponent(objectName);
  let targetGen = pinnedGeneration ? String(pinnedGeneration) : null;

  if (!targetGen) {
    const metaUrl = `https://storage.googleapis.com/storage/v1/b/${encodedBucket}/o/${encodedObject}`;
    const metaResp = await fetch(metaUrl, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (metaResp.status === 404) {
      return { exists: false, generation: '0', rawText: null, parsed: null };
    }
    if (metaResp.ok && typeof metaResp.json === 'function') {
      const metaBody = await metaResp.json().catch(() => null);
      if (metaBody && metaBody.generation) {
        targetGen = String(metaBody.generation);
      }
    }
  }

  const genQuery = targetGen ? `&generation=${encodeURIComponent(targetGen)}` : '';
  const mediaUrl = `https://storage.googleapis.com/storage/v1/b/${encodedBucket}/o/${encodedObject}?alt=media${genQuery}`;
  const mediaResp = await fetch(mediaUrl, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (mediaResp.status === 404) {
    return { exists: false, generation: '0', rawText: null, parsed: null };
  }
  if (!mediaResp.ok) {
    throw new Error(`GCS download HTTP ${mediaResp.status} for ${objectName}`);
  }
  const headerGen = getHeaderValue(mediaResp, 'x-goog-generation');
  const resolvedGen = String(targetGen || headerGen || '1');
  const rawText = await mediaResp.text();
  const parsed = JSON.parse(rawText);
  return { exists: true, generation: resolvedGen, rawText, parsed };
}

async function casUploadWithMerge(bucket, objectName, canonicalPath, initialPayloadString) {
  const fileName = path.basename(canonicalPath);
  const encodedBucket = encodeURIComponent(bucket);
  const encodedObject = encodeURIComponent(objectName);

  let candidatePayload = initialPayloadString;
  let roundExpectedGen = knownGenerations.has(canonicalPath) ? knownGenerations.get(canonicalPath) : null;
  let roundBaseRaw = baseJsonByPath.has(canonicalPath) ? baseJsonByPath.get(canonicalPath) : null;
  const maxCasRounds = 8;

  for (let casRound = 0; casRound < maxCasRounds; casRound++) {
    let token;
    try {
      token = await getAccessToken();
    } catch (tokenErr) {
      telemetry.lastError = tokenErr.message;
      return false;
    }

    // If this file has no known remote generation yet (e.g. cold-start hydration was skipped or
    // transiently unreachable), probe GCS first so we NEVER issue an unguarded blind overwrite.
    if (roundExpectedGen === null) {
      try {
        const snap = await fetchRemoteObjectSnapshot(bucket, objectName, token);
        // Absorb any newer local burst mutation queued while fetchRemoteObjectSnapshot was in flight
        if (pendingPayloads.has(canonicalPath)) {
          candidatePayload = pendingPayloads.get(canonicalPath);
          pendingPayloads.delete(canonicalPath);
        }
        if (!snap.exists) {
          roundExpectedGen = '0';
          roundBaseRaw = '';
        } else {
          const localParsed = JSON.parse(candidatePayload);
          const emptyBase = Array.isArray(snap.parsed) ? [] : {};
          const mergedParsed = threeWayMergeJsonState(emptyBase, snap.parsed, localParsed, fileName);
          const mergedJson = JSON.stringify(mergedParsed, null, 2);
          if (!stableDeepEqual(mergedParsed, localParsed)) {
            writeAtomicLocalWithoutSyncTrigger(canonicalPath, mergedJson, mergedParsed);
          }
          if (stableDeepEqual(mergedParsed, snap.parsed)) {
            knownGenerations.set(canonicalPath, snap.generation);
            baseJsonByPath.set(canonicalPath, snap.rawText);
            if (!pendingPayloads.has(canonicalPath)) {
              dirtyUnsyncedPaths.delete(canonicalPath);
            }
            return true;
          }
          roundExpectedGen = snap.generation;
          roundBaseRaw = snap.rawText;
          candidatePayload = mergedJson;
        }
      } catch (probeErr) {
        telemetry.lastError = `GCS CAS probe error for ${objectName}: ${probeErr.message}`;
        return false;
      }
    }

    const expectedGen = roundExpectedGen || '0';
    const uploadUrl =
      `https://storage.googleapis.com/upload/storage/v1/b/${encodedBucket}/o` +
      `?uploadType=media&name=${encodedObject}&ifGenerationMatch=${encodeURIComponent(expectedGen)}`;

    // Inner transport retry loop ONLY for transient 5xx / 429 / network errors (412 breaks immediately)
    let uploadResp = null;
    let transportErr = null;
    const retryDelays = [150, 450, 1200];

    for (let attempt = 0; attempt <= retryDelays.length; attempt++) {
      try {
        token = await getAccessToken();
        uploadResp = await fetch(uploadUrl, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json; charset=utf-8'
          },
          body: candidatePayload
        });

        if (uploadResp.ok || uploadResp.status === 412) {
          transportErr = null;
          break;
        }

        const errText = await uploadResp.text().catch(() => '');
        transportErr = new Error(`GCS upload HTTP ${uploadResp.status} for ${objectName}: ${errText.slice(0, 200)}`);
        if (uploadResp.status === 401) {
          cachedToken = null;
          cachedTokenExpiresAtMs = 0;
        }
      } catch (err) {
        transportErr = err;
      }

      if (attempt < retryDelays.length) {
        await new Promise((r) => setTimeout(r, retryDelays[attempt]));
      }
    }

    if (transportErr) {
      // Leave `knownGenerations` / `baseJsonByPath` untouched at the last verified remote ancestor
      // and keep `dirtyUnsyncedPaths` set so subsequent `refreshChangedFilesFromGcs` 3-way merges
      // and re-schedules upload rather than clobbering dirty local state.
      telemetry.lastError = transportErr.message;
      console.warn(`⚠️ [ScoreX DurableGCS] Upload failed for ${objectName}: ${telemetry.lastError}`);
      return false;
    }

    if (uploadResp && uploadResp.ok) {
      let respMeta = null;
      if (typeof uploadResp.json === 'function') {
        respMeta = await uploadResp.json().catch(() => null);
      }
      const headerGen = getHeaderValue(uploadResp, 'x-goog-generation');
      const nextGen = String(
        (respMeta && respMeta.generation) ||
        headerGen ||
        (Number.isFinite(Number(expectedGen)) ? Number(expectedGen) + 1 : 1)
      );
      knownGenerations.set(canonicalPath, nextGen);
      baseJsonByPath.set(canonicalPath, candidatePayload);
      if (!pendingPayloads.has(canonicalPath)) {
        dirtyUnsyncedPaths.delete(canonicalPath);
      }
      telemetry.lastSyncAt = new Date().toISOString();
      telemetry.totalSyncedWrites += 1;
      telemetry.lastError = null;
      return true;
    }

    // HTTP 412 Precondition Failed: Peer Cloud Run instance updated this object concurrently!
    if (uploadResp && uploadResp.status === 412) {
      telemetry.casConflictsResolved += 1;
      try {
        const snap = await fetchRemoteObjectSnapshot(bucket, objectName, token);
        // Absorb any newer local burst mutation queued while our previous upload was in flight
        if (pendingPayloads.has(canonicalPath)) {
          candidatePayload = pendingPayloads.get(canonicalPath);
          pendingPayloads.delete(canonicalPath);
        }

        if (!snap.exists) {
          roundExpectedGen = '0';
          roundBaseRaw = '';
          continue;
        }

        const rawBase = roundBaseRaw !== null ? roundBaseRaw : baseJsonByPath.get(canonicalPath);
        let baseParsed;
        if (rawBase) {
          try {
            baseParsed = JSON.parse(rawBase);
          } catch (_) {
            baseParsed = Array.isArray(snap.parsed) ? [] : {};
          }
        } else {
          baseParsed = Array.isArray(snap.parsed) ? [] : {};
        }

        const localParsed = JSON.parse(candidatePayload);
        const mergedParsed = threeWayMergeJsonState(baseParsed, snap.parsed, localParsed, fileName);
        const mergedJson = JSON.stringify(mergedParsed, null, 2);

        // Persist merged peer + local state onto local disk & DataStore without re-triggering sync
        writeAtomicLocalWithoutSyncTrigger(canonicalPath, mergedJson, mergedParsed);

        if (stableDeepEqual(mergedParsed, snap.parsed)) {
          knownGenerations.set(canonicalPath, snap.generation);
          baseJsonByPath.set(canonicalPath, snap.rawText);
          if (!pendingPayloads.has(canonicalPath)) {
            dirtyUnsyncedPaths.delete(canonicalPath);
          }
          telemetry.lastSyncAt = new Date().toISOString();
          telemetry.lastError = null;
          return true;
        }

        // Advance ONLY the in-flight round target generation & base (do NOT mark `knownGenerations`
        // clean until `uploadResp.ok` succeeds on the next CAS round!)
        roundExpectedGen = snap.generation;
        roundBaseRaw = snap.rawText;
        candidatePayload = mergedJson;
        const jitterMs = 20 * (casRound + 1) + Math.floor(Math.random() * 20);
        await new Promise((r) => setTimeout(r, jitterMs));
        continue;
      } catch (mergeErr) {
        telemetry.lastError = `CAS 412 merge error for ${objectName}: ${mergeErr.message}`;
        console.warn(`⚠️ [ScoreX DurableGCS] ${telemetry.lastError}`);
        return false;
      }
    }
  }

  telemetry.lastError = `Exceeded ${maxCasRounds} CAS contention rounds for ${objectName}`;
  console.warn(`⚠️ [ScoreX DurableGCS] ${telemetry.lastError}`);
  return false;
}

async function hydrateDataDirFromGcs(targetDataDir = resolveDataDir()) {
  const cfg = getGcsConfig();
  telemetry.enabled = cfg.enabled;
  telemetry.bucket = cfg.bucket || null;
  telemetry.prefix = cfg.prefix || null;

  if (!cfg.enabled) {
    return { hydrated: false, reason: 'disabled' };
  }

  const resolvedDir = path.resolve(targetDataDir);
  fs.mkdirSync(resolvedDir, { recursive: true });

  let token;
  let items;
  try {
    token = await getAccessToken();
    const encodedBucket = encodeURIComponent(cfg.bucket);
    const listPrefix = `${cfg.prefix}/`;
    items = await listAllPrefixObjects(encodedBucket, listPrefix, token);
    telemetry.hydrationFailed = false;
  } catch (err) {
    telemetry.hydrationFailed = true;
    telemetry.lastError = err.message;
    throw err;
  }

  const listPrefix = `${cfg.prefix}/`;
  const remoteMap = new Map();
  for (const item of items) {
    if (!item || !item.name || !item.name.startsWith(listPrefix)) continue;
    const baseName = item.name.slice(listPrefix.length);
    if (MANAGED_STATE_FILES.has(baseName) && Number(item.size) > 0) {
      remoteMap.set(baseName, {
        objectName: item.name,
        generation: String(item.generation || '1')
      });
    }
  }

  const hydratedFiles = [];
  const seededFiles = [];

  await Promise.all(
    Array.from(MANAGED_STATE_FILES).map(async (fileName) => {
      const canonicalPath = path.resolve(resolvedDir, fileName);
      const remoteEntry = remoteMap.get(fileName);

      if (remoteEntry) {
        try {
          const snap = await fetchRemoteObjectSnapshot(
            cfg.bucket,
            remoteEntry.objectName,
            token,
            remoteEntry.generation
          );
          if (!snap.exists || snap.rawText === null) return;
          writeAtomicLocalWithoutSyncTrigger(canonicalPath, snap.rawText, snap.parsed);
          knownGenerations.set(canonicalPath, snap.generation);
          baseJsonByPath.set(canonicalPath, snap.rawText);
          dirtyUnsyncedPaths.delete(canonicalPath);
          hydratedFiles.push(fileName);
        } catch (dlOrParseErr) {
          telemetry.lastError = `Hydrate rejected ${fileName}: ${dlOrParseErr.message}`;
          console.warn(`⚠️ [ScoreX DurableGCS] Rejecting ${fileName}: ${dlOrParseErr.message}`);
        }
      } else if (SEEDABLE_CANONICAL_FILES.has(fileName) && fs.existsSync(canonicalPath)) {
        // Strict Security Invariant: ONLY canonical starter assessment/catalog files are seeded
        // from the container image onto GCS on cold start—NEVER sessions.json or users.json.
        try {
          const seedRaw = fs.readFileSync(canonicalPath, 'utf8');
          const seedParsed = JSON.parse(seedRaw);
          knownGenerations.set(canonicalPath, '0');
          baseJsonByPath.set(canonicalPath, Array.isArray(seedParsed) ? '[]' : '{}');
          dirtyUnsyncedPaths.add(canonicalPath);
          const ok = await casUploadWithMerge(cfg.bucket, `${listPrefix}${fileName}`, canonicalPath, seedRaw);
          if (ok) seededFiles.push(fileName);
        } catch (seedErr) {
          console.warn(`⚠️ [ScoreX DurableGCS] Could not seed ${fileName}: ${seedErr.message}`);
        }
      } else {
        // Unhydrated RUNTIME_ONLY_STATE_FILES: actively purge any baked local file on disk
        // so stale image layers can never leak credentials/sessions into runtime memory or GCS.
        if (RUNTIME_ONLY_STATE_FILES.has(fileName) && fs.existsSync(canonicalPath)) {
          try {
            fs.unlinkSync(canonicalPath);
          } catch (_) {
            // ignore
          }
        }
        knownGenerations.set(canonicalPath, '0');
        baseJsonByPath.set(canonicalPath, '');
        dirtyUnsyncedPaths.delete(canonicalPath);
      }
    })
  );

  lastRemotePollAtMs = Date.now();
  telemetry.hydratedAt = new Date().toISOString();
  telemetry.hydratedFiles = hydratedFiles.sort();
  telemetry.seededFiles = seededFiles.sort();

  console.log(
    `☁️  [ScoreX DurableGCS] gs://${cfg.bucket}/${cfg.prefix} ready — hydrated ${hydratedFiles.length} file(s), seeded ${seededFiles.length} file(s) [CAS + 3-Way Merge active]`
  );
  return {
    hydrated: true,
    bucket: cfg.bucket,
    prefix: cfg.prefix,
    hydratedFiles: telemetry.hydratedFiles,
    seededFiles: telemetry.seededFiles
  };
}

async function refreshChangedFilesFromGcs(options = {}) {
  const cfg = getGcsConfig();
  if (!cfg.enabled) return { refreshed: false, updatedFiles: [] };

  const force = Boolean(options.force);
  const maxStalenessMs = Number.isFinite(options.maxStalenessMs) ? options.maxStalenessMs : 1500;
  const now = Date.now();
  if (!force && now - lastRemotePollAtMs < maxStalenessMs) {
    if (inFlightRefreshPromise) return inFlightRefreshPromise;
    return { refreshed: false, cached: true, updatedFiles: [] };
  }

  if (inFlightRefreshPromise) {
    return inFlightRefreshPromise;
  }

  const targetDir = path.resolve(options.targetDataDir || resolveDataDir());

  inFlightRefreshPromise = (async () => {
    const updatedFiles = [];
    try {
      const token = await getAccessToken();
      const encodedBucket = encodeURIComponent(cfg.bucket);
      const listPrefix = `${cfg.prefix}/`;
      const items = await listAllPrefixObjects(encodedBucket, listPrefix, token);
      lastRemotePollAtMs = Date.now();

      const remoteByFile = new Map();
      const changedEntries = [];
      for (const item of items) {
        if (!item || !item.name || !item.name.startsWith(listPrefix)) continue;
        const fileName = item.name.slice(listPrefix.length);
        if (!MANAGED_STATE_FILES.has(fileName) || Number(item.size) <= 0) continue;
        const canonicalPath = path.resolve(targetDir, fileName);
        const remoteGen = String(item.generation || '1');
        remoteByFile.set(canonicalPath, { fileName, objectName: item.name, remoteGen });
        const localGen = knownGenerations.get(canonicalPath);
        if (localGen !== remoteGen) {
          // Skip files with an active writer worker or in-flight external read-modify-write
          if (
            activeWorkers.has(canonicalPath) ||
            pendingPayloads.has(canonicalPath) ||
            isPathReadModifyWriteLocked(canonicalPath)
          ) {
            continue;
          }
          changedEntries.push({ fileName, canonicalPath, objectName: item.name, remoteGen });
        }
      }

      if (changedEntries.length > 0) {
        await Promise.all(
          changedEntries.map(async ({ fileName, canonicalPath, objectName, remoteGen }) => {
            try {
              const snap = await fetchRemoteObjectSnapshot(cfg.bucket, objectName, token, remoteGen);
              if (!snap.exists || snap.rawText === null) return;
              if (
                activeWorkers.has(canonicalPath) ||
                pendingPayloads.has(canonicalPath) ||
                isPathReadModifyWriteLocked(canonicalPath)
              ) {
                return;
              }

              // Dirty-State Protection: if a prior upload failed transiently (e.g. 503), NEVER
              // blind-overwrite local unsynced mutations! 3-way merge against ancestor + peer
              // and re-schedule upload of the merged result.
              if (dirtyUnsyncedPaths.has(canonicalPath) && fs.existsSync(canonicalPath)) {
                const localRaw = fs.readFileSync(canonicalPath, 'utf8');
                const localParsed = JSON.parse(localRaw);
                const rawBase = baseJsonByPath.get(canonicalPath);
                let baseParsed;
                if (rawBase) {
                  try {
                    baseParsed = JSON.parse(rawBase);
                  } catch (_) {
                    baseParsed = Array.isArray(snap.parsed) ? [] : {};
                  }
                } else {
                  baseParsed = Array.isArray(snap.parsed) ? [] : {};
                }
                const mergedParsed = threeWayMergeJsonState(baseParsed, snap.parsed, localParsed, fileName);
                const mergedJson = JSON.stringify(mergedParsed, null, 2);
                writeAtomicLocalWithoutSyncTrigger(canonicalPath, mergedJson, mergedParsed);
                knownGenerations.set(canonicalPath, snap.generation);
                baseJsonByPath.set(canonicalPath, snap.rawText);
                telemetry.peerUpdatesApplied += 1;
                telemetry.lastRemoteRefreshAt = new Date().toISOString();
                updatedFiles.push(fileName);
                if (stableDeepEqual(mergedParsed, snap.parsed)) {
                  dirtyUnsyncedPaths.delete(canonicalPath);
                } else {
                  scheduleStateFileSync(canonicalPath, mergedJson);
                }
                return;
              }

              writeAtomicLocalWithoutSyncTrigger(canonicalPath, snap.rawText, snap.parsed);
              knownGenerations.set(canonicalPath, snap.generation);
              baseJsonByPath.set(canonicalPath, snap.rawText);
              telemetry.peerUpdatesApplied += 1;
              telemetry.lastRemoteRefreshAt = new Date().toISOString();
              updatedFiles.push(fileName);
            } catch (_) {
              // Fail closed: keep existing valid local file on transient download error
            }
          })
        );
      }

      // Self-heal any remaining dirty unsynced local files whose remote generation had not changed
      for (const dirtyPath of Array.from(dirtyUnsyncedPaths)) {
        if (
          !activeWorkers.has(dirtyPath) &&
          !pendingPayloads.has(dirtyPath) &&
          !isPathReadModifyWriteLocked(dirtyPath) &&
          fs.existsSync(dirtyPath)
        ) {
          scheduleStateFileSync(dirtyPath);
        }
      }

      return { refreshed: true, updatedFiles: updatedFiles.sort() };
    } catch (err) {
      telemetry.lastError = err.message;
      return { refreshed: false, error: err.message, updatedFiles: [] };
    } finally {
      inFlightRefreshPromise = null;
    }
  })();

  return inFlightRefreshPromise;
}

function createGcsFreshnessMiddleware(options = {}) {
  const readStalenessMs = Number.isFinite(options.readStalenessMs) ? options.readStalenessMs : 1500;
  const writeStalenessMs = Number.isFinite(options.writeStalenessMs) ? options.writeStalenessMs : 400;

  return function gcsFreshnessMiddleware(req, _res, next) {
    if (req.__scorexGcsRefreshed) return next();
    if (!isDurableGcsEnabled()) return next();
    if (!req.path || !req.path.startsWith('/api/') || req.path === '/api/health') {
      return next();
    }
    req.__scorexGcsRefreshed = true;
    const isMutating = req.method !== 'GET' && req.method !== 'HEAD' && req.method !== 'OPTIONS';
    const maxStalenessMs = isMutating ? writeStalenessMs : readStalenessMs;
    refreshChangedFilesFromGcs({ maxStalenessMs })
      .then(() => next())
      .catch(() => next());
  };
}

function scheduleStateFileSync(filePath, serializedJson) {
  const cfg = getGcsConfig();
  telemetry.enabled = cfg.enabled;
  telemetry.bucket = cfg.bucket || null;
  telemetry.prefix = cfg.prefix || null;
  if (!cfg.enabled || !filePath) return;

  const canonicalPath = path.resolve(filePath);
  const fileName = path.basename(canonicalPath);
  if (!MANAGED_STATE_FILES.has(fileName)) return;

  let payload = serializedJson;
  if (typeof payload !== 'string') {
    try {
      payload = fs.readFileSync(canonicalPath, 'utf8');
    } catch (_) {
      return;
    }
  }

  dirtyUnsyncedPaths.add(canonicalPath);
  pendingPayloads.set(canonicalPath, payload);
  if (activeWorkers.has(canonicalPath)) return;

  const workerPromise = (async () => {
    while (pendingPayloads.has(canonicalPath)) {
      const nextPayload = pendingPayloads.get(canonicalPath);
      pendingPayloads.delete(canonicalPath);
      await casUploadWithMerge(cfg.bucket, `${cfg.prefix}/${fileName}`, canonicalPath, nextPayload);
    }
  })().finally(() => {
    activeWorkers.delete(canonicalPath);
  });

  activeWorkers.set(canonicalPath, workerPromise);
}

async function flushAllPendingSyncs() {
  while (activeWorkers.size > 0) {
    await Promise.allSettled(Array.from(activeWorkers.values()));
  }
}

function resetDurableGcsRuntimeStateForTests() {
  pendingPayloads.clear();
  activeWorkers.clear();
  knownGenerations.clear();
  baseJsonByPath.clear();
  dirtyUnsyncedPaths.clear();
  activeReadModifyWrites.clear();
  lastRemotePollAtMs = 0;
  inFlightRefreshPromise = null;
}

function isPostgresConnected() {
  if (!process.env.DATABASE_URL) return false;
  try {
    const db = require('../db/connection');
    return Boolean(db && db.pool && db.schemaInitialized);
  } catch (_) {
    return false;
  }
}

function getDurablePersistenceStatus() {
  const cfg = getGcsConfig();
  const pgActive = isPostgresConnected();
  const mode =
    pgActive && cfg.enabled
      ? 'postgresql+gcs-cas-3way'
      : pgActive
      ? 'postgresql'
      : cfg.enabled
      ? 'gcs-cas-3way-merge'
      : 'local-ephemeral';

  return {
    enabled: cfg.enabled || pgActive,
    gcsEnabled: cfg.enabled,
    postgresConnected: pgActive,
    mode,
    concurrencyModel: cfg.enabled ? telemetry.concurrencyModel : pgActive ? 'postgresql-mvcc' : 'single-process',
    bucket: cfg.bucket || null,
    prefix: cfg.bucket ? cfg.prefix : null,
    hydratedAt: telemetry.hydratedAt,
    hydrationFailed: telemetry.hydrationFailed,
    hydratedFilesCount: telemetry.hydratedFiles.length,
    hydratedFiles: telemetry.hydratedFiles,
    seededFilesCount: telemetry.seededFiles.length,
    totalSyncedWrites: telemetry.totalSyncedWrites,
    casConflictsResolved: telemetry.casConflictsResolved,
    peerUpdatesApplied: telemetry.peerUpdatesApplied,
    dirtyUnsyncedCount: dirtyUnsyncedPaths.size,
    pendingUploadsCount: activeWorkers.size + pendingPayloads.size,
    lastSyncAt: telemetry.lastSyncAt,
    lastRemoteRefreshAt: telemetry.lastRemoteRefreshAt,
    lastError: telemetry.lastError
  };
}

module.exports = {
  SEEDABLE_CANONICAL_FILES,
  RUNTIME_ONLY_STATE_FILES,
  MANAGED_STATE_FILES,
  resolveDataDir,
  isDurableGcsEnabled,
  isPostgresConnected,
  beginExternalReadModifyWrite,
  endExternalReadModifyWrite,
  registerExternalFileSyncListener,
  threeWayMergeJsonState,
  hydrateDataDirFromGcs,
  refreshChangedFilesFromGcs,
  createGcsFreshnessMiddleware,
  scheduleStateFileSync,
  flushAllPendingSyncs,
  resetDurableGcsRuntimeStateForTests,
  getDurablePersistenceStatus
};
