const express = require('express');
const router = express.Router();
const coreRouter = require('./genaiReadinessCore');
const db = require('../db/connection');
const genAIFramework = require('../data/genai-readiness-framework');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

let ownerColumnReady = false;
async function ensureOwnerColumn() {
  if (ownerColumnReady) return;
  await db.query('ALTER TABLE genai_assessments ADD COLUMN IF NOT EXISTS owner_id TEXT');
  await db.query('CREATE INDEX IF NOT EXISTS idx_genai_assessments_owner_id ON genai_assessments(owner_id)');
  ownerColumnReady = true;
}

const isPrivileged = (user) => user?.role === 'admin' || user?.role === 'author';

async function loadAssessment(id) {
  await ensureOwnerColumn();
  const result = await db.query('SELECT id, owner_id FROM genai_assessments WHERE id = $1', [id]);
  return result.rows[0] || null;
}

async function requireOwner(req, res, next) {
  try {
    const row = await loadAssessment(req.params.id);
    if (!row) return res.status(404).json({ error: 'Assessment not found' });
    if (!isPrivileged(req.user) && String(row.owner_id || '') !== String(req.user.id)) {
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
    await ensureOwnerColumn();
    const customerName = String(req.body.customerName || '').trim().slice(0, 200);
    if (!customerName) return res.status(400).json({ error: 'Customer name is required' });

    const responses = req.body.responses && typeof req.body.responses === 'object' ? req.body.responses : {};
    const scores = req.body.scores && typeof req.body.scores === 'object' ? req.body.scores : {};
    const totalScore = Number(req.body.totalScore || 0);
    const maxScore = Number(req.body.maxScore || 0);
    const maturityLevel = String(req.body.maturityLevel || '').slice(0, 100);
    const completedAt = req.body.completedAt || null;

    const result = await db.query(
      `INSERT INTO genai_assessments
       (customer_name, responses, scores, total_score, max_score, maturity_level, completed_at, created_at, owner_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), $8)
       RETURNING id`,
      [customerName, JSON.stringify(responses), JSON.stringify(scores), totalScore, maxScore,
        maturityLevel, completedAt, req.user.id]
    );

    return res.json({ id: result.rows[0].id, message: 'Assessment saved successfully' });
  } catch (error) {
    console.error('Error saving GenAI readiness assessment:', error.message);
    return res.status(500).json({ error: 'Failed to save assessment' });
  }
});

// Portfolio listing is owner-scoped for demo/consumer identities.
router.get('/assessments', async (req, res) => {
  try {
    await ensureOwnerColumn();
    const params = [];
    let where = '';
    if (!isPrivileged(req.user)) {
      params.push(req.user.id);
      where = 'WHERE owner_id = $1';
    }

    const result = await db.query(
      `SELECT id, customer_name, total_score, max_score, maturity_level, completed_at, created_at
       FROM genai_assessments
       ${where}
       ORDER BY created_at DESC`,
      params
    );

    return res.json(result.rows.map(row => ({
      id: row.id,
      customerName: row.customer_name,
      totalScore: row.total_score,
      maxScore: row.max_score,
      maturityLevel: row.maturity_level,
      completedAt: row.completed_at,
      createdAt: row.created_at
    })));
  } catch (error) {
    console.error('Error fetching GenAI readiness assessments:', error.message);
    return res.status(500).json({ error: 'Failed to fetch assessments' });
  }
});

// All concrete-resource operations (read/update/delete/export/import) require ownership.
router.use('/assessments/:id', requireOwner);

router.use(coreRouter);

module.exports = router;
