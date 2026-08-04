import { X, AlertTriangle, ArrowRight, Check, TrendingUp, Layers } from 'lucide-react';

export default function VersionDiffModal({ isOpen, onClose, session, v1Name, v2Name }) {
  if (!isOpen || !session) return null;

  const ver1 = session.versions.find(v => v.version === v1Name);
  const ver2 = session.versions.find(v => v.version === v2Name);

  if (!ver1 || !ver2) {
    return (
      <div className="modal-backdrop" onClick={onClose}>
        <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Select Valid Versions</h3>
            <button onClick={onClose} aria-label="Close version comparison" style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><X size={20} aria-hidden="true" /></button>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Please select two different versions of this blueprint to compare.</p>
        </div>
      </div>
    );
  }

  const f1 = ver1.formData || {};
  const f2 = ver2.formData || {};
  const r1 = ver1.rawResponse || {};
  const r2 = ver2.rawResponse || {};

  // Extract scores
  const s1 = r1.scoring?.scores || {};
  const s2 = r2.scoring?.scores || {};

  const renderScoreRow = (label, val1, val2) => {
    const diff = val2 - val1;
    let deltaColor = 'var(--text-secondary)';
    let deltaText = '±0';
    if (diff > 0) { deltaColor = 'var(--google-green)'; deltaText = `+${diff}`; }
    else if (diff < 0) { deltaColor = 'var(--google-red)'; deltaText = `${diff}`; }

    return (
      <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
        <td style={{ padding: '0.75rem 0.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{label}</td>
        <td style={{ padding: '0.75rem 0.5rem', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)' }}>{val1}/100</td>
        <td style={{ padding: '0.75rem 0.5rem', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>{val2}/100</td>
        <td style={{ padding: '0.75rem 0.5rem', fontSize: '0.9rem', fontWeight: 800, color: deltaColor }}>{deltaText}</td>
      </tr>
    );
  };

  const renderFormParamRow = (label, val1, val2) => {
    const isDifferent = JSON.stringify(val1) !== JSON.stringify(val2);
    return (
      <tr style={{ borderBottom: '1px solid var(--border-color)', background: isDifferent ? 'rgba(26, 115, 232, 0.02)' : 'transparent' }}>
        <td style={{ padding: '0.75rem 0.5rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{label}</td>
        <td style={{ padding: '0.75rem 0.5rem', fontSize: '0.82rem', color: 'var(--text-secondary)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={String(val1)}>{String(val1 || '—')}</td>
        <td style={{ padding: '0.75rem 0.5rem', fontSize: '0.82rem', color: isDifferent ? 'var(--google-blue)' : 'var(--text-primary)', fontWeight: isDifferent ? 700 : 500, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={String(val2)}>{String(val2 || '—')}</td>
        <td style={{ padding: '0.75rem 0.5rem', fontSize: '0.75rem', fontWeight: 700, color: isDifferent ? 'var(--google-blue)' : 'var(--text-secondary)' }}>
          {isDifferent ? 'CHANGED' : 'SAME'}
        </td>
      </tr>
    );
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 99 }}>
      <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: '960px', padding: '2rem' }}>
        {/* Header Banner */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>Comparing Versions: {v1Name}</span>
              <ArrowRight size={18} style={{ color: 'var(--text-secondary)' }} />
              <span style={{ color: 'var(--google-blue)' }}>{v2Name}</span>
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Usecase: <strong>{session.reportName}</strong> • ID: {session.reportId}
            </p>
          </div>
          <button onClick={onClose} aria-label="Close version comparison" className="btn btn-secondary" style={{ minWidth: 'auto', padding: '0.4rem' }}>
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxHeight: '65vh', overflowY: 'auto', paddingRight: '0.5rem' }}>
          
          {/* 1. Score Deltas Card */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={18} style={{ color: 'var(--google-blue)' }} />
              <span>Feasibility Score Comparisons & Deltas</span>
            </h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                  <th style={{ padding: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Dimension</th>
                  <th style={{ padding: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{v1Name} Score</th>
                  <th style={{ padding: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{v2Name} Score</th>
                  <th style={{ padding: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Score Delta</th>
                </tr>
              </thead>
              <tbody>
                {renderScoreRow('Overall Fit Index', r1.scoring?.overallFit || 0, r2.scoring?.overallFit || 0)}
                {renderScoreRow('Technical Feasibility', s1.technical || 0, s2.technical || 0)}
                {renderScoreRow('Business Value / ROI', s1.business || 0, s2.business || 0)}
                {renderScoreRow('Transformation Ease', s1.migration || 0, s2.migration || 0)}
                {renderScoreRow('Time to Value', s1.timeToValue || 0, s2.timeToValue || 0)}
                {renderScoreRow('Risk & Safety Profile', s1.risk || 0, s2.risk || 0)}
              </tbody>
            </table>
          </div>

          {/* 2. Form Parameter Changes */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layers size={18} style={{ color: 'var(--google-green)' }} />
              <span>Form Intake Variable Deltas</span>
            </h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                  <th style={{ padding: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Parameter Name</th>
                  <th style={{ padding: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Value in {v1Name}</th>
                  <th style={{ padding: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Value in {v2Name}</th>
                  <th style={{ padding: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {renderFormParamRow('Timeline', f1.timeline, f2.timeline)}
                {renderFormParamRow('Executive Sponsor', f1.execSponsor, f2.execSponsor)}
                {renderFormParamRow('Legacy Platform', f1.currentPlatform || 'None', f2.currentPlatform || 'None')}
                {renderFormParamRow('Legacy Data Source', f1.currentDataSource || 'None', f2.currentDataSource || 'None')}
                {renderFormParamRow('Data stack', f1.dataStack?.join(', '), f2.dataStack?.join(', '))}
                {renderFormParamRow('Annual Spend Scale', f1.annualSpend, f2.annualSpend)}
                {renderFormParamRow('Urgency Multiplier', f1.urgency, f2.urgency)}
              </tbody>
            </table>
          </div>

          {/* 3. Blocker Changes */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={18} style={{ color: 'var(--google-red)' }} />
              <span>Structural Blocker Deltas</span>
            </h3>
            <div className="grid-2" style={{ gap: '1rem' }}>
              <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <strong style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Blockers in {v1Name} ({r1.blockers?.length || 0})</strong>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {r1.blockers?.map((b, i) => (
                    <div key={i} style={{ fontSize: '0.8rem', padding: '0.35rem', background: 'var(--bg-card)', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                      <strong>{b.title}</strong> ({b.severity})
                    </div>
                  )) || 'No blockers'}
                </div>
              </div>
              <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <strong style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Blockers in {v2Name} ({r2.blockers?.length || 0})</strong>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {r2.blockers?.map((b, i) => {
                    const existed = r1.blockers?.some(oldB => oldB.title === b.title);
                    return (
                      <div key={i} style={{ fontSize: '0.8rem', padding: '0.35rem', background: existed ? 'var(--bg-card)' : 'rgba(26, 115, 232, 0.05)', borderRadius: '4px', border: existed ? '1px solid var(--border-color)' : '1px solid rgba(26,115,232,0.2)' }}>
                        <strong>{b.title}</strong> ({b.severity}) {!existed && <span style={{ color: 'var(--google-blue)', fontWeight: 700, fontSize: '0.65rem', marginLeft: '0.25rem' }}>NEW</span>}
                      </div>
                    );
                  }) || 'No blockers'}
                </div>
              </div>
            </div>
          </div>

        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
          <button onClick={onClose} className="btn btn-primary">
            <Check size={16} />
            <span>Close Comparison</span>
          </button>
        </div>
      </div>
    </div>
  );
}
