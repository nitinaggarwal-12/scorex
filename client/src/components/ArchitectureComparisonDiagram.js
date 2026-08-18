import React, { useState, useEffect, useRef } from 'react';
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

// DEFAULT BASELINE DRAW.IO XML
const DEFAULT_CURRENT_XML = `<mxGraphModel dx="1200" dy="800" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1400" pageHeight="850" background="#0f172a" math="0" shadow="0"><root><mxCell id="0"/><mxCell id="1" parent="0"/><mxCell id="title" value="&lt;b style=&quot;font-size:16px;color:#f87171;&quot;&gt;⚠️ CURRENT BASELINE ARCHITECTURE: FRAGMENTED &amp;amp; SILOED&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:11px;color:#94a3b8;&quot;&gt;Maturity Level: 2.6 (Developing) • Brittle Cron Batch • Data Silos • Static VM Costs • 14-day BI Backlog&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#1e1b4b;strokeColor=#ef4444;strokeWidth=2;fontColor=#ffffff;align=center;shadow=1;" vertex="1" parent="1"><mxGeometry x="40" y="20" width="1320" height="60" as="geometry"/></mxCell><mxCell id="stage1_box" value="&lt;b style=&quot;color:#f87171;font-size:12px;&quot;&gt;STAGE 1: INGESTION&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:9.5px;color:#cbd5e1;&quot;&gt;Brittle Batch &amp;amp; SFTP&lt;/span&gt;" style="swimlane;html=1;startSize=44;fillColor=#1e293b;strokeColor=#f43f5e;fontColor=#ffffff;fontSize=12;fontStyle=1;rounded=1;" vertex="1" parent="1"><mxGeometry x="40" y="100" width="280" height="660" as="geometry"/></mxCell><mxCell id="s1_card1" value="&lt;b style=&quot;color:#fda4af;font-size:12px;&quot;&gt;Legacy OLTP &amp;amp; Files&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:10px;color:#94a3b8;&quot;&gt;Postgres, MySQL, SFTP&lt;br&gt;Point-to-point unmanaged exports&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#311018;strokeColor=#f43f5e;fontColor=#ffffff;align=left;spacingLeft=10;" vertex="1" parent="stage1_box"><mxGeometry x="20" y="60" width="240" height="80" as="geometry"/></mxCell><mxCell id="s1_card2" value="&lt;b style=&quot;color:#fda4af;font-size:12px;&quot;&gt;Cron Batch Scripts&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:10px;color:#94a3b8;&quot;&gt;Python/Bash cron jobs&lt;br&gt;24-hour latency, no dead-letter queue&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#311018;strokeColor=#f43f5e;fontColor=#ffffff;align=left;spacingLeft=10;" vertex="1" parent="stage1_box"><mxGeometry x="20" y="160" width="240" height="80" as="geometry"/></mxCell><mxCell id="s1_warn" value="&lt;b style=&quot;color:#ef4444;&quot;&gt;⚠️ 38% Failure Rate&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:9.5px;color:#fca5a5;&quot;&gt;Silent schema breakages halt nightly ETL runs&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#450a0a;strokeColor=#ef4444;fontColor=#ffffff;align=center;" vertex="1" parent="stage1_box"><mxGeometry x="20" y="260" width="240" height="60" as="geometry"/></mxCell><mxCell id="stage2_box" value="&lt;b style=&quot;color:#f87171;font-size:12px;&quot;&gt;STAGE 2: DATA SILOS&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:9.5px;color:#cbd5e1;&quot;&gt;Split Warehouse + Lakes&lt;/span&gt;" style="swimlane;html=1;startSize=44;fillColor=#1e293b;strokeColor=#f43f5e;fontColor=#ffffff;fontSize=12;fontStyle=1;rounded=1;" vertex="1" parent="1"><mxGeometry x="380" y="100" width="280" height="660" as="geometry"/></mxCell><mxCell id="s2_card1" value="&lt;b style=&quot;color:#fda4af;font-size:12px;&quot;&gt;Unmanaged S3/GCS&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:10px;color:#94a3b8;&quot;&gt;Raw CSV / JSON dumps&lt;br&gt;Fragmented bucket ACLs, no lineage&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#311018;strokeColor=#f43f5e;fontColor=#ffffff;align=left;spacingLeft=10;" vertex="1" parent="stage2_box"><mxGeometry x="20" y="60" width="240" height="80" as="geometry"/></mxCell><mxCell id="s2_card2" value="&lt;b style=&quot;color:#fda4af;font-size:12px;&quot;&gt;Isolated Data Warehouse&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:10px;color:#94a3b8;&quot;&gt;Proprietary SQL Warehouse&lt;br&gt;Duplicate data copies &amp;amp; sync lag&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#311018;strokeColor=#f43f5e;fontColor=#ffffff;align=left;spacingLeft=10;" vertex="1" parent="stage2_box"><mxGeometry x="20" y="160" width="240" height="80" as="geometry"/></mxCell><mxCell id="s2_warn" value="&lt;b style=&quot;color:#ef4444;&quot;&gt;⚠️ Manual IAM Spreadsheets&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:9.5px;color:#fca5a5;&quot;&gt;No automated row/column masking&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#450a0a;strokeColor=#ef4444;fontColor=#ffffff;align=center;" vertex="1" parent="stage2_box"><mxGeometry x="20" y="260" width="240" height="60" as="geometry"/></mxCell><mxCell id="stage3_box" value="&lt;b style=&quot;color:#f87171;font-size:12px;&quot;&gt;STAGE 3: COMPUTE &amp;amp; MLOps&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:9.5px;color:#cbd5e1;&quot;&gt;Over-Provisioned Clusters&lt;/span&gt;" style="swimlane;html=1;startSize=44;fillColor=#1e293b;strokeColor=#f43f5e;fontColor=#ffffff;fontSize=12;fontStyle=1;rounded=1;" vertex="1" parent="1"><mxGeometry x="720" y="100" width="280" height="660" as="geometry"/></mxCell><mxCell id="s3_card1" value="&lt;b style=&quot;color:#fda4af;font-size:12px;&quot;&gt;Static 24/7 Spark VMs&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:10px;color:#94a3b8;&quot;&gt;Always-on oversized clusters&lt;br&gt;Lack of automated auto-termination&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#311018;strokeColor=#f43f5e;fontColor=#ffffff;align=left;spacingLeft=10;" vertex="1" parent="stage3_box"><mxGeometry x="20" y="60" width="240" height="80" as="geometry"/></mxCell><mxCell id="s3_card2" value="&lt;b style=&quot;color:#fda4af;font-size:12px;&quot;&gt;Disconnected Notebooks&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:10px;color:#94a3b8;&quot;&gt;Ad-hoc local Jupyter environments&lt;br&gt;No centralized model registry&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#311018;strokeColor=#f43f5e;fontColor=#ffffff;align=left;spacingLeft=10;" vertex="1" parent="stage3_box"><mxGeometry x="20" y="160" width="240" height="80" as="geometry"/></mxCell><mxCell id="s3_warn" value="&lt;b style=&quot;color:#ef4444;&quot;&gt;⚠️ $480k Annual Idle Waste&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:9.5px;color:#fca5a5;&quot;&gt;Zero cluster FinOps kill switches&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#450a0a;strokeColor=#ef4444;fontColor=#ffffff;align=center;" vertex="1" parent="stage3_box"><mxGeometry x="20" y="260" width="240" height="60" as="geometry"/></mxCell><mxCell id="stage4_box" value="&lt;b style=&quot;color:#f87171;font-size:12px;&quot;&gt;STAGE 4: SERVING &amp;amp; BI&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:9.5px;color:#cbd5e1;&quot;&gt;Unguarded LLMs &amp;amp; Heavy Backlog&lt;/span&gt;" style="swimlane;html=1;startSize=44;fillColor=#1e293b;strokeColor=#f43f5e;fontColor=#ffffff;fontSize=12;fontStyle=1;rounded=1;" vertex="1" parent="1"><mxGeometry x="1060" y="100" width="300" height="660" as="geometry"/></mxCell><mxCell id="s4_card1" value="&lt;b style=&quot;color:#fda4af;font-size:12px;&quot;&gt;Direct Unguarded LLM APIs&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:10px;color:#94a3b8;&quot;&gt;No prompt caching (100% token spend)&lt;br&gt;No enterprise PII filters or guardrails&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#311018;strokeColor=#f43f5e;fontColor=#ffffff;align=left;spacingLeft=10;" vertex="1" parent="stage4_box"><mxGeometry x="20" y="60" width="260" height="80" as="geometry"/></mxCell><mxCell id="s4_card2" value="&lt;b style=&quot;color:#fda4af;font-size:12px;&quot;&gt;Stale Daily BI Extracts&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:10px;color:#94a3b8;&quot;&gt;Slow queries over legacy schemas&lt;br&gt;14-day turnaround on custom metrics&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#311018;strokeColor=#f43f5e;fontColor=#ffffff;align=left;spacingLeft=10;" vertex="1" parent="stage4_box"><mxGeometry x="20" y="160" width="260" height="80" as="geometry"/></mxCell><mxCell id="s4_warn" value="&lt;b style=&quot;color:#ef4444;&quot;&gt;⚠️ 14-Day Delivery Lag&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:9.5px;color:#fca5a5;&quot;&gt;Analyst team overwhelmed by custom SQL&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#450a0a;strokeColor=#ef4444;fontColor=#ffffff;align=center;" vertex="1" parent="stage4_box"><mxGeometry x="20" y="260" width="260" height="60" as="geometry"/></mxCell><mxCell id="flow1" value="Nightly Batch (24h)" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;strokeWidth=2;strokeColor=#ef4444;dashed=1;fontColor=#fca5a5;fontSize=10;" edge="1" parent="1" source="s1_card2" target="s2_card1"><mxGeometry relative="1" as="geometry"/></mxCell><mxCell id="flow2" value="ETL Extract" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;strokeWidth=2;strokeColor=#ef4444;dashed=1;fontColor=#fca5a5;fontSize=10;" edge="1" parent="1" source="s2_card2" target="s3_card1"><mxGeometry relative="1" as="geometry"/></mxCell><mxCell id="flow3" value="Ad-hoc SQL" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;strokeWidth=2;strokeColor=#ef4444;dashed=1;fontColor=#fca5a5;fontSize=10;" edge="1" parent="1" source="s3_card1" target="s4_card2"><mxGeometry relative="1" as="geometry"/></mxCell></root></mxGraphModel>`;

