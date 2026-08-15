const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

class FileUserStore {
  constructor() {
    this.dataDir = path.join(__dirname, '../../data');
    this.usersFile = path.join(this.dataDir, 'users.json');
    this.sessionsFile = path.join(this.dataDir, 'sessions.json');
    this.assignmentsFile = path.join(this.dataDir, 'assignments.json');
    this.notificationsFile = path.join(this.dataDir, 'notifications.json');
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;
    
    try {
      // Ensure data directory exists
      await fs.mkdir(this.dataDir, { recursive: true });
      
      // Initialize users file with default admin
      try {
        await fs.access(this.usersFile);
      } catch {
        const adminHash = await bcrypt.hash('admin123', 10);
        const defaultUsers = [{
          id: uuidv4(),
          email: 'admin@databricks.com',
          password_hash: adminHash,
          role: 'admin',
          first_name: 'Admin',
          last_name: 'User',
          organization: 'Databricks',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }];
        await fs.writeFile(this.usersFile, JSON.stringify(defaultUsers, null, 2));
        console.log('✅ Created default admin user');
      }
      
      // Initialize other files
      for (const file of [this.sessionsFile, this.assignmentsFile, this.notificationsFile]) {
        try {
          await fs.access(file);
        } catch {
          await fs.writeFile(file, JSON.stringify([], null, 2));
        }
      }
      
      this.initialized = true;
      console.log('✅ File-based user store initialized');
    } catch (error) {
      console.error('❌ Failed to initialize file user store:', error);
      throw error;
    }
  }

