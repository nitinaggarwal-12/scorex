import { useState, useRef, useEffect } from 'react';
import { Cloud, Sparkles, Settings, Globe, LogOut, ChevronDown, Key, Sun, Moon, Zap, AlertTriangle } from 'lucide-react';
import { ASSESSMENTS } from '../data/assessmentCatalog';

export default function Navbar({ onOpenSettings, currency, onCurrencyChange, apiKey, gcpToken, onSaveSettings, activeFramework = 'option1', onFrameworkChange, globalTheme = 'dark', onThemeChange, onOpenSavedLibrary, onOpenDisclaimer }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [v10Title, setV10Title] = useState(null);

  useEffect(() => {
    const checkTitle = () => {
      try {
        const stored = localStorage.getItem('v10_active_customer_title');
        if (stored) {
          setV10Title(JSON.parse(stored));
        }
      } catch(e) {}
    };
    checkTitle();
    window.addEventListener('v10_title_change', checkTitle);
    return () => window.removeEventListener('v10_title_change', checkTitle);
  }, []);

  useEffect(() => {
    if (!isDropdownOpen) return;
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [isDropdownOpen]);

  const handleLogout = () => {
    onSaveSettings({ apiKey: '', gcpToken: '' });
    setIsDropdownOpen(false);
    alert("👋 Successfully disconnected active Google Cloud credentials. Workspace has reverted to Simulation Mode.");
  };

  const handleOpenSettingsMenu = () => {
    onOpenSettings();
    setIsDropdownOpen(false);
  };

  const hash = window.location.hash || '#home';
  const [path] = hash.split('?');
  const route = path.replace('#', '').replace('/', '');

  // Title comes from the same catalog that drives the sidebar and the
  // introduction pages (src/data/assessmentCatalog.js) -- one name per
  // assessment, defined once, instead of a fourth place that could drift.
  let navTitle = 'Use Case Intake Form';
  if (activeFramework === 'option10') navTitle = 'Gemini Enterprise AI • Portfolio Intelligence Engine';
  else if (ASSESSMENTS[activeFramework]) navTitle = ASSESSMENTS[activeFramework].name;
  else if (route === 'home') navTitle = 'Executive Briefing Cockpit';
  else if (route === 'form') navTitle = 'Use Case Discovery Wizard';
  else if (route === 'summary') navTitle = 'Portfolio Summary Analytics';
  else if (route === 'report') navTitle = 'Feasibility Scoped Dossier';
  else if (route === 'permissions') navTitle = 'Governance & IAM Admin';
  else if (route === 'logs') navTitle = 'Diagnostics & System Telemetry';

  return (
    <header 
      className="header no-print" 
      style={{ 
        position: 'sticky',
        top: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        padding: '0.85rem 1.75rem',
        background: globalTheme === 'light' ? 'rgba(255,255,255,0.85)' : 'rgba(10, 15, 29, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: globalTheme === 'light' ? '1px solid #cbd5e1' : '1px solid rgba(255,255,255,0.08)',
        boxShadow: globalTheme === 'light' ? '0 4px 20px rgba(0,0,0,0.05)' : '0 4px 30px rgba(0,0,0,0.4)',
        zIndex: 9999
      }}
    >
      {/* COLUMN 1: LEFT Brand & Connectivity Lockup */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {activeFramework === 'option10' ? (
          <div 
            onClick={() => {
              window.location.hash = '#portfolio-intelligence-v10';
              window.dispatchEvent(new Event('hashchange'));
            }}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer'
            }}
          >
            <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px rgba(139,92,246,0.5)' }}>
              <Zap size={18} color="#ffffff" />
            </div>
            <span style={{ fontWeight: 900, fontSize: '1.25rem', color: globalTheme === 'light' ? '#0f172a' : '#ffffff', letterSpacing: '-0.5px' }}>
              Scanner<span style={{ color: '#38bdf8' }}>IQ</span>
            </span>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: 'var(--google-blue-light)', color: 'var(--google-blue)', padding: '0.5rem', borderRadius: '8px', border: '1px solid rgba(0, 98, 86, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Cloud size={24} />
            </div>
            <div>
              <span style={{ fontWeight: 900, fontSize: '1.2rem', color: 'var(--text-primary)', display: 'block' }}>{navTitle}</span>
            </div>
          </div>
        )}

        {/* Live GenAI Mode Status Badge right next to logo */}
        <div 
          style={{ 
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            background: globalTheme === 'light' ? '#ecfdf5' : 'rgba(16,185,129,0.15)',
            border: globalTheme === 'light' ? '1px solid #a7f3d0' : '1px solid rgba(16,185,129,0.35)',
            padding: '0.35rem 0.85rem', borderRadius: '100px'
          }}
        >
          <span style={{ display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', animation: 'pulse 1.5s infinite' }} />
          <span style={{ fontSize: '0.7rem', fontWeight: 850, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            LIVE GENAI ACTIVE
          </span>
        </div>
      </div>

      {/* COLUMN 2: CENTER Minimalist Clean Navigation Links (No Heavy Box Container) */}
      {activeFramework === 'option10' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
          {(window.location.hash || '').includes('view=') && (
            <span
              onClick={() => {
                window.location.hash = '#portfolio-intelligence-v10';
                window.dispatchEvent(new Event('hashchange'));
              }}
              style={{
                color: globalTheme === 'light' ? '#2563eb' : '#60a5fa',
                fontSize: '0.88rem', fontWeight: 800, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                transition: 'opacity 0.2s ease'
              }}
              onMouseOver={e => e.currentTarget.style.opacity = '0.7'}
              onMouseOut={e => e.currentTarget.style.opacity = '1'}
            >
              🏠 Overview
            </span>
          )}

          <span
            onClick={() => {
              window.location.hash = `#portfolio-intelligence-v10?id=assessment_${Date.now()}&action=start`;
              window.dispatchEvent(new Event('hashchange'));
            }}
            style={{
              color: '#10b981',
              fontSize: '0.88rem', fontWeight: 850, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              transition: 'opacity 0.2s ease'
            }}
            onMouseOver={e => e.currentTarget.style.opacity = '0.7'}
            onMouseOut={e => e.currentTarget.style.opacity = '1'}
          >
            ⚡ Start Assessment
          </span>

          {(!window.location.hash || !window.location.hash.includes('saved')) && (
            <span
              onClick={() => {
                if (onOpenSavedLibrary) {
                  onOpenSavedLibrary();
                } else {
                  window.location.hash = '#portfolio-intelligence-v10?view=saved_library';
                  window.dispatchEvent(new Event('hashchange'));
                }
              }}
              style={{
                color: globalTheme === 'light' ? '#0f172a' : '#f8fafc',
                fontSize: '0.88rem', fontWeight: 800, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                transition: 'opacity 0.2s ease'
              }}
              onMouseOver={e => e.currentTarget.style.opacity = '0.7'}
              onMouseOut={e => e.currentTarget.style.opacity = '1'}
            >
              📂 Saved Library
            </span>
          )}

          {(!window.location.hash || !window.location.hash.includes('portfolio_dashboard')) && (
            <span
              onClick={() => {
                window.location.hash = '#portfolio-intelligence-v10?view=portfolio_dashboard';
                window.dispatchEvent(new Event('hashchange'));
              }}
              style={{
                color: '#a855f7',
                fontSize: '0.88rem', fontWeight: 800, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                transition: 'opacity 0.2s ease'
              }}
              onMouseOver={e => e.currentTarget.style.opacity = '0.7'}
              onMouseOut={e => e.currentTarget.style.opacity = '1'}
            >
              📊 Dashboard
            </span>
          )}
        </div>
      )}

      {/* COLUMN 3: RIGHT Profile & Settings Command Strip */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Currency Dropdown Select */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: globalTheme === 'light' ? '#f1f5f9' : 'rgba(255,255,255,0.06)', padding: '0.25rem 0.65rem', borderRadius: '100px', border: globalTheme === 'light' ? '1px solid #cbd5e1' : '1px solid rgba(255,255,255,0.1)' }}>
          <Globe size={13} style={{ color: globalTheme === 'light' ? '#64748b' : '#94a3b8' }} />
          <select
            value={currency}
            onChange={e => onCurrencyChange(e.target.value)}
            style={{ 
              background: 'transparent', border: 'none', fontSize: '0.75rem', fontWeight: 750,
              color: globalTheme === 'light' ? '#0f172a' : '#ffffff', cursor: 'pointer', outline: 'none'
            }}
          >
            <option value="USD" style={{ background: '#0f172a', color: '#fff' }}>USD ($)</option>
            <option value="EUR" style={{ background: '#0f172a', color: '#fff' }}>EUR (€)</option>
          </select>
        </div>

        {/* Persistent reminder: repo is public, no confidential data.
            Always visible, not just shown once -- see DisclaimerModal.jsx. */}
        {onOpenDisclaimer && (
          <button type="button" onClick={onOpenDisclaimer} className="disclaimer-banner">
            <AlertTriangle size={12} aria-hidden="true" />
            <span>No confidential data</span>
          </button>
        )}

        {/* Global Sun/Moon Theme Toggle */}
        <button
          onClick={() => onThemeChange(globalTheme === 'light' ? 'dark' : 'light')}
          style={{
            padding: '0.4rem 0.85rem',
            fontSize: '0.75rem', fontWeight: 750,
            borderRadius: '100px',
            background: globalTheme === 'light' ? '#f1f5f9' : 'rgba(255,255,255,0.06)',
            border: globalTheme === 'light' ? '1px solid #cbd5e1' : '1px solid rgba(255,255,255,0.1)',
            color: globalTheme === 'light' ? '#0f172a' : '#ffffff',
            display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          title={globalTheme === 'light' ? 'Activate Futuristic Dark Mode' : 'Activate High-Contrast Light Mode'}
        >
          {globalTheme === 'light' ? (
            <>
              <Moon size={13} style={{ color: '#4285f4' }} />
              <span>Dark</span>
            </>
          ) : (
            <>
              <Sun size={13} style={{ color: '#f59e0b' }} />
              <span>Light</span>
            </>
          )}
        </button>

        {/* Logged In User Dropdown Trigger */}
        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            aria-haspopup="true"
            aria-expanded={isDropdownOpen}
            aria-label="Account menu"
            style={{ 
              display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.2rem 0.5rem', 
              borderRadius: '100px', background: globalTheme === 'light' ? '#f1f5f9' : 'rgba(255,255,255,0.06)', 
              border: globalTheme === 'light' ? '1px solid #cbd5e1' : '1px solid rgba(255,255,255,0.1)', 
              color: globalTheme === 'light' ? '#0f172a' : '#ffffff', cursor: 'pointer', height: '38px' 
            }}
          >
            <div style={{ background: 'linear-gradient(135deg, #1a73e8 0%, #4285f4 100%)', color: '#ffffff', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 850, fontSize: '0.75rem', boxShadow: '0 2px 8px rgba(26,115,232,0.3)' }}>
              NA
            </div>
            <ChevronDown size={13} style={{ color: globalTheme === 'light' ? '#64748b' : '#94a3b8' }} />
          </button>

          {/* Floating User Dropdown Menu */}
          {isDropdownOpen && (
            <div 
              style={{ 
                position: 'absolute', right: 0, top: '115%', width: '280px', 
                padding: '1.25rem', zIndex: 99999, 
                background: globalTheme === 'light' ? '#ffffff' : '#0f172a',
                border: globalTheme === 'light' ? '1px solid #cbd5e1' : '1px solid rgba(255,255,255,0.12)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.6)', borderRadius: '16px',
                display: 'flex', flexDirection: 'column', gap: '0.85rem'
              }}
            >
              {/* Account details */}
              <div style={{ borderBottom: globalTheme === 'light' ? '1px solid #e2e8f0' : '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.85rem' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: globalTheme === 'light' ? '#64748b' : '#94a3b8', textTransform: 'uppercase' }}>
                  Authenticated Active Identity
                </span>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: globalTheme === 'light' ? '#0f172a' : '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '0.3rem' }}>
                  admin@nitinagga.altostrat.com
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.4rem' }}>
                  <span style={{ fontSize: '0.75rem', color: globalTheme === 'light' ? '#64748b' : '#94a3b8' }}>GCP Project:</span>
                  <span style={{ background: 'rgba(59,130,246,0.15)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.3)', padding: '0.15rem 0.6rem', borderRadius: '100px', fontSize: '0.65rem', fontWeight: 800 }}>
                    nitinagga-ge
                  </span>
                </div>
              </div>

              {/* Actions list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <button 
                  onClick={handleOpenSettingsMenu}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: 'none', color: globalTheme === 'light' ? '#334155' : '#e2e8f0', padding: '0.5rem', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', textAlign: 'left' }}
                >
                  <Settings size={15} />
                  <span>Settings & Cloud Credentials</span>
                </button>

                <button 
                  onClick={handleLogout}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', color: '#ef4444', padding: '0.5rem 0.75rem', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 800, cursor: 'pointer', textAlign: 'left', marginTop: '0.25rem' }}
                >
                  <LogOut size={15} />
                  <span>Disconnect Credentials</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {activeFramework === 'option10' && (!window.location.hash || window.location.hash === '#portfolio-intelligence-v10') && (
        <div 
          className="no-print"
          style={{ 
            width: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            flexWrap: 'wrap', 
            gap: '1.75rem',
            paddingTop: '0.75rem',
            marginTop: '0.4rem',
            borderTop: globalTheme === 'light' ? '1px solid #cbd5e1' : '1px solid rgba(255,255,255,0.08)',
            fontSize: '0.82rem'
          }}
        >
          <span
            onClick={() => {
              const el = document.getElementById('section-why');
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            style={{ fontWeight: 750, color: '#38bdf8', cursor: 'pointer', transition: 'opacity 0.2s' }}
            onMouseOver={e => e.currentTarget.style.opacity = '0.7'}
            onMouseOut={e => e.currentTarget.style.opacity = '1'}
          >
            Why this assessment exists
          </span>
          <span style={{ color: '#64748b' }}>•</span>
          <span
            onClick={() => {
              const el = document.getElementById('section-methodology');
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            style={{ fontWeight: 750, color: '#34d399', cursor: 'pointer', transition: 'opacity 0.2s' }}
            onMouseOver={e => e.currentTarget.style.opacity = '0.7'}
            onMouseOut={e => e.currentTarget.style.opacity = '1'}
          >
            Methodology: 10-pillar prioritization model
          </span>
          <span style={{ color: '#64748b' }}>•</span>
          <span
            onClick={() => {
              const el = document.getElementById('section-receive');
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            style={{ fontWeight: 750, color: '#c084fc', cursor: 'pointer', transition: 'opacity 0.2s' }}
            onMouseOver={e => e.currentTarget.style.opacity = '0.7'}
            onMouseOut={e => e.currentTarget.style.opacity = '1'}
          >
            What stakeholders receive
          </span>
          <span style={{ color: '#64748b' }}>•</span>
          <span
            onClick={() => {
              const el = document.getElementById('section-benchmarks');
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            style={{ fontWeight: 750, color: '#f472b6', cursor: 'pointer', transition: 'opacity 0.2s' }}
            onMouseOver={e => e.currentTarget.style.opacity = '0.7'}
            onMouseOut={e => e.currentTarget.style.opacity = '1'}
          >
            Industry benchmark intelligence
          </span>
          <span style={{ color: '#64748b' }}>•</span>
          <span
            onClick={() => {
              const el = document.getElementById('section-stories');
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            style={{ fontWeight: 750, color: '#fbbf24', cursor: 'pointer', transition: 'opacity 0.2s' }}
            onMouseOver={e => e.currentTarget.style.opacity = '0.7'}
            onMouseOut={e => e.currentTarget.style.opacity = '1'}
          >
            Success story examples
          </span>
        </div>
      )}
    </header>
  );
}
