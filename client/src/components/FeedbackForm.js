import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import feedbackService from '../services/feedbackService';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FormCard = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 40px;
  max-width: 800px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 10px;
  text-align: center;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #64748b;
  text-align: center;
  margin-bottom: 40px;
`;

const FormGroup = styled.div`
  margin-bottom: 30px;
`;

const Label = styled.label`
  display: block;
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 10px;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  font-size: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  transition: all 0.3s ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 10px;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1rem;
  color: #475569;
  cursor: pointer;
  padding: 10px 20px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  transition: all 0.3s ease;

  &:hover {
    border-color: #667eea;
    background: #f8fafc;
  }

  input:checked + & {
    border-color: #667eea;
    background: #eff6ff;
    color: #667eea;
    font-weight: 600;
  }
`;

const RadioInput = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 14px 16px;
  font-size: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  transition: all 0.3s ease;
  resize: vertical;
  font-family: inherit;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 40px;
`;

const SubmitButton = styled(motion.button)`
  flex: 1;
  padding: 16px 32px;
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const CancelButton = styled(motion.button)`
  padding: 16px 32px;
  font-size: 1.1rem;
  font-weight: 600;
  color: #64748b;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #cbd5e1;
    background: #f8fafc;
  }
`;

const QuestionSection = styled.div`
  background: #f8fafc;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
`;

const QuestionText = styled.p`
  font-size: 1.05rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 15px;
`;

const SuccessMessage = styled.div`
  background: #dcfce7;
  color: #166534;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 20px;
`;

const ErrorMessage = styled.div`
  background: #fee2e2;
  color: #991b1b;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  font-size: 1rem;
  margin-bottom: 20px;
`;

const QUESTIONS = [
  "Is the Databricks Maturity Assessment tool easy to use?",
  "Do the assessment results provide valuable insights?",
  "Would you recommend this tool to your colleagues?",
  "Are the recommendations actionable and relevant?",
  "Would you be interested in contributing to this open-source project?"
];

const FeedbackForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    question1_response: '',
    question2_response: '',
    question3_response: '',
    question4_response: '',
    question5_response: '',
    question6_response: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name || !formData.email || !formData.company) {
      setError('Please fill in your name, email, and company');
      return;
    }

    if (!formData.question1_response || !formData.question2_response || 
        !formData.question3_response || !formData.question4_response || 
        !formData.question5_response) {
      setError('Please answer all multiple choice questions');
      return;
    }

    if (!formData.question6_response.trim()) {
      setError('Please provide your additional feedback');
      return;
    }

    setLoading(true);

    try {
      await feedbackService.submitFeedback(formData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setError(err.message || 'Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (success) {
    return (
      <PageContainer>
        <FormCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <SuccessMessage>
            ✅ Thank you for your feedback! We truly appreciate your input.
            <div style={{ marginTop: '10px', fontSize: '1rem', fontWeight: 'normal' }}>
              Redirecting you back...
            </div>
          </SuccessMessage>
        </FormCard>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <FormCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Title>We Value Your Feedback</Title>
        <Subtitle>
          Help us improve the Databricks Maturity Assessment tool
        </Subtitle>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <form onSubmit={handleSubmit}>
          {/* Personal Information */}
          <FormGroup>
            <Label>Your Name *</Label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Email Address *</Label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your.email@company.com"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Company *</Label>
            <Input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              placeholder="Your company name"
              required
            />
          </FormGroup>

          {/* Multiple Choice Questions */}
          {QUESTIONS.map((question, index) => (
            <QuestionSection key={index}>
              <QuestionText>{index + 1}. {question}</QuestionText>
              <RadioGroup>
                {['Yes', 'Neutral', 'No'].map((option) => (
                  <RadioLabel key={option}>
                    <RadioInput
                      type="radio"
                      name={`question${index + 1}_response`}
                      value={option}
                      checked={formData[`question${index + 1}_response`] === option}
                      onChange={handleInputChange}
                      required
                    />
                    {option}
                  </RadioLabel>
                ))}
              </RadioGroup>
            </QuestionSection>
          ))}

          {/* Open-ended Question */}
          <FormGroup>
            <Label>6. What improvements or features would you like to see? *</Label>
            <TextArea
              name="question6_response"
              value={formData.question6_response}
              onChange={handleInputChange}
              placeholder="Share your thoughts, suggestions, or any additional feedback..."
              required
            />
          </FormGroup>

          <ButtonGroup>
            <CancelButton
              type="button"
              onClick={handleCancel}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </CancelButton>
            <SubmitButton
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? 'Submitting...' : 'Submit Feedback'}
            </SubmitButton>
          </ButtonGroup>
        </form>
      </FormCard>
    </PageContainer>
  );
};

export default FeedbackForm;

