/**
 * Durable Google Cloud Storage Write-Through & Cold-Start Hydration Engine
 *
 * Solves Cloud Run ephemeral container filesystem resets across scale-to-zero,
 * instance recycling, and revision rollouts without sacrificing 0ms synchronous
 * local POSIX atomic writes (.sync.tmp -> fs.renameSync).
 *
 * Architecture:
 * 1. Canonical DATA_DIR Resolution (`resolveDataDir`):
 *    Single shared directory resolver honoring `process.env.DATA_DIR` across all
 *    5 assessment subsystems, instance versions, feedback, custom questions, and auth stores.
 * 2. Cold-Start Pre-Boot Hydration (`hydrateDataDirFromGcs`):
 *    Runs BEFORE `require('./indexCore')` constructs any `DataStore` or repository.
 *    Paginates through `gs://<SCOREX_GCS_STATE_BUCKET>/<PREFIX>/*.json`, hydrates durable
 *    files atomically (failing closed if any object fails JSON validation), and seeds
 *    ONLY canonical starter assessment stores (`SEEDABLE_CANONICAL_FILES`)—never local
 *    `sessions.json` / `users.json` (`RUNTIME_ONLY_STATE_FILES`).
 * 3. Coalesced Asynchronous Write-Through (`scheduleStateFileSync`) + Unhydrated Merge Guard:
 *    Triggered immediately after every local `.sync.tmp` rename. Coalesces bursts per
 *    filename with 3x retry + exponential backoff, and guards against overwriting remote
 *    GCS state if cold-start hydration transiently failed.
 * 4. Immediate Parallel SIGTERM Drain (`flushAllPendingSyncs`):
 *    Flushes all in-flight and queued GCS uploads immediately on SIGTERM without waiting
 *    for idle HTTP keep-alive sockets to close.
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

const pendingPayloads = new Map();
const activeWorkers = new Map();
const hydratedOrVerifiedFiles = new Set();

const telemetry = {
  enabled: false,
  bucket: null,
  prefix: null,
  hydratedAt: null,
  hydrationFailed: false,
  hydratedFiles: [],
  seededFiles: [],
  lastSyncAt: null,
  totalSyncedWrites: 0,
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

async function mergeWithRemoteIfUnhydrated(bucket, objectName, fileName, localJsonString) {
  if (!telemetry.hydrationFailed || hydratedOrVerifiedFiles.has(fileName)) {
    return localJsonString;
  }
  try {
    const token = await getAccessToken();
    const encodedBucket = encodeURIComponent(bucket);
    const mediaUrl = `https://storage.googleapis.com/storage/v1/b/${encodedBucket}/o/${encodeURIComponent(objectName)}?alt=media`;
    const resp = await fetch(mediaUrl, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (resp.status === 404) {
      hydratedOrVerifiedFiles.add(fileName);
      return localJsonString;
    }
    if (resp.ok) {
      const remoteRaw = await resp.text();
      const remoteParsed = JSON.parse(remoteRaw);
      const localParsed = JSON.parse(localJsonString);
      hydratedOrVerifiedFiles.add(fileName);
      if (
        remoteParsed &&
        localParsed &&
        typeof remoteParsed === 'object' &&
        typeof localParsed === 'object' &&
        !Array.isArray(remoteParsed) &&
        !Array.isArray(localParsed)
      ) {
        return JSON.stringify({ ...remoteParsed, ...localParsed }, null, 2);
      }
      if (Array.isArray(remoteParsed) && Array.isArray(localParsed)) {
        const byId = new Map();
        for (const item of remoteParsed) {
          if (item && item.id) byId.set(String(item.id), item);
        }
        for (const item of localParsed) {
          if (item && item.id) byId.set(String(item.id), item);
        }
        if (byId.size > 0) return JSON.stringify(Array.from(byId.values()), null, 2);
      }
    }
  } catch (_) {
    // Proceed with retry loop below
  }
  return localJsonString;
}

async function uploadObjectWithRetry(bucket, objectName, fileName, jsonString) {
  const payloadToUpload = await mergeWithRemoteIfUnhydrated(
    bucket,
    objectName,
    fileName,
    jsonString
  );
  const encodedBucket = encodeURIComponent(bucket);
  const encodedObject = encodeURIComponent(objectName);
  const url = `https://storage.googleapis.com/upload/storage/v1/b/${encodedBucket}/o?uploadType=media&name=${encodedObject}`;

  let lastErr = null;
  const delays = [200, 600, 1500];
  for (let attempt = 0; attempt <= delays.length; attempt++) {
    try {
      const token = await getAccessToken();
      const resp = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: payloadToUpload
      });
      if (resp.ok) {
        hydratedOrVerifiedFiles.add(fileName);
        telemetry.lastSyncAt = new Date().toISOString();
        telemetry.totalSyncedWrites += 1;
        telemetry.lastError = null;
        return true;
      }
      const errText = await resp.text().catch(() => '');
      lastErr = new Error(`GCS upload HTTP ${resp.status} for ${objectName}: ${errText.slice(0, 200)}`);
      if (resp.status === 401) {
        cachedToken = null;
        cachedTokenExpiresAtMs = 0;
      }
    } catch (err) {
      lastErr = err;
    }
    if (attempt < delays.length) {
      await new Promise((r) => setTimeout(r, delays[attempt]));
    }
  }
  telemetry.lastError = lastErr ? lastErr.message : 'Unknown GCS upload error';
  console.warn(`⚠️ [ScoreX DurableGCS] Upload failed for ${objectName}: ${telemetry.lastError}`);
  return false;
}

async function listAllPrefixObjects(encodedBucket, listPrefix, token) {
  const allItems = [];
  let pageToken = '';
  for (let page = 0; page < 20; page++) {
    const tokenParam = pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : '';
    const listUrl = `https://storage.googleapis.com/storage/v1/b/${encodedBucket}/o?prefix=${encodeURIComponent(listPrefix)}&maxResults=200${tokenParam}`;
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

async function hydrateDataDirFromGcs(targetDataDir = resolveDataDir()) {
  const cfg = getGcsConfig();
  telemetry.enabled = cfg.enabled;
  telemetry.bucket = cfg.bucket || null;
  telemetry.prefix = cfg.prefix || null;

  if (!cfg.enabled) {
    return { hydrated: false, reason: 'disabled' };
  }

  fs.mkdirSync(targetDataDir, { recursive: true });
  hydratedOrVerifiedFiles.clear();

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

  const encodedBucket = encodeURIComponent(cfg.bucket);
  const listPrefix = `${cfg.prefix}/`;
  const remoteMap = new Map();
  for (const item of items) {
    if (!item || !item.name || !item.name.startsWith(listPrefix)) continue;
    const baseName = item.name.slice(listPrefix.length);
    if (MANAGED_STATE_FILES.has(baseName) && Number(item.size) > 0) {
      remoteMap.set(baseName, item.name);
    }
  }

  const hydratedFiles = [];
  const seededFiles = [];

  await Promise.all(
    Array.from(MANAGED_STATE_FILES).map(async (fileName) => {
      const localPath = path.join(targetDataDir, fileName);
      const remoteObjectName = remoteMap.get(fileName);

      if (remoteObjectName) {
        const mediaUrl = `https://storage.googleapis.com/storage/v1/b/${encodedBucket}/o/${encodeURIComponent(remoteObjectName)}?alt=media`;
        const dlResp = await fetch(mediaUrl, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!dlResp.ok) {
          telemetry.lastError = `Hydrate download HTTP ${dlResp.status} for ${fileName}`;
          console.warn(`⚠️ [ScoreX DurableGCS] Skipping ${fileName} (HTTP ${dlResp.status})`);
          return;
        }
        const rawText = await dlResp.text();
        // Fail-closed JSON integrity check before overwriting local state file
        try {
          JSON.parse(rawText);
          const tmpHydratePath = `${localPath}.${process.pid}.gcs-hydrate.tmp`;
          fs.writeFileSync(tmpHydratePath, rawText, 'utf8');
          fs.renameSync(tmpHydratePath, localPath);
          hydratedFiles.push(fileName);
          hydratedOrVerifiedFiles.add(fileName);
        } catch (parseErr) {
          telemetry.lastError = `Corrupt JSON in remote ${remoteObjectName}: ${parseErr.message}`;
          console.warn(`⚠️ [ScoreX DurableGCS] Rejecting corrupt JSON for ${fileName}: ${parseErr.message}`);
        }
      } else if (SEEDABLE_CANONICAL_FILES.has(fileName) && fs.existsSync(localPath)) {
        // Strict Security Invariant: ONLY canonical starter assessment/catalog files are seeded
        // from the container image onto GCS on cold start—NEVER sessions.json or users.json.
        try {
          const seedRaw = fs.readFileSync(localPath, 'utf8');
          JSON.parse(seedRaw);
          const ok = await uploadObjectWithRetry(cfg.bucket, `${listPrefix}${fileName}`, fileName, seedRaw);
          if (ok) seededFiles.push(fileName);
        } catch (seedErr) {
          console.warn(`⚠️ [ScoreX DurableGCS] Could not seed ${fileName}: ${seedErr.message}`);
        }
      } else {
        hydratedOrVerifiedFiles.add(fileName);
      }
    })
  );

  telemetry.hydratedAt = new Date().toISOString();
  telemetry.hydratedFiles = hydratedFiles.sort();
  telemetry.seededFiles = seededFiles.sort();

  console.log(
    `☁️  [ScoreX DurableGCS] gs://${cfg.bucket}/${cfg.prefix} ready — hydrated ${hydratedFiles.length} file(s), seeded ${seededFiles.length} file(s)`
  );
  return {
    hydrated: true,
    bucket: cfg.bucket,
    prefix: cfg.prefix,
    hydratedFiles: telemetry.hydratedFiles,
    seededFiles: telemetry.seededFiles
  };
}

function scheduleStateFileSync(filePath, serializedJson) {
  const cfg = getGcsConfig();
  telemetry.enabled = cfg.enabled;
  telemetry.bucket = cfg.bucket || null;
  telemetry.prefix = cfg.prefix || null;
  if (!cfg.enabled || !filePath) return;

  const fileName = path.basename(filePath);
  if (!MANAGED_STATE_FILES.has(fileName)) return;

  let payload = serializedJson;
  if (typeof payload !== 'string') {
    try {
      payload = fs.readFileSync(filePath, 'utf8');
    } catch (_) {
      return;
    }
  }

  pendingPayloads.set(fileName, payload);
  if (activeWorkers.has(fileName)) return;

  const workerPromise = (async () => {
    while (pendingPayloads.has(fileName)) {
      const nextPayload = pendingPayloads.get(fileName);
      pendingPayloads.delete(fileName);
      await uploadObjectWithRetry(cfg.bucket, `${cfg.prefix}/${fileName}`, fileName, nextPayload);
    }
  })().finally(() => {
    activeWorkers.delete(fileName);
  });

  activeWorkers.set(fileName, workerPromise);
}

async function flushAllPendingSyncs() {
  while (activeWorkers.size > 0) {
    await Promise.allSettled(Array.from(activeWorkers.values()));
  }
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
      ? 'postgresql+gcs'
      : pgActive
      ? 'postgresql'
      : cfg.enabled
      ? 'gcs-write-through'
      : 'local-ephemeral';

  return {
    enabled: cfg.enabled || pgActive,
    gcsEnabled: cfg.enabled,
    postgresConnected: pgActive,
    mode,
    bucket: cfg.bucket || null,
    prefix: cfg.bucket ? cfg.prefix : null,
    hydratedAt: telemetry.hydratedAt,
    hydrationFailed: telemetry.hydrationFailed,
    hydratedFilesCount: telemetry.hydratedFiles.length,
    hydratedFiles: telemetry.hydratedFiles,
    seededFilesCount: telemetry.seededFiles.length,
    totalSyncedWrites: telemetry.totalSyncedWrites,
    pendingUploadsCount: activeWorkers.size + pendingPayloads.size,
    lastSyncAt: telemetry.lastSyncAt,
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
  hydrateDataDirFromGcs,
  scheduleStateFileSync,
  flushAllPendingSyncs,
  getDurablePersistenceStatus
};
