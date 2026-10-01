const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const defaultDataDir = fs.existsSync(path.join(__dirname, '..', '..', 'data'))
  ? path.join(__dirname, '..', '..', 'data')
  : path.join(__dirname, '..', 'data');
const DATA_DIR = process.env.DATA_DIR || defaultDataDir;
const VERSIONS_FILE = path.join(DATA_DIR, 'instance_object_versions.json');

function loadVersionStore() {
  try {
    if (fs.existsSync(VERSIONS_FILE)) {
      const raw = fs.readFileSync(VERSIONS_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') return parsed;
    }
  } catch (err) {
    console.warn('[InstanceVersions] Could not read instance_object_versions.json:', err.message);
  }
  return {};
}

function saveVersionStore(store) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const tmpFile = `${VERSIONS_FILE}.${process.pid}.${Date.now()}.tmp`;
    fs.writeFileSync(tmpFile, JSON.stringify(store, null, 2), 'utf8');
    fs.renameSync(tmpFile, VERSIONS_FILE);
  } catch (err) {
    console.warn('[InstanceVersions] Could not write instance_object_versions.json:', err.message);
  }
}

function ensureInstanceRecord(store, instanceKey) {
  const cleanKey = String(instanceKey || 'default_instance').trim().slice(0, 180);
  if (!store[cleanKey]) {
    store[cleanKey] = {
      instanceKey: cleanKey,
      masterTemplateProtected: true,
      activeVersionId: 'v1.0',
      updatedAt: new Date().toISOString(),
      versions: [
        {
          versionId: 'v1.0',
          versionNumber: '1.0',
          label: 'v1.0 — Master Template Baseline (Immutable)',
          isMasterBaseline: true,
          createdAt: new Date().toISOString(),
          author: 'System Master Blueprint',
          summary: 'Original untouched master template state',
          state: {
            editedObjects: {},
            addedObjects: [],
            clonedObjects: [],
            deletedObjectIds: []
          }
        }
      ]
    };
  }
  return store[cleanKey];
}

/**
 * GET /api/instance-versions/:instanceKey
 * Returns the full version history and active version state for a specific assessment/report instance.
 */
router.get('/:instanceKey', (req, res) => {
  try {
    const store = loadVersionStore();
    const record = ensureInstanceRecord(store, req.params.instanceKey);
    const activeVersion =
      record.versions.find((v) => v.versionId === record.activeVersionId) ||
      record.versions[record.versions.length - 1];

    return res.json({
      success: true,
      instanceKey: record.instanceKey,
      masterTemplateProtected: true,
      activeVersionId: activeVersion.versionId,
      activeVersion,
      versions: record.versions
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/instance-versions/:instanceKey/commit
 * Commits an object-level edit, save, add, clone, or delete operation as a NEW version
 * on the target instance only, leaving the v1.0 Master Template untouched.
 */
router.post('/:instanceKey/commit', (req, res) => {
  try {
    const store = loadVersionStore();
    const record = ensureInstanceRecord(store, req.params.instanceKey);
    const {
      actionType = 'edit',
      objectId = '',
      objectType = 'Object',
      objectLabel = '',
      state = null,
      author = ''
    } = req.body || {};

    const latestVersion = record.versions[record.versions.length - 1];
    const nextMinor = record.versions.length; // v1.0 is index 0 -> next is v1.1, v1.2, etc.
    const nextVersionId = `v1.${nextMinor}`;

    const prevState = latestVersion?.state || {
      editedObjects: {},
      addedObjects: [],
      clonedObjects: [],
      deletedObjectIds: []
    };

    const nextState = state && typeof state === 'object'
      ? {
          editedObjects: state.editedObjects || prevState.editedObjects || {},
          addedObjects: Array.isArray(state.addedObjects) ? state.addedObjects : (prevState.addedObjects || []),
          clonedObjects: Array.isArray(state.clonedObjects) ? state.clonedObjects : (prevState.clonedObjects || []),
          deletedObjectIds: Array.isArray(state.deletedObjectIds) ? state.deletedObjectIds : (prevState.deletedObjectIds || [])
        }
      : { ...prevState };

    const actionVerbMap = {
      edit: 'Edited',
      save: 'Saved',
      add: 'Added item to',
      clone: 'Cloned',
      delete: 'Deleted',
      restore: 'Restored'
    };
    const verb = actionVerbMap[actionType] || 'Updated';
    const cleanLabel = String(objectLabel || objectType || objectId || 'Report Object')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 60);

    const newVersionEntry = {
      versionId: nextVersionId,
      versionNumber: `1.${nextMinor}`,
      label: `${nextVersionId} — ${verb} ${cleanLabel}`,
      isMasterBaseline: false,
      actionType,
      objectId,
      objectType,
      createdAt: new Date().toISOString(),
      author: author || req.user?.email || 'Instance Editor',
      summary: `${verb} ${objectType} (${cleanLabel}) on instance ${record.instanceKey} without modifying Master Template`,
      state: nextState
    };

    record.versions.push(newVersionEntry);
    record.activeVersionId = nextVersionId;
    record.updatedAt = new Date().toISOString();

    saveVersionStore(store);

    return res.json({
      success: true,
      message: `Saved as ${nextVersionId} on instance ${record.instanceKey} (Master Template unchanged)`,
      instanceKey: record.instanceKey,
      masterTemplateProtected: true,
      activeVersionId: record.activeVersionId,
      activeVersion: newVersionEntry,
      versions: record.versions
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/instance-versions/:instanceKey/select-version
 * Switches the active version for this instance (e.g. back to v1.0 Master Baseline or to v1.2).
 */
router.post('/:instanceKey/select-version', (req, res) => {
  try {
    const store = loadVersionStore();
    const record = ensureInstanceRecord(store, req.params.instanceKey);
    const { versionId } = req.body || {};

    const target = record.versions.find((v) => v.versionId === versionId);
    if (!target) {
      return res.status(404).json({ success: false, error: `Version ${versionId} not found` });
    }

    record.activeVersionId = target.versionId;
    record.updatedAt = new Date().toISOString();
    saveVersionStore(store);

    return res.json({
      success: true,
      instanceKey: record.instanceKey,
      activeVersionId: record.activeVersionId,
      activeVersion: target,
      versions: record.versions
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
