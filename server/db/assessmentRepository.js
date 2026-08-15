const db = require('./connection');

/**
 * Assessment Repository
 * Handles all database operations for assessments
 */
class AssessmentRepository {
  /**
   * Create a new assessment
   */
  async create(assessment) {
    const query = `
      INSERT INTO assessments (
        id, assessment_name, assessment_description, organization_name,
        contact_email, industry, status, progress, current_category,
        completed_categories, responses, edit_history, started_at, selected_pillars
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `;

    const values = [
      assessment.id,
      assessment.assessmentName || 'Untitled Assessment',
      assessment.assessmentDescription || '',
      assessment.organizationName || 'Not specified',
      assessment.contactEmail || '',
      assessment.industry || 'Not specified',
      assessment.status || 'in_progress',
      assessment.progress || 0,
      assessment.currentCategory || '',
      JSON.stringify(assessment.completedCategories || []),
      JSON.stringify(assessment.responses || {}),
      JSON.stringify(assessment.editHistory || []),
      assessment.startedAt || new Date().toISOString(),
      JSON.stringify(assessment.selectedPillars || []),
    ];

    try {
      const result = await db.query(query, values);
      return this.mapRowToAssessment(result.rows[0]);
    } catch (error) {
      console.error('Error creating assessment:', error);
      throw error;
    }
  }

  /**
   * Get assessment by ID
   */
  async findById(id) {
    const query = 'SELECT * FROM assessments WHERE id = $1';
    try {
      const result = await db.query(query, [id]);
      if (result.rows.length === 0) {
        return null;
      }
      return this.mapRowToAssessment(result.rows[0]);
    } catch (error) {
      console.error('Error finding assessment:', error);
      throw error;
    }
  }

  /**
   * Get all assessments
   */
  async findAll() {
    const query = 'SELECT * FROM assessments ORDER BY updated_at DESC';
    try {
      const result = await db.query(query);
      return result.rows.map(row => this.mapRowToAssessment(row));
    } catch (error) {
      console.error('Error finding assessments:', error);
      throw error;
    }
  }

  /**
   * Get assessments by email
   */
  async findByEmail(email) {
    const query = 'SELECT * FROM assessments WHERE contact_email = $1 ORDER BY updated_at DESC';
    try {
      const result = await db.query(query, [email]);
      return result.rows.map(row => this.mapRowToAssessment(row));
    } catch (error) {
      console.error('Error finding assessments by email:', error);
      throw error;
    }
  }

  /**
   * Update assessment
   */
  async update(id, updates) {
    const assessment = await this.findById(id);
    if (!assessment) {
      throw new Error('Assessment not found');
    }

    // Merge updates with existing data
    const merged = { ...assessment, ...updates };

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
      JSON.stringify(merged.completedCategories),
      JSON.stringify(merged.responses),
      JSON.stringify(merged.editHistory || []),
      merged.completedAt || null,
      id,
    ];

