const express = require('express');
const router = express.Router();
const notificationRepository = require('../db/notificationRepository');
const { requireAuth } = require('../middleware/auth');

// Get my notifications
router.get('/', requireAuth, async (req, res) => {
  try {
    const { unreadOnly } = req.query;
    const notifications = await notificationRepository.getUserNotifications(
      req.user.id,
      unreadOnly === 'true'
    );
    
    res.json({ notifications });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Get unread count
router.get('/unread-count', requireAuth, async (req, res) => {
  try {
    const count = await notificationRepository.getUnreadCount(req.user.id);
    res.json({ count });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ error: 'Failed to fetch unread count' });
  }
});

// Mark as read
router.put('/:id/read', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await notificationRepository.markAsRead(id, req.user.id);
    
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    
    res.json({ success: true, notification });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

// Mark all as read
router.put('/mark-all-read', requireAuth, async (req, res) => {
  try {
    await notificationRepository.markAllAsRead(req.user.id);
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({ error: 'Failed to mark all notifications as read' });
  }
});

// Delete notification
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    await notificationRepository.deleteNotification(id, req.user.id);
    res.json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
});

module.exports = router;


