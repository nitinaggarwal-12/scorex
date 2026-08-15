import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FiArrowLeft, 
  FiDownload, 
  FiEdit3,
  FiRefreshCw,
  FiCheckCircle,
  FiAlertCircle,
  FiTrendingUp,
  FiCalendar,
  FiSave,
  FiTrash2,
  FiX,
  FiArrowRight
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import * as assessmentService from '../services/assessmentService';
import { generateProfessionalReport } from '../services/pdfExportService';
import { exportAssessmentToExcel } from '../services/excelExportService';
import NPSFeedbackModal from './NPSFeedbackModal';

// =======================
// STYLED COMPONENTS
// =======================

const PageContainer = styled.div`
  min-height: 100vh;
  background: #f9fafb;
  padding-top: 68px; /* Height of fixed GlobalNav */
`;

const Breadcrumb = styled.div`
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  color: #6b7280;

  a, button {
    color: #3b82f6;
    text-decoration: none;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    font: inherit;
    transition: color 0.2s;

    &:hover {
      color: #2563eb;
      text-decoration: underline;
    }
  }

  span {
    color: #d1d5db;
  }
`;

const ContentContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px 24px;

  @media (max-width: 768px) {
    padding: 20px 16px;
  }
`;

const HeaderSection = styled.div`
  margin-bottom: 32px;

  h1 {
    font-size: 2rem;
    font-weight: 700;
    color: #111827;
    margin: 0 0 8px 0;
    letter-spacing: -0.02em;
  }

  p {
    font-size: 1rem;
    color: #6b7280;
    margin: 0;
  }

  @media (max-width: 768px) {
    margin-bottom: 24px;

    h1 {
      font-size: 1.5rem;
    }

    p {
      font-size: 0.875rem;
    }
  }
`;

const MainGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Card = styled(motion.div)`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
`;

const SidebarSubtitle = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 20px 0;
`;

const ActionButton = styled(motion.button)`
  width: 100%;
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;
  margin-top: 16px;

  &:first-of-type {
    background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);

    &:hover {
      opacity: 0.95;
      box-shadow: 0 6px 16px rgba(255, 107, 53, 0.4);
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 10px 14px;
    font-size: 0.813rem;
  }
`;

const SecondaryActionButton = styled(motion.button)`
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;
  margin-top: 8px;

  &:hover {
    background: #f9fafb;
    border-color: #d1d5db;
  }

  @media (max-width: 768px) {
    padding: 9px 12px;
    font-size: 0.813rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    color: #10b981;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  gap: 12px;

  .section-title-wrapper {
    flex: 1;
  }

  .section-actions {
    display: flex;
    gap: 6px;
    flex-shrink: 0;
  }
`;

const MaturityComparisonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 20px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const MaturityBox = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;

  .label {
    font-size: 0.75rem;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 8px;
  }

  .value {
    font-size: 1.5rem;
    font-weight: 700;
    color: #111827;
    margin-bottom: 4px;
  }

  .subtitle {
    font-size: 0.875rem;
    color: #6b7280;
  }

  @media (max-width: 768px) {
    padding: 12px;

    .value {
      font-size: 1.25rem;
    }
  }
`;

const DescriptionText = styled.p`
  font-size: 0.938rem;
  line-height: 1.6;
  color: #374151;
  margin: 0 0 16px 0;
`;

const EditableTextarea = styled.textarea`
  width: 100%;
  min-height: ${props => props.$minHeight || '100px'};
  padding: 12px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  font-family: inherit;
  line-height: 1.6;
  color: #111827;
  resize: vertical;
  transition: border-color 0.2s;
  background: #fef9ed;

  &:focus {
    outline: none;
    border-color: #f59e0b;
    background: white;
  }

  &::placeholder {
    color: #9ca3af;
  }
`;


const PriorityItem = styled.div`
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;

  &:hover {
    background: #f9fafb;
    border-color: #d1d5db;
  }
`;

const PriorityBadge = styled.div`
  min-width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-weight: 700;
  font-size: 0.875rem;
  flex-shrink: 0;
  
  ${props => {
    if (props.$priority === 'critical' || props.$priority === 'high') {
      return `
        background: #fee2e2;
        color: #991b1b;
        border: 2px solid #f87171;
      `;
    } else if (props.$priority === 'medium') {
      return `
        background: #fef3c7;
        color: #78350f;
        border: 2px solid #fbbf24;
      `;
    } else {
      return `
        background: #dbeafe;
        color: #1e40af;
        border: 2px solid #60a5fa;
      `;
    }
  }}
