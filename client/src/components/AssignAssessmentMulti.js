import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiFileText, FiSend, FiArrowLeft, FiX, FiUserPlus } from 'react-icons/fi';
import authService from '../services/authService';
import * as assessmentService from '../services/assessmentService';
import assignmentService from '../services/assignmentService';
import MultiSelectDropdown from './MultiSelectDropdown';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 100px 20px 40px 20px;
`;

const ContentWrapper = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
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

const Title = styled.h1`
  font-size: 2.5rem;
  color: white;
  margin-bottom: 12px;
`;

const Subtitle = styled.p`
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.9);
`;

const Card = styled(motion.div)`
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const FormSection = styled.div`
  margin-bottom: 32px;
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  color: #1e293b;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const FormGroup = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  color: #334155;
  margin-bottom: 8px;
  font-size: 0.9375rem;
`;

const SearchWrapper = styled.div`
  position: relative;
  margin-bottom: 12px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px 12px 44px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
  
  &::placeholder {
    color: #94a3b8;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
`;

const UsersList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  margin-bottom: 12px;
`;

const UserItem = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid #f1f5f9;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  ${props => props.$selected && `
    background: #eff6ff;
    border-left: 3px solid #3b82f6;
  `}
  
  &:hover {
    background: ${props => props.$selected ? '#dbeafe' : '#f8fafc'};
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.div`
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 2px;
`;

const UserEmail = styled.div`
  font-size: 0.875rem;
  color: #64748b;
`;

const CheckIcon = styled.div`
  color: #3b82f6;
  display: flex;
  align-items: center;
`;

const SelectedUsers = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  min-height: 42px;
  padding: 8px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: #f8fafc;
  align-items: center;
`;

const SelectedUserBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  
  &:hover {
    opacity: 0.8;
  }
`;

const EmptyState = styled.div`
  padding: 20px;
  text-align: center;
  color: #94a3b8;
  font-size: 0.875rem;
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const SubmitButton = styled(motion.button)`
  width: 100%;
  padding: 14px 24px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const NewButton = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  margin-left: 12px;
`;

