-- ============================================================================
-- COMPREHENSIVE PAIN POINT MAPPINGS - ALL 442 PAIN POINTS
-- Generated: 2025-10-30T16:16:43.098Z
-- ============================================================================


-- PLATFORM_GOVERNANCE (95 pain points)
-- ============================================================================

-- Map inconsistent_configs to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'inconsistent_configs',
  'platform_governance',
  'Address inconsistent configs with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map inconsistent_configs to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'inconsistent_configs',
  'platform_governance',
  'Address inconsistent configs with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map inconsistent_configs to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'inconsistent_configs',
  'platform_governance',
  'Address inconsistent configs with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map manual_provisioning to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'manual_provisioning',
  'platform_governance',
  'Address manual provisioning with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map manual_provisioning to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'manual_provisioning',
  'platform_governance',
  'Address manual provisioning with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map manual_provisioning to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'manual_provisioning',
  'platform_governance',
  'Address manual provisioning with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map poor_isolation to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'poor_isolation',
  'platform_governance',
  'Address poor isolation with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map poor_isolation to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'poor_isolation',
  'platform_governance',
  'Address poor isolation with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map poor_isolation to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'poor_isolation',
  'platform_governance',
  'Address poor isolation with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map deployment_issues to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'deployment_issues',
  'platform_governance',
  'Address deployment issues with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map deployment_issues to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'deployment_issues',
  'platform_governance',
  'Address deployment issues with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map deployment_issues to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'deployment_issues',
  'platform_governance',
  'Address deployment issues with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map resource_conflicts to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'resource_conflicts',
  'platform_governance',
  'Address resource conflicts with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map resource_conflicts to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'resource_conflicts',
  'platform_governance',
  'Address resource conflicts with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map resource_conflicts to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'resource_conflicts',
  'platform_governance',
  'Address resource conflicts with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map slow_deployment to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'slow_deployment',
  'platform_governance',
  'Address slow deployment with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map slow_deployment to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'slow_deployment',
  'platform_governance',
  'Address slow deployment with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map slow_deployment to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'slow_deployment',
  'platform_governance',
  'Address slow deployment with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map environment_costs to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'environment_costs',
  'platform_governance',
  'Address environment costs with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map environment_costs to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'environment_costs',
  'platform_governance',
  'Address environment costs with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map environment_costs to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'environment_costs',
  'platform_governance',
  'Address environment costs with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map team_bottlenecks to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'team_bottlenecks',
  'platform_governance',
  'Address team bottlenecks with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map team_bottlenecks to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'team_bottlenecks',
  'platform_governance',
  'Address team bottlenecks with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map team_bottlenecks to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'team_bottlenecks',
  'platform_governance',
  'Address team bottlenecks with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map quality_issues to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'quality_issues',
  'platform_governance',
  'Address quality issues with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map quality_issues to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'quality_issues',
  'platform_governance',
  'Address quality issues with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map quality_issues to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'quality_issues',
  'platform_governance',
  'Address quality issues with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map compliance_risks to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'compliance_risks',
  'platform_governance',
  'Address compliance risks with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map compliance_risks to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'compliance_risks',
  'platform_governance',
  'Address compliance risks with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map compliance_risks to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'compliance_risks',
  'platform_governance',
  'Address compliance risks with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map resource_contention to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'resource_contention',
  'platform_governance',
  'Address resource contention with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map resource_contention to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'resource_contention',
  'platform_governance',
  'Address resource contention with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map resource_contention to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'resource_contention',
  'platform_governance',
  'Address resource contention with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map performance_degradation to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'performance_degradation',
  'platform_governance',
  'Address performance degradation with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map performance_degradation to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'performance_degradation',
  'platform_governance',
  'Address performance degradation with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map performance_degradation to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'performance_degradation',
  'platform_governance',
  'Address performance degradation with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map complex_scaling to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'complex_scaling',
  'platform_governance',
  'Address complex scaling with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map complex_scaling to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'complex_scaling',
  'platform_governance',
  'Address complex scaling with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map complex_scaling to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'complex_scaling',
  'platform_governance',
  'Address complex scaling with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map infrastructure_limits to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'infrastructure_limits',
  'platform_governance',
  'Address infrastructure limits with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map infrastructure_limits to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'infrastructure_limits',
  'platform_governance',
  'Address infrastructure limits with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map infrastructure_limits to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'infrastructure_limits',
  'platform_governance',
  'Address infrastructure limits with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map monitoring_gaps to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'monitoring_gaps',
  'platform_governance',
  'Address monitoring gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map monitoring_gaps to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'monitoring_gaps',
  'platform_governance',
  'Address monitoring gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map monitoring_gaps to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'monitoring_gaps',
  'platform_governance',
  'Address monitoring gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map team_blocking to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'team_blocking',
  'platform_governance',
  'Address team blocking with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map team_blocking to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'team_blocking',
  'platform_governance',
  'Address team blocking with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map team_blocking to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'team_blocking',
  'platform_governance',
  'Address team blocking with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map project_delays to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'project_delays',
  'platform_governance',
  'Address project delays with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map project_delays to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'project_delays',
  'platform_governance',
  'Address project delays with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map project_delays to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'project_delays',
  'platform_governance',
  'Address project delays with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map high_costs to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'high_costs',
  'platform_governance',
  'Address high costs with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map high_costs to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'high_costs',
  'platform_governance',
  'Address high costs with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map high_costs to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'high_costs',
  'platform_governance',
  'Address high costs with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map poor_utilization to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'poor_utilization',
  'platform_governance',
  'Address poor utilization with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map poor_utilization to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'poor_utilization',
  'platform_governance',
  'Address poor utilization with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map poor_utilization to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'poor_utilization',
  'platform_governance',
  'Address poor utilization with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map competitive_disadvantage to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'competitive_disadvantage',
  'platform_governance',
  'Address competitive disadvantage with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map competitive_disadvantage to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'competitive_disadvantage',
  'platform_governance',
  'Address competitive disadvantage with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map competitive_disadvantage to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'competitive_disadvantage',
  'platform_governance',
  'Address competitive disadvantage with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map auth_complexity to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'auth_complexity',
  'platform_governance',
  'Address auth complexity with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map auth_complexity to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'auth_complexity',
  'platform_governance',
  'Address auth complexity with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map auth_complexity to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'auth_complexity',
  'platform_governance',
  'Address auth complexity with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map access_management to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'access_management',
  'platform_governance',
  'Address access management with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map access_management to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'access_management',
  'platform_governance',
  'Address access management with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map access_management to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'access_management',
  'platform_governance',
  'Address access management with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map security_gaps to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'security_gaps',
  'platform_governance',
  'Address security gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map security_gaps to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'security_gaps',
  'platform_governance',
  'Address security gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map security_gaps to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'security_gaps',
  'platform_governance',
  'Address security gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map audit_trails to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'audit_trails',
  'platform_governance',
  'Address audit trails with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map audit_trails to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'audit_trails',
  'platform_governance',
  'Address audit trails with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map audit_trails to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'audit_trails',
  'platform_governance',
  'Address audit trails with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map integration_issues to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'integration_issues',
  'platform_governance',
  'Address integration issues with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map integration_issues to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'integration_issues',
  'platform_governance',
  'Address integration issues with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map integration_issues to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'integration_issues',
  'platform_governance',
  'Address integration issues with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map security_breaches to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'security_breaches',
  'platform_governance',
  'Address security breaches with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map security_breaches to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'security_breaches',
  'platform_governance',
  'Address security breaches with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map security_breaches to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'security_breaches',
  'platform_governance',
  'Address security breaches with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map compliance_violations to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'compliance_violations',
  'platform_governance',
  'Address compliance violations with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map compliance_violations to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'compliance_violations',
  'platform_governance',
  'Address compliance violations with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map compliance_violations to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'compliance_violations',
  'platform_governance',
  'Address compliance violations with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map access_delays to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'access_delays',
  'platform_governance',
  'Address access delays with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map access_delays to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'access_delays',
  'platform_governance',
  'Address access delays with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map access_delays to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'access_delays',
  'platform_governance',
  'Address access delays with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map admin_overhead to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'admin_overhead',
  'platform_governance',
  'Address admin overhead with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map admin_overhead to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'admin_overhead',
  'platform_governance',
  'Address admin overhead with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map admin_overhead to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'admin_overhead',
  'platform_governance',
  'Address admin overhead with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map user_frustration to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'user_frustration',
  'platform_governance',
  'Address user frustration with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map user_frustration to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'user_frustration',
  'platform_governance',
  'Address user frustration with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map user_frustration to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'user_frustration',
  'platform_governance',
  'Address user frustration with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_exposure to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_exposure',
  'platform_governance',
  'Address data exposure with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_exposure to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_exposure',
  'platform_governance',
  'Address data exposure with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_exposure to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_exposure',
  'platform_governance',
  'Address data exposure with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map over_privileged to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'over_privileged',
  'platform_governance',
  'Address over privileged with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map over_privileged to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'over_privileged',
  'platform_governance',
  'Address over privileged with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map over_privileged to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'over_privileged',
  'platform_governance',
  'Address over privileged with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map encryption_gaps to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'encryption_gaps',
  'platform_governance',
  'Address encryption gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map encryption_gaps to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'encryption_gaps',
  'platform_governance',
  'Address encryption gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map encryption_gaps to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'encryption_gaps',
  'platform_governance',
  'Address encryption gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map monitoring_blind_spots to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'monitoring_blind_spots',
  'platform_governance',
  'Address monitoring blind spots with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map monitoring_blind_spots to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'monitoring_blind_spots',
  'platform_governance',
  'Address monitoring blind spots with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map monitoring_blind_spots to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'monitoring_blind_spots',
  'platform_governance',
  'Address monitoring blind spots with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map policy_enforcement to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'policy_enforcement',
  'platform_governance',
  'Address policy enforcement with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map policy_enforcement to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'policy_enforcement',
  'platform_governance',
  'Address policy enforcement with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map policy_enforcement to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'policy_enforcement',
  'platform_governance',
  'Address policy enforcement with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map regulatory_risk to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'regulatory_risk',
  'platform_governance',
  'Address regulatory risk with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map regulatory_risk to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'regulatory_risk',
  'platform_governance',
  'Address regulatory risk with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map regulatory_risk to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'regulatory_risk',
  'platform_governance',
  'Address regulatory risk with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_breaches to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_breaches',
  'platform_governance',
  'Address data breaches with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_breaches to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_breaches',
  'platform_governance',
  'Address data breaches with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_breaches to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_breaches',
  'platform_governance',
  'Address data breaches with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map customer_trust to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'customer_trust',
  'platform_governance',
  'Address customer trust with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map customer_trust to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'customer_trust',
  'platform_governance',
  'Address customer trust with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map customer_trust to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'customer_trust',
  'platform_governance',
  'Address customer trust with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map audit_failures to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'audit_failures',
  'platform_governance',
  'Address audit failures with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map audit_failures to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'audit_failures',
  'platform_governance',
  'Address audit failures with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map audit_failures to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'audit_failures',
  'platform_governance',
  'Address audit failures with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map business_disruption to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'business_disruption',
  'platform_governance',
  'Address business disruption with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map business_disruption to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'business_disruption',
  'platform_governance',
  'Address business disruption with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map business_disruption to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'business_disruption',
  'platform_governance',
  'Address business disruption with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map policy_gaps to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'policy_gaps',
  'platform_governance',
  'Address policy gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map policy_gaps to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'policy_gaps',
  'platform_governance',
  'Address policy gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map policy_gaps to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'policy_gaps',
  'platform_governance',
  'Address policy gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map lineage_tracking to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'lineage_tracking',
  'platform_governance',
  'Address lineage tracking with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map lineage_tracking to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'lineage_tracking',
  'platform_governance',
  'Address lineage tracking with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map lineage_tracking to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'lineage_tracking',
  'platform_governance',
  'Address lineage tracking with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map manual_processes to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'manual_processes',
  'platform_governance',
  'Address manual processes with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map manual_processes to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'manual_processes',
  'platform_governance',
  'Address manual processes with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map manual_processes to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'manual_processes',
  'platform_governance',
  'Address manual processes with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map metadata_management to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'metadata_management',
  'platform_governance',
  'Address metadata management with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map metadata_management to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'metadata_management',
  'platform_governance',
  'Address metadata management with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map metadata_management to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'metadata_management',
  'platform_governance',
  'Address metadata management with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map integration_complexity to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'integration_complexity',
  'platform_governance',
  'Address integration complexity with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map integration_complexity to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'integration_complexity',
  'platform_governance',
  'Address integration complexity with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map integration_complexity to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'integration_complexity',
  'platform_governance',
  'Address integration complexity with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map compliance_failures to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'compliance_failures',
  'platform_governance',
  'Address compliance failures with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map compliance_failures to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'compliance_failures',
  'platform_governance',
  'Address compliance failures with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map compliance_failures to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'compliance_failures',
  'platform_governance',
  'Address compliance failures with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_quality_issues to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_quality_issues',
  'platform_governance',
  'Address data quality issues with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_quality_issues to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_quality_issues',
  'platform_governance',
  'Address data quality issues with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_quality_issues to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_quality_issues',
  'platform_governance',
  'Address data quality issues with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map regulatory_fines to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'regulatory_fines',
  'platform_governance',
  'Address regulatory fines with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map regulatory_fines to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'regulatory_fines',
  'platform_governance',
  'Address regulatory fines with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map regulatory_fines to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'regulatory_fines',
  'platform_governance',
  'Address regulatory fines with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map operational_inefficiency to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'operational_inefficiency',
  'platform_governance',
  'Address operational inefficiency with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map operational_inefficiency to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'operational_inefficiency',
  'platform_governance',
  'Address operational inefficiency with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map operational_inefficiency to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'operational_inefficiency',
  'platform_governance',
  'Address operational inefficiency with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map decision_delays to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'decision_delays',
  'platform_governance',
  'Address decision delays with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map decision_delays to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'decision_delays',
  'platform_governance',
  'Address decision delays with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map decision_delays to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'decision_delays',
  'platform_governance',
  'Address decision delays with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map audit_complexity to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'audit_complexity',
  'platform_governance',
  'Address audit complexity with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map audit_complexity to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'audit_complexity',
  'platform_governance',
  'Address audit complexity with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map audit_complexity to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'audit_complexity',
  'platform_governance',
  'Address audit complexity with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_retention to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_retention',
  'platform_governance',
  'Address data retention with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_retention to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_retention',
  'platform_governance',
  'Address data retention with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_retention to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_retention',
  'platform_governance',
  'Address data retention with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reporting_gaps to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reporting_gaps',
  'platform_governance',
  'Address reporting gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reporting_gaps to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reporting_gaps',
  'platform_governance',
  'Address reporting gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reporting_gaps to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reporting_gaps',
  'platform_governance',
  'Address reporting gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map change_tracking to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'change_tracking',
  'platform_governance',
  'Address change tracking with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map change_tracking to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'change_tracking',
  'platform_governance',
  'Address change tracking with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map change_tracking to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'change_tracking',
  'platform_governance',
  'Address change tracking with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map tool_integration to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'tool_integration',
  'platform_governance',
  'Address tool integration with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map tool_integration to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'tool_integration',
  'platform_governance',
  'Address tool integration with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map tool_integration to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'tool_integration',
  'platform_governance',
  'Address tool integration with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map regulatory_penalties to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'regulatory_penalties',
  'platform_governance',
  'Address regulatory penalties with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map regulatory_penalties to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'regulatory_penalties',
  'platform_governance',
  'Address regulatory penalties with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map regulatory_penalties to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'regulatory_penalties',
  'platform_governance',
  'Address regulatory penalties with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map audit_costs to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'audit_costs',
  'platform_governance',
  'Address audit costs with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map audit_costs to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'audit_costs',
  'platform_governance',
  'Address audit costs with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map audit_costs to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'audit_costs',
  'platform_governance',
  'Address audit costs with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map business_risk to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'business_risk',
  'platform_governance',
  'Address business risk with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map business_risk to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'business_risk',
  'platform_governance',
  'Address business risk with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map business_risk to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'business_risk',
  'platform_governance',
  'Address business risk with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reputation_damage to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reputation_damage',
  'platform_governance',
  'Address reputation damage with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reputation_damage to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reputation_damage',
  'platform_governance',
  'Address reputation damage with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reputation_damage to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reputation_damage',
  'platform_governance',
  'Address reputation damage with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map alert_noise to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'alert_noise',
  'platform_governance',
  'Address alert noise with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map alert_noise to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'alert_noise',
  'platform_governance',
  'Address alert noise with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map alert_noise to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'alert_noise',
  'platform_governance',
  'Address alert noise with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map metric_correlation to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'metric_correlation',
  'platform_governance',
  'Address metric correlation with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map metric_correlation to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'metric_correlation',
  'platform_governance',
  'Address metric correlation with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map metric_correlation to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'metric_correlation',
  'platform_governance',
  'Address metric correlation with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map performance_impact to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'performance_impact',
  'platform_governance',
  'Address performance impact with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map performance_impact to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'performance_impact',
  'platform_governance',
  'Address performance impact with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map performance_impact to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'performance_impact',
  'platform_governance',
  'Address performance impact with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map tool_fragmentation to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'tool_fragmentation',
  'platform_governance',
  'Address tool fragmentation with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map tool_fragmentation to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'tool_fragmentation',
  'platform_governance',
  'Address tool fragmentation with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map tool_fragmentation to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'tool_fragmentation',
  'platform_governance',
  'Address tool fragmentation with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map unplanned_downtime to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'unplanned_downtime',
  'platform_governance',
  'Address unplanned downtime with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map unplanned_downtime to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'unplanned_downtime',
  'platform_governance',
  'Address unplanned downtime with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map unplanned_downtime to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'unplanned_downtime',
  'platform_governance',
  'Address unplanned downtime with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map slow_issue_resolution to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'slow_issue_resolution',
  'platform_governance',
  'Address slow issue resolution with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map slow_issue_resolution to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'slow_issue_resolution',
  'platform_governance',
  'Address slow issue resolution with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map slow_issue_resolution to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'slow_issue_resolution',
  'platform_governance',
  'Address slow issue resolution with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map user_impact to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'user_impact',
  'platform_governance',
  'Address user impact with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map user_impact to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'user_impact',
  'platform_governance',
  'Address user impact with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map user_impact to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'user_impact',
  'platform_governance',
  'Address user impact with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map resource_waste to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'resource_waste',
  'platform_governance',
  'Address resource waste with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map resource_waste to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'resource_waste',
  'platform_governance',
  'Address resource waste with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map resource_waste to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'resource_waste',
  'platform_governance',
  'Address resource waste with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map sla_breaches to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'sla_breaches',
  'platform_governance',
  'Address sla breaches with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map sla_breaches to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'sla_breaches',
  'platform_governance',
  'Address sla breaches with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map sla_breaches to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'sla_breaches',
  'platform_governance',
  'Address sla breaches with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map late_detection to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'late_detection',
  'platform_governance',
  'Address late detection with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map late_detection to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'late_detection',
  'platform_governance',
  'Address late detection with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map late_detection to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'late_detection',
  'platform_governance',
  'Address late detection with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map manual_response to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'manual_response',
  'platform_governance',
  'Address manual response with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map manual_response to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'manual_response',
  'platform_governance',
  'Address manual response with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map manual_response to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'manual_response',
  'platform_governance',
  'Address manual response with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map alert_fatigue to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'alert_fatigue',
  'platform_governance',
  'Address alert fatigue with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map alert_fatigue to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'alert_fatigue',
  'platform_governance',
  'Address alert fatigue with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map alert_fatigue to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'alert_fatigue',
  'platform_governance',
  'Address alert fatigue with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map root_cause_analysis to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'root_cause_analysis',
  'platform_governance',
  'Address root cause analysis with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map root_cause_analysis to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'root_cause_analysis',
  'platform_governance',
  'Address root cause analysis with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map root_cause_analysis to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'root_cause_analysis',
  'platform_governance',
  'Address root cause analysis with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map escalation_delays to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'escalation_delays',
  'platform_governance',
  'Address escalation delays with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map escalation_delays to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'escalation_delays',
  'platform_governance',
  'Address escalation delays with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map escalation_delays to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'escalation_delays',
  'platform_governance',
  'Address escalation delays with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map service_disruption to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'service_disruption',
  'platform_governance',
  'Address service disruption with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map service_disruption to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'service_disruption',
  'platform_governance',
  'Address service disruption with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map service_disruption to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'service_disruption',
  'platform_governance',
  'Address service disruption with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map customer_impact to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'customer_impact',
  'platform_governance',
  'Address customer impact with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map customer_impact to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'customer_impact',
  'platform_governance',
  'Address customer impact with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map customer_impact to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'customer_impact',
  'platform_governance',
  'Address customer impact with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map operational_costs to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'operational_costs',
  'platform_governance',
  'Address operational costs with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map operational_costs to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'operational_costs',
  'platform_governance',
  'Address operational costs with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map operational_costs to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'operational_costs',
  'platform_governance',
  'Address operational costs with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map team_burnout to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'team_burnout',
  'platform_governance',
  'Address team burnout with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map team_burnout to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'team_burnout',
  'platform_governance',
  'Address team burnout with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map team_burnout to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'team_burnout',
  'platform_governance',
  'Address team burnout with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map missed_slas to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'missed_slas',
  'platform_governance',
  'Address missed slas with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map missed_slas to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'missed_slas',
  'platform_governance',
  'Address missed slas with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map missed_slas to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'missed_slas',
  'platform_governance',
  'Address missed slas with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map cost_attribution to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'cost_attribution',
  'platform_governance',
  'Address cost attribution with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map cost_attribution to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'cost_attribution',
  'platform_governance',
  'Address cost attribution with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map cost_attribution to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'cost_attribution',
  'platform_governance',
  'Address cost attribution with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map usage_visibility to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'usage_visibility',
  'platform_governance',
  'Address usage visibility with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map usage_visibility to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'usage_visibility',
  'platform_governance',
  'Address usage visibility with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map usage_visibility to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'usage_visibility',
  'platform_governance',
  'Address usage visibility with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reporting_complexity to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reporting_complexity',
  'platform_governance',
  'Address reporting complexity with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reporting_complexity to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reporting_complexity',
  'platform_governance',
  'Address reporting complexity with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reporting_complexity to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reporting_complexity',
  'platform_governance',
  'Address reporting complexity with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map tagging_inconsistency to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'tagging_inconsistency',
  'platform_governance',
  'Address tagging inconsistency with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map tagging_inconsistency to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'tagging_inconsistency',
  'platform_governance',
  'Address tagging inconsistency with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map tagging_inconsistency to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'tagging_inconsistency',
  'platform_governance',
  'Address tagging inconsistency with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map tool_limitations to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'tool_limitations',
  'platform_governance',
  'Address tool limitations with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map tool_limitations to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'tool_limitations',
  'platform_governance',
  'Address tool limitations with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map tool_limitations to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'tool_limitations',
  'platform_governance',
  'Address tool limitations with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map budget_overruns to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'budget_overruns',
  'platform_governance',
  'Address budget overruns with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map budget_overruns to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'budget_overruns',
  'platform_governance',
  'Address budget overruns with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map budget_overruns to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'budget_overruns',
  'platform_governance',
  'Address budget overruns with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map cost_surprises to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'cost_surprises',
  'platform_governance',
  'Address cost surprises with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map cost_surprises to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'cost_surprises',
  'platform_governance',
  'Address cost surprises with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map cost_surprises to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'cost_surprises',
  'platform_governance',
  'Address cost surprises with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_accountability to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_accountability',
  'platform_governance',
  'Address no accountability with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_accountability to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_accountability',
  'platform_governance',
  'Address no accountability with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_accountability to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_accountability',
  'platform_governance',
  'Address no accountability with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map inefficient_spending to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'inefficient_spending',
  'platform_governance',
  'Address inefficient spending with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map inefficient_spending to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'inefficient_spending',
  'platform_governance',
  'Address inefficient spending with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map inefficient_spending to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'inefficient_spending',
  'platform_governance',
  'Address inefficient spending with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map budget_planning to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'budget_planning',
  'platform_governance',
  'Address budget planning with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map budget_planning to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'budget_planning',
  'platform_governance',
  'Address budget planning with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map budget_planning to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'budget_planning',
  'platform_governance',
  'Address budget planning with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map optimization_complexity to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'optimization_complexity',
  'platform_governance',
  'Address optimization complexity with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map optimization_complexity to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'optimization_complexity',
  'platform_governance',
  'Address optimization complexity with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map optimization_complexity to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'optimization_complexity',
  'platform_governance',
  'Address optimization complexity with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map resource_rightsizing to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'resource_rightsizing',
  'platform_governance',
  'Address resource rightsizing with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map resource_rightsizing to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'resource_rightsizing',
  'platform_governance',
  'Address resource rightsizing with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map resource_rightsizing to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'resource_rightsizing',
  'platform_governance',
  'Address resource rightsizing with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map automation_gaps to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'automation_gaps',
  'platform_governance',
  'Address automation gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map automation_gaps to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'automation_gaps',
  'platform_governance',
  'Address automation gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map automation_gaps to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'automation_gaps',
  'platform_governance',
  'Address automation gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map wasted_spend to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'wasted_spend',
  'platform_governance',
  'Address wasted spend with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map wasted_spend to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'wasted_spend',
  'platform_governance',
  'Address wasted spend with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map wasted_spend to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'wasted_spend',
  'platform_governance',
  'Address wasted spend with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_cost_discipline to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_cost_discipline',
  'platform_governance',
  'Address no cost discipline with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_cost_discipline to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_cost_discipline',
  'platform_governance',
  'Address no cost discipline with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_cost_discipline to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_cost_discipline',
  'platform_governance',
  'Address no cost discipline with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map team_conflicts to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'team_conflicts',
  'platform_governance',
  'Address team conflicts with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map team_conflicts to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'team_conflicts',
  'platform_governance',
  'Address team conflicts with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map team_conflicts to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'team_conflicts',
  'platform_governance',
  'Address team conflicts with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map roi_unclear to platform features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'roi_unclear',
  'platform_governance',
  'Address roi unclear with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'platform'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map roi_unclear to governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'roi_unclear',
  'platform_governance',
  'Address roi unclear with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map roi_unclear to data-governance features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'roi_unclear',
  'platform_governance',
  'Address roi unclear with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-governance'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;


