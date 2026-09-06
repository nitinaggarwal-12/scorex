import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  FiAlertCircle,
  FiArrowLeft,
  FiArrowRight,
  FiBarChart2,
  FiCheckCircle,
  FiCompass,
  FiFileText,
  FiLayers,
  FiPlay,
  FiPrinter,
  FiShield,
  FiTarget,
  FiTrendingUp
} from 'react-icons/fi';
import * as assessmentService from '../services/assessmentService';
import ArchitectureDiffPanel from './ArchitectureDiffPanel';
import Footer from './Footer';

const Page = styled.div`
  min-height: 100vh;
  background: #f8fafc;
  padding: 104px 24px 44px;
  @media (max-width: 720px) { padding: 90px 14px 32px; }
  @media print { padding: 0; background: #fff; }
`;

const Shell = styled.main`
  max-width: 1280px;
  margin: 0 auto;
`;

const TopActions = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
  flex-wrap: wrap;
  @media print { display: none; }
`;

const Button = styled.button`
  border: 1px solid ${props => props.$primary ? '#2563eb' : '#cbd5e1'};
  background: ${props => props.$primary ? '#2563eb' : '#fff'};
  color: ${props => props.$primary ? '#fff' : '#334155'};
  border-radius: 10px;
  padding: 10px 14px;
  font-weight: 800;
  font-size: .84rem;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  &:hover { transform: translateY(-1px); }
