import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { 
  FiAward, 
  FiTrendingUp, 
  FiBarChart2, 
  FiTarget, 
  FiShield, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiLayers,
  FiGlobe
} from "react-icons/fi";
import { HiSparkles } from "react-icons/hi";
import dynamicAssessmentService from "../services/dynamicAssessmentService";

const CardContainer = styled(motion.div)`
  background: rgba(15, 23, 42, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  padding: 32px;
  margin-bottom: 36px;
  backdrop-filter: blur(16px);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
  color: #f8fafc;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 24px;
`;

const TitleBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;

  .icon-wrap {
    width: 46px;
    height: 46px;
    border-radius: 12px;
    background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    font-size: 1.4rem;
    flex-shrink: 0;
    box-shadow: 0 4px 16px rgba(99, 102, 241, 0.35);
  }

  h3 {
    margin: 0 0 4px 0;
    font-size: 1.35rem;
    font-weight: 800;
    color: #ffffff;
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  p {
    margin: 0;
    font-size: 0.86rem;
    color: #94a3b8;
  }
`;

const IndustryTabs = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  background: rgba(30, 41, 59, 0.6);
  padding: 4px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
`;

const IndustryTab = styled.button`
  background: ${props => props.$active ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "transparent"};
  color: ${props => props.$active ? "#ffffff" : "#94a3b8"};
  border: none;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    color: #ffffff;
    background: ${props => props.$active ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "rgba(255, 255, 255, 0.06)"};
  }
`;

const HeroStatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 2fr;
  gap: 24px;
  margin-bottom: 28px;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

const PercentileCard = styled.div`
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.1) 100%);
  border: 1px solid rgba(139, 92, 246, 0.35);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .percentile-number {
    font-size: 3.2rem;
    font-weight: 900;
    background: linear-gradient(135deg, #818cf8 0%, #c084fc 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    line-height: 1;
    margin: 8px 0;
  }

  .tier-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(99, 102, 241, 0.25);
    color: #a5b4fc;
    border: 1px solid rgba(165, 180, 252, 0.4);
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 0.8rem;
    font-weight: 700;
    width: fit-content;
  }
`;

const DistributionContainer = styled.div`
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const BellCurveVisual = styled.div`
  position: relative;
  margin: 20px 0 10px;
  height: 52px;
  background: rgba(15, 23, 42, 0.6);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  display: flex;

  .zone {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.72rem;
    font-weight: 700;
    border-right: 1px dashed rgba(255, 255, 255, 0.15);
    position: relative;
  }

  .laggards { width: 25%; background: rgba(239, 68, 68, 0.12); color: #f87171; }
  .median { width: 50%; background: rgba(59, 130, 246, 0.12); color: #60a5fa; }
  .top-quartile { width: 15%; background: rgba(16, 185, 129, 0.12); color: #34d399; }
  .leaders { width: 10%; background: rgba(168, 85, 247, 0.15); color: #c084fc; border-right: none; }

  .user-pin {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 4px;
    background: #ffffff;
    box-shadow: 0 0 12px #ffffff, 0 0 20px rgba(99, 102, 241, 0.8);
    z-index: 10;
    transition: left 0.4s ease;

    &::after {
      content: "📍 YOU";
      position: absolute;
      top: -22px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 0.68rem;
      font-weight: 900;
      color: #ffffff;
      background: #4f46e5;
      padding: 1px 6px;
      border-radius: 4px;
      white-space: nowrap;
    }
  }
`;

const BenchmarkMatrixTable = styled.div`
  background: rgba(30, 41, 59, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 24px;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1.2fr;
  padding: 12px 18px;
  background: rgba(15, 23, 42, 0.8);
  font-size: 0.76rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #94a3b8;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);

  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1.2fr;
  padding: 14px 18px;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 0.88rem;

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
`;

const StatusPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 0.76rem;
  font-weight: 700;
  width: fit-content;
  background: ${props => {
    if (props.$status === "Industry Leader") return "rgba(168, 85, 247, 0.2)";
    if (props.$status === "Above Median") return "rgba(16, 185, 129, 0.2)";
    if (props.$status === "Moderate Lag") return "rgba(245, 158, 11, 0.2)";
    return "rgba(239, 68, 68, 0.2)";
  }};
  color: ${props => {
    if (props.$status === "Industry Leader") return "#c084fc";
    if (props.$status === "Above Median") return "#34d399";
    if (props.$status === "Moderate Lag") return "#fbbf24";
    return "#f87171";
  }};
  border: 1px solid ${props => {
    if (props.$status === "Industry Leader") return "rgba(168, 85, 247, 0.4)";
    if (props.$status === "Above Median") return "rgba(16, 185, 129, 0.4)";
    if (props.$status === "Moderate Lag") return "rgba(245, 158, 11, 0.4)";
    return "rgba(239, 68, 68, 0.4)";
  }};
`;

const InsightsBanner = styled.div`
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  padding: 18px 22px;
  display: flex;
  align-items: flex-start;
  gap: 14px;

  .icon {
    color: #818cf8;
    font-size: 1.3rem;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .text {
    h4 {
      margin: 0 0 4px 0;
      font-size: 0.92rem;
      font-weight: 700;
      color: #ffffff;
    }
    p {
      margin: 0;
      font-size: 0.84rem;
      color: #cbd5e1;
      line-height: 1.5;
    }
  }
`;

const INDUSTRIES = [
  "Retail & E-Commerce",
  "Financial Services",
  "Healthcare & Life Sciences",
  "Telecommunications & Media",
  "Manufacturing & Supply Chain",
  "High-Tech & Cloud SaaS",
  "Global Cross-Industry"
];

const IndustryPeerBenchmarkingCard = ({ instanceId, defaultIndustry = "Retail & E-Commerce" }) => {
  const [selectedIndustry, setSelectedIndustry] = useState(defaultIndustry);
  const [benchmarkData, setBenchmarkData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (instanceId) {
      loadBenchmarks(selectedIndustry);
    }
  }, [instanceId, selectedIndustry]);

  const loadBenchmarks = async (industry) => {
    try {
      setLoading(true);
      const res = await dynamicAssessmentService.getBenchmarks(instanceId, industry);
      if (res && res.success) {
        setBenchmarkData(res);
      }
    } catch (err) {
      console.error("Failed to load benchmarks:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!benchmarkData) return null;

  const {
    percentile = 78,
    competitiveTier = "Advanced",
    targetBench = { median: 3.1, top10: 4.5 },
    dimensionBenchmarks = [],
    insights = {}
  } = benchmarkData;

  return (
    <CardContainer
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <HeaderRow>
        <TitleBlock>
          <div className="icon-wrap">
            <FiBarChart2 />
          </div>
          <div>
            <h3>
              Industry Peer Benchmarking & Percentile Distribution
              <span style={{ fontSize: "0.74rem", background: "rgba(99, 102, 241, 0.2)", color: "#818cf8", padding: "2px 8px", borderRadius: "4px", border: "1px solid rgba(99, 102, 241, 0.4)" }}>
                VERIFIED PEER COHORT
              </span>
            </h3>
            <p>
              Compare your evaluated architecture maturity against verified industry cohorts, median baselines, and top-decile market leaders.
            </p>
          </div>
        </TitleBlock>

        <IndustryTabs>
          {INDUSTRIES.map(ind => (
            <IndustryTab
              key={ind}
              $active={selectedIndustry === ind}
              onClick={() => setSelectedIndustry(ind)}
            >
              {ind.split(" ")[0]}
            </IndustryTab>
          ))}
        </IndustryTabs>
      </HeaderRow>

      {/* Hero Stats */}
      <HeroStatsGrid>
        <PercentileCard>
          <div>
            <div style={{ fontSize: "0.78rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: "#a5b4fc" }}>
              INDUSTRY PERCENTILE RANK
            </div>
            <div className="percentile-number">{percentile}th</div>
            <div className="tier-badge">
              <FiAward /> {competitiveTier}
            </div>
          </div>
          <div style={{ fontSize: "0.8rem", color: "#94a3b8", marginTop: "12px" }}>
            Positioned ahead of <strong>{percentile}%</strong> of peers in <strong>{selectedIndustry}</strong>.
          </div>
        </PercentileCard>

        <DistributionContainer>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#f8fafc" }}>
              Market Maturity Bell Curve ({selectedIndustry})
            </span>
            <span style={{ fontSize: "0.76rem", color: "#94a3b8" }}>
              Industry Median: <strong>{targetBench.median}/5.0</strong> • Top 10%: <strong>{targetBench.top10}/5.0</strong>
            </span>
          </div>

          <BellCurveVisual>
            <div className="zone laggards">Bottom 25%</div>
            <div className="zone median">Median (25%–75%)</div>
            <div className="zone top-quartile">Top 25%</div>
            <div className="zone leaders">Top 10%</div>
            <div className="user-pin" style={{ left: `${Math.max(5, Math.min(95, percentile))}%` }} />
          </BellCurveVisual>

          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "#64748b" }}>
            <span>Level 1.0 (Ad-hoc)</span>
            <span>Level 3.0 (Standardized)</span>
            <span>Level 5.0 (Autonomous AI)</span>
          </div>
        </DistributionContainer>
      </HeroStatsGrid>

      {/* Dimension Breakdown Table */}
      <BenchmarkMatrixTable>
        <TableHeader>
          <span>Architecture Dimension</span>
          <span>Your Score</span>
          <span>Industry Median</span>
          <span>Top 10% Leaders</span>
          <span>Competitive Status</span>
        </TableHeader>

        {dimensionBenchmarks.map(d => (
          <TableRow key={d.dimensionId}>
            <span style={{ fontWeight: 700, color: "#f8fafc" }}>
              {d.dimensionName}
            </span>
            <span style={{ fontWeight: 800, color: "#38bdf8" }}>
              {d.customerScore} / 5.0
            </span>
            <span style={{ color: "#94a3b8", fontWeight: 600 }}>
              {d.industryMedian} / 5.0
            </span>
            <span style={{ color: "#c084fc", fontWeight: 700 }}>
              {d.top10Score} / 5.0
            </span>
            <div>
              <StatusPill $status={d.status}>
                {d.status === "Industry Leader" && "🏆"}
                {d.status === "Above Median" && "🟢"}
                {d.status === "Moderate Lag" && "⚠️"}
                {d.status === "Critical Gap" && "🔴"}
                {d.status}
              </StatusPill>
            </div>
          </TableRow>
        ))}
      </BenchmarkMatrixTable>

      {/* Strategic Takeaway Banner */}
      {insights?.keyTakeaway && (
        <InsightsBanner>
          <div className="icon">
            <HiSparkles />
          </div>
          <div className="text">
            <h4>Strategic Executive Benchmark Takeaway</h4>
            <p>{insights.keyTakeaway}</p>
          </div>
        </InsightsBanner>
      )}
    </CardContainer>
  );
};

export default IndustryPeerBenchmarkingCard;
