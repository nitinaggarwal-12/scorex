const express = require('express');
const router = express.Router();
const audioNarrationService = require('../services/audioNarrationService');
const geminiService = require('../services/geminiService');

/**
 * 🎙️ Audio Narration API Routes
 */

// GET /api/audio/status
router.get('/status', (req, res) => {
  const googleAvailable = Boolean(geminiService.getApiKey());
  const elevenLabsAvailable = Boolean(process.env.ELEVENLABS_API_KEY);

  res.json({
    success: true,
    googleTTS: {
      available: googleAvailable,
      primaryModel: 'Google Cloud Journey (DeepMind 48kHz)'
    },
    elevenLabs: {
      available: elevenLabsAvailable,
      primaryModel: 'Eleven Multilingual v2'
    }
  });
});

// POST /api/audio/script - Generate 5-Act Director Script
router.post('/script', async (req, res) => {
  try {
    const { instance, report, style, persona } = req.body;
    const chapters = await audioNarrationService.buildDirectorScript(instance, report, style, persona);
    res.json({ success: true, chapters });
  } catch (err) {
    console.error('⚠️ Error generating audio script:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/audio/synthesize-act - Synthesize single act (for instant streaming)
router.post('/synthesize-act', async (req, res) => {
  try {
    const { chapter, persona, style, engine, customApiKey } = req.body;
    if (!chapter) {
      return res.status(400).json({ success: false, error: 'Chapter payload is required' });
    }

    const result = await audioNarrationService.synthesizeAct(chapter, persona, style, engine, customApiKey);
    res.json({ success: true, ...result });
  } catch (err) {
    console.error('⚠️ Error synthesizing audio act:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/audio/synthesize-all - Batch synthesize all acts with pre-fetching
router.post('/synthesize-all', async (req, res) => {
  try {
    const { instance, report, style, persona, engine, customApiKey } = req.body;
    const chapters = await audioNarrationService.buildDirectorScript(instance, report, style, persona);

    const synthesizedChapters = await Promise.all(
      chapters.map(chap => audioNarrationService.synthesizeAct(chap, persona, style, engine, customApiKey))
    );

    res.json({ success: true, chapters: synthesizedChapters });
  } catch (err) {
    console.error('⚠️ Error batch synthesizing audio:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
