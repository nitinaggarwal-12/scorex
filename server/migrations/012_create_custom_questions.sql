-- Migration to add custom questions functionality
CREATE TABLE IF NOT EXISTS custom_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_text TEXT NOT NULL,
    pillar VARCHAR(100) NOT NULL, -- 'all' for cross-pillar, or specific pillar name
    category VARCHAR(255), -- optional: specific category within pillar
    weight DECIMAL(3,2) DEFAULT 1.00, -- contribution weight to scoring (0.5 = 50%, 1.0 = 100%)
    maturity_level_1 TEXT, -- Level 1 description
    maturity_level_2 TEXT, -- Level 2 description
    maturity_level_3 TEXT, -- Level 3 description
    maturity_level_4 TEXT, -- Level 4 description
    maturity_level_5 TEXT, -- Level 5 description
    is_active BOOLEAN DEFAULT true,
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_custom_questions_pillar ON custom_questions (pillar);
CREATE INDEX IF NOT EXISTS idx_custom_questions_active ON custom_questions (is_active);
CREATE INDEX IF NOT EXISTS idx_custom_questions_created_at ON custom_questions (created_at);

-- Update trigger for updated_at
CREATE OR REPLACE FUNCTION update_custom_questions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_custom_questions_updated_at
    BEFORE UPDATE ON custom_questions
    FOR EACH ROW
    EXECUTE FUNCTION update_custom_questions_updated_at();
