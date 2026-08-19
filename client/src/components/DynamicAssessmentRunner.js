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
  FiZap,
  FiSearch,
  FiLink,
  FiPlus,
  FiExternalLink,
  FiTrash2
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
  padding: 8px 18px 75px;
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
  border-radius: 12px;
  padding: 6px 14px;
  margin-bottom: 8px;
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
  width: 38px;
  height: 38px;
  border-radius: 10px;
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
  border-radius: 14px;
  padding: 12px 16px;
  margin-bottom: 8px;
  box-shadow: 0 6px 30px rgba(0, 0, 0, 0.06);

  @media (max-width: 768px) {
    padding: 20px 16px;
    border-radius: 16px;
  }
`;

const QuestionTitleArea = styled.div`
  text-align: center;
  max-width: 1000px;
  margin: 0 auto 12px;

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
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.25;
  margin-bottom: 4px;

  @media (max-width: 640px) {
    font-size: 1.15rem;
  }
`;

const QuestionGuidance = styled.div`
  font-size: 0.76rem;
  color: #64748b;
  background: #f8fafc;
  border-left: 3px solid #ff6b35;
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-block;
  text-align: left;
  line-height: 1.25;
`;

/* Responsive Multi-Viewport 4-Column Grid with Equal Height */
const PerspectivesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 12px;
  align-items: stretch;

  @media (max-width: 1280px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 14px;
  }
`;

const PerspectiveColumn = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-width: 0;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 10px;
  box-sizing: border-box;
`;

const PerspectiveHeader = styled.div`
  font-size: 0.86rem;
  font-weight: 700;
  color: #1e293b;
  text-align: center;
  padding: 6px 10px;
  background: #ffffff;
  border-radius: 8px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: 1px solid #e2e8f0;
`;

const OptionsStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  justify-content: space-between;
`;

const MaturityOptionCard = styled.button`
  background: ${props => props.$selected ? '#fff7ed' : '#ffffff'};
  border: 2px solid ${props => props.$selected ? '#ff6b35' : '#e2e8f0'};
  border-radius: 8px;
  padding: 5px 8px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1px;
  flex: 1;
  min-height: 40px;
  box-shadow: ${props => props.$selected ? '0 4px 12px rgba(255, 107, 53, 0.15)' : 'none'};

  &:hover {
    border-color: #ff6b35;
    background: #fffaf5;
  }
`;

const OptionStageTag = styled.span`
  font-size: 0.66rem;
  font-weight: 800;
  color: ${props => props.$selected ? '#ff6b35' : '#64748b'};
  text-transform: uppercase;
  letter-spacing: 0.03em;
`;

const OptionText = styled.span`
  font-size: 0.72rem;
  line-height: 1.18;
  color: ${props => props.$selected ? '#1e293b' : '#475569'};
  font-weight: ${props => props.$selected ? '600' : '400'};
`;

/* Checkbox Cards */
const PainCheckboxCard = styled.label`
  background: ${props => props.$checked ? '#fef2f2' : '#ffffff'};
  border: 1.5px solid ${props => props.$checked ? '#ef4444' : '#e2e8f0'};
  border-radius: 8px;
  padding: 5px 8px;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;
  min-height: 40px;
  box-sizing: border-box;

  &:last-child {
    margin-bottom: 0;
  }

  input {
    margin: 0;
    accent-color: #ef4444;
    cursor: pointer;
    width: 14px;
    height: 14px;
    flex-shrink: 0;
  }

  span {
    font-size: 0.72rem;
    color: ${props => props.$checked ? '#991b1b' : '#334155'};
    line-height: 1.18;
    font-weight: ${props => props.$checked ? '600' : '400'};
  }

  &:hover {
    border-color: #ef4444;
  }
`;

/* Horizontal Full-Width Bottom Notes Section */
const HorizontalNotesSection = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 6px 10px;
  margin-top: 6px;
  width: 100%;
  box-sizing: border-box;
