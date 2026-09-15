import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { 
  FiShield, 
  FiCheckCircle, 
  FiAlertTriangle, 
  FiAlertOctagon, 
  FiFileText, 
  FiAward, 
  FiLayers, 
  FiArrowLeft, 
  FiArrowRight, 
  FiSave, 
  FiRotateCcw, 
  FiPrinter, 
  FiDownload, 
  FiExternalLink, 
  FiInfo, 
  FiUser, 
  FiClock, 
  FiFilter, 
  FiCheckSquare, 
  FiSquare,
  FiZap,
  FiChevronDown,
  FiChevronRight,
  FiMic,
  FiPlay,
  FiPause,
  FiMessageSquare,
  FiCopy,
  FiCheck,
  FiX,
  FiRefreshCw,
  FiDollarSign,
  FiCalendar,
  FiBookOpen,
  FiVolume2,
  FiVolumeX,
  FiSend,
  FiCode,
  FiPlus
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import toast from 'react-hot-toast';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

import { 
  EU_AI_SECTIONS, 
  EU_AI_QUESTIONS, 
  SAMPLE_HIGH_RISK_HR_EVALUATION,
  EU_AI_CATEGORY_PRESETS
} from '../data/euAiComplianceData';
import { evaluateCompliance } from '../services/euAiScoringEngine';

// ==========================================
// STYLED COMPONENTS (Zero Void, Full Desktop)
// ==========================================

const WorkspaceWrapper = styled.div`
  min-height: 100vh;
  background: #f8fafc;
  color: #0f172a;
  padding-top: 68px; /* GlobalNav clearance */
  padding-bottom: 80px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const TopStickyBar = styled.div`
  position: sticky;
  top: 68px;
  z-index: 40;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
  width: 100%;
`;

const TopBarInner = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  padding: 14px 24px md:padding: 16px 32px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

const BrandBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const EuroFlagBadge = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
  color: #fbbf24;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.25rem;
  box-shadow: 0 4px 10px rgba(30, 58, 138, 0.25);
  flex-shrink: 0;
`;

const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
`;

const MainHeading = styled.h1`
  font-size: 1.25rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  letter-spacing: -0.01em;

  @media (min-width: 768px) {
    font-size: 1.4rem;
  }
`;

const SubHeading = styled.span`
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 500;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
`;

const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 16px;
  border-radius: 9px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.18s ease;
  white-space: nowrap;

  ${props => props.$primary && `
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    color: #ffffff;
    border: 1px solid #1d4ed8;
    box-shadow: 0 2px 6px rgba(37, 99, 235, 0.25);

    &:hover {
      background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35);
    }
  `}

  ${props => props.$sample && `
    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
    color: #ffffff;
    border: 1px solid #6d28d9;
    box-shadow: 0 2px 6px rgba(139, 92, 246, 0.25);

    &:hover {
      background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(139, 92, 246, 0.35);
    }
  `}

  ${props => props.$secondary && `
    background: #ffffff;
    color: #334155;
    border: 1px solid #cbd5e1;

    &:hover {
      background: #f1f5f9;
      border-color: #94a3b8;
    }
  `}

  ${props => props.$gemini && `
    background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #2563eb 100%);
    color: #ffffff;
    border: 1px solid #4338ca;
    box-shadow: 0 2px 8px rgba(79, 70, 229, 0.3);

    &:hover {
      background: linear-gradient(135deg, #4338ca 0%, #6d28d9 50%, #1d4ed8 100%);
      transform: translateY(-1px);
      box-shadow: 0 4px 14px rgba(79, 70, 229, 0.45);
    }
  `}

  ${props => props.$audio && `
    background: #0f172a;
    color: #38bdf8;
    border: 1px solid #334155;
    box-shadow: 0 2px 6px rgba(15, 23, 42, 0.2);

    &:hover {
      background: #1e293b;
      border-color: #38bdf8;
      transform: translateY(-1px);
    }
  `}

  ${props => props.$copilot && `
    background: #eff6ff;
    color: #1d4ed8;
    border: 1px solid #bfdbfe;

    &:hover {
      background: #dbeafe;
      border-color: #93c5fd;
      transform: translateY(-1px);
    }
  `}
`;

const CategoryDropdownContainer = styled.div`
  position: relative;
  display: inline-flex;
`;

const CategoryDropdownTrigger = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 9px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.18s ease;
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: #ffffff;
  border: 1px solid #6d28d9;
  box-shadow: 0 2px 6px rgba(139, 92, 246, 0.25);

  &:hover {
    background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.35);
  }
`;

const CategoryDropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 460px;
  max-height: 520px;
  overflow-y: auto;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 14px;
  box-shadow: 0 20px 40px -10px rgba(15, 23, 42, 0.22), 0 4px 12px rgba(15, 23, 42, 0.08);
  z-index: 120;
  padding: 10px;
`;

const CategoryMenuHeader = styled.div`
  padding: 8px 12px 10px;
  border-bottom: 1px solid #f1f5f9;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.78rem;
  font-weight: 800;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const CategoryMenuItem = styled.button`
  width: 100%;
  text-align: left;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid ${props => props.$active ? '#8b5cf6' : 'transparent'};
  background: ${props => props.$active ? '#f5f3ff' : '#ffffff'};
  cursor: pointer;
  transition: all 0.14s ease;
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 4px;

  &:hover {
    background: ${props => props.$active ? '#ede9fe' : '#f8fafc'};
    border-color: ${props => props.$active ? '#8b5cf6' : '#e2e8f0'};
  }
`;

const CategoryItemTopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const CategoryItemTitle = styled.span`
  font-size: 0.85rem;
  font-weight: 700;
  color: #0f172a;
`;

const CategoryBadge = styled.span`
  font-size: 0.68rem;
  font-weight: 800;
  padding: 2px 7px;
  border-radius: 6px;
  background: ${props => props.$color ? `${props.$color}15` : '#f1f5f9'};
  color: ${props => props.$color || '#334155'};
  border: 1px solid ${props => props.$color ? `${props.$color}40` : '#cbd5e1'};
  white-space: nowrap;
`;

const CategoryItemDesc = styled.span`
  font-size: 0.76rem;
  color: #64748b;
  line-height: 1.35;
`;

const NavTabsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background: #f1f5f9;
  padding: 4px;
  border-radius: 10px;
`;

const NavTab = styled.button`
  padding: 6px 14px;
  border-radius: 7px;
  font-size: 0.82rem;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: all 0.16s ease;
  display: flex;
  align-items: center;
  gap: 6px;

  ${props => props.$active ? `
    background: #ffffff;
    color: #0f172a;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  ` : `
    background: transparent;
    color: #64748b;
    &:hover {
      color: #0f172a;
    }
  `}
`;

const ContentContainer = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  padding: 24px 20px md:padding: 32px 36px;
`;

const ProgressBanner = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 16px 20px;
  margin-bottom: 24px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
`;

const ProgressBarWrapper = styled.div`
  flex: 1;
  min-width: 240px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const ProgressTrack = styled.div`
  width: 100%;
  height: 8px;
  background: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${props => props.$pct}%;
  background: linear-gradient(90deg, #2563eb, #38bdf8);
  border-radius: 999px;
  transition: width 0.3s ease;
`;

// ==========================================
// QUESTIONNAIRE LAYOUT
// ==========================================

const QuestionnaireGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 28px;

  @media (min-width: 1024px) {
    grid-template-columns: 320px 1fr;
    align-items: start;
  }
`;

const SectionNavPanel = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);

  @media (min-width: 1024px) {
    position: sticky;
    top: 156px;
    max-height: calc(100vh - 180px);
    overflow-y: auto;
  }
`;

const SectionNavItem = styled.button`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  border: none;
  background: ${props => props.$active ? '#eff6ff' : 'transparent'};
  color: ${props => props.$active ? '#1e40af' : '#475569'};
  text-align: left;
  cursor: pointer;
  transition: all 0.16s ease;
  font-size: 0.83rem;
  font-weight: ${props => props.$active ? '700' : '500'};

  &:hover {
    background: #f1f5f9;
  }
`;

const SectionNumBadge = styled.span`
  width: 20px;
  height: 20px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.72rem;
  font-weight: 800;
  flex-shrink: 0;
  margin-top: 1px;
  background: ${props => props.$done ? '#dcfce7' : (props.$active ? '#3b82f6' : '#e2e8f0')};
  color: ${props => props.$done ? '#166534' : (props.$active ? '#ffffff' : '#64748b')};
`;

const QuestionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
`;

const QuestionCard = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  padding: 24px md:padding: 28px;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.03);
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const QuestionHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 14px;
  border-bottom: 1px solid #f1f5f9;
`;

const ArticleBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: #eff6ff;
  color: #1d4ed8;
  font-size: 0.74rem;
  font-weight: 800;
  padding: 4px 9px;
  border-radius: 6px;
  border: 1px solid #bfdbfe;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const QuestionTitle = styled.h3`
  font-size: 1.15rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
  line-height: 1.35;
`;

const StatutoryScopeText = styled.p`
  font-size: 0.88rem;
  color: #64748b;
  margin: 0;
  font-style: italic;
`;

const OptionsGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Level1OptionCard = styled.div`
  border: 2px solid ${props => props.$selected ? '#3b82f6' : '#e2e8f0'};
  background: ${props => props.$selected ? '#f8faff' : '#ffffff'};
  border-radius: 14px;
  padding: 16px 18px;
  cursor: pointer;
  transition: all 0.18s ease;

  &:hover {
    border-color: ${props => props.$selected ? '#2563eb' : '#cbd5e1'};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  }
`;

const Level1Content = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
`;

const RadioLabelWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
`;

const CustomRadio = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid ${props => props.$checked ? '#2563eb' : '#94a3b8'};
  background: ${props => props.$checked ? '#2563eb' : '#ffffff'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;

  &::after {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #ffffff;
    display: ${props => props.$checked ? 'block' : 'none'};
  }
`;

const OptionTextCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const OptionLabel = styled.span`
  font-size: 0.94rem;
  font-weight: 700;
  color: #0f172a;
`;

const OptionTagline = styled.span`
  font-size: 0.82rem;
  color: #64748b;
`;

const TripwireBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.72rem;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: 6px;
  background: ${props => props.$red ? '#fee2e2' : '#fef3c7'};
  color: ${props => props.$red ? '#b91c1c' : '#b45309'};
  border: 1px solid ${props => props.$red ? '#fca5a5' : '#fcd34d'};
  white-space: nowrap;
  flex-shrink: 0;
`;

const Level2Accordion = styled(motion.div)`
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px dashed #cbd5e1;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Level2Title = styled.div`
  font-size: 0.78rem;
  font-weight: 800;
  color: #1e3a8a;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const Level2SubOption = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 10px;
  background: ${props => props.$checked ? '#eff6ff' : '#f8fafc'};
  border: 1.5px solid ${props => props.$checked ? '#93c5fd' : '#e2e8f0'};
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #eff6ff;
    border-color: #bfdbfe;
  }