`;

const RoadmapItem = styled.div`
  padding: 16px;
  background: #f0fdf4;
  border: 1px solid #86efac;
  border-radius: 8px;
  margin-bottom: 12px;
  position: relative;

  &:last-child {
    margin-bottom: 0;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;
    flex-wrap: wrap;
    gap: 8px;
  }

  .title {
    font-size: 0.938rem;
    font-weight: 600;
    color: #166534;
    flex: 1;
  }

  .timeline {
    font-size: 0.813rem;
    color: #166534;
    background: #dcfce7;
    padding: 4px 10px;
    border-radius: 4px;
    font-weight: 500;
  }

  .card-actions {
    display: flex;
    gap: 6px;
    margin-left: 8px;
  }

  .actions {
    font-size: 0.875rem;
    line-height: 1.6;
    color: #166534;

    ul {
      margin: 0;
      padding-left: 20px;
    }

    li {
      margin-bottom: 6px;
    }
  }

  @media (max-width: 768px) {
    padding: 12px;

    .title {
      font-size: 0.875rem;
    }

    .actions {
      font-size: 0.813rem;
    }
  }
`;

const EditActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: ${props => props.$variant === 'danger' ? '#fee2e2' : props.$variant === 'success' ? '#d1fae5' : '#eff6ff'};
  color: ${props => props.$variant === 'danger' ? '#dc2626' : props.$variant === 'success' ? '#059669' : '#3b82f6'};
  border: 1px solid ${props => props.$variant === 'danger' ? '#fecaca' : props.$variant === 'success' ? '#86efac' : '#bfdbfe'};
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.$variant === 'danger' ? '#fecaca' : props.$variant === 'success' ? '#86efac' : '#dbeafe'};
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

const OutcomesList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;

  li {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    font-size: 0.875rem;
    line-height: 1.6;
    color: #374151;
    margin-bottom: 12px;
    padding-left: 0;

    &:last-child {
      margin-bottom: 0;
    }

    svg {
      margin-top: 2px;
      color: #10b981;
      flex-shrink: 0;
    }
  }

  @media (max-width: 768px) {
    li {
      font-size: 0.813rem;
    }
  }
`;

const ConfidenceBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 12px;
  padding: 6px 12px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
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
`;

// =======================
// COMPONENT
// =======================

const ExecutiveSummaryNew = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const routerLocation = useLocation();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);
  
  // Edit mode state
  const [editedContent, setEditedContent] = useState({
    strategicSituation: '',
    criticalConstraints: '',
    transformationRoadmap: [],
    expectedOutcomes: [],
    currentMaturityDescription: '',
    targetMaturityDescription: '',
    improvementScopeDescription: ''
  });
  
  // Individual card edit state
  const [editingRoadmapCard, setEditingRoadmapCard] = useState(null); // Index of card being edited
  const [editingCardContent, setEditingCardContent] = useState({});
  const [roadmapCustomizations, setRoadmapCustomizations] = useState({});
  
  // Individual section edit state
  const [editingStrategicSection, setEditingStrategicSection] = useState(false);
  const [tempStrategicContent, setTempStrategicContent] = useState('');
  
  // NPS feedback modal state
  const [showNPSModal, setShowNPSModal] = useState(false);
  const [npsPromptShown, setNpsPromptShown] = useState(false);

  // Show NPS modal after 10 seconds (only once per session)
  useEffect(() => {
    if (!npsPromptShown && results && !loading) {
      // Check if user already provided feedback for this assessment
      const feedbackKey = `nps_feedback_${assessmentId}`;
      const alreadyProvided = localStorage.getItem(feedbackKey);
      
      if (!alreadyProvided) {
        const timer = setTimeout(() => {
          setShowNPSModal(true);
          setNpsPromptShown(true);
          localStorage.setItem(feedbackKey, 'prompted');
        }, 10000); // 10 seconds
        
        return () => clearTimeout(timer);
      }
    }
  }, [results, loading, npsPromptShown, assessmentId]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        console.log('[ExecutiveSummaryNew] Fetching results for assessment:', assessmentId);
        setLoading(true);
        const response = await assessmentService.getAssessmentResults(assessmentId);
        console.log('[ExecutiveSummaryNew] Raw response:', response);
        
        // Unwrap response if needed (backend returns {success, data} but interceptor already unwrapped once)
        const data = response?.data || response;
        console.log('[ExecutiveSummaryNew] Unwrapped data:', data);
        setResults(data);
        
        // Initialize editable content from results or existing edited content
        if (data.editedExecutiveSummary) {
          setEditedContent(data.editedExecutiveSummary);
        } else {
          // Initialize with DYNAMIC AI-generated content from assessment
          console.log('[ExecutiveSummaryNew] Initializing with dynamic content from API');
          
          // Extract dynamic content from overall summary (generated by OpenAI based on user responses)
          const dynamicSummary = data.overall?.summary || '';
          
          // Parse summary sections (OpenAI generates structured markdown)
          const strategicSection = dynamicSummary.split('## CRITICAL CONSTRAINTS')[0] || dynamicSummary;
          const constraintsSection = dynamicSummary.match(/## CRITICAL CONSTRAINTS([\s\S]*?)## TRANSFORMATION ROADMAP/)?.[1] || 
            'Your assessment identified specific challenges that limit platform capabilities, team productivity, and business agility.';
          
          // Extract transformation roadmap from prioritizedActions with Databricks features
          const transformationRoadmap = (data.prioritizedActions || []).map(action => {
            const pillarName = action.pillar || action.pillarId || action.area || 'Unknown';
            const databricksFeatures = action.databricksFeatures || [];
            const quickWins = action.quickWins || action.specificRecommendations || [];
            
            return {
              pillar: pillarName,
              currentScore: action.currentScore || 0,
              targetScore: action.targetScore || (action.currentScore + 1) || 0,
              gap: action.gap || 0,
              timeline: action.timeline || '6-12 months',
              impact: action.impact || 'High',
              actions: databricksFeatures.slice(0, 3).map(f => f.name || f.title || f),
              databricksFeatures: databricksFeatures,
              quickWins: quickWins
            };
          });
          
          // Extract expected outcomes from summary or use defaults
          const outcomesMatch = dynamicSummary.match(/\*\*Expected Business Outcomes:\*\*([\s\S]*?)(?:\*\*|$)/);
          const expectedOutcomes = outcomesMatch 
            ? outcomesMatch[1].split('\n').filter(line => line.trim().startsWith('•')).map(line => line.trim().substring(1).trim())
            : [
                'Improved data platform reliability and governance',
                'Faster time-to-insight with modern Databricks capabilities',
                'Reduced manual effort through automation',
                'Better cost efficiency through serverless compute',
                'Enhanced compliance and audit capabilities'
              ];
          
          // Extract maturity levels from data
          const currentLevel = data.overall?.level?.level || 'Initial';
          const currentLevelDesc = data.overall?.level?.description || 'Ad-hoc processes, limited capabilities';
          const targetLevel = data.overall?.targetLevel?.level || 'Defined';
          const targetLevelDesc = data.overall?.targetLevel?.description || 'Structured approach with established processes';
          
          setEditedContent({
            strategicSituation: strategicSection,
            criticalConstraints: constraintsSection.trim(),
            transformationRoadmap: transformationRoadmap.length > 0 ? transformationRoadmap : [],
            expectedOutcomes,
            currentMaturityDescription: `${currentLevel} — ${currentLevelDesc}`,
            targetMaturityDescription: `${targetLevel} — ${targetLevelDesc}`,
            improvementScopeDescription: 'Based on your assessment responses and identified gaps'
          });
          
          console.log('[ExecutiveSummaryNew] Dynamic content initialized with', transformationRoadmap.length, 'roadmap items');
        }
      } catch (err) {
        console.error('Error fetching results:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (assessmentId) {
      fetchResults();
    }
  }, [assessmentId, routerLocation.key]);

  // Handlers for individual roadmap card editing
  const handleEditRoadmapCard = (index, roadmapItem) => {
    setEditingRoadmapCard(index);
    setEditingCardContent({
      pillar: roadmapItem.pillar,
      timeline: roadmapItem.timeline,
      impact: roadmapItem.impact,
      actions: roadmapItem.actions.map(a => typeof a === 'string' ? a : a.action || a.title || a.description || '').join('\n')
    });
  };

  const handleSaveRoadmapCard = (index) => {
    const newCustomizations = { ...roadmapCustomizations };
    newCustomizations[index] = {
      pillar: editingCardContent.pillar,
      timeline: editingCardContent.timeline,
      impact: editingCardContent.impact,
      actions: editingCardContent.actions.split('\n').filter(line => line.trim())
    };
    setRoadmapCustomizations(newCustomizations);
    setEditingRoadmapCard(null);
    setEditingCardContent({});
    
  };

  const handleCancelRoadmapEdit = () => {
    setEditingRoadmapCard(null);
    setEditingCardContent({});
  };

  const handleRemoveRoadmapCustomization = (index) => {
    const newCustomizations = { ...roadmapCustomizations };
    delete newCustomizations[index];
    setRoadmapCustomizations(newCustomizations);
    
  };

  // Get roadmap item data (use customization if exists, otherwise use original)
  const getRoadmapItemData = (index, originalItem) => {
    if (roadmapCustomizations[index]) {
      return {
        ...originalItem,
        ...roadmapCustomizations[index],
        isCustomized: true
      };
    }
    return { ...originalItem, isCustomized: false };
  };

  // Handlers for strategic section editing
  const handleEditStrategicSection = () => {
    setTempStrategicContent(editedContent.strategicSituation);
    setEditingStrategicSection(true);
  };

  const handleSaveStrategicSection = () => {
    setEditedContent({ ...editedContent, strategicSituation: tempStrategicContent });
    setEditingStrategicSection(false);
    
  };

  const handleCancelStrategicEdit = () => {
    setEditingStrategicSection(false);
    setTempStrategicContent('');
  };


  const handleExportPDF = async () => {
    try {
      setExporting(true);
      toast.loading('Generating PDF report...', { id: 'pdf-export' });
      
      const resultsData = results?.data || results;
      const assessmentInfo = resultsData?.assessmentInfo || {
        assessmentName: 'Executive Summary',
        organizationName: 'Organization'
      };
      
      const result = generateProfessionalReport(resultsData, assessmentInfo);
      
      if (result.success) {
        
      } else {
        throw new Error(result.error || 'Failed to generate PDF');
      }
    } catch (error) {
      console.error('Error exporting PDF:', error);
      
    } finally {
      setExporting(false);
    }
  };


  const handleExportExcel = async () => {
    try {
      setExporting(true);
      toast.loading('Generating Excel file...', { id: 'excel-export' });
      
      const resultsData = results?.data || results;
      await exportAssessmentToExcel(
        assessmentId,
        resultsData?.assessmentInfo?.assessmentName || 'Assessment'
      );
      
      
    } catch (error) {
      console.error('Error exporting Excel:', error);
      
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingContainer>
          <div className="spinner">
            <FiRefreshCw size={48} className="animate-spin" style={{ color: '#3b82f6' }} />
            <div className="text">Loading Executive Summary...</div>
          </div>
        </LoadingContainer>
      </PageContainer>
    );
  }

  if (error || !results) {
    return (
      <PageContainer>
        <ErrorContainer>
          <FiAlertCircle size={64} className="icon" />
          <div className="title">Unable to load Executive Summary</div>
          <div className="message">{error || 'No summary available'}</div>
          <SecondaryActionButton
            onClick={() => navigate(`/results/${assessmentId}`)}
            style={{ maxWidth: '200px' }}
          >
            <FiArrowLeft /> Back to Results
          </SecondaryActionButton>
        </ErrorContainer>
      </PageContainer>
    );
  }

  // Unwrap results data (handle both direct and wrapped formats)
  const resultsData = results?.data || results;
  console.log('[ExecutiveSummaryNew] Rendering with resultsData:', resultsData);

  // Check if assessment has any responses
  const hasResponses = resultsData?.assessmentInfo?.questionsAnswered > 0;
  const isIncomplete = !hasResponses || resultsData?.assessmentInfo?.completionPercentage < 10;

  // Calculate maturity levels from results
  // 🔥 FIX: Default to Level 1 (Explore) if no responses, not Level 3!
  const currentMaturity = hasResponses ? (resultsData?.overall?.currentScore || 1) : 1;
  const targetMaturity = hasResponses ? (resultsData?.overall?.futureScore || 1) : 1;
  const improvementScope = targetMaturity - currentMaturity;

  // Get actual pillars data from results (dynamically generated)
  const pillarsData = [];
  const categoryDetails = resultsData?.categoryDetails || {};
  
  Object.keys(categoryDetails).forEach(pillarId => {
    const pillar = categoryDetails[pillarId];
    if (pillar && pillar.name) {
      pillarsData.push({
        id: pillarId,
        name: pillar.name,
        currentScore: pillar.currentScore || 0,
        futureScore: pillar.futureScore || 0,
        gap: (pillar.futureScore || 0) - (pillar.currentScore || 0)
      });
    }
  });
  
  // Get prioritized actions from results
  const prioritizedActions = resultsData?.prioritizedActions || [];
  
  // Build transformation roadmap from prioritized actions (DYNAMIC from user assessment)
  const transformationRoadmap = prioritizedActions.slice(0, 6).map(action => {
    // Map pillar ID to name
    const pillarNames = {
      'platform_governance': '🧱 Platform',
      'data_engineering': '💾 Data',
      'analytics_bi': '📊 Analytics',
      'machine_learning': '🤖 ML',
      'generative_ai': '✨ GenAI',
      'operational_excellence': '⚡ Operations'
    };
    
    const pillarId = action.pillarId || action.area || action.pillar;
    const pillarName = pillarNames[pillarId] || action.pillar || 'General';
    const currentScore = action.currentScore || categoryDetails[pillarId]?.currentScore || 0;
    const targetScore = action.targetScore || action.futureScore || categoryDetails[pillarId]?.futureScore || currentScore + 1;
    const gap = action.gap || targetScore - currentScore;
    
    return {
      pillar: pillarName,
      currentScore,
      targetScore,
      gap,
      timeline: gap >= 2 ? '6–12 months' : gap >= 1 ? '3–6 months' : '1–3 months',
      impact: gap >= 2 ? 'High' : gap >= 1 ? 'Medium' : 'Low',
      actions: (action.databricksFeatures || []).slice(0, 3).map(f => f.name || f.title || f),
      // NEW: Include Databricks features
      databricksFeatures: action.databricksFeatures || [],
      quickWins: action.quickWins || []
    };
  });

  return (
    <PageContainer>
      {/* Breadcrumb Navigation */}
      <Breadcrumb>
        <button onClick={() => navigate(`/results/${assessmentId}`)}>
          <FiArrowLeft size={14} /> Back to Results
        </button>
        <span>›</span>
        <button onClick={() => navigate('/assessments')}>Assessments</button>
        <span>›</span>
        <span style={{ color: '#111827' }}>Executive Summary</span>
      </Breadcrumb>

      <ContentContainer>
        {/* Incomplete Assessment Warning */}
        {isIncomplete && (
          <div style={{
            background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
            color: 'white',
            padding: '24px 32px',
            borderRadius: '12px',
            marginBottom: '32px',
            boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'start', gap: '16px' }}>
              <FiAlertCircle size={32} style={{ flexShrink: 0, marginTop: '4px' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>
                  ⚠️ Incomplete Assessment - No Dynamic Content Yet
                </div>
                <div style={{ fontSize: '1rem', marginBottom: '16px', lineHeight: 1.6 }}>
                  This assessment has <strong>{resultsData?.assessmentInfo?.questionsAnswered || 0} questions answered</strong>. 
                  The Executive Summary requires assessment responses to generate "What's Working", "Key Challenges", and Databricks recommendations.
                </div>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => {
                      const firstCategory = 'platform_governance';
                      navigate(`/assessment/${assessmentId}/${firstCategory}`);
                    }}
                    style={{
                      background: 'white',
                      color: '#ff6b35',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: '0.938rem',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                    }}
                  >
                    Complete Assessment →
                  </button>
                  <button
                    onClick={() => navigate(`/results/${assessmentId}`)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      border: '2px solid white',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: '0.938rem'
                    }}
                  >
                    Back to Results
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Header */}
        <HeaderSection>
          <div>
            <h1>Executive Summary</h1>
            <p>Strategic insights and business value analysis for {resultsData?.assessmentInfo?.assessmentName || 'your assessment'}.</p>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '20px', alignItems: 'center' }}>
            <ActionButton
              onClick={async () => {
                console.log('[ExecutiveSummaryNew] Regenerating with dynamic content...');
                toast.loading('Regenerating with Databricks features...', { id: 'refresh' });
                try {
                  // Force backend to regenerate by calling results API with forceRefresh
                  const freshResults = await assessmentService.getAssessmentResults(assessmentId, true);
                  
                  if (freshResults) {
                    // Update state with fresh results
                    const data = freshResults?.data || freshResults;
                    setResults(data);
                    
                    // Re-extract dynamic content from fresh results
                    console.log('[ExecutiveSummaryNew] Re-initializing with fresh dynamic content');
                    
                    // Extract transformation roadmap with Databricks features
                    const roadmapItems = [];
                    if (data.prioritizedActions && Array.isArray(data.prioritizedActions)) {
                      data.prioritizedActions.forEach((action) => {
                        const pillarName = action.pillar || action.pillarId || action.area || 'Unknown';
                        const databricksFeatures = action.databricksFeatures || [];
                        const quickWins = action.quickWins || action.specificRecommendations || [];
                        
                        roadmapItems.push({
                          pillar: pillarName,
                          currentScore: action.currentScore || 0,
                          targetScore: action.targetScore || 0,
                          gap: action.gap || 0,
                          timeline: action.timeline || '6-12 months',
                          impact: action.impact || 'High',
                          actions: databricksFeatures.slice(0, 3).map(f => f.name || f.title || f),
                          databricksFeatures: databricksFeatures,
                          quickWins: quickWins
                        });
                      });
                    }
                    
                    setEditedContent(prev => ({
                      ...prev,
                      transformationRoadmap: roadmapItems
                    }));
                    
                    
                  } else {
                    throw new Error('Failed to regenerate');
                  }
                } catch (error) {
                  console.error('Error refreshing:', error);
                  
                }
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', border: 'none', width: 'auto', marginTop: 0 }}
            >
              <FiRefreshCw size={16} />
              Refresh with Your Data
            </ActionButton>
            <ActionButton
              onClick={handleExportPDF}
              disabled={exporting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{ background: 'white', color: '#111827', border: '1px solid #e5e7eb', width: 'auto', marginTop: 0 }}
            >
              <FiDownload size={16} />
              Download PDF
            </ActionButton>
            <ActionButton
              onClick={handleExportExcel}
              disabled={exporting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{ background: 'white', color: '#111827', border: '1px solid #e5e7eb', width: 'auto', marginTop: 0 }}
            >
              <FiDownload size={16} />
              Export to Excel
            </ActionButton>
            <ActionButton
              onClick={() => navigate(`/results/${assessmentId}`)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{ background: 'white', color: '#111827', border: '1px solid #e5e7eb', width: 'auto', marginTop: 0 }}
            >
              <FiArrowRight size={16} />
              View Full Roadmap
            </ActionButton>
          </div>
        </HeaderSection>

        {/* Main Grid Layout */}
        <MainGrid>
          {/* Main Content */}
          <MainContent>
            {/* What This Assessment Reveals */}
            <Card
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <SectionHeader>
                <div className="section-title-wrapper">
                  <SectionTitle style={{ marginBottom: 0 }}>
                    <FiCheckCircle />
                    What this assessment reveals
                  </SectionTitle>
                </div>
                <div className="section-actions">
                  {editingStrategicSection ? (
                    <>
                      <EditActionButton 
                        $variant="success"
                        onClick={handleSaveStrategicSection}
                      >
                        <FiSave size={10} />
                        Save
                      </EditActionButton>
                      <EditActionButton 
                        onClick={handleCancelStrategicEdit}
                      >
                        <FiX size={10} />
                        Cancel
                      </EditActionButton>
                    </>
                  ) : (
                    <EditActionButton 
                      onClick={handleEditStrategicSection}
                    >
                      <FiEdit3 size={10} />
                      Edit
                    </EditActionButton>
                  )}
                </div>
              </SectionHeader>
              
              <SidebarSubtitle style={{ marginBottom: '20px' }}>
                Clear snapshot of where you are, where you're going, and what to do next.
              </SidebarSubtitle>

              {/* Strategic Situation & Business Value */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#111827', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.25rem' }}>🎯</span> Strategic situation & business value
                </h3>
                <MaturityComparisonGrid>
                  <MaturityBox>
                    <div className="label">Current maturity</div>
                    <div className="value">
                      <span style={{ fontSize: '0.875rem', color: '#6b7280', marginRight: '4px' }}>◐</span>
                      Level {currentMaturity}
                    </div>
                    <div className="subtitle">— Defined</div>
                  </MaturityBox>
                  <MaturityBox>
                    <div className="label">Target maturity</div>
                    <div className="value">
                      <span style={{ fontSize: '0.875rem', color: '#6b7280', marginRight: '4px' }}>☆</span>
                      Level {targetMaturity}
                    </div>
                    <div className="subtitle">— Managed</div>
                  </MaturityBox>
                  <MaturityBox>
                    <div className="label">Improvement scope</div>
                    <div className="value">
                      <span style={{ fontSize: '0.875rem', color: '#10b981', marginRight: '4px' }}>→</span>
                      +{improvementScope} level
                    </div>
                    <div className="subtitle">in next 3-6 months</div>
                  </MaturityBox>
                </MaturityComparisonGrid>

                {editingStrategicSection ? (
                  <EditableTextarea
                    $minHeight="120px"
                    value={tempStrategicContent}
                    onChange={(e) => setTempStrategicContent(e.target.value)}
                    placeholder="Describe the strategic situation and business value..."
                  />
                ) : (
                  <>
                    <DescriptionText>
                      {editedContent.strategicSituation || 'Structured approach with established processes. Advanced capabilities with strong governance. Achievable with targeted initiatives and focused effort.'}
                    </DescriptionText>
                  </>
                )}
              </div>
            </Card>

            {/* Critical Constraints */}
            {/* Critical Constraints - Show top pain points with recommendations */}
            {resultsData?.painPointRecommendations && resultsData.painPointRecommendations.length > 0 && (
              <Card
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <SectionTitle>
                  <FiAlertCircle style={{ color: '#f59e0b' }} />
                  Top priorities to address
                </SectionTitle>
                
                <SidebarSubtitle style={{ marginBottom: '20px' }}>
                  Critical challenges identified across {pillarsData.length} pillar{pillarsData.length !== 1 ? 's' : ''}:
                </SidebarSubtitle>

                {resultsData.painPointRecommendations.slice(0, 5).map((painPoint, idx) => (
                  <PriorityItem key={idx} style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <PriorityBadge $priority={painPoint.priority || 'high'}>
                        {idx + 1}
                      </PriorityBadge>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.9375rem', marginBottom: '4px', color: '#1f2937' }}>
                          {painPoint.title || painPoint.painPoint}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '8px' }}>
                          {painPoint.description || painPoint.impact}
                        </div>
                        {painPoint.recommendation && (
                          <div style={{ 
                            fontSize: '0.875rem', 
                            color: '#059669', 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '6px',
                            padding: '8px 12px',
                            background: '#f0fdf4',
                            borderRadius: '6px',
                            borderLeft: '3px solid #10b981'
                          }}>
                            <FiArrowRight size={14} />
                            <span><strong>Action:</strong> {painPoint.recommendation}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </PriorityItem>
                ))}
              </Card>
            )}

            {/* Transformation Roadmap */}
            <Card
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <SectionTitle>
                <FiTrendingUp style={{ color: '#10b981' }} />
                Transformation roadmap & business value
              </SectionTitle>

              {transformationRoadmap.length > 0 ? (
                transformationRoadmap.map((roadmapItem, idx) => {
                  const isEditing = editingRoadmapCard === idx;
                  const itemData = getRoadmapItemData(idx, roadmapItem);
                  
                  return (
                    <RoadmapItem key={idx}>
                      <div className="header">
                        <div className="title">
                          {isEditing ? 'Editing Roadmap Item' : `${itemData.pillar} (Level ${roadmapItem.currentScore} → ${roadmapItem.targetScore})`}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {!isEditing && (
                            <div className="timeline">
                              <FiCalendar size={12} style={{ marginRight: '4px', display: 'inline' }} />
                              Timeline: {itemData.timeline} • Impact: {itemData.impact}
                            </div>
                          )}
                          <div className="card-actions">
                            {isEditing ? (
                              <>
                                <EditActionButton 
                                  $variant="success"
                                  onClick={() => handleSaveRoadmapCard(idx)}
                                >
                                  <FiSave size={10} />
                                </EditActionButton>
                                <EditActionButton 
                                  onClick={handleCancelRoadmapEdit}
                                >
                                  <FiX size={10} />
                                </EditActionButton>
                              </>
                            ) : (
                              <>
                                <EditActionButton 
                                  onClick={() => handleEditRoadmapCard(idx, itemData)}
                                >
                                  <FiEdit3 size={10} />
                                </EditActionButton>
                                {itemData.isCustomized && (
                                  <EditActionButton 
                                    $variant="danger"
                                    onClick={() => handleRemoveRoadmapCustomization(idx)}
                                  >
                                    <FiTrash2 size={10} />
                                  </EditActionButton>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {isEditing ? (
                        <div>
                          <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', color: '#166534', fontSize: '0.875rem' }}>
                            Pillar:
                          </label>
                          <EditableTextarea
                            value={editingCardContent.pillar || ''}
                            onChange={(e) => setEditingCardContent({ ...editingCardContent, pillar: e.target.value })}
                            placeholder="Enter pillar name..."
                            style={{ minHeight: '50px' }}
                          />
                          
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                            <div>
                              <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', color: '#166534', fontSize: '0.875rem' }}>
                                Timeline:
                              </label>
                              <input
                                type="text"
                                value={editingCardContent.timeline || ''}
                                onChange={(e) => setEditingCardContent({ ...editingCardContent, timeline: e.target.value })}
                                placeholder="e.g., 3-6 months"
                                style={{ width: '100%', padding: '8px', border: '2px solid #e5e7eb', borderRadius: '6px', fontSize: '0.875rem' }}
                              />
                            </div>
                            <div>
                              <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', color: '#166534', fontSize: '0.875rem' }}>
                                Impact:
                              </label>
                              <input
                                type="text"
                                value={editingCardContent.impact || ''}
                                onChange={(e) => setEditingCardContent({ ...editingCardContent, impact: e.target.value })}
                                placeholder="e.g., High, Medium, Low"
                                style={{ width: '100%', padding: '8px', border: '2px solid #e5e7eb', borderRadius: '6px', fontSize: '0.875rem' }}
                              />
                            </div>
                          </div>
                          
                          <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', color: '#166534', fontSize: '0.875rem' }}>
                            Actions (one per line):
                          </label>
                          <EditableTextarea
                            value={editingCardContent.actions || ''}
                            onChange={(e) => setEditingCardContent({ ...editingCardContent, actions: e.target.value })}
                            placeholder="Enter action items, one per line..."
                          />
                        </div>
                      ) : (
                        <div className="actions">
                          <ul>
                            {itemData.actions && itemData.actions.length > 0 ? (
                              itemData.actions.slice(0, 4).map((action, actionIdx) => (
                                <li key={actionIdx}>
                                  {typeof action === 'string' ? action : action.action || action.title || action.description || 'Action item'}
                                </li>
                              ))
                            ) : (
                              <li>Focus on closing the maturity gap through structured improvements</li>
                            )}
                          </ul>
                        </div>
                      )}
                    </RoadmapItem>
                  );
                })
              ) : (
                <DescriptionText>
                  Complete more pillar assessments to generate a personalized transformation roadmap.
                </DescriptionText>
              )}

              <div style={{ marginTop: '24px' }}>
                <h4 style={{ fontSize: '0.938rem', fontWeight: 600, color: '#111827', marginBottom: '12px' }}>
                  Expected business outcomes
                </h4>
                <OutcomesList>
                  <li>
                    <FiCheckCircle size={18} />
                    Improved platform reliability and governance posture
                  </li>
                  <li>
                    <FiCheckCircle size={18} />
                    Faster time-to-insight with modern Databricks capabilities
                  </li>
                  <li>
                    <FiCheckCircle size={18} />
                    Reduced manual effort through automation and AI
                  </li>
                  <li>
                    <FiCheckCircle size={18} />
                    Better cost efficiency via serverless and optimized compute
                  </li>
                  <li>
                    <FiCheckCircle size={18} />
                    Enhanced compliance and audit capabilities
                  </li>
                </OutcomesList>
                <ConfidenceBadge>
                  Assessment confidence: Based on {pillarsData.length} pillar{pillarsData.length !== 1 ? 's' : ''} with {resultsData?.assessmentInfo?.questionsAnswered || 0} questions answered
                </ConfidenceBadge>
              </div>
            </Card>
          </MainContent>
        </MainGrid>
      </ContentContainer>
      
      {/* NPS Feedback Modal */}
      <NPSFeedbackModal
        isOpen={showNPSModal}
        onClose={() => setShowNPSModal(false)}
        assessmentId={assessmentId}
        assessmentName={resultsData?.assessmentInfo?.assessmentName || 'Assessment'}
      />
    </PageContainer>
  );
};

export default ExecutiveSummaryNew;

