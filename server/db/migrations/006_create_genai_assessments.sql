-- Gen AI Readiness Assessments Table
CREATE TABLE IF NOT EXISTS genai_assessments (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    responses JSONB NOT NULL,
    scores JSONB NOT NULL,
    total_score INTEGER NOT NULL,
    max_score INTEGER NOT NULL,
    maturity_level VARCHAR(50),
    completed_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_genai_assessments_customer ON genai_assessments(customer_name);
CREATE INDEX IF NOT EXISTS idx_genai_assessments_created ON genai_assessments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_genai_assessments_maturity ON genai_assessments(maturity_level);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_genai_assessments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER genai_assessments_updated_at_trigger
    BEFORE UPDATE ON genai_assessments
    FOR EACH ROW
    EXECUTE FUNCTION update_genai_assessments_updated_at();


