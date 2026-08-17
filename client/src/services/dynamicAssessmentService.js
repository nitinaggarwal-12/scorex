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
      focusAreas: options.focusAreas,
      tier: options.tier
    });
    return response.data;
  }

  /**
   * Fetch all assessment types (templates) with optional status filter
   */
  async getAssessmentTypes(promotedOnly = false, status = null) {
    const response = await axios.get('/api/dynamic-assessments/types', {
      params: { promotedOnly, status }
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
   * Update assessment type
   */
  async updateAssessmentType(id, updates) {
    const response = await axios.put(`/api/dynamic-assessments/types/${id}`, updates);
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
   * Generate instant realistic sample assessment instance for an assessment type
   */
  async generateSampleForType(typeKey) {
    const response = await axios.post(`/api/dynamic-assessments/types/${typeKey}/sample`);
    return response.data;
  }

  /**
   * Fetch sample assessment suite for "Try Sample" dropdown
   */
  async getSamplesList() {
    const response = await axios.get('/api/dynamic-assessments/samples-list');
    return response.data?.samples || [];
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
   * Delete dynamic assessment instance
   */
  async deleteInstance(id) {
    const response = await axios.delete(`/api/dynamic-assessments/instances/${id}`);
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
   * Generate bespoke Architecture Diagrams using Gemini 3.7 Flash API
   */
  async generateArchitectureDiagrams(id, customInstructions = '') {
    const response = await axios.post(`/api/dynamic-assessments/instances/${id}/generate-diagrams`, {
      customInstructions
    });
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

const dynamicAssessmentService = new DynamicAssessmentService();
export default dynamicAssessmentService;
