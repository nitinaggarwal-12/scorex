// Pillar 3: Analytics & Business Intelligence
// 📊 Analytics & BI - Measure the maturity of analytic workloads, semantic layers, and reporting infrastructure.

const { generateMaturityOptions } = require('../standardMaturityLevels');

const analyticsBIPillar = {
  id: 'analytics_bi',
  name: '📊 Analytics',
  description: 'Measure the maturity of analytic workloads, semantic layers, and reporting infrastructure.',
  goal: 'Measure the maturity of analytic workloads, semantic layers, and reporting infrastructure.',
  dimensions: [
    {
      id: 'analytic_performance',
      name: 'Analytic Performance',
      questions: [
        {
          id: 'performance_consistency',
          question: 'How consistently do your analytic workloads meet expected response times within Databricks?',
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
                { value: 'slow_queries', label: 'Slow query execution times', score: 4 },
                { value: 'inconsistent_performance', label: 'Inconsistent query performance', score: 4 },
                { value: 'resource_contention', label: 'Resource contention issues', score: 4 },
                { value: 'optimization_difficulty', label: 'Difficult query optimization', score: 3 },
                { value: 'monitoring_gaps', label: 'Limited performance monitoring', score: 3 }
              ]
            },
            {
              id: 'business_pain',
              label: 'Business Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'user_frustration', label: 'User frustration with slow queries', score: 4 },
                { value: 'delayed_insights', label: 'Delayed business insights', score: 4 },
                { value: 'report_timeouts', label: 'Dashboard and report timeouts', score: 4 },
                { value: 'adoption_barriers', label: 'Barriers to analytics adoption', score: 4 },
                { value: 'competitive_lag', label: 'Competitive lag from slow analytics', score: 4 }
              ]
            }
          ],
          commentBox: {
            label: 'Notes',
            placeholder: 'Describe your analytic performance challenges and SLAs...'
          }
        },
        {
          id: 'optimization_approach',
          question: 'How structured is your approach to tuning and optimizing queries and datasets?',
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
                { value: 'ad_hoc_optimization', label: 'Ad-hoc, reactive optimization only', score: 3 },
                { value: 'lack_of_tools', label: 'Lack of optimization tools and guidance', score: 4 },
                { value: 'query_complexity', label: 'Complex query patterns difficult to optimize', score: 4 },
                { value: 'indexing_gaps', label: 'Inadequate indexing and partitioning', score: 4 },
                { value: 'knowledge_gaps', label: 'Team knowledge gaps in optimization', score: 3 }
              ]
            },
            {
              id: 'business_pain',
              label: 'Business Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'high_compute_costs', label: 'High compute costs from inefficiency', score: 4 },
                { value: 'poor_user_experience', label: 'Poor user experience', score: 4 },
                { value: 'limited_scalability', label: 'Limited scalability for users', score: 4 },
                { value: 'optimization_delays', label: 'Long delays for optimization work', score: 3 },
                { value: 'reactive_approach', label: 'Reactive vs proactive optimization', score: 3 }
              ]
            }
          ],
          commentBox: {
            label: 'Notes',
            placeholder: 'Share details about your query optimization practices...'
          }
        }
      ]
    },
    {
      id: 'semantic_layer',
      name: 'Semantic Layer & Metrics',
      questions: [
        {
          id: 'metrics_consistency',
          question: 'How unified are your data definitions, measures, and business rules across analytical teams?',
          perspectives: [
            {
              id: 'current_state',
              label: 'Current State',
              type: 'single_choice',
              options: generateMaturityOptions('semantic')
            },
            {
              id: 'future_state',
              label: 'Future State Vision',
              type: 'single_choice',
              options: generateMaturityOptions('semantic')
            },
            {
              id: 'technical_pain',
              label: 'Technical Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'metric_inconsistency', label: 'Inconsistent metric definitions', score: 4 },
                { value: 'no_shared_layer', label: 'No shared semantic layer', score: 4 },
                { value: 'duplicate_logic', label: 'Duplicate calculation logic', score: 3 },
                { value: 'version_confusion', label: 'Confusion over metric versions', score: 4 },
                { value: 'documentation_gaps', label: 'Poor metric documentation', score: 3 }
              ]
            },
            {
              id: 'business_pain',
              label: 'Business Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'conflicting_reports', label: 'Conflicting reports and dashboards', score: 5 },
                { value: 'trust_issues', label: 'Loss of trust in analytics', score: 5 },
                { value: 'decision_delays', label: 'Delayed decisions from reconciliation', score: 4 },
                { value: 'wasted_effort', label: 'Wasted effort on metric reconciliation', score: 3 },
                { value: 'compliance_risk', label: 'Compliance risk from inconsistency', score: 4 }
              ]
            }
          ],
          commentBox: {
            label: 'Notes',
            placeholder: 'Describe your semantic layer and metrics governance approach...'
          }
        },
        {
          id: 'data_discovery',
          question: 'How easily can analysts discover, reuse, and trust curated datasets within Databricks?',
          perspectives: [
            {
              id: 'current_state',
              label: 'Current State',
              type: 'single_choice',
              options: generateMaturityOptions('consumption')
            },
            {
              id: 'future_state',
              label: 'Future State Vision',
              type: 'single_choice',
              options: generateMaturityOptions('consumption')
            },
            {
              id: 'technical_pain',
              label: 'Technical Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'poor_discoverability', label: 'Difficult data discovery', score: 4 },
                { value: 'catalog_gaps', label: 'Incomplete data catalog', score: 4 },
                { value: 'unclear_lineage', label: 'Unclear data lineage', score: 4 },
                { value: 'access_complexity', label: 'Complex data access procedures', score: 3 },
                { value: 'quality_uncertainty', label: 'Uncertainty about data quality', score: 4 }
              ]
            },
            {
              id: 'business_pain',
              label: 'Business Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'analyst_inefficiency', label: 'Analyst time wasted searching for data', score: 4 },
                { value: 'duplicate_work', label: 'Duplicate data preparation work', score: 3 },
                { value: 'low_reuse', label: 'Low reuse of curated datasets', score: 3 },
                { value: 'trust_deficit', label: 'Lack of trust in available data', score: 4 },
                { value: 'onboarding_delays', label: 'Slow onboarding for new analysts', score: 3 }
              ]
            }
          ],
          commentBox: {
            label: 'Notes',
            placeholder: 'Share details about data discovery and catalog challenges...'
          }
        }
      ]
    },
    {
      id: 'bi_reporting',
      name: 'BI & Reporting',
      questions: [
        {
          id: 'dashboard_integration',
          question: 'How well integrated are your dashboards and reporting tools with your Databricks Lakehouse?',
          perspectives: [
            {
              id: 'current_state',
              label: 'Current State',
              type: 'single_choice',
              options: generateMaturityOptions('visualization')
            },
            {
              id: 'future_state',
              label: 'Future State Vision',
              type: 'single_choice',
              options: generateMaturityOptions('visualization')
            },
            {
              id: 'technical_pain',
              label: 'Technical Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'integration_complexity', label: 'Complex BI tool integration', score: 4 },
                { value: 'performance_issues', label: 'Poor dashboard performance', score: 4 },
                { value: 'data_extracts', label: 'Dependence on data extracts', score: 3 },
                { value: 'refresh_delays', label: 'Slow dashboard refresh times', score: 4 },
                { value: 'limited_interactivity', label: 'Limited dashboard interactivity', score: 3 }
              ]
            },
            {
              id: 'business_pain',
              label: 'Business Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'stale_dashboards', label: 'Stale dashboard data', score: 4 },
                { value: 'user_frustration', label: 'User frustration with BI tools', score: 4 },
                { value: 'limited_adoption', label: 'Limited dashboard adoption', score: 4 },
                { value: 'reporting_delays', label: 'Delayed reporting cycles', score: 4 },
                { value: 'cost_overhead', label: 'High BI licensing and infrastructure costs', score: 3 }
              ]
            }
          ],
          commentBox: {
            label: 'Notes',
            placeholder: 'Describe your BI tool integration and dashboard challenges...'
          }
        },
        {
          id: 'reporting_governance',
          question: 'How standardized are refresh schedules, KPI definitions, and report governance?',
          perspectives: [
            {
              id: 'current_state',
              label: 'Current State',
              type: 'single_choice',
              options: generateMaturityOptions('visualization')
            },
            {
              id: 'future_state',
              label: 'Future State Vision',
              type: 'single_choice',
              options: generateMaturityOptions('visualization')
            },
            {
              id: 'technical_pain',
              label: 'Technical Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'inconsistent_schedules', label: 'Inconsistent refresh schedules', score: 3 },
                { value: 'kpi_proliferation', label: 'KPI definition proliferation', score: 4 },
                { value: 'version_control', label: 'Poor report version control', score: 3 },
                { value: 'access_management', label: 'Complex report access management', score: 3 },
                { value: 'audit_trails', label: 'Inadequate audit trails', score: 4 }
              ]
            },
            {
              id: 'business_pain',
              label: 'Business Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'conflicting_kpis', label: 'Conflicting KPI values', score: 5 },
                { value: 'report_sprawl', label: 'Uncontrolled report sprawl', score: 3 },
                { value: 'compliance_gaps', label: 'Compliance and audit gaps', score: 4 },
                { value: 'maintenance_burden', label: 'High report maintenance burden', score: 3 },
                { value: 'trust_erosion', label: 'Erosion of trust in reports', score: 4 }
              ]
            }
          ],
          commentBox: {
            label: 'Notes',
            placeholder: 'Share details about reporting governance and standards...'
          }
        }
      ]
    },
    {
      id: 'self_service_analytics',
      name: 'Self-Service Analytics',
      questions: [
        {
          id: 'user_empowerment',
          question: 'How empowered are business users to perform ad-hoc analysis directly in Databricks?',
          perspectives: [
            {
              id: 'current_state',
              label: 'Current State',
              type: 'single_choice',
              options: generateMaturityOptions('consumption')
            },
            {
              id: 'future_state',
              label: 'Future State Vision',
              type: 'single_choice',
              options: generateMaturityOptions('consumption')
            },
            {
              id: 'technical_pain',
              label: 'Technical Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'tool_complexity', label: 'Tools too complex for business users', score: 4 },
                { value: 'access_barriers', label: 'Barriers to data access', score: 4 },
                { value: 'training_gaps', label: 'Insufficient user training', score: 3 },
                { value: 'limited_tooling', label: 'Limited self-service tooling', score: 4 },
                { value: 'support_burden', label: 'High support burden for analysts', score: 3 }
              ]
            },
            {
              id: 'business_pain',
              label: 'Business Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'analyst_bottleneck', label: 'Analyst bottleneck for insights', score: 4 },
                { value: 'slow_decisions', label: 'Slow decision-making cycles', score: 4 },
                { value: 'low_data_literacy', label: 'Low organizational data literacy', score: 3 },
                { value: 'missed_opportunities', label: 'Missed opportunities from limited access', score: 4 },
                { value: 'user_frustration', label: 'User frustration with dependence on IT', score: 4 }
              ]
            }
          ],
          commentBox: {
            label: 'Notes',
            placeholder: 'Describe self-service analytics capabilities and challenges...'
          }
        },
        {
          id: 'governed_autonomy',
          question: 'How effectively do you balance autonomy with governance in your self-service environment?',
          perspectives: [
            {
              id: 'current_state',
              label: 'Current State',
              type: 'single_choice',
              options: generateMaturityOptions('consumption')
            },
            {
              id: 'future_state',
              label: 'Future State Vision',
              type: 'single_choice',
              options: generateMaturityOptions('consumption')
            },
            {
              id: 'technical_pain',
              label: 'Technical Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'security_gaps', label: 'Security gaps in self-service', score: 5 },
                { value: 'wild_west_access', label: '"Wild west" data access', score: 4 },
                { value: 'quality_control', label: 'Lack of quality control', score: 4 },
                { value: 'audit_challenges', label: 'Difficult usage auditing', score: 4 },
                { value: 'policy_enforcement', label: 'Weak policy enforcement', score: 4 }
              ]
            },
            {
              id: 'business_pain',
              label: 'Business Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'compliance_risk', label: 'Compliance risk from ungoverned access', score: 5 },
                { value: 'data_misuse', label: 'Risk of data misuse', score: 5 },
                { value: 'inconsistent_analysis', label: 'Inconsistent analysis across teams', score: 4 },
                { value: 'regulatory_exposure', label: 'Regulatory exposure', score: 5 },
                { value: 'trust_issues', label: 'Trust issues from varying results', score: 4 }
              ]
            }
          ],
          commentBox: {
            label: 'Notes',
            placeholder: 'Share details about balancing self-service with governance...'
          }
        }
      ]
    },
    {
      id: 'data_sharing',
      name: 'Data Sharing & Collaboration',
      questions: [
        {
          id: 'external_sharing',
          question: 'How easily can users or partners access and share governed datasets through Databricks?',
          perspectives: [
            {
              id: 'current_state',
              label: 'Current State',
              type: 'single_choice',
              options: generateMaturityOptions('collaboration')
            },
            {
              id: 'future_state',
              label: 'Future State Vision',
              type: 'single_choice',
              options: generateMaturityOptions('collaboration')
            },
            {
              id: 'technical_pain',
              label: 'Technical Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'sharing_complexity', label: 'Complex data sharing processes', score: 4 },
                { value: 'security_concerns', label: 'Security concerns with external sharing', score: 5 },
                { value: 'format_compatibility', label: 'Data format compatibility issues', score: 3 },
                { value: 'access_provisioning', label: 'Slow access provisioning', score: 4 },
                { value: 'tracking_gaps', label: 'Inadequate usage tracking', score: 4 }
              ]
            },
            {
              id: 'business_pain',
              label: 'Business Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'partner_friction', label: 'Partner integration friction', score: 4 },
                { value: 'collaboration_barriers', label: 'Barriers to data collaboration', score: 4 },
                { value: 'revenue_impact', label: 'Lost revenue from sharing limitations', score: 4 },
                { value: 'competitive_disadvantage', label: 'Competitive disadvantage', score: 4 },
                { value: 'compliance_risk', label: 'Compliance risk from ad-hoc sharing', score: 5 }
              ]
            }
          ],
          commentBox: {
            label: 'Notes',
            placeholder: 'Describe data sharing and external collaboration challenges...'
          }
        },
        {
          id: 'cross_domain_analytics',
          question: 'How well does your platform support cross-domain or cross-system analytics?',
          perspectives: [
            {
              id: 'current_state',
              label: 'Current State',
              type: 'single_choice',
              options: generateMaturityOptions('collaboration')
            },
            {
              id: 'future_state',
              label: 'Future State Vision',
              type: 'single_choice',
              options: generateMaturityOptions('collaboration')
            },
            {
              id: 'technical_pain',
              label: 'Technical Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'data_silos', label: 'Persistent data silos', score: 4 },
                { value: 'integration_complexity', label: 'Complex cross-system integration', score: 4 },
                { value: 'join_performance', label: 'Poor performance for cross-domain joins', score: 4 },
                { value: 'schema_conflicts', label: 'Schema and semantic conflicts', score: 3 },
                { value: 'governance_gaps', label: 'Governance gaps across domains', score: 4 }
              ]
            },
            {
              id: 'business_pain',
              label: 'Business Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'limited_insights', label: 'Limited cross-functional insights', score: 4 },
                { value: 'integration_delays', label: 'Long delays for integrated analysis', score: 4 },
                { value: 'opportunity_cost', label: 'Opportunity cost from siloed data', score: 4 },
                { value: 'decision_friction', label: 'Friction in cross-domain decisions', score: 4 },
                { value: 'strategic_limitations', label: 'Strategic limitations from data isolation', score: 5 }
              ]
            }
          ],
          commentBox: {
            label: 'Notes',
            placeholder: 'Share details about cross-domain analytics and integration...'
          }
        }
      ]
    }
  ]
};

module.exports = analyticsBIPillar;
