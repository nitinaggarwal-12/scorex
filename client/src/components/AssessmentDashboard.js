import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FiBarChart2, 
  FiPlay, 
  FiCheckCircle, 
  FiClock,
  FiUser,
  FiCalendar,
  FiTarget,
  FiLogOut,
  FiEdit3,
  FiTrendingUp,
  FiArrowRight
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import * as assessmentService from '../services/assessmentService';
import LoadingSpinner from './LoadingSpinner';

const DashboardContainer = styled.div`
  min-height: calc(100vh - 80px);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const WelcomeSection = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 40px;
  margin-bottom: 32px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const WelcomeTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 16px;
`;

const WelcomeSubtitle = styled.p`
  font-size: 1.2rem;
  color: #6b7280;
  margin-bottom: 32px;
`;

const LogoutButton = styled(motion.button)`
  position: absolute;
  top: 20px;
  right: 20px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 20px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: #dc2626;
    transform: translateY(-2px);
  }
`;

const AssessmentCard = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 40px;
  margin-bottom: 32px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
`;

const AssessmentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
`;

const AssessmentInfo = styled.div`
  flex: 1;
`;

const AssessmentTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
`;

const AssessmentMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  margin-bottom: 16px;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6b7280;
  font-size: 0.95rem;
`;

const StatusBadge = styled.div`
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
  background: ${props => props.status === 'completed' ? '#dcfce7' : '#fef3c7'};
  color: ${props => props.status === 'completed' ? '#166534' : '#92400e'};
`;

const ProgressSection = styled.div`
  margin-bottom: 32px;
`;

const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const ProgressTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
`;

const ProgressPercentage = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #3b82f6;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 12px;
  background: #f3f4f6;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 16px;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  width: ${props => props.percentage}%;
  transition: width 0.5s ease;
`;

const PillarsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

const PillarCard = styled(motion.div)`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
`;

const PillarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const PillarName = styled.h4`
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
`;

const PillarStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.9rem;
  color: ${props => props.completed ? '#10b981' : '#f59e0b'};
`;

const PillarProgress = styled.div`
  font-size: 0.9rem;
  color: #6b7280;
  margin-bottom: 16px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
`;

const ActionButton = styled(motion.button)`
  padding: 16px 32px;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;

  ${props => props.variant === 'primary' && `
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
    }
  `}

  ${props => props.variant === 'secondary' && `
    background: white;
    color: #374151;
    border: 2px solid #e5e7eb;
    
    &:hover {
      border-color: #3b82f6;
      color: #3b82f6;
    }
  `}

  ${props => props.variant === 'success' && `
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
    }
  `}
