// Pillar 1: Platform & Governance
// 🧱 Platform & Governance - Assess how well the Databricks foundation is secured, scalable, and governed.

const { generateMaturityOptions } = require('../standardMaturityLevels');

const platformGovernancePillar = {
  id: 'platform_governance',
  name: '🧱 Platform',
  description: 'Assess how well the Databricks foundation is secured, scalable, and governed.',
  goal: 'Assess how well the Databricks foundation is secured, scalable, and governed.',
  dimensions: [
    {
      id: 'environment_architecture',
      name: 'Environment Architecture & Scalability',
      questions: [
        {
          id: 'env_standardization',
          question: 'How standardized and isolated are your Databricks environments across development, staging, and production?',
          perspectives: [
            {
              id: 'current_state',
              label: 'Current State',
              type: 'single_choice',
              options: generateMaturityOptions('environment')
            },
            {
              id: 'future_state',
              label: 'Future State Vision',
              type: 'single_choice',
              options: generateMaturityOptions('environment')
            },
            {
              id: 'technical_pain',
              label: 'Technical Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'inconsistent_configs', label: 'Inconsistent environment configurations', score: 3 },
                { value: 'manual_provisioning', label: 'Manual environment provisioning', score: 4 },
                { value: 'poor_isolation', label: 'Poor environment isolation', score: 5 },
                { value: 'deployment_issues', label: 'Deployment consistency issues', score: 4 },
                { value: 'resource_conflicts', label: 'Resource conflicts between environments', score: 3 }
              ]
            },
            {
              id: 'business_pain',
              label: 'Business Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'slow_deployment', label: 'Slow time-to-market for new features', score: 4 },
                { value: 'environment_costs', label: 'High environment management costs', score: 3 },
                { value: 'team_bottlenecks', label: 'Team bottlenecks in environment access', score: 4 },
                { value: 'quality_issues', label: 'Quality issues from environment differences', score: 5 },
                { value: 'compliance_risks', label: 'Compliance risks from inconsistency', score: 5 }
              ]
            }
          ],
          commentBox: {
            label: 'Notes',
            placeholder: 'Share specific details about your environment architecture challenges or goals...'
          }
        },
        {
          id: 'scaling_effectiveness',
          question: 'How effectively does your current setup scale to serve multiple data, analytics, and AI teams?',
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
                { value: 'resource_contention', label: 'Resource contention between teams', score: 4 },
                { value: 'performance_degradation', label: 'Performance degradation under load', score: 4 },
                { value: 'complex_scaling', label: 'Complex manual scaling processes', score: 3 },
                { value: 'infrastructure_limits', label: 'Infrastructure capacity limits', score: 4 },
                { value: 'monitoring_gaps', label: 'Inadequate scaling monitoring', score: 3 }
              ]
            },
            {
              id: 'business_pain',
              label: 'Business Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'team_blocking', label: 'Teams blocked waiting for resources', score: 5 },
                { value: 'project_delays', label: 'Project delays due to scaling issues', score: 4 },
                { value: 'high_costs', label: 'High costs from over-provisioning', score: 3 },
                { value: 'poor_utilization', label: 'Poor resource utilization', score: 3 },
                { value: 'competitive_disadvantage', label: 'Competitive disadvantage from slow scaling', score: 5 },
              ]
            }
          ],
          commentBox: {
            label: 'Notes',
            placeholder: 'Describe your scaling challenges and team growth plans...'
          }
        }
      ]
    },
    {
      id: 'identity_security',
      name: 'Identity, Security & Access Control',
      questions: [
        {
          id: 'auth_consistency',
          question: 'How consistent are your authentication and access-control practices across all Databricks workspaces?',
          perspectives: [
            {
              id: 'current_state',
              label: 'Current State',
              type: 'single_choice',
              options: generateMaturityOptions('authentication')
            },
            {
              id: 'future_state',
              label: 'Future State Vision',
              type: 'single_choice',
              options: generateMaturityOptions('authentication')
            },
            {
              id: 'technical_pain',
              label: 'Technical Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'auth_complexity', label: 'Complex authentication setup', score: 3 },
                { value: 'access_management', label: 'Difficult access management', score: 4 },
                { value: 'security_gaps', label: 'Security policy gaps', score: 5 },
                { value: 'audit_trails', label: 'Incomplete audit trails', score: 4 },
                { value: 'integration_issues', label: 'Identity provider integration issues', score: 3 },
              ]
            },
            {
              id: 'business_pain',
              label: 'Business Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'security_breaches', label: 'Risk of security breaches', score: 5 },
                { value: 'compliance_violations', label: 'Compliance violations', score: 5 },
                { value: 'access_delays', label: 'Delays in granting access', score: 3 },
                { value: 'admin_overhead', label: 'High administrative overhead', score: 3 },
                { value: 'user_frustration', label: 'User frustration with access', score: 2 },
              ]
            }
          ],
          commentBox: {
            label: 'Notes',
            placeholder: 'Share details about your authentication and access control setup...'
          }
        },
        {
          id: 'security_controls',
          question: 'How well do your security controls protect sensitive data and enforce least-privilege principles?',
          perspectives: [
            {
              id: 'current_state',
              label: 'Current State',
              type: 'single_choice',
              options: generateMaturityOptions('security')
            },
            {
              id: 'future_state',
              label: 'Future State Vision',
              type: 'single_choice',
              options: generateMaturityOptions('security')
            },
            {
              id: 'technical_pain',
              label: 'Technical Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'data_exposure', label: 'Risk of sensitive data exposure', score: 5 },
                { value: 'over_privileged', label: 'Over-privileged user access', score: 4 },
                { value: 'encryption_gaps', label: 'Encryption implementation gaps', score: 4 },
                { value: 'monitoring_blind_spots', label: 'Security monitoring blind spots', score: 4 },
                { value: 'policy_enforcement', label: 'Inconsistent policy enforcement', score: 3 },
              ]
            },
            {
              id: 'business_pain',
              label: 'Business Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'regulatory_risk', label: 'Regulatory compliance risk', score: 5 },
                { value: 'data_breaches', label: 'Risk of costly data breaches', score: 5 },
                { value: 'customer_trust', label: 'Customer trust concerns', score: 4 },
                { value: 'audit_failures', label: 'Failed security audits', score: 4 },
                { value: 'business_disruption', label: 'Business disruption from security issues', score: 4 },
              ]
            }
          ],
          commentBox: {
            label: 'Notes',
            placeholder: 'Describe your data protection and security control challenges...'
          }
        }
      ]
    },
    {
      id: 'governance_compliance',
      name: 'Governance & Compliance',
      questions: [
        {
          id: 'governance_centralization',
          question: 'How centralized and consistent are your governance, lineage, and policy enforcement practices in Databricks?',
          perspectives: [
            {
              id: 'current_state',
              label: 'Current State',
              type: 'single_choice',
              options: generateMaturityOptions('governance')
            },
            {
              id: 'future_state',
              label: 'Future State Vision',
              type: 'single_choice',
              options: generateMaturityOptions('governance')
            },
            {
              id: 'technical_pain',
              label: 'Technical Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'policy_gaps', label: 'Inconsistent policy enforcement', score: 4 },
                { value: 'lineage_tracking', label: 'Poor data lineage tracking', score: 4 },
                { value: 'manual_processes', label: 'Manual governance processes', score: 3 },
                { value: 'metadata_management', label: 'Inadequate metadata management', score: 3 },
                { value: 'integration_complexity', label: 'Complex governance tool integration', score: 3 },
              ]
            },
            {
              id: 'business_pain',
              label: 'Business Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'compliance_failures', label: 'Compliance audit failures', score: 5 },
                { value: 'data_quality_issues', label: 'Data quality and trust issues', score: 4 },
                { value: 'regulatory_fines', label: 'Risk of regulatory fines', score: 5 },
                { value: 'operational_inefficiency', label: 'Operational inefficiencies', score: 3 },
                { value: 'decision_delays', label: 'Delayed decision making', score: 3 },
              ]
            }
          ],
          commentBox: {
            label: 'Notes',
            placeholder: 'Share details about your governance and policy enforcement approach...'
          }
        },
        {
          id: 'compliance_management',
          question: 'How effectively do you manage auditability and compliance for regulated datasets?',
          perspectives: [
            {
              id: 'current_state',
              label: 'Current State',
              type: 'single_choice',
              options: generateMaturityOptions('compliance')
            },
            {
              id: 'future_state',
              label: 'Future State Vision',
              type: 'single_choice',
              options: generateMaturityOptions('compliance')
            },
            {
              id: 'technical_pain',
              label: 'Technical Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'audit_complexity', label: 'Complex audit trail generation', score: 4 },
                { value: 'data_retention', label: 'Data retention policy enforcement', score: 3 },
                { value: 'reporting_gaps', label: 'Compliance reporting gaps', score: 4 },
                { value: 'change_tracking', label: 'Inadequate change tracking', score: 4 },
                { value: 'tool_integration', label: 'Compliance tool integration issues', score: 3 },
              ]
            },
            {
              id: 'business_pain',
              label: 'Business Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'audit_failures', label: 'Failed compliance audits', score: 5 },
                { value: 'regulatory_penalties', label: 'Regulatory penalties and fines', score: 5 },
                { value: 'audit_costs', label: 'High audit preparation costs', score: 3 },
                { value: 'business_risk', label: 'Business continuity risks', score: 4 },
                { value: 'reputation_damage', label: 'Reputation damage from violations', score: 4 },
              ]
            }
          ],
          commentBox: {
            label: 'Notes',
            placeholder: 'Describe your compliance requirements and audit challenges...'
          }
        }
      ]
    },
    {
      id: 'observability_monitoring',
      name: 'Observability & Monitoring',
      questions: [
        {
          id: 'visibility_comprehensiveness',
          question: 'How comprehensive is your visibility into Databricks job health, user activity, and platform utilization?',
          perspectives: [
            {
              id: 'current_state',
              label: 'Current State',
              type: 'single_choice',
              options: generateMaturityOptions('monitoring')
            },
            {
              id: 'future_state',
              label: 'Future State Vision',
              type: 'single_choice',
              options: generateMaturityOptions('monitoring')
            },
            {
              id: 'technical_pain',
              label: 'Technical Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'monitoring_gaps', label: 'Blind spots in monitoring coverage', score: 4 },
                { value: 'alert_noise', label: 'Too many false positive alerts', score: 3 },
                { value: 'metric_correlation', label: 'Difficulty correlating metrics', score: 3 },
                { value: 'performance_impact', label: 'Monitoring performance impact', score: 3 },
                { value: 'tool_fragmentation', label: 'Fragmented monitoring tools', score: 4 },
              ]
            },
            {
              id: 'business_pain',
              label: 'Business Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'unplanned_downtime', label: 'Unplanned system downtime', score: 5 },
                { value: 'slow_issue_resolution', label: 'Slow issue resolution', score: 4 },
                { value: 'user_impact', label: 'Unexpected user impact', score: 4 },
                { value: 'resource_waste', label: 'Resource waste from poor visibility', score: 3 },
                { value: 'sla_breaches', label: 'SLA breaches and penalties', score: 4 },
              ]
            }
          ],
          commentBox: {
            label: 'Notes',
            placeholder: 'Share details about your monitoring and observability setup...'
          }
        },
        {
          id: 'proactive_monitoring',
          question: 'How proactive is your approach to detecting, alerting, and resolving operational issues?',
          perspectives: [
            {
              id: 'current_state',
              label: 'Current State',
              type: 'single_choice',
              options: generateMaturityOptions('monitoring')
            },
            {
              id: 'future_state',
              label: 'Future State Vision',
              type: 'single_choice',
              options: generateMaturityOptions('monitoring')
            },
            {
              id: 'technical_pain',
              label: 'Technical Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'late_detection', label: 'Late issue detection', score: 4 },
                { value: 'manual_response', label: 'Manual issue response processes', score: 3 },
                { value: 'alert_fatigue', label: 'Alert fatigue from noise', score: 3 },
                { value: 'root_cause_analysis', label: 'Difficult root cause analysis', score: 4 },
                { value: 'escalation_delays', label: 'Delays in issue escalation', score: 3 },
              ]
            },
            {
              id: 'business_pain',
              label: 'Business Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'service_disruption', label: 'Frequent service disruptions', score: 5 },
                { value: 'customer_impact', label: 'Customer-facing impact', score: 5 },
                { value: 'operational_costs', label: 'High operational support costs', score: 3 },
                { value: 'team_burnout', label: 'Team burnout from firefighting', score: 4 },
                { value: 'missed_slas', label: 'Missed service level agreements', score: 4 },
              ]
            }
          ],
          commentBox: {
            label: 'Notes',
            placeholder: 'Describe your approach to proactive monitoring and issue resolution...'
          }
        }
      ]
    },
    {
      id: 'cost_management',
      name: 'Cost Management & Optimization',
      questions: [
        {
          id: 'cost_tracking',
          question: 'How effectively do you track Databricks usage and costs by team or project?',
          perspectives: [
            {
              id: 'current_state',
              label: 'Current State',
              type: 'single_choice',
              options: generateMaturityOptions('cost')
            },
            {
              id: 'future_state',
              label: 'Future State Vision',
              type: 'single_choice',
              options: generateMaturityOptions('cost')
            },
            {
              id: 'technical_pain',
              label: 'Technical Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'cost_attribution', label: 'Difficult cost attribution', score: 4 },
                { value: 'usage_visibility', label: 'Poor usage visibility', score: 3 },
                { value: 'reporting_complexity', label: 'Complex cost reporting', score: 3 },
                { value: 'tagging_inconsistency', label: 'Inconsistent resource tagging', score: 3 },
                { value: 'tool_limitations', label: 'Cost management tool limitations', score: 3 },
              ]
            },
            {
              id: 'business_pain',
              label: 'Business Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'budget_overruns', label: 'Frequent budget overruns', score: 4 },
                { value: 'cost_surprises', label: 'Unexpected cost spikes', score: 4 },
                { value: 'no_accountability', label: 'Lack of cost accountability', score: 3 },
                { value: 'inefficient_spending', label: 'Inefficient resource spending', score: 3 },
                { value: 'budget_planning', label: 'Difficult budget planning', score: 3 },
              ]
            }
          ],
          commentBox: {
            label: 'Notes',
            placeholder: 'Share details about your cost tracking and allocation challenges...'
          }
        },
        {
          id: 'optimization_practices',
          question: 'How consistently do you apply optimization and chargeback practices to control compute and storage spend?',
          perspectives: [
            {
              id: 'current_state',
              label: 'Current State',
              type: 'single_choice',
              options: generateMaturityOptions('cost')
            },
            {
              id: 'future_state',
              label: 'Future State Vision',
              type: 'single_choice',
              options: generateMaturityOptions('cost')
            },
            {
              id: 'technical_pain',
              label: 'Technical Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'optimization_complexity', label: 'Complex optimization processes', score: 3 },
                { value: 'resource_rightsizing', label: 'Difficult resource rightsizing', score: 4 },
                { value: 'automation_gaps', label: 'Lack of optimization automation', score: 3 },
                { value: 'performance_impact', label: 'Performance impact from optimization', score: 4 },
                { value: 'tool_integration', label: 'Poor tool integration for optimization', score: 3 },
              ]
            },
            {
              id: 'business_pain',
              label: 'Business Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'wasted_spend', label: 'Significant wasted cloud spend', score: 4 },
                { value: 'no_cost_discipline', label: 'Lack of cost discipline', score: 3 },
                { value: 'team_conflicts', label: 'Team conflicts over resource costs', score: 3 },
                { value: 'roi_unclear', label: 'Unclear ROI on data investments', score: 4 },
                { value: 'competitive_disadvantage', label: 'Cost disadvantage vs competitors', score: 4 },
              ]
            }
          ],
          commentBox: {
            label: 'Notes',
            placeholder: 'Describe your cost optimization and chargeback practices...'
          }
        }
      ]
    }
  ]
};

module.exports = platformGovernancePillar;
