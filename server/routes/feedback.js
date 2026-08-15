const express = require('express');
const router = express.Router();
const pool = require('../db/connection');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Feedback file storage path
const FEEDBACK_FILE = path.join(__dirname, '../data/feedback.json');

// Helper function to check if PostgreSQL is available
async function isPostgresAvailable() {
  try {
    await pool.query('SELECT 1');
    return true;
  } catch (error) {
    return false;
  }
}

// Helper function to read feedback from file
async function readFeedbackFile() {
  try {
    const data = await fs.readFile(FEEDBACK_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

// Helper function to write feedback to file
async function writeFeedbackFile(feedback) {
  await fs.writeFile(FEEDBACK_FILE, JSON.stringify(feedback, null, 2), 'utf8');
}

// Submit feedback
router.post('/', async (req, res) => {
  try {
    const {
      name,
      email,
      company,
      question1_response,
      question2_response,
      question3_response,
      question4_response,
      question5_response,
      question6_response
    } = req.body;

    // Validation
    if (!name || !email || !company) {
      return res.status(400).json({ error: 'Name, email, and company are required' });
    }

    if (!question1_response || !question2_response || !question3_response || 
        !question4_response || !question5_response || !question6_response) {
      return res.status(400).json({ error: 'All questions must be answered' });
    }

    // Validate response options
    const validOptions = ['Yes', 'No', 'Neutral'];
    const responses = [question1_response, question2_response, question3_response, 
                      question4_response, question5_response];
    
    for (const response of responses) {
      if (!validOptions.includes(response)) {
        return res.status(400).json({ error: 'Invalid response option' });
      }
    }

    const feedbackData = {
      id: uuidv4(),
      name,
      email,
      company,
      question1_response,
      question2_response,
      question3_response,
      question4_response,
      question5_response,
      question6_response,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Try PostgreSQL first, fall back to file storage
    if (await isPostgresAvailable()) {
      const result = await pool.query(
        `INSERT INTO feedback 
          (name, email, company, question1_response, question2_response, 
           question3_response, question4_response, question5_response, question6_response)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING *`,
        [name, email, company, question1_response, question2_response, 
         question3_response, question4_response, question5_response, question6_response]
      );

      res.status(201).json({
        message: 'Feedback submitted successfully',
        feedback: result.rows[0]
      });
    } else {
      // Use file storage
      const allFeedback = await readFeedbackFile();
      allFeedback.push(feedbackData);
      await writeFeedbackFile(allFeedback);

      res.status(201).json({
        message: 'Feedback submitted successfully',
        feedback: feedbackData
      });
    }
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

// Get all feedback (admin only - add authentication middleware if needed)
router.get('/', async (req, res) => {
  try {
    // Try PostgreSQL first, fall back to file storage
    if (await isPostgresAvailable()) {
      const result = await pool.query(
        'SELECT * FROM feedback ORDER BY created_at DESC'
      );
      res.json(result.rows);
    } else {
      // Use file storage
      const allFeedback = await readFeedbackFile();
      allFeedback.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      res.json(allFeedback);
    }
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
});

// Get feedback by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Try PostgreSQL first, fall back to file storage
    if (await isPostgresAvailable()) {
      const result = await pool.query(
        'SELECT * FROM feedback WHERE id = $1',
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Feedback not found' });
      }

      res.json(result.rows[0]);
    } else {
      // Use file storage
      const allFeedback = await readFeedbackFile();
      const feedback = allFeedback.find(f => f.id === id);

      if (!feedback) {
        return res.status(404).json({ error: 'Feedback not found' });
      }

      res.json(feedback);
    }
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
});

// Get feedback statistics (admin only)
router.get('/stats/summary', async (req, res) => {
  try {
    // Try PostgreSQL first, fall back to file storage
    if (await isPostgresAvailable()) {
      const result = await pool.query(`
        SELECT 
          COUNT(*) as total_responses,
          COUNT(DISTINCT email) as unique_users,
          ROUND(AVG(CASE WHEN question1_response = 'Yes' THEN 1 WHEN question1_response = 'No' THEN 0 ELSE 0.5 END) * 100) as q1_positive_pct,
          ROUND(AVG(CASE WHEN question2_response = 'Yes' THEN 1 WHEN question2_response = 'No' THEN 0 ELSE 0.5 END) * 100) as q2_positive_pct,
          ROUND(AVG(CASE WHEN question3_response = 'Yes' THEN 1 WHEN question3_response = 'No' THEN 0 ELSE 0.5 END) * 100) as q3_positive_pct,
          ROUND(AVG(CASE WHEN question4_response = 'Yes' THEN 1 WHEN question4_response = 'No' THEN 0 ELSE 0.5 END) * 100) as q4_positive_pct,
          ROUND(AVG(CASE WHEN question5_response = 'Yes' THEN 1 WHEN question5_response = 'No' THEN 0 ELSE 0.5 END) * 100) as q5_positive_pct
        FROM feedback
      `);

      res.json(result.rows[0]);
    } else {
      // Use file storage
      const allFeedback = await readFeedbackFile();
      
      if (allFeedback.length === 0) {
        return res.json({
          total_responses: 0,
          unique_users: 0,
          q1_positive_pct: 0,
          q2_positive_pct: 0,
          q3_positive_pct: 0,
          q4_positive_pct: 0,
          q5_positive_pct: 0
        });
      }

      const uniqueEmails = new Set(allFeedback.map(f => f.email));
      
      const calcPositivePct = (questionKey) => {
        const sum = allFeedback.reduce((acc, f) => {
          if (f[questionKey] === 'Yes') return acc + 1;
          if (f[questionKey] === 'No') return acc + 0;
          return acc + 0.5;
        }, 0);
        return Math.round((sum / allFeedback.length) * 100);
      };

      res.json({
        total_responses: allFeedback.length,
        unique_users: uniqueEmails.size,
        q1_positive_pct: calcPositivePct('question1_response'),
        q2_positive_pct: calcPositivePct('question2_response'),
        q3_positive_pct: calcPositivePct('question3_response'),
        q4_positive_pct: calcPositivePct('question4_response'),
        q5_positive_pct: calcPositivePct('question5_response')
      });
    }
  } catch (error) {
    console.error('Error fetching feedback stats:', error);
    res.status(500).json({ error: 'Failed to fetch feedback statistics' });
  }
});

module.exports = router;

