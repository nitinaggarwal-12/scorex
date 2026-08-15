-- Migration: Create assessments table for storing assessment data in PostgreSQL
-- This enables the assignment system to work with PostgreSQL-backed assessments

CREATE TABLE IF NOT EXISTS assessments (
  id VARCHAR(255) PRIMARY KEY,
  assessment_name VARCHAR(500) NOT NULL DEFAULT 'Untitled Assessment',
  assessment_description TEXT DEFAULT '',
  organization_name VARCHAR(500) DEFAULT 'Not specified',
  contact_email VARCHAR(255) DEFAULT '',
  industry VARCHAR(255) DEFAULT 'Not specified',
  status VARCHAR(50) DEFAULT 'in_progress',
  progress INTEGER DEFAULT 0,
  current_category VARCHAR(255) DEFAULT '',
  completed_categories JSONB DEFAULT '[]'::jsonb,
  responses JSONB DEFAULT '{}'::jsonb,
  edit_history JSONB DEFAULT '[]'::jsonb,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_assessments_status ON assessments(status);
CREATE INDEX IF NOT EXISTS idx_assessments_created_at ON assessments(created_at);
CREATE INDEX IF NOT EXISTS idx_assessments_organization ON assessments(organization_name);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_assessments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_assessments_updated_at
  BEFORE UPDATE ON assessments
  FOR EACH ROW
  EXECUTE FUNCTION update_assessments_updated_at();

-- Comment on table and columns
COMMENT ON TABLE assessments IS 'Stores Databricks maturity assessments';
COMMENT ON COLUMN assessments.id IS 'Unique assessment identifier (UUID)';
COMMENT ON COLUMN assessments.status IS 'Assessment status: in_progress, submitted, completed, assigned';
COMMENT ON COLUMN assessments.responses IS 'JSON object containing all assessment responses';
COMMENT ON COLUMN assessments.completed_categories IS 'Array of completed pillar/category IDs';
COMMENT ON COLUMN assessments.edit_history IS 'Array of edit history entries';


