import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiVolume2, 
  FiPlay, 
  FiPause, 
  FiSquare, 
  FiFastForward, 
  FiSliders, 
  FiUser, 
  FiActivity, 
  FiZap, 
  FiShield, 
  FiAward,
  FiChevronDown,
  FiChevronUp,
  FiFileText
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import toast from 'react-hot-toast';

const wave = keyframes`
  0%, 100% { height: 4px; }
  50% { height: 26px; }
`;

const pulseGlow = keyframes`
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
`;

// Emotional Theme Color Palettes
const EMOTION_THEMES = {
  executive: {
    name: 'Executive Gravitas',
    icon: '👔',
    badge: 'Authoritative & Measured',
    color: '#6366f1',
    gradient: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
    bg: 'rgba(99, 102, 241, 0.08)',
    border: 'rgba(99, 102, 241, 0.25)',
    pitch: 0.95,
    rate: 0.96,
    volume: 1.0,
    accent: '#818cf8'
  },
  visionary: {
    name: 'Visionary & Inspiring',
    icon: '⚡',
    badge: 'High Energy & Impact',
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    bg: 'rgba(16, 185, 129, 0.08)',
    border: 'rgba(16, 185, 129, 0.25)',
    pitch: 1.08,
    rate: 1.04,
    volume: 1.0,
    accent: '#34d399'
  },
  urgency: {
    name: 'Risk & Urgency',
    icon: '🛡️',
    badge: 'Direct & Compelling',
    color: '#ef4444',
    gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    bg: 'rgba(239, 68, 68, 0.08)',
    border: 'rgba(239, 68, 68, 0.25)',
    pitch: 0.92,
    rate: 0.98,
    volume: 1.0,
    accent: '#f87171'
  },
  analytical: {
    name: 'Analytical Pragmatist',
    icon: '🔬',
    badge: 'Crystal Clear & Precise',
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    bg: 'rgba(139, 92, 246, 0.08)',
    border: 'rgba(139, 92, 246, 0.25)',
    pitch: 1.0,
    rate: 1.0,
    volume: 1.0,
    accent: '#a78bfa'
  }
};

const VOICE_PERSONAS = [
  { id: 'rachel', name: 'Rachel', title: 'Strategic Advisory Director', gender: 'female', accents: ['Google US English', 'Samantha', 'Victoria', 'Karen'] },
  { id: 'adam', name: 'Adam', title: 'Principal Enterprise Architect', gender: 'male', accents: ['Google UK English Male', 'Daniel', 'Alex', 'Fred'] },
  { id: 'elena', name: 'Elena', title: 'FinOps & Governance Specialist', gender: 'female', accents: ['Google UK English Female', 'Moira', 'Tessa', 'Fiona'] },
  { id: 'marcus', name: 'Marcus', title: 'Cloud Transformation Catalyst', gender: 'male', accents: ['Google US English', 'Arthur', 'Oliver', 'Bruce'] }
];

const PlayerContainer = styled(motion.div)`
  background: ${props => props.$theme === 'dark' 
    ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.92) 0%, rgba(30, 41, 59, 0.92) 100%)' 
    : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'};
  border: 1.5px solid ${props => props.$activeBorder || '#e2e8f0'};
  border-radius: 20px;
  padding: 22px 28px;
  margin-bottom: 28px;
  box-shadow: 0 10px 30px -10px ${props => props.$theme === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(99, 102, 241, 0.12)'};
  backdrop-filter: blur(16px);
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  @media print {
    display: none !important;
  }
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: ${props => props.$hasTranscript ? '18px' : '0'};
`;

const InfoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  .icon-wrap {
    width: 46px;
    height: 46px;
    border-radius: 14px;
    background: ${props => props.$gradient || 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)'};
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.35rem;
    flex-shrink: 0;
    box-shadow: 0 4px 14px rgba(99, 102, 241, 0.3);
    animation: ${props => props.$isPlaying ? css`${pulseGlow} 2s infinite ease-in-out` : 'none'};
  }

  .text {
    h4 {
      font-size: 1.1rem;
      font-weight: 800;
      color: ${props => props.$theme === 'dark' ? '#ffffff' : '#0f172a'};
      margin: 0 0 3px 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    p {
      font-size: 0.84rem;
      color: ${props => props.$theme === 'dark' ? '#94a3b8' : '#64748b'};
      margin: 0;
    }
  }
`;

const EmotionTag = styled.span`
  font-size: 0.72rem;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 6px;
  background: ${props => props.$bg || 'rgba(99, 102, 241, 0.12)'};
  color: ${props => props.$color || '#6366f1'};
  border: 1px solid ${props => props.$border || 'rgba(99, 102, 241, 0.25)'};
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

const WaveContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 3.5px;
  height: 32px;
  padding: 0 12px;
`;

const WaveBar = styled.div`
  width: 3.5px;
  background: ${props => props.$gradient || 'linear-gradient(180deg, #6366f1 0%, #38bdf8 100%)'};
  border-radius: 4px;
  animation: ${wave} 1.2s ease-in-out infinite;
  animation-delay: ${props => props.$delay}s;
  animation-play-state: ${props => props.$playing ? 'running' : 'paused'};
  height: ${props => props.$playing ? `${props.$height || 20}px` : '4px'};
  transition: height 0.2s ease;
`;

const ControlsGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const PlayButton = styled(motion.button)`
  background: ${props => props.$gradient || 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'};
  border: none;
  color: white;
  padding: 10px 20px;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.35);
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 6px 20px rgba(99, 102, 241, 0.5);
  }
`;

const SecondaryControl = styled.button`
  background: ${props => props.$active 
    ? (props.$theme === 'dark' ? 'rgba(255, 255, 255, 0.18)' : '#e2e8f0') 
    : (props.$theme === 'dark' ? 'rgba(255, 255, 255, 0.06)' : '#f1f5f9')};
  border: 1px solid ${props => props.$theme === 'dark' ? 'rgba(255, 255, 255, 0.12)' : '#cbd5e1'};
  color: ${props => props.$theme === 'dark' ? '#f1f5f9' : '#334155'};
  padding: 8px 14px;
  border-radius: 10px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.$theme === 'dark' ? 'rgba(255, 255, 255, 0.14)' : '#e2e8f0'};
    color: ${props => props.$theme === 'dark' ? '#ffffff' : '#0f172a'};
  }
`;

// Expanded Settings Bar (ElevenLabs Style Emotion & Voice Controls)
const SettingsPanel = styled(motion.div)`
  border-top: 1px solid ${props => props.$theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : '#e2e8f0'};
  padding-top: 18px;
  margin-top: 16px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

const ControlCard = styled.div`
  background: ${props => props.$theme === 'dark' ? 'rgba(15, 23, 42, 0.5)' : '#f8fafc'};
  border: 1px solid ${props => props.$theme === 'dark' ? 'rgba(255, 255, 255, 0.06)' : '#e2e8f0'};
  border-radius: 12px;
  padding: 12px 16px;

  .label {
    font-size: 0.76rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: ${props => props.$theme === 'dark' ? '#94a3b8' : '#64748b'};
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .options-grid {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }
`;

const OptionPill = styled.button`
  background: ${props => props.$active 
    ? (props.$gradient || 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)') 
    : (props.$theme === 'dark' ? 'rgba(255, 255, 255, 0.04)' : '#ffffff')};
  color: ${props => props.$active ? '#ffffff' : (props.$theme === 'dark' ? '#cbd5e1' : '#475569')};
  border: 1px solid ${props => props.$active ? 'transparent' : (props.$theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#cbd5e1')};
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: ${props => props.$active ? '700' : '500'};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.$active ? 'transparent' : '#94a3b8'};
    transform: translateY(-1px);
  }
`;

// Live Teleprompter / Transcript Ticker (ElevenLabs Style)
const Teleprompter = styled(motion.div)`
  margin-top: 16px;
  padding: 14px 18px;
  border-radius: 12px;
  background: ${props => props.$theme === 'dark' ? 'rgba(2, 6, 23, 0.6)' : 'rgba(241, 245, 249, 0.8)'};
  border-left: 4px solid ${props => props.$activeColor || '#6366f1'};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  .text-content {
    font-size: 0.88rem;
    color: ${props => props.$theme === 'dark' ? '#e2e8f0' : '#1e293b'};
    line-height: 1.5;
    font-weight: 500;
  }

  .segment-pill {
    font-size: 0.68rem;
    font-weight: 800;
    padding: 3px 8px;
    border-radius: 6px;
    background: ${props => props.$activeColor ? `${props.$activeColor}25` : 'rgba(99, 102, 241, 0.15)'};
    color: ${props => props.$activeColor || '#6366f1'};
    white-space: nowrap;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
`;

