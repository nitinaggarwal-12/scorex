const express = require('express');
const router = express.Router();
const coreRouter = require('./dynamicAssessmentsCore');
const customAssessmentRepo = require('../db/customAssessmentRepository');
const dynamicEngine = require('../services/dynamicAssessmentEngine');
const { requireAuth, canAccessResource } = require('../middleware/auth');

/**
 * Security facade for the dynamic assessment subsystem.
 *
 * The legacy/core router intentionally remains feature-focused. This facade establishes
 * authorization invariants before a request can reach it:
 * - every request has an authenticated user or isolated demo session;
 * - demo/consumer users cannot mutate the shared template catalog;
 * - demo-generated frameworks are ephemeral and never auto-published;
 * - demo/consumer assessment instances are owned by their session/user identity;
 * - instance-level reads and writes enforce resource ownership server-side.
 */
router.use(requireAuth);

const aiBuckets = new Map();
function demoAiRateLimit(maxRequests = 8, windowMs = 60_000) {
  return (req, res, next) => {
    const key = req.user?.id || req.ip || 'unknown';
    const now = Date.now();
    const recent = (aiBuckets.get(key) || []).filter((ts) => now - ts < windowMs);
    if (recent.length >= maxRequests) {
      const retryAfter = Math.ceil((windowMs - (now - recent[0])) / 1000);
      res.setHeader('Retry-After', retryAfter);
      return res.status(429).json({
        success: false,
        error: 'AI generation rate limit exceeded',
        retryAfter
      });
    }
    recent.push(now);
    aiBuckets.set(key, recent);
    return next();
  };
}

const isPrivileged = (user) => user?.role === 'admin' || user?.role === 'author';
const isLimitedUser = (user) => user?.role === 'demo' || user?.role === 'consumer';

function sanitizeInstance(instance) {
  if (!instance) return instance;
  const copy = { ...instance };
  copy.isPasscodeProtected = Boolean(copy.sharePasscode);
  delete copy.sharePasscode;
  return copy;
}

function userOwnsInstance(user, instance) {
  if (isPrivileged(user)) return true;
  return canAccessResource(user, instance, ['createdBy', 'created_by', 'ownerId', 'owner_id', 'userId', 'user_id']);
}

// Demo/consumer framework generation is intentionally ephemeral: no shared catalog write.
router.post('/generate-framework', demoAiRateLimit(), async (req, res, next) => {
  if (!isLimitedUser(req.user)) return next();

  try {
    const { prompt, industry, targetAudience, focusAreas, tier } = req.body;
    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ success: false, error: 'Prompt is required' });
    }
    if (prompt.length > 8_000) {
      return res.status(413).json({ success: false, error: 'Prompt is too long' });
    }

    const framework = await dynamicEngine.generateFrameworkFromPrompt(prompt.trim(), {
      industry,
      targetAudience,
      focusAreas,
      tier
    });

    return res.json({
      success: true,
      framework,
      type: null,
      ephemeral: true,
      message: 'Demo framework generated in an isolated session. Sign in as an author to save it to the shared catalog.'
    });
  } catch (error) {
    console.error('[DynamicSecurity] Demo framework generation failed:', error.message);
    return res.status(500).json({ success: false, error: 'Failed to generate assessment framework' });
  }
});

// Shared template catalog mutations are never available to demo/consumer roles.
router.use('/types', (req, res, next) => {
  const isRead = req.method === 'GET';
  const isDemoSample = req.method === 'POST' && /^\/[^/]+\/sample$/.test(req.path);

  if (isRead || isDemoSample) return next();
  if (!isPrivileged(req.user)) {
    return res.status(403).json({ success: false, error: 'Author or admin access required' });
  }
  return next();
});

// Create isolated one-click sample instances for demo/consumer users.
router.post('/types/:typeKey/sample', async (req, res, next) => {
  if (!isLimitedUser(req.user)) return next();

  try {
    const { typeKey } = req.params;
    const type = await customAssessmentRepo.findAssessmentTypeByKey(typeKey);
    if (!type?.framework) {
      return res.status(404).json({ success: false, error: 'Assessment framework not found' });
    }

    const framework = type.framework;
    const responses = {};
    const seed = Date.now();

    (framework.dimensions || []).forEach((dimension, dimensionIndex) => {
      (dimension.questions || []).forEach((question, questionIndex) => {
        const score = 2 + ((seed + dimensionIndex * 7 + questionIndex * 11) % 3); // 2..4
        const target = Math.min(5, score + 1);
        responses[question.id] = score;
        responses[`${question.id}_current_state`] = score;
        responses[`${question.id}_future_state`] = target;

        if (Array.isArray(question.technicalPainPoints) && question.technicalPainPoints.length) {
          responses[`${question.id}_technical_pain`] = [question.technicalPainPoints[0]];
          responses[`${question.id}_pain_points`] = [question.technicalPainPoints[0]];
        }
        if (Array.isArray(question.businessPainPoints) && question.businessPainPoints.length) {
          responses[`${question.id}_business_pain`] = [question.businessPainPoints[0]];
        }
        responses[`${question.id}_comment`] = 'Demo evidence generated for an isolated ScoreX workspace.';
      });
    });

    const calculated = dynamicEngine.calculateScores(responses, framework);
    const instance = await customAssessmentRepo.createInstance({
      typeKey: type.typeKey,
      customerName: 'ScoreX Demo Organization',
      useCase: framework.title || 'Enterprise Transformation Assessment',
      contactEmail: '',
      frameworkSnapshot: framework,
      responses,
      scores: calculated.dimensionScores,
      totalScore: calculated.overallScore,
      maxScore: calculated.maxScore,
      maturityLevel: calculated.maturityLevel,
      status: 'in_progress',
      createdBy: req.user.id
    });

    return res.json({
      success: true,
      message: 'Isolated demo assessment created successfully',
      instanceId: instance.id,
      instance: sanitizeInstance(instance),
      type
    });
  } catch (error) {
    console.error('[DynamicSecurity] Demo sample creation failed:', error.message);
    return res.status(500).json({ success: false, error: 'Failed to create demo assessment' });
  }
});

