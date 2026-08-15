import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  FiDollarSign,
  FiTrendingUp,
  FiUsers,
  FiDatabase,
  FiCpu,
  FiDownload,
  FiRefreshCw,
  FiInfo,
  FiCheckCircle,
  FiEdit2,
  FiTrash2,
  FiPlus
} from 'react-icons/fi';
import toast from 'react-hot-toast';
// jsPDF import removed - Download Business Case feature removed

// =====================
// STYLED COMPONENTS
// =====================

const CalculatorContainer = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 40px;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    padding: 24px;
  }

  /* 🖨️ PRINT: Keep entire component together */
  @media print {
    page-break-inside: avoid !important;
    break-inside: avoid-page !important;
    page-break-before: auto !important;
    page-break-after: auto !important;
    margin-bottom: 20px !important;
    padding: 24px !important;
    box-shadow: none !important;
    border: 1px solid #e2e8f0 !important;
  }
`;

const CalculatorHeader = styled.div`
  margin-bottom: 32px;
`;

const CalculatorTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CalculatorSubtitle = styled.p`
  font-size: 1rem;
  color: #64748b;
  margin: 0;
`;

const AssumptionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const AssumptionCard = styled.div`
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;

  &:hover {
    border-color: #3b82f6;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
  }
`;

const AssumptionLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
  margin-bottom: 12px;
`;

const SliderContainer = styled.div`
  margin-bottom: 8px;
`;

const Slider = styled.input`
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: linear-gradient(
    to right,
    #3b82f6 0%,
    #3b82f6 ${props => props.$percentage}%,
    #e2e8f0 ${props => props.$percentage}%,
    #e2e8f0 100%
  );
  outline: none;
  -webkit-appearance: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #3b82f6;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
    transition: all 0.2s ease;

    &:hover {
      transform: scale(1.2);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.6);
    }
  }

  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #3b82f6;
    cursor: pointer;
    border: none;
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
    transition: all 0.2s ease;

    &:hover {
      transform: scale(1.2);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.6);
    }
  }
`;

const SliderValue = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  color: #64748b;
  margin-top: 8px;

  .current-value {
    font-weight: 700;
    color: #3b82f6;
    font-size: 1rem;
  }
`;

const ScenarioTabs = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
  border-bottom: 2px solid #e2e8f0;
`;

const ScenarioTab = styled.button`
  padding: 12px 24px;
  border: none;
  background: none;
  font-size: 0.938rem;
  font-weight: 600;
  color: ${props => props.$active ? '#3b82f6' : '#64748b'};
  border-bottom: 3px solid ${props => props.$active ? '#3b82f6' : 'transparent'};
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: -2px;

  &:hover {
    color: #3b82f6;
  }
`;

const ResultsSection = styled(motion.div)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 32px;
  color: white;
  margin-bottom: 24px;
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ResultCard = styled.div`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const ResultLabel = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  opacity: 0.9;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ResultValue = styled(motion.div)`
  font-size: 2rem;
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
  margin-bottom: 8px;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const ResultBreakdown = styled.div`
  font-size: 0.813rem;
  opacity: 0.85;
  line-height: 1.6;
`;

const TotalROICard = styled.div`
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 24px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  text-align: center;
`;

const TotalROILabel = styled.div`
  font-size: 1rem;
  font-weight: 600;
  opacity: 0.9;
  margin-bottom: 12px;
`;

const TotalROIValue = styled(motion.div)`
  font-size: 3rem;
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
  margin-bottom: 8px;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const TotalROISubtext = styled.div`
  font-size: 0.938rem;
  opacity: 0.9;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ActionButton = styled(motion.button)`
  padding: 12px 24px;
  border: 2px solid rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  color: white;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.938rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: white;
  }
`;

const InfoBox = styled.div`
  background: #eff6ff;
  border-left: 4px solid #3b82f6;
  border-radius: 8px;
  padding: 16px;
  margin-top: 24px;
  display: flex;
  gap: 12px;
  align-items: flex-start;
`;