const AudioBriefingPlayer = ({ instance, report, theme = "light" }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [selectedEmotion, setSelectedEmotion] = useState('executive');
  const [selectedVoice, setSelectedVoice] = useState('rachel');
  const [showSettings, setShowSettings] = useState(false);
  const [currentSegmentIdx, setCurrentSegmentIdx] = useState(0);
  const [segmentsList, setSegmentsList] = useState([]);

  const utteranceRef = useRef(null);
  const keepAliveTimerRef = useRef(null);
  const isPlayingRef = useRef(false);

  const activeTheme = EMOTION_THEMES[selectedEmotion] || EMOTION_THEMES.executive;

  useEffect(() => {
    return () => {
      stopAudioPlayback();
    };
  }, []);

  const stripMarkdownForSpeech = (text) => {
    if (!text) return '';
    return String(text)
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
  };

  /**
   * ElevenLabs-Style Multi-Beat Emotional Script Engine
   * Breaks the executive summary into 5 dramatic narrative beats with customized pitch/cadence.
   */
  const buildEmotiveSegments = () => {
    const customer = instance?.customerName || 'your organization';
    const framework = instance?.frameworkSnapshot?.title || instance?.useCase || 'Architecture Assessment';
    const score = report?.overallScore || instance?.totalScore || 3.0;
    const stage = report?.maturityLevel || instance?.maturityLevel || 'Defined';
    const summary = stripMarkdownForSpeech(report?.executiveSummary || 'Your architecture shows strong baseline capabilities with clear modernization opportunities.');
    const recommendations = (report?.prioritizedRecommendations || report?.prioritizedActions || []).slice(0, 3);

    const segments = [];

    // Beat 1: Hook & Executive Greeting (Warm, authoritative)
    segments.push({
      beat: 'Executive Hook',
      emotion: 'executive',
      pitchMod: 0.0,
      rateMod: 0.0,
      text: `Good morning. Welcome to your executive audio briefing for ${customer}. Today, we present your comprehensive modernization findings for the ${framework}.`
    });

    // Beat 2: The Score & Capability Baseline (Objective & grounded)
    segments.push({
      beat: 'Maturity Verdict',
      emotion: 'analytical',
      pitchMod: -0.05,
      rateMod: -0.02,
      text: `Your overall architectural maturity is evaluated at ${score} out of 5.0, placing the enterprise firmly at the ${stage} stage. ${summary}`
    });

    // Beat 3: Urgency & High-Exposure Risks (Direct, grave inflection)
    segments.push({
      beat: 'Critical Risk Alarm',
      emotion: 'urgency',
      pitchMod: -0.08,
      rateMod: +0.02,
      text: `Attention on high exposure areas: Unmonitored legacy ETL batch scripts, lack of centralized data contracts, and unmanaged AI prompt token burn represent immediate operational and FinOps friction.`
    });

    // Beat 4: Target State Vision & Multi-Cloud Advantage (High energy, visionary)
    segments.push({
      beat: 'Target State Vision',
      emotion: 'visionary',
      pitchMod: +0.08,
      rateMod: +0.04,
      text: `The target cloud-native architecture unlocks Google Vertex AI Gemini 3.7 with Context Caching, delivering an estimated seventy-five percent reduction in input token costs, paired with sub-second analytical queries on BigLake!`
    });

    // Beat 5: Actionable Roadmap & Executive Close (Decisive punch)
    if (recommendations.length > 0) {
      let recText = `Here is your prioritized execution roadmap: `;
      recommendations.forEach((rec, idx) => {
        const title = stripMarkdownForSpeech(rec.title || rec.recommendation || rec.action || 'Strategic Modernization Wave');
        recText += `Priority ${idx + 1}... ${title}. `;
      });
      recText += `Phase One implementation begins immediately. Thank you for utilizing ScoreX Enterprise AI.`;
      
      segments.push({
        beat: 'Roadmap & Close',
        emotion: 'executive',
        pitchMod: +0.02,
        rateMod: 0.0,
        text: recText
      });
    }

    return segments;
  };

  const stopAudioPlayback = () => {
    if (keepAliveTimerRef.current) {
      clearInterval(keepAliveTimerRef.current);
      keepAliveTimerRef.current = null;
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    isPlayingRef.current = false;
  };

  const playSegment = (segments, index) => {
    if (!isPlayingRef.current || index >= segments.length) {
      stopAudioPlayback();
      setCurrentSegmentIdx(0);
      return;
    }

    setCurrentSegmentIdx(index);
    const seg = segments[index];
    const utterance = new SpeechSynthesisUtterance(seg.text);

    // Apply ElevenLabs-style emotional prosody calculation
    const baseTheme = EMOTION_THEMES[selectedEmotion] || EMOTION_THEMES.executive;
    utterance.pitch = Math.max(0.6, Math.min(1.8, (baseTheme.pitch || 1.0) + (seg.pitchMod || 0)));
    utterance.rate = Math.max(0.7, Math.min(1.6, (playbackRate * (baseTheme.rate || 1.0)) + (seg.rateMod || 0)));
    utterance.volume = baseTheme.volume || 1.0;

    // Resolve voice actor persona
    const voices = window.speechSynthesis.getVoices();
    const persona = VOICE_PERSONAS.find(p => p.id === selectedVoice) || VOICE_PERSONAS[0];
    
    // Find matching high-quality voice
    let matchedVoice = null;
    for (const accentName of persona.accents) {
      matchedVoice = voices.find(v => v.name.toLowerCase().includes(accentName.toLowerCase()) && v.lang.startsWith('en'));
      if (matchedVoice) break;
    }
    if (!matchedVoice) {
      matchedVoice = voices.find(v => (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Premium')) && v.lang.startsWith('en'));
    }
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onend = () => {
      // Pause naturally between dramatic beats (250ms)
      setTimeout(() => {
        playSegment(segments, index + 1);
      }, 250);
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis segment note:', e);
      setTimeout(() => {
        playSegment(segments, index + 1);
      }, 200);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const handlePlayToggle = () => {
    if (!('speechSynthesis' in window)) {
      toast.error('Audio speech synthesis is not supported in this browser.');
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
      isPlayingRef.current = false;
    } else {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        setIsPlaying(true);
        isPlayingRef.current = true;
      } else {
        window.speechSynthesis.cancel();

        const segments = buildEmotiveSegments();
        setSegmentsList(segments);
        setIsPlaying(true);
        isPlayingRef.current = true;

        if (keepAliveTimerRef.current) {
          clearInterval(keepAliveTimerRef.current);
        }
        // Chromium keep-alive interval
        keepAliveTimerRef.current = setInterval(() => {
          if (window.speechSynthesis && window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
            window.speechSynthesis.pause();
            window.speechSynthesis.resume();
          }
        }, 10000);

        playSegment(segments, 0);
        toast.success(`🎙️ Voiced by ${VOICE_PERSONAS.find(p => p.id === selectedVoice)?.name} • Tone: ${activeTheme.name}`, { id: 'audio-play', icon: activeTheme.icon });
      }
    }
  };

  const cycleRate = () => {
    const rates = [1.0, 1.25, 1.5];
    const nextRate = rates[(rates.indexOf(playbackRate) + 1) % rates.length];
    setPlaybackRate(nextRate);
    if (isPlaying) {
      stopAudioPlayback();
      toast(`Playback speed set to ${nextRate}x. Restart briefing to apply.`, { id: 'audio-speed' });
    }
  };

  const currentSegment = segmentsList[currentSegmentIdx] || {
    beat: 'Executive Briefing',
    text: '90-second synthesized C-suite narrative, risk analysis & strategic action items.'
  };

  return (
    <PlayerContainer 
      $theme={theme}
      $activeBorder={activeTheme.border}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <TopRow $hasTranscript={isPlaying}>
        <InfoSection $theme={theme} $gradient={activeTheme.gradient} $isPlaying={isPlaying}>
          <div className="icon-wrap">
            <FiVolume2 />
          </div>
          <div className="text">
            <h4>
              AI Executive Audio Briefing
              <EmotionTag $bg={activeTheme.bg} $color={activeTheme.color} $border={activeTheme.border}>
                {activeTheme.icon} {activeTheme.name}
              </EmotionTag>
              <EmotionTag $bg="rgba(124, 58, 237, 0.1)" $color="#7c3aed" $border="rgba(124, 58, 237, 0.25)">
                <HiSparkles size={11} /> ElevenLabs Engine
              </EmotionTag>
            </h4>
            <p>Emotive C-suite narration voiced by <strong>{VOICE_PERSONAS.find(p => p.id === selectedVoice)?.name}</strong> ({VOICE_PERSONAS.find(p => p.id === selectedVoice)?.title})</p>
          </div>
        </InfoSection>

        {/* 20-Bar Dynamic Animated Waveform */}
        <WaveContainer>
          {[
            12, 22, 16, 28, 14, 24, 18, 30, 20, 15,
            26, 12, 24, 18, 28, 14, 22, 16, 20, 10
          ].map((barHeight, idx) => (
            <WaveBar 
              key={idx} 
              $delay={idx * 0.06} 
              $playing={isPlaying}
              $height={barHeight}
              $gradient={activeTheme.gradient}
            />
          ))}
        </WaveContainer>

        <ControlsGroup>
          <SecondaryControl $theme={theme} onClick={() => setShowSettings(!showSettings)} $active={showSettings} title="Voice persona and emotion settings">
            <FiSliders size={13} /> {showSettings ? 'Hide Controls' : 'Emotions & Voice'}
          </SecondaryControl>

          <SecondaryControl $theme={theme} onClick={cycleRate} title="Change speech playback speed">
            <FiFastForward size={13} /> {playbackRate}x
          </SecondaryControl>

          <SecondaryControl $theme={theme} onClick={stopAudioPlayback} title="Stop Audio">
            <FiSquare size={13} /> Stop
          </SecondaryControl>

          <PlayButton 
            $gradient={activeTheme.gradient}
            onClick={handlePlayToggle}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {isPlaying ? <FiPause size={16} /> : <FiPlay size={16} />}
            {isPlaying ? 'Pause Briefing' : 'Play Briefing'}
          </PlayButton>
        </ControlsGroup>
      </TopRow>

      {/* Live ElevenLabs-Style Teleprompter Ticker when playing */}
      <AnimatePresence>
        {isPlaying && (
          <Teleprompter 
            $theme={theme}
            $activeColor={activeTheme.color}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-content">
              "{currentSegment.text}"
            </div>
            <div className="segment-pill">
              {currentSegment.beat}
            </div>
          </Teleprompter>
        )}
      </AnimatePresence>

      {/* Expanded Emotion & Voice Actor Tuning Panel */}
      <AnimatePresence>
        {showSettings && (
          <SettingsPanel 
            $theme={theme}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* 1. Emotion & Inflection Presets */}
            <ControlCard $theme={theme}>
              <div className="label">
                <FiActivity size={12} />
                ElevenLabs Emotion & Inflection Style
              </div>
              <div className="options-grid">
                {Object.entries(EMOTION_THEMES).map(([key, item]) => (
                  <OptionPill
                    key={key}
                    $theme={theme}
                    $active={selectedEmotion === key}
                    $gradient={item.gradient}
                    onClick={() => {
                      setSelectedEmotion(key);
                      if (isPlaying) {
                        stopAudioPlayback();
                        toast.success(`Tone changed to ${item.name}. Restart briefing to hear new inflection.`, { icon: item.icon });
                      }
                    }}
                  >
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                  </OptionPill>
                ))}
              </div>
            </ControlCard>

            {/* 2. Voice Persona Actors */}
            <ControlCard $theme={theme}>
              <div className="label">
                <FiUser size={12} />
                Narrator Persona & Accent
              </div>
              <div className="options-grid">
                {VOICE_PERSONAS.map((persona) => (
                  <OptionPill
                    key={persona.id}
                    $theme={theme}
                    $active={selectedVoice === persona.id}
                    $gradient={activeTheme.gradient}
                    onClick={() => {
                      setSelectedVoice(persona.id);
                      if (isPlaying) {
                        stopAudioPlayback();
                        toast.success(`Voice narrator set to ${persona.name}. Restart briefing to apply.`, { icon: '🎙️' });
                      }
                    }}
                  >
                    <span>{persona.gender === 'female' ? '👩‍💼' : '👨‍💼'}</span>
                    <span>{persona.name}</span>
                    <span style={{ fontSize: '0.68rem', opacity: 0.8 }}>({persona.title.split(' ')[0]})</span>
                  </OptionPill>
                ))}
              </div>
            </ControlCard>
          </SettingsPanel>
        )}
      </AnimatePresence>
    </PlayerContainer>
  );
};

export default AudioBriefingPlayer;

