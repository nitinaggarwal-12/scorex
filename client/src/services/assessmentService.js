import axios from 'axios';

// Use relative URL in production (Railway), localhost in development
const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (window.location.hostname === 'localhost' ? 'http://localhost:5001/api' : '/api');

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add session ID to all requests
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    
    // Add session ID from localStorage to headers
    const sessionId = localStorage.getItem('sessionId');
    if (sessionId) {
      config.headers['x-session-id'] = sessionId;
      console.log('Added session ID to request');
    } else {
      console.warn('No session ID found in localStorage');
    }
    
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('Response error:', error);
    
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || 'Server error occurred';
      throw new Error(message);
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('No response from server. Please check your connection.');
    } else {
      // Something else happened
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }
);

// Assessment Service Functions

/**
 * Get the assessment framework with all categories and questions
 */
export const getAssessmentFramework = async () => {
  try {
    const response = await api.get('/assessment/framework');
    return response.data;
  } catch (error) {
    console.error('Error fetching assessment framework:', error);
    throw error;
  }
};

/**
 * Start a new assessment
 */
export const startAssessment = async (organizationInfo) => {
  try {
    const response = await api.post('/assessment/start', organizationInfo);
    return response.data;
  } catch (error) {
    console.error('Error starting assessment:', error);
    throw error;
  }
};

/**
 * Get assessment status and progress
 */
export const getAssessmentStatus = async (assessmentId) => {
  try {
    const response = await api.get(`/assessment/${assessmentId}/status`);
    // API interceptor already extracts response.data, so we get the actual data directly
    // Backend returns { success: true, data: { ... } }
    if (response.success && response.data) {
      return response.data;
    }
    // Fallback for backwards compatibility
    return response;
  } catch (error) {
    console.error('Error fetching assessment status:', error);
    throw error;
  }
};

/**
 * Get questions for a specific category
 */
export const getCategoryQuestions = async (assessmentId, categoryId) => {
  try {
    const response = await api.get(`/assessment/${assessmentId}/category/${categoryId}`);
    // Axios interceptor already returns response.data, so 'response' is { success, data: { area, existingResponses } }
    if (response && response.data) {
      return response.data; // Return the inner 'data' object with area and existingResponses
    }
    return response;
  } catch (error) {
    console.error('Error fetching category questions:', error);
    throw error;
  }
};

/**
 * Submit responses for a category
 */
export const submitCategoryResponses = async (assessmentId, categoryId, responses) => {
  try {
    const response = await api.post(`/assessment/${assessmentId}/category/${categoryId}/submit`, {
      responses
    });
    return response.data;
  } catch (error) {
    console.error('Error submitting category responses:', error);
    throw error;
  }
};

/**
 * Submit all responses at once (bulk submission for sample assessments)
 */
export const submitBulkResponses = async (assessmentId, responses, completedCategories) => {
  try {
    const response = await api.post(`/assessment/${assessmentId}/bulk-submit`, {
      responses,
      completedCategories,
      status: 'completed'
    });
    return response.data;
  } catch (error) {
    console.error('Error submitting bulk responses:', error);
    throw error;
  }
};

/**
 * Get assessment results and recommendations
 */
export const getAssessmentResults = async (assessmentId, forceRefresh = false) => {
  try {
    // Add cache-busting timestamp to force fresh fetch
    const cacheBuster = Date.now();
    const headers = forceRefresh ? {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    } : {};
    
    const response = await api.get(`/assessment/${assessmentId}/results?_refresh=${forceRefresh ? 'true' : 'false'}&_=${cacheBuster}`, {
      headers
    });
    // API interceptor already extracts response.data, so we get the actual data directly
    // Backend returns { success: true, data: { ... } }
    return response; // Return the full response (already has .data extracted by interceptor)
  } catch (error) {
    console.error('Error fetching assessment results:', error);
    throw error;
  }
};

/**
 * Auto-save progress for individual question responses
 */
export const saveProgress = async (assessmentId, questionId, perspectiveId, value, comment, isSkipped, editorEmail) => {
  try {
    // Note: axios interceptor already returns response.data, so 'data' IS the response body
    const data = await api.post(`/assessment/${assessmentId}/save-progress`, {
      questionId,
      perspectiveId,
      value,
      comment,
      isSkipped,
      editorEmail
    });
    
    // Backend returns { success: true, lastSaved: '...' }
    return data || { success: true };
  } catch (error) {
    console.error('Error saving progress:', error);
    // Don't throw error for auto-save failures to avoid disrupting user experience
    return { success: false, error: error.message };
  }
};

/**
 * Save individual question response (alias for saveProgress)
 */
export const saveQuestionResponse = saveProgress;

/**
 * Get all assessments for management
 */
export const getAllAssessments = async () => {
  try {
    const response = await api.get('/assessments');
    // Handle different response structures and ensure we always return an array
    if (response && response.data) {
      return Array.isArray(response.data) ? response.data : [];
    }
    return [];
  } catch (error) {
    console.error('Error fetching assessments:', error);
    // Return empty array instead of throwing to prevent UI crash
    return [];
  }
};

/**
 * Alias for getAllAssessments (for backward compatibility)
 */
export const getAssessments = getAllAssessments;

/**
 * Save edited Executive Summary content
 */
export const saveEditedExecutiveSummary = async (assessmentId, editedContent) => {
  try {
    console.log(`[saveEditedExecutiveSummary] Saving for assessment: ${assessmentId}`);
    const data = await api.put(`/assessment/${assessmentId}/edited-executive-summary`, editedContent);
    console.log(`[saveEditedExecutiveSummary] Saved successfully`);
    return data;
  } catch (error) {
    console.error('Error saving edited executive summary:', error);
    throw error;
  }
};

