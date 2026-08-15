-- Migration to add assessment-specific custom question assignments
-- This allows admins to assign custom questions to specific assessments

CREATE TABLE IF NOT EXISTS assessment_custom_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id VARCHAR(255) REFERENCES assessments(id) ON DELETE CASCADE,
    custom_question_id UUID REFERENCES custom_questions(id) ON DELETE CASCADE,
    assigned_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(assessment_id, custom_question_id)
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_assessment_custom_questions_assessment ON assessment_custom_questions (assessment_id);
CREATE INDEX IF NOT EXISTS idx_assessment_custom_questions_question ON assessment_custom_questions (custom_question_id);
CREATE INDEX IF NOT EXISTS idx_assessment_custom_questions_assigned_at ON assessment_custom_questions (assigned_at);

-- Add a field to custom_questions to control default behavior
ALTER TABLE custom_questions ADD COLUMN IF NOT EXISTS apply_to_all_assessments BOOLEAN DEFAULT false;

COMMENT ON COLUMN custom_questions.apply_to_all_assessments IS 'If true, question automatically appears in all assessments. If false, must be explicitly assigned.';

