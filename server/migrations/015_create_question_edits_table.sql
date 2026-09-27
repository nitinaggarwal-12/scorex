-- Migration: Create question_edits table for storing edited question content
-- This table stores admin edits to framework questions on a per-assessment basis

CREATE TABLE IF NOT EXISTS question_edits (
  id SERIAL PRIMARY KEY,
  assessment_id VARCHAR(255) NOT NULL,
  question_id VARCHAR(255) NOT NULL,
  original_question_text TEXT,
  edited_question_text TEXT,
  edited_perspectives JSONB, -- Stores all edited perspectives and options
  edited_by VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Unique constraint: one edit per question per assessment
  UNIQUE(assessment_id, question_id),
  
  -- Foreign key to assessments
  FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_question_edits_assessment ON question_edits(assessment_id);
CREATE INDEX IF NOT EXISTS idx_question_edits_question ON question_edits(question_id);
CREATE INDEX IF NOT EXISTS idx_question_edits_updated ON question_edits(updated_at DESC);

-- Create deleted_questions table to track deletions and trigger report regeneration
CREATE TABLE IF NOT EXISTS deleted_questions (
  id SERIAL PRIMARY KEY,
  assessment_id VARCHAR(255) NOT NULL,
  question_id VARCHAR(255) NOT NULL,
  question_text TEXT,
  pillar VARCHAR(255),
  dimension VARCHAR(255),
  deleted_by VARCHAR(255),
  deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  regeneration_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'failed'
  
  -- Foreign key to assessments
  FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE
);

-- Create indexes for deleted_questions
CREATE INDEX IF NOT EXISTS idx_deleted_questions_assessment ON deleted_questions(assessment_id);
CREATE INDEX IF NOT EXISTS idx_deleted_questions_status ON deleted_questions(regeneration_status);
CREATE INDEX IF NOT EXISTS idx_deleted_questions_deleted_at ON deleted_questions(deleted_at DESC);

-- Trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_question_edits_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_update_question_edits_updated_at ON question_edits;
CREATE TRIGGER trigger_update_question_edits_updated_at
  BEFORE UPDATE ON question_edits
  FOR EACH ROW
  EXECUTE FUNCTION update_question_edits_updated_at();

