const express = require('express');
const router = express.Router();
const euAiGeminiService = require('../services/euAiGeminiService');
const { requireAuth } = require('../middleware/auth');

// All AI and statutory assessment routes require authenticated session
router.use(requireAuth);

/**
 * POST /api/eu-ai-compliance/generate-synthesis
 * Generates an executive legal synthesis, statutory risk analysis,
 * enforcement timeline, and Annex IV technical file draft using Gemini 3.7.
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
 * POST /api/eu-ai-compliance/copilot-chat
 * In-workspace legal & MLOps regulatory copilot.
 */
router.post('/copilot-chat', async (req, res) => {
  try {
    const { message, conversationHistory, context } = req.body;
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
const DOSSIERS_FILE = path.join(__dirname, '../../data/eu_ai_dossiers.json');

function loadServerDossiers() {
  try {
    if (fs.existsSync(DOSSIERS_FILE)) {
      return JSON.parse(fs.readFileSync(DOSSIERS_FILE, 'utf8'));
    }
  } catch (e) {
    console.warn('Could not read eu_ai_dossiers.json:', e.message);
  }
  return {};
}

function saveServerDossiers(dossiers) {
  try {
    const dir = path.dirname(DOSSIERS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DOSSIERS_FILE, JSON.stringify(dossiers, null, 2), 'utf8');
  } catch (e) {
    console.warn('Could not write eu_ai_dossiers.json:', e.message);
  }
}

/**
 * GET /api/eu-ai-compliance/dossiers/:id
 * Retrieve a saved EU AI Act compliance dossier by its unique Dossier ID.
 */
router.get('/dossiers/:id', (req, res) => {
  try {
    const { id } = req.params;
    const dossiers = loadServerDossiers();
    if (dossiers[id]) {
      return res.json({ success: true, dossier: dossiers[id] });
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

module.exports = router;
