const express = require('express');
const router = express.Router();
const euAiGeminiService = require('../services/euAiGeminiService');
const { requireAuth } = require('../middleware/auth');

// All AI and statutory assessment routes require authenticated session
router.use(requireAuth);

/**
 * POST /api/eu-ai-compliance/generate-synthesis
 * Generates an executive legal synthesis, statutory risk analysis,
 * enforcement timeline, and Annex IV technical file draft using Gemini 2.5 Flash.
 */
router.post('/generate-synthesis', async (req, res) => {
  try {
    const { meta, answers, evaluation } = req.body;
    const synthesis = await euAiGeminiService.generateLegalSynthesis(meta, answers, evaluation);
    res.json({
      success: true,
      synthesis
    });
  } catch (err) {
    console.error('Error generating EU AI legal synthesis:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to generate statutory legal synthesis: ' + err.message
    });
  }
});

/**
 * POST /api/eu-ai-compliance/generate-audio-briefing
 * Builds a 3-Act Director Script and synthesizes spoken audio via DeepMind Neural TTS.
 */
router.post('/generate-audio-briefing', async (req, res) => {
  try {
    const { meta, evaluation, synthesis, persona } = req.body;
    const { acts, fullText } = euAiGeminiService.buildAudioBriefingScript(meta, evaluation, synthesis);
    const audioResult = await euAiGeminiService.synthesizeAudioBriefing(fullText, persona || 'jonathan');

    res.json({
      success: true,
      acts,
      fullText,
      ...audioResult
    });
  } catch (err) {
    console.error('Error generating EU AI audio briefing:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to generate audio briefing: ' + err.message
    });
  }
});

/**
 * POST /api/eu-ai-compliance/copilot-chat (and /systems/:id/copilot alias)
 * In-workspace legal & MLOps regulatory copilot.
 */
router.post(['/copilot-chat', '/systems/:id/copilot'], async (req, res) => {
  try {
    const message = req.body?.message || req.body?.prompt || req.body?.query;
    const { conversationHistory, context } = req.body || {};
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }

    const result = await euAiGeminiService.copilotChat(message, conversationHistory, context);
    res.json({
      success: true,
      ...result
    });
  } catch (err) {
    console.error('Error in EU AI copilot chat:', err);
    res.status(500).json({
      success: false,
      error: 'Copilot query failed: ' + err.message
    });
  }
});

/**
 * POST /api/eu-ai-compliance/live-audit
 * Independent Multi-Model LLM Live API Audit ("Second-Opinion Statutory Cross-Examiner")
 * Verifies accuracy, completeness, statutory weight justification, and cross-question consistency.
 */
router.post('/live-audit', async (req, res) => {
  try {
    const { auditorModel, meta, answers, evaluation } = req.body;
    const auditReport = await euAiGeminiService.runIndependentLiveAudit(
      auditorModel || 'gemini-2.5-pro',
      meta || {},
      answers || {},
      evaluation || {}
    );
    res.json({
      success: true,
      auditReport
    });
  } catch (err) {
    console.error('Error running independent live LLM audit:', err);
    res.status(500).json({
      success: false,
      error: 'Independent LLM audit failed: ' + err.message
    });
  }
});

// In-memory + disk-backed dossier persistence for multi-stakeholder sharing
const fs = require('fs');
const path = require('path');
const BUNDLED_DOSSIERS_FILE = path.join(__dirname, '../../data/eu_ai_dossiers.json');

const db = require('../db/connection');
const { resolveDataDir, scheduleStateFileSync, isPostgresConnected } = require('../utils/durableGcsPersistence');

function getDossiersFile() {
  return path.join(resolveDataDir(), 'eu_ai_dossiers.json');
}

let pgEuHydrated = false;
async function hydrateEuFromPostgresIfConnected() {
  if (pgEuHydrated || !isPostgresConnected()) return;
  pgEuHydrated = true;
  try {
    const res = await db.query('SELECT id, dossier_payload FROM eu_ai_dossiers');
    if (res && Array.isArray(res.rows) && res.rows.length > 0) {
      const current = loadServerDossiers();
      let changed = false;
      for (const row of res.rows) {
        if (row.id && row.dossier_payload && !current[row.id]) {
          current[row.id] = row.dossier_payload;
          changed = true;
        }
      }
      if (changed) saveServerDossiers(current, { skipPostgres: true });
    }
  } catch (_) {}
}

function syncEuMapToPostgresAsync(dossiers, deletedId = null) {
  if (!isPostgresConnected()) return;
  Promise.resolve().then(async () => {
    try {
      if (deletedId) {
        await db.query('DELETE FROM eu_ai_dossiers WHERE id = $1', [deletedId]);
        return;
      }
      for (const [id, d] of Object.entries(dossiers || {})) {
        if (!d || typeof d !== 'object') continue;
        const sysName = d.meta?.systemName || d.systemName || null;
        await db.query(
          `INSERT INTO eu_ai_dossiers (id, system_name, dossier_payload, updated_at)
           VALUES ($1, $2, $3::jsonb, CURRENT_TIMESTAMP)
           ON CONFLICT (id) DO UPDATE SET
             system_name = EXCLUDED.system_name,
             dossier_payload = EXCLUDED.dossier_payload,
             updated_at = CURRENT_TIMESTAMP`,
          [id, sysName, JSON.stringify(d)]
        );
      }
    } catch (_) {}
  });
}

