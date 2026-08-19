import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
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
  FiFileText,
  FiBookOpen,
  FiCompass,
  FiSun,
  FiFilm,
  FiRadio,
  FiKey,
  FiCpu,
  FiHeadphones
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import toast from 'react-hot-toast';

const wave = keyframes`
  0%, 100% { height: 4px; }
  50% { height: 28px; }
`;

const pulseGlow = keyframes`
  0%, 100% { opacity: 0.7; transform: scale(1); filter: drop-shadow(0 0 8px rgba(245, 158, 11, 0.4)); }
  50% { opacity: 1; transform: scale(1.06); filter: drop-shadow(0 0 16px rgba(245, 158, 11, 0.7)); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

// Emotional & Storytelling Style Themes
const STORY_THEMES = {
  storyteller: {
    name: 'Master Storyteller',
    icon: '🎬',
    tagline: 'Cinematic 5-Act Narrative Arc',
    color: '#d97706',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #b45309 50%, #78350f 100%)',
    bg: 'rgba(245, 158, 11, 0.09)',
    border: 'rgba(245, 158, 11, 0.35)',
    glow: 'rgba(245, 158, 11, 0.25)',
    accent: '#fbbf24',
    pitch: 1.0,
    rate: 0.94,
    volume: 1.0
  },
  keynote: {
    name: 'Visionary Keynote',
    icon: '🌌',
    tagline: 'Steve Jobs / TED Odyssey',
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
    bg: 'rgba(16, 185, 129, 0.09)',
    border: 'rgba(16, 185, 129, 0.35)',
    glow: 'rgba(16, 185, 129, 0.25)',
    accent: '#34d399',
    pitch: 1.06,
    rate: 1.02,
    volume: 1.0
  },
  thriller: {
    name: 'Investigative Drama',
    icon: '🕵️',
    tagline: 'High-Stakes Risk & Revelation',
    color: '#ef4444',
    gradient: 'linear-gradient(135deg, #ef4444 0%, #991b1b 100%)',
    bg: 'rgba(239, 68, 68, 0.09)',
    border: 'rgba(239, 68, 68, 0.35)',
    glow: 'rgba(239, 68, 68, 0.25)',
    accent: '#f87171',
    pitch: 0.91,
    rate: 0.96,
    volume: 1.0
  },
  fireside: {
    name: 'Fireside Journey',
    icon: '☕',
    tagline: 'Intimate Founder-to-Founder',
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #5b21b6 100%)',
    bg: 'rgba(139, 92, 246, 0.09)',
    border: 'rgba(139, 92, 246, 0.35)',
    glow: 'rgba(139, 92, 246, 0.25)',
    accent: '#a78bfa',
    pitch: 0.97,
    rate: 0.92,
    volume: 1.0
  },
  executive: {
    name: 'Executive Gravitas',
    icon: '👔',
    tagline: 'Authoritative Board Briefing',
    color: '#3b82f6',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    bg: 'rgba(59, 130, 246, 0.09)',
    border: 'rgba(59, 130, 246, 0.35)',
    glow: 'rgba(59, 130, 246, 0.25)',
    accent: '#60a5fa',
    pitch: 0.95,
    rate: 0.96,
    volume: 1.0
  }
};

const STORY_PERSONAS = [
  { id: 'jonathan', name: 'Sir Jonathan', title: 'DeepMind Documentary Baritone', gender: 'male', vibe: 'Warm, deep & theatrical (Journey-D)', googleVoice: 'en-US-Journey-D', accents: ['Daniel', 'Google UK English Male', 'Oliver', 'George'] },
  { id: 'victoria', name: 'Victoria', title: 'MasterClass Executive Narrator', gender: 'female', vibe: 'Magnetic, eloquent & expressive (Journey-F)', googleVoice: 'en-US-Journey-F', accents: ['Samantha', 'Google UK English Female', 'Karen', 'Victoria'] },
  { id: 'david', name: 'David', title: 'Visionary Tech Orator', gender: 'male', vibe: 'Inspiring, resonant & punchy (Studio-Q)', googleVoice: 'en-US-Studio-Q', accents: ['Google US English', 'Alex', 'Fred', 'Arthur'] },
  { id: 'maya', name: 'Maya', title: 'Intimate Fireside Novelist', gender: 'female', vibe: 'Curious, lively & poignant (Journey-O)', googleVoice: 'en-US-Journey-O', accents: ['Tessa', 'Moira', 'Fiona', 'Google US English'] }
];

const PlayerContainer = styled(motion.div)`
  background: ${props => props.$theme === 'dark' 
    ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(26, 20, 48, 0.95) 100%)' 
    : 'linear-gradient(135deg, #ffffff 0%, #fffbeb 40%, #fdf4ff 100%)'};
  border: 1.5px solid ${props => props.$activeBorder || '#f59e0b'};
  border-radius: 24px;
  padding: 24px 28px;
  margin-bottom: 28px;
  box-shadow: 0 16px 40px -12px ${props => props.$activeGlow || 'rgba(245, 158, 11, 0.2)'};
  backdrop-filter: blur(20px);
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${props => props.$gradient || 'linear-gradient(90deg, #f59e0b, #ec4899, #8b5cf6)'};
  }

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
`;

const InfoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  .icon-wrap {
    width: 50px;
    height: 50px;
    border-radius: 16px;
    background: ${props => props.$gradient || 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)'};
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    flex-shrink: 0;
    box-shadow: 0 6px 18px ${props => props.$activeGlow || 'rgba(245, 158, 11, 0.35)'};
    animation: ${props => props.$isPlaying ? css`${pulseGlow} 2.5s infinite ease-in-out` : 'none'};
  }

  .text {
    h4 {
      font-size: 1.15rem;
      font-weight: 800;
      color: ${props => props.$theme === 'dark' ? '#ffffff' : '#0f172a'};
      margin: 0 0 4px 0;
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }
    p {
      font-size: 0.86rem;
      color: ${props => props.$theme === 'dark' ? '#cbd5e1' : '#64748b'};
      margin: 0;
      display: flex;
      align-items: center;
      gap: 6px;
    }
  }
`;

