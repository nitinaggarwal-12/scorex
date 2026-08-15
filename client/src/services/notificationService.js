import axios from 'axios';

// Use relative URL in production (Railway), localhost in development
const API_URL = process.env.REACT_APP_API_URL || 
  (window.location.hostname === 'localhost' ? 'http://localhost:5001/api' : '/api');

class NotificationService {
  // Get my notifications
  async getNotifications(unreadOnly = false) {
    try {
      const response = await axios.get(`${API_URL}/notifications`, {
        params: { unreadOnly }
      });
      return { success: true, notifications: response.data.notifications };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to fetch notifications' 
      };
    }
  }

  // Get unread count
  async getUnreadCount() {
    try {
      const response = await axios.get(`${API_URL}/notifications/unread-count`);
      return { success: true, count: response.data.count };
    } catch (error) {
      return { success: false, count: 0 };
    }
  }

  // Mark as read
  async markAsRead(notificationId) {
    try {
      const response = await axios.put(`${API_URL}/notifications/${notificationId}/read`);
      return { success: true, notification: response.data.notification };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to mark as read' 
      };
    }
  }

  // Mark all as read
  async markAllAsRead() {
    try {
      const response = await axios.put(`${API_URL}/notifications/mark-all-read`);
      return { success: true, message: response.data.message };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to mark all as read' 
      };
    }
  }

  // Delete notification
  async deleteNotification(notificationId) {
    try {
      await axios.delete(`${API_URL}/notifications/${notificationId}`);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to delete notification' 
      };
    }
  }
}

export default new NotificationService();