-- DATA_ENGINEERING (97 pain points)
-- ============================================================================

-- Map complex_integrations to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'complex_integrations',
  'data_engineering',
  'Address complex integrations with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map complex_integrations to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'complex_integrations',
  'data_engineering',
  'Address complex integrations with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map complex_integrations to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'complex_integrations',
  'data_engineering',
  'Address complex integrations with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_format_issues to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_format_issues',
  'data_engineering',
  'Address data format issues with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_format_issues to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_format_issues',
  'data_engineering',
  'Address data format issues with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_format_issues to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_format_issues',
  'data_engineering',
  'Address data format issues with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map pipeline_maintenance to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'pipeline_maintenance',
  'data_engineering',
  'Address pipeline maintenance with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map pipeline_maintenance to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'pipeline_maintenance',
  'data_engineering',
  'Address pipeline maintenance with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map pipeline_maintenance to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'pipeline_maintenance',
  'data_engineering',
  'Address pipeline maintenance with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map error_handling to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'error_handling',
  'data_engineering',
  'Address error handling with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map error_handling to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'error_handling',
  'data_engineering',
  'Address error handling with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map error_handling to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'error_handling',
  'data_engineering',
  'Address error handling with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map throughput_issues to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'throughput_issues',
  'data_engineering',
  'Address throughput issues with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map throughput_issues to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'throughput_issues',
  'data_engineering',
  'Address throughput issues with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map throughput_issues to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'throughput_issues',
  'data_engineering',
  'Address throughput issues with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_delays to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_delays',
  'data_engineering',
  'Address data delays with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_delays to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_delays',
  'data_engineering',
  'Address data delays with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_delays to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_delays',
  'data_engineering',
  'Address data delays with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map integration_costs to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'integration_costs',
  'data_engineering',
  'Address integration costs with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map integration_costs to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'integration_costs',
  'data_engineering',
  'Address integration costs with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map integration_costs to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'integration_costs',
  'data_engineering',
  'Address integration costs with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_quality to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_quality',
  'data_engineering',
  'Address data quality with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_quality to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_quality',
  'data_engineering',
  'Address data quality with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_quality to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_quality',
  'data_engineering',
  'Address data quality with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map team_bottlenecks to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'team_bottlenecks',
  'data_engineering',
  'Address team bottlenecks with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map team_bottlenecks to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'team_bottlenecks',
  'data_engineering',
  'Address team bottlenecks with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map team_bottlenecks to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'team_bottlenecks',
  'data_engineering',
  'Address team bottlenecks with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map business_agility to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'business_agility',
  'data_engineering',
  'Address business agility with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map business_agility to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'business_agility',
  'data_engineering',
  'Address business agility with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map business_agility to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'business_agility',
  'data_engineering',
  'Address business agility with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map schema_breakage to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'schema_breakage',
  'data_engineering',
  'Address schema breakage with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map schema_breakage to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'schema_breakage',
  'data_engineering',
  'Address schema breakage with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map schema_breakage to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'schema_breakage',
  'data_engineering',
  'Address schema breakage with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map manual_fixes to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'manual_fixes',
  'data_engineering',
  'Address manual fixes with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map manual_fixes to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'manual_fixes',
  'data_engineering',
  'Address manual fixes with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map manual_fixes to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'manual_fixes',
  'data_engineering',
  'Address manual fixes with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_loss_risk to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_loss_risk',
  'data_engineering',
  'Address data loss risk with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_loss_risk to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_loss_risk',
  'data_engineering',
  'Address data loss risk with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_loss_risk to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_loss_risk',
  'data_engineering',
  'Address data loss risk with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map monitoring_gaps to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'monitoring_gaps',
  'data_engineering',
  'Address monitoring gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map monitoring_gaps to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'monitoring_gaps',
  'data_engineering',
  'Address monitoring gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map monitoring_gaps to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'monitoring_gaps',
  'data_engineering',
  'Address monitoring gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map recovery_complexity to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'recovery_complexity',
  'data_engineering',
  'Address recovery complexity with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map recovery_complexity to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'recovery_complexity',
  'data_engineering',
  'Address recovery complexity with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map recovery_complexity to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'recovery_complexity',
  'data_engineering',
  'Address recovery complexity with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_unavailability to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_unavailability',
  'data_engineering',
  'Address data unavailability with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_unavailability to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_unavailability',
  'data_engineering',
  'Address data unavailability with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_unavailability to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_unavailability',
  'data_engineering',
  'Address data unavailability with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map operational_overhead to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'operational_overhead',
  'data_engineering',
  'Address operational overhead with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map operational_overhead to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'operational_overhead',
  'data_engineering',
  'Address operational overhead with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map operational_overhead to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'operational_overhead',
  'data_engineering',
  'Address operational overhead with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map sla_breaches to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'sla_breaches',
  'data_engineering',
  'Address sla breaches with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map sla_breaches to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'sla_breaches',
  'data_engineering',
  'Address sla breaches with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map sla_breaches to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'sla_breaches',
  'data_engineering',
  'Address sla breaches with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map trust_issues to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'trust_issues',
  'data_engineering',
  'Address trust issues with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map trust_issues to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'trust_issues',
  'data_engineering',
  'Address trust issues with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map trust_issues to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'trust_issues',
  'data_engineering',
  'Address trust issues with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map compliance_risk to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'compliance_risk',
  'data_engineering',
  'Address compliance risk with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map compliance_risk to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'compliance_risk',
  'data_engineering',
  'Address compliance risk with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map compliance_risk to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'compliance_risk',
  'data_engineering',
  'Address compliance risk with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_organization to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_organization',
  'data_engineering',
  'Address data organization with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_organization to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_organization',
  'data_engineering',
  'Address data organization with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_organization to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_organization',
  'data_engineering',
  'Address data organization with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map layer_confusion to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'layer_confusion',
  'data_engineering',
  'Address layer confusion with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map layer_confusion to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'layer_confusion',
  'data_engineering',
  'Address layer confusion with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map layer_confusion to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'layer_confusion',
  'data_engineering',
  'Address layer confusion with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map duplicate_data to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'duplicate_data',
  'data_engineering',
  'Address duplicate data with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map duplicate_data to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'duplicate_data',
  'data_engineering',
  'Address duplicate data with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map duplicate_data to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'duplicate_data',
  'data_engineering',
  'Address duplicate data with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map transformation_complexity to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'transformation_complexity',
  'data_engineering',
  'Address transformation complexity with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map transformation_complexity to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'transformation_complexity',
  'data_engineering',
  'Address transformation complexity with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map transformation_complexity to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'transformation_complexity',
  'data_engineering',
  'Address transformation complexity with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map performance_issues to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'performance_issues',
  'data_engineering',
  'Address performance issues with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map performance_issues to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'performance_issues',
  'data_engineering',
  'Address performance issues with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map performance_issues to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'performance_issues',
  'data_engineering',
  'Address performance issues with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_discovery to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_discovery',
  'data_engineering',
  'Address data discovery with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_discovery to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_discovery',
  'data_engineering',
  'Address data discovery with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_discovery to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_discovery',
  'data_engineering',
  'Address data discovery with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map inconsistent_metrics to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'inconsistent_metrics',
  'data_engineering',
  'Address inconsistent metrics with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map inconsistent_metrics to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'inconsistent_metrics',
  'data_engineering',
  'Address inconsistent metrics with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map inconsistent_metrics to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'inconsistent_metrics',
  'data_engineering',
  'Address inconsistent metrics with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map storage_costs to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'storage_costs',
  'data_engineering',
  'Address storage costs with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map storage_costs to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'storage_costs',
  'data_engineering',
  'Address storage costs with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map storage_costs to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'storage_costs',
  'data_engineering',
  'Address storage costs with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map slow_insights to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'slow_insights',
  'data_engineering',
  'Address slow insights with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map slow_insights to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'slow_insights',
  'data_engineering',
  'Address slow insights with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map slow_insights to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'slow_insights',
  'data_engineering',
  'Address slow insights with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map trust_deficit to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'trust_deficit',
  'data_engineering',
  'Address trust deficit with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map trust_deficit to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'trust_deficit',
  'data_engineering',
  'Address trust deficit with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map trust_deficit to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'trust_deficit',
  'data_engineering',
  'Address trust deficit with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map rigid_structure to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'rigid_structure',
  'data_engineering',
  'Address rigid structure with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map rigid_structure to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'rigid_structure',
  'data_engineering',
  'Address rigid structure with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map rigid_structure to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'rigid_structure',
  'data_engineering',
  'Address rigid structure with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map new_source_complexity to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'new_source_complexity',
  'data_engineering',
  'Address new source complexity with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map new_source_complexity to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'new_source_complexity',
  'data_engineering',
  'Address new source complexity with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map new_source_complexity to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'new_source_complexity',
  'data_engineering',
  'Address new source complexity with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map format_limitations to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'format_limitations',
  'data_engineering',
  'Address format limitations with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map format_limitations to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'format_limitations',
  'data_engineering',
  'Address format limitations with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map format_limitations to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'format_limitations',
  'data_engineering',
  'Address format limitations with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map integration_effort to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'integration_effort',
  'data_engineering',
  'Address integration effort with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map integration_effort to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'integration_effort',
  'data_engineering',
  'Address integration effort with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map integration_effort to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'integration_effort',
  'data_engineering',
  'Address integration effort with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map scalability_constraints to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'scalability_constraints',
  'data_engineering',
  'Address scalability constraints with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map scalability_constraints to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'scalability_constraints',
  'data_engineering',
  'Address scalability constraints with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map scalability_constraints to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'scalability_constraints',
  'data_engineering',
  'Address scalability constraints with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map slow_adaptation to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'slow_adaptation',
  'data_engineering',
  'Address slow adaptation with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map slow_adaptation to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'slow_adaptation',
  'data_engineering',
  'Address slow adaptation with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map slow_adaptation to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'slow_adaptation',
  'data_engineering',
  'Address slow adaptation with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map missed_opportunities to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'missed_opportunities',
  'data_engineering',
  'Address missed opportunities with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map missed_opportunities to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'missed_opportunities',
  'data_engineering',
  'Address missed opportunities with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map missed_opportunities to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'missed_opportunities',
  'data_engineering',
  'Address missed opportunities with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map integration_delays to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'integration_delays',
  'data_engineering',
  'Address integration delays with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map integration_delays to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'integration_delays',
  'data_engineering',
  'Address integration delays with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map integration_delays to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'integration_delays',
  'data_engineering',
  'Address integration delays with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map competitive_lag to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'competitive_lag',
  'data_engineering',
  'Address competitive lag with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map competitive_lag to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'competitive_lag',
  'data_engineering',
  'Address competitive lag with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map competitive_lag to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'competitive_lag',
  'data_engineering',
  'Address competitive lag with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map innovation_barriers to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'innovation_barriers',
  'data_engineering',
  'Address innovation barriers with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map innovation_barriers to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'innovation_barriers',
  'data_engineering',
  'Address innovation barriers with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map innovation_barriers to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'innovation_barriers',
  'data_engineering',
  'Address innovation barriers with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map scheduling_issues to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'scheduling_issues',
  'data_engineering',
  'Address scheduling issues with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map scheduling_issues to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'scheduling_issues',
  'data_engineering',
  'Address scheduling issues with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map scheduling_issues to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'scheduling_issues',
  'data_engineering',
  'Address scheduling issues with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map dependency_failures to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'dependency_failures',
  'data_engineering',
  'Address dependency failures with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map dependency_failures to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'dependency_failures',
  'data_engineering',
  'Address dependency failures with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map dependency_failures to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'dependency_failures',
  'data_engineering',
  'Address dependency failures with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map retry_logic to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'retry_logic',
  'data_engineering',
  'Address retry logic with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map retry_logic to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'retry_logic',
  'data_engineering',
  'Address retry logic with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map retry_logic to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'retry_logic',
  'data_engineering',
  'Address retry logic with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map maintenance_burden to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'maintenance_burden',
  'data_engineering',
  'Address maintenance burden with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map maintenance_burden to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'maintenance_burden',
  'data_engineering',
  'Address maintenance burden with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map maintenance_burden to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'maintenance_burden',
  'data_engineering',
  'Address maintenance burden with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_freshness to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_freshness',
  'data_engineering',
  'Address data freshness with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_freshness to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_freshness',
  'data_engineering',
  'Address data freshness with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_freshness to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_freshness',
  'data_engineering',
  'Address data freshness with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map operational_costs to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'operational_costs',
  'data_engineering',
  'Address operational costs with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map operational_costs to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'operational_costs',
  'data_engineering',
  'Address operational costs with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map operational_costs to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'operational_costs',
  'data_engineering',
  'Address operational costs with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map pipeline_failures to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'pipeline_failures',
  'data_engineering',
  'Address pipeline failures with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map pipeline_failures to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'pipeline_failures',
  'data_engineering',
  'Address pipeline failures with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map pipeline_failures to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'pipeline_failures',
  'data_engineering',
  'Address pipeline failures with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map sla_misses to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'sla_misses',
  'data_engineering',
  'Address sla misses with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map sla_misses to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'sla_misses',
  'data_engineering',
  'Address sla misses with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map sla_misses to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'sla_misses',
  'data_engineering',
  'Address sla misses with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map team_frustration to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'team_frustration',
  'data_engineering',
  'Address team frustration with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map team_frustration to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'team_frustration',
  'data_engineering',
  'Address team frustration with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map team_frustration to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'team_frustration',
  'data_engineering',
  'Address team frustration with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map version_control to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'version_control',
  'data_engineering',
  'Address version control with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map version_control to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'version_control',
  'data_engineering',
  'Address version control with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map version_control to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'version_control',
  'data_engineering',
  'Address version control with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map testing_gaps to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'testing_gaps',
  'data_engineering',
  'Address testing gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map testing_gaps to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'testing_gaps',
  'data_engineering',
  'Address testing gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map testing_gaps to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'testing_gaps',
  'data_engineering',
  'Address testing gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map deployment_issues to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'deployment_issues',
  'data_engineering',
  'Address deployment issues with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map deployment_issues to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'deployment_issues',
  'data_engineering',
  'Address deployment issues with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map deployment_issues to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'deployment_issues',
  'data_engineering',
  'Address deployment issues with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map environment_drift to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'environment_drift',
  'data_engineering',
  'Address environment drift with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map environment_drift to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'environment_drift',
  'data_engineering',
  'Address environment drift with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map environment_drift to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'environment_drift',
  'data_engineering',
  'Address environment drift with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map change_tracking to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'change_tracking',
  'data_engineering',
  'Address change tracking with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map change_tracking to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'change_tracking',
  'data_engineering',
  'Address change tracking with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map change_tracking to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'change_tracking',
  'data_engineering',
  'Address change tracking with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map production_incidents to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'production_incidents',
  'data_engineering',
  'Address production incidents with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map production_incidents to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'production_incidents',
  'data_engineering',
  'Address production incidents with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map production_incidents to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'production_incidents',
  'data_engineering',
  'Address production incidents with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map slow_releases to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'slow_releases',
  'data_engineering',
  'Address slow releases with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map slow_releases to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'slow_releases',
  'data_engineering',
  'Address slow releases with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map slow_releases to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'slow_releases',
  'data_engineering',
  'Address slow releases with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map quality_issues to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'quality_issues',
  'data_engineering',
  'Address quality issues with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map quality_issues to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'quality_issues',
  'data_engineering',
  'Address quality issues with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map quality_issues to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'quality_issues',
  'data_engineering',
  'Address quality issues with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map rollback_complexity to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'rollback_complexity',
  'data_engineering',
  'Address rollback complexity with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map rollback_complexity to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'rollback_complexity',
  'data_engineering',
  'Address rollback complexity with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map rollback_complexity to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'rollback_complexity',
  'data_engineering',
  'Address rollback complexity with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map audit_gaps to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'audit_gaps',
  'data_engineering',
  'Address audit gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map audit_gaps to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'audit_gaps',
  'data_engineering',
  'Address audit gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map audit_gaps to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'audit_gaps',
  'data_engineering',
  'Address audit gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map validation_gaps to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'validation_gaps',
  'data_engineering',
  'Address validation gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map validation_gaps to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'validation_gaps',
  'data_engineering',
  'Address validation gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map validation_gaps to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'validation_gaps',
  'data_engineering',
  'Address validation gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map quality_rules to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'quality_rules',
  'data_engineering',
  'Address quality rules with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map quality_rules to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'quality_rules',
  'data_engineering',
  'Address quality rules with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map quality_rules to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'quality_rules',
  'data_engineering',
  'Address quality rules with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map error_detection to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'error_detection',
  'data_engineering',
  'Address error detection with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map error_detection to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'error_detection',
  'data_engineering',
  'Address error detection with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map error_detection to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'error_detection',
  'data_engineering',
  'Address error detection with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reconciliation_complexity to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reconciliation_complexity',
  'data_engineering',
  'Address reconciliation complexity with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reconciliation_complexity to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reconciliation_complexity',
  'data_engineering',
  'Address reconciliation complexity with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reconciliation_complexity to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reconciliation_complexity',
  'data_engineering',
  'Address reconciliation complexity with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map recovery_procedures to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'recovery_procedures',
  'data_engineering',
  'Address recovery procedures with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map recovery_procedures to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'recovery_procedures',
  'data_engineering',
  'Address recovery procedures with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map recovery_procedures to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'recovery_procedures',
  'data_engineering',
  'Address recovery procedures with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map bad_decisions to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'bad_decisions',
  'data_engineering',
  'Address bad decisions with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map bad_decisions to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'bad_decisions',
  'data_engineering',
  'Address bad decisions with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map bad_decisions to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'bad_decisions',
  'data_engineering',
  'Address bad decisions with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map customer_impact to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'customer_impact',
  'data_engineering',
  'Address customer impact with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map customer_impact to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'customer_impact',
  'data_engineering',
  'Address customer impact with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map customer_impact to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'customer_impact',
  'data_engineering',
  'Address customer impact with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map trust_erosion to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'trust_erosion',
  'data_engineering',
  'Address trust erosion with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map trust_erosion to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'trust_erosion',
  'data_engineering',
  'Address trust erosion with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map trust_erosion to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'trust_erosion',
  'data_engineering',
  'Address trust erosion with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map compliance_violations to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'compliance_violations',
  'data_engineering',
  'Address compliance violations with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map compliance_violations to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'compliance_violations',
  'data_engineering',
  'Address compliance violations with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map compliance_violations to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'compliance_violations',
  'data_engineering',
  'Address compliance violations with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map alert_noise to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'alert_noise',
  'data_engineering',
  'Address alert noise with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map alert_noise to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'alert_noise',
  'data_engineering',
  'Address alert noise with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map alert_noise to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'alert_noise',
  'data_engineering',
  'Address alert noise with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map metric_visibility to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'metric_visibility',
  'data_engineering',
  'Address metric visibility with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map metric_visibility to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'metric_visibility',
  'data_engineering',
  'Address metric visibility with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map metric_visibility to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'metric_visibility',
  'data_engineering',
  'Address metric visibility with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map stakeholder_communication to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'stakeholder_communication',
  'data_engineering',
  'Address stakeholder communication with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map stakeholder_communication to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'stakeholder_communication',
  'data_engineering',
  'Address stakeholder communication with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map stakeholder_communication to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'stakeholder_communication',
  'data_engineering',
  'Address stakeholder communication with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map trend_analysis to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'trend_analysis',
  'data_engineering',
  'Address trend analysis with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map trend_analysis to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'trend_analysis',
  'data_engineering',
  'Address trend analysis with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map trend_analysis to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'trend_analysis',
  'data_engineering',
  'Address trend analysis with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map late_discovery to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'late_discovery',
  'data_engineering',
  'Address late discovery with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map late_discovery to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'late_discovery',
  'data_engineering',
  'Address late discovery with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map late_discovery to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'late_discovery',
  'data_engineering',
  'Address late discovery with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map stakeholder_frustration to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'stakeholder_frustration',
  'data_engineering',
  'Address stakeholder frustration with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map stakeholder_frustration to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'stakeholder_frustration',
  'data_engineering',
  'Address stakeholder frustration with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map stakeholder_frustration to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'stakeholder_frustration',
  'data_engineering',
  'Address stakeholder frustration with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reactive_approach to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reactive_approach',
  'data_engineering',
  'Address reactive approach with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reactive_approach to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reactive_approach',
  'data_engineering',
  'Address reactive approach with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reactive_approach to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reactive_approach',
  'data_engineering',
  'Address reactive approach with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map sla_impacts to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'sla_impacts',
  'data_engineering',
  'Address sla impacts with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map sla_impacts to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'sla_impacts',
  'data_engineering',
  'Address sla impacts with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map sla_impacts to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'sla_impacts',
  'data_engineering',
  'Address sla impacts with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reputation_damage to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reputation_damage',
  'data_engineering',
  'Address reputation damage with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reputation_damage to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reputation_damage',
  'data_engineering',
  'Address reputation damage with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reputation_damage to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reputation_damage',
  'data_engineering',
  'Address reputation damage with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map slow_pipelines to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'slow_pipelines',
  'data_engineering',
  'Address slow pipelines with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map slow_pipelines to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'slow_pipelines',
  'data_engineering',
  'Address slow pipelines with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map slow_pipelines to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'slow_pipelines',
  'data_engineering',
  'Address slow pipelines with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map parallelization_gaps to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'parallelization_gaps',
  'data_engineering',
  'Address parallelization gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map parallelization_gaps to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'parallelization_gaps',
  'data_engineering',
  'Address parallelization gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map parallelization_gaps to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'parallelization_gaps',
  'data_engineering',
  'Address parallelization gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map resource_inefficiency to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'resource_inefficiency',
  'data_engineering',
  'Address resource inefficiency with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map resource_inefficiency to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'resource_inefficiency',
  'data_engineering',
  'Address resource inefficiency with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map resource_inefficiency to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'resource_inefficiency',
  'data_engineering',
  'Address resource inefficiency with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map bottlenecks to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'bottlenecks',
  'data_engineering',
  'Address bottlenecks with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map bottlenecks to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'bottlenecks',
  'data_engineering',
  'Address bottlenecks with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map bottlenecks to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'bottlenecks',
  'data_engineering',
  'Address bottlenecks with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map optimization_difficulty to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'optimization_difficulty',
  'data_engineering',
  'Address optimization difficulty with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map optimization_difficulty to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'optimization_difficulty',
  'data_engineering',
  'Address optimization difficulty with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map optimization_difficulty to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'optimization_difficulty',
  'data_engineering',
  'Address optimization difficulty with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_latency to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_latency',
  'data_engineering',
  'Address data latency with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_latency to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_latency',
  'data_engineering',
  'Address data latency with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_latency to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_latency',
  'data_engineering',
  'Address data latency with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map compute_costs to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'compute_costs',
  'data_engineering',
  'Address compute costs with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map compute_costs to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'compute_costs',
  'data_engineering',
  'Address compute costs with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map compute_costs to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'compute_costs',
  'data_engineering',
  'Address compute costs with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map user_experience to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'user_experience',
  'data_engineering',
  'Address user experience with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map user_experience to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'user_experience',
  'data_engineering',
  'Address user experience with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map user_experience to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'user_experience',
  'data_engineering',
  'Address user experience with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map scalability_limits to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'scalability_limits',
  'data_engineering',
  'Address scalability limits with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map scalability_limits to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'scalability_limits',
  'data_engineering',
  'Address scalability limits with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map scalability_limits to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'scalability_limits',
  'data_engineering',
  'Address scalability limits with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map competitive_disadvantage to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'competitive_disadvantage',
  'data_engineering',
  'Address competitive disadvantage with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map competitive_disadvantage to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'competitive_disadvantage',
  'data_engineering',
  'Address competitive disadvantage with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map competitive_disadvantage to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'competitive_disadvantage',
  'data_engineering',
  'Address competitive disadvantage with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map manual_scaling to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'manual_scaling',
  'data_engineering',
  'Address manual scaling with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map manual_scaling to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'manual_scaling',
  'data_engineering',
  'Address manual scaling with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map manual_scaling to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'manual_scaling',
  'data_engineering',
  'Address manual scaling with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map over_provisioning to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'over_provisioning',
  'data_engineering',
  'Address over provisioning with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map over_provisioning to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'over_provisioning',
  'data_engineering',
  'Address over provisioning with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map over_provisioning to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'over_provisioning',
  'data_engineering',
  'Address over provisioning with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map scaling_delays to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'scaling_delays',
  'data_engineering',
  'Address scaling delays with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map scaling_delays to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'scaling_delays',
  'data_engineering',
  'Address scaling delays with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map scaling_delays to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'scaling_delays',
  'data_engineering',
  'Address scaling delays with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map resource_contention to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'resource_contention',
  'data_engineering',
  'Address resource contention with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map resource_contention to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'resource_contention',
  'data_engineering',
  'Address resource contention with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map resource_contention to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'resource_contention',
  'data_engineering',
  'Address resource contention with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map configuration_complexity to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'configuration_complexity',
  'data_engineering',
  'Address configuration complexity with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map configuration_complexity to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'configuration_complexity',
  'data_engineering',
  'Address configuration complexity with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map configuration_complexity to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'configuration_complexity',
  'data_engineering',
  'Address configuration complexity with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map cost_inefficiency to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'cost_inefficiency',
  'data_engineering',
  'Address cost inefficiency with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map cost_inefficiency to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'cost_inefficiency',
  'data_engineering',
  'Address cost inefficiency with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map cost_inefficiency to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'cost_inefficiency',
  'data_engineering',
  'Address cost inefficiency with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map performance_degradation to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'performance_degradation',
  'data_engineering',
  'Address performance degradation with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map performance_degradation to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'performance_degradation',
  'data_engineering',
  'Address performance degradation with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map performance_degradation to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'performance_degradation',
  'data_engineering',
  'Address performance degradation with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map capacity_planning to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'capacity_planning',
  'data_engineering',
  'Address capacity planning with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map capacity_planning to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'capacity_planning',
  'data_engineering',
  'Address capacity planning with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map capacity_planning to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'capacity_planning',
  'data_engineering',
  'Address capacity planning with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map business_impact to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'business_impact',
  'data_engineering',
  'Address business impact with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map business_impact to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'business_impact',
  'data_engineering',
  'Address business impact with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map business_impact to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'business_impact',
  'data_engineering',
  'Address business impact with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map wasted_resources to data-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'wasted_resources',
  'data_engineering',
  'Address wasted resources with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'data-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map wasted_resources to etl-elt features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'wasted_resources',
  'data_engineering',
  'Address wasted resources with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'etl-elt'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map wasted_resources to orchestration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'wasted_resources',
  'data_engineering',
  'Address wasted resources with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'orchestration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;


