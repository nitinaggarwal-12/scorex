-- ============================================================================
-- COMPREHENSIVE PAIN POINT MAPPINGS - 442 UNIQUE PAIN POINTS
-- Generated: 2025-10-30T16:27:45.349Z
-- Strategy: Map each pain point to ALL features in relevant categories
-- Database will filter and rank features at query time
-- ============================================================================

-- Clear existing mappings
TRUNCATE TABLE feature_pain_point_mapping CASCADE;

-- PLATFORM_GOVERNANCE (95 pain points)
-- Categories: platform
-- ============================================================================

-- Map inconsistent_configs to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'inconsistent_configs',
  'platform_governance',
  'Deploy ' || f.name || ' to address inconsistent configs - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map manual_provisioning to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'manual_provisioning',
  'platform_governance',
  'Deploy ' || f.name || ' to address manual provisioning - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map poor_isolation to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'poor_isolation',
  'platform_governance',
  'Deploy ' || f.name || ' to address poor isolation - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map deployment_issues to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'deployment_issues',
  'platform_governance',
  'Deploy ' || f.name || ' to address deployment issues - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map resource_conflicts to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'resource_conflicts',
  'platform_governance',
  'Deploy ' || f.name || ' to address resource conflicts - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map slow_deployment to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'slow_deployment',
  'platform_governance',
  'Deploy ' || f.name || ' to address slow deployment - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map environment_costs to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'environment_costs',
  'platform_governance',
  'Deploy ' || f.name || ' to address environment costs - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map team_bottlenecks to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'team_bottlenecks',
  'platform_governance',
  'Deploy ' || f.name || ' to address team bottlenecks - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map quality_issues to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'quality_issues',
  'platform_governance',
  'Deploy ' || f.name || ' to address quality issues - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map compliance_risks to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'compliance_risks',
  'platform_governance',
  'Deploy ' || f.name || ' to address compliance risks - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map resource_contention to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'resource_contention',
  'platform_governance',
  'Deploy ' || f.name || ' to address resource contention - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map performance_degradation to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'performance_degradation',
  'platform_governance',
  'Deploy ' || f.name || ' to address performance degradation - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map complex_scaling to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'complex_scaling',
  'platform_governance',
  'Deploy ' || f.name || ' to address complex scaling - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map infrastructure_limits to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'infrastructure_limits',
  'platform_governance',
  'Deploy ' || f.name || ' to address infrastructure limits - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map monitoring_gaps to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'monitoring_gaps',
  'platform_governance',
  'Deploy ' || f.name || ' to address monitoring gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map team_blocking to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'team_blocking',
  'platform_governance',
  'Deploy ' || f.name || ' to address team blocking - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map project_delays to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'project_delays',
  'platform_governance',
  'Deploy ' || f.name || ' to address project delays - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map high_costs to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'high_costs',
  'platform_governance',
  'Deploy ' || f.name || ' to address high costs - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map poor_utilization to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'poor_utilization',
  'platform_governance',
  'Deploy ' || f.name || ' to address poor utilization - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map competitive_disadvantage to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'competitive_disadvantage',
  'platform_governance',
  'Deploy ' || f.name || ' to address competitive disadvantage - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map auth_complexity to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'auth_complexity',
  'platform_governance',
  'Deploy ' || f.name || ' to address auth complexity - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map access_management to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'access_management',
  'platform_governance',
  'Deploy ' || f.name || ' to address access management - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map security_gaps to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'security_gaps',
  'platform_governance',
  'Deploy ' || f.name || ' to address security gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map audit_trails to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'audit_trails',
  'platform_governance',
  'Deploy ' || f.name || ' to address audit trails - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map integration_issues to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'integration_issues',
  'platform_governance',
  'Deploy ' || f.name || ' to address integration issues - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map security_breaches to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'security_breaches',
  'platform_governance',
  'Deploy ' || f.name || ' to address security breaches - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map compliance_violations to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'compliance_violations',
  'platform_governance',
  'Deploy ' || f.name || ' to address compliance violations - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map access_delays to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'access_delays',
  'platform_governance',
  'Deploy ' || f.name || ' to address access delays - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map admin_overhead to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'admin_overhead',
  'platform_governance',
  'Deploy ' || f.name || ' to address admin overhead - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map user_frustration to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'user_frustration',
  'platform_governance',
  'Deploy ' || f.name || ' to address user frustration - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_exposure to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_exposure',
  'platform_governance',
  'Deploy ' || f.name || ' to address data exposure - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map over_privileged to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'over_privileged',
  'platform_governance',
  'Deploy ' || f.name || ' to address over privileged - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map encryption_gaps to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'encryption_gaps',
  'platform_governance',
  'Deploy ' || f.name || ' to address encryption gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map monitoring_blind_spots to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'monitoring_blind_spots',
  'platform_governance',
  'Deploy ' || f.name || ' to address monitoring blind spots - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map policy_enforcement to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'policy_enforcement',
  'platform_governance',
  'Deploy ' || f.name || ' to address policy enforcement - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map regulatory_risk to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'regulatory_risk',
  'platform_governance',
  'Deploy ' || f.name || ' to address regulatory risk - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_breaches to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_breaches',
  'platform_governance',
  'Deploy ' || f.name || ' to address data breaches - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map customer_trust to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'customer_trust',
  'platform_governance',
  'Deploy ' || f.name || ' to address customer trust - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map audit_failures to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'audit_failures',
  'platform_governance',
  'Deploy ' || f.name || ' to address audit failures - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map business_disruption to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'business_disruption',
  'platform_governance',
  'Deploy ' || f.name || ' to address business disruption - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map policy_gaps to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'policy_gaps',
  'platform_governance',
  'Deploy ' || f.name || ' to address policy gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map lineage_tracking to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'lineage_tracking',
  'platform_governance',
  'Deploy ' || f.name || ' to address lineage tracking - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map manual_processes to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'manual_processes',
  'platform_governance',
  'Deploy ' || f.name || ' to address manual processes - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map metadata_management to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'metadata_management',
  'platform_governance',
  'Deploy ' || f.name || ' to address metadata management - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map integration_complexity to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'integration_complexity',
  'platform_governance',
  'Deploy ' || f.name || ' to address integration complexity - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map compliance_failures to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'compliance_failures',
  'platform_governance',
  'Deploy ' || f.name || ' to address compliance failures - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_quality_issues to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_quality_issues',
  'platform_governance',
  'Deploy ' || f.name || ' to address data quality issues - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map regulatory_fines to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'regulatory_fines',
  'platform_governance',
  'Deploy ' || f.name || ' to address regulatory fines - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map operational_inefficiency to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'operational_inefficiency',
  'platform_governance',
  'Deploy ' || f.name || ' to address operational inefficiency - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map decision_delays to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'decision_delays',
  'platform_governance',
  'Deploy ' || f.name || ' to address decision delays - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map audit_complexity to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'audit_complexity',
  'platform_governance',
  'Deploy ' || f.name || ' to address audit complexity - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_retention to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_retention',
  'platform_governance',
  'Deploy ' || f.name || ' to address data retention - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reporting_gaps to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reporting_gaps',
  'platform_governance',
  'Deploy ' || f.name || ' to address reporting gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map change_tracking to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'change_tracking',
  'platform_governance',
  'Deploy ' || f.name || ' to address change tracking - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map tool_integration to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'tool_integration',
  'platform_governance',
  'Deploy ' || f.name || ' to address tool integration - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map regulatory_penalties to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'regulatory_penalties',
  'platform_governance',
  'Deploy ' || f.name || ' to address regulatory penalties - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map audit_costs to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'audit_costs',
  'platform_governance',
  'Deploy ' || f.name || ' to address audit costs - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map business_risk to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'business_risk',
  'platform_governance',
  'Deploy ' || f.name || ' to address business risk - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reputation_damage to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reputation_damage',
  'platform_governance',
  'Deploy ' || f.name || ' to address reputation damage - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map alert_noise to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'alert_noise',
  'platform_governance',
  'Deploy ' || f.name || ' to address alert noise - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map metric_correlation to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'metric_correlation',
  'platform_governance',
  'Deploy ' || f.name || ' to address metric correlation - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map performance_impact to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'performance_impact',
  'platform_governance',
  'Deploy ' || f.name || ' to address performance impact - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map tool_fragmentation to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'tool_fragmentation',
  'platform_governance',
  'Deploy ' || f.name || ' to address tool fragmentation - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map unplanned_downtime to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'unplanned_downtime',
  'platform_governance',
  'Deploy ' || f.name || ' to address unplanned downtime - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map slow_issue_resolution to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'slow_issue_resolution',
  'platform_governance',
  'Deploy ' || f.name || ' to address slow issue resolution - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map user_impact to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'user_impact',
  'platform_governance',
  'Deploy ' || f.name || ' to address user impact - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map resource_waste to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'resource_waste',
  'platform_governance',
  'Deploy ' || f.name || ' to address resource waste - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map sla_breaches to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'sla_breaches',
  'platform_governance',
  'Deploy ' || f.name || ' to address sla breaches - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map late_detection to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'late_detection',
  'platform_governance',
  'Deploy ' || f.name || ' to address late detection - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map manual_response to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'manual_response',
  'platform_governance',
  'Deploy ' || f.name || ' to address manual response - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map alert_fatigue to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'alert_fatigue',
  'platform_governance',
  'Deploy ' || f.name || ' to address alert fatigue - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map root_cause_analysis to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'root_cause_analysis',
  'platform_governance',
  'Deploy ' || f.name || ' to address root cause analysis - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map escalation_delays to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'escalation_delays',
  'platform_governance',
  'Deploy ' || f.name || ' to address escalation delays - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map service_disruption to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'service_disruption',
  'platform_governance',
  'Deploy ' || f.name || ' to address service disruption - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map customer_impact to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'customer_impact',
  'platform_governance',
  'Deploy ' || f.name || ' to address customer impact - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map operational_costs to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'operational_costs',
  'platform_governance',
  'Deploy ' || f.name || ' to address operational costs - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map team_burnout to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'team_burnout',
  'platform_governance',
  'Deploy ' || f.name || ' to address team burnout - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map missed_slas to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'missed_slas',
  'platform_governance',
  'Deploy ' || f.name || ' to address missed slas - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map cost_attribution to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'cost_attribution',
  'platform_governance',
  'Deploy ' || f.name || ' to address cost attribution - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map usage_visibility to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'usage_visibility',
  'platform_governance',
  'Deploy ' || f.name || ' to address usage visibility - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reporting_complexity to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reporting_complexity',
  'platform_governance',
  'Deploy ' || f.name || ' to address reporting complexity - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map tagging_inconsistency to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'tagging_inconsistency',
  'platform_governance',
  'Deploy ' || f.name || ' to address tagging inconsistency - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map tool_limitations to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'tool_limitations',
  'platform_governance',
  'Deploy ' || f.name || ' to address tool limitations - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map budget_overruns to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'budget_overruns',
  'platform_governance',
  'Deploy ' || f.name || ' to address budget overruns - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map cost_surprises to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'cost_surprises',
  'platform_governance',
  'Deploy ' || f.name || ' to address cost surprises - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_accountability to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_accountability',
  'platform_governance',
  'Deploy ' || f.name || ' to address no accountability - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map inefficient_spending to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'inefficient_spending',
  'platform_governance',
  'Deploy ' || f.name || ' to address inefficient spending - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map budget_planning to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'budget_planning',
  'platform_governance',
  'Deploy ' || f.name || ' to address budget planning - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map optimization_complexity to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'optimization_complexity',
  'platform_governance',
  'Deploy ' || f.name || ' to address optimization complexity - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map resource_rightsizing to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'resource_rightsizing',
  'platform_governance',
  'Deploy ' || f.name || ' to address resource rightsizing - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map automation_gaps to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'automation_gaps',
  'platform_governance',
  'Deploy ' || f.name || ' to address automation gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map wasted_spend to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'wasted_spend',
  'platform_governance',
  'Deploy ' || f.name || ' to address wasted spend - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_cost_discipline to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_cost_discipline',
  'platform_governance',
  'Deploy ' || f.name || ' to address no cost discipline - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map team_conflicts to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'team_conflicts',
  'platform_governance',
  'Deploy ' || f.name || ' to address team conflicts - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map roi_unclear to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'roi_unclear',
  'platform_governance',
  'Deploy ' || f.name || ' to address roi unclear - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;


