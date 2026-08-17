import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
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
  FiDownload 
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import toast from 'react-hot-toast';
import DiagramViewer from './DiagramViewer';

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

// Draw.io XML for CURRENT BASELINE ARCHITECTURE
const CURRENT_STATE_DRAWIO_XML = `<mxfile host="embed.diagrams.net">
  <diagram id="current-state-arch" name="Current State Architecture">
    <mxGraphModel dx="1200" dy="800" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1400" pageHeight="850" background="#0f172a" math="0" shadow="0">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>
        
        <!-- HEADER TITLE -->
        <mxCell id="title" value="&lt;b style=&quot;font-size:16px;color:#f87171;&quot;&gt;⚠️ CURRENT BASELINE ARCHITECTURE: FRAGMENTED &amp;amp; SILOED&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:11px;color:#94a3b8;&quot;&gt;Maturity Level: 2.6 (Developing) • Brittle Cron Batch • Data Silos • Static VM Costs • 14-day BI Backlog&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#1e1b4b;strokeColor=#ef4444;strokeWidth=2;fontColor=#ffffff;align=center;shadow=1;" vertex="1" parent="1">
          <mxGeometry x="40" y="20" width="1320" height="60" as="geometry"/>
        </mxCell>

        <!-- STAGE 1: INGESTION -->
        <mxCell id="stage1_box" value="&lt;b style=&quot;color:#f87171;font-size:12px;&quot;&gt;STAGE 1: INGESTION&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:9.5px;color:#cbd5e1;&quot;&gt;Brittle Batch &amp;amp; SFTP&lt;/span&gt;" style="swimlane;html=1;startSize=44;fillColor=#1e293b;strokeColor=#f43f5e;fontColor=#ffffff;fontSize=12;fontStyle=1;rounded=1;" vertex="1" parent="1">
          <mxGeometry x="40" y="100" width="280" height="660" as="geometry"/>
        </mxCell>
        <mxCell id="s1_card1" value="&lt;b style=&quot;color:#fda4af;font-size:12px;&quot;&gt;Legacy OLTP &amp;amp; Files&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:10px;color:#94a3b8;&quot;&gt;Postgres, MySQL, SFTP&lt;br&gt;Point-to-point unmanaged exports&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#311018;strokeColor=#f43f5e;fontColor=#ffffff;align=left;spacingLeft=10;" vertex="1" parent="stage1_box">
          <mxGeometry x="20" y="60" width="240" height="80" as="geometry"/>
        </mxCell>
        <mxCell id="s1_card2" value="&lt;b style=&quot;color:#fda4af;font-size:12px;&quot;&gt;Cron Batch Scripts&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:10px;color:#94a3b8;&quot;&gt;Python/Bash cron jobs&lt;br&gt;24-hour latency, no dead-letter queue&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#311018;strokeColor=#f43f5e;fontColor=#ffffff;align=left;spacingLeft=10;" vertex="1" parent="stage1_box">
          <mxGeometry x="20" y="160" width="240" height="80" as="geometry"/>
        </mxCell>
        <mxCell id="s1_warn" value="&lt;b style=&quot;color:#ef4444;&quot;&gt;⚠️ 38% Failure Rate&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:9.5px;color:#fca5a5;&quot;&gt;Silent schema breakages halt nightly ETL runs&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#450a0a;strokeColor=#ef4444;fontColor=#ffffff;align=center;" vertex="1" parent="stage1_box">
          <mxGeometry x="20" y="260" width="240" height="60" as="geometry"/>
        </mxCell>

        <!-- STAGE 2: STORAGE & GOVERNANCE -->
        <mxCell id="stage2_box" value="&lt;b style=&quot;color:#f87171;font-size:12px;&quot;&gt;STAGE 2: DATA SILOS&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:9.5px;color:#cbd5e1;&quot;&gt;Split Warehouse + Lakes&lt;/span&gt;" style="swimlane;html=1;startSize=44;fillColor=#1e293b;strokeColor=#f43f5e;fontColor=#ffffff;fontSize=12;fontStyle=1;rounded=1;" vertex="1" parent="1">
          <mxGeometry x="380" y="100" width="280" height="660" as="geometry"/>
        </mxCell>
        <mxCell id="s2_card1" value="&lt;b style=&quot;color:#fda4af;font-size:12px;&quot;&gt;Unmanaged S3/GCS&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:10px;color:#94a3b8;&quot;&gt;Raw CSV / JSON dumps&lt;br&gt;Fragmented bucket ACLs, no lineage&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#311018;strokeColor=#f43f5e;fontColor=#ffffff;align=left;spacingLeft=10;" vertex="1" parent="stage2_box">
          <mxGeometry x="20" y="60" width="240" height="80" as="geometry"/>
        </mxCell>
        <mxCell id="s2_card2" value="&lt;b style=&quot;color:#fda4af;font-size:12px;&quot;&gt;Isolated Data Warehouse&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:10px;color:#94a3b8;&quot;&gt;Proprietary SQL Warehouse&lt;br&gt;Duplicate data copies &amp;amp; sync lag&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#311018;strokeColor=#f43f5e;fontColor=#ffffff;align=left;spacingLeft=10;" vertex="1" parent="stage2_box">
          <mxGeometry x="20" y="160" width="240" height="80" as="geometry"/>
        </mxCell>
        <mxCell id="s2_warn" value="&lt;b style=&quot;color:#ef4444;&quot;&gt;⚠️ Manual IAM Spreadsheets&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:9.5px;color:#fca5a5;&quot;&gt;No automated row/column masking&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#450a0a;strokeColor=#ef4444;fontColor=#ffffff;align=center;" vertex="1" parent="stage2_box">
          <mxGeometry x="20" y="260" width="240" height="60" as="geometry"/>
        </mxCell>

        <!-- STAGE 3: COMPUTE & PROCESSING -->
        <mxCell id="stage3_box" value="&lt;b style=&quot;color:#f87171;font-size:12px;&quot;&gt;STAGE 3: COMPUTE &amp;amp; MLOps&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:9.5px;color:#cbd5e1;&quot;&gt;Over-Provisioned Clusters&lt;/span&gt;" style="swimlane;html=1;startSize=44;fillColor=#1e293b;strokeColor=#f43f5e;fontColor=#ffffff;fontSize=12;fontStyle=1;rounded=1;" vertex="1" parent="1">
          <mxGeometry x="720" y="100" width="280" height="660" as="geometry"/>
        </mxCell>
        <mxCell id="s3_card1" value="&lt;b style=&quot;color:#fda4af;font-size:12px;&quot;&gt;Static 24/7 Spark VMs&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:10px;color:#94a3b8;&quot;&gt;Always-on oversized clusters&lt;br&gt;Lack of automated auto-termination&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#311018;strokeColor=#f43f5e;fontColor=#ffffff;align=left;spacingLeft=10;" vertex="1" parent="stage3_box">
          <mxGeometry x="20" y="60" width="240" height="80" as="geometry"/>
        </mxCell>
        <mxCell id="s3_card2" value="&lt;b style=&quot;color:#fda4af;font-size:12px;&quot;&gt;Disconnected Notebooks&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:10px;color:#94a3b8;&quot;&gt;Ad-hoc local Jupyter environments&lt;br&gt;No centralized model registry&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#311018;strokeColor=#f43f5e;fontColor=#ffffff;align=left;spacingLeft=10;" vertex="1" parent="stage3_box">
          <mxGeometry x="20" y="160" width="240" height="80" as="geometry"/>
        </mxCell>
        <mxCell id="s3_warn" value="&lt;b style=&quot;color:#ef4444;&quot;&gt;⚠️ $480k Annual Idle Waste&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:9.5px;color:#fca5a5;&quot;&gt;Zero cluster FinOps kill switches&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#450a0a;strokeColor=#ef4444;fontColor=#ffffff;align=center;" vertex="1" parent="stage3_box">
          <mxGeometry x="20" y="260" width="240" height="60" as="geometry"/>
        </mxCell>

        <!-- STAGE 4: GENAI & SERVING -->
        <mxCell id="stage4_box" value="&lt;b style=&quot;color:#f87171;font-size:12px;&quot;&gt;STAGE 4: SERVING &amp;amp; BI&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:9.5px;color:#cbd5e1;&quot;&gt;Unguarded LLMs &amp;amp; Heavy Backlog&lt;/span&gt;" style="swimlane;html=1;startSize=44;fillColor=#1e293b;strokeColor=#f43f5e;fontColor=#ffffff;fontSize=12;fontStyle=1;rounded=1;" vertex="1" parent="1">
          <mxGeometry x="1060" y="100" width="300" height="660" as="geometry"/>
        </mxCell>
        <mxCell id="s4_card1" value="&lt;b style=&quot;color:#fda4af;font-size:12px;&quot;&gt;Direct Unguarded LLM APIs&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:10px;color:#94a3b8;&quot;&gt;No prompt caching (100% token spend)&lt;br&gt;No enterprise PII filters or guardrails&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#311018;strokeColor=#f43f5e;fontColor=#ffffff;align=left;spacingLeft=10;" vertex="1" parent="stage4_box">
          <mxGeometry x="20" y="60" width="260" height="80" as="geometry"/>
        </mxCell>
        <mxCell id="s4_card2" value="&lt;b style=&quot;color:#fda4af;font-size:12px;&quot;&gt;Stale Daily BI Extracts&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:10px;color:#94a3b8;&quot;&gt;Slow queries over legacy schemas&lt;br&gt;14-day turnaround on custom metrics&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#311018;strokeColor=#f43f5e;fontColor=#ffffff;align=left;spacingLeft=10;" vertex="1" parent="stage4_box">
          <mxGeometry x="20" y="160" width="260" height="80" as="geometry"/>
        </mxCell>
        <mxCell id="s4_warn" value="&lt;b style=&quot;color:#ef4444;&quot;&gt;⚠️ 14-Day Delivery Lag&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:9.5px;color:#fca5a5;&quot;&gt;Analyst team overwhelmed by custom SQL&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#450a0a;strokeColor=#ef4444;fontColor=#ffffff;align=center;" vertex="1" parent="stage4_box">
          <mxGeometry x="20" y="260" width="260" height="60" as="geometry"/>
        </mxCell>

        <!-- FLOW CONNECTORS -->
        <mxCell id="flow1" value="Nightly Batch (24h)" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;strokeWidth=2;strokeColor=#ef4444;dashed=1;fontColor=#fca5a5;fontSize=10;" edge="1" parent="1" source="s1_card2" target="s2_card1">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell id="flow2" value="ETL Extract" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;strokeWidth=2;strokeColor=#ef4444;dashed=1;fontColor=#fca5a5;fontSize=10;" edge="1" parent="1" source="s2_card2" target="s3_card1">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell id="flow3" value="Ad-hoc SQL" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;strokeWidth=2;strokeColor=#ef4444;dashed=1;fontColor=#fca5a5;fontSize=10;" edge="1" parent="1" source="s3_card1" target="s4_card2">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>`;

