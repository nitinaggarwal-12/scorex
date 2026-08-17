const express = require('express');
const router = express.Router();
const customAssessmentRepo = require('../db/customAssessmentRepository');
const dynamicEngine = require('../services/dynamicAssessmentEngine');

/**
 * Dynamic Assessment Routes
 * Powered by Google Gemini (gemini-3.7-flash)
 */

// 1. AI-generate assessment framework from natural language prompt and AUTO-PERSIST as template
router.post('/generate-framework', async (req, res) => {
  try {
    const { prompt, industry, targetAudience, focusAreas, tier } = req.body;
    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ success: false, error: 'Prompt is required' });
    }

    const framework = await dynamicEngine.generateFrameworkFromPrompt(prompt.trim(), {
      industry,
      targetAudience,
      focusAreas,
      tier
    });

    // Auto-persist into template registry as a draft
    const savedType = await customAssessmentRepo.saveAssessmentType({
      typeKey: framework.typeKey,
      title: framework.title,
      subtitle: framework.subtitle || (industry ? `Tailored for ${industry}` : ''),
      description: framework.description,
      icon: framework.icon || 'FiAward',
      badge: framework.badge || 'AI Generated',
      color: framework.color || '#8b5cf6',
      framework,
      status: 'draft',
      isPublished: true,
      isPromoted: false,
      createdBy: req.body.createdBy || 'ai-generator'
    });

    res.json({
      success: true,
      framework,
      type: savedType,
      message: 'Assessment framework generated and saved to Templates Catalog.'
    });
  } catch (error) {
    console.error('Error generating framework from prompt:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate assessment framework'
    });
  }
});

// 2. Assessment Types & Templates (Registry)
router.get('/types', async (req, res) => {
  try {
    const promotedOnly = req.query.promotedOnly === 'true';
    const status = req.query.status || null; // 'production' | 'draft'
    const types = await customAssessmentRepo.getAllAssessmentTypes(promotedOnly, status);
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
      message: 'Assessment template saved successfully',
      type: saved
    });
  } catch (error) {
    console.error('Error saving assessment type:', error);
    res.status(500).json({ success: false, error: 'Failed to save assessment type' });
  }
});

router.put('/types/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updated = await customAssessmentRepo.updateAssessmentType(id, updates);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Assessment type not found' });
    }
    res.json({
      success: true,
      message: 'Assessment template updated successfully',
      type: updated
    });
  } catch (error) {
    console.error('Error updating assessment type:', error);
    res.status(500).json({ success: false, error: 'Failed to update assessment type' });
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
      message: isPromoted !== false ? 'Assessment promoted to navigation' : 'Assessment unpromoted from navigation',
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
    res.json({ success: true, message: 'Assessment template deleted successfully' });
  } catch (error) {
    console.error('Error deleting assessment type:', error);
    res.status(500).json({ success: false, error: 'Failed to delete assessment type' });
  }
});

