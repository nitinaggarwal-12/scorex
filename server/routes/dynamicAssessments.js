const express = require('express');
const router = express.Router();
const customAssessmentRepo = require('../db/customAssessmentRepository');
const dynamicEngine = require('../services/dynamicAssessmentEngine');

/**
 * Dynamic Assessment Routes
 * Powered by Google Gemini (gemini-3.7-flash)
 */

// 1. AI-generate assessment framework from natural language prompt
router.post('/generate-framework', async (req, res) => {
  try {
    const { prompt, industry, targetAudience, focusAreas } = req.body;
    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ success: false, error: 'Prompt is required' });
    }

    const framework = await dynamicEngine.generateFrameworkFromPrompt(prompt.trim(), {
      industry,
      targetAudience,
      focusAreas
    });

    res.json({
      success: true,
      framework
    });
  } catch (error) {
    console.error('Error generating framework from prompt:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate assessment framework'
    });
  }
});

// 2. Assessment Types (Templates in the Registry)
router.get('/types', async (req, res) => {
  try {
    const promotedOnly = req.query.promotedOnly === 'true';
    const types = await customAssessmentRepo.getAllAssessmentTypes(promotedOnly);
    res.json({
      success: true,
      types
    });
  } catch (error) {
    console.error('Error fetching assessment types:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch assessment types' });
  }
});

router.get('/types/:typeKey', async (req, res) => {
  try {
    const { typeKey } = req.params;
    const type = await customAssessmentRepo.findAssessmentTypeByKey(typeKey);
    if (!type) {
      return res.status(404).json({ success: false, error: 'Assessment type not found' });
    }
    res.json({
      success: true,
      type
    });
  } catch (error) {
    console.error('Error fetching assessment type:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch assessment type' });
  }
});

router.post('/types', async (req, res) => {
  try {
    const typeData = req.body;
    if (!typeData.title || !typeData.framework) {
      return res.status(400).json({ success: false, error: 'Title and framework are required' });
    }

    const saved = await customAssessmentRepo.saveAssessmentType(typeData);
    res.json({
      success: true,
      message: 'Assessment type saved and promoted successfully',
      type: saved
    });
  } catch (error) {
    console.error('Error saving assessment type:', error);
    res.status(500).json({ success: false, error: 'Failed to save assessment type' });
  }
});

router.put('/types/:id/promote', async (req, res) => {
  try {
    const { id } = req.params;
    const { isPromoted } = req.body;
    const updated = await customAssessmentRepo.togglePromotion(id, isPromoted !== false);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Assessment type not found' });
    }
    res.json({
      success: true,
      message: isPromoted !== false ? 'Assessment type promoted to navigation' : 'Assessment type unpromoted',
      type: updated
    });
  } catch (error) {
    console.error('Error updating assessment type promotion:', error);
    res.status(500).json({ success: false, error: 'Failed to update promotion status' });
  }
});

router.delete('/types/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await customAssessmentRepo.deleteAssessmentType(id);
    res.json({ success: true, message: 'Assessment type deleted successfully' });
  } catch (error) {
    console.error('Error deleting assessment type:', error);
    res.status(500).json({ success: false, error: 'Failed to delete assessment type' });
  }
});

// 3. Dynamic Assessment Instances
router.post('/instances', async (req, res) => {
  try {
    const { customerName, useCase, contactEmail, typeKey, frameworkSnapshot, responses } = req.body;

    if (!customerName || !customerName.trim()) {
      return res.status(400).json({ success: false, error: 'Customer / Organization name is required' });
    }

    // Resolve framework snapshot
    let framework = frameworkSnapshot;
    if (!framework && typeKey) {
      const type = await customAssessmentRepo.findAssessmentTypeByKey(typeKey);
      if (type) framework = type.framework;
    }

    if (!framework || !framework.dimensions) {
      return res.status(400).json({ success: false, error: 'Assessment framework is required' });
    }

    const calculated = dynamicEngine.calculateScores(responses || {}, framework);

    const instance = await customAssessmentRepo.createInstance({
      typeKey: typeKey || framework.typeKey || 'custom',
      customerName: customerName.trim(),
      useCase: useCase || '',
      contactEmail: contactEmail || '',
      frameworkSnapshot: framework,
      responses: responses || {},
      scores: calculated.dimensionScores,
      totalScore: calculated.overallScore,
      maxScore: calculated.maxScore,
      maturityLevel: calculated.maturityLevel,
      status: 'in_progress'
    });

    res.json({
      success: true,
      instance
    });
  } catch (error) {
    console.error('Error creating assessment instance:', error);
    res.status(500).json({ success: false, error: 'Failed to create assessment instance' });
  }
});

router.get('/instances', async (req, res) => {
  try {
    const { customerName, typeKey, useCase } = req.query;
    const instances = await customAssessmentRepo.getAllInstances({
      customerName,
      typeKey,
      useCase
    });
    res.json({
      success: true,
      instances
    });
  } catch (error) {
    console.error('Error fetching assessment instances:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch assessment instances' });
  }
});