-- ANALYTICS_BI (94 pain points)
-- ============================================================================

-- Map slow_queries to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'slow_queries',
  'analytics_bi',
  'Address slow queries with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map slow_queries to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'slow_queries',
  'analytics_bi',
  'Address slow queries with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map slow_queries to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'slow_queries',
  'analytics_bi',
  'Address slow queries with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map slow_queries to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'slow_queries',
  'analytics_bi',
  'Address slow queries with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map inconsistent_performance to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'inconsistent_performance',
  'analytics_bi',
  'Address inconsistent performance with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map inconsistent_performance to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'inconsistent_performance',
  'analytics_bi',
  'Address inconsistent performance with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map inconsistent_performance to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'inconsistent_performance',
  'analytics_bi',
  'Address inconsistent performance with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map inconsistent_performance to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'inconsistent_performance',
  'analytics_bi',
  'Address inconsistent performance with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map resource_contention to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'resource_contention',
  'analytics_bi',
  'Address resource contention with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map resource_contention to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'resource_contention',
  'analytics_bi',
  'Address resource contention with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map resource_contention to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'resource_contention',
  'analytics_bi',
  'Address resource contention with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map resource_contention to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'resource_contention',
  'analytics_bi',
  'Address resource contention with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map optimization_difficulty to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'optimization_difficulty',
  'analytics_bi',
  'Address optimization difficulty with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map optimization_difficulty to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'optimization_difficulty',
  'analytics_bi',
  'Address optimization difficulty with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map optimization_difficulty to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'optimization_difficulty',
  'analytics_bi',
  'Address optimization difficulty with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map optimization_difficulty to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'optimization_difficulty',
  'analytics_bi',
  'Address optimization difficulty with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map monitoring_gaps to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'monitoring_gaps',
  'analytics_bi',
  'Address monitoring gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map monitoring_gaps to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'monitoring_gaps',
  'analytics_bi',
  'Address monitoring gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map monitoring_gaps to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'monitoring_gaps',
  'analytics_bi',
  'Address monitoring gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map monitoring_gaps to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'monitoring_gaps',
  'analytics_bi',
  'Address monitoring gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map user_frustration to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'user_frustration',
  'analytics_bi',
  'Address user frustration with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map user_frustration to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'user_frustration',
  'analytics_bi',
  'Address user frustration with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map user_frustration to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'user_frustration',
  'analytics_bi',
  'Address user frustration with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map user_frustration to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'user_frustration',
  'analytics_bi',
  'Address user frustration with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map delayed_insights to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'delayed_insights',
  'analytics_bi',
  'Address delayed insights with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map delayed_insights to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'delayed_insights',
  'analytics_bi',
  'Address delayed insights with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map delayed_insights to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'delayed_insights',
  'analytics_bi',
  'Address delayed insights with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map delayed_insights to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'delayed_insights',
  'analytics_bi',
  'Address delayed insights with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map report_timeouts to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'report_timeouts',
  'analytics_bi',
  'Address report timeouts with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map report_timeouts to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'report_timeouts',
  'analytics_bi',
  'Address report timeouts with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map report_timeouts to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'report_timeouts',
  'analytics_bi',
  'Address report timeouts with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map report_timeouts to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'report_timeouts',
  'analytics_bi',
  'Address report timeouts with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map adoption_barriers to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'adoption_barriers',
  'analytics_bi',
  'Address adoption barriers with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map adoption_barriers to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'adoption_barriers',
  'analytics_bi',
  'Address adoption barriers with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map adoption_barriers to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'adoption_barriers',
  'analytics_bi',
  'Address adoption barriers with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map adoption_barriers to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'adoption_barriers',
  'analytics_bi',
  'Address adoption barriers with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map competitive_lag to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'competitive_lag',
  'analytics_bi',
  'Address competitive lag with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map competitive_lag to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'competitive_lag',
  'analytics_bi',
  'Address competitive lag with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map competitive_lag to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'competitive_lag',
  'analytics_bi',
  'Address competitive lag with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map competitive_lag to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'competitive_lag',
  'analytics_bi',
  'Address competitive lag with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map ad_hoc_optimization to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'ad_hoc_optimization',
  'analytics_bi',
  'Address ad hoc optimization with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map ad_hoc_optimization to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'ad_hoc_optimization',
  'analytics_bi',
  'Address ad hoc optimization with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map ad_hoc_optimization to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'ad_hoc_optimization',
  'analytics_bi',
  'Address ad hoc optimization with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map ad_hoc_optimization to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'ad_hoc_optimization',
  'analytics_bi',
  'Address ad hoc optimization with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map lack_of_tools to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'lack_of_tools',
  'analytics_bi',
  'Address lack of tools with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map lack_of_tools to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'lack_of_tools',
  'analytics_bi',
  'Address lack of tools with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map lack_of_tools to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'lack_of_tools',
  'analytics_bi',
  'Address lack of tools with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map lack_of_tools to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'lack_of_tools',
  'analytics_bi',
  'Address lack of tools with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map query_complexity to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'query_complexity',
  'analytics_bi',
  'Address query complexity with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map query_complexity to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'query_complexity',
  'analytics_bi',
  'Address query complexity with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map query_complexity to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'query_complexity',
  'analytics_bi',
  'Address query complexity with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map query_complexity to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'query_complexity',
  'analytics_bi',
  'Address query complexity with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map indexing_gaps to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'indexing_gaps',
  'analytics_bi',
  'Address indexing gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map indexing_gaps to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'indexing_gaps',
  'analytics_bi',
  'Address indexing gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map indexing_gaps to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'indexing_gaps',
  'analytics_bi',
  'Address indexing gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map indexing_gaps to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'indexing_gaps',
  'analytics_bi',
  'Address indexing gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map knowledge_gaps to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'knowledge_gaps',
  'analytics_bi',
  'Address knowledge gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map knowledge_gaps to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'knowledge_gaps',
  'analytics_bi',
  'Address knowledge gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map knowledge_gaps to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'knowledge_gaps',
  'analytics_bi',
  'Address knowledge gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map knowledge_gaps to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'knowledge_gaps',
  'analytics_bi',
  'Address knowledge gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map high_compute_costs to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'high_compute_costs',
  'analytics_bi',
  'Address high compute costs with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map high_compute_costs to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'high_compute_costs',
  'analytics_bi',
  'Address high compute costs with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map high_compute_costs to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'high_compute_costs',
  'analytics_bi',
  'Address high compute costs with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map high_compute_costs to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'high_compute_costs',
  'analytics_bi',
  'Address high compute costs with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map poor_user_experience to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'poor_user_experience',
  'analytics_bi',
  'Address poor user experience with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map poor_user_experience to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'poor_user_experience',
  'analytics_bi',
  'Address poor user experience with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map poor_user_experience to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'poor_user_experience',
  'analytics_bi',
  'Address poor user experience with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map poor_user_experience to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'poor_user_experience',
  'analytics_bi',
  'Address poor user experience with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map limited_scalability to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'limited_scalability',
  'analytics_bi',
  'Address limited scalability with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map limited_scalability to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'limited_scalability',
  'analytics_bi',
  'Address limited scalability with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map limited_scalability to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'limited_scalability',
  'analytics_bi',
  'Address limited scalability with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map limited_scalability to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'limited_scalability',
  'analytics_bi',
  'Address limited scalability with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map optimization_delays to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'optimization_delays',
  'analytics_bi',
  'Address optimization delays with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map optimization_delays to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'optimization_delays',
  'analytics_bi',
  'Address optimization delays with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map optimization_delays to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'optimization_delays',
  'analytics_bi',
  'Address optimization delays with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map optimization_delays to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'optimization_delays',
  'analytics_bi',
  'Address optimization delays with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reactive_approach to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reactive_approach',
  'analytics_bi',
  'Address reactive approach with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reactive_approach to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reactive_approach',
  'analytics_bi',
  'Address reactive approach with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reactive_approach to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reactive_approach',
  'analytics_bi',
  'Address reactive approach with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reactive_approach to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reactive_approach',
  'analytics_bi',
  'Address reactive approach with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map metric_inconsistency to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'metric_inconsistency',
  'analytics_bi',
  'Address metric inconsistency with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map metric_inconsistency to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'metric_inconsistency',
  'analytics_bi',
  'Address metric inconsistency with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map metric_inconsistency to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'metric_inconsistency',
  'analytics_bi',
  'Address metric inconsistency with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map metric_inconsistency to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'metric_inconsistency',
  'analytics_bi',
  'Address metric inconsistency with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_shared_layer to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_shared_layer',
  'analytics_bi',
  'Address no shared layer with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_shared_layer to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_shared_layer',
  'analytics_bi',
  'Address no shared layer with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_shared_layer to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_shared_layer',
  'analytics_bi',
  'Address no shared layer with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_shared_layer to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_shared_layer',
  'analytics_bi',
  'Address no shared layer with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map duplicate_logic to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'duplicate_logic',
  'analytics_bi',
  'Address duplicate logic with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map duplicate_logic to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'duplicate_logic',
  'analytics_bi',
  'Address duplicate logic with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map duplicate_logic to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'duplicate_logic',
  'analytics_bi',
  'Address duplicate logic with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map duplicate_logic to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'duplicate_logic',
  'analytics_bi',
  'Address duplicate logic with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map version_confusion to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'version_confusion',
  'analytics_bi',
  'Address version confusion with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map version_confusion to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'version_confusion',
  'analytics_bi',
  'Address version confusion with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map version_confusion to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'version_confusion',
  'analytics_bi',
  'Address version confusion with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map version_confusion to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'version_confusion',
  'analytics_bi',
  'Address version confusion with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map documentation_gaps to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'documentation_gaps',
  'analytics_bi',
  'Address documentation gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map documentation_gaps to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'documentation_gaps',
  'analytics_bi',
  'Address documentation gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map documentation_gaps to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'documentation_gaps',
  'analytics_bi',
  'Address documentation gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map documentation_gaps to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'documentation_gaps',
  'analytics_bi',
  'Address documentation gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map conflicting_reports to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'conflicting_reports',
  'analytics_bi',
  'Address conflicting reports with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map conflicting_reports to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'conflicting_reports',
  'analytics_bi',
  'Address conflicting reports with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map conflicting_reports to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'conflicting_reports',
  'analytics_bi',
  'Address conflicting reports with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map conflicting_reports to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'conflicting_reports',
  'analytics_bi',
  'Address conflicting reports with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map trust_issues to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'trust_issues',
  'analytics_bi',
  'Address trust issues with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map trust_issues to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'trust_issues',
  'analytics_bi',
  'Address trust issues with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map trust_issues to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'trust_issues',
  'analytics_bi',
  'Address trust issues with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map trust_issues to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'trust_issues',
  'analytics_bi',
  'Address trust issues with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map decision_delays to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'decision_delays',
  'analytics_bi',
  'Address decision delays with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map decision_delays to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'decision_delays',
  'analytics_bi',
  'Address decision delays with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map decision_delays to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'decision_delays',
  'analytics_bi',
  'Address decision delays with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map decision_delays to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'decision_delays',
  'analytics_bi',
  'Address decision delays with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map wasted_effort to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'wasted_effort',
  'analytics_bi',
  'Address wasted effort with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map wasted_effort to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'wasted_effort',
  'analytics_bi',
  'Address wasted effort with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map wasted_effort to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'wasted_effort',
  'analytics_bi',
  'Address wasted effort with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map wasted_effort to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'wasted_effort',
  'analytics_bi',
  'Address wasted effort with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map compliance_risk to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'compliance_risk',
  'analytics_bi',
  'Address compliance risk with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map compliance_risk to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'compliance_risk',
  'analytics_bi',
  'Address compliance risk with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map compliance_risk to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'compliance_risk',
  'analytics_bi',
  'Address compliance risk with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map compliance_risk to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'compliance_risk',
  'analytics_bi',
  'Address compliance risk with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map poor_discoverability to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'poor_discoverability',
  'analytics_bi',
  'Address poor discoverability with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map poor_discoverability to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'poor_discoverability',
  'analytics_bi',
  'Address poor discoverability with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map poor_discoverability to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'poor_discoverability',
  'analytics_bi',
  'Address poor discoverability with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map poor_discoverability to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'poor_discoverability',
  'analytics_bi',
  'Address poor discoverability with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map catalog_gaps to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'catalog_gaps',
  'analytics_bi',
  'Address catalog gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map catalog_gaps to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'catalog_gaps',
  'analytics_bi',
  'Address catalog gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map catalog_gaps to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'catalog_gaps',
  'analytics_bi',
  'Address catalog gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map catalog_gaps to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'catalog_gaps',
  'analytics_bi',
  'Address catalog gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map unclear_lineage to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'unclear_lineage',
  'analytics_bi',
  'Address unclear lineage with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map unclear_lineage to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'unclear_lineage',
  'analytics_bi',
  'Address unclear lineage with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map unclear_lineage to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'unclear_lineage',
  'analytics_bi',
  'Address unclear lineage with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map unclear_lineage to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'unclear_lineage',
  'analytics_bi',
  'Address unclear lineage with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map access_complexity to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'access_complexity',
  'analytics_bi',
  'Address access complexity with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map access_complexity to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'access_complexity',
  'analytics_bi',
  'Address access complexity with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map access_complexity to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'access_complexity',
  'analytics_bi',
  'Address access complexity with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map access_complexity to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'access_complexity',
  'analytics_bi',
  'Address access complexity with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map quality_uncertainty to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'quality_uncertainty',
  'analytics_bi',
  'Address quality uncertainty with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map quality_uncertainty to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'quality_uncertainty',
  'analytics_bi',
  'Address quality uncertainty with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map quality_uncertainty to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'quality_uncertainty',
  'analytics_bi',
  'Address quality uncertainty with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map quality_uncertainty to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'quality_uncertainty',
  'analytics_bi',
  'Address quality uncertainty with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map analyst_inefficiency to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'analyst_inefficiency',
  'analytics_bi',
  'Address analyst inefficiency with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map analyst_inefficiency to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'analyst_inefficiency',
  'analytics_bi',
  'Address analyst inefficiency with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map analyst_inefficiency to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'analyst_inefficiency',
  'analytics_bi',
  'Address analyst inefficiency with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map analyst_inefficiency to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'analyst_inefficiency',
  'analytics_bi',
  'Address analyst inefficiency with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map duplicate_work to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'duplicate_work',
  'analytics_bi',
  'Address duplicate work with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map duplicate_work to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'duplicate_work',
  'analytics_bi',
  'Address duplicate work with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map duplicate_work to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'duplicate_work',
  'analytics_bi',
  'Address duplicate work with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map duplicate_work to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'duplicate_work',
  'analytics_bi',
  'Address duplicate work with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map low_reuse to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'low_reuse',
  'analytics_bi',
  'Address low reuse with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map low_reuse to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'low_reuse',
  'analytics_bi',
  'Address low reuse with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map low_reuse to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'low_reuse',
  'analytics_bi',
  'Address low reuse with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map low_reuse to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'low_reuse',
  'analytics_bi',
  'Address low reuse with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map trust_deficit to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'trust_deficit',
  'analytics_bi',
  'Address trust deficit with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map trust_deficit to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'trust_deficit',
  'analytics_bi',
  'Address trust deficit with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map trust_deficit to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'trust_deficit',
  'analytics_bi',
  'Address trust deficit with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map trust_deficit to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'trust_deficit',
  'analytics_bi',
  'Address trust deficit with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map onboarding_delays to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'onboarding_delays',
  'analytics_bi',
  'Address onboarding delays with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map onboarding_delays to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'onboarding_delays',
  'analytics_bi',
  'Address onboarding delays with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map onboarding_delays to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'onboarding_delays',
  'analytics_bi',
  'Address onboarding delays with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map onboarding_delays to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'onboarding_delays',
  'analytics_bi',
  'Address onboarding delays with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map integration_complexity to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'integration_complexity',
  'analytics_bi',
  'Address integration complexity with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map integration_complexity to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'integration_complexity',
  'analytics_bi',
  'Address integration complexity with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map integration_complexity to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'integration_complexity',
  'analytics_bi',
  'Address integration complexity with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map integration_complexity to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'integration_complexity',
  'analytics_bi',
  'Address integration complexity with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map performance_issues to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'performance_issues',
  'analytics_bi',
  'Address performance issues with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map performance_issues to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'performance_issues',
  'analytics_bi',
  'Address performance issues with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map performance_issues to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'performance_issues',
  'analytics_bi',
  'Address performance issues with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map performance_issues to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'performance_issues',
  'analytics_bi',
  'Address performance issues with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_extracts to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_extracts',
  'analytics_bi',
  'Address data extracts with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_extracts to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_extracts',
  'analytics_bi',
  'Address data extracts with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_extracts to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_extracts',
  'analytics_bi',
  'Address data extracts with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_extracts to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_extracts',
  'analytics_bi',
  'Address data extracts with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map refresh_delays to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'refresh_delays',
  'analytics_bi',
  'Address refresh delays with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map refresh_delays to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'refresh_delays',
  'analytics_bi',
  'Address refresh delays with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map refresh_delays to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'refresh_delays',
  'analytics_bi',
  'Address refresh delays with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map refresh_delays to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'refresh_delays',
  'analytics_bi',
  'Address refresh delays with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map limited_interactivity to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'limited_interactivity',
  'analytics_bi',
  'Address limited interactivity with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map limited_interactivity to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'limited_interactivity',
  'analytics_bi',
  'Address limited interactivity with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map limited_interactivity to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'limited_interactivity',
  'analytics_bi',
  'Address limited interactivity with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map limited_interactivity to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'limited_interactivity',
  'analytics_bi',
  'Address limited interactivity with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map stale_dashboards to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'stale_dashboards',
  'analytics_bi',
  'Address stale dashboards with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map stale_dashboards to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'stale_dashboards',
  'analytics_bi',
  'Address stale dashboards with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map stale_dashboards to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'stale_dashboards',
  'analytics_bi',
  'Address stale dashboards with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map stale_dashboards to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'stale_dashboards',
  'analytics_bi',
  'Address stale dashboards with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map limited_adoption to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'limited_adoption',
  'analytics_bi',
  'Address limited adoption with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map limited_adoption to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'limited_adoption',
  'analytics_bi',
  'Address limited adoption with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map limited_adoption to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'limited_adoption',
  'analytics_bi',
  'Address limited adoption with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map limited_adoption to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'limited_adoption',
  'analytics_bi',
  'Address limited adoption with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reporting_delays to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reporting_delays',
  'analytics_bi',
  'Address reporting delays with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reporting_delays to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reporting_delays',
  'analytics_bi',
  'Address reporting delays with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reporting_delays to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reporting_delays',
  'analytics_bi',
  'Address reporting delays with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reporting_delays to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reporting_delays',
  'analytics_bi',
  'Address reporting delays with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map cost_overhead to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'cost_overhead',
  'analytics_bi',
  'Address cost overhead with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map cost_overhead to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'cost_overhead',
  'analytics_bi',
  'Address cost overhead with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map cost_overhead to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'cost_overhead',
  'analytics_bi',
  'Address cost overhead with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map cost_overhead to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'cost_overhead',
  'analytics_bi',
  'Address cost overhead with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map inconsistent_schedules to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'inconsistent_schedules',
  'analytics_bi',
  'Address inconsistent schedules with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map inconsistent_schedules to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'inconsistent_schedules',
  'analytics_bi',
  'Address inconsistent schedules with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map inconsistent_schedules to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'inconsistent_schedules',
  'analytics_bi',
  'Address inconsistent schedules with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map inconsistent_schedules to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'inconsistent_schedules',
  'analytics_bi',
  'Address inconsistent schedules with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map kpi_proliferation to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'kpi_proliferation',
  'analytics_bi',
  'Address kpi proliferation with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map kpi_proliferation to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'kpi_proliferation',
  'analytics_bi',
  'Address kpi proliferation with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map kpi_proliferation to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'kpi_proliferation',
  'analytics_bi',
  'Address kpi proliferation with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map kpi_proliferation to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'kpi_proliferation',
  'analytics_bi',
  'Address kpi proliferation with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map version_control to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'version_control',
  'analytics_bi',
  'Address version control with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map version_control to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'version_control',
  'analytics_bi',
  'Address version control with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map version_control to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'version_control',
  'analytics_bi',
  'Address version control with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map version_control to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'version_control',
  'analytics_bi',
  'Address version control with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map access_management to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'access_management',
  'analytics_bi',
  'Address access management with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map access_management to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'access_management',
  'analytics_bi',
  'Address access management with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map access_management to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'access_management',
  'analytics_bi',
  'Address access management with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map access_management to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'access_management',
  'analytics_bi',
  'Address access management with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map audit_trails to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'audit_trails',
  'analytics_bi',
  'Address audit trails with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map audit_trails to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'audit_trails',
  'analytics_bi',
  'Address audit trails with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map audit_trails to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'audit_trails',
  'analytics_bi',
  'Address audit trails with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map audit_trails to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'audit_trails',
  'analytics_bi',
  'Address audit trails with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map conflicting_kpis to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'conflicting_kpis',
  'analytics_bi',
  'Address conflicting kpis with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map conflicting_kpis to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'conflicting_kpis',
  'analytics_bi',
  'Address conflicting kpis with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map conflicting_kpis to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'conflicting_kpis',
  'analytics_bi',
  'Address conflicting kpis with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map conflicting_kpis to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'conflicting_kpis',
  'analytics_bi',
  'Address conflicting kpis with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map report_sprawl to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'report_sprawl',
  'analytics_bi',
  'Address report sprawl with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map report_sprawl to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'report_sprawl',
  'analytics_bi',
  'Address report sprawl with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map report_sprawl to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'report_sprawl',
  'analytics_bi',
  'Address report sprawl with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map report_sprawl to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'report_sprawl',
  'analytics_bi',
  'Address report sprawl with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map compliance_gaps to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'compliance_gaps',
  'analytics_bi',
  'Address compliance gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map compliance_gaps to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'compliance_gaps',
  'analytics_bi',
  'Address compliance gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map compliance_gaps to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'compliance_gaps',
  'analytics_bi',
  'Address compliance gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map compliance_gaps to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'compliance_gaps',
  'analytics_bi',
  'Address compliance gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map maintenance_burden to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'maintenance_burden',
  'analytics_bi',
  'Address maintenance burden with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map maintenance_burden to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'maintenance_burden',
  'analytics_bi',
  'Address maintenance burden with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map maintenance_burden to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'maintenance_burden',
  'analytics_bi',
  'Address maintenance burden with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map maintenance_burden to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'maintenance_burden',
  'analytics_bi',
  'Address maintenance burden with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map trust_erosion to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'trust_erosion',
  'analytics_bi',
  'Address trust erosion with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map trust_erosion to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'trust_erosion',
  'analytics_bi',
  'Address trust erosion with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map trust_erosion to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'trust_erosion',
  'analytics_bi',
  'Address trust erosion with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map trust_erosion to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'trust_erosion',
  'analytics_bi',
  'Address trust erosion with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map tool_complexity to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'tool_complexity',
  'analytics_bi',
  'Address tool complexity with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map tool_complexity to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'tool_complexity',
  'analytics_bi',
  'Address tool complexity with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map tool_complexity to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'tool_complexity',
  'analytics_bi',
  'Address tool complexity with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map tool_complexity to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'tool_complexity',
  'analytics_bi',
  'Address tool complexity with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map access_barriers to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'access_barriers',
  'analytics_bi',
  'Address access barriers with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map access_barriers to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'access_barriers',
  'analytics_bi',
  'Address access barriers with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map access_barriers to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'access_barriers',
  'analytics_bi',
  'Address access barriers with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map access_barriers to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'access_barriers',
  'analytics_bi',
  'Address access barriers with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map training_gaps to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'training_gaps',
  'analytics_bi',
  'Address training gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map training_gaps to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'training_gaps',
  'analytics_bi',
  'Address training gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map training_gaps to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'training_gaps',
  'analytics_bi',
  'Address training gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map training_gaps to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'training_gaps',
  'analytics_bi',
  'Address training gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map limited_tooling to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'limited_tooling',
  'analytics_bi',
  'Address limited tooling with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map limited_tooling to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'limited_tooling',
  'analytics_bi',
  'Address limited tooling with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map limited_tooling to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'limited_tooling',
  'analytics_bi',
  'Address limited tooling with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map limited_tooling to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'limited_tooling',
  'analytics_bi',
  'Address limited tooling with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map support_burden to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'support_burden',
  'analytics_bi',
  'Address support burden with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map support_burden to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'support_burden',
  'analytics_bi',
  'Address support burden with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map support_burden to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'support_burden',
  'analytics_bi',
  'Address support burden with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map support_burden to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'support_burden',
  'analytics_bi',
  'Address support burden with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map analyst_bottleneck to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'analyst_bottleneck',
  'analytics_bi',
  'Address analyst bottleneck with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map analyst_bottleneck to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'analyst_bottleneck',
  'analytics_bi',
  'Address analyst bottleneck with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map analyst_bottleneck to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'analyst_bottleneck',
  'analytics_bi',
  'Address analyst bottleneck with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map analyst_bottleneck to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'analyst_bottleneck',
  'analytics_bi',
  'Address analyst bottleneck with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map slow_decisions to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'slow_decisions',
  'analytics_bi',
  'Address slow decisions with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map slow_decisions to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'slow_decisions',
  'analytics_bi',
  'Address slow decisions with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map slow_decisions to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'slow_decisions',
  'analytics_bi',
  'Address slow decisions with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map slow_decisions to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'slow_decisions',
  'analytics_bi',
  'Address slow decisions with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map low_data_literacy to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'low_data_literacy',
  'analytics_bi',
  'Address low data literacy with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map low_data_literacy to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'low_data_literacy',
  'analytics_bi',
  'Address low data literacy with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map low_data_literacy to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'low_data_literacy',
  'analytics_bi',
  'Address low data literacy with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map low_data_literacy to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'low_data_literacy',
  'analytics_bi',
  'Address low data literacy with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map missed_opportunities to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'missed_opportunities',
  'analytics_bi',
  'Address missed opportunities with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map missed_opportunities to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'missed_opportunities',
  'analytics_bi',
  'Address missed opportunities with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map missed_opportunities to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'missed_opportunities',
  'analytics_bi',
  'Address missed opportunities with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map missed_opportunities to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'missed_opportunities',
  'analytics_bi',
  'Address missed opportunities with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map security_gaps to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'security_gaps',
  'analytics_bi',
  'Address security gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map security_gaps to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'security_gaps',
  'analytics_bi',
  'Address security gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map security_gaps to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'security_gaps',
  'analytics_bi',
  'Address security gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map security_gaps to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'security_gaps',
  'analytics_bi',
  'Address security gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map wild_west_access to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'wild_west_access',
  'analytics_bi',
  'Address wild west access with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map wild_west_access to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'wild_west_access',
  'analytics_bi',
  'Address wild west access with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map wild_west_access to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'wild_west_access',
  'analytics_bi',
  'Address wild west access with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map wild_west_access to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'wild_west_access',
  'analytics_bi',
  'Address wild west access with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map quality_control to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'quality_control',
  'analytics_bi',
  'Address quality control with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map quality_control to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'quality_control',
  'analytics_bi',
  'Address quality control with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map quality_control to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'quality_control',
  'analytics_bi',
  'Address quality control with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map quality_control to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'quality_control',
  'analytics_bi',
  'Address quality control with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map audit_challenges to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'audit_challenges',
  'analytics_bi',
  'Address audit challenges with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map audit_challenges to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'audit_challenges',
  'analytics_bi',
  'Address audit challenges with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map audit_challenges to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'audit_challenges',
  'analytics_bi',
  'Address audit challenges with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map audit_challenges to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'audit_challenges',
  'analytics_bi',
  'Address audit challenges with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map policy_enforcement to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'policy_enforcement',
  'analytics_bi',
  'Address policy enforcement with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map policy_enforcement to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'policy_enforcement',
  'analytics_bi',
  'Address policy enforcement with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map policy_enforcement to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'policy_enforcement',
  'analytics_bi',
  'Address policy enforcement with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map policy_enforcement to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'policy_enforcement',
  'analytics_bi',
  'Address policy enforcement with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_misuse to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_misuse',
  'analytics_bi',
  'Address data misuse with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_misuse to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_misuse',
  'analytics_bi',
  'Address data misuse with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_misuse to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_misuse',
  'analytics_bi',
  'Address data misuse with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_misuse to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_misuse',
  'analytics_bi',
  'Address data misuse with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map inconsistent_analysis to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'inconsistent_analysis',
  'analytics_bi',
  'Address inconsistent analysis with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map inconsistent_analysis to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'inconsistent_analysis',
  'analytics_bi',
  'Address inconsistent analysis with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map inconsistent_analysis to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'inconsistent_analysis',
  'analytics_bi',
  'Address inconsistent analysis with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map inconsistent_analysis to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'inconsistent_analysis',
  'analytics_bi',
  'Address inconsistent analysis with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map regulatory_exposure to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'regulatory_exposure',
  'analytics_bi',
  'Address regulatory exposure with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map regulatory_exposure to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'regulatory_exposure',
  'analytics_bi',
  'Address regulatory exposure with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map regulatory_exposure to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'regulatory_exposure',
  'analytics_bi',
  'Address regulatory exposure with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map regulatory_exposure to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'regulatory_exposure',
  'analytics_bi',
  'Address regulatory exposure with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map sharing_complexity to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'sharing_complexity',
  'analytics_bi',
  'Address sharing complexity with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map sharing_complexity to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'sharing_complexity',
  'analytics_bi',
  'Address sharing complexity with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map sharing_complexity to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'sharing_complexity',
  'analytics_bi',
  'Address sharing complexity with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map sharing_complexity to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'sharing_complexity',
  'analytics_bi',
  'Address sharing complexity with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map security_concerns to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'security_concerns',
  'analytics_bi',
  'Address security concerns with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map security_concerns to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'security_concerns',
  'analytics_bi',
  'Address security concerns with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map security_concerns to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'security_concerns',
  'analytics_bi',
  'Address security concerns with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map security_concerns to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'security_concerns',
  'analytics_bi',
  'Address security concerns with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map format_compatibility to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'format_compatibility',
  'analytics_bi',
  'Address format compatibility with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map format_compatibility to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'format_compatibility',
  'analytics_bi',
  'Address format compatibility with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map format_compatibility to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'format_compatibility',
  'analytics_bi',
  'Address format compatibility with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map format_compatibility to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'format_compatibility',
  'analytics_bi',
  'Address format compatibility with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map access_provisioning to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'access_provisioning',
  'analytics_bi',
  'Address access provisioning with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map access_provisioning to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'access_provisioning',
  'analytics_bi',
  'Address access provisioning with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map access_provisioning to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'access_provisioning',
  'analytics_bi',
  'Address access provisioning with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map access_provisioning to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'access_provisioning',
  'analytics_bi',
  'Address access provisioning with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map tracking_gaps to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'tracking_gaps',
  'analytics_bi',
  'Address tracking gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map tracking_gaps to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'tracking_gaps',
  'analytics_bi',
  'Address tracking gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map tracking_gaps to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'tracking_gaps',
  'analytics_bi',
  'Address tracking gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map tracking_gaps to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'tracking_gaps',
  'analytics_bi',
  'Address tracking gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map partner_friction to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'partner_friction',
  'analytics_bi',
  'Address partner friction with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map partner_friction to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'partner_friction',
  'analytics_bi',
  'Address partner friction with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map partner_friction to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'partner_friction',
  'analytics_bi',
  'Address partner friction with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map partner_friction to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'partner_friction',
  'analytics_bi',
  'Address partner friction with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map collaboration_barriers to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'collaboration_barriers',
  'analytics_bi',
  'Address collaboration barriers with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map collaboration_barriers to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'collaboration_barriers',
  'analytics_bi',
  'Address collaboration barriers with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map collaboration_barriers to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'collaboration_barriers',
  'analytics_bi',
  'Address collaboration barriers with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map collaboration_barriers to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'collaboration_barriers',
  'analytics_bi',
  'Address collaboration barriers with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map revenue_impact to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'revenue_impact',
  'analytics_bi',
  'Address revenue impact with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map revenue_impact to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'revenue_impact',
  'analytics_bi',
  'Address revenue impact with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map revenue_impact to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'revenue_impact',
  'analytics_bi',
  'Address revenue impact with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map revenue_impact to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'revenue_impact',
  'analytics_bi',
  'Address revenue impact with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map competitive_disadvantage to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'competitive_disadvantage',
  'analytics_bi',
  'Address competitive disadvantage with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map competitive_disadvantage to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'competitive_disadvantage',
  'analytics_bi',
  'Address competitive disadvantage with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map competitive_disadvantage to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'competitive_disadvantage',
  'analytics_bi',
  'Address competitive disadvantage with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map competitive_disadvantage to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'competitive_disadvantage',
  'analytics_bi',
  'Address competitive disadvantage with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_silos to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_silos',
  'analytics_bi',
  'Address data silos with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_silos to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_silos',
  'analytics_bi',
  'Address data silos with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_silos to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_silos',
  'analytics_bi',
  'Address data silos with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_silos to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_silos',
  'analytics_bi',
  'Address data silos with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map join_performance to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'join_performance',
  'analytics_bi',
  'Address join performance with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map join_performance to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'join_performance',
  'analytics_bi',
  'Address join performance with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map join_performance to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'join_performance',
  'analytics_bi',
  'Address join performance with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map join_performance to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'join_performance',
  'analytics_bi',
  'Address join performance with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map schema_conflicts to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'schema_conflicts',
  'analytics_bi',
  'Address schema conflicts with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map schema_conflicts to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'schema_conflicts',
  'analytics_bi',
  'Address schema conflicts with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map schema_conflicts to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'schema_conflicts',
  'analytics_bi',
  'Address schema conflicts with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map schema_conflicts to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'schema_conflicts',
  'analytics_bi',
  'Address schema conflicts with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map governance_gaps to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'governance_gaps',
  'analytics_bi',
  'Address governance gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map governance_gaps to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'governance_gaps',
  'analytics_bi',
  'Address governance gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map governance_gaps to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'governance_gaps',
  'analytics_bi',
  'Address governance gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map governance_gaps to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'governance_gaps',
  'analytics_bi',
  'Address governance gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map limited_insights to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'limited_insights',
  'analytics_bi',
  'Address limited insights with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map limited_insights to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'limited_insights',
  'analytics_bi',
  'Address limited insights with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map limited_insights to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'limited_insights',
  'analytics_bi',
  'Address limited insights with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map limited_insights to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'limited_insights',
  'analytics_bi',
  'Address limited insights with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map integration_delays to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'integration_delays',
  'analytics_bi',
  'Address integration delays with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map integration_delays to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'integration_delays',
  'analytics_bi',
  'Address integration delays with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map integration_delays to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'integration_delays',
  'analytics_bi',
  'Address integration delays with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map integration_delays to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'integration_delays',
  'analytics_bi',
  'Address integration delays with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map opportunity_cost to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'opportunity_cost',
  'analytics_bi',
  'Address opportunity cost with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map opportunity_cost to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'opportunity_cost',
  'analytics_bi',
  'Address opportunity cost with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map opportunity_cost to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'opportunity_cost',
  'analytics_bi',
  'Address opportunity cost with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map opportunity_cost to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'opportunity_cost',
  'analytics_bi',
  'Address opportunity cost with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map decision_friction to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'decision_friction',
  'analytics_bi',
  'Address decision friction with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map decision_friction to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'decision_friction',
  'analytics_bi',
  'Address decision friction with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map decision_friction to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'decision_friction',
  'analytics_bi',
  'Address decision friction with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map decision_friction to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'decision_friction',
  'analytics_bi',
  'Address decision friction with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map strategic_limitations to analytics features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'strategic_limitations',
  'analytics_bi',
  'Address strategic limitations with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'analytics'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map strategic_limitations to bi features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'strategic_limitations',
  'analytics_bi',
  'Address strategic limitations with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'bi'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map strategic_limitations to sql features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'strategic_limitations',
  'analytics_bi',
  'Address strategic limitations with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'sql'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map strategic_limitations to visualization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'strategic_limitations',
  'analytics_bi',
  'Address strategic limitations with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'visualization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;