-- DATA_ENGINEERING (97 pain points)
-- Categories: data_engineering
-- ============================================================================

-- Map complex_integrations to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'complex_integrations',
  'data_engineering',
  'Deploy ' || f.name || ' to address complex integrations - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_format_issues to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_format_issues',
  'data_engineering',
  'Deploy ' || f.name || ' to address data format issues - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map pipeline_maintenance to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'pipeline_maintenance',
  'data_engineering',
  'Deploy ' || f.name || ' to address pipeline maintenance - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map error_handling to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'error_handling',
  'data_engineering',
  'Deploy ' || f.name || ' to address error handling - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map throughput_issues to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'throughput_issues',
  'data_engineering',
  'Deploy ' || f.name || ' to address throughput issues - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_delays to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_delays',
  'data_engineering',
  'Deploy ' || f.name || ' to address data delays - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map integration_costs to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'integration_costs',
  'data_engineering',
  'Deploy ' || f.name || ' to address integration costs - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_quality to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_quality',
  'data_engineering',
  'Deploy ' || f.name || ' to address data quality - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map team_bottlenecks to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'team_bottlenecks',
  'data_engineering',
  'Deploy ' || f.name || ' to address team bottlenecks - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map business_agility to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'business_agility',
  'data_engineering',
  'Deploy ' || f.name || ' to address business agility - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map schema_breakage to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'schema_breakage',
  'data_engineering',
  'Deploy ' || f.name || ' to address schema breakage - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map manual_fixes to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'manual_fixes',
  'data_engineering',
  'Deploy ' || f.name || ' to address manual fixes - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_loss_risk to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_loss_risk',
  'data_engineering',
  'Deploy ' || f.name || ' to address data loss risk - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map monitoring_gaps to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'monitoring_gaps',
  'data_engineering',
  'Deploy ' || f.name || ' to address monitoring gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map recovery_complexity to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'recovery_complexity',
  'data_engineering',
  'Deploy ' || f.name || ' to address recovery complexity - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_unavailability to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_unavailability',
  'data_engineering',
  'Deploy ' || f.name || ' to address data unavailability - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map operational_overhead to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'operational_overhead',
  'data_engineering',
  'Deploy ' || f.name || ' to address operational overhead - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map sla_breaches to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'sla_breaches',
  'data_engineering',
  'Deploy ' || f.name || ' to address sla breaches - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map trust_issues to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'trust_issues',
  'data_engineering',
  'Deploy ' || f.name || ' to address trust issues - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map compliance_risk to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'compliance_risk',
  'data_engineering',
  'Deploy ' || f.name || ' to address compliance risk - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_organization to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_organization',
  'data_engineering',
  'Deploy ' || f.name || ' to address data organization - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map layer_confusion to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'layer_confusion',
  'data_engineering',
  'Deploy ' || f.name || ' to address layer confusion - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map duplicate_data to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'duplicate_data',
  'data_engineering',
  'Deploy ' || f.name || ' to address duplicate data - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map transformation_complexity to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'transformation_complexity',
  'data_engineering',
  'Deploy ' || f.name || ' to address transformation complexity - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map performance_issues to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'performance_issues',
  'data_engineering',
  'Deploy ' || f.name || ' to address performance issues - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_discovery to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_discovery',
  'data_engineering',
  'Deploy ' || f.name || ' to address data discovery - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map inconsistent_metrics to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'inconsistent_metrics',
  'data_engineering',
  'Deploy ' || f.name || ' to address inconsistent metrics - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map storage_costs to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'storage_costs',
  'data_engineering',
  'Deploy ' || f.name || ' to address storage costs - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map slow_insights to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'slow_insights',
  'data_engineering',
  'Deploy ' || f.name || ' to address slow insights - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map trust_deficit to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'trust_deficit',
  'data_engineering',
  'Deploy ' || f.name || ' to address trust deficit - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map rigid_structure to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'rigid_structure',
  'data_engineering',
  'Deploy ' || f.name || ' to address rigid structure - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map new_source_complexity to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'new_source_complexity',
  'data_engineering',
  'Deploy ' || f.name || ' to address new source complexity - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map format_limitations to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'format_limitations',
  'data_engineering',
  'Deploy ' || f.name || ' to address format limitations - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map integration_effort to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'integration_effort',
  'data_engineering',
  'Deploy ' || f.name || ' to address integration effort - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map scalability_constraints to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'scalability_constraints',
  'data_engineering',
  'Deploy ' || f.name || ' to address scalability constraints - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map slow_adaptation to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'slow_adaptation',
  'data_engineering',
  'Deploy ' || f.name || ' to address slow adaptation - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map missed_opportunities to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'missed_opportunities',
  'data_engineering',
  'Deploy ' || f.name || ' to address missed opportunities - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map integration_delays to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'integration_delays',
  'data_engineering',
  'Deploy ' || f.name || ' to address integration delays - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map competitive_lag to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'competitive_lag',
  'data_engineering',
  'Deploy ' || f.name || ' to address competitive lag - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map innovation_barriers to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'innovation_barriers',
  'data_engineering',
  'Deploy ' || f.name || ' to address innovation barriers - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map scheduling_issues to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'scheduling_issues',
  'data_engineering',
  'Deploy ' || f.name || ' to address scheduling issues - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map dependency_failures to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'dependency_failures',
  'data_engineering',
  'Deploy ' || f.name || ' to address dependency failures - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map retry_logic to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'retry_logic',
  'data_engineering',
  'Deploy ' || f.name || ' to address retry logic - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map maintenance_burden to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'maintenance_burden',
  'data_engineering',
  'Deploy ' || f.name || ' to address maintenance burden - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_freshness to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_freshness',
  'data_engineering',
  'Deploy ' || f.name || ' to address data freshness - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map operational_costs to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'operational_costs',
  'data_engineering',
  'Deploy ' || f.name || ' to address operational costs - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map pipeline_failures to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'pipeline_failures',
  'data_engineering',
  'Deploy ' || f.name || ' to address pipeline failures - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map sla_misses to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'sla_misses',
  'data_engineering',
  'Deploy ' || f.name || ' to address sla misses - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map team_frustration to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'team_frustration',
  'data_engineering',
  'Deploy ' || f.name || ' to address team frustration - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map version_control to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'version_control',
  'data_engineering',
  'Deploy ' || f.name || ' to address version control - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map testing_gaps to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'testing_gaps',
  'data_engineering',
  'Deploy ' || f.name || ' to address testing gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map deployment_issues to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'deployment_issues',
  'data_engineering',
  'Deploy ' || f.name || ' to address deployment issues - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map environment_drift to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'environment_drift',
  'data_engineering',
  'Deploy ' || f.name || ' to address environment drift - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map change_tracking to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'change_tracking',
  'data_engineering',
  'Deploy ' || f.name || ' to address change tracking - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map production_incidents to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'production_incidents',
  'data_engineering',
  'Deploy ' || f.name || ' to address production incidents - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map slow_releases to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'slow_releases',
  'data_engineering',
  'Deploy ' || f.name || ' to address slow releases - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map quality_issues to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'quality_issues',
  'data_engineering',
  'Deploy ' || f.name || ' to address quality issues - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map rollback_complexity to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'rollback_complexity',
  'data_engineering',
  'Deploy ' || f.name || ' to address rollback complexity - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map audit_gaps to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'audit_gaps',
  'data_engineering',
  'Deploy ' || f.name || ' to address audit gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map validation_gaps to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'validation_gaps',
  'data_engineering',
  'Deploy ' || f.name || ' to address validation gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map quality_rules to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'quality_rules',
  'data_engineering',
  'Deploy ' || f.name || ' to address quality rules - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map error_detection to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'error_detection',
  'data_engineering',
  'Deploy ' || f.name || ' to address error detection - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reconciliation_complexity to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reconciliation_complexity',
  'data_engineering',
  'Deploy ' || f.name || ' to address reconciliation complexity - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map recovery_procedures to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'recovery_procedures',
  'data_engineering',
  'Deploy ' || f.name || ' to address recovery procedures - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map bad_decisions to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'bad_decisions',
  'data_engineering',
  'Deploy ' || f.name || ' to address bad decisions - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map customer_impact to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'customer_impact',
  'data_engineering',
  'Deploy ' || f.name || ' to address customer impact - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map trust_erosion to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'trust_erosion',
  'data_engineering',
  'Deploy ' || f.name || ' to address trust erosion - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map compliance_violations to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'compliance_violations',
  'data_engineering',
  'Deploy ' || f.name || ' to address compliance violations - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map alert_noise to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'alert_noise',
  'data_engineering',
  'Deploy ' || f.name || ' to address alert noise - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map metric_visibility to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'metric_visibility',
  'data_engineering',
  'Deploy ' || f.name || ' to address metric visibility - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map stakeholder_communication to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'stakeholder_communication',
  'data_engineering',
  'Deploy ' || f.name || ' to address stakeholder communication - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map trend_analysis to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'trend_analysis',
  'data_engineering',
  'Deploy ' || f.name || ' to address trend analysis - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map late_discovery to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'late_discovery',
  'data_engineering',
  'Deploy ' || f.name || ' to address late discovery - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map stakeholder_frustration to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'stakeholder_frustration',
  'data_engineering',
  'Deploy ' || f.name || ' to address stakeholder frustration - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reactive_approach to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reactive_approach',
  'data_engineering',
  'Deploy ' || f.name || ' to address reactive approach - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map sla_impacts to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'sla_impacts',
  'data_engineering',
  'Deploy ' || f.name || ' to address sla impacts - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reputation_damage to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reputation_damage',
  'data_engineering',
  'Deploy ' || f.name || ' to address reputation damage - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map slow_pipelines to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'slow_pipelines',
  'data_engineering',
  'Deploy ' || f.name || ' to address slow pipelines - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map parallelization_gaps to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'parallelization_gaps',
  'data_engineering',
  'Deploy ' || f.name || ' to address parallelization gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map resource_inefficiency to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'resource_inefficiency',
  'data_engineering',
  'Deploy ' || f.name || ' to address resource inefficiency - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map bottlenecks to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'bottlenecks',
  'data_engineering',
  'Deploy ' || f.name || ' to address bottlenecks - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map optimization_difficulty to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'optimization_difficulty',
  'data_engineering',
  'Deploy ' || f.name || ' to address optimization difficulty - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_latency to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_latency',
  'data_engineering',
  'Deploy ' || f.name || ' to address data latency - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map compute_costs to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'compute_costs',
  'data_engineering',
  'Deploy ' || f.name || ' to address compute costs - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map user_experience to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'user_experience',
  'data_engineering',
  'Deploy ' || f.name || ' to address user experience - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map scalability_limits to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'scalability_limits',
  'data_engineering',
  'Deploy ' || f.name || ' to address scalability limits - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map competitive_disadvantage to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'competitive_disadvantage',
  'data_engineering',
  'Deploy ' || f.name || ' to address competitive disadvantage - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map manual_scaling to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'manual_scaling',
  'data_engineering',
  'Deploy ' || f.name || ' to address manual scaling - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map over_provisioning to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'over_provisioning',
  'data_engineering',
  'Deploy ' || f.name || ' to address over provisioning - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map scaling_delays to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'scaling_delays',
  'data_engineering',
  'Deploy ' || f.name || ' to address scaling delays - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map resource_contention to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'resource_contention',
  'data_engineering',
  'Deploy ' || f.name || ' to address resource contention - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map configuration_complexity to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'configuration_complexity',
  'data_engineering',
  'Deploy ' || f.name || ' to address configuration complexity - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map cost_inefficiency to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'cost_inefficiency',
  'data_engineering',
  'Deploy ' || f.name || ' to address cost inefficiency - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map performance_degradation to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'performance_degradation',
  'data_engineering',
  'Deploy ' || f.name || ' to address performance degradation - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map capacity_planning to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'capacity_planning',
  'data_engineering',
  'Deploy ' || f.name || ' to address capacity planning - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map business_impact to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'business_impact',
  'data_engineering',
  'Deploy ' || f.name || ' to address business impact - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map wasted_resources to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'wasted_resources',
  'data_engineering',
  'Deploy ' || f.name || ' to address wasted resources - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;


