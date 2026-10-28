-- Migration 023: Durable PostgreSQL JSONB parity for Subsystem 1 (GE Value Realization)
-- and Subsystem 5 (EU AI Act Statutory Compliance)

CREATE TABLE IF NOT EXISTS ge_value_realization_dossiers (
  id VARCHAR(255) PRIMARY KEY,
  sfdc_account_id VARCHAR(120),
  customer_name VARCHAR(500),
  dossier_payload JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ge_vr_sfdc_account ON ge_value_realization_dossiers(sfdc_account_id);

CREATE TABLE IF NOT EXISTS eu_ai_dossiers (
  id VARCHAR(255) PRIMARY KEY,
  system_name VARCHAR(500),
  dossier_payload JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
