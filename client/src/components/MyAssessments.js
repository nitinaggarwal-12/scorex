import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiFileText, FiClock, FiCheckCircle, FiLock, FiEye, FiPlay } from 'react-icons/fi';
import assignmentService from '../services/assignmentService';
import authService from '../services/authService';
import toast from 'react-hot-toast';

const PageContainer = styled.div`
  min-height: 100vh;
  background: #f8fafc;
  padding: 100px 24px 60px;
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 40px;
  
  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 12px;
  }
  
  p {
    font-size: 1.125rem;
    color: #64748b;
  }
`;

const AssessmentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
`;

const AssessmentCard = styled(motion.div)`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: ${props => props.$clickable ? 'pointer' : 'default'};
  border: 2px solid transparent;
  transition: all 0.2s;
  
  &:hover {
    border-color: ${props => props.$clickable ? '#2563eb' : 'transparent'};
    box-shadow: ${props => props.$clickable ? '0 4px 12px rgba(37, 99, 235, 0.15)' : '0 2px 8px rgba(0, 0, 0, 0.08)'};
  }
`;

const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 16px;
  
  ${props => {
    switch(props.$status) {
      case 'assigned':
        return `
          background: #fef3c7;
          color: #92400e;
        `;
      case 'in_progress':
        return `
          background: #dbeafe;
          color: #1e40af;
        `;
      case 'submitted':
        return `
          background: #e0e7ff;
          color: #4338ca;
        `;
      case 'released':
        return `
          background: #d1fae5;
          color: #065f46;
        `;
      default:
        return `
          background: #f1f5f9;
          color: #475569;
        `;
    }
  }}
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
`;

const CardMeta = styled.div`
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 16px;
`;

const CardDescription = styled.p`
  color: #64748b;
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 12px 0;
`;

const CardActions = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 16px;
`;

const Button = styled.button`
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  display: flex;
  align-items: center;
  gap: 8px;
  
  ${props => props.$primary ? `
    background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
    color: white;
    
    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    }
  ` : `
    background: #f1f5f9;
    color: #475569;
    
    &:hover:not(:disabled) {
      background: #e2e8f0;
    }
  `}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 20px;
  
  svg {
    font-size: 4rem;
    color: #cbd5e1;
    margin-bottom: 20px;
  }
  
  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #475569;
    margin-bottom: 12px;
  }
  
  p {
    font-size: 1rem;
    color: #64748b;
  }
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 100px 20px;
  
  p {
    font-size: 1.125rem;
    color: #64748b;
  }
