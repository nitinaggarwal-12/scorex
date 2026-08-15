import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiCheck, FiX, FiEye, FiEyeOff, FiLink } from 'react-icons/fi';
import customQuestionsService from '../services/customQuestionsService';
import * as assessmentService from '../services/assessmentService';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 120px 20px 40px 20px;
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 10px;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
`;

const StatsBar = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled(motion.div)`
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 5px;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 20px;
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
`;

const PillarButtonGroup = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  position: relative;
`;

const SampleButton = styled(motion.button)`
  padding: 12px 20px;
  background: white;
  color: #667eea;
  border: 2px solid white;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    background: #667eea;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const FilterButton = styled(motion.button)`
  padding: 10px 20px;
  border: 2px solid white;
  background: ${props => props.$active ? 'white' : 'transparent'};
  color: ${props => props.$active ? '#667eea' : 'white'};
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: white;
    color: #667eea;
  }
`;

const AddButton = styled(motion.button)`
  padding: 12px 24px;
  background: white;
  color: #667eea;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const QuestionsGrid = styled.div`
  display: grid;
  gap: 20px;
`;

const QuestionCard = styled(motion.div)`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  opacity: ${props => props.$isActive ? 1 : 0.6};
`;

const QuestionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const QuestionMeta = styled.div`
  flex: 1;
`;

const QuestionText = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 8px;
`;

const QuestionInfo = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
`;

const InfoTag = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  background: ${props => {
    switch (props.$type) {
      case 'pillar': return '#dbeafe';
      case 'category': return '#fef3c7';
      case 'weight': return '#d1fae5';
      default: return '#f1f5f9';
    }
  }};
  color: ${props => {
    switch (props.$type) {
      case 'pillar': return '#1e40af';
      case 'category': return '#92400e';
      case 'weight': return '#065f46';
      default: return '#475569';
    }
  }};
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const IconButton = styled(motion.button)`
  padding: 8px;
  background: ${props => props.$variant === 'danger' ? '#fecaca' : '#e0e7ff'};
  color: ${props => props.$variant === 'danger' ? '#dc2626' : '#667eea'};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.1);
    background: ${props => props.$variant === 'danger' ? '#fca5a5' : '#c7d2fe'};
  }
`;

const MaturityLevels = styled.div`
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
`;

const MaturityLevelItem = styled.div`
  margin-bottom: 12px;
  display: flex;
  gap: 12px;
`;

const LevelLabel = styled.span`
  font-weight: 700;
  color: #667eea;
  min-width: 70px;
`;

const LevelText = styled.span`
  color: #64748b;
  flex: 1;
`;

const Modal = styled(motion.div)`
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

const ModalContent = styled(motion.div)`
  background: white;
  border-radius: 16px;
  padding: 32px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const ModalTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  color: #1e293b;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;

  &:hover {
    color: #64748b;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 600;
  color: #475569;
  font-size: 0.95rem;
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const Textarea = styled.textarea`
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const Select = styled.select`
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  cursor: pointer;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
`;

const SubmitButton = styled(motion.button)`
  padding: 14px 28px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 16px;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const EmptyStateTitle = styled.h3`
  font-size: 1.5rem;
  color: #64748b;
  margin-bottom: 12px;
`;

const EmptyStateText = styled.p`
  color: #94a3b8;
  margin-bottom: 24px;
