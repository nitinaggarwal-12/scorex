-- Databricks Maturity Assessment Database Schema
-- PostgreSQL 14+

-- Create assessments table
CREATE TABLE IF NOT EXISTS assessments (
  id VARCHAR(255) PRIMARY KEY,
  assessment_name VARCHAR(500) NOT NULL,
  assessment_description TEXT,
  organization_name VARCHAR(500),
  contact_email VARCHAR(255),
  industry VARCHAR(255),
  status VARCHAR(50) DEFAULT 'in_progress',
  progress INTEGER DEFAULT 0,
  current_category VARCHAR(100),
  completed_categories JSONB DEFAULT '[]',
  responses JSONB DEFAULT '{}',
  edit_history JSONB DEFAULT '[]',
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on status for faster queries
CREATE INDEX IF NOT EXISTS idx_assessments_status ON assessments(status);

-- Create index on contact_email for user lookups
CREATE INDEX IF NOT EXISTS idx_assessments_email ON assessments(contact_email);

-- Create index on updated_at for sorting
CREATE INDEX IF NOT EXISTS idx_assessments_updated ON assessments(updated_at DESC);

-- Create GIN index on responses for faster JSONB queries
CREATE INDEX IF NOT EXISTS idx_assessments_responses ON assessments USING GIN(responses);

-- Create GIN index on completed_categories
CREATE INDEX IF NOT EXISTS idx_assessments_completed ON assessments USING GIN(completed_categories);

-- Function to update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_assessments_updated_at ON assessments;
CREATE TRIGGER update_assessments_updated_at
  BEFORE UPDATE ON assessments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Optional: Create a view for active assessments with summary stats
CREATE OR REPLACE VIEW active_assessments AS
SELECT 
  id,
  assessment_name,
  organization_name,
  contact_email,
  status,
  progress,
  jsonb_array_length(completed_categories) as pillars_completed,
  started_at,
  updated_at
FROM assessments
WHERE status != 'deleted'
ORDER BY updated_at DESC;

-- Comments for documentation
COMMENT ON TABLE assessments IS 'Stores all Databricks maturity assessments with full response data';
COMMENT ON COLUMN assessments.responses IS 'JSONB object containing all question responses';
COMMENT ON COLUMN assessments.completed_categories IS 'JSONB array of completed pillar IDs';
COMMENT ON COLUMN assessments.edit_history IS 'JSONB array tracking who edited and when';






