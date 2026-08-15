import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ChevronRight, 
  ChevronDown, 
  Edit3, 
  Trash2, 
  Save, 
  HelpCircle, 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  Layers,
  Database,
  BarChart2,
  Cpu,
  Zap,
  ShieldCheck
} from 'lucide-react';

export const PILLARS_DATA = [
  {
    id: 'platform_governance',
    name: 'Platform',
    icon: Layers,
    emoji: '📦',
    progress: '5/5 100%',
    isComplete: true,
    dimensions: [
      { id: 'dim_1', name: 'Environment Architecture & Scalability', done: true },
      { id: 'dim_2', name: 'Identity, Security & Access Control', done: true },
      { id: 'dim_3', name: 'Governance & Compliance', done: true },
      { id: 'dim_4', name: 'Observability & Monitoring', done: true },
      { id: 'dim_5', name: 'Cost Management & Optimization', done: true }
    ],
    questions: [
      {
        id: 'q1',
        title: 'How standardized and isolated are your environments across development, staging, and production?',
        currentStateLevels: [
          '1. Explore: Manual, ad-hoc environment setup with no standardization',
          '2. Experiment: Basic environment separation (dev/prod), but inconsistent configurations',
          '3. Formalize: Standardized IaC for all environments, consistent configurations',
          '4. Optimize: Self-service environment provisioning with automated governance and cost controls',
          '5. Transform: Platform engineering with dynamic ephemeral environments and continuous audit compliance'
        ],
        futureStateLevels: [
          '1. Explore: Manual, ad-hoc environment setup with no standardization',
          '2. Experiment: Basic environment separation (dev/prod), but inconsistent configurations',
          '3. Formalize: Standardized IaC for all environments, consistent configurations',
          '4. Optimize: Self-service environment provisioning with automated governance and cost controls',
          '5. Transform: Platform engineering with dynamic ephemeral environments and continuous audit compliance'
        ],
        technicalPains: [
          'Inconsistent environment configurations',
          'Manual environment provisioning',
          'Poor environment isolation',
          'Deployment consistency issues',
          'Resource conflicts between environments'
        ],
        businessPains: [
          'Slow time-to-market for new features',
          'High environment management costs',
          'Team bottlenecks in environment access',
          'Quality issues from environment differences',
          'Compliance risks from inconsistency'
        ]
      },
      {
        id: 'q2',
        title: 'How are enterprise identities, RBAC, and zero-trust policies enforced across workspaces?',
        currentStateLevels: [
          '1. Explore: Shared root/admin accounts and hardcoded credentials',
          '2. Experiment: Basic IAM roles with static service account keys',
          '3. Formalize: Centralized IdP federation (SSO / SCIM) with least-privilege RBAC',
          '4. Optimize: Just-In-Time (JIT) privileged access with automated credential rotation',
          '5. Transform: Continuous adaptive zero-trust posture with real-time risk assessment'
        ],
        futureStateLevels: [
          '1. Explore: Shared root/admin accounts and hardcoded credentials',
          '2. Experiment: Basic IAM roles with static service account keys',
          '3. Formalize: Centralized IdP federation (SSO / SCIM) with least-privilege RBAC',
          '4. Optimize: Just-In-Time (JIT) privileged access with automated credential rotation',
          '5. Transform: Continuous adaptive zero-trust posture with real-time risk assessment'
        ],
        technicalPains: [
          'Over-privileged service accounts',
          'Manual credential rotation overhead',
          'Lack of centralized audit trails',
          'Orphaned user access in deprecated projects'
        ],
        businessPains: [
          'Audit failure risk during compliance checks',
          'Privilege escalation vulnerabilities',
          'Slow onboarding for new engineering hires'
        ]
      }
    ]
  },
  {
    id: 'data_engineering',
    name: 'Data',
    icon: Database,
    emoji: '💾',
    progress: '5/5 100%',
    isComplete: true,
    dimensions: [
      { id: 'dim_d1', name: 'Lakehouse Ingestion & CDC', done: true },
      { id: 'dim_d2', name: 'Data Quality & Lineage', done: true },
      { id: 'dim_d3', name: 'Transformation & Orchestration', done: true }
    ],
    questions: [
      {
        id: 'qd1',
        title: 'How mature are your streaming and batch data ingestion pipelines?',
        currentStateLevels: [
          '1. Explore: Ad-hoc manual CSV uploads and script-based dumps',
          '2. Experiment: Scheduled cron batch loads with frequent pipeline breaks',
          '3. Formalize: Automated declarative pipelines with Schema Evolution',
          '4. Optimize: Unified real-time streaming with automated backpressure handling',
          '5. Transform: Autonomous self-healing data ingestion mesh with automated contract enforcement'
        ],
        futureStateLevels: [
          '1. Explore: Ad-hoc manual CSV uploads and script-based dumps',
          '2. Experiment: Scheduled cron batch loads with frequent pipeline breaks',
          '3. Formalize: Automated declarative pipelines with Schema Evolution',
          '4. Optimize: Unified real-time streaming with automated backpressure handling',
          '5. Transform: Autonomous self-healing data ingestion mesh with automated contract enforcement'
        ],
        technicalPains: [
          'Fragile batch pipeline failures',
          'Lack of end-to-end data lineage',
          'High latency for critical reporting tables'
        ],
        businessPains: [
          'Executive decisions made on stale data',
          'Customer trust degradation from pipeline outages',
          'High engineering maintenance costs'
        ]
      }
    ]
  },
  {
    id: 'analytics_bi',
    name: 'Analytics',
    icon: BarChart2,
    emoji: '📊',
    progress: '5/5 100%',
    isComplete: true,
    dimensions: [
      { id: 'dim_a1', name: 'Semantic Modeling & BI Acceleration', done: true },
      { id: 'dim_a2', name: 'Self-Service Discovery', done: true }
    ],
    questions: []
  },
  {
    id: 'machine_learning',
    name: 'ML',
    icon: Cpu,
    emoji: '🤖',
    progress: '5/5 100%',
    isComplete: true,
    dimensions: [
      { id: 'dim_m1', name: 'Model Registry & Tracking', done: true },
      { id: 'dim_m2', name: 'Feature Store & Online Serving', done: true }
    ],
    questions: []
  },
  {
    id: 'generative_ai',
    name: 'GenAI',
    icon: Sparkles,
    emoji: '✨',
    progress: '5/5 100%',
    isComplete: true,
    dimensions: [
      { id: 'dim_g1', name: 'Foundation Model Routing & LLM Ops', done: true },
      { id: 'dim_g2', name: 'Multi-Agent Autonomous Orchestration', done: true }
    ],
    questions: []
  },
  {
    id: 'enablement',
    name: 'Enablement',
    icon: Zap,
    emoji: '⚡',
    progress: '5/5 100%',
    isComplete: true,
    dimensions: [
      { id: 'dim_e1', name: 'Center of Excellence (CoE)', done: true },
      { id: 'dim_e2', name: 'Developer Tooling & Inner-Loop Productivity', done: true }
    ],
    questions: []
  }
];

