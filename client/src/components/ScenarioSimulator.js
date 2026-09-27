import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiSliders, FiTrendingUp, FiClock, FiShield, FiDollarSign, FiRefreshCw, FiZap } from 'react-icons/fi';

const SimulatorContainer = styled(motion.div)`
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 28px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899);
  }
`;

const SimulatorHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 20px;
`;

const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  .icon-wrap {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 2px 0;
`;

const Subtitle = styled.p`
  font-size: 0.85rem;
  color: #64748b;
  margin: 0;
`;

const PresetsBar = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const PresetButton = styled.button`
  background: ${props => props.$active ? '#3b82f6' : '#f1f5f9'};
  color: ${props => props.$active ? '#ffffff' : '#475569'};
  border: 1px solid ${props => props.$active ? '#2563eb' : '#e2e8f0'};
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.$active ? '#2563eb' : '#e2e8f0'};
    color: ${props => props.$active ? '#ffffff' : '#1e293b'};
  }
`;

const MetricsOverviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 24px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

const MetricCard = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);

  .label {
    font-size: 0.75rem;
    font-weight: 700;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 6px;
  }

  .value {
    font-size: 1.5rem;
    font-weight: 800;
    color: ${props => props.$color || '#1e293b'};
    line-height: 1.1;
    margin-bottom: 2px;
  }

  .subtext {
    font-size: 0.725rem;
    color: #94a3b8;
    font-weight: 500;
  }
`;

const SlidersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SliderCard = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 14px 18px;
`;

const SliderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const PillarName = styled.span`
  font-size: 0.88rem;
  font-weight: 700;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const ScoreBadgeGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8rem;
  font-weight: 700;

  .current {
    color: #64748b;
    background: #f1f5f9;
    padding: 2px 6px;
    border-radius: 4px;
  }
  .arrow {
    color: #94a3b8;
  }
  .target {
    color: #3b82f6;
    background: #eff6ff;
    padding: 2px 8px;
    border-radius: 4px;
    border: 1px solid #bfdbfe;
  }
`;

const RangeInput = styled.input`
  width: 100%;
  -webkit-appearance: none;
  appearance: none;
  height: 6px;
  border-radius: 3px;
  background: #e2e8f0;
  outline: none;
  transition: opacity 0.2s;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #3b82f6;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(59, 130, 246, 0.4);
    transition: transform 0.1s ease;

    &:hover {
      transform: scale(1.2);
    }
  }
`;

const LevelLabels = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.68rem;
  color: #94a3b8;
  margin-top: 4px;
  font-weight: 600;
