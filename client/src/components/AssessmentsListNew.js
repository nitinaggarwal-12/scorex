import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  FiSearch,
  FiFilter,
  FiMoreVertical,
  FiEdit2,
  FiStar,
  FiDownload,
  FiUpload,
  FiPlus,
  FiChevronDown,
  FiCopy,
  FiTrash2,
  FiAlertTriangle,
  FiTrendingUp
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import axios from 'axios';
import authService from '../services/authService';
import * as assessmentService from '../services/assessmentService';
import dynamicAssessmentService from '../services/dynamicAssessmentService';
import excelService from '../services/excelService';
import { exportAssessmentToExcel } from '../services/excelExportService';

// =======================
// STYLED COMPONENTS
// =======================

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(180deg, #fafbfc 0%, #ffffff 100%);
  position: relative;
  padding-top: 68px;

  @media print {
    background: white !important;
    padding-top: 0;
  }
`;

const ContentContainer = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  padding: 40px 48px;
  position: relative;
  z-index: 1;

  @media (max-width: 1024px) {
    padding: 32px 24px;
  }

  @media (max-width: 768px) {
    padding: 24px 16px;
  }
`;

const HeaderSection = styled.div`
  margin-bottom: 40px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 16px;

  .left {
    flex: 1;
    min-width: 250px;

    h1 {
      font-size: 2.25rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 8px 0;
      letter-spacing: -0.02em;
    }

    p {
      font-size: 1rem;
      color: #475569;
      margin: 0;
    }
  }

  .right {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  @media (max-width: 768px) {
    .left h1 {
      font-size: 1.5rem;
    }

    .left p {
      font-size: 0.875rem;
    }

    .right {
      width: 100%;
      justify-content: stretch;

      button {
        flex: 1;
      }
    }
  }
`;

const Button = styled(motion.button)`
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid transparent;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  @media (max-width: 768px) {
    padding: 9px 16px;
    font-size: 0.813rem;
  }
`;

const PrimaryButton = styled(Button)`
  background: linear-gradient(135deg, #00A972 0%, #008c5f 100%);
  color: white;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 169, 114, 0.25);

  &:hover {
    background: linear-gradient(135deg, #008c5f 0%, #007550 100%);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 169, 114, 0.35);
  }

  &:active {
    transform: translateY(0);
  }
`;

const SecondaryButton = styled(Button)`
  background: white;
  color: #64748b;
  border: 2px solid #cbd5e1;

  &:hover {
    background: #f8fafc;
    border-color: #94a3b8;
    color: #475569;
  }
`;

const FilterBar = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);

  .top-row {
    display: flex;
    gap: 12px;
    margin-bottom: 16px;
    flex-wrap: wrap;
  }

  .bottom-row {
    display: flex;
    gap: 12px;
    align-items: center;
    flex-wrap: wrap;
  }

  @media (max-width: 768px) {
    padding: 16px;

    .top-row, .bottom-row {
      gap: 8px;
    }
  }
`;

const SearchBox = styled.div`
  position: relative;
  flex: 1;
  min-width: 250px;

  input {
    width: 100%;
    padding: 10px 12px 10px 40px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 0.875rem;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

    &:focus {
      outline: none;
      border-color: #00A972;
      box-shadow: 0 0 0 3px rgba(0, 169, 114, 0.1);
    }

    &::placeholder {
      color: #9ca3af;
    }
  }

  svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
  }

  @media (max-width: 768px) {
    min-width: 100%;

    input {
      padding: 9px 12px 9px 36px;
    }
  }
`;

const TabGroup = styled.div`
  display: flex;
  gap: 8px;
  background: #f3f4f6;
  padding: 4px;
  border-radius: 8px;
`;

const Tab = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: ${props => props.$active ? '600' : '500'};
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  background: ${props => props.$active ? 'white' : 'transparent'};
  color: ${props => props.$active ? '#1e293b' : '#64748b'};
  box-shadow: ${props => props.$active ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'};

  &:hover {
    color: ${props => props.$active ? '#1e293b' : '#FF3621'};
  }

  @media (max-width: 768px) {
    padding: 6px 12px;
    font-size: 0.813rem;
  }
`;

const Dropdown = styled.select`
  padding: 8px 32px 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #374151;
  background: white;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M3 4.5L6 7.5L9 4.5' stroke='%236b7280' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &:focus {
    outline: none;
    border-color: #00A972;
    box-shadow: 0 0 0 3px rgba(0, 169, 114, 0.1);
  }

  @media (max-width: 768px) {
    padding: 7px 28px 7px 10px;
    font-size: 0.813rem;
  }
`;

const BulkActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);

  .left {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .right {
    font-size: 0.875rem;
    color: #6b7280;
  }

  label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.875rem;
    color: #374151;
    cursor: pointer;
  }

  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    cursor: pointer;
  }

  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 12px;

    .left {
      flex: 1;
      min-width: 100%;
    }

    .right {
      width: 100%;
      text-align: right;
    }
  }
`;

const AssessmentsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const AssessmentCard = styled(motion.div)`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);

  &:hover {
    border-color: #cbd5e1;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    transform: translateY(-4px);
  }

  @media print {
    box-shadow: none !important;
    border: 1px solid #e2e8f0 !important;
    transform: none !important;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;
  }

  .title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #111827;
    margin-bottom: 8px;
  }

  .meta {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 0.813rem;
    color: #6b7280;
    margin-bottom: 16px;
    flex-wrap: wrap;
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 6px;

    svg {
      width: 16px;
      height: 16px;
    }
  }

  .pillars {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 16px;
  }

  .progress-section {
    margin-bottom: 16px;
  }

  .progress-label {
    display: flex;
    justify-content: space-between;
    font-size: 0.813rem;
    color: #6b7280;
    margin-bottom: 6px;
  }

  .progress-bar {
    height: 6px;
    background: #f3f4f6;
    border-radius: 3px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #00A972 0%, #008c5f 100%);
    border-radius: 3px;
    transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-top: 16px;
    border-top: 1px solid #f3f4f6;
  }

  .actions {
    display: flex;
    gap: 8px;
  }

  @media (max-width: 768px) {
    padding: 16px;

    .title {
      font-size: 1rem;
    }

    .meta {
      font-size: 0.75rem;
    }
  }