function buildDefaultEuAiSeed() {
  try {
    if (fs.existsSync(BUNDLED_DOSSIERS_FILE)) {
      const bundled = JSON.parse(fs.readFileSync(BUNDLED_DOSSIERS_FILE, 'utf8'));
      if (bundled && Object.keys(bundled).length > 0) {
        return bundled;
      }
    }
  } catch (_) {}
  return {
    'EUAIA-2026-HR4902': {
      id: 'EUAIA-2026-HR4902',
      meta: {
        systemName: 'ApexHire AI Candidate Screening & Scoring Engine',
        version: 'v2.4.1-prod',
        leadEvaluator: 'Helena Vance, Lead AI Compliance Counsel & MLOps Architect',
        department: 'Global Talent Acquisition & People Analytics',
        evaluationDate: '2026-10-05',
        documentId: 'EUAIA-2026-HR4902'
      },
      answers: {
        q1: { level1OptionId: '1.1', level2OptionId: '1.1.1', notes: 'Deployed using third-party vendor strictly within documented parameters.' },
        q2: { level1OptionId: '2.1', level2OptionId: '2.1.1', notes: 'Underlying model is Google Gemini 3.1 Pro on Vertex AI (EU Frankfurt region).' },
        q3: { level1OptionId: '3.1', level2OptionId: '3.1.1', notes: 'Completed mandatory 4-hour training for all 18 recruiters and talent leads.' },
        q4: { level1OptionId: '4.1', level2OptionId: '4.1.1', notes: 'Zero facial emotion detection, zero voice pitch stress analysis, zero biometric categorization.' },
        q5: { level1OptionId: '5.1', level2OptionId: '5.1.1', notes: 'Formally classified under Annex III, Item 4(a).' },
        q6: { level1OptionId: '6.1', level2OptionId: '6.1.1', notes: 'Article 6(3) narrow derogations are statutorily blocked due to GDPR profiling.' },
        q7: { level1OptionId: '7.2', level2OptionId: '7.2.1', notes: 'Vendor training data is documented; runtime schema sanitization in progress.' },
        q8: { level1OptionId: '8.2', level2OptionId: '8.2.1', notes: 'Adverse impact disparate ratio testing is underway across synthetic demographic cohorts.' },
        q9: { level1OptionId: '9.2', level2OptionId: '9.2.2', notes: 'Inference logs retained in Google Cloud Logging / BigQuery; extending to 6-month GCS WORM.' },
        q10: { level1OptionId: '10.1', level2OptionId: '10.1.1', notes: 'Comprehensive Annex IV technical dossier compiled with system architecture and model cards.' },
        q11: { level1OptionId: '11.2', level2OptionId: '11.2.1', notes: 'Cloud Armor WAF and TLS 1.3 in place; Model Armor red-teaming scheduled.' },
        q12: { level1OptionId: '12.1', level2OptionId: '12.1.2', notes: 'Human-in-the-loop enforced: Recruiters must actively review and approve recommendations.' },
        q13: { level1OptionId: '13.1', level2OptionId: '13.1.2', notes: 'Recruiter UI displays confidence percentages, key CV positive drivers, and gaps.' },
        q14: { level1OptionId: '14.1', level2OptionId: '14.1.1', notes: 'Automated plain-language summary of assessment criteria delivered via candidate portal.' },
        q15: { level1OptionId: '15.2', level2OptionId: '15.2.1', notes: 'Workplace consultation dossier submitted to European Works Council.' },
        q16: { level1OptionId: '16.3', level2OptionId: '16.3.2', notes: 'Private enterprise; GDPR DPIA completed and reviewed by external DPO.' },
        q17: { level1OptionId: '17.2', level2OptionId: '17.2.1', notes: 'Annex VIII registration submission template prepared for EU Central Database.' },
        q18: { level1OptionId: '18.1', level2OptionId: '18.1.1', notes: 'Candidate portal clearly displays AI assistant disclosure notice.' },
        q19: { level1OptionId: '19.2', level2OptionId: '19.2.1', notes: 'All candidate communication templates undergo mandatory human editorial review.' },
        q20: { level1OptionId: '20.1', level2OptionId: '20.1.2', notes: 'Telemetry dashboard monitors candidate score distribution drift with 15-day authority SLA.' }
      },
      taskStatusOverrides: {},
      synthesis: null,
      financialConfig: { globalTurnoverMillions: 2500, isSme: false, includeConcurrentGdprNis2: true },
      updatedAt: new Date().toISOString()
    }
  };
}

