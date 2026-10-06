import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiLayers, 
  FiAlertTriangle, 
  FiCheckCircle, 
  FiCpu, 
  FiDatabase, 
  FiShield, 
  FiZap, 
  FiGrid, 
  FiEye, 
  FiRepeat, 
  FiBox, 
  FiDownload,
  FiRefreshCw,
  FiX,
  FiSend
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import { SiGooglecloud } from 'react-icons/si';
import toast from 'react-hot-toast';
import DiagramViewer, { sanitizeDrawioXmlAttributes } from './DiagramViewer';
import dynamicAssessmentService from '../services/dynamicAssessmentService';
import masterBlueprintCatalog, {
  getMasterArchitectureDiagrams,
  getMermaidDiagram,
  buildLegacyDataDependencyMapXml,
  buildCompleteWellArchitectedGcpDrMasterXml,
  buildPristineFinopsXml,
  buildDataLakehouseXml,
  buildHubAndSpokeAgentConfigXml,
  buildSecureDeploymentTopologyXml,
  buildEvalSafetyXml,
  buildEnterpriseAgentRuntimeXml
} from '../services/masterBlueprintCatalog';

const DiagramContainer = styled(motion.div)`
  background: white;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  padding: 28px;
  margin-bottom: 28px;
  position: relative;
  overflow: hidden;

  @media print {
    page-break-inside: avoid !important;
    box-shadow: none;
    border: 1px solid #cbd5e1;
    margin-bottom: 16px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 20px;
`;

const TitleBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  .icon {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.35rem;
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
  }
`;

const Title = styled.h2`
  font-size: 1.3rem;
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 3px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const GeminiBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.72rem;
  font-weight: 700;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  color: #1d4ed8;
  border: 1px solid #bfdbfe;
  padding: 3px 8px;
  border-radius: 6px;
`;

const Subtitle = styled.p`
  font-size: 0.85rem;
  color: #64748b;
  margin: 0;
`;

const ActionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const ViewToggle = styled.div`
  display: flex;
  background: #f1f5f9;
  padding: 4px;
  border-radius: 10px;
  gap: 4px;
  flex-wrap: wrap;
`;

const ViewBtn = styled.button`
  background: ${props => props.$active ? 'white' : 'transparent'};
  color: ${props => props.$active ? '#1e293b' : '#64748b'};
  font-weight: ${props => props.$active ? '700' : '500'};
  box-shadow: ${props => props.$active ? '0 2px 6px rgba(0,0,0,0.08)' : 'none'};
  border: none;
  border-radius: 6px;
  padding: 6px 14px;
  font-size: 0.78rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;

  &:hover {
    color: #1e293b;
  }
`;

const RegenerateBtn = styled.button`
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 6px 14px;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 2px 6px rgba(99, 102, 241, 0.3);
  transition: all 0.2s;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;

const ExportBtn = styled.button`
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 6px 14px;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 2px 6px rgba(249, 115, 22, 0.3);
  transition: all 0.2s;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(249, 115, 22, 0.4);
  }
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const ModalCard = styled(motion.div)`
  background: white;
  border-radius: 16px;
  max-width: 600px;
  width: 100%;
  padding: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  border: 1px solid #e2e8f0;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  h3 {
    font-size: 1.15rem;
    font-weight: 800;
    color: #0f172a;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const PromptChips = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 14px;
`;

const PromptChip = styled.button`
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 20px;
  padding: 4px 10px;
  font-size: 0.72rem;
  color: #475569;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    background: #eff6ff;
    border-color: #93c5fd;
    color: #1d4ed8;
  }
`;

const PromptTextarea = styled.textarea`
  width: 100%;
  box-sizing: border-box;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1.5px solid #cbd5e1;
  font-size: 0.88rem;
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
  margin-bottom: 16px;

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const SecondaryBtn = styled.button`
  background: #f1f5f9;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #475569;
  cursor: pointer;

  &:hover {
    background: #e2e8f0;
  }
`;

const PrimaryBtn = styled.button`
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 18px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 2px 6px rgba(99, 102, 241, 0.3);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const DualDiagramGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

const TripleDiagramGrid = styled.div`
  display: grid;
  grid-template-columns: ${props => props.$stacked ? '1fr' : 'repeat(3, minmax(0, 1fr))'};
  gap: 18px;
  margin-bottom: 22px;

  @media (max-width: 1340px) {
    grid-template-columns: 1fr;
  }
`;

const ComparisonGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

const ArchColumn = styled.div`
  background: ${props => props.$isTarget 
    ? 'linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)' 
    : 'linear-gradient(180deg, #fff7ed 0%, #ffffff 100%)'};
  border: 2px solid ${props => props.$isTarget ? '#bbf7d0' : '#fed7aa'};
  border-radius: 14px;
  padding: 20px;
  position: relative;
`;

const ColHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1.5px solid ${props => props.$isTarget ? '#dcfce7' : '#ffedd5'};

  .title-group {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 1.05rem;
    font-weight: 800;
    color: ${props => props.$isTarget ? '#15803d' : '#c2410c'};
  }

  .badge {
    font-size: 0.72rem;
    font-weight: 700;
    padding: 3px 8px;
    border-radius: 6px;
    background: ${props => props.$isTarget ? '#dcfce7' : '#ffedd5'};
    color: ${props => props.$isTarget ? '#166534' : '#9a3412'};
  }
`;

const LayerStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const LayerCard = styled.div`
  background: white;
  border: 1px solid ${props => props.$isTarget ? '#86efac' : '#fdba74'};
  border-radius: 10px;
  padding: 12px 14px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  .layer-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
  }

  .layer-name {
    font-size: 0.82rem;
    font-weight: 800;
    color: #1e293b;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .layer-tag {
    font-size: 0.68rem;
    font-weight: 700;
    padding: 2px 6px;
    border-radius: 4px;
    background: ${props => props.$isTarget ? '#ecfdf5' : '#fff1f2'};
    color: ${props => props.$isTarget ? '#059669' : '#e11d48'};
    border: 1px solid ${props => props.$isTarget ? '#a7f3d0' : '#fecdd3'};
  }

  .layer-items {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 6px;
  }

  .item-pill {
    font-size: 0.72rem;
    background: ${props => props.$isTarget ? '#f0fdf4' : '#f8fafc'};
    color: ${props => props.$isTarget ? '#166534' : '#475569'};
    border: 1px solid ${props => props.$isTarget ? '#bbf7d0' : '#e2e8f0'};
    padding: 3px 8px;
    border-radius: 6px;
    font-weight: 600;
  }
`;

const StrategicBenefitsFooter = styled.div`
  margin-top: 20px;
  background: linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%);
  border: 1px solid #bfdbfe;
  border-radius: 12px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;

  .callout {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.88rem;
    font-weight: 700;
    color: #1e40af;
  }

  .badges {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .benefit-badge {
    background: white;
    border: 1px solid #93c5fd;
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 700;
    color: #1d4ed8;
    display: flex;
    align-items: center;
    gap: 4px;
  }
`;

// DEFAULT BASELINE DRAW.IO XML (PromptCanvas P1-APP-L-01 Legacy Map)
const DEFAULT_CURRENT_XML = buildLegacyDataDependencyMapXml();

// DEFAULT TARGET STATE DRAW.IO XML (PromptCanvas P3-APP-C-01 Panoramic Master)
const DEFAULT_TARGET_XML = buildCompleteWellArchitectedGcpDrMasterXml();

