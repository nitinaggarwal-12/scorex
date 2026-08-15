import axios from 'axios';

/**
 * Dynamic Assessment Service
 * Connects frontend to backend Gemini 3.7 dynamic assessment engine and repository
 */
class DynamicAssessmentService {
  /**
   * AI-generate framework from natural language prompt
   */
  async generateFramework(prompt, options = {}) {
    const response = await axios.post('/api/dynamic-assessments/generate-framework', {
      prompt,
      industry: options.industry,
      targetAudience: options.targetAudience,
      focusAreas: options.focusAreas
    });
    return response.data;
  }

  /**
   * Fetch all assessment types (templates)
   */
  async getAssessmentTypes(promotedOnly = false) {
    const response = await axios.get('/api/dynamic-assessments/types', {
      params: { promotedOnly }
    });
    return response.data?.types || [];
  }

  /**
   * Fetch single assessment type by key
   */
  async getAssessmentTypeByKey(typeKey) {
    const response = await axios.get(`/api/dynamic-assessments/types/${typeKey}`);
    return response.data?.type || null;
  }

  /**
   * Save / Promote assessment framework as a reusable type
   */
  async saveAssessmentType(typeData) {
    const response = await axios.post('/api/dynamic-assessments/types', typeData);
    return response.data;
  }

  /**
   * Toggle promotion status for an assessment type
   */
  async togglePromotion(id, isPromoted) {
    const response = await axios.put(`/api/dynamic-assessments/types/${id}/promote`, {
      isPromoted
    });
    return response.data;
  }

  /**
   * Delete an assessment type
   */
  async deleteAssessmentType(id) {
    const response = await axios.delete(`/api/dynamic-assessments/types/${id}`);
    return response.data;
  }

  /**
   * Create dynamic assessment instance
   */
  async createInstance(instanceData) {
    const response = await axios.post('/api/dynamic-assessments/instances', instanceData);
    return response.data?.instance;
  }

  /**
   * Fetch dynamic assessment instance by ID
   */
  async getInstance(id) {
    const response = await axios.get(`/api/dynamic-assessments/instances/${id}`);
    return response.data?.instance;
  }

  /**
   * Fetch all dynamic assessment instances
   */
  async getInstances(filters = {}) {
    const response = await axios.get('/api/dynamic-assessments/instances', {
      params: filters
    });
    return response.data?.instances || [];
  }

  /**
   * Update assessment instance responses
   */
  async updateInstance(id, updateData) {
    const response = await axios.put(`/api/dynamic-assessments/instances/${id}`, updateData);
    return response.data;
  }

  /**
   * Trigger AI Executive Report Generation with Gemini 3.7
   */
  async generateReport(id) {
    const response = await axios.post(`/api/dynamic-assessments/instances/${id}/generate-report`);
    return response.data;
  }

  /**
   * Promote an instance's framework directly as a new Assessment Type
   */
  async promoteInstanceAsType(id, overrides = {}) {
    const response = await axios.post(`/api/dynamic-assessments/instances/${id}/promote-as-type`, overrides);
    return response.data;
  }

  /**
   * Fetch all customers overview
   */
  async getCustomers() {
    const response = await axios.get('/api/dynamic-assessments/customers');
    return response.data?.customers || [];
  }

  /**
   * Fetch all assessments for a specific customer
   */
  async getCustomerAssessments(customerName) {
    const response = await axios.get(`/api/dynamic-assessments/customer/${encodeURIComponent(customerName)}`);
    return response.data?.assessments || [];
  }
}

export default new DynamicAssessmentService();
