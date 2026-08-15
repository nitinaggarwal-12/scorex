-- Migration: User Assignments for Assessments
-- Description: Create table to track which users (consumers/authors) are assigned to which assessments

CREATE TABLE IF NOT EXISTS user_assignments (
    id SERIAL PRIMARY KEY,
    assessment_id UUID NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assigned_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('consumer', 'author', 'reviewer')),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'assigned' CHECK (status IN ('assigned', 'in_progress', 'completed', 'cancelled')),
    notes TEXT,
    UNIQUE(assessment_id, user_id, role)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_assignments_assessment ON user_assignments(assessment_id);
CREATE INDEX IF NOT EXISTS idx_user_assignments_user ON user_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_user_assignments_role ON user_assignments(role);
CREATE INDEX IF NOT EXISTS idx_user_assignments_status ON user_assignments(status);

-- Comments for documentation
COMMENT ON TABLE user_assignments IS 'Tracks which users are assigned to complete/review assessments';
COMMENT ON COLUMN user_assignments.role IS 'Role for this assignment: consumer (fill out), author (coordinate), reviewer (validate)';
COMMENT ON COLUMN user_assignments.status IS 'Current status of this assignment';

