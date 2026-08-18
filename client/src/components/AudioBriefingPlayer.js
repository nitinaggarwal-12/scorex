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
  FiFileText,
  FiBookOpen,
  FiCompass,
  FiSun,
  FiFilm,
  FiRadio,
  FiSkipForward,
  FiSkipBack
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
  { id: 'jonathan', name: 'Sir Jonathan', title: 'Cinematic Documentary Narrator', gender: 'male', vibe: 'Warm, deep & theatrical', accents: ['Daniel', 'Google UK English Male', 'Oliver', 'George'] },
  { id: 'victoria', name: 'Victoria', title: 'MasterClass & Odyssey Storyteller', gender: 'female', vibe: 'Magnetic, eloquent & expressive', accents: ['Samantha', 'Google UK English Female', 'Karen', 'Victoria'] },
  { id: 'david', name: 'David', title: 'Visionary Tech Orator', gender: 'male', vibe: 'Inspiring, resonant & punchy', accents: ['Google US English', 'Alex', 'Fred', 'Arthur'] },
  { id: 'maya', name: 'Maya', title: 'NPR & Investigative Novelist', gender: 'female', vibe: 'Curious, lively & poignant', accents: ['Tessa', 'Moira', 'Fiona', 'Google US English'] }
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
  animation: ${wave} 1.3s ease-in-out infinite;
  animation-delay: ${props => props.$delay}s;
  animation-play-state: ${props => props.$playing ? 'running' : 'paused'};
  height: ${props => props.$playing ? `${props.$height || 22}px` : '4px'};
  transition: height 0.25s ease;
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
  background: ${props => props.$active 
    ? (props.$theme === 'dark' ? 'rgba(255, 255, 255, 0.18)' : '#e2e8f0') 
    : (props.$theme === 'dark' ? 'rgba(255, 255, 255, 0.06)' : '#f8fafc')};
  border: 1px solid ${props => props.$theme === 'dark' ? 'rgba(255, 255, 255, 0.14)' : '#cbd5e1'};
  color: ${props => props.$theme === 'dark' ? '#f1f5f9' : '#334155'};
  padding: 9px 15px;
  border-radius: 12px;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.$theme === 'dark' ? 'rgba(255, 255, 255, 0.15)' : '#e2e8f0'};
    color: ${props => props.$theme === 'dark' ? '#ffffff' : '#0f172a'};
    transform: translateY(-1px);
  }