// 3. One-Click Sample Generation for Any Assessment Type
router.post('/types/:typeKey/sample', async (req, res) => {
  try {
    const { typeKey } = req.params;
    const type = await customAssessmentRepo.findAssessmentTypeByKey(typeKey);
    if (!type || !type.framework) {
      return res.status(404).json({ success: false, error: 'Assessment framework not found' });
    }

    const framework = type.framework;
    const dimensions = framework.dimensions || [];

    // 4 Diverse Enterprise Archetype Profiles for realistic, varied prefilling
    const enterpriseProfiles = [
      {
        name: 'Legacy Modernization Journey',
        baseMin: 1,
        baseMax: 3,
        targetOffset: 2,
        painPointIntensity: 2
      },
      {
        name: 'Active Cloud Transformation',
        baseMin: 2,
        baseMax: 4,
        targetOffset: 2,
        painPointIntensity: 1
      },
      {
        name: 'Security & Governance Priority',
        baseMin: 2,
        baseMax: 4,
        targetOffset: 1,
        painPointIntensity: 2
      },
      {
        name: 'Scaling Optimization & AI Mesh',
        baseMin: 3,
        baseMax: 5,
        targetOffset: 1,
        painPointIntensity: 1
      }
    ];

    const profile = enterpriseProfiles[Math.floor(Math.random() * enterpriseProfiles.length)];
    const seed = Date.now();

    const sampleComments = [
      'Current setup relies on manual pipelines and partial scripting with high operational overhead.',
      'Architecture modernization initiative approved by leadership for current fiscal year.',
      'Team is evaluating Google Cloud Vertex AI & Gemini Enterprise for prompt caching and long-context reasoning.',
      'Security and compliance standards require automated VPC Service Controls and Customer-Managed Encryption Keys (CMEK).',
      'Active cross-functional initiative underway to unify metadata, governance, and CI/CD deployment pipelines.',
      'FinOps team flagged unpredictable monthly spend; implementing BigQuery Editions slot reservations.',
      'Production workload undergoing active migration; focusing on real-time CDC and sub-second query latency.',
      'CISO signed off on Zero-Trust AI Gateway architecture to unblock enterprise-wide production rollout.'
    ];

    const sampleResponses = {};

    dimensions.forEach((dim, dIdx) => {
      const dimVariance = ((seed + dIdx * 7) % 3) - 1; // -1, 0, or 1

      (dim.questions || []).forEach((q, qIdx) => {
        const range = Math.max(1, profile.baseMax - profile.baseMin + 1);
        const rawScore = profile.baseMin + Math.abs((seed + dIdx * 11 + qIdx * 13) % range) + dimVariance;
        const score = Math.max(1, Math.min(5, rawScore));
        const futureScore = Math.min(5, Math.max(score + 1, score + profile.targetOffset));

        sampleResponses[q.id] = score;
        sampleResponses[`${q.id}_current_state`] = score;
        sampleResponses[`${q.id}_future_state`] = futureScore;
        
        if (q.technicalPainPoints && q.technicalPainPoints.length > 0) {
          const tpIdx = (seed + qIdx + dIdx) % q.technicalPainPoints.length;
          const selectedTP = [q.technicalPainPoints[tpIdx]];
          if (profile.painPointIntensity > 1 && q.technicalPainPoints.length > 1) {
            selectedTP.push(q.technicalPainPoints[(tpIdx + 1) % q.technicalPainPoints.length]);
          }
          sampleResponses[`${q.id}_technical_pain`] = selectedTP;
          sampleResponses[`${q.id}_pain_points`] = selectedTP;
        }

        if (q.businessPainPoints && q.businessPainPoints.length > 0) {
          const bpIdx = (seed + qIdx * 2 + dIdx) % q.businessPainPoints.length;
          const selectedBP = [q.businessPainPoints[bpIdx]];
          if (profile.painPointIntensity > 1 && q.businessPainPoints.length > 1) {
            selectedBP.push(q.businessPainPoints[(bpIdx + 1) % q.businessPainPoints.length]);
          }
          sampleResponses[`${q.id}_business_pain`] = selectedBP;
        }

        const commentIdx = (seed + dIdx * 3 + qIdx) % sampleComments.length;
        sampleResponses[`${q.id}_comment`] = sampleComments[commentIdx];
      });
    });

    const sampleCustomers = [
      { name: 'Apex Health Systems', useCase: 'Clinical AI Assistant & Vertex AI Migration' },
      { name: 'Quantum FinTech Global', useCase: 'Zero Trust Multi-Cloud & FinOps Architecture' },
      { name: 'Nova Retail Group', useCase: 'Enterprise GenAI Customer Search & Multimodal Analytics' },
      { name: 'ConnectPlus Telecom', useCase: 'Cloud Network AI & Cost Optimization' }
    ];
    const pickedCust = sampleCustomers[Math.floor(Math.random() * sampleCustomers.length)];

    const calculated = dynamicEngine.calculateScores(sampleResponses, framework);

    const instance = await customAssessmentRepo.createInstance({
      typeKey: type.typeKey,
      customerName: pickedCust.name,
      useCase: pickedCust.useCase,
      contactEmail: 'lead.architect@enterprise.com',
      frameworkSnapshot: framework,
      responses: sampleResponses,
      scores: calculated.dimensionScores,
      totalScore: calculated.overallScore,
      maxScore: calculated.maxScore,
      maturityLevel: calculated.maturityLevel,
      status: 'in_progress'
    });

    res.json({
      success: true,
      message: 'Sample assessment instance generated successfully',
      instanceId: instance.id,
      instance,
      type
    });
  } catch (error) {
    console.error('Error creating sample assessment:', error);
    res.status(500).json({ success: false, error: 'Failed to create sample assessment' });
  }
});

