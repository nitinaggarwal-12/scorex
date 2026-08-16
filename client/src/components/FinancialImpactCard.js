import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiDollarSign, 
  FiTrendingUp, 
  FiShield, 
  FiClock, 
  FiCpu, 
  FiCheckCircle, 
  FiChevronDown, 
  FiChevronUp,
  FiZap,
  FiPieChart
} from 'react-icons/fi';

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
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.35rem;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
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

const ScaleSelector = styled.div`
  display: flex;
  background: #f1f5f9;
  padding: 4px;
  border-radius: 10px;
  gap: 4px;
`;

const ScaleBtn = styled.button`
  background: ${props => props.$active ? 'white' : 'transparent'};
  color: ${props => props.$active ? '#0f172a' : '#64748b'};
  font-weight: ${props => props.$active ? '700' : '500'};
  box-shadow: ${props => props.$active ? '0 2px 6px rgba(0,0,0,0.08)' : 'none'};
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: #0f172a;
  }
`;

const HeroMetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: 960px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

const HeroMetric = styled.div`
  background: linear-gradient(135deg, ${props => props.$bg || '#f8fafc'} 0%, #ffffff 100%);
  border: 1.5px solid ${props => props.$borderColor || '#e2e8f0'};
  border-radius: 14px;
  padding: 18px 20px;
  display: flex;
  flex-direction: column;

  .label {
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: ${props => props.$accent || '#64748b'};
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 8px;
  }

  .value {
    font-size: 1.85rem;
    font-weight: 800;
    color: #1e293b;
    line-height: 1.1;
    margin-bottom: 4px;
  }

  .sub {
    font-size: 0.75rem;
    color: #64748b;
    font-weight: 500;
  }
`;

const DetailsToggle = styled.button`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  width: 100%;
  padding: 12px 18px;
  font-size: 0.85rem;
  font-weight: 700;
  color: #3b82f6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #eff6ff;
    border-color: #bfdbfe;
  }
`;

const BreakdownGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 16px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const BreakdownCard = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;

  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  .name {
    font-size: 0.85rem;
    font-weight: 700;
    color: #1e293b;
  }

  .amount {
    font-size: 1.1rem;
    font-weight: 800;
    color: #10b981;
  }

  .desc {
    font-size: 0.75rem;
    color: #64748b;
    line-height: 1.4;
  }

  .driver {
    margin-top: 8px;
    font-size: 0.7rem;
    background: white;
    border: 1px solid #e2e8f0;
    padding: 4px 8px;
    border-radius: 6px;
    color: #475569;
    font-weight: 600;
  }