-- ANALYTICS_BI (94 pain points)
-- Categories: analytics
-- ============================================================================

-- Map slow_queries to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'slow_queries',
  'analytics_bi',
  'Deploy ' || f.name || ' to address slow queries - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map inconsistent_performance to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'inconsistent_performance',
  'analytics_bi',
  'Deploy ' || f.name || ' to address inconsistent performance - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map resource_contention to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'resource_contention',
  'analytics_bi',
  'Deploy ' || f.name || ' to address resource contention - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map optimization_difficulty to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'optimization_difficulty',
  'analytics_bi',
  'Deploy ' || f.name || ' to address optimization difficulty - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map monitoring_gaps to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'monitoring_gaps',
  'analytics_bi',
  'Deploy ' || f.name || ' to address monitoring gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map user_frustration to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'user_frustration',
  'analytics_bi',
  'Deploy ' || f.name || ' to address user frustration - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map delayed_insights to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'delayed_insights',
  'analytics_bi',
  'Deploy ' || f.name || ' to address delayed insights - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map report_timeouts to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'report_timeouts',
  'analytics_bi',
  'Deploy ' || f.name || ' to address report timeouts - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map adoption_barriers to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'adoption_barriers',
  'analytics_bi',
  'Deploy ' || f.name || ' to address adoption barriers - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map competitive_lag to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'competitive_lag',
  'analytics_bi',
  'Deploy ' || f.name || ' to address competitive lag - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map ad_hoc_optimization to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'ad_hoc_optimization',
  'analytics_bi',
  'Deploy ' || f.name || ' to address ad hoc optimization - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map lack_of_tools to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'lack_of_tools',
  'analytics_bi',
  'Deploy ' || f.name || ' to address lack of tools - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map query_complexity to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'query_complexity',
  'analytics_bi',
  'Deploy ' || f.name || ' to address query complexity - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map indexing_gaps to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'indexing_gaps',
  'analytics_bi',
  'Deploy ' || f.name || ' to address indexing gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map knowledge_gaps to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'knowledge_gaps',
  'analytics_bi',
  'Deploy ' || f.name || ' to address knowledge gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map high_compute_costs to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'high_compute_costs',
  'analytics_bi',
  'Deploy ' || f.name || ' to address high compute costs - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map poor_user_experience to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'poor_user_experience',
  'analytics_bi',
  'Deploy ' || f.name || ' to address poor user experience - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map limited_scalability to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'limited_scalability',
  'analytics_bi',
  'Deploy ' || f.name || ' to address limited scalability - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map optimization_delays to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'optimization_delays',
  'analytics_bi',
  'Deploy ' || f.name || ' to address optimization delays - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reactive_approach to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reactive_approach',
  'analytics_bi',
  'Deploy ' || f.name || ' to address reactive approach - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map metric_inconsistency to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'metric_inconsistency',
  'analytics_bi',
  'Deploy ' || f.name || ' to address metric inconsistency - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_shared_layer to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_shared_layer',
  'analytics_bi',
  'Deploy ' || f.name || ' to address no shared layer - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map duplicate_logic to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'duplicate_logic',
  'analytics_bi',
  'Deploy ' || f.name || ' to address duplicate logic - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map version_confusion to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'version_confusion',
  'analytics_bi',
  'Deploy ' || f.name || ' to address version confusion - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map documentation_gaps to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'documentation_gaps',
  'analytics_bi',
  'Deploy ' || f.name || ' to address documentation gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map conflicting_reports to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'conflicting_reports',
  'analytics_bi',
  'Deploy ' || f.name || ' to address conflicting reports - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map trust_issues to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'trust_issues',
  'analytics_bi',
  'Deploy ' || f.name || ' to address trust issues - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map decision_delays to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'decision_delays',
  'analytics_bi',
  'Deploy ' || f.name || ' to address decision delays - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map wasted_effort to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'wasted_effort',
  'analytics_bi',
  'Deploy ' || f.name || ' to address wasted effort - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map compliance_risk to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'compliance_risk',
  'analytics_bi',
  'Deploy ' || f.name || ' to address compliance risk - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map poor_discoverability to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'poor_discoverability',
  'analytics_bi',
  'Deploy ' || f.name || ' to address poor discoverability - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map catalog_gaps to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'catalog_gaps',
  'analytics_bi',
  'Deploy ' || f.name || ' to address catalog gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map unclear_lineage to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'unclear_lineage',
  'analytics_bi',
  'Deploy ' || f.name || ' to address unclear lineage - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map access_complexity to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'access_complexity',
  'analytics_bi',
  'Deploy ' || f.name || ' to address access complexity - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map quality_uncertainty to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'quality_uncertainty',
  'analytics_bi',
  'Deploy ' || f.name || ' to address quality uncertainty - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map analyst_inefficiency to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'analyst_inefficiency',
  'analytics_bi',
  'Deploy ' || f.name || ' to address analyst inefficiency - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map duplicate_work to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'duplicate_work',
  'analytics_bi',
  'Deploy ' || f.name || ' to address duplicate work - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map low_reuse to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'low_reuse',
  'analytics_bi',
  'Deploy ' || f.name || ' to address low reuse - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map trust_deficit to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'trust_deficit',
  'analytics_bi',
  'Deploy ' || f.name || ' to address trust deficit - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map onboarding_delays to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'onboarding_delays',
  'analytics_bi',
  'Deploy ' || f.name || ' to address onboarding delays - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map integration_complexity to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'integration_complexity',
  'analytics_bi',
  'Deploy ' || f.name || ' to address integration complexity - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map performance_issues to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'performance_issues',
  'analytics_bi',
  'Deploy ' || f.name || ' to address performance issues - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_extracts to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_extracts',
  'analytics_bi',
  'Deploy ' || f.name || ' to address data extracts - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map refresh_delays to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'refresh_delays',
  'analytics_bi',
  'Deploy ' || f.name || ' to address refresh delays - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map limited_interactivity to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'limited_interactivity',
  'analytics_bi',
  'Deploy ' || f.name || ' to address limited interactivity - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map stale_dashboards to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'stale_dashboards',
  'analytics_bi',
  'Deploy ' || f.name || ' to address stale dashboards - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map limited_adoption to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'limited_adoption',
  'analytics_bi',
  'Deploy ' || f.name || ' to address limited adoption - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reporting_delays to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reporting_delays',
  'analytics_bi',
  'Deploy ' || f.name || ' to address reporting delays - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map cost_overhead to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'cost_overhead',
  'analytics_bi',
  'Deploy ' || f.name || ' to address cost overhead - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map inconsistent_schedules to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'inconsistent_schedules',
  'analytics_bi',
  'Deploy ' || f.name || ' to address inconsistent schedules - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map kpi_proliferation to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'kpi_proliferation',
  'analytics_bi',
  'Deploy ' || f.name || ' to address kpi proliferation - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map version_control to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'version_control',
  'analytics_bi',
  'Deploy ' || f.name || ' to address version control - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map access_management to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'access_management',
  'analytics_bi',
  'Deploy ' || f.name || ' to address access management - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map audit_trails to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'audit_trails',
  'analytics_bi',
  'Deploy ' || f.name || ' to address audit trails - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map conflicting_kpis to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'conflicting_kpis',
  'analytics_bi',
  'Deploy ' || f.name || ' to address conflicting kpis - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map report_sprawl to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'report_sprawl',
  'analytics_bi',
  'Deploy ' || f.name || ' to address report sprawl - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map compliance_gaps to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'compliance_gaps',
  'analytics_bi',
  'Deploy ' || f.name || ' to address compliance gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map maintenance_burden to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'maintenance_burden',
  'analytics_bi',
  'Deploy ' || f.name || ' to address maintenance burden - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map trust_erosion to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'trust_erosion',
  'analytics_bi',
  'Deploy ' || f.name || ' to address trust erosion - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map tool_complexity to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'tool_complexity',
  'analytics_bi',
  'Deploy ' || f.name || ' to address tool complexity - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map access_barriers to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'access_barriers',
  'analytics_bi',
  'Deploy ' || f.name || ' to address access barriers - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map training_gaps to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'training_gaps',
  'analytics_bi',
  'Deploy ' || f.name || ' to address training gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map limited_tooling to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'limited_tooling',
  'analytics_bi',
  'Deploy ' || f.name || ' to address limited tooling - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map support_burden to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'support_burden',
  'analytics_bi',
  'Deploy ' || f.name || ' to address support burden - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map analyst_bottleneck to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'analyst_bottleneck',
  'analytics_bi',
  'Deploy ' || f.name || ' to address analyst bottleneck - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map slow_decisions to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'slow_decisions',
  'analytics_bi',
  'Deploy ' || f.name || ' to address slow decisions - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map low_data_literacy to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'low_data_literacy',
  'analytics_bi',
  'Deploy ' || f.name || ' to address low data literacy - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map missed_opportunities to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'missed_opportunities',
  'analytics_bi',
  'Deploy ' || f.name || ' to address missed opportunities - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map security_gaps to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'security_gaps',
  'analytics_bi',
  'Deploy ' || f.name || ' to address security gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map wild_west_access to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'wild_west_access',
  'analytics_bi',
  'Deploy ' || f.name || ' to address wild west access - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map quality_control to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'quality_control',
  'analytics_bi',
  'Deploy ' || f.name || ' to address quality control - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map audit_challenges to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'audit_challenges',
  'analytics_bi',
  'Deploy ' || f.name || ' to address audit challenges - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map policy_enforcement to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'policy_enforcement',
  'analytics_bi',
  'Deploy ' || f.name || ' to address policy enforcement - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_misuse to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_misuse',
  'analytics_bi',
  'Deploy ' || f.name || ' to address data misuse - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map inconsistent_analysis to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'inconsistent_analysis',
  'analytics_bi',
  'Deploy ' || f.name || ' to address inconsistent analysis - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map regulatory_exposure to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'regulatory_exposure',
  'analytics_bi',
  'Deploy ' || f.name || ' to address regulatory exposure - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map sharing_complexity to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'sharing_complexity',
  'analytics_bi',
  'Deploy ' || f.name || ' to address sharing complexity - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map security_concerns to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'security_concerns',
  'analytics_bi',
  'Deploy ' || f.name || ' to address security concerns - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map format_compatibility to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'format_compatibility',
  'analytics_bi',
  'Deploy ' || f.name || ' to address format compatibility - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map access_provisioning to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'access_provisioning',
  'analytics_bi',
  'Deploy ' || f.name || ' to address access provisioning - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map tracking_gaps to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'tracking_gaps',
  'analytics_bi',
  'Deploy ' || f.name || ' to address tracking gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map partner_friction to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'partner_friction',
  'analytics_bi',
  'Deploy ' || f.name || ' to address partner friction - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map collaboration_barriers to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'collaboration_barriers',
  'analytics_bi',
  'Deploy ' || f.name || ' to address collaboration barriers - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map revenue_impact to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'revenue_impact',
  'analytics_bi',
  'Deploy ' || f.name || ' to address revenue impact - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map competitive_disadvantage to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'competitive_disadvantage',
  'analytics_bi',
  'Deploy ' || f.name || ' to address competitive disadvantage - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_silos to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_silos',
  'analytics_bi',
  'Deploy ' || f.name || ' to address data silos - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map join_performance to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'join_performance',
  'analytics_bi',
  'Deploy ' || f.name || ' to address join performance - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map schema_conflicts to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'schema_conflicts',
  'analytics_bi',
  'Deploy ' || f.name || ' to address schema conflicts - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map governance_gaps to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'governance_gaps',
  'analytics_bi',
  'Deploy ' || f.name || ' to address governance gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map limited_insights to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'limited_insights',
  'analytics_bi',
  'Deploy ' || f.name || ' to address limited insights - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map integration_delays to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'integration_delays',
  'analytics_bi',
  'Deploy ' || f.name || ' to address integration delays - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map opportunity_cost to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'opportunity_cost',
  'analytics_bi',
  'Deploy ' || f.name || ' to address opportunity cost - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map decision_friction to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'decision_friction',
  'analytics_bi',
  'Deploy ' || f.name || ' to address decision friction - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map strategic_limitations to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'strategic_limitations',
  'analytics_bi',
  'Deploy ' || f.name || ' to address strategic limitations - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;


