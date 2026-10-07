import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FiMenu, FiX, FiPlay, FiList, FiLogIn, FiLogOut, FiUser, FiFileText, FiUsers, FiSend, FiChevronDown, FiLock, FiUserPlus, FiMail, FiMessageSquare, FiSettings, FiBook, FiMonitor, FiCpu, FiAward, FiLayers, FiBarChart2, FiTrendingUp, FiDatabase, FiShield, FiShare2, FiArrowRight, FiZap } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import toast from 'react-hot-toast';
import * as assessmentService from '../services/assessmentService';
import dynamicAssessmentService from '../services/dynamicAssessmentService';
import authService from '../services/authService';
import LoginModal from './LoginModal';

// Fixed: Added mobile navigation with hamburger menu

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(226, 232, 240, 0.9);
  padding: 11px 0;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.03);

  @media (max-width: 768px) {
    padding: 10px 0;
  }
`;

const NavContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  padding: 0 clamp(16px, 1.8vw, 28px);
  box-sizing: border-box;

  @media (max-width: 1024px) {
    padding: 0 24px;
  }

  @media (max-width: 768px) {
    padding: 0 20px;
    justify-content: space-between;
  }
`;

const BrandLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
  margin-right: 12px;
  text-decoration: none;
  transition: opacity 0.18s ease;

  &:hover {
    opacity: 0.88;
  }
`;

const LogoIcon = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
  border: 1px solid rgba(99, 102, 241, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-weight: 900;
  font-size: 0.9rem;
  box-shadow: 0 2px 6px rgba(37, 99, 235, 0.2);
`;

const LogoText = styled.span`
  font-size: 1.15rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 8px;

  span {
    color: #4f46e5;
  }
`;

const TopNav = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;

  @media (max-width: 1024px) {
    display: none;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  
  @media (max-width: 1024px) {
    display: none;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: #374151;
  cursor: pointer;
  padding: 8px;
  font-size: 24px;
  
  @media (max-width: 1024px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &:hover {
    color: #3b82f6;
  }
`;

const MobileMenu = styled.div`
  display: none;
  
  @media (max-width: 1024px) {
    display: ${props => props.$isOpen ? 'flex' : 'none'};
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    background: white;
    border-bottom: 1px solid #e5e7eb;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    flex-direction: column;
    padding: 16px 0;
    max-height: calc(100vh - 60px);
    overflow-y: auto;
  }
`;

const MobileNavLink = styled.button`
  background: none;
  border: none;
  color: #64748b;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  padding: 16px 24px;
  text-align: left;
  width: 100%;
  transition: all 0.2s;

  &:hover {
    background: #f9fafb;
    color: #3b82f6;
  }

  &:active {
    background: #f3f4f6;
  }
`;

const MobileSecondaryCTAButton = styled.button`
  background: white;
  color: #3b82f6;
  border: 2px solid #3b82f6;
  padding: 14px 24px;
  margin: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:active {
    transform: scale(0.98);
    background: #eff6ff;
  }
`;

const MobileCTAButton = styled.button`
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
  border: none;
  padding: 14px 24px;
  margin: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:active {
    transform: scale(0.98);
  }
`;

const NavLink = styled.button`
  background: transparent;
  border: none;
  outline: none;
  color: #475569;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.16s ease;
  padding: 7px 12px;
  border-radius: 8px;
  position: relative;
  white-space: nowrap;

  &:hover {
    color: #0f172a;
    background: #f1f5f9;
  }

  &:focus {
    outline: none;
  }
`;

const SecondaryCTAButton = styled.button`
  display: flex;
  align-items: center;
  gap: 7px;
  background: #2563eb;
  color: #ffffff;
  border: 1px solid #1d4ed8;
  outline: none;
  padding: 7px 14px;
  border-radius: 9px;
  font-weight: 600;
  font-size: 0.84rem;
  cursor: pointer;
  transition: all 0.18s ease;
  white-space: nowrap;
  box-shadow: 0 1px 2px rgba(37, 99, 235, 0.15);

  &:hover {
    background: #1d4ed8;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
  }

  &:active {
    transform: translateY(0);
  }

  &:focus {
    outline: none;
  }
`;

const CTAButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: #2563eb;
  color: white;
  border: none;
  outline: none;
  padding: 7px 15px;
  border-radius: 9px;
  font-weight: 600;
  font-size: 0.84rem;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: #1d4ed8;
  }

  &:focus {
    outline: none;
  }
`;

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: #f8fafc;
  color: #0f172a;
  border: 1px solid #e2e8f0;
  outline: none;
  padding: 7px 13px;
  border-radius: 9px;
  font-weight: 600;
  font-size: 0.84rem;
  cursor: pointer;
  transition: all 0.25s ease;
  white-space: nowrap;

  &:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  }

  &:active {
    transform: translateY(0);
  }

  svg.chevron {
    transition: transform 0.25s ease;
    ${props => props.$isOpen && 'transform: rotate(180deg);'}
  }
`;

const DropdownHeader = styled.div`
  padding: 8px 18px 4px;
  font-size: 0.72rem;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.05);
  min-width: 280px;
  padding: 8px 0;
  z-index: 1000;
  opacity: ${props => props.$isOpen ? 1 : 0};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  transform: translateY(${props => props.$isOpen ? '0' : '-8px'});
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);

  &::before {
    content: '';
    position: absolute;
    top: -12px;
    left: 0;
    right: 0;
    height: 12px;
  }
`;

const DropdownItem = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 10px 18px;
  background: none;
  border: none;
  color: #374151;
  font-size: 0.9rem;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #f1f5f9;
    color: #2563eb;
  }

  svg {
    font-size: 16px;
    color: #64748b;
    flex-shrink: 0;
  }

  &:hover svg {
    color: #2563eb;
  }
`;

const DropdownDivider = styled.div`
  height: 1px;
  background: #f1f5f9;
  margin: 6px 0;
`;

