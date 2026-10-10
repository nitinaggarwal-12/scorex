import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  FiCheckCircle,
  FiArrowRight,
  FiTrendingUp,
  FiFolder,
  FiShield,
  FiZap,
  FiClock,
  FiDollarSign,
  FiUsers,
  FiAward,
  FiFileText,
  FiCpu,
  FiLayers
} from 'react-icons/fi';
import Footer from './Footer';

// =======================
// STYLED COMPONENTS
// =======================

const PageContainer = styled.div`
  min-height: 100vh;
  background: #f8fafc;
  color: #1e293b;
  padding-top: 68px; /* Height of fixed nav */
`;

const JourneyRibbon = styled.div`
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  padding: 12px clamp(16px, 3vw, 48px);
`;

const JourneyRibbonInner = styled.div`
  max-width: 1360px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
`;

const JourneyStepsList = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const JourneyStepPill = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 700;
  border: 1px solid ${props => (props.$active ? '#bfdbfe' : '#e2e8f0')};
  background: ${props => (props.$active ? '#eff6ff' : '#f8fafc')};
  color: ${props => (props.$active ? '#1d4ed8' : '#475569')};
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    border-color: #93c5fd;
    background: #eff6ff;
    color: #1d4ed8;
  }

  .step-num {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 0.7rem;
    font-weight: 800;
    background: ${props => (props.$active ? '#2563eb' : '#cbd5e1')};
    color: ${props => (props.$active ? '#ffffff' : '#334155')};
  }
`;

const HeroSection = styled.header`
  background: linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%);
  border-bottom: 1px solid #e2e8f0;
  padding: 48px clamp(16px, 3vw, 48px) 56px;
`;

const HeroContainer = styled.div`
  max-width: 1360px;
  margin: 0 auto;
`;

const HeroTopRow = styled.div`
  text-align: center;
  max-width: 900px;
  margin: 0 auto 40px;

  .eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 14px;
    border-radius: 999px;
    background: #eff6ff;
    border: 1px solid #bfdbfe;
    color: #1d4ed8;
    font-size: 0.78rem;
    font-weight: 800;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    margin-bottom: 16px;
  }

  h1 {
    font-size: clamp(2.1rem, 4vw, 3.25rem);
    font-weight: 850;
    color: #1e293b;
    line-height: 1.15;
    margin: 0 0 16px;
    letter-spacing: -0.03em;
  }

  p {
    font-size: 1.1rem;
    color: #475569;
    line-height: 1.65;
    margin: 0;
  }
`;

const IntentCardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 36px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const IntentCard = styled(motion.div)`
  background: #ffffff;
  border: 2px solid ${props => props.$borderColor || '#e2e8f0'};
  border-radius: 20px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: ${props =>
    props.$featured
      ? '0 16px 36px -10px rgba(37, 99, 235, 0.14)'
      : '0 6px 20px -6px rgba(15, 23, 42, 0.06)'};
  transition: all 0.22s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    border-color: ${props => props.$hoverBorder || '#2563eb'};
    box-shadow: 0 18px 40px -10px rgba(37, 99, 235, 0.18);
  }
`;

const IntentBadgeRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 18px;
`;

