import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FiMenu, FiX, FiPlay, FiList, FiLogIn, FiLogOut, FiUser, FiFileText, FiUsers, FiSend, FiChevronDown, FiLock, FiUserPlus, FiMail, FiMessageSquare, FiSettings, FiBook, FiMonitor, FiCpu } from 'react-icons/fi';
import toast from 'react-hot-toast';
import * as assessmentService from '../services/assessmentService';
import authService from '../services/authService';
import LoginModal from './LoginModal';

// Fixed: Added mobile navigation with hamburger menu

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 16px 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    padding: 12px 0;
  }
`;

const NavContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 40px;

  @media (max-width: 768px) {
    padding: 0 24px;
    justify-content: space-between;
  }
`;

const DatabricksLogo = styled.img`
  height: 32px;
  width: auto;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.85;
  }

  @media (max-width: 768px) {
    height: 28px;
  }
`;

const TopNav = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;

  @media (max-width: 1400px) {
    gap: 20px;
  }

  @media (max-width: 1200px) {
    gap: 16px;
  }

  @media (max-width: 768px) {
    gap: 12px;
  }

  @media (max-width: 640px) {
    display: none;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  
  @media (max-width: 640px) {
    display: none;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: #374151;
  cursor: pointer;
  padding: 8px;
  font-size: 24px;
  
  @media (max-width: 640px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &:hover {
    color: #3b82f6;
  }
`;

const MobileMenu = styled.div`
  display: none;
  
  @media (max-width: 640px) {
    display: ${props => props.$isOpen ? 'flex' : 'none'};
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    background: white;
    border-bottom: 1px solid #e5e7eb;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    flex-direction: column;
    padding: 16px 0;
    max-height: calc(100vh - 60px);
    overflow-y: auto;
  }
`;

const MobileNavLink = styled.button`
  background: none;
  border: none;
  color: #64748b;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  padding: 16px 24px;
  text-align: left;
  width: 100%;
  transition: all 0.2s;

  &:hover {
    background: #f9fafb;
    color: #3b82f6;
  }

  &:active {
    background: #f3f4f6;
  }
`;

const MobileSecondaryCTAButton = styled.button`
  background: white;
  color: #3b82f6;
  border: 2px solid #3b82f6;
  padding: 14px 24px;
  margin: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:active {
    transform: scale(0.98);
    background: #eff6ff;
  }
`;

const MobileCTAButton = styled.button`
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
  border: none;
  padding: 14px 24px;
  margin: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:active {
    transform: scale(0.98);
  }
`;

const NavLink = styled.button`
  background: none;
  border: none;
  color: #64748b;
  font-weight: 500;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all 0.2s;
  padding: 8px 0;
  position: relative;
  white-space: nowrap;

  @media (max-width: 1200px) {
    font-size: 0.875rem;
  }

  &:hover {
    color: #3b82f6;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: #3b82f6;
    transform: scaleX(0);
    transition: transform 0.2s;
  }

  &:hover::after {
    transform: scaleX(1);
  }
`;

const SecondaryCTAButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  color: #3b82f6;
  border: 2px solid #3b82f6;
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;

  @media (max-width: 1200px) {
    font-size: 0.875rem;
    padding: 8px 20px;
  }

  &:hover {
    background: #eff6ff;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    transition: transform 0.2s;
  }

  &:hover svg {
    transform: scale(1.1);
  }
`;

const CTAButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
  white-space: nowrap;

  @media (max-width: 1200px) {
    font-size: 0.875rem;
    padding: 8px 20px;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    transition: transform 0.2s;
  }

  &:hover svg {
    transform: translateX(3px);
  }
`;

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  color: #374151;
  border: 2px solid #e5e7eb;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;

  @media (max-width: 1200px) {
    font-size: 0.875rem;
    padding: 8px 16px;
  }

  &:hover {
    background: #f9fafb;
    border-color: #d1d5db;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }

  svg.chevron {
    transition: transform 0.3s ease;
    ${props => props.$isOpen && 'transform: rotate(180deg);'}
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  min-width: 200px;
  padding: 8px 0;
  z-index: 1000;
  opacity: ${props => props.$isOpen ? 1 : 0};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  transform: translateY(${props => props.$isOpen ? '0' : '-10px'});
  transition: all 0.3s ease;
`;

const DropdownItem = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 20px;
  background: none;
  border: none;
  color: #374151;
  font-size: 0.9375rem;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f3f4f6;
    color: #3b82f6;
  }

  svg {
    font-size: 16px;
    color: #6b7280;
  }

  &:hover svg {
    color: #3b82f6;
  }
`;

const DropdownDivider = styled.div`
  height: 1px;
  background: #e5e7eb;
  margin: 8px 0;
`;

const DropdownEmailLink = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 12px 20px;
  background: none;
  border: none;
  color: #6b7280;
  font-size: 0.875rem;
  text-align: left;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    color: #3b82f6;
    background: #f3f4f6;
  }

  svg {
    flex-shrink: 0;
  }
`;

const GlobalNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(authService.getUser());
  const [assessmentsDropdownOpen, setAssessmentsDropdownOpen] = useState(false);
  const [assignmentsDropdownOpen, setAssignmentsDropdownOpen] = useState(false);
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);

  useEffect(() => {
    if (authService.isAuthenticated()) {
      setCurrentUser(authService.getUser());
    }
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.dropdown-container')) {
        setAssessmentsDropdownOpen(false);
        setAssignmentsDropdownOpen(false);
        setAdminDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    navigate('/');
    closeMobileMenu();
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    // Redirect based on role
    if (user.role === 'consumer') {
      navigate('/my-assessments');
    } else if (user.role === 'author' || user.role === 'admin') {
      navigate('/insights-dashboard');
    }
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const scrollToSection = (sectionId) => {
    closeMobileMenu();
    // If not on home page, navigate to home first with scroll state
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: sectionId } });
    } else {
      // Already on home page, just scroll
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleLogoClick = () => {
    closeMobileMenu();
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (path) => {
    closeMobileMenu();
    navigate(path);
  };

  const handleTrySample = async () => {
    closeMobileMenu();
    try {
      toast.loading('Generating sample assessment...', { id: 'sample-assessment' });
      const result = await assessmentService.generateSampleAssessment();
      
      console.log('[GlobalNav] Sample assessment result:', result);
      
      // Extract assessmentId from various possible response structures
      const assessmentId = result?.assessment?.id || result?.data?.assessmentId || result?.assessmentId || result?.id;
      
      if (!assessmentId) {
        console.error('[GlobalNav] No assessment ID found in result:', result);
        throw new Error('No assessment ID returned from server');
      }
      
      console.log('[GlobalNav] Assessment ID:', assessmentId);
      
      
      // Longer delay to ensure assessment is fully saved
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate to the first question page
      console.log('[GlobalNav] Navigating to:', `/assessment/${assessmentId}/platform_governance`);
      navigate(`/assessment/${assessmentId}/platform_governance`);
    } catch (error) {
      console.error('[GlobalNav] Error creating sample assessment:', error);
      
    }
  };

  // Generate UNIQUE, question-specific customer comments
  // 🔥 CRITICAL: Uses TRUE randomness + timestamp to ensure NO TWO ASSESSMENTS ARE EVER THE SAME
  const generateRealisticComment = (pillarId, dimensionId, questionId, currentState, timestamp) => {
    // Comprehensive dimension-specific comment library (low maturity = 1-2)
    const dimensionComments = {
      // PLATFORM & GOVERNANCE
      'environment_architecture': [
        "Single workspace for all teams. No isolation between dev/prod. Need multi-workspace strategy with Unity Catalog for governance.",
        "Workspaces created ad-hoc. Inconsistent naming. Want standardized workspace provisioning with Terraform and tagging for cost tracking.",
        "Every team has own workspace. No standards. Need centralized architecture with Unity Catalog federation and workspace templates for consistency.",
        "Dev and prod in same workspace. Security concern. Want separate workspaces with Unity Catalog catalog-level isolation and promotion workflows."
      ],
      'identity_security': [
        "Manual user provisioning via Azure AD. No SCIM. Want automated sync and group-based Unity Catalog permissions with audit logs.",
        "Admin rights granted liberally. No principle of least privilege. Need RBAC with Unity Catalog and secrets management with Databricks Secrets.",
        "Passwords hardcoded in notebooks. Security risk. Want Databricks Secrets with Azure Key Vault integration and automatic secret rotation for compliance.",
        "No audit trail for data access. Compliance concern. Need Unity Catalog audit logs with automated HIPAA compliance reporting and access reviews."
      ],
      'governance_compliance': [
        "No centralized data catalog. Users don't know what data exists. Want Unity Catalog for discovery and lineage with PII tagging.",
        "Compliance team manually reviews code quarterly. Need automated scans for PII/PHI and Unity Catalog data classification tags with certifications.",
        "Data lineage tracked in spreadsheets. Audit nightmare. Want Unity Catalog automatic lineage tracking and impact analysis for regulatory compliance.",
        "PII scattered across tables. GDPR risk. Need Unity Catalog with automated PII detection, classification tags, and deletion workflows for privacy compliance."
      ],
      'observability_monitoring': [
        "No visibility into cluster usage. Surprises in cloud bills. Want cluster event logs and system tables for usage attribution by team.",
        "Jobs fail silently. Alerts reactive. Need Databricks workflows with email alerts and integration with PagerDuty for production pipelines.",
        "Query performance unpredictable. No metrics. Want system tables dashboard with query profiles, bottleneck identification, and optimization recommendations.",
        "Pipeline SLAs missed without warning. Need proactive monitoring with system tables, Databricks SQL alerts, and Slack notifications for operations team."
      ],
      'cost_management': [
        "Cloud costs ballooning. No understanding of spend drivers. Want budget alerts and system tables for chargeback to business units with tags.",
        "Teams oversize clusters by default. No right-sizing. Need automated recommendations and spot instance policies for non-critical workloads to reduce costs.",
        "No visibility into DBU consumption. CFO asking questions. Want system tables cost dashboard with spend by team and budget alerts for accountability.",
        "Clusters left running overnight. Waste discovered post-mortem. Need auto-termination policies, idle cluster detection, and budget guardrails for cost control."
      ],
      
      // DATA ENGINEERING
      'ingestion_strategy': [
        "Manual SFTP transfers nightly. Batch loads via notebooks. Want Auto Loader for real-time streaming ingestion with schema evolution and checkpoints.",
        "Data engineers write custom Python scripts per source. No reusability. Need standardized connectors and Auto Loader templates for common sources like S3.",
        "Kinesis streams ingested via custom Spark code. Complex error handling. Want Auto Loader with automatic schema inference and exactly-once semantics for reliability.",
        "Files land in S3, manual tracking of which processed. Want Auto Loader with checkpoint management and incremental processing for operational efficiency."
      ],
      'lakehouse_architecture': [
        "Parquet files in S3 with no ACID guarantees. Delete operations problematic. Want Delta Lake for ACID transactions and time travel for audits.",
        "Raw zone, curated zone managed manually. No clear medallion architecture. Need Delta Lake with Bronze/Silver/Gold layers and DLT pipelines for automation.",
        "Multiple formats (Parquet, ORC, Avro). Schema drift issues. Want Delta Lake with automatic schema evolution and unified format for consistency.",
        "No data versioning. Can't rollback bad loads. Need Delta Lake time travel with VACUUM control and version retention policies for data governance."
      ],
      'pipeline_orchestration': [
        "Airflow orchestrates Spark submits. Complex dependencies hard to manage. Want Databricks Workflows with native integration and task dependencies for observability.",
        "Notebooks run manually or via cron. No visibility into failures. Need Databricks Jobs with retries, alerting, and lineage tracking for production pipelines.",
        "Jenkins triggers notebook runs. No native monitoring. Want Databricks Workflows with built-in alerting, retry logic, and failure notifications for production reliability.",
        "Pipeline failures discovered by end users. No proactive alerts. Need Databricks Jobs with SLA tracking, email notifications, and PagerDuty integration for operational excellence."
      ],
      'data_quality': [
        "No data quality checks. Issues found by analysts downstream. Want DLT expectations (expect_or_fail, expect_or_drop) to catch issues early at ingestion.",
        "Manual SQL checks in notebooks. Inconsistent across teams. Need Lakehouse Monitoring for automated data quality metrics and anomaly detection dashboards.",
        "Bad data reaches production dashboards. Customer complaints. Want DLT with quarantine tables and Lakehouse Monitoring for proactive quality gates.",
        "No visibility into data freshness or completeness. Need Lakehouse Monitoring with SLA tracking, automated alerts, and data quality scorecards for operations."
      ],
      'performance_scalability': [
        "Pipelines take 6+ hours. Business wants hourly refreshes. Need Photon acceleration and partition tuning with Z-ordering for query performance improvement.",
        "Clusters manually sized. Either over-provisioned or run out of memory. Want auto-scaling clusters and serverless compute for cost efficiency and elasticity.",
        "Jobs fail with OOM errors. Trial and error sizing. Want serverless compute with automatic resource management and Photon for predictable performance.",
        "Data volumes growing 3x per year. Current pipelines don't scale. Need liquid clustering, Photon acceleration, and serverless for elastic growth."
      ],
      
      // ANALYTICS & BI
      'analytic_performance': [
        "Analysts wait 5+ minutes per query. Frustration growing. Want serverless SQL warehouses with Photon for sub-second queries and query caching for reusability.",
        "Same aggregations re-computed hourly. Inefficient. Need materialized views and query result caching to reduce compute costs and improve response times.",
        "Dashboards timeout during business hours. Resource contention. Want serverless SQL with auto-scaling and Photon acceleration for consistent performance.",
        "PowerBI extracts take 30+ minutes. Analysts frustrated. Need Databricks SQL with query optimization, Z-ordering, and liquid clustering for fast BI integration."
      ],
      'semantic_layer': [
        "Fact tables have 200+ columns. Star schema unclear. Want dimensional modeling best practices and slowly changing dimension (SCD) patterns for historical accuracy.",
        "Every team creates own metrics. Inconsistent revenue numbers. Need centralized semantic layer with Unity Catalog and SQL UDFs for metric standardization and governance.",
        "Analysts join 10+ tables for simple report. Complex SQL. Want curated data marts with pre-joined dimensions and Unity Catalog views for self-service simplicity.",
        "Metric definitions vary by department. Trust issues. Need Unity Catalog with tagged semantic layer and SQL functions for single source of truth."
      ],
      'bi_reporting': [
        "Analysts export to Excel then pivot. No real-time dashboards. Want Databricks SQL dashboards with auto-refresh and embedding for business stakeholders.",
        "PowerBI connects to raw tables. Slow and fragile. Need Databricks SQL endpoint with Photon and aggregation tables for fast BI integration and reliability.",
        "Tableau extracts refresh overnight. Stale data by morning. Want Databricks SQL with live connection and Photon for real-time BI dashboards.",
        "Reports built in notebooks, manually regenerated. Want Databricks SQL dashboards with scheduling, parameterization, and email delivery for executive reporting."
      ],
      'self_service_analytics': [
        "Analysts wait on data engineers for every query. Bottleneck. Want Databricks SQL with saved queries and Genie for natural language ad-hoc analysis.",
        "Business users can't explore data independently. No access control. Need Unity Catalog row/column security and Databricks SQL permissions for safe self-service access.",
        "SQL skills vary widely. Advanced users frustrated, novices stuck. Want Databricks SQL with Genie for natural language and query templates for different skill levels.",
        "Data requests backlogged 2 weeks. Business agility suffering. Need Databricks SQL with governed self-service and AI/BI for analyst autonomy without engineering bottleneck."
      ],
      'data_sharing': [
        "Notebooks emailed as HTML. No version control. Want Databricks Repos with Git integration and notebook versioning for collaboration and reproducibility.",
        "Each analyst has own copy of queries. Duplication and drift. Need shared queries library in Databricks SQL and comments for institutional knowledge sharing.",
        "Partners request data extracts monthly. Manual CSV exports. Want Delta Sharing for secure, automated data sharing with external organizations and real-time updates.",
        "Cross-team collaboration difficult. Different workspaces and catalogs. Need Unity Catalog federation and Delta Sharing for seamless internal and external collaboration."
      ],
      
      // MACHINE LEARNING
      'ml_lifecycle': [
        "ML experiments tracked in spreadsheets. Can't reproduce results. Want MLflow for experiment tracking with hyperparameter logging and model versioning for reproducibility.",
        "Model artifacts stored in S3 with manual naming. No lineage. Need MLflow Model Registry for version control and model lineage with Unity Catalog integration.",
        "Data scientists can't find past experiments. Rework common. Want MLflow with experiment search, comparison views, and automated metric tracking for productivity.",
        "Model performance degrades in production, no history to compare. Need MLflow with model monitoring, drift detection, and automated alerting for quality assurance."
      ],
      'ml_deployment': [
        "Models deployed via Flask on EC2. Manual scaling. Want MLflow Model Serving with autoscaling endpoints and A/B testing for production inference workloads.",
        "Data scientists retrain models monthly via notebook runs. No automation. Need Databricks Jobs with model retraining pipelines and trigger-based deployment for MLOps.",
        "Model deployment takes 2 weeks. Business value delayed. Want MLflow Model Serving with one-click deployment and automated testing for rapid productionization.",
        "Production models run on outdated data. Stale predictions. Need automated retraining pipelines with Databricks Jobs and Feature Store for always-fresh models."
      ],
      'feature_engineering': [
        "Feature engineering code duplicated in notebooks. Inconsistency across models. Want Databricks Feature Store for centralized feature definitions and online/offline serving.",
        "Training features differ from inference. Causes model drift. Need Feature Store with point-in-time lookups for training-serving skew prevention and consistency.",
        "Feature computation expensive, re-run for every model. Want Feature Store with precomputed features and online serving for cost efficiency and low latency.",
        "No visibility into feature usage across models. Want Feature Store with lineage tracking, usage analytics, and feature discovery for reusability and governance."
      ],
      'ml_governance': [
        "No model approval process. Models deployed to prod ad-hoc. Want MLflow Model Registry with stage transitions and approval workflows for governance compliance.",
        "Can't explain model decisions. Regulatory concern. Need model monitoring dashboards and SHAP integration for explainability audits and regulatory compliance reporting.",
        "No model risk assessment. Compliance gaps. Want MLflow with model documentation, bias testing, and approval gates for regulated ML deployments.",
        "Models in production, but who owns them? Need MLflow Registry with ownership tags, SLA tracking, and automated deprecation policies for operational accountability."
      ],
      'ml_scale': [
        "Single-node scikit-learn. Datasets growing beyond memory. Want distributed training with Spark MLlib or PyTorch Distributed for large-scale model training on big data.",
        "Hyperparameter tuning takes days. Blocking experimentation. Need Hyperopt with MLflow integration and parallel trials for faster experimentation cycles and model optimization.",
        "GPU clusters expensive and underutilized. Want efficient distributed training with Horovod or Ray and GPU pooling for cost-effective scale.",
        "Training jobs fail on large datasets. OOM errors common. Need Spark ML for distributed training or model parallelism with Mosaic AI for petabyte-scale data."
      ],
      
      // GENERATIVE AI
      'genai_strategy': [
        "No GenAI initiative. CIO asking for roadmap. Want Mosaic AI assessment workshop to identify high-impact use cases like RAG for knowledge base search.",
        "Experimenting with ChatGPT for customer support. Security concerns. Need Databricks Foundation Models for on-platform LLM inference with data residency and guardrails.",
        "Business units using shadow AI. Governance risk. Want centralized GenAI platform with Mosaic AI, approved models, and usage tracking for enterprise control.",
        "GenAI POCs not scaling to production. Need Mosaic AI infrastructure with Vector Search, Model Serving, and MLOps for productionizing LLM applications."
      ],
      'data_readiness': [
        "Documentation scattered in Confluence and SharePoint. No vector embeddings. Want Vector Search index for semantic retrieval and RAG application on internal knowledge base.",
        "PDFs and Word docs not searchable semantically. Need chunking strategy and Vector Search with hybrid search (keyword + semantic) for enterprise document retrieval.",
        "Knowledge base outdated, manually maintained. Want automated ingestion with Vector Search, embedding generation, and incremental updates for always-current RAG.",
        "Unstructured data in S3, no metadata. Want document parsing with Mosaic AI, Vector Search indexing, and Unity Catalog tagging for governed GenAI data."
      ],
      'genai_architecture': [
        "Prompt engineering in Python notebooks. No reusability. Want Databricks AI Playground for prompt iteration and versioning with evaluation metrics and comparison views.",
        "Calling OpenAI API directly. Cost and latency concerns. Need Databricks Model Serving with provisioned throughput for Foundation Models and reduced latency for production apps.",
        "RAG app in single notebook. Not production-ready. Want Mosaic AI with Model Serving, Vector Search, and monitoring for enterprise-grade GenAI applications.",
        "LLM prompts hardcoded. No A/B testing. Need Mosaic AI with prompt management, versioning, and experiment tracking for systematic optimization."
      ],
      'genai_quality': [
        "No way to measure RAG quality. Anecdotal feedback only. Want MLflow with LLM evaluation metrics (retrieval precision, answer relevance, faithfulness) for systematic assessment.",
        "Prompt changes break production. No regression testing. Need automated LLM evaluation pipelines in Databricks Jobs with golden test sets for continuous quality monitoring.",
        "LLM outputs inconsistent. User frustration. Want MLflow with LLM evaluation, judge models, and quality thresholds for reliable GenAI responses.",
        "Can't compare different prompts or models. Need Mosaic AI with A/B testing, evaluation metrics dashboard, and winner selection for continuous improvement."
      ],
      'genai_governance': [
        "No guardrails on LLM outputs. Risk of hallucinations. Want Databricks Lakehouse Monitoring for LLM toxicity detection and output filtering with guardrail policies.",
        "Concerns about bias in GenAI responses. Need bias testing framework and evaluation metrics for fairness audits and responsible AI governance with stakeholder review.",
        "No PII protection in LLM workflows. Privacy risk. Want Unity Catalog with PII detection, masking policies, and audit logs for compliant GenAI applications.",
        "LLM costs unpredictable. Budget overruns. Need Mosaic AI with usage tracking, cost attribution, and budget alerts for financial control of GenAI operations."
      ],
      
      // OPERATIONAL EXCELLENCE
      'center_of_excellence': [
        "No central team. Every project figures out Databricks independently. Want CoE with office hours and Slack channel for support escalation and best practices sharing.",
        "Platform capabilities unknown. Marketing team doesn't know about Vector Search for personalization. Need quarterly showcase and use case library for internal evangelism.",
        "Support requests go to vendor. Slow response. Want internal CoE with Databricks experts, office hours, and escalation paths for faster issue resolution.",
        "No governance council. Inconsistent patterns. Need CoE with architecture review board, standards documentation, and approval workflows for platform governance."
      ],
      'collaboration_culture': [
        "Teams work in silos. Notebooks not shared. Want Databricks Repos with Git integration and shared workspace folders for knowledge sharing and collaboration.",
        "Best practices lost when engineers leave. Need documentation wiki and community Slack channels for institutional knowledge and peer support.",
        "No cross-team code review. Quality varies. Want Databricks Repos with pull requests, code review workflows, and shared libraries for quality assurance.",
        "Teams duplicate work unknowingly. Need shared workspace with discovery tools, asset tagging, and quarterly demos for cross-pollination and reuse."
      ],
      'enablement_training': [
        "Tribal knowledge. Key engineers are single point of failure. Want documentation site with runbooks and best practices repository for platform patterns and troubleshooting.",
        "Teams reinvent the wheel. No code reuse. Need curated template library for common patterns (DLT, MLOps, security) with example implementations and GitHub integration.",
        "New users overwhelmed. No learning path. Want structured training program with Databricks Academy, hands-on labs, and certification milestones for skill development.",
        "Advanced users hit plateau. No continuous learning. Need lunch-and-learn sessions, conference attendance, and sandbox environment for innovation and skill growth."
      ],
      'cost_value': [
        "No visibility into platform usage or ROI. CFO asks for justification. Want system tables dashboard for active users, cost per business unit, and business impact metrics.",
        "Clusters idle overnight. Wasted spend. Need automated cluster termination policies, chargeback model, and usage alerts with recommendations for cost optimization.",
        "Can't justify platform expansion. Need business case with ROI metrics, time-to-insight improvements, and cost avoidance from legacy retirement for executive buy-in.",
        "Budget overruns mid-quarter. No forecasting. Want system tables with cost trends, workload forecasting, and budget alerts with auto-scaling policies for predictability."
      ],
      'innovation_culture': [
        "15% of data team uses Databricks. Most still on legacy tools. Want onboarding program and success metrics to track adoption velocity with executive dashboard.",
        "New hires take 3 weeks to become productive. No training. Need Databricks Academy subscriptions and internal bootcamp curriculum with certification tracking for faster ramp-up.",
        "Innovation requests backlogged. No experimentation time. Want hackathons, sandbox workspaces, and 10% time policy for exploring new Databricks capabilities.",
        "Teams fear breaking production. Risk-averse culture. Need dev/staging environments, CI/CD pipelines, and rollback procedures for safe experimentation and innovation."
      ]
    };
    
    // Get comments for this specific dimension
    const comments = dimensionComments[dimensionId] || [
      "Currently using manual processes. Need automation and best practices implementation with Databricks platform capabilities for operational efficiency.",
      "Early stage adoption. Looking to scale with Databricks features and proper governance for enterprise-grade data and AI workloads."
    ];
    
    // 🔥 CRITICAL FIX: Use TRUE randomness + timestamp seed
    // NO deterministic hashing - every assessment MUST be unique!
    // Combine timestamp, questionId, and Math.random() for absolute uniqueness
    const timestampSeed = timestamp + questionId.charCodeAt(0);
    const randomSeed = Math.random() * timestampSeed;
    const commentIndex = Math.floor(randomSeed % comments.length);
    
    return comments[commentIndex];
  };

  return (
    <>
      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />
      
      <Nav>
        <NavContainer>
          {/* Desktop Navigation */}
          <TopNav>
            <NavLink onClick={handleLogoClick}>Home</NavLink>
            <NavLink onClick={() => handleNavigate('/deep-dive')}>Deep Dive</NavLink>
            <NavLink onClick={() => handleNavigate('/pitch-deck')}>Pitch Deck</NavLink>
            <NavLink onClick={() => handleNavigate('/user-guide')}>User Guide</NavLink>
            <NavLink onClick={() => window.open('/workflow-demo.html', '_blank')}>Workflow Demo</NavLink>
          </TopNav>

          <ActionButtons>
            {currentUser ? (
              <>
                {/* Dashboard Button */}
                {currentUser.role !== 'consumer' && (
                  <SecondaryCTAButton onClick={() => navigate('/insights-dashboard')}>
                    Dashboard
                  </SecondaryCTAButton>
                )}

                {/* Assessments Dropdown */}
                <DropdownContainer className="dropdown-container">
                  <DropdownButton 
                    $isOpen={assessmentsDropdownOpen}
                    onClick={() => setAssessmentsDropdownOpen(!assessmentsDropdownOpen)}
                  >
                    <FiFileText size={14} />
                    Assessments
                    <FiChevronDown size={14} className="chevron" />
                  </DropdownButton>
                  <DropdownMenu $isOpen={assessmentsDropdownOpen}>
                    <DropdownItem onClick={() => {
                      navigate('/start');
                      setAssessmentsDropdownOpen(false);
                    }}>
                      <FiPlay />
                      Start Assessment
                    </DropdownItem>
                    {currentUser.role !== 'consumer' && (
                      <DropdownItem onClick={() => {
                        handleTrySample();
                        setAssessmentsDropdownOpen(false);
                      }}>
                        <FiPlay />
                        Try Sample
                      </DropdownItem>
                    )}
                    <DropdownItem onClick={() => {
                      navigate('/my-assessments');
                      setAssessmentsDropdownOpen(false);
                    }}>
                      <FiFileText />
                      My Assessments
                    </DropdownItem>
                    <DropdownItem onClick={() => {
                      navigate('/assessments');
                      setAssessmentsDropdownOpen(false);
                    }}>
                      <FiList />
                      All Assessments
                    </DropdownItem>
                    <DropdownDivider />
                    <DropdownItem onClick={() => {
                      navigate('/genai-readiness');
                      setAssessmentsDropdownOpen(false);
                    }}>
                      <FiCpu />
                      New Gen AI Assessment
                    </DropdownItem>
                    <DropdownItem onClick={() => {
                      navigate('/genai-readiness/list');
                      setAssessmentsDropdownOpen(false);
                    }}>
                      <FiList />
                      Gen AI Assessments
                    </DropdownItem>
                    {currentUser.role === 'admin' && !currentUser.testMode && (
                      <DropdownItem onClick={() => {
                        navigate('/admin/questions');
                        setAssessmentsDropdownOpen(false);
                      }}>
                        <FiSettings />
                        Manage Questions
                      </DropdownItem>
                    )}
                  </DropdownMenu>
                </DropdownContainer>

                {/* Assignments Dropdown (Admin/Author only) */}
                {(currentUser.role === 'admin' || currentUser.role === 'author') && (
                  <DropdownContainer className="dropdown-container">
                    <DropdownButton 
                      $isOpen={assignmentsDropdownOpen}
                      onClick={() => setAssignmentsDropdownOpen(!assignmentsDropdownOpen)}
                    >
                      <FiList size={14} />
                      Assignments
                      <FiChevronDown size={14} className="chevron" />
                    </DropdownButton>
                    <DropdownMenu $isOpen={assignmentsDropdownOpen}>
                      <DropdownItem onClick={() => {
                        navigate('/my-assignments');
                        setAssignmentsDropdownOpen(false);
                      }}>
                        <FiFileText />
                        View Assignments
                      </DropdownItem>
                      <DropdownItem onClick={() => {
                        navigate('/assign-assessment');
                        setAssignmentsDropdownOpen(false);
                      }}>
                        <FiUserPlus />
                        Assign Users
                      </DropdownItem>
                      {currentUser.role === 'admin' && (
                        <>
                          <DropdownItem onClick={() => {
                            navigate('/question-assignments');
                            setAssignmentsDropdownOpen(false);
                          }}>
                            <FiFileText />
                            Assign Questions
                          </DropdownItem>
                          <DropdownItem onClick={() => {
                            navigate('/user-management');
                            setAssignmentsDropdownOpen(false);
                          }}>
                            <FiUsers />
                            Manage Users
                          </DropdownItem>
                        </>
                      )}
                    </DropdownMenu>
                  </DropdownContainer>
                )}

                {/* Admin/User Dropdown */}
                <DropdownContainer className="dropdown-container">
                  <DropdownButton 
                    $isOpen={adminDropdownOpen}
                    onClick={() => setAdminDropdownOpen(!adminDropdownOpen)}
                  >
                    <FiUser size={14} />
                    {currentUser.testMode 
                      ? `${currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)} (Test Mode)`
                      : (currentUser.firstName || currentUser.email.split('@')[0])
                    }
                    <FiChevronDown size={14} className="chevron" />
                  </DropdownButton>
                  <DropdownMenu $isOpen={adminDropdownOpen}>
                    {currentUser.role === 'admin' && !currentUser.testMode && (
                      <>
                        <DropdownItem onClick={() => {
                          const testUser = { ...currentUser, role: 'author', testMode: true, originalRole: 'admin' };
                          localStorage.setItem('user', JSON.stringify(testUser));
                          setCurrentUser(testUser);
                          setAdminDropdownOpen(false);
                          
                          window.location.reload();
                        }}>
                          <FiUsers />
                          Switch to Author
                        </DropdownItem>
                        <DropdownItem onClick={() => {
                          const testUser = { ...currentUser, role: 'consumer', testMode: true, originalRole: 'admin' };
                          localStorage.setItem('user', JSON.stringify(testUser));
                          setCurrentUser(testUser);
                          setAdminDropdownOpen(false);
                          
                          window.location.reload();
                        }}>
                          <FiUsers />
                          Switch to Consumer
                        </DropdownItem>
                        <DropdownDivider />
                      </>
                    )}
                    {currentUser.testMode && (
                      <>
                        {currentUser.role !== 'author' && (
                          <DropdownItem onClick={() => {
                            const testUser = { ...currentUser, role: 'author' };
                            localStorage.setItem('user', JSON.stringify(testUser));
                            setCurrentUser(testUser);
                            setAdminDropdownOpen(false);
                            
                            window.location.reload();
                          }}>
                            <FiUsers />
                            Switch to Author
                          </DropdownItem>
                        )}
                        {currentUser.role !== 'consumer' && (
                          <DropdownItem onClick={() => {
                            const testUser = { ...currentUser, role: 'consumer' };
                            localStorage.setItem('user', JSON.stringify(testUser));
                            setCurrentUser(testUser);
                            setAdminDropdownOpen(false);
                            
                            window.location.reload();
                          }}>
                            <FiUsers />
                            Switch to Consumer
                          </DropdownItem>
                        )}
                        <DropdownItem onClick={() => {
                          const originalUser = { ...currentUser, role: currentUser.originalRole, testMode: false };
                          delete originalUser.originalRole;
                          localStorage.setItem('user', JSON.stringify(originalUser));
                          setCurrentUser(originalUser);
                          setAdminDropdownOpen(false);
                          
                          window.location.reload();
                        }}>
                          <FiUser />
                          Switch Back to Admin
                        </DropdownItem>
                        <DropdownDivider />
                      </>
                    )}
                <DropdownItem onClick={() => {
                  setAdminDropdownOpen(false);
                  
                }}>
                      <FiLock />
                      Change Password
                    </DropdownItem>
                    <DropdownDivider />
                    <DropdownItem onClick={() => {
                      handleLogout();
                      setAdminDropdownOpen(false);
                    }}>
                      <FiLogOut />
                      Logout
                    </DropdownItem>
                    <DropdownDivider />
                    <DropdownItem onClick={() => {
                      navigate('/feedback');
                      setAdminDropdownOpen(false);
                    }}>
                      <FiMessageSquare />
                      Give Feedback
                    </DropdownItem>
                    {currentUser.role === 'admin' && !currentUser.testMode && (
                      <>
                        <DropdownItem onClick={() => {
                          navigate('/admin/feedback');
                          setAdminDropdownOpen(false);
                        }}>
                          <FiMessageSquare />
                          View All Feedback
                        </DropdownItem>
                      </>
                    )}
                    <DropdownDivider />
                    <DropdownEmailLink 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText('nitin.aggarwal@databricks.com');
                        
                        setAdminDropdownOpen(false);
                      }}
                    >
                      <FiMail />
                      nitin.aggarwal@databricks.com
                    </DropdownEmailLink>
                  </DropdownMenu>
                </DropdownContainer>
              </>
            ) : (
              <>
                <SecondaryCTAButton onClick={() => {
                  setShowLoginModal(true);
                }}>
                  Dashboard
                </SecondaryCTAButton>
                <SecondaryCTAButton onClick={() => {
                  setShowLoginModal(true);
                }}>
                  <FiPlay size={14} />
                  Try Sample
                </SecondaryCTAButton>
                <SecondaryCTAButton onClick={() => setShowLoginModal(true)}>
                  <FiLogIn size={14} />
                  Login
                </SecondaryCTAButton>
                <CTAButton onClick={() => setShowLoginModal(true)}>
                  Start Assessment →
                </CTAButton>
              </>
            )}
          </ActionButtons>

        {/* Mobile Menu Button */}
        <MobileMenuButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <FiX /> : <FiMenu />}
        </MobileMenuButton>
      </NavContainer>

      {/* Mobile Menu */}
      <MobileMenu $isOpen={mobileMenuOpen}>
        <MobileNavLink onClick={handleLogoClick}>Home</MobileNavLink>
        <MobileNavLink onClick={() => handleNavigate('/deep-dive')}>Deep Dive</MobileNavLink>
        <MobileNavLink onClick={() => handleNavigate('/pitch-deck')}>Pitch Deck</MobileNavLink>
        <MobileNavLink onClick={() => handleNavigate('/user-guide')}>User Guide</MobileNavLink>
        <MobileNavLink onClick={() => window.open('/workflow-demo.html', '_blank')}>Workflow Demo</MobileNavLink>
        
        {currentUser ? (
          <>
            <MobileSecondaryCTAButton onClick={() => handleNavigate('/my-assessments')}>
              <FiFileText size={16} />
              My Assessments
            </MobileSecondaryCTAButton>
            <MobileSecondaryCTAButton onClick={() => handleNavigate('/genai-readiness')}>
              <FiCpu size={16} />
              New Gen AI Assessment
            </MobileSecondaryCTAButton>
            <MobileSecondaryCTAButton onClick={() => handleNavigate('/genai-readiness/list')}>
              <FiList size={16} />
              Gen AI Assessments
            </MobileSecondaryCTAButton>
            {currentUser.role !== 'consumer' && (
              <>
                <MobileSecondaryCTAButton onClick={() => handleNavigate('/insights-dashboard')}>
                  Dashboard
                </MobileSecondaryCTAButton>
                <MobileSecondaryCTAButton onClick={handleTrySample}>
                  <FiPlay size={16} />
                  Try Sample
                </MobileSecondaryCTAButton>
              </>
            )}
            {(currentUser.role === 'admin' || currentUser.role === 'author') && (
              <MobileSecondaryCTAButton onClick={() => handleNavigate('/my-assignments')}>
                <FiFileText size={16} />
                View Assignments
              </MobileSecondaryCTAButton>
            )}
            {currentUser.role === 'admin' && (
              <>
                <MobileSecondaryCTAButton onClick={() => handleNavigate('/question-assignments')}>
                  <FiFileText size={16} />
                  Assign Questions
                </MobileSecondaryCTAButton>
                <MobileSecondaryCTAButton onClick={() => handleNavigate('/user-management')}>
                  <FiUsers size={16} />
                  Manage Assignments
                </MobileSecondaryCTAButton>
              </>
            )}
            <MobileCTAButton onClick={() => handleNavigate('/start')}>
              Start Assessment →
            </MobileCTAButton>
            <MobileSecondaryCTAButton onClick={handleLogout}>
              <FiLogOut size={16} />
              Logout ({currentUser.email})
            </MobileSecondaryCTAButton>
          </>
        ) : (
          <>
            <MobileSecondaryCTAButton onClick={() => {
              closeMobileMenu();
              setShowLoginModal(true);
            }}>
              Dashboard
            </MobileSecondaryCTAButton>
            <MobileSecondaryCTAButton onClick={() => {
              closeMobileMenu();
              setShowLoginModal(true);
            }}>
              <FiPlay size={16} />
              Try Sample
            </MobileSecondaryCTAButton>
            <MobileSecondaryCTAButton onClick={() => {
              closeMobileMenu();
              setShowLoginModal(true);
            }}>
              <FiLogIn size={16} />
              Login
            </MobileSecondaryCTAButton>
            <MobileCTAButton onClick={() => {
              closeMobileMenu();
              setShowLoginModal(true);
            }}>
              Start Assessment →
            </MobileCTAButton>
          </>
        )}
      </MobileMenu>
    </Nav>
    </>
  );
};

export default GlobalNav;

