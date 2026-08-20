const express = require('express');
const fs = require('fs');
const router = express.Router();
const audioNarrationService = require('../services/audioNarrationService');
const geminiService = require('../services/geminiService');
const { requireAuth } = require('../middleware/auth');

/**
 * Audio Narration API Routes
 *
 * Audio generation consumes paid model capacity and voice cloning processes biometric-like
 * user content. Every endpoint requires an authenticated user or isolated demo session.
 */
router.use(requireAuth);

const rateBuckets = new Map();
function audioRateLimit(maxRequests = 10, windowMs = 60_000) {
  return (req, res, next) => {
    const identity = req.user?.id || req.ip || 'unknown';
    const now = Date.now();
    const recent = (rateBuckets.get(identity) || []).filter((ts) => now - ts < windowMs);

    if (recent.length >= maxRequests) {
      const retryAfter = Math.ceil((windowMs - (now - recent[0])) / 1000);
      res.setHeader('Retry-After', retryAfter);
      return res.status(429).json({
        success: false,
        error: 'Audio generation rate limit exceeded',
        retryAfter
      });
    }

    recent.push(now);
    rateBuckets.set(identity, recent);
    return next();
  };
}

const generationLimiter = audioRateLimit(12, 60_000);
const cloneLimiter = audioRateLimit(3, 10 * 60_000);

function safeAudioBufferFromRequest(req) {
  if (req.files?.audioFile) {
    const file = req.files.audioFile;
    const allowedTypes = new Set([
      'audio/mpeg',
      'audio/mp3',
      'audio/wav',
      'audio/x-wav',
      'audio/webm',
      'audio/mp4',
      'audio/m4a'
    ]);

    if (file.mimetype && !allowedTypes.has(file.mimetype)) {
      const error = new Error('Unsupported audio MIME type');
      error.status = 415;
      throw error;
    }
    return file.data;
  }

  if (req.body.audioBase64) {
    if (typeof req.body.audioBase64 !== 'string' || req.body.audioBase64.length > 14_000_000) {
      const error = new Error('Audio payload is too large');
      error.status = 413;
      throw error;
    }
    return Buffer.from(req.body.audioBase64, 'base64');
  }

  return null;
}

// GET /api/audio/status
router.get('/status', (req, res) => {
  const googleAvailable = Boolean(geminiService.getApiKey());
  const elevenLabsAvailable = Boolean(process.env.ELEVENLABS_API_KEY);

  res.json({
    success: true,
    googleTTS: {
      available: googleAvailable
    },
    elevenLabs: {
      available: elevenLabsAvailable
    }
  });
});

// POST /api/audio/script - Generate 5-Act Director Script
router.post('/script', generationLimiter, async (req, res) => {
  try {
    const { instance, report, style, persona } = req.body;
    const chapters = await audioNarrationService.buildDirectorScript(instance, report, style, persona);
    res.json({ success: true, chapters });
  } catch (err) {
    console.error('Error generating audio script:', err.message);
    res.status(500).json({ success: false, error: 'Failed to generate audio script' });
  }
});

// POST /api/audio/podcast-script - Generate Dual-Speaker Co-Host Dialogue Script
router.post('/podcast-script', generationLimiter, async (req, res) => {
  try {
    const { instance, report } = req.body;
    const turns = await audioNarrationService.buildPodcastDialogueScript(instance, report);
    res.json({ success: true, turns });
  } catch (err) {
    console.error('Error generating podcast script:', err.message);
    res.status(500).json({ success: false, error: 'Failed to generate podcast script' });
  }
});

// POST /api/audio/synthesize-act - Synthesize single act (for instant streaming)
router.post('/synthesize-act', generationLimiter, async (req, res) => {
  try {
    const { chapter, persona, style, engine, customVoiceId, sliderConfig, language } = req.body;
    if (!chapter) {
      return res.status(400).json({ success: false, error: 'Chapter payload is required' });
    }

    const result = await audioNarrationService.synthesizeAct(
      chapter,
      persona,
      style,
      engine,
      null, // Never accept provider API keys from request bodies.
      customVoiceId,
      sliderConfig,
      language || 'en'
    );
    res.json({ success: true, ...result });
  } catch (err) {
    console.error('Error synthesizing audio act:', err.message);
    res.status(500).json({ success: false, error: 'Failed to synthesize audio' });
  }
});

