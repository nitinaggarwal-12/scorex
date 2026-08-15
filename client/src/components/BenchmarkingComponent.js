import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FiTrendingUp, 
  FiTrendingDown, 
  FiAward,
  FiUsers,
  FiBarChart2,
  FiTarget
} from 'react-icons/fi';

const BenchmarkContainer = styled(motion.div)`
  background: #ffffff;
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  padding: 32px;
  margin: 32px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const BenchmarkHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f3f4f6;
`;

const BenchmarkTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
`;

const BenchmarkSubtitle = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 8px 0 0 0;
`;

const BenchmarkGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
`;

const BenchmarkCard = styled(motion.div)`
  background: ${props => props.$bgColor || '#f9fafb'};
  border: 2px solid ${props => props.$borderColor || '#e5e7eb'};
  border-radius: 12px;
  padding: 20px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: ${props => props.$accentColor || '#3b82f6'};
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const CardLabel = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const CardIcon = styled.div`
  color: ${props => props.$color || '#3b82f6'};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CardValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CardSubtext = styled.div`
  font-size: 0.875rem;
  color: ${props => props.$color || '#6b7280'};
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
`;

const PercentileBar = styled.div`
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  margin-top: 12px;
  position: relative;
  overflow: hidden;
`;

const PercentileFill = styled(motion.div)`
  height: 100%;
  background: ${props => props.$color || '#3b82f6'};
  border-radius: 4px;
`;

const PercentileMarker = styled.div`
  position: absolute;
  top: -20px;
  left: ${props => props.$position}%;
  transform: translateX(-50%);
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  white-space: nowrap;

  &::after {
    content: '';
    position: absolute;
    top: 18px;
    left: 50%;
    transform: translateX(-50%);
    width: 2px;
    height: 12px;
    background: #9ca3af;
  }
`;

const PillarBenchmark = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 24px;
`;

const PillarCompare = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
`;

const PillarName = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ScoreComparison = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const ScoreLabel = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
`;

const ScoreValue = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.$color || '#1f2937'};
`;

const ComparisonBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${props => props.$bg || '#e0f2fe'};
  color: ${props => props.$color || '#0369a1'};
  margin-top: 8px;
`;

const InsightBox = styled.div`
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border: 2px solid #bfdbfe;
  border-radius: 12px;
  padding: 20px;
  margin-top: 24px;
`;

const InsightTitle = styled.div`
  font-size: 1rem;
  font-weight: 700;
  color: #1e40af;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const InsightList = styled.ul`
  margin: 0;
  padding-left: 20px;
  color: #1e3a8a;

  li {
    margin-bottom: 8px;
    font-size: 0.875rem;
    line-height: 1.6;
  }
