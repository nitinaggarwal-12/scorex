import React, { useState } from 'react';
import { 
  Layers, 
  Database, 
  BarChart2, 
  Cpu, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { PILLARS_DATA } from './AssessmentMatrixFlow';

export default function DeepDiveView({ onStartAssessment }) {
  const [selectedPillarId, setSelectedPillarId] = useState('platform_governance');

  const activePillar = PILLARS_DATA.find(p => p.id === selectedPillarId) || PILLARS_DATA[0];

  return (
    <div style={{ maxWidth: '1560px', margin: '0 auto', padding: '3rem 2rem 5rem 2rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.6rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.5rem' }}>
          🔍 Deep Dive Architectural Pillars
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#64748b' }}>
          Explore the evaluation criteria, maturity benchmarks, and remediation patterns for each of the 6 foundational pillars.
        </p>
      </div>

      {/* Pillar Selector Pills */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
        {PILLARS_DATA.map(p => {
          const isSelected = p.id === selectedPillarId;
          const Icon = p.icon;
          return (
            <button
              key={p.id}
              onClick={() => setSelectedPillarId(p.id)}
              style={{
                background: isSelected ? '#2563eb' : '#ffffff',
                color: isSelected ? '#ffffff' : '#1e293b',
                border: isSelected ? '1.5px solid #2563eb' : '1.5px solid #e2e8f0',
                borderRadius: '14px',
                padding: '1.25rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.6rem',
                cursor: 'pointer',
                boxShadow: isSelected ? '0 10px 25px rgba(37, 99, 235, 0.25)' : '0 2px 8px rgba(0,0,0,0.04)',
                transition: 'all 0.2s ease'
              }}
            >
              <span style={{ fontSize: '1.6rem' }}>{p.emoji}</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 800, textAlign: 'center' }}>{p.name}</span>
            </button>
          );
        })}
      </div>

      {/* Pillar Deep Dive Content */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '2.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '2.4rem' }}>{activePillar.emoji}</span>
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
              {activePillar.name}
            </h2>
            <p style={{ margin: '0.25rem 0 0 0', color: '#64748b', fontSize: '0.95rem' }}>
              5 Diagnostic Dimensions • Comprehensive Maturity Progression
            </p>
          </div>
        </div>

        {/* 5 Dimensions Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {activePillar.questions?.map((q, idx) => (
            <div key={q.id || idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Dimension {idx + 1}: {q.dimName || `Core Capability ${idx + 1}`}
                </h4>
                <span style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#2563eb', padding: '0.25rem 0.75rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700 }}>
                  Weight: High
                </span>
              </div>
              <p style={{ fontSize: '0.95rem', color: '#334155', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                <strong>Assessment Question:</strong> {q.title}
              </p>

              {/* 5 Levels Preview */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
                {q.currentStateLevels?.map((lvl, lIdx) => (
                  <div key={lIdx} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.85rem', fontSize: '0.78rem', color: '#475569', lineHeight: 1.4 }}>
                    <div style={{ fontWeight: 800, color: '#0f172a', marginBottom: '0.3rem' }}>Level {lIdx + 1}</div>
                    <div>{lvl.split(':')[1] || lvl}</div>
                  </div>
                ))}
              </div>

              {/* Pains Strip */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
                <div style={{ background: '#fff1f2', border: '1px solid #ffe4e6', borderRadius: '8px', padding: '0.85rem' }}>
                  <strong style={{ color: '#be123c', display: 'block', marginBottom: '0.4rem' }}>⚠️ Key Technical Bottlenecks:</strong>
                  <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#9f1239' }}>
                    {q.technicalPains?.slice(0, 3).map((p, pIdx) => (
                      <li key={pIdx}>{p}</li>
                    ))}
                  </ul>
                </div>
                <div style={{ background: '#fefce8', border: '1px solid #fef08a', borderRadius: '8px', padding: '0.85rem' }}>
                  <strong style={{ color: '#a16207', display: 'block', marginBottom: '0.4rem' }}>💼 Strategic Business Impacts:</strong>
                  <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#854d0e' }}>
                    {q.businessPains?.slice(0, 3).map((p, pIdx) => (
                      <li key={pIdx}>{p}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Footer */}
      <div style={{ background: 'linear-gradient(135deg, #0b1938 0%, #102a6b 100%)', color: '#ffffff', padding: '2.5rem 3rem', borderRadius: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.4rem 0', color: '#ffffff' }}>Ready to benchmark your organization?</h3>
          <p style={{ margin: 0, opacity: 0.85, fontSize: '0.95rem' }}>Start the interactive diagnostic matrix and get your Gemini 3.1 Pro strategic roadmap.</p>
        </div>
        <button 
          onClick={onStartAssessment}
          style={{
            background: 'linear-gradient(135deg, #ff5722, #f97316)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '10px',
            padding: '0.85rem 1.8rem',
            fontSize: '1rem',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(249, 115, 22, 0.4)'
          }}
        >
          Launch Assessment →
        </button>
      </div>
    </div>
  );
}