`;

// Chapter / Story-Beat Progression Timeline
const ChapterBar = styled.div`
  margin-top: 18px;
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
`;

const ChapterPill = styled.button`
  flex: 1;
  min-width: 140px;
  background: ${props => props.$active 
    ? (props.$gradient || 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)') 
    : (props.$theme === 'dark' ? 'rgba(15, 23, 42, 0.6)' : '#ffffff')};
  border: 1px solid ${props => props.$active 
    ? 'transparent' 
    : (props.$theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#e2e8f0')};
  border-radius: 12px;
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;
  box-shadow: ${props => props.$active ? '0 4px 14px rgba(245, 158, 11, 0.3)' : 'none'};

  .act-label {
    font-size: 0.68rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: ${props => props.$active ? '#ffffff' : (props.$theme === 'dark' ? '#94a3b8' : '#64748b')};
  }

  .act-title {
    font-size: 0.76rem;
    font-weight: 700;
    color: ${props => props.$active ? '#ffffff' : (props.$theme === 'dark' ? '#f1f5f9' : '#1e293b')};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
  }

  &:hover {
    transform: translateY(-1px);
    border-color: ${props => props.$active ? 'transparent' : '#f59e0b'};
  }
`;

// Live Cinematic Story Teleprompter
const StoryTeleprompter = styled(motion.div)`
  margin-top: 16px;
  padding: 16px 20px;
  border-radius: 16px;
  background: ${props => props.$theme === 'dark' ? 'rgba(2, 6, 23, 0.75)' : 'rgba(255, 251, 235, 0.85)'};
  border-left: 5px solid ${props => props.$activeColor || '#f59e0b'};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.04);

  .quote-symbol {
    font-size: 2rem;
    line-height: 1;
    color: ${props => props.$activeColor || '#f59e0b'};
    opacity: 0.6;
    font-family: Georgia, serif;
    flex-shrink: 0;
  }

  .text-content {
    font-size: 0.92rem;
    font-style: italic;
    color: ${props => props.$theme === 'dark' ? '#f8fafc' : '#1e293b'};
    line-height: 1.6;
    font-weight: 500;
    flex-grow: 1;
  }

  .chapter-badge {
    font-size: 0.72rem;
    font-weight: 800;
    padding: 4px 10px;
    border-radius: 8px;
    background: ${props => props.$activeColor ? `${props.$activeColor}25` : 'rgba(245, 158, 11, 0.15)'};
    color: ${props => props.$activeColor || '#d97706'};
    white-space: nowrap;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    flex-shrink: 0;
  }
`;

// Expanded Settings Panel
const SettingsPanel = styled(motion.div)`
  border-top: 1px solid ${props => props.$theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : '#e2e8f0'};
  padding-top: 18px;
  margin-top: 18px;
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 16px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const ControlCard = styled.div`
  background: ${props => props.$theme === 'dark' ? 'rgba(15, 23, 42, 0.5)' : '#ffffff'};
  border: 1px solid ${props => props.$theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : '#e2e8f0'};
  border-radius: 16px;
  padding: 14px 18px;

  .label {
    font-size: 0.78rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: ${props => props.$theme === 'dark' ? '#94a3b8' : '#64748b'};
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 7px;
  }

  .options-grid {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }
`;

const OptionPill = styled.button`
  background: ${props => props.$active 
    ? (props.$gradient || 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)') 
    : (props.$theme === 'dark' ? 'rgba(255, 255, 255, 0.04)' : '#f8fafc')};
  color: ${props => props.$active ? '#ffffff' : (props.$theme === 'dark' ? '#cbd5e1' : '#475569')};
  border: 1px solid ${props => props.$active ? 'transparent' : (props.$theme === 'dark' ? 'rgba(255, 255, 255, 0.12)' : '#cbd5e1')};
  padding: 7px 14px;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: ${props => props.$active ? '800' : '600'};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.$active ? 'transparent' : '#f59e0b'};
    transform: translateY(-1px);
  }
`;

const AudioBriefingPlayer = ({ instance, report, theme = "light" }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [selectedStyle, setSelectedStyle] = useState('storyteller');
  const [selectedPersona, setSelectedPersona] = useState('jonathan');
  const [showSettings, setShowSettings] = useState(false);
  const [currentChapterIdx, setCurrentChapterIdx] = useState(0);
  const [chaptersList, setChaptersList] = useState([]);

  const utteranceRef = useRef(null);
  const keepAliveTimerRef = useRef(null);
  const isPlayingRef = useRef(false);

  const activeTheme = STORY_THEMES[selectedStyle] || STORY_THEMES.storyteller;

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
   * 🎬 The Master Storyteller Narrative Engine:
   * Translates the audit data into a captivating 5-Act Hero's Journey Odyssey.
   */
  const buildStoryChapters = () => {
    const customer = instance?.customerName || 'your organization';
    const framework = instance?.frameworkSnapshot?.title || instance?.useCase || 'Architecture Assessment';
    const score = report?.overallScore || instance?.totalScore || 3.0;
    const stage = report?.maturityLevel || instance?.maturityLevel || 'Defined';
    const summary = stripMarkdownForSpeech(report?.executiveSummary || 'Your architecture exhibits robust core foundations with immediate high-impact modernization frontiers.');
    const recommendations = (report?.prioritizedRecommendations || report?.prioritizedActions || []).slice(0, 3);

    const chapters = [];

    // Act I: The Landscape & The Status Quo (Atmospheric, Scene-Setting)
    chapters.push({
      act: 'Act I',
      chapterTitle: 'The Landscape',
      pitchMod: -0.04,
      rateMod: -0.06,
      text: `Picture this... In an era where data velocity defines market dominance, the leadership at ${customer} embarked on a vital journey: to evaluate the true architectural frontiers of the ${framework}.`
    });

    // Act II: The Hidden Nemesis & The Conflict (Suspenseful, Whispered Urgency)
    chapters.push({
      act: 'Act II',
      chapterTitle: 'The Conflict',
      pitchMod: -0.08,
      rateMod: -0.02,
      text: `Beneath the surface of daily operations, subtle frictions were quietly mounting... Fragile legacy batch scripts, unmonitored AI prompt token burn, and fragmented silos were silently placing engineering velocity at risk.`
    });

    // Act III: The Moment of Clarity (Dramatic Epiphany)
    chapters.push({
      act: 'Act III',
      chapterTitle: 'The Epiphany',
      pitchMod: +0.02,
      rateMod: 0.0,
      text: `Then came the turning point... Our comprehensive audit evaluated your overall maturity at ${score} out of 5.0, firmly placing the organization at the ${stage} stage. ${summary}`
    });

    // Act IV: The Triumphant Awakening (Soaring Target State Vision)
    chapters.push({
      act: 'Act IV',
      chapterTitle: 'The Awakening',
      pitchMod: +0.10,
      rateMod: +0.05,
      text: `Imagine what happens next... The target state unlocks Google Vertex AI Gemini 3.7 with Context Caching, shattering latency and slashing token costs by an astonishing seventy-five percent, paired with the unifying power of BigLake!`
    });

    // Act V: The Heroic Horizon (Call to Adventure & Action)
    if (recommendations.length > 0) {
      let recText = `The path forward is clear... `;
      recommendations.forEach((rec, idx) => {
        const title = stripMarkdownForSpeech(rec.title || rec.recommendation || rec.action || 'Strategic Modernization Wave');
        recText += `First, Chapter ${idx + 1}... ${title}... `;
      });
      recText += `The blueprint is illuminated. The horizon is yours to claim. Chapter One begins today.`;

      chapters.push({
        act: 'Act V',
        chapterTitle: 'The Horizon',
        pitchMod: -0.02,
        rateMod: -0.03,
        text: recText
      });
    }

    return chapters;
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

  const playChapter = (chapters, index) => {
    if (!isPlayingRef.current || index >= chapters.length) {
      stopAudioPlayback();
      setCurrentChapterIdx(0);
      return;
    }

    setCurrentChapterIdx(index);
    const chap = chapters[index];
    const utterance = new SpeechSynthesisUtterance(chap.text);

    // Apply Storyteller emotional prosody modulation
    const baseTheme = STORY_THEMES[selectedStyle] || STORY_THEMES.storyteller;
    utterance.pitch = Math.max(0.6, Math.min(1.8, (baseTheme.pitch || 1.0) + (chap.pitchMod || 0)));
    utterance.rate = Math.max(0.7, Math.min(1.6, (playbackRate * (baseTheme.rate || 1.0)) + (chap.rateMod || 0)));
    utterance.volume = baseTheme.volume || 1.0;

    // Resolve theatrical voice persona
    const voices = window.speechSynthesis.getVoices();
    const persona = STORY_PERSONAS.find(p => p.id === selectedPersona) || STORY_PERSONAS[0];
    
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
      // Dramatic pause between chapters (400ms for theatrical absorption)
      setTimeout(() => {
        playChapter(chapters, index + 1);
      }, 400);
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis chapter transition:', e);
      setTimeout(() => {
        playChapter(chapters, index + 1);
      }, 250);
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

        const chapters = buildStoryChapters();
        setChaptersList(chapters);
        setIsPlaying(true);
        isPlayingRef.current = true;

        if (keepAliveTimerRef.current) {
          clearInterval(keepAliveTimerRef.current);
        }
        keepAliveTimerRef.current = setInterval(() => {
          if (window.speechSynthesis && window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
            window.speechSynthesis.pause();
            window.speechSynthesis.resume();
          }
        }, 10000);

        playChapter(chapters, 0);
        const personaName = STORY_PERSONAS.find(p => p.id === selectedPersona)?.name;
        toast.success(`🎬 Storytelling by ${personaName} • Arc: ${activeTheme.name}`, { id: 'story-play', icon: activeTheme.icon });
      }
    }
  };

  const jumpToChapter = (idx) => {
    const chapters = buildStoryChapters();
    setChaptersList(chapters);
    window.speechSynthesis.cancel();
    setIsPlaying(true);
    isPlayingRef.current = true;
    playChapter(chapters, idx);
  };

  const cycleRate = () => {
    const rates = [0.9, 1.0, 1.2, 1.4];
    const nextRate = rates[(rates.indexOf(playbackRate) + 1) % rates.length];
    setPlaybackRate(nextRate);
    if (isPlaying) {
      stopAudioPlayback();
      toast(`Storytelling tempo set to ${nextRate}x. Restart to apply.`, { id: 'story-speed' });
    }
  };

  const currentChapter = chaptersList[currentChapterIdx] || {
    act: 'Master Storyteller',
    chapterTitle: 'The Architectural Odyssey',
    text: 'A cinematic 5-act narrative transforming technical metrics into an inspiring C-suite transformation story.'
  };

  const activeChapters = chaptersList.length > 0 ? chaptersList : buildStoryChapters();

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
                <HiSparkles size={12} /> 5-Act Narrative Arc
              </EmotionTag>
            </h4>
            <p>Narrated by <strong>{STORY_PERSONAS.find(p => p.id === selectedPersona)?.name}</strong> — <em>"{STORY_PERSONAS.find(p => p.id === selectedPersona)?.vibe}"</em></p>
          </div>
        </InfoSection>

        {/* 22-Bar Theatrical Animated Waveform */}
        <WaveContainer>
          {[
            10, 22, 16, 30, 14, 26, 18, 32, 22, 16,
            28, 12, 26, 20, 32, 14, 24, 18, 22, 12, 26, 8
          ].map((barHeight, idx) => (
            <WaveBar 
              key={idx} 
              $delay={idx * 0.05} 
              $playing={isPlaying}
              $height={barHeight}
              $gradient={activeTheme.gradient}
            />
          ))}
        </WaveContainer>

        <ControlsGroup>
          <SecondaryControl $theme={theme} onClick={() => setShowSettings(!showSettings)} $active={showSettings} title="Storytelling Arc & Narrator Casting">
            <FiSliders size={13} /> {showSettings ? 'Hide Narrator' : 'Story Style & Voices'}
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
      <ChapterBar>
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
              {currentChapter.text}
            </div>
            <div className="chapter-badge">
              {currentChapter.act}: {currentChapter.chapterTitle}
            </div>
          </StoryTeleprompter>
        )}
      </AnimatePresence>

      {/* Expanded Story Style & Voice Casting Drawer */}
      <AnimatePresence>
        {showSettings && (
          <SettingsPanel 
            $theme={theme}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* 1. Storytelling Style & Narrative Arc */}
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
                      if (isPlaying) {
                        stopAudioPlayback();
                        toast.success(`Storytelling style set to ${item.name}. Click Begin Story to experience.`, { icon: item.icon });
                      }
                    }}
                  >
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                    <span style={{ fontSize: '0.68rem', opacity: 0.8 }}>({item.tagline.split(' ')[0]})</span>
                  </OptionPill>
                ))}
              </div>
            </ControlCard>

            {/* 2. Master Storyteller Voice Casting */}
            <ControlCard $theme={theme}>
              <div className="label">
                <FiUser size={13} />
                Master Storyteller Voice Casting
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
                      if (isPlaying) {
                        stopAudioPlayback();
                        toast.success(`Narrator cast: ${persona.name}. Restart story to apply.`, { icon: '🎙️' });
                      }
                    }}
                  >
                    <span>{persona.gender === 'female' ? '👩‍💼' : '🎙️'}</span>
                    <span>{persona.name}</span>
                    <span style={{ fontSize: '0.68rem', opacity: 0.85 }}>({persona.title.split(' ')[0]})</span>
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

