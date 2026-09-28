const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const { requireAuth, requireAuthorOrAdmin, canAccessResource } = require('../middleware/auth');

// All custom-question APIs require an authenticated user or isolated demo session.
router.use(requireAuth);

// Framework mutation and assignment-management operations are author/admin capabilities.
router.use((req, res, next) => {
  const isMutation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method);
  const isSensitiveRead = req.method === 'GET' && (
    req.path === '/stats/summary' ||
    req.path.endsWith('/assignments')
  );

  if (isMutation) {
    return requireAuthorOrAdmin(req, res, next);
  }
  if (isSensitiveRead) {
    if (req.user?.role === 'demo' || req.user?.isDemo) return next();
    return requireAuthorOrAdmin(req, res, next);
  }
  return next();
});

async function userCanReadAssessment(req, assessmentId) {
  if (req.user.role === 'admin' || req.user.role === 'author') return true;

  const result = await db.query(
    `SELECT * FROM assessments
     WHERE id::text = $1 OR assessment_id::text = $1
     LIMIT 1`,
    [String(assessmentId)]
  );

  if (result.rows.length === 0) return false;
  return canAccessResource(req.user, result.rows[0]);
}

const SEEDED_CUSTOM_QUESTIONS = [
  {
    id: 'cq_gov_01',
    question_text: 'How mature is your organization\'s unified data governance, lineage, and fine-grained ACL enforcement across multi-cloud and AI workloads?',
    pillar: 'platform_governance',
    category: 'Data & AI Governance',
    weight: 1.5,
    is_active: true,
    maturity_level_1: 'Ad-hoc manual permissions per bucket/table with no centralized catalog or audit trail.',
    maturity_level_2: 'Departmental catalogs with basic role-based access control (RBAC) and manual compliance checks.',
    maturity_level_3: 'Centralized Unity Catalog / Dataplex governance with automated column/row-level security policies.',
    maturity_level_4: 'Automated end-to-end data & model lineage with continuous PII classification and policy enforcement.',
    maturity_level_5: 'Autonomous zero-trust governance mesh with real-time AI policy guardrails and cross-cloud federation.',
    created_at: '2026-08-15T10:00:00.000Z'
  },
  {
    id: 'cq_eng_01',
    question_text: 'How standardized and automated are your medallion data ingestion, streaming CDC, and declarative pipeline orchestration workflows?',
    pillar: 'data_engineering',
    category: 'Pipeline Architecture & Streaming',
    weight: 1.4,
    is_active: true,
    maturity_level_1: 'Manual batch scripts and brittle cron jobs with frequent schema-drift breakages.',
    maturity_level_2: 'Scheduled ETL pipelines with basic retry logic but limited data quality expectations.',
    maturity_level_3: 'Standardized Bronze/Silver/Gold medallion architecture with declarative data quality quarantine.',
    maturity_level_4: 'Sub-minute Change Data Capture (CDC) streaming with auto-scaling compute and schema evolution.',
    maturity_level_5: 'Self-healing, AI-optimized lakehouse pipelines with predictive SLA governance and FinOps auto-tuning.',
    created_at: '2026-08-16T11:30:00.000Z'
  },
  {
    id: 'cq_bi_01',
    question_text: 'How effectively do business stakeholders access governed semantic metrics, self-service BI, and natural-language analytics?',
    pillar: 'analytics_bi',
    category: 'Semantic Layer & Self-Service BI',
    weight: 1.2,
    is_active: true,
    maturity_level_1: 'Siloed spreadsheet extracts and conflicting KPI definitions across business units.',
    maturity_level_2: 'Centralized BI dashboards with manual data warehouse extracts and multi-day report backlogs.',
    maturity_level_3: 'Certified semantic metric layer with governed self-service exploration on live lakehouse tables.',
    maturity_level_4: 'High-concurrency serverless SQL warehousing with conversational AI/BI genie grounded in certified metrics.',
    maturity_level_5: 'Real-time decision intelligence embedded directly into operational CRM/ERP workflows with proactive alerts.',
    created_at: '2026-08-18T14:15:00.000Z'
  },
  {
    id: 'cq_ml_01',
    question_text: 'How standardized is your end-to-end MLOps lifecycle from feature engineering and experiment tracking to production drift monitoring?',
    pillar: 'machine_learning',
    category: 'MLOps & Model Registry',
    weight: 1.3,
    is_active: true,
    maturity_level_1: 'Local data science notebooks with manual model handoffs and zero production telemetry.',
    maturity_level_2: 'Shared experiment tracking with manual container deployment and ad-hoc retraining.',
    maturity_level_3: 'Centralized Feature Store and Model Registry with CI/CD automated staging-to-production promotion.',
    maturity_level_4: 'Automated data/concept drift detection, shadow deployments, and lineage back to training snapshots.',
    maturity_level_5: 'Closed-loop champion/challenger auto-retraining with real-time feature serving and regulatory explainability.',
    created_at: '2026-08-20T09:45:00.000Z'
  },
  {
    id: 'cq_genai_01',
    question_text: 'How mature is your enterprise Generative AI & Agentic architecture regarding grounded RAG, evaluation benchmarks, and safety guardrails?',
    pillar: 'generative_ai',
    category: 'Enterprise GenAI & Agentic Systems',
    weight: 1.6,
    is_active: true,
    maturity_level_1: 'Unmonitored public LLM usage or disconnected PoC chatbots without enterprise source grounding.',
    maturity_level_2: 'Basic vector RAG pilots over static PDFs with manual spot-checking and no ACL inheritance.',
    maturity_level_3: 'ACL-aware enterprise search and grounded assistants with golden evaluation sets and citation verification.',
    maturity_level_4: 'Multi-step ADK agents integrated with enterprise systems via MCP, protected by Model Armor and VPC-SC.',
    maturity_level_5: 'CFO-validated agentic value realization with automated LLM-as-a-Judge observability and semantic caching.',
    created_at: '2026-08-22T16:20:00.000Z'
  },
  {
    id: 'cq_ops_01',
    question_text: 'How mature are your FinOps unit-economics attribution, cross-region DR resilience, and Infrastructure-as-Code (Terraform) automation?',
    pillar: 'operational_excellence',
    category: 'FinOps, SRE & IaC Automation',
    weight: 1.3,
    is_active: true,
    maturity_level_1: 'Manual console provisioning with unallocated cloud spend and no automated disaster recovery.',
    maturity_level_2: 'Basic cost tagging and environment separation with partially scripted deployments.',
    maturity_level_3: '100% Terraform/GitOps workspace provisioning with chargeback/showback dashboards by business unit.',
    maturity_level_4: 'Automated workload rightsizing, anomaly alerting, and tested multi-AZ/multi-region failover runbooks.',
    maturity_level_5: 'Unit-economic cost-per-query/cost-per-agent optimization with autonomous policy-driven FinOps.',
    created_at: '2026-08-25T13:10:00.000Z'
  }
];

