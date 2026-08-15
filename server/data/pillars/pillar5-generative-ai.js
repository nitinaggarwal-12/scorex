// Pillar 5: Generative AI
// ✨ Generative AI - Evaluate readiness, architecture, and governance of GenAI initiatives.

const { generateMaturityOptions } = require('../standardMaturityLevels');

const generativeAIPillar = {
  id: 'generative_ai',
  name: '✨ GenAI',
  description: 'Evaluate readiness, architecture, and governance of GenAI initiatives.',
  goal: 'Evaluate readiness, architecture, and governance of GenAI initiatives.',
  dimensions: [
    {
      id: 'genai_strategy',
      name: 'GenAI Strategy & Readiness',
      questions: [
        {
          id: 'genai_vision',
          question: 'How aligned is your GenAI vision with your broader data and analytics strategy on Databricks?',
          perspectives: [
            {
              id: 'current_state',
              label: 'Current State',
              type: 'single_choice',
              options: generateMaturityOptions('genai_adoption')
            },
            {
              id: 'future_state',
              label: 'Future State Vision',
              type: 'single_choice',
              options: generateMaturityOptions('genai_adoption')
            },
            {
              id: 'technical_pain',
              label: 'Technical Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'no_strategy', label: 'No clear GenAI strategy', score: 4 },
                { value: 'disconnected_efforts', label: 'Disconnected from data strategy', score: 4 },
                { value: 'unclear_use_cases', label: 'Unclear priority use cases', score: 3 },
                { value: 'technology_uncertainty', label: 'Uncertainty about technology choices', score: 3 },
                { value: 'skills_gaps', label: 'Team skills and knowledge gaps', score: 4 }
              ]
            },
            {
              id: 'business_pain',
              label: 'Business Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'competitive_pressure', label: 'Competitive pressure to adopt GenAI', score: 4 },
                { value: 'unclear_roi', label: 'Unclear ROI from GenAI', score: 4 },
                { value: 'missed_opportunities', label: 'Missing GenAI opportunities', score: 4 },
                { value: 'budget_uncertainty', label: 'Budget and resource uncertainty', score: 3 },
                { value: 'stakeholder_expectations', label: 'Misaligned stakeholder expectations', score: 3 }
              ]
            }
          ],
          commentBox: {
            label: 'Notes',
            placeholder: 'Describe your GenAI vision and strategic alignment...'
          }
        },
        {
          id: 'use_case_definition',
          question: 'How clearly defined are your first set of GenAI use cases and their business objectives?',
          perspectives: [
            {
              id: 'current_state',
              label: 'Current State',
              type: 'single_choice',
              options: generateMaturityOptions('genai_adoption')
            },
            {
              id: 'future_state',
              label: 'Future State Vision',
              type: 'single_choice',
              options: generateMaturityOptions('genai_adoption')
            },
            {
              id: 'technical_pain',
              label: 'Technical Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'vague_requirements', label: 'Vague use case requirements', score: 3 },
                { value: 'unrealistic_expectations', label: 'Unrealistic technical expectations', score: 3 },
                { value: 'data_readiness', label: 'Data not ready for GenAI', score: 4 },
                { value: 'poc_challenges', label: 'Difficulty building POCs', score: 4 },
                { value: 'evaluation_gaps', label: 'No clear success metrics', score: 4 }
              ]
            },
            {
              id: 'business_pain',
              label: 'Business Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'scattered_efforts', label: 'Scattered GenAI efforts', score: 3 },
                { value: 'value_uncertainty', label: 'Uncertainty about business value', score: 4 },
                { value: 'prioritization_challenges', label: 'Difficulty prioritizing use cases', score: 3 },
                { value: 'resource_waste', label: 'Resources on low-value experiments', score: 3 },
                { value: 'stakeholder_confusion', label: 'Stakeholder confusion about GenAI', score: 3 }
              ]
            }
          ],
          commentBox: {
            label: 'Notes',
            placeholder: 'Share details about your GenAI use cases and objectives...'
          }
        }
      ]
    },
    {
      id: 'data_readiness',
      name: 'Data & Knowledge Readiness',
      questions: [
        {
          id: 'knowledge_sources',
          question: 'How prepared is your existing data landscape to support retrieval-based or context-aware applications?',
          perspectives: [
            {
              id: 'current_state',
              label: 'Current State',
              type: 'single_choice',
              options: generateMaturityOptions('genai_architecture')
            },
            {
              id: 'future_state',
              label: 'Future State Vision',
              type: 'single_choice',
              options: generateMaturityOptions('genai_architecture')
            },
            {
              id: 'technical_pain',
              label: 'Technical Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'unstructured_data', label: 'Unstructured data not accessible', score: 4 },
                { value: 'no_vector_search', label: 'No vector search capability', score: 4 },
                { value: 'data_quality', label: 'Poor data quality for GenAI', score: 4 },
                { value: 'chunking_challenges', label: 'Difficulty with data chunking and embedding', score: 3 },
                { value: 'integration_gaps', label: 'Gaps in data integration', score: 4 }
              ]
            },
            {
              id: 'business_pain',
              label: 'Business Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'limited_context', label: 'Limited context for GenAI applications', score: 4 },
                { value: 'hallucinations', label: 'High risk of model hallucinations', score: 4 },
                { value: 'poor_relevance', label: 'Poor response relevance', score: 4 },
                { value: 'data_prep_delays', label: 'Long delays for data preparation', score: 3 },
                { value: 'business_impact', label: 'Limited business impact from GenAI', score: 4 }
              ]
            }
          ],
          commentBox: {
            label: 'Notes',
            placeholder: 'Describe your data readiness for GenAI applications...'
          }
        },
        {
          id: 'knowledge_governance',
          question: 'How governed are your knowledge sources to ensure trust and consistency in GenAI outputs?',
          perspectives: [
            {
              id: 'current_state',
              label: 'Current State',
              type: 'single_choice',
              options: generateMaturityOptions('genai_governance')
            },
            {
              id: 'future_state',
              label: 'Future State Vision',
              type: 'single_choice',
              options: generateMaturityOptions('genai_governance')
            },
            {
              id: 'technical_pain',
              label: 'Technical Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'ungoverned_sources', label: 'Ungoverned knowledge sources', score: 4 },
                { value: 'version_control', label: 'No version control for knowledge', score: 4 },
                { value: 'quality_checks', label: 'No automated quality checks', score: 4 },
                { value: 'access_control', label: 'Inadequate access control', score: 4 },
                { value: 'lineage_gaps', label: 'No lineage for GenAI outputs', score: 3 }
              ]
            },
            {
              id: 'business_pain',
              label: 'Business Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'output_quality', label: 'Inconsistent output quality', score: 4 },
                { value: 'trust_issues', label: 'Low trust in GenAI outputs', score: 4 },
                { value: 'compliance_risk', label: 'Compliance and regulatory risk', score: 5 },
                { value: 'misinformation', label: 'Risk of spreading misinformation', score: 5 },
                { value: 'reputation_risk', label: 'Reputation risk from bad outputs', score: 5 }
              ]
            }
          ],
          commentBox: {
            label: 'Notes',
            placeholder: 'Share details about knowledge governance for GenAI...'
          }
        }
      ]
    },
    {
      id: 'genai_architecture',
      name: 'GenAI Architecture & Integration',
      questions: [
        {
          id: 'application_capability',
          question: 'How capable is your current setup of supporting chat-, summarization-, or document-understanding experiences?',
          perspectives: [
            {
              id: 'current_state',
              label: 'Current State',
              type: 'single_choice',
              options: generateMaturityOptions('genai_architecture')
            },
            {
              id: 'future_state',
              label: 'Future State Vision',
              type: 'single_choice',
              options: generateMaturityOptions('genai_architecture')
            },
            {
              id: 'technical_pain',
              label: 'Technical Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'no_infrastructure', label: 'No GenAI infrastructure', score: 4 },
                { value: 'api_limitations', label: 'API rate limits and latency', score: 3 },
                { value: 'scalability_issues', label: 'Scalability challenges', score: 4 },
                { value: 'cost_concerns', label: 'High inference costs', score: 4 },
                { value: 'integration_complexity', label: 'Complex integration patterns', score: 4 }
              ]
            },
            {
              id: 'business_pain',
              label: 'Business Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'slow_development', label: 'Slow GenAI application development', score: 4 },
                { value: 'user_experience', label: 'Poor user experience', score: 4 },
                { value: 'reliability_issues', label: 'Application reliability issues', score: 4 },
                { value: 'cost_overruns', label: 'Unexpected cost overruns', score: 4 },
                { value: 'competitive_lag', label: 'Falling behind competitors', score: 4 }
              ]
            }
          ],
          commentBox: {
            label: 'Notes',
            placeholder: 'Describe your GenAI application architecture and capabilities...'
          }
        },
        {
          id: 'integration_patterns',
          question: 'How standardized is your approach to integrating GenAI components with existing applications?',
          perspectives: [
            {
              id: 'current_state',
              label: 'Current State',
              type: 'single_choice',
              options: generateMaturityOptions('genai_integration')
            },
            {
              id: 'future_state',
              label: 'Future State Vision',
              type: 'single_choice',
              options: generateMaturityOptions('genai_integration')
            },
            {
              id: 'technical_pain',
              label: 'Technical Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'no_standards', label: 'No integration standards', score: 4 },
                { value: 'custom_solutions', label: 'Each integration is custom', score: 3 },
                { value: 'security_gaps', label: 'Security integration gaps', score: 5 },
                { value: 'error_handling', label: 'Poor error handling', score: 4 },
                { value: 'monitoring_gaps', label: 'Limited monitoring and logging', score: 4 }
              ]
            },
            {
              id: 'business_pain',
              label: 'Business Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'slow_integration', label: 'Slow integration cycles', score: 4 },
                { value: 'maintenance_burden', label: 'High maintenance burden', score: 3 },
                { value: 'inconsistent_ux', label: 'Inconsistent user experience', score: 3 },
                { value: 'scaling_challenges', label: 'Difficulty scaling GenAI adoption', score: 4 },
                { value: 'security_incidents', label: 'Risk of security incidents', score: 5 }
              ]
            }
          ],
          commentBox: {
            label: 'Notes',
            placeholder: 'Share details about GenAI integration patterns and standards...'
          }
        }
      ]
    },
    {
      id: 'genai_quality',
      name: 'GenAI Quality & Monitoring',
      questions: [
        {
          id: 'output_validation',
          question: 'How structured is your process for validating the accuracy, relevance, and tone of GenAI outputs?',
          perspectives: [
            {
              id: 'current_state',
              label: 'Current State',
              type: 'single_choice',
              options: generateMaturityOptions('genai_governance')
            },
            {
              id: 'future_state',
              label: 'Future State Vision',
              type: 'single_choice',
              options: generateMaturityOptions('genai_governance')
            },
            {
              id: 'technical_pain',
              label: 'Technical Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'no_validation', label: 'No systematic validation', score: 4 },
                { value: 'manual_review', label: 'Manual review only', score: 3 },
                { value: 'hallucination_detection', label: 'No hallucination detection', score: 4 },
                { value: 'quality_metrics', label: 'Lack of quality metrics', score: 4 },
                { value: 'testing_gaps', label: 'Inadequate testing frameworks', score: 4 }
              ]
            },
            {
              id: 'business_pain',
              label: 'Business Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'output_quality', label: 'Inconsistent output quality', score: 4 },
                { value: 'user_trust', label: 'Low user trust', score: 4 },
                { value: 'business_risk', label: 'Business risk from inaccurate outputs', score: 5 },
                { value: 'manual_overhead', label: 'High manual validation overhead', score: 3 },
                { value: 'reputation_damage', label: 'Reputation damage from errors', score: 5 }
              ]
            }
          ],
          commentBox: {
            label: 'Notes',
            placeholder: 'Describe your GenAI output validation and quality processes...'
          }
        },
        {
          id: 'genai_monitoring',
          question: 'How do you monitor performance drift or content risks in generative applications?',
          perspectives: [
            {
              id: 'current_state',
              label: 'Current State',
              type: 'single_choice',
              options: generateMaturityOptions('genai_governance')
            },
            {
              id: 'future_state',
              label: 'Future State Vision',
              type: 'single_choice',
              options: generateMaturityOptions('genai_governance')
            },
            {
              id: 'technical_pain',
              label: 'Technical Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'no_monitoring', label: 'No production monitoring', score: 5 },
                { value: 'drift_detection', label: 'No drift detection', score: 4 },
                { value: 'content_safety', label: 'No automated content safety checks', score: 5 },
                { value: 'user_feedback', label: 'No user feedback loop', score: 3 },
                { value: 'alert_gaps', label: 'Inadequate alerting', score: 4 }
              ]
            },
            {
              id: 'business_pain',
              label: 'Business Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'silent_degradation', label: 'Silent quality degradation', score: 5 },
                { value: 'safety_incidents', label: 'Content safety incidents', score: 5 },
                { value: 'user_complaints', label: 'Increase in user complaints', score: 4 },
                { value: 'brand_risk', label: 'Brand and reputation risk', score: 5 },
                { value: 'reactive_approach', label: 'Reactive vs proactive monitoring', score: 4 }
              ]
            }
          ],
          commentBox: {
            label: 'Notes',
            placeholder: 'Share details about GenAI monitoring and content safety...'
          }
        }
      ]
    },
    {
      id: 'genai_governance',
      name: 'GenAI Governance & Ethics',
      questions: [
        {
          id: 'ethical_guardrails',
          question: 'How defined are your ethical, security, and compliance guardrails for GenAI use cases?',
          perspectives: [
            {
              id: 'current_state',
              label: 'Current State',
              type: 'single_choice',
              options: generateMaturityOptions('genai_governance')
            },
            {
              id: 'future_state',
              label: 'Future State Vision',
              type: 'single_choice',
              options: generateMaturityOptions('genai_governance')
            },
            {
              id: 'technical_pain',
              label: 'Technical Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'no_guardrails', label: 'No technical guardrails', score: 5 },
                { value: 'pii_detection', label: 'No automated PII detection', score: 5 },
                { value: 'content_filtering', label: 'No content filtering', score: 5 },
                { value: 'bias_detection', label: 'No bias detection', score: 4 },
                { value: 'policy_enforcement', label: 'Manual policy enforcement', score: 4 }
              ]
            },
            {
              id: 'business_pain',
              label: 'Business Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'compliance_risk', label: 'Regulatory compliance risk', score: 5 },
                { value: 'data_breaches', label: 'Risk of data breaches', score: 5 },
                { value: 'ethical_concerns', label: 'Ethical concerns from stakeholders', score: 4 },
                { value: 'legal_exposure', label: 'Legal exposure', score: 5 },
                { value: 'adoption_barriers', label: 'Barriers to GenAI adoption', score: 4 }
              ]
            }
          ],
          commentBox: {
            label: 'Notes',
            placeholder: 'Describe your GenAI ethical and compliance guardrails...'
          }
        },
        {
          id: 'genai_transparency',
          question: 'How transparent and traceable are GenAI interactions and responses across your Databricks footprint?',
          perspectives: [
            {
              id: 'current_state',
              label: 'Current State',
              type: 'single_choice',
              options: generateMaturityOptions('genai_governance')
            },
            {
              id: 'future_state',
              label: 'Future State Vision',
              type: 'single_choice',
              options: generateMaturityOptions('genai_governance')
            },
            {
              id: 'technical_pain',
              label: 'Technical Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'no_logging', label: 'No interaction logging', score: 4 },
                { value: 'lineage_gaps', label: 'No output lineage tracking', score: 4 },
                { value: 'audit_trails', label: 'Incomplete audit trails', score: 4 },
                { value: 'explainability', label: 'Limited output explainability', score: 4 },
                { value: 'user_attribution', label: 'Poor user attribution', score: 3 }
              ]
            },
            {
              id: 'business_pain',
              label: 'Business Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'accountability_gaps', label: 'Lack of accountability', score: 4 },
                { value: 'audit_failures', label: 'Failed compliance audits', score: 5 },
                { value: 'debugging_difficulty', label: 'Difficult to debug issues', score: 4 },
                { value: 'trust_deficit', label: 'User trust deficit', score: 4 },
                { value: 'regulatory_risk', label: 'Regulatory risk from opacity', score: 5 }
              ]
            }
          ],
          commentBox: {
            label: 'Notes',
            placeholder: 'Share details about GenAI transparency and traceability...'
          }
        }
      ]
    }
  ]
};

module.exports = generativeAIPillar;
