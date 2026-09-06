import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { FiArrowRight, FiCheckCircle, FiLayers, FiTarget, FiZap } from 'react-icons/fi';

const Panel = styled.section`
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  overflow: hidden;
`;

const Header = styled.div`
  padding: 22px 24px 18px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
  flex-wrap: wrap;
  h2 { margin: 0 0 5px; color: #0f172a; font-size: 1.25rem; }
  p { margin: 0; color: #64748b; font-size: .86rem; line-height: 1.5; }
`;

const FilterRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const Filter = styled.button`
  border: 1px solid ${props => props.$active ? '#2563eb' : '#cbd5e1'};
  background: ${props => props.$active ? '#eff6ff' : '#fff'};
  color: ${props => props.$active ? '#1d4ed8' : '#475569'};
  border-radius: 999px;
  padding: 7px 11px;
  font-size: .74rem;
  font-weight: 800;
  cursor: pointer;
`;

const Body = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(300px, .75fr);
  min-height: 360px;
  @media (max-width: 860px) { grid-template-columns: 1fr; }
`;

const List = styled.div`
  border-right: 1px solid #e2e8f0;
  @media (max-width: 860px) { border-right: 0; border-bottom: 1px solid #e2e8f0; }
`;

const Row = styled.button`
  width: 100%;
  border: 0;
  border-bottom: 1px solid #eef2f7;
  background: ${props => props.$active ? '#f8fafc' : '#fff'};
  padding: 15px 18px;
  display: grid;
  grid-template-columns: minmax(160px, 1.6fr) .7fr 28px .7fr .9fr;
  gap: 10px;
  align-items: center;
  text-align: left;
  cursor: pointer;
  color: #334155;
  &:hover { background: #f8fafc; }
  &:last-child { border-bottom: 0; }
  strong { color: #0f172a; font-size: .86rem; }
  .score { font-variant-numeric: tabular-nums; font-weight: 800; color: #334155; }
  @media (max-width: 620px) {
    grid-template-columns: 1.5fr .6fr 24px .6fr;
    .classification { display: none; }
  }
`;

const ChangePill = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  padding: 5px 8px;
  font-size: .68rem;
  font-weight: 900;
  background: ${props => ({
    Transform: '#fef2f2',
    Modernize: '#fff7ed',
    Optimize: '#eff6ff',
    Maintain: '#f0fdf4',
    'Target needed': '#f8fafc'
  }[props.$type] || '#f8fafc')};
  color: ${props => ({
    Transform: '#b91c1c',
    Modernize: '#c2410c',
    Optimize: '#1d4ed8',
    Maintain: '#15803d',
    'Target needed': '#64748b'
  }[props.$type] || '#64748b')};
`;

const Detail = styled.aside`
  padding: 22px;
  background: #fbfdff;
  h3 { margin: 0 0 8px; color: #0f172a; }
`;

const ScoreFlow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 16px 0 18px;
`;

const ScoreBox = styled.div`
  flex: 1;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #fff;
  padding: 13px;
  .label { color: #64748b; font-size: .68rem; font-weight: 900; text-transform: uppercase; }
  .value { color: #0f172a; font-size: 1.45rem; font-weight: 900; margin-top: 4px; }
`;

const Evidence = styled.div`
  border-top: 1px solid #e2e8f0;
  padding-top: 16px;
  display: grid;
  gap: 13px;
`;

const EvidenceItem = styled.div`
  display: grid;
  grid-template-columns: 22px 1fr;
  gap: 9px;
  color: #475569;
  font-size: .82rem;
  line-height: 1.5;
  strong { color: #334155; }
`;

const Empty = styled.div`
  padding: 34px;
  color: #64748b;
  text-align: center;
`;

const toNumber = value => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const classify = gap => {
  if (gap === null) return 'Target needed';
  if (gap <= 0) return 'Maintain';
  if (gap > 1.25) return 'Transform';
  if (gap > 0.5) return 'Modernize';
  return 'Optimize';
};

const ArchitectureDiffPanel = ({ pillarAnalysis = {} }) => {
  const rows = useMemo(() => Object.entries(pillarAnalysis || {}).map(([id, item]) => {
    const current = toNumber(item?.customerScore ?? item?.currentScore ?? item?.score);
    const target = toNumber(item?.targetScore ?? item?.futureScore ?? item?.target);
    const gap = current !== null && target !== null ? Number((target - current).toFixed(2)) : null;
    return {
      id,
      name: item?.pillar || item?.name || id.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()),
      current,
      target,
      gap,
      type: classify(gap),
      status: item?.status || null
    };
  }).sort((a, b) => (b.gap ?? -999) - (a.gap ?? -999)), [pillarAnalysis]);

  const [filter, setFilter] = useState('All');
  const filtered = filter === 'All' ? rows : rows.filter(row => row.type === filter);
  const [selectedId, setSelectedId] = useState(null);
  const selected = rows.find(row => row.id === selectedId) || filtered[0] || rows[0] || null;
  const filters = ['All', 'Transform', 'Modernize', 'Optimize', 'Maintain'];

  return (
    <Panel>
      <Header>
        <div>
          <h2><FiLayers style={{ verticalAlign: 'middle', marginRight: 8 }} />Architecture Change Map</h2>
          <p>Interactive current → target diff derived from assessment evidence. Change class is based only on the stated maturity gap.</p>
        </div>
        <FilterRow>
          {filters.map(value => <Filter key={value} $active={filter === value} onClick={() => setFilter(value)}>{value}</Filter>)}
        </FilterRow>
      </Header>
      {!rows.length ? <Empty>No current/target pillar evidence is available yet.</Empty> : (
        <Body>
          <List>
            {filtered.length ? filtered.map(row => (
              <Row key={row.id} $active={selected?.id === row.id} onClick={() => setSelectedId(row.id)}>
                <strong>{row.name}</strong>
                <span className="score">{row.current === null ? '—' : row.current.toFixed(1)}</span>
                <FiArrowRight color="#94a3b8" />
                <span className="score">{row.target === null ? '—' : row.target.toFixed(1)}</span>
                <span className="classification"><ChangePill $type={row.type}>{row.type}</ChangePill></span>
              </Row>
            )) : <Empty>No pillars match this filter.</Empty>}
          </List>
          {selected && (
            <Detail>
              <ChangePill $type={selected.type}>{selected.type}</ChangePill>
              <h3>{selected.name}</h3>
              <ScoreFlow>
                <ScoreBox><div className="label">Current</div><div className="value">{selected.current === null ? '—' : selected.current.toFixed(1)}</div></ScoreBox>
                <FiArrowRight size={22} color="#64748b" />
                <ScoreBox><div className="label">Stated target</div><div className="value">{selected.target === null ? '—' : selected.target.toFixed(1)}</div></ScoreBox>
              </ScoreFlow>
              <Evidence>
                <EvidenceItem><FiTarget color="#2563eb" /><div><strong>Decision signal:</strong> {selected.gap === null ? 'Capture a target state before recommending a change class.' : `${Math.max(0, selected.gap).toFixed(1)} point gap to the stated target.`}</div></EvidenceItem>
                <EvidenceItem><FiZap color="#7c3aed" /><div><strong>Architecture action:</strong> {selected.type === 'Transform' ? 'Redesign the capability and validate dependencies before migration.' : selected.type === 'Modernize' ? 'Modernize the capability with an incremental target-state plan.' : selected.type === 'Optimize' ? 'Optimize the existing capability and close the remaining target gap.' : selected.type === 'Maintain' ? 'Preserve the capability and monitor it against the stated target.' : 'Define the target architecture and success criteria first.'}</div></EvidenceItem>
                <EvidenceItem><FiCheckCircle color="#16a34a" /><div><strong>Evidence rule:</strong> no dollar, vendor, or peer claim is inferred from this maturity gap.</div></EvidenceItem>
              </Evidence>
            </Detail>
          )}
        </Body>
      )}
    </Panel>
  );
};

export default ArchitectureDiffPanel;
