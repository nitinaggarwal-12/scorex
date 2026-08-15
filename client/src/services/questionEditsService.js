import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api/question-edits'
  : 'http://localhost:5001/api/question-edits';

/**
 * Get all question edits for an assessment
 */
export const getQuestionEdits = async (assessmentId) => {
  try {
    const response = await axios.get(`${API_URL}/${assessmentId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching question edits:', error);
    throw error;
  }
};

/**
 * Save or update a question edit
 */
export const saveQuestionEdit = async (assessmentId, questionId, editData) => {
  try {
    const response = await axios.post(
      `${API_URL}/${assessmentId}/${questionId}`,
      editData
    );
    return response.data;
  } catch (error) {
    console.error('Error saving question edit:', error);
    throw error;
  }
};

/**
 * Delete a question edit (revert to original)
 */
export const deleteQuestionEdit = async (assessmentId, questionId) => {
  try {
    const response = await axios.delete(`${API_URL}/${assessmentId}/${questionId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting question edit:', error);
    throw error;
  }
};

/**
 * Delete a question entirely
 */
export const deleteQuestion = async (assessmentId, questionId, deletedBy) => {
  try {
    const response = await axios.post(
      `${API_URL}/${assessmentId}/${questionId}/delete`,
      { deletedBy }
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting question:', error);
    throw error;
  }
};

/**
 * Get deleted questions for an assessment
 */
export const getDeletedQuestions = async (assessmentId) => {
  try {
    const response = await axios.get(`${API_URL}/${assessmentId}/deleted`);
    return response.data;
  } catch (error) {
    console.error('Error fetching deleted questions:', error);
    throw error;
  }
};