// POST /api/audio/clone-voice - Instant Voice Cloner from Mic / Audio File
router.post('/clone-voice', cloneLimiter, async (req, res) => {
  let voiceProfile = null;
  try {
    if (req.body?.consent !== true && req.body?.consent !== 'true') {
      return res.status(400).json({
        success: false,
        error: 'Explicit voice-processing consent is required'
      });
    }

    const audioBuffer = safeAudioBufferFromRequest(req);
    const voiceName = String(req.body.voiceName || 'Custom Executive Voice').slice(0, 120);

    if (!audioBuffer || audioBuffer.length === 0) {
      return res.status(400).json({ success: false, error: 'No audio data received for voice cloning' });
    }

    // Keep voice samples intentionally small to minimize sensitive-data exposure.
    if (audioBuffer.length > 10 * 1024 * 1024) {
      return res.status(413).json({ success: false, error: 'Audio sample exceeds 10 MB limit' });
    }

    voiceProfile = await audioNarrationService.cloneVoiceFromSample(
      audioBuffer,
      voiceName,
      null // Provider credentials must come only from server-side environment variables.
    );

    // The uploaded source sample is not retained after the clone/profile operation.
    if (voiceProfile?.samplePath) {
      try {
        if (fs.existsSync(voiceProfile.samplePath)) {
          fs.unlinkSync(voiceProfile.samplePath);
        }
      } catch (cleanupError) {
        console.warn('Could not remove temporary voice sample:', cleanupError.message);
      }
      delete voiceProfile.samplePath;
    }

    res.json({ success: true, voiceProfile });
  } catch (err) {
    console.error('Error in instant voice cloning:', err.message);
    res.status(err.status || 500).json({
      success: false,
      error: err.status ? err.message : 'Voice processing failed'
    });
  }
});

// GET /api/audio/voice-catalog - Get Procedural Voice Matrix Catalog
router.get('/voice-catalog', (req, res) => {
  try {
    const catalog = audioNarrationService.getProceduralVoiceCatalog();
    res.json({
      success: true,
      totalVoices: catalog.length,
      accents: audioNarrationService.globalAccents,
      archetypes: audioNarrationService.archetypes,
      ageTiers: audioNarrationService.ageTiers,
      bases: Object.keys(audioNarrationService.neuralBases),
      sampleVoices: catalog.slice(0, 100)
    });
  } catch (err) {
    console.error('Error fetching procedural voice catalog:', err.message);
    res.status(500).json({ success: false, error: 'Failed to fetch voice catalog' });
  }
});

// POST /api/audio/custom-voice-design - Prompt-to-Voice Custom AI Voice Designer
router.post('/custom-voice-design', generationLimiter, async (req, res) => {
  try {
    const { prompt, name } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ success: false, error: 'Voice description prompt is required' });
    }
    if (prompt.length > 2_000) {
      return res.status(413).json({ success: false, error: 'Voice description is too long' });
    }

    const voiceProfile = await audioNarrationService.designCustomVoiceFromPrompt(prompt, name);
    res.json({ success: true, voiceProfile });
  } catch (err) {
    console.error('Error designing custom voice from prompt:', err.message);
    res.status(500).json({ success: false, error: 'Failed to design custom voice' });
  }
});

// POST /api/audio/export-mp3 - Download Stitched 5-Act MP3 Broadcast
router.post('/export-mp3', generationLimiter, async (req, res) => {
  try {
    const { instance, report, style, persona, engine, customVoiceId, sliderConfig, language } = req.body;
    const mp3Buffer = await audioNarrationService.exportFullStitchedAudio(
      instance,
      report,
      style,
      persona,
      engine,
      null, // Never accept provider API keys from request bodies.
      customVoiceId,
      sliderConfig,
      language || 'en'
    );

    const customerName = (instance?.customerName || 'ScoreX').replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `${customerName}_Executive_Audio_Briefing_${language || 'en'}.mp3`;

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', mp3Buffer.length);
    res.send(mp3Buffer);
  } catch (err) {
    console.error('Error exporting full audio briefing:', err.message);
    res.status(500).json({ success: false, error: 'Failed to export audio briefing' });
  }
});

module.exports = router;