// 4. Samples Suite List for "Try Sample" Navbar Popover
router.get('/samples-list', async (req, res) => {
  try {
    const customTypes = await customAssessmentRepo.getAllAssessmentTypes(false);
    
    const suite = [
      {
        id: 'sample_core_data_ai',
        category: 'core',
        title: 'Enterprise Data & AI Maturity Assessment',
        subtitle: 'Comprehensive 6-Pillar Lakehouse & ML Framework',
        customer: 'ConnectPlus Telecom',
        initiative: 'Unified Data Platform Modernization',
        badge: 'Core Platform',
        color: '#ff6b35',
        typeKey: 'core'
      },
      {
        id: 'sample_genai_readiness',
        category: 'genai',
        title: 'Generative AI Enterprise Readiness Assessment',
        subtitle: 'Governance, Infrastructure & Agentic AI Readiness',
        customer: 'Global Retail Cloud AI',
        initiative: 'Enterprise Customer Service GenAI Assistant',
        badge: 'Gen AI',
        color: '#3b82f6',
        typeKey: 'genai_readiness'
      },
      ...customTypes.map((t, idx) => {
        const customerList = [
          'Apex Financial Systems',
          'Nova Retail Group',
          'ConnectPlus Telecom',
          'Quantum Health & AI',
          'Global Logistics Cloud',
          'AeroSpace Dynamics'
        ];
        const assignedCustomer = customerList[idx % customerList.length];

        return {
          id: `sample_${t.typeKey}`,
          category: 'custom',
          title: t.title,
          subtitle: t.subtitle || (t.description ? t.description.substring(0, 70) + '...' : ''),
          customer: assignedCustomer,
          initiative: t.framework?.targetRole || t.subtitle || 'Enterprise Modernization',
          badge: t.badge || 'AI Framework',
          color: t.color || '#8b5cf6',
          typeKey: t.typeKey,
          status: t.status || (t.isPromoted ? 'production' : 'draft')
        };
      })
    ];

    res.json({
      success: true,
      samples: suite
    });
  } catch (error) {
    console.error('Error fetching samples list:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch samples list' });
  }
});

// 5. Dynamic Assessment Instances (CRUD)
router.post('/instances', async (req, res) => {
  try {
    const { customerName, useCase, contactEmail, typeKey, frameworkSnapshot, responses } = req.body;

    if (!customerName || !customerName.trim()) {
      return res.status(400).json({ success: false, error: 'Customer / Organization name is required' });
    }

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
    const { customerName, typeKey, useCase, search, status, limit, offset, page } = req.query;
    const parsedLimit = limit ? parseInt(limit, 10) : undefined;
    const parsedOffset = offset ? parseInt(offset, 10) : (page && parsedLimit ? (parseInt(page, 10) - 1) * parsedLimit : 0);

    const result = await customAssessmentRepo.getAllInstances({
      customerName,
      typeKey,
      useCase,
      search,
      status,
      limit: parsedLimit,
      offset: parsedOffset
    });

    if (Array.isArray(result)) {
      return res.json({
        success: true,
        instances: result,
        total: result.length
      });
    }

    res.json({
      success: true,
      instances: result.items || [],
      total: result.total,
      limit: result.limit,
      offset: result.offset,
      hasMore: result.hasMore
    });
  } catch (error) {
    console.error('Error fetching assessment instances:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch assessment instances' });
  }
});

