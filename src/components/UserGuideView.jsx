import React, { useState } from 'react';
import { 
  BookOpen, 
  Users, 
  Target, 
  CheckCircle2, 
  Play, 
  Edit3, 
  Eye, 
  BarChart2, 
  Layers, 
  ShieldCheck, 
  Zap, 
  TrendingUp, 
  Award, 
  ArrowRight, 
  FileText, 
  Compass, 
  ChevronRight 
} from 'lucide-react';

export default function UserGuideView({ onStartAssessment }) {
  const [activeTab, setActiveTab] = useState('overview');

  const guideSections = [
    {
      id: 'overview',
      title: 'Assessment Overview',
      icon: BookOpen,
      content: (
        <div>
          <h3>Enterprise Data & AI Maturity Assessment Framework</h3>
          <p>
            The ScoreX Maturity Assessment is a structured evaluation tool designed for enterprise architects, data leaders, and workload sponsors to benchmark capabilities, identify architectural bottlenecks, and establish a clear path toward production AI maturity.
          </p>
          <div className="guide-kpi-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem', margin: '1.5rem 0' }}>
            <div className="guide-kpi-card" style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ color: '#2563eb', fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.25rem 0' }}>6 Pillars</h4>
              <p style={{ margin: 0, fontSize: '0.88rem', color: '#64748b' }}>Platform, Data, Analytics, ML, GenAI, and Operations.</p>
            </div>
            <div className="guide-kpi-card" style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ color: '#10b981', fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.25rem 0' }}>30 Dimensions</h4>
              <p style={{ margin: 0, fontSize: '0.88rem', color: '#64748b' }}>5 calibrated dimensions per pillar for deep diagnostic rigor.</p>
            </div>
            <div className="guide-kpi-card" style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ color: '#8b5cf6', fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.25rem 0' }}>15 Minutes</h4>
              <p style={{ margin: 0, fontSize: '0.88rem', color: '#64748b' }}>Rapid consultative intake producing instant executive synthesis.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'maturity_scale',
      title: '5-Level Maturity Scale',
      icon: Target,
      content: (
        <div>
          <h3>Standardized 5-Level Scoring Model</h3>
          <p>Every dimension is evaluated against 5 objective tiers of capability:</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', margin: '1.5rem 0' }}>
            <div style={{ borderLeft: '4px solid #ef4444', padding: '0.85rem 1.25rem', background: '#fef2f2', borderRadius: '0 10px 10px 0' }}>
              <strong style={{ color: '#b91c1c' }}>Level 1: Explore</strong> — Ad-hoc, manual processes with limited standardization or automation.
            </div>
            <div style={{ borderLeft: '4px solid #f97316', padding: '0.85rem 1.25rem', background: '#fff7ed', borderRadius: '0 10px 10px 0' }}>
              <strong style={{ color: '#c2410c' }}>Level 2: Experiment</strong> — Basic implementation with some repeatability, but inconsistent across business units.
            </div>
            <div style={{ borderLeft: '4px solid #eab308', padding: '0.85rem 1.25rem', background: '#fefce8', borderRadius: '0 10px 10px 0' }}>
              <strong style={{ color: '#a16207' }}>Level 3: Formalize</strong> — Documented standards, centralized data layers, and defined governance policies consistently followed.
            </div>
            <div style={{ borderLeft: '4px solid #3b82f6', padding: '0.85rem 1.25rem', background: '#eff6ff', borderRadius: '0 10px 10px 0' }}>
              <strong style={{ color: '#1d4ed8' }}>Level 4: Optimize</strong> — Advanced automation, automated CI/CD pipelines, proactive telemetry, and continuous optimization.
            </div>
            <div style={{ borderLeft: '4px solid #10b981', padding: '0.85rem 1.25rem', background: '#f0fdf4', borderRadius: '0 10px 10px 0' }}>
              <strong style={{ color: '#15803d' }}>Level 5: Transform</strong> — Industry-leading autonomous self-healing data mesh, multi-agent AI ecosystems, and real-time value realization.
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'matrix_flow',
      title: '5-Section Matrix Workflow',
      icon: Layers,
      content: (
        <div>
          <h3>How to Navigate the Assessment Matrix</h3>
          <p>Each question in the matrix captures 5 critical perspectives:</p>
          <ul style={{ lineHeight: 1.8, color: '#334155', paddingLeft: '1.25rem' }}>
            <li><strong>1. Current State:</strong> Select your organization's actual operational baseline today.</li>
            <li><strong>2. Future State Vision:</strong> Select the target ambition your team aims to reach over the next 12–18 months.</li>
            <li><strong>3. Technical Pain Points:</strong> Check all applicable architectural bottlenecks and tooling frictions.</li>
            <li><strong>4. Business Pain Points:</strong> Check strategic business, cost, and organizational blockers.</li>
            <li><strong>5. Qualitative Notes:</strong> Provide specific context, legacy tool names, or regulatory mandates for Gemini 3.1 Pro synthesis.</li>
          </ul>
        </div>
      )
    },
    {
      id: 'dynamic_engine',
      title: 'AI Synthesis & Live Results',
      icon: Zap,
      content: (
        <div>
          <h3>Dynamic Calculation with Gemini 3.1 Pro</h3>
          <p>
            Upon submission, the responses are processed in real-time by the Gemini 3.1 Pro Live API to generate:
          </p>
          <ul style={{ lineHeight: 1.8, color: '#334155', paddingLeft: '1.25rem' }}>
            <li><strong>Executive Summary & Grade:</strong> A letter grade (`A+` to `F`) with readiness justification.</li>
            <li><strong>Radar Gap Analysis:</strong> Visual representation of Current vs Target maturity per pillar.</li>
            <li><strong>Prioritized Remediation Roadmap:</strong> Top 5 high-impact actions ranked by capability delta.</li>
            <li><strong>Financial ROI Projections:</strong> Expected TCO savings percentage and payback duration in months.</li>
          </ul>
        </div>
      )
    }
  ];

  return (
    <div style={{ maxWidth: '1560px', margin: '0 auto', padding: '3rem 2rem 5rem 2rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.6rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.5rem' }}>
          📖 User Guide & Framework Documentation
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#64748b' }}>
          Learn how the 6-Pillar Enterprise Assessment measures maturity and produces AI-driven implementation roadmaps.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.75rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem', marginBottom: '2rem' }}>
        {guideSections.map(s => {
          const Icon = s.icon;
          const isActive = activeTab === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setActiveTab(s.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 1.25rem',
                borderRadius: '8px',
                border: 'none',
                background: isActive ? '#2563eb' : '#f8fafc',
                color: isActive ? '#ffffff' : '#475569',
                fontSize: '0.92rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <Icon size={16} />
              <span>{s.title}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Card */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '2.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', marginBottom: '3rem' }}>
        {guideSections.find(s => s.id === activeTab)?.content}
      </div>

      {/* Call to Action */}
      <div style={{ background: 'linear-gradient(135deg, #0b1938 0%, #102a6b 100%)', color: '#ffffff', padding: '2.5rem 3rem', borderRadius: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.4rem 0', color: '#ffffff' }}>Ready to run your assessment?</h3>
          <p style={{ margin: 0, opacity: 0.85, fontSize: '0.95rem' }}>Complete the 30-dimension diagnostic matrix in under 15 minutes.</p>
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
          Start Assessment →
        </button>
      </div>
    </div>
  );
}
