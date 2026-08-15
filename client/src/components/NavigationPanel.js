import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  FiChevronDown, 
  FiChevronRight, 
  FiCheckCircle, 
  FiCircle, 
  FiTarget,
  FiBarChart2,
  FiPlay,
  FiEdit3,
  FiSend,
  FiLoader
} from 'react-icons/fi';
import EditAssessmentModal from './EditAssessmentModal';
import * as assessmentService from '../services/assessmentService';

const NavigationContainer = styled.div`
  width: 350px;
  height: calc(100vh - 80px);
  background: white;
  border-right: 1px solid #e5e7eb;
  overflow-y: auto;
  position: fixed;
  left: 0;
  top: 80px;
  z-index: 100;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
`;

const NavigationHeader = styled.div`
  padding: 24px 20px 16px;
  border-bottom: 1px solid #e5e7eb;
  background: #f8f9fa;
`;

const NavigationTitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
`;

const NavigationTitle = styled.h3`
  margin: 0;
  color: #1f2937;
  font-size: 18px;
  font-weight: 600;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const EditButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s;
  flex-shrink: 0;

  &:hover {
    background: #2563eb;
    transform: translateY(-1px);
  }
`;

const NavigationSubtitle = styled.p`
  margin: 8px 0 0;
  color: #6b7280;
  font-size: 14px;
`;

const PillarList = styled.div`
  padding: 16px 0;
`;

const PillarItem = styled.div`
  margin-bottom: 8px;