router.get('/instances/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const instance = await customAssessmentRepo.getInstanceById(id);
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
    const { responses, status, customerName, useCase, contactEmail, expectedVersion } = req.body;

    const current = await customAssessmentRepo.getInstanceById(id);
    if (!current) {
      return res.status(404).json({ success: false, error: 'Assessment instance not found' });
    }

    // Optimistic Concurrency Control
    if (expectedVersion !== undefined && current.version !== undefined && current.version !== expectedVersion) {
      return res.status(409).json({
        success: false,
        conflict: true,
        message: 'Concurrent edit detected. Another architect or tab has updated this assessment.',
        currentVersion: current.version,
        serverInstance: current
      });
    }

    const updatedResponses = responses !== undefined ? responses : current.responses;
    const framework = current.frameworkSnapshot;
    const calculated = dynamicEngine.calculateScores(updatedResponses, framework);
    const nextVersion = (current.version || 1) + 1;

    const updated = await customAssessmentRepo.updateInstance(id, {
      responses: updatedResponses,
      scores: calculated.dimensionScores,
      totalScore: calculated.overallScore,
      maxScore: calculated.maxScore,
      maturityLevel: calculated.maturityLevel,
      status: status || current.status,
      customerName: customerName || current.customerName,
      useCase: useCase !== undefined ? useCase : current.useCase,
      contactEmail: contactEmail !== undefined ? contactEmail : current.contactEmail,
      version: nextVersion
    });

    res.json({
      success: true,
      instance: updated,
      scores: calculated,
      version: nextVersion
    });
  } catch (error) {
    console.error('Error updating assessment instance:', error);
    res.status(500).json({ success: false, error: 'Failed to update assessment instance' });
  }
});

router.delete('/instances/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await customAssessmentRepo.deleteInstance(id);
    res.json({ success: true, message: 'Assessment instance deleted successfully' });
  } catch (error) {
    console.error('Error deleting assessment instance:', error);
    res.status(500).json({ success: false, error: 'Failed to delete assessment instance' });
  }
});

// Batch Delete Assessment Instances
router.post('/instances/batch-delete', async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, error: 'Array of assessment IDs required' });
    }

    await Promise.all(ids.map(id => customAssessmentRepo.deleteInstance(id)));
    res.json({
      success: true,
      message: `Successfully deleted ${ids.length} assessment instance(s)`
    });
  } catch (error) {
    console.error('Error batch deleting instances:', error);
    res.status(500).json({ success: false, error: 'Failed to batch delete assessment instances' });
  }
});

// Batch Clone Assessment Instances
router.post('/instances/batch-clone', async (req, res) => {
  try {
    const { ids, suffix } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, error: 'Array of assessment IDs required' });
    }

    const cloned = await Promise.all(ids.map(async (id) => {
      const source = await customAssessmentRepo.getInstanceById(id);
      if (!source) return null;
      const newUseCase = source.useCase 
        ? `${source.useCase} (${suffix || 'Next Quarter'})` 
        : `Quarterly Reassessment (${suffix || 'Next Quarter'})`;

      return customAssessmentRepo.createInstance({
        typeKey: source.typeKey,
        customerName: source.customerName,
        useCase: newUseCase,
        contactEmail: source.contactEmail,
        frameworkSnapshot: source.frameworkSnapshot,
        responses: JSON.parse(JSON.stringify(source.responses || {})),
        scores: source.scores,
        totalScore: source.totalScore,
        maxScore: source.maxScore,
        maturityLevel: source.maturityLevel,
        status: 'in_progress'
      });
    }));

    res.json({
      success: true,
      message: `Successfully cloned ${cloned.filter(Boolean).length} assessment instance(s)`,
      cloned: cloned.filter(Boolean)
    });
  } catch (error) {
    console.error('Error batch cloning instances:', error);
    res.status(500).json({ success: false, error: 'Failed to batch clone assessment instances' });
  }
});

