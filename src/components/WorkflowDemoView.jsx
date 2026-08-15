import React from 'react';
import { 
  Play, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  Sparkles, 
  BarChart2, 
  ShieldCheck, 
  Zap 
} from 'lucide-react';

export default function WorkflowDemoView({ onStartAssessment }) {
  const steps = [
    {
      num: 1,
      title: 'Step 1: Stakeholder Discovery Intake',
      desc: 'Capture core business context, current infrastructure stack, executive sponsorship, and timeline urgency in an interactive 5-perspective matrix.',
      status: 'Ready'
    },
    {
      num: 2,
      title: 'Step 2: 30-Dimension Diagnostic Scoping',
      desc: 'Evaluate Current State (1-5), Future State Vision (1-5), Technical Pain Points, and Business Risks across the 6 architectural pillars.',
      status: 'Ready'
    },
    {
      num: 3,
      title: 'Step 3: Live Gemini 3.1 Pro Synthesis',
      desc: 'Gemini 3.1 Pro Live API analyzes maturity deltas, calculates TCO savings, generates gap radar plots, and creates a prioritized 30-60-90 day roadmap.',
      status: 'Live API Ready'
    },
    {
      num: 4,
      title: 'Step 4: Executive Report & Export',
      desc: 'Review the interactive dossier, explore radar gap plots, benchmark against industry peers, and export board-ready PDF briefs.',
      status: 'Instant'
    }
  ];

  return (
    <div style={{ maxWidth: '1560px', margin: '0 auto', padding: '3rem 2rem 5rem 2rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.6rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.5rem' }}>
          ⚡ Interactive Workflow Demo
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#64748b' }}>
          Step-by-step interactive walkthrough of the consultative assessment and dynamic AI reasoning lifecycle.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
        {steps.map(s => (
          <div key={s.num} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
            <div>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #ff5722, #f97316)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.2rem', marginBottom: '1.25rem' }}>
                {s.num}
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.6rem 0' }}>{s.title}</h3>
              <p style={{ fontSize: '0.92rem', color: '#64748b', lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
            </div>
            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 700, color: '#10b981' }}>
              <CheckCircle2 size={14} />
              <span>{s.status}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Start Button CTA */}
      <div style={{ background: 'linear-gradient(135deg, #0b1938 0%, #102a6b 100%)', color: '#ffffff', padding: '3rem', borderRadius: '24px', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.25)' }}>
        <h2 style={{ fontSize: '2.4rem', fontWeight: 900, margin: '0 0 0.75rem 0', color: '#ffffff' }}>
          Experience the Full Assessment Flow
        </h2>
        <p style={{ fontSize: '1.15rem', opacity: 0.9, maxWidth: '700px', margin: '0 auto 2rem auto' }}>
          Launch the live diagnostic matrix and generate a full executive dossier powered by Gemini 3.1 Pro.
        </p>
        <button
          onClick={onStartAssessment}
          style={{
            background: 'linear-gradient(135deg, #ff5722, #f97316)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '12px',
            padding: '1rem 2.5rem',
            fontSize: '1.1rem',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 8px 25px rgba(249, 115, 22, 0.4)'
          }}
        >
          Start Assessment Now →
        </button>
      </div>
    </div>
  );
}
