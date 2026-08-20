import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiX, 
  FiDownload, 
  FiChevronLeft, 
  FiChevronRight, 
  FiCheckCircle, 
  FiPrinter, 
  FiCopy, 
  FiExternalLink,
  FiFileText,
  FiLayers,
  FiSearch
} from "react-icons/fi";
import toast from "react-hot-toast";
import { exportAssessmentToPPTX } from "../services/pptxExportService";
import { exportDynamicAssessmentToExcel } from "../services/excelExportService";
import { 
  exportAssessmentToCSV, 
  exportAssessmentToJSON, 
  exportAssessmentToWord, 
  exportDrawioFile 
} from "../services/dataExportService";
import { generateDynamicPDFReport } from "../services/pdfExportService";
import DynamicRadarChart from "./DynamicRadarChart";
import ExecutiveHeatmapMatrix from "./ExecutiveHeatmapMatrix";
import FinancialImpactCard from "./FinancialImpactCard";
import ArchitectureComparisonDiagram from "./ArchitectureComparisonDiagram";

const FullscreenOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #090d16;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  color: #f8fafc;
  overflow: hidden;
`;

const TopDeckBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 28px;
  background: rgba(15, 23, 42, 0.9);
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(16px);
  gap: 16px;
  flex-wrap: wrap;
`;

const DocTabsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(30, 41, 59, 0.7);
  padding: 4px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const DocTab = styled.button`
  background: ${props => props.$active ? props.$accentColor || '#3b82f6' : 'transparent'};
  color: ${props => props.$active ? '#ffffff' : '#94a3b8'};
  border: none;
  border-radius: 8px;
  padding: 6px 14px;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;

  &:hover {
    color: #ffffff;
    background: ${props => props.$active ? props.$accentColor || '#3b82f6' : 'rgba(255, 255, 255, 0.08)'};
  }
`;

const PreviewBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${props => props.$isSlides ? '20px 32px' : '32px 40px'};
  max-width: ${props => props.$isSlides ? '1600px' : '1440px'};
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 12px;
  }
`;

const SlideCanvas = styled.div`
  background: linear-gradient(135deg, #090e1a 0%, #0f172a 100%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6);
  width: 100%;
  min-height: calc(100vh - 160px);
  padding: 36px 48px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 20px 16px;
    min-height: auto;
  }
`;

const SlideHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const SlideFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding-top: 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 0.76rem;
  color: #64748b;
`;

const SlideViewerLayout = styled.div`
  display: flex;
  gap: 20px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

const SlideThumbSidebar = styled.div`
  width: 220px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-right: 6px;

  @media (max-width: 900px) {
    width: 100%;
    flex-direction: row;
    overflow-x: auto;
    padding-bottom: 8px;
  }
`;

const SlideThumbItem = styled.div`
  background: ${props => props.$active ? 'rgba(59, 130, 246, 0.18)' : 'rgba(15, 23, 42, 0.7)'};
  border: ${props => props.$active ? '2px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.1)'};
  border-radius: 12px;
  padding: 10px 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: ${props => props.$active ? '0 4px 14px rgba(59, 130, 246, 0.3)' : 'none'};

  &:hover {
    background: ${props => props.$active ? 'rgba(59, 130, 246, 0.22)' : 'rgba(30, 41, 59, 0.8)'};
    border-color: ${props => props.$active ? '#60a5fa' : 'rgba(255, 255, 255, 0.2)'};
  }

  @media (max-width: 900px) {
    min-width: 160px;
    flex-shrink: 0;
  }
`;

const SlideMainStage = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 0;
`;

const CloudButton = styled.button`
  background: ${props => props.$gradient || 'linear-gradient(135deg, #3b82f6, #1d4ed8)'};
  border: 1px solid ${props => props.$borderColor || '#60a5fa'};
  color: #ffffff;
  border-radius: 10px;
  padding: 7px 16px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 800;
  font-size: 0.85rem;
  box-shadow: 0 2px 10px ${props => props.$shadowColor || 'rgba(59, 130, 246, 0.3)'};
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 14px ${props => props.$shadowColor || 'rgba(59, 130, 246, 0.4)'};
  }
`;

const ActionButton = styled.button`
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #ffffff;
  border-radius: 10px;
  padding: 7px 14px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 700;
  font-size: 0.82rem;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`;

const EditableInput = styled.input`
  background: rgba(56, 189, 248, 0.08);
  border: 1.5px dashed rgba(56, 189, 248, 0.5);
  border-radius: 8px;
  color: #ffffff;
  padding: 6px 12px;
  font-family: inherit;
  font-size: ${props => props.$fontSize || '1rem'};
  font-weight: ${props => props.$fontWeight || '600'};
  width: ${props => props.$width || '100%'};
  box-sizing: border-box;
  outline: none;
  transition: all 0.2s ease;

  &:focus {
    background: rgba(56, 189, 248, 0.15);
    border-color: #38bdf8;
    box-shadow: 0 0 12px rgba(56, 189, 248, 0.3);
  }
`;

const EditableTextArea = styled.textarea`
  background: rgba(56, 189, 248, 0.08);
  border: 1.5px dashed rgba(56, 189, 248, 0.5);
  border-radius: 8px;
  color: #cbd5e1;
  padding: 8px 12px;
  font-family: inherit;
  font-size: ${props => props.$fontSize || '0.95rem'};
  width: 100%;
  box-sizing: border-box;
  outline: none;
  resize: vertical;
  min-height: ${props => props.$minHeight || '60px'};
  line-height: 1.5;
  transition: all 0.2s ease;

  &:focus {
    background: rgba(56, 189, 248, 0.15);
    border-color: #38bdf8;
    box-shadow: 0 0 12px rgba(56, 189, 248, 0.3);
  }
`;

const SpeakerNotesPane = styled.div`
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  padding: 14px 20px;
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  box-sizing: border-box;
`;

const SheetTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.88rem;
  background: #ffffff;
  color: #0f172a;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);

  th {
    background: #0f172a;
    color: #ffffff;
    padding: 12px 16px;
    text-align: left;
    font-weight: 700;
    font-size: 0.82rem;
    letter-spacing: 0.03em;
    border-bottom: 2px solid #1e293b;
  }

  td {
    padding: 12px 16px;
    border-bottom: 1px solid #e2e8f0;
  }

  tr:nth-child(even) td {
    background: #f8fafc;
  }

  tr:hover td {
    background: #f1f5f9;
  }
