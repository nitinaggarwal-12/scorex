-- Migration 018: Custom Assessment Types and Dynamic Assessments
-- Supports prompt-generated assessments with Gemini 3.7 and promotion to assessment types

-- Table 1: Custom Assessment Types (Templates promoted to the navigation & registry)
CREATE TABLE IF NOT EXISTS custom_assessment_types (
  id VARCHAR(255) PRIMARY KEY,
  type_key VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(500) NOT NULL,
  subtitle VARCHAR(500),
  description TEXT,
  icon VARCHAR(100) DEFAULT 'FiAward',
  badge VARCHAR(100) DEFAULT 'Custom',
  color VARCHAR(50) DEFAULT '#6366f1',
  framework JSONB NOT NULL,
  is_published BOOLEAN DEFAULT TRUE,
  is_promoted BOOLEAN DEFAULT TRUE,
  created_by VARCHAR(255) DEFAULT 'system',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_custom_assessment_types_key ON custom_assessment_types(type_key);
CREATE INDEX IF NOT EXISTS idx_custom_assessment_types_promoted ON custom_assessment_types(is_promoted);

-- Table 2: Dynamic Assessment Instances (Actual completed / in-progress assessments)
CREATE TABLE IF NOT EXISTS dynamic_assessments (
  id VARCHAR(255) PRIMARY KEY,
  type_key VARCHAR(255) NOT NULL,
  customer_name VARCHAR(500) NOT NULL,
  use_case VARCHAR(500),
  contact_email VARCHAR(255),
  framework_snapshot JSONB NOT NULL,
  responses JSONB DEFAULT '{}',
  scores JSONB DEFAULT '{}',
  total_score NUMERIC(5,2) DEFAULT 0,
  max_score NUMERIC(5,2) DEFAULT 0,
  maturity_level VARCHAR(100) DEFAULT 'Initial',
  status VARCHAR(50) DEFAULT 'in_progress',
  ai_report JSONB DEFAULT NULL,
  created_by VARCHAR(255) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_dynamic_assessments_type ON dynamic_assessments(type_key);
CREATE INDEX IF NOT EXISTS idx_dynamic_assessments_customer ON dynamic_assessments(customer_name);
CREATE INDEX IF NOT EXISTS idx_dynamic_assessments_status ON dynamic_assessments(status);
CREATE INDEX IF NOT EXISTS idx_dynamic_assessments_created ON dynamic_assessments(created_at DESC);
