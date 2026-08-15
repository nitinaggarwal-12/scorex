import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiArrowLeft, 
  FiArrowRight, 
  FiCheckCircle, 
  FiSave, 
  FiClock, 
  FiUser, 
  FiAlertTriangle, 
  FiFileText,
  FiAward,
  FiChevronRight,
  FiChevronDown,
  FiEdit3,
  FiLayers
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import toast from 'react-hot-toast';
import dynamicAssessmentService from '../services/dynamicAssessmentService';
import LoadingSpinner from './LoadingSpinner';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  overflow: hidden;
  padding-top: 68px; /* Fixed GlobalNav offset */
`;

/* =========================================================
   LEFT SIDEBAR NAVIGATION PANEL
   ========================================================= */
const Sidebar = styled.aside`
  width: 340px;
  background: white;
  border-right: 1px solid #e5e7eb;
  height: calc(100vh - 68px);
  position: fixed;
  left: 0;
  top: 68px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.05);
  z-index: 50;

  @media (max-width: 1024px) {
    display: none;
  }
`;

const SidebarHeader = styled.div`
  padding: 24px 20px 16px;
  border-bottom: 1px solid #f1f5f9;
`;

const OrgTitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
`;

const OrgName = styled.h2`
  font-size: 1.15rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 210px;
`;

const OrgMeta = styled.div`
  font-size: 0.825rem;
  color: #64748b;
`;

const SidebarNavList = styled.div`
  flex: 1;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const DimensionNavItem = styled.div`
  border-radius: 10px;
  background: ${props => props.$active ? '#f8fafc' : 'transparent'};
  border: 1px solid ${props => props.$active ? '#e2e8f0' : 'transparent'};
  overflow: hidden;
  transition: all 0.2s ease;
`;

const DimensionNavHeader = styled.button`
  width: 100%;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;

  &:hover {
    background: #f8fafc;
  }
`;

const DimNavLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 0;
`;

const StatusDot = styled.div`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: ${props => props.$completed ? '#10b981' : '#e2e8f0'};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  flex-shrink: 0;
`;

const DimNavName = styled.div`
  font-size: 0.9rem;
  font-weight: ${props => props.$active ? '700' : '600'};
  color: ${props => props.$active ? '#ff6b35' : '#334155'};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const DimNavScore = styled.div`
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 500;
`;

const QuestionsSubList = styled.div`
  padding: 4px 12px 12px 42px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const QuestionSubItem = styled.button`
  background: ${props => props.$active ? '#ffefe9' : 'transparent'};
  color: ${props => props.$active ? '#ff6b35' : '#64748b'};
  font-weight: ${props => props.$active ? '700' : '500'};
  border: none;
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 0.8rem;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: #f1f5f9;
    color: #1e293b;
  }
`;

/* =========================================================
   MAIN CONTENT AREA
   ========================================================= */
const MainContentWrapper = styled.main`
  flex: 1;
  margin-left: 340px;
  height: calc(100vh - 68px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;

  @media (max-width: 1024px) {
    margin-left: 0;
  }
`;

const ScrollableBody = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 24px 32px 120px;

  @media (max-width: 768px) {
    padding: 16px 16px 100px;
  }
`;

/* Progress & Header Bar */
const TopHeaderBar = styled.div`
  background: white;
  border-radius: 16px;
  padding: 20px 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
`;

const HeaderTitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const DimensionIconCircle = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
`;

const DimensionHeading = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 4px 0;
`;

const DimensionSubHeading = styled.p`
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
`;

const TopNavFilters = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const FilterPillGroup = styled.div`
  display: flex;
  background: #f1f5f9;
  padding: 4px;
  border-radius: 10px;
  gap: 4px;
