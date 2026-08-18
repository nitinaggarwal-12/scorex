import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FiPlay, 
  FiCheckCircle, 
  FiArrowRight, 
  FiCpu, 
  FiShield, 
  FiTrendingUp, 
  FiUsers, 
  FiFileText, 
  FiSliders, 
  FiEdit, 
  FiDownload, 
  FiShare2, 
  FiMessageSquare, 
  FiLayers, 
  FiActivity, 
  FiCheckSquare,
  FiExternalLink,
  FiMaximize2,
  FiZap,
  FiHelpCircle
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import toast from 'react-hot-toast';

const PageContainer = styled.div`
  min-height: 100vh;
  background: #f8fafc;
  color: #0f172a;
  padding: 108px 36px 80px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 92px 16px 40px;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1560px;
  margin: 0 auto;
  width: 100%;
`;

const HeroSection = styled.div`
  text-align: center;
  margin-bottom: 48px;
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #eef2ff;
  border: 1px solid #c7d2fe;
  color: #4f46e5;
  padding: 6px 18px;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 700;
  margin-bottom: 16px;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 14px;
  letter-spacing: -0.03em;

  @media (max-width: 768px) {
    font-size: 2.1rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.15rem;
  color: #475569;
  max-width: 820px;
  margin: 0 auto;
  line-height: 1.6;
`;

const PersonaTabBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 40px;
  flex-wrap: wrap;
`;

const PersonaTab = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  background: ${props => props.$active ? '#ffffff' : '#f1f5f9'};
  color: ${props => props.$active ? props.$accentColor || '#4f46e5' : '#475569'};
  border: 2px solid ${props => props.$active ? props.$accentColor || '#6366f1' : '#e2e8f0'};
  border-radius: 16px;
  padding: 14px 24px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: ${props => props.$active ? '0 10px 25px rgba(99, 102, 241, 0.15)' : 'none'};

  &:hover {
    background: #ffffff;
    border-color: ${props => props.$accentColor || '#6366f1'};
    transform: translateY(-2px);
  }

  svg {
    font-size: 1.25rem;
  }
`;

const WorkflowGrid = styled.div`
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 32px;
  align-items: start;
  margin-bottom: 48px;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

const VideoCard = styled.div`
  background: #ffffff;
  border: 1.5px solid #e2e8f0;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.05);
  position: relative;
`;

const VideoHeader = styled.div`
  padding: 20px 24px;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const VideoTitle = styled.h3`
  font-size: 1.15rem;
  font-weight: 800;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
`;

const GifWrapper = styled.div`
  width: 100%;
  background: #0f172a;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;

  img {
    width: 100%;
    height: auto;
    display: block;
    object-fit: cover;
  }
`;

const StepsCard = styled.div`
  background: #ffffff;
  border: 1.5px solid #e2e8f0;
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.05);
`;

const StepsTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const StepsSubtitle = styled.p`
  font-size: 0.95rem;
  color: #64748b;
  margin-bottom: 24px;
  line-height: 1.5;
`;

const StepItem = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f1f5f9;

  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
`;

const StepNumber = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 12px;
  background: ${props => props.$color || '#eef2ff'};
  color: ${props => props.$textColor || '#4f46e5'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.95rem;
  flex-shrink: 0;
`;

const StepContent = styled.div`
  flex: 1;
`;

const StepHeader = styled.h4`
  font-size: 1.05rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 6px;
`;

const StepDesc = styled.p`
  font-size: 0.9rem;
  color: #475569;
  line-height: 1.5;
  margin: 0 0 8px;
`;

const StepActionTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #334155;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 600;
`;

const LaunchButton = styled.button`
  width: 100%;
  margin-top: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: ${props => props.$bg || 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)'};
  color: #ffffff;
  border: none;
  border-radius: 14px;
  padding: 14px 24px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 10px 25px rgba(99, 102, 241, 0.3);
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 14px 30px rgba(99, 102, 241, 0.45);
  }
`;

const ChecklistCard = styled.div`
  background: #ffffff;
  border: 1.5px solid #e2e8f0;
  border-radius: 24px;
  padding: 36px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.05);
  margin-top: 48px;
`;

const ChecklistHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
`;

const ChecklistTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ChecklistGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 16px;
`;

const ChecklistItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 14px;
  background: ${props => props.$checked ? '#f0fdf4' : '#f8fafc'};
  border: 1.5px solid ${props => props.$checked ? '#86efac' : '#e2e8f0'};
  border-radius: 16px;
  padding: 18px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #6366f1;
    transform: translateY(-1px);
  }
`;

