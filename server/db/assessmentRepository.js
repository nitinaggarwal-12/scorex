const db = require('./connection');
const DataStore = require('../utils/dataStore');
const path = require('path');

const fileStore = new DataStore(path.join(__dirname, '../../data/assessments.json'));

function normalizeReleaseState(assessment) {
  if (!assessment) return assessment;

  const ownerId = assessment.userId || assessment.user_id || '';
  const isDemoOwned = (typeof ownerId === 'string' && ownerId.startsWith('demo_')) || !ownerId || ['guest_admin', 'system_unowned', 'system', 'demo_guest', 'admin_guest', 'guest', 'public', 'unowned', 'user'].includes(String(ownerId).toLowerCase().trim());

  const name = assessment.assessment_name || assessment.assessmentName || 'Enterprise Data & AI Assessment';
  const org = assessment.organization_name || assessment.organizationName || 'Enterprise Organization';
  const email = assessment.contact_email || assessment.contactEmail || 'admin@scorex.ai';
  const pillars = assessment.selected_pillars || assessment.selectedPillars || ['platform_governance', 'data_engineering', 'analytics_bi', 'machine_learning', 'generative_ai', 'operational_excellence'];
  const created = assessment.created_at || assessment.createdAt || assessment.startedAt || assessment.started_at || '2026-08-15T12:00:00.000Z';
  const updated = assessment.updated_at || assessment.updatedAt || assessment.completedAt || assessment.completed_at || created;

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
      const idStr = String(id || '').trim();
      const normId = idStr.toLowerCase();
      const isGeVrId =
        normId.startsWith('ge_vr_') ||
        normId.startsWith('acc-') ||
        normId.includes('ge_value_realization') ||
        normId === 'aerovanguard_default' ||
        normId === 'bionova_ge_vr_2026_q2' ||
        normId === 'bionova';

      if (isGeVrId) {
        const { ingestCustomerMultiSourceDossier } = require('../services/geCustomerMultiSourceIngestor');
        const fs = require('fs');
        const dossiersPath = path.join(process.env.DATA_DIR || path.join(__dirname, '../../data'), 'ge_value_realization_dossiers.json');
        let dossiers = {};
        try {
          if (fs.existsSync(dossiersPath)) {
            dossiers = JSON.parse(fs.readFileSync(dossiersPath, 'utf8')) || {};
          }
        } catch (_) {}

        let dossier = dossiers[idStr] || dossiers[normId];
        if (!dossier) {
          let sfdcAccountId = 'ACC-1001-AEROVG';
          if (normId.includes('bionova') || normId.includes('1002')) {
            sfdcAccountId = 'ACC-1002-BIONOVA';
          } else if (normId.startsWith('ge_vr_acc-')) {
            sfdcAccountId = idStr.replace(/^ge_vr_/i, '').toUpperCase();
          } else if (normId.startsWith('acc-')) {
            sfdcAccountId = idStr.toUpperCase();
          }
          dossier = dossiers[`ge_vr_${sfdcAccountId.toLowerCase()}`] || ingestCustomerMultiSourceDossier({
            sfdcAccountId,
            timePreset: 'ytd_2026',
            prefillMode: 'evidence'
          });
        }

        if (dossier) {
          const fw = require('../data/assessmentFramework');
          const allPillarIds = fw.assessmentAreas.map(a => a.id);
          const customerName = dossier.meta?.customerName || dossier.customerName || 'AeroVanguard Global Logistics';
          const legacyName = dossier.meta?.legacyPlatformName || dossier.legacyRetirement?.legacyToolName || 'Legacy AI Assistant';
          const contractedSeats = Number(dossier.adoptionTelemetry?.contractedSeats || 68000).toLocaleString();
          const assignedSeats = Number(dossier.adoptionTelemetry?.assignedSeats || 42500).toLocaleString();
          const wauAll = Number(dossier.adoptionTelemetry?.wauAllApi || 28400).toLocaleString();
          const legacyCost = Number(dossier.legacyRetirement?.legacyAnnualRunRateModeledUsd || 1850000).toLocaleString();
          const topWorkflow = (dossier.workflows && dossier.workflows[0]?.name) || 'Priority Enterprise Workflow';

          const pillarEvidenceNotes = {
            platform_governance: `GE Value Realization [Modules L, Q & F — Platform Economics & Governance]: Migrating ${customerName} from ${legacyName} ($${legacyCost}/yr baseline run-rate) to Google Cloud Gemini Enterprise (${contractedSeats} contracted seats). Enforcing source ACL permission parity, VPC-SC boundaries, and Finance controller realization sign-off.`,
            data_engineering: `GE Value Realization [Modules C06, P04 & P05 — Enterprise Connectors & Grounding]: Connected enterprise corpora across SharePoint/OneDrive, BigQuery Lakehouse, ITSM/ServiceNow, and DMS repositories with automated ACL indexing and citation grounding.`,
            analytics_bi: `GE Value Realization [Module A — Cohort Adoption & Telemetry Funnel]: Active telemetry across ${contractedSeats} contracted seats, ${assignedSeats} assigned seats, and ${wauAll} 7-day WAU across Gemini Assist, Enterprise Search, and ADK Agents.`,
            machine_learning: `GE Value Realization [Module Q — Blinded Quality Evaluation & Latency SLAs]: Continuous Vertex AI evaluation benchmarking Gemini Enterprise vs. ${legacyName} on golden prompt sets, tracking citation verification, defect severity, and P50/P95 latency.`,
            generative_ai: `GE Value Realization [Module W — Priority Workflow Value Realization]: Validated cycle-time and task-effort reduction on "${topWorkflow}" and portfolio workflows, converting gross hours released into Finance-approved capacity and hard cost savings.`,
            operational_excellence: `GE Value Realization [Modules U, G & F — Employee Experience & Multi-Geo Rollout]: Stratified 30-day recall Employee Pulse Survey, regional Works Council/privacy wave governance, and quarterly CFO/CIO value realization cadence.`
          };

          const mergedResponses = { ...(dossier.classicResponses || {}) };
          fw.assessmentAreas.forEach((area, aIdx) => {
            (area.dimensions || []).forEach((dim, dIdx) => {
              (dim.questions || []).forEach((q, qIdx) => {
                const score = mergedResponses[`${q.id}_current_state`] || mergedResponses[q.id] || (((aIdx + dIdx + qIdx) % 2) + 3);
                const future = mergedResponses[`${q.id}_future_state`] || 5;
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
                  mergedResponses[`${q.id}_comment`] = pillarEvidenceNotes[area.id] || pillarEvidenceNotes.generative_ai;
                }
              });
            });
          });

          return normalizeReleaseState({
            id: idStr,
            assessmentId: idStr,
            assessmentFamily: 'ge_value_realization',
            assessmentName: `${customerName} — GE Value Realization Assessment`,
            assessmentDescription: `Gemini Enterprise Value Realization (${legacyName} → Gemini Enterprise Migration, Adoption, Workflow Outcomes & CFO Value Bridge)`,
            organizationName: customerName,
            contactEmail: dossier.meta?.executiveSponsor ? 'value-engineering@scorex.ai' : 'admin@scorex.ai',
            industry: dossier.meta?.industry || 'Enterprise Technology',
            status: 'submitted',
            progress: 100,
            currentCategory: allPillarIds[0],
            completedCategories: allPillarIds,
            selectedPillars: allPillarIds,
            responses: mergedResponses,
            editHistory: [],
            startedAt: dossier.meta?.lastUpdated || new Date().toISOString(),
            completedAt: dossier.meta?.lastUpdated || new Date().toISOString(),
            createdAt: dossier.meta?.lastUpdated || new Date().toISOString(),
            updatedAt: dossier.meta?.lastUpdated || new Date().toISOString(),
            userId: 'system_unowned',
            results_released: true
          });
        }
      }
    } catch (geErr) {
      console.warn('[AssessmentRepo] GE Value Realization adapter notice:', geErr.message);
    }

    try {
      const customRepo = require('./customAssessmentRepository');
      const dynInst = await customRepo.getInstanceById(id);
      if (dynInst) {
        const fw = require('../data/assessmentFramework');
        const allPillarIds = fw.assessmentAreas.map(a => a.id);
        const mergedResponses = { ...(dynInst.responses || {}) };
        if (id === 'inst_enterprise_data_ai_maturity_demo' || dynInst.typeKey === 'enterprise_data_ai_maturity' || dynInst.status === 'completed' || dynInst.status === 'submitted') {
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
                  mergedResponses[`${q.id}_comment`] = `Assessed ${dynInst.customerName || 'Enterprise'} (${dynInst.useCase || 'Data & AI Modernization'}); baseline architecture and target state mapped across all 6 enterprise pillars.`;
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
          status: (!dynInst.status || dynInst.status === 'completed') ? 'submitted' : dynInst.status,
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

    fileStore.set(id, merged);
    return normalizeReleaseState(merged);
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