`;

const PILLARS = [
  { value: 'all', label: 'All Pillars' },
  { value: 'data_engineering', label: 'Data Integration & Engineering' },
  { value: 'analytics_bi', label: 'Analytics & BI' },
  { value: 'machine_learning', label: 'Machine Learning & AI' },
  { value: 'generative_ai', label: 'GenAI' },
  { value: 'operational_excellence', label: 'Enablement' },
  { value: 'platform_governance', label: 'Platform Operations' }
];

// Multiple sample question templates for each pillar
const SAMPLE_QUESTIONS = {
  data_engineering: [
    {
      question_text: 'How mature is your data ingestion and ETL pipeline architecture?',
      category: 'Data Pipeline Architecture',
      maturity_level_1: 'Manual data extraction with ad-hoc scripts',
      maturity_level_2: 'Basic automated pipelines with scheduled jobs',
      maturity_level_3: 'Standardized ETL framework with monitoring',
      maturity_level_4: 'Advanced orchestration with data quality checks',
      maturity_level_5: 'AI-driven intelligent data pipelines with auto-optimization'
    },
    {
      question_text: 'How effectively do you manage data quality and validation across your pipelines?',
      category: 'Data Quality Management',
      maturity_level_1: 'No systematic data quality checks',
      maturity_level_2: 'Manual spot checks on critical datasets',
      maturity_level_3: 'Automated validation rules with alerting',
      maturity_level_4: 'Comprehensive data quality framework with SLAs',
      maturity_level_5: 'ML-powered anomaly detection and auto-remediation'
    },
    {
      question_text: 'How well do you handle real-time and streaming data processing?',
      category: 'Streaming Data',
      maturity_level_1: 'Batch processing only with significant delays',
      maturity_level_2: 'Basic streaming for specific use cases',
      maturity_level_3: 'Standardized streaming architecture with Delta Live Tables',
      maturity_level_4: 'Advanced stream processing with exactly-once semantics',
      maturity_level_5: 'Unified batch and streaming with auto-scaling'
    }
  ],
  analytics_bi: [
    {
      question_text: 'How comprehensive is your business intelligence and reporting infrastructure?',
      category: 'BI & Reporting',
      maturity_level_1: 'Manual report generation in spreadsheets',
      maturity_level_2: 'Basic dashboards with limited interactivity',
      maturity_level_3: 'Standardized BI platform with self-service analytics',
      maturity_level_4: 'Advanced analytics with predictive insights',
      maturity_level_5: 'AI-powered insights with automated recommendations'
    },
    {
      question_text: 'How effectively do you enable self-service analytics for business users?',
      category: 'Self-Service Analytics',
      maturity_level_1: 'All analytics requests go through IT/data team',
      maturity_level_2: 'Limited self-service with pre-built dashboards',
      maturity_level_3: 'Business users can create their own reports',
      maturity_level_4: 'Governed self-service with certified datasets',
      maturity_level_5: 'AI-assisted analytics with natural language queries'
    },
    {
      question_text: 'How mature is your data visualization and storytelling capability?',
      category: 'Data Visualization',
      maturity_level_1: 'Basic charts and tables in spreadsheets',
      maturity_level_2: 'Standard dashboard templates',
      maturity_level_3: 'Interactive visualizations with drill-down',
      maturity_level_4: 'Advanced storytelling with narrative analytics',
      maturity_level_5: 'AI-generated insights with automated narratives'
    }
  ],
  machine_learning: [
    {
      question_text: 'How advanced is your ML model development and deployment process?',
      category: 'ML Operations',
      maturity_level_1: 'Experimental models in notebooks',
      maturity_level_2: 'Basic model training with manual deployment',
      maturity_level_3: 'MLOps pipeline with versioning and CI/CD',
      maturity_level_4: 'Automated model retraining and A/B testing',
      maturity_level_5: 'AutoML with continuous optimization and monitoring'
    },
    {
      question_text: 'How do you manage feature engineering and feature stores?',
      category: 'Feature Engineering',
      maturity_level_1: 'Ad-hoc feature creation per project',
      maturity_level_2: 'Reusable feature code in repositories',
      maturity_level_3: 'Centralized feature store with basic governance',
      maturity_level_4: 'Enterprise feature store with lineage tracking',
      maturity_level_5: 'Automated feature discovery and optimization'
    },
    {
      question_text: 'How mature is your model monitoring and observability?',
      category: 'Model Monitoring',
      maturity_level_1: 'No systematic model monitoring',
      maturity_level_2: 'Basic performance metrics tracking',
      maturity_level_3: 'Comprehensive monitoring with drift detection',
      maturity_level_4: 'Automated alerting and model retraining triggers',
      maturity_level_5: 'AI-driven model health management and auto-healing'
    }
  ],
  generative_ai: [
    {
      question_text: 'How effectively are you leveraging generative AI capabilities?',
      category: 'GenAI Integration',
      maturity_level_1: 'No GenAI usage',
      maturity_level_2: 'Experimental use of LLMs for specific tasks',
      maturity_level_3: 'Production GenAI applications with prompt engineering',
      maturity_level_4: 'Fine-tuned models with RAG and vector search',
      maturity_level_5: 'Enterprise-scale GenAI platform with governance'
    },
    {
      question_text: 'How do you manage prompt engineering and LLM optimization?',
      category: 'Prompt Engineering',
      maturity_level_1: 'No structured approach to prompts',
      maturity_level_2: 'Basic prompt templates for common tasks',
      maturity_level_3: 'Prompt library with versioning and testing',
      maturity_level_4: 'Automated prompt optimization and A/B testing',
      maturity_level_5: 'AI-assisted prompt generation and self-improvement'
    },
    {
      question_text: 'How mature is your vector database and semantic search implementation?',
      category: 'Vector Search',
      maturity_level_1: 'No vector search capabilities',
      maturity_level_2: 'Basic embedding generation for specific use cases',
      maturity_level_3: 'Production vector database with RAG patterns',
      maturity_level_4: 'Multi-modal embeddings with hybrid search',
      maturity_level_5: 'Self-optimizing semantic search with relevance feedback'
    }
  ],
  operational_excellence: [
    {
      question_text: 'How robust is your team enablement and training program?',
      category: 'Team Enablement',
      maturity_level_1: 'No formal training program',
      maturity_level_2: 'Ad-hoc training sessions',
      maturity_level_3: 'Structured onboarding and learning paths',
      maturity_level_4: 'Continuous learning with certifications',
      maturity_level_5: 'Center of excellence with mentorship programs'
    },
    {
      question_text: 'How effectively do you manage cost optimization and resource utilization?',
      category: 'Cost Management',
      maturity_level_1: 'No cost tracking or optimization',
      maturity_level_2: 'Basic cost monitoring and manual optimization',
      maturity_level_3: 'Automated cost allocation and showback',
      maturity_level_4: 'Predictive cost management with optimization recommendations',
      maturity_level_5: 'AI-driven cost optimization with auto-scaling'
    },
    {
      question_text: 'How mature is your incident management and support process?',
      category: 'Incident Management',
      maturity_level_1: 'Reactive firefighting with no process',
      maturity_level_2: 'Basic ticketing system for issues',
      maturity_level_3: 'Structured incident response with SLAs',
      maturity_level_4: 'Proactive monitoring with automated remediation',
      maturity_level_5: 'AI-powered predictive incident prevention'
    }
  ],
  platform_governance: [
    {
      question_text: 'How comprehensive is your platform security and compliance framework?',
      category: 'Security & Compliance',
      maturity_level_1: 'Basic authentication with limited access controls',
      maturity_level_2: 'Role-based access with basic auditing',
      maturity_level_3: 'Comprehensive RBAC with encryption',
      maturity_level_4: 'Advanced threat detection and compliance automation',
      maturity_level_5: 'Zero-trust architecture with AI-driven security'
    },
    {
      question_text: 'How effectively do you manage data governance and cataloging?',
      category: 'Data Governance',
      maturity_level_1: 'No centralized data catalog or governance',
      maturity_level_2: 'Basic metadata management',
      maturity_level_3: 'Enterprise data catalog with Unity Catalog',
      maturity_level_4: 'Automated data classification and lineage',
      maturity_level_5: 'AI-powered data discovery and policy enforcement'
    },
    {
      question_text: 'How mature is your workspace and environment management?',
      category: 'Workspace Management',
      maturity_level_1: 'Single workspace with no isolation',
      maturity_level_2: 'Multiple workspaces with manual management',
      maturity_level_3: 'Standardized workspace provisioning with IaC',
      maturity_level_4: 'Automated workspace lifecycle management',
      maturity_level_5: 'Self-service workspace provisioning with governance'
    }
  ]
};

const QuestionManager = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [showInactive, setShowInactive] = useState(false);
  const [selectedPillar, setSelectedPillar] = useState('all');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assigningQuestion, setAssigningQuestion] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [selectedAssessments, setSelectedAssessments] = useState([]);
  const [assignedAssessments, setAssignedAssessments] = useState([]);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingQuestion, setViewingQuestion] = useState(null);
  const [viewAssignments, setViewAssignments] = useState([]);
  
  const [formData, setFormData] = useState({
    question_text: '',
    pillar: 'all',
    category: '',
    weight: 1.0,
    maturity_level_1: '',
    maturity_level_2: '',
    maturity_level_3: '',
    maturity_level_4: '',
    maturity_level_5: ''
  });

  useEffect(() => {
    fetchQuestions();
    fetchStats();
  }, [showInactive, selectedPillar]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const pillarFilter = selectedPillar === 'all' ? null : selectedPillar;
      const response = await customQuestionsService.getAllQuestions(showInactive, pillarFilter);
      setQuestions(response.questions || []);
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await customQuestionsService.getStatistics();
      setStats(response.stats || {});
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'weight' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingQuestion) {
        await customQuestionsService.updateQuestion(editingQuestion.id, formData);
      } else {
        await customQuestionsService.createQuestion(formData);
      }
      setShowModal(false);
      resetForm();
      fetchQuestions();
      fetchStats();
    } catch (error) {
      console.error('Error saving question:', error);
      alert(error.message);
    }
  };

  const handleEdit = (question) => {
    setEditingQuestion(question);
    setFormData({
      question_text: question.question_text,
      pillar: question.pillar,
      category: question.category || '',
      weight: question.weight,
      maturity_level_1: question.maturity_level_1 || '',
      maturity_level_2: question.maturity_level_2 || '',
      maturity_level_3: question.maturity_level_3 || '',
      maturity_level_4: question.maturity_level_4 || '',
      maturity_level_5: question.maturity_level_5 || '',
      notes_placeholder: question.notes_placeholder || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('⚠️ Are you sure you want to DELETE this question permanently?\n\nThis will remove it from all assessments where it is assigned.\n\nThis action cannot be undone.')) {
      try {
        await customQuestionsService.deleteQuestion(id, true); // Pass true for hard delete
        fetchQuestions();
        fetchStats();
      } catch (error) {
        console.error('Error deleting question:', error);
        alert(error.message);
      }
    }
  };

  const handleToggleActive = async (question) => {
    try {
      await customQuestionsService.updateQuestion(question.id, {
        is_active: !question.is_active
      });
      fetchQuestions();
      fetchStats();
    } catch (error) {
      console.error('Error toggling question status:', error);
      alert(error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      question_text: '',
      pillar: 'all',
      category: '',
      weight: 1.0,
      maturity_level_1: '',
      maturity_level_2: '',
      maturity_level_3: '',
      maturity_level_4: '',
      maturity_level_5: '',
      notes_placeholder: ''
    });
    setEditingQuestion(null);
  };

  const handleAddNew = () => {
    resetForm();
    setShowModal(true);
  };

  const handleLoadSample = (pillarValue) => {
    const pillarSamples = SAMPLE_QUESTIONS[pillarValue];
    
    if (!pillarSamples || pillarSamples.length === 0) {
      alert('No sample question available for this pillar');
      return;
    }
    
    // Get existing question texts for this pillar to avoid duplicates
    const existingQuestions = questions
      .filter(q => q.pillar === pillarValue)
      .map(q => q.question_text.toLowerCase());
    
    // Find unused sample questions
    const unusedSamples = pillarSamples.filter(
      sample => !existingQuestions.includes(sample.question_text.toLowerCase())
    );
    
    // If all samples are used, pick a random one and suggest editing it
    const availableSamples = unusedSamples.length > 0 ? unusedSamples : pillarSamples;
    
    // Pick a random sample from available ones
    const randomIndex = Math.floor(Math.random() * availableSamples.length);
    const sampleData = availableSamples[randomIndex];
    
    // Show a message if all samples were already used
    if (unusedSamples.length === 0) {
      alert(`All ${pillarSamples.length} sample questions for this pillar have been used.\n\nPlease edit this question to make it unique.`);
    }
    
    setFormData({
      question_text: sampleData.question_text,
      pillar: pillarValue,
      category: sampleData.category,
      weight: 1.0,
      maturity_level_1: sampleData.maturity_level_1,
      maturity_level_2: sampleData.maturity_level_2,
      maturity_level_3: sampleData.maturity_level_3,
      maturity_level_4: sampleData.maturity_level_4,
      maturity_level_5: sampleData.maturity_level_5
    });
    setEditingQuestion(null);
    setShowModal(true);
  };

  const handleAssignToAssessments = async (question) => {
    try {
      setAssigningQuestion(question);
      
      // Fetch all assessments
      const allAssessments = await assessmentService.getAllAssessments();
      setAssessments(allAssessments || []);
      
      // Fetch current assignments for this question
      const assignments = await customQuestionsService.getQuestionAssignments(question.id);
      const assignedIds = assignments.assignments.map(a => a.assessment_id);
      setAssignedAssessments(assignedIds);
      setSelectedAssessments(assignedIds);
      
      setShowAssignModal(true);
    } catch (error) {
      console.error('Error loading assignments:', error);
      alert('Failed to load assessments: ' + error.message);
    }
  };

  const handleToggleAssessment = (assessmentId) => {
    setSelectedAssessments(prev => {
      if (prev.includes(assessmentId)) {
        return prev.filter(id => id !== assessmentId);
      } else {
        return [...prev, assessmentId];
      }
    });
  };

  const handleSaveAssignments = async () => {
    try {
      // Determine which to add and which to remove
      const toAdd = selectedAssessments.filter(id => !assignedAssessments.includes(id));
      const toRemove = assignedAssessments.filter(id => !selectedAssessments.includes(id));
      
      // Add new assignments
      if (toAdd.length > 0) {
        await customQuestionsService.assignToAssessments(assigningQuestion.id, toAdd);
      }
      
      // Remove old assignments
      for (const assessmentId of toRemove) {
        await customQuestionsService.removeAssignment(assigningQuestion.id, assessmentId);
      }
      
      alert(`Successfully updated assignments! Question assigned to ${selectedAssessments.length} assessment(s).`);
      setShowAssignModal(false);
      setAssigningQuestion(null);
    } catch (error) {
      console.error('Error saving assignments:', error);
      alert('Failed to save assignments: ' + error.message);
    }
  };

  const handleViewAssignments = async (question) => {
    try {
      setViewingQuestion(question);
      
      // Fetch current assignments for this question
      const assignments = await customQuestionsService.getQuestionAssignments(question.id);
      setViewAssignments(assignments.assignments || []);
      
      setShowViewModal(true);
    } catch (error) {
      console.error('Error loading assignments:', error);
      alert('Failed to load assignments: ' + error.message);
    }
  };

  return (
    <PageContainer>
      <ContentWrapper>
        <Header>
          <Title>Question Manager</Title>
          <Subtitle>Create and manage custom assessment questions</Subtitle>
        </Header>

        <StatsBar>
          <StatCard whileHover={{ y: -4 }}>
            <StatValue>{stats.total || 0}</StatValue>
            <StatLabel>Total Questions</StatLabel>
          </StatCard>
          <StatCard whileHover={{ y: -4 }}>
            <StatValue>{stats.active || 0}</StatValue>
            <StatLabel>Active</StatLabel>
          </StatCard>
          <StatCard whileHover={{ y: -4 }}>
            <StatValue>{stats.inactive || 0}</StatValue>
            <StatLabel>Inactive</StatLabel>
          </StatCard>
          <StatCard whileHover={{ y: -4 }}>
            <StatValue>{stats.unique_pillars || 0}</StatValue>
            <StatLabel>Pillars Covered</StatLabel>
          </StatCard>
        </StatsBar>

        <ActionBar>
          <FilterGroup>
            {PILLARS.filter(p => p.value !== 'all').map(pillar => (
              <SampleButton
                key={pillar.value}
                onClick={() => handleLoadSample(pillar.value)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title={`Load sample question for ${pillar.label}`}
              >
                📝 {pillar.label}
              </SampleButton>
            ))}
            <FilterButton
              $active={showInactive}
              onClick={() => setShowInactive(!showInactive)}
            >
              {showInactive ? <FiEye size={16} /> : <FiEyeOff size={16} />}
              {showInactive ? ' Hide Inactive' : ' Show Inactive'}
            </FilterButton>
          </FilterGroup>
        </ActionBar>

        {loading ? (
          <EmptyState>
            <EmptyStateTitle>Loading questions...</EmptyStateTitle>
          </EmptyState>
        ) : questions.length === 0 ? (
          <EmptyState>
            <EmptyStateTitle>No questions found</EmptyStateTitle>
            <EmptyStateText>
              Click on any pillar button above to load a sample question
            </EmptyStateText>
          </EmptyState>
        ) : (
          <QuestionsGrid>
            {questions.map((question) => (
              <QuestionCard
                key={question.id}
                $isActive={question.is_active}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <QuestionHeader>
                  <QuestionMeta>
                    <QuestionText>{question.question_text}</QuestionText>
                    <QuestionInfo>
                      <InfoTag $type="pillar">
                        {PILLARS.find(p => p.value === question.pillar)?.label || question.pillar}
                      </InfoTag>
                      {question.category && (
                        <InfoTag $type="category">{question.category}</InfoTag>
                      )}
                      <InfoTag $type="weight">Weight: {question.weight}x</InfoTag>
                      <InfoTag 
                        $type="pillar" 
                        style={{ 
                          background: '#dbeafe', 
                          color: '#1e40af', 
                          cursor: 'pointer' 
                        }}
                        onClick={() => handleViewAssignments(question)}
                      >
                        📊 View Assignments
                      </InfoTag>
                    </QuestionInfo>
                  </QuestionMeta>
                  <ButtonGroup>
                    <IconButton onClick={() => handleAssignToAssessments(question)}>
                      <FiLink size={18} />
                    </IconButton>
                    <IconButton onClick={() => handleToggleActive(question)}>
                      {question.is_active ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </IconButton>
                    <IconButton onClick={() => handleEdit(question)}>
                      <FiEdit2 size={18} />
                    </IconButton>
                    <IconButton $variant="danger" onClick={() => handleDelete(question.id)}>
                      <FiTrash2 size={18} />
                    </IconButton>
                  </ButtonGroup>
                </QuestionHeader>
                
                <MaturityLevels>
                  {[1, 2, 3, 4, 5].map(level => {
                    const levelText = question[`maturity_level_${level}`];
                    return levelText ? (
                      <MaturityLevelItem key={level}>
                        <LevelLabel>Level {level}:</LevelLabel>
                        <LevelText>{levelText}</LevelText>
                      </MaturityLevelItem>
                    ) : null;
                  })}
                </MaturityLevels>

                {/* User View Preview on Card */}
                <div style={{ 
                  marginTop: '20px', 
                  paddingTop: '20px',
                  borderTop: '2px solid #e2e8f0'
                }}>
                  <div style={{ 
                    fontSize: '0.9rem', 
                    fontWeight: 700, 
                    color: '#667eea', 
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    👁️ What users will see:
                  </div>
                  
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                    gap: '12px',
                    marginBottom: '12px'
                  }}>
                    <div style={{ 
                      padding: '10px', 
                      background: '#f8fafc', 
                      borderRadius: '6px',
                      border: '1px solid #e2e8f0'
                    }}>
                      <div style={{ fontWeight: 600, fontSize: '0.75rem', color: '#667eea', marginBottom: '4px' }}>
                        📊 Current State
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                        Single choice (Level 1-5)
                      </div>
                    </div>
                    
                    <div style={{ 
                      padding: '10px', 
                      background: '#f8fafc', 
                      borderRadius: '6px',
                      border: '1px solid #e2e8f0'
                    }}>
                      <div style={{ fontWeight: 600, fontSize: '0.75rem', color: '#667eea', marginBottom: '4px' }}>
                        🎯 Future State Vision
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                        Single choice (Level 1-5)
                      </div>
                    </div>
                    
                    <div style={{ 
                      padding: '10px', 
                      background: '#f8fafc', 
                      borderRadius: '6px',
                      border: '1px solid #e2e8f0'
                    }}>
                      <div style={{ fontWeight: 600, fontSize: '0.75rem', color: '#667eea', marginBottom: '4px' }}>
                        ⚙️ Technical Pain Points
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                        5 options (multiple choice)
                      </div>
                    </div>
                    
                    <div style={{ 
                      padding: '10px', 
                      background: '#f8fafc', 
                      borderRadius: '6px',
                      border: '1px solid #e2e8f0'
                    }}>
                      <div style={{ fontWeight: 600, fontSize: '0.75rem', color: '#667eea', marginBottom: '4px' }}>
                        💼 Business Pain Points
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                        5 options (multiple choice)
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ 
                    padding: '10px', 
                    background: '#fffbeb', 
                    borderRadius: '6px',
                    border: '1px solid #fde68a'
                  }}>
                    <div style={{ fontWeight: 600, fontSize: '0.75rem', color: '#92400e', marginBottom: '6px' }}>
                      📝 Notes Section:
                    </div>
                    <div style={{ 
                      fontSize: '0.7rem', 
                      color: '#78350f', 
                      lineHeight: '1.4',
                      fontStyle: 'italic'
                    }}>
                      Example: "Currently at Level 2, planning to reach Level 4 by Q3. Main blockers are resource constraints and legacy system integration."
                    </div>
                  </div>
                </div>
              </QuestionCard>
            ))}
          </QuestionsGrid>
        )}

        <AnimatePresence>
          {showModal && (
            <Modal
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
            >
              <ModalContent
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
              >
                <ModalHeader>
                  <ModalTitle>{editingQuestion ? 'Edit Question' : 'New Question'}</ModalTitle>
                  <CloseButton onClick={() => setShowModal(false)}>
                    <FiX />
                  </CloseButton>
                </ModalHeader>

                <Form onSubmit={handleSubmit}>
                  <FormGroup>
                    <Label>Question Text *</Label>
                    <Textarea
                      name="question_text"
                      value={formData.question_text}
                      onChange={handleInputChange}
                      placeholder="Enter the question text..."
                      required
                    />
                  </FormGroup>

                  <FormRow>
                    <FormGroup>
                      <Label>Pillar *</Label>
                      <Select
                        name="pillar"
                        value={formData.pillar}
                        onChange={handleInputChange}
                        required
                      >
                        {PILLARS.map(pillar => (
                          <option key={pillar.value} value={pillar.value}>
                            {pillar.label}
                          </option>
                        ))}
                      </Select>
                    </FormGroup>

                    <FormGroup>
                      <Label>Category</Label>
                      <Input
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        placeholder="Optional category"
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label>Weight</Label>
                      <Input
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleInputChange}
                        min="0"
                        max="2"
                        step="0.1"
                        required
                      />
                    </FormGroup>
                  </FormRow>

                  <FormGroup>
                    <Label>Maturity Level 1 (Ad Hoc)</Label>
                    <Textarea
                      name="maturity_level_1"
                      value={formData.maturity_level_1}
                      onChange={handleInputChange}
                      placeholder="Describe what Level 1 maturity looks like..."
                      rows={3}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Maturity Level 2 (Repeatable)</Label>
                    <Textarea
                      name="maturity_level_2"
                      value={formData.maturity_level_2}
                      onChange={handleInputChange}
                      placeholder="Describe what Level 2 maturity looks like..."
                      rows={3}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Maturity Level 3 (Defined)</Label>
                    <Textarea
                      name="maturity_level_3"
                      value={formData.maturity_level_3}
                      onChange={handleInputChange}
                      placeholder="Describe what Level 3 maturity looks like..."
                      rows={3}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Maturity Level 4 (Managed)</Label>
                    <Textarea
                      name="maturity_level_4"
                      value={formData.maturity_level_4}
                      onChange={handleInputChange}
                      placeholder="Describe what Level 4 maturity looks like..."
                      rows={3}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Maturity Level 5 (Optimizing)</Label>
                    <Textarea
                      name="maturity_level_5"
                      value={formData.maturity_level_5}
                      onChange={handleInputChange}
                      placeholder="Describe what Level 5 maturity looks like..."
                      rows={3}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>📝 Notes Placeholder / Guidance (Optional)</Label>
                    <Textarea
                      name="notes_placeholder"
                      value={formData.notes_placeholder}
                      onChange={handleInputChange}
                      placeholder="Provide guidance or example text for the Notes field... e.g., 'Share details about your current challenges, timeline, resources needed, or specific goals'"
                      rows={3}
                    />
                    <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '6px', fontStyle: 'italic' }}>
                      This text will appear as a placeholder in the Notes box to guide users on what to write.
                    </div>
                  </FormGroup>

                  {/* Preview Section */}
                  <div style={{ 
                    marginTop: '30px', 
                    padding: '20px', 
                    background: '#f8fafc', 
                    borderRadius: '12px',
                    border: '2px solid #e2e8f0'
                  }}>
                    <div style={{ 
                      fontSize: '1.1rem', 
                      fontWeight: 700, 
                      color: '#1e293b', 
                      marginBottom: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      👁️ User View Preview
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '16px' }}>
                      This is what users will see when answering this question:
                    </div>
                    
                    <div style={{ 
                      background: 'white', 
                      padding: '16px', 
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0'
                    }}>
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(4, 1fr)', 
                        gap: '12px',
                        marginBottom: '16px'
                      }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#667eea', marginBottom: '4px' }}>
                            Current State
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                            Select Level 1-5
                          </div>
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#667eea', marginBottom: '4px' }}>
                            Future State Vision
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                            Select Level 1-5
                          </div>
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#667eea', marginBottom: '4px' }}>
                            Technical Pain Points
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                            Multiple choice (5 options)
                          </div>
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#667eea', marginBottom: '4px' }}>
                            Business Pain Points
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                            Multiple choice (5 options)
                          </div>
                        </div>
                      </div>
                      
                      <div style={{ 
                        borderTop: '1px solid #e2e8f0', 
                        paddingTop: '12px'
                      }}>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#667eea', marginBottom: '8px' }}>
                          📝 Notes
                        </div>
                        <div style={{ 
                          padding: '12px', 
                          background: 'white', 
                          borderRadius: '6px',
                          border: '1px solid #e2e8f0',
                          fontSize: '0.8rem',
                          color: formData.notes_placeholder ? '#475569' : '#94a3b8',
                          lineHeight: '1.5',
                          fontStyle: formData.notes_placeholder ? 'normal' : 'italic'
                        }}>
                          {formData.notes_placeholder || 'Share specific details about your challenges or goals...'}
                        </div>
                      </div>
                    </div>
                  </div>

                  <SubmitButton type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    {editingQuestion ? 'Update Question' : 'Create Question'}
                  </SubmitButton>
                </Form>
              </ModalContent>
            </Modal>
          )}
          
          {showAssignModal && (
            <Modal
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAssignModal(false)}
            >
              <ModalContent
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
              >
                <ModalHeader>
                  <ModalTitle>Assign to Assessments</ModalTitle>
                  <CloseButton onClick={() => setShowAssignModal(false)}>
                    <FiX />
                  </CloseButton>
                </ModalHeader>

                <div style={{ marginBottom: '20px', padding: '16px', background: '#f1f5f9', borderRadius: '8px' }}>
                  <div style={{ fontWeight: 600, color: '#475569', marginBottom: '8px' }}>
                    Question: {assigningQuestion?.question_text}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
                    Select the assessments where this question should appear:
                  </div>
                </div>

                <div style={{ maxHeight: '400px', overflowY: 'auto', marginBottom: '20px' }}>
                  {assessments.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                      No assessments found
                    </div>
                  ) : (
                    assessments.map((assessment) => (
                      <div
                        key={assessment.id}
                        style={{
                          padding: '12px 16px',
                          marginBottom: '8px',
                          background: selectedAssessments.includes(assessment.id) ? '#e0e7ff' : 'white',
                          border: `2px solid ${selectedAssessments.includes(assessment.id) ? '#667eea' : '#e2e8f0'}`,
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px'
                        }}
                        onClick={() => handleToggleAssessment(assessment.id)}
                      >
                        <input
                          type="checkbox"
                          checked={selectedAssessments.includes(assessment.id)}
                          onChange={() => {}}
                          style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                            {assessment.assessment_name || assessment.name}
                          </div>
                          <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                            {assessment.organization_name} • {assessment.status || 'in_progress'} • {assessment.progress || 0}%
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <SubmitButton
                    type="button"
                    onClick={() => setShowAssignModal(false)}
                    style={{ background: '#94a3b8' }}
                  >
                    Cancel
                  </SubmitButton>
                  <SubmitButton
                    type="button"
                    onClick={handleSaveAssignments}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Save Assignments ({selectedAssessments.length})
                  </SubmitButton>
                </div>
              </ModalContent>
            </Modal>
          )}
          
          {showViewModal && (
            <Modal
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowViewModal(false)}
            >
              <ModalContent
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
              >
                <ModalHeader>
                  <ModalTitle>Question Assignment Report</ModalTitle>
                  <CloseButton onClick={() => setShowViewModal(false)}>
                    <FiX />
                  </CloseButton>
                </ModalHeader>

                <div style={{ marginBottom: '20px', padding: '16px', background: '#f1f5f9', borderRadius: '8px' }}>
                  <div style={{ fontWeight: 600, color: '#475569', marginBottom: '8px' }}>
                    Question: {viewingQuestion?.question_text}
                  </div>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '12px' }}>
                    <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
                      <strong>Pillar:</strong> {PILLARS.find(p => p.value === viewingQuestion?.pillar)?.label || viewingQuestion?.pillar}
                    </div>
                    {viewingQuestion?.category && (
                      <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
                        <strong>Category:</strong> {viewingQuestion.category}
                      </div>
                    )}
                    <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
                      <strong>Weight:</strong> {viewingQuestion?.weight}x
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '16px', padding: '12px', background: '#dbeafe', borderRadius: '8px', border: '2px solid #3b82f6' }}>
                  <div style={{ fontWeight: 700, color: '#1e40af', fontSize: '1.1rem' }}>
                    📊 Assigned to {viewAssignments.length} Assessment(s)
                  </div>
                </div>

                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {viewAssignments.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                      <div style={{ fontSize: '1.2rem', marginBottom: '8px' }}>📭</div>
                      <div style={{ fontWeight: 600, marginBottom: '4px' }}>No Assignments Yet</div>
                      <div style={{ fontSize: '0.9rem' }}>
                        This question is not assigned to any assessments.
                        <br />
                        Click the 🔗 Link icon to assign it.
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {viewAssignments.map((assignment, index) => (
                        <div
                          key={assignment.id}
                          onClick={() => {
                            // Navigate to the assessment's specific pillar page with question ID
                            // Add 'custom_' prefix to match the format used in assessment questions
                            const questionId = `custom_${viewingQuestion?.id}`;
                            navigate(`/assessment/${assignment.assessment_id}/${viewingQuestion?.pillar || 'platform_governance'}?questionId=${questionId}`);
                          }}
                          style={{
                            padding: '16px',
                            background: 'white',
                            border: '2px solid #e2e8f0',
                            borderRadius: '8px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#667eea';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.2)';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = '#e2e8f0';
                            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '1.05rem', marginBottom: '6px' }}>
                                {index + 1}. {assignment.assessment_name}
                              </div>
                              <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '8px' }}>
                                {assignment.organization_name}
                              </div>
                              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                <span style={{
                                  padding: '4px 10px',
                                  background: assignment.status === 'completed' ? '#dcfce7' : '#fef3c7',
                                  color: assignment.status === 'completed' ? '#166534' : '#92400e',
                                  borderRadius: '4px',
                                  fontSize: '0.85rem',
                                  fontWeight: 600
                                }}>
                                  {assignment.status || 'in_progress'}
                                </span>
                                <span style={{
                                  padding: '4px 10px',
                                  background: '#e0e7ff',
                                  color: '#3730a3',
                                  borderRadius: '4px',
                                  fontSize: '0.85rem',
                                  fontWeight: 600
                                }}>
                                  {assignment.progress || 0}% Complete
                                </span>
                              </div>
                            </div>
                          </div>
                          <div style={{ 
                            fontSize: '0.8rem', 
                            color: '#94a3b8', 
                            marginTop: '12px',
                            paddingTop: '12px',
                            borderTop: '1px solid #e2e8f0'
                          }}>
                            Assigned on: {new Date(assignment.assigned_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ marginTop: '20px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <SubmitButton
                    type="button"
                    onClick={() => {
                      setShowViewModal(false);
                      handleAssignToAssessments(viewingQuestion);
                    }}
                    style={{ background: '#667eea' }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    🔗 Manage Assignments
                  </SubmitButton>
                  <SubmitButton
                    type="button"
                    onClick={() => setShowViewModal(false)}
                    style={{ background: '#94a3b8' }}
                  >
                    Close
                  </SubmitButton>
                </div>
              </ModalContent>
            </Modal>
          )}
        </AnimatePresence>
      </ContentWrapper>
    </PageContainer>
  );
};

export default QuestionManager;