`;

const FilterPill = styled.button`
  background: ${props => props.$active ? '#ffffff' : 'transparent'};
  color: ${props => props.$active ? '#1e293b' : '#64748b'};
  box-shadow: ${props => props.$active ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'};
  font-weight: 600;
  font-size: 0.8rem;
  padding: 6px 12px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
`;

const QuestionNumberRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const QuestionCircle = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => {
    if (props.$current) return '#ff6b35';
    if (props.$answered) return '#10b981';
    return '#f1f5f9';
  }};
  color: ${props => (props.$current || props.$answered) ? '#ffffff' : '#64748b'};
  border: 2px solid ${props => props.$current ? '#ff6b35' : 'transparent'};
  font-weight: 700;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const AutoSaveBadge = styled.div`
  font-size: 0.8rem;
  font-weight: 600;
  color: #10b981;
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

/* =========================================================
   QUESTION CARD WITH 5-COLUMN PERSPECTIVES GRID
   ========================================================= */
const QuestionContainerCard = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 36px 32px;
  margin-bottom: 24px;
  box-shadow: 0 6px 30px rgba(0, 0, 0, 0.06);
`;

const QuestionTitleArea = styled.div`
  text-align: center;
  max-width: 900px;
  margin: 0 auto 32px;
`;

const QuestionNumberTag = styled.div`
  font-size: 0.85rem;
  font-weight: 700;
  color: #ff6b35;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 8px;
`;

const QuestionPromptText = styled.h2`
  font-size: 1.45rem;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.4;
  margin-bottom: 12px;
`;

const QuestionGuidance = styled.div`
  font-size: 0.9rem;
  color: #64748b;
  background: #f8fafc;
  border-left: 3px solid #ff6b35;
  padding: 10px 16px;
  border-radius: 6px;
  display: inline-block;
  text-align: left;
`;

/* 5-Column Grid Layout */
const PerspectivesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  gap: 18px;

  @media (max-width: 1560px) {
    grid-template-columns: repeat(5, minmax(210px, 1fr));
    overflow-x: auto;
    padding-bottom: 12px;
  }

  @media (max-width: 1200px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const PerspectiveColumn = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const PerspectiveHeader = styled.div`
  font-size: 0.95rem;
  font-weight: 700;
  color: #1e293b;
  text-align: center;
  padding: 10px 12px;
  background: #f8fafc;
  border-radius: 10px;
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: 1px solid #f1f5f9;
`;

const OptionsStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
`;

const MaturityOptionCard = styled.button`
  background: ${props => props.$selected ? '#fff7ed' : '#ffffff'};
  border: 2px solid ${props => props.$selected ? '#ff6b35' : '#e2e8f0'};
  border-radius: 12px;
  padding: 14px 12px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  gap: 6px;
  box-shadow: ${props => props.$selected ? '0 4px 12px rgba(255, 107, 53, 0.15)' : 'none'};

  &:hover {
    border-color: #ff6b35;
    background: #fffaf5;
  }
`;

const OptionStageTag = styled.span`
  font-size: 0.75rem;
  font-weight: 800;
  color: ${props => props.$selected ? '#ff6b35' : '#64748b'};
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const OptionText = styled.span`
  font-size: 0.85rem;
  line-height: 1.45;
  color: ${props => props.$selected ? '#1e293b' : '#475569'};
  font-weight: ${props => props.$selected ? '600' : '400'};
`;

/* Checkbox Cards */
const PainCheckboxCard = styled.label`
  background: ${props => props.$checked ? '#fef2f2' : '#ffffff'};
  border: 1.5px solid ${props => props.$checked ? '#ef4444' : '#e2e8f0'};
  border-radius: 10px;
  padding: 12px 14px;
  margin-bottom: 8px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  cursor: pointer;
  transition: all 0.2s ease;

  input {
    margin-top: 3px;
    accent-color: #ef4444;
    cursor: pointer;
  }

  span {
    font-size: 0.85rem;
    color: ${props => props.$checked ? '#991b1b' : '#334155'};
    line-height: 1.4;
    font-weight: ${props => props.$checked ? '600' : '400'};
  }

  &:hover {
    border-color: #ef4444;
  }
`;

/* Notes Textarea */
const NotesArea = styled.textarea`
  width: 100%;
  flex: 1;
  min-height: 260px;
  border: 1.5px solid #cbd5e1;
  border-radius: 12px;
  padding: 14px;
  font-family: inherit;
  font-size: 0.9rem;
  color: #1e293b;
  line-height: 1.6;
  resize: vertical;
  background: #ffffff;

  &:focus {
    outline: none;
    border-color: #ff6b35;
    box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.15);
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

/* =========================================================
   BOTTOM STICKY ACTION BAR
   ========================================================= */
const StickyBottomBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid #e2e8f0;
  padding: 16px 36px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 40;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.05);
