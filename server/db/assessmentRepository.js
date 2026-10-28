const db = require('./connection');
const DataStore = require('../utils/dataStore');
const path = require('path');

const fileStore = new DataStore(path.join(__dirname, '../../data/assessments.json'));

const ALL_SIX_PILLAR_IDS = [
  'platform_governance',
  'data_engineering',
  'analytics_bi',
  'machine_learning',
  'generative_ai',
  'operational_excellence'
];

function computeCoreAssessmentScores(responses = {}) {
  const curVals = [];
  const futVals = [];
  for (const [k, v] of Object.entries(responses || {})) {
    if (k.endsWith('_current_state')) {
      const n = Number(v);
      if (Number.isFinite(n) && n >= 1 && n <= 5) curVals.push(n);
    } else if (k.endsWith('_future_state')) {
      const n = Number(v);
      if (Number.isFinite(n) && n >= 1 && n <= 5) futVals.push(n);
    }
  }
  const overallScore = curVals.length > 0
    ? Number((curVals.reduce((a, b) => a + b, 0) / curVals.length).toFixed(2))
    : 0;
  const futureScore = futVals.length > 0
    ? Number((futVals.reduce((a, b) => a + b, 0) / futVals.length).toFixed(2))
    : (overallScore > 0 ? Number(Math.min(5, overallScore + 1.4).toFixed(2)) : 0);
  const gap = Number(Math.max(0, futureScore - overallScore).toFixed(2));
  const maturityLevel = overallScore >= 4.2
    ? 'Transform'
    : overallScore >= 3.4
      ? 'Optimize'
      : overallScore >= 2.6
        ? 'Formalize'
        : overallScore >= 1.8
          ? 'Experiment'
          : (overallScore > 0 ? 'Explore' : 'Pending');
  return { overallScore, futureScore, gap, maturityLevel };
}

function normalizeReleaseState(assessment) {
  if (!assessment) return assessment;

  const ownerId = assessment.userId || assessment.user_id || '';
  const isDemoOwned = (typeof ownerId === 'string' && ownerId.startsWith('demo_')) || !ownerId || ['guest_admin', 'system_unowned', 'system', 'demo_guest', 'admin_guest', 'guest', 'public', 'unowned', 'user'].includes(String(ownerId).toLowerCase().trim());

  const name = assessment.assessment_name || assessment.assessmentName || 'Enterprise Data & AI Assessment';
  const org = assessment.organization_name || assessment.organizationName || 'Enterprise Organization';
  const email = assessment.contact_email || assessment.contactEmail || 'admin@scorex.ai';
  const rawPillars = assessment.selected_pillars || assessment.selectedPillars || [];
  const completedCats = assessment.completed_categories || assessment.completedCategories || [];
  const pillars = (completedCats.length >= 6 || rawPillars.length === 0) ? ALL_SIX_PILLAR_IDS : rawPillars;
  const created = assessment.created_at || assessment.createdAt || assessment.startedAt || assessment.started_at || '2026-08-15T12:00:00.000Z';
  const updated = assessment.updated_at || assessment.updatedAt || assessment.completedAt || assessment.completed_at || created;
  const computed = computeCoreAssessmentScores(assessment.responses);
  const hasComputedScores = computed.overallScore > 0;

  return {
    ...assessment,
    assessment_name: name,
    assessmentName: name,
    organization_name: org,
    organizationName: org,
    contact_email: email,
    contactEmail: email,
    selected_pillars: pillars,
    selectedPillars: pillars,
    overallScore: hasComputedScores ? computed.overallScore : (assessment.overallScore || 0),
    totalScore: hasComputedScores ? computed.overallScore : (assessment.totalScore || assessment.overallScore || 0),
    futureScore: hasComputedScores ? computed.futureScore : (assessment.futureScore || 0),
    targetScore: hasComputedScores ? computed.futureScore : (assessment.targetScore || assessment.futureScore || 0),
    gap: hasComputedScores ? computed.gap : (assessment.gap ?? 0),
    maturityLevel: hasComputedScores ? computed.maturityLevel : (assessment.maturityLevel || computed.maturityLevel),
    created_at: created,
    createdAt: created,
    updated_at: updated,
    updatedAt: updated,
    results_released: isDemoOwned ? true : Boolean(assessment.results_released),
    results_released_by: assessment.results_released_by || null,
    results_released_at: assessment.results_released_at || null
  };
}

