const pool = require('./connection');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const SALT_ROUNDS = 10;

class UserRepository {
  // Create a new user
  async createUser({ email, password, role, firstName, lastName, organization, createdBy }) {
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    
    const query = `
      INSERT INTO users (email, password_hash, role, first_name, last_name, organization, created_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, email, role, first_name, last_name, organization, is_active, created_at
    `;
    
    const values = [email, passwordHash, role, firstName, lastName, organization, createdBy];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Find user by email
  async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  // Find user by ID
  async findById(id) {
    const query = 'SELECT id, email, role, first_name, last_name, organization, is_active, created_at FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // Verify password
  async verifyPassword(email, password) {
    const query = 'SELECT * FROM users WHERE email = $1 AND is_active = true';
    const result = await pool.query(query, [email]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    const user = result.rows[0];
    const isValid = await bcrypt.compare(password, user.password_hash);
    
    if (!isValid) {
      return null;
    }
    
    // Update last login
    await pool.query('UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = $1', [user.id]);
    
    // Return user without password hash
    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // Create session
  async createSession(userId) {
    const sessionId = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    
    const query = 'INSERT INTO sessions (id, user_id, expires_at) VALUES ($1, $2, $3) RETURNING *';
    const result = await pool.query(query, [sessionId, userId, expiresAt]);
    return result.rows[0];
  }

  // Verify session
  async verifySession(sessionId) {
    console.log('[UserRepo] Verifying session:', sessionId);
    const query = `
      SELECT u.id, u.email, u.role, u.first_name, u.last_name, u.organization, u.is_active
      FROM sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.id = $1 AND s.expires_at > NOW() AND u.is_active = true
    `;
    const result = await pool.query(query, [sessionId]);
    console.log('[UserRepo] Session query result:', result.rows[0]);
    return result.rows[0];
  }

  // Delete session
  async deleteSession(sessionId) {
    const query = 'DELETE FROM sessions WHERE id = $1';
    await pool.query(query, [sessionId]);
  }

  // Get all users (admin only)
  async getAllUsers(role = null) {
    let query = 'SELECT id, email, role, first_name, last_name, organization, is_active, last_login_at, created_at FROM users';
    const values = [];
    
    if (role) {
      query += ' WHERE role = $1';
      values.push(role);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const result = await pool.query(query, values);
    return result.rows;
  }

  // Get users by role
  async getUsersByRole(role) {
    const query = `
      SELECT id, email, role, first_name, last_name, organization, is_active, last_login_at, created_at
      FROM users
      WHERE role = $1 AND is_active = true
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query, [role]);
    return result.rows;
  }

  // Update user
  async updateUser(id, updates) {
    const allowedFields = ['first_name', 'last_name', 'organization', 'is_active', 'role'];
    const fields = [];
    const values = [];
    let paramIndex = 1;
    
    // Handle password separately
    if (updates.password) {
      const passwordHash = await bcrypt.hash(updates.password, SALT_ROUNDS);
      fields.push(`password_hash = $${paramIndex}`);
      values.push(passwordHash);
      paramIndex++;
    }
    
    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        fields.push(`${key} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    }
    
    if (fields.length === 0) {
      throw new Error('No valid fields to update');
    }
    
    values.push(id);
    const query = `
      UPDATE users
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING id, email, role, first_name, last_name, organization, is_active, created_at
    `;
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Change password
  async changePassword(userId, newPassword) {
    const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    const query = 'UPDATE users SET password_hash = $1 WHERE id = $2';
    await pool.query(query, [passwordHash, userId]);
  }

  // Delete user (soft delete by setting is_active = false)
  async deleteUser(id) {
    const query = 'UPDATE users SET is_active = false WHERE id = $1';
    await pool.query(query, [id]);
  }

  // Clean up expired sessions
  async cleanupExpiredSessions() {
    const query = 'DELETE FROM sessions WHERE expires_at < NOW()';
    await pool.query(query);
  }
}

module.exports = new UserRepository();