-- MACHINE_LEARNING (96 pain points)
-- ============================================================================

-- Map no_tracking to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_tracking',
  'machine_learning',
  'Address no tracking with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_tracking to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_tracking',
  'machine_learning',
  'Address no tracking with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_tracking to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_tracking',
  'machine_learning',
  'Address no tracking with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reproducibility_issues to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reproducibility_issues',
  'machine_learning',
  'Address reproducibility issues with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reproducibility_issues to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reproducibility_issues',
  'machine_learning',
  'Address reproducibility issues with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reproducibility_issues to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reproducibility_issues',
  'machine_learning',
  'Address reproducibility issues with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map scattered_artifacts to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'scattered_artifacts',
  'machine_learning',
  'Address scattered artifacts with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map scattered_artifacts to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'scattered_artifacts',
  'machine_learning',
  'Address scattered artifacts with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map scattered_artifacts to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'scattered_artifacts',
  'machine_learning',
  'Address scattered artifacts with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map manual_logging to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'manual_logging',
  'machine_learning',
  'Address manual logging with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map manual_logging to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'manual_logging',
  'machine_learning',
  'Address manual logging with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map manual_logging to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'manual_logging',
  'machine_learning',
  'Address manual logging with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map comparison_difficulty to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'comparison_difficulty',
  'machine_learning',
  'Address comparison difficulty with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map comparison_difficulty to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'comparison_difficulty',
  'machine_learning',
  'Address comparison difficulty with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map comparison_difficulty to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'comparison_difficulty',
  'machine_learning',
  'Address comparison difficulty with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map wasted_effort to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'wasted_effort',
  'machine_learning',
  'Address wasted effort with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map wasted_effort to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'wasted_effort',
  'machine_learning',
  'Address wasted effort with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map wasted_effort to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'wasted_effort',
  'machine_learning',
  'Address wasted effort with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map slow_iteration to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'slow_iteration',
  'machine_learning',
  'Address slow iteration with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map slow_iteration to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'slow_iteration',
  'machine_learning',
  'Address slow iteration with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map slow_iteration to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'slow_iteration',
  'machine_learning',
  'Address slow iteration with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map knowledge_loss to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'knowledge_loss',
  'machine_learning',
  'Address knowledge loss with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map knowledge_loss to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'knowledge_loss',
  'machine_learning',
  'Address knowledge loss with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map knowledge_loss to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'knowledge_loss',
  'machine_learning',
  'Address knowledge loss with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map audit_challenges to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'audit_challenges',
  'machine_learning',
  'Address audit challenges with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map audit_challenges to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'audit_challenges',
  'machine_learning',
  'Address audit challenges with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map audit_challenges to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'audit_challenges',
  'machine_learning',
  'Address audit challenges with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map limited_reuse to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'limited_reuse',
  'machine_learning',
  'Address limited reuse with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map limited_reuse to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'limited_reuse',
  'machine_learning',
  'Address limited reuse with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map limited_reuse to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'limited_reuse',
  'machine_learning',
  'Address limited reuse with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map environment_drift to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'environment_drift',
  'machine_learning',
  'Address environment drift with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map environment_drift to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'environment_drift',
  'machine_learning',
  'Address environment drift with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map environment_drift to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'environment_drift',
  'machine_learning',
  'Address environment drift with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map dependency_issues to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'dependency_issues',
  'machine_learning',
  'Address dependency issues with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map dependency_issues to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'dependency_issues',
  'machine_learning',
  'Address dependency issues with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map dependency_issues to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'dependency_issues',
  'machine_learning',
  'Address dependency issues with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_versioning to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_versioning',
  'machine_learning',
  'Address data versioning with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_versioning to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_versioning',
  'machine_learning',
  'Address data versioning with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_versioning to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_versioning',
  'machine_learning',
  'Address data versioning with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map model_packaging to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'model_packaging',
  'machine_learning',
  'Address model packaging with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map model_packaging to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'model_packaging',
  'machine_learning',
  'Address model packaging with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map model_packaging to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'model_packaging',
  'machine_learning',
  'Address model packaging with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map seed_management to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'seed_management',
  'machine_learning',
  'Address seed management with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map seed_management to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'seed_management',
  'machine_learning',
  'Address seed management with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map seed_management to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'seed_management',
  'machine_learning',
  'Address seed management with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map debugging_difficulty to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'debugging_difficulty',
  'machine_learning',
  'Address debugging difficulty with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map debugging_difficulty to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'debugging_difficulty',
  'machine_learning',
  'Address debugging difficulty with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map debugging_difficulty to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'debugging_difficulty',
  'machine_learning',
  'Address debugging difficulty with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map production_failures to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'production_failures',
  'machine_learning',
  'Address production failures with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map production_failures to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'production_failures',
  'machine_learning',
  'Address production failures with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map production_failures to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'production_failures',
  'machine_learning',
  'Address production failures with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map trust_issues to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'trust_issues',
  'machine_learning',
  'Address trust issues with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map trust_issues to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'trust_issues',
  'machine_learning',
  'Address trust issues with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map trust_issues to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'trust_issues',
  'machine_learning',
  'Address trust issues with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map compliance_risk to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'compliance_risk',
  'machine_learning',
  'Address compliance risk with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map compliance_risk to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'compliance_risk',
  'machine_learning',
  'Address compliance risk with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map compliance_risk to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'compliance_risk',
  'machine_learning',
  'Address compliance risk with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map rollback_complexity to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'rollback_complexity',
  'machine_learning',
  'Address rollback complexity with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map rollback_complexity to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'rollback_complexity',
  'machine_learning',
  'Address rollback complexity with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map rollback_complexity to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'rollback_complexity',
  'machine_learning',
  'Address rollback complexity with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map manual_deployment to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'manual_deployment',
  'machine_learning',
  'Address manual deployment with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map manual_deployment to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'manual_deployment',
  'machine_learning',
  'Address manual deployment with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map manual_deployment to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'manual_deployment',
  'machine_learning',
  'Address manual deployment with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_cicd to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_cicd',
  'machine_learning',
  'Address no cicd with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_cicd to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_cicd',
  'machine_learning',
  'Address no cicd with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_cicd to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_cicd',
  'machine_learning',
  'Address no cicd with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map environment_inconsistency to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'environment_inconsistency',
  'machine_learning',
  'Address environment inconsistency with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map environment_inconsistency to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'environment_inconsistency',
  'machine_learning',
  'Address environment inconsistency with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map environment_inconsistency to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'environment_inconsistency',
  'machine_learning',
  'Address environment inconsistency with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map rollback_difficulty to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'rollback_difficulty',
  'machine_learning',
  'Address rollback difficulty with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map rollback_difficulty to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'rollback_difficulty',
  'machine_learning',
  'Address rollback difficulty with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map rollback_difficulty to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'rollback_difficulty',
  'machine_learning',
  'Address rollback difficulty with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map testing_gaps to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'testing_gaps',
  'machine_learning',
  'Address testing gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map testing_gaps to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'testing_gaps',
  'machine_learning',
  'Address testing gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map testing_gaps to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'testing_gaps',
  'machine_learning',
  'Address testing gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map slow_time_to_value to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'slow_time_to_value',
  'machine_learning',
  'Address slow time to value with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map slow_time_to_value to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'slow_time_to_value',
  'machine_learning',
  'Address slow time to value with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map slow_time_to_value to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'slow_time_to_value',
  'machine_learning',
  'Address slow time to value with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map deployment_failures to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'deployment_failures',
  'machine_learning',
  'Address deployment failures with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map deployment_failures to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'deployment_failures',
  'machine_learning',
  'Address deployment failures with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map deployment_failures to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'deployment_failures',
  'machine_learning',
  'Address deployment failures with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map resource_intensive to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'resource_intensive',
  'machine_learning',
  'Address resource intensive with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map resource_intensive to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'resource_intensive',
  'machine_learning',
  'Address resource intensive with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map resource_intensive to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'resource_intensive',
  'machine_learning',
  'Address resource intensive with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map innovation_bottleneck to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'innovation_bottleneck',
  'machine_learning',
  'Address innovation bottleneck with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map innovation_bottleneck to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'innovation_bottleneck',
  'machine_learning',
  'Address innovation bottleneck with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map innovation_bottleneck to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'innovation_bottleneck',
  'machine_learning',
  'Address innovation bottleneck with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map business_risk to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'business_risk',
  'machine_learning',
  'Address business risk with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map business_risk to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'business_risk',
  'machine_learning',
  'Address business risk with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map business_risk to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'business_risk',
  'machine_learning',
  'Address business risk with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_monitoring to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_monitoring',
  'machine_learning',
  'Address no monitoring with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_monitoring to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_monitoring',
  'machine_learning',
  'Address no monitoring with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_monitoring to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_monitoring',
  'machine_learning',
  'Address no monitoring with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map drift_detection to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'drift_detection',
  'machine_learning',
  'Address drift detection with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map drift_detection to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'drift_detection',
  'machine_learning',
  'Address drift detection with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map drift_detection to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'drift_detection',
  'machine_learning',
  'Address drift detection with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map alert_gaps to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'alert_gaps',
  'machine_learning',
  'Address alert gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map alert_gaps to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'alert_gaps',
  'machine_learning',
  'Address alert gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map alert_gaps to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'alert_gaps',
  'machine_learning',
  'Address alert gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map manual_retraining to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'manual_retraining',
  'machine_learning',
  'Address manual retraining with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map manual_retraining to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'manual_retraining',
  'machine_learning',
  'Address manual retraining with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map manual_retraining to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'manual_retraining',
  'machine_learning',
  'Address manual retraining with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map performance_tracking to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'performance_tracking',
  'machine_learning',
  'Address performance tracking with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map performance_tracking to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'performance_tracking',
  'machine_learning',
  'Address performance tracking with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map performance_tracking to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'performance_tracking',
  'machine_learning',
  'Address performance tracking with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map silent_failures to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'silent_failures',
  'machine_learning',
  'Address silent failures with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map silent_failures to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'silent_failures',
  'machine_learning',
  'Address silent failures with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map silent_failures to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'silent_failures',
  'machine_learning',
  'Address silent failures with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map customer_impact to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'customer_impact',
  'machine_learning',
  'Address customer impact with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map customer_impact to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'customer_impact',
  'machine_learning',
  'Address customer impact with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map customer_impact to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'customer_impact',
  'machine_learning',
  'Address customer impact with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map revenue_loss to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'revenue_loss',
  'machine_learning',
  'Address revenue loss with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map revenue_loss to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'revenue_loss',
  'machine_learning',
  'Address revenue loss with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map revenue_loss to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'revenue_loss',
  'machine_learning',
  'Address revenue loss with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map trust_erosion to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'trust_erosion',
  'machine_learning',
  'Address trust erosion with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map trust_erosion to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'trust_erosion',
  'machine_learning',
  'Address trust erosion with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map trust_erosion to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'trust_erosion',
  'machine_learning',
  'Address trust erosion with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reactive_approach to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reactive_approach',
  'machine_learning',
  'Address reactive approach with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reactive_approach to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reactive_approach',
  'machine_learning',
  'Address reactive approach with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reactive_approach to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reactive_approach',
  'machine_learning',
  'Address reactive approach with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_feature_store to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_feature_store',
  'machine_learning',
  'Address no feature store with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_feature_store to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_feature_store',
  'machine_learning',
  'Address no feature store with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_feature_store to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_feature_store',
  'machine_learning',
  'Address no feature store with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map duplicate_features to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'duplicate_features',
  'machine_learning',
  'Address duplicate features with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map duplicate_features to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'duplicate_features',
  'machine_learning',
  'Address duplicate features with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map duplicate_features to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'duplicate_features',
  'machine_learning',
  'Address duplicate features with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map consistency_issues to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'consistency_issues',
  'machine_learning',
  'Address consistency issues with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map consistency_issues to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'consistency_issues',
  'machine_learning',
  'Address consistency issues with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map consistency_issues to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'consistency_issues',
  'machine_learning',
  'Address consistency issues with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map discovery_difficulty to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'discovery_difficulty',
  'machine_learning',
  'Address discovery difficulty with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map discovery_difficulty to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'discovery_difficulty',
  'machine_learning',
  'Address discovery difficulty with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map discovery_difficulty to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'discovery_difficulty',
  'machine_learning',
  'Address discovery difficulty with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map versioning_gaps to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'versioning_gaps',
  'machine_learning',
  'Address versioning gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map versioning_gaps to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'versioning_gaps',
  'machine_learning',
  'Address versioning gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map versioning_gaps to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'versioning_gaps',
  'machine_learning',
  'Address versioning gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map slow_development to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'slow_development',
  'machine_learning',
  'Address slow development with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map slow_development to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'slow_development',
  'machine_learning',
  'Address slow development with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map slow_development to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'slow_development',
  'machine_learning',
  'Address slow development with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map model_failures to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'model_failures',
  'machine_learning',
  'Address model failures with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map model_failures to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'model_failures',
  'machine_learning',
  'Address model failures with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map model_failures to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'model_failures',
  'machine_learning',
  'Address model failures with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map limited_collaboration to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'limited_collaboration',
  'machine_learning',
  'Address limited collaboration with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map limited_collaboration to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'limited_collaboration',
  'machine_learning',
  'Address limited collaboration with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map limited_collaboration to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'limited_collaboration',
  'machine_learning',
  'Address limited collaboration with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map quality_issues to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'quality_issues',
  'machine_learning',
  'Address quality issues with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map quality_issues to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'quality_issues',
  'machine_learning',
  'Address quality issues with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map quality_issues to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'quality_issues',
  'machine_learning',
  'Address quality issues with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map inconsistent_practices to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'inconsistent_practices',
  'machine_learning',
  'Address inconsistent practices with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map inconsistent_practices to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'inconsistent_practices',
  'machine_learning',
  'Address inconsistent practices with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map inconsistent_practices to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'inconsistent_practices',
  'machine_learning',
  'Address inconsistent practices with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map manual_processes to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'manual_processes',
  'machine_learning',
  'Address manual processes with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map manual_processes to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'manual_processes',
  'machine_learning',
  'Address manual processes with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map manual_processes to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'manual_processes',
  'machine_learning',
  'Address manual processes with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map pipeline_fragility to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'pipeline_fragility',
  'machine_learning',
  'Address pipeline fragility with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map pipeline_fragility to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'pipeline_fragility',
  'machine_learning',
  'Address pipeline fragility with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map pipeline_fragility to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'pipeline_fragility',
  'machine_learning',
  'Address pipeline fragility with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map quality_gaps to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'quality_gaps',
  'machine_learning',
  'Address quality gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map quality_gaps to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'quality_gaps',
  'machine_learning',
  'Address quality gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map quality_gaps to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'quality_gaps',
  'machine_learning',
  'Address quality gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map scalability_issues to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'scalability_issues',
  'machine_learning',
  'Address scalability issues with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map scalability_issues to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'scalability_issues',
  'machine_learning',
  'Address scalability issues with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map scalability_issues to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'scalability_issues',
  'machine_learning',
  'Address scalability issues with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_scientist_bottleneck to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_scientist_bottleneck',
  'machine_learning',
  'Address data scientist bottleneck with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_scientist_bottleneck to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_scientist_bottleneck',
  'machine_learning',
  'Address data scientist bottleneck with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_scientist_bottleneck to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_scientist_bottleneck',
  'machine_learning',
  'Address data scientist bottleneck with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map resource_waste to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'resource_waste',
  'machine_learning',
  'Address resource waste with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map resource_waste to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'resource_waste',
  'machine_learning',
  'Address resource waste with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map resource_waste to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'resource_waste',
  'machine_learning',
  'Address resource waste with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map limited_scalability to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'limited_scalability',
  'machine_learning',
  'Address limited scalability with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map limited_scalability to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'limited_scalability',
  'machine_learning',
  'Address limited scalability with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map limited_scalability to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'limited_scalability',
  'machine_learning',
  'Address limited scalability with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map unclear_ownership to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'unclear_ownership',
  'machine_learning',
  'Address unclear ownership with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map unclear_ownership to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'unclear_ownership',
  'machine_learning',
  'Address unclear ownership with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map unclear_ownership to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'unclear_ownership',
  'machine_learning',
  'Address unclear ownership with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_approval_gates to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_approval_gates',
  'machine_learning',
  'Address no approval gates with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_approval_gates to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_approval_gates',
  'machine_learning',
  'Address no approval gates with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_approval_gates to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_approval_gates',
  'machine_learning',
  'Address no approval gates with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map documentation_gaps to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'documentation_gaps',
  'machine_learning',
  'Address documentation gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map documentation_gaps to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'documentation_gaps',
  'machine_learning',
  'Address documentation gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map documentation_gaps to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'documentation_gaps',
  'machine_learning',
  'Address documentation gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map review_inconsistency to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'review_inconsistency',
  'machine_learning',
  'Address review inconsistency with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map review_inconsistency to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'review_inconsistency',
  'machine_learning',
  'Address review inconsistency with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map review_inconsistency to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'review_inconsistency',
  'machine_learning',
  'Address review inconsistency with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map change_tracking to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'change_tracking',
  'machine_learning',
  'Address change tracking with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map change_tracking to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'change_tracking',
  'machine_learning',
  'Address change tracking with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map change_tracking to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'change_tracking',
  'machine_learning',
  'Address change tracking with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map accountability_gaps to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'accountability_gaps',
  'machine_learning',
  'Address accountability gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map accountability_gaps to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'accountability_gaps',
  'machine_learning',
  'Address accountability gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map accountability_gaps to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'accountability_gaps',
  'machine_learning',
  'Address accountability gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map risk_exposure to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'risk_exposure',
  'machine_learning',
  'Address risk exposure with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map risk_exposure to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'risk_exposure',
  'machine_learning',
  'Address risk exposure with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map risk_exposure to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'risk_exposure',
  'machine_learning',
  'Address risk exposure with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map compliance_failures to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'compliance_failures',
  'machine_learning',
  'Address compliance failures with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map compliance_failures to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'compliance_failures',
  'machine_learning',
  'Address compliance failures with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map compliance_failures to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'compliance_failures',
  'machine_learning',
  'Address compliance failures with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map incident_response to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'incident_response',
  'machine_learning',
  'Address incident response with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map incident_response to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'incident_response',
  'machine_learning',
  'Address incident response with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map incident_response to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'incident_response',
  'machine_learning',
  'Address incident response with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_lineage to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_lineage',
  'machine_learning',
  'Address no lineage with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_lineage to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_lineage',
  'machine_learning',
  'Address no lineage with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_lineage to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_lineage',
  'machine_learning',
  'Address no lineage with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map audit_gaps to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'audit_gaps',
  'machine_learning',
  'Address audit gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map audit_gaps to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'audit_gaps',
  'machine_learning',
  'Address audit gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map audit_gaps to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'audit_gaps',
  'machine_learning',
  'Address audit gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map compliance_manual to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'compliance_manual',
  'machine_learning',
  'Address compliance manual with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map compliance_manual to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'compliance_manual',
  'machine_learning',
  'Address compliance manual with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map compliance_manual to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'compliance_manual',
  'machine_learning',
  'Address compliance manual with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map bias_detection to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'bias_detection',
  'machine_learning',
  'Address bias detection with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map bias_detection to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'bias_detection',
  'machine_learning',
  'Address bias detection with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map bias_detection to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'bias_detection',
  'machine_learning',
  'Address bias detection with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map explainability_gaps to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'explainability_gaps',
  'machine_learning',
  'Address explainability gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map explainability_gaps to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'explainability_gaps',
  'machine_learning',
  'Address explainability gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map explainability_gaps to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'explainability_gaps',
  'machine_learning',
  'Address explainability gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map regulatory_risk to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'regulatory_risk',
  'machine_learning',
  'Address regulatory risk with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map regulatory_risk to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'regulatory_risk',
  'machine_learning',
  'Address regulatory risk with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map regulatory_risk to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'regulatory_risk',
  'machine_learning',
  'Address regulatory risk with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map audit_failures to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'audit_failures',
  'machine_learning',
  'Address audit failures with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map audit_failures to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'audit_failures',
  'machine_learning',
  'Address audit failures with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map audit_failures to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'audit_failures',
  'machine_learning',
  'Address audit failures with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map bias_incidents to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'bias_incidents',
  'machine_learning',
  'Address bias incidents with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map bias_incidents to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'bias_incidents',
  'machine_learning',
  'Address bias incidents with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map bias_incidents to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'bias_incidents',
  'machine_learning',
  'Address bias incidents with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reputation_damage to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reputation_damage',
  'machine_learning',
  'Address reputation damage with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reputation_damage to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reputation_damage',
  'machine_learning',
  'Address reputation damage with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reputation_damage to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reputation_damage',
  'machine_learning',
  'Address reputation damage with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map legal_exposure to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'legal_exposure',
  'machine_learning',
  'Address legal exposure with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map legal_exposure to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'legal_exposure',
  'machine_learning',
  'Address legal exposure with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map legal_exposure to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'legal_exposure',
  'machine_learning',
  'Address legal exposure with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map pilot_to_prod_gap to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'pilot_to_prod_gap',
  'machine_learning',
  'Address pilot to prod gap with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map pilot_to_prod_gap to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'pilot_to_prod_gap',
  'machine_learning',
  'Address pilot to prod gap with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map pilot_to_prod_gap to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'pilot_to_prod_gap',
  'machine_learning',
  'Address pilot to prod gap with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map deployment_barriers to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'deployment_barriers',
  'machine_learning',
  'Address deployment barriers with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map deployment_barriers to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'deployment_barriers',
  'machine_learning',
  'Address deployment barriers with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map deployment_barriers to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'deployment_barriers',
  'machine_learning',
  'Address deployment barriers with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map infrastructure_gaps to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'infrastructure_gaps',
  'machine_learning',
  'Address infrastructure gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map infrastructure_gaps to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'infrastructure_gaps',
  'machine_learning',
  'Address infrastructure gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map infrastructure_gaps to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'infrastructure_gaps',
  'machine_learning',
  'Address infrastructure gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map integration_complexity to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'integration_complexity',
  'machine_learning',
  'Address integration complexity with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map integration_complexity to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'integration_complexity',
  'machine_learning',
  'Address integration complexity with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map integration_complexity to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'integration_complexity',
  'machine_learning',
  'Address integration complexity with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map performance_issues to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'performance_issues',
  'machine_learning',
  'Address performance issues with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map performance_issues to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'performance_issues',
  'machine_learning',
  'Address performance issues with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map performance_issues to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'performance_issues',
  'machine_learning',
  'Address performance issues with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map low_roi to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'low_roi',
  'machine_learning',
  'Address low roi with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map low_roi to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'low_roi',
  'machine_learning',
  'Address low roi with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map low_roi to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'low_roi',
  'machine_learning',
  'Address low roi with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map failed_pilots to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'failed_pilots',
  'machine_learning',
  'Address failed pilots with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map failed_pilots to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'failed_pilots',
  'machine_learning',
  'Address failed pilots with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map failed_pilots to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'failed_pilots',
  'machine_learning',
  'Address failed pilots with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map long_timelines to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'long_timelines',
  'machine_learning',
  'Address long timelines with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map long_timelines to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'long_timelines',
  'machine_learning',
  'Address long timelines with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map long_timelines to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'long_timelines',
  'machine_learning',
  'Address long timelines with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map value_realization to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'value_realization',
  'machine_learning',
  'Address value realization with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map value_realization to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'value_realization',
  'machine_learning',
  'Address value realization with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map value_realization to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'value_realization',
  'machine_learning',
  'Address value realization with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map stakeholder_frustration to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'stakeholder_frustration',
  'machine_learning',
  'Address stakeholder frustration with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map stakeholder_frustration to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'stakeholder_frustration',
  'machine_learning',
  'Address stakeholder frustration with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map stakeholder_frustration to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'stakeholder_frustration',
  'machine_learning',
  'Address stakeholder frustration with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map custom_solutions to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'custom_solutions',
  'machine_learning',
  'Address custom solutions with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map custom_solutions to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'custom_solutions',
  'machine_learning',
  'Address custom solutions with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map custom_solutions to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'custom_solutions',
  'machine_learning',
  'Address custom solutions with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map platform_gaps to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'platform_gaps',
  'machine_learning',
  'Address platform gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map platform_gaps to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'platform_gaps',
  'machine_learning',
  'Address platform gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map platform_gaps to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'platform_gaps',
  'machine_learning',
  'Address platform gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map resource_constraints to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'resource_constraints',
  'machine_learning',
  'Address resource constraints with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map resource_constraints to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'resource_constraints',
  'machine_learning',
  'Address resource constraints with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map resource_constraints to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'resource_constraints',
  'machine_learning',
  'Address resource constraints with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map knowledge_silos to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'knowledge_silos',
  'machine_learning',
  'Address knowledge silos with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map knowledge_silos to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'knowledge_silos',
  'machine_learning',
  'Address knowledge silos with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map knowledge_silos to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'knowledge_silos',
  'machine_learning',
  'Address knowledge silos with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map tooling_fragmentation to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'tooling_fragmentation',
  'machine_learning',
  'Address tooling fragmentation with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map tooling_fragmentation to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'tooling_fragmentation',
  'machine_learning',
  'Address tooling fragmentation with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map tooling_fragmentation to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'tooling_fragmentation',
  'machine_learning',
  'Address tooling fragmentation with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map limited_ml_adoption to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'limited_ml_adoption',
  'machine_learning',
  'Address limited ml adoption with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map limited_ml_adoption to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'limited_ml_adoption',
  'machine_learning',
  'Address limited ml adoption with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map limited_ml_adoption to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'limited_ml_adoption',
  'machine_learning',
  'Address limited ml adoption with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map long_onboarding to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'long_onboarding',
  'machine_learning',
  'Address long onboarding with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map long_onboarding to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'long_onboarding',
  'machine_learning',
  'Address long onboarding with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map long_onboarding to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'long_onboarding',
  'machine_learning',
  'Address long onboarding with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map team_bottleneck to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'team_bottleneck',
  'machine_learning',
  'Address team bottleneck with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map team_bottleneck to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'team_bottleneck',
  'machine_learning',
  'Address team bottleneck with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map team_bottleneck to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'team_bottleneck',
  'machine_learning',
  'Address team bottleneck with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map missed_opportunities to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'missed_opportunities',
  'machine_learning',
  'Address missed opportunities with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map missed_opportunities to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'missed_opportunities',
  'machine_learning',
  'Address missed opportunities with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map missed_opportunities to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'missed_opportunities',
  'machine_learning',
  'Address missed opportunities with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map competitive_lag to machine-learning features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'competitive_lag',
  'machine_learning',
  'Address competitive lag with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'machine-learning'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map competitive_lag to mlops features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'competitive_lag',
  'machine_learning',
  'Address competitive lag with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'mlops'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map competitive_lag to feature-engineering features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'competitive_lag',
  'machine_learning',
  'Address competitive lag with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'feature-engineering'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;


