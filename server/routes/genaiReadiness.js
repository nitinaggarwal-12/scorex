const express = require('express');
const router = express.Router();
const coreRouter = require('./genaiReadinessCore');
const genaiAssessmentRepo = require('../db/genaiAssessmentRepository');
const genAIFramework = require('../data/genai-readiness-framework');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

const isAdmin = (user) => user?.role === 'admin';

async function loadAssessment(id) {
  return await genaiAssessmentRepo.findById(id);
}

async function requireOwner(req, res, next) {
  try {
    const row = await loadAssessment(req.params.id);
    if (!row) return res.status(404).json({ error: 'Assessment not found' });
    const ownerId = row.owner_id || row.ownerId;
    if (!isAdmin(req.user) && String(ownerId || '') !== String(req.user.id)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    req.genaiAssessmentSecurity = row;
    return next();
  } catch (error) {
    console.error('[GenAIReadiness] Ownership validation failed:', error.message);
    return res.status(500).json({ error: 'Unable to validate assessment access' });
  }
}

router.get('/framework', (req, res) => res.json(genAIFramework));

// Create with a server-derived owner. Client-supplied owner fields are ignored.
router.post('/assessments', async (req, res) => {
  try {
    const customerName = String(req.body.customerName || req.body.customer_name || '').trim().slice(0, 200);
    if (!customerName) return res.status(400).json({ error: 'Customer name is required' });

    const responses = req.body.responses && typeof req.body.responses === 'object' ? req.body.responses : {};
    const scores = req.body.scores && typeof req.body.scores === 'object' ? req.body.scores : {};
    const totalScore = Number(req.body.totalScore ?? req.body.total_score ?? 0);
    const maxScore = Number(req.body.maxScore ?? req.body.max_score ?? 0);
    const maturityLevel = String(req.body.maturityLevel || req.body.maturity_level || '').slice(0, 100);
    const completedAt = req.body.completedAt || req.body.completed_at || null;

    const saved = await genaiAssessmentRepo.create({
      customerName,
      responses,
      scores,
      totalScore,
      maxScore,
      maturityLevel,
      completedAt,
      ownerId: req.user.id
    });

    return res.json({ id: saved.id, message: 'Assessment saved successfully' });
  } catch (error) {
    console.error('Error saving GenAI readiness assessment:', error.message);
    return res.status(500).json({ error: 'Failed to save assessment' });
  }
});

// Admin can inspect the full portfolio; every other role receives only its own rows.
router.get('/assessments', async (req, res) => {
  try {
    const results = await genaiAssessmentRepo.findAll(req.user.id, isAdmin(req.user));
    return res.json(results);
  } catch (error) {
    console.error('Error fetching GenAI readiness assessments:', error.message);
    return res.status(500).json({ error: 'Failed to fetch assessments' });
  }
});

// All concrete-resource operations (read/update/delete/export/import) require ownership unless admin.
router.use('/assessments/:id', requireOwner);

router.use(coreRouter);

module.exports = router;
