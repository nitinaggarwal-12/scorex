import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiSend } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import * as assessmentService from '../services/assessmentService';

// Styled Components
const Overlay = styled(motion.div)`
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
  padding: 20px;
`;

const Modal = styled(motion.div)`
  background: white;
  border-radius: 16px;
  padding: 32px;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
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

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px 0;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: #6b7280;
  margin: 0 0 32px 0;
`;

const Question = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 24px;
  text-align: center;
`;

const ScaleContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  justify-content: center;
  flex-wrap: wrap;
`;

const ScaleButton = styled(motion.button)`
  width: 48px;
  height: 48px;
  border-radius: 8px;
  border: 2px solid ${props => props.$selected ? '#3b82f6' : '#e5e7eb'};
  background: ${props => props.$selected ? '#3b82f6' : 'white'};
  color: ${props => props.$selected ? 'white' : '#374151'};
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #3b82f6;
    transform: scale(1.05);
  }

  @media (max-width: 640px) {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
`;

const ScaleLabels = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 32px;
  padding: 0 8px;
`;

const ScaleLabel = styled.span`
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
`;

const CommentSection = styled.div`
  margin-bottom: 24px;
`;

const CommentLabel = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
`;

const CommentTextarea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #374151;
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const Button = styled(motion.button)`
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  border: none;

  ${props => props.$variant === 'primary' ? `
    background: #3b82f6;
    color: white;
    &:hover {
      background: #2563eb;
    }
    &:disabled {
      background: #9ca3af;
      cursor: not-allowed;
    }
  ` : `
    background: white;
    color: #374151;
    border: 1px solid #e5e7eb;
    &:hover {
      background: #f9fafb;
    }
  `}
`;

const CategoryBadge = styled.div`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-top: 16px;
  background: ${props => {
    if (props.$score >= 9) return '#d1fae5';
    if (props.$score >= 7) return '#fef3c7';
    return '#fee2e2';
  }};
  color: ${props => {
    if (props.$score >= 9) return '#065f46';
    if (props.$score >= 7) return '#92400e';
    return '#991b1b';
  }};
`;

// Main Component
const NPSFeedbackModal = ({ isOpen, onClose, assessmentId, assessmentName }) => {
  const [score, setScore] = useState(null);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (score === null) {
      
      return;
    }

    try {
      setSubmitting(true);
      await assessmentService.submitNPSFeedback(assessmentId, {
        score,
        comment,
        assessmentName
      });
      
      onClose();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      
    } finally {
      setSubmitting(false);
    }
  };

  const getCategory = () => {
    if (score === null) return null;
    if (score >= 9) return 'Promoter';
    if (score >= 7) return 'Passive';
    return 'Detractor';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <Modal
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <CloseButton onClick={onClose}>
              <FiX size={20} />
            </CloseButton>

            <Title>We'd love your feedback!</Title>
            <Subtitle>Help us improve the assessment experience</Subtitle>

            <Question>
              How likely are you to recommend this assessment tool to a colleague?
            </Question>

            <ScaleContainer>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <ScaleButton
                  key={num}
                  $selected={score === num}
                  onClick={() => setScore(num)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {num}
                </ScaleButton>
              ))}
            </ScaleContainer>

            <ScaleLabels>
              <ScaleLabel>Not at all likely</ScaleLabel>
              <ScaleLabel>Extremely likely</ScaleLabel>
            </ScaleLabels>

            {score !== null && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ textAlign: 'center' }}
              >
                <CategoryBadge $score={score}>
                  You're a {getCategory()}!
                </CategoryBadge>
              </motion.div>
            )}

            <CommentSection>
              <CommentLabel>
                What's the main reason for your score? (Optional)
              </CommentLabel>
              <CommentTextarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell us what you liked or what we could improve..."
                maxLength={500}
              />
              <div style={{ fontSize: '0.75rem', color: '#9ca3af', textAlign: 'right', marginTop: '4px' }}>
                {comment.length}/500
              </div>
            </CommentSection>

            <ButtonGroup>
              <Button onClick={onClose}>
                Skip
              </Button>
              <Button
                $variant="primary"
                onClick={handleSubmit}
                disabled={score === null || submitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiSend size={16} />
                {submitting ? 'Submitting...' : 'Submit Feedback'}
              </Button>
            </ButtonGroup>
          </Modal>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

export default NPSFeedbackModal;



