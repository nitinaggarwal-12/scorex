const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const { v4: uuidv4 } = require('uuid');

/**
 * GET /api/custom-questions
 * Get all custom questions (active only by default)
 */
router.get('/', async (req, res) => {
  try {
    const { includeInactive = 'false', pillar } = req.query;
    
    let query = 'SELECT * FROM custom_questions';
    const conditions = [];
    const params = [];
    
    if (includeInactive !== 'true') {
      conditions.push('is_active = true');
    }
    
    if (pillar) {
      params.push(pillar);
      conditions.push(`(pillar = $${params.length} OR pillar = 'all')`);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY created_at DESC';
    
    const result = await db.query(query, params);
    
    res.json({
      success: true,
      questions: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching custom questions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch custom questions',
      message: error.message
    });
  }
});

/**
 * GET /api/custom-questions/:id
 * Get a single custom question by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.query(
      'SELECT * FROM custom_questions WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Question not found'
      });
    }
    
    res.json({
      success: true,
      question: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching custom question:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch custom question',
      message: error.message
    });
  }
});

/**
 * POST /api/custom-questions
 * Create a new custom question
 */
router.post('/', async (req, res) => {
  try {
    const {
      question_text,
      pillar,
      category,
      weight = 1.0,
      maturity_level_1,
      maturity_level_2,
      maturity_level_3,
      maturity_level_4,
      maturity_level_5
    } = req.body;
    
    // Validate required fields
    if (!question_text || !pillar) {
      return res.status(400).json({
        success: false,
        error: 'Question text and pillar are required'
      });
    }
    
    // Validate weight
    if (weight < 0 || weight > 2) {
      return res.status(400).json({
        success: false,
        error: 'Weight must be between 0 and 2'
      });
    }
    
    // Get user ID from session (if available)
    const userId = req.headers['x-user-id'] || null;
    
    const result = await db.query(
      `INSERT INTO custom_questions (
        question_text, pillar, category, weight,
        maturity_level_1, maturity_level_2, maturity_level_3, maturity_level_4, maturity_level_5,
        created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        question_text, pillar, category, weight,
        maturity_level_1, maturity_level_2, maturity_level_3, maturity_level_4, maturity_level_5,
        userId
      ]
    );
    
    res.status(201).json({
      success: true,
      question: result.rows[0],
      message: 'Custom question created successfully'
    });
  } catch (error) {
    console.error('Error creating custom question:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create custom question',
      message: error.message
    });
  }
});

/**
 * PUT /api/custom-questions/:id
 * Update a custom question
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      question_text,
      pillar,
      category,
      weight,
      maturity_level_1,
      maturity_level_2,
      maturity_level_3,
      maturity_level_4,
      maturity_level_5,
      is_active
    } = req.body;
    
    // Build dynamic update query
    const updates = [];
    const params = [];
    let paramCount = 1;
    
    if (question_text !== undefined) {
      params.push(question_text);
      updates.push(`question_text = $${paramCount++}`);
    }
    if (pillar !== undefined) {
      params.push(pillar);
      updates.push(`pillar = $${paramCount++}`);
    }
    if (category !== undefined) {
      params.push(category);
      updates.push(`category = $${paramCount++}`);
    }
    if (weight !== undefined) {
      if (weight < 0 || weight > 2) {
        return res.status(400).json({
          success: false,
          error: 'Weight must be between 0 and 2'
        });
      }
      params.push(weight);
      updates.push(`weight = $${paramCount++}`);
    }
    if (maturity_level_1 !== undefined) {
      params.push(maturity_level_1);
      updates.push(`maturity_level_1 = $${paramCount++}`);
    }
    if (maturity_level_2 !== undefined) {
      params.push(maturity_level_2);
      updates.push(`maturity_level_2 = $${paramCount++}`);
    }
    if (maturity_level_3 !== undefined) {
      params.push(maturity_level_3);
      updates.push(`maturity_level_3 = $${paramCount++}`);
    }
    if (maturity_level_4 !== undefined) {
      params.push(maturity_level_4);
      updates.push(`maturity_level_4 = $${paramCount++}`);
    }
    if (maturity_level_5 !== undefined) {
      params.push(maturity_level_5);
      updates.push(`maturity_level_5 = $${paramCount++}`);
    }
    if (is_active !== undefined) {
      params.push(is_active);
      updates.push(`is_active = $${paramCount++}`);
    }
    
    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No fields to update'
      });
    }
    
    params.push(id);
    const query = `
      UPDATE custom_questions 
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;
    
    const result = await db.query(query, params);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Question not found'
      });
    }
    
    res.json({
      success: true,
      question: result.rows[0],
      message: 'Custom question updated successfully'
    });
  } catch (error) {
    console.error('Error updating custom question:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update custom question',
      message: error.message
    });
  }
});

