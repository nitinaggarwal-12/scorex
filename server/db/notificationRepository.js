const pool = require('./connection');
const fileUserStore = require('./fileUserStore');

class NotificationRepository {
  async createNotification({ userId, type, title, message, assessmentId = null }) {
    try {
      const query = `
        INSERT INTO notifications (user_id, type, title, message, assessment_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;
      const result = await pool.query(query, [userId, type, title, message, assessmentId]);
      return result.rows[0];
    } catch (_) {
      return fileUserStore.createNotification({
        userId,
        type,
        title: title || type || 'Notification',
        message,
        assessmentId
      });
    }
  }

  async getUserNotifications(userId, unreadOnly = false) {
    try {
      let query = 'SELECT * FROM notifications WHERE user_id = $1';
      if (unreadOnly) query += ' AND is_read = false';
      query += ' ORDER BY created_at DESC LIMIT 50';
      const result = await pool.query(query, [userId]);
      return result.rows;
    } catch (_) {
      return fileUserStore.getNotificationsByUserId(userId, unreadOnly);
    }
  }

  async getUnreadCount(userId) {
    try {
      const query = 'SELECT COUNT(*) as count FROM notifications WHERE user_id = $1 AND is_read = false';
      const result = await pool.query(query, [userId]);
      return parseInt(result.rows[0].count, 10) || 0;
    } catch (_) {
      const unread = await fileUserStore.getNotificationsByUserId(userId, true);
      return unread.length;
    }
  }

  async markAsRead(notificationId, userId) {
    try {
      const query = `
        UPDATE notifications
        SET is_read = true, read_at = CURRENT_TIMESTAMP
        WHERE id = $1 AND user_id = $2
        RETURNING *
      `;
      const result = await pool.query(query, [notificationId, userId]);
      return result.rows[0];
    } catch (_) {
      return fileUserStore.markNotificationAsRead(notificationId, userId);
    }
  }

  async markAllAsRead(userId) {
    try {
      const query = `
        UPDATE notifications
        SET is_read = true, read_at = CURRENT_TIMESTAMP
        WHERE user_id = $1 AND is_read = false
      `;
      await pool.query(query, [userId]);
    } catch (_) {
      await fileUserStore.markAllNotificationsAsRead(userId);
    }
  }

  async deleteNotification(notificationId, userId) {
    try {
      const query = 'DELETE FROM notifications WHERE id = $1 AND user_id = $2';
      await pool.query(query, [notificationId, userId]);
    } catch (_) {
      await fileUserStore.deleteNotification(notificationId, userId);
    }
  }

  async deleteOldNotifications(daysOld = 90) {
    try {
      const query = `
        DELETE FROM notifications
        WHERE created_at < NOW() - INTERVAL '${Number(daysOld) || 90} days'
      `;
      await pool.query(query);
    } catch (_) {}
  }
}

module.exports = new NotificationRepository();