// Robust React Error Boundary for XML Graph Model rendering
class DiagramErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[DiagramErrorBoundary] Diagram rendering error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid #ef4444',
          borderRadius: '12px',
          padding: '32px',
          textAlign: 'center',
          color: '#f8fafc',
          minHeight: '280px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px'
        }}>
          <div style={{ fontSize: '2rem' }}>⚠️</div>
          <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#fca5a5' }}>
            Architecture Diagram Rendering Notice
          </div>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', maxWidth: '480px', margin: 0 }}>
            The graph canvas encountered a parsing anomaly. You can trigger an instant AI auto-heal regeneration with Nano Banana 2 (gemini-3.1-flash-image-preview).
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false });
              if (this.props.onAutoHeal) this.props.onAutoHeal();
            }}
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 20px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            ⚡ Auto-Heal & Regenerate Diagram
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const REFERENCE_BLUEPRINTS = [
  {
    id: 'core_data_ai_maturity',
    name: '1. Core Enterprise Data & AI Mesh',
    domain: 'Core Diagnostic',
    tier: 'P3-APP-C-01 Panoramic',
    badge: 'BigLake & Vertex AI',
    description: 'Panoramic Medallion Lakehouse on BigQuery, Vertex AI Agentic Mesh, Zero-Trust Landing Zone, and Looker semantic BI.',
    title: 'GCP Unified Enterprise Data & AI Platform',
    subtitle: 'P3-APP-C-01 Panoramic Architecture Blueprint',
    builder: buildCompleteWellArchitectedGcpDrMasterXml
  },
  {
    id: 'openai_to_gemini',
    name: '2. OpenAI to Gemini Migration Mesh',
    domain: 'Model Migration',
    tier: 'P4-AI-P-04 GKE Autopilot',
    badge: 'Gemini 2M & Apigee',
    description: 'Apigee AI Gateway, Gemini 2M Context Caching (75% discount), Model Armor real-time shield, and sandboxed MCP tool microservices.',
    title: 'Google Vertex AI & Gemini Enterprise Mesh',
    subtitle: 'Apigee AI Gateway + 2M Context Caching + Model Armor',
    builder: buildEnterpriseAgentRuntimeXml
  },
  {
    id: 'cloud_finops_chargeback',
    name: '3. Cloud FinOps & Chargeback Model',
    domain: 'Cloud Economics',
    tier: 'P2-GOV-C-01 / P5-AI-L-05',
    badge: 'FOCUS 1.0 BigQuery',
    description: 'Daily FOCUS 1.0 BigQuery billing export, OpenCost pod attribution, GKE Autopilot scale-to-zero, and 85%+ CUD coverage.',
    title: 'Enterprise Cloud FinOps & Chargeback Engine',
    subtitle: 'P2-GOV-C-01 Multi-Tenant Cost Attribution & Quota Governor',
    builder: buildPristineFinopsXml
  },
  {
    id: 'agentic_mesh_mcp',
    name: '4. Autonomous Multi-Agent Mesh (MCP)',
    domain: 'Agentic AI',
    tier: 'P3-AI-L-03 / ARCH-MCP-06',
    badge: 'MCP Tool Gateway',
    description: 'Google Omni 1.1 & Gemini 3.1 Pro Super-Orchestrator Hub, Model Context Protocol (MCP) tool gateway, Tangential ReAct ring, and HITL approval gates.',
    title: 'Hub-and-Spoke Multi-Agent Mesh & MCP Gateway',
    subtitle: 'P3-AI-L-03 Agent Bus + ARCH-MCP-06 Standardized Tools',
    builder: buildHubAndSpokeAgentConfigXml
  },
  {
    id: 'edw_bigquery_lakehouse',
    name: '5. EDW to BigQuery Lakehouse Modernization',
    domain: 'Data Modernization',
    tier: 'P3-DAT-L-04 / P4-DAT-P-13',
    badge: 'BigLake Iceberg',
    description: 'Datastream CDC, BigLake open Apache Iceberg tables, Dataplex ABAC governance, and BigQuery Editions autoscaling slots.',
    title: 'Google BigQuery & BigLake Modern Fabric',
    subtitle: 'P3-DAT-L-04 Medallion Fabric + P4-DAT-P-13 Streaming',
    builder: buildDataLakehouseXml
  },
  {
    id: 'zero_trust_security',
    name: '6. Enterprise AI & Zero-Trust Security',
    domain: 'Security & TRiSM',
    tier: 'P4-SEC-P-01 / P4-GOV-L-07',
    badge: 'VPC-SC & Model Armor',
    description: 'Cloud Armor WAF, Identity-Aware Proxy (IAP), Real-Time Cloud DLP surrogate masking, Cloud KMS HSM CMEK, and Binary Authorization.',
    title: 'Zero-Trust Secure AI Deployment & TRiSM Shield',
    subtitle: 'P4-SEC-P-01 Secure Topology + P4-GOV-L-07 TRiSM Shield',
    builder: buildSecureDeploymentTopologyXml
  },
  {
    id: 'genai_evaluation_platform',
    name: '7. GenAI Platform & Evaluation Suite',
    domain: 'GenAI Readiness',
    tier: 'P4-GOV-L-06 Evaluation',
    badge: 'Vertex Model Eval',
    description: 'Enterprise Agent Registry, Vertex AI Vector Search multimodal grounding, automated Model Evaluation benchmarks, and RLHF feedback loops.',
    title: 'Closed-Loop GenAI Platform & Evaluation Suite',
    subtitle: 'P4-GOV-L-06 Safety, Factuality & Latency Benchmarks',
    builder: buildEvalSafetyXml
  }
];

const formatAuditTimestamp = (date = new Date()) => {
  try {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }).format(date instanceof Date ? date : new Date(date));
  } catch (e) {
    return new Date().toLocaleTimeString();
  }
};