const IntentIconBox = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: ${props => props.$bg || '#eff6ff'};
  border: 1px solid ${props => props.$border || '#bfdbfe'};
  color: ${props => props.$color || '#2563eb'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
`;

const IntentStepTag = styled.span`
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 5px 11px;
  border-radius: 999px;
  background: ${props => props.$bg || '#eff6ff'};
  color: ${props => props.$color || '#1d4ed8'};
  border: 1px solid ${props => props.$border || '#bfdbfe'};
`;

const QuickChipsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 16px 0 22px;
`;

const QuickChip = styled.button`
  padding: 6px 11px;
  border-radius: 8px;
  font-size: 0.76rem;
  font-weight: 700;
  background: #f8fafc;
  color: #334155;
  border: 1px solid #cbd5e1;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #eff6ff;
    color: #1d4ed8;
    border-color: #93c5fd;
  }
`;

const IntentActionBtn = styled.button`
  width: 100%;
  padding: 13px 18px;
  border-radius: 12px;
  border: ${props => (props.$primary ? 'none' : '1px solid #cbd5e1')};
  background: ${props =>
    props.$primary
      ? 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)'
      : props.$accentBg || '#f8fafc'};
  color: ${props => (props.$primary ? '#ffffff' : props.$accentColor || '#1e293b')};
  font-size: 0.92rem;
  font-weight: 800;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.95;
    transform: translateY(-1px);
  }
`;

const RecentDossiersStrip = styled.div`
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 16px;
  padding: 18px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);
`;

const DossierMiniCard = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 14px;
  border-radius: 10px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  text-align: left;
  transition: all 0.15s ease;

  &:hover {
    background: #eff6ff;
    border-color: #93c5fd;
  }

  .customer {
    font-size: 0.82rem;
    font-weight: 800;
    color: #1e293b;
    display: block;
  }

  .meta {
    font-size: 0.7rem;
    color: #64748b;
    font-weight: 600;
  }

  .score-badge {
    font-size: 0.72rem;
    font-weight: 800;
    padding: 3px 8px;
    border-radius: 999px;
    background: #ecfdf5;
    color: #047857;
    border: 1px solid #a7f3d0;
  }
`;

const Section = styled.section`
  width: 100%;
  max-width: 1360px;
  margin: 0 auto;
  padding: 64px clamp(16px, 3vw, 48px);
  box-sizing: border-box;
`;

const SectionHeader = styled.div`
  text-align: center;
  max-width: 820px;
  margin: 0 auto 44px;

  h2 {
    font-size: 2.15rem;
    font-weight: 850;
    color: #1e293b;
    margin-bottom: 12px;
    letter-spacing: -0.02em;
  }

  p {
    font-size: 1.05rem;
    color: #64748b;
    line-height: 1.65;
    margin: 0;
  }
`;

const GroundingBanner = styled.div`
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.05);
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 14px;
  margin-top: 20px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const SkillCard = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-top: 3px solid ${props => props.$accent || '#2563eb'};
  border-radius: 12px;
  padding: 16px;

  .skill-step {
    font-size: 0.68rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: ${props => props.$accent || '#2563eb'};
    margin-bottom: 6px;
  }

  .skill-title {
    font-size: 0.88rem;
    font-weight: 800;
    color: #1e293b;
    margin-bottom: 6px;
  }

  .skill-id {
    font-family: monospace;
    font-size: 0.68rem;
    color: #475569;
    background: #ffffff;
    border: 1px solid #cbd5e1;
    padding: 2px 6px;
    border-radius: 4px;
    display: inline-block;
    margin-bottom: 8px;
  }

  .skill-desc {
    font-size: 0.76rem;
    color: #64748b;
    line-height: 1.45;
  }
`;

const FactorsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-top: 20px;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

const FactorBox = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 14px 16px;
  display: flex;
  align-items: flex-start;
  gap: 12px;

  .factor-badge {
    padding: 4px 8px;
    border-radius: 6px;
    background: #eff6ff;
    color: #1d4ed8;
    border: 1px solid #bfdbfe;
    font-size: 0.7rem;
    font-weight: 800;
    flex-shrink: 0;
  }

  .factor-title {
    font-size: 0.84rem;
    font-weight: 800;
    color: #1e293b;
    margin-bottom: 3px;
  }

  .factor-text {
    font-size: 0.76rem;
    color: #64748b;
    line-height: 1.45;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  align-items: stretch;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled(motion.div)`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 28px;
  transition: all 0.25s ease;

  &:hover {
    border-color: #cbd5e1;
    box-shadow: 0 10px 30px rgba(15, 23, 42, 0.07);
    transform: translateY(-3px);
  }