const AssessmentsMegaMenu = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: auto;
  width: 780px;
  max-width: calc(100vw - 32px);
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  box-shadow: 0 24px 48px -12px rgba(15, 23, 42, 0.16), 0 6px 16px -4px rgba(15, 23, 42, 0.06);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 1000;
  opacity: ${props => props.$isOpen ? 1 : 0};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  transform: translateY(${props => props.$isOpen ? '0' : '-8px'});
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);

  &::before {
    content: '';
    position: absolute;
    top: -14px;
    left: 0;
    right: 0;
    height: 14px;
  }

  @media (max-width: 900px) {
    width: 360px;
  }
`;

const MegaMenuPrimaryCol = styled.div`
  padding: 14px 12px;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const MegaMenuSecondaryCol = styled.div`
  padding: 14px 12px;
  background: #f8fafc;
  border-left: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 14px;

  @media (max-width: 900px) {
    border-left: none;
    border-top: 1px solid #e2e8f0;
  }
`;

const MegaMenuSectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2px 10px 8px;
  border-bottom: 1px solid #f1f5f9;
  margin-bottom: 4px;
  font-size: 0.69rem;
  font-weight: 800;
  color: #64748b;
  letter-spacing: 0.06em;
  text-transform: uppercase;
`;

const MegaMenuTrackItem = styled.button`
  display: flex;
  align-items: center;
  gap: 11px;
  width: 100%;
  padding: 8px 10px;
  border-radius: 10px;
  background: transparent;
  border: 1px solid transparent;
  text-align: left;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #f8fafc;
    border-color: #e2e8f0;
    transform: translateX(2px);
  }
`;

const TrackIconBox = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: ${props => props.$bg || 'rgba(59, 130, 246, 0.1)'};
  color: ${props => props.$color || '#2563eb'};
  border: 1px solid ${props => props.$border || 'rgba(59, 130, 246, 0.2)'};
  font-size: 16px;
`;

const TrackContent = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const TrackTopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
`;

const TrackTitle = styled.span`
  font-size: 0.82rem;
  font-weight: 600;
  color: #0f172a;
  line-height: 1.25;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TrackBadge = styled.span`
  font-size: 0.65rem;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 5px;
  background: ${props => props.$bg || 'rgba(99, 102, 241, 0.12)'};
  color: ${props => props.$color || '#6366f1'};
  border: 1px solid ${props => props.$border || 'rgba(99, 102, 241, 0.25)'};
  white-space: nowrap;
  flex-shrink: 0;
`;

const TrackSubtitle = styled.span`
  font-size: 0.72rem;
  color: #64748b;
  line-height: 1.25;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MegaMenuStudioCard = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 11px;
  border-radius: 10px;
  background: ${props => props.$gradient ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(219, 39, 119, 0.08) 100%)' : '#ffffff'};
  border: 1px solid ${props => props.$gradient ? 'rgba(139, 92, 246, 0.28)' : '#e2e8f0'};
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.03);
  text-align: left;
  cursor: pointer;
  transition: all 0.16s ease;

  &:hover {
    border-color: ${props => props.$gradient ? 'rgba(219, 39, 119, 0.45)' : '#cbd5e1'};
    box-shadow: 0 4px 12px rgba(15, 23, 42, 0.06);
    transform: translateY(-1px);
  }
`;

const TrySampleDropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const TrySampleMenu = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  left: auto;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  box-shadow: 0 20px 44px -10px rgba(15, 23, 42, 0.16), 0 4px 14px -2px rgba(15, 23, 42, 0.05);
  min-width: 445px;
  max-width: calc(100vw - 32px);
  padding: 12px;
  z-index: 1000;
  opacity: ${props => props.$isOpen ? 1 : 0};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  transform: translateY(${props => props.$isOpen ? '0' : '-8px'});
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);

  &::before {
    content: '';
    position: absolute;
    top: -14px;
    left: 0;
    right: 0;
    height: 14px;
  }
`;

const TrySampleHeader = styled.div`
  padding: 4px 10px 8px;
  font-size: 0.7rem;
  font-weight: 800;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  border-bottom: 1px solid #f1f5f9;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TrySampleOption = styled.button`
  display: flex;
  align-items: center;
  gap: 11px;
  width: 100%;
  padding: 8px 10px;
  border-radius: 10px;
  background: transparent;
  border: 1px solid transparent;
  text-align: left;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #f8fafc;
    border-color: #e2e8f0;
    transform: translateX(2px);
  }
`;

const MobileSubLink = styled.button`
  background: none;
  border: none;
  color: #475569;
  font-size: 0.88rem;
  font-weight: 500;
  padding: 8px 16px;
  text-align: left;
  cursor: pointer;
  width: 100%;

  &:hover {
    color: #3b82f6;
  }
`;

const DropdownEmailLink = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 12px 20px;
  background: none;
  border: none;
  color: #6b7280;
  font-size: 0.875rem;
  text-align: left;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    color: #3b82f6;
    background: #f3f4f6;
  }

  svg {
    flex-shrink: 0;
  }
`;

const GlobalNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(authService.getUser());
  const [assessmentsDropdownOpen, setAssessmentsDropdownOpen] = useState(false);
  const [assignmentsDropdownOpen, setAssignmentsDropdownOpen] = useState(false);
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);
  const [trySampleDropdownOpen, setTrySampleDropdownOpen] = useState(false);
  const [portfolioDropdownOpen, setPortfolioDropdownOpen] = useState(false);
  const [resourcesDropdownOpen, setResourcesDropdownOpen] = useState(false);
  const [mobileTrySampleOpen, setMobileTrySampleOpen] = useState(false);
  const [promotedTypes, setPromotedTypes] = useState([]);

  const fetchPromotedTypes = async () => {
    try {
      const types = await dynamicAssessmentService.getAssessmentTypes(false);
      setPromotedTypes(types || []);
    } catch (e) {
      console.warn('Failed to load promoted assessment types:', e);
    }
  };

  useEffect(() => {
    fetchPromotedTypes();
    window.addEventListener('assessment-types-updated', fetchPromotedTypes);
    return () => window.removeEventListener('assessment-types-updated', fetchPromotedTypes);
  }, []);

  // Auto-reload open local dev tabs when bundle hash changes after build
  useEffect(() => {
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (!isLocal) return;
    let initialHash = null;
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/build-info', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        if (data?.bundleHash) {
          if (!initialHash) {
            initialHash = data.bundleHash;
          } else if (initialHash !== data.bundleHash) {
            window.location.reload();
          }
        }
      } catch (_) {}
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (authService.isAuthenticated()) {
      setCurrentUser(authService.getUser());
    }
    const syncUser = () => setCurrentUser(authService.getUser());
    window.addEventListener('scorex-auth-changed', syncUser);
    return () => window.removeEventListener('scorex-auth-changed', syncUser);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.dropdown-container')) {
        setAssessmentsDropdownOpen(false);
        setPortfolioDropdownOpen(false);
        setAssignmentsDropdownOpen(false);
        setAdminDropdownOpen(false);
        setTrySampleDropdownOpen(false);
        setResourcesDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    navigate('/');
    closeMobileMenu();
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    navigate('/assessments');
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileTrySampleOpen(false);
  };

  const scrollToSection = (sectionId) => {
    closeMobileMenu();
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: sectionId } });
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleLogoClick = () => {
    closeMobileMenu();
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (path) => {
    closeMobileMenu();
    navigate(path);
  };

  const handleTrySampleCore = async () => {
    closeMobileMenu();
    setTrySampleDropdownOpen(false);
    setAssessmentsDropdownOpen(false);
    toast.success('Opening Enterprise Data & AI Maturity Executive Report...');
    navigate('/assessments/report/inst_enterprise_data_ai_maturity_demo');
  };

  const handleTrySampleGenAI = async () => {
    closeMobileMenu();
    setTrySampleDropdownOpen(false);
    setAssessmentsDropdownOpen(false);
    toast.success('Opening Gemini Enterprise Migration Executive Report...');
    navigate('/assessments/report/inst_openai_to_gemini_enterprise_migration_demo');
  };

  const handleTrySampleDynamic = async (typeKey, title) => {
    closeMobileMenu();
    setTrySampleDropdownOpen(false);
    setAssessmentsDropdownOpen(false);
    const canonicalDemoMap = {
      enterprise_data_ai_maturity: 'inst_enterprise_data_ai_maturity_demo',
      openai_to_gemini_enterprise_migration: 'inst_openai_to_gemini_enterprise_migration_demo',
      finops_cloud_cost_optimization: 'inst_finops_cloud_cost_optimization_demo',
      agentic_ai_mesh_mcp_banking_readiness: 'inst_agentic_ai_mesh_mcp_banking_readiness_demo',
      edw_lakehouse_to_bigquery_modernization: 'inst_edw_lakehouse_to_bigquery_modernization_demo',
      enterprise_ai_zero_trust_security: 'inst_enterprise_ai_zero_trust_security_demo'
    };
    if (canonicalDemoMap[typeKey]) {
      toast.success(`Opening "${title}" Executive Report...`);
      navigate(`/assessments/report/${canonicalDemoMap[typeKey]}`);
      return;
    }
    try {
      toast.loading(`Opening sample report for "${title}"...`, { id: 'sample-assessment' });
      const result = await dynamicAssessmentService.generateSampleForType(typeKey);
      toast.success(`"${title}" report loaded!`, { id: 'sample-assessment' });
      navigate(`/assessments/report/${result.instanceId}`);
    } catch (error) {
      console.error('[GlobalNav] Error creating dynamic sample:', error);
      toast.error('Failed to open dynamic sample report');
    }
  };

  const handleTrySample = handleTrySampleCore;

  const handleExploreAsGuest = (redirectPath = '/assessments') => {
    closeMobileMenu();
    const guestUser = authService.createGuestSession();
    localStorage.setItem('scorex_disclaimer_accepted', 'true');
    setCurrentUser(guestUser);
    toast.success('Guest Mode Activated (No Sign In Required)');
    navigate(redirectPath);
  };

  const getTrackVisuals = (type) => {
    const key = (type.typeKey || '').toLowerCase();
    const iconName = type.icon || '';
    const color = type.color || '#6366f1';

    let IconComponent = FiAward;
    if (iconName === 'HiSparkles' || key.includes('gemini')) IconComponent = HiSparkles;
    else if (iconName === 'FiTrendingUp' || key.includes('finops') || key.includes('cost')) IconComponent = FiTrendingUp;
    else if (iconName === 'HiDatabase' || key.includes('lakehouse') || key.includes('bigquery')) IconComponent = FiDatabase;
    else if (iconName === 'HiShieldCheck' || key.includes('security') || key.includes('zero_trust') || key.includes('eu_ai') || key.includes('compliance')) IconComponent = FiShield;
    else if (iconName === 'FiCpu' || key.includes('agentic') || key.includes('mesh')) IconComponent = FiShare2;
    else if (key.includes('enterprise_data_ai_maturity')) IconComponent = FiBarChart2;

    let displayTitle = type.title || '';
    if (displayTitle === 'Autonomous Multi-Agent AI Mesh Architecture & MCP Readiness') {
      displayTitle = 'Autonomous Multi-Agent AI & MCP';
    } else if (displayTitle === 'FinOps & Cloud Cost Optimization Assessment') {
      displayTitle = 'FinOps & Cloud Cost Optimization';
    } else if (displayTitle === 'Gemini Enterprise Migration Assessment') {
      displayTitle = 'Gemini Enterprise Migration';
    } else if (displayTitle === 'Enterprise AI & Zero-Trust Security Assessment') {
      displayTitle = 'Enterprise AI & Zero-Trust Security';
    } else if (displayTitle === 'Enterprise Data & AI Maturity Assessment') {
      displayTitle = 'Enterprise Data & AI Maturity';
    }

    let displayBadge = type.badge || 'Custom';
    if (displayBadge === 'Lakehouse Modernization') displayBadge = 'Lakehouse';
    if (displayBadge === 'CISO & Zero-Trust') displayBadge = 'Zero-Trust';

    let microSubtitle = type.subtitle || 'Enterprise architecture & readiness evaluation';
    let demoSubtitle = microSubtitle;
    if (key.includes('enterprise_data_ai_maturity')) {
      microSubtitle = 'Enterprise data, MLOps & cloud governance • 60 Qs';
      demoSubtitle = 'ConnectPlus Telecom • 6-Pillar Executive Maturity Report';
    } else if (key.includes('gemini')) {
      microSubtitle = 'Vertex AI modernization & token cost arbitrage';
      demoSubtitle = 'Quantum FinTech Global • Vertex AI Migration Report';
    } else if (key.includes('finops')) {
      microSubtitle = 'Cloud financial governance & unit economics';
      demoSubtitle = 'Nova Retail & E-Commerce • Cloud Unit Economics Report';
    } else if (key.includes('agentic')) {
      microSubtitle = 'MCP protocol, durable state & agent telemetry';
      demoSubtitle = 'Apex Global Banking • Multi-Agent Mesh & MCP Report';
    } else if (key.includes('lakehouse')) {
      microSubtitle = 'Open Iceberg storage, BigLake & slot economics';
      demoSubtitle = 'Global Logistics Alliance • Iceberg & BigLake Report';
    } else if (key.includes('zero_trust')) {
      microSubtitle = 'CISO posture, real-time DLP & Model Armor';
      demoSubtitle = 'CyberShield Health • CISO & AI Gateway Security Report';
    } else if (key.includes('eu_ai') || key.includes('compliance')) {
      microSubtitle = 'Articles 8–15 conformity, Art. 5 tripwires & audit dossier';
      demoSubtitle = 'ApexHire Global Enterprise • High-Risk HR Screening AI Dossier';
    }

    return { IconComponent, displayTitle, displayBadge, microSubtitle, demoSubtitle, color };
  };

  const renderTrySampleMenu = () => (
    <TrySampleMenu $isOpen={trySampleDropdownOpen}>
      <TrySampleHeader>
        <span>⚡ 1-Click Pre-Seeded Executive Reports</span>
        <span style={{ fontSize: '0.64rem', color: '#2563eb', background: '#eff6ff', padding: '2px 6px', borderRadius: '999px', fontWeight: 700 }}>{2 + promotedTypes.length} Live Demos</span>
      </TrySampleHeader>

      <TrySampleOption onClick={() => { setTrySampleDropdownOpen(false); navigate('/ge-value-realization/inst_bionova_ge_value_realization?tab=report'); }}>
        <TrackIconBox $bg="rgba(37, 99, 235, 0.12)" $color="#2563eb" $border="rgba(37, 99, 235, 0.28)">
          <FiTrendingUp />
        </TrackIconBox>
        <TrackContent>
          <TrackTopRow>
            <TrackTitle>GE Value Realization (BioNova)</TrackTitle>
            <TrackBadge $bg="rgba(37, 99, 235, 0.12)" $color="#1d4ed8" $border="rgba(37, 99, 235, 0.28)">CFO & OKR Bridge</TrackBadge>
          </TrackTopRow>
          <TrackSubtitle>BioNova Life Sciences • 85,300 Seats • Executive Value Readout</TrackSubtitle>
        </TrackContent>
      </TrySampleOption>

      <TrySampleOption onClick={() => { setTrySampleDropdownOpen(false); navigate('/eu-ai-compliance?demo=high-risk-hr'); }}>
        <TrackIconBox $bg="rgba(16, 185, 129, 0.12)" $color="#059669" $border="rgba(16, 185, 129, 0.28)">
          <FiShield />
        </TrackIconBox>
        <TrackContent>
          <TrackTopRow>
            <TrackTitle>EU AI Act Compliance & Audit</TrackTitle>
            <TrackBadge $bg="rgba(16, 185, 129, 0.12)" $color="#059669" $border="rgba(16, 185, 129, 0.28)">High-Risk HR</TrackBadge>
          </TrackTopRow>
          <TrackSubtitle>ApexHire Global Enterprise • High-Risk HR Screening AI Dossier</TrackSubtitle>
        </TrackContent>
      </TrySampleOption>

      {promotedTypes.map((type) => {
        const { IconComponent, displayTitle, displayBadge, demoSubtitle, color } = getTrackVisuals(type);
        return (
          <TrySampleOption
            key={type.id || type.typeKey}
            onClick={() => handleTrySampleDynamic(type.typeKey, type.title)}
          >
            <TrackIconBox $bg={`${color}15`} $color={color} $border={`${color}30`}>
              <IconComponent />
            </TrackIconBox>
            <TrackContent>
              <TrackTopRow>
                <TrackTitle>{displayTitle}</TrackTitle>
                <TrackBadge $bg={`${color}15`} $color={color} $border={`${color}30`}>{displayBadge}</TrackBadge>
              </TrackTopRow>
              <TrackSubtitle>{demoSubtitle}</TrackSubtitle>
            </TrackContent>
          </TrySampleOption>
        );
      })}
    </TrySampleMenu>
  );

  const renderAssessmentsMegaMenu = (isGuest = false) => {
    const runNav = (path) => {
      setAssessmentsDropdownOpen(false);
      if (isGuest) {
        handleExploreAsGuest(path);
      } else {
        navigate(path);
      }
    };

    const promotedList = promotedTypes.filter(t => t.isPromoted);

    return (
      <AssessmentsMegaMenu $isOpen={assessmentsDropdownOpen}>
        {/* Top Grid: Diagnostic Frameworks + 1-Click Sample Reports */}
        <MegaMenuPrimaryCol style={{ padding: '14px 16px' }}>
          <MegaMenuSectionHeader style={{ marginBottom: '8px' }}>
            <span>⚡ Diagnostic Frameworks (Click Title to Start • Click Badge for Sample Report)</span>
            <span style={{ fontSize: '0.64rem', color: '#2563eb', background: '#eff6ff', padding: '2px 8px', borderRadius: '999px', fontWeight: 700 }}>
              {2 + promotedList.length} Tracks
            </span>
          </MegaMenuSectionHeader>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '6px 12px' }}>
            {/* Specialized Engine 1: GE Value Realization (Enterprise Gemini Migration) */}
            <MegaMenuTrackItem onClick={() => runNav('/ge-value-realization?tab=inputs')}>
              <TrackIconBox $bg="rgba(37, 99, 235, 0.12)" $color="#1d4ed8" $border="rgba(37, 99, 235, 0.28)">
                <FiTrendingUp />
              </TrackIconBox>
              <TrackContent>
                <TrackTopRow>
                  <TrackTitle>GE Value Realization</TrackTitle>
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      setAssessmentsDropdownOpen(false);
                      navigate('/ge-value-realization?tab=report');
                    }}
                    style={{ fontSize: '0.64rem', fontWeight: 700, padding: '2px 6px', borderRadius: '5px', background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', cursor: 'pointer', flexShrink: 0 }}
                    title="Open Executive Value Realization Readout"
                  >
                    📊 Sample Report
                  </span>
                </TrackTopRow>
                <TrackSubtitle>Enterprise legacy AI → Gemini migration value bridge • 82 Qs</TrackSubtitle>
              </TrackContent>
            </MegaMenuTrackItem>

            {/* Specialized Engine 2: EU AI Act Compliance */}
            <MegaMenuTrackItem onClick={() => runNav('/eu-ai-compliance')}>
              <TrackIconBox $bg="rgba(16, 185, 129, 0.1)" $color="#059669" $border="rgba(16, 185, 129, 0.25)">
                <FiShield />
              </TrackIconBox>
              <TrackContent>
                <TrackTopRow>
                  <TrackTitle>EU AI Act Compliance</TrackTitle>
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      setAssessmentsDropdownOpen(false);
                      navigate('/eu-ai-compliance?demo=high-risk-hr&tab=report');
                    }}
                    style={{ fontSize: '0.64rem', fontWeight: 700, padding: '2px 6px', borderRadius: '5px', background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', cursor: 'pointer', flexShrink: 0 }}
                    title="Open Annex IV Conformity Dossier & Board Readout"
                  >
                    📊 Sample Dossier
                  </span>
                </TrackTopRow>
                <TrackSubtitle>Statutory classification & conformity dossier • 20 Qs</TrackSubtitle>
              </TrackContent>
            </MegaMenuTrackItem>

            {/* Canonical Dynamic Assessment Blueprints */}
            {promotedList.map((type) => {
              const { IconComponent, displayTitle, microSubtitle, color } = getTrackVisuals(type);
              return (
                <MegaMenuTrackItem
                  key={type.id || type.typeKey}
                  onClick={() => runNav(`/assessments/run/${type.typeKey}`)}
                >
                  <TrackIconBox $bg={`${color}14`} $color={color} $border={`${color}28`}>
                    <IconComponent />
                  </TrackIconBox>
                  <TrackContent>
                    <TrackTopRow>
                      <TrackTitle>{displayTitle}</TrackTitle>
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTrySampleDynamic(type.typeKey, displayTitle);
                        }}
                        style={{ fontSize: '0.64rem', fontWeight: 700, padding: '2px 6px', borderRadius: '5px', background: '#f8fafc', color: '#334155', border: '1px solid #cbd5e1', cursor: 'pointer', flexShrink: 0 }}
                        title={`Open pre-seeded ${displayTitle} Executive Report`}
                      >
                        📊 Sample Report
                      </span>
                    </TrackTopRow>
                    <TrackSubtitle>{microSubtitle}</TrackSubtitle>
                  </TrackContent>
                </MegaMenuTrackItem>
              );
            })}
          </div>
        </MegaMenuPrimaryCol>

        {/* Sleek Footer Bar: Methodology Rubric & Progression Diff */}
        <div style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <div
            onClick={() => { setAssessmentsDropdownOpen(false); navigate('/deep-dive'); }}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, color: '#3730a3' }}
          >
            <FiLayers style={{ color: '#4f46e5' }} />
            <span>6-Pillar Scoring Rubric & Methodology</span>
            <FiArrowRight style={{ fontSize: '12px' }} />
          </div>
          <div
            onClick={() => { setAssessmentsDropdownOpen(false); navigate('/assessments/compare'); }}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}
          >
            <FiTrendingUp style={{ color: '#2563eb' }} />
            <span>Quarter-over-Quarter Progression Diff</span>
            <FiArrowRight style={{ fontSize: '12px' }} />
          </div>
        </div>
      </AssessmentsMegaMenu>
    );
  };

  return (
    <>
      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />
      
      <Nav>
        <NavContainer>
          {/* Brand Logo & Desktop Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <BrandLogo onClick={handleLogoClick}>
              <LogoIcon>⚡</LogoIcon>
              <LogoText>
                Score<span>X</span>
                <span style={{
                  fontSize: '0.62rem',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  padding: '2px 7px',
                  borderRadius: '6px',
                  background: '#f1f5f9',
                  color: '#475569',
                  border: '1px solid #e2e8f0'
                }}>
                  Enterprise
                </span>
              </LogoText>
            </BrandLogo>

            <TopNav>
              <NavLink
                onClick={() => handleNavigate('/assessments')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#0f172a',
                  fontWeight: '700'
                }}
              >
                <HiSparkles size={14} style={{ color: '#4f46e5' }} />
                Assessment Hub
              </NavLink>

              {/* 1. Frameworks & Demos Mega-Menu */}
              <DropdownContainer 
                className="dropdown-container"
                onMouseEnter={() => {
                  setAssessmentsDropdownOpen(true);
                  setPortfolioDropdownOpen(false);
                  setTrySampleDropdownOpen(false);
                  setResourcesDropdownOpen(false);
                  setAssignmentsDropdownOpen(false);
                  setAdminDropdownOpen(false);
                }}
                onMouseLeave={() => setAssessmentsDropdownOpen(false)}
              >
                <NavLink 
                  onClick={() => {
                    const next = !assessmentsDropdownOpen;
                    setAssessmentsDropdownOpen(next);
                    if (next) {
                      setPortfolioDropdownOpen(false);
                      setTrySampleDropdownOpen(false);
                      setResourcesDropdownOpen(false);
                      setAssignmentsDropdownOpen(false);
                      setAdminDropdownOpen(false);
                    }
                  }}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                >
                  Frameworks & Demos
                  <FiChevronDown size={13} style={{ transform: assessmentsDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </NavLink>
                {renderAssessmentsMegaMenu(!currentUser)}
              </DropdownContainer>

              {/* 2. Portfolio & Analytics Dropdown */}
              <DropdownContainer 
                className="dropdown-container"
                onMouseEnter={() => {
                  setPortfolioDropdownOpen(true);
                  setAssessmentsDropdownOpen(false);
                  setResourcesDropdownOpen(false);
                  setTrySampleDropdownOpen(false);
                }}
                onMouseLeave={() => setPortfolioDropdownOpen(false)}
              >
                <NavLink 
                  onClick={() => {
                    setPortfolioDropdownOpen(prev => !prev);
                    setAssessmentsDropdownOpen(false);
                    setResourcesDropdownOpen(false);
                    setTrySampleDropdownOpen(false);
                  }}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                >
                  Portfolio
                  <FiChevronDown size={13} style={{ transform: portfolioDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </NavLink>
                <DropdownMenu $isOpen={portfolioDropdownOpen} style={{ minWidth: '320px', left: 0, right: 'auto', padding: '10px 0' }}>
                  <DropdownHeader>🗂️ Canonical Portfolio & Analytics</DropdownHeader>
                  <DropdownItem onClick={() => { handleNavigate('/assessments'); setPortfolioDropdownOpen(false); }}>
                    <FiList style={{ color: '#0d9488' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                      <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.84rem' }}>Assessment Portfolio & Directory</span>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Browse, filter & manage all evaluations across 3 engines</span>
                    </div>
                  </DropdownItem>
                  <DropdownItem onClick={() => { handleNavigate('/customer-portfolio/ConnectPlus%20Telecom'); setPortfolioDropdownOpen(false); }}>
                    <FiTrendingUp style={{ color: '#10b981' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                      <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.84rem' }}>Customer Account Portfolio</span>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Multi-assessment account rollup & maturity radar</span>
                    </div>
                  </DropdownItem>
                  <DropdownItem onClick={() => { handleNavigate('/assessments/compare'); setPortfolioDropdownOpen(false); }}>
                    <FiBarChart2 style={{ color: '#2563eb' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                      <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.84rem' }}>Side-by-Side Progression Diff</span>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Compare baseline vs target horizon or reassessments</span>
                    </div>
                  </DropdownItem>
                </DropdownMenu>
              </DropdownContainer>

              {/* 3. Resources & Enablement Dropdown */}
              <DropdownContainer 
                className="dropdown-container"
                onMouseEnter={() => {
                  setResourcesDropdownOpen(true);
                  setAssessmentsDropdownOpen(false);
                  setPortfolioDropdownOpen(false);
                  setTrySampleDropdownOpen(false);
                }}
                onMouseLeave={() => setResourcesDropdownOpen(false)}
              >
                <NavLink 
                  onClick={() => setResourcesDropdownOpen(!resourcesDropdownOpen)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                >
                  Resources
                  <FiChevronDown size={13} style={{ transform: resourcesDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </NavLink>
                <DropdownMenu $isOpen={resourcesDropdownOpen} style={{ minWidth: '320px', left: 0, right: 'auto', padding: '10px 0' }}>
                  <DropdownHeader>💰 Financial & Value Modelers</DropdownHeader>
                  <DropdownItem onClick={() => { handleNavigate('/assessments/report/inst_finops_cloud_cost_optimization_demo'); setResourcesDropdownOpen(false); }}>
                    <FiTrendingUp style={{ color: '#059669' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                      <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.84rem' }}>FinOps & Cloud Economics Readout</span>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>3-year total cost of ownership & slot arbitrage</span>
                    </div>
                  </DropdownItem>
                  <DropdownItem onClick={() => { handleNavigate('/ge-value-realization?tab=report'); setResourcesDropdownOpen(false); }}>
                    <FiAward style={{ color: '#2563eb' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                      <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.84rem' }}>GE Value Realization & CFO Bridge</span>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Board-level payback period & NPV business case</span>
                    </div>
                  </DropdownItem>

                  <DropdownDivider />
                  <DropdownHeader>📖 Methodology & Guided Tours</DropdownHeader>
                  <DropdownItem onClick={() => { handleNavigate('/deep-dive'); setResourcesDropdownOpen(false); }}>
                    <FiLayers style={{ color: '#4f46e5' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                      <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.84rem' }}>6-Pillar Scoring Rubric & Methodology</span>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Maturity levels, weights & CMMI governance gates</span>
                    </div>
                  </DropdownItem>
                  <DropdownItem onClick={() => { handleNavigate('/workflow-walkthrough'); setResourcesDropdownOpen(false); }}>
                    <FiPlay style={{ color: '#7c3aed' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                      <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.84rem' }}>Interactive Workflow Tour</span>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Guided step-by-step architect & executive demo</span>
                    </div>
                  </DropdownItem>
                  <DropdownItem onClick={() => { handleNavigate('/feedback'); setResourcesDropdownOpen(false); }}>
                    <FiMessageSquare style={{ color: '#10b981' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                      <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.84rem' }}>Architecture Advisory & Feedback</span>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Request custom review or submit platform feedback</span>
                    </div>
                  </DropdownItem>
                </DropdownMenu>
              </DropdownContainer>
            </TopNav>
          </div>

          <ActionButtons>
            {currentUser ? (
              <>
                {/* Primary 1-Click AI Framework Compiler Button (Zero Duplication with Frameworks & Demos) */}
                <SecondaryCTAButton onClick={() => handleNavigate('/assessments/ai-generator')}>
                  <HiSparkles size={14} style={{ color: '#a855f7' }} />
                  AI Compiler
                </SecondaryCTAButton>

                {/* Governance & Admin Dropdown (Admin/Author only) with Hover Trigger */}
                {(currentUser.role === 'admin' || currentUser.role === 'author') && (
                  <DropdownContainer 
                    className="dropdown-container"
                    onMouseEnter={() => setAssignmentsDropdownOpen(true)}
                    onMouseLeave={() => setAssignmentsDropdownOpen(false)}
                  >
                    <DropdownButton 
                      $isOpen={assignmentsDropdownOpen}
                      onClick={() => setAssignmentsDropdownOpen(!assignmentsDropdownOpen)}
                    >
                      <FiList size={14} />
                      Governance
                      <FiChevronDown size={14} className="chevron" />
                    </DropdownButton>
                    <DropdownMenu $isOpen={assignmentsDropdownOpen}>
                      <DropdownItem onClick={() => {
                        navigate('/question-assignments');
                        setAssignmentsDropdownOpen(false);
                      }}>
                        <FiFileText />
                        Question Assignments
                      </DropdownItem>
                      {currentUser.role === 'admin' && (
                        <>
                          <DropdownItem onClick={() => {
                            navigate('/admin/questions');
                            setAssignmentsDropdownOpen(false);
                          }}>
                            <FiLayers />
                            Question Bank & Pillars
                          </DropdownItem>
                          <DropdownItem onClick={() => {
                            navigate('/user-management');
                            setAssignmentsDropdownOpen(false);
                          }}>
                            <FiUsers />
                            Manage Users & Roles
                          </DropdownItem>
                        </>
                      )}
                    </DropdownMenu>
                  </DropdownContainer>
                )}

                {/* Admin/User Dropdown with Hover Trigger */}
                <DropdownContainer 
                  className="dropdown-container"
                  onMouseEnter={() => setAdminDropdownOpen(true)}
                  onMouseLeave={() => setAdminDropdownOpen(false)}
                >
                  <DropdownButton 
                    $isOpen={adminDropdownOpen}
                    onClick={() => setAdminDropdownOpen(!adminDropdownOpen)}
                  >
                    <FiUser size={14} />
                    {currentUser.testMode 
                      ? `${currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)} (Test Mode)`
                      : (currentUser.firstName || currentUser.email.split('@')[0])
                    }
                    <FiChevronDown size={14} className="chevron" />
                  </DropdownButton>
                  <DropdownMenu $isOpen={adminDropdownOpen}>
                    {currentUser.role === 'demo' && (
                      <>
                        <DropdownItem 
                          style={{ color: '#818cf8', fontWeight: 600 }}
                          onClick={() => {
                            setAdminDropdownOpen(false);
                            setShowLoginModal(true);
                          }}
                        >
                          <FiLogIn style={{ color: '#818cf8' }} />
                          Sign In / Corporate SSO
                        </DropdownItem>
                        <DropdownDivider />
                      </>
                    )}
                    {currentUser.role === 'admin' && !currentUser.testMode && (
                      <>
                        <DropdownItem onClick={() => {
                          const testUser = { ...currentUser, role: 'author', testMode: true, originalRole: 'admin' };
                          localStorage.setItem('user', JSON.stringify(testUser));
                          setCurrentUser(testUser);
                          setAdminDropdownOpen(false);
                          
                          window.location.reload();
                        }}>
                          <FiUsers />
                          Switch to Author
                        </DropdownItem>
                        <DropdownItem onClick={() => {
                          const testUser = { ...currentUser, role: 'consumer', testMode: true, originalRole: 'admin' };
                          localStorage.setItem('user', JSON.stringify(testUser));
                          setCurrentUser(testUser);
                          setAdminDropdownOpen(false);
                          
                          window.location.reload();
                        }}>
                          <FiUsers />
                          Switch to Consumer
                        </DropdownItem>
                        <DropdownDivider />
                      </>
                    )}
                    {currentUser.testMode && (
                      <>
                        {currentUser.role !== 'author' && (
                          <DropdownItem onClick={() => {
                            const testUser = { ...currentUser, role: 'author' };
                            localStorage.setItem('user', JSON.stringify(testUser));
                            setCurrentUser(testUser);
                            setAdminDropdownOpen(false);
                            
                            window.location.reload();
                          }}>
                            <FiUsers />
                            Switch to Author
                          </DropdownItem>
                        )}
                        {currentUser.role !== 'consumer' && (
                          <DropdownItem onClick={() => {
                            const testUser = { ...currentUser, role: 'consumer' };
                            localStorage.setItem('user', JSON.stringify(testUser));
                            setCurrentUser(testUser);
                            setAdminDropdownOpen(false);
                            
                            window.location.reload();
                          }}>
                            <FiUsers />
                            Switch to Consumer
                          </DropdownItem>
                        )}
                        <DropdownItem onClick={() => {
                          const originalUser = { ...currentUser, role: currentUser.originalRole, testMode: false };
                          delete originalUser.originalRole;
                          localStorage.setItem('user', JSON.stringify(originalUser));
                          setCurrentUser(originalUser);
                          setAdminDropdownOpen(false);
                          
                          window.location.reload();
                        }}>
                          <FiUser />
                          Switch Back to Admin
                        </DropdownItem>
                        <DropdownDivider />
                      </>
                    )}
                    <DropdownItem onClick={() => {
                      handleLogout();
                      setAdminDropdownOpen(false);
                    }}>
                      <FiLogOut />
                      Logout
                    </DropdownItem>
                    <DropdownDivider />
                    <DropdownItem onClick={() => {
                      navigate('/feedback');
                      setAdminDropdownOpen(false);
                    }}>
                      <FiMessageSquare />
                      Give Feedback
                    </DropdownItem>
                    {currentUser.role === 'admin' && !currentUser.testMode && (
                      <>
                        <DropdownItem onClick={() => {
                          navigate('/admin/feedback');
                          setAdminDropdownOpen(false);
                        }}>
                          <FiMessageSquare />
                          View All Feedback
                        </DropdownItem>
                      </>
                    )}
                    <DropdownDivider />
                    <DropdownEmailLink 
                      onClick={(e) => {
                        e.stopPropagation();
                        setAdminDropdownOpen(false);
                        navigate('/assessments/ai-generator');
                      }}
                    >
                      <FiMail />
                      Architecture Advisory
                    </DropdownEmailLink>
                  </DropdownMenu>
                </DropdownContainer>
              </>
            ) : (
              <>
                {/* Quick Launch Sample Dropdown (Guest View) */}
                <TrySampleDropdownContainer 
                  className="dropdown-container"
                  onMouseEnter={() => {
                    setTrySampleDropdownOpen(true);
                    setAssessmentsDropdownOpen(false);
                    setResourcesDropdownOpen(false);
                  }}
                  onMouseLeave={() => setTrySampleDropdownOpen(false)}
                >
                  <SecondaryCTAButton onClick={() => {
                    const next = !trySampleDropdownOpen;
                    setTrySampleDropdownOpen(next);
                    if (next) {
                      setAssessmentsDropdownOpen(false);
                      setResourcesDropdownOpen(false);
                    }
                  }}>
                    <FiPlay size={13} style={{ color: '#818cf8' }} />
                    Quick Launch
                    <FiChevronDown size={13} className="chevron" style={{ marginLeft: '-2px', transform: trySampleDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </SecondaryCTAButton>
                  
                  {renderTrySampleMenu()}
                </TrySampleDropdownContainer>

                <DropdownButton onClick={() => setShowLoginModal(true)}>
                  <FiLogIn size={14} />
                  Sign In
                </DropdownButton>
              </>
            )}
          </ActionButtons>

        {/* Mobile Menu Button */}
        <MobileMenuButton 
          aria-label="Toggle navigation menu"
          data-testid="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <FiX /> : <FiMenu />}
        </MobileMenuButton>
      </NavContainer>

      {/* Mobile Menu */}
      <MobileMenu $isOpen={mobileMenuOpen}>
        <MobileNavLink onClick={handleLogoClick}>Home</MobileNavLink>
        <MobileNavLink onClick={() => handleNavigate('/assessments')}>Assessment Hub</MobileNavLink>
        <MobileNavLink onClick={() => handleNavigate('/assessments')}>Portfolio Directory</MobileNavLink>
        <MobileNavLink onClick={() => handleNavigate('/deep-dive')}>Methodology Rubric</MobileNavLink>
        <MobileNavLink onClick={() => handleNavigate('/workflow-walkthrough')}>Interactive Tour</MobileNavLink>
        
        {currentUser ? (
          <>
            <MobileSecondaryCTAButton onClick={() => handleNavigate('/assessments/ai-generator')}>
              <HiSparkles size={16} style={{ color: '#c084fc' }} />
              AI Assessment Generator
            </MobileSecondaryCTAButton>
            <MobileSecondaryCTAButton onClick={() => handleNavigate('/ge-value-realization')}>
              <FiTrendingUp size={16} style={{ color: '#2563eb' }} />
              GE Value Realization
            </MobileSecondaryCTAButton>
            <MobileSecondaryCTAButton onClick={() => handleNavigate('/eu-ai-compliance')}>
              <FiShield size={16} style={{ color: '#059669' }} />
              EU AI Compliance Engine
            </MobileSecondaryCTAButton>
            {currentUser.role !== 'consumer' && (
              <>
                <MobileSecondaryCTAButton onClick={() => setMobileTrySampleOpen(!mobileTrySampleOpen)}>
                  <FiPlay size={16} />
                  Try Sample Assessments
                  <FiChevronDown size={14} style={{ marginLeft: 'auto' }} />
                </MobileSecondaryCTAButton>
                {mobileTrySampleOpen && (
                  <div style={{ background: '#f8fafc', padding: '8px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <MobileSubLink onClick={() => handleNavigate('/ge-value-realization?tab=report')}>• GE Value Realization (BioNova)</MobileSubLink>
                    <MobileSubLink onClick={() => handleNavigate('/eu-ai-compliance?demo=high-risk-hr')}>• EU AI Act Compliance (ApexHire HR)</MobileSubLink>
                    {promotedTypes.map(t => (
                      <MobileSubLink key={t.typeKey} onClick={() => handleTrySampleDynamic(t.typeKey, t.title)}>
                        • {t.title}
                      </MobileSubLink>
                    ))}
                  </div>
                )}
              </>
            )}
            {(currentUser.role === 'admin' || currentUser.role === 'author') && (
              <MobileSecondaryCTAButton onClick={() => handleNavigate('/question-assignments')}>
                <FiFileText size={16} />
                Question Assignments
              </MobileSecondaryCTAButton>
            )}
            {currentUser.role === 'admin' && (
              <MobileSecondaryCTAButton onClick={() => handleNavigate('/user-management')}>
                <FiUsers size={16} />
                Manage Users
              </MobileSecondaryCTAButton>
            )}
            <MobileSecondaryCTAButton onClick={handleLogout}>
              <FiLogOut size={16} />
              Logout ({currentUser.email})
            </MobileSecondaryCTAButton>
          </>
        ) : (
          <>
            <MobileSecondaryCTAButton onClick={() => {
              closeMobileMenu();
              handleExploreAsGuest('/assessments');
            }}>
              Portfolio Directory
            </MobileSecondaryCTAButton>
            <MobileSecondaryCTAButton onClick={() => setMobileTrySampleOpen(!mobileTrySampleOpen)}>
              <FiPlay size={16} />
              Try Sample Assessments
              <FiChevronDown size={14} style={{ marginLeft: 'auto' }} />
            </MobileSecondaryCTAButton>
            {mobileTrySampleOpen && (
              <div style={{ background: '#f8fafc', padding: '8px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <MobileSubLink onClick={() => handleNavigate('/ge-value-realization?tab=report')}>• GE Value Realization (BioNova)</MobileSubLink>
                <MobileSubLink onClick={() => handleNavigate('/eu-ai-compliance?demo=high-risk-hr')}>• EU AI Act Compliance (ApexHire HR)</MobileSubLink>
                {promotedTypes.map(t => (
                  <MobileSubLink key={t.typeKey} onClick={() => handleTrySampleDynamic(t.typeKey, t.title)}>
                    • {t.title}
                  </MobileSubLink>
                ))}
              </div>
            )}
            <MobileSecondaryCTAButton onClick={() => {
              closeMobileMenu();
              setShowLoginModal(true);
            }}>
              <FiLogIn size={16} />
              Login
            </MobileSecondaryCTAButton>
          </>
        )}
      </MobileMenu>
    </Nav>
    </>
  );
};

export default GlobalNav;

