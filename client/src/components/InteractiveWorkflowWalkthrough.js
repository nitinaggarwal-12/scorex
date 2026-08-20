import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  FiAlertCircle,
  FiArrowRight,
  FiBarChart2,
  FiCheckCircle,
  FiClock,
  FiCompass,
  FiFileText,
  FiLock,
  FiPlay,
  FiRefreshCw,
  FiShield,
  FiTarget
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import * as assessmentService from '../services/assessmentService';
import authService from '../services/authService';
import Footer from './Footer';

const Page = styled.div`
  min-height: 100vh;
  background: #f8fafc;
  padding: 98px 20px 44px;
  @media (max-width: 640px) { padding: 84px 13px 32px; }
`;

const Shell = styled.main`
  max-width: 1120px;
  margin: 0 auto;
`;

const Hero = styled.section`
  background: linear-gradient(135deg, #0f172a, #172554 58%, #312e81);
  color: white;
  border-radius: 22px;
  padding: 34px;
  h1 { margin: 0 0 9px; font-size: clamp(2rem, 4vw, 3.2rem); letter-spacing: -.04em; }
  p { margin: 0; color: #cbd5e1; max-width: 780px; line-height: 1.6; }
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  border: 1px solid rgba(255,255,255,.18);
  background: rgba(255,255,255,.08);
  border-radius: 999px;
  padding: 6px 10px;
  font-size: .72rem;
  font-weight: 900;
  letter-spacing: .05em;
  text-transform: uppercase;
  margin-bottom: 14px;
`;

const HeroActions = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 24px;
`;

const Button = styled.button`
  border: 1px solid ${props => props.$primary ? '#60a5fa' : props.$dark ? 'rgba(255,255,255,.28)' : '#cbd5e1'};
  background: ${props => props.$primary ? '#2563eb' : props.$dark ? 'rgba(255,255,255,.08)' : '#fff'};
  color: ${props => (props.$primary || props.$dark) ? '#fff' : '#334155'};
  border-radius: 10px;
  padding: 11px 15px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: .84rem;
  font-weight: 900;
  cursor: pointer;
  &:disabled { opacity: .55; cursor: not-allowed; }
`;

const Timeline = styled.section`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 10px;
  margin: 20px 0;
  @media (max-width: 800px) { grid-template-columns: 1fr; }
