import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiUser, FiLock, FiMail } from 'react-icons/fi';
import authService from '../services/authService';
import toast from 'react-hot-toast';

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
`;

const Modal = styled(motion.div)`
  background: white;
  border-radius: 16px;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  display: flex;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 24px;
  color: #64748b;
  cursor: pointer;
  z-index: 10;
  transition: all 0.2s;
  
  &:hover {
    color: #334155;
    transform: rotate(90deg);
  }
`;

const SidePanel = styled.div`
  width: 50%;
  background: ${props => props.$isDatabricks ? 
    'linear-gradient(135deg, #FF3621 0%, #E02A1A 100%)' : 
    'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)'};
  padding: 60px 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: white;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const SidePanelTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 20px;
`;

const SidePanelSubtitle = styled.p`
  font-size: 1.125rem;
  opacity: 0.9;
  line-height: 1.6;
`;

const FormPanel = styled.div`
  width: 50%;
  padding: 60px 40px;
  display: flex;
  flex-direction: column;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const ViewSelector = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 32px;
  background: #f1f5f9;
  padding: 4px;
  border-radius: 8px;
`;

const ViewButton = styled.button`
  flex: 1;
  padding: 12px 20px;
  border: none;
  background: ${props => props.$active ? 'white' : 'transparent'};
  color: ${props => props.$active ? '#1e293b' : '#64748b'};
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: ${props => props.$active ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'};
  
  &:hover {
    background: ${props => props.$active ? 'white' : 'rgba(255, 255, 255, 0.5)'};
  }
`;

const Title = styled.h3`
  font-size: 1.875rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  font-size: 0.938rem;
  color: #64748b;
  margin-bottom: 24px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  position: relative;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #334155;
  margin-bottom: 8px;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 14px;
  color: #94a3b8;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 14px 14px 44px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: ${props => props.$isDatabricks ? '#FF3621' : '#2563eb'};
    box-shadow: 0 0 0 3px ${props => props.$isDatabricks ? 'rgba(255, 54, 33, 0.1)' : 'rgba(37, 99, 235, 0.1)'};
  }
  
  &::placeholder {
    color: #cbd5e1;
  }
`;

const SubmitButton = styled.button`
  background: ${props => props.$isDatabricks ? 
    'linear-gradient(135deg, #FF3621 0%, #E02A1A 100%)' : 
    'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)'};
  color: white;
  padding: 14px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 8px;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px ${props => props.$isDatabricks ? 
      'rgba(255, 54, 33, 0.3)' : 
      'rgba(37, 99, 235, 0.3)'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  background: #fee2e2;
  color: #dc2626;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 0.875rem;
  margin-bottom: 16px;
`;

const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [view, setView] = useState('databricks'); // 'databricks' or 'customer'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const isDatabricks = view === 'databricks';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await authService.login(email, password);

    if (result.success) {
      // Check if role matches the selected view
      const role = result.user.role;
      
      if (isDatabricks && role === 'consumer') {
        setError('Consumer accounts should use the Customer login');
        setIsLoading(false);
        return;
      }
      
      if (!isDatabricks && (role === 'admin' || role === 'author')) {
        setError('Databricks team members should use the Databricks login');
        setIsLoading(false);
        return;
      }

      onLoginSuccess(result.user);
      onClose();
    } else {
      setError(result.error);
    }

    setIsLoading(false);
  };

  if (!isOpen) return null;

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
              <FiX />
            </CloseButton>

            <SidePanel $isDatabricks={isDatabricks}>
              <SidePanelTitle>
                {isDatabricks ? 'Databricks Team' : 'Customer Portal'}
              </SidePanelTitle>
              <SidePanelSubtitle>
                {isDatabricks 
                  ? 'Access your authoring and administration tools to manage customer assessments and deliver insights.'
                  : 'Complete your assigned assessments and view your maturity reports once released by your Databricks team.'
                }
              </SidePanelSubtitle>
            </SidePanel>

            <FormPanel>
              <ViewSelector>
                <ViewButton
                  type="button"
                  $active={isDatabricks}
                  onClick={() => setView('databricks')}
                >
                  Databricks
                </ViewButton>
                <ViewButton
                  type="button"
                  $active={!isDatabricks}
                  onClick={() => setView('customer')}
                >
                  Customer
                </ViewButton>
              </ViewSelector>

              <Title>Sign In</Title>
              <Subtitle>
                {isDatabricks 
                  ? 'Sign in to your Databricks account'
                  : 'Sign in to access your assessments'
                }
              </Subtitle>

              {error && <ErrorMessage>{error}</ErrorMessage>}

              <Form onSubmit={handleSubmit}>
                <InputGroup>
                  <Label htmlFor="email">Email Address</Label>
                  <InputWrapper>
                    <InputIcon>
                      <FiMail size={18} />
                    </InputIcon>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      $isDatabricks={isDatabricks}
                    />
                  </InputWrapper>
                </InputGroup>

                <InputGroup>
                  <Label htmlFor="password">Password</Label>
                  <InputWrapper>
                    <InputIcon>
                      <FiLock size={18} />
                    </InputIcon>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      $isDatabricks={isDatabricks}
                    />
                  </InputWrapper>
                </InputGroup>

                <SubmitButton 
                  type="submit" 
                  disabled={isLoading}
                  $isDatabricks={isDatabricks}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </SubmitButton>
              </Form>
            </FormPanel>
          </Modal>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;

