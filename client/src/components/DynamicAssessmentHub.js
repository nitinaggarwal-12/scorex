import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiPlus, 
  FiEye, 
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
  FiArrowRight,
  FiPlay,
  FiCheck,
  FiExternalLink,
  FiChevronDown,
  FiChevronUp,
  FiHelpCircle
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import toast from 'react-hot-toast';
import dynamicAssessmentService from '../services/dynamicAssessmentService';
import assessmentService from '../services/assessmentService';
import LoadingSpinner from './LoadingSpinner';

const HubContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0b0f19 0%, #111827 50%, #171b30 100%);
  color: #f3f4f6;
  padding: 108px 36px 60px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 92px 16px 40px;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1560px;
  margin: 0 auto;
  width: 100%;
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    margin-bottom: 24px;
  }
`;

const HeaderTitle = styled.h1`
  font-size: 2.4rem;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 8px;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

const HeaderSubtitle = styled.p`
  color: #94a3b8;
  font-size: 1.05rem;
  line-height: 1.5;
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
  justify-content: center;
  gap: 10px;
  transition: all 0.2s ease;
  min-height: 48px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 30px rgba(99, 102, 241, 0.6);
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
`;

const StatCard = styled.div`
  background: rgba(30, 41, 59, 0.5);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  gap: 16px;
`;

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${props => props.$bg || 'rgba(99, 102, 241, 0.15)'};
  color: ${props => props.$color || '#818cf8'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  flex-shrink: 0;
`;

const StatInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const StatValue = styled.div`
  font-size: 1.6rem;
  font-weight: 800;
  color: #ffffff;
  line-height: 1.2;
`;

const StatLabel = styled.div`
  font-size: 0.85rem;
  color: #94a3b8;
  font-weight: 500;
`;

const TabBar = styled.div`
  display: flex;
  gap: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 16px;
  margin-bottom: 32px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`;

const Tab = styled.button`
  background: ${props => props.$active ? 'rgba(99, 102, 241, 0.2)' : 'transparent'};
  border: 1px solid ${props => props.$active ? '#818cf8' : 'transparent'};
  color: ${props => props.$active ? '#ffffff' : '#94a3b8'};
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  gap: 8px;

  &:hover {
    color: #ffffff;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 24px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
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
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(99, 102, 241, 0.4);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35);
  }

  @media (max-width: 768px) {
    padding: 20px 16px;
    border-radius: 16px;
  }
`;

const CardTopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
`;

