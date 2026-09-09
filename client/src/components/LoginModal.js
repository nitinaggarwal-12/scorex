import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiLock, FiMail, FiGlobe, FiCheck, FiArrowRight, FiShield } from 'react-icons/fi';
import authService from '../services/authService';
import toast from 'react-hot-toast';

// --- Brand SVGs for Corporate Providers ---
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
  </svg>
);

const MicrosoftIcon = () => (
  <svg width="18" height="18" viewBox="0 0 23 23" style={{ flexShrink: 0 }}>
    <path fill="#f35325" d="M1 1h10v10H1z"/>
    <path fill="#81bc06" d="M12 1h10v10H12z"/>
    <path fill="#05a6f0" d="M1 12h10v10H1z"/>
    <path fill="#ffba08" d="M12 12h10v10H12z"/>
  </svg>
);

const OktaIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#007dc1" style={{ flexShrink: 0 }}>
    <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm0 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/>
  </svg>
);

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
`;

const Modal = styled(motion.div)`
  background: white;
  border-radius: 20px;
  max-width: 980px;
  width: 100%;
  max-height: 94vh;
  overflow: hidden;
  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.35);
  display: flex;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: #f1f5f9;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  cursor: pointer;
  z-index: 10;
  transition: all 0.2s;
  
  &:hover {
    color: #0f172a;
    background: #e2e8f0;
    transform: rotate(90deg);
  }
`;

const SidePanel = styled.div`
  width: 44%;
  background: ${props => props.$isAdmin ? 
    'linear-gradient(145deg, #1e1b4b 0%, #312e81 40%, #4338ca 100%)' : 
    'linear-gradient(145deg, #0f172a 0%, #1e3a8a 50%, #2563eb 100%)'};
  padding: 50px 36px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: white;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50px;
    right: -50px;
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%);
    border-radius: 50%;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const SidePanelContent = styled.div`
  position: relative;
  z-index: 2;
`;

const SidePanelBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  padding: 6px 12px;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-bottom: 20px;
`;

const SidePanelTitle = styled.h2`
  font-size: 2.1rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 16px;
  letter-spacing: -0.02em;
`;

const SidePanelSubtitle = styled.p`
  font-size: 0.95rem;
  opacity: 0.9;
  line-height: 1.6;
  margin-bottom: 24px;
`;

const FeatureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 10px;
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.85rem;
  opacity: 0.92;
`;

const FeatureIcon = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  flex-shrink: 0;
`;

const FormPanel = styled.div`
  width: 56%;
  padding: 44px 40px;
  display: flex;
  flex-direction: column;
  max-height: 94vh;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    width: 100%;
    padding: 36px 24px;
  }
`;

const Title = styled.h3`
  font-size: 1.65rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 6px;
  letter-spacing: -0.02em;
`;

const Subtitle = styled.p`
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 20px;
`;

// --- SSO UI Components ---
const SSOSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
`;

const SSOButton = styled.button`
  width: 100%;
  padding: 11px 16px;
  border-radius: 10px;
  border: 1.5px solid #e2e8f0;
  background: #ffffff;
  color: #1e293b;
  font-size: 0.92rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);

  &:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  }

  &:active {
    transform: translateY(0);
  }
`;

const SSOButtonLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const SSOBadge = styled.span`
  font-size: 0.72rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 6px;
  background: #f1f5f9;
  color: #64748b;
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  margin: 16px 0;
  color: #94a3b8;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;

  &::before, &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid #e2e8f0;
  }

  &::before {
    margin-right: 12px;
  }

  &::after {
    margin-left: 12px;
  }
`;

const DomainSSOBox = styled.div`
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  border-radius: 10px;
  padding: 12px 14px;
  margin-bottom: 12px;
`;

const DomainForm = styled.form`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

const DomainInput = styled.input`
  flex: 1;
  padding: 8px 12px;
  border: 1.5px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.85rem;
  outline: none;

  &:focus {
    border-color: #3b82f6;
  }
