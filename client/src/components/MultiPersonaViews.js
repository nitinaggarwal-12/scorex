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
  assessmentName = 'Enterprise Data Platform', 
  currentScore = 2.6, 
  targetScore = 4.5 
}) => {
  const [activePersona, setActivePersona] = useState('board'); // 'board', 'vp', 'architect'

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
                <div className="value" style={{ color: '#0284c7' }}>Top 35% ➔ Top 10%</div>
                <div className="desc">Advancing to Target State elevates market position into industry top decile.</div>
              </BoardMetricBox>

              <BoardMetricBox>
                <div className="label">Total Risk Exposure Avoidance</div>
                <div className="value" style={{ color: '#16a34a' }}>$840,000</div>
                <div className="desc">Direct mitigation of GDPR/HIPAA compliance fines and revenue-impacting outages.</div>
              </BoardMetricBox>

              <BoardMetricBox>
                <div className="label">Capital Payback Horizon</div>
                <div className="value" style={{ color: '#9333ea' }}>3.8 Months</div>
                <div className="desc">Rapid capital recovery driven by serverless compute optimization and automation.</div>
              </BoardMetricBox>
            </BoardCardGrid>

            <DecisionsList>
              <h3>
                <FiTarget color="#0284c7" /> Top 3 Board-Level Strategic Investment Decisions
              </h3>
              <DecisionItem>
                <div className="num">1</div>
                <div className="text">
                  <strong>Authorize Unified Lakehouse Governance:</strong> Mandate Unity Catalog across all business units to eliminate security blind spots and enable secure data democratization.
                </div>
              </DecisionItem>
              <DecisionItem>
                <div className="num">2</div>
                <div className="text">
                  <strong>Approve Serverless Vectorized Migration:</strong> Shift from static over-provisioned VMs to serverless compute with auto-termination, immediately capturing 35-45% compute cost savings.
                </div>
              </DecisionItem>
              <DecisionItem>
                <div className="num">3</div>
                <div className="text">
                  <strong>Fund Enterprise GenAI Agent Infrastructure:</strong> Establish enterprise prompt caching, model routing, and zero-trust guardrails to de-risk GenAI rollouts.
                </div>
              </DecisionItem>
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
                    <FiClock color="#0284c7" /> Phase 1: Governance & Serverless Foundation
                  </div>
                  <div className="timeline-badge">
                    <FiClock /> Sprints 1–6 (Months 0–3)
                  </div>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0 0 10px 0' }}>
                  Core Objectives: Establish Unity Catalog Metastore, unify IAM permission boundaries, deploy serverless compute clusters with 15-min auto-suspend.
                </p>
                <div className="milestones">
                  <div className="milestone-item">
                    <FiCheckCircle color="#10b981" /> Unity Catalog Deployed
                  </div>
                  <div className="milestone-item">
                    <FiCheckCircle color="#10b981" /> Serverless SQL Clusters Active
                  </div>
                  <div className="milestone-item">
                    <FiCheckCircle color="#10b981" /> FinOps Tagging Policy Enforced
                  </div>
                </div>
              </PhaseCard>

              <PhaseCard $active={false}>
                <div className="top">
                  <div className="title-group">
                    <FiCpu color="#6366f1" /> Phase 2: Declarative Pipelines & MLOps Scale
                  </div>
                  <div className="timeline-badge" style={{ background: '#f5f3ff', color: '#6d28d9' }}>
                    <FiClock /> Sprints 7–12 (Months 3–6)
                  </div>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0 0 10px 0' }}>
                  Core Objectives: Convert brittle legacy ETL jobs into declarative streaming pipelines (SDF / dbt), establish central MLflow Model Registry, automate CI/CD.
                </p>
                <div className="milestones">
                  <div className="milestone-item">
                    <FiCheckCircle color="#10b981" /> Declarative Pipelines Live
                  </div>
                  <div className="milestone-item">
                    <FiCheckCircle color="#10b981" /> MLflow Production Registry
                  </div>
                  <div className="milestone-item">
                    <FiCheckCircle color="#10b981" /> Data Quality SLA Alerts
                  </div>
                </div>
              </PhaseCard>

              <PhaseCard $active={false}>
                <div className="top">
                  <div className="title-group">
                    <HiSparkles color="#ec4899" /> Phase 3: Autonomous Agent Mesh & Continuous Value
                  </div>
                  <div className="timeline-badge" style={{ background: '#fdf2f8', color: '#be185d' }}>
                    <FiClock /> Sprints 13–24 (Months 6–12)
                  </div>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0 0 10px 0' }}>
                  Core Objectives: Deploy Model Context Protocol (MCP) multi-agent workflows, enable prompt context caching (75% discount), launch real-time semantic metric layer.
                </p>
                <div className="milestones">
                  <div className="milestone-item">
                    <FiCheckCircle color="#10b981" /> Multi-Agent MCP Workflows
                  </div>
                  <div className="milestone-item">
                    <FiCheckCircle color="#10b981" /> Prompt Context Caching
                  </div>
                  <div className="milestone-item">
                    <FiCheckCircle color="#10b981" /> Self-Service Semantic Layer
                  </div>
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
                  <FiLock color="#10b981" /> Security, IAM & Governance Checklist
                </div>
                <div className="checklist">
                  <div className="check-row">
                    <FiCheckSquare /> Provision Unity Catalog metastore with IAM role delegation.
                  </div>
                  <div className="check-row">
                    <FiCheckSquare /> Implement dynamic column-level masking and row-level filtering for PII data.
                  </div>
                  <div className="check-row">
                    <FiCheckSquare /> Enable Customer-Managed Encryption Keys (CMEK) and Private Service Connect (PSC).
                  </div>
                  <div className="check-row">
                    <FiCheckSquare /> Set up automated tag-based access control (ABAC) across all catalogs.
                  </div>
                </div>
              </PlaybookCard>

              <PlaybookCard>
                <div className="title">
                  <FiCpu color="#3b82f6" /> Declarative Data Engineering Best Practices
                </div>
                <div className="checklist">
                  <div className="check-row">
                    <FiCheckSquare /> Replace ad-hoc batch loops with Auto Loader file ingestion from cloud buckets.
                  </div>
                  <div className="check-row">
                    <FiCheckSquare /> Adopt Delta Lake / Iceberg UniForm for zero-copy cross-engine interoperability.
                  </div>
                  <div className="check-row">
                    <FiCheckSquare /> Enforce declarative expectation constraints (`EXPECT x IS NOT NULL ON VIOLATION DROP`).
                  </div>
                  <div className="check-row">
                    <FiCheckSquare /> Configure automated dead-letter queues and retry handlers on streaming stages.
                  </div>
                </div>
              </PlaybookCard>

              <PlaybookCard>
                <div className="title">
                  <HiSparkles color="#8b5cf6" /> Compound AI & Agentic Implementation
                </div>
                <div className="checklist">
                  <div className="check-row">
                    <FiCheckSquare /> Standardize tool calling schemas on Model Context Protocol (MCP).
                  </div>
                  <div className="check-row">
                    <FiCheckSquare /> Implement Prompt Context Caching for large static reference documents (75% cost savings).
                  </div>
                  <div className="check-row">
                    <FiCheckSquare /> Build dynamic model router (route simple queries to Flash models, complex to Pro).
                  </div>
                  <div className="check-row">
                    <FiCheckSquare /> Add real-time LLM output toxicity and jailbreak detection guardrails.
                  </div>
                </div>
              </PlaybookCard>

              <PlaybookCard>
                <div className="title">
                  <FiDollarSign color="#f59e0b" /> FinOps & Infrastructure Automation
                </div>
                <div className="checklist">
                  <div className="check-row">
                    <FiCheckSquare /> Configure 15-minute auto-termination timeout on all interactive developer clusters.
                  </div>
                  <div className="check-row">
                    <FiCheckSquare /> Migrate analytical SQL workloads to Serverless SQL Warehouses.
                  </div>
                  <div className="check-row">
                    <FiCheckSquare /> Set up cost-center budget alerts with automated notification webhooks.
                  </div>
                  <div className="check-row">
                    <FiCheckSquare /> Run weekly automated cluster right-sizing and spot instance utilization audits.
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
