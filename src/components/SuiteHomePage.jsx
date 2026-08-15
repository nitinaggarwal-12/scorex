import React from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Database, 
  BarChart2, 
  Cpu, 
  Award, 
  Settings, 
  Mail, 
  Globe, 
  Phone
} from 'lucide-react';

export default function SuiteHomePage({ 
  onSelectAssessment, 
  onOpenDashboard, 
  onStartAssessment, 
  onTrySample 
}) {
  const whyReasons = [
    {
      id: 'growth',
      icon: TrendingUp,
      badgeColor: '#3b82f6',
      badgeBg: 'rgba(59, 130, 246, 0.12)',
      title: 'Accelerate Growth',
      description: 'Identify highest-impact opportunities for data and AI investment that accelerate core business growth and innovation.'
    },
    {
      id: 'roi',
      icon: DollarSign,
      badgeColor: '#10b981',
      badgeBg: 'rgba(16, 185, 129, 0.12)',
      title: 'Maximize ROI',
      description: 'Optimize costs of cloud infrastructure and demonstrate measurable return on enterprise data & AI initiatives.'
    },
    {
      id: 'align',
      icon: Users,
      badgeColor: '#8b5cf6',
      badgeBg: 'rgba(139, 92, 246, 0.12)',
      title: 'Align Teams',
      description: 'Create shared understanding across business units, executive stakeholders, and technical teams.'
    },
    {
      id: 'time',
      icon: Clock,
      badgeColor: '#f97316',
      badgeBg: 'rgba(249, 115, 22, 0.12)',
      title: 'Save Time',
      description: 'Get an actionable roadmap in minutes, not months of expensive external consulting engagements.'
    },
    {
      id: 'risk',
      icon: ShieldCheck,
      badgeColor: '#ef4444',
      badgeBg: 'rgba(239, 68, 68, 0.12)',
      title: 'Reduce Risk',
      description: 'Identify compliance gaps, security vulnerabilities, and technical debt before they impact your business.'
    },
    {
      id: 'best_practices',
      icon: Sparkles,
      badgeColor: '#06b6d4',
      badgeBg: 'rgba(6, 182, 212, 0.12)',
      title: 'Best Practices',
      description: 'Benchmark against industry standards and adopt proven architectural patterns.'
    }
  ];

  const steps = [
    {
      step: 1,
      title: 'Answer Questions',
      description: 'Complete 60 targeted questions across 6 core pillars, fully customizable to your organization\'s context.'
    },
    {
      step: 2,
      title: 'Get Insights',
      description: 'Receive immediate access to your maturity benchmark, gap analysis, and tailored recommendations.'
    },
    {
      step: 3,
      title: 'Take Action',
      description: 'Use our executive reports, priority matrices, and actionable next steps to accelerate your transformation.'
    }
  ];

  const pillars = [
    {
      id: 'platform_governance',
      icon: Layers,
      emoji: '📦',
      title: 'Platform and Governance',
      description: 'Architecture setup, governance framework, cost controls, and security posture for data workloads.',
      tags: ['Environment Architecture', 'Security & Access', 'Observability & Monitoring', 'Cost Management'],
      targetFramework: 'option12'
    },
    {
      id: 'data_engineering',
      icon: Database,
      emoji: '📊',
      title: 'Data Engineering & Integration',
      description: 'Data ingestion, storage pipelines, data quality rules, and automated orchestration across the lakehouse.',
      tags: ['Ingestion Pipelines', 'CDC & Event Streams', 'Data Quality', 'Schema Registry'],
      targetFramework: 'option5'
    },
    {
      id: 'analytics_bi',
      icon: BarChart2,
      emoji: '📈',
      title: 'Analytics & BI Modernization',
      description: 'Enterprise data modeling, self-service BI exploration, dashboard performance, and semantic layers.',
      tags: ['Semantic Modeling', 'Self-Service BI', 'Dashboard Governance', 'SQL Optimization'],
      targetFramework: 'option4'
    },
    {
      id: 'machine_learning',
      icon: Cpu,
      emoji: '🤖',
      title: 'Machine Learning & MLOps',
      description: 'Model lifecycle management, feature engineering, distributed training, and automated CI/CD deployment.',
      tags: ['Model Registry', 'Feature Store', 'Real-Time Inference', 'Experiment Tracking'],
      targetFramework: 'option5'
    },
    {
      id: 'generative_ai',
      icon: Award,
      emoji: '🏆',
      title: 'Generative AI & Agentic Capabilities',
      description: 'Foundation model evaluation, multi-agent workflows, RAG knowledge retrieval, and autonomous agents.',
      tags: ['LLM Orchestration', 'Multi-Agent Architectures', 'RAG Retrieval', 'Model Governance'],
      targetFramework: 'option7'
    },
    {
      id: 'operational_excellence',
      icon: Settings,
      emoji: '⚙️',
      title: 'Operational Excellence & Adoption',
      description: 'Team enablement, Centers of Excellence, automated testing, and developer inner-loop velocity.',
      tags: ['Center of Excellence', 'CI/CD Automation', 'Team Training', 'Developer Tooling'],
      targetFramework: 'option6'
    }
  ];

  const handleLaunch = (fwId = 'option12') => {
    if (onStartAssessment) onStartAssessment(fwId);
    else if (onSelectAssessment) onSelectAssessment(fwId);
  };

  return (
    <div className="home-layout-container">
      {/* 1. HERO SECTION (Deep Royal Navy Blue Gradient) */}
      <section className="home-hero-section">
        <div className="home-hero-inner">
          {/* Left Hero Column */}
          <div className="home-hero-left">
            <h1 className="home-hero-title">
              Accelerate Your Data & AI Journey
            </h1>
            <p className="home-hero-subtitle">
              Get a comprehensive assessment of your organization's technical maturity across 6 critical pillars. Receive personalized recommendations and a clear roadmap for success.
            </p>
            <div className="home-hero-actions">
              <button className="btn-hero-primary" onClick={() => handleLaunch('option12')}>
                <span>Start Free Assessment</span>
                <ArrowRight size={17} />
              </button>
              <button className="btn-hero-secondary" onClick={onOpenDashboard}>
                <BarChart2 size={16} />
                <span>View Insights Dashboard</span>
              </button>
            </div>
          </div>

          {/* Right Hero Column: Glassmorphism KPI & Checklist Card */}
          <div className="home-hero-right">
            <div className="home-glass-card">
              {/* 4 Top KPI Grid */}
              <div className="home-kpi-grid">
                <div className="home-kpi-tile">
                  <div className="home-kpi-number">6</div>
                  <div className="home-kpi-label">Pillars</div>
                </div>
                <div className="home-kpi-tile">
                  <div className="home-kpi-number">30</div>
                  <div className="home-kpi-label">Dimensions</div>
                </div>
                <div className="home-kpi-tile">
                  <div className="home-kpi-number">60</div>
                  <div className="home-kpi-label">Questions</div>
                </div>
                <div className="home-kpi-tile">
                  <div className="home-kpi-number">5</div>
                  <div className="home-kpi-label">Maturity Levels</div>
                </div>
              </div>

              {/* What You'll Get List */}
              <div className="home-deliverables-box">
                <h4>What You'll Get</h4>
                <ul className="home-deliverables-list">
                  <li>
                    <CheckCircle2 size={16} className="check-icon" />
                    <span>Comprehensive maturity assessment across 6 pillars</span>
                  </li>
                  <li>
                    <CheckCircle2 size={16} className="check-icon" />
                    <span>Personalized recommendations based on your responses</span>
                  </li>
                  <li>
                    <CheckCircle2 size={16} className="check-icon" />
                    <span>Prioritized action plan with timelines & impact</span>
                  </li>
                  <li>
                    <CheckCircle2 size={16} className="check-icon" />
                    <span>Executive-ready reports (PDF & Excel)</span>
                  </li>
                  <li>
                    <CheckCircle2 size={16} className="check-icon" />
                    <span>Identify gaps and opportunities for improvement</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. WHY TAKE THIS ASSESSMENT? */}
      <section className="home-content-section bg-light-section">
        <div className="section-header-center">
          <h2>Why take this assessment?</h2>
          <p>Benchmark your organization's journey and unlock the full potential of your data and AI initiatives</p>
        </div>

        <div className="why-reasons-grid">
          {whyReasons.map((r) => {
            const Icon = r.icon;
            return (
              <div className="why-card" key={r.id}>
                <div className="why-badge" style={{ color: r.badgeColor, backgroundColor: r.badgeBg }}>
                  <Icon size={22} />
                </div>
                <h3>{r.title}</h3>
                <p>{r.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section className="home-content-section">
        <div className="section-header-center">
          <h2>How it works</h2>
          <p>Generate actionable insights in three simple steps</p>
        </div>

        <div className="steps-3col-grid">
          {steps.map((s) => (
            <div className="step-card" key={s.step}>
              <div className="step-number-badge">{s.step}</div>
              <h3>{s.title}</h3>
              <p>{s.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. ASSESSMENT PILLARS */}
      <section className="home-content-section bg-light-section">
        <div className="section-header-center">
          <h2>Assessment Pillars</h2>
          <p>Explore the 6 key dimensions evaluated in our comprehensive assessment framework with 60 dimensions and targeted questions.</p>
        </div>

        <div className="pillars-cards-grid">
          {pillars.map((p) => {
            const Icon = p.icon;
            return (
              <div className="pillar-detail-card" key={p.id}>
                <div className="pillar-card-title-row">
                  <span className="pillar-card-emoji">{p.emoji}</span>
                  <h3>{p.title}</h3>
                </div>
                <p className="pillar-card-desc">{p.description}</p>

                <div className="pillar-card-tags">
                  {p.tags.map((t) => (
                    <span className="tag-pill" key={t}>{t}</span>
                  ))}
                </div>

                <button 
                  className="btn-explore-questions"
                  onClick={() => handleLaunch(p.targetFramework)}
                >
                  <span>Explore Questions →</span>
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. READY TO BEGIN? CTA BANNER */}
      <section className="home-cta-banner-section">
        <div className="home-cta-banner-inner">
          <h2>Ready to begin?</h2>
          <p>Take the assessment to get personalized recommendations and actionable next steps.</p>
          <button className="btn-cta-white" onClick={() => handleLaunch('option12')}>
            <span>Start My Free Assessment →</span>
          </button>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="home-footer-section">
        <div className="home-footer-inner">
          {/* Col 1 */}
          <div className="footer-col brand-col">
            <h4>Data & AI Maturity Assessment</h4>
            <p>A comprehensive framework to evaluate, benchmark, and accelerate enterprise data and AI maturity.</p>
            <div className="footer-status-pill">
              <span className="status-dot-green"></span>
              <span>Enterprise genai active</span>
            </div>
          </div>

          {/* Col 2 */}
          <div className="footer-col">
            <h5>Navigation</h5>
            <ul>
              <li><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Why Benchmark?</button></li>
              <li><button onClick={onOpenDashboard}>Assessment Pillars</button></li>
              <li><button onClick={onOpenDashboard}>Reports & Analytics</button></li>
              <li><button onClick={onOpenDashboard}>Executive Dashboard</button></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="footer-col">
            <h5>Get Started</h5>
            <p>Take the assessment today or contact our team.</p>
            <button className="btn-footer-cta" onClick={() => handleLaunch('option12')}>
              Take Assessment
            </button>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <p>© 2026 ScoreX Enterprise Data & AI Maturity Assessment Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