const EmotionTag = styled.span`
  font-size: 0.72rem;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: 8px;
  background: ${props => props.$bg || 'rgba(245, 158, 11, 0.12)'};
  color: ${props => props.$color || '#d97706'};
  border: 1px solid ${props => props.$border || 'rgba(245, 158, 11, 0.3)'};
  display: inline-flex;
  align-items: center;
  gap: 5px;
  letter-spacing: 0.02em;
`;

const WaveContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  height: 36px;
  padding: 0 14px;
`;

const WaveBar = styled.div`
  width: 4px;
  background: ${props => props.$gradient || 'linear-gradient(180deg, #f59e0b 0%, #ec4899 100%)'};
  border-radius: 4px;
  animation: ${props => props.$realtime ? 'none' : css`${wave} 1.3s ease-in-out infinite`};
  animation-delay: ${props => props.$delay}s;
  animation-play-state: ${props => props.$playing ? 'running' : 'paused'};
  height: ${props => `${props.$height || 4}px`};
  transition: height 0.08s ease;
`;

const ControlsGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const PlayButton = styled(motion.button)`
  background: ${props => props.$gradient || 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)'};
  border: none;
  color: white;
  padding: 11px 22px;
  border-radius: 14px;
  font-size: 0.92rem;
  font-weight: 800;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 6px 20px ${props => props.$activeGlow || 'rgba(245, 158, 11, 0.4)'};
  transition: all 0.25s ease;
`;

const SecondaryControl = styled.button`
  background: ${props => props.$theme === 'dark' 
    ? (props.$active ? 'rgba(245, 158, 11, 0.25)' : 'rgba(255, 255, 255, 0.06)')
    : (props.$active ? 'rgba(245, 158, 11, 0.2)' : 'rgba(0, 0, 0, 0.04)')};
  border: 1px solid ${props => props.$active 
    ? '#f59e0b' 
    : (props.$theme === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)')};
  color: ${props => props.$theme === 'dark' ? '#f1f5f9' : '#334155'};
  padding: 9px 14px;
  border-radius: 12px;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.$theme === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)'};
  }
