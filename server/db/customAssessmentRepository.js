const db = require('./connection');
const DataStore = require('../utils/dataStore');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const typesFileStore = new DataStore(path.join(__dirname, '../../data/custom_assessment_types.json'));
const instancesFileStore = new DataStore(path.join(__dirname, '../../data/dynamic_assessments.json'));

/**
 * Custom & Dynamic Assessment Repository
 * Handles persistent storage for AI-generated assessment frameworks (types)
 * and completed/in-progress assessment instances with dual PostgreSQL + file fallback.
 */
class CustomAssessmentRepository {
  // ==========================================
  // 1. ASSESSMENT TYPES / TEMPLATES (PROMOTION)
  // ==========================================

  async saveAssessmentType(typeData) {
    const id = typeData.id || uuidv4();
    const typeKey = typeData.typeKey || typeData.type_key || (typeData.title || 'custom').toLowerCase().replace(/[^a-z0-9]/g, '_');
    
    const formatted = {
      id,
      typeKey,
      title: typeData.title || 'Custom Assessment',
      subtitle: typeData.subtitle || '',
      description: typeData.description || '',
      icon: typeData.icon || 'FiAward',
      badge: typeData.badge || 'Custom',
      color: typeData.color || '#6366f1',
      framework: typeData.framework || {},
      isPublished: typeData.isPublished !== undefined ? Boolean(typeData.isPublished) : true,
      isPromoted: typeData.isPromoted !== undefined ? Boolean(typeData.isPromoted) : true,
      createdBy: typeData.createdBy || 'system',
      createdAt: typeData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      const query = `
        INSERT INTO custom_assessment_types (
          id, type_key, title, subtitle, description, icon, badge, color,
          framework, is_published, is_promoted, created_by, created_at, updated_at
        ) VALUES (, , , , , , , , , , , , , )
        ON CONFLICT (type_key) DO UPDATE SET
          title = EXCLUDED.title,
          subtitle = EXCLUDED.subtitle,
          description = EXCLUDED.description,
          icon = EXCLUDED.icon,
          badge = EXCLUDED.badge,
          color = EXCLUDED.color,
          framework = EXCLUDED.framework,
          is_published = EXCLUDED.is_published,
          is_promoted = EXCLUDED.is_promoted,
          updated_at = NOW()
        RETURNING *
      `;

      const values = [
        formatted.id,
        formatted.typeKey,
        formatted.title,
        formatted.subtitle,
        formatted.description,
        formatted.icon,
        formatted.badge,
        formatted.color,
        JSON.stringify(formatted.framework),
        formatted.isPublished,
        formatted.isPromoted,
        formatted.createdBy,
        formatted.createdAt,
        formatted.updatedAt
      ];

      const result = await db.query(query, values);
      return this.mapRowToType(result.rows[0]);
    } catch (error) {
      console.warn('PostgreSQL saveAssessmentType fallback to file store:', error.message);
      typesFileStore.set(formatted.typeKey, formatted);
      return formatted;
    }
  }

  async getAllAssessmentTypes(promotedOnly = false) {
    try {
      let query = 'SELECT * FROM custom_assessment_types WHERE is_published = TRUE';
      if (promotedOnly) {
        query += ' AND is_promoted = TRUE';
      }
      query += ' ORDER BY created_at ASC';

      const result = await db.query(query);
      return result.rows.map(r => this.mapRowToType(r));
    } catch (error) {
      console.warn('PostgreSQL getAllAssessmentTypes fallback to file store:', error.message);
      const all = Object.values(typesFileStore.getAll() || {});
      return all.filter(t => t.isPublished !== false && (!promotedOnly || t.isPromoted !== false));
    }
  }

  async findAssessmentTypeByKey(typeKey) {
    try {
      const query = 'SELECT * FROM custom_assessment_types WHERE type_key = ';
      const result = await db.query(query, [typeKey]);
      if (result.rows.length === 0) return null;
      return this.mapRowToType(result.rows[0]);
    } catch (error) {
      console.warn('PostgreSQL findAssessmentTypeByKey fallback to file store:', error.message);
      return typesFileStore.get(typeKey) || null;
    }
  }

