import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiFileText, FiBriefcase, FiCalendar, FiArrowLeft, FiUser, FiCheckCircle, FiClock, FiEye, FiEdit } from 'react-icons/fi';
import axios from 'axios';

// Use relative URL in production (Railway), localhost in development
const API_URL = process.env.REACT_APP_API_URL || 
  (window.location.hostname === 'localhost' ? 'http://localhost:5001/api' : '/api');

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 100px 20px 40px 20px;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const BackButton = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 20px;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const Header = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 32px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const AssessmentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 24px;
`;

const TitleSection = styled.div`
  flex: 1;
`;

const AssessmentTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
`;

const AssessmentOrg = styled.div`
  font-size: 1rem;
  color: #64748b;
  margin-bottom: 12px;
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  
  ${props => {
    switch(props.$status) {
      case 'assigned':
        return `background: #fef3c7; color: #92400e;`;
      case 'in_progress':
        return `background: #dbeafe; color: #1e40af;`;
      case 'submitted':
        return `background: #e0e7ff; color: #4338ca;`;
      case 'reviewed':
        return `background: #fce7f3; color: #831843;`;
      case 'released':
        return `background: #d1fae5; color: #065f46;`;
      case 'completed':
        return `background: #d1fae5; color: #065f46;`;
      default:
        return `background: #f1f5f9; color: #475569;`;
    }
  }}
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 12px;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  width: ${props => props.$progress}%;
  transition: width 0.3s ease;
`;

const ProgressLabel = styled.div`
  font-size: 0.875rem;
  color: #64748b;
  margin-top: 4px;
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-top: 24px;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
`;

const DetailIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const DetailContent = styled.div`
  flex: 1;
`;

const DetailLabel = styled.div`
  font-size: 0.75rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
`;

const DetailValue = styled.div`
  font-size: 1rem;
  color: #1e293b;
  font-weight: 600;
  cursor: ${props => props.$clickable ? 'pointer' : 'default'};
  
  ${props => props.$clickable && `
    color: #3b82f6;
    &:hover {
      color: #2563eb;
      text-decoration: underline;
    }
  `}
`;

const Section = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 32px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 20px 0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Description = styled.p`
  color: #475569;
  line-height: 1.6;
  margin: 0;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
`;

const ActionButton = styled(motion.button)`
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  
  ${props => props.$primary ? `
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: white;
    
    &:hover {
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }
  ` : `
    background: #f1f5f9;
    color: #475569;
    
    &:hover {
      background: #e2e8f0;
    }
  `}
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #64748b;
  
  svg {
    font-size: 4rem;
    margin-bottom: 20px;
    opacity: 0.3;
  }
  
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 8px;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  color: white;
  font-size: 1.25rem;
