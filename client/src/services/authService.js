import axios from 'axios';

// Use relative URL in production (Railway), localhost in development
const API_URL = process.env.REACT_APP_API_URL ||
  (window.location.hostname === 'localhost' ? 'http://localhost:5001/api' : '/api');

const SECURE_GUEST_SESSION_RE = /^guest_[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function createUuid() {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }

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

function ensureBrowserDemoSession() {
  let sessionId = localStorage.getItem('sessionId');

  if (isGuestLikeSession(sessionId) && !SECURE_GUEST_SESSION_RE.test(sessionId || '')) {
    localStorage.removeItem('sessionId');
    localStorage.removeItem('user');
    sessionId = null;
  }

  if (!sessionId) {
    sessionId = `guest_${createUuid()}`;
    const user = buildDemoUser();
    localStorage.setItem('sessionId', sessionId);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('scorex_guest_auth', 'true');
    window.dispatchEvent(new CustomEvent('scorex-auth-changed', { detail: { user } }));
  }

  return sessionId;
}

// All browser API traffic gets a secure identity. Anonymous visitors receive a least-privileged
// demo UUID, never an administrator identity. The server independently validates the UUID format.
axios.interceptors.request.use(
  (config) => {
    const requestUrl = String(config.url || '');
    const isApiRequest = requestUrl.startsWith('/api') || requestUrl.startsWith(API_URL);
    const isLoginRequest = requestUrl.includes('/auth/login');

    let sessionId = localStorage.getItem('sessionId');
    if (isApiRequest && !isLoginRequest && !sessionId) {
      sessionId = ensureBrowserDemoSession();
    }

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
    window.dispatchEvent(new CustomEvent('scorex-auth-changed', { detail: { user: normalizedUser } }));

    return { sessionId: normalizedSessionId, user: normalizedUser };
  }

  createGuestSession() {
    const sessionId = `guest_${createUuid()}`;
    const user = buildDemoUser();
    this.setSession(sessionId, user);
    localStorage.setItem('scorex_guest_auth', 'true');
    return user;
  }

  clearSession() {
    this.sessionId = null;
    this.user = null;
    localStorage.removeItem('sessionId');
    localStorage.removeItem('user');
    localStorage.removeItem('scorex_guest_auth');
    delete axios.defaults.headers.common['x-session-id'];
    window.dispatchEvent(new CustomEvent('scorex-auth-changed', { detail: { user: null } }));
  }

  initializeHeaders() {
    const sessionId = localStorage.getItem('sessionId');

    if (isGuestLikeSession(sessionId) && !SECURE_GUEST_SESSION_RE.test(sessionId || '')) {
      this.clearSession();
      return;
    }

    if (sessionId) {
      this.sessionId = sessionId;
      axios.defaults.headers.common['x-session-id'] = sessionId;
    }
  }

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

  async logout() {
    try {
      if (!SECURE_GUEST_SESSION_RE.test(localStorage.getItem('sessionId') || '')) {
        await axios.post(`${API_URL}/auth/logout`);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearSession();
    }
  }

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

  async register(userData) {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      return { success: true, user: response.data.user };
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Registration failed');
    }
  }

  async registerUser(userData) {
    return this.register(userData);
  }

  isAuthenticated() {
    const sessionId = localStorage.getItem('sessionId');
    const user = this.getUser();

    if (isGuestLikeSession(sessionId) && !SECURE_GUEST_SESSION_RE.test(sessionId || '')) {
      return false;
    }

    return !!sessionId && !!user;
  }

  getRole() {
    return this.getUser()?.role || null;
  }

  isAdmin() {
    return this.getUser()?.role === 'admin';
  }

  isAuthor() {
    return this.getUser()?.role === 'author';
  }

  isConsumer() {
    return this.getUser()?.role === 'consumer';
  }

  isDemo() {
    return this.getUser()?.role === 'demo';
  }

  isAuthorOrAdmin() {
    return this.isAdmin() || this.isAuthor();
  }

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

  async getUsers(role = null) {
    return this.getAllUsers(role);
  }

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

const authService = new AuthService();
authService.initializeHeaders();

export default authService;
