import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiBriefcase, 
  FiGitPullRequest, 
  FiShield, 
  FiCheckCircle, 
  FiClock, 
  FiTrendingUp, 
  FiUsers, 
  FiCpu, 
  FiTerminal, 
  FiLock,
  FiTarget,
  FiDollarSign,
  FiCheckSquare,
  FiList
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';

const Container = styled(motion.div)`
  background: white;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  padding: 28px;
  margin-bottom: 28px;
  position: relative;
  overflow: hidden;

  @media print {
    page-break-inside: avoid !important;
    box-shadow: none;
    border: 1px solid #cbd5e1;
    margin-bottom: 16px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 24px;
`;

const TitleBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  .icon {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.35rem;
    box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
  }
`;

const Title = styled.h2`
  font-size: 1.3rem;
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 3px 0;
`;

const Subtitle = styled.p`
  font-size: 0.85rem;
  color: #64748b;
  margin: 0;
`;

const PersonaTabs = styled.div`
  display: flex;
  background: #f1f5f9;
  padding: 4px;
  border-radius: 12px;
  gap: 4px;
  flex-wrap: wrap;
`;

const TabButton = styled.button`
  background: ${props => props.$active ? 'white' : 'transparent'};
  color: ${props => props.$active ? '#0f172a' : '#64748b'};
  font-weight: ${props => props.$active ? '800' : '600'};
  box-shadow: ${props => props.$active ? '0 2px 8px rgba(0,0,0,0.08)' : 'none'};
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 0.82rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;

  &:hover {
    color: #0f172a;
  }
`;

const ContentPanel = styled(motion.div)`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 24px;
`;

/* Board View Components */
const BoardCardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 20px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const BoardMetricBox = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px 20px;

  .label {
    font-size: 0.72rem;
    font-weight: 700;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    margin-bottom: 6px;
  }

  .value {
    font-size: 1.6rem;
    font-weight: 800;
    color: #1e293b;
    margin-bottom: 4px;
  }

  .desc {
    font-size: 0.75rem;
    color: #64748b;
    line-height: 1.4;
  }
`;