const Checkbox = styled.div`
  width: 22px;
  height: 22px;
  border-radius: 6px;
  border: 2px solid ${props => props.$checked ? '#16a34a' : '#cbd5e1'};
  background: ${props => props.$checked ? '#16a34a' : '#ffffff'};
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  flex-shrink: 0;
  margin-top: 2px;
`;

export default function InteractiveWorkflowWalkthrough() {
  const navigate = useNavigate();
  const [activePersona, setActivePersona] = useState('architect');
  const [checklist, setChecklist] = useState(() => {
    const saved = localStorage.getItem('scorex_onboarding_checklist');
    return saved ? JSON.parse(saved) : {
      runSample: false,
      inspectRadar: false,
      viewDrawIo: false,
      generateIac: false,
      editQuestions: false,
      bumpVersion: false,
      exportPdfPptx: false,
      submitFeedback: false
    };
  });

  useEffect(() => {
    localStorage.setItem('scorex_onboarding_checklist', JSON.stringify(checklist));
  }, [checklist]);

  const toggleChecklist = (key) => {
    setChecklist(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      if (!prev[key]) {
        toast.success("Milestone completed! Keep exploring ScoreX.", { icon: '🎉' });
      }
      return updated;
    });
  };

  const completedCount = Object.values(checklist).filter(Boolean).length;
  const totalChecklist = Object.keys(checklist).length;

  const personas = [
    {
      id: 'architect',
      name: 'Cloud & AI Architect',
      icon: <FiCpu />,
      accentColor: '#4f46e5',
      badge: 'Architecture & IaC Modernization',
      gifSrc: '/workflows/01_cloud_architect_workflow.gif',
      sampleId: 'bb883a5f-cb0f-4dc4-be5d-79e84d23ef49',
      launchRoute: '/assessments/report/bb883a5f-cb0f-4dc4-be5d-79e84d23ef49',
      launchLabel: 'Launch Architect Sample Report & Draw.io',
      steps: [
        {
          title: '1. Select Assessment Diagnostic',
          desc: 'Navigate to Assessments Hub and pick your target cloud transformation (e.g. OpenAI to Gemini Enterprise Migration).',
          tag: 'Click "Start Assessment" or "Try Sample"'
        },
        {
          title: '2. Rate Maturity & Select Pain Points',
          desc: 'Move Current & Future state sliders. Pick from 5 unique business & technical pain points per question and add lead architect notes.',
          tag: 'Interactive Sliders + 5 Friction Checkboxes'
        },
        {
          title: '3. Inspect Dimensional Gap Radar',
          desc: 'Validate cross-dimensional maturity gaps against global industry benchmarks across 5 evaluation pillars.',
          tag: 'Tab 1: Executive Overview & Radar'
        },
        {
          title: '4. Explore Draw.io Architecture Evolution',
          desc: 'Examine side-by-side Baseline vs Desired Target diagrams with dynamic Gemini 1.5/2.5 Pro & Flash long-context topology.',
          tag: 'Tab 2: Interactive Draw.io Viewer + XML Export'
        },
        {
          title: '5. 1-Click Terraform IaC Generation',
          desc: 'Deploy production-ready Google Cloud Vertex AI, CMEK Keyring, and Apigee AI Gateway Terraform scripts with zero manual typing.',
          tag: 'Tab 2: 1-Click IaC Cloud Deployer'
        }
      ]
    },
    {
      id: 'author',
      name: 'VP Engineering & Author',
      icon: <FiUsers />,
      accentColor: '#9333ea',
      badge: 'Prompt Synthesis, Custom Questions & Versioning',
      gifSrc: '/workflows/02_vp_engineering_author_workflow.gif',
      launchRoute: '/assessments/ai-generator',
      launchLabel: 'Open AI Assessment Generator',
      steps: [
        {
          title: '1. Describe Architecture in AI Generator',
          desc: 'Type any tech stack or business discipline (e.g. "FinOps Cost Optimization" or "Agentic AI Mesh"). Select diagnostic depth tier.',
          tag: 'Route: /assessments/ai-generator'
        },
        {
          title: '2. Auto-Synthesize Dimensional Questions',
          desc: 'Gemini 3.7 Flash compiles 5 pillars, scoring criteria, and business/technical pain points in seconds.',
          tag: 'Click "Generate Assessment"'
        },
        {
          title: '3. Edit & Fine-Tune in Question Manager',
          desc: 'Modify questions, tailor maturity level 1-5 definitions, and customize company-specific pain points.',
          tag: 'Route: /assessments/manage-questions'
        },
        {
          title: '4. Semantic Version Bumping (v2.0 -> v2.1)',
          desc: 'When modifying live questions or frameworks, trigger automatic version bumps to preserve audit trails and historic baselines.',
          tag: 'Click "Edit Assessment" -> Save & Bump'
        },
        {
          title: '5. Collect Multi-User Stakeholder Feedback',
          desc: 'Gather structured ratings and feedback from enterprise architects, security leads, and product teams.',
          tag: 'Route: /feedback'
        }
      ]
    },
    {
      id: 'ciso',
      name: 'CISO & Enterprise SecOps',
      icon: <FiShield />,
      accentColor: '#dc2626',
      badge: 'Zero-Trust Perimeter & Risk Exposure Audit',
      gifSrc: '/workflows/03_ciso_secops_workflow.gif',
      sampleId: 'bb883a5f-cb0f-4dc4-be5d-79e84d23ef49',
      launchRoute: '/assessments/report/bb883a5f-cb0f-4dc4-be5d-79e84d23ef49',
      launchLabel: 'Inspect 2D Risk Heatmap & Security Audit',
      steps: [
        {
          title: '1. Review 2D Risk Heatmap Matrix',
          desc: 'Instantly identify critical bottlenecks and high-risk capability exposures mapped against overall maturity scores.',
          tag: 'Tab 1: Capability vs. Operational Risk Matrix'
        },
        {
          title: '2. Deep Question & Friction Audit',
          desc: 'Inspect granular technical frictions, business risk exposure, and lead architect notes across every question in crisp light theme.',
          tag: 'Tab 5: Question Responses Audit'
        },
        {
          title: '3. Verify Zero-Trust Cloud Guardrails',
          desc: 'Ensure VPC Service Controls, Cloud KMS CMEK encryption, and Google Cloud Model Armor prompt defense are enforced.',
          tag: 'Tab 2: Security Perimeter IaC Blueprint'
        },
        {
          title: '4. Export Security Playbook & Compliance Pack',
          desc: 'Generate executive audit evidence for GDPR, HIPAA, HITRUST, and enterprise AI compliance sign-offs.',
          tag: 'Tab 4: Architect & SecOps Playbook'
        }
      ]
    },
    {
      id: 'csuite',
      name: 'C-Suite & FinOps Director',
      icon: <FiTrendingUp />,
      accentColor: '#059669',
      badge: 'Financial ROI, Board Deck & Multi-Format Exports',
      gifSrc: '/workflows/04_csuite_finops_workflow.gif',
      sampleId: 'bb883a5f-cb0f-4dc4-be5d-79e84d23ef49',
      launchRoute: '/assessments/report/bb883a5f-cb0f-4dc4-be5d-79e84d23ef49',
      launchLabel: 'Open Financial ROI & Present Deck',
      steps: [
        {
          title: '1. Listen to 90-sec AI Audio Briefing',
          desc: 'Stream synthesized executive C-suite narrative highlighting top investment priorities and risk mitigations.',
          tag: 'Top Banner: Play Executive Briefing'
        },
        {
          title: '2. Review 3-Year TCO & 4.6 Mo Payback Horizon',
          desc: 'Examine quantified net financial returns, compute rightsizing savings, and rapid capital recovery timeline.',
          tag: 'Tab 3: Financial Impact & TCO'
        },
        {
          title: '3. Simulate "What-If" Investment Scenarios',
          desc: 'Model live changes in Prompt Caching discounts, commitment tiers, and developer productivity uplift in real time.',
          tag: 'Header: Click "What-If Scenario Simulator"'
        },
        {
          title: '4. 1-Click Board Presentation PPTX Mode',
          desc: 'Switch to full-screen Board Deck presentation mode with interactive slides ready for leadership reviews.',
          tag: 'Header: Click "Present Deck"'
        },
        {
          title: '5. Multi-Format Deliverables Bundle Export',
          desc: 'Download high-res Executive PDF, Excel TCO Model, CSV data, Draw.io XML graph, and complete ZIP archive in 1 click.',
          tag: 'Header: Click "Executive PDF" / "Excel" / "Bundle"'
        }
      ]
    }
  ];

  const current = personas.find(p => p.id === activePersona) || personas[0];

  return (
    <PageContainer>
      <ContentWrapper>
        <HeroSection>
          <Badge>
            <HiSparkles /> Interactive Onboarding & Persona Workflows
          </Badge>
          <Title>ScoreX End-to-End Workflow Tours</Title>
          <Subtitle>
            Watch step-by-step persona walkthroughs showing exactly how to navigate, rate diagnostics, validate Draw.io diagrams, bump version numbers, generate Terraform IaC, and export Board presentation decks.
          </Subtitle>
        </HeroSection>

        {/* Persona Switcher Tabs */}
        <PersonaTabBar>
          {personas.map(p => (
            <PersonaTab
              key={p.id}
              $active={activePersona === p.id}
              $accentColor={p.accentColor}
              onClick={() => setActivePersona(p.id)}
            >
              {p.icon}
              {p.name}
            </PersonaTab>
          ))}
        </PersonaTabBar>

        {/* Main Animated Workflow Card */}
        <WorkflowGrid>
          {/* Left: Video / Animated GIF Card */}
          <VideoCard>
            <VideoHeader>
              <VideoTitle>
                <span style={{ color: current.accentColor }}>{current.icon}</span>
                {current.name} Animated Tour
              </VideoTitle>
              <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#64748b' }}>
                {current.badge}
              </span>
            </VideoHeader>

            <GifWrapper>
              <img 
                src={current.gifSrc} 
                alt={`${current.name} Workflow`} 
                onError={(e) => {
                  e.target.src = '/workflows/01_cloud_architect_workflow.gif';
                }}
              />
            </GifWrapper>
          </VideoCard>

          {/* Right: Step-by-Step Breakdown */}
          <StepsCard>
            <StepsTitle>
              <FiZap style={{ color: current.accentColor }} /> Key Workflow Milestones
            </StepsTitle>
            <StepsSubtitle>
              Follow these core actions to achieve maximum impact with ScoreX.
            </StepsSubtitle>

            {current.steps.map((step, idx) => (
              <StepItem key={idx}>
                <StepNumber $color={`${current.accentColor}18`} $textColor={current.accentColor}>
                  {idx + 1}
                </StepNumber>
                <StepContent>
                  <StepHeader>{step.title}</StepHeader>
                  <StepDesc>{step.desc}</StepDesc>
                  <StepActionTag>
                    <FiArrowRight style={{ color: current.accentColor }} /> {step.tag}
                  </StepActionTag>
                </StepContent>
              </StepItem>
            ))}

            <LaunchButton 
              $bg={`linear-gradient(135deg, ${current.accentColor} 0%, #4f46e5 100%)`}
              onClick={() => navigate(current.launchRoute)}
            >
              <FiExternalLink /> {current.launchLabel}
            </LaunchButton>
          </StepsCard>
        </WorkflowGrid>

        {/* Interactive First-Time User Checklist */}
        <ChecklistCard>
          <ChecklistHeader>
            <div>
              <ChecklistTitle>
                <FiCheckSquare style={{ color: '#16a34a' }} /> First-Time User Interactive Checklist
              </ChecklistTitle>
              <p style={{ color: '#64748b', fontSize: '0.95rem', margin: '4px 0 0' }}>
                Complete these 8 key operations to master all capabilities of the ScoreX platform.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a' }}>
                Progress: {completedCount} / {totalChecklist} Completed
              </span>
              <div style={{ width: '120px', height: '8px', background: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden' }}>
                <div 
                  style={{ 
                    width: `${(completedCount / totalChecklist) * 100}%`, 
                    height: '100%', 
                    background: 'linear-gradient(90deg, #10b981 0%, #6366f1 100%)',
                    transition: 'width 0.3s ease'
                  }} 
                />
              </div>
            </div>
          </ChecklistHeader>

          <ChecklistGrid>
            <ChecklistItem 
              $checked={checklist.runSample}
              onClick={() => toggleChecklist('runSample')}
            >
              <Checkbox $checked={checklist.runSample}>
                {checklist.runSample && <FiCheckCircle />}
              </Checkbox>
              <div>
                <strong style={{ display: 'block', fontSize: '0.95rem', color: '#0f172a', marginBottom: '4px' }}>
                  1. Run or Open Sample Assessment
                </strong>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  Explore the OpenAI to Gemini Enterprise Migration assessment.
                </span>
              </div>
            </ChecklistItem>

            <ChecklistItem 
              $checked={checklist.inspectRadar}
              onClick={() => toggleChecklist('inspectRadar')}
            >
              <Checkbox $checked={checklist.inspectRadar}>
                {checklist.inspectRadar && <FiCheckCircle />}
              </Checkbox>
              <div>
                <strong style={{ display: 'block', fontSize: '0.95rem', color: '#0f172a', marginBottom: '4px' }}>
                  2. Inspect Dimensional Gap Radar & 2D Risk Matrix
                </strong>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  Audit maturity ratings and high-risk bottleneck exposures.
                </span>
              </div>
            </ChecklistItem>

            <ChecklistItem 
              $checked={checklist.viewDrawIo}
              onClick={() => toggleChecklist('viewDrawIo')}
            >
              <Checkbox $checked={checklist.viewDrawIo}>
                {checklist.viewDrawIo && <FiCheckCircle />}
              </Checkbox>
              <div>
                <strong style={{ display: 'block', fontSize: '0.95rem', color: '#0f172a', marginBottom: '4px' }}>
                  3. Compare Draw.io Architecture Diagrams
                </strong>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  Switch between Baseline and Target Google Vertex AI topologies.
                </span>
              </div>
            </ChecklistItem>

            <ChecklistItem 
              $checked={checklist.generateIac}
              onClick={() => toggleChecklist('generateIac')}
            >
              <Checkbox $checked={checklist.generateIac}>
                {checklist.generateIac && <FiCheckCircle />}
              </Checkbox>
              <div>
                <strong style={{ display: 'block', fontSize: '0.95rem', color: '#0f172a', marginBottom: '4px' }}>
                  4. Generate Terraform IaC Cloud Blueprints
                </strong>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  Review Vertex AI + CMEK + Apigee AI Gateway Terraform code.
                </span>
              </div>
            </ChecklistItem>

            <ChecklistItem 
              $checked={checklist.editQuestions}
              onClick={() => toggleChecklist('editQuestions')}
            >
              <Checkbox $checked={checklist.editQuestions}>
                {checklist.editQuestions && <FiCheckCircle />}
              </Checkbox>
              <div>
                <strong style={{ display: 'block', fontSize: '0.95rem', color: '#0f172a', marginBottom: '4px' }}>
                  5. Edit Questions in Question Manager
                </strong>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  Fine-tune scoring criteria and pain point definitions.
                </span>
              </div>
            </ChecklistItem>

            <ChecklistItem 
              $checked={checklist.bumpVersion}
              onClick={() => toggleChecklist('bumpVersion')}
            >
              <Checkbox $checked={checklist.bumpVersion}>
                {checklist.bumpVersion && <FiCheckCircle />}
              </Checkbox>
              <div>
                <strong style={{ display: 'block', fontSize: '0.95rem', color: '#0f172a', marginBottom: '4px' }}>
                  6. Save Edits & Trigger Version Increment
                </strong>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  Verify that editing questions safely increments framework version.
                </span>
              </div>
            </ChecklistItem>

            <ChecklistItem 
              $checked={checklist.exportPdfPptx}
              onClick={() => toggleChecklist('exportPdfPptx')}
            >
              <Checkbox $checked={checklist.exportPdfPptx}>
                {checklist.exportPdfPptx && <FiCheckCircle />}
              </Checkbox>
              <div>
                <strong style={{ display: 'block', fontSize: '0.95rem', color: '#0f172a', marginBottom: '4px' }}>
                  7. Test 1-Click PDF & Board Deck PPTX Mode
                </strong>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  Launch "Present Deck" and export comprehensive PDF dossier.
                </span>
              </div>
            </ChecklistItem>

            <ChecklistItem 
              $checked={checklist.submitFeedback}
              onClick={() => toggleChecklist('submitFeedback')}
            >
              <Checkbox $checked={checklist.submitFeedback}>
                {checklist.submitFeedback && <FiCheckCircle />}
              </Checkbox>
              <div>
                <strong style={{ display: 'block', fontSize: '0.95rem', color: '#0f172a', marginBottom: '4px' }}>
                  8. Collect & Submit Stakeholder Feedback
                </strong>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  Provide feedback to continuously improve assessment quality.
                </span>
              </div>
            </ChecklistItem>
          </ChecklistGrid>
        </ChecklistCard>
      </ContentWrapper>
    </PageContainer>
  );
}
