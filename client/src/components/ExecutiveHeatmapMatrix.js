import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGrid, FiAlertTriangle, FiCheckCircle, FiInfo, FiLayers } from 'react-icons/fi';

const MatrixCard = styled(motion.div)`
  background: ${props => props.$theme === 'dark' ? 'rgba(15, 23, 42, 0.75)' : '#ffffff'};
  border: ${props => props.$theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e2e8f0'};
  backdrop-filter: blur(16px);
  border-radius: 20px;
  padding: 28px;
  margin-bottom: 32px;
  box-shadow: ${props => props.$theme === 'dark' ? '0 10px 30px rgba(0, 0, 0, 0.3)' : '0 4px 20px rgba(0, 0, 0, 0.05)'};

  @media print {
    background: white !important;
    border: 1px solid #cbd5e1 !important;
    box-shadow: none !important;
    page-break-inside: avoid !important;
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

  .icon-wrap {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.3rem;
  }

  h3 {
    font-size: 1.25rem;
    font-weight: 700;
    color: ${props => props.$theme === 'dark' ? '#f8fafc' : '#0f172a'};
    margin: 0 0 2px 0;

    @media print {
      color: #0f172a !important;
    }
  }

  p {
    font-size: 0.85rem;
    color: ${props => props.$theme === 'dark' ? '#94a3b8' : '#475569'};
    margin: 0;

    @media print {
      color: #475569 !important;
    }
  }
`;

const HeatmapGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
`;

const HeatmapCell = styled.div`
  background: ${props => props.$theme === 'dark' ? (props.$bgColor || 'rgba(30, 41, 59, 0.6)') : '#ffffff'};
  border: ${props => props.$theme === 'dark' ? (props.$borderColor || 'rgba(255, 255, 255, 0.1)') : '1.5px solid #e2e8f0'};
  box-shadow: ${props => props.$theme === 'dark' ? 'none' : '0 2px 8px rgba(0,0,0,0.04)'};
  border-radius: 14px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

const SeverityPill = styled.span`
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 3px 8px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: ${props => props.$bg};
  color: ${props => props.$color};
  border: 1px solid ${props => props.$border};
`;

