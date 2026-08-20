import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { FiAlertCircle, FiArrowLeft, FiBarChart2, FiCheckCircle, FiDatabase, FiPrinter, FiTarget } from 'react-icons/fi';
import * as assessmentService from '../services/assessmentService';
import Footer from './Footer';

const Page = styled.div`
  min-height: 100vh;
  background: #f8fafc;
  padding: 104px 24px 42px;
  @media print { padding: 0; background: white; }
`;

const Shell = styled.div`
  max-width: 1180px;
  margin: 0 auto;
`;

const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
  @media print { display: none; }
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #cbd5e1;
  background: white;
  color: #334155;
  border-radius: 9px;
  padding: 9px 13px;
  font-weight: 800;
  cursor: pointer;
`;

const Report = styled.main`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(15,23,42,.06);
  @media print { border: none; box-shadow: none; }
`;

const Hero = styled.header`
  padding: 32px;
  background: #0f172a;
  color: white;
  h1 { margin: 0 0 8px; font-size: 2rem; }
  p { margin: 0; color: #cbd5e1; }
`;

const Mode = styled.span`
  display: inline-block;
  margin-bottom: 12px;
  padding: 5px 9px;
  background: rgba(255,255,255,.1);
  border: 1px solid rgba(255,255,255,.18);
  border-radius: 999px;
  font-size: .72rem;
  font-weight: 900;
  letter-spacing: .04em;
`;

const Section = styled.section`
  padding: 28px 32px;
  border-bottom: 1px solid #e2e8f0;
  &:last-child { border-bottom: none; }
  h2 { margin: 0 0 16px; color: #0f172a; font-size: 1.25rem; display: flex; align-items: center; gap: 9px; }
`;

const Notice = styled.div`
  display: flex;
  gap: 10px;
  background: #fffbeb;
  border: 1px solid #fde68a;
  color: #92400e;
  padding: 14px 16px;
  border-radius: 12px;
  line-height: 1.5;
  font-size: .86rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  @media (max-width: 760px) { grid-template-columns: 1fr; }
`;

const Metric = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #f8fafc;
  padding: 17px;
  .label { color: #64748b; font-size: .72rem; font-weight: 900; text-transform: uppercase; }
  .value { color: #0f172a; font-size: 1.65rem; font-weight: 900; margin-top: 5px; }
  .sub { color: #64748b; font-size: .75rem; margin-top: 4px; }
`;

const Table = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 2fr repeat(3, 1fr) 1.5fr;
  gap: 10px;
  padding: 12px 14px;
  border-bottom: 1px solid #e2e8f0;
  align-items: center;
  font-size: .84rem;
  &:last-child { border-bottom: none; }
  &.header { background: #f8fafc; color: #475569; font-weight: 900; }
  @media (max-width: 720px) { grid-template-columns: 1.5fr 1fr 1fr; .optional { display: none; } }
`;

const List = styled.ul`
  margin: 0;
  padding-left: 20px;
  color: #334155;
  li { margin-bottom: 9px; line-height: 1.55; }
`;

const ProvenanceBox = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
  font-size: .82rem;
  line-height: 1.6;
  color: #475569;
  code { color: #4338ca; font-weight: 800; }
`;

const safeNumber = value => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};
const score = value => safeNumber(value) === null ? '—' : safeNumber(value).toFixed(1);

const IndustryBenchmarkingReport = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [benchmark, setBenchmark] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        setLoading(true);
        const [resultResponse, benchmarkResponse] = await Promise.all([
          assessmentService.getAssessmentResults(assessmentId),
          assessmentService.getBenchmarkReport(assessmentId)
        ]);
        if (!active) return;
        setResults(resultResponse?.data || resultResponse);
        setBenchmark(benchmarkResponse?.data || benchmarkResponse);
      } catch (loadError) {
        console.error('Failed to load evidence report:', loadError);
        if (active) setError(loadError.message || 'Failed to load report');
      } finally {
        if (active) setLoading(false);
      }
    };
    if (assessmentId) load();
    return () => { active = false; };
  }, [assessmentId]);

  const assessment = results?.assessmentInfo || results?.assessment || {};
  const pillarAnalysis = benchmark?.pillarAnalysis || {};
  const pillars = useMemo(() => Object.entries(pillarAnalysis), [pillarAnalysis]);
  const overallScore = safeNumber(benchmark?.metrics?.overallScore ?? results?.overall?.currentScore ?? results?.overallScore);
  const maturityIndex = safeNumber(benchmark?.metrics?.assessmentMaturityIndex);
  const verifiedPeer = benchmark?.methodology?.mode === 'verified-external-benchmark' && Boolean(benchmark?.methodology?.externalBenchmarkDataset);
  const methodology = benchmark?.methodology || {};
  const executiveSummary = benchmark?.executiveSummary || {};
  const strengths = benchmark?.competitiveIntelligence?.strengths || [];
  const vulnerabilities = benchmark?.competitiveIntelligence?.vulnerabilities || [];
  const recommendations = benchmark?.strategicRecommendations || {};

  const targetScores = pillars.map(([, item]) => safeNumber(item?.targetScore)).filter(value => value !== null);
  const avgTarget = targetScores.length ? targetScores.reduce((sum, value) => sum + value, 0) / targetScores.length : null;
  const gap = overallScore !== null && avgTarget !== null ? avgTarget - overallScore : null;

  if (loading) return <Page><Shell>Loading evidence report…</Shell></Page>;
  if (error) return <Page><Shell><Notice><FiAlertCircle />{error}</Notice></Shell></Page>;

  const findingList = Array.isArray(executiveSummary.keyFindings) ? executiveSummary.keyFindings : [];
  const recommendationItems = [...(recommendations.immediate || []), ...(recommendations.shortTerm || []), ...(recommendations.longTerm || [])];

  return (
    <>
      <Page>
        <Shell>
          <Actions>
            <Button onClick={() => navigate(`/executive/${assessmentId}`)}><FiArrowLeft /> Full Report</Button>
            <Button onClick={() => window.print()}><FiPrinter /> Print / Save PDF</Button>
          </Actions>

          <Report>
            <Hero>
              <Mode>{verifiedPeer ? 'VERIFIED EXTERNAL BENCHMARK' : 'ASSESSMENT-RELATIVE'}</Mode>
              <h1>{benchmark?.title || 'Assessment Positioning & Evidence Report'}</h1>
              <p>{assessment?.organizationName || assessment?.customerName || 'Organization'} • {assessment?.industry || 'Industry not specified'}</p>
            </Hero>

            <Section>
              <Notice>
                <FiAlertCircle size={20} />
                <div><strong>{verifiedPeer ? 'Verified external benchmark connected.' : 'No verified external peer dataset connected.'}</strong><br />
                {methodology.disclaimer || 'Peer percentile, industry average, top-quartile, sample-size, and confidence statistics are not reported without source evidence.'}</div>
              </Notice>
            </Section>

            <Section>
              <h2><FiBarChart2 /> Assessment position</h2>
              <Grid>
                <Metric><div className="label">Overall maturity score</div><div className="value">{score(overallScore)} / 5</div><div className="sub">Assessment-derived</div></Metric>
                <Metric><div className="label">Framework maturity index</div><div className="value">{maturityIndex === null ? '—' : `${maturityIndex.toFixed(0)}%`}</div><div className="sub">Score ÷ 5; this is not a peer percentile</div></Metric>
                <Metric><div className="label">Average gap to stated target</div><div className="value">{score(gap)}</div><div className="sub">Target minus current where target evidence exists</div></Metric>
              </Grid>
            </Section>

            <Section>
              <h2><FiTarget /> Pillar evidence</h2>
              <Table>
                <Row className="header"><span>Pillar</span><span>Current</span><span>Target</span><span className="optional">Gap</span><span className="optional">Status</span></Row>
                {pillars.length ? pillars.map(([id, item]) => (
                  <Row key={id}>
                    <strong>{item?.pillar || id.replace(/_/g, ' ')}</strong>
                    <span>{score(item?.customerScore)}</span>
                    <span>{score(item?.targetScore)}</span>
                    <span className="optional">{score(item?.gapToTarget)}</span>
                    <span className="optional">{item?.status || '—'}</span>
                  </Row>
                )) : <Row><span>No pillar evidence available.</span><span>—</span><span>—</span><span className="optional">—</span><span className="optional">—</span></Row>}
              </Table>
            </Section>

            <Section>
              <h2><FiCheckCircle /> Executive evidence summary</h2>
              <p style={{ color: '#334155', lineHeight: 1.65, fontWeight: 700 }}>{executiveSummary.headline || 'Assessment-derived maturity positioning.'}</p>
              {findingList.length > 0 && <List>{findingList.map((finding, index) => <li key={index}>{finding}</li>)}</List>}
              {executiveSummary.marketContext && <p style={{ color: '#64748b', lineHeight: 1.6 }}>{executiveSummary.marketContext}</p>}
            </Section>

            {(strengths.length > 0 || vulnerabilities.length > 0) && (
              <Section>
                <h2><FiDatabase /> Evidence-backed observations</h2>
                <Grid>
                  <div><strong style={{ color: '#166534' }}>Relative strengths</strong><List>{strengths.map((item, index) => <li key={index}><strong>{item.pillar || item.area || 'Area'}:</strong> {item.evidence || item.implication || 'Assessment-relative strength.'}</li>)}</List></div>
                  <div><strong style={{ color: '#991b1b' }}>Target gaps</strong><List>{vulnerabilities.map((item, index) => <li key={index}><strong>{item.pillar || item.area || 'Area'}:</strong> {item.evidence || item.implication || 'Target-state gap.'}</li>)}</List></div>
                  <div><strong style={{ color: '#1e40af' }}>Financial impact</strong><p style={{ color: '#64748b', lineHeight: 1.55 }}>{benchmark?.businessImpact?.disclaimer || 'Financial impact requires customer baseline costs and explicit scenario assumptions.'}</p></div>
                </Grid>
              </Section>
            )}

            {recommendationItems.length > 0 && (
              <Section>
                <h2><FiTarget /> Recommended next actions</h2>
                <List>{recommendationItems.map((item, index) => <li key={index}><strong>{item.action || item.title || 'Action'}</strong>{item.rationale ? ` — ${item.rationale}` : ''}{item.expectedImpact ? ` ${item.expectedImpact}` : ''}</li>)}</List>
              </Section>
            )}

            <Section>
              <h2><FiDatabase /> Methodology & provenance</h2>
              <ProvenanceBox>
                <div><strong>Mode:</strong> {methodology.mode || 'assessment-relative'}</div>
                <div><strong>Data source:</strong> {methodology.dataSource || 'ScoreX assessment responses and scoring framework'}</div>
                <div><strong>Peer dataset:</strong> {verifiedPeer ? 'Connected with source records' : 'Not connected'}</div>
                <div><strong>Sample size:</strong> {methodology.sampleSize ?? 'Not applicable without a verified peer dataset'}</div>
                <div><strong>Confidence level:</strong> {methodology.confidenceLevel ?? 'Not applicable without a verified peer dataset'}</div>
                <div><strong>Claim policy:</strong> <code>{methodology.claimPolicy || benchmark?.provenance?.policy || 'provenance-v1'}</code></div>
                <div style={{ marginTop: 8 }}><strong>Financial rule:</strong> maturity scores prioritize gaps; customer baselines and explicit assumptions are required to calculate monetary scenarios.</div>
              </ProvenanceBox>
            </Section>
          </Report>
        </Shell>
      </Page>
      <Footer />
    </>
  );
};

export default IndustryBenchmarkingReport;
