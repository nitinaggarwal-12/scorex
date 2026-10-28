const pool = require('./connection');
const fileUserStore = require('./fileUserStore');
const assessmentRepository = require('./assessmentRepository');

async function enrichFileAssignment(assignment) {
  if (!assignment) return null;
  let assessment = null;
  let author = null;
  let consumer = null;
  try {
    assessment = await assessmentRepository.findById(assignment.assessment_id);
  } catch (_) {}
  try {
    if (assignment.author_id) author = await fileUserStore.findUserById(assignment.author_id);
    if (assignment.consumer_id) consumer = await fileUserStore.findUserById(assignment.consumer_id);
  } catch (_) {}
  return {
    ...assignment,
    assessment_name: assessment?.assessmentName || assessment?.assessment_name || 'Enterprise Assessment',
    organization_name: assessment?.organizationName || assessment?.organization_name || 'Enterprise',
    assessment_status: assessment?.status || 'in_progress',
    progress: assessment?.progress ?? 0,
    author_email: author?.email || null,
    author_first_name: author?.first_name || '',
    author_last_name: author?.last_name || '',
    consumer_email: consumer?.email || null,
    consumer_first_name: consumer?.first_name || '',
    consumer_last_name: consumer?.last_name || ''
  };
}

class AssignmentRepository {
  async createAssignment({ assessmentId, authorId, consumerId }) {
    try {
      const query = `
        INSERT INTO assessment_assignments (assessment_id, author_id, consumer_id, status)
        VALUES ($1, $2, $3, 'assigned')
        RETURNING *
      `;
      const result = await pool.query(query, [assessmentId, authorId, consumerId]);
      return result.rows[0];
    } catch (_) {
      return fileUserStore.createAssignment({ assessmentId, authorId, consumerId });
    }
  }