/**
 * Assessment Repository
 * Resilient dual-mode database operations for assessments:
 * Uses PostgreSQL when available and falls back to persistent file storage.
 */
class AssessmentRepository {
  constructor() {
    this.ensureStarterCoreAssessments();
  }

  ensureStarterCoreAssessments() {
    try {
      const fw = require('../data/assessmentFramework');
      fileStore.delete('b897151f-8f96-4f99-a080-9540e3446961');
      fileStore.delete('e548a10d-7277-4bf0-95a4-067ef77744c4');
      fileStore.delete('58fe19e8-ca16-4d0b-8be3-99e7e01f2b22');
      const existing = fileStore.getAll() || {};
      const profiles = [
        {
          id: 'c5219d95-d9d8-4850-9c05-889921dc118d',
          assessmentName: 'OmniChannel Retail Group — Data & AI Maturity Assessment',
          assessmentDescription: 'End-to-end 6-pillar evaluation of omnichannel customer data platform, real-time inventory analytics, and retail personalization AI.',
          organizationName: 'OmniChannel Retail Group',
          contactEmail: 'vp-data@omnichannelretail.com',
          industry: 'Retail & Consumer Goods',
          pillarScores: [[3, 2, 3, 3, 2, 3, 3, 2, 3, 3], [3, 3, 2, 3, 3, 2, 3, 3, 2, 3], [3, 3, 3, 2, 3, 3, 3, 2, 3, 3], [2, 3, 2, 2, 3, 2, 3, 2, 2, 3], [2, 2, 3, 2, 2, 3, 2, 2, 3, 2], [3, 2, 3, 2, 3, 3, 2, 3, 2, 3]]
        },
        {
          id: '29160ad2-afd1-4335-bb0a-d74ce475af02',
          assessmentName: 'Precision Industrial Corp — Smart Manufacturing & IoT AI Assessment',
          assessmentDescription: 'Comprehensive 6-pillar readiness review for industrial telemetry streaming, predictive maintenance ML, and supply chain digital twin.',
          organizationName: 'Precision Industrial Corp',
          contactEmail: 'chief-digital@precisionindustrial.com',
          industry: 'Manufacturing & Industrial IoT',
          pillarScores: [[3, 3, 3, 3, 3, 3, 4, 3, 3, 3], [3, 4, 3, 3, 3, 3, 3, 4, 3, 3], [3, 3, 3, 3, 2, 3, 3, 3, 3, 3], [3, 3, 2, 3, 3, 2, 3, 3, 2, 3], [2, 3, 2, 3, 2, 2, 3, 2, 3, 2], [3, 3, 3, 3, 3, 3, 3, 3, 3, 3]]
        },
        {
          id: 'd4a9c051-667e-4e43-8d57-e721115189e1',
          assessmentName: 'Vanguard Global Insurance — Actuarial Risk & Agentic Claims Assessment',
          assessmentDescription: 'Regulated financial services 6-pillar assessment covering zero-trust governance, actuarial lakehouse, and agentic claims triage.',
          organizationName: 'Vanguard Global Insurance',
          contactEmail: 'cdo@vanguardinsurance.com',
          industry: 'Financial Services & Insurance',
          pillarScores: [[4, 3, 4, 4, 3, 4, 3, 4, 3, 4], [3, 3, 4, 3, 3, 4, 3, 3, 3, 3], [4, 3, 3, 4, 3, 3, 4, 3, 3, 4], [3, 3, 3, 3, 3, 3, 3, 3, 3, 3], [3, 3, 3, 2, 3, 3, 3, 2, 3, 3], [3, 4, 3, 3, 3, 4, 3, 3, 3, 3]]
        },
        {
          id: 'inst_enterprise_data_ai_maturity_demo',
          assessmentName: 'ConnectPlus Telecom Global — Enterprise Data & AI Maturity Assessment',
          assessmentDescription: 'Flagship 6-pillar telecom data & AI estate assessment across network telemetry, subscriber 360, and autonomous NOC operations.',
          organizationName: 'ConnectPlus Telecom Global',
          contactEmail: 'cio@connectplus.telecom',
          industry: 'Telecommunications & Media',
          pillarScores: [[3, 4, 3, 3, 4, 3, 3, 3, 3, 3], [3, 3, 3, 2, 3, 3, 3, 3, 3, 3], [4, 3, 4, 3, 3, 4, 3, 3, 4, 3], [3, 2, 3, 2, 3, 2, 3, 3, 2, 3], [3, 3, 2, 3, 3, 3, 2, 3, 3, 3], [3, 3, 4, 3, 3, 3, 3, 3, 3, 3]]
        }
      ];

      for (const prof of profiles) {
        const curExisting = existing[prof.id];
        if (
          curExisting &&
          curExisting.responses &&
          Object.keys(curExisting.responses).filter(k => k.endsWith('_current_state')).length >= 60 &&
          curExisting.overallScore > 0 &&
          Array.isArray(curExisting.selectedPillars) &&
          curExisting.selectedPillars.length === 6
        ) {
          continue;
        }
        const safeExisting = curExisting || {};
        const responses = {};
        fw.assessmentAreas.forEach((area, aIdx) => {
          let qCounter = 0;
          const pattern = prof.pillarScores[aIdx] || [3, 3, 3, 3, 3, 3, 3, 3, 3, 3];
          (area.dimensions || []).forEach(dim => {
            (dim.questions || []).forEach(q => {
              const score = pattern[qCounter % pattern.length];
              const future = Math.min(5, score + (qCounter % 2 === 0 ? 2 : 1));
              qCounter++;
              responses[q.id] = score;
              responses[`${q.id}_current_state`] = score;
              responses[`${q.id}_future_state`] = future;
              const techPain = q.perspectives?.find(p => p.id === 'technical_pain');
              const bizPain = q.perspectives?.find(p => p.id === 'business_pain');
              if (techPain?.options?.length > 0) {
                responses[`${q.id}_technical_pain`] = [techPain.options[0].value];
              }
              if (bizPain?.options?.length > 0) {
                responses[`${q.id}_business_pain`] = [bizPain.options[0].value];
              }
              responses[`${q.id}_comment`] = `Verified ${dim.name} baseline for ${prof.organizationName}; target state aligned to 12-month transformation roadmap.`;
            });
          });
        });

        const computed = computeCoreAssessmentScores(responses);
        const record = normalizeReleaseState({
          ...safeExisting,
          id: prof.id,
          assessmentName: prof.assessmentName,
          assessmentDescription: prof.assessmentDescription,
          organizationName: prof.organizationName,
          contactEmail: prof.contactEmail,
          industry: prof.industry,
          status: 'completed',
          progress: 100,
          currentCategory: 'operational_excellence',
          completedCategories: ALL_SIX_PILLAR_IDS,
          selectedPillars: ALL_SIX_PILLAR_IDS,
          responses,
          overallScore: computed.overallScore,
          totalScore: computed.overallScore,
          futureScore: computed.futureScore,
          targetScore: computed.futureScore,
          gap: computed.gap,
          maturityLevel: computed.maturityLevel,
          userId: safeExisting.userId || 'system',
          startedAt: safeExisting.startedAt || '2026-08-15T12:00:00.000Z',
          completedAt: safeExisting.completedAt || '2026-09-01T15:30:00.000Z',
          createdAt: safeExisting.createdAt || '2026-08-15T12:00:00.000Z',
          updatedAt: new Date().toISOString()
        });
        fileStore.set(prof.id, record);
      }
    } catch (e) {
      console.warn('Could not seed starter core assessments:', e.message);
    }
  }
  /**
   * Create a new assessment
   */
  async create(assessment) {
    const formatted = {
      id: assessment.id,
      assessmentName: assessment.assessmentName || 'Untitled Assessment',
      assessmentDescription: assessment.assessmentDescription || '',
      organizationName: assessment.organizationName || 'Not specified',
      contactEmail: assessment.contactEmail || '',
      industry: assessment.industry || 'Not specified',
      status: assessment.status || 'in_progress',
      progress: assessment.progress || 0,
      currentCategory: assessment.currentCategory || '',
      completedCategories: assessment.completedCategories || [],
      responses: assessment.responses || {},
      editHistory: assessment.editHistory || [],
      startedAt: assessment.startedAt || new Date().toISOString(),
      selectedPillars: assessment.selectedPillars || [],
      userId: assessment.userId || 'guest_admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      const query = `
        INSERT INTO assessments (
          id, assessment_name, assessment_description, organization_name,
          contact_email, industry, status, progress, current_category,
          completed_categories, responses, edit_history, started_at, selected_pillars, user_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        RETURNING *
      `;

      const values = [
        formatted.id,
        formatted.assessmentName,
        formatted.assessmentDescription,
        formatted.organizationName,
        formatted.contactEmail,
        formatted.industry,
        formatted.status,
        formatted.progress,
        formatted.currentCategory,
        JSON.stringify(formatted.completedCategories),
        JSON.stringify(formatted.responses),
        JSON.stringify(formatted.editHistory),
        formatted.startedAt,
        JSON.stringify(formatted.selectedPillars),
        formatted.userId
      ];

      const result = await db.query(query, values);
      return normalizeReleaseState(this.mapRowToAssessment(result.rows[0]));
    } catch (error) {
      console.warn('PostgreSQL create failed, saving to file storage:', error.message);
      fileStore.set(formatted.id, formatted);
      return normalizeReleaseState(formatted);
    }
  }

  /**
   * Get assessment by ID
   */
  async findById(id) {
    try {
      const query = 'SELECT * FROM assessments WHERE id = $1';
      const result = await db.query(query, [id]);
      if (result && result.rows && result.rows.length > 0) {
        return normalizeReleaseState(this.mapRowToAssessment(result.rows[0]));
      }
    } catch (error) {
      // Fallback to file storage
    }
    const fromFile = fileStore.get(id);
    if (fromFile) {
      return normalizeReleaseState(fromFile);
    }

    try {
      const customRepo = require('./customAssessmentRepository');
      const dynInst = await customRepo.getInstanceById(id);
      if (dynInst) {
        const fw = require('../data/assessmentFramework');
        const allPillarIds = fw.assessmentAreas.map(a => a.id);
        const mergedResponses = { ...(dynInst.responses || {}) };
        if (id === 'inst_enterprise_data_ai_maturity_demo' || dynInst.typeKey === 'enterprise_data_ai_maturity' || dynInst.status === 'completed') {
          fw.assessmentAreas.forEach((area, aIdx) => {
            (area.dimensions || []).forEach((dim, dIdx) => {
              (dim.questions || []).forEach((q, qIdx) => {
                const score = mergedResponses[`${q.id}_current_state`] || mergedResponses[q.id] || (((aIdx + dIdx + qIdx) % 3) + 2);
                const future = mergedResponses[`${q.id}_future_state`] || Math.min(5, score + 2);
                mergedResponses[q.id] = score;
                mergedResponses[`${q.id}_current_state`] = score;
                mergedResponses[`${q.id}_future_state`] = future;
                const techP = (q.perspectives || []).find(p => p.id === 'technical_pain');
                const bizP = (q.perspectives || []).find(p => p.id === 'business_pain');
                if (!mergedResponses[`${q.id}_technical_pain`] && techP?.options?.length) {
                  mergedResponses[`${q.id}_technical_pain`] = [techP.options[0].value];
                }
                if (!mergedResponses[`${q.id}_business_pain`] && bizP?.options?.length) {
                  mergedResponses[`${q.id}_business_pain`] = [bizP.options[0].value];
                }
                if (!mergedResponses[`${q.id}_comment`]) {
                  mergedResponses[`${q.id}_comment`] = 'Assessed 6-pillar enterprise data & AI estate; manual console IAM, 24h batch ETL lag, and isolated notebooks targeted for Dataplex, BigQuery & Vertex AI.';
                }
              });
            });
          });
        }
        return normalizeReleaseState({
          id: dynInst.id,
          assessmentName: `${dynInst.customerName || 'Enterprise'} — ${dynInst.useCase || 'Data & AI Maturity Assessment'}`,
          assessmentDescription: dynInst.useCase || 'Enterprise Data & AI Maturity Assessment',
          organizationName: dynInst.customerName || 'Enterprise Organization',
          contactEmail: dynInst.contactEmail || 'admin@scorex.ai',
          industry: dynInst.industry || 'Telecommunications',
          status: dynInst.status || 'completed',
          progress: 100,
          currentCategory: allPillarIds[0],
          completedCategories: allPillarIds,
          selectedPillars: allPillarIds,
          responses: mergedResponses,
          editHistory: [],
          startedAt: dynInst.createdAt || new Date().toISOString(),
          completedAt: dynInst.completedAt || dynInst.updatedAt || new Date().toISOString(),
          createdAt: dynInst.createdAt || new Date().toISOString(),
          updatedAt: dynInst.updatedAt || new Date().toISOString(),
          userId: dynInst.createdBy || 'system',
          results_released: true
        });
      }
    } catch (_) {}

    return null;
  }

  /**
   * Seed built-in starter enterprise assessments if database is empty
   */
  async seedStarterAssessments() {
    try {
      const sampleAssessmentGenerator = require('../utils/sampleAssessmentGenerator');
      const assessments = sampleAssessmentGenerator.generateMultipleSamples(6);
      const seeded = [];

      for (const item of assessments) {
        const assessment = {
          ...item,
          userId: item.userId || 'system_unowned',
          results_released: true,
          isSample: true
        };
        try {
          const saved = await this.create(assessment);
          seeded.push(saved);
        } catch (_) {
          fileStore.set(assessment.id, assessment);
          seeded.push(normalizeReleaseState(assessment));
        }
      }

      console.log(`[AssessmentRepo] Loaded ${seeded.length} synthetic starter enterprise assessments`);
      return seeded;
    } catch (err) {
      console.warn('[AssessmentRepo] Failed to seed starter assessments:', err.message);
      return [];
    }
  }

  /**
   * Get all assessments
   */
  async findAll() {
    const list = [];
    const seenIds = new Set();

    try {
      const query = 'SELECT * FROM assessments ORDER BY updated_at DESC';
      const result = await db.query(query);
      if (result && result.rows) {
        for (const row of result.rows) {
          const item = normalizeReleaseState(this.mapRowToAssessment(row));
          if (item?.id) {
            seenIds.add(item.id);
            list.push(item);
          }
        }
      }
    } catch (error) {
      // Fallback to file storage
    }

    try {
      const all = fileStore.getAll() || {};
      for (const item of Object.values(all)) {
        if (item?.id && !seenIds.has(item.id)) {
          seenIds.add(item.id);
          list.push(normalizeReleaseState(item));
        }
      }
    } catch (_) {}

    // Auto-seed starter assessments if database and file store have no assessments
    if (list.length === 0) {
      const starterList = await this.seedStarterAssessments();
      return starterList;
    }

    return list;
  }

  /**
   * Get assessments by email
   */
  async findByEmail(email) {
    try {
      const query = 'SELECT * FROM assessments WHERE contact_email = $1 ORDER BY updated_at DESC';
      const result = await db.query(query, [email]);
      if (result && result.rows) {
        return result.rows.map(row => normalizeReleaseState(this.mapRowToAssessment(row)));
      }
    } catch (error) {
      // Fallback to file storage
    }
    const all = fileStore.getAll() || {};
    return Object.values(all)
      .filter(a => a.contactEmail === email || a.contact_email === email)
      .map(normalizeReleaseState);
  }

  /**
   * Update assessment
   */
  async update(id, updates) {
    const assessment = (await this.findById(id)) || {};
    const merged = { ...assessment, ...updates, updatedAt: new Date().toISOString() };

    try {
      const query = `
        UPDATE assessments SET
          assessment_name = $1,
          assessment_description = $2,
          organization_name = $3,
          contact_email = $4,
          industry = $5,
          status = $6,
          progress = $7,
          current_category = $8,
          completed_categories = $9,
          responses = $10,
          edit_history = $11,
          completed_at = $12
        WHERE id = $13
        RETURNING *
      `;

      const values = [
        merged.assessmentName,
        merged.assessmentDescription,
        merged.organizationName,
        merged.contactEmail,
        merged.industry,
        merged.status,
        merged.progress,
        merged.currentCategory,
        JSON.stringify(merged.completedCategories || []),
        JSON.stringify(merged.responses || {}),
        JSON.stringify(merged.editHistory || []),
        merged.completedAt || null,
        id,
      ];

      const result = await db.query(query, values);
      if (result && result.rows && result.rows.length > 0) {
        return normalizeReleaseState(this.mapRowToAssessment(result.rows[0]));
      }
    } catch (error) {
      // Fallback to file storage
    }

    const normalized = normalizeReleaseState(merged);
    fileStore.set(id, normalized);
    return normalized;
  }

  /**
   * Update metadata
   */
  async updateMetadata(id, metadata, editorEmail) {
    const assessment = (await this.findById(id)) || {};
    const editHistory = assessment.editHistory || [];
    editHistory.push({
      timestamp: new Date().toISOString(),
      editor: editorEmail || 'unknown',
      changes: metadata,
    });

    const merged = { ...assessment, ...metadata, editHistory, updatedAt: new Date().toISOString() };

    try {
      const query = `
        UPDATE assessments SET
          assessment_name = COALESCE($1, assessment_name),
          assessment_description = COALESCE($2, assessment_description),
          organization_name = COALESCE($3, organization_name),
          contact_email = COALESCE($4, contact_email),
          industry = COALESCE($5, industry),
          edit_history = $6
        WHERE id = $7
        RETURNING *
      `;

      const values = [
        metadata.assessmentName || null,
        metadata.assessmentDescription || null,
        metadata.organizationName || null,
        metadata.contactEmail || null,
        metadata.industry || null,
        JSON.stringify(editHistory),
        id,
      ];

      const result = await db.query(query, values);
      if (result && result.rows && result.rows.length > 0) {
        return normalizeReleaseState(this.mapRowToAssessment(result.rows[0]));
      }
    } catch (error) {
      // Fallback
    }

    fileStore.set(id, merged);
    return normalizeReleaseState(merged);
  }

  /**
   * Save progress for a question
   */
  async saveProgress(id, questionId, perspectiveId, value, comment, isSkipped, editorEmail) {
    const assessment = (await this.findById(id)) || { responses: {}, editHistory: [] };
    const responses = assessment.responses || {};

    if (isSkipped !== undefined) {
      const skipKey = `${questionId}_skipped`;
      responses[skipKey] = isSkipped;
      if (isSkipped) {
        ['current_state', 'future_state', 'technical_pain', 'business_pain'].forEach(p => {
          delete responses[`${questionId}_${p}`];
        });
        delete responses[`${questionId}_comment`];
      }
    }

    if (questionId && perspectiveId && !responses[`${questionId}_skipped`]) {
      responses[`${questionId}_${perspectiveId}`] = value;
    }

    if (comment !== undefined && !responses[`${questionId}_skipped`]) {
      responses[`${questionId}_comment`] = comment;
    }

    return await this.update(id, { responses });
  }

  /**
   * Delete assessment
   */
  async delete(id) {
    try {
      const query = 'DELETE FROM assessments WHERE id = $1';
      await db.query(query, [id]);
    } catch (error) {
      // Fallback
    }
    fileStore.delete(id);
    return true;
  }

  /**
   * Check if exists
   */
  async exists(id) {
    const found = await this.findById(id);
    return !!found;
  }

  /**
   * Count assessments
   */
  async count() {
    try {
      const query = 'SELECT COUNT(*) as count FROM assessments';
      const result = await db.query(query);
      if (result && result.rows) {
        return parseInt(result.rows[0].count);
      }
    } catch (error) {
      // Fallback
    }
    const all = fileStore.getAll() || {};
    return Object.keys(all).length;
  }

  /**
   * Get stats
   */
  async getStats() {
    try {
      const query = `
        SELECT 
          COUNT(*) as total,
          COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as active,
          COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed
        FROM assessments
      `;
      const result = await db.query(query);
      if (result && result.rows) {
        return {
          total: parseInt(result.rows[0].total),
          active: parseInt(result.rows[0].active),
          completed: parseInt(result.rows[0].completed)
        };
      }
    } catch (error) {
      // Fallback
    }
    const all = Object.values(fileStore.getAll() || {});
    return {
      total: all.length,
      active: all.filter(a => a.status === 'in_progress').length,
      completed: all.filter(a => a.status === 'completed').length
    };
  }

  /**
   * Map database row to assessment object
   */
  mapRowToAssessment(row) {
    if (!row) return null;

    return {
      id: row.id,
      assessmentName: row.assessment_name,
      assessmentDescription: row.assessment_description,
      organizationName: row.organization_name,
      contactEmail: row.contact_email,
      industry: row.industry,
      selectedPillars: row.selected_pillars || [],
      status: row.status,
      progress: row.progress,
      currentCategory: row.current_category,
      completedCategories: row.completed_categories || [],
      responses: row.responses || {},
      editHistory: row.edit_history || [],
      startedAt: row.started_at,
      completedAt: row.completed_at,
      updatedAt: row.updated_at,
      createdAt: row.created_at,
      userId: row.user_id,
      user_id: row.user_id,
      results_released: row.results_released,
      results_released_by: row.results_released_by,
      results_released_at: row.results_released_at,
      lastSaved: row.updated_at,
    };
  }
}

module.exports = new AssessmentRepository();