`;

const NotesTextarea = styled.textarea`
  width: 100%;
  min-height: 80px;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  padding: 12px 14px;
  font-size: 0.85rem;
  color: #0f172a;
  font-family: inherit;
  resize: vertical;
  box-sizing: border-box;
  outline: none;
  background: #f8fafc;
  transition: border-color 0.16s ease;

  &:focus {
    border-color: #2563eb;
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

// ==========================================
// DASHBOARD VIEW COMPONENTS
// ==========================================

const DashboardGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
`;

const KpiCardsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 18px;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1200px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const KpiCard = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 22px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
  border-top: 4px solid ${props => props.$accent || '#2563eb'};
`;

const KpiLabel = styled.span`
  font-size: 0.78rem;
  font-weight: 800;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const KpiValue = styled.div`
  font-size: 1.45rem;
  font-weight: 900;
  color: ${props => props.$color || '#0f172a'};
  line-height: 1.2;
`;

const KpiSubtitle = styled.span`
  font-size: 0.8rem;
  color: #64748b;
  line-height: 1.35;
`;

const ChartsRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1.2fr;
  }
`;

const ChartCard = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ChartCardTitle = styled.h3`
  font-size: 1.05rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const BacklogContainer = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const BacklogFiltersRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const FilterButtonsGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
`;

const FilterChip = styled.button`
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.78rem;
  font-weight: 700;
  border: 1px solid ${props => props.$active ? '#2563eb' : '#cbd5e1'};
  background: ${props => props.$active ? '#2563eb' : '#ffffff'};
  color: ${props => props.$active ? '#ffffff' : '#475569'};
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    border-color: #2563eb;
  }
`;

const TaskItemCard = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 16px;
  border-radius: 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-left: 4px solid ${props => 
    props.$severity === 'CRITICAL' ? '#ef4444' :
    props.$severity === 'HIGH' ? '#ea580c' :
    props.$severity === 'MEDIUM' ? '#f59e0b' : '#3b82f6'};
`;

const TaskContentCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const TaskMetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.75rem;
`;

const SeverityBadge = styled.span`
  padding: 2px 8px;
  border-radius: 6px;
  font-weight: 800;
  text-transform: uppercase;
  font-size: 0.7rem;
  background: ${props => 
    props.$severity === 'CRITICAL' ? '#fee2e2' :
    props.$severity === 'HIGH' ? '#ffedd5' :
    props.$severity === 'MEDIUM' ? '#fef3c7' : '#eff6ff'};
  color: ${props => 
    props.$severity === 'CRITICAL' ? '#b91c1c' :
    props.$severity === 'HIGH' ? '#c2410c' :
    props.$severity === 'MEDIUM' ? '#b45309' : '#1d4ed8'};
`;

const OwnerBadge = styled.span`
  background: #f1f5f9;
  color: #475569;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 0.72rem;
`;

const TaskTitle = styled.span`
  font-size: 0.92rem;
  font-weight: 700;
  color: #0f172a;
`;

const TaskStatusButton = styled.button`
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 700;
  border: 1px solid ${props => 
    props.$status === 'Resolved' ? '#10b981' : 
    props.$status === 'In Progress' ? '#3b82f6' : '#cbd5e1'};
  background: ${props => 
    props.$status === 'Resolved' ? '#dcfce7' : 
    props.$status === 'In Progress' ? '#eff6ff' : '#ffffff'};
  color: ${props => 
    props.$status === 'Resolved' ? '#166534' : 
    props.$status === 'In Progress' ? '#1d4ed8' : '#475569'};
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.16s ease;

  &:hover {
    filter: brightness(0.96);
  }
`;

// ==========================================
// FORMAL AUDIT REPORT (Print-Ready Layout)
// ==========================================

const ReportPaperCard = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  padding: 36px md:padding: 48px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  gap: 36px;

  @media print {
    border: none;
    box-shadow: none;
    padding: 0;
    margin: 0;
  }
`;

const ReportHeaderBlock = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  padding-bottom: 24px;
  border-bottom: 2px solid #0f172a;
`;

const MetaTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;

  th, td {
    padding: 10px 12px;
    border: 1px solid #e2e8f0;
    text-align: left;
  }

  th {
    background: #f8fafc;
    font-weight: 700;
    color: #475569;
    width: 25%;
  }

  td {
    color: #0f172a;
    font-weight: 600;
  }
`;

const ScorecardTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;

  th, td {
    padding: 12px 14px;
    border: 1px solid #e2e8f0;
    text-align: left;
  }

  th {
    background: #0f172a;
    color: #ffffff;
    font-weight: 700;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  tr:nth-child(even) {
    background: #f8fafc;
  }
`;

const StatusPill = styled.span`
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 0.72rem;
  font-weight: 800;
  display: inline-block;
  white-space: nowrap;

  ${props => props.$status?.includes('PASSED') && `
    background: #dcfce7;
    color: #166534;
    border: 1px solid #bbf7d0;
  `}

  ${props => props.$status?.includes('REMEDIATION') && `
    background: #fef3c7;
    color: #b45309;
    border: 1px solid #fde68a;
  `}

  ${props => (props.$status?.includes('FAILED') || props.$status?.includes('PROHIBITED')) && `
    background: #fee2e2;
    color: #b91c1c;
    border: 1px solid #fca5a5;
  `}

  ${props => props.$status?.includes('RECLASSIFIED') && `
    background: #ffedd5;
    color: #c2410c;
    border: 1px solid #fed7aa;
  `}
`;

const SignatureBlockGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 24px;
  margin-top: 24px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const SignatureCard = styled.div`
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #f8fafc;
`;

const SignatureLine = styled.div`
  height: 48px;
  border-bottom: 1.5px dashed #94a3b8;
  display: flex;
  align-items: flex-end;
  font-family: 'Brush Script MT', cursive, sans-serif;
  font-size: 1.4rem;
  color: #1e3a8a;
  padding-left: 10px;
`;

// ==========================================
// GEMINI LEGAL SYNTHESIS STYLED COMPONENTS
// ==========================================

const GeminiSynthesisContainer = styled.div`
  background: #ffffff;
  border: 1px solid #c7d2fe;
  border-radius: 18px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(99, 102, 241, 0.08);
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #4f46e5, #7c3aed, #06b6d4, #3b82f6);
  }

  @media (min-width: 768px) {
    padding: 28px;
  }
`;

const SynthesisHeaderBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f1f5f9;
`;

const SynthesisBadgeGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
`;

const GeminiModelBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, #eef2ff 0%, #ede9fe 100%);
  color: #4f46e5;
  border: 1px solid #c7d2fe;
  border-radius: 999px;
  padding: 4px 12px;
  font-size: 0.76rem;
  font-weight: 800;
  letter-spacing: 0.03em;
`;

const SynthesisTabs = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  background: #f8fafc;
  padding: 6px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
`;

const SynthesisTabButton = styled.button`
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 700;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  transition: all 0.16s ease;

  ${props => props.$active ? `
    background: #ffffff;
    color: #1e40af;
    box-shadow: 0 2px 6px rgba(15, 23, 42, 0.08);
  ` : `
    background: transparent;
    color: #64748b;
    &:hover {
      background: #f1f5f9;
      color: #334155;
    }
  `}
`;

const HeroSynthesisBanner = styled.div`
  background: linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%);
  border: 1.5px dashed #a5b4fc;
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;

  @media (min-width: 768px) {
    padding: 32px;
  }
`;

const OverviewBox = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 20px;
  font-size: 0.92rem;
  line-height: 1.65;
  color: #334155;
`;

const TimelineCardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 16px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1280px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const TimelineCard = styled.div`
  border-radius: 14px;
  border: 1.5px solid ${props => props.$urgent ? '#fca5a5' : (props.$compliant ? '#86efac' : '#cbd5e1')};
  background: ${props => props.$urgent ? '#fff5f5' : (props.$compliant ? '#f0fdf4' : '#ffffff')};
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
`;

const PenaltyExposureGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const ExposureBox = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const AnnexIvCodeViewer = styled.div`
  background: #0f172a;
  color: #e2e8f0;
  border-radius: 14px;
  padding: 20px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.82rem;
  line-height: 1.6;
  max-height: 520px;
  overflow-y: auto;
  border: 1px solid #1e293b;
  position: relative;
`;

// ==========================================
// EXECUTIVE AUDIO BRIEFING STYLED COMPONENTS
// ==========================================

const AudioBriefingCard = styled.div`
  background: linear-gradient(135deg, #090d16 0%, #0f172a 100%);
  color: #f8fafc;
  border-radius: 16px;
  border: 1px solid #1e293b;
  padding: 18px 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.35);
`;

const AudioActsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
`;

const AudioActPill = styled.button`
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.16s ease;
  border: 1px solid ${props => props.$active ? '#38bdf8' : '#334155'};
  background: ${props => props.$active ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.04)'};
  color: ${props => props.$active ? '#38bdf8' : '#94a3b8'};

  &:hover {
    border-color: #38bdf8;
    color: #ffffff;
  }
`;

const AudioControlsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 14px;
`;

const PlayCircleBtn = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #38bdf8 0%, #2563eb 100%);
  color: #ffffff;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.18s ease;
  box-shadow: 0 2px 10px rgba(56, 189, 248, 0.35);

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 16px rgba(56, 189, 248, 0.5);
  }
`;

const AudioScriptContainer = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 16px;
  font-size: 0.85rem;
  line-height: 1.6;
  color: #cbd5e1;
  font-style: italic;
`;

// ==========================================
// REGULATORY COPILOT DRAWER STYLED COMPONENTS
// ==========================================

const CopilotFab = styled.button`
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 50;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  border-radius: 999px;
  background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #4f46e5 100%);
  color: #ffffff;
  border: 1px solid #60a5fa;
  font-size: 0.88rem;
  font-weight: 800;
  box-shadow: 0 8px 24px rgba(30, 58, 138, 0.45);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    transform: translateY(-2px) scale(1.03);
    box-shadow: 0 12px 30px rgba(37, 99, 235, 0.55);
  }
`;

const CopilotDrawerOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(3px);
  z-index: 60;
  display: flex;
  justify-content: flex-end;
`;

const CopilotDrawerPanel = styled.div`
  width: 480px;
  max-width: 96vw;
  height: 100%;
  background: #ffffff;
  box-shadow: -8px 0 32px rgba(15, 23, 42, 0.2);
  display: flex;
  flex-direction: column;
  z-index: 61;
`;

const CopilotHeader = styled.div`
  background: #0f172a;
  color: #f8fafc;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #1e293b;
`;

const CopilotChatList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  background: #f8fafc;
`;

// Markdown formatter for Copilot chat responses with strict DOMPurify sanitization
const formatCopilotMarkdown = (text, isUser = false) => {
  if (!text) return '';
  let str = String(text);

  if (isUser) {
    str = str.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br/>');
    return str;
  }

  // 1. Code blocks: ```lang ... ```
  str = str.replace(/```([a-zA-Z0-9_-]*)\n?([\s\S]*?)```/g, (match, lang, code) => {
    const escaped = code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return `<pre><code>${escaped}</code></pre>`;
  });

  // 2. Inline code: `code`
  str = str.replace(/`([^`]+)`/g, '<code>$1</code>');

  // 3. Horizontal rules: --- or ***
  str = str.replace(/^(?:---|---|\*\*\*|___)\s*$/gm, '<hr />');

  // 4. Headers: #, ##, ###, ####
  str = str.replace(/^#### (.*?)$/gm, '<h4>$1</h4>');
  str = str.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
  str = str.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
  str = str.replace(/^# (.*?)$/gm, '<h1>$1</h1>');

  // 5. Blockquotes: > quote
  str = str.replace(/^> (.*?)$/gm, '<blockquote>$1</blockquote>');

  // 6. Bold: **text**
  str = str.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // 7. Italic: *text* (avoid matching standalone stars or bullet points)
  str = str.replace(/(^|[^\*])\*([^\*]+?)\*([^\*]|$)/g, '$1<em>$2</em>$3');

  // 8. Links: [text](url)
  str = str.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  // 9. Lists: unordered (* or -) and ordered (1., 2., etc.)
  const lines = str.split('\n');
  let inUl = false;
  let inOl = false;
  const processed = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const ulMatch = line.match(/^(\s*)[*-]\s+(.+)$/);
    const olMatch = line.match(/^(\s*)\d+\.\s+(.+)$/);

    if (ulMatch) {
      if (inOl) { processed.push('</ol>'); inOl = false; }
      if (!inUl) {
        processed.push('<ul>');
        inUl = true;
      }
      processed.push(`<li>${ulMatch[2]}</li>`);
    } else if (olMatch) {
      if (inUl) { processed.push('</ul>'); inUl = false; }
      if (!inOl) {
        processed.push('<ol>');
        inOl = true;
      }
      processed.push(`<li>${olMatch[2]}</li>`);
    } else {
      if (inUl) { processed.push('</ul>'); inUl = false; }
      if (inOl) { processed.push('</ol>'); inOl = false; }
      processed.push(line);
    }
  }
  if (inUl) processed.push('</ul>');
  if (inOl) processed.push('</ol>');

  str = processed.join('\n');

  // Clean up breaks around block tags
  str = str.replace(/\n\n+/g, '<br/><br/>');
  str = str.replace(/\n/g, '<br/>');
  str = str.replace(/<(ul|ol)([^>]*)><br\s*\/?>/gi, '<$1$2>');
  str = str.replace(/<\/(ul|ol)>\s*<br\s*\/?>/gi, '</$1>');
  str = str.replace(/<li><br\s*\/?>/gi, '<li>');
  str = str.replace(/<br\s*\/?><li>/gi, '<li>');
  str = str.replace(/<br\s*\/><\/li>/gi, '</li>');
  str = str.replace(/<br\s*\/?>\s*<(ul|ol|li|h[1-4]|hr|blockquote|pre)([^>]*)>/gi, '<$1$2>');
  str = str.replace(/<\/(ul|ol|li|h[1-4]|hr|blockquote|pre)>\s*<br\s*\/?>/gi, '</$1>');

  return DOMPurify.sanitize(str, {
    ALLOWED_TAGS: ['strong', 'em', 'code', 'pre', 'ul', 'ol', 'li', 'a', 'p', 'br', 'span', 'div', 'h1', 'h2', 'h3', 'h4', 'hr', 'blockquote'],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'style', 'title', 'class']
  });
};