-- MACHINE_LEARNING (96 pain points)
-- Categories: machine_learning
-- ============================================================================

-- Map no_tracking to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_tracking',
  'machine_learning',
  'Deploy ' || f.name || ' to address no tracking - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reproducibility_issues to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reproducibility_issues',
  'machine_learning',
  'Deploy ' || f.name || ' to address reproducibility issues - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map scattered_artifacts to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'scattered_artifacts',
  'machine_learning',
  'Deploy ' || f.name || ' to address scattered artifacts - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map manual_logging to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'manual_logging',
  'machine_learning',
  'Deploy ' || f.name || ' to address manual logging - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map comparison_difficulty to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'comparison_difficulty',
  'machine_learning',
  'Deploy ' || f.name || ' to address comparison difficulty - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map wasted_effort to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'wasted_effort',
  'machine_learning',
  'Deploy ' || f.name || ' to address wasted effort - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map slow_iteration to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'slow_iteration',
  'machine_learning',
  'Deploy ' || f.name || ' to address slow iteration - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map knowledge_loss to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'knowledge_loss',
  'machine_learning',
  'Deploy ' || f.name || ' to address knowledge loss - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map audit_challenges to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'audit_challenges',
  'machine_learning',
  'Deploy ' || f.name || ' to address audit challenges - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map limited_reuse to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'limited_reuse',
  'machine_learning',
  'Deploy ' || f.name || ' to address limited reuse - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map environment_drift to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'environment_drift',
  'machine_learning',
  'Deploy ' || f.name || ' to address environment drift - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map dependency_issues to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'dependency_issues',
  'machine_learning',
  'Deploy ' || f.name || ' to address dependency issues - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_versioning to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_versioning',
  'machine_learning',
  'Deploy ' || f.name || ' to address data versioning - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map model_packaging to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'model_packaging',
  'machine_learning',
  'Deploy ' || f.name || ' to address model packaging - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map seed_management to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'seed_management',
  'machine_learning',
  'Deploy ' || f.name || ' to address seed management - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map debugging_difficulty to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'debugging_difficulty',
  'machine_learning',
  'Deploy ' || f.name || ' to address debugging difficulty - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map production_failures to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'production_failures',
  'machine_learning',
  'Deploy ' || f.name || ' to address production failures - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map trust_issues to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'trust_issues',
  'machine_learning',
  'Deploy ' || f.name || ' to address trust issues - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map compliance_risk to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'compliance_risk',
  'machine_learning',
  'Deploy ' || f.name || ' to address compliance risk - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map rollback_complexity to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'rollback_complexity',
  'machine_learning',
  'Deploy ' || f.name || ' to address rollback complexity - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map manual_deployment to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'manual_deployment',
  'machine_learning',
  'Deploy ' || f.name || ' to address manual deployment - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_cicd to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_cicd',
  'machine_learning',
  'Deploy ' || f.name || ' to address no cicd - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map environment_inconsistency to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'environment_inconsistency',
  'machine_learning',
  'Deploy ' || f.name || ' to address environment inconsistency - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map rollback_difficulty to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'rollback_difficulty',
  'machine_learning',
  'Deploy ' || f.name || ' to address rollback difficulty - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map testing_gaps to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'testing_gaps',
  'machine_learning',
  'Deploy ' || f.name || ' to address testing gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map slow_time_to_value to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'slow_time_to_value',
  'machine_learning',
  'Deploy ' || f.name || ' to address slow time to value - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map deployment_failures to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'deployment_failures',
  'machine_learning',
  'Deploy ' || f.name || ' to address deployment failures - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map resource_intensive to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'resource_intensive',
  'machine_learning',
  'Deploy ' || f.name || ' to address resource intensive - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map innovation_bottleneck to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'innovation_bottleneck',
  'machine_learning',
  'Deploy ' || f.name || ' to address innovation bottleneck - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map business_risk to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'business_risk',
  'machine_learning',
  'Deploy ' || f.name || ' to address business risk - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_monitoring to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_monitoring',
  'machine_learning',
  'Deploy ' || f.name || ' to address no monitoring - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map drift_detection to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'drift_detection',
  'machine_learning',
  'Deploy ' || f.name || ' to address drift detection - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map alert_gaps to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'alert_gaps',
  'machine_learning',
  'Deploy ' || f.name || ' to address alert gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map manual_retraining to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'manual_retraining',
  'machine_learning',
  'Deploy ' || f.name || ' to address manual retraining - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map performance_tracking to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'performance_tracking',
  'machine_learning',
  'Deploy ' || f.name || ' to address performance tracking - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map silent_failures to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'silent_failures',
  'machine_learning',
  'Deploy ' || f.name || ' to address silent failures - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map customer_impact to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'customer_impact',
  'machine_learning',
  'Deploy ' || f.name || ' to address customer impact - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map revenue_loss to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'revenue_loss',
  'machine_learning',
  'Deploy ' || f.name || ' to address revenue loss - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map trust_erosion to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'trust_erosion',
  'machine_learning',
  'Deploy ' || f.name || ' to address trust erosion - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reactive_approach to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reactive_approach',
  'machine_learning',
  'Deploy ' || f.name || ' to address reactive approach - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_feature_store to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_feature_store',
  'machine_learning',
  'Deploy ' || f.name || ' to address no feature store - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map duplicate_features to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'duplicate_features',
  'machine_learning',
  'Deploy ' || f.name || ' to address duplicate features - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map consistency_issues to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'consistency_issues',
  'machine_learning',
  'Deploy ' || f.name || ' to address consistency issues - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map discovery_difficulty to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'discovery_difficulty',
  'machine_learning',
  'Deploy ' || f.name || ' to address discovery difficulty - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map versioning_gaps to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'versioning_gaps',
  'machine_learning',
  'Deploy ' || f.name || ' to address versioning gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map slow_development to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'slow_development',
  'machine_learning',
  'Deploy ' || f.name || ' to address slow development - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map model_failures to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'model_failures',
  'machine_learning',
  'Deploy ' || f.name || ' to address model failures - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map limited_collaboration to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'limited_collaboration',
  'machine_learning',
  'Deploy ' || f.name || ' to address limited collaboration - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map quality_issues to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'quality_issues',
  'machine_learning',
  'Deploy ' || f.name || ' to address quality issues - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map inconsistent_practices to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'inconsistent_practices',
  'machine_learning',
  'Deploy ' || f.name || ' to address inconsistent practices - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map manual_processes to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'manual_processes',
  'machine_learning',
  'Deploy ' || f.name || ' to address manual processes - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map pipeline_fragility to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'pipeline_fragility',
  'machine_learning',
  'Deploy ' || f.name || ' to address pipeline fragility - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map quality_gaps to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'quality_gaps',
  'machine_learning',
  'Deploy ' || f.name || ' to address quality gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map scalability_issues to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'scalability_issues',
  'machine_learning',
  'Deploy ' || f.name || ' to address scalability issues - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_scientist_bottleneck to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_scientist_bottleneck',
  'machine_learning',
  'Deploy ' || f.name || ' to address data scientist bottleneck - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map resource_waste to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'resource_waste',
  'machine_learning',
  'Deploy ' || f.name || ' to address resource waste - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map limited_scalability to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'limited_scalability',
  'machine_learning',
  'Deploy ' || f.name || ' to address limited scalability - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map unclear_ownership to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'unclear_ownership',
  'machine_learning',
  'Deploy ' || f.name || ' to address unclear ownership - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_approval_gates to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_approval_gates',
  'machine_learning',
  'Deploy ' || f.name || ' to address no approval gates - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map documentation_gaps to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'documentation_gaps',
  'machine_learning',
  'Deploy ' || f.name || ' to address documentation gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map review_inconsistency to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'review_inconsistency',
  'machine_learning',
  'Deploy ' || f.name || ' to address review inconsistency - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map change_tracking to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'change_tracking',
  'machine_learning',
  'Deploy ' || f.name || ' to address change tracking - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map accountability_gaps to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'accountability_gaps',
  'machine_learning',
  'Deploy ' || f.name || ' to address accountability gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map risk_exposure to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'risk_exposure',
  'machine_learning',
  'Deploy ' || f.name || ' to address risk exposure - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map compliance_failures to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'compliance_failures',
  'machine_learning',
  'Deploy ' || f.name || ' to address compliance failures - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map incident_response to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'incident_response',
  'machine_learning',
  'Deploy ' || f.name || ' to address incident response - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_lineage to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_lineage',
  'machine_learning',
  'Deploy ' || f.name || ' to address no lineage - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map audit_gaps to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'audit_gaps',
  'machine_learning',
  'Deploy ' || f.name || ' to address audit gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map compliance_manual to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'compliance_manual',
  'machine_learning',
  'Deploy ' || f.name || ' to address compliance manual - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map bias_detection to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'bias_detection',
  'machine_learning',
  'Deploy ' || f.name || ' to address bias detection - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map explainability_gaps to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'explainability_gaps',
  'machine_learning',
  'Deploy ' || f.name || ' to address explainability gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map regulatory_risk to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'regulatory_risk',
  'machine_learning',
  'Deploy ' || f.name || ' to address regulatory risk - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map audit_failures to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'audit_failures',
  'machine_learning',
  'Deploy ' || f.name || ' to address audit failures - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map bias_incidents to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'bias_incidents',
  'machine_learning',
  'Deploy ' || f.name || ' to address bias incidents - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reputation_damage to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reputation_damage',
  'machine_learning',
  'Deploy ' || f.name || ' to address reputation damage - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map legal_exposure to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'legal_exposure',
  'machine_learning',
  'Deploy ' || f.name || ' to address legal exposure - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map pilot_to_prod_gap to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'pilot_to_prod_gap',
  'machine_learning',
  'Deploy ' || f.name || ' to address pilot to prod gap - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map deployment_barriers to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'deployment_barriers',
  'machine_learning',
  'Deploy ' || f.name || ' to address deployment barriers - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map infrastructure_gaps to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'infrastructure_gaps',
  'machine_learning',
  'Deploy ' || f.name || ' to address infrastructure gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map integration_complexity to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'integration_complexity',
  'machine_learning',
  'Deploy ' || f.name || ' to address integration complexity - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map performance_issues to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'performance_issues',
  'machine_learning',
  'Deploy ' || f.name || ' to address performance issues - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map low_roi to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'low_roi',
  'machine_learning',
  'Deploy ' || f.name || ' to address low roi - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map failed_pilots to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'failed_pilots',
  'machine_learning',
  'Deploy ' || f.name || ' to address failed pilots - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map long_timelines to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'long_timelines',
  'machine_learning',
  'Deploy ' || f.name || ' to address long timelines - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map value_realization to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'value_realization',
  'machine_learning',
  'Deploy ' || f.name || ' to address value realization - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map stakeholder_frustration to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'stakeholder_frustration',
  'machine_learning',
  'Deploy ' || f.name || ' to address stakeholder frustration - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map custom_solutions to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'custom_solutions',
  'machine_learning',
  'Deploy ' || f.name || ' to address custom solutions - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map platform_gaps to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'platform_gaps',
  'machine_learning',
  'Deploy ' || f.name || ' to address platform gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map resource_constraints to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'resource_constraints',
  'machine_learning',
  'Deploy ' || f.name || ' to address resource constraints - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map knowledge_silos to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'knowledge_silos',
  'machine_learning',
  'Deploy ' || f.name || ' to address knowledge silos - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map tooling_fragmentation to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'tooling_fragmentation',
  'machine_learning',
  'Deploy ' || f.name || ' to address tooling fragmentation - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map limited_ml_adoption to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'limited_ml_adoption',
  'machine_learning',
  'Deploy ' || f.name || ' to address limited ml adoption - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map long_onboarding to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'long_onboarding',
  'machine_learning',
  'Deploy ' || f.name || ' to address long onboarding - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map team_bottleneck to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'team_bottleneck',
  'machine_learning',
  'Deploy ' || f.name || ' to address team bottleneck - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map missed_opportunities to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'missed_opportunities',
  'machine_learning',
  'Deploy ' || f.name || ' to address missed opportunities - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map competitive_lag to all machine_learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'competitive_lag',
  'machine_learning',
  'Deploy ' || f.name || ' to address competitive lag - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine_learning'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;


