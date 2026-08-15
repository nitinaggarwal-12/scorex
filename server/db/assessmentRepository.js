const db = require('./connection');
const DataStore = require('../utils/dataStore');
const path = require('path');

const fileStore = new DataStore(path.join(__dirname, '../../data/assessments.json'));

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
      return this.mapRowToAssessment(result.rows[0]);
    } catch (error) {
      console.warn('PostgreSQL create failed, saving to file storage:', error.message);
      fileStore.set(formatted.id, formatted);
      return formatted;
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
        return this.mapRowToAssessment(result.rows[0]);
      }
    } catch (error) {
      // Fallback to file storage
    }
    return fileStore.get(id) || null;
  }

  /**
   * Get all assessments
   */
  async findAll() {
    try {
      const query = 'SELECT * FROM assessments ORDER BY updated_at DESC';
      const result = await db.query(query);
      if (result && result.rows) {
        return result.rows.map(row => this.mapRowToAssessment(row));
      }
    } catch (error) {
      // Fallback to file storage
    }
    const all = fileStore.getAll() || {};
    return Object.values(all);
  }

  /**
   * Get assessments by email
   */
  async findByEmail(email) {
    try {
      const query = 'SELECT * FROM assessments WHERE contact_email = $1 ORDER BY updated_at DESC';
      const result = await db.query(query, [email]);
      if (result && result.rows) {
        return result.rows.map(row => this.mapRowToAssessment(row));
      }
    } catch (error) {
      // Fallback to file storage
    }
    const all = fileStore.getAll() || {};
    return Object.values(all).filter(a => a.contactEmail === email || a.contact_email === email);
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
        return this.mapRowToAssessment(result.rows[0]);
      }
    } catch (error) {
      // Fallback to file storage
    }

    fileStore.set(id, merged);
    return merged;
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
        return this.mapRowToAssessment(result.rows[0]);
      }
    } catch (error) {
      // Fallback
    }

    fileStore.set(id, merged);
    return merged;
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
      user_id: row.user_id,
      lastSaved: row.updated_at,
    };
  }
}

module.exports = new AssessmentRepository();