`;

const DomainSubmitBtn = styled.button`
  padding: 8px 14px;
  background: #0f172a;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;

  &:hover {
    background: #1e293b;
  }
`;

const GuestNoticeBanner = styled.div`
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border: 1.5px solid #86efac;
  border-radius: 10px;
  padding: 12px 14px;
  margin-bottom: 16px;
`;

const GuestQuickBtn = styled.button`
  padding: 8px 14px;
  background: #16a34a;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(22, 163, 74, 0.2);

  &:hover {
    background: #15803d;
    transform: translateY(-1px);
    box-shadow: 0 4px 6px rgba(22, 163, 74, 0.3);
  }
`;

const SandboxBanner = styled.div`
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 10px;
  padding: 12px 14px;
  margin-bottom: 16px;
`;

const SandboxTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.8rem;
  font-weight: 700;
  color: #1e40af;
  margin-bottom: 8px;
`;

const SandboxGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 6px;
`;

const SandboxPersonaBtn = styled.button`
  background: #ffffff;
  border: 1px solid #dbeafe;
  border-radius: 6px;
  padding: 6px 8px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #3b82f6;
    background: #f0f7ff;
  }
`;

const PersonaRole = styled.div`
  font-size: 0.72rem;
  font-weight: 700;
  color: #1e3a8a;
`;

const PersonaEmail = styled.div`
  font-size: 0.68rem;
  color: #64748b;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ViewSelector = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 18px;
  background: #f1f5f9;
  padding: 4px;
  border-radius: 8px;