const AssignAssessmentMulti = () => {
  const navigate = useNavigate();
  const [consumers, setConsumers] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [selectedAssessmentIds, setSelectedAssessmentIds] = useState([]);
  const [formData, setFormData] = useState({
    newAssessmentName: '',
    newAssessmentOrganization: '',
    newAssessmentDescription: '',
    newConsumerFirstName: '',
    newConsumerLastName: '',
    newConsumerEmail: '',
    newConsumerOrganization: '',
    message: ''
  });
  const [isCreatingNewAssessment, setIsCreatingNewAssessment] = useState(false);
  const [isCreatingNewConsumer, setIsCreatingNewConsumer] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load consumers
      const usersResponse = await authService.getUsers();
      const consumerUsers = usersResponse.users.filter(u => u.role === 'consumer');
      setConsumers(consumerUsers);

      // Load assessments
      const assessmentsData = await assessmentService.getAllAssessments();
      setAssessments(assessmentsData);
    } catch (error) {
      console.error('Error loading data:', error);
      
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation for consumers
    if (!isCreatingNewConsumer && selectedUserIds.length === 0) {
      
      return;
    }

    if (isCreatingNewConsumer) {
      if (!formData.newConsumerFirstName || !formData.newConsumerLastName || !formData.newConsumerEmail) {
        
        return;
      }
    }

    // Validation for assessments
    if (!isCreatingNewAssessment && selectedAssessmentIds.length === 0) {
      
      return;
    }

    if (isCreatingNewAssessment && !formData.newAssessmentName) {
      
      return;
    }

    setSubmitting(true);

    try {
      let successCount = 0;
      let failCount = 0;

      // Determine which consumers to process
      let consumersToProcess = [];
      
      if (isCreatingNewConsumer) {
        // Creating a new consumer - will be created during assignment
        consumersToProcess = [{
          email: formData.newConsumerEmail,
          firstName: formData.newConsumerFirstName,
          lastName: formData.newConsumerLastName,
          organization: formData.newConsumerOrganization,
          isNew: true
        }];
      } else {
        // Using existing consumers
        consumersToProcess = selectedUserIds.map(userId => ({
          ...consumers.find(c => c.id === userId),
          isNew: false
        }));
      }

      // For each consumer
      for (const consumer of consumersToProcess) {
        if (isCreatingNewAssessment) {
          // Create new assessment for this consumer
          try {
            const assignmentData = {
              consumerEmail: consumer.email,
              assessmentName: formData.newAssessmentName,
              organizationName: formData.newAssessmentOrganization || consumer.organization,
              assessmentDescription: formData.newAssessmentDescription,
              message: formData.message
            };
            
            // If creating a new consumer, include their details
            if (consumer.isNew) {
              assignmentData.firstName = consumer.firstName;
              assignmentData.lastName = consumer.lastName;
              assignmentData.organization = consumer.organization;
            }
            
            await assignmentService.assignAssessment(assignmentData);
            successCount++;
          } catch (error) {
            console.error(`Failed to assign new assessment to ${consumer.email}:`, error);
            failCount++;
          }
        } else {
          // Assign each selected assessment to this consumer
          for (const assessmentId of selectedAssessmentIds) {
            try {
              if (consumer.isNew) {
                // For new consumers, use email-based assignment with full details
                await assignmentService.assignAssessment({
                  consumerEmail: consumer.email,
                  firstName: consumer.firstName,
                  lastName: consumer.lastName,
                  organization: consumer.organization,
                  assessmentId: assessmentId,
                  message: formData.message
                });
              } else {
                // For existing consumers, use ID-based assignment
                await assignmentService.assignAssessment({
                  consumerId: consumer.id,
                  assessmentId: assessmentId,
                  message: formData.message
                });
              }
              successCount++;
            } catch (error) {
              console.error(`Failed to assign assessment ${assessmentId} to ${consumer.email}:`, error);
              failCount++;
            }
          }
        }
      }

      if (successCount > 0) {
        
        navigate('/my-assignments');
      }
      
      if (failCount > 0) {
        
      }
    } catch (error) {
      console.error('Error assigning assessments:', error);
      
    } finally {
      setSubmitting(false);
    }
  };

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
          <Title>Assign Assessment</Title>
          <Subtitle>Select consumers and assign an assessment</Subtitle>
        </Header>

        <Card
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <form onSubmit={handleSubmit}>
            {/* Select Consumers */}
            <FormSection>
              <SectionTitle>
                <FiUser />
                Select Consumers
              </SectionTitle>

              {!isCreatingNewConsumer ? (
                <FormGroup>
                  <Label>Consumers *</Label>
                  <MultiSelectDropdown
                    options={consumers.map(c => ({
                      id: c.id,
                      title: `${c.first_name} ${c.last_name}`,
                      subtitle: c.email
                    }))}
                    selectedIds={selectedUserIds}
                    onChange={setSelectedUserIds}
                    placeholder="Select consumers..."
                  />
                  <div style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '8px' }}>
                    {selectedUserIds.length === 0 
                      ? 'Click to select one or more consumers' 
                      : `${selectedUserIds.length} consumer(s) selected`}
                  </div>
                  <NewButton
                    type="button"
                    onClick={() => setIsCreatingNewConsumer(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ marginTop: '12px' }}
                  >
                    <FiUserPlus size={14} />
                    Create New Consumer
                  </NewButton>
                </FormGroup>
              ) : (
                <>
                  <FormGroup>
                    <Label>First Name *</Label>
                    <Input
                      type="text"
                      placeholder="Enter first name"
                      value={formData.newConsumerFirstName}
                      onChange={(e) => setFormData({ ...formData, newConsumerFirstName: e.target.value })}
                      required
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Last Name *</Label>
                    <Input
                      type="text"
                      placeholder="Enter last name"
                      value={formData.newConsumerLastName}
                      onChange={(e) => setFormData({ ...formData, newConsumerLastName: e.target.value })}
                      required
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Email *</Label>
                    <Input
                      type="email"
                      placeholder="Enter email address"
                      value={formData.newConsumerEmail}
                      onChange={(e) => setFormData({ ...formData, newConsumerEmail: e.target.value })}
                      required
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Organization</Label>
                    <Input
                      type="text"
                      placeholder="Enter organization name"
                      value={formData.newConsumerOrganization}
                      onChange={(e) => setFormData({ ...formData, newConsumerOrganization: e.target.value })}
                    />
                  </FormGroup>

                  <button
                    type="button"
                    style={{ marginTop: '8px', color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500' }}
                    onClick={() => {
                      setIsCreatingNewConsumer(false);
                      setFormData({
                        ...formData,
                        newConsumerFirstName: '',
                        newConsumerLastName: '',
                        newConsumerEmail: '',
                        newConsumerOrganization: ''
                      });
                    }}
                  >
                    ← Back to select existing consumers
                  </button>
                </>
              )}
            </FormSection>

            {/* Select or Create Assessment */}
            <FormSection>
              <SectionTitle>
                <FiFileText />
                Assessment
              </SectionTitle>

              {!isCreatingNewAssessment ? (
                <FormGroup>
                  <Label>Assessments *</Label>
                  <MultiSelectDropdown
                    options={assessments.map(a => ({
                      id: a.id,
                      title: a.assessment_name,
                      subtitle: a.organization_name
                    }))}
                    selectedIds={selectedAssessmentIds}
                    onChange={setSelectedAssessmentIds}
                    placeholder="Select assessments..."
                  />
                  <div style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '8px' }}>
                    {selectedAssessmentIds.length === 0 
                      ? 'Click to select one or more assessments' 
                      : `${selectedAssessmentIds.length} assessment(s) selected`}
                  </div>
                  <NewButton
                    type="button"
                    onClick={() => setIsCreatingNewAssessment(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ marginTop: '12px' }}
                  >
                    <FiUserPlus size={14} />
                    Create New Assessment
                  </NewButton>
                </FormGroup>
              ) : (
                <>
                  <FormGroup>
                    <Label>Assessment Name *</Label>
                    <Input
                      type="text"
                      placeholder="Enter assessment name"
                      value={formData.newAssessmentName}
                      onChange={(e) => setFormData({ ...formData, newAssessmentName: e.target.value })}
                      required
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Organization Name</Label>
                    <Input
                      type="text"
                      placeholder="Enter organization name"
                      value={formData.newAssessmentOrganization}
                      onChange={(e) => setFormData({ ...formData, newAssessmentOrganization: e.target.value })}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Assessment Description</Label>
                    <TextArea
                      placeholder="Enter assessment description (optional)"
                      value={formData.newAssessmentDescription}
                      onChange={(e) => setFormData({ ...formData, newAssessmentDescription: e.target.value })}
                    />
                  </FormGroup>

                  <button
                    type="button"
                    style={{ marginTop: '8px', color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500' }}
                    onClick={() => {
                      setIsCreatingNewAssessment(false);
                      setFormData({
                        newAssessmentName: '',
                        newAssessmentOrganization: '',
                        newAssessmentDescription: '',
                        message: ''
                      });
                    }}
                  >
                    ← Back to select existing assessments
                  </button>
                </>
              )}
            </FormSection>

            {/* Message */}
            {!isCreatingNewAssessment && (
              <FormSection>
                <FormGroup>
                  <Label>Custom Message (Optional)</Label>
                  <TextArea
                    placeholder="Add a custom message for the consumers..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </FormGroup>
              </FormSection>
            )}

            <SubmitButton
              type="submit"
              disabled={
                submitting || 
                (!isCreatingNewConsumer && selectedUserIds.length === 0) ||
                (!isCreatingNewAssessment && selectedAssessmentIds.length === 0)
              }
              whileHover={{ scale: submitting ? 1 : 1.02 }}
              whileTap={{ scale: submitting ? 1 : 0.98 }}
            >
              <FiSend size={18} />
              {submitting ? 'Assigning...' : (() => {
                const consumerCount = isCreatingNewConsumer ? 1 : selectedUserIds.length;
                const assessmentCount = isCreatingNewAssessment ? 1 : selectedAssessmentIds.length;
                
                if (isCreatingNewAssessment && isCreatingNewConsumer) {
                  return 'Create Consumer, Assessment & Assign';
                } else if (isCreatingNewAssessment) {
                  return `Create Assessment & Assign to ${consumerCount} Consumer(s)`;
                } else if (isCreatingNewConsumer) {
                  return `Create Consumer & Assign ${assessmentCount} Assessment(s)`;
                } else {
                  return `Assign ${assessmentCount} Assessment(s) to ${consumerCount} Consumer(s)`;
                }
              })()}
            </SubmitButton>
          </form>
        </Card>
      </ContentWrapper>
    </PageContainer>
  );
};

export default AssignAssessmentMulti;