// Clone Assessment Instance (Quarterly Reassessment / Branching)
router.post('/instances/:id/clone', async (req, res) => {
  try {
    const { id } = req.params;
    const { suffix } = req.body;
    const source = await customAssessmentRepo.getInstanceById(id);
    if (!source) {
      return res.status(404).json({ success: false, error: 'Source assessment instance not found' });
    }

    const newUseCase = source.useCase 
      ? `${source.useCase} (${suffix || 'Next Quarter'})` 
      : `Quarterly Reassessment (${suffix || 'Next Quarter'})`;

    const clonedInstance = await customAssessmentRepo.createInstance({
      typeKey: source.typeKey,
      customerName: source.customerName,
      useCase: newUseCase,
      contactEmail: source.contactEmail,
      frameworkSnapshot: source.frameworkSnapshot,
      responses: JSON.parse(JSON.stringify(source.responses || {})),
      scores: source.scores,
      totalScore: source.totalScore,
      maxScore: source.maxScore,
      maturityLevel: source.maturityLevel,
      status: 'in_progress'
    });

    res.json({
      success: true,
      message: 'Assessment cloned successfully',
      instance: clonedInstance
    });
  } catch (error) {
    console.error('Error cloning assessment instance:', error);
    res.status(500).json({ success: false, error: 'Failed to clone assessment instance' });
  }
});

// 6. Executive AI Report Generation
router.post('/instances/:id/generate-report', async (req, res) => {
  try {
    const { id } = req.params;
    const instance = await customAssessmentRepo.getInstanceById(id);
    if (!instance) {
      return res.status(404).json({ success: false, error: 'Assessment instance not found' });
    }

    const calculated = dynamicEngine.calculateScores(instance.responses, instance.frameworkSnapshot);

    const aiReport = await dynamicEngine.generateExecutiveReport(
      instance.frameworkSnapshot,
      instance.responses,
      calculated,
      {
        customerName: instance.customerName,
        useCase: instance.useCase,
        industry: req.body.industry
      }
    );

    const updated = await customAssessmentRepo.updateInstance(id, {
      aiReport,
      scores: calculated.dimensionScores,
      totalScore: calculated.overallScore,
      maturityLevel: calculated.maturityLevel,
      status: 'completed'
    });

    res.json({
      success: true,
      aiReport,
      report: aiReport,
      instance: updated
    });
  } catch (error) {
    console.error('Error generating dynamic executive report:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate dynamic executive report'
    });
  }
});

// 7. Bespoke Architecture Diagrams Generation via Gemini 3.7 Flash
router.post('/instances/:id/generate-diagrams', async (req, res) => {
  try {
    const { id } = req.params;
    const { customInstructions } = req.body;

    const instance = await customAssessmentRepo.getInstanceById(id);
    if (!instance) {
      return res.status(404).json({ success: false, error: 'Assessment instance not found' });
    }

    const calculated = dynamicEngine.calculateScores(instance.responses, instance.frameworkSnapshot);

    const diagrams = await dynamicEngine.generateArchitectureDiagramsWithGemini(
      instance.frameworkSnapshot,
      instance.responses,
      calculated,
      {
        customerName: instance.customerName,
        useCase: instance.useCase,
        industry: req.body.industry
      },
      customInstructions
    );

    // Persist diagrams into instance report metadata
    const currentReport = instance.aiReport || {};
    currentReport.architectureDiagrams = diagrams;

    const updated = await customAssessmentRepo.updateInstance(id, {
      aiReport: currentReport
    });

    res.json({
      success: true,
      diagrams,
      instance: updated,
      message: 'Bespoke architecture diagrams generated with Gemini 3.7 Flash'
    });
  } catch (error) {
    console.error('Error generating bespoke architecture diagrams:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate architecture diagrams'
    });
  }
});

module.exports = router;
