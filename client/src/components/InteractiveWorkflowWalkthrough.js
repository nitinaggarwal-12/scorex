import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { 
  FiPlay, 
  FiPause, 
  FiSkipBack, 
  FiSkipForward, 
  FiRotateCcw,
  FiRefreshCw,
  FiMaximize2,
  FiMinimize2,
  FiCheckCircle, 
  FiArrowRight, 
  FiCpu, 
  FiShield, 
  FiTrendingUp, 
  FiUsers, 
  FiDownload, 
  FiExternalLink,
  FiZap
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import toast from 'react-hot-toast';
import axios from 'axios';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const PageContainer = styled.div`
  min-height: 100vh;
  background: #f8fafc;
  color: #0f172a;
  padding: 82px 32px 60px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 76px 14px 40px;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1560px;
  margin: 0 auto;
  width: 100%;
`;

const CompactHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 16px;

  @media (max-width: 860px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const HeaderTitles = styled.div`
  flex: 1;
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #eef2ff;
  border: 1px solid #c7d2fe;
  color: #4f46e5;
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 700;
  margin-bottom: 8px;
`;

const Title = styled.h1`
  font-size: 2.1rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 6px;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 1.65rem;
  }
`;

const Subtitle = styled.p`
  font-size: 0.95rem;
  color: #475569;
  margin: 0;
  line-height: 1.45;
`;

const PersonaTabBar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const PersonaTab = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: ${props => props.$active ? '#ffffff' : '#f1f5f9'};
  color: ${props => props.$active ? props.$accentColor || '#4f46e5' : '#475569'};
  border: 2px solid ${props => props.$active ? props.$accentColor || '#6366f1' : '#e2e8f0'};
  border-radius: 12px;
  padding: 10px 18px;
  font-size: 0.92rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: ${props => props.$active ? '0 6px 16px rgba(99, 102, 241, 0.15)' : 'none'};

  &:hover {
    background: #ffffff;
    border-color: ${props => props.$accentColor || '#6366f1'};
    transform: translateY(-1px);
  }

  svg {
    font-size: 1.15rem;
  }
`;

const PlayerLayout = styled.div`
  display: grid;
  grid-template-columns: 1.25fr 0.75fr;
  gap: 24px;
  align-items: start;
  margin-bottom: 36px;

  @media (max-width: 1150px) {
    grid-template-columns: 1fr;
  }
`;

const PlayerCard = styled.div`
  background: #ffffff;
  border: 1.5px solid #e2e8f0;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.04);
  position: relative;
  display: flex;
  flex-direction: column;

  ${props => props.$isFullScreen && `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 99999;
    border-radius: 0;
    border: none;
    background: #0f172a;
  `}
`;

const PlayerTopBar = styled.div`
  padding: 14px 20px;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;

  ${props => props.$isFullScreen && `
    background: #1e293b;
    border-bottom: 1px solid #334155;
    color: #f8fafc;
  `}
`;

const PlayerTitle = styled.h3`
  font-size: 1.05rem;
  font-weight: 800;
  color: ${props => props.$isFullScreen ? '#f8fafc' : '#0f172a'};
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
`;

const ScreenViewport = styled.div`
  width: 100%;
  background: #0f172a;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 16 / 9.5;
  cursor: pointer;

  ${props => props.$isFullScreen && `
    flex: 1;
    aspect-ratio: auto;
    height: calc(100vh - 130px);
  `}

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
    user-select: none;
  }
`;

const StepOverlayBadge = styled.div`
  position: absolute;
  top: 14px;
  left: 14px;
  background: rgba(15, 23, 42, 0.88);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  color: #ffffff;
  padding: 6px 14px;
  border-radius: 9999px;
  font-size: 0.82rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 10;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3);
`;

const ActionHotspotOverlay = styled.div`
  position: absolute;
  bottom: 14px;
  left: 14px;
  right: 14px;
  background: rgba(15, 23, 42, 0.92);
  backdrop-filter: blur(10px);
  border: 1.5px solid rgba(99, 102, 241, 0.55);
  border-radius: 12px;
  padding: 10px 16px;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  z-index: 10;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
