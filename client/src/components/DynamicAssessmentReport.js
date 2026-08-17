import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiAward, 
  FiCheckCircle, 
  FiAlertTriangle, 
  FiTrendingUp, 
  FiCalendar, 
  FiClock, 
  FiShare2, 
  FiDownload, 
  FiLayers, 
  FiArrowLeft,
  FiUser,
  FiFileText,
  FiList,
  FiTarget,
  FiCheck,
  FiSliders
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import toast from 'react-hot-toast';
import dynamicAssessmentService from '../services/dynamicAssessmentService';
import LoadingSpinner from './LoadingSpinner';
import ScenarioSimulator from './ScenarioSimulator';
import FinancialImpactCard from './FinancialImpactCard';
import ArchitectureComparisonDiagram from './ArchitectureComparisonDiagram';
import MultiPersonaViews from './MultiPersonaViews';
import BacklogExporterCard from './BacklogExporterCard';
import IaCBlueprintCard from './IaCBlueprintCard';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0b0f19 0%, #111827 50%, #171b30 100%);
  color: #f3f4f6;
  padding: 108px 36px 60px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 92px 16px 40px;
  }
`;

const Wrapper = styled.div`
  max-width: 1560px;
  margin: 0 auto;
  width: 100%;
`;

const PromoteBanner = styled.div`
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(168, 85, 247, 0.25) 100%);
  border: 1.5px solid rgba(139, 92, 246, 0.5);
  border-radius: 20px;
  padding: 24px 32px;
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    padding: 20px 16px;
    flex-direction: column;
    align-items: stretch;
  }