// Draw.io XML for DESIRED FUTURE STATE ARCHITECTURE
const TARGET_STATE_DRAWIO_XML = `<mxfile host="embed.diagrams.net">
  <diagram id="target-state-arch" name="Desired Future State Architecture">
    <mxGraphModel dx="1200" dy="800" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1400" pageHeight="850" background="#0f172a" math="0" shadow="0">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>
        
        <!-- HEADER TITLE -->
        <mxCell id="title" value="&lt;b style=&quot;font-size:16px;color:#34d399;&quot;&gt;✨ DESIRED FUTURE STATE ARCHITECTURE: MODERN LAKEHOUSE &amp;amp; AGENTIC MESH&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:11px;color:#94a3b8;&quot;&gt;Target Maturity: Level 4.5 (Optimized) • Streaming CDC • Unity Catalog • Serverless FinOps • MCP Autonomous AI&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#064e3b;strokeColor=#10b981;strokeWidth=2;fontColor=#ffffff;align=center;shadow=1;" vertex="1" parent="1">
          <mxGeometry x="40" y="20" width="1320" height="60" as="geometry"/>
        </mxCell>

        <!-- STAGE 1: STREAMING INGESTION -->
        <mxCell id="stage1_box" value="&lt;b style=&quot;color:#34d399;font-size:12px;&quot;&gt;STAGE 1: REAL-TIME INGESTION&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:9.5px;color:#cbd5e1;&quot;&gt;Declarative CDC &amp;amp; Auto-Loader&lt;/span&gt;" style="swimlane;html=1;startSize=44;fillColor=#022c22;strokeColor=#10b981;fontColor=#ffffff;fontSize=12;fontStyle=1;rounded=1;" vertex="1" parent="1">
          <mxGeometry x="40" y="100" width="280" height="660" as="geometry"/>
        </mxCell>
        <mxCell id="s1_card1" value="&lt;b style=&quot;color:#6ee7b7;font-size:12px;&quot;&gt;Multi-Source Event Streams&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:10px;color:#cbd5e1;&quot;&gt;Kafka, Kinesis, Google Pub/Sub&lt;br&gt;Sub-second real-time event capture&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#064e3b;strokeColor=#10b981;fontColor=#ffffff;align=left;spacingLeft=10;" vertex="1" parent="stage1_box">
          <mxGeometry x="20" y="60" width="240" height="80" as="geometry"/>
        </mxCell>
        <mxCell id="s1_card2" value="&lt;b style=&quot;color:#6ee7b7;font-size:12px;&quot;&gt;Serverless Auto-Loader&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:10px;color:#cbd5e1;&quot;&gt;Automated schema evolution&lt;br&gt;Declarative SDF / dbt transformation&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#064e3b;strokeColor=#10b981;fontColor=#ffffff;align=left;spacingLeft=10;" vertex="1" parent="stage1_box">
          <mxGeometry x="20" y="160" width="240" height="80" as="geometry"/>
        </mxCell>
        <mxCell id="s1_val" value="&lt;b style=&quot;color:#10b981;&quot;&gt;✓ Zero Ingestion Latency&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:9.5px;color:#a7f3d0;&quot;&gt;Automated retry &amp;amp; dead-letter isolation&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#065f46;strokeColor=#10b981;fontColor=#ffffff;align=center;" vertex="1" parent="stage1_box">
          <mxGeometry x="20" y="260" width="240" height="60" as="geometry"/>
        </mxCell>

        <!-- STAGE 2: UNITY CATALOG LAKEHOUSE -->
        <mxCell id="stage2_box" value="&lt;b style=&quot;color:#34d399;font-size:12px;&quot;&gt;STAGE 2: UNITY LAKEHOUSE&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:9.5px;color:#cbd5e1;&quot;&gt;Delta Lake &amp;amp; Iceberg UniForm&lt;/span&gt;" style="swimlane;html=1;startSize=44;fillColor=#022c22;strokeColor=#10b981;fontColor=#ffffff;fontSize=12;fontStyle=1;rounded=1;" vertex="1" parent="1">
          <mxGeometry x="380" y="100" width="280" height="660" as="geometry"/>
        </mxCell>
        <mxCell id="s2_card1" value="&lt;b style=&quot;color:#6ee7b7;font-size:12px;&quot;&gt;Open Table Formats&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:10px;color:#cbd5e1;&quot;&gt;Delta Lake / Iceberg UniForm&lt;br&gt;Single source of truth, zero duplication&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#064e3b;strokeColor=#10b981;fontColor=#ffffff;align=left;spacingLeft=10;" vertex="1" parent="stage2_box">
          <mxGeometry x="20" y="60" width="240" height="80" as="geometry"/>
        </mxCell>
        <mxCell id="s2_card2" value="&lt;b style=&quot;color:#6ee7b7;font-size:12px;&quot;&gt;Centralized Unity Catalog&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:10px;color:#cbd5e1;&quot;&gt;Row/column dynamic masking&lt;br&gt;Automated end-to-end audit lineage&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#064e3b;strokeColor=#10b981;fontColor=#ffffff;align=left;spacingLeft=10;" vertex="1" parent="stage2_box">
          <mxGeometry x="20" y="160" width="240" height="80" as="geometry"/>
        </mxCell>
        <mxCell id="s2_val" value="&lt;b style=&quot;color:#10b981;&quot;&gt;✓ Unified Governance Plane&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:9.5px;color:#a7f3d0;&quot;&gt;Cross-cloud zero-copy data sharing&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#065f46;strokeColor=#10b981;fontColor=#ffffff;align=center;" vertex="1" parent="stage2_box">
          <mxGeometry x="20" y="260" width="240" height="60" as="geometry"/>
        </mxCell>

        <!-- STAGE 3: SERVERLESS FINOPS & MLOPS -->
        <mxCell id="stage3_box" value="&lt;b style=&quot;color:#34d399;font-size:12px;&quot;&gt;STAGE 3: FINOPS &amp;amp; MLOps&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:9.5px;color:#cbd5e1;&quot;&gt;Serverless Vectorized Engine&lt;/span&gt;" style="swimlane;html=1;startSize=44;fillColor=#022c22;strokeColor=#10b981;fontColor=#ffffff;fontSize=12;fontStyle=1;rounded=1;" vertex="1" parent="1">
          <mxGeometry x="720" y="100" width="280" height="660" as="geometry"/>
        </mxCell>
        <mxCell id="s3_card1" value="&lt;b style=&quot;color:#6ee7b7;font-size:12px;&quot;&gt;Serverless Photon SQL&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:10px;color:#cbd5e1;&quot;&gt;Instant 15-min auto-suspend switches&lt;br&gt;35% to 50% compute TCO savings&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#064e3b;strokeColor=#10b981;fontColor=#ffffff;align=left;spacingLeft=10;" vertex="1" parent="stage3_box">
          <mxGeometry x="20" y="60" width="240" height="80" as="geometry"/>
        </mxCell>
        <mxCell id="s3_card2" value="&lt;b style=&quot;color:#6ee7b7;font-size:12px;&quot;&gt;Production MLflow Registry&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:10px;color:#cbd5e1;&quot;&gt;Automated CI/CD model verification&lt;br&gt;Real-time concept drift &amp;amp; feature store&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#064e3b;strokeColor=#10b981;fontColor=#ffffff;align=left;spacingLeft=10;" vertex="1" parent="stage3_box">
          <mxGeometry x="20" y="160" width="240" height="80" as="geometry"/>
        </mxCell>
        <mxCell id="s3_val" value="&lt;b style=&quot;color:#10b981;&quot;&gt;✓ Automated FinOps &amp;amp; CI/CD&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:9.5px;color:#a7f3d0;&quot;&gt;Zero idle spend &amp;amp; fully tracked models&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#065f46;strokeColor=#10b981;fontColor=#ffffff;align=center;" vertex="1" parent="stage3_box">
          <mxGeometry x="20" y="260" width="240" height="60" as="geometry"/>
        </mxCell>

        <!-- STAGE 4: AGENT MESH & SEMANTIC SERVING -->
        <mxCell id="stage4_box" value="&lt;b style=&quot;color:#34d399;font-size:12px;&quot;&gt;STAGE 4: AI MESH &amp;amp; BI&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:9.5px;color:#cbd5e1;&quot;&gt;MCP Protocol &amp;amp; Semantic Layer&lt;/span&gt;" style="swimlane;html=1;startSize=44;fillColor=#022c22;strokeColor=#10b981;fontColor=#ffffff;fontSize=12;fontStyle=1;rounded=1;" vertex="1" parent="1">
          <mxGeometry x="1060" y="100" width="300" height="660" as="geometry"/>
        </mxCell>
        <mxCell id="s4_card1" value="&lt;b style=&quot;color:#6ee7b7;font-size:12px;&quot;&gt;Compound Multi-Agent Mesh&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:10px;color:#cbd5e1;&quot;&gt;MCP protocol &amp;amp; 75% prompt context caching&lt;br&gt;Zero-Trust AI guardrails &amp;amp; CMEK isolation&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#064e3b;strokeColor=#10b981;fontColor=#ffffff;align=left;spacingLeft=10;" vertex="1" parent="stage4_box">
          <mxGeometry x="20" y="60" width="260" height="80" as="geometry"/>
        </mxCell>
        <mxCell id="s4_card2" value="&lt;b style=&quot;color:#6ee7b7;font-size:12px;&quot;&gt;Self-Service Semantic BI Layer&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:10px;color:#cbd5e1;&quot;&gt;Direct zero-copy BI queries&lt;br&gt;Sub-second dashboard refresh speeds&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#064e3b;strokeColor=#10b981;fontColor=#ffffff;align=left;spacingLeft=10;" vertex="1" parent="stage4_box">
          <mxGeometry x="20" y="160" width="260" height="80" as="geometry"/>
        </mxCell>
        <mxCell id="s4_val" value="&lt;b style=&quot;color:#10b981;&quot;&gt;✓ Real-Time Self-Service&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:9.5px;color:#a7f3d0;&quot;&gt;Instant answers for BI &amp;amp; autonomous agents&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#065f46;strokeColor=#10b981;fontColor=#ffffff;align=center;" vertex="1" parent="stage4_box">
          <mxGeometry x="20" y="260" width="260" height="60" as="geometry"/>
        </mxCell>

        <!-- FLOW CONNECTORS -->
        <mxCell id="flow1" value="Streaming CDC" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;strokeWidth=2.5;strokeColor=#10b981;fontColor=#6ee7b7;fontSize=10;" edge="1" parent="1" source="s1_card2" target="s2_card1">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell id="flow2" value="Zero-Copy Engine" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;strokeWidth=2.5;strokeColor=#10b981;fontColor=#6ee7b7;fontSize=10;" edge="1" parent="1" source="s2_card2" target="s3_card1">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell id="flow3" value="MCP Autonomous Mesh" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;strokeWidth=2.5;strokeColor=#10b981;fontColor=#6ee7b7;fontSize=10;" edge="1" parent="1" source="s3_card1" target="s4_card1">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>`;

