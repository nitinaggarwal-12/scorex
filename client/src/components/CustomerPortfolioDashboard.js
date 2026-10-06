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
  FiActivity,
  FiEdit3,
  FiCopy,
  FiTrash2
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import dynamicAssessmentService from '../services/dynamicAssessmentService';
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
  margin-bottom: 28px;
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
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05);

  &:hover {
    background: #f8fafc;
    border-color: #94a3b8;
    color: #0f172a;
  }
`;

const HeroCard = styled(motion.div)`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 32px;
  margin-bottom: 32px;
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.05);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-top: 24px;
`;

const StatCard = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;

  .label {
    font-size: 0.8rem;
    color: #64748b;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .value {
    font-size: 1.8rem;
    font-weight: 800;
    color: #0f172a;
  }

  .sub {
    font-size: 0.8rem;
    color: #2563eb;
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
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.04);
  transition: all 0.25s ease;

  &:hover {
    border-color: #93c5fd;
    transform: translateY(-2px);
    box-shadow: 0 12px 24px rgba(15, 23, 42, 0.08);
  }
`;

const ScoreBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  color: #059669;
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

  const handleClone = async (item) => {
    try {
      toast.loading(`Cloning "${item.title || 'Assessment'}"...`, { id: 'portfolio-clone' });
      const res = await dynamicAssessmentService.cloneInstance(item.id, 'Portfolio Manager');
      const clonedId = res?.instance?.id;
      if (clonedId) {
        toast.success('Assessment cloned!', { id: 'portfolio-clone' });
        await loadPortfolio();
      } else {
        toast.error('Failed to clone assessment', { id: 'portfolio-clone' });
      }
    } catch (err) {
      toast.error(err?.message || 'Error cloning assessment', { id: 'portfolio-clone' });
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete "${item.title || 'this assessment'}"? This action cannot be undone.`)) {
      return;
    }
    try {
      await dynamicAssessmentService.deleteInstance(item.id);
      toast.success('Assessment deleted');
      await loadPortfolio();
    } catch (err) {
      toast.error(err?.message || 'Failed to delete assessment');
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
            onClick={() => navigate('/assessments/ai-generator')}
            style={{
              background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
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
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #2563eb, #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
              <FiBriefcase color="#fff" />
            </div>
            <div>
              <h1 style={{ fontSize: '1.85rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                {customerName} Enterprise Architecture Portfolio
              </h1>
              <p style={{ color: '#64748b', margin: '4px 0 0 0', fontSize: '0.9rem' }}>
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
        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, margin: '0 0 20px 0', color: '#0f172a' }}>
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
                  <span style={{ fontSize: '0.75rem', background: '#eef2ff', color: '#4338ca', border: '1px solid #c7d2fe', padding: '3px 8px', borderRadius: '6px', fontWeight: 700 }}>
                    {item.status === 'completed' ? 'Completed' : 'In Progress'}
                  </span>

                  {item.overallScore > 0 && (
                    <ScoreBadge>
                      <FiAward /> {item.overallScore} / 5.0
                    </ScoreBadge>
                  )}
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 6px 0', color: '#0f172a' }}>
                  {item.title}
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0 0 16px 0', lineHeight: 1.4 }}>
                  {item.useCase}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid #f1f5f9', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Updated {new Date(item.updatedAt).toLocaleDateString()}
                </span>

                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => navigate(`/assessments/report/${item.id}`)}
                    style={{ background: '#eff6ff', border: '1px solid #bfdbfe', color: '#2563eb', borderRadius: '8px', padding: '6px 10px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <FiFileText size={12} /> Report
                  </button>
                  <button
                    onClick={() => navigate(`/assessments/run/instance/${item.id}`)}
                    style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#334155', borderRadius: '8px', padding: '6px 10px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <FiEdit3 size={12} /> Edit
                  </button>
                  <button
                    onClick={() => handleClone(item)}
                    style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#334155', borderRadius: '8px', padding: '6px 10px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <FiCopy size={12} /> Clone
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: '8px', padding: '6px 10px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <FiTrash2 size={12} /> Delete
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
