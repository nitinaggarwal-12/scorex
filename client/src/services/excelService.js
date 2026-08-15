import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api/assessment-excel'
  : 'http://localhost:5001/api/assessment-excel';

const excelService = {
  /**
   * Download assessment data as Excel file
   * @param {string} assessmentId - Assessment ID
   * @returns {Promise<Blob>} - Excel file blob
   */
  async exportAssessment(assessmentId) {
    try {
      const response = await axios.get(`${API_URL}/${assessmentId}/export`, {
        responseType: 'blob'
      });
      
      return response.data;
    } catch (error) {
      console.error('Error exporting assessment:', error);
      throw new Error(error.response?.data?.message || 'Failed to export assessment to Excel');
    }
  },

  /**
   * Upload and import Excel file to update assessment
   * @param {string} assessmentId - Assessment ID
   * @param {File} file - Excel file
   * @returns {Promise<Object>} - Import result with statistics
   */
  async importAssessment(assessmentId, file) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(`${API_URL}/${assessmentId}/import`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error importing assessment:', error);
      throw new Error(error.response?.data?.message || 'Failed to import Excel file');
    }
  },

  /**
   * Trigger download of Excel file
   * @param {Blob} blob - Excel file blob
   * @param {string} filename - Desired filename
   */
  downloadFile(blob, filename) {
    const url = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
};

export default excelService;

