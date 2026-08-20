const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const assignmentRepository = require('../db/assignmentRepository');
const { requireAuthorOrAdmin } = require('../middleware/auth');

router.use(requireAuthorOrAdmin);

async function requireAssessmentAuthor(req, res, next) {
  if (req.user.role === 'admin') return next();

  try {
    const assignment = await assignmentRepository.getAssignmentByAssessmentId(req.params.assessmentId);
    if (!assignment || String(assignment.author_id) !== String(req.user.id)) {
      return res.status(403).json({ error: 'Only the assigned author or an admin may edit assessment questions' });
    }
    req.assignment = assignment;
    return next();
  } catch (error) {
    console.error('Question edit authorization failed:', error.message);
    return res.status(500).json({ error: 'Unable to validate assessment access' });
  }
}

router.use('/:assessmentId', requireAssessmentAuthor);

/**
 * GET /api/question-edits/:assessmentId
 */
router.get('/:assessmentId', async (req, res) => {
  try {
    const { assessmentId } = req.params;
    const result = await db.query(
      `SELECT * FROM question_edits
       WHERE assessment_id = $1
       ORDER BY updated_at DESC`,
      [assessmentId]
    );
    return res.json({ success: true, edits: result.rows });
  } catch (error) {
    console.error('Error fetching question edits:', error.message);
    return res.status(500).json({ error: 'Failed to fetch question edits' });
  }
});

/**
 * POST /api/question-edits/:assessmentId/:questionId
 */
router.post('/:assessmentId/:questionId', async (req, res) => {
  try {
    const { assessmentId, questionId } = req.params;
    const questionText = typeof req.body.questionText === 'string' ? req.body.questionText.trim().slice(0, 4_000) : '';
    const perspectives = req.body.perspectives;

    if (!questionText) {
      return res.status(400).json({ error: 'Question text is required' });
    }

    const framework = require('../data/assessmentFramework');
    let originalQuestionText = '';
    framework.assessmentAreas.forEach(area => {
      area.dimensions.forEach(dimension => {
        dimension.questions.forEach(question => {
          if (question.id === questionId) originalQuestionText = question.question;
        });
      });
    });

    const result = await db.query(
      `INSERT INTO question_edits
        (assessment_id, question_id, original_question_text, edited_question_text, edited_perspectives, edited_by, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
       ON CONFLICT (assessment_id, question_id)
       DO UPDATE SET
         edited_question_text = $4,
         edited_perspectives = $5,
         edited_by = $6,
         updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [assessmentId, questionId, originalQuestionText, questionText, JSON.stringify(perspectives || []), req.user.id]
    );

    return res.json({ success: true, message: 'Question edited successfully', edit: result.rows[0] });
  } catch (error) {
    console.error('Error saving question edit:', error.message);
    return res.status(500).json({ error: 'Failed to save question edit' });
  }
});

/**
 * DELETE /api/question-edits/:assessmentId/:questionId
 */
router.delete('/:assessmentId/:questionId', async (req, res) => {
  try {
    const { assessmentId, questionId } = req.params;
    await db.query(
      'DELETE FROM question_edits WHERE assessment_id = $1 AND question_id = $2',
      [assessmentId, questionId]
    );
    return res.json({ success: true, message: 'Question edit deleted (reverted to original)' });
  } catch (error) {
    console.error('Error deleting question edit:', error.message);
    return res.status(500).json({ error: 'Failed to delete question edit' });
  }
});

/**
 * POST /api/question-edits/:assessmentId/:questionId/delete
 */
router.post('/:assessmentId/:questionId/delete', async (req, res) => {
  const { assessmentId, questionId } = req.params;
  const client = await db.connect?.() || null;
  const queryTarget = client || db;

  try {
    if (client) await client.query('BEGIN');

    const framework = require('../data/assessmentFramework');
    let questionText = '';
    let pillar = '';
    let dimension = '';

    framework.assessmentAreas.forEach(area => {
      area.dimensions.forEach(dim => {
        dim.questions.forEach(question => {
          if (question.id === questionId) {
            questionText = question.question;
            pillar = area.name;
            dimension = dim.name;
          }
        });
      });
    });

    await queryTarget.query(
      `INSERT INTO deleted_questions
        (assessment_id, question_id, question_text, pillar, dimension, deleted_by, regeneration_status)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending')`,
      [assessmentId, questionId, questionText, pillar, dimension, req.user.id]
    );

    // Remove every response key associated with this question, not only a bare question ID.
    await queryTarget.query(
      `UPDATE assessments
       SET responses = COALESCE((
         SELECT jsonb_object_agg(key, value)
         FROM jsonb_each(COALESCE(responses, '{}'::jsonb))
         WHERE key <> $1 AND key NOT LIKE $2
       ), '{}'::jsonb)
       WHERE id = $3`,
      [questionId, `${questionId}_%`, assessmentId]
    );

    await queryTarget.query(
      'DELETE FROM question_edits WHERE assessment_id = $1 AND question_id = $2',
      [assessmentId, questionId]
    );

    if (client) await client.query('COMMIT');
    return res.json({
      success: true,
      message: 'Question deleted successfully. Reports will be regenerated.',
      deletedQuestion: { questionId, questionText, pillar, dimension }
    });
  } catch (error) {
    if (client) await client.query('ROLLBACK').catch(() => {});
    console.error('Error deleting question:', error.message);
    return res.status(500).json({ error: 'Failed to delete question' });
  } finally {
    if (client?.release) client.release();
  }
});

/**
 * GET /api/question-edits/:assessmentId/deleted
 */
router.get('/:assessmentId/deleted', async (req, res) => {
  try {
    const { assessmentId } = req.params;
    const result = await db.query(
      `SELECT * FROM deleted_questions
       WHERE assessment_id = $1
       ORDER BY deleted_at DESC`,
      [assessmentId]
    );
    return res.json({ success: true, deletedQuestions: result.rows });
  } catch (error) {
    console.error('Error fetching deleted questions:', error.message);
    return res.status(500).json({ error: 'Failed to fetch deleted questions' });
  }
});

module.exports = router;