export default function AssessmentMatrixFlow({ 
  customerTitle = 'CityTech Solutions Data & AI Assessment', 
  onBack,
  onSubmit
}) {
  const [activePillarIndex, setActivePillarIndex] = useState(0);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'done' | 'todo'
  const [isSkip, setIsSkip] = useState(false);

  // Question Form State
  const [answers, setAnswers] = useState({
    currentState: 1, // index 1: Experiment (2)
    futureState: 2,  // index 2: Formalize (3)
    technicalPains: ['Poor environment isolation', 'Deployment consistency issues'],
    businessPains: ['Slow time-to-market for new features', 'Team bottlenecks in environment access', 'Compliance risks from inconsistency'],
    notes: 'Primary bottleneck is legacy dev-to-prod environment drift across data science and data engineering workspaces.'
  });

  const activePillar = PILLARS_DATA[activePillarIndex] || PILLARS_DATA[0];
  const activeQuestions = activePillar.questions.length > 0 ? activePillar.questions : PILLARS_DATA[0].questions;
  const currentQ = activeQuestions[activeQuestionIndex % activeQuestions.length];

  const handleToggleTechPain = (item) => {
    setAnswers(prev => ({
      ...prev,
      technicalPains: prev.technicalPains.includes(item)
        ? prev.technicalPains.filter(p => p !== item)
        : [...prev.technicalPains, item]
    }));
  };

  const handleToggleBizPain = (item) => {
    setAnswers(prev => ({
      ...prev,
      businessPains: prev.businessPains.includes(item)
        ? prev.businessPains.filter(p => p !== item)
        : [...prev.businessPains, item]
    }));
  };

  const handleNext = () => {
    if (activeQuestionIndex < activeQuestions.length - 1) {
      setActiveQuestionIndex(activeQuestionIndex + 1);
    } else if (activePillarIndex < PILLARS_DATA.length - 1) {
      setActivePillarIndex(activePillarIndex + 1);
      setActiveQuestionIndex(0);
    } else {
      if (onSubmit) onSubmit();
      else alert("🎉 All assessment pillars completed! Generating Executive Dossier...");
    }
  };

  const handlePrev = () => {
    if (activeQuestionIndex > 0) {
      setActiveQuestionIndex(activeQuestionIndex - 1);
    } else if (activePillarIndex > 0) {
      setActivePillarIndex(activePillarIndex - 1);
      setActiveQuestionIndex(0);
    }
  };

  return (
    <div className="assessment-matrix-layout">
      {/* LEFT SIDEBAR: Customer Title + Pillars Accordion */}
      <aside className="matrix-sidebar">
        {/* Customer Badge */}
        <div className="matrix-customer-badge">
          <div className="matrix-customer-header">
            <h4>{customerTitle}</h4>
            <button className="btn-edit-badge" title="Edit Assessment Title">
              <Edit3 size={13} />
              <span>Edit</span>
            </button>
          </div>
          <p className="matrix-customer-meta">CityTech Solutions • 6 of 6 pillars completed</p>
        </div>

        {/* Pillars List */}
        <div className="matrix-pillars-list">
          {PILLARS_DATA.map((pillar, pIdx) => {
            const isSelected = pIdx === activePillarIndex;
            return (
              <div 
                key={pillar.id}
                className={`matrix-pillar-group ${isSelected ? 'is-selected' : ''}`}
              >
                <div 
                  className="matrix-pillar-header"
                  onClick={() => {
                    setActivePillarIndex(pIdx);
                    setActiveQuestionIndex(0);
                  }}
                >
                  <div className="pillar-header-left">
                    <span className="pillar-check">
                      <CheckCircle2 size={16} color="#10b981" />
                    </span>
                    <span className="pillar-emoji">{pillar.emoji}</span>
                    <span className="pillar-name">{pillar.name}</span>
                  </div>
                  <div className="pillar-header-right">
                    <span className="pillar-progress-pill">{pillar.progress}</span>
                    {isSelected ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </div>
                </div>

                {/* Sub-dimensions (Visible when expanded) */}
                {isSelected && (
                  <div className="matrix-dimensions-sublist">
                    <div className="dimension-action-row">
                      <ChevronRight size={13} color="var(--google-blue)" />
                      <span className="dim-start-link">Start {pillar.emoji} Assessment</span>
                    </div>
                    {pillar.dimensions.map((dim, dIdx) => (
                      <div className="dimension-sub-item" key={dim.id}>
                        <CheckCircle2 size={12} color="#10b981" />
                        <span>{dim.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Ready to submit footer */}
        <div className="matrix-sidebar-footer">
          <button className="btn-ready-submit" onClick={onSubmit || onBack}>
            <CheckCircle2 size={16} />
            <span>READY TO SUBMIT?</span>
          </button>
        </div>
      </aside>

      {/* MAIN QUESTION WORKSPACE */}
      <main className="matrix-main-workspace">
        {/* Top Breadcrumb & Question Filter Bar */}
        <div className="matrix-top-bar">
          <div className="matrix-title-lockup">
            <span className="pillar-badge-icon">{activePillar.emoji}</span>
            <div>
              <h3>{activePillar.name}</h3>
              <p className="dim-subtitle">Environment Architecture & Scalability</p>
            </div>
          </div>

          <div className="matrix-filter-controls">
            {/* Filter Pills */}
            <div className="q-filter-group">
              <button 
                className={`q-filter-pill ${filterMode === 'all' ? 'active' : ''}`}
                onClick={() => setFilterMode('all')}
              >
                All 10
              </button>
              <button 
                className={`q-filter-pill ${filterMode === 'done' ? 'active' : ''}`}
                onClick={() => setFilterMode('done')}
              >
                Done 10
              </button>
              <button 
                className={`q-filter-pill ${filterMode === 'todo' ? 'active' : ''}`}
                onClick={() => setFilterMode('todo')}
              >
                Todo 0
              </button>
            </div>

            {/* Question Bubbles 1..10 */}
            <div className="q-bubbles-row">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <button
                  key={num}
                  className={`q-bubble-btn ${activeQuestionIndex === num - 1 ? 'is-current' : 'is-done'}`}
                  onClick={() => setActiveQuestionIndex(num - 1)}
                >
                  {num}
                </button>
              ))}
            </div>

            {/* Status & Skip */}
            <div className="q-meta-status">
              <span className="saved-indicator">
                <CheckCircle2 size={13} color="#10b981" />
                <span>Saved</span>
              </span>
              <span className="q-index-pill">Q {activeQuestionIndex + 1}/10</span>
              <label className="q-skip-label">
                <input 
                  type="checkbox" 
                  checked={isSkip} 
                  onChange={(e) => setIsSkip(e.target.checked)} 
                />
                <span>Skip</span>
              </label>
            </div>
          </div>
        </div>

        {/* Question Statement Header */}
        <div className="matrix-question-header-card">
          <div className="q-header-left">
            <h2>{currentQ.title}</h2>
          </div>
          <div className="q-header-actions">
            <button className="btn-q-action edit" title="Edit Question">
              <Edit3 size={14} />
              <span>Edit</span>
            </button>
            <button className="btn-q-action delete" title="Delete Question">
              <Trash2 size={14} />
              <span>Delete</span>
            </button>
          </div>
        </div>

        {/* 5-COLUMN INTERACTIVE MATRIX GRID */}
        <div className="matrix-5col-grid">
          {/* Column 1: Current State */}
          <div className="matrix-col">
            <div className="col-header">
              <span>Current State</span>
              <HelpCircle size={14} className="help-icon" />
            </div>
            <div className="col-options-list">
              {currentQ.currentStateLevels.map((lvl, idx) => (
                <div 
                  key={idx}
                  className={`matrix-option-card ${answers.currentState === idx ? 'is-selected' : ''}`}
                  onClick={() => setAnswers(prev => ({ ...prev, currentState: idx }))}
                >
                  <p>{lvl}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Future State Vision */}
          <div className="matrix-col">
            <div className="col-header">
              <span>Future State Vision</span>
              <HelpCircle size={14} className="help-icon" />
            </div>
            <div className="col-options-list">
              {currentQ.futureStateLevels.map((lvl, idx) => (
                <div 
                  key={idx}
                  className={`matrix-option-card ${answers.futureState === idx ? 'is-selected' : ''}`}
                  onClick={() => setAnswers(prev => ({ ...prev, futureState: idx }))}
                >
                  <p>{lvl}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: Technical Pain Points */}
          <div className="matrix-col">
            <div className="col-header">
              <span>Technical Pain Points</span>
            </div>
            <div className="col-checkbox-list">
              {currentQ.technicalPains.map((tp, idx) => (
                <label 
                  key={idx}
                  className={`matrix-checkbox-card ${answers.technicalPains.includes(tp) ? 'is-checked' : ''}`}
                >
                  <input 
                    type="checkbox"
                    checked={answers.technicalPains.includes(tp)}
                    onChange={() => handleToggleTechPain(tp)}
                  />
                  <span>{tp}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Column 4: Business Pain Points */}
          <div className="matrix-col">
            <div className="col-header">
              <span>Business Pain Points</span>
            </div>
            <div className="col-checkbox-list">
              {currentQ.businessPains.map((bp, idx) => (
                <label 
                  key={idx}
                  className={`matrix-checkbox-card ${answers.businessPains.includes(bp) ? 'is-checked' : ''}`}
                >
                  <input 
                    type="checkbox"
                    checked={answers.businessPains.includes(bp)}
                    onChange={() => handleToggleBizPain(bp)}
                  />
                  <span>{bp}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Column 5: Qualitative Notes */}
          <div className="matrix-col">
            <div className="col-header">
              <span>Notes</span>
            </div>
            <div className="matrix-notes-wrapper">
              <textarea 
                className="matrix-notes-textarea"
                value={answers.notes}
                onChange={(e) => setAnswers(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Share specific details about your environment architecture challenges or goals..."
              />
            </div>
          </div>
        </div>

        {/* BOTTOM ACTION BAR */}
        <div className="matrix-bottom-bar">
          <button className="btn-matrix-back" onClick={handlePrev}>
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>
          <button className="btn-matrix-next" onClick={handleNext}>
            <span>Next</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </main>
    </div>
  );
}
