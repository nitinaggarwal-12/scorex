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

// POST /api/audio/podcast-script - Generate Dual-Speaker Co-Host Dialogue Script
router.post('/podcast-script', async (req, res) => {
  try {
    const { instance, report } = req.body;
    const turns = await audioNarrationService.buildPodcastDialogueScript(instance, report);
    res.json({ success: true, turns });
  } catch (err) {
    console.error('⚠️ Error generating podcast script:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/audio/synthesize-act - Synthesize single act (for instant streaming)
router.post('/synthesize-act', async (req, res) => {
  try {
    const { chapter, persona, style, engine, customApiKey, customVoiceId, sliderConfig } = req.body;
    if (!chapter) {
      return res.status(400).json({ success: false, error: 'Chapter payload is required' });
    }

    const result = await audioNarrationService.synthesizeAct(chapter, persona, style, engine, customApiKey, customVoiceId, sliderConfig);
    res.json({ success: true, ...result });
  } catch (err) {
    console.error('⚠️ Error synthesizing audio act:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/audio/clone-voice - Instant Voice Cloner from Mic / Audio File
router.post('/clone-voice', async (req, res) => {
  try {
    let audioBuffer = null;
    let voiceName = req.body.voiceName || 'Custom Executive Voice';
    let customApiKey = req.body.customApiKey || null;

    if (req.files && req.files.audioFile) {
      audioBuffer = req.files.audioFile.data;
    } else if (req.body.audioBase64) {
      audioBuffer = Buffer.from(req.body.audioBase64, 'base64');
    }

    if (!audioBuffer || audioBuffer.length === 0) {
      return res.status(400).json({ success: false, error: 'No audio data received for voice cloning' });
    }

    const voiceProfile = await audioNarrationService.cloneVoiceFromSample(audioBuffer, voiceName, customApiKey);
    res.json({ success: true, voiceProfile });
  } catch (err) {
    console.error('⚠️ Error in instant voice cloning:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/audio/export-mp3 - Download Stitched 5-Act MP3 Broadcast
router.post('/export-mp3', async (req, res) => {
  try {
    const { instance, report, style, persona, engine, customApiKey } = req.body;
    const mp3Buffer = await audioNarrationService.exportFullStitchedAudio(instance, report, style, persona, engine, customApiKey);

    const customerName = (instance?.customerName || 'ScoreX').replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `${customerName}_Executive_Audio_Briefing.mp3`;

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', mp3Buffer.length);
    res.send(mp3Buffer);
  } catch (err) {
    console.error('⚠️ Error exporting full audio briefing MP3:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
