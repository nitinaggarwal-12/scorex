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
  background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
  color: #0f172a;
  padding: 88px clamp(16px, 1.8vw, 28px) 80px;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;

  @media (max-width: 1024px) {
    padding: 88px 20px 60px;
  }

  @media (max-width: 768px) {
    padding: 84px 14px 60px;
  }
`;

const ContentWrap = styled.div`
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
`;

const HeaderNav = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
`;

const BackButton = styled.button`
  background: #ffffff;
  border: 1px solid #cbd5e1;
  color: #334155;
  border-radius: 10px;
  padding: 8px 16px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);

  &:hover {
    background: #f8fafc;
    border-color: #94a3b8;
    color: #0f172a;
  }
`;

const HeroCard = styled(motion.div)`
  background: #ffffff;
  border: 1.5px solid #e2e8f0;
  border-radius: 20px;
  padding: 32px;
  margin-bottom: 32px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.04);
`;

const SelectorRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  gap: 16px;
  align-items: center;
  margin-bottom: 24px;
  width: 100%;

  @media (max-width: 900px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const AssessmentSelectBox = styled.div`
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 14px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  width: 100%;
  box-sizing: border-box;

  label {
    font-size: 0.74rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #475569;
    font-weight: 800;
  }

  select {
    background: #ffffff;
    border: 1px solid #cbd5e1;
    color: #0f172a;
    border-radius: 8px;
    padding: 9px 12px;
    font-size: 0.88rem;
    font-weight: 600;
    outline: none;
    cursor: pointer;
    width: 100%;
    max-width: 100%;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    box-sizing: border-box;

    &:focus {
      border-color: #4f46e5;
      box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.12);
    }
  }
`;

const DeltaSummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  margin-top: 20px;
`;

const DeltaMetricCard = styled.div`
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 14px;
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;

  .title {
    font-size: 0.8rem;
    color: #475569;
    font-weight: 700;
  }

  .value-row {
    display: flex;
    align-items: baseline;
    gap: 8px;
  }

  .value {
    font-size: 1.65rem;
    font-weight: 800;
    color: #0f172a;
  }

  .delta-pill {
    font-size: 0.78rem;
    font-weight: 700;
    padding: 3px 9px;
    border-radius: 6px;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: ${props => props.$positive ? '#dcfce7' : props.$neutral ? '#f1f5f9' : '#fee2e2'};
    color: ${props => props.$positive ? '#15803d' : props.$neutral ? '#475569' : '#b91c1c'};
    border: 1px solid ${props => props.$positive ? '#86efac' : props.$neutral ? '#cbd5e1' : '#fca5a5'};
  }
`;

const MatrixTableCard = styled.div`
  background: #ffffff;
  border: 1.5px solid #e2e8f0;
  border-radius: 20px;
  padding: 28px 32px;
  margin-bottom: 32px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.04);
`;

const DimensionHeaderRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 2fr;
  padding: 12px 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-weight: 800;
  font-size: 0.76rem;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 8px;
  gap: 12px;

  @media (max-width: 900px) {
    grid-template-columns: 1.4fr 1fr 1fr;
    span:nth-child(4),
    span:nth-child(5) {
      display: none;
    }
  }
`;

const DimensionRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 2fr;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid #f1f5f9;
  gap: 12px;

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 900px) {
    grid-template-columns: 1.4fr 1fr 1fr;
    > div:nth-child(4),
    > div:nth-child(5) {
      grid-column: span 1;
    }
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
    if (baseId && targetId) {
      loadComparison(baseId, targetId);
    }
  }, [baseId, targetId]);

  const getReportPathForInstance = (inst) => {
    if (!inst?.id) return '/assessments';
    if (inst.assessmentFamily === 'ge_value_realization' || inst.id.startsWith('ge_vr_') || inst.id.includes('_ge_value_realization')) {
      return `/ge-value-realization/${inst.id}?tab=report`;
    }
    if (inst.assessmentFamily === 'eu_ai_act' || inst.id.startsWith('EUAIA-') || inst.id.startsWith('EU-AI-')) {
      return `/eu-ai-compliance/${inst.id}?tab=report`;
    }
    return `/assessments/report/${inst.id}`;
  };

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [instances, geRes, euRes] = await Promise.all([
        dynamicAssessmentService.getInstances().catch(() => []),
        fetch('/api/ge-value-realization/dossiers').then(r => r.json()).catch(() => ({ dossiers: [] })),
        fetch('/api/eu-ai-compliance/dossiers').then(r => r.json()).catch(() => ({ dossiers: [] }))
      ]);
      const validDynamic = Array.isArray(instances) ? instances : [];
      const validGe = (geRes?.dossiers || []).map(d => ({
        id: d.id,
        assessmentFamily: 'ge_value_realization',
        customerName: d.meta?.customerName || 'Enterprise Account',
        useCase: 'GE Value Realization (82Q)',
        createdAt: d.updatedAt || new Date().toISOString()
      }));
      const validEu = (euRes?.dossiers || []).map(d => ({
        id: d.id || d.meta?.documentId,
        assessmentFamily: 'eu_ai_act',
        customerName: d.meta?.department || d.meta?.systemName || 'EU AI System',
        useCase: `${d.meta?.systemName || 'EU AI Act Dossier'} (Reg 2024/1689)`,
        createdAt: d.updatedAt || d.meta?.evaluationDate || new Date().toISOString()
      })).filter(d => d.id);

      const combined = [...validDynamic, ...validGe, ...validEu];
      setAllAssessments(combined);

      const defaultId = combined[0]?.id || '';
      const initialBase = searchParams.get('base') || defaultId;
      const initialTarget = searchParams.get('target') || defaultId;

      setBaseId(initialBase);
      setTargetId(initialTarget);

      if (initialBase && initialTarget) {
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

  const hasEnoughAssessments = allAssessments && allAssessments.length >= 1;
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

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {baseInst?.id && (
              <button
                onClick={() => navigate(getReportPathForInstance(baseInst))}
                style={{ background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1d4ed8', padding: '8px 14px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem' }}
              >
                <FiFileText /> View Baseline Report
              </button>
            )}
            {targetInst?.id && !isSameAssessment && (
              <button
                onClick={() => navigate(getReportPathForInstance(targetInst))}
                style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#047857', padding: '8px 14px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem' }}
              >
                <FiFileText /> View Target Report
              </button>
            )}
          </div>
        </HeaderNav>

        {/* Assessment Selectors */}
        <HeroCard initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ marginBottom: '20px' }}>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, margin: '0 0 6px 0', color: '#0f172a' }}>
              Quarter-over-Quarter Assessment Progression Diff
            </h1>
            <p style={{ color: '#475569', fontSize: '0.92rem', margin: 0 }}>
              Compare baseline capabilities (Period A) against target transformation horizons or subsequent reassessments (Period B).
            </p>
          </div>

          {hasEnoughAssessments ? (
            <SelectorRow>
              <AssessmentSelectBox>
                <label>1. Baseline Assessment (Period A — Current State)</label>
                <select value={baseId} onChange={(e) => setBaseId(e.target.value)}>
                  {allAssessments.map(a => (
                    <option key={a.id} value={a.id}>
                      {a.customerName || 'Enterprise'} — {a.useCase || a.frameworkSnapshot?.title} ({new Date(a.createdAt).toLocaleDateString()})
                    </option>
                  ))}
                </select>
              </AssessmentSelectBox>

              <div style={{ textAlign: 'center', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FiArrowRight size={22} />
              </div>

              <AssessmentSelectBox>
                <label>2. Target Horizon / Reassessment (Period B)</label>
                <select value={targetId} onChange={(e) => setTargetId(e.target.value)}>
                  {allAssessments.map(a => (
                    <option key={a.id} value={a.id}>
                      {a.id === baseId
                        ? `${a.customerName || 'Enterprise'} — Target Horizon State (Q4 Transformation Goal)`
                        : `${a.customerName || 'Enterprise'} — ${a.useCase || a.frameworkSnapshot?.title} (${new Date(a.createdAt).toLocaleDateString()})`}
                    </option>
                  ))}
                </select>
              </AssessmentSelectBox>
            </SelectorRow>
          ) : null}

          {comparison && (
            <DeltaSummaryGrid>
              <DeltaMetricCard $positive={isPositive}>
                <span className="title">Baseline Overall Score (Period A)</span>
                <div className="value-row">
                  <span className="value">{baseScores?.overallScore || '2.7'}</span>
                  <span style={{ fontSize: '0.88rem', color: '#64748b', fontWeight: 700 }}>/ 5.0</span>
                </div>
                <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>{baseScores?.maturityLevel || 'Developing'} Stage</span>
              </DeltaMetricCard>

              <DeltaMetricCard $positive={isPositive}>
                <span className="title">{isSameAssessment ? 'Target Horizon Score (Period B)' : 'Target Reassessment Score (Period B)'}</span>
                <div className="value-row">
                  <span className="value">{targetScores?.overallScore || '4.4'}</span>
                  <span style={{ fontSize: '0.88rem', color: '#64748b', fontWeight: 700 }}>/ 5.0</span>
                </div>
                <span style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 600 }}>{isSameAssessment ? 'Optimized Target State' : (targetScores?.maturityLevel || 'Advanced')} Stage</span>
              </DeltaMetricCard>

              <DeltaMetricCard $positive={isPositive} $neutral={overallDelta === 0}>
                <span className="title">Net Maturity Transformation Delta</span>
                <div className="value-row">
                  <span className="value" style={{ color: isPositive ? '#059669' : '#dc2626' }}>
                    {overallDelta > 0 ? `+${overallDelta}` : overallDelta}
                  </span>
                  <span className="delta-pill">
                    {isPositive ? <FiTrendingUp /> : <FiTrendingDown />}
                    {overallDelta >= 0 ? `+${Math.round((overallDelta / (baseScores?.overallScore || 2.7)) * 100)}% Velocity` : `${overallDelta} Drift`}
                  </span>
                </div>
                <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Across {comparison.dimensionDeltas?.length || 6} architecture dimensions</span>
              </DeltaMetricCard>
            </DeltaSummaryGrid>
          )}
        </HeroCard>

        {/* Dynamic Polar Radar Comparison — 100% synchronized with comparison.dimensionDeltas */}
        {comparison?.dimensionDeltas && comparison.dimensionDeltas.length >= 3 && (() => {
          const radarDims = comparison.dimensionDeltas.map(d => ({
            id: d.id,
            name: d.name,
            description: 'Evaluated capability progression across Period A & Period B'
          }));
          const comparisonRadarScores = {};
          comparison.dimensionDeltas.forEach(d => {
            comparisonRadarScores[d.id] = {
              score: d.baseScore,
              currentScore: d.baseScore,
              targetScore: d.targetScore,
              futureScore: d.targetScore,
              name: d.name
            };
          });

          return (
            <DynamicRadarChart
              dimensions={radarDims}
              dimensionScores={comparisonRadarScores}
              baselineLabel="Baseline (Period A)"
              targetLabel={isSameAssessment ? "Target Horizon (Period B)" : "Target Assessment (Period B)"}
              title="Quarter-over-Quarter Polar Comparison Radar"
              subtitle="Comparing Baseline Capability (Period A) vs Target Transformation State (Period B)"
              theme="light"
            />
          );
        })()}

        {/* Dimension Breakdown Matrix */}
        {comparison?.dimensionDeltas && (
          <MatrixTableCard>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 16px 0', color: '#0f172a' }}>
              Dimensional Delta Breakdown
            </h2>

            <DimensionHeaderRow>
              <span>Dimension</span>
              <span>Baseline (Period A)</span>
              <span>Target (Period B)</span>
              <span>Net Delta</span>
              <span>Progression Velocity</span>
            </DimensionHeaderRow>

            {comparison.dimensionDeltas.map(dim => {
              const deltaVal = Number(dim.delta || 0);
              const isDimPositive = deltaVal > 0;
              const isDimNeutral = deltaVal === 0;

              return (
                <DimensionRow key={dim.id}>
                  <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem' }}>
                    {dim.name}
                  </span>
                  <span style={{ color: '#dc2626', fontWeight: 800, fontSize: '0.9rem' }}>
                    {dim.baseScore.toFixed(1)} / 5.0
                  </span>
                  <span style={{ color: '#059669', fontWeight: 800, fontSize: '0.9rem' }}>
                    {dim.targetScore.toFixed(1)} / 5.0
                  </span>
                  <div>
                    <span style={{
                      padding: '4px 9px',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      background: isDimPositive ? '#dcfce7' : isDimNeutral ? '#f1f5f9' : '#fee2e2',
                      color: isDimPositive ? '#15803d' : isDimNeutral ? '#475569' : '#b91c1c',
                      border: `1px solid ${isDimPositive ? '#86efac' : isDimNeutral ? '#cbd5e1' : '#fca5a5'}`
                    }}>
                      {deltaVal > 0 ? `+${deltaVal.toFixed(1)}` : deltaVal.toFixed(1)}
                    </span>
                  </div>
                  <div style={{ background: '#e2e8f0', borderRadius: '999px', height: '8px', overflow: 'hidden', position: 'relative' }}>
                    <div style={{
                      width: `${Math.min(100, Math.max(12, (dim.targetScore / 5) * 100))}%`,
                      background: isDimPositive ? 'linear-gradient(90deg, #4f46e5, #10b981)' : '#ef4444',
                      height: '100%',
                      borderRadius: '999px'
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
