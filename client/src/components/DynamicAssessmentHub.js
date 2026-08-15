import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiFolder, 
  FiPlus, 
  FiEye, 
  FiCopy, 
  FiTrash2, 
  FiCalendar,
  FiUser,
  FiMail,
  FiBarChart2,
  FiCheckCircle,
  FiClock,
  FiSearch,
  FiFilter,
  FiList,
  FiAward,
  FiLayers,
  FiToggleLeft,
  FiToggleRight,
  FiTarget,
  FiArrowRight
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import toast from 'react-hot-toast';
import dynamicAssessmentService from '../services/dynamicAssessmentService';
import LoadingSpinner from './LoadingSpinner';

const HubContainer = styled.div`
  min-height: calc(100vh - 80px);
  background: linear-gradient(135deg, #0b0f19 0%, #111827 50%, #171b30 100%);
  color: #f3f4f6;
  padding: 40px 24px;
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 36px;
  flex-wrap: wrap;
  gap: 20px;
`;

const HeaderTitle = styled.h1`
  font-size: 2.4rem;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 8px;
`;

const HeaderSubtitle = styled.p`
  color: #94a3b8;
  font-size: 1.05rem;
`;

const CreateBtn = styled.button`
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  color: white;
  border: none;
  border-radius: 14px;
  padding: 14px 28px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 10px 25px rgba(99, 102, 241, 0.4);
  display: inline-flex;
  align-items: center;
  gap: 10px;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 30px rgba(99, 102, 241, 0.6);
  }
`;

const TabBar = styled.div`
  display: flex;
  gap: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 16px;
  margin-bottom: 32px;
`;

const Tab = styled.button`
  background: ${props => props.$active ? 'rgba(99, 102, 241, 0.2)' : 'transparent'};
  border: 1px solid ${props => props.$active ? '#818cf8' : 'transparent'};
  color: ${props => props.$active ? '#ffffff' : '#94a3b8'};
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: #ffffff;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 24px;
`;

const TypeCard = styled.div`
  background: rgba(30, 41, 59, 0.6);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.2s ease;

  &:hover {
    border-color: rgba(129, 140, 248, 0.4);
    transform: translateY(-3px);
  }
`;

const TypeBadge = styled.span`
  background: rgba(99, 102, 241, 0.2);
  color: #a5b4fc;
  border: 1px solid rgba(99, 102, 241, 0.3);
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 700;
  display: inline-block;
  margin-bottom: 12px;
`;

const TypeTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 8px;
`;

const TypeDesc = styled.p`
  color: #94a3b8;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 20px;
  flex: 1;
`;

const TypeFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: 18px;
  gap: 12px;
`;

const PromoteToggle = styled.button`
  background: transparent;
  border: none;
  color: ${props => props.$promoted ? '#10b981' : '#64748b'};
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;

  svg {
    font-size: 1.4rem;
  }
`;

const LaunchBtn = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 8px 16px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: #6366f1;
    border-color: #6366f1;
  }
`;

const CustomerCard = styled.div`
  background: rgba(30, 41, 59, 0.6);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 28px;
  margin-bottom: 24px;
`;

const CustomerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: 16px;
  margin-bottom: 20px;
`;

const AssessmentRow = styled.div`
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
`;

