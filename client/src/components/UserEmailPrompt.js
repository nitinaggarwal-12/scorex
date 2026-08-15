import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiMail, FiUser } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
`;

const ModalContent = styled(motion.div)`
  background: white;
  border-radius: 16px;
  padding: 40px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  text-align: center;
`;

const Icon = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  color: white;
  font-size: 36px;
`;

const Title = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 12px 0;
`;

const Description = styled.p`
  font-size: 1rem;
  color: #6b7280;
  margin: 0 0 32px 0;
  line-height: 1.6;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  text-align: left;
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

const InputWrapper = styled.div`
  position: relative;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 16px 14px 48px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
  }
`;

const HelpText = styled.p`
  font-size: 0.85rem;
  color: #6b7280;
  margin: 0;
  text-align: center;
`;

const Button = styled.button`
  padding: 14px 28px;
  border-radius: 10px;
  font-size: 1.05rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const SkipButton = styled.button`
  background: none;
  border: none;
  color: #6b7280;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 8px;
  transition: all 0.2s;
  text-decoration: underline;

  &:hover {
    color: #374151;
  }
`;

const UserEmailPrompt = ({ onSubmit, assessmentName }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      
      return;
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      
      return;
    }

    setIsSubmitting(true);
    try {
      // Store in sessionStorage
      sessionStorage.setItem('assessmentEditorEmail', email);
      
      onSubmit(email);
    } catch (error) {
      
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    sessionStorage.setItem('assessmentEditorEmail', 'anonymous@assessment.com');
    onSubmit('anonymous@assessment.com');
  };

  return (
    <ModalOverlay onClick={(e) => e.stopPropagation()}>
      <ModalContent
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Icon>
          <FiUser />
        </Icon>

        <Title>Welcome Back!</Title>
        <Description>
          You're continuing <strong>"{assessmentName}"</strong>.
          <br />
          Please enter your email so we can track who makes changes and when.
        </Description>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>
              <FiMail size={16} />
              Your Email Address
            </Label>
            <InputWrapper>
              <InputIcon>
                <FiMail size={18} />
              </InputIcon>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.name@example.com"
                autoFocus
                required
              />
            </InputWrapper>
          </FormGroup>

          <HelpText>
            This helps track assessment history and maintain accountability
          </HelpText>

          <Button type="submit" disabled={isSubmitting}>
            <FiUser size={18} />
            {isSubmitting ? 'Saving...' : 'Continue Assessment'}
          </Button>

          <SkipButton type="button" onClick={handleSkip}>
            Skip for now
          </SkipButton>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default UserEmailPrompt;






