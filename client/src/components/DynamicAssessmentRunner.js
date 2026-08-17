import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiArrowLeft, 
  FiArrowRight, 
  FiCheckCircle, 
  FiSave, 
  FiClock, 
  FiUser, 
  FiAlertTriangle, 
  FiFileText,
  FiAward,
  FiChevronRight,
  FiChevronDown,
  FiEdit3,
  FiLayers,
  FiMenu,
  FiX,
  FiZap
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import toast from 'react-hot-toast';
import dynamicAssessmentService from '../services/dynamicAssessmentService';
import LoadingSpinner from './LoadingSpinner';

const PrefillButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(168, 85, 247, 0.12));
  color: #6366f1;
  border: 1.5px solid rgba(99, 102, 241, 0.35);
  border-radius: 10px;
  padding: 8px 16px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: linear-gradient(135deg, #6366f1, #a855f7);
    color: white;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
  }

  svg {
    font-size: 1rem;
    color: currentColor;
  }
`;

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  overflow: hidden;
  padding-top: 68px; /* Fixed GlobalNav offset */
  position: relative;
`;

/* =========================================================
   SIDEBAR NAVIGATION PANEL (DESKTOP + MOBILE DRAWER)
   ========================================================= */
const DesktopSidebar = styled.aside`
  width: 340px;
  background: white;
  border-right: 1px solid #e5e7eb;
  height: calc(100vh - 68px);
  position: fixed;
  left: 0;
  top: 68px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.05);
  z-index: 50;

  @media (max-width: 1024px) {
    display: none;
  }
`;

const MobileDrawerOverlay = styled(motion.div)`
  display: none;

  @media (max-width: 1024px) {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(15, 23, 42, 0.6);
    backdrop-filter: blur(4px);
    z-index: 1100;
  }
`;

const MobileDrawerContent = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 320px;
  max-width: 85vw;
  background: white;
  z-index: 1101;
  display: flex;
  flex-direction: column;
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.25);
  overflow-y: auto;
`;

const DrawerCloseHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px;
  border-bottom: 1px solid #f1f5f9;
`;

const DrawerCloseButton = styled.button`
  background: #f1f5f9;
  border: none;
  border-radius: 8px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #475569;
  cursor: pointer;

  &:hover {
    background: #e2e8f0;
    color: #1e293b;
  }
`;

const SidebarHeader = styled.div`
  padding: 24px 20px 16px;
  border-bottom: 1px solid #f1f5f9;
`;

const OrgTitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
`;

const OrgName = styled.h2`
  font-size: 1.15rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 210px;
`;

const OrgMeta = styled.div`
  font-size: 0.825rem;
  color: #64748b;
`;

const SidebarNavList = styled.div`
  flex: 1;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const DimensionNavItem = styled.div`
  border-radius: 10px;
  background: ${props => props.$active ? '#f8fafc' : 'transparent'};
  border: 1px solid ${props => props.$active ? '#e2e8f0' : 'transparent'};
  overflow: hidden;
  transition: all 0.2s ease;
`;

const DimensionNavHeader = styled.button`
  width: 100%;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
  min-height: 48px;

  &:hover {
    background: #f8fafc;
  }
`;

const DimNavLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 0;
`;

const StatusDot = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${props => props.$completed ? '#10b981' : '#e2e8f0'};
  color: ${props => props.$completed ? '#ffffff' : '#64748b'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  flex-shrink: 0;
`;

const DimNavName = styled.div`
  font-size: 0.9rem;
  font-weight: ${props => props.$active ? '700' : '600'};
  color: ${props => props.$active ? '#ff6b35' : '#334155'};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const QuestionsSubList = styled.div`
  padding: 4px 12px 12px 42px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const QuestionSubItem = styled.button`
  background: ${props => props.$active ? '#ffefe9' : 'transparent'};
  color: ${props => props.$active ? '#ff6b35' : '#64748b'};
  font-weight: ${props => props.$active ? '700' : '500'};
  border: none;
  border-radius: 6px;
  padding: 8px 10px;
  font-size: 0.8rem;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  min-height: 36px;

  &:hover {
    background: #f1f5f9;
    color: #1e293b;
  }
`;

/* =========================================================
   MAIN CONTENT AREA
   ========================================================= */
const MainContentWrapper = styled.main`
  flex: 1;
  margin-left: 340px;
  height: calc(100vh - 68px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  width: calc(100% - 340px);

  @media (max-width: 1024px) {
    margin-left: 0;
    width: 100%;
  }
`;

const ScrollableBody = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 24px 32px 140px;
  -webkit-overflow-scrolling: touch;

  @media (max-width: 1024px) {
    padding: 20px 20px 150px;
  }

  @media (max-width: 640px) {
    padding: 14px 12px 160px;
  }
