import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiLayers, 
  FiArrowRight, 
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
  FiExternalLink
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import toast from 'react-hot-toast';

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
  margin-bottom: 24px;
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

const DrawioBtn = styled.button`
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

const ComparisonGrid = styled.div`
  display: grid;
  grid-template-columns: ${props => props.$mode === 'both' ? '1fr 1fr' : '1fr'};
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

const TopologyVisualBox = styled.div`
  background: #0f172a;
  border-radius: 14px;
  padding: 24px;
  color: white;
  margin-bottom: 20px;
  overflow-x: auto;
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

const ArchitectureComparisonDiagram = ({ currentScore = 2.6, targetScore = 4.5 }) => {
  const [viewMode, setViewMode] = useState('both'); // 'both', 'topology', 'current', 'target'

  const currentLayers = [
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
      items: ['Separate Data Lakes + Relational Warehouses', 'Inconsistent ACLs across S3/GCS buckets', 'Manual metadata spreadsheets & no lineage']
    },
    {
      name: '3. Processing & Compute',
      tag: 'Runaway Cluster Spend',
      icon: <FiCpu />,
      items: ['Static over-provisioned Spark VMs', 'Lack of auto-termination / FinOps policies', 'Duplicate ETL pipeline transformations']
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
  ];

  const targetLayers = [
    {
      name: '1. Ingestion & Connectors',
      tag: 'Real-Time & Declarative',
      icon: <FiRepeat color="#10b981" />,
      items: ['Declarative Streaming Pipelines (SDF/dbt)', 'Automated Schema Evolution & CDC', 'Serverless Auto-Loader for S3/GCS/Kafka']
    },
    {
      name: '2. Storage & Governance',
      tag: 'Unified Unity Catalog Lakehouse',
      icon: <FiShield color="#10b981" />,
      items: ['Open Table Formats (Delta Lake / Iceberg UniForm)', 'Centralized Unity Catalog with Column/Row Masking', 'Automated End-to-End Lineage & Audit Trails']
    },
    {
      name: '3. Processing & Compute',
      tag: 'Serverless FinOps Engine',
      icon: <FiZap color="#10b981" />,
      items: ['Serverless Vectorized SQL Engine', 'Instant auto-suspend cluster kill-switches', 'Zero-copy sharing across cloud accounts']
    },
    {
      name: '4. AI & Machine Learning',
      tag: 'Continuous Production MLOps',
      icon: <FiCpu color="#10b981" />,
      items: ['Centralized MLflow Model & Prompt Registry', 'Automated CI/CD deployment pipelines', 'Real-time data quality & concept drift alerts']
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
  ];

  const generateDrawioXml = () => {
    return `<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="app.diagrams.net" modified="${new Date().toISOString()}" agent="ScoreX Enterprise Architecture Engine" version="24.0.0" type="device">
  <diagram id="scorex-arch" name="ScoreX Current vs Target Architecture">
    <mxGraphModel dx="1422" dy="800" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1600" pageHeight="900" background="#0f172a" math="0" shadow="0">
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />

        <!-- CURRENT STATE CONTAINER -->
        <mxCell id="cur_box" value="CURRENT LEGACY ARCHITECTURE (Maturity Level ${currentScore}/5)" style="swimlane;startSize=30;fillColor=#1e1b4b;strokeColor=#ef4444;strokeWidth=2;fontColor=#f87171;fontSize=13;fontStyle=1;rounded=1;" vertex="1" parent="1">
          <mxGeometry x="40" y="40" width="720" height="780" as="geometry" />
        </mxCell>
        <mxCell id="cur_1" value="1. Ingestion: Brittle Batch Scripts (Cron/SFTP)&#xa;• Point-to-point batch extracts&#xa;• High pipeline failure rate" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#311018;strokeColor=#f43f5e;fontColor=#fda4af;fontSize=11;align=left;spacingLeft=10;" vertex="1" parent="cur_box">
          <mxGeometry x="30" y="50" width="660" height="90" as="geometry" />
        </mxCell>
        <mxCell id="cur_2" value="2. Storage: Siloed Databases + Unmanaged S3/GCS&#xa;• Fragmented ACL permissions&#xa;• No centralized metadata or data lineage" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#311018;strokeColor=#f43f5e;fontColor=#fda4af;fontSize=11;align=left;spacingLeft=10;" vertex="1" parent="cur_box">
          <mxGeometry x="30" y="170" width="660" height="90" as="geometry" />
        </mxCell>
        <mxCell id="cur_3" value="3. Compute: Static VM Clusters &amp; Unmanaged Spark&#xa;• 24/7 idle cluster costs&#xa;• Manual capacity provisioning" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#311018;strokeColor=#f43f5e;fontColor=#fda4af;fontSize=11;align=left;spacingLeft=10;" vertex="1" parent="cur_box">
          <mxGeometry x="30" y="290" width="660" height="90" as="geometry" />
        </mxCell>
        <mxCell id="cur_4" value="4. AI &amp; MLOps: Siloed Notebooks&#xa;• No centralized model registry&#xa;• Manual deployment scripts &amp; drift blindspots" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#311018;strokeColor=#f43f5e;fontColor=#fda4af;fontSize=11;align=left;spacingLeft=10;" vertex="1" parent="cur_box">
          <mxGeometry x="30" y="410" width="660" height="90" as="geometry" />
        </mxCell>
        <mxCell id="cur_5" value="5. GenAI: Unguarded Public API Calls&#xa;• Full prompt token redundancy&#xa;• No PII redacting or CMEK perimeters" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#311018;strokeColor=#f43f5e;fontColor=#fda4af;fontSize=11;align=left;spacingLeft=10;" vertex="1" parent="cur_box">
          <mxGeometry x="30" y="530" width="660" height="90" as="geometry" />
        </mxCell>
        <mxCell id="cur_6" value="6. Serving: Heavy BI Backlog&#xa;• Stale daily data warehouse copies&#xa;• 14-day turnaround on custom analytics" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#311018;strokeColor=#f43f5e;fontColor=#fda4af;fontSize=11;align=left;spacingLeft=10;" vertex="1" parent="cur_box">
          <mxGeometry x="30" y="650" width="660" height="90" as="geometry" />
        </mxCell>

        <!-- TARGET STATE CONTAINER -->
        <mxCell id="tgt_box" value="TARGET MODERN LAKEHOUSE &amp; AGENT MESH (Target Level ${targetScore}/5)" style="swimlane;startSize=30;fillColor=#064e3b;strokeColor=#10b981;strokeWidth=2;fontColor=#6ee7b7;fontSize=13;fontStyle=1;rounded=1;" vertex="1" parent="1">
          <mxGeometry x="840" y="40" width="720" height="780" as="geometry" />
        </mxCell>
        <mxCell id="tgt_1" value="1. Declarative Real-Time Ingestion (CDC + Auto-Loader)&#xa;✓ Sub-second streaming data capture&#xa;✓ Automated schema evolution &amp; SDF pipelines" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#022c22;strokeColor=#10b981;fontColor=#a7f3d0;fontSize=11;align=left;spacingLeft=10;" vertex="1" parent="tgt_box">
          <mxGeometry x="30" y="50" width="660" height="90" as="geometry" />
        </mxCell>
        <mxCell id="tgt_2" value="2. Unified Unity Catalog Lakehouse &amp; UniForm&#xa;✓ Delta Lake / Iceberg open table formats&#xa;✓ Automated row/column masking &amp; end-to-end lineage" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#022c22;strokeColor=#10b981;fontColor=#a7f3d0;fontSize=11;align=left;spacingLeft=10;" vertex="1" parent="tgt_box">
          <mxGeometry x="30" y="170" width="660" height="90" as="geometry" />
        </mxCell>
        <mxCell id="tgt_3" value="3. Serverless Vectorized FinOps Engine&#xa;✓ Instant auto-suspend cluster switches (15 min)&#xa;✓ 35% to 50% compute TCO savings" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#022c22;strokeColor=#10b981;fontColor=#a7f3d0;fontSize=11;align=left;spacingLeft=10;" vertex="1" parent="tgt_box">
          <mxGeometry x="30" y="290" width="660" height="90" as="geometry" />
        </mxCell>
        <mxCell id="tgt_4" value="4. Production MLflow &amp; Prompt Registry&#xa;✓ Automated CI/CD model verification&#xa;✓ Real-time concept drift &amp; feature store" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#022c22;strokeColor=#10b981;fontColor=#a7f3d0;fontSize=11;align=left;spacingLeft=10;" vertex="1" parent="tgt_box">
          <mxGeometry x="30" y="410" width="660" height="90" as="geometry" />
        </mxCell>
        <mxCell id="tgt_5" value="5. Autonomous Multi-Agent Mesh &amp; MCP Protocol&#xa;✓ 75% prompt context caching discount&#xa;✓ Zero-trust AI guardrails &amp; VPC service perimeters" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#022c22;strokeColor=#10b981;fontColor=#a7f3d0;fontSize=11;align=left;spacingLeft=10;" vertex="1" parent="tgt_box">
          <mxGeometry x="30" y="530" width="660" height="90" as="geometry" />
        </mxCell>
        <mxCell id="tgt_6" value="6. Self-Service Unified Semantic Metric Layer&#xa;✓ Direct zero-copy BI queries&#xa;✓ Sub-second dashboard refresh speeds" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#022c22;strokeColor=#10b981;fontColor=#a7f3d0;fontSize=11;align=left;spacingLeft=10;" vertex="1" parent="tgt_box">
          <mxGeometry x="30" y="650" width="660" height="90" as="geometry" />
        </mxCell>
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>`;
  };

  const handleExportDrawio = () => {
    try {
      const xml = generateDrawioXml();
      const blob = new Blob([xml], { type: 'application/xml;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'ScoreX_Architecture_Current_vs_Target.drawio');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('Downloaded ScoreX Architecture .drawio XML diagram!');
    } catch (e) {
      console.error(e);
      toast.error('Failed to export Draw.io XML');
    }
  };

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
            <Title>Architectural Evolution Blueprint: Current vs. Target State</Title>
            <Subtitle>
              Side-by-side comparison and visual dataflow topology of your legacy stack vs modern Lakehouse & Agentic Mesh.
            </Subtitle>
          </div>
        </TitleBlock>

        <ActionGroup>
          <ViewToggle>
            <ViewBtn $active={viewMode === 'both'} onClick={() => setViewMode('both')}>
              <FiLayers /> Side-by-Side Cards
            </ViewBtn>
            <ViewBtn $active={viewMode === 'topology'} onClick={() => setViewMode('topology')}>
              <FiEye /> 🎨 Visual Topology Graph
            </ViewBtn>
            <ViewBtn $active={viewMode === 'current'} onClick={() => setViewMode('current')}>
              <FiAlertTriangle /> Current Only
            </ViewBtn>
            <ViewBtn $active={viewMode === 'target'} onClick={() => setViewMode('target')}>
              <FiCheckCircle /> Target Only
            </ViewBtn>
          </ViewToggle>

          <DrawioBtn onClick={handleExportDrawio} title="Download architecture diagram for Draw.io / diagrams.net">
            <FiDownload /> 📥 Export Draw.io XML
          </DrawioBtn>
        </ActionGroup>
      </Header>

      {/* 1. INTERACTIVE VISUAL TOPOLOGY GRAPH */}
      {viewMode === 'topology' && (
        <TopologyVisualBox>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #334155', paddingBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#38bdf8' }}>
                End-to-End Enterprise Data & AI Pipeline Topology
              </span>
              <span style={{ fontSize: '0.75rem', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '3px 8px', borderRadius: '6px', fontWeight: 700 }}>
                Interactive Dataflow
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Current State (Level {currentScore}) ➔ Target Modern Lakehouse (Level {targetScore})
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', position: 'relative' }}>
            {/* Step 1: Sources & Ingestion */}
            <div style={{ background: 'rgba(30, 41, 59, 0.8)', border: '1.5px solid #3b82f6', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#60a5fa' }}>1. INGESTION</span>
                <span style={{ fontSize: '0.7rem', color: '#f87171', background: 'rgba(239, 68, 68, 0.15)', padding: '2px 6px', borderRadius: '4px' }}>Cron Batch</span>
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>
                Streaming CDC & Auto-Loader
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                Sub-second data capture replacing brittle Python cron scripts.
              </div>
              <div style={{ marginTop: 'auto', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '6px', padding: '4px 8px', fontSize: '0.72rem', color: '#34d399', fontWeight: 600 }}>
                ✓ Zero pipeline lag
              </div>
            </div>

            {/* Step 2: Storage & Governance */}
            <div style={{ background: 'rgba(30, 41, 59, 0.8)', border: '1.5px solid #8b5cf6', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#a78bfa' }}>2. LAKEHOUSE</span>
                <span style={{ fontSize: '0.7rem', color: '#f87171', background: 'rgba(239, 68, 68, 0.15)', padding: '2px 6px', borderRadius: '4px' }}>Siloed Lakes</span>
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>
                Unity Catalog & UniForm
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                Delta Lake + Iceberg with row/column data governance.
              </div>
              <div style={{ marginTop: 'auto', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '6px', padding: '4px 8px', fontSize: '0.72rem', color: '#34d399', fontWeight: 600 }}>
                ✓ Single governance plane
              </div>
            </div>

            {/* Step 3: Compute */}
            <div style={{ background: 'rgba(30, 41, 59, 0.8)', border: '1.5px solid #10b981', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#34d399' }}>3. COMPUTE</span>
                <span style={{ fontSize: '0.7rem', color: '#f87171', background: 'rgba(239, 68, 68, 0.15)', padding: '2px 6px', borderRadius: '4px' }}>Static VMs</span>
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>
                Serverless FinOps Engine
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                Auto-terminating Photon compute with 15-minute kill switches.
              </div>
              <div style={{ marginTop: 'auto', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '6px', padding: '4px 8px', fontSize: '0.72rem', color: '#34d399', fontWeight: 600 }}>
                ✓ 35% compute savings
              </div>
            </div>

            {/* Step 4: AI & Agent Mesh */}
            <div style={{ background: 'rgba(30, 41, 59, 0.8)', border: '1.5px solid #f59e0b', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#fbbf24' }}>4. AGENT MESH</span>
                <span style={{ fontSize: '0.7rem', color: '#f87171', background: 'rgba(239, 68, 68, 0.15)', padding: '2px 6px', borderRadius: '4px' }}>Unguarded</span>
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>
                Multi-Agent (MCP) & Cache
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                Autonomous tool calling with 75% prompt context caching.
              </div>
              <div style={{ marginTop: 'auto', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '6px', padding: '4px 8px', fontSize: '0.72rem', color: '#34d399', fontWeight: 600 }}>
                ✓ Zero-Trust AI Guardrails
              </div>
            </div>

            {/* Step 5: BI & Analytics */}
            <div style={{ background: 'rgba(30, 41, 59, 0.8)', border: '1.5px solid #ec4899', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#f472b6' }}>5. SERVING</span>
                <span style={{ fontSize: '0.7rem', color: '#f87171', background: 'rgba(239, 68, 68, 0.15)', padding: '2px 6px', borderRadius: '4px' }}>SQL Backlog</span>
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>
                Semantic Metric Layer
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                Direct zero-copy BI queries with sub-second dashboard refreshes.
              </div>
              <div style={{ marginTop: 'auto', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '6px', padding: '4px 8px', fontSize: '0.72rem', color: '#34d399', fontWeight: 600 }}>
                ✓ Self-service analytics
              </div>
            </div>
          </div>
        </TopologyVisualBox>
      )}

      {/* 2. SIDE-BY-SIDE OR FOCUSED TIER CARDS */}
      {viewMode !== 'topology' && (
        <ComparisonGrid $mode={viewMode}>
          {/* CURRENT STATE */}
          {(viewMode === 'both' || viewMode === 'current') && (
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
          )}

          {/* TARGET STATE */}
          {(viewMode === 'both' || viewMode === 'target') && (
            <ArchColumn $isTarget={true}>
              <ColHeader $isTarget={true}>
                <div className="title-group">
                  <FiCheckCircle /> Target Modern Lakehouse & Agentic Mesh
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
          )}
        </ComparisonGrid>
      )}

      {/* Strategic Value Summary Banner */}
      <StrategicBenefitsFooter>
        <div className="callout">
          <HiSparkles size={20} />
          <span>Core Strategic Transformations Unlocked by Target Architecture:</span>
        </div>
        <div className="badges">
          <div className="benefit-badge">🔒 Unified Unity Catalog Governance</div>
          <div className="benefit-badge">⚡ Declarative Streaming Pipelines</div>
          <div className="benefit-badge">🤖 Guarded Autonomous Agent Mesh</div>
          <div className="benefit-badge">💰 75% GenAI Prompt Context Caching</div>
        </div>
      </StrategicBenefitsFooter>
    </DiagramContainer>
  );
};

export default ArchitectureComparisonDiagram;
