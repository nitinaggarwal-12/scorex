import axios from 'axios';

// Use relative URL in production (Railway), localhost in development
const API_URL = process.env.REACT_APP_API_URL || 
  (window.location.hostname === 'localhost' ? 'http://localhost:5001/api' : '/api');

// Add axios interceptor to include session ID in all requests
axios.interceptors.request.use(
  (config) => {
    const sessionId = localStorage.getItem('sessionId');
    console.log('[Axios Interceptor] Session ID:', sessionId);
    console.log('[Axios Interceptor] Request URL:', config.url);
    if (sessionId) {
      config.headers['x-session-id'] = sessionId;
      console.log('[Axios Interceptor] Added x-session-id header');
    } else {
      console.log('[Axios Interceptor] No session ID found in localStorage');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

class AuthService {
  constructor() {
    this.sessionId = localStorage.getItem('sessionId');
    this.user = JSON.parse(localStorage.getItem('user') || 'null');
  }

  // Set session ID in localStorage and axios headers
  setSession(sessionId, user) {
    this.sessionId = sessionId;
    this.user = user;
    localStorage.setItem('sessionId', sessionId);
    localStorage.setItem('user', JSON.stringify(user));
    axios.defaults.headers.common['x-session-id'] = sessionId;
  }

  // Clear session
  clearSession() {
    this.sessionId = null;
    this.user = null;
    localStorage.removeItem('sessionId');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['x-session-id'];
  }

  // Initialize axios headers if session exists
  initializeHeaders() {
    if (this.sessionId) {
      axios.defaults.headers.common['x-session-id'] = this.sessionId;
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
      await axios.post(`${API_URL}/auth/logout`);
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
    return !!sessionId && !!user;
  }

  // Get user role
  getRole() {
    const user = this.getUser();
    return user?.role || null;
  }

  // Check if user is admin
  isAdmin() {
    const user = this.getUser();
    return user?.role === 'admin';
  }

  // Check if user is author
  isAuthor() {
    const user = this.getUser();
    return user?.role === 'author';
  }

  // Check if user is consumer
  isConsumer() {
    const user = this.getUser();
    return user?.role === 'consumer';
  }

  // Check if user is author or admin
  isAuthorOrAdmin() {
    return this.isAdmin() || this.isAuthor();
  }

  // Get current user
  getUser() {
    // Always read from localStorage to get the latest user data (including role switches)
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
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

