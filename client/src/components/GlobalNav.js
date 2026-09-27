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
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 36px;

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
  background: linear-gradient(135deg, #0f172a 0%, #312e81 100%);
  border: 1px solid rgba(99, 102, 241, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-weight: 900;
  font-size: 0.9rem;
  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.18);
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
  background: #0f172a;
  color: #ffffff;
  border: 1px solid #1e293b;
  outline: none;
  padding: 7px 14px;
  border-radius: 9px;
  font-weight: 600;
  font-size: 0.84rem;
  cursor: pointer;
  transition: all 0.18s ease;
  white-space: nowrap;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.12);

  &:hover {
    background: #1e293b;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(15, 23, 42, 0.18);
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
  background: #0f172a;
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
    background: #1e293b;
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
    if (user.role === 'consumer') {
      navigate('/my-assessments');
    } else if (user.role === 'author' || user.role === 'admin') {
      navigate('/insights-dashboard');
    }
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
    try {
      toast.loading('Loading Gen AI Readiness Executive Report...', { id: 'genai-sample' });
      const listRes = await fetch('/api/genai-readiness/assessments');
      const listData = await listRes.json();
      const items = Array.isArray(listData) ? listData : (listData?.assessments || []);
      if (items.length > 0 && items[0]?.id) {
        toast.success('Gen AI Readiness Report loaded!', { id: 'genai-sample' });
        navigate(`/genai-readiness/report/${items[0].id}`);
        return;
      }
      const fwRes = await fetch('/api/genai-readiness/framework');
      const fw = await fwRes.json();
      const responses = {};
      const scores = {};
      let total = 0;
      (fw.dimensions || []).forEach((dim, dIdx) => {
        let dimScore = 0;
        (dim.questions || []).forEach((q, qIdx) => {
          const val = q.options?.[Math.min((q.options?.length || 1) - 1, ((dIdx + qIdx) % 2) + 2)]?.value || 10;
          responses[q.id] = val;
          dimScore += val;
        });
        scores[dim.id] = { name: dim.name, score: dimScore, maxScore: dim.maxPoints || 50, percentage: Math.round((dimScore / (dim.maxPoints || 50)) * 100) };
        total += dimScore;
      });
      const createRes = await fetch('/api/genai-readiness/assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: 'Global Retail Corp',
          responses,
          scores,
          totalScore: total,
          maxScore: fw.totalPoints || 300,
          maturityLevel: 'Scaling & Governed',
          completedAt: new Date().toISOString()
        })
      });
      const created = await createRes.json();
      toast.success('Gen AI Readiness Report loaded!', { id: 'genai-sample' });
      navigate(`/genai-readiness/report/${created.id}`);
    } catch (e) {
      toast.dismiss('genai-sample');
      navigate('/genai-readiness');
    }
  };

  const handleTrySampleDynamic = async (typeKey, title) => {
    closeMobileMenu();
    setTrySampleDropdownOpen(false);
    setAssessmentsDropdownOpen(false);
    const canonicalDemoMap = {
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

  const handleExploreAsGuest = (redirectPath = '/insights-dashboard') => {
    closeMobileMenu();
    const guestUser = authService.createGuestSession();
    localStorage.setItem('scorex_disclaimer_accepted', 'true');
    setCurrentUser(guestUser);
    toast.success('Guest Mode Activated (No Sign In Required)');
    navigate(redirectPath);
  };

  // Generate UNIQUE, question-specific customer comments
  // 🔥 CRITICAL: Uses TRUE randomness + timestamp to ensure NO TWO ASSESSMENTS ARE EVER THE SAME
  const generateRealisticComment = (pillarId, dimensionId, questionId, currentState, timestamp) => {
    // Comprehensive dimension-specific comment library (low maturity = 1-2)
    const dimensionComments = {
      // PLATFORM & GOVERNANCE
      'environment_architecture': [
        "Single workspace for all teams. No isolation between dev/prod. Need multi-workspace strategy with centralized metadata catalog for governance.",
        "Workspaces created ad-hoc. Inconsistent naming. Want standardized workspace provisioning with Terraform and tagging for cost tracking.",
        "Every team has own workspace. No standards. Need centralized architecture with catalog federation and workspace templates for consistency.",
        "Dev and prod in same workspace. Security concern. Want separate workspaces with catalog-level isolation and promotion workflows."
      ],
      'identity_security': [
        "Manual user provisioning via cloud directory. No SCIM. Want automated sync and group-based unified catalog permissions with audit logs.",
        "Admin rights granted liberally. No principle of least privilege. Need RBAC with unified catalog and secrets management with secure key vaults.",
        "Passwords hardcoded in notebooks. Security risk. Want managed secrets with cloud KMS integration and automatic secret rotation for compliance.",
        "No audit trail for data access. Compliance concern. Need unified catalog audit logs with automated HIPAA compliance reporting and access reviews."
      ],
      'governance_compliance': [
        "No centralized data catalog. Users don't know what data exists. Want unified catalog for discovery and lineage with PII tagging.",
        "Compliance team manually reviews code quarterly. Need automated scans for PII/PHI and unified catalog data classification tags with certifications.",
        "Data lineage tracked in spreadsheets. Audit nightmare. Want unified catalog automatic lineage tracking and impact analysis for regulatory compliance.",
        "PII scattered across tables. GDPR risk. Need unified catalog with automated PII detection, classification tags, and deletion workflows for privacy compliance."
      ],
      'observability_monitoring': [
        "No visibility into cluster usage. Surprises in cloud bills. Want cluster event logs and system tables for usage attribution by team.",
        "Jobs fail silently. Alerts reactive. Need automated workflows with email alerts and integration with PagerDuty for production pipelines.",
        "Query performance unpredictable. No metrics. Want system tables dashboard with query profiles, bottleneck identification, and optimization recommendations.",
        "Pipeline SLAs missed without warning. Need proactive monitoring with system tables, automated alerts, and Slack notifications for operations team."
      ],
      'cost_management': [
        "Cloud costs ballooning. No understanding of spend drivers. Want budget alerts and system tables for chargeback to business units with tags.",
        "Teams oversize clusters by default. No right-sizing. Need automated recommendations and spot instance policies for non-critical workloads to reduce costs.",
        "No visibility into compute spend. CFO asking questions. Want system tables cost dashboard with spend by team and budget alerts for accountability.",
        "Clusters left running overnight. Waste discovered post-mortem. Need auto-termination policies, idle cluster detection, and budget guardrails for cost control."
      ],
      
      // DATA ENGINEERING
      'ingestion_strategy': [
        "Manual SFTP transfers nightly. Batch loads via notebooks. Want Auto Loader for real-time streaming ingestion with schema evolution and checkpoints.",
        "Data engineers write custom Python scripts per source. No reusability. Need standardized connectors and streaming ingestion templates for common sources like S3.",
        "Kinesis streams ingested via custom Spark code. Complex error handling. Want continuous ingestion with automatic schema inference and exactly-once semantics for reliability.",
        "Files land in cloud storage, manual tracking of which processed. Want continuous auto-ingestion with checkpoint management and incremental processing for operational efficiency."
      ],
      'lakehouse_architecture': [
        "Parquet files in cloud storage with no ACID guarantees. Delete operations problematic. Want Delta Lake for ACID transactions and time travel for audits.",
        "Raw zone, curated zone managed manually. No clear medallion architecture. Need Delta Lake with Bronze/Silver/Gold layers and declarative pipelines for automation.",
        "Multiple formats (Parquet, ORC, Avro). Schema drift issues. Want Delta Lake with automatic schema evolution and unified format for consistency.",
        "No data versioning. Can't rollback bad loads. Need Delta Lake time travel with vacuum control and version retention policies for data governance."
      ],
      'pipeline_orchestration': [
        "Airflow orchestrates Spark submits. Complex dependencies hard to manage. Want declarative workflows with native integration and task dependencies for observability.",
        "Notebooks run manually or via cron. No visibility into failures. Need automated pipeline jobs with retries, alerting, and lineage tracking for production pipelines.",
        "Jenkins triggers notebook runs. No native monitoring. Want declarative workflows with built-in alerting, retry logic, and failure notifications for production reliability.",
        "Pipeline failures discovered by end users. No proactive alerts. Need automated pipeline jobs with SLA tracking, email notifications, and PagerDuty integration for operational excellence."
      ],
      'data_quality': [
        "No data quality checks. Issues found by analysts downstream. Want DLT expectations (expect_or_fail, expect_or_drop) to catch issues early at ingestion.",
        "Manual SQL checks in notebooks. Inconsistent across teams. Need Lakehouse Monitoring for automated data quality metrics and anomaly detection dashboards.",
        "Bad data reaches production dashboards. Customer complaints. Want DLT with quarantine tables and Lakehouse Monitoring for proactive quality gates.",
        "No visibility into data freshness or completeness. Need Lakehouse Monitoring with SLA tracking, automated alerts, and data quality scorecards for operations."
      ],
      'performance_scalability': [
        "Pipelines take 6+ hours. Business wants hourly refreshes. Need Photon acceleration and partition tuning with Z-ordering for query performance improvement.",
        "Clusters manually sized. Either over-provisioned or run out of memory. Want auto-scaling clusters and serverless compute for cost efficiency and elasticity.",
        "Jobs fail with OOM errors. Trial and error sizing. Want serverless compute with automatic resource management and Photon for predictable performance.",
        "Data volumes growing 3x per year. Current pipelines don't scale. Need liquid clustering, Photon acceleration, and serverless for elastic growth."
      ],
      
      // ANALYTICS & BI
      'analytic_performance': [
        "Analysts wait 5+ minutes per query. Frustration growing. Want serverless SQL warehouses for sub-second queries and query caching for reusability.",
        "Same aggregations re-computed hourly. Inefficient. Need materialized views and query result caching to reduce compute costs and improve response times.",
        "Dashboards timeout during business hours. Resource contention. Want serverless SQL with auto-scaling for consistent performance.",
        "PowerBI extracts take 30+ minutes. Analysts frustrated. Need Serverless SQL with query optimization, clustering, and caching for fast BI integration."
      ],
      'semantic_layer': [
        "Fact tables have 200+ columns. Star schema unclear. Want dimensional modeling best practices and slowly changing dimension (SCD) patterns for historical accuracy.",
        "Every team creates own metrics. Inconsistent revenue numbers. Need centralized semantic layer with unified catalog and SQL UDFs for metric standardization and governance.",
        "Analysts join 10+ tables for simple report. Complex SQL. Want curated data marts with pre-joined dimensions and governed views for self-service simplicity.",
        "Metric definitions vary by department. Trust issues. Need unified catalog with tagged semantic layer and SQL functions for single source of truth."
      ],
      'bi_reporting': [
        "Analysts export to Excel then pivot. No real-time dashboards. Want modern SQL dashboards with auto-refresh and embedding for business stakeholders.",
        "PowerBI connects to raw tables. Slow and fragile. Need SQL warehouse endpoint with optimized execution and aggregation tables for fast BI integration and reliability.",
        "Tableau extracts refresh overnight. Stale data by morning. Want live connection and optimized query engines for real-time BI dashboards.",
        "Reports built in notebooks, manually regenerated. Want SQL dashboards with scheduling, parameterization, and email delivery for executive reporting."
      ],
      'self_service_analytics': [
        "Analysts wait on data engineers for every query. Bottleneck. Want self-service SQL with saved queries and natural language assist for ad-hoc analysis.",
        "Business users can't explore data independently. No access control. Need unified catalog row/column security and granular permissions for safe self-service access.",
        "SQL skills vary widely. Advanced users frustrated, novices stuck. Want AI query assistance and query templates for different skill levels.",
        "Data requests backlogged 2 weeks. Business agility suffering. Need governed self-service and AI/BI for analyst autonomy without engineering bottleneck."
      ],
      'data_sharing': [
        "Notebooks emailed as HTML. No version control. Want Git integration and notebook versioning for collaboration and reproducibility.",
        "Each analyst has own copy of queries. Duplication and drift. Need shared queries library in SQL workspace and comments for institutional knowledge sharing.",
        "Partners request data extracts monthly. Manual CSV exports. Want open data sharing protocols for secure, automated data sharing with external organizations and real-time updates.",
        "Cross-team collaboration difficult. Different workspaces and catalogs. Need unified catalog federation and open sharing for seamless internal and external collaboration."
      ],
      
      // MACHINE LEARNING
      'ml_lifecycle': [
        "ML experiments tracked in spreadsheets. Can't reproduce results. Want MLOps tracking for experiment tracking with hyperparameter logging and model versioning for reproducibility.",
        "Model artifacts stored in cloud storage with manual naming. No lineage. Need centralized Model Registry for version control and model lineage with unified catalog integration.",
        "Data scientists can't find past experiments. Rework common. Want MLOps platforms with experiment search, comparison views, and automated metric tracking for productivity.",
        "Model performance degrades in production, no history to compare. Need model monitoring, drift detection, and automated alerting for quality assurance."
      ],
      'ml_deployment': [
        "Models deployed via custom servers. Manual scaling. Want Managed Model Serving with autoscaling endpoints and A/B testing for production inference workloads.",
        "Data scientists retrain models monthly via notebook runs. No automation. Need automated retraining pipelines and trigger-based deployment for MLOps.",
        "Model deployment takes 2 weeks. Business value delayed. Want Managed Model Serving with one-click deployment and automated testing for rapid productionization.",
        "Production models run on outdated data. Stale predictions. Need automated retraining pipelines with scheduled jobs and Feature Store for always-fresh models."
      ],
      'feature_engineering': [
        "Feature engineering code duplicated in notebooks. Inconsistency across models. Want Centralized Feature Store for unified feature definitions and online/offline serving.",
        "Training features differ from inference. Causes model drift. Need Feature Store with point-in-time lookups for training-serving skew prevention and consistency.",
        "Feature computation expensive, re-run for every model. Want Feature Store with precomputed features and online serving for cost efficiency and low latency.",
        "No visibility into feature usage across models. Want Feature Store with lineage tracking, usage analytics, and feature discovery for reusability and governance."
      ],
      'ml_governance': [
        "No model approval process. Models deployed to prod ad-hoc. Want Model Registry with stage transitions and approval workflows for governance compliance.",
        "Can't explain model decisions. Regulatory concern. Need model monitoring dashboards and explainability tools for regulatory compliance reporting.",
        "No model risk assessment. Compliance gaps. Want model governance with model documentation, bias testing, and approval gates for regulated ML deployments.",
        "Models in production, but who owns them? Need Model Registry with ownership tags, SLA tracking, and automated deprecation policies for operational accountability."
      ],
      'ml_scale': [
        "Single-node scikit-learn. Datasets growing beyond memory. Want distributed training with Spark MLlib or PyTorch Distributed for large-scale model training on big data.",
        "Hyperparameter tuning takes days. Blocking experimentation. Need parallel trials and hyperparameter optimization for faster experimentation cycles.",
        "GPU clusters expensive and underutilized. Want efficient distributed training and GPU pooling for cost-effective scale.",
        "Training jobs fail on large datasets. OOM errors common. Need distributed training and model parallelism for petabyte-scale data."
      ],
      
      // GENERATIVE AI
      'genai_strategy': [
        "No GenAI initiative. CIO asking for roadmap. Want GenAI architecture workshop to identify high-impact use cases like RAG for knowledge base search.",
        "Experimenting with public models for customer support. Security concerns. Need Enterprise Foundation Models for on-platform inference with data residency and guardrails.",
        "Business units using shadow AI. Governance risk. Want centralized GenAI platform with approved models and usage tracking for enterprise control.",
        "GenAI POCs not scaling to production. Need scalable GenAI infrastructure with Vector Search, Model Serving, and MLOps for productionizing LLM applications."
      ],
      'data_readiness': [
        "Documentation scattered in Confluence and SharePoint. No vector embeddings. Want Vector Search index for semantic retrieval and RAG application on internal knowledge base.",
        "PDFs and Word docs not searchable semantically. Need chunking strategy and Vector Search with hybrid search (keyword + semantic) for enterprise document retrieval.",
        "Knowledge base outdated, manually maintained. Want automated ingestion with Vector Search, embedding generation, and incremental updates for always-current RAG.",
        "Unstructured data in cloud storage, no metadata. Want automated document parsing, Vector Search indexing, and unified catalog tagging for governed GenAI data."
      ],
      'genai_architecture': [
        "Prompt engineering in Python notebooks. No reusability. Want AI Playground for prompt iteration and versioning with evaluation metrics and comparison views.",
        "Calling external API directly. Cost and latency concerns. Need Managed Model Serving with provisioned throughput for Foundation Models and reduced latency for production apps.",
        "RAG app in single notebook. Not production-ready. Want Model Serving, Vector Search, and monitoring for enterprise-grade GenAI applications.",
        "LLM prompts hardcoded. No A/B testing. Need prompt management, versioning, and experiment tracking for systematic optimization."
      ],
      'genai_quality': [
        "No way to measure RAG quality. Anecdotal feedback only. Want automated evaluation metrics (retrieval precision, answer relevance, faithfulness) for systematic assessment.",
        "Prompt changes break production. No regression testing. Need automated LLM evaluation pipelines with golden test sets for continuous quality monitoring.",
        "LLM outputs inconsistent. User frustration. Want evaluation frameworks, judge models, and quality thresholds for reliable GenAI responses.",
        "Can't compare different prompts or models. Need A/B testing, evaluation metrics dashboard, and benchmark selection for continuous improvement."
      ],
      'genai_governance': [
        "No guardrails on LLM outputs. Risk of hallucinations. Want AI Gateway monitoring for toxicity detection and output filtering with guardrail policies.",
        "Concerns about bias in GenAI responses. Need bias testing framework and evaluation metrics for fairness audits and responsible AI governance with stakeholder review.",
        "No PII protection in LLM workflows. Privacy risk. Want unified catalog with PII detection, masking policies, and audit logs for compliant GenAI applications.",
        "LLM costs unpredictable. Budget overruns. Need usage tracking, cost attribution, and budget alerts for financial control of GenAI operations."
      ],
      
      // OPERATIONAL EXCELLENCE
      'center_of_excellence': [
        "No central team. Every project figures out architecture independently. Want CoE with office hours and communication channel for support escalation and best practices sharing.",
        "Platform capabilities unknown. Marketing team doesn't know about Vector Search for personalization. Need quarterly showcase and use case library for internal evangelism.",
        "Support requests go to external vendor. Slow response. Want internal CoE with platform architects, office hours, and escalation paths for faster issue resolution.",
        "No governance council. Inconsistent patterns. Need CoE with architecture review board, standards documentation, and approval workflows for platform governance."
      ],
      'collaboration_culture': [
        "Teams work in silos. Work not shared. Want centralized repositories with Git integration and shared workspace folders for knowledge sharing and collaboration.",
        "Best practices lost when engineers leave. Need documentation wiki and community channels for institutional knowledge and peer support.",
        "No cross-team code review. Quality varies. Want Git pull requests, code review workflows, and shared libraries for quality assurance.",
        "Teams duplicate work unknowingly. Need shared workspace with discovery tools, asset tagging, and quarterly demos for cross-pollination and reuse."
      ],
      'enablement_training': [
        "Tribal knowledge. Key engineers are single point of failure. Want documentation site with runbooks and best practices repository for platform patterns and troubleshooting.",
        "Teams reinvent the wheel. No code reuse. Need curated template library for common patterns (pipelines, MLOps, security) with example implementations and GitHub integration.",
        "New users overwhelmed. No learning path. Want structured training academy program, hands-on labs, and certification milestones for skill development.",
        "Advanced users hit plateau. No continuous learning. Need lunch-and-learn sessions, conference attendance, and sandbox environment for innovation and skill growth."
      ],
      'cost_value': [
        "No visibility into platform usage or ROI. CFO asks for justification. Want system tables dashboard for active users, cost per business unit, and business impact metrics.",
        "Clusters idle overnight. Wasted spend. Need automated cluster termination policies, chargeback model, and usage alerts with recommendations for cost optimization.",
        "Can't justify platform expansion. Need business case with ROI metrics, time-to-insight improvements, and cost avoidance from legacy retirement for executive buy-in.",
        "Budget overruns mid-quarter. No forecasting. Want cost trends, workload forecasting, and budget alerts with auto-scaling policies for predictability."
      ],
      'innovation_culture': [
        "15% of data team uses modern platform. Most still on legacy tools. Want onboarding program and success metrics to track adoption velocity with executive dashboard.",
        "New hires take 3 weeks to become productive. No training. Need structured training academy and internal bootcamp curriculum with certification tracking for faster ramp-up.",
        "Innovation requests backlogged. No experimentation time. Want hackathons, sandbox environments, and dedicated innovation time for exploring modern data & AI capabilities.",
        "Teams fear breaking production. Risk-averse culture. Need dev/staging environments, CI/CD pipelines, and rollback procedures for safe experimentation and innovation."
      ]
    };
    
    // Get comments for this specific dimension
    const comments = dimensionComments[dimensionId] || [
      "Currently using manual processes. Need automation and best practices implementation with modern platform capabilities for operational efficiency.",
      "Early stage adoption. Looking to scale with modern architecture features and proper governance for enterprise-grade data and AI workloads."
    ];
    
    // 🔥 CRITICAL FIX: Use TRUE randomness + timestamp seed
    // NO deterministic hashing - every assessment MUST be unique!
    // Combine timestamp, questionId, and Math.random() for absolute uniqueness
    const timestampSeed = timestamp + questionId.charCodeAt(0);
    const randomSeed = Math.random() * timestampSeed;
    const commentIndex = Math.floor(randomSeed % comments.length);
    
    return comments[commentIndex];
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

    let displayTitle = type.title || '';
    if (displayTitle === 'Autonomous Multi-Agent AI Mesh Architecture & MCP Readiness') {
      displayTitle = 'Autonomous Multi-Agent AI & MCP';
    } else if (displayTitle === 'FinOps & Cloud Cost Optimization Assessment') {
      displayTitle = 'FinOps & Cloud Cost Optimization';
    } else if (displayTitle === 'Gemini Enterprise Migration Assessment') {
      displayTitle = 'Gemini Enterprise Migration';
    } else if (displayTitle === 'Enterprise AI & Zero-Trust Security Assessment') {
      displayTitle = 'Enterprise AI & Zero-Trust Security';
    }

    let displayBadge = type.badge || 'Custom';
    if (displayBadge === 'Lakehouse Modernization') displayBadge = 'Lakehouse';
    if (displayBadge === 'CISO & Zero-Trust') displayBadge = 'Zero-Trust';

    let microSubtitle = type.subtitle || 'Enterprise architecture & readiness evaluation';
    let demoSubtitle = microSubtitle;
    if (key.includes('gemini')) {
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
        <span style={{ fontSize: '0.64rem', color: '#2563eb', background: '#eff6ff', padding: '2px 6px', borderRadius: '999px', fontWeight: 700 }}>8 Live Demos</span>
      </TrySampleHeader>
      <TrySampleOption onClick={handleTrySampleCore}>
        <TrackIconBox $bg="rgba(255, 107, 53, 0.12)" $color="#ff6b35" $border="rgba(255, 107, 53, 0.25)">
          <FiBarChart2 />
        </TrackIconBox>
        <TrackContent>
          <TrackTopRow>
            <TrackTitle>Enterprise Data & AI Maturity</TrackTitle>
            <TrackBadge $bg="rgba(255, 107, 53, 0.12)" $color="#ea580c" $border="rgba(255, 107, 53, 0.28)">Core 6-Pillar</TrackBadge>
          </TrackTopRow>
          <TrackSubtitle>ConnectPlus Telecom • 60-Question Executive Report</TrackSubtitle>
        </TrackContent>
      </TrySampleOption>

      <TrySampleOption onClick={handleTrySampleGenAI}>
        <TrackIconBox $bg="rgba(124, 58, 237, 0.12)" $color="#7c3aed" $border="rgba(124, 58, 237, 0.28)">
          <FiCpu />
        </TrackIconBox>
        <TrackContent>
          <TrackTopRow>
            <TrackTitle>Gen AI Readiness Assessment</TrackTitle>
            <TrackBadge $bg="rgba(124, 58, 237, 0.12)" $color="#7c3aed" $border="rgba(124, 58, 237, 0.28)">LLM & RAG</TrackBadge>
          </TrackTopRow>
          <TrackSubtitle>Global Retail Corp • 6-Dimension Readiness Readout</TrackSubtitle>
        </TrackContent>
      </TrySampleOption>

      <TrySampleOption onClick={() => { setTrySampleDropdownOpen(false); navigate('/ge-value-realization?tab=report'); }}>
        <TrackIconBox $bg="rgba(37, 99, 235, 0.12)" $color="#2563eb" $border="rgba(37, 99, 235, 0.28)">
          <FiTrendingUp />
        </TrackIconBox>
        <TrackContent>
          <TrackTopRow>
            <TrackTitle>GE Value Realization (Merck)</TrackTitle>
            <TrackBadge $bg="rgba(37, 99, 235, 0.12)" $color="#1d4ed8" $border="rgba(37, 99, 235, 0.28)">CFO & OKR Bridge</TrackBadge>
          </TrackTopRow>
          <TrackSubtitle>Merck & Co., Inc. • 85,300 Seats • McKinsey & Google Readout</TrackSubtitle>
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
              {4 + promotedList.length} Tracks
            </span>
          </MegaMenuSectionHeader>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '6px 12px' }}>
            {/* Track 0: GE Value Realization (Merck Gemini Enterprise Migration) */}
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
                    title="Open Merck McKinsey & Google Executive Value Realization Readout"
                  >
                    📊 Merck Report
                  </span>
                </TrackTopRow>
                <TrackSubtitle>Merck OpenAI → Gemini migration value bridge • 75 Qs</TrackSubtitle>
              </TrackContent>
            </MegaMenuTrackItem>

            {/* Track 1: Data & AI Maturity */}
            <MegaMenuTrackItem onClick={() => runNav('/start')}>
              <TrackIconBox $bg="rgba(37, 99, 235, 0.1)" $color="#2563eb" $border="rgba(37, 99, 235, 0.22)">
                <FiBarChart2 />
              </TrackIconBox>
              <TrackContent>
                <TrackTopRow>
                  <TrackTitle>Data & AI Maturity</TrackTitle>
                  <span
                    onClick={(e) => { e.stopPropagation(); handleTrySampleCore(); }}
                    style={{ fontSize: '0.64rem', fontWeight: 700, padding: '2px 6px', borderRadius: '5px', background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', cursor: 'pointer', flexShrink: 0 }}
                    title="Open pre-seeded Executive Report"
                  >
                    📊 Sample Report
                  </span>
                </TrackTopRow>
                <TrackSubtitle>Enterprise data, MLOps & cloud governance • 60 Qs</TrackSubtitle>
              </TrackContent>
            </MegaMenuTrackItem>

            {/* Track 2: Gen AI Readiness */}
            <MegaMenuTrackItem onClick={() => runNav('/genai-readiness')}>
              <TrackIconBox $bg="rgba(124, 58, 237, 0.1)" $color="#7c3aed" $border="rgba(124, 58, 237, 0.22)">
                <FiCpu />
              </TrackIconBox>
              <TrackContent>
                <TrackTopRow>
                  <TrackTitle>Gen AI Readiness</TrackTitle>
                  <span
                    onClick={(e) => { e.stopPropagation(); handleTrySampleGenAI(); }}
                    style={{ fontSize: '0.64rem', fontWeight: 700, padding: '2px 6px', borderRadius: '5px', background: '#f5f3ff', color: '#6d28d9', border: '1px solid #ddd6fe', cursor: 'pointer', flexShrink: 0 }}
                    title="Open pre-seeded GenAI Readiness Report"
                  >
                    📊 Sample Report
                  </span>
                </TrackTopRow>
                <TrackSubtitle>Prompt engineering, vector RAG & guardrails • 30 Qs</TrackSubtitle>
              </TrackContent>
            </MegaMenuTrackItem>

            {/* Track 3: EU AI Act Compliance */}
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

            {/* Promoted Dynamic Assessment Tracks */}
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
                onClick={() => handleNavigate('/assessments/custom-hub')}
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

              {/* 2. Portfolio & Analytics Dropdown (5 Distinct MECE Views) */}
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
                    handleNavigate('/insights-dashboard');
                    setPortfolioDropdownOpen(false);
                  }}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                >
                  Portfolio
                  <FiChevronDown size={13} style={{ transform: portfolioDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </NavLink>
                <DropdownMenu $isOpen={portfolioDropdownOpen} style={{ minWidth: '310px', left: 0, right: 'auto', padding: '10px 0' }}>
                  <DropdownHeader>📊 Executive Analytics & Benchmarks</DropdownHeader>
                  <DropdownItem onClick={() => { handleNavigate('/insights-dashboard'); setPortfolioDropdownOpen(false); }}>
                    <FiTrendingUp style={{ color: '#10b981' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                      <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.84rem' }}>Executive Portfolio Dashboard</span>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Multi-organization maturity & ROI telemetry</span>
                    </div>
                  </DropdownItem>
                  <DropdownItem onClick={() => { handleNavigate('/executive-dashboard'); setPortfolioDropdownOpen(false); }}>
                    <FiAward style={{ color: '#4f46e5' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                      <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.84rem' }}>C-Suite Command Center</span>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Board readiness & strategic decision cockpit</span>
                    </div>
                  </DropdownItem>
                  <DropdownItem onClick={() => { handleNavigate('/assessments/compare'); setPortfolioDropdownOpen(false); }}>
                    <FiBarChart2 style={{ color: '#2563eb' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                      <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.84rem' }}>Side-by-Side Comparison</span>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Compare baseline vs target horizon or reassessments</span>
                    </div>
                  </DropdownItem>
                  <DropdownItem onClick={() => { handleNavigate('/industry-benchmarks'); setPortfolioDropdownOpen(false); }}>
                    <FiDatabase style={{ color: '#0ea5e9' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                      <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.84rem' }}>Industry Peer Benchmarks</span>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Cross-industry percentile cohort rankings</span>
                    </div>
                  </DropdownItem>

                  <DropdownDivider />
                  <DropdownHeader>🗂️ Evaluation Directory</DropdownHeader>
                  <DropdownItem onClick={() => { handleNavigate('/assessments'); setPortfolioDropdownOpen(false); }}>
                    <FiList style={{ color: '#0d9488' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                      <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.84rem' }}>Assessment Directory & History</span>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Browse, filter & manage all completed evaluations</span>
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
                  <DropdownItem onClick={() => { handleNavigate('/tco-calculator'); setResourcesDropdownOpen(false); }}>
                    <FiTrendingUp style={{ color: '#059669' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                      <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.84rem' }}>TCO & Cloud Economics Modeler</span>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>3-year total cost of ownership & slot arbitrage</span>
                    </div>
                  </DropdownItem>
                  <DropdownItem onClick={() => { handleNavigate('/roi-calculator'); setResourcesDropdownOpen(false); }}>
                    <FiAward style={{ color: '#2563eb' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                      <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.84rem' }}>ROI & Value Realization Modeler</span>
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

                {/* Assignments Dropdown (Admin/Author only) with Hover Trigger */}
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
                      Assignments
                      <FiChevronDown size={14} className="chevron" />
                    </DropdownButton>
                    <DropdownMenu $isOpen={assignmentsDropdownOpen}>
                      <DropdownItem onClick={() => {
                        navigate('/my-assignments');
                        setAssignmentsDropdownOpen(false);
                      }}>
                        <FiFileText />
                        View Assignments
                      </DropdownItem>
                      <DropdownItem onClick={() => {
                        navigate('/assign-assessment');
                        setAssignmentsDropdownOpen(false);
                      }}>
                        <FiUserPlus />
                        Assign Users
                      </DropdownItem>
                      {currentUser.role === 'admin' && (
                        <>
                          <DropdownItem onClick={() => {
                            navigate('/question-assignments');
                            setAssignmentsDropdownOpen(false);
                          }}>
                            <FiFileText />
                            Assign Questions
                          </DropdownItem>
                          <DropdownItem onClick={() => {
                            navigate('/user-management');
                            setAssignmentsDropdownOpen(false);
                          }}>
                            <FiUsers />
                            Manage Users
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
                  setAdminDropdownOpen(false);
                  
                }}>
                      <FiLock />
                      Change Password
                    </DropdownItem>
                    <DropdownDivider />
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
        <MobileNavLink onClick={() => handleNavigate('/deep-dive')}>Deep Dive</MobileNavLink>
        <MobileNavLink onClick={() => handleNavigate('/pitch-deck')}>Pitch Deck</MobileNavLink>
        <MobileNavLink onClick={() => handleNavigate('/user-guide')}>User Guide</MobileNavLink>
        <MobileNavLink onClick={() => handleNavigate('/workflow-walkthrough')}>Workflow Demo</MobileNavLink>
        
        {currentUser ? (
          <>
            <MobileSecondaryCTAButton onClick={() => handleNavigate('/assessments/custom-hub')}>
              <FiLayers size={16} style={{ color: '#818cf8' }} />
              Assessment Catalog & Templates
            </MobileSecondaryCTAButton>
            <MobileSecondaryCTAButton onClick={() => handleNavigate('/assessments/ai-generator')}>
              <HiSparkles size={16} style={{ color: '#c084fc' }} />
              AI Assessment Generator
            </MobileSecondaryCTAButton>
            <MobileSecondaryCTAButton onClick={() => handleNavigate('/my-assessments')}>
              <FiFileText size={16} />
              My Assessments
            </MobileSecondaryCTAButton>
            <MobileSecondaryCTAButton onClick={() => handleNavigate('/genai-readiness')}>
              <FiCpu size={16} />
              Gen AI Readiness
            </MobileSecondaryCTAButton>
            <MobileSecondaryCTAButton onClick={() => handleNavigate('/eu-ai-compliance')}>
              <FiShield size={16} style={{ color: '#059669' }} />
              EU AI Compliance Engine
            </MobileSecondaryCTAButton>
            {currentUser.role !== 'consumer' && (
              <>
                <MobileSecondaryCTAButton onClick={() => handleNavigate('/insights-dashboard')}>
                  Dashboard
                </MobileSecondaryCTAButton>
                <MobileSecondaryCTAButton onClick={() => setMobileTrySampleOpen(!mobileTrySampleOpen)}>
                  <FiPlay size={16} />
                  Try Sample Assessments
                  <FiChevronDown size={14} style={{ marginLeft: 'auto' }} />
                </MobileSecondaryCTAButton>
                {mobileTrySampleOpen && (
                  <div style={{ background: '#f8fafc', padding: '8px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <MobileSubLink onClick={handleTrySampleCore}>• Enterprise Data & AI Maturity (ConnectPlus)</MobileSubLink>
                    <MobileSubLink onClick={handleTrySampleGenAI}>• Gen AI Readiness (Global Retail)</MobileSubLink>
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
              <MobileSecondaryCTAButton onClick={() => handleNavigate('/my-assignments')}>
                <FiFileText size={16} />
                View Assignments
              </MobileSecondaryCTAButton>
            )}
            {currentUser.role === 'admin' && (
              <>
                <MobileSecondaryCTAButton onClick={() => handleNavigate('/question-assignments')}>
                  <FiFileText size={16} />
                  Assign Questions
                </MobileSecondaryCTAButton>
                <MobileSecondaryCTAButton onClick={() => handleNavigate('/user-management')}>
                  <FiUsers size={16} />
                  Manage Assignments
                </MobileSecondaryCTAButton>
              </>
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
              handleExploreAsGuest('/dashboard');
            }}>
              Dashboard
            </MobileSecondaryCTAButton>
            <MobileSecondaryCTAButton onClick={() => setMobileTrySampleOpen(!mobileTrySampleOpen)}>
              <FiPlay size={16} />
              Try Sample Assessments
              <FiChevronDown size={14} style={{ marginLeft: 'auto' }} />
            </MobileSecondaryCTAButton>
            {mobileTrySampleOpen && (
              <div style={{ background: '#f8fafc', padding: '8px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <MobileSubLink onClick={handleTrySampleCore}>• Enterprise Data & AI Maturity (ConnectPlus)</MobileSubLink>
                <MobileSubLink onClick={handleTrySampleGenAI}>• Gen AI Readiness (Global Retail)</MobileSubLink>
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