const ExecutiveHeatmapMatrix = ({ dimensions = [], dimensionScores = {}, responses = {}, theme = "light" }) => {
  const [selectedDimension, setSelectedDimension] = useState(null);

  if (!dimensions || dimensions.length === 0) {
    return null;
  }

  const getDimensionRiskProfile = (dim) => {
    const dScore = dimensionScores[dim.id];
    const score = dScore?.score !== undefined ? dScore.score : (parseFloat(responses[`${dim.id}_current`]) || 2.5);
    const target = dScore?.targetScore !== undefined ? dScore.targetScore : (parseFloat(responses[`${dim.id}_target`]) || 4.0);
    const gap = target - score;

    // Count technical & business pain points in this dimension accurately
    let techPainCount = 0;
    (dim.questions || []).forEach(q => {
      const techPains = responses[`${q.id}_technical_pain`] || responses[`${q.id}_tech_pain`] || responses[`${q.id}_technical_pain_points`] || [];
      const bizPains = responses[`${q.id}_business_pain`] || responses[`${q.id}_biz_pain`] || responses[`${q.id}_business_pain_points`] || [];
      techPainCount += (Array.isArray(techPains) ? techPains.length : (techPains ? 1 : 0)) +
                       (Array.isArray(bizPains) ? bizPains.length : (bizPains ? 1 : 0));
    });
    // Check dimension level pain points
    const dimTech = responses[`${dim.id}_technical_pain`] || responses[`${dim.id}_tech_pain`] || [];
    const dimBiz = responses[`${dim.id}_business_pain`] || responses[`${dim.id}_biz_pain`] || [];
    techPainCount += (Array.isArray(dimTech) ? dimTech.length : (dimTech ? 1 : 0)) +
                     (Array.isArray(dimBiz) ? dimBiz.length : (dimBiz ? 1 : 0));

    let riskLevel = 'Low Risk';
    let riskColor = '#34d399';
    let riskBg = 'rgba(16, 185, 129, 0.15)';
    let riskBorder = 'rgba(16, 185, 129, 0.3)';
    let cellBg = 'rgba(16, 185, 129, 0.06)';

    if (score <= 2.0 || techPainCount >= 5 || gap >= 2.0) {
      riskLevel = 'Critical Exposure';
      riskColor = '#f87171';
      riskBg = 'rgba(239, 68, 68, 0.2)';
      riskBorder = 'rgba(239, 68, 68, 0.4)';
      cellBg = 'rgba(239, 68, 68, 0.08)';
    } else if (score <= 3.0 || techPainCount >= 3 || gap >= 1.5) {
      riskLevel = 'High Risk';
      riskColor = '#fbbf24';
      riskBg = 'rgba(245, 158, 11, 0.2)';
      riskBorder = 'rgba(245, 158, 11, 0.4)';
      cellBg = 'rgba(245, 158, 11, 0.08)';
    } else if (score <= 3.8 || techPainCount >= 1) {
      riskLevel = 'Moderate Risk';
      riskColor = '#60a5fa';
      riskBg = 'rgba(59, 130, 246, 0.2)';
      riskBorder = 'rgba(59, 130, 246, 0.4)';
      cellBg = 'rgba(59, 130, 246, 0.08)';
    }

    return {
      score,
      target,
      gap: Number(gap.toFixed(1)),
      techPainCount,
      riskLevel,
      riskColor,
      riskBg,
      riskBorder,
      cellBg
    };
  };

  return (
    <MatrixCard $theme={theme}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Header>
        <TitleBlock $theme={theme}>
          <div className="icon-wrap">
            <FiGrid />
          </div>
          <div>
            <h3>Enterprise Capability vs. Operational Risk Matrix</h3>
            <p>2D heat evaluation cross-referencing capability maturity with technical risk exposure</p>
          </div>
        </TitleBlock>
      </Header>

      <HeatmapGrid>
        {dimensions.map((dim) => {
          const profile = getDimensionRiskProfile(dim);

          return (
            <HeatmapCell $theme={theme}
              key={dim.id}
              $bgColor={profile.cellBg}
              $borderColor={profile.riskBorder}
              onClick={() => setSelectedDimension(dim)}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <SeverityPill
                    $color={profile.riskColor}
                    $bg={profile.riskBg}
                    $border={profile.riskBorder}
                  >
                    <FiAlertTriangle size={11} /> {profile.riskLevel}
                  </SeverityPill>
                  <span style={{ 
                    fontSize: '0.85rem', 
                    fontWeight: 800, 
                    color: theme === 'dark' ? '#f8fafc' : '#0f172a',
                    background: theme === 'dark' ? 'rgba(255,255,255,0.08)' : '#f1f5f9',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    border: theme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e2e8f0'
                  }}>
                    {profile.score} / 5.0
                  </span>
                </div>

                <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 6px 0', color: theme === "dark" ? "#ffffff" : "#0f172a" }}>
                  {dim.name}
                </h4>
                <p style={{ fontSize: '0.8rem', color: theme === "dark" ? "#94a3b8" : "#475569", margin: '0 0 14px 0', lineHeight: 1.4 }}>
                  {dim.description?.length > 70 ? `${dim.description.substring(0, 70)}...` : dim.description}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: theme === "dark" ? "1px solid rgba(255,255,255,0.08)" : "1px solid #e2e8f0", fontSize: '0.78rem' }}>
                <span style={{ color: theme === "dark" ? "#cbd5e1" : "#334155" }}>
                  Gap: <strong style={{ color: profile.gap > 1 ? '#f87171' : '#34d399' }}>+{profile.gap} pts</strong>
                </span>
                <span style={{ color: theme === "dark" ? "#94a3b8" : "#64748b" }}>
                  {profile.techPainCount} Bottlenecks
                </span>
              </div>
            </HeatmapCell>
          );
        })}
      </HeatmapGrid>
    </MatrixCard>
  );
};

export default ExecutiveHeatmapMatrix;