`;

const Hero = styled.section`
  background: linear-gradient(135deg, #0f172a 0%, #172554 54%, #1d4ed8 140%);
  color: #fff;
  border-radius: 22px;
  padding: 32px;
  margin-bottom: 20px;
  overflow: hidden;
  position: relative;
  h1 { margin: 0 0 8px; font-size: clamp(2rem, 4vw, 3.15rem); letter-spacing: -.04em; }
  p { margin: 0; max-width: 820px; color: #cbd5e1; line-height: 1.6; }
`;

const Eyebrow = styled.div`
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

const HeroMetrics = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-top: 24px;
  @media (max-width: 700px) { grid-template-columns: 1fr; }
`;

const HeroMetric = styled.div`
  background: rgba(255,255,255,.08);
  border: 1px solid rgba(255,255,255,.14);
  border-radius: 13px;
  padding: 15px;
  .label { color: #bfdbfe; font-size: .68rem; font-weight: 900; text-transform: uppercase; }
  .value { font-size: 1.7rem; font-weight: 900; margin-top: 5px; }
  .sub { color: #cbd5e1; font-size: .74rem; margin-top: 3px; }
`;

const DecisionGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 20px;
  @media (max-width: 1000px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 620px) { grid-template-columns: 1fr; }
`;

const DecisionCard = styled(motion.div)`
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 15px;
  padding: 18px;
  min-height: 170px;
  display: flex;
  flex-direction: column;
  .icon { width: 38px; height: 38px; display: grid; place-items: center; background: #eff6ff; color: #2563eb; border-radius: 10px; margin-bottom: 14px; }
  .label { color: #64748b; font-size: .68rem; font-weight: 900; text-transform: uppercase; letter-spacing: .04em; }
  h3 { margin: 6px 0 7px; color: #0f172a; font-size: 1rem; line-height: 1.35; }
  p { margin: 0; color: #64748b; font-size: .79rem; line-height: 1.5; }
`;

const Section = styled.section`
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  padding: 22px;
  margin-bottom: 20px;
  h2 { margin: 0 0 5px; color: #0f172a; font-size: 1.2rem; display: flex; align-items: center; gap: 8px; }
  > p { margin: 0 0 17px; color: #64748b; font-size: .84rem; line-height: 1.5; }
`;

const Stack = styled.div`
  display: grid;
  gap: 10px;
`;

const Priority = styled.button`
  width: 100%;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 14px 15px;
  display: grid;
  grid-template-columns: 40px minmax(0, 1fr) auto;
  gap: 12px;
  align-items: center;
  text-align: left;
  cursor: pointer;
  .rank { width: 32px; height: 32px; display: grid; place-items: center; border-radius: 9px; background: #0f172a; color: white; font-weight: 900; }
  strong { color: #0f172a; }
  span { color: #64748b; font-size: .76rem; display: block; margin-top: 3px; }
`;

const Gap = styled.span`
  padding: 6px 9px;
  border-radius: 999px;
  background: #fff7ed;
  color: #c2410c !important;
  font-weight: 900;
  white-space: nowrap;
`;

const EvidenceNotice = styled.div`
  display: flex;
  gap: 10px;
  align-items: flex-start;
  border: 1px solid #bfdbfe;
  background: #eff6ff;
  color: #1e40af;
  border-radius: 12px;
  padding: 14px 16px;
  font-size: .82rem;
  line-height: 1.5;
`;

const LauncherGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin-top: 20px;
  @media (max-width: 920px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 560px) { grid-template-columns: 1fr; }
`;

const LauncherCard = styled.button`
  border: 1px solid #e2e8f0;
  background: #fff;
  border-radius: 15px;
  padding: 19px;
  text-align: left;
  cursor: pointer;
  min-height: 170px;
  transition: .2s ease;
  &:hover { transform: translateY(-2px); border-color: #93c5fd; box-shadow: 0 8px 24px rgba(15,23,42,.06); }
  .icon { color: #2563eb; margin-bottom: 22px; }
  strong { display: block; color: #0f172a; font-size: 1rem; }
  span { display: block; color: #64748b; font-size: .78rem; line-height: 1.5; margin-top: 6px; }
`;

const Loading = styled.div`
  max-width: 1280px;
  margin: 120px auto;
  text-align: center;
  color: #64748b;
`;

const ErrorBox = styled.div`
  max-width: 900px;
  margin: 110px auto;
  background: #fff;
  border: 1px solid #fecaca;
  color: #991b1b;
  border-radius: 16px;
  padding: 24px;
`;

const toNumber = value => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const avg = values => {
  const valid = values.map(toNumber).filter(value => value !== null);
  return valid.length ? valid.reduce((sum, value) => sum + value, 0) / valid.length : null;
};

const normalize = response => response?.data || response || {};

const ExecutiveCommandCenter = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(Boolean(assessmentId));
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [benchmark, setBenchmark] = useState(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!assessmentId) return;
      try {
        setLoading(true);
        setError(null);
        const [resultsResponse, benchmarkResponse] = await Promise.all([
          assessmentService.getAssessmentResults(assessmentId),
          assessmentService.getBenchmarkReport(assessmentId).catch(() => null)
        ]);
        if (!active) return;
        setResults(normalize(resultsResponse));
        setBenchmark(normalize(benchmarkResponse));
      } catch (loadError) {
        console.error('[DecisionRoom] Failed to load assessment evidence:', loadError);
        if (active) setError(loadError.message || 'Unable to load assessment evidence');
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, [assessmentId]);

  const analysis = benchmark?.pillarAnalysis || {};
  const priorities = useMemo(() => Object.entries(analysis).map(([id, item]) => {
    const current = toNumber(item?.customerScore ?? item?.score);
    const target = toNumber(item?.targetScore);
    const gap = toNumber(item?.gapToTarget) ?? (current !== null && target !== null ? target - current : null);
    return {
      id,
      name: item?.pillar || item?.name || id.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()),
      current,
      target,
      gap,
      status: item?.status || null
    };
  }).sort((a, b) => (b.gap ?? -999) - (a.gap ?? -999)), [analysis]);

  if (!assessmentId) {
    return (
      <>
        <Page>
          <Shell>
            <Hero>
              <Eyebrow><FiCompass /> Executive workspace</Eyebrow>
              <h1>Decision Room</h1>
              <p>One place to move from assessment evidence to a decision: what matters now, what must change, what evidence supports it, and what to do next.</p>
              <div style={{ marginTop: 22, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <Button $primary onClick={() => navigate('/workflow-demo')}><FiPlay /> Run 3‑Minute Demo</Button>
                <Button onClick={() => navigate('/assessments/custom-hub')}><FiFileText /> Open Assessment Catalog</Button>
              </div>
            </Hero>
            <LauncherGrid>
              <LauncherCard onClick={() => navigate('/workflow-demo')}><FiPlay className="icon" size={27} /><strong>See the decision flow</strong><span>Create an isolated sample, inspect evidence, then open the Decision Room in one guided path.</span></LauncherCard>
              <LauncherCard onClick={() => navigate('/assessments/custom-hub')}><FiBarChart2 className="icon" size={27} /><strong>Assess</strong><span>Choose a framework or start an assessment to establish current and target maturity evidence.</span></LauncherCard>
              <LauncherCard onClick={() => navigate('/deep-dive')}><FiLayers className="icon" size={27} /><strong>Architecture</strong><span>Explore architecture patterns after the target-state gaps are clear.</span></LauncherCard>
              <LauncherCard onClick={() => navigate('/user-guide')}><FiCheckCircle className="icon" size={27} /><strong>Method</strong><span>Understand scoring, evidence, provenance, and how recommendations should be interpreted.</span></LauncherCard>
            </LauncherGrid>
          </Shell>
        </Page>
        <Footer />
      </>
    );
  }

  if (loading) return <Loading>Loading Decision Room evidence…</Loading>;
  if (error) return <ErrorBox><FiAlertCircle /> <strong>Decision Room unavailable.</strong><div style={{ marginTop: 8 }}>{error}</div><Button style={{ marginTop: 15 }} onClick={() => navigate(`/results/${assessmentId}`)}>Open Full Results</Button></ErrorBox>;

  const assessment = results?.assessmentInfo || results?.assessment || results || {};
  const overallCurrent = toNumber(benchmark?.metrics?.overallScore ?? results?.overall?.currentScore ?? results?.overallScore ?? assessment?.totalScore);
  const targetValues = priorities.map(item => item.target).filter(value => value !== null);
  const overallTarget = avg(targetValues);
  const overallGap = overallCurrent !== null && overallTarget !== null ? overallTarget - overallCurrent : null;
  const top = priorities.filter(item => item.gap !== null && item.gap > 0).slice(0, 3);
  const first = top[0] || priorities[0] || null;
  const findings = Array.isArray(benchmark?.executiveSummary?.keyFindings) ? benchmark.executiveSummary.keyFindings : [];
  const immediate = benchmark?.strategicRecommendations?.immediate || [];
  const nextAction = immediate[0]?.action || (first ? `Validate blockers, dependencies, and success criteria for ${first.name}.` : 'Complete target-state evidence before prioritizing transformation work.');
  const orgName = assessment?.organizationName || assessment?.customerName || assessment?.organization_name || 'Organization';
  const industry = assessment?.industry || benchmark?.metadata?.industry || 'Industry not specified';

  return (
    <>
      <Page>
        <Shell>
          <TopActions>
            <Button onClick={() => navigate(`/results/${assessmentId}`)}><FiArrowLeft /> Full Results</Button>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Button onClick={() => navigate(`/benchmarks/${assessmentId}`)}><FiShield /> Evidence Report</Button>
              <Button onClick={() => window.print()}><FiPrinter /> Print</Button>
            </div>
          </TopActions>

          <Hero>
            <Eyebrow><FiCompass /> Decision Room · assessment-relative</Eyebrow>
            <h1>{orgName}</h1>
            <p>{industry} • Executive decision workspace. Quantified claims below come from assessment scores and stated targets; peer and financial claims require separate evidence.</p>
            <HeroMetrics>
              <HeroMetric><div className="label">Current maturity</div><div className="value">{overallCurrent === null ? '—' : `${overallCurrent.toFixed(1)} / 5`}</div><div className="sub">Assessment-derived</div></HeroMetric>
              <HeroMetric><div className="label">Average stated target</div><div className="value">{overallTarget === null ? '—' : `${overallTarget.toFixed(1)} / 5`}</div><div className="sub">From target-state evidence</div></HeroMetric>
              <HeroMetric><div className="label">Gap to target</div><div className="value">{overallGap === null ? '—' : Math.max(0, overallGap).toFixed(1)}</div><div className="sub">Target minus current</div></HeroMetric>
            </HeroMetrics>
          </Hero>

          <DecisionGrid>
            <DecisionCard initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}><div className="icon"><FiTarget /></div><div className="label">Decision now</div><h3>{first ? `Prioritize ${first.name}` : 'Define the target state'}</h3><p>{first?.gap !== null && first ? `${Math.max(0, first.gap).toFixed(1)} point gap to the stated target.` : 'A target is required before a gap-based priority can be assigned.'}</p></DecisionCard>
            <DecisionCard initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .04 }}><div className="icon"><FiBarChart2 /></div><div className="label">Evidence</div><h3>{findings[0] || 'Assessment scores and target gaps'}</h3><p>Open the evidence report for methodology and claim provenance. Missing peer data is shown as unavailable, not estimated.</p></DecisionCard>
            <DecisionCard initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .08 }}><div className="icon"><FiShield /></div><div className="label">Risk to resolve</div><h3>{top[1] ? `${top[1].name} is the next-largest target gap` : 'Validate dependencies and blockers'}</h3><p>{top[1]?.gap !== null && top[1] ? `${Math.max(0, top[1].gap).toFixed(1)} point gap.` : 'Use assessment pain points and architecture dependencies to qualify execution risk.'}</p></DecisionCard>
            <DecisionCard initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .12 }}><div className="icon"><FiArrowRight /></div><div className="label">Next action</div><h3>{nextAction}</h3><p>Confirm an owner, success measure, and dependency path before committing delivery scope.</p></DecisionCard>
          </DecisionGrid>

          <Section>
            <h2><FiTrendingUp /> Decision stack</h2>
            <p>Priorities are ordered by the current-to-target maturity gap. This is a sequencing signal, not a financial ranking.</p>
            <Stack>
              {top.length ? top.map((item, index) => (
                <Priority key={item.id} onClick={() => document.getElementById('architecture-change-map')?.scrollIntoView({ behavior: 'smooth' })}>
                  <span className="rank">{index + 1}</span>
                  <div><strong>{item.name}</strong><span>{item.status || 'Target-state gap requires action planning'}</span></div>
                  <Gap>{Math.max(0, item.gap).toFixed(1)} gap</Gap>
                </Priority>
              )) : <EvidenceNotice><FiAlertCircle /><div>No positive current-to-target gaps are available. Validate target-state responses before creating a transformation sequence.</div></EvidenceNotice>}
            </Stack>
          </Section>

          <div id="architecture-change-map" style={{ marginBottom: 20 }}><ArchitectureDiffPanel pillarAnalysis={analysis} /></div>

          <Section>
            <h2><FiCheckCircle /> Evidence before commitment</h2>
            <p>Use the Decision Room to separate what ScoreX knows from what still requires validation.</p>
            <EvidenceNotice><FiShield size={20} /><div><strong>Trust boundary:</strong> maturity scores and target gaps are assessment-derived. Peer statistics require a verified external dataset. Dollar value, ROI, and payback require customer baselines and explicit scenario assumptions.</div></EvidenceNotice>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 16 }}>
              <Button $primary onClick={() => navigate(`/benchmarks/${assessmentId}`)}><FiShield /> Open Evidence Report</Button>
              <Button onClick={() => navigate(`/results/${assessmentId}`)}><FiFileText /> Inspect Full Assessment</Button>
              <Button onClick={() => navigate('/workflow-demo')}><FiPlay /> Replay 3‑Minute Demo</Button>
            </div>
          </Section>
        </Shell>
      </Page>
      <Footer />
    </>
  );
};

export default ExecutiveCommandCenter;