let inMemoryCustomQuestions = [...SEEDED_CUSTOM_QUESTIONS];

function filterQuestionsList(list, { includeInactive, pillar, privileged }) {
  return list.filter(q => {
    if (includeInactive !== 'true' || !privileged) {
      if (!q.is_active) return false;
    }
    if (pillar && pillar !== 'all') {
      if (q.pillar !== pillar && q.pillar !== 'all') return false;
    }
    return true;
  });
}

// Note: GET /stats/summary must be registered BEFORE GET /:id so Express does not match "stats" as :id
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
    const row = result.rows[0];
    if (row && Number(row.total) > 0) {
      return res.json({ success: true, stats: row });
    }
  } catch (_) {}

  const total = inMemoryCustomQuestions.length;
  const active = inMemoryCustomQuestions.filter(q => q.is_active).length;
  const inactive = total - active;
  const unique_pillars = new Set(inMemoryCustomQuestions.map(q => q.pillar)).size;
  return res.json({
    success: true,
    stats: { total, active, inactive, unique_pillars }
  });
});

/**
 * GET /api/custom-questions
 * Get all custom questions (active only by default)
 */
router.get('/', async (req, res) => {
  const { includeInactive = 'false', pillar } = req.query;
  const privileged = req.user.role === 'admin' || req.user.role === 'author' || req.user.role === 'demo';
  try {
    let query = 'SELECT * FROM custom_questions';
    const conditions = [];
    const params = [];

    if (includeInactive !== 'true' || !privileged) {
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
    if (result.rows && result.rows.length > 0) {
      return res.json({
        success: true,
        questions: result.rows,
        count: result.rows.length
      });
    }
  } catch (_) {}

  const filtered = filterQuestionsList(inMemoryCustomQuestions, { includeInactive, pillar, privileged });
  return res.json({
    success: true,
    questions: filtered,
    count: filtered.length
  });
});

/**
 * GET /api/custom-questions/:id
 * Get a single custom question by ID
 */
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM custom_questions WHERE id = $1', [id]);
    if (result.rows.length > 0) {
      return res.json({ success: true, question: result.rows[0] });
    }
  } catch (_) {}

  const found = inMemoryCustomQuestions.find(q => String(q.id) === String(id));
  if (!found) {
    return res.status(404).json({ success: false, error: 'Question not found' });
  }
  return res.json({ success: true, question: found });
});

