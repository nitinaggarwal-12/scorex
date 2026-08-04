import * as Icons from 'lucide-react';
import { ArrowRight, FolderClock, LayoutDashboard } from 'lucide-react';
import { GROUPS, assessmentsByGroup } from '../data/assessmentCatalog';
import Button from './ui/Button';
import Card from './ui/Card';
import SectionHeader from './ui/SectionHeader';

/**
 * The suite's home page. Replaces the flat "8 versions in a sidebar"
 * navigation with a real landing page: one hero, four logical groups,
 * each group's assessments as cards linking to that assessment's
 * introduction page (AssessmentLanding.jsx) rather than launching the
 * tool directly.
 */
export default function SuiteHomePage({ sessions = [], onSelectAssessment, onOpenSessions, onViewSummary }) {
  const totalAssessments = GROUPS.reduce((n, g) => n + assessmentsByGroup(g.id).length, 0);

  return (
    <div className="suite-home">
      {/* Hero */}
      <div className="suite-home__hero">
        <span className="intro-eyebrow" style={{ color: 'var(--google-blue)' }}>Gemini Enterprise &middot; Use Case Suite</span>
        <h1>Scope, score, and plan enterprise AI use cases &mdash; in one live session.</h1>
        <p>
          {totalAssessments} purpose-built assessments across discovery, maturity, financial modeling,
          and technical scoping. Pick the one that matches where the conversation is right now &mdash;
          each has its own introduction page explaining what it does, why it exists, and how it's
          different from the others in the suite.
        </p>
        <div className="suite-home__hero-actions">
          <Button variant="primary" size="lg" onClick={() => onSelectAssessment('intake')}>
            <span>Start a new discovery</span>
            <ArrowRight size={17} />
          </Button>
          <Button variant="secondary" size="lg" onClick={onViewSummary}>
            <LayoutDashboard size={16} />
            <span>Portfolio summary</span>
          </Button>
          <Button variant="ghost" size="lg" onClick={onOpenSessions}>
            <FolderClock size={16} />
            <span>Saved sessions ({sessions.length})</span>
          </Button>
        </div>
      </div>

      {/* Groups */}
      {GROUPS.map((group) => {
        const items = assessmentsByGroup(group.id);
        if (!items.length) return null;
        return (
          <div className="suite-home__group" key={group.id}>
            <SectionHeader>{group.name}</SectionHeader>
            <p className="suite-home__group-desc">{group.description}</p>
            <div className="suite-home__grid">
              {items.map((a) => {
                const Icon = Icons[a.icon] || Icons.Sparkles;
                return (
                  <Card
                    key={a.id}
                    padding="lg"
                    className="suite-home__card"
                    role="button"
                    tabIndex={0}
                    onClick={() => onSelectAssessment(a.id)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelectAssessment(a.id); }}
                    style={{ borderColor: 'var(--border-color)', cursor: 'pointer' }}
                  >
                    <div className="suite-home__card-icon" style={{ background: a.accent + '22', color: a.accent }}>
                      <Icon size={20} aria-hidden="true" />
                    </div>
                    <h3>{a.name}</h3>
                    <p>{a.tagline}</p>
                    <span className="suite-home__card-link" style={{ color: a.accent }}>
                      View details <ArrowRight size={13} />
                    </span>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
