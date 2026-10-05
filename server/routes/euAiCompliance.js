const express = require('express');
const router = express.Router();
const euAiGeminiService = require('../services/euAiGeminiService');
const { requireAuth } = require('../middleware/auth');

// All AI and statutory assessment routes require authenticated session
router.use(requireAuth);

/**
 * POST /api/eu-ai-compliance/generate-synthesis
 * Generates an executive legal synthesis, statutory risk analysis,
 * enforcement timeline, and Annex IV technical file draft using Gemini 3.8 Flash.
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
      auditorModel || 'google-omni-1.1',
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

function getDossiersFile() {
  const dataDir = process.env.DATA_DIR || path.join(__dirname, '../../data');
  return path.join(dataDir, 'eu_ai_dossiers.json');
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
        q1: { level1OptionId: '1.1', level2OptionId: '1.1.1', notes: 'Deployed within documented parameters.' },
        q5: { level1OptionId: '5.1', level2OptionId: '5.1.1', notes: 'Classified under Annex III, Item 4(a).' }
      },
      taskStatusOverrides: {},
      synthesis: null,
      financialConfig: { globalTurnoverMillions: 2500, isSme: false, includeConcurrentGdprNis2: true },
      updatedAt: new Date().toISOString()
    }
  };
}

function loadServerDossiers() {
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

function saveServerDossiers(dossiers) {
  try {
    const dossiersFile = getDossiersFile();
    const dir = path.dirname(dossiersFile);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(dossiersFile, JSON.stringify(dossiers, null, 2), 'utf8');
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
 * Save/update an EU AI Act compliance dossier on the server.
 */
router.post('/dossiers/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { meta, answers, taskStatusOverrides, synthesis, financialConfig } = req.body;
    const dossiers = loadServerDossiers();
    dossiers[id] = {
      id,
      meta: meta || {},
      answers: answers || {},
      taskStatusOverrides: taskStatusOverrides || {},
      synthesis: synthesis || null,
      financialConfig: financialConfig || null,
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
    const dossiers = loadServerDossiers();
    if (dossiers[id]) {
      delete dossiers[id];
      saveServerDossiers(dossiers);
    }
    return res.json({ success: true, message: 'Dossier deleted successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