  async readFile(filePath) {
    try {
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  async writeFile(filePath, data) {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  }

  // USER OPERATIONS
  async findUserByEmail(email) {
    await this.initialize();
    const users = await this.readFile(this.usersFile);
    return users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  async findUserById(id) {
    await this.initialize();
    const users = await this.readFile(this.usersFile);
    return users.find(u => u.id === id);
  }

  async createUser(userData) {
    await this.initialize();
    const users = await this.readFile(this.usersFile);
    
    // Check if user already exists
    if (users.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
      throw new Error('User already exists');
    }
    
    const newUser = {
      id: uuidv4(),
      email: userData.email,
      password_hash: await bcrypt.hash(userData.password, 10),
      role: userData.role || 'consumer',
      first_name: userData.firstName || '',
      last_name: userData.lastName || '',
      organization: userData.organization || '',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    users.push(newUser);
    await this.writeFile(this.usersFile, users);
    
    // Return without password hash
    const { password_hash, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  async updateUser(id, updates) {
    await this.initialize();
    const users = await this.readFile(this.usersFile);
    const index = users.findIndex(u => u.id === id);
    
    if (index === -1) {
      throw new Error('User not found');
    }
    
    if (updates.password) {
      updates.password_hash = await bcrypt.hash(updates.password, 10);
      delete updates.password;
    }
    
    users[index] = {
      ...users[index],
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    await this.writeFile(this.usersFile, users);
    
    const { password_hash, ...userWithoutPassword } = users[index];
    return userWithoutPassword;
  }

  async deleteUser(id) {
    await this.initialize();
    const users = await this.readFile(this.usersFile);
    const filtered = users.filter(u => u.id !== id);
    
    if (filtered.length === users.length) {
      throw new Error('User not found');
    }
    
    await this.writeFile(this.usersFile, filtered);
    return true;
  }

  async getAllUsers() {
    await this.initialize();
    const users = await this.readFile(this.usersFile);
    return users.map(({ password_hash, ...user }) => user);
  }

  // SESSION OPERATIONS
  async createSession(userId) {
    await this.initialize();
    const sessions = await this.readFile(this.sessionsFile);
    
    const sessionId = uuidv4();
    const newSession = {
      sid: sessionId,
      user_id: userId,
      created_at: new Date().toISOString(),
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
    };
    
    sessions.push(newSession);
    await this.writeFile(this.sessionsFile, sessions);
    
    return sessionId;
  }

  async getSession(sessionId) {
    await this.initialize();
    const sessions = await this.readFile(this.sessionsFile);
    const session = sessions.find(s => s.sid === sessionId);
    
    if (!session) return null;
    
    // Check if expired
    if (new Date(session.expires) < new Date()) {
      await this.deleteSession(sessionId);
      return null;
    }
    
    return session;
  }

  async verifySession(sessionId) {
    await this.initialize();
    const session = await this.getSession(sessionId);
    
    if (!session) return null;
    
    // Get user data
    const user = await this.findUserById(session.user_id);
    
    if (!user || !user.is_active) return null;
    
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      first_name: user.first_name,
      last_name: user.last_name,
      organization: user.organization,
      is_active: user.is_active
    };
  }

  async deleteSession(sessionId) {
    await this.initialize();
    const sessions = await this.readFile(this.sessionsFile);
    const filtered = sessions.filter(s => s.sid !== sessionId);
    await this.writeFile(this.sessionsFile, filtered);
    return true;
  }

  // ASSIGNMENT OPERATIONS
  async createAssignment(assignmentData) {
    await this.initialize();
    const assignments = await this.readFile(this.assignmentsFile);
    
    const newAssignment = {
      id: uuidv4(),
      assessment_id: assignmentData.assessmentId,
      consumer_id: assignmentData.consumerId,
      author_id: assignmentData.authorId,
      assigned_at: new Date().toISOString(),
      status: 'assigned'
    };
    
    assignments.push(newAssignment);
    await this.writeFile(this.assignmentsFile, assignments);
    
    return newAssignment;
  }

  async getAssignmentsByConsumerId(consumerId) {
    await this.initialize();
    const assignments = await this.readFile(this.assignmentsFile);
    return assignments.filter(a => a.consumer_id === consumerId);
  }

  async getAssignmentsByAuthorId(authorId) {
    await this.initialize();
    const assignments = await this.readFile(this.assignmentsFile);
    return assignments.filter(a => a.author_id === authorId);
  }

  async updateAssignmentStatus(assessmentId, status, releaseData = {}) {
    await this.initialize();
    const assignments = await this.readFile(this.assignmentsFile);
    const index = assignments.findIndex(a => a.assessment_id === assessmentId);
    
    if (index === -1) {
      throw new Error('Assignment not found');
    }
    
    assignments[index] = {
      ...assignments[index],
      status,
      ...releaseData
    };
    
    await this.writeFile(this.assignmentsFile, assignments);
    return assignments[index];
  }

  // NOTIFICATION OPERATIONS
  async createNotification(notificationData) {
    await this.initialize();
    const notifications = await this.readFile(this.notificationsFile);
    
    const newNotification = {
      id: uuidv4(),
      user_id: notificationData.userId,
      type: notificationData.type,
      message: notificationData.message,
      link: notificationData.link || null,
      is_read: false,
      created_at: new Date().toISOString()
    };
    
    notifications.push(newNotification);
    await this.writeFile(this.notificationsFile, notifications);
    
    return newNotification;
  }

  async getNotificationsByUserId(userId, unreadOnly = false) {
    await this.initialize();
    const notifications = await this.readFile(this.notificationsFile);
    let filtered = notifications.filter(n => n.user_id === userId);
    
    if (unreadOnly) {
      filtered = filtered.filter(n => !n.is_read);
    }
    
    return filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  async markNotificationAsRead(notificationId) {
    await this.initialize();
    const notifications = await this.readFile(this.notificationsFile);
    const index = notifications.findIndex(n => n.id === notificationId);
    
    if (index === -1) {
      throw new Error('Notification not found');
    }
    
    notifications[index].is_read = true;
    await this.writeFile(this.notificationsFile, notifications);
    
    return notifications[index];
  }

  async deleteNotification(notificationId) {
    await this.initialize();
    const notifications = await this.readFile(this.notificationsFile);
    const filtered = notifications.filter(n => n.id !== notificationId);
    await this.writeFile(this.notificationsFile, filtered);
    return true;
  }
}

// Export singleton instance
module.exports = new FileUserStore();