`;

const PromoteInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const SparkleIconWrap = styled.div`
  background: linear-gradient(135deg, #6366f1, #a855f7);
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.4rem;
  flex-shrink: 0;
`;

const PromoteBtn = styled.button`
  background: linear-gradient(135deg, #6366f1, #a855f7);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4);
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 48px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 25px rgba(99, 102, 241, 0.6);
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const HeroCard = styled.div`
  background: rgba(30, 41, 59, 0.7);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 40px;
  margin-bottom: 32px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    padding: 20px 16px;
    border-radius: 18px;
  }
`;

const HeroHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
  flex-wrap: wrap;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
  }
`;

const HeroBadge = styled.span`
  background: rgba(56, 189, 248, 0.15);
  border: 1px solid rgba(56, 189, 248, 0.3);
  color: #38bdf8;
  padding: 6px 16px;
  border-radius: 9999px;
  font-size: 0.85rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
`;

const HeroTitle = styled.h1`
  font-size: 2.4rem;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 8px;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

const HeroMeta = styled.div`
  display: flex;
  gap: 20px;
  color: #94a3b8;
  font-size: 0.95rem;
  flex-wrap: wrap;

  span {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  strong {
    color: #e2e8f0;
  }
`;

const ScoreSection = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 24px 32px;

  @media (max-width: 768px) {
    padding: 16px 20px;
    width: 100%;
    box-sizing: border-box;
    justify-content: space-between;
  }
`;

const ScoreBig = styled.div`
  font-size: 3.5rem;
  font-weight: 900;
  background: linear-gradient(135deg, #38bdf8 0%, #818cf8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const LevelBadge = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  color: #38bdf8;
  margin-bottom: 4px;
`;

const TwoColGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  margin-bottom: 32px;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const Card = styled.div`
  background: rgba(30, 41, 59, 0.6);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 32px;

  @media (max-width: 768px) {
    padding: 20px 16px;
    border-radius: 18px;
  }
`;

const CardTitle = styled.h2`
  font-size: 1.4rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ExecutiveSummaryText = styled.div`
  color: #cbd5e1;
  font-size: 1.05rem;
  line-height: 1.7;

  p {
    margin-bottom: 16px;
  }
`;

const DimensionBarRow = styled.div`
  margin-bottom: 20px;
`;

const DimHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: 0.95rem;
  font-weight: 600;
  color: #e2e8f0;
`;

const ProgressBarTrack = styled.div`
  width: 100%;
  height: 10px;
  background: rgba(15, 23, 42, 0.7);
  border-radius: 9999px;
  overflow: hidden;
`;

const ProgressBarFill = styled.div`
  height: 100%;
  width: ${props => props.$pct}%;
  background: linear-gradient(90deg, #38bdf8, #818cf8);
  border-radius: 9999px;
  transition: width 0.8s ease;
`;

const CalloutBox = styled.div`
  background: ${props => props.$type === 'strength' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)'};
  border: 1px solid ${props => props.$type === 'strength' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'};
  border-radius: 14px;
  padding: 16px 20px;
  margin-bottom: 12px;
  color: ${props => props.$type === 'strength' ? '#6ee7b7' : '#fca5a5'};
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 0.95rem;
  line-height: 1.5;

  svg {
    font-size: 1.2rem;
    flex-shrink: 0;
    margin-top: 2px;
  }
`;

const RoadmapGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-top: 20px;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const RoadmapCard = styled.div`
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 18px;
  padding: 24px;
`;

const RoadmapPhase = styled.div`
  font-size: 0.8rem;
  font-weight: 700;
  color: #38bdf8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 6px;
`;

const RoadmapTimeline = styled.div`
  font-size: 1.15rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 12px;
`;

const MilestoneList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const MilestoneItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 0.9rem;
  color: #cbd5e1;
  line-height: 1.4;

  svg {
    color: #10b981;
    margin-top: 3px;
    flex-shrink: 0;
  }
`;

const RecommendationCard = styled.div`
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  padding: 24px;
  margin-bottom: 16px;
`;

const RecHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  gap: 16px;
`;

const RecTitle = styled.h3`
  font-size: 1.15rem;
  font-weight: 700;
  color: #ffffff;
`;

const PriorityBadge = styled.span`
  background: ${props => props.$priority === 'Critical' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)'};
  color: ${props => props.$priority === 'Critical' ? '#f87171' : '#fbbf24'};
  border: 1px solid ${props => props.$priority === 'Critical' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(245, 158, 11, 0.4)'};
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
`;

const DynamicAssessmentReport = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [instance, setInstance] = useState(null);
  const [report, setReport] = useState(null);
  const [framework, setFramework] = useState(null);
  const [isPromoted, setIsPromoted] = useState(false);
  const [showSimulator, setShowSimulator] = useState(false);
  const [simulatedTargets, setSimulatedTargets] = useState(null);

  useEffect(() => {
    loadReport();
  }, [id]);

  const loadReport = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const inst = await dynamicAssessmentService.getInstance(id);
      if (inst && inst.frameworkSnapshot) {
        setInstance(inst);
        setFramework(inst.frameworkSnapshot);
        if (inst.aiReport) {
          setReport(inst.aiReport);
        } else {
          try {
            const genRes = await dynamicAssessmentService.generateReport(id);
            if (genRes && genRes.report) {
              setReport(genRes.report);
            } else {
              setLoadError('Report could not be generated for this assessment.');
            }
          } catch (genErr) {
            setLoadError('Report generation failed. Please re-run the assessment.');
          }
        }
      } else {
        setLoadError('Assessment report was not found or has expired.');
      }
    } catch (err) {
      console.error(err);
      setLoadError(err.response?.data?.error || 'Failed to load assessment report. The session may have expired.');
    } finally {
      setLoading(false);
    }
  };

  const handlePromoteFramework = async () => {
    if (!instance?.id) return;
    try {
      toast.loading('Promoting assessment type to navbar...', { id: 'promote-type' });
      const res = await dynamicAssessmentService.promoteInstanceAsType(instance.id, {
        title: framework?.title,
        badge: framework?.badge || 'Custom',
        color: framework?.color || '#6366f1'
      });

      if (res.success) {
        setIsPromoted(true);
        toast.success(`"${framework?.title}" promoted! Now available under Assessments.`, { id: 'promote-type' });
        window.dispatchEvent(new Event('assessment-types-updated'));
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to promote assessment type', { id: 'promote-type' });
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading executive AI report..." />;
  }

  if (loadError || !instance || !report) {
    return (
      <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Wrapper style={{ maxWidth: '680px', textAlign: 'center' }}>
          <div style={{ background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '40px 32px', backdropFilter: 'blur(16px)', boxShadow: '0 20px 50px rgba(0,0,0,0.4)' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: 'rgba(239, 68, 68, 0.15)', border: '1.5px solid rgba(239, 68, 68, 0.4)', color: '#f87171', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '2rem' }}>
              <FiAlertTriangle />
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#ffffff', marginBottom: '12px' }}>
              Assessment Report Not Found
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '28px' }}>
              {loadError || 'This assessment report is no longer available or was generated in a previous session.'}
              <br />
              You can launch an instant pre-calculated sample report or run a new assessment.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px', textAlign: 'left' }}>
              <button 
                onClick={async () => {
                  try {
                    toast.loading('Generating sample FinOps report...', { id: 'sample-gen' });
                    const res = await dynamicAssessmentService.generateSampleInstance('finops_cloud_cost_optimization');
                    await dynamicAssessmentService.generateReport(res.instanceId);
                    toast.dismiss('sample-gen');
                    navigate(`/assessments/report/${res.instanceId}`);
                  } catch (e) {
                    navigate('/assessments/run/finops_cloud_cost_optimization');
                  }
                }}
                style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '16px', color: '#ffffff', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '4px' }}
              >
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#38bdf8' }}>💰 FinOps Sample Report</span>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Instant 1-Click Launch</span>
              </button>

              <button 
                onClick={async () => {
                  try {
                    toast.loading('Generating sample Gemini report...', { id: 'sample-gen' });
                    const res = await dynamicAssessmentService.generateSampleInstance('openai_to_gemini_enterprise_migration');
                    await dynamicAssessmentService.generateReport(res.instanceId);
                    toast.dismiss('sample-gen');
                    navigate(`/assessments/report/${res.instanceId}`);
                  } catch (e) {
                    navigate('/assessments/run/openai_to_gemini_enterprise_migration');
                  }
                }}
                style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '16px', color: '#ffffff', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '4px' }}
              >
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#a855f7' }}>🤖 OpenAI to Gemini Report</span>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Instant 1-Click Launch</span>
              </button>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => navigate('/assessments')}
                style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: '#ffffff', border: 'none', borderRadius: '12px', padding: '12px 24px', fontWeight: 700, cursor: 'pointer' }}
              >
                View All Assessments Hub
              </button>
            </div>
          </div>
        </Wrapper>
      </Container>
    );
  }

  const scores = report.calculatedScores || {
    overallScore: instance.totalScore || 0,
    maturityLevel: instance.maturityLevel || 'Defined',
    dimensionScores: instance.scores || {}
  };

  const dimensionScoresForSimulator = {};
  if (framework && framework.dimensions) {
    framework.dimensions.forEach(dim => {
      const dScore = scores.dimensionScores?.[dim.id] || {};
      dimensionScoresForSimulator[dim.id] = {
        name: dim.name,
        current: typeof dScore.score === 'number' ? dScore.score : (instance.responses?.[`${dim.id}_current`] || 2.5),
        future: simulatedTargets?.[dim.id] || (typeof dScore.targetScore === 'number' ? dScore.targetScore : 4.0)
      };
    });
  }

  return (
    <Container>
      <Wrapper>
        {/* Navigation back & action controls */}
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <button 
            style={{ background: 'transparent', border: 'none', color: '#94a3b8', display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.95rem' }}
            onClick={() => navigate('/assessments')}
          >
            <FiArrowLeft /> Back to Assessments
          </button>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button 
              style={{ background: showSimulator ? '#4f46e5' : 'rgba(99, 102, 241, 0.25)', border: '1px solid rgba(139, 92, 246, 0.5)', color: '#c084fc', padding: '8px 18px', borderRadius: '10px', display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '700' }}
              onClick={() => setShowSimulator(!showSimulator)}
            >
              <FiSliders /> {showSimulator ? 'Hide What-If Simulator' : '🎛️ What-If Scenario Simulator'}
            </button>

            <button 
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '8px 18px', borderRadius: '10px', display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
              onClick={() => window.print()}
            >
              <FiDownload /> Export / Print Report
            </button>
          </div>
        </div>

        {/* Interactive What-If Scenario Simulator */}
        <AnimatePresence>
          {showSimulator && Object.keys(dimensionScoresForSimulator).length > 0 && (
            <ScenarioSimulator
              initialScores={dimensionScoresForSimulator}
              onSimulateChange={(newTargets) => setSimulatedTargets(newTargets)}
              isDynamic={true}
            />
          )}
        </AnimatePresence>

        {/* Promote to Assessment Type Banner */}
        <PromoteBanner>
          <PromoteInfo>
            <SparkleIconWrap>
              <HiSparkles />
            </SparkleIconWrap>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#ffffff', marginBottom: '4px' }}>
                Like this assessment framework?
              </h3>
              <p style={{ color: '#cbd5e1', fontSize: '0.9rem', margin: 0 }}>
                Promote "{framework?.title}" as an official Assessment Type so it appears in the top navigation for all future client engagements.
              </p>
            </div>
          </PromoteInfo>

          <PromoteBtn onClick={handlePromoteFramework} disabled={isPromoted}>
            {isPromoted ? <FiCheck /> : <FiAward />}
            {isPromoted ? 'Promoted to Navbar' : 'Promote as Assessment Type'}
          </PromoteBtn>
        </PromoteBanner>

        {/* Hero Card */}
        <HeroCard>
          <HeroHeader>
            <div>
              <HeroBadge>
                <FiAward /> {framework?.badge || 'Maturity Assessment'}
              </HeroBadge>
              <HeroTitle>{framework?.title}</HeroTitle>
              <HeroMeta>
                <span><FiUser /> Customer: <strong>{instance.customerName}</strong></span>
                {instance.useCase && <span><FiTarget /> Initiative: <strong>{instance.useCase}</strong></span>}
                <span><FiCalendar /> Completed: <strong>{new Date(instance.completedAt || instance.createdAt).toLocaleDateString()}</strong></span>
                <span><HiSparkles /> Evaluated by: <strong>Gemini 3.7</strong></span>
              </HeroMeta>
            </div>

            <ScoreSection>
              <div>
                <LevelBadge>{scores.maturityLevel} Stage</LevelBadge>
                <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Overall Maturity Index</div>
              </div>
              <ScoreBig>{scores.overallScore}</ScoreBig>
              <div style={{ color: '#64748b', fontSize: '1.2rem', fontWeight: '700' }}>/ 5.0</div>
            </ScoreSection>
          </HeroHeader>
        </HeroCard>

        {/* Quantified Financial & TCO Impact Engine */}
        <FinancialImpactCard
          pillarScores={scores.dimensionScores || {}}
          overallCurrent={scores.overallScore || 2.5}
          overallTarget={4.0}
        />

        {/* Architectural Evolution Blueprint: Current vs Target */}
        <ArchitectureComparisonDiagram
          currentScore={scores.overallScore || 2.5}
          targetScore={4.5}
        />

        {/* Multi-Persona Executive Transformation Blueprints */}
        <MultiPersonaViews
          assessmentName={framework?.title || 'Enterprise Data Platform'}
          currentScore={scores.overallScore || 2.5}
          targetScore={4.5}
        />

        {/* 1-Click Transformation Backlog Exporter */}
        <BacklogExporterCard
          assessmentName={framework?.title || 'Enterprise Data & AI Maturity Assessment'}
          recommendations={report.prioritizedRecommendations || []}
        />

        {/* 1-Click Infrastructure-as-Code (IaC) Cloud Deployer */}
        <IaCBlueprintCard
          organizationName={instance?.customerName || framework?.title || 'Enterprise Platform'}
          currentScore={scores.overallScore || 2.5}
          targetScore={4.5}
        />

        {/* Two Column Section: Executive Summary & Dimension Scores */}
        <TwoColGrid>
          {/* Executive Summary */}
          <Card>
            <CardTitle>
              <FiFileText color="#38bdf8" /> Executive Summary
            </CardTitle>
            <ExecutiveSummaryText>
              {typeof report.executiveSummary === 'string' 
                ? report.executiveSummary.split('\n\n').map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))
                : <p>Assessment evaluation completed successfully.</p>
              }
            </ExecutiveSummaryText>
          </Card>

          {/* Dimension Maturity Breakdown */}
          <Card>
            <CardTitle>
              <FiLayers color="#818cf8" /> Dimension Maturity Breakdown
            </CardTitle>
            {Object.values(scores.dimensionScores || {}).map((dim, idx) => (
              <DimensionBarRow key={dim.id || idx}>
                <DimHeader>
                  <span>{dim.name}</span>
                  <span style={{ color: '#38bdf8' }}>{dim.score} / 5.0 ({dim.percentage}%)</span>
                </DimHeader>
                <ProgressBarTrack>
                  <ProgressBarFill $pct={dim.percentage} />
                </ProgressBarTrack>
              </DimensionBarRow>
            ))}
          </Card>
        </TwoColGrid>

        {/* Strengths & Constraints */}
        <TwoColGrid>
          {/* Strengths */}
          <Card>
            <CardTitle>
              <FiCheckCircle color="#10b981" /> Identified Core Strengths
            </CardTitle>
            {(report.keyStrengths || []).map((str, idx) => (
              <CalloutBox key={idx} $type="strength">
                <FiCheckCircle />
                <div>{str}</div>
              </CalloutBox>
            ))}
          </Card>

          {/* Constraints & Gaps */}
          <Card>
            <CardTitle>
              <FiAlertTriangle color="#ef4444" /> Critical Bottlenecks & Gaps
            </CardTitle>
            {(report.criticalConstraints || []).map((con, idx) => (
              <CalloutBox key={idx} $type="constraint">
                <FiAlertTriangle />
                <div>{con}</div>
              </CalloutBox>
            ))}
          </Card>
        </TwoColGrid>

        {/* Strategic Transformation Roadmap */}
        {report.transformationRoadmap && (
          <Card style={{ marginBottom: '32px' }}>
            <CardTitle>
              <FiTrendingUp color="#38bdf8" /> Strategic Transformation Roadmap
            </CardTitle>

            <RoadmapGrid>
              {['phase1', 'phase2', 'phase3'].map((pKey) => {
                const phase = report.transformationRoadmap[pKey];
                if (!phase) return null;
                return (
                  <RoadmapCard key={pKey}>
                    <RoadmapPhase>{phase.title}</RoadmapPhase>
                    <RoadmapTimeline>{phase.timeline}</RoadmapTimeline>
                    <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '16px' }}>{phase.focus}</p>

                    <MilestoneList>
                      {(phase.milestones || []).map((m, mIdx) => (
                        <MilestoneItem key={mIdx}>
                          <FiCheck size={16} />
                          <span>{m}</span>
                        </MilestoneItem>
                      ))}
                    </MilestoneList>
                  </RoadmapCard>
                );
              })}
            </RoadmapGrid>
          </Card>
        )}

        {/* Prioritized Recommendations */}
        {report.prioritizedRecommendations && report.prioritizedRecommendations.length > 0 && (
          <Card>
            <CardTitle>
              <FiTarget color="#10b981" /> Prioritized High-Impact Action Plan
            </CardTitle>

            {report.prioritizedRecommendations.map((rec, idx) => (
              <RecommendationCard key={rec.id || idx}>
                <RecHeader>
                  <RecTitle>{rec.title}</RecTitle>
                  <PriorityBadge $priority={rec.priority}>{rec.priority || 'High'} Priority</PriorityBadge>
                </RecHeader>

                <p style={{ color: '#cbd5e1', fontSize: '0.95rem', marginBottom: '14px' }}>
                  <strong>Strategic Rationale:</strong> {rec.whyItMatters}
                </p>

                {rec.actionSteps && rec.actionSteps.length > 0 && (
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#94a3b8', marginBottom: '6px' }}>
                      Recommended Action Steps:
                    </div>
                    <ul style={{ paddingLeft: '20px', color: '#cbd5e1', fontSize: '0.9rem', margin: 0 }}>
                      {rec.actionSteps.map((step, sIdx) => (
                        <li key={sIdx} style={{ marginBottom: '4px' }}>{step}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {rec.expectedImpact && (
                  <div style={{ fontSize: '0.85rem', color: '#38bdf8', marginTop: '10px' }}>
                    ⚡ <strong>Expected Impact:</strong> {rec.expectedImpact}
                  </div>
                )}
              </RecommendationCard>
            ))}
          </Card>
        )}
      </Wrapper>
    </Container>
  );
};

export default DynamicAssessmentReport;
