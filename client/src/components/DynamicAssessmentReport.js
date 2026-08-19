import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiAward, 
  FiCheckCircle, 
  FiAlertTriangle, 
  FiTrendingUp, 
  FiCalendar, 
  FiClock, 
  FiShare2, 
  FiDownload, 
  FiLayers, 
  FiArrowLeft,
  FiUser,
  FiFileText,
  FiList,
  FiTarget,
  FiCheck,
  FiSliders,
  FiEdit3,
  FiChevronDown
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import toast from 'react-hot-toast';
import dynamicAssessmentService from '../services/dynamicAssessmentService';
import LoadingSpinner from './LoadingSpinner';
import AIGenerationProgressModal from './AIGenerationProgressModal';
import ScenarioSimulator from './ScenarioSimulator';
import FinancialImpactCard from './FinancialImpactCard';
import ArchitectureComparisonDiagram from './ArchitectureComparisonDiagram';
import MultiPersonaViews from './MultiPersonaViews';
import BacklogExporterCard from './BacklogExporterCard';
import IaCBlueprintCard from './IaCBlueprintCard';
import DynamicRadarChart from './DynamicRadarChart';
import ExecutiveHeatmapMatrix from './ExecutiveHeatmapMatrix';
import IndustryPeerBenchmarkingCard from './IndustryPeerBenchmarkingCard';
import AudioBriefingPlayer from './AudioBriefingPlayer';
import PresentationModeModal from './PresentationModeModal';
import UnifiedDocumentPreviewModal from './UnifiedDocumentPreviewModal';
import { exportDynamicAssessmentToExcel } from '../services/excelExportService';
import { generateDynamicPDFReport } from '../services/pdfExportService';
import { exportAssessmentToPPTX } from '../services/pptxExportService';
import { exportAssessmentToJSON, exportAssessmentToCSV, exportAssessmentToWord, exportCompleteDeliverablesBundle } from '../services/dataExportService';

const DropdownWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownMenuCard = styled(motion.div)`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 320px;
  background: ${props => props.$theme === 'dark' ? 'rgba(15, 23, 42, 0.96)' : '#ffffff'};
  border: 1px solid ${props => props.$theme === 'dark' ? 'rgba(255, 255, 255, 0.15)' : '#cbd5e1'};
  border-radius: 14px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(20px);
  padding: 8px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const DropdownSectionHeader = styled.div`
  font-size: 0.72rem;
  font-weight: 800;
  color: ${props => props.$theme === 'dark' ? '#94a3b8' : '#64748b'};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 8px 12px 4px;
`;

const DropdownItemBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: ${props => props.$theme === 'dark' ? '#f1f5f9' : '#0f172a'};
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  text-align: left;
  transition: all 0.15s ease;

  &:hover {
    background: ${props => props.$theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : '#f1f5f9'};
    color: ${props => props.$accentColor || '#3b82f6'};
    transform: translateX(3px);
  }
`;

const DropdownDividerLine = styled.div`
  height: 1px;
  background: ${props => props.$theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#e2e8f0'};
  margin: 6px 4px;
`;

const Container = styled.div`
  min-height: 100vh;
  background: ${props => props.$theme === 'dark' ? 'linear-gradient(135deg, #0b0f19 0%, #111827 50%, #171b30 100%)' : '#f8fafc'};
  color: ${props => props.$theme === 'dark' ? '#f3f4f6' : '#0f172a'};
  padding: 108px 36px 60px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 92px 16px 40px;
  }

  /* 🖨️ EXECUTIVE PRINT & PDF STYLES */
  @media print {
    background: #ffffff !important;
    color: #0f172a !important;
    padding: 0 !important;
    min-height: auto !important;

    .no-print {
      display: none !important;
    }

    * {
      color-adjust: exact !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
  }
`;

const Wrapper = styled.div`
  max-width: 1560px;
  margin: 0 auto;
  width: 100%;
`;

const PromoteBanner = styled.div`
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(168, 85, 247, 0.25) 100%);
  border: 1.5px solid rgba(139, 92, 246, 0.5);
  border-radius: 20px;
  padding: 24px 32px;
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    padding: 20px 16px;
    flex-direction: column;
    align-items: stretch;
  }
`;

const PromoteInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const SparkleIconWrap = styled.div`
  background: linear-gradient(135deg, #6366f1, #a855f7);
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.4rem;
  flex-shrink: 0;
`;

const PromoteBtn = styled.button`
  background: linear-gradient(135deg, #6366f1, #a855f7);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4);
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 48px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 25px rgba(99, 102, 241, 0.6);
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const HeroCard = styled.div`
  background: ${props => props.$theme === 'dark' ? 'rgba(30, 41, 59, 0.7)' : '#ffffff'};
  backdrop-filter: blur(16px);
  border: ${props => props.$theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e2e8f0'};
  box-shadow: ${props => props.$theme === 'dark' ? '0 20px 40px rgba(0, 0, 0, 0.3)' : '0 4px 20px rgba(0, 0, 0, 0.05)'};
  border-radius: 24px;
  padding: 40px;
  margin-bottom: 32px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    padding: 20px 16px;
    border-radius: 18px;
  }
`;

const HeroHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
  flex-wrap: wrap;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
  }
`;

const HeroBadge = styled.span`
  background: ${props => props.$theme === 'dark' ? 'rgba(56, 189, 248, 0.15)' : '#e0f2fe'};
  border: ${props => props.$theme === 'dark' ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid #7dd3fc'};
  color: ${props => props.$theme === 'dark' ? '#38bdf8' : '#0284c7'};
  padding: 6px 16px;
  border-radius: 9999px;
  font-size: 0.85rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
`;

