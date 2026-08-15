import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiDownload, FiTrendingUp, FiTarget, FiAlertTriangle, FiCheckCircle, FiArrowRight, FiFileText, FiBarChart2, FiAlertCircle, FiEdit2, FiUpload, FiX, FiLink } from 'react-icons/fi';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, RadialLinearScale, PointElement, LineElement, Filler } from 'chart.js';
import { Bar, Radar } from 'react-chartjs-2';
import toast from 'react-hot-toast';
import * as assessmentService from '../services/assessmentService';
import { generateProfessionalReport } from '../services/pdfExportService';
import LoadingSpinner from './LoadingSpinner';
import AssessmentHeader from './AssessmentHeader';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, RadialLinearScale, PointElement, LineElement, Filler);

const ResultsContainer = styled.div`
  min-height: calc(100vh - 80px);
  background: #f8f9fa;
  padding: 20px 16px;
  
          @media print {
            background: white;
            padding: 0;
            
            h3 {
              page-break-after: avoid !important;
              page-break-inside: avoid !important;
            }
            
            /* Optimize merged section layout for print */
            > div[style*="display: flex"] {
              gap: 16px !important;
            }
            
            > div[style*="display: flex"] > div:first-child {
              width: 240px !important;
            }
          }
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const HeaderSection = styled(motion.div)`
  position: relative;
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  text-align: center;
  
  @media print {
    padding: 20px !important;
    margin-bottom: 0 !important;
    page-break-inside: avoid !important;
    page-break-after: always !important;
    box-shadow: none;
    background: white !important;
    
    /* Optimize executive dashboard for print */
    > div[style*="display: grid"] {
      grid-template-columns: 320px 1fr !important;
      gap: 20px !important;
    }
    
    /* Executive header */
    > div:first-child {
      padding-bottom: 12px !important;
      margin-bottom: 16px !important;
    }
    
    h1 {
      font-size: 1.8rem !important;
    }
    
    h2 {
      font-size: 1rem !important;
    }
    
    /* Journey visualization */
    > div > div:first-child {
      padding: 16px !important;
    }
    
    /* Pillar grid */
    .pillar-charts-grid {
      grid-template-columns: repeat(3, 1fr) !important;
      gap: 10px !important;
    }
    
    .pillar-chart-card {
      padding: 12px !important;
      page-break-inside: avoid !important;
    }
  }
`;

const LogoContainer = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  opacity: ${props => props.$hasLogo ? '1' : '0'};
  transition: opacity 0.3s ease;

  ${HeaderSection}:hover & {
    opacity: 1;
  }

  @media (max-width: 768px) {
    position: static;
    margin-bottom: 16px;
    justify-content: center;
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

const CancelButton = styled.button`
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

const ResultsTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
`;

const OrganizationName = styled.h2`
  font-size: 1.5rem;
  color: #ff6b35;
  margin-bottom: 24px;
`;

const OverallScore = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  margin-bottom: 24px;
`;

const ScoresContainer = styled.div`
  display: flex;
  gap: 32px;
  justify-content: center;
  margin-bottom: 32px;
  flex-wrap: wrap;
`;

const ScoreBox = styled(motion.div)`
  background: ${props => props.bgColor || 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'};
  border-radius: 12px;
  padding: 20px 32px;
  text-align: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  min-width: 220px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
`;

const ScoreValue = styled.div`
  font-size: 3rem;
  font-weight: 700;
  color: white;
  margin-bottom: 4px;
  line-height: 1;
`;

const ScoreTitle = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95);
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ScoreSubtitle = styled.div`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
`;

const ScoreCircle = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: ${props => `conic-gradient(${props.color} ${props.percentage}%, #e0e0e0 ${props.percentage}%)`};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  &::before {
    content: '';
    width: 90px;
    height: 90px;
    border-radius: 50%;
    background: white;
    position: absolute;
  }
`;

const ScoreText = styled.div`
  position: relative;
  z-index: 1;
  text-align: center;
`;

const ScoreNumber = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.color};
`;

const ScoreLabel = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

const MaturityInfo = styled.div`
  text-align: left;
`;

const MaturityLevel = styled.h3`
  font-size: 1.8rem;
  font-weight: 600;
  color: ${props => props.color};
  margin-bottom: 8px;
`;

const MaturityDescription = styled.p`
  font-size: 1.1rem;
  color: #666;
  line-height: 1.5;
`;

const HeaderGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 24px;
  margin: 24px 0;
  
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const ProgressStats = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 12px;
`;

const StatItem = styled.div`
  text-align: center;
  
  .stat-value {
    font-size: 2rem;
    font-weight: 700;
    color: #0284c7;
    display: block;
    margin-bottom: 4px;
  }
  
  .stat-label {
    font-size: 0.9rem;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

const SummaryText = styled.div`
  font-size: 0.95rem;
  color: #333;
  line-height: 1.6;
  max-width: 100%;
  margin: 0;
  text-align: left;
  
  p {
    margin-bottom: 12px;
  }
  
  strong {
    color: #ff6b35;
    font-weight: 700;
  }
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 16px;
`;

const ActionButton = styled(motion.button)`
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
`;

const PrimaryButton = styled(ActionButton)`
  background: linear-gradient(135deg, #ff6b35, #f7931e);
  color: white;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 107, 53, 0.3);
  }
`;

const SecondaryButton = styled(ActionButton)`
  background: white;
  color: #333;
  border: 2px solid #e0e0e0;
  
  &:hover {
    border-color: #ff6b35;
    color: #ff6b35;
  }
`;

const Section = styled(motion.div)`
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  
  @media print {
    padding: 12px;
    margin-bottom: 10px;
    page-break-inside: auto;
    box-shadow: none;
    orphans: 2;
    widows: 2;
  }
`;

const PartialResultsWarning = styled.div`
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border: 2px solid #f59e0b;
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  
  svg {
    flex-shrink: 0;
    color: #d97706;
  }
  
  div {
    flex: 1;
  }
  
  h3 {
    font-size: 1.1rem;
    font-weight: 700;
    color: #92400e;
    margin: 0 0 8px 0;
  }
  
  p {
    font-size: 0.95rem;
    color: #78350f;
    margin: 0;
    line-height: 1.5;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  
  @media print {
    font-size: 1.5rem;
    margin-bottom: 16px;
    page-break-after: avoid !important;
    page-break-inside: avoid !important;
  }
`;

const InsightsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 8px;
  
  @media (max-width: 968px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const InsightCard = styled(motion.div)`
  background: ${props => props.bgColor || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  border-radius: 12px;
  padding: 16px 20px;
  color: white;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }
  
  @media print {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
    padding: 12px 16px;
    box-shadow: none;
  }
`;

const InsightValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  margin: 8px 0 4px 0;
  line-height: 1;
`;

const InsightLabel = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.9;
`;

const InsightDescription = styled.div`
  font-size: 0.85rem;
  margin-top: 8px;
  opacity: 0.85;
  line-height: 1.4;
`;

const PillarBreakdownTable = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 32px;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1.5fr;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 16px 24px;
  font-weight: 700;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`;

const TableRow = styled(motion.div)`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1.5fr;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
  align-items: center;
  transition: all 0.3s ease;
  
  &:hover {
    background: #f8f9fa;
  }
  
  &:last-child {
    border-bottom: none;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const PillarNameCell = styled.div`
  font-weight: 600;
  color: #1f2937;
  font-size: 1rem;
`;

const ScoreCell = styled.div`
  text-align: center;
  font-weight: 700;
  font-size: 1.1rem;
  color: ${props => props.color || '#6b7280'};
`;

const GapCell = styled.div`
  text-align: center;
  font-weight: 700;
  font-size: 1.1rem;
  padding: 6px 12px;
  border-radius: 8px;
  background: ${props => {
    if (props.gap === 0) return '#e0f2fe';
    if (props.gap === 1) return '#fef3c7';
    if (props.gap >= 2) return '#fee2e2';
    return '#f3f4f6';
  }};
  color: ${props => {
    if (props.gap === 0) return '#0284c7';
    if (props.gap === 1) return '#d97706';
    if (props.gap >= 2) return '#dc2626';
    return '#6b7280';
  }};
`;

const RecommendationCell = styled.div`
  font-size: 0.9rem;
  color: #6b7280;
  line-height: 1.4;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  margin-bottom: 32px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ChartContainer = styled.div`
  height: 400px;
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
`;

const RecommendationsList = styled.div`
  display: grid;
  gap: 12px;
`;

const RecommendationCard = styled.div`
  border: 2px solid ${props => props.priorityColor};
  border-radius: 8px;
  padding: 16px;
  background: ${props => props.priorityColor}08;
  
  @media print {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }
`;

const RecommendationHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const RecommendationTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 6px;
`;

const PriorityBadge = styled.span`
  background: ${props => props.color};
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const RecommendationDescription = styled.p`
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 12px;
`;

const ActionsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ActionItem = styled.li`
  padding: 8px 0;
  border-bottom: 1px solid #eee;
  color: #333;
  
  &:last-child {
    border-bottom: none;
  }
  
  &::before {
    content: '→';
    color: #ff6b35;
    font-weight: bold;
    margin-right: 8px;
  }
`;

const PillarRecommendationCard = styled.div`
  background: white;
  border: 2px solid ${props => props.priorityColor};
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  
  @media print {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
    page-break-before: auto;
    page-break-after: auto;
    margin-bottom: 12px;
    padding: 16px;
    box-shadow: none;
    orphans: 3;
    widows: 3;
  }
`;

const PillarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 2px solid #e5e7eb;
`;

const PillarInfo = styled.div`
  flex: 1;
`;

const PillarTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
`;

const ScoreProgress = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  font-size: 0.9rem;
  color: #6b7280;
  margin-top: 8px;
`;

const ScoreIndicator = styled.span`
  padding: 4px 12px;
  border-radius: 6px;
  font-weight: 600;
  background: ${props => props.type === 'current' ? '#dbeafe' : props.type === 'target' ? '#d1fae5' : '#fef3c7'};
  color: ${props => props.type === 'current' ? '#1e40af' : props.type === 'target' ? '#065f46' : '#92400e'};
`;

const RationaleText = styled.p`
  color: #4b5563;
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 16px 0;
  padding: 16px;
  background: #f9fafb;
  border-left: 4px solid ${props => props.color};
  border-radius: 4px;
`;

const FeaturesGrid = styled.div`
  display: grid;
  gap: 16px;
  margin-top: 20px;
  
  @media print {
    gap: 10px;
    margin-top: 12px;
  }
`;

const FeatureCard = styled.div`
  background: linear-gradient(to right, #f8fafc 0%, #ffffff 100%);
  border: 1px solid #e2e8f0;
  border-left: 4px solid ${props => props.statusColor};
  border-radius: 8px;
  padding: 16px;
  transition: all 0.2s;
  
  &:hover {
    border-left-width: 6px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
  
  @media print {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
    padding: 12px;
  }
`;

const FeatureHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 12px;
`;

const FeatureName = styled.h4`
  font-size: 1.05rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 4px;
`;

const StatusBadge = styled.span`
  background: ${props => props.statusColor};
  color: white;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
`;

const FeatureAction = styled.p`
  color: #374151;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 10px;
  line-height: 1.5;
`;

const WhySection = styled.div`
  background: #eff6ff;
  border-radius: 6px;
  padding: 10px 12px;
  margin: 10px 0;
`;

const WhyLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  color: #1e40af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const WhyText = styled.p`
  color: #1e40af;
  font-size: 0.85rem;
  margin-top: 4px;
  line-height: 1.4;
`;

const FeatureMetrics = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 10px;
  font-size: 0.8rem;
`;

const Metric = styled.span`
  color: #6b7280;
  
  strong {
    color: #374151;
    font-weight: 600;
  }
`;

const PillarStatusGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 24px;
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const PillarStatusCard = styled(motion.div)`
  background: ${props => props.completed ? '#f0f9ff' : '#f8f9fa'};
  border: 2px solid ${props => props.completed ? '#3b82f6' : '#e5e7eb'};
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.3s ease;
  cursor: ${props => props.completed ? 'pointer' : 'default'};

  &:hover {
    transform: ${props => props.completed ? 'translateY(-2px)' : 'none'};
    box-shadow: ${props => props.completed ? '0 4px 20px rgba(0, 0, 0, 0.1)' : 'none'};
    border-color: ${props => props.completed ? '#2563eb' : '#e5e7eb'};
  }
  
  @media print {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
    padding: 12px;
    box-shadow: none;
  }
`;

const PillarStatusInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const PillarName = styled.span`
  font-weight: 600;
  color: #1f2937;
`;

const PillarStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PillarCompletionBadge = styled.span`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => props.completed ? '#10b981' : '#6b7280'};
  color: white;
`;

const PillarScore = styled.div`
  display: flex;
  gap: 12px;
  font-size: 14px;
  font-weight: 600;
  margin-top: 4px;
`;

const ScoreBadge = styled.span`
  padding: 4px 10px;
  border-radius: 6px;
  font-weight: 700;
  background: ${props => props.type === 'current' ? '#dbeafe' : '#d1fae5'};
  color: ${props => props.type === 'current' ? '#1e40af' : '#065f46'};
`;

const ContinueButton = styled.button`
  background: #ff6b35;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #e55a2b;
    transform: translateY(-1px);
  }
`;

const AssessmentResults = ({ currentAssessment, framework }) => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const routerLocation = useLocation(); // renamed to avoid eslint warning
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customerLogo, setCustomerLogo] = useState(null);
  const fileInputRef = React.useRef(null);
  const [showLogoModal, setShowLogoModal] = useState(false);
  const [showURLInput, setShowURLInput] = useState(false);
  const [logoURL, setLogoURL] = useState('');
  const [loadingURL, setLoadingURL] = useState(false);

  useEffect(() => {
    const loadResults = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Force fresh fetch by adding timestamp to prevent any caching
        const resultsData = await assessmentService.getAssessmentResults(assessmentId);
        setResults(resultsData);
      } catch (error) {
        console.error('Error loading results:', error);
        const errorMessage = error.response?.data?.message || 'Failed to load assessment results';
        setError(errorMessage);
        
      } finally {
        setLoading(false);
      }
    };

    // Always load results when component mounts, assessmentId changes, or user navigates to this page
    loadResults();
  }, [assessmentId, routerLocation.key]);

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

  const getMaturityLevelName = (score) => {
    const levels = {
      0: 'Not Started',
      1: 'Initial',
      2: 'Repeatable',
      3: 'Defined',
      4: 'Managed',
      5: 'Optimizing'
    };
    return levels[score] || 'Unknown';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'critical': '#ff4444',
      'high': '#ff8800',
      'medium': '#ffaa00',
      'low': '#88cc00'
    };
    return colors[priority] || '#cccccc';
  };

  const getPillarValueProposition = (pillarId) => {
    const valueProps = {
      'platform_governance': 'Establish trust in data to accelerate & improve decisions',
      'Platform & Governance': 'Establish trust in data to accelerate & improve decisions',
      'data_engineering': 'Build reliable, scalable data pipelines for real-time insights',
      'Data Engineering & Integration': 'Build reliable, scalable data pipelines for real-time insights',
      'analytics_bi': 'Empower business users with self-service analytics & faster insights',
      'Analytics & BI Modernization': 'Empower business users with self-service analytics & faster insights',
      'machine_learning': 'Accelerate ML model development & deployment to production',
      'Machine Learning & MLOps': 'Accelerate ML model development & deployment to production',
      'generative_ai': 'Harness GenAI to create intelligent, context-aware applications',
      'Generative AI & Agentic Capabilities': 'Harness GenAI to create intelligent, context-aware applications',
      'operational_excellence': 'Maximize platform adoption & demonstrate measurable ROI',
      'Operational Excellence & Adoption': 'Maximize platform adoption & demonstrate measurable ROI'
    };
    return valueProps[pillarId] || 'Drive data-driven transformation and business value';
  };
  
  const getPillarIcon = (pillarId) => {
    const icons = {
      'platform_governance': '🔒',
      'Platform & Governance': '🔒',
      'data_engineering': '⚙️',
      'Data Engineering & Integration': '⚙️',
      'analytics_bi': '📊',
      'Analytics & BI Modernization': '📊',
      'machine_learning': '🧠',
      'Machine Learning & MLOps': '🧠',
      'generative_ai': '🤖',
      'Generative AI & Agentic Capabilities': '🤖',
      'operational_excellence': '🚀',
      'Operational Excellence & Adoption': '🚀'
    };
    return icons[pillarId] || '⚙️';
  };

  const handleExportPDF = () => {
    // Call window.print() directly - must be synchronous from user action
    toast('💡 In print dialog: Select "Save as PDF" and enable "Background graphics"', { 
      id: 'pdf-export',
      duration: 6000,
      icon: 'ℹ️'
    });
    
    window.print();
  };


  if (loading) {
    return (
      <ResultsContainer>
        <LoadingSpinner message="Generating your assessment results..." />
      </ResultsContainer>
    );
  }

  if (!results) {
    const handleStartAssessment = () => {
      // Find the first incomplete pillar or go to the first one
      const incompletePillar = framework?.assessmentAreas?.find(area => 
        !currentAssessment?.completedCategories?.includes(area.id)
      );
      
      const targetPillar = incompletePillar || framework?.assessmentAreas?.[0];
      if (targetPillar && assessmentId) {
        navigate(`/assessment/${assessmentId}/${targetPillar.id}`);
      } else {
        navigate('/start');
      }
    };

    return (
      <ResultsContainer>
        <ContentWrapper>
          <div style={{ 
            textAlign: 'center', 
            padding: '80px 40px',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <div style={{ fontSize: '72px', marginBottom: '24px' }}>📊</div>
            <h2 style={{ 
              fontSize: '2rem', 
              color: '#1f2937',
              marginBottom: '16px'
            }}>
              Results Not Available Yet
            </h2>
            <p style={{ 
              fontSize: '1.1rem',
              color: '#6b7280',
              marginBottom: '32px',
              lineHeight: '1.6'
            }}>
              {error || 'Please answer at least some questions to view results.'}
            </p>
            <PrimaryButton
              onClick={handleStartAssessment}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ fontSize: '1.1rem', padding: '16px 32px' }}
            >
              {assessmentId ? 'Continue Assessment' : 'Start Assessment'}
            </PrimaryButton>
          </div>
        </ContentWrapper>
      </ResultsContainer>
    );
  }

  // Check if there are any responses
  const hasData = Object.keys(results.categoryDetails).length > 0;

  // Prepare chart data
  const categoryNames = Object.keys(results.categoryDetails).map(key => 
    results.categoryDetails[key].name
  );
  const currentScores = Object.keys(results.categoryDetails).map(key => 
    results.categoryDetails[key].currentScore || 0
  );
  const futureScores = Object.keys(results.categoryDetails).map(key => 
    results.categoryDetails[key].futureScore || 0
  );
  
  // Calculate overall current and future scores
  const overallCurrentScore = currentScores.length > 0 
    ? Math.round(currentScores.reduce((sum, score) => sum + score, 0) / currentScores.length)
    : 0;
  const overallFutureScore = futureScores.length > 0
    ? Math.round(futureScores.reduce((sum, score) => sum + score, 0) / futureScores.length)
    : 0;

  const barChartData = {
    labels: categoryNames,
    datasets: [
      {
        label: 'Current Maturity',
        data: currentScores,
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
      },
      {
        label: 'Future Vision',
        data: futureScores,
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 2,
      },
    ],
  };

  const radarChartData = {
    labels: categoryNames,
    datasets: [
      {
        label: 'Current Maturity',
        data: currentScores,
        fill: true,
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgba(59, 130, 246, 1)',
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(59, 130, 246, 1)',
      },
      {
        label: 'Future Vision',
        data: futureScores,
        fill: true,
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        borderColor: 'rgba(16, 185, 129, 1)',
        pointBackgroundColor: 'rgba(16, 185, 129, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(16, 185, 129, 1)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
      },
    },
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 5,
      },
    },
  };

  return (
    <>
      <AssessmentHeader
        assessmentId={assessmentId}
        assessmentName={results?.assessmentInfo?.assessmentName || currentAssessment?.assessmentName || 'Assessment Results'}
        organizationName={results?.assessmentInfo?.organizationName || currentAssessment?.organizationName}
        currentView="results"
        onAssessmentUpdate={(updatedData) => {
          // Auto-refresh handled by useEffect with routerLocation.key dependency
          if (updatedData) {
            // Page will refresh automatically when navigating back
          }
        }}
        isSample={currentAssessment?.name?.includes('Sample') || currentAssessment?.organizationName?.includes('Sample')}
      />
      
      <ResultsContainer>
        <style>{`
          /* Force background colors and graphics to print */
          * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        
        @media print {
          /* Ensure backgrounds print */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          
          /* Keep all backgrounds */
          body {
            background: white !important;
            line-height: 1.3 !important;
          }
          
          /* Hide navigation header in print */
          header {
            display: none !important;
          }
          
          /* Make header section more compact */
          h1 {
            font-size: 1.3rem !important;
            margin-bottom: 8px !important;
            margin-top: 0 !important;
            padding-top: 0 !important;
          }
          
          /* Add page title at top */
          @page {
            margin: 0.5in;
            @top-center {
              content: "Databricks Maturity Assessment";
            }
          }
          
          /* Compact score boxes */
          div[style*="gridTemplateColumns: repeat(3"] {
            gap: 8px !important;
            margin-bottom: 8px !important;
          }
          
          /* Remove extra space from sections */
          section, div[style*="background: #ffffff"] {
            margin-bottom: 8px !important;
            padding: 12px !important;
          }
          
          /* Compact progress info */
          div[style*="fontSize: '1.1rem'"] {
            font-size: 0.85rem !important;
            margin-bottom: 6px !important;
          }
          
          /* Compact spacing for charts grid */
          .pillar-charts-grid {
            gap: 8px !important;
            margin-bottom: 10px !important;
            page-break-inside: auto !important;
            page-break-after: always !important;
          }
          
          /* Compact pillar chart cards - preserve original styling */
          .pillar-chart-card {
            padding: 8px !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            margin-bottom: 0 !important;
            border-radius: 4px !important;
          }
          
          .pillar-chart-card h3 {
            font-size: 0.85rem !important;
            margin-bottom: 6px !important;
          }
          
          .pillar-chart-card canvas {
            max-height: 100px !important;
          }
          
          /* Hide TODAY/TOMORROW labels and arrows - they clutter the print */
          .pillar-chart-labels,
          .pillar-chart-arrow {
            display: none !important;
          }
          
          /* Preserve score boxes styling - don't override colors */
          .pillar-chart-card > div > div[style*="display: flex"] {
            gap: 4px !important;
            margin-bottom: 0 !important;
          }
          
          /* Keep original colors and styles for maturity bars */
          .pillar-chart-card > div > div > div {
            font-size: 0.8rem !important;
          }
          
          /* Compact maturity bar */
          .maturity-bar {
            height: 35px !important;
            margin-bottom: 6px !important;
          }
          
          /* Compact legend */
          .maturity-legend {
            gap: 6px !important;
            margin-bottom: 10px !important;
          }
          
          .maturity-legend > div {
            padding: 3px 10px !important;
            font-size: 0.7rem !important;
          }
          
          /* CRITICAL: Keep pillar assessment cards together */
          .pillar-assessment-card {
            page-break-inside: avoid !important;
            break-inside: avoid-page !important;
            page-break-before: auto !important;
            page-break-after: always !important;
            display: block !important;
            margin-bottom: 0 !important;
            border-radius: 8px !important;
            overflow: visible !important;
          }
          
          /* Last pillar card shouldn't force a page break */
          .pillar-assessment-card:last-child {
            page-break-after: auto !important;
          }
          
          .pillar-assessment-container {
            gap: 0 !important;
          }
          
          /* Compact pillar card header */
          .pillar-assessment-card > div:first-child {
            page-break-after: avoid !important;
            padding: 10px 16px !important;
          }
          
          .pillar-assessment-card > div:first-child h3 {
            font-size: 1rem !important;
            margin-bottom: 6px !important;
          }
          
          .pillar-assessment-card > div:first-child p {
            font-size: 0.8rem !important;
          }
          
          /* Keep three-column layout together and make it compact */
          .pillar-assessment-card > div[style*="display: grid"],
          .pillar-assessment-card > div[style*="gridTemplateColumns"],
          .pillar-assessment-card > div[style*="grid-template-columns"] {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            display: grid !important;
            padding: 12px !important;
            gap: 12px !important;
          }
          
          /* Make the three card columns more compact and remove extra borders */
          .pillar-assessment-card > div[style*="grid-template-columns"] > div {
            padding: 12px !important;
            font-size: 0.75rem !important;
            line-height: 1.3 !important;
            background: white !important;
            border: 1px solid #d1d5db !important;
            box-shadow: none !important;
          }
          
          .pillar-assessment-card > div[style*="grid-template-columns"] h4 {
            font-size: 0.85rem !important;
            margin-bottom: 8px !important;
            background: transparent !important;
          }
          
          .pillar-assessment-card > div[style*="grid-template-columns"] ul,
          .pillar-assessment-card > div[style*="grid-template-columns"] ol {
            margin: 0 !important;
          }
          
          .pillar-assessment-card > div[style*="grid-template-columns"] li {
            margin-bottom: 3px !important;
            line-height: 1.4 !important;
            font-size: 0.75rem !important;
          }
          
          /* Prevent awkward page breaks */
          h2, h3, h4 {
            page-break-after: avoid !important;
            break-after: avoid !important;
          }
          
          /* Keep all white background sections together */
          section, 
          div[style*="background: white"],
          div[style*="background: 'white'"],
          div[style*='background: "white"'] {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          
          /* Force sections to start on new page if needed */
          section {
            page-break-before: auto !important;
          }
          
          /* Hide unnecessary elements when printing */
          button, 
          .action-buttons {
            display: none !important;
          }
          
          /* Ensure colored elements remain visible */
          div[style*="background:"], 
          div[style*="background-color:"],
          span[style*="background:"],
          span[style*="background-color:"] {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          /* Keep gradient backgrounds */
          div[style*="linear-gradient"],
          div[style*="background: linear-gradient"] {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          /* Reduce font sizes slightly for more compact layout */
          body {
            font-size: 11pt !important;
          }
          
          h1 {
            font-size: 18pt !important;
          }
          
          h2 {
            font-size: 14pt !important;
          }
          
          h3 {
            font-size: 12pt !important;
          }
          
          /* Tighter spacing overall */
          p, li, div {
            margin-bottom: 4pt !important;
          }
          
          /* Make left side narrower in print for more pillar card space */
          div[style*="gridTemplateColumns: '300px 1fr'"],
          div[style*='grid-template-columns: "300px 1fr"'],
          div[style*="grid-template-columns: 300px 1fr"] {
            grid-template-columns: 240px 1fr !important;
          }
        }
        
        @page {
          margin: 0.5in;
          size: letter;
        }
      `}</style>
      <ContentWrapper>
        {/* EXECUTIVE DASHBOARD - Premium First Page */}
        <HeaderSection
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{ marginTop: '0px', background: '#ffffff', padding: '32px', position: 'relative' }}
        >
          {/* Customer Logo Upload */}
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

          {/* Executive Summary Header with Action Buttons */}
          <div style={{ marginBottom: '24px', borderBottom: '3px solid #ff3621', paddingBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '24px' }}>
              {/* Left: Title and Date */}
              <div style={{ flex: '0 0 auto' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#1a1a1a', marginBottom: '8px', letterSpacing: '-0.02em' }}>
                  {results.assessmentInfo?.assessmentName || 'Databricks Maturity Assessment'}
                </h1>
                <p style={{ fontSize: '1rem', color: '#64748b', fontWeight: 500 }}>
                  Executive Summary • {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
              
              {/* Middle: Assessment Completion */}
              <div style={{ textAlign: 'center', flex: '0 0 auto' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                  Assessment Completion
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#10b981' }}>
                  {results.assessmentInfo.completionPercentage}%
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  {results.assessmentInfo.questionsAnswered}/{results.assessmentInfo.totalQuestions} Questions • {results.assessmentInfo.pillarsWithResponses}/6 Pillars
                </div>
              </div>
              
              {/* Right: Action Buttons */}
              <div style={{ flex: '0 0 auto', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <SecondaryButton
                  onClick={() => {
                    // Navigate to first category to edit responses
                    const firstCategory = framework?.assessmentAreas?.[0];
                    if (firstCategory) {
                      // Check if assessment has selectedPillars
                      const selectedPillars = currentAssessment?.selectedPillars;
                      const targetPillar = (selectedPillars && selectedPillars.length > 0) 
                        ? selectedPillars[0] 
                        : firstCategory.id;
                      navigate(`/assessment/${assessmentId}/${targetPillar}`);
                      
                    }
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ padding: '8px 16px', fontSize: '0.85rem', background: '#3b82f6', color: 'white' }}
                  title="Edit assessment responses and regenerate results"
                >
                  <FiEdit2 size={14} />
                  Edit Assessment
                </SecondaryButton>
                <SecondaryButton
                  onClick={() => navigate(`/executive-summary/${assessmentId}`)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                >
                  <FiFileText size={14} />
                  Executive Summary
                </SecondaryButton>
                <SecondaryButton
                  onClick={() => navigate(`/benchmarks/${assessmentId}`)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ padding: '8px 16px', fontSize: '0.85rem', background: '#10b981', color: 'white', border: 'none' }}
                >
                  <FiBarChart2 size={14} />
                  Industry Benchmarks
                </SecondaryButton>
                <PrimaryButton
                  onClick={handleExportPDF}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                >
                  <FiDownload size={14} />
                  Export Report
                </PrimaryButton>
              </div>
            </div>
          </div>

          {/* Main Dashboard Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px', marginBottom: '24px' }}>
            
            {/* LEFT: Maturity Journey Visualization */}
            <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#1a1a1a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '1.3rem' }}>🎯</span>
                Maturity Journey
              </h2>
              
              {/* Visual Journey Path */}
              <div style={{ position: 'relative', paddingLeft: '40px', paddingTop: '10px' }}>
                {/* Vertical Line */}
                <div style={{ position: 'absolute', left: '20px', top: '80px', bottom: '20px', width: '3px', background: 'linear-gradient(to bottom, #10b981 0%, #3b82f6 100%)' }} />
                
                {/* Target State */}
                <div style={{ marginBottom: '80px', position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '-28px', top: '10px', width: '24px', height: '24px', borderRadius: '50%', background: '#10b981', border: '4px solid white', boxShadow: '0 2px 8px rgba(16,185,129,0.3)' }} />
                  <div style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', borderRadius: '10px', padding: '14px', boxShadow: '0 4px 12px rgba(16,185,129,0.2)' }}>
                    <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.9)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '5px' }}>Target State</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', lineHeight: '1', marginBottom: '4px' }}>{overallFutureScore}</div>
                    <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.95)', fontWeight: 600 }}>{getMaturityLevelName(overallFutureScore)}</div>
                  </div>
                  <div style={{ marginTop: '12px', padding: '8px 12px', background: '#f0fdf4', borderRadius: '6px', fontSize: '0.75rem', color: '#15803d', fontWeight: 500 }}>
                    🎯 Target: {overallFutureScore - overallCurrentScore} levels to advance
                  </div>
                </div>
                
                {/* Gap Indicator */}
                <div style={{ marginBottom: '80px', textAlign: 'center', position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '-32px', top: '50%', transform: 'translateY(-50%)', width: '32px', height: '32px', borderRadius: '50%', background: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(245,158,11,0.3)' }}>
                    <span style={{ color: 'white', fontSize: '1rem', fontWeight: 700 }}>{overallFutureScore - overallCurrentScore}</span>
                  </div>
                  <div style={{ background: '#fff7ed', border: '2px dashed #f59e0b', borderRadius: '8px', padding: '12px' }}>
                    <div style={{ fontSize: '0.8rem', color: '#92400e', fontWeight: 600 }}>Maturity Gap</div>
                    <div style={{ fontSize: '0.75rem', color: '#b45309', marginTop: '4px' }}>
                      {overallFutureScore - overallCurrentScore === 1 ? '3-6 months' : overallFutureScore - overallCurrentScore === 2 ? '6-12 months' : '12+ months'}
                    </div>
                  </div>
                </div>
                
                {/* Current State */}
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '-28px', top: '10px', width: '24px', height: '24px', borderRadius: '50%', background: '#3b82f6', border: '4px solid white', boxShadow: '0 2px 8px rgba(59,130,246,0.3)' }} />
                  <div style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', borderRadius: '10px', padding: '14px', boxShadow: '0 4px 12px rgba(59,130,246,0.2)' }}>
                    <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.9)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '5px' }}>Current State</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', lineHeight: '1', marginBottom: '4px' }}>{overallCurrentScore}</div>
                    <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.95)', fontWeight: 600 }}>{getMaturityLevelName(overallCurrentScore)}</div>
                  </div>
                  <div style={{ marginTop: '12px', padding: '8px 12px', background: '#eff6ff', borderRadius: '6px', fontSize: '0.75rem', color: '#1e40af', fontWeight: 500 }}>
                    📍 Starting point established
                  </div>
                </div>
              </div>
            </div>
            
            {/* RIGHT: Pillar Overview Grid */}
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1a1a1a', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiBarChart2 size={20} />
                Maturity by Pillar
              </h2>
          
              {/* Premium Pillar Cards - 2x3 Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px'
              }}
              className="pillar-charts-grid"
              >
            {results.prioritizedActions?.map((pillarRec, index) => {
              const pillarColors = [
                '#6366f1', // indigo
                '#ef4444', // red
                '#f59e0b', // amber
                '#10b981', // emerald  
                '#8b5cf6', // purple
                '#ec4899'  // pink
              ];
              const color = pillarColors[index % pillarColors.length];
              
              return (
                <motion.div
                  key={pillarRec.pillarId}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
              style={{
                background: 'white',
                borderRadius: '10px',
                padding: '16px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                border: `2px solid ${color}20`,
                position: 'relative',
                overflow: 'hidden'
              }}
              className="pillar-chart-card"
                >
                  {/* Color Accent Bar */}
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: color }} />
                  
                  {/* Pillar Name */}
                  <h3 style={{
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: '#1a1a1a',
                    marginBottom: '12px',
                    lineHeight: '1.3',
                    height: '44px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center'
                  }}>
                    {pillarRec.pillarName}
                  </h3>

                  {/* Vertical Score Display - Goal at Top → Arrow Down → Current at Bottom */}
                  <div style={{ marginBottom: '12px' }}>
                    {/* Goal Score Box (Top) - Aligns horizontally across pillars */}
                    <div style={{ 
                      textAlign: 'center',
                      padding: '12px 10px',
                      background: `${color}`,
                      borderRadius: '8px',
                      boxShadow: `0 2px 8px ${color}40`,
                      marginBottom: '8px'
                    }}>
                      <div style={{ 
                        fontSize: '0.6rem', 
                        color: 'rgba(255,255,255,0.85)', 
                        fontWeight: 600,
                        marginBottom: '4px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>
                        Goal
                      </div>
                      <div style={{ 
                        fontSize: '2.5rem', 
                        fontWeight: 800, 
                        color: 'white',
                        lineHeight: '1'
                      }}>
                        {pillarRec.targetScore}
                      </div>
                    </div>
                    
                    {/* Arrow Up (Current → Goal) */}
                    <div style={{ 
                      textAlign: 'center',
                      fontSize: '1.2rem', 
                      color: '#cbd5e1',
                      margin: '4px 0'
                    }}>
                      ↑
                    </div>
                    
                    {/* Current Score Box (Bottom) - Aligns horizontally across pillars */}
                    <div style={{ 
                      textAlign: 'center',
                      padding: '12px 10px',
                      background: '#f8fafc',
                      borderRadius: '8px',
                      border: '2px solid #e2e8f0',
                      marginTop: '8px'
                    }}>
                      <div style={{ 
                        fontSize: '0.6rem', 
                        color: '#64748b', 
                        fontWeight: 600,
                        marginBottom: '4px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>
                        Current
                      </div>
                      <div style={{ 
                        fontSize: '2.5rem', 
                        fontWeight: 800, 
                        color: color,
                        lineHeight: '1'
                      }}>
                        {pillarRec.currentScore}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
              </div>
            </div>
          </div>
        </HeaderSection>


        {/* 2. PILLAR ASSESSMENT CARDS - Good/Bad/Recommendations */}
        {hasData && results.prioritizedActions?.length > 0 && (
          <Section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            <SectionTitle>
              <FiBarChart2 size={20} />
              Pillar Assessment
            </SectionTitle>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }} className="pillar-assessment-container">
              {results.prioritizedActions.map((pillarRec, index) => {
                const pillarDetail = results.categoryDetails[pillarRec.pillarId];
                if (!pillarDetail) return null;
                
                const status = pillarRec.currentScore <= 2 ? 'Critical' : pillarRec.currentScore === 3 ? 'Moderate' : 'Strong';
                const statusColor = status === 'Critical' ? '#dc2626' : status === 'Moderate' ? '#f59e0b' : '#10b981';
                
                return (
                  <motion.div
                    key={pillarRec.pillarId}
                    className="pillar-assessment-card"
                    initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                    style={{
                      background: '#ffffff',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      border: '2px solid #e5e7eb',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
                    }}
                  >
                    {/* Pillar Header */}
                    <div style={{
                      padding: '32px 32px 24px 32px',
                      position: 'relative'
                    }}>
                      {/* Icon in top right */}
                      <div style={{
                        position: 'absolute',
                        top: '24px',
                        right: '32px',
                        fontSize: '3rem',
                        opacity: 0.15
                      }}>
                        {getPillarIcon(pillarRec.pillarId || pillarRec.pillarName)}
                  </div>
                      
                      <h3 style={{ 
                        fontSize: '2rem', 
                        fontWeight: 700, 
                        color: '#1f2937',
                        margin: 0,
                        marginBottom: '12px'
                      }}>
                        {pillarRec.pillarName.replace(/^[^\s]+\s/, '')}
                      </h3>
                      <p style={{
                        fontSize: '1.15rem',
                        color: '#1e40af',
                        margin: 0,
                        fontWeight: 500,
                        lineHeight: '1.5'
                      }}>
                        {getPillarValueProposition(pillarRec.pillarId || pillarRec.pillarName)}
                      </p>
                  </div>
                    
                    {/* Card-based Layout for Good, Bad, and Recommendations */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '24px',
                      padding: '32px'
                    }}>
                      {/* The Good Card */}
                      <div style={{
                        background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                        borderRadius: '12px',
                        padding: '24px',
                        border: '1px solid #bbf7d0',
                        boxShadow: '0 2px 8px rgba(34, 197, 94, 0.1)'
                      }}>
                        <h4 style={{
                          fontSize: '1.3rem',
                          fontWeight: 700,
                          color: '#166534',
                          marginBottom: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          <span style={{ fontSize: '1.5rem' }}>✓</span>
                          What's Working
                        </h4>
                        <ul style={{
                          listStyle: 'none',
                          padding: 0,
                          margin: 0,
                          fontSize: '0.95rem',
                          color: '#15803d',
                          lineHeight: '1.7'
                        }}>
                          {pillarRec.theGood && pillarRec.theGood.length > 0 ? (
                            pillarRec.theGood.map((item, idx) => (
                              <li key={idx} style={{ 
                                marginBottom: '10px',
                                paddingLeft: '20px',
                                position: 'relative'
                              }}>
                                <span style={{
                                  position: 'absolute',
                                  left: '0',
                                  top: '2px',
                                  color: '#22c55e',
                                  fontWeight: 'bold'
                                }}>•</span>
                                {item}
                              </li>
                            ))
                          ) : (
                            <>
                              <li style={{ marginBottom: '10px', paddingLeft: '20px', position: 'relative' }}>
                                <span style={{ position: 'absolute', left: '0', top: '2px', color: '#22c55e', fontWeight: 'bold' }}>•</span>
                                Clear improvement path identified
                              </li>
                              <li style={{ marginBottom: '10px', paddingLeft: '20px', position: 'relative' }}>
                                <span style={{ position: 'absolute', left: '0', top: '2px', color: '#22c55e', fontWeight: 'bold' }}>•</span>
                                Databricks platform ready for enhancement
                              </li>
                            </>
                          )}
                        </ul>
                    </div>
                
                      {/* The Bad Card */}
                      <div style={{
                        background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                        borderRadius: '12px',
                        padding: '24px',
                        border: '1px solid #fecaca',
                        boxShadow: '0 2px 8px rgba(239, 68, 68, 0.1)'
                      }}>
                        <h4 style={{
                          fontSize: '1.3rem',
                          fontWeight: 700,
                          color: '#991b1b',
                          marginBottom: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          <span style={{ fontSize: '1.5rem' }}>⚠</span>
                          KEY CHALLENGES
                        </h4>
                        <ul style={{
                          listStyle: 'none',
                          padding: 0,
                          margin: 0,
                          fontSize: '0.95rem',
                          color: '#b91c1c',
                          lineHeight: '1.7'
                        }}>
                          {pillarRec.theBad && pillarRec.theBad.length > 0 ? (
                            pillarRec.theBad.map((item, idx) => (
                              <li key={idx} style={{ 
                                marginBottom: '10px',
                                paddingLeft: '20px',
                                position: 'relative'
                              }}>
                                <span style={{
                                  position: 'absolute',
                                  left: '0',
                                  top: '2px',
                                  color: '#ef4444',
                                  fontWeight: 'bold'
                                }}>•</span>
                                {item}
                              </li>
                            ))
                          ) : (
                            <>
                              <li style={{ marginBottom: '10px', paddingLeft: '20px', position: 'relative' }}>
                                <span style={{ position: 'absolute', left: '0', top: '2px', color: '#ef4444', fontWeight: 'bold' }}>•</span>
                                {pillarRec.gap}-level maturity gap vs target state
                              </li>
                              <li style={{ marginBottom: '10px', paddingLeft: '20px', position: 'relative' }}>
                                <span style={{ position: 'absolute', left: '0', top: '2px', color: '#ef4444', fontWeight: 'bold' }}>•</span>
                                Opportunities for optimization identified
                              </li>
                            </>
                          )}
                        </ul>
                    </div>
                
                      {/* Recommendations Card */}
                      <div style={{
                        background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                        borderRadius: '12px',
                        padding: '24px',
                        border: '1px solid #bfdbfe',
                        boxShadow: '0 2px 8px rgba(59, 130, 246, 0.1)'
                      }}>
                        <h4 style={{
                          fontSize: '1.3rem',
                          fontWeight: 700,
                          color: '#1e40af',
                          marginBottom: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          <span style={{ fontSize: '1.5rem' }}>→</span>
                          Recommendations
                        </h4>
                        <ol style={{
                          padding: 0,
                          margin: 0,
                          paddingLeft: '24px',
                          fontSize: '0.95rem',
                          color: '#1e40af',
                          lineHeight: '1.7'
                        }}>
                          {(pillarRec.actions || []).slice(0, 3).map((action, idx) => (
                            <li key={idx} style={{ 
                              marginBottom: '12px',
                              color: '#1e3a8a'
                            }}>
                              {typeof action === 'string' ? action : action.action || action.name || 'Action'}
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>
                    
                    {/* View Detailed Results Button */}
                    <div style={{ 
                      marginTop: '24px', 
                      textAlign: 'center',
                      paddingTop: '20px',
                      borderTop: '1px solid #e5e7eb'
                    }}>
                      <button
                        onClick={() => navigate(`/pillar-results/${assessmentId}/${pillarRec.pillarId}`)}
                        style={{
                          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                          color: 'white',
                          border: 'none',
                          padding: '14px 32px',
                          borderRadius: '8px',
                          fontSize: '1rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => {
                          e.target.style.transform = 'translateY(-2px)';
                          e.target.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.4)';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
                        }}
                      >
                        <FiArrowRight size={18} />
                        View Detailed {pillarRec.pillarName} Results
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </Section>
        )}

        {/* 4. ROADMAP TO SUCCESS */}
        {hasData && (results.prioritizedActions?.length > 0 || results.quickWins?.length > 0) && (
        <Section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <SectionTitle>
            <FiTarget size={20} />
            Roadmap to Success
          </SectionTitle>
          
          {results.prioritizedActions?.length > 0 && (
            <>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#111827', marginBottom: '20px', marginTop: '4px' }}>
                Pillar-Specific Recommendations
              </h3>
              {results.prioritizedActions.map((pillarRec, index) => {
                const priorityColor = getPriorityColor(pillarRec.priority);
                const getFeatureStatusColor = (status) => {
                  if (status === 'GA') return '#10b981';
                  if (status === 'Public Preview') return '#3b82f6';
                  if (status === 'Private Preview') return '#8b5cf6';
                  if (status === 'Beta') return '#f59e0b';
                  return '#6b7280';
                };
                
                return (
                  <PillarRecommendationCard 
                key={index}
                    priorityColor={priorityColor}
                  >
                    <PillarHeader>
                      <PillarInfo>
                        <PillarTitle>{pillarRec.pillarName || pillarRec.title}</PillarTitle>
                        <ScoreProgress>
                          <ScoreIndicator type="current">Current: {pillarRec.currentScore}</ScoreIndicator>
                          <span>→</span>
                          <ScoreIndicator type="target">Target: {pillarRec.targetScore}</ScoreIndicator>
                          <ScoreIndicator type="gap">Gap: {pillarRec.gap}</ScoreIndicator>
                        </ScoreProgress>
                      </PillarInfo>
                      <PriorityBadge color={priorityColor}>
                        {pillarRec.priority} Priority
                    </PriorityBadge>
                    </PillarHeader>
                    
                    {pillarRec.rationale && (
                      <RationaleText color={priorityColor}>
                        {pillarRec.rationale.split('\n').map((line, i) => (
                          <span key={i}>
                            {line.includes('**') ? (
                              line.split('**').map((part, j) => 
                                j % 2 === 0 ? part : <strong key={j}>{part}</strong>
                              )
                            ) : line}
                            {i < pillarRec.rationale.split('\n').length - 1 && <br />}
                          </span>
                        ))}
                      </RationaleText>
                    )}
                    
                    {pillarRec.features && Array.isArray(pillarRec.features) && pillarRec.features.length > 0 && (
                      <FeaturesGrid>
                        {pillarRec.features.map((feature, fIndex) => (
                          <FeatureCard 
                            key={fIndex}
                            statusColor={getFeatureStatusColor(feature.status)}
                          >
                            <FeatureHeader>
                              <div>
                                <FeatureName>{feature.name}</FeatureName>
                </div>
                              <StatusBadge statusColor={getFeatureStatusColor(feature.status)}>
                                {feature.status}
                              </StatusBadge>
                            </FeatureHeader>
                            
                            <FeatureAction>
                              <strong>Action:</strong> {feature.action}
                            </FeatureAction>
                            
                            <WhySection>
                              <WhyLabel>Why This Recommendation?</WhyLabel>
                              <WhyText>{feature.why}</WhyText>
                            </WhySection>
                            
                            <FeatureMetrics>
                              <Metric><strong>Effort:</strong> {feature.effort}</Metric>
                              <Metric><strong>Impact:</strong> {feature.impact}</Metric>
                            </FeatureMetrics>
                          </FeatureCard>
                        ))}
                      </FeaturesGrid>
                    )}
                    
                    <div style={{ marginTop: '20px', padding: '12px', background: '#f9fafb', borderRadius: '8px', fontSize: '0.85rem', color: '#6b7280' }}>
                      <strong style={{ color: '#374151' }}>Implementation Timeline:</strong> {pillarRec.timeline} | 
                      <strong style={{ color: '#374151', marginLeft: '12px' }}>Overall Effort:</strong> {pillarRec.effort} | 
                      <strong style={{ color: '#374151', marginLeft: '12px' }}>Business Impact:</strong> {pillarRec.impact}
                    </div>
                  </PillarRecommendationCard>
                );
              })}
            </>
          )}

          {results.quickWins?.length > 0 && (
            <>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#1f2937', marginBottom: '12px', marginTop: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiCheckCircle size={18} color="#10b981" />
                Quick Wins (High Impact, Low Effort)
              </h3>
            <RecommendationsList>
              {results.quickWins.map((win, index) => (
                <RecommendationCard 
                  key={index}
                    priorityColor="#10b981"
                >
                  <RecommendationTitle>{win.title}</RecommendationTitle>
                  <RecommendationDescription>{win.description}</RecommendationDescription>
                  <ActionsList>
                    {win.actions.map((action, actionIndex) => (
                      <ActionItem key={actionIndex}>{action}</ActionItem>
                    ))}
                  </ActionsList>
                </RecommendationCard>
              ))}
            </RecommendationsList>
            </>
          )}
          </Section>
        )}

        {/* 5. ASSESSMENT PROGRESS */}
        {results.assessmentInfo.isPartialAssessment && (
          <>
            <PartialResultsWarning>
              <FiAlertTriangle size={32} />
              <div>
                <h3>Continue Your Assessment - {results.assessmentInfo.completionPercentage}% Complete</h3>
                <p>
                  You've answered {results.assessmentInfo.questionsAnswered} of {results.assessmentInfo.totalQuestions} questions across {results.assessmentInfo.pillarsWithResponses || results.assessmentInfo.completedPillars} of {results.assessmentInfo.totalPillars} pillars. 
                  <strong> Complete more questions to unlock deeper insights and more personalized recommendations!</strong>
                </p>
              </div>
            </PartialResultsWarning>

          <Section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
          >
            <SectionTitle>
                <FiCheckCircle size={20} />
                Continue Assessment ({results.assessmentInfo.completedPillars}/{results.assessmentInfo.totalPillars} Pillars Done)
            </SectionTitle>
            
              <PillarStatusGrid>
                {results.pillarStatus.map((pillar, index) => (
                  <PillarStatusCard
                    key={pillar.id}
                    completed={pillar.completed}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    onClick={() => pillar.completed && navigate(`/pillar-results/${assessmentId}/${pillar.id}`)}
                    whileHover={pillar.completed ? { scale: 1.02 } : {}}
                    whileTap={pillar.completed ? { scale: 0.98 } : {}}
                  >
                    <PillarStatusInfo>
                    <div>
                        {pillar.completed ? (
                          <FiCheckCircle size={20} color="#10b981" />
                        ) : (
                          <div style={{ width: 20, height: 20, border: '2px solid #6b7280', borderRadius: '50%' }} />
                        )}
                    </div>
                      <div>
                        <PillarName>{pillar.name}</PillarName>
                        <PillarStatus>
                          <PillarCompletionBadge completed={pillar.completed}>
                            {pillar.completed ? 'Completed' : 'Pending'}
                          </PillarCompletionBadge>
                        </PillarStatus>
                        {pillar.completed && results.categoryDetails[pillar.id] && (
                          <PillarScore>
                            <ScoreBadge type="current">
                              Current: {results.categoryDetails[pillar.id].currentScore}
                            </ScoreBadge>
                            <ScoreBadge type="future">
                              Future: {results.categoryDetails[pillar.id].futureScore}
                            </ScoreBadge>
                          </PillarScore>
                        )}
                      </div>
                    </PillarStatusInfo>
                    
                    {!pillar.completed && (
                      <ContinueButton
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/assessment/${assessmentId}/${pillar.id}`);
                        }}
                      >
                        Continue
                      </ContinueButton>
                    )}
                    
                    {pillar.completed && (
                      <div style={{ fontSize: '0.9rem', color: '#3b82f6', fontWeight: 600 }}>
                        View Details →
                      </div>
                    )}
                  </PillarStatusCard>
                ))}
              </PillarStatusGrid>
          </Section>
          </>
        )}

      </ContentWrapper>
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
                
                <CancelButton onClick={handleCancelModal}>
                  Cancel
                </CancelButton>
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
                
                <CancelButton onClick={handleCancelModal}>
                  Cancel
                </CancelButton>
              </>
            )}
          </LogoOptionsContent>
        </LogoOptionsModal>
      )}
    </ResultsContainer>
    </>
  );
};

export default AssessmentResults;
