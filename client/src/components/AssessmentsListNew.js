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
  FiAlertTriangle
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import * as assessmentService from '../services/assessmentService';
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
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 24px;
  position: relative;
  z-index: 1;

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
  const [statusFilter, setStatusFilter] = useState('all');
  const [pillarFilter, setPillarFilter] = useState('all');
  const [ownerFilter, setOwnerFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [industryFilter, setIndustryFilter] = useState('all');
  const [completionRangeFilter, setCompletionRangeFilter] = useState('all');
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);
  const [uploadingExcel, setUploadingExcel] = useState(null); // Track which assessment is being uploaded
  const fileInputRef = React.useRef(null);

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      setLoading(true);
      const data = await assessmentService.getAssessments();
      setAssessments(Array.isArray(data) ? data : []);
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
      
      // Clone with new name
      const clonedData = {
        organizationName: assessment.organization_name,
        contactEmail: assessment.contact_email,
        industry: assessment.industry,
        assessmentName: `${assessment.assessment_name} (Copy)`,
        assessmentDescription: assessment.assessmentDescription
      };
      
      const result = await assessmentService.cloneAssessment(assessment.id || assessment.assessmentId, clonedData);
      
      
      // Refresh the assessments list
      await fetchAssessments();
    } catch (error) {
      console.error('Error cloning assessment:', error);
      
    }
  };

  const handleDeleteAssessment = async (assessmentId, assessmentName, event) => {
    event.stopPropagation();
    
    // Confirm deletion
    if (!window.confirm(`Are you sure you want to delete "${assessmentName}"? This action cannot be undone.`)) {
      return;
    }
    
    try {
      toast.loading('Deleting assessment...', { id: 'delete' });
      await assessmentService.deleteAssessment(assessmentId);
      
      
      // Refresh the assessments list
      await fetchAssessments();
    } catch (error) {
      console.error('Error deleting assessment:', error);
      
    }
  };

  // Handle Excel Export
  const handleExportToExcel = async (assessment, e) => {
    e?.stopPropagation();
    
    try {
      toast.loading(`Generating Excel file for ${assessment.assessment_name}...`, { id: 'excel-export' });
      
      const blob = await excelService.exportAssessment(assessment.id);
      const fileName = `${assessment.assessment_name || 'Assessment'}_${assessment.id}_${new Date().toISOString().split('T')[0]}.xlsx`;
      
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

  // Filter and sort assessments
  const filteredAssessments = assessments.filter(assessment => {
    const matchesSearch = 
      searchTerm === '' ||
      (assessment.assessment_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (assessment.organization_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (assessment.contact_email || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = 
      statusFilter === 'all' ||
      (statusFilter === 'completed' && assessment.status === 'completed') ||
      (statusFilter === 'in_progress' && assessment.completedCategories && assessment.completedCategories.length > 0 && assessment.status !== 'completed') ||
      (statusFilter === 'not_started' && (!assessment.completedCategories || assessment.completedCategories.length === 0));

    const matchesPillar = 
      pillarFilter === 'all' ||
      (assessment.completedCategories && assessment.completedCategories.includes(pillarFilter));

    const matchesOwner = 
      ownerFilter === 'all' ||
      (assessment.contactEmail || '').toLowerCase().includes(ownerFilter.toLowerCase());

    const matchesIndustry = 
      industryFilter === 'all' ||
      (assessment.industry || '').toLowerCase() === industryFilter.toLowerCase();

    const progress = (assessment.completedCategories?.length || 0) / 6 * 100;
    const matchesCompletionRange = 
      completionRangeFilter === 'all' ||
      (completionRangeFilter === '0-25' && progress <= 25) ||
      (completionRangeFilter === '26-50' && progress > 25 && progress <= 50) ||
      (completionRangeFilter === '51-75' && progress > 50 && progress <= 75) ||
      (completionRangeFilter === '76-100' && progress > 75);

    return matchesSearch && matchesStatus && matchesPillar && matchesOwner && matchesIndustry && matchesCompletionRange;
  });

  const sortedAssessments = [...filteredAssessments].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt);
      case 'name':
        return (a.assessmentName || '').localeCompare(b.assessmentName || '');
      case 'progress':
        const progressA = (a.completedCategories?.length || 0) / 6;
        const progressB = (b.completedCategories?.length || 0) / 6;
        return progressB - progressA;
      default:
        return 0;
    }
  });

  const getStatusFromAssessment = (assessment) => {
    // Check explicit status first
    if (assessment.status === 'completed' || assessment.status === 'submitted') return 'completed';
    
    // If has responses or completed categories, it's in progress
    if (assessment.completedCategories && assessment.completedCategories.length > 0) return 'in_progress';
    if (assessment.responses && Object.keys(assessment.responses).length > 0) return 'in_progress';
    
    return 'not_started';
  };

  const getStatusLabel = (assessment) => {
    const status = getStatusFromAssessment(assessment);
    return status === 'in_progress' ? 'In Progress' : 
           status === 'completed' ? 'Completed' : 
           'Not Started';
  };

  const getProgressPercentage = (assessment) => {
    // If status is explicitly completed/submitted, return 100%
    if (assessment.status === 'completed' || assessment.status === 'submitted') {
      return 100;
    }
    
    // Calculate based on completed categories
    const totalPillars = 6; // Total number of pillars
    const completedCount = assessment.completedCategories?.length || 0;
    const percentage = Math.round((completedCount / totalPillars) * 100);
    
    // Cap at 99% if not officially submitted (to show it's not complete)
    return percentage >= 100 ? 99 : percentage;
  };

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
    { id: 'ml_mlops', name: 'ML & MLOps' },
    { id: 'genai_agentic', name: 'GenAI & Agentic' },
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
              {[...new Set(assessments.map(a => a.contactEmail).filter(Boolean))].map(email => (
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

              return (
                <AssessmentCard
                  key={assessmentId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => {
                    console.log(`[AssessmentsListNew] Card clicked, navigating to: /assessment/${assessmentId}/platform_governance`);
                    navigate(`/assessment/${assessmentId}/platform_governance`);
                  }}
                >
                  <div className="header">
                    <div>
                      <div className="title">
                        {assessment.assessment_name || 'Untitled Assessment'}
                      </div>
                      <div className="meta">
                        <div className="meta-item">
                          <span>🏢</span>
                          <span>{assessment.organization_name || 'Unknown Org'}</span>
                        </div>
                        <span>›</span>
                        <div className="meta-item">
                          <span>🏭</span>
                          <span>{assessment.industry || 'Not specified'}</span>
                        </div>
                      </div>
                      <div className="meta" style={{ marginTop: '8px', fontSize: '0.85rem', color: '#64748b' }}>
                        <div className="meta-item">
                          <span>📝</span>
                          <span>Created by: {assessment.creator_name || assessment.contact_email?.split('@')[0] || 'Unknown'}</span>
                        </div>
                        <span>•</span>
                        <div className="meta-item">
                          <span>📅</span>
                          <span>{formatDateTime(assessment.created_at)}</span>
                        </div>
                      </div>
                      <div className="meta" style={{ marginTop: '4px', fontSize: '0.85rem', color: '#64748b' }}>
                        <div className="meta-item">
                          <span>✏️</span>
                          <span>Updated by: {assessment.creator_name || assessment.contact_email?.split('@')[0] || 'Unknown'}</span>
                        </div>
                        <span>•</span>
                        <div className="meta-item">
                          <span>🕐</span>
                          <span>{formatDateTime(assessment.updated_at)}</span>
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
                        onClick={(e) => {
                          e.stopPropagation();
                          // Navigate to first selected pillar, or platform_governance as fallback
                          const selectedPillars = assessment.selected_pillars;
                          const targetPillar = (selectedPillars && selectedPillars.length > 0) 
                            ? selectedPillars[0] 
                            : 'platform_governance';
                          console.log(`[AssessmentsListNew] Edit clicked, navigating to: /assessment/${assessmentId}/${targetPillar}`);
                          navigate(`/assessment/${assessmentId}/${targetPillar}`);
                        }}
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
                        onClick={(e) => handleDeleteAssessment(assessmentId, assessment.assessment_name, e)}
                        title="Delete this assessment"
                        style={{ color: '#ef4444' }}
                      >
                        <FiTrash2 />
                      </ActionButton>
                      <ActionButton
                        className="primary"
                        disabled={progress === 0 || status === 'not_started'}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (progress === 0 || status === 'not_started') {
                            return;
                          }
                          console.log(`[AssessmentsListNew] View Report clicked, navigating to: /results/${assessmentId}`);
                          navigate(`/results/${assessmentId}`);
                        }}
                        title={progress === 0 || status === 'not_started' ? 'Complete at least one pillar to view report' : 'View assessment report'}
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