`;

/* Progress & Header Bar */
const TopHeaderBar = styled.div`
  background: white;
  border-radius: 16px;
  padding: 18px 24px;
  margin-bottom: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;

  @media (max-width: 768px) {
    padding: 14px 16px;
    gap: 12px;
  }
`;

const HeaderTitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  flex: 1;
  min-width: 240px;
`;

const DimensionIconCircle = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: ${props => props.$color ? `linear-gradient(135deg, ${props.$color} 0%, #4f46e5 100%)` : 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)'};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  box-shadow: ${props => props.$color ? `0 4px 12px ${props.$color}40` : '0 4px 12px rgba(255, 107, 53, 0.3)'};
  flex-shrink: 0;

  @media (max-width: 640px) {
    width: 36px;
    height: 36px;
    font-size: 1.1rem;
  }
`;

const DimensionHeading = styled.h1`
  font-size: 1.35rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 2px 0;

  @media (max-width: 640px) {
    font-size: 1.15rem;
  }
`;

const DimensionSubHeading = styled.p`
  font-size: 0.825rem;
  color: #64748b;
  margin: 0;
  line-height: 1.3;
`;

const MobileDimensionDrawerButton = styled.button`
  display: none;

  @media (max-width: 1024px) {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #ffefe9;
    color: #ff6b35;
    border: 1px solid #ffcca3;
    padding: 8px 14px;
    border-radius: 8px;
    font-weight: 700;
    font-size: 0.85rem;
    cursor: pointer;
  }
`;

const TopNavFilters = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  width: 100%;
  justify-content: space-between;

  @media (min-width: 769px) {
    width: auto;
    justify-content: flex-end;
  }
`;

const FilterPillGroup = styled.div`
  display: flex;
  background: #f1f5f9;
  padding: 4px;
  border-radius: 10px;
  gap: 4px;
`;

const FilterPill = styled.button`
  background: ${props => props.$active ? '#ffffff' : 'transparent'};
  color: ${props => props.$active ? '#1e293b' : '#64748b'};
  box-shadow: ${props => props.$active ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'};
  font-weight: 600;
  font-size: 0.8rem;
  padding: 6px 12px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
`;

const QuestionNumberScrollWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  overflow-x: auto;
  max-width: 100%;
  padding-bottom: 2px;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const QuestionCircle = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => {
    if (props.$current) return '#ff6b35';
    if (props.$answered) return '#10b981';
    return '#f1f5f9';
  }};
  color: ${props => (props.$current || props.$answered) ? '#ffffff' : '#64748b'};
  border: 2px solid ${props => props.$current ? '#ff6b35' : 'transparent'};
  font-weight: 700;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    transform: scale(1.1);
  }
`;

const AutoSaveBadge = styled.div`
  font-size: 0.8rem;
  font-weight: 600;
  color: #10b981;
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

/* =========================================================
   QUESTION CARD WITH RESPONSIVE 5-COLUMN PERSPECTIVES GRID
   ========================================================= */
const QuestionContainerCard = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 32px 28px;
  margin-bottom: 24px;
  box-shadow: 0 6px 30px rgba(0, 0, 0, 0.06);

  @media (max-width: 768px) {
    padding: 20px 16px;
    border-radius: 16px;
  }
`;

const QuestionTitleArea = styled.div`
  text-align: center;
  max-width: 900px;
  margin: 0 auto 28px;

  @media (max-width: 768px) {
    text-align: left;
    margin-bottom: 20px;
  }
`;

const QuestionNumberTag = styled.div`
  font-size: 0.85rem;
  font-weight: 700;
  color: #ff6b35;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 8px;
`;

const QuestionPromptText = styled.h2`
  font-size: 1.35rem;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.4;
  margin-bottom: 12px;

  @media (max-width: 640px) {
    font-size: 1.15rem;
  }
`;

const QuestionGuidance = styled.div`
  font-size: 0.875rem;
  color: #64748b;
  background: #f8fafc;
  border-left: 3px solid #ff6b35;
  padding: 10px 14px;
  border-radius: 6px;
  display: inline-block;
  text-align: left;
  line-height: 1.45;
`;

/* Responsive Multi-Viewport Grid */
const PerspectivesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 1400px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
  }

  @media (max-width: 992px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const PerspectiveColumn = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const PerspectiveHeader = styled.div`
  font-size: 0.925rem;
  font-weight: 700;
  color: #1e293b;
  text-align: center;
  padding: 10px 12px;
  background: #f8fafc;
  border-radius: 10px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: 1px solid #f1f5f9;
`;

const OptionsStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
`;

const MaturityOptionCard = styled.button`
  background: ${props => props.$selected ? '#fff7ed' : '#ffffff'};
  border: 2px solid ${props => props.$selected ? '#ff6b35' : '#e2e8f0'};
  border-radius: 12px;
  padding: 12px 12px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-height: 48px;
  box-shadow: ${props => props.$selected ? '0 4px 12px rgba(255, 107, 53, 0.15)' : 'none'};

  &:hover {
    border-color: #ff6b35;
    background: #fffaf5;
  }
`;

