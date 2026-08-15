import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiDownload, FiShare2, FiAlertTriangle, FiUpload, FiX, FiLink, FiEdit2, FiTrash2, FiPlus, FiBarChart2, FiMonitor, FiPrinter } from 'react-icons/fi';
import toast from 'react-hot-toast';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as assessmentService from '../services/assessmentService';
import ExecutiveDashboard from './ExecutiveDashboard';
import ROICalculator from './ROICalculator';
import RiskHeatmap from './RiskHeatmap';
import Footer from './Footer';

// =====================
// STYLED COMPONENTS
// =====================

const PageContainer = styled.div`
  min-height: 100vh;
  background: #f9fafb;
  padding: 108px 0 40px 0;

  @media (max-width: 768px) {
    padding: 92px 0 24px 0;
  }
`;

const PageHeader = styled.div`
  position: relative;
  margin: 0 0 32px 0;
  padding: 0 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const LogoContainer = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 16px;
  opacity: ${props => props.$hasLogo ? '1' : '0'};
  transition: opacity 0.3s ease;

  ${PageHeader}:hover & {
    opacity: 1;
  }

  @media (max-width: 768px) {
    position: static;
    transform: none;
    margin-top: 16px;
  }

  @media print {
    opacity: ${props => props.$hasLogo ? '1' : '0'} !important;
  }
`;

const LogoUploadBox = styled.div`
  position: relative;
  width: 180px;
  height: 80px;
  border: 2px dashed #cbd5e1;
  border-radius: 8px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;

  &:hover {
    border-color: #3b82f6;
    background: #f8fafc;
  }

  @media print {
    border-style: solid;
  }
`;

const LogoImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 8px;
`;

const LogoPlaceholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  color: #94a3b8;
  font-size: 0.875rem;
  text-align: center;
  padding: 12px;

  svg {
    width: 24px;
    height: 24px;
  }
`;

const RemoveLogoButton = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
  z-index: 10;

  ${LogoUploadBox}:hover & {
    opacity: 1;
  }

  &:hover {
    background: #dc2626;
  }

  @media print {
    display: none;
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const LogoOptionsModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const LogoOptionsContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 32px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const LogoOptionsTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 24px 0;
`;

const LogoOptionButton = styled.button`
  width: 100%;
  padding: 16px 20px;
  margin-bottom: 12px;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 12px;

  &:hover {
    border-color: #3b82f6;
    background: #f8fafc;
    color: #3b82f6;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const URLInputForm = styled.form`
  margin-top: 16px;
`;

const URLInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  margin-bottom: 12px;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const URLSubmitButton = styled.button`
  width: 100%;
  padding: 12px 20px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LogoCancelButton = styled.button`
  width: 100%;
  padding: 12px 20px;
  background: transparent;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  margin-top: 8px;
  transition: color 0.2s;

  &:hover {
    color: #1e293b;
  }
`;

const BackButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
  }
`;

const BenchmarkButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #10b981;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #059669;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  }

  @media print {
    display: none;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  opacity: 0;
  transition: opacity 0.3s ease;

  ${PageHeader}:hover & {
    opacity: 1;
  }

  @media (max-width: 768px) {
    width: 100%;
    flex-direction: column;
  }

  @media print {
    display: none;
  }
`;

const ActionButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border: none;
  border-radius: 8px;
  font-weight: 600;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const FloatingSlideshowButton = styled.button`
  position: fixed;
  top: 138px;
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
    top: 128px;
    right: 24px;
    padding: 7px 14px;
    font-size: 12px;
  }
  
  @media (max-width: 768px) {
    top: 118px;
    right: 16px;
    padding: 6px 12px;
    font-size: 11px;
  }
  
  @media print {
    display: none !important;
  }
`;

const ContentContainer = styled.div`
  width: 100%;
  padding: 0 40px;

  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

const LoadingContainer = styled.div`
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 20px;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
`;

const ErrorContainer = styled.div`
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 20px;
  padding: 40px;
`;

const ErrorText = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  color: #ef4444;
  text-align: center;
`;

// Roadmap & Impact Sections
const Section = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 32px;
  position: relative;
`;

const SectionHeader = styled.div`
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SectionTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
`;

const RoadmapDescription = styled.p`
  font-size: 1rem;
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 32px;
`;

const RoadmapPhases = styled.div`
  display: grid;
  gap: 24px;
`;

const PhaseCard = styled.div`
  border-radius: 12px;
  padding: 24px;
  transition: transform 0.2s;
  position: relative;

  &:hover {
    transform: translateX(4px);
  }
`;

const PhaseCardActions = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.2s ease;

  ${PhaseCard}:hover & {
    opacity: 1;
  }

  @media (max-width: 768px) {
    opacity: 1;
  }
`;

const PhaseTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 16px 0;
`;

const PhaseItems = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const PhaseItem = styled.li`
  font-size: 0.95rem;
  color: #475569;
  padding: 8px 0 8px 24px;
  position: relative;
  line-height: 1.6;

  &:before {
    content: '▸';
    position: absolute;
    left: 0;
    color: #3b82f6;
    font-weight: bold;
  }
`;

const ImpactGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
`;

const ImpactCard = styled.div`
  background: #f9fafb;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    border-color: #3b82f6;
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(59, 130, 246, 0.15);
  }
`;

const ImpactValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: #3b82f6;
  margin-bottom: 8px;
`;

const ImpactLabel = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 12px;
`;

const ImpactDrivers = styled.div`
  font-size: 0.875rem;
  color: #64748b;
  font-style: italic;
  line-height: 1.5;
`;

const ImpactCardActions = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.2s ease;

  ${ImpactCard}:hover & {
    opacity: 1;
  }

  @media (max-width: 768px) {
    opacity: 1;
  }
`;

// Action buttons for CRUD
const SectionActions = styled.div`
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.3s ease;

  ${SectionHeader}:hover & {
    opacity: 1;
  }

  @media (max-width: 768px) {
    opacity: 1;
  }
`;

const IconButton = styled.button`
  background: transparent;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 8px;
  cursor: pointer;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    border-color: #3b82f6;
    color: #3b82f6;
    background: #f0f9ff;
  }
