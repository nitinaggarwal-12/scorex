import axios from 'axios';

// Use relative URL in production (Railway), localhost in development
const API_URL = process.env.REACT_APP_API_URL || 
  (window.location.hostname === 'localhost' ? 'http://localhost:5001/api' : '/api');

const feedbackService = {
  // Submit new feedback
  async submitFeedback(feedbackData) {
    try {
      const response = await axios.post(`${API_URL}/feedback`, feedbackData);
      return response.data;
    } catch (error) {
      console.error('Error submitting feedback:', error);
      throw new Error(error.response?.data?.error || 'Failed to submit feedback');
    }
  },

  // Get all feedback (admin only)
  async getAllFeedback() {
    try {
      const response = await axios.get(`${API_URL}/feedback`);
      return response.data;
    } catch (error) {
      console.error('Error fetching feedback:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch feedback');
    }
  },

  // Get feedback by ID
  async getFeedbackById(id) {
    try {
      const response = await axios.get(`${API_URL}/feedback/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching feedback:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch feedback');
    }
  }
};

export default feedbackService;

