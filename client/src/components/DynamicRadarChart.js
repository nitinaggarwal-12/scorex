import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiTarget } from 'react-icons/fi';

const ChartCard = styled(motion.div)`
  background: ${props => props.$theme === 'dark' ? 'rgba(15, 23, 42, 0.75)' : '#ffffff'};
  border: ${props => props.$theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e2e8f0'};
  backdrop-filter: blur(16px);
  border-radius: 20px;
  padding: 28px;
  margin-bottom: 32px;
  box-shadow: ${props => props.$theme === 'dark' ? '0 10px 30px rgba(0, 0, 0, 0.3)' : '0 4px 20px rgba(0, 0, 0, 0.05)'};

  @media (max-width: 768px) {
    padding: 20px 16px;
  }

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
    background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
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

const LegendRow = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  color: ${props => props.$color || '#cbd5e1'};

  .dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: ${props => props.$bg || props.$color};
    border: 2px solid ${props => props.$color};
  }

  @media print {
    color: #334155 !important;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  align-items: center;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

const SvgContainer = styled.div`
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  position: relative;
  display: flex;
  justify-content: center;
`;

const TableWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const DimensionRow = styled.div`
  background: ${props => props.$theme === 'dark' ? 'rgba(30, 41, 59, 0.6)' : '#f8fafc'};
  border: ${props => props.$theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid #e2e8f0'};
  border-radius: 12px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(30, 41, 59, 0.9);
    border-color: rgba(99, 102, 241, 0.4);
    transform: translateX(4px);
  }

  @media print {
    background: #f8fafc !important;
    border: 1px solid #e2e8f0 !important;
  }
`;

const DimLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;

  .name {
    font-weight: 700;
    font-size: 0.92rem;
    color: ${props => props.$theme === "dark" ? "#f1f5f9" : "#0f172a"};

    @media print {
      color: #0f172a !important;
    }
  }

  .desc {
    font-size: 0.78rem;
    color: ${props => props.$theme === 'dark' ? '#94a3b8' : '#475569'};

    @media print {
      color: #64748b !important;
    }
  }
`;

const DimScores = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;

  .baseline {
    color: #f87171;
    font-weight: 700;
    font-size: 0.9rem;
    background: rgba(239, 68, 68, 0.15);
    padding: 3px 8px;
    border-radius: 6px;
  }

  .arrow {
    color: #94a3b8;
    font-size: 0.8rem;
  }

  .target {
    color: #34d399;
    font-weight: 700;
    font-size: 0.9rem;
    background: rgba(16, 185, 129, 0.15);
    padding: 3px 8px;
    border-radius: 6px;
  }

  .delta {
    font-size: 0.8rem;
    font-weight: 800;
    color: #818cf8;
  }
