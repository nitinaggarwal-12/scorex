import React, { useState } from 'react';
import { 
  Play, 
  ChevronLeft, 
  ChevronRight, 
  Target, 
  Award, 
  TrendingUp, 
  ShieldCheck, 
  Layers, 
  BarChart2, 
  Zap, 
  Clock, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function PitchDeckView({ onStartAssessment }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      tag: 'EXECUTIVE OVERVIEW',
      title: 'Accelerate Enterprise Data & AI Maturity',
      subtitle: 'From Fragmented Data Silos to Governed Autonomous AI Workloads',
      bullets: [
        'Enterprise AI initiatives stall without modern, unified data foundations and governed execution.',
        'Over 70% of organizations struggle with data lineage, fragmented toolchains, and compliance uncertainty.',
        'ScoreX provides a standardized 6-Pillar diagnostic to align executive sponsors, architects, and engineering teams.'
      ],
      kpis: [
        { label: 'Pillars Audited', value: '6' },
        { label: 'Diagnostic Dimensions', value: '30' },
        { label: 'Synthesis Engine', value: 'Gemini 3.1 Pro' }
      ]
    },
    {
      id: 2,
      tag: 'THE CHALLENGE',
      title: 'Enterprise Bottlenecks Across the AI Lifecycle',
      subtitle: 'Why Traditional Approaches Fail to Deliver Measurable ROI',
      bullets: [
        'Data Ingestion Fragility: Batch pipelines break silently, causing analytical blind spots.',
        'Governance & Security Friction: Unregulated shadow AI usage and manual compliance sign-offs.',
        'Lack of MLOps & RAG Grounding: Models hallucinate and fail in production due to unstructured knowledge silos.'
      ],
      kpis: [
        { label: 'Time Spent Troubleshooting', value: '60%' },
        { label: 'Model Deployment Delay', value: '3-6 mo' },
        { label: 'TCO Reduction Opportunity', value: '35%+' }
      ]
    },
    {
      id: 3,
      tag: 'THE SOLUTION',
      title: 'The ScoreX 6-Pillar Diagnostic Framework',
      subtitle: 'Objective, Calibrated, and Actionable Transformation Roadmap',
      bullets: [
        '1. Architecture & Platform: Standardized IaC, Zero-Trust RBAC, FinOps tokenomics.',
        '2. Data Engineering & Pipelines: Real-time CDC, automated quality contracts, and open table formats.',
        '3. Analytics & Semantic Layer: Centralized metric stores, NL-to-SQL self-service, and low-latency caching.',
        '4. Production ML & MLOps: Centralized model registries, feature stores, and automated drift detection.',
        '5. Generative & Agentic AI: Multi-model gateways, hybrid GraphRAG, and tool-using autonomous agents.',
        '6. Operational Excellence & ROI: AI steering committee, GxP validation, and hard P&L payback tracking.'
      ],
      kpis: [
        { label: 'Assessment Time', value: '15 min' },
        { label: 'Remediation Milestones', value: '30-60-90 d' },
        { label: 'Audit Ready', value: '100%' }
      ]
    },
    {
      id: 4,
      tag: 'BUSINESS IMPACT',
      title: 'Measurable Value Realization & ROI',
      subtitle: 'Justifying Strategic Infrastructure & Modernization Investments',
      bullets: [
        'Accelerate time-to-market for high-value AI applications from months to weeks.',
        'Optimize cloud infrastructure and foundation model token consumption by 30–50%.',
        'Eliminate compliance risks with automated audit trails, GxP sign-off boundaries, and zero-trust controls.'
      ],
      kpis: [
        { label: 'Expected Payback', value: '< 6 mo' },
        { label: 'Developer Velocity', value: '3x' },
        { label: 'Compliance Confidence', value: '99%' }
      ]
    }
  ];

  const slide = slides[currentSlide];

  return (
    <div style={{ maxWidth: '1560px', margin: '0 auto', padding: '3rem 2rem 5rem 2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#0f172a', margin: '0 0 0.25rem 0' }}>
            🎯 Executive Pitch Deck & Strategy Brief
          </h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '1rem' }}>
            Interactive presentation slides for leadership briefings and architecture reviews.
          </p>
        </div>

        {/* Slide Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#64748b' }}>
            Slide {currentSlide + 1} of {slides.length}
          </span>
          <button
            onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
            disabled={currentSlide === 0}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              background: currentSlide === 0 ? '#f1f5f9' : '#ffffff',
              color: currentSlide === 0 ? '#cbd5e1' : '#0f172a',
              cursor: currentSlide === 0 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => setCurrentSlide(prev => Math.min(slides.length - 1, prev + 1))}
            disabled={currentSlide === slides.length - 1}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              background: currentSlide === slides.length - 1 ? '#f1f5f9' : '#ffffff',
              color: currentSlide === slides.length - 1 ? '#cbd5e1' : '#0f172a',
              cursor: currentSlide === slides.length - 1 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Main Slide Card */}
      <div style={{
        background: 'linear-gradient(135deg, #0b1938 0%, #102a6b 60%, #0d2050 100%)',
        color: '#ffffff',
        borderRadius: '24px',
        padding: '4rem 4rem',
        boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
        minHeight: '480px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginBottom: '2rem'
      }}>
        <div>
          <span style={{
            display: 'inline-block',
            background: 'rgba(59, 130, 246, 0.25)',
            color: '#60a5fa',
            padding: '0.35rem 0.85rem',
            borderRadius: '100px',
            fontSize: '0.8rem',
            fontWeight: 800,
            letterSpacing: '1px',
            marginBottom: '1.25rem'
          }}>
            {slide.tag}
          </span>
          <h2 style={{ fontSize: '2.8rem', fontWeight: 900, lineHeight: 1.15, margin: '0 0 0.75rem 0', color: '#ffffff' }}>
            {slide.title}
          </h2>
          <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.85)', margin: '0 0 2rem 0' }}>
            {slide.subtitle}
          </p>

          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2.5rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {slide.bullets.map((b, bIdx) => (
              <li key={bIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '1.1rem', lineHeight: 1.5, color: 'rgba(255,255,255,0.92)' }}>
                <span style={{ color: '#10b981', fontSize: '1.2rem', lineHeight: 1 }}>✔</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* KPI Strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '2rem' }}>
          {slide.kpis.map((kpi, kIdx) => (
            <div key={kIdx} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '14px', padding: '1.25rem', textAlign: 'center', border: '1px solid rgba(255,255,255,0.12)' }}>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#ffffff' }}>{kpi.value}</div>
              <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.75)', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '0.2rem' }}>{kpi.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Start Button */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
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
            boxShadow: '0 8px 25px rgba(249, 115, 22, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}
        >
          <span>Start Assessment Now</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
