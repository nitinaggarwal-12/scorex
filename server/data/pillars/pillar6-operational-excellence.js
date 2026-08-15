// Pillar 6: Operational Excellence
// ⚡ Operational Excellence - Measure organizational readiness, enablement, cost discipline, and innovation culture.

const { generateMaturityOptions } = require('../standardMaturityLevels');

const operationalExcellencePillar = {
  id: 'operational_excellence',
  name: '⚡ Enablement',
  description: 'Measure organizational readiness, enablement, cost discipline, and innovation culture.',
  goal: 'Measure organizational readiness, enablement, cost discipline, and innovation culture.',
  dimensions: [
    {
      id: 'center_of_excellence',
      name: 'Center of Excellence (CoE)',
      questions: [
        {
          id: 'coe_structure',
          question: 'How formally is your CoE structured to define Databricks standards and best practices?',
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
                { value: 'no_coe', label: 'No formal CoE structure', score: 4 },
                { value: 'unclear_charter', label: 'Unclear CoE charter and responsibilities', score: 3 },
                { value: 'resource_constraints', label: 'Insufficient CoE resources', score: 3 },
                { value: 'standards_gaps', label: 'Incomplete standards and guidelines', score: 4 },
                { value: 'adoption_challenges', label: 'Difficulty driving standards adoption', score: 4 }
              ]
            },
            {
              id: 'business_pain',
              label: 'Business Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'inconsistent_practices', label: 'Inconsistent practices across teams', score: 4 },
                { value: 'knowledge_silos', label: 'Knowledge silos and duplication', score: 3 },
                { value: 'slow_adoption', label: 'Slow adoption of best practices', score: 4 },
                { value: 'quality_issues', label: 'Quality and reliability issues', score: 4 },
                { value: 'innovation_barriers', label: 'Barriers to innovation', score: 4 }
              ]
            }
          ],
          commentBox: {
            label: 'Notes',
            placeholder: 'Describe your CoE structure and maturity...'
          }
        },
        {
          id: 'coe_effectiveness',
          question: 'How effectively does it drive governance, architecture, and enablement across teams?',
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
                { value: 'low_influence', label: 'Limited CoE influence', score: 4 },
                { value: 'communication_gaps', label: 'Poor communication with teams', score: 3 },
                { value: 'tooling_gaps', label: 'Lack of enablement tools', score: 3 },
                { value: 'feedback_loops', label: 'Weak feedback loops', score: 3 },
                { value: 'measurement_gaps', label: 'Difficulty measuring CoE impact', score: 3 }
              ]
            },
            {
              id: 'business_pain',
              label: 'Business Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'governance_gaps', label: 'Governance gaps and blind spots', score: 4 },
                { value: 'architecture_debt', label: 'Growing technical debt', score: 4 },
                { value: 'team_confusion', label: 'Team confusion about standards', score: 3 },
                { value: 'onboarding_delays', label: 'Long onboarding for new teams', score: 3 },
                { value: 'roi_unclear', label: 'Unclear ROI from CoE investment', score: 3 }
              ]
            }
          ],
          commentBox: {
            label: 'Notes',
            placeholder: 'Share details about CoE effectiveness and impact...'
          }
        }
      ]
    },
    {
      id: 'collaboration_culture',
      name: 'Collaboration & Knowledge Sharing',
      questions: [
        {
          id: 'collaboration_strength',
          question: 'How strong is the internal collaboration and knowledge-sharing culture around Databricks usage?',
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
                { value: 'siloed_teams', label: 'Siloed teams and knowledge', score: 4 },
                { value: 'no_sharing_platform', label: 'No knowledge sharing platform', score: 3 },
                { value: 'documentation_gaps', label: 'Poor documentation practices', score: 3 },
                { value: 'code_reuse', label: 'Limited code/asset reuse', score: 3 },
                { value: 'learning_barriers', label: 'Barriers to learning from others', score: 3 }
              ]
            },
            {
              id: 'business_pain',
              label: 'Business Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'duplicate_work', label: 'Duplicate work across teams', score: 3 },
                { value: 'slow_problem_solving', label: 'Slow problem resolution', score: 4 },
                { value: 'innovation_lag', label: 'Limited innovation sharing', score: 3 },
                { value: 'onboarding_friction', label: 'Friction in team onboarding', score: 3 },
                { value: 'knowledge_loss', label: 'Knowledge loss from turnover', score: 4 }
              ]
            }
          ],
          commentBox: {
            label: 'Notes',
            placeholder: 'Describe your collaboration and knowledge sharing culture...'
          }
        },
        {
          id: 'asset_exchange',
          question: 'How frequently do practitioners exchange reusable assets or innovations?',
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
                { value: 'no_asset_catalog', label: 'No central asset catalog', score: 4 },
                { value: 'discovery_difficulty', label: 'Difficult to discover assets', score: 3 },
                { value: 'version_control', label: 'Inconsistent version control', score: 3 },
                { value: 'quality_standards', label: 'No quality standards for shared assets', score: 3 },
                { value: 'documentation_gaps', label: 'Poor asset documentation', score: 3 }
              ]
            },
            {
              id: 'business_pain',
              label: 'Business Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'low_reuse', label: 'Low asset reuse rates', score: 3 },
                { value: 'reinvention', label: 'Constant reinvention of solutions', score: 3 },
                { value: 'velocity_impact', label: 'Negative impact on team velocity', score: 4 },
                { value: 'quality_inconsistency', label: 'Inconsistent quality across teams', score: 3 },
                { value: 'maintenance_burden', label: 'High maintenance burden', score: 3 }
              ]
            }
          ],
          commentBox: {
            label: 'Notes',
            placeholder: 'Share details about asset sharing and reuse practices...'
          }
        }
      ]
    },
    {
      id: 'enablement_training',
      name: 'Enablement & Training',
      questions: [
        {
          id: 'training_programs',
          question: 'How comprehensive are your Databricks enablement programs for engineers, analysts, and data scientists?',
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
                { value: 'no_formal_training', label: 'No formal training programs', score: 4 },
                { value: 'outdated_content', label: 'Outdated training content', score: 3 },
                { value: 'limited_coverage', label: 'Limited role coverage', score: 3 },
                { value: 'access_barriers', label: 'Barriers to training access', score: 3 },
                { value: 'hands_on_gaps', label: 'Lack of hands-on practice', score: 3 }
              ]
            },
            {
              id: 'business_pain',
              label: 'Business Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'skills_gaps', label: 'Persistent skills gaps', score: 4 },
                { value: 'slow_adoption', label: 'Slow platform adoption', score: 4 },
                { value: 'support_burden', label: 'High support burden on experts', score: 3 },
                { value: 'underutilization', label: 'Platform underutilization', score: 4 },
                { value: 'employee_frustration', label: 'Employee frustration', score: 3 }
              ]
            }
          ],
          commentBox: {
            label: 'Notes',
            placeholder: 'Describe your training and enablement programs...'
          }
        },
        {
          id: 'continuous_learning',
          question: 'How regularly are new capabilities introduced through structured learning or workshops?',
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
                { value: 'no_updates', label: 'No regular capability updates', score: 4 },
                { value: 'communication_gaps', label: 'Poor communication about new features', score: 3 },
                { value: 'demo_gaps', label: 'Lack of practical demonstrations', score: 3 },
                { value: 'feedback_loops', label: 'No feedback loops', score: 3 },
                { value: 'resource_constraints', label: 'Resource constraints for training', score: 3 }
              ]
            },
            {
              id: 'business_pain',
              label: 'Business Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'capability_unawareness', label: 'Teams unaware of new capabilities', score: 4 },
                { value: 'missed_opportunities', label: 'Missed efficiency opportunities', score: 4 },
                { value: 'stale_practices', label: 'Stale practices and patterns', score: 3 },
                { value: 'competitive_lag', label: 'Competitive lag from slow adoption', score: 4 },
                { value: 'innovation_barriers', label: 'Barriers to innovation', score: 4 }
              ]
            }
          ],
          commentBox: {
            label: 'Notes',
            placeholder: 'Share details about continuous learning and capability updates...'
          }
        }
      ]
    },
    {
      id: 'cost_value',
      name: 'Cost-Value Alignment',
      questions: [
        {
          id: 'value_linkage',
          question: 'How clearly are Databricks costs linked to business value or productivity gains?',
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
                { value: 'no_tracking', label: 'No value tracking mechanisms', score: 4 },
                { value: 'attribution_gaps', label: 'Difficult cost-to-value attribution', score: 4 },
                { value: 'metric_gaps', label: 'Lack of productivity metrics', score: 3 },
                { value: 'reporting_complexity', label: 'Complex cost-value reporting', score: 3 },
                { value: 'data_quality', label: 'Poor data quality for analysis', score: 3 }
              ]
            },
            {
              id: 'business_pain',
              label: 'Business Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'roi_unclear', label: 'Unclear ROI on Databricks', score: 4 },
                { value: 'budget_justification', label: 'Difficulty justifying budget', score: 4 },
                { value: 'cost_perception', label: 'Perceived as cost center, not value driver', score: 4 },
                { value: 'optimization_challenges', label: 'Difficult to prioritize optimization', score: 3 },
                { value: 'stakeholder_skepticism', label: 'Stakeholder skepticism', score: 4 }
              ]
            }
          ],
          commentBox: {
            label: 'Notes',
            placeholder: 'Describe how you link costs to business value...'
          }
        },
        {
          id: 'value_reviews',
          question: 'How frequently do you review usage metrics to align spending with outcomes?',
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
                { value: 'no_reviews', label: 'No regular review process', score: 4 },
                { value: 'metric_gaps', label: 'Incomplete usage metrics', score: 3 },
                { value: 'manual_analysis', label: 'Manual, time-consuming analysis', score: 3 },
                { value: 'action_gaps', label: 'Insights not translated to actions', score: 4 },
                { value: 'stakeholder_engagement', label: 'Difficult stakeholder engagement', score: 3 }
              ]
            },
            {
              id: 'business_pain',
              label: 'Business Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'wasted_spend', label: 'Undetected wasted spending', score: 4 },
                { value: 'misaligned_priorities', label: 'Spending misaligned with priorities', score: 4 },
                { value: 'reactive_approach', label: 'Reactive vs proactive optimization', score: 3 },
                { value: 'budget_overruns', label: 'Unexpected budget overruns', score: 4 },
                { value: 'accountability_gaps', label: 'Lack of spending accountability', score: 3 }
              ]
            }
          ],
          commentBox: {
            label: 'Notes',
            placeholder: 'Share details about cost-value review processes...'
          }
        }
      ]
    },
    {
      id: 'innovation_culture',
      name: 'Innovation & Continuous Improvement',
      questions: [
        {
          id: 'innovation_adoption',
          question: 'How proactive is your organization in evaluating and piloting new Databricks capabilities?',
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
                { value: 'no_evaluation', label: 'No evaluation process for new features', score: 4 },
                { value: 'risk_aversion', label: 'Risk-averse culture', score: 3 },
                { value: 'resource_constraints', label: 'No resources for experimentation', score: 4 },
                { value: 'testing_barriers', label: 'Barriers to pilot testing', score: 3 },
                { value: 'adoption_delays', label: 'Long delays in adoption', score: 4 }
              ]
            },
            {
              id: 'business_pain',
              label: 'Business Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'missed_capabilities', label: 'Missing out on valuable capabilities', score: 4 },
                { value: 'competitive_disadvantage', label: 'Competitive disadvantage', score: 4 },
                { value: 'efficiency_gaps', label: 'Missed efficiency opportunities', score: 4 },
                { value: 'innovation_lag', label: 'Innovation lag', score: 4 },
                { value: 'team_frustration', label: 'Team frustration with pace', score: 3 }
              ]
            }
          ],
          commentBox: {
            label: 'Notes',
            placeholder: 'Describe your innovation and capability adoption culture...'
          }
        },
        {
          id: 'continuous_improvement',
          question: 'How effectively are feedback and lessons learned incorporated into your future roadmap?',
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
                { value: 'no_feedback_loop', label: 'No systematic feedback loop', score: 4 },
                { value: 'learning_capture', label: 'Poor capture of lessons learned', score: 3 },
                { value: 'retrospective_gaps', label: 'Inconsistent retrospectives', score: 3 },
                { value: 'action_tracking', label: 'No tracking of improvement actions', score: 3 },
                { value: 'roadmap_disconnect', label: 'Feedback disconnected from roadmap', score: 4 }
              ]
            },
            {
              id: 'business_pain',
              label: 'Business Pain Points',
              type: 'multiple_choice',
              options: [
                { value: 'repeated_mistakes', label: 'Repeated mistakes and issues', score: 4 },
                { value: 'slow_improvement', label: 'Slow improvement cycles', score: 4 },
                { value: 'team_disengagement', label: 'Team disengagement from process', score: 3 },
                { value: 'value_leakage', label: 'Value leakage from unaddressed issues', score: 4 },
                { value: 'culture_impact', label: 'Negative impact on culture', score: 3 }
              ]
            }
          ],
          commentBox: {
            label: 'Notes',
            placeholder: 'Share details about continuous improvement processes...'
          }
        }
      ]
    }
  ]
};

module.exports = operationalExcellencePillar;