`;

const PillarCard = styled(Card)`
  height: 100%;
  display: flex;
  flex-direction: column;

  .pillar-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 14px;

    .icon {
      font-size: 1.85rem;
    }

    h3 {
      font-size: 1.15rem;
      font-weight: 800;
      color: #1e293b;
      margin: 0;
    }
  }

  .pillar-desc {
    font-size: 0.9rem;
    color: #64748b;
    margin-bottom: 18px;
    line-height: 1.55;
  }

  .dimensions-label {
    font-size: 0.72rem;
    font-weight: 700;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 8px;
  }

  .dimensions {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    flex: 1;
    align-content: flex-start;
  }

  .dimension-tag {
    font-size: 0.76rem;
    padding: 5px 10px;
    background: #f1f5f9;
    color: #475569;
    border-radius: 6px;
    border: 1px solid #e2e8f0;
    height: fit-content;
  }

  .explore-btn {
    margin-top: 18px;
    width: 100%;
    padding: 10px 14px;
    background: #f8fafc;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    font-size: 0.84rem;
    font-weight: 700;
    color: #1d4ed8;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: #eff6ff;
      border-color: #93c5fd;
    }
  }
`;

const CTABand = styled.div`
  background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
  padding: 64px 24px;
  text-align: center;
`;

const CTAContent = styled.div`
  max-width: 780px;
  margin: 0 auto;

  h2 {
    font-size: 2.2rem;
    font-weight: 850;
    color: #ffffff;
    margin-bottom: 14px;
    letter-spacing: -0.02em;
  }

  p {
    font-size: 1.05rem;
    color: rgba(255, 255, 255, 0.92);
    margin-bottom: 28px;
    line-height: 1.6;
  }
`;

const CTAButton = styled(motion.button)`
  padding: 16px 34px;
  background: #ffffff;
  color: #1d4ed8;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 800;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.18);
