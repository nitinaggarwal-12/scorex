import axios from 'axios';

// Use relative URL in production (Railway), localhost in development
const API_URL = process.env.REACT_APP_API_URL || 
  (window.location.hostname === 'localhost' ? 'http://localhost:5001/api' : '/api');

class AssignmentService {
  // Create new assignment (assign assessment to consumer)
  async assignAssessment(data) {
    try {
      // Build payload with all provided fields
      const payload = {
        ...data
      };
      
      const response = await axios.post(`${API_URL}/assignments/assign`, payload);
      return { success: true, data: response.data };
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to assign assessment');
    }
  }

  // Get my assignments
  async getMyAssignments() {
    try {
      const response = await axios.get(`${API_URL}/assignments/my-assignments`);
      return { success: true, assignments: response.data.assignments };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to fetch assignments' 
      };
    }
  }

  // Get assignment by assessment ID
  async getAssignmentByAssessmentId(assessmentId) {
    try {
      const response = await axios.get(`${API_URL}/assignments/assessment/${assessmentId}`);
      return { success: true, assignment: response.data.assignment, access: response.data.access };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to fetch assignment' 
      };
    }
  }

  // Release assessment to consumer
  async releaseAssessment(assessmentId) {
    try {
      const response = await axios.post(`${API_URL}/assignments/release/${assessmentId}`);
      return { success: true, assignment: response.data.assignment };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to release assessment' 
      };
    }
  }

  // Submit assessment (consumer completes it)
  async submitAssessment(assessmentId) {
    try {
      const response = await axios.post(`${API_URL}/assignments/submit/${assessmentId}`);
      return { success: true, assignment: response.data.assignment };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to submit assessment' 
      };
    }
  }

  // Get all assignments (admin only)
  async getAllAssignments() {
    try {
      const response = await axios.get(`${API_URL}/assignments/all`);
      return { success: true, assignments: response.data.assignments };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to fetch all assignments' 
      };
    }
  }
}

export default new AssignmentService();