const InfoText = styled.div`
  font-size: 0.875rem;
  color: #1e40af;
  line-height: 1.6;
`;

// Interactive Elements for CRUD
const AddBenefitButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: 0;
  margin-top: 16px;

  ${CalculatorContainer}:hover & {
    opacity: 1;
  }

  @media (max-width: 768px) {
    opacity: 1;
  }

  &:hover {
    background: #2563eb;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }

  @media print {
    display: none !important;
  }
`;

const CustomBenefitsSection = styled.div`
  margin-bottom: 24px;
`;

const CustomBenefitCard = styled(motion.div)`
  position: relative;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  margin-bottom: 12px;

  &:hover .benefit-actions {
    opacity: 1;
  }
`;

const BenefitActions = styled.div.attrs({ className: 'benefit-actions' })`
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.2s ease;
  z-index: 10;

  @media (max-width: 768px) {
    opacity: 1;
  }

  @media print {
    display: none !important;
  }
`;

const BenefitActionButton = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: none;
  background: rgba(255, 255, 255, 0.95);
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #3b82f6;
    color: white;
    transform: scale(1.1);
  }
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled(motion.div)`
  background: white;
  border-radius: 16px;
  padding: 32px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const ModalTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 24px 0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
`;

const Input = styled.input`
  padding: 12px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const TextArea = styled.textarea`
  padding: 12px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  min-height: 80px;
  font-family: inherit;
  resize: vertical;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 8px;
`;

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;

  ${props => props.$variant === 'primary' ? `
    background: #3b82f6;
    color: white;
    &:hover {
      background: #2563eb;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }
  ` : `
    background: #f1f5f9;
    color: #64748b;
    &:hover {
      background: #e2e8f0;
    }
  `}

  &:active {
    transform: translateY(0);
  }
`;

// =====================
// COMPONENT
// =====================

const ROICalculator = ({ results, assessment }) => {
  const [scenario, setScenario] = useState('realistic');
  const [assumptions, setAssumptions] = useState({
    teamSize: 50,
    dataVolumeTB: 100,
    currentInfraCost: 500000,
    avgEngineerSalary: 150000,
    currentDataQualityIssues: 20
  });

  const [animatedValues, setAnimatedValues] = useState({
    savings: 0,
    revenue: 0,
    totalValue: 0,
    roi: 0
  });

  // Calculate ROI based on assumptions and scenario
  const calculateROI = () => {
    const multipliers = {
      conservative: { infra: 0.25, productivity: 0.20, quality: 0.15, revenue: 0.10 },
      realistic: { infra: 0.40, productivity: 0.35, quality: 0.25, revenue: 0.20 },
      optimistic: { infra: 0.60, productivity: 0.50, quality: 0.40, revenue: 0.35 }
    };

    const m = multipliers[scenario];

    // Infrastructure savings
    const infraSavings = assumptions.currentInfraCost * m.infra;

    // Engineering productivity (time saved = cost saved)
    const productivitySavings = (assumptions.teamSize * assumptions.avgEngineerSalary) * m.productivity;

    // Data quality improvements (reduced rework, better decisions)
    const qualitySavings = (assumptions.currentDataQualityIssues / 100) * 
                          (assumptions.teamSize * assumptions.avgEngineerSalary * 0.3) * 
                          m.quality;

    const totalSavings = infraSavings + productivitySavings + qualitySavings;

    // Revenue opportunities (new use cases enabled)
    const genAIRevenue = assumptions.teamSize * 50000 * m.revenue; // $50K per engineer in GenAI value
    const mlRevenue = assumptions.dataVolumeTB * 5000 * m.revenue; // $5K per TB in ML value
    const dataMonetization = assumptions.dataVolumeTB * 2000 * m.revenue; // $2K per TB in data products

    const totalRevenue = genAIRevenue + mlRevenue + dataMonetization;

    // Databricks investment (simplified)
    const databricksInvestment = 
      (assumptions.dataVolumeTB * 3000) + // Storage + compute
      (assumptions.teamSize * 10000); // Per-user licensing

    // 3-year value
    const threeYearValue = (totalSavings + totalRevenue) * 3;
    const threeYearInvestment = databricksInvestment * 3;
    const netROI = threeYearValue - threeYearInvestment;
    const roiRatio = threeYearValue / threeYearInvestment;

    return {
      savings: totalSavings,
      savingsBreakdown: {
        infra: infraSavings,
        productivity: productivitySavings,
        quality: qualitySavings
      },
      revenue: totalRevenue,
      revenueBreakdown: {
        genAI: genAIRevenue,
        ml: mlRevenue,
        monetization: dataMonetization
      },
      threeYearValue,
      investment: threeYearInvestment,
      netROI,
      roiRatio,
      paybackMonths: Math.ceil((databricksInvestment / (totalSavings + totalRevenue)) * 12)
    };
  };

  const roi = calculateROI();

  // Animate numbers when they change
  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const interval = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setAnimatedValues({
        savings: roi.savings * progress,
        revenue: roi.revenue * progress,
        totalValue: roi.threeYearValue * progress,
        roi: roi.netROI * progress
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setAnimatedValues({
          savings: roi.savings,
          revenue: roi.revenue,
          totalValue: roi.threeYearValue,
          roi: roi.netROI
        });
      }
    }, interval);

    return () => clearInterval(timer);
  }, [scenario, assumptions]);

  const handleAssumptionChange = (key, value) => {
    setAssumptions(prev => ({ ...prev, [key]: parseInt(value) }));
  };

  const handleReset = () => {
    setAssumptions({
      teamSize: 50,
      dataVolumeTB: 100,
      currentInfraCost: 500000,
      avgEngineerSalary: 150000,
      currentDataQualityIssues: 20
    });
    setScenario('realistic');
    
  };

  const formatCurrency = (value) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    return `$${(value / 1000).toFixed(0)}K`;
  };

  return (
    <CalculatorContainer>
      <CalculatorHeader>
        <CalculatorTitle>
          <FiDollarSign />
          Interactive ROI Calculator
        </CalculatorTitle>
        <CalculatorSubtitle>
          Customize assumptions to see your specific business case for Databricks
        </CalculatorSubtitle>
      </CalculatorHeader>

      {/* Scenario Tabs */}
      <ScenarioTabs>
        <ScenarioTab 
          $active={scenario === 'conservative'} 
          onClick={() => setScenario('conservative')}
        >
          Conservative
        </ScenarioTab>
        <ScenarioTab 
          $active={scenario === 'realistic'} 
          onClick={() => setScenario('realistic')}
        >
          Realistic
        </ScenarioTab>
        <ScenarioTab 
          $active={scenario === 'optimistic'} 
          onClick={() => setScenario('optimistic')}
        >
          Optimistic
        </ScenarioTab>
      </ScenarioTabs>

      {/* Assumptions */}
      <AssumptionsGrid>
        <AssumptionCard>
          <AssumptionLabel>
            <FiUsers />
            Data & Engineering Team Size
          </AssumptionLabel>
          <SliderContainer>
            <Slider
              type="range"
              min="10"
              max="500"
              step="10"
              value={assumptions.teamSize}
              onChange={(e) => handleAssumptionChange('teamSize', e.target.value)}
              $percentage={(assumptions.teamSize - 10) / (500 - 10) * 100}
            />
          </SliderContainer>
          <SliderValue>
            <span className="current-value">{assumptions.teamSize} engineers</span>
            <span>10 - 500</span>
          </SliderValue>
        </AssumptionCard>

        <AssumptionCard>
          <AssumptionLabel>
            <FiDatabase />
            Data Volume (TB)
          </AssumptionLabel>
          <SliderContainer>
            <Slider
              type="range"
              min="10"
              max="10000"
              step="10"
              value={assumptions.dataVolumeTB}
              onChange={(e) => handleAssumptionChange('dataVolumeTB', e.target.value)}
              $percentage={(assumptions.dataVolumeTB - 10) / (10000 - 10) * 100}
            />
          </SliderContainer>
          <SliderValue>
            <span className="current-value">{assumptions.dataVolumeTB} TB</span>
            <span>10 - 10,000 TB</span>
          </SliderValue>
        </AssumptionCard>

        <AssumptionCard>
          <AssumptionLabel>
            <FiCpu />
            Current Infrastructure Cost (Annual)
          </AssumptionLabel>
          <SliderContainer>
            <Slider
              type="range"
              min="100000"
              max="10000000"
              step="100000"
              value={assumptions.currentInfraCost}
              onChange={(e) => handleAssumptionChange('currentInfraCost', e.target.value)}
              $percentage={(assumptions.currentInfraCost - 100000) / (10000000 - 100000) * 100}
            />
          </SliderContainer>
          <SliderValue>
            <span className="current-value">{formatCurrency(assumptions.currentInfraCost)}</span>
            <span>$100K - $10M</span>
          </SliderValue>
        </AssumptionCard>

        <AssumptionCard>
          <AssumptionLabel>
            <FiDollarSign />
            Average Engineer Salary
          </AssumptionLabel>
          <SliderContainer>
            <Slider
              type="range"
              min="80000"
              max="300000"
              step="10000"
              value={assumptions.avgEngineerSalary}
              onChange={(e) => handleAssumptionChange('avgEngineerSalary', e.target.value)}
              $percentage={(assumptions.avgEngineerSalary - 80000) / (300000 - 80000) * 100}
            />
          </SliderContainer>
          <SliderValue>
            <span className="current-value">{formatCurrency(assumptions.avgEngineerSalary)}</span>
            <span>$80K - $300K</span>
          </SliderValue>
        </AssumptionCard>
      </AssumptionsGrid>

      {/* Results */}
      <ResultsSection
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ResultsGrid>
          <ResultCard>
            <ResultLabel>Annual Savings</ResultLabel>
            <ResultValue>
              {formatCurrency(animatedValues.savings)}
            </ResultValue>
            <ResultBreakdown>
              ├─ Infrastructure: {formatCurrency(roi.savingsBreakdown.infra)}<br />
              ├─ Productivity: {formatCurrency(roi.savingsBreakdown.productivity)}<br />
              └─ Data Quality: {formatCurrency(roi.savingsBreakdown.quality)}
            </ResultBreakdown>
          </ResultCard>

          <ResultCard>
            <ResultLabel>New Revenue Opportunities</ResultLabel>
            <ResultValue>
              {formatCurrency(animatedValues.revenue)}
            </ResultValue>
            <ResultBreakdown>
              ├─ GenAI Applications: {formatCurrency(roi.revenueBreakdown.genAI)}<br />
              ├─ ML Deployment: {formatCurrency(roi.revenueBreakdown.ml)}<br />
              └─ Data Monetization: {formatCurrency(roi.revenueBreakdown.monetization)}
            </ResultBreakdown>
          </ResultCard>
        </ResultsGrid>

        <TotalROICard>
          <TotalROILabel>3-YEAR NET ROI</TotalROILabel>
          <TotalROIValue>
            {formatCurrency(animatedValues.roi)}
          </TotalROIValue>
          <TotalROISubtext>
            <FiCheckCircle style={{ display: 'inline', marginRight: '6px' }} />
            {roi.roiRatio.toFixed(1)}x return on investment • {roi.paybackMonths} month payback
          </TotalROISubtext>
        </TotalROICard>

        <ActionButtons>
          <ActionButton
            onClick={handleReset}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiRefreshCw />
            Reset to Defaults
          </ActionButton>
        </ActionButtons>
      </ResultsSection>

      <InfoBox>
        <FiInfo size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
        <InfoText>
          <strong>How we calculate ROI:</strong> Based on industry benchmarks from Forrester Total Economic Impact studies and Databricks customer case studies. 
          Actual results vary by organization. Conservative scenario uses lower-bound estimates, Realistic uses median values, and Optimistic uses upper-quartile results.
        </InfoText>
      </InfoBox>
    </CalculatorContainer>
  );
};

export default ROICalculator;

