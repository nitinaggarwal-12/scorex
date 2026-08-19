import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FiArrowLeft, 
  FiTrendingUp, 
  FiTrendingDown, 
  FiArrowRight, 
  FiFileText
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import dynamicAssessmentService from '../services/dynamicAssessmentService';
import DynamicRadarChart from './DynamicRadarChart';
import LoadingSpinner from './LoadingSpinner';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0b0f19 0%, #111827 50%, #171b30 100%);
  color: #f8fafc;
  padding: 108px 48px 80px;
  box-sizing: border-box;

  @media (max-width: 1024px) {
    padding: 96px 24px 60px;
  }

  @media (max-width: 768px) {
    padding: 90px 16px 60px;
  }
`;

const ContentWrap = styled.div`
  max-width: 1600px;
  margin: 0 auto;
`;

const HeaderNav = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
  flex-wrap: wrap;
  gap: 16px;
`;

const BackButton = styled.button`
  background: rgba(30, 41, 59, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #cbd5e1;
  border-radius: 10px;
  padding: 8px 16px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(51, 65, 85, 0.9);
    color: #ffffff;
  }
`;

const HeroCard = styled(motion.div)`
  background: rgba(15, 23, 42, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 32px;
  margin-bottom: 32px;
  backdrop-filter: blur(16px);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
`;

const SelectorRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 20px;
  align-items: center;
  margin-bottom: 28px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const AssessmentSelectBox = styled.div`
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #94a3b8;
    font-weight: 700;
  }

  select {
    background: #0f172a;
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: #ffffff;
    border-radius: 8px;
    padding: 8px 12px;
    font-size: 0.9rem;
    font-weight: 600;
    outline: none;
    cursor: pointer;
  }
`;

const DeltaSummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  margin-top: 24px;
`;

const DeltaMetricCard = styled.div`
  background: rgba(30, 41, 59, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;

  .title {
    font-size: 0.8rem;
    color: #94a3b8;
    font-weight: 600;
  }

  .value-row {
    display: flex;
    align-items: baseline;
    gap: 8px;
  }

  .value {
    font-size: 1.5rem;
    font-weight: 800;
    color: #ffffff;
  }

  .delta-pill {
    font-size: 0.8rem;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 6px;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: ${props => props.$positive ? 'rgba(16, 185, 129, 0.2)' : props.$neutral ? 'rgba(148, 163, 184, 0.2)' : 'rgba(239, 68, 68, 0.2)'};
    color: ${props => props.$positive ? '#34d399' : props.$neutral ? '#94a3b8' : '#f87171'};
    border: 1px solid ${props => props.$positive ? 'rgba(16, 185, 129, 0.4)' : props.$neutral ? 'rgba(148, 163, 184, 0.3)' : 'rgba(239, 68, 68, 0.4)'};
  }
`;

const MatrixTableCard = styled.div`
  background: rgba(15, 23, 42, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 28px;
  margin-bottom: 32px;
  backdrop-filter: blur(16px);
`;

const DimensionRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 2fr;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  gap: 12px;

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
`;

const AssessmentComparisonView = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [allAssessments, setAllAssessments] = useState([]);
  const [baseId, setBaseId] = useState(searchParams.get('base') || '');
  const [targetId, setTargetId] = useState(searchParams.get('target') || '');

  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (baseId && targetId && baseId !== targetId) {
      loadComparison(baseId, targetId);
    }
  }, [baseId, targetId]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const instances = await dynamicAssessmentService.getInstances();
      const validInstances = Array.isArray(instances) ? instances : [];
      setAllAssessments(validInstances);

      const initialBase = searchParams.get('base') || (validInstances[1]?.id || validInstances[0]?.id || '');
      const initialTarget = searchParams.get('target') || (validInstances[0]?.id || '');

      setBaseId(initialBase);
      setTargetId(initialTarget);

      if (initialBase && initialTarget && initialBase !== initialTarget) {
        await loadComparison(initialBase, initialTarget);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load assessment instances');
    } finally {
      setLoading(false);
    }
  };

  const loadComparison = async (bId, tId) => {
    try {
      setLoading(true);
      const result = await dynamicAssessmentService.compareAssessments(bId, tId);
      if (result && result.success) {
        setComparisonData(result);
        setSearchParams({ base: bId, target: tId });
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to calculate progression comparison');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !comparisonData) {
    return <LoadingSpinner message="Calculating quarter-over-quarter maturity progression..." />;
  }

  const hasEnoughAssessments = allAssessments && allAssessments.length >= 2;
  const isSameAssessment = baseId && targetId && baseId === targetId;

  const baseInst = comparisonData?.base?.instance;
  const targetInst = comparisonData?.target?.instance;
  const baseScores = comparisonData?.base?.scores;
  const targetScores = comparisonData?.target?.scores;
  const comparison = comparisonData?.comparison;

  const overallDelta = comparison?.overallDelta || 0;
  const isPositive = overallDelta >= 0;

  return (
    <Container>
      <ContentWrap>
        <HeaderNav>
          <BackButton onClick={() => navigate(-1)}>
            <FiArrowLeft /> Back to Assessments
          </BackButton>

          <div style={{ display: 'flex', gap: '10px' }}>
            {baseInst?.id && (
              <button
                onClick={() => navigate(`/assessments/report/${baseInst.id}`)}
                style={{ background: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(59, 130, 246, 0.3)', color: '#60a5fa', padding: '8px 14px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem' }}
              >
                <FiFileText /> View Base Report
              </button>
            )}
            {targetInst?.id && (
              <button
                onClick={() => navigate(`/assessments/report/${targetInst.id}`)}
                style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34d399', padding: '8px 14px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem' }}
              >
                <FiFileText /> View Target Report
              </button>
            )}
          </div>
        </HeaderNav>

        {/* Assessment Selectors */}
        <HeroCard initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ marginBottom: '20px' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 6px 0', color: '#ffffff' }}>
              Quarter-over-Quarter Assessment Progression Diff
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>
              Compare baseline capabilities against target reassessments to measure architectural transformation velocity.
            </p>
          </div>

          {hasEnoughAssessments ? (
            <SelectorRow>
              <AssessmentSelectBox>
                <label>1. Baseline Assessment (Period A)</label>
                <select value={baseId} onChange={(e) => setBaseId(e.target.value)}>
                  {allAssessments.map(a => (
                    <option key={a.id} value={a.id}>
                      {a.customerName || 'Org'} — {a.useCase || a.frameworkSnapshot?.title} ({new Date(a.createdAt).toLocaleDateString()})
                    </option>
                  ))}
                </select>
              </AssessmentSelectBox>

              <div style={{ textAlign: 'center', color: '#64748b' }}>
                <FiArrowRight size={24} />
              </div>

              <AssessmentSelectBox>
                <label>2. Target Assessment (Period B)</label>
                <select value={targetId} onChange={(e) => setTargetId(e.target.value)}>
                  {allAssessments.map(a => (
                    <option key={a.id} value={a.id}>
                      {a.customerName || 'Org'} — {a.useCase || a.frameworkSnapshot?.title} ({new Date(a.createdAt).toLocaleDateString()})
                    </option>
                  ))}
                </select>
              </AssessmentSelectBox>
            </SelectorRow>
          ) : (
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '12px', padding: '20px', textAlign: 'center', margin: '20px 0' }}>
              <h3 style={{ color: '#f87171', margin: '0 0 8px 0', fontSize: '1.1rem' }}>
                ⚠️ At least two completed assessments are required for comparison
              </h3>
              <p style={{ color: '#cbd5e1', fontSize: '0.85rem', margin: '0 0 16px 0' }}>
                Create or run another assessment instance to compare progress across time periods or architecture domains.
              </p>
              <button
                onClick={() => navigate('/assessments')}
                style={{ background: '#6366f1', color: '#fff', border: 'none', padding: '9px 18px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}
              >
                Go to Assessments Hub
              </button>
            </div>
          )}

          {isSameAssessment && hasEnoughAssessments && (
            <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '10px', padding: '12px 16px', color: '#fbbf24', fontSize: '0.85rem', marginBottom: '16px' }}>
              ℹ️ You have selected the same assessment for both Baseline and Target. Please select two distinct assessments to compute delta progress.
            </div>
          )}

          {comparison && (
            <DeltaSummaryGrid>
              <DeltaMetricCard $positive={isPositive}>
                <span className="title">Baseline Overall Score</span>
                <div className="value-row">
                  <span className="value">{baseScores?.overallScore || '0.0'}</span>
                  <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>/ 5.0</span>
                </div>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{baseScores?.maturityLevel || 'Defined'} Stage</span>
              </DeltaMetricCard>

              <DeltaMetricCard $positive={isPositive}>
                <span className="title">Target Overall Score</span>
                <div className="value-row">
                  <span className="value">{targetScores?.overallScore || '0.0'}</span>
                  <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>/ 5.0</span>
                </div>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{targetScores?.maturityLevel || 'Defined'} Stage</span>
              </DeltaMetricCard>

              <DeltaMetricCard $positive={isPositive} $neutral={overallDelta === 0}>
                <span className="title">Net Maturity Delta</span>
                <div className="value-row">
                  <span className="value" style={{ color: isPositive ? '#34d399' : '#f87171' }}>
                    {overallDelta > 0 ? `+${overallDelta}` : overallDelta}
                  </span>
                  <span className="delta-pill">
                    {isPositive ? <FiTrendingUp /> : <FiTrendingDown />}
                    {overallDelta > 0 ? `+${Math.round((overallDelta / (baseScores?.overallScore || 1)) * 100)}% Growth` : 'Drift'}
                  </span>
                </div>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Across all architecture dimensions</span>
              </DeltaMetricCard>
            </DeltaSummaryGrid>
          )}
        </HeroCard>

        {/* Dynamic Polar Radar Comparison */}
        {targetInst?.frameworkSnapshot?.dimensions && (() => {
          const comparisonRadarScores = {};
          targetInst.frameworkSnapshot.dimensions.forEach(dim => {
            const bScore = baseScores?.dimensionScores?.[dim.id]?.score ?? (parseFloat(baseInst?.responses?.[dim.id]) || 2.5);
            const tScore = targetScores?.dimensionScores?.[dim.id]?.score ?? (parseFloat(targetInst?.responses?.[dim.id]) || 4.0);
            comparisonRadarScores[dim.id] = {
              score: bScore,
              currentScore: bScore,
              targetScore: tScore,
              futureScore: tScore,
              name: dim.name
            };
          });

          return (
            <DynamicRadarChart
              dimensions={targetInst.frameworkSnapshot.dimensions}
              dimensionScores={comparisonRadarScores}
              baselineLabel="Baseline (Period A)"
              targetLabel="Target (Period B)"
              title="Quarter-over-Quarter Polar Comparison Radar"
              subtitle="Comparing Baseline Assessment (Period A) vs Target Assessment (Period B)"
            />
          );
        })()}

        {/* Dimension Breakdown Matrix */}
        {comparison?.dimensionDeltas && (
          <MatrixTableCard>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 16px 0', color: '#ffffff' }}>
              Dimensional Delta Breakdown
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 2fr', padding: '10px 16px', background: 'rgba(30, 41, 59, 0.5)', borderRadius: '10px', fontWeight: 700, fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
              <span>Dimension</span>
              <span>Baseline</span>
              <span>Target</span>
              <span>Delta</span>
              <span>Progression</span>
            </div>

            {comparison.dimensionDeltas.map(dim => {
              const deltaVal = dim.delta || 0;
              const isDimPositive = deltaVal > 0;
              const isDimNeutral = deltaVal === 0;

              return (
                <DimensionRow key={dim.id}>
                  <span style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.9rem' }}>
                    {dim.name}
                  </span>
                  <span style={{ color: '#ef4444', fontWeight: 700, fontSize: '0.9rem' }}>
                    {dim.baseScore} / 5.0
                  </span>
                  <span style={{ color: '#10b981', fontWeight: 700, fontSize: '0.9rem' }}>
                    {dim.targetScore} / 5.0
                  </span>
                  <div>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      background: isDimPositive ? 'rgba(16, 185, 129, 0.2)' : isDimNeutral ? 'rgba(148, 163, 184, 0.15)' : 'rgba(239, 68, 68, 0.2)',
                      color: isDimPositive ? '#34d399' : isDimNeutral ? '#94a3b8' : '#f87171'
                    }}>
                      {deltaVal > 0 ? `+${deltaVal}` : deltaVal}
                    </span>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '6px', height: '8px', overflow: 'hidden', position: 'relative' }}>
                    <div style={{
                      width: `${Math.min(100, Math.max(10, (dim.targetScore / 5) * 100))}%`,
                      background: isDimPositive ? 'linear-gradient(90deg, #3b82f6, #10b981)' : '#ef4444',
                      height: '100%',
                      borderRadius: '6px'
                    }} />
                  </div>
                </DimensionRow>
              );
            })}
          </MatrixTableCard>
        )}
      </ContentWrap>
    </Container>
  );
};

export default AssessmentComparisonView;
