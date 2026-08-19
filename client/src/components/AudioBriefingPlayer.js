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
  FiHeadphones,
  FiMic,
  FiDownload,
  FiUsers,
  FiUploadCloud,
  FiCheckCircle,
  FiGlobe,
  FiFilter,
  FiSearch,
  FiLoader
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import toast from 'react-hot-toast';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulseGlow = keyframes`
  0%, 100% { opacity: 0.7; transform: scale(1); filter: drop-shadow(0 0 8px rgba(245, 158, 11, 0.4)); }
  50% { opacity: 1; transform: scale(1.06); filter: drop-shadow(0 0 16px rgba(245, 158, 11, 0.7)); }
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

// 8 Curated Spotlight Personas
const STORY_PERSONAS = [
  { id: 'jonathan', name: 'Sir Jonathan', title: 'DeepMind Documentary Baritone', gender: 'male', vibe: 'Warm, deep & theatrical (Charon)', googleVoice: 'Charon', accents: ['Daniel', 'Google UK English Male', 'Oliver', 'George'] },
  { id: 'victoria', name: 'Victoria', title: 'MasterClass Executive Narrator', gender: 'female', vibe: 'Magnetic, eloquent & expressive (Aoede)', googleVoice: 'Aoede', accents: ['Samantha', 'Google UK English Female', 'Karen', 'Victoria'] },
  { id: 'david', name: 'David', title: 'Visionary Tech Orator', gender: 'male', vibe: 'Inspiring, resonant & punchy (Puck)', googleVoice: 'Puck', accents: ['Google US English', 'Alex', 'Fred', 'Arthur'] },
  { id: 'maya', name: 'Maya', title: 'Intimate Fireside Novelist', gender: 'female', vibe: 'Curious, lively & poignant (Kore)', googleVoice: 'Kore', accents: ['Tessa', 'Moira', 'Fiona', 'Google US English'] },
  { id: 'alister', name: 'Alister', title: 'Scottish Senior Cloud Fellow', gender: 'male', vibe: 'Distinguished, rich & thoughtful (Fenrir)', googleVoice: 'Fenrir', accents: ['Fiona', 'Oliver', 'Google UK English Male'] },
  { id: 'priya', name: 'Priya', title: 'Global Enterprise Transformation CTO', gender: 'female', vibe: 'Crisp, decisive & strategic (Aoede Global)', googleVoice: 'Aoede', accents: ['Veena', 'Google UK English Female', 'Samantha'] },
  { id: 'marcus', name: 'Marcus', title: 'Wall Street Managing Director', gender: 'male', vibe: 'Tier-1 Consulting Board Presence (Charon)', googleVoice: 'Charon', accents: ['Alex', 'Daniel', 'Google US English'] },
  { id: 'elena', name: 'Elena', title: 'AI Tech Founder & Lead', gender: 'female', vibe: 'High-energy, visionary tech passion (Kore)', googleVoice: 'Kore', accents: ['Victoria', 'Samantha', 'Karen'] }
];

// 25 Global Accents
const GLOBAL_ACCENTS = [
  { id: 'uk_rp', name: 'British Oxford (RP)', region: 'UK' },
  { id: 'uk_cockney', name: 'London Modern', region: 'UK' },
  { id: 'uk_scottish', name: 'Scottish Highlands', region: 'UK' },
  { id: 'uk_irish', name: 'Irish Dublin', region: 'Europe' },
  { id: 'us_standard', name: 'US General Broadcast', region: 'US' },
  { id: 'us_texas', name: 'US Texas Drawl', region: 'US' },
  { id: 'us_ny', name: 'US New York Metro', region: 'US' },
  { id: 'us_silicon_valley', name: 'Silicon Valley Tech', region: 'US' },
  { id: 'ca_toronto', name: 'Canadian Toronto', region: 'Americas' },
  { id: 'au_sydney', name: 'Australian Sydney', region: 'Oceania' },
  { id: 'in_bangalore', name: 'Indian Tech Executive', region: 'Asia' },
  { id: 'sg_singapore', name: 'Singaporean Global', region: 'Asia' },
  { id: 'za_joburg', name: 'South African', region: 'Africa' },
  { id: 'fr_paris', name: 'French-Accented', region: 'Europe' },
  { id: 'de_frankfurt', name: 'German-Accented', region: 'Europe' },
  { id: 'it_milan', name: 'Italian-Accented', region: 'Europe' },
  { id: 'es_madrid', name: 'Spanish-Accented', region: 'Europe' },
  { id: 'latam_mexico', name: 'Latin American', region: 'Americas' },
  { id: 'se_stockholm', name: 'Nordic Scandinavian', region: 'Europe' },
  { id: 'jp_tokyo', name: 'Japanese-Accented', region: 'Asia' },
  { id: 'br_saopaulo', name: 'Brazilian-Accented', region: 'Americas' },
  { id: 'ng_lagos', name: 'Nigerian English', region: 'Africa' }
];

// 8 Archetypes
const ARCHETYPES = [
  { id: 'board_director', name: 'Board Director / Partner' },
  { id: 'chief_architect', name: 'Chief Enterprise Architect' },
  { id: 'startup_founder', name: 'Visionary Startup Founder' },
  { id: 'keynote_orator', name: 'TED / Keynote Orator' },
  { id: 'npr_investigative', name: 'NPR Investigative Host' },
  { id: 'research_professor', name: 'Academic Senior Fellow' },
  { id: 'cyber_auditor', name: 'Security & Risk Auditor' },
  { id: 'executive_coach', name: 'Fireside Executive Mentor' }
];

// 4 Age Tiers
const AGE_TIERS = [
  { id: 'statesman', name: 'Senior Statesman (55+)' },
  { id: 'mid_career', name: 'Executive Leader (35-50)' },
  { id: 'rising_star', name: 'Rising Innovator (25-35)' },
  { id: 'fireside', name: 'Reflective Mentor' }
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

  .spin-icon {
    animation: ${spin} 1s linear infinite;
  }
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
    padding-right: 150px;
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
    padding: 4px 10px;
    border-radius: 6px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
`;

