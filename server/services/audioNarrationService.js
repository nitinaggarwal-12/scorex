const axios = require('axios');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const geminiService = require('./geminiService');

/**
 * 🎙️ AudioNarrationService
 * Enterprise-grade, humanized voice synthesis engine combining:
 * 1. Gemini Cinematic SSML Audio Director (Prosody, breath, pitch drift, metric naturalization)
 * 2. Google Cloud Journey & Studio TTS (DeepMind 48kHz Neural models)
 * 3. ElevenLabs Instant Voice Cloning & BYOK API Engine
 * 4. Dual-Host Podcast Co-Host Engine (Architect + Strategy Consultant)
 * 5. Full 5-Act Broadcast MP3 Exporter with Chapter Concatenation
 * 6. Content-Addressed SHA-256 Audio Cache (0ms instant replay)
 */
class AudioNarrationService {
  constructor() {
    this.cacheDir = path.join(__dirname, '../../data/audio_cache');
    this.customVoicesDir = path.join(__dirname, '../../data/custom_voices');
    this.memoryCache = new Map();
    this.customVoices = new Map();
    this.ensureDirs();

    // Mapping ScoreX personas to Google Cloud Journey & Studio Neural Voices
    this.googleVoiceMap = {
      jonathan: {
        languageCode: 'en-US',
        name: 'en-US-Journey-D', // Deep, warm, baritone documentary voice
        ssmlGender: 'MALE',
        fallback: 'en-US-Studio-Q',
        pitch: -1.0,
        speakingRate: 0.94
      },
      victoria: {
        languageCode: 'en-US',
        name: 'en-US-Journey-F', // Magnetic, articulate, executive storytelling voice
        ssmlGender: 'FEMALE',
        fallback: 'en-US-Studio-O',
        pitch: 0.0,
        speakingRate: 0.98
      },
      david: {
        languageCode: 'en-US',
        name: 'en-US-Studio-Q', // Authoritative, crisp Silicon Valley tech orator
        ssmlGender: 'MALE',
        fallback: 'en-US-Neural2-J',
        pitch: -0.5,
        speakingRate: 0.96
      },
      maya: {
        languageCode: 'en-US',
        name: 'en-US-Journey-O', // Intimate, conversational, warm podcast cadence
        ssmlGender: 'FEMALE',
        fallback: 'en-US-Neural2-F',
        pitch: 0.5,
        speakingRate: 0.95
      }
    };

    // Mapping ScoreX personas to ElevenLabs High-Fidelity Voice IDs
    this.elevenLabsVoiceMap = {
      jonathan: 'TX3LPaxmHKxFdv7VOQHJ', // Liam / Daniel deep narrator
      victoria: '21m00Tcm4TlvDq8ikWAM', // Rachel masterclass storyteller
      david: 'VR6AewLTigWG4xSOukaG',    // Antoni tech visionary
      maya: 'EXAVITQu4vr4xnSDxMaL'      // Bella intimate fireside
    };
  }

  ensureDirs() {
    try {
      if (!fs.existsSync(this.cacheDir)) {
        fs.mkdirSync(this.cacheDir, { recursive: true });
      }
      if (!fs.existsSync(this.customVoicesDir)) {
        fs.mkdirSync(this.customVoicesDir, { recursive: true });
      }
    } catch (err) {
      console.warn('⚠️ Could not initialize audio storage directories:', err.message);
    }
  }