`;

const DocumentPaper = styled.div`
  background: #ffffff;
  color: #0f172a;
  padding: 48px 60px;
  border-radius: 12px;
  max-width: 960px;
  margin: 0 auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  font-family: 'Calibri', 'Arial', sans-serif;
  line-height: 1.6;

  h1 {
    font-size: 2rem;
    color: #0b132b;
    border-bottom: 3px solid #1d4ed8;
    padding-bottom: 8px;
    margin-bottom: 6px;
  }

  h2 {
    font-size: 1.35rem;
    color: #1d4ed8;
    margin-top: 28px;
    border-bottom: 1px solid #cbd5e1;
    padding-bottom: 6px;
  }

  p {
    font-size: 1rem;
    color: #334155;
  }
`;

export const UnifiedDocumentPreviewModal = ({ 
  isOpen, 
  onClose, 
  initialDocType = 'slides', 
  instance, 
  report, 
  framework 
}) => {
  const [activeDocType, setActiveDocType] = useState(initialDocType);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeSheetTab, setActiveSheetTab] = useState('summary');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (initialDocType) {
      setActiveDocType(initialDocType);
    }
  }, [initialDocType, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (activeDocType === 'slides') {
        if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
          e.preventDefault();
          setCurrentSlide(prev => Math.min(5, prev + 1));
        } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
          e.preventDefault();
          setCurrentSlide(prev => Math.max(0, prev - 1));
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, activeDocType]);

  const org = instance?.customerName || 'Organization';
  const overallScore = instance?.totalScore || report?.overallScore || '3.0';
  const maturityStage = instance?.maturityLevel || report?.maturityLevel || 'Defined';
  const scores = instance?.scores || report?.dimensionScores || {};
  const dimensions = framework?.dimensions || [];
  const recs = report?.prioritizedRecommendations || report?.prioritizedActions || [];
  const safeName = org.toLowerCase().replace(/[^a-z0-9]/g, '_');

  const [isEditMode, setIsEditMode] = useState(false);
  const [customDeckData, setCustomDeckData] = useState({
    title: framework?.title || 'Enterprise Modernization Assessment',
    customerName: org,
    scopeBadge: 'ScoreX Executive Advisory',
    scopeSubtitle: 'Strategic Cloud & AI Architecture Readout',
    maturityScore: overallScore,
    maturityStage: maturityStage,
    roiEstimate: '$2.3M - $4.2M',
    tcoArbitrage: '35% - 50% TCO Arbitrage',
    executiveSummary: report?.executiveSummary || 'Comprehensive maturity diagnostic and target state architecture advisory formulated by Google DeepMind Gemini advisory compiler.',
    speakerNotes: {
      0: `Good morning everyone. Today we are presenting the strategic modernization assessment for ${org}. Our primary focus is accelerating target state cloud architecture while capturing $2.3M - $4.2M in projected 3-year value.`,
      1: `On this diagnostic heatmap, we map current operational capability against organizational risk across each architectural dimension.`,
      2: `This 5-axis polar radar visualizes the maturity gap between our baseline foundation and target cloud architecture.`,
      3: `Here we detail the quantified financial model, demonstrating positive ROI realization with 35% - 50% TCO arbitrage.`,
      4: `This blueprint outlines the target state service mesh, event streaming backbone, and enterprise governance boundary.`,
      5: `Finally, our 3-phase execution roadmap prioritizes high-impact quick wins in Phase 1 leading into scale in Phase 2 & 3.`
    },
    recommendations: (recs && recs.length > 0 ? recs.slice(0, 4) : [
      { title: "Establish Sovereign AI Mesh & MCP Gateway", impact: "Cuts API latency by 45% and eliminates shadow AI sprawl", timeline: "Phase 1 (0-3m)" },
      { title: "BigLake Unified Iceberg Catalog Modernization", impact: "Zero-copy cross-cloud analytics with 60% query compute reduction", timeline: "Phase 1 (0-3m)" },
      { title: "Automated FinOps Unit-Cost Anomaly Guardrails", impact: "Recovers $850K in unallocated cloud spend in year 1", timeline: "Phase 2 (3-6m)" },
      { title: "Zero-Trust Identity Federation & VPC Service Controls", impact: "100% compliance with ISO 27001 and PCI-DSS data boundaries", timeline: "Phase 2 (3-6m)" }
    ]).map((r, i) => ({
      title: r.title || r.recommendation || `Initiative #${i + 1}`,
      impact: r.whyItMatters || r.impact || r.description || "Strategic architectural capability",
      timeline: r.timeline || `Phase ${(i % 3) + 1}`
    }))
  });

  if (!isOpen) return null;

  const SLIDES_META = [
    { title: "Executive Scope", icon: "📊", subtitle: "Strategic Readout", num: 1 },
    { title: "Risk & Heatmap", icon: "🗺️", subtitle: "Diagnostic Matrix", num: 2 },
    { title: "Dimensional Radar", icon: "🎯", subtitle: "5-Axis Topology", num: 3 },
    { title: "Financial ROI & TCO", icon: "💰", subtitle: "3-Yr Savings Model", num: 4 },
    { title: "Target Architecture", icon: "🏛️", subtitle: "Cloud Service Mesh", num: 5 },
    { title: "Transformation Roadmap", icon: "🚀", subtitle: "Priority Milestones", num: 6 }
  ];

  const DOC_CONFIGS = {
    slides: {
      name: `${customDeckData.customerName || org} - Executive Architecture Deck.pptx`,
      app: 'Google Slides',
      appIcon: '📊',
      badge: 'PPTX / GOOGLE SLIDES',
      cloudUrl: 'https://slides.new',
      gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
      borderColor: '#fbbf24',
      shadowColor: 'rgba(245, 158, 11, 0.35)',
      tabColor: '#f59e0b',
      downloadLabel: 'Download .pptx',
      onDownload: async () => {
        toast.loading('Generating 16:9 Executive PowerPoint Presentation...', { id: 'pptx-export' });
        const res = await exportAssessmentToPPTX(instance, report);
        if (res?.success) {
          toast.success('📊 PPTX deck exported successfully!', { id: 'pptx-export' });
        } else {
          toast.error(res?.error || 'Failed to export PPTX', { id: 'pptx-export' });
        }
      }
    },
    sheets: {
      name: `${org} - Maturity Scores & Analysis.xlsx`,
      app: 'Google Sheets',
      appIcon: '📈',
      badge: 'XLSX / GOOGLE SHEETS',
      cloudUrl: 'https://sheets.new',
      gradient: 'linear-gradient(135deg, #10b981, #047857)',
      borderColor: '#34d399',
      shadowColor: 'rgba(16, 185, 129, 0.35)',
      tabColor: '#10b981',
      downloadLabel: 'Download .xlsx',
      onDownload: () => {
        try {
          exportDynamicAssessmentToExcel(instance, report);
          toast.success('📊 Multi-sheet Excel workbook exported!');
        } catch (e) {
          toast.error('Failed to export Excel workbook');
        }
      }
    },
    docs: {
      name: `${org} - Executive Advisory Memo.docx`,
      app: 'Google Docs',
      appIcon: '📝',
      badge: 'DOCX / GOOGLE DOCS',
      cloudUrl: 'https://docs.new',
      gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
      borderColor: '#60a5fa',
      shadowColor: 'rgba(59, 130, 246, 0.35)',
      tabColor: '#3b82f6',
      downloadLabel: 'Download .docx',
      onDownload: () => {
        const res = exportAssessmentToWord(instance, report);
        if (res?.success) {
          toast.success('📝 Executive Word memorandum exported!');
        } else {
          toast.error('Failed to export Word document');
        }
      }
    },
    pdf: {
      name: `${org} - Board Advisory Report.pdf`,
      app: 'Print / Web PDF',
      appIcon: '📄',
      badge: 'PDF EXECUTIVE REPORT',
      cloudUrl: null,
      gradient: 'linear-gradient(135deg, #ef4444, #b91c1c)',
      borderColor: '#f87171',
      shadowColor: 'rgba(239, 68, 68, 0.35)',
      tabColor: '#ef4444',
      downloadLabel: 'Download .pdf',
      onDownload: () => {
        try {
          generateDynamicPDFReport(instance, report);
          toast.success('📄 Executive PDF generated!');
        } catch (e) {
          toast.error('Failed to generate PDF report');
        }
      }
    },
    csv: {
      name: `${org} - Flat Assessment Matrix.csv`,
      app: 'Google Sheets (CSV)',
      appIcon: '📑',
      badge: 'CSV MATRIX',
      cloudUrl: 'https://sheets.new',
      gradient: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
      borderColor: '#38bdf8',
      shadowColor: 'rgba(14, 165, 233, 0.35)',
      tabColor: '#0ea5e9',
      downloadLabel: 'Download .csv',
      onDownload: () => {
        const res = exportAssessmentToCSV(instance, report);
        if (res?.success) {
          toast.success('📑 Flat CSV matrix exported!');
        } else {
          toast.error('Failed to export CSV');
        }
      }
    },
    drawio: {
      name: `${org} - Cloud Architecture.drawio`,
      app: 'Draw.io / diagrams.net',
      appIcon: '📐',
      badge: 'DRAW.IO / ARCHITECTURE',
      cloudUrl: 'https://app.diagrams.net',
      gradient: 'linear-gradient(135deg, #f97316, #c2410c)',
      borderColor: '#fb923c',
      shadowColor: 'rgba(249, 115, 22, 0.35)',
      tabColor: '#f97316',
      downloadLabel: 'Download .drawio',
      onDownload: () => {
        const diagrams = report?.architectureDiagrams || instance?.architectureDiagrams || {};
        if (diagrams.targetStateXml) {
          exportDrawioFile(diagrams.targetStateXml, `scorex_${safeName}_target_state.drawio`);
          toast.success('📐 Target architecture Draw.io XML exported!');
        } else if (diagrams.currentStateXml) {
          exportDrawioFile(diagrams.currentStateXml, `scorex_${safeName}_current_state.drawio`);
          toast.success('📐 Current architecture Draw.io XML exported!');
        } else {
          toast.error('No Draw.io XML available for export');
        }
      }
    }
  };

  const currentConfig = DOC_CONFIGS[activeDocType] || DOC_CONFIGS.slides;

  const handleOpenCloud = () => {
    if (currentConfig.cloudUrl) {
      window.open(currentConfig.cloudUrl, '_blank', 'noopener,noreferrer');
      toast.success(`Opened ${currentConfig.app} in a new tab!`, { id: 'open-cloud', icon: currentConfig.appIcon });
    } else if (activeDocType === 'pdf') {
      window.print();
    }
  };

  return (
    <AnimatePresence>
      <FullscreenOverlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Top Gmail/Drive-Style Action Header */}
        <TopDeckBar>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ 
              width: "36px", 
              height: "36px", 
              borderRadius: "10px", 
              background: currentConfig.tabColor || '#3b82f6', 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              fontSize: "1.2rem",
              boxShadow: `0 2px 8px ${currentConfig.shadowColor}`
            }}>
              <span>{currentConfig.appIcon}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontWeight: 800, fontSize: "0.95rem", color: "#f8fafc" }}>
                  {currentConfig.name}
                </span>
                <span style={{ 
                  fontSize: "0.68rem", 
                  background: "rgba(255, 255, 255, 0.1)", 
                  color: "#cbd5e1", 
                  border: "1px solid rgba(255, 255, 255, 0.2)", 
                  padding: "1px 6px", 
                  borderRadius: "4px", 
                  fontWeight: 700 
                }}>
                  {currentConfig.badge}
                </span>
              </div>
              <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                {framework?.title || 'Architecture Advisory'} • Live In-Browser Preview & Cloud Bridge
              </span>
            </div>
          </div>

          {/* Doc Type Selector Tabs */}
          <DocTabsContainer>
            <DocTab 
              $active={activeDocType === 'slides'} 
              $accentColor="#f59e0b"
              onClick={() => setActiveDocType('slides')}
            >
              📊 Google Slides
            </DocTab>
            <DocTab 
              $active={activeDocType === 'sheets'} 
              $accentColor="#10b981"
              onClick={() => setActiveDocType('sheets')}
            >
              📈 Google Sheets (Excel)
            </DocTab>
            <DocTab 
              $active={activeDocType === 'docs'} 
              $accentColor="#3b82f6"
              onClick={() => setActiveDocType('docs')}
            >
              📝 Google Docs (Word)
            </DocTab>
            <DocTab 
              $active={activeDocType === 'pdf'} 
              $accentColor="#ef4444"
              onClick={() => setActiveDocType('pdf')}
            >
              📄 PDF Report
            </DocTab>
            <DocTab 
              $active={activeDocType === 'csv'} 
              $accentColor="#0ea5e9"
              onClick={() => setActiveDocType('csv')}
            >
              📑 CSV
            </DocTab>
            <DocTab 
              $active={activeDocType === 'drawio'} 
              $accentColor="#f97316"
              onClick={() => setActiveDocType('drawio')}
            >
              📐 Draw.io
            </DocTab>
          </DocTabsContainer>

          {/* Right Cloud Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {activeDocType === 'slides' && (
              <ActionButton
                onClick={() => {
                  setIsEditMode(prev => !prev);
                  if (!isEditMode) {
                    toast.success('✏️ Inline Slide Studio Active! Click any field or speaker note to edit.', { icon: '🎨' });
                  } else {
                    toast.success('💾 Slide changes saved!', { icon: '✅' });
                  }
                }}
                style={{
                  background: isEditMode ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(99, 102, 241, 0.2)',
                  borderColor: isEditMode ? '#34d399' : 'rgba(165, 180, 252, 0.4)',
                  color: '#ffffff',
                  fontWeight: 800,
                  boxShadow: isEditMode ? '0 0 14px rgba(16, 185, 129, 0.4)' : 'none'
                }}
                title="Edit slide text, metrics, initiatives, and speaker notes directly inside the browser"
              >
                {isEditMode ? '💾 Save & Finish Editing' : '✏️ Edit Slides Inline'}
              </ActionButton>
            )}

            {currentConfig.cloudUrl && (
              <CloudButton
                $gradient={currentConfig.gradient}
                $borderColor={currentConfig.borderColor}
                $shadowColor={currentConfig.shadowColor}
                onClick={handleOpenCloud}
                title={`Open and edit directly in ${currentConfig.app}`}
              >
                <span>{currentConfig.appIcon}</span> Open with {currentConfig.app}
              </CloudButton>
            )}

            <ActionButton 
              onClick={currentConfig.onDownload}
              title={currentConfig.downloadLabel}
            >
              <FiDownload /> {currentConfig.downloadLabel}
            </ActionButton>

            <ActionButton
              onClick={onClose}
              style={{ background: "rgba(239, 68, 68, 0.15)", borderColor: "rgba(239, 68, 68, 0.3)", color: "#f87171" }}
              title="Close Preview"
            >
              <FiX size={16} />
            </ActionButton>
          </div>
        </TopDeckBar>

        {/* In-Browser Interactive Preview Body */}
        <PreviewBody $isSlides={activeDocType === 'slides'}>
          {/* 1. SLIDES PREVIEW (GMAIL / GOOGLE DRIVE STYLE ATTACHMENT VIEWER & INLINE STUDIO) */}
          {activeDocType === 'slides' && (
            <SlideViewerLayout>
              {/* Left Slide Thumbnail Sidebar (Gmail / Drive style) */}
              <SlideThumbSidebar>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "2px 6px 8px" }}>
                  <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    Slides ({SLIDES_META.length})
                  </span>
                  {isEditMode && (
                    <span style={{ fontSize: "0.68rem", background: "rgba(16, 185, 129, 0.2)", color: "#34d399", border: "1px solid rgba(52, 211, 153, 0.3)", padding: "1px 6px", borderRadius: "4px", fontWeight: 700 }}>
                      EDITING
                    </span>
                  )}
                </div>
                {SLIDES_META.map((slide, idx) => (
                  <SlideThumbItem
                    key={idx}
                    $active={currentSlide === idx}
                    onClick={() => setCurrentSlide(idx)}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                      <span style={{ fontSize: "0.68rem", background: currentSlide === idx ? "#3b82f6" : "rgba(255,255,255,0.1)", color: "#fff", padding: "1px 6px", borderRadius: "4px", fontWeight: 800 }}>
                        Slide {slide.num}
                      </span>
                      <span style={{ fontSize: "0.95rem" }}>{slide.icon}</span>
                    </div>
                    <div style={{ fontSize: "0.82rem", fontWeight: 700, color: currentSlide === idx ? "#ffffff" : "#cbd5e1", lineHeight: 1.3 }}>
                      {slide.title}
                    </div>
                    <div style={{ fontSize: "0.7rem", color: "#94a3b8", marginTop: "2px" }}>
                      {slide.subtitle}
                    </div>
                  </SlideThumbItem>
                ))}
              </SlideThumbSidebar>

              {/* Main Presentation Stage */}
              <SlideMainStage>
                {/* Slide Navigation Top Bar */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(30, 41, 59, 0.7)", padding: "10px 20px", borderRadius: "14px", border: "1px solid rgba(255, 255, 255, 0.1)", marginBottom: "16px", width: "100%", boxSizing: "border-box", flexWrap: "wrap", gap: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "0.92rem", color: "#f8fafc", fontWeight: 800 }}>
                      {SLIDES_META[currentSlide]?.icon} {SLIDES_META[currentSlide]?.title}
                    </span>
                    <span style={{ fontSize: "0.75rem", background: "rgba(99, 102, 241, 0.25)", color: "#a5b4fc", border: "1px solid rgba(165, 180, 252, 0.4)", padding: "2px 8px", borderRadius: "6px", fontWeight: 700 }}>
                      Slide {currentSlide + 1} of {SLIDES_META.length}
                    </span>
                    {isEditMode && (
                      <span style={{ fontSize: "0.72rem", background: "rgba(56, 189, 248, 0.15)", color: "#38bdf8", border: "1px solid rgba(56, 189, 248, 0.3)", padding: "2px 8px", borderRadius: "6px", fontWeight: 700 }}>
                        🎨 Live Inline Studio
                      </span>
                    )}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <ActionButton
                      onClick={() => setIsEditMode(prev => !prev)}
                      style={{
                        background: isEditMode ? '#059669' : 'rgba(255, 255, 255, 0.08)',
                        color: '#fff',
                        fontWeight: 700
                      }}
                    >
                      {isEditMode ? '💾 Save Slide' : '✏️ Edit'}
                    </ActionButton>
                    <span style={{ fontSize: "0.75rem", color: "#94a3b8", marginRight: "4px" }}>← / → keys:</span>
                    <ActionButton 
                      disabled={currentSlide === 0}
                      onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
                    >
                      <FiChevronLeft /> Prev
                    </ActionButton>
                    <ActionButton 
                      disabled={currentSlide === SLIDES_META.length - 1}
                      onClick={() => setCurrentSlide(prev => Math.min(SLIDES_META.length - 1, prev + 1))}
                    >
                      Next <FiChevronRight />
                    </ActionButton>
                  </div>
                </div>

                {/* SLIDE 0: TITLE COVER SLIDE */}
                {currentSlide === 0 && (
                <SlideCanvas>
                  <SlideHeader>
                    <div style={{ width: "100%" }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <span style={{ background: '#1d4ed8', color: '#ffffff', fontSize: '0.72rem', fontWeight: 800, padding: '3px 10px', borderRadius: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          ScoreX Executive Advisory
                        </span>
                        {isEditMode ? (
                          <EditableInput 
                            value={customDeckData.scopeSubtitle} 
                            onChange={e => setCustomDeckData(d => ({ ...d, scopeSubtitle: e.target.value }))}
                            placeholder="Subtitle / Readout Scope"
                            $fontSize="0.82rem"
                            $width="320px"
                          />
                        ) : (
                          <span style={{ color: '#94a3b8', fontSize: '0.82rem', fontWeight: 600 }}>
                            {customDeckData.scopeSubtitle}
                          </span>
                        )}
                      </div>
                      {isEditMode ? (
                        <EditableInput 
                          value={customDeckData.title} 
                          onChange={e => setCustomDeckData(d => ({ ...d, title: e.target.value }))}
                          placeholder="Assessment Presentation Title"
                          $fontSize="1.8rem"
                          $fontWeight="900"
                        />
                      ) : (
                        <h1 style={{ fontSize: "2.5rem", margin: 0, color: "#ffffff", fontWeight: 900, lineHeight: 1.2 }}>
                          {customDeckData.title}
                        </h1>
                      )}
                    </div>
                    <span style={{ fontSize: "0.85rem", color: "#38bdf8", fontWeight: 800 }}>Slide 1 / 6</span>
                  </SlideHeader>

                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "24px", padding: "30px 0", textAlign: "center" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(56, 189, 248, 0.15)", border: "1px solid rgba(56, 189, 248, 0.3)", color: "#38bdf8", padding: "6px 18px", borderRadius: "20px", fontSize: "0.95rem", fontWeight: 700 }}>
                      🏢 Target Enterprise: {isEditMode ? (
                        <EditableInput 
                          value={customDeckData.customerName} 
                          onChange={e => setCustomDeckData(d => ({ ...d, customerName: e.target.value }))}
                          placeholder="Enterprise Name"
                          $fontSize="0.95rem"
                          $width="220px"
                        />
                      ) : (
                        <strong>{customDeckData.customerName}</strong>
                      )}
                    </div>

                    {isEditMode ? (
                      <EditableTextArea 
                        value={customDeckData.executiveSummary}
                        onChange={e => setCustomDeckData(d => ({ ...d, executiveSummary: e.target.value }))}
                        placeholder="Executive advisory briefing summary..."
                        $fontSize="1rem"
                        $minHeight="80px"
                      />
                    ) : (
                      <p style={{ maxWidth: "800px", color: "#cbd5e1", fontSize: "1.05rem", lineHeight: 1.6, margin: 0 }}>
                        {customDeckData.executiveSummary}
                      </p>
                    )}

                    <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", justifyContent: "center" }}>
                      <div style={{ background: "rgba(15, 23, 42, 0.85)", padding: "18px 32px", borderRadius: "16px", border: "1.5px solid rgba(16, 185, 129, 0.3)", boxShadow: "0 10px 25px rgba(0,0,0,0.3)" }}>
                        <div style={{ fontSize: "0.8rem", color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>
                          Overall Maturity Index
                        </div>
                        {isEditMode ? (
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <EditableInput 
                              value={customDeckData.maturityScore} 
                              onChange={e => setCustomDeckData(d => ({ ...d, maturityScore: e.target.value }))}
                              $fontSize="1.8rem"
                              $fontWeight="900"
                              $width="100px"
                            />
                            <span style={{ fontSize: "1.2rem", color: "#64748b" }}>/ 5.0</span>
                          </div>
                        ) : (
                          <div style={{ fontSize: "2.6rem", fontWeight: 900, color: "#34d399" }}>
                            {customDeckData.maturityScore} <span style={{ fontSize: "1.2rem", color: "#64748b" }}>/ 5.0</span>
                          </div>
                        )}
                        <div style={{ fontSize: "0.82rem", color: "#a7f3d0", fontWeight: 700 }}>{customDeckData.maturityStage} Stage</div>
                      </div>

                      <div style={{ background: "rgba(15, 23, 42, 0.85)", padding: "18px 32px", borderRadius: "16px", border: "1.5px solid rgba(59, 130, 246, 0.3)", boxShadow: "0 10px 25px rgba(0,0,0,0.3)" }}>
                        <div style={{ fontSize: "0.8rem", color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>
                          Projected 3-Year Value / ROI
                        </div>
                        {isEditMode ? (
                          <EditableInput 
                            value={customDeckData.roiEstimate} 
                            onChange={e => setCustomDeckData(d => ({ ...d, roiEstimate: e.target.value }))}
                            $fontSize="1.8rem"
                            $fontWeight="900"
                            $width="220px"
                          />
                        ) : (
                          <div style={{ fontSize: "2.6rem", fontWeight: 900, color: "#60a5fa" }}>
                            {customDeckData.roiEstimate}
                          </div>
                        )}
                        <div style={{ fontSize: "0.82rem", color: "#bfdbfe", fontWeight: 700 }}>{customDeckData.tcoArbitrage}</div>
                      </div>
                    </div>
                  </div>

                  <SlideFooter>
                    <span>CONFIDENTIAL • Prepared for {customDeckData.customerName} Board & Executive Review</span>
                    <span>ScoreX Engine • Google Cloud Enterprise Advisory</span>
                  </SlideFooter>
                </SlideCanvas>
              )}

              {/* SLIDE 1: HEATMAP MATRIX */}
              {currentSlide === 1 && (
                <SlideCanvas>
                  <SlideHeader>
                    <div>
                      <div style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                        Executive Diagnostic Matrix
                      </div>
                      <h2 style={{ fontSize: "1.8rem", color: "#ffffff", fontWeight: 800, margin: 0 }}>
                        Operational Capability vs Risk Heatmap
                      </h2>
                    </div>
                    <span style={{ fontSize: "0.85rem", color: "#38bdf8", fontWeight: 800 }}>Slide 2 / 6</span>
                  </SlideHeader>

                  <div style={{ flex: 1, overflowY: "auto", margin: "10px 0" }}>
                    <ExecutiveHeatmapMatrix
                      theme="dark"
                      dimensions={framework?.dimensions || []}
                      dimensionScores={scores || {}}
                      responses={instance?.responses || {}}
                    />
                  </div>

                  <SlideFooter>
                    <span>CONFIDENTIAL • Prepared for {customDeckData.customerName}</span>
                    <span>Slide 2 of 6</span>
                  </SlideFooter>
                </SlideCanvas>
              )}

              {/* SLIDE 2: RADAR CHART */}
              {currentSlide === 2 && (
                <SlideCanvas>
                  <SlideHeader>
                    <div>
                      <div style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                        5-Axis Capability Matrix
                      </div>
                      <h2 style={{ fontSize: "1.8rem", color: "#ffffff", fontWeight: 800, margin: 0 }}>
                        Dimensional Gap Radar & Target Horizon Topology
                      </h2>
                    </div>
                    <span style={{ fontSize: "0.85rem", color: "#38bdf8", fontWeight: 800 }}>Slide 3 / 6</span>
                  </SlideHeader>

                  <div style={{ flex: 1, overflowY: "auto", margin: "10px 0" }}>
                    <DynamicRadarChart
                      theme="dark"
                      dimensions={framework?.dimensions || []}
                      dimensionScores={scores || {}}
                      responses={instance?.responses || {}}
                    />
                  </div>

                  <SlideFooter>
                    <span>CONFIDENTIAL • Prepared for {customDeckData.customerName}</span>
                    <span>Slide 3 of 6</span>
                  </SlideFooter>
                </SlideCanvas>
              )}

              {/* SLIDE 3: FINANCIAL IMPACT */}
              {currentSlide === 3 && (
                <SlideCanvas>
                  <SlideHeader>
                    <div>
                      <div style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                        FinOps & Business Realization
                      </div>
                      <h2 style={{ fontSize: "1.8rem", color: "#ffffff", fontWeight: 800, margin: 0 }}>
                        Quantified 3-Year Financial Impact & TCO Reduction
                      </h2>
                    </div>
                    <span style={{ fontSize: "0.85rem", color: "#38bdf8", fontWeight: 800 }}>Slide 4 / 6</span>
                  </SlideHeader>

                  <div style={{ flex: 1, overflowY: "auto", margin: "10px 0" }}>
                    <FinancialImpactCard
                      theme="dark"
                      pillarScores={scores || {}}
                      framework={framework}
                      overallCurrent={instance?.totalScore || 2.5}
                      overallTarget={4.2}
                    />
                  </div>

                  <SlideFooter>
                    <span>CONFIDENTIAL • Prepared for {customDeckData.customerName}</span>
                    <span>Slide 4 of 6</span>
                  </SlideFooter>
                </SlideCanvas>
              )}

              {/* SLIDE 4: ARCHITECTURE BLUEPRINT */}
              {currentSlide === 4 && (
                <SlideCanvas>
                  <SlideHeader>
                    <div>
                      <div style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                        Target Architecture Blueprint
                      </div>
                      <h2 style={{ fontSize: "1.8rem", color: "#ffffff", fontWeight: 800, margin: 0 }}>
                        Cloud Architecture Evolution & Target Service Mesh
                      </h2>
                    </div>
                    <span style={{ fontSize: "0.85rem", color: "#38bdf8", fontWeight: 800 }}>Slide 5 / 6</span>
                  </SlideHeader>

                  <div style={{ flex: 1, overflowY: "auto", margin: "10px 0" }}>
                    <ArchitectureComparisonDiagram
                      theme="dark"
                      instanceId={instance?.id}
                      initialDiagrams={report?.architectureDiagrams}
                      currentScore={instance?.totalScore || 2.5}
                      targetScore={4.5}
                      customerName={customDeckData.customerName}
                      useCase={instance?.useCase}
                      framework={framework}
                    />
                  </div>

                  <SlideFooter>
                    <span>CONFIDENTIAL • Prepared for {customDeckData.customerName}</span>
                    <span>Slide 5 of 6</span>
                  </SlideFooter>
                </SlideCanvas>
              )}

              {/* SLIDE 5: ROADMAP & ACTIONS */}
              {currentSlide === 5 && (
                <SlideCanvas>
                  <SlideHeader>
                    <div>
                      <div style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                        Execution Strategy & Milestones
                      </div>
                      <h2 style={{ fontSize: "1.8rem", color: "#ffffff", fontWeight: 800, margin: 0 }}>
                        Strategic Transformation Roadmap & Priority Actions
                      </h2>
                    </div>
                    <span style={{ fontSize: "0.85rem", color: "#38bdf8", fontWeight: 800 }}>Slide 6 / 6</span>
                  </SlideHeader>

                  <div style={{ flex: 1, overflowY: "auto", margin: "10px 0", display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "16px" }}>
                      {customDeckData.recommendations.map((r, idx) => (
                        <div key={idx} style={{ background: "rgba(15, 23, 42, 0.9)", padding: "20px", borderRadius: "14px", border: "1.5px solid rgba(255, 255, 255, 0.1)", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "12px" }}>
                          <div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                              <span style={{ fontSize: "0.75rem", background: "rgba(99, 102, 241, 0.2)", color: "#a5b4fc", border: "1px solid rgba(165, 180, 252, 0.3)", padding: "2px 8px", borderRadius: "4px", fontWeight: 800 }}>
                                INITIATIVE #{idx + 1}
                              </span>
                              {isEditMode ? (
                                <EditableInput 
                                  value={r.timeline}
                                  onChange={e => {
                                    const val = e.target.value;
                                    setCustomDeckData(d => {
                                      const newRecs = [...d.recommendations];
                                      newRecs[idx] = { ...newRecs[idx], timeline: val };
                                      return { ...d, recommendations: newRecs };
                                    });
                                  }}
                                  placeholder="Timeline"
                                  $fontSize="0.75rem"
                                  $width="120px"
                                />
                              ) : (
                                <span style={{ fontSize: "0.76rem", background: "rgba(16, 185, 129, 0.2)", color: "#34d399", border: "1px solid rgba(52, 211, 153, 0.3)", padding: "2px 8px", borderRadius: "4px", fontWeight: 700 }}>
                                  {r.timeline || 'Phase 1'}
                                </span>
                              )}
                            </div>
                            {isEditMode ? (
                              <EditableInput 
                                value={r.title}
                                onChange={e => {
                                  const val = e.target.value;
                                  setCustomDeckData(d => {
                                    const newRecs = [...d.recommendations];
                                    newRecs[idx] = { ...newRecs[idx], title: val };
                                    return { ...d, recommendations: newRecs };
                                  });
                                }}
                                placeholder="Initiative Title"
                                $fontSize="1rem"
                                $fontWeight="800"
                              />
                            ) : (
                              <h4 style={{ margin: "0 0 6px 0", fontSize: "1.05rem", color: "#ffffff", fontWeight: 800 }}>{r.title}</h4>
                            )}
                            {isEditMode ? (
                              <EditableTextArea 
                                value={r.impact}
                                onChange={e => {
                                  const val = e.target.value;
                                  setCustomDeckData(d => {
                                    const newRecs = [...d.recommendations];
                                    newRecs[idx] = { ...newRecs[idx], impact: val };
                                    return { ...d, recommendations: newRecs };
                                  });
                                }}
                                placeholder="Impact & justification..."
                                $fontSize="0.85rem"
                                $minHeight="50px"
                              />
                            ) : (
                              <p style={{ margin: 0, fontSize: "0.85rem", color: "#94a3b8", lineHeight: 1.5 }}>{r.impact}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <SlideFooter>
                    <span>CONFIDENTIAL • Prepared for {customDeckData.customerName}</span>
                    <span>Slide 6 of 6</span>
                  </SlideFooter>
                </SlideCanvas>
              )}

              {/* Presenter Speaker Notes Drawer */}
              <SpeakerNotesPane>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "1rem" }}>🎙️</span>
                    <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#f8fafc" }}>
                      Executive Speaker Notes (Slide {currentSlide + 1}: {SLIDES_META[currentSlide]?.title})
                    </span>
                  </div>
                  <span style={{ fontSize: "0.72rem", color: "#94a3b8" }}>
                    Presenter Talking Points
                  </span>
                </div>
                <EditableTextArea
                  value={customDeckData.speakerNotes[currentSlide] || ''}
                  onChange={e => {
                    const val = e.target.value;
                    setCustomDeckData(d => ({
                      ...d,
                      speakerNotes: { ...d.speakerNotes, [currentSlide]: val }
                    }));
                  }}
                  placeholder="Type executive presenter talking points for this slide..."
                  $minHeight="55px"
                  $fontSize="0.88rem"
                />
              </SpeakerNotesPane>
              </SlideMainStage>
            </SlideViewerLayout>
          )}

          {/* 2. SHEETS / EXCEL PREVIEW */}
          {activeDocType === 'sheets' && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", gap: "8px" }}>
                  <DocTab $active={activeSheetTab === 'summary'} $accentColor="#10b981" onClick={() => setActiveSheetTab('summary')}>
                    📋 Sheet 1: Executive Summary
                  </DocTab>
                  <DocTab $active={activeSheetTab === 'scores'} $accentColor="#10b981" onClick={() => setActiveSheetTab('scores')}>
                    📊 Sheet 2: Pillar Scoring Matrix
                  </DocTab>
                  <DocTab $active={activeSheetTab === 'roadmap'} $accentColor="#10b981" onClick={() => setActiveSheetTab('roadmap')}>
                    🗺️ Sheet 3: Action Roadmap
                  </DocTab>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(30, 41, 59, 0.7)", padding: "6px 12px", borderRadius: "8px" }}>
                  <FiSearch color="#94a3b8" />
                  <input
                    type="text"
                    placeholder="Search spreadsheet rows..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ background: "transparent", border: "none", color: "#fff", fontSize: "0.85rem", outline: "none" }}
                  />
                </div>
              </div>

              {activeSheetTab === 'summary' && (
                <SheetTable>
                  <thead>
                    <tr>
                      <th>METRIC / PROPERTY</th>
                      <th>ASSESSMENT VALUE</th>
                      <th>TARGET HORIZON</th>
                      <th>GOVERNANCE STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Target Organization</strong></td>
                      <td>{org}</td>
                      <td>Enterprise Grade</td>
                      <td><span style={{ color: "#047857", fontWeight: 700 }}>VERIFIED</span></td>
                    </tr>
                    <tr>
                      <td><strong>Overall Cloud Maturity Index</strong></td>
                      <td><strong>{overallScore} / 5.0</strong> ({maturityStage})</td>
                      <td><strong>4.2 / 5.0</strong> (Optimized)</td>
                      <td><span style={{ color: "#b45309", fontWeight: 700 }}>MODERNIZATION REQUIRED</span></td>
                    </tr>
                    <tr>
                      <td><strong>Projected 3-Year ROI Savings</strong></td>
                      <td>$2,340,000 - $4,200,000</td>
                      <td>35% - 50% TCO Cut</td>
                      <td><span style={{ color: "#047857", fontWeight: 700 }}>FINANCIALLY MODELLED</span></td>
                    </tr>
                    <tr>
                      <td><strong>Assessed Architectural Pillars</strong></td>
                      <td>{dimensions.length} Dimensions Assessed</td>
                      <td>100% Coverage</td>
                      <td><span style={{ color: "#047857", fontWeight: 700 }}>COMPLETE</span></td>
                    </tr>
                  </tbody>
                </SheetTable>
              )}

              {activeSheetTab === 'scores' && (
                <SheetTable>
                  <thead>
                    <tr>
                      <th>ARCHITECTURAL DIMENSION</th>
                      <th>CURRENT SCORE</th>
                      <th>TARGET SCORE</th>
                      <th>MATURITY GAP</th>
                      <th>RISK TIER</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dimensions
                      .filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((dim, idx) => {
                        const cur = Number(scores[dim.id] || scores[dim.name] || 2.8);
                        const tgt = 4.2;
                        const gap = (tgt - cur).toFixed(1);
                        return (
                          <tr key={idx}>
                            <td><strong>{dim.name}</strong></td>
                            <td style={{ color: "#1d4ed8", fontWeight: 700 }}>{cur.toFixed(1)} / 5.0</td>
                            <td style={{ color: "#047857", fontWeight: 700 }}>{tgt.toFixed(1)} / 5.0</td>
                            <td style={{ color: "#b91c1c", fontWeight: 700 }}>+{gap} pts</td>
                            <td>
                              <span style={{ 
                                background: gap > 1.2 ? '#fee2e2' : '#fef3c7', 
                                color: gap > 1.2 ? '#991b1b' : '#92400e', 
                                padding: '3px 8px', 
                                borderRadius: '4px', 
                                fontWeight: 700,
                                fontSize: '0.78rem' 
                              }}>
                                {gap > 1.2 ? 'HIGH RISK' : 'MEDIUM RISK'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </SheetTable>
              )}

              {activeSheetTab === 'roadmap' && (
                <SheetTable>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>INITIATIVE / ACTION</th>
                      <th>BUSINESS IMPACT</th>
                      <th>TIMELINE / PHASE</th>
                      <th>EFFORT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recs
                      .filter(r => (r.title || r.recommendation || '').toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((r, idx) => (
                        <tr key={idx}>
                          <td><strong>{idx + 1}</strong></td>
                          <td><strong>{r.title || r.recommendation}</strong></td>
                          <td>{r.whyItMatters || r.impact || r.description}</td>
                          <td>
                            <span style={{ background: '#ecfdf5', color: '#047857', padding: '3px 8px', borderRadius: '4px', fontWeight: 700, fontSize: '0.78rem' }}>
                              {r.timeline || 'Phase 1'}
                            </span>
                          </td>
                          <td><strong>{r.effort || 'Medium'}</strong></td>
                        </tr>
                      ))}
                  </tbody>
                </SheetTable>
              )}
            </div>
          )}

          {/* 3. DOCS / WORD PREVIEW */}
          {activeDocType === 'docs' && (
            <DocumentPaper>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                <div>
                  <h1 style={{ margin: "0 0 6px 0" }}>ScoreX Executive Advisory Briefing</h1>
                  <span style={{ color: "#64748b", fontSize: "0.95rem" }}>
                    Google Cloud Enterprise Architecture & Modernization Strategy • {new Date().toLocaleDateString()}
                  </span>
                </div>
                <ActionButton 
                  onClick={() => {
                    navigator.clipboard.writeText(`ScoreX Executive Report for ${org}\nOverall Score: ${overallScore}/5.0\nTarget ROI: $2.3M - $4.2M`);
                    toast.success('📋 Executive summary copied to clipboard!');
                  }}
                  style={{ color: "#1e293b", borderColor: "#cbd5e1", background: "#f8fafc" }}
                >
                  <FiCopy /> Copy Text
                </ActionButton>
              </div>

              <div style={{ background: "#f8fafc", border: "1px solid #cbd5e1", padding: "16px 20px", borderRadius: "8px", margin: "20px 0" }}>
                <strong>Target Organization:</strong> {org}<br />
                <strong>Initiative:</strong> {framework?.title || 'Data & AI Architecture Modernization'}<br />
                <strong>Maturity Baseline:</strong> <span style={{ color: "#1d4ed8", fontWeight: 700 }}>{overallScore} / 5.0 ({maturityStage})</span><br />
                <strong>Projected 3-Yr ROI:</strong> <span style={{ color: "#047857", fontWeight: 700 }}>$2.3M - $4.2M (35-50% TCO Savings)</span>
              </div>

              <h2>1. Executive Summary & Strategic Rationale</h2>
              <p>
                This memorandum establishes the formal modernization strategy for <strong>{org}</strong> on Google Cloud Platform. 
                Based on diagnostic assessment across {dimensions.length} architectural dimensions, ScoreX has outlined prioritized migration 
                actions to eliminate operational debt, implement streaming CDC with Datastream, and orchestrate scalable agentic AI mesh topologies.
              </p>

              <h2>2. Architectural Dimension Scores</h2>
              <table style={{ width: "100%", borderCollapse: "collapse", margin: "16px 0", fontSize: "0.9rem" }}>
                <thead>
                  <tr style={{ background: "#0b132b", color: "#ffffff" }}>
                    <th style={{ padding: "8px 12px", textAlign: "left" }}>Pillar</th>
                    <th style={{ padding: "8px 12px", textAlign: "left" }}>Current Score</th>
                    <th style={{ padding: "8px 12px", textAlign: "left" }}>Target Horizon</th>
                  </tr>
                </thead>
                <tbody>
                  {dimensions.map((dim, idx) => (
                    <tr key={idx} style={{ borderBottom: "1px solid #cbd5e1", background: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                      <td style={{ padding: "8px 12px" }}><strong>{dim.name}</strong></td>
                      <td style={{ padding: "8px 12px", color: "#1d4ed8", fontWeight: 700 }}>{scores[dim.id] || scores[dim.name] || '2.8'} / 5.0</td>
                      <td style={{ padding: "8px 12px", color: "#047857", fontWeight: 700 }}>4.2+ / 5.0</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <h2>3. Priority Transformation Recommendations</h2>
              {recs.slice(0, 5).map((r, idx) => (
                <div key={idx} style={{ borderLeft: "4px solid #1d4ed8", padding: "8px 16px", margin: "12px 0", background: "#f8fafc" }}>
                  <strong>{idx + 1}. {r.title || r.recommendation}</strong><br />
                  <span style={{ fontSize: "0.9rem", color: "#64748b" }}>{r.whyItMatters || r.impact || r.description}</span><br />
                  <span style={{ fontSize: "0.82rem", color: "#047857", fontWeight: 700 }}>Timeline: {r.timeline || 'Phase 1 (Days 0-30)'}</span>
                </div>
              ))}
            </DocumentPaper>
          )}

          {/* 4. PDF REPORT PREVIEW */}
          {activeDocType === 'pdf' && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(30, 41, 59, 0.5)", padding: "10px 20px", borderRadius: "10px" }}>
                <span style={{ fontSize: "0.88rem", color: "#cbd5e1", fontWeight: 700 }}>
                  Executive PDF Report Layout
                </span>
                <ActionButton onClick={() => window.print()}>
                  <FiPrinter /> Print to PDF
                </ActionButton>
              </div>

              <DynamicRadarChart
                dimensions={framework?.dimensions || []}
                dimensionScores={scores || {}}
                responses={instance?.responses || {}}
              />

              <FinancialImpactCard
                pillarScores={scores || {}}
                framework={framework}
                overallCurrent={instance?.totalScore || 2.5}
                overallTarget={4.2}
              />
            </div>
          )}

          {/* 5. DRAW.IO ARCHITECTURE PREVIEW */}
          {activeDocType === 'drawio' && (
            <ArchitectureComparisonDiagram
              instanceId={instance?.id}
              initialDiagrams={report?.architectureDiagrams}
              currentScore={instance?.totalScore || 2.5}
              targetScore={4.5}
              customerName={org}
              useCase={instance?.useCase}
              framework={framework}
            />
          )}

          {/* 6. CSV MATRIX PREVIEW */}
          {activeDocType === 'csv' && (
            <SheetTable>
              <thead>
                <tr>
                  <th>DIMENSION</th>
                  <th>QUESTION ID</th>
                  <th>CURRENT RESPONSE</th>
                  <th>TARGET HORIZON</th>
                  <th>TECHNICAL PAIN</th>
                </tr>
              </thead>
              <tbody>
                {dimensions.flatMap(d => (d.questions || []).map((q, qIdx) => (
                  <tr key={`${d.id}-${q.id || qIdx}`}>
                    <td><strong>{d.name}</strong></td>
                    <td><code>{q.id}</code></td>
                    <td style={{ color: "#1d4ed8", fontWeight: 700 }}>{instance?.responses?.[q.id] || 'Not Answered'}</td>
                    <td style={{ color: "#047857", fontWeight: 700 }}>{instance?.responses?.[`${q.id}_future_state`] || 'N/A'}</td>
                    <td>{Array.isArray(instance?.responses?.[`${q.id}_technical_pain`]) ? instance?.responses?.[`${q.id}_technical_pain`].join(', ') : 'None logged'}</td>
                  </tr>
                )))}
              </tbody>
            </SheetTable>
          )}
        </PreviewBody>
      </FullscreenOverlay>
    </AnimatePresence>
  );
};

export default UnifiedDocumentPreviewModal;
