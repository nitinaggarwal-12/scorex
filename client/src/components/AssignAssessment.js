import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiFileText, FiSend, FiArrowLeft, FiSearch, FiX, FiCheck } from 'react-icons/fi';
import authService from '../services/authService';
import * as assessmentService from '../services/assessmentService';
import assignmentService from '../services/assignmentService';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
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
  
  &:disabled {
    background: #f1f5f9;
    cursor: not-allowed;
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
  
  &:disabled {
    background: #f1f5f9;
    cursor: not-allowed;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const AssignButton = styled(motion.button)`
  width: 100%;
  padding: 16px 32px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1.125rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3);
  
  &:disabled {
    background: #e5e7eb;
    color: #9ca3af;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const InfoBox = styled.div`
  background: #eff6ff;
  border: 2px solid #3b82f6;
  border-radius: 12px;
  padding: 16px;
  margin-top: 24px;
  color: #1e40af;
  font-size: 0.9375rem;
  line-height: 1.6;
`;

const AssignAssessment = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [consumers, setConsumers] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [formData, setFormData] = useState({
    consumerId: '',
    assessmentId: '',
    message: '',
    newAssessmentName: '',
    newAssessmentOrganization: '',
    newAssessmentDescription: '',
    newConsumerFirstName: '',
    newConsumerLastName: '',
    newConsumerEmail: '',
    newConsumerOrganization: ''
  });
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [isCreatingNewConsumer, setIsCreatingNewConsumer] = useState(false);

  useEffect(() => {
    fetchConsumers();
    fetchAssessments();
  }, []);

  const fetchConsumers = async () => {
    try {
      const response = await authService.getUsersByRole('consumer');
      if (response.success) {
        setConsumers(response.users || []);
      }
    } catch (error) {
      console.error('Error fetching consumers:', error);
      
    }
  };

  const fetchAssessments = async () => {
    try {
      const response = await assessmentService.getAllAssessments();
      const allAssessments = response?.data || response || [];
      
      // Filter to only show in-progress or completed assessments
      const availableAssessments = allAssessments.filter(
        a => a.status === 'in_progress' || a.status === 'submitted' || a.status === 'completed'
      );
      
      setAssessments(availableAssessments);
    } catch (error) {
      console.error('Error fetching assessments:', error);
      
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate consumer fields
    if (isCreatingNewConsumer) {
      if (!formData.newConsumerEmail || !formData.newConsumerFirstName || !formData.newConsumerLastName) {
        
        return;
      }
    } else {
      if (!formData.consumerId) {
        
        return;
      }
    }
    
    // Validate assessment fields
    if (isCreatingNew) {
      if (!formData.newAssessmentName) {
        
        return;
      }
    } else {
      if (!formData.assessmentId) {
        
        return;
      }
    }

    setLoading(true);
    
    try {
      let consumerEmail, consumerOrganization;
      
      // Handle consumer creation/selection
      if (isCreatingNewConsumer) {
        // Create new consumer user
        const newConsumerData = {
          email: formData.newConsumerEmail,
          password: Math.random().toString(36).slice(-10) + 'Aa1!', // Generate secure random password
          firstName: formData.newConsumerFirstName,
          lastName: formData.newConsumerLastName,
          organization: formData.newConsumerOrganization || '',
          role: 'consumer'
        };
        
        await authService.register(newConsumerData);
        
        consumerEmail = formData.newConsumerEmail;
        consumerOrganization = formData.newConsumerOrganization;
        
        
      } else {
        const selectedConsumer = consumers.find(c => c.id === parseInt(formData.consumerId));
        consumerEmail = selectedConsumer.email;
        consumerOrganization = selectedConsumer.organization;
      }
      
      // Handle assessment creation/assignment
      if (isCreatingNew) {
        // Create new assessment and assign
        await assignmentService.assignAssessment({
          consumerEmail: consumerEmail,
          assessmentName: formData.newAssessmentName,
          organizationName: formData.newAssessmentOrganization || consumerOrganization,
          assessmentDescription: formData.newAssessmentDescription
        });
      } else {
        // Assign existing assessment
        if (isCreatingNewConsumer) {
          // Need to refresh consumers to get the new consumer's ID
          await fetchConsumers();
          // Use email-based assignment for newly created consumers
          await assignmentService.assignAssessment({
            consumerEmail: consumerEmail,
            assessmentName: assessments.find(a => a.id === formData.assessmentId)?.organizationName || 'Assessment',
            organizationName: consumerOrganization,
            assessmentDescription: ''
          });
        } else {
          await assignmentService.assignAssessment({
            consumerId: formData.consumerId,
            assessmentId: formData.assessmentId,
            message: formData.message
          });
        }
      }
      
      
      
      // Reset form
      setFormData({
        consumerId: '',
        assessmentId: '',
        message: '',
        newAssessmentName: '',
        newAssessmentOrganization: '',
        newAssessmentDescription: '',
        newConsumerFirstName: '',
        newConsumerLastName: '',
        newConsumerEmail: '',
        newConsumerOrganization: ''
      });
      setIsCreatingNew(false);
      setIsCreatingNewConsumer(false);
      
      // Navigate back after a short delay
      setTimeout(() => {
        navigate('/user-management');
      }, 2000);
      
    } catch (error) {
      console.error('Error assigning assessment:', error);
      
    } finally {
      setLoading(false);
    }
  };

  const selectedConsumer = consumers.find(c => c.id === parseInt(formData.consumerId));
  const selectedAssessment = assessments.find(a => a.id === formData.assessmentId);

  return (
    <PageContainer>
      <ContentWrapper>
        <BackButton
          onClick={() => navigate('/user-management')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiArrowLeft /> Back to User Management
        </BackButton>
        
        <Header>
          <Title>Assign Assessment</Title>
          <Subtitle>Assign an assessment to a consumer and send them an email invitation</Subtitle>
        </Header>

        <Card
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <form onSubmit={handleSubmit}>
            <FormSection>
              <SectionTitle>
                <FiUser /> {isCreatingNewConsumer ? 'Create New Consumer' : 'Select Consumer'}
              </SectionTitle>
              
              <FormGroup>
                <Label htmlFor="consumer">Consumer *</Label>
                <Select
                  id="consumer"
                  value={isCreatingNewConsumer ? 'CREATE_NEW' : formData.consumerId}
                  onChange={(e) => {
                    if (e.target.value === 'CREATE_NEW') {
                      setIsCreatingNewConsumer(true);
                      setFormData({ ...formData, consumerId: '' });
                    } else {
                      setIsCreatingNewConsumer(false);
                      setFormData({ ...formData, consumerId: e.target.value });
                    }
                  }}
                  required
                >
                  <option value="">-- Select a consumer --</option>
                  <option value="CREATE_NEW" style={{ fontWeight: 'bold', color: '#3b82f6' }}>
                    ➕ Create New Consumer
                  </option>
                  {consumers.map(consumer => (
                    <option key={consumer.id} value={consumer.id}>
                      {consumer.email} ({consumer.first_name} {consumer.last_name})
                    </option>
                  ))}
                </Select>
              </FormGroup>

              {isCreatingNewConsumer ? (
                <>
                  <FormGroup>
                    <Label htmlFor="newConsumerFirstName">First Name *</Label>
                    <Input
                      id="newConsumerFirstName"
                      type="text"
                      value={formData.newConsumerFirstName}
                      onChange={(e) => setFormData({ ...formData, newConsumerFirstName: e.target.value })}
                      placeholder="e.g., John"
                      required
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label htmlFor="newConsumerLastName">Last Name *</Label>
                    <Input
                      id="newConsumerLastName"
                      type="text"
                      value={formData.newConsumerLastName}
                      onChange={(e) => setFormData({ ...formData, newConsumerLastName: e.target.value })}
                      placeholder="e.g., Smith"
                      required
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label htmlFor="newConsumerEmail">Email *</Label>
                    <Input
                      id="newConsumerEmail"
                      type="email"
                      value={formData.newConsumerEmail}
                      onChange={(e) => setFormData({ ...formData, newConsumerEmail: e.target.value })}
                      placeholder="e.g., john.smith@company.com"
                      required
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label htmlFor="newConsumerOrganization">Organization (Optional)</Label>
                    <Input
                      id="newConsumerOrganization"
                      type="text"
                      value={formData.newConsumerOrganization}
                      onChange={(e) => setFormData({ ...formData, newConsumerOrganization: e.target.value })}
                      placeholder="e.g., Acme Corporation"
                    />
                  </FormGroup>
                  
                  <InfoBox style={{ background: '#dbeafe', borderColor: '#3b82f6' }}>
                    <strong>Note:</strong> A temporary password will be automatically generated and sent to the consumer's email address.
                  </InfoBox>
                </>
              ) : (
                selectedConsumer && (
                  <InfoBox>
                    <strong>Consumer Details:</strong><br />
                    Name: {selectedConsumer.first_name} {selectedConsumer.last_name}<br />
                    Email: {selectedConsumer.email}<br />
                    Organization: {selectedConsumer.organization || 'N/A'}
                  </InfoBox>
                )
              )}
            </FormSection>

            <FormSection>
              <SectionTitle>
                <FiFileText /> {isCreatingNew ? 'Create New Assessment' : 'Select Assessment'}
              </SectionTitle>
              
              <FormGroup>
                <Label htmlFor="assessment">Assessment *</Label>
                <Select
                  id="assessment"
                  value={isCreatingNew ? 'CREATE_NEW' : formData.assessmentId}
                  onChange={(e) => {
                    if (e.target.value === 'CREATE_NEW') {
                      setIsCreatingNew(true);
                      setFormData({ ...formData, assessmentId: '' });
                    } else {
                      setIsCreatingNew(false);
                      setFormData({ ...formData, assessmentId: e.target.value });
                    }
                  }}
                  required
                >
                  <option value="">-- Select an assessment --</option>
                  <option value="CREATE_NEW" style={{ fontWeight: 'bold', color: '#10b981' }}>
                    ✨ Create New Assessment
                  </option>
                  {assessments.map(assessment => (
                    <option key={assessment.id} value={assessment.id}>
                      {assessment.organizationName || assessment.assessmentName || 'Unnamed Assessment'} - {assessment.status}
                    </option>
                  ))}
                </Select>
              </FormGroup>

              {isCreatingNew ? (
                <>
                  <FormGroup>
                    <Label htmlFor="newAssessmentName">Assessment Name *</Label>
                    <Input
                      id="newAssessmentName"
                      type="text"
                      value={formData.newAssessmentName}
                      onChange={(e) => setFormData({ ...formData, newAssessmentName: e.target.value })}
                      placeholder="e.g., Q1 2025 Maturity Assessment"
                      required
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label htmlFor="newAssessmentOrganization">Organization (Optional)</Label>
                    <Input
                      id="newAssessmentOrganization"
                      type="text"
                      value={formData.newAssessmentOrganization}
                      onChange={(e) => setFormData({ ...formData, newAssessmentOrganization: e.target.value })}
                      placeholder="Will use consumer's organization if not specified"
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label htmlFor="newAssessmentDescription">Description (Optional)</Label>
                    <TextArea
                      id="newAssessmentDescription"
                      value={formData.newAssessmentDescription}
                      onChange={(e) => setFormData({ ...formData, newAssessmentDescription: e.target.value })}
                      placeholder="Add any additional context about this assessment"
                    />
                  </FormGroup>
                </>
              ) : (
                selectedAssessment && (
                  <InfoBox>
                    <strong>Assessment Details:</strong><br />
                    Organization: {selectedAssessment.organizationName}<br />
                    Status: {selectedAssessment.status}<br />
                    Started: {new Date(selectedAssessment.startedAt).toLocaleDateString()}
                  </InfoBox>
                )
              )}
            </FormSection>

            {!isCreatingNew && (
              <FormSection>
                <SectionTitle>
                  <FiMail /> Custom Message (Optional)
                </SectionTitle>
                
                <FormGroup>
                  <Label htmlFor="message">Email Message</Label>
                  <TextArea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Add a custom message to include in the invitation email (optional)"
                  />
                </FormGroup>
              </FormSection>
            )}

            <AssignButton
              type="submit"
              disabled={
                loading || 
                (!isCreatingNewConsumer && !formData.consumerId) || 
                (isCreatingNewConsumer && (!formData.newConsumerEmail || !formData.newConsumerFirstName || !formData.newConsumerLastName)) ||
                (!isCreatingNew && !formData.assessmentId) || 
                (isCreatingNew && !formData.newAssessmentName)
              }
              whileHover={{ scale: loading ? 1 : 1.05 }}
              whileTap={{ scale: loading ? 1 : 0.95 }}
            >
              <FiSend size={20} />
              {loading ? 'Processing...' : (
                isCreatingNewConsumer || isCreatingNew 
                  ? 'Create & Assign' 
                  : 'Assign Assessment & Send Email'
              )}
            </AssignButton>
          </form>
        </Card>
      </ContentWrapper>
    </PageContainer>
  );
};

export default AssignAssessment;

