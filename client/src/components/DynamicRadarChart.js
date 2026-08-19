import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTarget, FiLayers, FiEye, FiActivity, FiArrowRight } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';

const ChartCard = styled(motion.div)`
  background: ${props => props.$theme === 'dark' ? 'rgba(15, 23, 42, 0.85)' : '#ffffff'};
  border: ${props => props.$theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1.5px solid #e2e8f0'};
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 32px;
  margin-bottom: 32px;
  box-shadow: ${props => props.$theme === 'dark' ? '0 20px 45px rgba(0, 0, 0, 0.4)' : '0 10px 30px rgba(0, 0, 0, 0.04)'};
  position: relative;
  overflow: hidden;

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
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 28px;
  padding-bottom: 20px;
  border-bottom: 1.5px solid ${props => props.$theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : '#f1f5f9'};
`;

const TitleBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;

  .icon-wrap {
    width: 48px;
    height: 48px;
    border-radius: 14px;
    background: linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.4rem;
    box-shadow: 0 8px 20px rgba(99, 102, 241, 0.35);
    flex-shrink: 0;
  }

  h3 {
    font-size: 1.35rem;
    font-weight: 800;
    color: ${props => props.$theme === 'dark' ? '#f8fafc' : '#0f172a'};
    margin: 0 0 4px 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  p {
    font-size: 0.88rem;
    color: ${props => props.$theme === 'dark' ? '#94a3b8' : '#475569'};
    margin: 0;
  }
`;

const ControlsGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const ControlPill = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid ${props => props.$active 
    ? (props.$color || '#4f46e5') 
    : (props.$theme === 'dark' ? 'rgba(255, 255, 255, 0.12)' : '#e2e8f0')};
  background: ${props => props.$active 
    ? (props.$bg || 'rgba(99, 102, 241, 0.15)') 
    : (props.$theme === 'dark' ? 'rgba(30, 41, 59, 0.6)' : '#ffffff')};
  color: ${props => props.$active 
    ? (props.$textColor || '#4f46e5') 
    : (props.$theme === 'dark' ? '#94a3b8' : '#475569')};

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
`;

const BenchmarkSelect = styled.select`
  background: ${props => props.$theme === 'dark' ? 'rgba(30, 41, 59, 0.8)' : '#ffffff'};
  border: 1.5px solid ${props => props.$theme === 'dark' ? 'rgba(255, 255, 255, 0.15)' : '#cbd5e1'};
  color: ${props => props.$theme === 'dark' ? '#f8fafc' : '#0f172a'};
  border-radius: 10px;
  padding: 6px 12px;
  font-size: 0.8rem;
  font-weight: 700;
  outline: none;
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    border-color: #6366f1;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1.15fr 1fr;
  gap: 36px;
  align-items: center;

  @media (max-width: 1080px) {
    grid-template-columns: 1fr;
  }
`;

const SvgContainer = styled.div`
  width: 100%;
  max-width: 580px;
  margin: 0 auto;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TableWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const DimensionRow = styled.div`
  background: ${props => props.$theme === 'dark' ? (props.$isHovered ? 'rgba(30, 41, 59, 0.95)' : 'rgba(30, 41, 59, 0.5)') : (props.$isHovered ? '#eff6ff' : '#ffffff')};
  border: 1.5px solid ${props => props.$isHovered ? '#4f46e5' : (props.$theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : '#e2e8f0')};
  border-radius: 14px;
  padding: 14px 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${props => props.$isHovered ? '0 8px 20px rgba(79, 70, 229, 0.12)' : (props.$theme === 'dark' ? 'none' : '0 2px 8px rgba(0, 0, 0, 0.02)')};
  cursor: pointer;
  transform: ${props => props.$isHovered ? 'translateX(6px)' : 'translateX(0)'};

  @media print {
    background: #ffffff !important;
    border: 1px solid #e2e8f0 !important;
  }
`;

const DimRowTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const DimLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;

  .name {
    font-weight: 800;
    font-size: 0.94rem;
    color: ${props => props.$theme === 'dark' ? '#f8fafc' : '#0f172a'};
  }

  .desc {
    font-size: 0.8rem;
    color: ${props => props.$theme === 'dark' ? '#94a3b8' : '#475569'};
    line-height: 1.35;
  }
`;

const DimScores = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;

  .baseline-badge {
    color: #dc2626;
    font-weight: 800;
    font-size: 0.82rem;
    background: #fef2f2;
    border: 1px solid #fecaca;
    padding: 3px 8px;
    border-radius: 6px;
  }

  .target-badge {
    color: #15803d;
    font-weight: 800;
    font-size: 0.82rem;
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    padding: 3px 8px;
    border-radius: 6px;
  }

  .delta-pill {
    font-size: 0.82rem;
    font-weight: 900;
    color: #ffffff;
    background: #4f46e5;
    padding: 3px 8px;
    border-radius: 6px;
    box-shadow: 0 2px 6px rgba(79, 70, 229, 0.3);
  }
`;

const DualProgressBar = styled.div`
  position: relative;
  width: 100%;
  height: 8px;
  background: ${props => props.$theme === 'dark' ? 'rgba(15, 23, 42, 0.8)' : '#e2e8f0'};
  border-radius: 9999px;
  overflow: hidden;

  .fill-target {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: ${props => (props.$target / 5) * 100}%;
    background: linear-gradient(90deg, #10b981, #06b6d4);
    border-radius: 9999px;
    opacity: 0.85;
  }

  .fill-baseline {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: ${props => (props.$baseline / 5) * 100}%;
    background: linear-gradient(90deg, #f43f5e, #fb923c);
    border-radius: 9999px;
  }

  .marker-benchmark {
    position: absolute;
    top: 0;
    bottom: 0;
    left: ${props => (props.$benchmark / 5) * 100}%;
    width: 2px;
    background: #6366f1;
    z-index: 5;
  }
`;

const BENCHMARK_PROFILES = {
  global: { name: 'Global Enterprise Avg', score: 3.2, color: '#6366f1' },
  fintech: { name: 'FinTech & Banking', score: 4.1, color: '#0ea5e9' },
  healthcare: { name: 'Healthcare & Life Sciences', score: 3.8, color: '#10b981' },
  digital_native: { name: 'Digital Native & AI SaaS', score: 4.5, color: '#8b5cf6' },
  retail: { name: 'Retail & eCommerce', score: 3.5, color: '#f59e0b' }
};

// Helper: Split long label into 2 balanced lines without ugly ellipsis
function wrapLabel(text, maxChars = 16) {
  if (!text) return ['Dimension'];
  if (text.length <= maxChars) return [text];
  const words = text.split(' ');
  if (words.length === 1) return [text.substring(0, 15) + '..'];
  
  let line1 = '';
  let line2 = '';
  let mid = Math.ceil(words.length / 2);
  line1 = words.slice(0, mid).join(' ');
  line2 = words.slice(mid).join(' ');
  return [line1, line2];
}

const DynamicRadarChart = ({ 
  dimensions = [], 
  dimensionScores = {}, 
  responses = {},
  baselineLabel = 'Baseline Current',
  targetLabel = 'Target Horizon',
  title = 'Dimensional Gap Radar & Target Topology',
  subtitle = 'Multi-axis polygon matrix tracking baseline capability vs desired target state',
  theme = 'light'
}) => {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [selectedBenchmark, setSelectedBenchmark] = useState('global');
  const [showBaseline, setShowBaseline] = useState(true);
  const [showTarget, setShowTarget] = useState(true);
  const [showBenchmark, setShowBenchmark] = useState(true);

  if (!dimensions || dimensions.length < 3) {
    return null;
  }

  const currentBenchmark = BENCHMARK_PROFILES[selectedBenchmark] || BENCHMARK_PROFILES.global;

  const size = 560;
  const center = size / 2;
  const radius = 175;
  const totalAxes = dimensions.length;
  const angleStep = (2 * Math.PI) / totalAxes;

  // Compute coordinates with angle rotation offset
  const getCoordinates = (value, index, maxVal = 5) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = (value / maxVal) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
      angle
    };
  };

  // Build grid concentric polygon vertices (Level 1 to 5)
  const rings = [1, 2, 3, 4, 5];
  const ringPolygons = rings.map((ringVal) => {
    const pts = dimensions.map((_, idx) => {
      const coord = getCoordinates(ringVal, idx);
      return `${coord.x},${coord.y}`;
    }).join(' ');
    return { level: ringVal, points: pts };
  });

  // Baseline Points
  const baselinePoints = dimensions.map((dim, idx) => {
    const dScore = dimensionScores[dim.id];
    const score = dScore?.score !== undefined ? dScore.score : (dScore?.currentScore !== undefined ? dScore.currentScore : (parseFloat(responses[`${dim.id}_current`]) || 2.5));
    const cleanScore = Math.min(5, Math.max(0.5, score));
    return {
      ...getCoordinates(cleanScore, idx),
      score: cleanScore.toFixed(1),
      rawScore: cleanScore
    };
  });
  const baselinePath = baselinePoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ') + ' Z';

  // Target Points
  const targetPoints = dimensions.map((dim, idx) => {
    const dScore = dimensionScores[dim.id];
    const target = dScore?.targetScore !== undefined ? dScore.targetScore : (dScore?.futureScore !== undefined ? dScore.futureScore : (parseFloat(responses[`${dim.id}_target`]) || 4.2));
    const cleanTarget = Math.min(5, Math.max(0.5, target));
    return {
      ...getCoordinates(cleanTarget, idx),
      score: cleanTarget.toFixed(1),
      rawTarget: cleanTarget
    };
  });
  const targetPath = targetPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ') + ' Z';

  // Benchmark Points
  const benchmarkPoints = dimensions.map((_, idx) => getCoordinates(currentBenchmark.score, idx));
  const benchmarkPath = benchmarkPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ') + ' Z';

  return (
    <ChartCard 
      $theme={theme}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Header $theme={theme}>
        <TitleBlock $theme={theme}>
          <div className="icon-wrap">
            <FiTarget />
          </div>
          <div>
            <h3>
              {title}
              <span style={{ fontSize: '0.74rem', fontWeight: 800, background: '#eef2ff', color: '#4f46e5', border: '1px solid #c7d2fe', padding: '2px 8px', borderRadius: '6px' }}>
                5-Axis Topology
              </span>
            </h3>
            <p>{subtitle}</p>
          </div>
        </TitleBlock>

        <ControlsGroup>
          {/* Layer toggles */}
          <ControlPill 
            $theme={theme} 
            $active={showBaseline} 
            $color="#dc2626" 
            $bg="#fee2e2" 
            $textColor="#b91c1c"
            onClick={() => setShowBaseline(!showBaseline)}
          >
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#dc2626' }} />
            {baselineLabel}
          </ControlPill>

          <ControlPill 
            $theme={theme} 
            $active={showTarget} 
            $color="#16a34a" 
            $bg="#dcfce7" 
            $textColor="#15803d"
            onClick={() => setShowTarget(!showTarget)}
          >
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#16a34a' }} />
            {targetLabel}
          </ControlPill>

          <ControlPill 
            $theme={theme} 
            $active={showBenchmark} 
            $color={currentBenchmark.color} 
            $bg="rgba(99, 102, 241, 0.12)" 
            $textColor={currentBenchmark.color}
            onClick={() => setShowBenchmark(!showBenchmark)}
          >
            <span style={{ width: 8, height: 8, borderRadius: '50%', border: `1.5px dashed ${currentBenchmark.color}` }} />
            Benchmark ({currentBenchmark.score})
          </ControlPill>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.78rem', color: theme === 'dark' ? '#94a3b8' : '#64748b', fontWeight: 700 }}>Peer:</span>
            <BenchmarkSelect
              $theme={theme}
              value={selectedBenchmark}
              onChange={(e) => setSelectedBenchmark(e.target.value)}
            >
              {Object.entries(BENCHMARK_PROFILES).map(([key, prof]) => (
                <option key={key} value={key}>
                  {prof.name} ({prof.score})
                </option>
              ))}
            </BenchmarkSelect>
          </div>
        </ControlsGroup>
      </Header>

      <Grid>
        {/* SVG POLAR RADAR CANVAS */}
        <SvgContainer>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <defs>
              {/* Luminous Gradients */}
              <linearGradient id="targetGradStunning" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.45" />
                <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.15" />
              </linearGradient>

              <linearGradient id="baselineGradStunning" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.2" />
              </linearGradient>

              <linearGradient id="wedgeHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0.05" />
              </linearGradient>

              {/* Glow Filter */}
              <filter id="emeraldGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#10b981" floodOpacity="0.45" />
              </filter>
              <filter id="coralGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#ef4444" floodOpacity="0.4" />
              </filter>
            </defs>

            {/* Hovered Wedge Spotlight Highlight */}
            {hoveredIdx !== null && (
              (() => {
                const prevAngle = (hoveredIdx - 0.5) * angleStep - Math.PI / 2;
                const nextAngle = (hoveredIdx + 0.5) * angleStep - Math.PI / 2;
                const x1 = center + radius * Math.cos(prevAngle);
                const y1 = center + radius * Math.sin(prevAngle);
                const x2 = center + radius * Math.cos(nextAngle);
                const y2 = center + radius * Math.sin(nextAngle);
                const wedgePath = `M ${center},${center} L ${x1},${y1} A ${radius},${radius} 0 0,1 ${x2},${y2} Z`;
                return <path d={wedgePath} fill="url(#wedgeHighlight)" />;
              })()
            )}

            {/* Concentric Spiderweb Polygons */}
            {ringPolygons.map(({ level, points }) => {
              const isEven = level % 2 === 0;
              const fillBg = theme === 'dark' 
                ? (isEven ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.04)') 
                : (isEven ? '#f8fafc' : '#ffffff');
              const strokeColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.09)' : '#e2e8f0';

              return (
                <g key={`ring-${level}`}>
                  <polygon
                    points={points}
                    fill={fillBg}
                    stroke={strokeColor}
                    strokeWidth={level === 5 ? '1.5' : '1'}
                    strokeDasharray={level === 5 ? 'none' : '3 3'}
                  />
                  {/* Concentric Level Label */}
                  <text
                    x={center + 6}
                    y={center - (level / 5) * radius + 12}
                    fill={theme === 'dark' ? '#94a3b8' : '#64748b'}
                    fontSize="9.5"
                    fontWeight="800"
                    fontFamily="monospace"
                  >
                    L{level}
                  </text>
                </g>
              );
            })}

            {/* Axis Spokes from Center to Perimeter */}
            {dimensions.map((dim, idx) => {
              const edge = getCoordinates(5, idx);
              const isHovered = hoveredIdx === idx;

              return (
                <line
                  key={`spoke-${dim.id || idx}`}
                  x1={center}
                  y1={center}
                  x2={edge.x}
                  y2={edge.y}
                  stroke={isHovered ? '#6366f1' : (theme === 'dark' ? 'rgba(255, 255, 255, 0.14)' : '#cbd5e1')}
                  strokeWidth={isHovered ? '2' : '1'}
                  strokeDasharray={isHovered ? 'none' : '2 2'}
                />
              );
            })}

            {/* Benchmark Polygon */}
            {showBenchmark && (
              <path
                d={benchmarkPath}
                fill="none"
                stroke={currentBenchmark.color}
                strokeWidth="2"
                strokeDasharray="4 4"
                opacity="0.9"
              />
            )}

            {/* Baseline Polygon */}
            {showBaseline && (
              <path
                d={baselinePath}
                fill="url(#baselineGradStunning)"
                stroke="#ef4444"
                strokeWidth="2.5"
                filter="url(#coralGlow)"
              />
            )}

            {/* Target Polygon */}
            {showTarget && (
              <path
                d={targetPath}
                fill="url(#targetGradStunning)"
                stroke="#10b981"
                strokeWidth="3"
                filter="url(#emeraldGlow)"
              />
            )}

            {/* Gap Connector Lines (Baseline -> Target) */}
            {showBaseline && showTarget && dimensions.map((dim, idx) => {
              const bp = baselinePoints[idx];
              const tp = targetPoints[idx];
              const isHovered = hoveredIdx === idx;

              return (
                <line
                  key={`gap-line-${idx}`}
                  x1={bp.x}
                  y1={bp.y}
                  x2={tp.x}
                  y2={tp.y}
                  stroke={isHovered ? '#4f46e5' : 'rgba(79, 70, 229, 0.4)'}
                  strokeWidth={isHovered ? '2.5' : '1.5'}
                  strokeDasharray="2 2"
                />
              );
            })}

            {/* Baseline Vertex Markers */}
            {showBaseline && baselinePoints.map((p, idx) => (
              <g key={`base-node-${idx}`} style={{ cursor: 'pointer' }} onMouseEnter={() => setHoveredIdx(idx)} onMouseLeave={() => setHoveredIdx(null)}>
                <circle cx={p.x} cy={p.y} r="6" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
                <circle cx={p.x} cy={p.y} r="2.5" fill="#ffffff" />
              </g>
            ))}

            {/* Target Vertex Markers with Badges */}
            {showTarget && targetPoints.map((p, idx) => {
              const isHovered = hoveredIdx === idx;
              return (
                <g key={`target-node-${idx}`} style={{ cursor: 'pointer' }} onMouseEnter={() => setHoveredIdx(idx)} onMouseLeave={() => setHoveredIdx(null)}>
                  <circle cx={p.x} cy={p.y} r={isHovered ? '8' : '6.5'} fill="#10b981" stroke="#ffffff" strokeWidth="2.5" />
                  <circle cx={p.x} cy={p.y} r="3" fill="#ffffff" />
                </g>
              );
            })}

            {/* Center Bullseye Core */}
            <circle cx={center} cy={center} r="7" fill={theme === 'dark' ? '#1e293b' : '#ffffff'} stroke="#6366f1" strokeWidth="2.5" />
            <circle cx={center} cy={center} r="3" fill="#6366f1" />

            {/* Axis Label Pods with Word-Wrapping */}
            {dimensions.map((dim, idx) => {
              const angle = idx * angleStep - Math.PI / 2;
              const cosA = Math.cos(angle);
              const sinA = Math.sin(angle);
              
              // Place label safely beyond outer ring
              const labelRadius = radius + 36;
              const lx = center + labelRadius * cosA;
              const ly = center + labelRadius * sinA;

              // Text anchor calculation
              let textAnchor = 'middle';
              if (cosA > 0.2) textAnchor = 'start';
              else if (cosA < -0.2) textAnchor = 'end';

              const lines = wrapLabel(dim.name, 16);
              const isHovered = hoveredIdx === idx;

              return (
                <g 
                  key={`label-${dim.id || idx}`}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  {lines.length === 1 ? (
                    <text
                      x={lx}
                      y={ly}
                      textAnchor={textAnchor}
                      dominantBaseline="central"
                      fill={isHovered ? '#4f46e5' : (theme === 'dark' ? '#f8fafc' : '#0f172a')}
                      fontSize={isHovered ? "12.5" : "11.5"}
                      fontWeight="800"
                      style={{ transition: 'all 0.2s ease' }}
                    >
                      {lines[0]}
                    </text>
                  ) : (
                    <text
                      x={lx}
                      y={ly}
                      textAnchor={textAnchor}
                      fill={isHovered ? '#4f46e5' : (theme === 'dark' ? '#f8fafc' : '#0f172a')}
                      fontSize={isHovered ? "12" : "11"}
                      fontWeight="800"
                      style={{ transition: 'all 0.2s ease' }}
                    >
                      <tspan x={lx} dy="-7">{lines[0]}</tspan>
                      <tspan x={lx} dy="14">{lines[1]}</tspan>
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </SvgContainer>

        {/* DIMENSIONAL GAP BREAKDOWN LIST */}
        <TableWrap>
          {dimensions.map((dim, idx) => {
            const dScore = dimensionScores[dim.id];
            const current = dScore?.score !== undefined ? dScore.score : (parseFloat(responses[`${dim.id}_current`]) || 2.5);
            const target = dScore?.targetScore !== undefined ? dScore.targetScore : (parseFloat(responses[`${dim.id}_target`]) || 4.2);
            const delta = (target - current).toFixed(1);
            const isHovered = hoveredIdx === idx;

            return (
              <DimensionRow
                key={dim.id || idx}
                $theme={theme}
                $isHovered={isHovered}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                <DimRowTop>
                  <DimLeft $theme={theme}>
                    <span className="name" style={{ color: isHovered ? '#4f46e5' : undefined }}>
                      {dim.name}
                    </span>
                    <span className="desc">
                      {dim.description ? `${dim.description.substring(0, 60)}...` : 'Core capability evaluation'}
                    </span>
                  </DimLeft>

                  <DimScores>
                    <span className="baseline-badge" title="Current Baseline">L{current}</span>
                    <FiArrowRight size={13} color="#94a3b8" />
                    <span className="target-badge" title="Target Horizon">L{target}</span>
                    <span className="delta-pill" title="Capability Growth Gap">+{delta}</span>
                  </DimScores>
                </DimRowTop>

                {/* Progress bar visualizer */}
                <DualProgressBar 
                  $theme={theme} 
                  $baseline={current} 
                  $target={target} 
                  $benchmark={currentBenchmark.score}
                >
                  <div className="fill-target" />
                  <div className="fill-baseline" />
                  <div className="marker-benchmark" title={`Benchmark: ${currentBenchmark.score}`} />
                </DualProgressBar>
              </DimensionRow>
            );
          })}
        </TableWrap>
      </Grid>
    </ChartCard>
  );
};

export default DynamicRadarChart;