`;

const StatusBadge = styled.span`
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
  
  ${props => {
    switch (props.$status) {
      case 'completed':
        return `
          background: #00A972;
          color: white;
        `;
      case 'in_progress':
        return `
          background: #1B3B6F;
          color: white;
        `;
      case 'not_started':
        return `
          background: #f3f4f6;
          color: #64748b;
        `;
      default:
        return `
          background: #f3f4f6;
          color: #64748b;
        `;
    }
  }}
`;

const PillarTag = styled.span`
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  background: #f8fafc;
  color: #475569;
  border: 1px solid #e2e8f0;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
`;

const ActionButton = styled.button`
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 0.813rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  background: white;
  color: #64748b;
  border: 1px solid #e2e8f0;

  &:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
    color: #475569;
  }

  &.primary {
    background: #1B3B6F;
    color: white;
    border-color: #1B3B6F;

    &:hover {
      background: #152d55;
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: #e2e8f0;
    color: #94a3b8;
    border-color: #e2e8f0;

    &:hover {
      background: #e2e8f0;
      color: #94a3b8;
      border-color: #e2e8f0;
    }

    &.primary {
      background: #cbd5e1;
      color: #94a3b8;
      border-color: #cbd5e1;

      &:hover {
        background: #cbd5e1;
      }
    }
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

const FloatingBatchBar = styled(motion.div)`
  position: fixed;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  background: #0f172a;
  color: white;
  border-radius: 16px;
  padding: 12px 24px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  gap: 16px;
  z-index: 1000;
  border: 1px solid rgba(255, 255, 255, 0.15);

  @media (max-width: 768px) {
    width: 92%;
    flex-wrap: wrap;
    padding: 10px 14px;
    gap: 8px;
    justify-content: center;
  }
`;

const BatchActionButton = styled.button`
  padding: 7px 14px;
  border-radius: 8px;
  font-size: 0.825rem;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: none;
  transition: all 0.2s ease;
  background: ${props => props.$danger ? '#ef4444' : props.$primary ? '#3b82f6' : 'rgba(255, 255, 255, 0.12)'};
  color: white;

  &:hover {
    transform: translateY(-1px);
    background: ${props => props.$danger ? '#dc2626' : props.$primary ? '#2563eb' : 'rgba(255, 255, 255, 0.2)'};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 20px;

  .icon {
    font-size: 4rem;
    margin-bottom: 16px;
    opacity: 0.3;
    color: #64748b;
  }

  .title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 8px;
  }

  .message {
    font-size: 1rem;
    color: #64748b;
    margin-bottom: 24px;
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

// =======================
// COMPONENT
// =======================

const AssessmentsListNew = () => {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [suiteFilter, setSuiteFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pillarFilter, setPillarFilter] = useState('all');
  const [ownerFilter, setOwnerFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [industryFilter, setIndustryFilter] = useState('all');
  const [completionRangeFilter, setCompletionRangeFilter] = useState('all');
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);
  const [uploadingExcel, setUploadingExcel] = useState(null); // Track which assessment is being uploaded
  const [selectedIds, setSelectedIds] = useState(new Set());
  const fileInputRef = React.useRef(null);

  useEffect(() => {
    fetchAssessments();
  }, []);

  const normalizeAssessmentRecord = (raw, family = 'classic') => {
    const id = raw.id || raw.assessmentId;
    const rawOrg = raw.organization_name || raw.organizationName || raw.customerName || raw.customer_name || raw.meta?.organizationName || raw.meta?.customerName;
    const orgName = (rawOrg && rawOrg !== 'Unknown Org' && rawOrg !== 'Not specified') ? rawOrg : 'Enterprise Organization';

    const rawName = raw.assessment_name || raw.assessmentName || raw.meta?.systemName || (raw.frameworkSnapshot?.title ? `${orgName} - ${raw.frameworkSnapshot.title}` : null);
    const defaultTitleByFamily = {
      classic: `${orgName} - Enterprise Data & AI Maturity Assessment`,
      dynamic: `${orgName} - ${raw.frameworkSnapshot?.title || 'Dynamic Blueprint Assessment'}`,
      genai: `${orgName} - GenAI Readiness & Governance Assessment`,
      eu_ai_act: `${orgName} - EU AI Act Statutory Dossier (${raw.meta?.systemName || 'High-Risk AI System'})`
    };
    const assessmentName = (rawName && rawName !== 'Untitled Assessment') ? rawName : (defaultTitleByFamily[family] || `${orgName} - Enterprise Assessment`);

    const rawEmail = raw.contact_email || raw.contactEmail || raw.meta?.assessorEmail || raw.createdBy || raw.ownerId || raw.owner_id;
    const isSystemMarker = !rawEmail || ['unknown', 'system', 'guest_admin', 'system_unowned', 'demo_guest', 'admin_guest', 'guest', 'public'].includes(String(rawEmail).toLowerCase().trim());
    const email = !isSystemMarker ? rawEmail : 'architect@scorex.ai';
    const creatorName = raw.creator_name || (email.includes('@') ? email.split('@')[0] : email) || 'Enterprise Architect';

    const rawIndustry = raw.industry || raw.frameworkSnapshot?.badge || raw.meta?.sector || raw.maturityLevel || raw.maturity_level;
    const industry = (rawIndustry && rawIndustry !== 'Not specified') ? rawIndustry : (
      family === 'eu_ai_act' ? 'EU AI Act Annex III' :
      family === 'genai' ? 'GenAI & Agentic AI' :
      family === 'dynamic' ? 'Cloud & Zero-Trust' : 'Enterprise Data & AI'
    );

    const createdAt = raw.created_at || raw.createdAt || raw.startedAt || raw.started_at || raw.completedAt || raw.completed_at || '2026-08-15T14:30:00.000Z';
    const updatedAt = raw.updated_at || raw.updatedAt || raw.completedAt || raw.completed_at || createdAt;

    // Calculate accurate progress & status
    let progress = 0;
    let status = 'not_started';
    let completedCategories = raw.completedCategories || raw.completed_categories || [];

    if (family === 'dynamic') {
      const dims = raw.frameworkSnapshot?.dimensions || [];
      const totalQuestions = dims.reduce((acc, d) => acc + (d.questions?.length || 0), 0);
      const answeredCount = Object.keys(raw.responses || {}).filter(k => !k.includes('_')).length;
      progress = totalQuestions > 0
        ? Math.min(100, Math.round((answeredCount / totalQuestions) * 100))
        : (raw.status === 'completed' || raw.status === 'submitted' ? 100 : (Number(raw.progress) || 0));
      completedCategories = dims.filter(d => {
        const qCount = d.questions?.length || 0;
        const ansInDim = (d.questions || []).filter(q => raw.responses?.[q.id] !== undefined).length;
        return qCount > 0 && ansInDim === qCount;
      }).map(d => d.name || d.id);
      if (raw.status === 'completed' || raw.status === 'submitted' || progress >= 100) {
        status = 'completed';
        progress = 100;
      } else if (progress > 0 || answeredCount > 0) {
        status = 'in_progress';
      }
    } else if (family === 'genai') {
      const answeredCount = Object.keys(raw.responses || {}).length;
      const isComplete = Boolean(raw.completedAt || raw.completed_at || raw.status === 'completed' || answeredCount >= 12);
      progress = isComplete ? 100 : Math.min(95, Math.round((answeredCount / 15) * 100));
      status = isComplete ? 'completed' : (progress > 0 ? 'in_progress' : 'not_started');
      completedCategories = isComplete ? ['generative_ai', 'platform_governance'] : (progress > 0 ? ['generative_ai'] : []);
    } else if (family === 'eu_ai_act') {
      const answeredCount = Object.keys(raw.answers || {}).length;
      const isComplete = Boolean(raw.synthesis || answeredCount >= 8);
      progress = isComplete ? 100 : Math.min(95, Math.round((answeredCount / 10) * 100));
      status = isComplete ? 'completed' : (progress > 0 ? 'in_progress' : 'not_started');
      completedCategories = isComplete ? ['platform_governance', 'generative_ai'] : (progress > 0 ? ['platform_governance'] : []);
    } else {
      // Classic 6-Pillar
      const isComplete = raw.status === 'completed' || raw.status === 'submitted' || Number(raw.progress) >= 100 || completedCategories.length >= 6;
      if (isComplete) {
        status = 'completed';
        progress = 100;
      } else {
        const pillarCount = completedCategories.length;
        const respCount = Object.keys(raw.responses || {}).length;
        progress = Number(raw.progress) > 0 ? Number(raw.progress) : Math.min(95, Math.round((pillarCount / 6) * 100) || (respCount > 0 ? 25 : 0));
        status = (progress > 0 || respCount > 0) ? 'in_progress' : 'not_started';
      }
    }

    const suiteBadges = {
      classic: { label: 'Core 6-Pillar', bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
      dynamic: { label: 'Dynamic Blueprint', bg: '#f3e8ff', text: '#6d28d9', border: '#ddd6fe' },
      genai: { label: 'GenAI Readiness', bg: '#ecfdf5', text: '#047857', border: '#a7f3d0' },
      eu_ai_act: { label: 'EU AI Act Dossier', bg: '#fffbeb', text: '#b45309', border: '#fde68a' }
    };

    const selectedPillars = raw.selected_pillars || raw.selectedPillars || ['platform_governance', 'data_engineering', 'analytics_bi', 'machine_learning', 'generative_ai', 'operational_excellence'];

    return {
      ...raw,
      id,
      assessmentId: id,
      assessmentFamily: family,
      isDynamic: family === 'dynamic',
      suiteBadge: suiteBadges[family] || suiteBadges.classic,
      assessment_name: assessmentName,
      assessmentName: assessmentName,
      organization_name: orgName,
      organizationName: orgName,
      contact_email: email,
      contactEmail: email,
      creator_name: creatorName,
      industry,
      status,
      progress,
      completedCategories,
      selected_pillars: selectedPillars,
      selectedPillars: selectedPillars,
      created_at: createdAt,
      createdAt: createdAt,
      updated_at: updatedAt,
      updatedAt: updatedAt
    };
  };

  const fetchAssessments = async () => {
    try {
      setLoading(true);
      const headers = authService.getAuthHeader ? authService.getAuthHeader() : {};
      const [classicData, dynamicInstances, genaiData, euAiData] = await Promise.allSettled([
        assessmentService.getAssessments(),
        dynamicAssessmentService.getInstances(),
        axios.get('/api/genai-readiness/assessments', { headers }),
        axios.get('/api/eu-ai-compliance/dossiers', { headers })
      ]);

      const classicList = classicData.status === 'fulfilled' && Array.isArray(classicData.value)
        ? classicData.value.map(item => normalizeAssessmentRecord(item, 'classic'))
        : [];

      const dynamicList = dynamicInstances.status === 'fulfilled' && Array.isArray(dynamicInstances.value)
        ? dynamicInstances.value.map(item => normalizeAssessmentRecord(item, 'dynamic'))
        : [];

      const genaiRaw = genaiData.status === 'fulfilled' && Array.isArray(genaiData.value?.data)
        ? genaiData.value.data
        : [];
      const genaiList = genaiRaw.map(item => normalizeAssessmentRecord(item, 'genai'));

      const euAiRaw = euAiData.status === 'fulfilled' && Array.isArray(euAiData.value?.data?.dossiers)
        ? euAiData.value.data.dossiers
        : [];
      const euAiList = euAiRaw.map(item => normalizeAssessmentRecord(item, 'eu_ai_act'));

      setAssessments([...euAiList, ...genaiList, ...dynamicList, ...classicList]);
    } catch (error) {
      console.error('Error fetching assessments:', error);
      setAssessments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAll = async () => {
    try {
      toast.loading('Deleting all assessments...', { id: 'delete-all' });
      const result = await assessmentService.deleteAllAssessments();
      
      if (result && result.success) {
        setShowDeleteAllConfirm(false);
        await fetchAssessments(); // Refresh the list
      }
    } catch (error) {
      console.error('Error deleting all assessments:', error);
    }
  };

  const handleGenerateSample = async (level) => {
    try {
      toast.loading(`Generating ${level} sample assessment...`, { id: 'sample' });
      const result = await assessmentService.generateSampleAssessment(level);
      
      if (result && result.id) {
        await fetchAssessments();
        navigate(`/results/${result.id}`);
      }
    } catch (error) {
      console.error('Error generating sample:', error);
    }
  };

  const handleExportAssessment = async (assessmentId, assessmentName, event) => {
    event.stopPropagation();
    try {
      toast.loading('Exporting assessment...', { id: 'export' });
      await exportAssessmentToExcel(assessmentId, assessmentName);
    } catch (error) {
      console.error('Error exporting:', error);
    }
  };

  const handleCloneAssessment = async (assessment, event) => {
    event.stopPropagation();
    try {
      toast.loading('Cloning assessment...', { id: 'clone' });
      const family = assessment.assessmentFamily || (assessment.isDynamic ? 'dynamic' : 'classic');
      const id = assessment.id || assessment.assessmentId;

      if (family === 'dynamic') {
        await dynamicAssessmentService.cloneInstance(id, 'Next Quarter');
        toast.success('Dynamic blueprint cloned for next quarter review!', { id: 'clone' });
      } else if (family === 'genai') {
        const headers = authService.getAuthHeader ? authService.getAuthHeader() : {};
        await axios.post('/api/genai-readiness/assessments', {
          customerName: `${assessment.organization_name || 'Organization'} (Copy)`,
          responses: assessment.responses || {},
          scores: assessment.scores || {},
          totalScore: assessment.totalScore || 0,
          maxScore: assessment.maxScore || 100,
          maturityLevel: assessment.maturityLevel || 'Developing'
        }, { headers });
        toast.success('GenAI Readiness assessment cloned!', { id: 'clone' });
      } else if (family === 'eu_ai_act') {
        const headers = authService.getAuthHeader ? authService.getAuthHeader() : {};
        const newId = `EU-AI-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        await axios.post(`/api/eu-ai-compliance/dossiers/${newId}`, {
          meta: { ...(assessment.meta || {}), systemName: `${assessment.meta?.systemName || assessment.assessment_name} (Copy)` },
          answers: assessment.answers || {},
          synthesis: assessment.synthesis || null
        }, { headers });
        toast.success(`EU AI Act Dossier cloned (${newId})!`, { id: 'clone' });
      } else {
        const clonedData = {
          organizationName: assessment.organization_name || assessment.organizationName || 'Enterprise Organization',
          contactEmail: assessment.contact_email || assessment.contactEmail || 'architect@scorex.ai',
          industry: assessment.industry || 'Enterprise Data & AI',
          assessmentName: `${assessment.assessment_name || assessment.assessmentName || 'Assessment'} (Copy)`,
          assessmentDescription: assessment.assessmentDescription || ''
        };
        await assessmentService.cloneAssessment(id, clonedData);
        toast.success('Assessment cloned successfully!', { id: 'clone' });
      }
      
      await fetchAssessments();
    } catch (error) {
      console.error('Error cloning assessment:', error);
      toast.error('Failed to clone assessment', { id: 'clone' });
    }
  };

  const handleDeleteAssessment = async (assessment, assessmentName, event) => {
    event.stopPropagation();
    const assessmentId = typeof assessment === 'object' ? (assessment.id || assessment.assessmentId) : assessment;
    const family = typeof assessment === 'object' ? (assessment.assessmentFamily || (assessment.isDynamic ? 'dynamic' : 'classic')) : 'classic';
    const name = assessmentName || (typeof assessment === 'object' ? (assessment.assessment_name || assessment.assessmentName) : 'this assessment');
    
    if (!window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }
    
    try {
      toast.loading('Deleting assessment...', { id: 'delete' });
      const headers = authService.getAuthHeader ? authService.getAuthHeader() : {};
      if (family === 'dynamic') {
        await dynamicAssessmentService.deleteInstance(assessmentId);
      } else if (family === 'genai') {
        await axios.delete(`/api/genai-readiness/assessments/${assessmentId}`, { headers });
      } else if (family === 'eu_ai_act') {
        await axios.delete(`/api/eu-ai-compliance/dossiers/${assessmentId}`, { headers });
      } else {
        await assessmentService.deleteAssessment(assessmentId);
      }
      toast.success('Assessment deleted successfully', { id: 'delete' });
      await fetchAssessments();
    } catch (error) {
      console.error('Error deleting assessment:', error);
      toast.error('Failed to delete assessment', { id: 'delete' });
    }
  };

  // Handle Excel Export
  const handleExportToExcel = async (assessment, e) => {
    e?.stopPropagation();
    const family = assessment.assessmentFamily || (assessment.isDynamic ? 'dynamic' : 'classic');
    
    try {
      toast.loading(`Generating Excel file for ${assessment.assessment_name}...`, { id: 'excel-export' });
      if (family === 'genai') {
        window.open(`/api/genai-readiness/assessments/${assessment.id}/excel`, '_blank');
        toast.success(`✅ GenAI Readiness Excel downloaded!`, { id: 'excel-export' });
        return;
      }
      const blob = await excelService.exportAssessment(assessment.id);
      const fileName = `${(assessment.assessment_name || 'Assessment').replace(/[^a-zA-Z0-9_-]/g, '_')}_${assessment.id}_${new Date().toISOString().split('T')[0]}.xlsx`;
      
      excelService.downloadFile(blob, fileName);
      
      toast.success(`✅ Excel file downloaded successfully!`, { id: 'excel-export' });
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      toast.error(`Failed to export: ${error.message}`, { id: 'excel-export' });
    }
  };

  // Handle Excel Import
  const handleImportFromExcel = async (assessment, e) => {
    e?.stopPropagation();
    setUploadingExcel(assessment.id);
    
    // Trigger file input click
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('data-assessment-id', assessment.id);
      fileInputRef.current.click();
    }
  };

  // Handle file selection
  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    const assessmentId = e.target.getAttribute('data-assessment-id');
    
    if (!file || !assessmentId) {
      setUploadingExcel(null);
      return;
    }
    
    // Validate file type
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      toast.error('Please upload a valid Excel file (.xlsx or .xls)');
      setUploadingExcel(null);
      e.target.value = ''; // Reset input
      return;
    }
    
    try {
      toast.loading(`Importing Excel file...`, { id: 'excel-import' });
      
      const result = await excelService.importAssessment(assessmentId, file);
      
      toast.success(
        `✅ ${result.message}\n${result.stats.updated} questions updated`,
        { id: 'excel-import', duration: 5000 }
      );
      
      // Clear any cached assessment data in localStorage
      const currentAssessmentKey = `assessment_${assessmentId}`;
      if (localStorage.getItem(currentAssessmentKey)) {
        localStorage.removeItem(currentAssessmentKey);
      }
      
      // Refresh assessments list
      await fetchAssessments();
      
      // Show a helpful message if user has the assessment open
      setTimeout(() => {
        toast.success(
          '💡 If you have this assessment open in another tab, refresh the page to see your changes.',
          { duration: 7000 }
        );
      }, 500);
      
      // Show detailed error report if there are errors
      if (result.errors && result.errors.length > 0) {
        console.warn('Import errors:', result.errors);
        toast.error(
          `⚠️ ${result.errors.length} row(s) had issues. Check console for details.`,
          { duration: 5000 }
        );
      }
    } catch (error) {
      console.error('Error importing Excel:', error);
      toast.error(`Failed to import: ${error.message}`, { id: 'excel-import' });
    } finally {
      setUploadingExcel(null);
      e.target.value = ''; // Reset input
    }
  };

  const handleToggleSelect = (id, event) => {
    event.stopPropagation();
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedIds.size === filteredAssessments.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredAssessments.map(a => a.id || a.assessmentId)));
    }
  };

  const handleBatchDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.size} selected assessment(s)? This action cannot be undone.`)) {
      return;
    }
    try {
      toast.loading(`Deleting ${selectedIds.size} assessments...`, { id: 'batch-delete' });
      const ids = Array.from(selectedIds);
      const dynamicIds = [];
      const classicIds = [];

      assessments.forEach(a => {
        const aId = a.id || a.assessmentId;
        if (ids.includes(aId)) {
          if (a.isDynamic) dynamicIds.push(aId);
          else classicIds.push(aId);
        }
      });

      if (dynamicIds.length > 0) {
        await dynamicAssessmentService.batchDeleteInstances(dynamicIds);
      }
      if (classicIds.length > 0) {
        await Promise.all(classicIds.map(id => assessmentService.deleteAssessment(id)));
      }

      toast.success(`Successfully deleted ${ids.length} assessment(s)`, { id: 'batch-delete' });
      setSelectedIds(new Set());
      await fetchAssessments();
    } catch (err) {
      console.error('Batch delete error:', err);
      toast.error('Failed to batch delete assessments', { id: 'batch-delete' });
    }
  };

  const handleBatchClone = async () => {
    if (selectedIds.size === 0) return;
    try {
      toast.loading(`Cloning ${selectedIds.size} assessments...`, { id: 'batch-clone' });
      const ids = Array.from(selectedIds);
      const dynamicIds = [];
      const classicItems = [];

      assessments.forEach(a => {
        const aId = a.id || a.assessmentId;
        if (ids.includes(aId)) {
          if (a.isDynamic) dynamicIds.push(aId);
          else classicItems.push(a);
        }
      });

      if (dynamicIds.length > 0) {
        await dynamicAssessmentService.batchCloneInstances(dynamicIds, 'Quarterly Clone');
      }
      if (classicItems.length > 0) {
        await Promise.all(classicItems.map(a => assessmentService.cloneAssessment(a.id || a.assessmentId, {
          organizationName: a.organization_name,
          contactEmail: a.contact_email,
          industry: a.industry,
          assessmentName: `${a.assessment_name} (Copy)`,
          assessmentDescription: a.assessmentDescription
        })));
      }

      toast.success(`Successfully cloned ${ids.length} assessment(s)!`, { id: 'batch-clone' });
      setSelectedIds(new Set());
      await fetchAssessments();
    } catch (err) {
      console.error('Batch clone error:', err);
      toast.error('Failed to batch clone assessments', { id: 'batch-clone' });
    }
  };

  const getStatusFromAssessment = (assessment) => {
    if (assessment.status === 'completed' || assessment.status === 'submitted' || Number(assessment.progress) >= 100) {
      return 'completed';
    }
    if (assessment.status === 'in_progress' || (assessment.completedCategories && assessment.completedCategories.length > 0) || Number(assessment.progress) > 0) {
      return 'in_progress';
    }
    if (assessment.responses && Object.keys(assessment.responses).length > 0) {
      return 'in_progress';
    }
    return 'not_started';
  };

  const getStatusLabel = (assessment) => {
    const status = getStatusFromAssessment(assessment);
    return status === 'in_progress' ? 'In Progress' : 
           status === 'completed' ? 'Completed' : 
           'Not Started';
  };

  const getProgressPercentage = (assessment) => {
    if (assessment.status === 'completed' || assessment.status === 'submitted' || Number(assessment.progress) >= 100) {
      return 100;
    }
    if (typeof assessment.progress === 'number' && !isNaN(assessment.progress) && assessment.progress > 0) {
      return Math.min(99, Math.round(assessment.progress));
    }
    const totalPillars = 6;
    const completedCount = assessment.completedCategories?.length || 0;
    const percentage = Math.round((completedCount / totalPillars) * 100);
    return percentage >= 100 ? 99 : percentage;
  };

  // Filter and sort assessments
  const filteredAssessments = assessments.filter(assessment => {
    const matchesSuite =
      suiteFilter === 'all' ||
      (assessment.assessmentFamily || 'classic') === suiteFilter;

    const q = searchTerm.toLowerCase().trim();
    const matchesSearch = 
      q === '' ||
      (assessment.assessment_name || assessment.assessmentName || '').toLowerCase().includes(q) ||
      (assessment.organization_name || assessment.organizationName || '').toLowerCase().includes(q) ||
      (assessment.contact_email || assessment.contactEmail || '').toLowerCase().includes(q) ||
      (assessment.industry || '').toLowerCase().includes(q) ||
      (assessment.suiteBadge?.label || '').toLowerCase().includes(q);

    const actualStatus = getStatusFromAssessment(assessment);
    const matchesStatus = 
      statusFilter === 'all' ||
      statusFilter === actualStatus;

    const matchesPillar = 
      pillarFilter === 'all' ||
      (assessment.completedCategories && (
        assessment.completedCategories.includes(pillarFilter) ||
        (pillarFilter === 'machine_learning' && assessment.completedCategories.includes('ml_mlops')) ||
        (pillarFilter === 'generative_ai' && assessment.completedCategories.includes('genai_agentic')) ||
        (pillarFilter === 'ml_mlops' && assessment.completedCategories.includes('machine_learning')) ||
        (pillarFilter === 'genai_agentic' && assessment.completedCategories.includes('generative_ai'))
      ));

    const matchesOwner = 
      ownerFilter === 'all' ||
      (assessment.contact_email || assessment.contactEmail || '').toLowerCase().includes(ownerFilter.toLowerCase());

    const matchesIndustry = 
      industryFilter === 'all' ||
      (assessment.industry || '').toLowerCase() === industryFilter.toLowerCase();

    const progress = getProgressPercentage(assessment);
    const matchesCompletionRange = 
      completionRangeFilter === 'all' ||
      (completionRangeFilter === '0-25' && progress <= 25) ||
      (completionRangeFilter === '26-50' && progress > 25 && progress <= 50) ||
      (completionRangeFilter === '51-75' && progress > 50 && progress <= 75) ||
      (completionRangeFilter === '76-100' && progress > 75);

    return matchesSuite && matchesSearch && matchesStatus && matchesPillar && matchesOwner && matchesIndustry && matchesCompletionRange;
  });

  const sortedAssessments = [...filteredAssessments].sort((a, b) => {
    switch (sortBy) {
      case 'recent': {
        const timeB = new Date(b.updated_at || b.updatedAt || b.created_at || b.createdAt || 0).getTime() || 0;
        const timeA = new Date(a.updated_at || a.updatedAt || a.created_at || a.createdAt || 0).getTime() || 0;
        return timeB - timeA;
      }
      case 'name':
        return (a.assessment_name || a.assessmentName || '').localeCompare(b.assessment_name || b.assessmentName || '');
      case 'progress':
        return getProgressPercentage(b) - getProgressPercentage(a);
      default:
        return 0;
    }
  });

  const getTimeAgo = (dateString) => {
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return '1 day ago';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString();
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true 
    });
  };

  const pillars = [
    { id: 'platform_governance', name: 'Platform & Governance' },
    { id: 'data_engineering', name: 'Data Engineering' },
    { id: 'analytics_bi', name: 'Analytics & BI' },
    { id: 'machine_learning', name: 'ML & MLOps' },
    { id: 'generative_ai', name: 'GenAI & Agentic' },
    { id: 'operational_excellence', name: 'Operational Excellence' }
  ];

  if (loading) {
    return (
      <PageContainer>
        <LoadingContainer>
          <div className="spinner">
            <div className="text">Loading assessments...</div>
          </div>
        </LoadingContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <ContentContainer>
        {/* Header */}
        <HeaderSection>
          <div className="left">
            <h1>Assessments</h1>
            <p>Browse, filter, and manage all maturity assessments in one place.</p>
          </div>
          <div className="right" style={{ display: 'flex', gap: '12px' }}>
            {assessments.length > 0 && (
              <button
                onClick={() => setShowDeleteAllConfirm(true)}
                style={{
                  padding: '10px 20px',
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.background = '#dc2626'}
                onMouseLeave={(e) => e.target.style.background = '#ef4444'}
              >
                <FiTrash2 size={16} />
                Delete All
              </button>
            )}
            <PrimaryButton
              onClick={() => navigate('/start')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiPlus size={16} />
              New Assessment
            </PrimaryButton>
          </div>
        </HeaderSection>

        {/* Suite Filter Bar */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
          marginBottom: '16px',
          alignItems: 'center'
        }}>
          {[
            { id: 'all', label: 'All Suites', count: assessments.length, color: '#0f172a' },
            { id: 'classic', label: 'Core 6-Pillar', count: assessments.filter(a => (a.assessmentFamily || 'classic') === 'classic').length, color: '#1d4ed8' },
            { id: 'dynamic', label: 'Dynamic Blueprints', count: assessments.filter(a => a.assessmentFamily === 'dynamic').length, color: '#6d28d9' },
            { id: 'genai', label: 'GenAI Readiness', count: assessments.filter(a => a.assessmentFamily === 'genai').length, color: '#047857' },
            { id: 'eu_ai_act', label: 'EU AI Act Dossiers', count: assessments.filter(a => a.assessmentFamily === 'eu_ai_act').length, color: '#b45309' }
          ].map(suite => {
            const isActive = suiteFilter === suite.id;
            return (
              <button
                key={suite.id}
                data-suite-filter={suite.id}
                onClick={() => setSuiteFilter(suite.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '999px',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 700 : 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: isActive ? suite.color : '#ffffff',
                  color: isActive ? '#ffffff' : '#475569',
                  border: `1.5px solid ${isActive ? suite.color : '#e2e8f0'}`,
                  boxShadow: isActive ? '0 4px 12px rgba(15, 23, 42, 0.12)' : '0 1px 2px rgba(0, 0, 0, 0.04)'
                }}
              >
                <span>{suite.label}</span>
                <span style={{
                  background: isActive ? 'rgba(255, 255, 255, 0.22)' : '#f1f5f9',
                  color: isActive ? '#ffffff' : '#334155',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  fontWeight: 700
                }}>
                  {suite.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Filter Bar */}
        <FilterBar>
          <div className="top-row">
            <SearchBox>
              <FiSearch size={18} />
              <input
                type="text"
                placeholder="Search assessments, orgs, owners..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </SearchBox>
            <TabGroup>
              <Tab 
                $active={statusFilter === 'all'} 
                onClick={() => setStatusFilter('all')}
              >
                All
              </Tab>
              <Tab 
                $active={statusFilter === 'in_progress'} 
                onClick={() => setStatusFilter('in_progress')}
              >
                In Progress
              </Tab>
              <Tab 
                $active={statusFilter === 'completed'} 
                onClick={() => setStatusFilter('completed')}
              >
                Completed
              </Tab>
              <Tab 
                $active={statusFilter === 'not_started'} 
                onClick={() => setStatusFilter('not_started')}
              >
                Not Started
              </Tab>
            </TabGroup>
          </div>
          <div className="bottom-row">
            <Dropdown value={pillarFilter} onChange={(e) => setPillarFilter(e.target.value)}>
              <option value="all">All pillars</option>
              {pillars.map(pillar => (
                <option key={pillar.id} value={pillar.id}>{pillar.name}</option>
              ))}
            </Dropdown>
            <Dropdown value={ownerFilter} onChange={(e) => setOwnerFilter(e.target.value)}>
              <option value="all">All owners</option>
              {[...new Set(assessments.map(a => a.contact_email || a.contactEmail).filter(Boolean))].map(email => (
                <option key={email} value={email}>{email.split('@')[0]}</option>
              ))}
            </Dropdown>
            <Dropdown value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="recent">Sort by: Recent</option>
              <option value="name">Sort by: Name</option>
              <option value="progress">Sort by: Progress</option>
            </Dropdown>
            <SecondaryButton 
              style={{ padding: '8px 16px' }}
              onClick={() => setShowMoreFilters(!showMoreFilters)}
            >
              <FiFilter size={16} />
              More filters {showMoreFilters ? '▲' : '▼'}
            </SecondaryButton>
          </div>
        </FilterBar>

        {/* More Filters Panel */}
        {showMoreFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{ marginBottom: '12px', fontWeight: 600, color: '#111827' }}>
              Additional Filters
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '4px', display: 'block' }}>
                  Industry
                </label>
                <Dropdown value={industryFilter} onChange={(e) => setIndustryFilter(e.target.value)}>
                  <option value="all">All industries</option>
                  {[...new Set(assessments.map(a => a.industry).filter(Boolean))].map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </Dropdown>
              </div>
              <div>
                <label style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '4px', display: 'block' }}>
                  Completion Range
                </label>
                <Dropdown value={completionRangeFilter} onChange={(e) => setCompletionRangeFilter(e.target.value)}>
                  <option value="all">All ranges</option>
                  <option value="0-25">0-25%</option>
                  <option value="26-50">26-50%</option>
                  <option value="51-75">51-75%</option>
                  <option value="76-100">76-100%</option>
                </Dropdown>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <SecondaryButton
                  onClick={() => {
                    setIndustryFilter('all');
                    setCompletionRangeFilter('all');
                    setPillarFilter('all');
                    setOwnerFilter('all');
                    setStatusFilter('all');
                    setSearchTerm('');
                  }}
                  style={{ width: '100%' }}
                >
                  Clear All Filters
                </SecondaryButton>
              </div>
            </div>
          </motion.div>
        )}

        {/* Results Count */}
        <BulkActionBar>
          <div className="left">
            <div style={{ fontSize: '0.938rem', color: '#6b7280', fontWeight: 500 }}>
              {sortedAssessments.length} assessment{sortedAssessments.length !== 1 ? 's' : ''} found
            </div>
          </div>
          <div className="right">
            {/* Bulk actions removed - use individual Export buttons on assessment cards */}
          </div>
        </BulkActionBar>

        {/* Assessments Grid */}
        {sortedAssessments.length === 0 ? (
          <EmptyState>
            <div className="icon">📋</div>
            <div className="title">No assessments found</div>
            <div className="message">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your filters'
                : 'Create your first assessment to get started'
              }
            </div>
            {!searchTerm && statusFilter === 'all' && (
              <PrimaryButton 
                onClick={() => navigate('/start')}
                style={{ margin: '0 auto' }}
              >
                <FiPlus size={16} />
                Create Assessment
              </PrimaryButton>
            )}
          </EmptyState>
        ) : (
          <AssessmentsGrid>
            {sortedAssessments.map((assessment) => {
              const status = getStatusFromAssessment(assessment);
              const progress = getProgressPercentage(assessment);
              const completedPillars = assessment.completedCategories || [];
              
              // Use assessmentId or id, whichever is available
              const assessmentId = assessment.id || assessment.assessmentId;
              
              console.log('[AssessmentsListNew] Assessment:', {
                id: assessment.id,
                assessmentId: assessment.assessmentId,
                name: assessment.assessment_name,
                finalId: assessmentId
              });

              const family = assessment.assessmentFamily || (assessment.isDynamic ? 'dynamic' : 'classic');
              const suiteBadge = assessment.suiteBadge || { label: 'Core 6-Pillar', bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' };
              const selectedPillars = assessment.selected_pillars || assessment.selectedPillars || ['platform_governance'];
              const targetPillar = (selectedPillars && selectedPillars.length > 0) ? selectedPillars[0] : 'platform_governance';

              const handleOpenReportOrEditor = () => {
                if (family === 'eu_ai_act') {
                  navigate(`/eu-ai-compliance/${assessmentId}`);
                } else if (family === 'genai') {
                  if (status === 'completed') {
                    navigate(`/genai-readiness/report/${assessmentId}`);
                  } else {
                    navigate(`/genai-readiness/edit/${assessmentId}`);
                  }
                } else if (family === 'dynamic') {
                  if (status === 'completed') {
                    navigate(`/assessments/report/${assessmentId}`);
                  } else {
                    navigate(`/assessments/run/instance/${assessmentId}`);
                  }
                } else {
                  if (status === 'completed') {
                    navigate(`/results/${assessmentId}`);
                  } else {
                    navigate(`/assessment/${assessmentId}/${targetPillar}`);
                  }
                }
              };

              const handleOpenEditor = (e) => {
                e.stopPropagation();
                if (family === 'eu_ai_act') {
                  navigate(`/eu-ai-compliance/${assessmentId}`);
                } else if (family === 'genai') {
                  navigate(`/genai-readiness/edit/${assessmentId}`);
                } else if (family === 'dynamic') {
                  navigate(`/assessments/run/instance/${assessmentId}`);
                } else {
                  navigate(`/assessment/${assessmentId}/${targetPillar}`);
                }
              };

              const handleOpenReport = (e) => {
                e.stopPropagation();
                if (progress === 0 || status === 'not_started') return;
                if (family === 'eu_ai_act') {
                  navigate(`/eu-ai-compliance/${assessmentId}`);
                } else if (family === 'genai') {
                  navigate(`/genai-readiness/report/${assessmentId}`);
                } else if (family === 'dynamic') {
                  navigate(`/assessments/report/${assessmentId}`);
                } else {
                  navigate(`/results/${assessmentId}`);
                }
              };

              return (
                <AssessmentCard
                  key={assessmentId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={handleOpenReportOrEditor}
                >
                  <div className="header" style={{ position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <input
                        type="checkbox"
                        checked={selectedIds.has(assessmentId)}
                        onChange={(e) => handleToggleSelect(assessmentId, e)}
                        onClick={(e) => e.stopPropagation()}
                        style={{ width: '18px', height: '18px', marginTop: '4px', cursor: 'pointer', accentColor: '#3b82f6' }}
                      />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '3px 9px',
                            borderRadius: '999px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            background: suiteBadge.bg,
                            color: suiteBadge.text,
                            border: `1px solid ${suiteBadge.border}`
                          }}>
                            {suiteBadge.label}
                          </span>
                        </div>
                        <div className="title">
                          {assessment.assessment_name || assessment.assessmentName}
                        </div>
                        <div className="meta">
                          <div className="meta-item">
                            <span>🏢</span>
                            <span>{assessment.organization_name || assessment.organizationName}</span>
                          </div>
                          <span>›</span>
                          <div className="meta-item">
                            <span>🏭</span>
                            <span>{assessment.industry}</span>
                          </div>
                        </div>
                        <div className="meta" style={{ marginTop: '8px', fontSize: '0.85rem', color: '#64748b' }}>
                          <div className="meta-item">
                            <span>📝</span>
                            <span>Created by: {assessment.creator_name}</span>
                          </div>
                          <span>•</span>
                          <div className="meta-item">
                            <span>📅</span>
                            <span>{formatDateTime(assessment.created_at || assessment.createdAt)}</span>
                          </div>
                        </div>
                        <div className="meta" style={{ marginTop: '4px', fontSize: '0.85rem', color: '#64748b' }}>
                          <div className="meta-item">
                            <span>✏️</span>
                            <span>Updated by: {assessment.creator_name}</span>
                          </div>
                          <span>•</span>
                          <div className="meta-item">
                            <span>🕐</span>
                            <span>{formatDateTime(assessment.updated_at || assessment.updatedAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <StatusBadge $status={status}>
                      {getStatusLabel(assessment)}
                    </StatusBadge>
                  </div>

                  <div className="progress-section">
                    <div className="progress-label">
                      <span>Progress</span>
                      <span><strong>{progress}%</strong></span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${progress}%` }} />
                    </div>
                  </div>

                  <div className="footer">
                    <div className="actions">
                      <ActionButton
                        onClick={handleOpenEditor}
                        title="Edit assessment"
                      >
                        <FiEdit2 />
                      </ActionButton>
                      <ActionButton
                        onClick={(e) => handleExportToExcel(assessment, e)}
                        title="Download as Excel"
                        style={{ color: '#10b981' }}
                      >
                        <FiDownload />
                      </ActionButton>
                      <ActionButton
                        onClick={(e) => handleImportFromExcel(assessment, e)}
                        title="Upload Excel to update"
                        style={{ color: '#3b82f6' }}
                        disabled={uploadingExcel === assessmentId}
                      >
                        <FiUpload />
                      </ActionButton>
                      <ActionButton
                        onClick={(e) => handleCloneAssessment(assessment, e)}
                        title="Clone this assessment"
                      >
                        <FiCopy />
                      </ActionButton>
                      <ActionButton
                        onClick={(e) => handleDeleteAssessment(assessment, assessment.assessment_name, e)}
                        title="Delete this assessment"
                        style={{ color: '#ef4444' }}
                      >
                        <FiTrash2 />
                      </ActionButton>
                      <ActionButton
                        className="primary"
                        disabled={progress === 0 || status === 'not_started'}
                        onClick={handleOpenReport}
                        title={progress === 0 || status === 'not_started' ? 'Complete at least one section to view report' : 'View executive assessment report'}
                      >
                        <FiStar />
                      </ActionButton>
                    </div>
                  </div>
                </AssessmentCard>
              );
            })}
          </AssessmentsGrid>
        )}

        {/* Floating Batch Actions Toolbar */}
        {selectedIds.size > 0 && (
          <FloatingBatchBar
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#60a5fa' }}>
                {selectedIds.size} selected
              </span>
              <button
                onClick={handleSelectAll}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '0.78rem', cursor: 'pointer', textDecoration: 'underline' }}
              >
                {selectedIds.size === filteredAssessments.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {selectedIds.size >= 2 && (
                <BatchActionButton
                  $primary
                  onClick={() => {
                    const ids = Array.from(selectedIds);
                    navigate(`/assessments/compare?base=${ids[0]}&target=${ids[1]}`);
                  }}
                >
                  <FiTrendingUp size={14} /> Compare Selected (2)
                </BatchActionButton>
              )}
              <BatchActionButton onClick={handleBatchClone}>
                <FiCopy size={14} /> Batch Clone ({selectedIds.size})
              </BatchActionButton>
              <BatchActionButton $danger onClick={handleBatchDelete}>
                <FiTrash2 size={14} /> Batch Delete ({selectedIds.size})
              </BatchActionButton>
            </div>
          </FloatingBatchBar>
        )}
      </ContentContainer>

      {/* Delete All Confirmation Modal */}
      {showDeleteAllConfirm && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={() => setShowDeleteAllConfirm(false)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '500px',
              width: '90%',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <FiAlertTriangle size={32} color="#ef4444" />
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>Delete All Assessments?</h2>
            </div>
            <p style={{ color: '#6b7280', marginBottom: '24px', lineHeight: '1.6' }}>
              This will permanently delete <strong>all {assessments.length} assessment(s)</strong> and their data. 
              This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowDeleteAllConfirm(false)}
                style={{
                  padding: '10px 20px',
                  background: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.background = '#e5e7eb'}
                onMouseLeave={(e) => e.target.style.background = '#f3f4f6'}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAll}
                style={{
                  padding: '10px 20px',
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.background = '#dc2626'}
                onMouseLeave={(e) => e.target.style.background = '#ef4444'}
              >
                Yes, Delete All
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Hidden file input for Excel upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />
    </PageContainer>
  );
};

export default AssessmentsListNew;