// DEFAULT TARGET STATE DRAW.IO XML
// DEFAULT TARGET STATE DRAW.IO XML
const DEFAULT_TARGET_XML = `<mxGraphModel dx="1200" dy="800" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1400" pageHeight="850" background="#0f172a" math="0" shadow="0"><root><mxCell id="0"/><mxCell id="1" parent="0"/><mxCell id="title" value="&lt;b style=&quot;font-size:16px;color:#34d399;&quot;&gt;✨ DESIRED FUTURE STATE ARCHITECTURE: MODERN OPEN LAKEHOUSE &amp;amp; AGENTIC MESH&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:11px;color:#94a3b8;&quot;&gt;Target Maturity: Level 4.5 (Optimized) • Sub-Second Streaming • Open Table Formats (Apache Iceberg) • Serverless FinOps • MCP Agent Mesh&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#064e3b;strokeColor=#10b981;strokeWidth=2;fontColor=#ffffff;align=center;shadow=1;" vertex="1" parent="1"><mxGeometry x="40" y="20" width="1320" height="60" as="geometry"/></mxCell><mxCell id="stage1_box" value="&lt;b style=&quot;color:#34d399;font-size:12px;&quot;&gt;STAGE 1: REAL-TIME INGESTION&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:9.5px;color:#cbd5e1;&quot;&gt;Declarative Streaming &amp;amp; CDC&lt;/span&gt;" style="swimlane;html=1;startSize=44;fillColor=#022c22;strokeColor=#10b981;fontColor=#ffffff;fontSize=12;fontStyle=1;rounded=1;" vertex="1" parent="1"><mxGeometry x="40" y="100" width="280" height="660" as="geometry"/></mxCell><mxCell id="s1_card1" value="&lt;b style=&quot;color:#6ee7b7;font-size:12px;&quot;&gt;Multi-Source Event Streams&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:10px;color:#cbd5e1;&quot;&gt;Kafka, Kinesis, Google Pub/Sub&lt;br&gt;Sub-second real-time event capture&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#064e3b;strokeColor=#10b981;fontColor=#ffffff;align=left;spacingLeft=10;" vertex="1" parent="stage1_box"><mxGeometry x="20" y="60" width="240" height="80" as="geometry"/></mxCell><mxCell id="s1_card2" value="&lt;b style=&quot;color:#6ee7b7;font-size:12px;&quot;&gt;Serverless Auto-Loader / CDC&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:10px;color:#cbd5e1;&quot;&gt;Automated schema evolution&lt;br&gt;Declarative data transformations&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#064e3b;strokeColor=#10b981;fontColor=#ffffff;align=left;spacingLeft=10;" vertex="1" parent="stage1_box"><mxGeometry x="20" y="160" width="240" height="80" as="geometry"/></mxCell><mxCell id="s1_val" value="&lt;b style=&quot;color:#10b981;&quot;&gt;✓ Zero Ingestion Latency&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:9.5px;color:#a7f3d0;&quot;&gt;Automated retry &amp;amp; dead-letter isolation&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#065f46;strokeColor=#10b981;fontColor=#ffffff;align=center;" vertex="1" parent="stage1_box"><mxGeometry x="20" y="260" width="240" height="60" as="geometry"/></mxCell><mxCell id="stage2_box" value="&lt;b style=&quot;color:#34d399;font-size:12px;&quot;&gt;STAGE 2: OPEN LAKEHOUSE&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:9.5px;color:#cbd5e1;&quot;&gt;Apache Iceberg &amp;amp; Open Catalog&lt;/span&gt;" style="swimlane;html=1;startSize=44;fillColor=#022c22;strokeColor=#10b981;fontColor=#ffffff;fontSize=12;fontStyle=1;rounded=1;" vertex="1" parent="1"><mxGeometry x="380" y="100" width="280" height="660" as="geometry"/></mxCell><mxCell id="s2_card1" value="&lt;b style=&quot;color:#6ee7b7;font-size:12px;&quot;&gt;Open Table Formats&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:10px;color:#cbd5e1;&quot;&gt;Apache Iceberg / Delta Lake&lt;br&gt;Single source of truth, zero lock-in&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#064e3b;strokeColor=#10b981;fontColor=#ffffff;align=left;spacingLeft=10;" vertex="1" parent="stage2_box"><mxGeometry x="20" y="60" width="240" height="80" as="geometry"/></mxCell><mxCell id="s2_card2" value="&lt;b style=&quot;color:#6ee7b7;font-size:12px;&quot;&gt;Centralized Metadata &amp;amp; Governance&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:10px;color:#cbd5e1;&quot;&gt;Row/column dynamic masking&lt;br&gt;Automated end-to-end audit lineage&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#064e3b;strokeColor=#10b981;fontColor=#ffffff;align=left;spacingLeft=10;" vertex="1" parent="stage2_box"><mxGeometry x="20" y="160" width="240" height="80" as="geometry"/></mxCell><mxCell id="s2_val" value="&lt;b style=&quot;color:#10b981;&quot;&gt;✓ Unified Governance Plane&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:9.5px;color:#a7f3d0;&quot;&gt;Cross-cloud zero-copy data sharing&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#065f46;strokeColor=#10b981;fontColor=#ffffff;align=center;" vertex="1" parent="stage2_box"><mxGeometry x="20" y="260" width="240" height="60" as="geometry"/></mxCell><mxCell id="stage3_box" value="&lt;b style=&quot;color:#34d399;font-size:12px;&quot;&gt;STAGE 3: FINOPS &amp;amp; MLOps&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:9.5px;color:#cbd5e1;&quot;&gt;Autoscaling Serverless Compute&lt;/span&gt;" style="swimlane;html=1;startSize=44;fillColor=#022c22;strokeColor=#10b981;fontColor=#ffffff;fontSize=12;fontStyle=1;rounded=1;" vertex="1" parent="1"><mxGeometry x="720" y="100" width="280" height="660" as="geometry"/></mxCell><mxCell id="s3_card1" value="&lt;b style=&quot;color:#6ee7b7;font-size:12px;&quot;&gt;Serverless Vectorized SQL&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:10px;color:#cbd5e1;&quot;&gt;Instant 15-min auto-suspend switches&lt;br&gt;35% to 50% compute TCO savings&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#064e3b;strokeColor=#10b981;fontColor=#ffffff;align=left;spacingLeft=10;" vertex="1" parent="stage3_box"><mxGeometry x="20" y="60" width="240" height="80" as="geometry"/></mxCell><mxCell id="s3_card2" value="&lt;b style=&quot;color:#6ee7b7;font-size:12px;&quot;&gt;Production MLOps Registry&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:10px;color:#cbd5e1;&quot;&gt;Automated CI/CD model verification&lt;br&gt;Real-time concept drift &amp;amp; feature store&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#064e3b;strokeColor=#10b981;fontColor=#ffffff;align=left;spacingLeft=10;" vertex="1" parent="stage3_box"><mxGeometry x="20" y="160" width="240" height="80" as="geometry"/></mxCell><mxCell id="s3_val" value="&lt;b style=&quot;color:#10b981;&quot;&gt;✓ Automated FinOps &amp;amp; CI/CD&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:9.5px;color:#a7f3d0;&quot;&gt;Zero idle spend &amp;amp; fully tracked models&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#065f46;strokeColor=#10b981;fontColor=#ffffff;align=center;" vertex="1" parent="stage3_box"><mxGeometry x="20" y="260" width="240" height="60" as="geometry"/></mxCell><mxCell id="stage4_box" value="&lt;b style=&quot;color:#34d399;font-size:12px;&quot;&gt;STAGE 4: AI MESH &amp;amp; BI&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:9.5px;color:#cbd5e1;&quot;&gt;MCP Protocol &amp;amp; Semantic Layer&lt;/span&gt;" style="swimlane;html=1;startSize=44;fillColor=#022c22;strokeColor=#10b981;fontColor=#ffffff;fontSize=12;fontStyle=1;rounded=1;" vertex="1" parent="1"><mxGeometry x="1060" y="100" width="300" height="660" as="geometry"/></mxCell><mxCell id="s4_card1" value="&lt;b style=&quot;color:#6ee7b7;font-size:12px;&quot;&gt;Compound Multi-Agent Mesh&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:10px;color:#cbd5e1;&quot;&gt;MCP protocol &amp;amp; 75% prompt context caching&lt;br&gt;Zero-Trust AI guardrails &amp;amp; CMEK isolation&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#064e3b;strokeColor=#10b981;fontColor=#ffffff;align=left;spacingLeft=10;" vertex="1" parent="stage4_box"><mxGeometry x="20" y="60" width="260" height="80" as="geometry"/></mxCell><mxCell id="s4_card2" value="&lt;b style=&quot;color:#6ee7b7;font-size:12px;&quot;&gt;Self-Service Semantic BI Layer&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:10px;color:#cbd5e1;&quot;&gt;Direct zero-copy BI queries&lt;br&gt;Sub-second dashboard refresh speeds&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#064e3b;strokeColor=#10b981;fontColor=#ffffff;align=left;spacingLeft=10;" vertex="1" parent="stage4_box"><mxGeometry x="20" y="160" width="260" height="80" as="geometry"/></mxCell><mxCell id="s4_val" value="&lt;b style=&quot;color:#10b981;&quot;&gt;✓ Real-Time Self-Service&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:9.5px;color:#a7f3d0;&quot;&gt;Instant answers for BI &amp;amp; autonomous agents&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#065f46;strokeColor=#10b981;fontColor=#ffffff;align=center;" vertex="1" parent="stage4_box"><mxGeometry x="20" y="260" width="260" height="60" as="geometry"/></mxCell><mxCell id="flow1" value="Streaming CDC" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;strokeWidth=2.5;strokeColor=#10b981;fontColor=#6ee7b7;fontSize=10;" edge="1" parent="1" source="s1_card2" target="s2_card1"><mxGeometry relative="1" as="geometry"/></mxCell><mxCell id="flow2" value="Zero-Copy Engine" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;strokeWidth=2.5;strokeColor=#10b981;fontColor=#6ee7b7;fontSize=10;" edge="1" parent="1" source="s2_card2" target="s3_card1"><mxGeometry relative="1" as="geometry"/></mxCell><mxCell id="flow3" value="MCP Autonomous Mesh" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;strokeWidth=2.5;strokeColor=#10b981;fontColor=#6ee7b7;fontSize=10;" edge="1" parent="1" source="s3_card1" target="s4_card1"><mxGeometry relative="1" as="geometry"/></mxCell></root></mxGraphModel>`;

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
            The graph canvas encountered a parsing anomaly. You can trigger an instant AI auto-heal regeneration with Gemini 3.7 Flash.
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
    id: 'gcp_data_lakehouse',
    name: 'Enterprise Data Lakehouse',
    domain: 'Data & Analytics',
    tier: 'Logical / Lakehouse',
    badge: 'BigLake & BigQuery',
    description: 'Cloud Storage BigLake tiers, serverless BigQuery SQL, Dataplex ABAC governance, and Looker semantic BI.',
    title: 'Google Cloud Enterprise Data Lakehouse',
    subtitle: 'BigLake + BigQuery + Dataplex + Looker'
  },
  {
    id: 'agentic_rag_cognitive',
    name: 'Cognitive Multi-Agent RAG Mesh',
    domain: 'AI & Machine Learning',
    tier: 'Logical / Cognitive',
    badge: 'Gemini 3.7 & Model Armor',
    description: 'Multi-agent orchestration loops, Vertex AI Gemini 3.7 Flash reasoning, context caching, and vector embedding store.',
    title: 'Enterprise Cognitive AI Architecture',
    subtitle: 'Vertex AI Gemini 3.7 Flash + Multi-Agent Orchestration'
  },
  {
    id: 'cloud_finops_chargeback',
    name: 'Cloud FinOps & Cost Chargeback',
    domain: 'Cloud Economics',
    tier: 'Logical / FinOps',
    badge: 'BigQuery Billing Lake',
    description: 'GCP Billing export lake, Kubecost pod allocation, Looker BU chargeback dashboards, and CUD commitment manager.',
    title: 'Enterprise Cloud FinOps & Chargeback Engine',
    subtitle: 'Real-time Billing Telemetry + Automated Cost Optimization'
  },
  {
    id: 'zero_trust_security',
    name: 'Zero-Trust Security & Deployment',
    domain: 'Security & DevSecOps',
    tier: 'Physical / Security',
    badge: 'VPC-SC & Binary Auth',
    description: 'Cloud Armor WAF, Identity-Aware Proxy, VPC Service Controls, Artifact Registry, and Binary Authorization CI/CD gates.',
    title: 'Zero-Trust Cloud Security & Software Supply Chain',
    subtitle: 'Cloud Armor + VPC-SC + Binary Authorization'
  },
  {
    id: 'multi_region_dr',
    name: 'Multi-Region Active-Passive DR',
    domain: 'Cloud Reliability & SRE',
    tier: 'Physical / SRE',
    badge: 'Global Anycast L7 LB',
    description: 'Global HTTPS Load Balancer, Cloud Run pilot light compute, Cloud SQL cross-region async replication (<5min lag).',
    title: 'Multi-Region Active-Passive Disaster Recovery',
    subtitle: 'Global L7 Load Balancing + Automated SRE Failover'
  },
  {
    id: 'hybrid_strangler_fig',
    name: 'Hybrid / Strangler Fig Transition',
    domain: 'Application Migration',
    tier: 'Logical / Migration',
    badge: 'Apigee Interceptor',
    description: 'Apigee API Gateway facade routing legacy traffic over Cloud Interconnect and modern features to GKE/Cloud Run.',
    title: 'Hybrid Cloud Strangler Fig Transition Architecture',
    subtitle: 'Apigee Traffic Interception + Cloud Interconnect'
  }
];