`;

const MyAssessments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication
    if (!authService.isAuthenticated()) {
      navigate('/');
      return;
    }
    
    // Get current user info from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    
    loadAssignments();
  }, [navigate]);

  const loadAssignments = async () => {
    setLoading(true);
    const result = await assignmentService.getMyAssignments();
    if (result.success) {
      setAssignments(result.assignments);
    } else {
      
    }
    setLoading(false);
  };
  
  // Get page title and subtitle based on role
  const getPageTitle = () => {
    if (!currentUser) return 'My Assignments';
    switch(currentUser.role) {
      case 'admin':
        return 'All Assignments';
      case 'author':
        return 'My Assignments';
      case 'consumer':
        return 'My Assessments';
      default:
        return 'My Assignments';
    }
  };
  
  const getPageSubtitle = () => {
    if (!currentUser) return 'Track and manage all assessment assignments';
    switch(currentUser.role) {
      case 'admin':
        return 'View and manage all assessment assignments across the platform';
      case 'author':
        return 'Track assessments you created or are assigned to review';
      case 'consumer':
        return 'Complete your assigned assessments and view results';
      default:
        return 'Track and manage all assessment assignments';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'assigned':
        return <FiClock />;
      case 'in_progress':
        return <FiPlay />;
      case 'submitted':
        return <FiFileText />;
      case 'released':
        return <FiCheckCircle />;
      default:
        return <FiLock />;
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'assigned':
        return 'Not Started';
      case 'in_progress':
        return 'In Progress';
      case 'submitted':
        return 'Pending Review';
      case 'released':
        return 'Results Available';
      default:
        return status;
    }
  };

  const handleCardClick = (assignment) => {
    if (assignment.status === 'assigned' || assignment.status === 'in_progress') {
      // Navigate to the first pillar of the assessment
      navigate(`/assessment/${assignment.assessment_id}/platform_governance`);
    } else if (assignment.status === 'released') {
      navigate(`/results/${assignment.assessment_id}`);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <Content>
          <LoadingState>
            <p>Loading your assessments...</p>
          </LoadingState>
        </Content>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Content>
        <Header>
          <h1>{getPageTitle()}</h1>
          <p>{getPageSubtitle()}</p>
          {currentUser && currentUser.role && (
            <p style={{ 
              fontSize: '0.875rem', 
              color: '#64748b', 
              marginTop: '0.5rem',
              fontWeight: '500'
            }}>
              Viewing as: <span style={{ color: '#3b82f6', fontWeight: '600', textTransform: 'capitalize' }}>{currentUser.role}</span>
            </p>
          )}
        </Header>

        {assignments.length === 0 ? (
          <EmptyState>
            <FiFileText />
            <h3>No {currentUser?.role === 'admin' ? 'Assignments' : currentUser?.role === 'author' ? 'Assignments' : 'Assessments'} Yet</h3>
            <p>{currentUser?.role === 'admin' 
                ? 'No assessment assignments have been created yet.' 
                : currentUser?.role === 'author'
                ? 'You haven\'t created any assignments yet.'
                : 'You don\'t have any assigned assessments at this time.'
            }</p>
            {currentUser?.role === 'consumer' && (
              <p style={{ marginTop: '8px', fontSize: '0.875rem' }}>
                Your Databricks team will assign assessments to you via email.
              </p>
            )}
          </EmptyState>
        ) : (
          <AssessmentGrid>
            {assignments.map((assignment) => (
              <AssessmentCard
                key={assignment.id}
                $clickable={assignment.status !== 'submitted'}
                onClick={() => assignment.status !== 'submitted' && handleCardClick(assignment)}
                whileHover={{ y: assignment.status !== 'submitted' ? -4 : 0 }}
              >
                <StatusBadge $status={assignment.status}>
                  {getStatusIcon(assignment.status)}
                  {getStatusLabel(assignment.status)}
                </StatusBadge>
                
                <CardTitle>{assignment.assessment_name}</CardTitle>
                {assignment.organization_name && (
                  <CardMeta>{assignment.organization_name}</CardMeta>
                )}
                
                {/* Show assignee for admin/author, show creator for consumer */}
                {currentUser && (currentUser.role === 'admin' || currentUser.role === 'author') && assignment.consumer_email && (
                  <CardMeta style={{ color: '#3b82f6', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                    👤 Assigned to: {assignment.consumer_first_name} {assignment.consumer_last_name} ({assignment.consumer_email})
                  </CardMeta>
                )}
                {currentUser && currentUser.role === 'consumer' && assignment.author_email && (
                  <CardMeta style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                    Created by: {assignment.author_first_name} {assignment.author_last_name}
                  </CardMeta>
                )}
                
                {assignment.status === 'submitted' && (
                  <CardDescription>
                    Your assessment has been submitted and is awaiting review by your Databricks team. 
                    You'll be notified when results are available.
                  </CardDescription>
                )}
                
                {assignment.status === 'assigned' && (
                  <CardDescription>
                    Start your assessment to evaluate your organization's data and AI maturity.
                  </CardDescription>
                )}
                
                {assignment.status === 'in_progress' && assignment.progress > 0 && (
                  <CardDescription>
                    Progress: {assignment.progress}% complete
                  </CardDescription>
                )}
                
                {assignment.status === 'released' && (
                  <>
                    <CardDescription>
                      Your maturity assessment results are now available to view.
                    </CardDescription>
                    <CardActions>
                      <Button 
                        $primary
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/results/${assignment.assessment_id}`);
                        }}
                      >
                        <FiEye size={16} />
                        View Results
                      </Button>
                    </CardActions>
                  </>
                )}
                
                {(assignment.status === 'assigned' || assignment.status === 'in_progress') && (
                  <CardActions>
                    <Button 
                      $primary
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/assessment/${assignment.assessment_id}/platform_governance`);
                      }}
                    >
                      <FiPlay size={16} />
                      {assignment.status === 'assigned' ? 'Start Assessment' : 'Continue'}
                    </Button>
                  </CardActions>
                )}
              </AssessmentCard>
            ))}
          </AssessmentGrid>
        )}
      </Content>
    </PageContainer>
  );
};

export default MyAssessments;

