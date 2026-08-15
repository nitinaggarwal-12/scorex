// Pillar 2: Data Engineering & Integration
// 💾 Data Engineering & Integration - Evaluate how efficiently data is ingested, transformed, and managed within Databricks.

const { generateMaturityOptions } = require('../standardMaturityLevels');

const dataEngineeringPillar = {
  id: 'data_engineering',
  name: '💾 Data',
  description: 'Evaluate how efficiently data is ingested, transformed, and managed within Databricks.',
  goal: 'Evaluate how efficiently data is ingested, transformed, and managed within Databricks.',
  dimensions: [
    {
      id: 'ingestion_strategy',
      name: 'Ingestion Strategy',
      questions: [
        {
          id: 'ingestion_automation',
          question: 'How unified and automated are your data-ingestion pipelines across enterprise systems and external sources?',
          perspectives: [
            {
              id: 'current_state',
              label: 'Current State',
              type: 'single_choice',
              options: generateMaturityOptions('ingestion')
            },
            {
              id: 'future_state',
              label: 'Future State Vision',
              type: 'single_choice',
              options: generateMaturityOptions('ingestion')
            },
            {
              id: 'technical_pain',
              label: 'Technical Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'complex_integrations', label: 'Complex source system integrations', score: 4 },
                { value: 'data_format_issues', label: 'Data format and schema inconsistencies', score: 3 },
                { value: 'pipeline_maintenance', label: 'High pipeline maintenance overhead', score: 3 },
                { value: 'error_handling', label: 'Poor error handling and recovery', score: 4 },
                { value: 'throughput_issues', label: 'Ingestion throughput limitations', score: 4 }
              ]
            },
            {
              id: 'business_pain',
              label: 'Business Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'data_delays', label: 'Data availability delays impacting decisions', score: 4 },
                { value: 'integration_costs', label: 'High costs for new source integrations', score: 3 },
                { value: 'data_quality', label: 'Poor data quality at ingestion', score: 5 },
                { value: 'team_bottlenecks', label: 'Engineering bottlenecks for new sources', score: 4 },
                { value: 'business_agility', label: 'Limited agility for new data needs', score: 4 }
              ]
            }
          ],
          commentBox: {
            label: 'Notes',
            placeholder: 'Describe your data ingestion challenges and automation goals...'
          }
        },
        {
          id: 'ingestion_resilience',
          question: 'How resilient are your ingestion processes to schema changes or data delays?',
          perspectives: [
            {
              id: 'current_state',
              label: 'Current State',
              type: 'single_choice',
              options: generateMaturityOptions('ingestion')
            },
            {
              id: 'future_state',
              label: 'Future State Vision',
              type: 'single_choice',
              options: generateMaturityOptions('ingestion')
            },
            {
              id: 'technical_pain',
              label: 'Technical Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'schema_breakage', label: 'Frequent pipeline failures from schema changes', score: 5 },
                { value: 'manual_fixes', label: 'Manual intervention required for recovery', score: 4 },
                { value: 'data_loss_risk', label: 'Risk of data loss during failures', score: 5 },
                { value: 'monitoring_gaps', label: 'Inadequate failure monitoring', score: 4 },
                { value: 'recovery_complexity', label: 'Complex recovery procedures', score: 3 }
              ]
            },
            {
              id: 'business_pain',
              label: 'Business Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'data_unavailability', label: 'Critical data unavailable during failures', score: 5 },
                { value: 'operational_overhead', label: 'High operational overhead for recovery', score: 4 },
                { value: 'sla_breaches', label: 'SLA breaches due to data delays', score: 4 },
                { value: 'trust_issues', label: 'Loss of stakeholder trust', score: 4 },
                { value: 'compliance_risk', label: 'Compliance risks from data gaps', score: 5 }
              ]
            }
          ],
          commentBox: {
            label: 'Notes',
            placeholder: 'Share details about ingestion resilience challenges...'
          }
        }
      ]
    },
    {
      id: 'lakehouse_architecture',
      name: 'Lakehouse Architecture',
      questions: [
        {
          id: 'lakehouse_structure',
          question: 'How well-structured are your raw, curated, and consumption data layers within your Databricks Lakehouse?',
          perspectives: [
            {
              id: 'current_state',
              label: 'Current State',
              type: 'single_choice',
              options: generateMaturityOptions('architecture')
            },
            {
              id: 'future_state',
              label: 'Future State Vision',
              type: 'single_choice',
              options: generateMaturityOptions('architecture')
            },
            {
              id: 'technical_pain',
              label: 'Technical Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'data_organization', label: 'Poor data organization and structure', score: 4 },
                { value: 'layer_confusion', label: 'Unclear layer boundaries and responsibilities', score: 3 },
                { value: 'duplicate_data', label: 'Data duplication across layers', score: 3 },
                { value: 'transformation_complexity', label: 'Complex transformation logic', score: 4 },
                { value: 'performance_issues', label: 'Performance issues from poor structure', score: 4 }
              ]
            },
            {
              id: 'business_pain',
              label: 'Business Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'data_discovery', label: 'Difficulty finding the right data', score: 4 },
                { value: 'inconsistent_metrics', label: 'Inconsistent metrics across teams', score: 4 },
                { value: 'storage_costs', label: 'High storage costs from duplication', score: 3 },
                { value: 'slow_insights', label: 'Slow time to insights', score: 4 },
                { value: 'trust_deficit', label: 'Low trust in data accuracy', score: 5 }
              ]
            }
          ],
          commentBox: {
            label: 'Notes',
            placeholder: 'Describe your lakehouse architecture and data layer structure...'
          }
        },
        {
          id: 'architecture_adaptability',
          question: 'How adaptable is your architecture for new data types, sources, and interoperability requirements?',
          perspectives: [
            {
              id: 'current_state',
              label: 'Current State',
              type: 'single_choice',
              options: generateMaturityOptions('architecture')
            },
            {
              id: 'future_state',
              label: 'Future State Vision',
              type: 'single_choice',
              options: generateMaturityOptions('architecture')
            },
            {
              id: 'technical_pain',
              label: 'Technical Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'rigid_structure', label: 'Rigid architecture resisting change', score: 4 },
                { value: 'new_source_complexity', label: 'Complexity adding new data sources', score: 4 },
                { value: 'format_limitations', label: 'Limited support for new data formats', score: 3 },
                { value: 'integration_effort', label: 'High effort for system integrations', score: 4 },
                { value: 'scalability_constraints', label: 'Architecture scalability constraints', score: 4 }
              ]
            },
            {
              id: 'business_pain',
              label: 'Business Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'slow_adaptation', label: 'Slow adaptation to new requirements', score: 4 },
                { value: 'missed_opportunities', label: 'Missed opportunities due to inflexibility', score: 4 },
                { value: 'integration_delays', label: 'Delays in partner/vendor integrations', score: 3 },
                { value: 'competitive_lag', label: 'Competitive lag from slow data adoption', score: 4 },
                { value: 'innovation_barriers', label: 'Barriers to data innovation', score: 4 }
              ]
            }
          ],
          commentBox: {
            label: 'Notes',
            placeholder: 'Share details about architecture adaptability challenges...'
          }
        }
      ]
    },
    {
      id: 'pipeline_orchestration',
      name: 'Pipeline Orchestration',
      questions: [
        {
          id: 'orchestration_reliability',
          question: 'How reliable and maintainable are your Databricks data pipelines from scheduling to dependency management?',
          perspectives: [
            {
              id: 'current_state',
              label: 'Current State',
              type: 'single_choice',
              options: generateMaturityOptions('orchestration')
            },
            {
              id: 'future_state',
              label: 'Future State Vision',
              type: 'single_choice',
              options: generateMaturityOptions('orchestration')
            },
            {
              id: 'technical_pain',
              label: 'Technical Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'scheduling_issues', label: 'Unreliable job scheduling', score: 4 },
                { value: 'dependency_failures', label: 'Dependency management failures', score: 4 },
                { value: 'retry_logic', label: 'Inadequate retry and recovery logic', score: 4 },
                { value: 'monitoring_gaps', label: 'Poor pipeline monitoring', score: 4 },
                { value: 'maintenance_burden', label: 'High maintenance burden', score: 3 }
              ]
            },
            {
              id: 'business_pain',
              label: 'Business Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'data_freshness', label: 'Stale data impacting decisions', score: 4 },
                { value: 'operational_costs', label: 'High operational support costs', score: 3 },
                { value: 'pipeline_failures', label: 'Frequent pipeline failures', score: 5 },
                { value: 'sla_misses', label: 'Missing data SLAs', score: 4 },
                { value: 'team_frustration', label: 'Team frustration with reliability', score: 3 }
              ]
            }
          ],
          commentBox: {
            label: 'Notes',
            placeholder: 'Describe pipeline orchestration and reliability challenges...'
          }
        },
        {
          id: 'pipeline_lifecycle',
          question: 'How effectively do you version, test, and promote pipeline changes between environments?',
          perspectives: [
            {
              id: 'current_state',
              label: 'Current State',
              type: 'single_choice',
              options: generateMaturityOptions('operations')
            },
            {
              id: 'future_state',
              label: 'Future State Vision',
              type: 'single_choice',
              options: generateMaturityOptions('operations')
            },
            {
              id: 'technical_pain',
              label: 'Technical Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'version_control', label: 'Inconsistent version control', score: 4 },
                { value: 'testing_gaps', label: 'Inadequate pipeline testing', score: 4 },
                { value: 'deployment_issues', label: 'Deployment failures and rollbacks', score: 4 },
                { value: 'environment_drift', label: 'Environment configuration drift', score: 3 },
                { value: 'change_tracking', label: 'Poor change tracking and documentation', score: 3 }
              ]
            },
            {
              id: 'business_pain',
              label: 'Business Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'production_incidents', label: 'Production incidents from bad deployments', score: 5 },
                { value: 'slow_releases', label: 'Slow release cycles', score: 4 },
                { value: 'quality_issues', label: 'Data quality issues in production', score: 5 },
                { value: 'rollback_complexity', label: 'Complex rollback procedures', score: 4 },
                { value: 'audit_gaps', label: 'Compliance audit gaps', score: 4 }
              ]
            }
          ],
          commentBox: {
            label: 'Notes',
            placeholder: 'Share details about pipeline lifecycle management...'
          }
        }
      ]
    },
    {
      id: 'data_quality',
      name: 'Data Quality',
      questions: [
        {
          id: 'quality_validation',
          question: 'How standardized are your data-validation, reconciliation, and recovery processes in Databricks?',
          perspectives: [
            {
              id: 'current_state',
              label: 'Current State',
              type: 'single_choice',
              options: generateMaturityOptions('quality')
            },
            {
              id: 'future_state',
              label: 'Future State Vision',
              type: 'single_choice',
              options: generateMaturityOptions('quality')
            },
            {
              id: 'technical_pain',
              label: 'Technical Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'validation_gaps', label: 'Incomplete data validation', score: 4 },
                { value: 'quality_rules', label: 'Inconsistent quality rules', score: 3 },
                { value: 'error_detection', label: 'Late error detection', score: 4 },
                { value: 'reconciliation_complexity', label: 'Complex data reconciliation', score: 4 },
                { value: 'recovery_procedures', label: 'Manual recovery procedures', score: 4 }
              ]
            },
            {
              id: 'business_pain',
              label: 'Business Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'bad_decisions', label: 'Business decisions on bad data', score: 5 },
                { value: 'customer_impact', label: 'Customer-facing data quality issues', score: 5 },
                { value: 'trust_erosion', label: 'Erosion of data trust', score: 5 },
                { value: 'compliance_violations', label: 'Compliance violations from bad data', score: 5 },
                { value: 'operational_overhead', label: 'High operational overhead for fixes', score: 3 }
              ]
            }
          ],
          commentBox: {
            label: 'Notes',
            placeholder: 'Describe data quality and validation challenges...'
          }
        },
        {
          id: 'quality_monitoring',
          question: 'How consistently are quality rules monitored and surfaced to stakeholders?',
          perspectives: [
            {
              id: 'current_state',
              label: 'Current State',
              type: 'single_choice',
              options: generateMaturityOptions('quality')
            },
            {
              id: 'future_state',
              label: 'Future State Vision',
              type: 'single_choice',
              options: generateMaturityOptions('quality')
            },
            {
              id: 'technical_pain',
              label: 'Technical Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'monitoring_gaps', label: 'Gaps in quality monitoring', score: 4 },
                { value: 'alert_noise', label: 'Alert fatigue from false positives', score: 3 },
                { value: 'metric_visibility', label: 'Poor quality metric visibility', score: 4 },
                { value: 'stakeholder_communication', label: 'Difficult stakeholder communication', score: 3 },
                { value: 'trend_analysis', label: 'Limited quality trend analysis', score: 3 }
              ]
            },
            {
              id: 'business_pain',
              label: 'Business Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'late_discovery', label: 'Late discovery of data issues', score: 4 },
                { value: 'stakeholder_frustration', label: 'Stakeholder frustration with quality', score: 4 },
                { value: 'reactive_approach', label: 'Reactive vs proactive quality management', score: 3 },
                { value: 'sla_impacts', label: 'Quality issues impacting SLAs', score: 4 },
                { value: 'reputation_damage', label: 'Reputation damage from data errors', score: 4 }
              ]
            }
          ],
          commentBox: {
            label: 'Notes',
            placeholder: 'Share details about quality monitoring and communication...'
          }
        }
      ]
    },
    {
      id: 'performance_scalability',
      name: 'Performance & Scalability',
      questions: [
        {
          id: 'performance_optimization',
          question: 'How optimized are your data pipelines for parallel processing and throughput at scale?',
          perspectives: [
            {
              id: 'current_state',
              label: 'Current State',
              type: 'single_choice',
              options: generateMaturityOptions('performance')
            },
            {
              id: 'future_state',
              label: 'Future State Vision',
              type: 'single_choice',
              options: generateMaturityOptions('performance')
            },
            {
              id: 'technical_pain',
              label: 'Technical Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'slow_pipelines', label: 'Slow pipeline execution times', score: 4 },
                { value: 'parallelization_gaps', label: 'Limited parallelization', score: 4 },
                { value: 'resource_inefficiency', label: 'Inefficient resource utilization', score: 3 },
                { value: 'bottlenecks', label: 'Pipeline bottlenecks', score: 4 },
                { value: 'optimization_difficulty', label: 'Difficult performance optimization', score: 3 }
              ]
            },
            {
              id: 'business_pain',
              label: 'Business Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'data_latency', label: 'High data latency impacting decisions', score: 4 },
                { value: 'compute_costs', label: 'High compute costs', score: 4 },
                { value: 'user_experience', label: 'Poor user experience from slow queries', score: 4 },
                { value: 'scalability_limits', label: 'Cannot scale to meet demand', score: 5 },
                { value: 'competitive_disadvantage', label: 'Competitive disadvantage from slow data', score: 4 }
              ]
            }
          ],
          commentBox: {
            label: 'Notes',
            placeholder: 'Describe performance optimization challenges and goals...'
          }
        },
        {
          id: 'scalability_demand',
          question: 'How dynamically can your workloads scale up or down during variable demand periods?',
          perspectives: [
            {
              id: 'current_state',
              label: 'Current State',
              type: 'single_choice',
              options: generateMaturityOptions('scaling')
            },
            {
              id: 'future_state',
              label: 'Future State Vision',
              type: 'single_choice',
              options: generateMaturityOptions('scaling')
            },
            {
              id: 'technical_pain',
              label: 'Technical Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'manual_scaling', label: 'Manual scaling processes', score: 4 },
                { value: 'over_provisioning', label: 'Over-provisioning to handle peaks', score: 3 },
                { value: 'scaling_delays', label: 'Slow scaling response times', score: 4 },
                { value: 'resource_contention', label: 'Resource contention during peaks', score: 4 },
                { value: 'configuration_complexity', label: 'Complex scaling configuration', score: 3 }
              ]
            },
            {
              id: 'business_pain',
              label: 'Business Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'cost_inefficiency', label: 'Cost inefficiency from static sizing', score: 4 },
                { value: 'performance_degradation', label: 'Performance degradation during peaks', score: 4 },
                { value: 'capacity_planning', label: 'Difficult capacity planning', score: 3 },
                { value: 'business_impact', label: 'Business impact from scaling delays', score: 4 },
                { value: 'wasted_resources', label: 'Wasted resources during low demand', score: 3 }
              ]
            }
          ],
          commentBox: {
            label: 'Notes',
            placeholder: 'Share details about workload scalability challenges...'
          }
        }
      ]
    }
  ]
};

module.exports = dataEngineeringPillar;
