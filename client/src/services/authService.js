import axios from 'axios';

// Use relative URL in production (Railway), localhost in development
const API_URL = process.env.REACT_APP_API_URL ||
  (window.location.hostname === 'localhost' ? 'http://localhost:5001/api' : '/api');

const SECURE_GUEST_SESSION_RE = /^guest_[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function createUuid() {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }

  // RFC 4122 v4 fallback for older browsers.
  const bytes = new Uint8Array(16);
  window.crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function isGuestLikeSession(sessionId) {
  return typeof sessionId === 'string' && (
    sessionId.startsWith('guest_') ||
    sessionId.startsWith('guest-') ||
    sessionId.startsWith('admin_guest_')
  );
}

function buildDemoUser(existingUser = {}) {
  return {
    ...existingUser,
    id: existingUser.id?.startsWith('demo_') ? existingUser.id : `demo_${createUuid()}`,
    email: 'demo.guest@scorex.local',
    name: 'Demo Guest',
    firstName: 'Demo',
    lastName: 'Guest',
    role: 'demo',
    organization: 'ScoreX Demo Workspace',
    isDemo: true,
    testMode: false
  };
}

// Add axios interceptor to include session ID in all requests.
axios.interceptors.request.use(
  (config) => {
    const sessionId = localStorage.getItem('sessionId');
    if (sessionId) {
      config.headers['x-session-id'] = sessionId;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

class AuthService {
  constructor() {
    this.sessionId = localStorage.getItem('sessionId');
    this.user = this.readStoredUser();
  }

  readStoredUser() {
    try {
      const value = localStorage.getItem('user');
      return value ? JSON.parse(value) : null;
    } catch (error) {
      localStorage.removeItem('user');
      return null;
    }
  }

  // Set session ID in localStorage and axios headers.
  // Any guest-like session is normalized to a cryptographically random, least-privileged demo session.
  setSession(sessionId, user = {}) {
    let normalizedSessionId = sessionId;
    let normalizedUser = user;

    if (isGuestLikeSession(sessionId) || user?.isDemo || user?.role === 'demo') {
      if (!SECURE_GUEST_SESSION_RE.test(sessionId || '')) {
        normalizedSessionId = `guest_${createUuid()}`;
      }
      normalizedUser = buildDemoUser(user);

      // Preserve backwards compatibility for callers that keep using their original object reference.
      if (user && typeof user === 'object') {
        Object.keys(user).forEach((key) => delete user[key]);
        Object.assign(user, normalizedUser);
      }
    }

    this.sessionId = normalizedSessionId;
    this.user = normalizedUser;
    localStorage.setItem('sessionId', normalizedSessionId);
    localStorage.setItem('user', JSON.stringify(normalizedUser));
    axios.defaults.headers.common['x-session-id'] = normalizedSessionId;

    return { sessionId: normalizedSessionId, user: normalizedUser };
  }

  createGuestSession() {
    const sessionId = `guest_${createUuid()}`;
    const user = buildDemoUser();
    this.setSession(sessionId, user);
    localStorage.setItem('scorex_guest_auth', 'true');
    return user;
  }

  // Clear session
  clearSession() {
    this.sessionId = null;
    this.user = null;
    localStorage.removeItem('sessionId');
    localStorage.removeItem('user');
    localStorage.removeItem('scorex_guest_auth');
    delete axios.defaults.headers.common['x-session-id'];
  }

  // Initialize axios headers if session exists
  initializeHeaders() {
    const sessionId = localStorage.getItem('sessionId');

    // Remove legacy guest sessions that previously granted admin access.
    if (isGuestLikeSession(sessionId) && !SECURE_GUEST_SESSION_RE.test(sessionId || '')) {
      this.clearSession();
      return;
    }

    if (sessionId) {
      this.sessionId = sessionId;
      axios.defaults.headers.common['x-session-id'] = sessionId;
    }
  }

  // Login
  async login(email, password) {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { sessionId, user } = response.data;
      this.setSession(sessionId, user);
      return { success: true, user };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed'
      };
    }
  }

  // Logout
  async logout() {
    try {
      // Demo sessions are local-only and do not have a persisted server session to delete.
      if (!SECURE_GUEST_SESSION_RE.test(localStorage.getItem('sessionId') || '')) {
        await axios.post(`${API_URL}/auth/logout`);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearSession();
    }
  }

  // Get current user
  async getCurrentUser() {
    try {
      const response = await axios.get(`${API_URL}/auth/me`);
      const user = response.data.user;
      this.user = user;
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (error) {
      this.clearSession();
      return null;
    }
  }

  // Register new user (author/admin only)
  async register(userData) {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      return { success: true, user: response.data.user };
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Registration failed');
    }
  }

  // Alias for backwards compatibility
  async registerUser(userData) {
    return this.register(userData);
  }

  // Check if user is authenticated
  isAuthenticated() {
    const sessionId = localStorage.getItem('sessionId');
    const user = this.getUser();

    if (isGuestLikeSession(sessionId) && !SECURE_GUEST_SESSION_RE.test(sessionId || '')) {
      return false;
    }

    return !!sessionId && !!user;
  }

  // Get user role
  getRole() {
    return this.getUser()?.role || null;
  }

  // Check if user is admin
  isAdmin() {
    return this.getUser()?.role === 'admin';
  }

  // Check if user is author
  isAuthor() {
    return this.getUser()?.role === 'author';
  }

  // Check if user is consumer
  isConsumer() {
    return this.getUser()?.role === 'consumer';
  }

  isDemo() {
    return this.getUser()?.role === 'demo';
  }

  // Check if user is author or admin
  isAuthorOrAdmin() {
    return this.isAdmin() || this.isAuthor();
  }

  // Get current user
  getUser() {
    const sessionId = localStorage.getItem('sessionId');
    let user = this.readStoredUser();

    if (SECURE_GUEST_SESSION_RE.test(sessionId || '')) {
      user = buildDemoUser(user || {});
      this.user = user;
      localStorage.setItem('user', JSON.stringify(user));
    }

    return user;
  }

  // Get all users (admin only)
  async getAllUsers(role = null) {
    try {
      const params = role ? { role } : {};
      const response = await axios.get(`${API_URL}/auth/users`, { params });
      return { success: true, users: response.data.users };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch users'
      };
    }
  }

  // Alias for getAllUsers
  async getUsers(role = null) {
    return this.getAllUsers(role);
  }

  // Get users by role
  async getUsersByRole(role) {
    try {
      const response = await axios.get(`${API_URL}/auth/users/role/${role}`);
      return { success: true, users: response.data.users };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch users'
      };
    }
  }

  // Change password
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await axios.post(`${API_URL}/auth/change-password`, {
        currentPassword,
        newPassword
      });
      return { success: true, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to change password'
      };
    }
  }
}

// Export singleton instance
const authService = new AuthService();
authService.initializeHeaders();

export default authService;