const CopilotBubble = styled.div`
  max-width: 92%;
  padding: 12px 16px;
  border-radius: 14px;
  font-size: 0.85rem;
  line-height: 1.55;
  word-break: break-word;

  ${props => props.$isUser ? `
    align-self: flex-end;
    background: #2563eb;
    color: #ffffff;
    border-bottom-right-radius: 4px;

    strong {
      color: #ffffff;
      font-weight: 700;
    }
    a {
      color: #dbeafe;
      text-decoration: underline;
    }
  ` : `
    align-self: flex-start;
    background: #ffffff;
    color: #0f172a;
    border: 1px solid #e2e8f0;
    border-bottom-left-radius: 4px;
    box-shadow: 0 2px 6px rgba(15, 23, 42, 0.05);

    h1, h2, h3, h4 {
      margin-top: 10px;
      margin-bottom: 6px;
      line-height: 1.35;
      color: #0f172a;
      &:first-child {
        margin-top: 0;
      }
    }
    h1 {
      font-size: 1.05rem;
      font-weight: 800;
      border-bottom: 1.5px solid #e2e8f0;
      padding-bottom: 4px;
    }
    h2 {
      font-size: 0.96rem;
      font-weight: 700;
      border-bottom: 1px solid #f1f5f9;
      padding-bottom: 3px;
    }
    h3 {
      font-size: 0.90rem;
      font-weight: 700;
      color: #1e293b;
    }
    h4 {
      font-size: 0.85rem;
      font-weight: 700;
      color: #334155;
    }
    strong {
      color: #0f172a;
      font-weight: 700;
    }
    em {
      color: #475569;
    }
    hr {
      border: none;
      border-top: 1px solid #e2e8f0;
      margin: 12px 0;
    }
    ul, ol {
      margin: 6px 0 10px 0;
      padding-left: 20px;
    }
    li {
      margin: 3px 0;
    }
    blockquote {
      border-left: 3px solid #6366f1;
      padding-left: 10px;
      margin: 8px 0;
      color: #475569;
      font-style: italic;
      background: #f8fafc;
      padding-top: 4px;
      padding-bottom: 4px;
      border-radius: 0 4px 4px 0;
    }
    code {
      background: #f1f5f9;
      color: #0f172a;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 0.78rem;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      border: 1px solid #e2e8f0;
    }
    pre {
      background: #0f172a;
      color: #f8fafc;
      padding: 10px 12px;
      border-radius: 8px;
      overflow-x: auto;
      font-size: 0.76rem;
      margin: 8px 0;
      code {
        background: transparent;
        color: inherit;
        padding: 0;
        border: none;
      }
    }
    a {
      color: #2563eb;
      text-decoration: underline;
      font-weight: 600;
    }
  `}
`;

const CopilotComposerRow = styled.form`
  padding: 14px 20px;
  background: #ffffff;
  border-top: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CopilotInput = styled.input`
  flex: 1;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  font-size: 0.85rem;
  outline: none;

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
  }