/**
 * POST /api/custom-questions
 * Create a new custom question
 */
router.post('/', async (req, res) => {
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

  if (!question_text || !pillar) {
    return res.status(400).json({
      success: false,
      error: 'Question text and pillar are required'
    });
  }

  if (weight < 0 || weight > 2) {
    return res.status(400).json({
      success: false,
      error: 'Weight must be between 0 and 2'
    });
  }

  try {
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
        req.user.id
      ]
    );
    return res.status(201).json({
      success: true,
      question: result.rows[0],
      message: 'Custom question created successfully'
    });
  } catch (_) {
    const newQ = {
      id: `cq_${Date.now()}`,
      question_text,
      pillar,
      category: category || 'Custom Diagnostic',
      weight: Number(weight) || 1.0,
      is_active: true,
      maturity_level_1: maturity_level_1 || '',
      maturity_level_2: maturity_level_2 || '',
      maturity_level_3: maturity_level_3 || '',
      maturity_level_4: maturity_level_4 || '',
      maturity_level_5: maturity_level_5 || '',
      created_by: req.user.id,
      created_at: new Date().toISOString()
    };
    inMemoryCustomQuestions.unshift(newQ);
    return res.status(201).json({
      success: true,
      question: newQ,
      message: 'Custom question created successfully'
    });
  }
});

/**
 * PUT /api/custom-questions/:id
 * Update a custom question
 */