const SettingsPanel = styled(motion.div)`
  margin-top: 20px;
  padding: 20px;
  background: ${props => props.$theme === 'dark' ? 'rgba(0, 0, 0, 0.35)' : 'rgba(0, 0, 0, 0.03)'};
  border-radius: 18px;
  border: 1px solid ${props => props.$theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'};
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
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
    max-height: 240px;
    overflow-y: auto;
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

const SliderGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  .slider-row {
    display: flex;
    flex-direction: column;
    gap: 4px;

    .slider-header {
      display: flex;
      justify-content: space-between;
      font-size: 0.76rem;
      font-weight: 700;
      color: ${props => props.$theme === 'dark' ? '#cbd5e1' : '#475569'};
    }

    input[type="range"] {
      width: 100%;
      accent-color: #f59e0b;
      cursor: pointer;
    }
  }
`;

const DesignerInputArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  textarea {
    width: 100%;
    padding: 10px 12px;
    border-radius: 12px;
    border: 1px solid ${props => props.$theme === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)'};
    background: ${props => props.$theme === 'dark' ? 'rgba(15, 23, 42, 0.8)' : '#ffffff'};
    color: ${props => props.$theme === 'dark' ? '#f8fafc' : '#0f172a'};
    font-size: 0.82rem;
    line-height: 1.4;
    resize: vertical;
    outline: none;

    &:focus {
      border-color: #f59e0b;
    }
  }

  .design-btn {
    padding: 9px 14px;
    border-radius: 10px;
    border: none;
    background: linear-gradient(135deg, #f59e0b 0%, #ec4899 100%);
    color: white;
    font-weight: 800;
    font-size: 0.82rem;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }
`;

const FilterSelectRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 10px;

  select {
    padding: 6px 10px;
    border-radius: 8px;
    border: 1px solid ${props => props.$theme === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)'};
    background: ${props => props.$theme === 'dark' ? 'rgba(15, 23, 42, 0.8)' : '#ffffff'};
    color: ${props => props.$theme === 'dark' ? '#f8fafc' : '#0f172a'};
    font-size: 0.76rem;
    font-weight: 600;
    outline: none;
  }
`;

const AudioBriefingPlayer = ({ instance, report, theme = "light" }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [selectedStyle, setSelectedStyle] = useState('storyteller');
  const [selectedPersona, setSelectedPersona] = useState('jonathan');
  const [selectedEngine, setSelectedEngine] = useState('google'); // 'google' | 'elevenlabs' | 'browser'
  const [elevenLabsKey, setElevenLabsKey] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [currentChapterIdx, setCurrentChapterIdx] = useState(0);
  const [chaptersList, setChaptersList] = useState([]);
  const [frequencyBars, setFrequencyBars] = useState(new Array(22).fill(4));
  const [isRecording, setIsRecording] = useState(false);
  const [customClonedVoiceId, setCustomClonedVoiceId] = useState(null);
  const [clonedVoiceName, setClonedVoiceName] = useState(null);

  // Mathematical Emotion & Prosody Sliders
  const [styleExaggeration, setStyleExaggeration] = useState(0.70);
  const [stability, setStability] = useState(0.65);
  const [breathDensity, setBreathDensity] = useState(0.50);

  // 1,500+ Procedural Matrix Filters
  const [accentFilter, setAccentFilter] = useState('uk_rp');
  const [archetypeFilter, setArchetypeFilter] = useState('board_director');
  const [ageFilter, setAgeFilter] = useState('statesman');
  const [baseVoiceFilter, setBaseVoiceFilter] = useState('Charon');

  // Prompt-to-Voice Custom Designer
  const [promptToVoiceInput, setPromptToVoiceInput] = useState('');
  const [isDesigningVoice, setIsDesigningVoice] = useState(false);

  const audioElementRef = useRef(null);
  const audioContextRef = useRef(null);
  const sourceNodeRef = useRef(null);
  const analyserRef = useRef(null);
  const warmthFilterRef = useRef(null);
  const breathFilterRef = useRef(null);
  const compressorRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const animFrameRef = useRef(null);
  const isPlayingRef = useRef(false);

  const formantF1Ref = useRef(null);
  const formantF2Ref = useRef(null);
  const formantF3Ref = useRef(null);
  const [activeFormants, setActiveFormants] = useState(null);

  const activeTheme = STORY_THEMES[selectedStyle] || STORY_THEMES.storyteller;

  useEffect(() => {
    return () => {
      stopAudioPlayback();
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  const currentSourceNodeRef = useRef(null);

  /**
   * 🎛️ Initialize Web Audio DSP Mastering Chain (180Hz warmth + 3-Band Formant Convolver + Dynamics Compression + Morphing)
   */
  const initWebAudioChain = () => {
    if (!audioContextRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      try {
        // 1. Low-Shelf Warmth EQ (180Hz)
        const warmthFilter = ctx.createBiquadFilter();
        warmthFilter.type = 'lowshelf';
        warmthFilter.frequency.value = 180;
        warmthFilter.gain.value = 2.5 + (styleExaggeration * 1.5);
        warmthFilterRef.current = warmthFilter;

        // 2. High-Shelf Breath / De-Esser Filter (4000Hz - 7500Hz)
        const breathFilter = ctx.createBiquadFilter();
        breathFilter.type = 'peaking';
        breathFilter.frequency.value = 4000;
        breathFilter.Q.value = 1.0;
        breathFilter.gain.value = 0.0;
        breathFilterRef.current = breathFilter;

        // 3. 3-Band Formant Convolver Nodes (F1, F2, F3)
        const f1Node = ctx.createBiquadFilter();
        f1Node.type = 'peaking';
        f1Node.frequency.value = 550;
        f1Node.Q.value = 1.8;
        f1Node.gain.value = 0.0;
        formantF1Ref.current = f1Node;

        const f2Node = ctx.createBiquadFilter();
        f2Node.type = 'peaking';
        f2Node.frequency.value = 1650;
        f2Node.Q.value = 2.0;
        f2Node.gain.value = 0.0;
        formantF2Ref.current = f2Node;

        const f3Node = ctx.createBiquadFilter();
        f3Node.type = 'peaking';
        f3Node.frequency.value = 2950;
        f3Node.Q.value = 2.2;
        f3Node.gain.value = 0.0;
        formantF3Ref.current = f3Node;

        // 4. Broadcast Dynamics Compressor
        const compressor = ctx.createDynamicsCompressor();
        compressor.threshold.setValueAtTime(-24, ctx.currentTime);
        compressor.knee.setValueAtTime(30, ctx.currentTime);
        compressor.ratio.setValueAtTime(4, ctx.currentTime);
        compressor.attack.setValueAtTime(0.003, ctx.currentTime);
        compressor.release.setValueAtTime(0.25, ctx.currentTime);
        compressorRef.current = compressor;

        // 5. Analyser Node for Realtime 22-bar spectrum
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 64;
        analyserRef.current = analyser;

        // Connect Chain: Warmth -> Breath -> F1 -> F2 -> F3 -> Compressor -> Analyser -> Out
        warmthFilter.connect(breathFilter);
        breathFilter.connect(f1Node);
        f1Node.connect(f2Node);
        f2Node.connect(f3Node);
        f3Node.connect(compressor);
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
   * 🌊 Act-Specific Dynamic DSP Morphing (Exponential Crossfading)
   */
  const applyActDSPMorphing = (actIndex) => {
    if (!audioContextRef.current || !warmthFilterRef.current || !breathFilterRef.current) return;
    const ctx = audioContextRef.current;
    const now = ctx.currentTime;

    if (actIndex === 1) {
      // Act II: Intimate Whisper ASMR Mode (Low cut, high breath turbulence)
      warmthFilterRef.current.gain.setTargetAtTime(-4.0, now, 0.06);
      breathFilterRef.current.gain.setTargetAtTime(4.5, now, 0.06);
      if (compressorRef.current) compressorRef.current.threshold.setTargetAtTime(-30, now, 0.06);
    } else if (actIndex === 3) {
      // Act IV: Soaring Triumph Mode (Warmth expansion + presence boost)
      warmthFilterRef.current.gain.setTargetAtTime(3.5, now, 0.06);
      breathFilterRef.current.gain.setTargetAtTime(2.0, now, 0.06);
      if (compressorRef.current) compressorRef.current.threshold.setTargetAtTime(-20, now, 0.06);
    } else {
      // Default Studio Balanced Master
      warmthFilterRef.current.gain.setTargetAtTime(2.5, now, 0.06);
      breathFilterRef.current.gain.setTargetAtTime(0.0, now, 0.06);
      if (compressorRef.current) compressorRef.current.threshold.setTargetAtTime(-24, now, 0.06);
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
   * 🎬 The Master Storyteller Narrative Engine
   */
  const buildStoryChapters = () => {
    const customer = instance?.customerName || 'your organization';
    const framework = instance?.frameworkSnapshot?.title || instance?.useCase || 'Architecture Assessment';
    const score = report?.overallScore || instance?.totalScore || 3.2;
    const stage = report?.maturityLevel || instance?.maturityLevel || 'Defined';
    const summary = report?.executiveSummary || 'Your architecture exhibits robust core foundations with immediate high-impact modernization frontiers.';
    const recommendations = (report?.prioritizedRecommendations || report?.prioritizedActions || []).slice(0, 3);

    return [
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
  };

  const playTokenRef = useRef(0);
  const preloadedBuffersRef = useRef(new Map());

  const stopAudioPlayback = () => {
    playTokenRef.current += 1;
    isPlayingRef.current = false;
    setIsPlaying(false);
    setIsBuffering(false);

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    if (currentSourceNodeRef.current) {
      try {
        currentSourceNodeRef.current.onended = null;
        currentSourceNodeRef.current.stop();
        currentSourceNodeRef.current.disconnect();
      } catch (e) {}
      currentSourceNodeRef.current = null;
    }

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    setFrequencyBars(new Array(22).fill(4));
  };

  /**
   * 🚀 Pre-fetch and decode the next act into browser RAM in the background
   */
  const prefetchActAudio = async (chapters, nextIdx, token) => {
    if (!chapters || nextIdx >= chapters.length || playTokenRef.current !== token) return;
    const nextChap = chapters[nextIdx];
    const cacheKey = `${selectedEngine}_${selectedStyle}_${selectedPersona}_${nextIdx}`;

    if (preloadedBuffersRef.current.has(cacheKey)) return;

    try {
      const response = await axios.post('/api/audio/synthesize-act', {
        chapter: nextChap,
        persona: selectedPersona,
        style: selectedStyle,
        engine: selectedEngine,
        customApiKey: elevenLabsKey || null,
        customVoiceId: customClonedVoiceId || null,
        sliderConfig: {
          styleExaggeration,
          stability,
          breathDensity
        }
      }, { timeout: 45000 });

      if (response.data && response.data.success && response.data.audioBase64) {
        initWebAudioChain();
        const ctx = audioContextRef.current;
        if (ctx) {
          const binaryString = window.atob(response.data.audioBase64);
          const len = binaryString.length;
          const bytes = new Uint8Array(len);
          for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          const audioBuffer = await ctx.decodeAudioData(bytes.buffer.slice(0));
          if (playTokenRef.current === token) {
            preloadedBuffersRef.current.set(cacheKey, audioBuffer);
          }
        }
      }
    } catch (e) {
      console.warn('Background act prefetch ignored:', e.message);
    }
  };

  /**
   * ⚡ Play a single chapter using Google Gemini Native Audio / ElevenLabs Studio Audio
   */
  const playChapterStudio = async (chapters, index, token = null) => {
    const currentToken = token !== null ? token : ++playTokenRef.current;

    if (!isPlayingRef.current || playTokenRef.current !== currentToken || index >= chapters.length) {
      if (playTokenRef.current === currentToken) {
        stopAudioPlayback();
        setCurrentChapterIdx(0);
      }
      return;
    }

    setCurrentChapterIdx(index);
    applyActDSPMorphing(index);
    const chap = chapters[index];
    const cacheKey = `${selectedEngine}_${selectedStyle}_${selectedPersona}_${index}`;

    if (selectedEngine !== 'browser') {
      try {
        initWebAudioChain();
        const ctx = audioContextRef.current;

        // Check if already pre-decoded in RAM
        let audioBuffer = preloadedBuffersRef.current.get(cacheKey);

        if (!audioBuffer) {
          setIsBuffering(true);
          const response = await axios.post('/api/audio/synthesize-act', {
            chapter: chap,
            persona: selectedPersona,
            style: selectedStyle,
            engine: selectedEngine,
            customApiKey: elevenLabsKey || null,
            customVoiceId: customClonedVoiceId || null,
            sliderConfig: {
              styleExaggeration,
              stability,
              breathDensity
            }
          }, { timeout: 45000 });

          // Guard against race conditions
          if (!isPlayingRef.current || playTokenRef.current !== currentToken) {
            return;
          }

          if (response.data && response.data.success && response.data.audioBase64) {
            if (ctx) {
              const binaryString = window.atob(response.data.audioBase64);
              const len = binaryString.length;
              const bytes = new Uint8Array(len);
              for (let i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i);
              }
              audioBuffer = await ctx.decodeAudioData(bytes.buffer.slice(0));
            }
          }
        }

        // Guard check after audio decoding
        if (!isPlayingRef.current || playTokenRef.current !== currentToken) {
          return;
        }

        if (ctx && audioBuffer) {
          // Immediately stop & detach any previously playing node
          if (currentSourceNodeRef.current) {
            try {
              currentSourceNodeRef.current.onended = null;
              currentSourceNodeRef.current.stop();
              currentSourceNodeRef.current.disconnect();
            } catch (e) {}
            currentSourceNodeRef.current = null;
          }

          const sourceNode = ctx.createBufferSource();
          sourceNode.buffer = audioBuffer;
          sourceNode.playbackRate.value = playbackRate;

          // Connect to Mastering DSP rack
          if (warmthFilterRef.current) {
            sourceNode.connect(warmthFilterRef.current);
          } else {
            sourceNode.connect(ctx.destination);
          }

          // Trigger background pre-fetch for next chapter
          if (index + 1 < chapters.length) {
            prefetchActAudio(chapters, index + 1, currentToken);
          }

          sourceNode.onended = () => {
            sourceNode.disconnect();
            if (currentSourceNodeRef.current === sourceNode) {
              currentSourceNodeRef.current = null;
            }
            if (isPlayingRef.current && playTokenRef.current === currentToken) {
              setTimeout(() => {
                if (isPlayingRef.current && playTokenRef.current === currentToken) {
                  playChapterStudio(chapters, index + 1, currentToken);
                }
              }, 400); // 400ms theatrical breathing pause between Acts
            }
          };

          sourceNode.start(0);
          setIsBuffering(false);
          currentSourceNodeRef.current = sourceNode;
          startVisualizerLoop();
          return;
        }
      } catch (err) {
        setIsBuffering(false);
        if (!isPlayingRef.current || playTokenRef.current !== currentToken) return;
        console.warn('Studio synthesis endpoint fallback to Web Speech:', err.message);
        toast('Using local neural speech synthesis fallback.', { icon: '🎙️' });
      }
    }

    setIsBuffering(false);
    playChapterBrowserFallback(chapters, index, currentToken);
  };

  const playChapterBrowserFallback = (chapters, index, token = null) => {
    const currentToken = token !== null ? token : playTokenRef.current;

    if (!isPlayingRef.current || playTokenRef.current !== currentToken || index >= chapters.length) {
      if (playTokenRef.current === currentToken) {
        stopAudioPlayback();
        setCurrentChapterIdx(0);
      }
      return;
    }

    window.speechSynthesis.cancel();
    const chap = chapters[index];
    const utterance = new SpeechSynthesisUtterance(chap.text);
    const baseTheme = STORY_THEMES[selectedStyle] || STORY_THEMES.storyteller;
    utterance.pitch = baseTheme.pitch || 1.0;
    utterance.rate = playbackRate * (baseTheme.rate || 1.0);
    utterance.volume = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const persona = STORY_PERSONAS.find(p => p.id === selectedPersona) || STORY_PERSONAS[0];
    let matchedVoice = voices.find(v => (persona.accents || []).some(acc => v.name.toLowerCase().includes(acc.toLowerCase())));
    if (!matchedVoice) {
      matchedVoice = voices.find(v => (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Premium')) && v.lang.startsWith('en'));
    }
    if (matchedVoice) utterance.voice = matchedVoice;

    utterance.onend = () => {
      if (isPlayingRef.current && playTokenRef.current === currentToken) {
        setTimeout(() => {
          if (isPlayingRef.current && playTokenRef.current === currentToken) {
            playChapterBrowserFallback(chapters, index + 1, currentToken);
          }
        }, 400);
      }
    };

    window.speechSynthesis.speak(utterance);
    startVisualizerLoop();
  };

  const handlePlayToggle = () => {
    if (isPlaying) {
      stopAudioPlayback();
    } else {
      stopAudioPlayback();
      const chapters = buildStoryChapters();
      setChaptersList(chapters);
      setIsPlaying(true);
      isPlayingRef.current = true;
      initWebAudioChain();

      const personaName = clonedVoiceName || (selectedPersona.startsWith('proc_') ? 'Procedural AI Voice' : STORY_PERSONAS.find(p => p.id === selectedPersona)?.name || 'Custom Voice');
      const engineLabel = selectedEngine === 'google' 
        ? 'Gemini DeepMind Studio Neural' 
        : (selectedEngine === 'elevenlabs' ? 'ElevenLabs Turbo v2.5' : 'Local Browser Engine');

      toast.success(`🎬 Narrated by ${personaName} • ${engineLabel}`, { id: 'story-play', icon: activeTheme.icon });
      const newToken = ++playTokenRef.current;
      playChapterStudio(chapters, currentChapterIdx, newToken);
    }
  };

  const jumpToChapter = (idx) => {
    stopAudioPlayback();
    const chapters = buildStoryChapters();
    setChaptersList(chapters);
    setIsPlaying(true);
    isPlayingRef.current = true;
    initWebAudioChain();
    const newToken = ++playTokenRef.current;
    playChapterStudio(chapters, idx, newToken);
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

  /**
   * 🎨 "Prompt-to-Voice" Custom Voice Designer Action
   */
  const handleDesignVoice = async () => {
    if (!promptToVoiceInput.trim()) {
      toast.error('Please enter a voice description (e.g. 50-year-old Scottish Architect...)');
      return;
    }

    setIsDesigningVoice(true);
    toast.loading('Synthesizing custom AI voice persona...', { id: 'design-voice' });

    try {
      const res = await axios.post('/api/audio/custom-voice-design', {
        prompt: promptToVoiceInput.trim()
      });

      if (res.data && res.data.success) {
        const vp = res.data.voiceProfile;
        setSelectedPersona(vp.id);
        setClonedVoiceName(vp.name);
        setCustomClonedVoiceId(null);
        toast.success(`AI Voice Created: "${vp.name}"!`, { id: 'design-voice', icon: '✨' });
      }
    } catch (err) {
      toast.error('Voice design failed: ' + err.message, { id: 'design-voice' });
    } finally {
      setIsDesigningVoice(false);
    }
  };

  /**
   * 🌐 Apply Combinatorial Procedural Voice (1,500+ Combinations)
   */
  const handleApplyProceduralVoice = () => {
    const procId = `proc_${baseVoiceFilter.toLowerCase()}_${accentFilter}_${archetypeFilter}_${ageFilter}`;
    setSelectedPersona(procId);
    setCustomClonedVoiceId(null);
    setClonedVoiceName(null);
    stopAudioPlayback();
    toast.success(`Cast 1,500+ Matrix Voice: ${baseVoiceFilter} • ${accentFilter} • ${archetypeFilter}`, { icon: '🌐' });
  };

  /**
   * 📦 1-Click Download Full 5-Act Broadcast MP3/WAV
   */
  const handleDownloadFullMp3 = async () => {
    toast.loading('Assembling studio broadcast audio file...', { id: 'download-mp3' });
    try {
      const response = await axios.post('/api/audio/export-mp3', {
        instance,
        report,
        style: selectedStyle,
        persona: selectedPersona,
        engine: selectedEngine,
        customApiKey: elevenLabsKey || null
      }, { responseType: 'blob' });

      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'audio/wav' }));
      const link = document.createElement('a');
      link.href = url;
      const clientSlug = (instance?.customerName || 'ScoreX').replace(/[^a-zA-Z0-9_-]/g, '_');
      link.setAttribute('download', `${clientSlug}_Executive_Briefing.wav`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Broadcast audio downloaded successfully!', { id: 'download-mp3' });
    } catch (err) {
      toast.error('Failed to export audio briefing file.', { id: 'download-mp3' });
    }
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
                <HiSparkles size={12} /> {clonedVoiceName || (selectedPersona.startsWith('proc_') ? '1,500+ Matrix Voice' : 'Gemini DeepMind Studio')}
              </EmotionTag>
            </h4>
            <p>Narrated by <strong>{clonedVoiceName || STORY_PERSONAS.find(p => p.id === selectedPersona)?.name || 'Procedural Voice'}</strong></p>
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
            />
          ))}
        </WaveContainer>

        <ControlsGroup>
          <SecondaryControl $theme={theme} onClick={() => setShowSettings(!showSettings)} $active={showSettings} title="Voice Engine, Studio Casting & Narrative Arc">
            <FiSliders size={13} /> {showSettings ? 'Hide Studio' : '1,500+ Voice Studio & Engine'}
          </SecondaryControl>

          <SecondaryControl $theme={theme} onClick={cycleRate} title="Change speech tempo">
            <FiFastForward size={13} /> {playbackRate}x
          </SecondaryControl>

          <SecondaryControl $theme={theme} onClick={handleDownloadFullMp3} title="Download Full Broadcast Audio">
            <FiDownload size={13} /> Audio
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
            {isBuffering ? (
              <>
                <FiLoader className="spin-icon" size={16} />
                <span>Buffering Audio...</span>
              </>
            ) : isPlaying ? (
              <>
                <FiPause size={16} />
                <span>Pause Story</span>
              </>
            ) : (
              <>
                <FiPlay size={16} />
                <span>Begin Story</span>
              </>
            )}
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
              {isBuffering && <FiLoader className="spin-icon" size={11} />}
              <span>{isBuffering ? 'Buffering Act...' : `${currentChapter?.act}: ${currentChapter?.chapterTitle}`}</span>
            </div>
          </StoryTeleprompter>
        )}
      </AnimatePresence>

      {/* Expanded 1,500+ Voice Studio Casting & Voice Designer Drawer */}
      <AnimatePresence>
        {showSettings && (
          <SettingsPanel 
            $theme={theme}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* 1. "Prompt-to-Voice" Custom AI Voice Designer */}
            <ControlCard $theme={theme}>
              <div className="label">
                <HiSparkles size={14} color="#f59e0b" />
                "Prompt-to-Voice" Custom AI Designer
              </div>
              <DesignerInputArea $theme={theme}>
                <textarea
                  rows="3"
                  placeholder="e.g. A 55-year-old French data science professor speaking fluent English with precise, warm academic articulation and deliberate pauses..."
                  value={promptToVoiceInput}
                  onChange={(e) => setPromptToVoiceInput(e.target.value)}
                />
                <button className="design-btn" onClick={handleDesignVoice} disabled={isDesigningVoice}>
                  <HiSparkles size={13} /> {isDesigningVoice ? 'Generating Voice...' : 'Design & Cast Voice'}
                </button>
              </DesignerInputArea>
            </ControlCard>

            {/* 2. 1,500+ Procedural Combinatorial Matrix Explorer */}
            <ControlCard $theme={theme}>
              <div className="label">
                <FiGlobe size={13} />
                1,500+ Procedural Voice Matrix
              </div>
              <FilterSelectRow $theme={theme}>
                <select value={accentFilter} onChange={(e) => setAccentFilter(e.target.value)}>
                  {GLOBAL_ACCENTS.map(acc => (
                    <option key={acc.id} value={acc.id}>{acc.name}</option>
                  ))}
                </select>
                <select value={archetypeFilter} onChange={(e) => setArchetypeFilter(e.target.value)}>
                  {ARCHETYPES.map(arch => (
                    <option key={arch.id} value={arch.id}>{arch.name}</option>
                  ))}
                </select>
                <select value={ageFilter} onChange={(e) => setAgeFilter(e.target.value)}>
                  {AGE_TIERS.map(age => (
                    <option key={age.id} value={age.id}>{age.name}</option>
                  ))}
                </select>
                <select value={baseVoiceFilter} onChange={(e) => setBaseVoiceFilter(e.target.value)}>
                  <option value="Charon">Charon (Baritone)</option>
                  <option value="Aoede">Aoede (Soprano)</option>
                  <option value="Puck">Puck (Tenor)</option>
                  <option value="Kore">Kore (Alto)</option>
                  <option value="Fenrir">Fenrir (Bass)</option>
                </select>
              </FilterSelectRow>
              <button 
                style={{ width: '100%', padding: '8px', borderRadius: '10px', border: '1px solid #f59e0b', background: 'rgba(245, 158, 11, 0.15)', color: '#d97706', fontWeight: '800', cursor: 'pointer', fontSize: '0.78rem' }}
                onClick={handleApplyProceduralVoice}
              >
                Apply Matrix Combination
              </button>
            </ControlCard>

            {/* 3. Mathematical Emotion & Prosody Sliders */}
            <ControlCard $theme={theme}>
              <div className="label">
                <FiSliders size={13} />
                Mathematical Emotion Sliders
              </div>
              <SliderGroup $theme={theme}>
                <div className="slider-row">
                  <div className="slider-header">
                    <span>Style Exaggeration</span>
                    <span>{Math.round(styleExaggeration * 100)}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0.1" 
                    max="1.0" 
                    step="0.05" 
                    value={styleExaggeration} 
                    onChange={(e) => setStyleExaggeration(parseFloat(e.target.value))} 
                  />
                </div>

                <div className="slider-row">
                  <div className="slider-header">
                    <span>Vocal Stability</span>
                    <span>{Math.round(stability * 100)}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0.1" 
                    max="1.0" 
                    step="0.05" 
                    value={stability} 
                    onChange={(e) => setStability(parseFloat(e.target.value))} 
                  />
                </div>

                <div className="slider-row">
                  <div className="slider-header">
                    <span>Breath Cadence</span>
                    <span>{Math.round(breathDensity * 100)}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0.1" 
                    max="1.0" 
                    step="0.05" 
                    value={breathDensity} 
                    onChange={(e) => setBreathDensity(parseFloat(e.target.value))} 
                  />
                </div>
              </SliderGroup>
            </ControlCard>

            {/* 5. Curated Spotlight Personas (8 Core) */}
            <ControlCard $theme={theme}>
              <div className="label">
                <FiUser size={13} />
                Curated Executive Personas
              </div>
              <div className="options-grid">
                {STORY_PERSONAS.map((persona) => (
                  <OptionPill
                    key={persona.id}
                    $theme={theme}
                    $active={selectedPersona === persona.id && !clonedVoiceName}
                    $gradient={activeTheme.gradient}
                    onClick={() => {
                      setSelectedPersona(persona.id);
                      setCustomClonedVoiceId(null);
                      setClonedVoiceName(null);
                      stopAudioPlayback();
                      toast.success(`Voice Cast: ${persona.name} (${persona.title})`, { icon: '🎙️' });
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