`;

const BENCHMARK_PROFILES = {
  global: { name: 'Global Enterprise Avg', score: 3.2, color: '#6366f1' },
  fintech: { name: 'FinTech & Banking', score: 4.1, color: '#0ea5e9' },
  healthcare: { name: 'Healthcare & Life Sciences', score: 3.8, color: '#10b981' },
  digital_native: { name: 'Digital Native & AI SaaS', score: 4.5, color: '#8b5cf6' },
  retail: { name: 'Retail & eCommerce', score: 3.5, color: '#f59e0b' }
};

const DynamicRadarChart = ({ 
  dimensions = [], 
  dimensionScores = {}, 
  responses = {},
  baselineLabel = 'Baseline',
  targetLabel = 'Target',
  title = 'Dimensional Gap Radar & Target Topology',
  subtitle = 'Multi-axis polygon matrix tracking baseline capability vs desired target state',
  theme = 'light'
}) => {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [selectedBenchmark, setSelectedBenchmark] = useState('global');

  if (!dimensions || dimensions.length < 3) {
    return null;
  }

  const currentBenchmark = BENCHMARK_PROFILES[selectedBenchmark] || BENCHMARK_PROFILES.global;

  const size = 420;
  const center = size / 2;
  const radius = 150;
  const totalAxes = dimensions.length;
  const angleStep = (2 * Math.PI) / totalAxes;

  // Compute coordinates
  const getCoordinates = (value, index, maxVal = 5) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = (value / maxVal) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle)
    };
  };

  // Build grid rings (Level 1 to 5)
  const rings = [1, 2, 3, 4, 5];

  // Baseline Points
  const baselinePoints = dimensions.map((dim, idx) => {
    const dScore = dimensionScores[dim.id];
    const score = dScore?.score !== undefined ? dScore.score : (dScore?.currentScore !== undefined ? dScore.currentScore : (parseFloat(responses[`${dim.id}_current`]) || 2.5));
    return getCoordinates(Math.min(5, Math.max(0.5, score)), idx);
  });
  const baselinePath = baselinePoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ') + ' Z';

  // Target Points
  const targetPoints = dimensions.map((dim, idx) => {
    const dScore = dimensionScores[dim.id];
    const target = dScore?.targetScore !== undefined ? dScore.targetScore : (dScore?.futureScore !== undefined ? dScore.futureScore : (parseFloat(responses[`${dim.id}_target`]) || 4.2));
    return getCoordinates(Math.min(5, Math.max(0.5, target)), idx);
  });
  const targetPath = targetPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ') + ' Z';

  // Dynamic Benchmark Points
  const benchmarkPoints = dimensions.map((_, idx) => getCoordinates(currentBenchmark.score, idx));
  const benchmarkPath = benchmarkPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ') + ' Z';

  return (
    <ChartCard $theme={theme} $theme={theme}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Header>
        <TitleBlock $theme={theme}>
          <div className="icon-wrap">
            <FiTarget />
          </div>
          <div>
            <h3>{title}</h3>
            <p>{subtitle}</p>
          </div>
        </TitleBlock>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '600' }}>Benchmark:</span>
            <select
              value={selectedBenchmark}
              onChange={(e) => setSelectedBenchmark(e.target.value)}
              style={{
                background: 'rgba(30, 41, 59, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#f8fafc',
                borderRadius: '8px',
                padding: '5px 10px',
                fontSize: '0.8rem',
                fontWeight: '600',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {Object.entries(BENCHMARK_PROFILES).map(([key, prof]) => (
                <option key={key} value={key} style={{ background: '#1e293b', color: '#f8fafc' }}>
                  {prof.name} ({prof.score})
                </option>
              ))}
            </select>
          </div>

          <LegendRow>
            <LegendItem $color="#ef4444" $bg="rgba(239, 68, 68, 0.3)">
              <span className="dot" /> {baselineLabel}
            </LegendItem>
            <LegendItem $color="#10b981" $bg="rgba(16, 185, 129, 0.3)">
              <span className="dot" /> {targetLabel}
            </LegendItem>
            <LegendItem $color={currentBenchmark.color} $bg="transparent">
              <span className="dot" style={{ borderStyle: 'dashed', borderColor: currentBenchmark.color }} /> Benchmark ({currentBenchmark.score})
            </LegendItem>
          </LegendRow>
        </div>
      </Header>

      <Grid>
        {/* SVG POLAR RADAR */}
        <SvgContainer>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <defs>
              <linearGradient id="baselineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.2" />
              </linearGradient>
              <linearGradient id="targetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.2" />
              </linearGradient>
            </defs>

            {/* Concentric Grid Rings */}
            {rings.map((ring) => {
              const r = (ring / 5) * radius;
              return (
                <g key={ring}>
                  <circle
                    cx={center}
                    cy={center}
                    r={r}
                    fill="none"
                    stroke={theme === "dark" ? "rgba(255, 255, 255, 0.08)" : "#e2e8f0"}
                    strokeWidth="1"
                    strokeDasharray={ring === 5 ? 'none' : '2 2'}
                  />
                  <text
                    x={center + 6}
                    y={center - r + 12}
                    fill={theme === "dark" ? "rgba(148, 163, 184, 0.6)" : "#64748b"}
                    fontSize="9"
                    fontWeight="600"
                  >
                    L{ring}
                  </text>
                </g>
              );
            })}

            {/* Axis Lines & Labels */}
            {dimensions.map((dim, idx) => {
              const edgeCoord = getCoordinates(5, idx);
              const labelCoord = getCoordinates(5.75, idx);
              const isHovered = hoveredIdx === idx;

              return (
                <g key={dim.id || idx}>
                  <line
                    x1={center}
                    y1={center}
                    x2={edgeCoord.x}
                    y2={edgeCoord.y}
                    stroke={theme === "dark" ? "rgba(255, 255, 255, 0.12)" : "#cbd5e1"}
                    strokeWidth="1"
                  />
                  <text
                    x={labelCoord.x}
                    y={labelCoord.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={isHovered ? '#60a5fa' : '#cbd5e1'}
                    fontSize="10.5"
                    fontWeight={isHovered ? '800' : '600'}
                    style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                  >
                    {dim.name.length > 18 ? `${dim.name.substring(0, 16)}...` : dim.name}
                  </text>
                </g>
              );
            })}

            {/* Benchmark Polygon */}
            <path
              d={benchmarkPath}
              fill="none"
              stroke={currentBenchmark.color}
              strokeWidth="1.5"
              strokeDasharray="4 4"
              opacity="0.85"
            />

            {/* Baseline Polygon */}
            <path
              d={baselinePath}
              fill="url(#baselineGrad)"
              stroke="#ef4444"
              strokeWidth="2.5"
            />

            {/* Target Polygon */}
            <path
              d={targetPath}
              fill="url(#targetGrad)"
              stroke="#10b981"
              strokeWidth="2.5"
            />

            {/* Data Point Markers */}
            {baselinePoints.map((p, idx) => (
              <circle
                key={`base-${idx}`}
                cx={p.x}
                cy={p.y}
                r="4.5"
                fill="#ef4444"
                stroke="#ffffff"
                strokeWidth="1.5"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
            ))}

            {targetPoints.map((p, idx) => (
              <circle
                key={`target-${idx}`}
                cx={p.x}
                cy={p.y}
                r="5"
                fill="#10b981"
                stroke="#ffffff"
                strokeWidth="1.5"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
            ))}
          </svg>
        </SvgContainer>

        {/* DIMENSIONAL GAP BREAKDOWN LIST */}
        <TableWrap>
          {dimensions.map((dim, idx) => {
            const dScore = dimensionScores[dim.id];
            const current = dScore?.score !== undefined ? dScore.score : (parseFloat(responses[`${dim.id}_current`]) || 2.5);
            const target = dScore?.targetScore !== undefined ? dScore.targetScore : (parseFloat(responses[`${dim.id}_target`]) || 4.2);
            const delta = (target - current).toFixed(1);

            return (
              <DimensionRow
                key={dim.id || idx}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{
                  borderColor: hoveredIdx === idx ? 'rgba(99, 102, 241, 0.8)' : undefined,
                  background: hoveredIdx === idx ? 'rgba(30, 41, 59, 0.95)' : undefined
                }}
              >
                <DimLeft>
                  <span className="name">{dim.name}</span>
                  <span className="desc">{dim.description ? `${dim.description.substring(0, 55)}...` : 'Core capability dimension'}</span>
                </DimLeft>
                <DimScores>
                  <span className="baseline" title="Current Baseline Level">L{current}</span>
                  <span className="arrow">➔</span>
                  <span className="target" title="Target State Level">L{target}</span>
                  <span className="delta">+{delta}</span>
                </DimScores>
              </DimensionRow>
            );
          })}
        </TableWrap>
      </Grid>
    </ChartCard>
  );
};

export default DynamicRadarChart;
