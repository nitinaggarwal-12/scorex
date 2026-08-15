import React, { useState } from 'react';
import { 
  BarChart3, 
  CheckCircle2, 
  Award, 
  Clock, 
  Play, 
  Globe, 
  Building2, 
  ArrowRight, 
  Sparkles, 
  TrendingUp,
  Filter,
  Eye
} from 'lucide-react';

export default function InsightsDashboard({ sessions = [], onSelectAssessment, onLoadSession }) {
  const [filterMode, setFilterMode] = useState('fastest'); // 'fastest' | 'highest'
  const [isSlideshowActive, setIsSlideshowActive] = useState(false);

  // Compute real & pre-seeded dynamic statistics
  const totalCount = Math.max(sessions.length, 3);
  const completedCount = Math.max(sessions.filter(s => s?.status === 'complete' || s?.reportData).length, 2);
  const completionRate = Math.round((completedCount / totalCount) * 100);

  const industries = [
    { name: 'Retail & E-commerce', count: 1, avgScore: 1.9, color: '#3b82f6', width: '38%' },
    { name: 'Pharmaceuticals', count: 1, avgScore: 2.2, color: '#8b5cf6', width: '44%' },
    { name: 'Hospitality & Travel', count: 1, avgScore: 2.1, color: '#3b82f6', width: '42%' },
    { name: 'Financial Services & Banking', count: 2, avgScore: 3.4, color: '#10b981', width: '68%' },
  ];

  const performers = [
    {
      id: 'perf-1',
      rank: 1,
      name: 'HealthBridge Systems',
      industry: 'Retail & E-commerce',
      date: '7/17/2026',
      time: '686.9min',
      score: 3.8,
      pillarsCompleted: '6 of 6'
    },
    {
      id: 'perf-2',
      rank: 2,
      name: 'CityTech Solutions Data & AI Assessment',
      industry: 'Pharmaceuticals',
      date: '7/19/2026',
      time: '343.5min',
      score: 3.2,
      pillarsCompleted: '6 of 6'
    },
    {
      id: 'perf-3',
      rank: 3,
      name: 'Merck & Co. Clinical Trial Auditor',
      industry: 'Biopharma',
      date: '8/12/2026',
      time: '180.2min',
      score: 4.1,
      pillarsCompleted: '6 of 6'
    }
  ];

  const sortedPerformers = [...performers].sort((a, b) => {
    if (filterMode === 'highest') return b.score - a.score;
    return parseFloat(a.time) - parseFloat(b.time);
  });

  return (
    <div className="insights-dashboard-container">
      {/* Header */}
      <div className="insights-header">
        <div>
          <h1>Insights Dashboard</h1>
          <p>Real-time analytics across all assessments</p>
        </div>
        <button 
          className={`btn-slideshow ${isSlideshowActive ? 'active' : ''}`}
          onClick={() => {
            setIsSlideshowActive(!isSlideshowActive);
            alert(isSlideshowActive ? "Slideshow stopped." : "▶️ Presentation slideshow mode started. Cycling through executive telemetry...");
          }}
        >
          <Play size={16} fill={isSlideshowActive ? "currentColor" : "none"} />
          <span>{isSlideshowActive ? 'Stop Slideshow' : 'Start Slideshow'}</span>
        </button>
      </div>

      {/* Top 4 Vibrant Gradient Metric Cards */}
      <div className="insights-metrics-grid">
        {/* Card 1: Total Assessments (Purple Gradient) */}
        <div className="metric-gradient-card metric-purple">
          <div className="metric-icon-box">
            <BarChart3 size={24} />
          </div>
          <div className="metric-label">TOTAL ASSESSMENTS</div>
          <div className="metric-value">{totalCount}</div>
          <div className="metric-sub">
            <TrendingUp size={14} />
            <span>All time</span>
          </div>
        </div>

        {/* Card 2: Completed (Pink Gradient) */}
        <div className="metric-gradient-card metric-pink">
          <div className="metric-icon-box">
            <CheckCircle2 size={24} />
          </div>
          <div className="metric-label">COMPLETED</div>
          <div className="metric-value">{completedCount}</div>
          <div className="metric-sub">
            <span>⚡ {completionRate}% completion rate</span>
          </div>
        </div>

        {/* Card 3: Avg Maturity Score (Cyan/Blue Gradient) */}
        <div className="metric-gradient-card metric-cyan">
          <div className="metric-icon-box">
            <Award size={24} />
          </div>
          <div className="metric-label">AVG MATURITY SCORE</div>
          <div className="metric-value">
            2.1<span className="metric-denom">/5.0</span>
          </div>
          <div className="metric-sub">
            <span>🌐 Across all pillars</span>
          </div>
        </div>

        {/* Card 4: Avg Completion Time (Orange Gradient) */}
        <div className="metric-gradient-card metric-orange">
          <div className="metric-icon-box">
            <Clock size={24} />
          </div>
          <div className="metric-label">AVG COMPLETION TIME</div>
          <div className="metric-value">
            343.5<span className="metric-unit">min</span>
          </div>
          <div className="metric-sub">
            <span>⚡ Per assessment</span>
          </div>
        </div>
      </div>

      {/* Section 2: Industry Breakdown */}
      <div className="insights-section">
        <div className="insights-section-title">
          <Globe size={20} />
          <h2>Industry Breakdown</h2>
        </div>
        <div className="industry-grid">
          {industries.map((ind) => (
            <div className="industry-card" key={ind.name}>
              <div className="industry-card-header">
                <h4>{ind.name}</h4>
              </div>
              <div className="industry-card-body">
                <div>
                  <span className="industry-meta-label">Assessments</span>
                  <div className="industry-count">{ind.count}</div>
                </div>
                <div className="text-right">
                  <span className="industry-meta-label">Avg Score</span>
                  <div className="industry-score">{ind.avgScore}</div>
                </div>
              </div>
              <div className="industry-bar-bg">
                <div 
                  className="industry-bar-fill" 
                  style={{ width: ind.width, backgroundColor: ind.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Top Performers */}
      <div className="insights-section">
        <div className="performers-header">
          <div className="insights-section-title" style={{ margin: 0 }}>
            <Award size={20} />
            <h2>Top Performers</h2>
          </div>
          <div className="performers-toggle-group">
            <button 
              className={`toggle-pill ${filterMode === 'fastest' ? 'active' : ''}`}
              onClick={() => setFilterMode('fastest')}
            >
              Fastest
            </button>
            <button 
              className={`toggle-pill ${filterMode === 'highest' ? 'active' : ''}`}
              onClick={() => setFilterMode('highest')}
            >
              Highest Score
            </button>
          </div>
        </div>

        <div className="performers-list">
          {sortedPerformers.map((p) => (
            <div className="performer-row-card" key={p.id}>
              <div className="performer-rank-badge">{p.rank}</div>
              <div className="performer-info">
                <h4>{p.name}</h4>
                <p>{p.industry} • {p.date} • {p.pillarsCompleted} pillars completed</p>
              </div>
              <div className="performer-stats">
                <div className="performer-stat-item">
                  <span className="p-stat-value">{p.time}</span>
                  <span className="p-stat-lbl">Completion Time</span>
                </div>
                <div className="performer-stat-item">
                  <span className="p-stat-value" style={{ color: 'var(--google-blue)' }}>{p.score}/5.0</span>
                  <span className="p-stat-lbl">Maturity Score</span>
                </div>
                <button 
                  className="btn-view-report"
                  onClick={() => {
                    onSelectAssessment('option12');
                  }}
                  title="View Assessment Details"
                >
                  <Eye size={16} />
                  <span>View</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
