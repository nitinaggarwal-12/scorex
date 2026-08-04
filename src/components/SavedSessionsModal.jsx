import { useState } from 'react';
import { Bookmark, Trash2, ExternalLink, Calendar, Building2, X, Layers } from 'lucide-react';

export default function SavedSessionsModal({ isOpen, onClose, sessions, onLoadSession, onDeleteSession, onCompareVersions, filterType = 'all' }) {
  const [v1Dict, setV1Dict] = useState({});
  const [v2Dict, setV2Dict] = useState({});

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: '720px', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: 'var(--google-blue-light)', color: 'var(--google-blue)', padding: '0.5rem', borderRadius: '8px' }}>
              <Bookmark size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                {filterType === 'pending' ? 'Pending Approvals Registry' : (filterType === 'approved' ? 'Approved Master Blueprints' : 'Saved Customer Blueprints')}
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {filterType === 'pending' ? 'Review, calibrate, and sign-off active Generative AI scoping drafts' : (filterType === 'approved' ? 'Read-only verified corporate blueprints locked in cloud registry' : 'Manage, compare, and resume usecase assessment versions')}
              </p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close saved blueprints" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div style={{ overflowY: 'auto', flex: 1, paddingRight: '0.5rem' }}>
          {sessions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-secondary)' }}>
              <div style={{ background: 'var(--bg-surface)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'var(--border-color)' }}>
                <Bookmark size={32} />
              </div>
              <h3 style={{ fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>No Saved Blueprints Yet</h3>
              <p style={{ fontSize: '0.9rem' }}>Complete a usecase assessment run and it will automatically be saved here.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {sessions.map(session => {
                const latestVer = (session.versions && session.versions.length > 0)
                  ? session.versions[session.versions.length - 1]
                  : null;
                const data = latestVer?.formData || session.formData || {};
                const rawRep = latestVer?.rawResponse || session.rawResponse || session;
                
                const score = rawRep.scoring?.overallFit || 0;
                const verdict = rawRep.scoring?.verdict || 'Unscored';

                let badgeClass = 'badge-grey';
                if (verdict === 'Strong Fit') badgeClass = 'badge-green';
                else if (verdict === 'Good Fit') badgeClass = 'badge-blue';
                else if (verdict === 'Moderate Fit') badgeClass = 'badge-amber';
                else if (verdict === 'Low Fit') badgeClass = 'badge-red';

                const hasMultipleVersions = session.versions && session.versions.length > 1;

                return (
                  <div key={session.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', padding: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                          <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>{session.reportName || data?.company || 'Unnamed Client'}</span>
                          <span className={`badge ${badgeClass}`}>{score}/100 - {verdict}</span>
                          {session.reportId && <span className="badge badge-blue" style={{ fontSize: '0.65rem', fontWeight: 700 }}>{session.reportId}</span>}
                          <span className="badge badge-grey" style={{ fontSize: '0.65rem' }}>
                            {session.currentVersion || 'v1.0'} ({session.versions?.length || 1} ver)
                          </span>
                        </div>
   
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <Building2 size={14} />
                            <span>{data?.company || 'Company N/A'} ({data?.industry || 'Industry N/A'})</span>
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <Calendar size={14} />
                            <span>{new Date(latestVer?.timestamp || session?.timestamp || Date.now()).toLocaleDateString()}</span>
                          </span>
                          <span>Use Case: <strong>{data?.useCaseName || 'N/A'}</strong></span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button
                          onClick={() => { onLoadSession(session); onClose(); }}
                          className="btn btn-primary"
                          style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                        >
                          <ExternalLink size={13} />
                          <span>Open Blueprint</span>
                        </button>

                        <button
                          onClick={() => onDeleteSession(session.id)}
                          className="btn btn-secondary"
                          style={{ padding: '0.45rem', color: 'var(--google-red)', borderColor: 'var(--border-color)' }}
                          title="Delete this usecase blueprint"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    {/* 📊 Compare Versions Bar (Visible only if versions count > 1) */}
                    {hasMultipleVersions && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', background: 'var(--bg-surface)', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px dashed var(--border-color)' }} className="no-print">
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                          <Layers size={12} style={{ color: 'var(--google-blue)' }} />
                          <span>Audit Version Differences:</span>
                        </span>
                        <select 
                          value={v1Dict[session.id] || session.versions[0].version}
                          onChange={e => setV1Dict(prev => ({ ...prev, [session.id]: e.target.value }))}
                          style={{ fontSize: '0.75rem', padding: '0.15rem 0.35rem', borderRadius: '4px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontWeight: 700 }}
                        >
                          {session.versions.map(v => <option key={v.version} value={v.version}>{v.version}</option>)}
                        </select>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>with</span>
                        <select 
                          value={v2Dict[session.id] || session.versions[session.versions.length - 1].version}
                          onChange={e => setV2Dict(prev => ({ ...prev, [session.id]: e.target.value }))}
                          style={{ fontSize: '0.75rem', padding: '0.15rem 0.35rem', borderRadius: '4px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontWeight: 700 }}
                        >
                          {session.versions.map(v => <option key={v.version} value={v.version}>{v.version}</option>)}
                        </select>
                        <button
                          onClick={() => {
                            const v1 = v1Dict[session.id] || session.versions[0].version;
                            const v2 = v2Dict[session.id] || session.versions[session.versions.length - 1].version;
                            onCompareVersions(session, v1, v2);
                          }}
                          className="btn btn-outline"
                          style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', height: '24px', marginLeft: 'auto', borderColor: 'var(--google-blue)', color: 'var(--google-blue)', background: 'transparent', fontWeight: 800 }}
                        >
                          Compare Changes 📊
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
          <button onClick={onClose} className="btn btn-secondary">Close Dashboard</button>
        </div>
      </div>
    </div>
  );
}