`;

const BenchmarkingComponent = ({ 
  assessment, 
  industryBenchmarks, 
  overallScore,
  pillarScores 
}) => {
  const [benchmarkData, setBenchmarkData] = useState(null);

  useEffect(() => {
    if (assessment && industryBenchmarks) {
      calculateBenchmarks();
    }
  }, [assessment, industryBenchmarks, overallScore, pillarScores]);

  const calculateBenchmarks = () => {
    const industry = assessment.industry || 'Technology';
    const industryData = industryBenchmarks[industry] || industryBenchmarks['default'];

    // Calculate percentile (where does this customer rank?)
    const percentile = calculatePercentile(overallScore, industryData.scores);

    // Compare each pillar
    const pillarComparisons = pillarScores.map(pillar => {
      const industryAvg = industryData.pillarAverages?.[pillar.id] || 3.0;
      const diff = pillar.currentScore - industryAvg;
      const diffPercent = ((diff / industryAvg) * 100).toFixed(0);
      
      return {
        ...pillar,
        industryAvg,
        diff,
        diffPercent,
        isAboveAverage: diff > 0
      };
    });

    // Calculate maturity gap comparison
    const avgGap = pillarScores.reduce((sum, p) => sum + (p.futureScore - p.currentScore), 0) / pillarScores.length;
    const industryAvgGap = industryData.averageGap || 1.5;

    setBenchmarkData({
      percentile,
      industryAvg: industryData.averageScore || 3.0,
      industryName: industry,
      pillarComparisons,
      totalAssessments: industryData.count || 50,
      avgGap,
      industryAvgGap,
      performanceTier: getPerformanceTier(percentile)
    });
  };

  const calculatePercentile = (score, industryScores) => {
    // In production, this would query actual data
    // For now, calculate based on normal distribution
    const mean = industryScores?.mean || 3.0;
    const stdDev = industryScores?.stdDev || 0.8;
    
    // Simple percentile calculation
    const zScore = (score - mean) / stdDev;
    const percentile = Math.round(50 + (zScore * 20)); // Approximate
    
    return Math.max(5, Math.min(95, percentile)); // Clamp between 5-95
  };

  const getPerformanceTier = (percentile) => {
    if (percentile >= 80) return { label: 'Leader', color: '#10b981', icon: FiAward };
    if (percentile >= 60) return { label: 'Advanced', color: '#3b82f6', icon: FiTrendingUp };
    if (percentile >= 40) return { label: 'Average', color: '#f59e0b', icon: FiUsers };
    return { label: 'Developing', color: '#ef4444', icon: FiTrendingDown };
  };

  const getComparisonColor = (diff) => {
    if (diff > 0.5) return { bg: '#d1fae5', color: '#065f46', icon: FiTrendingUp };
    if (diff < -0.5) return { bg: '#fee2e2', color: '#991b1b', icon: FiTrendingDown };
    return { bg: '#e0f2fe', color: '#0369a1', icon: FiTarget };
  };

  if (!benchmarkData) {
    return null;
  }

  const TierIcon = benchmarkData.performanceTier.icon;

  return (
    <BenchmarkContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <BenchmarkHeader>
        <FiBarChart2 size={32} color="#3b82f6" />
        <div>
          <BenchmarkTitle>Industry Benchmarking</BenchmarkTitle>
          <BenchmarkSubtitle>
            Compare your maturity against {benchmarkData.totalAssessments}+ {benchmarkData.industryName} organizations
          </BenchmarkSubtitle>
        </div>
      </BenchmarkHeader>

      {/* Key Metrics */}
      <BenchmarkGrid>
        {/* Overall Percentile */}
        <BenchmarkCard
          $bgColor="#fef3c7"
          $borderColor="#fbbf24"
          $accentColor="#f59e0b"
          whileHover={{ scale: 1.02 }}
        >
          <CardHeader>
            <CardLabel>Your Ranking</CardLabel>
            <CardIcon $color="#f59e0b">
              <TierIcon size={24} />
            </CardIcon>
          </CardHeader>
          <CardValue>
            Top {100 - benchmarkData.percentile}%
          </CardValue>
          <CardSubtext $color="#92400e">
            {benchmarkData.performanceTier.label} tier in {benchmarkData.industryName}
          </CardSubtext>
          <PercentileBar>
            <PercentileFill
              $color="#f59e0b"
              initial={{ width: 0 }}
              animate={{ width: `${benchmarkData.percentile}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
            <PercentileMarker $position={50}>
              Industry Avg
            </PercentileMarker>
          </PercentileBar>
        </BenchmarkCard>

        {/* Overall Score Comparison */}
        <BenchmarkCard
          $bgColor="#dbeafe"
          $borderColor="#3b82f6"
          $accentColor="#2563eb"
          whileHover={{ scale: 1.02 }}
        >
          <CardHeader>
            <CardLabel>Overall Maturity</CardLabel>
            <CardIcon $color="#3b82f6">
              <FiTarget size={24} />
            </CardIcon>
          </CardHeader>
          <CardValue>
            {overallScore.toFixed(1)}
            <span style={{ fontSize: '1rem', color: '#6b7280', fontWeight: 400 }}>
              / 5.0
            </span>
          </CardValue>
          <CardSubtext $color={overallScore >= benchmarkData.industryAvg ? '#10b981' : '#ef4444'}>
            {overallScore >= benchmarkData.industryAvg ? <FiTrendingUp /> : <FiTrendingDown />}
            {Math.abs(overallScore - benchmarkData.industryAvg).toFixed(1)} vs industry avg ({benchmarkData.industryAvg.toFixed(1)})
          </CardSubtext>
        </BenchmarkCard>

        {/* Ambition Level */}
        <BenchmarkCard
          $bgColor="#e0f2fe"
          $borderColor="#0ea5e9"
          $accentColor="#0284c7"
          whileHover={{ scale: 1.02 }}
        >
          <CardHeader>
            <CardLabel>Ambition Level</CardLabel>
            <CardIcon $color="#0ea5e9">
              <FiTrendingUp size={24} />
            </CardIcon>
          </CardHeader>
          <CardValue>
            {benchmarkData.avgGap.toFixed(1)}
            <span style={{ fontSize: '1rem', color: '#6b7280', fontWeight: 400 }}>
              levels
            </span>
          </CardValue>
          <CardSubtext $color={benchmarkData.avgGap >= benchmarkData.industryAvgGap ? '#10b981' : '#6b7280'}>
            {benchmarkData.avgGap >= benchmarkData.industryAvgGap ? <FiTrendingUp /> : <FiTarget />}
            {benchmarkData.avgGap >= benchmarkData.industryAvgGap ? 'More ambitious' : 'Moderate'} vs peers ({benchmarkData.industryAvgGap.toFixed(1)})
          </CardSubtext>
        </BenchmarkCard>
      </BenchmarkGrid>

      {/* Pillar-by-Pillar Comparison */}
      <div style={{ marginTop: '32px' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#1f2937', marginBottom: '16px' }}>
          Pillar Performance vs {benchmarkData.industryName} Average
        </h3>
        
        <PillarBenchmark>
          {benchmarkData.pillarComparisons.map((pillar, idx) => {
            const comparisonStyle = getComparisonColor(pillar.diff);
            const CompIcon = comparisonStyle.icon;
            
            return (
              <PillarCompare key={idx}>
                <PillarName>
                  {pillar.icon} {pillar.name}
                </PillarName>
                
                <ScoreComparison>
                  <div>
                    <ScoreLabel>Your Score</ScoreLabel>
                    <ScoreValue $color="#1f2937">
                      {pillar.currentScore.toFixed(1)}
                    </ScoreValue>
                  </div>
                  
                  <div style={{ textAlign: 'right' }}>
                    <ScoreLabel>Industry Avg</ScoreLabel>
                    <ScoreValue $color="#6b7280">
                      {pillar.industryAvg.toFixed(1)}
                    </ScoreValue>
                  </div>
                </ScoreComparison>
                
                <ComparisonBadge $bg={comparisonStyle.bg} $color={comparisonStyle.color}>
                  <CompIcon size={12} />
                  {pillar.isAboveAverage ? '+' : ''}{pillar.diffPercent}% vs avg
                </ComparisonBadge>
              </PillarCompare>
            );
          })}
        </PillarBenchmark>
      </div>

      {/* Insights */}
      <InsightBox>
        <InsightTitle>
          <FiAward size={20} />
          Key Insights
        </InsightTitle>
        <InsightList>
          {benchmarkData.percentile >= 60 && (
            <li>
              <strong>Strong Performance:</strong> You rank in the top {100 - benchmarkData.percentile}% of {benchmarkData.industryName} organizations, indicating mature data practices.
            </li>
          )}
          
          {benchmarkData.pillarComparisons.filter(p => p.diff > 0.5).length > 0 && (
            <li>
              <strong>Areas of Excellence:</strong> You outperform industry average in {' '}
              {benchmarkData.pillarComparisons.filter(p => p.diff > 0.5).map(p => p.name).join(', ')}.
            </li>
          )}
          
          {benchmarkData.pillarComparisons.filter(p => p.diff < -0.5).length > 0 && (
            <li>
              <strong>Growth Opportunities:</strong> Focus on {' '}
              {benchmarkData.pillarComparisons.filter(p => p.diff < -0.5).map(p => p.name).join(', ')} {' '}
              to reach industry benchmarks.
            </li>
          )}
          
          {benchmarkData.avgGap > benchmarkData.industryAvgGap && (
            <li>
              <strong>Ambitious Roadmap:</strong> Your target maturity is {' '}
              {((benchmarkData.avgGap / benchmarkData.industryAvgGap - 1) * 100).toFixed(0)}% more ambitious than typical {benchmarkData.industryName} peers.
            </li>
          )}

          <li>
            <strong>Competitive Position:</strong> Closing your maturity gaps could move you into the top {Math.max(5, benchmarkData.percentile - 15)}% of {benchmarkData.industryName} organizations.
          </li>
        </InsightList>
      </InsightBox>
    </BenchmarkContainer>
  );
};

export default BenchmarkingComponent;


