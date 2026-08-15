const express = require('express');
const router = express.Router();
const db = require('../db/connection');

/**
 * GET /api/question-edits/:assessmentId
 * Get all question edits for a specific assessment
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
    
    res.json({
      success: true,
      edits: result.rows
    });
  } catch (error) {
    console.error('❌ Error fetching question edits:', error);
    res.status(500).json({ error: 'Failed to fetch question edits' });
  }
});

/**
 * POST /api/question-edits/:assessmentId/:questionId
 * Save or update an edited question
 */
router.post('/:assessmentId/:questionId', async (req, res) => {
  try {
    const { assessmentId, questionId } = req.params;
    const { questionText, perspectives, editedBy } = req.body;
    
    console.log(`📝 Saving question edit for ${questionId} in assessment ${assessmentId}`);
    
    // Get original question text from framework
    const framework = require('../data/assessmentFramework');
    let originalQuestionText = '';
    
    framework.assessmentAreas.forEach(area => {
      area.dimensions.forEach(dimension => {
        dimension.questions.forEach(question => {
          if (question.id === questionId) {
            originalQuestionText = question.question;
          }
        });
      });
    });
    
    // Upsert question edit
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
      [assessmentId, questionId, originalQuestionText, questionText, JSON.stringify(perspectives), editedBy]
    );
    
    console.log(`✅ Question edit saved successfully`);
    
    res.json({
      success: true,
      message: 'Question edited successfully',
      edit: result.rows[0]
    });
  } catch (error) {
    console.error('❌ Error saving question edit:', error);
    res.status(500).json({ error: 'Failed to save question edit' });
  }
});

/**
 * DELETE /api/question-edits/:assessmentId/:questionId
 * Delete a question edit (revert to original)
 */
router.delete('/:assessmentId/:questionId', async (req, res) => {
  try {
    const { assessmentId, questionId } = req.params;
    
    console.log(`🗑️  Deleting question edit for ${questionId} in assessment ${assessmentId}`);
    
    await db.query(
      'DELETE FROM question_edits WHERE assessment_id = $1 AND question_id = $2',
      [assessmentId, questionId]
    );
    
    console.log(`✅ Question edit deleted successfully`);
    
    res.json({
      success: true,
      message: 'Question edit deleted (reverted to original)'
    });
  } catch (error) {
    console.error('❌ Error deleting question edit:', error);
    res.status(500).json({ error: 'Failed to delete question edit' });
  }
});

/**
 * POST /api/question-edits/:assessmentId/:questionId/delete
 * Delete a question entirely and mark for report regeneration
 */
router.post('/:assessmentId/:questionId/delete', async (req, res) => {
  try {
    const { assessmentId, questionId } = req.params;
    const { deletedBy } = req.body;
    
    console.log(`🗑️  Deleting question ${questionId} from assessment ${assessmentId}`);
    
    // Get question details from framework
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
    
    // Record the deletion
    await db.query(
      `INSERT INTO deleted_questions 
        (assessment_id, question_id, question_text, pillar, dimension, deleted_by, regeneration_status)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending')`,
      [assessmentId, questionId, questionText, pillar, dimension, deletedBy]
    );
    
    // Delete any responses for this question
    await db.query(
      `UPDATE assessments 
       SET responses = responses - $1
       WHERE id = $2`,
      [questionId, assessmentId]
    );
    
    // Delete any edits for this question
    await db.query(
      'DELETE FROM question_edits WHERE assessment_id = $1 AND question_id = $2',
      [assessmentId, questionId]
    );
    
    console.log(`✅ Question deleted successfully, marked for regeneration`);
    
    // TODO: Trigger report regeneration in background
    // For now, we'll regenerate on next report request
    
    res.json({
      success: true,
      message: 'Question deleted successfully. Reports will be regenerated.',
      deletedQuestion: {
        questionId,
        questionText,
        pillar,
        dimension
      }
    });
  } catch (error) {
    console.error('❌ Error deleting question:', error);
    res.status(500).json({ error: 'Failed to delete question' });
  }
});

/**
 * GET /api/question-edits/:assessmentId/deleted
 * Get all deleted questions for an assessment
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
    
    res.json({
      success: true,
      deletedQuestions: result.rows
    });
  } catch (error) {
    console.error('❌ Error fetching deleted questions:', error);
    res.status(500).json({ error: 'Failed to fetch deleted questions' });
  }
});

module.exports = router;