`;

const ChapterBar = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 8px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px dashed ${props => props.$theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'};
`;

const ChapterPill = styled.button`
  background: ${props => props.$active 
    ? (props.$gradient || 'linear-gradient(135deg, #f59e0b, #b45309)') 
    : (props.$theme === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)')};
  color: ${props => props.$active ? '#ffffff' : (props.$theme === 'dark' ? '#94a3b8' : '#64748b')};
  border: 1px solid ${props => props.$active 
    ? 'transparent' 
    : (props.$theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)')};
  padding: 8px 12px;
  border-radius: 12px;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 2px;
  transition: all 0.2s ease;

  .act-label {
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    opacity: ${props => props.$active ? 0.9 : 0.6};
  }

  .act-title {
    font-size: 0.8rem;
    font-weight: 800;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &:hover {
    border-color: #f59e0b;
    transform: translateY(-1px);
  }
`;

const StoryTeleprompter = styled(motion.div)`
  margin-top: 18px;
  padding: 16px 20px;
  background: ${props => props.$theme === 'dark' ? 'rgba(15, 23, 42, 0.75)' : 'rgba(255, 255, 255, 0.85)'};
  border: 1px solid ${props => props.$activeColor ? `${props.$activeColor}40` : 'rgba(245, 158, 11, 0.25)'};
  border-radius: 16px;
  display: flex;
  align-items: flex-start;
  gap: 14px;
  position: relative;
  overflow: hidden;

  .quote-symbol {
    font-size: 1.8rem;
    line-height: 1;
    color: ${props => props.$activeColor || '#f59e0b'};
    opacity: 0.8;
    flex-shrink: 0;
  }

  .text-content {
    font-size: 0.96rem;
    line-height: 1.6;
    color: ${props => props.$theme === 'dark' ? '#f8fafc' : '#1e293b'};
    font-weight: 500;
    font-style: italic;
  }

  .chapter-badge {
    position: absolute;
    top: 12px;
    right: 16px;
    font-size: 0.68rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: ${props => props.$activeColor || '#f59e0b'};
    background: ${props => props.$theme === 'dark' ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.05)'};
    padding: 3px 8px;
    border-radius: 6px;
  }
`;

const SettingsPanel = styled(motion.div)`
  margin-top: 20px;
  padding: 20px;
  background: ${props => props.$theme === 'dark' ? 'rgba(0, 0, 0, 0.35)' : 'rgba(0, 0, 0, 0.03)'};
  border-radius: 18px;
  border: 1px solid ${props => props.$theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'};
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
`;

const ControlCard = styled.div`
  .label {
    font-size: 0.82rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: ${props => props.$theme === 'dark' ? '#94a3b8' : '#64748b'};
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .options-grid {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
`;

const OptionPill = styled.button`
  background: ${props => props.$active 
    ? (props.$gradient || '#f59e0b') 
    : (props.$theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)')};
  color: ${props => props.$active ? '#ffffff' : (props.$theme === 'dark' ? '#e2e8f0' : '#334155')};
  border: 1px solid ${props => props.$active 
    ? 'transparent' 
    : (props.$theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)')};
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 0.84rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.$active ? 'transparent' : '#f59e0b'};
    transform: translateY(-1px);
  }
`;

const ApiKeyInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid ${props => props.$theme === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)'};
  background: ${props => props.$theme === 'dark' ? 'rgba(15, 23, 42, 0.8)' : '#ffffff'};
  color: ${props => props.$theme === 'dark' ? '#f8fafc' : '#0f172a'};
  font-size: 0.8rem;
  margin-top: 8px;
  outline: none;

  &:focus {
    border-color: #f59e0b;
  }
