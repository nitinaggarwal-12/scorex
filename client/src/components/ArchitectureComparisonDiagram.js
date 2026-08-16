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
  FiBox
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';

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
  const [viewMode, setViewMode] = useState('both'); // 'both', 'current', 'target'

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
              Side-by-side comparison of your baseline legacy stack against the modern Lakehouse & Agentic Mesh target architecture.
            </Subtitle>
          </div>
        </TitleBlock>

        <ViewToggle>
          <ViewBtn $active={viewMode === 'both'} onClick={() => setViewMode('both')}>
            <FiLayers /> Side-by-Side
          </ViewBtn>
          <ViewBtn $active={viewMode === 'current'} onClick={() => setViewMode('current')}>
            <FiAlertTriangle /> Current State Only
          </ViewBtn>
          <ViewBtn $active={viewMode === 'target'} onClick={() => setViewMode('target')}>
            <FiCheckCircle /> Target State Only
          </ViewBtn>
        </ViewToggle>
      </Header>

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
