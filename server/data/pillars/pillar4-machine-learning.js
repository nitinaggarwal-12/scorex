// Pillar 4: Machine Learning
// 🤖 Machine Learning - Assess the maturity of ML workflows, feature stores, and model operationalization.

const { generateMaturityOptions } = require('../standardMaturityLevels');

const machineLearningPillar = {
  id: 'machine_learning',
  name: '🤖 ML',
  description: 'Assess the maturity of ML workflows, feature stores, and model operationalization.',
  goal: 'Assess the maturity of ML workflows, feature stores, and model operationalization.',
  dimensions: [
    {
      id: 'ml_lifecycle',
      name: 'ML Lifecycle Management',
      questions: [
        {
          id: 'experiment_tracking',
          question: 'How systematically are experiments, features, and results tracked for your ML workflows?',
          perspectives: [
            {
              id: 'current_state',
              label: 'Current State',
              type: 'single_choice',
              options: generateMaturityOptions('ml_lifecycle')
            },
            {
              id: 'future_state',
              label: 'Future State Vision',
              type: 'single_choice',
              options: generateMaturityOptions('ml_lifecycle')
            },
            {
              id: 'technical_pain',
              label: 'Technical Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'no_tracking', label: 'No centralized experiment tracking', score: 4 },
                { value: 'reproducibility_issues', label: 'Difficult to reproduce results', score: 4 },
                { value: 'scattered_artifacts', label: 'Scattered model artifacts', score: 3 },
                { value: 'manual_logging', label: 'Manual experiment logging', score: 3 },
                { value: 'comparison_difficulty', label: 'Difficult experiment comparison', score: 4 }
              ]
            },
            {
              id: 'business_pain',
              label: 'Business Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'wasted_effort', label: 'Wasted effort re-running experiments', score: 3 },
                { value: 'slow_iteration', label: 'Slow ML iteration cycles', score: 4 },
                { value: 'knowledge_loss', label: 'Knowledge loss when team members leave', score: 4 },
                { value: 'audit_challenges', label: 'Compliance audit challenges', score: 4 },
                { value: 'limited_reuse', label: 'Limited model and feature reuse', score: 3 }
              ]
            }
          ],
          commentBox: {
            label: 'Notes',
            placeholder: 'Describe your ML experiment tracking and lifecycle challenges...'
          }
        },
        {
          id: 'model_reproducibility',
          question: 'How reproducible are your models and datasets across environments?',
          perspectives: [
            {
              id: 'current_state',
              label: 'Current State',
              type: 'single_choice',
              options: generateMaturityOptions('ml_lifecycle')
            },
            {
              id: 'future_state',
              label: 'Future State Vision',
              type: 'single_choice',
              options: generateMaturityOptions('ml_lifecycle')
            },
            {
              id: 'technical_pain',
              label: 'Technical Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'environment_drift', label: 'Environment configuration drift', score: 4 },
                { value: 'dependency_issues', label: 'Dependency management issues', score: 4 },
                { value: 'data_versioning', label: 'Lack of data versioning', score: 4 },
                { value: 'model_packaging', label: 'Inconsistent model packaging', score: 3 },
                { value: 'seed_management', label: 'Poor random seed management', score: 3 }
              ]
            },
            {
              id: 'business_pain',
              label: 'Business Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'debugging_difficulty', label: 'Difficult to debug model issues', score: 4 },
                { value: 'production_failures', label: 'Model failures in production', score: 5 },
                { value: 'trust_issues', label: 'Loss of trust in ML systems', score: 4 },
                { value: 'compliance_risk', label: 'Compliance and audit risk', score: 5 },
                { value: 'rollback_complexity', label: 'Complex model rollback procedures', score: 4 }
              ]
            }
          ],
          commentBox: {
            label: 'Notes',
            placeholder: 'Share details about model reproducibility challenges...'
          }
        }
      ]
    },
    {
      id: 'ml_deployment',
      name: 'Model Deployment & Serving',
      questions: [
        {
          id: 'deployment_automation',
          question: 'How automated is your model deployment and promotion process within Databricks?',
          perspectives: [
            {
              id: 'current_state',
              label: 'Current State',
              type: 'single_choice',
              options: generateMaturityOptions('ml_deployment')
            },
            {
              id: 'future_state',
              label: 'Future State Vision',
              type: 'single_choice',
              options: generateMaturityOptions('ml_deployment')
            },
            {
              id: 'technical_pain',
              label: 'Technical Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'manual_deployment', label: 'Manual model deployment processes', score: 4 },
                { value: 'no_cicd', label: 'No CI/CD for models', score: 4 },
                { value: 'environment_inconsistency', label: 'Environment inconsistencies', score: 4 },
                { value: 'rollback_difficulty', label: 'Difficult model rollbacks', score: 4 },
                { value: 'testing_gaps', label: 'Inadequate pre-deployment testing', score: 4 }
              ]
            },
            {
              id: 'business_pain',
              label: 'Business Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'slow_time_to_value', label: 'Slow time to value for models', score: 4 },
                { value: 'deployment_failures', label: 'Frequent deployment failures', score: 5 },
                { value: 'resource_intensive', label: 'Resource-intensive deployment process', score: 3 },
                { value: 'innovation_bottleneck', label: 'Bottleneck for ML innovation', score: 4 },
                { value: 'business_risk', label: 'Business risk from deployment issues', score: 5 }
              ]
            }
          ],
          commentBox: {
            label: 'Notes',
            placeholder: 'Describe your model deployment and promotion challenges...'
          }
        },
        {
          id: 'model_monitoring',
          question: 'How standardized are your mechanisms for monitoring performance and retraining models?',
          perspectives: [
            {
              id: 'current_state',
              label: 'Current State',
              type: 'single_choice',
              options: generateMaturityOptions('ml_monitoring')
            },
            {
              id: 'future_state',
              label: 'Future State Vision',
              type: 'single_choice',
              options: generateMaturityOptions('ml_monitoring')
            },
            {
              id: 'technical_pain',
              label: 'Technical Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'no_monitoring', label: 'No production model monitoring', score: 5 },
                { value: 'drift_detection', label: 'No automated drift detection', score: 4 },
                { value: 'alert_gaps', label: 'Inadequate alerting on model degradation', score: 4 },
                { value: 'manual_retraining', label: 'Manual retraining triggers', score: 3 },
                { value: 'performance_tracking', label: 'Limited performance tracking', score: 4 }
              ]
            },
            {
              id: 'business_pain',
              label: 'Business Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'silent_failures', label: 'Silent model degradation', score: 5 },
                { value: 'customer_impact', label: 'Customer impact from poor predictions', score: 5 },
                { value: 'revenue_loss', label: 'Revenue loss from model failures', score: 5 },
                { value: 'trust_erosion', label: 'Erosion of trust in ML systems', score: 4 },
                { value: 'reactive_approach', label: 'Reactive vs proactive monitoring', score: 4 }
              ]
            }
          ],
          commentBox: {
            label: 'Notes',
            placeholder: 'Share details about model monitoring and retraining practices...'
          }
        }
      ]
    },
    {
      id: 'feature_engineering',
      name: 'Feature Engineering & Management',
      questions: [
        {
          id: 'feature_store',
          question: 'How effectively are reusable features cataloged and shared across teams?',
          perspectives: [
            {
              id: 'current_state',
              label: 'Current State',
              type: 'single_choice',
              options: generateMaturityOptions('ml_lifecycle')
            },
            {
              id: 'future_state',
              label: 'Future State Vision',
              type: 'single_choice',
              options: generateMaturityOptions('ml_lifecycle')
            },
            {
              id: 'technical_pain',
              label: 'Technical Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'no_feature_store', label: 'No centralized feature store', score: 4 },
                { value: 'duplicate_features', label: 'Duplicate feature engineering', score: 3 },
                { value: 'consistency_issues', label: 'Training-serving feature consistency issues', score: 4 },
                { value: 'discovery_difficulty', label: 'Difficult feature discovery', score: 3 },
                { value: 'versioning_gaps', label: 'Inadequate feature versioning', score: 4 }
              ]
            },
            {
              id: 'business_pain',
              label: 'Business Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'wasted_effort', label: 'Wasted effort on duplicate features', score: 3 },
                { value: 'slow_development', label: 'Slow ML development cycles', score: 4 },
                { value: 'model_failures', label: 'Model failures from feature inconsistency', score: 5 },
                { value: 'limited_collaboration', label: 'Limited cross-team collaboration', score: 3 },
                { value: 'quality_issues', label: 'Feature quality and trust issues', score: 4 }
              ]
            }
          ],
          commentBox: {
            label: 'Notes',
            placeholder: 'Describe your feature store and feature management approach...'
          }
        },
        {
          id: 'data_prep',
          question: 'How consistent are data-preparation practices to support multiple model lifecycles?',
          perspectives: [
            {
              id: 'current_state',
              label: 'Current State',
              type: 'single_choice',
              options: generateMaturityOptions('ml_lifecycle')
            },
            {
              id: 'future_state',
              label: 'Future State Vision',
              type: 'single_choice',
              options: generateMaturityOptions('ml_lifecycle')
            },
            {
              id: 'technical_pain',
              label: 'Technical Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'inconsistent_practices', label: 'Inconsistent data prep practices', score: 3 },
                { value: 'manual_processes', label: 'Manual data preparation', score: 4 },
                { value: 'pipeline_fragility', label: 'Fragile data pipelines', score: 4 },
                { value: 'quality_gaps', label: 'Data quality gaps', score: 4 },
                { value: 'scalability_issues', label: 'Scalability limitations', score: 4 }
              ]
            },
            {
              id: 'business_pain',
              label: 'Business Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'data_scientist_bottleneck', label: 'Data scientists spending time on data prep', score: 4 },
                { value: 'slow_iteration', label: 'Slow model iteration cycles', score: 4 },
                { value: 'model_failures', label: 'Model failures from bad data', score: 5 },
                { value: 'resource_waste', label: 'Wasted compute resources', score: 3 },
                { value: 'limited_scalability', label: 'Cannot scale ML initiatives', score: 4 }
              ]
            }
          ],
          commentBox: {
            label: 'Notes',
            placeholder: 'Share details about data preparation for ML challenges...'
          }
        }
      ]
    },
    {
      id: 'ml_governance',
      name: 'ML Governance & Compliance',
      questions: [
        {
          id: 'ml_ownership',
          question: 'How clearly are ownership, review, and approval processes defined for ML artifacts?',
          perspectives: [
            {
              id: 'current_state',
              label: 'Current State',
              type: 'single_choice',
              options: generateMaturityOptions('ml_governance')
            },
            {
              id: 'future_state',
              label: 'Future State Vision',
              type: 'single_choice',
              options: generateMaturityOptions('ml_governance')
            },
            {
              id: 'technical_pain',
              label: 'Technical Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'unclear_ownership', label: 'Unclear model ownership', score: 4 },
                { value: 'no_approval_gates', label: 'No approval gates for production', score: 4 },
                { value: 'documentation_gaps', label: 'Poor model documentation', score: 3 },
                { value: 'review_inconsistency', label: 'Inconsistent review processes', score: 3 },
                { value: 'change_tracking', label: 'Inadequate change tracking', score: 4 }
              ]
            },
            {
              id: 'business_pain',
              label: 'Business Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'accountability_gaps', label: 'Lack of accountability for models', score: 4 },
                { value: 'risk_exposure', label: 'Regulatory and business risk exposure', score: 5 },
                { value: 'quality_issues', label: 'Quality issues from lack of review', score: 4 },
                { value: 'compliance_failures', label: 'Compliance audit failures', score: 5 },
                { value: 'incident_response', label: 'Slow incident response', score: 4 }
              ]
            }
          ],
          commentBox: {
            label: 'Notes',
            placeholder: 'Describe ML governance and ownership processes...'
          }
        },
        {
          id: 'ml_compliance',
          question: 'How well are compliance, reproducibility, and model-lineage requirements enforced?',
          perspectives: [
            {
              id: 'current_state',
              label: 'Current State',
              type: 'single_choice',
              options: generateMaturityOptions('ml_governance')
            },
            {
              id: 'future_state',
              label: 'Future State Vision',
              type: 'single_choice',
              options: generateMaturityOptions('ml_governance')
            },
            {
              id: 'technical_pain',
              label: 'Technical Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'no_lineage', label: 'No model lineage tracking', score: 4 },
                { value: 'audit_gaps', label: 'Incomplete audit trails', score: 4 },
                { value: 'compliance_manual', label: 'Manual compliance processes', score: 4 },
                { value: 'bias_detection', label: 'No automated bias detection', score: 4 },
                { value: 'explainability_gaps', label: 'Limited model explainability', score: 4 }
              ]
            },
            {
              id: 'business_pain',
              label: 'Business Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'regulatory_risk', label: 'Regulatory compliance risk', score: 5 },
                { value: 'audit_failures', label: 'Failed compliance audits', score: 5 },
                { value: 'bias_incidents', label: 'Model bias incidents', score: 5 },
                { value: 'reputation_damage', label: 'Reputation damage from ML issues', score: 5 },
                { value: 'legal_exposure', label: 'Legal exposure from unexplainable models', score: 5 }
              ]
            }
          ],
          commentBox: {
            label: 'Notes',
            placeholder: 'Share details about ML compliance and lineage tracking...'
          }
        }
      ]
    },
    {
      id: 'ml_scale',
      name: 'ML Scale & Productionization',
      questions: [
        {
          id: 'production_delivery',
          question: 'How effectively do your ML models move from pilot to production to deliver measurable outcomes?',
          perspectives: [
            {
              id: 'current_state',
              label: 'Current State',
              type: 'single_choice',
              options: generateMaturityOptions('ml_deployment')
            },
            {
              id: 'future_state',
              label: 'Future State Vision',
              type: 'single_choice',
              options: generateMaturityOptions('ml_deployment')
            },
            {
              id: 'technical_pain',
              label: 'Technical Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'pilot_to_prod_gap', label: 'Large pilot-to-production gap', score: 4 },
                { value: 'deployment_barriers', label: 'Technical deployment barriers', score: 4 },
                { value: 'infrastructure_gaps', label: 'Infrastructure limitations', score: 4 },
                { value: 'integration_complexity', label: 'Complex application integration', score: 4 },
                { value: 'performance_issues', label: 'Production performance issues', score: 4 }
              ]
            },
            {
              id: 'business_pain',
              label: 'Business Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'low_roi', label: 'Low ROI on ML investments', score: 5 },
                { value: 'failed_pilots', label: 'Many pilots never reach production', score: 4 },
                { value: 'long_timelines', label: 'Long time-to-value for ML', score: 4 },
                { value: 'value_realization', label: 'Difficulty measuring value delivery', score: 4 },
                { value: 'stakeholder_frustration', label: 'Stakeholder frustration with ML', score: 4 }
              ]
            }
          ],
          commentBox: {
            label: 'Notes',
            placeholder: 'Describe challenges in productionizing ML models...'
          }
        },
        {
          id: 'ml_scalability',
          question: 'How scalable is your process for onboarding new ML use cases across business domains?',
          perspectives: [
            {
              id: 'current_state',
              label: 'Current State',
              type: 'single_choice',
              options: generateMaturityOptions('ml_lifecycle')
            },
            {
              id: 'future_state',
              label: 'Future State Vision',
              type: 'single_choice',
              options: generateMaturityOptions('ml_lifecycle')
            },
            {
              id: 'technical_pain',
              label: 'Technical Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'custom_solutions', label: 'Every use case requires custom solution', score: 4 },
                { value: 'platform_gaps', label: 'ML platform capability gaps', score: 4 },
                { value: 'resource_constraints', label: 'Resource and infrastructure constraints', score: 4 },
                { value: 'knowledge_silos', label: 'Knowledge silos across teams', score: 3 },
                { value: 'tooling_fragmentation', label: 'Fragmented ML tooling', score: 3 }
              ]
            },
            {
              id: 'business_pain',
              label: 'Business Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'limited_ml_adoption', label: 'Limited ML adoption across organization', score: 4 },
                { value: 'long_onboarding', label: 'Long onboarding time for new use cases', score: 4 },
                { value: 'team_bottleneck', label: 'ML team as bottleneck', score: 4 },
                { value: 'missed_opportunities', label: 'Missed ML opportunities', score: 4 },
                { value: 'competitive_lag', label: 'Competitive lag in AI/ML capabilities', score: 5 }
              ]
            }
          ],
          commentBox: {
            label: 'Notes',
            placeholder: 'Share details about scaling ML across the organization...'
          }
        }
      ]
    }
  ]
};

module.exports = machineLearningPillar;