`;

const AudioBriefingPlayer = ({ instance, report, theme = "light" }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [selectedStyle, setSelectedStyle] = useState('storyteller');
  const [selectedPersona, setSelectedPersona] = useState('jonathan');
  const [selectedEngine, setSelectedEngine] = useState('google'); // 'google' | 'elevenlabs' | 'browser'
  const [elevenLabsKey, setElevenLabsKey] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [currentChapterIdx, setCurrentChapterIdx] = useState(0);
  const [chaptersList, setChaptersList] = useState([]);
  const [frequencyBars, setFrequencyBars] = useState(new Array(22).fill(6));

  const audioElementRef = useRef(null);
  const audioContextRef = useRef(null);
  const sourceNodeRef = useRef(null);
  const analyserRef = useRef(null);
  const duckingGainRef = useRef(null);
  const ambientOscillatorRef = useRef(null);
  const animFrameRef = useRef(null);
  const isPlayingRef = useRef(false);

  const activeTheme = STORY_THEMES[selectedStyle] || STORY_THEMES.storyteller;

  useEffect(() => {
    return () => {
      stopAudioPlayback();
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  /**
   * 🎛️ Initialize Web Audio DSP Mastering Chain (180Hz warmth + Dynamics Compression + Soundbed Ducking)
   */
  const initWebAudioChain = () => {
    if (!audioContextRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      // 1. Audio Element
      if (!audioElementRef.current) {
        audioElementRef.current = new Audio();
        audioElementRef.current.crossOrigin = 'anonymous';
      }

      // 2. Source Node
      try {
        const source = ctx.createMediaElementSource(audioElementRef.current);
        sourceNodeRef.current = source;

        // 3. Low-Shelf Warmth EQ (+2.5dB at 180Hz for Neumann U87 proximity effect)
        const warmthFilter = ctx.createBiquadFilter();
        warmthFilter.type = 'lowshelf';
        warmthFilter.frequency.value = 180;
        warmthFilter.gain.value = 2.5;

        // 4. De-Esser Filter (-1.5dB at 7500Hz)
        const deEsser = ctx.createBiquadFilter();
        deEsser.type = 'highshelf';
        deEsser.frequency.value = 7500;
        deEsser.gain.value = -1.5;

        // 5. Broadcast Dynamics Compressor
        const compressor = ctx.createDynamicsCompressor();
        compressor.threshold.setValueAtTime(-24, ctx.currentTime);
        compressor.knee.setValueAtTime(30, ctx.currentTime);
        compressor.ratio.setValueAtTime(4, ctx.currentTime);
        compressor.attack.setValueAtTime(0.003, ctx.currentTime);
        compressor.release.setValueAtTime(0.25, ctx.currentTime);

        // 6. Analyser Node for Realtime 22-bar spectrum
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 64;
        analyserRef.current = analyser;

        // Connect Chain: Source -> Warmth -> DeEsser -> Compressor -> Analyser -> Destination
        source.connect(warmthFilter);
        warmthFilter.connect(deEsser);
        deEsser.connect(compressor);
        compressor.connect(analyser);
        analyser.connect(ctx.destination);
      } catch (err) {
        console.warn('Web Audio node connection fallback:', err.message);
      }
    }

    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
  };

  /**
   * 📊 Real-time Web Audio Visualizer Animation Loop
   */
  const startVisualizerLoop = () => {
    const updateVisualizer = () => {
      if (analyserRef.current && isPlayingRef.current) {
        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyserRef.current.getByteFrequencyData(dataArray);

        // Map frequency bins to 22 wave bars
        const bars = [];
        for (let i = 0; i < 22; i++) {
          const binIndex = Math.floor((i / 22) * (bufferLength / 2));
          const val = dataArray[binIndex] || 0;
          const height = Math.max(4, Math.min(32, (val / 255) * 32));
          bars.push(height);
        }
        setFrequencyBars(bars);
      } else if (!isPlayingRef.current) {
        setFrequencyBars(new Array(22).fill(4));
        return;
      }
      animFrameRef.current = requestAnimationFrame(updateVisualizer);
    };
    animFrameRef.current = requestAnimationFrame(updateVisualizer);
  };

  /**
   * 🎬 The Master Storyteller Narrative Engine:
   * Translates audit metrics into 5-Act Hero's Journey
   */
  const buildStoryChapters = () => {
    const customer = instance?.customerName || 'your organization';
    const framework = instance?.frameworkSnapshot?.title || instance?.useCase || 'Architecture Assessment';
    const score = report?.overallScore || instance?.totalScore || 3.2;
    const stage = report?.maturityLevel || instance?.maturityLevel || 'Defined';
    const summary = report?.executiveSummary || 'Your architecture exhibits robust core foundations with immediate high-impact modernization frontiers.';
    const recommendations = (report?.prioritizedRecommendations || report?.prioritizedActions || []).slice(0, 3);

    const chapters = [
      {
        act: 'Act I',
        chapterTitle: 'The Landscape',
        text: `Picture this... In an era where data velocity defines market dominance, the leadership at ${customer} embarked on a vital journey: to evaluate the true architectural frontiers of the ${framework}.`
      },
      {
        act: 'Act II',
        chapterTitle: 'The Conflict',
        text: `Beneath the surface of daily operations, subtle frictions were quietly mounting... Fragile legacy batch scripts, unmonitored AI prompt token burn, and fragmented silos were silently placing engineering velocity at risk.`
      },
      {
        act: 'Act III',
        chapterTitle: 'The Epiphany',
        text: `Then came the turning point... Our comprehensive audit evaluated your overall maturity at ${score} out of 5.0, firmly placing the organization at the ${stage} stage. ${summary}`
      },
      {
        act: 'Act IV',
        chapterTitle: 'The Awakening',
        text: `Imagine what happens next... The target state unlocks Google Vertex AI Gemini 3.7 with Context Caching, shattering latency and slashing token costs by an astonishing seventy-five percent, paired with the unifying power of BigLake!`
      },
      {
        act: 'Act V',
        chapterTitle: 'The Horizon',
        text: `The path forward is clear... ${recommendations.length > 0 ? recommendations.map((r, i) => `Chapter ${i + 1}: ${r.title || r.recommendation || r.action}.`).join(' ') : 'Initiate strategic modernization waves.'} The blueprint is illuminated. The horizon is yours to claim. Chapter One begins today.`
      }
    ];

    return chapters;
  };

  const stopAudioPlayback = () => {
    isPlayingRef.current = false;
    setIsPlaying(false);

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current.src = '';
    }

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    setFrequencyBars(new Array(22).fill(4));
  };

  /**
   * ⚡ Play a single chapter using Google Cloud Journey / ElevenLabs Studio Audio
   */
  const playChapterStudio = async (chapters, index) => {
    if (!isPlayingRef.current || index >= chapters.length) {
      stopAudioPlayback();
      setCurrentChapterIdx(0);
      return;
    }

    setCurrentChapterIdx(index);
    const chap = chapters[index];

    // Attempt Server-Side Studio Synthesis (Google Journey TTS or ElevenLabs)
    if (selectedEngine !== 'browser') {
      try {
        const response = await axios.post('/api/audio/synthesize-act', {
          chapter: chap,
          persona: selectedPersona,
          style: selectedStyle,
          engine: selectedEngine,
          customApiKey: elevenLabsKey || null
        }, { timeout: 15000 });

        if (response.data && response.data.success && response.data.audioBase64) {
          initWebAudioChain();
          const audioSrc = `data:audio/mpeg;base64,${response.data.audioBase64}`;
          
          if (!audioElementRef.current) {
            audioElementRef.current = new Audio();
          }

          audioElementRef.current.src = audioSrc;
          audioElementRef.current.playbackRate = playbackRate;

          audioElementRef.current.onended = () => {
            setTimeout(() => {
              playChapterStudio(chapters, index + 1);
            }, 350);
          };

          audioElementRef.current.onerror = (e) => {
            console.warn('Audio element error, falling back to Web Speech:', e);
            playChapterBrowserFallback(chapters, index);
          };

          await audioElementRef.current.play();
          startVisualizerLoop();
          return;
        }
      } catch (err) {
        console.warn('Studio synthesis endpoint fallback to Web Speech:', err.message);
        toast('Using local neural speech synthesis fallback.', { icon: '🎙️' });
      }
    }

    // Fallback to Browser Speech Synthesis
    playChapterBrowserFallback(chapters, index);
  };

  /**
   * 🎙️ Local Browser Speech Synthesis Fallback
   */
  const playChapterBrowserFallback = (chapters, index) => {
    if (!isPlayingRef.current || index >= chapters.length) {
      stopAudioPlayback();
      setCurrentChapterIdx(0);
      return;
    }

    const chap = chapters[index];
    const utterance = new SpeechSynthesisUtterance(chap.text);
    const baseTheme = STORY_THEMES[selectedStyle] || STORY_THEMES.storyteller;
    utterance.pitch = baseTheme.pitch || 1.0;
    utterance.rate = playbackRate * (baseTheme.rate || 1.0);
    utterance.volume = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const persona = STORY_PERSONAS.find(p => p.id === selectedPersona) || STORY_PERSONAS[0];
    let matchedVoice = voices.find(v => persona.accents.some(acc => v.name.toLowerCase().includes(acc.toLowerCase())));
    if (!matchedVoice) {
      matchedVoice = voices.find(v => (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Premium')) && v.lang.startsWith('en'));
    }
    if (matchedVoice) utterance.voice = matchedVoice;

    utterance.onend = () => {
      setTimeout(() => {
        playChapterBrowserFallback(chapters, index + 1);
      }, 400);
    };

    window.speechSynthesis.speak(utterance);
    startVisualizerLoop();
  };

  const handlePlayToggle = () => {
    if (isPlaying) {
      stopAudioPlayback();
    } else {
      const chapters = buildStoryChapters();
      setChaptersList(chapters);
      setIsPlaying(true);
      isPlayingRef.current = true;
      initWebAudioChain();

      const personaName = STORY_PERSONAS.find(p => p.id === selectedPersona)?.name || 'Jonathan';
      const engineLabel = selectedEngine === 'google' 
        ? 'Google Cloud Journey (DeepMind 48kHz)' 
        : (selectedEngine === 'elevenlabs' ? 'ElevenLabs Turbo v2.5' : 'Local Browser Engine');

      toast.success(`🎬 Narrated by ${personaName} • ${engineLabel}`, { id: 'story-play', icon: activeTheme.icon });
      playChapterStudio(chapters, currentChapterIdx);
    }
  };

  const jumpToChapter = (idx) => {
    const chapters = buildStoryChapters();
    setChaptersList(chapters);
    stopAudioPlayback();
    setIsPlaying(true);
    isPlayingRef.current = true;
    initWebAudioChain();
    playChapterStudio(chapters, idx);
  };

  const cycleRate = () => {
    const rates = [0.9, 1.0, 1.2, 1.4];
    const nextRate = rates[(rates.indexOf(playbackRate) + 1) % rates.length];
    setPlaybackRate(nextRate);
    if (audioElementRef.current) {
      audioElementRef.current.playbackRate = nextRate;
    }
    toast(`Storytelling tempo set to ${nextRate}x.`, { id: 'story-speed' });
  };

  const activeChapters = chaptersList.length > 0 ? chaptersList : buildStoryChapters();
  const currentChapter = activeChapters[currentChapterIdx] || activeChapters[0];

  return (
    <PlayerContainer 
      $theme={theme}
      $activeBorder={activeTheme.border}
      $activeGlow={activeTheme.glow}
      $gradient={activeTheme.gradient}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <TopRow>
        <InfoSection $theme={theme} $gradient={activeTheme.gradient} $activeGlow={activeTheme.glow} $isPlaying={isPlaying}>
          <div className="icon-wrap">
            <FiFilm />
          </div>
          <div className="text">
            <h4>
              Cinematic Audio Briefing & Storytelling
              <EmotionTag $bg={activeTheme.bg} $color={activeTheme.color} $border={activeTheme.border}>
                {activeTheme.icon} {activeTheme.name}
              </EmotionTag>
              <EmotionTag $bg="rgba(245, 158, 11, 0.12)" $color="#d97706" $border="rgba(245, 158, 11, 0.3)">
                <HiSparkles size={12} /> {selectedEngine === 'google' ? 'Google Journey Studio 48kHz' : '5-Act Narrative Arc'}
              </EmotionTag>
            </h4>
            <p>Narrated by <strong>{STORY_PERSONAS.find(p => p.id === selectedPersona)?.name}</strong> — <em>"{STORY_PERSONAS.find(p => p.id === selectedPersona)?.vibe}"</em></p>
          </div>
        </InfoSection>

        {/* 22-Bar Live Web Audio DSP Visualizer */}
        <WaveContainer>
          {frequencyBars.map((barHeight, idx) => (
            <WaveBar 
              key={idx} 
              $delay={idx * 0.04} 
              $playing={isPlaying}
              $height={isPlaying ? barHeight : 4}
              $gradient={activeTheme.gradient}
              $realtime={true}
            />
          ))}
        </WaveContainer>

        <ControlsGroup>
          <SecondaryControl $theme={theme} onClick={() => setShowSettings(!showSettings)} $active={showSettings} title="Voice Engine, Studio Casting & Narrative Arc">
            <FiSliders size={13} /> {showSettings ? 'Hide Studio' : 'Voice Studio & Engine'}
          </SecondaryControl>

          <SecondaryControl $theme={theme} onClick={cycleRate} title="Change speech tempo">
            <FiFastForward size={13} /> {playbackRate}x
          </SecondaryControl>

          <SecondaryControl $theme={theme} onClick={stopAudioPlayback} title="Stop Audio">
            <FiSquare size={13} /> Stop
          </SecondaryControl>

          <PlayButton 
            $gradient={activeTheme.gradient}
            $activeGlow={activeTheme.glow}
            onClick={handlePlayToggle}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {isPlaying ? <FiPause size={16} /> : <FiPlay size={16} />}
            {isPlaying ? 'Pause Story' : 'Begin Story'}
          </PlayButton>
        </ControlsGroup>
      </TopRow>

      {/* 5-Act Chapter Progression Timeline */}
      <ChapterBar $theme={theme}>
        {activeChapters.map((chap, idx) => (
          <ChapterPill
            key={idx}
            $theme={theme}
            $active={isPlaying && currentChapterIdx === idx}
            $gradient={activeTheme.gradient}
            onClick={() => jumpToChapter(idx)}
            title={`Jump to ${chap.act}: ${chap.chapterTitle}`}
          >
            <span className="act-label">{chap.act}</span>
            <span className="act-title">{chap.chapterTitle}</span>
          </ChapterPill>
        ))}
      </ChapterBar>

      {/* Live Theatrical Teleprompter */}
      <AnimatePresence>
        {isPlaying && (
          <StoryTeleprompter 
            $theme={theme}
            $activeColor={activeTheme.color}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className="quote-symbol">“</div>
            <div className="text-content">
              {currentChapter?.text}
            </div>
            <div className="chapter-badge">
              {currentChapter?.act}: {currentChapter?.chapterTitle}
            </div>
          </StoryTeleprompter>
        )}
      </AnimatePresence>

      {/* Expanded Studio Casting & Voice Engine Drawer */}
      <AnimatePresence>
        {showSettings && (
          <SettingsPanel 
            $theme={theme}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* 1. Synthesis Engine Selector */}
            <ControlCard $theme={theme}>
              <div className="label">
                <FiCpu size={13} />
                Neural Audio Synthesizer Engine
              </div>
              <div className="options-grid">
                <OptionPill
                  $theme={theme}
                  $active={selectedEngine === 'google'}
                  $gradient={activeTheme.gradient}
                  onClick={() => {
                    setSelectedEngine('google');
                    stopAudioPlayback();
                    toast.success('Switched to Google Cloud Journey Studio (DeepMind 48kHz Neural)', { icon: '🌌' });
                  }}
                >
                  <span>🌌 Google Cloud Journey</span>
                  <span style={{ fontSize: '0.68rem', opacity: 0.85 }}>DeepMind Studio 48kHz</span>
                </OptionPill>

                <OptionPill
                  $theme={theme}
                  $active={selectedEngine === 'elevenlabs'}
                  $gradient={activeTheme.gradient}
                  onClick={() => {
                    setSelectedEngine('elevenlabs');
                    stopAudioPlayback();
                    toast.success('Switched to ElevenLabs Multilingual v2', { icon: '🎙️' });
                  }}
                >
                  <span>🎙️ ElevenLabs BYOK</span>
                  <span style={{ fontSize: '0.68rem', opacity: 0.85 }}>Turbo v2.5 / Multilingual</span>
                </OptionPill>

                <OptionPill
                  $theme={theme}
                  $active={selectedEngine === 'browser'}
                  $gradient={activeTheme.gradient}
                  onClick={() => {
                    setSelectedEngine('browser');
                    stopAudioPlayback();
                    toast('Switched to Local Browser Synthesizer', { icon: '💻' });
                  }}
                >
                  <span>💻 Local Browser TTS</span>
                  <span style={{ fontSize: '0.68rem', opacity: 0.85 }}>Offline Fallback</span>
                </OptionPill>

                {selectedEngine === 'elevenlabs' && (
                  <div>
                    <label style={{ fontSize: '0.72rem', color: theme === 'dark' ? '#94a3b8' : '#64748b' }}>Custom ElevenLabs API Key (Optional):</label>
                    <ApiKeyInput 
                      $theme={theme}
                      type="password"
                      placeholder="sk_..."
                      value={elevenLabsKey}
                      onChange={(e) => setElevenLabsKey(e.target.value)}
                    />
                  </div>
                )}
              </div>
            </ControlCard>

            {/* 2. Storytelling Style & Narrative Arc */}
            <ControlCard $theme={theme}>
              <div className="label">
                <FiFilm size={13} />
                Narrative Arc & Emotional Delivery
              </div>
              <div className="options-grid">
                {Object.entries(STORY_THEMES).map(([key, item]) => (
                  <OptionPill
                    key={key}
                    $theme={theme}
                    $active={selectedStyle === key}
                    $gradient={item.gradient}
                    onClick={() => {
                      setSelectedStyle(key);
                      stopAudioPlayback();
                      toast.success(`Storytelling style: ${item.name}`, { icon: item.icon });
                    }}
                  >
                    <span>{item.icon} {item.name}</span>
                    <span style={{ fontSize: '0.68rem', opacity: 0.8 }}>({item.tagline.split(' ')[0]})</span>
                  </OptionPill>
                ))}
              </div>
            </ControlCard>

            {/* 3. Master Storyteller Voice Casting */}
            <ControlCard $theme={theme}>
              <div className="label">
                <FiUser size={13} />
                Studio Master Voice Casting
              </div>
              <div className="options-grid">
                {STORY_PERSONAS.map((persona) => (
                  <OptionPill
                    key={persona.id}
                    $theme={theme}
                    $active={selectedPersona === persona.id}
                    $gradient={activeTheme.gradient}
                    onClick={() => {
                      setSelectedPersona(persona.id);
                      stopAudioPlayback();
                      toast.success(`Voice Cast: ${persona.name} (${persona.googleVoice})`, { icon: '🎙️' });
                    }}
                  >
                    <span>🎙️ {persona.name}</span>
                    <span style={{ fontSize: '0.68rem', opacity: 0.8 }}>{persona.gender}</span>
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
