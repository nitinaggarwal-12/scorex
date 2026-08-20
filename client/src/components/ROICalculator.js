import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiAlertCircle, FiDollarSign, FiInfo, FiRefreshCw, FiTrendingUp } from 'react-icons/fi';

const Container = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 36px;
  box-shadow: 0 4px 18px rgba(15, 23, 42, .06);
  @media (max-width: 720px) { padding: 20px; }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
  margin-bottom: 18px;
  flex-wrap: wrap;
  h2 { margin: 0 0 6px; font-size: 1.5rem; color: #0f172a; }
  p { margin: 0; color: #64748b; }
`;

const ResetButton = styled.button`
  border: 1px solid #cbd5e1;
  background: white;
  color: #475569;
  border-radius: 9px;
  padding: 9px 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 7px;
  cursor: pointer;
`;

const Notice = styled.div`
  display: flex;
  gap: 10px;
  padding: 14px 16px;
  border: 1px solid #bfdbfe;
  background: #eff6ff;
  color: #1e40af;
  border-radius: 12px;
  line-height: 1.5;
  font-size: .86rem;
  margin-bottom: 24px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  @media (max-width: 720px) { grid-template-columns: 1fr; }
`;

const Field = styled.label`
  display: block;
  padding: 15px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  span { display: block; font-size: .78rem; color: #475569; font-weight: 800; margin-bottom: 8px; }
  small { color: #64748b; font-size: .72rem; }
`;

const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 10px 11px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 1rem;
  margin-bottom: 5px;
  &:focus { outline: 2px solid #bfdbfe; border-color: #3b82f6; }
`;

const Results = styled(motion.div)`
  margin-top: 24px;
  padding: 22px;
  border-radius: 14px;
  background: #0f172a;
  color: white;
`;

const ResultGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  @media (max-width: 720px) { grid-template-columns: 1fr; }
`;

const Result = styled.div`
  background: rgba(255,255,255,.08);
  border: 1px solid rgba(255,255,255,.13);
  border-radius: 10px;
  padding: 15px;
  .label { font-size: .7rem; opacity: .75; text-transform: uppercase; font-weight: 800; }
  .value { font-size: 1.55rem; font-weight: 900; margin-top: 6px; }
  .sub { font-size: .72rem; opacity: .72; margin-top: 4px; }
`;

const Provenance = styled.div`
  margin-top: 18px;
  padding-top: 16px;
  border-top: 1px solid rgba(255,255,255,.14);
  font-size: .78rem;
  line-height: 1.55;
  color: #cbd5e1;
`;

const INITIAL = {
  annualInfraCost: 0,
  annualEngineeringPayroll: 0,
  expectedInfraReductionPct: 0,
  expectedProductivityRecapturePct: 0,
  annualRevenueUplift: 0,
  implementationCost: 0,
  horizonYears: 3
};

const number = value => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
};

const formatMoney = value => new Intl.NumberFormat('en-US', {
  style: 'currency', currency: 'USD', maximumFractionDigits: 0
}).format(Number(value || 0));

const ROICalculator = () => {
  const [inputs, setInputs] = useState(INITIAL);

  const model = useMemo(() => {
    const infraSavings = inputs.annualInfraCost * (inputs.expectedInfraReductionPct / 100);
    const productivityValue = inputs.annualEngineeringPayroll * (inputs.expectedProductivityRecapturePct / 100);
    const annualBenefit = infraSavings + productivityValue + inputs.annualRevenueUplift;
    const totalBenefit = annualBenefit * inputs.horizonYears;
    const netValue = totalBenefit - inputs.implementationCost;
    const roiPct = inputs.implementationCost > 0
      ? ((totalBenefit - inputs.implementationCost) / inputs.implementationCost) * 100
      : null;
    const paybackMonths = inputs.implementationCost > 0 && annualBenefit > 0
      ? (inputs.implementationCost / annualBenefit) * 12
      : null;

    return { infraSavings, productivityValue, annualBenefit, totalBenefit, netValue, roiPct, paybackMonths };
  }, [inputs]);

  const setValue = (key, value) => setInputs(current => ({ ...current, [key]: number(value) }));
  const anyBaseline = Object.entries(inputs).some(([key, value]) => key !== 'horizonYears' && Number(value) > 0);

  return (
    <Container>
      <Header>
        <div>
          <h2><FiDollarSign style={{ verticalAlign: 'middle', marginRight: 8 }} />Scenario Value Model</h2>
          <p>Transparent arithmetic from customer-entered baselines — not a forecast or industry benchmark.</p>
        </div>
        <ResetButton onClick={() => setInputs(INITIAL)}><FiRefreshCw /> Reset</ResetButton>
      </Header>

      <Notice>
        <FiAlertCircle size={20} />
        <div><strong>No default savings assumptions are applied.</strong> Enter your own cost baselines and expected improvement percentages. ScoreX does not infer dollars, ROI, or payback from maturity scores.</div>
      </Notice>

      <Grid>
        <Field><span>Annual infrastructure cost ($)</span><Input type="number" min="0" value={inputs.annualInfraCost} onChange={e => setValue('annualInfraCost', e.target.value)} /><small>Customer-provided baseline.</small></Field>
        <Field><span>Annual data/engineering payroll ($)</span><Input type="number" min="0" value={inputs.annualEngineeringPayroll} onChange={e => setValue('annualEngineeringPayroll', e.target.value)} /><small>Only the payroll scope relevant to this scenario.</small></Field>
        <Field><span>Expected infrastructure reduction (%)</span><Input type="number" min="0" max="100" value={inputs.expectedInfraReductionPct} onChange={e => setValue('expectedInfraReductionPct', Math.min(100, number(e.target.value)))} /><small>User assumption; validate with workload benchmarks.</small></Field>
        <Field><span>Expected productivity recapture (%)</span><Input type="number" min="0" max="100" value={inputs.expectedProductivityRecapturePct} onChange={e => setValue('expectedProductivityRecapturePct', Math.min(100, number(e.target.value)))} /><small>User assumption; define how recaptured time becomes value.</small></Field>
        <Field><span>Annual revenue / value uplift ($)</span><Input type="number" min="0" value={inputs.annualRevenueUplift} onChange={e => setValue('annualRevenueUplift', e.target.value)} /><small>Optional customer assumption; ScoreX does not estimate it.</small></Field>
        <Field><span>One-time implementation cost ($)</span><Input type="number" min="0" value={inputs.implementationCost} onChange={e => setValue('implementationCost', e.target.value)} /><small>Include services, migration, enablement, and change costs as applicable.</small></Field>
        <Field><span>Model horizon (years)</span><Input type="number" min="1" max="10" value={inputs.horizonYears} onChange={e => setValue('horizonYears', Math.max(1, Math.min(10, number(e.target.value))))} /><small>Time horizon only; no growth/escalation is assumed.</small></Field>
      </Grid>

      <Results initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {!anyBaseline ? (
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}><FiInfo /> Enter baseline values to calculate a scenario.</div>
        ) : (
          <>
            <ResultGrid>
              <Result><div className="label">Annual modeled benefit</div><div className="value">{formatMoney(model.annualBenefit)}</div><div className="sub">Infra savings + productivity value + entered uplift</div></Result>
              <Result><div className="label">Net value ({inputs.horizonYears} yrs)</div><div className="value">{formatMoney(model.netValue)}</div><div className="sub">Total modeled benefit minus implementation cost</div></Result>
              <Result><div className="label">Scenario ROI</div><div className="value">{model.roiPct === null ? '—' : `${model.roiPct.toFixed(0)}%`}</div><div className="sub">Shown only when implementation cost is supplied</div></Result>
              <Result><div className="label">Infra component</div><div className="value">{formatMoney(model.infraSavings)}</div><div className="sub">Baseline × entered reduction %</div></Result>
              <Result><div className="label">Productivity component</div><div className="value">{formatMoney(model.productivityValue)}</div><div className="sub">Payroll × entered recapture %</div></Result>
              <Result><div className="label">Scenario payback</div><div className="value">{model.paybackMonths === null ? '—' : `${model.paybackMonths.toFixed(1)} mo`}</div><div className="sub">Implementation cost ÷ annual modeled benefit</div></Result>
            </ResultGrid>
            <Provenance><FiTrendingUp style={{ verticalAlign: 'middle', marginRight: 6 }} /><strong>Provenance:</strong> baseline dollars and improvement percentages are customer/user-provided inputs; calculated outputs are scenario estimates. They are not measured savings, commitments, or external benchmarks.</Provenance>
          </>
        )}
      </Results>
    </Container>
  );
};

export default ROICalculator;