const DynamicAssessmentHub = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('types'); // 'types' or 'customers' or 'instances'
  const [loading, setLoading] = useState(true);
  const [types, setTypes] = useState([]);
  const [instances, setInstances] = useState([]);

  useEffect(() => {
    loadHubData();
  }, []);

  const loadHubData = async () => {
    setLoading(true);
    try {
      const [typesRes, instancesRes] = await Promise.all([
        dynamicAssessmentService.getAssessmentTypes(false),
        dynamicAssessmentService.getInstances()
      ]);
      setTypes(typesRes || []);
      setInstances(instancesRes || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load assessment hub data');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePromote = async (type) => {
    try {
      const newStatus = !type.isPromoted;
      await dynamicAssessmentService.togglePromotion(type.id || type.typeKey, newStatus);
      setTypes(prev => prev.map(t => (t.id === type.id || t.typeKey === type.typeKey) ? { ...t, isPromoted: newStatus } : t));
      toast.success(newStatus ? `"${type.title}" pinned to Assessments menu` : `"${type.title}" unpinned`);
      window.dispatchEvent(new Event('assessment-types-updated'));
    } catch (err) {
      console.error(err);
      toast.error('Failed to update promotion status');
    }
  };

  // Group instances by customer
  const customerMap = {};
  instances.forEach(inst => {
    const cust = inst.customerName || 'Other';
    if (!customerMap[cust]) {
      customerMap[cust] = [];
    }
    customerMap[cust].push(inst);
  });

  if (loading) {
    return <LoadingSpinner message="Loading Assessment Hub..." />;
  }

  return (
    <HubContainer>
      <ContentWrapper>
        <HeaderSection>
          <div>
            <HeaderTitle>Assessment Types & Portfolio</HeaderTitle>
            <HeaderSubtitle>
              Manage AI-generated assessment frameworks, promote them to the main menu, and track multi-assessment customer portfolios.
            </HeaderSubtitle>
          </div>

          <CreateBtn onClick={() => navigate('/assessments/ai-generator')}>
            <HiSparkles />
            Create with Gemini 3.7
          </CreateBtn>
        </HeaderSection>

        <TabBar>
          <Tab $active={activeTab === 'types'} onClick={() => setActiveTab('types')}>
            <FiAward style={{ marginRight: '6px' }} />
            Assessment Types ({types.length + 2})
          </Tab>
          <Tab $active={activeTab === 'customers'} onClick={() => setActiveTab('customers')}>
            <FiUser style={{ marginRight: '6px' }} />
            Customer Portfolios ({Object.keys(customerMap).length})
          </Tab>
          <Tab $active={activeTab === 'instances'} onClick={() => setActiveTab('instances')}>
            <FiList style={{ marginRight: '6px' }} />
            All Assessment Runs ({instances.length})
          </Tab>
        </TabBar>

        {/* Tab 1: Assessment Types */}
        {activeTab === 'types' && (
          <Grid>
            {/* Standard 6-Pillar Card */}
            <TypeCard>
              <div>
                <TypeBadge style={{ background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8' }}>Core Framework</TypeBadge>
                <TypeTitle>Data & AI Enterprise Maturity Assessment</TypeTitle>
                <TypeDesc>
                  Comprehensive 6-pillar evaluation across Platform & Governance, Data Engineering, Analytics & BI, ML, GenAI, and Operations.
                </TypeDesc>
              </div>
              <TypeFooter>
                <span style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: '600' }}>✓ Core Pinned</span>
                <LaunchBtn onClick={() => navigate('/start')}>
                  Launch <FiArrowRight />
                </LaunchBtn>
              </TypeFooter>
            </TypeCard>

            {/* Gen AI Readiness Card */}
            <TypeCard>
              <div>
                <TypeBadge style={{ background: 'rgba(168, 85, 247, 0.2)', color: '#c084fc' }}>Specialized</TypeBadge>
                <TypeTitle>Generative AI Readiness Assessment</TypeTitle>
                <TypeDesc>
                  Executive evaluation of organizational, use case, platform, and ethical readiness for Generative AI deployment.
                </TypeDesc>
              </div>
              <TypeFooter>
                <span style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: '600' }}>✓ Core Pinned</span>
                <LaunchBtn onClick={() => navigate('/genai-readiness')}>
                  Launch <FiArrowRight />
                </LaunchBtn>
              </TypeFooter>
            </TypeCard>

            {/* Dynamic Custom Types */}
            {types.map((type, idx) => (
              <TypeCard key={type.id || type.typeKey || idx}>
                <div>
                  <TypeBadge>{type.badge || 'AI Generated'}</TypeBadge>
                  <TypeTitle>{type.title}</TypeTitle>
                  <TypeDesc>{type.description || 'Custom structured assessment framework.'}</TypeDesc>
                </div>
                <TypeFooter>
                  <PromoteToggle 
                    $promoted={type.isPromoted}
                    onClick={() => handleTogglePromote(type)}
                  >
                    {type.isPromoted ? <FiToggleRight /> : <FiToggleLeft />}
                    {type.isPromoted ? 'In Nav Menu' : 'Hidden from Nav'}
                  </PromoteToggle>

                  <LaunchBtn onClick={() => navigate(`/assessments/ai-generator`)}>
                    View / Run <FiArrowRight />
                  </LaunchBtn>
                </TypeFooter>
              </TypeCard>
            ))}
          </Grid>
        )}

        {/* Tab 2: Customer Portfolios (Multi-assessment view) */}
        {activeTab === 'customers' && (
          <div>
            {Object.keys(customerMap).length === 0 ? (
              <p style={{ color: '#94a3b8' }}>No assessment runs recorded yet. Start one using the AI Generator!</p>
            ) : (
              Object.entries(customerMap).map(([customerName, runs]) => (
                <CustomerCard key={customerName}>
                  <CustomerHeader>
                    <div>
                      <h3 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#ffffff', marginBottom: '4px' }}>
                        {customerName}
                      </h3>
                      <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                        {runs.length} Assessment{runs.length > 1 ? 's' : ''} Completed / In-Progress
                      </span>
                    </div>
                  </CustomerHeader>

                  {runs.map((run) => (
                    <AssessmentRow key={run.id}>
                      <div>
                        <strong style={{ color: '#e2e8f0', fontSize: '1.05rem', display: 'block' }}>
                          {run.frameworkSnapshot?.title || run.typeKey}
                        </strong>
                        {run.useCase && (
                          <span style={{ fontSize: '0.85rem', color: '#38bdf8' }}>
                            Initiative: {run.useCase}
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Score</div>
                          <div style={{ color: '#38bdf8', fontWeight: '700' }}>
                            {run.totalScore ? `${run.totalScore}/5.0` : 'Draft'}
                          </div>
                        </div>

                        <LaunchBtn onClick={() => navigate(run.status === 'completed' ? `/assessments/report/${run.id}` : `/assessments/run/instance/${run.id}`)}>
                          {run.status === 'completed' ? 'View Executive Report' : 'Resume Assessment'}
                          <FiArrowRight />
                        </LaunchBtn>
                      </div>
                    </AssessmentRow>
                  ))}
                </CustomerCard>
              ))
            )}
          </div>
        )}

        {/* Tab 3: All Instances */}
        {activeTab === 'instances' && (
          <div>
            {instances.map((run) => (
              <AssessmentRow key={run.id} style={{ background: 'rgba(30, 41, 59, 0.6)' }}>
                <div>
                  <strong style={{ color: '#ffffff', fontSize: '1.1rem', display: 'block' }}>
                    {run.frameworkSnapshot?.title || run.typeKey}
                  </strong>
                  <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                    Customer: <strong style={{ color: '#38bdf8' }}>{run.customerName}</strong>
                    {run.useCase && ` | Initiative: ${run.useCase}`}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ fontSize: '0.85rem', color: run.status === 'completed' ? '#10b981' : '#f59e0b' }}>
                    {run.status === 'completed' ? '✓ Completed' : '⏱ In Progress'}
                  </span>

                  <LaunchBtn onClick={() => navigate(run.status === 'completed' ? `/assessments/report/${run.id}` : `/assessments/run/instance/${run.id}`)}>
                    {run.status === 'completed' ? 'View Report' : 'Continue'}
                    <FiArrowRight />
                  </LaunchBtn>
                </div>
              </AssessmentRow>
            ))}
          </div>
        )}
      </ContentWrapper>
    </HubContainer>
  );
};

export default DynamicAssessmentHub;
