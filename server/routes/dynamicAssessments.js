const express = require('express');
const router = express.Router();
const coreRouter = require('./dynamicAssessmentsCore');
const customAssessmentRepo = require('../db/customAssessmentRepository');
const dynamicEngine = require('../services/dynamicAssessmentEngine');
const provenance = require('../services/provenanceService');
const { requireAuth, canAccessResource } = require('../middleware/auth');

/**
 * Security facade for the dynamic assessment subsystem.
 *
 * Shared authoring capabilities are distinct from instance data access:
 * - admin: global instance access + catalog administration;
 * - author: catalog authoring + only instances they own/create;
 * - consumer/demo: only their own isolated instances, with demo-safe mutations.
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

const isAdmin = (user) => user?.role === 'admin';
const canAuthorCatalog = (user) => user?.role === 'admin' || user?.role === 'author';
const isLimitedUser = (user) => user?.role === 'demo' || user?.role === 'consumer';

function sanitizeInstance(instance) {
  if (!instance) return instance;
  const copy = { ...instance };
  copy.isPasscodeProtected = Boolean(copy.sharePasscode);
  delete copy.sharePasscode;
  return copy;
}

function userOwnsInstance(user, instance) {
  if (isAdmin(user)) return true;
  return canAccessResource(user, instance, ['createdBy', 'created_by', 'ownerId', 'owner_id', 'userId', 'user_id']);
}

function average(values = []) {
  const valid = values.map((value) => Number(value)).filter(Number.isFinite);
  if (!valid.length) return null;
  return provenance.round(valid.reduce((sum, value) => sum + value, 0) / valid.length, 2);
}

function buildDimensionPositioning(instance) {
  const framework = instance.frameworkSnapshot || {};
  const responses = instance.responses || {};
  const scores = instance.scores || {};

  return (framework.dimensions || []).map((dimension) => {
    const scoreRecord = scores[dimension.id];
    const currentScore = provenance.asFiniteNumber(
      typeof scoreRecord === 'object' ? (scoreRecord.score ?? scoreRecord.currentScore) : scoreRecord
    );
    const targetScore = average(
      (dimension.questions || []).map((question) => responses[`${question.id}_future_state`])
    );
    const gapToTarget = currentScore !== null && targetScore !== null
      ? provenance.round(targetScore - currentScore, 2)
      : null;

    let status = 'Target not supplied';
    if (gapToTarget !== null) {
      if (gapToTarget <= 0) status = 'At or above stated target';
      else if (gapToTarget <= 0.5) status = 'Near stated target';
      else if (gapToTarget <= 1.25) status = 'Moderate target gap';
      else status = 'Priority target gap';
    }

    return {
      dimensionId: dimension.id,
      dimension: dimension.name || dimension.id,
      currentScore,
      targetScore,
      gapToTarget,
      status,
      industryMedian: null,
      industryAverage: null,
      topQuartile: null,
      top10: null,
      percentileRank: null,
      deltaVsMedian: null,
      provenance: {
        currentScore: provenance.assessmentClaim(currentScore, 'Current dimension maturity score'),
        targetScore: targetScore === null
          ? provenance.unverifiedClaim('Target dimension maturity score', 'Target not supplied')
          : provenance.assessmentClaim(targetScore, 'Average stated future-state score'),
        peerStatistics: provenance.unverifiedClaim('External peer benchmark')
      }
    };
  });
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

// Shared template catalog mutations are author/admin capabilities.
router.use('/types', (req, res, next) => {
  const isRead = req.method === 'GET';
  const isDemoSample = req.method === 'POST' && /^\/[^/]+\/sample$/.test(req.path);

  if (isRead || isDemoSample) return next();
  if (!canAuthorCatalog(req.user)) {
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
        const score = 2 + ((seed + dimensionIndex * 7 + questionIndex * 11) % 3);
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

// Admin may enumerate all; every other role sees only its own instances.
router.get('/instances', async (req, res, next) => {
  if (isAdmin(req.user)) return next();

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

// Global batch portfolio mutations are admin-only until per-ID ownership is implemented end-to-end.
router.use('/instances/batch-delete', (req, res, next) => {
  if (!isAdmin(req.user)) {
    return res.status(403).json({ success: false, error: 'Admin access required for batch deletion' });
  }
  return next();
});
router.use('/instances/batch-clone', (req, res, next) => {
  if (!isAdmin(req.user)) {
    return res.status(403).json({ success: false, error: 'Admin access required for batch cloning' });
  }
  return next();
});

// Enforce ownership for every concrete instance read/write/generation route.
router.use('/instances/:id', async (req, res, next) => {
  const { id } = req.params;

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

// Evidence-first replacement for the legacy synthetic peer benchmark route.
router.get('/instances/:id/benchmarks', (req, res) => {
  const instance = req.dynamicAssessmentInstance;
  const dimensions = buildDimensionPositioning(instance);
  const currentScores = dimensions.map((dimension) => dimension.currentScore).filter(Number.isFinite);
  const targetScores = dimensions.map((dimension) => dimension.targetScore).filter(Number.isFinite);
  const overallCurrent = currentScores.length ? average(currentScores) : provenance.asFiniteNumber(instance.totalScore);
  const overallTarget = targetScores.length ? average(targetScores) : null;
  const gapToTarget = overallCurrent !== null && overallTarget !== null
    ? provenance.round(overallTarget - overallCurrent, 2)
    : null;

  return res.json({
    success: true,
    reportType: 'assessment-positioning',
    industry: req.query.industry || instance.frameworkSnapshot?.industry || 'Industry not specified',
    percentile: null,
    competitiveTier: 'Assessment-only view',
    targetBench: null,
    overallCurrent,
    overallTarget,
    gapToTarget,
    dimensionBenchmarks: dimensions,
    methodology: {
      mode: 'assessment-relative',
      dataSource: 'ScoreX assessment responses and scoring framework',
      externalBenchmarkDataset: null,
      sampleSize: null,
      confidenceLevel: null,
      disclaimer: provenance.EXTERNAL_DATA_DISCLAIMER,
      claimPolicy: 'provenance-v1'
    },
    provenance: {
      policy: 'provenance-v1',
      overallCurrent: provenance.assessmentClaim(overallCurrent, 'Assessment maturity score'),
      overallTarget: overallTarget === null
        ? provenance.unverifiedClaim('Stated target maturity score', 'Target not supplied')
        : provenance.assessmentClaim(overallTarget, 'Average stated target maturity score'),
      peerStatistics: provenance.unverifiedClaim('External peer benchmark')
    }
  });
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

  return res.status(403).json({
    success: false,
    error: 'This operation is not available in the isolated demo workspace'
  });
});

router.use(coreRouter);

module.exports = router;