const ArchitectureComparisonDiagram = ({ 
  instanceId,
  initialDiagrams,
  currentScore = 2.6, 
  targetScore = 4.5,
  customerName = 'Enterprise Client',
  useCase = 'Platform Modernization',
  framework = {},
  theme = 'light',
  responses = {},
  notes = [],
  dimensionScores = [],
  recommendations = [],
  criticalConstraints = [],
  keyStrengths = []
}) => {
  const [viewMode, setViewMode] = useState('blueprint'); // 'blueprint' | 'cards'
  const diagramTheme = 'light';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isXmlEditorOpen, setIsXmlEditorOpen] = useState(false);
  const [isVisualDrawioOpen, setIsVisualDrawioOpen] = useState(false);
  const [xmlTargetState, setXmlTargetState] = useState('target'); // 'current' | 'target'
  const [rawXmlDraft, setRawXmlDraft] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const normalizedDimScores = React.useMemo(() => {
    if (Array.isArray(dimensionScores) && dimensionScores.length > 0) return dimensionScores;
    if (dimensionScores && typeof dimensionScores === 'object' && !Array.isArray(dimensionScores)) {
      return Object.entries(dimensionScores).map(([id, d]) => ({
        id,
        name: d.name || d.title || id,
        currentScore: Number(d.score ?? d.currentScore ?? currentScore),
        futureScore: Number(d.targetScore ?? d.futureScore ?? targetScore)
      }));
    }
    if (Array.isArray(framework?.dimensionScores) && framework.dimensionScores.length > 0) {
      return framework.dimensionScores;
    }
    return [];
  }, [dimensionScores, framework, currentScore, targetScore]);

  // Derive authentic PromptCanvas default diagrams for the current assessment framework
  const defaultBlueprintData = React.useMemo(() => {
    return getMasterArchitectureDiagrams(
      framework,
      { customerName, useCase, responses, notes },
      { overallScore: currentScore, targetScore, dimensionScores: normalizedDimScores }
    );
  }, [framework, customerName, useCase, currentScore, targetScore, responses, notes, normalizedDimScores]);

  // Detect obsolete/draft diagrams that lack Template 05 3-Zone Master Layout
  const isOutdatedDiagram = useCallback((diagrams) => {
    if (!diagrams || !diagrams.currentStateXml) return true;
    if (diagrams.template05MasterLayout && diagrams.transitionStateXml) return false;
    return true;
  }, []);

  const persistDiagramsToBackend = useCallback(async (updatedData) => {
    if (!instanceId) return;
    try {
      await dynamicAssessmentService.updateArchitectureDiagrams(instanceId, updatedData);
    } catch (err) {
      console.warn('[ArchitectureComparisonDiagram] Auto-persist notice:', err.message);
    }
  }, [instanceId]);

  const [diagramsData, setDiagramsData] = useState(() => {
    if (initialDiagrams && !isOutdatedDiagram(initialDiagrams)) {
      return initialDiagrams;
    }
    return defaultBlueprintData;
  });

  useEffect(() => {
    if (initialDiagrams && !isOutdatedDiagram(initialDiagrams)) {
      setDiagramsData(initialDiagrams);
    } else {
      setDiagramsData(defaultBlueprintData);
      if (initialDiagrams && isOutdatedDiagram(initialDiagrams)) {
        persistDiagramsToBackend(defaultBlueprintData);
      }
    }
  }, [initialDiagrams, defaultBlueprintData, isOutdatedDiagram, persistDiagramsToBackend]);

  const [versionHistory, setVersionHistory] = useState([
    { id: 'v1.0', version: 'v1.0', label: 'Initial AI Synthesis', timestamp: formatAuditTimestamp(), target: 'target' }
  ]);

  const notesStorageKey = instanceId ? `scorex_arch_notes_${instanceId}` : 'scorex_arch_notes_default';
  const [reviewerNotes, setReviewerNotes] = useState(() => {
    try {
      const saved = localStorage.getItem(notesStorageKey);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(notesStorageKey, JSON.stringify(reviewerNotes));
    } catch (e) {
      // LocalStorage error fallback
    }
  }, [reviewerNotes, notesStorageKey]);

  const [noteText, setNoteText] = useState('');
  const [showNotesDrawer, setShowNotesDrawer] = useState(false);
  const [stackedThreeView, setStackedThreeView] = useState(true);
  const drawioIframeRef = useRef(null);

  const handleOpenVisualDrawio = (target = 'target') => {
    setXmlTargetState(target);
    setIsVisualDrawioOpen(true);
  };

  // Listen to Draw.io embed iframe postMessage protocol
  useEffect(() => {
    const handleMessage = (e) => {
      if (!e.data || typeof e.data !== 'string') return;
      
      try {
        const msg = JSON.parse(e.data);
        if (msg.event === 'init') {
          // Send active XML to Draw.io
          const xmlToSend = xmlTargetState === 'current'
            ? (diagramsData?.currentStateXml || currentXml)
            : xmlTargetState === 'transition'
            ? (diagramsData?.transitionStateXml || transitionXml)
            : (diagramsData?.targetStateXml || targetXml);

          if (drawioIframeRef.current && drawioIframeRef.current.contentWindow) {
            drawioIframeRef.current.contentWindow.postMessage(JSON.stringify({
              action: 'load',
              autosave: 1,
              xml: sanitizeDrawioXmlAttributes(xmlToSend),
              title: `ScoreX ${xmlTargetState === 'current' ? 'Current Baseline' : xmlTargetState === 'transition' ? 'Transition Bridge' : 'Target Future'} Architecture`
            }), '*');
          }
        } else if (msg.event === 'save' || msg.event === 'autosave') {
          if (msg.xml) {
            const nextVerNum = (versionHistory.length + 1);
            const newVer = `v1.${nextVerNum}`;
            
            const xmlField = xmlTargetState === 'current'
              ? 'currentStateXml'
              : xmlTargetState === 'transition'
              ? 'transitionStateXml'
              : 'targetStateXml';

            const nextDiagrams = {
              ...diagramsData,
              [xmlField]: msg.xml,
              generatedAt: new Date().toISOString()
            };

            setDiagramsData(nextDiagrams);
            persistDiagramsToBackend(nextDiagrams);

            setVersionHistory(prev => [
              {
                id: newVer,
                version: newVer,
                label: `Visual Draw.io Edit (${xmlTargetState})`,
                timestamp: formatAuditTimestamp(),
                target: xmlTargetState
              },
              ...prev
            ]);

            toast.success(`💾 Saved & synchronized ${xmlTargetState} Architecture (${newVer})!`, { icon: '🎨' });
          }
        } else if (msg.event === 'exit') {
          setIsVisualDrawioOpen(false);
        }
      } catch (err) {
        // Not a JSON postMessage
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [xmlTargetState, diagramsData, versionHistory, persistDiagramsToBackend]);

  const handleOpenXmlEditor = (target = 'target') => {
    setXmlTargetState(target);
    const xmlToEdit = target === 'current' 
      ? (diagramsData?.currentStateXml || currentXml)
      : target === 'transition'
      ? (diagramsData?.transitionStateXml || transitionXml)
      : (diagramsData?.targetStateXml || targetXml);
    setRawXmlDraft(xmlToEdit);
    setIsXmlEditorOpen(true);
  };

  const handleApplyXmlDraft = () => {
    if (!rawXmlDraft || !rawXmlDraft.includes('<mxGraphModel')) {
      toast.error('Invalid Draw.io XML. Must contain valid <mxGraphModel> root element.');
      return;
    }
    const nextVerNum = (versionHistory.length + 1);
    const newVer = `v1.${nextVerNum}`;
    const xmlField = xmlTargetState === 'current'
      ? 'currentStateXml'
      : xmlTargetState === 'transition'
      ? 'transitionStateXml'
      : 'targetStateXml';

    const nextDiagrams = {
      ...diagramsData,
      [xmlField]: rawXmlDraft,
      generatedAt: new Date().toISOString()
    };

    setDiagramsData(nextDiagrams);
    persistDiagramsToBackend(nextDiagrams);

    setVersionHistory(prev => [
      {
        id: newVer,
        version: newVer,
        label: `Raw XML Tweak (${xmlTargetState})`,
        timestamp: formatAuditTimestamp(),
        target: xmlTargetState
      },
      ...prev
    ]);

    setIsXmlEditorOpen(false);
    toast.success(`✅ Applied and saved manual XML edits (${newVer})!`);
  };

  const activeFrameworkKey = String(framework?.typeKey || framework?.id || framework?.title || useCase || '').toLowerCase();
  const activeFrameworkTitle = framework?.title || useCase || 'Enterprise Architecture';

  const nb2CodePrefix = /finops|cost|billing/.test(activeFrameworkKey)
    ? 'NB2-FIN'
    : /zero_trust|security|cyber/.test(activeFrameworkKey)
    ? 'NB2-SEC'
    : /migration|modernization|lakehouse|edw/.test(activeFrameworkKey)
    ? 'NB2-MIG'
    : /mlops|agentic|mcp/.test(activeFrameworkKey)
    ? 'NB2-MLO'
    : 'NB2-DAT';

  const currentXml = diagramsData?.currentStateXml || DEFAULT_CURRENT_XML;
  const transitionXml = diagramsData?.transitionStateXml || diagramsData?.currentStateXml || DEFAULT_CURRENT_XML;
  const targetXml = diagramsData?.targetStateXml || DEFAULT_TARGET_XML;
  const rawCurTitle = diagramsData?.currentTitle || `${customerName || 'Enterprise'} Baseline`;
  const rawTransTitle = diagramsData?.transitionTitle || `${activeFrameworkTitle} Modernization`;
  const rawTargTitle = diagramsData?.targetTitle || `${activeFrameworkTitle} Target Topology`;
  const currentTitle = rawCurTitle.includes(nb2CodePrefix) ? rawCurTitle : `${nb2CodePrefix}-C-01 • ${rawCurTitle}`;
  const currentSubtitle = diagramsData?.currentSubtitle || `Level ${currentScore} Developing`;
  const transitionTitle = rawTransTitle.includes(nb2CodePrefix) ? rawTransTitle : `${nb2CodePrefix}-T-02 • ${rawTransTitle}`;
  const transitionSubtitle = diagramsData?.transitionSubtitle || 'Phased Strangler Fig & Hybrid Cloud Cutover';
  const targetTitle = rawTargTitle.includes(nb2CodePrefix) ? rawTargTitle : `${nb2CodePrefix}-F-03 • ${rawTargTitle}`;
  const targetSubtitle = diagramsData?.targetSubtitle || `Level ${targetScore} Optimized • Nano Banana 2 Synthesized`;
  const modelUsed = diagramsData?.modelUsed || 'Nano Banana 2 (nano-banana-2 / gemini-3.1-flash-image-preview) + PromptCanvas 3-Stage Blueprints';

  const handleRegenerate = async () => {
    if (!instanceId) {
      toast.error('Instance ID required for Nano Banana 2 generation');
      return;
    }

    setIsGenerating(true);
    const toastId = toast.loading('Calling Nano Banana 2 (nano-banana-2 / gemini-3.1-flash-image-preview) to synthesize architecture diagrams...');

    try {
      const res = await dynamicAssessmentService.generateArchitectureDiagrams(instanceId, customPrompt);
      if (res.success && res.diagrams) {
        setDiagramsData(res.diagrams);
        persistDiagramsToBackend(res.diagrams);
        toast.success(`✨ Architecture diagrams regenerated with Nano Banana 2 (${res.diagrams.modelUsed || 'nano-banana-2'})!`, { id: toastId });
        setIsModalOpen(false);
        setCustomPrompt('');
      } else {
        throw new Error(res.error || 'Generation failed');
      }
    } catch (err) {
      console.error('Failed to generate diagrams with Nano Banana 2:', err);
      toast.error(err.message || 'Failed to generate architecture diagrams', { id: toastId });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectTemplate = (tpl) => {
    const xml = tpl.builder ? tpl.builder() : DEFAULT_TARGET_XML;
    const nextDiagrams = {
      ...diagramsData,
      targetTitle: tpl.title,
      targetSubtitle: tpl.subtitle,
      targetStateXml: xml,
      generatedAt: new Date().toISOString()
    };
    setDiagramsData(nextDiagrams);
    persistDiagramsToBackend(nextDiagrams);
    setIsTemplateModalOpen(false);
    toast.success(`Applied & saved "${tpl.name}" Nano Banana 2 blueprint!`, { icon: '🏛️' });
  };

  const handleCopyXml = async (xml) => {
    try {
      await navigator.clipboard.writeText(xml);
      toast.success('📋 Draw.io XML copied to clipboard!');
    } catch (e) {
      toast.error('Failed to copy XML');
    }
  };

  const handleCopyMermaid = async (isTarget) => {
    const mermaidCode = getMermaidDiagram(framework, isTarget);

    try {
      await navigator.clipboard.writeText(mermaidCode);
      toast.success(`📋 Copied ${isTarget ? 'Target State' : 'Current Baseline'} Mermaid syntax!`, { icon: '📊' });
    } catch (e) {
      toast.error('Failed to copy Mermaid syntax');
    }
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    setReviewerNotes(prev => [
      { id: Date.now(), text: noteText.trim(), timestamp: formatAuditTimestamp() },
      ...prev
    ]);
    setNoteText('');
    toast.success('📝 Reviewer note pinned to architecture diagram');
  };

  const handleDeleteNote = (noteId) => {
    setReviewerNotes(prev => prev.filter(n => n.id !== noteId));
    toast.success('🗑️ Reviewer note removed');
  };

  const handleExportDrawio = (xml, filename) => {
    try {
      const blob = new Blob([xml], { type: 'application/xml;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success(`Downloaded ${filename}!`);
    } catch (e) {
      console.error(e);
      toast.error('Failed to export Draw.io XML');
    }
  };

  // Framework & Customer-Grounded 5-Step Process Flow & Tier Breakdown Cards
  const { currentLayers, targetLayers, processFlowSteps } = React.useMemo(() => {
    const iconPool = [<FiRepeat />, <FiDatabase />, <FiCpu />, <FiBox />, <HiSparkles />, <FiShield />];
    const targetIconPool = [
      <FiRepeat color="#10b981" />,
      <FiShield color="#10b981" />,
      <FiZap color="#10b981" />,
      <FiCpu color="#10b981" />,
      <HiSparkles color="#10b981" />,
      <FiGrid color="#10b981" />
    ];

    if (Array.isArray(normalizedDimScores) && normalizedDimScores.length >= 3) {
      const dims = normalizedDimScores.slice(0, 6);
      const recs = Array.isArray(recommendations) ? recommendations : [];
      const humanize = (s) => String(s || '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

      const dynamicCurrentLayers = dims.map((d, idx) => {
        const cScore = Number(d.currentScore ?? d.score ?? currentScore).toFixed(1);
        const dimName = d.name || d.title || d.category || `Dimension ${idx + 1}`;
        const badItems = Array.isArray(d.theBad) && d.theBad.length > 0
          ? d.theBad.slice(0, 3).map(b => humanize(String(b).split('—')[0].trim()))
          : Array.isArray(d.painPoints) && d.painPoints.length > 0
          ? d.painPoints.slice(0, 3).map(humanize)
          : [
              `Current Maturity Baseline: ${cScore} / 5.0`,
              criticalConstraints[idx]?.constraint || `Siloed ${dimName.toLowerCase()} execution & manual handoffs`,
              `Target Gap: +${Math.max(0, Number(d.futureScore ?? d.targetScore ?? targetScore) - Number(cScore)).toFixed(1)} maturity leap required`
            ];
        return {
          name: /^\d+\./.test(dimName) ? dimName : `${idx + 1}. ${dimName}`,
          tag: `${cScore} / 5.0 Baseline`,
          icon: iconPool[idx % iconPool.length],
          items: badItems
        };
      });

      const dynamicTargetLayers = dims.map((d, idx) => {
        const cScore = Number(d.currentScore ?? d.score ?? currentScore).toFixed(1);
        const fScore = Number(d.futureScore ?? d.targetScore ?? targetScore).toFixed(1);
        const dimName = d.name || d.title || d.category || `Dimension ${idx + 1}`;
        const matchedRec = recs.find(r => {
          const rCat = String(r.category || r.dimension || r.area || '').toLowerCase();
          return rCat && dimName.toLowerCase().includes(rCat.split(/\s+/)[0]);
        }) || recs[idx] || {};
        const recActions = Array.isArray(matchedRec.actions) && matchedRec.actions.length > 0
          ? matchedRec.actions.slice(0, 2)
          : matchedRec.title
          ? [matchedRec.title]
          : [`Automated cloud-native ${dimName.toLowerCase()} architecture`];

        return {
          name: /^\d+\./.test(dimName) ? dimName : `${idx + 1}. ${dimName}`,
          tag: `Target ${fScore} / 5.0`,
          icon: targetIconPool[idx % targetIconPool.length],
          items: [
            ...recActions,
            `Maturity Progression: ${cScore}/5.0 → ${fScore}/5.0`,
            matchedRec.expectedImpact || `Eliminates ${dimName.toLowerCase()} operational bottlenecks`
          ].slice(0, 3)
        };
      });

      const dynamicFlowSteps = dims.slice(0, 5).map((d, idx) => {
        const cScore = Number(d.currentScore ?? d.score ?? currentScore).toFixed(1);
        const fScore = Number(d.futureScore ?? d.targetScore ?? targetScore).toFixed(1);
        const dimName = (d.name || d.title || `Stage ${idx + 1}`).replace(/^\d+\.\s*/, '');
        const matchedRec = recs[idx] || {};
        const topPain = (Array.isArray(d.theBad) && d.theBad[0])
          ? humanize(String(d.theBad[0]).split('—')[0].trim())
          : `${dimName} manual bottleneck (${cScore}/5.0)`;
        return {
          step: `STEP ${idx + 1}`,
          badge: `${cScore} → ${fScore}/5.0`,
          title: dimName,
          legacy: `As-Is (${cScore}/5.0): ${topPain}.`,
          target: matchedRec.title
            ? `To-Be (${fScore}/5.0): ${matchedRec.title}.`
            : `To-Be (${fScore}/5.0): Automated cloud-native ${dimName.toLowerCase()} & continuous governance.`
        };
      });

      return {
        currentLayers: dynamicCurrentLayers,
        targetLayers: dynamicTargetLayers,
        processFlowSteps: dynamicFlowSteps
      };
    }

    if (activeFrameworkKey.includes('finops')) {
      return {
        currentLayers: [
          { name: '1. Cost Visibility & Tagging', tag: 'Unallocated Spend', icon: <FiGrid />, items: ['40%+ untagged shared cloud resources', 'Monthly delayed CSV billing exports', 'No business-unit showback or chargeback'] },
          { name: '2. Compute & Cluster Sizing', tag: 'Idle Over-Provisioning', icon: <FiCpu />, items: ['Static 24/7 over-provisioned VM/GKE nodes', 'Lack of automated 15-min idle auto-suspend', 'Orphaned persistent disks and snapshots'] },
          { name: '3. Commitment Portfolio', tag: 'On-Demand Leakage', icon: <FiRepeat />, items: ['Low CUD/RI coverage (<35% baseline)', 'Siloed project-level commitments', 'Manual spreadsheet renewal tracking'] },
          { name: '4. Storage & Query Tiering', tag: 'Full-Table Scan Burn', icon: <FiDatabase />, items: ['Unpartitioned multi-TB analytical tables', 'Hot storage retention for cold archival data', 'Unbounded ad-hoc BI query slots'] },
          { name: '5. AI & LLM Token FinOps', tag: 'Uncached Token Burn', icon: <HiSparkles />, items: ['Frontier models invoked for trivial classification', 'Zero prompt context caching (100% input cost)', 'No per-tenant token quota circuit breakers'] },
          { name: '6. FinOps Governance & CoE', tag: 'Reactive Alerting', icon: <FiShield />, items: ['Post-mortem invoice shock at month-end', 'Disconnected engineering & finance workflows', 'No unit-cost KPIs (cost per transaction)'] }
        ],
        targetLayers: [
          { name: '1. Cost Visibility & Tagging', tag: '99% Automated Attribution', icon: <FiGrid color="#10b981" />, items: ['Policy-as-code mandatory FinOps label enforcement', 'Real-time BigQuery billing export & Looker FinOps hub', 'Automated chargeback per product & tenant'] },
          { name: '2. Compute & Cluster Sizing', tag: 'Elastic Serverless', icon: <FiZap color="#10b981" />, items: ['GKE Autopilot & Cloud Run scale-to-zero compute', 'Automated 15-minute idle cluster termination', 'Continuous rightsizing recommendations in CI/CD'] },
          { name: '3. Commitment Portfolio', tag: '80%+ CUD Optimization', icon: <FiRepeat color="#10b981" />, items: ['Centralized flexible Committed Use Discounts', 'Automated slot reservation autoscaling', '42% blended compute rate reduction'] },
          { name: '4. Storage & Query Tiering', tag: 'Partitioned & Autoclass', icon: <FiDatabase color="#10b981" />, items: ['GCS Autoclass lifecycle tiering (Standard → Archive)', 'Mandatory partition/cluster keys & BI Engine caching', 'Query cost guards and slot governance'] },
          { name: '5. AI & LLM Token FinOps', tag: '75% Cached Savings', icon: <HiSparkles color="#10b981" />, items: ['Semantic router: Gemini 3.8 Flash vs 3.1 Pro', 'Vertex AI Context Caching (75% input token discount)', 'Per-department token budgets & rate governors'] },
          { name: '6. FinOps Governance & CoE', tag: 'Autonomous Unit Economics', icon: <FiShield color="#10b981" />, items: ['Real-time ML spend anomaly detection & Slack alerts', 'Unit-economics telemetry tied to revenue', 'FinOps-certified engineering sprint gates'] }
        ],
        processFlowSteps: [
          { step: 'STEP 1', badge: '⚠️ Untagged Spend', title: 'Multi-Cloud Billing Ingress', legacy: 'Fragmented account bills, 40% untagged shared infrastructure, manual finance reconciliation.', target: 'Mandatory Terraform label policies + real-time BigQuery billing telemetry.' },
          { step: 'STEP 2', badge: '⚠️ Idle Compute', title: 'Workload Provisioning & Sizing', legacy: 'Static peak-sized VMs and clusters running 24/7 without auto-suspend.', target: 'Serverless scale-to-zero compute + automated rightsizing & CUD coverage.' },
          { step: 'STEP 3', badge: '⚠️ Scan Spikes', title: 'Analytical Query & Storage Execution', legacy: 'Unbounded full-table scans and hot storage retention on historical datasets.', target: 'Partitioned Iceberg/BigQuery tables + BI Engine caching & slot autoscaling.' },
          { step: 'STEP 4', badge: '⚠️ Token Burn', title: 'GenAI Inference & Prompt Routing', legacy: '100% uncached frontier LLM calls for routine tasks without quota circuit breakers.', target: 'Gemini 3.8 Flash tiered routing + Vertex AI Context Caching (75% savings).' },
          { step: 'STEP 5', badge: '⚠️ Invoice Shock', title: 'Unit Economics & Anomaly Governance', legacy: 'End-of-month budget overruns discovered weeks after deployment.', target: 'Real-time autonomous anomaly alerts + per-product unit cost dashboards.' }
        ]
      };
    }

    if (activeFrameworkKey.includes('zero_trust') || activeFrameworkKey.includes('security')) {
      return {
        currentLayers: [
          { name: '1. Identity & Access Perimeter', tag: 'Over-Privileged IAM', icon: <FiShield />, items: ['Broad static IAM roles and long-lived service keys', 'Lack of context-aware device posture checks', 'Manual quarterly access reviews'] },
          { name: '2. Network & Micro-Segmentation', tag: 'Flat VPC Trust', icon: <FiRepeat />, items: ['Implicit lateral network trust across subnets', 'Publicly reachable endpoints without VPC-SC', 'Uninspected east-west service traffic'] },
          { name: '3. Data Protection & Cryptography', tag: 'Default Encryption Only', icon: <FiDatabase />, items: ['Provider-managed keys without CMEK rotation', 'Unmasked PII in non-production environments', 'Lack of Confidential Computing enclave isolation'] },
          { name: '4. AI & LLM Security Guardrails', tag: 'Prompt Injection Exposure', icon: <HiSparkles />, items: ['Direct unguarded LLM prompts without sanitization', 'No automated PII redaction in RAG context', 'Shadow AI tool usage outside security visibility'] },
          { name: '5. Workload & Supply Chain Security', tag: 'Unverified Artifacts', icon: <FiBox />, items: ['Unsigned container images in deployment pipelines', 'Delayed CVE patching across base images', 'Manual policy checks prior to release'] },
          { name: '6. SecOps & Threat Telemetry', tag: 'Alert Fatigue', icon: <FiCpu />, items: ['Siloed SIEM logs with high false-positive rates', 'Manual incident triage and runbooks', 'Delayed mean-time-to-contain (MTTC)'] }
        ],
        targetLayers: [
          { name: '1. Identity & Access Perimeter', tag: 'Zero-Standing Privilege', icon: <FiShield color="#10b981" />, items: ['BeyondCorp Enterprise context-aware access', 'Workload Identity Federation (zero static keys)', 'Just-in-Time (JIT) privileged elevation'] },
          { name: '2. Network & Micro-Segmentation', tag: 'Cryptographic VPC-SC', icon: <FiRepeat color="#10b981" />, items: ['VPC Service Controls cryptographic data perimeters', 'mTLS Istio/Cloud Service Mesh zero-trust routing', 'Cloud Armor WAF & DDoS edge enforcement'] },
          { name: '3. Data Protection & Cryptography', tag: 'CMEK & Confidential Compute', icon: <FiDatabase color="#10b981" />, items: ['Hardware HSM Customer-Managed Encryption Keys', 'Confidential VMs / GKE enclaves for sensitive AI', 'Automated Cloud DLP tokenization & masking'] },
          { name: '4. AI & LLM Security Guardrails', tag: 'Model Armor Enforced', icon: <HiSparkles color="#10b981" />, items: ['Google Cloud Model Armor inline prompt/response shield', 'Fine-grained RAG ACL enforcement per user identity', 'Immutable audit logging of all agent tool calls'] },
          { name: '5. Workload & Supply Chain Security', tag: 'SLSA Level 3 Attested', icon: <FiBox color="#10b981" />, items: ['Binary Authorization cryptographic image signing', 'Continuous Artifact Analysis & automated patching', 'Policy-as-code admission controllers'] },
          { name: '6. SecOps & Threat Telemetry', tag: 'Autonomous SOAR', icon: <FiZap color="#10b981" />, items: ['Chronicle Security Operations unified telemetry', 'AI-assisted threat hunting & automated containment', 'Continuous compliance posture drift remediation'] }
        ],
        processFlowSteps: [
          { step: 'STEP 1', badge: '⚠️ Static Keys', title: 'Identity & Device Ingress', legacy: 'Long-lived service account JSON keys and broad IAM roles without device posture checks.', target: 'BeyondCorp Context-Aware Access + Workload Identity Federation.' },
          { step: 'STEP 2', badge: '⚠️ Lateral Movement', title: 'Network & Service Perimeter', legacy: 'Flat VPC networks allowing lateral movement and exfiltration to external buckets.', target: 'VPC Service Controls (VPC-SC) dry-run & enforced perimeters + mTLS mesh.' },
          { step: 'STEP 3', badge: '⚠️ Prompt Injection', title: 'AI & RAG Security Gateway', legacy: 'Direct unguarded prompt inputs exposing sensitive retrieval context and jailbreaks.', target: 'Google Cloud Model Armor inline prompt/response filtering + Cloud DLP.' },
          { step: 'STEP 4', badge: '⚠️ Key Exposure', title: 'Data & Compute Confidentiality', legacy: 'Standard memory execution and unmasked PII across analytics and training datasets.', target: 'Confidential Computing RAM encryption + HSM-backed CMEK key rotation.' },
          { step: 'STEP 5', badge: '⚠️ Slow Triage', title: 'Threat Detection & Response', legacy: 'Fragmented audit logs and manual SOC playbooks delaying containment.', target: 'Unified Chronicle SecOps telemetry + automated SOAR quarantine playbooks.' }
        ]
      };
    }

    if (activeFrameworkKey.includes('migration')) {
      return {
        currentLayers: [
          { name: '1. Portfolio Discovery & 6R', tag: 'Spreadsheet Inventory', icon: <FiGrid />, items: ['Incomplete CMDB dependency mapping', 'Unclear 6R disposition (Rehost vs Refactor)', 'Unquantified legacy licensing technical debt'] },
          { name: '2. Cloud Landing Zone & IaC', tag: 'Manual Console ClickOps', icon: <FiShield />, items: ['Ad-hoc environment provisioning', 'Inconsistent network hub-and-spoke topology', 'Manual firewall and IAM ticket queues'] },
          { name: '3. Application Modernization', tag: 'Tightly Coupled Monoliths', icon: <FiBox />, items: ['Monolithic VM release cycles (quarterly)', 'Stateful session coupling blocking autoscaling', 'Brittle point-to-point SOAP/RPC integrations'] },
          { name: '4. Database & EDW Migration', tag: 'Batch Dump Downtime', icon: <FiDatabase />, items: ['Proprietary stored-procedure lock-in', 'High-downtime cutover windows', 'Manual schema translation errors'] },
          { name: '5. CI/CD & Release Factory', tag: 'Manual Cutover Waves', icon: <FiRepeat />, items: ['Manual regression testing bottlenecks', 'Lack of blue/green or canary traffic shifting', 'Slow rollback procedures during cutover'] },
          { name: '6. Cloud Operations & SRE', tag: 'Reactive Pager Load', icon: <FiCpu />, items: ['Siloed infrastructure monitoring', 'Undefined SLOs and error budgets', 'Single-region disaster recovery gaps'] }
        ],
        targetLayers: [
          { name: '1. Portfolio Discovery & 6R', tag: 'Automated Dependency Graph', icon: <FiGrid color="#10b981" />, items: ['Automated runtime dependency & TCO discovery', 'Data-driven 6R wave sequencing blueprint', 'Validated business case & license retirement plan'] },
          { name: '2. Cloud Landing Zone & IaC', tag: 'Modular Terraform Factory', icon: <FiShield color="#10b981" />, items: ['GitOps Terraform landing zone with policy guardrails', 'Shared VPC hub-and-spoke with automated DNS/IAM', 'Zero-trust security baseline pre-baked'] },
          { name: '3. Application Modernization', tag: 'Cloud-Native Microservices', icon: <FiBox color="#10b981" />, items: ['Strangler-Fig API facade for incremental decoupling', 'GKE / Cloud Run containerized microservices', 'Event-driven Pub/Sub & Apigee API mediation'] },
          { name: '4. Database & EDW Migration', tag: 'Zero-Downtime CDC Replication', icon: <FiDatabase color="#10b981" />, items: ['Datastream continuous CDC replication', 'AI-assisted SQL & stored procedure transpilation', 'Automated dual-read/dual-write data validation'] },
          { name: '5. CI/CD & Release Factory', tag: 'Automated Migration Factory', icon: <FiRepeat color="#10b981" />, items: ['Automated golden-image & container build pipelines', 'Progressive canary traffic shifting & instant rollback', 'Automated synthetic parity verification'] },
          { name: '6. Cloud Operations & SRE', tag: 'Multi-Region Resilience', icon: <FiZap color="#10b981" />, items: ['Full-stack OpenTelemetry & SLO error budgets', 'Automated chaos testing & active-active DR', 'FinOps-governed autoscaling from Day 1'] }
        ],
        processFlowSteps: [
          { step: 'STEP 1', badge: '⚠️ Blind Spots', title: 'Discovery & 6R Wave Planning', legacy: 'Static spreadsheets missing hidden database and RPC dependencies across monoliths.', target: 'Automated runtime dependency graphing + prioritized 6R migration wave factory.' },
          { step: 'STEP 2', badge: '⚠️ ClickOps Drift', title: 'Landing Zone Provisioning', legacy: 'Manual environment setup causing configuration drift and security bottlenecks.', target: 'Declarative Terraform Landing Zone with automated IAM, VPC, and policy guards.' },
          { step: 'STEP 3', badge: '⚠️ Cutover Risk', title: 'Strangler-Fig Application Bridge', legacy: 'Big-bang monolith rewrites with high regression risk and extended feature freezes.', target: 'Apigee Strangler-Fig routing facade enabling zero-downtime incremental cutover.' },
          { step: 'STEP 4', badge: '⚠️ Data Outage', title: 'Continuous CDC Data Sync', legacy: 'Offline weekend database dumps causing business downtime and reconciliation drift.', target: 'Datastream Zero-ETL CDC replication with automated row-level parity verification.' },
          { step: 'STEP 5', badge: '⚠️ DR Gaps', title: 'Cloud-Native SRE & Autoscaling', legacy: 'Manual failover runbooks and static post-migration VM sizing.', target: 'Multi-region active-active resiliency + SLO-driven autoscaling and observability.' }
        ]
      };
    }

    return {
      currentLayers: [
        {
          name: '1. Ingestion & Connectors',
          tag: 'Brittle & High Latency',
          icon: <FiRepeat />,
          items: ['Cron-based Python/Bash batch scripts', 'Fragmented SFTP & point-to-point APIs', 'No unified dead-letter queues or CDC']
        },
        {
          name: '2. Storage & Governance',
          tag: 'Data Silos & IAM Drift',
          icon: <FiDatabase />,
          items: ['Separate Data Lakes + Relational Warehouses', 'Inconsistent ACLs across cloud buckets', 'Manual metadata spreadsheets & no lineage']
        },
        {
          name: '3. Processing & Compute',
          tag: 'Runaway Cluster Spend',
          icon: <FiCpu />,
          items: ['Static over-provisioned Spark/VM compute', 'Lack of auto-termination / FinOps policies', 'Duplicate ETL pipeline transformations']
        },
        {
          name: '4. AI & Machine Learning',
          tag: 'Disconnected MLOps',
          icon: <FiBox />,
          items: ['Ad-hoc local Jupyter notebooks', 'Manual model deployment scripts', 'No automated drift monitoring / feature store']
        },
        {
          name: '5. Generative AI & LLMs',
          tag: 'Unguarded & Expensive',
          icon: <HiSparkles />,
          items: ['Unguarded external API endpoints', 'Redundant full-prompt token spend', 'No enterprise PII filters or CMEK encryption']
        },
        {
          name: '6. BI & Analytics Serving',
          tag: 'Heavy Analyst Backlog',
          icon: <FiGrid />,
          items: ['Stale nightly data warehouse extracts', '14-day turnaround on custom metrics', 'No shared semantic metric layer']
        }
      ],
      targetLayers: [
        {
          name: '1. Ingestion & Connectors',
          tag: 'Real-Time & Declarative',
          icon: <FiRepeat color="#10b981" />,
          items: ['Declarative Streaming Pipelines (Kafka/PubSub)', 'Automated Schema Evolution & Real-Time CDC', 'Serverless Auto-Loader for Cloud Storage & Event Buses']
        },
        {
          name: '2. Storage & Governance',
          tag: 'Unified Open Lakehouse',
          icon: <FiShield color="#10b981" />,
          items: ['Open Table Formats (Apache Iceberg / Delta)', 'Centralized Metadata Catalog with Column/Row Masking', 'Automated End-to-End Lineage & Audit Trails']
        },
        {
          name: '3. Processing & Compute',
          tag: 'Serverless FinOps Engine',
          icon: <FiZap color="#10b981" />,
          items: ['Serverless Vectorized SQL Compute Engine', 'Instant auto-suspend cluster kill-switches', 'Zero-copy sharing across cloud accounts']
        },
        {
          name: '4. AI & Machine Learning',
          tag: 'Continuous Production MLOps',
          icon: <FiCpu color="#10b981" />,
          items: ['Centralized Model & Prompt Registry', 'Automated CI/CD deployment pipelines', 'Real-time data quality & concept drift alerts']
        },
        {
          name: '5. Generative AI & Agents',
          tag: 'Guarded Compound AI Mesh',
          icon: <HiSparkles color="#10b981" />,
          items: ['Autonomous Multi-Agent Orchestration (MCP)', 'Prompt Context Caching (75% token discount)', 'Zero-Trust AI Guardrails & CMEK isolation']
        },
        {
          name: '6. BI & Analytics Serving',
          tag: 'Self-Service Semantic Layer',
          icon: <FiGrid color="#10b981" />,
          items: ['Direct Lakehouse Zero-Copy Queries', 'Unified Semantic Metric Layer for BI tools', 'Sub-second real-time dashboards']
        }
      ],
      processFlowSteps: [
        { step: 'STEP 1', badge: '⚠️ PII & Silos', title: 'Client Ingress & Data Capture', legacy: 'Isolated batch scripts, fragmented connectors, and unmonitored schema drift.', target: 'Cloud Run / PubSub streaming ingress with Apigee Gateway & VPC-SC perimeter.' },
        { step: 'STEP 2', badge: '⚠️ High Latency', title: 'Lakehouse Governance & Storage', legacy: 'Disconnected warehouse copies, inconsistent bucket ACLs, and manual lineage.', target: 'BigLake Apache Iceberg open lakehouse + Dataplex unified governance catalog.' },
        { step: 'STEP 3', badge: '⚠️ Model Drift', title: 'MLOps & Agentic Tool Execution', legacy: 'Notebook silos, manual model deployments, and unsandboxed agent tool calls.', target: 'Vertex AI Feature Store + standardized Model Context Protocol (MCP) & Model Armor.' },
        { step: 'STEP 4', badge: '⚠️ Token Cost', title: 'Vector Grounding & Context Caching', legacy: 'Arbitrary chunking, high hallucination rates, and 100% uncached token spend.', target: 'Google Omni 1.1 / Gemini 3.1 Pro + Context Caching (75% discount) & zero-copy RAG.' },
        { step: 'STEP 5', badge: '⚠️ Audit Gaps', title: 'Enterprise Serving & Observability', legacy: 'Stale BI extracts, unmonitored AI outputs, and absent compliance audit trails.', target: 'Sub-second semantic BI serving, immutable BigQuery audit logs, and FinOps guardrails.' }
      ]
    };
  }, [activeFrameworkKey, normalizedDimScores, recommendations, criticalConstraints, currentScore, targetScore]);

  return (
    <DiagramContainer
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <Header>
        <TitleBlock>
          <div className="icon">
            <FiLayers />
          </div>
          <div>
            <Title>
              Unified 3-Zone Architecture Blueprint: Current State → Transformation Bridge → Future State
              <GeminiBadge>
                <SiGooglecloud /> NANO BANANA 2 (NANO-BANANA-2 • GEMINI-3.1-FLASH-IMAGE-PREVIEW)
              </GeminiBadge>
            </Title>
            <Subtitle>
              End-to-end 3-zone visual architecture roadmap synthesized by <strong>Nano Banana 2</strong> (<code>nano-banana-2</code> / <code>gemini-3.1-flash-image-preview</code>) &amp; PromptCanvas for <strong>{activeFrameworkTitle}</strong>: Zone 1 Current State (As-Is), Zone 2 Phased Transformation Bridge, and Zone 3 Desired Future State (To-Be) in one unified canvas.
            </Subtitle>
          </div>
        </TitleBlock>

        <ActionGroup>
          <ViewToggle>
            <ViewBtn 
              $active={viewMode !== 'cards'} 
              onClick={() => setViewMode('blueprint')}
            >
              <FiEye /> 🗺️ Unified 3-Zone Architecture Diagram
            </ViewBtn>
            <ViewBtn 
              $active={viewMode === 'cards'} 
              onClick={() => setViewMode('cards')}
            >
              <FiLayers /> 📑 Tier Breakdown Cards
            </ViewBtn>
          </ViewToggle>

          <button
            onClick={() => setIsTemplateModalOpen(true)}
            style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(168, 85, 247, 0.15))', border: '1px solid rgba(139, 92, 246, 0.4)', color: '#4f46e5', padding: '7px 14px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s ease' }}
            title="Choose from ScoreX curated enterprise reference blueprints"
          >
            🎨 Reference Blueprints
          </button>

          <button
            onClick={() => handleCopyXml(targetXml)}
            style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#334155', padding: '7px 12px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
            title="Copy raw Draw.io XML to clipboard"
          >
            📋 Copy XML
          </button>

          <button
            onClick={() => handleCopyMermaid(true)}
            style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#334155', padding: '7px 12px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
            title="Copy Mermaid diagram syntax to clipboard"
          >
            📋 Copy Mermaid
          </button>

          <button
            onClick={() => setShowNotesDrawer(!showNotesDrawer)}
            style={{ background: reviewerNotes.length > 0 ? 'rgba(16, 185, 129, 0.15)' : '#f8fafc', border: `1px solid ${reviewerNotes.length > 0 ? 'rgba(16, 185, 129, 0.4)' : '#cbd5e1'}`, color: reviewerNotes.length > 0 ? '#059669' : '#334155', padding: '7px 12px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
            title="Add workshop review notes & architecture risks"
          >
            📝 Notes ({reviewerNotes.length})
          </button>

          <RegenerateBtn 
            onClick={() => setIsModalOpen(true)}
            disabled={isGenerating}
            title="Generate bespoke architecture diagram using PromptCanvas AI"
          >
            <FiRefreshCw className={isGenerating ? 'spin' : ''} /> 
            {isGenerating ? 'Synthesizing...' : '⚡ Regenerate with PromptCanvas AI'}
          </RegenerateBtn>

          <button
            onClick={() => handleOpenVisualDrawio('target')}
            style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', border: 'none', color: '#ffffff', padding: '7px 14px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', boxShadow: '0 2px 8px rgba(2, 132, 199, 0.3)' }}
            title="Open full-featured interactive Draw.io visual canvas inside ScoreX"
          >
            🎨 Visual Draw.io Editor
          </button>

          <button
            onClick={() => handleOpenXmlEditor('target')}
            style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#334155', padding: '7px 12px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
            title="Edit or paste raw Draw.io XML code directly into the diagram canvas"
          >
            ✏️ Edit XML / Tweak
          </button>

          <ExportBtn 
            onClick={() => handleExportDrawio(targetXml, 'ScoreX_Unified_3Zone_Architecture_Blueprint.drawio')}
            title="Download architecture diagram for Draw.io / diagrams.net"
          >
            <FiDownload /> 📥 Export Draw.io XML
          </ExportBtn>
        </ActionGroup>
      </Header>

      {/* Workshop Reviewer Notes Drawer */}
      {showNotesDrawer && (
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px 20px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h4 style={{ margin: 0, fontSize: '0.92rem', color: '#1e293b', fontWeight: 700 }}>
              📝 Workshop Reviewer Notes & Architecture Risks ({reviewerNotes.length})
            </h4>
            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Live steering session notes</span>
          </div>

          {reviewerNotes.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
              {reviewerNotes.map(n => (
                <div key={n.id} style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '8px 12px', fontSize: '0.84rem', color: '#334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>💬 {n.text}</span>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{n.timestamp}</span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '0 0 10px 0' }}>
              No notes added yet. Record live steering feedback, architectural tradeoffs, or identified risks below.
            </p>
          )}

          <form onSubmit={handleAddNote} style={{ display: 'flex', gap: '8px' }}>
            <input 
              type="text" 
              placeholder="Add an architecture note or risk flag (e.g. 'Security team requires mTLS on ingestion')..."
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.84rem', outline: 'none' }}
            />
            <button 
              type="submit"
              style={{ background: '#4f46e5', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '0.84rem', fontWeight: 700, cursor: 'pointer' }}
            >
              Add Note
            </button>
          </form>
        </div>
      )}

      {/* 4-PILLAR CUSTOMER GROUNDING VERIFICATION STRIP */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '10px',
        marginBottom: '14px',
        background: '#ffffff',
        border: '1px solid #cbd5e1',
        borderRadius: '12px',
        padding: '12px 14px',
        boxShadow: '0 2px 6px rgba(15, 23, 42, 0.04)'
      }}>
        <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '8px', padding: '8px 11px' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#9f1239', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            1️⃣ Current State Grounded ({Number(currentScore || 2.5).toFixed(1)}/5.0)
          </div>
          <div style={{ fontSize: '0.78rem', color: '#1e293b', marginTop: '3px', lineHeight: 1.35 }}>
            <strong>{customerName}</strong> • {normalizedDimScores.length || 6} evaluated pillars &amp; detected baseline stack mapped to Zone 1 cards.
          </div>
        </div>
        <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '8px 11px' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            2️⃣ Customer Pain Points &amp; Notes
          </div>
          <div style={{ fontSize: '0.78rem', color: '#1e293b', marginTop: '3px', lineHeight: 1.35 }}>
            {criticalConstraints.length > 0
              ? criticalConstraints.slice(0, 2).join(' • ')
              : 'Low-scored bottleneck questions, technical/business pain codes & verbatim assessor notes.'}
          </div>
        </div>
        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '8px 11px' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#1e40af', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            3️⃣ Phased Transition Bridge ({((Number(currentScore || 2.5) + Number(targetScore || 4.5)) / 2).toFixed(1)}/5.0)
          </div>
          <div style={{ fontSize: '0.78rem', color: '#1e293b', marginTop: '3px', lineHeight: 1.35 }}>
            6-swimlane Strangler-Fig coexistence bridge ordered by maturity gap (Priority #1 → #6, Waves 1–3).
          </div>
        </div>
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '8px 11px' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#166534', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            4️⃣ Desired Future State &amp; Recommendations ({Number(targetScore || 4.5).toFixed(1)}/5.0)
          </div>
          <div style={{ fontSize: '0.78rem', color: '#1e293b', marginTop: '3px', lineHeight: 1.35 }}>
            {recommendations.length > 0
              ? `Realizes ${recommendations.length} prioritized recommendations: ${recommendations[0]?.title || 'Cloud-Native Target'}`
              : `+${(Number(targetScore || 4.5) - Number(currentScore || 2.5)).toFixed(1)} maturity leap • 100% pain points remediated.`}
          </div>
        </div>
      </div>

      {/* UNIFIED 3-ZONE ARCHITECTURE DIAGRAM VIEWPORT */}
      {viewMode !== 'cards' && (
        <div style={{ marginBottom: '20px' }}>
          <DiagramErrorBoundary onAutoHeal={handleRegenerate}>
            <DiagramViewer
              xml={targetXml || transitionXml || currentXml}
              title={targetTitle}
              subtitle={targetSubtitle}
              badge="Unified 3-Zone Blueprint (As-Is → Bridge → To-Be)"
              theme={diagramTheme}
              height="740px"
              isTarget={true}
              isTransition={false}
            />
          </DiagramErrorBoundary>
        </div>
      )}

      {/* 4. VISUAL PROCESS FLOW & PAIN POINT ARCHITECTURE MATRIX */}
      {viewMode !== 'cards' && (
        <div style={{
          marginTop: '20px',
          marginBottom: '24px',
          background: '#FFFFFF',
          borderRadius: '14px',
          border: '1.5px solid #E2E8F0',
          padding: '22px 26px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '18px' }}>
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ color: '#DC2626' }}>🚨</span> End-to-End Process Flow &amp; Architectural Friction Sequence
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  background: '#FEF3C7',
                  color: '#92400E',
                  border: '1px solid #FDE68A',
                  padding: '2px 8px',
                  borderRadius: '999px'
                }}>
                  🍌 Nano Banana 2 • gemini-3.1-flash-image-preview
                </span>
              </div>
              <div style={{ fontSize: '0.82rem', color: '#64748B', marginTop: '3px' }}>
                Correlated 5-step domain-verified operational pipeline comparing legacy failure modes against Google Cloud target modernization
              </div>
            </div>
            <div style={{
              background: '#FEE2E2',
              border: '1px solid #FCA5A5',
              borderRadius: '20px',
              padding: '4px 14px',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#991B1B'
            }}>
              {processFlowSteps.length} Critical Bottlenecks Mapped
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            {processFlowSteps.map((stepObj, idx) => (
              <div key={idx} style={{ background: '#F8FAFC', borderRadius: '10px', border: '1.5px solid #E2E8F0', padding: '16px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748B' }}>{stepObj.step}</span>
                  <span style={{
                    background: stepObj.badgeBg || '#FEE2E2',
                    border: `1px solid ${stepObj.badgeBorder || '#EF4444'}`,
                    color: stepObj.badgeColor || '#991B1B',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '10px'
                  }}>{stepObj.badge}</span>
                </div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>{stepObj.title}</div>
                <div style={{ fontSize: '0.78rem', color: '#B91C1C', marginBottom: '8px', lineHeight: '1.35' }}>
                  <b>Legacy Friction:</b> {stepObj.friction || stepObj.legacy}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#15803D', lineHeight: '1.35' }}>
                  <b>Target Solution:</b> {stepObj.target}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. TIER BREAKDOWN CARDS */}
      {viewMode === 'cards' && (
        <ComparisonGrid>
          {/* CURRENT STATE CARDS */}
          <ArchColumn $isTarget={false}>
            <ColHeader $isTarget={false}>
              <div className="title-group">
                <FiAlertTriangle /> Current State Architecture
              </div>
              <div className="badge">
                Maturity Index: Level {currentScore} (Developing)
              </div>
            </ColHeader>

            <LayerStack>
              {currentLayers.map((layer, idx) => (
                <LayerCard key={idx} $isTarget={false}>
                  <div className="layer-top">
                    <div className="layer-name">
                      {layer.icon} {layer.name}
                    </div>
                    <div className="layer-tag">{layer.tag}</div>
                  </div>
                  <div className="layer-items">
                    {layer.items.map((item, itemIdx) => (
                      <div className="item-pill" key={itemIdx}>
                        • {item}
                      </div>
                    ))}
                  </div>
                </LayerCard>
              ))}
            </LayerStack>
          </ArchColumn>

          {/* TARGET STATE CARDS */}
          <ArchColumn $isTarget={true}>
            <ColHeader $isTarget={true}>
              <div className="title-group">
                <FiCheckCircle /> Desired Future State Architecture
              </div>
              <div className="badge">
                Target Index: Level {targetScore} (Optimized)
              </div>
            </ColHeader>

            <LayerStack>
              {targetLayers.map((layer, idx) => (
                <LayerCard key={idx} $isTarget={true}>
                  <div className="layer-top">
                    <div className="layer-name">
                      {layer.icon} {layer.name}
                    </div>
                    <div className="layer-tag">{layer.tag}</div>
                  </div>
                  <div className="layer-items">
                    {layer.items.map((item, itemIdx) => (
                      <div className="item-pill" key={itemIdx}>
                        ✓ {item}
                      </div>
                    ))}
                  </div>
                </LayerCard>
              ))}
            </LayerStack>
          </ArchColumn>
        </ComparisonGrid>
      )}

      {/* Strategic Value Summary Banner */}
      <StrategicBenefitsFooter>
        <div className="callout">
          <HiSparkles size={20} />
          <span>
            {(diagramsData?.transformations || diagramsData?.keyTransformations)
              ? `Prioritized 3-Stage Architectural Transformations (${customerName}):`
              : 'Core Strategic Transformations Unlocked by Desired Future State Architecture:'}
          </span>
        </div>
        <div className="badges">
          {(diagramsData?.transformations || diagramsData?.keyTransformations) ? (
            (diagramsData.transformations || diagramsData.keyTransformations).map((t, idx) => (
              <div className="benefit-badge" key={idx}>⚡ {t}</div>
            ))
          ) : (
            <>
              <div className="benefit-badge">🔒 Unified Open Lakehouse Governance</div>
              <div className="benefit-badge">⚡ Declarative Streaming CDC Pipelines</div>
              <div className="benefit-badge">🤖 Guarded Autonomous Agent Mesh</div>
              <div className="benefit-badge">💰 75% GenAI Prompt Context Caching</div>
            </>
          )}
        </div>
      </StrategicBenefitsFooter>

      {/* NANO BANANA 2 REGENERATE PROMPT MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isGenerating && setIsModalOpen(false)}
          >
            <ModalCard
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <ModalHeader>
                <h3>
                  <HiSparkles color="#6366f1" /> 
                  Generate Custom 3-Stage Architecture with Nano Banana 2
                </h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                >
                  <FiX size={20} />
                </button>
              </ModalHeader>

              <p style={{ fontSize: '0.84rem', color: '#64748b', margin: '0 0 12px 0' }}>
                Specify any custom technology stack, cloud provider, or domain requirements. Nano Banana 2 (gemini-3.1-flash-image-preview) will synthesize complete, tailored Draw.io XML models across Current State, Transition Bridge, and Desired Future State.
              </p>

              <PromptChips>
                <PromptChip onClick={() => setCustomPrompt('Focus on Google Cloud Vertex AI, Dataproc Serverless, and BigQuery Lakehouse.')}>
                  ☁️ GCP Vertex AI & BigQuery
                </PromptChip>
                <PromptChip onClick={() => setCustomPrompt('Emphasize Snowflake, dbt Data Mesh, and Fivetran CDC pipelines.')}>
                  ❄️ Snowflake & dbt Mesh
                </PromptChip>
                <PromptChip onClick={() => setCustomPrompt('Focus on Open Lakehouse with Apache Iceberg, Apache Polaris catalog, and Spark streaming CI/CD.')}>
                  🧱 Open Lakehouse (Iceberg & Polaris)
                </PromptChip>
                <PromptChip onClick={() => setCustomPrompt('Highlight Kubernetes (EKS/GKE) OpenCost FinOps and Spark auto-termination.')}>
                  🚀 Cloud FinOps & Kubernetes
                </PromptChip>
                <PromptChip onClick={() => setCustomPrompt('Emphasize Model Context Protocol (MCP) Multi-Agent Mesh and 75% Prompt Context Caching.')}>
                  🤖 MCP Autonomous Agents
                </PromptChip>
              </PromptChips>

              <PromptTextarea
                placeholder="e.g. Focus on AWS EKS / GCP GKE with Open Lakehouse and Vertex AI Agentic Mesh, addressing our 24-hour batch latency and unmanaged cluster idle spend..."
                value={customPrompt}
                onChange={e => setCustomPrompt(e.target.value)}
              />

              <ModalFooter>
                <SecondaryBtn onClick={() => setIsModalOpen(false)} disabled={isGenerating}>
                  Cancel
                </SecondaryBtn>
                <PrimaryBtn onClick={handleRegenerate} disabled={isGenerating}>
                  {isGenerating ? (
                    <>
                      <FiRefreshCw className="spin" /> Generating 3-Stage Draw.io XML with Nano Banana 2...
                    </>
                  ) : (
                    <>
                      <FiSend /> Generate Architecture Diagrams
                    </>
                  )}
                </PrimaryBtn>
              </ModalFooter>
            </ModalCard>
          </ModalOverlay>
        )}

        {/* REFERENCE BLUEPRINTS SELECTOR MODAL */}
        {isTemplateModalOpen && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsTemplateModalOpen(false)}
          >
            <ModalCard
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              style={{ maxWidth: '750px' }}
            >
              <ModalHeader>
                <h3>
                  🎨 ScoreX Curated Enterprise Architecture Blueprints
                </h3>
                <button 
                  onClick={() => setIsTemplateModalOpen(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                >
                  <FiX size={20} />
                </button>
              </ModalHeader>

              <p style={{ fontSize: '0.84rem', color: '#64748b', margin: '0 0 16px 0' }}>
                Select a pristine enterprise reference architecture to apply directly to this assessment readout.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', maxHeight: '420px', overflowY: 'auto', paddingRight: '4px' }}>
                {REFERENCE_BLUEPRINTS.map(tpl => (
                  <div
                    key={tpl.id}
                    onClick={() => handleSelectTemplate(tpl)}
                    style={{
                      background: '#f8fafc',
                      border: '1.5px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '14px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = '#6366f1';
                      e.currentTarget.style.background = '#eef2ff';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.background = '#f8fafc';
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 800, background: 'rgba(99, 102, 241, 0.15)', color: '#4f46e5', padding: '2px 8px', borderRadius: '4px' }}>
                          {tpl.badge}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>
                          {tpl.tier}
                        </span>
                      </div>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '0.94rem', color: '#1e293b', fontWeight: 700 }}>
                        {tpl.name}
                      </h4>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', lineHeight: 1.4 }}>
                        {tpl.description}
                      </p>
                    </div>
                    <div style={{ marginTop: '10px', fontSize: '0.78rem', fontWeight: 700, color: '#4f46e5', textAlign: 'right' }}>
                      Apply Blueprint ➔
                    </div>
                  </div>
                ))}
              </div>
            </ModalCard>
          </ModalOverlay>
        )}

        {/* ✏️ Direct Manual XML & Visual Editor Modal */}
        {isXmlEditorOpen && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsXmlEditorOpen(false)}
          >
            <ModalCard
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              style={{ maxWidth: '820px', width: '92vw' }}
            >
              <ModalHeader>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.25rem' }}>✏️</span>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a', fontWeight: 800 }}>
                      Manual Diagram XML Editor
                    </h3>
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      Editing {xmlTargetState === 'current' ? '1. Current Baseline Architecture' : xmlTargetState === 'transition' ? '2. Transition Bridge Architecture' : '3. Desired Future State Architecture'}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => setIsXmlEditorOpen(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                >
                  <FiX size={20} />
                </button>
              </ModalHeader>

              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => {
                    setXmlTargetState('current');
                    setRawXmlDraft(diagramsData?.currentStateXml || currentXml);
                  }}
                  style={{
                    background: xmlTargetState === 'current' ? '#eef2ff' : '#f8fafc',
                    color: xmlTargetState === 'current' ? '#4f46e5' : '#475569',
                    border: `1.5px solid ${xmlTargetState === 'current' ? '#6366f1' : '#cbd5e1'}`,
                    borderRadius: '8px',
                    padding: '6px 12px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  1. Current State XML
                </button>
                <button
                  onClick={() => {
                    setXmlTargetState('transition');
                    setRawXmlDraft(diagramsData?.transitionStateXml || transitionXml);
                  }}
                  style={{
                    background: xmlTargetState === 'transition' ? '#fffbeb' : '#f8fafc',
                    color: xmlTargetState === 'transition' ? '#b45309' : '#475569',
                    border: `1.5px solid ${xmlTargetState === 'transition' ? '#f59e0b' : '#cbd5e1'}`,
                    borderRadius: '8px',
                    padding: '6px 12px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  2. Transition Bridge XML
                </button>
                <button
                  onClick={() => {
                    setXmlTargetState('target');
                    setRawXmlDraft(diagramsData?.targetStateXml || targetXml);
                  }}
                  style={{
                    background: xmlTargetState === 'target' ? '#eef2ff' : '#f8fafc',
                    color: xmlTargetState === 'target' ? '#4f46e5' : '#475569',
                    border: `1.5px solid ${xmlTargetState === 'target' ? '#6366f1' : '#cbd5e1'}`,
                    borderRadius: '8px',
                    padding: '6px 12px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  3. Target State XML
                </button>
                <a
                  href="https://app.diagrams.net"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    marginLeft: 'auto',
                    background: '#f1f5f9',
                    color: '#334155',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  🌐 Open in Draw.io Web ↗
                </a>
              </div>

              <textarea
                value={rawXmlDraft}
                onChange={e => setRawXmlDraft(e.target.value)}
                spellCheck={false}
                style={{
                  width: '100%',
                  height: '320px',
                  fontFamily: 'monospace',
                  fontSize: '0.82rem',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1.5px solid #cbd5e1',
                  background: '#0f172a',
                  color: '#f8fafc',
                  boxSizing: 'border-box',
                  resize: 'vertical',
                  lineHeight: '1.4'
                }}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px' }}>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  Paste or edit any valid Draw.io &lt;mxGraphModel&gt; XML structure.
                </span>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => setIsXmlEditorOpen(false)}
                    style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#475569', padding: '8px 16px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleApplyXmlDraft}
                    style={{ background: '#4f46e5', border: 'none', color: '#ffffff', padding: '8px 18px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)' }}
                  >
                    Apply Changes to Canvas
                  </button>
                </div>
              </div>
            </ModalCard>
          </ModalOverlay>
        )}

        {/* 🎨 Full-Screen Embedded Interactive Draw.io Visual Editor Modal */}
        {isVisualDrawioOpen && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsVisualDrawioOpen(false)}
            style={{ zIndex: 99999 }}
          >
            <ModalCard
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              style={{ maxWidth: '96vw', width: '96vw', height: '92vh', maxHeight: '92vh', padding: '16px', display: 'flex', flexDirection: 'column' }}
            >
              <ModalHeader style={{ paddingBottom: '10px', borderBottom: '1px solid #e2e8f0', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#0284c7', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                    🎨
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      Interactive Visual Draw.io Canvas
                      <span style={{ fontSize: '0.72rem', background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '9999px', fontWeight: 700 }}>
                        {versionHistory[0]?.version || 'v1.0'} Active
                      </span>
                    </h3>
                    <span style={{ fontSize: '0.76rem', color: '#64748b' }}>
                      Editing {xmlTargetState === 'current' ? '1. Current Baseline' : xmlTargetState === 'transition' ? '2. Transition Bridge' : '3. Desired Future State'} • Drag & Drop GCP shapes • Auto-saves directly to ScoreX assessment
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {['current', 'transition', 'target'].map((stageKey, sIdx) => (
                    <button
                      key={stageKey}
                      onClick={() => {
                        setXmlTargetState(stageKey);
                        const nextXml = stageKey === 'current'
                          ? (diagramsData?.currentStateXml || currentXml)
                          : stageKey === 'transition'
                          ? (diagramsData?.transitionStateXml || transitionXml)
                          : (diagramsData?.targetStateXml || targetXml);
                        if (drawioIframeRef.current && drawioIframeRef.current.contentWindow) {
                          drawioIframeRef.current.contentWindow.postMessage(JSON.stringify({
                            action: 'load',
                            autosave: 1,
                            xml: nextXml,
                            title: `ScoreX Stage ${sIdx + 1} Architecture`
                          }), '*');
                        }
                      }}
                      style={{
                        background: xmlTargetState === stageKey ? '#e0f2fe' : '#f1f5f9',
                        border: `1px solid ${xmlTargetState === stageKey ? '#0284c7' : '#cbd5e1'}`,
                        borderRadius: '8px',
                        padding: '6px 10px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        color: xmlTargetState === stageKey ? '#0369a1' : '#0f172a'
                      }}
                    >
                      {sIdx + 1}. {stageKey === 'current' ? 'Current' : stageKey === 'transition' ? 'Transition' : 'Target'}
                    </button>
                  ))}

                  <button
                    onClick={() => setIsVisualDrawioOpen(false)}
                    style={{
                      background: '#4f46e5',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '6px 14px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Done & Close
                  </button>
                </div>
              </ModalHeader>

              {/* Draw.io Embed Iframe with live JSON protocol */}
              <div style={{ flex: 1, width: '100%', position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                <iframe
                  ref={drawioIframeRef}
                  src="https://embed.diagrams.net/?embed=1&ui=kennedy&dark=0&spin=1&proto=json&pv=0"
                  title="ScoreX Draw.io Canvas Editor"
                  style={{ width: '100%', height: '100%', border: 'none' }}
                />
              </div>
            </ModalCard>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </DiagramContainer>
  );
};

export default ArchitectureComparisonDiagram;