-- GENERATIVE_AI (97 pain points)
-- ============================================================================

-- Map no_strategy to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_strategy',
  'generative_ai',
  'Address no strategy with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_strategy to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_strategy',
  'generative_ai',
  'Address no strategy with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_strategy to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_strategy',
  'generative_ai',
  'Address no strategy with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map disconnected_efforts to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'disconnected_efforts',
  'generative_ai',
  'Address disconnected efforts with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map disconnected_efforts to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'disconnected_efforts',
  'generative_ai',
  'Address disconnected efforts with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map disconnected_efforts to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'disconnected_efforts',
  'generative_ai',
  'Address disconnected efforts with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map unclear_use_cases to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'unclear_use_cases',
  'generative_ai',
  'Address unclear use cases with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map unclear_use_cases to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'unclear_use_cases',
  'generative_ai',
  'Address unclear use cases with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map unclear_use_cases to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'unclear_use_cases',
  'generative_ai',
  'Address unclear use cases with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map technology_uncertainty to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'technology_uncertainty',
  'generative_ai',
  'Address technology uncertainty with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map technology_uncertainty to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'technology_uncertainty',
  'generative_ai',
  'Address technology uncertainty with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map technology_uncertainty to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'technology_uncertainty',
  'generative_ai',
  'Address technology uncertainty with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map skills_gaps to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'skills_gaps',
  'generative_ai',
  'Address skills gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map skills_gaps to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'skills_gaps',
  'generative_ai',
  'Address skills gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map skills_gaps to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'skills_gaps',
  'generative_ai',
  'Address skills gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map competitive_pressure to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'competitive_pressure',
  'generative_ai',
  'Address competitive pressure with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map competitive_pressure to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'competitive_pressure',
  'generative_ai',
  'Address competitive pressure with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map competitive_pressure to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'competitive_pressure',
  'generative_ai',
  'Address competitive pressure with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map unclear_roi to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'unclear_roi',
  'generative_ai',
  'Address unclear roi with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map unclear_roi to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'unclear_roi',
  'generative_ai',
  'Address unclear roi with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map unclear_roi to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'unclear_roi',
  'generative_ai',
  'Address unclear roi with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map missed_opportunities to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'missed_opportunities',
  'generative_ai',
  'Address missed opportunities with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map missed_opportunities to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'missed_opportunities',
  'generative_ai',
  'Address missed opportunities with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map missed_opportunities to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'missed_opportunities',
  'generative_ai',
  'Address missed opportunities with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map budget_uncertainty to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'budget_uncertainty',
  'generative_ai',
  'Address budget uncertainty with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map budget_uncertainty to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'budget_uncertainty',
  'generative_ai',
  'Address budget uncertainty with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map budget_uncertainty to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'budget_uncertainty',
  'generative_ai',
  'Address budget uncertainty with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map stakeholder_expectations to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'stakeholder_expectations',
  'generative_ai',
  'Address stakeholder expectations with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map stakeholder_expectations to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'stakeholder_expectations',
  'generative_ai',
  'Address stakeholder expectations with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map stakeholder_expectations to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'stakeholder_expectations',
  'generative_ai',
  'Address stakeholder expectations with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map vague_requirements to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'vague_requirements',
  'generative_ai',
  'Address vague requirements with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map vague_requirements to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'vague_requirements',
  'generative_ai',
  'Address vague requirements with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map vague_requirements to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'vague_requirements',
  'generative_ai',
  'Address vague requirements with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map unrealistic_expectations to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'unrealistic_expectations',
  'generative_ai',
  'Address unrealistic expectations with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map unrealistic_expectations to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'unrealistic_expectations',
  'generative_ai',
  'Address unrealistic expectations with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map unrealistic_expectations to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'unrealistic_expectations',
  'generative_ai',
  'Address unrealistic expectations with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_readiness to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_readiness',
  'generative_ai',
  'Address data readiness with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_readiness to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_readiness',
  'generative_ai',
  'Address data readiness with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_readiness to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_readiness',
  'generative_ai',
  'Address data readiness with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map poc_challenges to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'poc_challenges',
  'generative_ai',
  'Address poc challenges with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map poc_challenges to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'poc_challenges',
  'generative_ai',
  'Address poc challenges with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map poc_challenges to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'poc_challenges',
  'generative_ai',
  'Address poc challenges with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map evaluation_gaps to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'evaluation_gaps',
  'generative_ai',
  'Address evaluation gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map evaluation_gaps to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'evaluation_gaps',
  'generative_ai',
  'Address evaluation gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map evaluation_gaps to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'evaluation_gaps',
  'generative_ai',
  'Address evaluation gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map scattered_efforts to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'scattered_efforts',
  'generative_ai',
  'Address scattered efforts with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map scattered_efforts to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'scattered_efforts',
  'generative_ai',
  'Address scattered efforts with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map scattered_efforts to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'scattered_efforts',
  'generative_ai',
  'Address scattered efforts with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map value_uncertainty to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'value_uncertainty',
  'generative_ai',
  'Address value uncertainty with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map value_uncertainty to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'value_uncertainty',
  'generative_ai',
  'Address value uncertainty with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map value_uncertainty to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'value_uncertainty',
  'generative_ai',
  'Address value uncertainty with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map prioritization_challenges to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'prioritization_challenges',
  'generative_ai',
  'Address prioritization challenges with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map prioritization_challenges to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'prioritization_challenges',
  'generative_ai',
  'Address prioritization challenges with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map prioritization_challenges to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'prioritization_challenges',
  'generative_ai',
  'Address prioritization challenges with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map resource_waste to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'resource_waste',
  'generative_ai',
  'Address resource waste with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map resource_waste to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'resource_waste',
  'generative_ai',
  'Address resource waste with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map resource_waste to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'resource_waste',
  'generative_ai',
  'Address resource waste with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map stakeholder_confusion to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'stakeholder_confusion',
  'generative_ai',
  'Address stakeholder confusion with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map stakeholder_confusion to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'stakeholder_confusion',
  'generative_ai',
  'Address stakeholder confusion with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map stakeholder_confusion to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'stakeholder_confusion',
  'generative_ai',
  'Address stakeholder confusion with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map unstructured_data to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'unstructured_data',
  'generative_ai',
  'Address unstructured data with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map unstructured_data to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'unstructured_data',
  'generative_ai',
  'Address unstructured data with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map unstructured_data to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'unstructured_data',
  'generative_ai',
  'Address unstructured data with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_vector_search to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_vector_search',
  'generative_ai',
  'Address no vector search with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_vector_search to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_vector_search',
  'generative_ai',
  'Address no vector search with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_vector_search to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_vector_search',
  'generative_ai',
  'Address no vector search with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_quality to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_quality',
  'generative_ai',
  'Address data quality with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_quality to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_quality',
  'generative_ai',
  'Address data quality with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_quality to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_quality',
  'generative_ai',
  'Address data quality with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map chunking_challenges to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'chunking_challenges',
  'generative_ai',
  'Address chunking challenges with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map chunking_challenges to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'chunking_challenges',
  'generative_ai',
  'Address chunking challenges with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map chunking_challenges to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'chunking_challenges',
  'generative_ai',
  'Address chunking challenges with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map integration_gaps to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'integration_gaps',
  'generative_ai',
  'Address integration gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map integration_gaps to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'integration_gaps',
  'generative_ai',
  'Address integration gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map integration_gaps to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'integration_gaps',
  'generative_ai',
  'Address integration gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map limited_context to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'limited_context',
  'generative_ai',
  'Address limited context with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map limited_context to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'limited_context',
  'generative_ai',
  'Address limited context with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map limited_context to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'limited_context',
  'generative_ai',
  'Address limited context with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map hallucinations to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'hallucinations',
  'generative_ai',
  'Address hallucinations with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map hallucinations to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'hallucinations',
  'generative_ai',
  'Address hallucinations with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map hallucinations to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'hallucinations',
  'generative_ai',
  'Address hallucinations with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map poor_relevance to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'poor_relevance',
  'generative_ai',
  'Address poor relevance with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map poor_relevance to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'poor_relevance',
  'generative_ai',
  'Address poor relevance with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map poor_relevance to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'poor_relevance',
  'generative_ai',
  'Address poor relevance with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_prep_delays to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_prep_delays',
  'generative_ai',
  'Address data prep delays with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_prep_delays to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_prep_delays',
  'generative_ai',
  'Address data prep delays with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_prep_delays to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_prep_delays',
  'generative_ai',
  'Address data prep delays with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map business_impact to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'business_impact',
  'generative_ai',
  'Address business impact with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map business_impact to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'business_impact',
  'generative_ai',
  'Address business impact with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map business_impact to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'business_impact',
  'generative_ai',
  'Address business impact with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map ungoverned_sources to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'ungoverned_sources',
  'generative_ai',
  'Address ungoverned sources with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map ungoverned_sources to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'ungoverned_sources',
  'generative_ai',
  'Address ungoverned sources with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map ungoverned_sources to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'ungoverned_sources',
  'generative_ai',
  'Address ungoverned sources with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map version_control to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'version_control',
  'generative_ai',
  'Address version control with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map version_control to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'version_control',
  'generative_ai',
  'Address version control with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map version_control to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'version_control',
  'generative_ai',
  'Address version control with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map quality_checks to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'quality_checks',
  'generative_ai',
  'Address quality checks with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map quality_checks to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'quality_checks',
  'generative_ai',
  'Address quality checks with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map quality_checks to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'quality_checks',
  'generative_ai',
  'Address quality checks with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map access_control to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'access_control',
  'generative_ai',
  'Address access control with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map access_control to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'access_control',
  'generative_ai',
  'Address access control with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map access_control to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'access_control',
  'generative_ai',
  'Address access control with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map lineage_gaps to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'lineage_gaps',
  'generative_ai',
  'Address lineage gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map lineage_gaps to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'lineage_gaps',
  'generative_ai',
  'Address lineage gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map lineage_gaps to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'lineage_gaps',
  'generative_ai',
  'Address lineage gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map output_quality to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'output_quality',
  'generative_ai',
  'Address output quality with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map output_quality to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'output_quality',
  'generative_ai',
  'Address output quality with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map output_quality to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'output_quality',
  'generative_ai',
  'Address output quality with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map trust_issues to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'trust_issues',
  'generative_ai',
  'Address trust issues with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map trust_issues to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'trust_issues',
  'generative_ai',
  'Address trust issues with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map trust_issues to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'trust_issues',
  'generative_ai',
  'Address trust issues with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map compliance_risk to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'compliance_risk',
  'generative_ai',
  'Address compliance risk with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map compliance_risk to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'compliance_risk',
  'generative_ai',
  'Address compliance risk with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map compliance_risk to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'compliance_risk',
  'generative_ai',
  'Address compliance risk with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map misinformation to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'misinformation',
  'generative_ai',
  'Address misinformation with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map misinformation to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'misinformation',
  'generative_ai',
  'Address misinformation with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map misinformation to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'misinformation',
  'generative_ai',
  'Address misinformation with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reputation_risk to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reputation_risk',
  'generative_ai',
  'Address reputation risk with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reputation_risk to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reputation_risk',
  'generative_ai',
  'Address reputation risk with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reputation_risk to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reputation_risk',
  'generative_ai',
  'Address reputation risk with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_infrastructure to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_infrastructure',
  'generative_ai',
  'Address no infrastructure with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_infrastructure to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_infrastructure',
  'generative_ai',
  'Address no infrastructure with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_infrastructure to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_infrastructure',
  'generative_ai',
  'Address no infrastructure with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map api_limitations to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'api_limitations',
  'generative_ai',
  'Address api limitations with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map api_limitations to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'api_limitations',
  'generative_ai',
  'Address api limitations with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map api_limitations to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'api_limitations',
  'generative_ai',
  'Address api limitations with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map scalability_issues to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'scalability_issues',
  'generative_ai',
  'Address scalability issues with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map scalability_issues to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'scalability_issues',
  'generative_ai',
  'Address scalability issues with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map scalability_issues to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'scalability_issues',
  'generative_ai',
  'Address scalability issues with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map cost_concerns to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'cost_concerns',
  'generative_ai',
  'Address cost concerns with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map cost_concerns to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'cost_concerns',
  'generative_ai',
  'Address cost concerns with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map cost_concerns to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'cost_concerns',
  'generative_ai',
  'Address cost concerns with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map integration_complexity to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'integration_complexity',
  'generative_ai',
  'Address integration complexity with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map integration_complexity to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'integration_complexity',
  'generative_ai',
  'Address integration complexity with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map integration_complexity to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'integration_complexity',
  'generative_ai',
  'Address integration complexity with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map slow_development to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'slow_development',
  'generative_ai',
  'Address slow development with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map slow_development to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'slow_development',
  'generative_ai',
  'Address slow development with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map slow_development to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'slow_development',
  'generative_ai',
  'Address slow development with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map user_experience to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'user_experience',
  'generative_ai',
  'Address user experience with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map user_experience to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'user_experience',
  'generative_ai',
  'Address user experience with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map user_experience to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'user_experience',
  'generative_ai',
  'Address user experience with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reliability_issues to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reliability_issues',
  'generative_ai',
  'Address reliability issues with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reliability_issues to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reliability_issues',
  'generative_ai',
  'Address reliability issues with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reliability_issues to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reliability_issues',
  'generative_ai',
  'Address reliability issues with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map cost_overruns to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'cost_overruns',
  'generative_ai',
  'Address cost overruns with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map cost_overruns to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'cost_overruns',
  'generative_ai',
  'Address cost overruns with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map cost_overruns to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'cost_overruns',
  'generative_ai',
  'Address cost overruns with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map competitive_lag to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'competitive_lag',
  'generative_ai',
  'Address competitive lag with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map competitive_lag to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'competitive_lag',
  'generative_ai',
  'Address competitive lag with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map competitive_lag to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'competitive_lag',
  'generative_ai',
  'Address competitive lag with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_standards to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_standards',
  'generative_ai',
  'Address no standards with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_standards to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_standards',
  'generative_ai',
  'Address no standards with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_standards to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_standards',
  'generative_ai',
  'Address no standards with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map custom_solutions to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'custom_solutions',
  'generative_ai',
  'Address custom solutions with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map custom_solutions to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'custom_solutions',
  'generative_ai',
  'Address custom solutions with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map custom_solutions to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'custom_solutions',
  'generative_ai',
  'Address custom solutions with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map security_gaps to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'security_gaps',
  'generative_ai',
  'Address security gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map security_gaps to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'security_gaps',
  'generative_ai',
  'Address security gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map security_gaps to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'security_gaps',
  'generative_ai',
  'Address security gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map error_handling to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'error_handling',
  'generative_ai',
  'Address error handling with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map error_handling to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'error_handling',
  'generative_ai',
  'Address error handling with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map error_handling to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'error_handling',
  'generative_ai',
  'Address error handling with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map monitoring_gaps to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'monitoring_gaps',
  'generative_ai',
  'Address monitoring gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map monitoring_gaps to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'monitoring_gaps',
  'generative_ai',
  'Address monitoring gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map monitoring_gaps to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'monitoring_gaps',
  'generative_ai',
  'Address monitoring gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map slow_integration to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'slow_integration',
  'generative_ai',
  'Address slow integration with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map slow_integration to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'slow_integration',
  'generative_ai',
  'Address slow integration with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map slow_integration to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'slow_integration',
  'generative_ai',
  'Address slow integration with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map maintenance_burden to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'maintenance_burden',
  'generative_ai',
  'Address maintenance burden with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map maintenance_burden to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'maintenance_burden',
  'generative_ai',
  'Address maintenance burden with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map maintenance_burden to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'maintenance_burden',
  'generative_ai',
  'Address maintenance burden with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map inconsistent_ux to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'inconsistent_ux',
  'generative_ai',
  'Address inconsistent ux with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map inconsistent_ux to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'inconsistent_ux',
  'generative_ai',
  'Address inconsistent ux with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map inconsistent_ux to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'inconsistent_ux',
  'generative_ai',
  'Address inconsistent ux with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map scaling_challenges to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'scaling_challenges',
  'generative_ai',
  'Address scaling challenges with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map scaling_challenges to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'scaling_challenges',
  'generative_ai',
  'Address scaling challenges with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map scaling_challenges to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'scaling_challenges',
  'generative_ai',
  'Address scaling challenges with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map security_incidents to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'security_incidents',
  'generative_ai',
  'Address security incidents with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map security_incidents to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'security_incidents',
  'generative_ai',
  'Address security incidents with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map security_incidents to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'security_incidents',
  'generative_ai',
  'Address security incidents with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_validation to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_validation',
  'generative_ai',
  'Address no validation with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_validation to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_validation',
  'generative_ai',
  'Address no validation with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_validation to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_validation',
  'generative_ai',
  'Address no validation with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map manual_review to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'manual_review',
  'generative_ai',
  'Address manual review with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map manual_review to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'manual_review',
  'generative_ai',
  'Address manual review with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map manual_review to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'manual_review',
  'generative_ai',
  'Address manual review with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map hallucination_detection to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'hallucination_detection',
  'generative_ai',
  'Address hallucination detection with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map hallucination_detection to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'hallucination_detection',
  'generative_ai',
  'Address hallucination detection with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map hallucination_detection to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'hallucination_detection',
  'generative_ai',
  'Address hallucination detection with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map quality_metrics to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'quality_metrics',
  'generative_ai',
  'Address quality metrics with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map quality_metrics to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'quality_metrics',
  'generative_ai',
  'Address quality metrics with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map quality_metrics to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'quality_metrics',
  'generative_ai',
  'Address quality metrics with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map testing_gaps to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'testing_gaps',
  'generative_ai',
  'Address testing gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map testing_gaps to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'testing_gaps',
  'generative_ai',
  'Address testing gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map testing_gaps to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'testing_gaps',
  'generative_ai',
  'Address testing gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map user_trust to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'user_trust',
  'generative_ai',
  'Address user trust with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map user_trust to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'user_trust',
  'generative_ai',
  'Address user trust with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map user_trust to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'user_trust',
  'generative_ai',
  'Address user trust with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map business_risk to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'business_risk',
  'generative_ai',
  'Address business risk with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map business_risk to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'business_risk',
  'generative_ai',
  'Address business risk with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map business_risk to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'business_risk',
  'generative_ai',
  'Address business risk with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map manual_overhead to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'manual_overhead',
  'generative_ai',
  'Address manual overhead with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map manual_overhead to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'manual_overhead',
  'generative_ai',
  'Address manual overhead with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map manual_overhead to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'manual_overhead',
  'generative_ai',
  'Address manual overhead with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reputation_damage to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reputation_damage',
  'generative_ai',
  'Address reputation damage with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reputation_damage to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reputation_damage',
  'generative_ai',
  'Address reputation damage with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reputation_damage to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reputation_damage',
  'generative_ai',
  'Address reputation damage with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_monitoring to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_monitoring',
  'generative_ai',
  'Address no monitoring with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_monitoring to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_monitoring',
  'generative_ai',
  'Address no monitoring with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_monitoring to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_monitoring',
  'generative_ai',
  'Address no monitoring with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map drift_detection to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'drift_detection',
  'generative_ai',
  'Address drift detection with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map drift_detection to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'drift_detection',
  'generative_ai',
  'Address drift detection with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map drift_detection to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'drift_detection',
  'generative_ai',
  'Address drift detection with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map content_safety to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'content_safety',
  'generative_ai',
  'Address content safety with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map content_safety to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'content_safety',
  'generative_ai',
  'Address content safety with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map content_safety to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'content_safety',
  'generative_ai',
  'Address content safety with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map user_feedback to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'user_feedback',
  'generative_ai',
  'Address user feedback with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map user_feedback to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'user_feedback',
  'generative_ai',
  'Address user feedback with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map user_feedback to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'user_feedback',
  'generative_ai',
  'Address user feedback with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map alert_gaps to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'alert_gaps',
  'generative_ai',
  'Address alert gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map alert_gaps to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'alert_gaps',
  'generative_ai',
  'Address alert gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map alert_gaps to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'alert_gaps',
  'generative_ai',
  'Address alert gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map silent_degradation to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'silent_degradation',
  'generative_ai',
  'Address silent degradation with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map silent_degradation to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'silent_degradation',
  'generative_ai',
  'Address silent degradation with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map silent_degradation to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'silent_degradation',
  'generative_ai',
  'Address silent degradation with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map safety_incidents to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'safety_incidents',
  'generative_ai',
  'Address safety incidents with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map safety_incidents to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'safety_incidents',
  'generative_ai',
  'Address safety incidents with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map safety_incidents to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'safety_incidents',
  'generative_ai',
  'Address safety incidents with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map user_complaints to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'user_complaints',
  'generative_ai',
  'Address user complaints with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map user_complaints to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'user_complaints',
  'generative_ai',
  'Address user complaints with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map user_complaints to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'user_complaints',
  'generative_ai',
  'Address user complaints with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map brand_risk to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'brand_risk',
  'generative_ai',
  'Address brand risk with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map brand_risk to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'brand_risk',
  'generative_ai',
  'Address brand risk with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map brand_risk to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'brand_risk',
  'generative_ai',
  'Address brand risk with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reactive_approach to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reactive_approach',
  'generative_ai',
  'Address reactive approach with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reactive_approach to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reactive_approach',
  'generative_ai',
  'Address reactive approach with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reactive_approach to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reactive_approach',
  'generative_ai',
  'Address reactive approach with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_guardrails to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_guardrails',
  'generative_ai',
  'Address no guardrails with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_guardrails to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_guardrails',
  'generative_ai',
  'Address no guardrails with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_guardrails to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_guardrails',
  'generative_ai',
  'Address no guardrails with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map pii_detection to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'pii_detection',
  'generative_ai',
  'Address pii detection with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map pii_detection to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'pii_detection',
  'generative_ai',
  'Address pii detection with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map pii_detection to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'pii_detection',
  'generative_ai',
  'Address pii detection with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map content_filtering to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'content_filtering',
  'generative_ai',
  'Address content filtering with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map content_filtering to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'content_filtering',
  'generative_ai',
  'Address content filtering with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map content_filtering to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'content_filtering',
  'generative_ai',
  'Address content filtering with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map bias_detection to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'bias_detection',
  'generative_ai',
  'Address bias detection with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map bias_detection to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'bias_detection',
  'generative_ai',
  'Address bias detection with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map bias_detection to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'bias_detection',
  'generative_ai',
  'Address bias detection with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map policy_enforcement to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'policy_enforcement',
  'generative_ai',
  'Address policy enforcement with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map policy_enforcement to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'policy_enforcement',
  'generative_ai',
  'Address policy enforcement with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map policy_enforcement to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'policy_enforcement',
  'generative_ai',
  'Address policy enforcement with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_breaches to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_breaches',
  'generative_ai',
  'Address data breaches with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_breaches to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_breaches',
  'generative_ai',
  'Address data breaches with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_breaches to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_breaches',
  'generative_ai',
  'Address data breaches with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map ethical_concerns to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'ethical_concerns',
  'generative_ai',
  'Address ethical concerns with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map ethical_concerns to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'ethical_concerns',
  'generative_ai',
  'Address ethical concerns with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map ethical_concerns to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'ethical_concerns',
  'generative_ai',
  'Address ethical concerns with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map legal_exposure to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'legal_exposure',
  'generative_ai',
  'Address legal exposure with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map legal_exposure to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'legal_exposure',
  'generative_ai',
  'Address legal exposure with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map legal_exposure to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'legal_exposure',
  'generative_ai',
  'Address legal exposure with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map adoption_barriers to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'adoption_barriers',
  'generative_ai',
  'Address adoption barriers with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map adoption_barriers to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'adoption_barriers',
  'generative_ai',
  'Address adoption barriers with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map adoption_barriers to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'adoption_barriers',
  'generative_ai',
  'Address adoption barriers with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_logging to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_logging',
  'generative_ai',
  'Address no logging with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_logging to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_logging',
  'generative_ai',
  'Address no logging with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_logging to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_logging',
  'generative_ai',
  'Address no logging with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map audit_trails to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'audit_trails',
  'generative_ai',
  'Address audit trails with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map audit_trails to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'audit_trails',
  'generative_ai',
  'Address audit trails with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map audit_trails to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'audit_trails',
  'generative_ai',
  'Address audit trails with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map explainability to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'explainability',
  'generative_ai',
  'Address explainability with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map explainability to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'explainability',
  'generative_ai',
  'Address explainability with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map explainability to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'explainability',
  'generative_ai',
  'Address explainability with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map user_attribution to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'user_attribution',
  'generative_ai',
  'Address user attribution with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map user_attribution to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'user_attribution',
  'generative_ai',
  'Address user attribution with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map user_attribution to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'user_attribution',
  'generative_ai',
  'Address user attribution with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map accountability_gaps to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'accountability_gaps',
  'generative_ai',
  'Address accountability gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map accountability_gaps to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'accountability_gaps',
  'generative_ai',
  'Address accountability gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map accountability_gaps to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'accountability_gaps',
  'generative_ai',
  'Address accountability gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map audit_failures to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'audit_failures',
  'generative_ai',
  'Address audit failures with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map audit_failures to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'audit_failures',
  'generative_ai',
  'Address audit failures with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map audit_failures to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'audit_failures',
  'generative_ai',
  'Address audit failures with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map debugging_difficulty to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'debugging_difficulty',
  'generative_ai',
  'Address debugging difficulty with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map debugging_difficulty to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'debugging_difficulty',
  'generative_ai',
  'Address debugging difficulty with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map debugging_difficulty to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'debugging_difficulty',
  'generative_ai',
  'Address debugging difficulty with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map trust_deficit to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'trust_deficit',
  'generative_ai',
  'Address trust deficit with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map trust_deficit to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'trust_deficit',
  'generative_ai',
  'Address trust deficit with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map trust_deficit to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'trust_deficit',
  'generative_ai',
  'Address trust deficit with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map regulatory_risk to generative-ai features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'regulatory_risk',
  'generative_ai',
  'Address regulatory risk with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'generative-ai'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map regulatory_risk to llm features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'regulatory_risk',
  'generative_ai',
  'Address regulatory risk with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'llm'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map regulatory_risk to vector-search features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'regulatory_risk',
  'generative_ai',
  'Address regulatory risk with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'vector-search'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;


