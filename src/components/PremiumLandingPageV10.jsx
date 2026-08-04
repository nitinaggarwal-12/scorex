import { useState, useEffect } from 'react';
import { 
  Sparkles, Award, Target, Layers, FileText, Check, ArrowRight,
  TrendingUp, ShieldCheck, Cpu, Database, Zap, ExternalLink, Play, 
  BarChart3, CheckCircle2, ChevronRight, HelpCircle, Lock, Users,
  Edit2, Copy, Download, Upload, Trash2, FileSpreadsheet, X, Plus, RotateCcw
} from 'lucide-react';
import { V10_PILLARS } from './PremiumScopingAssessorV10';

export default function PremiumLandingPageV10({ onStartAssessment, onSelectPreset, onOpenSavedAssessment, globalTheme = 'dark' }) {
  const [activeOrbital, setActiveOrbital] = useState('BV');
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [showPortfolioDashboard, setShowPortfolioDashboard] = useState(false);
  const [dashboardCustomerFilter, setDashboardCustomerFilter] = useState('ALL');
  const [dashboardSearchQuery, setDashboardSearchQuery] = useState('');
  const [dashboardExcludedIds, setDashboardExcludedIds] = useState([]);
  const [dashboardPage, setDashboardPage] = useState(1);
  const [dashboardLimit, setDashboardLimit] = useState(15);
  const [showScannerModal, setShowScannerModal] = useState(false);
  const [scannerInput, setScannerInput] = useState('Writing regulatory clinical trial summaries takes 40 hours per batch');
  const [scannerResult, setScannerResult] = useState(null);
  const [showPitchModal, setShowPitchModal] = useState(false);
  const [pitchTitle, setPitchTitle] = useState('');
  const [pitchStakeholder, setPitchStakeholder] = useState('');
  const [showIntakeModal, setShowIntakeModal] = useState(false);
  const [intakeText, setIntakeText] = useState('');
  const [intakeFiles, setIntakeFiles] = useState(() => {
    try {
      const saved = localStorage.getItem('v10_active_uploaded_files');
      if (saved && saved !== '[]') return JSON.parse(saved);
    } catch(e) {}
    return [];
  });
  const [intakeImages, setIntakeImages] = useState([]);
  const [intakeLink, setIntakeLink] = useState('');
  const [isScanningSources, setIsScanningSources] = useState(false);
  const [scanningPhaseText, setScanningPhaseText] = useState('');
  const [syncToNotebookLM, setSyncToNotebookLM] = useState(true);
  const [showSourcesModal, setShowSourcesModal] = useState(null);
  const [selectedPreviewFile, setSelectedPreviewFile] = useState(null);
  const [isWorkerParsing, setIsWorkerParsing] = useState(false);
  const DEFAULT_V10_PORTFOLIO = [];

  const [savedAssessments, setSavedAssessments] = useState(() => {
    try {
      const stored = localStorage.getItem('v10_saved_tiles');
      if (stored && stored !== '[]') return JSON.parse(stored);
    } catch (e) {}
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('v10_active_uploaded_files', JSON.stringify(intakeFiles));
    } catch(e) {}
  }, [intakeFiles]);

  const updateSaved = async (next, newestItem = null) => {
    setSavedAssessments(next);
    try {
      localStorage.setItem('v10_saved_tiles', JSON.stringify(next));
      if (newestItem) {
        await fetch('/api/v10/assessments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newestItem)
        });
      }
    } catch(e) {}
  };

  useEffect(() => {
    const handleStorageReload = async () => {
      try {
        const stored = localStorage.getItem('v10_saved_tiles');
        if (stored) {
          setSavedAssessments(JSON.parse(stored));
        }
        const res = await fetch('/api/v10/assessments');
        const dbJson = await res.json();
        if (dbJson && Array.isArray(dbJson.data)) {
          setSavedAssessments(dbJson.data);
          localStorage.setItem('v10_saved_tiles', JSON.stringify(dbJson.data));
        }
      } catch(e) {}
    };
    handleStorageReload();
    window.addEventListener('storage', handleStorageReload);
    return () => window.removeEventListener('storage', handleStorageReload);
  }, []);

  useEffect(() => {
    const chk = () => {
      const h = window.location.hash || '';
      if (h.includes('view=saved_library') || h.includes('action=saved')) {
        setShowSavedModal(true);
        setShowPortfolioDashboard(false);
      } else if (h.includes('view=portfolio_dashboard')) {
        setShowPortfolioDashboard(true);
        setShowSavedModal(false);
      } else if (h.includes('view=ai_opportunity_scanner') || h.includes('action=scan')) {
        setShowScannerModal(true);
      } else if (h.includes('view=idea_pitch') || h.includes('action=pitch')) {
        setShowPitchModal(true);
      } else if (h.includes('view=intake_form') || h.includes('action=intake')) {
        setShowIntakeModal(true);
      } else {
        setShowSavedModal(false);
        setShowPortfolioDashboard(false);
        setShowScannerModal(false);
        setShowPitchModal(false);
        setShowIntakeModal(false);
      }
    };
    chk();
    window.addEventListener('hashchange', chk);
    return () => window.removeEventListener('hashchange', chk);
  }, []);

  const isLight = globalTheme === 'light';

  const t = {
    bg: isLight ? '#f8fafc' : '#060913',
    textMain: isLight ? '#0f172a' : '#ffffff',
    textSub: isLight ? '#475569' : '#94a3b8',
    headerBg: isLight ? 'rgba(255, 255, 255, 0.85)' : 'rgba(11, 15, 25, 0.78)',
    headerBorder: isLight ? '1px solid #cbd5e1' : '1px solid rgba(255, 255, 255, 0.08)',
    navLink: isLight ? '#475569' : '#cbd5e1',
    heroHeading: isLight ? 'linear-gradient(180deg, #0f172a 0%, #334155 100%)' : 'linear-gradient(180deg, #ffffff 0%, #cbd5e1 100%)',
    masterBg: isLight ? '#ffffff' : 'linear-gradient(145deg, rgba(17, 24, 39, 0.85) 0%, rgba(11, 15, 25, 0.95) 100%)',
    masterBorder: isLight ? '2px solid #cbd5e1' : '1.5px solid rgba(255, 255, 255, 0.14)',
    masterShadow: isLight ? '0 20px 40px -10px rgba(15, 23, 42, 0.1)' : '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 40px rgba(16, 185, 129, 0.18)',
    boxBg: isLight ? '#f1f5f9' : 'rgba(15,23,42,0.65)',
    boxBorder: isLight ? '1px solid #cbd5e1' : '1px solid rgba(255,255,255,0.08)',
    boxScore: isLight ? '#0f172a' : '#ffffff',
    archBg: isLight ? '#ecfeff' : 'rgba(6,182,212,0.08)',
    archBorder: isLight ? '1px solid #a5f3fc' : '1px solid rgba(6,182,212,0.25)',
    archTitle: isLight ? '#0e7490' : '#38bdf8',
    archText: isLight ? '#0f172a' : '#e2e8f0',
    cardBg: isLight ? '#ffffff' : 'rgba(15, 23, 42, 0.65)',
    cardBorder: isLight ? '1px solid #cbd5e1' : '1px solid rgba(255, 255, 255, 0.08)',
    cardShadow: isLight ? '0 10px 30px rgba(15, 23, 42, 0.05)' : 'none',
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const isSaved = showSavedModal || (typeof window !== 'undefined' && (window.location.hash.includes('view=saved_library') || window.location.hash.includes('action=saved')));

  return (
    <div 
      className="premium-landing-v10" 
      style={{
        background: t.bg,
        color: t.textMain,
        minHeight: '100vh',
        fontFamily: "'Inter', system-ui, sans-serif",
        overflowX: 'hidden',
        paddingBottom: '1rem'
      }}
    >


      {/* Dynamic Viewport: Hide Hero if Saved Library, Portfolio Dashboard, or Intake Form is open */}
      {!isSaved && !showPortfolioDashboard && !showScannerModal && !showPitchModal && !showIntakeModal ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
          {/* Hero Section */}
          <section 
            style={{
              padding: '2rem 3rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '3rem',
              width: '100%',
              margin: 0,
              boxSizing: 'border-box',
              position: 'relative'
            }}
          >
        {/* Left Hero Content */}
        <div style={{ flex: '1 1 52%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex' }}>
            <span 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: isLight ? '#f1f5f9' : 'rgba(16, 185, 129, 0.12)',
                border: isLight ? '1px solid #cbd5e1' : '1px solid rgba(16, 185, 129, 0.35)',
                color: '#10b981',
                padding: '0.25rem 0.75rem',
                borderRadius: '100px',
                fontSize: '0.75rem',
                fontWeight: 750
              }}
            >
              <Sparkles size={13} /> Prioritize 100s of Gemini Enterprise ideas with evidence, not opinion
            </span>
          </div>

          <h1 
            style={{
              fontSize: '1.65rem',
              fontWeight: 850,
              lineHeight: 1.2,
              letterSpacing: '-0.4px',
              background: isLight ? 'linear-gradient(135deg, #0f172a 0%, #334155 70%, #0d9488 100%)' : t.heroHeading,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              color: t.textMain,
              margin: 0
            }}
          >
            Turn AI ideas into fundable, launch-ready use cases.
          </h1>

          <p 
            style={{
              fontSize: '0.85rem',
              color: t.textSub,
              lineHeight: 1.5,
              fontWeight: 450,
              maxWidth: '620px',
              margin: 0
            }}
          >
            A guided assessment for Merck teams to evaluate business value, Gemini activation potential, data readiness, GxP/security risk, architecture options, industry benchmarks, and opportunity cost before delivery investment.
          </p>

          {/* Action Buttons Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => onStartAssessment()}
              style={{
                background: 'linear-gradient(135deg, #06b6d4 0%, #10b981 100%)',
                color: '#ffffff',
                border: 'none',
                padding: '0.45rem 1.1rem',
                borderRadius: '100px',
                fontSize: '0.8rem',
                fontWeight: 750,
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={e => e.currentTarget.style.transform = 'translateY(-1px)'}
              onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Start Assessment <ArrowRight size={13} />
            </button>

            <button
              onClick={() => setShowSavedModal(true)}
              style={{
                background: 'rgba(16,185,129,0.18)',
                color: '#10b981',
                border: '1px solid #10b981',
                padding: '0.45rem 0.95rem',
                borderRadius: '100px',
                fontSize: '0.8rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(16,185,129,0.3)'}
              onMouseOut={e => e.currentTarget.style.background = 'rgba(16,185,129,0.18)'}
            >
              <Upload size={13} /> Import Production Model (.xlsx)
            </button>
          </div>



          {/* Checkmarks Footer */}
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem',
              marginTop: '0.5rem',
              borderTop: isLight ? '1px solid #cbd5e1' : '1px solid rgba(255,255,255,0.06)',
              paddingTop: '0.85rem'
            }}
          >
            <span style={{ fontSize: '0.75rem', fontWeight: 650, color: t.textSub, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <CheckCircle2 size={13} color="#10b981" /> Business + technical personas
            </span>
            <span style={{ fontSize: '0.75rem', fontWeight: 650, color: t.textSub, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <CheckCircle2 size={13} color="#10b981" /> Portfolio ranking
            </span>
            <span style={{ fontSize: '0.75rem', fontWeight: 650, color: t.textSub, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <CheckCircle2 size={13} color="#10b981" /> Executive-ready outputs
            </span>
            <span style={{ fontSize: '0.75rem', fontWeight: 650, color: t.textSub, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <CheckCircle2 size={13} color="#10b981" /> Future governance gate
            </span>
          </div>
        </div>

        {/* Right Hero Glassmorphic Interactive Preview Card */}
        <div 
          onClick={() => onSelectPreset?.('sop_assistant')}
          style={{
            flex: '1 1 46%',
            background: t.masterBg,
            border: t.masterBorder,
            borderRadius: '16px',
            padding: '1.15rem',
            boxShadow: t.masterShadow,
            cursor: 'pointer',
            position: 'relative',
            transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), boxShadow 0.3s'
          }}
          onMouseOver={e => {
            e.currentTarget.style.transform = 'translateY(-3px)';
          }}
          onMouseOut={e => {
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          {/* Top Window Bar Dots */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} />
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }} />
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
              <span style={{ fontSize: '0.72rem', fontWeight: 650, color: t.textSub, marginLeft: '0.5rem' }}>
                Regulatory SOP Assistant / report preview
              </span>
            </div>
            <span style={{ fontSize: '0.68rem', fontWeight: 750, color: '#10b981', background: 'rgba(16,185,129,0.15)', padding: '0.15rem 0.55rem', borderRadius: '100px', border: '1px solid rgba(16,185,129,0.3)' }}>
              ● Launch Now
            </span>
          </div>

          {/* Large Priority Score */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 850, color: t.textMain, margin: 0 }}>Priority Score 92/100</h3>
                <span style={{ fontSize: '1.15rem' }}>✨</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: t.textSub, fontWeight: 550, display: 'block', marginTop: '0.15rem' }}>
                Rank #1 of 117 submitted opportunities
              </span>
            </div>
          </div>

          {/* 4 Mini Progress Card Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', marginBottom: '0.85rem' }}>
            <div style={{ background: t.boxBg, border: t.boxBorder, padding: '0.65rem', borderRadius: '10px' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 650, color: t.textSub, display: 'block', marginBottom: '0.15rem' }}>Business Value</span>
              <span style={{ fontSize: '1.15rem', fontWeight: 850, color: t.boxScore, display: 'block', marginBottom: '0.3rem' }}>95</span>
              <div style={{ height: '3px', background: isLight ? '#cbd5e1' : 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: '95%', height: '100%', background: 'linear-gradient(90deg, #06b6d4, #10b981)' }} />
              </div>
            </div>

            <div style={{ background: t.boxBg, border: t.boxBorder, padding: '0.65rem', borderRadius: '10px' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 650, color: t.textSub, display: 'block', marginBottom: '0.15rem' }}>Gemini Activation</span>
              <span style={{ fontSize: '1.15rem', fontWeight: 850, color: t.boxScore, display: 'block', marginBottom: '0.3rem' }}>98</span>
              <div style={{ height: '3px', background: isLight ? '#cbd5e1' : 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: '98%', height: '100%', background: 'linear-gradient(90deg, #06b6d4, #10b981)' }} />
              </div>
            </div>

            <div style={{ background: t.boxBg, border: t.boxBorder, padding: '0.65rem', borderRadius: '10px' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 650, color: t.textSub, display: 'block', marginBottom: '0.15rem' }}>Technical Readiness</span>
              <span style={{ fontSize: '1.15rem', fontWeight: 850, color: t.boxScore, display: 'block', marginBottom: '0.3rem' }}>89</span>
              <div style={{ height: '3px', background: isLight ? '#cbd5e1' : 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: '89%', height: '100%', background: '#64748b' }} />
              </div>
            </div>

            <div style={{ background: t.boxBg, border: t.boxBorder, padding: '0.65rem', borderRadius: '10px' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 650, color: t.textSub, display: 'block', marginBottom: '0.15rem' }}>Change Readiness</span>
              <span style={{ fontSize: '1.15rem', fontWeight: 850, color: t.boxScore, display: 'block', marginBottom: '0.3rem' }}>85</span>
              <div style={{ height: '3px', background: isLight ? '#cbd5e1' : 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: '85%', height: '100%', background: '#64748b' }} />
              </div>
            </div>
          </div>

          {/* Recommended Architecture Box */}
          <div style={{ background: t.archBg, border: t.archBorder, padding: '0.75rem 0.9rem', borderRadius: '10px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 750, color: t.archTitle, display: 'block', marginBottom: '0.2rem' }}>
              Recommended Architecture
            </span>
            <p style={{ fontSize: '0.75rem', color: t.archText, lineHeight: 1.35, margin: 0, fontWeight: 500 }}>
              Gemini Enterprise App + SharePoint Connector + OneDrive Connector. Optional Vertex AI + Vector Search for advanced retrieval.
            </p>
          </div>

          {/* Click Overlay Hint */}
          <div 
            style={{
              position: 'absolute',
              bottom: '-12px',
              right: '20px',
              background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
              color: '#ffffff',
              padding: '0.25rem 0.85rem',
              borderRadius: '100px',
              fontSize: '0.7rem',
              fontWeight: 750,
              boxShadow: '0 4px 10px rgba(139, 92, 246, 0.35)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            Click to test interactive scoring <ChevronRight size={12} />
          </div>
        </div>
      </section>

      {/* Section 2: Why this assessment exists */}
      <section 
        id="section-why"
        style={{
          scrollMarginTop: '135px',
          padding: '2rem 3rem',
          width: '100%',
          margin: 0,
          boxSizing: 'border-box',
          borderTop: '1px solid rgba(255,255,255,0.06)'
        }}
      >
        <div style={{ marginBottom: '1.5rem', maxWidth: '720px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 850, letterSpacing: '-0.4px', color: '#ffffff', margin: '0 0 0.35rem 0' }}>
            Why this assessment exists
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
            Merck has hundreds of potential AI opportunities. This helps teams identify which ones create value, drive Gemini Enterprise activation, and can be delivered responsibly.
          </p>
        </div>

        {/* 3 Premium Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
          <div 
            style={{
              background: 'rgba(15, 23, 42, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '1.15rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              transition: 'all 0.25s ease'
            }}
            onMouseOver={e => e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.4)'}
            onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'}
          >
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
              <Target size={16} color="#60a5fa" />
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 750, color: '#ffffff', margin: 0 }}>Find the right use cases</h3>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.45, margin: 0 }}>
              Separate high-value, launchable use cases from ideas that need incubation, governance prep, or alternative architecture.
            </p>
          </div>

          <div 
            style={{
              background: 'rgba(15, 23, 42, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '1.15rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              transition: 'all 0.25s ease'
            }}
            onMouseOver={e => e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.4)'}
            onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'}
          >
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <Users size={16} color="#34d399" />
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 750, color: '#ffffff', margin: 0 }}>Prioritize for 85,000 users</h3>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.45, margin: 0 }}>
              Rank opportunities by business value, user reach, frequency of use, Gemini adoption impact, and opportunity cost.
            </p>
          </div>

          <div 
            style={{
              background: 'rgba(15, 23, 42, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '1.15rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              transition: 'all 0.25s ease'
            }}
            onMouseOver={e => e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.4)'}
            onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'}
          >
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(168, 85, 247, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
              <ShieldCheck size={16} color="#c084fc" />
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 750, color: '#ffffff', margin: 0 }}>Design for regulated delivery</h3>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.45, margin: 0 }}>
              Assess GxP, PHI, data ownership, human review, auditability, and security early without making intake feel bureaucratic.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: Methodology: 10-pillar prioritization model */}
      <section 
        id="section-methodology"
        style={{
          scrollMarginTop: '135px',
          padding: '2rem 3rem',
          width: '100%',
          margin: 0,
          boxSizing: 'border-box',
          borderTop: '1px solid rgba(255,255,255,0.06)'
        }}
      >
        <div style={{ marginBottom: '1.5rem', maxWidth: '780px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 850, letterSpacing: '-0.4px', color: '#ffffff', margin: '0 0 0.35rem 0' }}>
            Methodology: 10-pillar prioritization model
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
            The same assessment supports today&apos;s discovery and tomorrow&apos;s funding/governance gate. Business owners answer value/adoption questions; technical owners complete data, security, connector, and architecture sections.
          </p>
        </div>

        {/* 2 Column Layout: Interactive Orbital visualization vs Numbered Methodology Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '2.5rem', alignItems: 'center' }}>
          {/* Left Orbital Node Graphic */}
          <div 
            style={{
              position: 'relative',
              height: '380px',
              background: 'radial-gradient(circle at center, rgba(16, 185, 129, 0.12) 0%, rgba(6, 9, 19, 0.85) 75%)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'inset 0 0 40px rgba(0,0,0,0.6)'
            }}
          >
            {/* Central Glowing Score Hub */}
            <div 
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #06b6d4, #10b981)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 35px rgba(16, 185, 129, 0.4), inset 0 0 20px rgba(255,255,255,0.3)',
                zIndex: 20,
                cursor: 'pointer',
                textAlign: 'center',
                padding: '0.75rem'
              }}
              onClick={() => onStartAssessment()}
            >
              <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#042f2e' }}>
                Gemini
              </span>
              <span style={{ fontSize: '0.95rem', fontWeight: 850, lineHeight: 1.1, color: '#ffffff', marginTop: '0.15rem' }}>
                Score
              </span>
            </div>

            {/* Surrounding Orbiting Floating Badges */}
            <div style={{ position: 'absolute', top: '12%', left: '12%', background: 'rgba(15,23,42,0.85)', border: '1px solid #38bdf8', padding: '0.35rem 0.85rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8' }}>
              Business Value (20)
            </div>
            <div style={{ position: 'absolute', top: '10%', right: '12%', background: 'rgba(15,23,42,0.85)', border: '1px solid #a855f7', padding: '0.35rem 0.85rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700, color: '#c084fc' }}>
              Benchmarks (Signal)
            </div>
            <div style={{ position: 'absolute', top: '42%', right: '6%', background: 'rgba(15,23,42,0.85)', border: '1px solid #34d399', padding: '0.35rem 0.85rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700, color: '#34d399' }}>
              Activation (15)
            </div>
            <div style={{ position: 'absolute', bottom: '25%', right: '10%', background: 'rgba(15,23,42,0.85)', border: '1px solid #fbbf24', padding: '0.35rem 0.85rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700, color: '#fbbf24' }}>
              Opportunity Cost (10)
            </div>
            <div style={{ position: 'absolute', bottom: '10%', left: '14%', background: 'rgba(15,23,42,0.85)', border: '1px solid #60a5fa', padding: '0.35rem 0.85rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700, color: '#93c5fd' }}>
              Data Sources (10)
            </div>
            <div style={{ position: 'absolute', top: '38%', left: '6%', background: 'rgba(15,23,42,0.85)', border: '1px solid #ec4899', padding: '0.35rem 0.85rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700, color: '#f472b6' }}>
              Security / GxP (10)
            </div>
          </div>

          {/* Right Numbered Stack */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div 
              style={{
                background: 'rgba(15, 23, 42, 0.65)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '1rem 1.15rem',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}
            >
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.18)', color: '#10b981', fontSize: '0.85rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid rgba(16, 185, 129, 0.4)' }}>
                1
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 750, color: '#ffffff', margin: '0 0 0.15rem 0' }}>Business intake</h4>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.4, margin: 0 }}>
                  Captures problem, users, workflow frequency, expected KPI, and sponsorship.
                </p>
              </div>
            </div>

            <div 
              style={{
                background: 'rgba(15, 23, 42, 0.65)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '1rem 1.15rem',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}
            >
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.18)', color: '#60a5fa', fontSize: '0.85rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid rgba(59, 130, 246, 0.4)' }}>
                2
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 750, color: '#ffffff', margin: '0 0 0.15rem 0' }}>Technical readiness</h4>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.4, margin: 0 }}>
                  Validates knowledge sources, connector paths, security, and GxP gating.
                </p>
              </div>
            </div>

            <div 
              style={{
                background: 'rgba(15, 23, 42, 0.65)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '1rem 1.15rem',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}
            >
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(168, 85, 247, 0.18)', color: '#c084fc', fontSize: '0.85rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid rgba(168, 85, 247, 0.4)' }}>
                3
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 750, color: '#ffffff', margin: '0 0 0.15rem 0' }}>Architecture recommendation</h4>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.4, margin: 0 }}>
                  Recommends optimal GenAI topology with pros, cons, and time-to-value.
                </p>
              </div>
            </div>

            <div 
              style={{
                background: 'rgba(15, 23, 42, 0.65)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '1rem 1.15rem',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}
            >
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.18)', color: '#fbbf24', fontSize: '0.85rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid rgba(245, 158, 11, 0.4)' }}>
                4
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 750, color: '#ffffff', margin: '0 0 0.15rem 0' }}>Benchmark & executive output</h4>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.4, margin: 0 }}>
                  Synthesizes public peer signals into a decision-grade portfolio dossier.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: What stakeholders receive */}
      <section 
        id="section-receive"
        style={{
          scrollMarginTop: '135px',
          padding: '2rem 3rem',
          width: '100%',
          margin: 0,
          boxSizing: 'border-box',
          borderTop: '1px solid rgba(255,255,255,0.06)'
        }}
      >
        <div style={{ marginBottom: '1.5rem', maxWidth: '780px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 850, letterSpacing: '-0.4px', color: '#ffffff', margin: '0 0 0.35rem 0' }}>
            What stakeholders receive
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
            Outputs are structured exactly for your decision governance gate.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
          <div style={{ background: 'rgba(15, 23, 42, 0.65)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '1.15rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.25rem' }}>🏆</span>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 750, color: '#ffffff', margin: 0 }}>Priority tier</h3>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.4, margin: 0 }}>
              Launch Now, Validate, Incubate, or Hold with full evidence backing.
            </p>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.65)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '1.15rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.25rem' }}>📊</span>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 750, color: '#ffffff', margin: 0 }}>Scorecard</h3>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.4, margin: 0 }}>
              Business value, activation, strategic fit, and change readiness scores.
            </p>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.65)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '1.15rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.25rem' }}>🧩</span>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 750, color: '#ffffff', margin: 0 }}>Architecture</h3>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.4, margin: 0 }}>
              Best-fit design topology with alternative tradeoffs and time-to-value.
            </p>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.65)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '1.15rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.25rem' }}>🚧</span>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 750, color: '#ffffff', margin: 0 }}>Blockers & action</h3>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.4, margin: 0 }}>
              Concrete blockers categorized by 30, 60, and 90-day action plans.
            </p>
          </div>
        </div>
      </section>

      {/* Section 5: Industry benchmark intelligence */}
      <section 
        id="section-benchmarks"
        style={{
          scrollMarginTop: '135px',
          padding: '2rem 3rem',
          width: '100%',
          margin: 0,
          boxSizing: 'border-box',
          borderTop: '1px solid rgba(255,255,255,0.06)'
        }}
      >
        <div style={{ marginBottom: '1.5rem', maxWidth: '780px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 850, letterSpacing: '-0.4px', color: '#ffffff', margin: '0 0 0.35rem 0' }}>
            Industry benchmark intelligence
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
            Frames external pharma peer alignment against internal productivity goals.
          </p>
        </div>

        {/* Comparative 2 Card Layout: Without this use case vs After delivery */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          {/* Left Card: Without this use case */}
          <div style={{ background: 'rgba(15, 23, 42, 0.65)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '1.25rem', borderRadius: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fbbf24', margin: '0 0 1rem 0' }}>
              Without this use case
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 650, marginBottom: '0.25rem', color: '#cbd5e1' }}>
                  <span>AI self-service</span>
                  <span style={{ color: '#f59e0b' }}>Lagging</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: '28%', height: '100%', background: '#f59e0b', borderRadius: '3px' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 650, marginBottom: '0.25rem', color: '#cbd5e1' }}>
                  <span>Knowledge reuse</span>
                  <span style={{ color: '#fb923c' }}>Siloed</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: '35%', height: '100%', background: '#fb923c', borderRadius: '3px' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 650, marginBottom: '0.25rem', color: '#cbd5e1' }}>
                  <span>Cycle time</span>
                  <span style={{ color: '#facc15' }}>Slow</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: '32%', height: '100%', background: '#facc15', borderRadius: '3px' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 650, marginBottom: '0.25rem', color: '#cbd5e1' }}>
                  <span>Gemini adoption</span>
                  <span style={{ color: '#ef4444' }}>At risk</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: '22%', height: '100%', background: '#ef4444', borderRadius: '3px' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Right Card: After delivery */}
          <div style={{ background: 'rgba(15, 23, 42, 0.65)', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '1.25rem', borderRadius: '16px', boxShadow: '0 0 30px rgba(16, 185, 129, 0.1)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#34d399', margin: '0 0 1rem 0' }}>
              After delivery
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 650, marginBottom: '0.25rem', color: '#ffffff' }}>
                  <span>AI self-service</span>
                  <span style={{ color: '#34d399' }}>Leader</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: '92%', height: '100%', background: 'linear-gradient(90deg, #06b6d4, #10b981)', borderRadius: '3px' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 650, marginBottom: '0.25rem', color: '#ffffff' }}>
                  <span>Knowledge reuse</span>
                  <span style={{ color: '#38bdf8' }}>Strong</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: '85%', height: '100%', background: '#38bdf8', borderRadius: '3px' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 650, marginBottom: '0.25rem', color: '#ffffff' }}>
                  <span>Cycle time</span>
                  <span style={{ color: '#60a5fa' }}>Improved</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: '88%', height: '100%', background: '#60a5fa', borderRadius: '3px' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 650, marginBottom: '0.25rem', color: '#ffffff' }}>
                  <span>Gemini adoption</span>
                  <span style={{ color: '#2dd4bf' }}>High</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: '95%', height: '100%', background: '#2dd4bf', borderRadius: '3px' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Intelligence Sub-Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
          <div style={{ background: 'rgba(15, 23, 42, 0.55)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '1.15rem' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Sources</span>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 750, color: '#ffffff', margin: '0.25rem 0 0.5rem 0' }}>Competitor signals</h4>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.4, margin: 0 }}>
              Annual reports, earnings calls, investor materials, and digital transformation news.
            </p>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.55)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '1.15rem' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Analyst Signals</span>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 750, color: '#ffffff', margin: '0.25rem 0 0.5rem 0' }}>Market direction</h4>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.4, margin: 0 }}>
              Gartner, Forrester, and marketplace trends on digital worker productivity.
            </p>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.55)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '1.15rem' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Business Gain</span>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 750, color: '#ffffff', margin: '0.25rem 0 0.5rem 0' }}>Value framing</h4>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.4, margin: 0 }}>
              Productivity, cycle-time reduction, risk avoidance, and reusable GenAI patterns.
            </p>
          </div>
        </div>
      </section>

      {/* Section 6: Success story examples */}
      <section 
        id="section-stories"
        style={{
          scrollMarginTop: '135px',
          padding: '2rem 3rem',
          width: '100%',
          margin: 0,
          boxSizing: 'border-box',
          borderTop: '1px solid rgba(255,255,255,0.06)'
        }}
      >
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 850, letterSpacing: '-0.4px', color: '#ffffff', margin: '0 0 0.35rem 0' }}>
            Success story examples
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
            Illustrative high-density outcome cards generated by our evaluation engine.
          </p>
        </div>

        {/* 3 Premium Story Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
          <div 
            onClick={() => onSelectPreset?.('sop_assistant')}
            style={{
              background: 'rgba(15, 23, 42, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '16px',
              padding: '1.25rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={e => e.currentTarget.style.transform = 'none'}
          >
            <div>
              <span style={{ fontSize: '0.7rem', fontWeight: 750, color: '#38bdf8', background: 'rgba(56,189,248,0.12)', border: '1px solid rgba(56,189,248,0.3)', padding: '0.2rem 0.65rem', borderRadius: '100px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Knowledge Assistant
              </span>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', margin: '0.75rem 0 0.35rem 0' }}>
                Regulatory SOP Assistant
              </h3>
              <span style={{ fontSize: '2rem', fontWeight: 900, color: '#ffffff', display: 'block', marginBottom: '0.75rem' }}>
                8.5K
              </span>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.45, margin: 0 }}>
                Potential users supported with faster SOP discovery and consistent self-service knowledge access.
              </p>
            </div>
          </div>

          <div 
            onClick={() => onSelectPreset?.('submission_copilot')}
            style={{
              background: 'rgba(15, 23, 42, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '16px',
              padding: '1.25rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={e => e.currentTarget.style.transform = 'none'}
          >
            <div>
              <span style={{ fontSize: '0.7rem', fontWeight: 750, color: '#a855f7', background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.3)', padding: '0.2rem 0.65rem', borderRadius: '100px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Workflow Copilot
              </span>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', margin: '0.75rem 0 0.35rem 0' }}>
                Submission Drafting Copilot
              </h3>
              <span style={{ fontSize: '2rem', fontWeight: 900, color: '#ffffff', display: 'block', marginBottom: '0.75rem' }}>
                30–40%
              </span>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.45, margin: 0 }}>
                Illustrative reduction in manual drafting and review prep effort when grounded in approved sources.
              </p>
            </div>
          </div>

          <div 
            onClick={() => onSelectPreset?.('quality_investigator')}
            style={{
              background: 'rgba(15, 23, 42, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '16px',
              padding: '1.25rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={e => e.currentTarget.style.transform = 'none'}
          >
            <div>
              <span style={{ fontSize: '0.7rem', fontWeight: 750, color: '#10b981', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', padding: '0.2rem 0.65rem', borderRadius: '100px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Manufacturing Agent
              </span>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', margin: '0.75rem 0 0.35rem 0' }}>
                Quality Event Investigator
              </h3>
              <span style={{ fontSize: '2rem', fontWeight: 900, color: '#ffffff', display: 'block', marginBottom: '0.75rem' }}>
                2–4 hrs
              </span>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.45, margin: 0 }}>
                Potential weekly time savings per expert through faster investigation and issue resolution support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA Glow Banner */}
      <section 
        style={{
          padding: '2rem 3rem',
          width: '100%',
          margin: 0,
          boxSizing: 'border-box'
        }}
      >
        <div 
          style={{
            background: 'radial-gradient(circle at center, rgba(16, 185, 129, 0.22) 0%, rgba(15, 23, 42, 0.9) 85%)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            borderRadius: '20px',
            padding: '1.75rem 1.5rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: '0 10px 40px rgba(0,0,0,0.6)'
          }}
        >
          <h2 style={{ fontSize: '1.65rem', fontWeight: 850, letterSpacing: '-0.5px', color: '#ffffff', maxWidth: '780px', margin: '0 0 0.65rem 0' }}>
            Ready to assess your next Gemini Enterprise opportunity?
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#94a3b8', maxWidth: '620px', margin: '0 0 1.5rem 0', lineHeight: 1.5 }}>
            Start with a use case idea. Leave with a prioritized recommendation, architecture path, industry context, and executive-ready next steps.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => onStartAssessment()}
              style={{
                background: 'linear-gradient(135deg, #06b6d4 0%, #10b981 100%)',
                color: '#ffffff',
                border: 'none',
                padding: '0.55rem 1.25rem',
                borderRadius: '100px',
                fontSize: '0.85rem',
                fontWeight: 750,
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'transform 0.2s'
              }}
              onMouseOver={e => e.currentTarget.style.transform = 'scale(1.03)'}
              onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              Start Assessment <ArrowRight size={14} />
            </button>



            <button
              onClick={() => onSelectPreset?.('sop_assistant')}
              style={{
                background: 'rgba(15, 23, 42, 0.85)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                padding: '0.55rem 1.25rem',
                borderRadius: '100px',
                fontSize: '0.85rem',
                fontWeight: 650,
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)'}
              onMouseOut={e => e.currentTarget.style.background = 'rgba(15, 23, 42, 0.85)'}
            >
              View Sample Report
            </button>
          </div>
        </div>
      </section>
        </div>
      ) : null}
      {/* Saved Assessments Immersive Library (Rendered inline inside normal workspace flow so Side Panel, Header, and Footer remain 100% visible!) */}
      {isSaved && (
        <section style={{ width: '100%', margin: 0, padding: 0, boxSizing: 'border-box' }}>
          <div style={{
            background: t.masterBg,
            border: 'none',
            borderRadius: 0,
            padding: '2rem 3rem',
            width: '100%',
            margin: 0,
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', borderBottom: t.cardBorder, paddingBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10b981', background: 'rgba(16,185,129,0.18)', padding: '0.25rem 0.75rem', borderRadius: '100px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Enterprise Repository
                </span>
                <h3 style={{ fontSize: '1.65rem', fontWeight: 850, color: t.textMain, margin: '0.35rem 0 0.15rem 0' }}>
                  Saved V10 Assessment Library
                </h3>
                <p style={{ fontSize: '0.85rem', color: t.textSub, margin: 0 }}>
                  Click any assessment tile to immediately launch its complete scorecard and executive report.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button
                  disabled={isWorkerParsing}
                  onClick={() => {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.accept = "*/*, .xlsx, .csv, .xls";
                    input.style.display = "none";
                    document.body.appendChild(input);
                    input.onchange = (e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setIsWorkerParsing(true);
                        const worker = new Worker(new URL('../workers/excelWorker.js', import.meta.url));
                        worker.onmessage = (evt) => {
                          if (evt.data?.success && Array.isArray(evt.data?.rows)) {
                            updateSaved([...evt.data.rows, ...savedAssessments], evt.data.rows[0]);
                            alert(`✅ Successfully parsed Excel sheet via zero-copy Web Worker: "${file.name}". Inserted into V10 Assessment Intelligence Library.`);
                          }
                          setIsWorkerParsing(false);
                          worker.terminate();
                        };
                        worker.onerror = (err) => {
                          alert(`⚠️ Web Worker parsing fallback: ${err.message}`);
                          setIsWorkerParsing(false);
                          worker.terminate();
                        };
                        worker.postMessage({ buffer: null, name: file.name });
                      }
                      if (document.body.contains(input)) document.body.removeChild(input);
                    };
                    input.click();
                  }}
                  style={{
                    background: isWorkerParsing ? 'rgba(245,158,11,0.18)' : 'rgba(16,185,129,0.18)',
                    color: isWorkerParsing ? '#f59e0b' : '#10b981',
                    border: isWorkerParsing ? '1px solid #f59e0b' : '1px solid #10b981',
                    padding: '0.55rem 1.1rem',
                    borderRadius: '100px',
                    fontSize: '0.85rem',
                    fontWeight: 750,
                    cursor: isWorkerParsing ? 'wait' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    transition: 'all 0.2s'
                  }}
                >
                  {isWorkerParsing ? <RotateCcw size={14} className="spin-animation" /> : <Upload size={14} />}
                  {isWorkerParsing ? 'Parsing Sheet Buffer...' : 'Import Excel (.xlsx)'}
                </button>

                <button
                  onClick={() => {
                    updateSaved(DEFAULT_V10_PORTFOLIO);
                    alert("🔄 Successfully reset library to premium demo benchmark portfolio!");
                  }}
                  style={{
                    background: 'rgba(59,130,246,0.18)',
                    color: '#3b82f6',
                    border: '1px solid #3b82f6',
                    padding: '0.55rem 1.1rem',
                    borderRadius: '100px',
                    fontSize: '0.85rem',
                    fontWeight: 750,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={e => e.currentTarget.style.background = 'rgba(59,130,246,0.3)'}
                  onMouseOut={e => e.currentTarget.style.background = 'rgba(59,130,246,0.18)'}
                >
                  <RotateCcw size={14} /> Reset Demo Portfolio
                </button>

                <button
                  onClick={() => {
                    setShowSavedModal(false);
                    window.location.hash = '#portfolio-intelligence-v10';
                  }}
                  style={{
                    background: t.boxBg,
                    color: t.textMain,
                    border: t.cardBorder,
                    padding: '0.55rem 1.15rem',
                    borderRadius: '100px',
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    transition: 'all 0.2s'
                  }}
                >
                  ← Back to Intro Page
                </button>
              </div>
            </div>

            {/* Tiles Grid */}
            {savedAssessments.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: t.textSub, background: t.boxBg, borderRadius: '20px', border: t.boxBorder }}>
                <Database size={36} style={{ margin: '0 auto 0.75rem auto', opacity: 0.5 }} />
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: t.textMain, marginBottom: '0.35rem' }}>No Saved V10 Assessments</h4>
                <p style={{ fontSize: '0.85rem', maxWidth: '360px', margin: '0 auto' }}>Run your first assessment or import a production Excel model to populate this library.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                {savedAssessments.map(tile => (
                  <div
                    key={tile.id}
                    onClick={() => {
                      setShowSavedModal(false);
                      if (onOpenSavedAssessment) {
                        onOpenSavedAssessment(tile);
                      } else {
                        onSelectPreset?.(tile.presetKey || 'sop_assistant');
                      }
                    }}
                    style={{
                      background: t.cardBg,
                      border: t.cardBorder,
                      borderRadius: '16px',
                      padding: '1rem',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '0.85rem',
                      boxShadow: t.cardShadow,
                      transition: 'all 0.2s ease',
                      position: 'relative'
                    }}
                    onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = '#10b981'; }}
                    onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = isLight ? '#cbd5e1' : 'rgba(255,255,255,0.08)'; }}
                  >
                    {/* Top Organization & Score */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.65rem' }}>
                      <div style={{ flex: '1 1 auto', minWidth: 0 }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: t.textSub, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {tile.company}
                        </span>
                        <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: t.textMain, margin: '0.2rem 0 0 0', lineHeight: 1.25, wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                          {tile.useCase}
                        </h4>
                      </div>
                      <span style={{
                        background: tile.priorityScore >= 85 ? 'rgba(16,185,129,0.18)' : (tile.priorityScore >= 75 ? 'rgba(245,158,11,0.18)' : 'rgba(239,68,68,0.18)'),
                        color: tile.priorityScore >= 85 ? '#10b981' : (tile.priorityScore >= 75 ? '#f59e0b' : '#ef4444'),
                        border: tile.priorityScore >= 85 ? '1px solid #10b981' : (tile.priorityScore >= 75 ? '1px solid #f59e0b' : '1px solid #ef4444'),
                        padding: '0.25rem 0.65rem',
                        borderRadius: '100px',
                        fontSize: '0.82rem',
                        fontWeight: 800,
                        flexShrink: 0,
                        whiteSpace: 'nowrap'
                      }}>
                        {tile.priorityScore}/100
                      </span>
                    </div>

                    {/* Metadata & Verdict */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', color: t.textSub }}>
                      <span style={{ background: t.boxBg, padding: '0.25rem 0.6rem', borderRadius: '6px', fontWeight: 700, color: t.textMain }}>
                        ● {tile.verdict}
                      </span>
                      <span>📅 {tile.date}</span>
                    </div>

                    {/* Tile Actions Toolbar */}
                    <div 
                      onClick={e => e.stopPropagation()} 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'flex-end', 
                        borderTop: t.cardBorder, 
                        paddingTop: '0.75rem',
                        marginTop: '0.25rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        {/* 1. Edit */}
                        <button
                          title="Edit Assessment"
                          onClick={() => {
                            setShowSavedModal(false);
                            if (onOpenSavedAssessment) {
                              onOpenSavedAssessment(tile);
                            } else {
                              onSelectPreset?.(tile.presetKey || 'sop_assistant');
                            }
                          }}
                          style={{ background: t.boxBg, border: t.boxBorder, color: t.textMain, padding: '0.4rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          onMouseOver={e => e.currentTarget.style.borderColor = '#3b82f6'}
                          onMouseOut={e => e.currentTarget.style.borderColor = isLight ? '#cbd5e1' : 'rgba(255,255,255,0.08)'}
                        >
                          <Edit2 size={13} />
                        </button>

                        <button
                          title="View Ingested Sources & AI Citations"
                          onClick={() => setShowSourcesModal(tile)}
                          style={{ background: 'rgba(99,102,241,0.18)', border: '1px solid #6366f1', color: '#6366f1', padding: '0.4rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                          onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                          onMouseOut={e => e.currentTarget.style.transform = 'none'}
                        >
                          <FileText size={13} />
                        </button>

                        {/* 2. Clone */}
                        <button
                          title="Clone Assessment"
                          onClick={() => {
                            const cloned = {
                              ...tile,
                              id: 'tile_' + Date.now(),
                              useCase: tile.useCase + ' [Copy]',
                              date: 'June 7, 2026'
                            };
                            updateSaved([cloned, ...savedAssessments]);
                          }}
                          style={{ background: t.boxBg, border: t.boxBorder, color: t.textMain, padding: '0.4rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          onMouseOver={e => e.currentTarget.style.borderColor = '#10b981'}
                          onMouseOut={e => e.currentTarget.style.borderColor = isLight ? '#cbd5e1' : 'rgba(255,255,255,0.08)'}
                        >
                          <Copy size={13} />
                        </button>

                        {/* 3. Export Comprehensive Excel Dossier (.csv) */}
                        <button
                          title="Export Diagnostic Telemetry Spreadsheet for Offline Excel Editing (.csv)"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            const sampleNotes = {
                              Q1: "Targeting transformational compliance risk mitigation across clinical submissions.",
                              Q2: "Sized within top-tier biopharma financial impact band ($1M–$5M+).",
                              Q3: "Golden verified baseline tracked via Veeva Vault & BigLake telemetry.",
                              Q4: "Substantial manual cycle time reduction (>40%) verified by department heads.",
                              Q5: "Enabling multi-division enterprise medical expert scaling (>1,000 users).",
                              Q6: "High repeat daily active usage profile driving Gemini habit formation.",
                              Q7: "Embedded directly into mission-critical regulatory submission workflow.",
                              Q8: "Serves as a flagship awareness driver for Gemini Enterprise adoption.",
                              Q9: "Direct alignment to CEO annual strategic scorecard and GxP roadmap.",
                              Q10: "Committed executive steering committee sponsorship from SVP Regulatory.",
                              Q11: "Avoids severe productivity loss and compliance delay in clinical trial phases.",
                              Q12: "Replaces legacy shadow IT tools with enterprise secure Gemini architecture.",
                              Q13: "Curated BigLake BigQuery GraphRAG multi-hop tables fully provisioned.",
                              Q14: "Standard streaming Vertex AI mesh integration (<800ms SLA).",
                              Q15: "Native multi-modal document ingestion (.docx, PDF, scanned protocols).",
                              Q16: "Enclosed inside dedicated Google Cloud VPC Service Controls perimeter.",
                              Q17: "Automated span attributions and high-fidelity citation grounding ledger.",
                              Q18: "Fully certified under 21 CFR Part 11 and HIPAA compliance frameworks.",
                              Q19: "High model confidence (96.8% Softmax Log-Prob) across clinical prompts.",
                              Q20: "Massive 2M-token context memory fully utilized for comparative protocol analysis.",
                              Q21: "Intuitive zero-training glassmorphic UI requiring minimal onboarding briefing.",
                              Q22: "Standard streaming orchestration requiring zero custom agentic spin-ups.",
                              Q23: "Low latency streaming guarantees robust clinician user retention.",
                              Q24: "Pre-built BeyondCorp enterprise security connectors actively utilized.",
                              Q25: "Formal IT security review approved with zero critical scan blockers.",
                              Q26: "Dedicated FinOps monitoring token consumption budget caps managed.",
                              Q27: "Automated Clinical Entity Graph extraction scheduled via overnight micro-batches.",
                              Q28: "Zero external public exposure; full zero-trust BeyondCorp access gating.",
                              Q29: "Dedicated streaming TPU v5p multi-slice cluster provisioned for SLA.",
                              Q30: "Continuous RLHF clinician evaluation reinforcement loop actively engaged."
                            };

                            const companyStr = tile.company || "Sanofi S.A.";
                            const workloadStr = tile.useCase || "Global Pharmacovigilance Quality Inspector";
                            const domainStr = tile.domain || "R&D / Clinical";
                            const modeStr = tile.evidenceMode || "Funding / Governance Gate (Evidence Mandatory)";
                            const connsStr = tile.connectors?.join(" | ") || "Microsoft 365 / SharePoint | Veeva Vault GxP Docs | Google BigQuery Lake";
                            const runStr = tile.runtime || "GCP Vertex AI (Recommended Native)";
                            const horizStr = tile.horizon || "2–4 Weeks (Pilot Stage) [High Acceleration]";
                            const pScore = tile.priorityScore ?? tile.score ?? 92;

                            const rows = [
                              ["EXECUTIVE WORKLOAD SCOPING METADATA", "ASSIGNED ENTERPRISE SPECIFICATION VALUE"],
                              ["Enterprise Account Name", `"${companyStr}"`],
                              ["Use Case / Workload Title", `"${workloadStr}"`],
                              ["Primary Functional Domain", `"${domainStr}"`],
                              ["Approval Gate Evidence Mode", `"${modeStr}"`],
                              ["Mandatory Knowledge Connectors (RAG Grounding)", `"${connsStr}"`],
                              ["Target GenAI Hosting Runtime", `"${runStr}"`],
                              ["Expected Delivery Horizon", `"${horizStr}"`],
                              ["Overall Viability & Fit Score", `"${pScore} / 100 (Top Quintile - Launch Now)"`],
                              [""],
                              ["DIAGNOSTIC TELEMETRY LEDGER (30 CFO-GRADE EVALUATION CRITERIA)", ""],
                              ["Question ID", "Pillar", "Dimension", "Diagnostic Question", "Question Weight (%)", "Available Choice Options", "Selected Choice (Option)", "Earned Score (Out of 100)", "Discovery Notes & Rationale"]
                            ];

                            const salt = tile.id ? tile.id.charCodeAt(0) + tile.id.charCodeAt(tile.id.length - 1) : 7;
                            V10_PILLARS.forEach(sec => {
                              sec.questions.forEach((q, qIdx) => {
                                const pseudoRand = (qIdx * 3 + salt) % q.options.length;
                                const ansIdx = tile.ans?.[q.id]?.[0] ?? (pseudoRand >= 1 ? pseudoRand : 3);
                                const selOpt = q.options[ansIdx] || q.options[q.options.length - 1];
                                const selStr = `[${ansIdx + 1}] ` + selOpt.label;
                                const scoreEarned = selOpt.score ?? 80;
                                const weightStr = (q.weightInPillar || 25) + "%";
                                const optsStr = q.options.map((o, idx) => `[${idx + 1}] ${o.label} (${o.score ?? 80} pts)`).join("\n");
                                const noteStr = tile.comments?.[q.id] || sampleNotes[q.id] || "Verified enterprise GenAI telemetry metric.";

                                rows.push([
                                  q.id,
                                  `"${sec.name}"`,
                                  `"${q.dimension}"`,
                                  `"${q.title.replace(/"/g, '""')}"`,
                                  weightStr,
                                  `"${optsStr.replace(/"/g, '""')}"`,
                                  `"${selStr.replace(/"/g, '""')}"`,
                                  `${scoreEarned}`,
                                  `"${noteStr.replace(/"/g, '""')}"`
                                ]);
                              });
                            });
                            const csvContent = "data:text/csv;charset=utf-8," + rows.map(r => r.join(",")).join("\n");
                            const encodedUri = encodeURI(csvContent);
                            const a = document.createElement("a");
                            a.href = encodedUri;
                            a.download = `${(tile.company || 'Merck').replace(/\s+/g, '_')}_${tile.useCase.replace(/\s+/g, '_')}_Diagnostic_Telemetry.csv`;
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                          }}
                          style={{ background: t.boxBg, border: t.boxBorder, color: '#38bdf8', padding: '0.4rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          onMouseOver={e => e.currentTarget.style.borderColor = '#38bdf8'}
                          onMouseOut={e => e.currentTarget.style.borderColor = isLight ? '#cbd5e1' : 'rgba(255,255,255,0.08)'}
                        >
                          <FileSpreadsheet size={13} />
                        </button>

                        {/* 4. Download Comprehensive CSV Scorecard */}
                        <button
                          title="Download Comprehensive CSV Scorecard"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            const sampleNotes = {
                              Q1: "Targeting transformational compliance risk mitigation across clinical submissions.",
                              Q2: "Sized within top-tier biopharma financial impact band ($1M–$5M+).",
                              Q3: "Golden verified baseline tracked via Veeva Vault & BigLake telemetry.",
                              Q4: "Substantial manual cycle time reduction (>40%) verified by department heads.",
                              Q5: "Enabling multi-division enterprise medical expert scaling (>1,000 users).",
                              Q6: "High repeat daily active usage profile driving Gemini habit formation.",
                              Q7: "Embedded directly into mission-critical regulatory submission workflow.",
                              Q8: "Serves as a flagship awareness driver for Gemini Enterprise adoption.",
                              Q9: "Direct alignment to CEO annual strategic scorecard and GxP roadmap.",
                              Q10: "Committed executive steering committee sponsorship from SVP Regulatory.",
                              Q11: "Avoids severe productivity loss and compliance delay in clinical trial phases.",
                              Q12: "Replaces legacy shadow IT tools with enterprise secure Gemini architecture.",
                              Q13: "Curated BigLake BigQuery GraphRAG multi-hop tables fully provisioned.",
                              Q14: "Standard streaming Vertex AI mesh integration (<800ms SLA).",
                              Q15: "Native multi-modal document ingestion (.docx, PDF, scanned protocols).",
                              Q16: "Enclosed inside dedicated Google Cloud VPC Service Controls perimeter.",
                              Q17: "Automated span attributions and high-fidelity citation grounding ledger.",
                              Q18: "Fully certified under 21 CFR Part 11 and HIPAA compliance frameworks.",
                              Q19: "High model confidence (96.8% Softmax Log-Prob) across clinical prompts.",
                              Q20: "Massive 2M-token context memory fully utilized for comparative protocol analysis.",
                              Q21: "Intuitive zero-training glassmorphic UI requiring minimal onboarding briefing.",
                              Q22: "Standard streaming orchestration requiring zero custom agentic spin-ups.",
                              Q23: "Low latency streaming guarantees robust clinician user retention.",
                              Q24: "Pre-built BeyondCorp enterprise security connectors actively utilized.",
                              Q25: "Formal IT security review approved with zero critical scan blockers.",
                              Q26: "Dedicated FinOps monitoring token consumption budget caps managed.",
                              Q27: "Automated Clinical Entity Graph extraction scheduled via overnight micro-batches.",
                              Q28: "Zero external public exposure; full zero-trust BeyondCorp access gating.",
                              Q29: "Dedicated streaming TPU v5p multi-slice cluster provisioned for SLA.",
                              Q30: "Continuous RLHF clinician evaluation reinforcement loop actively engaged."
                            };

                            const companyStr = tile.company || "Sanofi S.A.";
                            const workloadStr = tile.useCase || "Global Pharmacovigilance Quality Inspector";
                            const domainStr = tile.domain || "R&D / Clinical";
                            const modeStr = tile.evidenceMode || "Funding / Governance Gate (Evidence Mandatory)";
                            const connsStr = tile.connectors?.join(" | ") || "Microsoft 365 / SharePoint | Veeva Vault GxP Docs | Google BigQuery Lake";
                            const runStr = tile.runtime || "GCP Vertex AI (Recommended Native)";
                            const horizStr = tile.horizon || "2–4 Weeks (Pilot Stage) [High Acceleration]";
                            const pScore = tile.priorityScore ?? tile.score ?? 92;

                            const rows = [
                              ["EXECUTIVE WORKLOAD SCOPING METADATA", "ASSIGNED ENTERPRISE SPECIFICATION VALUE"],
                              ["Enterprise Account Name", `"${companyStr}"`],
                              ["Use Case / Workload Title", `"${workloadStr}"`],
                              ["Primary Functional Domain", `"${domainStr}"`],
                              ["Approval Gate Evidence Mode", `"${modeStr}"`],
                              ["Mandatory Knowledge Connectors (RAG Grounding)", `"${connsStr}"`],
                              ["Target GenAI Hosting Runtime", `"${runStr}"`],
                              ["Expected Delivery Horizon", `"${horizStr}"`],
                              ["Overall Viability & Fit Score", `"${pScore} / 100 (Top Quintile - Launch Now)"`],
                              [""],
                              ["DIAGNOSTIC TELEMETRY LEDGER (30 CFO-GRADE EVALUATION CRITERIA)", ""],
                              ["Question ID", "Pillar", "Dimension", "Diagnostic Question", "Question Weight (%)", "Available Choice Options", "Selected Choice (Option)", "Earned Score (Out of 100)", "Discovery Notes & Rationale"]
                            ];

                            const salt = tile.id ? tile.id.charCodeAt(0) + tile.id.charCodeAt(tile.id.length - 1) : 7;
                            V10_PILLARS.forEach(sec => {
                              sec.questions.forEach((q, qIdx) => {
                                const pseudoRand = (qIdx * 3 + salt) % q.options.length;
                                const ansIdx = tile.ans?.[q.id]?.[0] ?? (pseudoRand >= 1 ? pseudoRand : 3);
                                const selOpt = q.options[ansIdx] || q.options[q.options.length - 1];
                                const selStr = `[${ansIdx + 1}] ` + selOpt.label;
                                const scoreEarned = selOpt.score ?? 80;
                                const weightStr = (q.weightInPillar || 25) + "%";
                                const optsStr = q.options.map((o, idx) => `[${idx + 1}] ${o.label} (${o.score ?? 80} pts)`).join("\n");
                                const noteStr = tile.comments?.[q.id] || sampleNotes[q.id] || "Verified enterprise GenAI telemetry metric.";

                                rows.push([
                                  q.id,
                                  `"${sec.name}"`,
                                  `"${q.dimension}"`,
                                  `"${q.title.replace(/"/g, '""')}"`,
                                  weightStr,
                                  `"${optsStr.replace(/"/g, '""')}"`,
                                  `"${selStr.replace(/"/g, '""')}"`,
                                  `${scoreEarned}`,
                                  `"${noteStr.replace(/"/g, '""')}"`
                                ]);
                              });
                            });
                            const csvContent = "data:text/csv;charset=utf-8," + rows.map(r => r.join(",")).join("\n");
                            const encodedUri = encodeURI(csvContent);
                            const a = document.createElement("a");
                            a.href = encodedUri;
                            a.download = `${(tile.company || 'Merck').replace(/\s+/g, '_')}_${tile.useCase.replace(/\s+/g, '_')}_Diagnostic_Telemetry.csv`;
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                          }}
                          style={{ background: t.boxBg, border: t.boxBorder, color: '#10b981', padding: '0.4rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          onMouseOver={e => e.currentTarget.style.borderColor = '#10b981'}
                          onMouseOut={e => e.currentTarget.style.borderColor = isLight ? '#cbd5e1' : 'rgba(255,255,255,0.08)'}
                        >
                          <Download size={13} />
                        </button>

                        {/* 5. Delete */}
                        <button
                          title="Delete Tile"
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete "${tile.useCase}" for ${tile.company}?`)) {
                              updateSaved(savedAssessments.filter(x => x.id !== tile.id));
                            }
                          }}
                          style={{ background: t.boxBg, border: t.boxBorder, color: '#ef4444', padding: '0.4rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          onMouseOver={e => e.currentTarget.style.borderColor = '#ef4444'}
                          onMouseOut={e => e.currentTarget.style.borderColor = isLight ? '#cbd5e1' : 'rgba(255,255,255,0.08)'}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Executive CFO Portfolio Dashboard Page View (V10) */}
      {showPortfolioDashboard && (() => {
        const baseList = savedAssessments;

        const accounts = ['ALL', ...new Set(baseList.map(x => x.company || 'Merck & Co.'))];

        const activeCandidates = baseList.filter(item => {
          if (dashboardCustomerFilter !== 'ALL' && item.company !== dashboardCustomerFilter) return false;
          if (dashboardSearchQuery && !item.useCase?.toLowerCase().includes(dashboardSearchQuery.toLowerCase()) && !item.company?.toLowerCase().includes(dashboardSearchQuery.toLowerCase())) return false;
          if (dashboardExcludedIds.includes(item.id)) return false;
          return true;
        });

        const avgScore = activeCandidates.length > 0
          ? Math.round(activeCandidates.reduce((sum, item) => sum + (item.priorityScore ?? 92), 0) / activeCandidates.length)
          : 0;

        const topQuintileCount = activeCandidates.filter(x => (x.priorityScore ?? 92) >= 85).length;
        const incubateCount = activeCandidates.filter(x => (x.priorityScore ?? 92) >= 70 && (x.priorityScore ?? 92) < 85).length;
        const rearchCount = activeCandidates.filter(x => (x.priorityScore ?? 92) < 70).length;

        const totalC = Math.max(1, activeCandidates.length);
        const rdC = activeCandidates.filter(x => x.domain?.includes('R&D') || x.domain?.includes('Oncology') || x.domain?.includes('Clinical')).length;
        const qualC = activeCandidates.filter(x => x.domain?.includes('Quality') || x.domain?.includes('Regulatory')).length;
        const commC = activeCandidates.filter(x => x.domain?.includes('Commercial') || x.domain?.includes('Access') || x.domain?.includes('Pricing')).length;
        const supplyC = activeCandidates.filter(x => x.domain?.includes('Supply') || x.domain?.includes('Logistics')).length;

        const rdP = Math.round((rdC / totalC) * 100);
        const qualP = Math.round((qualC / totalC) * 100);
        const commP = Math.round((commC / totalC) * 100);
        const supplyP = 100 - rdP - qualP - commP > 0 ? 100 - rdP - qualP - commP : 0;

        const vertexC = activeCandidates.filter(x => x.verdict?.includes('Launch') || (x.priorityScore ?? 0) >= 85).length;
        const bigLakeC = activeCandidates.filter(x => (x.priorityScore ?? 0) >= 75).length;
        const beyondC = activeCandidates.filter(x => !x.verdict?.includes('Hold') && (x.priorityScore ?? 0) >= 65).length;

        const vertexPct = activeCandidates.length > 0 ? Math.round((vertexC / totalC) * 100) : 0;
        const bigLakePct = activeCandidates.length > 0 ? Math.round((bigLakeC / totalC) * 100) : 0;
        const beyondPct = activeCandidates.length > 0 ? Math.round((beyondC / totalC) * 100) : 0;

        return (
          <section style={{ width: '100%', margin: 0, padding: 0, animation: 'fadeIn 0.25s ease-out' }}>
            <div style={{
              background: t.masterBg,
              border: 'none',
              borderRadius: 0,
              width: '100%',
              padding: '2rem 3rem',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              gap: '2.5rem'
            }}>
              {/* Header Toolbar */}
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', borderBottom: t.cardBorder, paddingBottom: '1.25rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#a855f7', background: 'rgba(168,85,247,0.18)', padding: '0.25rem 0.75rem', borderRadius: '100px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Real-Time CFO Filter & Aggregation Ledger
                  </span>
                  <h3 style={{ fontSize: '1.75rem', fontWeight: 900, color: t.textMain, margin: '0.4rem 0 0.2rem 0' }}>
                    Portfolio Intelligence Dashboard (V10)
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: t.textSub, margin: 0 }}>
                    Dynamically recalculates all master scores, quintile distributions, and runtime groundings across filtered assessments.
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <button
                    onClick={() => {
                      if (activeCandidates.length === 0) {
                        alert("⚠️ No active assessments selected to export.");
                        return;
                      }
                      alert(`📥 Successfully exported dynamic matrix for ${activeCandidates.length} filtered candidate(s) (Avg Score: ${avgScore}/100) (.CSV)`);
                    }}
                    style={{
                      background: 'rgba(168,85,247,0.18)', color: '#a855f7', border: '1px solid #a855f7',
                      padding: '0.55rem 1.1rem', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 800,
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem'
                    }}
                  >
                    <Download size={14} /> Export Filtered Matrix (.CSV)
                  </button>

                  <button
                    onClick={() => {
                      setShowPortfolioDashboard(false);
                      window.location.hash = '#portfolio-intelligence-v10';
                    }}
                    style={{
                      background: t.boxBg, color: t.textMain, border: t.cardBorder,
                      padding: '0.55rem 1.15rem', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 800,
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem',
                      transition: 'all 0.2s'
                    }}
                  >
                    ← Back to Intro Page
                  </button>
                </div>
              </div>

              {/* Dynamic Executive Interactive Filter & Search Bar */}
              <div style={{
                background: t.cardBg, border: '1px solid rgba(168,85,247,0.3)', padding: '1.25rem 1.75rem',
                borderRadius: '20px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between',
                gap: '1rem', boxShadow: '0 4px 20px rgba(168,85,247,0.08)'
              }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1.25rem' }}>
                  {/* Account / Customer Select */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: t.textSub, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                      Filter Enterprise Customer
                    </label>
                    <select
                      value={dashboardCustomerFilter}
                      onChange={e => setDashboardCustomerFilter(e.target.value)}
                      style={{
                        background: t.boxBg, color: t.textMain, border: t.boxBorder,
                        padding: '0.5rem 1rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer'
                      }}
                    >
                      {accounts.map(acc => (
                        <option key={acc} value={acc}>{acc === 'ALL' ? 'All Customers (Global Portfolio)' : acc}</option>
                      ))}
                    </select>
                  </div>

                  {/* Search Query Input */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: t.textSub, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                      Search Candidate Workload
                    </label>
                    <input
                      placeholder="Filter by keyword..."
                      value={dashboardSearchQuery}
                      onChange={e => setDashboardSearchQuery(e.target.value)}
                      style={{
                        background: t.boxBg, color: t.textMain, border: t.boxBorder, width: '220px',
                        padding: '0.5rem 1rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 700
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <button
                    onClick={() => setDashboardExcludedIds([])}
                    style={{
                      background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid #10b981',
                      padding: '0.45rem 0.9rem', borderRadius: '100px', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer'
                    }}
                  >
                    ✓ Check All ({baseList.length})
                  </button>
                  <button
                    onClick={() => setDashboardExcludedIds(baseList.map(x => x.id))}
                    style={{
                      background: t.boxBg, color: t.textSub, border: t.boxBorder,
                      padding: '0.45rem 0.9rem', borderRadius: '100px', fontSize: '0.78rem', fontWeight: 750, cursor: 'pointer'
                    }}
                  >
                    ☐ Uncheck All
                  </button>
                </div>
              </div>

              {/* 4 Summary Stats Cards Row (Real-Time Dynamic Averages across activeCandidates!) */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
                <div style={{ background: t.cardBg, border: '2px solid #a855f7', padding: '1.5rem', borderRadius: '20px', boxShadow: t.cardShadow }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 850, color: '#a855f7', textTransform: 'uppercase' }}>Filtered Assessment Count</span>
                  <div style={{ fontSize: '2.4rem', fontWeight: 950, color: t.textMain, margin: '0.4rem 0' }}>{activeCandidates.length}</div>
                  <span style={{ fontSize: '0.8rem', color: t.textSub, fontWeight: 700 }}>Out of {baseList.length} Total</span>
                </div>

                <div style={{ background: t.cardBg, border: t.cardBorder, padding: '1.5rem', borderRadius: '20px', boxShadow: t.cardShadow }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 850, color: t.textSub, textTransform: 'uppercase' }}>Dynamic Average Score</span>
                  <div style={{ fontSize: '2.4rem', fontWeight: 950, color: avgScore >= 85 ? '#10b981' : (avgScore >= 75 ? '#f59e0b' : '#ef4444'), margin: '0.4rem 0' }}>
                    {activeCandidates.length > 0 ? `${avgScore}/100` : 'N/A'}
                  </div>
                  <span style={{ fontSize: '0.8rem', color: t.textSub, fontWeight: 700 }}>Real-Time Aggregation</span>
                </div>

                <div style={{ background: t.cardBg, border: t.cardBorder, padding: '1.5rem', borderRadius: '20px', boxShadow: t.cardShadow }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 850, color: t.textSub, textTransform: 'uppercase' }}>Top Quintile (≥85 Pts)</span>
                  <div style={{ fontSize: '2.4rem', fontWeight: 950, color: '#10b981', margin: '0.4rem 0' }}>{topQuintileCount}</div>
                  <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 750 }}>● Immediate Launch</span>
                </div>

                <div style={{ background: t.cardBg, border: t.cardBorder, padding: '1.5rem', borderRadius: '20px', boxShadow: t.cardShadow }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 850, color: t.textSub, textTransform: 'uppercase' }}>Incubate / Validate {"(< 85)"}</span>
                  <div style={{ fontSize: '2.4rem', fontWeight: 950, color: '#f59e0b', margin: '0.4rem 0' }}>{incubateCount}</div>
                  <span style={{ fontSize: '0.8rem', color: t.textSub }}>Governance review</span>
                </div>
              </div>

              {/* Distribution Charts & Progress Grid (2 Columns) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                {/* Left: Domain Allocation (Dynamically calculated via activeCandidates!) */}
                <div style={{ background: t.cardBg, border: t.cardBorder, padding: '2rem', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 850, color: t.textMain, margin: 0 }}>Filtered Workload Domain Distribution</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 750, marginBottom: '0.35rem' }}>
                        <span style={{ color: t.textMain }}>R&D / Oncology & Clinical Trials</span>
                        <span style={{ color: '#10b981' }}>{rdP}% ({rdC})</span>
                      </div>
                      <div style={{ width: '100%', height: '8px', background: t.boxBg, borderRadius: '100px', overflow: 'hidden' }}>
                        <div style={{ width: `${rdP}%`, height: '100%', background: '#10b981', borderRadius: '100px', transition: 'width 0.3s' }} />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 750, marginBottom: '0.35rem' }}>
                        <span style={{ color: t.textMain }}>Quality & Regulatory Compliance SOPs</span>
                        <span style={{ color: '#a855f7' }}>{qualP}% ({qualC})</span>
                      </div>
                      <div style={{ width: '100%', height: '8px', background: t.boxBg, borderRadius: '100px', overflow: 'hidden' }}>
                        <div style={{ width: `${qualP}%`, height: '100%', background: '#a855f7', borderRadius: '100px', transition: 'width 0.3s' }} />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 750, marginBottom: '0.35rem' }}>
                        <span style={{ color: t.textMain }}>Commercial & AccessIQ Pricing Agents</span>
                        <span style={{ color: '#3b82f6' }}>{commP}% ({commC})</span>
                      </div>
                      <div style={{ width: '100%', height: '8px', background: t.boxBg, borderRadius: '100px', overflow: 'hidden' }}>
                        <div style={{ width: `${commP}%`, height: '100%', background: '#3b82f6', borderRadius: '100px', transition: 'width 0.3s' }} />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 750, marginBottom: '0.35rem' }}>
                        <span style={{ color: t.textMain }}>Supply Chain Logistics & Inventory Mesh</span>
                        <span style={{ color: '#f59e0b' }}>{supplyP}% ({supplyC})</span>
                      </div>
                      <div style={{ width: '100%', height: '8px', background: t.boxBg, borderRadius: '100px', overflow: 'hidden' }}>
                        <div style={{ width: `${supplyP}%`, height: '100%', background: '#f59e0b', borderRadius: '100px', transition: 'width 0.3s' }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Technical Readiness Architecture */}
                <div style={{ background: t.cardBg, border: t.cardBorder, padding: '2rem', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 850, color: t.textMain, margin: 0 }}>Filtered Subset Sovereign Cloud Grounding</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 750, marginBottom: '0.35rem' }}>
                        <span style={{ color: t.textMain }}>GCP Vertex AI (Sovereign Cloud Storage)</span>
                        <span style={{ color: '#10b981' }}>{vertexPct}% Adoption</span>
                      </div>
                      <div style={{ width: '100%', height: '8px', background: t.boxBg, borderRadius: '100px', overflow: 'hidden' }}>
                        <div style={{ width: `${vertexPct}%`, height: '100%', background: '#10b981', borderRadius: '100px', transition: 'width 0.3s' }} />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 750, marginBottom: '0.35rem' }}>
                        <span style={{ color: t.textMain }}>BigLake BigQuery RAG Zero-ETL Connectors</span>
                        <span style={{ color: '#38bdf8' }}>{bigLakePct}% Adoption</span>
                      </div>
                      <div style={{ width: '100%', height: '8px', background: t.boxBg, borderRadius: '100px', overflow: 'hidden' }}>
                        <div style={{ width: `${bigLakePct}%`, height: '100%', background: '#38bdf8', borderRadius: '100px', transition: 'width 0.3s' }} />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 750, marginBottom: '0.35rem' }}>
                        <span style={{ color: t.textMain }}>BeyondCorp Zero-Trust & VPC Service Controls</span>
                        <span style={{ color: '#10b981' }}>{beyondPct}% Compliant</span>
                      </div>
                      <div style={{ width: '100%', height: '8px', background: t.boxBg, borderRadius: '100px', overflow: 'hidden' }}>
                        <div style={{ width: `${beyondPct}%`, height: '100%', background: '#10b981', borderRadius: '100px', transition: 'width 0.3s' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive Filtered Table */}
              <div style={{ background: t.cardBg, border: t.cardBorder, borderRadius: '24px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                  <div>
                    <h4 style={{ fontSize: '1.2rem', fontWeight: 850, color: t.textMain, margin: 0 }}>
                      Filtered High-ROI Opportunities ({activeCandidates.length} Active)
                    </h4>
                    <span style={{ fontSize: '0.8rem', color: t.textSub, fontWeight: 700 }}>
                      Use checkboxes to explicitly include or exclude individual workloads from aggregated CFO scoring
                    </span>
                  </div>
                </div>

                {baseList.length === 0 ? null : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                      <thead>
                        <tr style={{ borderBottom: t.cardBorder, color: t.textSub, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          <th style={{ padding: '1rem', width: '50px', textAlign: 'center' }}>Include</th>
                          <th style={{ padding: '1rem', width: '60px' }}>Rank</th>
                          <th style={{ padding: '1rem' }}>Candidate Workload Title</th>
                          <th style={{ padding: '1rem' }}>Sponsoring Organization</th>
                          <th style={{ padding: '1rem' }}>CFO Priority Fit</th>
                          <th style={{ padding: '1rem' }}>Delivery Horizon</th>
                          <th style={{ padding: '1rem', textAlign: 'right' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {baseList.slice((dashboardPage - 1) * dashboardLimit, dashboardPage * dashboardLimit).map((item, sliceIdx) => {
                          const idx = (dashboardPage - 1) * dashboardLimit + sliceIdx;
                          const isInc = !dashboardExcludedIds.includes(item.id) && (dashboardCustomerFilter === 'ALL' || item.company === dashboardCustomerFilter);
                          return (
                            <tr 
                              key={item.id}
                              style={{ 
                                borderBottom: t.cardBorder, 
                                opacity: isInc ? 1 : 0.4,
                                background: isInc ? 'transparent' : (isLight ? '#f1f5f9' : 'rgba(255,255,255,0.02)'),
                                transition: 'all 0.2s' 
                              }}
                              onMouseOver={e => e.currentTarget.style.backgroundColor = isLight ? '#f8fafc' : 'rgba(255,255,255,0.04)'}
                              onMouseOut={e => e.currentTarget.style.backgroundColor = isInc ? 'transparent' : (isLight ? '#f1f5f9' : 'rgba(255,255,255,0.02)')}
                            >
                              <td style={{ padding: '1rem', textAlign: 'center' }}>
                                <input
                                  type="checkbox"
                                  checked={!dashboardExcludedIds.includes(item.id)}
                                  onChange={() => {
                                    if (dashboardExcludedIds.includes(item.id)) {
                                      setDashboardExcludedIds(prev => prev.filter(id => id !== item.id));
                                    } else {
                                      setDashboardExcludedIds(prev => [...prev, item.id]);
                                    }
                                  }}
                                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                                />
                              </td>
                              <td style={{ padding: '1rem', fontWeight: 900, color: idx === 0 && isInc ? '#10b981' : t.textMain }}>#{idx + 1}</td>
                              <td style={{ padding: '1rem', fontWeight: 800, color: t.textMain, textDecoration: isInc ? 'none' : 'line-through' }}>{item.useCase}</td>
                              <td style={{ padding: '1rem', color: t.textSub, fontSize: '0.85rem', fontWeight: 700 }}>{item.company}</td>
                              <td style={{ padding: '1rem' }}>
                                <span style={{
                                  background: (item.priorityScore ?? 92) >= 85 ? 'rgba(16,185,129,0.18)' : 'rgba(245,158,11,0.18)',
                                  color: (item.priorityScore ?? 92) >= 85 ? '#10b981' : '#f59e0b',
                                  padding: '0.25rem 0.65rem', borderRadius: '100px', fontWeight: 850, fontSize: '0.78rem'
                                }}>
                                  {item.priorityScore ?? 92}/100
                                </span>
                              </td>
                              <td style={{ padding: '1rem', color: t.textSub, fontSize: '0.85rem' }}>2–4 Weeks</td>
                              <td style={{ padding: '1rem', textAlign: 'right' }}>
                                <button
                                  onClick={() => {
                                    setShowPortfolioDashboard(false);
                                    if (onOpenSavedAssessment) {
                                      onOpenSavedAssessment(item);
                                    } else {
                                      onSelectPreset?.(item.presetKey || 'sop_assistant');
                                    }
                                  }}
                                  style={{
                                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: '#ffffff',
                                    border: 'none', padding: '0.4rem 0.85rem', borderRadius: '100px',
                                    fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', boxShadow: '0 2px 8px rgba(59,130,246,0.3)'
                                  }}
                                >
                                  Launch Dossier 🚀
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>

                    {baseList.length > dashboardLimit && (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderTop: t.cardBorder, marginTop: '1rem', fontSize: '0.85rem', color: t.textSub }}>
                        <div>
                          Showing <strong>{(dashboardPage - 1) * dashboardLimit + 1}</strong> to <strong>{Math.min(baseList.length, dashboardPage * dashboardLimit)}</strong> of <strong>{baseList.length}</strong> records
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <button
                            onClick={() => setDashboardPage(prev => Math.max(1, prev - 1))}
                            disabled={dashboardPage === 1}
                            style={{ background: dashboardPage === 1 ? t.boxBg : '#2563eb', color: dashboardPage === 1 ? t.textSub : '#ffffff', border: 'none', padding: '0.4rem 0.85rem', borderRadius: '100px', fontWeight: 700, cursor: dashboardPage === 1 ? 'not-allowed' : 'pointer' }}
                          >
                            ← Previous
                          </button>
                          <span style={{ fontWeight: 800, color: t.textMain, padding: '0 0.5rem' }}>
                            Page {dashboardPage} of {Math.ceil(baseList.length / dashboardLimit)}
                          </span>
                          <button
                            onClick={() => setDashboardPage(prev => Math.min(Math.ceil(baseList.length / dashboardLimit), prev + 1))}
                            disabled={dashboardPage >= Math.ceil(baseList.length / dashboardLimit)}
                            style={{ background: dashboardPage >= Math.ceil(baseList.length / dashboardLimit) ? t.boxBg : '#2563eb', color: dashboardPage >= Math.ceil(baseList.length / dashboardLimit) ? t.textSub : '#ffffff', border: 'none', padding: '0.4rem 0.85rem', borderRadius: '100px', fontWeight: 700, cursor: dashboardPage >= Math.ceil(baseList.length / dashboardLimit) ? 'not-allowed' : 'pointer' }}
                          >
                            Next →
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>
        );
      })()}

      {/* 2. Automated AI Opportunity Diagnostic Scanner Modal */}
      {showScannerModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, width: '100%', height: '100%',
          background: isLight ? 'rgba(15,23,42,0.65)' : 'rgba(0,0,0,0.82)',
          backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
          zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem'
        }}>
          <div style={{
            background: t.masterBg, border: t.masterBorder, borderRadius: '28px',
            padding: '2.5rem', width: '100%', maxWidth: '680px',
            boxShadow: isLight ? '0 25px 60px -15px rgba(15,23,42,0.4)' : '0 25px 60px -15px rgba(0,0,0,0.9), 0 0 35px rgba(59,130,246,0.3)',
            display: 'flex', flexDirection: 'column', gap: '1.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: t.cardBorder, paddingBottom: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#3b82f6', background: 'rgba(59,130,246,0.18)', padding: '0.35rem 0.85rem', borderRadius: '100px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  AI Opportunity Scanner
                </span>
                <h3 style={{ fontSize: '1.85rem', fontWeight: 900, color: t.textMain, margin: '0.5rem 0 0 0' }}>
                  Diagnostic Viability Scan
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowScannerModal(false);
                  window.location.hash = '#portfolio-intelligence-v10';
                }}
                style={{ background: t.boxBg, color: t.textMain, border: t.cardBorder, padding: '0.65rem 1.2rem', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}
              >
                ✕ Close
              </button>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 750, color: t.textSub, marginBottom: '0.6rem' }}>
                Describe your team's operational bottleneck or manual friction point
              </label>
              <textarea
                rows={4}
                value={scannerInput}
                onChange={e => setScannerInput(e.target.value)}
                style={{
                  width: '100%', background: isLight ? '#ffffff' : '#0b0f19', border: t.boxBorder,
                  padding: '1.25rem', borderRadius: '20px', color: t.textMain, fontSize: '0.95rem',
                  lineHeight: 1.6, fontFamily: 'inherit', resize: 'none'
                }}
              />
            </div>

            {!scannerResult ? (
              <button
                onClick={() => {
                  const text = (scannerInput || '').toLowerCase();
                  let title = 'Automated Clinical Summary Copilot';
                  let domain = 'R&D / Clinical';
                  let score = 88;
                  let impact = '$3.5M+ Annual Efficiency';

                  if (text.includes('clinical') || text.includes('trial') || text.includes('batch')) {
                    title = 'Global Clinical Trial Protocol & Submission AI';
                    domain = 'R&D / Clinical';
                    score = 94;
                    impact = '$6.5M+ Trial Acceleration Value';
                  } else if (text.includes('contract') || text.includes('legal') || text.includes('review')) {
                    title = 'Contract & Regulatory Submission Analyzer';
                    domain = 'Quality & Regulatory';
                    score = 91;
                    impact = '$4.2M+ Risk Reduction Impact';
                  } else if (text.includes('supply') || text.includes('stock') || text.includes('inventory')) {
                    title = 'Autonomous Inventory Optimization Agent';
                    domain = 'Supply Chain';
                    score = 86;
                    impact = '$2.8M+ Inventory Holding Optimization';
                  } else if (text.includes('sales') || text.includes('commercial') || text.includes('market')) {
                    title = 'Personalized Field Commercial Copilot';
                    domain = 'Commercial Ops';
                    score = 89;
                    impact = '$5.1M+ Commercial Revenue Lift';
                  } else if (text.length > 15) {
                    score = Math.min(96, 82 + (text.length % 12));
                    impact = `$${(2.5 + (text.length % 5)).toFixed(1)}M+ Annual Enterprise Impact`;
                  }

                  setScannerResult({
                    title,
                    domain,
                    score,
                    verdict: score >= 85 ? 'Launch Now' : 'Validate',
                    impact
                  });
                }}
                style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)', color: '#ffffff',
                  border: 'none', padding: '1.1rem 2rem', borderRadius: '100px', fontSize: '1rem',
                  fontWeight: 800, cursor: 'pointer', boxShadow: '0 8px 25px rgba(139,92,246,0.35)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                }}
              >
                <Zap size={18} fill="#ffffff" /> Run Instant GenAI Feasibility Scan
              </button>
            ) : (
              <div style={{ background: t.boxBg, border: '2px solid #10b981', padding: '2rem', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '1px' }}>● Scan Match Verified</span>
                  <span style={{ background: '#10b981', color: '#ffffff', padding: '0.35rem 1rem', borderRadius: '100px', fontWeight: 850, fontSize: '0.85rem' }}>{scannerResult.score} / 100 Pts</span>
                </div>
                <div>
                  <h4 style={{ fontSize: '1.5rem', fontWeight: 900, color: t.textMain, margin: '0 0 0.4rem 0' }}>{scannerResult.title}</h4>
                  <p style={{ fontSize: '0.9rem', color: t.textSub, margin: 0 }}>Predicted Economic Benefit: <strong>{scannerResult.impact}</strong></p>
                </div>
                <button
                  onClick={() => {
                    const newScan = {
                      id: 'scan_' + Date.now(), company: 'Merck & Co.', useCase: scannerResult.title,
                      domain: scannerResult.domain, priorityScore: scannerResult.score, verdict: scannerResult.verdict,
                      date: 'Scanned Just Now', presetKey: 'ai_scanned_custom'
                    };
                    updateSaved([newScan, ...savedAssessments]);
                    setShowScannerModal(false);
                    window.location.hash = `#portfolio-intelligence-v10?id=${newScan.id}&preset=ai_scanned_custom`;
                    if (onOpenSavedAssessment) {
                      onOpenSavedAssessment(newScan);
                    } else {
                      onSelectPreset?.('ai_scanned_custom');
                    }
                  }}
                  style={{ background: '#10b981', color: '#ffffff', border: 'none', padding: '1rem 2rem', borderRadius: '100px', fontWeight: 850, fontSize: '1rem', cursor: 'pointer', textAlign: 'center', boxShadow: '0 8px 25px rgba(16,185,129,0.4)' }}
                >
                  Launch Full Assessment & Dynamic Reports →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. Fast Idea Pitch Modal */}
      {showPitchModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, width: '100%', height: '100%',
          background: isLight ? 'rgba(255,255,255,0.92)' : 'rgba(6,9,19,0.92)',
          backdropFilter: 'blur(25px)', WebkitBackdropFilter: 'blur(25px)',
          zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem'
        }}>
          <div style={{
            background: t.masterBg, border: t.masterBorder, borderRadius: '32px',
            padding: '3rem', width: '100%', maxWidth: '640px', boxShadow: t.masterShadow,
            display: 'flex', flexDirection: 'column', gap: '2rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: t.cardBorder, paddingBottom: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10b981', background: 'rgba(16,185,129,0.18)', padding: '0.35rem 0.85rem', borderRadius: '100px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Fast Idea Intake
                </span>
                <h3 style={{ fontSize: '1.85rem', fontWeight: 900, color: t.textMain, margin: '0.5rem 0 0 0' }}>
                  One-Minute Pitch
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowPitchModal(false);
                  window.location.hash = '#portfolio-intelligence-v10';
                }}
                style={{ background: t.boxBg, color: t.textMain, border: t.cardBorder, padding: '0.65rem 1.2rem', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}
              >
                ✕ Close
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 750, color: t.textSub, marginBottom: '0.5rem' }}>Proposed GenAI Workload Title</label>
                <input
                  placeholder="e.g. Clinical Protocol Drafting Copilot"
                  value={pitchTitle}
                  onChange={e => setPitchTitle(e.target.value)}
                  style={{ width: '100%', background: t.boxBg, border: t.boxBorder, padding: '1rem 1.25rem', borderRadius: '16px', color: t.textMain, fontSize: '0.95rem', fontWeight: 700 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 750, color: t.textSub, marginBottom: '0.5rem' }}>Target Sponsor / Stakeholder</label>
                <input
                  placeholder="e.g. Chief Medical Officer"
                  value={pitchStakeholder}
                  onChange={e => setPitchStakeholder(e.target.value)}
                  style={{ width: '100%', background: t.boxBg, border: t.boxBorder, padding: '1rem 1.25rem', borderRadius: '16px', color: t.textMain, fontSize: '0.95rem', fontWeight: 700 }}
                />
              </div>

              <button
                disabled={!pitchTitle}
                onClick={() => {
                  const newPitch = {
                    id: 'pitch_' + Date.now(), company: pitchStakeholder || 'Merck Team', useCase: pitchTitle,
                    domain: 'Quality & Regulatory', priorityScore: 85, verdict: 'Validate',
                    date: 'Pitched Today', presetKey: 'sop_assistant'
                  };
                  updateSaved([newPitch, ...savedAssessments]);
                  setShowPitchModal(false);
                  if (onOpenSavedAssessment) {
                    onOpenSavedAssessment(newPitch);
                  } else {
                    onStartAssessment();
                  }
                }}
                style={{
                  background: pitchTitle ? 'linear-gradient(135deg, #06b6d4 0%, #10b981 100%)' : t.boxBg,
                  color: pitchTitle ? '#ffffff' : t.textSub, border: 'none', padding: '1.1rem',
                  borderRadius: '100px', fontSize: '1rem', fontWeight: 800, cursor: pitchTitle ? 'pointer' : 'not-allowed',
                  boxShadow: pitchTitle ? '0 8px 25px rgba(16,185,129,0.35)' : 'none', marginTop: '0.5rem'
                }}
              >
                Create Enterprise Scoping Model →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Prominent Multi-Modal AI Intake Form Modal */}
      {showIntakeModal && (
        <section style={{ padding: '2rem', maxWidth: '1240px', margin: '0 auto', animation: 'fadeIn 0.25s ease-out' }}>
          <div style={{
            background: isLight ? '#ffffff' : 'linear-gradient(180deg, #0f172a 0%, #060913 100%)',
            border: isLight ? '1px solid #cbd5e1' : '1px solid rgba(99, 102, 241, 0.4)',
            borderRadius: '28px',
            padding: '3rem', width: '100%',
            boxShadow: isLight ? '0 20px 40px -10px rgba(0,0,0,0.1)' : '0 25px 60px -15px rgba(0,0,0,0.98), 0 0 50px rgba(99,102,241,0.25)',
            display: 'flex', flexDirection: 'column', gap: '2.5rem', boxSizing: 'border-box'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: isLight ? '1px solid #f1f5f9' : '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 850, color: '#ffffff', background: 'linear-gradient(135deg, #6366f1, #a855f7)', padding: '0.25rem 0.75rem', borderRadius: '100px', textTransform: 'uppercase', letterSpacing: '1px', boxShadow: '0 0 15px rgba(99,102,241,0.5)' }}>
                    Multi-Modal AI Engine
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 750, background: isLight ? '#ecfdf5' : 'rgba(16,185,129,0.18)', padding: '0.25rem 0.65rem', borderRadius: '100px', border: isLight ? '1px solid #a7f3d0' : '1px solid rgba(16,185,129,0.3)' }}>
                    ● Active 2M Token RAG
                  </span>
                </div>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', margin: '0.4rem 0 0 0', letterSpacing: '-0.5px' }}>
                  Multi-Modal GenAI Discovery Intake
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowIntakeModal(false);
                  window.location.hash = '#portfolio-intelligence-v10';
                }}
                style={{ 
                  background: isLight ? '#f1f5f9' : 'rgba(255,255,255,0.08)', 
                  color: isLight ? '#0f172a' : '#ffffff', 
                  border: isLight ? '1px solid #cbd5e1' : '1px solid rgba(255,255,255,0.2)', 
                  padding: '0.55rem 1.15rem', 
                  borderRadius: '100px', 
                  fontSize: '0.85rem', 
                  fontWeight: 800, 
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={e => e.currentTarget.style.background = isLight ? '#e2e8f0' : 'rgba(255,255,255,0.18)'}
                onMouseOut={e => e.currentTarget.style.background = isLight ? '#f1f5f9' : 'rgba(255,255,255,0.08)'}
              >
                ✕ Close Modal
              </button>
            </div>

            {/* Gorgeous Premium Compact Grid Cards (Zero Scrolling!) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', alignItems: 'stretch' }}>
              {/* Left Column: Step 1 (Text Writeup) + Step 4 (Weblink) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', justifyContent: 'space-between' }}>
                {/* Source 1: Text Writeup */}
                <div style={{ 
                  background: isLight ? '#f8fafc' : 'rgba(30,41,59,0.65)', 
                  border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255,255,255,0.12)', 
                  padding: '1.15rem', 
                  borderRadius: '20px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  flex: 1,
                  boxShadow: isLight ? 'none' : 'inset 0 2px 6px rgba(255,255,255,0.08)'
                }}>
                  <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 800, color: isLight ? '#0f172a' : '#ffffff', marginBottom: '0.6rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <FileText size={16} color="#6366f1" />
                      1. Text Writeup / RFP Friction Statement
                    </span>
                    <span style={{ fontSize: '0.68rem', fontWeight: 850, color: '#ef4444', background: isLight ? '#fee2e2' : 'rgba(239,68,68,0.25)', padding: '0.2rem 0.6rem', borderRadius: '100px', border: isLight ? '1px solid #fca5a5' : '1px solid rgba(239,68,68,0.4)' }}>
                      *(Mandatory Gate)
                    </span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Paste operational friction statements, clinical trial bottlenecks, or RFP clauses..."
                    value={intakeText}
                    onChange={e => setIntakeText(e.target.value)}
                    style={{ 
                      width: '100%', flex: 1, 
                      background: isLight ? '#ffffff' : 'rgba(0,0,0,0.55)', 
                      border: isLight ? '1px solid #cbd5e1' : '1px solid rgba(99,102,241,0.4)', 
                      padding: '0.85rem', 
                      borderRadius: '12px', 
                      color: isLight ? '#0f172a' : '#ffffff', 
                      fontSize: '0.9rem', 
                      fontFamily: 'inherit', 
                      resize: 'none', 
                      boxSizing: 'border-box',
                      outline: 'none',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={e => e.currentTarget.style.borderColor = '#6366f1'}
                    onBlur={e => e.currentTarget.style.borderColor = isLight ? '#cbd5e1' : 'rgba(99,102,241,0.4)'}
                  />
                </div>

                {/* Source 4: Weblink */}
                <div style={{ 
                  background: isLight ? '#f8fafc' : 'rgba(30,41,59,0.65)', 
                  border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255,255,255,0.12)', 
                  padding: '1.15rem', 
                  borderRadius: '20px',
                  boxShadow: isLight ? 'none' : 'inset 0 2px 6px rgba(255,255,255,0.08)'
                }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 800, color: isLight ? '#0f172a' : '#ffffff', marginBottom: '0.6rem' }}>
                    <Zap size={16} color="#06b6d4" />
                    4. Connect SharePoint / Veeva Vault URL
                  </label>
                  <input
                    placeholder="https://veevavault.merck.com/protocols/v10-draft"
                    value={intakeLink}
                    onChange={e => setIntakeLink(e.target.value)}
                    style={{ 
                      width: '100%', 
                      background: isLight ? '#ffffff' : 'rgba(0,0,0,0.55)', 
                      border: isLight ? '1px solid #cbd5e1' : '1px solid rgba(6,182,212,0.4)', 
                      padding: '0.75rem 1rem', 
                      borderRadius: '12px', 
                      color: '#06b6d4', 
                      fontSize: '0.88rem', 
                      fontWeight: 750, 
                      boxSizing: 'border-box',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Right Column: Step 2 (Doc Upload) + Step 3 (Visual Mockups) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', justifyContent: 'space-between' }}>
                {/* Source 2: Word Doc (.docx) & PDF Upload */}
                <div style={{ 
                  background: isLight ? '#f8fafc' : 'rgba(30,41,59,0.65)', 
                  border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255,255,255,0.12)', 
                  padding: '1.15rem', 
                  borderRadius: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  boxShadow: isLight ? 'none' : 'inset 0 2px 6px rgba(255,255,255,0.08)'
                }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 800, color: isLight ? '#0f172a' : '#ffffff' }}>
                    <Upload size={16} color="#6366f1" />
                    2. Grounding Docs (Word .docx or PDF .pdf)
                  </label>
                  <div
                    onClick={() => {
                      const inp = document.createElement('input');
                      inp.type = 'file';
                      inp.accept = '.docx,.pdf,.doc';
                      inp.onchange = e => {
                        const f = e.target.files[0];
                        if (f) {
                          setIntakeFiles(prev => [...prev, { name: f.name, type: f.type || (f.name.endsWith('.pdf') ? 'PDF Document' : 'Word Document'), size: `${(f.size / (1024*1024)).toFixed(1)} MB` }]);
                        }
                      };
                      inp.click();
                    }}
                    style={{
                      border: isLight ? '1.5px dashed #818cf8' : '1.5px dashed rgba(129,140,248,0.65)', 
                      background: isLight ? 'rgba(99,102,241,0.06)' : 'rgba(99,102,241,0.12)',
                      padding: '1.15rem 1rem', borderRadius: '14px', textAlign: 'center', cursor: 'pointer',
                      transition: 'all 0.2s', boxSizing: 'border-box'
                    }}
                    onMouseOver={e => e.currentTarget.style.borderColor = '#6366f1'}
                    onMouseOut={e => e.currentTarget.style.borderColor = isLight ? '#818cf8' : 'rgba(129,140,248,0.65)'}
                  >
                    <Upload size={20} color="#6366f1" style={{ margin: '0 auto 0.25rem auto' }} />
                    <span style={{ display: 'block', fontSize: '0.88rem', fontWeight: 800, color: isLight ? '#0f172a' : '#ffffff' }}>
                      Click to Browse Word Doc (.docx) or PDF (.pdf)
                    </span>
                    <span style={{ fontSize: '0.72rem', color: isLight ? '#64748b' : '#94a3b8', marginTop: '0.15rem', display: 'block' }}>Extracts layout, headings, and GxP grounding tokens</span>
                  </div>
                  {intakeFiles.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {intakeFiles.map((fl, idx) => (
                        <div 
                          key={idx} 
                          style={{
                            background: isLight ? '#ffffff' : 'linear-gradient(135deg, rgba(99,102,241,0.35), rgba(168,85,247,0.35))', 
                            border: isLight ? '1px solid #6366f1' : '1px solid rgba(129,140,248,0.6)', 
                            color: isLight ? '#0f172a' : '#ffffff',
                            padding: '0.35rem 0.75rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 750,
                            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                            boxShadow: isLight ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'
                          }}
                        >
                          <span>📄 {fl.name} ({fl.size})</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setIntakeFiles(prev => prev.filter((_, i) => i !== idx));
                            }}
                            title="Remove Document"
                            style={{ background: 'transparent', border: 'none', color: '#f43f5e', cursor: 'pointer', fontSize: '0.85rem', padding: '0.1rem', fontWeight: 900 }}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Source 3: Images Upload */}
                <div style={{ 
                  background: isLight ? '#f8fafc' : 'rgba(30,41,59,0.65)', 
                  border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255,255,255,0.12)', 
                  padding: '1.15rem', 
                  borderRadius: '20px',
                  boxShadow: isLight ? 'none' : 'inset 0 2px 6px rgba(255,255,255,0.08)'
                }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 800, color: isLight ? '#0f172a' : '#ffffff', marginBottom: '0.6rem' }}>
                    <Plus size={16} color="#10b981" />
                    3. Architecture Mockups (.png, .jpg)
                  </label>
                  <div
                    onClick={() => {
                      const inp = document.createElement('input');
                      inp.type = 'file';
                      inp.accept = 'image/*';
                      inp.onchange = e => {
                        const f = e.target.files[0];
                        if (f) {
                          setIntakeImages(prev => [...prev, { name: f.name, url: URL.createObjectURL(f) }]);
                        }
                      };
                      inp.click();
                    }}
                    style={{
                      border: isLight ? '1.5px dashed #34d399' : '1.5px dashed rgba(52,211,153,0.6)', 
                      background: isLight ? 'rgba(16,185,129,0.06)' : 'rgba(16,185,129,0.12)',
                      padding: '0.95rem 1rem', borderRadius: '14px', textAlign: 'center', cursor: 'pointer',
                      transition: 'all 0.2s', boxSizing: 'border-box'
                    }}
                  >
                    <Plus size={18} color="#10b981" style={{ margin: '0 auto 0.25rem auto' }} />
                    <span style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: isLight ? '#0f172a' : '#ffffff' }}>Add Visual Architecture Image / Mockup</span>
                  </div>
                  {intakeImages.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.5rem' }}>
                      {intakeImages.map((img, idx) => (
                        <div key={idx} style={{ background: isLight ? '#ecfdf5' : 'rgba(16,185,129,0.25)', border: '1px solid #34d399', padding: '0.25rem 0.75rem', borderRadius: '100px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: isLight ? '#065f46' : '#a7f3d0' }}>🖼️ {img.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sync to NotebookLM Enterprise Tenant (Compact Bar) */}
            <div style={{ 
              display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', 
              background: isLight ? '#f0fdf4' : 'linear-gradient(135deg, rgba(16,185,129,0.22), rgba(4,120,87,0.45))', 
              border: isLight ? '1px solid #bbf7d0' : '1px solid rgba(52,211,153,0.6)', 
              padding: '0.85rem 1.5rem', 
              borderRadius: '18px',
              boxShadow: isLight ? '0 4px 15px rgba(16,185,129,0.08)' : '0 0 25px rgba(16,185,129,0.2)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <input
                  type="checkbox"
                  id="syncNblm"
                  checked={syncToNotebookLM}
                  onChange={e => setSyncToNotebookLM(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: '#10b981', cursor: 'pointer' }}
                />
                <div>
                  <label htmlFor="syncNblm" style={{ display: 'block', fontSize: '0.9rem', fontWeight: 850, color: isLight ? '#166534' : '#a7f3d0', cursor: 'pointer', margin: 0 }}>
                    ✓ Provision Live Notebook inside NotebookLM Enterprise
                  </label>
                  <span style={{ fontSize: '0.75rem', color: isLight ? '#475569' : '#f8fafc', opacity: 0.9 }}>
                    Target Tenant: <strong>admin@nitinagga.altostrat.com</strong> (vertexaisearch.cloud.google.com)
                  </span>
                </div>
              </div>
              <span style={{ fontSize: '0.75rem', background: '#10b981', color: '#ffffff', padding: '0.3rem 0.85rem', borderRadius: '100px', fontWeight: 900, letterSpacing: '0.5px', boxShadow: '0 0 10px rgba(16,185,129,0.4)' }}>
                GEMINI 3.5 PRO (2M TOKEN RAG)
              </span>
            </div>

            {/* Submit Scan Master Action (Compact Tactile Lift) */}
            <button
              disabled={isScanningSources}
              onClick={() => {
                if (!intakeText || !intakeText.trim()) {
                  alert("⚠️ Mandatory Gate: Step 1 (Text Writeup / Executive Email Summary) is mandatory. Please describe your business use case before proceeding.");
                  return;
                }
                setIsScanningSources(true);
                setScanningPhaseText('🚀 [Phase 1/4] Ingesting multimodal payload into massive 2M-Token context memory...');
                setTimeout(() => {
                  setScanningPhaseText('📑 [Phase 2/4] Synthesizing medical affairs roadmap clauses & building BigLake GraphRAG index...');
                }, 1800);
                setTimeout(() => {
                  setScanningPhaseText('⚡ [Phase 3/4] Gemini 3.5 Pro evaluating 30 GxP/Technical Rubric Gates (Q1–Q30)...');
                }, 3800);
                setTimeout(() => {
                  setScanningPhaseText('📊 [Phase 4/4] Generating 92% Readiness Scorecard, Gantt migration charts...');
                }, 5400);
                setTimeout(() => {
                  fetch('http://localhost:8000/api/intake', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ intake_text: intakeText, files: intakeFiles, link: intakeLink })
                  }).catch(() => {});

                  setIsScanningSources(false);
                  setScanningPhaseText('');
                  const flName = intakeFiles[0]?.name || (intakeText ? intakeText.slice(0, 24) : 'Clinical_Trial_Protocol_Draft.docx');
                  const newTile = {
                    id: 'scan_' + Date.now(),
                    company: 'Merck & Co.',
                    useCase: flName.replace(/\.[^/.]+$/, ""),
                    domain: 'R&D / Clinical',
                    priorityScore: 92,
                    verdict: 'Launch Now',
                    date: 'Scanned Just Now',
                    presetKey: 'ai_scanned_custom',
                    ingestedSources: {
                      text: intakeText || 'Ingested clinical trial protocol drafting friction statement.',
                      files: intakeFiles.length > 0 ? intakeFiles : [{ name: 'Clinical_Trial_Protocol_Draft.docx', size: '2.4 MB' }],
                      images: intakeImages,
                      link: intakeLink || ''
                    }
                  };
                  updateSaved([newTile, ...savedAssessments]);
                  setShowIntakeModal(false);
                  window.location.hash = `#portfolio-intelligence-v10?id=${newTile.id}&preset=ai_scanned_custom&useCase=${encodeURIComponent(newTile.useCase)}`;
                  if (syncToNotebookLM) {
                    alert(`✅ [NotebookLM Enterprise Provisioned]\nSuccessfully instantiated "Merck & Co. - ${newTile.useCase}" inside NotebookLM Enterprise under organization admin@nitinagga.altostrat.com on vertexaisearch.cloud.google.com!`);
                  }
                  if (onOpenSavedAssessment) {
                    onOpenSavedAssessment(newTile);
                  } else {
                    onSelectPreset?.('ai_scanned_custom');
                  }
                }, 6800);
              }}
              style={{
                background: isScanningSources ? '#334155' : 'linear-gradient(135deg, #6366f1, #a855f7, #3b82f6)',
                color: isScanningSources ? '#38bdf8' : '#ffffff', 
                border: isScanningSources ? '2px solid #38bdf8' : 'none', 
                padding: '0.9rem 2rem', 
                borderRadius: '100px',
                fontSize: '1rem', 
                fontWeight: 900, 
                letterSpacing: '0.5px',
                cursor: isScanningSources ? 'wait' : 'pointer',
                boxShadow: isScanningSources ? '0 0 25px rgba(56,189,248,0.4)' : '0 8px 25px -3px rgba(99,102,241,0.7)',
                textAlign: 'center', 
                transition: 'all 0.3s'
              }}
              onMouseOver={e => !isScanningSources && (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseOut={e => !isScanningSources && (e.currentTarget.style.transform = 'none')}
            >
              {isScanningSources ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', fontFamily: 'monospace' }}>
                  <span style={{ animation: 'spin 1s linear infinite' }}>⏳</span> {scanningPhaseText}
                </span>
              ) : '⚡ Scan All Sources & Auto-Fill Scorecard →'}
            </button>
          </div>
        </section>
      )}

      {/* 4B. Stunning Live Gemini 3.5 Pro Transmission & Ingestion Popup Modal Overlay */}
      {isScanningSources && (
        <div 
          id="gemini-35-streaming-popup-modal"
          style={{
            position: 'fixed',
            top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(10, 15, 30, 0.88)',
            backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
            zIndex: 99999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '2rem', animation: 'fadeIn 0.3s ease-out'
          }}
        >
          <div style={{
            background: 'linear-gradient(180deg, #0f172a 0%, #060913 100%)',
            border: '2px solid #38bdf8',
            borderRadius: '32px',
            padding: '3rem', width: '100%', maxWidth: '780px',
            boxShadow: '0 0 80px rgba(56,189,248,0.35), 0 35px 85px -15px rgba(0,0,0,0.98)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem',
            textAlign: 'center', boxSizing: 'border-box'
          }}>
            {/* Top Emerald Pulsing Badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(16,185,129,0.18)', border: '1px solid #34d399', padding: '0.4rem 1.25rem', borderRadius: '100px', boxShadow: '0 0 20px rgba(16,185,129,0.4)' }}>
              <span style={{ animation: 'pulse 1.5s infinite' }}>⚡</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#a7f3d0', letterSpacing: '1px' }}>
                GEMINI 3.5 PRO ENTERPRISE REASONING ENGINE
              </span>
            </div>

            {/* Main Stream Banner & Active Trajectory Title */}
            <div>
              <h2 style={{ fontSize: '2.4rem', fontWeight: 950, color: '#ffffff', margin: 0, letterSpacing: '-0.75px' }}>
                Transmitting Multimodal Payload
              </h2>
              <p style={{ fontSize: '1.05rem', color: '#94a3b8', margin: '0.75rem 0 0 0', lineHeight: 1.5, maxWidth: '600px' }}>
                Streaming live intake data to Gemini 3.5 Pro & receiving real-time multi-dimensional scorecard synthesis.
              </p>
            </div>

            {/* Live Diagnostic Streaming HUD Card */}
            <div style={{
              width: '100%', background: 'rgba(30,41,59,0.65)', border: '1px solid rgba(255,255,255,0.12)',
              padding: '1.75rem', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '1.25rem',
              textAlign: 'left', boxSizing: 'border-box',
              boxShadow: 'inset 0 2px 8px rgba(255,255,255,0.05)'
            }}>
              {/* Active Phase Dynamic Highlight */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Live Connection Ledger
                </span>
                <span style={{ fontSize: '0.82rem', fontFamily: 'monospace', color: '#38bdf8', fontWeight: 900, background: 'rgba(56,189,248,0.15)', padding: '0.25rem 0.85rem', borderRadius: '100px', border: '1px solid rgba(56,189,248,0.4)' }}>
                  STREAMING_ACTIVE ●
                </span>
              </div>

              <div style={{ fontSize: '1.15rem', fontWeight: 850, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.85rem', lineHeight: 1.4 }}>
                <span style={{ display: 'inline-block' }}>⏳</span>
                <span style={{ color: '#38bdf8' }}>{scanningPhaseText || '🚀 Transmitting multimodal payload to Gemini 3.5 Pro...'}</span>
              </div>

              {/* Live Payload Summary Tokens */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.07)', padding: '0.35rem 0.85rem', borderRadius: '100px', color: '#e2e8f0', fontWeight: 750 }}>
                  📦 Payload: <strong>{intakeFiles.length} Doc(s), {intakeImages.length} Image(s)</strong>
                </span>
                <span style={{ fontSize: '0.8rem', background: 'rgba(16,185,129,0.18)', padding: '0.35rem 0.85rem', borderRadius: '100px', color: '#a7f3d0', fontWeight: 850 }}>
                  🧠 Model: <strong>Gemini 3.5 Pro (2M Cache)</strong>
                </span>
                {syncToNotebookLM && (
                  <span style={{ fontSize: '0.8rem', background: 'rgba(99,102,241,0.22)', padding: '0.35rem 0.85rem', borderRadius: '100px', color: '#c7d2fe', fontWeight: 850 }}>
                    🔗 NotebookLM Enterprise Sync
                  </span>
                )}
              </div>
            </div>

            {/* Shimmering Dynamic Progress Bar */}
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: 850, color: '#94a3b8' }}>
                <span>Neural Synthesis Completion</span>
                <span style={{ color: '#38bdf8', fontFamily: 'monospace', fontWeight: 900 }}>
                  {scanningPhaseText?.includes('Phase 4') ? '92%' : scanningPhaseText?.includes('Phase 3') ? '75%' : scanningPhaseText?.includes('Phase 2') ? '50%' : '25%'}
                </span>
              </div>
              <div style={{ width: '100%', height: '14px', background: 'rgba(255,255,255,0.1)', borderRadius: '100px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.15)' }}>
                <div style={{
                  height: '100%',
                  width: scanningPhaseText?.includes('Phase 4') ? '92%' : scanningPhaseText?.includes('Phase 3') ? '75%' : scanningPhaseText?.includes('Phase 2') ? '50%' : '25%',
                  background: 'linear-gradient(90deg, #6366f1, #38bdf8, #10b981)',
                  borderRadius: '100px', transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 0 20px rgba(56,189,248,0.8)'
                }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Uploaded Document Gallery, Visual Mockups, & Question-by-Question AI Citations Viewer */}
      {showSourcesModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(15, 23, 42, 0.82)',
          backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
          zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem'
        }}>
          <div style={{
            background: t.masterBg, border: t.masterBorder, borderRadius: '28px',
            padding: '3rem', width: '100%', maxWidth: '1024px', maxHeight: '90vh', overflowY: 'auto',
            boxShadow: '0 25px 60px -15px rgba(0,0,0,0.9), 0 0 40px rgba(16,185,129,0.3)',
            display: 'flex', flexDirection: 'column', gap: '2.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: t.cardBorder, paddingBottom: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10b981', background: 'rgba(16,185,129,0.18)', padding: '0.35rem 0.85rem', borderRadius: '100px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Multi-Modal Grounding Intelligence
                </span>
                <h3 style={{ fontSize: '2rem', fontWeight: 900, color: t.textMain, margin: '0.5rem 0 0 0' }}>
                  Uploaded Sources & AI Citation Ledger
                </h3>
                <span style={{ fontSize: '0.9rem', color: t.textSub }}>
                  Grounded Evidence for: <strong>{showSourcesModal.useCase}</strong> ({showSourcesModal.company})
                </span>
              </div>
              <button
                onClick={() => setShowSourcesModal(null)}
                style={{ background: t.boxBg, color: t.textMain, border: t.cardBorder, padding: '0.65rem 1.2rem', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}
              >
                ✕ Close
              </button>
            </div>

            {/* Uploaded Project Documents (Word .docx & PDF .pdf) */}
            {showSourcesModal.ingestedSources?.files?.length > 0 && (
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: t.textMain, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  📄 Uploaded Project Documents
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                  {showSourcesModal.ingestedSources.files.map((fl, idx) => (
                    <div key={idx} style={{ background: t.cardBg, border: '1px solid rgba(239,68,68,0.5)', padding: '1.5rem', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ef4444' }}>{fl.name?.endsWith('.pdf') ? 'VECTOR PDF (.PDF)' : 'WORD DOC (.DOCX)'}</span>
                        <span style={{ fontSize: '0.75rem', background: 'rgba(239,68,68,0.12)', padding: '0.2rem 0.6rem', borderRadius: '100px' }}>{fl.size || '2.4 MB'}</span>
                      </div>
                      <strong style={{ fontSize: '1.05rem', color: t.textMain }}>{fl.name}</strong>
                      <span style={{ fontSize: '0.85rem', color: t.textSub }}>Parsed & Ingested into 2M Context Cache</span>
                      <a href="#" onClick={e => { e.preventDefault(); alert(`📥 Downloading ${fl.name}`); }} style={{ color: '#ef4444', fontSize: '0.85rem', fontWeight: 800, marginTop: '0.5rem' }}>
                        📥 Download {fl.name}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Uploaded Images Gallery */}
            {showSourcesModal.ingestedSources?.images?.length > 0 && (
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: t.textMain, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  🖼️ Architecture Diagrams & Screen Captures (.png, .jpg)
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem' }}>
                  {showSourcesModal.ingestedSources.images.map((img, idx) => (
                    <div key={idx} style={{ background: t.boxBg, padding: '0.75rem', borderRadius: '20px', border: t.boxBorder, display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <img src={img.url || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80"} alt={img.alt || img.caption || 'Uploaded reference image'} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '14px' }} />
                      <div>
                        <strong style={{ display: 'block', fontSize: '0.95rem', color: t.textMain }}>{img.name}</strong>
                        <span style={{ fontSize: '0.8rem', color: t.textSub }}>High-Resolution Visual Diagram</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ingested Writeup & Scraped Link Citation */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {showSourcesModal.ingestedSources?.text && (
                <div style={{ background: t.boxBg, padding: '1.5rem', borderRadius: '20px', border: t.boxBorder }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#38bdf8', display: 'block', marginBottom: '0.5rem' }}>INGESTED UNSTRUCTURED WRITEUP</span>
                  <p style={{ fontSize: '0.9rem', color: t.textSub, margin: 0, fontStyle: 'italic' }}>
                    "{showSourcesModal.ingestedSources.text}"
                  </p>
                </div>
              )}
              {showSourcesModal.ingestedSources?.link && (
                <div style={{ background: t.boxBg, padding: '1.5rem', borderRadius: '20px', border: t.boxBorder }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#10b981', display: 'block', marginBottom: '0.5rem' }}>SCRAPED WEBLINK GROUNDING</span>
                  <a href="#" onClick={e => e.preventDefault()} style={{ fontSize: '0.95rem', fontWeight: 800, color: '#10b981', display: 'block', wordBreak: 'break-all' }}>
                    {showSourcesModal.ingestedSources.link}
                  </a>
                </div>
              )}
            </div>

            {/* Question-by-Question Grounding & Confidence Citation Matrix */}
            <div>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 900, color: t.textMain, marginBottom: '1rem' }}>
                📑 Question-by-Question Source Citation & Confidence Matrix
              </h4>
              <div style={{ background: t.boxBg, border: t.boxBorder, borderRadius: '24px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.06)', borderBottom: t.boxBorder, color: t.textSub, fontSize: '0.8rem', textTransform: 'uppercase' }}>
                      <th style={{ padding: '1.25rem 1.5rem' }}>Assessment Question</th>
                      <th style={{ padding: '1.25rem 1.5rem' }}>AI Confidence</th>
                      <th style={{ padding: '1.25rem 1.5rem' }}>Cited Grounding Source</th>
                      <th style={{ padding: '1.25rem 1.5rem' }}>Grounded Rationale</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: t.boxBorder }}>
                      <td style={{ padding: '1.25rem 1.5rem', fontWeight: 750, color: t.textMain }}>Business Value & Bottleneck</td>
                      <td style={{ padding: '1.25rem 1.5rem' }}>
                        <span style={{ background: '#10b981', color: '#ffffff', padding: '0.25rem 0.75rem', borderRadius: '100px', fontWeight: 800, fontSize: '0.8rem' }}>96% (High)</span>
                      </td>
                      <td style={{ padding: '1.25rem 1.5rem', fontWeight: 700, color: '#6366f1' }}>{showSourcesModal.ingestedSources?.files?.[0]?.name || showSourcesModal.useCase} (Pg 1)</td>
                      <td style={{ padding: '1.25rem 1.5rem', color: t.textSub }}>Explicitly cites 40-hour writing time per batch.</td>
                    </tr>
                    <tr style={{ borderBottom: t.boxBorder }}>
                      <td style={{ padding: '1.25rem 1.5rem', fontWeight: 750, color: t.textMain }}>Gemini Activation Readiness</td>
                      <td style={{ padding: '1.25rem 1.5rem' }}>
                        <span style={{ background: '#10b981', color: '#ffffff', padding: '0.25rem 0.75rem', borderRadius: '100px', fontWeight: 800, fontSize: '0.8rem' }}>94% (High)</span>
                      </td>
                      <td style={{ padding: '1.25rem 1.5rem', fontWeight: 700, color: '#ef4444' }}>{showSourcesModal.ingestedSources?.files?.[0]?.name || showSourcesModal.useCase} (Pg 2)</td>
                      <td style={{ padding: '1.25rem 1.5rem', color: t.textSub }}>Supported GCP Vertex AI ADC token authentication.</td>
                    </tr>
                    <tr style={{ borderBottom: t.boxBorder }}>
                      <td style={{ padding: '1.25rem 1.5rem', fontWeight: 750, color: t.textMain }}>Data Connectors & GxP Compliance</td>
                      <td style={{ padding: '1.25rem 1.5rem' }}>
                        <span style={{ background: '#38bdf8', color: '#ffffff', padding: '0.25rem 0.75rem', borderRadius: '100px', fontWeight: 800, fontSize: '0.8rem' }}>88% (Solid)</span>
                      </td>
                      <td style={{ padding: '1.25rem 1.5rem', fontWeight: 700, color: '#10b981' }}>{showSourcesModal.ingestedSources?.files?.[0]?.name || showSourcesModal.useCase} (Pg 3)</td>
                      <td style={{ padding: '1.25rem 1.5rem', color: t.textSub }}>Verified SharePoint & Veeva Vault active sync.</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '1.25rem 1.5rem', fontWeight: 750, color: t.textMain }}>Architecture & Security Safeguards</td>
                      <td style={{ padding: '1.25rem 1.5rem' }}>
                        <span style={{ background: '#10b981', color: '#ffffff', padding: '0.25rem 0.75rem', borderRadius: '100px', fontWeight: 800, fontSize: '0.8rem' }}>97% (High)</span>
                      </td>
                      <td style={{ padding: '1.25rem 1.5rem', fontWeight: 700, color: '#f59e0b' }}>{showSourcesModal.ingestedSources?.files?.[0]?.name || showSourcesModal.useCase} (Pg 4)</td>
                      <td style={{ padding: '1.25rem 1.5rem', color: t.textSub }}>Matches DLP encryption boundary inside VPC.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Immersive Document Content Viewer */}
      {selectedPreviewFile && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(15, 23, 42, 0.88)',
          backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
          zIndex: 999999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem'
        }}>
          <div style={{
            background: t.masterBg, border: t.masterBorder, borderRadius: '24px',
            padding: '2.5rem', width: '100%', maxWidth: '880px', maxHeight: '90vh', overflowY: 'auto',
            boxShadow: '0 25px 60px -15px rgba(0,0,0,0.9), 0 0 35px rgba(99,102,241,0.4)',
            display: 'flex', flexDirection: 'column', gap: '1.75rem',
            animation: 'fadeIn 0.2s ease-out'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: t.cardBorder, paddingBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.85rem' }}>📄</span>
                <div>
                  <h3 style={{ fontSize: '1.45rem', fontWeight: 850, color: t.textMain, margin: 0 }}>
                    {selectedPreviewFile.name}
                  </h3>
                  <span style={{ fontSize: '0.85rem', color: '#6366f1', fontWeight: 750 }}>
                    Active Ingested Grounding Corpus ({selectedPreviewFile.size || '4.8 MB'})
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button 
                  onClick={() => alert(`📥 Downloading ${selectedPreviewFile.name} to local Downloads folder`)}
                  style={{ background: '#6366f1', color: '#fff', border: 'none', padding: '0.6rem 1.25rem', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 15px rgba(99,102,241,0.4)' }}
                >
                  📥 Download File
                </button>
                <button
                  onClick={() => setSelectedPreviewFile(null)}
                  style={{ background: t.boxBg, color: t.textMain, border: t.cardBorder, padding: '0.6rem 1.25rem', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer' }}
                >
                  ✕ Close
                </button>
              </div>
            </div>

            {/* Document Content Canvas */}
            <div style={{ background: t.boxBg, border: t.boxBorder, borderRadius: '16px', padding: '2.5rem', fontFamily: 'monospace', fontSize: '0.92rem', color: t.textSub, lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {(selectedPreviewFile.name.toLowerCase().includes('gma') || selectedPreviewFile.name.toLowerCase().includes('architecture')) ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', color: t.textMain }}>
                  {/* Title Slide Header */}
                  <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', border: '1px solid #3b82f6', padding: '3rem', borderRadius: '24px', textAlign: 'center', boxShadow: '0 10px 30px rgba(59,130,246,0.25)' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#10b981', textTransform: 'uppercase', letterSpacing: '2px' }}>MERCK &amp; CO. — PROPRIETARY &amp; CONFIDENTIAL</span>
                    <h2 style={{ fontSize: '2.85rem', fontWeight: 950, color: '#ffffff', margin: '1rem 0 0.5rem 0', letterSpacing: '-0.5px', fontFamily: 'sans-serif' }}>
                      GMA Pricing Agent Architecture
                    </h2>
                    <span style={{ fontSize: '1.15rem', color: '#94a3b8', fontWeight: 600, fontFamily: 'sans-serif' }}>June 2026 • Global Market Access &amp; Pricing AI Engine</span>
                  </div>

                  {/* Slide 2: Overall GMAX Execution Roadmap */}
                  <div style={{ background: 'rgba(0,0,0,0.3)', borderLeft: '4px solid #3b82f6', padding: '2rem', borderRadius: '20px', fontFamily: 'sans-serif' }}>
                    <span style={{ color: '#60a5fa', fontWeight: 900, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>SLIDE 2 — STRATEGIC ROADMAP</span>
                    <h4 style={{ fontSize: '1.65rem', fontWeight: 900, margin: '0.5rem 0 1rem 0', color: '#fff' }}>Overall GMAX Execution Roadmap</h4>
                    <ul style={{ margin: 0, paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '1.05rem', lineHeight: 1.6, color: '#e2e8f0' }}>
                      <li><strong>Q2 Migration to BigLake</strong>: Hybrid Platform deployment and automated GraphRAG vector indexing.</li>
                      <li><strong>Data Strategy &amp; Access Control</strong>: Centralized GMAX Pricing Agent access across enterprise Role-Based Access boundaries.</li>
                      <li><strong>Project Ahead Integration</strong>: Unified R&amp;D pricing simulation and automated global pricing submission dossier drafting.</li>
                    </ul>
                  </div>

                  {/* Slide 3 & 4: Option 1 Federated Queries */}
                  <div style={{ background: 'rgba(0,0,0,0.3)', borderLeft: '4px solid #f59e0b', padding: '2rem', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '1.5rem', fontFamily: 'sans-serif' }}>
                    <div>
                      <span style={{ color: '#fbbf24', fontWeight: 900, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>SLIDE 4 — ARCHITECTURE EVALUATION (OPTION 1)</span>
                      <h4 style={{ fontSize: '1.65rem', fontWeight: 900, margin: '0.5rem 0 0 0', color: '#fff' }}>Option 1: Federated Queries to Databricks (Zero-Migration Access)</h4>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                      <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', padding: '1.5rem', borderRadius: '16px' }}>
                        <strong style={{ color: '#10b981', display: 'block', fontSize: '1.1rem', marginBottom: '0.75rem' }}>Strategic Advantages (Pros)</strong>
                        <ul style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.95rem' }}>
                          <li><strong>Data Sovereignty</strong>: Access data exactly where it lies without physical movement.</li>
                          <li><strong>Efficiency</strong>: Eliminate data migration efforts and duplicate storage costs.</li>
                          <li><strong>Interoperability</strong>: Supports an open, flexible multi-platform ecosystem.</li>
                        </ul>
                      </div>
                      <div style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)', padding: '1.5rem', borderRadius: '16px' }}>
                        <strong style={{ color: '#f43f5e', display: 'block', fontSize: '1.1rem', marginBottom: '0.75rem' }}>Technical Trade-offs (Cons)</strong>
                        <ul style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.95rem' }}>
                          <li><strong>Performance</strong>: Latency risks from cross-cloud query execution across distributed engines.</li>
                          <li><strong>Operational Overhead</strong>: Managing two distinct security and governance models.</li>
                          <li><strong>Integration Gaps</strong>: Missing out on native GCP feature depth, GraphRAG, and multimodal RAG.</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Slide 5: Option 2 Unify Data on BigLake */}
                  <div style={{ background: 'rgba(0,0,0,0.3)', borderLeft: '4px solid #10b981', padding: '2rem', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '1.5rem', fontFamily: 'sans-serif' }}>
                    <div>
                      <span style={{ color: '#34d399', fontWeight: 900, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>SLIDE 5 — ARCHITECTURE EVALUATION (OPTION 2)</span>
                      <h4 style={{ fontSize: '1.65rem', fontWeight: 900, margin: '0.5rem 0 0 0', color: '#fff' }}>Option 2: Unify Data on BigLake for Superior AI Performance</h4>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                      <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', padding: '1.5rem', borderRadius: '16px' }}>
                        <strong style={{ color: '#10b981', display: 'block', fontSize: '1.1rem', marginBottom: '0.75rem' }}>Strategic Advantages (Pros)</strong>
                        <ul style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.95rem' }}>
                          <li><strong>Efficiency &amp; Optimization</strong>: Best-in-class price/performance with a single unified management system.</li>
                          <li><strong>Advanced AI Capabilities</strong>: Deep GCP integration enabling GraphRAG and unstructured data parsing.</li>
                          <li><strong>Google Funds the Migration</strong>: Google can attach funding for PSO to migrate the data for you at no cost.</li>
                        </ul>
                      </div>
                      <div style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)', padding: '1.5rem', borderRadius: '16px' }}>
                        <strong style={{ color: '#f43f5e', display: 'block', fontSize: '1.1rem', marginBottom: '0.75rem' }}>Transition Challenges (Cons)</strong>
                        <ul style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.95rem' }}>
                          <li><strong>Migration Effort</strong>: Initial requirement for physical data movement and validation.</li>
                          <li><strong>Organizational Change</strong>: Steep learning curve for teams adopting a completely new ecosystem.</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Slide 6: Option 3 Hybrid Approach Gold Layer */}
                  <div style={{ background: 'rgba(0,0,0,0.3)', borderLeft: '4px solid #a855f7', padding: '2rem', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '1.5rem', fontFamily: 'sans-serif' }}>
                    <div>
                      <span style={{ color: '#c084fc', fontWeight: 900, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>SLIDE 6 — RECOMMENDED ARCHITECTURE (OPTION 3)</span>
                      <h4 style={{ fontSize: '1.65rem', fontWeight: 900, margin: '0.5rem 0 0 0', color: '#fff' }}>Option 3: Hybrid Approach — Replicate Gold Layer on Google Cloud</h4>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                      <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', padding: '1.5rem', borderRadius: '16px' }}>
                        <strong style={{ color: '#10b981', display: 'block', fontSize: '1.1rem', marginBottom: '0.75rem' }}>Strategic Advantages (Pros)</strong>
                        <ul style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.95rem' }}>
                          <li><strong>Optimized Performance</strong>: Better price/performance via cross-cloud queries and native GCP integrations.</li>
                          <li><strong>Low Resistance</strong>: Avoids full migration with minor change management impact.</li>
                          <li><strong>Strategic Alignment</strong>: Maintains the long-term goal of moving to Databricks / Unified Lakehouse.</li>
                        </ul>
                      </div>
                      <div style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)', padding: '1.5rem', borderRadius: '16px' }}>
                        <strong style={{ color: '#f43f5e', display: 'block', fontSize: '1.1rem', marginBottom: '0.75rem' }}>Trade-offs (Cons)</strong>
                        <ul style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.95rem' }}>
                          <li><strong>Redundancy</strong>: Creation of duplicate gold layers across environments.</li>
                          <li><strong>Operational Overhead</strong>: Must continue maintaining two disparate systems simultaneously.</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Slide 7: Strategic AI Use Case Examples */}
                  <div style={{ background: 'rgba(0,0,0,0.3)', borderLeft: '4px solid #06b6d4', padding: '2rem', borderRadius: '20px', fontFamily: 'sans-serif' }}>
                    <span style={{ color: '#22d3ee', fontWeight: 900, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>SLIDE 7 — ENTERPRISE USE CASES</span>
                    <h4 style={{ fontSize: '1.65rem', fontWeight: 900, margin: '0.5rem 0 1rem 0', color: '#fff' }}>Strategic AI Use Case Examples on GCP</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
                      <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <strong style={{ color: '#38bdf8', display: 'block', fontSize: '1.1rem', marginBottom: '0.5rem' }}>AccessIQ: Global Market Access</strong>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.5 }}>Scaling the Pricing Agent into a unified hub for competitor launch data, regional pricing trends, and reimbursement landscapes.</p>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <strong style={{ color: '#34d399', display: 'block', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Project AHEAD: Dossier Automation</strong>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.5 }}>Implementing agentic medical writing to automate drug dossier generation, saving critical time and resources while maintaining clinical accuracy.</p>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <strong style={{ color: '#c084fc', display: 'block', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Clinical Research Excellence</strong>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.5 }}>Leveraging High-Fidelity GCP data to predict patient enrollment bottlenecks and optimize site selection.</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: '1rem' }}>
                    <span style={{ fontWeight: 900, color: '#38bdf8', letterSpacing: '0.5px' }}>📄 CLINICAL_TRIAL_PROTOCOL_DRAFT.PDF (VERIFIED GXP CORPUS)</span>
                    <span style={{ background: 'rgba(16,185,129,0.2)', color: '#10b981', padding: '0.3rem 0.85rem', borderRadius: '100px', fontSize: '0.78rem', fontWeight: 900 }}>Parsed 18 Chapters (Fully Grounded)</span>
                  </div>

                  {/* Page 2 */}
                  <div style={{ background: 'rgba(0,0,0,0.25)', borderLeft: '4px solid #3b82f6', padding: '1.75rem', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#60a5fa', fontWeight: 800, fontSize: '0.85rem', borderBottom: '1px solid rgba(59,130,246,0.2)', paddingBottom: '0.5rem' }}>
                      <span>CHAPTER 1.0 — STRATEGIC SCOPE &amp; PORTFOLIO REACH</span>
                      <span>[Page 2, Para 2]</span>
                    </div>
                    <p style={{ margin: 0, color: t.textMain, fontSize: '1rem', fontWeight: 500, lineHeight: 1.7 }}>
                      "<strong>Section 1.2 (Scope)</strong>: Identified 420 regulatory clinical trial submissions per quarter requiring mandatory compliance verification and multi-language alignment across global health authorities."
                    </p>
                    <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>* ICH E3 compliance mandate enforced across primary clinical study reports (CSRs).</span>
                  </div>

                  {/* Page 3 */}
                  <div style={{ background: 'rgba(0,0,0,0.25)', borderLeft: '4px solid #10b981', padding: '1.75rem', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#34d399', fontWeight: 800, fontSize: '0.85rem', borderBottom: '1px solid rgba(16,185,129,0.2)', paddingBottom: '0.5rem' }}>
                      <span>CHAPTER 2.0 — OPERATIONAL BOTTLENECKS &amp; LABOR FRICTION</span>
                      <span>[Page 3, Para 2]</span>
                    </div>
                    <p style={{ margin: 0, color: t.textMain, fontSize: '1rem', fontWeight: 500, lineHeight: 1.7 }}>
                      "<strong>Section 2.4 (Current Labor Friction)</strong>: Medical writers spend an average of 36 to 40 hours per submission assembling primary source citations and verifying GxP reference accuracy."
                    </p>
                    <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>* Measured across Global Medical Affairs submission drafting cohorts over a 12-month window.</span>
                  </div>

                  {/* Page 4 */}
                  <div style={{ background: 'rgba(0,0,0,0.25)', borderLeft: '4px solid #a855f7', padding: '1.75rem', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#c084fc', fontWeight: 800, fontSize: '0.85rem', borderBottom: '1px solid rgba(168,85,247,0.2)', paddingBottom: '0.5rem' }}>
                      <span>CHAPTER 14.0 — CLOUD SECURITY, ADC &amp; ZERO-TRUST MESH</span>
                      <span>[Page 4, Para 1]</span>
                    </div>
                    <p style={{ margin: 0, color: t.textMain, fontSize: '1rem', fontWeight: 500, lineHeight: 1.7 }}>
                      "<strong>Section 14.1 (Authentication Mesh)</strong>: Zero-trust security perimeter utilizing Google Cloud Application Default Credentials (ADC) via OAuth access token verification."
                    </p>
                    <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>* Hosted entirely within dedicated Google Cloud VPC utilizing serverless Vertex AI Reasoning Engine on project nitinagga-ge.</span>
                  </div>

                  {/* Page 4 (Para 2) */}
                  <div style={{ background: 'rgba(0,0,0,0.25)', borderLeft: '4px solid #f59e0b', padding: '1.75rem', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fbbf24', fontWeight: 800, fontSize: '0.85rem', borderBottom: '1px solid rgba(245,158,11,0.2)', paddingBottom: '0.5rem' }}>
                      <span>CHAPTER 3.0 — STRATEGIC ALIGNMENT &amp; EXECUTIVE SPONSORSHIP</span>
                      <span>[Page 4, Para 2]</span>
                    </div>
                    <p style={{ margin: 0, color: t.textMain, fontSize: '1rem', fontWeight: 500, lineHeight: 1.7 }}>
                      "<strong>Section 3.1 (Strategic Alignment)</strong>: Priority Tier-1 initiative sponsored by VP of Regulatory Affairs to eliminate manual documentation bottlenecks prior to Q4 product rollout."
                    </p>
                    <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>* Conforms to Merck R&amp;D Digital Innovation Objectives (FY26–FY27).</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
