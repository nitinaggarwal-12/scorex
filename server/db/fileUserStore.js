const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { scheduleStateFileSync, resolveDataDir } = require('../utils/durableGcsPersistence');

class FileUserStore {
  constructor() {
    this.initializedDir = null;
  }

  get dataDir() {
    return resolveDataDir();
  }

  get usersFile() {
    return path.join(this.dataDir, 'users.json');
  }

  get sessionsFile() {
    return path.join(this.dataDir, 'sessions.json');
  }

  get assignmentsFile() {
    return path.join(this.dataDir, 'assignments.json');
  }

  get notificationsFile() {
    return path.join(this.dataDir, 'notifications.json');
  }

  async initialize() {
    const activeDir = this.dataDir;
    if (this.initializedDir === activeDir) return;

    try {
      await fs.mkdir(activeDir, { recursive: true });

      // Never manufacture a default administrator. If the primary database is unavailable,
      // file authentication begins empty and therefore fails closed until an authorized user
      // is explicitly provisioned through a controlled setup path.
      for (const file of [this.usersFile, this.sessionsFile, this.assignmentsFile, this.notificationsFile]) {
        try {
          await fs.access(file);
        } catch {
          await fs.writeFile(file, JSON.stringify([], null, 2), { mode: 0o600 });
        }
      }

      this.initializedDir = activeDir;
      console.log('File-based user store initialized without default credentials');
    } catch (error) {
      console.error('Failed to initialize file user store:', error.message);
      throw error;
    }
  }

  async readFile(filePath) {
    try {
      const data = await fs.readFile(filePath, 'utf8');
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  async writeFile(filePath, data) {
    const serialized = JSON.stringify(data, null, 2);
    const tmpPath = `${filePath}.${process.pid}.${Date.now()}.sync.tmp`;
    await fs.writeFile(tmpPath, serialized, { encoding: 'utf8', mode: 0o600 });
    await fs.rename(tmpPath, filePath);
    scheduleStateFileSync(filePath, serialized);
  }

  // USER OPERATIONS
  async findUserByEmail(email) {
    await this.initialize();
    const users = await this.readFile(this.usersFile);
    return users.find(u => String(u.email || '').toLowerCase() === String(email || '').toLowerCase());
  }

  async findUserById(id) {
    await this.initialize();
    const users = await this.readFile(this.usersFile);
    return users.find(u => String(u.id) === String(id));
  }

  async verifyPassword(email, password) {
    await this.initialize();
    const user = await this.findUserByEmail(email);
    if (!user || user.is_active === false || !user.password_hash) return null;
    const valid = await bcrypt.compare(String(password || ''), user.password_hash);
    if (!valid) return null;
    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async changePassword(userId, newPassword) {
    return this.updateUser(userId, { password: newPassword });
  }

  async createUser(userData) {
    await this.initialize();
    const users = await this.readFile(this.usersFile);

    if (users.some(u => String(u.email || '').toLowerCase() === String(userData.email || '').toLowerCase())) {
      throw new Error('User already exists');
    }

    const newUser = {
      id: uuidv4(),
      email: userData.email,
      password_hash: await bcrypt.hash(userData.password, 12),
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

    const { password_hash, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  async updateUser(id, updates) {
    await this.initialize();
    const users = await this.readFile(this.usersFile);
    const index = users.findIndex(u => String(u.id) === String(id));

    if (index === -1) {
      throw new Error('User not found');
    }

    const nextUpdates = { ...updates };
    if (nextUpdates.password) {
      nextUpdates.password_hash = await bcrypt.hash(nextUpdates.password, 12);
      delete nextUpdates.password;
    }

    users[index] = {
      ...users[index],
      ...nextUpdates,
      updated_at: new Date().toISOString()
    };

    await this.writeFile(this.usersFile, users);

    const { password_hash, ...userWithoutPassword } = users[index];
    return userWithoutPassword;
  }

  async deleteUser(id) {
    await this.initialize();
    const users = await this.readFile(this.usersFile);
    const filtered = users.filter(u => String(u.id) !== String(id));

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
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
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
    return assignments.filter(a => String(a.consumer_id) === String(consumerId));
  }

  async getAssignmentsByAuthorId(authorId) {
    await this.initialize();
    const assignments = await this.readFile(this.assignmentsFile);
    return assignments.filter(a => String(a.author_id) === String(authorId));
  }

  async getAllAssignments() {
    await this.initialize();
    return this.readFile(this.assignmentsFile);
  }

  async updateAssignmentStatus(assessmentId, status, releaseData = {}) {
    await this.initialize();
    const assignments = await this.readFile(this.assignmentsFile);
    const index = assignments.findIndex(a => String(a.assessment_id) === String(assessmentId));

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

  async deleteAssignment(id) {
    await this.initialize();
    const assignments = await this.readFile(this.assignmentsFile);
    const filtered = assignments.filter(a => String(a.id) !== String(id));
    if (filtered.length === assignments.length) return false;
    await this.writeFile(this.assignmentsFile, filtered);
    return true;
  }

  // NOTIFICATION OPERATIONS
  async createNotification(notificationData) {
    await this.initialize();
    const notifications = await this.readFile(this.notificationsFile);

    const newNotification = {
      id: uuidv4(),
      user_id: notificationData.userId,
      type: notificationData.type,
      title: notificationData.title || 'Assessment Notification',
      message: notificationData.message,
      assessment_id: notificationData.assessmentId || null,
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
    let filtered = notifications.filter(n => String(n.user_id) === String(userId));

    if (unreadOnly) {
      filtered = filtered.filter(n => !n.is_read);
    }

    return filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  async markNotificationAsRead(notificationId, userId = null) {
    await this.initialize();
    const notifications = await this.readFile(this.notificationsFile);
    const index = notifications.findIndex(n =>
      String(n.id) === String(notificationId) &&
      (userId === null || String(n.user_id) === String(userId))
    );

    if (index === -1) {
      return null;
    }

    notifications[index].is_read = true;
    notifications[index].read_at = new Date().toISOString();
    await this.writeFile(this.notificationsFile, notifications);

    return notifications[index];
  }

  async markAllNotificationsAsRead(userId) {
    await this.initialize();
    const notifications = await this.readFile(this.notificationsFile);
    let count = 0;
    const now = new Date().toISOString();
    for (const item of notifications) {
      if (String(item.user_id) === String(userId) && !item.is_read) {
        item.is_read = true;
        item.read_at = now;
        count += 1;
      }
    }
    if (count > 0) {
      await this.writeFile(this.notificationsFile, notifications);
    }
    return count;
  }

  async deleteNotification(notificationId, userId = null) {
    await this.initialize();
    const notifications = await this.readFile(this.notificationsFile);
    const filtered = notifications.filter(n => !(
      String(n.id) === String(notificationId) &&
      (userId === null || String(n.user_id) === String(userId))
    ));
    if (filtered.length === notifications.length) return false;
    await this.writeFile(this.notificationsFile, filtered);
    return true;
  }
}

module.exports = new FileUserStore();