`;

const PillarHeader = styled(motion.div)`
  display: flex;
  align-items: center;
  padding: 12px 20px;
  cursor: ${props => props.$isDisabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  border-left: 4px solid transparent;
  opacity: ${props => props.$isDisabled ? '0.4' : '1'};
  pointer-events: ${props => props.$isDisabled ? 'none' : 'auto'};

  &:hover {
    background: ${props => props.$isDisabled ? 'transparent' : '#f3f4f6'};
  }

  ${props => props.$isActive && !props.$isDisabled && `
    background: #eff6ff;
    border-left-color: #3b82f6;
  `}

  ${props => props.$isCompleted && !props.$isDisabled && `
    background: #f0fdf4;
    border-left-color: #10b981;
  `}
  
  ${props => props.$isDisabled && `
    background: #f9fafb;
    border-left-color: #e5e7eb;
  `}
`;

const PillarIcon = styled.div`
  margin-right: 12px;
  display: flex;
  align-items: center;
`;

const PillarInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const PillarName = styled.div`
  font-weight: 600;
  color: ${props => props.$isDisabled ? '#9ca3af' : '#1f2937'};
  font-size: 14px;
  line-height: 1.2;
  margin-bottom: 2px;
`;

const PillarProgress = styled.div`
  font-size: 12px;
  color: #6b7280;
`;

const ExpandIcon = styled(motion.div)`
  margin-left: 8px;
  color: #6b7280;
`;

const DimensionList = styled(motion.div)`
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
`;

const DimensionItem = styled(motion.div)`
  display: flex;
  align-items: center;
  padding: 10px 20px 10px 52px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-left: 4px solid transparent;

  &:hover {
    background: #f3f4f6;
  }

  ${props => props.isActive && `
    background: #eff6ff;
    border-left-color: #3b82f6;
  `}

  ${props => props.isCompleted && `
    background: #f0fdf4;
    border-left-color: #10b981;
  `}
`;

const DimensionIcon = styled.div`
  margin-right: 10px;
  display: flex;
  align-items: center;
`;

const DimensionName = styled.div`
  font-size: 13px;
  color: #374151;
  font-weight: 500;
`;

const ActionButtonsContainer = styled.div`
  padding: 20px;
  border-top: 2px solid #e5e7eb;
  background: linear-gradient(135deg, #f8f9fa 0%, #e5e7eb 100%);
  margin-top: auto;
`;

const ResultsSection = styled.div`
  margin-bottom: 16px;
`;

const ResultsSectionTitle = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ActionButton = styled(motion.button)`
  width: 100%;
  padding: 16px 20px;
  margin-bottom: 8px;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  ${props => props.variant === 'primary' && `
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    color: white;
    
    &:hover {
      background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
      box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
    }
  `}

  ${props => props.variant === 'secondary' && `
    background: #10b981;
    color: white;
    
    &:hover {
      background: #059669;
    }
  `}

  ${props => props.variant === 'accent' && `
    background: #f59e0b;
    color: white;
    
    &:hover {
      background: #d97706;
    }
  `}

  &:disabled {
    background: #e5e7eb;
    color: #9ca3af;
    cursor: not-allowed;
    box-shadow: none;
    opacity: 0.6;
  }
`;

const PillarResultButton = styled(motion.button)`
  width: 100%;
  padding: 12px 16px;
  margin-bottom: 8px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  transition: all 0.3s ease;
  background: ${props => props.isCompleted ? 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)' : '#f3f4f6'};
  color: ${props => props.isCompleted ? '#f97316' : '#9ca3af'};
  border: 2px solid ${props => props.isCompleted ? '#f97316' : '#e5e7eb'};

  &:hover {
    ${props => props.isCompleted && `
      background: linear-gradient(135deg, #fed7aa 0%, #fdba74 100%);
      transform: translateX(2px);
      box-shadow: 0 4px 12px rgba(249, 115, 22, 0.2);
    `}
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

// Dialog and Progress Bar Styled Components
const DialogOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
`;

const DialogBox = styled(motion.div)`
  background: white;
  border-radius: 16px;
  padding: 32px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const DialogTitle = styled.h2`
  margin: 0 0 12px 0;
  color: #1f2937;
  font-size: 24px;
  font-weight: 700;
`;

const DialogMessage = styled.div`
  margin: 0 0 24px 0;
  color: #6b7280;
  font-size: 16px;
  line-height: 1.5;
`;

const DialogButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const DialogButton = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s;
  
  ${props => props.$primary ? `
    background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
    color: white;
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(255, 107, 53, 0.4);
    }
  ` : `
    background: #f3f4f6;
    color: #6b7280;
    &:hover {
      background: #e5e7eb;
    }
  `}
`;

const ProgressContainer = styled.div`
  margin-top: 24px;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
`;

const ProgressFill = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, #ff6b35 0%, #f7931e 50%, #ff6b35 100%);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
  
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

const ProgressText = styled.div`
  margin-top: 12px;
  color: #6b7280;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  
  svg {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const NavigationPanel = ({ framework, currentAssessment, onAssessmentUpdate }) => {
  const navigate = useNavigate();
  const { categoryId, assessmentId: routeAssessmentId } = useParams();
  // Use currentAssessment.assessmentId if routeAssessmentId is not available
  const assessmentId = routeAssessmentId || currentAssessment?.assessmentId;
  const [expandedPillars, setExpandedPillars] = useState(new Set());
  const [pillarProgress, setPillarProgress] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionProgress, setSubmissionProgress] = useState(0);
  const [submissionMessage, setSubmissionMessage] = useState('');

  // Initialize expanded state and progress
  useEffect(() => {
    if (framework && categoryId) {
      setExpandedPillars(new Set([categoryId]));
    }
    
    if (currentAssessment) {
      // Calculate progress for each pillar
      const progress = {};
      framework?.assessmentAreas?.forEach(pillar => {
        const totalDimensions = pillar.dimensions?.length || 0;
        const completedDimensions = 0; // TODO: Calculate based on responses
        progress[pillar.id] = {
          completed: currentAssessment.completedCategories?.includes(pillar.id) || false,
          progress: totalDimensions > 0 ? `${completedDimensions}/${totalDimensions}` : '0/0'
        };
      });
      setPillarProgress(progress);
    }
  }, [framework, categoryId, currentAssessment]);

  const togglePillar = (pillarId) => {
    const newExpanded = new Set(expandedPillars);
    if (newExpanded.has(pillarId)) {
      newExpanded.delete(pillarId);
    } else {
      newExpanded.add(pillarId);
    }
    setExpandedPillars(newExpanded);
  };

  const navigateToPillar = (pillarId) => {
    if (!assessmentId) {
      console.error('No assessment ID available');
      return;
    }
    // Navigate to first dimension of the pillar
    const pillar = framework?.assessmentAreas?.find(p => p.id === pillarId);
    if (pillar && pillar.dimensions && pillar.dimensions.length > 0) {
      navigate(`/assessment/${assessmentId}/${pillarId}`);
    }
  };

  const navigateToDimension = (pillarId, dimensionIndex) => {
    if (!assessmentId) {
      console.error('No assessment ID available');
      return;
    }
    navigate(`/assessment/${assessmentId}/${pillarId}?dimension=${dimensionIndex}`);
  };

  const navigateToOverallResults = () => {
    if (!assessmentId) {
      console.error('No assessment ID available');
      return;
    }
    navigate(`/results/${assessmentId}`);
  };

  const handleSubmitAssessment = async () => {
    if (!assessmentId) {
      
      return;
    }

    if (!hasAnyCompletedPillars) {
      
      return;
    }

    // Show confirmation dialog
    setShowSubmitDialog(true);
  };

  const confirmSubmit = async () => {
    setShowSubmitDialog(false);
    setIsSubmitting(true);
    setSubmissionProgress(0);
    
    // Authentic progress messages
    const progressSteps = [
      { progress: 10, message: 'Analyzing assessment responses...' },
      { progress: 25, message: 'Calculating maturity scores...' },
      { progress: 40, message: 'Generating recommendations...' },
      { progress: 55, message: 'Identifying Databricks features...' },
      { progress: 70, message: 'Building strategic roadmap...' },
      { progress: 85, message: 'Calculating business impact...' },
      { progress: 95, message: 'Finalizing report...' },
      { progress: 100, message: 'Assessment complete!' }
    ];

    try {
      // Submit assessment to API
      await assessmentService.submitAssessment(assessmentId);
      
      // Animate through progress steps
      for (const step of progressSteps) {
        setSubmissionProgress(step.progress);
        setSubmissionMessage(step.message);
        await new Promise(resolve => setTimeout(resolve, 1250)); // 10 seconds total / 8 steps
      }
      
      // Navigate to results
      navigate(`/results/${assessmentId}`);
    } catch (error) {
      console.error('Error submitting assessment:', error);
      setIsSubmitting(false);
      
    }
  };

  if (!framework) {
    return null;
  }

  const hasAnyCompletedPillars = currentAssessment?.completedCategories?.length > 0;
  const isSubmitted = currentAssessment?.status === 'submitted';

  return (
    <NavigationContainer>
      <NavigationHeader>
        <NavigationTitleRow>
          <NavigationTitle title={currentAssessment?.assessmentName}>
            {currentAssessment?.assessmentName || 'Assessment Navigation'}
          </NavigationTitle>
          {currentAssessment && (
            <EditButton onClick={() => setShowEditModal(true)} title="Edit assessment information">
              <FiEdit3 size={12} />
              Edit
            </EditButton>
          )}
        </NavigationTitleRow>
        <NavigationSubtitle>
          {currentAssessment?.organizationName && `${currentAssessment.organizationName} • `}
          {currentAssessment?.completedCategories?.length || 0} of {framework.assessmentAreas?.length || 0} pillars completed
        </NavigationSubtitle>
      </NavigationHeader>

      {showEditModal && currentAssessment && (
        <EditAssessmentModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          assessment={currentAssessment}
          onUpdate={(updatedData) => {
            if (onAssessmentUpdate) {
              onAssessmentUpdate(updatedData);
            }
            // Refresh the page to show updated data
            window.location.reload();
          }}
        />
      )}

      <PillarList>
        {framework.assessmentAreas?.map((pillar) => {
          // Check if this pillar is selected for this assessment
          const selectedPillars = currentAssessment?.selectedPillars;
          // Backward compatibility logic:
          // - If selectedPillars is undefined/null: old assessment before feature → allow all pillars
          // - If selectedPillars is empty array []: old assessment or data issue → allow all pillars for safety
          // - If selectedPillars has items: only allow those specific pillars
          const isOldOrEmptyAssessment = !selectedPillars || (Array.isArray(selectedPillars) && selectedPillars.length === 0);
          const isSelected = isOldOrEmptyAssessment || selectedPillars.includes(pillar.id);
          
          // Debug logging (only log once per pillar)
          if (pillar.id === 'platform_governance') {
            console.log('🔍 NavigationPanel Debug:', {
              assessmentId: currentAssessment?.assessmentId,
              rawSelectedPillars: currentAssessment?.selectedPillars,
              selectedPillarsType: typeof currentAssessment?.selectedPillars,
              selectedPillarsIsArray: Array.isArray(currentAssessment?.selectedPillars),
              selectedPillarsLength: currentAssessment?.selectedPillars?.length,
              selectedPillars,
              isOldOrEmptyAssessment,
              currentPillar: pillar.id,
              isSelected
            });
          }
          
          const isExpanded = expandedPillars.has(pillar.id);
          const isActive = categoryId === pillar.id;
          const isCompleted = pillarProgress[pillar.id]?.completed || false;
          
          // 🆕 Calculate pillar progress percentage
          const totalDimensions = pillar.dimensions?.length || 0;
          const answeredDimensions = pillar.dimensions?.filter(dim => {
            // Check if any question in this dimension has been answered
            return dim.questions?.some(q => {
              const responses = currentAssessment?.responses || {};
              return responses[`${q.id}_current_state`] || responses[`${q.id}_future_state`];
            });
          }).length || 0;
          const progressPercent = totalDimensions > 0 ? Math.round((answeredDimensions / totalDimensions) * 100) : 0;
          
          // 🆕 Pillar icons
          const pillarIcons = {
            'platform_governance': '🧱',
            'data_engineering': '💾',
            'analytics_bi': '📊',
            'machine_learning': '🤖',
            'generative_ai': '✨',
            'operational_excellence': '⚡'
          };
          const pillarIcon = pillarIcons[pillar.id] || '📋';
          
          return (
            <PillarItem key={pillar.id}>
              <PillarHeader
                $isActive={isActive}
                $isCompleted={isCompleted}
                $isDisabled={!isSelected}
                onClick={() => isSelected && togglePillar(pillar.id)}
                whileHover={{ x: isSelected ? 2 : 0 }}
                whileTap={{ scale: isSelected ? 0.98 : 1 }}
              >
                <PillarIcon>
                  {isCompleted ? (
                    <FiCheckCircle size={20} color={isSelected ? "#10b981" : "#d1d5db"} />
                  ) : (
                    <FiCircle size={20} color={isSelected ? "#6b7280" : "#d1d5db"} />
                  )}
                </PillarIcon>
                
                <PillarInfo>
                  <PillarName $isDisabled={!isSelected}>
                    <span style={{ marginRight: '8px', fontSize: '1.1rem' }}>{pillarIcon}</span>
                    {pillar.name}
                    {!isSelected && <span style={{ marginLeft: '8px', fontSize: '0.75rem', fontWeight: 400, color: '#9ca3af' }}>(Not Selected)</span>}
                  </PillarName>
                  <PillarProgress>
                    {/* 🆕 Progress circles */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ 
                        display: 'flex', 
                        gap: '4px',
                        fontSize: '0.7rem'
                      }}>
                        {Array.from({ length: totalDimensions }, (_, idx) => (
                          <span 
                            key={idx}
                            style={{ 
                              width: '8px', 
                              height: '8px', 
                              borderRadius: '50%',
                              background: idx < answeredDimensions ? '#10b981' : '#e5e7eb',
                              display: 'inline-block'
                            }}
                          />
                        ))}
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600 }}>
                        {answeredDimensions}/{totalDimensions} {progressPercent}%
                      </span>
                    </div>
                  </PillarProgress>
                </PillarInfo>
                
                <ExpandIcon
                  animate={{ rotate: isExpanded ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FiChevronRight size={16} />
                </ExpandIcon>
              </PillarHeader>

              <AnimatePresence>
                {isExpanded && isSelected && (
                  <DimensionList
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Start Pillar Button */}
                    <DimensionItem
                      onClick={() => navigateToPillar(pillar.id)}
                      whileHover={{ x: 2 }}
                      style={{ 
                        background: '#e0f2fe', 
                        borderLeftColor: '#0284c7',
                        fontWeight: 600 
                      }}
                    >
                      <DimensionIcon>
                        <FiPlay size={14} color="#0284c7" />
                      </DimensionIcon>
                      <DimensionName style={{ color: '#0284c7' }}>
                        Start {pillar.name.split(' ')[0]} Assessment
                      </DimensionName>
                    </DimensionItem>

                    {/* Individual Dimensions */}
                    {pillar.dimensions?.map((dimension, index) => (
                      <DimensionItem
                        key={dimension.id}
                        onClick={() => navigateToDimension(pillar.id, index)}
                        whileHover={{ x: 2 }}
                      >
                        <DimensionIcon>
                          <FiTarget size={14} color="#6b7280" />
                        </DimensionIcon>
                        <DimensionName>{dimension.name}</DimensionName>
                      </DimensionItem>
                    ))}

                  </DimensionList>
                )}
              </AnimatePresence>
            </PillarItem>
          );
        })}
      </PillarList>

      <ActionButtonsContainer>
        {/* Submit Assessment Button */}
        {hasAnyCompletedPillars && !isSubmitted && (
          <ResultsSection style={{ marginBottom: '16px' }}>
            <ResultsSectionTitle>
              <FiSend size={14} />
              Ready to Submit?
            </ResultsSectionTitle>
            <ActionButton
              variant="accent"
              onClick={handleSubmitAssessment}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiSend size={18} />
              <span style={{ flex: 1, textAlign: 'left' }}>Submit Assessment</span>
            </ActionButton>
            <div style={{ 
              fontSize: '12px', 
              color: '#6b7280', 
              marginTop: '8px',
              textAlign: 'center',
              lineHeight: '1.4'
            }}>
              Submit to generate your results report
            </div>
          </ResultsSection>
        )}

        {/* View Report Button - Only enabled after submission */}
        <ActionButton
          variant="primary"
          onClick={navigateToOverallResults}
          disabled={!isSubmitted}
          whileHover={{ scale: isSubmitted ? 1.05 : 1 }}
          whileTap={{ scale: isSubmitted ? 0.95 : 1 }}
          title={!isSubmitted ? "Complete and submit the assessment to view your report" : "View your maturity assessment report"}
        >
          <FiBarChart2 size={18} />
          <span style={{ flex: 1, textAlign: 'left' }}>View Report</span>
          {!isSubmitted && (
            <span style={{ 
              fontSize: '11px', 
              padding: '2px 8px', 
              background: 'rgba(0,0,0,0.1)', 
              borderRadius: '12px',
              color: '#9ca3af'
            }}>
              Locked
            </span>
          )}
        </ActionButton>
      </ActionButtonsContainer>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {showSubmitDialog && (
          <DialogOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSubmitDialog(false)}
          >
            <DialogBox
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <DialogTitle>🎯 Ready to Submit Assessment?</DialogTitle>
              <DialogMessage>
                We'll analyze your responses and generate a comprehensive report with:
                <ul style={{ marginTop: '12px', paddingLeft: '20px', color: '#4b5563' }}>
                  <li>Maturity scores and gap analysis</li>
                  <li>Personalized Databricks recommendations</li>
                  <li>Strategic roadmap and next steps</li>
                  <li>Expected business impact metrics</li>
                </ul>
              </DialogMessage>
              <DialogButtons>
                <DialogButton onClick={() => setShowSubmitDialog(false)}>
                  Cancel
                </DialogButton>
                <DialogButton $primary onClick={confirmSubmit}>
                  Submit Assessment
                </DialogButton>
              </DialogButtons>
            </DialogBox>
          </DialogOverlay>
        )}
      </AnimatePresence>

      {/* Progress Dialog */}
      <AnimatePresence>
        {isSubmitting && (
          <DialogOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <DialogBox
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <DialogTitle>✨ Generating Your Report</DialogTitle>
              <DialogMessage>
                Please wait while we analyze your assessment and create personalized recommendations...
              </DialogMessage>
              <ProgressContainer>
                <ProgressBar>
                  <ProgressFill
                    initial={{ width: '0%' }}
                    animate={{ width: `${submissionProgress}%` }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                  />
                </ProgressBar>
                <ProgressText>
                  <FiLoader size={16} />
                  {submissionMessage}
                  <span style={{ marginLeft: 'auto', fontWeight: 600, color: '#ff6b35' }}>
                    {submissionProgress}%
                  </span>
                </ProgressText>
              </ProgressContainer>
            </DialogBox>
          </DialogOverlay>
        )}
      </AnimatePresence>
    </NavigationContainer>
  );
};

export default NavigationPanel;
