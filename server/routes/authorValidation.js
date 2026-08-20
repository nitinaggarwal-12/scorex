const express = require('express');
const router = express.Router();
const { requireAuthorOrAdmin, requireAdmin } = require('../middleware/auth');
const pool = require('../db/connection');

router.use(requireAuthorOrAdmin);

async function authorCanAccessAssessment(user, assessmentId) {
  if (user.role === 'admin') return true;

  const result = await pool.query(
    `SELECT a.id
     FROM assessments a
     WHERE a.id = $1
       AND (
         a.assigned_author_id::text = $2
         OR a.created_by::text = $2
         OR EXISTS (
           SELECT 1 FROM question_assignments qa
           WHERE qa.assessment_id = a.id
             AND LOWER(qa.assigned_by_email) = LOWER($3)
         )
       )
     LIMIT 1`,
    [assessmentId, String(user.id), user.email]
  );
  return result.rows.length > 0;
}

async function requireAssessmentAccess(req, res, next) {
  const assessmentId = req.params.assessmentId;
  try {
    const allowed = await authorCanAccessAssessment(req.user, assessmentId);
    if (!allowed) return res.status(403).json({ error: 'You do not have access to this assessment' });
    return next();
  } catch (error) {
    console.error('Author assessment authorization failed:', error.message);
    return res.status(500).json({ error: 'Unable to validate assessment access' });
  }
}

router.get('/consumer-responses/:assessmentId', requireAssessmentAccess, async (req, res) => {
  const { assessmentId } = req.params;
  try {
    const responsesQuery = await pool.query(
      `SELECT
        qa.id as assignment_id,
        qa.question_id,
        qa.assigned_to as consumer_id,
        qa.status as assignment_status,
        qa.response_text,
        qa.response_value,
        qa.completed_at,
        qa.validation_status,
        qa.validated_by,
        qa.validated_at,
        qa.validation_comments,
        u.first_name as consumer_first_name,
        u.last_name as consumer_last_name,
        u.email as consumer_email,
        v.first_name as validator_first_name,
        v.last_name as validator_last_name
       FROM question_assignments qa
       LEFT JOIN users u ON qa.assigned_to = u.id
       LEFT JOIN users v ON qa.validated_by = v.id
       WHERE qa.assessment_id = $1
       ORDER BY qa.question_id, u.last_name`,
      [assessmentId]
    );

    return res.json({ assessmentId, responses: responsesQuery.rows });
  } catch (error) {
    console.error('Error fetching consumer responses:', error.message);
    return res.status(500).json({ error: 'Failed to fetch consumer responses' });
  }
});

router.post('/validate-response', async (req, res) => {
  const { assignmentId, status } = req.body;
  const comments = String(req.body.comments || '').slice(0, 4_000) || null;

  if (!assignmentId || !['approved', 'needs_review', 'clarification_requested'].includes(status)) {
    return res.status(400).json({ error: 'Valid assignmentId and validation status are required' });
  }

  try {
    const access = await pool.query(
      `SELECT qa.assessment_id
       FROM question_assignments qa
       WHERE qa.id = $1`,
      [assignmentId]
    );
    if (access.rows.length === 0) return res.status(404).json({ error: 'Assignment not found' });

    if (!(await authorCanAccessAssessment(req.user, access.rows[0].assessment_id))) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const result = await pool.query(
      `UPDATE question_assignments
       SET validation_status = $1,
           validated_by = $2,
           validated_at = CURRENT_TIMESTAMP,
           validation_comments = $3
       WHERE id = $4
       RETURNING *`,
      [status, req.user.id, comments, assignmentId]
    );

    return res.json({ message: 'Response validated successfully', assignment: result.rows[0] });
  } catch (error) {
    console.error('Error validating response:', error.message);
    return res.status(500).json({ error: 'Failed to validate response' });
  }
});

router.get('/validation-status/:assessmentId', requireAssessmentAccess, async (req, res) => {
  const { assessmentId } = req.params;
  try {
    const statusQuery = await pool.query(
      `SELECT
        COUNT(*) FILTER (WHERE status = 'completed') as total_completed,
        COUNT(*) FILTER (WHERE validation_status = 'approved') as total_approved,
        COUNT(*) FILTER (WHERE validation_status = 'needs_review') as needs_review,
        COUNT(*) FILTER (WHERE validation_status = 'clarification_requested') as clarification_requested,
        COUNT(*) FILTER (WHERE validation_status = 'not_validated') as not_validated,
        COUNT(*) as total_assignments
       FROM question_assignments
       WHERE assessment_id = $1`,
      [assessmentId]
    );

    const stats = statusQuery.rows[0];
    const total = parseInt(stats.total_assignments, 10) || 0;
    const completed = parseInt(stats.total_completed, 10) || 0;
    const approved = parseInt(stats.total_approved, 10) || 0;
    const readyForSubmission = total > 0 && completed === total && approved === total &&
      parseInt(stats.needs_review, 10) === 0 && parseInt(stats.clarification_requested, 10) === 0;

    return res.json({
      ...stats,
      readyForSubmission,
      completionPercentage: total ? ((completed / total) * 100).toFixed(1) : '0.0',
      validationPercentage: total ? ((approved / total) * 100).toFixed(1) : '0.0'
    });
  } catch (error) {
    console.error('Error fetching validation status:', error.message);
    return res.status(500).json({ error: 'Failed to fetch validation status' });
  }
});

