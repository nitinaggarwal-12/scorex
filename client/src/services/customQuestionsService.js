import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 
  (window.location.hostname === 'localhost' ? 'http://localhost:5001/api' : '/api');

const customQuestionsService = {
  /**
   * Get all custom questions
   */
  async getAllQuestions(includeInactive = false, pillar = null) {
    try {
      const params = new URLSearchParams();
      if (includeInactive) params.append('includeInactive', 'true');
      if (pillar) params.append('pillar', pillar);
      
      const response = await axios.get(`${API_URL}/custom-questions?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching custom questions:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch custom questions');
    }
  },

  /**
   * Get a single custom question by ID
   */
  async getQuestionById(id) {
    try {
      const response = await axios.get(`${API_URL}/custom-questions/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching custom question:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch custom question');
    }
  },

  /**
   * Create a new custom question
   */
  async createQuestion(questionData) {
    try {
      const response = await axios.post(`${API_URL}/custom-questions`, questionData);
      return response.data;
    } catch (error) {
      console.error('Error creating custom question:', error);
      throw new Error(error.response?.data?.message || 'Failed to create custom question');
    }
  },

  /**
   * Update a custom question
   */
  async updateQuestion(id, questionData) {
    try {
      const response = await axios.put(`${API_URL}/custom-questions/${id}`, questionData);
      return response.data;
    } catch (error) {
      console.error('Error updating custom question:', error);
      throw new Error(error.response?.data?.message || 'Failed to update custom question');
    }
  },

  /**
   * Delete (deactivate) a custom question
   */
  async deleteQuestion(id, hard = false) {
    try {
      const params = new URLSearchParams();
      if (hard) params.append('hard', 'true');
      
      const response = await axios.delete(`${API_URL}/custom-questions/${id}?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting custom question:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete custom question');
    }
  },

  /**
   * Get custom questions statistics
   */
  async getStatistics() {
    try {
      const response = await axios.get(`${API_URL}/custom-questions/stats/summary`);
      return response.data;
    } catch (error) {
      console.error('Error fetching custom questions stats:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch statistics');
    }
  },

  /**
   * Assign a custom question to specific assessments
   */
  async assignToAssessments(questionId, assessmentIds) {
    try {
      const response = await axios.post(`${API_URL}/custom-questions/${questionId}/assign`, {
        assessmentIds
      });
      return response.data;
    } catch (error) {
      console.error('Error assigning question:', error);
      throw new Error(error.response?.data?.message || 'Failed to assign question');
    }
  },

  /**
   * Remove a question assignment from an assessment
   */
  async removeAssignment(questionId, assessmentId) {
    try {
      const response = await axios.delete(`${API_URL}/custom-questions/${questionId}/assign/${assessmentId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing assignment:', error);
      throw new Error(error.response?.data?.message || 'Failed to remove assignment');
    }
  },

  /**
   * Get all assessments that have this question assigned
   */
  async getQuestionAssignments(questionId) {
    try {
      const response = await axios.get(`${API_URL}/custom-questions/${questionId}/assignments`);
      return response.data;
    } catch (error) {
      console.error('Error fetching question assignments:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch assignments');
    }
  },

  /**
   * Get all custom questions for a specific assessment
   */
  async getAssessmentQuestions(assessmentId, pillar = null) {
    try {
      const params = new URLSearchParams();
      if (pillar) params.append('pillar', pillar);
      
      const response = await axios.get(`${API_URL}/custom-questions/assessments/${assessmentId}/questions?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching assessment questions:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch assessment questions');
    }
  }
};

export default customQuestionsService;

