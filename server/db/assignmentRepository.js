const pool = require('./connection');

class AssignmentRepository {
  // Create assignment (author assigns assessment to consumer)
  async createAssignment({ assessmentId, authorId, consumerId }) {
    const query = `
      INSERT INTO assessment_assignments (assessment_id, author_id, consumer_id, status)
      VALUES ($1, $2, $3, 'assigned')
      RETURNING *
    `;
    
    const result = await pool.query(query, [assessmentId, authorId, consumerId]);
    return result.rows[0];
  }

  // Get assignment by ID
  async getAssignmentById(id) {
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
  }

  // Get assignments for a consumer (only their own assessments)
  async getConsumerAssignments(consumerId, includeUnreleased = false) {
    let query = `
      SELECT aa.*, 
        a.assessment_name, a.organization_name, a.status as assessment_status, a.progress,
        author.email as author_email, author.first_name as author_first_name, author.last_name as author_last_name
      FROM assessment_assignments aa
      LEFT JOIN assessments a ON aa.assessment_id = a.id
      LEFT JOIN users author ON aa.author_id = author.id
      WHERE aa.consumer_id = $1
    `;
    
    // If not including unreleased, only show released or in-progress assessments
    if (!includeUnreleased) {
      query += ` AND (aa.status = 'released' OR aa.status = 'in_progress' OR aa.status = 'assigned')`;
    }
    
    query += ' ORDER BY aa.assigned_at DESC';
    
    const result = await pool.query(query, [consumerId]);
    return result.rows;
  }

  // Get assignments for an author (all assessments they created)
  async getAuthorAssignments(authorId) {
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
  }

  // Check if user can access assessment
  async canUserAccessAssessment(userId, assessmentId, userRole) {
    // Admins can access everything
    if (userRole === 'admin') {
      return { canAccess: true, canView: true, canEdit: true, isReleased: true };
    }

    const query = `
      SELECT aa.*, a.status as assessment_status
      FROM assessment_assignments aa
      LEFT JOIN assessments a ON aa.assessment_id = a.id
      WHERE aa.assessment_id = $1 AND (aa.author_id = $2 OR aa.consumer_id = $2)
    `;
    
    const result = await pool.query(query, [assessmentId, userId]);
    
    if (result.rows.length === 0) {
      return { canAccess: false, canView: false, canEdit: false, isReleased: false };
    }
    
    const assignment = result.rows[0];
    
    // Authors can always access their assigned assessments
    if (assignment.author_id === userId && userRole === 'author') {
      return { 
        canAccess: true, 
        canView: true, 
        canEdit: true, 
        isReleased: assignment.status === 'released',
        assignment 
      };
    }
    
    // Consumers can only access if:
    // 1. Assessment is assigned/in_progress (they can complete it)
    // 2. Assessment is released (they can view results)
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

  // Update assignment status
  async updateAssignmentStatus(assessmentId, status, userId = null) {
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
  }

  // Mark invitation as sent
  async markInvitationSent(assessmentId) {
    const query = `
      UPDATE assessment_assignments 
      SET invitation_sent = true, invitation_sent_at = CURRENT_TIMESTAMP
      WHERE assessment_id = $1
      RETURNING *
    `;
    
    const result = await pool.query(query, [assessmentId]);
    return result.rows[0];
  }

  // Get assignment by assessment ID
  async getAssignmentByAssessmentId(assessmentId) {
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
  }

  // Get all assignments (admin only)
  async getAllAssignments() {
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
  }

  // Get assignments by author ID
  async getAssignmentsByAuthorId(authorId) {
    const query = `
      SELECT aa.*, 
        a.assessment_name, a.organization_name, a.status as assessment_status, a.progress,
        author.email as author_email, author.first_name as author_first_name, author.last_name as author_last_name,
        consumer.email as consumer_email, consumer.first_name as consumer_first_name, consumer.last_name as consumer_last_name
      FROM assessment_assignments aa
      LEFT JOIN assessments a ON aa.assessment_id = a.id
      LEFT JOIN users author ON aa.author_id = author.id
      LEFT JOIN users consumer ON aa.consumer_id = consumer.id
      WHERE aa.author_id = $1
      ORDER BY aa.assigned_at DESC
    `;
    
    const result = await pool.query(query, [authorId]);
    return result.rows;
  }

  // Delete assignment
  async deleteAssignment(id) {
    const query = 'DELETE FROM assessment_assignments WHERE id = $1';
    await pool.query(query, [id]);
  }
}

module.exports = new AssignmentRepository();

