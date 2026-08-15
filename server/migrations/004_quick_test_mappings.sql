-- Migration 004: Quick Test Mappings for Immediate Validation
-- Purpose: Add pain point mappings for the most common assessment pain points
-- Date: October 30, 2025

-- This is a quick test to validate the database integration works end-to-end
-- Comprehensive mappings will follow in migration 005

-- ==============================================================================
-- PLATFORM GOVERNANCE (Most Common Pain Points)
-- ==============================================================================

-- Unity Catalog / Access Requests → Platform pain points
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT id, 'poor_isolation', 'platform_governance', 'Deploy Unity Catalog with workspace isolation and ABAC for fine-grained access control' 
FROM databricks_features WHERE name = 'Access Requests in Unity Catalog'
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT id, 'manual_provisioning', 'platform_governance', 'Enable self-service access requests in Unity Catalog to reduce provisioning time by 80%' 
FROM databricks_features WHERE name = 'Access Requests in Unity Catalog'
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT id, 'inconsistent_configs', 'platform_governance', 'Standardize access patterns with Unity Catalog access request workflows' 
FROM databricks_features WHERE name = 'Access Requests in Unity Catalog'
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Data Classification → Compliance & Security
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT id, 'compliance_risks', 'platform_governance', 'Automate PII/PHI discovery with Data Classification for GDPR/HIPAA compliance' 
FROM databricks_features WHERE name = 'Data Classification'
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT id, 'security_breaches', 'platform_governance', 'Prevent data exposure with automated sensitive data classification and tagging' 
FROM databricks_features WHERE name = 'Data Classification'
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT id, 'audit_gaps', 'platform_governance', 'Track data access with Data Classification audit logs and System Tables integration' 
FROM databricks_features WHERE name = 'Data Classification'
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- ==============================================================================
-- DATA ENGINEERING (Most Common Pain Points)
-- ==============================================================================

-- Lakeflow Pipelines → Pipeline pain points
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT id, 'complex_integrations', 'data_engineering', 'Simplify pipeline development with Lakeflow visual editor - reduce time-to-production by 80%' 
FROM databricks_features WHERE name = 'Lakeflow Pipelines Visual Editor'
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT id, 'pipeline_maintenance', 'data_engineering', 'Reduce pipeline maintenance overhead with Lakeflow managed orchestration' 
FROM databricks_features WHERE name = 'Lakeflow Pipelines Visual Editor'
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT id, 'error_handling', 'data_engineering', 'Built-in error handling and retries with Lakeflow Pipelines expectations' 
FROM databricks_features WHERE name = 'Lakeflow Pipelines Visual Editor'
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT id, 'data_quality_issues', 'data_engineering', 'Enforce data quality with Lakeflow expectations and automatic monitoring' 
FROM databricks_features WHERE name = 'Lakeflow Pipelines Visual Editor'
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- ==============================================================================
-- ANALYTICS & BI (Most Common Pain Points)
-- ==============================================================================

-- Liquid Clustering → Query Performance
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT id, 'delayed_insights', 'analytics_bi', 'Accelerate queries by 2-5× with Automatic Liquid Clustering for real-time analytics' 
FROM databricks_features WHERE name = 'Automatic Liquid Clustering for Delta Live Tables'
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT id, 'report_timeouts', 'analytics_bi', 'Eliminate report timeouts with adaptive query optimization via Liquid Clustering' 
FROM databricks_features WHERE name = 'Automatic Liquid Clustering for Delta Live Tables'
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Serverless Compute → Performance & Scale
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT id, 'slow_queries', 'analytics_bi', 'Achieve 2-5× query speedup with Serverless Compute Runtime 17.3 and Photon' 
FROM databricks_features WHERE name = 'Serverless Compute Runtime 17.3'
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT id, 'inconsistent_performance', 'analytics_bi', 'Consistent sub-second performance with Serverless SQL and intelligent caching' 
FROM databricks_features WHERE name = 'Serverless Compute Runtime 17.3'
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT id, 'adoption_barriers', 'analytics_bi', 'Remove infrastructure complexity - enable analysts with serverless SQL warehouses' 
FROM databricks_features WHERE name = 'Serverless Compute Runtime 17.3'
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- ==============================================================================
-- MACHINE LEARNING (Most Common Pain Points)
-- ==============================================================================

-- Online Feature Store → MLOps pain points
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT id, 'manual_processes', 'machine_learning', 'Automate feature engineering with Databricks Online Feature Store' 
FROM databricks_features WHERE name = 'Databricks Online Feature Store'
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT id, 'reproducibility_issues', 'machine_learning', 'Ensure training-serving consistency with managed online feature store' 
FROM databricks_features WHERE name = 'Databricks Online Feature Store'
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT id, 'scattered_artifacts', 'machine_learning', 'Centralize ML features with ultra-low latency online serving (<10ms p99)' 
FROM databricks_features WHERE name = 'Databricks Online Feature Store'
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- ==============================================================================
-- GENERATIVE AI (Most Common Pain Points)
-- ==============================================================================

-- Multi-Agent Supervisor → GenAI Strategy
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT id, 'disconnected_efforts', 'generative_ai', 'Orchestrate complex GenAI workflows with Multi-Agent Supervisor for RAG + function calling' 
FROM databricks_features WHERE name = 'Multi-Agent Supervisor with Unity Catalog Functions'
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT id, 'technology_uncertainty', 'generative_ai', 'Production-grade agent orchestration with Unity Catalog governance integration' 
FROM databricks_features WHERE name = 'Multi-Agent Supervisor with Unity Catalog Functions'
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT id, 'skills_gaps', 'generative_ai', 'Accelerate GenAI development with pre-built agent templates and Unity Catalog functions' 
FROM databricks_features WHERE name = 'Multi-Agent Supervisor with Unity Catalog Functions'
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Databricks Assistant → No strategy
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT id, 'no_strategy', 'generative_ai', 'Kickstart GenAI adoption with Databricks Assistant for code generation and SQL assistance' 
FROM databricks_features WHERE name = 'Databricks Assistant'
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- ==============================================================================
-- OPERATIONAL EXCELLENCE (Most Common Pain Points)
-- ==============================================================================

-- Unity Catalog External Locations → Governance
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT id, 'no_coe', 'operational_excellence', 'Establish governance foundation with Unity Catalog External Locations for centralized data access' 
FROM databricks_features WHERE name = 'Unity Catalog External Locations'
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT id, 'unclear_charter', 'operational_excellence', 'Define access patterns and governance policies with Unity Catalog federation' 
FROM databricks_features WHERE name = 'Unity Catalog External Locations'
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT id, 'standards_gaps', 'operational_excellence', 'Standardize external data access with Unity Catalog security and audit logging' 
FROM databricks_features WHERE name = 'Unity Catalog External Locations'
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- ==============================================================================
-- VALIDATION
-- ==============================================================================

-- Count total mappings added
DO $$
DECLARE
  mapping_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO mapping_count FROM feature_pain_point_mapping;
  RAISE NOTICE '✅ Quick test mappings complete: % total mappings', mapping_count;
END $$;






