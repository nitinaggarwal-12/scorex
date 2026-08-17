import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FiArrowLeft, 
  FiBriefcase, 
  FiAward, 
  FiCheckCircle, 
  FiTrendingUp, 
  FiLayers, 
  FiFileText, 
  FiPlus, 
  FiArrowRight,
  FiActivity
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import dynamicAssessmentService from '../services/dynamicAssessmentService';
import LoadingSpinner from './LoadingSpinner';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0b0f19 0%, #111827 50%, #171b30 100%);
  color: #f8fafc;
  padding: 100px 32px 80px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 90px 16px 60px;
  }
`;

const ContentWrap = styled.div`
  max-width: 1400px;
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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-top: 24px;
`;

const StatCard = styled.div`
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;

  .label {
    font-size: 0.8rem;
    color: #94a3b8;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .value {
    font-size: 1.8rem;
    font-weight: 800;
    color: #ffffff;
  }

  .sub {
    font-size: 0.8rem;
    color: #38bdf8;
    font-weight: 600;
  }
`;

const PortfolioGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 20px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const AssessmentCard = styled(motion.div)`
  background: rgba(15, 23, 42, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 18px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  backdrop-filter: blur(14px);
  transition: all 0.25s ease;

  &:hover {
    border-color: rgba(99, 102, 241, 0.5);
    transform: translateY(-2px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
  }
`;

const ScoreBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: #34d399;
  border-radius: 8px;
  padding: 4px 10px;
  font-size: 0.85rem;
  font-weight: 700;
`;

const CustomerPortfolioDashboard = () => {
  const { customerName } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [portfolioData, setPortfolioData] = useState(null);

  useEffect(() => {
    loadPortfolio();
  }, [customerName]);

  const loadPortfolio = async () => {
    try {
      setLoading(true);
      const data = await dynamicAssessmentService.getCustomerPortfolioRollup(customerName);
      if (data && data.success) {
        setPortfolioData(data);
      } else {
        toast.error('Failed to load customer portfolio data');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load portfolio');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message={`Calculating ${customerName} enterprise portfolio maturity...`} />;
  }

  const portfolio = portfolioData?.portfolio || [];
  const avgMaturity = portfolioData?.averageMaturity || 0;
  const completedCount = portfolioData?.completedAssessments || 0;
  const totalCount = portfolioData?.totalAssessments || 0;

  return (
    <Container>
      <ContentWrap>
        <HeaderNav>
          <BackButton onClick={() => navigate('/assessments')}>
            <FiArrowLeft /> Back to All Assessments
          </BackButton>

          <button
            onClick={() => navigate('/assessments/generate')}
            style={{
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              padding: '9px 18px',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <FiPlus /> New Initiative for {customerName}
          </button>
        </HeaderNav>

        {/* Enterprise Portfolio Hero */}
        <HeroCard initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
              <FiBriefcase color="#fff" />
            </div>
            <div>
              <h1 style={{ fontSize: '1.85rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>
                {customerName} Enterprise Architecture Portfolio
              </h1>
              <p style={{ color: '#94a3b8', margin: '4px 0 0 0', fontSize: '0.9rem' }}>
                Holistic multi-domain maturity posture across cloud, data, security, and AI initiatives.
              </p>
            </div>
          </div>

          <StatsGrid>
            <StatCard>
              <span className="label">Total Initiatives</span>
              <span className="value">{totalCount}</span>
              <span className="sub">{completedCount} Evaluated</span>
            </StatCard>

            <StatCard>
              <span className="label">Enterprise Maturity Index</span>
              <span className="value">{avgMaturity.toFixed(1)} / 5.0</span>
              <span className="sub">{avgMaturity >= 4 ? 'Optimize Stage' : avgMaturity >= 3 ? 'Formalize Stage' : 'Explore Stage'}</span>
            </StatCard>

            <StatCard>
              <span className="label">Assessment Completion</span>
              <span className="value">{totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}%</span>
              <span className="sub">Enterprise Coverage</span>
            </StatCard>
          </StatsGrid>
        </HeroCard>

        {/* Portfolio List */}
        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, margin: '0 0 20px 0', color: '#ffffff' }}>
          Active & Completed Modernization Initiatives ({portfolio.length})
        </h2>

        <PortfolioGrid>
          {portfolio.map((item, idx) => (
            <AssessmentCard
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.75rem', background: 'rgba(99, 102, 241, 0.2)', color: '#c084fc', border: '1px solid rgba(139, 92, 246, 0.4)', padding: '3px 8px', borderRadius: '6px', fontWeight: 700 }}>
                    {item.status === 'completed' ? 'Completed' : 'In Progress'}
                  </span>

                  {item.overallScore > 0 && (
                    <ScoreBadge>
                      <FiAward /> {item.overallScore} / 5.0
                    </ScoreBadge>
                  )}
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 6px 0', color: '#ffffff' }}>
                  {item.title}
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0 0 16px 0', lineHeight: 1.4 }}>
                  {item.useCase}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Updated {new Date(item.updatedAt).toLocaleDateString()}
                </span>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => navigate(`/assessments/report/${item.id}`)}
                    style={{ background: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(59, 130, 246, 0.3)', color: '#60a5fa', borderRadius: '8px', padding: '6px 12px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <FiFileText /> Report
                  </button>
                  <button
                    onClick={() => navigate(`/assessments/run/instance/${item.id}`)}
                    style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#ffffff', borderRadius: '8px', padding: '6px 12px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Edit
                  </button>
                </div>
              </div>
            </AssessmentCard>
          ))}
        </PortfolioGrid>
      </ContentWrap>
    </Container>
  );
};

export default CustomerPortfolioDashboard;