const ArchitectureComparisonDiagram = ({ currentScore = 2.6, targetScore = 4.5 }) => {
  const [viewMode, setViewMode] = useState('side_by_side'); // 'side_by_side', 'current_diagram', 'target_diagram', 'cards'

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
            <Title>Architectural Evolution Blueprint: Current vs. Desired Future State</Title>
            <Subtitle>
              Interactive visual architecture diagrams comparing your baseline legacy stack against the target modern Lakehouse & Agentic Mesh.
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

          <ExportBtn 
            onClick={() => handleExportDrawio(
              viewMode === 'current_diagram' ? CURRENT_STATE_DRAWIO_XML : TARGET_STATE_DRAWIO_XML,
              viewMode === 'current_diagram' ? 'ScoreX_Current_State_Architecture.drawio' : 'ScoreX_Desired_Future_State_Architecture.drawio'
            )}
            title="Download architecture diagram for Draw.io / diagrams.net"
          >
            <FiDownload /> 📥 Export Draw.io XML
          </ExportBtn>
        </ActionGroup>
      </Header>

      {/* 1. SIDE-BY-SIDE DUAL DIAGRAM VIEWPORT */}
      {viewMode === 'side_by_side' && (
        <DualDiagramGrid>
          <div>
            <DiagramViewer
              xml={CURRENT_STATE_DRAWIO_XML}
              title="Current Baseline Architecture"
              subtitle={`Level ${currentScore} Developing`}
              badge="Current State"
              theme="dark"
              height="580px"
              isTarget={false}
            />
          </div>
          <div>
            <DiagramViewer
              xml={TARGET_STATE_DRAWIO_XML}
              title="Desired Future State Architecture"
              subtitle={`Level ${targetScore} Optimized`}
              badge="Desired Future State"
              theme="dark"
              height="580px"
              isTarget={true}
            />
          </div>
        </DualDiagramGrid>
      )}

      {/* 2. FULL-WIDTH CURRENT STATE DIAGRAM */}
      {viewMode === 'current_diagram' && (
        <div style={{ marginBottom: '20px' }}>
          <DiagramViewer
            xml={CURRENT_STATE_DRAWIO_XML}
            title="Current Baseline Architecture: Fragmented, High Latency & Cost Inefficiencies"
            subtitle={`Maturity Level ${currentScore}/5`}
            badge="Current State"
            theme="dark"
            height="650px"
            isTarget={false}
          />
        </div>
      )}

      {/* 3. FULL-WIDTH DESIRED FUTURE STATE DIAGRAM */}
      {viewMode === 'target_diagram' && (
        <div style={{ marginBottom: '20px' }}>
          <DiagramViewer
            xml={TARGET_STATE_DRAWIO_XML}
            title="Desired Future State: Unified Unity Catalog Lakehouse & Autonomous Agentic Mesh"
            subtitle={`Target Maturity Level ${targetScore}/5`}
            badge="Desired Future State"
            theme="dark"
            height="650px"
            isTarget={true}
          />
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
          <span>Core Strategic Transformations Unlocked by Desired Future State Architecture:</span>
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