`;

// ==========================================
// MAIN COMPONENT EXPORT
// ==========================================

export default function EuAiComplianceWorkspace() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: routeParamId } = useParams();

  // Active view tab: 'questionnaire' | 'dashboard' | 'report'
  const [activeTab, setActiveTab] = useState('questionnaire');
  const [activeSectionId, setActiveSectionId] = useState(1);

  const generateUniqueDossierId = useCallback(() => {
    const randomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `EUAIA-2026-${randomCode}`;
  }, []);

  // Category Preset Dropdown State
  const [selectedCategoryPreset, setSelectedCategoryPreset] = useState('');
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  // Core submission state
  const [meta, setMeta] = useState({
    systemName: 'New Enterprise AI System Evaluation',
    version: 'v1.0.0',
    leadEvaluator: '',
    department: '',
    evaluationDate: new Date().toISOString().split('T')[0],
    documentId: routeParamId || 'EUAIA-2026-NEW'
  });

  const [answers, setAnswers] = useState({});
  const [taskStatusOverrides, setTaskStatusOverrides] = useState({});
  const [selectedOwnerFilter, setSelectedOwnerFilter] = useState('ALL');
  const [selectedSeverityFilter, setSelectedSeverityFilter] = useState('ALL');

  // Gemini Legal Synthesis State
  const [synthesis, setSynthesis] = useState(null);
  const [loadingSynthesis, setLoadingSynthesis] = useState(false);
  const [synthesisTab, setSynthesisTab] = useState('overview'); // 'overview' | 'statutoryRisk' | 'timeline' | 'fines' | 'annexIv'

  // Executive Audio Briefing State
  const [audioData, setAudioData] = useState(null);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [currentAct, setCurrentAct] = useState(1);
  const [showAudioScript, setShowAudioScript] = useState(false);
  const audioObjRef = useRef(null);

  // Regulatory Copilot Drawer State
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [copilotMessages, setCopilotMessages] = useState([
    {
      role: 'assistant',
      text: 'Greetings. I am your EU AI Act Regulatory Copilot powered by Gemini 3.7 Flash. I have full context of your evaluation for "' + (meta.systemName || 'this system') + '". How can I assist with Article 9–15 requirements, Article 26 deployer obligations, fine liability calculation, or Annex IV technical documentation?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [copilotInput, setCopilotInput] = useState('');
  const [copilotLoading, setCopilotLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // Load state based on URL param (:id) or auto-redirect with a fresh unique ID
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const isDemo = urlParams.get('demo') === 'high-risk-hr' || urlParams.get('demo') === 'true';
      const requestedTab = urlParams.get('tab');
      if (requestedTab && ['assessment', 'questionnaire', 'dashboard', 'report'].includes(requestedTab)) {
        setActiveTab(requestedTab === 'assessment' ? 'questionnaire' : requestedTab);
      }

      const savedSynthesis = localStorage.getItem('scorex_eu_ai_synthesis');
      if (savedSynthesis) {
        try {
          setSynthesis(JSON.parse(savedSynthesis));
        } catch (e) {}
      }

      // Case 1: Visiting /eu-ai-compliance without an ID in the URL
      if (!routeParamId) {
        if (isDemo) {
          // Demo request -> redirect to canonical sample ID
          const sampleId = 'EUAIA-2026-HR4902';
          setSelectedCategoryPreset('high_risk_hr');
          setMeta(SAMPLE_HIGH_RISK_HR_EVALUATION.meta);
          setAnswers(SAMPLE_HIGH_RISK_HR_EVALUATION.answers);
          localStorage.setItem(`scorex_eu_ai_compliance_${sampleId}`, JSON.stringify({
            meta: SAMPLE_HIGH_RISK_HR_EVALUATION.meta,
            answers: SAMPLE_HIGH_RISK_HR_EVALUATION.answers,
            taskStatusOverrides: {}
          }));
          if (!requestedTab) setActiveTab('dashboard');
          navigate(`/eu-ai-compliance/${sampleId}${window.location.search}`, { replace: true });
          return;
        } else {
          // User started a new assessment -> generate fresh unique ID and redirect
          const newId = generateUniqueDossierId();
          const freshMeta = {
            systemName: 'New Enterprise AI System Evaluation',
            version: 'v1.0.0',
            leadEvaluator: '',
            department: '',
            evaluationDate: new Date().toISOString().split('T')[0],
            documentId: newId
          };
          setSelectedCategoryPreset('');
          setMeta(freshMeta);
          setAnswers({});
          setTaskStatusOverrides({});
          localStorage.setItem(`scorex_eu_ai_compliance_${newId}`, JSON.stringify({
            meta: freshMeta,
            answers: {},
            taskStatusOverrides: {}
          }));
          navigate(`/eu-ai-compliance/${newId}${window.location.search}`, { replace: true });
          return;
        }
      }

      // Case 2: Visiting /eu-ai-compliance/:id with an explicit ID
      const matchedPreset = EU_AI_CATEGORY_PRESETS.find(p => p.meta.documentId === routeParamId);
      if (matchedPreset) {
        setSelectedCategoryPreset(matchedPreset.id);
        const savedPreset = localStorage.getItem(`scorex_eu_ai_compliance_${routeParamId}`);
        if (savedPreset) {
          const parsed = JSON.parse(savedPreset);
          setMeta({ ...(parsed.meta || matchedPreset.meta), documentId: routeParamId });
          setAnswers(parsed.answers || matchedPreset.answers);
          setTaskStatusOverrides(parsed.taskStatusOverrides || {});
        } else {
          setMeta(matchedPreset.meta);
          setAnswers(matchedPreset.answers);
          setTaskStatusOverrides({});
          localStorage.setItem(`scorex_eu_ai_compliance_${routeParamId}`, JSON.stringify({
            meta: matchedPreset.meta,
            answers: matchedPreset.answers,
            taskStatusOverrides: {}
          }));
        }
        if (isDemo && !requestedTab) {
          setActiveTab('dashboard');
        }
      } else {
        // Any other custom unique ID in URL
        setSelectedCategoryPreset('');
        const savedForId = localStorage.getItem(`scorex_eu_ai_compliance_${routeParamId}`);
        if (savedForId) {
          const parsed = JSON.parse(savedForId);
          setMeta({
            ...(parsed.meta || {}),
            documentId: routeParamId,
            systemName: parsed.meta?.systemName || 'New Enterprise AI System Evaluation'
          });
          setAnswers(parsed.answers || {});
          setTaskStatusOverrides(parsed.taskStatusOverrides || {});
        } else {
          const freshMeta = {
            systemName: 'New Enterprise AI System Evaluation',
            version: 'v1.0.0',
            leadEvaluator: '',
            department: '',
            evaluationDate: new Date().toISOString().split('T')[0],
            documentId: routeParamId
          };
          setMeta(freshMeta);
          setAnswers({});
          setTaskStatusOverrides({});
          localStorage.setItem(`scorex_eu_ai_compliance_${routeParamId}`, JSON.stringify({
            meta: freshMeta,
            answers: {},
            taskStatusOverrides: {}
          }));
        }
      }
    } catch (e) {
      console.warn('Error reading stored state:', e);
    }
  }, [routeParamId, navigate, generateUniqueDossierId]);

  // Save to localStorage per Assessment ID continuously
  const persistState = useCallback((newAnswers, newMeta, newOverrides) => {
    try {
      const currentMeta = newMeta || meta;
      const docId = currentMeta.documentId || routeParamId || 'EUAIA-2026-DEFAULT';
      const payload = JSON.stringify({
        meta: currentMeta,
        answers: newAnswers !== undefined ? newAnswers : answers,
        taskStatusOverrides: newOverrides !== undefined ? newOverrides : taskStatusOverrides
      });
      localStorage.setItem(`scorex_eu_ai_compliance_${docId}`, payload);
      localStorage.setItem('scorex_eu_ai_compliance_state', payload);
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  }, [meta, answers, taskStatusOverrides, routeParamId]);

  // Compute compliance evaluation
  const evaluation = useMemo(() => {
    return evaluateCompliance(answers, meta);
  }, [answers, meta]);

  // Handle Level 1 selection
  const handleSelectLevel1 = (questionId, l1Id) => {
    const q = EU_AI_QUESTIONS.find(x => x.id === questionId);
    const l1 = q?.options.find(o => o.id === l1Id);
    const firstL2 = l1?.subOptions?.[0]?.id || '';

    const nextAnswers = {
      ...answers,
      [questionId]: {
        ...(answers[questionId] || {}),
        level1OptionId: l1Id,
        level2OptionId: firstL2
      }
    };
    setAnswers(nextAnswers);
    persistState(nextAnswers, meta, taskStatusOverrides);
  };

  // Handle Level 2 selection
  const handleSelectLevel2 = (questionId, l2Id) => {
    const nextAnswers = {
      ...answers,
      [questionId]: {
        ...(answers[questionId] || {}),
        level2OptionId: l2Id
      }
    };
    setAnswers(nextAnswers);
    persistState(nextAnswers, meta, taskStatusOverrides);
  };

  // Handle Notes change
  const handleNotesChange = (questionId, text) => {
    const nextAnswers = {
      ...answers,
      [questionId]: {
        ...(answers[questionId] || {}),
        notes: text
      }
    };
    setAnswers(nextAnswers);
    persistState(nextAnswers, meta, taskStatusOverrides);
  };

  // Start a brand-new blank assessment with a fresh unique ID
  const handleStartNewAssessment = () => {
    const newId = generateUniqueDossierId();
    const freshMeta = {
      systemName: 'New Enterprise AI System Evaluation',
      version: 'v1.0.0',
      leadEvaluator: '',
      department: '',
      evaluationDate: new Date().toISOString().split('T')[0],
      documentId: newId
    };
    setSelectedCategoryPreset('');
    setCategoryDropdownOpen(false);
    setMeta(freshMeta);
    setAnswers({});
    setTaskStatusOverrides({});
    setSynthesis(null);
    setActiveTab('questionnaire');
    setActiveSectionId(1);
    persistState({}, freshMeta, {});
    navigate(`/eu-ai-compliance/${newId}`);
    toast.success(`➕ Started New Blank Assessment (${newId})`);
  };

  // Select any of the 8 unique EU AI Act statutory categories from dropdown
  const handleSelectCategoryPreset = (presetId) => {
    if (!presetId) {
      handleStartNewAssessment();
      return;
    }
    const preset = EU_AI_CATEGORY_PRESETS.find(p => p.id === presetId);
    if (!preset) return;
    setSelectedCategoryPreset(preset.id);
    setCategoryDropdownOpen(false);
    setMeta(preset.meta);
    setAnswers(preset.answers);
    setTaskStatusOverrides({});
    setSynthesis(null);
    persistState(preset.answers, preset.meta, {});
    navigate(`/eu-ai-compliance/${preset.meta.documentId}`);
    toast.success(`✨ Loaded Category: ${preset.shortLabel} (${preset.meta.documentId})`);
  };

  // Reset Questionnaire
  const handleReset = () => {
    if (window.confirm('Reset all questionnaire responses to a clean blank assessment with a new unique ID?')) {
      handleStartNewAssessment();
    }
  };

  // Toggle remediation task status
  const handleToggleTaskStatus = (taskId) => {
    const current = taskStatusOverrides[taskId] || 'Todo';
    const next = current === 'Todo' ? 'In Progress' : (current === 'In Progress' ? 'Resolved' : 'Todo');
    const updated = {
      ...taskStatusOverrides,
      [taskId]: next
    };
    setTaskStatusOverrides(updated);
    persistState(answers, meta, updated);
  };

  // Generate Legal Synthesis with Gemini 3.7 Flash
  const handleGenerateSynthesis = async () => {
    setLoadingSynthesis(true);
    const toastId = toast.loading('✨ Gemini 3.7 Flash synthesizing statutory legal analysis...');
    try {
      const res = await axios.post('/api/eu-ai-compliance/generate-synthesis', {
        meta,
        answers,
        evaluation
      });
      if (res.data && res.data.success && res.data.synthesis) {
        setSynthesis(res.data.synthesis);
        localStorage.setItem('scorex_eu_ai_synthesis', JSON.stringify(res.data.synthesis));
        toast.success('✅ Gemini 3.7 Flash Legal Synthesis Generated!', { id: toastId });
        if (activeTab === 'questionnaire') {
          setActiveTab('dashboard');
        }
      } else {
        toast.error('Could not generate legal synthesis. Please retry.', { id: toastId });
      }
    } catch (err) {
      console.error('Synthesis generation error:', err);
      toast.error('Synthesis error: ' + (err.response?.data?.error || err.message), { id: toastId });
    } finally {
      setLoadingSynthesis(false);
    }
  };

  // Generate & Play Audio Briefing (DeepMind TTS / Web Speech)
  const handleGenerateAudioBriefing = async (actNum = 1) => {
    setLoadingAudio(true);
    const toastId = toast.loading(`🎙️ Generating Executive Spoken Briefing (Act ${actNum})...`);
    try {
      let activeAudio = audioData;
      if (!activeAudio) {
        const res = await axios.post('/api/eu-ai-compliance/generate-audio-briefing', {
          meta,
          evaluation,
          synthesis
        });
        if (res.data && res.data.success && res.data.acts) {
          activeAudio = res.data;
          setAudioData(res.data);
        }
      }

      toast.success('🎙️ Spoken Briefing Ready', { id: toastId });
      playActAudio(activeAudio, actNum);
    } catch (err) {
      console.error('Audio generation error:', err);
      toast.error('Audio briefing error: ' + (err.response?.data?.error || err.message), { id: toastId });
    } finally {
      setLoadingAudio(false);
    }
  };

  const playActAudio = (audioObj, actNum) => {
    stopCurrentAudio();
    const act = audioObj?.acts?.find(a => a.act === actNum) || audioObj?.acts?.[actNum - 1];
    if (!act) return;

    setCurrentAct(actNum);
    setIsPlayingAudio(true);

    if (act.audioBase64) {
      try {
        const audio = new Audio(`data:${act.format || 'audio/mp3'};base64,${act.audioBase64}`);
        audioObjRef.current = audio;
        audio.play().catch(e => {
          console.warn('Audio play failed, falling back to Web Speech:', e);
          fallbackWebSpeech(act.script);
        });
        audio.onended = () => {
          setIsPlayingAudio(false);
        };
      } catch (e) {
        fallbackWebSpeech(act.script);
      }
    } else {
      fallbackWebSpeech(act.script);
    }
  };

  const fallbackWebSpeech = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const cleanText = (text || '').replace(/[*_#`]/g, '');
      const utter = new SpeechSynthesisUtterance(cleanText);
      utter.rate = 1.0;
      utter.pitch = 0.95;
      utter.onend = () => setIsPlayingAudio(false);
      utter.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utter);
    } else {
      setIsPlayingAudio(false);
    }
  };

  const stopCurrentAudio = () => {
    if (audioObjRef.current) {
      audioObjRef.current.pause();
      audioObjRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
  };

  // Regulatory Copilot Chat
  const handleSendCopilotMessage = async (overrideText) => {
    const text = (overrideText || copilotInput).trim();
    if (!text || copilotLoading) return;

    const userMsg = {
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...copilotMessages, userMsg];
    setCopilotMessages(newMessages);
    setCopilotInput('');
    setCopilotLoading(true);

    try {
      const res = await axios.post('/api/eu-ai-compliance/copilot-chat', {
        message: text,
        history: newMessages.slice(-6),
        context: { meta, evaluation, synthesis }
      });

      if (res.data && res.data.success) {
        setCopilotMessages([
          ...newMessages,
          {
            role: 'assistant',
            text: res.data.reply,
            articleRef: res.data.articleRef,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    } catch (err) {
      console.error('Copilot chat error:', err);
      setCopilotMessages([
        ...newMessages,
        {
          role: 'assistant',
          text: 'I encountered an issue connecting to the statutory analysis engine: ' + (err.response?.data?.error || err.message),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setCopilotLoading(false);
    }
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return evaluation.remediationTasks.map(t => ({
      ...t,
      status: taskStatusOverrides[t.id] || t.status
    })).filter(t => {
      if (selectedOwnerFilter !== 'ALL' && t.targetOwner !== selectedOwnerFilter) return false;
      if (selectedSeverityFilter !== 'ALL' && t.severity !== selectedSeverityFilter) return false;
      return true;
    });
  }, [evaluation.remediationTasks, taskStatusOverrides, selectedOwnerFilter, selectedSeverityFilter]);

  // Radar chart data
  const radarChartData = useMemo(() => {
    return Object.keys(evaluation.vectorBreakdown).map(k => ({
      vector: evaluation.vectorBreakdown[k].name.split(' (')[0],
      score: evaluation.vectorBreakdown[k].score,
      target: 85
    }));
  }, [evaluation.vectorBreakdown]);

  // Bar chart data
  const barChartData = useMemo(() => {
    return Object.keys(evaluation.vectorBreakdown).map(k => ({
      name: evaluation.vectorBreakdown[k].name.split(' (')[0],
      Score: evaluation.vectorBreakdown[k].score,
      Benchmark: 75
    }));
  }, [evaluation.vectorBreakdown]);

  // Progress calculations
  const answeredQuestions = Object.keys(answers).filter(k => answers[k]?.level1OptionId).length;
  const progressPct = Math.round((answeredQuestions / EU_AI_QUESTIONS.length) * 100);

  return (
    <WorkspaceWrapper>
      {/* ================= STICKY TOP HEADER ================= */}
      <TopStickyBar>
        <TopBarInner>
          <BrandBlock>
            <EuroFlagBadge>★</EuroFlagBadge>
            <TitleBlock>
              <MainHeading>
                EU AI Act Compliance & Audit Engine
              </MainHeading>
              <SubHeading>
                Regulation (EU) 2024/1689 • Statutory Decision Tree & Conformity Workspace
              </SubHeading>
            </TitleBlock>
          </BrandBlock>

          <HeaderActions>
            <NavTabsRow>
              <NavTab 
                $active={activeTab === 'questionnaire'}
                onClick={() => setActiveTab('questionnaire')}
              >
                <FiFileText size={14} />
                Questionnaire ({answeredQuestions}/20)
              </NavTab>
              <NavTab 
                $active={activeTab === 'dashboard'}
                onClick={() => setActiveTab('dashboard')}
              >
                <FiShield size={14} />
                Compliance Dashboard
              </NavTab>
              <NavTab 
                $active={activeTab === 'report'}
                onClick={() => setActiveTab('report')}
              >
                <FiAward size={14} />
                Formal Audit Dossier
              </NavTab>
            </NavTabsRow>

            <ActionButton 
              $primary
              onClick={handleStartNewAssessment}
              title="Start a fresh blank EU AI Act compliance assessment with a new unique Dossier ID"
            >
              <FiPlus size={15} />
              New Assessment
            </ActionButton>

            <CategoryDropdownContainer>
              <CategoryDropdownTrigger
                onClick={() => setCategoryDropdownOpen(prev => !prev)}
                title="Select from 8 distinct EU AI Act statutory risk & domain categories"
                data-testid="category-dropdown-trigger"
              >
                <HiSparkles size={15} />
                {selectedCategoryPreset
                  ? `Category: ${EU_AI_CATEGORY_PRESETS.find(p => p.id === selectedCategoryPreset)?.shortLabel || 'Custom'}`
                  : '✨ Select AI Category Preset (8)'}
                <FiChevronDown size={14} />
              </CategoryDropdownTrigger>

              {categoryDropdownOpen && (
                <CategoryDropdownMenu data-testid="category-dropdown-menu">
                  <CategoryMenuHeader>
                    <span>EU AI Act Statutory Categories (8 Unique Profiles)</span>
                    <button
                      onClick={() => setCategoryDropdownOpen(false)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                    >
                      <FiX size={14} />
                    </button>
                  </CategoryMenuHeader>
                  {EU_AI_CATEGORY_PRESETS.map(preset => (
                    <CategoryMenuItem
                      key={preset.id}
                      $active={selectedCategoryPreset === preset.id}
                      onClick={() => handleSelectCategoryPreset(preset.id)}
                      data-testid={`category-option-${preset.id}`}
                    >
                      <CategoryItemTopRow>
                        <CategoryItemTitle>{preset.label}</CategoryItemTitle>
                        <CategoryBadge $color={preset.badgeColor}>{preset.badge}</CategoryBadge>
                      </CategoryItemTopRow>
                      <CategoryItemDesc>{preset.description} • Dossier: {preset.meta.documentId}</CategoryItemDesc>
                    </CategoryMenuItem>
                  ))}
                </CategoryDropdownMenu>
              )}
            </CategoryDropdownContainer>

            <ActionButton 
              $gemini
              onClick={handleGenerateSynthesis}
              disabled={loadingSynthesis}
              title="Generate AI Legal Synthesis with Gemini 3.7 Flash"
            >
              <HiSparkles size={15} />
              {loadingSynthesis ? 'Synthesizing...' : '✨ AI Legal Synthesis'}
            </ActionButton>

            <ActionButton 
              $audio
              onClick={() => {
                if (isPlayingAudio) {
                  stopCurrentAudio();
                } else {
                  handleGenerateAudioBriefing(currentAct);
                }
              }}
              disabled={loadingAudio}
              title="Play 3-Act Executive Audio Briefing"
            >
              <FiMic size={15} />
              {loadingAudio ? 'Generating...' : (isPlayingAudio ? 'Pause Audio' : '🎙️ Audio Briefing')}
            </ActionButton>

            <ActionButton 
              $copilot
              onClick={() => setCopilotOpen(true)}
              title="Open In-Workspace Regulatory Copilot"
            >
              <FiMessageSquare size={14} />
              AI Copilot
            </ActionButton>

            {activeTab === 'report' ? (
              <ActionButton 
                $primary
                onClick={() => window.print()}
              >
                <FiPrinter size={15} />
                Print / Export PDF
              </ActionButton>
            ) : (
              <ActionButton 
                $secondary
                onClick={handleReset}
                title="Reset answers"
              >
                <FiRotateCcw size={14} />
                Reset
              </ActionButton>
            )}
          </HeaderActions>
        </TopBarInner>
      </TopStickyBar>

      {/* ================= MAIN CONTENT VIEWPORT ================= */}
      <ContentContainer>
        {/* Progress Bar & Quick Status */}
        <ProgressBanner>
          <ProgressBarWrapper>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: '700' }}>
              <span>Statutory Intake Progress: {answeredQuestions} of 20 Questions Completed</span>
              <span style={{ color: progressPct === 100 ? '#10b981' : '#2563eb' }}>{progressPct}%</span>
            </div>
            <ProgressTrack>
              <ProgressFill $pct={progressPct} />
            </ProgressTrack>
          </ProgressBarWrapper>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              background: '#f8fafc', 
              border: '1.5px solid #e2e8f0', 
              padding: '6px 12px', 
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
            }}>
              <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Dossier ID:</span>
              <span style={{ fontSize: '0.82rem', fontWeight: '800', color: '#0f172a', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }}>
                {meta.documentId || 'EUAIA-2026-HR4902'}
              </span>
              <button
                type="button"
                onClick={() => handleCopy(meta.documentId || 'EUAIA-2026-HR4902', 'dossier-id')}
                style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: '0 2px', display: 'flex', alignItems: 'center' }}
                title="Copy Dossier ID"
              >
                {copiedId === 'dossier-id' ? <FiCheck size={13} color="#10b981" /> : <FiCopy size={13} />}
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'right' }}>
                <span style={{ fontSize: '0.70rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Current Classification</span>
                <span style={{ fontSize: '0.88rem', fontWeight: '800', color: evaluation.riskTierBadgeColor }}>
                  {evaluation.overallRiskTier.split(' (')[0]}
                </span>
              </div>
              <div style={{ 
                width: '36px', 
                height: '36px', 
                borderRadius: '9px', 
                background: `${evaluation.riskTierBadgeColor}15`, 
                color: evaluation.riskTierBadgeColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '800'
              }}>
                <FiShield size={18} />
              </div>
            </div>
          </div>
        </ProgressBanner>

        {/* ================= SYSTEM IDENTIFICATION & CATEGORY SELECTOR CARD ================= */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '14px',
          padding: '18px 24px',
          marginBottom: '22px',
          boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)'
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '16px', paddingBottom: '14px', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                background: '#f5f3ff',
                color: '#7c3aed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '800'
              }}>
                <FiLayers size={18} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: '800', color: '#0f172a' }}>
                  AI System Category & Dossier Identification
                </h3>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  Select a statutory EU AI Act category preset to auto-populate all 20 domain-specific inputs with zero overlap, or enter custom system metadata
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <label htmlFor="statutory-category-select" style={{ fontSize: '0.78rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Statutory Category Preset:
              </label>
              <select
                id="statutory-category-select"
                data-testid="statutory-category-select"
                value={selectedCategoryPreset}
                onChange={(e) => handleSelectCategoryPreset(e.target.value)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '9px',
                  border: '1.5px solid #8b5cf6',
                  background: '#f5f3ff',
                  color: '#4c1d95',
                  fontSize: '0.84rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  outline: 'none',
                  minWidth: '340px'
                }}
              >
                <option value="">➕ Custom / Blank Assessment ({meta.documentId})</option>
                {EU_AI_CATEGORY_PRESETS.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.label} [{p.meta.documentId}]
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '14px'
          }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
                AI System Name
              </label>
              <input
                type="text"
                data-testid="meta-system-name"
                value={meta.systemName || ''}
                onChange={(e) => {
                  const updated = { ...meta, systemName: e.target.value };
                  setMeta(updated);
                  persistState(answers, updated, taskStatusOverrides);
                }}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.84rem',
                  fontWeight: '600',
                  color: '#0f172a'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
                Version / Release Tag
              </label>
              <input
                type="text"
                data-testid="meta-version"
                value={meta.version || ''}
                onChange={(e) => {
                  const updated = { ...meta, version: e.target.value };
                  setMeta(updated);
                  persistState(answers, updated, taskStatusOverrides);
                }}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.84rem',
                  fontWeight: '600',
                  color: '#0f172a'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
                Lead Compliance Evaluator
              </label>
              <input
                type="text"
                data-testid="meta-evaluator"
                value={meta.leadEvaluator || ''}
                onChange={(e) => {
                  const updated = { ...meta, leadEvaluator: e.target.value };
                  setMeta(updated);
                  persistState(answers, updated, taskStatusOverrides);
                }}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.84rem',
                  fontWeight: '600',
                  color: '#0f172a'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
                Operating Department / Business Unit
              </label>
              <input
                type="text"
                data-testid="meta-department"
                value={meta.department || ''}
                onChange={(e) => {
                  const updated = { ...meta, department: e.target.value };
                  setMeta(updated);
                  persistState(answers, updated, taskStatusOverrides);
                }}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.84rem',
                  fontWeight: '600',
                  color: '#0f172a'
                }}
              />
            </div>
          </div>
        </div>

        {/* ================= TAB 1: QUESTIONNAIRE ================= */}
        {activeTab === 'questionnaire' && (
          <QuestionnaireGrid>
            {/* Sidebar Navigation */}
            <SectionNavPanel>
              <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                Statutory Sections
              </span>
              {EU_AI_SECTIONS.map(s => {
                const isSectionActive = activeSectionId === s.id;
                const sectionAnswered = s.questionIds.filter(qid => answers[qid]?.level1OptionId).length;
                const isSectionDone = sectionAnswered === s.questionIds.length;

                return (
                  <SectionNavItem
                    key={s.id}
                    $active={isSectionActive}
                    onClick={() => setActiveSectionId(s.id)}
                  >
                    <SectionNumBadge $active={isSectionActive} $done={isSectionDone}>
                      {isSectionDone ? '✓' : s.id}
                    </SectionNumBadge>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ 
                          fontSize: '0.65rem', 
                          fontWeight: '800', 
                          color: isSectionActive ? '#2563eb' : '#64748b', 
                          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' 
                        }}>
                          SEC-0{s.id}
                        </span>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: isSectionActive ? '700' : '500' }}>
                          {s.title}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.7rem', color: isSectionActive ? '#2563eb' : '#94a3b8' }}>
                        {sectionAnswered}/{s.questionIds.length} Done • {s.articles}
                      </span>
                    </div>
                  </SectionNavItem>
                );
              })}
            </SectionNavPanel>

            {/* Questions List for Active Section */}
            <QuestionsContainer>
              {(() => {
                const currentSection = EU_AI_SECTIONS.find(s => s.id === activeSectionId);
                const sectionQuestions = EU_AI_QUESTIONS.filter(q => q.sectionId === activeSectionId);

                return (
                  <>
                    <div style={{ marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Section {currentSection?.id} • {currentSection?.articles}
                      </span>
                      <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', margin: '4px 0 6px 0' }}>
                        {currentSection?.title}
                      </h2>
                      <p style={{ fontSize: '0.88rem', color: '#64748b', margin: 0 }}>
                        {currentSection?.description}
                      </p>
                    </div>

                    {sectionQuestions.map(q => {
                      const userAns = answers[q.id] || {};
                      const selectedL1 = userAns.level1OptionId;
                      const selectedL2 = userAns.level2OptionId;
                      const notes = userAns.notes || '';

                      return (
                        <QuestionCard key={q.id}>
                          <QuestionHeader>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                              <span style={{ 
                                width: '28px', 
                                height: '28px', 
                                borderRadius: '8px', 
                                background: '#0f172a', 
                                color: '#ffffff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: '800',
                                fontSize: '0.85rem'
                              }}>
                                {q.id.replace('q', '')}
                              </span>
                              <span style={{
                                background: '#f1f5f9',
                                color: '#334155',
                                border: '1px solid #cbd5e1',
                                padding: '2px 8px',
                                borderRadius: '6px',
                                fontSize: '0.72rem',
                                fontWeight: '800',
                                letterSpacing: '0.04em',
                                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
                              }}>
                                EUAIA-Q{String(q.id.replace('q', '')).padStart(2, '0')}
                              </span>
                              <QuestionTitle>{q.title}</QuestionTitle>
                            </div>
                            <ArticleBadge>{q.articleReference}</ArticleBadge>
                          </QuestionHeader>

                          <StatutoryScopeText>{q.statutoryScope}</StatutoryScopeText>

                          {/* Level 1 Options */}
                          <OptionsGroup>
                            {q.options.map(opt => {
                              const isL1Selected = selectedL1 === opt.id;

                              return (
                                <Level1OptionCard 
                                  key={opt.id}
                                  $selected={isL1Selected}
                                  onClick={() => handleSelectLevel1(q.id, opt.id)}
                                >
                                  <Level1Content>
                                    <RadioLabelWrapper>
                                      <CustomRadio $checked={isL1Selected} />
                                      <OptionTextCol>
                                        <OptionLabel>
                                          {opt.id} {opt.label}
                                        </OptionLabel>
                                        {opt.tagline && (
                                          <OptionTagline>{opt.tagline}</OptionTagline>
                                        )}
                                      </OptionTextCol>
                                    </RadioLabelWrapper>

                                    {opt.isTripwire && (
                                      <TripwireBadge $red={opt.riskWeight === 'UNACCEPTABLE'}>
                                        <FiAlertTriangle size={12} />
                                        {opt.tripwireBadge || 'Statutory Tripwire'}
                                      </TripwireBadge>
                                    )}
                                  </Level1Content>

                                  {/* Level 2 Sub-Options Accordion */}
                                  <AnimatePresence>
                                    {isL1Selected && opt.subOptions && opt.subOptions.length > 0 && (
                                      <Level2Accordion
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <Level2Title>
                                          <span>★ Verify Statutory Condition (Level 2):</span>
                                        </Level2Title>

                                        {opt.subOptions.map(sub => {
                                          const isL2Selected = selectedL2 === sub.id;

                                          return (
                                            <Level2SubOption
                                              key={sub.id}
                                              $checked={isL2Selected}
                                              onClick={() => handleSelectLevel2(q.id, sub.id)}
                                            >
                                              <CustomRadio $checked={isL2Selected} />
                                              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', flex: 1 }}>
                                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                                                  <span style={{
                                                    background: isL2Selected ? '#2563eb' : '#f1f5f9',
                                                    color: isL2Selected ? '#ffffff' : '#475569',
                                                    border: `1px solid ${isL2Selected ? '#2563eb' : '#cbd5e1'}`,
                                                    padding: '1px 6px',
                                                    borderRadius: '4px',
                                                    fontSize: '0.72rem',
                                                    fontWeight: '800',
                                                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
                                                  }}>
                                                    {sub.id}
                                                  </span>
                                                  <span style={{ fontSize: '0.85rem', fontWeight: isL2Selected ? '700' : '500', color: '#0f172a' }}>
                                                    {sub.label}
                                                  </span>
                                                </div>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                                                  <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                                                    {sub.riskImpact}
                                                  </span>
                                                  {sub.tripwireBadge && (
                                                    <TripwireBadge $red>
                                                      {sub.tripwireBadge}
                                                    </TripwireBadge>
                                                  )}
                                                </div>
                                              </div>
                                            </Level2SubOption>
                                          );
                                        })}
                                      </Level2Accordion>
                                    )}
                                  </AnimatePresence>
                                </Level1OptionCard>
                              );
                            })}
                          </OptionsGroup>

                          {/* Notes / Evidentiary Comments */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <label style={{ fontSize: '0.78rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                              Notes / Evidentiary Comments (Audit Trail):
                            </label>
                            <NotesTextarea
                              placeholder="Record compliance evidence, document IDs, vendor contract terms, or justification..."
                              value={notes}
                              onChange={(e) => handleNotesChange(q.id, e.target.value)}
                            />
                          </div>
                        </QuestionCard>
                      );
                    })}

                    {/* Section Step Footer */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                      <ActionButton
                        $secondary
                        disabled={activeSectionId === 1}
                        onClick={() => setActiveSectionId(prev => Math.max(1, prev - 1))}
                        style={{ opacity: activeSectionId === 1 ? 0.5 : 1, cursor: activeSectionId === 1 ? 'default' : 'pointer' }}
                      >
                        <FiArrowLeft size={15} />
                        Previous Section
                      </ActionButton>

                      {activeSectionId < EU_AI_SECTIONS.length ? (
                        <ActionButton
                          $primary
                          onClick={() => setActiveSectionId(prev => Math.min(EU_AI_SECTIONS.length, prev + 1))}
                        >
                          Next Section ({activeSectionId + 1}/9)
                          <FiArrowRight size={15} />
                        </ActionButton>
                      ) : (
                        <ActionButton
                          $primary
                          onClick={() => setActiveTab('dashboard')}
                        >
                          Complete & View Dashboard
                          <FiCheckCircle size={15} />
                        </ActionButton>
                      )}
                    </div>
                  </>
                );
              })()}
            </QuestionsContainer>
          </QuestionnaireGrid>
        )}

        {/* ================= TAB 2: COMPLIANCE DASHBOARD ================= */}
        {activeTab === 'dashboard' && (
          <DashboardGrid>
            {/* 4 Hero KPI Cards */}
            <KpiCardsRow>
              <KpiCard $accent={evaluation.riskTierBadgeColor}>
                <KpiLabel>
                  <FiShield size={14} />
                  Risk Classification Tier
                </KpiLabel>
                <KpiValue $color={evaluation.riskTierBadgeColor}>
                  {evaluation.overallRiskTier.split(' (')[0]}
                </KpiValue>
                <KpiSubtitle>
                  {evaluation.riskTierDescription}
                </KpiSubtitle>
              </KpiCard>

              <KpiCard $accent={evaluation.conformityBadgeColor}>
                <KpiLabel>
                  <FiAward size={14} />
                  Conformity Determination
                </KpiLabel>
                <KpiValue $color={evaluation.conformityBadgeColor}>
                  {evaluation.conformityStatus}
                </KpiValue>
                <KpiSubtitle>
                  {evaluation.stats.nonCompliantCount > 0 
                    ? `${evaluation.stats.nonCompliantCount} statutory violations detected.`
                    : `${evaluation.stats.remediationCount} control gaps requiring action.`}
                </KpiSubtitle>
              </KpiCard>

              <KpiCard $accent="#3b82f6">
                <KpiLabel>
                  <FiCheckCircle size={14} />
                  Compliance Health Score
                </KpiLabel>
                <KpiValue $color={evaluation.healthScore >= 80 ? '#10b981' : (evaluation.healthScore >= 50 ? '#f59e0b' : '#ef4444')}>
                  {evaluation.healthScore}%
                </KpiValue>
                <KpiSubtitle>
                  Derived from {evaluation.stats.compliantCount} passed checks across 20 statutory mandates.
                </KpiSubtitle>
              </KpiCard>

              <KpiCard $accent="#ea580c">
                <KpiLabel>
                  <FiAlertTriangle size={14} />
                  Open Remediation Items
                </KpiLabel>
                <KpiValue $color={evaluation.remediationTasks.length > 0 ? '#ea580c' : '#10b981'}>
                  {evaluation.remediationTasks.length}
                </KpiValue>
                <KpiSubtitle>
                  {evaluation.stats.criticalRemediations} Critical • {evaluation.stats.highRemediations} High • {evaluation.stats.mediumRemediations} Medium
                </KpiSubtitle>
              </KpiCard>
            </KpiCardsRow>

            {/* Executive Audio Briefing Bar */}
            <AudioBriefingCard>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>
                    <FiMic size={18} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.92rem', fontWeight: '800', color: '#f8fafc' }}>
                        Executive Audio Briefing
                      </span>
                      <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '999px', background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', fontWeight: '800', border: '1px solid rgba(56, 189, 248, 0.4)' }}>
                        DeepMind Neural Voice (Fenrir)
                      </span>
                    </div>
                    <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                      3-Act board narrative: Statutory Classification • Enforcement Deadlines • Action Directives
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setShowAudioScript(!showAudioScript)}
                    style={{ background: 'transparent', border: '1px solid #334155', borderRadius: '8px', color: '#cbd5e1', padding: '5px 12px', fontSize: '0.76rem', cursor: 'pointer' }}
                  >
                    {showAudioScript ? 'Hide Spoken Script' : 'View Spoken Script'}
                  </button>
                  <ActionButton
                    $audio
                    style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                    onClick={() => {
                      if (isPlayingAudio) {
                        stopCurrentAudio();
                      } else {
                        handleGenerateAudioBriefing(currentAct);
                      }
                    }}
                    disabled={loadingAudio}
                  >
                    {isPlayingAudio ? <FiPause size={14} /> : <FiPlay size={14} />}
                    {loadingAudio ? 'Generating...' : (isPlayingAudio ? 'Pause' : `Play Act ${currentAct}`)}
                  </ActionButton>
                </div>
              </div>

              <AudioActsRow>
                {[
                  { num: 1, title: 'Act 1: Statutory Verdict', desc: 'Classification & Prohibitions' },
                  { num: 2, title: 'Act 2: Regulatory Exposure', desc: 'Technical Gaps & Fines' },
                  { num: 3, title: 'Act 3: Board Action Plan', desc: 'Remediation Roadmap' }
                ].map(act => (
                  <AudioActPill
                    key={act.num}
                    $active={currentAct === act.num}
                    onClick={() => {
                      if (isPlayingAudio && currentAct === act.num) {
                        stopCurrentAudio();
                      } else {
                        handleGenerateAudioBriefing(act.num);
                      }
                    }}
                  >
                    <span style={{ fontWeight: '800' }}>{act.title}</span>
                    <span style={{ opacity: 0.7, fontSize: '0.72rem', marginLeft: '6px' }}>• {act.desc}</span>
                  </AudioActPill>
                ))}
              </AudioActsRow>

              {showAudioScript && (
                <AudioScriptContainer>
                  {audioData?.acts?.find(a => a.act === currentAct)?.script || (
                    <span>
                      "Board members and executive leadership: Following our conformity evaluation under Regulation (EU) 2024/1689, '{meta.systemName}' qualifies as a High-Risk AI System under Annex III, Point 4. While no Article 5 prohibited practices were identified, immediate remediation is required across Article 12 automatic event logging and Article 14 human oversight protocols prior to the August 2026 statutory enforcement deadline..."
                    </span>
                  )}
                </AudioScriptContainer>
              )}
            </AudioBriefingCard>

            {/* Gemini 3.7 Flash AI Legal Synthesis */}
            <GeminiSynthesisContainer>
              <SynthesisHeaderBar>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <HiSparkles color="#6366f1" size={20} />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#0f172a', margin: 0 }}>
                      Gemini 3.7 Flash Statutory Legal Synthesis & Enforcement Analysis
                    </h3>
                  </div>
                  <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                    Authoritative statutory cross-examination compiled in real time against Regulation (EU) 2024/1689.
                  </span>
                </div>

                <SynthesisBadgeGroup>
                  <GeminiModelBadge>
                    <HiSparkles size={13} />
                    Model: Gemini 3.7 Flash
                  </GeminiModelBadge>
                  <span style={{ fontSize: '0.74rem', background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '4px 10px', borderRadius: '999px', fontWeight: '800' }}>
                    Zero-Hallucination Grounded
                  </span>
                  <ActionButton
                    $secondary
                    style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                    onClick={handleGenerateSynthesis}
                    disabled={loadingSynthesis}
                  >
                    <FiRefreshCw size={12} className={loadingSynthesis ? 'animate-spin' : ''} />
                    {loadingSynthesis ? 'Synthesizing...' : (synthesis ? 'Re-Synthesize' : 'Generate')}
                  </ActionButton>
                </SynthesisBadgeGroup>
              </SynthesisHeaderBar>

              {!synthesis ? (
                <HeroSynthesisBanner>
                  <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)' }}>
                    <HiSparkles size={26} />
                  </div>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                    Generate Board-Level Legal Synthesis with Gemini 3.7 Flash
                  </h4>
                  <p style={{ maxWidth: '680px', fontSize: '0.88rem', color: '#475569', margin: 0, lineHeight: 1.55 }}>
                    Perform deep statutory legal synthesis across Article 5 prohibitions, Annex III point 4 criteria, the 2025–2027 enforcement timeline, Article 99 fine liability calculation, and an initial Annex IV Technical File draft.
                  </p>
                  <ActionButton
                    $gemini
                    style={{ padding: '10px 22px', fontSize: '0.92rem', marginTop: '4px' }}
                    onClick={handleGenerateSynthesis}
                    disabled={loadingSynthesis}
                  >
                    <HiSparkles size={17} />
                    {loadingSynthesis ? 'Synthesizing Legal Analysis...' : '✨ Generate AI Legal Synthesis'}
                  </ActionButton>
                </HeroSynthesisBanner>
              ) : (
                <>
                  <SynthesisTabs>
                    {[
                      { id: 'overview', label: 'Executive Summary', icon: <FiFileText size={13} /> },
                      { id: 'statutoryRisk', label: 'Statutory Risk & Violations', icon: <FiAlertTriangle size={13} /> },
                      { id: 'timeline', label: 'Enforcement Timeline (2025–2027)', icon: <FiCalendar size={13} /> },
                      { id: 'fines', label: 'Fine Exposure (Art. 99)', icon: <FiDollarSign size={13} /> },
                      { id: 'annexIv', label: 'Annex IV Technical File', icon: <FiCode size={13} /> }
                    ].map(t => (
                      <SynthesisTabButton
                        key={t.id}
                        $active={synthesisTab === t.id}
                        onClick={() => setSynthesisTab(t.id)}
                      >
                        {t.icon}
                        {t.label}
                      </SynthesisTabButton>
                    ))}
                  </SynthesisTabs>

                  {synthesisTab === 'overview' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <OverviewBox style={{ background: '#eff6ff', borderColor: '#bfdbfe' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#1e40af', fontWeight: '800', fontSize: '0.88rem' }}>
                          <FiShield size={16} />
                          STATUTORY EXECUTIVE BRIEFING
                        </div>
                        <div style={{ fontSize: '0.9rem', color: '#1e293b', lineHeight: '1.65' }}>
                          {synthesis.executiveSummary}
                        </div>
                      </OverviewBox>

                      {synthesis.statutoryRiskDeepDive && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '14px' }}>
                          <OverviewBox>
                            <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#6366f1', textTransform: 'uppercase' }}>Annex III Determination</span>
                            <p style={{ margin: '6px 0 0 0', fontSize: '0.85rem', color: '#334155', lineHeight: '1.5' }}>
                              {synthesis.statutoryRiskDeepDive.annexIiiDetermination}
                            </p>
                          </OverviewBox>
                          <OverviewBox>
                            <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#059669', textTransform: 'uppercase' }}>Article 5 Prohibitions Check</span>
                            <p style={{ margin: '6px 0 0 0', fontSize: '0.85rem', color: '#334155', lineHeight: '1.5' }}>
                              {synthesis.statutoryRiskDeepDive.prohibitedPracticesAudit}
                            </p>
                          </OverviewBox>
                          <OverviewBox>
                            <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#ea580c', textTransform: 'uppercase' }}>Value Chain Liability Shift</span>
                            <p style={{ margin: '6px 0 0 0', fontSize: '0.85rem', color: '#334155', lineHeight: '1.5' }}>
                              {synthesis.statutoryRiskDeepDive.valueChainLiabilityShift}
                            </p>
                          </OverviewBox>
                        </div>
                      )}
                    </div>
                  )}

                  {synthesisTab === 'statutoryRisk' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                        Prioritized legal and technical non-conformities requiring remediation before the statutory enforcement date:
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {synthesis.prioritizedViolations?.map((v, i) => (
                          <div key={i} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', background: '#ffffff', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ padding: '3px 8px', borderRadius: '6px', background: '#eff6ff', color: '#1d4ed8', fontWeight: '800', fontSize: '0.78rem' }}>
                                  {v.article}
                                </span>
                                <strong style={{ fontSize: '0.92rem', color: '#0f172a' }}>{v.title}</strong>
                              </div>
                              <span style={{
                                padding: '3px 9px',
                                borderRadius: '6px',
                                fontSize: '0.72rem',
                                fontWeight: '800',
                                background: v.severity === 'CRITICAL' ? '#fee2e2' : (v.severity === 'HIGH' ? '#ffedd5' : '#fef3c7'),
                                color: v.severity === 'CRITICAL' ? '#b91c1c' : (v.severity === 'HIGH' ? '#c2410c' : '#b45309')
                              }}>
                                {v.severity}
                              </span>
                            </div>
                            <p style={{ margin: 0, fontSize: '0.84rem', color: '#475569', lineHeight: '1.5' }}>
                              <strong>Finding: </strong>{v.finding}
                            </p>
                            <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', fontSize: '0.82rem', color: '#166534', border: '1px solid #bbf7d0' }}>
                              <strong>Required Remediation: </strong>{v.requiredRemediation}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {synthesisTab === 'timeline' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                        EU AI Act Phased Enforcement Schedule (Regulation (EU) 2024/1689, Article 111):
                      </div>
                      <TimelineCardsGrid>
                        {synthesis.enforcementTimeline?.map((item, idx) => {
                          const isGap = item.complianceStatus?.toUpperCase().includes('GAP') || item.complianceStatus?.toUpperCase().includes('ACTION');
                          const isCompliant = item.complianceStatus?.toUpperCase().includes('COMPLIANT');
                          return (
                            <TimelineCard key={idx} $urgent={isGap} $compliant={isCompliant}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: '0.88rem', fontWeight: '900', color: '#1e3a8a' }}>
                                  {item.date}
                                </span>
                                <span style={{
                                  padding: '2px 7px',
                                  borderRadius: '5px',
                                  fontSize: '0.68rem',
                                  fontWeight: '800',
                                  background: isGap ? '#fee2e2' : (isCompliant ? '#dcfce7' : '#f1f5f9'),
                                  color: isGap ? '#b91c1c' : (isCompliant ? '#166534' : '#475569')
                                }}>
                                  {item.complianceStatus || 'PENDING'}
                                </span>
                              </div>
                              <span style={{ fontSize: '0.74rem', color: '#6366f1', fontWeight: '800' }}>
                                {item.statutoryArticle}
                              </span>
                              <strong style={{ fontSize: '0.85rem', color: '#0f172a' }}>
                                {item.milestone}
                              </strong>
                              <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b', lineHeight: '1.45' }}>
                                {item.applicabilityToThisSystem}
                              </p>
                            </TimelineCard>
                          );
                        })}
                      </TimelineCardsGrid>
                    </div>
                  )}

                  {synthesisTab === 'fines' && (
                    <PenaltyExposureGrid>
                      <ExposureBox>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#b91c1c' }}>
                          <FiDollarSign size={18} />
                          <h4 style={{ fontSize: '1rem', fontWeight: '800', margin: 0 }}>
                            Statutory Maximum Fine Liability
                          </h4>
                        </div>
                        <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#b91c1c' }}>
                          {synthesis.financialExposure?.calculatedMaxFine || '€15,000,000'}
                        </div>
                        <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                          Under Article 99(4): Non-compliance with Chapter III obligations (Articles 8–15) by high-risk AI providers or deployers.
                        </span>
                        <div style={{ padding: '12px', borderRadius: '8px', background: '#fff1f2', border: '1px solid #fecdd3', fontSize: '0.82rem', color: '#9f1239' }}>
                          <strong>Turnover Cap Metric: </strong>
                          {synthesis.financialExposure?.turnoverCapRate || 'Up to 3% of total worldwide annual turnover for the preceding financial year.'}
                        </div>
                      </ExposureBox>

                      <ExposureBox>
                        <h4 style={{ fontSize: '1rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                          Article 99 Mitigation & Aggravation Factors
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.84rem' }}>
                          <div style={{ padding: '10px 12px', borderRadius: '8px', background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534' }}>
                            <strong>Mitigating Factors: </strong>
                            {synthesis.financialExposure?.mitigatingFactors || 'Active self-assessment, transparent documentation, prompt remediation attempts.'}
                          </div>
                          <div style={{ padding: '10px 12px', borderRadius: '8px', background: '#fff7ed', border: '1px solid #fed7aa', color: '#9a3412' }}>
                            <strong>Aggravating Factors: </strong>
                            {synthesis.financialExposure?.aggravatingFactors || 'Lack of automated logging (Article 12), absence of documented human oversight SOP (Article 14).'}
                          </div>
                        </div>
                      </ExposureBox>
                    </PenaltyExposureGrid>
                  )}

                  {synthesisTab === 'annexIv' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                        <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                          Annex IV Technical Documentation Initial Working Draft (Articles 11 & Annex IV):
                        </span>
                        <ActionButton
                          $secondary
                          style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                          onClick={() => {
                            const annexText = Object.entries(synthesis.annexIvTechnicalFileDraft || {})
                              .map(([k, v]) => `## ${k.replace(/_/g, ' ').toUpperCase()}\n\n${v}\n`)
                              .join('\n');
                            handleCopy(annexText, 'annex-full');
                          }}
                        >
                          {copiedId === 'annex-full' ? <FiCheck size={13} /> : <FiCopy size={13} />}
                          {copiedId === 'annex-full' ? 'Copied' : 'Copy Full Draft'}
                        </ActionButton>
                      </div>

                      <AnnexIvCodeViewer>
                        {Object.entries(synthesis.annexIvTechnicalFileDraft || {}).map(([secKey, secContent]) => (
                          <div key={secKey} style={{ marginBottom: '20px' }}>
                            <div style={{ color: '#38bdf8', fontWeight: '800', borderBottom: '1px solid #334155', paddingBottom: '6px', marginBottom: '8px' }}>
                              ### {secKey.replace(/_/g, ' ').toUpperCase()}
                            </div>
                            <div style={{ color: '#cbd5e1', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                              {secContent}
                            </div>
                          </div>
                        ))}
                      </AnnexIvCodeViewer>
                    </div>
                  )}
                </>
              )}
            </GeminiSynthesisContainer>

            {/* 7 Core Statutory Vectors Radar & Bar Breakdown */}
            <ChartsRow>
              <ChartCard>
                <ChartCardTitle>
                  <span>7 Core Statutory Vectors (Radar)</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b' }}>Articles 8–15 & 50</span>
                </ChartCardTitle>
                <div style={{ width: '100%', height: '340px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarChartData} outerRadius="75%">
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis dataKey="vector" tick={{ fill: '#334155', fontSize: 11, fontWeight: 600 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 9 }} />
                      <Radar name="Current Score" dataKey="score" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.35} />
                      <Radar name="Target Baseline" dataKey="target" stroke="#10b981" fill="#10b981" fillOpacity={0.1} />
                      <Tooltip />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>

              <ChartCard>
                <ChartCardTitle>
                  <span>Vector Readiness vs Statutory Benchmark</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b' }}>Conformance %</span>
                </ChartCardTitle>
                <div style={{ width: '100%', height: '340px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 10 }} angle={-15} textAnchor="end" />
                      <YAxis domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Score" fill="#2563eb" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="Benchmark" fill="#cbd5e1" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>
            </ChartsRow>

            {/* Actionable Remediation Backlog */}
            <BacklogContainer>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '14px' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0' }}>
                    Actionable Statutory Remediation Backlog
                  </h3>
                  <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                    Prioritized control gaps automatically compiled from non-conformant Level 2 findings.
                  </span>
                </div>

                <BacklogFiltersRow>
                  {/* Severity filter */}
                  <FilterButtonsGroup>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b' }}>Severity:</span>
                    {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map(sev => (
                      <FilterChip
                        key={sev}
                        $active={selectedSeverityFilter === sev}
                        onClick={() => setSelectedSeverityFilter(sev)}
                      >
                        {sev}
                      </FilterChip>
                    ))}
                  </FilterButtonsGroup>

                  {/* Owner filter */}
                  <FilterButtonsGroup>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b' }}>Owner:</span>
                    {['ALL', 'MLOps', 'Legal', 'Product', 'Security'].map(own => (
                      <FilterChip
                        key={own}
                        $active={selectedOwnerFilter === own}
                        onClick={() => setSelectedOwnerFilter(own)}
                      >
                        {own}
                      </FilterChip>
                    ))}
                  </FilterButtonsGroup>
                </BacklogFiltersRow>
              </div>

              {/* Task Items List */}
              {filteredTasks.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#10b981', background: '#f0fdf4', borderRadius: '12px' }}>
                  <FiCheckCircle size={32} style={{ marginBottom: '8px' }} />
                  <div style={{ fontWeight: '800', fontSize: '1rem' }}>No Open Remediation Items!</div>
                  <div style={{ fontSize: '0.85rem', color: '#166534' }}>All assessed controls meet the statutory threshold under this filter.</div>
                </div>
              ) : (
                filteredTasks.map(task => (
                  <TaskItemCard key={task.id} $severity={task.severity}>
                    <TaskContentCol>
                      <TaskMetaRow>
                        <SeverityBadge $severity={task.severity}>{task.severity}</SeverityBadge>
                        <ArticleBadge>{task.article}</ArticleBadge>
                        <OwnerBadge>👤 {task.targetOwner}</OwnerBadge>
                        <span style={{ color: '#64748b' }}>From: {task.questionTitle}</span>
                      </TaskMetaRow>
                      <TaskTitle>{task.task}</TaskTitle>
                      <span style={{ fontSize: '0.78rem', color: '#64748b', fontStyle: 'italic' }}>
                        Trigger: {task.sourceLabel}
                      </span>
                    </TaskContentCol>

                    <TaskStatusButton
                      $status={task.status}
                      onClick={() => handleToggleTaskStatus(task.id)}
                      title="Click to advance task lifecycle status"
                    >
                      {task.status === 'Resolved' ? '✓ Resolved' : (task.status === 'In Progress' ? '⏳ In Progress' : '○ Todo')}
                    </TaskStatusButton>
                  </TaskItemCard>
                ))
              )}
            </BacklogContainer>
          </DashboardGrid>
        )}

        {/* ================= TAB 3: FORMAL AUDIT DOSSIER & REPORT ================= */}
        {activeTab === 'report' && (
          <ReportPaperCard>
            {/* Header Block */}
            <ReportHeaderBlock>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <EuroFlagBadge style={{ width: '56px', height: '56px', fontSize: '1.6rem' }}>★</EuroFlagBadge>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#1e40af', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    European Union Artificial Intelligence Act • Regulation (EU) 2024/1689
                  </span>
                  <h1 style={{ fontSize: '1.6rem', fontWeight: '900', color: '#0f172a', margin: '4px 0' }}>
                    Formal Conformity Assessment Dossier
                  </h1>
                  <span style={{ fontSize: '0.85rem', color: '#475569' }}>
                    Statutory Attestation, Risk Classification & Operational Compliance Scorecard
                  </span>
                </div>
              </div>

              <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Dossier Identifier</span>
                <span style={{ fontSize: '1.1rem', fontWeight: '900', color: '#1e3a8a', fontFamily: 'monospace' }}>
                  {meta.documentId || 'EUAIA-2026-HR4902'}
                </span>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Date: {meta.evaluationDate}</span>
              </div>
            </ReportHeaderBlock>

            {/* Executive Summary & System Metadata */}
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', marginBottom: '12px' }}>
                1. System Profile & Value-Chain Position
              </h3>
              <MetaTable>
                <tbody>
                  <tr>
                    <th>AI System Name</th>
                    <td>{meta.systemName}</td>
                    <th>Software Version</th>
                    <td>{meta.version}</td>
                  </tr>
                  <tr>
                    <th>Lead Evaluator</th>
                    <td>{meta.leadEvaluator}</td>
                    <th>Operating Department</th>
                    <td>{meta.department}</td>
                  </tr>
                  <tr>
                    <th>Statutory Classification</th>
                    <td style={{ color: evaluation.riskTierBadgeColor, fontWeight: '800' }}>
                      {evaluation.overallRiskTier}
                    </td>
                    <th>Conformity Verdict</th>
                    <td style={{ color: evaluation.conformityBadgeColor, fontWeight: '800' }}>
                      {evaluation.conformityStatus}
                    </td>
                  </tr>
                  <tr>
                    <th>Compliance Health Score</th>
                    <td style={{ fontWeight: '800' }}>{evaluation.healthScore} / 100</td>
                    <th>Open Remediation Actions</th>
                    <td>{evaluation.remediationTasks.length} statutory action items</td>
                  </tr>
                </tbody>
              </MetaTable>
            </div>

            {/* Legal Classification Justification */}
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', marginBottom: '10px' }}>
                2. Executive Classification Justification
              </h3>
              <div style={{ padding: '16px 20px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', fontSize: '0.88rem', lineHeight: '1.6', color: '#334155' }}>
                <strong>Statutory Finding: </strong>
                {evaluation.riskTierDescription}
                <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px dashed #cbd5e1' }}>
                  <strong>Value Chain Determination: </strong>
                  {answers['q1']?.level1OptionId === '1.1' 
                    ? 'Pure Deployer (Articles 26–27 apply). Vendor instructions must be strictly observed.'
                    : (answers['q1']?.level1OptionId === '1.2' 
                      ? 'AI Provider (Full Articles 8–15 and Annex IV technical file apply).' 
                      : 'De-Facto Provider via Substantial Modification or White-Labeling (Article 25 liability shift).')}
                </div>
              </div>
            </div>

            {/* Statutory Scorecard */}
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', marginBottom: '12px' }}>
                3. Statutory Compliance Scorecard (Articles 8–15, 26–27, 50, 72–73)
              </h3>
              <ScorecardTable>
                <thead>
                  <tr>
                    <th style={{ width: '15%' }}>Statutory Reference</th>
                    <th style={{ width: '25%' }}>Obligation Domain</th>
                    <th style={{ width: '18%' }}>Status</th>
                    <th style={{ width: '42%' }}>Recorded Evidence & Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {evaluation.scorecardItems.map((item, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: '800', color: '#1e3a8a' }}>{item.article}</td>
                      <td style={{ fontWeight: '700' }}>{item.title}</td>
                      <td>
                        <StatusPill $status={item.status}>{item.status}</StatusPill>
                      </td>
                      <td style={{ fontSize: '0.82rem', color: '#475569', lineHeight: '1.45' }}>
                        {item.notes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </ScorecardTable>
            </div>

            {/* ================= SECTION 4: CISO CYBERSECURITY & FORENSICS ARCHITECTURE ================= */}
            {evaluation.cisoBriefing && (
              <div style={{ marginTop: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FiShield color="#2563eb" size={18} />
                    4. CISO End-to-End Cybersecurity, Threat Resilience & Forensics Architecture (Articles 12, 15 & 73)
                  </h3>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: '800',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    background: evaluation.cisoBriefing.securityPostureStatus.includes('HARDENED') ? '#dcfce7' : '#fee2e2',
                    color: evaluation.cisoBriefing.securityPostureStatus.includes('HARDENED') ? '#166534' : '#b91c1c',
                    border: '1px solid currentColor'
                  }}>
                    CISO POSTURE: {evaluation.cisoBriefing.securityPostureStatus}
                  </span>
                </div>

                {/* Threat Vector Table */}
                <ScorecardTable style={{ marginBottom: '16px' }}>
                  <thead>
                    <tr>
                      <th style={{ width: '28%' }}>Adversarial Threat Vector (MITRE ATLAS)</th>
                      <th style={{ width: '16%' }}>Reference ID</th>
                      <th style={{ width: '18%' }}>Posture Status</th>
                      <th style={{ width: '38%' }}>Active Technical Countermeasure & Control</th>
                    </tr>
                  </thead>
                  <tbody>
                    {evaluation.cisoBriefing.threatSurfaceVectors.map((tv, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: '700', color: '#0f172a' }}>{tv.vector}</td>
                        <td style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace', fontSize: '0.78rem', fontWeight: '700', color: '#4f46e5' }}>{tv.mitreId}</td>
                        <td>
                          <span style={{
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '0.72rem',
                            fontWeight: '800',
                            background: tv.status.includes('Mitigated') ? '#dcfce7' : '#fef3c7',
                            color: tv.status.includes('Mitigated') ? '#166534' : '#b45309'
                          }}>
                            {tv.status}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.82rem', color: '#475569' }}>{tv.control}</td>
                      </tr>
                    ))}
                  </tbody>
                </ScorecardTable>

                {/* Cross-Framework Mapping & Incident Response SLA */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: '800', color: '#1e3a8a', textTransform: 'uppercase', marginBottom: '8px' }}>
                      Cross-Framework Regulatory Harmonization
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {evaluation.cisoBriefing.crossFrameworkMapping.map((cf, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', borderBottom: i < 3 ? '1px dashed #e2e8f0' : 'none', paddingBottom: i < 3 ? '6px' : 0 }}>
                          <div>
                            <strong style={{ color: '#0f172a' }}>{cf.framework}</strong>
                            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{cf.article}</div>
                          </div>
                          <span style={{
                            fontWeight: '800',
                            fontSize: '0.72rem',
                            padding: '2px 7px',
                            borderRadius: '5px',
                            background: cf.alignment.includes('Aligned') || cf.alignment.includes('Ready') ? '#dcfce7' : '#ffedd5',
                            color: cf.alignment.includes('Aligned') || cf.alignment.includes('Ready') ? '#166534' : '#c2410c'
                          }}>
                            {cf.alignment}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '10px', padding: '14px' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: '800', color: '#9f1239', textTransform: 'uppercase', marginBottom: '8px' }}>
                      Statutory Incident & Breach Notification SLA (Art. 73 / Art. 55)
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#881337', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div>
                        <strong>Mandatory Reporting Window: </strong>
                        <span style={{ fontWeight: '800', background: '#ffe4e6', padding: '2px 6px', borderRadius: '4px' }}>
                          {evaluation.cisoBriefing.incidentResponseSla.statutoryDeadline}
                        </span>
                      </div>
                      <div>
                        <strong>Designated Regulatory Authority: </strong>
                        {evaluation.cisoBriefing.incidentResponseSla.authorityTarget}
                      </div>
                      <div>
                        <strong>Forensic SOC / SIEM Runbook Posture: </strong>
                        {evaluation.cisoBriefing.incidentResponseSla.currentReadiness}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= SECTION 5: CHIEF AI OFFICER (CAIO) MODEL GOVERNANCE DOSSIER ================= */}
            {evaluation.caioBriefing && (
              <div style={{ marginTop: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <HiSparkles color="#7c3aed" size={18} />
                    5. Chief AI Officer (CAIO) End-to-End Model Governance, Fairness & Lifecycle Dossier
                  </h3>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: '800',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    background: '#f5f3ff',
                    color: '#6d28d9',
                    border: '1px solid #ddd6fe'
                  }}>
                    CAIO MATURITY: {evaluation.caioBriefing.governanceMaturity}
                  </span>
                </div>

                {/* CAIO 3-Column Executive Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', marginBottom: '16px' }}>
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px' }}>
                    <div style={{ fontSize: '0.76rem', fontWeight: '800', color: '#4f46e5', textTransform: 'uppercase', marginBottom: '6px' }}>
                      Value-Chain Liability & Art. 25 Guardrail
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#334155', lineHeight: '1.5' }}>
                      <div><strong>Statutory Role:</strong> {evaluation.caioBriefing.valueChainRoleAnalysis.currentRole}</div>
                      <div style={{ marginTop: '6px' }}><strong>Modification Risk:</strong> {evaluation.caioBriefing.valueChainRoleAnalysis.substantialModificationRisk}</div>
                      <div style={{ marginTop: '6px' }}><strong>Conformity Route:</strong> {evaluation.caioBriefing.valueChainRoleAnalysis.conformityPathway}</div>
                    </div>
                  </div>

                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px' }}>
                    <div style={{ fontSize: '0.76rem', fontWeight: '800', color: '#059669', textTransform: 'uppercase', marginBottom: '6px' }}>
                      Algorithmic Fairness & Data Lineage (Art. 10)
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#334155', lineHeight: '1.5' }}>
                      <div><strong>Disparate Impact Audit:</strong> {evaluation.caioBriefing.algorithmicFairnessAndData.biasAuditStatus}</div>
                      <div style={{ marginTop: '6px' }}><strong>Provenance & TDM:</strong> {evaluation.caioBriefing.algorithmicFairnessAndData.dataProvenanceStatus}</div>
                      <div style={{ marginTop: '6px', fontSize: '0.78rem', color: '#64748b' }}>{evaluation.caioBriefing.algorithmicFairnessAndData.notes}</div>
                    </div>
                  </div>

                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px' }}>
                    <div style={{ fontSize: '0.76rem', fontWeight: '800', color: '#ea580c', textTransform: 'uppercase', marginBottom: '6px' }}>
                      Human-in-the-Loop & Explainability (Art. 13, 14, 86)
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#334155', lineHeight: '1.5' }}>
                      <div><strong>HITL Interlock:</strong> {evaluation.caioBriefing.humanOversightAndExplainability.hitlArchitecture}</div>
                      <div style={{ marginTop: '6px' }}><strong>Explainability (Art. 86):</strong> {evaluation.caioBriefing.humanOversightAndExplainability.explainabilityStandard}</div>
                      <div style={{ marginTop: '6px' }}><strong>AI Literacy (Art. 4):</strong> {evaluation.caioBriefing.humanOversightAndExplainability.aiLiteracyCompliance}</div>
                    </div>
                  </div>
                </div>

                {/* Lifecycle Production Monitoring SLA Table */}
                <ScorecardTable>
                  <thead>
                    <tr>
                      <th style={{ width: '38%' }}>CAIO Production Model Telemetry & MLOps Metric</th>
                      <th style={{ width: '28%' }}>Statutory / Enterprise Target Threshold</th>
                      <th style={{ width: '34%' }}>Live Telemetry & Governance Verification</th>
                    </tr>
                  </thead>
                  <tbody>
                    {evaluation.caioBriefing.lifecycleMonitoringMetrics.map((m, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: '700', color: '#0f172a' }}>{m.metric}</td>
                        <td style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace', fontSize: '0.8rem', fontWeight: '700', color: '#1e3a8a' }}>{m.target}</td>
                        <td>
                          <span style={{
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '0.74rem',
                            fontWeight: '800',
                            background: m.currentStatus.includes('Active') || m.currentStatus.includes('Pass') || m.currentStatus.includes('Ready') || m.currentStatus.includes('SLA') ? '#dcfce7' : '#fef3c7',
                            color: m.currentStatus.includes('Active') || m.currentStatus.includes('Pass') || m.currentStatus.includes('Ready') || m.currentStatus.includes('SLA') ? '#166534' : '#b45309'
                          }}>
                            {m.currentStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </ScorecardTable>
              </div>
            )}

            {/* Verification & Attestation Block */}
            <div style={{ marginTop: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', marginBottom: '6px' }}>
                6. C-Suite Statutory Attestation & Regulatory Sign-Off
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0 0 16px 0' }}>
                By signing below, the nominated C-Suite and responsible officers certify that this assessment accurately reflects the cybersecurity architecture, model governance safeguards, and operational controls of the evaluated AI system in conformance with Regulation (EU) 2024/1689.
              </p>

              <SignatureBlockGrid>
                <SignatureCard>
                  <span style={{ fontSize: '0.78rem', fontWeight: '800', color: '#1e3a8a', textTransform: 'uppercase' }}>
                    Chief Information Security Officer (CISO)
                  </span>
                  <SignatureLine>Vikramaditya Rao, CISO</SignatureLine>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Adversarial Security, WORM Logging & NIS2/DORA Alignment (Art. 12 & 15)<br />
                    Date: {meta.evaluationDate}
                  </div>
                </SignatureCard>

                <SignatureCard>
                  <span style={{ fontSize: '0.78rem', fontWeight: '800', color: '#6d28d9', textTransform: 'uppercase' }}>
                    Chief AI Officer (CAIO)
                  </span>
                  <SignatureLine>Dr. Aris Thorne, CAIO</SignatureLine>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Model Fairness, Data Lineage, HITL Stop-Button & Drift Telemetry (Art. 9–14)<br />
                    Date: {meta.evaluationDate}
                  </div>
                </SignatureCard>

                <SignatureCard>
                  <span style={{ fontSize: '0.78rem', fontWeight: '800', color: '#047857', textTransform: 'uppercase' }}>
                    Chief Legal & Compliance Officer
                  </span>
                  <SignatureLine>{meta.leadEvaluator?.split(',')[0] || 'Helena Vance, CLO'}</SignatureLine>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Statutory Conformity, FRIA & EU Database Filing (Art. 26, 27 & 49)<br />
                    Date: {meta.evaluationDate}
                  </div>
                </SignatureCard>
              </SignatureBlockGrid>
            </div>

            {/* Section 7: AI Statutory Legal Synthesis & Annex IV Technical File */}
            {synthesis && (
              <div style={{ marginTop: '28px', paddingTop: '24px', borderTop: '2px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <HiSparkles color="#6366f1" size={18} />
                    5. Statutory Legal Synthesis & Annex IV Technical Documentation (Gemini 3.7 Flash)
                  </h3>
                  <span style={{ fontSize: '0.72rem', background: '#eef2ff', color: '#4f46e5', border: '1px solid #c7d2fe', padding: '3px 10px', borderRadius: '999px', fontWeight: '800' }}>
                    Article 11 & Annex IV Grounded
                  </span>
                </div>

                <div style={{ padding: '16px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #e2e8f0', fontSize: '0.88rem', lineHeight: '1.6', color: '#334155', marginBottom: '16px' }}>
                  <strong>Board Statutory Briefing: </strong>
                  {synthesis.executiveSummary}
                </div>

                {synthesis.annexIvTechnicalFileDraft && (
                  <div>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: '800', color: '#1e3a8a', marginBottom: '8px' }}>
                      Annex IV Technical Documentation Initial Working Draft
                    </h4>
                    <AnnexIvCodeViewer style={{ maxHeight: '380px' }}>
                      {Object.entries(synthesis.annexIvTechnicalFileDraft).map(([k, v]) => (
                        <div key={k} style={{ marginBottom: '14px' }}>
                          <div style={{ color: '#38bdf8', fontWeight: '800', marginBottom: '4px' }}>
                            ### {k.replace(/_/g, ' ').toUpperCase()}
                          </div>
                          <div style={{ color: '#cbd5e1', whiteSpace: 'pre-wrap' }}>{v}</div>
                        </div>
                      ))}
                    </AnnexIvCodeViewer>
                  </div>
                )}
              </div>
            )}
          </ReportPaperCard>
        )}
      </ContentContainer>

      {/* ================= FLOATING REGULATORY COPILOT FAB ================= */}
      <CopilotFab
        type="button"
        onClick={() => setCopilotOpen(true)}
        title="Open EU AI Act Regulatory Copilot (Gemini 3.7 Flash)"
      >
        <FiMessageSquare size={18} />
        <span>EU AI Act Copilot</span>
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
      </CopilotFab>

      {/* ================= IN-WORKSPACE COPILOT DRAWER ================= */}
      <AnimatePresence>
        {copilotOpen && (
          <CopilotDrawerOverlay onClick={() => setCopilotOpen(false)}>
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              onClick={e => e.stopPropagation()}
              style={{ width: '100%', maxWidth: '480px', height: '100%' }}
            >
              <CopilotDrawerPanel>
                <CopilotHeader>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #1e3a8a, #2563eb)', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>
                      ★
                    </div>
                    <div>
                      <h3 style={{ fontSize: '0.95rem', fontWeight: '800', margin: 0, color: '#f8fafc' }}>
                        EU AI Act Regulatory Copilot
                      </h3>
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                        Powered by Gemini 3.7 Flash • Zero-Hallucination
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setCopilotOpen(false)}
                    style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '6px', borderRadius: '6px' }}
                  >
                    <FiX size={20} />
                  </button>
                </CopilotHeader>

                <div style={{ background: '#f1f5f9', padding: '10px 16px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.76rem' }}>
                  <span style={{ color: '#475569', fontWeight: '600' }}>
                    Context: <strong>{meta.systemName.slice(0, 30)}...</strong>
                  </span>
                  <span style={{ padding: '2px 8px', borderRadius: '4px', background: `${evaluation.riskTierBadgeColor}15`, color: evaluation.riskTierBadgeColor, fontWeight: '800' }}>
                    {evaluation.overallRiskTier.split(' (')[0]}
                  </span>
                </div>

                <div style={{ padding: '10px 16px', background: '#ffffff', borderBottom: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748b' }}>
                    Quick Statutory Prompts:
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {[
                      'Draft Article 14 Human Oversight SOP',
                      'Calculate Article 99(4) maximum fine',
                      'Draft Works Council Notice (Art. 26(7))',
                      'List our Annex IV technical documentation gaps'
                    ].map((prompt, pIdx) => (
                      <button
                        key={pIdx}
                        type="button"
                        onClick={() => handleSendCopilotMessage(prompt)}
                        style={{
                          background: '#f8fafc',
                          border: '1px solid #cbd5e1',
                          borderRadius: '999px',
                          padding: '4px 10px',
                          fontSize: '0.72rem',
                          color: '#1e40af',
                          cursor: 'pointer',
                          fontWeight: '600'
                        }}
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>

                <CopilotChatList>
                  {copilotMessages.map((msg, idx) => (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start', gap: '4px' }}>
                      <CopilotBubble 
                        $isUser={msg.role === 'user'}
                        dangerouslySetInnerHTML={{ __html: formatCopilotMarkdown(msg.text, msg.role === 'user') }}
                      />
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.68rem', color: '#94a3b8', padding: '0 4px' }}>
                        <span>{msg.timestamp}</span>
                        {msg.articleRef && (
                          <span style={{ background: '#e0e7ff', color: '#3730a3', padding: '1px 5px', borderRadius: '4px', fontWeight: '700' }}>
                            {msg.articleRef}
                          </span>
                        )}
                        {msg.role !== 'user' && (
                          <button
                            type="button"
                            onClick={() => handleCopy(msg.text, `msg-${idx}`)}
                            style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: 0 }}
                            title="Copy reply"
                          >
                            <FiCopy size={11} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  {copilotLoading && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6366f1', fontSize: '0.8rem', fontStyle: 'italic', padding: '6px 12px' }}>
                      <FiRefreshCw size={14} className="animate-spin" />
                      Gemini 3.7 Flash analyzing statutory obligations...
                    </div>
                  )}
                </CopilotChatList>

                <CopilotComposerRow
                  onSubmit={e => {
                    e.preventDefault();
                    handleSendCopilotMessage();
                  }}
                >
                  <CopilotInput
                    value={copilotInput}
                    onChange={e => setCopilotInput(e.target.value)}
                    placeholder="Ask about Articles 8–15, fines, or Annex IV..."
                    disabled={copilotLoading}
                  />
                  <ActionButton
                    $primary
                    type="submit"
                    disabled={copilotLoading || !copilotInput.trim()}
                    style={{ padding: '8px 14px' }}
                  >
                    <FiSend size={14} />
                  </ActionButton>
                </CopilotComposerRow>
              </CopilotDrawerPanel>
            </motion.div>
          </CopilotDrawerOverlay>
        )}
      </AnimatePresence>
    </WorkspaceWrapper>
  );
}