`;

const NotesArea = styled.textarea`
  width: 100%;
  min-height: 38px;
  height: 38px;
  border: 1.5px solid #cbd5e1;
  border-radius: 6px;
  padding: 6px 10px;
  font-family: inherit;
  font-size: 0.78rem;
  color: #1e293b;
  line-height: 1.4;
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
  padding: 8px 24px;
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
  const [draftRestoredNotice, setDraftRestoredNotice] = useState(null);
  const [navSearchQuery, setNavSearchQuery] = useState('');
  const [showAddEvidence, setShowAddEvidence] = useState(false);
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [evidenceLabel, setEvidenceLabel] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('scorex_runner_theme') === 'dark');
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);

  const toggleThemeMode = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      localStorage.setItem('scorex_runner_theme', next ? 'dark' : 'light');
      return next;
    });
  };

  const draftKey = `scorex_draft_${id || typeKey || 'custom'}`;

  const saveLocalBackup = useCallback((data) => {
    try {
      localStorage.setItem(draftKey, JSON.stringify({
        responses: data,
        savedAt: new Date().toISOString()
      }));
    } catch (e) {
      console.warn('LocalStorage backup error:', e);
    }
  }, [draftKey]);

  useEffect(() => {
    loadData();
  }, [id, typeKey]);

  const loadData = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      let loadedResponses = {};
      if (id) {
        try {
          const inst = await dynamicAssessmentService.getInstance(id);
          if (inst && inst.frameworkSnapshot && inst.frameworkSnapshot.dimensions) {
            setInstance(inst);
            setFramework(inst.frameworkSnapshot);
            loadedResponses = inst.responses || {};
          } else {
            throw new Error('Assessment session framework is missing or corrupt.');
          }
        } catch (fetchErr) {
          console.warn(`[DynamicAssessmentRunner] Instance ${id} not found on server (${fetchErr.message}). Checking recovery paths...`);
          
          // Path 1: Check localStorage for cached draft
          let recoveredFromLocal = false;
          try {
            const rawDraft = localStorage.getItem(draftKey) || localStorage.getItem(`scorex_draft_${id}`);
            if (rawDraft) {
              const parsed = JSON.parse(rawDraft);
              if (parsed.framework && parsed.framework.dimensions && parsed.framework.dimensions.length > 0) {
                setFramework(parsed.framework);
                setResponses(parsed.responses || {});
                setDraftRestoredNotice(`✨ Restored from local browser backup (${Object.keys(parsed.responses || {}).length} responses)`);
                recoveredFromLocal = true;
                
                // Auto-provision server instance in background so subsequent saves succeed
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                dynamicAssessmentService.createInstance({
                  typeKey: parsed.framework.typeKey || 'custom',
                  customerName: user.organization || 'Enterprise Organization',
                  useCase: parsed.framework.title || 'Enterprise Architecture Modernization',
                  frameworkSnapshot: parsed.framework,
                  responses: parsed.responses || {}
                }).then(newInst => {
                  if (newInst?.id) {
                    setInstance(newInst);
                    navigate(`/assessments/run/instance/${newInst.id}`, { replace: true });
                  }
                }).catch(e => console.warn('Background recovery instance creation:', e.message));
                return;
              }
            }
          } catch (storageErr) {
            console.warn('Local draft inspection error:', storageErr);
          }

          // Path 2: Check if id is actually a typeKey (e.g. user pasted typeKey into instance URL)
          try {
            const types = await dynamicAssessmentService.getAssessmentTypes();
            const matchedType = (types || []).find(t => t.typeKey === id || t.id === id);
            if (matchedType && matchedType.framework && matchedType.framework.dimensions) {
              setFramework(matchedType.framework);
              const user = JSON.parse(localStorage.getItem('user') || '{}');
              const newInst = await dynamicAssessmentService.createInstance({
                typeKey: matchedType.typeKey,
                customerName: user.organization || 'Enterprise Organization',
                useCase: matchedType.title || 'Enterprise Architecture Modernization',
                frameworkSnapshot: matchedType.framework,
                responses: {}
              });
              if (newInst?.id) {
                setInstance(newInst);
                navigate(`/assessments/run/instance/${newInst.id}`, { replace: true });
                return;
              }
            }
          } catch (typeCheckErr) {
            console.warn('Type match check failed:', typeCheckErr);
          }

          if (!recoveredFromLocal) {
            setLoadError(fetchErr.response?.data?.error || 'Assessment session was not found on the server or has expired.');
            return;
          }
        }
      } else if (typeKey) {
        const type = await dynamicAssessmentService.getAssessmentTypeByKey(typeKey);
        if (type && type.framework && type.framework.dimensions) {
          setFramework(type.framework);
          try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const newInst = await dynamicAssessmentService.createInstance({
              typeKey: type.typeKey || typeKey,
              customerName: user.organization || 'Enterprise Organization',
              useCase: type.title || 'Enterprise Architecture Modernization',
              frameworkSnapshot: type.framework,
              responses: {}
            });
            if (newInst && newInst.id) {
              setInstance(newInst);
              loadedResponses = newInst.responses || {};
              // Ensure every assessment run has a unique URL ID in address bar
              navigate(`/assessments/run/instance/${newInst.id}`, { replace: true });
            }
          } catch (createErr) {
            console.warn('Instance auto-provisioning deferred to submission:', createErr);
          }
        } else {
          setLoadError(`Assessment template "${typeKey}" was not found.`);
        }
      }

      // Check for local offline draft
      try {
        const rawLocal = localStorage.getItem(draftKey);
        if (rawLocal) {
          const parsed = JSON.parse(rawLocal);
          const localKeysCount = Object.keys(parsed.responses || {}).length;
          const serverKeysCount = Object.keys(loadedResponses).length;
          if (localKeysCount > serverKeysCount) {
            setResponses(parsed.responses);
            setDraftRestoredNotice(`✨ Restored ${localKeysCount} responses from local browser backup`);
            return;
          }
        }
      } catch (draftErr) {
        console.warn('Local draft inspection failed:', draftErr);
      }

      setResponses(loadedResponses);
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
    saveLocalBackup(updatedResponses);
    if (!instance?.id) return;
    setSavedStatus('saving');
    try {
      await dynamicAssessmentService.updateInstance(instance.id, {
        responses: updatedResponses
      });
      setSavedStatus('saved');
    } catch (err) {
      console.warn('Autosave buffered in local offline storage:', err);
      setSavedStatus('saved');
    }
  }, [instance, saveLocalBackup]);

  const debouncedAutoSave = useCallback((updatedResponses) => {
    setSavedStatus('saving');
    saveLocalBackup(updatedResponses);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      performAutoSave(updatedResponses);
    }, 450);
  }, [performAutoSave, saveLocalBackup]);

  const handleSelectCurrentState = (qId, score) => {
    if (score >= 5) {
      toast.error("Current baseline state cannot be Level 5 (Transform) because Future Target State must be strictly higher.", {
        icon: "⚠️",
        duration: 3500,
        position: "top-center"
      });
      return;
    }

    const currentFuture = responses[`${qId}_future_state`];
    // Strict rule: Future state MUST be strictly higher than Current State (Future >= Current + 1)
    const minRequiredFuture = Math.min(5, score + 1);
    const newFuture = (currentFuture !== undefined && Number(currentFuture) > score) 
      ? Number(currentFuture) 
      : minRequiredFuture;

    const updated = {
      ...responses,
      [qId]: score,
      [`${qId}_current_state`]: score,
      [`${qId}_future_state`]: newFuture
    };
    setResponses(updated);
    performAutoSave(updated);
  };

  const handleSelectFutureState = (qId, score) => {
    const currentBaseline = responses[qId] !== undefined 
      ? Number(responses[qId]) 
      : responses[`${qId}_current_state`] !== undefined 
        ? Number(responses[`${qId}_current_state`]) 
        : null;

    if (currentBaseline !== null && score <= currentBaseline) {
      toast.error(`Target Future State (${score}/5.0) must be strictly higher than Current Baseline (${currentBaseline}/5.0)`, {
        icon: "⚠️",
        duration: 3500,
        position: "top-center"
      });
      return;
    }

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

  const handleAddEvidenceLink = (qId) => {
    if (!evidenceUrl.trim()) return;
    const key = `${qId}_evidence_links`;
    const current = responses[key] || [];
    const newEntry = {
      url: evidenceUrl.trim().startsWith('http') ? evidenceUrl.trim() : `https://${evidenceUrl.trim()}`,
      label: evidenceLabel.trim() || evidenceUrl.trim(),
      addedAt: new Date().toISOString()
    };
    const updatedList = [...current, newEntry];
    const updated = {
      ...responses,
      [key]: updatedList
    };
    setResponses(updated);
    performAutoSave(updated);
    setEvidenceUrl('');
    setEvidenceLabel('');
    setShowAddEvidence(false);
    toast.success('Architecture evidence link attached');
  };

  const handleRemoveEvidenceLink = (qId, linkIdx) => {
    const key = `${qId}_evidence_links`;
    const current = responses[key] || [];
    const updatedList = current.filter((_, idx) => idx !== linkIdx);
    const updated = {
      ...responses,
      [key]: updatedList
    };
    setResponses(updated);
    performAutoSave(updated);
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
        baseMax: 4,
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
        const score = Math.max(1, Math.min(4, rawScore));
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

  const dimensions = framework?.dimensions || [];
  const safeDimIdx = Math.min(Math.max(0, activeDimIdx), Math.max(0, dimensions.length - 1));
  const currentDim = dimensions[safeDimIdx] || dimensions[0] || {};
  const questions = currentDim.questions || [];
  const safeQIdx = Math.min(Math.max(0, activeQIdx), Math.max(0, questions.length - 1));
  const currentQ = questions[safeQIdx] || questions[0] || null;

  const totalQuestions = dimensions.reduce((sum, d) => sum + (d.questions?.length || 0), 0);
  const totalAnswered = Object.keys(responses).filter(k => !k.includes('_')).length;
  const unansweredCount = Math.max(0, totalQuestions - totalAnswered);
  const estimatedMinutesRemaining = Math.max(1, Math.round(unansweredCount * 1.2));

  const isCurrentQAnswered = (qId) => responses[qId] !== undefined;

  const nextQuestion = useCallback(() => {
    if (safeQIdx < questions.length - 1) {
      setActiveQIdx(safeQIdx + 1);
    } else if (safeDimIdx < dimensions.length - 1) {
      setActiveDimIdx(safeDimIdx + 1);
      setActiveQIdx(0);
    }
  }, [safeQIdx, safeDimIdx, questions.length, dimensions.length]);

  const prevQuestion = useCallback(() => {
    if (safeQIdx > 0) {
      setActiveQIdx(safeQIdx - 1);
    } else if (safeDimIdx > 0) {
      setActiveDimIdx(safeDimIdx - 1);
      const prevDimQuestions = dimensions[safeDimIdx - 1]?.questions || [];
      setActiveQIdx(Math.max(0, prevDimQuestions.length - 1));
    }
  }, [safeQIdx, safeDimIdx, dimensions]);

  const isLastQuestion = safeDimIdx === dimensions.length - 1 && safeQIdx === questions.length - 1;

  // Keyboard Shortcuts Navigation & Rapid Scoring
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target?.tagName) || e.target?.isContentEditable) {
        return;
      }

      if (e.key === '?') {
        e.preventDefault();
        setShowShortcutsModal(prev => !prev);
        return;
      }

      if (e.key === 'ArrowRight' || e.key === 'j') {
        e.preventDefault();
        nextQuestion();
        return;
      }

      if (e.key === 'ArrowLeft' || e.key === 'k') {
        e.preventDefault();
        prevQuestion();
        return;
      }

      if (['1', '2', '3', '4', '5'].includes(e.key) && currentQ) {
        const score = parseInt(e.key, 10);
        if (e.shiftKey) {
          handleSelectFutureState(currentQ.id, score);
          toast(`Future State: Level ${score}`, { id: 'kb-shortcut', duration: 1200 });
        } else {
          handleSelectCurrentState(currentQ.id, score);
          toast(`Current State: Level ${score}`, { id: 'kb-shortcut', duration: 1200 });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQ, nextQuestion, prevQuestion, handleSelectCurrentState, handleSelectFutureState]);

  if (loading || !framework) {
    return <LoadingSpinner message="Loading assessment framework..." />;
  }

  const filteredDimensions = dimensions.map((dim, dIdx) => {
    const dimQuestions = dim.questions || [];
    if (!navSearchQuery.trim()) return { dim, dIdx, questions: dimQuestions };
    const query = navSearchQuery.toLowerCase();
    const dimMatches = dim.name.toLowerCase().includes(query) || (dim.description || '').toLowerCase().includes(query);
    const matchingQuestions = dimQuestions.filter(q => q.text.toLowerCase().includes(query) || (q.guidance || '').toLowerCase().includes(query));
    if (dimMatches || matchingQuestions.length > 0) {
      return { dim, dIdx, questions: matchingQuestions.length > 0 ? matchingQuestions : dimQuestions };
    }
    return null;
  }).filter(Boolean);

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

      <div style={{ padding: '0 16px 12px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: '#f1f5f9',
          borderRadius: '8px',
          padding: '6px 10px',
          border: '1px solid #cbd5e1'
        }}>
          <FiSearch size={14} color="#64748b" />
          <input
            type="text"
            placeholder="Filter questions..."
            value={navSearchQuery}
            onChange={(e) => setNavSearchQuery(e.target.value)}
            style={{
              border: 'none',
              background: 'transparent',
              fontSize: '0.8rem',
              outline: 'none',
              width: '100%',
              color: '#1e293b'
            }}
          />
          {navSearchQuery && (
            <button
              onClick={() => setNavSearchQuery('')}
              style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94a3b8', padding: 0 }}
            >
              <FiX size={12} />
            </button>
          )}
        </div>
      </div>

      <SidebarNavList>
        {filteredDimensions.map(({ dim, dIdx, questions: dimQuestions }) => {
          const dimAnswered = (dim.questions || []).filter(q => responses[q.id] !== undefined).length;
          const isCompleted = dimAnswered === (dim.questions || []).length && (dim.questions || []).length > 0;
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
                    {isCompleted ? '✓' : `${dimAnswered}/${(dim.questions || []).length}`}
                  </StatusDot>
                  <DimNavName $active={isDimActive}>{dim.name}</DimNavName>
                </DimNavLeft>
                {isDimActive ? <FiChevronDown color="#ff6b35" /> : <FiChevronRight color="#94a3b8" />}
              </DimensionNavHeader>

              {isDimActive && (
                <QuestionsSubList>
                  {dimQuestions.map((q, qSubIdx) => {
                    const originalIdx = (dim.questions || []).findIndex(origQ => origQ.id === q.id);
                    const actualIdx = originalIdx >= 0 ? originalIdx : qSubIdx;
                    const isQActive = actualIdx === activeQIdx;
                    const isQAnswered = responses[q.id] !== undefined;

                    return (
                      <QuestionSubItem
                        key={q.id || qSubIdx}
                        $active={isQActive}
                        onClick={() => {
                          setActiveQIdx(actualIdx);
                          setIsMobileDrawerOpen(false);
                        }}
                      >
                        <span style={{ color: isQAnswered ? '#10b981' : '#94a3b8' }}>
                          {isQAnswered ? '●' : '○'}
                        </span>
                        <span>Q{actualIdx + 1}: {q.text.substring(0, 24)}...</span>
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
              <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#a855f7' }}>🤖 Gemini Enterprise Migration</span>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>5 Dims • 10 Questions</span>
            </button>
            <button 
              onClick={() => navigate('/assessments/run/enterprise_ai_zero_trust_security')}
              style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '16px', color: '#ffffff', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '4px' }}
            >
              <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#38bdf8' }}>🛡️ Enterprise AI & Zero Trust</span>
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
          {draftRestoredNotice && (
            <div style={{
              background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
              border: '1px solid #93c5fd',
              borderRadius: '12px',
              padding: '12px 18px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              color: '#1e40af',
              fontSize: '0.85rem',
              fontWeight: '600'
            }}>
              <span>{draftRestoredNotice}</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => {
                    performAutoSave(responses);
                    setDraftRestoredNotice(null);
                    toast.success('Restored responses synchronized with cloud session');
                  }}
                  style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', padding: '4px 10px', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}
                >
                  Keep Restored
                </button>
                <button
                  onClick={() => {
                    localStorage.removeItem(draftKey);
                    setDraftRestoredNotice(null);
                    if (instance?.responses) setResponses(instance.responses);
                    toast('Reverted to original cloud session');
                  }}
                  style={{ background: 'transparent', color: '#64748b', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '4px 10px', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer' }}
                >
                  Discard Draft
                </button>
              </div>
            </div>
          )}

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

                <div style={{
                  background: '#fef3c7',
                  border: '1px solid #fde68a',
                  borderRadius: '8px',
                  padding: '5px 12px',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  color: '#b45309',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <FiClock size={13} />
                  <span>{unansweredCount === 0 ? '✨ Complete!' : `~${estimatedMinutesRemaining} mins left`}</span>
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

              <button
                onClick={() => setShowShortcutsModal(true)}
                style={{
                  background: isDarkMode ? '#1e293b' : '#f1f5f9',
                  border: isDarkMode ? '1px solid #475569' : '1px solid #cbd5e1',
                  color: isDarkMode ? '#f8fafc' : '#475569',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                title="Keyboard Shortcuts Cheat Sheet (?)"
              >
                ⌨️ Shortcuts
              </button>

              <button
                onClick={toggleThemeMode}
                style={{
                  background: isDarkMode ? '#1e293b' : '#f1f5f9',
                  border: isDarkMode ? '1px solid #475569' : '1px solid #cbd5e1',
                  color: isDarkMode ? '#f8fafc' : '#475569',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                title="Toggle Dark / Light Mode"
              >
                {isDarkMode ? '☀️ Light' : '🌙 Dark'}
              </button>

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
                      const currentBaseline = responses[currentQ.id] !== undefined 
                        ? Number(responses[currentQ.id]) 
                        : responses[`${currentQ.id}_current_state`] !== undefined 
                          ? Number(responses[`${currentQ.id}_current_state`]) 
                          : null;
                      const isNotStrictlyHigher = currentBaseline !== null && score <= currentBaseline;

                      return (
                        <MaturityOptionCard
                          key={score}
                          $selected={isSelected}
                          $disabled={isNotStrictlyHigher}
                          disabled={isNotStrictlyHigher}
                          title={isNotStrictlyHigher ? `Target horizon must be strictly higher than Current Baseline (${currentBaseline}/5.0)` : ""}
                          onClick={() => !isNotStrictlyHigher && handleSelectFutureState(currentQ.id, score)}
                        >
                          <OptionStageTag $selected={isSelected} style={isNotStrictlyHigher ? { color: "#94a3b8" } : {}}>
                            {score}. {score === 1 ? 'Explore' : score === 2 ? 'Experiment' : score === 3 ? 'Formalize' : score === 4 ? 'Optimize' : 'Transform'}
                            {isNotStrictlyHigher && <span style={{ marginLeft: "6px", fontSize: "0.7rem", color: "#ef4444" }}>🔒 Must be &gt; Baseline</span>}
                          </OptionStageTag>
                          <OptionText $selected={isSelected} style={isNotStrictlyHigher ? { color: "#94a3b8" } : {}}>
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
                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between', gap: '6px' }}>
                    {(currentQ.technicalPainPoints || [
                      "Inconsistent environment configurations and configuration drift",
                      "Manual provisioning & fragmented operational scripting",
                      "Lack of automated validation & telemetry guardrails",
                      "Deployment consistency and latency bottlenecks across clouds",
                      "Missing centralized observability and distributed error tracing"
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
                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between', gap: '6px' }}>
                    {(currentQ.businessPainPoints || [
                      "Slow time-to-market for strategic enterprise capabilities",
                      "High operational & compute overhead inflating infrastructure TCO",
                      "Engineering bottlenecks and cross-team resource conflicts",
                      "Compliance and governance audit risks from inconsistent policies",
                      "Difficulty measuring ROI and business value delivery to executives"
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
              </PerspectivesGrid>

              {/* Full-Width Horizontally Stretched Operational Notes & Evidence Links */}
              <HorizontalNotesSection>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    📝 Operational Context, Architecture Details & Evidence Links <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '400' }}>(Appended to Gemini AI executive dossier)</span>
                  </span>
                  <button
                    onClick={() => setShowAddEvidence(!showAddEvidence)}
                    style={{ background: '#eff6ff', border: '1px solid #bfdbfe', color: '#2563eb', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 10px', borderRadius: '6px' }}
                  >
                    <FiPlus size={12} /> {showAddEvidence ? 'Cancel' : '+ Add Evidence Link'}
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: '12px', alignItems: 'start' }}>
                  <NotesArea
                    placeholder="Enter current setup context, operational notes, and specific architecture details for the AI executive report..."
                    value={responses[`${currentQ.id}_comment`] || ''}
                    onChange={(e) => handleNotesChange(currentQ.id, e.target.value)}
                  />

                  {/* Architecture Evidence & Artifact Links Box */}
                  <div style={{ minWidth: '260px', maxWidth: '380px' }}>
                    {showAddEvidence && (
                      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '6px', marginBottom: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <input
                          type="text"
                          placeholder="Label (e.g. GitHub RFC, Confluence)"
                          value={evidenceLabel}
                          onChange={(e) => setEvidenceLabel(e.target.value)}
                          style={{ fontSize: '0.75rem', padding: '4px 6px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                        />
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <input
                            type="text"
                            placeholder="URL (https://...)"
                            value={evidenceUrl}
                            onChange={(e) => setEvidenceUrl(e.target.value)}
                            style={{ fontSize: '0.75rem', padding: '4px 6px', borderRadius: '4px', border: '1px solid #cbd5e1', flex: 1 }}
                          />
                          <button
                            onClick={() => handleAddEvidenceLink(currentQ.id)}
                            style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', padding: '4px 8px', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    )}

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', maxHeight: '54px', overflowY: 'auto' }}>
                      {(responses[`${currentQ.id}_evidence_links`] || []).map((link, lIdx) => (
                        <span
                          key={lIdx}
                          style={{
                            background: '#eff6ff',
                            border: '1px solid #bfdbfe',
                            borderRadius: '6px',
                            padding: '2px 6px',
                            fontSize: '0.72rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            color: '#1d4ed8'
                          }}
                        >
                          <FiLink size={10} />
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#1d4ed8', textDecoration: 'none', fontWeight: '600', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                          >
                            {link.label}
                          </a>
                          <button
                            onClick={() => handleRemoveEvidenceLink(currentQ.id, lIdx)}
                            style={{ background: 'transparent', border: 'none', color: '#93c5fd', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                          >
                            <FiX size={11} />
                          </button>
                        </span>
                      ))}
                      {(!responses[`${currentQ.id}_evidence_links`] || responses[`${currentQ.id}_evidence_links`].length === 0) && !showAddEvidence && (
                        <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontStyle: 'italic', padding: '4px 0' }}>No evidence links added yet</span>
                      )}
                    </div>
                  </div>
                </div>
              </HorizontalNotesSection>
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

      {/* Keyboard Shortcuts Modal */}
      <AnimatePresence>
        {showShortcutsModal && (
          <MobileDrawerOverlay onClick={() => setShowShortcutsModal(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200 }}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: '#1e293b',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '20px',
                padding: '28px 32px',
                maxWidth: '480px',
                width: '90%',
                boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
                color: '#ffffff'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  ⌨️ Keyboard Shortcuts
                </h3>
                <button
                  onClick={() => setShowShortcutsModal(false)}
                  style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.2rem', padding: 0 }}
                >
                  <FiX />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
                  <span style={{ color: '#cbd5e1' }}>Select Current State</span>
                  <kbd style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '3px 8px', fontWeight: 700, color: '#38bdf8' }}>1 - 5</kbd>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
                  <span style={{ color: '#cbd5e1' }}>Select Future Vision</span>
                  <kbd style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '3px 8px', fontWeight: 700, color: '#a855f7' }}>Shift + 1 - 5</kbd>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
                  <span style={{ color: '#cbd5e1' }}>Next Question</span>
                  <kbd style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '3px 8px', fontWeight: 700, color: '#34d399' }}>→ or J</kbd>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
                  <span style={{ color: '#cbd5e1' }}>Previous Question</span>
                  <kbd style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '3px 8px', fontWeight: 700, color: '#f59e0b' }}>← or K</kbd>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#cbd5e1' }}>Toggle this Help Modal</span>
                  <kbd style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '3px 8px', fontWeight: 700, color: '#f8fafc' }}>?</kbd>
                </div>
              </div>
            </motion.div>
          </MobileDrawerOverlay>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default DynamicAssessmentRunner;
