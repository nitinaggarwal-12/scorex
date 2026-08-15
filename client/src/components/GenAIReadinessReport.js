import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';
import { 
  FiCompass, 
  FiBriefcase, 
  FiUsers, 
  FiSettings, 
  FiLayers, 
  FiShield, 
  FiPrinter, 
  FiDownload, 
  FiArrowLeft,
  FiCheckCircle,
  FiTrendingUp,
  FiCalendar
} from 'react-icons/fi';
import './GenAIReadinessReport.css';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const GenAIReadinessReport = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [framework, setFramework] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('');

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [assessmentRes, frameworkRes] = await Promise.all([
        axios.get(`/api/genai-readiness/assessments/${id}`),
        axios.get('/api/genai-readiness/framework')
      ]);
      setAssessment(assessmentRes.data);
      setFramework(frameworkRes.data);
      if (frameworkRes.data && frameworkRes.data.dimensions.length > 0) {
        setActiveTab(frameworkRes.data.dimensions[0].id);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };

  const getRecommendations = (dimensionId, score, maxScore) => {
    if (!framework) return [];
    
    const percentage = (score / maxScore) * 100;
    const recommendations = framework.recommendations[dimensionId];
    
    if (!recommendations) return [];
    
    if (percentage < 40) return recommendations.low || [];
    if (percentage < 70) return recommendations.medium || [];
    return recommendations.high || [];
  };

  const getMaturityLevel = () => {
    if (!framework || !assessment) return null;
    return framework.maturityLevels.find(level => 
      assessment.totalScore >= level.min && assessment.totalScore <= level.max
    );
  };

  const getDimensionIcon = (dimensionId) => {
    const icons = {
      'strategy': <FiCompass />,
      'use_cases': <FiBriefcase />,
      'people': <FiUsers />,
      'process': <FiSettings />,
      'platform': <FiLayers />,
      'governance': <FiShield />
    };
    return icons[dimensionId] || <FiCompass />;
  };

  const getRadarChartData = () => {
    if (!assessment || !framework) return null;

    const labels = framework.dimensions.map(d => d.name);
    const scores = framework.dimensions.map(d => {
      const dimScore = assessment.scores[d.id];
      return dimScore ? (dimScore.score / dimScore.maxScore) * 5 : 0; // Normalize to 0-5 scale
    });

    return {
      labels,
      datasets: [
        {
          label: assessment.customerName,
          data: scores,
          backgroundColor: 'rgba(99, 102, 241, 0.15)', // Premium Indigo background
          borderColor: 'rgba(99, 102, 241, 0.85)',
          borderWidth: 3,
          pointBackgroundColor: 'rgba(99, 102, 241, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(99, 102, 241, 1)',
          pointRadius: 5,
          pointHoverRadius: 7
        }
      ]
    };
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        beginAtZero: true,
        max: 5,
        min: 0,
        ticks: {
          stepSize: 1,
          display: false // Hide ugly tick labels for premium look
        },
        pointLabels: {
          font: {
            family: "'Outfit', 'Inter', sans-serif",
            size: 11,
            weight: '600'
          },
          color: '#4a5568'
        },
        grid: {
          color: '#e2e8f0'
        },
        angleLines: {
          color: '#cbd5e0'
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleFont: { size: 13, family: 'Outfit', weight: 'bold' },
        bodyFont: { size: 12, family: 'Inter' },
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            const dimensionIndex = context.dataIndex;
            const dimension = framework.dimensions[dimensionIndex];
            const score = assessment.scores[dimension.id];
            return ` ${dimension.name}: ${score.score}/${score.maxScore} (${score.percentage}%)`;
          }
        }
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="report-container">
        <div className="loading-spinner-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">Generating Executive Report...</div>
        </div>
      </div>
    );
  }

  if (!assessment || !framework) {
    return (
      <div className="report-container">
        <div className="error-card">
          <div className="error-title">Report Not Found</div>
          <p>We couldn't find the requested GenAI Readiness Assessment.</p>
          <button className="btn-primary" onClick={() => navigate('/genai-readiness')}>
            Start New Assessment
          </button>
        </div>
      </div>
    );
  }

  const maturityLevel = getMaturityLevel();
  const radarData = getRadarChartData();
  const scorePct = Math.round((assessment.totalScore / framework.totalPoints) * 100);

  // SVG Gauge calculations
  const strokeRadius = 60;
  const strokeCircumference = 2 * Math.PI * strokeRadius;
  const strokeDashoffset = strokeCircumference - (scorePct / 100) * strokeCircumference;

  // Next steps mapped content for modern timeline
  const roadmapSteps = [
    {
      step: "1",
      title: "Prioritize Quick Wins",
      description: "Review the recommendations for dimensions with the lowest scores and identify 2-3 high-impact, low-effort initiatives to start immediately.",
      timeframe: "Days 1-30",
      action: "Identify low-hanging fruit in the lowest-scoring pillars."
    },
    {
      step: "2",
      title: "Build Executive Alignment",
      description: "Share this readiness report with your leadership and key stakeholders to secure buy-in, budget, and resources for your GenAI roadmap.",
      timeframe: "Days 15-45",
      action: "Conduct an executive alignment workshop using this dashboard's results."
    },
    {
      step: "3",
      title: "Create a 90-Day Plan",
      description: "Select specific action items from each dimension in the Detailed Recommendations tab and assign owners with clear timelines.",
      timeframe: "Days 30-60",
      action: "Establish project workstreams with assigned owners."
    },
    {
      step: "4",
      title: "Establish Progress Metrics",
      description: "Define clear Key Performance Indicators (KPIs) to track maturity improvements in each dimension and schedule quarterly reassessments.",
      timeframe: "Days 45-75",
      action: "Set up a maturity scorecard tracking dashboard."
    },
    {
      step: "5",
      title: "Engage Databricks Experts",
      description: "Connect with your Databricks account team and architects to explore how our platform, catalog, and models can accelerate your GenAI journey.",
      timeframe: "Ongoing",
      action: "Schedule a architecture deep-dive on Unity Catalog and Model Serving."
    }
  ];

  return (
    <div className="report-container">
      {/* Premium Executive Header */}
      <div className="report-header-premium no-print">
        <button className="btn-back-glow" onClick={() => navigate('/genai-readiness/list')}>
          <FiArrowLeft /> <span>All Assessments</span>
        </button>
        
        <div className="header-actions-glow">
          <button className="btn-action-glow" onClick={handlePrint}>
            <FiPrinter /> <span>Print Report</span>
          </button>
          <button className="btn-action-glow primary-glow" onClick={handlePrint}>
            <FiDownload /> <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Main Cover Title */}
      <div className="report-cover-title">
        <div className="cover-badge">EXECUTIVE EVALUATION REPORT</div>
        <h1>Generative AI Readiness Assessment</h1>
        <div className="cover-meta">
          <div className="meta-item">
            <span className="meta-label">Prepared For</span>
            <span className="meta-value">{assessment.customerName}</span>
          </div>
          <div className="meta-divider"></div>
          <div className="meta-item">
            <span className="meta-label">Evaluation Date</span>
            <span className="meta-value"><FiCalendar /> {formatDate(assessment.completedAt)}</span>
          </div>
        </div>
      </div>

      {/* Hero Metrics Dashboard Grid */}
      <div className="dashboard-hero-grid">
        {/* Left Card: Circular Gauge for Score */}
        <div className="hero-dashboard-card score-gauge-card">
          <h3>Overall Readiness Score</h3>
          <div className="gauge-wrapper">
            <svg className="gauge-svg" width="160" height="160">
              {/* Background Circle */}
              <circle
                className="gauge-bg-circle"
                cx="80"
                cy="80"
                r={strokeRadius}
                strokeWidth="10"
              />
              {/* Glowing Active Circle */}
              <circle
                className="gauge-active-circle"
                cx="80"
                cy="80"
                r={strokeRadius}
                strokeWidth="10"
                strokeDasharray={strokeCircumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="gauge-text-center">
              <span className="gauge-percent">{scorePct}%</span>
              <span className="gauge-score">{assessment.totalScore}/{framework.totalPoints} pts</span>
            </div>
          </div>
          <p className="gauge-footer-text">Calculated across 30 enterprise-readiness checkpoints</p>
        </div>

        {/* Right Card: Glassmorphic Maturity Badge */}
        {maturityLevel && (
          <div className="hero-dashboard-card maturity-info-card">
            <div className="card-tag">MATURITY LEVEL</div>
            <div className="maturity-glow-badge" style={{ '--glow-color': maturityLevel.color }}>
              <span className="glow-dot"></span>
              <span className="glow-label">{maturityLevel.level}</span>
            </div>
            <h2 className="maturity-headline">{maturityLevel.label} Maturity</h2>
            <p className="maturity-executive-summary">
              {maturityLevel.description}
            </p>
            <div className="maturity-card-footer">
              <span className="footer-title">Enterprise Positioning:</span>
              <span className="footer-value">Established core capabilities, ready to scale pilot use cases.</span>
            </div>
          </div>
        )}
      </div>

      {/* Radar Chart & Dimension Grid (Data Visualizer Section) */}
      <div className="radar-visualizer-section">
        <h2>Readiness Dimension Profile</h2>
        <p className="section-intro">Evaluating strengths and improvement areas across the 6 pillars of Generative AI readiness.</p>
        
        <div className="radar-grid-layout">
          {/* Radar Chart Container */}
          <div className="visualizer-card chart-card">
            <h4>Readiness Radar</h4>
            {radarData && (
              <div className="radar-chart-wrapper">
                <Radar data={radarData} options={radarOptions} />
              </div>
            )}
            <div className="chart-legend-glow">
              <span className="legend-dot"></span>
              <span className="legend-label">{assessment.customerName} Profile</span>
            </div>
          </div>
          
          {/* Grid of Dimension Mini-Cards with Progress Bars */}
          <div className="visualizer-card dimensions-grid-card">
            <h4>Pillar Breakdown</h4>
            <div className="dimensions-progress-grid">
              {framework.dimensions.map(dimension => {
                const score = assessment.scores[dimension.id];
                return (
                  <div key={dimension.id} className="dimension-progress-item">
                    <div className="item-header">
                      <div className="item-title-icon">
                        <span className="item-icon" style={{ color: score.percentage >= 70 ? '#2bc48a' : (score.percentage >= 40 ? '#f0ad4e' : '#e74c3c') }}>
                          {getDimensionIcon(dimension.id)}
                        </span>
                        <span className="item-name">{dimension.name}</span>
                      </div>
                      <span className="item-score-text">{score.score}/{score.maxScore} ({score.percentage}%)</span>
                    </div>
                    <div className="item-progress-bar-bg">
                      <div 
                        className="item-progress-bar-fill"
                        style={{ 
                          width: `${score.percentage}%`,
                          backgroundColor: score.percentage >= 70 ? '#2bc48a' : (score.percentage >= 40 ? '#f0ad4e' : '#e74c3c')
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Recommendations with Premium Sliding Tabs */}
      <div className="detailed-recommendations-section">
        <h2>Detailed Pillar Recommendations</h2>
        <p className="section-intro">Select a pillar below to review current status, leverages on Databricks, and customized action items.</p>
        
        {/* Sliding Tabs Bar */}
        <div className="recommendations-tabs-bar">
          {framework.dimensions.map(dim => {
            const score = assessment.scores[dim.id];
            return (
              <button
                key={dim.id}
                className={`tab-item ${activeTab === dim.id ? 'active' : ''}`}
                onClick={() => setActiveTab(dim.id)}
              >
                <span className="tab-icon-wrapper">{getDimensionIcon(dim.id)}</span>
                <span className="tab-label">{dim.name}</span>
                <span className="tab-score-badge">{score.score}/{score.maxScore}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Display */}
        {framework.dimensions.map(dimension => {
          if (dimension.id !== activeTab) return null;
          
          const score = assessment.scores[dimension.id];
          const recommendations = getRecommendations(dimension.id, score.score, score.maxScore);
          
          return (
            <div key={dimension.id} className="tab-content-card active-animation">
              <div className="tab-card-header">
                <div className="header-left">
                  <span className="header-icon">{getDimensionIcon(dimension.id)}</span>
                  <div>
                    <h3>{dimension.name} Analysis</h3>
                    <p className="pillar-desc">{dimension.description}</p>
                  </div>
                </div>
                <div className="header-right">
                  <div className="score-percentage-circle" style={{ borderColor: score.percentage >= 70 ? '#2bc48a' : (score.percentage >= 40 ? '#f0ad4e' : '#e74c3c') }}>
                    <span>{score.percentage}%</span>
                  </div>
                </div>
              </div>

              <div className="tab-card-grid">
                {/* Left Side: Status and Databricks Leverage */}
                <div className="tab-grid-column status-column">
                  <div className="card-sub-section">
                    <h5>Current Status</h5>
                    <div className="status-badge-wrapper" style={{ borderColor: score.percentage >= 70 ? '#2bc48a' : (score.percentage >= 40 ? '#f0ad4e' : '#e74c3c') }}>
                      <span className="status-dot" style={{ backgroundColor: score.percentage >= 70 ? '#2bc48a' : (score.percentage >= 40 ? '#f0ad4e' : '#e74c3c') }}></span>
                      <span className="status-label">
                        {score.percentage < 40 && 'Foundation building required'}
                        {score.percentage >= 40 && score.percentage < 70 && 'Good progress, needs enhancement'}
                        {score.percentage >= 70 && 'Strong capabilities, optimize for excellence'}
                      </span>
                    </div>
                  </div>

                  <div className="card-sub-section leverage-section">
                    <h5>Databricks Platform Leverage</h5>
                    <div className="leverage-info-box">
                      <FiTrendingUp className="leverage-icon" />
                      <p>
                        Leverage <strong>Databricks Unity Catalog</strong> for unified governance of models, features, and datasets, and deploy secure models with low-latency using <strong>Model Serving</strong>.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Side: Action Items Checklist */}
                <div className="tab-grid-column actions-column">
                  <h5>Priority Action Items</h5>
                  <div className="checklist-items">
                    {recommendations.map((rec, index) => (
                      <div key={index} className="checklist-card">
                        <FiCheckCircle className="check-icon" />
                        <p>{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Executive Roadmap Timeline (Next Steps) */}
      <div className="roadmap-timeline-section">
        <h2>🚀 Post-Assessment Implementation Roadmap</h2>
        <p className="section-intro">A recommended, structured timeline to translate this readiness assessment into concrete business value.</p>
        
        <div className="vertical-timeline-wrapper">
          <div className="timeline-center-line"></div>
          
          {roadmapSteps.map((step, index) => (
            <div key={index} className="timeline-node">
              {/* Milestone Step Number */}
              <div className="timeline-marker">
                <span>{step.step}</span>
              </div>
              
              {/* Timeline Content Card */}
              <div className="timeline-content-card">
                <div className="card-header-row">
                  <h4>{step.title}</h4>
                  <span className="timeframe-tag">{step.timeframe}</span>
                </div>
                <p className="step-desc">{step.description}</p>
                <div className="step-action-bar">
                  <strong>Key Deliverable:</strong> <span>{step.action}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Executive Footer Controls */}
      <div className="report-footer-premium no-print">
        <button className="btn-glow-large secondary-glow" onClick={() => navigate('/genai-readiness/list')}>
          View All Assessments
        </button>
        <button className="btn-glow-large primary-glow" onClick={() => navigate('/genai-readiness')}>
          Start New Assessment
        </button>
      </div>
    </div>
  );
};

export default GenAIReadinessReport;
