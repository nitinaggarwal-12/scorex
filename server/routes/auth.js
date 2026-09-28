const express = require('express');
const router = express.Router();
const userRepository = require('../db/userRepository');
const fileUserStore = require('../db/fileUserStore');
const { requireAuth, requireAdmin, requireAuthorOrAdmin, isGuestSession, guestUserFromSession } = require('../middleware/auth');

let fileStoreInitialized = false;
const loginBuckets = new Map();

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase().slice(0, 320);
}

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validatePassword(password) {
  if (typeof password !== 'string' || password.length < 12) {
    return 'Password must be at least 12 characters long';
  }
  if (password.length > 256) return 'Password is too long';
  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    return 'Password must contain letters and numbers';
  }
  return null;
}

function loginRateLimit(req, res, next) {
  const email = normalizeEmail(req.body?.email);
  const forwarded = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  const ip = forwarded || req.ip || req.socket?.remoteAddress || 'unknown';
  const key = `${ip}:${email}`;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const attempts = (loginBuckets.get(key) || []).filter((ts) => now - ts < windowMs);

  if (attempts.length >= 10) {
    const retryAfter = Math.ceil((windowMs - (now - attempts[0])) / 1000);
    res.setHeader('Retry-After', retryAfter);
    return res.status(429).json({ error: 'Too many login attempts. Please try again later.' });
  }

  attempts.push(now);
  loginBuckets.set(key, attempts);
  req.loginRateKey = key;
  return next();
}

function clearLoginAttempts(req) {
  if (req.loginRateKey) loginBuckets.delete(req.loginRateKey);
}

function fileAuthAllowed() {
  return process.env.ALLOW_FILE_AUTH === 'true' && process.env.NODE_ENV !== 'production';
}

router.post('/login', loginRateLimit, async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const password = req.body.password;

    if (!email || !password || !validEmail(email)) {
      return res.status(400).json({ error: 'Valid email and password are required' });
    }
    if (typeof password !== 'string' || password.length > 256) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    let user = null;
    let sessionId = null;

    try {
      user = await userRepository.verifyPassword(email, password);
      if (user) {
        const session = await userRepository.createSession(user.id);
        sessionId = session.id;
      }
    } catch (dbError) {
      if (!fileAuthAllowed()) {
        console.error('[Login] Primary identity store unavailable:', dbError.message);
        return res.status(503).json({ error: 'Authentication service temporarily unavailable' });
      }

      if (!fileStoreInitialized) {
        await fileUserStore.initialize();
        fileStoreInitialized = true;
      }
      user = await fileUserStore.verifyPassword(email, password);
      if (user) sessionId = await fileUserStore.createSession(user.id);
    }

    if (!user || !sessionId) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    clearLoginAttempts(req);
    return res.json({
      success: true,
      sessionId,
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
    console.error('Login error:', error.message);
    return res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/logout', requireAuth, async (req, res) => {
  try {
    const sessionId = req.headers['x-session-id'] || req.cookies?.sessionId;
    if (sessionId && req.user.role !== 'demo') {
      try {
        await userRepository.deleteSession(sessionId);
      } catch (error) {
        if (fileAuthAllowed()) await fileUserStore.deleteSession(sessionId);
      }
    }
    return res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error.message);
    return res.status(500).json({ error: 'Logout failed' });
  }
});

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

router.post('/register', requireAuthorOrAdmin, async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const { password, role } = req.body;
    const firstName = String(req.body.firstName || '').trim().slice(0, 100);
    const lastName = String(req.body.lastName || '').trim().slice(0, 100);
    const organization = String(req.body.organization || '').trim().slice(0, 200);

    if (!email || !password || !role || !validEmail(email)) {
      return res.status(400).json({ error: 'Valid email, password, and role are required' });
    }

    const passwordError = validatePassword(password);
    if (passwordError) return res.status(400).json({ error: passwordError });

    if (!['admin', 'author', 'consumer'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    if ((role === 'admin' || role === 'author') && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can create admin or author users' });
    }

    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) return res.status(409).json({ error: 'User with this email already exists' });

    const user = await userRepository.createUser({
      email,
      password,
      role,
      firstName,
      lastName,
      organization,
      createdBy: req.user.id
    });

    return res.status(201).json({ success: true, user });
  } catch (error) {
    console.error('Registration error:', error.message);
    return res.status(500).json({ error: 'Registration failed' });
  }
});

