const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const customAssessmentRepo = require('../db/customAssessmentRepository');
const dynamicEngine = require('../services/dynamicAssessmentEngine');
const notificationService = require('../services/notificationService');

/**
 * Dynamic Assessment Routes
 * Powered by Google Gemini (gemini-3.7-flash)
 */

// In-Memory Sliding-Window Rate Limiter for Gemini AI Endpoints
const aiRateLimitStore = new Map(); // ip -> Array of timestamps

const aiRateLimiter = (maxRequests = 15, windowMs = 60000) => {
  return (req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown-ip';
    const now = Date.now();
    const timestamps = (aiRateLimitStore.get(ip) || []).filter(ts => now - ts < windowMs);

    if (timestamps.length >= maxRequests) {
      const oldest = timestamps[0];
      const retryAfterSec = Math.ceil((windowMs - (now - oldest)) / 1000);
      res.setHeader('Retry-After', retryAfterSec);
      return res.status(429).json({
        success: false,
        error: `AI generation rate limit exceeded. Please retry in ${retryAfterSec} second(s).`,
        retryAfter: retryAfterSec
      });
    }

    timestamps.push(now);
    aiRateLimitStore.set(ip, timestamps);
    next();
  };
};

// 1. AI-generate assessment framework from natural language prompt and AUTO-PERSIST as template
router.post('/generate-framework', aiRateLimiter(15, 60000), async (req, res) => {
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
router.post('/instances/:id/generate-report', aiRateLimiter(15, 60000), async (req, res) => {
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

    // Asynchronously dispatch completion webhook without delaying API response
    notificationService.dispatchAssessmentCompletionWebhook(instance, calculated, aiReport).catch(err => {
      console.warn('Webhook dispatch failed:', err.message);
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
router.post('/instances/:id/generate-diagrams', aiRateLimiter(15, 60000), async (req, res) => {
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

// 8. Generate Secure Shareable Read-Only Public Link Token
router.post('/instances/:id/share-link', async (req, res) => {
  try {
    const { id } = req.params;
    const instance = await customAssessmentRepo.getInstanceById(id);
    if (!instance) {
      return res.status(404).json({ success: false, error: 'Assessment instance not found' });
    }

    let shareToken = instance.shareToken;
    if (!shareToken) {
      shareToken = crypto.randomBytes(16).toString('hex');
      await customAssessmentRepo.updateInstance(id, { shareToken });
    }

    res.json({
      success: true,
      shareToken,
      shareUrl: `/assessments/public-report/${shareToken}`
    });
  } catch (error) {
    console.error('Error generating share link:', error);
    res.status(500).json({ success: false, error: 'Failed to generate share link' });
  }
});

// 9. Public Read-Only Report Access via Token (No login required)
router.get('/public/report/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const allInstances = await customAssessmentRepo.getAllInstances();
    const instance = allInstances.find(i => i.shareToken === token);
    if (!instance) {
      return res.status(404).json({ success: false, error: 'Public assessment report not found or link has expired' });
    }

    const calculated = dynamicEngine.calculateScores(instance.responses, instance.frameworkSnapshot);

    res.json({
      success: true,
      instance,
      report: instance.aiReport || {
        executiveSummary: 'Assessment completed. Review detailed scores and roadmap below.',
        prioritizedRecommendations: []
      },
      calculatedScores: calculated,
      scores: calculated,
      framework: instance.frameworkSnapshot
    });
  } catch (error) {
    console.error('Error fetching public report:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch public report' });
  }
});

// 10. Fork Assessment Template into Custom Variant
router.post('/types/:id/fork', async (req, res) => {
  try {
    const { id } = req.params;
    const { newTitle } = req.body;
    const original = await customAssessmentRepo.getAssessmentTypeById(id);
    if (!original) {
      return res.status(404).json({ success: false, error: 'Original assessment template not found' });
    }

    const newTypeKey = `${original.typeKey}_variant_${Date.now().toString(36)}`;
    const title = newTitle || `${original.title} (Custom Variant)`;

    const forkedType = await customAssessmentRepo.saveAssessmentType({
      typeKey: newTypeKey,
      title,
      subtitle: original.subtitle || '',
      description: original.description || '',
      icon: original.icon || 'FiAward',
      badge: original.badge || 'Custom Variant',
      color: original.color || '#6366f1',
      framework: {
        ...original.framework,
        typeKey: newTypeKey,
        title
      },
      status: 'draft',
      isPublished: true,
      isPromoted: false,
      createdBy: req.body.createdBy || 'catalog-fork'
    });

    res.json({
      success: true,
      type: forkedType,
      message: `Template successfully forked as "${title}"`
    });
  } catch (error) {
    console.error('Error forking assessment type:', error);
    res.status(500).json({ success: false, error: 'Failed to fork assessment type' });
  }
});

// 11. Side-by-Side Assessment Comparison & Progress Delta Engine
router.get('/compare', async (req, res) => {
  try {
    const { baseId, targetId } = req.query;
    if (!baseId || !targetId) {
      return res.status(400).json({ success: false, error: 'Both baseId and targetId query parameters are required' });
    }

    const [baseInstance, targetInstance] = await Promise.all([
      customAssessmentRepo.getInstanceById(baseId),
      customAssessmentRepo.getInstanceById(targetId)
    ]);

    if (!baseInstance || !targetInstance) {
      return res.status(404).json({ success: false, error: 'One or both assessment instances could not be found' });
    }

    const baseCalculated = dynamicEngine.calculateScores(baseInstance.responses, baseInstance.frameworkSnapshot);
    const targetCalculated = dynamicEngine.calculateScores(targetInstance.responses, targetInstance.frameworkSnapshot);

    const overallDelta = Number((targetCalculated.overallScore - baseCalculated.overallScore).toFixed(2));

    const dimensions = targetInstance.frameworkSnapshot?.dimensions || baseInstance.frameworkSnapshot?.dimensions || [];
    const dimensionDeltas = dimensions.map(dim => {
      const bScore = baseCalculated.dimensionScores?.[dim.id]?.score || 0;
      const tScore = targetCalculated.dimensionScores?.[dim.id]?.score || 0;
      const delta = Number((tScore - bScore).toFixed(2));
      return {
        id: dim.id,
        name: dim.name,
        baseScore: bScore,
        targetScore: tScore,
        delta,
        status: delta > 0 ? 'improved' : delta < 0 ? 'regressed' : 'unchanged'
      };
    });

    res.json({
      success: true,
      base: {
        instance: baseInstance,
        scores: baseCalculated
      },
      target: {
        instance: targetInstance,
        scores: targetCalculated
      },
      comparison: {
        overallDelta,
        dimensionDeltas,
        isPositiveGrowth: overallDelta >= 0
      }
    });
  } catch (error) {
    console.error('Error comparing assessments:', error);
    res.status(500).json({ success: false, error: 'Failed to compare assessments' });
  }
});

// 12. AI Dimension Question Suggestion Assistant for Custom Builder
router.post('/suggest-questions', aiRateLimiter(15, 60000), async (req, res) => {
  try {
    const { dimensionName, dimensionDescription, industry, targetRole } = req.body;
    if (!dimensionName) {
      return res.status(400).json({ success: false, error: 'Dimension name is required' });
    }

    const prompt = `You are a Principal Enterprise Cloud & AI Architect.
Generate 3 high-impact, audit-grade evaluation questions for an assessment framework dimension:
Dimension Name: "${dimensionName}"
Dimension Description: "${dimensionDescription || 'Evaluate technical maturity and operational posture.'}"
Target Industry: "${industry || 'Cross-Industry Enterprise'}"
Target Role: "${targetRole || 'Enterprise Architects, Tech Leads'}"

For each question, return JSON conforming strictly to:
{
  "questions": [
    {
      "id": "q_suggested_1",
      "text": "Clear, direct architectural question text?",
      "guidance": "Explicit guidance on what artifacts, metrics, and processes to evaluate.",
      "options": [
        { "value": 1, "score": 1, "label": "Stage 1 Explore definition..." },
        { "value": 2, "score": 2, "label": "Stage 2 Experiment definition..." },
        { "value": 3, "score": 3, "label": "Stage 3 Formalize definition..." },
        { "value": 4, "score": 4, "label": "Stage 4 Optimize definition..." },
        { "value": 5, "score": 5, "label": "Stage 5 Transform definition..." }
      ],
      "technicalPainPoints": [
        "Technical bottleneck 1",
        "Technical bottleneck 2",
        "Technical bottleneck 3"
      ],
      "businessPainPoints": [
        "Business/financial risk 1",
        "Business/financial risk 2"
      ]
    }
  ]
}
Return valid JSON only.`;

    const response = await dynamicEngine.geminiService.generateJSON(prompt);
    res.json({
      success: true,
      questions: response.questions || []
    });
  } catch (error) {
    console.error('Error suggesting questions:', error);
    res.status(500).json({ success: false, error: 'Failed to suggest questions with AI' });
  }
});

// 13. Customer Multi-Assessment Portfolio Executive Rollup
router.get('/customer/:customerName/portfolio-rollup', async (req, res) => {
  try {
    const { customerName } = req.params;
    const allInstances = await customAssessmentRepo.getAllInstances();
    const customerInstances = allInstances.filter(
      i => (i.customerName || '').toLowerCase() === customerName.toLowerCase()
    );

    if (customerInstances.length === 0) {
      return res.json({
        success: true,
        customerName,
        totalAssessments: 0,
        averageMaturity: 0,
        portfolioRollup: []
      });
    }

    let totalScoreSum = 0;
    let completedCount = 0;
    const portfolio = customerInstances.map(inst => {
      const calculated = dynamicEngine.calculateScores(inst.responses, inst.frameworkSnapshot);
      if (inst.status === 'completed') {
        completedCount++;
        totalScoreSum += calculated.overallScore;
      }
      return {
        id: inst.id,
        title: inst.frameworkSnapshot?.title || inst.useCase || 'Assessment',
        customerName: inst.customerName,
        useCase: inst.useCase,
        status: inst.status,
        overallScore: calculated.overallScore,
        maturityLevel: calculated.maturityLevel,
        dimensionScores: calculated.dimensionScores,
        updatedAt: inst.updatedAt || inst.createdAt
      };
    });

    const averageMaturity = completedCount > 0 
      ? Number((totalScoreSum / completedCount).toFixed(2)) 
      : 0;

    res.json({
      success: true,
      customerName,
      totalAssessments: customerInstances.length,
      completedAssessments: completedCount,
      averageMaturity,
      portfolio
    });
  } catch (error) {
    console.error('Error computing portfolio rollup:', error);
    res.status(500).json({ success: false, error: 'Failed to compute portfolio rollup' });
  }
});

module.exports = router;