  async getAssignmentById(id) {
    try {
      const query = `
        SELECT aa.*,
          a.assessment_name, a.organization_name, a.status as assessment_status,
          author.email as author_email, author.first_name as author_first_name, author.last_name as author_last_name,
          consumer.email as consumer_email, consumer.first_name as consumer_first_name, consumer.last_name as consumer_last_name
        FROM assessment_assignments aa
        LEFT JOIN assessments a ON aa.assessment_id = a.id
        LEFT JOIN users author ON aa.author_id = author.id
        LEFT JOIN users consumer ON aa.consumer_id = consumer.id
        WHERE aa.id = $1
      `;
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (_) {
      const all = await fileUserStore.getAllAssignments();
      const found = all.find((a) => String(a.id) === String(id));
      return enrichFileAssignment(found);
    }
  }

  async getConsumerAssignments(consumerId, includeUnreleased = false) {
    try {
      let query = `
        SELECT aa.*,
          a.assessment_name, a.organization_name, a.status as assessment_status, a.progress,
          author.email as author_email, author.first_name as author_first_name, author.last_name as author_last_name
        FROM assessment_assignments aa
        LEFT JOIN assessments a ON aa.assessment_id = a.id
        LEFT JOIN users author ON aa.author_id = author.id
        WHERE aa.consumer_id = $1
      `;
      if (!includeUnreleased) {
        query += ` AND (aa.status = 'released' OR aa.status = 'in_progress' OR aa.status = 'assigned')`;
      }
      query += ' ORDER BY aa.assigned_at DESC';
      const result = await pool.query(query, [consumerId]);
      return result.rows;
    } catch (_) {
      const list = await fileUserStore.getAssignmentsByConsumerId(consumerId);
      const filtered = includeUnreleased
        ? list
        : list.filter((a) => ['released', 'in_progress', 'assigned'].includes(a.status));
      return Promise.all(filtered.map(enrichFileAssignment));
    }
  }

  async getAuthorAssignments(authorId) {
    try {
      const query = `
        SELECT aa.*,
          a.assessment_name, a.organization_name, a.status as assessment_status, a.progress,
          consumer.email as consumer_email, consumer.first_name as consumer_first_name, consumer.last_name as consumer_last_name
        FROM assessment_assignments aa
        LEFT JOIN assessments a ON aa.assessment_id = a.id
        LEFT JOIN users consumer ON aa.consumer_id = consumer.id
        WHERE aa.author_id = $1
        ORDER BY aa.assigned_at DESC
      `;
      const result = await pool.query(query, [authorId]);
      return result.rows;
    } catch (_) {
      const list = await fileUserStore.getAssignmentsByAuthorId(authorId);
      return Promise.all(list.map(enrichFileAssignment));
    }
  }

  async canUserAccessAssessment(userId, assessmentId, userRole) {
    if (userRole === 'admin') {
      return { canAccess: true, canView: true, canEdit: true, isReleased: true };
    }
    let assignment = null;
    try {
      const query = `
        SELECT aa.*, a.status as assessment_status
        FROM assessment_assignments aa
        LEFT JOIN assessments a ON aa.assessment_id = a.id
        WHERE aa.assessment_id = $1 AND (aa.author_id = $2 OR aa.consumer_id = $2)
      `;
      const result = await pool.query(query, [assessmentId, userId]);
      assignment = result.rows[0] || null;
    } catch (_) {
      const all = await fileUserStore.getAllAssignments();
      assignment =
        all.find(
          (a) =>
            String(a.assessment_id) === String(assessmentId) &&
            (String(a.author_id) === String(userId) || String(a.consumer_id) === String(userId))
        ) || null;
    }

    if (!assignment) {
      return { canAccess: false, canView: false, canEdit: false, isReleased: false };
    }
    if (assignment.author_id === userId && userRole === 'author') {
      return {
        canAccess: true,
        canView: true,
        canEdit: true,
        isReleased: assignment.status === 'released',
        assignment
      };
    }
    if (assignment.consumer_id === userId && userRole === 'consumer') {
      const canComplete = ['assigned', 'in_progress'].includes(assignment.status);
      const isReleased = assignment.status === 'released';
      return {
        canAccess: canComplete || isReleased,
        canView: isReleased,
        canEdit: canComplete,
        isReleased,
        assignment
      };
    }
    return { canAccess: false, canView: false, canEdit: false, isReleased: false };
  }

  async updateAssignmentStatus(assessmentId, status, userId = null) {
    try {
      let query = 'UPDATE assessment_assignments SET status = $1';
      const values = [status, assessmentId];
      if (status === 'released' && userId) {
        query += ', released_at = CURRENT_TIMESTAMP, released_by = $3 WHERE assessment_id = $2';
        values.push(userId);
      } else if (status === 'submitted') {
        query += ', completed_at = CURRENT_TIMESTAMP WHERE assessment_id = $2';
      } else {
        query += ' WHERE assessment_id = $2';
      }
      query += ' RETURNING *';
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (_) {
      const extra =
        status === 'released' && userId
          ? { released_at: new Date().toISOString(), released_by: userId }
          : status === 'submitted'
          ? { completed_at: new Date().toISOString() }
          : {};
      return fileUserStore.updateAssignmentStatus(assessmentId, status, extra);
    }
  }

  async markInvitationSent(assessmentId) {
    try {
      const query = `
        UPDATE assessment_assignments
        SET invitation_sent = true, invitation_sent_at = CURRENT_TIMESTAMP
        WHERE assessment_id = $1
        RETURNING *
      `;
      const result = await pool.query(query, [assessmentId]);
      return result.rows[0];
    } catch (_) {
      return fileUserStore.updateAssignmentStatus(assessmentId, 'assigned', {
        invitation_sent: true,
        invitation_sent_at: new Date().toISOString()
      });
    }
  }

  async getAssignmentByAssessmentId(assessmentId) {
    try {
      const query = `
        SELECT aa.*,
          a.assessment_name, a.organization_name, a.status as assessment_status,
          author.email as author_email, author.first_name as author_first_name, author.last_name as author_last_name,
          consumer.email as consumer_email, consumer.first_name as consumer_first_name, consumer.last_name as consumer_last_name
        FROM assessment_assignments aa
        LEFT JOIN assessments a ON aa.assessment_id = a.id
        LEFT JOIN users author ON aa.author_id = author.id
        LEFT JOIN users consumer ON aa.consumer_id = consumer.id
        WHERE aa.assessment_id = $1
      `;
      const result = await pool.query(query, [assessmentId]);
      return result.rows[0];
    } catch (_) {
      const all = await fileUserStore.getAllAssignments();
      const found = all.find((a) => String(a.assessment_id) === String(assessmentId));
      return enrichFileAssignment(found);
    }
  }

  async getAllAssignments() {
    try {
      const query = `
        SELECT aa.*,
          a.assessment_name, a.organization_name, a.status as assessment_status, a.progress,
          author.email as author_email, author.first_name as author_first_name, author.last_name as author_last_name,
          consumer.email as consumer_email, consumer.first_name as consumer_first_name, consumer.last_name as consumer_last_name
        FROM assessment_assignments aa
        LEFT JOIN assessments a ON aa.assessment_id = a.id
        LEFT JOIN users author ON aa.author_id = author.id
        LEFT JOIN users consumer ON aa.consumer_id = consumer.id
        ORDER BY aa.assigned_at DESC
      `;
      const result = await pool.query(query);
      return result.rows;
    } catch (_) {
      const all = await fileUserStore.getAllAssignments();
      return Promise.all(all.map(enrichFileAssignment));
    }
  }

  async getAssignmentsByAuthorId(authorId) {
    return this.getAuthorAssignments(authorId);
  }

  async deleteAssignment(id) {
    try {
      const query = 'DELETE FROM assessment_assignments WHERE id = $1';
      await pool.query(query, [id]);
    } catch (_) {
      await fileUserStore.deleteAssignment(id);
    }
  }
}

module.exports = new AssignmentRepository();