`;

const ScenarioSimulator = ({ 
  initialScores = {}, 
  onSimulateChange,
  isDynamic = false 
}) => {
  const [targets, setTargets] = useState({});
  const [activePreset, setActivePreset] = useState('custom');

  // Initialize targets from initialScores
  useEffect(() => {
    const defaultTargets = {};
    Object.entries(initialScores).forEach(([key, val]) => {
      const current = typeof val === 'object' ? (val.current || val.currentScore || 2) : 2;
      const future = typeof val === 'object' ? (val.future || val.targetScore || val.futureScore || Math.min(5, current + 1)) : 4;
      defaultTargets[key] = Number(future);
    });
    setTargets(defaultTargets);
  }, [initialScores]);

  const handleSliderChange = (key, val) => {
    setActivePreset('custom');
    const updated = {
      ...targets,
      [key]: Number(val)
    };
    setTargets(updated);
    if (onSimulateChange) onSimulateChange(updated);
  };

  const applyPreset = (presetName) => {
    setActivePreset(presetName);
    const updated = { ...targets };

    Object.entries(initialScores).forEach(([key, val]) => {
      const current = typeof val === 'object' ? Number(val.current || val.currentScore || 2) : 2;

      if (presetName === 'reset') {
        const future = typeof val === 'object' ? Number(val.future || val.targetScore || val.futureScore || Math.min(5, current + 1)) : 4;
        updated[key] = future;
      } else if (presetName === 'balanced') {
        updated[key] = Math.min(5, Number((current + 1.0).toFixed(1)));
      } else if (presetName === 'ai_leader') {
        if (key.includes('genai') || key.includes('machine') || key.includes('generative') || key.includes('ai')) {
          updated[key] = 5.0;
        } else {
          updated[key] = Math.min(5, Number((current + 1.2).toFixed(1)));
        }
      } else if (presetName === 'governance') {
        if (key.includes('platform') || key.includes('gov') || key.includes('operation')) {
          updated[key] = 5.0;
        } else {
          updated[key] = Math.min(5, Number((current + 1.0).toFixed(1)));
        }
      }
    });

    setTargets(updated);
    if (onSimulateChange) onSimulateChange(updated);
  };

  // Calculations
  const keys = Object.keys(initialScores);
  const totalPillars = keys.length || 6;

  let sumCurrent = 0;
  let sumTarget = 0;

  keys.forEach(k => {
    const val = initialScores[k];
    const current = typeof val === 'object' ? Number(val.current || val.currentScore || 2) : 2;
    const target = targets[k] !== undefined ? targets[k] : Math.min(5, current + 1);
    sumCurrent += current;
    sumTarget += target;
  });

  const avgCurrent = totalPillars ? Number((sumCurrent / totalPillars).toFixed(1)) : 2.5;
  const avgTarget = totalPillars ? Number((sumTarget / totalPillars).toFixed(1)) : 4.0;
  const gap = Number(Math.max(0, avgTarget - avgCurrent).toFixed(1));

  // ROI & Timeline Estimations
  const estSavings = Math.round(gap * 180000 + 75000);
  const estMonths = Math.max(2, Math.round(gap * 2.5 + 1.5));
  const estRiskMitigation = Math.min(95, Math.round(gap * 22 + 35));

  return (
    <SimulatorContainer
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <SimulatorHeader>
        <TitleGroup>
          <div className="icon-wrap">
            <FiSliders />
          </div>
          <div>
            <Title>What-If Target Scenario Simulator</Title>
            <Subtitle>
              Interactively adjust pillar target goals to simulate ROI impact, required sprint velocity, and risk mitigation.
            </Subtitle>
          </div>
        </TitleGroup>

        <PresetsBar>
          <PresetButton 
            $active={activePreset === 'balanced'} 
            onClick={() => applyPreset('balanced')}
            title="+1.0 Lift across all dimensions"
          >
            <FiTrendingUp /> Balanced (+1.0)
          </PresetButton>
          <PresetButton 
            $active={activePreset === 'ai_leader'} 
            onClick={() => applyPreset('ai_leader')}
            title="Accelerate AI & GenAI to Level 5.0"
          >
            <FiZap /> AI & GenAI Leader
          </PresetButton>
          <PresetButton 
            $active={activePreset === 'governance'} 
            onClick={() => applyPreset('governance')}
            title="Max out Governance & Operations to Level 5.0"
          >
            <FiShield /> Zero Trust & Governance
          </PresetButton>
          <PresetButton 
            $active={activePreset === 'reset'} 
            onClick={() => applyPreset('reset')}
            title="Reset to original assessment targets"
          >
            <FiRefreshCw /> Reset
          </PresetButton>
        </PresetsBar>
      </SimulatorHeader>

      {/* Projected Metrics Overview */}
      <MetricsOverviewGrid>
        <MetricCard $color="#3b82f6">
          <div className="label">
            <FiTrendingUp /> Projected Target Score
          </div>
          <div className="value">
            {avgTarget} <span style={{ fontSize: '0.9rem', color: '#64748b' }}>/ 5.0</span>
          </div>
          <div className="subtext">
            {gap > 0 ? `+${gap} Lift from Current (${avgCurrent})` : 'At Current Baseline'}
          </div>
        </MetricCard>

        <MetricCard $color="#10b981">
          <div className="label">
            <FiDollarSign /> Projected Annual Savings
          </div>
          <div className="value">
            ${(estSavings / 1000).toFixed(0)}k <span style={{ fontSize: '0.9rem', color: '#64748b' }}>/ yr</span>
          </div>
          <div className="subtext">
            Compute optimization & engineering velocity
          </div>
        </MetricCard>

        <MetricCard $color="#8b5cf6">
          <div className="label">
            <FiClock /> Est. Execution Timeline
          </div>
          <div className="value">
            {estMonths} <span style={{ fontSize: '0.9rem', color: '#64748b' }}>Months</span>
          </div>
          <div className="subtext">
            {Math.round(estMonths * 2)} Engineering Sprints (3 phases)
          </div>
        </MetricCard>

        <MetricCard $color="#ec4899">
          <div className="label">
            <FiShield /> Risk Exposure Reduction
          </div>
          <div className="value">
            {estRiskMitigation}%
          </div>
          <div className="subtext">
            Governance, compliance & security posture
          </div>
        </MetricCard>
      </MetricsOverviewGrid>

      {/* Interactive Sliders */}
      <SlidersGrid>
        {Object.entries(initialScores).map(([key, val]) => {
          const name = typeof val === 'object' ? (val.name || val.pillarName || key.replace(/_/g, ' ').toUpperCase()) : key;
          const current = typeof val === 'object' ? Number(val.current || val.currentScore || 2) : 2;
          const target = targets[key] !== undefined ? targets[key] : Math.min(5, current + 1);

          return (
            <SliderCard key={key}>
              <SliderTop>
                <PillarName>{name}</PillarName>
                <ScoreBadgeGroup>
                  <span className="current">Current: {current.toFixed(1)}</span>
                  <span className="arrow">➔</span>
                  <span className="target">Target: {target.toFixed(1)}</span>
                </ScoreBadgeGroup>
              </SliderTop>

              <RangeInput 
                type="range" 
                min={1} 
                max={5} 
                step={0.1}
                value={target} 
                onChange={(e) => handleSliderChange(key, e.target.value)}
              />

              <LevelLabels>
                <span>1.0 Ad-hoc</span>
                <span>2.0 Repeatable</span>
                <span>3.0 Defined</span>
                <span>4.0 Managed</span>
                <span>5.0 Optimizing</span>
              </LevelLabels>
            </SliderCard>
          );
        })}
      </SlidersGrid>
    </SimulatorContainer>
  );
};

export default ScenarioSimulator;