router.put('/:id', async (req, res) => {
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

  try {
    const updates = [];
    const params = [];
    let paramCount = 1;

    if (question_text !== undefined) { params.push(question_text); updates.push(`question_text = $${paramCount++}`); }
    if (pillar !== undefined) { params.push(pillar); updates.push(`pillar = $${paramCount++}`); }
    if (category !== undefined) { params.push(category); updates.push(`category = $${paramCount++}`); }
    if (weight !== undefined) {
      if (weight < 0 || weight > 2) return res.status(400).json({ success: false, error: 'Weight must be between 0 and 2' });
      params.push(weight);
      updates.push(`weight = $${paramCount++}`);
    }
    if (maturity_level_1 !== undefined) { params.push(maturity_level_1); updates.push(`maturity_level_1 = $${paramCount++}`); }
    if (maturity_level_2 !== undefined) { params.push(maturity_level_2); updates.push(`maturity_level_2 = $${paramCount++}`); }
    if (maturity_level_3 !== undefined) { params.push(maturity_level_3); updates.push(`maturity_level_3 = $${paramCount++}`); }
    if (maturity_level_4 !== undefined) { params.push(maturity_level_4); updates.push(`maturity_level_4 = $${paramCount++}`); }
    if (maturity_level_5 !== undefined) { params.push(maturity_level_5); updates.push(`maturity_level_5 = $${paramCount++}`); }
    if (is_active !== undefined) { params.push(is_active); updates.push(`is_active = $${paramCount++}`); }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, error: 'No fields to update' });
    }

    params.push(id);
    const query = `UPDATE custom_questions SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    const result = await db.query(query, params);
    if (result.rows.length > 0) {
      return res.json({
        success: true,
        question: result.rows[0],
        message: 'Custom question updated successfully'
      });
    }
  } catch (_) {}

  const idx = inMemoryCustomQuestions.findIndex(q => String(q.id) === String(id));
  if (idx === -1) {
    return res.status(404).json({ success: false, error: 'Question not found' });
  }
  inMemoryCustomQuestions[idx] = {
    ...inMemoryCustomQuestions[idx],
    ...(question_text !== undefined ? { question_text } : {}),
    ...(pillar !== undefined ? { pillar } : {}),
    ...(category !== undefined ? { category } : {}),
    ...(weight !== undefined ? { weight: Number(weight) } : {}),
    ...(maturity_level_1 !== undefined ? { maturity_level_1 } : {}),
    ...(maturity_level_2 !== undefined ? { maturity_level_2 } : {}),
    ...(maturity_level_3 !== undefined ? { maturity_level_3 } : {}),
    ...(maturity_level_4 !== undefined ? { maturity_level_4 } : {}),
    ...(maturity_level_5 !== undefined ? { maturity_level_5 } : {}),
    ...(is_active !== undefined ? { is_active } : {})
  };
  return res.json({
    success: true,
    question: inMemoryCustomQuestions[idx],
    message: 'Custom question updated successfully'
  });
});

/**
 * DELETE /api/custom-questions/:id
 * Soft delete (deactivate) a custom question
 */
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const { hard = 'false' } = req.query;

  try {
    const query = hard === 'true'
      ? 'DELETE FROM custom_questions WHERE id = $1 RETURNING id'
      : 'UPDATE custom_questions SET is_active = false WHERE id = $1 RETURNING *';
    const result = await db.query(query, [id]);
    if (result.rows.length > 0) {
      return res.json({
        success: true,
        message: hard === 'true' ? 'Custom question permanently deleted' : 'Custom question deactivated',
        question: result.rows[0]
      });
    }
  } catch (_) {}

  const idx = inMemoryCustomQuestions.findIndex(q => String(q.id) === String(id));
  if (idx === -1) {
    return res.status(404).json({ success: false, error: 'Question not found' });
  }
  if (hard === 'true') {
    const [removed] = inMemoryCustomQuestions.splice(idx, 1);
    return res.json({ success: true, message: 'Custom question permanently deleted', question: removed });
  }
  inMemoryCustomQuestions[idx].is_active = false;
  return res.json({ success: true, message: 'Custom question deactivated', question: inMemoryCustomQuestions[idx] });
});

/**
 * POST /api/custom-questions/:questionId/assign
 * Assign a custom question to specific assessment(s)
 */
router.post('/:questionId/assign', async (req, res) => {
  try {
    const { questionId } = req.params;
    const { assessmentIds } = req.body;

    if (!assessmentIds || !Array.isArray(assessmentIds) || assessmentIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Assessment IDs array is required'
      });
    }

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

    const assignments = [];
    for (const assessmentId of assessmentIds) {
      try {
        const result = await db.query(
          `INSERT INTO assessment_custom_questions (assessment_id, custom_question_id, assigned_by)
           VALUES ($1, $2, $3)
           ON CONFLICT (assessment_id, custom_question_id) DO NOTHING
           RETURNING *`,
          [assessmentId, questionId, req.user.id]
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
 * GET /api/custom-questions/assessments/:assessmentId/questions
 * Get all custom questions assigned to a specific assessment
 */
router.get('/assessments/:assessmentId/questions', async (req, res) => {
  try {
    const { assessmentId } = req.params;
    const { pillar } = req.query;

    const allowed = await userCanReadAssessment(req, assessmentId);
    if (!allowed) {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }

    let query = `
      SELECT
        cq.*,
        acq.assigned_at,
        acq.assigned_by
      FROM custom_questions cq
      JOIN assessment_custom_questions acq ON cq.id = acq.custom_question_id
      WHERE acq.assessment_id::text = $1 AND cq.is_active = true
    `;

    const params = [String(assessmentId)];

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