  async togglePromotion(idOrKey, isPromoted) {
    try {
      const query = `
        UPDATE custom_assessment_types
        SET is_promoted = , updated_at = NOW()
        WHERE id =  OR type_key = 
        RETURNING *
      `;
      const result = await db.query(query, [isPromoted, idOrKey]);
      if (result.rows.length > 0) {
        return this.mapRowToType(result.rows[0]);
      }
      return null;
    } catch (error) {
      console.warn('PostgreSQL togglePromotion fallback to file store:', error.message);
      const item = typesFileStore.get(idOrKey);
      if (item) {
        item.isPromoted = isPromoted;
        item.updatedAt = new Date().toISOString();
        typesFileStore.set(item.typeKey, item);
        return item;
      }
      return null;
    }
  }

  async deleteAssessmentType(idOrKey) {
    try {
      await db.query('DELETE FROM custom_assessment_types WHERE id =  OR type_key = ', [idOrKey]);
      return true;
    } catch (error) {
      console.warn('PostgreSQL deleteAssessmentType fallback to file store:', error.message);
      typesFileStore.delete(idOrKey);
      return true;
    }
  }

  // ==========================================
  // 2. DYNAMIC ASSESSMENT INSTANCES
  // ==========================================

  async createInstance(instanceData) {
    const id = instanceData.id || uuidv4();
    const formatted = {
      id,
      typeKey: instanceData.typeKey || instanceData.type_key || 'custom',
      customerName: instanceData.customerName || instanceData.customer_name || 'Organization',
      useCase: instanceData.useCase || instanceData.use_case || '',
      contactEmail: instanceData.contactEmail || instanceData.contact_email || '',
      frameworkSnapshot: instanceData.frameworkSnapshot || instanceData.framework_snapshot || instanceData.framework || {},
      responses: instanceData.responses || {},
      scores: instanceData.scores || {},
      totalScore: instanceData.totalScore || instanceData.total_score || 0,
      maxScore: instanceData.maxScore || instanceData.max_score || 0,
      maturityLevel: instanceData.maturityLevel || instanceData.maturity_level || 'Initial',
      status: instanceData.status || 'in_progress',
      aiReport: instanceData.aiReport || instanceData.ai_report || null,
      createdBy: instanceData.createdBy || instanceData.userId || 'user',
      createdAt: instanceData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completedAt: instanceData.completedAt || null
    };

    try {
      const query = `
        INSERT INTO dynamic_assessments (
          id, type_key, customer_name, use_case, contact_email,
          framework_snapshot, responses, scores, total_score, max_score,
          maturity_level, status, ai_report, created_by, created_at, updated_at, completed_at
        ) VALUES (, , , , , , , , , , , , , , , , )
        RETURNING *
      `;

      const values = [
        formatted.id,
        formatted.typeKey,
        formatted.customerName,
        formatted.useCase,
        formatted.contactEmail,
        JSON.stringify(formatted.frameworkSnapshot),
        JSON.stringify(formatted.responses),
        JSON.stringify(formatted.scores),
        formatted.totalScore,
        formatted.maxScore,
        formatted.maturityLevel,
        formatted.status,
        formatted.aiReport ? JSON.stringify(formatted.aiReport) : null,
        formatted.createdBy,
        formatted.createdAt,
        formatted.updatedAt,
        formatted.completedAt
      ];

      const result = await db.query(query, values);
      return this.mapRowToInstance(result.rows[0]);
    } catch (error) {
      console.warn('PostgreSQL createInstance fallback to file store:', error.message);
      instancesFileStore.set(formatted.id, formatted);
      return formatted;
    }
  }

  async updateInstance(id, updateData) {
    const existing = await this.findInstanceById(id);
    if (!existing) return null;

    const merged = {
      ...existing,
      ...updateData,
      id,
      updatedAt: new Date().toISOString()
    };

    try {
      const query = `
        UPDATE dynamic_assessments SET
          customer_name = ,
          use_case = ,
          contact_email = ,
          responses = ,
          scores = ,
          total_score = ,
          max_score = ,
          maturity_level = ,
          status = ,
          ai_report = ,
          completed_at = ,
          updated_at = NOW()
        WHERE id = 
        RETURNING *
      `;

      const values = [
        merged.customerName || merged.customer_name,
        merged.useCase || merged.use_case,
        merged.contactEmail || merged.contact_email,
        JSON.stringify(merged.responses || {}),
        JSON.stringify(merged.scores || {}),
        merged.totalScore || merged.total_score || 0,
        merged.maxScore || merged.max_score || 0,
        merged.maturityLevel || merged.maturity_level || 'Initial',
        merged.status || 'in_progress',
        merged.aiReport || merged.ai_report ? JSON.stringify(merged.aiReport || merged.ai_report) : null,
        merged.completedAt || merged.completed_at,
        id
      ];

      const result = await db.query(query, values);
      return this.mapRowToInstance(result.rows[0]);
    } catch (error) {
      console.warn('PostgreSQL updateInstance fallback to file store:', error.message);
      instancesFileStore.set(id, merged);
      return merged;
    }
  }