const HeroTitle = styled.h1`
  font-size: 2.4rem;
  font-weight: 800;
  color: ${props => props.$theme === 'dark' ? '#ffffff' : '#0f172a'};
  margin-bottom: 8px;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

const HeroMeta = styled.div`
  display: flex;
  gap: 20px;
  color: ${props => props.$theme === 'dark' ? '#94a3b8' : '#475569'};
  font-size: 0.95rem;
  flex-wrap: wrap;

  span {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  strong {
    color: ${props => props.$theme === 'dark' ? '#e2e8f0' : '#0f172a'};
  }
`;

const ScoreSection = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  background: ${props => props.$theme === 'dark' ? 'rgba(15, 23, 42, 0.6)' : '#f1f5f9'};
  border: ${props => props.$theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #cbd5e1'};
  border-radius: 20px;
  padding: 24px 32px;

  @media (max-width: 768px) {
    padding: 16px 20px;
    width: 100%;
    box-sizing: border-box;
    justify-content: space-between;
  }
`;

const ScoreBig = styled.div`
  font-size: 3.5rem;
  font-weight: 900;
  background: linear-gradient(135deg, #38bdf8 0%, #818cf8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const LevelBadge = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  color: ${props => props.$theme === 'dark' ? '#38bdf8' : '#0369a1'};
  margin-bottom: 4px;
`;


const ExecutiveTabContainer = styled.div`
  display: flex;
  gap: 8px;
  background: ${props => props.$theme === 'dark' ? 'rgba(15, 23, 42, 0.85)' : '#e2e8f0'};
  padding: 6px;
  border-radius: 16px;
  border: ${props => props.$theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #cbd5e1'};
  margin-bottom: 28px;
  overflow-x: auto;
  backdrop-filter: blur(16px);
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }

  @media (max-width: 768px) {
    border-radius: 12px;
    padding: 4px;
  }
`;

const ExecutiveTabButton = styled.button`
  background: ${props => props.$isActive ? (props.$theme === "dark" ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "#ffffff") : "transparent"};
  color: ${props => props.$isActive ? (props.$theme === "dark" ? "#ffffff" : "#1e1b4b") : (props.$theme === "dark" ? "#94a3b8" : "#475569")};
  box-shadow: ${props => props.$isActive ? (props.$theme === "dark" ? "0 4px 14px rgba(99, 102, 241, 0.35)" : "0 2px 8px rgba(0,0,0,0.08)") : "none"};
  border: none;
  border-radius: 12px;
  padding: 10px 18px;
  font-size: 0.92rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  transition: all 0.2s ease;
  box-shadow: ${props => props.$isActive ? "0 4px 14px rgba(99, 102, 241, 0.35)" : "none"};

  &:hover {
    color: #ffffff;
    background: ${props => props.$isActive ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "rgba(255, 255, 255, 0.06)"};
  }
`;

const TwoColGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  margin-bottom: 32px;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const Card = styled.div`
  background: ${props => props.$theme === 'dark' ? 'rgba(30, 41, 59, 0.6)' : '#ffffff'};
  backdrop-filter: blur(16px);
  border: ${props => props.$theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e2e8f0'};
  box-shadow: ${props => props.$theme === 'dark' ? 'none' : '0 4px 20px rgba(0,0,0,0.05)'};
  border-radius: 24px;
  padding: 32px;

  @media (max-width: 768px) {
    padding: 20px 16px;
    border-radius: 18px;
  }
`;

const CardTitle = styled.h2`
  font-size: 1.4rem;
  font-weight: 700;
  color: ${props => props.$theme === 'dark' ? '#ffffff' : '#0f172a'};
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ExecutiveSummaryText = styled.div`
  color: ${props => props.$theme === 'dark' ? '#cbd5e1' : '#1e293b'};
  font-size: 1.02rem;
  line-height: 1.7;

  strong {
    color: ${props => props.$theme === 'dark' ? '#ffffff' : '#0f172a'};
    background: ${props => props.$theme === 'dark' ? 'rgba(99, 102, 241, 0.2)' : '#eef2ff'};
    padding: 2px 6px;
    border-radius: 4px;
  }

  p {
    margin-bottom: 16px;
  }
`;

const DimensionBarRow = styled.div`
  margin-bottom: 20px;
`;

const DimHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: 0.95rem;
  font-weight: 700;
  color: ${props => props.$theme === 'dark' ? '#e2e8f0' : '#0f172a'};
`;

const ProgressBarTrack = styled.div`
  width: 100%;
  height: 10px;
  background: ${props => props.$theme === 'dark' ? 'rgba(15, 23, 42, 0.7)' : '#e2e8f0'};
  border-radius: 9999px;
  overflow: hidden;
`;

const ProgressBarFill = styled.div`
  height: 100%;
  width: ${props => props.$pct}%;
  background: linear-gradient(90deg, #38bdf8, #818cf8);
  border-radius: 9999px;
  transition: width 0.8s ease;
`;

const CalloutBox = styled.div`
  background: ${props => props.$theme === 'dark' ? (props.$type === 'strength' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)') : (props.$type === 'strength' ? '#f0fdf4' : '#fef2f2')};
  border: 1px solid ${props => props.$theme === 'dark' ? (props.$type === 'strength' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)') : (props.$type === 'strength' ? '#86efac' : '#fca5a5')};
  border-radius: 14px;
  padding: 16px 20px;
  margin-bottom: 12px;
  color: ${props => props.$theme === 'dark' ? (props.$type === 'strength' ? '#6ee7b7' : '#fca5a5') : (props.$type === 'strength' ? '#166534' : '#991b1b')};
  font-weight: ${props => props.$theme === 'dark' ? 'normal' : '600'};
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 0.95rem;
  line-height: 1.5;

  svg {
    font-size: 1.2rem;
    flex-shrink: 0;
    margin-top: 2px;
  }
`;

const RoadmapGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-top: 20px;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const RoadmapCard = styled.div`
  background: ${props => props.$theme === 'dark' ? 'rgba(15, 23, 42, 0.7)' : '#ffffff'};
  border: ${props => props.$theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1.5px solid #e2e8f0'};
  border-radius: 18px;
  padding: 24px;
  box-shadow: ${props => props.$theme === 'dark' ? 'none' : '0 4px 14px rgba(0,0,0,0.04)'};
`;

const RoadmapPhase = styled.div`
  font-size: 0.8rem;
  font-weight: 800;
  color: ${props => props.$theme === 'dark' ? '#38bdf8' : '#0284c7'};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 6px;
`;

const RoadmapTimeline = styled.div`
  font-size: 1.2rem;
  font-weight: 800;
  color: ${props => props.$theme === 'dark' ? '#ffffff' : '#0f172a'};
  margin-bottom: 12px;
`;

const MilestoneList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const MilestoneItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 0.9rem;
  color: ${props => props.$theme === 'dark' ? '#cbd5e1' : '#334155'};
  line-height: 1.45;
  font-weight: ${props => props.$theme === 'dark' ? 'normal' : '500'};

  svg {
    color: #10b981;
    margin-top: 3px;
    flex-shrink: 0;
  }
`;

const RecommendationCard = styled.div`
  background: ${props => props.$theme === 'dark' ? 'rgba(15, 23, 42, 0.7)' : '#ffffff'};
  border: ${props => props.$theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1.5px solid #e2e8f0'};
  border-radius: 18px;
  padding: 24px;
  margin-bottom: 16px;
  box-shadow: ${props => props.$theme === 'dark' ? 'none' : '0 4px 14px rgba(0,0,0,0.04)'};
`;

const RecHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  gap: 16px;
`;

const RecTitle = styled.h3`
  font-size: 1.15rem;
  font-weight: 800;
  color: ${props => props.$theme === 'dark' ? '#ffffff' : '#0f172a'};
`;

const PriorityBadge = styled.span`
  background: ${props => props.$priority === 'Critical' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)'};
  color: ${props => props.$priority === 'Critical' ? '#f87171' : '#fbbf24'};
  border: 1px solid ${props => props.$priority === 'Critical' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(245, 158, 11, 0.4)'};
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
`;

const DynamicAssessmentReport = () => {
  const { id, token } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [instance, setInstance] = useState(null);
  const [report, setReport] = useState(null);
  const [framework, setFramework] = useState(null);
  const [isPromoted, setIsPromoted] = useState(false);
  const [showSimulator, setShowSimulator] = useState(false);
  const [simulatedTargets, setSimulatedTargets] = useState(null);
  const [isPresentationOpen, setIsPresentationOpen] = useState(false);
  const [previewDocState, setPreviewDocState] = useState({ isOpen: false, type: 'slides' });
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);
  const [isPasscodeRequired, setIsPasscodeRequired] = useState(false);
  const [enteredPasscode, setEnteredPasscode] = useState('');
  const [activeExecutiveTab, setActiveExecutiveTab] = useState('overview');
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    loadReport();
  }, [id, token]);

  const loadReport = async (overridePasscode = null) => {
    setLoading(true);
    setLoadError(null);
    try {
      if (token) {
        try {
          const publicData = await dynamicAssessmentService.getPublicReport(token, overridePasscode);
          if (publicData && publicData.instance) {
            setInstance(publicData.instance);
            setFramework(publicData.framework || publicData.instance.frameworkSnapshot);
            setReport(publicData.report || publicData.instance.aiReport);
            setIsPasscodeRequired(false);
          } else {
            setLoadError('Public assessment report not found or link has expired.');
          }
        } catch (tokenErr) {
          if (tokenErr.response?.data?.isProtected) {
            setIsPasscodeRequired(true);
            if (overridePasscode) {
              toast.error('Incorrect passcode. Please try again.');
            }
            return;
          }
          throw tokenErr;
        }
      } else if (id) {
        const inst = await dynamicAssessmentService.getInstance(id);
        if (inst && inst.frameworkSnapshot) {
          setInstance(inst);
          setFramework(inst.frameworkSnapshot);
          if (inst.aiReport) {
            setReport(inst.aiReport);
          } else {
            try {
              const genRes = await dynamicAssessmentService.generateReport(id);
              if (genRes && genRes.report) {
                setReport(genRes.report);
              } else {
                setLoadError('Report could not be generated for this assessment.');
              }
            } catch (genErr) {
              setLoadError('Report generation failed. Please re-run the assessment.');
            }
          }
        } else {
          setLoadError('Assessment report was not found or has expired.');
        }
      }
    } catch (err) {
      console.error(err);
      setLoadError(err.response?.data?.error || 'Failed to load assessment report. The session may have expired.');
    } finally {
      setLoading(false);
    }
  };

  const handleUnlockWithPasscode = async (e) => {
    e.preventDefault();
    if (!enteredPasscode.trim()) {
      toast.error('Please enter the access PIN / Passcode');
      return;
    }
    await loadReport(enteredPasscode.trim());
  };

  const handlePromoteFramework = async () => {
    if (!instance?.id) return;
    try {
      toast.loading('Promoting assessment type to navbar...', { id: 'promote-type' });
      const res = await dynamicAssessmentService.promoteInstanceAsType(instance.id, {
        title: framework?.title,
        badge: framework?.badge || 'Custom',
        color: framework?.color || '#6366f1'
      });

      if (res.success) {
        setIsPromoted(true);
        toast.success(`"${framework?.title}" promoted! Now available under Assessments.`, { id: 'promote-type' });
        window.dispatchEvent(new Event('assessment-types-updated'));
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to promote assessment type', { id: 'promote-type' });
    }
  };

  const handleShareLink = async () => {
    if (!instance?.id) return;
    try {
      toast.loading('Generating public share link...', { id: 'share-link' });
      const res = await dynamicAssessmentService.getShareLink(instance.id);
      if (res && res.shareToken) {
        const fullUrl = `${window.location.origin}/assessments/public-report/${res.shareToken}`;
        await navigator.clipboard.writeText(fullUrl);
        toast.success('🔗 Public report link copied to clipboard!', { id: 'share-link', duration: 4000 });
      } else {
        toast.error('Failed to generate share link', { id: 'share-link' });
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate share link', { id: 'share-link' });
    }
  };

  if (loading) {
    return <AIGenerationProgressModal customerName={instance?.customerName || "Enterprise Organization"} />;
  }

  if (isPasscodeRequired) {
    return (
      <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Wrapper style={{ maxWidth: '480px', textAlign: 'center' }}>
          <div style={{ background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(139, 92, 246, 0.4)', borderRadius: '24px', padding: '40px 32px', backdropFilter: 'blur(16px)', boxShadow: '0 25px 50px rgba(0,0,0,0.6)' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '18px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '1.75rem' }}>
              🔒
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
              Confidential Report
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginBottom: '24px', lineHeight: '1.5' }}>
              This architecture assessment readout is protected by the author. Enter the access PIN or passcode to view findings.
            </p>

            <form onSubmit={handleUnlockWithPasscode}>
              <input 
                type="password"
                placeholder="Enter Access Passcode..."
                value={enteredPasscode}
                onChange={(e) => setEnteredPasscode(e.target.value)}
                style={{ width: '100%', background: '#090d16', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', padding: '12px 16px', color: '#fff', fontSize: '1.1rem', textAlign: 'center', letterSpacing: '0.25em', marginBottom: '16px', outline: 'none', boxSizing: 'border-box' }}
                autoFocus
              />
              <button
                type="submit"
                style={{ width: '100%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: '12px', padding: '12px', color: '#fff', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)' }}
              >
                Unlock Assessment Report
              </button>
            </form>
          </div>
        </Wrapper>
      </Container>
    );
  }

  if (loadError || !instance || !report) {
    return (
      <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Wrapper style={{ maxWidth: '680px', textAlign: 'center' }}>
          <div style={{ background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '40px 32px', backdropFilter: 'blur(16px)', boxShadow: '0 20px 50px rgba(0,0,0,0.4)' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: 'rgba(239, 68, 68, 0.15)', border: '1.5px solid rgba(239, 68, 68, 0.4)', color: '#f87171', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '2rem' }}>
              <FiAlertTriangle />
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#ffffff', marginBottom: '12px' }}>
              Assessment Report Not Found
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '28px' }}>
              {loadError || 'This assessment report is no longer available or was generated in a previous session.'}
              <br />
              You can launch an instant pre-calculated sample report or run a new assessment.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px', textAlign: 'left' }}>
              <button 
                onClick={async () => {
                  try {
                    toast.loading('Generating sample FinOps report...', { id: 'sample-gen' });
                    const res = await dynamicAssessmentService.generateSampleInstance('finops_cloud_cost_optimization');
                    await dynamicAssessmentService.generateReport(res.instanceId);
                    toast.dismiss('sample-gen');
                    navigate(`/assessments/report/${res.instanceId}`);
                  } catch (e) {
                    navigate('/assessments/run/finops_cloud_cost_optimization');
                  }
                }}
                style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '16px', color: '#ffffff', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '4px' }}
              >
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#38bdf8' }}>💰 FinOps Sample Report</span>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Instant 1-Click Launch</span>
              </button>

              <button 
                onClick={async () => {
                  try {
                    toast.loading('Generating sample Gemini report...', { id: 'sample-gen' });
                    const res = await dynamicAssessmentService.generateSampleInstance('openai_to_gemini_enterprise_migration');
                    await dynamicAssessmentService.generateReport(res.instanceId);
                    toast.dismiss('sample-gen');
                    navigate(`/assessments/report/${res.instanceId}`);
                  } catch (e) {
                    navigate('/assessments/run/openai_to_gemini_enterprise_migration');
                  }
                }}
                style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '16px', color: '#ffffff', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '4px' }}
              >
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#a855f7' }}>🤖 Gemini Enterprise Migration Report</span>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Instant 1-Click Launch</span>
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
        </Wrapper>
      </Container>
    );
  }

  const scores = report.calculatedScores || {
    overallScore: instance.totalScore || 0,
    maturityLevel: instance.maturityLevel || 'Defined',
    dimensionScores: instance.scores || {}
  };

  // Compute simulated dimension scores and overall target inline
  let simulatedDimensionScores = scores.dimensionScores || {};
  let simulatedOverallTarget = scores.overallTarget || scores.targetScore || 4.2;

  if (simulatedTargets && Object.keys(simulatedTargets).length > 0) {
    simulatedDimensionScores = { ...(scores.dimensionScores || {}) };
    Object.entries(simulatedTargets).forEach(([dimId, targetVal]) => {
      if (simulatedDimensionScores[dimId]) {
        const cur = simulatedDimensionScores[dimId].score !== undefined ? simulatedDimensionScores[dimId].score : (simulatedDimensionScores[dimId].currentScore || 2.5);
        simulatedDimensionScores[dimId] = {
          ...simulatedDimensionScores[dimId],
          targetScore: Number(targetVal),
          futureScore: Number(targetVal),
          gap: Math.max(0, +(Number(targetVal) - cur).toFixed(1))
        };
      }
    });

    const values = Object.values(simulatedTargets);
    if (values.length > 0) {
      const avg = values.reduce((sum, v) => sum + Number(v), 0) / values.length;
      simulatedOverallTarget = parseFloat(avg.toFixed(1));
    }
  }

  const dimensionScoresForSimulator = {};
  if (framework && framework.dimensions) {
    framework.dimensions.forEach(dim => {
      const dScore = scores.dimensionScores?.[dim.id] || {};
      dimensionScoresForSimulator[dim.id] = {
        name: dim.name,
        current: typeof dScore.score === 'number' ? dScore.score : (instance.responses?.[`${dim.id}_current`] || 2.5),
        future: simulatedTargets?.[dim.id] || (typeof dScore.targetScore === 'number' ? dScore.targetScore : 4.0)
      };
    });
  }

  return (
    <Container $theme={theme}>
      <Wrapper>
        {/* Navigation back & action controls */}
        <div className="no-print" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button 
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#94a3b8', padding: '9px 16px', borderRadius: '10px', display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600', transition: 'all 0.2s ease' }}
              onClick={() => navigate('/assessments')}
            >
              <FiArrowLeft /> Back to Assessments Hub
            </button>

            <button 
              style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2))', border: '1.5px solid rgba(139, 92, 246, 0.5)', color: '#c084fc', padding: '9px 18px', borderRadius: '10px', display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '700', transition: 'all 0.2s ease', boxShadow: '0 4px 14px rgba(99, 102, 241, 0.25)' }}
              onClick={() => navigate(`/assessments/run/instance/${id}`)}
              title="Go back to modify your answers, add operational notes, or refine ratings"
            >
              <FiEdit3 /> ✏️ Edit Responses / Go Back to Questions
            </button>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {/* 1. Theme Toggle */}
            <button 
              style={{ 
                background: theme === 'light' ? '#ffffff' : 'rgba(255, 255, 255, 0.08)', 
                border: theme === 'light' ? '1.5px solid #cbd5e1' : '1px solid rgba(255, 255, 255, 0.15)', 
                color: theme === 'light' ? '#0f172a' : '#ffffff', 
                padding: '8px 14px', 
                borderRadius: '10px', 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '6px', 
                cursor: 'pointer', 
                fontWeight: '700',
                fontSize: '0.85rem',
                boxShadow: theme === 'light' ? '0 2px 6px rgba(0,0,0,0.05)' : 'none'
              }}
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              title="Toggle between Light and Dark Mode"
            >
              {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
            </button>

            {/* 2. AI Voice Briefing Action */}
            <button
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                border: 'none',
                color: '#ffffff',
                padding: '8px 16px',
                borderRadius: '10px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                fontWeight: '800',
                fontSize: '0.85rem',
                boxShadow: '0 4px 14px rgba(124, 58, 237, 0.3)'
              }}
              onClick={() => {
                const playerEl = document.getElementById('audio-briefing-player');
                if (playerEl) {
                  playerEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  playerEl.style.transform = 'scale(1.02)';
                  setTimeout(() => { playerEl.style.transform = 'scale(1)'; }, 600);
                }
                toast('🎙️ DeepMind Emotional Audio Engine active! Use the player below to customize voices & language.', { icon: '🎙️' });
              }}
              title="Listen to DeepMind Neural Voice Briefing with 4,000+ Voices & 30+ Languages"
            >
              <span>🎙️</span> AI Voice Brief
            </button>

            {/* 3. What-If Simulator Action */}
            <button
              style={{
                background: showSimulator ? 'linear-gradient(135deg, #10b981, #059669)' : (theme === 'light' ? '#f0fdf4' : 'rgba(16, 185, 129, 0.15)'),
                border: showSimulator ? 'none' : '1.5px solid #10b981',
                color: showSimulator ? '#ffffff' : '#10b981',
                padding: '8px 16px',
                borderRadius: '10px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                fontWeight: '800',
                fontSize: '0.85rem',
                boxShadow: showSimulator ? '0 4px 14px rgba(16, 185, 129, 0.3)' : 'none'
              }}
              onClick={() => setShowSimulator(prev => !prev)}
              title="Open Interactive What-If Score & FinOps ROI Simulator"
            >
              <span>🔮</span> {showSimulator ? 'Close Simulator' : 'What-If Simulator'}
            </button>

            {/* 4. Present Deck */}
            <button
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                border: 'none',
                color: '#ffffff',
                padding: '8px 18px',
                borderRadius: '10px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                fontWeight: '800',
                fontSize: '0.85rem',
                boxShadow: '0 4px 14px rgba(245, 158, 11, 0.3)'
              }}
              onClick={() => setPreviewDocState({ isOpen: true, type: 'slides' })}
              title="Launch Fullscreen 16:9 Slide Deck for Executive Presentation"
            >
              <span>📊</span> Present Deck
            </button>

            {/* 3. Consolidated Export & Cloud Hub Dropdown */}
            <DropdownWrapper
              onMouseEnter={() => setIsExportDropdownOpen(true)}
              onMouseLeave={() => setIsExportDropdownOpen(false)}
            >
              <button
                onClick={() => setIsExportDropdownOpen(prev => !prev)}
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  border: 'none',
                  color: '#ffffff',
                  padding: '8px 18px',
                  borderRadius: '10px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  fontWeight: '800',
                  fontSize: '0.85rem',
                  boxShadow: '0 4px 14px rgba(59, 130, 246, 0.3)'
                }}
                title="Open Cloud Editors & Download Deliverables"
              >
                <span>📑</span> Export & Cloud Hub <FiChevronDown size={14} style={{ transform: isExportDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>

              <AnimatePresence>
                {isExportDropdownOpen && (
                  <DropdownMenuCard
                    $theme={theme}
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                  >
                    <DropdownSectionHeader $theme={theme}>☁️ Google Workspace & Cloud Apps</DropdownSectionHeader>
                    <DropdownItemBtn 
                      $theme={theme} 
                      $accentColor="#f59e0b"
                      onClick={() => { setIsExportDropdownOpen(false); setPreviewDocState({ isOpen: true, type: 'slides' }); }}
                    >
                      <span style={{ fontSize: "1.1rem" }}>📊</span> Google Slides (16:9 Deck)
                    </DropdownItemBtn>
                    <DropdownItemBtn 
                      $theme={theme} 
                      $accentColor="#10b981"
                      onClick={() => { setIsExportDropdownOpen(false); setPreviewDocState({ isOpen: true, type: 'sheets' }); }}
                    >
                      <span style={{ fontSize: "1.1rem" }}>📈</span> Google Sheets (Excel Matrix)
                    </DropdownItemBtn>
                    <DropdownItemBtn 
                      $theme={theme} 
                      $accentColor="#3b82f6"
                      onClick={() => { setIsExportDropdownOpen(false); setPreviewDocState({ isOpen: true, type: 'docs' }); }}
                    >
                      <span style={{ fontSize: "1.1rem" }}>📝</span> Google Docs (Word Memo)
                    </DropdownItemBtn>
                    <DropdownItemBtn 
                      $theme={theme} 
                      $accentColor="#f97316"
                      onClick={() => { setIsExportDropdownOpen(false); setPreviewDocState({ isOpen: true, type: 'drawio' }); }}
                    >
                      <span style={{ fontSize: "1.1rem" }}>📐</span> Draw.io (Cloud Architecture)
                    </DropdownItemBtn>

                    <DropdownDividerLine $theme={theme} />

                    <DropdownSectionHeader $theme={theme}>📄 Standard Deliverables</DropdownSectionHeader>
                    <DropdownItemBtn 
                      $theme={theme} 
                      $accentColor="#ef4444"
                      onClick={() => { setIsExportDropdownOpen(false); setPreviewDocState({ isOpen: true, type: 'pdf' }); }}
                    >
                      <span style={{ fontSize: "1.1rem" }}>📄</span> Executive PDF Report
                    </DropdownItemBtn>
                    <DropdownItemBtn 
                      $theme={theme} 
                      $accentColor="#0ea5e9"
                      onClick={() => { setIsExportDropdownOpen(false); setPreviewDocState({ isOpen: true, type: 'csv' }); }}
                    >
                      <span style={{ fontSize: "1.1rem" }}>📑</span> Flattened CSV Matrix
                    </DropdownItemBtn>
                    <DropdownItemBtn 
                      $theme={theme} 
                      $accentColor="#8b5cf6"
                      onClick={() => {
                        setIsExportDropdownOpen(false);
                        const res = exportAssessmentToJSON(instance, report);
                        if (res?.success) toast.success('📦 Raw JSON export saved!');
                      }}
                    >
                      <span style={{ fontSize: "1.1rem" }}>📦</span> Raw JSON Payload
                    </DropdownItemBtn>

                    <DropdownDividerLine $theme={theme} />

                    <DropdownItemBtn 
                      $theme={theme} 
                      $accentColor="#ec4899"
                      style={{ background: theme === 'dark' ? 'rgba(236, 72, 153, 0.15)' : '#fdf2f8', fontWeight: 700 }}
                      onClick={async () => {
                        setIsExportDropdownOpen(false);
                        toast.loading('Generating complete deliverable bundle...', { id: 'bundle-export' });
                        await exportCompleteDeliverablesBundle(instance, report, { exportDynamicAssessmentToExcel, generateDynamicPDFReport, exportAssessmentToPPTX });
                        toast.success('🗂️ All Deliverables Package exported!', { id: 'bundle-export', duration: 4000 });
                      }}
                    >
                      <span style={{ fontSize: "1.1rem" }}>🗂️</span> 1-Click All Deliverables Bundle
                    </DropdownItemBtn>

                    <DropdownItemBtn 
                      $theme={theme} 
                      onClick={() => { setIsExportDropdownOpen(false); window.print(); }}
                    >
                      <span style={{ fontSize: "1.1rem" }}>🖨️</span> Print / Save Page
                    </DropdownItemBtn>
                  </DropdownMenuCard>
                )}
              </AnimatePresence>
            </DropdownWrapper>
          </div>
        </div>

        {/* Interactive What-If Scenario Simulator */}
        <AnimatePresence>
          {showSimulator && Object.keys(dimensionScoresForSimulator).length > 0 && (
            <ScenarioSimulator
              initialScores={dimensionScoresForSimulator}
              onSimulateChange={(newTargets) => setSimulatedTargets(newTargets)}
              isDynamic={true}
            />
          )}
        </AnimatePresence>

        {/* Promote to Assessment Type Banner */}
        {!isPromoted && !framework?.isPromoted && !['openai_to_gemini_enterprise_migration', 'finops_cloud_cost_optimization', 'enterprise_ai_zero_trust_security', 'edw_lakehouse_to_bigquery_modernization', 'agentic_ai_mesh_mcp_banking_readiness'].includes(framework?.typeKey) && (
        <PromoteBanner>
          <PromoteInfo>
            <SparkleIconWrap>
              <HiSparkles />
            </SparkleIconWrap>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#ffffff', marginBottom: '4px' }}>
                Like this assessment framework?
              </h3>
              <p style={{ color: '#cbd5e1', fontSize: '0.9rem', margin: 0 }}>
                Promote "{framework?.title}" as an official Assessment Type so it appears in the top navigation for all future client engagements.
              </p>
            </div>
          </PromoteInfo>

          <PromoteBtn onClick={handlePromoteFramework} disabled={isPromoted}>
            {isPromoted ? <FiCheck /> : <FiAward />}
            {isPromoted ? 'Promoted to Navbar' : 'Promote as Assessment Type'}
          </PromoteBtn>
        </PromoteBanner>
        )}

                {/* AI Voice / Audio Narrative Briefing */}
        <AudioBriefingPlayer instance={instance} report={report} theme={theme} />

        {/* Hero Card */}
        <HeroCard $theme={theme}>
          <HeroHeader>
            <div>
              <HeroBadge $theme={theme}>
                <FiAward /> {framework?.badge || "Maturity Assessment"}
              </HeroBadge>
              <HeroTitle $theme={theme}>{framework?.title}</HeroTitle>
              <HeroMeta $theme={theme}>
                <span><FiUser /> Customer: <strong>{instance.customerName}</strong></span>
                {instance.useCase && <span><FiTarget /> Initiative: <strong>{instance.useCase}</strong></span>}
                <span><FiCalendar /> Completed: <strong>{new Date(instance.completedAt || instance.createdAt).toLocaleDateString()}</strong></span>
                <span><HiSparkles /> Evaluated by: <strong>Gemini 3.7</strong></span>
              </HeroMeta>
            </div>

            <ScoreSection $theme={theme}>
              <div>
                <LevelBadge $theme={theme}>{scores.maturityLevel} Stage</LevelBadge>
                <div style={{ color: "#94a3b8", fontSize: "0.85rem" }}>Overall Maturity Index</div>
              </div>
              <ScoreBig>{scores.overallScore}</ScoreBig>
              <div style={{ color: "#64748b", fontSize: "1.2rem", fontWeight: "700" }}>/ 5.0</div>
            </ScoreSection>
          </HeroHeader>
        </HeroCard>

        {/* Executive Segmented Tab Navigation */}
        <ExecutiveTabContainer $theme={theme} className="no-print">
          <ExecutiveTabButton $theme={theme} 
            $isActive={activeExecutiveTab === "overview"} 
            onClick={() => setActiveExecutiveTab("overview")}
          >
            📊 Executive Overview & Radar
          </ExecutiveTabButton>
          <ExecutiveTabButton $theme={theme} 
            $isActive={activeExecutiveTab === "architecture"} 
            onClick={() => setActiveExecutiveTab("architecture")}
          >
            🏛️ Architecture Evolution (Current vs Target)
          </ExecutiveTabButton>
          <ExecutiveTabButton $theme={theme} 
            $isActive={activeExecutiveTab === "financial"} 
            onClick={() => setActiveExecutiveTab("financial")}
          >
            💰 Financial Impact & TCO
          </ExecutiveTabButton>
          <ExecutiveTabButton $theme={theme} 
            $isActive={activeExecutiveTab === "roadmap"} 
            onClick={() => setActiveExecutiveTab("roadmap")}
          >
            🚀 Roadmap & Persona Blueprints
          </ExecutiveTabButton>
          <ExecutiveTabButton $theme={theme} 
            $isActive={activeExecutiveTab === "audit"} 
            onClick={() => setActiveExecutiveTab("audit")}
          >
            📋 Question Responses Audit
          </ExecutiveTabButton>
          <ExecutiveTabButton $theme={theme} 
            $isActive={activeExecutiveTab === "all"} 
            onClick={() => setActiveExecutiveTab("all")}
            title="Display all executive sections in a single unified dossier view"
          >
            📑 Full Dossier (All Sections)
          </ExecutiveTabButton>
        </ExecutiveTabContainer>

        {/* ========================================================================= */}
        {/* TAB 1: EXECUTIVE OVERVIEW & RADAR                                         */}
        {/* ========================================================================= */}
        {(activeExecutiveTab === "overview" || activeExecutiveTab === "all") && (
          <div>
            {/* Multi-Axis Polar Radar & Dimensional Gap Topology */}
            <DynamicRadarChart theme={theme}
              dimensions={framework?.dimensions || []}
              dimensionScores={simulatedDimensionScores}
              responses={instance.responses || {}}
            />

            {/* Executive Capability vs Operational Risk Heatmap Matrix */}
            <ExecutiveHeatmapMatrix theme={theme}
              dimensions={framework?.dimensions || []}
              dimensionScores={simulatedDimensionScores}
              responses={instance.responses || {}}
            />

            {/* Two Column Section: Executive Summary & Dimension Scores */}
            <TwoColGrid>
              {/* Executive Summary */}
              <Card $theme={theme}>
                <CardTitle $theme={theme}>
                  <FiFileText color="#38bdf8" /> Executive Summary
                </CardTitle>
                <ExecutiveSummaryText $theme={theme}>
                  {typeof report.executiveSummary === "string" 
                    ? report.executiveSummary.split("\n\n").map((p, idx) => (
                        <p key={idx}>{p}</p>
                      ))
                    : <p>Assessment evaluation completed successfully.</p>
                  }
                </ExecutiveSummaryText>
              </Card>

              {/* Dimension Maturity Breakdown */}
              <Card $theme={theme}>
                <CardTitle $theme={theme}>
                  <FiLayers color="#818cf8" /> Dimension Maturity Breakdown
                </CardTitle>
                {Object.values(scores.dimensionScores || {}).map((dim, idx) => (
                  <DimensionBarRow key={dim.id || idx}>
                    <DimHeader $theme={theme}>
                      <span>{dim.name}</span>
                      <span style={{ color: "#38bdf8" }}>{dim.score} / 5.0 ({dim.percentage}%)</span>
                    </DimHeader>
                    <ProgressBarTrack $theme={theme}>
                      <ProgressBarFill $pct={dim.percentage} />
                    </ProgressBarTrack>
                  </DimensionBarRow>
                ))}
              </Card>
            </TwoColGrid>

            {/* Strengths & Constraints */}
            <TwoColGrid>
              {/* Strengths */}
              <Card $theme={theme}>
                <CardTitle $theme={theme}>
                  <FiCheckCircle color="#10b981" /> Identified Core Strengths
                </CardTitle>
                {(report.keyStrengths || []).map((str, idx) => (
                  <CalloutBox $theme={theme} key={idx} $type="strength">
                    <FiCheckCircle />
                    <div>{str}</div>
                  </CalloutBox>
                ))}
              </Card>

              {/* Constraints & Gaps */}
              <Card $theme={theme}>
                <CardTitle $theme={theme}>
                  <FiAlertTriangle color="#ef4444" /> Critical Bottlenecks & Gaps
                </CardTitle>
                {(report.criticalConstraints || []).map((con, idx) => (
                  <CalloutBox $theme={theme} key={idx} $type="constraint">
                    <FiAlertTriangle />
                    <div>{con}</div>
                  </CalloutBox>
                ))}
              </Card>
            </TwoColGrid>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: ARCHITECTURE EVOLUTION (CURRENT VS TARGET)                         */}
        {/* ========================================================================= */}
        {(activeExecutiveTab === "architecture" || activeExecutiveTab === "all") && (
          <div>
            {/* Architectural Evolution Blueprint: Current vs Target */}
            <ArchitectureComparisonDiagram theme={theme}
              instanceId={instance?.id}
              initialDiagrams={report?.architectureDiagrams}
              currentScore={scores.overallScore || 2.5}
              targetScore={simulatedOverallTarget}
              customerName={instance?.customerName}
              useCase={instance?.useCase}
              framework={framework}
            />

            {/* 1-Click Infrastructure-as-Code (IaC) Cloud Deployer */}
            <IaCBlueprintCard
              organizationName={instance?.customerName || framework?.title || "Enterprise Platform"}
              currentScore={scores.overallScore || 2.5}
              targetScore={4.5}
              framework={framework}
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: FINANCIAL IMPACT & TCO                                             */}
        {/* ========================================================================= */}
        {(activeExecutiveTab === "financial" || activeExecutiveTab === "all") && (
          <div>
            {/* Quantified Financial & TCO Impact Engine */}
            <FinancialImpactCard theme={theme}
              pillarScores={simulatedDimensionScores}
              framework={framework}
              overallCurrent={scores.overallScore || 2.5}
              overallTarget={simulatedOverallTarget}
            />

            {/* Industry Peer Benchmarking & Percentile Distribution Matrix */}
            <IndustryPeerBenchmarkingCard theme={theme}
              instanceId={instance?.id}
              defaultIndustry={framework?.badge || "Retail & E-Commerce"}
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: ROADMAP & PERSONA BLUEPRINTS                                      */}
        {/* ========================================================================= */}
        {(activeExecutiveTab === "roadmap" || activeExecutiveTab === "all") && (
          <div>
            {/* Multi-Persona Executive Transformation Blueprints */}
            <MultiPersonaViews theme={theme}
              assessmentName={framework?.title || "Enterprise Data Platform"}
              currentScore={scores.overallScore || 2.5}
              targetScore={simulatedOverallTarget}
              aiReport={report}
              framework={framework}
              scores={{ ...scores, dimensionScores: simulatedDimensionScores, targetScore: simulatedOverallTarget }}
            />

            {/* 1-Click Transformation Backlog Exporter */}
            <BacklogExporterCard
              assessmentName={framework?.title || "Enterprise Data & AI Maturity Assessment"}
              recommendations={report.prioritizedRecommendations || report.prioritizedActions || []}
            />

            {/* Strategic Transformation Roadmap */}
            {report.transformationRoadmap && (
              <Card $theme={theme} style={{ marginBottom: "32px" }}>
                <CardTitle $theme={theme}>
                  <FiTrendingUp color="#38bdf8" /> Strategic Transformation Roadmap
                </CardTitle>

                <RoadmapGrid>
                  {["phase1", "phase2", "phase3"].map((pKey) => {
                    const phase = report.transformationRoadmap[pKey];
                    if (!phase) return null;
                    return (
                      <RoadmapCard key={pKey} $theme={theme}>
                        <RoadmapPhase $theme={theme}>{phase.title}</RoadmapPhase>
                        <RoadmapTimeline $theme={theme}>{phase.timeline}</RoadmapTimeline>
                        <p style={{ fontSize: "0.875rem", color: theme === 'dark' ? "#94a3b8" : "#475569", marginBottom: "16px", lineHeight: "1.5" }}>{phase.focus}</p>

                        <MilestoneList>
                          {(phase.milestones || []).map((m, mIdx) => (
                            <MilestoneItem key={mIdx} $theme={theme}>
                              <FiCheck size={16} />
                              <span>{m}</span>
                            </MilestoneItem>
                          ))}
                        </MilestoneList>
                      </RoadmapCard>
                    );
                  })}
                </RoadmapGrid>
              </Card>
            )}

            {/* Prioritized Recommendations */}
            {report.prioritizedRecommendations && report.prioritizedRecommendations.length > 0 && (
              <Card $theme={theme} style={{ marginBottom: "32px" }}>
                <CardTitle $theme={theme}>
                  <FiTarget color="#10b981" /> Prioritized High-Impact Action Plan
                </CardTitle>

                {report.prioritizedRecommendations.map((rec, idx) => (
                  <RecommendationCard key={rec.id || idx} $theme={theme}>
                    <RecHeader>
                      <RecTitle $theme={theme}>{rec.title}</RecTitle>
                      <PriorityBadge $priority={rec.priority}>{rec.priority || "High"} Priority</PriorityBadge>
                    </RecHeader>

                    <p style={{ color: theme === 'dark' ? "#cbd5e1" : "#334155", fontSize: "0.95rem", marginBottom: "14px", lineHeight: "1.5" }}>
                      <strong style={{ color: theme === 'dark' ? "#ffffff" : "#0f172a" }}>Strategic Rationale:</strong> {rec.whyItMatters}
                    </p>

                    {rec.actionSteps && rec.actionSteps.length > 0 && (
                      <div style={{ marginBottom: "12px" }}>
                        <div style={{ fontSize: "0.85rem", fontWeight: "700", color: theme === 'dark' ? "#94a3b8" : "#1e293b", marginBottom: "6px" }}>
                          Recommended Action Steps:
                        </div>
                        <ul style={{ paddingLeft: "20px", color: theme === 'dark' ? "#cbd5e1" : "#334155", fontSize: "0.9rem", margin: 0, lineHeight: "1.5" }}>
                          {rec.actionSteps.map((step, sIdx) => (
                            <li key={sIdx} style={{ marginBottom: "4px" }}>{step}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {rec.expectedImpact && (
                      <div style={{ fontSize: "0.85rem", color: theme === 'dark' ? "#38bdf8" : "#0284c7", marginTop: "10px", fontWeight: "600" }}>
                        ⚡ <strong>Expected Impact:</strong> {rec.expectedImpact}
                      </div>
                    )}
                  </RecommendationCard>
                ))}
              </Card>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: QUESTION RESPONSES AUDIT DOSSIER                                   */}
        {/* ========================================================================= */}
        {(activeExecutiveTab === "audit" || activeExecutiveTab === "all") && (
          <Card $theme={theme} style={{ marginBottom: "32px" }}>
            <CardTitle $theme={theme}>
              <FiCheckCircle color="#0284c7" /> Granular Question Audit & Operational Context
            </CardTitle>
            <p style={{ color: theme === 'dark' ? "#94a3b8" : "#64748b", fontSize: "0.92rem", marginBottom: "24px" }}>
              Complete record of dimensional question responses, baseline ratings, target horizons, identified technical/business pain points, and lead architect audit notes.
            </p>

            {(framework?.dimensions || []).map((dim, dIdx) => (
              <div key={dim.id || dIdx} style={{ 
                background: theme === 'dark' ? "rgba(15, 23, 42, 0.6)" : "#ffffff", 
                border: theme === 'dark' ? "1px solid rgba(255,255,255,0.08)" : "1.5px solid #e2e8f0", 
                borderRadius: "16px", 
                padding: "20px", 
                marginBottom: "20px",
                boxShadow: theme === 'dark' ? "none" : "0 2px 8px rgba(0,0,0,0.03)"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: theme === 'dark' ? "1px solid rgba(255,255,255,0.08)" : "1px solid #f1f5f9", paddingBottom: "12px" }}>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: theme === 'dark' ? "#ffffff" : "#0f172a", margin: 0 }}>
                    {dim.name}
                  </h3>
                  <span style={{ 
                    background: theme === 'dark' ? "rgba(56, 189, 248, 0.15)" : "#e0f2fe", 
                    color: theme === 'dark' ? "#38bdf8" : "#0369a1", 
                    border: theme === 'dark' ? "none" : "1px solid #bae6fd",
                    padding: "4px 12px", 
                    borderRadius: "9999px", 
                    fontSize: "0.85rem", 
                    fontWeight: 700 
                  }}>
                    Dimension Score: {scores.dimensionScores?.[dim.id]?.score || 2.5} / 5.0
                  </span>
                </div>

                {(dim.questions || []).map((q, qIdx) => {
                  const val = instance.responses?.[q.id] || instance.responses?.[q.id + "_current_state"] || 2;
                  const futureVal = instance.responses?.[q.id + "_future_state"] || 4;
                  const selectedOpt = (q.options || []).find(o => o.value === val || o.score === val);
                  const comment = instance.responses?.[q.id + "_comment"];
                  const techPain = instance.responses?.[q.id + "_technical_pain"] || [];
                  const bizPain = instance.responses?.[q.id + "_business_pain"] || [];

                  return (
                    <div key={q.id || qIdx} style={{ 
                      background: theme === 'dark' ? "rgba(30, 41, 59, 0.4)" : "#f8fafc", 
                      borderRadius: "12px", 
                      padding: "14px 16px", 
                      marginBottom: "12px", 
                      border: theme === 'dark' ? "1px solid rgba(255,255,255,0.05)" : "1px solid #e2e8f0" 
                    }}>
                      <div style={{ fontSize: "0.95rem", fontWeight: 700, color: theme === 'dark' ? "#e2e8f0" : "#1e293b", marginBottom: "8px" }}>
                        Q{qIdx + 1}: {q.text}
                      </div>
                      
                      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "10px" }}>
                        <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#dc2626", background: "#fef2f2", border: "1px solid #fecaca", padding: "3px 10px", borderRadius: "6px" }}>
                          Current Baseline: <strong>{val}/5.0</strong>
                        </span>
                        <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#15803d", background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "3px 10px", borderRadius: "6px" }}>
                          Target Horizon: <strong>{futureVal}/5.0</strong>
                        </span>
                      </div>

                      {selectedOpt && (
                        <div style={{ fontSize: "0.86rem", color: theme === 'dark' ? "#cbd5e1" : "#334155", marginBottom: "8px", lineHeight: "1.4" }}>
                          <strong style={{ color: theme === 'dark' ? '#ffffff' : '#0f172a' }}>Evaluated State:</strong> {selectedOpt.label}
                        </div>
                      )}

                      {techPain.length > 0 && (
                        <div style={{ fontSize: "0.82rem", color: "#b91c1c", background: "#fff1f2", border: "1px solid #ffe4e6", borderRadius: "6px", padding: "6px 10px", marginBottom: "6px", lineHeight: "1.35" }}>
                          ⚠️ <strong>Technical Friction:</strong> {techPain.join("; ")}
                        </div>
                      )}

                      {bizPain.length > 0 && (
                        <div style={{ fontSize: "0.82rem", color: "#b45309", background: "#fffbeb", border: "1px solid #fef3c7", borderRadius: "6px", padding: "6px 10px", marginBottom: "6px", lineHeight: "1.35" }}>
                          💼 <strong>Business Risk:</strong> {bizPain.join("; ")}
                        </div>
                      )}

                      {comment && (
                        <div style={{ fontSize: "0.84rem", color: "#475569", background: "#f1f5f9", borderLeft: "3px solid #0ea5e9", borderRadius: "4px", padding: "6px 12px", marginTop: "8px" }}>
                          📝 <strong>Architect Notes:</strong> "{comment}"
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </Card>
        )}

        {/* Fullscreen 16:9 Presentation Deck Modal */}
        <PresentationModeModal
          isOpen={isPresentationOpen}
          onClose={() => setIsPresentationOpen(false)}
          instance={instance}
          report={report}
          framework={framework}
        />

        {/* Gmail/Drive-Style Unified Document Preview & Cloud Hub */}
        <UnifiedDocumentPreviewModal
          isOpen={previewDocState.isOpen}
          initialDocType={previewDocState.type}
          onClose={() => setPreviewDocState(prev => ({ ...prev, isOpen: false }))}
          instance={instance}
          report={report}
          framework={framework}
        />
      </Wrapper>
    </Container>
  );
};

export default DynamicAssessmentReport;
