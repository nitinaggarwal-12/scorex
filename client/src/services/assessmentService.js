import axios from 'axios';
import authService from './authService';

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

// Request interceptor - Add a real or isolated-demo session ID to all requests.
api.interceptors.request.use(
  (config) => {
    let sessionId = localStorage.getItem('sessionId');

    if (!sessionId) {
      authService.createGuestSession();
      sessionId = localStorage.getItem('sessionId');
    }

    if (sessionId) {
      config.headers['x-session-id'] = sessionId;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('Assessment API request failed:', error.response?.status || error.message);

    if (error.response) {
      const message = error.response.data?.message || error.response.data?.error || 'Server error occurred';
      throw new Error(message);
    }
    if (error.request) {
      throw new Error('No response from server. Please check your connection.');
    }
    throw new Error(error.message || 'An unexpected error occurred');
  }
);

/**
 * Get the assessment framework with all categories and questions
 */
export const getAssessmentFramework = async () => {
  try {
    const response = await api.get('/assessment/framework');
    return response?.data || response;
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
    return response?.data || response;
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
    return response?.data || response;
  } catch (error) {
    console.error('Error fetching assessment status:', error);
    throw error;
  }
};

/**
 * Get questions for a specific assessment category
 */
export const getCategoryQuestions = async (assessmentId, categoryId) => {
  try {
    const response = await api.get(`/assessment/${assessmentId}/category/${categoryId}`);
    return response?.data || response;
  } catch (error) {
    console.error('Error fetching category questions:', error);
    throw error;
  }
};

/**
 * Save response for a question
 */
export const saveResponse = async (assessmentId, categoryId, questionId, responseData) => {
  try {
    const response = await api.post(
      `/assessment/${assessmentId}/category/${categoryId}/question/${questionId}/response`,
      responseData
    );
    return response?.data || response;
  } catch (error) {
    console.error('Error saving response:', error);
    throw error;
  }
};

/**
 * Complete a category
 */
export const completeCategory = async (assessmentId, categoryId) => {
  try {
    const response = await api.post(`/assessment/${assessmentId}/category/${categoryId}/complete`);
    return response?.data || response;
  } catch (error) {
    console.error('Error completing category:', error);
    throw error;
  }
};

/**
 * Get assessment results
 */
export const getAssessmentResults = async (assessmentId) => {
  try {
    const response = await api.get(`/assessment/${assessmentId}/results`);
    return response?.data || response;
  } catch (error) {
    console.error('Error fetching assessment results:', error);
    throw error;
  }
};

/**
 * Get raw assessment data
 */
export const getAssessment = async (assessmentId) => {
  try {
    return await api.get(`/assessment/${assessmentId}`);
  } catch (error) {
    console.error('Error fetching assessment:', error);
    throw error;
  }
};

/**
 * Get all assessments
 */
export const getAllAssessments = async () => {
  try {
    const response = await api.get('/assessments');
    return response?.assessments || response?.data || response || [];
  } catch (error) {
    console.error('Error fetching assessments:', error);
    throw error;
  }
};

/**
 * Update assessment metadata
 */
export const updateAssessment = async (assessmentId, updates) => {
  try {
    const response = await api.put(`/assessment/${assessmentId}`, updates);
    return response?.data || response;
  } catch (error) {
    console.error('Error updating assessment:', error);
    throw error;
  }
};

/**
 * Delete assessment
 */
export const deleteAssessment = async (assessmentId) => {
  try {
    const response = await api.delete(`/assessment/${assessmentId}`);
    return response?.data || response;
  } catch (error) {
    console.error('Error deleting assessment:', error);
    throw error;
  }
};

/**
 * Generate a sample assessment
 */
export const generateSampleAssessment = async () => {
  try {
    const response = await api.post('/assessment/generate-sample');
    return response?.data || response;
  } catch (error) {
    console.error('Error generating sample assessment:', error);
    throw error;
  }
};

/**
 * Generate multiple samples
 */
export const generateMultipleSamples = async (count = 5) => {
  try {
    const response = await api.post('/assessment/generate-multiple-samples', { count });
    return response?.data || response;
  } catch (error) {
    console.error('Error generating multiple samples:', error);
    throw error;
  }
};

/**
 * Get all assessment types/templates exposed by the dynamic assessment catalog
 */
export const getAssessmentTypes = async () => {
  try {
    const response = await api.get('/dynamic-assessments/types');
    return response?.types || response?.data?.types || [];
  } catch (error) {
    console.error('Error fetching assessment types:', error);
    return [];
  }
};

export default api;