router.get('/instances/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const instance = await customAssessmentRepo.findInstanceById(id);
    if (!instance) {
      return res.status(404).json({ success: false, error: 'Assessment instance not found' });
    }
    res.json({
      success: true,
      instance
    });
  } catch (error) {
    console.error('Error fetching assessment instance:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch assessment instance' });
  }
});

router.put('/instances/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { responses, customerName, useCase, contactEmail, status } = req.body;

    const instance = await customAssessmentRepo.findInstanceById(id);
    if (!instance) {
      return res.status(404).json({ success: false, error: 'Assessment instance not found' });
    }

    const framework = instance.frameworkSnapshot || {};
    const updatedResponses = responses || instance.responses || {};
    const calculated = dynamicEngine.calculateScores(updatedResponses, framework);

    const updated = await customAssessmentRepo.updateInstance(id, {
      customerName: customerName || instance.customerName,
      useCase: useCase !== undefined ? useCase : instance.useCase,
      contactEmail: contactEmail || instance.contactEmail,
      responses: updatedResponses,
      scores: calculated.dimensionScores,
      totalScore: calculated.overallScore,
      maxScore: calculated.maxScore,
      maturityLevel: calculated.maturityLevel,
      status: status || instance.status,
      completedAt: status === 'completed' ? new Date().toISOString() : instance.completedAt
    });

    res.json({
      success: true,
      instance: updated,
      scores: calculated
    });
  } catch (error) {
    console.error('Error updating assessment instance:', error);
    res.status(500).json({ success: false, error: 'Failed to update assessment instance' });
  }
});

// 4. Generate AI Executive Report with Gemini 3.7
router.post('/instances/:id/generate-report', async (req, res) => {
  try {
    const { id } = req.params;
    const instance = await customAssessmentRepo.findInstanceById(id);
    if (!instance) {
      return res.status(404).json({ success: false, error: 'Assessment instance not found' });
    }

    const framework = instance.frameworkSnapshot || {};
    const aiReport = await dynamicEngine.generateDynamicReport(instance, framework);

    const calculated = dynamicEngine.calculateScores(instance.responses, framework);

    const updated = await customAssessmentRepo.updateInstance(id, {
      aiReport,
      scores: calculated.dimensionScores,
      totalScore: calculated.overallScore,
      maxScore: calculated.maxScore,
      maturityLevel: calculated.maturityLevel,
      status: 'completed',
      completedAt: new Date().toISOString()
    });

    res.json({
      success: true,
      aiReport,
      instance: updated
    });
  } catch (error) {
    console.error('Error generating AI report for dynamic assessment:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate AI executive report'
    });
  }
});

// 5. One-Click Promote Instance's Framework to Official Assessment Type
router.post('/instances/:id/promote-as-type', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitle, icon, badge, color } = req.body;

    const instance = await customAssessmentRepo.findInstanceById(id);
    if (!instance) {
      return res.status(404).json({ success: false, error: 'Assessment instance not found' });
    }

    const framework = instance.frameworkSnapshot || {};
    const customTitle = title || framework.title || 'Custom Assessment';
    const typeKey = (framework.typeKey || customTitle).toLowerCase().replace(/[^a-z0-9]/g, '_');

    const savedType = await customAssessmentRepo.saveAssessmentType({
      typeKey,
      title: customTitle,
      subtitle: subtitle || framework.subtitle || '',
      description: framework.description || '',
      icon: icon || framework.icon || 'FiAward',
      badge: badge || framework.badge || 'Promoted',
      color: color || framework.color || '#6366f1',
      framework,
      isPublished: true,
      isPromoted: true,
      createdBy: instance.createdBy || 'user'
    });

    res.json({
      success: true,
      message: `"${savedType.title}" promoted successfully to Assessments menu!`,
      type: savedType
    });
  } catch (error) {
    console.error('Error promoting assessment instance to type:', error);
    res.status(500).json({ success: false, error: 'Failed to promote assessment type' });
  }
});

// 6. Customers Overview (Multi-Assessment Portfolio per customer)
router.get('/customers', async (req, res) => {
  try {
    const customers = await customAssessmentRepo.getAllCustomersWithAssessments();
    res.json({
      success: true,
      customers
    });
  } catch (error) {
    console.error('Error fetching customers with assessments:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch customer assessment overview' });
  }
});

// 7. Get All Assessments for a Specific Customer (Unified View)
router.get('/customer/:customerName', async (req, res) => {
  try {
    const { customerName } = req.params;
    const instances = await customAssessmentRepo.getAllInstances({ customerName });
    res.json({
      success: true,
      customerName,
      assessments: instances
    });
  } catch (error) {
    console.error('Error fetching customer assessments:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch customer assessments' });
  }
});

module.exports = router;
