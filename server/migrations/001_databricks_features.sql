-- Migration: Databricks Features Database Schema
-- Purpose: Store curated Databricks features for dynamic recommendation generation
-- Date: October 30, 2025

-- Table 1: Databricks Features (Core)
CREATE TABLE IF NOT EXISTS databricks_features (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    category VARCHAR(100) NOT NULL, -- platform, data_engineering, analytics, ml, genai, operational
    short_description TEXT NOT NULL,
    detailed_description TEXT,
    release_date DATE,
    ga_quarter VARCHAR(20), -- e.g., "Q2 2024"
    ga_status VARCHAR(20) DEFAULT 'GA', -- GA, Preview, Private Preview, Deprecated
    documentation_url TEXT,
    is_serverless BOOLEAN DEFAULT false,
    requires_unity_catalog BOOLEAN DEFAULT false,
    complexity_weeks INTEGER, -- 1-12 weeks typical implementation time
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table 2: Feature Technical Details
CREATE TABLE IF NOT EXISTS feature_technical_details (
    id SERIAL PRIMARY KEY,
    feature_id INTEGER REFERENCES databricks_features(id) ON DELETE CASCADE,
    api_endpoint TEXT, -- e.g., "POST /api/2.0/serving-endpoints"
    api_method VARCHAR(10), -- GET, POST, PUT, DELETE
    configuration_example TEXT, -- Code snippet or JSON config
    terraform_resource VARCHAR(255), -- e.g., "databricks_sql_warehouse"
    databricks_cli_command TEXT,
    prerequisites TEXT, -- Required permissions, infrastructure
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table 3: Feature Benefits
CREATE TABLE IF NOT EXISTS feature_benefits (
    id SERIAL PRIMARY KEY,
    feature_id INTEGER REFERENCES databricks_features(id) ON DELETE CASCADE,
    benefit_type VARCHAR(50), -- performance, cost, security, productivity, compliance
    benefit_description TEXT NOT NULL,
    quantifiable_impact VARCHAR(255), -- e.g., "2-5× faster queries", "30% cost reduction"
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table 4: Feature Use Cases
CREATE TABLE IF NOT EXISTS feature_use_cases (
    id SERIAL PRIMARY KEY,
    feature_id INTEGER REFERENCES databricks_features(id) ON DELETE CASCADE,
    use_case_title VARCHAR(255) NOT NULL,
    use_case_description TEXT NOT NULL,
    industry VARCHAR(100), -- Financial Services, Healthcare, Retail, etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table 5: Feature to Pain Point Mapping
CREATE TABLE IF NOT EXISTS feature_pain_point_mapping (
    id SERIAL PRIMARY KEY,
    feature_id INTEGER REFERENCES databricks_features(id) ON DELETE CASCADE,
    pain_point_value VARCHAR(255) NOT NULL, -- e.g., "no_version_control", "slow_queries"
    pillar VARCHAR(100), -- platform_governance, data_engineering, etc.
    recommendation_text TEXT, -- Specific recommendation for this pain point
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(feature_id, pain_point_value)
);

-- Table 6: Feature Implementation Steps
CREATE TABLE IF NOT EXISTS feature_implementation_steps (
    id SERIAL PRIMARY KEY,
    feature_id INTEGER REFERENCES databricks_features(id) ON DELETE CASCADE,
    step_order INTEGER NOT NULL,
    step_title VARCHAR(255) NOT NULL,
    step_description TEXT NOT NULL,
    estimated_hours INTEGER, -- Time estimate for this step
    skill_required VARCHAR(255), -- e.g., "Platform Engineering", "MLOps", "Security"
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table 7: Feature Version History
CREATE TABLE IF NOT EXISTS feature_version_history (
    id SERIAL PRIMARY KEY,
    feature_id INTEGER REFERENCES databricks_features(id) ON DELETE CASCADE,
    version VARCHAR(50) NOT NULL,
    release_date DATE NOT NULL,
    change_description TEXT,
    breaking_changes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_features_category ON databricks_features(category);
CREATE INDEX idx_features_ga_status ON databricks_features(ga_status);
CREATE INDEX idx_pain_point_pillar ON feature_pain_point_mapping(pillar);
CREATE INDEX idx_pain_point_value ON feature_pain_point_mapping(pain_point_value);
CREATE INDEX idx_feature_benefits_type ON feature_benefits(benefit_type);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for databricks_features
CREATE TRIGGER update_databricks_features_updated_at 
    BEFORE UPDATE ON databricks_features 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE databricks_features IS 'Core Databricks features curated from official release notes';
COMMENT ON TABLE feature_technical_details IS 'API endpoints, configuration examples, and technical implementation details';
COMMENT ON TABLE feature_benefits IS 'Quantifiable benefits and business value of features';
COMMENT ON TABLE feature_use_cases IS 'Real-world use cases and industry-specific applications';
COMMENT ON TABLE feature_pain_point_mapping IS 'Mapping of features to customer pain points for intelligent recommendations';
COMMENT ON TABLE feature_implementation_steps IS 'Step-by-step implementation guide for engineering teams';
COMMENT ON TABLE feature_version_history IS 'Track feature updates and breaking changes over time';






