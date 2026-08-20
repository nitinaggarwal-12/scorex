const express = require('express');
const router = express.Router();
const coreRouter = require('./chatCore');
const db = require('../db/connection');
const assessmentRepository = require('../db/assessmentRepository');
const customAssessmentRepo = require('../db/customAssessmentRepository');
const { requireAuth, canAccessResource } = require('../middleware/auth');

router.use(requireAuth);

const chatBuckets = new Map();
function rateLimit(req, res, next) {
  const key = req.user?.id || req.ip || 'unknown';
  const maxRequests = req.user?.role === 'demo' ? 20 : 60;
  const windowMs = 60_000;
  const now = Date.now();
  const recent = (chatBuckets.get(key) || []).filter((ts) => now - ts < windowMs);

  if (recent.length >= maxRequests) {
    const retryAfter = Math.ceil((windowMs - (now - recent[0])) / 1000);
    res.setHeader('Retry-After', retryAfter);
    return res.status(429).json({ error: 'Chat rate limit exceeded', retryAfter });
  }

  recent.push(now);
  chatBuckets.set(key, recent);
  return next();
}

const isPrivileged = (user) => user?.role === 'admin' || user?.role === 'author';
const serverSessionId = (req) => req.auth?.sessionId || req.headers['x-session-id'];

async function assessmentAllowed(req, assessmentId) {
  if (!assessmentId) return true;
  if (isPrivileged(req.user)) return true;

  let assessment = await assessmentRepository.findById(assessmentId);
  if (!assessment) assessment = await customAssessmentRepo.getInstanceById(assessmentId);
  if (!assessment) return false;

  return canAccessResource(
    req.user,
    assessment,
    ['userId', 'user_id', 'createdBy', 'created_by', 'ownerId', 'owner_id']
  );
}

async function conversationBelongsToSession(req, conversationId) {
  if (!conversationId) return true;
  try {
    const result = await db.query(
      'SELECT id FROM chat_conversations WHERE id = $1 AND session_id = $2 LIMIT 1',
      [conversationId, serverSessionId(req)]
    );
    return result.rows.length > 0;
  } catch (error) {
    // When persistent chat storage is unavailable, the legacy core uses an in-memory UUID store.
    // Do not expose history for caller-supplied IDs because that store has no separate ACL index.
    return false;
  }
}

router.post('/conversation/start', rateLimit, async (req, res, next) => {
  const assessmentId = req.body?.assessmentId || null;
  if (!(await assessmentAllowed(req, assessmentId))) {
    return res.status(403).json({ error: 'Assessment context is not accessible to this session' });
  }

  req.body.userEmail = req.user.email;
  req.body.sessionId = serverSessionId(req);
  return next();
});

router.post('/message', rateLimit, async (req, res, next) => {
  const message = typeof req.body?.message === 'string' ? req.body.message.trim() : '';
  if (!message) return res.status(400).json({ error: 'Message is required' });
  if (message.length > 8_000) return res.status(413).json({ error: 'Message is too long' });

  const assessmentId = req.body?.context?.pageData?.assessmentId || req.body?.context?.assessmentId || null;
  if (!(await assessmentAllowed(req, assessmentId))) {
    return res.status(403).json({ error: 'Assessment context is not accessible to this session' });
  }

  if (req.body.conversationId) {
    const allowed = await conversationBelongsToSession(req, req.body.conversationId);
    if (!allowed) return res.status(403).json({ error: 'Conversation is not accessible to this session' });
  }

  req.body.message = message;
  req.body.userEmail = req.user.email;
  req.body.sessionId = serverSessionId(req);
  return next();
});

router.get('/conversation/:conversationId/messages', async (req, res, next) => {
  const allowed = await conversationBelongsToSession(req, req.params.conversationId);
  if (!allowed) return res.status(403).json({ error: 'Conversation is not accessible to this session' });
  return next();
});

router.get('/conversations', (req, res, next) => {
  req.query = {
    ...req.query,
    sessionId: serverSessionId(req)
  };
  delete req.query.userEmail;
  return next();
});

router.use(coreRouter);

module.exports = router;
