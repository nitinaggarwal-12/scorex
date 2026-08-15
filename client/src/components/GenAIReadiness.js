import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './GenAIReadiness.css';

const GenAIReadiness = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get assessment ID for edit mode
  const [framework, setFramework] = useState(null);
  const [responses, setResponses] = useState({});
  const [currentDimension, setCurrentDimension] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [showNameModal, setShowNameModal] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [assessmentId, setAssessmentId] = useState(null);

  console.log('[GenAIReadiness] Render. showNameModal:', showNameModal, 'customerName:', customerName, 'loading:', loading, 'editMode:', editMode);

  useEffect(() => {
    console.log('[GenAIReadiness] useEffect mount/id change. id:', id);
    loadFramework();
    if (id) {
      loadExistingAssessment(id);
    }
  }, [id]);

  const loadFramework = async () => {
    try {
      console.log('[GenAIReadiness] Loading framework from API...');
      const response = await axios.get('/api/genai-readiness/framework');
      console.log('[GenAIReadiness] Framework loaded successfully:', response.data);
      setFramework(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading framework:', error);
      setLoading(false);
    }
  };

  const loadExistingAssessment = async (assessmentId) => {
    try {
      const response = await axios.get(`/api/genai-readiness/assessments/${assessmentId}`);
      const assessment = response.data;
      
      setCustomerName(assessment.customerName);
      setResponses(assessment.responses);
      setEditMode(true);
      setAssessmentId(assessmentId);
      setShowNameModal(false);
    } catch (error) {
      console.error('Error loading assessment:', error);
      alert('Failed to load assessment for editing');
      navigate('/genai-readiness/list');
    }
  };

  const handleResponse = (questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handlePrefill = () => {
    if (!framework) return;
    
    if (!customerName || !customerName.trim()) {
      setCustomerName('Merck');
    }
    
    const prefilled = {};
    framework.dimensions.forEach(dimension => {
      dimension.questions.forEach(question => {
        if (question.options && question.options.length > 0) {
          const randomIndex = Math.floor(Math.random() * question.options.length);
          prefilled[question.id] = question.options[randomIndex].value;
        }
      });
    });
    
    setResponses(prefilled);
  };

  const calculateScore = () => {
    if (!framework) return { total: 0, byDimension: {} };
    
    let total = 0;
    const byDimension = {};
    
    framework.dimensions.forEach(dimension => {
      let dimensionScore = 0;
      dimension.questions.forEach(question => {
        const response = responses[question.id];
        if (response !== undefined) {
          const selectedOption = question.options.find(opt => opt.value === response);
          if (selectedOption) {
            dimensionScore += selectedOption.score;
          }
        }
      });
      byDimension[dimension.id] = {
        score: dimensionScore,
        maxScore: dimension.maxScore,
        percentage: Math.round((dimensionScore / dimension.maxScore) * 100)
      };
      total += dimensionScore;
    });
    
    return { total, byDimension };
  };

  const getMaturityLevel = (score) => {
    if (!framework) return null;
    return framework.maturityLevels.find(level => 
      score >= level.min && score <= level.max
    );
  };

  const handleSubmit = async () => {
    if (!customerName.trim()) {
      alert('Please enter a customer name');
      setShowNameModal(true);
      return;
    }

    setSaving(true);
    try {
      const scores = calculateScore();
      const maturityLevel = getMaturityLevel(scores.total);
      
      const assessmentData = {
        customerName: customerName.trim(),
        responses,
        scores: scores.byDimension,
        totalScore: scores.total,
        maxScore: framework.totalPoints,
        maturityLevel: maturityLevel?.level,
        completedAt: new Date().toISOString()
      };

      let response;
      if (editMode && assessmentId) {
        // Update existing assessment
        response = await axios.put(`/api/genai-readiness/assessments/${assessmentId}`, assessmentData);
        response.data.id = assessmentId;
      } else {
        // Create new assessment
        response = await axios.post('/api/genai-readiness/assessments', assessmentData);
      }
      
      // Navigate to report page
      navigate(`/genai-readiness/report/${response.data.id}`);
    } catch (error) {
      console.error('Error saving assessment:', error);
      alert('Failed to save assessment. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const isQuestionAnswered = (questionId) => {
    return responses[questionId] !== undefined;
  };

  const isDimensionComplete = (dimension) => {
    return dimension.questions.every(q => isQuestionAnswered(q.id));
  };

  const getProgressPercentage = () => {
    if (!framework) return 0;
    const totalQuestions = framework.dimensions.reduce((sum, dim) => sum + dim.questions.length, 0);
    const answeredQuestions = Object.keys(responses).length;
    return Math.round((answeredQuestions / totalQuestions) * 100);
  };

  if (loading) {
    return (
      <div className="genai-readiness-container">
        <div className="loading">Loading Gen AI Readiness Framework...</div>
      </div>
    );
  }

  if (!framework) {
    return (
      <div className="genai-readiness-container">
        <div className="error">Failed to load framework. Please refresh the page.</div>
      </div>
    );
  }

  const currentDim = framework.dimensions[currentDimension];
  const progress = getProgressPercentage();
  const scores = calculateScore();
  const allQuestionsAnswered = progress === 100;

  return (
    <div className="genai-readiness-container">
      {/* Customer Name Modal */}
      {showNameModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>🚀 Start Gen AI Readiness Assessment</h2>
            <p>Enter the customer or organization name for this assessment:</p>
            <input
              type="text"
              className="customer-name-input"
              placeholder="e.g., Acme Corporation"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && customerName.trim()) {
                  setShowNameModal(false);
                }
              }}
              autoFocus
            />
            <div className="modal-actions">
              <button 
                className="btn-secondary"
                onClick={() => navigate('/')}
              >
                Cancel
              </button>
              <button 
                className="btn-primary"
                onClick={() => {
                  console.log('[GenAIReadiness] Start Assessment button clicked. Customer Name:', customerName);
                  if (customerName.trim()) {
                    console.log('[GenAIReadiness] Closing name modal...');
                    setShowNameModal(false);
                  } else {
                    alert('Please enter a customer name');
                  }
                }}
                disabled={!customerName.trim()}
              >
                Start Assessment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="genai-header">
        <div className="genai-header-content">
          <h1>🤖 Generative AI Readiness Assessment</h1>
          <p className="genai-subtitle">
            Evaluate your organization's readiness to successfully deploy Generative AI solutions
          </p>
          <div className="customer-info">
            <strong>Customer:</strong> {customerName || 'Not specified'}
            <button 
              className="btn-link"
              onClick={() => setShowNameModal(true)}
            >
              Change
            </button>
            <span className="info-divider">|</span>
            <button 
              className="btn-link btn-prefill"
              onClick={handlePrefill}
              title="Automatically answer all questions with random selections for testing"
            >
              ⚡ Auto Prefill
            </button>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="progress-section">
          <div className="progress-header">
            <span>Overall Progress</span>
            <span className="progress-percentage">{progress}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="progress-details">
            {Object.keys(responses).length} of {framework.dimensions.reduce((sum, dim) => sum + dim.questions.length, 0)} questions answered
          </div>
        </div>

        {/* Current Score */}
        {progress > 0 && (
          <div className="current-score-card">
            <div className="score-value">{scores.total}/{framework.totalPoints}</div>
            <div className="score-label">Current Score</div>
            {getMaturityLevel(scores.total) && (
              <div 
                className="maturity-badge"
                style={{ backgroundColor: getMaturityLevel(scores.total).color }}
              >
                {getMaturityLevel(scores.total).label}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Dimension Navigation */}
      <div className="dimension-tabs">
        {framework.dimensions.map((dim, index) => (
          <button
            key={dim.id}
            className={`dimension-tab ${currentDimension === index ? 'active' : ''} ${isDimensionComplete(dim) ? 'complete' : ''}`}
            onClick={() => setCurrentDimension(index)}
          >
            <div className="tab-icon">
              {isDimensionComplete(dim) ? '✓' : index + 1}
            </div>
            <div className="tab-content">
              <div className="tab-title">{dim.name}</div>
              <div className="tab-score">
                {scores.byDimension[dim.id]?.score || 0}/{dim.maxScore}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Current Dimension Questions */}
      <div className="dimension-content">
        <div className="dimension-header">
          <h2>{currentDim.name}</h2>
          <p className="dimension-description">{currentDim.description}</p>
          <div className="dimension-progress">
            {currentDim.questions.filter(q => isQuestionAnswered(q.id)).length}/{currentDim.questions.length} questions completed
          </div>
        </div>

        <div className="questions-list">
          {currentDim.questions.map((question, qIndex) => (
            <div key={question.id} className={`question-card ${isQuestionAnswered(question.id) ? 'answered' : ''}`}>
              <div className="question-header">
                <span className="question-number">Question {qIndex + 1}</span>
                {isQuestionAnswered(question.id) && (
                  <span className="answered-badge">✓ Answered</span>
                )}
              </div>
              <h3 className="question-text">{question.text}</h3>
              
              <div className="options-list">
                {question.options.map(option => (
                  <label
                    key={option.value}
                    className={`option-card ${responses[question.id] === option.value ? 'selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name={question.id}
                      value={option.value}
                      checked={responses[question.id] === option.value}
                      onChange={() => handleResponse(question.id, option.value)}
                    />
                    <div className="option-content">
                      <div className="option-label">{option.label}</div>
                      <div className="option-score">{option.score} points</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="dimension-navigation">
          <button
            className="btn-secondary"
            onClick={() => setCurrentDimension(Math.max(0, currentDimension - 1))}
            disabled={currentDimension === 0}
          >
            ← Previous Dimension
          </button>
          
          {currentDimension < framework.dimensions.length - 1 ? (
            <button
              className="btn-primary"
              onClick={() => setCurrentDimension(currentDimension + 1)}
            >
              Next Dimension →
            </button>
          ) : (
            <button
              className="btn-success"
              onClick={handleSubmit}
              disabled={!allQuestionsAnswered || saving}
            >
              {saving ? 'Generating Report...' : '📊 Generate Report'}
            </button>
          )}
        </div>

        {!allQuestionsAnswered && currentDimension === framework.dimensions.length - 1 && (
          <div className="warning-message">
            ⚠️ Please answer all questions before generating the report
          </div>
        )}
      </div>
    </div>
  );
};

export default GenAIReadiness;

