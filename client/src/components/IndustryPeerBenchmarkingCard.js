import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiAlertCircle, FiBarChart2, FiCheckCircle, FiTarget } from 'react-icons/fi';
import dynamicAssessmentService from '../services/dynamicAssessmentService';

const Card = styled(motion.div)`
  background: ${props => props.$theme === 'dark' ? 'rgba(15, 23, 42, 0.82)' : '#fff'};
  color: ${props => props.$theme === 'dark' ? '#f8fafc' : '#0f172a'};
  border: 1px solid ${props => props.$theme === 'dark' ? 'rgba(255,255,255,.12)' : '#e2e8f0'};
  border-radius: 18px;
  padding: 28px;
  margin-bottom: 32px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const Title = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  h3 { margin: 0 0 4px; font-size: 1.25rem; }
  p { margin: 0; color: #64748b; font-size: .88rem; }
`;

const Badge = styled.span`
  padding: 6px 10px;
  border-radius: 999px;
  background: #eef2ff;
  color: #4338ca;
  font-size: .75rem;
  font-weight: 800;
`;

const Notice = styled.div`
  display: flex;
  gap: 10px;
  align-items: flex-start;
  padding: 14px 16px;
  border-radius: 12px;
  background: #fffbeb;
  border: 1px solid #fde68a;
  color: #92400e;
  margin-bottom: 20px;
  font-size: .86rem;
  line-height: 1.5;
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 20px;
  @media (max-width: 760px) { grid-template-columns: 1fr; }
`;

const Metric = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
  background: ${props => props.$theme === 'dark' ? 'rgba(30,41,59,.55)' : '#f8fafc'};
  .label { font-size: .72rem; text-transform: uppercase; color: #64748b; font-weight: 800; }
  .value { font-size: 1.7rem; font-weight: 900; margin-top: 5px; }
  .sub { color: #64748b; font-size: .78rem; margin-top: 4px; }
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
  align-items: center;
  border-bottom: 1px solid #e2e8f0;
  font-size: .84rem;
  &:last-child { border-bottom: none; }
  &.header { background: #f8fafc; font-weight: 800; color: #475569; }
  @media (max-width: 760px) { grid-template-columns: 1.5fr 1fr 1fr; .optional { display: none; } }
`;

const fmt = value => Number.isFinite(Number(value)) ? Number(value).toFixed(1) : '—';

const IndustryPeerBenchmarkingCard = ({ instanceId, defaultIndustry = 'Industry not specified', theme = 'light' }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(Boolean(instanceId));

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!instanceId) return;
      try {
        setLoading(true);
        const response = await dynamicAssessmentService.getBenchmarks(instanceId, defaultIndustry);
        if (active) setData(response?.success ? response : null);
      } catch (error) {
        console.error('Failed to load assessment positioning:', error);
        if (active) setData(null);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, [instanceId, defaultIndustry]);

  if (!instanceId) return null;

  const dimensions = data?.dimensionBenchmarks || [];
  const current = data?.overallCurrent;
  const target = data?.overallTarget;
  const gap = data?.gapToTarget;

  return (
    <Card $theme={theme} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Header>
        <Title>
          <FiBarChart2 size={28} />
          <div>
            <h3>Assessment Positioning</h3>
            <p>Current maturity compared with your stated target — not a synthetic peer ranking.</p>
          </div>
        </Title>
        <Badge>PROVENANCE V1</Badge>
      </Header>

      <Notice>
        <FiAlertCircle size={20} />
        <div>
          <strong>External peer benchmark not connected.</strong><br />
          {data?.methodology?.disclaimer || 'Peer percentile, industry average and top-quartile statistics are not reported without a verified source dataset.'}
        </div>
      </Notice>

      {loading ? (
        <div>Loading assessment evidence…</div>
      ) : (
        <>
          <SummaryGrid>
            <Metric $theme={theme}>
              <div className="label">Current maturity</div>
              <div className="value">{fmt(current)} / 5</div>
              <div className="sub">Assessment-derived</div>
            </Metric>
            <Metric $theme={theme}>
              <div className="label">Stated target</div>
              <div className="value">{fmt(target)} / 5</div>
              <div className="sub">From future-state responses</div>
            </Metric>
            <Metric $theme={theme}>
              <div className="label">Gap to target</div>
              <div className="value">{fmt(gap)}</div>
              <div className="sub">Target minus current</div>
            </Metric>
          </SummaryGrid>

          <Table>
            <Row className="header">
              <span>Dimension</span><span>Current</span><span>Target</span><span className="optional">Gap</span><span className="optional">Status</span>
            </Row>
            {dimensions.length ? dimensions.map((dimension) => (
              <Row key={dimension.dimensionId || dimension.dimension}>
                <strong>{dimension.dimension}</strong>
                <span>{fmt(dimension.currentScore)}</span>
                <span>{fmt(dimension.targetScore)}</span>
                <span className="optional">{fmt(dimension.gapToTarget)}</span>
                <span className="optional">{dimension.status}</span>
              </Row>
            )) : (
              <Row><span>No dimension evidence available.</span><span>—</span><span>—</span><span className="optional">—</span><span className="optional">—</span></Row>
            )}
          </Table>

          <div style={{ marginTop: 16, display: 'flex', gap: 8, alignItems: 'center', color: '#64748b', fontSize: '.8rem' }}>
            <FiCheckCircle /> <span>Only assessment-derived scores are quantified. <FiTarget style={{ verticalAlign: 'middle' }} /> Peer metrics remain unavailable until sourced.</span>
          </div>
        </>
      )}
    </Card>
  );
};

export default IndustryPeerBenchmarkingCard;
