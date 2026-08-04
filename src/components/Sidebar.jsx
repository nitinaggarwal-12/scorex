import { FileText, LayoutDashboard, FolderHeart, Settings2, Sparkles, Home, Users, History, Activity } from 'lucide-react';
import SectionHeader from './ui/SectionHeader';

// Canonical assessment workflow. Everything else (the earlier v5-v9 and
// v11 iterations) is archived -- not linked from this nav -- but the
// routes still work if navigated to directly. See
// src/components/ui/README.md for the full archive list and rationale.
const CANONICAL_FRAMEWORK = 'option12';

export default function Sidebar({
  viewMode,
  reportData,
  onGoHome,
  onNewIntake,
  onViewSummary,
  onOpenSessions,
  onOpenPermissions,
  onOpenChatHistory,
  onOpenSettings,
  onOpenLogs,
  activeFramework = 'option1',
  onFrameworkChange = () => {},
}) {
  const isCanonicalActive = activeFramework === CANONICAL_FRAMEWORK;

  return (
    <aside
      className="sidebar"
      style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%', position: 'relative', zIndex: 10000, overflowY: 'auto' }}
    >
      {/* Brand Section */}
      <button
        type="button"
        className="sidebar-brand"
        onClick={onGoHome}
        aria-label="Go to home"
        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.65rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '0.5rem', background: 'transparent', border: 'none', borderBottomWidth: '1px', borderBottomStyle: 'solid', borderBottomColor: 'var(--border-color)', width: '100%', textAlign: 'left' }}
      >
        <div style={{ background: 'var(--google-blue)', color: 'white', padding: '0.5rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Sparkles size={20} aria-hidden="true" />
        </div>
        <div>
          <span style={{ fontWeight: 850, fontSize: '1.1rem', color: 'var(--text-primary)', display: 'block' }}>Gemini Enterprise</span>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.05rem' }}>Use Case Suite</div>
        </div>
      </button>

      {/* Category: Core Workspace */}
      <nav aria-label="Core workspace" style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
        <SectionHeader>Core Workspace</SectionHeader>

        <button
          onClick={onGoHome}
          className={`sidebar-btn ${viewMode === 'home' && activeFramework === 'option1' ? 'active' : ''}`}
          aria-current={viewMode === 'home' && activeFramework === 'option1' ? 'page' : undefined}
        >
          <Home size={17} aria-hidden="true" />
          <span>Overview Home</span>
        </button>

        <button
          onClick={onViewSummary}
          className={`sidebar-btn ${viewMode === 'summary' ? 'active' : ''}`}
          aria-current={viewMode === 'summary' ? 'page' : undefined}
        >
          <LayoutDashboard size={17} aria-hidden="true" />
          <span>Portfolio Summary</span>
        </button>

        <button
          onClick={() => onFrameworkChange('intake')}
          className={`sidebar-btn ${viewMode === 'landing' && activeFramework === 'intake' ? 'active' : ''}`}
          aria-current={viewMode === 'landing' && activeFramework === 'intake' ? 'page' : undefined}
        >
          <FileText size={17} aria-hidden="true" />
          <span>New Discovery Intake</span>
        </button>
      </nav>

      {/* Category: Assessment -- single canonical workflow.
          Prior versions (v5-v9, v11) are intentionally not linked here;
          see src/components/ui/README.md. */}
      <nav aria-label="Assessment" className="no-print" style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
        <SectionHeader>Assessment</SectionHeader>

        <button
          onClick={() => onFrameworkChange(CANONICAL_FRAMEWORK)}
          className={`sidebar-btn ${isCanonicalActive ? 'active' : ''}`}
          aria-current={isCanonicalActive ? 'page' : undefined}
          style={
            isCanonicalActive
              ? { background: 'linear-gradient(90deg, rgba(59,130,246,0.22), rgba(6,182,212,0.22))', borderLeft: '3px solid #3b82f6' }
              : undefined
          }
        >
          <Sparkles size={17} style={{ color: '#3b82f6' }} aria-hidden="true" />
          <span style={{ fontWeight: isCanonicalActive ? 850 : 700 }}>Use Case Readiness Assessment</span>
        </button>
      </nav>

      {/* Category: Governance & Collaboration */}
      <nav aria-label="Governance and collaboration" style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
        <SectionHeader>Governance &amp; IAM</SectionHeader>

        <button onClick={onOpenSessions} className="sidebar-btn">
          <FolderHeart size={17} aria-hidden="true" />
          <span>Saved Blueprints</span>
        </button>

        <button
          onClick={onOpenPermissions}
          className={`sidebar-btn ${viewMode === 'permissions' ? 'active' : ''}`}
          aria-current={viewMode === 'permissions' ? 'page' : undefined}
        >
          <Users size={17} aria-hidden="true" />
          <span>Access Control (IAM)</span>
        </button>

        <button
          onClick={onOpenChatHistory}
          className={`sidebar-btn ${viewMode === 'chat_history' ? 'active' : ''}`}
          aria-current={viewMode === 'chat_history' ? 'page' : undefined}
        >
          <History size={17} aria-hidden="true" />
          <span>Executive Briefing Chat</span>
        </button>
      </nav>

      {/* Category: System Administration */}
      <nav aria-label="Administration" style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: 'auto' }}>
        <SectionHeader>Administration</SectionHeader>

        <button
          onClick={onOpenLogs}
          className={`sidebar-btn ${viewMode === 'logs' ? 'active' : ''}`}
          aria-current={viewMode === 'logs' ? 'page' : undefined}
        >
          <Activity size={17} aria-hidden="true" />
          <span>Diagnostics &amp; Telemetry</span>
        </button>

        <button onClick={onOpenSettings} className="sidebar-btn">
          <Settings2 size={17} aria-hidden="true" />
          <span>Portal Configuration</span>
        </button>
      </nav>

      {/* Versioning footer */}
      <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textAlign: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem', marginTop: '0.5rem' }}>
        v1.2.0 • Live HITL Active
      </div>
    </aside>
  );
}