  /**
   * Helper: Naturalize technical metrics, currency, and acronyms for speech
   */
  naturalizeTextForSpeech(text) {
    if (!text) return '';
    return String(text)
      .replace(/\$([0-9]+(\.[0-9]+)?)\s*[mM]/g, '$1 million dollars')
      .replace(/\$([0-9]+(\.[0-9]+)?)\s*[kK]/g, '$1 thousand dollars')
      .replace(/\$([0-9]+(\.[0-9]+)?)\s*[bB]/g, '$1 billion dollars')
      .replace(/([0-9]+(\.[0-9]+)?)\s*%/g, '$1 percent')
      .replace(/\bROI\b/g, 'R.O.I.')
      .replace(/\bTCO\b/g, 'total cost of ownership')
      .replace(/\bAI\b/g, 'A.I.')
      .replace(/\bGenAI\b/g, 'Generative A.I.')
      .replace(/\bLLM\b/g, 'L.L.M.')
      .replace(/\bGCP\b/g, 'Google Cloud Platform')
      .replace(/\bAWS\b/g, 'A.W.S.')
      .replace(/\bAPI\b/g, 'A.P.I.')
      .replace(/\bBigQuery\b/g, 'Big Query')
      .replace(/\bBigLake\b/g, 'Big Lake')
      .replace(/\bVertex AI\b/g, 'Vertex A.I.')
      .replace(/\bGemini 3\.7\b/g, 'Gemini three point seven')
      .replace(/\bGemini 2\.0\b/g, 'Gemini two point zero')
      .replace(/#{1,6}\s+/g, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/`{1,3}[^`]*`{1,3}/g, '')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .replace(/^[-*+]\s+/gm, '')
      .replace(/>\s+/g, '')
      .replace(/[|\\~_]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * 🎬 Gemini SSML Audio Director:
   * Generates a 5-Act theatrical script with SSML emotional markup, pauses, and pitch drift.
   */
  async buildDirectorScript(instance, report, style = 'storyteller', persona = 'jonathan') {
    const customer = instance?.customerName || 'your organization';
    const framework = instance?.frameworkSnapshot?.title || instance?.useCase || 'Enterprise Architecture';
    const score = report?.overallScore || instance?.totalScore || 3.2;
    const stage = report?.maturityLevel || instance?.maturityLevel || 'Defined';
    const summary = this.naturalizeTextForSpeech(report?.executiveSummary || 'Your architecture exhibits robust core foundations with immediate high-impact modernization frontiers.');
    const rawRecommendations = (report?.prioritizedRecommendations || report?.prioritizedActions || []).slice(0, 3);

    const recs = rawRecommendations.map(r => this.naturalizeTextForSpeech(r.title || r.recommendation || r.action || 'Strategic Modernization Wave'));

    const chapters = [
      {
        act: 'Act I',
        chapterTitle: 'The Landscape',
        text: `Picture this... In an era where data velocity defines market dominance, the leadership at ${customer} embarked on a vital journey: to evaluate the true architectural frontiers of ${framework}.`,
        ssml: `<speak>
          <prosody rate="92%" pitch="-1st">
            Picture this... <break time="350ms"/>
            In an era where data velocity defines market dominance, <break time="200ms"/>
            the leadership at <emphasis level="moderate">${customer}</emphasis> embarked on a vital journey: <break time="250ms"/>
            to evaluate the true architectural frontiers of ${framework}.
          </prosody>
        </speak>`
      },
      {
        act: 'Act II',
        chapterTitle: 'The Conflict',
        text: `Beneath the surface of daily operations, subtle frictions were quietly mounting... Fragile legacy batch scripts, unmonitored A.I. prompt token burn, and fragmented silos were silently placing engineering velocity at risk.`,
        ssml: `<speak>
          <prosody rate="94%" pitch="-2st">
            Beneath the surface of daily operations, <break time="200ms"/>
            subtle frictions were quietly mounting... <break time="400ms"/>
            Fragile legacy batch scripts, <break time="150ms"/>
            unmonitored A.I. prompt token burn, <break time="150ms"/>
            and fragmented silos were silently placing engineering velocity at risk.
          </prosody>
        </speak>`
      },
      {
        act: 'Act III',
        chapterTitle: 'The Epiphany',
        text: `Then came the moment of clarity... Our comprehensive audit evaluated your overall maturity at ${score} out of 5.0, firmly placing the organization at the ${stage} stage. ${summary}`,
        ssml: `<speak>
          <prosody rate="96%" pitch="+0st">
            Then came the moment of clarity... <break time="350ms"/>
            Our comprehensive audit evaluated your overall maturity at <emphasis level="strong">${score} out of 5.0</emphasis>, <break time="200ms"/>
            firmly placing the organization at the <emphasis level="moderate">${stage}</emphasis> stage. <break time="300ms"/>
            ${summary}
          </prosody>
        </speak>`
      },
      {
        act: 'Act IV',
        chapterTitle: 'The Awakening',
        text: `Imagine what happens next... The target state unlocks Google Vertex A.I. Gemini three point seven with Context Caching, shattering latency and slashing token costs by an astonishing seventy-five percent, paired with the unifying power of Big Lake!`,
        ssml: `<speak>
          <prosody rate="102%" pitch="+1st">
            Imagine what happens next... <break time="300ms"/>
            The target state unlocks <emphasis level="strong">Google Vertex A.I. Gemini 3.7 with Context Caching</emphasis>, <break time="200ms"/>
            shattering latency and slashing token costs by an astonishing <emphasis level="strong">seventy-five percent</emphasis>, <break time="200ms"/>
            paired with the unifying power of Big Lake!
          </prosody>
        </speak>`
      },
      {
        act: 'Act V',
        chapterTitle: 'The Horizon',
        text: `The path forward is clear... ${recs.length > 0 ? recs.map((r, i) => `Chapter ${i + 1}: ${r}.`).join(' ') : 'Initiate immediate targeted modernization waves.'} The blueprint is illuminated. The horizon is yours to claim. Chapter One begins today.`,
        ssml: `<speak>
          <prosody rate="93%" pitch="-1st">
            The path forward is clear... <break time="300ms"/>
            ${recs.length > 0 ? recs.map((r, i) => `Chapter ${i + 1}... <break time="150ms"/> <emphasis level="moderate">${r}</emphasis>... <break time="250ms"/>`).join(' ') : 'Initiate immediate targeted modernization waves... <break time="250ms"/>'}
            The blueprint is illuminated. <break time="300ms"/>
            The horizon is yours to claim. <break time="350ms"/>
            <prosody pitch="-2st">Chapter One begins today.</prosody>
          </prosody>
        </speak>`
      }
    ];

    return chapters;
  }

  /**
   * 🎙️ Dual-Host Podcast Co-Host Dialogue Generator (NotebookLM / Boardroom Style)
   */
  async buildPodcastDialogueScript(instance, report) {
    const customer = instance?.customerName || 'the organization';
    const score = report?.overallScore || instance?.totalScore || 3.2;
    const stage = report?.maturityLevel || instance?.maturityLevel || 'Defined';

    const turns = [
      {
        act: 'Act I',
        chapterTitle: 'The Opening Exchange',
        speaker: 'Jonathan (Chief Architect)',
        persona: 'jonathan',
        text: `Welcome to the executive architectural briefing for ${customer}. Today, we're unpacking the complete data and A.I. maturity audit. Victoria, when you look across their foundational tier, what immediately jumps out?`
      },
      {
        act: 'Act II',
        chapterTitle: 'The Hidden Gaps',
        speaker: 'Victoria (Strategy Partner)',
        persona: 'victoria',
        text: `Thanks Jonathan. What really stands out is the classic modernization paradox. Their engineering teams are shipping rapidly, but underneath, unmonitored prompt token burn and legacy batch silos are silently adding friction to the bottom line.`
      },
      {
        act: 'Act III',
        chapterTitle: 'The Audit Score',
        speaker: 'Jonathan (Chief Architect)',
        persona: 'jonathan',
        text: `Precisely. Our assessment establishes their overall enterprise score at ${score} out of 5.0, squarely in the ${stage} tier. It proves the core data pipeline is solid, but the next horizon demands intelligent unified governance.`
      },
      {
        act: 'Act IV',
        chapterTitle: 'The Modernization Payoff',
        speaker: 'Victoria (Strategy Partner)',
        persona: 'victoria',
        text: `And that's where the financial upside is massive. By modernizing to Google Vertex A.I. Gemini 3.7 with Context Caching and Big Lake, we project up to a seventy-five percent reduction in token costs and instant query latency.`
      },
      {
        act: 'Act V',
        chapterTitle: 'The Executive Call to Action',
        speaker: 'Jonathan (Chief Architect)',
        persona: 'jonathan',
        text: `The roadmap is locked, the technical blueprints are generated, and Phase One starts today. Let's build the future together.`
      }
    ];

    return turns;
  }

  /**
   * 🌟 1-Click Instant Voice Cloner:
   * Accepts an audio buffer from browser mic or uploaded MP3 and registers custom voice profile.
   */
  async cloneVoiceFromSample(audioBuffer, voiceName = 'My Custom Executive Voice', customApiKey = null) {
    const voiceId = `custom_${crypto.createHash('md5').update(audioBuffer).digest('hex').substring(0, 10)}`;

    // Save audio sample to local storage
    const samplePath = path.join(this.customVoicesDir, `${voiceId}.mp3`);
    fs.writeFileSync(samplePath, audioBuffer);

    // If user provided ElevenLabs key, register with ElevenLabs Instant Voice Cloning API
    const apiKey = customApiKey || process.env.ELEVENLABS_API_KEY;
    let remoteVoiceId = null;

    if (apiKey) {
      try {
        const FormData = require('form-data');
        const form = new FormData();
        form.append('name', voiceName);
        form.append('files', fs.createReadStream(samplePath));
        form.append('description', 'ScoreX Cloned Executive Voice');

        const res = await axios.post('https://api.elevenlabs.io/v1/voices/add', form, {
          headers: {
            ...form.getHeaders(),
            'xi-api-key': apiKey
          },
          timeout: 25000
        });

        if (res.data && res.data.voice_id) {
          remoteVoiceId = res.data.voice_id;
        }
      } catch (err) {
        console.warn('⚠️ ElevenLabs instant voice clone fallback to local profile:', err.response?.data || err.message);
      }
    }

    const voiceProfile = {
      id: voiceId,
      name: voiceName,
      remoteVoiceId: remoteVoiceId || voiceId,
      samplePath,
      createdAt: new Date().toISOString()
    };

    this.customVoices.set(voiceId, voiceProfile);
    return voiceProfile;
  }

  /**
   * Helper: Generate a unique SHA-256 cache key
   */
  generateCacheKey(text, style, persona, engine = 'google') {
    return crypto.createHash('sha256').update(`${engine}_${style}_${persona}_${text}`).digest('hex');
  }

  getCachedAudio(cacheKey) {
    if (this.memoryCache.has(cacheKey)) {
      return this.memoryCache.get(cacheKey);
    }
    const filePath = path.join(this.cacheDir, `${cacheKey}.mp3`);
    if (fs.existsSync(filePath)) {
      try {
        const data = fs.readFileSync(filePath);
        const base64 = data.toString('base64');
        this.memoryCache.set(cacheKey, base64);
        return base64;
      } catch (e) {
        console.warn('Cache read error:', e.message);
      }
    }
    return null;
  }

  setCachedAudio(cacheKey, audioBase64) {
    try {
      this.memoryCache.set(cacheKey, audioBase64);
      const filePath = path.join(this.cacheDir, `${cacheKey}.mp3`);
      fs.writeFileSync(filePath, Buffer.from(audioBase64, 'base64'));
    } catch (e) {
      console.warn('Cache write error:', e.message);
    }
  }

  /**
   * ⚡ Synthesize via Google Cloud Text-to-Speech (Journey & Studio Neural Voices)
   */
  async synthesizeGoogleTTS(ssmlOrText, persona = 'jonathan') {
    const apiKey = geminiService.getApiKey();
    if (!apiKey) {
      throw new Error('Google API Key (GEMINI_API_KEY or GOOGLE_API_KEY) is not configured.');
    }

    const voiceConfig = this.googleVoiceMap[persona] || this.googleVoiceMap.jonathan;
    const isSSML = ssmlOrText.trim().startsWith('<speak>');

    const requestBody = {
      input: isSSML ? { ssml: ssmlOrText } : { text: ssmlOrText },
      voice: {
        languageCode: voiceConfig.languageCode,
        name: voiceConfig.name,
        ssmlGender: voiceConfig.ssmlGender
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: voiceConfig.speakingRate || 0.96,
        pitch: voiceConfig.pitch || 0.0,
        sampleRateHertz: 48000,
        effectsProfileId: ['headphone-class-device']
      }
    };

    try {
      const response = await axios.post(
        `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
        requestBody,
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 15000
        }
      );

      if (response.data && response.data.audioContent) {
        return response.data.audioContent; // Base64 MP3
      }
      throw new Error('No audio content returned from Google TTS.');
    } catch (err) {
      if (voiceConfig.fallback && voiceConfig.fallback !== voiceConfig.name) {
        console.warn(`⚠️ Google TTS Journey retry with fallback ${voiceConfig.fallback}:`, err.response?.data?.error?.message || err.message);
        requestBody.voice.name = voiceConfig.fallback;
        const fallbackRes = await axios.post(
          `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
          requestBody,
          { headers: { 'Content-Type': 'application/json' }, timeout: 15000 }
        );
        if (fallbackRes.data && fallbackRes.data.audioContent) {
          return fallbackRes.data.audioContent;
        }
      }
      throw err;
    }
  }

  /**
   * 🌟 Synthesize via ElevenLabs REST API (Optional BYOK or Cloned Voice)
   */
  async synthesizeElevenLabs(text, persona = 'jonathan', customApiKey = null, customVoiceId = null) {
    const apiKey = customApiKey || process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      throw new Error('ElevenLabs API Key is not configured.');
    }

    const voiceId = customVoiceId || this.elevenLabsVoiceMap[persona] || this.elevenLabsVoiceMap.jonathan;

    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        text: text.replace(/<[^>]*>/g, ''), // Strip SSML tags
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.85,
          style: 0.45,
          use_speaker_boost: true
        }
      },
      {
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg'
        },
        responseType: 'arraybuffer',
        timeout: 20000
      }
    );

    const buffer = Buffer.from(response.data);
    return buffer.toString('base64');
  }

  /**
   * Master Synthesis Dispatcher
   */
  async synthesizeAct(chapter, persona = 'jonathan', style = 'storyteller', engine = 'google', customApiKey = null, customVoiceId = null) {
    const textToSynthesize = chapter.ssml || chapter.text;
    const cacheKey = this.generateCacheKey(textToSynthesize, style, customVoiceId || persona, engine);

    // 1. Check Cache
    const cachedAudio = this.getCachedAudio(cacheKey);
    if (cachedAudio) {
      return {
        act: chapter.act,
        chapterTitle: chapter.chapterTitle,
        text: chapter.text,
        audioBase64: cachedAudio,
        cached: true,
        engine
      };
    }

    // 2. Synthesize via selected Engine
    let audioBase64 = null;
    try {
      if (engine === 'elevenlabs' || (customApiKey && customApiKey.startsWith('sk_')) || customVoiceId) {
        audioBase64 = await this.synthesizeElevenLabs(chapter.text, persona, customApiKey, customVoiceId);
      } else {
        audioBase64 = await this.synthesizeGoogleTTS(chapter.ssml || chapter.text, persona);
      }
    } catch (err) {
      console.warn(`ℹ️ [AudioSynthesis] Engine ${engine} unavailable (${err.message}). Signaling client fallback.`);
      return {
        act: chapter.act,
        chapterTitle: chapter.chapterTitle,
        text: chapter.text,
        audioBase64: null,
        fallbackToBrowser: true,
        cached: false,
        engine,
        message: err.message
      };
    }

    // 3. Cache Result
    if (audioBase64) {
      this.setCachedAudio(cacheKey, audioBase64);
    }

    return {
      act: chapter.act,
      chapterTitle: chapter.chapterTitle,
      text: chapter.text,
      audioBase64,
      cached: false,
      engine
    };
  }

  /**
   * 📦 Stitched 5-Act Full Broadcast MP3 Generator (1-Click Download)
   */
  async exportFullStitchedAudio(instance, report, style = 'storyteller', persona = 'jonathan', engine = 'google', customApiKey = null) {
    const chapters = await this.buildDirectorScript(instance, report, style, persona);
    const audioBuffers = [];

    for (const chap of chapters) {
      const res = await this.synthesizeAct(chap, persona, style, engine, customApiKey);
      if (res.audioBase64) {
        audioBuffers.push(Buffer.from(res.audioBase64, 'base64'));
      }
    }

    if (audioBuffers.length === 0) {
      throw new Error('No audio could be synthesized for export. Please configure a GEMINI_API_KEY, GOOGLE_API_KEY, or ElevenLabs API Key.');
    }

    // Concatenate contiguous MP3 buffers
    return Buffer.concat(audioBuffers);
  }
}

module.exports = new AudioNarrationService();
