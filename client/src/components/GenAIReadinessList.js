import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiEdit2, FiDownload, FiUpload, FiCopy, FiTrash2, FiEye, FiShare2 } from 'react-icons/fi';
import './GenAIReadinessList.css';

const GenAIReadinessList = () => {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, completed, incomplete
  const [sortBy, setSortBy] = useState('date'); // date, score, name

  useEffect(() => {
    loadAssessments();
  }, []);

  const loadAssessments = async () => {
    try {
      const response = await axios.get('/api/genai-readiness/assessments');
      setAssessments(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading assessments:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this assessment?')) {
      return;
    }

    try {
      await axios.delete(`/api/genai-readiness/assessments/${id}`);
      setAssessments(assessments.filter(a => a.id !== id));
    } catch (error) {
      console.error('Error deleting assessment:', error);
      alert('Failed to delete assessment');
    }
  };

  const handleEdit = (id, e) => {
    e.stopPropagation();
    // Navigate to edit mode (same as creating new assessment but with pre-filled data)
    navigate(`/genai-readiness/edit/${id}`);
  };

  const handleClone = async (id, e) => {
    e.stopPropagation();
    try {
      const response = await axios.get(`/api/genai-readiness/assessments/${id}`);
      const original = response.data;
      
      // Create a clone with new name
      const cloneName = prompt('Enter name for cloned assessment:', `${original.customerName} (Copy)`);
      if (!cloneName) return;

      const cloned = {
        customerName: cloneName,
        responses: original.responses,
        scores: original.scores,
        totalScore: original.totalScore,
        maxScore: original.maxScore,
        maturityLevel: original.maturityLevel,
        completedAt: new Date().toISOString()
      };

      const cloneResponse = await axios.post('/api/genai-readiness/assessments', cloned);
      
      // Reload assessments
      loadAssessments();
      alert('Assessment cloned successfully!');
    } catch (error) {
      console.error('Error cloning assessment:', error);
      alert('Failed to clone assessment');
    }
  };

  const handleDownloadExcel = async (id, e) => {
    e.stopPropagation();
    try {
      const response = await axios.get(`/api/genai-readiness/assessments/${id}/excel`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      const assessment = assessments.find(a => a.id === id);
      link.setAttribute('download', `GenAI_Readiness_${assessment?.customerName || 'Assessment'}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading Excel:', error);
      alert('Excel download feature coming soon!');
    }
  };

  const handleUploadExcel = (id, e) => {
    e.stopPropagation();
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx,.xls';
    input.onchange = async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      const confirmed = window.confirm(
        `Upload Excel for Assessment?\n\n` +
        `This will update the assessment with responses from the Excel file.\n\n` +
        `Make sure the Excel file:\n` +
        `• Was downloaded from this app\n` +
        `• Has the 'Responses' sheet\n` +
        `• Selected answers match the option text exactly\n\n` +
        `Continue?`
      );
      
      if (!confirmed) return;

      try {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await axios.post(
          `/api/genai-readiness/assessments/${id}/upload-excel`, 
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' }
          }
        );
        
        loadAssessments();
        alert(
          `✅ Excel Uploaded Successfully!\n\n` +
          `Total Score: ${response.data.totalScore}\n` +
          `Maturity Level: ${response.data.maturityLevel}\n` +
          `Responses Updated: ${response.data.responsesCount}`
        );
      } catch (error) {
        console.error('Error uploading Excel:', error);
        const errorMsg = error.response?.data?.error || 'Failed to upload Excel file';
        alert(`❌ Upload Failed\n\n${errorMsg}\n\nPlease ensure:\n• File is a valid Excel (.xlsx)\n• 'Responses' sheet exists\n• Selected answers match exactly`);
      }
    };
    input.click();
  };

  const handleShare = (id, e) => {
    e.stopPropagation();
    const url = `${window.location.origin}/genai-readiness/report/${id}`;
    navigator.clipboard.writeText(url);
    alert('Report link copied to clipboard!');
  };

  const getMaturityColor = (level) => {
    const colors = {
      'Initial': '#dc3545',
      'Developing': '#fd7e14',
      'Defined': '#ffc107',
      'Managed': '#20c997',
      'Optimizing': '#28a745'
    };
    return colors[level] || '#6c757d';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFilteredAndSortedAssessments = () => {
    let filtered = [...assessments];

    // Filter
    if (filter === 'completed') {
      filtered = filtered.filter(a => a.totalScore > 0);
    } else if (filter === 'incomplete') {
      filtered = filtered.filter(a => a.totalScore === 0);
    }

    // Sort
    if (sortBy === 'date') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'score') {
      filtered.sort((a, b) => b.totalScore - a.totalScore);
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => a.customerName.localeCompare(b.customerName));
    }

    return filtered;
  };

  if (loading) {
    return (
      <div className="genai-list-container">
        <div className="loading">Loading assessments...</div>
      </div>
    );
  }

  const filteredAssessments = getFilteredAndSortedAssessments();

  return (
    <div className="genai-list-container">
      <div className="genai-list-header">
        <div className="header-top">
          <h1>🤖 Gen AI Readiness Assessments</h1>
          <button 
            className="btn-primary"
            onClick={() => navigate('/genai-readiness')}
          >
            + New Assessment
          </button>
        </div>

        <div className="header-stats">
          <div className="stat-card">
            <div className="stat-value">{assessments.length}</div>
            <div className="stat-label">Total Assessments</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {assessments.filter(a => a.totalScore > 0).length}
            </div>
            <div className="stat-label">Completed</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {assessments.length > 0 
                ? Math.round(assessments.reduce((sum, a) => sum + a.totalScore, 0) / assessments.length)
                : 0}
            </div>
            <div className="stat-label">Average Score</div>
          </div>
        </div>

        <div className="header-controls">
          <div className="filter-group">
            <label>Filter:</label>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All Assessments</option>
              <option value="completed">Completed Only</option>
              <option value="incomplete">In Progress</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Sort By:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="date">Date (Newest First)</option>
              <option value="score">Score (Highest First)</option>
              <option value="name">Customer Name (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {filteredAssessments.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h2>No assessments found</h2>
          <p>
            {filter === 'all' 
              ? 'Get started by creating your first Gen AI Readiness assessment'
              : `No ${filter} assessments found. Try changing the filter.`
            }
          </p>
          <button 
            className="btn-primary"
            onClick={() => navigate('/genai-readiness')}
          >
            Start New Assessment
          </button>
        </div>
      ) : (
        <div className="assessments-grid">
          {filteredAssessments.map(assessment => (
            <div key={assessment.id} className="assessment-card">
              <div className="card-header">
                <h3>{assessment.customerName}</h3>
                {assessment.maturityLevel && (
                  <div 
                    className="maturity-badge"
                    style={{ backgroundColor: getMaturityColor(assessment.maturityLevel) }}
                  >
                    {assessment.maturityLevel}
                  </div>
                )}
              </div>

              <div className="card-body">
                <div className="score-display">
                  <div className="score-value">
                    {assessment.totalScore}/{assessment.maxScore}
                  </div>
                  <div className="score-label">Score</div>
                </div>

                <div className="assessment-meta">
                  <div className="meta-item">
                    <span className="meta-label">Completed:</span>
                    <span className="meta-value">
                      {formatDate(assessment.completedAt)}
                    </span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Progress:</span>
                    <span className="meta-value">
                      {assessment.totalScore > 0 ? '100%' : '0%'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="card-actions">
                <button
                  className="action-icon view-icon"
                  onClick={() => navigate(`/genai-readiness/report/${assessment.id}`)}
                  title="View Report"
                >
                  <FiEye />
                </button>
                <button
                  className="action-icon edit-icon"
                  onClick={(e) => handleEdit(assessment.id, e)}
                  title="Edit Assessment"
                >
                  <FiEdit2 />
                </button>
                <button
                  className="action-icon clone-icon"
                  onClick={(e) => handleClone(assessment.id, e)}
                  title="Clone Assessment"
                >
                  <FiCopy />
                </button>
                <button
                  className="action-icon download-icon"
                  onClick={(e) => handleDownloadExcel(assessment.id, e)}
                  title="Download Excel"
                >
                  <FiDownload />
                </button>
                <button
                  className="action-icon upload-icon"
                  onClick={(e) => handleUploadExcel(assessment.id, e)}
                  title="Upload Excel"
                >
                  <FiUpload />
                </button>
                <button
                  className="action-icon share-icon"
                  onClick={(e) => handleShare(assessment.id, e)}
                  title="Share Report Link"
                >
                  <FiShare2 />
                </button>
                <button
                  className="action-icon delete-icon"
                  onClick={(e) => handleDelete(assessment.id, e)}
                  title="Delete Assessment"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GenAIReadinessList;

