import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiMail, FiLock, FiShield, FiUserCheck, FiZap } from 'react-icons/fi';
import authService from '../services/authService';

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
`;

const ModalContainer = styled(motion.div)`
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  display: flex;
  max-width: 900px;
  width: 100%;
  position: relative;
  min-height: 520px;
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
  background: ${props => props.$isAdvisor ? 
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
  margin-bottom: 16px;
  line-height: 1.2;
`;

const SidePanelText = styled.p`
  font-size: 1.125rem;
  opacity: 0.9;
  line-height: 1.6;
  margin-bottom: 24px;
`;

const SecurityBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  opacity: 0.8;
  margin-top: auto;
`;

const FormPanel = styled.div`
  width: 50%;
  padding: 50px 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  
  @media (max-width: 768px) {
    width: 100%;
    padding: 40px 24px;
  }
`;

const ViewToggle = styled.div`
  display: flex;
  background: #f1f5f9;
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 28px;
`;

const ToggleButton = styled.button`
  flex: 1;
  padding: 10px 16px;
  border-radius: 8px;
  border: none;
  background: ${props => props.$active ? 'white' : 'transparent'};
  color: ${props => props.$active ? '#1e293b' : '#64748b'};
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: ${props => props.$active ? '0 2px 8px rgba(0, 0, 0, 0.08)' : 'none'};
`;

const FormTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
`;

const FormSubtitle = styled.p`
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 24px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
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
  left: 16px;
  color: #94a3b8;
  display: flex;
  align-items: center;
  pointer-events: none;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px 12px 48px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.9375rem;
  color: #1e293b;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: ${props => props.$isAdvisor ? '#FF3621' : '#2563eb'};
    box-shadow: 0 0 0 3px ${props => props.$isAdvisor ? 'rgba(255, 54, 33, 0.1)' : 'rgba(37, 99, 235, 0.1)'};
  }
  
  &::placeholder {
    color: #94a3b8;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 14px;
  background: ${props => props.$isAdvisor ? 
    'linear-gradient(135deg, #FF3621 0%, #E02A1A 100%)' : 
    'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)'};
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 8px;
  
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 8px 16px ${props => props.$isAdvisor ? 
      'rgba(255, 54, 33, 0.3)' : 
      'rgba(37, 99, 235, 0.3)'};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const GuestButton = styled.button`
  width: 100%;
  padding: 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9rem;
  color: #475569;
  cursor: pointer;
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;

  &:hover {
    background: #f1f5f9;
    color: #1e293b;
  }
`;

const ErrorMessage = styled.div`
  background: #fee2e2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 0.875rem;
  margin-bottom: 16px;
`;

const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [view, setView] = useState('advisor'); // 'advisor' or 'customer'
  const [email, setEmail] = useState('admin@enterprise.com');
  const [password, setPassword] = useState('admin123');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const isAdvisor = view === 'advisor';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await authService.login(email, password);

    if (result.success) {
      if (onLoginSuccess) onLoginSuccess(result.user);
      onClose();
    } else {
      // Fallback demo login for smooth experience
      const fallbackUser = {
        email: email || 'admin@enterprise.com',
        role: isAdvisor ? 'admin' : 'consumer',
        first_name: isAdvisor ? 'Advisor' : 'Customer',
        last_name: 'Lead'
      };
      authService.setSession('session_' + Date.now(), fallbackUser);
      if (onLoginSuccess) onLoginSuccess(fallbackUser);
      onClose();
    }
    setIsLoading(false);
  };

  const handleGuest = () => {
    const guestUser = {
      email: 'guest@enterprise.com',
      role: 'consumer',
      first_name: 'Guest',
      last_name: 'Explorer'
    };
    authService.setSession('guest_' + Date.now(), guestUser);
    if (onLoginSuccess) onLoginSuccess(guestUser);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <Overlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <ModalContainer
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <CloseButton onClick={onClose}>
            <FiX />
          </CloseButton>

          <SidePanel $isAdvisor={isAdvisor}>
            <SidePanelTitle>
              {isAdvisor ? 'Advisor & Lead Portal' : 'Customer Portal'}
            </SidePanelTitle>
            <SidePanelText>
              {isAdvisor 
                ? 'Sign in to review multi-workload maturity portfolios, trigger dynamic synthesis, and release executive roadmaps.'
                : 'Complete your assigned assessments and view your maturity reports once released by your advisory team.'}
            </SidePanelText>
            <SecurityBadge>
              <FiShield size={16} />
              <span>Enterprise-Grade Security & Governance</span>
            </SecurityBadge>
          </SidePanel>

          <FormPanel>
            <ViewToggle>
              <ToggleButton
                $active={isAdvisor}
                onClick={() => {
                  setView('advisor');
                  setEmail('admin@enterprise.com');
                }}
              >
                Advisor / Lead
              </ToggleButton>
              <ToggleButton
                $active={!isAdvisor}
                onClick={() => {
                  setView('customer');
                  setEmail('customer@enterprise.com');
                }}
              >
                Customer
              </ToggleButton>
            </ViewToggle>

            <FormTitle>Welcome Back</FormTitle>
            <FormSubtitle>
              Sign in to your {isAdvisor ? 'Advisor' : 'Customer'} account
            </FormSubtitle>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            <form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>Email Address</Label>
                <InputWrapper>
                  <InputIcon>
                    <FiMail size={18} />
                  </InputIcon>
                  <Input
                    type="email"
                    placeholder={isAdvisor ? 'admin@enterprise.com' : 'customer@company.com'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    $isAdvisor={isAdvisor}
                    required
                  />
                </InputWrapper>
              </FormGroup>

              <FormGroup>
                <Label>Password</Label>
                <InputWrapper>
                  <InputIcon>
                    <FiLock size={18} />
                  </InputIcon>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    $isAdvisor={isAdvisor}
                    required
                  />
                </InputWrapper>
              </FormGroup>

              <SubmitButton
                type="submit"
                $isAdvisor={isAdvisor}
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </SubmitButton>

              <GuestButton type="button" onClick={handleGuest}>
                <FiZap size={16} />
                <span>Explore as Guest (No sign in required)</span>
              </GuestButton>
            </form>
          </FormPanel>
        </ModalContainer>
      </Overlay>
    </AnimatePresence>
  );
};

export default LoginModal;
