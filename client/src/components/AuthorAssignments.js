import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiUsers, FiFileText, FiClock, FiCheckCircle, FiSend, FiEye, FiArrowLeft, FiMail } from 'react-icons/fi';
import axios from 'axios';
import authService from '../services/authService';

// Use relative URL in production (Railway), localhost in development
const API_URL = process.env.REACT_APP_API_URL || 
  (window.location.hostname === 'localhost' ? 'http://localhost:5001/api' : '/api');

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 100px 20px 40px 20px;
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 32px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const BackButton = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 20px;
  
  &:hover {
    background: rgba(102, 126, 234, 0.2);
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: #64748b;
  margin: 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 24px;
`;

const StatCard = styled.div`
  background: ${props => props.$gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  padding: 20px;
  border-radius: 12px;
  color: white;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  opacity: 0.9;
  margin-bottom: 8px;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
`;

const AssignmentsTable = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const TableTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 12px 16px;
  border-bottom: 2px solid #e2e8f0;
  color: #64748b;
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Td = styled.td`
  padding: 16px;
  border-bottom: 1px solid #f1f5f9;
  color: #1e293b;
`;

const Tr = styled.tr`
  transition: background 0.2s;
  
  &:hover {
    background: #f8fafc;
  }
`;

const ClickableLink = styled.span`
  color: #3b82f6;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s;
  
  &:hover {
    color: #2563eb;
    text-decoration: underline;
  }
`;

const EmailText = styled.div`
  font-size: 0.875rem;
  color: #64748b;
  margin-top: 2px;
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

const ActionButton = styled(motion.button)`
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  border: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-right: 8px;
  
  ${props => props.$primary ? `
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: white;
    
    &:hover {
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }
  ` : props.$success ? `
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    
    &:hover {
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    }
  ` : `
    background: #f1f5f9;
    color: #475569;
    
    &:hover {
      background: #e2e8f0;
    }
  `}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
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

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
`;

const ModalContent = styled(motion.div)`
  background: white;
  border-radius: 16px;
  padding: 32px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
`;

const ModalIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
`;

const ModalTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
`;

const ModalBody = styled.div`
  margin-bottom: 24px;
  color: #475569;
  line-height: 1.6;
  
  p {
    margin: 8px 0;
  }
  
  strong {
    color: #1e293b;
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const ModalButton = styled(motion.button)`
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  border: none;
  
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

const AuthorAssignments = () => {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sendingReminder, setSendingReminder] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ show: false, assignment: null });

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/assignments/all`);
      setAssignments(response.data.assignments || []);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      
    } finally {
      setLoading(false);
    }
  };

  const openReminderConfirm = (assignment) => {
    setConfirmModal({ show: true, assignment });
  };

  const closeReminderConfirm = () => {
    setConfirmModal({ show: false, assignment: null });
  };

  const sendReminder = async () => {
    const assignment = confirmModal.assignment;
    if (!assignment) return;

    setSendingReminder(assignment.id);
    closeReminderConfirm();
    
    try {
      await axios.post(`${API_URL}/assignments/${assignment.id}/remind`);
      
    } catch (error) {
      console.error('Error sending reminder:', error);
      
    } finally {
      setSendingReminder(null);
    }
  };

  const releaseResults = async (assignment) => {
    try {
      await axios.post(`${API_URL}/assignments/release/${assignment.assessment_id}`);
      
      fetchAssignments(); // Refresh list
    } catch (error) {
      console.error('Error releasing results:', error);
      
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'assigned': return <FiClock size={14} />;
      case 'in_progress': return <FiFileText size={14} />;
      case 'submitted': return <FiCheckCircle size={14} />;
      case 'reviewed': return <FiEye size={14} />;
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

  const stats = {
    total: assignments.length,
    pending: assignments.filter(a => a.status === 'assigned' || a.status === 'in_progress').length,
    submitted: assignments.filter(a => a.status === 'submitted').length,
    released: assignments.filter(a => a.status === 'released').length
  };

  if (loading) {
    return (
      <PageContainer>
        <ContentWrapper>
          <div style={{ textAlign: 'center', padding: '100px 20px', color: 'white' }}>
            <p style={{ fontSize: '1.25rem' }}>Loading assignments...</p>
          </div>
        </ContentWrapper>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <ContentWrapper>
        <BackButton
          onClick={() => navigate('/user-management')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiArrowLeft /> Back to Consumers
        </BackButton>

        <Header>
          <Title>
            <FiFileText />
            My Assignments
          </Title>
          <Subtitle>
            Track and manage all assessment assignments
          </Subtitle>

          <StatsGrid>
            <StatCard $gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
              <StatLabel>Total Assignments</StatLabel>
              <StatValue>{stats.total}</StatValue>
            </StatCard>
            <StatCard $gradient="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)">
              <StatLabel>Pending</StatLabel>
              <StatValue>{stats.pending}</StatValue>
            </StatCard>
            <StatCard $gradient="linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)">
              <StatLabel>Submitted</StatLabel>
              <StatValue>{stats.submitted}</StatValue>
            </StatCard>
            <StatCard $gradient="linear-gradient(135deg, #10b981 0%, #059669 100%)">
              <StatLabel>Released</StatLabel>
              <StatValue>{stats.released}</StatValue>
            </StatCard>
          </StatsGrid>
        </Header>

        <AssignmentsTable>
          <TableHeader>
            <TableTitle>Assignment Details</TableTitle>
            <ActionButton
              $success
              onClick={() => navigate('/assign-assessment')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiSend size={16} />
              New Assignment
            </ActionButton>
          </TableHeader>

          {assignments.length === 0 ? (
            <EmptyState>
              <FiFileText />
              <h3>No Assignments Yet</h3>
              <p>Create your first assignment to get started</p>
            </EmptyState>
          ) : (
            <Table>
              <thead>
                <tr>
                  <Th>Consumer</Th>
                  <Th>Assessment</Th>
                  <Th>Organization</Th>
                  <Th>Status</Th>
                  <Th>Assigned Date</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((assignment) => (
                  <Tr key={assignment.id}>
                    <Td>
                      <ClickableLink onClick={() => navigate(`/user-details/${assignment.consumer_id}`)}>
                        {assignment.consumer_first_name} {assignment.consumer_last_name}
                      </ClickableLink>
                      <EmailText>
                        {assignment.consumer_email}
                      </EmailText>
                    </Td>
                    <Td>
                      <ClickableLink onClick={() => navigate(`/results/${assignment.assessment_id}`)}>
                        {assignment.assessment_name}
                      </ClickableLink>
                      {assignment.progress > 0 && (
                        <EmailText>
                          {assignment.progress}% complete
                        </EmailText>
                      )}
                    </Td>
                    <Td>{assignment.organization_name || 'N/A'}</Td>
                    <Td>
                      <StatusBadge $status={assignment.status}>
                        {getStatusIcon(assignment.status)}
                        {getStatusLabel(assignment.status)}
                      </StatusBadge>
                    </Td>
                    <Td>
                      {new Date(assignment.assigned_at).toLocaleDateString()}
                    </Td>
                    <Td>
                      {(assignment.status === 'assigned' || assignment.status === 'in_progress') && (
                        <ActionButton
                          onClick={() => openReminderConfirm(assignment)}
                          disabled={sendingReminder === assignment.id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FiMail size={14} />
                          {sendingReminder === assignment.id ? 'Sending...' : 'Remind'}
                        </ActionButton>
                      )}
                      {assignment.status === 'submitted' && (
                        <>
                          <ActionButton
                            $primary
                            onClick={() => navigate(`/results/${assignment.assessment_id}`)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <FiEye size={14} />
                            Review
                          </ActionButton>
                          <ActionButton
                            $success
                            onClick={() => releaseResults(assignment)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <FiSend size={14} />
                            Release
                          </ActionButton>
                        </>
                      )}
                      {assignment.status === 'released' && (
                        <ActionButton
                          $primary
                          onClick={() => navigate(`/results/${assignment.assessment_id}`)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FiEye size={14} />
                          View
                        </ActionButton>
                      )}
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          )}
        </AssignmentsTable>
      </ContentWrapper>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmModal.show && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeReminderConfirm}
          >
            <ModalContent
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalHeader>
                <ModalIcon>
                  <FiMail />
                </ModalIcon>
                <ModalTitle>Send Reminder?</ModalTitle>
              </ModalHeader>
              <ModalBody>
                <p>Are you sure you want to send a reminder email to:</p>
                <p>
                  <strong>{confirmModal.assignment?.consumer_first_name} {confirmModal.assignment?.consumer_last_name}</strong>
                  <br />
                  {confirmModal.assignment?.consumer_email}
                </p>
                <p>For assessment: <strong>{confirmModal.assignment?.assessment_name}</strong></p>
              </ModalBody>
              <ModalActions>
                <ModalButton
                  onClick={closeReminderConfirm}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </ModalButton>
                <ModalButton
                  $primary
                  onClick={sendReminder}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiSend size={14} style={{ marginRight: '6px' }} />
                  Send Reminder
                </ModalButton>
              </ModalActions>
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </PageContainer>
  );
};

export default AuthorAssignments;

