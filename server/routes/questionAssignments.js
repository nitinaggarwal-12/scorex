const express = require('express');
const router = express.Router();
const coreRouter = require('./questionAssignmentsCore');
const db = require('../db/connection');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

const isPrivileged = (user) => user?.role === 'admin' || user?.role === 'author';

async function getAssignment(id) {
  const result = await db.query('SELECT * FROM question_assignments WHERE id = $1', [id]);
  return result.rows[0] || null;
}

function authorOwns(user, row) {
  if (user.role === 'admin') return true;
  return user.role === 'author' &&
    row?.assigned_by_email &&
    String(row.assigned_by_email).toLowerCase() === String(user.email).toLowerCase();
}

function assigneeOwns(user, row) {
  return row?.assigned_to_email &&
    String(row.assigned_to_email).toLowerCase() === String(user.email).toLowerCase();
}

async function authorizeAssignment(req, res, next, mode = 'participant-or-author') {
  try {
    const row = await getAssignment(req.params.id);
    if (!row) return res.status(404).json({ error: 'Question assignment not found' });

    const allowed = mode === 'author'
      ? authorOwns(req.user, row)
      : authorOwns(req.user, row) || assigneeOwns(req.user, row);

    if (!allowed) return res.status(403).json({ error: 'Access denied' });
    req.questionAssignment = row;
    return next();
  } catch (error) {
    console.error('[QuestionAssignments] Authorization failed:', error.message);
    return res.status(500).json({ error: 'Unable to validate assignment access' });
  }
}

// Portfolio list: admin sees all; authors see only assignments they created.
router.get('/', async (req, res, next) => {
  if (req.user.role === 'admin') return next();
  if (req.user.role !== 'author') return res.status(403).json({ error: 'Author or admin access required' });

  try {
    const result = await db.query(`
      SELECT qa.*, a.organization_name, a.industry
      FROM question_assignments qa
      LEFT JOIN assessments a ON qa.assessment_id = a.id
      WHERE LOWER(qa.assigned_by_email) = LOWER($1)
      ORDER BY qa.created_at DESC
    `, [req.user.email]);
    return res.json(result.rows);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch question assignments' });
  }
});

// Never trust an email query parameter to select another user's work.
router.get('/my-assignments', (req, res, next) => {
  req.query.email = req.user.email;
  return next();
});

// Assessment-level visibility is role scoped: admin all, author own delegations, participant own work.
router.get('/assessment/:assessmentId', async (req, res, next) => {
  if (req.user.role === 'admin') return next();

  try {
    const isAuthor = req.user.role === 'author';
    const emailColumn = isAuthor ? 'assigned_by_email' : 'assigned_to_email';
    const result = await db.query(
      `SELECT * FROM question_assignments
       WHERE assessment_id = $1 AND LOWER(${emailColumn}) = LOWER($2)
       ORDER BY pillar, question_id`,
      [req.params.assessmentId, req.user.email]
    );
    return res.json(result.rows);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch assessment question assignments' });
  }
});

// Only authors/admins create delegated work, and the server is authoritative for who assigned it.
router.post('/', (req, res, next) => {
  if (!isPrivileged(req.user)) return res.status(403).json({ error: 'Author or admin access required' });
  req.body.assigned_by_email = req.user.email;
  return next();
});

router.put('/:id', (req, res, next) => authorizeAssignment(req, res, next));
router.post('/:id/follow-up', async (req, res, next) => {
  const row = await getAssignment(req.params.id).catch(() => null);
  if (!row) return res.status(404).json({ error: 'Question assignment not found' });
  if (!authorOwns(req.user, row) && !assigneeOwns(req.user, row)) return res.status(403).json({ error: 'Access denied' });
  req.body.from_email = req.user.email;
  return next();
});
router.put('/:id/follow-up/:followUpIndex', (req, res, next) => authorizeAssignment(req, res, next));

router.post('/:id/approve', async (req, res, next) => {
  const row = await getAssignment(req.params.id).catch(() => null);
  if (!row) return res.status(404).json({ error: 'Question assignment not found' });
  if (!authorOwns(req.user, row)) return res.status(403).json({ error: 'Access denied' });
  req.body.approved_by_email = req.user.email;
  return next();
});
router.post('/:id/reject', async (req, res, next) => {
  const row = await getAssignment(req.params.id).catch(() => null);
  if (!row) return res.status(404).json({ error: 'Question assignment not found' });
  if (!authorOwns(req.user, row)) return res.status(403).json({ error: 'Access denied' });
  req.body.approved_by_email = req.user.email;
  return next();
});
router.post('/:id/remind', (req, res, next) => authorizeAssignment(req, res, next, 'author'));
router.delete('/:id', (req, res, next) => authorizeAssignment(req, res, next, 'author'));

router.get('/stats/summary', async (req, res, next) => {
  if (req.user.role === 'admin') return next();
  if (req.user.role !== 'author') return res.status(403).json({ error: 'Author or admin access required' });

  try {
    const result = await db.query(`
      SELECT
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'pending') as pending,
        COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress,
        COUNT(*) FILTER (WHERE status = 'completed') as completed,
        COUNT(*) FILTER (WHERE status = 'approved') as approved,
        COUNT(*) FILTER (WHERE status = 'rejected') as rejected
      FROM question_assignments
      WHERE LOWER(assigned_by_email) = LOWER($1)
    `, [req.user.email]);
    return res.json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

router.use(coreRouter);

module.exports = router;