`;

const AssessmentDashboard = ({ currentAssessment: propAssessment, framework, onLogout }) => {
  const navigate = useNavigate();
  const { assessmentId } = useParams();
  const [loading, setLoading] = useState(false);
  const [assessment, setAssessment] = useState(propAssessment);
  const [error, setError] = useState(null);

  // Load assessment from URL param if present and not in props
  useEffect(() => {
    const loadAssessment = async () => {
      // If assessmentId in URL but no prop, fetch from backend
      if (assessmentId && !propAssessment) {
        try {
          setLoading(true);
          setError(null);
          const fetchedAssessment = await assessmentService.getAssessmentStatus(assessmentId);
          if (fetchedAssessment && fetchedAssessment.data) {
            setAssessment(fetchedAssessment.data);
          } else {
            setError('Assessment not found');
          }
        } catch (err) {
          console.error('Error loading assessment:', err);
          setError('Failed to load assessment');
          
        } finally {
          setLoading(false);
        }
      } else if (propAssessment) {
        setAssessment(propAssessment);
      }
    };

    loadAssessment();
  }, [assessmentId, propAssessment]);

  if (loading) {
    return (
      <DashboardContainer>
        <ContentWrapper>
          <LoadingSpinner message="Loading your assessment..." />
        </ContentWrapper>
      </DashboardContainer>
    );
  }

  if (error || (!assessment && !loading)) {
    return (
      <DashboardContainer>
        <ContentWrapper>
          <WelcomeSection>
            <WelcomeTitle>{error || 'No Active Assessment'}</WelcomeTitle>
            <WelcomeSubtitle>
              {error ? 'The assessment you are looking for could not be found.' : 'You don\'t have an active assessment. Start a new one to continue.'}
            </WelcomeSubtitle>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <ActionButton
                variant="primary"
                onClick={() => navigate('/start')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiPlay size={16} />
                Start New Assessment
              </ActionButton>
              <ActionButton
                variant="secondary"
                onClick={() => navigate('/assessments')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                View Past Assessments
              </ActionButton>
            </div>
          </WelcomeSection>
        </ContentWrapper>
      </DashboardContainer>
    );
  }

  const currentAssessment = assessment;

  const handleContinueAssessment = () => {
    // Find the first incomplete pillar or go to the first one
    const incompletePillar = framework?.assessmentAreas?.find(area => 
      !currentAssessment.completedCategories?.includes(area.id)
    );
    
    const targetPillar = incompletePillar || framework?.assessmentAreas?.[0];
    if (targetPillar) {
      navigate(`/assessment/${currentAssessment.id}/${targetPillar.id}`);
    }
  };

  const handleViewResults = () => {
    navigate(`/results/${currentAssessment.id}`);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout? You can continue your assessment later from the Past Assessments page.')) {
      onLogout();
      navigate('/');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const completedPillars = currentAssessment.completedCategories?.length || 0;
  const totalPillars = framework?.assessmentAreas?.length || 6;
  const progress = Math.round((completedPillars / totalPillars) * 100);

  return (
    <DashboardContainer>
      <LogoutButton
        onClick={handleLogout}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <FiLogOut size={16} />
        Logout
      </LogoutButton>

      <ContentWrapper>
        <WelcomeSection
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <WelcomeTitle>Welcome Back!</WelcomeTitle>
          <WelcomeSubtitle>Continue your Databricks maturity assessment</WelcomeSubtitle>
        </WelcomeSection>

        <AssessmentCard
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <AssessmentHeader>
            <AssessmentInfo>
              <AssessmentTitle>{currentAssessment.assessmentName || 'Databricks Assessment'}</AssessmentTitle>
              <AssessmentMeta>
                <MetaItem>
                  <FiUser size={16} />
                  {currentAssessment.organizationName}
                </MetaItem>
                <MetaItem>
                  <FiCalendar size={16} />
                  Started {formatDate(currentAssessment.startedAt)}
                </MetaItem>
                {currentAssessment.industry && (
                  <MetaItem>
                    <FiTarget size={16} />
                    {currentAssessment.industry}
                  </MetaItem>
                )}
              </AssessmentMeta>
              {currentAssessment.assessmentDescription && (
                <p style={{ color: '#6b7280', fontStyle: 'italic', marginBottom: '16px' }}>
                  {currentAssessment.assessmentDescription}
                </p>
              )}
            </AssessmentInfo>
            <StatusBadge status={currentAssessment.status}>
              {currentAssessment.status === 'completed' ? 'Completed' : 'In Progress'}
            </StatusBadge>
          </AssessmentHeader>

          <ProgressSection>
            <ProgressHeader>
              <ProgressTitle>Overall Progress</ProgressTitle>
              <ProgressPercentage>{progress}%</ProgressPercentage>
            </ProgressHeader>
            <ProgressBar>
              <ProgressFill percentage={progress} />
            </ProgressBar>
            <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>
              {completedPillars} of {totalPillars} pillars completed
            </div>
          </ProgressSection>

          <PillarsGrid>
            {framework?.assessmentAreas?.map((pillar, index) => {
              const isCompleted = currentAssessment.completedCategories?.includes(pillar.id);
              return (
                <PillarCard
                  key={pillar.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  onClick={() => navigate(`/assessment/${currentAssessment.id}/${pillar.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <PillarHeader>
                    <PillarName>{pillar.name}</PillarName>
                    <PillarStatus completed={isCompleted}>
                      {isCompleted ? <FiCheckCircle size={16} /> : <FiClock size={16} />}
                      {isCompleted ? 'Complete' : 'Pending'}
                    </PillarStatus>
                  </PillarHeader>
                  <PillarProgress>
                    {pillar.dimensions?.length || 0} dimensions • {pillar.dimensions?.reduce((total, dim) => total + (dim.questions?.length || 0), 0) || 0} questions
                  </PillarProgress>
                </PillarCard>
              );
            })}
          </PillarsGrid>

          <ActionButtons>
            <ActionButton
              variant="primary"
              onClick={handleContinueAssessment}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiPlay size={16} />
              Continue Assessment
            </ActionButton>
            
            {completedPillars > 0 && (
              <ActionButton
                variant="success"
                onClick={handleViewResults}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiTrendingUp size={16} />
                View Results
              </ActionButton>
            )}
            
            <ActionButton
              variant="secondary"
              onClick={() => navigate('/assessments')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiEdit3 size={16} />
              Past Assessments
            </ActionButton>
          </ActionButtons>
        </AssessmentCard>
      </ContentWrapper>
    </DashboardContainer>
  );
};

export default AssessmentDashboard;
