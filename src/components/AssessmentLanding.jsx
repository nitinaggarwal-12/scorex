import { useState } from 'react';
import * as Icons from 'lucide-react';
import { ArrowRight, FolderClock, ArrowLeft, Wand2, Check } from 'lucide-react';
import { ASSESSMENTS, GROUPS } from '../data/assessmentCatalog';
import Button from './ui/Button';
import Card from './ui/Card';

/**
 * Assessment introduction page.
 *
 * One component, five visual templates ("variants") selected per
 * assessment in src/data/assessmentCatalog.js -- so assessments in the
 * same functional group don't render identically, without hand-building
 * 11 fully bespoke one-off page designs. See that file's ASSESSMENTS
 * object for which assessment uses which variant, and why.
 *
 * variant: 'story' | 'blueprint' | 'dossier' | 'editorial' | 'canvas'
 */
export default function AssessmentLanding({ framework, onStart, onTrySample, onBack, onOpenSaved, savedCount = 0 }) {
  const meta = ASSESSMENTS[framework];

  if (!meta) {
    return (
      <Card padding="lg" style={{ maxWidth: '640px', margin: '3rem auto', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Unknown assessment: {framework}</p>
      </Card>
    );
  }

  const group = GROUPS.find((g) => g.id === meta.group);
  const Icon = Icons[meta.icon] || Icons.Sparkles;
  // CSS custom property consumed throughout index.css's intro-page styles
  // (glow color, scan-line tint, seal color, connector-line color, etc.)
  // so each assessment's accent color drives its variant's signature
  // element, not just its icon.
  const accentStyle = { '--intro-accent': meta.accent };

  const commonHeaderProps = { meta, group, Icon, onStart, onTrySample, onBack, onOpenSaved, savedCount, accentStyle };

  switch (meta.variant) {
    case 'blueprint':
      return <BlueprintVariant {...commonHeaderProps} />;
    case 'dossier':
      return <DossierVariant {...commonHeaderProps} />;
    case 'editorial':
      return <EditorialVariant {...commonHeaderProps} />;
    case 'canvas':
      return <CanvasVariant {...commonHeaderProps} />;
    case 'story':
    default:
      return <StoryVariant {...commonHeaderProps} />;
  }
}

/* -------------------------------------------------------------------- */
/* Shared: differentiator callout + CTA row, used by every variant so   */
/* the "how this differs" answer and the launch action are consistent   */
/* regardless of which visual template wraps them.                      */
/* -------------------------------------------------------------------- */
function LaunchRow({ meta, onStart, onTrySample, onOpenSaved, savedCount, style }) {
  return (
    <div className="intro-launch-row" style={style}>
      <Button variant="primary" size="lg" onClick={onStart}>
        <span>Start {meta.name}</span>
        <ArrowRight size={17} />
      </Button>
      {onTrySample && (
        <Button variant="secondary" size="lg" onClick={onTrySample}>
          <Wand2 size={16} />
          <span>Try with sample data</span>
        </Button>
      )}
      {onOpenSaved && (
        <Button variant="secondary" size="lg" onClick={onOpenSaved}>
          <FolderClock size={16} />
          <span>Saved sessions ({savedCount})</span>
        </Button>
      )}
    </div>
  );
}

function BackLink({ onBack }) {
  if (!onBack) return null;
  return (
    <button type="button" onClick={onBack} className="intro-back-link">
      <ArrowLeft size={14} /> All assessments
    </button>
  );
}

/* ======================================================================
   STORY variant -- vertical narrative timeline.
   Discovery Intake, Feasibility Assessor.
   ====================================================================== */
function StoryVariant({ meta, group, Icon, onStart, onTrySample, onBack, onOpenSaved, savedCount, accentStyle }) {
  const steps = [
    { label: 'What it is', body: meta.what },
    { label: 'Why it exists', body: meta.why },
    { label: 'Where it fits', body: meta.where },
    { label: 'How it works', body: meta.how },
  ];
  return (
    <div className="intro-page intro-story" style={accentStyle}>
      <BackLink onBack={onBack} />
      <div className="intro-story__hero">
        <span className="intro-eyebrow" style={{ color: meta.accent }}>{group?.name}</span>
        <h1 className="intro-story__title">
          <Icon size={30} style={{ color: meta.accent }} />
          {meta.name}
        </h1>
        <p className="intro-story__tagline">{meta.tagline}</p>
      </div>

      <div className="intro-story__timeline">
        {steps.map((s, i) => (
          <div className="intro-story__step" key={s.label}>
            <div className="intro-story__marker" style={{ borderColor: meta.accent }}>
              <span style={{ color: meta.accent }}>{i + 1}</span>
            </div>
            <div className="intro-story__step-body">
              <h3>{s.label}</h3>
              <p>{s.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="intro-story__value-pair">
        <Card padding="lg">
          <h4>Value to the customer</h4>
          <p>{meta.valueCustomer}</p>
        </Card>
        <Card padding="lg">
          <h4>Value to you (the vendor)</h4>
          <p>{meta.valueVendor}</p>
        </Card>
      </div>

      <Card padding="lg" className="intro-differentiator" style={{ borderColor: meta.accent }}>
        <span className="intro-eyebrow" style={{ color: meta.accent }}>How this differs from the other assessments</span>
        <p>{meta.differentiator}</p>
      </Card>

      <LaunchRow meta={meta} onStart={onStart} onTrySample={onTrySample} onOpenSaved={onOpenSaved} savedCount={savedCount} />
    </div>
  );
}

/* ======================================================================
   BLUEPRINT variant -- technical spec-sheet, grid background, monospace
   labels, numbered "how" steps.
   ML Maturity, Agentic AI Discovery, Engagement & Roadmap Model.
   ====================================================================== */
function BlueprintVariant({ meta, group, Icon, onStart, onTrySample, onBack, onOpenSaved, savedCount, accentStyle }) {
  const howSteps = meta.how.split(/(?<=[.;])\s+/).filter(Boolean);
  return (
    <div className="intro-page intro-blueprint" style={accentStyle}>
      <BackLink onBack={onBack} />
      <div className="intro-blueprint__frame">
        <div className="intro-blueprint__corner intro-blueprint__corner--tl" />
        <div className="intro-blueprint__corner intro-blueprint__corner--tr" />
        <div className="intro-blueprint__corner intro-blueprint__corner--bl" />
        <div className="intro-blueprint__corner intro-blueprint__corner--br" />

        <div className="intro-blueprint__header">
          <span className="intro-blueprint__tag" style={{ borderColor: meta.accent, color: meta.accent }}>
            {group?.name?.toUpperCase()}
          </span>
          <h1 className="intro-blueprint__title">
            <Icon size={26} style={{ color: meta.accent }} />
            {meta.name}
          </h1>
          <p className="intro-blueprint__tagline">{meta.tagline}</p>
        </div>

        <div className="intro-blueprint__specs">
          <div className="intro-blueprint__spec">
            <span className="intro-blueprint__spec-label">WHAT</span>
            <p>{meta.what}</p>
          </div>
          <div className="intro-blueprint__spec">
            <span className="intro-blueprint__spec-label">WHY</span>
            <p>{meta.why}</p>
          </div>
          <div className="intro-blueprint__spec">
            <span className="intro-blueprint__spec-label">WHERE</span>
            <p>{meta.where}</p>
          </div>
        </div>

        <div className="intro-blueprint__how">
          <span className="intro-blueprint__spec-label">HOW // EXECUTION STEPS</span>
          <ol>
            {howSteps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>

        <div className="intro-blueprint__values">
          <div>
            <span className="intro-blueprint__spec-label">VALUE :: CUSTOMER</span>
            <p>{meta.valueCustomer}</p>
          </div>
          <div>
            <span className="intro-blueprint__spec-label">VALUE :: VENDOR</span>
            <p>{meta.valueVendor}</p>
          </div>
        </div>

        <div className="intro-blueprint__diff" style={{ borderColor: meta.accent }}>
          <span className="intro-blueprint__spec-label" style={{ color: meta.accent }}>DIFFERENTIATOR</span>
          <p>{meta.differentiator}</p>
        </div>

        <LaunchRow meta={meta} onStart={onStart} onTrySample={onTrySample} onOpenSaved={onOpenSaved} savedCount={savedCount} style={{ marginTop: '1.5rem' }} />
      </div>
    </div>
  );
}

/* ======================================================================
   DOSSIER variant -- executive briefing with tabbed sections.
   Quick Use Case Check, Enterprise Readiness Assessor.
   ====================================================================== */
function DossierVariant({ meta, group, Icon, onStart, onTrySample, onBack, onOpenSaved, savedCount, accentStyle }) {
  const tabs = [
    { key: 'what', label: 'What', body: meta.what },
    { key: 'why', label: 'Why', body: meta.why },
    { key: 'where', label: 'Where', body: meta.where },
    { key: 'how', label: 'How', body: meta.how },
    { key: 'value', label: 'Value', body: `${meta.valueCustomer}\n\n${meta.valueVendor}` },
  ];
  const [activeTab, setActiveTab] = useState('what');
  const active = tabs.find((t) => t.key === activeTab);

  return (
    <div className="intro-page intro-dossier" style={accentStyle}>
      <div className="intro-dossier__seal" aria-hidden="true">
        <Check size={26} style={{ color: meta.accent }} strokeWidth={3} />
      </div>
      <BackLink onBack={onBack} />
      <div className="intro-dossier__banner" style={{ background: meta.accent }}>
        <span>{group?.name} &mdash; Briefing Document</span>
      </div>

      <div className="intro-dossier__header">
        <div className="intro-dossier__icon" style={{ background: meta.accent }}>
          <Icon size={22} color="white" />
        </div>
        <div>
          <h1>{meta.name}</h1>
          <p>{meta.tagline}</p>
        </div>
      </div>

      <div className="intro-dossier__tabs" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={activeTab === t.key}
            className={`intro-dossier__tab ${activeTab === t.key ? 'is-active' : ''}`}
            style={activeTab === t.key ? { borderColor: meta.accent, color: meta.accent } : undefined}
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <Card padding="lg" className="intro-dossier__panel">
        {active.body.split('\n\n').map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </Card>

      <Card padding="lg" className="intro-differentiator" style={{ borderColor: meta.accent }}>
        <span className="intro-eyebrow" style={{ color: meta.accent }}>How this differs from the other assessments</span>
        <p>{meta.differentiator}</p>
      </Card>

      <LaunchRow meta={meta} onStart={onStart} onTrySample={onTrySample} onOpenSaved={onOpenSaved} savedCount={savedCount} />
    </div>
  );
}

/* ======================================================================
   EDITORIAL variant -- magazine-style, large headline, pull quote.
   Financial ROI Assessor, Executive Scoping Assessor.
   ====================================================================== */
function EditorialVariant({ meta, group, Icon, onStart, onTrySample, onBack, onOpenSaved, savedCount, accentStyle }) {
  return (
    <div className="intro-page intro-editorial" style={accentStyle}>
      <BackLink onBack={onBack} />
      <span className="intro-eyebrow" style={{ color: meta.accent }}>{group?.name}</span>
      <h1 className="intro-editorial__headline">{meta.name}</h1>
      <p className="intro-editorial__pullquote" style={{ borderColor: meta.accent }}>{meta.tagline}</p>

      <div className="intro-editorial__columns">
        <div>
          <h4>What it is</h4>
          <p>{meta.what}</p>
          <h4>Why it exists</h4>
          <p>{meta.why}</p>
          <h4>Where it fits</h4>
          <p>{meta.where}</p>
        </div>
        <div>
          <h4>How it works</h4>
          <p>{meta.how}</p>
          <h4>Value to the customer</h4>
          <p>{meta.valueCustomer}</p>
          <h4>Value to you (the vendor)</h4>
          <p>{meta.valueVendor}</p>
        </div>
      </div>

      <div className="intro-editorial__diff" style={{ background: meta.accent + '1a', borderLeftColor: meta.accent }}>
        <Icon size={20} style={{ color: meta.accent }} />
        <div>
          <strong>How this differs from the other assessments</strong>
          <p>{meta.differentiator}</p>
        </div>
      </div>

      <LaunchRow meta={meta} onStart={onStart} onTrySample={onTrySample} onOpenSaved={onOpenSaved} savedCount={savedCount} />
    </div>
  );
}

/* ======================================================================
   CANVAS variant -- spatial / nodal layout, connected cards.
   Architecture Blueprint Canvas, Agentic Maturity Assessor.
   ====================================================================== */
function CanvasVariant({ meta, group, Icon, onStart, onTrySample, onBack, onOpenSaved, savedCount, accentStyle }) {
  const nodes = [
    { label: 'What', body: meta.what },
    { label: 'Why', body: meta.why },
    { label: 'Where', body: meta.where },
    { label: 'How', body: meta.how },
  ];
  return (
    <div className="intro-page intro-canvas" style={accentStyle}>
      <BackLink onBack={onBack} />
      <div className="intro-canvas__hero">
        <div className="intro-canvas__hero-icon" style={{ borderColor: meta.accent, color: meta.accent }}>
          <Icon size={26} />
        </div>
        <div>
          <span className="intro-eyebrow" style={{ color: meta.accent }}>{group?.name}</span>
          <h1>{meta.name}</h1>
          <p>{meta.tagline}</p>
        </div>
      </div>

      <div className="intro-canvas__grid">
        <svg className="intro-canvas__connectors" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <path d="M 10 20 Q 50 5, 90 20" />
          <path d="M 10 80 Q 50 95, 90 80" />
          <path d="M 25 15 L 25 85" />
          <path d="M 75 15 L 75 85" />
        </svg>
        {nodes.map((n, i) => (
          <div className="intro-canvas__node" key={n.label} style={{ borderColor: meta.accent }}>
            <span className="intro-canvas__node-index" style={{ background: meta.accent }}>{i + 1}</span>
            <h4>{n.label}</h4>
            <p>{n.body}</p>
          </div>
        ))}
      </div>

      <div className="intro-canvas__values">
        <Card padding="lg">
          <h4>Value to the customer</h4>
          <p>{meta.valueCustomer}</p>
        </Card>
        <Card padding="lg">
          <h4>Value to you (the vendor)</h4>
          <p>{meta.valueVendor}</p>
        </Card>
      </div>

      <Card padding="lg" className="intro-differentiator" style={{ borderColor: meta.accent }}>
        <span className="intro-eyebrow" style={{ color: meta.accent }}>How this differs from the other assessments</span>
        <p>{meta.differentiator}</p>
      </Card>

      <LaunchRow meta={meta} onStart={onStart} onTrySample={onTrySample} onOpenSaved={onOpenSaved} savedCount={savedCount} />
    </div>
  );
}
