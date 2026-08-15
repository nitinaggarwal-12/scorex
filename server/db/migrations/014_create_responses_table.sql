-- Create responses table to store assessment question responses
CREATE TABLE IF NOT EXISTS responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id VARCHAR(255) NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
    question_id VARCHAR(255) NOT NULL,
    response_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(assessment_id, question_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_responses_assessment_id ON responses (assessment_id);
CREATE INDEX IF NOT EXISTS idx_responses_question_id ON responses (question_id);
CREATE INDEX IF NOT EXISTS idx_responses_updated_at ON responses (updated_at);

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_responses_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_update_responses_updated_at
BEFORE UPDATE ON responses
FOR EACH ROW
EXECUTE FUNCTION update_responses_updated_at();

-- Add comment
COMMENT ON TABLE responses IS 'Stores individual question responses for assessments';