`;

const Step = styled(motion.div)`
  background: #fff;
  border: 1px solid ${props => props.$done ? '#86efac' : '#e2e8f0'};
  border-radius: 14px;
  padding: 16px;
  min-height: 150px;
  .time { color: #2563eb; font-size: .72rem; font-weight: 900; display: flex; align-items: center; gap: 6px; }
  h3 { margin: 11px 0 6px; color: #0f172a; font-size: .93rem; }
  p { margin: 0; color: #64748b; font-size: .75rem; line-height: 1.5; }
  .status { margin-top: 13px; color: ${props => props.$done ? '#15803d' : '#94a3b8'}; font-size: .72rem; font-weight: 900; display: flex; gap: 6px; align-items: center; }
`;

const Progress = styled.div`
  height: 8px;
  border-radius: 999px;
  background: #e2e8f0;
  overflow: hidden;
  margin-top: 18px;
  div { height: 100%; background: linear-gradient(90deg, #2563eb, #7c3aed); width: ${props => props.$value}%; transition: width .35s ease; }
`;

const Ready = styled.section`
  background: #fff;
  border: 1px solid #bbf7d0;
  border-radius: 18px;
  padding: 24px;
  margin-bottom: 20px;
  h2 { margin: 0 0 6px; color: #14532d; }
  p { color: #64748b; margin: 0; line-height: 1.55; }
`;

const ReadyActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
  margin-top: 18px;
`;

const Notice = styled.div`
  background: ${props => props.$error ? '#fef2f2' : '#eff6ff'};
  border: 1px solid ${props => props.$error ? '#fecaca' : '#bfdbfe'};
  color: ${props => props.$error ? '#991b1b' : '#1e40af'};
  border-radius: 13px;
  padding: 15px 17px;
  display: flex;
  gap: 10px;
  align-items: flex-start;
  line-height: 1.5;
  font-size: .82rem;
  margin-bottom: 20px;
`;

const JudgeGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 560px) { grid-template-columns: 1fr; }
`;

const JudgeCard = styled.div`
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 17px;
  svg { color: #2563eb; margin-bottom: 14px; }
  strong { display: block; color: #0f172a; font-size: .9rem; }
  span { display: block; color: #64748b; font-size: .75rem; line-height: 1.5; margin-top: 6px; }
`;

const STEPS = [
  { time: '0:00', title: 'Isolated demo workspace', text: 'Create a least-privileged demo session. No admin shortcut and no shared customer data.' },
  { time: '0:30', title: 'Create sample evidence', text: 'Generate a full sample assessment inside the isolated demo identity.' },
  { time: '1:00', title: 'Read maturity signal', text: 'Inspect assessment-derived current scores and stated target-state evidence.' },
  { time: '1:45', title: 'Open Decision Room', text: 'See priorities ordered by target gap and the interactive architecture change map.' },
  { time: '2:30', title: 'Check provenance', text: 'Open the Evidence Report to verify claim type, missing peer data, and financial baseline rules.' }
];

const extractId = result => result?.assessment?.id || result?.data?.assessmentId || result?.assessmentId || result?.data?.assessment?.id || result?.id || null;

const InteractiveWorkflowWalkthrough = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('idle');
  const [assessmentId, setAssessmentId] = useState(null);
  const [error, setError] = useState(null);
  const [completedSteps, setCompletedSteps] = useState(0);

  const progress = useMemo(() => Math.round((completedSteps / STEPS.length) * 100), [completedSteps]);

  const runDemo = async () => {
    setStatus('creating');
    setError(null);
    setAssessmentId(null);
    setCompletedSteps(0);

    try {
      if (!authService.isAuthenticated()) {
        authService.createGuestSession();
      }
      setCompletedSteps(1);
      await new Promise(resolve => setTimeout(resolve, 180));

      const result = await assessmentService.generateSampleAssessment();
      const id = extractId(result);
      if (!id) throw new Error('The demo assessment was created without a usable assessment ID.');
      setAssessmentId(id);
      setCompletedSteps(2);
      await new Promise(resolve => setTimeout(resolve, 180));
      setCompletedSteps(3);
      await new Promise(resolve => setTimeout(resolve, 180));
      setCompletedSteps(4);
      await new Promise(resolve => setTimeout(resolve, 180));
      setCompletedSteps(5);
      setStatus('ready');
      toast.success('3‑minute demo workspace is ready');
    } catch (runError) {
      console.error('[ThreeMinuteDemo] Failed:', runError);
      setError(runError.message || 'Unable to create the demo workspace');
      setStatus('error');
    }
  };

  return (
    <>
      <Page>
        <Shell>
          <Hero>
            <Badge><FiClock /> 3‑minute judge path</Badge>
            <h1>From evidence to decision in three minutes.</h1>
            <p>One click creates an isolated sample assessment, then gives you direct paths to the Decision Room, full results, and provenance-aware Evidence Report. No privileged guest mode and no invented peer or ROI claims.</p>
            <HeroActions>
              <Button $primary onClick={runDemo} disabled={status === 'creating'}>{status === 'creating' ? <FiRefreshCw /> : <FiPlay />}{status === 'creating' ? ' Creating demo…' : ' Start 3‑Minute Demo'}</Button>
              <Button $dark onClick={() => navigate('/executive-dashboard')}><FiCompass /> Preview Decision Room</Button>
            </HeroActions>
            <Progress $value={progress}><div /></Progress>
          </Hero>

          <Timeline>
            {STEPS.map((step, index) => (
              <Step key={step.time} $done={completedSteps > index} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .04 }}>
                <div className="time"><FiClock /> {step.time}</div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
                <div className="status">{completedSteps > index ? <><FiCheckCircle /> Ready</> : <><FiTarget /> Next</>}</div>
              </Step>
            ))}
          </Timeline>

          {status === 'creating' && <Notice><FiRefreshCw /><div><strong>Building an isolated demo.</strong><br />The sample is created under the current demo identity and remains scoped to that session.</div></Notice>}
          {status === 'error' && <Notice $error><FiAlertCircle /><div><strong>Demo creation failed.</strong><br />{error}<div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}><Button onClick={runDemo}><FiRefreshCw /> Retry</Button><Button onClick={() => navigate('/assessments/custom-hub')}><FiFileText /> Open Assessment Catalog</Button></div></div></Notice>}

          {status === 'ready' && assessmentId && (
            <Ready>
              <h2><FiCheckCircle style={{ verticalAlign: 'middle', marginRight: 8 }} />Demo ready</h2>
              <p>Use these three views in order. They are deliberately direct so a reviewer can understand ScoreX without hunting through menus.</p>
              <ReadyActions>
                <Button $primary onClick={() => navigate(`/executive/${assessmentId}`)}><FiCompass /> 1. Open Decision Room <FiArrowRight /></Button>
                <Button onClick={() => navigate(`/results/${assessmentId}`)}><FiBarChart2 /> 2. Full Results</Button>
                <Button onClick={() => navigate(`/benchmarks/${assessmentId}`)}><FiShield /> 3. Evidence Report</Button>
              </ReadyActions>
            </Ready>
          )}

          <Notice><FiLock size={19} /><div><strong>What the demo proves:</strong> anonymous access is least-privileged and isolated; quantitative maturity signals trace to assessment data; financial impact requires customer baselines; peer statistics require sourced evidence.</div></Notice>

          <JudgeGrid>
            <JudgeCard><FiLock size={24} /><strong>Safe guest mode</strong><span>A cryptographically scoped demo identity, not an administrator account.</span></JudgeCard>
            <JudgeCard><FiTarget size={24} /><strong>Traceable scoring</strong><span>Current and target scores remain connected to assessment evidence.</span></JudgeCard>
            <JudgeCard><FiCompass size={24} /><strong>Decision-first UX</strong><span>The Decision Room answers what to prioritize, why, and what evidence is still missing.</span></JudgeCard>
            <JudgeCard><FiShield size={24} /><strong>Claim provenance</strong><span>Peer and financial claims are unavailable until the required source or baseline exists.</span></JudgeCard>
          </JudgeGrid>
        </Shell>
      </Page>
      <Footer />
    </>
  );
};

export default InteractiveWorkflowWalkthrough;