// Always create new instances with a server-derived owner. Never trust createdBy from the client.
router.post('/instances', async (req, res) => {
  try {
    const { customerName, useCase, contactEmail, typeKey, frameworkSnapshot, responses } = req.body;

    if (!customerName || !String(customerName).trim()) {
      return res.status(400).json({ success: false, error: 'Customer / Organization name is required' });
    }

    let framework = frameworkSnapshot;
    if (!framework && typeKey) {
      const type = await customAssessmentRepo.findAssessmentTypeByKey(typeKey);
      if (type) framework = type.framework;
    }

    if (!framework?.dimensions) {
      return res.status(400).json({ success: false, error: 'Assessment framework is required' });
    }

    const calculated = dynamicEngine.calculateScores(responses || {}, framework);
    const instance = await customAssessmentRepo.createInstance({
      typeKey: typeKey || framework.typeKey || 'custom',
      customerName: String(customerName).trim().slice(0, 200),
      useCase: String(useCase || '').slice(0, 1_000),
      contactEmail: String(contactEmail || '').slice(0, 320),
      frameworkSnapshot: framework,
      responses: responses || {},
      scores: calculated.dimensionScores,
      totalScore: calculated.overallScore,
      maxScore: calculated.maxScore,
      maturityLevel: calculated.maturityLevel,
      status: 'in_progress',
      createdBy: req.user.id
    });

    return res.json({ success: true, instance: sanitizeInstance(instance) });
  } catch (error) {
    console.error('[DynamicSecurity] Instance creation failed:', error.message);
    return res.status(500).json({ success: false, error: 'Failed to create assessment instance' });
  }
});

// Limited users can enumerate only their own instances. Authors/admins retain portfolio views.
router.get('/instances', async (req, res, next) => {
  if (isPrivileged(req.user)) return next();

  try {
    const result = await customAssessmentRepo.getAllInstances({});
    const all = Array.isArray(result) ? result : (result.items || []);
    const owned = all.filter((instance) => userOwnsInstance(req.user, instance));

    return res.json({
      success: true,
      instances: owned.map(sanitizeInstance),
      total: owned.length,
      limit: owned.length,
      offset: 0,
      hasMore: false
    });
  } catch (error) {
    console.error('[DynamicSecurity] Instance listing failed:', error.message);
    return res.status(500).json({ success: false, error: 'Failed to fetch assessment instances' });
  }
});

// Batch portfolio mutation is an author/admin capability only.
router.use('/instances/batch-delete', (req, res, next) => {
  if (!isPrivileged(req.user)) {
    return res.status(403).json({ success: false, error: 'Author or admin access required' });
  }
  return next();
});
router.use('/instances/batch-clone', (req, res, next) => {
  if (!isPrivileged(req.user)) {
    return res.status(403).json({ success: false, error: 'Author or admin access required' });
  }
  return next();
});

// Enforce ownership for every concrete instance read/write/generation route.
router.use('/instances/:id', async (req, res, next) => {
  const { id } = req.params;

  // Reserved collection actions are handled by the explicit guards above.
  if (id === 'batch-delete' || id === 'batch-clone') return next();

  try {
    const instance = await customAssessmentRepo.getInstanceById(id);
    if (!instance) {
      return res.status(404).json({ success: false, error: 'Assessment instance not found' });
    }

    if (!userOwnsInstance(req.user, instance)) {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }

    req.dynamicAssessmentInstance = instance;
    return next();
  } catch (error) {
    console.error('[DynamicSecurity] Ownership check failed:', error.message);
    return res.status(500).json({ success: false, error: 'Unable to validate assessment access' });
  }
});

// Prevent limited roles from invoking unknown global mutation endpoints that could change shared state.
router.use((req, res, next) => {
  if (!isLimitedUser(req.user) || ['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  const allowedOwnedInstanceMutation = /^\/instances\/[^/]+(?:\/(?:diagrams|generate-report|generate-diagrams|share|unshare|regenerate-report))?$/.test(req.path);
  if (allowedOwnedInstanceMutation && ['POST', 'PUT', 'PATCH'].includes(req.method)) {
    return next();
  }

  // /generate-framework, /types/:key/sample and /instances were already handled above.
  return res.status(403).json({
    success: false,
    error: 'This operation is not available in the isolated demo workspace'
  });
});

// Delegate the feature implementation only after security invariants have been established.
router.use(coreRouter);

module.exports = router;