const OptionStageTag = styled.span`
  font-size: 0.725rem;
  font-weight: 800;
  color: ${props => props.$selected ? '#ff6b35' : '#64748b'};
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const OptionText = styled.span`
  font-size: 0.825rem;
  line-height: 1.4;
  color: ${props => props.$selected ? '#1e293b' : '#475569'};
  font-weight: ${props => props.$selected ? '600' : '400'};
`;

/* Checkbox Cards */
const PainCheckboxCard = styled.label`
  background: ${props => props.$checked ? '#fef2f2' : '#ffffff'};
  border: 1.5px solid ${props => props.$checked ? '#ef4444' : '#e2e8f0'};
  border-radius: 10px;
  padding: 10px 12px;
  margin-bottom: 8px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 44px;

  input {
    margin-top: 3px;
    accent-color: #ef4444;
    cursor: pointer;
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }

  span {
    font-size: 0.825rem;
    color: ${props => props.$checked ? '#991b1b' : '#334155'};
    line-height: 1.35;
    font-weight: ${props => props.$checked ? '600' : '400'};
  }

  &:hover {
    border-color: #ef4444;
  }
`;

/* Notes Textarea */
const NotesArea = styled.textarea`
  width: 100%;
  flex: 1;
  min-height: 220px;
  border: 1.5px solid #cbd5e1;
  border-radius: 12px;
  padding: 12px;
  font-family: inherit;
  font-size: 0.875rem;
  color: #1e293b;
  line-height: 1.5;
  resize: vertical;
  background: #ffffff;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #ff6b35;
    box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.15);
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

/* =========================================================
   BOTTOM STICKY ACTION BAR
   ========================================================= */
const StickyBottomBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid #e2e8f0;
  padding: 14px 28px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 40;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.05);

  @media (max-width: 640px) {
    padding: 12px 16px;
  }
`;

const NavActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  min-height: 44px;

  @media (max-width: 640px) {
    padding: 10px 14px;
    font-size: 0.85rem;
  }
`;

const BackButton = styled(NavActionButton)`
  background: #f1f5f9;
  color: #475569;

  &:hover {
    background: #e2e8f0;
    color: #1e293b;
  }
`;

const NextButton = styled(NavActionButton)`
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
  color: white;
  box-shadow: 0 4px 14px rgba(255, 107, 53, 0.35);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 107, 53, 0.5);
  }
`;

const CompleteReportButton = styled(NavActionButton)`
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.5);
  }
`;

