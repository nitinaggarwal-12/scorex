import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiDownload, 
  FiCopy, 
  FiCheck, 
  FiList, 
  FiExternalLink, 
  FiFileText,
  FiZap,
  FiLayers,
  FiFolder,
  FiChevronDown,
  FiChevronUp
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const CardContainer = styled(motion.div)`
  background: white;
  border-radius: 16px;
  border: 1.5px solid #e2e8f0;
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
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.35rem;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
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

const ActionsBar = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const ExportBtn = styled.button`
  background: ${props => props.$primary ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' : '#f8fafc'};
  color: ${props => props.$primary ? '#ffffff' : '#1e293b'};
  border: 1px solid ${props => props.$primary ? '#1d4ed8' : '#cbd5e1'};
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  box-shadow: ${props => props.$primary ? '0 4px 12px rgba(37, 99, 235, 0.25)' : 'none'};

  &:hover {
    background: ${props => props.$primary ? '#1d4ed8' : '#f1f5f9'};
    transform: translateY(-1px);
  }
`;

const PreviewSection = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  margin-top: 16px;
`;

const EpicsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-bottom: 16px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const EpicBox = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 14px 16px;

  .epic-tag {
    font-size: 0.68rem;
    font-weight: 800;
    color: #2563eb;
    background: #eff6ff;
    border: 1px solid #bfdbfe;
    padding: 2px 6px;
    border-radius: 4px;
    display: inline-block;
    margin-bottom: 6px;
  }

  .epic-title {
    font-size: 0.88rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 6px;
  }

  .stories-count {
    font-size: 0.75rem;
    color: #64748b;
  }
`;

const StoriesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StoryRow = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 10px 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  flex-wrap: wrap;
  gap: 8px;

  .left {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
    color: #334155;
  }

  .badge {
    font-size: 0.7rem;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 4px;
    background: #f1f5f9;
    color: #475569;
  }
`;

const BacklogExporterCard = ({ 
  assessmentName = 'Enterprise Data & AI Maturity Assessment', 
  recommendations = [], 
  prioritizedActions = [] 
}) => {
  const [copiedMd, setCopiedMd] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const rawRecs = recommendations.length > 0 ? recommendations : prioritizedActions;

  // Generate standardized Epics & User Stories dynamically from AI recommendations
  const backlogEpics = rawRecs.length > 0
    ? rawRecs.map((rec, idx) => {
        const pillar = rec.dimension || rec.pillar || `Strategic Pillar ${idx + 1}`;
        const stories = (rec.actionSteps && rec.actionSteps.length > 0)
          ? rec.actionSteps.map((step, sIdx) => ({
              key: `STORY-${idx + 1}0${sIdx + 1}`,
              title: typeof step === 'string' ? step : (step.title || step.text || `Execute implementation task ${sIdx + 1}`),
              priority: sIdx === 0 ? 'Highest' : (rec.priority === 'Critical' ? 'Highest' : 'High'),
              sprint: `Sprint ${Math.floor(idx * 1.5) + sIdx + 1}`
            }))
          : [
              { key: `STORY-${idx + 1}01`, title: `Architecture review & baseline scoping for ${rec.title}`, priority: 'Highest', sprint: `Sprint ${idx * 2 + 1}` },
              { key: `STORY-${idx + 1}02`, title: `Pilot rollout & security perimeter validation for ${rec.title}`, priority: 'High', sprint: `Sprint ${idx * 2 + 2}` },
              { key: `STORY-${idx + 1}03`, title: `Production cutover & telemetry verification for ${rec.title}`, priority: 'Medium', sprint: `Sprint ${idx * 2 + 3}` }
            ];

        return {
          id: `EPIC-${idx + 1}`,
          title: rec.title,
          pillar,
          whyItMatters: rec.whyItMatters || 'Strategic transformation initiative.',
          stories
        };
      })
    : [
        {
          id: 'EPIC-1',
          title: 'Centralized Metadata & Zero-Trust Governance Migration',
          pillar: 'Governance & Security',
          whyItMatters: 'Eliminate compliance blind spots and establish unified ABAC data access controls.',
          stories: [
            { key: 'STORY-101', title: 'Provision Centralized Cloud Metastore with IAM role delegations', priority: 'Highest', sprint: 'Sprint 1' },
            { key: 'STORY-102', title: 'Configure dynamic column/row masking and VPC Service Controls', priority: 'High', sprint: 'Sprint 2' },
            { key: 'STORY-103', title: 'Adopt Apache Iceberg / BigLake open formats for zero-egress data sharing', priority: 'High', sprint: 'Sprint 3' }
          ]
        },
        {
          id: 'EPIC-2',
          title: 'Declarative Streaming Pipelines & Real-Time Ingestion',
          pillar: 'Data Engineering',
          whyItMatters: 'Offload transactional databases and guarantee sub-second data freshness.',
          stories: [
            { key: 'STORY-201', title: 'Deploy serverless Change Data Capture (CDC) streaming pipelines', priority: 'Highest', sprint: 'Sprint 2' },
            { key: 'STORY-202', title: 'Implement declarative Dataform / dbt models with data contract assertions', priority: 'High', sprint: 'Sprint 4' },
            { key: 'STORY-203', title: 'Configure automated dead-letter queues and retry handlers', priority: 'Medium', sprint: 'Sprint 5' }
          ]
        },
        {
          id: 'EPIC-3',
          title: 'Enterprise GenAI Architecture & Agentic Mesh',
          pillar: 'Generative AI & LLMs',
          whyItMatters: 'Deploy secure generative AI with 75% token cost optimization.',
          stories: [
            { key: 'STORY-301', title: 'Deploy Gemini Prompt Context Caching for large static contexts', priority: 'Highest', sprint: 'Sprint 3' },
            { key: 'STORY-302', title: 'Standardize agent workflows on Model Context Protocol (MCP)', priority: 'High', sprint: 'Sprint 6' },
            { key: 'STORY-303', title: 'Implement dynamic multi-model routing and real-time guardrails', priority: 'High', sprint: 'Sprint 7' }
          ]
        }
      ];

  // RFC 4180 Compliant CSV field escaper
  const escapeCsv = (val) => {
    if (val === null || val === undefined) return '""';
    const str = String(val);
    return `"${str.replace(/"/g, '""')}"`;
  };

  // Download Jira CSV
  const handleDownloadJiraCSV = () => {
    const headers = ['Issue Type', 'Issue Key', 'Summary', 'Description', 'Priority', 'Component', 'Sprint'];
    const rows = [];

    backlogEpics.forEach(epic => {
      rows.push([
        'Epic',
        escapeCsv(epic.id),
        escapeCsv(epic.title),
        escapeCsv(`Strategic transformation epic for ${epic.pillar}`),
        'High',
        escapeCsv(epic.pillar),
        'Phase 1'
      ]);

      epic.stories.forEach(story => {
        rows.push([
          'Story',
          escapeCsv(story.key),
          escapeCsv(story.title),
          escapeCsv('Acceptance criteria: Must verify implementation and testing with architecture governance.'),
          escapeCsv(story.priority),
          escapeCsv(epic.pillar),
          escapeCsv(story.sprint)
        ]);
      });
    });

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ScoreX_Jira_Backlog_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Jira-Ready Backlog CSV downloaded!');
  };

  // Copy Markdown to Clipboard
  const handleCopyMarkdown = () => {
    let md = `# ${assessmentName} — Engineering Transformation Backlog\n\n`;
    backlogEpics.forEach(epic => {
      md += `## 🚀 [${epic.id}] ${epic.title} (${epic.pillar})\n`;
      epic.stories.forEach(story => {
        md += `- [ ] **${story.key}**: ${story.title} *(Priority: ${story.priority} | ${story.sprint})*\n`;
      });
      md += '\n';
    });

    navigator.clipboard.writeText(md);
    setCopiedMd(true);
    toast.success('Markdown backlog copied to clipboard!');
    setTimeout(() => setCopiedMd(false), 2500);
  };

  return (
    <CardContainer
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <Header>
        <TitleBlock>
          <div className="icon">
            <FiList />
          </div>
          <div>
            <Title>1-Click Transformation Backlog Exporter</Title>
            <Subtitle>
              Export strategic roadmap milestones directly into Jira-ready CSV or GitHub Markdown user stories.
            </Subtitle>
          </div>
        </TitleBlock>

        <ActionsBar>
          <ExportBtn $primary={true} onClick={handleDownloadJiraCSV}>
            <FiDownload /> Download Jira CSV
          </ExportBtn>
          <ExportBtn onClick={handleCopyMarkdown}>
            {copiedMd ? <FiCheck color="#10b981" /> : <FiCopy />}
            {copiedMd ? 'Copied Markdown' : 'Copy Markdown'}
          </ExportBtn>
          <ExportBtn onClick={() => setShowPreview(!showPreview)}>
            {showPreview ? <FiChevronUp /> : <FiChevronDown />}
            {showPreview ? 'Hide Preview' : 'Preview Epics (3)'}
          </ExportBtn>
        </ActionsBar>
      </Header>

      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <PreviewSection>
              <EpicsGrid>
                {backlogEpics.map(epic => (
                  <EpicBox key={epic.id}>
                    <div className="epic-tag">{epic.id} • {epic.pillar}</div>
                    <div className="epic-title">{epic.title}</div>
                    <div className="stories-count">{epic.stories.length} User Stories Ready</div>
                  </EpicBox>
                ))}
              </EpicsGrid>

              <StoriesList>
                {backlogEpics.flatMap(e => e.stories).map(story => (
                  <StoryRow key={story.key}>
                    <div className="left">
                      <FiCheck color="#3b82f6" />
                      <span><strong>{story.key}</strong>: {story.title}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <span className="badge" style={{ color: story.priority === 'Highest' ? '#ef4444' : '#2563eb' }}>
                        {story.priority}
                      </span>
                      <span className="badge">{story.sprint}</span>
                    </div>
                  </StoryRow>
                ))}
              </StoriesList>
            </PreviewSection>
          </motion.div>
        )}
      </AnimatePresence>
    </CardContainer>
  );
};

export default BacklogExporterCard;