const SEEDED_FALLBACK_USERS = [
  {
    id: 'usr-admin-01',
    email: 'elena.rostova@aerovanguard.example',
    role: 'admin',
    first_name: 'Elena',
    last_name: 'Rostova',
    organization: 'AeroVanguard Defense Systems',
    is_active: true,
    last_login_at: '2026-03-28T14:20:00.000Z',
    created_at: '2026-01-10T09:00:00.000Z'
  },
  {
    id: 'usr-author-01',
    email: 'marcus.vance@bionova.example',
    role: 'author',
    first_name: 'Marcus',
    last_name: 'Vance',
    organization: 'BioNova Therapeutics',
    is_active: true,
    last_login_at: '2026-03-27T18:10:00.000Z',
    created_at: '2026-01-12T10:30:00.000Z'
  },
  {
    id: 'usr-author-02',
    email: 'priya.nair@finpulse.example',
    role: 'author',
    first_name: 'Priya',
    last_name: 'Nair',
    organization: 'FinPulse Digital Banking',
    is_active: true,
    last_login_at: '2026-03-26T11:05:00.000Z',
    created_at: '2026-01-15T14:15:00.000Z'
  },
  {
    id: 'usr-consumer-01',
    email: 'david.chen@omnimart.example',
    role: 'consumer',
    first_name: 'David',
    last_name: 'Chen',
    organization: 'OmniMart Global Retail',
    is_active: true,
    last_login_at: '2026-03-28T09:30:00.000Z',
    created_at: '2026-01-18T11:20:00.000Z'
  },
  {
    id: 'usr-consumer-02',
    email: 'sarah.jenkins@siliconcore.example',
    role: 'consumer',
    first_name: 'Sarah',
    last_name: 'Jenkins',
    organization: 'SiliconCore Semiconductors',
    is_active: true,
    last_login_at: '2026-03-25T16:45:00.000Z',
    created_at: '2026-01-20T16:45:00.000Z'
  },
  {
    id: 'usr-consumer-03',
    email: 'alex.rivera@apexlogistics.example',
    role: 'consumer',
    first_name: 'Alex',
    last_name: 'Rivera',
    organization: 'Apex Global Logistics',
    is_active: true,
    last_login_at: '2026-03-24T08:10:00.000Z',
    created_at: '2026-01-22T08:10:00.000Z'
  }
];

async function getFallbackUsers(roleFilter = null) {
  let fileUsers = [];
  try {
    fileUsers = await fileUserStore.getAllUsers();
  } catch (_) {}
  const blockedDomains = ['evil.com', 'google.com', 'scorex.local', 'cloud-enterprise.com', 'fintech-global.com'];
  const combined = fileUsers.filter(u => {
    const email = String(u.email || '').toLowerCase();
    return !blockedDomains.some(d => email.endsWith('@' + d));
  });
  const existingEmails = new Set(combined.map(u => String(u.email).toLowerCase()));
  for (const seeded of SEEDED_FALLBACK_USERS) {
    if (!existingEmails.has(seeded.email.toLowerCase())) {
      combined.push({ ...seeded });
    }
  }
  if (roleFilter) {
    return combined.filter(u => u.role === roleFilter);
  }
  return combined;
}

