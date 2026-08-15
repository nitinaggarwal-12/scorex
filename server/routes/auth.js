const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const userRepository = require('../db/userRepository');
const fileUserStore = require('../db/fileUserStore');
const { requireAuth, requireAdmin, requireAuthorOrAdmin } = require('../middleware/auth');

// Track file store initialization
let fileStoreInitialized = false;

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    let user = null;
    let sessionId = null;
    
    // Try PostgreSQL first, fall back to file storage
    try {
      user = await userRepository.verifyPassword(email, password);
      if (user) {
        const session = await userRepository.createSession(user.id);
        sessionId = session.id;
      }
    } catch (dbError) {
      console.log('[Login] PostgreSQL not available, using file storage');
      if (!fileStoreInitialized) {
        await fileUserStore.initialize();
        fileStoreInitialized = true;
      }
      user = await fileUserStore.verifyPassword(email, password);
      if (user) {
        sessionId = await fileUserStore.createSession(user.id);
      }
    }
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    res.json({
      success: true,
      sessionId: sessionId,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.first_name,
        lastName: user.last_name,
        organization: user.organization
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Logout
router.post('/logout', requireAuth, async (req, res) => {
  try {
    const sessionId = req.headers['x-session-id'] || req.cookies?.sessionId;
    
    if (sessionId) {
      await userRepository.deleteSession(sessionId);
    }
    
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
});

// Get current user
router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

// Register new user (author/admin only)
router.post('/register', requireAuthorOrAdmin, async (req, res) => {
  try {
    const { email, password, role, firstName, lastName, organization } = req.body;
    
    if (!email || !password || !role) {
      return res.status(400).json({ error: 'Email, password, and role are required' });
    }
    
    // Validate role
    if (!['admin', 'author', 'consumer'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    
    // Only admins can create admin or author users
    if ((role === 'admin' || role === 'author') && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can create admin or author users' });
    }
    
    // Check if user already exists
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }
    
    const user = await userRepository.createUser({
      email,
      password,
      role,
      firstName,
      lastName,
      organization,
      createdBy: req.user.id
    });
    
    res.json({ success: true, user });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Get all users (admin sees all, author sees only consumers)
router.get('/users', requireAuthorOrAdmin, async (req, res) => {
  console.log('[Auth Routes] GET /users - User:', req.user);
  try {
    const { role } = req.query;
    let users;
    
    if (req.user.role === 'admin') {
      // Admin sees all users
      users = await userRepository.getAllUsers(role);
    } else if (req.user.role === 'author') {
      // Author sees only consumers
      users = await userRepository.getUsersByRole('consumer');
    } else {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    console.log('[Auth Routes] Returning', users.length, 'users');
    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get users by role (author/admin only)
router.get('/users/role/:role', requireAuthorOrAdmin, async (req, res) => {
  try {
    const { role } = req.params;
    
    if (!['admin', 'author', 'consumer'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    
    const users = await userRepository.getUsersByRole(role);
    res.json({ users });
  } catch (error) {
    console.error('Get users by role error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Update user (admin only)
router.put('/users/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const user = await userRepository.updateUser(id, updates);
    res.json({ success: true, user });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: error.message || 'Failed to update user' });
  }
});

// Delete user (admin only)
router.delete('/users/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Prevent deleting self
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }
    
    await userRepository.deleteUser(id);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Change password
router.post('/change-password', requireAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password are required' });
    }
    
    // Verify current password
    const user = await userRepository.verifyPassword(req.user.email, currentPassword);
    if (!user) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }
    
    // Update password
    await userRepository.changePassword(req.user.id, newPassword);
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// Get single user details (admin and author can see, consumer can see themselves)
router.get('/users/:userId', requireAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await userRepository.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Check permissions
    if (req.user.role === 'consumer' && req.user.id !== parseInt(userId)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    if (req.user.role === 'author' && user.role !== 'consumer') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Remove sensitive data
    const sanitizedUser = {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      organization: user.organization,
      role: user.role,
      is_active: user.is_active,
      created_at: user.created_at
    };
    
    res.json({ user: sanitizedUser });
  } catch (error) {
    console.error('Get user details error:', error);
    res.status(500).json({ error: 'Failed to fetch user details' });
  }
});

module.exports = router;