  async findInstanceById(id) {
    try {
      const query = 'SELECT * FROM dynamic_assessments WHERE id = ';
      const result = await db.query(query, [id]);
      if (result.rows.length === 0) return null;
      return this.mapRowToInstance(result.rows[0]);
    } catch (error) {
      console.warn('PostgreSQL findInstanceById fallback to file store:', error.message);
      return instancesFileStore.get(id) || null;
    }
  }

  async getAllInstances(filters = {}) {
    const { customerName, typeKey, useCase } = filters;
    try {
      let query = 'SELECT * FROM dynamic_assessments WHERE 1=1';
      const params = [];

      if (customerName) {
        params.push(`%${customerName}%`);
        query += ` AND customer_name ILIKE $${params.length}`;
      }
      if (typeKey) {
        params.push(typeKey);
        query += ` AND type_key = $${params.length}`;
      }
      if (useCase) {
        params.push(`%${useCase}%`);
        query += ` AND use_case ILIKE $${params.length}`;
      }

      query += ' ORDER BY updated_at DESC';

      const result = await db.query(query, params);
      return result.rows.map(r => this.mapRowToInstance(r));
    } catch (error) {
      console.warn('PostgreSQL getAllInstances fallback to file store:', error.message);
      let all = Object.values(instancesFileStore.getAll() || {});
      if (customerName) {
        all = all.filter(i => (i.customerName || '').toLowerCase().includes(customerName.toLowerCase()));
      }
      if (typeKey) {
        all = all.filter(i => i.typeKey === typeKey);
      }
      if (useCase) {
        all = all.filter(i => (i.useCase || '').toLowerCase().includes(useCase.toLowerCase()));
      }
      return all.sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
    }
  }

  async getAllCustomersWithAssessments() {
    try {
      const query = `
        SELECT customer_name, COUNT(*) as count, MAX(updated_at) as last_updated
        FROM dynamic_assessments
        GROUP BY customer_name
        ORDER BY last_updated DESC
      `;
      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      const all = Object.values(instancesFileStore.getAll() || {});
      const customerMap = {};
      all.forEach(inst => {
        const name = inst.customerName || 'Organization';
        if (!customerMap[name]) {
          customerMap[name] = { customer_name: name, count: 0, last_updated: inst.updatedAt || inst.createdAt };
        }
        customerMap[name].count++;
        if (new Date(inst.updatedAt || inst.createdAt) > new Date(customerMap[name].last_updated)) {
          customerMap[name].last_updated = inst.updatedAt || inst.createdAt;
        }
      });
      return Object.values(customerMap);
    }
  }

  // ==========================================
  // 3. ROW MAPPING HELPERS
  // ==========================================

  mapRowToType(row) {
    if (!row) return null;
    return {
      id: row.id,
      typeKey: row.type_key,
      title: row.title,
      subtitle: row.subtitle,
      description: row.description,
      icon: row.icon,
      badge: row.badge,
      color: row.color,
      framework: typeof row.framework === 'string' ? JSON.parse(row.framework) : (row.framework || {}),
      isPublished: row.is_published,
      isPromoted: row.is_promoted,
      createdBy: row.created_by,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  mapRowToInstance(row) {
    if (!row) return null;
    return {
      id: row.id,
      typeKey: row.type_key,
      customerName: row.customer_name,
      useCase: row.use_case,
      contactEmail: row.contact_email,
      frameworkSnapshot: typeof row.framework_snapshot === 'string' ? JSON.parse(row.framework_snapshot) : (row.framework_snapshot || {}),
      responses: typeof row.responses === 'string' ? JSON.parse(row.responses) : (row.responses || {}),
      scores: typeof row.scores === 'string' ? JSON.parse(row.scores) : (row.scores || {}),
      totalScore: parseFloat(row.total_score || 0),
      maxScore: parseFloat(row.max_score || 0),
      maturityLevel: row.maturity_level,
      status: row.status,
      aiReport: typeof row.ai_report === 'string' ? JSON.parse(row.ai_report) : (row.ai_report || null),
      createdBy: row.created_by,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      completedAt: row.completed_at
    };
  }
}

module.exports = new CustomAssessmentRepository();