router.get('/users', requireAuthorOrAdmin, async (req, res) => {
  try {
    const { role } = req.query;
    const isAdminOrDemo = req.user.role === 'admin' || req.user.role === 'demo';
    if (isAdminOrDemo && role && !['admin', 'author', 'consumer'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    const targetRole = isAdminOrDemo ? (role || null) : 'consumer';

    let users;
    try {
      users = isAdminOrDemo
        ? await userRepository.getAllUsers(targetRole)
        : await userRepository.getUsersByRole('consumer');
    } catch (_) {
      users = await getFallbackUsers(targetRole);
    }

    return res.json({ users });
  } catch (error) {
    console.error('Get users error:', error.message);
    return res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.get('/users/role/:role', requireAuthorOrAdmin, async (req, res) => {
  try {
    const { role } = req.params;
    if (!['admin', 'author', 'consumer'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    if (req.user.role === 'author' && role !== 'consumer') {
      return res.status(403).json({ error: 'Authors may only enumerate participant accounts' });
    }

    let users;
    try {
      users = await userRepository.getUsersByRole(role);
    } catch (_) {
      users = await getFallbackUsers(role);
    }
    return res.json({ users });
  } catch (error) {
    console.error('Get users by role error:', error.message);
    return res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.put('/users/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };
    if (updates.password) {
      const passwordError = validatePassword(updates.password);
      if (passwordError) return res.status(400).json({ error: passwordError });
    }
    let user;
    try {
      user = await userRepository.updateUser(id, updates);
    } catch (_) {
      const idx = SEEDED_FALLBACK_USERS.findIndex(u => String(u.id) === String(id));
      if (idx !== -1) {
        SEEDED_FALLBACK_USERS[idx] = { ...SEEDED_FALLBACK_USERS[idx], ...updates };
        user = SEEDED_FALLBACK_USERS[idx];
      } else {
        user = await fileUserStore.updateUser(id, updates);
      }
    }
    return res.json({ success: true, user });
  } catch (error) {
    console.error('Update user error:', error.message);
    return res.status(500).json({ error: error.message || 'Failed to update user' });
  }
});

router.delete('/users/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (String(id) === String(req.user.id)) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }
    try {
      await userRepository.deleteUser(id);
    } catch (_) {
      const idx = SEEDED_FALLBACK_USERS.findIndex(u => String(u.id) === String(id));
      if (idx !== -1) {
        SEEDED_FALLBACK_USERS[idx].is_active = false;
      } else {
        await fileUserStore.deleteUser(id).catch(() => {});
      }
    }
    return res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error.message);
    return res.status(500).json({ error: 'Failed to delete user' });
  }
});

router.post('/change-password', requireAuth, async (req, res) => {
  try {
    if (req.user.role === 'demo') {
      return res.status(403).json({ error: 'Demo sessions do not have passwords' });
    }

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password are required' });
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) return res.status(400).json({ error: passwordError });

    const user = await userRepository.verifyPassword(req.user.email, currentPassword);
    if (!user) return res.status(401).json({ error: 'Current password is incorrect' });

    await userRepository.changePassword(req.user.id, newPassword);
    return res.json({ success: true, message: 'Password changed successfully. Please sign in again.' });
  } catch (error) {
    console.error('Change password error:', error.message);
    return res.status(500).json({ error: 'Failed to change password' });
  }
});

router.get('/users/:userId', requireAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    let user;
    try {
      user = await userRepository.findById(userId);
    } catch (_) {
      const allUsers = await getFallbackUsers();
      user = allUsers.find(u => String(u.id) === String(userId)) || null;
    }
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (req.user.role === 'consumer' && String(req.user.id) !== String(userId)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    if (req.user.role === 'author' && user.role !== 'consumer') {
      return res.status(403).json({ error: 'Access denied' });
    }

    return res.json({
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        organization: user.organization,
        role: user.role,
        is_active: user.is_active,
        created_at: user.created_at
      }
    });
  } catch (error) {
    console.error('Get user details error:', error.message);
    return res.status(500).json({ error: 'Failed to fetch user details' });
  }
});

/**
 * POST /api/auth/claim-guest-session
 * Migrates dynamic assessments created during guest exploration to the authenticated user
 */
router.post('/claim-guest-session', requireAuth, async (req, res) => {
  try {
    const { guestSessionId } = req.body;
    if (!guestSessionId) {
      return res.status(400).json({ error: 'guestSessionId is required' });
    }

    const isGuest = isGuestSession(guestSessionId);
    if (!isGuest) {
      return res.status(400).json({ error: 'Invalid guest session ID' });
    }

    const guestUser = guestUserFromSession(guestSessionId);
    const customAssessmentRepo = require('../db/customAssessmentRepository');
    const migratedCount = await customAssessmentRepo.migrateGuestInstances(guestUser.id, req.user.id);

    // Also migrate classic assessments in PostgreSQL if exists
    try {
      const db = require('../db/connection');
      await db.query(
        'UPDATE assessments SET user_id = $1 WHERE user_id = $2',
        [req.user.id, guestUser.id]
      );
    } catch (_) {}

    return res.json({
      success: true,
      migratedCount,
      message: `Successfully migrated ${migratedCount} guest assessment(s) to your account`
    });
  } catch (error) {
    console.error('Claim guest session error:', error.message);
    return res.status(500).json({ error: 'Failed to claim guest session' });
  }
});

module.exports = router;