/**
 * Clone an existing assessment
 */
export const cloneAssessment = async (assessmentId, organizationData = {}) => {
  try {
    const response = await api.post(`/assessment/${assessmentId}/clone`, organizationData);
    return response.data.data;
  } catch (error) {
    console.error('Error cloning assessment:', error);
    throw error;
  }
};

/**
 * Delete all assessments
 */
export const deleteAllAssessments = async () => {
  try {
    console.log('[deleteAllAssessments] Deleting all assessments');
    const response = await api.delete('/assessments/all');
    console.log('[deleteAllAssessments] Response:', response);
    return response;
  } catch (error) {
    console.error('[deleteAllAssessments] Error:', error);
    throw error;
  }
};

/**
 * Get dashboard statistics
 */
export const getDashboardStats = async () => {
  try {
    console.log('[getDashboardStats] Fetching dashboard statistics');
    const response = await api.get('/dashboard/stats');
    console.log('[getDashboardStats] Response:', response);
    return response;
  } catch (error) {
    console.error('[getDashboardStats] Error:', error);
    throw error;
  }
};

/**
 * Submit NPS feedback
 */
export const submitNPSFeedback = async (assessmentId, feedbackData) => {
  try {
    console.log('[submitNPSFeedback] Submitting feedback for assessment:', assessmentId);
    const response = await api.post(`/assessment/${assessmentId}/nps-feedback`, feedbackData);
    console.log('[submitNPSFeedback] Response:', response);
    return response;
  } catch (error) {
    console.error('[submitNPSFeedback] Error:', error);
    throw error;
  }
};

/**
 * Delete an assessment
 */
export const deleteAssessment = async (assessmentId) => {
  try {
    const response = await api.delete(`/assessment/${assessmentId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting assessment:', error);
    throw error;
  }
};

/**
 * Update assessment metadata (name, email, etc.)
 */
export const updateAssessmentMetadata = async (assessmentId, metadata) => {
  try {
    const response = await api.patch(`/assessment/${assessmentId}/metadata`, metadata);
    return response;
  } catch (error) {
    console.error('Error updating assessment metadata:', error);
    throw error;
  }
};

/**
 * Generate a sample assessment with random data
 */
export const generateSampleAssessment = async (completionLevel = 'full', specificPillars = null) => {
  try {
    console.log('[generateSampleAssessment] Generating with level:', completionLevel);
    // Note: axios interceptor already returns response.data, so 'data' IS the response body
    const data = await api.post('/assessment/generate-sample', {
      completionLevel,
      specificPillars
    });
    console.log('[generateSampleAssessment] Response:', data);
    return data;
  } catch (error) {
    console.error('❌ Failed to generate sample assessment:', error);
    throw error;
  }
};

/**
 * Submit assessment for final results
 */
export const submitAssessment = async (assessmentId) => {
  try {
    console.log('[submitAssessment] Submitting assessment:', assessmentId);
    const data = await api.post(`/assessment/${assessmentId}/submit`);
    console.log('[submitAssessment] Response:', data);
    return data;
  } catch (error) {
    console.error('❌ Failed to submit assessment:', error);
    throw error;
  }
};

/**
 * Get industry benchmarking report
 */
export const getBenchmarkReport = async (assessmentId) => {
  try {
    console.log(`[getBenchmarkReport] Fetching for assessment: ${assessmentId}`);
    const response = await api.get(`/assessment/${assessmentId}/benchmark`);
    // API interceptor already extracts response.data
    if (response.success && response.data) {
      return response.data;
    }
    return response;
  } catch (error) {
    console.error('Error fetching benchmark report:', error);
    throw error;
  }
};

/**
 * Health check
 */
export const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    throw error;
  }
};

// Utility functions

/**
 * Calculate progress percentage
 */
export const calculateProgress = (completedCategories, totalCategories) => {
  if (!totalCategories || totalCategories === 0) return 0;
  return Math.round((completedCategories / totalCategories) * 100);
};

/**
 * Format assessment duration
 */
export const formatDuration = (startTime, endTime) => {
  if (!startTime) return 'Unknown';
  
  const start = new Date(startTime);
  const end = endTime ? new Date(endTime) : new Date();
  const diffMs = end - start;
  
  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else {
    return `${minutes}m`;
  }
};

/**
 * Get maturity level color
 */
export const getMaturityColor = (score) => {
  const colors = {
    1: '#ff4444',
    2: '#ff8800',
    3: '#ffaa00',
    4: '#88cc00',
    5: '#00cc44'
  };
  return colors[score] || '#cccccc';
};

/**
 * Get priority color
 */
export const getPriorityColor = (priority) => {
  const colors = {
    'critical': '#ff4444',
    'high': '#ff8800',
    'medium': '#ffaa00',
    'low': '#88cc00'
  };
  return colors[priority] || '#cccccc';
};

/**
 * Validate assessment responses
 */
export const validateResponses = (questions, responses) => {
  const errors = [];
  
  questions.forEach(question => {
    const response = responses[question.id];
    
    if (!response) {
      errors.push(`Response required for: ${question.question}`);
    } else if (question.type === 'multiple_choice' && (!Array.isArray(response) || response.length === 0)) {
      errors.push(`At least one option must be selected for: ${question.question}`);
    }
  });
  
  return errors;
};

/**
 * Fetch logo from external URL via backend proxy (bypasses CORS)
 */
export const fetchLogoFromURL = async (url) => {
  try {
    const response = await api.post('/fetch-logo', { url });
    return response;
  } catch (error) {
    console.error('Error fetching logo from URL:', error);
    throw error;
  }
};

export default api;




