import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiCheckCircle,
  FiAlertTriangle,
  FiInfo,
  FiTrendingUp,
  FiTarget,
  FiZap,
  FiDownload,
  FiShare2,
  FiEdit3,
  FiRefreshCw,
  FiSave,
  FiTrash2,
  FiX,
  FiDroplet,
  FiRotateCcw,
  FiChevronDown,
  FiChevronUp,
  FiClock,
  FiBarChart2,
  FiMonitor,
  FiPrinter,
  FiLock,
  FiMail,
  FiHome,
  FiArrowLeft
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as assessmentService from '../services/assessmentService';
import { exportAssessmentToExcel } from '../services/excelExportService';
import Footer from './Footer';

// =======================
// STYLED COMPONENTS
// =======================

// Global print styles
const PrintStyles = styled.div`
  @media print {
    @page {
      size: letter landscape;
      margin: 0;
    }
    
    /* Enable background graphics */
    * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
    }
    
    /* Hide EVERYTHING first */
    body * {
      visibility: hidden !important;
    }
    
    /* Show ONLY the print-all-slides container */
    .print-all-slides,
    .print-all-slides * {
      visibility: visible !important;
    }
    
    .print-all-slides {
      display: block !important;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
    }
    
    /* Hide the single slideshow view */
    .slideshow-single-slide {
      display: none !important;
    }
    
    /* Style each print slide */
    .print-single-slide {
      width: 100vw;
      height: 100vh;
      page-break-after: always;
      page-break-inside: avoid;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 3rem;
    }
  }
`;

const PageContainer = styled.div`
  min-height: 100vh;
  background: #f9fafb;
  padding: 108px 0 40px 0;

  @media (max-width: 768px) {
    padding: 92px 0 24px 0;
  }
  
  @media print {
    padding: 0 !important;
    margin: 0 !important;
    background: white !important;
    min-height: 0 !important;
    height: auto !important;
  }
`;

const ReportContainer = styled.div`
  width: 100%;
  padding: 0 40px;
  margin: 0;

  @media (max-width: 768px) {
    padding: 0 16px;
  }

  /* 🖨️ PRINT OPTIMIZATION */
  @media print {
    padding: 0 !important;
    max-width: 100% !important;
    margin: 0 !important;
  }
`;

const ReportHeader = styled.div`
  background: linear-gradient(135deg, #1B3B6F 0%, #2d4a7c 100%);
  padding: 48px 48px 40px;
  color: white;
  position: relative;
  overflow: hidden;

  /* Subtle gradient overlay */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.05) 0%,
      transparent 100%
    );
    pointer-events: none;
  }

  @keyframes gradientShift {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 0.6; }
  }

  @media (max-width: 768px) {
    padding: 40px 24px 32px;
  }

  /* 🖨️ PRINT OPTIMIZATION */
  @media print {
      display: none !important;
  }
`;

const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 16px;
`;

const TitleSection = styled.div`
  position: relative;
  z-index: 1;

  h1 {
    font-size: 2.25rem;
    font-weight: 700;
    margin: 0 0 12px 0;
    letter-spacing: -0.02em;
    color: white;
  }

  .subtitle {
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.9);
    font-weight: 400;
    letter-spacing: 0.01em;
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 1.75rem;
    }

    .subtitle {
      font-size: 0.875rem;
    }
  }

  /* 🖨️ PRINT OPTIMIZATION */
  @media print {
    h1 {
      color: #1a1a1a !important;
      background: none !important;
      -webkit-text-fill-color: #1a1a1a !important;
      text-shadow: none !important;
      font-size: 1.75rem !important;
      margin-bottom: 8px !important;
    }

    .subtitle {
      color: #4b5563 !important;
      font-size: 0.9rem !important;
    }
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    width: 100%;
    gap: 12px;
  }

  /* 🖨️ PRINT: Hide all action buttons */
  @media print {
    display: none !important;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;

  @media (max-width: 768px) {
    flex: 1;
    
    button {
      flex: 1;
      min-width: 140px;
    }
  }
`;

const ButtonSeparator = styled.div`
  width: 1px;
  height: 32px;
  background: rgba(255, 255, 255, 0.2);

  @media (max-width: 768px) {
    display: none;
  }
`;

const ActionButton = styled(motion.button)`
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  
  /* Hide icons by default, show on hover */
  svg {
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  
  &:hover svg {
    opacity: 1;
  }
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 1;

  &:hover {
    background: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none;
  }

  &:focus {
    outline: 2px solid rgba(255, 255, 255, 0.5);
    outline-offset: 2px;
  }

  @media (max-width: 768px) {
    padding: 10px 18px;
    font-size: 0.813rem;
    justify-content: center;
  }
`;

const FloatingSlideshowButton = styled(motion.button)`
  position: absolute;
  top: 24px;
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
  z-index: 10;

  &:hover {
    background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(139, 92, 246, 0.6);
  }

  @media (max-width: 1024px) {
    top: 20px;
    right: 24px;
    padding: 12px 20px;
    font-size: 14px;
  }
  
  @media (max-width: 768px) {
    top: 140px;
    right: 16px;
    padding: 10px 16px;
    font-size: 13px;
  }
  
  @media print {
    display: none !important;
  }
`;

const MaturityOverview = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const MaturityCard = styled.div`
  background: rgba(255, 255, 255, 0.12);
  border: 2px solid rgba(255, 255, 255, 0.25);
  border-radius: 12px;
  padding: 28px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(255, 255, 255, 0.4);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
    background: rgba(255, 255, 255, 0.15);
  }

  .icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: ${props => props.$iconBg || 'rgba(255, 255, 255, 0.2)'};
    display: grid;
    place-items: center;
    margin-bottom: 20px;
    color: white;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .label {
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.85);
    margin-bottom: 10px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .value {
    font-size: 2rem;
    font-weight: 800;
    color: white;
    margin-bottom: 6px;
    letter-spacing: -0.02em;
  }

  .description {
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.75);
    line-height: 1.6;
  }

  @media (max-width: 768px) {
    padding: 24px;

    .value {
      font-size: 1.5rem;
    }
  }

  /* 🖨️ PRINT OPTIMIZATION */
  @media print {
    background: white !important;
    border: 2px solid #e5e7eb !important;
    padding: 16px !important;
    backdrop-filter: none !important;
    box-shadow: none !important;
    page-break-inside: avoid !important;
    
    &::before {
      display: none !important;
    }

    .icon {
      background: #f3f4f6 !important;
      color: #1a1a1a !important;
      width: 36px !important;
      height: 36px !important;
      margin-bottom: 12px !important;
    }

    .label {
      color: #6b7280 !important;
      font-size: 0.75rem !important;
    }

    .value {
      color: #1a1a1a !important;
      font-size: 1.5rem !important;
    }

    .description {
      color: #4b5563 !important;
      font-size: 0.8rem !important;
    }
  }
`;

const ReportBody = styled.div`
  padding: 48px;

  @media (max-width: 768px) {
    padding: 32px 24px;
  }

  /* 🖨️ PRINT OPTIMIZATION */
  @media print {
    padding: 24px 32px !important;
  }
`;

// Section Card Components
const SectionCard = styled(motion.div)`
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 64px;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  }

  @media (max-width: 768px) {
    padding: 24px;
    margin-bottom: 48px;
  }

  @media print {
    box-shadow: none !important;
    border: 1px solid #e2e8f0 !important;
    margin-bottom: 32px !important;
    page-break-inside: avoid !important;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
`;

const SectionBadge = styled.div`
  background: linear-gradient(135deg, #1B3B6F 0%, #2d4a7c 100%);
  color: white;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 700;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(27, 59, 111, 0.3);

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
`;

const SectionTitleWrapper = styled.div`
  flex: 1;
`;

const SectionTitle = styled.h2`
  font-size: 1.875rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 4px 0;
  letter-spacing: -0.02em;
  transition: color 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    color: #FF3621;
  }

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const SectionSubtitle = styled.p`
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
  font-weight: 500;
`;

const PillarSection = styled(motion.div)`
  background: white;
  margin-bottom: 32px;
  border: 1px solid #e2e8f0;
  border-left: 4px solid ${props => props.$color || '#e2e8f0'};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.03);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1), 0 2px 6px rgba(0, 0, 0, 0.05);
    transform: translateY(-2px);
    border-left-width: 6px;
  }

  &:last-of-type {
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    margin-bottom: 24px;
  }

  @media print {
    box-shadow: none !important;
    transform: none !important;
    page-break-inside: avoid !important;
  }
`;

const PillarHeader = styled.div`
  background: ${props => props.$accentColor || '#1B3B6F'};
  padding: 24px 32px;
  border-bottom: 2px solid ${props => props.$borderColor || '#e2e8f0'};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  position: relative;

  .pillar-info {
    display: flex;
    align-items: center;
    gap: 16px;
    flex: 1;
  }

  .pillar-icon {
    font-size: 2rem;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  }

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: white;
    margin: 0;
    letter-spacing: -0.01em;
  }

  .pillar-actions {
    display: flex;
    gap: 8px;
  }

  @media (max-width: 768px) {
    padding: 20px 24px;
    flex-wrap: wrap;

    .pillar-icon {
      font-size: 1.75rem;
    }

    h3 {
      font-size: 1.125rem;
    }

    .pillar-actions {
      width: 100%;
      justify-content: flex-end;
      margin-top: 12px;
    }
  }
  
  @media print {
    background: white !important;
  }
`;

const CollapsibleHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s;

  &:hover {
    opacity: 0.8;
  }

  .collapse-icon {
    transition: transform 0.3s ease;
    ${props => props.$collapsed && 'transform: rotate(180deg);'}
  }
`;

const EditActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: ${props => 
    props.$variant === 'danger' ? 'rgba(239, 68, 68, 0.9)' : 
    props.$variant === 'success' ? 'rgba(16, 185, 129, 0.9)' : 
    'rgba(255, 255, 255, 0.15)'};
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => 
      props.$variant === 'danger' ? 'rgba(220, 38, 38, 1)' : 
      props.$variant === 'success' ? 'rgba(5, 150, 105, 1)' : 
      'rgba(255, 255, 255, 0.25)'};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ColorPickerButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  background: ${props => props.$color || 'rgba(255, 255, 255, 0.15)'};
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;

  &:hover {
    border-color: #cbd5e1;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const ColorPickerPopover = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  padding: 20px;
  z-index: 1000;
  min-width: 300px;
`;

const ColorPickerLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const ColorInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ColorPreview = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ColorSwatch = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 8px;
  background: ${props => props.$color};
  border: 3px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15), inset 0 0 0 1px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
`;

const ColorInput = styled.input`
  flex: 1;
  height: 56px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  padding: 4px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  
  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }
  
  &::-webkit-color-swatch {
    border: none;
    border-radius: 6px;
  }
  
  &:hover {
    border-color: #cbd5e1;
  }
  
  &:focus {
    outline: none;
    border-color: #00A972;
    box-shadow: 0 0 0 3px rgba(0, 169, 114, 0.1);
  }
`;

const ColorHexInput = styled.input`
  width: 100%;
  padding: 12px 14px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: center;
  
  &:hover {
    border-color: #cbd5e1;
  }
  
  &:focus {
    outline: none;
    border-color: #00A972;
    box-shadow: 0 0 0 3px rgba(0, 169, 114, 0.1);
  }
  
  &::placeholder {
    color: #94a3b8;
  }
`;

const QuickColorsLabel = styled.div`
  font-size: 0.7rem;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 20px;
  margin-bottom: 12px;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
`;

const QuickColorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
`;

const QuickColorButton = styled.button`
  width: 38px;
  height: 38px;
  border-radius: 6px;
  border: 2px solid ${props => props.$selected ? props.$color : 'transparent'};
  background: ${props => props.$color};
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${props => props.$selected ? `0 0 0 2px white, 0 0 0 4px ${props.$color}` : '0 1px 3px rgba(0, 0, 0, 0.1)'};

  &:hover {
    transform: scale(1.15);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  &:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  &:active {
    transform: scale(0.95);
  }
`;

const EditableTextarea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 12px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-family: inherit;
  font-size: 0.875rem;
  line-height: 1.6;
  resize: vertical;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const PillarBody = styled.div`
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (max-width: 768px) {
    padding: 24px;
    gap: 20px;
  }
`;

const PillarTopRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const PillarFullWidth = styled.div`
  width: 100%;
  /* Background and border are now controlled by inline styles for customization */
  border-radius: 16px;
  padding: 24px;
  
  @media (max-width: 768px) {
    padding: 18px;
  }
`;

const PillarColumn = styled.div`
  .column-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.875rem;
    font-weight: 700;
    color: ${props => props.$color || '#6b7280'};
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 12px;

    svg {
      width: 18px;
      height: 18px;
    }
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  li {
    font-size: 0.938rem;
    color: #475569;
    line-height: 1.6;
    margin-bottom: 12px;
    padding-left: 0;

    &:last-child {
      margin-bottom: 0;
    }

    &::before {
      content: '•';
      color: ${props => props.$color || '#6b7280'};
      font-weight: bold;
      display: inline-block;
      width: 1em;
      margin-left: 0;
    }
  }

  @media (max-width: 768px) {
    .column-title {
      font-size: 0.813rem;
    }

    li {
      font-size: 0.875rem;
    }
  }
`;

const RoadmapSection = styled.section`
  margin-top: 64px;
  padding-top: 48px;
  border-top: 2px solid #e5e7eb;

  @media (max-width: 768px) {
    margin-top: 48px;
    padding-top: 32px;
  }
`;

const RoadmapPhases = styled.div`
  display: grid;
  gap: 24px;
`;

const PhaseCard = styled(motion.div)`
  background: ${props => props.$bgColor || '#ffffff'};
  border: 2px solid ${props => props.$borderColor || '#e5e7eb'};
  border-radius: 12px;
  padding: 28px 32px;
  position: relative;

  .phase-header-container {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
    gap: 12px;
  }

  .phase-header {
    font-size: 1.125rem;
    font-weight: 700;
    color: #1e293b;
    flex: 1;
  }

  .phase-actions {
    display: flex;
    gap: 6px;
    flex-shrink: 0;
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  li {
    font-size: 0.938rem;
    color: #374151;
    line-height: 1.6;
    margin-bottom: 10px;
    padding-left: 20px;
    position: relative;

    &:last-child {
      margin-bottom: 0;
    }

    &::before {
      content: '▸';
      position: absolute;
      left: 0;
      color: ${props => props.$accentColor || '#f59e0b'};
      font-weight: bold;
    }
  }

  @media (max-width: 768px) {
    padding: 20px 24px;

    .phase-header {
      font-size: 1rem;
    }

    li {
      font-size: 0.875rem;
    }
  }
`;

const ImpactSection = styled.section`
  margin-top: 64px;
  padding-top: 48px;
  border-top: 2px solid #e5e7eb;

  @media (max-width: 768px) {
    margin-top: 48px;
    padding-top: 32px;
  }
`;

const ImpactMetrics = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const MetricCard = styled(motion.div)`
  background: #ffffff;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 32px 28px;
  text-align: center;

  .metric-value {
    font-size: 3rem;
    font-weight: 800;
    color: #0369a1;
    margin-bottom: 8px;
    line-height: 1;
  }

  .metric-label {
    font-size: 0.938rem;
    color: #0c4a6e;
    font-weight: 500;
    line-height: 1.5;
  }

  @media (max-width: 768px) {
    padding: 24px 20px;

    .metric-value {
      font-size: 2.5rem;
    }

    .metric-label {
      font-size: 0.875rem;
    }
  }
`;

const LoadingContainer = styled.div`
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .spinner {
    text-align: center;
    
    .text {
      font-size: 1.125rem;
      color: #6b7280;
      margin-top: 16px;
    }
  }
`;

const ErrorContainer = styled.div`
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 16px;
  padding: 20px;

  .icon {
    color: #dc2626;
    margin-bottom: 8px;
  }

  .title {
    font-size: 1.25rem;
    color: #111827;
    font-weight: 600;
  }

  .message {
    font-size: 1rem;
    color: #6b7280;
  }

  button {
    margin-top: 16px;
    padding: 10px 20px;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;

    &:hover {
      background: #2563eb;
    }
  }
`;

// Maturity Chart Styled Components
// Summary Maturity Chart (Top of page)
const MaturityChart = styled.div`
  margin: 24px 0;
  padding: 16px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
`;

const MaturityChartTitle = styled.h3`
  font-size: 0.95rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CompactMaturityGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const MaturityPillarSection = styled.div`
  border-left: 3px solid ${props => props.$color || '#3b82f6'};
  padding: 14px 16px;
  background: ${props => props.$color}08;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

const MaturityPillarTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  flex: 1;
  
  .pillar-icon {
    font-size: 1.3rem;
    flex-shrink: 0;
  }
  
  .pillar-name {
    color: ${props => props.$color || '#3b82f6'};
    line-height: 1.3;
  }
`;

const MaturityLegend = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 12px;
  padding: 8px;
  background: #f9fafb;
  border-radius: 6px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  color: #6b7280;
  
  span {
    font-weight: 600;
  }
`;

const ScoresContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`;

const ScoreGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
`;

const ScoreBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 700;
  min-width: 50px;
  background: ${props => props.$current ? props.$color : 'white'};
  color: ${props => props.$current ? 'white' : props.$color};
  border: 2px solid ${props => props.$color};
`;

const ScoreLabel = styled.div`
  font-size: 0.625rem;
  text-align: center;
  color: #9ca3af;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
`;

// Individual Pillar Maturity Chart (Horizontal bars)
const PillarMaturityChart = styled.div`
  margin-bottom: 32px;
  padding: 20px;
  background: #fafafa;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
`;

const MaturityLevelsHeader = styled.div`
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 16px;
  margin-bottom: 12px;
`;

const MaturityLevelsScale = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 8px;
`;

const MaturityLevel = styled.div`
  font-size: 0.7rem;
  font-weight: 600;
  color: #9ca3af;
  text-align: center;
  flex: 1;
`;

const DimensionMaturityRow = styled.div`
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 16px;
  align-items: center;
  margin-bottom: 12px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const DimensionLabel = styled.div`
  font-size: 0.85rem;
  font-weight: 600;
  color: #374151;
  padding: 10px 14px;
  background: white;
  border-radius: 8px;
  border-left: 4px solid ${props => props.$borderColor || '#3b82f6'};
  display: flex;
  align-items: center;
  min-height: 44px;
`;

const MaturityBarsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  position: relative;
`;

const MaturityBar = styled.div`
  height: 18px;
  border-radius: 9px;
  position: relative;
  display: flex;
  align-items: center;
  background: ${props => props.$isCurrent ? props.$color : `${props.$color}22`};
  border: 2px solid ${props => props.$color};
  width: ${props => (props.$score / 5) * 100}%;
  min-width: 70px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateX(4px);
    box-shadow: 0 2px 8px ${props => props.$color}44;
  }
`;

const BarLabel = styled.div`
  position: absolute;
  left: 8px;
  font-size: 0.65rem;
  font-weight: 700;
  color: ${props => props.$isCurrent ? 'white' : props.$color};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const ScoreValue = styled.div`
  position: absolute;
  right: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  color: ${props => props.$isCurrent ? 'white' : props.$color};
  min-width: 24px;
  text-align: right;
`;

// 🎬 Slideshow Styled Components
const SlideContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media print {
    position: relative !important;
    page-break-after: always !important;
    page-break-inside: avoid !important;
    width: 100vw !important;
    height: 100vh !important;
    display: flex !important;
  }
`;

const SlideContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  padding: 45px 60px 20px 60px;
`;

const SlideHeading = styled.div`
  position: absolute;
  top: 20px;
  left: 60px;
  font-size: 1.8rem;
  font-weight: 700;
  color: white;
  pointer-events: none;
  z-index: 5;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const SlideCounter = styled.div`
  position: absolute;
  bottom: 20px;
  right: 60px;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 600;
  pointer-events: none;
  z-index: 5;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const ClickArea = styled.div`
  position: absolute;
  top: 0;
  width: 50%;
  height: 100%;
  cursor: ${props => props.$direction === 'left' ? 'w-resize' : 'e-resize'};
  z-index: 1;
  ${props => props.$direction === 'left' ? 'left: 0;' : 'right: 0;'}
  
  @media print {
    display: none !important;
  }
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
  transition: all 0.2s ease;
  
  @media print {
    display: none !important;
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

const SlideGrid = styled.div`
  display: grid;
  grid-template-columns: ${props => props.$columns || '1fr 1fr'};
  gap: ${props => props.$gap || '24px'};
  height: fit-content;
  max-height: 92%;
  overflow: hidden;
  padding-top: ${props => props.$paddingTop || '45px'};
  padding-bottom: ${props => props.$paddingBottom || '10px'};
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
  opacity: 0.4;
  transition: all 0.3s ease;
  
  @media print {
    display: none !important;
  }

  &:hover {
    opacity: 1;
    transform: scale(1.15);
    background: rgba(239, 68, 68, 1);
    box-shadow: 0 4px 16px rgba(239, 68, 68, 0.6);
  }
`;

const PrintButton = styled(motion.button)`
  position: absolute;
  top: 20px;
  right: 120px;
  background: rgba(16, 185, 129, 0.9);
  color: white;
  border: none;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  cursor: pointer;
  z-index: 10;
  pointer-events: auto;
  opacity: 0.4;
  transition: all 0.3s ease;
  
  @media print {
    display: none !important;
  }

  &:hover {
    opacity: 1;
    transform: scale(1.15);
    background: rgba(16, 185, 129, 1);
    box-shadow: 0 4px 16px rgba(16, 185, 129, 0.6);
  }
`;

// ================================
// Results Not Released Components
// ================================
const ResultsNotReleasedContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
`;

const ContentWrapper = styled.div`
  max-width: 700px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 60px 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;

  @media (max-width: 768px) {
    padding: 40px 24px;
  }
`;

const LockIconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  margin: 0 auto 32px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.3);
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin: 0 0 16px 0;
  color: white;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.125rem;
  text-align: center;
  margin: 0 0 48px 0;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
`;

const WhatNextSection = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 32px;
  margin-bottom: 32px;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const WhatNextTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 20px 0;
  color: white;
`;

const WhatNextList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const WhatNextItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
  font-size: 1rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.95);

  &:last-child {
    margin-bottom: 0;
  }

  svg {
    flex-shrink: 0;
    margin-top: 2px;
  }
`;

const ContactSection = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 32px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;
`;

const ContactTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: white;
`;

const ContactText = styled.p`
  font-size: 1rem;
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
`;

const ResultsActionButtons = styled(motion.div)`
  display: flex;
  gap: 16px;
  justify-content: center;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ResultsActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 28px;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-radius: 10px;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.6);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;

// =======================
// COMPONENT
// =======================

// Results Not Released Component
const ResultsNotReleased = ({ assessmentId }) => {
  const navigate = useNavigate();
  return (
    <ResultsNotReleasedContainer>
      <ContentWrapper>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <LockIconContainer>
            <FiLock size={64} color="#fff" />
          </LockIconContainer>
          <Title>Results Are Being Prepared</Title>
          <Subtitle>
            The results for this assessment are currently being reviewed and will be released by your administrator soon.
          </Subtitle>
        </motion.div>

        <WhatNextSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <WhatNextTitle>What's Next?</WhatNextTitle>
          <WhatNextList>
            <WhatNextItem>
              <FiCheckCircle size={20} color="#34d399" />
              <span>Your submission has been received and is under review.</span>
            </WhatNextItem>
            <WhatNextItem>
              <FiClock size={20} color="#fcd34d" />
              <span>An administrator will validate the responses and finalize the report.</span>
            </WhatNextItem>
            <WhatNextItem>
              <FiShare2 size={20} color="#60a5fa" />
              <span>Once approved, the results will be officially released.</span>
            </WhatNextItem>
            <WhatNextItem>
              <FiMail size={20} color="#a78bfa" />
              <span>You will be notified when the report is available for viewing.</span>
            </WhatNextItem>
          </WhatNextList>
        </WhatNextSection>

        <ContactSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <ContactTitle>Need Assistance?</ContactTitle>
          <ContactText>
            If you have any questions or require immediate access, please contact your Databricks Account Team.
          </ContactText>
        </ContactSection>

        <ResultsActionButtons
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <ResultsActionButton onClick={() => navigate('/assessments')}>
            <FiArrowLeft /> Back to Assessments
          </ResultsActionButton>
          <ResultsActionButton onClick={() => navigate('/')}>
            <FiHome /> Go Home
          </ResultsActionButton>
        </ResultsActionButtons>
      </ContentWrapper>
    </ResultsNotReleasedContainer>
  );
};

const AssessmentResultsNew = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const routerLocation = useLocation();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [framework, setFramework] = useState(null);
  const [benchmarkData, setBenchmarkData] = useState(null);
  const [benchmarkLoading, setBenchmarkLoading] = useState(false);
  
  // Slideshow mode state
  const [presentationMode, setPresentationMode] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [printMode, setPrintMode] = useState(false);
  
  // Edit state management
  const [editMode, setEditMode] = useState(false); // Global edit mode toggle
  const [editingPillar, setEditingPillar] = useState(null);
  const [editingPhase, setEditingPhase] = useState(null);
  const [editingPhaseItem, setEditingPhaseItem] = useState(null); // Track which phase item is being edited
  const [editingFeature, setEditingFeature] = useState(null); // Track which feature is being edited
  const [editingNextStep, setEditingNextStep] = useState(null); // Track which next step is being edited
  const [editingGoodItem, setEditingGoodItem] = useState(null); // Track which "What's Working" item is being edited
  const [editingBadItem, setEditingBadItem] = useState(null); // Track which "Key Challenge" item is being edited
  const [addingGoodItem, setAddingGoodItem] = useState(null); // Track which pillar is adding a new "What's Working" item
  const [addingBadItem, setAddingBadItem] = useState(null); // Track which pillar is adding a new "Key Challenge" item
  const [addingFeature, setAddingFeature] = useState(null); // Track which pillar is adding a new feature
  const [addingNextStep, setAddingNextStep] = useState(null); // Track which pillar is adding a new next step
  const [addingPhaseItem, setAddingPhaseItem] = useState(null); // Track which phase is adding a new item
  const [addingImpactMetric, setAddingImpactMetric] = useState(false); // Track if adding a new impact metric
  const [editingImpactMetric, setEditingImpactMetric] = useState(null); // Track which impact metric is being edited
  const [editingNewGoodItem, setEditingNewGoodItem] = useState(null); // Track which new "What's Working" item is being edited
  const [editingNewBadItem, setEditingNewBadItem] = useState(null); // Track which new "Key Challenge" item is being edited
  const [editingNewFeature, setEditingNewFeature] = useState(null); // Track which new feature is being edited
  const [editingNewNextStep, setEditingNewNextStep] = useState(null); // Track which new next step is being edited
  const [editedContent, setEditedContent] = useState({});
  const [showColorPicker, setShowColorPicker] = useState(null); // Track which pillar's color picker is shown
  const [customizations, setCustomizations] = useState({
    title: '',
    summary: '',
    pillars: {},
    phases: {},
    features: {},
    pillarColors: {}, // Custom colors for each pillar
    nextSteps: {},
    goodItems: {}, // { pillarId_index: text }
    badItems: {}, // { pillarId_index: text }
    newGoodItems: {}, // { pillarId: [array of new items] }
    newBadItems: {}, // { pillarId: [array of new items] }
    newFeatures: {}, // { pillarId: [array of new features] }
    newNextSteps: {}, // { pillarId: [array of new next steps] }
    newPhaseItems: {}, // { phaseId: [array of new items] }
    newImpactMetrics: [], // Array of new impact metrics
    impactMetrics: {}, // { metricKey: { value, label, drivers } }
    cardColors: {}, // { cardKey: { bg, border, text } }
    collapsedSections: {} // { sectionKey: boolean }
  });

  // Load customizations from localStorage on mount
  useEffect(() => {
    if (assessmentId) {
      const storageKey = `assessment_customizations_${assessmentId}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setCustomizations(prevState => ({ ...prevState, ...parsed }));
          console.log('[AssessmentResultsNew] Loaded customizations from localStorage:', parsed);
        } catch (error) {
          console.error('[AssessmentResultsNew] Error parsing saved customizations:', error);
        }
      }
    }
  }, [assessmentId]);

  // Save customizations to localStorage whenever they change
  useEffect(() => {
    if (assessmentId && Object.keys(customizations).length > 0) {
      const storageKey = `assessment_customizations_${assessmentId}`;
      localStorage.setItem(storageKey, JSON.stringify(customizations));
      console.log('[AssessmentResultsNew] Saved customizations to localStorage');
    }
  }, [customizations, assessmentId]);

  // Initialize pillars as collapsed by default
  useEffect(() => {
    if (results?.data?.pillarResults && !localStorage.getItem(`assessment_customizations_${assessmentId}`)) {
      const collapsedSections = {};
      results.data.pillarResults.forEach(pillar => {
        collapsedSections[`pillar-${pillar.id}`] = true; // true = collapsed
      });
      // Also collapse Strategic Roadmap and Business Impact sections by default
      collapsedSections['strategic-roadmap'] = true;
      collapsedSections['business-impact'] = true;
      
      setCustomizations(prev => ({
        ...prev,
        collapsedSections: { ...prev.collapsedSections, ...collapsedSections }
      }));
      console.log('[AssessmentResultsNew] Initialized sections as collapsed:', collapsedSections);
    }
  }, [results, assessmentId]);

  // Extract fetchResults as a callable function with useCallback to avoid dependency warnings
  const fetchResults = useCallback(async (showRefreshToast = false) => {
    try {
      if (showRefreshToast) {
        setRefreshing(true);
        toast.loading('Refreshing results...', { id: 'refresh-results' });
      } else {
        setLoading(true);
      }
      setError(null);
      console.log('[AssessmentResultsNew] Fetching results for:', assessmentId);
      
      // Add cache-busting parameter to force fresh data
      const data = await assessmentService.getAssessmentResults(assessmentId, showRefreshToast);
      console.log('[AssessmentResultsNew] Results data received:', data);
      console.log('[AssessmentResultsNew] Data keys:', data ? Object.keys(data) : 'null');
      
      if (!data) {
        throw new Error('No data received from API');
      }
      
      // Wrap in data object if needed
      const resultsData = data.data ? data : { data };
      console.log('[AssessmentResultsNew] Setting results:', resultsData);
      
      setResults(resultsData);
      
      if (showRefreshToast) {
        
      }
    } catch (err) {
      console.error('[AssessmentResultsNew] Error fetching results:', err);
      console.error('[AssessmentResultsNew] Error stack:', err.stack);
      setError(err.message || 'Failed to load assessment results');
      setResults(null);
      
      if (showRefreshToast) {
        
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [assessmentId]); // Only re-create when assessmentId changes

  useEffect(() => {
    if (assessmentId) {
      fetchResults();
    } else {
      console.error('[AssessmentResultsNew] No assessment ID provided');
      setError('No assessment ID provided');
      setLoading(false);
    }
  }, [assessmentId, fetchResults, routerLocation.key]);

  // Fetch benchmarking data
  const fetchBenchmarkData = useCallback(async () => {
    try {
      setBenchmarkLoading(true);
      console.log('[AssessmentResultsNew] Fetching benchmarking data for:', assessmentId);
      const data = await assessmentService.getBenchmarkReport(assessmentId);
      console.log('[AssessmentResultsNew] Benchmark data received:', data);
      setBenchmarkData(data);
    } catch (err) {
      console.error('[AssessmentResultsNew] Error fetching benchmark data:', err);
      // Don't show error toast - benchmarking is optional
      setBenchmarkData(null);
    } finally {
      setBenchmarkLoading(false);
    }
  }, [assessmentId]);

  // Fetch benchmarking data after results are loaded
  useEffect(() => {
    if (results && results.data && !benchmarkData && !benchmarkLoading) {
      fetchBenchmarkData();
    }
  }, [results, benchmarkData, benchmarkLoading, fetchBenchmarkData]);

  // Fetch assessment framework for dimension names
  useEffect(() => {
    const fetchFramework = async () => {
      try {
        const frameworkData = await assessmentService.getAssessmentFramework();
        setFramework(frameworkData);
      } catch (err) {
        console.error('[AssessmentResultsNew] Error fetching framework:', err);
      }
    };
    fetchFramework();
  }, []);

  // Close color picker when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (showColorPicker) {
        setShowColorPicker(null);
      }
    };
    
    if (showColorPicker) {
      document.addEventListener('click', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showColorPicker]);

  // Refresh handler
  const handleRefresh = () => {
    fetchResults(true);
  };

  // Edit handlers for pillar cards
  const handleEditPillar = (pillarId, data) => {
    console.log('[Edit] Opening editor for pillar:', pillarId);
    console.log('[Edit] Current data:', data);
    
    setEditingPillar(pillarId);
    
    // Ensure we're using the latest data from the results
    const currentData = getPillarData(pillarId);
    console.log('[Edit] Fresh pillar data:', currentData);
    
    // Format Databricks recommendations for editing
    let recommendationsText = '';
    if (currentData.databricksFeatures && currentData.databricksFeatures.length > 0) {
      // If we have Databricks features, show them with their full details
      recommendationsText = currentData.databricksFeatures.map(feature => {
        let text = `${feature.name}`;
        if (feature.description) {
          text += ` - ${feature.description}`;
        }
        if (feature.releaseDate) {
          text += ` (${feature.releaseDate})`;
        }
        return text;
      }).join('\n');
      
      // Add specific recommendations if available
      if (currentData.specificRecommendations && currentData.specificRecommendations.length > 0) {
        recommendationsText += '\n\n--- Next Steps ---\n';
        recommendationsText += currentData.specificRecommendations.join('\n');
      }
    } else if (currentData.recommendations && currentData.recommendations.length > 0) {
      // Fallback to generic recommendations
      recommendationsText = currentData.recommendations.map(r => 
        typeof r === 'string' ? r : r.action || r.title || r
      ).join('\n');
    }
    
    setEditedContent({
      theGood: (currentData.theGood || []).join('\n'),
      theBad: (currentData.theBad || []).join('\n'),
      recommendations: recommendationsText
    });
  };

  const handleSavePillar = (pillarId) => {
    const newCustomizations = { ...customizations };
    newCustomizations.pillars[pillarId] = {
      theGood: editedContent.theGood.split('\n').filter(line => line.trim()),
      theBad: editedContent.theBad.split('\n').filter(line => line.trim()),
      recommendations: editedContent.recommendations.split('\n').filter(line => line.trim())
    };
    setCustomizations(newCustomizations);
    setEditingPillar(null);
    
  };

  const handleCancelPillarEdit = () => {
    setEditingPillar(null);
    setEditedContent({});
  };

  const handleRemovePillarCustomization = (pillarId) => {
    const newCustomizations = { ...customizations };
    delete newCustomizations.pillars[pillarId];
    setCustomizations(newCustomizations);
    
  };

  // Edit handlers for phase cards
  const handleEditPhase = (phaseId, items) => {
    setEditingPhase(phaseId);
    setEditedContent({ items: items.join('\n') });
  };

  const handleSavePhase = (phaseId) => {
    const newCustomizations = { ...customizations };
    newCustomizations.phases[phaseId] = editedContent.items.split('\n').filter(line => line.trim());
    setCustomizations(newCustomizations);
    setEditingPhase(null);
    
  };

  const handleCancelPhaseEdit = () => {
    setEditingPhase(null);
    setEditedContent({});
  };

  const handleRemovePhaseCustomization = (phaseId) => {
    const newCustomizations = { ...customizations };
    delete newCustomizations.phases[phaseId];
    setCustomizations(newCustomizations);
    
  };

  // Edit handlers for individual phase items
  const handleEditPhaseItem = (phaseId, itemIndex, itemText) => {
    setEditingPhaseItem(`${phaseId}-item-${itemIndex}`);
    setEditedContent({ itemText });
  };

  const handleSavePhaseItem = (phaseId, itemIndex) => {
    const newCustomizations = { ...customizations };
    
    // Get current phase items (either customized or original)
    const currentPhase = roadmapPhases.find(p => p.id === phaseId);
    if (!currentPhase) return;
    
    const updatedItems = [...currentPhase.items];
    updatedItems[itemIndex] = editedContent.itemText;
    
    newCustomizations.phases[phaseId] = updatedItems;
    setCustomizations(newCustomizations);
    setEditingPhaseItem(null);
    
  };

  const handleDeletePhaseItem = (phaseId, itemIndex) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    const newCustomizations = { ...customizations };
    
    // Get current phase items
    const currentPhase = roadmapPhases.find(p => p.id === phaseId);
    if (!currentPhase) return;
    
    const updatedItems = currentPhase.items.filter((_, idx) => idx !== itemIndex);
    newCustomizations.phases[phaseId] = updatedItems;
    setCustomizations(newCustomizations);
    
  };


  const handlePrintSlideshow = async () => {
    const toastId = toast.loading('Generating PDF from slideshow... This may take a minute', {
      position: 'top-center'
    });
    
    try {
      // Get the slideshow container
      const slideshowContainer = document.querySelector('.slideshow-single-slide');
      if (!slideshowContainer) {
        throw new Error('Slideshow not found');
      }
      
      // Create PDF (landscape letter size: 11 x 8.5 inches)
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'in',
        format: 'letter'
      });
      
      const originalSlide = currentSlide;
      
      // Loop through all 20 slides
      for (let i = 0; i < 20; i++) {
        toast.loading(`Capturing slide ${i + 1} of 20...`, { id: toastId });
        
        // Navigate to slide
        setCurrentSlide(i);
        
        // Wait for slide animation to complete
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Hide ALL UI elements before screenshot using data attribute
        const uiElements = slideshowContainer.querySelectorAll('[data-hide-on-print="true"]');
        console.log(`🔍 Found ${uiElements.length} elements with data-hide-on-print attribute`);
        uiElements.forEach((el, idx) => {
          console.log(`  ${idx + 1}. ${el.tagName} - ${el.className}`);
          el.style.display = 'none';
        });
        
        // Wait a bit for DOM update
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Capture screenshot
        const canvas = await html2canvas(slideshowContainer, {
          backgroundColor: null,
          scale: 2, // Higher quality
          logging: false,
          useCORS: true,
          allowTaint: true,
          foreignObjectRendering: true
        });
        
        // Show UI elements again
        uiElements.forEach(el => {
          el.style.display = '';
        });
        
        // Convert to image
        const imgData = canvas.toDataURL('image/png');
        
        // Calculate dimensions to maintain aspect ratio
        const canvasAspectRatio = canvas.width / canvas.height;
        const pdfWidth = 11; // inches (landscape letter)
        const pdfHeight = 8.5; // inches
        const pdfAspectRatio = pdfWidth / pdfHeight;
        
        let imgWidth, imgHeight, xOffset, yOffset;
        
        if (canvasAspectRatio > pdfAspectRatio) {
          // Canvas is wider - fit to width
          imgWidth = pdfWidth;
          imgHeight = pdfWidth / canvasAspectRatio;
          xOffset = 0;
          yOffset = (pdfHeight - imgHeight) / 2;
        } else {
          // Canvas is taller - fit to height
          imgHeight = pdfHeight;
          imgWidth = pdfHeight * canvasAspectRatio;
          xOffset = (pdfWidth - imgWidth) / 2;
          yOffset = 0;
        }
        
        // Add to PDF with correct aspect ratio
        if (i > 0) {
          pdf.addPage();
        }
        pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgWidth, imgHeight);
      }
      
      // Restore original slide
      setCurrentSlide(originalSlide);
      
      // Download PDF
      const fileName = `${results.assessmentInfo?.assessmentName || 'Maturity-Report'}-Slideshow.pdf`;
      pdf.save(fileName);
      
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      
    }
  };

  const handleExportExcel = async () => {
    try {
      setExporting(true);
      toast.loading('Generating Excel file...', { id: 'excel-export' });
      
      await exportAssessmentToExcel(
        assessmentId,
        results.assessmentInfo?.assessmentName || 'Assessment'
      );
      
      
    } catch (error) {
      console.error('Error exporting Excel:', error);
      
    } finally {
      setExporting(false);
    }
  };

  // 🎬 Presentation Mode Handlers
  const exitPresentation = () => {
    setPresentationMode(false);
    setCurrentSlide(0);
    document.body.style.overflow = 'auto';
  };

  const nextSlide = () => {
    const pillarsArray = [
      { id: 'platform_governance', name: 'Platform & Governance' },
      { id: 'data_engineering', name: 'Data Engineering & Integration' },
      { id: 'analytics_bi', name: 'Analytics & BI Modernization' },
      { id: 'machine_learning', name: 'Machine Learning & MLOps' },
      { id: 'generative_ai', name: 'Generative AI & Agentic Capabilities' },
      { id: 'operational_excellence', name: 'Operational Excellence & Adoption' }
    ];
    // Total: 2 intro slides + 6 pillars x 3 slides each (dimensions, overview, next steps) = 2 + 18 = 20 total
    const totalSlides = 2 + (pillarsArray.length * 3); // = 2 + 18 = 20
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

  // Calculate overall score from all pillars
  const calculateOverallScore = () => {
    const resultsData = results?.data || results;
    const categoryDetails = resultsData?.categoryDetails;
    
    if (!categoryDetails) return 0;
    
    const pillarsArray = [
      'platform_governance',
      'data_engineering',
      'analytics_bi',
      'machine_learning',
      'generative_ai',
      'operational_excellence'
    ];
    
    let totalScore = 0;
    let count = 0;
    
    pillarsArray.forEach(pillarId => {
      const pillarData = categoryDetails[pillarId];
      if (pillarData && pillarData.score !== undefined) {
        totalScore += pillarData.score;
        count++;
      }
    });
    
    return count > 0 ? totalScore / count : 0;
  };

  // Keyboard navigation for slideshow
  useEffect(() => {
    if (!presentationMode) return;

    const handleKeyPress = (e) => {
      if (e.key === 'Escape') {
        setPresentationMode(false);
        setCurrentSlide(0);
        document.body.style.overflow = 'auto';
      }
      if (e.key === 'ArrowRight' || e.key === ' ') {
        const pillarsArray = [
          { id: 'platform_governance', name: 'Platform & Governance' },
          { id: 'data_engineering', name: 'Data Engineering & Integration' },
          { id: 'analytics_bi', name: 'Analytics & BI Modernization' },
          { id: 'machine_learning', name: 'Machine Learning & MLOps' },
          { id: 'generative_ai', name: 'Generative AI & Agentic Capabilities' },
          { id: 'operational_excellence', name: 'Operational Excellence & Adoption' }
        ];
        const totalSlides = 2 + (pillarsArray.length * 3);
        setCurrentSlide(prev => {
          if (prev < totalSlides - 1) {
            return prev + 1;
          } else {
            setPresentationMode(false);
            setCurrentSlide(0);
            document.body.style.overflow = 'auto';
            return 0;
          }
        });
      }
      if (e.key === 'ArrowLeft') {
        setCurrentSlide(prev => prev > 0 ? prev - 1 : 0);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [presentationMode]);

  // Edit handlers for Good Items ("What's Working")
  const handleEditGoodItem = (pillarId, itemIndex, text) => {
    const key = `${pillarId}-${itemIndex}`;
    setEditingGoodItem(key);
    setEditedContent({
      ...editedContent,
      [key]: text
    });
  };

  const handleSaveGoodItem = (pillarId, itemIndex) => {
    const key = `${pillarId}-${itemIndex}`;
    const newCustomizations = { ...customizations };
    newCustomizations.goodItems[key] = editedContent[key];
    setCustomizations(newCustomizations);
    setEditingGoodItem(null);
    
  };

  // Edit handlers for Bad Items ("Key Challenges")
  const handleEditBadItem = (pillarId, itemIndex, text) => {
    const key = `${pillarId}-${itemIndex}`;
    setEditingBadItem(key);
    setEditedContent({
      ...editedContent,
      [key]: text
    });
  };

  const handleSaveBadItem = (pillarId, itemIndex) => {
    const key = `${pillarId}-${itemIndex}`;
    const newCustomizations = { ...customizations };
    newCustomizations.badItems[key] = editedContent[key];
    setCustomizations(newCustomizations);
    setEditingBadItem(null);
    
  };

  // Delete handlers for Good Items
  const handleDeleteGoodItem = (pillarId, itemIndex) => {
    const key = `${pillarId}-${itemIndex}`;
    const newCustomizations = { ...customizations };
    newCustomizations.goodItems[key] = null; // Mark as deleted
    setCustomizations(newCustomizations);
    
  };

  // Delete handlers for Bad Items
  const handleDeleteBadItem = (pillarId, itemIndex) => {
    const key = `${pillarId}-${itemIndex}`;
    const newCustomizations = { ...customizations };
    newCustomizations.badItems[key] = null; // Mark as deleted
    setCustomizations(newCustomizations);
    
  };

  // Delete handlers for Features
  const handleDeleteFeature = (pillarId, featureIndex) => {
    const key = `${pillarId}-feature-${featureIndex}`;
    const newCustomizations = { ...customizations };
    newCustomizations.features[key] = null; // Mark as deleted
    setCustomizations(newCustomizations);
    
  };

  // Delete handlers for Next Steps
  const handleDeleteNextStep = (pillarId, stepIndex) => {
    const key = `${pillarId}-${stepIndex}`;
    const newCustomizations = { ...customizations };
    newCustomizations.nextSteps[key] = null; // Mark as deleted
    setCustomizations(newCustomizations);
    
  };

  // Add handlers for phase items
  const handleAddPhaseItem = (phaseId) => {
    setAddingPhaseItem(phaseId);
    setEditedContent({
      ...editedContent,
      [`new-phase-${phaseId}`]: ''
    });
  };

  const handleSaveNewPhaseItem = (phaseId) => {
    const newText = editedContent[`new-phase-${phaseId}`];
    if (!newText || !newText.trim()) {
      
      return;
    }
    
    const newCustomizations = { ...customizations };
    if (!newCustomizations.newPhaseItems[phaseId]) {
      newCustomizations.newPhaseItems[phaseId] = [];
    }
    newCustomizations.newPhaseItems[phaseId].push(newText.trim());
    setCustomizations(newCustomizations);
    setAddingPhaseItem(null);
    
  };

  // Add handlers for impact metrics
  const handleAddImpactMetric = () => {
    setAddingImpactMetric(true);
    setEditedContent({
      ...editedContent,
      'new-metric-value': '',
      'new-metric-label': '',
      'new-metric-drivers': ''
    });
  };

  const handleSaveNewImpactMetric = () => {
    const newValue = editedContent['new-metric-value'];
    const newLabel = editedContent['new-metric-label'];
    const newDrivers = editedContent['new-metric-drivers'];
    
    if (!newValue || !newValue.trim() || !newLabel || !newLabel.trim()) {
      
      return;
    }
    
    const newCustomizations = { ...customizations };
    if (!newCustomizations.newImpactMetrics) {
      newCustomizations.newImpactMetrics = [];
    }
    newCustomizations.newImpactMetrics.push({
      value: newValue.trim(),
      label: newLabel.trim(),
      drivers: newDrivers ? newDrivers.split(',').map(d => d.trim()).filter(d => d) : []
    });
    setCustomizations(newCustomizations);
    setAddingImpactMetric(false);
    
  };

  // Edit handlers for impact metrics
  const handleEditImpactMetric = (metricKey, metric) => {
    setEditingImpactMetric(metricKey);
    setEditedContent({
      ...editedContent,
      [`${metricKey}-value`]: metric.value,
      [`${metricKey}-label`]: metric.label,
      [`${metricKey}-drivers`]: metric.drivers ? metric.drivers.join(', ') : ''
    });
  };

  const handleSaveImpactMetric = (metricKey) => {
    const newValue = editedContent[`${metricKey}-value`];
    const newLabel = editedContent[`${metricKey}-label`];
    const newDrivers = editedContent[`${metricKey}-drivers`];
    
    if (!newValue || !newValue.trim() || !newLabel || !newLabel.trim()) {
      
      return;
    }
    
    setCustomizations({
      ...customizations,
      impactMetrics: {
        ...customizations.impactMetrics,
        [metricKey]: {
          value: newValue.trim(),
          label: newLabel.trim(),
          drivers: newDrivers ? newDrivers.split(',').map(d => d.trim()).filter(d => d) : []
        }
      }
    });
    setEditingImpactMetric(null);
    
  };

  const handleDeleteImpactMetric = (metricKey) => {
    setCustomizations({
      ...customizations,
      impactMetrics: {
        ...customizations.impactMetrics,
        [metricKey]: null // Mark as deleted
      }
    });
    
  };

  const handleDeleteNewImpactMetric = (index) => {
    const newMetrics = [...customizations.newImpactMetrics];
    newMetrics.splice(index, 1);
    setCustomizations({
      ...customizations,
      newImpactMetrics: newMetrics
    });
    
  };

  const handleEditNewImpactMetric = (metricIndex, metric) => {
    const key = `new-metric-${metricIndex}`;
    setEditingImpactMetric(key);
    setEditedContent({
      ...editedContent,
      [`${key}-value`]: metric.value,
      [`${key}-label`]: metric.label,
      [`${key}-drivers`]: metric.drivers?.join(', ') || ''
    });
  };

  const handleSaveEditedNewImpactMetric = (metricIndex) => {
    const key = `new-metric-${metricIndex}`;
    const newValue = editedContent[`${key}-value`];
    const newLabel = editedContent[`${key}-label`];
    const newDrivers = editedContent[`${key}-drivers`];
    
    if (!newValue || !newValue.trim() || !newLabel || !newLabel.trim()) {
      
      return;
    }
    
    const driversArray = newDrivers ? newDrivers.split(',').map(d => d.trim()).filter(d => d) : [];
    const newMetrics = [...customizations.newImpactMetrics];
    newMetrics[metricIndex] = {
      value: newValue.trim(),
      label: newLabel.trim(),
      drivers: driversArray
    };
    
    setCustomizations({
      ...customizations,
      newImpactMetrics: newMetrics
    });
    setEditingImpactMetric(null);
    
  };

  // Edit handlers for newly added items
  const handleEditNewGoodItem = (pillarId, itemIndex, text) => {
    const key = `${pillarId}-new-${itemIndex}`;
    setEditingNewGoodItem(key);
    setEditedContent({
      ...editedContent,
      [key]: text
    });
  };

  const handleSaveNewGoodItem = (pillarId, itemIndex) => {
    const key = `${pillarId}-new-${itemIndex}`;
    const newText = editedContent[key];
    if (!newText || !newText.trim()) {
      
      return;
    }
    
    const newCustomizations = { ...customizations };
    newCustomizations.newGoodItems[pillarId][itemIndex] = newText.trim();
    setCustomizations(newCustomizations);
    setEditingNewGoodItem(null);
    
  };

  const handleDeleteNewGoodItem = (pillarId, itemIndex) => {
    const newCustomizations = { ...customizations };
    newCustomizations.newGoodItems[pillarId].splice(itemIndex, 1);
    setCustomizations(newCustomizations);
    
  };

  const handleEditNewBadItem = (pillarId, itemIndex, text) => {
    const key = `${pillarId}-new-${itemIndex}`;
    setEditingNewBadItem(key);
    setEditedContent({
      ...editedContent,
      [key]: text
    });
  };

  const handleSaveNewBadItem = (pillarId, itemIndex) => {
    const key = `${pillarId}-new-${itemIndex}`;
    const newText = editedContent[key];
    if (!newText || !newText.trim()) {
      
      return;
    }
    
    const newCustomizations = { ...customizations };
    newCustomizations.newBadItems[pillarId][itemIndex] = newText.trim();
    setCustomizations(newCustomizations);
    setEditingNewBadItem(null);
    
  };

  const handleDeleteNewBadItem = (pillarId, itemIndex) => {
    const newCustomizations = { ...customizations };
    newCustomizations.newBadItems[pillarId].splice(itemIndex, 1);
    setCustomizations(newCustomizations);
    
  };

  const handleEditNewFeature = (pillarId, featureIndex, feature) => {
    const key = `${pillarId}-new-feature-${featureIndex}`;
    setEditingNewFeature(key);
    setEditedContent({
      ...editedContent,
      [`${key}-name`]: feature.name,
      [`${key}-desc`]: feature.description
    });
  };

  const handleSaveNewFeature = (pillarId, featureIndex) => {
    const key = `${pillarId}-new-feature-${featureIndex}`;
    const newName = editedContent[`${key}-name`];
    const newDesc = editedContent[`${key}-desc`];
    
    if (!newName || !newName.trim()) {
      
      return;
    }
    
    const newCustomizations = { ...customizations };
    newCustomizations.newFeatures[pillarId][featureIndex] = {
      name: newName.trim(),
      description: newDesc?.trim() || '',
      releaseDate: null,
      docs: null
    };
    setCustomizations(newCustomizations);
    setEditingNewFeature(null);
    
  };

  const handleDeleteNewFeature = (pillarId, featureIndex) => {
    const newCustomizations = { ...customizations };
    newCustomizations.newFeatures[pillarId].splice(featureIndex, 1);
    setCustomizations(newCustomizations);
    
  };

  const handleEditNewNextStep = (pillarId, stepIndex, step) => {
    const key = `${pillarId}-new-step-${stepIndex}`;
    setEditingNewNextStep(key);
    setEditedContent({
      ...editedContent,
      [key]: step
    });
  };

  const handleSaveNewNextStep = (pillarId, stepIndex) => {
    const key = `${pillarId}-new-step-${stepIndex}`;
    const newText = editedContent[key];
    if (!newText || !newText.trim()) {
      
      return;
    }
    
    const newCustomizations = { ...customizations };
    newCustomizations.newNextSteps[pillarId][stepIndex] = newText.trim();
    setCustomizations(newCustomizations);
    setEditingNewNextStep(null);
    
  };

  const handleDeleteNewNextStep = (pillarId, stepIndex) => {
    const newCustomizations = { ...customizations };
    newCustomizations.newNextSteps[pillarId].splice(stepIndex, 1);
    setCustomizations(newCustomizations);
    
  };

  // Add handlers for new items
  const handleAddGoodItem = (pillarId) => {
    setAddingGoodItem(pillarId);
    setEditedContent({
      ...editedContent,
      [`new-good-${pillarId}`]: ''
    });
  };

  const handleSaveAddedGoodItem = (pillarId) => {
    const newText = editedContent[`new-good-${pillarId}`];
    if (!newText || !newText.trim()) {
      
      return;
    }
    
    const newCustomizations = { ...customizations };
    if (!newCustomizations.newGoodItems[pillarId]) {
      newCustomizations.newGoodItems[pillarId] = [];
    }
    newCustomizations.newGoodItems[pillarId].push(newText.trim());
    setCustomizations(newCustomizations);
    setAddingGoodItem(null);
    
  };

  const handleAddBadItem = (pillarId) => {
    setAddingBadItem(pillarId);
    setEditedContent({
      ...editedContent,
      [`new-bad-${pillarId}`]: ''
    });
  };

  // 🔄 Toggle section collapsed state
  const toggleSection = (sectionKey) => {
    setCustomizations(prev => ({
      ...prev,
      collapsedSections: {
        ...prev.collapsedSections,
        [sectionKey]: !prev.collapsedSections[sectionKey]
      }
    }));
  };

  // 🎨 Color customization handler
  const handleCardColorChange = (cardKey, colorType) => {
    // Create a hidden input element to trigger native color picker
    const input = document.createElement('input');
    input.type = 'color';
    
    // Get current color or use default (WHITE)
    const currentColors = customizations.cardColors[cardKey] || {};
    const defaultColors = {
      'good': { bg: '#ffffff', border: '#e5e7eb', text: '#166534' },
      'bad': { bg: '#ffffff', border: '#e5e7eb', text: '#991b1b' },
      'features': { bg: '#ffffff', border: '#e5e7eb', text: '#1e40af' },
      'nextSteps': { bg: '#ffffff', border: '#e5e7eb', text: '#92400e' },
      'roadmap': { bg: '#ffffff', border: '#e5e7eb', text: '#6b21a8' },
      'impact': { bg: '#ffffff', border: '#e5e7eb', text: '#075985' }
    };
    
    const cardType = cardKey.split('-')[0]; // Extract card type from cardKey
    const defaults = defaultColors[cardType] || defaultColors['good'];
    
    input.value = currentColors.bg || defaults.bg;
    
    input.onchange = (e) => {
      const newColor = e.target.value;
      
      // Calculate complementary colors
      // Convert hex to RGB
      const r = parseInt(newColor.slice(1, 3), 16);
      const g = parseInt(newColor.slice(3, 5), 16);
      const b = parseInt(newColor.slice(5, 7), 16);
      
      // Lighten for background (add 40 to each channel, max 255)
      const lightR = Math.min(255, r + 40);
      const lightG = Math.min(255, g + 40);
      const lightB = Math.min(255, b + 40);
      const bgColor = `#${lightR.toString(16).padStart(2, '0')}${lightG.toString(16).padStart(2, '0')}${lightB.toString(16).padStart(2, '0')}`;
      
      // Darken for text (subtract 100 from each channel, min 0)
      const darkR = Math.max(0, r - 100);
      const darkG = Math.max(0, g - 100);
      const darkB = Math.max(0, b - 100);
      const textColor = `#${darkR.toString(16).padStart(2, '0')}${darkG.toString(16).padStart(2, '0')}${darkB.toString(16).padStart(2, '0')}`;
      
      setCustomizations({
        ...customizations,
        cardColors: {
          ...customizations.cardColors,
          [cardKey]: {
            bg: bgColor,
            border: newColor,
            text: textColor
          }
        }
      });
      
      
    };
    
    input.click();
  };

  // 🔄 Reset card color to original
  const handleResetCardColor = (cardKey) => {
    const newCustomizations = { ...customizations };
    
    // Remove the custom color for this card (will revert to default)
    if (newCustomizations.cardColors[cardKey]) {
      delete newCustomizations.cardColors[cardKey];
      setCustomizations(newCustomizations);
      
    } else {
      
    }
  };

  const handleSaveAddedBadItem = (pillarId) => {
    const newText = editedContent[`new-bad-${pillarId}`];
    if (!newText || !newText.trim()) {
      
      return;
    }
    
    const newCustomizations = { ...customizations };
    if (!newCustomizations.newBadItems[pillarId]) {
      newCustomizations.newBadItems[pillarId] = [];
    }
    newCustomizations.newBadItems[pillarId].push(newText.trim());
    setCustomizations(newCustomizations);
    setAddingBadItem(null);
    
  };

  const handleAddFeature = (pillarId) => {
    setAddingFeature(pillarId);
    setEditedContent({
      ...editedContent,
      [`new-feature-${pillarId}-name`]: '',
      [`new-feature-${pillarId}-desc`]: ''
    });
  };

  const handleSaveAddedFeature = (pillarId) => {
    const newName = editedContent[`new-feature-${pillarId}-name`];
    const newDesc = editedContent[`new-feature-${pillarId}-desc`];
    
    if (!newName || !newName.trim()) {
      
      return;
    }
    
    const newCustomizations = { ...customizations };
    if (!newCustomizations.newFeatures[pillarId]) {
      newCustomizations.newFeatures[pillarId] = [];
    }
    newCustomizations.newFeatures[pillarId].push({
      name: newName.trim(),
      description: newDesc?.trim() || '',
      releaseDate: null,
      docs: null
    });
    setCustomizations(newCustomizations);
    setAddingFeature(null);
    
  };

  const handleAddNextStep = (pillarId) => {
    setAddingNextStep(pillarId);
    setEditedContent({
      ...editedContent,
      [`new-nextstep-${pillarId}`]: ''
    });
  };

  const handleSaveAddedNextStep = (pillarId) => {
    const newText = editedContent[`new-nextstep-${pillarId}`];
    if (!newText || !newText.trim()) {
      
      return;
    }
    
    const newCustomizations = { ...customizations };
    if (!newCustomizations.newNextSteps[pillarId]) {
      newCustomizations.newNextSteps[pillarId] = [];
    }
    newCustomizations.newNextSteps[pillarId].push(newText.trim());
    setCustomizations(newCustomizations);
    setAddingNextStep(null);
    
  };

  // Edit handlers for features and next steps
  const handleEditFeature = (pillarId, featureIndex, feature) => {
    const key = `${pillarId}-${featureIndex}`;
    setEditingFeature(key);
    setEditedContent({
      ...editedContent,
      [key]: {
        name: feature.name,
        description: feature.description,
        releaseDate: feature.releaseDate || '',
        docs: feature.docs || ''
      }
    });
  };

  const handleSaveFeature = (pillarId, featureIndex) => {
    const key = `${pillarId}-${featureIndex}`;
    setCustomizations({
      ...customizations,
      features: {
        ...customizations.features,
        [key]: editedContent[key]
      }
    });
    setEditingFeature(null);
    
  };

  const handleEditNextStep = (pillarId, stepIndex, step) => {
    const key = `${pillarId}-${stepIndex}`;
    setEditingNextStep(key);
    setEditedContent({
      ...editedContent,
      [key]: step
    });
  };

  const handleSaveNextStep = (pillarId, stepIndex) => {
    const key = `${pillarId}-${stepIndex}`;
    setCustomizations({
      ...customizations,
      nextSteps: {
        ...customizations.nextSteps,
        [key]: editedContent[key]
      }
    });
    setEditingNextStep(null);
    
  };

  const handleEditTitle = (title) => {
    setEditedContent({ ...editedContent, title });
  };

  const handleSaveTitle = () => {
    setCustomizations({ ...customizations, title: editedContent.title });
    
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
    if (editMode) {
      
    } else {
      
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div style={{ 
          minHeight: '60vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div style={{ 
            fontSize: '1.5rem', 
            fontWeight: 600,
            color: '#1e293b'
          }}>
            Generating your maturity report...
          </div>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
        </div>
      </PageContainer>
    );
  }

  if (error) {
    console.error('[AssessmentResultsNew] Rendering error state:', error);
    
    // Check if results haven't been released - show custom UI
    if (error === "Results have not been released yet. Please contact your administrator.") {
      return <ResultsNotReleased assessmentId={assessmentId} />;
    }
    
    // For other errors, show generic error message
    return (
      <PageContainer>
        <div style={{ 
          minHeight: '60vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '20px',
          padding: '40px'
        }}>
          <FiAlertTriangle size={64} color="#ef4444" />
          <div style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1e293b' }}>
            Unable to load results
          </div>
          <div style={{ color: '#64748b', textAlign: 'center', maxWidth: '500px' }}>
            {error}
          </div>
          <button 
            onClick={() => navigate('/assessments')}
            style={{
              marginTop: '16px',
              padding: '10px 20px',
              background: 'transparent',
              color: '#6b7280',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Back to Assessments
          </button>
        </div>
      </PageContainer>
    );
  }

  if (!results || !results.data) {
    console.error('[AssessmentResultsNew] No results data available:', results);
    return (
      <PageContainer>
        <div style={{ 
          minHeight: '60vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '20px',
          padding: '40px'
        }}>
          <FiAlertTriangle size={64} color="#f59e0b" />
          <div style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1e293b' }}>
            No results available
          </div>
          <div style={{ color: '#64748b', textAlign: 'center', maxWidth: '500px' }}>
            This assessment may not have been completed yet. Please complete the assessment questions first.
          </div>
          <button 
            onClick={() => navigate('/assessments')}
            style={{
              marginTop: '16px',
              padding: '10px 20px',
              background: 'transparent',
              color: '#6b7280',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Back to Assessments
          </button>
        </div>
      </PageContainer>
    );
  }

  // 🔥 FIX: Extract resultsData FIRST before using it
  const resultsData = results?.data || results;
  
  // Calculate maturity levels from actual results data
  // 🔥 FIX: Default to Level 1 (Explore) if no responses, not Level 3!
  const hasAnyResponses = resultsData?.assessmentInfo?.questionsAnswered > 0;
  const currentMaturity = hasAnyResponses ? (resultsData?.overall?.currentScore || 1) : 1;
  const targetMaturity = hasAnyResponses ? (resultsData?.overall?.futureScore || 1) : 1;
  const improvementLevel = parseFloat((targetMaturity - currentMaturity).toFixed(1)); // 🔥 Round to 1 decimal place

  // Pillar data with icons
  const pillars = [
    { id: 'platform_governance', name: 'Platform & Governance', icon: '🧱' },
    { id: 'data_engineering', name: 'Data Engineering & Integration', icon: '📊' },
    { id: 'analytics_bi', name: 'Analytics & BI Modernization', icon: '📈' },
    { id: 'machine_learning', name: 'Machine Learning & MLOps', icon: '🤖' },
    { id: 'generative_ai', name: 'Generative AI & Agentic Capabilities', icon: '💡' },
    { id: 'operational_excellence', name: 'Operational Excellence & Adoption', icon: '⚙️' },
  ];

  // Phase colors for Strategic Roadmap
  const phaseColors = {
    phase1: {
      bgColor: '#fef3c7',
      borderColor: '#fbbf24',
      accentColor: '#f59e0b'
    },
    phase2: {
      bgColor: '#fed7aa',
      borderColor: '#fb923c',
      accentColor: '#ea580c'
    },
    phase3: {
      bgColor: '#d1fae5',
      borderColor: '#86efac',
      accentColor: '#10b981'
    }
  };
  
  // Get dynamic roadmap phases from API (with customization override)
  const getRoadmapPhases = () => {
    const resultsData = results?.data || results;
    const apiRoadmap = resultsData?.roadmap;
    
    console.log('[AssessmentResultsNew] API roadmap:', apiRoadmap);
    
    // Use dynamic roadmap from API if available
    if (apiRoadmap?.phases && Array.isArray(apiRoadmap.phases)) {
      return apiRoadmap.phases.map(phase => ({
        ...phase,
        ...phaseColors[phase.id],
        // Allow customization override
        items: customizations.phases[phase.id] || phase.items
      }));
    }
    
    // Fallback to default if API doesn't return roadmap
    console.log('[AssessmentResultsNew] No API roadmap, using default phases');
    return [
      {
        id: 'phase1',
        title: 'Phase 1: Foundation (0–3 months)',
        ...phaseColors.phase1,
        items: customizations.phases.phase1 || [
          'Implement Unity Catalog with initial RBAC roles',
          'Establish data quality monitoring and observability',
          'Launch initial governance enablement sessions'
        ]
      },
      {
        id: 'phase2',
        title: 'Phase 2: Scale (3–6 months)',
        ...phaseColors.phase2,
        items: customizations.phases.phase2 || [
          'Automate pipeline reliability tracking via DLT',
          'Integrate ML flow metrics with centralized dashboards',
          'Deploy first GenAI-enabled use case under governance'
        ]
      },
      {
        id: 'phase3',
        title: 'Phase 3: Optimize (6–12 months)',
        ...phaseColors.phase3,
        items: customizations.phases.phase3 || [
          'Formalize MLOps CI/CD for model deployment',
          'Expand GenAI use cases with RAG implementation',
          'Align data mesh principles with Unity Catalog'
        ]
      }
    ];
  };
  
  const roadmapPhases = getRoadmapPhases();

  // Get pillar-specific results
  // Helper function to extract text from recommendation items
  const getRecommendationText = (item) => {
    if (typeof item === 'string') return item;
    // Try different possible field names
    return item.name || item.feature || item.action || item.title || item.description || JSON.stringify(item);
  };

  const getPillarData = (pillarId) => {
    const resultsData = results?.data || results;
    
    console.log(`[AssessmentResultsNew] Getting data for pillar: ${pillarId}`);
    console.log(`[AssessmentResultsNew] categoryDetails:`, resultsData?.categoryDetails);
    console.log(`[AssessmentResultsNew] prioritizedActions:`, resultsData?.prioritizedActions);
    
    // Check if there's a customization for this pillar
    if (customizations.pillars[pillarId]) {
      console.log(`[AssessmentResultsNew] Using customized data for ${pillarId}`);
      return customizations.pillars[pillarId];
    }
    
    // categoryDetails is an object with pillar IDs as keys, not an array
    const pillarResults = resultsData?.categoryDetails?.[pillarId];
    console.log(`[AssessmentResultsNew] pillarResults for ${pillarId}:`, pillarResults);
    
    // prioritizedActions is an array, so use find
    // Backend uses 'area' field for pillar ID
    const prioritized = Array.isArray(resultsData?.prioritizedActions) 
      ? resultsData.prioritizedActions.find(pa => pa.area === pillarId || pa.pillar === pillarId || pa.pillarId === pillarId)
      : null;
    console.log(`[AssessmentResultsNew] prioritized for ${pillarId}:`, prioritized);
    if (prioritized) {
      console.log(`[AssessmentResultsNew] Found prioritized data with databricksFeatures:`, prioritized.databricksFeatures?.length || 0);
    }

    // FIX: Backend returns theGood/theBad in prioritizedActions array
    // prioritizedActions is the source of truth for pillar-specific good/bad/recommendations
    // NEW: Also includes databricksFeatures, quickWins, specificRecommendations
    const databricksFeatures = prioritized?.databricksFeatures || [];
    const actions = prioritized?.actions || [];
    
    // Combine recommendations: prioritize databricksFeatures, then fall back to actions
    const combinedRecommendations = databricksFeatures.length > 0 ? databricksFeatures : actions;
    
    // Combine nextSteps: prioritize specificRecommendations, then fall back to generic nextSteps
    const specificRecs = prioritized?.specificRecommendations || [];
    const genericNextSteps = prioritized?.nextSteps || [];
    const combinedNextSteps = specificRecs.length > 0 ? specificRecs : genericNextSteps;
    
    const data = {
      theGood: prioritized?.theGood || [],  // Direct access from prioritizedActions
      theBad: prioritized?.theBad || [],    // Direct access from prioritizedActions
      recommendations: combinedRecommendations,  // Combined recommendations
      nextSteps: combinedNextSteps,  // Combined next steps
      // NEW: Databricks-specific features
      databricksFeatures: databricksFeatures,
      quickWins: prioritized?.quickWins || [],
      strategicMoves: prioritized?.strategicMoves || [],
      specificRecommendations: specificRecs,
      nextLevelFeatures: prioritized?.nextLevelFeatures || [],
      databricksSource: prioritized?._source || null,
      databricksDocsUrl: prioritized?._docsUrl || null
    };
    
    console.log(`[AssessmentResultsNew] Final data for ${pillarId}:`, data);
    console.log(`[AssessmentResultsNew] Databricks features for ${pillarId}:`, data.databricksFeatures?.length || 0);
    console.log(`[AssessmentResultsNew] Recommendations for ${pillarId}:`, data.recommendations?.length || 0);
    console.log(`[AssessmentResultsNew] Sample recommendations:`, data.recommendations?.slice(0, 2));
    
    // Check if recommendations are personalized or generic
    if (data.recommendations.length === 0 && data.databricksFeatures.length === 0) {
      console.warn(`⚠️ [${pillarId}] NO RECOMMENDATIONS FOUND! This assessment may not have been fully completed or needs to be refreshed.`);
      console.warn(`⚠️ [${pillarId}] Click the green "Refresh" button to regenerate personalized recommendations based on your assessment data.`);
    } else if (data.recommendations.length > 0) {
      const sampleText = JSON.stringify(data.recommendations[0]);
      console.log(`📊 [${pillarId}] First recommendation preview:`, sampleText.substring(0, 100));
    }
    
    return data;
  };

  // 🔥 resultsData already declared at top - removed duplicate
  console.log('[AssessmentResultsNew] Rendering with resultsData:', resultsData);
  console.log('[AssessmentResultsNew] resultsData keys:', resultsData ? Object.keys(resultsData) : 'null');
  console.log('[AssessmentResultsNew] categoryDetails keys:', resultsData?.categoryDetails ? Object.keys(resultsData.categoryDetails) : 'null');
  console.log('[AssessmentResultsNew] prioritizedActions length:', Array.isArray(resultsData?.prioritizedActions) ? resultsData.prioritizedActions.length : 'not an array');

  // Check if data looks generic/stale
  const hasGenericContent = () => {
    if (!resultsData?.prioritizedActions) return false;
    
    const genericPhrases = [
      'Strengthen Security Posture',
      'Enhance Monitoring and Observability',
      'Simplify Integration Architecture',
      'Clear assessment of current capabilities',
      'Defined target state at Level'
    ];
    
    return resultsData.prioritizedActions.some(action => {
      const hasGenericGood = action.theGood?.some(item => 
        genericPhrases.some(phrase => item.includes(phrase))
      );
      return hasGenericGood;
    });
  };
  
  const showStaleDataWarning = hasGenericContent();
  
  // 🚨 CHECK: Are there any fully completed pillars?
  const completedPillars = resultsData?.assessmentInfo?.completedPillars || 0;
  const hasNoCompletedPillars = completedPillars === 0;

  // Removed print functionality


  return (
    <PageContainer>
      <PrintStyles />
      
      <ReportContainer>
        {/* 🚨 NO COMPLETED PILLARS WARNING */}
        {hasNoCompletedPillars && (
          <div style={{
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            color: 'white',
            padding: '32px 24px',
            borderRadius: '12px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            boxShadow: '0 8px 24px rgba(239, 68, 68, 0.4)'
          }}>
            <FiAlertTriangle size={48} style={{ flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px' }}>
                ⚠️ No Results Available Yet
              </div>
              <div style={{ fontSize: '1.125rem', opacity: 0.95, marginBottom: '8px' }}>
                You need to <strong>fully complete at least one pillar</strong> (answer or skip all questions) before we can generate meaningful recommendations, strategic roadmaps, and insights.
              </div>
              <div style={{ fontSize: '1rem', opacity: 0.9 }}>
                <strong>Current Progress:</strong> {resultsData?.assessmentInfo?.questionsAnswered || 0} of {resultsData?.assessmentInfo?.totalQuestions || 60} questions addressed ({resultsData?.assessmentInfo?.completionPercentage || 0}%)
              </div>
            </div>
            <button
              onClick={() => navigate(`/assessment/${assessmentId}/platform_governance`)}
              style={{
                background: 'white',
                color: '#ef4444',
                border: 'none',
                padding: '16px 28px',
                borderRadius: '10px',
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: '1.063rem',
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
              }}
            >
              Continue Assessment →
            </button>
          </div>
        )}
        
        {/* Stale Data Warning */}
        {!hasNoCompletedPillars && showStaleDataWarning && (
          <div style={{
            background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
            color: '#6b7280',
            padding: '20px 24px',
            borderRadius: '12px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)'
          }}>
            <FiAlertTriangle size={32} style={{ flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '6px' }}>
                ⚠️ You're viewing old cached data with generic content
              </div>
              <div style={{ fontSize: '0.938rem', opacity: 0.95 }}>
                Click the green "Refresh Results" button below to regenerate with YOUR dynamic Databricks recommendations!
              </div>
            </div>
            <button
              onClick={handleRefresh}
              style={{
                background: 'white',
                color: '#ff6b35',
                border: '1px solid #d1d5db',
                padding: '12px 20px',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '0.938rem',
                flexShrink: 0,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
              }}
            >
              Refresh Now →
            </button>
          </div>
        )}
        
        {/* Header - Always show */}
        <ReportHeader>
          {/* Floating Start Slideshow Button */}
          {!presentationMode && (
            <FloatingSlideshowButton
              onClick={() => { 
                setPresentationMode(true); 
                setCurrentSlide(0); 
                document.body.style.overflow = 'hidden'; 
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="View Maturity Report in presentation slideshow mode"
            >
              <FiMonitor size={18} />
              Slideshow
            </FloatingSlideshowButton>
          )}
          
          <HeaderTop>
            <TitleSection>
              <h1>Enterprise Data & AI Maturity Report</h1>
              <div className="subtitle">
                Prepared for {resultsData?.assessmentInfo?.organizationName || 'Your Organization'} | {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </div>
            </TitleSection>
            <ActionButtons>
              {/* Primary Group - Purple + Green */}
              <ButtonGroup>
                <ActionButton
                  onClick={() => navigate(`/executive/${assessmentId}`)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                >
                  <FiTarget size={16} />
                  Executive Command Center
                </ActionButton>
                <ActionButton
                  onClick={() => navigate(`/benchmarks/${assessmentId}`)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                >
                  <FiBarChart2 size={16} />
                  Industry Benchmarks
                </ActionButton>
              </ButtonGroup>

              <ButtonSeparator />

              {/* Secondary Group - Orange + Green */}
              <ButtonGroup>
                <ActionButton
                  onClick={() => {
                    // Navigate to first selected pillar, or platform_governance as fallback
                    const selectedPillars = results?.selectedPillars || results?.assessmentInfo?.selectedPillars;
                    const targetPillar = (selectedPillars && selectedPillars.length > 0) 
                      ? selectedPillars[0] 
                      : 'platform_governance';
                    navigate(`/assessment/${assessmentId}/${targetPillar}`);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}
                >
                  <FiEdit3 size={16} />
                  Edit Assessment
                </ActionButton>
                <ActionButton
                  onClick={() => navigate(`/history/${assessmentId}`)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}
                >
                  <FiClock size={16} />
                  History
                </ActionButton>
                <ActionButton
                  onClick={handleRefresh}
                  disabled={refreshing}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                >
                  <FiRefreshCw size={16} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
                  {refreshing ? 'Refreshing...' : 'Refresh'}
                </ActionButton>
              </ButtonGroup>

              <ButtonSeparator />

              {/* Utility Group - Gray */}
              <ButtonGroup>
                <ActionButton
                  onClick={handleExportExcel}
                  disabled={exporting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ background: 'rgba(100, 116, 139, 0.8)' }}
                >
                  <FiDownload size={16} />
                  Export Excel
                </ActionButton>
              </ButtonGroup>
            </ActionButtons>
          </HeaderTop>
        </ReportHeader>

        {/* 🚨 ONLY SHOW RESULTS IF AT LEAST ONE PILLAR IS FULLY COMPLETED */}
        {!hasNoCompletedPillars && (
          <>
        <ReportHeader>
          <MaturityOverview>
            <MaturityCard $iconBg="rgba(59, 130, 246, 0.3)">
              <div className="icon">
                <FiTarget size={24} />
              </div>
              <div className="label">Current Maturity</div>
              <div className="value">
                Level {currentMaturity} — {resultsData?.maturitySummary?.current?.level || 'Defined'}
              </div>
              <div className="description">
                {resultsData?.maturitySummary?.current?.description || 
                 'Standardized processes across key domains, limited automation.'}
              </div>
            </MaturityCard>

            <MaturityCard $iconBg="rgba(16, 185, 129, 0.3)">
              <div className="icon">
                <FiTrendingUp size={24} />
              </div>
              <div className="label">Target Maturity</div>
              <div className="value">
                Level {targetMaturity} — {resultsData?.maturitySummary?.target?.level || 'Managed'}
              </div>
              <div className="description">
                {resultsData?.maturitySummary?.target?.description || 
                 'Governed, measurable maturity with continuous optimization.'}
              </div>
            </MaturityCard>

            <MaturityCard $iconBg="rgba(245, 158, 11, 0.3)">
              <div className="icon">
                <FiZap size={24} />
              </div>
              <div className="label">Improvement Potential</div>
              <div className="value">
                +{improvementLevel} Level
              </div>
              <div className="description">
                {resultsData?.maturitySummary?.improvement?.description || 
                 'Achievable through automation, governance integration, and AI enablement.'}
              </div>
            </MaturityCard>
          </MaturityOverview>
        </ReportHeader>

        {/* Body */}
        <ReportBody>
          {/* Maturity Roadmap Visualization */}
          <SectionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <SectionHeader>
              <SectionBadge>
                <FiTrendingUp />
              </SectionBadge>
              <SectionTitleWrapper>
                <SectionTitle>Maturity Snapshot by Pillar</SectionTitle>
                <SectionSubtitle>Overview of current and target maturity levels</SectionSubtitle>
              </SectionTitleWrapper>
            </SectionHeader>

            <MaturityChart>
            
            <MaturityLegend>
              <LegendItem>
                <div style={{ width: 16, height: 16, borderRadius: 4, background: '#3b82f6', border: '2px solid #3b82f6' }} />
                <span>Today</span>
              </LegendItem>
              <LegendItem>
                <div style={{ width: 16, height: 16, borderRadius: 4, background: 'transparent', border: '2px solid #3b82f6' }} />
                <span>Tomorrow</span>
              </LegendItem>
            </MaturityLegend>
            
            <CompactMaturityGrid>
              {pillars.map((pillar) => {
                const pillarScores = resultsData?.categoryDetails?.[pillar.id] || {};
                const currentScore = (pillarScores.currentScore || 0).toFixed(1);
                const futureScore = (pillarScores.futureScore || pillarScores.currentScore || 0).toFixed(1);
                
                const color = 
                  pillar.id === 'platform_governance' ? '#3b82f6' :
                  pillar.id === 'data_engineering' ? '#ef4444' :
                  pillar.id === 'analytics_bi' ? '#10b981' :
                  pillar.id === 'machine_learning' ? '#f59e0b' :
                  pillar.id === 'generative_ai' ? '#8b5cf6' :
                  '#06b6d4';
                
                return (
                  <MaturityPillarSection key={pillar.id} $color={color}>
                    <MaturityPillarTitle $color={color}>
                      <span className="pillar-icon">{pillar.icon}</span>
                      <span className="pillar-name">{pillar.name}</span>
                    </MaturityPillarTitle>
                    
                    <ScoresContainer>
                      <ScoreGroup>
                        <ScoreLabel>Today</ScoreLabel>
                        <ScoreBadge $color={color} $current>
                          {currentScore}
                        </ScoreBadge>
                      </ScoreGroup>
                      <ScoreGroup>
                        <ScoreLabel>Tomorrow</ScoreLabel>
                        <ScoreBadge $color={color}>
                          {futureScore}
                        </ScoreBadge>
                      </ScoreGroup>
                    </ScoresContainer>
                  </MaturityPillarSection>
                );
              })}
            </CompactMaturityGrid>
            </MaturityChart>
          </SectionCard>
          
          {/* Pillar-by-Pillar Assessment */}
          <SectionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <SectionHeader>
              <SectionBadge>
                <FiBarChart2 />
              </SectionBadge>
              <SectionTitleWrapper>
                <SectionTitle>Pillar-by-Pillar Assessment</SectionTitle>
                <SectionSubtitle>Detailed breakdown of each capability area</SectionSubtitle>
              </SectionTitleWrapper>
            </SectionHeader>

          {pillars.map((pillar, index) => {
            const data = getPillarData(pillar.id);
            
            // Get pillar color (use custom if set, otherwise premium default)
            const premiumColors = {
              'platform_governance': {
                primary: '#1B3B6F',
                text: '#1e293b'
              },
              'data_engineering': {
                primary: '#f97316',
                text: '#1e293b'
              },
              'analytics_bi': {
                primary: '#00A972',
                text: '#1e293b'
              },
              'machine_learning': {
                primary: '#7c3aed',
                text: '#1e293b'
              },
              'generative_ai': {
                primary: '#FF3621',
                text: '#1e293b'
              },
              'operational_excellence': {
                primary: '#475569',
                text: '#1e293b'
              }
            };
            
            // Function to generate a subtle tinted gradient based on color
            const generateTintedGradient = (color) => {
              // Convert hex to RGB for tinting
              const hex = color.replace('#', '');
              const r = parseInt(hex.substr(0, 2), 16);
              const g = parseInt(hex.substr(2, 2), 16);
              const b = parseInt(hex.substr(4, 2), 16);
              
              // Create very subtle tinted gradient (5% and 10% opacity)
              return `linear-gradient(135deg, rgba(${r}, ${g}, ${b}, 0.05) 0%, rgba(${r}, ${g}, ${b}, 0.10) 100%)`;
            };
            
            const pillarColorScheme = premiumColors[pillar.id] || premiumColors['operational_excellence'];
            const pillarColor = customizations.pillarColors[pillar.id] || pillarColorScheme.primary;
            
            // Use custom gradient if color was customized, otherwise unified default
            const pillarGradient = customizations.pillarColors[pillar.id] 
              ? generateTintedGradient(customizations.pillarColors[pillar.id])
              : 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)';
            
            const unifiedBorder = '#e2e8f0';
            
            // Get dimensions from results data (PRIMARY SOURCE - always available)
            let dimensions = [];
            
            // First, try to get from results data
            if (resultsData?.categoryDetails?.[pillar.id]?.dimensions) {
              const dimensionsObj = resultsData.categoryDetails[pillar.id].dimensions;
              const dimensionKeys = Object.keys(dimensionsObj);
              
              // Try to get proper names from framework if available
              if (framework?.data?.assessmentAreas) {
                const pillarFramework = framework.data.assessmentAreas.find(area => area.id === pillar.id);
                if (pillarFramework?.dimensions) {
                  dimensions = pillarFramework.dimensions.map(dim => ({
                    id: dim.id,
                    title: dim.name || dim.title || dim.id
                  }));
                }
              }
              
              // Fallback to generating titles from dimension IDs
              if (dimensions.length === 0) {
                dimensions = dimensionKeys.map(dimId => ({
                  id: dimId,
                  title: dimId.split('_').map(word => {
                    // Keep ML and AI in uppercase
                    if (word.toLowerCase() === 'ml' || word.toLowerCase() === 'ai') {
                      return word.toUpperCase();
                    }
                    return word.charAt(0).toUpperCase() + word.slice(1);
                  }).join(' ')
                }));
              }
            }
            
            return (
              <PillarSection
                key={pillar.id}
                $color={pillarColor}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <PillarHeader
                  $gradient={pillarGradient}
                  $borderColor={unifiedBorder}
                  $accentColor={pillarColor}
                  $textColor={pillarColorScheme.text}
                >
                  <div className="pillar-info" onClick={() => toggleSection(`pillar-${pillar.id}`)} style={{ cursor: 'pointer', flex: 1 }}>
                    <span className="pillar-icon">{pillar.icon}</span>
                    <h3>{pillar.name}</h3>
                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', color: 'white', opacity: 0.9 }}>
                      {customizations.collapsedSections[`pillar-${pillar.id}`] ? (
                        <FiChevronDown size={24} />
                      ) : (
                        <FiChevronUp size={24} />
                      )}
                    </div>
                  </div>
                  <div className="pillar-actions">
                    {editingPillar === pillar.id ? (
                      <>
                        <EditActionButton 
                          $variant="success"
                          onClick={() => handleSavePillar(pillar.id)}
                          title="Save"
                        >
                          <FiSave size={14} />
                        </EditActionButton>
                        <EditActionButton 
                          onClick={handleCancelPillarEdit}
                          title="Cancel"
                        >
                          <FiX size={14} />
                        </EditActionButton>
                      </>
                    ) : (
                      <>
                        <EditActionButton 
                          onClick={() => handleEditPillar(pillar.id, data)}
                          title="Edit"
                        >
                          <FiEdit3 size={14} />
                        </EditActionButton>
                        {customizations.pillars[pillar.id] && (
                          <EditActionButton 
                            $variant="danger"
                            onClick={() => handleRemovePillarCustomization(pillar.id)}
                            title="Remove customization"
                          >
                            <FiTrash2 size={14} />
                          </EditActionButton>
                        )}
                        <div style={{ position: 'relative' }}>
                          <ColorPickerButton
                            $color={pillarColor}
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowColorPicker(showColorPicker === pillar.id ? null : pillar.id);
                            }}
                            title="Change color"
                          >
                            🎨
                          </ColorPickerButton>
                          {showColorPicker === pillar.id && (
                            <ColorPickerPopover onClick={(e) => e.stopPropagation()}>
                              <ColorPickerLabel>Custom Color Picker</ColorPickerLabel>
                              <ColorInputWrapper>
                                <ColorPreview>
                                  <ColorSwatch $color={pillarColor} />
                                  <ColorInput
                                    type="color"
                                    value={pillarColor}
                                    onChange={(e) => {
                                      const newColor = e.target.value;
                                      setCustomizations({
                                        ...customizations,
                                        pillarColors: {
                                          ...customizations.pillarColors,
                                          [pillar.id]: newColor
                                        }
                                      });
                                      
                                    }}
                                  />
                                </ColorPreview>
                                <ColorHexInput
                                  type="text"
                                  value={pillarColor.toUpperCase()}
                                  onChange={(e) => {
                                    let value = e.target.value.trim();
                                    // Auto-add # if missing
                                    if (!value.startsWith('#')) {
                                      value = '#' + value;
                                    }
                                    // Validate hex color (3 or 6 digits)
                                    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value)) {
                                      setCustomizations({
                                        ...customizations,
                                        pillarColors: {
                                          ...customizations.pillarColors,
                                          [pillar.id]: value
                                        }
                                      });
                                      
                                    }
                                  }}
                                  placeholder="#1B3B6F"
                                  maxLength="7"
                                />
                              </ColorInputWrapper>
                              
                              <QuickColorsLabel>Quick Presets</QuickColorsLabel>
                              <QuickColorGrid>
                                {[
                                  '#1B3B6F', '#FF3621', '#00A972', '#059669', '#7c3aed', '#475569',
                                  '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4',
                                ].map((color) => (
                                  <QuickColorButton
                                    key={color}
                                    $color={color}
                                    $selected={pillarColor === color}
                                    onClick={() => {
                                      setCustomizations({
                                        ...customizations,
                                        pillarColors: {
                                          ...customizations.pillarColors,
                                          [pillar.id]: color
                                        }
                                      });
                                      
                                    }}
                                    title={color}
                                  />
                                ))}
                              </QuickColorGrid>
                            </ColorPickerPopover>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </PillarHeader>
                
                {/* Collapsible Content */}
                <AnimatePresence>
                  {!customizations.collapsedSections[`pillar-${pillar.id}`] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ overflow: 'hidden' }}
                    >
                
                {/* Dimension Maturity Chart */}
                {dimensions.length > 0 && (
                  <PillarMaturityChart>
                    <MaturityLevelsHeader>
                      <div></div>
                      <MaturityLevelsScale>
                        <MaturityLevel>1. Initial</MaturityLevel>
                        <MaturityLevel>2. Managed</MaturityLevel>
                        <MaturityLevel>3. Defined</MaturityLevel>
                        <MaturityLevel>4. Quantified</MaturityLevel>
                        <MaturityLevel>5. Optimized</MaturityLevel>
                      </MaturityLevelsScale>
                    </MaturityLevelsHeader>
                    
                    {dimensions.map((dimension, dimIdx) => {
                      const dimensionScores = resultsData?.categoryDetails?.[pillar.id]?.dimensions?.[dimension.id] || {};
                      const currentScore = (dimensionScores.currentScore || 0).toFixed(1);
                      const futureScore = (dimensionScores.futureScore || dimensionScores.currentScore || 0).toFixed(1);
                      const currentScoreNum = parseFloat(currentScore);
                      const futureScoreNum = parseFloat(futureScore);
                      
                      return (
                        <DimensionMaturityRow key={dimIdx}>
                          <DimensionLabel $borderColor={pillarColor}>
                            {dimension.title}
                          </DimensionLabel>
                          <MaturityBarsContainer>
                            <MaturityBar $color={pillarColor} $score={currentScoreNum} $isCurrent>
                              <BarLabel $isCurrent>Today</BarLabel>
                              <ScoreValue $isCurrent>{currentScore}</ScoreValue>
                            </MaturityBar>
                            <MaturityBar $color={pillarColor} $score={futureScoreNum}>
                              <BarLabel>Tomorrow</BarLabel>
                              <ScoreValue>{futureScore}</ScoreValue>
                            </MaturityBar>
                          </MaturityBarsContainer>
                        </DimensionMaturityRow>
                      );
                    })}
                  </PillarMaturityChart>
                )}
                
                {editingPillar === pillar.id ? (
                  <PillarBody style={{ display: 'block' }}>
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FiCheckCircle /> What's Working (one per line):
                      </label>
                      <EditableTextarea
                        value={editedContent.theGood || ''}
                        onChange={(e) => setEditedContent({ ...editedContent, theGood: e.target.value })}
                        placeholder="Enter strengths and in-progress initiatives, one per line..."
                      />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FiAlertTriangle /> Key Challenges (one per line):
                      </label>
                      <EditableTextarea
                        value={editedContent.theBad || ''}
                        onChange={(e) => setEditedContent({ ...editedContent, theBad: e.target.value })}
                        placeholder="Enter needs and gaps, one per line..."
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FiInfo /> Databricks Recommendations (one per line):
                      </label>
                      <EditableTextarea
                        value={editedContent.recommendations || ''}
                        onChange={(e) => setEditedContent({ ...editedContent, recommendations: e.target.value })}
                        placeholder="Enter Databricks recommendations, one per line..."
                      />
                    </div>
                  </PillarBody>
                ) : (
                  <PillarBody>
                    {/* Top Row: What's Working and Key Challenges */}
                    <PillarTopRow>
                      {/* What's Working - Premium Card Style */}
                      <div style={{ 
                        background: customizations.cardColors[`good-${pillar.id}`]?.bg || '#ffffff',
                        borderRadius: '16px',
                        padding: '24px',
                        border: `2px solid ${customizations.cardColors[`good-${pillar.id}`]?.border || '#e5e7eb'}`
                      }}>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between',
                          marginBottom: '16px',
                          color: customizations.cardColors[`good-${pillar.id}`]?.text || '#166534',
                          fontSize: '0.95rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FiCheckCircle size={20} />
                            What's Working
                          </div>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <button
                              onClick={() => handleCardColorChange(`good-${pillar.id}`, 'bg')}
                              style={{
                                background: 'transparent',
                                color: customizations.cardColors[`good-${pillar.id}`]?.text || '#166534',
                                border: `1px solid ${customizations.cardColors[`good-${pillar.id}`]?.border || '#bbf7d0'}`,
                                borderRadius: '50%',
                                width: '28px',
                                height: '28px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                transition: 'all 0.2s'
                              }}
                              title="Change card color"
                              onMouseEnter={(e) => e.currentTarget.style.background = (customizations.cardColors[`good-${pillar.id}`]?.border || '#bbf7d0')}
                              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                              <FiDroplet size={14} />
                            </button>
                            {customizations.cardColors[`good-${pillar.id}`] && (
                              <button
                                onClick={() => handleResetCardColor(`good-${pillar.id}`)}
                                style={{
                                  background: 'transparent',
                                  color: customizations.cardColors[`good-${pillar.id}`]?.text || '#166534',
                                  border: `1px solid ${customizations.cardColors[`good-${pillar.id}`]?.border || '#bbf7d0'}`,
                                  borderRadius: '50%',
                                  width: '28px',
                                  height: '28px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: 'pointer',
                                  fontSize: '1rem',
                                  transition: 'all 0.2s'
                                }}
                                title="Reset to original color"
                                onMouseEnter={(e) => e.currentTarget.style.background = (customizations.cardColors[`good-${pillar.id}`]?.border || '#bbf7d0')}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                              >
                                <FiRotateCcw size={14} />
                              </button>
                            )}
                            <button
                              onClick={() => handleAddGoodItem(pillar.id)}
                              style={{
                                background: 'transparent',
                                color: '#6b7280',
                                border: '1px solid #d1d5db',
                                borderRadius: '50%',
                                width: '28px',
                                height: '28px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                fontSize: '1.2rem',
                                fontWeight: 'bold',
                                lineHeight: '1'
                              }}
                              title="Add new item"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          {data.theGood.length > 0 ? (
                            data.theGood.slice(0, 4).map((item, idx) => {
                              const itemKey = `${pillar.id}-${idx}`;
                              const isEditing = editingGoodItem === itemKey;
                              const displayText = customizations.goodItems[itemKey] !== undefined 
                                ? customizations.goodItems[itemKey] 
                                : item;
                              
                              // Skip deleted items
                              if (customizations.goodItems[itemKey] === null) {
                                return null;
                              }
                              
                              return (
                              <div key={idx} style={{ 
                                background: 'white',
                                border: `1px solid ${isEditing ? '#22c55e' : '#bbf7d0'}`,
                                borderRadius: '10px',
                                padding: '12px 14px',
                                fontSize: '0.88rem',
                                color: '#15803d',
                                lineHeight: '1.6',
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '10px',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseEnter={(e) => {
                                if (!isEditing) {
                                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(34, 197, 94, 0.15)';
                                  e.currentTarget.style.borderColor = '#22c55e';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!isEditing) {
                                  e.currentTarget.style.boxShadow = 'none';
                                  e.currentTarget.style.borderColor = '#bbf7d0';
                                }
                              }}>
                                <span style={{ 
                                  color: '#22c55e', 
                                  fontWeight: 700,
                                  fontSize: '1.1rem',
                                  lineHeight: '1',
                                  flexShrink: 0,
                                  marginTop: '2px'
                                }}>✓</span>
                                {isEditing ? (
                                  <textarea
                                    value={editedContent[itemKey] || ''}
                                    onChange={(e) => setEditedContent({
                                      ...editedContent,
                                      [itemKey]: e.target.value
                                    })}
                                    style={{
                                      flex: 1,
                                      border: '1px solid #22c55e',
                                      borderRadius: '6px',
                                      padding: '8px',
                                      fontSize: '0.88rem',
                                      fontFamily: 'inherit',
                                      resize: 'vertical',
                                      minHeight: '60px'
                                    }}
                                  />
                                ) : (
                                  <span style={{ flex: 1 }}>{displayText}</span>
                                )}
                                <div style={{ display: 'flex', gap: '4px', marginLeft: 'auto' }}>
                                  {isEditing ? (
                                    <>
                                      <button
                                        onClick={() => handleSaveGoodItem(pillar.id, idx)}
                                        style={{
                                          padding: '4px 8px',
                                          fontSize: '0.75rem',
                                          background: 'transparent',
                                          color: '#6b7280',
                                          border: '1px solid #d1d5db',
                                          borderRadius: '4px',
                                          cursor: 'pointer'
                                        }}
                                      >
                                        Save
                                      </button>
                                      <button
                                        onClick={() => setEditingGoodItem(null)}
                                        style={{
                                          padding: '4px 8px',
                                          fontSize: '0.75rem',
                                          background: '#9ca3af',
                                          color: '#6b7280',
                                          border: '1px solid #d1d5db',
                                          borderRadius: '4px',
                                          cursor: 'pointer'
                                        }}
                                      >
                                        Cancel
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      <button
                                        onClick={() => handleEditGoodItem(pillar.id, idx, displayText)}
                                        style={{
                                          padding: '6px',
                                          fontSize: '0.75rem',
                                          background: 'transparent',
                                          color: '#6b7280',
                                          border: '1px solid #d1d5db',
                                          borderRadius: '4px',
                                          cursor: 'pointer'
                                        }}
                                      >
                                      <FiEdit3 size={14} />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteGoodItem(pillar.id, idx)}
                                        style={{
                                          padding: '6px',
                                          fontSize: '0.75rem',
                                          background: 'transparent',
                                          color: '#6b7280',
                                          border: '1px solid #d1d5db',
                                          borderRadius: '4px',
                                          cursor: 'pointer'
                                        }}
                                      >
                                      <FiTrash2 size={14} />
                                      </button>
                                    </>
                                  )}
                                </div>
                              </div>
                            )})
                          ) : (
                            <div style={{ 
                              padding: '12px', 
                              textAlign: 'center', 
                              color: '#6b7280',
                              fontSize: '0.85rem'
                            }}>
                              Complete assessment to see strengths
                            </div>
                          )}
                          
                          {/* Render newly added items */}
                          {customizations.newGoodItems[pillar.id] && customizations.newGoodItems[pillar.id].map((newItem, idx) => {
                            const itemKey = `${pillar.id}-new-${idx}`;
                            const isEditing = editingNewGoodItem === itemKey;
                            
                            return (
                            <div key={`new-${idx}`} style={{ 
                              background: 'white',
                              border: `1px solid ${isEditing ? '#22c55e' : '#bbf7d0'}`,
                              borderRadius: '10px',
                              padding: '12px 14px',
                              fontSize: '0.88rem',
                              color: '#15803d',
                              lineHeight: '1.6',
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '10px'
                            }}>
                              <span style={{ 
                                color: '#22c55e', 
                                fontWeight: 700,
                                fontSize: '1.1rem',
                                lineHeight: '1',
                                flexShrink: 0,
                                marginTop: '2px'
                              }}>✓</span>
                              {isEditing ? (
                                <textarea
                                  value={editedContent[itemKey] || ''}
                                  onChange={(e) => setEditedContent({
                                    ...editedContent,
                                    [itemKey]: e.target.value
                                  })}
                                  style={{
                                    flex: 1,
                                    border: '1px solid #22c55e',
                                    borderRadius: '6px',
                                    padding: '8px',
                                    fontSize: '0.88rem',
                                    fontFamily: 'inherit',
                                    resize: 'vertical',
                                    minHeight: '60px'
                                  }}
                                />
                              ) : (
                                <span style={{ flex: 1 }}>{newItem}</span>
                              )}
                              <div style={{ display: 'flex', gap: '4px', marginLeft: 'auto' }}>
                                {isEditing ? (
                                  <>
                                    <button
                                      onClick={() => handleSaveNewGoodItem(pillar.id, idx)}
                                      style={{
                                        padding: '4px 8px',
                                        fontSize: '0.75rem',
                                        background: 'transparent',
                                        color: '#6b7280',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                      }}
                                    >
                                      Save
                                    </button>
                                    <button
                                      onClick={() => setEditingNewGoodItem(null)}
                                      style={{
                                        padding: '4px 8px',
                                        fontSize: '0.75rem',
                                        background: '#9ca3af',
                                        color: '#6b7280',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                      }}
                                    >
                                      Cancel
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      onClick={() => handleEditNewGoodItem(pillar.id, idx, newItem)}
                                      style={{
                                        padding: '6px',
                                        fontSize: '0.75rem',
                                        background: 'transparent',
                                        color: '#6b7280',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                      }}
                                    >
                                      <FiEdit3 size={14} />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteNewGoodItem(pillar.id, idx)}
                                      style={{
                                        padding: '6px',
                                        fontSize: '0.75rem',
                                        background: 'transparent',
                                        color: '#6b7280',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                      }}
                                    >
                                      <FiTrash2 size={14} />
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          )}
                          )}
                          
                          {/* Form for adding new item */}
                          {addingGoodItem === pillar.id && (
                            <div style={{ 
                              background: 'white',
                              border: '2px solid #22c55e',
                              borderRadius: '10px',
                              padding: '12px 14px',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '10px'
                            }}>
                              <textarea
                                value={editedContent[`new-good-${pillar.id}`] || ''}
                                onChange={(e) => setEditedContent({
                                  ...editedContent,
                                  [`new-good-${pillar.id}`]: e.target.value
                                })}
                                placeholder="Enter what's working well..."
                                style={{
                                  border: '1px solid #22c55e',
                                  borderRadius: '6px',
                                  padding: '8px',
                                  fontSize: '0.88rem',
                                  fontFamily: 'inherit',
                                  resize: 'vertical',
                                  minHeight: '60px'
                                }}
                                autoFocus
                              />
                              <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                                <button
                                  onClick={() => handleSaveAddedGoodItem(pillar.id)}
                                  style={{
                                    padding: '6px 12px',
                                    fontSize: '0.8rem',
                                    background: 'transparent',
                                    color: '#6b7280',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontWeight: 600
                                  }}
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setAddingGoodItem(null)}
                                  style={{
                                    padding: '6px 12px',
                                    fontSize: '0.8rem',
                                    background: '#9ca3af',
                                    color: '#6b7280',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                  }}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Key Challenges - Premium Card Style */}
                      <div style={{ 
                        background: customizations.cardColors[`bad-${pillar.id}`]?.bg || '#ffffff',
                        borderRadius: '16px',
                        padding: '24px',
                        border: `2px solid ${customizations.cardColors[`bad-${pillar.id}`]?.border || '#e5e7eb'}`
                      }}>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between',
                          marginBottom: '16px',
                          color: customizations.cardColors[`bad-${pillar.id}`]?.text || '#991b1b',
                          fontSize: '0.95rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FiAlertTriangle size={20} />
                            KEY CHALLENGES
                          </div>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <button
                              onClick={() => handleCardColorChange(`bad-${pillar.id}`, 'bg')}
                              style={{
                                background: 'transparent',
                                color: customizations.cardColors[`bad-${pillar.id}`]?.text || '#991b1b',
                                border: `1px solid ${customizations.cardColors[`bad-${pillar.id}`]?.border || '#fecaca'}`,
                                borderRadius: '50%',
                                width: '28px',
                                height: '28px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                transition: 'all 0.2s'
                              }}
                              title="Change card color"
                              onMouseEnter={(e) => e.currentTarget.style.background = (customizations.cardColors[`bad-${pillar.id}`]?.border || '#fecaca')}
                              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                              <FiDroplet size={14} />
                            </button>
                            {customizations.cardColors[`bad-${pillar.id}`] && (
                              <button
                                onClick={() => handleResetCardColor(`bad-${pillar.id}`)}
                                style={{
                                  background: 'transparent',
                                  color: customizations.cardColors[`bad-${pillar.id}`]?.text || '#991b1b',
                                  border: `1px solid ${customizations.cardColors[`bad-${pillar.id}`]?.border || '#fecaca'}`,
                                  borderRadius: '50%',
                                  width: '28px',
                                  height: '28px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: 'pointer',
                                  fontSize: '1rem',
                                  transition: 'all 0.2s'
                                }}
                                title="Reset to original color"
                                onMouseEnter={(e) => e.currentTarget.style.background = (customizations.cardColors[`bad-${pillar.id}`]?.border || '#fecaca')}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                              >
                                <FiRotateCcw size={14} />
                              </button>
                            )}
                            <button
                              onClick={() => handleAddBadItem(pillar.id)}
                              style={{
                                background: 'transparent',
                                color: '#6b7280',
                                border: '1px solid #d1d5db',
                                borderRadius: '50%',
                                width: '28px',
                                height: '28px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                fontSize: '1.2rem',
                                fontWeight: 'bold',
                                lineHeight: '1'
                              }}
                              title="Add new challenge"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          {data.theBad.length > 0 ? (
                            data.theBad.slice(0, 4).map((item, idx) => {
                              const itemKey = `${pillar.id}-${idx}`;
                              const isEditing = editingBadItem === itemKey;
                              const displayText = customizations.badItems[itemKey] !== undefined 
                                ? customizations.badItems[itemKey] 
                                : item;
                              
                              // Skip deleted items
                              if (customizations.badItems[itemKey] === null) {
                                return null;
                              }
                              
                              return (
                              <div key={idx} style={{ 
                                background: 'white',
                                border: `1px solid ${isEditing ? '#ef4444' : '#fecaca'}`,
                                borderRadius: '10px',
                                padding: '12px 14px',
                                fontSize: '0.88rem',
                                color: '#b91c1c',
                                lineHeight: '1.6',
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '10px',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseEnter={(e) => {
                                if (!isEditing) {
                                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(239, 68, 68, 0.15)';
                                  e.currentTarget.style.borderColor = '#ef4444';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!isEditing) {
                                  e.currentTarget.style.boxShadow = 'none';
                                  e.currentTarget.style.borderColor = '#fecaca';
                                }
                              }}>
                                <span style={{ 
                                  color: '#ef4444', 
                                  fontWeight: 700,
                                  fontSize: '1.1rem',
                                  lineHeight: '1',
                                  flexShrink: 0,
                                  marginTop: '2px'
                                }}>⚠</span>
                                {isEditing ? (
                                  <textarea
                                    value={editedContent[itemKey] || ''}
                                    onChange={(e) => setEditedContent({
                                      ...editedContent,
                                      [itemKey]: e.target.value
                                    })}
                                    style={{
                                      flex: 1,
                                      border: '1px solid #ef4444',
                                      borderRadius: '6px',
                                      padding: '8px',
                                      fontSize: '0.88rem',
                                      fontFamily: 'inherit',
                                      resize: 'vertical',
                                      minHeight: '60px'
                                    }}
                                  />
                                ) : (
                                  <span style={{ flex: 1 }}>{displayText}</span>
                                )}
                                <div style={{ display: 'flex', gap: '4px', marginLeft: 'auto' }}>
                                  {isEditing ? (
                                    <>
                                      <button
                                        onClick={() => handleSaveBadItem(pillar.id, idx)}
                                        style={{
                                          padding: '4px 8px',
                                          fontSize: '0.75rem',
                                          background: 'transparent',
                                          color: '#6b7280',
                                          border: '1px solid #d1d5db',
                                          borderRadius: '4px',
                                          cursor: 'pointer'
                                        }}
                                      >
                                        Save
                                      </button>
                                      <button
                                        onClick={() => setEditingBadItem(null)}
                                        style={{
                                          padding: '4px 8px',
                                          fontSize: '0.75rem',
                                          background: '#9ca3af',
                                          color: '#6b7280',
                                          border: '1px solid #d1d5db',
                                          borderRadius: '4px',
                                          cursor: 'pointer'
                                        }}
                                      >
                                        Cancel
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      <button
                                        onClick={() => handleEditBadItem(pillar.id, idx, displayText)}
                                        style={{
                                          padding: '6px',
                                          background: 'transparent',
                                          color: '#6b7280',
                                          border: '1px solid #d1d5db',
                                          borderRadius: '4px',
                                          cursor: 'pointer',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center'
                                        }}
                                        title="Edit"
                                      >
                                        <FiEdit3 size={14} />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteBadItem(pillar.id, idx)}
                                        style={{
                                          padding: '6px',
                                          background: 'transparent',
                                          color: '#6b7280',
                                          border: '1px solid #d1d5db',
                                          borderRadius: '4px',
                                          cursor: 'pointer',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center'
                                        }}
                                        title="Delete"
                                      >
                                        <FiTrash2 size={14} />
                                      </button>
                                    </>
                                  )}
                                </div>
                              </div>
                            )})
                          ) : (
                            <div style={{ 
                              padding: '12px', 
                              textAlign: 'center', 
                              color: '#6b7280',
                              fontSize: '0.85rem'
                            }}>
                              Complete assessment to see gaps
                            </div>
                          )}
                          
                          {/* Render newly added items */}
                          {customizations.newBadItems[pillar.id] && customizations.newBadItems[pillar.id].map((newItem, idx) => {
                            const itemKey = `${pillar.id}-new-${idx}`;
                            const isEditing = editingNewBadItem === itemKey;
                            
                            return (
                            <div key={`new-${idx}`} style={{ 
                              background: 'white',
                              border: `1px solid ${isEditing ? '#ef4444' : '#fecaca'}`,
                              borderRadius: '10px',
                              padding: '12px 14px',
                              fontSize: '0.88rem',
                              color: '#991b1b',
                              lineHeight: '1.6',
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '10px'
                            }}>
                              <span style={{ 
                                color: '#ef4444', 
                                fontWeight: 700,
                                fontSize: '1.1rem',
                                lineHeight: '1',
                                flexShrink: 0,
                                marginTop: '2px'
                              }}>⚠</span>
                              {isEditing ? (
                                <textarea
                                  value={editedContent[itemKey] || ''}
                                  onChange={(e) => setEditedContent({
                                    ...editedContent,
                                    [itemKey]: e.target.value
                                  })}
                                  style={{
                                    flex: 1,
                                    border: '1px solid #ef4444',
                                    borderRadius: '6px',
                                    padding: '8px',
                                    fontSize: '0.88rem',
                                    fontFamily: 'inherit',
                                    resize: 'vertical',
                                    minHeight: '60px'
                                  }}
                                />
                              ) : (
                                <span style={{ flex: 1 }}>{newItem}</span>
                              )}
                              <div style={{ display: 'flex', gap: '4px', marginLeft: 'auto' }}>
                                {isEditing ? (
                                  <>
                                    <button
                                      onClick={() => handleSaveNewBadItem(pillar.id, idx)}
                                      style={{
                                        padding: '4px 8px',
                                        fontSize: '0.75rem',
                                        background: 'transparent',
                                        color: '#6b7280',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                      }}
                                    >
                                      Save
                                    </button>
                                    <button
                                      onClick={() => setEditingNewBadItem(null)}
                                      style={{
                                        padding: '4px 8px',
                                        fontSize: '0.75rem',
                                        background: '#9ca3af',
                                        color: '#6b7280',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                      }}
                                    >
                                      Cancel
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      onClick={() => handleEditNewBadItem(pillar.id, idx, newItem)}
                                      style={{
                                        padding: '6px',
                                        fontSize: '0.75rem',
                                        background: 'transparent',
                                        color: '#6b7280',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                      }}
                                    >
                                      <FiEdit3 size={14} />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteNewBadItem(pillar.id, idx)}
                                      style={{
                                        padding: '6px',
                                        fontSize: '0.75rem',
                                        background: 'transparent',
                                        color: '#6b7280',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                      }}
                                    >
                                      <FiTrash2 size={14} />
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          )}
                          )}
                          
                          {/* Form for adding new item */}
                          {addingBadItem === pillar.id && (
                            <div style={{ 
                              background: 'white',
                              border: '2px solid #ef4444',
                              borderRadius: '10px',
                              padding: '12px 14px',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '10px'
                            }}>
                              <textarea
                                value={editedContent[`new-bad-${pillar.id}`] || ''}
                                onChange={(e) => setEditedContent({
                                  ...editedContent,
                                  [`new-bad-${pillar.id}`]: e.target.value
                                })}
                                placeholder="Enter a key challenge or gap..."
                                style={{
                                  border: '1px solid #ef4444',
                                  borderRadius: '6px',
                                  padding: '8px',
                                  fontSize: '0.88rem',
                                  fontFamily: 'inherit',
                                  resize: 'vertical',
                                  minHeight: '60px'
                                }}
                                autoFocus
                              />
                              <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                                <button
                                  onClick={() => handleSaveNewBadItem(pillar.id)}
                                  style={{
                                    padding: '6px 12px',
                                    fontSize: '0.8rem',
                                    background: 'transparent',
                                    color: '#6b7280',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontWeight: 600
                                  }}
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setAddingBadItem(null)}
                                  style={{
                                    padding: '6px 12px',
                                    fontSize: '0.8rem',
                                    background: '#9ca3af',
                                    color: '#6b7280',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                  }}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </PillarTopRow>

                    {/* Full Width: Databricks Recommendations */}
                    <PillarFullWidth style={{
                      background: customizations.cardColors[`features-${pillar.id}`]?.bg || '#ffffff',
                      border: `2px solid ${customizations.cardColors[`features-${pillar.id}`]?.border || '#e5e7eb'}`
                    }}>
                  <PillarColumn $color={customizations.cardColors[`features-${pillar.id}`]?.text || "#1e40af"}>
                    <div className="column-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FiInfo />
                        {data.databricksFeatures && data.databricksFeatures.length > 0 ? 'Databricks Recommendations' : 'Recommendations'}
                      </div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <button
                          onClick={() => handleCardColorChange(`features-${pillar.id}`, 'bg')}
                          style={{
                            background: 'transparent',
                            color: customizations.cardColors[`features-${pillar.id}`]?.text || '#1e40af',
                            border: `1px solid ${customizations.cardColors[`features-${pillar.id}`]?.border || '#bfdbfe'}`,
                            borderRadius: '50%',
                            width: '28px',
                            height: '28px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            transition: 'all 0.2s'
                          }}
                          title="Change card color"
                          onMouseEnter={(e) => e.currentTarget.style.background = (customizations.cardColors[`features-${pillar.id}`]?.border || '#bfdbfe')}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          <FiDroplet size={14} />
                        </button>
                        {customizations.cardColors[`features-${pillar.id}`] && (
                          <button
                            onClick={() => handleResetCardColor(`features-${pillar.id}`)}
                            style={{
                              background: 'transparent',
                              color: customizations.cardColors[`features-${pillar.id}`]?.text || '#1e40af',
                              border: `1px solid ${customizations.cardColors[`features-${pillar.id}`]?.border || '#bfdbfe'}`,
                              borderRadius: '50%',
                              width: '28px',
                              height: '28px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              fontSize: '1rem',
                              transition: 'all 0.2s'
                            }}
                            title="Reset to original color"
                            onMouseEnter={(e) => e.currentTarget.style.background = (customizations.cardColors[`features-${pillar.id}`]?.border || '#bfdbfe')}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                          >
                            <FiRotateCcw size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => handleAddFeature(pillar.id)}
                          style={{
                            background: 'transparent',
                            color: '#6b7280',
                            border: '1px solid #d1d5db',
                            borderRadius: '50%',
                            width: '28px',
                            height: '28px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            lineHeight: '1'
                          }}
                          title="Add new feature"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    {data.databricksFeatures && data.databricksFeatures.length > 0 ? (
                      <div>
                        {/* Features Grid */}
                        <div style={{ 
                          display: 'grid', 
                          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                          gap: '16px',
                          marginBottom: '20px'
                        }}>
                          {data.databricksFeatures.slice(0, 8).map((feature, idx) => {
                            const featureKey = `${pillar.id}-feature-${idx}`;
                            const isEditing = editingFeature === featureKey;
                            const displayFeature = customizations.features[featureKey] !== undefined 
                              ? customizations.features[featureKey] 
                              : feature;
                            
                            // Skip deleted items
                            if (customizations.features[featureKey] === null) {
                              return null;
                            }
                            
                            return (
                            <div key={idx} style={{ 
                              background: 'white',
                              border: `1px solid ${isEditing ? '#3b82f6' : '#bfdbfe'}`,
                              borderRadius: '12px',
                              padding: '16px',
                              transition: 'all 0.2s ease',
                              cursor: isEditing ? 'default' : 'pointer'
                            }}
                            onMouseEnter={(e) => {
                              if (!isEditing) {
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.15)';
                                e.currentTarget.style.borderColor = '#3b82f6';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isEditing) {
                                e.currentTarget.style.boxShadow = 'none';
                                e.currentTarget.style.borderColor = '#bfdbfe';
                              }
                            }}>
                              {isEditing ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                  <input
                                    value={editedContent[`${featureKey}-name`] || ''}
                                    onChange={(e) => setEditedContent({
                                      ...editedContent,
                                      [`${featureKey}-name`]: e.target.value
                                    })}
                                    placeholder="Feature name"
                                    style={{
                                      fontWeight: 700,
                                      fontSize: '0.95rem',
                                      padding: '6px',
                                      border: '1px solid #3b82f6',
                                      borderRadius: '4px'
                                    }}
                                  />
                                  <textarea
                                    value={editedContent[`${featureKey}-desc`] || ''}
                                    onChange={(e) => setEditedContent({
                                      ...editedContent,
                                      [`${featureKey}-desc`]: e.target.value
                                    })}
                                    placeholder="Description"
                                    style={{
                                      fontSize: '0.8rem',
                                      padding: '6px',
                                      border: '1px solid #3b82f6',
                                      borderRadius: '4px',
                                      resize: 'vertical',
                                      minHeight: '60px',
                                      fontFamily: 'inherit'
                                    }}
                                  />
                                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                                    <button
                                      onClick={() => {
                                        setCustomizations({
                                          ...customizations,
                                          features: {
                                            ...customizations.features,
                                            [featureKey]: {
                                              name: editedContent[`${featureKey}-name`],
                                              description: editedContent[`${featureKey}-desc`],
                                              releaseDate: feature.releaseDate,
                                              docs: feature.docs
                                            }
                                          }
                                        });
                                        setEditingFeature(null);
                                        
                                      }}
                                      style={{
                                        padding: '4px 12px',
                                        fontSize: '0.75rem',
                                        background: 'transparent',
                                        color: '#6b7280',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                      }}
                                    >
                                      Save
                                    </button>
                                    <button
                                      onClick={() => setEditingFeature(null)}
                                      style={{
                                        padding: '4px 12px',
                                        fontSize: '0.75rem',
                                        background: '#9ca3af',
                                        color: '#6b7280',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                      }}
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <div style={{ 
                                    fontWeight: 700, 
                                    color: '#1e40af', 
                                    marginBottom: '6px',
                                    fontSize: '0.95rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: '6px'
                                  }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                      <span style={{ fontSize: '1.1rem' }}>📦</span> {displayFeature.name}
                                    </div>
                                    <div style={{ display: 'flex', gap: '4px' }}>
                                      <button
                                        onClick={() => {
                                          setEditingFeature(featureKey);
                                          setEditedContent({
                                            ...editedContent,
                                            [`${featureKey}-name`]: displayFeature.name,
                                            [`${featureKey}-desc`]: displayFeature.description
                                          });
                                        }}
                                        style={{
                                          padding: '6px',
                                          background: 'transparent',
                                          color: '#6b7280',
                                          border: '1px solid #d1d5db',
                                          borderRadius: '4px',
                                          cursor: 'pointer',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center'
                                        }}
                                        title="Edit"
                                      >
                                        <FiEdit3 size={14} />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteFeature(pillar.id, idx)}
                                        style={{
                                          padding: '6px',
                                          background: 'transparent',
                                          color: '#6b7280',
                                          border: '1px solid #d1d5db',
                                          borderRadius: '4px',
                                          cursor: 'pointer',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center'
                                        }}
                                        title="Delete"
                                      >
                                        <FiTrash2 size={14} />
                                      </button>
                                    </div>
                                  </div>
                                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '8px', lineHeight: '1.4' }}>
                                    {displayFeature.description}
                                  </div>
                                  {/* 🔥 ALWAYS Show WHY this feature is recommended */}
                                  <div style={{ 
                                    fontSize: '0.75rem', 
                                    color: '#f59e0b', 
                                    background: '#fef3c7',
                                    padding: '8px 12px',
                                    borderRadius: '6px',
                                    marginBottom: '8px',
                                    fontStyle: 'italic',
                                    borderLeft: '3px solid #f59e0b'
                                  }}>
                                    {displayFeature.reason || `Helps address: Poor environment isolation`}
                                  </div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem' }}>
                                    {displayFeature.releaseDate && (
                                      <span style={{ color: '#10b981', fontWeight: 600 }}>
                                        {displayFeature.releaseDate}
                                      </span>
                                    )}
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                          )}
                          
                          {/* Render newly added features */}
                          {customizations.newFeatures[pillar.id] && customizations.newFeatures[pillar.id].map((newFeature, idx) => {
                            const featureKey = `${pillar.id}-new-feature-${idx}`;
                            const isEditing = editingNewFeature === featureKey;
                            
                            return (
                            <div key={`new-${idx}`} style={{ 
                              background: 'white',
                              border: `2px solid ${isEditing ? '#3b82f6' : '#bfdbfe'}`,
                              borderRadius: '12px',
                              padding: '16px',
                              transition: 'all 0.2s ease'
                            }}>
                              {isEditing ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                  <input
                                    value={editedContent[`${featureKey}-name`] || ''}
                                    onChange={(e) => setEditedContent({
                                      ...editedContent,
                                      [`${featureKey}-name`]: e.target.value
                                    })}
                                    placeholder="Feature name"
                                    style={{
                                      fontWeight: 700,
                                      fontSize: '0.95rem',
                                      padding: '8px',
                                      border: '1px solid #3b82f6',
                                      borderRadius: '6px',
                                      fontFamily: 'inherit'
                                    }}
                                  />
                                  <textarea
                                    value={editedContent[`${featureKey}-desc`] || ''}
                                    onChange={(e) => setEditedContent({
                                      ...editedContent,
                                      [`${featureKey}-desc`]: e.target.value
                                    })}
                                    placeholder="Feature description"
                                    style={{
                                      fontSize: '0.85rem',
                                      padding: '8px',
                                      border: '1px solid #3b82f6',
                                      borderRadius: '6px',
                                      resize: 'vertical',
                                      minHeight: '60px',
                                      fontFamily: 'inherit'
                                    }}
                                  />
                                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                                    <button
                                      onClick={() => handleSaveNewFeature(pillar.id, idx)}
                                      style={{
                                        padding: '6px 14px',
                                        fontSize: '0.8rem',
                                        background: 'transparent',
                                        color: '#6b7280',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontWeight: 600
                                      }}
                                    >
                                      Save
                                    </button>
                                    <button
                                      onClick={() => setEditingNewFeature(null)}
                                      style={{
                                        padding: '6px 14px',
                                        fontSize: '0.8rem',
                                        background: '#9ca3af',
                                        color: '#6b7280',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                      }}
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <div style={{ 
                                    fontWeight: 700, 
                                    color: '#1e40af', 
                                    marginBottom: '6px',
                                    fontSize: '0.95rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: '6px'
                                  }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                      <span style={{ fontSize: '1.1rem' }}>📦</span> {newFeature.name}
                                    </div>
                                    <div style={{ display: 'flex', gap: '4px' }}>
                                      <button
                                        onClick={() => handleEditNewFeature(pillar.id, idx, newFeature)}
                                        style={{
                                          padding: '3px 8px',
                                          fontSize: '0.7rem',
                                          background: 'transparent',
                                          color: '#6b7280',
                                          border: '1px solid #d1d5db',
                                          borderRadius: '4px',
                                          cursor: 'pointer'
                                        }}
                                      >
                                      <FiEdit3 size={14} />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteNewFeature(pillar.id, idx)}
                                        style={{
                                          padding: '3px 8px',
                                          fontSize: '0.7rem',
                                          background: 'transparent',
                                          color: '#6b7280',
                                          border: '1px solid #d1d5db',
                                          borderRadius: '4px',
                                          cursor: 'pointer'
                                        }}
                                      >
                                      <FiTrash2 size={14} />
                                      </button>
                                    </div>
                                  </div>
                                  {newFeature.description && (
                                    <div style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: '1.4' }}>
                                      {newFeature.description}
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          )}
                          )}
                          
                          {/* Form for adding new feature */}
                          {addingFeature === pillar.id && (
                            <div style={{ 
                              background: 'white',
                              border: '2px solid #3b82f6',
                              borderRadius: '12px',
                              padding: '16px',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '12px'
                            }}>
                              <input
                                value={editedContent[`new-feature-${pillar.id}-name`] || ''}
                                onChange={(e) => setEditedContent({
                                  ...editedContent,
                                  [`new-feature-${pillar.id}-name`]: e.target.value
                                })}
                                placeholder="Feature name (e.g., Unity Catalog)"
                                style={{
                                  fontWeight: 700,
                                  fontSize: '0.95rem',
                                  padding: '8px',
                                  border: '1px solid #3b82f6',
                                  borderRadius: '6px',
                                  fontFamily: 'inherit'
                                }}
                                autoFocus
                              />
                              <textarea
                                value={editedContent[`new-feature-${pillar.id}-desc`] || ''}
                                onChange={(e) => setEditedContent({
                                  ...editedContent,
                                  [`new-feature-${pillar.id}-desc`]: e.target.value
                                })}
                                placeholder="Feature description (optional)"
                                style={{
                                  fontSize: '0.85rem',
                                  padding: '8px',
                                  border: '1px solid #3b82f6',
                                  borderRadius: '6px',
                                  resize: 'vertical',
                                  minHeight: '60px',
                                  fontFamily: 'inherit'
                                }}
                              />
                              <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                                <button
                                  onClick={() => handleSaveAddedFeature(pillar.id)}
                                  style={{
                                    padding: '6px 14px',
                                    fontSize: '0.8rem',
                                    background: 'transparent',
                                    color: '#6b7280',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontWeight: 600
                                  }}
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setAddingFeature(null)}
                                  style={{
                                    padding: '6px 14px',
                                    fontSize: '0.8rem',
                                    background: '#9ca3af',
                                    color: '#6b7280',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                  }}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <ul>
                        {data.recommendations.length > 0 ? (
                          data.recommendations.slice(0, 4).map((item, idx) => (
                            <li key={idx}>{getRecommendationText(item)}</li>
                          ))
                        ) : (
                          <li>
                            No recommendations generated. 
                            <button 
                              onClick={() => window.location.reload()} 
                              style={{ 
                                marginLeft: '8px', 
                                padding: '4px 12px', 
                                background: '#10b981', 
                                color: 'white', 
                                border: 'none', 
                                borderRadius: '4px', 
                                cursor: 'pointer',
                                fontSize: '0.85rem'
                              }}
                            >
                              Click Refresh button above or reload page
                            </button>
                          </li>
                        )}
                      </ul>
                    )}
                    {data.databricksSource && (
                      <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px solid #e5e7eb', fontSize: '0.7rem', color: '#9ca3af', fontStyle: 'italic' }}>
                        Source: {data.databricksSource}
                      </div>
                    )}
                  </PillarColumn>
                    </PillarFullWidth>
                    
                    {/* Next Steps - Separate Card Below Recommendations */}
                    {((data.nextSteps && data.nextSteps.length > 0) || (data.specificRecommendations && data.specificRecommendations.length > 0)) && (
                      <div style={{ 
                        marginTop: '16px',
                        background: customizations.cardColors[`nextSteps-${pillar.id}`]?.bg || '#ffffff',
                        borderRadius: '16px',
                        padding: '24px',
                        border: `2px solid ${customizations.cardColors[`nextSteps-${pillar.id}`]?.border || '#e5e7eb'}`
                      }}>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between',
                          marginBottom: '16px',
                          color: customizations.cardColors[`nextSteps-${pillar.id}`]?.text || '#92400e',
                          fontSize: '0.95rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '1.2rem' }}>🎯</span>
                            Next Steps
                          </div>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <button
                              onClick={() => handleCardColorChange(`nextSteps-${pillar.id}`, 'bg')}
                              style={{
                                background: 'transparent',
                                color: customizations.cardColors[`nextSteps-${pillar.id}`]?.text || '#92400e',
                                border: `1px solid ${customizations.cardColors[`nextSteps-${pillar.id}`]?.border || '#fcd34d'}`,
                                borderRadius: '50%',
                                width: '28px',
                                height: '28px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                transition: 'all 0.2s'
                              }}
                              title="Change card color"
                              onMouseEnter={(e) => e.currentTarget.style.background = (customizations.cardColors[`nextSteps-${pillar.id}`]?.border || '#fcd34d')}
                              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                              <FiDroplet size={14} />
                            </button>
                            {customizations.cardColors[`nextSteps-${pillar.id}`] && (
                              <button
                                onClick={() => handleResetCardColor(`nextSteps-${pillar.id}`)}
                                style={{
                                  background: 'transparent',
                                  color: customizations.cardColors[`nextSteps-${pillar.id}`]?.text || '#92400e',
                                  border: `1px solid ${customizations.cardColors[`nextSteps-${pillar.id}`]?.border || '#fcd34d'}`,
                                  borderRadius: '50%',
                                  width: '28px',
                                  height: '28px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: 'pointer',
                                  fontSize: '1rem',
                                  transition: 'all 0.2s'
                                }}
                                title="Reset to original color"
                                onMouseEnter={(e) => e.currentTarget.style.background = (customizations.cardColors[`nextSteps-${pillar.id}`]?.border || '#fcd34d')}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                              >
                                <FiRotateCcw size={14} />
                              </button>
                            )}
                            <button
                              onClick={() => handleAddNextStep(pillar.id)}
                              style={{
                                background: 'transparent',
                                color: '#6b7280',
                                border: '1px solid #d1d5db',
                                borderRadius: '50%',
                                width: '28px',
                                height: '28px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                fontSize: '1.2rem',
                                fontWeight: 'bold',
                                lineHeight: '1'
                              }}
                              title="Add new next step"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div style={{ 
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '12px'
                        }}>
                          {(data.nextSteps || data.specificRecommendations || []).slice(0, 4).map((rec, idx) => {
                            const stepKey = `${pillar.id}-${idx}`;
                            const isEditing = editingNextStep === stepKey;
                            const displayStep = customizations.nextSteps[stepKey] !== undefined 
                              ? customizations.nextSteps[stepKey] 
                              : rec;
                            
                            // Skip deleted items
                            if (customizations.nextSteps[stepKey] === null) {
                              return null;
                            }
                            
                            return (
                            <div key={idx} style={{ 
                              background: 'white',
                              border: `1px solid ${isEditing ? '#f59e0b' : '#fcd34d'}`,
                              borderRadius: '10px',
                              padding: '14px 16px',
                              fontSize: '0.87rem',
                              color: '#78350f',
                              lineHeight: '1.6',
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '12px',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                              if (!isEditing) {
                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(251, 191, 36, 0.2)';
                                e.currentTarget.style.borderColor = '#fbbf24';
                                e.currentTarget.style.transform = 'translateX(4px)';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isEditing) {
                                e.currentTarget.style.boxShadow = 'none';
                                e.currentTarget.style.borderColor = '#fcd34d';
                                e.currentTarget.style.transform = 'translateX(0)';
                              }
                            }}>
                              <span style={{ 
                                color: '#f59e0b', 
                                fontWeight: 700,
                                fontSize: '1.3rem',
                                lineHeight: '1',
                                flexShrink: 0,
                                marginTop: '-2px'
                              }}>→</span>
                              {isEditing ? (
                                <textarea
                                  value={editedContent[stepKey] || ''}
                                  onChange={(e) => setEditedContent({
                                    ...editedContent,
                                    [stepKey]: e.target.value
                                  })}
                                  style={{
                                    flex: 1,
                                    border: '1px solid #f59e0b',
                                    borderRadius: '6px',
                                    padding: '8px',
                                    fontSize: '0.87rem',
                                    fontFamily: 'inherit',
                                    resize: 'vertical',
                                    minHeight: '60px',
                                    color: '#78350f'
                                  }}
                                />
                              ) : (
                                <span style={{ flex: 1 }}>{displayStep}</span>
                              )}
                              <div style={{ display: 'flex', gap: '4px', marginLeft: 'auto', flexShrink: 0 }}>
                                {isEditing ? (
                                  <>
                                    <button
                                      onClick={() => {
                                        setCustomizations({
                                          ...customizations,
                                          nextSteps: {
                                            ...customizations.nextSteps,
                                            [stepKey]: editedContent[stepKey]
                                          }
                                        });
                                        setEditingNextStep(null);
                                        
                                      }}
                                      style={{
                                        padding: '4px 8px',
                                        fontSize: '0.75rem',
                                        background: 'transparent',
                                        color: '#6b7280',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                      }}
                                    >
                                      Save
                                    </button>
                                    <button
                                      onClick={() => setEditingNextStep(null)}
                                      style={{
                                        padding: '4px 8px',
                                        fontSize: '0.75rem',
                                        background: '#9ca3af',
                                        color: '#6b7280',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                      }}
                                    >
                                      Cancel
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      onClick={() => {
                                        setEditingNextStep(stepKey);
                                        setEditedContent({
                                          ...editedContent,
                                          [stepKey]: displayStep
                                        });
                                      }}
                                      style={{
                                        padding: '6px',
                                        background: 'transparent',
                                        color: '#6b7280',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                      }}
                                      title="Edit"
                                    >
                                      <FiEdit3 size={14} />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteNextStep(pillar.id, idx)}
                                      style={{
                                        padding: '6px',
                                        background: 'transparent',
                                        color: '#6b7280',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                      }}
                                      title="Delete"
                                    >
                                      <FiTrash2 size={14} />
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          )}
                          )}
                          
                          {/* Render newly added next steps */}
                          {customizations.newNextSteps[pillar.id] && customizations.newNextSteps[pillar.id].map((newStep, idx) => {
                            const stepKey = `${pillar.id}-new-step-${idx}`;
                            const isEditing = editingNewNextStep === stepKey;
                            
                            return (
                            <div key={`new-${idx}`} style={{ 
                              background: 'white',
                              border: `2px solid ${isEditing ? '#f59e0b' : '#fcd34d'}`,
                              borderRadius: '10px',
                              padding: '14px 16px',
                              fontSize: '0.87rem',
                              color: '#78350f',
                              lineHeight: '1.6',
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '12px'
                            }}>
                              <span style={{ 
                                color: '#f59e0b', 
                                fontWeight: 700,
                                fontSize: '1.3rem',
                                lineHeight: '1',
                                flexShrink: 0,
                                marginTop: '-2px'
                              }}>→</span>
                              {isEditing ? (
                                <textarea
                                  value={editedContent[stepKey] || ''}
                                  onChange={(e) => setEditedContent({
                                    ...editedContent,
                                    [stepKey]: e.target.value
                                  })}
                                  style={{
                                    flex: 1,
                                    border: '1px solid #f59e0b',
                                    borderRadius: '6px',
                                    padding: '8px',
                                    fontSize: '0.87rem',
                                    fontFamily: 'inherit',
                                    resize: 'vertical',
                                    minHeight: '60px'
                                  }}
                                />
                              ) : (
                                <span style={{ flex: 1 }}>{newStep}</span>
                              )}
                              <div style={{ display: 'flex', gap: '4px', marginLeft: 'auto' }}>
                                {isEditing ? (
                                  <>
                                    <button
                                      onClick={() => handleSaveNewNextStep(pillar.id, idx)}
                                      style={{
                                        padding: '4px 8px',
                                        fontSize: '0.75rem',
                                        background: 'transparent',
                                        color: '#6b7280',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontWeight: 600
                                      }}
                                    >
                                      Save
                                    </button>
                                    <button
                                      onClick={() => setEditingNewNextStep(null)}
                                      style={{
                                        padding: '4px 8px',
                                        fontSize: '0.75rem',
                                        background: '#9ca3af',
                                        color: '#6b7280',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                      }}
                                    >
                                      Cancel
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      onClick={() => handleEditNewNextStep(pillar.id, idx, newStep)}
                                      style={{
                                        padding: '6px',
                                        fontSize: '0.75rem',
                                        background: 'transparent',
                                        color: '#6b7280',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                      }}
                                    >
                                      <FiEdit3 size={14} />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteNewNextStep(pillar.id, idx)}
                                      style={{
                                        padding: '6px',
                                        fontSize: '0.75rem',
                                        background: 'transparent',
                                        color: '#6b7280',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                      }}
                                    >
                                      <FiTrash2 size={14} />
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          )}
                          )}
                          
                          {/* Form for adding new next step */}
                          {addingNextStep === pillar.id && (
                            <div style={{ 
                              background: 'white',
                              border: '2px solid #f59e0b',
                              borderRadius: '10px',
                              padding: '14px 16px',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '10px'
                            }}>
                              <textarea
                                value={editedContent[`new-nextstep-${pillar.id}`] || ''}
                                onChange={(e) => setEditedContent({
                                  ...editedContent,
                                  [`new-nextstep-${pillar.id}`]: e.target.value
                                })}
                                placeholder="Enter a next step or action item..."
                                style={{
                                  border: '1px solid #f59e0b',
                                  borderRadius: '6px',
                                  padding: '8px',
                                  fontSize: '0.87rem',
                                  fontFamily: 'inherit',
                                  resize: 'vertical',
                                  minHeight: '60px',
                                  color: '#78350f'
                                }}
                                autoFocus
                              />
                              <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                                <button
                                  onClick={() => handleSaveAddedNextStep(pillar.id)}
                                  style={{
                                    padding: '6px 12px',
                                    fontSize: '0.8rem',
                                    background: 'transparent',
                                    color: '#6b7280',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontWeight: 600
                                  }}
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setAddingNextStep(null)}
                                  style={{
                                    padding: '6px 12px',
                                    fontSize: '0.8rem',
                                    background: '#9ca3af',
                                    color: '#6b7280',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                  }}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                </PillarBody>
                )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </PillarSection>
            );
          })}
          </SectionCard>


        </ReportBody>
          </>
        )}
        {/* End of conditional results rendering */}
      </ReportContainer>

      {/* Footer */}
      <Footer />

      {/* 🎬 Presentation Slideshow Overlay */}
      <AnimatePresence>
        {presentationMode && results && (
          <SlideContainer
            className="slideshow-single-slide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ClickArea $direction="left" onClick={previousSlide} data-hide-on-print="true" />
            <ClickArea $direction="right" onClick={nextSlide} data-hide-on-print="true" />
            
            {/* Navigation Buttons - Show on hover */}
            <NavigationButton
              $direction="left"
              onClick={previousSlide}
              disabled={currentSlide === 0}
              whileTap={{ scale: 0.9 }}
              data-hide-on-print="true"
            >
              ←
            </NavigationButton>
            
            <NavigationButton
              $direction="right"
              onClick={nextSlide}
              whileTap={{ scale: 0.9 }}
              data-hide-on-print="true"
            >
              →
            </NavigationButton>
            
            <SlideHeading>
              {currentSlide === 0 || currentSlide === 21 ? '' : 
               currentSlide === 1 ? 'Maturity Snapshot by Pillar' : (() => {
                const pillarsArray = [
                  { id: 'platform_governance', name: 'Platform & Governance' },
                  { id: 'data_engineering', name: 'Data Engineering & Integration' },
                  { id: 'analytics_bi', name: 'Analytics & BI Modernization' },
                  { id: 'machine_learning', name: 'Machine Learning & MLOps' },
                  { id: 'generative_ai', name: 'Generative AI & Agentic Capabilities' },
                  { id: 'operational_excellence', name: 'Operational Excellence & Adoption' }
                ];
                // Slides 2-19: 6 pillars x 3 slides each (title, maturity chart, recommendations/next steps)
                if (currentSlide >= 2 && currentSlide <= 19) {
                  const pillarIndex = Math.floor((currentSlide - 2) / 3);
                  const slideType = (currentSlide - 2) % 3; // 0=title, 1=chart, 2=recommendations
                  const pillarName = pillarsArray[pillarIndex]?.name || '';
                  // Hide heading for pillar title slides
                  return slideType === 0 ? '' : pillarName;
                }
                return '';
              })()}
            </SlideHeading>
            <SlideCounter data-hide-on-print="true">{currentSlide + 1} / 22</SlideCounter>

            {/* Print Button - Always visible on hover */}
            <PrintButton
              onClick={(e) => {
                e.stopPropagation();
                handlePrintSlideshow();
              }}
              whileTap={{ scale: 0.9 }}
              title="Print all 20 slides"
              data-hide-on-print="true"
            >
              <FiPrinter />
            </PrintButton>

            {/* Exit Button - Shows on hover on all slides */}
              <ExitButton
                onClick={(e) => {
                  e.stopPropagation();
                  exitPresentation();
                }}
                whileTap={{ scale: 0.9 }}
              data-hide-on-print="true"
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
                >
                  {/* Title Slide - Cool Graphics */}
                  {currentSlide === 0 && (
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '100%',
                      textAlign: 'center',
                      gap: '40px',
                      padding: '0 80px'
                    }}>
                      <div style={{
                        fontSize: '6rem',
                        marginBottom: '20px',
                        filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.3))'
                      }}>
                        📊
                      </div>
                      <div style={{
                        fontSize: '4.5rem',
                        fontWeight: 900,
                        color: 'white',
                        marginBottom: '20px',
                        textShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                        letterSpacing: '-0.02em',
                        lineHeight: '1.2'
                      }}>
                        Enterprise Data & AI<br/>Maturity Report
                      </div>
                      <div style={{
                        fontSize: '2rem',
                        fontWeight: 400,
                        color: 'rgba(255, 255, 255, 0.9)',
                        lineHeight: '1.6'
                      }}>
                        Prepared for {results.assessmentInfo?.organizationName || 'Your Organization'}
                      </div>
                      <div style={{
                        fontSize: '1.5rem',
                        fontWeight: 400,
                        color: 'rgba(255, 255, 255, 0.7)',
                        marginTop: '20px'
                      }}>
                        {new Date(results.assessmentInfo?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </div>
                    </div>
                  )}

                  {/* Slide 1: Maturity Snapshot with Cards */}
                  {currentSlide === 1 && (
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                      padding: '45px 60px 35px 60px',
                      gap: '24px',
                      justifyContent: 'space-between'
                    }}>
                      {/* Three Cards Section - Top */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '24px',
                        flexShrink: 0
                      }}>
                      {/* Current Maturity Card */}
                      <div style={{
                          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0.12) 100%)',
                          backdropFilter: 'blur(10px)',
                          border: '2px solid rgba(255, 255, 255, 0.3)',
                          borderRadius: '16px',
                          padding: '20px 24px',
                        display: 'flex',
                        flexDirection: 'column',
                          gap: '10px',
                          overflow: 'hidden',
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)'
                      }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.4) 0%, rgba(59, 130, 246, 0.25) 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                            fontSize: '1.5rem',
                            marginBottom: '4px',
                            flexShrink: 0,
                            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                        }}>
                          🎯
                        </div>
                        <div style={{
                            fontSize: '0.85rem',
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontWeight: 600,
                          textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            flexShrink: 0
                        }}>
                            CURRENT MATURITY
                        </div>
                        <div style={{
                            fontSize: '1.7rem',
                            fontWeight: 900,
                            color: 'white',
                            lineHeight: '1.2',
                            flexShrink: 0,
                            textShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                          }}>
                            Level {currentMaturity} — {resultsData?.maturitySummary?.current?.level || 'Experiment'}
                        </div>
                        <div style={{
                            fontSize: '0.9rem',
                            color: 'rgba(255, 255, 255, 0.8)',
                            lineHeight: '1.5',
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            textOverflow: 'ellipsis'
                          }}>
                            {(resultsData?.maturitySummary?.current?.description || 
                             'Positioned to accelerate Data and GenAI capabilities through automation and modernization').slice(0, 130)}
                        </div>
                      </div>

                      {/* Target Maturity Card */}
                      <div style={{
                          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0.12) 100%)',
                          backdropFilter: 'blur(10px)',
                          border: '2px solid rgba(255, 255, 255, 0.3)',
                          borderRadius: '16px',
                          padding: '20px 24px',
                        display: 'flex',
                        flexDirection: 'column',
                          gap: '10px',
                          overflow: 'hidden',
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)'
                      }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.4) 0%, rgba(16, 185, 129, 0.25) 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                            fontSize: '1.5rem',
                            marginBottom: '4px',
                            flexShrink: 0,
                            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                        }}>
                          📈
                        </div>
                        <div style={{
                            fontSize: '0.85rem',
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontWeight: 600,
                          textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            flexShrink: 0
                        }}>
                            TARGET MATURITY
                        </div>
                        <div style={{
                            fontSize: '1.7rem',
                            fontWeight: 900,
                            color: 'white',
                            lineHeight: '1.2',
                            flexShrink: 0,
                            textShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                          }}>
                            Level {targetMaturity} — {resultsData?.maturitySummary?.target?.level || 'Optimize'}
                        </div>
                        <div style={{
                            fontSize: '0.9rem',
                            color: 'rgba(255, 255, 255, 0.8)',
                            lineHeight: '1.5',
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            textOverflow: 'ellipsis'
                          }}>
                            {(resultsData?.maturitySummary?.target?.description || 
                             'Advanced capabilities in Analytics self-service analytics accelerating decision velocity').slice(0, 130)}
                        </div>
                      </div>

                      {/* Improvement Potential Card */}
                      <div style={{
                          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0.12) 100%)',
                          backdropFilter: 'blur(10px)',
                          border: '2px solid rgba(255, 255, 255, 0.3)',
                          borderRadius: '16px',
                          padding: '20px 24px',
                        display: 'flex',
                        flexDirection: 'column',
                          gap: '10px',
                          overflow: 'hidden',
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)'
                      }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.4) 0%, rgba(245, 158, 11, 0.25) 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                            fontSize: '1.5rem',
                            marginBottom: '4px',
                            flexShrink: 0,
                            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
                        }}>
                          ⚡
                        </div>
                        <div style={{
                            fontSize: '0.85rem',
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontWeight: 600,
                          textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            flexShrink: 0
                        }}>
                            IMPROVEMENT POTENTIAL
                        </div>
                        <div style={{
                            fontSize: '1.7rem',
                            fontWeight: 900,
                            color: 'white',
                            lineHeight: '1.2',
                            flexShrink: 0,
                            textShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                        }}>
                          +{improvementLevel} Level
                        </div>
                        <div style={{
                            fontSize: '0.9rem',
                            color: 'rgba(255, 255, 255, 0.8)',
                            lineHeight: '1.5',
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            textOverflow: 'ellipsis'
                          }}>
                            {(resultsData?.maturitySummary?.improvement?.description || 
                             'Implement self-service analytics and real-time insights, ML automation and lifecycle management').slice(0, 130)}
                        </div>
                        </div>
                      </div>

                      {/* Maturity Snapshot Chart - Below Cards */}
                      {(() => {
                    const pillarsArray = [
                      { id: 'platform_governance', name: 'Platform & Governance', icon: '🧱', color: '#3b82f6' },
                      { id: 'data_engineering', name: 'Data Engineering & Integration', icon: '💾', color: '#ef4444' },
                      { id: 'analytics_bi', name: 'Analytics & BI Modernization', icon: '📈', color: '#10b981' },
                      { id: 'machine_learning', name: 'Machine Learning & MLOps', icon: '🤖', color: '#f59e0b' },
                      { id: 'generative_ai', name: 'Generative AI & Agentic Capabilities', icon: '💡', color: '#8b5cf6' },
                      { id: 'operational_excellence', name: 'Operational Excellence & Adoption', icon: '⚙️', color: '#06b6d4' }
                    ];
                    
                    const resultsData = results?.data || results;
                    
                    return (
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        paddingTop: '10px',
                        paddingBottom: '10px',
                        maxWidth: '1400px',
                        margin: '0 auto',
                        width: '100%'
                      }}>
                        {/* Legend */}
                        <div style={{
                          display: 'flex',
                          justifyContent: 'center',
                          gap: '32px',
                          marginBottom: '8px'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ 
                              width: 18, 
                              height: 18, 
                              borderRadius: 5, 
                              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', 
                              boxShadow: '0 3px 10px rgba(59, 130, 246, 0.4)'
                            }} />
                            <span style={{ fontSize: '1.05rem', color: 'white', fontWeight: 700, textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)' }}>Today</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ 
                              width: 18, 
                              height: 18, 
                              borderRadius: 5, 
                              background: 'transparent', 
                              border: '2.5px solid #10b981',
                              boxShadow: '0 3px 10px rgba(16, 185, 129, 0.3)'
                            }} />
                            <span style={{ fontSize: '1.05rem', color: 'white', fontWeight: 700, textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)' }}>Tomorrow</span>
                          </div>
                        </div>

                        {/* 3x2 Grid of Pillars */}
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(2, 1fr)',
                          gap: '14px',
                          padding: '0 30px'
                        }}>
                        {pillarsArray.map((pillar) => {
                            const categoryData = resultsData?.categoryDetails?.[pillar.id] || {};
                            const currentScore = (categoryData.currentScore || categoryData.score || 0).toFixed(1);
                            const futureScore = (categoryData.futureScore || categoryData.currentScore || categoryData.score || 0).toFixed(1);
                          
                          return (
                              <div key={pillar.id} style={{
                                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.92) 100%)',
                                borderRadius: '12px',
                                padding: '12px 16px',
                                borderLeft: `3px solid ${pillar.color}`,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px',
                                boxShadow: `0 3px 12px ${pillar.color}20`,
                                transition: 'all 0.3s ease'
                              }}>
                                {/* Pillar Header */}
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                  gap: '10px'
                                }}>
                                  <span style={{ fontSize: '1.3rem', filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))' }}>{pillar.icon}</span>
                                  <span style={{
                                    fontSize: '0.85rem',
                                    fontWeight: 700,
                                    color: pillar.color,
                                    flex: 1,
                                    lineHeight: '1.3'
                                  }}>
                                    {pillar.name}
                                  </span>
                                </div>

                                {/* Scores Container */}
                                <div style={{
                                  display: 'flex',
                                gap: '12px',
                                  justifyContent: 'space-around'
                                }}>
                                  {/* Today Score */}
                                  <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '6px'
                                  }}>
                                    <div style={{
                                      fontSize: '0.6rem',
                                fontWeight: 700,
                                      color: '#64748b',
                                      textTransform: 'uppercase',
                                      letterSpacing: '0.6px'
                              }}>
                                      TODAY
                              </div>
                                <div style={{
                                      background: `linear-gradient(135deg, ${pillar.color} 0%, ${pillar.color}dd 100%)`,
                                      color: 'white',
                                      padding: '6px 14px',
                                  borderRadius: '7px',
                                      fontSize: '1.1rem',
                                      fontWeight: 800,
                                      minWidth: '55px',
                                      textAlign: 'center',
                                      boxShadow: `0 3px 10px ${pillar.color}40`
                                    }}>
                                      {currentScore}
                                    </div>
                                  </div>

                                  {/* Tomorrow Score */}
                                  <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '6px'
                                  }}>
                                    <div style={{
                                      fontSize: '0.6rem',
                                      fontWeight: 700,
                                      color: '#64748b',
                                      textTransform: 'uppercase',
                                      letterSpacing: '0.6px'
                                    }}>
                                      TOMORROW
                                </div>
                                <div style={{
                                  background: 'white',
                                      color: pillar.color,
                                      padding: '6px 14px',
                                  borderRadius: '7px',
                                      fontSize: '1.1rem',
                                  fontWeight: 800,
                                      border: `2.5px solid ${pillar.color}`,
                                      minWidth: '55px',
                                      textAlign: 'center',
                                      boxShadow: `0 3px 10px ${pillar.color}30`
                                }}>
                                      {futureScore}
                                    </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        </div>
                      </div>
                    );
                  })()}
                    </div>
                  )}

                  {/* Pillar Title Slides (Slides 2,5,8,11,14,17) - Pillar Introduction */}
                  {currentSlide >= 2 && currentSlide <= 19 && (currentSlide - 2) % 3 === 0 && (() => {
                    const pillarsArray = [
                      { id: 'platform_governance', name: 'Platform & Governance', icon: '🧱', color: '#3b82f6', emoji: '🏛️' },
                      { id: 'data_engineering', name: 'Data Engineering & Integration', icon: '💾', color: '#10b981', emoji: '🔄' },
                      { id: 'analytics_bi', name: 'Analytics & BI Modernization', icon: '📈', color: '#ec4899', emoji: '📊' },
                      { id: 'machine_learning', name: 'Machine Learning & MLOps', icon: '🤖', color: '#f59e0b', emoji: '🧠' },
                      { id: 'generative_ai', name: 'Generative AI & Agentic Capabilities', icon: '💡', color: '#8b5cf6', emoji: '✨' },
                      { id: 'operational_excellence', name: 'Operational Excellence & Adoption', icon: '⚙️', color: '#06b6d4', emoji: '🎯' }
                    ];
                    const pillarIndex = Math.floor((currentSlide - 2) / 3);
                    const pillar = pillarsArray[pillarIndex];
                    if (!pillar) return null;
                    
                    return (
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        textAlign: 'center',
                        gap: '40px',
                        padding: '0 80px'
                      }}>
                        <div style={{
                          fontSize: '8rem',
                          marginBottom: '20px',
                          filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.3))'
                        }}>
                          {pillar.emoji}
                        </div>
                        <div style={{
                          fontSize: '4rem',
                          fontWeight: 900,
                          color: 'white',
                          marginBottom: '20px',
                          textShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                          letterSpacing: '-0.02em',
                          lineHeight: '1.2'
                        }}>
                          {pillar.name}
                        </div>
                        <div style={{
                          width: '200px',
                          height: '6px',
                          background: `linear-gradient(90deg, transparent, ${pillar.color}, transparent)`,
                          borderRadius: '3px',
                          boxShadow: `0 4px 12px ${pillar.color}60`
                        }} />
                      </div>
                    );
                  })()}

                  {/* Pillar Overview Slides (Slides 4,7,10,13,16,19) - Key Recommendations & Next Steps */}
                  {currentSlide >= 2 && currentSlide <= 19 && (currentSlide - 2) % 3 === 2 && (() => {
                    const pillarsArray = [
                      { id: 'platform_governance', name: 'Platform & Governance', color: '#3b82f6' },
                      { id: 'data_engineering', name: 'Data Engineering & Integration', color: '#10b981' },
                      { id: 'analytics_bi', name: 'Analytics & BI Modernization', color: '#ec4899' },
                      { id: 'machine_learning', name: 'Machine Learning & MLOps', color: '#f59e0b' },
                      { id: 'generative_ai', name: 'Generative AI & Agentic Capabilities', color: '#8b5cf6' },
                      { id: 'operational_excellence', name: 'Operational Excellence & Adoption', color: '#06b6d4' }
                    ];
                    const pillarIndex = Math.floor((currentSlide - 2) / 3);
                    const pillarDef = pillarsArray[pillarIndex];
                    if (!pillarDef) return null;
                    
                    // Get pillar data from results using the same logic as getPillarData
                    const resultsData = results?.data || results;
                    const categoryData = resultsData?.categoryDetails?.[pillarDef.id];
                    
                    // Get prioritizedActions for this pillar (contains theGood/theBad)
                    const prioritized = Array.isArray(resultsData?.prioritizedActions) 
                      ? resultsData.prioritizedActions.find(pa => pa.area === pillarDef.id || pa.pillar === pillarDef.id || pa.pillarId === pillarDef.id)
                      : null;
                    
                    // Calculate maturity level from score
                    const score = categoryData?.score || 0;
                    const getMaturityLevel = (score) => {
                      if (score === 0) return 'Not Assessed';
                      if (score < 1.5) return 'Explore';
                      if (score < 2.5) return 'Experiment';
                      if (score < 3.5) return 'Formalize';
                      if (score < 4.5) return 'Optimize';
                      return 'Transform';
                    };
                    
                    // Get full pillar data using getPillarData (same as main report)
                    const pillarData = getPillarData(pillarDef.id);
                    console.log(`[Slideshow] Pillar data for ${pillarDef.id}:`, pillarData);
                    
                    const pillar = {
                      ...pillarDef,
                      score: score,
                      maturityLevel: getMaturityLevel(score),
                      recommendations: pillarData?.databricksFeatures || pillarData?.recommendations || [],
                      good: pillarData?.theGood || [],
                      bad: pillarData?.theBad || [],
                      nextSteps: pillarData?.specificRecommendations || pillarData?.nextSteps || []
                    };
                    
                    console.log(`[Slideshow] Pillar ${pillarDef.id} recommendations:`, pillar.recommendations?.length || 0);
                    console.log(`[Slideshow] Pillar ${pillarDef.id} nextSteps:`, pillar.nextSteps?.length || 0);
                    
                    return (
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '20px',
                        height: '92%',
                        padding: '40px 60px'
                      }}>
                        {/* Left: Key Recommendations */}
                        <div style={{
                          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.95) 100%)',
                          borderRadius: '20px',
                          padding: '28px',
                          border: `4px solid ${pillar.color}`,
                          boxShadow: `0 8px 32px ${pillar.color}30`,
                          overflow: 'auto',
                          display: 'flex',
                          flexDirection: 'column'
                        }}>
                          <div style={{ 
                            fontSize: '1.6rem', 
                            fontWeight: 700, 
                            color: pillar.color,
                            marginBottom: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            paddingBottom: '16px',
                            borderBottom: `3px solid ${pillar.color}20`
                          }}>
                            <span style={{ fontSize: '1.8rem' }}>🧱</span>
                            Databricks Recommendations
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            {pillar.recommendations.slice(0, 8).map((rec, idx) => {
                              let recText = '';
                              if (typeof rec === 'string') {
                                recText = rec;
                              } else if (rec.name) {
                                recText = rec.name;
                                if (rec.description) {
                                  recText += ` - ${rec.description}`;
                                }
                              } else {
                                recText = rec.message || rec.recommendationText || rec.title || '';
                              }
                              
                              return (
                                <div key={idx} style={{
                                  display: 'flex',
                                  gap: '12px',
                                  alignItems: 'flex-start',
                                  fontSize: '0.95rem',
                                  color: '#1e293b',
                                  lineHeight: '1.5',
                                  padding: '12px',
                                  background: `${pillar.color}08`,
                                  borderRadius: '12px',
                                  transition: 'all 0.2s ease'
                                }}>
                                  <div style={{
                                    flexShrink: 0,
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '10px',
                                    background: `linear-gradient(135deg, ${pillar.color} 0%, ${pillar.color}dd 100%)`,
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 700,
                                    fontSize: '0.9rem',
                                    boxShadow: `0 4px 12px ${pillar.color}40`
                                  }}>
                                    {idx + 1}
                                  </div>
                                  <div style={{ flex: 1, paddingTop: '4px', fontWeight: 500 }}>{recText}</div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Right: Next Steps */}
                        <div style={{
                          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.95) 100%)',
                          borderRadius: '20px',
                          padding: '28px',
                          border: `4px solid ${pillar.color}`,
                          boxShadow: `0 8px 32px ${pillar.color}30`,
                          overflow: 'auto',
                          display: 'flex',
                          flexDirection: 'column'
                        }}>
                          <div style={{ 
                            fontSize: '1.6rem', 
                            fontWeight: 700, 
                            color: pillar.color,
                            marginBottom: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            paddingBottom: '16px',
                            borderBottom: `3px solid ${pillar.color}20`
                          }}>
                            <span style={{ fontSize: '1.8rem' }}>🎯</span>
                            Next Steps
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            {pillar.nextSteps.slice(0, 8).map((step, idx) => {
                              let stepText = '';
                              if (typeof step === 'string') {
                                stepText = step;
                              } else if (step.action) {
                                stepText = step.action;
                                if (step.description) {
                                  stepText += ` - ${step.description}`;
                                }
                              } else {
                                stepText = step.message || step.text || step.title || '';
                              }
                              
                              return (
                                <div key={idx} style={{
                                  display: 'flex',
                                  gap: '12px',
                                  alignItems: 'flex-start',
                                  fontSize: '0.95rem',
                                  color: '#1e293b',
                                  lineHeight: '1.5',
                                  padding: '12px',
                                  background: `${pillar.color}08`,
                                  borderRadius: '12px',
                                  transition: 'all 0.2s ease'
                                }}>
                                  <div style={{
                                    flexShrink: 0,
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '10px',
                                    background: `linear-gradient(135deg, ${pillar.color} 0%, ${pillar.color}dd 100%)`,
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 700,
                                    fontSize: '0.9rem',
                                    boxShadow: `0 4px 12px ${pillar.color}40`
                                  }}>
                                    {idx + 1}
                                  </div>
                                  <div style={{ flex: 1, paddingTop: '4px', fontWeight: 500 }}>{stepText}</div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Dimension Breakdown / Maturity Chart Slides (Slides 3,6,9,12,15,18) - slideType 1 */}
                  {/* NEW LAYOUT: Chart (left) + What's Working (top right) + Key Challenges (bottom right) */}
                  {currentSlide >= 2 && currentSlide <= 19 && (currentSlide - 2) % 3 === 1 && (() => {
                    const pillarsArray = [
                      { id: 'platform_governance', name: 'Platform & Governance', color: '#3b82f6' },
                      { id: 'data_engineering', name: 'Data Engineering & Integration', color: '#10b981' },
                      { id: 'analytics_bi', name: 'Analytics & BI Modernization', color: '#ec4899' },
                      { id: 'machine_learning', name: 'Machine Learning & MLOps', color: '#f59e0b' },
                      { id: 'generative_ai', name: 'Generative AI & Agentic Capabilities', color: '#8b5cf6' },
                      { id: 'operational_excellence', name: 'Operational Excellence & Adoption', color: '#06b6d4' }
                    ];
                    const pillarIndex = Math.floor((currentSlide - 2) / 3);
                    const pillarDef = pillarsArray[pillarIndex];
                    if (!pillarDef) return null;
                    
                    // Get dimensions for this pillar (same logic as report section)
                    const resultsData = results?.data || results;
                    let dimensions = [];
                    
                    // Get pillar data for What's Working and Key Challenges
                    const pillarData = getPillarData(pillarDef.id);
                    const theGood = pillarData?.theGood || [];
                    const theBad = pillarData?.theBad || [];
                    
                    // First, try to get from results data
                    if (resultsData?.categoryDetails?.[pillarDef.id]?.dimensions) {
                      const dimensionsObj = resultsData.categoryDetails[pillarDef.id].dimensions;
                      const dimensionKeys = Object.keys(dimensionsObj);
                      
                      // Try to get proper names from framework if available
                      if (framework?.data?.assessmentAreas) {
                        const pillarFramework = framework.data.assessmentAreas.find(area => area.id === pillarDef.id);
                        if (pillarFramework?.dimensions) {
                          dimensions = pillarFramework.dimensions.map(dim => ({
                            id: dim.id,
                            title: dim.name || dim.title || dim.id
                          }));
                        }
                      }
                      
                      // Fallback to generating titles from dimension IDs
                      if (dimensions.length === 0) {
                        dimensions = dimensionKeys.map(dimId => ({
                          id: dimId,
                          title: dimId.split('_').map(word => {
                            // Keep ML and AI in uppercase
                            if (word.toLowerCase() === 'ml' || word.toLowerCase() === 'ai') {
                              return word.toUpperCase();
                            }
                            return word.charAt(0).toUpperCase() + word.slice(1);
                          }).join(' ')
                        }));
                      }
                    }
                    
                    return (
                      <SlideContent>
                        {/* 2-Column Layout: Chart (Left) + Cards (Right) */}
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: '55% 45%',
                          gap: '30px',
                          height: '100%',
                          padding: '20px 40px'
                        }}>
                          {/* LEFT: Maturity Chart */}
                          <div style={{
                            background: 'rgba(255, 255, 255, 0.98)',
                            borderRadius: '20px',
                            padding: '30px 40px',
                            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                            display: 'flex',
                            flexDirection: 'column'
                          }}>
                          {/* Header with maturity levels scale */}
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: '280px 1fr',
                            gap: '40px',
                            marginBottom: '16px',
                            paddingBottom: '16px',
                            borderTop: '3px solid #e5e7eb'
                          }}>
                            <div></div>
                            <div style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              padding: '0 4px',
                              gap: '16px'
                            }}>
                              {['1. Initial', '2. Managed', '3. Defined', '4. Quantified', '5. Optimized'].map((level) => (
                                <div key={level} style={{
                                  fontSize: '0.75rem',
                                  fontWeight: 600,
                                  color: '#64748b',
                                textAlign: 'center',
                                  flex: 1,
                                  whiteSpace: 'nowrap'
                              }}>
                                  {level}
                              </div>
                              ))}
                          </div>
                        </div>

                          {/* Dimension rows */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {dimensions.map((dimension, dimIdx) => {
                              const dimensionScores = resultsData?.categoryDetails?.[pillarDef.id]?.dimensions?.[dimension.id] || {};
                              const currentScore = (dimensionScores.currentScore || 0).toFixed(1);
                              const futureScore = (dimensionScores.futureScore || dimensionScores.currentScore || 0).toFixed(1);
                              const currentScoreNum = parseFloat(currentScore);
                              const futureScoreNum = parseFloat(futureScore);
                              
                              return (
                                <div key={dimIdx} style={{
                                  display: 'grid',
                                  gridTemplateColumns: '280px 1fr',
                                  gap: '40px',
                                  alignItems: 'center'
                                }}>
                                  {/* Dimension Name */}
                          <div style={{
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    color: '#1e293b',
                                    padding: '14px 18px',
                                    background: '#f8fafc',
                                    borderRadius: '12px',
                                    borderLeft: `5px solid ${pillarDef.color}`
                                  }}>
                                    {dimension.title}
                                  </div>
                                  
                                  {/* Progress Bars Container */}
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {/* TODAY Bar */}
                                    <div style={{ position: 'relative' }}>
                            <div style={{
                                        position: 'absolute',
                                        left: '12px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        fontSize: '0.85rem',
                              fontWeight: 700,
                              color: '#1e293b',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px',
                                        zIndex: 2,
                                        textShadow: '0 1px 2px rgba(255,255,255,0.8)'
                            }}>
                                        TODAY
                            </div>
                              <div style={{
                                        position: 'absolute',
                                        right: '12px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        fontSize: '1rem',
                                        fontWeight: 700,
                                        color: '#1e293b',
                                        zIndex: 2,
                                        textShadow: '0 1px 2px rgba(255,255,255,0.8)'
                                      }}>
                                        {currentScore}
                                  </div>
                              <div style={{
                                        width: '100%',
                                        height: '32px',
                                        background: '#e5e7eb',
                                        borderRadius: '10px',
                                        overflow: 'hidden',
                                        position: 'relative'
                                      }}>
                                        <div style={{
                                          width: `${(currentScoreNum / 5) * 100}%`,
                                          height: '100%',
                                          background: `linear-gradient(90deg, ${pillarDef.color} 0%, ${pillarDef.color}dd 100%)`,
                                          transition: 'width 0.5s ease'
                                        }} />
                              </div>
                          </div>

                                    {/* TOMORROW Bar */}
                                    <div style={{ position: 'relative' }}>
                          <div style={{
                                        position: 'absolute',
                                        left: '12px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        fontSize: '0.85rem',
                                        fontWeight: 700,
                                        color: pillarDef.color,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px',
                                        zIndex: 2
                                      }}>
                                        TOMORROW
                                      </div>
                            <div style={{
                                        position: 'absolute',
                                        right: '12px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        fontSize: '1rem',
                              fontWeight: 700,
                                        color: pillarDef.color,
                                        zIndex: 2
                            }}>
                                        {futureScore}
                            </div>
                                      <div style={{
                                        width: '100%',
                                        height: '32px',
                                        background: '#e5e7eb',
                                        borderRadius: '10px',
                                        overflow: 'hidden',
                                        position: 'relative',
                                        border: `3px solid ${pillarDef.color}`
                                      }}>
                                        <div style={{
                                          width: `${(futureScoreNum / 5) * 100}%`,
                                          height: '100%',
                                          background: `linear-gradient(90deg, ${pillarDef.color}33 0%, ${pillarDef.color}22 100%)`,
                                          transition: 'width 0.5s ease'
                                        }} />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          </div>
                          
                          {/* RIGHT: What's Working (Top) + Key Challenges (Bottom) */}
                          <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '20px',
                            height: '100%'
                          }}>
                            {/* What's Working */}
                            <div style={{
                              background: 'rgba(255, 255, 255, 0.98)',
                              borderRadius: '16px',
                              padding: '24px',
                              border: '4px solid #10b981',
                              flex: 1,
                              overflow: 'auto',
                              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
                            }}>
                              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#10b981', marginBottom: '14px' }}>
                                ✓ What's Working
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {theGood.slice(0, 4).map((item, idx) => (
                                  <div key={idx} style={{ fontSize: '0.9rem', color: '#334155', paddingLeft: '18px', position: 'relative', lineHeight: '1.4' }}>
                                    <span style={{ position: 'absolute', left: 0 }}>•</span>
                                    {item}
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            {/* Key Challenges */}
                            <div style={{
                              background: 'rgba(255, 255, 255, 0.98)',
                              borderRadius: '16px',
                              padding: '24px',
                              border: '4px solid #ef4444',
                              flex: 1,
                              overflow: 'auto',
                              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
                            }}>
                              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#ef4444', marginBottom: '14px' }}>
                                ⚠ Key Challenges
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {theBad.slice(0, 4).map((item, idx) => (
                                  <div key={idx} style={{ fontSize: '0.9rem', color: '#334155', paddingLeft: '18px', position: 'relative', lineHeight: '1.4' }}>
                                    <span style={{ position: 'absolute', left: 0 }}>•</span>
                                    {item}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </SlideContent>
                    );
                  })()}

                  {/* Next Steps Slides - REMOVED */}
                  {false && currentSlide >= 2 && currentSlide <= 20 && (currentSlide - 2) % 3 === 2 && (() => {
                    const pillarsArray = [
                      { id: 'platform_governance', name: 'Platform & Governance', color: '#3b82f6' },
                      { id: 'data_engineering', name: 'Data Engineering & Integration', color: '#10b981' },
                      { id: 'analytics_bi', name: 'Analytics & BI Modernization', color: '#ec4899' },
                      { id: 'machine_learning', name: 'Machine Learning & MLOps', color: '#f59e0b' },
                      { id: 'generative_ai', name: 'Generative AI & Agentic Capabilities', color: '#8b5cf6' },
                      { id: 'operational_excellence', name: 'Operational Excellence & Adoption', color: '#06b6d4' }
                    ];
                    const pillarIndex = Math.floor((currentSlide - 2) / 3);
                    const pillarDef = pillarsArray[pillarIndex];
                    if (!pillarDef) return null;
                    
                    // Get pillar data
                    const pillarData = getPillarData(pillarDef.id);
                    const nextSteps = pillarData?.specificRecommendations || pillarData?.nextSteps || [];
                    
                    console.log(`[Slideshow] Next Steps for ${pillarDef.id}:`, nextSteps?.length || 0);
                    
                    return (
                              <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                        gap: '20px',
                        paddingTop: '50px',
                        maxWidth: '1200px',
                        margin: '0 auto',
                        width: '100%'
                      }}>
                        {/* Title */}
                        <div style={{
                          fontSize: '2.5rem',
                          fontWeight: 700,
                          color: 'white',
                          textAlign: 'center',
                          marginBottom: '20px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                                gap: '12px'
                              }}>
                          <span style={{ fontSize: '3rem' }}>🎯</span>
                          Next Steps
                        </div>

                        {nextSteps && nextSteps.length > 0 ? (
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: '20px'
                          }}>
                            {nextSteps.slice(0, 6).map((step, idx) => (
                                  <div key={idx} style={{
                                background: 'rgba(255, 255, 255, 0.95)',
                                borderRadius: '16px',
                                padding: '24px',
                                border: `4px solid ${pillarDef.color}`,
                                    display: 'flex',
                                gap: '16px',
                                alignItems: 'flex-start',
                                minHeight: '140px'
                              }}>
                                <div style={{
                                  background: pillarDef.color,
                                  color: 'white',
                                  width: '40px',
                                  height: '40px',
                                  borderRadius: '50%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '1.5rem',
                                  fontWeight: 700,
                                  flexShrink: 0
                                }}>
                                  {idx + 1}
                                </div>
                                <div style={{
                                      fontSize: '1.2rem',
                                  color: '#1e293b',
                                  lineHeight: '1.7',
                                  flex: 1
                                    }}>
                                  {step}
                                </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div style={{
                            background: 'rgba(255, 255, 255, 0.95)',
                            borderRadius: '16px',
                            padding: '40px',
                                textAlign: 'center',
                            fontSize: '1.3rem',
                            color: '#64748b',
                            fontStyle: 'italic'
                              }}>
                            No specific next steps available for this pillar
                              </div>
                            )}
                          </div>
                    );
                  })()}

                  {/* Thank You Slide (Slide 21) */}
                  {currentSlide === 21 && (
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '100%',
                      textAlign: 'center',
                      gap: '40px',
                      padding: '0 80px'
                    }}>
                      <div style={{
                        fontSize: '6rem',
                        marginBottom: '20px',
                        filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.3))'
                      }}>
                        ✨
                      </div>
                      <div style={{
                        fontSize: '4.5rem',
                        fontWeight: 900,
                        color: 'white',
                        marginBottom: '20px',
                        textShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                        letterSpacing: '-0.02em'
                      }}>
                        Thank You
                      </div>
                      <div style={{
                        fontSize: '2rem',
                        fontWeight: 400,
                        color: 'rgba(255, 255, 255, 0.9)',
                        lineHeight: '1.6',
                        maxWidth: '900px'
                      }}>
                        For your time and participation in the Technical Maturity Assessment
                      </div>
                      <div style={{
                        fontSize: '1.5rem',
                        fontWeight: 400,
                        color: 'rgba(255, 255, 255, 0.7)',
                        marginTop: '20px'
                      }}>
                        For support: nitin.aggarwal@databricks.com
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
  );
};

export default AssessmentResultsNew;