`;

const NavActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
`;

const BackButton = styled(NavActionButton)`
  background: #f1f5f9;
  color: #475569;

  &:hover {
    background: #e2e8f0;
    color: #1e293b;
  }
`;

const NextButton = styled(NavActionButton)`
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
  color: white;
  box-shadow: 0 4px 14px rgba(255, 107, 53, 0.35);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 107, 53, 0.5);
  }
`;

const CompleteReportButton = styled(NavActionButton)`
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.5);
  }
`;

const DynamicAssessmentRunner = () => {
  const { id, typeKey } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [instance, setInstance] = useState(null);
  const [framework, setFramework] = useState(null);
  const [responses, setResponses] = useState({});
  const [activeDimIdx, setActiveDimIdx] = useState(0);
  const [activeQIdx, setActiveQIdx] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedStatus, setSavedStatus] = useState('saved');

  useEffect(() => {
    loadData();
  }, [id, typeKey]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (id) {
        const inst = await dynamicAssessmentService.getInstance(id);
        if (inst) {
          setInstance(inst);
          setFramework(inst.frameworkSnapshot);
          setResponses(inst.responses || {});
        }
      } else if (typeKey) {
        const type = await dynamicAssessmentService.getAssessmentTypeByKey(typeKey);
        if (type) {
          setFramework(type.framework);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load assessment data');
    } finally {
      setLoading(false);
    }
  };

  const autoSave = useCallback(async (updatedResponses) => {
    if (!instance?.id) return;
    setSavedStatus('saving');
    try {
      await dynamicAssessmentService.updateInstance(instance.id, {
        responses: updatedResponses
      });
      setSavedStatus('saved');
    } catch (err) {
      console.warn('Autosave error:', err);
      setSavedStatus('saved');
    }
  }, [instance]);

  const handleSelectCurrentState = (qId, score) => {
    const updated = {
      ...responses,
      [qId]: score,
      [`${qId}_current_state`]: score
    };
    setResponses(updated);
    autoSave(updated);
  };

  const handleSelectFutureState = (qId, score) => {
    const updated = {
      ...responses,
      [`${qId}_future_state`]: score
    };
    setResponses(updated);
    autoSave(updated);
  };

  const handleToggleTechnicalPain = (qId, pain) => {
    const key = `${qId}_technical_pain`;
    const current = responses[key] || [];
    const updatedList = current.includes(pain)
      ? current.filter(p => p !== pain)
      : [...current, pain];

    const updated = {
      ...responses,
      [key]: updatedList,
      [`${qId}_pain_points`]: updatedList
    };
    setResponses(updated);
    autoSave(updated);
  };

  const handleToggleBusinessPain = (qId, pain) => {
    const key = `${qId}_business_pain`;
    const current = responses[key] || [];
    const updatedList = current.includes(pain)
      ? current.filter(p => p !== pain)
      : [...current, pain];

    const updated = {
      ...responses,
      [key]: updatedList
    };
    setResponses(updated);
    autoSave(updated);
  };

  const handleNotesChange = (qId, text) => {
    const updated = {
      ...responses,
      [`${qId}_comment`]: text
    };
    setResponses(updated);
    autoSave(updated);
  };

  const handleFinishAndGenerateReport = async () => {
    if (!instance?.id) return;
    setIsSubmitting(true);
    try {
      toast.loading('Generating executive report with Gemini 3.7...', { id: 'report-gen' });
      await dynamicAssessmentService.updateInstance(instance.id, {
        responses,
        status: 'completed'
      });

      const reportResult = await dynamicAssessmentService.generateReport(instance.id);
      if (reportResult.success) {
        toast.success('Executive report generated successfully!', { id: 'report-gen' });
        navigate(`/assessments/report/${instance.id}`);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Failed to generate report', { id: 'report-gen' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !framework) {
    return <LoadingSpinner message="Loading assessment framework..." />;
  }

  const dimensions = framework.dimensions || [];
  const currentDim = dimensions[activeDimIdx] || dimensions[0];
  const questions = currentDim.questions || [];
  const currentQ = questions[activeQIdx] || questions[0];

  const totalQuestions = dimensions.reduce((sum, d) => sum + (d.questions?.length || 0), 0);
  const totalAnswered = Object.keys(responses).filter(k => !k.includes('_')).length;

  const isCurrentQAnswered = (qId) => responses[qId] !== undefined;

  const nextQuestion = () => {
    if (activeQIdx < questions.length - 1) {
      setActiveQIdx(prev => prev + 1);
    } else if (activeDimIdx < dimensions.length - 1) {
      setActiveDimIdx(prev => prev + 1);
      setActiveQIdx(0);
    }
  };

  const prevQuestion = () => {
    if (activeQIdx > 0) {
      setActiveQIdx(prev => prev - 1);
    } else if (activeDimIdx > 0) {
      setActiveDimIdx(prev => prev - 1);
      const prevDimQuestions = dimensions[activeDimIdx - 1]?.questions || [];
      setActiveQIdx(Math.max(0, prevDimQuestions.length - 1));
    }
  };

  const isLastQuestion = activeDimIdx === dimensions.length - 1 && activeQIdx === questions.length - 1;

  return (
    <Container>
      {/* 1. LEFT NAVIGATION PANEL */}
      <Sidebar>
        <SidebarHeader>
          <OrgTitleRow>
            <OrgName title={instance?.customerName || 'Organization'}>
              {instance?.customerName || 'Assessment'}
            </OrgName>
            <span style={{ fontSize: '0.75rem', background: '#e0f2fe', color: '#0369a1', padding: '3px 8px', borderRadius: '12px', fontWeight: '700' }}>
              {Math.round((totalAnswered / Math.max(1, totalQuestions)) * 100)}%
            </span>
          </OrgTitleRow>
          <OrgMeta>
            {dimensions.length} dimensions • {totalAnswered} of {totalQuestions} completed
          </OrgMeta>
        </SidebarHeader>

        <SidebarNavList>
          {dimensions.map((dim, dIdx) => {
            const dimQuestions = dim.questions || [];
            const dimAnswered = dimQuestions.filter(q => responses[q.id] !== undefined).length;
            const isCompleted = dimAnswered === dimQuestions.length && dimQuestions.length > 0;
            const isDimActive = dIdx === activeDimIdx;

            return (
              <DimensionNavItem key={dim.id || dIdx} $active={isDimActive}>
                <DimensionNavHeader onClick={() => {
                  setActiveDimIdx(dIdx);
                  setActiveQIdx(0);
                }}>
                  <DimNavLeft>
                    <StatusDot $completed={isCompleted}>
                      {isCompleted ? '✓' : `${dimAnswered}/${dimQuestions.length}`}
                    </StatusDot>
                    <DimNavName $active={isDimActive}>{dim.name}</DimNavName>
                  </DimNavLeft>
                  {isDimActive ? <FiChevronDown color="#ff6b35" /> : <FiChevronRight color="#94a3b8" />}
                </DimensionNavHeader>

                {isDimActive && (
                  <QuestionsSubList>
                    {dimQuestions.map((q, qSubIdx) => {
                      const isQActive = qSubIdx === activeQIdx;
                      const isQAnswered = responses[q.id] !== undefined;

                      return (
                        <QuestionSubItem
                          key={q.id || qSubIdx}
                          $active={isQActive}
                          onClick={() => setActiveQIdx(qSubIdx)}
                        >
                          <span style={{ color: isQAnswered ? '#10b981' : '#94a3b8' }}>
                            {isQAnswered ? '●' : '○'}
                          </span>
                          <span>Q{qSubIdx + 1}: {q.text.substring(0, 24)}...</span>
                        </QuestionSubItem>
                      );
                    })}
                  </QuestionsSubList>
                )}
              </DimensionNavItem>
            );
          })}
        </SidebarNavList>
      </Sidebar>

      {/* 2. MAIN CONTENT WRAPPER */}
      <MainContentWrapper>
        <ScrollableBody>
          {/* Top Progress & Breadcrumb Section */}
          <TopHeaderBar>
            <HeaderTitleGroup>
              <DimensionIconCircle>
                <FiAward />
              </DimensionIconCircle>
              <div>
                <DimensionHeading>{currentDim.name}</DimensionHeading>
                <DimensionSubHeading>{currentDim.description}</DimensionSubHeading>
              </div>
            </HeaderTitleGroup>

            <TopNavFilters>
              <FilterPillGroup>
                <FilterPill $active={true}>All {questions.length}</FilterPill>
                <FilterPill $active={false}>Done {questions.filter(q => responses[q.id] !== undefined).length}</FilterPill>
              </FilterPillGroup>

              <QuestionNumberRow>
                {questions.map((q, idx) => (
                  <QuestionCircle
                    key={q.id || idx}
                    $current={idx === activeQIdx}
                    $answered={isCurrentQAnswered(q.id)}
                    onClick={() => setActiveQIdx(idx)}
                  >
                    {idx + 1}
                  </QuestionCircle>
                ))}
              </QuestionNumberRow>

              <AutoSaveBadge>
                <FiCheckCircle /> {savedStatus === 'saving' ? 'Saving...' : 'Saved'}
              </AutoSaveBadge>
            </TopNavFilters>
          </TopHeaderBar>

          {/* 3. QUESTION CARD (5-COLUMN PERSPECTIVES GRID) */}
          {currentQ && (
            <QuestionContainerCard
              key={currentQ.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <QuestionTitleArea>
                <QuestionNumberTag>Question {activeQIdx + 1} of {questions.length}</QuestionNumberTag>
                <QuestionPromptText>{currentQ.text}</QuestionPromptText>
                {currentQ.guidance && (
                  <QuestionGuidance>
                    💡 <strong>Guidance:</strong> {currentQ.guidance}
                  </QuestionGuidance>
                )}
              </QuestionTitleArea>

              <PerspectivesGrid>
                {/* Column 1: Current State */}
                <PerspectiveColumn>
                  <PerspectiveHeader>
                    <span>Current State</span>
                    <span style={{ fontSize: '0.75rem', background: '#ff6b35', color: '#fff', borderRadius: '50%', width: '16px', height: '16px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>?</span>
                  </PerspectiveHeader>
                  <OptionsStack>
                    {(currentQ.options || []).map((opt) => {
                      const score = Number(opt.score || opt.value);
                      const isSelected = Number(responses[currentQ.id]) === score;

                      return (
                        <MaturityOptionCard
                          key={score}
                          $selected={isSelected}
                          onClick={() => handleSelectCurrentState(currentQ.id, score)}
                        >
                          <OptionStageTag $selected={isSelected}>
                            {score}. {score === 1 ? 'Explore' : score === 2 ? 'Experiment' : score === 3 ? 'Formalize' : score === 4 ? 'Optimize' : 'Transform'}
                          </OptionStageTag>
                          <OptionText $selected={isSelected}>
                            {opt.label}
                          </OptionText>
                        </MaturityOptionCard>
                      );
                    })}
                  </OptionsStack>
                </PerspectiveColumn>

                {/* Column 2: Future State Vision */}
                <PerspectiveColumn>
                  <PerspectiveHeader>
                    <span>Future State Vision</span>
                    <span style={{ fontSize: '0.75rem', background: '#3b82f6', color: '#fff', borderRadius: '50%', width: '16px', height: '16px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>?</span>
                  </PerspectiveHeader>
                  <OptionsStack>
                    {(currentQ.options || []).map((opt) => {
                      const score = Number(opt.score || opt.value);
                      const isSelected = Number(responses[`${currentQ.id}_future_state`]) === score;

                      return (
                        <MaturityOptionCard
                          key={score}
                          $selected={isSelected}
                          onClick={() => handleSelectFutureState(currentQ.id, score)}
                        >
                          <OptionStageTag $selected={isSelected}>
                            {score}. {score === 1 ? 'Explore' : score === 2 ? 'Experiment' : score === 3 ? 'Formalize' : score === 4 ? 'Optimize' : 'Transform'}
                          </OptionStageTag>
                          <OptionText $selected={isSelected}>
                            {opt.label}
                          </OptionText>
                        </MaturityOptionCard>
                      );
                    })}
                  </OptionsStack>
                </PerspectiveColumn>

                {/* Column 3: Technical Pain Points */}
                <PerspectiveColumn>
                  <PerspectiveHeader>
                    <span>Technical Pain Points</span>
                  </PerspectiveHeader>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {(currentQ.technicalPainPoints || [
                      "Inconsistent environment configurations",
                      "Manual provisioning & fragmented scripting",
                      "Lack of automated validation & telemetry",
                      "Deployment consistency and latency bottlenecks"
                    ]).map((pain, pIdx) => {
                      const checked = (responses[`${currentQ.id}_technical_pain`] || []).includes(pain);
                      return (
                        <PainCheckboxCard key={pIdx} $checked={checked}>
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => handleToggleTechnicalPain(currentQ.id, pain)}
                          />
                          <span>{pain}</span>
                        </PainCheckboxCard>
                      );
                    })}
                  </div>
                </PerspectiveColumn>

                {/* Column 4: Business Pain Points */}
                <PerspectiveColumn>
                  <PerspectiveHeader>
                    <span>Business Pain Points</span>
                  </PerspectiveHeader>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {(currentQ.businessPainPoints || [
                      "Slow time-to-market for strategic features",
                      "High operational & compute overhead costs",
                      "Engineering bottlenecks and resource conflicts",
                      "Compliance risks from inconsistent environments"
                    ]).map((pain, pIdx) => {
                      const checked = (responses[`${currentQ.id}_business_pain`] || []).includes(pain);
                      return (
                        <PainCheckboxCard key={pIdx} $checked={checked}>
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => handleToggleBusinessPain(currentQ.id, pain)}
                          />
                          <span>{pain}</span>
                        </PainCheckboxCard>
                      );
                    })}
                  </div>
                </PerspectiveColumn>

                {/* Column 5: Context Notes */}
                <PerspectiveColumn>
                  <PerspectiveHeader>
                    <span>Notes</span>
                  </PerspectiveHeader>
                  <NotesArea
                    placeholder="Enter current setup context, operational notes, and specific architecture details for the AI executive report..."
                    value={responses[`${currentQ.id}_comment`] || ''}
                    onChange={(e) => handleNotesChange(currentQ.id, e.target.value)}
                  />
                </PerspectiveColumn>
              </PerspectivesGrid>
            </QuestionContainerCard>
          )}
        </ScrollableBody>

        {/* 4. BOTTOM STICKY ACTION BAR */}
        <StickyBottomBar>
          <BackButton onClick={prevQuestion}>
            <FiArrowLeft /> Back
          </BackButton>

          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            {!isLastQuestion ? (
              <NextButton onClick={nextQuestion}>
                Next <FiArrowRight />
              </NextButton>
            ) : (
              <CompleteReportButton onClick={handleFinishAndGenerateReport} disabled={isSubmitting}>
                <HiSparkles />
                {isSubmitting ? 'Generating AI Report...' : 'Submit & Generate Executive Report'}
              </CompleteReportButton>
            )}
          </div>
        </StickyBottomBar>
      </MainContentWrapper>
    </Container>
  );
};

export default DynamicAssessmentRunner;
