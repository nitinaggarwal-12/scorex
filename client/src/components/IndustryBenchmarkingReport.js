import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Footer from './Footer';
import {
  FiAward,
  FiTrendingUp,
  FiTrendingDown,
  FiTarget,
  FiBarChart2,
  FiUsers,
  FiAlertTriangle,
  FiCheckCircle,
  FiZap,
  FiShield,
  FiChevronDown,
  FiChevronUp,
  FiDownload,
  FiArrowLeft,
  FiFileText,
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiMonitor,
  FiPrinter
} from 'react-icons/fi';
import * as assessmentService from '../services/assessmentService';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell
} from 'recharts';

// Global print styles to hide navigation and other UI elements
const GlobalPrintStyles = createGlobalStyle`
  @media print {
    /* Hide navigation, headers, and action buttons */
    nav,
    header,
    [class*="GlobalNav"],
    [class*="PageHeader"],
    [class*="BackButton"],
    [class*="ActionButton"],
    [class*="DownloadButton"] {
      display: none !important;
    }

    /* Hide all fixed/sticky elements */
    *[style*="position: fixed"],
    *[style*="position: sticky"] {
      position: static !important;
    }

    /* Reset body and page margins */
    body {
      margin: 0 !important;
      padding: 0 !important;
      background: white !important;
    }

    /* Optimize print layout */
    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }

    /* 🚨 CRITICAL: Prevent page breaks inside ANY component */
    section,
    [class*="Section"],
    [class*="MetricsGrid"],
    [class*="InsightCard"],
    [class*="Card"],
    [class*="Container"],
    div[style*="background"],
    div[style*="border"],
    div[style*="padding"] {
      page-break-inside: avoid !important;
      break-inside: avoid-page !important;
    }

    /* Major sections can break to new page if needed */
    [class*="Section"] {
      page-break-before: auto !important;
      page-break-after: auto !important;
    }
  }
`;

// ... (keeping all the styled components from before, adding more)

const PageContainer = styled.div`
  min-height: 100vh;
  background: #f9fafb;
  padding: 108px 0 40px 0;

  @media (max-width: 768px) {
    padding: 92px 0 24px 0;
  }

  @media print {
    padding: 0;
    background: white;
  }
`;

const PageHeader = styled.div`
  margin: 0 0 24px 0;
  padding: 0 40px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 16px;

  @media (max-width: 768px) {
    padding: 0 16px;
  }

  @media print {
    display: none !important;
  }
`;

const BackButton = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: white;
  color: #3b82f6;
  border: 2px solid #3b82f6;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #3b82f6;
    color: white;
    transform: translateX(-4px);
  }
`;

const BenchmarkButton = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #059669;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  }
`;

const ReportContainer = styled(motion.div)`
  background: #ffffff;
  border-radius: 0;
  box-shadow: none;
  margin: 0;
  overflow: hidden;

  @media print {
    margin: 0;
    box-shadow: none;
    border-radius: 0;
    page-break-inside: avoid;
  }
`;

const ReportHeader = styled.div`
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  color: white;
  padding: 32px 40px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -10%;
    width: 500px;
    height: 500px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 50%;
  }

  @media print {
    padding: 20px 40px;
    page-break-after: avoid;
    
    &::before {
      display: none;
    }
  }
`;

const BrandingLogo = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 2px;
  color: #fbbf24;
  margin-bottom: 8px;
`;

const ReportTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 12px 0;
  position: relative;
  z-index: 1;
`;

const ReportSubtitle = styled.div`
  font-size: 1rem;
  opacity: 0.9;
  position: relative;
  z-index: 1;
`;

const Section = styled(motion.div)`
  padding: 32px 40px;
  border-bottom: 1px solid #e5e7eb;
  position: relative;

  &:last-child {
    border-bottom: none;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  cursor: ${props => props.$collapsible ? 'pointer' : 'default'};
  user-select: none;
  position: relative;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const SectionBadge = styled.div`
  background: ${props => props.$color || '#3b82f6'};
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const SectionActions = styled.div`
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.2s ease;
  margin-left: auto;

  ${SectionHeader}:hover & {
    opacity: 1;
  }

  @media (max-width: 768px) {
    opacity: 1;
  }

  @media print {
    display: none !important;
  }
`;

const ActionButton = styled.button`
  background: transparent;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 6px;
  cursor: pointer;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: #f8fafc;
    border-color: #3b82f6;
    color: #3b82f6;
  }

  @media print {
    display: none !important;
  }
`;

const FloatingSlideshowButton = styled.button`
  position: fixed;
  top: 110px;
  right: 32px;
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(139, 92, 246, 0.4);
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
  white-space: nowrap;
  z-index: 999;

  &:hover {
    background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(139, 92, 246, 0.6);
  }

  @media (max-width: 1024px) {
    top: 100px;
    right: 24px;
    padding: 7px 14px;
    font-size: 12px;
  }
  
  @media (max-width: 768px) {
    top: 90px;
    right: 16px;
    padding: 6px 12px;
    font-size: 11px;
  }
  
  @media print {
    display: none !important;
  }
`;

const ExecutiveSummaryBox = styled.div`
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border: 2px solid #fbbf24;
  border-radius: 12px;
  padding: 32px;
  margin: 24px 0;
`;

const Headline = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #78350f;
  margin: 0 0 20px 0;
  line-height: 1.5;
`;

const FindingsList = styled.ul`
  margin: 0;
  padding-left: 24px;
  color: #92400e;

  li {
    margin-bottom: 12px;
    font-size: 0.938rem;
    line-height: 1.6;
    font-weight: 500;
  }
`;

const TierBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 30px;
  font-size: 1.125rem;
  font-weight: 700;
  background: ${props => props.$bg || '#dbeafe'};
  color: ${props => props.$color || '#1e40af'};
  border: 2px solid ${props => props.$border || '#3b82f6'};
  box-shadow: 0 4px 12px ${props => props.$shadow || 'rgba(59, 130, 246, 0.2)'};
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin: 24px 0;
`;

const MetricCard = styled(motion.div)`
  background: ${props => props.$bg || '#f9fafb'};
  border: 2px solid ${props => props.$border || '#e5e7eb'};
  border-left: 4px solid ${props => props.$accent || '#3b82f6'};
  border-radius: 12px;
  padding: 20px;
  position: relative;
`;

const CardActions = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  gap: 6px;
  opacity: 0;
  transition: opacity 0.2s ease;

  ${MetricCard}:hover & {
    opacity: 1;
  }

  @media (max-width: 768px) {
    opacity: 1;
  }

  @media print {
    display: none !important;
  }
`;

const MetricLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
`;

const MetricValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
`;

const MetricSubtext = styled.div`
  font-size: 0.875rem;
  color: ${props => props.$color || '#6b7280'};
  display: flex;
  align-items: center;
  gap: 6px;
`;

const PillarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 20px;
  margin: 24px 0;

  @media (max-width: 1600px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const PillarCard = styled.div`
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px 16px;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    border-color: #3b82f6;
    box-shadow: 0 8px 24px rgba(59, 130, 246, 0.12);
    transform: translateY(-2px);
  }
`;

const PillarCardActions = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  gap: 6px;
  opacity: 0;
  transition: opacity 0.2s ease;

  ${PillarCard}:hover & {
    opacity: 1;
  }

  @media (max-width: 768px) {
    opacity: 1;
  }

  @media print {
    display: none !important;
  }
`;

const PillarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid #f3f4f6;
`;

const PillarName = styled.h4`
  font-size: 0.875rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
  text-transform: capitalize;
`;

const PercentileBadge = styled.div`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  background: ${props => props.$bg};
  color: ${props => props.$color};
`;

const ScoreRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const ScoreLabel = styled.span`
  font-size: 0.813rem;
  color: #6b7280;
  font-weight: 500;
`;

const ScoreValue = styled.span`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${props => props.$color || '#1f2937'};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  margin: 12px 0;
`;

const ProgressFill = styled(motion.div)`
  height: 100%;
  background: ${props => props.$color || '#3b82f6'};
  border-radius: 4px;
`;

const InsightCard = styled.div`
  background: ${props => props.$bg || '#f9fafb'};
  border: 2px solid ${props => props.$border || '#e5e7eb'};
  border-radius: 12px;
  padding: 20px;
  margin: 16px 0;
  position: relative;
