import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiAlertCircle, FiBarChart2, FiDollarSign, FiTarget } from 'react-icons/fi';

const Container = styled(motion.div)`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 28px;
  margin-bottom: 28px;
  box-shadow: 0 4px 18px rgba(15, 23, 42, .05);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
  flex-wrap: wrap;
  margin-bottom: 18px;
  h2 { margin: 0 0 5px; color: #0f172a; font-size: 1.3rem; }
  p { margin: 0; color: #64748b; font-size: .85rem; }
`;

const Badge = styled.span`
  padding: 6px 10px;
  border-radius: 999px;
  background: #f1f5f9;
  color: #475569;
  font-weight: 800;
  font-size: .72rem;
`;

const Notice = styled.div`
  display: flex;
  gap: 10px;
  background: #fffbeb;
  border: 1px solid #fde68a;
  color: #92400e;
  border-radius: 12px;
  padding: 14px 16px;
  font-size: .84rem;
  line-height: 1.5;
  margin-bottom: 20px;
`;

const Metrics = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 13px;
  margin-bottom: 20px;
  @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 520px) { grid-template-columns: 1fr; }
`;

const Metric = styled.div`
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  border-radius: 12px;
  padding: 15px;
  .label { font-size: .7rem; color: #64748b; font-weight: 800; text-transform: uppercase; }
  .value { font-size: 1.5rem; color: #0f172a; font-weight: 900; margin-top: 6px; }
  .sub { font-size: .72rem; color: #64748b; margin-top: 4px; }
`;

const Table = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 2fr repeat(3, 1fr) 1.6fr;
  gap: 10px;
  padding: 11px 14px;
  align-items: center;
  border-bottom: 1px solid #e2e8f0;
  font-size: .82rem;
  &:last-child { border-bottom: none; }
  &.header { background: #f8fafc; color: #475569; font-weight: 800; }
  @media (max-width: 720px) { grid-template-columns: 1.5fr 1fr 1fr; .optional { display: none; } }
`;

const n = value => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};
const fmt = value => n(value) === null ? '—' : n(value).toFixed(1);
const money = value => n(value) === null ? 'Not modeled' : new Intl.NumberFormat('en-US', {
  style: 'currency', currency: 'USD', maximumFractionDigits: 0
}).format(n(value));

function dimensionRows(pillarScores = {}, framework = null, overallCurrent = null, overallTarget = null) {
  const dimensions = Array.isArray(framework?.dimensions) && framework.dimensions.length
    ? framework.dimensions
    : Object.keys(pillarScores || {}).map(id => ({ id, name: pillarScores[id]?.name || id.replace(/_/g, ' ') }));

  return dimensions.map(dimension => {
    const raw = pillarScores?.[dimension.id] ?? pillarScores?.[dimension.name];
    const current = n(typeof raw === 'number' ? raw : raw?.score ?? raw?.current ?? raw?.currentScore ?? overallCurrent);
    const target = n(typeof raw === 'object' ? raw?.targetScore ?? raw?.futureScore ?? raw?.future ?? raw?.target ?? overallTarget : overallTarget);
    const gap = current !== null && target !== null ? target - current : null;
    const status = gap === null ? 'Target not supplied' : gap <= 0 ? 'At/above target' : gap <= .5 ? 'Near target' : gap <= 1.25 ? 'Moderate gap' : 'Priority gap';
    return { id: dimension.id, name: dimension.name || dimension.id, current, target, gap, status };
  });
}

const FinancialImpactCard = ({
  pillarScores = {},
  framework = null,
  overallCurrent = null,
  overallTarget = null,
  financialModel = null
}) => {
  const rows = dimensionRows(pillarScores, framework, overallCurrent, overallTarget);
  const currentValues = rows.map(row => row.current).filter(value => value !== null);
  const targetValues = rows.map(row => row.target).filter(value => value !== null);
  const current = currentValues.length ? currentValues.reduce((sum, value) => sum + value, 0) / currentValues.length : n(overallCurrent);
  const target = targetValues.length ? targetValues.reduce((sum, value) => sum + value, 0) / targetValues.length : n(overallTarget);
  const gap = current !== null && target !== null ? target - current : null;

  const suppliedScenario = financialModel && (
    financialModel.provenance?.type === 'scenario-estimate' ||
    financialModel.provenance?.type === 'customer-provided' ||
    Array.isArray(financialModel.assumptions)
  );

  return (
    <Container initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Header>
        <div>
          <h2><FiDollarSign style={{ verticalAlign: 'middle', marginRight: 8 }} />Financial Impact Readiness</h2>
          <p>Maturity evidence and financial evidence are intentionally kept separate.</p>
        </div>
        <Badge>BASELINE REQUIRED</Badge>
      </Header>

      <Notice>
        <FiAlertCircle size={20} />
        <div><strong>A maturity gap does not imply a dollar value.</strong> ScoreX will not convert score gaps into savings, ROI, payback, revenue, or dollar-at-risk without customer baseline data and explicit scenario assumptions.</div>
      </Notice>

      <Metrics>
        <Metric><div className="label">Current maturity</div><div className="value">{fmt(current)} / 5</div><div className="sub">Assessment-derived</div></Metric>
        <Metric><div className="label">Stated target</div><div className="value">{fmt(target)} / 5</div><div className="sub">From target-state evidence</div></Metric>
        <Metric><div className="label">Gap to target</div><div className="value">{fmt(gap)}</div><div className="sub">Target minus current</div></Metric>
        <Metric><div className="label">Financial model</div><div className="value" style={{ fontSize: '1.05rem' }}>{suppliedScenario ? 'Supplied scenario' : 'Not modeled'}</div><div className="sub">Use the Scenario Value Model with customer baselines</div></Metric>
      </Metrics>

      {suppliedScenario && (
        <Metrics>
          <Metric><div className="label">Annual modeled benefit</div><div className="value" style={{ fontSize: '1.15rem' }}>{money(financialModel.annualBenefit)}</div><div className="sub">Scenario estimate</div></Metric>
          <Metric><div className="label">Net modeled value</div><div className="value" style={{ fontSize: '1.15rem' }}>{money(financialModel.netValue)}</div><div className="sub">Scenario estimate</div></Metric>
          <Metric><div className="label">Scenario ROI</div><div className="value" style={{ fontSize: '1.15rem' }}>{n(financialModel.roiPct) === null ? 'Not modeled' : `${n(financialModel.roiPct).toFixed(0)}%`}</div><div className="sub">Only from supplied model</div></Metric>
          <Metric><div className="label">Scenario payback</div><div className="value" style={{ fontSize: '1.15rem' }}>{n(financialModel.paybackMonths) === null ? 'Not modeled' : `${n(financialModel.paybackMonths).toFixed(1)} mo`}</div><div className="sub">Only from supplied model</div></Metric>
        </Metrics>
      )}

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10, color: '#334155', fontWeight: 800 }}><FiBarChart2 /> Assessment evidence by dimension</div>
      <Table>
        <Row className="header"><span>Dimension</span><span>Current</span><span>Target</span><span className="optional">Gap</span><span className="optional">Status</span></Row>
        {rows.length ? rows.map(row => (
          <Row key={row.id || row.name}>
            <strong>{row.name}</strong><span>{fmt(row.current)}</span><span>{fmt(row.target)}</span><span className="optional">{fmt(row.gap)}</span><span className="optional">{row.status}</span>
          </Row>
        )) : <Row><span>No scored dimensions available.</span><span>—</span><span>—</span><span className="optional">—</span><span className="optional">—</span></Row>}
      </Table>

      <div style={{ marginTop: 14, color: '#64748b', fontSize: '.78rem' }}><FiTarget style={{ verticalAlign: 'middle', marginRight: 6 }} />Use score gaps to prioritize discovery. Use measured customer baselines to build the financial case.</div>
    </Container>
  );
};

export default FinancialImpactCard;
