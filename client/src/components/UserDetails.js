import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiBriefcase, FiCalendar, FiArrowLeft, FiFileText, FiCheckCircle, FiClock } from 'react-icons/fi';
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

const UserInfoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 24px;
`;

const Avatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
  font-weight: 700;
  text-transform: uppercase;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
`;

const UserRole = styled.span`
  display: inline-block;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  background: ${props => {
    switch(props.$role) {
      case 'admin': return 'linear-gradient(135deg, #f43f5e 0%, #dc2626 100%)';
      case 'author': return 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
      case 'consumer': return 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
      default: return '#f1f5f9';
    }
  }};
  color: white;
  text-transform: capitalize;
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

const AssignmentCard = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  transition: all 0.2s;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: #cbd5e1;
  }
`;

const AssignmentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 12px;
`;

const AssessmentName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  cursor: pointer;
  color: #3b82f6;
  
  &:hover {
    color: #2563eb;
    text-decoration: underline;
  }
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.875rem;
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
      default:
        return `background: #f1f5f9; color: #475569;`;
    }
  }}
`;

const AssignmentDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e2e8f0;
`;

const AssignmentDetail = styled.div`
  font-size: 0.875rem;
  color: #64748b;
  
  strong {
    color: #1e293b;
    display: block;
    margin-bottom: 2px;
  }
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

const UserDetails = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      
      // Fetch user details
      const userResponse = await axios.get(`${API_URL}/auth/users/${userId}`);
      setUser(userResponse.data.user);
      
      // Fetch user's assignments
      const assignmentsResponse = await axios.get(`${API_URL}/assignments/user/${userId}`);
      setAssignments(assignmentsResponse.data.assignments || []);
    } catch (error) {
      console.error('Error fetching user details:', error);
      
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`;
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'assigned': return <FiClock size={14} />;
      case 'in_progress': return <FiFileText size={14} />;
      case 'submitted': return <FiCheckCircle size={14} />;
      case 'reviewed': return <FiCheckCircle size={14} />;
      case 'released': return <FiCheckCircle size={14} />;
      default: return <FiClock size={14} />;
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'assigned': return 'Not Started';
      case 'in_progress': return 'In Progress';
      case 'submitted': return 'Awaiting Review';
      case 'reviewed': return 'Reviewed';
      case 'released': return 'Released';
      default: return status;
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <ContentWrapper>
          <LoadingSpinner>Loading user details...</LoadingSpinner>
        </ContentWrapper>
      </PageContainer>
    );
  }

  if (!user) {
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
              <FiUser />
              <h3>User Not Found</h3>
              <p>The requested user could not be found.</p>
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
          <UserInfoSection>
            <Avatar>
              {getInitials(user.first_name, user.last_name)}
            </Avatar>
            <UserInfo>
              <UserName>{user.first_name} {user.last_name}</UserName>
              <UserRole $role={user.role}>{user.role}</UserRole>
            </UserInfo>
          </UserInfoSection>

          <DetailGrid>
            <DetailItem>
              <DetailIcon>
                <FiMail />
              </DetailIcon>
              <DetailContent>
                <DetailLabel>Email</DetailLabel>
                <DetailValue>{user.email}</DetailValue>
              </DetailContent>
            </DetailItem>
            
            <DetailItem>
              <DetailIcon>
                <FiBriefcase />
              </DetailIcon>
              <DetailContent>
                <DetailLabel>Organization</DetailLabel>
                <DetailValue>{user.organization || 'N/A'}</DetailValue>
              </DetailContent>
            </DetailItem>
            
            <DetailItem>
              <DetailIcon>
                <FiCalendar />
              </DetailIcon>
              <DetailContent>
                <DetailLabel>Joined</DetailLabel>
                <DetailValue>
                  {new Date(user.created_at).toLocaleDateString()}
                </DetailValue>
              </DetailContent>
            </DetailItem>
          </DetailGrid>
        </Header>

        <Section>
          <SectionTitle>
            <FiFileText />
            Assignments ({assignments.length})
          </SectionTitle>

          {assignments.length === 0 ? (
            <EmptyState>
              <FiFileText />
              <h3>No Assignments</h3>
              <p>This user has no assessments assigned yet.</p>
            </EmptyState>
          ) : (
            assignments.map((assignment) => (
              <AssignmentCard key={assignment.id}>
                <AssignmentHeader>
                  <AssessmentName onClick={() => navigate(`/assessment-details/${assignment.assessment_id}`)}>
                    {assignment.assessment_name}
                  </AssessmentName>
                  <StatusBadge $status={assignment.status}>
                    {getStatusIcon(assignment.status)}
                    {getStatusLabel(assignment.status)}
                  </StatusBadge>
                </AssignmentHeader>
                
                <AssignmentDetails>
                  <AssignmentDetail>
                    <strong>Organization</strong>
                    {assignment.organization_name || 'N/A'}
                  </AssignmentDetail>
                  <AssignmentDetail>
                    <strong>Assigned By</strong>
                    {assignment.author_first_name} {assignment.author_last_name}
                  </AssignmentDetail>
                  <AssignmentDetail>
                    <strong>Assigned Date</strong>
                    {new Date(assignment.assigned_at).toLocaleDateString()}
                  </AssignmentDetail>
                  {assignment.progress > 0 && (
                    <AssignmentDetail>
                      <strong>Progress</strong>
                      {assignment.progress}% complete
                    </AssignmentDetail>
                  )}
                </AssignmentDetails>
              </AssignmentCard>
            ))
          )}
        </Section>
      </ContentWrapper>
    </PageContainer>
  );
};

export default UserDetails;

