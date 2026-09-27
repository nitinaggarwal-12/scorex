-- Schema Enhancements for Collaboration, Benchmarking, ROI, and Feedback
-- Run this SQL to add new tables and columns to existing PostgreSQL database

-- ============================================
-- 1. ASSESSMENT COLLABORATION
-- ============================================

-- Add collaboration fields to assessments table
ALTER TABLE assessments ADD COLUMN IF NOT EXISTS shared_with JSONB DEFAULT '[]';
ALTER TABLE assessments ADD COLUMN IF NOT EXISTS collaborators JSONB DEFAULT '[]';
ALTER TABLE assessments ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT FALSE;
ALTER TABLE assessments ADD COLUMN IF NOT EXISTS share_token VARCHAR(255) UNIQUE;

-- Comments on questions
CREATE TABLE IF NOT EXISTS assessment_comments (
  id SERIAL PRIMARY KEY,
  assessment_id VARCHAR(255) NOT NULL,
  question_id VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  user_name VARCHAR(255),
  comment TEXT NOT NULL,
  mentioned_users JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_resolved BOOLEAN DEFAULT FALSE,
  parent_comment_id INTEGER REFERENCES assessment_comments(id)
);

CREATE INDEX IF NOT EXISTS idx_comments_assessment ON assessment_comments(assessment_id);
CREATE INDEX IF NOT EXISTS idx_comments_question ON assessment_comments(question_id);

-- ============================================
-- 2. BENCHMARKING DATA
-- ============================================

