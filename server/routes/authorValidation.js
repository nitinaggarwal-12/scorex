const express = require('express');
const router = express.Router();
const { requireAuth, requireAuthorOrAdmin } = require('../middleware/auth');
const pool = require('../db/connection');

// Get all consumer responses for an assessment (Author/Admin only)
router.get('/consumer-responses/:assessmentId', requireAuthorOrAdmin, async (req, res) => {
  const { assessmentId } = req.params;
  
  try {
    // Verify author has access to this assessment
    const assessmentCheck = await pool.query(
      `SELECT id, assigned_author_id, created_by 
       FROM assessments 
       WHERE id = $1`,
      [assessmentId]
    );
    
    if (assessmentCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Assessment not found' });
    }
    
    const assessment = assessmentCheck.rows[0];
    const isAuthor = assessment.assigned_author_id === req.user.id || assessment.created_by === req.user.id;
    const isAdmin = req.user.role === 'admin';
    
    if (!isAuthor && !isAdmin) {
      return res.status(403).json({ error: 'You do not have access to this assessment' });
    }
    
    // Get all question assignments and responses
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
        v.status as validator_first_name,
        v.last_name as validator_last_name
       FROM question_assignments qa
       LEFT JOIN users u ON qa.assigned_to = u.id
       LEFT JOIN users v ON qa.validated_by = v.id
       WHERE qa.assessment_id = $1
       ORDER BY qa.question_id, u.last_name`,
      [assessmentId]
    );
    
    res.json({
      assessmentId,
      responses: responsesQuery.rows
    });
  } catch (error) {
    console.error('Error fetching consumer responses:', error);
    res.status(500).json({ error: 'Failed to fetch consumer responses' });
  }
});

// Validate a response (Author/Admin only)
router.post('/validate-response', requireAuthorOrAdmin, async (req, res) => {
  const { assignmentId, status, comments } = req.body;
  
  if (!['approved', 'needs_review', 'clarification_requested'].includes(status)) {
    return res.status(400).json({ error: 'Invalid validation status' });
  }
  
  try {
    const result = await pool.query(
      `UPDATE question_assignments 
       SET validation_status = $1,
           validated_by = $2,
           validated_at = CURRENT_TIMESTAMP,
           validation_comments = $3
       WHERE id = $4
       RETURNING *`,
      [status, req.user.id, comments || null, assignmentId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    
    res.json({
      message: 'Response validated successfully',
      assignment: result.rows[0]
    });
  } catch (error) {
    console.error('Error validating response:', error);
    res.status(500).json({ error: 'Failed to validate response' });
  }
});

// Get validation status for an assessment
router.get('/validation-status/:assessmentId', requireAuthorOrAdmin, async (req, res) => {
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
    const readyForSubmission = 
      parseInt(stats.total_completed) === parseInt(stats.total_assignments) &&
      parseInt(stats.total_approved) === parseInt(stats.total_assignments) &&
      parseInt(stats.needs_review) === 0 &&
      parseInt(stats.clarification_requested) === 0;
    
    res.json({
      ...stats,
      readyForSubmission,
      completionPercentage: (parseInt(stats.total_completed) / parseInt(stats.total_assignments) * 100).toFixed(1),
      validationPercentage: (parseInt(stats.total_approved) / parseInt(stats.total_assignments) * 100).toFixed(1)
    });
  } catch (error) {
    console.error('Error fetching validation status:', error);
    res.status(500).json({ error: 'Failed to fetch validation status' });
  }
});

// Submit assessment (Author/Admin only)
router.post('/submit-assessment/:assessmentId', requireAuthorOrAdmin, async (req, res) => {
  const { assessmentId } = req.params;
  const { submissionNotes } = req.body;
  
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Check if assessment is ready for submission
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
    
    if (parseInt(stats.total_completed) !== parseInt(stats.total_assignments)) {
      await client.query('ROLLBACK');
      return res.status(400).json({ 
        error: 'Cannot submit: Not all questions are completed',
        stats
      });
    }
    
    if (parseInt(stats.total_approved) !== parseInt(stats.total_assignments)) {
      await client.query('ROLLBACK');
      return res.status(400).json({ 
        error: 'Cannot submit: Not all responses are validated',
        stats
      });
    }
    
    // Mark assessment as submitted and locked
    const submitResult = await client.query(
      `UPDATE assessments 
       SET submitted_by = $1,
           submitted_at = CURRENT_TIMESTAMP,
           is_locked = true,
           submission_notes = $2,
           status = 'submitted'
       WHERE id = $3
       RETURNING *`,
      [req.user.id, submissionNotes || null, assessmentId]
    );
    
    if (submitResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Assessment not found' });
    }
    
    await client.query('COMMIT');
    
    res.json({
      message: 'Assessment submitted successfully',
      assessment: submitResult.rows[0]
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error submitting assessment:', error);
    res.status(500).json({ error: 'Failed to submit assessment' });
  } finally {
    client.release();
  }
});

// Assign assessment to Author (Admin only)
router.post('/assign-to-author', requireAuth, async (req, res) => {
  const { assessmentId, authorId } = req.body;
  
  // Only admins can assign to authors
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Only admins can assign assessments to authors' });
  }
  
  try {
    const result = await pool.query(
      `UPDATE assessments 
       SET assigned_author_id = $1,
           author_assigned_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [authorId, assessmentId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Assessment not found' });
    }
    
    res.json({
      message: 'Assessment assigned to author successfully',
      assessment: result.rows[0]
    });
  } catch (error) {
    console.error('Error assigning to author:', error);
    res.status(500).json({ error: 'Failed to assign assessment to author' });
  }
});

// Get assessments assigned to current author
router.get('/my-author-assignments', requireAuthorOrAdmin, async (req, res) => {
  try {
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
       WHERE a.assigned_author_id = $1
       GROUP BY a.id, u.first_name, u.last_name
       ORDER BY a.author_assigned_at DESC`,
      [req.user.id]
    );
    
    res.json({
      assignments: result.rows
    });
  } catch (error) {
    console.error('Error fetching author assignments:', error);
    res.status(500).json({ error: 'Failed to fetch author assignments' });
  }
});

module.exports = router;

