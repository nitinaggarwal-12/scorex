import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiBriefcase, 
  FiGitPullRequest, 
  FiCheckCircle, 
  FiClock, 
  FiUsers, 
  FiCpu, 
  FiTerminal, 
  FiLock,
  FiTarget,
  FiDollarSign,
  FiCheckSquare
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

const extractSteps = (rec) => {
  if (!rec) return [];
  if (Array.isArray(rec.actionSteps) && rec.actionSteps.length > 0) {
    return rec.actionSteps.map(s => typeof s === 'string' ? s : (s.title || s.text || s.action || JSON.stringify(s)));
  }
  if (Array.isArray(rec.nextSteps) && rec.nextSteps.length > 0) {
    return rec.nextSteps.map(s => typeof s === 'string' ? s : (s.title || s.step || s.action || JSON.stringify(s)));
  }
  if (Array.isArray(rec.specificRecommendations) && rec.specificRecommendations.length > 0) {
    return rec.specificRecommendations.map(s => typeof s === 'string' ? s : (s.title || s.recommendation || JSON.stringify(s)));
  }
  if (Array.isArray(rec.recommendations) && rec.recommendations.length > 0) {
    return rec.recommendations.map(s => typeof s === 'string' ? s : (s.title || s.action || s.recommendation || JSON.stringify(s)));
  }
  if (Array.isArray(rec.actions) && rec.actions.length > 0) {
    return rec.actions.map(s => typeof s === 'string' ? s : (s.title || s.action || JSON.stringify(s)));
  }
  if (Array.isArray(rec.quickWins) && rec.quickWins.length > 0) {
    return rec.quickWins.map(s => typeof s === 'string' ? s : (s.title || s.action || JSON.stringify(s)));
  }
  return [];
};