const ArchitectureComparisonDiagram = ({ 
  instanceId,
  initialDiagrams,
  currentScore = 2.6, 
  targetScore = 4.5,
  customerName = 'Enterprise Client',
  useCase = 'Platform Modernization',
  framework = {}
}) => {
  const [viewMode, setViewMode] = useState('side_by_side'); // 'side_by_side', 'current_diagram', 'target_diagram', 'cards'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isXmlEditorOpen, setIsXmlEditorOpen] = useState(false);
  const [isVisualDrawioOpen, setIsVisualDrawioOpen] = useState(false);
  const [xmlTargetState, setXmlTargetState] = useState('target'); // 'current' | 'target'
  const [rawXmlDraft, setRawXmlDraft] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [diagramsData, setDiagramsData] = useState(initialDiagrams || null);
  const [versionHistory, setVersionHistory] = useState([
    { id: 'v1.0', version: 'v1.0', label: 'Initial AI Synthesis', timestamp: new Date().toLocaleTimeString(), target: 'target' }
  ]);
  const [reviewerNotes, setReviewerNotes] = useState([]);
  const [noteText, setNoteText] = useState('');
  const [showNotesDrawer, setShowNotesDrawer] = useState(false);
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
            : (diagramsData?.targetStateXml || targetXml);

          if (drawioIframeRef.current && drawioIframeRef.current.contentWindow) {
            drawioIframeRef.current.contentWindow.postMessage(JSON.stringify({
              action: 'load',
              autosave: 1,
              xml: sanitizeDrawioXmlAttributes(xmlToSend),
              title: `ScoreX ${xmlTargetState === 'current' ? 'Current Baseline' : 'Target Future'} Architecture`
            }), '*');
          }
        } else if (msg.event === 'save' || msg.event === 'autosave') {
          if (msg.xml) {
            const nextVerNum = (versionHistory.length + 1);
            const newVer = `v1.${nextVerNum}`;
            
            setDiagramsData(prev => ({
              ...prev,
              [xmlTargetState === 'current' ? 'currentStateXml' : 'targetStateXml']: msg.xml,
              generatedAt: new Date().toISOString()
            }));

            setVersionHistory(prev => [
              {
                id: newVer,
                version: newVer,
                label: `Visual Draw.io Edit (${xmlTargetState === 'current' ? 'Current' : 'Target'})`,
                timestamp: new Date().toLocaleTimeString(),
                target: xmlTargetState
              },
              ...prev
            ]);

            toast.success(`💾 Saved changes to ${xmlTargetState === 'current' ? 'Current' : 'Target'} Architecture (${newVer})!`, { icon: '🎨' });
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
  }, [xmlTargetState, diagramsData, versionHistory]);

  const handleOpenXmlEditor = (target = 'target') => {
    setXmlTargetState(target);
    const xmlToEdit = target === 'current' 
      ? (diagramsData?.currentStateXml || currentXml)
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
    
    setDiagramsData(prev => ({
      ...prev,
      [xmlTargetState === 'current' ? 'currentStateXml' : 'targetStateXml']: rawXmlDraft,
      generatedAt: new Date().toISOString()
    }));

    setVersionHistory(prev => [
      {
        id: newVer,
        version: newVer,
        label: `Raw XML Tweak (${xmlTargetState === 'current' ? 'Current' : 'Target'})`,
        timestamp: new Date().toLocaleTimeString(),
        target: xmlTargetState
      },
      ...prev
    ]);

    setIsXmlEditorOpen(false);
    toast.success(`✅ Applied custom manual XML edits (${newVer})!`);
  };

  useEffect(() => {
    if (initialDiagrams) {
      setDiagramsData(initialDiagrams);
    }
  }, [initialDiagrams]);

  const currentXml = diagramsData?.currentStateXml || DEFAULT_CURRENT_XML;
  const targetXml = diagramsData?.targetStateXml || DEFAULT_TARGET_XML;
  const currentTitle = diagramsData?.currentTitle || 'Current Baseline Architecture';
  const currentSubtitle = diagramsData?.currentSubtitle || `Level ${currentScore} Developing`;
  const targetTitle = diagramsData?.targetTitle || 'Desired Future State Architecture';
  const targetSubtitle = diagramsData?.targetSubtitle || `Level ${targetScore} Optimized`;
  const modelUsed = diagramsData?.modelUsed || 'gemini-3.7-flash';

  const handleRegenerate = async () => {
    if (!instanceId) {
      toast.error('Instance ID required for Gemini generation');
      return;
    }

    setIsGenerating(true);
    const toastId = toast.loading('Calling Gemini 3.7 Flash API to generate bespoke architecture diagrams...');

    try {
      const res = await dynamicAssessmentService.generateArchitectureDiagrams(instanceId, customPrompt);
      if (res.success && res.diagrams) {
        setDiagramsData(res.diagrams);
        toast.success(`✨ Architecture diagrams regenerated with ${res.diagrams.modelUsed || 'Gemini 3.7 Flash'}!`, { id: toastId });
        setIsModalOpen(false);
        setCustomPrompt('');
      } else {
        throw new Error(res.error || 'Generation failed');
      }
    } catch (err) {
      console.error('Failed to generate diagrams with Gemini:', err);
      toast.error(err.message || 'Failed to generate architecture diagrams', { id: toastId });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectTemplate = (tpl) => {
    setDiagramsData(prev => ({
      ...prev,
      targetTitle: tpl.title,
      targetSubtitle: tpl.subtitle,
      targetStateXml: prev?.targetStateXml || DEFAULT_TARGET_XML
    }));
    setIsTemplateModalOpen(false);
    toast.success(`Applied "${tpl.name}" architecture blueprint!`);
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
    const mermaidCode = isTarget
      ? `flowchart LR
    subgraph Ingestion["Ingestion & CDC"]
      A[Cloud Pub/Sub] --> B[Dataflow Beam]
      C[Storage Transfer] --> D[Cloud Storage]
    end
    subgraph Core["Core Lakehouse & AI"]
      D --> E[BigLake Iceberg]
      B --> F[BigQuery SQL]
      E --> F
      F --> G[Vertex AI Gemini 3.7]
    end
    subgraph Serving["Governance & Serving"]
      G --> H[Looker Studio BI]
      F --> I[Dataplex Governance]
    end`
      : `flowchart LR
    subgraph Legacy["On-Prem Legacy"]
      A[Oracle/Netezza] --> B[Cron Batch ETL]
      B --> C[SFTP Scripts]
      C --> D[Cognos Reports]
    end`;

    try {
      await navigator.clipboard.writeText(mermaidCode);
      toast.success('📋 Mermaid diagram syntax copied to clipboard!');
    } catch (e) {
      toast.error('Failed to copy Mermaid syntax');
    }
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    setReviewerNotes(prev => [...prev, { id: Date.now(), text: noteText.trim(), timestamp: new Date().toLocaleTimeString() }]);
    setNoteText('');
    toast.success('📝 Reviewer note pinned to architecture diagram');
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
  ];

  const targetLayers = [
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
  ];

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
              Architectural Evolution Blueprint: Current vs. Desired Future State
              <GeminiBadge>
                <SiGooglecloud /> {modelUsed.toUpperCase()}
              </GeminiBadge>
            </Title>
            <Subtitle>
              Bespoke visual architecture diagrams generated by Gemini 3.7 Flash comparing your baseline legacy stack against the target modern Lakehouse & Agentic Mesh.
            </Subtitle>
          </div>
        </TitleBlock>

        <ActionGroup>
          <ViewToggle>
            <ViewBtn 
              $active={viewMode === 'side_by_side'} 
              onClick={() => setViewMode('side_by_side')}
            >
              <FiEye /> 🔀 Side-by-Side Visuals
            </ViewBtn>
            <ViewBtn 
              $active={viewMode === 'current_diagram'} 
              onClick={() => setViewMode('current_diagram')}
            >
              <FiAlertTriangle /> ⚠️ Current State Diagram
            </ViewBtn>
            <ViewBtn 
              $active={viewMode === 'target_diagram'} 
              onClick={() => setViewMode('target_diagram')}
            >
              <FiCheckCircle /> ✨ Desired Future State Diagram
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
            onClick={() => handleCopyXml(viewMode === 'current_diagram' ? currentXml : targetXml)}
            style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#334155', padding: '7px 12px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
            title="Copy raw Draw.io XML to clipboard"
          >
            📋 Copy XML
          </button>

          <button
            onClick={() => handleCopyMermaid(viewMode === 'target_diagram' || viewMode === 'side_by_side')}
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
            title="Generate bespoke architecture diagrams using Gemini 3.7 Flash"
          >
            <FiRefreshCw className={isGenerating ? 'spin' : ''} /> 
            {isGenerating ? 'Synthesizing...' : '⚡ Regenerate with Gemini 3.7'}
          </RegenerateBtn>

          <button
            onClick={() => handleOpenVisualDrawio(viewMode === 'current_diagram' ? 'current' : 'target')}
            style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', border: 'none', color: '#ffffff', padding: '7px 14px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', boxShadow: '0 2px 8px rgba(2, 132, 199, 0.3)' }}
            title="Open full-featured interactive Draw.io visual canvas inside ScoreX"
          >
            🎨 Visual Draw.io Editor
          </button>

          <button
            onClick={() => handleOpenXmlEditor(viewMode === 'current_diagram' ? 'current' : 'target')}
            style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#334155', padding: '7px 12px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
            title="Edit or paste raw Draw.io XML code directly into the diagram canvas"
          >
            ✏️ Edit XML / Tweak
          </button>

          <ExportBtn 
            onClick={() => handleExportDrawio(
              viewMode === 'current_diagram' ? currentXml : targetXml,
              viewMode === 'current_diagram' ? 'ScoreX_Current_State_Architecture.drawio' : 'ScoreX_Desired_Future_State_Architecture.drawio'
            )}
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

      {/* 1. SIDE-BY-SIDE DUAL DIAGRAM VIEWPORT */}
      {viewMode === 'side_by_side' && (
        <DualDiagramGrid>
          <div>
            <DiagramErrorBoundary onAutoHeal={handleRegenerate}>
              <DiagramViewer
                xml={currentXml}
                title={currentTitle}
                subtitle={currentSubtitle}
                badge="Current State"
                theme="dark"
                height="480px"
                isTarget={false}
              />
            </DiagramErrorBoundary>
          </div>
          <div>
            <DiagramErrorBoundary onAutoHeal={handleRegenerate}>
              <DiagramViewer
                xml={targetXml}
                title={targetTitle}
                subtitle={targetSubtitle}
                badge="Desired Future State"
                theme="dark"
                height="480px"
                isTarget={true}
              />
            </DiagramErrorBoundary>
          </div>
        </DualDiagramGrid>
      )}

      {/* 2. FULL-WIDTH CURRENT STATE DIAGRAM */}
      {viewMode === 'current_diagram' && (
        <div style={{ marginBottom: '20px' }}>
          <DiagramErrorBoundary onAutoHeal={handleRegenerate}>
            <DiagramViewer
              xml={currentXml}
              title={currentTitle}
              subtitle={currentSubtitle}
              badge="Current State"
              theme="dark"
              height="650px"
              isTarget={false}
            />
          </DiagramErrorBoundary>
        </div>
      )}

      {/* 3. FULL-WIDTH DESIRED FUTURE STATE DIAGRAM */}
      {viewMode === 'target_diagram' && (
        <div style={{ marginBottom: '20px' }}>
          <DiagramErrorBoundary onAutoHeal={handleRegenerate}>
            <DiagramViewer
              xml={targetXml}
              title={targetTitle}
              subtitle={targetSubtitle}
              badge="Desired Future State"
              theme="dark"
              height="650px"
              isTarget={true}
            />
          </DiagramErrorBoundary>
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
            {diagramsData?.keyTransformations ? 'Key Architectural Modernization Shifts Identified by Gemini 3.7 Flash:' : 'Core Strategic Transformations Unlocked by Desired Future State Architecture:'}
          </span>
        </div>
        <div className="badges">
          {diagramsData?.keyTransformations ? (
            diagramsData.keyTransformations.map((t, idx) => (
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

      {/* GEMINI 3.7 REGENERATE PROMPT MODAL */}
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
                  Generate Custom Architecture with Gemini 3.7 Flash
                </h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                >
                  <FiX size={20} />
                </button>
              </ModalHeader>

              <p style={{ fontSize: '0.84rem', color: '#64748b', margin: '0 0 12px 0' }}>
                Specify any custom technology stack, cloud provider, or domain requirements. Gemini 3.7 Flash will synthesize complete, tailored Draw.io XML models for both Current and Target states.
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
                      <FiRefreshCw className="spin" /> Generating Draw.io XML with Gemini 3.7...
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
                      Editing {xmlTargetState === 'current' ? 'Current Baseline Architecture' : 'Desired Future State Architecture'}
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

              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
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
                  Current State XML
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
                  Target State XML
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
                      Editing {xmlTargetState === 'current' ? 'Current Baseline' : 'Desired Future State'} • Drag & Drop GCP shapes • Auto-saves directly to ScoreX assessment
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={() => {
                      const nextTarget = xmlTargetState === 'current' ? 'target' : 'current';
                      setXmlTargetState(nextTarget);
                      const nextXml = nextTarget === 'current'
                        ? (diagramsData?.currentStateXml || currentXml)
                        : (diagramsData?.targetStateXml || targetXml);
                      if (drawioIframeRef.current && drawioIframeRef.current.contentWindow) {
                        drawioIframeRef.current.contentWindow.postMessage(JSON.stringify({
                          action: 'load',
                          autosave: 1,
                          xml: nextXml,
                          title: `ScoreX ${nextTarget === 'current' ? 'Current Baseline' : 'Target Future'} Architecture`
                        }), '*');
                      }
                    }}
                    style={{
                      background: '#f1f5f9',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      padding: '6px 12px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      color: '#0f172a'
                    }}
                  >
                    Switch to {xmlTargetState === 'current' ? 'Target State ➔' : 'Current State ➔'}
                  </button>

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
