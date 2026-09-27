const express = require('express');
const router = express.Router();
const pool = require('../db/connection');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const FEEDBACK_FILE = path.join(__dirname, '../data/feedback.json');
const submissionBuckets = new Map();

async function isPostgresAvailable() {
  try {
    await pool.query('SELECT 1');
    return true;
  } catch (error) {
    return false;
  }
}

async function readFeedbackFile() {
  try {
    const data = await fs.readFile(FEEDBACK_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}

async function writeFeedbackFile(feedback) {
  await fs.writeFile(FEEDBACK_FILE, JSON.stringify(feedback, null, 2), 'utf8');
}

function submissionRateLimit(req, res, next) {
  const key = req.user?.id || req.ip || 'unknown';
  const now = Date.now();
  const windowMs = 60 * 60 * 1000;
  const timestamps = (submissionBuckets.get(key) || []).filter((ts) => now - ts < windowMs);

  if (timestamps.length >= 5) {
    return res.status(429).json({ error: 'Feedback submission limit reached. Please try again later.' });
  }

  timestamps.push(now);
  submissionBuckets.set(key, timestamps);
  return next();
}

function cleanText(value, maxLength) {
  return String(value || '').trim().slice(0, maxLength);
}

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 320;
}

// Feedback submission is available to authenticated users and isolated demo guests.
router.post('/', requireAuth, submissionRateLimit, async (req, res) => {
  try {
    const name = cleanText(req.body.name, 120);
    const email = cleanText(req.body.email, 320).toLowerCase();
    const company = cleanText(req.body.company, 160);
    const question1_response = req.body.question1_response;
    const question2_response = req.body.question2_response;
    const question3_response = req.body.question3_response;
    const question4_response = req.body.question4_response;
    const question5_response = req.body.question5_response;
    const question6_response = cleanText(req.body.question6_response, 4_000);

    if (!name || !email || !company || !validEmail(email)) {
      return res.status(400).json({ error: 'A valid name, email, and company are required' });
    }

    if (!question1_response || !question2_response || !question3_response ||
        !question4_response || !question5_response || !question6_response) {
      return res.status(400).json({ error: 'All questions must be answered' });
    }

    const validOptions = ['Yes', 'No', 'Neutral'];
    const responses = [question1_response, question2_response, question3_response,
      question4_response, question5_response];

    if (responses.some((response) => !validOptions.includes(response))) {
      return res.status(400).json({ error: 'Invalid response option' });
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
      submitted_by: req.user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (await isPostgresAvailable()) {
      const result = await pool.query(
        `INSERT INTO feedback
          (name, email, company, question1_response,
           question2_response, question3_response, question4_response,
           question5_response, question6_response)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING id, created_at`,
        [name, email, company, question1_response, question2_response,
          question3_response, question4_response, question5_response, question6_response]
      );

      return res.status(201).json({
        message: 'Feedback submitted successfully',
        feedback: result.rows[0]
      });
    }

    const allFeedback = await readFeedbackFile();
    allFeedback.push(feedbackData);
    await writeFeedbackFile(allFeedback);

    return res.status(201).json({
      message: 'Feedback submitted successfully',
      feedback: { id: feedbackData.id, created_at: feedbackData.created_at }
    });
  } catch (error) {
    console.error('Error submitting feedback:', error.message);
    return res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

// Feedback contains PII and free-text content. Reading it is admin-only.
router.get('/', requireAdmin, async (req, res) => {
  try {
    if (await isPostgresAvailable()) {
      const result = await pool.query('SELECT * FROM feedback ORDER BY created_at DESC');
      return res.json(result.rows);
    }

    const allFeedback = await readFeedbackFile();
    allFeedback.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return res.json(allFeedback);
  } catch (error) {
    console.error('Error fetching feedback:', error.message);
    return res.status(500).json({ error: 'Failed to fetch feedback' });
  }
});

// IMPORTANT: define /stats/summary before /:id so "stats" cannot be interpreted as an ID.
router.get('/stats/summary', requireAdmin, async (req, res) => {
  try {
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
      return res.json(result.rows[0]);
    }

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

    const uniqueEmails = new Set(allFeedback.map((f) => f.email));
    const calcPositivePct = (questionKey) => {
      const sum = allFeedback.reduce((acc, feedback) => {
        if (feedback[questionKey] === 'Yes') return acc + 1;
        if (feedback[questionKey] === 'No') return acc;
        return acc + 0.5;
      }, 0);
      return Math.round((sum / allFeedback.length) * 100);
    };

    return res.json({
      total_responses: allFeedback.length,
      unique_users: uniqueEmails.size,
      q1_positive_pct: calcPositivePct('question1_response'),
      q2_positive_pct: calcPositivePct('question2_response'),
      q3_positive_pct: calcPositivePct('question3_response'),
      q4_positive_pct: calcPositivePct('question4_response'),
      q5_positive_pct: calcPositivePct('question5_response')
    });
  } catch (error) {
    console.error('Error fetching feedback stats:', error.message);
    return res.status(500).json({ error: 'Failed to fetch feedback statistics' });
  }
});

router.get('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    if (await isPostgresAvailable()) {
      const result = await pool.query('SELECT * FROM feedback WHERE id = $1', [id]);
      if (result.rows.length === 0) return res.status(404).json({ error: 'Feedback not found' });
      return res.json(result.rows[0]);
    }

    const allFeedback = await readFeedbackFile();
    const feedback = allFeedback.find((item) => item.id === id);
    if (!feedback) return res.status(404).json({ error: 'Feedback not found' });
    return res.json(feedback);
  } catch (error) {
    console.error('Error fetching feedback:', error.message);
    return res.status(500).json({ error: 'Failed to fetch feedback' });
  }
});

module.exports = router;
