-- User Management and Identity System
-- Migration: 006_user_management

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'author', 'consumer')),
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  organization VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER REFERENCES users(id)
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);

-- Create assessment assignments table
CREATE TABLE IF NOT EXISTS assessment_assignments (
  id SERIAL PRIMARY KEY,
  assessment_id VARCHAR(255) REFERENCES assessments(id) ON DELETE CASCADE,
  author_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  consumer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  released_at TIMESTAMP,
  released_by INTEGER REFERENCES users(id),
  status VARCHAR(50) DEFAULT 'assigned' CHECK (status IN ('assigned', 'in_progress', 'submitted', 'released')),
  invitation_sent BOOLEAN DEFAULT false,
  invitation_sent_at TIMESTAMP,
  UNIQUE(assessment_id, consumer_id)
);

-- Create indexes for assessment assignments
CREATE INDEX IF NOT EXISTS idx_assignments_author ON assessment_assignments(author_id);
CREATE INDEX IF NOT EXISTS idx_assignments_consumer ON assessment_assignments(consumer_id);
CREATE INDEX IF NOT EXISTS idx_assignments_status ON assessment_assignments(status);
CREATE INDEX IF NOT EXISTS idx_assignments_assessment ON assessment_assignments(assessment_id);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(100) NOT NULL,
  title VARCHAR(500) NOT NULL,
  message TEXT NOT NULL,
  assessment_id VARCHAR(255) REFERENCES assessments(id) ON DELETE CASCADE,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  read_at TIMESTAMP
);

-- Create indexes for notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at DESC);

-- Create sessions table for authentication
CREATE TABLE IF NOT EXISTS sessions (
  id VARCHAR(255) PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on user_id for sessions
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);

-- Add trigger for users updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add user_id to assessments table if not exists
ALTER TABLE assessments ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id);
CREATE INDEX IF NOT EXISTS idx_assessments_user ON assessments(user_id);

-- Comments for documentation
COMMENT ON TABLE users IS 'Stores all users with their roles and authentication info';
COMMENT ON TABLE assessment_assignments IS 'Links assessments to consumers with author tracking';
COMMENT ON TABLE notifications IS 'Stores notifications for assessment events';
COMMENT ON TABLE sessions IS 'Stores active user sessions for authentication';
COMMENT ON COLUMN users.role IS 'User role: admin (full access), author (assign/release), consumer (complete assessments)';
COMMENT ON COLUMN assessment_assignments.status IS 'Assignment status: assigned, in_progress, submitted, released';

