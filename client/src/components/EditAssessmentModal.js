import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiEdit2, FiSave, FiMail } from 'react-icons/fi';
import toast from 'react-hot-toast';
import * as assessmentService from '../services/assessmentService';

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
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #e5e7eb;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s;

  &:hover {
    background: #f3f4f6;
    color: #1f2937;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const RequiredStar = styled.span`
  color: #ef4444;
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &:disabled {
    background: #f9fafb;
    cursor: not-allowed;
  }
`;

const TextArea = styled.textarea`
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  min-height: 100px;
  font-family: inherit;
  resize: vertical;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const HelpText = styled.p`
  font-size: 0.85rem;
  color: #6b7280;
  margin: 0;
`;

const EditHistorySection = styled.div`
  margin-top: 24px;
  padding-top: 24px;
  border-top: 2px solid #e5e7eb;
`;

const EditHistoryTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 12px 0;
`;

const EditHistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 200px;
  overflow-y: auto;
`;

const EditHistoryItem = styled.div`
  background: #f9fafb;
  border-radius: 8px;
  padding: 12px;
  font-size: 0.85rem;
`;

const EditTimestamp = styled.div`
  color: #6b7280;
  margin-bottom: 4px;
`;

const EditDetails = styled.div`
  color: #374151;
  font-weight: 500;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
`;

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;

  ${props => props.variant === 'primary' ? `
    background: #3b82f6;
    color: white;

    &:hover:not(:disabled) {
      background: #2563eb;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }
  ` : `
    background: white;
    color: #6b7280;
    border: 2px solid #e5e7eb;

    &:hover:not(:disabled) {
      background: #f9fafb;
      border-color: #d1d5db;
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }
`;

const EditAssessmentModal = ({ isOpen, onClose, assessment, onUpdate }) => {
  const [formData, setFormData] = useState({
    assessmentName: assessment?.assessmentName || '',
    organizationName: assessment?.organizationName || '',
    contactEmail: assessment?.contactEmail || '',
    industry: assessment?.industry || '',
    assessmentDescription: assessment?.assessmentDescription || '',
    editorEmail: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.editorEmail) {
      
      return;
    }

    if (!formData.assessmentName.trim()) {
      
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await assessmentService.updateAssessmentMetadata(
        assessment.id,
        formData
      );

      
      onUpdate(response.data);
      onClose();
    } catch (error) {
      console.error('Error updating assessment:', error);
      
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <ModalOverlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <ModalContent
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <ModalHeader>
            <ModalTitle>
              <FiEdit2 />
              Edit Assessment Information
            </ModalTitle>
            <CloseButton onClick={onClose} type="button">
              <FiX size={24} />
            </CloseButton>
          </ModalHeader>

          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>
                <FiMail size={16} />
                Your Email <RequiredStar>*</RequiredStar>
              </Label>
              <Input
                type="email"
                name="editorEmail"
                value={formData.editorEmail}
                onChange={handleChange}
                placeholder="editor@example.com"
                required
              />
              <HelpText>
                We'll track who made these changes and when
              </HelpText>
            </FormGroup>

            <FormGroup>
              <Label>
                Assessment Name <RequiredStar>*</RequiredStar>
              </Label>
              <Input
                type="text"
                name="assessmentName"
                value={formData.assessmentName}
                onChange={handleChange}
                placeholder="Q4 2025 Maturity Assessment"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Organization Name</Label>
              <Input
                type="text"
                name="organizationName"
                value={formData.organizationName}
                onChange={handleChange}
                placeholder="Acme Corporation"
              />
            </FormGroup>

            <FormGroup>
              <Label>Contact Email</Label>
              <Input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                placeholder="contact@acme.com"
              />
              <HelpText>Primary contact for this assessment</HelpText>
            </FormGroup>

            <FormGroup>
              <Label>Industry</Label>
              <Input
                type="text"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                placeholder="Technology, Finance, Healthcare..."
              />
            </FormGroup>

            <FormGroup>
              <Label>Description</Label>
              <TextArea
                name="assessmentDescription"
                value={formData.assessmentDescription}
                onChange={handleChange}
                placeholder="Brief description or notes about this assessment..."
              />
            </FormGroup>

            {assessment?.editHistory && assessment.editHistory.length > 0 && (
              <EditHistorySection>
                <EditHistoryTitle>📝 Edit History</EditHistoryTitle>
                <EditHistoryList>
                  {assessment.editHistory.slice().reverse().map((edit, index) => (
                    <EditHistoryItem key={index}>
                      <EditTimestamp>
                        {new Date(edit.timestamp).toLocaleString()} • {edit.editorEmail}
                      </EditTimestamp>
                      <EditDetails>
                        {Object.keys(edit.changes).map(key => (
                          <div key={key}>
                            Changed <strong>{key}</strong>
                          </div>
                        ))}
                      </EditDetails>
                    </EditHistoryItem>
                  ))}
                </EditHistoryList>
              </EditHistorySection>
            )}

            <ButtonGroup>
              <Button type="button" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                <FiSave size={18} />
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </ButtonGroup>
          </Form>
        </ModalContent>
      </ModalOverlay>
    </AnimatePresence>
  );
};

export default EditAssessmentModal;