router.post('/submit-assessment/:assessmentId', requireAssessmentAccess, async (req, res) => {
  const { assessmentId } = req.params;
  const submissionNotes = String(req.body.submissionNotes || '').slice(0, 4_000) || null;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const statusCheck = await client.query(
      `SELECT
        COUNT(*) FILTER (WHERE status = 'completed') as total_completed,
        COUNT(*) FILTER (WHERE validation_status = 'approved') as total_approved,
        COUNT(*) as total_assignments
       FROM question_assignments
       WHERE assessment_id = $1`,
      [assessmentId]
    );

    const stats = statusCheck.rows[0];
    const total = parseInt(stats.total_assignments, 10) || 0;
    if (total === 0 || parseInt(stats.total_completed, 10) !== total) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Cannot submit: Not all questions are completed', stats });
    }
    if (parseInt(stats.total_approved, 10) !== total) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Cannot submit: Not all responses are validated', stats });
    }

    const submitResult = await client.query(
      `UPDATE assessments
       SET submitted_by = $1,
           submitted_at = CURRENT_TIMESTAMP,
           is_locked = true,
           submission_notes = $2,
           status = 'submitted'
       WHERE id = $3
       RETURNING *`,
      [req.user.id, submissionNotes, assessmentId]
    );

    if (submitResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Assessment not found' });
    }

    await client.query('COMMIT');
    return res.json({ message: 'Assessment submitted successfully', assessment: submitResult.rows[0] });
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('Error submitting assessment:', error.message);
    return res.status(500).json({ error: 'Failed to submit assessment' });
  } finally {
    client.release();
  }
});

router.post('/assign-to-author', requireAdmin, async (req, res) => {
  const { assessmentId, authorId } = req.body;
  if (!assessmentId || !authorId) return res.status(400).json({ error: 'assessmentId and authorId are required' });

  try {
    const authorCheck = await pool.query(
      `SELECT id FROM users WHERE id = $1 AND role = 'author' AND is_active = true`,
      [authorId]
    );
    if (authorCheck.rows.length === 0) return res.status(400).json({ error: 'Active author not found' });

    const result = await pool.query(
      `UPDATE assessments
       SET assigned_author_id = $1,
           author_assigned_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [authorId, assessmentId]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Assessment not found' });

    return res.json({ message: 'Assessment assigned to author successfully', assessment: result.rows[0] });
  } catch (error) {
    console.error('Error assigning to author:', error.message);
    return res.status(500).json({ error: 'Failed to assign assessment to author' });
  }
});

router.get('/my-author-assignments', async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      const result = await pool.query(
        `SELECT a.*, u.first_name as assigned_by_first_name, u.last_name as assigned_by_last_name
         FROM assessments a
         LEFT JOIN users u ON a.created_by = u.id
         ORDER BY a.author_assigned_at DESC NULLS LAST, a.updated_at DESC`
      );
      return res.json({ assignments: result.rows });
    }

    const result = await pool.query(
      `SELECT
        a.*,
        u.first_name as assigned_by_first_name,
        u.last_name as assigned_by_last_name,
        COUNT(DISTINCT qa.id) FILTER (WHERE qa.status = 'completed') as completed_questions,
        COUNT(DISTINCT qa.id) as total_questions,
        COUNT(DISTINCT qa.id) FILTER (WHERE qa.validation_status = 'approved') as approved_questions
       FROM assessments a
       LEFT JOIN users u ON a.created_by = u.id
       LEFT JOIN question_assignments qa ON a.id = qa.assessment_id
       WHERE a.assigned_author_id::text = $1
       GROUP BY a.id, u.first_name, u.last_name
       ORDER BY a.author_assigned_at DESC`,
      [String(req.user.id)]
    );

    return res.json({ assignments: result.rows });
  } catch (error) {
    console.error('Error fetching author assignments:', error.message);
    return res.status(500).json({ error: 'Failed to fetch author assignments' });
  }
});

module.exports = router;