-- GENERATIVE_AI (97 pain points)
-- Categories: generative_ai
-- ============================================================================

-- Map no_strategy to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_strategy',
  'generative_ai',
  'Deploy ' || f.name || ' to address no strategy - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map disconnected_efforts to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'disconnected_efforts',
  'generative_ai',
  'Deploy ' || f.name || ' to address disconnected efforts - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map unclear_use_cases to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'unclear_use_cases',
  'generative_ai',
  'Deploy ' || f.name || ' to address unclear use cases - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map technology_uncertainty to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'technology_uncertainty',
  'generative_ai',
  'Deploy ' || f.name || ' to address technology uncertainty - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map skills_gaps to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'skills_gaps',
  'generative_ai',
  'Deploy ' || f.name || ' to address skills gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map competitive_pressure to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'competitive_pressure',
  'generative_ai',
  'Deploy ' || f.name || ' to address competitive pressure - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map unclear_roi to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'unclear_roi',
  'generative_ai',
  'Deploy ' || f.name || ' to address unclear roi - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map missed_opportunities to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'missed_opportunities',
  'generative_ai',
  'Deploy ' || f.name || ' to address missed opportunities - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map budget_uncertainty to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'budget_uncertainty',
  'generative_ai',
  'Deploy ' || f.name || ' to address budget uncertainty - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map stakeholder_expectations to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'stakeholder_expectations',
  'generative_ai',
  'Deploy ' || f.name || ' to address stakeholder expectations - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map vague_requirements to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'vague_requirements',
  'generative_ai',
  'Deploy ' || f.name || ' to address vague requirements - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map unrealistic_expectations to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'unrealistic_expectations',
  'generative_ai',
  'Deploy ' || f.name || ' to address unrealistic expectations - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_readiness to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_readiness',
  'generative_ai',
  'Deploy ' || f.name || ' to address data readiness - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map poc_challenges to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'poc_challenges',
  'generative_ai',
  'Deploy ' || f.name || ' to address poc challenges - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map evaluation_gaps to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'evaluation_gaps',
  'generative_ai',
  'Deploy ' || f.name || ' to address evaluation gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map scattered_efforts to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'scattered_efforts',
  'generative_ai',
  'Deploy ' || f.name || ' to address scattered efforts - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map value_uncertainty to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'value_uncertainty',
  'generative_ai',
  'Deploy ' || f.name || ' to address value uncertainty - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map prioritization_challenges to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'prioritization_challenges',
  'generative_ai',
  'Deploy ' || f.name || ' to address prioritization challenges - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map resource_waste to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'resource_waste',
  'generative_ai',
  'Deploy ' || f.name || ' to address resource waste - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map stakeholder_confusion to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'stakeholder_confusion',
  'generative_ai',
  'Deploy ' || f.name || ' to address stakeholder confusion - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map unstructured_data to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'unstructured_data',
  'generative_ai',
  'Deploy ' || f.name || ' to address unstructured data - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_vector_search to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_vector_search',
  'generative_ai',
  'Deploy ' || f.name || ' to address no vector search - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_quality to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_quality',
  'generative_ai',
  'Deploy ' || f.name || ' to address data quality - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map chunking_challenges to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'chunking_challenges',
  'generative_ai',
  'Deploy ' || f.name || ' to address chunking challenges - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map integration_gaps to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'integration_gaps',
  'generative_ai',
  'Deploy ' || f.name || ' to address integration gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map limited_context to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'limited_context',
  'generative_ai',
  'Deploy ' || f.name || ' to address limited context - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map hallucinations to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'hallucinations',
  'generative_ai',
  'Deploy ' || f.name || ' to address hallucinations - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map poor_relevance to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'poor_relevance',
  'generative_ai',
  'Deploy ' || f.name || ' to address poor relevance - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_prep_delays to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_prep_delays',
  'generative_ai',
  'Deploy ' || f.name || ' to address data prep delays - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map business_impact to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'business_impact',
  'generative_ai',
  'Deploy ' || f.name || ' to address business impact - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map ungoverned_sources to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'ungoverned_sources',
  'generative_ai',
  'Deploy ' || f.name || ' to address ungoverned sources - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map version_control to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'version_control',
  'generative_ai',
  'Deploy ' || f.name || ' to address version control - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map quality_checks to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'quality_checks',
  'generative_ai',
  'Deploy ' || f.name || ' to address quality checks - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map access_control to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'access_control',
  'generative_ai',
  'Deploy ' || f.name || ' to address access control - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map lineage_gaps to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'lineage_gaps',
  'generative_ai',
  'Deploy ' || f.name || ' to address lineage gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map output_quality to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'output_quality',
  'generative_ai',
  'Deploy ' || f.name || ' to address output quality - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map trust_issues to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'trust_issues',
  'generative_ai',
  'Deploy ' || f.name || ' to address trust issues - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map compliance_risk to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'compliance_risk',
  'generative_ai',
  'Deploy ' || f.name || ' to address compliance risk - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map misinformation to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'misinformation',
  'generative_ai',
  'Deploy ' || f.name || ' to address misinformation - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reputation_risk to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reputation_risk',
  'generative_ai',
  'Deploy ' || f.name || ' to address reputation risk - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_infrastructure to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_infrastructure',
  'generative_ai',
  'Deploy ' || f.name || ' to address no infrastructure - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map api_limitations to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'api_limitations',
  'generative_ai',
  'Deploy ' || f.name || ' to address api limitations - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map scalability_issues to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'scalability_issues',
  'generative_ai',
  'Deploy ' || f.name || ' to address scalability issues - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map cost_concerns to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'cost_concerns',
  'generative_ai',
  'Deploy ' || f.name || ' to address cost concerns - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map integration_complexity to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'integration_complexity',
  'generative_ai',
  'Deploy ' || f.name || ' to address integration complexity - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map slow_development to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'slow_development',
  'generative_ai',
  'Deploy ' || f.name || ' to address slow development - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map user_experience to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'user_experience',
  'generative_ai',
  'Deploy ' || f.name || ' to address user experience - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reliability_issues to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reliability_issues',
  'generative_ai',
  'Deploy ' || f.name || ' to address reliability issues - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map cost_overruns to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'cost_overruns',
  'generative_ai',
  'Deploy ' || f.name || ' to address cost overruns - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map competitive_lag to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'competitive_lag',
  'generative_ai',
  'Deploy ' || f.name || ' to address competitive lag - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_standards to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_standards',
  'generative_ai',
  'Deploy ' || f.name || ' to address no standards - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map custom_solutions to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'custom_solutions',
  'generative_ai',
  'Deploy ' || f.name || ' to address custom solutions - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map security_gaps to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'security_gaps',
  'generative_ai',
  'Deploy ' || f.name || ' to address security gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map error_handling to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'error_handling',
  'generative_ai',
  'Deploy ' || f.name || ' to address error handling - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map monitoring_gaps to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'monitoring_gaps',
  'generative_ai',
  'Deploy ' || f.name || ' to address monitoring gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map slow_integration to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'slow_integration',
  'generative_ai',
  'Deploy ' || f.name || ' to address slow integration - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map maintenance_burden to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'maintenance_burden',
  'generative_ai',
  'Deploy ' || f.name || ' to address maintenance burden - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map inconsistent_ux to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'inconsistent_ux',
  'generative_ai',
  'Deploy ' || f.name || ' to address inconsistent ux - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map scaling_challenges to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'scaling_challenges',
  'generative_ai',
  'Deploy ' || f.name || ' to address scaling challenges - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map security_incidents to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'security_incidents',
  'generative_ai',
  'Deploy ' || f.name || ' to address security incidents - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_validation to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_validation',
  'generative_ai',
  'Deploy ' || f.name || ' to address no validation - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map manual_review to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'manual_review',
  'generative_ai',
  'Deploy ' || f.name || ' to address manual review - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map hallucination_detection to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'hallucination_detection',
  'generative_ai',
  'Deploy ' || f.name || ' to address hallucination detection - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map quality_metrics to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'quality_metrics',
  'generative_ai',
  'Deploy ' || f.name || ' to address quality metrics - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map testing_gaps to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'testing_gaps',
  'generative_ai',
  'Deploy ' || f.name || ' to address testing gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map user_trust to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'user_trust',
  'generative_ai',
  'Deploy ' || f.name || ' to address user trust - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map business_risk to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'business_risk',
  'generative_ai',
  'Deploy ' || f.name || ' to address business risk - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map manual_overhead to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'manual_overhead',
  'generative_ai',
  'Deploy ' || f.name || ' to address manual overhead - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reputation_damage to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reputation_damage',
  'generative_ai',
  'Deploy ' || f.name || ' to address reputation damage - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_monitoring to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_monitoring',
  'generative_ai',
  'Deploy ' || f.name || ' to address no monitoring - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map drift_detection to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'drift_detection',
  'generative_ai',
  'Deploy ' || f.name || ' to address drift detection - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map content_safety to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'content_safety',
  'generative_ai',
  'Deploy ' || f.name || ' to address content safety - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map user_feedback to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'user_feedback',
  'generative_ai',
  'Deploy ' || f.name || ' to address user feedback - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map alert_gaps to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'alert_gaps',
  'generative_ai',
  'Deploy ' || f.name || ' to address alert gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map silent_degradation to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'silent_degradation',
  'generative_ai',
  'Deploy ' || f.name || ' to address silent degradation - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map safety_incidents to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'safety_incidents',
  'generative_ai',
  'Deploy ' || f.name || ' to address safety incidents - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map user_complaints to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'user_complaints',
  'generative_ai',
  'Deploy ' || f.name || ' to address user complaints - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map brand_risk to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'brand_risk',
  'generative_ai',
  'Deploy ' || f.name || ' to address brand risk - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reactive_approach to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reactive_approach',
  'generative_ai',
  'Deploy ' || f.name || ' to address reactive approach - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_guardrails to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_guardrails',
  'generative_ai',
  'Deploy ' || f.name || ' to address no guardrails - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map pii_detection to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'pii_detection',
  'generative_ai',
  'Deploy ' || f.name || ' to address pii detection - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map content_filtering to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'content_filtering',
  'generative_ai',
  'Deploy ' || f.name || ' to address content filtering - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map bias_detection to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'bias_detection',
  'generative_ai',
  'Deploy ' || f.name || ' to address bias detection - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map policy_enforcement to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'policy_enforcement',
  'generative_ai',
  'Deploy ' || f.name || ' to address policy enforcement - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_breaches to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_breaches',
  'generative_ai',
  'Deploy ' || f.name || ' to address data breaches - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map ethical_concerns to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'ethical_concerns',
  'generative_ai',
  'Deploy ' || f.name || ' to address ethical concerns - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map legal_exposure to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'legal_exposure',
  'generative_ai',
  'Deploy ' || f.name || ' to address legal exposure - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map adoption_barriers to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'adoption_barriers',
  'generative_ai',
  'Deploy ' || f.name || ' to address adoption barriers - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_logging to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_logging',
  'generative_ai',
  'Deploy ' || f.name || ' to address no logging - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map audit_trails to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'audit_trails',
  'generative_ai',
  'Deploy ' || f.name || ' to address audit trails - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map explainability to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'explainability',
  'generative_ai',
  'Deploy ' || f.name || ' to address explainability - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map user_attribution to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'user_attribution',
  'generative_ai',
  'Deploy ' || f.name || ' to address user attribution - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map accountability_gaps to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'accountability_gaps',
  'generative_ai',
  'Deploy ' || f.name || ' to address accountability gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map audit_failures to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'audit_failures',
  'generative_ai',
  'Deploy ' || f.name || ' to address audit failures - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map debugging_difficulty to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'debugging_difficulty',
  'generative_ai',
  'Deploy ' || f.name || ' to address debugging difficulty - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map trust_deficit to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'trust_deficit',
  'generative_ai',
  'Deploy ' || f.name || ' to address trust deficit - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map regulatory_risk to all generative_ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'regulatory_risk',
  'generative_ai',
  'Deploy ' || f.name || ' to address regulatory risk - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative_ai'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;