/**
 * DELETE /api/custom-questions/:id
 * Soft delete (deactivate) a custom question
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { hard = 'false' } = req.query;
    
    let query, message;
    
    if (hard === 'true') {
      // Hard delete (permanent)
      query = 'DELETE FROM custom_questions WHERE id = $1 RETURNING id';
      message = 'Custom question permanently deleted';
    } else {
      // Soft delete (deactivate)
      query = 'UPDATE custom_questions SET is_active = false WHERE id = $1 RETURNING *';
      message = 'Custom question deactivated';
    }
    
    const result = await db.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Question not found'
      });
    }
    
    res.json({
      success: true,
      message,
      question: result.rows[0]
    });
  } catch (error) {
    console.error('Error deleting custom question:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete custom question',
      message: error.message
    });
  }
});

/**
 * GET /api/custom-questions/stats/summary
 * Get statistics about custom questions
 */
router.get('/stats/summary', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE is_active = true) as active,
        COUNT(*) FILTER (WHERE is_active = false) as inactive,
        COUNT(DISTINCT pillar) as unique_pillars
      FROM custom_questions
    `);
    
    res.json({
      success: true,
      stats: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching custom questions stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics',
      message: error.message
    });
  }
});

/**
 * POST /api/custom-questions/:questionId/assign
 * Assign a custom question to specific assessment(s)
 */
router.post('/:questionId/assign', async (req, res) => {
  try {
    const { questionId } = req.params;
    const { assessmentIds } = req.body; // Array of assessment IDs
    const userId = req.headers['x-user-id'] || null;
    
    if (!assessmentIds || !Array.isArray(assessmentIds) || assessmentIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Assessment IDs array is required'
      });
    }
    
    // Verify question exists
    const questionResult = await db.query(
      'SELECT id FROM custom_questions WHERE id = $1',
      [questionId]
    );
    
    if (questionResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Custom question not found'
      });
    }
    
    // Insert assignments (ignore duplicates)
    const assignments = [];
    for (const assessmentId of assessmentIds) {
      try {
        const result = await db.query(
          `INSERT INTO assessment_custom_questions (assessment_id, custom_question_id, assigned_by)
           VALUES ($1, $2, $3)
           ON CONFLICT (assessment_id, custom_question_id) DO NOTHING
           RETURNING *`,
          [assessmentId, questionId, userId]
        );
        if (result.rows.length > 0) {
          assignments.push(result.rows[0]);
        }
      } catch (err) {
        console.error(`Error assigning to assessment ${assessmentId}:`, err);
      }
    }
    
    res.json({
      success: true,
      message: `Question assigned to ${assignments.length} assessment(s)`,
      assignments
    });
  } catch (error) {
    console.error('Error assigning custom question:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to assign custom question',
      message: error.message
    });
  }
});

/**
 * DELETE /api/custom-questions/:questionId/assign/:assessmentId
 * Remove a custom question assignment from an assessment
 */
router.delete('/:questionId/assign/:assessmentId', async (req, res) => {
  try {
    const { questionId, assessmentId } = req.params;
    
    const result = await db.query(
      `DELETE FROM assessment_custom_questions 
       WHERE custom_question_id = $1 AND assessment_id = $2
       RETURNING *`,
      [questionId, assessmentId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Assignment not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Assignment removed successfully'
    });
  } catch (error) {
    console.error('Error removing assignment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to remove assignment',
      message: error.message
    });
  }
});

/**
 * GET /api/custom-questions/:questionId/assignments
 * Get all assessments that have this question assigned
 */
router.get('/:questionId/assignments', async (req, res) => {
  try {
    const { questionId } = req.params;
    
    const result = await db.query(
      `SELECT 
        acq.*,
        a.assessment_name,
        a.organization_name,
        a.status,
        a.progress
       FROM assessment_custom_questions acq
       JOIN assessments a ON acq.assessment_id = a.id
       WHERE acq.custom_question_id = $1
       ORDER BY acq.assigned_at DESC`,
      [questionId]
    );
    
    res.json({
      success: true,
      assignments: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch assignments',
      message: error.message
    });
  }
});

/**
 * GET /api/assessments/:assessmentId/custom-questions
 * Get all custom questions assigned to a specific assessment
 */
router.get('/assessments/:assessmentId/questions', async (req, res) => {
  try {
    const { assessmentId } = req.params;
    const { pillar } = req.query;
    
    let query = `
      SELECT 
        cq.*,
        acq.assigned_at,
        acq.assigned_by
      FROM custom_questions cq
      JOIN assessment_custom_questions acq ON cq.id = acq.custom_question_id
      WHERE acq.assessment_id = $1 AND cq.is_active = true
    `;
    
    const params = [assessmentId];
    
    if (pillar) {
      params.push(pillar);
      query += ` AND (cq.pillar = $${params.length} OR cq.pillar = 'all')`;
    }
    
    query += ' ORDER BY acq.assigned_at ASC';
    
    const result = await db.query(query, params);
    
    res.json({
      success: true,
      questions: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching assessment custom questions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch assessment custom questions',
      message: error.message
    });
  }
});

module.exports = router;