`;

const FinancialImpactCard = ({ 
  pillarScores = {}, 
  overallCurrent = 2.5, 
  overallTarget = 4.0 
}) => {
  const [scale, setScale] = useState('enterprise'); // midmarket, enterprise, global
  const [showDetails, setShowDetails] = useState(false);

  const scaleMultipliers = {
    midmarket: { base: 0.6, name: 'Mid-Market (50-250 users)' },
    enterprise: { base: 1.0, name: 'Enterprise (250-2,500 users)' },
    global: { base: 2.2, name: 'Global Scale (2,500+ users)' }
  };

  const currentScale = scaleMultipliers[scale];
  const m = currentScale.base;

  // Calculate pillar gap deltas
  const getGap = (pillarKey, defaultCurrent = 2.5, defaultTarget = 4.0) => {
    const p = pillarScores[pillarKey];
    if (!p) return Math.max(0.5, defaultTarget - defaultCurrent);
    const curr = typeof p === 'object' ? (p.current || p.currentScore || defaultCurrent) : defaultCurrent;
    const tgt = typeof p === 'object' ? (p.future || p.targetScore || p.futureScore || defaultTarget) : defaultTarget;
    return Math.max(0.2, tgt - curr);
  };

  const platformGap = getGap('platform_governance', 2.8, 4.0);
  const dataEngGap = getGap('data_engineering', 3.0, 4.5);
  const biGap = getGap('analytics_bi', 2.4, 4.0);
  const mlGap = getGap('machine_learning', 2.6, 4.2);
  const genaiGap = getGap('generative_ai', 1.8, 4.0);
  const opsGap = getGap('operational_excellence', 2.9, 4.5);

  // Financial Value Calculations
  const savingsPlatform = Math.round(platformGap * 110000 * m);
  const savingsDataEng = Math.round(dataEngGap * 165000 * m);
  const savingsBI = Math.round(biGap * 95000 * m);
  const savingsML = Math.round(mlGap * 140000 * m);
  const savingsGenAI = Math.round(genaiGap * 135000 * m);
  const savingsOps = Math.round(opsGap * 90000 * m);

  const totalAnnualSavings = savingsPlatform + savingsDataEng + savingsBI + savingsML + savingsGenAI + savingsOps;
  const threeYearValue = totalAnnualSavings * 3;

  // Dollar at Risk
  const totalGap = (platformGap + dataEngGap + biGap + mlGap + genaiGap + opsGap) / 6;
  const dollarAtRiskMitigated = Math.round(totalGap * 380000 * m);
  const paybackMonths = Math.max(2.5, (5.2 - totalGap * 1.1)).toFixed(1);
  const roiMultiple = Math.round((threeYearValue / (totalAnnualSavings * 0.75)) * 100);

  const breakdownDrivers = [
    {
      name: 'Platform & Governance',
      amount: savingsPlatform,
      desc: 'Unity Catalog metadata unification & automated compliance audit trails.',
      driver: 'Audit cycle time: -65% • Sprawl elimination'
    },
    {
      name: 'Data Engineering',
      amount: savingsDataEng,
      desc: 'Declarative pipelines & serverless vectorized SQL right-sizing.',
      driver: 'Pipeline failures: -80% • Compute efficiency: +45%'
    },
    {
      name: 'Analytics & BI',
      amount: savingsBI,
      desc: 'Self-service semantic layer eliminating manual analyst query bottlenecks.',
      driver: 'Time-to-insight: 14 days ➔ 4 hours'
    },
    {
      name: 'Machine Learning & MLOps',
      amount: savingsML,
      desc: 'Centralized model registry & zero-downtime inference endpoints.',
      driver: 'Time-to-production: 4 months ➔ 2 weeks'
    },
    {
      name: 'Generative AI & LLMs',
      amount: savingsGenAI,
      desc: 'Token arbitrage, context caching (75% savings), and model routing.',
      driver: 'Token cost optimization: up to 70%'
    },
    {
      name: 'Operational Excellence',
      amount: savingsOps,
      desc: 'FinOps automated cluster kill-switches & predictive cost alerts.',
      driver: 'Idle compute waste: -90%'
    }
  ];

  return (
    <Container
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Header>
        <TitleBlock>
          <div className="icon">
            <FiDollarSign />
          </div>
          <div>
            <Title>Quantified TCO & Dollar-at-Risk Financial Impact</Title>
            <Subtitle>
              Projected ROI, cost avoidance, and operational value grounded in your specific maturity gaps.
            </Subtitle>
          </div>
        </TitleBlock>

        <ScaleSelector>
          <ScaleBtn $active={scale === 'midmarket'} onClick={() => setScale('midmarket')}>
            Mid-Market
          </ScaleBtn>
          <ScaleBtn $active={scale === 'enterprise'} onClick={() => setScale('enterprise')}>
            Enterprise
          </ScaleBtn>
          <ScaleBtn $active={scale === 'global'} onClick={() => setScale('global')}>
            Global Scale
          </ScaleBtn>
        </ScaleSelector>
      </Header>

      {/* 4 Hero Metrics */}
      <HeroMetricsGrid>
        <HeroMetric $bg="#f0fdf4" $borderColor="#bbf7d0" $accent="#16a34a">
          <div className="label">
            <FiTrendingUp /> 3-Year Net Value Creation
          </div>
          <div className="value">
            ${(threeYearValue / 1000000).toFixed(2)}M
          </div>
          <div className="sub">
            ${(totalAnnualSavings / 1000).toFixed(0)}k Projected Annual Savings
          </div>
        </HeroMetric>

        <HeroMetric $bg="#eff6ff" $borderColor="#bfdbfe" $accent="#2563eb">
          <div className="label">
            <FiShield /> Dollar-at-Risk Mitigated
          </div>
          <div className="value">
            ${(dollarAtRiskMitigated / 1000).toFixed(0)}k
          </div>
          <div className="sub">
            Compliance penalty & downtime exposure avoided
          </div>
        </HeroMetric>

        <HeroMetric $bg="#faf5ff" $borderColor="#e9d5ff" $accent="#9333ea">
          <div className="label">
            <FiClock /> Est. Payback Breakeven
          </div>
          <div className="value">
            {paybackMonths} <span style={{ fontSize: '1rem', color: '#64748b' }}>Months</span>
          </div>
          <div className="sub">
            Fast capital recovery on modernization spend
          </div>
        </HeroMetric>

        <HeroMetric $bg="#fffbeb" $borderColor="#fef3c7" $accent="#d97706">
          <div className="label">
            <FiZap /> Projected ROI Multiple
          </div>
          <div className="value">
            {roiMultiple}%
          </div>
          <div className="sub">
            Net return across 3-year transformation
          </div>
        </HeroMetric>
      </HeroMetricsGrid>

      {/* Expandable Breakdown */}
      <DetailsToggle onClick={() => setShowDetails(!showDetails)}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FiPieChart /> {showDetails ? 'Hide Detailed Value Breakdown by Pillar' : 'View Detailed Value Breakdown by Pillar (6 Dimensions)'}
        </span>
        {showDetails ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
      </DetailsToggle>

      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <BreakdownGrid>
              {breakdownDrivers.map((driver, idx) => (
                <BreakdownCard key={idx}>
                  <div className="top">
                    <span className="name">{driver.name}</span>
                    <span className="amount">+${(driver.amount / 1000).toFixed(0)}k/yr</span>
                  </div>
                  <div className="desc">{driver.desc}</div>
                  <div className="driver">{driver.driver}</div>
                </BreakdownCard>
              ))}
            </BreakdownGrid>
          </motion.div>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default FinancialImpactCard;