`;

const AddButton = styled(IconButton)`
  border-color: #10b981;
  color: #10b981;

  &:hover {
    border-color: #059669;
    color: #059669;
    background: #ecfdf5;
  }
`;

// Modal Styled Components
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
  padding: 24px 32px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
    color: #1e293b;
    text-transform: capitalize;
  }

  button {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: #64748b;
    cursor: pointer;
    padding: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    transition: all 0.2s;

    &:hover {
      background: #f1f5f9;
      color: #1e293b;
    }
  }
`;

const ModalBody = styled.div`
  padding: 32px;
`;

const FormGroup = styled.div`
  margin-bottom: 24px;

  label {
    display: block;
    font-size: 0.875rem;
    font-weight: 600;
    color: #475569;
    margin-bottom: 8px;
  }

  input,
  textarea,
  select {
    width: 100%;
    padding: 12px;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    font-size: 0.875rem;
    transition: all 0.2s;

    &:focus {
      outline: none;
      border-color: #00A972;
      box-shadow: 0 0 0 3px rgba(0, 169, 114, 0.1);
    }
  }

  textarea {
    resize: vertical;
    min-height: 80px;
  }
`;

const ModalFooter = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
`;

const SaveButton = styled.button`
  background: linear-gradient(135deg, #00A972 0%, #008c5f 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 169, 114, 0.3);
  }
`;

const CancelButton = styled.button`
  background: white;
  color: #64748b;
  border: 2px solid #e2e8f0;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
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
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  padding: 80px 60px 60px 60px;
`;

const SlideHeading = styled.div`
  position: absolute;
  top: 20px;
  left: 60px;
  font-size: 1.8rem;
  font-weight: 700;
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

// =====================
// COMPONENT
// =====================