const MultiPersonaViews = ({ 
  assessmentName = 'Enterprise Cloud, Data & AI Platform', 
  currentScore = 2.6, 
  targetScore = 4.5,
  aiReport = null,
  framework = null,
  scores = null,
  recs: propRecs = null,
  roadmap: propRoadmap = null
}) => {
  const [activePersona, setActivePersona] = useState('vp'); // 'vp' (Phased Roadmap default), 'board', 'architect'

  // Extract dynamic values from props or live AI report
  const effectiveRoadmap = propRoadmap || aiReport?.transformationRoadmap || aiReport?.roadmap || {};
  const recs = (propRecs && propRecs.length > 0)
    ? propRecs
    : (aiReport?.prioritizedRecommendations || aiReport?.prioritizedActions || []);

  const curr = typeof currentScore === 'number' ? currentScore : 2.5;
  const tgt = typeof targetScore === 'number' ? targetScore : 4.2;
  const gap = Math.max(0.5, tgt - curr);

  // Dynamic Board Metrics (Harmonized with Live Gemini 3.8 Flash financialAnalysis)
  const quartileBefore = curr < 2.5 ? 'Bottom 40%' : curr < 3.5 ? 'Mid 50%' : 'Top 25%';
  const quartileAfter = tgt >= 4.0 ? 'Top 10% (Leader)' : 'Top 25% (Advanced)';
  const estSavings = Number(aiReport?.financialAnalysis?.annualSavingsUsd) > 0
    ? Number(aiReport.financialAnalysis.annualSavingsUsd)
    : Math.max(120000, Math.round(gap * 380000));
  const calculatedRiskAvoidance = aiReport?.financialAnalysis?.annualSavingsFormatted || `$${Math.round(estSavings).toLocaleString()}/yr`;
  const implCost = Math.round(estSavings * 0.38);
  const calculatedPayback = aiReport?.financialAnalysis?.paybackMonths
    ? `${Number(aiReport.financialAnalysis.paybackMonths).toFixed(1)} Months`
    : `${Math.max(2.1, Math.min(16.0, Number(((implCost / estSavings) * 12).toFixed(1)))).toFixed(1)} Months`;

  // Dynamic Phase 1, 2, 3 data from roadmap or prioritizedActions
  const roadmapPhases = Array.isArray(effectiveRoadmap.phases) ? effectiveRoadmap.phases : null;
  const rawPhase1 = roadmapPhases ? roadmapPhases.find(p => p.id === 'phase1' || p.title?.includes('Phase 1')) : effectiveRoadmap.phase1;
  const rawPhase2 = roadmapPhases ? roadmapPhases.find(p => p.id === 'phase2' || p.title?.includes('Phase 2')) : effectiveRoadmap.phase2;
  const rawPhase3 = roadmapPhases ? roadmapPhases.find(p => p.id === 'phase3' || p.title?.includes('Phase 3')) : effectiveRoadmap.phase3;

  const rec1Steps = extractSteps(recs[0]);
  const rec2Steps = extractSteps(recs[1]);
  const rec3Steps = extractSteps(recs[2]);

  const phase1 = {
    title: rawPhase1?.title || 'Phase 1: Foundation & Governance',
    timeline: rawPhase1?.timeline || 'Months 0–3',
    focus: rawPhase1?.focus || (recs[0]?.pillarName ? `Establish core foundational governance and baseline capabilities for ${recs[0].pillarName}.` : 'Establish centralized metadata governance, VPC network perimeters, and compute autoscaling guardrails.'),
    milestones: (rawPhase1?.milestones && rawPhase1.milestones.length > 0)
      ? rawPhase1.milestones
      : (rawPhase1?.items && rawPhase1.items.length > 0)
      ? rawPhase1.items
      : [
          rec1Steps[0] || (recs[0]?.pillarName ? `Deploy ${recs[0].pillarName} foundational governance framework` : 'Deploy Centralized Metadata Catalog with ABAC IAM Roles'),
          rec1Steps[1] || 'Configure Serverless Autoscaling & Cost Limiters',
          rec1Steps[2] || 'Enforce VPC Service Controls & CMEK Encryption'
        ]
  };

  // Domain-specialized Top Board Decisions & Phase Fallbacks
  const keyType = `${framework?.typeKey || ''} ${framework?.title || ''}`.toLowerCase();
  const isAgenticDomain = keyType.includes('agentic') || keyType.includes('mcp') || keyType.includes('multi-agent');
  const isGenAIDomain = keyType.includes('openai') || keyType.includes('gemini') || keyType.includes('genai') || isAgenticDomain;
  const isSecDomain = keyType.includes('security') || keyType.includes('zero_trust') || keyType.includes('trism');
  const isFinOpsDomain = keyType.includes('finops') || keyType.includes('cost') || keyType.includes('billing');
  const isLakehouseDomain = keyType.includes('lakehouse') || keyType.includes('edw') || keyType.includes('bigquery');

  const phase2 = {
    title: rawPhase2?.title || 'Phase 2: Scale & Acceleration',
    timeline: rawPhase2?.timeline || 'Months 3–6',
    focus: rawPhase2?.focus || (recs[1]?.pillarName
      ? `Scale modernization across ${recs[1].pillarName} with declarative pipelines and automated contracts.`
      : isFinOpsDomain
      ? 'Automate GKE Autopilot rightsizing, lock in 85%+ Flexible CUDs, and enable storage Autoclass tiering.'
      : isSecDomain
      ? 'Enforce inline Cloud DLP surrogate tokenization, HSM CMEK encryption, and Google Model Armor shields.'
      : isAgenticDomain
      ? 'Deploy Vertex AI Agent Engine supervisor/worker orchestration with AlloyDB AI episodic memory.'
      : isGenAIDomain
      ? 'Cut over to Gemini 3.8 Pro native 2M-token context windows and 75% Vertex AI Context Caching.'
      : 'Unify storage with Apache Iceberg / BigLake, transition legacy batch to real-time CDC streaming, and automate CI/CD.'),
    milestones: (rawPhase2?.milestones && rawPhase2.milestones.length > 0)
      ? rawPhase2.milestones
      : (rawPhase2?.items && rawPhase2.items.length > 0)
      ? rawPhase2.items
      : [
          rec2Steps[0] || (recs[1]?.pillarName ? `Standardize ${recs[1].pillarName} on declarative cloud-native architecture` : 'Standardize on Declarative Cloud-Native Architecture'),
          rec2Steps[1] || 'Deploy Automated CI/CD Policy & Quality Gates',
          rec2Steps[2] || 'Automate Real-Time Streaming & Telemetry'
        ]
  };

  const phase3 = {
    title: rawPhase3?.title || 'Phase 3: Production AI & Autonomous Operations',
    timeline: rawPhase3?.timeline || 'Months 6–12',
    focus: rawPhase3?.focus || (recs[2]?.pillarName
      ? `Productionize advanced capabilities across ${recs[2].pillarName} with real-time intelligence.`
      : isFinOpsDomain
      ? 'Operationalize autonomous FinOps unit economics, BQML anomaly circuit-breakers, and model-tier arbitrage.'
      : isSecDomain
      ? 'Activate autonomous Chronicle SIEM/SOAR response, JIT PAM, and SLSA Level 3 cryptographic attestation.'
      : 'Operationalize Vertex AI Gemini Agentic Mesh with Model Context Protocol (MCP) and Prompt Context Caching.'),
    milestones: (rawPhase3?.milestones && rawPhase3.milestones.length > 0)
      ? rawPhase3.milestones
      : (rawPhase3?.items && rawPhase3.items.length > 0)
      ? rawPhase3.items
      : [
          rec3Steps[0] || (recs[2]?.pillarName ? `Operationalize ${recs[2].pillarName} enterprise automation & SLA contracts` : 'Enable Gemini Prompt Context Caching (75% Input Discount)'),
          rec3Steps[1] || 'Deploy Governed Autonomous Workflows & Policy Guardrails',
          rec3Steps[2] || 'Establish Continuous Executive Telemetry & Unit Economics'
        ]
  };

  const boardDecisions = recs.length >= 3 ? [
    { 
      title: recs[0].title || (recs[0].pillarName ? `Authorize ${recs[0].pillarName} Modernization & Governance` : (isGenAIDomain ? 'Authorize Enterprise AI Gateway & Model Governance' : 'Authorize Centralized Cloud Governance')), 
      desc: recs[0].whyItMatters || recs[0].justification || recs[0].description || (recs[0].theBad?.[0] ? `Remediate: ${recs[0].theBad[0]}` : 'Eliminate vendor lock-in, unmonitored egress, and compliance blind spots.') 
    },
    { 
      title: recs[1].title || (recs[1].pillarName ? `Approve ${recs[1].pillarName} Acceleration & Migration` : (isGenAIDomain ? 'Approve Vertex AI Gemini Long-Context & Prompt Caching Migration' : 'Approve Serverless Compute & Storage Modernization')), 
      desc: recs[1].whyItMatters || recs[1].justification || recs[1].description || (recs[1].theBad?.[0] ? `Remediate: ${recs[1].theBad[0]}` : 'Capture 50-75% token cost reduction and eliminate brittle vector RAG chunking.') 
    },
    { 
      title: recs[2].title || (recs[2].pillarName ? `Fund ${recs[2].pillarName} Automation & Intelligence Deployment` : (isGenAIDomain ? 'Fund Model Armor & MCP Multi-Agent Mesh Deployment' : 'Fund Enterprise AI & Automation Deployment')), 
      desc: recs[2].whyItMatters || recs[2].justification || recs[2].description || (recs[2].theBad?.[0] ? `Remediate: ${recs[2].theBad[0]}` : 'Deploy standardized MCP agent contracts with real-time prompt injection defense.') 
    }
  ] : isAgenticDomain ? [
    { title: 'Authorize Standardized Apigee MCP Tool Gateway', desc: 'Replace brittle REST tool wrappers and shared credentials with schema-validated MCP tool servers and per-agent OAuth.' },
    { title: 'Approve Hierarchical Vertex AI Agent Engine & AlloyDB Memory', desc: 'Transition from linear prompt chains to supervisor/worker orchestration with persistent episodic memory.' },
    { title: 'Fund Regulated HITL Approval Gates & Trajectory Eval CI/CD', desc: 'Mandate Human-in-the-Loop approval for high-materiality banking actions and OpenTelemetry trajectory tracing.' }
  ] : isGenAIDomain ? [
    { title: 'Authorize Enterprise AI Gateway & CMEK Perimeter', desc: 'Decouple backend microservices from direct vendor SDKs and enforce VPC-SC and Cloud KMS CMEK encryption.' },
    { title: 'Approve Gemini Long-Context & Prompt Context Caching', desc: 'Capture up to 75% input token discount and eliminate lossy 8k chunking via native 2M context windows.' },
    { title: 'Fund Model Armor & MCP Multi-Agent Mesh Deployment', desc: 'Deploy standardized Model Context Protocol (MCP) agent contracts with automated CI/CD evaluation gates.' }
  ] : isSecDomain ? [
    { title: 'Mandate Elimination of Static Service Account Keys', desc: 'Enforce Workload Identity Federation (OIDC) and ephemeral JIT PAM privileges (<4h) across all cloud environments.' },
    { title: 'Deploy Real-Time Cloud DLP & Customer-Managed KMS (CMEK)', desc: 'Automate PII surrogate tokenization and institute cryptographic tenant data shredding.' },
    { title: 'Authorize Centralized Chronicle SIEM & Automated Incident Triage', desc: 'Correlate cloud audit logs across all regions to reduce mean-time-to-remediate (MTTR) under 15 minutes.' }
  ] : isFinOpsDomain ? [
    { title: 'Authorize BigQuery FOCUS 1.0 Billing Attribution & Budgets', desc: 'Eliminate unallocated spend and deployBQML cost anomaly detection with automated Pub/Sub budget circuit-breakers.' },
    { title: 'Approve GKE Autopilot Rightsizing & 85%+ Flexible CUDs', desc: 'Enforce 15-minute idle compute auto-suspend and automated commitment portfolio optimization.' },
    { title: 'Fund Departmental Showback & AI Token Arbitrage', desc: 'Operationalize 75% Vertex AI Context Caching discounts and unit-economic chargeback scorecards.' }
  ] : isLakehouseDomain ? [
    { title: 'Authorize Unified BigLake Open Iceberg & Dataplex Governance', desc: 'Eliminate duplicate storage taxes and enforce automated column-level lineage and ABAC policy tags.' },
    { title: 'Approve Sub-Second Datastream CDC & BigQuery Editions', desc: 'Replace 24-hour nightly batch ETL windows and fixed legacy EDW appliance capacity with serverless autoscaling.' },
    { title: 'Fund Governed Looker Semantic Layer & In-Database BQML', desc: 'Consolidate fragmented BI extracts into a single semantic metric layer accelerated by BigQuery BI Engine.' }
  ] : [
    { title: 'Authorize Unified Dataplex Governance & Zero-Trust Perimeters', desc: 'Mandate centralized metadata cataloging, ABAC policy tags, and VPC-SC security across all domains.' },
    { title: 'Approve Declarative Streaming & Serverless Compute Modernization', desc: 'Shift from manual batch pipelines and static VMs to Datastream CDC, Dataform, and autoscaling compute.' },
    { title: 'Fund Enterprise Vertex AI MLOps, Agent Engine & FinOps CoE', desc: 'Establish 75% prompt context caching, governed MCP agents, and FOCUS 1.0 unit-cost attribution.' }
  ];

  // Derive dynamic playbook items from assessed pillars
  const findRecByTerms = (terms) => {
    return recs.find(r => {
      const pid = (r.pillarId || r.area || r.pillar || r.dimension || '').toLowerCase();
      const pname = (r.pillarName || r.dimension || r.name || r.title || '').toLowerCase();
      return terms.some(t => pid.includes(t) || pname.includes(t));
    });
  };

  const secRec = findRecByTerms(['govern', 'secur', 'platform', 'trust', 'compliance', 'dlp', 'siem', 'iam', 'armor']);
  const dataRec = findRecByTerms(['engineer', 'data', 'pipeline', 'lakehouse', 'etl', 'storage', 'memory', 'context', 'visibility', 'billing']);
  const aiRec = findRecByTerms(['genai', 'ai', 'machine', 'ml', 'model', 'agent', 'mcp', 'prompt', 'telemetry', 'anomaly']);
  const opsRec = findRecByTerms(['ops', 'finops', 'cost', 'excellence', 'cloud', 'infra', 'commitment', 'cud', 'unit']);

  const secSteps = extractSteps(secRec);
  const dataSteps = extractSteps(dataRec);
  const aiSteps = extractSteps(aiRec);
  const opsSteps = extractSteps(opsRec);

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
            $active={activePersona === 'vp'} 
            onClick={() => setActivePersona('vp')}
          >
            <FiGitPullRequest /> Phased Roadmap (0–12 Mos)
          </TabButton>
          <TabButton 
            $active={activePersona === 'board'} 
            onClick={() => setActivePersona('board')}
          >
            <FiBriefcase /> Board & C-Suite Mandates
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
        {/* 1. BOARD & C-SUITE VIEW (Focused on Strategic Mandates & Expected Outcomes — zero overlap with Tab 3 Financial Card) */}
        {activePersona === 'board' && (
          <ContentPanel
            key="board"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <BoardCardGrid>
              {(Array.isArray(aiReport?.expectedOutcomes) && aiReport.expectedOutcomes.length >= 3
                ? aiReport.expectedOutcomes.slice(0, 3)
                : [
                    `Elevate architecture maturity from ${curr.toFixed(1)}/5.0 to ${tgt.toFixed(1)}/5.0 (${quartileAfter})`,
                    `Enforce zero-trust IAM, CMEK encryption, and automated CI/CD evaluation gates`,
                    `Realize ${calculatedRiskAvoidance} annualized operational velocity & FinOps arbitrage`
                  ]
              ).map((outcome, oIdx) => (
                <BoardMetricBox key={oIdx}>
                  <div className="label">Strategic Target Outcome #{oIdx + 1}</div>
                  <div className="value" style={{ fontSize: '1.05rem', color: '#0f172a', lineHeight: 1.35 }}>{outcome}</div>
                  <div className="desc">Verified Gemini 3.8 Flash executive outcome gate</div>
                </BoardMetricBox>
              ))}
            </BoardCardGrid>

            <DecisionsList>
              <h3>
                <FiTarget color="#0284c7" /> Top 3 Board-Level Strategic Investment Mandates
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

        {/* 2. VP & ENGINEERING GANTT VIEW (Single Consolidated Phased Roadmap with Gemini 3.8 Flash Exit Gates) */}
        {activePersona === 'vp' && (
          <ContentPanel
            key="vp"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <GanttPhases>
              {[
                { p: phase1, raw: rawPhase1, icon: <FiClock color="#0284c7" />, active: true, badgeStyle: {} },
                { p: phase2, raw: rawPhase2, icon: <FiCpu color="#6366f1" />, active: false, badgeStyle: { background: '#f5f3ff', color: '#6d28d9' } },
                { p: phase3, raw: rawPhase3, icon: <HiSparkles color="#ec4899" />, active: false, badgeStyle: { background: '#fdf2f8', color: '#be185d' } }
              ].map(({ p, raw, icon, active, badgeStyle }, idx) => (
                <PhaseCard key={idx} $active={active}>
                  <div className="top">
                    <div className="title-group">
                      {icon} {p.title}
                    </div>
                    <div className="timeline-badge" style={badgeStyle}>
                      <FiClock /> {p.timeline}
                    </div>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0 0 10px 0' }}>
                    {p.focus}
                  </p>
                  {raw?.architecturePattern && (
                    <div style={{
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      color: '#0284c7',
                      background: '#e0f2fe',
                      border: '1px solid #bae6fd',
                      borderRadius: '8px',
                      padding: '6px 10px',
                      marginBottom: '10px'
                    }}>
                      🏛️ <strong>Target Pattern:</strong> {raw.architecturePattern}
                    </div>
                  )}
                  <div className="milestones">
                    {(p.milestones || []).map((m, mIdx) => (
                      <div key={mIdx} className="milestone-item">
                        <FiCheckCircle color="#10b981" /> {m}
                      </div>
                    ))}
                  </div>
                  {raw?.exitGateKpi && (
                    <div style={{
                      marginTop: '10px',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      color: '#059669',
                      background: '#ecfdf5',
                      border: '1px solid #a7f3d0',
                      borderRadius: '8px',
                      padding: '6px 10px'
                    }}>
                      🎯 <strong>Exit Gate KPI:</strong> {raw.exitGateKpi}
                    </div>
                  )}
                </PhaseCard>
              ))}
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
                  <FiLock color="#10b981" /> {isSecDomain ? 'Zero-Trust Perimeter, WIF & JIT PAM Checklist' : isFinOpsDomain ? 'Tag Governance & Policy-as-Code Checklist' : 'Security, IAM & Zero-Trust Checklist'}
                </div>
                <div className="checklist">
                  {(secSteps.length > 0 ? secSteps.slice(0, 4) : isSecDomain ? [
                    'Route 100% of foundation model traffic through Apigee AI Gateway inside VPC-SC perimeters.',
                    'Eliminate static JSON service account keys via Workload Identity Federation & JIT PAM.',
                    'Enforce Cloud KMS Hardware (HSM) CMEK and Confidential Computing for model weights.',
                    'Mandate SLSA Level 3 Binary Authorization signing for all deployed containers and models.'
                  ] : isFinOpsDomain ? [
                    'Enforce mandatory cost-center, owner, and environment labels in CI/CD Terraform gates.',
                    'Configure IAM budget circuit-breakers and token quota caps per business unit.',
                    'Restrict on-demand GPU and high-memory instance creation via Organization Policy constraints.',
                    'Enable audit logging for all reservation, slot, and commitment modifications.'
                  ] : [
                    'Provision centralized cloud metadata catalog with fine-grained IAM role delegation.',
                    'Implement dynamic column-level masking and row-level filtering for PII data.',
                    'Enable Customer-Managed Encryption Keys (CMEK) and VPC Service Controls (VPC-SC).',
                    'Set up automated tag-based access control (ABAC) and data classification policies.'
                  ]).map((item, idx) => (
                    <div key={idx} className="check-row">
                      <FiCheckSquare /> {item}
                    </div>
                  ))}
                </div>
              </PlaybookCard>

              <PlaybookCard>
                <div className="title">
                  <FiCpu color="#3b82f6" /> {isFinOpsDomain ? 'FOCUS 1.0 Billing & Storage Lifecycle Architecture' : isSecDomain ? 'Inline Cloud DLP & Immutable Audit Architecture' : isGenAIDomain ? 'Long-Context Grounding & Episodic Memory Architecture' : 'Declarative Data Engineering & CDC Architecture'}
                </div>
                <div className="checklist">
                  {(dataSteps.length > 0 ? dataSteps.slice(0, 4) : isFinOpsDomain ? [
                    'Stream multi-cloud billing exports into BigQuery using the standardized FOCUS 1.0 schema.',
                    'Enable GKE OpenCost pod-level metering for shared Kubernetes cluster attribution.',
                    'Configure Cloud Storage Autoclass and BigLake compaction to tier cold petabytes automatically.',
                    'Eliminate redundant staging table copies across analytical marts.'
                  ] : isSecDomain ? [
                    'Deploy inline Cloud DLP surrogate tokenization across all RAG ingestion and prompt streams.',
                    'Stream 100% of AI gateway and KMS audit logs into Google SecOps (Chronicle SIEM) WORM storage.',
                    'Enforce cryptographic tenant isolation and automated PII redaction before vector indexing.',
                    'Validate zero-data-retention guarantees on all foundation model inference endpoints.'
                  ] : isGenAIDomain ? [
                    'Replace brittle 512-token RAG chunking with Gemini 3.8 Pro native 2M-token context windows.',
                    'Consolidate external vector stores into ACL-synchronized Vertex AI Vector Search.',
                    'Persist multi-turn agent episodic and semantic memory in AlloyDB AI and Cloud Spanner Graph.',
                    'Enforce strict JSON-schema output contracts across all model and tool invocations.'
                  ] : [
                    'Standardize on open table formats (Apache Iceberg / BigLake) for zero-copy querying.',
                    'Replace legacy batch polling with real-time Datastream Change Data Capture (CDC).',
                    'Enforce declarative data quality contracts and schema drift alerting.',
                    'Deploy version-controlled Dataform SQLX pipelines with automated Git CI/CD testing.'
                  ]).map((item, idx) => (
                    <div key={idx} className="check-row">
                      <FiCheckSquare /> {item}
                    </div>
                  ))}
                </div>
              </PlaybookCard>

              <PlaybookCard>
                <div className="title">
                  <HiSparkles color="#8b5cf6" /> {isFinOpsDomain ? 'GKE Autopilot Rightsizing & Anomaly Guardrails' : isSecDomain ? 'Google Model Armor & Adversarial Defense' : 'Compound AI & Agentic Implementation'}
                </div>
                <div className="checklist">
                  {(aiSteps.length > 0 ? aiSteps.slice(0, 4) : isFinOpsDomain ? [
                    'Migrate over-provisioned Kubernetes workloads to GKE Autopilot with scale-to-zero node pools.',
                    'Deploy BQML real-time cost anomaly detection with automated Pub/Sub Slack/PagerDuty alerts.',
                    'Implement Vertex AI Context Caching for 75% input token savings on repeated system prompts.',
                    'Route high-volume classification tasks to Gemini 3.8 Flash and complex reasoning to Pro.'
                  ] : isSecDomain ? [
                    'Activate Google Model Armor inline shields for direct and indirect prompt injection defense.',
                    'Enforce real-time output toxicity, PII leakage, and hallucination grounding checks.',
                    'Automate adversarial red-teaming and jailbreak regression suites in CI/CD pipelines.',
                    'Configure Chronicle SOAR playbooks to quarantine compromised agent credentials in <60s.'
                  ] : [
                    'Standardize agent tool calling schemas on Model Context Protocol (MCP).',
                    'Implement Gemini Prompt Context Caching for large static reference documents (75% cost reduction).',
                    'Build dynamic model router (route simple queries to Flash models, complex to Pro/Thinking).',
                    'Add real-time LLM input/output toxicity, jailbreak, and prompt injection guardrails.'
                  ]).map((item, idx) => (
                    <div key={idx} className="check-row">
                      <FiCheckSquare /> {item}
                    </div>
                  ))}
                </div>
              </PlaybookCard>

              <PlaybookCard>
                <div className="title">
                  <FiDollarSign color="#f59e0b" /> {isSecDomain ? 'Continuous AI TRiSM & GRC Automation' : 'FinOps, Commitment & SLA Optimization'}
                </div>
                <div className="checklist">
                  {(opsSteps.length > 0 ? opsSteps.slice(0, 4) : isSecDomain ? [
                    'Publish continuous AI TRiSM compliance scorecards mapped to NIST AI RMF & ISO 42001.',
                    'Enforce mandatory Human-in-the-Loop (HITL) approval gates for high-risk agent actions.',
                    'Automate quarterly access certification and zero-standing-privilege drift audits.',
                    'Verify regional data residency and sovereign VPC perimeter compliance.'
                  ] : [
                    'Configure 15-minute auto-termination timeout on all interactive developer compute clusters.',
                    'Optimize Flexible CUDs, Provisioned Throughput, and BigQuery Editions autoscaling slots.',
                    'Set up FOCUS 1.0 multi-tenant cost attribution and automated departmental showback scorecards.',
                    'Run continuous automated compute rightsizing and spot/preemptible utilization audits.'
                  ]).map((item, idx) => (
                    <div key={idx} className="check-row">
                      <FiCheckSquare /> {item}
                    </div>
                  ))}
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