const DynamicAssessmentRunner = () => {
  const { id, typeKey } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [instance, setInstance] = useState(null);
  const [framework, setFramework] = useState(null);
  const [responses, setResponses] = useState({});
  const [activeDimIdx, setActiveDimIdx] = useState(0);
  const [activeQIdx, setActiveQIdx] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedStatus, setSavedStatus] = useState('saved');
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, [id, typeKey]);

  const loadData = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      if (id) {
        const inst = await dynamicAssessmentService.getInstance(id);
        if (inst && inst.frameworkSnapshot && inst.frameworkSnapshot.dimensions) {
          setInstance(inst);
          setFramework(inst.frameworkSnapshot);
          setResponses(inst.responses || {});
        } else {
          setLoadError('Assessment session was not found or has expired.');
        }
      } else if (typeKey) {
        const type = await dynamicAssessmentService.getAssessmentTypeByKey(typeKey);
        if (type && type.framework && type.framework.dimensions) {
          setFramework(type.framework);
          // Auto-provision an active instance for this run session
          try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const newInst = await dynamicAssessmentService.createInstance({
              typeKey: type.typeKey || typeKey,
              customerName: user.organization || 'Enterprise Organization',
              useCase: type.title || 'Enterprise Architecture Modernization',
              frameworkSnapshot: type.framework,
              responses: {}
            });
            if (newInst) {
              setInstance(newInst);
            }
          } catch (createErr) {
            console.warn('Instance auto-provisioning deferred to submission:', createErr);
          }
        } else {
          setLoadError(`Assessment template "${typeKey}" was not found.`);
        }
      }
    } catch (err) {
      console.error(err);
      setLoadError(err.response?.data?.error || 'Failed to load assessment data. The session may have expired.');
    } finally {
      setLoading(false);
    }
  };

  const debounceTimerRef = useRef(null);

  // Clean up debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const performAutoSave = useCallback(async (updatedResponses) => {
    if (!instance?.id) return;
    setSavedStatus('saving');
    try {
      await dynamicAssessmentService.updateInstance(instance.id, {
        responses: updatedResponses
      });
      setSavedStatus('saved');
    } catch (err) {
      console.warn('Autosave error:', err);
      setSavedStatus('saved');
    }
  }, [instance]);

  const debouncedAutoSave = useCallback((updatedResponses) => {
    setSavedStatus('saving');
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      performAutoSave(updatedResponses);
    }, 450);
  }, [performAutoSave]);

  const handleSelectCurrentState = (qId, score) => {
    const updated = {
      ...responses,
      [qId]: score,
      [`${qId}_current_state`]: score
    };
    setResponses(updated);
    performAutoSave(updated);
  };

  const handleSelectFutureState = (qId, score) => {
    const updated = {
      ...responses,
      [`${qId}_future_state`]: score
    };
    setResponses(updated);
    performAutoSave(updated);
  };

  const handleToggleTechnicalPain = (qId, pain) => {
    const key = `${qId}_technical_pain`;
    const current = responses[key] || [];
    const updatedList = current.includes(pain)
      ? current.filter(p => p !== pain)
      : [...current, pain];

    const updated = {
      ...responses,
      [key]: updatedList,
      [`${qId}_pain_points`]: updatedList
    };
    setResponses(updated);
    performAutoSave(updated);
  };

  const handleToggleBusinessPain = (qId, pain) => {
    const key = `${qId}_business_pain`;
    const current = responses[key] || [];
    const updatedList = current.includes(pain)
      ? current.filter(p => p !== pain)
      : [...current, pain];

    const updated = {
      ...responses,
      [key]: updatedList
    };
    setResponses(updated);
    performAutoSave(updated);
  };

  const handleNotesChange = (qId, text) => {
    const updated = {
      ...responses,
      [`${qId}_comment`]: text
    };
    setResponses(updated);
    debouncedAutoSave(updated);
  };

  const handleAutoPrefillAll = async () => {
    if (!framework || !framework.dimensions) return;

    // 4 Diverse Enterprise Archetype Profiles for realistic, varied prefilling
    const enterpriseProfiles = [
      {
        name: 'Legacy Modernization Journey',
        baseMin: 1,
        baseMax: 3,
        targetOffset: 2,
        painPointIntensity: 2
      },
      {
        name: 'Active Cloud Transformation',
        baseMin: 2,
        baseMax: 4,
        targetOffset: 2,
        painPointIntensity: 1
      },
      {
        name: 'Security & Governance Priority',
        baseMin: 2,
        baseMax: 4,
        targetOffset: 1,
        painPointIntensity: 2
      },
      {
        name: 'Scaling Optimization & AI Mesh',
        baseMin: 3,
        baseMax: 5,
        targetOffset: 1,
        painPointIntensity: 1
      }
    ];

    // Pick a randomized profile each time prefill is clicked
    const profile = enterpriseProfiles[Math.floor(Math.random() * enterpriseProfiles.length)];
    const seed = Date.now();

    const sampleComments = [
      'Current setup relies on manual pipelines and partial scripting with high operational overhead.',
      'Architecture modernization initiative approved by leadership for current fiscal year.',
      'Team is evaluating Google Cloud Vertex AI & Gemini Enterprise for prompt caching and long-context reasoning.',
      'Security and compliance standards require automated VPC Service Controls and Customer-Managed Encryption Keys (CMEK).',
      'Active cross-functional initiative underway to unify metadata, governance, and CI/CD deployment pipelines.',
      'FinOps team flagged unpredictable monthly spend; implementing BigQuery Editions slot reservations.',
      'Production workload undergoing active migration; focusing on real-time CDC and sub-second query latency.',
      'CISO signed off on Zero-Trust AI Gateway architecture to unblock enterprise-wide production rollout.'
    ];

    const prefilled = { ...responses };

    framework.dimensions.forEach((dim, dIdx) => {
      // Natural dimension variance based on seed
      const dimVariance = ((seed + dIdx * 7) % 3) - 1; // -1, 0, or 1

      (dim.questions || []).forEach((q, qIdx) => {
        // Compute logically consistent score tailored to the chosen profile
        const range = Math.max(1, profile.baseMax - profile.baseMin + 1);
        const rawScore = profile.baseMin + Math.abs((seed + dIdx * 11 + qIdx * 13) % range) + dimVariance;
        const score = Math.max(1, Math.min(5, rawScore));
        const futureScore = Math.min(5, Math.max(score + 1, score + profile.targetOffset));

        prefilled[q.id] = score;
        prefilled[`${q.id}_current_state`] = score;
        prefilled[`${q.id}_future_state`] = futureScore;

        // Select 1 to 2 distinct pain points dynamically
        if (q.technicalPainPoints && q.technicalPainPoints.length > 0) {
          const tpIdx = (seed + qIdx + dIdx) % q.technicalPainPoints.length;
          const selectedTP = [q.technicalPainPoints[tpIdx]];
          if (profile.painPointIntensity > 1 && q.technicalPainPoints.length > 1) {
            selectedTP.push(q.technicalPainPoints[(tpIdx + 1) % q.technicalPainPoints.length]);
          }
          prefilled[`${q.id}_technical_pain`] = selectedTP;
          prefilled[`${q.id}_pain_points`] = selectedTP;
        }

        if (q.businessPainPoints && q.businessPainPoints.length > 0) {
          const bpIdx = (seed + qIdx * 2 + dIdx) % q.businessPainPoints.length;
          const selectedBP = [q.businessPainPoints[bpIdx]];
          if (profile.painPointIntensity > 1 && q.businessPainPoints.length > 1) {
            selectedBP.push(q.businessPainPoints[(bpIdx + 1) % q.businessPainPoints.length]);
          }
          prefilled[`${q.id}_business_pain`] = selectedBP;
        }

        const commentIdx = (seed + dIdx * 3 + qIdx) % sampleComments.length;
        prefilled[`${q.id}_comment`] = sampleComments[commentIdx];
      });
    });

    setResponses(prefilled);
    toast.success(`✨ Prefilled with realistic '${profile.name}' enterprise responses & pain points!`);

    if (instance?.id) {
      await dynamicAssessmentService.updateInstance(instance.id, {
        responses: prefilled
      });
      setSavedStatus('saved');
    }
  };

  const handleFinishAndGenerateReport = async () => {
    setIsSubmitting(true);
    try {
      toast.loading('Generating executive report with Gemini 3.7...', { id: 'report-gen' });
      
      let targetInstance = instance;
      if (!targetInstance?.id) {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        targetInstance = await dynamicAssessmentService.createInstance({
          typeKey: typeKey || framework?.typeKey || 'custom',
          customerName: user.organization || 'Enterprise Organization',
          useCase: framework?.title || 'Enterprise Architecture Modernization',
          frameworkSnapshot: framework,
          responses: responses
        });
        if (targetInstance) {
          setInstance(targetInstance);
        }
      } else {
        await dynamicAssessmentService.updateInstance(targetInstance.id, {
          responses,
          status: 'completed'
        });
      }

      if (!targetInstance?.id) {
        throw new Error('Could not initialize assessment session');
      }

      const reportResult = await dynamicAssessmentService.generateReport(targetInstance.id);
      if (reportResult && (reportResult.success || reportResult.report || reportResult.aiReport)) {
        toast.success('Executive report generated successfully!', { id: 'report-gen' });
        navigate(`/assessments/report/${targetInstance.id}`);
      } else {
        throw new Error(reportResult?.error || 'Failed to generate report');
      }
    } catch (err) {
      console.error('Error generating executive report:', err);
      toast.error(err.response?.data?.error || err.message || 'Failed to generate report', { id: 'report-gen' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !framework) {
    return <LoadingSpinner message="Loading assessment framework..." />;
  }

  const dimensions = framework.dimensions || [];
  const currentDim = dimensions[activeDimIdx] || dimensions[0];
  const questions = currentDim.questions || [];
  const currentQ = questions[activeQIdx] || questions[0];

  const totalQuestions = dimensions.reduce((sum, d) => sum + (d.questions?.length || 0), 0);
  const totalAnswered = Object.keys(responses).filter(k => !k.includes('_')).length;

  const isCurrentQAnswered = (qId) => responses[qId] !== undefined;

  const nextQuestion = () => {
    if (activeQIdx < questions.length - 1) {
      setActiveQIdx(prev => prev + 1);
    } else if (activeDimIdx < dimensions.length - 1) {
      setActiveDimIdx(prev => prev + 1);
      setActiveQIdx(0);
    }
  };

  const prevQuestion = () => {
    if (activeQIdx > 0) {
      setActiveQIdx(prev => prev - 1);
    } else if (activeDimIdx > 0) {
      setActiveDimIdx(prev => prev - 1);
      const prevDimQuestions = dimensions[activeDimIdx - 1]?.questions || [];
      setActiveQIdx(Math.max(0, prevDimQuestions.length - 1));
    }
  };

  const isLastQuestion = activeDimIdx === dimensions.length - 1 && activeQIdx === questions.length - 1;

  const renderNavContent = () => (
    <>
      <SidebarHeader>
        <OrgTitleRow>
          <OrgName title={instance?.customerName || 'Organization'}>
            {instance?.customerName || 'Assessment'}
          </OrgName>
          <span style={{ fontSize: '0.75rem', background: '#e0f2fe', color: '#0369a1', padding: '3px 8px', borderRadius: '12px', fontWeight: '700' }}>
            {Math.round((totalAnswered / Math.max(1, totalQuestions)) * 100)}%
          </span>
        </OrgTitleRow>
        <OrgMeta>
          {dimensions.length} dimensions • {totalAnswered} of {totalQuestions} completed
        </OrgMeta>
      </SidebarHeader>

      <SidebarNavList>
        {dimensions.map((dim, dIdx) => {
          const dimQuestions = dim.questions || [];
          const dimAnswered = dimQuestions.filter(q => responses[q.id] !== undefined).length;
          const isCompleted = dimAnswered === dimQuestions.length && dimQuestions.length > 0;
          const isDimActive = dIdx === activeDimIdx;

          return (
            <DimensionNavItem key={dim.id || dIdx} $active={isDimActive}>
              <DimensionNavHeader onClick={() => {
                setActiveDimIdx(dIdx);
                setActiveQIdx(0);
                setIsMobileDrawerOpen(false);
              }}>
                <DimNavLeft>
                  <StatusDot $completed={isCompleted}>
                    {isCompleted ? '✓' : `${dimAnswered}/${dimQuestions.length}`}
                  </StatusDot>
                  <DimNavName $active={isDimActive}>{dim.name}</DimNavName>
                </DimNavLeft>
                {isDimActive ? <FiChevronDown color="#ff6b35" /> : <FiChevronRight color="#94a3b8" />}
              </DimensionNavHeader>

              {isDimActive && (
                <QuestionsSubList>
                  {dimQuestions.map((q, qSubIdx) => {
                    const isQActive = qSubIdx === activeQIdx;
                    const isQAnswered = responses[q.id] !== undefined;

                    return (
                      <QuestionSubItem
                        key={q.id || qSubIdx}
                        $active={isQActive}
                        onClick={() => {
                          setActiveQIdx(qSubIdx);
                          setIsMobileDrawerOpen(false);
                        }}
                      >
                        <span style={{ color: isQAnswered ? '#10b981' : '#94a3b8' }}>
                          {isQAnswered ? '●' : '○'}
                        </span>
                        <span>Q{qSubIdx + 1}: {q.text.substring(0, 24)}...</span>
                      </QuestionSubItem>
                    );
                  })}
                </QuestionsSubList>
              )}
            </DimensionNavItem>
          );
        })}
      </SidebarNavList>
    </>
  );

  if (loading) {
    return <LoadingSpinner message="Loading assessment questions..." />;
  }

  if (loadError || !framework || !framework.dimensions || framework.dimensions.length === 0) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #0b0f19 0%, #111827 50%, #171b30 100%)', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: '100px 20px 60px',
        boxSizing: 'border-box'
      }}>
        <div style={{ 
          maxWidth: '680px', 
          width: '100%', 
          background: 'rgba(30, 41, 59, 0.7)', 
          border: '1px solid rgba(255,255,255,0.1)', 
          borderRadius: '24px', 
          padding: '40px 32px', 
          textAlign: 'center', 
          backdropFilter: 'blur(16px)', 
          boxShadow: '0 20px 50px rgba(0,0,0,0.4)' 
        }}>
          <div style={{ 
            width: '64px', 
            height: '64px', 
            borderRadius: '18px', 
            background: 'rgba(239, 68, 68, 0.15)', 
            border: '1.5px solid rgba(239, 68, 68, 0.4)', 
            color: '#f87171', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 20px', 
            fontSize: '2rem' 
          }}>
            <FiAlertTriangle />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#ffffff', marginBottom: '12px' }}>
            Assessment Session Not Found
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '28px' }}>
            {loadError || 'This assessment session is no longer available or was run in a previous session.'}
            <br />
            Select one of the production frameworks below or start a new AI assessment.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px', textAlign: 'left' }}>
            <button 
              onClick={() => navigate('/assessments/run/finops_cloud_cost_optimization')}
              style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '16px', color: '#ffffff', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '4px' }}
            >
              <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#38bdf8' }}>💰 FinOps Optimization</span>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>5 Dims • 10 Questions</span>
            </button>
            <button 
              onClick={() => navigate('/assessments/run/openai_to_gemini_enterprise_migration')}
              style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '16px', color: '#ffffff', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '4px' }}
            >
              <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#a855f7' }}>🤖 OpenAI to Gemini</span>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>5 Dims • 10 Questions</span>
            </button>
            <button 
              onClick={() => navigate('/assessments/run/cloud_security_zero_trust_architecture')}
              style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '16px', color: '#ffffff', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '4px' }}
            >
              <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#34d399' }}>🔒 Cloud Security & Zero Trust</span>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>5 Dims • 10 Questions</span>
            </button>
            <button 
              onClick={() => navigate('/assessments/ai-generator')}
              style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '16px', color: '#ffffff', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '4px' }}
            >
              <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#f59e0b' }}>✨ AI Generator (Prompt)</span>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Custom 3-Tier Depth</span>
            </button>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              onClick={() => navigate('/assessments')}
              style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: '#ffffff', border: 'none', borderRadius: '12px', padding: '12px 24px', fontWeight: 700, cursor: 'pointer' }}
            >
              View All Assessments Hub
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Container>
      {/* 1. DESKTOP LEFT SIDEBAR */}
      <DesktopSidebar>
        {renderNavContent()}
      </DesktopSidebar>

      {/* 2. MOBILE / TABLET SLIDE-OVER DRAWER */}
      <AnimatePresence>
        {isMobileDrawerOpen && (
          <>
            <MobileDrawerOverlay 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileDrawerOpen(false)}
            />
            <MobileDrawerContent
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <DrawerCloseHeader>
                <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '1rem' }}>
                  Assessment Dimensions
                </div>
                <DrawerCloseButton onClick={() => setIsMobileDrawerOpen(false)}>
                  <FiX size={18} />
                </DrawerCloseButton>
              </DrawerCloseHeader>
              {renderNavContent()}
            </MobileDrawerContent>
          </>
        )}
      </AnimatePresence>

      {/* 3. MAIN CONTENT WRAPPER */}
      <MainContentWrapper>
        <ScrollableBody>
          {/* Top Progress & Header Bar */}
          <TopHeaderBar>
            <HeaderTitleGroup>
              <DimensionIconCircle $color={framework?.color}>
                <FiAward />
              </DimensionIconCircle>
              <div>
                <DimensionHeading>{currentDim.name}</DimensionHeading>
                <DimensionSubHeading>{currentDim.description}</DimensionSubHeading>
              </div>
            </HeaderTitleGroup>

            <MobileDimensionDrawerButton onClick={() => setIsMobileDrawerOpen(true)}>
              <FiLayers /> Dimensions ({activeDimIdx + 1}/{dimensions.length})
            </MobileDimensionDrawerButton>

            <TopNavFilters>
              <PrefillButton onClick={handleAutoPrefillAll} title="Autopopulate all questions with realistic responses & pain points">
                <FiZap /> Auto-Prefill Responses
              </PrefillButton>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <div style={{
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  padding: '5px 12px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  color: '#475569',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span>Dimension {activeDimIdx + 1} of {dimensions.length}:</span>
                  <strong style={{ color: '#0f172a' }}>{questions.filter(q => responses[q.id] !== undefined).length} of {questions.length} Qs</strong>
                </div>

                <div style={{
                  background: totalAnswered === totalQuestions ? 'rgba(16, 185, 129, 0.12)' : '#eff6ff',
                  border: totalAnswered === totalQuestions ? '1px solid #10b981' : '1px solid #bfdbfe',
                  borderRadius: '8px',
                  padding: '5px 12px',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  color: totalAnswered === totalQuestions ? '#059669' : '#2563eb'
                }}>
                  Overall: {totalAnswered}/{totalQuestions} Total ({Math.round((totalAnswered / Math.max(1, totalQuestions)) * 100)}%)
                </div>
              </div>

              <QuestionNumberScrollWrap>
                {questions.map((q, idx) => (
                  <QuestionCircle
                    key={q.id || idx}
                    $current={idx === activeQIdx}
                    $answered={isCurrentQAnswered(q.id)}
                    onClick={() => setActiveQIdx(idx)}
                    title={`Question ${idx + 1} of Dimension ${activeDimIdx + 1}`}
                    style={{ minWidth: '40px', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 700 }}
                  >
                    Q{idx + 1}
                  </QuestionCircle>
                ))}
              </QuestionNumberScrollWrap>

              {instance?.id && (
                <button
                  onClick={() => navigate(`/assessments/report/${instance.id}`)}
                  style={{
                    background: 'rgba(99, 102, 241, 0.1)',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    color: '#6366f1',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                  title="View executive report for this assessment"
                >
                  <FiFileText /> View Report
                </button>
              )}

              <AutoSaveBadge>
                <FiCheckCircle /> {savedStatus === 'saving' ? 'Saving...' : 'Saved'}
              </AutoSaveBadge>
            </TopNavFilters>
          </TopHeaderBar>

          {/* 4. QUESTION CARD (RESPONSIVE 5-COLUMN PERSPECTIVES GRID) */}
          {currentQ && (
            <QuestionContainerCard
              key={currentQ.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <QuestionTitleArea>
                <QuestionNumberTag>Question {activeQIdx + 1} of {questions.length}</QuestionNumberTag>
                <QuestionPromptText>{currentQ.text}</QuestionPromptText>
                {currentQ.guidance && (
                  <QuestionGuidance>
                    💡 <strong>Guidance:</strong> {currentQ.guidance}
                  </QuestionGuidance>
                )}
              </QuestionTitleArea>

              <PerspectivesGrid>
                {/* Column 1: Current State */}
                <PerspectiveColumn>
                  <PerspectiveHeader>
                    <span>Current State</span>
                    <span style={{ fontSize: '0.75rem', background: '#ff6b35', color: '#fff', borderRadius: '50%', width: '16px', height: '16px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>?</span>
                  </PerspectiveHeader>
                  <OptionsStack>
                    {(currentQ.options || []).map((opt) => {
                      const score = Number(opt.score || opt.value);
                      const isSelected = Number(responses[currentQ.id]) === score;

                      return (
                        <MaturityOptionCard
                          key={score}
                          $selected={isSelected}
                          onClick={() => handleSelectCurrentState(currentQ.id, score)}
                        >
                          <OptionStageTag $selected={isSelected}>
                            {score}. {score === 1 ? 'Explore' : score === 2 ? 'Experiment' : score === 3 ? 'Formalize' : score === 4 ? 'Optimize' : 'Transform'}
                          </OptionStageTag>
                          <OptionText $selected={isSelected}>
                            {opt.label}
                          </OptionText>
                        </MaturityOptionCard>
                      );
                    })}
                  </OptionsStack>
                </PerspectiveColumn>

                {/* Column 2: Future State Vision */}
                <PerspectiveColumn>
                  <PerspectiveHeader>
                    <span>Future State Vision</span>
                    <span style={{ fontSize: '0.75rem', background: '#3b82f6', color: '#fff', borderRadius: '50%', width: '16px', height: '16px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>?</span>
                  </PerspectiveHeader>
                  <OptionsStack>
                    {(currentQ.options || []).map((opt) => {
                      const score = Number(opt.score || opt.value);
                      const isSelected = Number(responses[`${currentQ.id}_future_state`]) === score;

                      return (
                        <MaturityOptionCard
                          key={score}
                          $selected={isSelected}
                          onClick={() => handleSelectFutureState(currentQ.id, score)}
                        >
                          <OptionStageTag $selected={isSelected}>
                            {score}. {score === 1 ? 'Explore' : score === 2 ? 'Experiment' : score === 3 ? 'Formalize' : score === 4 ? 'Optimize' : 'Transform'}
                          </OptionStageTag>
                          <OptionText $selected={isSelected}>
                            {opt.label}
                          </OptionText>
                        </MaturityOptionCard>
                      );
                    })}
                  </OptionsStack>
                </PerspectiveColumn>

                {/* Column 3: Technical Pain Points */}
                <PerspectiveColumn>
                  <PerspectiveHeader>
                    <span>Technical Pain Points</span>
                  </PerspectiveHeader>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {(currentQ.technicalPainPoints || [
                      "Inconsistent environment configurations",
                      "Manual provisioning & fragmented scripting",
                      "Lack of automated validation & telemetry",
                      "Deployment consistency and latency bottlenecks"
                    ]).map((pain, pIdx) => {
                      const checked = (responses[`${currentQ.id}_technical_pain`] || []).includes(pain);
                      return (
                        <PainCheckboxCard key={pIdx} $checked={checked}>
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => handleToggleTechnicalPain(currentQ.id, pain)}
                          />
                          <span>{pain}</span>
                        </PainCheckboxCard>
                      );
                    })}
                  </div>
                </PerspectiveColumn>

                {/* Column 4: Business Pain Points */}
                <PerspectiveColumn>
                  <PerspectiveHeader>
                    <span>Business Pain Points</span>
                  </PerspectiveHeader>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {(currentQ.businessPainPoints || [
                      "Slow time-to-market for strategic features",
                      "High operational & compute overhead costs",
                      "Engineering bottlenecks and resource conflicts",
                      "Compliance risks from inconsistent environments"
                    ]).map((pain, pIdx) => {
                      const checked = (responses[`${currentQ.id}_business_pain`] || []).includes(pain);
                      return (
                        <PainCheckboxCard key={pIdx} $checked={checked}>
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => handleToggleBusinessPain(currentQ.id, pain)}
                          />
                          <span>{pain}</span>
                        </PainCheckboxCard>
                      );
                    })}
                  </div>
                </PerspectiveColumn>

                {/* Column 5: Context Notes */}
                <PerspectiveColumn>
                  <PerspectiveHeader>
                    <span>Notes</span>
                  </PerspectiveHeader>
                  <NotesArea
                    placeholder="Enter current setup context, operational notes, and specific architecture details for the AI executive report..."
                    value={responses[`${currentQ.id}_comment`] || ''}
                    onChange={(e) => handleNotesChange(currentQ.id, e.target.value)}
                  />
                </PerspectiveColumn>
              </PerspectivesGrid>
            </QuestionContainerCard>
          )}
        </ScrollableBody>

        {/* 5. BOTTOM STICKY ACTION BAR */}
        <StickyBottomBar>
          <BackButton onClick={prevQuestion}>
            <FiArrowLeft /> Back
          </BackButton>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {!isLastQuestion ? (
              <NextButton onClick={nextQuestion}>
                Next <FiArrowRight />
              </NextButton>
            ) : (
              <CompleteReportButton onClick={handleFinishAndGenerateReport} disabled={isSubmitting}>
                <HiSparkles />
                {isSubmitting ? 'Generating AI Report...' : 'Submit & Generate Executive Report'}
              </CompleteReportButton>
            )}
          </div>
        </StickyBottomBar>
      </MainContentWrapper>
    </Container>
  );
};

export default DynamicAssessmentRunner;