`;

const InsightCardActions = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  gap: 6px;
  opacity: 0;
  transition: opacity 0.2s ease;

  ${InsightCard}:hover & {
    opacity: 1;
  }

  @media (max-width: 768px) {
    opacity: 1;
  }

  @media print {
    display: none !important;
  }
`;

const InsightHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`;

const InsightTitle = styled.h4`
  font-size: 1rem;
  font-weight: 700;
  color: ${props => props.$color || '#1f2937'};
  margin: 0;
`;

const InsightContent = styled.div`
  font-size: 0.875rem;
  line-height: 1.6;
  color: #374151;
`;

const ActionItem = styled.div`
  background: white;
  border: 2px solid #e5e7eb;
  border-left: 4px solid ${props => props.$color || '#3b82f6'};
  border-radius: 8px;
  padding: 16px;
  margin: 12px 0;
`;

const ActionTitle = styled.div`
  font-size: 0.938rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
`;

const ActionDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
  margin-top: 12px;
`;

const ActionTag = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  color: #6b7280;
`;

const ChartContainer = styled.div`
  margin: 32px 0;
  padding: 24px;
  background: #f9fafb;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
`;

const ChartTitle = styled.h4`
  font-size: 1rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 20px 0;
  text-align: center;
`;

const DownloadButton = styled(motion.button)`
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 0.938rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);

  &:hover {
    box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
  }
`;

// Helper function to format pillar names
const formatPillarName = (pillarId) => {
  return pillarId
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// 🎨 Modal Styled Components
const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
`;

const ModalContent = styled(motion.div)`
  background: white;
  border-radius: 16px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;

  h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
    color: #1f2937;
    text-transform: capitalize;
  }
`;

const ModalBody = styled.div`
  padding: 24px;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 24px;
  border-top: 1px solid #e5e7eb;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;

  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #374151;
    font-size: 0.875rem;
  }

  input,
  textarea {
    width: 100%;
    padding: 10px 12px;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    font-size: 0.938rem;
    transition: all 0.2s ease;

    &:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
  }

  textarea {
    resize: vertical;
    font-family: inherit;
  }
`;

const SaveButton = styled.button`
  padding: 10px 24px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
  }
`;

const CancelButton = styled.button`
  padding: 10px 24px;
  background: white;
  color: #6b7280;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f9fafb;
    border-color: #d1d5db;
  }
`;

// 🎬 Slideshow Styled Components
const SlideContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #2563eb 100%);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SlideContent = styled.div`
  position: absolute;
  top: 80px;
  left: 100px;
  right: 100px;
  bottom: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
`;

const SlideHeading = styled.div`
  position: absolute;
  top: 20px;
  left: 60px;
  font-size: 1.8rem;
  fontWeight: 700;
  color: white;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
  
  ${SlideContainer}:hover & {
    opacity: 1;
  }
`;

const SlideCounter = styled.div`
  position: absolute;
  bottom: 20px;
  right: 60px;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 600;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
  
  ${SlideContainer}:hover & {
    opacity: 1;
  }
`;

const ClickArea = styled.div`
  position: absolute;
  top: 0;
  width: 50%;
  height: 100%;
  cursor: ${props => props.$direction === 'left' ? 'w-resize' : 'e-resize'};
  z-index: 1;
  ${props => props.$direction === 'left' ? 'left: 0;' : 'right: 0;'}
`;

const NavigationButton = styled(motion.button)`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${props => props.$direction === 'left' ? 'left: 32px;' : 'right: 32px;'}
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  border: 2px solid rgba(59, 130, 246, 0.3);
  color: #3b82f6;
  font-size: 1.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 100;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  opacity: 0;
  transition: all 0.3s ease;
  
  ${SlideContainer}:hover & {
    opacity: 1;
  }
  
  &:hover {
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
    transform: translateY(-50%) scale(1.1);
  }
  
  &:active {
    transform: translateY(-50%) scale(0.95);
  }
  
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    
    &:hover {
      background: rgba(255, 255, 255, 0.95);
      color: #3b82f6;
      border-color: rgba(59, 130, 246, 0.3);
      transform: translateY(-50%) scale(1);
    }
  }
`;

// Global print styles
const PrintStyles = styled.div`
  @media print {
    /* Enable background graphics */
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
    
    /* Page margins - zero to prevent content cutoff */
    @page {
      margin: 0;
      size: letter;
    }
    
    /* Keep sections together */
    section,
    div[style*="background"],
    [class*="Card"],
    [class*="Container"] {
      page-break-inside: avoid !important;
      break-inside: avoid-page !important;
    }
    
    /* Headings stay with content */
    h1, h2, h3, h4, h5, h6 {
      page-break-after: avoid !important;
      break-after: avoid-page !important;
    }
  }
`;

const PrintSlide = styled.div`
  @media print {
    page-break-after: always;
    page-break-inside: avoid;
    width: 100%;
    min-height: 100vh;
    max-height: 100vh;
    height: auto;
    position: relative;
    background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #2563eb 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
    margin: 0;
    box-sizing: border-box;
    overflow: hidden;
  }
  
  @media screen {
    display: none;
  }
`;

const ExitButton = styled(motion.button)`
  position: absolute;
  top: 20px;
  right: 60px;
  background: rgba(239, 68, 68, 0.9);
  color: white;
  border: none;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 300;
  line-height: 1;
  cursor: pointer;
  z-index: 10;
  pointer-events: auto;
  opacity: 0;
  transition: all 0.3s ease;
  
  ${SlideContainer}:hover & {
    opacity: 1;
  }

  &:hover {
    transform: scale(1.15);
    background: rgba(239, 68, 68, 1);
    box-shadow: 0 4px 16px rgba(239, 68, 68, 0.6);
  }