function loadServerDossiers() {
  hydrateEuFromPostgresIfConnected();
  const dossiersFile = getDossiersFile();
  try {
    if (fs.existsSync(dossiersFile)) {
      const parsed = JSON.parse(fs.readFileSync(dossiersFile, 'utf8'));
      if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Could not read eu_ai_dossiers.json:', e.message);
  }
  const seeded = buildDefaultEuAiSeed();
  saveServerDossiers(seeded);
  return seeded;
}

function saveServerDossiers(dossiers, options = {}) {
  try {
    const dossiersFile = getDossiersFile();
    const dir = path.dirname(dossiersFile);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const serialized = JSON.stringify(dossiers, null, 2);
    const tmpFile = `${dossiersFile}.${process.pid}.${Date.now()}.sync.tmp`;
    fs.writeFileSync(tmpFile, serialized, 'utf8');
    fs.renameSync(tmpFile, dossiersFile);
    scheduleStateFileSync(dossiersFile, serialized);
    if (!options.skipPostgres) {
      syncEuMapToPostgresAsync(dossiers, options.deletedId || null);
    }
  } catch (e) {
    console.warn('Could not write eu_ai_dossiers.json:', e.message);
  }
}

/**
 * GET /api/eu-ai-compliance/dossiers (and /catalog alias)
 * List all saved EU AI Act compliance dossiers for My Assessments & Portfolio views.
 */
router.get(['/dossiers', '/catalog'], (req, res) => {
  try {
    const dossiers = loadServerDossiers();
    const list = Object.values(dossiers);
    return res.json({
      success: true,
      count: list.length,
      dossiers: list,
      statutoryChapters: [
        { id: 'art-5', title: 'Article 5 — Prohibited AI Practices Screening', weight: 20 },
        { id: 'art-6', title: 'Article 6 & Annex III — High-Risk Classification', weight: 15 },
        { id: 'art-9-15', title: 'Articles 9–15 — High-Risk Provider Obligations & Technical File', weight: 30 },
        { id: 'art-50', title: 'Article 50 — Transparency & Watermarking Obligations', weight: 10 },
        { id: 'art-51-55', title: 'Articles 51–55 — GPAI & Systemic Risk Models', weight: 15 },
        { id: 'annex-iv', title: 'Annex IV — Conformity Assessment & EU Declaration', weight: 10 }
      ]
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/eu-ai-compliance/dossiers/:id
 * Retrieve a saved EU AI Act compliance dossier by its unique Dossier ID.
 */
router.get('/dossiers/:id', (req, res) => {
  try {
    const id = String(req.params.id || '').trim();
    const normId = id.toLowerCase();
    const dossiers = loadServerDossiers();
    const matched =
      dossiers[id] ||
      dossiers[id.toUpperCase()] ||
      ((normId === 'default' || normId === 'eu_ai_default_instance' || normId === 'euaia-2026-hr4902')
        ? dossiers['EUAIA-2026-HR4902']
        : null);
    if (matched) {
      return res.json({ success: true, dossier: matched });
    }
    return res.status(404).json({ success: false, error: 'Dossier not found on server' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/eu-ai-compliance/dossiers/:id
 * Save/update an EU AI Act compliance dossier on the server (non-destructive merge).
 */
router.post('/dossiers/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { meta, answers, taskStatusOverrides, synthesis, financialConfig } = req.body;
    const dossiers = loadServerDossiers();
    const existing = dossiers[id] || {};
    dossiers[id] = {
      ...existing,
      id,
      meta: meta !== undefined ? { ...(existing.meta || {}), ...meta } : (existing.meta || {}),
      answers: answers !== undefined ? { ...(existing.answers || {}), ...answers } : (existing.answers || {}),
      taskStatusOverrides: taskStatusOverrides !== undefined ? { ...(existing.taskStatusOverrides || {}), ...taskStatusOverrides } : (existing.taskStatusOverrides || {}),
      synthesis: synthesis !== undefined ? synthesis : (existing.synthesis || null),
      financialConfig: financialConfig !== undefined ? financialConfig : (existing.financialConfig || null),
      updatedAt: new Date().toISOString()
    };
    saveServerDossiers(dossiers);
    return res.json({ success: true, dossier: dossiers[id] });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * DELETE /api/eu-ai-compliance/dossiers/:id
 * Delete an EU AI Act compliance dossier from the server.
 */
router.delete('/dossiers/:id', (req, res) => {
  try {
    const { id } = req.params;
    if (String(id || '').toUpperCase() === 'EUAIA-2026-HR4902') {
      return res.status(403).json({ success: false, error: 'Canonical EU AI Act starter dossier cannot be deleted.' });
    }
    const dossiers = loadServerDossiers();
    if (dossiers[id]) {
      delete dossiers[id];
      saveServerDossiers(dossiers, { deletedId: id });
    }
    return res.json({ success: true, message: 'Dossier deleted successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