`;

// =======================
// DATA CONSTANTS
// =======================

const RECENT_DOSSIERS = [
  {
    id: 'inst-quantum-fintech-001',
    customer: 'Quantum FinTech',
    blueprint: 'Regulated Cloud & FinTech Blueprint',
    score: '74% (Level 4)',
    updated: 'Verified • 52/60 Auto-Filled'
  },
  {
    id: 'inst-connectplus-telecom-002',
    customer: 'ConnectPlus Telecom',
    blueprint: 'Enterprise Data & AI Maturity (60Q)',
    score: '68% (Level 3)',
    updated: 'Verified • 3-Yr ROI $4.2M'
  },
  {
    id: 'inst-bionova-rwe-003',
    customer: 'BioNova Therapeutics',
    blueprint: 'GxP & Clinical Data Readiness',
    score: '81% (Level 4)',
    updated: 'Verified • GxP Grounded'
  },
  {
    id: 'inst-talentpulse-euai-004',
    customer: 'TalentPulse HR AI',
    blueprint: 'EU AI Act Annex III Compliance',
    score: '79% (Conformant)',
    updated: 'Verified • Annex IV Dossier'
  }
];

const SCOREX_SKILLS = [
  {
    step: 'Skill 1 • Multi-Source Ingest',
    title: 'Multi-Source Evidence Ingestor',
    id: 'scorex-multisource-evidence-ingestor',
    accent: '#2563eb',
    desc: 'Ingests Salesforce (ACC-...), Buganizer (b/...), Email/Chat threads & PDFs/Spreadsheets with SHA-256 locators and Tier A/B/C tags.'
  },
  {
    step: 'Skill 2 • Diagram Decompiler',
    title: 'Diagram Topology Decompiler',
    id: 'scorex-diagram-topology-decompiler',
    accent: '#7c3aed',
    desc: 'Decompiles architecture diagrams (.png/.pdf/.drawio) into verified GCP services, HA/DR zones, VPC-SC perimeters & SPOF detections.'
  },
  {
    step: 'Skill 3 • Anti-Hallucination Scorer',
    title: 'Grounded Rubric Scorer',
    id: 'scorex-grounded-rubric-scorer',
    accent: '#059669',
    desc: 'Enforces the 6 Grounding Factors: verbatim quotes, Tier A > Tier C conflict resolution, and mandatory abstention when evidence < 0.75.'
  },
  {
    step: 'Skill 4 • CFO ROI Modeler',
    title: 'CFO Value Realization Calculator',
    id: 'scorex-cfo-value-realization-calculator',
    accent: '#d97706',
    desc: 'Applies Evidence-Tier Risk Discounts (100% Tier A, 85% Tier B, 65% Tier C, 0% Abstained) for board-ready 3-Year NPV & Payback.'
  },
  {
    step: 'Skill 5 • Forensic Gate',
    title: 'Omni Forensic Critic Gate',
    id: 'scorex-omni-forensic-critic',
    accent: '#dc2626',
    desc: 'Independent cross-model audit certifying zero ungrounded scores and rendering the Question-by-Question Audit Ledger in Tab 4.'
  }
];

const GROUNDING_FACTORS = [
  {
    code: 'GF-1',
    title: 'Source Authority & Freshness Tiering (Tier A / B / C)',
    text: 'Architecture diagrams, Terraform & Buganizer telemetry (Tier A) outrank Salesforce notes (Tier B) and unverified email claims (Tier C).'
  },
  {
    code: 'GF-2',
    title: 'Mandatory Verbatim Quote + Exact Locator',
    text: 'Every auto-selected rubric score requires a verbatim excerpt and clickable source coordinate (e.g., b/349102411#comment4 or Slide 4 bbox).'
  },
  {
    code: 'GF-3',
    title: 'Rubric Anchor Semantic Entailment',
    text: 'Scores are never chosen by keyword overlap alone—evidence must prove the specific SLA, RTO/RPO, or automation cadence required by Level 1–5.'
  },
  {
    code: 'GF-4',
    title: 'Deterministic Contradiction Resolution (Tier A > Tier C)',
    text: 'When email notes claim "multi-region active-active" but the diagram or Buganizer ticket shows single-region us-central1, Tier A wins automatically.'
  },
  {
    code: 'GF-5',
    title: 'Strict Abstention Gate ("Needs Human Input")',
    text: 'If grounding confidence is below 0.75 or evidence is missing, ScoreX refuses to guess and flags the question for live discovery.'
  },
  {
    code: 'GF-6',
    title: 'Cross-Model Generator vs. Forensic Judge',
    text: 'gemini-3.8-flash extracts candidate answers while gemini-3.1-pro-preview + google-omni-1.1 audit and reject any ungrounded inference.'
  }
];

// =======================
// COMPONENT
// =======================

const HomePageNew = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.scrollTo) {
      setTimeout(() => {
        const element = document.getElementById(location.state.scrollTo);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [location]);

  return (
    <PageContainer>
      {/* 5-Step Guided Journey Ribbon */}
      <JourneyRibbon>
        <JourneyRibbonInner>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', fontWeight: 800, color: '#334155' }}>
            <FiLayers color="#2563eb" /> YOUR 4-STEP SCOREX WORKFLOW:
          </div>
          <JourneyStepsList>
            <JourneyStepPill $active onClick={() => navigate('/assessments?view=blueprints')}>
              <span className="step-num">1</span> Pick Assessment Blueprint
            </JourneyStepPill>
            <span style={{ color: '#94a3b8', fontWeight: 700 }}>→</span>
            <JourneyStepPill onClick={() => navigate('/start')}>
              <span className="step-num">2</span> Customer & Multi-Source Grounded Intake
            </JourneyStepPill>
            <span style={{ color: '#94a3b8', fontWeight: 700 }}>→</span>
            <JourneyStepPill onClick={() => navigate('/assessments/run/enterprise_360')}>
              <span className="step-num">3</span> Guided Assessment (Auto-Fill + Verify)
            </JourneyStepPill>
            <span style={{ color: '#94a3b8', fontWeight: 700 }}>→</span>
            <JourneyStepPill onClick={() => navigate('/assessments/report/inst-quantum-fintech-001')}>
              <span className="step-num">4</span> Complete 4-Tab Executive Report
            </JourneyStepPill>
          </JourneyStepsList>
        </JourneyRibbonInner>
      </JourneyRibbon>

      {/* Clean Light-Mode Hero + 3 Primary Intent Gateway */}
      <HeroSection>
        <HeroContainer>
          <HeroTopRow>
            <div className="eyebrow">
              <FiShield size={14} /> Zero-Hallucination Enterprise Architecture & Value Platform
            </div>
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              How would you like to begin today?
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
            >
              Choose a reusable assessment blueprint, resume a saved customer dossier, or run a standalone 3-Year CFO Value Realization model—backed by 6 Anti-Hallucination Grounding Factors and 5 specialized ScoreX Skills.
            </motion.p>
          </HeroTopRow>

          {/* 3 Primary Intent Cards */}
          <IntentCardsGrid>
            {/* Intent 1: Start a New Customer Assessment */}
            <IntentCard
              $featured
              $borderColor="#93c5fd"
              $hoverBorder="#2563eb"
              onClick={() => navigate('/assessments?view=blueprints')}
            >
              <div>
                <IntentBadgeRow>
                  <IntentIconBox $bg="#eff6ff" $border="#bfdbfe" $color="#2563eb">
                    📐
                  </IntentIconBox>
                  <IntentStepTag $bg="#eff6ff" $color="#1d4ed8" $border="#bfdbfe">
                    Intent 1 • Most Popular
                  </IntentStepTag>
                </IntentBadgeRow>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 850, color: '#1e293b', margin: '0 0 10px' }}>
                  1. Start a New Customer Assessment
                </h2>
                <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                  Select a reusable industry or technical blueprint, enter your customer profile, and auto-fill answers from Salesforce, Buganizer, Email, or Architecture Diagrams.
                </p>
                <QuickChipsRow onClick={e => e.stopPropagation()}>
                  <QuickChip onClick={() => navigate('/start?blueprint=enterprise_360')}>
                    📊 60Q Data & AI Maturity
                  </QuickChip>
                  <QuickChip onClick={() => navigate('/start?blueprint=quick_15min')}>
                    ⚡ 15-Min Executive Diagnostic
                  </QuickChip>
                  <QuickChip onClick={() => navigate('/eu-ai-compliance')}>
                    🇪🇺 EU AI Act (20Q)
                  </QuickChip>
                  <QuickChip onClick={() => navigate('/assessments/ai-generator')}>
                    ✨ Custom AI Blueprint
                  </QuickChip>
                </QuickChipsRow>
              </div>
              <IntentActionBtn
                $primary
                onClick={e => {
                  e.stopPropagation();
                  navigate('/assessments?view=blueprints');
                }}
              >
                Browse Reusable Blueprints <FiArrowRight size={17} />
              </IntentActionBtn>
            </IntentCard>

            {/* Intent 2: Open Saved Customer Dossiers */}
            <IntentCard
              $borderColor="#a7f3d0"
              $hoverBorder="#059669"
              onClick={() => navigate('/assessments?view=dossiers')}
            >
              <div>
                <IntentBadgeRow>
                  <IntentIconBox $bg="#ecfdf5" $border="#a7f3d0" $color="#059669">
                    📂
                  </IntentIconBox>
                  <IntentStepTag $bg="#ecfdf5" $color="#047857" $border="#a7f3d0">
                    Intent 2 • Resume / Reports
                  </IntentStepTag>
                </IntentBadgeRow>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 850, color: '#1e293b', margin: '0 0 10px' }}>
                  2. Open Saved Customer Dossiers
                </h2>
                <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                  Resume an in-progress customer discovery or open a completed 4-Tab Executive Report with Scorecard, Target Architecture, 3-Year ROI, and Grounding Audit Ledger.
                </p>
                <QuickChipsRow onClick={e => e.stopPropagation()}>
                  <QuickChip onClick={() => navigate('/assessments/report/inst-quantum-fintech-001')}>
                    🏦 Quantum FinTech Report
                  </QuickChip>
                  <QuickChip onClick={() => navigate('/assessments/report/inst-connectplus-telecom-002')}>
                    📡 ConnectPlus Telecom
                  </QuickChip>
                  <QuickChip onClick={() => navigate('/assessments/report/inst-bionova-rwe-003')}>
                    🧬 BioNova GxP Report
                  </QuickChip>
                </QuickChipsRow>
              </div>
              <IntentActionBtn
                $accentBg="#ecfdf5"
                $accentColor="#047857"
                onClick={e => {
                  e.stopPropagation();
                  navigate('/assessments?view=dossiers');
                }}
              >
                View Saved Customer Dossiers <FiFolder size={17} />
              </IntentActionBtn>
            </IntentCard>

            {/* Intent 3: Quick ROI & Value Calculator */}
            <IntentCard
              $borderColor="#fde68a"
              $hoverBorder="#d97706"
              onClick={() => navigate('/ge-value-realization')}
            >
              <div>
                <IntentBadgeRow>
                  <IntentIconBox $bg="#fffbeb" $border="#fde68a" $color="#d97706">
                    💰
                  </IntentIconBox>
                  <IntentStepTag $bg="#fffbeb" $color="#b45309" $border="#fde68a">
                    Intent 3 • Standalone CFO Model
                  </IntentStepTag>
                </IntentBadgeRow>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 850, color: '#1e293b', margin: '0 0 10px' }}>
                  3. Quick ROI & Value Calculator
                </h2>
                <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                  Build a defensible 3-Year CFO Value Realization, TCO & Payback model with Evidence-Tier Risk Discounting—without running a full 60-question assessment first.
                </p>
                <QuickChipsRow onClick={e => e.stopPropagation()}>
                  <QuickChip onClick={() => navigate('/ge-value-realization')}>
                    📈 3-Year NPV & Payback
                  </QuickChip>
                  <QuickChip onClick={() => navigate('/executive-canvas')}>
                    🎯 Executive Value Canvas
                  </QuickChip>
                  <QuickChip onClick={() => navigate('/benchmarks')}>
                    📊 Industry Benchmarks
                  </QuickChip>
                </QuickChipsRow>
              </div>
              <IntentActionBtn
                $accentBg="#fffbeb"
                $accentColor="#b45309"
                onClick={e => {
                  e.stopPropagation();
                  navigate('/ge-value-realization');
                }}
              >
                Open ROI & Value Calculator <FiDollarSign size={17} />
              </IntentActionBtn>
            </IntentCard>
          </IntentCardsGrid>

          {/* Quick-Resume Recent Customer Dossiers Strip */}
          <RecentDossiersStrip>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span
                style={{
                  padding: '5px 10px',
                  borderRadius: '8px',
                  background: '#ecfdf5',
                  color: '#047857',
                  border: '1px solid #a7f3d0',
                  fontSize: '0.75rem',
                  fontWeight: 800
                }}
              >
                ⚡ QUICK JUMP TO COMPLETE REPORT
              </span>
              <span style={{ fontSize: '0.84rem', color: '#475569', fontWeight: 600 }}>
                Inspect a live 4-Tab Customer Executive Report immediately:
              </span>
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {RECENT_DOSSIERS.map(d => (
                <DossierMiniCard
                  key={d.id}
                  onClick={() => navigate(`/assessments/report/${d.id}`)}
                >
                  <div>
                    <span className="customer">{d.customer}</span>
                    <span className="meta">{d.updated}</span>
                  </div>
                  <span className="score-badge">{d.score}</span>
                </DossierMiniCard>
              ))}
            </div>
          </RecentDossiersStrip>
        </HeroContainer>
      </HeroSection>

      {/* 5 ScoreX Domain Skills & 6 Anti-Hallucination Grounding Factors Section */}
      <Section id="grounding-architecture">
        <GroundingBanner>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px', flexWrap: 'wrap' }}>
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  borderRadius: '999px',
                  background: '#ecfdf5',
                  border: '1px solid #a7f3d0',
                  color: '#047857',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  marginBottom: '8px'
                }}
              >
                <FiCheckCircle size={13} /> Multi-Source Anti-Hallucination Architecture
              </div>
              <h2 style={{ fontSize: '1.55rem', fontWeight: 850, color: '#1e293b', margin: '0 0 6px' }}>
                5 Dedicated ScoreX Skills & 6 Anti-Hallucination Grounding Factors
              </h2>
              <p style={{ fontSize: '0.92rem', color: '#475569', margin: 0, maxWidth: '880px', lineHeight: 1.55 }}>
                When auto-filling an assessment from <strong>Salesforce (`ACC-...`)</strong>, <strong>Buganizer (`b/...`)</strong>, <strong>Email/Chat threads</strong>, or uploaded <strong>Architecture Diagrams & PDFs</strong>, ScoreX never guesses. Every auto-filled answer is governed by 5 domain skills and 6 deterministic grounding rules.
              </p>
            </div>
            <button
              onClick={() => navigate('/start')}
              style={{
                padding: '11px 18px',
                borderRadius: '10px',
                background: '#eff6ff',
                border: '1px solid #93c5fd',
                color: '#1d4ed8',
                fontWeight: 800,
                fontSize: '0.84rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <FiCpu size={15} /> Try Multi-Source Grounded Intake →
            </button>
          </div>

          {/* 5 Skills Pipeline */}
          <SkillsGrid>
            {SCOREX_SKILLS.map(s => (
              <SkillCard key={s.id} $accent={s.accent}>
                <div className="skill-step">{s.step}</div>
                <div className="skill-title">{s.title}</div>
                <div className="skill-id">{s.id}</div>
                <div className="skill-desc">{s.desc}</div>
              </SkillCard>
            ))}
          </SkillsGrid>

          {/* 6 Grounding Factors */}
          <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              🛡️ 6 Deterministic Anti-Hallucination Grounding Factors Enforced on Every Question:
            </div>
            <FactorsGrid>
              {GROUNDING_FACTORS.map(f => (
                <FactorBox key={f.code}>
                  <span className="factor-badge">{f.code}</span>
                  <div>
                    <div className="factor-title">{f.title}</div>
                    <div className="factor-text">{f.text}</div>
                  </div>
                </FactorBox>
              ))}
            </FactorsGrid>
          </div>
        </GroundingBanner>
      </Section>

      {/* Assessment Pillars Section */}
      <Section id="pillars" style={{ paddingTop: '16px' }}>
        <SectionHeader>
          <h2>6 Enterprise Assessment Pillars (30 Dimensions)</h2>
          <p>
            Evaluate your enterprise Data, Cloud & Agentic AI maturity across six comprehensive pillars. Every question supports manual input or evidence-grounded auto-fill.
          </p>
        </SectionHeader>

        <Grid>
          <PillarCard>
            <div className="pillar-header">
              <span className="icon">🧱</span>
              <h3>Platform & Governance</h3>
            </div>
            <div className="pillar-desc">
              Assess how well your data & AI platform foundation is secured, scalable, and governed across cloud perimeters.
            </div>
            <div className="dimensions-label">Dimensions:</div>
            <div className="dimensions">
              <span className="dimension-tag">Environment Architecture</span>
              <span className="dimension-tag">Security & Access</span>
              <span className="dimension-tag">Governance & Compliance</span>
              <span className="dimension-tag">Observability & Monitoring</span>
              <span className="dimension-tag">Cost Management</span>
            </div>
            <button className="explore-btn" onClick={() => navigate('/start')}>
              Start with this pillar →
            </button>
          </PillarCard>

          <PillarCard>
            <div className="pillar-header">
              <span className="icon">📊</span>
              <h3>Data Engineering & Integration</h3>
            </div>
            <div className="pillar-desc">
              Evaluate how efficiently data is ingested, transformed, and managed across batch and streaming pipelines.
            </div>
            <div className="dimensions-label">Dimensions:</div>
            <div className="dimensions">
              <span className="dimension-tag">Ingestion Strategy</span>
              <span className="dimension-tag">Lakehouse Architecture</span>
              <span className="dimension-tag">Orchestration</span>
              <span className="dimension-tag">Data Quality</span>
              <span className="dimension-tag">Performance & Scalability</span>
            </div>
            <button className="explore-btn" onClick={() => navigate('/start')}>
              Start with this pillar →
            </button>
          </PillarCard>

          <PillarCard>
            <div className="pillar-header">
              <span className="icon">📈</span>
              <h3>Analytics & BI Modernization</h3>
            </div>
            <div className="pillar-desc">
              Assess how your platform supports governed analytics, semantic layers, query performance, and self-service access.
            </div>
            <div className="dimensions-label">Dimensions:</div>
            <div className="dimensions">
              <span className="dimension-tag">Query Performance</span>
              <span className="dimension-tag">Data Modeling</span>
              <span className="dimension-tag">Visualization & Reporting</span>
              <span className="dimension-tag">Self-Service Enablement</span>
              <span className="dimension-tag">Collaboration & Sharing</span>
            </div>
            <button className="explore-btn" onClick={() => navigate('/start')}>
              Start with this pillar →
            </button>
          </PillarCard>

          <PillarCard>
            <div className="pillar-header">
              <span className="icon">🤖</span>
              <h3>Machine Learning & MLOps</h3>
            </div>
            <div className="pillar-desc">
              Understand how machine learning is leveraged for predictive use cases with automated CI/CD/CT operations.
            </div>
            <div className="dimensions-label">Dimensions:</div>
            <div className="dimensions">
              <span className="dimension-tag">Experimentation & Tracking</span>
              <span className="dimension-tag">Model Deployment</span>
              <span className="dimension-tag">Feature Management</span>
              <span className="dimension-tag">ML Lifecycle Governance</span>
              <span className="dimension-tag">Business Impact</span>
            </div>
            <button className="explore-btn" onClick={() => navigate('/start')}>
              Start with this pillar →
            </button>
          </PillarCard>

          <PillarCard>
            <div className="pillar-header">
              <span className="icon">💡</span>
              <h3>Generative AI & Agentic Capabilities</h3>
            </div>
            <div className="pillar-desc">
              Evaluate readiness to operationalize GenAI, RAG grounding, and multi-agent architectures within your enterprise.
            </div>
            <div className="dimensions-label">Dimensions:</div>
            <div className="dimensions">
              <span className="dimension-tag">GenAI Strategy</span>
              <span className="dimension-tag">Data & Knowledge Readiness</span>
              <span className="dimension-tag">Application Development</span>
              <span className="dimension-tag">Evaluation & Quality Control</span>
              <span className="dimension-tag">Responsible AI</span>
            </div>
            <button className="explore-btn" onClick={() => navigate('/start')}>
              Start with this pillar →
            </button>
          </PillarCard>

          <PillarCard>
            <div className="pillar-header">
              <span className="icon">⚙️</span>
              <h3>Operational Excellence & Adoption</h3>
            </div>
            <div className="pillar-desc">
              Measure organizational readiness, FinOps governance, adoption velocity, and realized value across programs.
            </div>
            <div className="dimensions-label">Dimensions:</div>
            <div className="dimensions">
              <span className="dimension-tag">Center of Excellence</span>
              <span className="dimension-tag">Community of Practice</span>
              <span className="dimension-tag">Training & Enablement</span>
              <span className="dimension-tag">Financial Management</span>
              <span className="dimension-tag">Innovation & Improvement</span>
            </div>
            <button className="explore-btn" onClick={() => navigate('/start')}>
              Start with this pillar →
            </button>
          </PillarCard>
        </Grid>
      </Section>

      {/* CTA Band */}
      <CTABand>
        <CTAContent>
          <h2>Ready to launch an evidence-grounded assessment?</h2>
          <p>
            Pick a reusable blueprint, connect Salesforce/Buganizer/Diagrams or answer interactively, and generate a board-ready 4-Tab Executive Report.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <CTAButton
              onClick={() => navigate('/assessments?view=blueprints')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              1. Pick Assessment Blueprint
              <FiArrowRight size={18} />
            </CTAButton>
            <CTAButton
              onClick={() => navigate('/assessments/report/inst-quantum-fintech-001')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              style={{ background: 'rgba(255,255,255,0.16)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.4)' }}
            >
              <FiFileText size={18} /> Inspect Complete 4-Tab Report
            </CTAButton>
          </div>
        </CTAContent>
      </CTABand>

      {/* Shared Unified Footer */}
      <Footer />
    </PageContainer>
  );
};

export default HomePageNew;