-- Industry benchmarks (aggregate data)
CREATE TABLE IF NOT EXISTS industry_benchmarks (
  id SERIAL PRIMARY KEY,
  industry VARCHAR(255) NOT NULL,
  company_size VARCHAR(50), -- small, medium, large, enterprise
  pillar_id VARCHAR(255) NOT NULL,
  avg_current_maturity DECIMAL(3,2),
  avg_target_maturity DECIMAL(3,2),
  avg_gap DECIMAL(3,2),
  percentile_25 DECIMAL(3,2),
  percentile_50 DECIMAL(3,2),
  percentile_75 DECIMAL(3,2),
  sample_size INTEGER,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_benchmarks_industry ON industry_benchmarks(industry);
CREATE INDEX IF NOT EXISTS idx_benchmarks_pillar ON industry_benchmarks(pillar_id);

-- ============================================
-- 3. ROI CALCULATIONS
-- ============================================

-- ROI templates for recommendations
CREATE TABLE IF NOT EXISTS roi_templates (
  id SERIAL PRIMARY KEY,
  recommendation_type VARCHAR(255) NOT NULL,
  pillar_id VARCHAR(255) NOT NULL,
  estimated_cost_min INTEGER, -- in USD
  estimated_cost_max INTEGER,
  estimated_time_weeks INTEGER,
  time_savings_percent DECIMAL(5,2),
  cost_savings_percent DECIMAL(5,2),
  risk_reduction_score INTEGER, -- 1-10
  business_value_score INTEGER, -- 1-10
  prerequisites JSONB DEFAULT '[]',
  databricks_features JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User-specific ROI calculations
CREATE TABLE IF NOT EXISTS assessment_roi (
  id SERIAL PRIMARY KEY,
  assessment_id VARCHAR(255) NOT NULL,
  recommendation_id VARCHAR(255) NOT NULL,
  estimated_cost INTEGER,
  estimated_time_weeks INTEGER,
  expected_savings INTEGER,
  priority_score INTEGER, -- 1-100
  status VARCHAR(50) DEFAULT 'planned', -- planned, in-progress, completed
  assigned_to VARCHAR(255),
  due_date DATE,
  completed_at TIMESTAMP,
  actual_cost INTEGER,
  actual_savings INTEGER,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_roi_assessment ON assessment_roi(assessment_id);

-- ============================================
-- 4. PROGRESS TRACKING
-- ============================================

-- Action items from recommendations
CREATE TABLE IF NOT EXISTS action_items (
  id SERIAL PRIMARY KEY,
  assessment_id VARCHAR(255) NOT NULL,
  recommendation_id VARCHAR(255) NOT NULL,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  pillar_id VARCHAR(255),
  effort_level VARCHAR(50), -- low, medium, high
  impact_level VARCHAR(50), -- low, medium, high
  priority INTEGER, -- 1-10
  status VARCHAR(50) DEFAULT 'not_started', -- not_started, in_progress, blocked, completed
  assigned_to VARCHAR(255),
  assigned_to_name VARCHAR(255),
  due_date DATE,
  completed_at TIMESTAMP,
  blocked_reason TEXT,
  dependencies JSONB DEFAULT '[]',
  tags JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_actions_assessment ON action_items(assessment_id);
CREATE INDEX IF NOT EXISTS idx_actions_status ON action_items(status);
CREATE INDEX IF NOT EXISTS idx_actions_assigned ON action_items(assigned_to);

-- ============================================
-- 5. SCHEDULED REASSESSMENTS
-- ============================================

-- Reassessment schedule
CREATE TABLE IF NOT EXISTS reassessment_schedule (
  id SERIAL PRIMARY KEY,
  assessment_id VARCHAR(255) NOT NULL,
  frequency VARCHAR(50) NOT NULL, -- quarterly, biannual, annual
  next_due_date DATE NOT NULL,
  reminder_sent BOOLEAN DEFAULT FALSE,
  reminder_sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_schedule_assessment ON reassessment_schedule(assessment_id);
CREATE INDEX IF NOT EXISTS idx_schedule_due_date ON reassessment_schedule(next_due_date);

-- ============================================
-- 6. USER FEEDBACK
-- ============================================

-- Feedback on recommendations
CREATE TABLE IF NOT EXISTS recommendation_feedback (
  id SERIAL PRIMARY KEY,
  assessment_id VARCHAR(255) NOT NULL,
  recommendation_id VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5), -- 1-5 stars
  is_helpful BOOLEAN,
  feedback_text TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_rec_feedback_assessment ON recommendation_feedback(assessment_id);
CREATE INDEX IF NOT EXISTS idx_rec_feedback_recommendation ON recommendation_feedback(recommendation_id);

-- Feedback on questions
CREATE TABLE IF NOT EXISTS question_feedback (
  id SERIAL PRIMARY KEY,
  question_id VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  feedback_type VARCHAR(50) NOT NULL, -- unclear, irrelevant, missing_option, other
  feedback_text TEXT,
  suggested_improvement TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_question_feedback_question ON question_feedback(question_id);

-- Bug reports
CREATE TABLE IF NOT EXISTS bug_reports (
  id SERIAL PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL,
  user_name VARCHAR(255),
  page_url TEXT,
  bug_description TEXT NOT NULL,
  steps_to_reproduce TEXT,
  expected_behavior TEXT,
  actual_behavior TEXT,
  browser_info TEXT,
  screenshot_url TEXT,
  status VARCHAR(50) DEFAULT 'open', -- open, in_progress, resolved, closed
  priority VARCHAR(50) DEFAULT 'medium', -- low, medium, high, critical
  assigned_to VARCHAR(255),
  resolved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_bugs_status ON bug_reports(status);
CREATE INDEX IF NOT EXISTS idx_bugs_priority ON bug_reports(priority);

-- Feature requests
CREATE TABLE IF NOT EXISTS feature_requests (
  id SERIAL PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL,
  user_name VARCHAR(255),
  feature_title VARCHAR(500) NOT NULL,
  feature_description TEXT NOT NULL,
  use_case TEXT,
  priority_vote INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'submitted', -- submitted, under_review, planned, in_progress, completed, rejected
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_features_status ON feature_requests(status);
CREATE INDEX IF NOT EXISTS idx_features_votes ON feature_requests(priority_vote DESC);

-- ============================================
-- 7. HISTORICAL TRACKING
-- ============================================

-- Assessment history for trend analysis
CREATE TABLE IF NOT EXISTS assessment_history (
  id SERIAL PRIMARY KEY,
  original_assessment_id VARCHAR(255) NOT NULL,
  snapshot_assessment_id VARCHAR(255) NOT NULL,
  snapshot_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  overall_maturity DECIMAL(3,2),
  overall_gap DECIMAL(3,2),
  pillar_scores JSONB,
  completed_actions INTEGER DEFAULT 0,
  notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_history_original ON assessment_history(original_assessment_id);
CREATE INDEX IF NOT EXISTS idx_history_date ON assessment_history(snapshot_date);

-- ============================================
-- 8. NOTIFICATIONS
-- ============================================

-- User notifications
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL,
  notification_type VARCHAR(100) NOT NULL, -- comment, mention, reminder, action_assigned, etc.
  title VARCHAR(500) NOT NULL,
  message TEXT,
  link_url TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_email);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);

-- ============================================
-- GRANT PERMISSIONS (adjust as needed)
-- ============================================

-- Grant permissions to your database user
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_db_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_db_user;