`;

const ViewButton = styled.button`
  flex: 1;
  padding: 10px 16px;
  border: none;
  background: ${props => props.$active ? 'white' : 'transparent'};
  color: ${props => props.$active ? '#0f172a' : '#64748b'};
  font-weight: 700;
  font-size: 0.85rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: ${props => props.$active ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const InputGroup = styled.div`
  position: relative;
`;

const Label = styled.label`
  display: block;
  font-size: 0.82rem;
  font-weight: 600;
  color: #334155;
  margin-bottom: 6px;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 12px;
  color: #94a3b8;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 11px 12px 11px 38px;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.92rem;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: ${props => props.$isAdmin ? '#6366f1' : '#2563eb'};
    box-shadow: 0 0 0 3px ${props => props.$isAdmin ? 'rgba(99, 102, 241, 0.15)' : 'rgba(37, 99, 235, 0.15)'};
  }
`;

const SubmitButton = styled.button`
  background: ${props => props.$isAdmin ? 
    'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' : 
    'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)'};
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 4px;
  
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 14px ${props => props.$isAdmin ? 
      'rgba(99, 102, 241, 0.25)' : 
      'rgba(37, 99, 235, 0.25)'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  background: #fee2e2;
  color: #dc2626;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 0.82rem;
  margin-bottom: 14px;
`;

const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [view, setView] = useState('admin'); // 'admin' or 'customer'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // SSO States
  const [ssoConfig, setSsoConfig] = useState(null);
  const [showDomainInput, setShowDomainInput] = useState(false);
  const [corporateEmail, setCorporateEmail] = useState('');
  const [domainStatus, setDomainStatus] = useState(null);

  const isAdmin = view === 'admin';

  useEffect(() => {
    if (isOpen) {
      loadSSOConfig();
    }
  }, [isOpen]);

  const loadSSOConfig = async () => {
    try {
      const config = await authService.getSSOConfig();
      setSsoConfig(config);
    } catch (err) {
      console.warn('SSO configuration notice:', err.message);
    }
  };

  const handleSSOInitiate = async (provider) => {
    setError('');
    setIsLoading(true);

    const isLiveConfigured = ssoConfig?.providers?.[provider]?.configured;

    if (isLiveConfigured) {
      // Live IdP Redirect flow
      authService.initiateSSOLogin(provider, corporateEmail);
    } else {
      // Automatic Sandbox Fallback
      try {
        const defaultOrg = provider === 'okta' ? 'Okta Enterprise' : provider === 'microsoft' ? 'Microsoft 365 Cloud' : 'Google Cloud Workspace';
        const testEmail = corporateEmail || (isAdmin ? `architect@${provider}-corp.com` : `evaluator@${provider}-corp.com`);
        const result = await authService.loginWithSSOSandbox({
          email: testEmail,
          role: isAdmin ? 'admin' : 'consumer',
          organization: defaultOrg,
          provider
        });

        if (result.success) {
          toast.success(`Signed in via ${provider.toUpperCase()} Corporate SSO!`);
          if (onLoginSuccess) {
            onLoginSuccess(result.user);
          }
          onClose();
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDomainLookup = async (e) => {
    e.preventDefault();
    if (!corporateEmail || !corporateEmail.includes('@')) {
      toast.error('Please enter a valid work email');
      return;
    }

    setIsLoading(true);
    const result = await authService.lookupSSODomain(corporateEmail);
    setIsLoading(false);

    if (result.success) {
      setDomainStatus(result);
      if (result.autoRedirect && (result.provider === 'google' || result.provider === 'microsoft' || result.provider === 'okta')) {
        handleSSOInitiate(result.provider);
      }
    } else {
      toast.error(result.error || 'Corporate domain lookup failed');
    }
  };

  const handleQuickSandbox = async (role, testEmail, org, provider) => {
    setIsLoading(true);
    setError('');
    try {
      const result = await authService.loginWithSSOSandbox({
        email: testEmail,
        role,
        organization: org,
        provider
      });

      if (result.success) {
        toast.success(`Connected as ${result.user.firstName} (${role.toUpperCase()})`);
        if (onLoginSuccess) {
          onLoginSuccess(result.user);
        }
        onClose();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await authService.login(email, password);

    if (result.success) {
      const role = result.user.role;
      if (isAdmin && role === 'consumer') {
        setError('Participant accounts should use the Participant login');
        setIsLoading(false);
        return;
      }
      if (!isAdmin && (role === 'admin' || role === 'author')) {
        setError('Admin and Author team members should use the Admin login');
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
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <CloseButton onClick={onClose}>
              <FiX />
            </CloseButton>

            <SidePanel $isAdmin={isAdmin}>
              <SidePanelContent>
                <SidePanelBadge>
                  <FiShield size={12} /> Enterprise SSO
                </SidePanelBadge>
                <SidePanelTitle>
                  {isAdmin ? 'Architect & Author Workspace' : 'Participant Assessment Portal'}
                </SidePanelTitle>
                <SidePanelSubtitle>
                  {isAdmin 
                    ? 'Authenticate with your corporate Single Sign-On (Google, Microsoft, Okta) to manage enterprise maturity programs.'
                    : 'Sign in with your work identity to complete assigned pillars and access certified modernization roadmaps.'
                  }
                </SidePanelSubtitle>

                <FeatureList>
                  <FeatureItem>
                    <FeatureIcon><FiCheck /></FeatureIcon>
                    <span>Universal OIDC (Google Workspace & Entra ID)</span>
                  </FeatureItem>
                  <FeatureItem>
                    <FeatureIcon><FiCheck /></FeatureIcon>
                    <span>Okta & Corporate Domain Auto-Routing</span>
                  </FeatureItem>
                  <FeatureItem>
                    <FeatureIcon><FiCheck /></FeatureIcon>
                    <span>Zero-Trust Role-Based Access Governance</span>
                  </FeatureItem>
                </FeatureList>
              </SidePanelContent>

              <div style={{ fontSize: '0.75rem', opacity: 0.75 }}>
                ScoreX Enterprise v2.5 • Unified Identity Hub
              </div>
            </SidePanel>

            <FormPanel>
              <ViewSelector>
                <ViewButton
                  type="button"
                  $active={isAdmin}
                  onClick={() => setView('admin')}
                >
                  Admin / Author
                </ViewButton>
                <ViewButton
                  type="button"
                  $active={!isAdmin}
                  onClick={() => setView('customer')}
                >
                  Participant
                </ViewButton>
              </ViewSelector>

              <Title>Enterprise Sign In</Title>
              <Subtitle>
                {isAdmin 
                  ? 'Sign in via Corporate SSO or Administrator credentials'
                  : 'Sign in to access your assigned evaluations'
                }
              </Subtitle>

              {/* Instant Guest Exploration Notice */}
              <GuestNoticeBanner>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.85rem', color: '#14532d', fontWeight: 700 }}>
                      🚀 No Sign In Required
                    </strong>
                    <span style={{ fontSize: '0.78rem', color: '#166534' }}>
                      Explore, create, and edit your own assessments instantly as a guest.
                    </span>
                  </div>
                  <GuestQuickBtn
                    type="button"
                    onClick={() => {
                      const guestUser = authService.createGuestSession();
                      localStorage.setItem('scorex_disclaimer_accepted', 'true');
                      toast.success('Guest Mode Activated (No Sign In Required)');
                      if (onLoginSuccess) {
                        onLoginSuccess(guestUser);
                      }
                      onClose();
                    }}
                  >
                    Explore as Guest →
                  </GuestQuickBtn>
                </div>
              </GuestNoticeBanner>

              {error && <ErrorMessage>{error}</ErrorMessage>}

              {/* --- Corporate SSO Buttons --- */}
              <SSOSection>
                <SSOButton type="button" onClick={() => handleSSOInitiate('google')} disabled={isLoading}>
                  <SSOButtonLeft>
                    <GoogleIcon />
                    <span>Continue with Google Workspace</span>
                  </SSOButtonLeft>
                  <SSOBadge>{ssoConfig?.providers?.google?.configured ? 'Live OIDC' : 'Sandbox Ready'}</SSOBadge>
                </SSOButton>

                <SSOButton type="button" onClick={() => handleSSOInitiate('microsoft')} disabled={isLoading}>
                  <SSOButtonLeft>
                    <MicrosoftIcon />
                    <span>Continue with Microsoft Entra ID</span>
                  </SSOButtonLeft>
                  <SSOBadge>{ssoConfig?.providers?.microsoft?.configured ? 'Live Azure AD' : 'Sandbox Ready'}</SSOBadge>
                </SSOButton>

                <SSOButton type="button" onClick={() => handleSSOInitiate('okta')} disabled={isLoading}>
                  <SSOButtonLeft>
                    <OktaIcon />
                    <span>Continue with Okta Enterprise</span>
                  </SSOButtonLeft>
                  <SSOBadge>{ssoConfig?.providers?.okta?.configured ? 'Live Okta' : 'Sandbox Ready'}</SSOBadge>
                </SSOButton>

                {/* Domain-based corporate SSO toggle */}
                {!showDomainInput ? (
                  <button
                    type="button"
                    onClick={() => setShowDomainInput(true)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#2563eb',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'left',
                      padding: '4px 2px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <FiGlobe size={14} /> Sign in with custom Corporate Domain (@company.com) →
                  </button>
                ) : (
                  <DomainSSOBox>
                    <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#334155', display: 'flex', justifyContent: 'space-between' }}>
                      <span>Corporate Domain Discovery</span>
                      <button 
                        type="button" 
                        onClick={() => setShowDomainInput(false)}
                        style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.75rem' }}
                      >
                        Hide
                      </button>
                    </div>
                    <DomainForm onSubmit={handleDomainLookup}>
                      <DomainInput
                        type="email"
                        placeholder="you@corporate-domain.com"
                        value={corporateEmail}
                        onChange={(e) => setCorporateEmail(e.target.value)}
                        required
                      />
                      <DomainSubmitBtn type="submit" disabled={isLoading}>
                        Continue <FiArrowRight size={12} />
                      </DomainSubmitBtn>
                    </DomainForm>
                    {domainStatus && (
                      <div style={{ marginTop: '8px', fontSize: '0.75rem', color: '#2563eb', fontWeight: 600 }}>
                        {domainStatus.message || `Detected IdP: ${domainStatus.providerName}`}
                      </div>
                    )}
                  </DomainSSOBox>
                )}
              </SSOSection>

              {/* Sandbox Quick-Login Persona Selector (Zero-Config Testing) */}
              {ssoConfig?.sandboxMode && (
                <SandboxBanner>
                  <SandboxTitle>
                    <span>⚡ Quick Test Personas (Corporate SSO Sandbox)</span>
                    <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>1-Click Auth</span>
                  </SandboxTitle>
                  <SandboxGrid>
                    <SandboxPersonaBtn
                      type="button"
                      onClick={() => handleQuickSandbox('admin', 'chief.architect@enterprise.com', 'Enterprise Global', 'okta')}
                    >
                      <PersonaRole>🏢 Lead Architect</PersonaRole>
                      <PersonaEmail>Admin • Okta</PersonaEmail>
                    </SandboxPersonaBtn>

                    <SandboxPersonaBtn
                      type="button"
                      onClick={() => handleQuickSandbox('author', 'cdo@cloud-advisory.com', 'Cloud Advisory Group', 'google')}
                    >
                      <PersonaRole>🛡️ CDO / Author</PersonaRole>
                      <PersonaEmail>Author • Google</PersonaEmail>
                    </SandboxPersonaBtn>

                    <SandboxPersonaBtn
                      type="button"
                      onClick={() => handleQuickSandbox('consumer', 'lead.evaluator@corp-client.com', 'Client Workgroup', 'microsoft')}
                    >
                      <PersonaRole>👤 Participant</PersonaRole>
                      <PersonaEmail>Consumer • MS 365</PersonaEmail>
                    </SandboxPersonaBtn>
                  </SandboxGrid>
                </SandboxBanner>
              )}

              <Divider>Or sign in with password</Divider>

              {/* Standard Password Form */}
              <Form onSubmit={handleSubmit}>
                <InputGroup>
                  <Label htmlFor="email">Email Address</Label>
                  <InputWrapper>
                    <InputIcon>
                      <FiMail size={16} />
                    </InputIcon>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      $isAdmin={isAdmin}
                    />
                  </InputWrapper>
                </InputGroup>

                <InputGroup>
                  <Label htmlFor="password">Password</Label>
                  <InputWrapper>
                    <InputIcon>
                      <FiLock size={16} />
                    </InputIcon>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      $isAdmin={isAdmin}
                    />
                  </InputWrapper>
                </InputGroup>

                <SubmitButton 
                  type="submit" 
                  disabled={isLoading}
                  $isAdmin={isAdmin}
                >
                  {isLoading ? 'Signing in...' : 'Sign In with Password'}
                </SubmitButton>

                <button
                  type="button"
                  onClick={() => {
                    const guestUser = authService.createGuestSession();
                    localStorage.setItem('scorex_disclaimer_accepted', 'true');
                    toast.success('Guest Mode Activated (No Sign In Required)');
                    if (onLoginSuccess) {
                      onLoginSuccess(guestUser);
                    }
                    onClose();
                  }}
                  style={{
                    width: '100%',
                    marginTop: '8px',
                    padding: '10px 14px',
                    background: 'transparent',
                    border: '1.5px solid #cbd5e1',
                    borderRadius: '8px',
                    color: '#475569',
                    fontWeight: 600,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = '#f8fafc';
                    e.currentTarget.style.borderColor = '#94a3b8';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = '#cbd5e1';
                  }}
                >
                  Explore as Guest (No Sign In Required) →
                </button>
              </Form>
            </FormPanel>
          </Modal>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;