const TypeBadge = styled.span`
  background: ${props => props.$bg || 'rgba(99, 102, 241, 0.2)'};
  color: ${props => props.$color || '#818cf8'};
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

const StatusTag = styled.span`
  background: ${props => props.$status === 'production' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)'};
  color: ${props => props.$status === 'production' ? '#10b981' : '#f59e0b'};
  border: 1px solid ${props => props.$status === 'production' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'};
  padding: 3px 10px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 700;
`;

const TypeTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 8px;
  line-height: 1.3;
`;

const TypeDesc = styled.p`
  color: #94a3b8;
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 16px;
`;

const MetaPillsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
`;

const MetaPill = styled.span`
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  padding: 4px 10px;
  font-size: 0.78rem;
  color: #cbd5e1;
  display: inline-flex;
  align-items: center;
  gap: 5px;
`;

const DimensionsAccordion = styled.div`
  background: rgba(15, 23, 42, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  padding: 12px 16px;
  margin-bottom: 20px;
`;

const AccordionToggle = styled.button`
  background: none;
  border: none;
  color: #818cf8;
  font-size: 0.85rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  cursor: pointer;
  padding: 0;

  &:hover {
    color: #a5b4fc;
  }
`;

const DimensionList = styled.div`
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 0.85rem;
  color: #94a3b8;
`;

const DimensionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #cbd5e1;

  svg {
    color: #10b981;
    font-size: 0.9rem;
    flex-shrink: 0;
  }
`;

const TypeFooter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: 16px;
  margin-top: auto;
`;

const ActionButtonsRow = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const LaunchBtn = styled.button`
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 10px 18px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
  flex: 1;
  min-height: 40px;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 15px rgba(99, 102, 241, 0.4);
  }
`;

const SampleBtn = styled.button`
  background: rgba(56, 189, 248, 0.15);
  border: 1px solid rgba(56, 189, 248, 0.3);
  color: #38bdf8;
  border-radius: 10px;
  padding: 10px 16px;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.2s ease;
  min-height: 40px;

  &:hover {
    background: rgba(56, 189, 248, 0.25);
    color: #ffffff;
  }
`;

const SecondaryActionsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
`;

const PromoteToggle = styled.button`
  background: none;
  border: none;
  color: ${props => props.$promoted ? '#10b981' : '#64748b'};
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  padding: 4px 0;
  transition: color 0.2s ease;

  &:hover {
    color: ${props => props.$promoted ? '#34d399' : '#94a3b8'};
  }

  svg {
    font-size: 1.1rem;
  }
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #ef4444;
  font-size: 0.8rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  opacity: 0.7;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
    text-decoration: underline;
  }
`;

// Start Assessment Modal
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: #1e293b;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 24px;
  padding: 36px;
  width: 100%;
  max-width: 540px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);

  @media (max-width: 640px) {
    padding: 24px 18px;
    border-radius: 18px;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #94a3b8;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 12px 16px;
  color: #ffffff;
  font-size: 0.95rem;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #818cf8;
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
  flex-wrap: wrap;
  gap: 12px;
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
  const [activeTab, setActiveTab] = useState('production'); // 'production', 'drafts', 'portfolio'
  const [loading, setLoading] = useState(true);
  const [types, setTypes] = useState([]);
  const [instances, setInstances] = useState([]);
  const [expandedPreview, setExpandedPreview] = useState({});
  const [startModalType, setStartModalType] = useState(null);
  const [modalForm, setModalForm] = useState({
    customerName: '',
    useCase: '',
    contactEmail: ''
  });

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

  const handleDeleteType = async (type) => {
    if (!window.confirm(`Are you sure you want to delete template "${type.title}"?`)) return;
    try {
      await dynamicAssessmentService.deleteAssessmentType(type.id || type.typeKey);
      setTypes(prev => prev.filter(t => t.id !== type.id && t.typeKey !== type.typeKey));
      toast.success(`Template "${type.title}" deleted.`);
      window.dispatchEvent(new Event('assessment-types-updated'));
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete template');
    }
  };

  const handleOpenStartModal = (type) => {
    setStartModalType(type);
    setModalForm({
      customerName: 'Enterprise Client Corp',
      useCase: type.framework?.title ? `${type.framework.title} Initiative` : 'Digital Transformation',
      contactEmail: 'lead.evaluator@enterprise.com'
    });
  };

  const handleLaunchAssessment = async (e) => {
    e.preventDefault();
    if (!modalForm.customerName.trim()) {
      toast.error('Organization / Customer name is required');
      return;
    }

    try {
      toast.loading('Initializing customer assessment...', { id: 'launch-assessment' });
      const instance = await dynamicAssessmentService.createInstance({
        typeKey: startModalType.typeKey,
        customerName: modalForm.customerName.trim(),
        useCase: modalForm.useCase.trim(),
        contactEmail: modalForm.contactEmail.trim(),
        frameworkSnapshot: startModalType.framework,
        responses: {}
      });

      toast.success('Assessment initialized!', { id: 'launch-assessment' });
      setStartModalType(null);
      navigate(`/assessments/run/instance/${instance.id}`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to launch assessment', { id: 'launch-assessment' });
    }
  };

  const handleTrySample = async (type) => {
    try {
      toast.loading(`Spinning up sample for "${type.title}"...`, { id: 'sample-run' });
      const result = await dynamicAssessmentService.generateSampleForType(type.typeKey);
      toast.success('Sample assessment loaded!', { id: 'sample-run' });
      navigate(`/assessments/run/instance/${result.instanceId}`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate sample assessment', { id: 'sample-run' });
    }
  };

  const togglePreview = (typeKey) => {
    setExpandedPreview(prev => ({
      ...prev,
      [typeKey]: !prev[typeKey]
    }));
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

  const productionTypes = types.filter(t => (t.status === 'production' || t.isPromoted));
  const draftTypes = types.filter(t => t.status === 'draft' && !t.isPromoted);

  if (loading) {
    return <LoadingSpinner message="Loading Assessment Hub..." />;
  }

  return (
    <HubContainer>
      <ContentWrapper>
        <HeaderSection>
          <div>
            <HeaderTitle>Assessment Catalog & Templates</HeaderTitle>
            <HeaderSubtitle>
              Explore verified production-ready frameworks, launch customized customer evaluations, and manage AI-generated assessment drafts.
            </HeaderSubtitle>
          </div>

          <CreateBtn onClick={() => navigate('/assessments/ai-generator')}>
            <HiSparkles />
            Create with Gemini 3.7
          </CreateBtn>
        </HeaderSection>

        <StatsGrid>
          <StatCard>
            <StatIcon $bg="rgba(16, 185, 129, 0.15)" $color="#10b981">
              <FiCheckCircle />
            </StatIcon>
            <StatInfo>
              <StatValue>{productionTypes.length + 2}</StatValue>
              <StatLabel>Production Ready Frameworks</StatLabel>
            </StatInfo>
          </StatCard>

          <StatCard>
            <StatIcon $bg="rgba(245, 158, 11, 0.15)" $color="#f59e0b">
              <FiAward />
            </StatIcon>
            <StatInfo>
              <StatValue>{draftTypes.length}</StatValue>
              <StatLabel>Draft & AI-Generated Frameworks</StatLabel>
            </StatInfo>
          </StatCard>

          <StatCard>
            <StatIcon $bg="rgba(56, 189, 248, 0.15)" $color="#38bdf8">
              <FiBarChart2 />
            </StatIcon>
            <StatInfo>
              <StatValue>{instances.length}</StatValue>
              <StatLabel>Active Customer Evaluations</StatLabel>
            </StatInfo>
          </StatCard>
        </StatsGrid>

        <TabBar>
          <Tab $active={activeTab === 'production'} onClick={() => setActiveTab('production')}>
            <FiCheckCircle />
            Production Ready ({productionTypes.length + 2})
          </Tab>
          <Tab $active={activeTab === 'drafts'} onClick={() => setActiveTab('drafts')}>
            <FiAward />
            Drafts & AI Frameworks ({draftTypes.length})
          </Tab>
          <Tab $active={activeTab === 'portfolio'} onClick={() => setActiveTab('portfolio')}>
            <FiList />
            Customer Portfolio Runs ({instances.length})
          </Tab>
        </TabBar>

        {/* Tab 1: Production Ready Templates */}
        {activeTab === 'production' && (
          <Grid>
            {/* Core Framework: Enterprise Data & AI Maturity Assessment */}
            <TypeCard>
              <div>
                <CardTopRow>
                  <TypeBadge $bg="rgba(56, 189, 248, 0.2)" $color="#38bdf8">Core Platform</TypeBadge>
                  <StatusTag $status="production">Production Ready</StatusTag>
                </CardTopRow>
                <TypeTitle>Enterprise Data & AI Maturity Assessment</TypeTitle>
                <TypeDesc>
                  Comprehensive 6-pillar benchmark across Platform & Governance, Data Engineering, Analytics & BI, ML, GenAI, and Operations.
                </TypeDesc>
                <MetaPillsRow>
                  <MetaPill><FiLayers /> 6 Core Pillars</MetaPill>
                  <MetaPill><FiTarget /> 30 Questions</MetaPill>
                  <MetaPill><FiClock /> ~20 mins</MetaPill>
                </MetaPillsRow>
              </div>
              <TypeFooter>
                <ActionButtonsRow>
                  <LaunchBtn onClick={() => navigate('/start')}>
                    <FiPlay /> Start Assessment
                  </LaunchBtn>
                  <SampleBtn onClick={() => navigate('/dashboard')}>
                    🧪 Try Sample
                  </SampleBtn>
                </ActionButtonsRow>
                <SecondaryActionsRow>
                  <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: '600' }}>✓ Core Pinned</span>
                </SecondaryActionsRow>
              </TypeFooter>
            </TypeCard>

            {/* Specialized: Generative AI Readiness Assessment */}
            <TypeCard>
              <div>
                <CardTopRow>
                  <TypeBadge $bg="rgba(168, 85, 247, 0.2)" $color="#c084fc">Specialized GenAI</TypeBadge>
                  <StatusTag $status="production">Production Ready</StatusTag>
                </CardTopRow>
                <TypeTitle>Generative AI Enterprise Readiness Assessment</TypeTitle>
                <TypeDesc>
                  Strategic evaluation of organizational alignment, infrastructure, model governance, and ethical safety for GenAI.
                </TypeDesc>
                <MetaPillsRow>
                  <MetaPill><FiLayers /> 6 Dimensions</MetaPill>
                  <MetaPill><FiTarget /> 18 Questions</MetaPill>
                  <MetaPill><FiClock /> ~15 mins</MetaPill>
                </MetaPillsRow>
              </div>
              <TypeFooter>
                <ActionButtonsRow>
                  <LaunchBtn onClick={() => navigate('/genai-readiness')}>
                    <FiPlay /> Start Assessment
                  </LaunchBtn>
                  <SampleBtn onClick={() => navigate('/genai-readiness')}>
                    🧪 Try Sample
                  </SampleBtn>
                </ActionButtonsRow>
                <SecondaryActionsRow>
                  <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: '600' }}>✓ Core Pinned</span>
                </SecondaryActionsRow>
              </TypeFooter>
            </TypeCard>

            {/* Custom Production Ready Templates */}
            {productionTypes.map((type) => {
              const dimensions = type.framework?.dimensions || [];
              const totalQ = dimensions.reduce((acc, d) => acc + (d.questions?.length || 0), 0);
              const isExpanded = expandedPreview[type.typeKey];

              return (
                <TypeCard key={type.id || type.typeKey}>
                  <div>
                    <CardTopRow>
                      <TypeBadge $bg={type.color ? `${type.color}22` : 'rgba(99, 102, 241, 0.2)'} $color={type.color || '#818cf8'}>
                        {type.badge || 'Framework'}
                      </TypeBadge>
                      <StatusTag $status="production">Production Ready</StatusTag>
                    </CardTopRow>
                    <TypeTitle>{type.title}</TypeTitle>
                    <TypeDesc>{type.description || 'Enterprise structured assessment framework.'}</TypeDesc>
                    
                    <MetaPillsRow>
                      <MetaPill><FiLayers /> {dimensions.length} Dimensions</MetaPill>
                      <MetaPill><FiTarget /> {totalQ} Questions</MetaPill>
                      <MetaPill><FiClock /> ~{type.framework?.estimatedMinutes || 15} mins</MetaPill>
                    </MetaPillsRow>

                    {dimensions.length > 0 && (
                      <DimensionsAccordion>
                        <AccordionToggle onClick={() => togglePreview(type.typeKey)}>
                          <span>Preview Dimensions ({dimensions.length})</span>
                          {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                        </AccordionToggle>
                        {isExpanded && (
                          <DimensionList>
                            {dimensions.map((dim, dIdx) => (
                              <DimensionItem key={dim.id || dIdx}>
                                <FiCheck /> {dim.name} ({dim.questions?.length || 0} questions)
                              </DimensionItem>
                            ))}
                          </DimensionList>
                        )}
                      </DimensionsAccordion>
                    )}
                  </div>

                  <TypeFooter>
                    <ActionButtonsRow>
                      <LaunchBtn onClick={() => handleOpenStartModal(type)}>
                        <FiPlay /> Start Assessment
                      </LaunchBtn>
                      <SampleBtn onClick={() => handleTrySample(type)}>
                        🧪 Try Sample
                      </SampleBtn>
                    </ActionButtonsRow>

                    <SecondaryActionsRow>
                      <PromoteToggle 
                        $promoted={type.isPromoted}
                        onClick={() => handleTogglePromote(type)}
                      >
                        {type.isPromoted ? <FiToggleRight /> : <FiToggleLeft />}
                        {type.isPromoted ? 'Pinned in Nav Menu' : 'Pin to Nav Menu'}
                      </PromoteToggle>
                      <DeleteButton onClick={() => handleDeleteType(type)}>
                        <FiTrash2 /> Delete
                      </DeleteButton>
                    </SecondaryActionsRow>
                  </TypeFooter>
                </TypeCard>
              );
            })}
          </Grid>
        )}

        {/* Tab 2: Drafts & AI Generated Frameworks */}
        {activeTab === 'drafts' && (
          <>
            {draftTypes.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(30, 41, 59, 0.4)', borderRadius: '20px' }}>
                <HiSparkles style={{ fontSize: '3rem', color: '#a855f7', marginBottom: '16px' }} />
                <h3 style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '8px' }}>No Draft Frameworks</h3>
                <p style={{ color: '#94a3b8', maxWidth: '500px', margin: '0 auto 24px' }}>
                  Generate custom assessment frameworks for specific industries, customer migrations, or emerging technology stacks using Gemini 3.7.
                </p>
                <CreateBtn onClick={() => navigate('/assessments/ai-generator')}>
                  <HiSparkles /> Generate New Assessment
                </CreateBtn>
              </div>
            ) : (
              <Grid>
                {draftTypes.map((type) => {
                  const dimensions = type.framework?.dimensions || [];
                  const totalQ = dimensions.reduce((acc, d) => acc + (d.questions?.length || 0), 0);
                  const isExpanded = expandedPreview[type.typeKey];

                  return (
                    <TypeCard key={type.id || type.typeKey}>
                      <div>
                        <CardTopRow>
                          <TypeBadge $bg="rgba(245, 158, 11, 0.2)" $color="#f59e0b">
                            {type.badge || 'Draft Framework'}
                          </TypeBadge>
                          <StatusTag $status="draft">Draft</StatusTag>
                        </CardTopRow>
                        <TypeTitle>{type.title}</TypeTitle>
                        <TypeDesc>{type.description || 'AI-generated assessment framework draft.'}</TypeDesc>
                        
                        <MetaPillsRow>
                          <MetaPill><FiLayers /> {dimensions.length} Dimensions</MetaPill>
                          <MetaPill><FiTarget /> {totalQ} Questions</MetaPill>
                          <MetaPill><FiClock /> ~{type.framework?.estimatedMinutes || 15} mins</MetaPill>
                        </MetaPillsRow>

                        {dimensions.length > 0 && (
                          <DimensionsAccordion>
                            <AccordionToggle onClick={() => togglePreview(type.typeKey)}>
                              <span>Preview Dimensions ({dimensions.length})</span>
                              {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                            </AccordionToggle>
                            {isExpanded && (
                              <DimensionList>
                                {dimensions.map((dim, dIdx) => (
                                  <DimensionItem key={dim.id || dIdx}>
                                    <FiCheck /> {dim.name} ({dim.questions?.length || 0} questions)
                                  </DimensionItem>
                                ))}
                              </DimensionList>
                            )}
                          </DimensionsAccordion>
                        )}
                      </div>

                      <TypeFooter>
                        <ActionButtonsRow>
                          <LaunchBtn onClick={() => handleOpenStartModal(type)}>
                            <FiPlay /> Start Assessment
                          </LaunchBtn>
                          <SampleBtn onClick={() => handleTrySample(type)}>
                            🧪 Try Sample
                          </SampleBtn>
                        </ActionButtonsRow>

                        <SecondaryActionsRow>
                          <PromoteToggle 
                            $promoted={type.isPromoted}
                            onClick={() => handleTogglePromote(type)}
                          >
                            {type.isPromoted ? <FiToggleRight /> : <FiToggleLeft />}
                            {type.isPromoted ? 'Pinned in Nav' : 'Promote to Production'}
                          </PromoteToggle>
                          <DeleteButton onClick={() => handleDeleteType(type)}>
                            <FiTrash2 /> Delete
                          </DeleteButton>
                        </SecondaryActionsRow>
                      </TypeFooter>
                    </TypeCard>
                  );
                })}
              </Grid>
            )}
          </>
        )}

        {/* Tab 3: Customer Portfolio Runs */}
        {activeTab === 'portfolio' && (
          <div>
            {Object.keys(customerMap).length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(30, 41, 59, 0.4)', borderRadius: '20px' }}>
                <FiList style={{ fontSize: '3rem', color: '#38bdf8', marginBottom: '16px' }} />
                <h3 style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '8px' }}>No Customer Assessments Yet</h3>
                <p style={{ color: '#94a3b8', maxWidth: '500px', margin: '0 auto 24px' }}>
                  Launch a new evaluation with a client or try a sample assessment to see the interactive 5-column runner and executive report.
                </p>
                <CreateBtn onClick={() => setActiveTab('production')}>
                  Explore Assessment Templates
                </CreateBtn>
              </div>
            ) : (
              Object.entries(customerMap).map(([customerName, runs]) => (
                <CustomerCard key={customerName}>
                  <CustomerHeader>
                    <div>
                      <h3 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#ffffff', marginBottom: '4px' }}>
                        {customerName}
                      </h3>
                      <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                        {runs.length} Assessment{runs.length > 1 ? 's' : ''} in Portfolio
                      </span>
                    </div>
                  </CustomerHeader>

                  {runs.map((run) => (
                    <AssessmentRow key={run.id}>
                      <div>
                        <strong style={{ color: '#e2e8f0', fontSize: '1.05rem', display: 'block', marginBottom: '4px' }}>
                          {run.frameworkSnapshot?.title || run.typeKey}
                        </strong>
                        {run.useCase && (
                          <span style={{ fontSize: '0.85rem', color: '#38bdf8', display: 'block', marginBottom: '4px' }}>
                            Initiative: {run.useCase}
                          </span>
                        )}
                        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                          Created {new Date(run.createdAt).toLocaleDateString()} • Score: {run.totalScore ? `${run.totalScore.toFixed(1)} / 5.0` : 'In Progress'} • Level: {run.maturityLevel || 'In Progress'}
                        </span>
                      </div>

                      <div style={{ display: 'flex', gap: '10px' }}>
                        <SampleBtn onClick={() => navigate(`/assessments/run/instance/${run.id}`)}>
                          <FiEye /> Continue Evaluation
                        </SampleBtn>
                        {run.aiReport && (
                          <LaunchBtn onClick={() => navigate(`/assessments/report/${run.id}`)}>
                            <HiSparkles /> View AI Report
                          </LaunchBtn>
                        )}
                      </div>
                    </AssessmentRow>
                  ))}
                </CustomerCard>
              ))
            )}
          </div>
        )}
      </ContentWrapper>

      {/* Start Assessment Modal */}
      {startModalType && (
        <ModalOverlay onClick={() => setStartModalType(null)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.2rem' }}>
                <FiPlay />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#ffffff', margin: 0 }}>Start New Assessment</h3>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{startModalType.title}</span>
              </div>
            </div>

            <form onSubmit={handleLaunchAssessment}>
              <FormGroup>
                <Label>Customer / Organization Name *</Label>
                <Input 
                  type="text" 
                  value={modalForm.customerName}
                  onChange={e => setModalForm({ ...modalForm, customerName: e.target.value })}
                  placeholder="e.g. Acme Health Systems"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Primary Initiative / Use Case</Label>
                <Input 
                  type="text" 
                  value={modalForm.useCase}
                  onChange={e => setModalForm({ ...modalForm, useCase: e.target.value })}
                  placeholder="e.g. OpenAI to Gemini Migration"
                />
              </FormGroup>

              <FormGroup>
                <Label>Lead Evaluator Email</Label>
                <Input 
                  type="email" 
                  value={modalForm.contactEmail}
                  onChange={e => setModalForm({ ...modalForm, contactEmail: e.target.value })}
                  placeholder="e.g. lead.evaluator@enterprise.com"
                />
              </FormGroup>

              <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
                <button
                  type="button"
                  onClick={() => setStartModalType(null)}
                  style={{ flex: 1, padding: '12px', background: 'rgba(255, 255, 255, 0.08)', border: 'none', borderRadius: '12px', color: '#cbd5e1', fontWeight: '600', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <LaunchBtn type="submit" style={{ flex: 2 }}>
                  Launch Assessment →
                </LaunchBtn>
              </div>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}
    </HubContainer>
  );
};

export default DynamicAssessmentHub;
