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

  @media print {
    padding-top: 0 !important;
    padding-bottom: 0 !important;
    background: #ffffff !important;
  }
`;

const TopStickyBar = styled.div`
  position: sticky;
  top: 68px;
  z-index: 40;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
  width: 100%;

  @media print {
    display: none !important;
  }
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
          // Attempt to auto-hydrate shared dossier from backend server
          axios.get(`/api/eu-ai-compliance/dossiers/${routeParamId}`)
            .then(res => {
              if (res.data?.success && res.data?.dossier) {
                const d = res.data.dossier;
                setMeta(d.meta || { documentId: routeParamId, systemName: 'Shared Enterprise AI System' });
                setAnswers(d.answers || {});
                setTaskStatusOverrides(d.taskStatusOverrides || {});
                if (d.synthesis) setSynthesis(d.synthesis);
                if (d.financialConfig) {
                  if (d.financialConfig.globalTurnoverMillions) setGlobalTurnoverMillions(d.financialConfig.globalTurnoverMillions);
                  if (typeof d.financialConfig.isSme === 'boolean') setIsSme(d.financialConfig.isSme);
                  if (typeof d.financialConfig.includeConcurrentGdprNis2 === 'boolean') setIncludeConcurrentGdprNis2(d.financialConfig.includeConcurrentGdprNis2);
                }
                toast.success(`☁️ Loaded shared Dossier ${routeParamId} from enterprise server!`);
              }
            })
            .catch(() => {
              // If not found on server, initialize new blank dossier for this ID
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
            });
        }
      }
    } catch (e) {
      console.warn('Error reading stored state:', e);
    }
  }, [routeParamId, navigate, generateUniqueDossierId]);

  // Save to localStorage & server per Assessment ID continuously
  const persistState = useCallback((newAnswers, newMeta, newOverrides) => {
    try {
      const currentMeta = newMeta || meta;
      const docId = currentMeta.documentId || routeParamId || 'EUAIA-2026-DEFAULT';
      const activeAnswers = newAnswers !== undefined ? newAnswers : answers;
      const activeOverrides = newOverrides !== undefined ? newOverrides : taskStatusOverrides;
      const dossierRecord = {
        dossierId: docId,
        meta: currentMeta,
        answers: activeAnswers,
        taskStatusOverrides: activeOverrides,
        updatedAt: new Date().toISOString()
      };
      const payload = JSON.stringify(dossierRecord);
      localStorage.setItem(`scorex_eu_ai_compliance_${docId}`, payload);
      localStorage.setItem('scorex_eu_ai_compliance_state', payload);

      // Update unified portfolio index in localStorage
      try {
        const existingIndexRaw = localStorage.getItem('scorex_eu_ai_dossiers_v2');
        const existingIndex = existingIndexRaw ? JSON.parse(existingIndexRaw) : {};
        existingIndex[docId] = dossierRecord;
        localStorage.setItem('scorex_eu_ai_dossiers_v2', JSON.stringify(existingIndex));
      } catch (err) {
        // ignore index error
      }

      // Background sync to backend server so /my-assessments and shared URLs stay hydrated
      axios.post(`/api/eu-ai-compliance/dossiers/${docId}`, dossierRecord).catch(() => {});
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  }, [meta, answers, taskStatusOverrides, routeParamId]);

  // CFO & Board Financial Exposure, SME Cap & Multi-Regulator Stacking State (Dynamic)
  const [globalTurnoverMillions, setGlobalTurnoverMillions] = useState(2500); // default €2.5B
  const [isSme, setIsSme] = useState(false);
  const [includeConcurrentGdprNis2, setIncludeConcurrentGdprNis2] = useState(true);
  const [syncingServer, setSyncingServer] = useState(false);

  // Independent Multi-Model LLM Live API Audit State
  const [auditorModel, setAuditorModel] = useState('gemini-2.5-pro');
  const [liveAuditReport, setLiveAuditReport] = useState(null);
  const [runningLiveAudit, setRunningLiveAudit] = useState(false);
  const [showWeightJustificationTable, setShowWeightJustificationTable] = useState(false);
  const [addedAuditTasks, setAddedAuditTasks] = useState([]);

  // Compute compliance evaluation dynamically across all parameters & live remediation status overrides!
  const evaluation = useMemo(() => {
    const baseEval = evaluateCompliance(
      answers,
      meta,
      { globalTurnoverMillions, isSme, includeConcurrentGdprNis2 },
      taskStatusOverrides
    );
    if (addedAuditTasks.length > 0) {
      baseEval.remediationTasks = [...addedAuditTasks, ...baseEval.remediationTasks];
    }
    return baseEval;
  }, [answers, meta, globalTurnoverMillions, isSme, includeConcurrentGdprNis2, taskStatusOverrides, addedAuditTasks]);

  // 1-Click Auto-Heal Cross-Question Statutory Contradictions
  const handleAutoHealContradiction = (contra) => {
    const nextAnswers = { ...answers };
    if (contra.id === 'contra_art25_role' || contra.questionsInvolved?.includes('Q1')) {
      nextAnswers['q1'] = {
        level1OptionId: '1.3',
        level2OptionId: '1.3.1',
        notes: 'Auto-reclassified to De-Facto Provider under Article 25(1)(b)–(c) due to custom model/dataset modifications.'
      };
    } else if (contra.id === 'contra_art14_ifu' || contra.questionsInvolved?.includes('Q13')) {
      nextAnswers['q13'] = {
        level1OptionId: '13.1',
        level2OptionId: '13.1.1',
        notes: 'Published formal Article 13 Operator Instructions for Use (IFU) with confidence score bounds.'
      };
    } else if (contra.id === 'contra_art12_sla' || contra.questionsInvolved?.includes('Q9')) {
      nextAnswers['q9'] = {
        level1OptionId: '9.1',
        level2OptionId: '9.1.1',
        notes: 'Enabled immutable Write-Once-Read-Many (WORM) Object Lock bucket with 180-day statutory retention.'
      };
    } else if (contra.id === 'contra_art27_fria' || contra.questionsInvolved?.includes('Q16')) {
      nextAnswers['q16'] = {
        level1OptionId: '16.1',
        level2OptionId: '16.1.1',
        notes: 'Completed 6-point Article 27 Fundamental Rights Impact Assessment (FRIA) and authority filing.'
      };
    }
    setAnswers(nextAnswers);
    persistState(nextAnswers, meta, taskStatusOverrides);
    toast.success(`🔧 Auto-Healed Contradiction: ${contra.title}! Re-evaluating dossier...`);
  };

  // Run Independent Multi-Model LLM Live API Audit
  const handleRunLiveAudit = async (selectedModel = auditorModel) => {
    setRunningLiveAudit(true);
    const toastId = toast.loading(`🔍 Running Independent LLM Statutory Audit via ${selectedModel}...`);
    try {
      const res = await axios.post('/api/eu-ai-compliance/live-audit', {
        auditorModel: selectedModel,
        meta,
        answers,
        evaluation
      });
      if (res.data?.auditReport) {
        setLiveAuditReport(res.data.auditReport);
        toast.success(
          `✅ Independent Audit Complete (${selectedModel}): Calibrated Score ${res.data.auditReport.llmCalibratedScore}% (${res.data.auditReport.overallVerdict.replace(/_/g, ' ')})`,
          { id: toastId, duration: 5000 }
        );
      }
    } catch (err) {
      toast.error('Independent LLM Audit error: ' + (err.response?.data?.error || err.message), { id: toastId });
    } finally {
      setRunningLiveAudit(false);
    }
  };

  // Add Auditor-Recommended Task into Live Dossier Backlog
  const handleAddRecommendedAuditTask = (recTask) => {
    const newId = `task_auditor_${Date.now().toString().slice(-4)}`;
    const newTask = {
      id: newId,
      questionId: 'AUDIT',
      questionTitle: `[Independent Auditor: ${auditorModel}] ${recTask.title}`,
      severity: recTask.severity || 'HIGH',
      article: recTask.article || 'Article 15 / 25',
      task: recTask.title,
      targetOwner: recTask.targetOwner || 'Legal & CAIO',
      sourceLabel: `Independent LLM Live Audit (${auditorModel})`,
      statutoryWeight: 2.5,
      status: 'Todo'
    };
    setAddedAuditTasks(prev => [newTask, ...prev]);
    toast.success(`➕ Added "${recTask.title}" to Dossier Remediation Backlog!`);
  };

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
    setLiveAuditReport(null);
    setAddedAuditTasks([]);
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
    setLiveAuditReport(null);
    setAddedAuditTasks([]);
    persistState(preset.answers, preset.meta, {});
    navigate(`/eu-ai-compliance/${preset.meta.documentId}`);
    toast.success(`✨ Loaded Category: ${preset.shortLabel} (${preset.meta.documentId})`);
  };

  // Sync dossier state to backend server for multi-stakeholder sharing
  const handleSyncToServer = async () => {
    setSyncingServer(true);
    const toastId = toast.loading('☁️ Syncing Dossier to enterprise server...');
    try {
      const docId = meta.documentId || routeParamId || 'EUAIA-2026-DEFAULT';
      await axios.post(`/api/eu-ai-compliance/dossiers/${docId}`, {
        meta,
        answers,
        taskStatusOverrides,
        synthesis,
        financialConfig: { globalTurnoverMillions, isSme }
      });
      toast.success(`✅ Dossier ${docId} saved & synced to server! Shareable link active.`, { id: toastId });
    } catch (err) {
      toast.error('Server sync error: ' + (err.response?.data?.error || err.message), { id: toastId });
    } finally {
      setSyncingServer(false);
    }
  };

  // Export Annex IV Technical Documentation as Markdown (.md)
  const handleExportAnnexIvMarkdown = () => {
    const docId = meta.documentId || 'EUAIA-2026-ANNEX-IV';
    const lines = [
      `# EU AI ACT — ANNEX IV TECHNICAL DOCUMENTATION DOSSIER`,
      `**Document ID:** \`${docId}\`  |  **Date:** ${meta.evaluationDate}  |  **Version:** ${meta.version}`,
      `**AI System Name:** ${meta.systemName}`,
      `**Lead Compliance Evaluator:** ${meta.leadEvaluator}`,
      `**Operating Department:** ${meta.department}`,
      `**Statutory Classification:** ${evaluation.overallRiskTier}`,
      `**Conformity Verdict:** ${evaluation.conformityStatus} (Health Score: ${evaluation.healthScore}/100)`,
      ``,
      `---`,
      `## 1. Executive Classification & Value-Chain Role`,
      `- **Statutory Finding:** ${evaluation.riskTierDescription}`,
      `- **Value-Chain Role:** ${evaluation.caioBriefing?.valueChainRoleAnalysis?.currentRole || 'Deployer/Provider'}`,
      `- **Substantial Modification Analysis (Art. 25):** ${evaluation.caioBriefing?.valueChainRoleAnalysis?.substantialModificationRisk || 'N/A'}`,
      `- **Conformity Assessment Pathway:** ${evaluation.caioBriefing?.valueChainRoleAnalysis?.conformityPathway || 'Annex VI / VII'}`,
      ``,
      `---`,
      `## 2. CISO Cybersecurity, MITRE ATLAS Threat Matrix & Forensics (Articles 12 & 15)`,
      `- **CISO Security Posture:** ${evaluation.cisoBriefing?.securityPostureStatus}`,
      `- **Statutory Incident Reporting Window (Art. 73 / Art. 55):** ${evaluation.cisoBriefing?.incidentResponseSla?.statutoryDeadline}`,
      `- **Designated Authority:** ${evaluation.cisoBriefing?.incidentResponseSla?.authorityTarget}`,
      ``,
      `### MITRE ATLAS Adversarial Threat Vectors`,
      ...(evaluation.cisoBriefing?.threatSurfaceVectors || []).map(tv =>
        `- **${tv.vector}** (\`${tv.mitreId}\`) — Status: **${tv.status}**\n  - *Control:* ${tv.control}`
      ),
      ``,
      `---`,
      `## 3. Chief AI Officer (CAIO) Model Governance & Production Telemetry (Articles 9, 10, 13, 14, 72)`,
      `- **CAIO Governance Maturity:** ${evaluation.caioBriefing?.governanceMaturity}`,
      `- **Algorithmic Fairness & Disparate Impact Audit:** ${evaluation.caioBriefing?.algorithmicFairnessAndData?.biasAuditStatus}`,
      `- **Training Data Lineage & Copyright TDM (Art. 53):** ${evaluation.caioBriefing?.algorithmicFairnessAndData?.dataProvenanceStatus}`,
      `- **Human-in-the-Loop (HITL) Interlock (Art. 14):** ${evaluation.caioBriefing?.humanOversightAndExplainability?.hitlArchitecture}`,
      `- **Explainability Standard (Art. 86):** ${evaluation.caioBriefing?.humanOversightAndExplainability?.explainabilityStandard}`,
      ``,
      `---`,
      `## 4. Statutory Compliance Scorecard (20-Point Decision Tree Evidence)`,
      ...(evaluation.scorecardItems || []).map(s =>
        `- **${s.article} — ${s.title}**: \`[${s.status}]\` — ${s.notes}`
      ),
      ``,
      `---`,
      `## 5. Prioritized Engineering Remediation Roadmap`,
      ...(evaluation.remediationTasks || []).map(t =>
        `- **[${t.severity}] ${t.article} (${t.targetOwner})**: ${t.task} — *Status: ${taskStatusOverrides[t.id] || t.status}*`
      )
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${docId}_Annex_IV_Technical_Dossier.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`📄 Exported Annex IV Technical File (${docId}_Annex_IV_Technical_Dossier.md)`);
  };

  // Export Annex VIII EU Database Registration Payload as JSON (.json)
  const handleExportAnnexViiiJson = () => {
    const docId = meta.documentId || 'EUAIA-2026-ANNEX-VIII';
    const payload = {
      schemaVersion: 'EU-AI-ACT-ANNEX-VIII-2026.1',
      registrationAuthority: 'European Commission Central AI Database (Article 49 / Article 71)',
      dossierId: docId,
      registrationTimestamp: new Date().toISOString(),
      providerOrDeployerIdentification: {
        enterpriseDepartment: meta.department,
        leadComplianceOfficer: meta.leadEvaluator,
        valueChainRole: evaluation.caioBriefing?.valueChainRoleAnalysis?.currentRole
      },
      aiSystemSpecification: {
        systemName: meta.systemName,
        versionTag: meta.version,
        statutoryRiskClassification: evaluation.overallRiskTier,
        conformityVerdict: evaluation.conformityStatus,
        complianceHealthScore: evaluation.healthScore
      },
      cisoSecurityAttestation: evaluation.cisoBriefing,
      caioGovernanceAttestation: evaluation.caioBriefing,
      statutoryScorecard: evaluation.scorecardItems,
      openRemediationTasks: evaluation.remediationTasks.map(t => ({
        ...t,
        currentStatus: taskStatusOverrides[t.id] || t.status
      }))
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${docId}_EU_Database_Annex_VIII_Payload.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`🏛️ Exported EU Database Annex VIII Registration Payload (${docId}.json)`);
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

  const handleTaskStatusChange = (taskId, newStatus) => {
    const updated = {
      ...taskStatusOverrides,
      [taskId]: newStatus
    };
    setTaskStatusOverrides(updated);
    persistState(answers, meta, updated);
    toast.success(`Task status updated to "${newStatus}"`);
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
                  Weighted Compliance Score
                </KpiLabel>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
                  <KpiValue $color={evaluation.healthScore >= 80 ? '#10b981' : (evaluation.healthScore >= 50 ? '#f59e0b' : '#ef4444')}>
                    {evaluation.healthScore}%
                  </KpiValue>
                  <span style={{ fontSize: '0.76rem', fontWeight: '700', color: '#64748b' }}>
                    (Unweighted: {evaluation.weightedBreakdown?.unweightedPercentage ?? evaluation.healthScore}%)
                  </span>
                </div>
                {liveAuditReport && (
                  <div style={{ marginTop: '4px', display: 'inline-flex', alignItems: 'center', gap: '6px', background: liveAuditReport.calibrationDelta < 0 ? '#fef2f2' : '#eef2ff', border: `1px solid ${liveAuditReport.calibrationDelta < 0 ? '#fecaca' : '#c7d2fe'}`, color: liveAuditReport.calibrationDelta < 0 ? '#dc2626' : '#4f46e5', fontSize: '0.72rem', fontWeight: '800', padding: '2px 8px', borderRadius: '6px' }}>
                    ⚡ Audited: {liveAuditReport.llmCalibratedScore}% ({liveAuditReport.calibrationDelta >= 0 ? '+' : ''}{liveAuditReport.calibrationDelta} pts)
                  </div>
                )}
                <KpiSubtitle>
                  Weighted by Art. 99 penalty tiers ({evaluation.weightedBreakdown?.totalEarnedWeightedPoints} / {evaluation.weightedBreakdown?.totalPossibleWeight} pts).
                  <button
                    type="button"
                    onClick={() => setShowWeightJustificationTable(!showWeightJustificationTable)}
                    style={{ display: 'block', marginTop: '6px', background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1d4ed8', fontSize: '0.72rem', fontWeight: '800', padding: '3px 8px', borderRadius: '6px', cursor: 'pointer' }}
                  >
                    ⚖️ {showWeightJustificationTable ? 'Hide Weighting Math Matrix' : 'Inspect Statutory Weights & Math Justification'}
                  </button>
                </KpiSubtitle>
              </KpiCard>

              <KpiCard $accent="#ea580c">
                <KpiLabel>
                  <FiAlertTriangle size={14} />
                  Open Remediation Items
                </KpiLabel>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap' }}>
                  <KpiValue $color={evaluation.remediationTasks.length > 0 ? '#ea580c' : '#10b981'}>
                    {evaluation.remediationTasks.length}
                  </KpiValue>
                  {evaluation.stats.resolvedRemediationCount > 0 && (
                    <span style={{ background: '#dcfce7', color: '#15803d', border: '1px solid #86efac', fontSize: '0.72rem', fontWeight: '800', padding: '2px 8px', borderRadius: '999px' }}>
                      ✓ {evaluation.stats.resolvedRemediationCount} Resolved & Credited
                    </span>
                  )}
                </div>
                <KpiSubtitle>
                  {evaluation.stats.criticalRemediations} Critical • {evaluation.stats.highRemediations} High • {evaluation.stats.mediumRemediations} Medium
                </KpiSubtitle>
              </KpiCard>
            </KpiCardsRow>

            {/* COLLAPSIBLE STATUTORY WEIGHTING & MATHEMATICAL JUSTIFICATION TABLE */}
            {showWeightJustificationTable && evaluation.weightedBreakdown && (
              <div style={{ background: '#ffffff', border: '2px solid #3b82f6', borderRadius: '14px', padding: '20px', boxShadow: '0 8px 24px rgba(59, 130, 246, 0.12)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: '900', color: '#0f172a', margin: 0 }}>
                      ⚖️ Statutory Weighting & Mathematical Score Justification Matrix (Regulation (EU) 2024/1689 Article 99)
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: '#475569', margin: '4px 0 0 0' }}>
                      Formula: <strong>Overall Score = [ Σ (Question Statutory Weight W_i × Option Credit Multiplier S_i) / Σ W_i ] × 100</strong> • Total Possible Weighted Points: <strong>{evaluation.weightedBreakdown.totalPossibleWeight}</strong> • Earned: <strong>{evaluation.weightedBreakdown.totalEarnedWeightedPoints}</strong>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowWeightJustificationTable(false)}
                    style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '5px 12px', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer', color: '#334155' }}
                  >
                    ✕ Close Table
                  </button>
                </div>

                {evaluation.weightedBreakdown.vetoTriggered && (
                  <div style={{ background: '#fef2f2', border: '1px solid #f87171', borderRadius: '8px', padding: '10px 14px', marginBottom: '12px', color: '#991b1b', fontSize: '0.8rem', fontWeight: '700' }}>
                    🚨 {evaluation.weightedBreakdown.vetoReason}
                  </div>
                )}

                <div style={{ maxHeight: '340px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                    <thead style={{ background: '#0f172a', color: '#ffffff', position: 'sticky', top: 0 }}>
                      <tr>
                        <th style={{ padding: '8px 10px', textAlign: 'left' }}>Q# & Statutory Article</th>
                        <th style={{ padding: '8px 10px', textAlign: 'left' }}>Penalty Tier & Weight (W_i)</th>
                        <th style={{ padding: '8px 10px', textAlign: 'left' }}>Selected Option & Credit (S_i)</th>
                        <th style={{ padding: '8px 10px', textAlign: 'right' }}>Weighted Pts</th>
                        <th style={{ padding: '8px 10px', textAlign: 'left' }}>Statutory & Financial Justification</th>
                      </tr>
                    </thead>
                    <tbody>
                      {evaluation.weightedBreakdown.questionAuditTrail.map((row, idx) => (
                        <tr key={row.id} style={{ borderBottom: '1px solid #e2e8f0', background: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                          <td style={{ padding: '8px 10px', fontWeight: '800', color: '#1e3a8a' }}>
                            Q{row.number}: {row.article}
                            <div style={{ fontSize: '0.72rem', fontWeight: '600', color: '#475569' }}>{row.title}</div>
                          </td>
                          <td style={{ padding: '8px 10px' }}>
                            <span style={{ background: row.weight >= 3.0 ? '#fef2f2' : (row.weight >= 2.0 ? '#fff7ed' : '#f0fdf4'), color: row.weight >= 3.0 ? '#dc2626' : (row.weight >= 2.0 ? '#ea580c' : '#16a34a'), fontWeight: '800', padding: '2px 6px', borderRadius: '4px', border: '1px solid currentColor', fontSize: '0.72rem' }}>
                              {row.weight.toFixed(1)}x Weight
                            </span>
                            <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px' }}>{row.maxFineRule}</div>
                          </td>
                          <td style={{ padding: '8px 10px' }}>
                            <span style={{ fontWeight: '700', color: row.complianceStatus === 'COMPLIANT' ? '#15803d' : (row.complianceStatus === 'NON_COMPLIANT' ? '#b91c1c' : '#b45309') }}>
                              {row.complianceStatus} ({(row.optionCreditMultiplier * 100).toFixed(0)}% Credit)
                            </span>
                            <div style={{ fontSize: '0.7rem', color: '#334155' }}>{row.selectedOptionLabel}</div>
                          </td>
                          <td style={{ padding: '8px 10px', textAlign: 'right', fontFamily: 'monospace', fontWeight: '800', fontSize: '0.82rem' }}>
                            {row.weightedPointsEarned.toFixed(2)} / {row.maxWeightedPoints.toFixed(2)}
                          </td>
                          <td style={{ padding: '8px 10px', fontSize: '0.72rem', color: '#475569', lineHeight: '1.35' }}>
                            {row.justification}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* DYNAMIC CFO & BOARD FINANCIAL EXPOSURE & REMEDIATION ROI SIMULATOR (ARTICLE 99) */}
            {evaluation.financialSimulation && (
              <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', borderRadius: '14px', padding: '18px 22px', color: '#f8fafc', border: '1px solid #334155', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ background: '#f59e0b', color: '#0f172a', fontSize: '0.7rem', fontWeight: '900', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>
                        CFO & Board Live Simulator
                      </span>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                        Dynamic Article 99 Financial Penalty, Turnover Cap & Remediation ROI Simulator
                      </h3>
                    </div>
                    <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                      {evaluation.financialSimulation.applicableArticleRule} • {evaluation.financialSimulation.smeRuleApplied}
                    </span>
                  </div>

                  {/* Interactive Controls: Turnover Slider + SME Toggle + Multi-Regulator Stacking Toggle */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', background: 'rgba(255,255,255,0.06)', padding: '8px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.12)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <label style={{ fontSize: '0.72rem', color: '#cbd5e1', fontWeight: '700' }}>
                        Global Annual Turnover: <strong style={{ color: '#38bdf8' }}>€{globalTurnoverMillions.toLocaleString()} Million</strong> (€{(globalTurnoverMillions / 1000).toFixed(2)}B)
                      </label>
                      <input
                        type="range"
                        min="50"
                        max="25000"
                        step="50"
                        value={globalTurnoverMillions}
                        onChange={(e) => setGlobalTurnoverMillions(Number(e.target.value))}
                        style={{ width: '180px', accentColor: '#38bdf8', cursor: 'pointer' }}
                      />
                    </div>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '7px', cursor: 'pointer', fontSize: '0.74rem', fontWeight: '700', color: '#f8fafc', paddingLeft: '10px', borderLeft: '1px solid #475569' }}>
                      <input
                        type="checkbox"
                        checked={isSme}
                        onChange={(e) => setIsSme(e.target.checked)}
                        style={{ width: '15px', height: '15px', accentColor: '#10b981', cursor: 'pointer' }}
                      />
                      <div>
                        <div>SME / Startup Lower-Cap</div>
                        <div style={{ fontSize: '0.66rem', color: '#94a3b8', fontWeight: '500' }}>Art. 99(6) Lower Threshold</div>
                      </div>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '7px', cursor: 'pointer', fontSize: '0.74rem', fontWeight: '700', color: '#f8fafc', paddingLeft: '10px', borderLeft: '1px solid #475569' }}>
                      <input
                        type="checkbox"
                        checked={includeConcurrentGdprNis2}
                        onChange={(e) => setIncludeConcurrentGdprNis2(e.target.checked)}
                        style={{ width: '15px', height: '15px', accentColor: '#f59e0b', cursor: 'pointer' }}
                      />
                      <div>
                        <div>Stack Concurrent GDPR + NIS2 Fines</div>
                        <div style={{ fontSize: '0.66rem', color: '#fcd34d', fontWeight: '500' }}>Art. 83 (4%) + NIS2 Art. 34 (2%)</div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* 4 Dynamic Financial Metric Tiles */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                  <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.35)', borderRadius: '10px', padding: '12px 14px' }}>
                    <div style={{ fontSize: '0.72rem', color: '#fca5a5', fontWeight: '700', textTransform: 'uppercase' }}>
                      {includeConcurrentGdprNis2 ? 'Combined Multi-Regulator Ceiling' : 'Statutory Maximum Fine Ceiling'}
                    </div>
                    <div style={{ fontSize: '1.45rem', fontWeight: '900', color: '#f87171', marginTop: '2px' }}>
                      €{evaluation.financialSimulation.applicableStatutoryCeilingMillions.toLocaleString()}M
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#cbd5e1', marginTop: '2px' }}>
                      {includeConcurrentGdprNis2
                        ? `AI Act: €${evaluation.financialSimulation.aiActCeilingMillions}M + GDPR: €${evaluation.financialSimulation.gdprFineMillions}M + NIS2: €${evaluation.financialSimulation.nis2FineMillions}M`
                        : (isSme ? 'Capped at SME lower-of-two threshold' : 'Higher of €15M/€35M or 3%/7% global turnover')}
                    </div>
                  </div>

                  <div style={{ background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.35)', borderRadius: '10px', padding: '12px 14px' }}>
                    <div style={{ fontSize: '0.72rem', color: '#fcd34d', fontWeight: '700', textTransform: 'uppercase' }}>Probability-Weighted Value-at-Risk (VaR)</div>
                    <div style={{ fontSize: '1.45rem', fontWeight: '900', color: '#fbbf24', marginTop: '2px' }}>
                      €{evaluation.financialSimulation.expectedValueAtRiskMillions.toLocaleString()}M
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#cbd5e1', marginTop: '2px' }}>
                      Based on {100 - evaluation.healthScore}% unweighted/weighted compliance deficit
                    </div>
                  </div>

                  <div style={{ background: 'rgba(56, 189, 248, 0.12)', border: '1px solid rgba(56, 189, 248, 0.35)', borderRadius: '10px', padding: '12px 14px' }}>
                    <div style={{ fontSize: '0.72rem', color: '#7dd3fc', fontWeight: '700', textTransform: 'uppercase' }}>Est. Engineering Remediation Cost</div>
                    <div style={{ fontSize: '1.45rem', fontWeight: '900', color: '#38bdf8', marginTop: '2px' }}>
                      €{evaluation.financialSimulation.estimatedRemediationCostMillions.toLocaleString()}M
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#cbd5e1', marginTop: '2px' }}>
                      Across {evaluation.remediationTasks.length} active technical & legal backlog items
                    </div>
                  </div>

                  <div style={{ background: 'rgba(16, 185, 129, 0.14)', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: '10px', padding: '12px 14px' }}>
                    <div style={{ fontSize: '0.72rem', color: '#6ee7b7', fontWeight: '700', textTransform: 'uppercase' }}>Net Compliance Avoidance ROI</div>
                    <div style={{ fontSize: '1.45rem', fontWeight: '900', color: '#34d399', marginTop: '2px' }}>
                      {evaluation.financialSimulation.netComplianceRoiMultiplier}x ROI
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#cbd5e1', marginTop: '2px' }}>
                      Net Penalty Avoided: €{evaluation.financialSimulation.netSavingsAvoidedMillions.toLocaleString()}M
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* INDEPENDENT MULTI-MODEL LLM LIVE API AUDIT CENTER ("SECOND-OPINION AUDITOR") */}
            <div style={{ background: '#ffffff', border: '2px solid #6366f1', borderRadius: '14px', padding: '18px 22px', boxShadow: '0 6px 20px rgba(99, 102, 241, 0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: liveAuditReport ? '16px' : '0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '1.1rem' }}>
                    ⚡
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: '900', color: '#0f172a', margin: 0 }}>
                        Independent Multi-Model LLM Live API Audit (Second-Opinion Statutory Cross-Examiner)
                      </h3>
                      <span style={{ background: '#eef2ff', color: '#4f46e5', border: '1px solid #c7d2fe', fontSize: '0.7rem', fontWeight: '800', padding: '2px 8px', borderRadius: '999px' }}>
                        Zero Self-Confirmation Bias
                      </span>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: '#475569', margin: '3px 0 0 0' }}>
                      Audit the primary deterministic engine ({evaluation.healthScore}%) using an independent LLM auditor model to verify statutory weightings, detect cross-question contradictions (e.g. Q1 vs Q7 role shifts), and uncover blind spots.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <select
                    value={auditorModel}
                    onChange={(e) => setAuditorModel(e.target.value)}
                    style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '7px 12px', fontSize: '0.78rem', fontWeight: '700', color: '#0f172a', cursor: 'pointer' }}
                  >
                    <option value="gemini-2.5-pro">Auditor Model: Gemini 2.5 Pro (Deep Statutory Reasoning)</option>
                    <option value="gemini-2.5-flash">Auditor Model: Gemini 2.5 Flash (Rapid Contradiction Cross-Check)</option>
                    <option value="gemini-3.1-pro-preview">Auditor Model: Gemini 3.1 Pro Preview (Multi-Framework Consensus)</option>
                  </select>

                  <ActionButton
                    $gemini
                    onClick={() => handleRunLiveAudit(auditorModel)}
                    disabled={runningLiveAudit}
                    style={{ padding: '8px 16px', fontSize: '0.8rem' }}
                  >
                    <FiRefreshCw size={13} className={runningLiveAudit ? 'animate-spin' : ''} />
                    {runningLiveAudit ? 'Auditing via Live API...' : '🔍 Run Live Independent LLM Audit'}
                  </ActionButton>
                </div>
              </div>

              {liveAuditReport && (
                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {/* Top Summary Banner */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '12px' }}>
                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px' }}>
                      <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Auditor Verdict</div>
                      <div style={{ fontSize: '0.95rem', fontWeight: '900', color: liveAuditReport.overallVerdict === 'VERIFIED_ACCURATE' ? '#15803d' : '#b91c1c', marginTop: '4px' }}>
                        {liveAuditReport.overallVerdict.replace(/_/g, ' ')}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#475569', marginTop: '2px' }}>
                        Hash: <code>{liveAuditReport.verificationHash}</code>
                      </div>
                    </div>

                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px' }}>
                      <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Deterministic vs. LLM Calibrated Score</div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
                        <span style={{ fontSize: '1.35rem', fontWeight: '900', color: '#4f46e5' }}>{liveAuditReport.llmCalibratedScore}%</span>
                        <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#64748b' }}>
                          (Primary Engine: {liveAuditReport.deterministicWeightedScore}%)
                        </span>
                      </div>
                      <div style={{ fontSize: '0.7rem', color: liveAuditReport.calibrationDelta < 0 ? '#dc2626' : '#16a34a', fontWeight: '700', marginTop: '2px' }}>
                        {liveAuditReport.calibrationDelta === 0 ? '✓ 100% Mathematical Alignment' : `Calibration Delta: ${liveAuditReport.calibrationDelta > 0 ? '+' : ''}${liveAuditReport.calibrationDelta} pts`}
                      </div>
                    </div>

                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px' }}>
                      <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Independent Auditor Model</div>
                      <div style={{ fontSize: '0.82rem', fontWeight: '800', color: '#0f172a', marginTop: '4px' }}>
                        {liveAuditReport.auditorModelUsed}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#16a34a', fontWeight: '700', marginTop: '2px' }}>
                        Confidence Rating: {liveAuditReport.confidenceScore}%
                      </div>
                    </div>
                  </div>

                  {/* Executive Audit Summary & Weight Justification Verdict */}
                  <div style={{ background: '#eef2ff', border: '1px solid #c7d2fe', borderRadius: '10px', padding: '12px 16px', fontSize: '0.82rem', color: '#1e1b4b', lineHeight: '1.5' }}>
                    <div><strong>Independent Auditor Executive Synthesis:</strong> {liveAuditReport.executiveAuditSummary}</div>
                    {liveAuditReport.weightJustificationAudit && (
                      <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px dashed #a5b4fc' }}>
                        <strong>Statutory Weighting Validation ({liveAuditReport.weightJustificationAudit.verdict}):</strong> {liveAuditReport.weightJustificationAudit.analysis}
                      </div>
                    )}
                  </div>

                  {/* Cross-Question Contradictions & Actionable Recommendations */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '14px' }}>
                    <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px 14px' }}>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: '800', color: '#0f172a', margin: '0 0 8px 0' }}>
                        🔍 Cross-Question Logical Contradiction Check (Q1–Q20)
                      </h4>
                      {liveAuditReport.crossQuestionContradictions?.map((c, idx) => (
                        <div key={idx} style={{ background: c.severity === 'CRITICAL' ? '#fef2f2' : '#fffbeb', border: `1px solid ${c.severity === 'CRITICAL' ? '#fecaca' : '#fde68a'}`, borderRadius: '8px', padding: '10px 12px', marginBottom: '8px', fontSize: '0.76rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: '800', color: c.severity === 'CRITICAL' ? '#991b1b' : '#92400e' }}>
                            <span>[{c.severity}] {c.questionsInvolved}</span>
                            <span>{c.article}</span>
                          </div>
                          <div style={{ fontWeight: '800', color: '#0f172a', marginTop: '4px' }}>{c.title}</div>
                          <div style={{ color: '#334155', marginTop: '3px', lineHeight: '1.35' }}>{c.finding}</div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                            <div style={{ color: '#1e40af', fontWeight: '700', fontSize: '0.73rem' }}>Fix: {c.remediationAction}</div>
                            {c.severity !== 'INFO' && (
                              <button
                                type="button"
                                onClick={() => handleAutoHealContradiction(c)}
                                style={{ background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '4px 10px', fontSize: '0.72rem', fontWeight: '800', cursor: 'pointer', whiteSpace: 'nowrap', boxShadow: '0 2px 6px rgba(22, 163, 74, 0.25)' }}
                              >
                                🔧 1-Click Auto-Heal Contradiction
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px 14px' }}>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: '800', color: '#0f172a', margin: '0 0 8px 0' }}>
                        🛡️ Independent Auditor Recommended Remediations (1-Click Add)
                      </h4>
                      {liveAuditReport.recommendedAuditTasks?.map((rt, idx) => (
                        <div key={idx} style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '8px 10px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                          <div style={{ fontSize: '0.76rem' }}>
                            <div style={{ fontWeight: '800', color: '#0f172a' }}>{rt.title}</div>
                            <div style={{ color: '#64748b', fontSize: '0.7rem' }}>{rt.article} • Owner: {rt.targetOwner} • Severity: {rt.severity}</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleAddRecommendedAuditTask(rt)}
                            style={{ background: '#4f46e5', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '5px 10px', fontSize: '0.72rem', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap' }}
                          >
                            ➕ Add to Backlog
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

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
            {/* 1-CLICK DELIVERABLES EXPORT, CLOUD SYNC & INDEPENDENT LLM AUDIT BAR */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', padding: '12px 16px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '12px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '900', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  📦 Official Deliverables & Cloud Sync:
                </span>
                <button
                  type="button"
                  onClick={handleExportAnnexIvMarkdown}
                  style={{ background: '#ffffff', border: '1px solid #94a3b8', borderRadius: '8px', padding: '6px 12px', fontSize: '0.76rem', fontWeight: '700', color: '#1e3a8a', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  📄 Export Annex IV Technical File (.md)
                </button>
                <button
                  type="button"
                  onClick={handleExportAnnexViiiJson}
                  style={{ background: '#ffffff', border: '1px solid #94a3b8', borderRadius: '8px', padding: '6px 12px', fontSize: '0.76rem', fontWeight: '700', color: '#0f172a', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  🏛️ Export EU Database Annex VIII (.json)
                </button>
                <button
                  type="button"
                  onClick={handleSyncToServer}
                  disabled={syncingServer}
                  style={{ background: '#eff6ff', border: '1px solid #93c5fd', borderRadius: '8px', padding: '6px 12px', fontSize: '0.76rem', fontWeight: '800', color: '#1d4ed8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  ☁️ {syncingServer ? 'Syncing...' : 'Save & Sync Dossier to Server'}
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => handleRunLiveAudit(auditorModel)}
                  disabled={runningLiveAudit}
                  style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '6px 14px', fontSize: '0.76rem', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  ⚡ {runningLiveAudit ? 'Auditing...' : `Run Live LLM Audit (${auditorModel})`}
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  style={{ background: '#0f172a', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '6px 14px', fontSize: '0.76rem', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  🖨️ Print Official PDF Dossier
                </button>
              </div>
            </div>

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

            {/* ================= SECTION 6: CFO & BOARD FINANCIAL EXPOSURE & REMEDIATION ROI SIMULATOR ================= */}
            {evaluation.financialSimulation && (
              <div style={{ marginTop: '28px', paddingTop: '24px', borderTop: '2px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                    6. CFO & Board Article 99 Financial Exposure, Turnover Cap & Remediation ROI Analysis
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#f8fafc', padding: '6px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#0f172a' }}>
                      Global Turnover: €{globalTurnoverMillions.toLocaleString()}M
                    </span>
                    <input
                      type="range"
                      min="50"
                      max="25000"
                      step="50"
                      value={globalTurnoverMillions}
                      onChange={(e) => setGlobalTurnoverMillions(Number(e.target.value))}
                      style={{ width: '130px', accentColor: '#2563eb', cursor: 'pointer' }}
                    />
                    <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.74rem', fontWeight: '700', color: '#1e3a8a', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={isSme}
                        onChange={(e) => setIsSme(e.target.checked)}
                      />
                      SME Art. 99(6) Cap
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.74rem', fontWeight: '700', color: '#b45309', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={includeConcurrentGdprNis2}
                        onChange={(e) => setIncludeConcurrentGdprNis2(e.target.checked)}
                      />
                      Stack GDPR + NIS2 Fines
                    </label>
                  </div>
                </div>

                <MetaTable>
                  <tbody>
                    <tr>
                      <th>Applicable Statutory Fine Rule</th>
                      <td>{evaluation.financialSimulation.applicableArticleRule}</td>
                      <th>SME Cap Protection Status</th>
                      <td>{evaluation.financialSimulation.smeRuleApplied}</td>
                    </tr>
                    <tr>
                      <th>{includeConcurrentGdprNis2 ? 'Combined Multi-Regulator Ceiling' : 'Maximum Statutory Fine Ceiling'}</th>
                      <td style={{ color: '#dc2626', fontWeight: '900', fontSize: '1rem' }}>
                        €{evaluation.financialSimulation.applicableStatutoryCeilingMillions.toLocaleString()} Million
                        {includeConcurrentGdprNis2 && (
                          <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748b' }}>
                            (AI Act: €{evaluation.financialSimulation.aiActCeilingMillions}M + GDPR: €{evaluation.financialSimulation.gdprFineMillions}M + NIS2: €{evaluation.financialSimulation.nis2FineMillions}M)
                          </div>
                        )}
                      </td>
                      <th>Probability-Weighted Value-at-Risk (VaR)</th>
                      <td style={{ color: '#d97706', fontWeight: '900', fontSize: '1rem' }}>
                        €{evaluation.financialSimulation.expectedValueAtRiskMillions.toLocaleString()} Million
                      </td>
                    </tr>
                    <tr>
                      <th>Est. Engineering Remediation Cost</th>
                      <td style={{ color: '#2563eb', fontWeight: '800' }}>
                        €{evaluation.financialSimulation.estimatedRemediationCostMillions.toLocaleString()} Million
                      </td>
                      <th>Net Compliance Avoidance ROI</th>
                      <td style={{ color: '#15803d', fontWeight: '900', fontSize: '1.05rem' }}>
                        {evaluation.financialSimulation.netComplianceRoiMultiplier}x ROI (Net Savings: €{evaluation.financialSimulation.netSavingsAvoidedMillions.toLocaleString()}M)
                      </td>
                    </tr>
                  </tbody>
                </MetaTable>
              </div>
            )}

            {/* ================= SECTION 7: STATUTORY WEIGHTING & MATHEMATICAL SCORE JUSTIFICATION MATRIX ================= */}
            {evaluation.weightedBreakdown && (
              <div style={{ marginTop: '28px', paddingTop: '24px', borderTop: '2px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                    7. Statutory Weighting & Mathematical Score Justification Matrix (Regulation (EU) 2024/1689 Article 99)
                  </h3>
                  <span style={{ fontSize: '0.74rem', fontWeight: '800', background: '#eff6ff', color: '#1d4ed8', padding: '4px 10px', borderRadius: '6px', border: '1px solid #bfdbfe' }}>
                    Weighted Score: {evaluation.healthScore}% vs. Unweighted Flat Average: {evaluation.weightedBreakdown.unweightedPercentage}%
                  </span>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#475569', margin: '0 0 12px 0', lineHeight: '1.5' }}>
                  <strong>Mathematical & Legal Rationale:</strong> Under EU Regulation 2024/1689, questions cannot be treated with equal flat weights. Article 5 Prohibited AI Practices carry up to <strong>€35M or 7% global turnover fines (3.5x weight + Statutory Hard-Cap Veto)</strong>, Articles 9–15 & 25 High-Risk Core obligations carry <strong>€15M or 3% turnover fines (2.0x–2.5x weight)</strong>, while Article 4 AI Literacy represents a baseline operational mandate (<strong>1.0x weight</strong>).
                </p>

                <ScorecardTable>
                  <thead>
                    <tr>
                      <th style={{ width: '18%' }}>Question & Article</th>
                      <th style={{ width: '16%' }}>Penalty Weight (W_i)</th>
                      <th style={{ width: '22%' }}>Selected Option & Credit (S_i)</th>
                      <th style={{ width: '12%' }}>Weighted Points</th>
                      <th style={{ width: '32%' }}>Statutory & Financial Justification</th>
                    </tr>
                  </thead>
                  <tbody>
                    {evaluation.weightedBreakdown.questionAuditTrail.map((row) => (
                      <tr key={row.id}>
                        <td style={{ fontWeight: '800', color: '#1e3a8a' }}>
                          Q{row.number}: {row.article}
                          <div style={{ fontSize: '0.72rem', fontWeight: '600', color: '#475569' }}>{row.title}</div>
                        </td>
                        <td>
                          <span style={{ fontWeight: '800', color: row.weight >= 3.0 ? '#dc2626' : (row.weight >= 2.0 ? '#ea580c' : '#16a34a') }}>
                            {row.weight.toFixed(1)}x Multiplier
                          </span>
                          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{row.maxFineRule}</div>
                        </td>
                        <td>
                          <StatusPill $status={row.complianceStatus === 'COMPLIANT' ? 'PASSED' : (row.complianceStatus === 'NON_COMPLIANT' ? 'FAILED' : 'REMEDIATION REQUIRED')}>
                            {row.complianceStatus} ({(row.optionCreditMultiplier * 100).toFixed(0)}%)
                          </StatusPill>
                        </td>
                        <td style={{ fontWeight: '800', fontFamily: 'monospace' }}>
                          {row.weightedPointsEarned.toFixed(2)} / {row.maxWeightedPoints.toFixed(2)}
                        </td>
                        <td style={{ fontSize: '0.76rem', color: '#334155', lineHeight: '1.4' }}>
                          {row.justification}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </ScorecardTable>
              </div>
            )}

            {/* ================= SECTION 8: INDEPENDENT MULTI-MODEL LLM LIVE API AUDIT CERTIFICATE ================= */}
            <div style={{ marginTop: '28px', paddingTop: '24px', borderTop: '2px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                  8. Independent Multi-Model LLM Live API Audit Certificate (Second-Opinion Statutory Cross-Examiner)
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <select
                    value={auditorModel}
                    onChange={(e) => setAuditorModel(e.target.value)}
                    style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '4px 8px', fontSize: '0.75rem', fontWeight: '700' }}
                  >
                    <option value="gemini-2.5-pro">Auditor: Gemini 2.5 Pro</option>
                    <option value="gemini-2.5-flash">Auditor: Gemini 2.5 Flash</option>
                    <option value="gemini-3.1-pro-preview">Auditor: Gemini 3.1 Pro Preview</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => handleRunLiveAudit(auditorModel)}
                    disabled={runningLiveAudit}
                    style={{ background: '#4f46e5', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '5px 12px', fontSize: '0.75rem', fontWeight: '800', cursor: 'pointer' }}
                  >
                    {runningLiveAudit ? 'Running Live Audit...' : '🔍 Run / Refresh Independent LLM Audit'}
                  </button>
                </div>
              </div>

              {!liveAuditReport ? (
                <div style={{ padding: '18px', borderRadius: '10px', background: '#eef2ff', border: '1px dashed #6366f1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ fontSize: '0.84rem', color: '#1e1b4b' }}>
                    <strong>Independent Second-Opinion Verification Ready:</strong> Click <em>Run / Refresh Independent LLM Audit</em> to execute a live multi-model cross-examination of all 20 answers, verifying accuracy, statutory weights, and cross-question contradictions via <strong>{auditorModel}</strong>.
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRunLiveAudit(auditorModel)}
                    style={{ background: '#4f46e5', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '0.8rem', fontWeight: '800', cursor: 'pointer' }}
                  >
                    ⚡ Execute Live Audit Now
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <MetaTable>
                    <tbody>
                      <tr>
                        <th>Independent Auditor Model</th>
                        <td style={{ fontWeight: '800', color: '#4f46e5' }}>{liveAuditReport.auditorModelUsed}</td>
                        <th>Verification Fingerprint</th>
                        <td><code>{liveAuditReport.verificationHash}</code> ({new Date(liveAuditReport.auditTimestamp).toLocaleTimeString()})</td>
                      </tr>
                      <tr>
                        <th>Primary Weighted Score</th>
                        <td style={{ fontWeight: '800' }}>{liveAuditReport.deterministicWeightedScore}% (Unweighted: {liveAuditReport.unweightedRawScore}%)</td>
                        <th>Independent LLM Calibrated Score</th>
                        <td style={{ fontWeight: '900', color: '#4f46e5', fontSize: '1.05rem' }}>
                          {liveAuditReport.llmCalibratedScore}% (Confidence: {liveAuditReport.confidenceScore}%)
                        </td>
                      </tr>
                      <tr>
                        <th>Audit Verdict</th>
                        <td colSpan={3} style={{ fontWeight: '800', color: liveAuditReport.overallVerdict === 'VERIFIED_ACCURATE' ? '#15803d' : '#b91c1c' }}>
                          {liveAuditReport.overallVerdict.replace(/_/g, ' ')} — {liveAuditReport.executiveAuditSummary}
                        </td>
                      </tr>
                    </tbody>
                  </MetaTable>

                  {liveAuditReport.crossQuestionContradictions?.length > 0 && (
                    <ScorecardTable>
                      <thead>
                        <tr>
                          <th style={{ width: '18%' }}>Cross-Question Check</th>
                          <th style={{ width: '14%' }}>Statutory Article</th>
                          <th style={{ width: '14%' }}>Severity</th>
                          <th style={{ width: '54%' }}>Auditor Finding & Required Resolution</th>
                        </tr>
                      </thead>
                      <tbody>
                        {liveAuditReport.crossQuestionContradictions.map((c, idx) => (
                          <tr key={idx}>
                            <td style={{ fontWeight: '800', color: '#1e3a8a' }}>{c.questionsInvolved}</td>
                            <td style={{ fontWeight: '700' }}>{c.article}</td>
                            <td>
                              <StatusPill $status={c.severity === 'CRITICAL' ? 'FAILED' : 'REMEDIATION REQUIRED'}>{c.severity}</StatusPill>
                            </td>
                            <td style={{ fontSize: '0.8rem', color: '#334155' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                <div>
                                  <strong>{c.title}:</strong> {c.finding} <br />
                                  <span style={{ color: '#1d4ed8', fontWeight: '700' }}>Resolution: {c.remediationAction}</span>
                                </div>
                                {c.severity !== 'INFO' && (
                                  <button
                                    type="button"
                                    onClick={() => handleAutoHealContradiction(c)}
                                    style={{ background: '#16a34a', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '4px 10px', fontSize: '0.72rem', fontWeight: '800', cursor: 'pointer', whiteSpace: 'nowrap' }}
                                  >
                                    🔧 1-Click Auto-Heal Contradiction
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </ScorecardTable>
                  )}
                </div>
              )}
            </div>

            {/* ================= SECTION 9: ARTICLE 27 FRIA MATRIX & PRIORITIZED REMEDIATION ROADMAP ================= */}
            <div style={{ marginTop: '28px', paddingTop: '24px', borderTop: '2px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', marginBottom: '12px' }}>
                9. Article 27 Fundamental Rights Impact Assessment (FRIA) & Engineering Remediation Roadmap
              </h3>

              {evaluation.friaCriteria && (
                <div style={{ marginBottom: '18px' }}>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: '800', color: '#1e3a8a', marginBottom: '8px' }}>
                    9.1 Statutory Article 27(1)(a–f) Fundamental Rights Impact Assessment Matrix
                  </h4>
                  <ScorecardTable>
                    <thead>
                      <tr>
                        <th style={{ width: '18%' }}>Statutory Clause</th>
                        <th style={{ width: '28%' }}>FRIA Evaluation Criterion</th>
                        <th style={{ width: '18%' }}>Readiness Status</th>
                        <th style={{ width: '36%' }}>System Impact & Safeguard Assessment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {evaluation.friaCriteria.map((fc, idx) => (
                        <tr key={idx}>
                          <td style={{ fontWeight: '800', color: '#1e3a8a' }}>{fc.clause}</td>
                          <td style={{ fontWeight: '700' }}>{fc.title}</td>
                          <td>
                            <StatusPill $status={fc.status.includes('VERIFIED') || fc.status.includes('MITIGATED') ? 'PASSED' : 'REMEDIATION REQUIRED'}>
                              {fc.status}
                            </StatusPill>
                          </td>
                          <td style={{ fontSize: '0.8rem', color: '#334155' }}>{fc.assessment}</td>
                        </tr>
                      ))}
                    </tbody>
                  </ScorecardTable>
                </div>
              )}

              <div>
                <h4 style={{ fontSize: '0.92rem', fontWeight: '800', color: '#1e3a8a', marginBottom: '8px' }}>
                  9.2 Prioritized Engineering & Legal Remediation Action Plan ({evaluation.remediationTasks.length} Items)
                </h4>
                {evaluation.remediationTasks.length === 0 ? (
                  <div style={{ padding: '14px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', color: '#166534', fontWeight: '700', fontSize: '0.85rem' }}>
                    ✓ Zero open statutory remediation items. System meets all pre-market conformity thresholds.
                  </div>
                ) : (
                  <ScorecardTable>
                    <thead>
                      <tr>
                        <th style={{ width: '14%' }}>Statutory Article</th>
                        <th style={{ width: '12%' }}>Severity & Wt</th>
                        <th style={{ width: '16%' }}>Target Owner</th>
                        <th style={{ width: '44%' }}>Mandatory Remediation Action</th>
                        <th style={{ width: '14%' }}>Live Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {evaluation.remediationTasks.map((t) => {
                        const currentStatus = taskStatusOverrides[t.id] || t.status || 'Todo';
                        return (
                          <tr key={t.id}>
                            <td style={{ fontWeight: '800', color: '#1e3a8a' }}>{t.article}</td>
                            <td>
                              <StatusPill $status={t.severity === 'CRITICAL' ? 'FAILED' : 'REMEDIATION REQUIRED'}>
                                {t.severity} ({t.statutoryWeight || 2.0}x)
                              </StatusPill>
                            </td>
                            <td style={{ fontWeight: '700', color: '#334155' }}>{t.targetOwner}</td>
                            <td style={{ fontSize: '0.8rem', color: '#0f172a' }}>{t.task}</td>
                            <td>
                              <select
                                value={currentStatus}
                                onChange={(e) => handleTaskStatusChange(t.id, e.target.value)}
                                style={{
                                  padding: '4px 8px',
                                  borderRadius: '6px',
                                  fontSize: '0.74rem',
                                  fontWeight: '800',
                                  border: '1px solid #cbd5e1',
                                  background: currentStatus === 'Completed' ? '#dcfce7' : (currentStatus === 'In Progress' ? '#dbeafe' : '#f1f5f9'),
                                  color: currentStatus === 'Completed' ? '#166534' : (currentStatus === 'In Progress' ? '#1e40af' : '#475569'),
                                  cursor: 'pointer'
                                }}
                              >
                                <option value="Todo">Todo</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                              </select>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </ScorecardTable>
                )}
              </div>
            </div>

            {/* Verification & Attestation Block */}
            <div style={{ marginTop: '28px', paddingTop: '24px', borderTop: '2px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', marginBottom: '6px' }}>
                10. C-Suite Statutory Attestation & Regulatory Sign-Off
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