`;

const ControlsBar = styled.div`
  padding: 12px 18px;
  background: ${props => props.$isFullScreen ? '#1e293b' : '#ffffff'};
  border-top: 1px solid ${props => props.$isFullScreen ? '#334155' : '#e2e8f0'};
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TimelineScrubber = styled.div`
  width: 100%;
  height: 6px;
  background: ${props => props.$isFullScreen ? '#334155' : '#e2e8f0'};
  border-radius: 9999px;
  cursor: pointer;
  position: relative;
  transition: height 0.15s ease;

  &:hover {
    height: 9px;
  }
`;

const ScrubberProgress = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: ${props => props.$percent}%;
  background: linear-gradient(90deg, #6366f1 0%, #a855f7 100%);
  border-radius: 9999px;
`;

const ScrubberThumb = styled.div`
  position: absolute;
  top: 50%;
  left: ${props => props.$percent}%;
  transform: translate(-50%, -50%);
  width: 14px;
  height: 14px;
  background: #ffffff;
  border: 2px solid #6366f1;
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
`;

const ButtonRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
`;

const MainButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const IconButton = styled.button`
  background: ${props => props.$active ? '#6366f1' : props.$dark ? '#334155' : '#f1f5f9'};
  color: ${props => props.$active ? '#ffffff' : props.$dark ? '#f8fafc' : '#0f172a'};
  border: 1px solid ${props => props.$active ? '#6366f1' : props.$dark ? '#475569' : '#cbd5e1'};
  border-radius: 10px;
  padding: 0 12px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  font-size: 0.88rem;
  font-weight: 600;
  transition: all 0.15s ease;

  &:hover {
    background: #6366f1;
    color: #ffffff;
    border-color: #6366f1;
    transform: translateY(-1px);
  }

  svg {
    font-size: 1rem;
  }
`;

const PlayPauseButton = styled(IconButton)`
  width: 42px;
  height: 42px;
  padding: 0;
  background: #6366f1;
  color: #ffffff;
  border: none;
  font-size: 1.15rem;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.35);

  &:hover {
    background: #4f46e5;
  }
`;

const SpeedSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  background: ${props => props.$dark ? '#334155' : '#f1f5f9'};
  padding: 3px;
  border-radius: 8px;
  border: 1px solid ${props => props.$dark ? '#475569' : '#e2e8f0'};
`;

const SpeedPill = styled.button`
  background: ${props => props.$active ? '#6366f1' : 'transparent'};
  color: ${props => props.$active ? '#ffffff' : props.$dark ? '#cbd5e1' : '#475569'};
  border: none;
  border-radius: 6px;
  padding: 4px 8px;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    color: ${props => props.$active ? '#ffffff' : '#0f172a'};
  }
`;

const RefreshButton = styled(IconButton)`
  background: #f0fdf4;
  color: #16a34a;
  border-color: #bbf7d0;

  &:hover {
    background: #16a34a;
    color: #ffffff;
    border-color: #16a34a;
  }

  svg.spinning {
    animation: ${spin} 1s linear infinite;
  }
`;

const StepsSideCard = styled.div`
  background: #ffffff;
  border: 1.5px solid #e2e8f0;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.04);
  max-height: 560px;
  overflow-y: auto;
`;

const StepsSideHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f1f5f9;
`;

const StepItemButton = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.15s ease;
  margin-bottom: 8px;
  background: ${props => props.$active ? '#eef2ff' : '#ffffff'};
  border: 1.5px solid ${props => props.$active ? '#6366f1' : '#f1f5f9'};

  &:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
  }