-- OPERATIONAL_EXCELLENCE (90 pain points)
-- Categories: platform, data_engineering, analytics
-- ============================================================================

-- Map no_coe to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_coe',
  'operational_excellence',
  'Deploy ' || f.name || ' to address no coe - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_coe to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_coe',
  'operational_excellence',
  'Deploy ' || f.name || ' to address no coe - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_coe to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_coe',
  'operational_excellence',
  'Deploy ' || f.name || ' to address no coe - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map unclear_charter to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'unclear_charter',
  'operational_excellence',
  'Deploy ' || f.name || ' to address unclear charter - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map unclear_charter to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'unclear_charter',
  'operational_excellence',
  'Deploy ' || f.name || ' to address unclear charter - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map unclear_charter to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'unclear_charter',
  'operational_excellence',
  'Deploy ' || f.name || ' to address unclear charter - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map resource_constraints to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'resource_constraints',
  'operational_excellence',
  'Deploy ' || f.name || ' to address resource constraints - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map resource_constraints to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'resource_constraints',
  'operational_excellence',
  'Deploy ' || f.name || ' to address resource constraints - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map resource_constraints to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'resource_constraints',
  'operational_excellence',
  'Deploy ' || f.name || ' to address resource constraints - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map standards_gaps to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'standards_gaps',
  'operational_excellence',
  'Deploy ' || f.name || ' to address standards gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map standards_gaps to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'standards_gaps',
  'operational_excellence',
  'Deploy ' || f.name || ' to address standards gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map standards_gaps to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'standards_gaps',
  'operational_excellence',
  'Deploy ' || f.name || ' to address standards gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map adoption_challenges to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'adoption_challenges',
  'operational_excellence',
  'Deploy ' || f.name || ' to address adoption challenges - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map adoption_challenges to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'adoption_challenges',
  'operational_excellence',
  'Deploy ' || f.name || ' to address adoption challenges - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map adoption_challenges to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'adoption_challenges',
  'operational_excellence',
  'Deploy ' || f.name || ' to address adoption challenges - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map inconsistent_practices to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'inconsistent_practices',
  'operational_excellence',
  'Deploy ' || f.name || ' to address inconsistent practices - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map inconsistent_practices to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'inconsistent_practices',
  'operational_excellence',
  'Deploy ' || f.name || ' to address inconsistent practices - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map inconsistent_practices to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'inconsistent_practices',
  'operational_excellence',
  'Deploy ' || f.name || ' to address inconsistent practices - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map knowledge_silos to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'knowledge_silos',
  'operational_excellence',
  'Deploy ' || f.name || ' to address knowledge silos - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map knowledge_silos to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'knowledge_silos',
  'operational_excellence',
  'Deploy ' || f.name || ' to address knowledge silos - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map knowledge_silos to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'knowledge_silos',
  'operational_excellence',
  'Deploy ' || f.name || ' to address knowledge silos - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map slow_adoption to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'slow_adoption',
  'operational_excellence',
  'Deploy ' || f.name || ' to address slow adoption - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map slow_adoption to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'slow_adoption',
  'operational_excellence',
  'Deploy ' || f.name || ' to address slow adoption - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map slow_adoption to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'slow_adoption',
  'operational_excellence',
  'Deploy ' || f.name || ' to address slow adoption - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map quality_issues to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'quality_issues',
  'operational_excellence',
  'Deploy ' || f.name || ' to address quality issues - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map quality_issues to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'quality_issues',
  'operational_excellence',
  'Deploy ' || f.name || ' to address quality issues - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map quality_issues to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'quality_issues',
  'operational_excellence',
  'Deploy ' || f.name || ' to address quality issues - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map innovation_barriers to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'innovation_barriers',
  'operational_excellence',
  'Deploy ' || f.name || ' to address innovation barriers - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map innovation_barriers to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'innovation_barriers',
  'operational_excellence',
  'Deploy ' || f.name || ' to address innovation barriers - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map innovation_barriers to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'innovation_barriers',
  'operational_excellence',
  'Deploy ' || f.name || ' to address innovation barriers - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map low_influence to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'low_influence',
  'operational_excellence',
  'Deploy ' || f.name || ' to address low influence - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map low_influence to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'low_influence',
  'operational_excellence',
  'Deploy ' || f.name || ' to address low influence - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map low_influence to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'low_influence',
  'operational_excellence',
  'Deploy ' || f.name || ' to address low influence - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map communication_gaps to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'communication_gaps',
  'operational_excellence',
  'Deploy ' || f.name || ' to address communication gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map communication_gaps to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'communication_gaps',
  'operational_excellence',
  'Deploy ' || f.name || ' to address communication gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map communication_gaps to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'communication_gaps',
  'operational_excellence',
  'Deploy ' || f.name || ' to address communication gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map tooling_gaps to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'tooling_gaps',
  'operational_excellence',
  'Deploy ' || f.name || ' to address tooling gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map tooling_gaps to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'tooling_gaps',
  'operational_excellence',
  'Deploy ' || f.name || ' to address tooling gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map tooling_gaps to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'tooling_gaps',
  'operational_excellence',
  'Deploy ' || f.name || ' to address tooling gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map feedback_loops to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'feedback_loops',
  'operational_excellence',
  'Deploy ' || f.name || ' to address feedback loops - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map feedback_loops to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'feedback_loops',
  'operational_excellence',
  'Deploy ' || f.name || ' to address feedback loops - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map feedback_loops to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'feedback_loops',
  'operational_excellence',
  'Deploy ' || f.name || ' to address feedback loops - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map measurement_gaps to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'measurement_gaps',
  'operational_excellence',
  'Deploy ' || f.name || ' to address measurement gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map measurement_gaps to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'measurement_gaps',
  'operational_excellence',
  'Deploy ' || f.name || ' to address measurement gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map measurement_gaps to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'measurement_gaps',
  'operational_excellence',
  'Deploy ' || f.name || ' to address measurement gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map governance_gaps to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'governance_gaps',
  'operational_excellence',
  'Deploy ' || f.name || ' to address governance gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map governance_gaps to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'governance_gaps',
  'operational_excellence',
  'Deploy ' || f.name || ' to address governance gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map governance_gaps to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'governance_gaps',
  'operational_excellence',
  'Deploy ' || f.name || ' to address governance gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map architecture_debt to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'architecture_debt',
  'operational_excellence',
  'Deploy ' || f.name || ' to address architecture debt - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map architecture_debt to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'architecture_debt',
  'operational_excellence',
  'Deploy ' || f.name || ' to address architecture debt - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map architecture_debt to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'architecture_debt',
  'operational_excellence',
  'Deploy ' || f.name || ' to address architecture debt - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map team_confusion to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'team_confusion',
  'operational_excellence',
  'Deploy ' || f.name || ' to address team confusion - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map team_confusion to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'team_confusion',
  'operational_excellence',
  'Deploy ' || f.name || ' to address team confusion - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map team_confusion to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'team_confusion',
  'operational_excellence',
  'Deploy ' || f.name || ' to address team confusion - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map onboarding_delays to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'onboarding_delays',
  'operational_excellence',
  'Deploy ' || f.name || ' to address onboarding delays - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map onboarding_delays to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'onboarding_delays',
  'operational_excellence',
  'Deploy ' || f.name || ' to address onboarding delays - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map onboarding_delays to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'onboarding_delays',
  'operational_excellence',
  'Deploy ' || f.name || ' to address onboarding delays - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map roi_unclear to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'roi_unclear',
  'operational_excellence',
  'Deploy ' || f.name || ' to address roi unclear - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map roi_unclear to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'roi_unclear',
  'operational_excellence',
  'Deploy ' || f.name || ' to address roi unclear - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map roi_unclear to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'roi_unclear',
  'operational_excellence',
  'Deploy ' || f.name || ' to address roi unclear - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map siloed_teams to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'siloed_teams',
  'operational_excellence',
  'Deploy ' || f.name || ' to address siloed teams - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map siloed_teams to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'siloed_teams',
  'operational_excellence',
  'Deploy ' || f.name || ' to address siloed teams - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map siloed_teams to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'siloed_teams',
  'operational_excellence',
  'Deploy ' || f.name || ' to address siloed teams - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_sharing_platform to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_sharing_platform',
  'operational_excellence',
  'Deploy ' || f.name || ' to address no sharing platform - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_sharing_platform to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_sharing_platform',
  'operational_excellence',
  'Deploy ' || f.name || ' to address no sharing platform - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_sharing_platform to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_sharing_platform',
  'operational_excellence',
  'Deploy ' || f.name || ' to address no sharing platform - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map documentation_gaps to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'documentation_gaps',
  'operational_excellence',
  'Deploy ' || f.name || ' to address documentation gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map documentation_gaps to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'documentation_gaps',
  'operational_excellence',
  'Deploy ' || f.name || ' to address documentation gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map documentation_gaps to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'documentation_gaps',
  'operational_excellence',
  'Deploy ' || f.name || ' to address documentation gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map code_reuse to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'code_reuse',
  'operational_excellence',
  'Deploy ' || f.name || ' to address code reuse - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map code_reuse to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'code_reuse',
  'operational_excellence',
  'Deploy ' || f.name || ' to address code reuse - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map code_reuse to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'code_reuse',
  'operational_excellence',
  'Deploy ' || f.name || ' to address code reuse - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map learning_barriers to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'learning_barriers',
  'operational_excellence',
  'Deploy ' || f.name || ' to address learning barriers - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map learning_barriers to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'learning_barriers',
  'operational_excellence',
  'Deploy ' || f.name || ' to address learning barriers - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map learning_barriers to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'learning_barriers',
  'operational_excellence',
  'Deploy ' || f.name || ' to address learning barriers - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map duplicate_work to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'duplicate_work',
  'operational_excellence',
  'Deploy ' || f.name || ' to address duplicate work - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map duplicate_work to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'duplicate_work',
  'operational_excellence',
  'Deploy ' || f.name || ' to address duplicate work - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map duplicate_work to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'duplicate_work',
  'operational_excellence',
  'Deploy ' || f.name || ' to address duplicate work - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map slow_problem_solving to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'slow_problem_solving',
  'operational_excellence',
  'Deploy ' || f.name || ' to address slow problem solving - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map slow_problem_solving to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'slow_problem_solving',
  'operational_excellence',
  'Deploy ' || f.name || ' to address slow problem solving - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map slow_problem_solving to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'slow_problem_solving',
  'operational_excellence',
  'Deploy ' || f.name || ' to address slow problem solving - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map innovation_lag to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'innovation_lag',
  'operational_excellence',
  'Deploy ' || f.name || ' to address innovation lag - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map innovation_lag to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'innovation_lag',
  'operational_excellence',
  'Deploy ' || f.name || ' to address innovation lag - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map innovation_lag to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'innovation_lag',
  'operational_excellence',
  'Deploy ' || f.name || ' to address innovation lag - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map onboarding_friction to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'onboarding_friction',
  'operational_excellence',
  'Deploy ' || f.name || ' to address onboarding friction - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map onboarding_friction to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'onboarding_friction',
  'operational_excellence',
  'Deploy ' || f.name || ' to address onboarding friction - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map onboarding_friction to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'onboarding_friction',
  'operational_excellence',
  'Deploy ' || f.name || ' to address onboarding friction - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map knowledge_loss to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'knowledge_loss',
  'operational_excellence',
  'Deploy ' || f.name || ' to address knowledge loss - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map knowledge_loss to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'knowledge_loss',
  'operational_excellence',
  'Deploy ' || f.name || ' to address knowledge loss - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map knowledge_loss to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'knowledge_loss',
  'operational_excellence',
  'Deploy ' || f.name || ' to address knowledge loss - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_asset_catalog to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_asset_catalog',
  'operational_excellence',
  'Deploy ' || f.name || ' to address no asset catalog - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_asset_catalog to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_asset_catalog',
  'operational_excellence',
  'Deploy ' || f.name || ' to address no asset catalog - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_asset_catalog to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_asset_catalog',
  'operational_excellence',
  'Deploy ' || f.name || ' to address no asset catalog - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map discovery_difficulty to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'discovery_difficulty',
  'operational_excellence',
  'Deploy ' || f.name || ' to address discovery difficulty - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map discovery_difficulty to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'discovery_difficulty',
  'operational_excellence',
  'Deploy ' || f.name || ' to address discovery difficulty - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map discovery_difficulty to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'discovery_difficulty',
  'operational_excellence',
  'Deploy ' || f.name || ' to address discovery difficulty - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map version_control to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'version_control',
  'operational_excellence',
  'Deploy ' || f.name || ' to address version control - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map version_control to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'version_control',
  'operational_excellence',
  'Deploy ' || f.name || ' to address version control - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map version_control to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'version_control',
  'operational_excellence',
  'Deploy ' || f.name || ' to address version control - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map quality_standards to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'quality_standards',
  'operational_excellence',
  'Deploy ' || f.name || ' to address quality standards - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map quality_standards to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'quality_standards',
  'operational_excellence',
  'Deploy ' || f.name || ' to address quality standards - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map quality_standards to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'quality_standards',
  'operational_excellence',
  'Deploy ' || f.name || ' to address quality standards - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map low_reuse to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'low_reuse',
  'operational_excellence',
  'Deploy ' || f.name || ' to address low reuse - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map low_reuse to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'low_reuse',
  'operational_excellence',
  'Deploy ' || f.name || ' to address low reuse - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map low_reuse to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'low_reuse',
  'operational_excellence',
  'Deploy ' || f.name || ' to address low reuse - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reinvention to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reinvention',
  'operational_excellence',
  'Deploy ' || f.name || ' to address reinvention - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reinvention to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reinvention',
  'operational_excellence',
  'Deploy ' || f.name || ' to address reinvention - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reinvention to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reinvention',
  'operational_excellence',
  'Deploy ' || f.name || ' to address reinvention - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map velocity_impact to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'velocity_impact',
  'operational_excellence',
  'Deploy ' || f.name || ' to address velocity impact - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map velocity_impact to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'velocity_impact',
  'operational_excellence',
  'Deploy ' || f.name || ' to address velocity impact - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map velocity_impact to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'velocity_impact',
  'operational_excellence',
  'Deploy ' || f.name || ' to address velocity impact - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map quality_inconsistency to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'quality_inconsistency',
  'operational_excellence',
  'Deploy ' || f.name || ' to address quality inconsistency - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map quality_inconsistency to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'quality_inconsistency',
  'operational_excellence',
  'Deploy ' || f.name || ' to address quality inconsistency - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map quality_inconsistency to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'quality_inconsistency',
  'operational_excellence',
  'Deploy ' || f.name || ' to address quality inconsistency - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map maintenance_burden to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'maintenance_burden',
  'operational_excellence',
  'Deploy ' || f.name || ' to address maintenance burden - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map maintenance_burden to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'maintenance_burden',
  'operational_excellence',
  'Deploy ' || f.name || ' to address maintenance burden - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map maintenance_burden to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'maintenance_burden',
  'operational_excellence',
  'Deploy ' || f.name || ' to address maintenance burden - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_formal_training to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_formal_training',
  'operational_excellence',
  'Deploy ' || f.name || ' to address no formal training - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_formal_training to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_formal_training',
  'operational_excellence',
  'Deploy ' || f.name || ' to address no formal training - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_formal_training to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_formal_training',
  'operational_excellence',
  'Deploy ' || f.name || ' to address no formal training - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map outdated_content to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'outdated_content',
  'operational_excellence',
  'Deploy ' || f.name || ' to address outdated content - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map outdated_content to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'outdated_content',
  'operational_excellence',
  'Deploy ' || f.name || ' to address outdated content - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map outdated_content to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'outdated_content',
  'operational_excellence',
  'Deploy ' || f.name || ' to address outdated content - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map limited_coverage to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'limited_coverage',
  'operational_excellence',
  'Deploy ' || f.name || ' to address limited coverage - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map limited_coverage to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'limited_coverage',
  'operational_excellence',
  'Deploy ' || f.name || ' to address limited coverage - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map limited_coverage to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'limited_coverage',
  'operational_excellence',
  'Deploy ' || f.name || ' to address limited coverage - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map access_barriers to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'access_barriers',
  'operational_excellence',
  'Deploy ' || f.name || ' to address access barriers - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map access_barriers to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'access_barriers',
  'operational_excellence',
  'Deploy ' || f.name || ' to address access barriers - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map access_barriers to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'access_barriers',
  'operational_excellence',
  'Deploy ' || f.name || ' to address access barriers - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map hands_on_gaps to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'hands_on_gaps',
  'operational_excellence',
  'Deploy ' || f.name || ' to address hands on gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map hands_on_gaps to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'hands_on_gaps',
  'operational_excellence',
  'Deploy ' || f.name || ' to address hands on gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map hands_on_gaps to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'hands_on_gaps',
  'operational_excellence',
  'Deploy ' || f.name || ' to address hands on gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map skills_gaps to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'skills_gaps',
  'operational_excellence',
  'Deploy ' || f.name || ' to address skills gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map skills_gaps to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'skills_gaps',
  'operational_excellence',
  'Deploy ' || f.name || ' to address skills gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map skills_gaps to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'skills_gaps',
  'operational_excellence',
  'Deploy ' || f.name || ' to address skills gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map support_burden to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'support_burden',
  'operational_excellence',
  'Deploy ' || f.name || ' to address support burden - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map support_burden to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'support_burden',
  'operational_excellence',
  'Deploy ' || f.name || ' to address support burden - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map support_burden to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'support_burden',
  'operational_excellence',
  'Deploy ' || f.name || ' to address support burden - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map underutilization to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'underutilization',
  'operational_excellence',
  'Deploy ' || f.name || ' to address underutilization - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map underutilization to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'underutilization',
  'operational_excellence',
  'Deploy ' || f.name || ' to address underutilization - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map underutilization to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'underutilization',
  'operational_excellence',
  'Deploy ' || f.name || ' to address underutilization - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map employee_frustration to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'employee_frustration',
  'operational_excellence',
  'Deploy ' || f.name || ' to address employee frustration - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map employee_frustration to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'employee_frustration',
  'operational_excellence',
  'Deploy ' || f.name || ' to address employee frustration - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map employee_frustration to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'employee_frustration',
  'operational_excellence',
  'Deploy ' || f.name || ' to address employee frustration - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_updates to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_updates',
  'operational_excellence',
  'Deploy ' || f.name || ' to address no updates - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_updates to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_updates',
  'operational_excellence',
  'Deploy ' || f.name || ' to address no updates - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_updates to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_updates',
  'operational_excellence',
  'Deploy ' || f.name || ' to address no updates - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map demo_gaps to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'demo_gaps',
  'operational_excellence',
  'Deploy ' || f.name || ' to address demo gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map demo_gaps to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'demo_gaps',
  'operational_excellence',
  'Deploy ' || f.name || ' to address demo gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map demo_gaps to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'demo_gaps',
  'operational_excellence',
  'Deploy ' || f.name || ' to address demo gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map capability_unawareness to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'capability_unawareness',
  'operational_excellence',
  'Deploy ' || f.name || ' to address capability unawareness - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map capability_unawareness to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'capability_unawareness',
  'operational_excellence',
  'Deploy ' || f.name || ' to address capability unawareness - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map capability_unawareness to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'capability_unawareness',
  'operational_excellence',
  'Deploy ' || f.name || ' to address capability unawareness - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map missed_opportunities to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'missed_opportunities',
  'operational_excellence',
  'Deploy ' || f.name || ' to address missed opportunities - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map missed_opportunities to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'missed_opportunities',
  'operational_excellence',
  'Deploy ' || f.name || ' to address missed opportunities - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map missed_opportunities to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'missed_opportunities',
  'operational_excellence',
  'Deploy ' || f.name || ' to address missed opportunities - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map stale_practices to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'stale_practices',
  'operational_excellence',
  'Deploy ' || f.name || ' to address stale practices - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map stale_practices to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'stale_practices',
  'operational_excellence',
  'Deploy ' || f.name || ' to address stale practices - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map stale_practices to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'stale_practices',
  'operational_excellence',
  'Deploy ' || f.name || ' to address stale practices - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map competitive_lag to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'competitive_lag',
  'operational_excellence',
  'Deploy ' || f.name || ' to address competitive lag - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map competitive_lag to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'competitive_lag',
  'operational_excellence',
  'Deploy ' || f.name || ' to address competitive lag - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map competitive_lag to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'competitive_lag',
  'operational_excellence',
  'Deploy ' || f.name || ' to address competitive lag - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_tracking to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_tracking',
  'operational_excellence',
  'Deploy ' || f.name || ' to address no tracking - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_tracking to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_tracking',
  'operational_excellence',
  'Deploy ' || f.name || ' to address no tracking - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_tracking to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_tracking',
  'operational_excellence',
  'Deploy ' || f.name || ' to address no tracking - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map attribution_gaps to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'attribution_gaps',
  'operational_excellence',
  'Deploy ' || f.name || ' to address attribution gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map attribution_gaps to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'attribution_gaps',
  'operational_excellence',
  'Deploy ' || f.name || ' to address attribution gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map attribution_gaps to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'attribution_gaps',
  'operational_excellence',
  'Deploy ' || f.name || ' to address attribution gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map metric_gaps to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'metric_gaps',
  'operational_excellence',
  'Deploy ' || f.name || ' to address metric gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map metric_gaps to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'metric_gaps',
  'operational_excellence',
  'Deploy ' || f.name || ' to address metric gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map metric_gaps to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'metric_gaps',
  'operational_excellence',
  'Deploy ' || f.name || ' to address metric gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reporting_complexity to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reporting_complexity',
  'operational_excellence',
  'Deploy ' || f.name || ' to address reporting complexity - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reporting_complexity to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reporting_complexity',
  'operational_excellence',
  'Deploy ' || f.name || ' to address reporting complexity - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reporting_complexity to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reporting_complexity',
  'operational_excellence',
  'Deploy ' || f.name || ' to address reporting complexity - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_quality to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_quality',
  'operational_excellence',
  'Deploy ' || f.name || ' to address data quality - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_quality to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_quality',
  'operational_excellence',
  'Deploy ' || f.name || ' to address data quality - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_quality to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_quality',
  'operational_excellence',
  'Deploy ' || f.name || ' to address data quality - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map budget_justification to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'budget_justification',
  'operational_excellence',
  'Deploy ' || f.name || ' to address budget justification - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map budget_justification to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'budget_justification',
  'operational_excellence',
  'Deploy ' || f.name || ' to address budget justification - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map budget_justification to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'budget_justification',
  'operational_excellence',
  'Deploy ' || f.name || ' to address budget justification - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map cost_perception to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'cost_perception',
  'operational_excellence',
  'Deploy ' || f.name || ' to address cost perception - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map cost_perception to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'cost_perception',
  'operational_excellence',
  'Deploy ' || f.name || ' to address cost perception - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map cost_perception to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'cost_perception',
  'operational_excellence',
  'Deploy ' || f.name || ' to address cost perception - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map optimization_challenges to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'optimization_challenges',
  'operational_excellence',
  'Deploy ' || f.name || ' to address optimization challenges - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map optimization_challenges to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'optimization_challenges',
  'operational_excellence',
  'Deploy ' || f.name || ' to address optimization challenges - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map optimization_challenges to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'optimization_challenges',
  'operational_excellence',
  'Deploy ' || f.name || ' to address optimization challenges - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map stakeholder_skepticism to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'stakeholder_skepticism',
  'operational_excellence',
  'Deploy ' || f.name || ' to address stakeholder skepticism - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map stakeholder_skepticism to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'stakeholder_skepticism',
  'operational_excellence',
  'Deploy ' || f.name || ' to address stakeholder skepticism - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map stakeholder_skepticism to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'stakeholder_skepticism',
  'operational_excellence',
  'Deploy ' || f.name || ' to address stakeholder skepticism - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_reviews to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_reviews',
  'operational_excellence',
  'Deploy ' || f.name || ' to address no reviews - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_reviews to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_reviews',
  'operational_excellence',
  'Deploy ' || f.name || ' to address no reviews - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_reviews to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_reviews',
  'operational_excellence',
  'Deploy ' || f.name || ' to address no reviews - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map manual_analysis to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'manual_analysis',
  'operational_excellence',
  'Deploy ' || f.name || ' to address manual analysis - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map manual_analysis to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'manual_analysis',
  'operational_excellence',
  'Deploy ' || f.name || ' to address manual analysis - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map manual_analysis to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'manual_analysis',
  'operational_excellence',
  'Deploy ' || f.name || ' to address manual analysis - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map action_gaps to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'action_gaps',
  'operational_excellence',
  'Deploy ' || f.name || ' to address action gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map action_gaps to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'action_gaps',
  'operational_excellence',
  'Deploy ' || f.name || ' to address action gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map action_gaps to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'action_gaps',
  'operational_excellence',
  'Deploy ' || f.name || ' to address action gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map stakeholder_engagement to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'stakeholder_engagement',
  'operational_excellence',
  'Deploy ' || f.name || ' to address stakeholder engagement - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map stakeholder_engagement to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'stakeholder_engagement',
  'operational_excellence',
  'Deploy ' || f.name || ' to address stakeholder engagement - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map stakeholder_engagement to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'stakeholder_engagement',
  'operational_excellence',
  'Deploy ' || f.name || ' to address stakeholder engagement - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map wasted_spend to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'wasted_spend',
  'operational_excellence',
  'Deploy ' || f.name || ' to address wasted spend - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map wasted_spend to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'wasted_spend',
  'operational_excellence',
  'Deploy ' || f.name || ' to address wasted spend - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map wasted_spend to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'wasted_spend',
  'operational_excellence',
  'Deploy ' || f.name || ' to address wasted spend - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map misaligned_priorities to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'misaligned_priorities',
  'operational_excellence',
  'Deploy ' || f.name || ' to address misaligned priorities - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map misaligned_priorities to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'misaligned_priorities',
  'operational_excellence',
  'Deploy ' || f.name || ' to address misaligned priorities - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map misaligned_priorities to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'misaligned_priorities',
  'operational_excellence',
  'Deploy ' || f.name || ' to address misaligned priorities - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reactive_approach to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reactive_approach',
  'operational_excellence',
  'Deploy ' || f.name || ' to address reactive approach - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reactive_approach to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reactive_approach',
  'operational_excellence',
  'Deploy ' || f.name || ' to address reactive approach - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reactive_approach to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reactive_approach',
  'operational_excellence',
  'Deploy ' || f.name || ' to address reactive approach - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map budget_overruns to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'budget_overruns',
  'operational_excellence',
  'Deploy ' || f.name || ' to address budget overruns - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map budget_overruns to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'budget_overruns',
  'operational_excellence',
  'Deploy ' || f.name || ' to address budget overruns - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map budget_overruns to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'budget_overruns',
  'operational_excellence',
  'Deploy ' || f.name || ' to address budget overruns - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map accountability_gaps to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'accountability_gaps',
  'operational_excellence',
  'Deploy ' || f.name || ' to address accountability gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map accountability_gaps to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'accountability_gaps',
  'operational_excellence',
  'Deploy ' || f.name || ' to address accountability gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map accountability_gaps to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'accountability_gaps',
  'operational_excellence',
  'Deploy ' || f.name || ' to address accountability gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_evaluation to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_evaluation',
  'operational_excellence',
  'Deploy ' || f.name || ' to address no evaluation - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_evaluation to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_evaluation',
  'operational_excellence',
  'Deploy ' || f.name || ' to address no evaluation - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_evaluation to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_evaluation',
  'operational_excellence',
  'Deploy ' || f.name || ' to address no evaluation - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map risk_aversion to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'risk_aversion',
  'operational_excellence',
  'Deploy ' || f.name || ' to address risk aversion - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map risk_aversion to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'risk_aversion',
  'operational_excellence',
  'Deploy ' || f.name || ' to address risk aversion - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map risk_aversion to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'risk_aversion',
  'operational_excellence',
  'Deploy ' || f.name || ' to address risk aversion - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map testing_barriers to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'testing_barriers',
  'operational_excellence',
  'Deploy ' || f.name || ' to address testing barriers - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map testing_barriers to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'testing_barriers',
  'operational_excellence',
  'Deploy ' || f.name || ' to address testing barriers - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map testing_barriers to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'testing_barriers',
  'operational_excellence',
  'Deploy ' || f.name || ' to address testing barriers - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map adoption_delays to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'adoption_delays',
  'operational_excellence',
  'Deploy ' || f.name || ' to address adoption delays - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map adoption_delays to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'adoption_delays',
  'operational_excellence',
  'Deploy ' || f.name || ' to address adoption delays - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map adoption_delays to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'adoption_delays',
  'operational_excellence',
  'Deploy ' || f.name || ' to address adoption delays - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map missed_capabilities to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'missed_capabilities',
  'operational_excellence',
  'Deploy ' || f.name || ' to address missed capabilities - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map missed_capabilities to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'missed_capabilities',
  'operational_excellence',
  'Deploy ' || f.name || ' to address missed capabilities - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map missed_capabilities to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'missed_capabilities',
  'operational_excellence',
  'Deploy ' || f.name || ' to address missed capabilities - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map competitive_disadvantage to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'competitive_disadvantage',
  'operational_excellence',
  'Deploy ' || f.name || ' to address competitive disadvantage - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map competitive_disadvantage to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'competitive_disadvantage',
  'operational_excellence',
  'Deploy ' || f.name || ' to address competitive disadvantage - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map competitive_disadvantage to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'competitive_disadvantage',
  'operational_excellence',
  'Deploy ' || f.name || ' to address competitive disadvantage - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map efficiency_gaps to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'efficiency_gaps',
  'operational_excellence',
  'Deploy ' || f.name || ' to address efficiency gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map efficiency_gaps to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'efficiency_gaps',
  'operational_excellence',
  'Deploy ' || f.name || ' to address efficiency gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map efficiency_gaps to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'efficiency_gaps',
  'operational_excellence',
  'Deploy ' || f.name || ' to address efficiency gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map team_frustration to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'team_frustration',
  'operational_excellence',
  'Deploy ' || f.name || ' to address team frustration - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map team_frustration to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'team_frustration',
  'operational_excellence',
  'Deploy ' || f.name || ' to address team frustration - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map team_frustration to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'team_frustration',
  'operational_excellence',
  'Deploy ' || f.name || ' to address team frustration - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_feedback_loop to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_feedback_loop',
  'operational_excellence',
  'Deploy ' || f.name || ' to address no feedback loop - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_feedback_loop to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_feedback_loop',
  'operational_excellence',
  'Deploy ' || f.name || ' to address no feedback loop - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_feedback_loop to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_feedback_loop',
  'operational_excellence',
  'Deploy ' || f.name || ' to address no feedback loop - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map learning_capture to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'learning_capture',
  'operational_excellence',
  'Deploy ' || f.name || ' to address learning capture - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map learning_capture to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'learning_capture',
  'operational_excellence',
  'Deploy ' || f.name || ' to address learning capture - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map learning_capture to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'learning_capture',
  'operational_excellence',
  'Deploy ' || f.name || ' to address learning capture - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map retrospective_gaps to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'retrospective_gaps',
  'operational_excellence',
  'Deploy ' || f.name || ' to address retrospective gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map retrospective_gaps to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'retrospective_gaps',
  'operational_excellence',
  'Deploy ' || f.name || ' to address retrospective gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map retrospective_gaps to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'retrospective_gaps',
  'operational_excellence',
  'Deploy ' || f.name || ' to address retrospective gaps - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map action_tracking to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'action_tracking',
  'operational_excellence',
  'Deploy ' || f.name || ' to address action tracking - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map action_tracking to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'action_tracking',
  'operational_excellence',
  'Deploy ' || f.name || ' to address action tracking - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map action_tracking to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'action_tracking',
  'operational_excellence',
  'Deploy ' || f.name || ' to address action tracking - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map roadmap_disconnect to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'roadmap_disconnect',
  'operational_excellence',
  'Deploy ' || f.name || ' to address roadmap disconnect - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map roadmap_disconnect to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'roadmap_disconnect',
  'operational_excellence',
  'Deploy ' || f.name || ' to address roadmap disconnect - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map roadmap_disconnect to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'roadmap_disconnect',
  'operational_excellence',
  'Deploy ' || f.name || ' to address roadmap disconnect - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map repeated_mistakes to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'repeated_mistakes',
  'operational_excellence',
  'Deploy ' || f.name || ' to address repeated mistakes - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map repeated_mistakes to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'repeated_mistakes',
  'operational_excellence',
  'Deploy ' || f.name || ' to address repeated mistakes - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map repeated_mistakes to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'repeated_mistakes',
  'operational_excellence',
  'Deploy ' || f.name || ' to address repeated mistakes - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map slow_improvement to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'slow_improvement',
  'operational_excellence',
  'Deploy ' || f.name || ' to address slow improvement - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map slow_improvement to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'slow_improvement',
  'operational_excellence',
  'Deploy ' || f.name || ' to address slow improvement - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map slow_improvement to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'slow_improvement',
  'operational_excellence',
  'Deploy ' || f.name || ' to address slow improvement - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map team_disengagement to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'team_disengagement',
  'operational_excellence',
  'Deploy ' || f.name || ' to address team disengagement - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map team_disengagement to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'team_disengagement',
  'operational_excellence',
  'Deploy ' || f.name || ' to address team disengagement - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map team_disengagement to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'team_disengagement',
  'operational_excellence',
  'Deploy ' || f.name || ' to address team disengagement - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map value_leakage to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'value_leakage',
  'operational_excellence',
  'Deploy ' || f.name || ' to address value leakage - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map value_leakage to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'value_leakage',
  'operational_excellence',
  'Deploy ' || f.name || ' to address value leakage - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map value_leakage to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'value_leakage',
  'operational_excellence',
  'Deploy ' || f.name || ' to address value leakage - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map culture_impact to all platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'culture_impact',
  'operational_excellence',
  'Deploy ' || f.name || ' to address culture impact - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map culture_impact to all data_engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'culture_impact',
  'operational_excellence',
  'Deploy ' || f.name || ' to address culture impact - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data_engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map culture_impact to all analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'culture_impact',
  'operational_excellence',
  'Deploy ' || f.name || ' to address culture impact - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;


-- ============================================================================
-- Summary
-- Total unique pain points: 442
-- Total potential mappings: 622
-- ============================================================================
