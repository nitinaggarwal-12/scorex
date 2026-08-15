const express = require('express');
const router = express.Router();
const pool = require('../db/connection');

// Get all question assignments (admin view)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        qa.*,
        a.organization_name,
        a.industry
      FROM question_assignments qa
      LEFT JOIN assessments a ON qa.assessment_id = a.id
      ORDER BY qa.created_at DESC
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching question assignments:', error);
    res.status(500).json({ error: 'Failed to fetch question assignments' });
  }
});

// Get question assignments for a specific user
router.get('/my-assignments', async (req, res) => {
  try {
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    const result = await pool.query(`
      SELECT 
        qa.*,
        a.organization_name,
        a.industry
      FROM question_assignments qa
      LEFT JOIN assessments a ON qa.assessment_id = a.id
      WHERE qa.assigned_to_email = $1
      ORDER BY qa.created_at DESC
    `, [email]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching user assignments:', error);
    res.status(500).json({ error: 'Failed to fetch user assignments' });
  }
});

// Get question assignments for a specific assessment
router.get('/assessment/:assessmentId', async (req, res) => {
  try {
    const { assessmentId } = req.params;
    
    const result = await pool.query(`
      SELECT * FROM question_assignments
      WHERE assessment_id = $1
      ORDER BY pillar, question_id
    `, [assessmentId]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching assessment question assignments:', error);
    res.status(500).json({ error: 'Failed to fetch assessment question assignments' });
  }
});

// Create a new question assignment
router.post('/', async (req, res) => {
  try {
    const {
      assessment_id,
      question_id,
      pillar,
      assigned_to_email,
      assigned_by_email
    } = req.body;
    
    if (!assessment_id || !question_id || !pillar || !assigned_to_email || !assigned_by_email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Check if assignment already exists
    const existingAssignment = await pool.query(`
      SELECT id FROM question_assignments
      WHERE assessment_id = $1 AND question_id = $2 AND assigned_to_email = $3
    `, [assessment_id, question_id, assigned_to_email]);
    
    if (existingAssignment.rows.length > 0) {
      return res.status(400).json({ error: 'Question already assigned to this user' });
    }
    
    const result = await pool.query(`
      INSERT INTO question_assignments (
        assessment_id,
        question_id,
        pillar,
        assigned_to_email,
        assigned_by_email,
        status
      ) VALUES ($1, $2, $3, $4, $5, 'pending')
      RETURNING *
    `, [assessment_id, question_id, pillar, assigned_to_email, assigned_by_email]);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating question assignment:', error);
    res.status(500).json({ error: 'Failed to create question assignment' });
  }
});

// Update question assignment (status, response data)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      status,
      current_state,
      future_state,
      technical_pain_points,
      business_pain_points,
      notes
    } = req.body;
    
    let updateFields = [];
    let values = [];
    let paramIndex = 1;
    
    if (status) {
      updateFields.push(`status = $${paramIndex++}`);
      values.push(status);
      
      // Set timestamps based on status
      if (status === 'in_progress' && !updateFields.includes('started_at')) {
        updateFields.push(`started_at = NOW()`);
      } else if (status === 'completed') {
        updateFields.push(`completed_at = NOW()`);
      }
    }
    
    if (current_state !== undefined) {
      updateFields.push(`current_state = $${paramIndex++}`);
      values.push(current_state);
    }
    
    if (future_state !== undefined) {
      updateFields.push(`future_state = $${paramIndex++}`);
      values.push(future_state);
    }
    
    if (technical_pain_points) {
      updateFields.push(`technical_pain_points = $${paramIndex++}`);
      values.push(technical_pain_points);
    }
    
    if (business_pain_points) {
      updateFields.push(`business_pain_points = $${paramIndex++}`);
      values.push(business_pain_points);
    }
    
    if (notes !== undefined) {
      updateFields.push(`notes = $${paramIndex++}`);
      values.push(notes);
    }
    
    updateFields.push('updated_at = NOW()');
    values.push(id);
    
    const query = `
      UPDATE question_assignments
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;
    
    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Question assignment not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating question assignment:', error);
    res.status(500).json({ error: 'Failed to update question assignment' });
  }
});

// Add follow-up question
router.post('/:id/follow-up', async (req, res) => {
  try {
    const { id } = req.params;
    const { from_email, question } = req.body;
    
    if (!from_email || !question) {
      return res.status(400).json({ error: 'From email and question are required' });
    }
    
    const followUp = {
      from: from_email,
      question: question,
      answer: null,
      timestamp: new Date().toISOString()
    };
    
    const result = await pool.query(`
      UPDATE question_assignments
      SET 
        follow_up_questions = COALESCE(follow_up_questions, '[]'::jsonb) || $1::jsonb,
        updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `, [JSON.stringify(followUp), id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Question assignment not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error adding follow-up question:', error);
    res.status(500).json({ error: 'Failed to add follow-up question' });
  }
});

// Answer follow-up question
router.put('/:id/follow-up/:followUpIndex', async (req, res) => {
  try {
    const { id, followUpIndex } = req.params;
    const { answer } = req.body;
    
    if (!answer) {
      return res.status(400).json({ error: 'Answer is required' });
    }
    
    // Get current follow-up questions
    const current = await pool.query(
      'SELECT follow_up_questions FROM question_assignments WHERE id = $1',
      [id]
    );
    
    if (current.rows.length === 0) {
      return res.status(404).json({ error: 'Question assignment not found' });
    }
    
    let followUps = current.rows[0].follow_up_questions || [];
    const index = parseInt(followUpIndex);
    
    if (index < 0 || index >= followUps.length) {
      return res.status(400).json({ error: 'Invalid follow-up question index' });
    }
    
    followUps[index].answer = answer;
    followUps[index].answered_at = new Date().toISOString();
    
    const result = await pool.query(`
      UPDATE question_assignments
      SET 
        follow_up_questions = $1::jsonb,
        updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `, [JSON.stringify(followUps), id]);
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error answering follow-up question:', error);
    res.status(500).json({ error: 'Failed to answer follow-up question' });
  }
});

// Approve question assignment
router.post('/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const { approved_by_email } = req.body;
    
    if (!approved_by_email) {
      return res.status(400).json({ error: 'Approver email is required' });
    }
    
    const result = await pool.query(`
      UPDATE question_assignments
      SET 
        status = 'approved',
        approved_at = NOW(),
        approved_by_email = $1,
        updated_at = NOW()
      WHERE id = $2 AND status = 'completed'
      RETURNING *
    `, [approved_by_email, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Question assignment not found or not completed' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error approving question assignment:', error);
    res.status(500).json({ error: 'Failed to approve question assignment' });
  }
});

// Reject question assignment
router.post('/:id/reject', async (req, res) => {
  try {
    const { id } = req.params;
    const { rejection_reason, approved_by_email } = req.body;
    
    if (!rejection_reason || !approved_by_email) {
      return res.status(400).json({ error: 'Rejection reason and reviewer email are required' });
    }
    
    const result = await pool.query(`
      UPDATE question_assignments
      SET 
        status = 'rejected',
        rejection_reason = $1,
        approved_by_email = $2,
        updated_at = NOW()
      WHERE id = $3 AND status = 'completed'
      RETURNING *
    `, [rejection_reason, approved_by_email, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Question assignment not found or not completed' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error rejecting question assignment:', error);
    res.status(500).json({ error: 'Failed to reject question assignment' });
  }
});

// Send reminder
router.post('/:id/remind', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(`
      UPDATE question_assignments
      SET 
        reminder_sent_at = NOW(),
        reminder_count = reminder_count + 1,
        updated_at = NOW()
      WHERE id = $1 AND status IN ('pending', 'in_progress')
      RETURNING *
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Question assignment not found or already completed' });
    }
    
    // TODO: Send actual email reminder
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error sending reminder:', error);
    res.status(500).json({ error: 'Failed to send reminder' });
  }
});

// Delete question assignment
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'DELETE FROM question_assignments WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Question assignment not found' });
    }
    
    res.json({ message: 'Question assignment deleted successfully' });
  } catch (error) {
    console.error('Error deleting question assignment:', error);
    res.status(500).json({ error: 'Failed to delete question assignment' });
  }
});

// Get statistics
router.get('/stats/summary', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'pending') as pending,
        COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress,
        COUNT(*) FILTER (WHERE status = 'completed') as completed,
        COUNT(*) FILTER (WHERE status = 'approved') as approved,
        COUNT(*) FILTER (WHERE status = 'rejected') as rejected
      FROM question_assignments
    `);
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching question assignment stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

module.exports = router;