-- OPERATIONAL_EXCELLENCE (90 pain points)
-- ============================================================================

-- Map no_coe to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_coe',
  'operational_excellence',
  'Address no coe with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_coe to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_coe',
  'operational_excellence',
  'Address no coe with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_coe to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_coe',
  'operational_excellence',
  'Address no coe with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map unclear_charter to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'unclear_charter',
  'operational_excellence',
  'Address unclear charter with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map unclear_charter to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'unclear_charter',
  'operational_excellence',
  'Address unclear charter with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map unclear_charter to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'unclear_charter',
  'operational_excellence',
  'Address unclear charter with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map resource_constraints to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'resource_constraints',
  'operational_excellence',
  'Address resource constraints with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map resource_constraints to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'resource_constraints',
  'operational_excellence',
  'Address resource constraints with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map resource_constraints to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'resource_constraints',
  'operational_excellence',
  'Address resource constraints with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map standards_gaps to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'standards_gaps',
  'operational_excellence',
  'Address standards gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map standards_gaps to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'standards_gaps',
  'operational_excellence',
  'Address standards gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map standards_gaps to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'standards_gaps',
  'operational_excellence',
  'Address standards gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map adoption_challenges to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'adoption_challenges',
  'operational_excellence',
  'Address adoption challenges with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map adoption_challenges to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'adoption_challenges',
  'operational_excellence',
  'Address adoption challenges with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map adoption_challenges to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'adoption_challenges',
  'operational_excellence',
  'Address adoption challenges with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map inconsistent_practices to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'inconsistent_practices',
  'operational_excellence',
  'Address inconsistent practices with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map inconsistent_practices to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'inconsistent_practices',
  'operational_excellence',
  'Address inconsistent practices with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map inconsistent_practices to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'inconsistent_practices',
  'operational_excellence',
  'Address inconsistent practices with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map knowledge_silos to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'knowledge_silos',
  'operational_excellence',
  'Address knowledge silos with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map knowledge_silos to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'knowledge_silos',
  'operational_excellence',
  'Address knowledge silos with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map knowledge_silos to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'knowledge_silos',
  'operational_excellence',
  'Address knowledge silos with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map slow_adoption to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'slow_adoption',
  'operational_excellence',
  'Address slow adoption with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map slow_adoption to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'slow_adoption',
  'operational_excellence',
  'Address slow adoption with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map slow_adoption to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'slow_adoption',
  'operational_excellence',
  'Address slow adoption with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map quality_issues to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'quality_issues',
  'operational_excellence',
  'Address quality issues with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map quality_issues to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'quality_issues',
  'operational_excellence',
  'Address quality issues with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map quality_issues to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'quality_issues',
  'operational_excellence',
  'Address quality issues with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map innovation_barriers to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'innovation_barriers',
  'operational_excellence',
  'Address innovation barriers with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map innovation_barriers to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'innovation_barriers',
  'operational_excellence',
  'Address innovation barriers with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map innovation_barriers to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'innovation_barriers',
  'operational_excellence',
  'Address innovation barriers with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map low_influence to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'low_influence',
  'operational_excellence',
  'Address low influence with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map low_influence to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'low_influence',
  'operational_excellence',
  'Address low influence with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map low_influence to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'low_influence',
  'operational_excellence',
  'Address low influence with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map communication_gaps to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'communication_gaps',
  'operational_excellence',
  'Address communication gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map communication_gaps to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'communication_gaps',
  'operational_excellence',
  'Address communication gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map communication_gaps to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'communication_gaps',
  'operational_excellence',
  'Address communication gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map tooling_gaps to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'tooling_gaps',
  'operational_excellence',
  'Address tooling gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map tooling_gaps to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'tooling_gaps',
  'operational_excellence',
  'Address tooling gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map tooling_gaps to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'tooling_gaps',
  'operational_excellence',
  'Address tooling gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map feedback_loops to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'feedback_loops',
  'operational_excellence',
  'Address feedback loops with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map feedback_loops to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'feedback_loops',
  'operational_excellence',
  'Address feedback loops with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map feedback_loops to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'feedback_loops',
  'operational_excellence',
  'Address feedback loops with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map measurement_gaps to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'measurement_gaps',
  'operational_excellence',
  'Address measurement gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map measurement_gaps to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'measurement_gaps',
  'operational_excellence',
  'Address measurement gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map measurement_gaps to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'measurement_gaps',
  'operational_excellence',
  'Address measurement gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map governance_gaps to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'governance_gaps',
  'operational_excellence',
  'Address governance gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map governance_gaps to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'governance_gaps',
  'operational_excellence',
  'Address governance gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map governance_gaps to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'governance_gaps',
  'operational_excellence',
  'Address governance gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map architecture_debt to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'architecture_debt',
  'operational_excellence',
  'Address architecture debt with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map architecture_debt to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'architecture_debt',
  'operational_excellence',
  'Address architecture debt with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map architecture_debt to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'architecture_debt',
  'operational_excellence',
  'Address architecture debt with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map team_confusion to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'team_confusion',
  'operational_excellence',
  'Address team confusion with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map team_confusion to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'team_confusion',
  'operational_excellence',
  'Address team confusion with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map team_confusion to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'team_confusion',
  'operational_excellence',
  'Address team confusion with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map onboarding_delays to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'onboarding_delays',
  'operational_excellence',
  'Address onboarding delays with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map onboarding_delays to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'onboarding_delays',
  'operational_excellence',
  'Address onboarding delays with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map onboarding_delays to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'onboarding_delays',
  'operational_excellence',
  'Address onboarding delays with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map roi_unclear to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'roi_unclear',
  'operational_excellence',
  'Address roi unclear with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map roi_unclear to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'roi_unclear',
  'operational_excellence',
  'Address roi unclear with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map roi_unclear to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'roi_unclear',
  'operational_excellence',
  'Address roi unclear with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map siloed_teams to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'siloed_teams',
  'operational_excellence',
  'Address siloed teams with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map siloed_teams to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'siloed_teams',
  'operational_excellence',
  'Address siloed teams with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map siloed_teams to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'siloed_teams',
  'operational_excellence',
  'Address siloed teams with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_sharing_platform to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_sharing_platform',
  'operational_excellence',
  'Address no sharing platform with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_sharing_platform to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_sharing_platform',
  'operational_excellence',
  'Address no sharing platform with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_sharing_platform to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_sharing_platform',
  'operational_excellence',
  'Address no sharing platform with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map documentation_gaps to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'documentation_gaps',
  'operational_excellence',
  'Address documentation gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map documentation_gaps to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'documentation_gaps',
  'operational_excellence',
  'Address documentation gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map documentation_gaps to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'documentation_gaps',
  'operational_excellence',
  'Address documentation gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map code_reuse to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'code_reuse',
  'operational_excellence',
  'Address code reuse with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map code_reuse to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'code_reuse',
  'operational_excellence',
  'Address code reuse with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map code_reuse to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'code_reuse',
  'operational_excellence',
  'Address code reuse with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map learning_barriers to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'learning_barriers',
  'operational_excellence',
  'Address learning barriers with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map learning_barriers to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'learning_barriers',
  'operational_excellence',
  'Address learning barriers with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map learning_barriers to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'learning_barriers',
  'operational_excellence',
  'Address learning barriers with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map duplicate_work to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'duplicate_work',
  'operational_excellence',
  'Address duplicate work with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map duplicate_work to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'duplicate_work',
  'operational_excellence',
  'Address duplicate work with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map duplicate_work to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'duplicate_work',
  'operational_excellence',
  'Address duplicate work with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map slow_problem_solving to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'slow_problem_solving',
  'operational_excellence',
  'Address slow problem solving with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map slow_problem_solving to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'slow_problem_solving',
  'operational_excellence',
  'Address slow problem solving with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map slow_problem_solving to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'slow_problem_solving',
  'operational_excellence',
  'Address slow problem solving with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map innovation_lag to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'innovation_lag',
  'operational_excellence',
  'Address innovation lag with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map innovation_lag to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'innovation_lag',
  'operational_excellence',
  'Address innovation lag with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map innovation_lag to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'innovation_lag',
  'operational_excellence',
  'Address innovation lag with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map onboarding_friction to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'onboarding_friction',
  'operational_excellence',
  'Address onboarding friction with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map onboarding_friction to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'onboarding_friction',
  'operational_excellence',
  'Address onboarding friction with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map onboarding_friction to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'onboarding_friction',
  'operational_excellence',
  'Address onboarding friction with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map knowledge_loss to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'knowledge_loss',
  'operational_excellence',
  'Address knowledge loss with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map knowledge_loss to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'knowledge_loss',
  'operational_excellence',
  'Address knowledge loss with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map knowledge_loss to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'knowledge_loss',
  'operational_excellence',
  'Address knowledge loss with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_asset_catalog to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_asset_catalog',
  'operational_excellence',
  'Address no asset catalog with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_asset_catalog to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_asset_catalog',
  'operational_excellence',
  'Address no asset catalog with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_asset_catalog to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_asset_catalog',
  'operational_excellence',
  'Address no asset catalog with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map discovery_difficulty to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'discovery_difficulty',
  'operational_excellence',
  'Address discovery difficulty with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map discovery_difficulty to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'discovery_difficulty',
  'operational_excellence',
  'Address discovery difficulty with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map discovery_difficulty to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'discovery_difficulty',
  'operational_excellence',
  'Address discovery difficulty with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map version_control to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'version_control',
  'operational_excellence',
  'Address version control with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map version_control to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'version_control',
  'operational_excellence',
  'Address version control with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map version_control to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'version_control',
  'operational_excellence',
  'Address version control with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map quality_standards to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'quality_standards',
  'operational_excellence',
  'Address quality standards with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map quality_standards to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'quality_standards',
  'operational_excellence',
  'Address quality standards with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map quality_standards to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'quality_standards',
  'operational_excellence',
  'Address quality standards with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map low_reuse to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'low_reuse',
  'operational_excellence',
  'Address low reuse with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map low_reuse to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'low_reuse',
  'operational_excellence',
  'Address low reuse with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map low_reuse to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'low_reuse',
  'operational_excellence',
  'Address low reuse with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reinvention to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reinvention',
  'operational_excellence',
  'Address reinvention with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reinvention to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reinvention',
  'operational_excellence',
  'Address reinvention with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reinvention to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reinvention',
  'operational_excellence',
  'Address reinvention with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map velocity_impact to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'velocity_impact',
  'operational_excellence',
  'Address velocity impact with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map velocity_impact to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'velocity_impact',
  'operational_excellence',
  'Address velocity impact with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map velocity_impact to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'velocity_impact',
  'operational_excellence',
  'Address velocity impact with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map quality_inconsistency to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'quality_inconsistency',
  'operational_excellence',
  'Address quality inconsistency with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map quality_inconsistency to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'quality_inconsistency',
  'operational_excellence',
  'Address quality inconsistency with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map quality_inconsistency to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'quality_inconsistency',
  'operational_excellence',
  'Address quality inconsistency with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map maintenance_burden to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'maintenance_burden',
  'operational_excellence',
  'Address maintenance burden with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map maintenance_burden to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'maintenance_burden',
  'operational_excellence',
  'Address maintenance burden with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map maintenance_burden to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'maintenance_burden',
  'operational_excellence',
  'Address maintenance burden with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_formal_training to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_formal_training',
  'operational_excellence',
  'Address no formal training with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_formal_training to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_formal_training',
  'operational_excellence',
  'Address no formal training with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_formal_training to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_formal_training',
  'operational_excellence',
  'Address no formal training with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map outdated_content to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'outdated_content',
  'operational_excellence',
  'Address outdated content with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map outdated_content to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'outdated_content',
  'operational_excellence',
  'Address outdated content with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map outdated_content to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'outdated_content',
  'operational_excellence',
  'Address outdated content with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map limited_coverage to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'limited_coverage',
  'operational_excellence',
  'Address limited coverage with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map limited_coverage to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'limited_coverage',
  'operational_excellence',
  'Address limited coverage with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map limited_coverage to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'limited_coverage',
  'operational_excellence',
  'Address limited coverage with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map access_barriers to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'access_barriers',
  'operational_excellence',
  'Address access barriers with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map access_barriers to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'access_barriers',
  'operational_excellence',
  'Address access barriers with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map access_barriers to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'access_barriers',
  'operational_excellence',
  'Address access barriers with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map hands_on_gaps to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'hands_on_gaps',
  'operational_excellence',
  'Address hands on gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map hands_on_gaps to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'hands_on_gaps',
  'operational_excellence',
  'Address hands on gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map hands_on_gaps to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'hands_on_gaps',
  'operational_excellence',
  'Address hands on gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map skills_gaps to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'skills_gaps',
  'operational_excellence',
  'Address skills gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map skills_gaps to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'skills_gaps',
  'operational_excellence',
  'Address skills gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map skills_gaps to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'skills_gaps',
  'operational_excellence',
  'Address skills gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map support_burden to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'support_burden',
  'operational_excellence',
  'Address support burden with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map support_burden to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'support_burden',
  'operational_excellence',
  'Address support burden with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map support_burden to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'support_burden',
  'operational_excellence',
  'Address support burden with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map underutilization to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'underutilization',
  'operational_excellence',
  'Address underutilization with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map underutilization to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'underutilization',
  'operational_excellence',
  'Address underutilization with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map underutilization to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'underutilization',
  'operational_excellence',
  'Address underutilization with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map employee_frustration to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'employee_frustration',
  'operational_excellence',
  'Address employee frustration with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map employee_frustration to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'employee_frustration',
  'operational_excellence',
  'Address employee frustration with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map employee_frustration to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'employee_frustration',
  'operational_excellence',
  'Address employee frustration with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_updates to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_updates',
  'operational_excellence',
  'Address no updates with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_updates to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_updates',
  'operational_excellence',
  'Address no updates with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_updates to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_updates',
  'operational_excellence',
  'Address no updates with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map demo_gaps to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'demo_gaps',
  'operational_excellence',
  'Address demo gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map demo_gaps to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'demo_gaps',
  'operational_excellence',
  'Address demo gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map demo_gaps to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'demo_gaps',
  'operational_excellence',
  'Address demo gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map capability_unawareness to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'capability_unawareness',
  'operational_excellence',
  'Address capability unawareness with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map capability_unawareness to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'capability_unawareness',
  'operational_excellence',
  'Address capability unawareness with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map capability_unawareness to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'capability_unawareness',
  'operational_excellence',
  'Address capability unawareness with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map missed_opportunities to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'missed_opportunities',
  'operational_excellence',
  'Address missed opportunities with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map missed_opportunities to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'missed_opportunities',
  'operational_excellence',
  'Address missed opportunities with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map missed_opportunities to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'missed_opportunities',
  'operational_excellence',
  'Address missed opportunities with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map stale_practices to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'stale_practices',
  'operational_excellence',
  'Address stale practices with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map stale_practices to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'stale_practices',
  'operational_excellence',
  'Address stale practices with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map stale_practices to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'stale_practices',
  'operational_excellence',
  'Address stale practices with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map competitive_lag to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'competitive_lag',
  'operational_excellence',
  'Address competitive lag with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map competitive_lag to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'competitive_lag',
  'operational_excellence',
  'Address competitive lag with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map competitive_lag to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'competitive_lag',
  'operational_excellence',
  'Address competitive lag with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_tracking to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_tracking',
  'operational_excellence',
  'Address no tracking with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_tracking to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_tracking',
  'operational_excellence',
  'Address no tracking with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_tracking to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_tracking',
  'operational_excellence',
  'Address no tracking with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map attribution_gaps to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'attribution_gaps',
  'operational_excellence',
  'Address attribution gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map attribution_gaps to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'attribution_gaps',
  'operational_excellence',
  'Address attribution gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map attribution_gaps to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'attribution_gaps',
  'operational_excellence',
  'Address attribution gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map metric_gaps to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'metric_gaps',
  'operational_excellence',
  'Address metric gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map metric_gaps to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'metric_gaps',
  'operational_excellence',
  'Address metric gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map metric_gaps to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'metric_gaps',
  'operational_excellence',
  'Address metric gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reporting_complexity to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reporting_complexity',
  'operational_excellence',
  'Address reporting complexity with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reporting_complexity to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reporting_complexity',
  'operational_excellence',
  'Address reporting complexity with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reporting_complexity to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reporting_complexity',
  'operational_excellence',
  'Address reporting complexity with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_quality to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_quality',
  'operational_excellence',
  'Address data quality with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_quality to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_quality',
  'operational_excellence',
  'Address data quality with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map data_quality to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'data_quality',
  'operational_excellence',
  'Address data quality with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map budget_justification to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'budget_justification',
  'operational_excellence',
  'Address budget justification with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map budget_justification to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'budget_justification',
  'operational_excellence',
  'Address budget justification with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map budget_justification to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'budget_justification',
  'operational_excellence',
  'Address budget justification with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map cost_perception to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'cost_perception',
  'operational_excellence',
  'Address cost perception with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map cost_perception to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'cost_perception',
  'operational_excellence',
  'Address cost perception with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map cost_perception to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'cost_perception',
  'operational_excellence',
  'Address cost perception with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map optimization_challenges to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'optimization_challenges',
  'operational_excellence',
  'Address optimization challenges with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map optimization_challenges to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'optimization_challenges',
  'operational_excellence',
  'Address optimization challenges with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map optimization_challenges to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'optimization_challenges',
  'operational_excellence',
  'Address optimization challenges with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map stakeholder_skepticism to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'stakeholder_skepticism',
  'operational_excellence',
  'Address stakeholder skepticism with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map stakeholder_skepticism to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'stakeholder_skepticism',
  'operational_excellence',
  'Address stakeholder skepticism with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map stakeholder_skepticism to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'stakeholder_skepticism',
  'operational_excellence',
  'Address stakeholder skepticism with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_reviews to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_reviews',
  'operational_excellence',
  'Address no reviews with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_reviews to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_reviews',
  'operational_excellence',
  'Address no reviews with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_reviews to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_reviews',
  'operational_excellence',
  'Address no reviews with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map manual_analysis to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'manual_analysis',
  'operational_excellence',
  'Address manual analysis with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map manual_analysis to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'manual_analysis',
  'operational_excellence',
  'Address manual analysis with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map manual_analysis to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'manual_analysis',
  'operational_excellence',
  'Address manual analysis with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map action_gaps to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'action_gaps',
  'operational_excellence',
  'Address action gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map action_gaps to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'action_gaps',
  'operational_excellence',
  'Address action gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map action_gaps to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'action_gaps',
  'operational_excellence',
  'Address action gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map stakeholder_engagement to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'stakeholder_engagement',
  'operational_excellence',
  'Address stakeholder engagement with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map stakeholder_engagement to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'stakeholder_engagement',
  'operational_excellence',
  'Address stakeholder engagement with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map stakeholder_engagement to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'stakeholder_engagement',
  'operational_excellence',
  'Address stakeholder engagement with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map wasted_spend to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'wasted_spend',
  'operational_excellence',
  'Address wasted spend with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map wasted_spend to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'wasted_spend',
  'operational_excellence',
  'Address wasted spend with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map wasted_spend to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'wasted_spend',
  'operational_excellence',
  'Address wasted spend with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map misaligned_priorities to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'misaligned_priorities',
  'operational_excellence',
  'Address misaligned priorities with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map misaligned_priorities to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'misaligned_priorities',
  'operational_excellence',
  'Address misaligned priorities with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map misaligned_priorities to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'misaligned_priorities',
  'operational_excellence',
  'Address misaligned priorities with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reactive_approach to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reactive_approach',
  'operational_excellence',
  'Address reactive approach with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reactive_approach to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reactive_approach',
  'operational_excellence',
  'Address reactive approach with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map reactive_approach to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'reactive_approach',
  'operational_excellence',
  'Address reactive approach with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map budget_overruns to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'budget_overruns',
  'operational_excellence',
  'Address budget overruns with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map budget_overruns to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'budget_overruns',
  'operational_excellence',
  'Address budget overruns with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map budget_overruns to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'budget_overruns',
  'operational_excellence',
  'Address budget overruns with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map accountability_gaps to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'accountability_gaps',
  'operational_excellence',
  'Address accountability gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map accountability_gaps to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'accountability_gaps',
  'operational_excellence',
  'Address accountability gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map accountability_gaps to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'accountability_gaps',
  'operational_excellence',
  'Address accountability gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_evaluation to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_evaluation',
  'operational_excellence',
  'Address no evaluation with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_evaluation to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_evaluation',
  'operational_excellence',
  'Address no evaluation with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_evaluation to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_evaluation',
  'operational_excellence',
  'Address no evaluation with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map risk_aversion to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'risk_aversion',
  'operational_excellence',
  'Address risk aversion with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map risk_aversion to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'risk_aversion',
  'operational_excellence',
  'Address risk aversion with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map risk_aversion to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'risk_aversion',
  'operational_excellence',
  'Address risk aversion with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map testing_barriers to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'testing_barriers',
  'operational_excellence',
  'Address testing barriers with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map testing_barriers to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'testing_barriers',
  'operational_excellence',
  'Address testing barriers with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map testing_barriers to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'testing_barriers',
  'operational_excellence',
  'Address testing barriers with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map adoption_delays to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'adoption_delays',
  'operational_excellence',
  'Address adoption delays with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map adoption_delays to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'adoption_delays',
  'operational_excellence',
  'Address adoption delays with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map adoption_delays to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'adoption_delays',
  'operational_excellence',
  'Address adoption delays with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map missed_capabilities to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'missed_capabilities',
  'operational_excellence',
  'Address missed capabilities with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map missed_capabilities to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'missed_capabilities',
  'operational_excellence',
  'Address missed capabilities with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map missed_capabilities to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'missed_capabilities',
  'operational_excellence',
  'Address missed capabilities with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map competitive_disadvantage to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'competitive_disadvantage',
  'operational_excellence',
  'Address competitive disadvantage with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map competitive_disadvantage to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'competitive_disadvantage',
  'operational_excellence',
  'Address competitive disadvantage with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map competitive_disadvantage to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'competitive_disadvantage',
  'operational_excellence',
  'Address competitive disadvantage with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map efficiency_gaps to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'efficiency_gaps',
  'operational_excellence',
  'Address efficiency gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map efficiency_gaps to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'efficiency_gaps',
  'operational_excellence',
  'Address efficiency gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map efficiency_gaps to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'efficiency_gaps',
  'operational_excellence',
  'Address efficiency gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map team_frustration to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'team_frustration',
  'operational_excellence',
  'Address team frustration with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map team_frustration to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'team_frustration',
  'operational_excellence',
  'Address team frustration with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map team_frustration to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'team_frustration',
  'operational_excellence',
  'Address team frustration with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_feedback_loop to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_feedback_loop',
  'operational_excellence',
  'Address no feedback loop with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_feedback_loop to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_feedback_loop',
  'operational_excellence',
  'Address no feedback loop with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map no_feedback_loop to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'no_feedback_loop',
  'operational_excellence',
  'Address no feedback loop with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map learning_capture to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'learning_capture',
  'operational_excellence',
  'Address learning capture with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map learning_capture to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'learning_capture',
  'operational_excellence',
  'Address learning capture with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map learning_capture to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'learning_capture',
  'operational_excellence',
  'Address learning capture with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map retrospective_gaps to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'retrospective_gaps',
  'operational_excellence',
  'Address retrospective gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map retrospective_gaps to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'retrospective_gaps',
  'operational_excellence',
  'Address retrospective gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map retrospective_gaps to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'retrospective_gaps',
  'operational_excellence',
  'Address retrospective gaps with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map action_tracking to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'action_tracking',
  'operational_excellence',
  'Address action tracking with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map action_tracking to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'action_tracking',
  'operational_excellence',
  'Address action tracking with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map action_tracking to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'action_tracking',
  'operational_excellence',
  'Address action tracking with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map roadmap_disconnect to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'roadmap_disconnect',
  'operational_excellence',
  'Address roadmap disconnect with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map roadmap_disconnect to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'roadmap_disconnect',
  'operational_excellence',
  'Address roadmap disconnect with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map roadmap_disconnect to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'roadmap_disconnect',
  'operational_excellence',
  'Address roadmap disconnect with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map repeated_mistakes to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'repeated_mistakes',
  'operational_excellence',
  'Address repeated mistakes with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map repeated_mistakes to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'repeated_mistakes',
  'operational_excellence',
  'Address repeated mistakes with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map repeated_mistakes to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'repeated_mistakes',
  'operational_excellence',
  'Address repeated mistakes with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map slow_improvement to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'slow_improvement',
  'operational_excellence',
  'Address slow improvement with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map slow_improvement to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'slow_improvement',
  'operational_excellence',
  'Address slow improvement with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map slow_improvement to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'slow_improvement',
  'operational_excellence',
  'Address slow improvement with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map team_disengagement to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'team_disengagement',
  'operational_excellence',
  'Address team disengagement with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map team_disengagement to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'team_disengagement',
  'operational_excellence',
  'Address team disengagement with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map team_disengagement to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'team_disengagement',
  'operational_excellence',
  'Address team disengagement with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map value_leakage to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'value_leakage',
  'operational_excellence',
  'Address value leakage with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map value_leakage to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'value_leakage',
  'operational_excellence',
  'Address value leakage with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map value_leakage to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'value_leakage',
  'operational_excellence',
  'Address value leakage with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map culture_impact to collaboration features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'culture_impact',
  'operational_excellence',
  'Address culture impact with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'collaboration'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map culture_impact to cost-optimization features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'culture_impact',
  'operational_excellence',
  'Address culture impact with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'cost-optimization'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- Map culture_impact to monitoring features
INSERT INTO feature_pain_point_mapping (feature_id, pain_point_value, pillar, recommendation_text)
SELECT 
  f.id,
  'culture_impact',
  'operational_excellence',
  'Address culture impact with ' || f.name || ' - ' || f.short_description
FROM databricks_features f
WHERE f.category = 'monitoring'
  AND f.ga_status IN ('GA', 'Public Preview')
LIMIT 2  -- Top 2 features per category per pain point
ON CONFLICT (feature_id, pain_point_value) DO NOTHING;

-- ============================================================================
-- Total mappings generated: 1801
-- ============================================================================