const ExecutiveCommandCenter = () => {
  const { assessmentId} = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [customerLogo, setCustomerLogo] = useState(null);
  const fileInputRef = React.useRef(null);
  const [showLogoModal, setShowLogoModal] = useState(false);
  const [showURLInput, setShowURLInput] = useState(false);
  const [logoURL, setLogoURL] = useState('');
  const [loadingURL, setLoadingURL] = useState(false);

  // 🎨 CRUD State
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'phase', 'metric', 'section', etc.
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  // 🎬 Presentation Mode State
  const [presentationMode, setPresentationMode] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [printMode, setPrintMode] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('[ExecutiveCommandCenter] Fetching results for:', assessmentId);
        const response = await assessmentService.getAssessmentResults(assessmentId);
        
        if (response.success && response.data) {
          setResults(response.data);
        } else {
          throw new Error('Failed to load assessment results');
        }
      } catch (err) {
        console.error('[ExecutiveCommandCenter] Error loading results:', err);
        setError(err.message || 'Failed to load assessment results');
        
      } finally {
        setLoading(false);
      }
    };

    if (assessmentId) {
      fetchResults();
    }
  }, [assessmentId]);


  const handleBack = () => {
    navigate(`/results/${assessmentId}`);
  };

  const handleBenchmark = () => {
    navigate(`/benchmarks/${assessmentId}`);
  };

  const handlePrint = () => {
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

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: 'Executive Command Center',
        text: 'View our Databricks maturity assessment executive summary',
        url: url
      }).catch(err => console.log('Error sharing:', err));
    } else {
      navigator.clipboard.writeText(url);
      
    }
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        
        return;
      }
      if (!file.type.startsWith('image/')) {
        
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomerLogo(reader.result);
        
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = (e) => {
    e.stopPropagation();
    setCustomerLogo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
  };

  const handleLogoClick = () => {
    if (!customerLogo) {
      setShowLogoModal(true);
    }
  };

  const handleUploadFromDevice = () => {
    setShowLogoModal(false);
    fileInputRef.current?.click();
  };

  const handleFetchFromURL = () => {
    setShowURLInput(true);
  };

  const handleURLSubmit = async (e) => {
    e.preventDefault();
    if (!logoURL.trim()) {
      
      return;
    }

    setLoadingURL(true);
    
    try {
      // Call backend API to fetch logo (bypasses CORS)
      const response = await assessmentService.fetchLogoFromURL(logoURL);
      
      if (response.success && response.data) {
        setCustomerLogo(response.data);
        
        setShowLogoModal(false);
        setShowURLInput(false);
        setLogoURL('');
      } else {
        
      }
    } catch (error) {
      console.error('Error fetching logo:', error);
      
    } finally {
      setLoadingURL(false);
    }
  };

  const handleCancelModal = () => {
    setShowLogoModal(false);
    setShowURLInput(false);
    setLogoURL('');
  };

  // 🎨 CRUD Handlers
  const handleEdit = (type, item) => {
    console.log('[Edit]', type, item);
    setModalType(type);
    setEditingItem(item);
    setFormData(item || {});
    setShowModal(true);
    
  };

  const handleDelete = (type, item) => {
    console.log('[Delete]', type, item);
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      // In a real app, you'd update the backend here
      
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
    
  };

  // 🎬 Presentation Mode Handlers
  const startPresentation = () => {
    setPresentationMode(true);
    setCurrentSlide(0);
    document.body.style.overflow = 'hidden';
  };

  const exitPresentation = () => {
    setPresentationMode(false);
    setCurrentSlide(0);
    document.body.style.overflow = 'auto';
  };

  // ESC key to exit slideshow
  useEffect(() => {
    if (!presentationMode) return;

    const handleKeyPress = (e) => {
      if (e.key === 'Escape') {
        exitPresentation();
      } else if (e.key === 'ArrowLeft') {
        previousSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [presentationMode, currentSlide]);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
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

  // Print slideshow as PDF
  const handlePrintSlideshow = async () => {
    const pdf = new jsPDF('landscape', 'pt', 'letter');
    const slideCount = slides.length;
    
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
      const assessmentName = results?.assessmentInfo?.name || 'Executive-Command-Center';
      pdf.save(`${assessmentName.replace(/\s+/g, '-')}-Slideshow.pdf`);
      
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Restore scrollbars on error
      document.body.style.overflow = 'auto';
      
    }
  };

  // Keyboard navigation for slideshow
  useEffect(() => {
    if (!presentationMode) return;

    const handleKeyPress = (e) => {
      if (e.key === 'Escape') exitPresentation();
      if (e.key === 'ArrowRight' || e.key === ' ') nextSlide();
      if (e.key === 'ArrowLeft') previousSlide();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [presentationMode, currentSlide]);

  // Define slides for Executive Command Center
  const slides = [
    {
      id: 'executive-dashboard',
      title: 'Executive Command Center',
      type: 'dashboard'
    },
    {
      id: 'strategic-imperatives',
      title: 'Top Strategic Imperatives',
      type: 'imperatives'
    },
    {
      id: 'strategic-roadmap',
      title: 'Strategic Roadmap & Next Steps',
      type: 'component'
    },
    {
      id: 'business-impact',
      title: 'Expected Business Impact',
      type: 'component'
    },
    {
      id: 'roi',
      title: 'Interactive ROI Calculator',
      type: 'component'
    },
    {
      id: 'risk-heatmap',
      title: 'Risk Heatmap',
      type: 'component'
    },
    {
      id: 'thank-you',
      title: 'Thank You',
      type: 'thank-you'
    }
  ];

  // Render slide content for print
  const renderSlideContentForPrint = (slide) => {
    if (slide.id === 'title') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', fontWeight: 700, color: 'white', marginBottom: '24px' }}>
            Executive Command Center
          </div>
          <div style={{ fontSize: '1.5rem', color: 'rgba(255, 255, 255, 0.9)' }}>
            Strategic Insights & Action Plan
          </div>
        </div>
      );
    }

    if (slide.id === 'strategic-roadmap' && results?.roadmap) {
      return (
        <div style={{ background: 'rgba(255, 255, 255, 0.95)', padding: '30px', maxWidth: '100%', overflow: 'hidden', boxSizing: 'border-box' }}>
          <div style={{ fontSize: '1rem', color: '#64748b', marginBottom: '20px' }}>
            {results.roadmap.roadmapIntro || 'This roadmap outlines key phases to accelerate your data platform maturity.'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {(results.roadmap.phases || []).slice(0, 3).map((phase) => (
              <div key={phase.id} style={{
                background: phase.bgColor || '#f3f4f6',
                borderLeft: `4px solid ${phase.borderColor || '#3b82f6'}`,
                padding: '20px'
              }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
                  {phase.title || phase.phase}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '12px' }}>
                  {phase.duration} | {phase.effort}
                </div>
                <div style={{ fontSize: '0.95rem', color: '#475569', lineHeight: '1.6' }}>
                  {phase.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (slide.id === 'business-impact') {
      return (
        <div style={{ background: 'rgba(255, 255, 255, 0.95)', padding: '30px', maxWidth: '100%', overflow: 'hidden', boxSizing: 'border-box' }}>
          <div style={{ fontSize: '1.1rem', color: '#475569', textAlign: 'center' }}>
            Business impact metrics and projections
          </div>
        </div>
      );
    }

    if (slide.id === 'roi') {
      return (
        <div style={{ background: 'rgba(255, 255, 255, 0.95)', padding: '30px', maxWidth: '100%', overflow: 'hidden', boxSizing: 'border-box' }}>
          <div style={{ fontSize: '1.1rem', color: '#475569', textAlign: 'center' }}>
            ROI Calculator Summary
          </div>
        </div>
      );
    }

    if (slide.id === 'risk-heatmap') {
      return (
        <div style={{ background: 'rgba(255, 255, 255, 0.95)', padding: '30px', maxWidth: '100%', overflow: 'hidden', boxSizing: 'border-box' }}>
          <div style={{ fontSize: '1.1rem', color: '#475569', textAlign: 'center' }}>
            Risk Assessment Overview
          </div>
        </div>
      );
    }

    // Thank You slide
    if (slide.id === 'thank-you') {
      return (
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '60px',
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
      );
    }

    return null;
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingContainer>
          <LoadingSpinner />
          <LoadingText>Loading Executive Command Center...</LoadingText>
        </LoadingContainer>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <ErrorContainer>
          <FiAlertTriangle size={64} color="#ef4444" style={{ marginBottom: '20px' }} />
          <ErrorText>Assessment not found</ErrorText>
          <div style={{ textAlign: 'center', color: '#64748b', maxWidth: '500px', marginBottom: '32px' }}>
            <p style={{ marginBottom: '16px' }}>
              The assessment "{assessmentId}" could not be found. This may happen if:
            </p>
            <ul style={{ textAlign: 'left', paddingLeft: '20px', marginBottom: '24px', lineHeight: '1.8' }}>
              <li>The assessment hasn't been created yet</li>
              <li>The assessment ID is incorrect</li>
              <li>The assessment has been deleted</li>
            </ul>
            <p style={{ fontWeight: '600' }}>
              Try one of these options:
            </p>
          </div>
          <ActionButtons style={{ justifyContent: 'center', flexWrap: 'wrap' }}>
            <ActionButton
              onClick={() => navigate('/')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiArrowLeft />
              Back to Home
            </ActionButton>
            <ActionButton
              onClick={() => navigate('/assessments')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View My Assessments
            </ActionButton>
            <ActionButton
              onClick={() => navigate('/start')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start New Assessment
            </ActionButton>
          </ActionButtons>
        </ErrorContainer>
      </PageContainer>
    );
  }

  // 🚨 CHECK: Are there any fully completed pillars?
  const completedPillars = results?.assessmentInfo?.completedPillars || 0;
  const hasNoCompletedPillars = completedPillars === 0;

  return (
    <PageContainer>
      {/* Floating Start Slideshow Button */}
      {!presentationMode && (
        <FloatingSlideshowButton
          onClick={startPresentation}
        >
          <FiMonitor size={18} />
          Slideshow
        </FloatingSlideshowButton>
      )}
      
      {/* 🖨️ PRINT MODE: Render all slides for printing */}
      {printMode && results && (
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
          {slides.map((slide, slideIndex) => (
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
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 700,
                  marginBottom: '25px',
                  color: 'white'
                }}>
                  {slide.title}
                </div>

                {/* Slide Content */}
                <div style={{
                  flex: 1,
                  overflow: 'hidden',
                  width: '100%',
                  maxWidth: '100%'
                }}>
                  {renderSlideContentForPrint(slide)}
                </div>
              </div>
            </PrintSlide>
          ))}
        </div>
      )}
      
      <PageHeader>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <BackButton
            onClick={handleBack}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FiArrowLeft />
            Full Report
          </BackButton>

          <BenchmarkButton
            onClick={handleBenchmark}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FiBarChart2 />
            Industry Benchmarks
          </BenchmarkButton>

          <LogoContainer $hasLogo={!!customerLogo}>
            <LogoUploadBox onClick={handleLogoClick}>
              {customerLogo ? (
                <>
                  <LogoImage src={customerLogo} alt="Customer Logo" />
                  <RemoveLogoButton onClick={handleRemoveLogo}>
                    <FiX size={14} />
                  </RemoveLogoButton>
                </>
              ) : (
                <LogoPlaceholder>
                  <FiUpload />
                  <span>Customer Logo</span>
                </LogoPlaceholder>
              )}
            </LogoUploadBox>
            <HiddenFileInput
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
            />
          </LogoContainer>
        </div>
      </PageHeader>

      <ContentContainer>
        {/* 🚨 Show warning if no completed pillars */}
        {hasNoCompletedPillars ? (
          <div style={{
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            color: 'white',
            padding: '48px 32px',
            borderRadius: '16px',
            textAlign: 'center',
            maxWidth: '800px',
            margin: '80px auto'
          }}>
            <FiAlertTriangle size={64} style={{ marginBottom: '24px' }} />
            <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '16px' }}>
              Executive Command Center Unavailable
            </h2>
            <p style={{ fontSize: '1.25rem', opacity: 0.95, marginBottom: '32px' }}>
              Complete at least one pillar (answer or skip all questions) to access executive dashboards, ROI calculations, and strategic insights.
            </p>
            <button
              onClick={() => navigate(`/assessment/${assessmentId}/platform_governance`)}
              style={{
                background: 'white',
                color: '#ef4444',
                border: 'none',
                padding: '16px 32px',
                borderRadius: '10px',
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: '1.125rem',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
              }}
            >
              Continue Assessment →
            </button>
          </div>
        ) : (
          <>
            {/* Executive Dashboard */}
            <ExecutiveDashboard 
              results={results} 
              assessment={results?.assessmentInfo}
            />

            {/* Strategic Roadmap & Next Steps */}
            {results?.roadmap?.phases && (
              <Section style={{ marginTop: '40px' }}>
                <SectionHeader>
                  <SectionTitle>📍 Strategic Roadmap & Next Steps</SectionTitle>
                  <SectionActions>
                    <IconButton title="Add Phase" onClick={() => handleAdd('phase')}>
                      <FiPlus size={16} />
                    </IconButton>
                    <IconButton title="Edit Section" onClick={() => handleEdit('roadmap-section', results?.roadmap)}>
                      <FiEdit2 size={16} />
                    </IconButton>
                    <IconButton title="Delete Section" onClick={() => handleDelete('roadmap-section', results?.roadmap)}>
                      <FiTrash2 size={16} />
                    </IconButton>
                  </SectionActions>
                </SectionHeader>
                <RoadmapDescription>
                  {results.roadmap.roadmapIntro || 'This roadmap outlines key phases to accelerate your data platform maturity.'}
                </RoadmapDescription>
                <RoadmapPhases>
                  {results.roadmap.phases.map((phase, index) => (
                    <PhaseCard
                      key={phase.id}
                      style={{
                        background: phase.bgColor || '#f3f4f6',
                        borderLeft: `4px solid ${phase.borderColor || '#3b82f6'}`
                      }}
                    >
                      <PhaseCardActions>
                        <IconButton title="Edit Phase" onClick={() => handleEdit('phase', phase)}>
                          <FiEdit2 size={14} />
                        </IconButton>
                        <IconButton title="Delete Phase" onClick={() => handleDelete('phase', phase)}>
                          <FiTrash2 size={14} />
                        </IconButton>
                      </PhaseCardActions>
                      <PhaseTitle>{phase.title}</PhaseTitle>
                      <PhaseItems>
                        {phase.items.map((item, idx) => (
                          <PhaseItem key={idx}>{item}</PhaseItem>
                        ))}
                      </PhaseItems>
                    </PhaseCard>
                  ))}
                </RoadmapPhases>
              </Section>
            )}

            {/* Expected Business Impact */}
            {results?.businessImpact?.metrics && (
              <Section style={{ marginTop: '40px' }}>
                <SectionHeader>
                  <SectionTitle>📊 Expected Business Impact</SectionTitle>
                  <SectionActions>
                    <IconButton title="Add Metric" onClick={() => handleAdd('impact-metric')}>
                      <FiPlus size={16} />
                    </IconButton>
                    <IconButton title="Edit Section" onClick={() => handleEdit('impact-section', results?.businessImpact)}>
                      <FiEdit2 size={16} />
                    </IconButton>
                    <IconButton title="Delete Section" onClick={() => handleDelete('impact-section', results?.businessImpact)}>
                      <FiTrash2 size={16} />
                    </IconButton>
                  </SectionActions>
                </SectionHeader>
                <ImpactGrid>
                  {results.businessImpact.metrics.map((metric, index) => (
                    <ImpactCard key={index}>
                      <ImpactCardActions>
                        <IconButton title="Edit Metric" onClick={() => handleEdit('impact-metric', metric)}>
                          <FiEdit2 size={14} />
                        </IconButton>
                        <IconButton title="Delete Metric" onClick={() => handleDelete('impact-metric', metric)}>
                          <FiTrash2 size={14} />
                        </IconButton>
                      </ImpactCardActions>
                      <ImpactValue>{metric.value}</ImpactValue>
                      <ImpactLabel>{metric.label}</ImpactLabel>
                      <ImpactDrivers>{metric.keyDrivers}</ImpactDrivers>
                    </ImpactCard>
                  ))}
                </ImpactGrid>
              </Section>
            )}

            {/* ROI Calculator */}
            <Section>
              <SectionHeader>
                <SectionTitle>Interactive ROI Calculator</SectionTitle>
                <SectionActions>
                  <IconButton title="Edit ROI Calculator" onClick={() => handleEdit('roi-calculator', null)}>
                    <FiEdit2 size={14} />
                  </IconButton>
                  <IconButton title="Delete ROI Calculator" onClick={() => handleDelete('roi-calculator', null)}>
                    <FiTrash2 size={14} />
                  </IconButton>
                </SectionActions>
              </SectionHeader>
              <ROICalculator 
                results={results} 
                assessment={results?.assessmentInfo}
              />
            </Section>

            {/* Risk Heatmap */}
            <RiskHeatmap 
              results={results} 
              assessment={results?.assessmentInfo}
            />
          </>
        )}
      </ContentContainer>

      {/* Logo Upload Options Modal */}
      {showLogoModal && (
        <LogoOptionsModal onClick={handleCancelModal}>
          <LogoOptionsContent onClick={(e) => e.stopPropagation()}>
            <LogoOptionsTitle>Add Customer Logo</LogoOptionsTitle>
            
            {!showURLInput ? (
              <>
                <LogoOptionButton onClick={handleUploadFromDevice}>
                  <FiUpload />
                  Upload from Device
                </LogoOptionButton>
                
                <LogoOptionButton onClick={handleFetchFromURL}>
                  <FiLink />
                  Fetch from Customer Portal URL
                </LogoOptionButton>
                
                <LogoCancelButton onClick={handleCancelModal}>
                  Cancel
                </LogoCancelButton>
              </>
            ) : (
              <>
                <div style={{ 
                  marginBottom: '16px', 
                  padding: '12px', 
                  background: '#f0f9ff', 
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  color: '#0369a1',
                  lineHeight: '1.5'
                }}>
                  🤖 <strong>Smart Logo Detection:</strong> Enter any customer website URL and we'll automatically find and extract their logo!
                  <br/>
                  <strong>Examples:</strong>
                  <br/>
                  • https://google.com (extracts Google logo)
                  <br/>
                  • https://databricks.com (extracts Databricks logo)
                  <br/>
                  • https://company.com/logo.png (direct image link)
                </div>
                
                <URLInputForm onSubmit={handleURLSubmit}>
                  <URLInput
                    type="url"
                    value={logoURL}
                    onChange={(e) => setLogoURL(e.target.value)}
                    placeholder="https://cdn.example.com/logo.png"
                    required
                  />
                  <URLSubmitButton type="submit" disabled={loadingURL}>
                    {loadingURL ? 'Loading Logo...' : 'Add Logo'}
                  </URLSubmitButton>
                </URLInputForm>
                
                <LogoCancelButton onClick={handleCancelModal}>
                  Cancel
                </LogoCancelButton>
              </>
            )}
          </LogoOptionsContent>
        </LogoOptionsModal>
      )}

      {/* CRUD Modal */}
      <AnimatePresence>
        {showModal && (
          <ModalOverlay onClick={() => setShowModal(false)}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <ModalHeader>
                <h2>{editingItem ? 'Edit' : 'Add'} {modalType}</h2>
                <button onClick={() => setShowModal(false)}>✕</button>
              </ModalHeader>
              <ModalBody>
                <form onSubmit={handleFormSubmit}>
                  {modalType === 'roi-calculator' && (
                    <>
                      <FormGroup>
                        <label>Calculator Title</label>
                        <input
                          type="text"
                          value={formData.title || 'Interactive ROI Calculator'}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="Enter calculator title..."
                        />
                      </FormGroup>
                      <FormGroup>
                        <label>Subtitle/Description</label>
                        <textarea
                          rows="2"
                          value={formData.subtitle || 'Customize assumptions to see your specific business case for Databricks'}
                          onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                          placeholder="Enter subtitle..."
                        />
                      </FormGroup>
                      <FormGroup>
                        <label>Note</label>
                        <textarea
                          rows="3"
                          value={formData.note || ''}
                          onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                          placeholder="Add any special notes or instructions..."
                        />
                      </FormGroup>
                    </>
                  )}

                  <ModalFooter>
                    <SaveButton type="submit">
                      {editingItem ? 'Save Changes' : 'Add'}
                    </SaveButton>
                    <CancelButton type="button" onClick={() => setShowModal(false)}>
                      Cancel
                    </CancelButton>
                  </ModalFooter>
                </form>
              </ModalBody>
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>

      {/* Footer */}
      <Footer />

      {/* 🎬 Presentation Slideshow Overlay */}
      <AnimatePresence>
        {presentationMode && (
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
            
            <SlideCounter data-hide-on-print="true">{currentSlide + 1} / {slides.length}</SlideCounter>

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
              onClick={(e) => {
                e.stopPropagation();
                exitPresentation();
              }}
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
                  className="executive-slideshow-slide"
                >
                  {/* Executive Dashboard Slide - Full Interactive Dashboard */}
                  {slides[currentSlide].id === 'executive-dashboard' && results && (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      overflow: 'auto',
                      padding: '20px 40px'
                    }}>
                      <ExecutiveDashboard 
                        results={results} 
                        assessment={results?.assessmentInfo}
                        hideImperatives={true}
                      />
                    </div>
                  )}

                  {/* Strategic Imperatives Slide */}
                  {slides[currentSlide].id === 'strategic-imperatives' && results && (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      padding: '0 40px'
                    }}>
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: '16px',
                        padding: '40px',
                        border: '2px solid #e5e7eb'
                      }}>
                        <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e293b', marginBottom: '32px' }}>
                          🎯 Top 3 Strategic Imperatives
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                          {/* Imperative 1 */}
                          <div style={{
                            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                            borderRadius: '12px',
                            padding: '28px',
                            color: 'white'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                              <div style={{
                                width: '48px',
                                height: '48px',
                                background: 'rgba(255, 255, 255, 0.2)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.5rem',
                                fontWeight: 700
                              }}>1</div>
                              <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                                Implement Unity Catalog
                              </div>
                            </div>
                            <div style={{ fontSize: '1.1rem', opacity: 0.95, lineHeight: '1.6', paddingLeft: '64px' }}>
                              Centralize data governance and security • Reduce compliance risk • Enable fine-grained access control
                            </div>
                          </div>

                          {/* Imperative 2 */}
                          <div style={{
                            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                            borderRadius: '12px',
                            padding: '28px',
                            color: 'white'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                              <div style={{
                                width: '48px',
                                height: '48px',
                                background: 'rgba(255, 255, 255, 0.2)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.5rem',
                                fontWeight: 700
                              }}>2</div>
                              <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                                Deploy Delta Live Tables
                              </div>
                            </div>
                            <div style={{ fontSize: '1.1rem', opacity: 0.95, lineHeight: '1.6', paddingLeft: '64px' }}>
                              Automate data pipeline quality • Reduce data delivery time • Improve data trust and reliability
                            </div>
                          </div>

                          {/* Imperative 3 */}
                          <div style={{
                            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                            borderRadius: '12px',
                            padding: '28px',
                            color: 'white'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                              <div style={{
                                width: '48px',
                                height: '48px',
                                background: 'rgba(255, 255, 255, 0.2)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.5rem',
                                fontWeight: 700
                              }}>3</div>
                              <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                                Establish MLOps Framework
                              </div>
                            </div>
                            <div style={{ fontSize: '1.1rem', opacity: 0.95, lineHeight: '1.6', paddingLeft: '64px' }}>
                              Accelerate model deployment • Reduce time-to-production by 60-70% • Enable continuous ML improvement
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Strategic Roadmap Slide */}
                  {slides[currentSlide].id === 'strategic-roadmap' && results?.roadmap?.phases && (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-start',
                      background: 'white',
                      borderRadius: '16px',
                      padding: '24px 32px',
                      overflow: 'hidden'
                    }}>
                      <div style={{ marginBottom: '16px', flexShrink: 0 }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b', margin: '0 0 8px 0' }}>
                          📍 Strategic Roadmap & Next Steps
                        </h2>
                        <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: '1.4', margin: 0 }}>
                          {results.roadmap.roadmapIntro || 'This roadmap outlines key phases to accelerate your data platform maturity.'}
                        </p>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, minHeight: 0 }}>
                        {results.roadmap.phases.map((phase, index) => (
                          <div
                            key={phase.id}
                            style={{
                              background: phase.bgColor || '#f3f4f6',
                              borderLeft: `4px solid ${phase.borderColor || '#3b82f6'}`,
                              borderRadius: '8px',
                              padding: '16px 20px',
                              flex: '1 1 0',
                              minHeight: 0,
                              display: 'flex',
                              flexDirection: 'column'
                            }}
                          >
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', margin: '0 0 10px 0' }}>
                              {phase.title}
                            </h3>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, flex: 1 }}>
                              {phase.items.slice(0, 3).map((item, idx) => (
                                <li key={idx} style={{ fontSize: '0.85rem', color: '#475569', padding: '6px 0 6px 20px', position: 'relative', lineHeight: '1.4' }}>
                                  <span style={{ position: 'absolute', left: 0, color: '#3b82f6', fontWeight: 'bold' }}>▸</span>
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Business Impact Slide */}
                  {slides[currentSlide].id === 'business-impact' && results?.businessImpact && (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      padding: '0 60px'
                    }}>
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: '16px',
                        padding: '32px',
                        border: '2px solid #e5e7eb'
                      }}>
                        <div style={{ marginBottom: '24px' }}>
                          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
                            📊 Expected Business Impact
                          </h2>
                        </div>
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(3, 1fr)',
                          gap: '20px'
                        }}>
                          {Object.entries(results.businessImpact).map(([key, metric], index) => (
                            <div
                              key={key}
                              style={{
                                background: '#f9fafb',
                                border: '2px solid #e5e7eb',
                                borderRadius: '10px',
                                padding: '20px 16px',
                                textAlign: 'center'
                              }}
                            >
                              <div style={{
                                fontSize: '2.25rem',
                                fontWeight: 700,
                                color: '#3b82f6',
                                marginBottom: '6px'
                              }}>
                                {metric.value}
                              </div>
                              <div style={{
                                fontSize: '0.9rem',
                                fontWeight: 600,
                                color: '#1e293b',
                                marginBottom: '8px',
                                lineHeight: '1.3'
                              }}>
                                {metric.label}
                              </div>
                              <div style={{
                                fontSize: '0.75rem',
                                color: '#64748b',
                                fontStyle: 'italic',
                                lineHeight: '1.4'
                              }}>
                                {metric.drivers?.join(' • ')}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ROI Calculator Slide */}
                  {slides[currentSlide].id === 'roi' && (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      overflow: 'auto',
                      background: 'white',
                      borderRadius: '16px',
                      padding: '20px'
                    }}>
                      <ROICalculator 
                        results={results} 
                        assessment={results?.assessmentInfo}
                      />
                    </div>
                  )}

                  {/* Risk Heatmap Slide */}
                  {slides[currentSlide].id === 'risk-heatmap' && (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      overflow: 'auto',
                      background: 'white',
                      borderRadius: '16px',
                      padding: '20px'
                    }}>
                      <RiskHeatmap 
                        results={results} 
                        assessment={results?.assessmentInfo}
                      />
                    </div>
                  )}

                  {/* Thank You Slide */}
                  {slides[currentSlide].id === 'thank-you' && (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      padding: '60px',
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
  );
};

export default ExecutiveCommandCenter;

