const pool = require('./connection');

class NotificationRepository {
  // Create notification
  async createNotification({ userId, type, title, message, assessmentId = null }) {
    const query = `
      INSERT INTO notifications (user_id, type, title, message, assessment_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    
    const result = await pool.query(query, [userId, type, title, message, assessmentId]);
    return result.rows[0];
  }

  // Get notifications for user
  async getUserNotifications(userId, unreadOnly = false) {
    let query = 'SELECT * FROM notifications WHERE user_id = $1';
    
    if (unreadOnly) {
      query += ' AND is_read = false';
    }
    
    query += ' ORDER BY created_at DESC LIMIT 50';
    
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  // Get unread count
  async getUnreadCount(userId) {
    const query = 'SELECT COUNT(*) as count FROM notifications WHERE user_id = $1 AND is_read = false';
    const result = await pool.query(query, [userId]);
    return parseInt(result.rows[0].count);
  }

  // Mark as read
  async markAsRead(notificationId, userId) {
    const query = `
      UPDATE notifications 
      SET is_read = true, read_at = CURRENT_TIMESTAMP 
      WHERE id = $1 AND user_id = $2
      RETURNING *
    `;
    
    const result = await pool.query(query, [notificationId, userId]);
    return result.rows[0];
  }

  // Mark all as read
  async markAllAsRead(userId) {
    const query = `
      UPDATE notifications 
      SET is_read = true, read_at = CURRENT_TIMESTAMP 
      WHERE user_id = $1 AND is_read = false
    `;
    
    await pool.query(query, [userId]);
  }

  // Delete notification
  async deleteNotification(notificationId, userId) {
    const query = 'DELETE FROM notifications WHERE id = $1 AND user_id = $2';
    await pool.query(query, [notificationId, userId]);
  }

  // Delete old notifications (cleanup)
  async deleteOldNotifications(daysOld = 90) {
    const query = `
      DELETE FROM notifications 
      WHERE created_at < NOW() - INTERVAL '${daysOld} days'
    `;
    
    await pool.query(query);
  }
}

module.exports = new NotificationRepository();