`;

const PrintButton = styled(motion.button)`
  position: absolute;
  top: 20px;
  right: 120px;
  background: rgba(34, 197, 94, 0.9);
  color: white;
  border: none;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  cursor: pointer;
  z-index: 10;
  pointer-events: auto;
  opacity: 0;
  transition: all 0.3s ease;
  
  ${SlideContainer}:hover & {
    opacity: 1;
  }

  &:hover {
    transform: scale(1.15);
    background: rgba(34, 197, 94, 1);
    box-shadow: 0 4px 16px rgba(34, 197, 94, 0.6);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const IndustryBenchmarkingReport = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const [collapsedSections, setCollapsedSections] = useState({});
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState(null);
  const [benchmarkData, setBenchmarkData] = useState(null);
  const [error, setError] = useState(null);
  
  // 🎨 CRUD State
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'section', 'metric', 'pillar', 'insight', etc.
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  // 🎬 Presentation Mode State
  const [presentationMode, setPresentationMode] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [printMode, setPrintMode] = useState(false);

  useEffect(() => {
    // Fetch assessment results
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await assessmentService.getAssessmentResults(assessmentId);
        setResults(response.data || response);
      } catch (err) {
        console.error('Error fetching assessment data:', err);
        setError('Failed to load assessment data');
        setLoading(false);
      }
    };
    
    if (assessmentId) {
      fetchData();
    }
  }, [assessmentId]);

  // Fetch benchmark data separately
  useEffect(() => {
    const fetchBenchmarkData = async () => {
      if (!results) return;
      
      try {
        const data = await assessmentService.getBenchmarkReport(assessmentId);
        setBenchmarkData(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching benchmark data:', err);
        setBenchmarkData(null);
        setLoading(false);
      }
    };

    if (results && !benchmarkData) {
      fetchBenchmarkData();
    }
  }, [results, benchmarkData, assessmentId]);

  // Extract data from results
  const assessment = results?.assessmentInfo;
  const overallScore = results?.overall?.currentScore || results?.overallScore || 0;
  const pillarScores = results?.categoryDetails || {};
  const selectedPillars = results?.selectedPillars || results?.assessmentInfo?.selectedPillars || [];

  // Filter pillar analysis to only include selected pillars (must be before early returns)
  const filteredPillarAnalysis = React.useMemo(() => {
    const pillarAnalysis = benchmarkData?.pillarAnalysis;
    if (!pillarAnalysis) return {};
    
    // If no pillars selected (old assessment or empty), show all
    if (!selectedPillars || selectedPillars.length === 0) {
      return pillarAnalysis;
    }
    
    // Filter to only selected pillars
    const filtered = {};
    Object.entries(pillarAnalysis).forEach(([pillarId, data]) => {
      if (selectedPillars.includes(pillarId)) {
        filtered[pillarId] = data;
      }
    });
    
    console.log('📊 [Benchmark] Filtered pillars:', {
      total: Object.keys(pillarAnalysis).length,
      selected: selectedPillars.length,
      filtered: Object.keys(filtered).length,
      pillarIds: Object.keys(filtered)
    });
    
    return filtered;
  }, [benchmarkData?.pillarAnalysis, selectedPillars]);

  useEffect(() => {
    // Original loading simulation
    setTimeout(() => setLoading(false), 500);
  }, []);

  const toggleSection = (sectionId) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handleDownloadReport = () => {
    // Show brief toast
    const toastId = 
    
    // Set print mode to render all slides
    setPrintMode(true);
    
    // Dismiss the toast and open print dialog
    setTimeout(() => {
      toast.dismiss(toastId);
      toast.dismiss();
      setTimeout(() => {
        window.print();
        // Exit print mode after printing
        setTimeout(() => {
          setPrintMode(false);
        }, 500);
      }, 500);
    }, 1000);
  };

  // 🎬 Slideshow Navigation Functions
  const exitPresentation = () => {
    setPresentationMode(false);
    setCurrentSlide(0);
    document.body.style.overflow = 'auto';
  };

  const nextSlide = () => {
    const totalSlides = 7; // 0-6: Title, Exec Summary+Position, Pillars, Vulnerabilities, Recommendations, Methodology, Thank You
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      // Exit slideshow when trying to go past the last slide
      exitPresentation();
    }
  };

  const previousSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  // Keyboard navigation for slideshow
  useEffect(() => {
    if (!presentationMode) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        previousSlide();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        exitPresentation();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [presentationMode, currentSlide]);

  // Print slideshow as PDF
  const handlePrintSlideshow = async () => {
    const pdf = new jsPDF('landscape', 'pt', 'letter');
    const slideCount = 5; // Total slides
    
    toast.loading(`Generating PDF (0/${slideCount} slides)...`, { id: 'print-progress' });

    try {
      // Hide scrollbars during capture
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      
      let isFirstPage = true;
      
      for (let i = 0; i < slideCount; i++) {
        // Navigate to slide
        setCurrentSlide(i);
        
        // Wait for slide to render
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Hide UI elements
        const elementsToHide = document.querySelectorAll('[data-hide-on-print="true"]');
        elementsToHide.forEach(el => {
          el.style.display = 'none';
        });
        
        // Wait for layout to settle
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Capture the entire body/viewport as it appears on screen
        const canvas = await html2canvas(document.body, {
          scale: 2,
          useCORS: true,
          logging: false,
          allowTaint: true,
          foreignObjectRendering: true,
          backgroundColor: '#1e3a8a',
          width: window.innerWidth,
          height: window.innerHeight,
          windowWidth: window.innerWidth,
          windowHeight: window.innerHeight,
          x: 0,
          y: 0,
          scrollX: 0,
          scrollY: 0
        });
        
        // Restore UI elements
        elementsToHide.forEach(el => {
          el.style.display = '';
        });
        
        const imgData = canvas.toDataURL('image/png');
        
        // Calculate dimensions to maintain aspect ratio without stretching
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const canvasAspectRatio = canvas.width / canvas.height;
        const pdfAspectRatio = pdfWidth / pdfHeight;
        
        let finalWidth, finalHeight, xOffset, yOffset;
        
        if (canvasAspectRatio > pdfAspectRatio) {
          // Canvas is wider - fit to width
          finalWidth = pdfWidth;
          finalHeight = pdfWidth / canvasAspectRatio;
          xOffset = 0;
          yOffset = (pdfHeight - finalHeight) / 2;
        } else {
          // Canvas is taller - fit to height
          finalHeight = pdfHeight;
          finalWidth = pdfHeight * canvasAspectRatio;
          xOffset = (pdfWidth - finalWidth) / 2;
          yOffset = 0;
        }
        
        if (!isFirstPage) {
          pdf.addPage();
        }
        isFirstPage = false;
        
        // Add image with proper aspect ratio
        pdf.addImage(imgData, 'PNG', xOffset, yOffset, finalWidth, finalHeight);
        
        toast.loading(`Generating PDF (${i + 1}/${slideCount} slides)...`, { id: 'print-progress' });
      }
      
      // Restore scrollbars
      document.body.style.overflow = originalOverflow;
      
      // Save PDF
      const assessmentName = results?.assessmentInfo?.name || 'Industry-Benchmarking';
      pdf.save(`${assessmentName.replace(/\s+/g, '-')}-Slideshow.pdf`);
      
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Restore scrollbars on error
      document.body.style.overflow = 'auto';
      
    }
  };

  // 🎨 CRUD Handlers
  const handleEdit = (type, item) => {
    console.log('[Edit]', type, item);
    setModalType(type);
    setEditingItem(item);
    
    // Transform data for the form based on type
    if (type === 'executive-summary' && item) {
      setFormData({
        headline: item.headline || '',
        keyFindings: item.keyFindings?.join('\n') || '',
        marketContext: item.marketContext || ''
      });
    } else {
      setFormData(item || {});
    }
    
    setShowModal(true);
  };

  const handleDelete = (type, item) => {
    console.log('[Delete]', type, item);
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      // In a real app, you'd update the backend here
      alert(`${type} deleted successfully!`);
    }
  };

  const handleAdd = (type) => {
    console.log('[Add]', type);
    setModalType(type);
    setEditingItem(null);
    setFormData({});
    setShowModal(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log('[Form Submit]', modalType, formData);
    // In a real app, you'd save to backend here
    setShowModal(false);
    alert(`${modalType} ${editingItem ? 'updated' : 'added'} successfully!`);
  };

  const getTierIcon = (tier) => {
    switch(tier) {
      case 'Market Leader': return FiAward;
      case 'Fast Follower': return FiTrendingUp;
      case 'Industry Average': return FiUsers;
      default: return FiTrendingDown;
    }
  };

  const getTierColor = (tier) => {
    switch(tier) {
      case 'Market Leader': return { bg: '#d1fae5', color: '#065f46', border: '#10b981', shadow: 'rgba(16, 185, 129, 0.2)' };
      case 'Fast Follower': return { bg: '#dbeafe', color: '#1e40af', border: '#3b82f6', shadow: 'rgba(59, 130, 246, 0.2)' };
      case 'Industry Average': return { bg: '#fef3c7', color: '#78350f', border: '#fbbf24', shadow: 'rgba(251, 191, 36, 0.2)' };
      default: return { bg: '#fee2e2', color: '#991b1b', border: '#ef4444', shadow: 'rgba(239, 68, 68, 0.2)' };
    }
  };

  const getPercentileColor = (percentile) => {
    if (percentile >= 75) return { bg: '#d1fae5', color: '#065f46' };
    if (percentile >= 50) return { bg: '#dbeafe', color: '#1e40af' };
    if (percentile >= 25) return { bg: '#fef3c7', color: '#78350f' };
    return { bg: '#fee2e2', color: '#991b1b' };
  };

  if (loading || !benchmarkData) {
    return (
      <ReportContainer>
        <Section>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <FiBarChart2 size={48} color="#3b82f6" />
            <p style={{ marginTop: '16px', color: '#6b7280' }}>
              Generating comprehensive benchmarking analysis...
            </p>
          </div>
        </Section>
      </ReportContainer>
    );
  }

  const { executiveSummary, competitivePositioning, pillarAnalysis, competitiveIntelligence, strategicRecommendations, metadata } = benchmarkData;
  const TierIcon = getTierIcon(competitivePositioning?.overallRanking?.tier);
  const tierColors = getTierColor(competitivePositioning?.overallRanking?.tier);

  // Use score from metadata if available (preferred), otherwise fallback to prop or calculate from filtered pillars
  const actualScore = metadata?.overallScore || overallScore || (
    filteredPillarAnalysis ? 
      Object.values(filteredPillarAnalysis).reduce((sum, p) => sum + (p.customerScore || 0), 0) / Object.values(filteredPillarAnalysis).length 
      : 0
  );

  console.log('[IndustryBenchmarkingReport] Score debug:', { 
    metadataScore: metadata?.overallScore, 
    propScore: overallScore, 
    actualScore,
    pillarCount: filteredPillarAnalysis ? Object.keys(filteredPillarAnalysis).length : 0,
    selectedPillars: selectedPillars.length
  });

  return (
    <>
      <GlobalPrintStyles />
      
      {/* 🖨️ PRINT MODE: Render all slides for printing */}
      {printMode && benchmarkData && (
        <div style={{ display: 'none' }} className="print-slides-container">
          <style>{`
            @media print {
              body * {
                visibility: hidden;
              }
              .print-slides-container,
              .print-slides-container * {
                visibility: visible !important;
              }
              .print-slides-container {
                display: block !important;
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
              }
            }
          `}</style>
          {/* Industry Benchmarking Report Slides */}
          {[0, 1, 2, 3, 4].map((slideIndex) => (
            <PrintSlide key={slideIndex}>
              <div style={{
                width: '100%',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                padding: '50px 60px 40px 60px',
                color: 'white'
              }}>
                {/* Slide Header */}
                <div style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '25px', color: 'white' }}>
                  {slideIndex === 0 ? 'Industry Benchmarking Report' :
                   slideIndex === 1 ? 'Executive Summary' :
                   slideIndex === 2 ? 'Competitive Analysis' :
                   slideIndex === 3 ? 'Pillar Comparison' :
                   'Strategic Recommendations'}
                </div>
                
                {/* Slide Content */}
                <div style={{ flex: 1, overflow: 'hidden', width: '100%', maxWidth: '100%' }}>
                  {slideIndex === 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', textAlign: 'center' }}>
                      <div style={{ fontSize: '4rem', fontWeight: 700, color: 'white', marginBottom: '24px' }}>
                        Industry Benchmarking Report
                      </div>
                      <div style={{ fontSize: '1.5rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                        Competitive Analysis & Market Positioning
                      </div>
                    </div>
                  ) : (
                    <div style={{ background: 'rgba(255, 255, 255, 0.95)', padding: '30px', maxWidth: '100%', overflow: 'hidden', boxSizing: 'border-box' }}>
                      <div style={{ fontSize: '1.1rem', color: '#475569', textAlign: 'center' }}>
                        {slideIndex === 1 ? 'Benchmark Summary and Key Insights' :
                         slideIndex === 2 ? 'How you compare to industry peers' :
                         slideIndex === 3 ? 'Pillar-by-pillar performance comparison' :
                         'Recommended actions based on benchmarks'}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </PrintSlide>
          ))}
        </div>
      )}
      
      <PageContainer>
        <PageHeader>
          <div style={{ display: 'flex', gap: '12px' }}>
            <BackButton
              onClick={() => navigate(`/executive/${assessmentId}`)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiArrowLeft size={18} />
              Full Report
            </BackButton>
            <BenchmarkButton
              onClick={() => navigate(`/executive/${assessmentId}`)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiBarChart2 size={18} />
              Executive Command Center
            </BenchmarkButton>
          </div>
        </PageHeader>
        
        {/* Floating Start Slideshow Button */}
        {!presentationMode && (
          <FloatingSlideshowButton
            onClick={() => { setPresentationMode(true); setCurrentSlide(0); document.body.style.overflow = 'hidden'; }}
          >
            <FiMonitor size={18} />
            Slideshow
          </FloatingSlideshowButton>
        )}

      <ReportContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
      {/* Report Header */}
      <ReportHeader>
        <BrandingLogo>DATABRICKS MATURITY ASSESSMENT</BrandingLogo>
        <ReportTitle>Industry Benchmarking Report</ReportTitle>
        <ReportSubtitle>
          Data Platform Maturity Analysis  •  {assessment?.industry || 'Industry'}  •  {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </ReportSubtitle>
      </ReportHeader>

      {/* Executive Summary */}
      <Section>
        <SectionHeader>
          <SectionTitle>
            <FiZap color="#fbbf24" />
            Executive Summary
          </SectionTitle>
          <SectionActions>
            <ActionButton title="Edit Section" onClick={() => handleEdit('executive-summary', executiveSummary)}>
              <FiEdit2 size={16} />
            </ActionButton>
            <ActionButton title="Delete Section" onClick={() => handleDelete('executive-summary', executiveSummary)}>
              <FiTrash2 size={16} />
            </ActionButton>
          </SectionActions>
        </SectionHeader>

        <ExecutiveSummaryBox>
          <Headline>{executiveSummary?.headline}</Headline>
          <FindingsList>
            {executiveSummary?.keyFindings?.map((finding, idx) => (
              <li key={idx}>{finding}</li>
            ))}
          </FindingsList>
          <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(255, 255, 255, 0.6)', borderRadius: '8px' }}>
            <strong style={{ color: '#78350f' }}>Market Context:</strong>
            <p style={{ margin: '8px 0 0 0', color: '#92400e', fontSize: '0.875rem', lineHeight: 1.6 }}>
              {executiveSummary?.marketContext}
            </p>
          </div>
        </ExecutiveSummaryBox>
      </Section>

      {/* Competitive Positioning */}
      <Section>
        <SectionHeader>
          <SectionTitle>
            <FiTarget color="#3b82f6" />
            Your Competitive Position
          </SectionTitle>
          <SectionActions>
            <ActionButton title="Add Metric" onClick={() => handleAdd('metric')}>
              <FiPlus size={16} />
            </ActionButton>
            <ActionButton title="Edit Section" onClick={() => handleEdit('competitive-position', competitivePositioning)}>
              <FiEdit2 size={16} />
            </ActionButton>
            <ActionButton title="Delete Section" onClick={() => handleDelete('competitive-position', competitivePositioning)}>
              <FiTrash2 size={16} />
            </ActionButton>
          </SectionActions>
        </SectionHeader>

        <div style={{ textAlign: 'center', margin: '32px 0' }}>
          <TierBadge $bg={tierColors.bg} $color={tierColors.color} $border={tierColors.border} $shadow={tierColors.shadow}>
            <TierIcon size={24} />
            {competitivePositioning?.overallRanking?.tier}
          </TierBadge>
          <p style={{ marginTop: '16px', fontSize: '1.125rem', color: '#6b7280' }}>
            Top <strong>{100 - competitivePositioning?.overallRanking?.percentile}%</strong> of {assessment?.industry} organizations
          </p>
        </div>

        <MetricsGrid>
          <MetricCard $bg="#fef3c7" $border="#fbbf24" $accent="#f59e0b">
            <CardActions>
              <ActionButton title="Edit Metric" onClick={() => handleEdit("metric", {})}>
                <FiEdit2 size={14} />
              </ActionButton>
              <ActionButton title="Delete Metric" onClick={() => handleDelete("metric", {})}>
                <FiTrash2 size={14} />
              </ActionButton>
            </CardActions>
            <MetricLabel>Overall Percentile</MetricLabel>
            <MetricValue>{competitivePositioning?.overallRanking?.percentile}th</MetricValue>
            <MetricSubtext>
              <FiAward color="#f59e0b" />
              {competitivePositioning?.overallRanking?.versusBenchmark}
            </MetricSubtext>
          </MetricCard>

          <MetricCard $bg="#dbeafe" $border="#3b82f6" $accent="#2563eb">
            <CardActions>
              <ActionButton title="Edit Metric" onClick={() => handleEdit("metric", {})}>
                <FiEdit2 size={14} />
              </ActionButton>
              <ActionButton title="Delete Metric" onClick={() => handleDelete("metric", {})}>
                <FiTrash2 size={14} />
              </ActionButton>
            </CardActions>
            <MetricLabel>Peer Group</MetricLabel>
            <MetricValue style={{ fontSize: '1rem', lineHeight: 1.4, marginTop: '12px' }}>
              {competitivePositioning?.overallRanking?.peerGroup}
            </MetricValue>
          </MetricCard>

          <MetricCard $bg="#e0f2fe" $border="#0ea5e9" $accent="#0284c7">
            <CardActions>
              <ActionButton title="Edit Metric" onClick={() => handleEdit("metric", {})}>
                <FiEdit2 size={14} />
              </ActionButton>
              <ActionButton title="Delete Metric" onClick={() => handleDelete("metric", {})}>
                <FiTrash2 size={14} />
              </ActionButton>
            </CardActions>
            <MetricLabel>Maturity Score</MetricLabel>
            <MetricValue>{actualScore?.toFixed(1)}<span style={{ fontSize: '1rem', color: '#6b7280' }}>/5.0</span></MetricValue>
            <MetricSubtext $color="#0369a1">
              Comprehensive 6-pillar assessment
            </MetricSubtext>
          </MetricCard>
        </MetricsGrid>

        {/* Radar Chart */}
        {benchmarkData?.visualizations?.radarChart && (
          <ChartContainer>
            <ChartTitle>Pillar Performance vs Industry Benchmark</ChartTitle>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={benchmarkData.visualizations.radarChart}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="pillar" tick={{ fill: '#6b7280', fontSize: 12 }} />
                <PolarRadiusAxis angle={90} domain={[0, 5]} tick={{ fill: '#6b7280' }} />
                <Radar name="Your Score" dataKey="customerScore" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                <Radar name="Industry Avg" dataKey="industryAverage" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} />
                <Radar name="Top Quartile" dataKey="topQuartile" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </Section>

      {/* Pillar-by-Pillar Analysis */}
      <Section>
        <SectionHeader $collapsible>
          <div onClick={() => toggleSection('pillars')} style={{ display: 'flex', alignItems: 'center', flex: 1, cursor: 'pointer' }}>
            <SectionTitle>
              <FiBarChart2 color="#3b82f6" />
              Detailed Pillar Analysis
              <SectionBadge $color="#3b82f6">{Object.keys(filteredPillarAnalysis || {}).length} Pillars</SectionBadge>
            </SectionTitle>
            {collapsedSections['pillars'] ? <FiChevronDown size={24} style={{ marginLeft: 'auto' }} /> : <FiChevronUp size={24} style={{ marginLeft: 'auto' }} />}
          </div>
          <SectionActions>
            <ActionButton title="Add Pillar" onClick={() => handleAdd('pillar')}>
              <FiPlus size={16} />
            </ActionButton>
            <ActionButton title="Edit Section" onClick={() => handleEdit('pillar-section', filteredPillarAnalysis)}>
              <FiEdit2 size={16} />
            </ActionButton>
            <ActionButton title="Delete Section" onClick={() => handleDelete('pillar-section', filteredPillarAnalysis)}>
              <FiTrash2 size={16} />
            </ActionButton>
          </SectionActions>
        </SectionHeader>

        <AnimatePresence>
          {!collapsedSections['pillars'] && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ overflow: 'hidden' }}
            >
              <PillarGrid>
                {Object.entries(filteredPillarAnalysis || {}).map(([pillarId, data]) => {
                  const percentileColor = getPercentileColor(data.percentileRank);
                  const gap = (data.customerScore - data.industryAverage).toFixed(1);
                  const isAbove = gap >= 0;

                  return (
                    <PillarCard key={pillarId}>
                      <PillarCardActions>
                        <ActionButton title="Edit Pillar" onClick={() => handleEdit('pillar', { pillarId, ...data })}>
                          <FiEdit2 size={14} />
                        </ActionButton>
                        <ActionButton title="Delete Pillar" onClick={() => handleDelete('pillar', { pillarId, ...data })}>
                          <FiTrash2 size={14} />
                        </ActionButton>
                      </PillarCardActions>
                      <PillarHeader>
                        <PillarName>{data.pillar || formatPillarName(pillarId)}</PillarName>
                        <PercentileBadge $bg={percentileColor.bg} $color={percentileColor.color}>
                          {data.percentileRank}th %ile
                        </PercentileBadge>
                      </PillarHeader>

                      <ScoreRow>
                        <ScoreLabel>Your Score</ScoreLabel>
                        <ScoreValue $color="#1f2937">{data.customerScore?.toFixed(1)}</ScoreValue>
                      </ScoreRow>

                      <ScoreRow>
                        <ScoreLabel>Industry Average</ScoreLabel>
                        <ScoreValue $color="#6b7280">{data.industryAverage?.toFixed(1)}</ScoreValue>
                      </ScoreRow>

                      <ScoreRow>
                        <ScoreLabel>Top Quartile</ScoreLabel>
                        <ScoreValue $color="#10b981">{data.topQuartile?.toFixed(1)}</ScoreValue>
                      </ScoreRow>

                      <ProgressBar>
                        <ProgressFill
                          $color={isAbove ? '#10b981' : '#ef4444'}
                          initial={{ width: 0 }}
                          animate={{ width: `${(data.customerScore / 5) * 100}%` }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                        />
                      </ProgressBar>

                      <div style={{ fontSize: '0.813rem', color: isAbove ? '#065f46' : '#991b1b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {isAbove ? <FiTrendingUp /> : <FiTrendingDown />}
                        {Math.abs(gap)} points {isAbove ? 'above' : 'below'} industry avg
                      </div>

                      {data.competitiveGap && (
                        <div style={{ marginTop: '12px', padding: '12px', background: '#f9fafb', borderRadius: '8px', fontSize: '0.813rem', color: '#374151' }}>
                          <strong>Gap to Leaders:</strong> {data.competitiveGap}
                        </div>
                      )}
                    </PillarCard>
                  );
                })}
              </PillarGrid>
            </motion.div>
          )}
        </AnimatePresence>
      </Section>

      {/* Competitive Intelligence */}
      {competitiveIntelligence && (
        <Section>
          <SectionHeader>
            <SectionTitle>
              <FiShield color="#10b981" />
              Competitive Intelligence
            </SectionTitle>
          </SectionHeader>

          {/* Strengths */}
          {competitiveIntelligence.strengths?.length > 0 && (
            <div>
              <h4 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#065f46', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiCheckCircle /> Competitive Strengths
              </h4>
              {competitiveIntelligence.strengths.map((strength, idx) => (
                <InsightCard key={idx} $bg="#d1fae5" $border="#10b981">
                  <InsightCardActions>
                    <ActionButton title="Edit Strength" onClick={() => handleEdit("strength", strength)}>
                      <FiEdit2 size={14} />
                    </ActionButton>
                    <ActionButton title="Delete Strength" onClick={() => handleDelete("strength", strength)}>
                      <FiTrash2 size={14} />
                    </ActionButton>
                  </InsightCardActions>
                  <InsightHeader>
                    <InsightTitle $color="#065f46">{strength.area}</InsightTitle>
                  </InsightHeader>
                  <InsightContent>
                    <p><strong>Evidence:</strong> {strength.evidence}</p>
                    <p><strong>Competitive Advantage:</strong> {strength.competitiveAdvantage}</p>
                    <p><strong>Recommendation:</strong> {strength.recommendation}</p>
                  </InsightContent>
                </InsightCard>
              ))}
            </div>
          )}

          {/* Vulnerabilities */}
          {competitiveIntelligence.vulnerabilities?.length > 0 && (
            <div style={{ marginTop: '32px' }}>
              <h4 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#991b1b', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiAlertTriangle /> Competitive Vulnerabilities
              </h4>
              {competitiveIntelligence.vulnerabilities.map((vuln, idx) => (
                <InsightCard key={idx} $bg="#fee2e2" $border="#ef4444">
                  <InsightCardActions>
                    <ActionButton title="Edit Vulnerability" onClick={() => handleEdit("vulnerability", vuln)}>
                      <FiEdit2 size={14} />
                    </ActionButton>
                    <ActionButton title="Delete Vulnerability" onClick={() => handleDelete("vulnerability", vuln)}>
                      <FiTrash2 size={14} />
                    </ActionButton>
                  </InsightCardActions>
                  <InsightHeader>
                    <InsightTitle $color="#991b1b">{vuln.area}</InsightTitle>
                  </InsightHeader>
                  <InsightContent>
                    <p><strong>Evidence:</strong> {vuln.evidence}</p>
                    <p><strong>Business Risk:</strong> {vuln.businessRisk}</p>
                    <p><strong>Competitor Advantage:</strong> {vuln.competitorAdvantage}</p>
                    <p><strong>Remediation:</strong> {vuln.remediation}</p>
                  </InsightContent>
                </InsightCard>
              ))}
            </div>
          )}
        </Section>
      )}

      {/* Strategic Recommendations */}
      {strategicRecommendations && (
        <Section>
          <SectionHeader>
            <SectionTitle>
              <FiTarget color="#3b82f6" />
              Strategic Recommendations
            </SectionTitle>
            <SectionActions>
              <ActionButton title="Add Recommendation" onClick={() => handleAdd('recommendation')}>
                <FiPlus size={16} />
              </ActionButton>
              <ActionButton title="Edit Section" onClick={() => handleEdit('recommendations-section', strategicRecommendations)}>
                <FiEdit2 size={16} />
              </ActionButton>
              <ActionButton title="Delete Section" onClick={() => handleDelete('recommendations-section', strategicRecommendations)}>
                <FiTrash2 size={16} />
              </ActionButton>
            </SectionActions>
          </SectionHeader>

          {/* Immediate Actions */}
          {strategicRecommendations.immediate?.length > 0 && (
            <div>
              <h4 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#ef4444', marginBottom: '16px' }}>
                Immediate Actions (0-3 months)
              </h4>
              {strategicRecommendations.immediate.map((action, idx) => (
                <ActionItem key={idx} $color="#ef4444">
                  <ActionTitle>{action.action}</ActionTitle>
                  <InsightContent>
                    <p>{action.rationale}</p>
                    <ActionDetails>
                      <ActionTag>
                        <FiTarget size={14} />
                        <strong>Impact:</strong> {action.impact}
                      </ActionTag>
                      <ActionTag>
                        <FiBarChart2 size={14} />
                        <strong>Effort:</strong> {action.effort}
                      </ActionTag>
                      <ActionTag>
                        <FiZap size={14} />
                        <strong>Timeline:</strong> {action.timeframe}
                      </ActionTag>
                    </ActionDetails>
                  </InsightContent>
                </ActionItem>
              ))}
            </div>
          )}

          {/* Short-term Actions */}
          {strategicRecommendations.shortTerm?.length > 0 && (
            <div style={{ marginTop: '32px' }}>
              <h4 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#f59e0b', marginBottom: '16px' }}>
                Short-term Actions (3-6 months)
              </h4>
              {strategicRecommendations.shortTerm.map((action, idx) => (
                <ActionItem key={idx} $color="#f59e0b">
                  <ActionTitle>{action.action}</ActionTitle>
                  <InsightContent>
                    <p>{action.rationale}</p>
                    <ActionDetails>
                      <ActionTag>
                        <FiTarget size={14} />
                        <strong>Impact:</strong> {action.impact}
                      </ActionTag>
                      <ActionTag>
                        <FiBarChart2 size={14} />
                        <strong>Effort:</strong> {action.effort}
                      </ActionTag>
                      <ActionTag>
                        <FiZap size={14} />
                        <strong>Timeline:</strong> {action.timeframe}
                      </ActionTag>
                    </ActionDetails>
                  </InsightContent>
                </ActionItem>
              ))}
            </div>
          )}

          {/* Long-term Actions */}
          {strategicRecommendations.longTerm?.length > 0 && (
            <div style={{ marginTop: '32px' }}>
              <h4 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#3b82f6', marginBottom: '16px' }}>
                Long-term Initiatives (6-12+ months)
              </h4>
              {strategicRecommendations.longTerm.map((action, idx) => (
                <ActionItem key={idx} $color="#3b82f6">
                  <ActionTitle>{action.action}</ActionTitle>
                  <InsightContent>
                    <p>{action.rationale}</p>
                    <ActionDetails>
                      <ActionTag>
                        <FiTarget size={14} />
                        <strong>Impact:</strong> {action.impact}
                      </ActionTag>
                      <ActionTag>
                        <FiBarChart2 size={14} />
                        <strong>Effort:</strong> {action.effort}
                      </ActionTag>
                      <ActionTag>
                        <FiZap size={14} />
                        <strong>Timeline:</strong> {action.timeframe}
                      </ActionTag>
                    </ActionDetails>
                  </InsightContent>
                </ActionItem>
              ))}
            </div>
          )}
        </Section>
      )}

      {/* Methodology */}
      <Section style={{ background: '#f9fafb' }}>
        <SectionHeader>
          <SectionTitle style={{ fontSize: '1rem' }}>
            Methodology & Data Sources
          </SectionTitle>
          <SectionActions>
            <ActionButton title="Edit Section" onClick={() => handleEdit('methodology', benchmarkData?.methodology)}>
              <FiEdit2 size={16} />
            </ActionButton>
            <ActionButton title="Delete Section" onClick={() => handleDelete('methodology', benchmarkData?.methodology)}>
              <FiTrash2 size={16} />
            </ActionButton>
          </SectionActions>
        </SectionHeader>
        <div style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.6 }}>
          <p><strong>Data Source:</strong> {benchmarkData.methodology?.dataSource}</p>
          <p><strong>Sample Size:</strong> {benchmarkData.methodology?.sampleSize}+ {assessment?.industry} organizations</p>
          <p><strong>Assessment Framework:</strong> {benchmarkData.methodology?.assessmentCriteria}</p>
          <p><strong>Benchmarking Period:</strong> {benchmarkData.methodology?.benchmarkingPeriod || 'Q3-Q4 2024'}</p>
          <p><strong>Last Updated:</strong> {benchmarkData.methodology?.lastUpdated}</p>
          <p><strong>Confidence Level:</strong> {benchmarkData.methodology?.confidenceLevel}</p>
          
          {benchmarkData.methodology?.assumptions && benchmarkData.methodology.assumptions.length > 0 && (
            <div style={{ marginTop: '20px', padding: '16px', background: 'white', borderRadius: '8px', border: '2px solid #e5e7eb' }}>
              <strong style={{ color: '#1f2937', fontSize: '0.938rem' }}>Key Assumptions:</strong>
              <ul style={{ marginTop: '12px', paddingLeft: '20px' }}>
                {benchmarkData.methodology.assumptions.map((assumption, idx) => (
                  <li key={idx} style={{ marginBottom: '8px', color: '#4b5563' }}>
                    {assumption}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Section>
    </ReportContainer>

        {/* Footer */}
        <Footer />

        {/* 🎨 CRUD Modal */}
        <AnimatePresence>
          {showModal && (
            <ModalOverlay onClick={() => setShowModal(false)}>
              <ModalContent
                onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <ModalHeader>
                  <h2>
                    {editingItem ? 'Edit' : 'Add'}{' '}
                    {modalType.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </h2>
                  <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#6b7280' }}>&times;</button>
                </ModalHeader>
                <form onSubmit={handleFormSubmit}>
                  <ModalBody>
                    {modalType === 'metric' && (
                      <>
                        <FormGroup>
                          <label>Metric Label</label>
                          <input
                            type="text"
                            value={formData.label || ''}
                            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                            placeholder="e.g., Overall Percentile"
                            required
                          />
                        </FormGroup>
                        <FormGroup>
                          <label>Value</label>
                          <input
                            type="text"
                            value={formData.value || ''}
                            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                            placeholder="e.g., 85th"
                            required
                          />
                        </FormGroup>
                      </>
                    )}
                    {(modalType === 'pillar' || modalType === 'strength' || modalType === 'vulnerability' || modalType === 'recommendation') && (
                      <>
                        <FormGroup>
                          <label>Title / Area</label>
                          <input
                            type="text"
                            value={formData.area || formData.title || formData.pillar || ''}
                            onChange={(e) => setFormData({ ...formData, area: e.target.value, title: e.target.value, pillar: e.target.value })}
                            placeholder="e.g., Platform Governance"
                            required
                          />
                        </FormGroup>
                        <FormGroup>
                          <label>Description / Evidence</label>
                          <textarea
                            rows="4"
                            value={formData.evidence || formData.description || ''}
                            onChange={(e) => setFormData({ ...formData, evidence: e.target.value, description: e.target.value })}
                            placeholder="Detailed description or evidence..."
                            required
                          />
                        </FormGroup>
                      </>
                    )}
                    {modalType === 'executive-summary' && (
                      <>
                        <FormGroup>
                          <label>Headline</label>
                          <textarea
                            rows="2"
                            value={formData.headline || ''}
                            onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                            placeholder="e.g., Your organization ranks in the Below Median (38th percentile)"
                            required
                          />
                        </FormGroup>
                        <FormGroup>
                          <label>Key Findings (one per line)</label>
                          <textarea
                            rows="5"
                            value={formData.keyFindings || ''}
                            onChange={(e) => setFormData({ ...formData, keyFindings: e.target.value })}
                            placeholder="Enter each finding on a new line..."
                            required
                          />
                        </FormGroup>
                        <FormGroup>
                          <label>Market Context</label>
                          <textarea
                            rows="3"
                            value={formData.marketContext || ''}
                            onChange={(e) => setFormData({ ...formData, marketContext: e.target.value })}
                            placeholder="Industry context and trends..."
                            required
                          />
                        </FormGroup>
                      </>
                    )}
                    {(modalType === 'competitive-position' || modalType === 'methodology') && (
                      <FormGroup>
                        <label>Content</label>
                        <textarea
                          rows="6"
                          value={formData.content || ''}
                          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                          placeholder="Section content..."
                          required
                        />
                      </FormGroup>
                    )}
                  </ModalBody>
                  <ModalFooter>
                    <CancelButton type="button" onClick={() => setShowModal(false)}>
                      Cancel
                    </CancelButton>
                    <SaveButton type="submit">
                      {editingItem ? 'Save Changes' : 'Add'}
                    </SaveButton>
                  </ModalFooter>
                </form>
              </ModalContent>
            </ModalOverlay>
          )}
        </AnimatePresence>
        
        {/* 🎬 Presentation Slideshow Overlay */}
        <AnimatePresence>
          {presentationMode && benchmarkData && (
            <SlideContainer
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ClickArea data-hide-on-print="true" $direction="left" onClick={previousSlide} />
              <ClickArea data-hide-on-print="true" $direction="right" onClick={nextSlide} />
              
              {/* Navigation Buttons - Show on hover */}
              <NavigationButton
                data-hide-on-print="true"
                $direction="left"
                onClick={previousSlide}
                disabled={currentSlide === 0}
                whileTap={{ scale: 0.9 }}
              >
                ←
              </NavigationButton>
              
              <NavigationButton
                data-hide-on-print="true"
                $direction="right"
                onClick={nextSlide}
                whileTap={{ scale: 0.9 }}
              >
                →
              </NavigationButton>
              
              <SlideCounter data-hide-on-print="true">{currentSlide + 1} / 6</SlideCounter>
              
              {/* Print Button - Shows on hover */}
              <PrintButton
                data-hide-on-print="true"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrintSlideshow();
                }}
                whileTap={{ scale: 0.9 }}
                title="Print Slideshow as PDF"
              >
                <FiPrinter />
              </PrintButton>
              
              {/* Exit Button - Shows on hover */}
              <ExitButton
                data-hide-on-print="true"
                onClick={exitPresentation}
                whileTap={{ scale: 0.9 }}
              >
                ×
              </ExitButton>
              
              <SlideContent>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                    className="insights-slideshow-slide"
                  >
                    {/* Title Slide */}
                    {currentSlide === 0 && (
                      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                        <h1 style={{ fontSize: '3.5rem', marginBottom: '20px', color: 'white' }}>Industry Benchmarking Report</h1>
                        <p style={{ fontSize: '1.5rem', color: 'rgba(255,255,255,0.8)' }}>Data Platform Maturity Analysis</p>
                      </div>
                    )}
                    
                    {/* Executive Summary + Competitive Position Slide */}
                    {currentSlide === 1 && executiveSummary && competitivePositioning && (
                      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '12px' }}>
                        {/* Report Header */}
                        <div style={{ padding: '16px 24px', background: 'rgba(255, 255, 255, 0.95)', borderRadius: '12px', flexShrink: 0 }}>
                          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#3b82f6', letterSpacing: '0.1em', marginBottom: '8px' }}>
                            DATABRICKS MATURITY ASSESSMENT
                          </div>
                          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e293b', margin: '0 0 8px 0' }}>
                            Industry Benchmarking Report
                          </h1>
                          <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                            Data Platform Maturity Analysis • {assessment?.industry || 'Manufacturing & Industrial'} • {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                          </div>
                        </div>
                        
                        <div style={{ background: 'rgba(255, 255, 255, 0.95)', borderRadius: '16px', padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#1e293b', marginBottom: '12px' }}>
                            ⚡ Executive Summary
                          </h2>
                          <div style={{ fontSize: '1.0625rem', fontWeight: 600, color: '#475569', marginBottom: '16px', lineHeight: '1.5' }}>
                            {executiveSummary.headline}
                          </div>
                          <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.9625rem', color: '#475569', marginBottom: '16px' }}>
                            {executiveSummary.keyFindings?.slice(0, 3).map((finding, idx) => (
                              <li key={idx} style={{ padding: '6px 0', paddingLeft: '20px', position: 'relative' }}>
                                <span style={{ position: 'absolute', left: 0, color: '#3b82f6', fontWeight: 'bold' }}>▸</span>
                                {finding}
                              </li>
                            ))}
                          </ul>
                          <div style={{ background: '#fef3c7', padding: '14px', borderRadius: '8px', fontSize: '0.9125rem', color: '#78350f', lineHeight: '1.5' }}>
                            <strong>Market Context:</strong> {executiveSummary.marketContext}
                          </div>
                        </div>
                        
                        <div style={{ background: 'rgba(255, 255, 255, 0.95)', borderRadius: '16px', padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#1e293b', marginBottom: '16px', textAlign: 'center' }}>
                            🎯 Your Competitive Position
                          </h2>
                          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                            <span style={{ 
                              display: 'inline-block',
                              background: '#fee2e2', 
                              color: '#991b1b', 
                              padding: '8px 24px', 
                              borderRadius: '24px', 
                              fontSize: '1.1rem', 
                              fontWeight: 700,
                              border: '2px solid #ef4444'
                            }}>
                              {competitivePositioning.maturityLevel}
                            </span>
                            <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '8px' }}>
                              Top {competitivePositioning.overallRanking?.percentile}% of {assessment?.industry} organizations
                            </p>
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                            <div style={{ background: '#fef3c7', padding: '16px', borderRadius: '10px', textAlign: 'center', border: '2px solid #fbbf24' }}>
                              <div style={{ fontSize: '0.75rem', color: '#78350f', fontWeight: 600, marginBottom: '6px' }}>PERCENTILE</div>
                              <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#92400e' }}>
                                {competitivePositioning.overallRanking?.percentile}th
                              </div>
                              <div style={{ fontSize: '0.7rem', color: '#92400e', marginTop: '4px' }}>
                                {competitivePositioning.overallRanking?.percentileDescription}
                              </div>
                            </div>
                            <div style={{ background: '#dbeafe', padding: '16px', borderRadius: '10px', textAlign: 'center', border: '2px solid #3b82f6' }}>
                              <div style={{ fontSize: '0.75rem', color: '#1e40af', fontWeight: 600, marginBottom: '6px' }}>PEER GROUP</div>
                              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e3a8a', lineHeight: '1.3' }}>
                                {competitivePositioning.overallRanking?.peerGroup}
                              </div>
                            </div>
                            <div style={{ background: '#cffafe', padding: '16px', borderRadius: '10px', textAlign: 'center', border: '2px solid #06b6d4' }}>
                              <div style={{ fontSize: '0.75rem', color: '#155e75', fontWeight: 600, marginBottom: '6px' }}>MATURITY SCORE</div>
                              <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#0e7490' }}>
                                {actualScore?.toFixed(1)}<span style={{ fontSize: '1rem' }}>/5.0</span>
                              </div>
                              <div style={{ fontSize: '0.7rem', color: '#0e7490', marginTop: '4px' }}>6-pillar assessment</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Detailed Pillar Analysis Slide */}
                    {currentSlide === 2 && filteredPillarAnalysis && (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ background: 'rgba(255, 255, 255, 0.95)', borderRadius: '16px', padding: '30px', width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                          <h2 style={{ fontSize: '1.875rem', fontWeight: 700, color: '#1e293b', marginBottom: '24px', textAlign: 'center' }}>
                            📊 Detailed Pillar Analysis
                          </h2>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', flex: 1 }}>
                            {Object.entries(filteredPillarAnalysis).slice(0, 6).map(([pillarId, data]) => {
                              const percentileColor = getPercentileColor(data.percentileRank);
                              const gap = (data.customerScore - data.industryAverage).toFixed(1);
                              const isAbove = gap >= 0;
                              
                              return (
                                <div key={pillarId} style={{ background: '#f8fafc', padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
                                      {data.pillar || formatPillarName(pillarId)}
                                    </h3>
                                    <span style={{ 
                                      background: percentileColor.bg, 
                                      color: percentileColor.color, 
                                      padding: '3px 10px', 
                                      borderRadius: '12px', 
                                      fontSize: '0.825rem', 
                                      fontWeight: 600 
                                    }}>
                                      {data.percentileRank}th
                                    </span>
                                  </div>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.925rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                      <span style={{ color: '#64748b' }}>Your Score</span>
                                      <span style={{ fontWeight: 700, color: '#1e293b' }}>{data.customerScore?.toFixed(1)}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                      <span style={{ color: '#64748b' }}>Industry</span>
                                      <span style={{ fontWeight: 600, color: '#64748b' }}>{data.industryAverage?.toFixed(1)}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                      <span style={{ color: '#64748b' }}>Top 25%</span>
                                      <span style={{ fontWeight: 600, color: '#10b981' }}>{data.topQuartile?.toFixed(1)}</span>
                                    </div>
                                    <div style={{ 
                                      display: 'flex', 
                                      justifyContent: 'space-between', 
                                      marginTop: '6px', 
                                      paddingTop: '6px', 
                                      borderTop: '1px solid #e2e8f0' 
                                    }}>
                                      <span style={{ color: '#64748b' }}>Gap</span>
                                      <span style={{ 
                                        fontWeight: 700, 
                                        color: isAbove ? '#10b981' : '#ef4444' 
                                      }}>
                                        {isAbove ? '+' : ''}{gap}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Competitive Intelligence Slide */}
                    {currentSlide === 3 && (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ background: 'rgba(255, 255, 255, 0.95)', borderRadius: '16px', padding: '30px', width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                          <h2 style={{ fontSize: '1.8125rem', fontWeight: 700, color: '#1e293b', marginBottom: '24px', textAlign: 'center' }}>
                            🛡️ Competitive Vulnerabilities
                          </h2>
                          
                          {/* Vulnerabilities in 3x2 Grid */}
                          {competitiveIntelligence?.vulnerabilities?.length > 0 ? (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', flex: 1 }}>
                              {competitiveIntelligence.vulnerabilities.slice(0, 6).map((vuln, idx) => (
                                <div key={idx} style={{ background: '#fee2e2', padding: '20px', borderRadius: '12px', borderLeft: '4px solid #ef4444' }}>
                                  <div style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#991b1b', marginBottom: '12px' }}>
                                    {vuln.area}
                                  </div>
                                  <div style={{ fontSize: '0.8625rem', color: '#7f1d1d', lineHeight: '1.5' }}>
                                    <p style={{ margin: '6px 0' }}>
                                      <strong>Evidence:</strong> {vuln.evidence}
                                    </p>
                                    <p style={{ margin: '6px 0' }}>
                                      <strong>Risk:</strong> {vuln.businessRisk}
                                    </p>
                                    <p style={{ margin: '6px 0' }}>
                                      <strong>Competitor Advantage:</strong> {vuln.competitorAdvantage}
                                    </p>
                                    <p style={{ margin: '6px 0' }}>
                                      <strong>Remediation:</strong> {vuln.remediation}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                              <p style={{ fontSize: '1.1rem', marginBottom: '8px' }}>No competitive vulnerabilities data available</p>
                              <p style={{ fontSize: '0.9rem' }}>This section will be populated once the competitive analysis is complete.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Strategic Recommendations Slide */}
                    {currentSlide === 4 && (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ background: 'rgba(255, 255, 255, 0.95)', borderRadius: '16px', padding: '30px', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                          <h2 style={{ fontSize: '1.8125rem', fontWeight: 700, color: '#1e293b', marginBottom: '32px', textAlign: 'center' }}>
                            🎯 Strategic Recommendations
                          </h2>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {/* Immediate Actions */}
                            {strategicRecommendations.immediate?.length > 0 && (
                              <div>
                                <h3 style={{ fontSize: '1.3125rem', fontWeight: 700, color: '#ef4444', marginBottom: '12px' }}>
                                  Immediate Actions (0-3 months)
                                </h3>
                                {strategicRecommendations.immediate.slice(0, 2).map((action, idx) => (
                                  <div key={idx} style={{ background: '#fef2f2', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #ef4444', marginBottom: '12px' }}>
                                    <div style={{ fontSize: '1.0625rem', fontWeight: 600, color: '#1e293b', marginBottom: '6px' }}>
                                      {action.action}
                                    </div>
                                    <p style={{ fontSize: '0.9375rem', color: '#475569', lineHeight: '1.5', margin: 0 }}>
                                      {action.rationale}
                                    </p>
                                    <div style={{ display: 'flex', gap: '12px', marginTop: '8px', fontSize: '0.8125rem', color: '#64748b' }}>
                                      <span><strong>Impact:</strong> {action.impact}</span>
                                      <span><strong>Effort:</strong> {action.effort}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            {/* Short-term Actions */}
                            {strategicRecommendations.shortTerm?.length > 0 && (
                              <div>
                                <h3 style={{ fontSize: '1.3125rem', fontWeight: 700, color: '#f59e0b', marginBottom: '12px' }}>
                                  Short-term Actions (3-6 months)
                                </h3>
                                {strategicRecommendations.shortTerm.slice(0, 2).map((action, idx) => (
                                  <div key={idx} style={{ background: '#fffbeb', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #f59e0b', marginBottom: '12px' }}>
                                    <div style={{ fontSize: '1.0625rem', fontWeight: 600, color: '#1e293b', marginBottom: '6px' }}>
                                      {action.action}
                                    </div>
                                    <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: '1.5', margin: 0 }}>
                                      {action.rationale}
                                    </p>
                                    <div style={{ display: 'flex', gap: '12px', marginTop: '8px', fontSize: '0.75rem', color: '#64748b' }}>
                                      <span><strong>Impact:</strong> {action.impact}</span>
                                      <span><strong>Effort:</strong> {action.effort}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            {/* Long-term Actions */}
                            {strategicRecommendations.longTerm?.length > 0 && (
                              <div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#3b82f6', marginBottom: '12px' }}>
                                  Long-term Initiatives (6-12+ months)
                                </h3>
                                {strategicRecommendations.longTerm.slice(0, 2).map((action, idx) => (
                                  <div key={idx} style={{ background: '#eff6ff', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #3b82f6', marginBottom: '12px' }}>
                                    <div style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b', marginBottom: '6px' }}>
                                      {action.action}
                                    </div>
                                    <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: '1.5', margin: 0 }}>
                                      {action.rationale}
                                    </p>
                                    <div style={{ display: 'flex', gap: '12px', marginTop: '8px', fontSize: '0.75rem', color: '#64748b' }}>
                                      <span><strong>Impact:</strong> {action.impact}</span>
                                      <span><strong>Effort:</strong> {action.effort}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Methodology Slide */}
                    {currentSlide === 5 && (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ background: 'rgba(255, 255, 255, 0.95)', borderRadius: '16px', padding: '30px', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                          <h2 style={{ fontSize: '1.875rem', fontWeight: 700, color: '#1e293b', marginBottom: '32px', textAlign: 'center' }}>
                            📋 Methodology & Data Sources
                          </h2>
                          {benchmarkData?.methodology ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '1.075rem', color: '#475569', lineHeight: 1.6 }}>
                              <div>
                                <strong style={{ color: '#1e293b' }}>Data Source:</strong> {benchmarkData.methodology.dataSource}
                              </div>
                              <div>
                                <strong style={{ color: '#1e293b' }}>Sample Size:</strong> {benchmarkData.methodology.sampleSize}+ {assessment?.industry} organizations
                              </div>
                              <div>
                                <strong style={{ color: '#1e293b' }}>Assessment Framework:</strong> {benchmarkData.methodology.assessmentCriteria}
                              </div>
                              <div>
                                <strong style={{ color: '#1e293b' }}>Benchmarking Period:</strong> {benchmarkData.methodology.benchmarkingPeriod || 'Q3-Q4 2024'}
                              </div>
                              <div>
                                <strong style={{ color: '#1e293b' }}>Last Updated:</strong> {benchmarkData.methodology.lastUpdated}
                              </div>
                              <div>
                                <strong style={{ color: '#1e293b' }}>Confidence Level:</strong> {benchmarkData.methodology.confidenceLevel}
                              </div>
                              
                              {benchmarkData.methodology.assumptions?.length > 0 && (
                                <div style={{ marginTop: '16px' }}>
                                  <strong style={{ color: '#1e293b', display: 'block', marginBottom: '8px' }}>Key Assumptions:</strong>
                                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                                    {benchmarkData.methodology.assumptions.slice(0, 4).map((assumption, idx) => (
                                      <li key={idx} style={{ marginBottom: '6px' }}>{assumption}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                              <p style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Methodology data not available</p>
                              <p style={{ fontSize: '0.9rem' }}>This section will be populated with benchmarking methodology details.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Thank You Slide */}
                    {currentSlide === 6 && (
                      <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        gap: '30px'
                      }}>
                        <div style={{
                          fontSize: '4rem',
                          fontWeight: 800,
                          color: 'white',
                          marginBottom: '20px',
                          textShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                        }}>
                          Thank You
                        </div>
                        <div style={{
                          fontSize: '1.5rem',
                          fontWeight: 400,
                          color: 'rgba(255, 255, 255, 0.9)',
                          lineHeight: '1.6',
                          maxWidth: '800px'
                        }}>
                          For your time and participation in the Technical Maturity Assessment
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </SlideContent>
            </SlideContainer>
          )}
        </AnimatePresence>
      </PageContainer>
    </>
  );
};

export default IndustryBenchmarkingReport;


