const db = require('./connection');
const DataStore = require('../utils/dataStore');
const path = require('path');
const crypto = require('crypto');

const fileStore = new DataStore(path.join(__dirname, '../../data/genai_assessments.json'));

let ownerColumnReady = false;
async function ensureOwnerColumn() {
  if (ownerColumnReady) return;
  try {
    if (db.pool) {
      await db.query('ALTER TABLE genai_assessments ADD COLUMN IF NOT EXISTS owner_id TEXT');
      await db.query('CREATE INDEX IF NOT EXISTS idx_genai_assessments_owner_id ON genai_assessments(owner_id)');
    }
  } catch (e) {
    // Graceful fallback for non-Postgres or SQLite
  }
  ownerColumnReady = true;
}

class GenAIAssessmentRepository {
  async ensureSchema() {
    await ensureOwnerColumn();
  }

  async create(data) {
    const id = data.id || crypto.randomUUID();
    const formatted = {
      id,
      customer_name: data.customerName || data.customer_name || 'Untitled Assessment',
      responses: data.responses || {},
      scores: data.scores || {},
      total_score: Number(data.totalScore ?? data.total_score ?? 0),
      max_score: Number(data.maxScore ?? data.max_score ?? 0),
      maturity_level: data.maturityLevel || data.maturity_level || '',
      completed_at: data.completedAt || data.completed_at || null,
      created_at: data.createdAt || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      owner_id: data.ownerId || data.owner_id || null
    };

    try {
      if (db.pool) {
        await ensureOwnerColumn();
        const result = await db.query(
          `INSERT INTO genai_assessments
           (id, customer_name, responses, scores, total_score, max_score, maturity_level, completed_at, created_at, owner_id)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), $9)
           RETURNING id`,
          [
            formatted.id,
            formatted.customer_name,
            JSON.stringify(formatted.responses),
            JSON.stringify(formatted.scores),
            formatted.total_score,
            formatted.max_score,
            formatted.maturity_level,
            formatted.completed_at,
            formatted.owner_id
          ]
        );
        return { id: result.rows[0].id, ...formatted };
      }
    } catch (err) {
      console.warn('PostgreSQL create failed for GenAI assessment, falling back to file storage:', err.message);
    }

    fileStore.set(formatted.id, formatted);
    return formatted;
  }

  async findById(id) {
    try {
      if (db.pool) {
        await ensureOwnerColumn();
        const result = await db.query('SELECT * FROM genai_assessments WHERE id = $1', [id]);
        if (result && result.rows && result.rows.length > 0) {
          const row = result.rows[0];
          return {
            id: row.id,
            customer_name: row.customer_name,
            customerName: row.customer_name,
            responses: typeof row.responses === 'string' ? JSON.parse(row.responses) : (row.responses || {}),
            scores: typeof row.scores === 'string' ? JSON.parse(row.scores) : (row.scores || {}),
            total_score: row.total_score,
            totalScore: row.total_score,
            max_score: row.max_score,
            maxScore: row.max_score,
            maturity_level: row.maturity_level,
            maturityLevel: row.maturity_level,
            completed_at: row.completed_at,
            completedAt: row.completed_at,
            created_at: row.created_at,
            createdAt: row.created_at,
            owner_id: row.owner_id,
            ownerId: row.owner_id
          };
        }
      }
    } catch (err) {
      // Fallback to file storage
    }

    const item = fileStore.get(id);
    if (!item) return null;
    return {
      ...item,
      customerName: item.customer_name || item.customerName,
      totalScore: item.total_score ?? item.totalScore,
      maxScore: item.max_score ?? item.maxScore,
      maturityLevel: item.maturity_level || item.maturityLevel,
      completedAt: item.completed_at || item.completedAt,
      createdAt: item.created_at || item.createdAt,
      ownerId: item.owner_id || item.ownerId
    };
  }

  async update(id, data) {
    const existing = await this.findById(id);
    if (!existing) return null;

    const updated = {
      ...existing,
      ...data,
      customer_name: data.customerName || data.customer_name || existing.customer_name,
      responses: data.responses || existing.responses,
      scores: data.scores || existing.scores,
      total_score: Number(data.totalScore ?? data.total_score ?? existing.total_score ?? 0),
      max_score: Number(data.maxScore ?? data.max_score ?? existing.max_score ?? 0),
      maturity_level: data.maturityLevel || data.maturity_level || existing.maturity_level,
      completed_at: data.completedAt || data.completed_at || existing.completed_at,
      updated_at: new Date().toISOString()
    };

    try {
      if (db.pool) {
        await db.query(
          `UPDATE genai_assessments
           SET customer_name = $1, responses = $2, scores = $3, total_score = $4,
               max_score = $5, maturity_level = $6, completed_at = $7, updated_at = NOW()
           WHERE id = $8`,
          [
            updated.customer_name,
            JSON.stringify(updated.responses),
            JSON.stringify(updated.scores),
            updated.total_score,
            updated.max_score,
            updated.maturity_level,
            updated.completed_at,
            id
          ]
        );
      }
    } catch (err) {
      console.warn('PostgreSQL update failed for GenAI assessment, falling back to file storage:', err.message);
    }

    fileStore.set(id, updated);
    return updated;
  }

  async findAll(ownerId = null, isAdmin = false) {
    try {
      if (db.pool) {
        await ensureOwnerColumn();
        const params = [];
        let where = '';
        if (!isAdmin && ownerId) {
          params.push(ownerId);
          where = 'WHERE (owner_id = $1 OR owner_id IS NULL OR owner_id IN (\'system\', \'guest_admin\', \'system_unowned\', \'demo_guest\', \'admin_guest\', \'guest\', \'public\'))';
        }
        const result = await db.query(
          `SELECT id, customer_name, total_score, max_score, maturity_level, completed_at, created_at, owner_id
           FROM genai_assessments
           ${where}
           ORDER BY created_at DESC`,
          params
        );
        if (result && result.rows) {
          return result.rows.map(row => ({
            id: row.id,
            customerName: row.customer_name,
            totalScore: row.total_score,
            maxScore: row.max_score,
            maturityLevel: row.maturity_level,
            completedAt: row.completed_at,
            createdAt: row.created_at,
            ownerId: row.owner_id
          }));
        }
      }
    } catch (err) {
      // Fallback
    }

    const all = fileStore.getAll() || {};
    let items = Object.values(all);
    if (!isAdmin && ownerId) {
      const publicOwners = new Set(['system', 'guest_admin', 'system_unowned', 'demo_guest', 'admin_guest', 'guest', 'public']);
      items = items.filter(it => !it.owner_id || String(it.owner_id) === String(ownerId) || publicOwners.has(String(it.owner_id || '')));
    }
    return items.map(item => ({
      id: item.id,
      customerName: item.customer_name || item.customerName,
      totalScore: item.total_score ?? item.totalScore,
      maxScore: item.max_score ?? item.maxScore,
      maturityLevel: item.maturity_level || item.maturityLevel,
      completedAt: item.completed_at || item.completedAt,
      createdAt: item.created_at || item.createdAt,
      ownerId: item.owner_id || item.ownerId
    }));
  }

  async delete(id) {
    try {
      if (db.pool) {
        await db.query('DELETE FROM genai_assessments WHERE id = $1', [id]);
      }
    } catch (err) {
      // Fallback
    }
    fileStore.delete(id);
    return true;
  }
}

module.exports = new GenAIAssessmentRepository();