`;

const AssessmentDetails = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssessmentDetails();
  }, [assessmentId]);

  const fetchAssessmentDetails = async () => {
    try {
      setLoading(true);
      
      // Fetch assessment details
      const assessmentResponse = await axios.get(`${API_URL}/assessments/${assessmentId}`);
      setAssessment(assessmentResponse.data.assessment);
      
      // Fetch assignment details (to get consumer info)
      try {
        const assignmentResponse = await axios.get(`${API_URL}/assignments/assessment/${assessmentId}`);
        setAssignment(assignmentResponse.data.assignment);
      } catch (err) {
        console.log('No assignment found for this assessment (might be a sample)');
      }
    } catch (error) {
      console.error('Error fetching assessment details:', error);
      
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'assigned': return <FiClock size={16} />;
      case 'in_progress': return <FiEdit size={16} />;
      case 'submitted': return <FiCheckCircle size={16} />;
      case 'reviewed': return <FiCheckCircle size={16} />;
      case 'released': return <FiCheckCircle size={16} />;
      case 'completed': return <FiCheckCircle size={16} />;
      default: return <FiClock size={16} />;
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'assigned': return 'Not Started';
      case 'in_progress': return 'In Progress';
      case 'submitted': return 'Awaiting Review';
      case 'reviewed': return 'Reviewed';
      case 'released': return 'Released';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <ContentWrapper>
          <LoadingSpinner>Loading assessment details...</LoadingSpinner>
        </ContentWrapper>
      </PageContainer>
    );
  }

  if (!assessment) {
    return (
      <PageContainer>
        <ContentWrapper>
          <BackButton
            onClick={() => navigate(-1)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiArrowLeft /> Back
          </BackButton>
          <Section>
            <EmptyState>
              <FiFileText />
              <h3>Assessment Not Found</h3>
              <p>The requested assessment could not be found.</p>
            </EmptyState>
          </Section>
        </ContentWrapper>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <ContentWrapper>
        <BackButton
          onClick={() => navigate(-1)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiArrowLeft /> Back
        </BackButton>

        <Header>
          <AssessmentHeader>
            <TitleSection>
              <AssessmentTitle>{assessment.assessment_name}</AssessmentTitle>
              {assessment.organization_name && (
                <AssessmentOrg>
                  <FiBriefcase size={16} style={{ display: 'inline', marginRight: '8px' }} />
                  {assessment.organization_name}
                </AssessmentOrg>
              )}
              <StatusBadge $status={assessment.status}>
                {getStatusIcon(assessment.status)}
                {getStatusLabel(assessment.status)}
              </StatusBadge>
              
              {assessment.progress !== undefined && assessment.progress > 0 && (
                <>
                  <ProgressBar>
                    <ProgressFill $progress={assessment.progress} />
                  </ProgressBar>
                  <ProgressLabel>{assessment.progress}% Complete</ProgressLabel>
                </>
              )}
            </TitleSection>
          </AssessmentHeader>

          <DetailGrid>
            {assignment && (
              <DetailItem>
                <DetailIcon>
                  <FiUser />
                </DetailIcon>
                <DetailContent>
                  <DetailLabel>Assigned To</DetailLabel>
                  <DetailValue 
                    $clickable 
                    onClick={() => navigate(`/user-details/${assignment.consumer_id}`)}
                  >
                    {assignment.consumer_first_name} {assignment.consumer_last_name}
                  </DetailValue>
                </DetailContent>
              </DetailItem>
            )}
            
            {assignment && (
              <DetailItem>
                <DetailIcon>
                  <FiUser />
                </DetailIcon>
                <DetailContent>
                  <DetailLabel>Assigned By</DetailLabel>
                  <DetailValue 
                    $clickable 
                    onClick={() => navigate(`/user-details/${assignment.author_id}`)}
                  >
                    {assignment.author_first_name} {assignment.author_last_name}
                  </DetailValue>
                </DetailContent>
              </DetailItem>
            )}
            
            <DetailItem>
              <DetailIcon>
                <FiCalendar />
              </DetailIcon>
              <DetailContent>
                <DetailLabel>Started</DetailLabel>
                <DetailValue>
                  {new Date(assessment.started_at || assessment.created_at).toLocaleDateString()}
                </DetailValue>
              </DetailContent>
            </DetailItem>
            
            {assessment.completed_at && (
              <DetailItem>
                <DetailIcon>
                  <FiCheckCircle />
                </DetailIcon>
                <DetailContent>
                  <DetailLabel>Completed</DetailLabel>
                  <DetailValue>
                    {new Date(assessment.completed_at).toLocaleDateString()}
                  </DetailValue>
                </DetailContent>
              </DetailItem>
            )}
          </DetailGrid>
        </Header>

        {assessment.assessment_description && (
          <Section>
            <SectionTitle>
              <FiFileText />
              Description
            </SectionTitle>
            <Description>{assessment.assessment_description}</Description>
          </Section>
        )}

        {(assessment.status === 'submitted' || assessment.status === 'released' || assessment.status === 'completed') && (
          <Section>
            <SectionTitle>Actions</SectionTitle>
            <ActionButtons>
              <ActionButton
                $primary
                onClick={() => navigate(`/results/${assessmentId}`)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiEye size={18} />
                View Results
              </ActionButton>
            </ActionButtons>
          </Section>
        )}
      </ContentWrapper>
    </PageContainer>
  );
};

export default AssessmentDetails;