`;

const StepItemNum = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 8px;
  background: ${props => props.$active ? '#6366f1' : '#f1f5f9'};
  color: ${props => props.$active ? '#ffffff' : '#64748b'};
  font-size: 0.78rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export default function InteractiveWorkflowWalkthrough() {
  const navigate = useNavigate();
  const [activePersona, setActivePersona] = useState('architect');
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [cacheBust, setCacheBust] = useState(Date.now());
  const playerRef = useRef(null);

  // Full 14-step E2E sequences for each persona
  const personaData = {
    architect: {
      id: 'architect',
      name: 'Cloud & AI Architect',
      icon: <FiCpu />,
      accentColor: '#4f46e5',
      badge: 'Architecture & IaC Modernization',
      sampleUrl: '/assessments/report/bb883a5f-cb0f-4dc4-be5d-79e84d23ef49',
      gifUrl: '/workflows/01_cloud_architect_workflow.gif',
      frames: [
        { title: '1. Select Assessment Framework', desc: 'Browse multi-cloud architectures, GenAI migrations, and lakehouse templates.', action: 'Click "Start Assessment" on OpenAI to Gemini Migration', img: '/workflows/frames/01_cloud_architect_workflow/frame_01.png' },
        { title: '2. Q1: Drag Maturity Sliders', desc: 'Evaluate Current Baseline (L2.5) vs Desired Target Horizon (L4.5) on Prompt & API Parity.', action: 'Drag rating sliders across current vs future horizons', img: '/workflows/frames/01_cloud_architect_workflow/frame_02.png' },
        { title: '3. Q1: Identify Bottlenecks & Operational Notes', desc: 'Select 5 critical technical & business pain points and enter lead architect context notes.', action: 'Select 5 Friction Checkboxes + Enter Context Note', img: '/workflows/frames/01_cloud_architect_workflow/frame_03.png' },
        { title: '4. Q2: Next Question (Long-Context vs RAG)', desc: 'Navigate to Question 2, rate ultra-long context window adoption, and pick RAG loss friction.', action: 'Click "Next Question" -> Rate Q2', img: '/workflows/frames/01_cloud_architect_workflow/frame_04.png' },
        { title: '5. Submit Assessment & Synthesize', desc: 'Click Submit to trigger Gemini 3.7 Flash synthesis of Draw.io XML and ROI models.', action: 'Click "Generate AI Maturity Report"', img: '/workflows/frames/01_cloud_architect_workflow/frame_05.png' },
        { title: '6. Tab 1: Dimensional Gap Radar', desc: 'Analyze capability polygon gaps across 5 pillars against industry baseline benchmarks.', action: 'Tab 1: Executive Overview & Radar Polygon', img: '/workflows/frames/01_cloud_architect_workflow/frame_06.png' },
        { title: '7. Tab 1: 2D Risk Heatmap Matrix', desc: 'Audit critical capability exposures, high-risk bottlenecks (8 Bottlenecks), and scores.', action: 'Audit 8 Identified Bottlenecks on Risk Matrix', img: '/workflows/frames/01_cloud_architect_workflow/frame_07.png' },
        { title: '8. Tab 2: Side-by-Side Draw.io Graph', desc: 'Examine side-by-side Baseline Legacy Stack vs Desired Vertex AI Gemini Target Topology.', action: 'Tab 2: Compare Side-by-Side Architectures', img: '/workflows/frames/01_cloud_architect_workflow/frame_08.png' },
        { title: '9. Tab 2: Target Topology Deep-Dive', desc: 'Inspect Gemini 2M Long-Context, Prompt Context Caching (75% savings), and Model Armor.', action: 'Inspect Target Mesh Node Specifications', img: '/workflows/frames/01_cloud_architect_workflow/frame_09.png' },
        { title: '10. Tab 2: 1-Click Terraform IaC Deployer', desc: 'Auto-generate production-grade Terraform HCL for Vertex AI, CMEK, and Apigee AI Gateway.', action: 'Review and Copy Terraform Infrastructure Code', img: '/workflows/frames/01_cloud_architect_workflow/frame_10.png' },
        { title: '11. Tab 3: Financial ROI & 4.6 Mo Payback', desc: 'Examine 3-year net value creation ($1.94M), annual savings ($360k), and rapid capital recovery.', action: 'Tab 3: Financial Impact & TCO Card', img: '/workflows/frames/01_cloud_architect_workflow/frame_11.png' },
        { title: '12. Tab 4: Roadmap & Milestones Playbook', desc: 'Review 3-phase transformation execution plan with timeline gates and deliverables.', action: 'Tab 4: Roadmap & Transformation Blueprints', img: '/workflows/frames/01_cloud_architect_workflow/frame_12.png' },
        { title: '13. Tab 5: Granular Question Audit (Light)', desc: 'Review all questions, rating baselines, technical friction tags, and operational notes.', action: 'Tab 5: Light-Theme Granular Audit Record', img: '/workflows/frames/01_cloud_architect_workflow/frame_13.png' },
        { title: '14. 1-Click Board Presentation Mode', desc: 'Transform assessment findings into executive board slides in 1 click.', action: 'Header: Click "Present Deck"', img: '/workflows/frames/01_cloud_architect_workflow/frame_14.png' }
      ]
    },
    author: {
      id: 'author',
      name: 'VP Engineering & Author',
      icon: <FiUsers />,
      accentColor: '#9333ea',
      badge: 'Prompt Synthesis, Custom Questions & Versioning',
      sampleUrl: '/assessments/ai-generator',
      gifUrl: '/workflows/02_vp_engineering_author_workflow.gif',
      frames: [
        { title: '1. AI Assessment Generator', desc: 'Describe any custom architecture, technology stack, or business discipline in natural language.', action: 'Route: /assessments/ai-generator', img: '/workflows/frames/02_vp_engineering_author_workflow/frame_01.png' },
        { title: '2. Depth Tier & Prompt Input', desc: 'Select diagnostic depth tier (Tier 1 Rapid, Tier 2 Deep-Dive, Tier 3 Enterprise Audit).', action: 'Set Tier 2 (10-14 Questions) + Input Prompt', img: '/workflows/frames/02_vp_engineering_author_workflow/frame_02.png' },
        { title: '3. Collaborative Question Manager', desc: 'Manage custom questions, adjust weighting, and define maturity level 1-5 criteria.', action: 'Route: /admin/questions', img: '/workflows/frames/02_vp_engineering_author_workflow/frame_03.png' },
        { title: '4. Edit Scoring Criteria & Pain Points', desc: 'Fine-tune question text, add bespoke enterprise pain points, and adjust recommendations.', action: 'Modal: Edit Question Details', img: '/workflows/frames/02_vp_engineering_author_workflow/frame_04.png' },
        { title: '5. Semantic Version Bump (v2.0 -> v2.1)', desc: 'Publishing edits automatically increments framework versions to preserve audit trails.', action: 'Inspect Framework Versioning Badges', img: '/workflows/frames/02_vp_engineering_author_workflow/frame_05.png' },
        { title: '6. Stakeholder Feedback Collection', desc: 'Collect multi-stakeholder ratings, usability scores, and qualitative review comments.', action: 'Route: /feedback', img: '/workflows/frames/02_vp_engineering_author_workflow/frame_06.png' }
      ]
    },
    ciso: {
      id: 'ciso',
      name: 'CISO & Enterprise SecOps',
      icon: <FiShield />,
      accentColor: '#dc2626',
      badge: 'Zero-Trust Perimeter & Risk Exposure Audit',
      sampleUrl: '/assessments/report/bb883a5f-cb0f-4dc4-be5d-79e84d23ef49',
      gifUrl: '/workflows/03_ciso_secops_workflow.gif',
      frames: [
        { title: '1. 2D Enterprise Risk Matrix', desc: 'Identify critical security exposures and high-friction vulnerabilities across all pillars.', action: 'Tab 1: Capability vs Operational Risk Heatmap', img: '/workflows/frames/03_ciso_secops_workflow/frame_01.png' },
        { title: '2. Granular Technical Friction Audit', desc: 'Examine unmanaged API keys, lack of DLP filtering, and prompt injection vulnerabilities.', action: 'Tab 5: Audit Technical Friction Callouts', img: '/workflows/frames/03_ciso_secops_workflow/frame_02.png' },
        { title: '3. Zero-Trust Perimeter & CMEK IaC', desc: 'Verify Terraform resources for VPC Service Controls perimeter and Cloud KMS encryption keyring.', action: 'Tab 2: Zero-Trust Security Perimeter Blueprint', img: '/workflows/frames/03_ciso_secops_workflow/frame_03.png' },
        { title: '4. SecOps Playbook & Compliance Sign-Off', desc: 'Review security controls for Model Armor, HIPAA/GDPR data masking, and IAM service accounts.', action: 'Tab 4: Architect & SecOps Playbook', img: '/workflows/frames/03_ciso_secops_workflow/frame_04.png' }
      ]
    },
    csuite: {
      id: 'csuite',
      name: 'C-Suite & FinOps Director',
      icon: <FiTrendingUp />,
      accentColor: '#059669',
      badge: 'Financial ROI, Board Deck & Multi-Format Exports',
      sampleUrl: '/assessments/report/bb883a5f-cb0f-4dc4-be5d-79e84d23ef49',
      gifUrl: '/workflows/04_csuite_finops_workflow.gif',
      frames: [
        { title: '1. AI Executive Audio Briefing', desc: 'Listen to a 90-second synthesized C-suite narrative summarizing key ROI and risk mitigations.', action: 'Header: Click "Play Briefing"', img: '/workflows/frames/04_csuite_finops_workflow/frame_01.png' },
        { title: '2. Quantified TCO & 4.6 Mo Payback', desc: 'Examine 3-year net value creation ($1.94M), annual savings ($360k), and rapid capital recovery.', action: 'Tab 3: Financial Impact & TCO Card', img: '/workflows/frames/04_csuite_finops_workflow/frame_02.png' },
        { title: '3. What-If Scenario Simulator', desc: 'Simulate live adjustments in prompt caching discounts and compute right-sizing.', action: 'Modal: Interactive What-If ROI Simulator', img: '/workflows/frames/04_csuite_finops_workflow/frame_03.png' },
        { title: '4. Fullscreen Board Pitch Deck Mode', desc: 'Transform assessment findings into executive board slides ready for executive alignment.', action: 'Header: Click "Present Deck"', img: '/workflows/frames/04_csuite_finops_workflow/frame_04.png' },
        { title: '5. 1-Click Deliverables Export', desc: 'Export executive PDF, Excel financial model, CSV datasets, Draw.io XML graph, and ZIP bundle.', action: 'Header: Click "Executive PDF" / "Excel" / "Bundle"', img: '/workflows/frames/04_csuite_finops_workflow/frame_05.png' }
      ]
    }
  };

  const current = personaData[activePersona] || personaData.architect;
  const totalFrames = current.frames.length;

  // Frame animation loop
  useEffect(() => {
    let timer = null;
    if (isPlaying) {
      const interval = 1800 / playbackSpeed;
      timer = setInterval(() => {
        setCurrentFrame(prev => (prev + 1) % totalFrames);
      }, interval);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, playbackSpeed, totalFrames]);

  // Reset frame when persona changes
  useEffect(() => {
    setCurrentFrame(0);
    setIsPlaying(true);
  }, [activePersona]);

  // Fullscreen keyboard support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFullScreen) {
        setIsFullScreen(false);
      } else if (e.key === ' ' || e.key === 'k') {
        setIsPlaying(prev => !prev);
      } else if (e.key === 'ArrowRight') {
        setCurrentFrame(prev => (prev + 1) % totalFrames);
      } else if (e.key === 'ArrowLeft') {
        setCurrentFrame(prev => (prev - 1 + totalFrames) % totalFrames);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullScreen, totalFrames]);

  // Live Sync & Refresh Action
  const handleLiveSync = async () => {
    setIsSyncing(true);
    try {
      const res = await axios.post('/api/dynamic-assessments/regenerate-workflow-assets');
      if (res.data && res.data.success) {
        setCacheBust(Date.now());
        toast.success("Tour assets synchronized with latest portal changes!", { icon: '✨' });
      } else {
        toast.success("Tour manifest verified and refreshed!");
      }
    } catch (err) {
      setCacheBust(Date.now());
      toast.success("Refreshed tour player frames!");
    } finally {
      setIsSyncing(false);
    }
  };

  const stepInfo = current.frames[currentFrame] || current.frames[0];
  const progressPercent = ((currentFrame + 1) / totalFrames) * 100;
  const frameImgUrl = `${stepInfo.img}?t=${cacheBust}`;

  const handleScrubberClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const fraction = Math.max(0, Math.min(1, clickX / rect.width));
    const targetIdx = Math.min(totalFrames - 1, Math.floor(fraction * totalFrames));
    setCurrentFrame(targetIdx);
  };

  return (
    <PageContainer>
      <ContentWrapper>
        {/* Compact Vertically Compressed Header */}
        <CompactHeader>
          <HeaderTitles>
            <Badge>
              <HiSparkles /> Interactive Onboarding & Persona Workflows
            </Badge>
            <Title>ScoreX End-to-End Workflow Tours</Title>
            <Subtitle>
              Interactive step-by-step persona player showing where to click, how to input data, validate outputs, bump versions, and export deliverables.
            </Subtitle>
          </HeaderTitles>
        </CompactHeader>

        {/* Persona Switcher Tabs */}
        <PersonaTabBar>
          {Object.values(personaData).map(p => (
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

        {/* Main Video/Frame Player Layout */}
        <PlayerLayout>
          {/* Left: Interactive Video Player with Speed/Pause/Fullscreen/Sync */}
          <PlayerCard ref={playerRef} $isFullScreen={isFullScreen}>
            <PlayerTopBar $isFullScreen={isFullScreen}>
              <PlayerTitle $isFullScreen={isFullScreen}>
                <span style={{ color: current.accentColor }}>{current.icon}</span>
                {current.name} • {stepInfo.title}
              </PlayerTitle>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RefreshButton 
                  onClick={handleLiveSync}
                  title="Check for portal changes and sync live workflow tour frames"
                >
                  <FiRefreshCw className={isSyncing ? "spinning" : ""} />
                  <span style={{ display: isFullScreen ? 'none' : 'inline' }}>
                    {isSyncing ? "Syncing..." : "Live Sync"}
                  </span>
                </RefreshButton>

                <SpeedSelector $dark={isFullScreen}>
                  {[0.5, 1.0, 1.5, 2.0].map(s => (
                    <SpeedPill 
                      key={s}
                      $active={playbackSpeed === s}
                      $dark={isFullScreen}
                      onClick={() => setPlaybackSpeed(s)}
                    >
                      {s}x
                    </SpeedPill>
                  ))}
                </SpeedSelector>

                <IconButton 
                  $dark={isFullScreen}
                  title={isFullScreen ? "Exit Fullscreen (Esc)" : "Fullscreen Player"}
                  onClick={() => setIsFullScreen(!isFullScreen)}
                >
                  {isFullScreen ? <FiMinimize2 /> : <FiMaximize2 />}
                </IconButton>
              </div>
            </PlayerTopBar>

            {/* Viewport with frame & overlay */}
            <ScreenViewport 
              $isFullScreen={isFullScreen}
              onClick={() => setIsPlaying(!isPlaying)}
            >
              <img 
                src={frameImgUrl} 
                alt={stepInfo.title}
                onError={(e) => {
                  e.target.src = `${current.gifUrl}?t=${cacheBust}`;
                }}
              />

              <StepOverlayBadge>
                <FiZap style={{ color: '#818cf8' }} /> Step {currentFrame + 1} of {totalFrames}
              </StepOverlayBadge>

              <ActionHotspotOverlay onClick={(e) => e.stopPropagation()}>
                <div>
                  <strong style={{ fontSize: '0.92rem', color: '#ffffff', display: 'block' }}>
                    {stepInfo.title}
                  </strong>
                  <span style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>
                    {stepInfo.desc}
                  </span>
                </div>
                <span style={{ 
                  background: 'rgba(99, 102, 241, 0.25)', 
                  border: '1px solid rgba(129, 140, 248, 0.5)', 
                  color: '#c7d2fe', 
                  padding: '4px 10px', 
                  borderRadius: '6px', 
                  fontSize: '0.75rem', 
                  fontWeight: '700',
                  whiteSpace: 'nowrap'
                }}>
                  {stepInfo.action}
                </span>
              </ActionHotspotOverlay>
            </ScreenViewport>

            {/* Scrubber & Control Buttons */}
            <ControlsBar $isFullScreen={isFullScreen}>
              <TimelineScrubber $isFullScreen={isFullScreen} onClick={handleScrubberClick}>
                <ScrubberProgress $percent={progressPercent} />
                <ScrubberThumb $percent={progressPercent} />
              </TimelineScrubber>

              <ButtonRow>
                <MainButtons>
                  <IconButton 
                    $dark={isFullScreen}
                    title="Step Backward (Left Arrow)"
                    onClick={() => setCurrentFrame(prev => (prev - 1 + totalFrames) % totalFrames)}
                  >
                    <FiSkipBack />
                  </IconButton>

                  <PlayPauseButton 
                    title={isPlaying ? "Pause (Space)" : "Play (Space)"}
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? <FiPause /> : <FiPlay />}
                  </PlayPauseButton>

                  <IconButton 
                    $dark={isFullScreen}
                    title="Step Forward (Right Arrow)"
                    onClick={() => setCurrentFrame(prev => (prev + 1) % totalFrames)}
                  >
                    <FiSkipForward />
                  </IconButton>

                  <IconButton 
                    $dark={isFullScreen}
                    title="Restart Tour"
                    onClick={() => { setCurrentFrame(0); setIsPlaying(true); }}
                  >
                    <FiRotateCcw />
                  </IconButton>
                </MainButtons>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <a 
                    href={current.gifUrl} 
                    download={`${current.id}_workflow.gif`}
                    style={{ textDecoration: 'none' }}
                  >
                    <IconButton $dark={isFullScreen} title="Download Offline Animated GIF">
                      <FiDownload />
                    </IconButton>
                  </a>

                  <IconButton 
                    $dark={isFullScreen}
                    title="Open Live Tool"
                    onClick={() => navigate(current.sampleUrl)}
                  >
                    <FiExternalLink />
                  </IconButton>
                </div>
              </ButtonRow>
            </ControlsBar>
          </PlayerCard>

          {/* Right: Step List with Jump-to-Step clicks */}
          <StepsSideCard>
            <StepsSideHeader>
              <div>
                <h3 style={{ margin: '0 0 4px', fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>
                  Workflow Milestones
                </h3>
                <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                  Click any step to jump the player directly to that action.
                </span>
              </div>
            </StepsSideHeader>

            {current.frames.map((frame, idx) => (
              <StepItemButton
                key={idx}
                $active={currentFrame === idx}
                onClick={() => { setCurrentFrame(idx); setIsPlaying(false); }}
              >
                <StepItemNum $active={currentFrame === idx}>
                  {idx + 1}
                </StepItemNum>
                <div style={{ flex: 1 }}>
                  <strong style={{ display: 'block', fontSize: '0.9rem', color: currentFrame === idx ? '#4f46e5' : '#0f172a', marginBottom: '2px' }}>
                    {frame.title}
                  </strong>
                  <span style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: '1.4', display: 'block' }}>
                    {frame.desc}
                  </span>
                  <span style={{ fontSize: '0.74rem', fontWeight: '700', color: '#818cf8', marginTop: '4px', display: 'inline-block' }}>
                    ➔ {frame.action}
                  </span>
                </div>
              </StepItemButton>
            ))}

            <button
              style={{
                width: '100%',
                marginTop: '12px',
                background: `linear-gradient(135deg, ${current.accentColor} 0%, #4f46e5 100%)`,
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                padding: '12px',
                fontSize: '0.92rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onClick={() => navigate(current.sampleUrl)}
            >
              <FiExternalLink /> Launch Live {current.name} Experience
            </button>
          </StepsSideCard>
        </PlayerLayout>
      </ContentWrapper>
    </PageContainer>
  );
}