const DecisionsList = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;

  h3 {
    font-size: 0.95rem;
    font-weight: 800;
    color: #1e293b;
    margin: 0 0 14px 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const DecisionItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f1f5f9;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  .num {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #0284c7;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 800;
    flex-shrink: 0;
  }

  .text {
    font-size: 0.85rem;
    color: #334155;
    line-height: 1.5;

    strong {
      color: #0f172a;
    }
  }
`;

/* Gantt Roadmap Components */
const GanttPhases = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const PhaseCard = styled.div`
  background: white;
  border: 1.5px solid ${props => props.$active ? '#38bdf8' : '#e2e8f0'};
  border-radius: 12px;
  padding: 18px 20px;

  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    flex-wrap: wrap;
    gap: 10px;
  }

  .title-group {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 1rem;
    font-weight: 800;
    color: #1e293b;
  }

  .timeline-badge {
    background: #e0f2fe;
    color: #0369a1;
    font-size: 0.72rem;
    font-weight: 700;
    padding: 3px 10px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .milestones {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-top: 12px;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  .milestone-item {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 10px 12px;
    font-size: 0.78rem;
    color: #475569;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 6px;
  }
`;

/* Architect Playbook Components */
const PlaybookGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const PlaybookCard = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 18px 20px;

  .title {
    font-size: 0.92rem;
    font-weight: 800;
    color: #1e293b;
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
  }

  .checklist {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .check-row {
    font-size: 0.8rem;
    color: #475569;
    display: flex;
    align-items: flex-start;
    gap: 8px;
    line-height: 1.4;

    svg {
      color: #10b981;
      margin-top: 2px;
      flex-shrink: 0;
    }
  }
`;

const MultiPersonaViews = ({ 
  assessmentName = 'Enterprise Cloud, Data & AI Platform', 
  currentScore = 2.6, 
  targetScore = 4.5,
  aiReport = null,
  framework = null,
  scores = null
}) => {
  const [activePersona, setActivePersona] = useState('board'); // 'board', 'vp', 'architect'

  // Extract dynamic values from live AI report
  const roadmap = aiReport?.transformationRoadmap || {};
  const recs = aiReport?.prioritizedRecommendations || aiReport?.prioritizedActions || [];
  const strengths = aiReport?.keyStrengths || [];
  const constraints = aiReport?.criticalConstraints || [];

  const curr = typeof currentScore === 'number' ? currentScore : 2.5;
  const tgt = typeof targetScore === 'number' ? targetScore : 4.2;
  const gap = Math.max(0.5, tgt - curr);

  // Dynamic Board Metrics
  const quartileBefore = curr < 2.5 ? 'Bottom 40%' : curr < 3.5 ? 'Mid 50%' : 'Top 25%';
  const quartileAfter = tgt >= 4.0 ? 'Top 10% (Leader)' : 'Top 25% (Advanced)';
  const calculatedRiskAvoidance = `$${Math.round(gap * 360000).toLocaleString()}`;
  const calculatedPayback = `${Math.max(2.2, (5.4 - gap * 0.9)).toFixed(1)} Months`;

  // Dynamic Phase 1, 2, 3 data
  const phase1 = roadmap.phase1 || {
    title: 'Phase 1: Foundation & FinOps Governance',
    timeline: 'Months 0–3',
    focus: 'Establish centralized metadata governance, VPC network perimeters, and compute autoscaling guardrails.',
    milestones: [
      recs[0]?.actionSteps?.[0] || 'Deploy Centralized Metadata Catalog with ABAC IAM Roles',
      recs[0]?.actionSteps?.[1] || 'Configure Serverless Autoscaling & Cost Limiters',
      'Enforce VPC Service Controls & CMEK Encryption'
    ]
  };

  const phase2 = roadmap.phase2 || {
    title: 'Phase 2: Open Lakehouse & Pipeline Scale',
    timeline: 'Months 3–6',
    focus: 'Unify storage with Apache Iceberg / BigLake, transition legacy batch to real-time CDC streaming, and automate CI/CD.',
    milestones: [
      recs[1]?.actionSteps?.[0] || 'Standardize on Open Table Formats (Apache Iceberg / Delta)',
      recs[1]?.actionSteps?.[1] || 'Deploy Declarative Dataform/dbt Pipelines with Git CI/CD',
      'Automate Real-Time Change Data Capture (CDC)'
    ]
  };

  const phase3 = roadmap.phase3 || {
    title: 'Phase 3: Autonomous Agent Mesh & Production AI',
    timeline: 'Months 6–12',
    focus: 'Operationalize Vertex AI Gemini Agentic Mesh with Model Context Protocol (MCP) and Prompt Context Caching.',
    milestones: [
      recs[2]?.actionSteps?.[0] || 'Enable Gemini Prompt Context Caching (75% Input Discount)',
      recs[2]?.actionSteps?.[1] || 'Deploy Model Context Protocol (MCP) Multi-Agent Mesh',
      'In-Database Real-Time Machine Learning & Vector Search'
    ]
  };

  // Top Board Decisions
  const boardDecisions = recs.length >= 3 ? [
    { title: recs[0].title || 'Authorize Centralized Cloud Lakehouse Governance', desc: recs[0].whyItMatters || 'Eliminate compliance blind spots and unify access control across business units.' },
    { title: recs[1].title || 'Approve Serverless Autoscaling & Storage Migration', desc: recs[1].whyItMatters || 'Capture 40-50% compute cost savings by shifting from static clusters to serverless reservations.' },
    { title: recs[2].title || 'Fund Enterprise GenAI & Agentic Mesh Deployment', desc: recs[2].whyItMatters || 'Establish enterprise prompt caching, model routing, and zero-trust guardrails.' }
  ] : [
    { title: 'Authorize Unified Lakehouse Governance & Open Storage', desc: 'Mandate open table formats (Apache Iceberg) and centralized ABAC cataloging across all teams.' },
    { title: 'Approve Serverless Reservation Slot Migration', desc: 'Shift from static over-provisioned VMs to serverless autoscaling compute with 15-min auto-suspend.' },
    { title: 'Fund Enterprise GenAI Agentic Infrastructure', desc: 'Establish enterprise prompt caching (75% savings), model routing, and zero-trust guardrails.' }
  ];

  return (
    <Container
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <Header>
        <TitleBlock>
          <div className="icon">
            <FiUsers />
          </div>
          <div>
            <Title>Multi-Persona Executive Transformation Blueprints</Title>
            <Subtitle>
              Tailored deliverables for Board Directors, VP Engineering Leads, and Principal Architects.
            </Subtitle>
          </div>
        </TitleBlock>

        <PersonaTabs>
          <TabButton 
            $active={activePersona === 'board'} 
            onClick={() => setActivePersona('board')}
          >
            <FiBriefcase /> Board & C-Suite View
          </TabButton>
          <TabButton 
            $active={activePersona === 'vp'} 
            onClick={() => setActivePersona('vp')}
          >
            <FiGitPullRequest /> VP & Engineering Roadmap
          </TabButton>
          <TabButton 
            $active={activePersona === 'architect'} 
            onClick={() => setActivePersona('architect')}
          >
            <FiTerminal /> Architect & SecOps Playbook
          </TabButton>
        </PersonaTabs>
      </Header>

      <AnimatePresence mode="wait">
        {/* 1. BOARD & C-SUITE VIEW */}
        {activePersona === 'board' && (
          <ContentPanel
            key="board"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <BoardCardGrid>
              <BoardMetricBox>
                <div className="label">Competitive Quartile Positioning</div>
                <div className="value" style={{ color: '#0284c7' }}>{quartileBefore} ➔ {quartileAfter}</div>
                <div className="desc">Advancing from score {curr.toFixed(1)} to {tgt.toFixed(1)} elevates technical capability into the industry upper tier.</div>
              </BoardMetricBox>

              <BoardMetricBox>
                <div className="label">Total Risk Exposure Avoidance</div>
                <div className="value" style={{ color: '#16a34a' }}>{calculatedRiskAvoidance}</div>
                <div className="desc">Direct mitigation of GDPR/HIPAA compliance fines, security audit failures, and pipeline outages.</div>
              </BoardMetricBox>

              <BoardMetricBox>
                <div className="label">Capital Payback Horizon</div>
                <div className="value" style={{ color: '#9333ea' }}>{calculatedPayback}</div>
                <div className="desc">Rapid capital recovery driven by serverless compute right-sizing and automated prompt context caching.</div>
              </BoardMetricBox>
            </BoardCardGrid>

            <DecisionsList>
              <h3>
                <FiTarget color="#0284c7" /> Top 3 Board-Level Strategic Investment Decisions
              </h3>
              {boardDecisions.map((dec, idx) => (
                <DecisionItem key={idx}>
                  <div className="num">{idx + 1}</div>
                  <div className="text">
                    <strong>{dec.title}:</strong> {dec.desc}
                  </div>
                </DecisionItem>
              ))}
            </DecisionsList>
          </ContentPanel>
        )}

        {/* 2. VP & ENGINEERING GANTT VIEW */}
        {activePersona === 'vp' && (
          <ContentPanel
            key="vp"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <GanttPhases>
              <PhaseCard $active={true}>
                <div className="top">
                  <div className="title-group">
                    <FiClock color="#0284c7" /> {phase1.title || 'Phase 1: Foundation & Governance'}
                  </div>
                  <div className="timeline-badge">
                    <FiClock /> {phase1.timeline || 'Months 0–3'}
                  </div>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0 0 10px 0' }}>
                  {phase1.focus}
                </p>
                <div className="milestones">
                  {(phase1.milestones || []).slice(0, 3).map((m, mIdx) => (
                    <div key={mIdx} className="milestone-item">
                      <FiCheckCircle color="#10b981" /> {m}
                    </div>
                  ))}
                </div>
              </PhaseCard>

              <PhaseCard $active={false}>
                <div className="top">
                  <div className="title-group">
                    <FiCpu color="#6366f1" /> {phase2.title || 'Phase 2: Open Lakehouse & Pipeline Scale'}
                  </div>
                  <div className="timeline-badge" style={{ background: '#f5f3ff', color: '#6d28d9' }}>
                    <FiClock /> {phase2.timeline || 'Months 3–6'}
                  </div>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0 0 10px 0' }}>
                  {phase2.focus}
                </p>
                <div className="milestones">
                  {(phase2.milestones || []).slice(0, 3).map((m, mIdx) => (
                    <div key={mIdx} className="milestone-item">
                      <FiCheckCircle color="#10b981" /> {m}
                    </div>
                  ))}
                </div>
              </PhaseCard>

              <PhaseCard $active={false}>
                <div className="top">
                  <div className="title-group">
                    <HiSparkles color="#ec4899" /> {phase3.title || 'Phase 3: Autonomous Agent Mesh & AI Integration'}
                  </div>
                  <div className="timeline-badge" style={{ background: '#fdf2f8', color: '#be185d' }}>
                    <FiClock /> {phase3.timeline || 'Months 6–12'}
                  </div>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0 0 10px 0' }}>
                  {phase3.focus}
                </p>
                <div className="milestones">
                  {(phase3.milestones || []).slice(0, 3).map((m, mIdx) => (
                    <div key={mIdx} className="milestone-item">
                      <FiCheckCircle color="#10b981" /> {m}
                    </div>
                  ))}
                </div>
              </PhaseCard>
            </GanttPhases>
          </ContentPanel>
        )}

        {/* 3. ARCHITECT & SECOPS PLAYBOOK */}
        {activePersona === 'architect' && (
          <ContentPanel
            key="architect"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <PlaybookGrid>
              <PlaybookCard>
                <div className="title">
                  <FiLock color="#10b981" /> Security, IAM & Zero-Trust Checklist
                </div>
                <div className="checklist">
                  <div className="check-row">
                    <FiCheckSquare /> Provision centralized cloud metadata catalog with fine-grained IAM role delegation.
                  </div>
                  <div className="check-row">
                    <FiCheckSquare /> Implement dynamic column-level masking and row-level filtering for PII data.
                  </div>
                  <div className="check-row">
                    <FiCheckSquare /> Enable Customer-Managed Encryption Keys (CMEK) and VPC Service Controls (VPC-SC).
                  </div>
                  <div className="check-row">
                    <FiCheckSquare /> Set up automated tag-based access control (ABAC) and data classification policies.
                  </div>
                </div>
              </PlaybookCard>

              <PlaybookCard>
                <div className="title">
                  <FiCpu color="#3b82f6" /> Declarative Data Engineering & CDC Architecture
                </div>
                <div className="checklist">
                  <div className="check-row">
                    <FiCheckSquare /> Standardize on open table formats (Apache Iceberg / Delta UniForm) for zero-copy querying.
                  </div>
                  <div className="check-row">
                    <FiCheckSquare /> Replace legacy batch polling with real-time log-based Change Data Capture (CDC).
                  </div>
                  <div className="check-row">
                    <FiCheckSquare /> Enforce declarative data quality contracts and schema drift alerting.
                  </div>
                  <div className="check-row">
                    <FiCheckSquare /> Deploy version-controlled Dataform / dbt pipelines with automated Git CI/CD testing.
                  </div>
                </div>
              </PlaybookCard>

              <PlaybookCard>
                <div className="title">
                  <HiSparkles color="#8b5cf6" /> Compound AI & Agentic Implementation
                </div>
                <div className="checklist">
                  <div className="check-row">
                    <FiCheckSquare /> Standardize agent tool calling schemas on Model Context Protocol (MCP).
                  </div>
                  <div className="check-row">
                    <FiCheckSquare /> Implement Gemini Prompt Context Caching for large static reference documents (75% cost reduction).
                  </div>
                  <div className="check-row">
                    <FiCheckSquare /> Build dynamic model router (route simple queries to Flash models, complex to Pro/Thinking).
                  </div>
                  <div className="check-row">
                    <FiCheckSquare /> Add real-time LLM input/output toxicity, jailbreak, and prompt injection guardrails.
                  </div>
                </div>
              </PlaybookCard>

              <PlaybookCard>
                <div className="title">
                  <FiDollarSign color="#f59e0b" /> FinOps & Infrastructure Optimization
                </div>
                <div className="checklist">
                  <div className="check-row">
                    <FiCheckSquare /> Configure 15-minute auto-termination timeout on all interactive developer compute clusters.
                  </div>
                  <div className="check-row">
                    <FiCheckSquare /> Migrate analytical SQL workloads to Serverless BigQuery Editions reservation slot pools.
                  </div>
                  <div className="check-row">
                    <FiCheckSquare /> Set up FOCUS 1.0 multi-tenant cost attribution and automated budget alerting webhooks.
                  </div>
                  <div className="check-row">
                    <FiCheckSquare /> Run weekly automated compute right-sizing and spot instance utilization audits.
                  </div>
                </div>
              </PlaybookCard>
            </PlaybookGrid>
          </ContentPanel>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default MultiPersonaViews;