    try {
      const result = await db.query(query, values);
      return this.mapRowToAssessment(result.rows[0]);
    } catch (error) {
      console.error('Error updating assessment:', error);
      throw error;
    }
  }

  /**
   * Update assessment metadata only
   */
  async updateMetadata(id, metadata, editorEmail) {
    const assessment = await this.findById(id);
    if (!assessment) {
      throw new Error('Assessment not found');
    }

    // Add to edit history
    const editHistory = assessment.editHistory || [];
    editHistory.push({
      timestamp: new Date().toISOString(),
      editor: editorEmail || 'unknown',
      changes: metadata,
    });

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

    try {
      const result = await db.query(query, values);
      return this.mapRowToAssessment(result.rows[0]);
    } catch (error) {
      console.error('Error updating metadata:', error);
      throw error;
    }
  }

  /**
   * Save progress (update responses)
   */
  async saveProgress(id, questionId, perspectiveId, value, comment, isSkipped, editorEmail) {
    const assessment = await this.findById(id);
    if (!assessment) {
      throw new Error('Assessment not found');
    }

    const responses = assessment.responses || {};
    const responseKey = isSkipped ? `${questionId}_skipped` : 
                        perspectiveId ? `${questionId}_${perspectiveId}` : questionId;
    
    responses[responseKey] = value;

    if (comment) {
      responses[`${questionId}_comment`] = comment;
    }

    // Add to edit history if editor provided
    const editHistory = assessment.editHistory || [];
    if (editorEmail) {
      editHistory.push({
        timestamp: new Date().toISOString(),
        editor: editorEmail,
        action: 'progress_saved',
        questionId: questionId,
      });
    }

    const query = `
      UPDATE assessments SET
        responses = $1,
        edit_history = $2
      WHERE id = $3
      RETURNING *
    `;

    try {
      const result = await db.query(query, [
        JSON.stringify(responses),
        JSON.stringify(editHistory),
        id,
      ]);
      return this.mapRowToAssessment(result.rows[0]);
    } catch (error) {
      console.error('Error saving progress:', error);
      throw error;
    }
  }

  /**
   * Delete assessment
   */
  async delete(id) {
    const query = 'DELETE FROM assessments WHERE id = $1';
    try {
      await db.query(query, [id]);
      return true;
    } catch (error) {
      console.error('Error deleting assessment:', error);
      throw error;
    }
  }

  /**
   * Check if assessment exists
   */
  async exists(id) {
    const query = 'SELECT 1 FROM assessments WHERE id = $1';
    try {
      const result = await db.query(query, [id]);
      return result.rows.length > 0;
    } catch (error) {
      console.error('Error checking existence:', error);
      throw error;
    }
  }

  /**
   * Get count of assessments
   */
  async count() {
    const query = 'SELECT COUNT(*) as count FROM assessments';
    try {
      const result = await db.query(query);
      return parseInt(result.rows[0].count);
    } catch (error) {
      console.error('Error counting assessments:', error);
      throw error;
    }
  }

  /**
   * Get assessment statistics
   */
  async getStats() {
    const query = `
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as active,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed
      FROM assessments
    `;
    try {
      const result = await db.query(query);
      return {
        total: parseInt(result.rows[0].total),
        active: parseInt(result.rows[0].active),
        completed: parseInt(result.rows[0].completed)
      };
    } catch (error) {
      console.error('Error getting assessment stats:', error);
      throw error;
    }
  }

  /**
   * Save progress for a single question (auto-save)
   */
  async saveProgress(id, questionId, perspectiveId, value, comment, isSkipped, editorEmail) {
    // First, get the current assessment
    const assessment = await this.findById(id);
    if (!assessment) {
      throw new Error('Assessment not found');
    }

    const responses = assessment.responses || {};

    // Handle skipped questions
    if (isSkipped !== undefined) {
      const skipKey = `${questionId}_skipped`;
      responses[skipKey] = isSkipped;
      
      // If question is being skipped, clear any existing responses
      if (isSkipped) {
        const perspectives = ['current_state', 'future_state', 'technical_pain', 'business_pain'];
        perspectives.forEach(perspective => {
          const responseKey = `${questionId}_${perspective}`;
          delete responses[responseKey];
        });
        const commentKey = `${questionId}_comment`;
        delete responses[commentKey];
      }
    }

    // Save the response (only if not skipped)
    if (questionId && perspectiveId && !responses[`${questionId}_skipped`]) {
      const responseKey = `${questionId}_${perspectiveId}`;
      responses[responseKey] = value;
    }

    // Save comment if provided (only if not skipped)
    if (comment !== undefined && !responses[`${questionId}_skipped`]) {
      const commentKey = `${questionId}_comment`;
      responses[commentKey] = comment;
    }

    // Update the assessment with new responses
    await this.update(id, { responses });

    // Return updated assessment
    return await this.findById(id);
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
      // For backwards compatibility
      lastSaved: row.updated_at,
    };
  }
}

module.exports = new AssessmentRepository();

