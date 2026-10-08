/**
 * Domain-Specific ScoreX Framework Overlays
 *
 * Maps GE Value Realization (ge_vr_*) and Custom Domain Tracks (inst_*) onto the
 * canonical 6-pillar ScoreX assessmentFramework structure so that NavigationPanel,
 * AssessmentQuestion, and AssessmentResultsNew render the exact canonical UI template
 * while displaying domain-authentic pillars, dimensions, questions, 1–5 rubrics, and pain points.
 */

const fs = require('fs');
const path = require('path');

const GE_VR_PILLARS_SPEC = [
  {
    id: 'platform_governance',
    name: '🎯 Scope & Legacy Retirement',
    description: 'Assess migration scope, eligible cohort denominators, legacy AI/search decommissioning, and enterprise connector parity.',
    goal: 'Establish defensible migration scope, cohort denominators, and legacy AI retirement.',
    dimensions: [
      {
        name: 'Migration Scope & Cutover Model',
        questions: [
          {
            question: 'What is the primary Gemini Enterprise migration rationale, executive sponsorship, and legacy platform cutover model?',
            levels: [
              '1. Explore: Unscoped pilot without executive sponsor or legacy cutover plan',
              '2. Experiment: Departmental pilot with informal migration rationale and parallel legacy usage',
              '3. Formalize: Approved enterprise migration scope with defined cohort waves and cutover milestones',
              '4. Optimize: Phased production cutover with active legacy license retirement and executive governance',
              '5. Transform: Full enterprise cutover completed with signed sponsor charter and decommissioned legacy stack'
            ],
            techPains: [
              { value: 'unscoped_parallel_run', label: 'Unbounded parallel run with legacy OpenAI / point tools', score: 4 },
              { value: 'missing_cutover_criteria', label: 'Missing technical cutover readiness criteria', score: 3 },
              { value: 'fragmented_sponsorship', label: 'Fragmented ownership across IT and business units', score: 4 }
            ],
            bizPains: [
              { value: 'duplicate_licensing_burn', label: 'Duplicate licensing spend during prolonged coexistence', score: 5 },
              { value: 'unclear_roi_charter', label: 'Unclear executive value-realization charter', score: 4 },
              { value: 'delayed_decommissioning', label: 'Delayed retirement of avoidable legacy contracts', score: 4 }
            ]
          },
          {
            question: 'How are eligible, provisioned, and assigned user cohort denominators tracked across business units and rollout waves?',
            levels: [
              '1. Explore: No consistent denominator; only top-line contracted seat count is known',
              '2. Experiment: Basic provisioned user list without functional cohort or wave breakdown',
              '3. Formalize: Documented Eligible → Provisioned → Assigned denominators per rollout wave',
              '4. Optimize: Automated HR/IdP cohort mapping linking assigned seats to business units and roles',
              '5. Transform: Real-time entitlement and cohort denominator ledger reconciled across all global waves'
            ],
            techPains: [
              { value: 'missing_cohort_denominators', label: 'Missing HR/IdP cohort mapping for provisioned seats', score: 4 },
              { value: 'untracked_wave_entitlements', label: 'Untracked seat assignment across rollout waves', score: 3 }
            ],
            bizPains: [
              { value: 'inflated_adoption_claims', label: 'Inability to defend adoption rates without validated denominators', score: 5 },
              { value: 'shelfware_seats', label: 'Unassigned shelfware seats across business units', score: 4 }
            ]
          }
        ]
      },
      {
        name: 'Legacy AI Decommissioning & Coexistence',
        questions: [
          {
            question: 'What is the decommissioning state of legacy AI and search tools (e.g., OpenAI / NovaAssist / point tools) post-cutover?',
            levels: [
              '1. Explore: Legacy AI/search tools remain 100% active with no retirement schedule',
              '2. Experiment: Partial sunset planned, but most teams still retain legacy API/seat access',
              '3. Formalize: Date-bounded coexistence with active migration of priority workflows off legacy tools',
              '4. Optimize: >80% of legacy seats and API endpoints decommissioned with contract non-renewal locked',
              '5. Transform: 100% of avoidable legacy AI/search infrastructure decommissioned and financially retired'
            ],
            techPains: [
              { value: 'legacy_api_dependencies', label: 'Hardcoded legacy OpenAI API dependencies in downstream scripts', score: 4 },
              { value: 'unrevoked_legacy_tokens', label: 'Unrevoked legacy API keys and shadow endpoints', score: 4 }
            ],
            bizPains: [
              { value: 'unretired_run_rate', label: 'Unretired legacy run-rate blocking Col 1 cash savings', score: 5 },
              { value: 'split_user_habit', label: 'Users splitting workflows between legacy tools and Gemini', score: 4 }
            ]
          },
          {
            question: 'How are comparable pre-migration baseline logs, cost ledgers, and workflow benchmarks preserved for value verification?',
            levels: [
              '1. Explore: No legacy baseline logs, cost records, or pre-cutover task timings preserved',
              '2. Experiment: Anecdotal recall or high-level annual spend estimate only',
              '3. Formalize: Documented 12-month legacy cost summary and pilot timed-study workflow baselines',
              '4. Optimize: Reconciled legacy telemetry logs, invoice ledgers, and pre/post cohort benchmarks',
              '5. Transform: Audited system-of-record baseline across cost, latency, quality, and workflow cycle times'
            ],
            techPains: [
              { value: 'missing_pre_cutover_logs', label: 'Pre-cutover legacy usage logs not archived prior to sunset', score: 4 },
              { value: 'non_comparable_cohorts', label: 'Pre/post measurement windows not normalized for seasonality', score: 3 }
            ],
            bizPains: [
              { value: 'unprovable_before_after', label: 'CFO challenge on before-vs-after productivity claims', score: 5 },
              { value: 'evidence_haircut', label: 'Value claims downgraded to Tier C/D due to baseline gaps', score: 4 }
            ]
          }
        ]
      },
      {
        name: 'Enterprise Connector & Surface Parity',
        questions: [
          {
            question: 'How complete is enterprise connector parity across M365/SharePoint, CRM, ITSM, DMS, and BigQuery data sources?',
            levels: [
              '1. Explore: Standalone web chat only; zero enterprise data connectors deployed',
              '2. Experiment: Initial Workspace/Drive grounding only; third-party connectors pending',
              '3. Formalize: Core M365/SharePoint and ITSM connectors deployed for Wave 1 cohorts',
              '4. Optimize: Production ACL-enforced connectors across CRM, ITSM, DMS, and BigQuery lakehouse',
              '5. Transform: Full multi-source connector parity with real-time ACL sync and MCP agent tool bindings'
            ],
            techPains: [
              { value: 'connector_acl_lag', label: 'Connector ACL sync lag or missing source-system entitlements', score: 4 },
              { value: 'unindexed_repositories', label: 'Critical SharePoint/DMS repositories not yet indexed', score: 4 }
            ],
            bizPains: [
              { value: 'incomplete_answers', label: 'Incomplete grounded answers forcing manual system lookups', score: 4 },
              { value: 'delayed_workflow_launch', label: 'Priority workflows delayed waiting for data-source connectors', score: 5 }
            ]
          },
          {
            question: 'How standardized is multi-surface deployment across Gemini Chat, Enterprise Search, Workspace Side Panel, and Custom Agents?',
            levels: [
              '1. Explore: Single surface available to a restricted sandbox group',
              '2. Experiment: Web chat enabled, but Workspace side panels and Enterprise Search unconfigured',
              '3. Formalize: Standardized rollout across Workspace Side Panel, Gemini Web, and Enterprise Search',
              '4. Optimize: Unified multi-surface experience integrated with NotebookLM and department agents',
              '5. Transform: Seamless omnichannel AI assistance embedded directly into core line-of-business systems'
            ],
            techPains: [
              { value: 'inconsistent_surface_policies', label: 'Inconsistent admin policies across Workspace and Vertex surfaces', score: 3 },
              { value: 'agent_deployment_friction', label: 'Friction publishing custom ADK agents to end-user surfaces', score: 4 }
            ],
            bizPains: [
              { value: 'context_switching_loss', label: 'Productivity lost switching between line-of-business apps and chat', score: 4 },
              { value: 'low_feature_discovery', label: 'Low employee awareness of embedded side-panel capabilities', score: 3 }
            ]
          }
        ]
      },
      {
        name: 'Multi-Geography & Cohort Rollout',
        questions: [
          {
            question: 'How are multi-geography launch waves, language equivalence, and regional Works Council / privacy approvals governed?',
            levels: [
              '1. Explore: Single-region English-only deployment; international cohorts blocked',
              '2. Experiment: Ad-hoc regional access without localized validation or Works Council sign-off',
              '3. Formalize: Defined regional rollout waves with privacy/DPIA clearances in primary markets',
              '4. Optimize: Multi-language parity verified with EU Works Council and regional data residency enforced',
              '5. Transform: Global multi-region deployment with automated residency guardrails and local language QA'
            ],
            techPains: [
              { value: 'data_residency_constraints', label: 'Regional data residency and sovereign routing constraints', score: 4 },
              { value: 'multilingual_grounding_gaps', label: 'Uneven grounding quality on non-English repositories', score: 3 }
            ],
            bizPains: [
              { value: 'works_council_holds', label: 'EU Works Council or local privacy holds delaying European waves', score: 5 },
              { value: 'uneven_global_realization', label: 'Value realization concentrated in US/UK while global seats sit idle', score: 4 }
            ]
          },
          {
            question: 'How are priority business workflows selected, scoped, and assigned accountable business owners?',
            levels: [
              '1. Explore: Generic horizontal use only; no priority business workflows identified',
              '2. Experiment: Brainstormed use-case list without formal business owners or volume metrics',
              '3. Formalize: Top 3–5 priority workflows scoped with named business owners and KPI targets',
              '4. Optimize: Production workflows instrumented with before/after effort, volume, and quality tracking',
              '5. Transform: Portfolio of signed, repeatable high-ROI workflows governed by business unit leaders'
            ],
            techPains: [
              { value: 'uninstrumented_workflows', label: 'Lack of workflow-level telemetry tagging on agent endpoints', score: 4 },
              { value: 'undefined_task_boundaries', label: 'Undefined start/end boundaries for multi-step workflow tasks', score: 3 }
            ],
            bizPains: [
              { value: 'diffuse_time_savings', label: 'Diffuse 5-minute time savings that never convert into measurable capacity', score: 5 },
              { value: 'lack_of_business_ownership', label: 'Business unit leaders not accountable for workflow adoption', score: 4 }
            ]
          }
        ]
      },
      {
        name: 'Value-Claim Governance & Attribution',
        questions: [
          {
            question: 'How clearly defined are value-claim approval gates across IT Platform, Business Workflow Owners, and Finance?',
            levels: [
              '1. Explore: No formal approval rule; vendor or project team estimates reported unchecked',
              '2. Experiment: IT-only review of adoption metrics without business or Finance validation',
              '3. Formalize: Documented value governance charter with Business Owner review of workflow gains',
              '4. Optimize: Joint IT, Business Owner, and Finance Controller gate before claiming realized value',
              '5. Transform: Institutionalized 5-gate governance model with quarterly CFO ledger reconciliation'
            ],
            techPains: [
              { value: 'disconnected_evidence_artifacts', label: 'Telemetry, cost invoices, and survey data stored in disconnected silos', score: 3 },
              { value: 'manual_audit_pack', label: 'Manual effort assembling CFO evidence verification packs', score: 4 }
            ],
            bizPains: [
              { value: 'rejected_roi_claims', label: 'Executive skepticism toward unverified AI productivity claims', score: 5 },
              { value: 'renewal_justification_risk', label: 'Delayed contract renewal or expansion sign-off', score: 5 }
            ]
          },
          {
            question: 'How are duplicate-benefit exclusions and attribution shares enforced when multiple initiatives touch the same workflow?',
            levels: [
              '1. Explore: 100% of workflow improvement claimed by AI with zero attribution haircut',
              '2. Experiment: Informal qualitative acknowledgement of concurrent automation programs',
              '3. Formalize: Explicit attribution share (%) assigned to Gemini Enterprise per workflow',
              '4. Optimize: Cross-program benefit registry preventing double-counting across ERP/ITSM/AI initiatives',
              '5. Transform: Finance-audited MECE attribution ledger with conservative Low/Base/High sensitivity bands'
            ],
            techPains: [
              { value: 'overlapping_automation_metrics', label: 'Confounded metrics between RPA/ITSM rules and Gemini agents', score: 4 }
            ],
            bizPains: [
              { value: 'double_counted_benefits', label: 'Double-counted savings across multiple transformation business cases', score: 5 }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'data_engineering',
    name: '🚀 Adoption & Access Funnel',
    description: 'Measure cohort activation (Eligible → Provisioned → Assigned → MAU → WAU → Repeat Active), task completion, and blockers.',
    goal: 'Drive repeat weekly active usage and eliminate connector or access blockers across assigned seats.',
    dimensions: [
      {
        name: 'Seat Provisioning & Activation Funnel',
        questions: [
          {
            question: 'What portion of contracted and provisioned Gemini Enterprise seats achieve active 30-day MAU and 7-day WAU targets?',
            levels: [
              '1. Explore: <25% of cohort WAU target achieved; high unprovisioned seat backlog',
              '2. Experiment: 25–49% of agreed cohort WAU target achieved; sporadic monthly usage',
              '3. Formalize: 50–74% of cohort WAU target achieved with steady 30-day MAU conversion',
              '4. Optimize: 75–99% of cohort WAU target achieved across Wave 1 assigned seats',
              '5. Transform: ≥100% of agreed WAU/Assigned target achieved with automated seat reclamation'
            ],
            techPains: [
              { value: 'provisioning_sync_delays', label: 'AD/IdP group provisioning delays for Wave 1/Wave 2 users', score: 4 },
              { value: 'telemetry_aggregation_lag', label: 'Delayed WAU/MAU telemetry feeds across Workspace and Vertex', score: 3 }
            ],
            bizPains: [
              { value: 'low_wau_assigned_ratio', label: 'Low WAU-to-Assigned ratio eroding executive renewal confidence', score: 5 },
              { value: 'idle_license_carry', label: 'Carrying unactivated licenses in slower business units', score: 4 }
            ]
          },
          {
            question: 'How consistent is repeat weekly active usage (2+ active weeks per month) across provisioned functional cohorts?',
            levels: [
              '1. Explore: One-off curiosity trials; <15% repeat weekly retention after onboarding',
              '2. Experiment: 15–34% repeat active usage limited to early-adopter power users',
              '3. Formalize: 35–54% repeat active usage across core operational cohorts',
              '4. Optimize: 55–74% repeat active usage embedded in weekly team routines',
              '5. Transform: ≥75% sustained repeat weekly active usage across all target personas'
            ],
            techPains: [
              { value: 'lack_of_habit_triggers', label: 'AI entry points not embedded in daily ticket/document triggers', score: 4 }
            ],
            bizPains: [
              { value: 'post_launch_drop_off', label: 'Usage drop-off 30 days after initial launch training', score: 4 }
            ]
          }
        ]
      },
      {
        name: 'End-to-End Task Completion',
        questions: [
          {
            question: 'What portion of assigned users can complete their intended business task end-to-end in Gemini Enterprise without falling back to legacy tools?',
            levels: [
              '1. Explore: <20% end-to-end task completion; frequent fallback to legacy tools',
              '2. Experiment: 21–40% task completion; heavy manual stitching across systems',
              '3. Formalize: 41–60% end-to-end task completion on scoped priority workflows',
              '4. Optimize: 61–80% end-to-end task completion with grounded enterprise citations',
              '5. Transform: 81–100% end-to-end task completion with zero legacy fallback required'
            ],
            techPains: [
              { value: 'missing_writeback_actions', label: 'Read-only grounding without ticket/document write-back actions', score: 4 },
              { value: 'context_window_truncation', label: 'Incomplete multi-document synthesis on large dossiers', score: 3 }
            ],
            bizPains: [
              { value: 'manual_copy_paste', label: 'Analysts manually copying outputs into downstream forms', score: 4 }
            ]
          },
          {
            question: 'How balanced is adoption across Conversational Assist, Grounded Enterprise Search, Document Summarization, and Custom ADK Agents?',
            levels: [
              '1. Explore: Un-grounded generic chat prompts only',
              '2. Experiment: Basic document summarization and email drafting in Workspace',
              '3. Formalize: Active adoption of Grounded Enterprise Search and citation verification',
              '4. Optimize: Multi-surface adoption spanning Chat, Enterprise Search, Docs/Sheets, and Custom Agents',
              '5. Transform: High-frequency autonomous ADK agent execution and Deep Research across cohorts'
            ],
            techPains: [
              { value: 'underutilized_custom_agents', label: 'Low discovery of domain-specific custom agents in catalog', score: 3 }
            ],
            bizPains: [
              { value: 'shallow_use_case_depth', label: 'Usage concentrated in basic drafting rather than high-ROI workflows', score: 4 }
            ]
          }
        ]
      },
      {
        name: 'Adoption Blocker Remediation',
        questions: [
          {
            question: 'How systematically are adoption blockers (missing connectors, permission gaps, prompt literacy, latency) quantified and remediated?',
            levels: [
              '1. Explore: Blockers unmeasured; >20% of eligible cohort unable to use platform effectively',
              '2. Experiment: Informal feedback collection; 10–20% of users affected by unresolved blockers',
              '3. Formalize: Ranked blocker taxonomy tracking connector, ACL, and training friction (5–10% blocked)',
              '4. Optimize: Bi-weekly blocker burn-down reducing blocked users below 5% of cohort',
              '5. Transform: Proactive telemetry anomaly detection with <2% blocked users and full connector parity'
            ],
            techPains: [
              { value: 'permission_denied_errors', label: 'Over-restrictive ACLs returning empty grounded search results', score: 4 },
              { value: 'complex_query_latency', label: 'Latency spikes on complex cross-repository grounded queries', score: 3 }
            ],
            bizPains: [
              { value: 'user_frustration_churn', label: 'First-time users abandoning tool after empty/blocked responses', score: 5 }
            ]
          },
          {
            question: 'What percentage of eligible users remain blocked by data-source access or entitlement restrictions?',
            levels: [
              '1. Explore: >20% of eligible users lack required data-source or license entitlements',
              '2. Experiment: 11–20% blocked by pending connector permissions or regional holds',
              '3. Formalize: 6–10% affected by bounded connector or group-sync exceptions',
              '4. Optimize: 1–5% affected with automated entitlement self-service remediation',
              '5. Transform: <1% blocked; automated zero-touch RBAC/ABAC entitlement provisioning'
            ],
            techPains: [
              { value: 'nested_ad_group_mismatch', label: 'Nested Active Directory group mismatches in connector ACLs', score: 4 }
            ],
            bizPains: [
              { value: 'onboarding_ticket_backlog', label: 'IT helpdesk backlog for manual connector access requests', score: 3 }
            ]
          }
        ]
      },
      {
        name: 'Enablement, Champions & Coaching',
        questions: [
          {
            question: 'How effective are role-specific prompt libraries, AI Champion networks, and embedded workflow coaching sessions?',
            levels: [
              '1. Explore: Generic launch email only; no role-specific enablement or coaching',
              '2. Experiment: Self-service onboarding PDFs and recorded webinar links',
              '3. Formalize: Centralized prompt library and live Community of Practice sessions',
              '4. Optimize: Embedded Business Unit AI Champions and role-specific workflow labs',
              '5. Transform: Continuous in-workflow coaching, certified champions, and FDE/PSO co-delivery'
            ],
            techPains: [
              { value: 'static_prompt_templates', label: 'Prompt templates not integrated directly into agent UI', score: 3 }
            ],
            bizPains: [
              { value: 'skill_gap_frontline', label: 'Frontline teams unsure how to apply Gemini to complex SOPs', score: 4 }
            ]
          },
          {
            question: 'How do adoption and task completion rates compare between coached cohorts and self-service cohorts?',
            levels: [
              '1. Explore: Coached vs. uncoached cohort performance is not tracked',
              '2. Experiment: Qualitative feedback from training attendees only',
              '3. Formalize: Pre/post training WAU lift measured across participating departments',
              '4. Optimize: Cohort A/B telemetry proving ≥2x WAU and task completion lift from hands-on coaching',
              '5. Transform: Closed-loop enablement engine targeting low-adoption cohorts with automated interventions'
            ],
            techPains: [
              { value: 'missing_training_cohort_tags', label: 'LMS training completion data not joined to WAU telemetry', score: 3 }
            ],
            bizPains: [
              { value: 'untargeted_enablement_spend', label: 'Enablement effort spent on already-active cohorts', score: 3 }
            ]
          }
        ]
      },
      {
        name: 'Workflow Telemetry Attribution',
        questions: [
          {
            question: 'How accurately is platform usage telemetry mapped to specific priority business workflows and cost centers?',
            levels: [
              '1. Explore: Aggregate tenant-level prompt counts only; zero workflow attribution',
              '2. Experiment: Opt-in employee survey recall used to guess workflow mix',
              '3. Formalize: Sampled pilot study combined with connector and agent endpoint logs',
              '4. Optimize: Direct telemetry task tagging across priority workflows and cost centers',
              '5. Transform: 100% deterministic workflow telemetry joined to system-of-record transaction IDs'
            ],
            techPains: [
              { value: 'untagged_chat_sessions', label: 'Generic chat sessions lack workflow or ticket ID metadata', score: 4 }
            ],
            bizPains: [
              { value: 'unallocated_platform_value', label: 'Inability to attribute platform ROI to specific P&L leaders', score: 4 }
            ]
          },
          {
            question: 'How automated is executive telemetry reporting for cohort retention, seat utilization, and license reallocation?',
            levels: [
              '1. Explore: Manual CSV exports compiled quarterly on ad-hoc request',
              '2. Experiment: Monthly static slide deck with basic active user counts',
              '3. Formalize: Bi-weekly automated BigQuery / Looker adoption funnel dashboard',
              '4. Optimize: Live executive telemetry workspace with automated 60-day inactive seat harvesting',
              '5. Transform: Real-time predictive adoption & value realization command center integrated with FinOps'
            ],
            techPains: [
              { value: 'manual_csv_reconciliation', label: 'Manual script stitching across admin console exports', score: 3 }
            ],
            bizPains: [
              { value: 'slow_license_reallocation', label: 'Slow reallocation of idle seats to high-demand waitlist cohorts', score: 4 }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'analytics_bi',
    name: '💰 Platform Economics & CFO Bridge',
    description: 'Reconcile annual legacy baseline AI/search costs, retired avoidable run-rate spend, Gemini TCO, and payback months.',
    goal: 'Verify Col 1 realized cash savings, retired legacy run-rate, and payback period.',
    dimensions: [
      {
        name: 'Legacy AI & Search Cost Baseline',
        questions: [
          {
            question: 'How completely are annual legacy AI, token API, vector hosting, connector, and support FTE costs reconciled to invoices?',
            levels: [
              '1. Explore: Legacy cost inventory missing or unreconciled to invoices/contracts',
              '2. Experiment: Rough top-line license estimate only; infra and support FTEs omitted',
              '3. Formalize: Major legacy license, API, and hosting categories documented with minor gaps',
              '4. Optimize: All direct API, vector DB, connector, and support FTE costs reconciled to GL',
              '5. Transform: Fully audited 12-month legacy baseline ledger signed off by Procurement and Finance'
            ],
            techPains: [
              { value: 'bundled_cloud_invoices', label: 'Legacy AI token and vector DB costs buried in shared cloud bills', score: 4 }
            ],
            bizPains: [
              { value: 'understated_legacy_tco', label: 'Understated legacy TCO making migration cost bridge look artificially expensive', score: 5 }
            ]
          },
          {
            question: 'How accurately is shadow AI and departmental point-tool spend captured in the pre-migration cost baseline?',
            levels: [
              '1. Explore: Shadow AI and departmental SaaS subscriptions completely untracked',
              '2. Experiment: One-time survey of department heads on point-tool subscriptions',
              '3. Formalize: Expense-report and CASB scan identifying major departmental AI spend',
              '4. Optimize: Procurement-verified consolidation list of point tools slated for retirement',
              '5. Transform: Continuous FinOps & CASB governance blocking duplicate departmental AI spend'
            ],
            techPains: [
              { value: 'unmonitored_saas_cards', label: 'Departmental credit-card AI subscriptions outside central IT visibility', score: 3 }
            ],
            bizPains: [
              { value: 'fragmented_vendor_spend', label: 'Fragmented point-tool renewals eroding enterprise bundle economics', score: 4 }
            ]
          }
        ]
      },
      {
        name: 'Retired Avoidable Run-Rate Savings',
        questions: [
          {
            question: 'How much avoidable legacy platform, API, and license run-rate spend has been contractually retired post-cutover?',
            levels: [
              '1. Explore: Net recurring platform cost up >20% due to unretired legacy contracts',
              '2. Experiment: Net recurring cost up 1–20% during parallel coexistence window',
              '3. Formalize: Recurring platform cost roughly flat (±1%) vs. legacy baseline',
              '4. Optimize: Avoidable legacy cost retired; net recurring platform cost down 1–10%',
              '5. Transform: Net recurring platform cost down >10%, contractually terminated and Finance-verified'
            ],
            techPains: [
              { value: 'residual_legacy_workloads', label: 'Residual batch jobs preventing full legacy cluster termination', score: 4 }
            ],
            bizPains: [
              { value: 'auto_renewed_legacy_contracts', label: 'Missed termination notice windows on legacy SaaS contracts', score: 5 }
            ]
          },
          {
            question: 'How strictly are parallel-run coexistence costs separated from verified Col 1 realized cash savings?',
            levels: [
              '1. Explore: Projected legacy savings claimed as realized cash while legacy system still runs',
              '2. Experiment: Coexistence costs tracked informally without date-bounded cutover milestones',
              '3. Formalize: Parallel-run spend isolated in transition bridge; only terminated contracts enter Col 1',
              '4. Optimize: Monthly GL reconciliation verifying exact contract termination dates and run-rate drop',
              '5. Transform: Zero-assumption CFO ledger enforcing strict separation of Col 1 cash vs. Col 3 pipeline'
            ],
            techPains: [
              { value: 'shared_infra_decommissioning_lag', label: 'Shared infrastructure dependencies delaying physical decommission', score: 3 }
            ],
            bizPains: [
              { value: 'cfo_audit_rejection', label: 'Finance rejecting premature hard-savings claims during parallel run', score: 5 }
            ]
          }
        ]
      },
      {
        name: 'Gemini Run-Rate & Unit Economics',
        questions: [
          {
            question: 'How transparently are Gemini Enterprise license, Vertex AI compute, and support costs allocated across active cohorts and workflows?',
            levels: [
              '1. Explore: Broad enterprise lump sum with no cohort or workflow cost apportionment rule',
              '2. Experiment: Simple headcount split across departments regardless of active seat usage',
              '3. Formalize: Documented enterprise seat and Vertex API consumption allocation rule',
              '4. Optimize: Cost apportioned by active cohort, assigned seats, and priority workflow volume',
              '5. Transform: Reconciled chargeback/showback to billing centers with Finance-owned unit economics'
            ],
            techPains: [
              { value: 'unlabeled_vertex_projects', label: 'Missing billing labels on custom agent Vertex AI endpoints', score: 3 }
            ],
            bizPains: [
              { value: 'unfair_cost_allocation', label: 'Business units resisting flat chargebacks without usage transparency', score: 4 }
            ]
          },
          {
            question: 'What is the net recurring platform cost delta per active user and per completed workflow transaction?',
            levels: [
              '1. Explore: Cost per active user or per completed workflow task is unmeasured',
              '2. Experiment: High cost per active user due to low initial seat activation (<30% WAU)',
              '3. Formalize: Unit cost per WAU and per workflow task tracked monthly against baseline',
              '4. Optimize: Declining unit cost per completed task driven by Context Caching and model routing',
              '5. Transform: Industry-leading unit economics with verified lower TCO per transaction than legacy stack'
            ],
            techPains: [
              { value: 'unoptimized_model_routing', label: 'Routing simple classification tasks to heavy reasoning models', score: 3 }
            ],
            bizPains: [
              { value: 'margin_compression_risk', label: 'Unmonitored token consumption on high-volume workflows', score: 4 }
            ]
          }
        ]
      },
      {
        name: 'Migration Investment & Payback Horizon',
        questions: [
          {
            question: 'How are one-time migration engineering, connector integration, and change-management costs tracked against first-year benefits?',
            levels: [
              '1. Explore: One-time migration and SI implementation costs unmeasured or omitted',
              '2. Experiment: High-level SOW total tracked without capitalization or payback schedule',
              '3. Formalize: Complete transition ledger capturing engineering, connector, QA, and enablement spend',
              '4. Optimize: Monthly tracking of one-time transition investment against cumulative validated value',
              '5. Transform: Audited capital/operating transition ledger with milestone-gated value realization'
            ],
            techPains: [
              { value: 'custom_connector_rework', label: 'Unplanned engineering rework on legacy custom connectors', score: 4 }
            ],
            bizPains: [
              { value: 'unbudgeted_si_overruns', label: 'System integrator change orders extending payback horizon', score: 4 }
            ]
          },
          {
            question: 'What is the Finance-verified payback period (in months) on total Gemini Enterprise migration investment?',
            levels: [
              '1. Explore: Unmeasured or migration costs exceed validated first-year benefit (>36 mos)',
              '2. Experiment: Payback period between 19 and 36 months based on initial wave',
              '3. Formalize: Payback period between 12 and 18 months on validated Col 1 + Col 2 benefits',
              '4. Optimize: Payback period between 7 and 11 months verified by Finance',
              '5. Transform: Payback ≤6 months with verified net recurring cost reduction and workflow velocity'
            ],
            techPains: [
              { value: 'slow_wave2_onboarding', label: 'Slow Wave 2 technical onboarding delaying scale economics', score: 3 }
            ],
            bizPains: [
              { value: 'extended_payback_window', label: 'Payback exceeding 12-month CFO hurdle rate', score: 5 }
            ]
          }
        ]
      },
      {
        name: 'Workaround & Shadow Cost Elimination',
        questions: [
          {
            question: 'How effectively have manual workaround costs, duplicate licensing, and transition friction expenses been eliminated?',
            levels: [
              '1. Explore: Material unresolved workaround costs or service degradation post-migration',
              '2. Experiment: Workaround and duplicate license impact measured but still rising',
              '3. Formalize: Minor transition workarounds; net neutral operational cost impact',
              '4. Optimize: Adverse workaround costs measured and actively falling quarter-over-quarter',
              '5. Transform: Zero unresolved degradation; workaround and shadow costs measurably eliminated'
            ],
            techPains: [
              { value: 'manual_export_workarounds', label: 'Manual document export/import workarounds for unindexed repos', score: 3 }
            ],
            bizPains: [
              { value: 'hidden_transition_drag', label: 'Hidden analyst overtime during dual-system transition', score: 4 }
            ]
          },
          {
            question: 'How are Low / Base / High sensitivity bands modeled across the 5-column CFO Value Realization Ledger?',
            levels: [
              '1. Explore: Single optimistic point estimate with no sensitivity or confidence hair-cuts',
              '2. Experiment: Informal high/low range without linkage to evidence tiers',
              '3. Formalize: Standardized Low (0.7x), Base (1.0x), and High (1.25x) sensitivity modeling',
              '4. Optimize: Evidence-weighted sensitivity bands tied to Tier A/B/C verification factors',
              '5. Transform: Dynamic Monte Carlo / CFO sensitivity ledger stress-tested for board sign-off'
            ],
            techPains: [
              { value: 'static_spreadsheet_models', label: 'Fragile offline spreadsheets disconnected from live telemetry', score: 3 }
            ],
            bizPains: [
              { value: 'overstated_point_estimates', label: 'Loss of CFO credibility from presenting single-point best-case numbers', score: 4 }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'machine_learning',
    name: '⚡ Priority Workflow Velocity',
    description: 'Evaluate 6-stage before/after task effort, cycle-time reduction, first-pass quality, and validated capacity released.',
    goal: 'Deliver ≥25% median task effort and cycle-time reduction across priority business workflows.',
    dimensions: [
      {
        name: 'Priority Workflow Baseline & Volume',
        questions: [
          {
            question: 'How rigorously are priority workflows baselined with signed owners, monthly task volumes, and comparable pre/post cohorts?',
            levels: [
              '1. Explore: No workflow owner, task denominator, or comparable pre-Gemini baseline',
              '2. Experiment: Defined workflow with missing monthly task volumes or comparison window',
              '3. Formalize: Defined workflow owner and task counts with minor comparability caveats',
              '4. Optimize: Comparable pre/post cohort and signed workflow business owner across ≥3 workflows',
              '5. Transform: Repeated system-of-record evidence and signed owners across ≥5 priority workflows'
            ],
            techPains: [
              { value: 'missing_ticket_volume_logs', label: 'Historical monthly task volume logs not segmented by complexity', score: 4 }
            ],
            bizPains: [
              { value: 'unverified_task_multipliers', label: 'Extrapolating pilot time savings across unverified task volumes', score: 5 }
            ]
          },
          {
            question: 'How are completed Gemini-assisted workflow executions tracked via system-of-record logs vs. manual estimates?',
            levels: [
              '1. Explore: 100% reliant on anecdotal user estimates of monthly task frequency',
              '2. Experiment: Periodic manual tally of AI-assisted deliverables in team meetings',
              '3. Formalize: Sampled pilot timed study combined with agent invocation logs',
              '4. Optimize: Automated workflow execution logging in ITSM/CRM/DMS systems of record',
              '5. Transform: Full telemetry lineage linking every Gemini agent run to closed business transactions'
            ],
            techPains: [
              { value: 'disconnected_sor_logging', label: 'Line-of-business systems not logging AI-assist metadata flags', score: 4 }
            ],
            bizPains: [
              { value: 'audit_trail_gaps', label: 'Inability to prove how many closed tickets/dossiers used Gemini', score: 4 }
            ]
          }
        ]
      },
      {
        name: '6-Stage Task Effort Reduction',
        questions: [
          {
            question: 'What is the measured median task effort reduction (including search, drafting, SME review, and rework) across priority workflows?',
            levels: [
              '1. Explore: Worse or negative net effort after accounting for review and correction time',
              '2. Experiment: Within noise threshold (±5% effort change) after SME checking',
              '3. Formalize: 10–24% net median task effort reduction across priority workflows',
              '4. Optimize: Meets target: 25–49% net median task effort reduction at equal or better quality',
              '5. Transform: Exceeds target: ≥50% net median task effort reduction verified by timed study'
            ],
            techPains: [
              { value: 'high_prompt_iteration_time', label: 'Users spending excessive time re-prompting complex queries', score: 3 }
            ],
            bizPains: [
              { value: 'sme_review_bottleneck', label: 'Downstream SME verification eating up initial drafting time savings', score: 5 }
            ]
          },
          {
            question: 'How effectively does Gemini Enterprise reduce multi-system information retrieval and first-draft synthesis time?',
            levels: [
              '1. Explore: Users still search 4+ legacy portals manually before prompting Gemini',
              '2. Experiment: Partial search acceleration on single documents; cross-system synthesis manual',
              '3. Formalize: 30–45% reduction in information gathering and first-draft synthesis minutes',
              '4. Optimize: 45–65% reduction via grounded multi-source connectors and structured templates',
              '5. Transform: >65% compression in search-and-synthesis stage via autonomous multi-step agents'
            ],
            techPains: [
              { value: 'cross_repo_ranking_noise', label: 'Sub-optimal relevance ranking across heterogeneous repositories', score: 3 }
            ],
            bizPains: [
              { value: 'slow_dossier_assembly', label: 'Analysts still spending hours assembling regulatory/operational packets', score: 4 }
            ]
          }
        ]
      },
      {
        name: 'First-Pass Quality & Rework Elimination',
        questions: [
          {
            question: 'What percentage of Gemini Enterprise workflow outputs are accepted on first pass without material SME rewrite?',
            levels: [
              '1. Explore: <25% of Gemini output used; heavy manual rewrite required',
              '2. Experiment: 25–49% of output used; frequent structural and factual edits needed',
              '3. Formalize: 50–74% first-pass acceptance with moderate SME refinement',
              '4. Optimize: 75–89% first-pass acceptance verified across production workflow samples',
              '5. Transform: ≥90% first-pass acceptance with grounded citations and zero critical defects'
            ],
            techPains: [
              { value: 'domain_terminology_drift', label: 'Generic prose lacking company-specific SOP terminology', score: 4 }
            ],
            bizPains: [
              { value: 'senior_reviewer_fatigue', label: 'Senior SMEs spending time rewriting junior analyst AI drafts', score: 4 }
            ]
          },
          {
            question: 'How significantly have downstream rework cycles, escalations, and exception handoffs decreased post-deployment?',
            levels: [
              '1. Explore: Rework or escalation rates increased due to unverified AI outputs',
              '2. Experiment: No measurable change in downstream ticket/document rework cycles',
              '3. Formalize: 10–20% reduction in downstream rework and L2/L3 escalations',
              '4. Optimize: 21–40% reduction in rework cycles validated by QA/operations logs',
              '5. Transform: >40% reduction in rework and exception handoffs with automated pre-check guardrails'
            ],
            techPains: [
              { value: 'missing_schema_validation', label: 'Lack of automated rubric/schema check before workflow handoff', score: 3 }
            ],
            bizPains: [
              { value: 'escalation_queue_backlogs', label: 'L3 specialist queues congested by incomplete L1/L2 triage', score: 4 }
            ]
          }
        ]
      },
      {
        name: 'End-to-End Cycle Time Compression',
        questions: [
          {
            question: 'What is the measured end-to-end calendar cycle-time compression (hours/days from intake to completion) on priority workflows?',
            levels: [
              '1. Explore: Calendar turnaround time unchanged despite faster individual drafting',
              '2. Experiment: <10% cycle-time reduction; handoff and approval queues remain bottlenecked',
              '3. Formalize: 10–24% end-to-end calendar cycle-time reduction from intake to closure',
              '4. Optimize: 25–45% end-to-end cycle-time reduction verified in system-of-record timestamps',
              '5. Transform: >45% cycle-time compression unlocking same-day SLA resolution and faster revenue/ops'
            ],
            techPains: [
              { value: 'Sequential_approval_waits', label: 'Manual sequential approval queues between AI-assisted steps', score: 4 }
            ],
            bizPains: [
              { value: 'sla_penalty_exposure', label: 'Customer/regulatory SLA exposure on time-sensitive workflows', score: 5 }
            ]
          },
          {
            question: 'How consistently are SLA turnaround targets met across peak operational volumes?',
            levels: [
              '1. Explore: Frequent SLA breaches during seasonal or operational volume spikes',
              '2. Experiment: SLA compliance <80% during peak demand windows',
              '3. Formalize: 80–90% SLA compliance with Gemini absorbing moderate volume surges',
              '4. Optimize: 91–97% SLA compliance across peak volumes without temporary contractor surge',
              '5. Transform: ≥98% SLA compliance with elastic agentic triage absorbing peak load autonomously'
            ],
            techPains: [
              { value: 'quota_throttling_peaks', label: 'TPM/RPM quota contention during peak batch + interactive hours', score: 3 }
            ],
            bizPains: [
              { value: 'overtime_and_bpo_surge_spend', label: 'Reliance on expensive overtime or BPO surge staffing during peaks', score: 4 }
            ]
          }
        ]
      },
      {
        name: 'Capacity Release & Value Conversion',
        questions: [
          {
            question: 'How are gross released hours converted into Finance-approved net productive capacity (Col 2) or hard cash savings (Col 1)?',
            levels: [
              '1. Explore: No approved route to value; raw hours multiplied by salary without realization factor',
              '2. Experiment: Modeled pre-sales hypothesis only (Col 3 pipeline opportunity)',
              '3. Formalize: Gross hours released adjusted by conservative Finance realization factor (Col 2)',
              '4. Optimize: Business owner validates higher throughput, backlog burn-down, or avoided hiring (Col 2)',
              '5. Transform: Finance-signed hard budget reduction, BPO contract reduction, or incremental margin (Col 1)'
            ],
            techPains: [
              { value: 'unlinked_capacity_metrics', label: 'Time-saved metrics not linked to output volume per FTE', score: 3 }
            ],
            bizPains: [
              { value: 'soft_savings_skepticism', label: 'CFO refusal to recognize un-realized theoretical time savings', score: 5 }
            ]
          },
          {
            question: 'How clearly documented is the reinvestment of released engineering and operational capacity into higher-value backlog?',
            levels: [
              '1. Explore: No visibility into how released employee hours are utilized',
              '2. Experiment: Informal manager anecdotes on time reallocation',
              '3. Formalize: Documented capacity reinvestment plan per workflow cohort',
              '4. Optimize: Measured increase in completed Epics, audits, or customer cases per FTE',
              '5. Transform: Verified throughput and revenue/quality expansion per FTE signed off by Business Unit GM'
            ],
            techPains: [
              { value: 'missing_throughput_kpis', label: 'Lack of pre/post throughput KPIs (cases/FTE/month) in BI dashboards', score: 3 }
            ],
            bizPains: [
              { value: 'unredeemed_capacity_gains', label: 'Released hours absorbed by organizational slack rather than output', score: 4 }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'generative_ai',
    name: '🛡️ Quality, Grounding & Governance',
    description: 'Assess blinded quality evaluation, grounded citation accuracy, source ACL enforcement, and P95 latency SLAs.',
    goal: 'Operate safely with zero severe permission/quality defects and verified grounded citations.',
    dimensions: [
      {
        name: 'Blinded Quality & Grounded Citations',
        questions: [
          {
            question: 'How rigorously are Gemini Enterprise responses evaluated via blinded side-by-side quality testing and verifiable source citations?',
            levels: [
              '1. Explore: Ad-hoc vibe checks only; no structured evaluation set or citation audit',
              '2. Experiment: Small <25-prompt test set without blinded SME scoring',
              '3. Formalize: Golden evaluation dataset (50–100 prompts) with grounded citation verification',
              '4. Optimize: Blinded side-by-side SME evaluation proving superior accuracy vs. legacy baseline',
              '5. Transform: Continuous automated + human-calibrated evaluation harness with ≥97% citation fidelity'
            ],
            techPains: [
              { value: 'stale_document_citations', label: 'Citations linking to superseded SOP versions in SharePoint/DMS', score: 4 }
            ],
            bizPains: [
              { value: 'trust_erosion_from_hallucinations', label: 'SME distrust triggered by un-cited or inaccurate answers', score: 5 }
            ]
          },
          {
            question: 'What is the severity-weighted defect and hallucination rate across production grounded search and agent workflows?',
            levels: [
              '1. Explore: Unmeasured defect rate or unresolved Sev-1 factual/safety defects in production',
              '2. Experiment: Defect rate above legacy baseline (>5% material errors)',
              '3. Formalize: Defect rate at parity with legacy baseline (2–5%) with active triage',
              '4. Optimize: Severity-weighted defect rate <2% with zero Sev-1/Sev-2 hallucinations',
              '5. Transform: <0.5% defect rate with automated grounding verification and self-correction loops'
            ],
            techPains: [
              { value: 'unfiltered_chunk_retrieval', label: 'Noisy chunk retrieval from uncurated legacy file shares', score: 4 }
            ],
            bizPains: [
              { value: 'operational_error_risk', label: 'Risk of incorrect operational or customer guidance', score: 5 }
            ]
          }
        ]
      },
      {
        name: 'Source ACL & Permission Enforcement',
        questions: [
          {
            question: 'How strictly does Gemini Enterprise enforce source-system ACLs, document-level permissions, and zero cross-tenant data leakage?',
            levels: [
              '1. Explore: Shared service-account indexing bypassing user-level source ACLs',
              '2. Experiment: Coarse collection-level access controls with manual group maintenance',
              '3. Formalize: Document-level ACL inheritance enforced across primary connectors',
              '4. Optimize: 100% ACL pass rate verified via automated cross-role penetration testing',
              '5. Transform: Real-time zero-trust identity propagation, VPC-SC perimeter, and CMEK encryption'
            ],
            techPains: [
              { value: 'acl_inheritance_complexity', label: 'Complex custom permission inheritance in legacy DMS/CRM', score: 4 }
            ],
            bizPains: [
              { value: 'ciso_governance_hold', label: 'CISO hold blocking expansion until ACL test suite passes 100%', score: 5 }
            ]
          },
          {
            question: 'How automated are adversarial red-teaming, prompt-injection defense, and sensitive data redaction checks?',
            levels: [
              '1. Explore: No prompt-injection guardrails or DLP redaction on user inputs/outputs',
              '2. Experiment: Basic provider safety filters without enterprise DLP policy integration',
              '3. Formalize: Cloud DLP / Model Armor policies inspecting PII/PCI/PHI across prompts',
              '4. Optimize: Automated red-team test suite running against indirect prompt injection vectors',
              '5. Transform: Continuous runtime guardrail enforcement with zero-trust SIEM/SOAR telemetry'
            ],
            techPains: [
              { value: 'indirect_prompt_injection', label: 'Vulnerability to indirect prompt injection in external documents', score: 4 }
            ],
            bizPains: [
              { value: 'pii_exposure_liability', label: 'Regulatory liability from unintended PII/confidential data exposure', score: 5 }
            ]
          }
        ]
      },
      {
        name: 'Latency, Uptime & Reliability SLAs',
        questions: [
          {
            question: 'How consistently does the platform meet P50/P95 response latency and availability SLAs across global regions?',
            levels: [
              '1. Explore: Frequent timeouts or P95 latency >15s degrading interactive workflows',
              '2. Experiment: P95 latency 8–15s with occasional regional quota throttling',
              '3. Formalize: P95 latency <6s and ≥99.5% uptime meeting baseline user expectations',
              '4. Optimize: P95 latency <3.5s and ≥99.9% uptime backed by Provisioned Throughput',
              '5. Transform: Sub-2s P50 response and 99.95%+ multi-region availability with zero quota drops'
            ],
            techPains: [
              { value: 'connector_fanout_latency', label: 'Slow fan-out queries across multiple federated connectors', score: 4 }
            ],
            bizPains: [
              { value: 'abandoned_queries_under_load', label: 'Frontline agents abandoning slow queries during live calls', score: 4 }
            ]
          },
          {
            question: 'How effectively are connector sync lag, index freshness, and agent tool-call error rates monitored?',
            levels: [
              '1. Explore: No visibility into connector index freshness or failed tool invocations',
              '2. Experiment: Reactive troubleshooting only after users report missing documents',
              '3. Formalize: Daily monitoring of connector sync schedules and API error rates',
              '4. Optimize: Automated alerting on index freshness SLAs (<15 min lag) and tool retry logic',
              '5. Transform: Self-healing connector pipelines with real-time observability in Cloud Monitoring'
            ],
            techPains: [
              { value: 'silent_connector_sync_failures', label: 'Silent connector token expirations causing stale search indexes', score: 4 }
            ],
            bizPains: [
              { value: 'outdated_policy_answers', label: 'Decisions made on outdated inventory, tariff, or policy data', score: 4 }
            ]
          }
        ]
      },
      {
        name: 'Regulated Workflow & Compliance QA',
        questions: [
          {
            question: 'How thoroughly are regulated workflows validated with immutable audit logs, human-in-the-loop sign-off, and compliance QA?',
            levels: [
              '1. Explore: Regulated use cases unvalidated or prohibited due to missing audit trails',
              '2. Experiment: Informal SME review without immutable prompt/response logging',
              '3. Formalize: Documented human-in-the-loop (HITL) SOPs and Cloud Audit Logs enabled',
              '4. Optimize: Formal compliance QA validation (GxP/SOX/FINRA/GDPR) with signed attestation',
              '5. Transform: Automated compliance evidence capture with 100% traceable HITL sign-off'
            ],
            techPains: [
              { value: 'incomplete_hitl_audit_logs', label: 'Missing linkage between AI draft version and final human sign-off', score: 4 }
            ],
            bizPains: [
              { value: 'regulatory_audit_findings', label: 'Compliance blocks preventing deployment in high-value regulated units', score: 5 }
            ]
          },
          {
            question: 'What is the pass rate on non-compensable governance gates (zero severe ACL leaks, verified citations, signed QA)?',
            levels: [
              '1. Explore: Multiple non-compensable governance gates failing or unevaluated',
              '2. Experiment: Conditional pass with open Sev-2 governance remediation items',
              '3. Formalize: All core security and privacy gates passing; minor workflow QA pending',
              '4. Optimize: 5 of 5 non-compensable governance gates passing across Wave 1 scope',
              '5. Transform: 100% continuous gate compliance across all global cohorts and regulated workflows'
            ],
            techPains: [
              { value: 'manual_gate_verification', label: 'Manual checklist verification of release governance gates', score: 3 }
            ],
            bizPains: [
              { value: 'gated_value_recognition', label: 'Value realization capped until all governance gates pass', score: 5 }
            ]
          }
        ]
      },
      {
        name: 'Cross-Module Contradiction & Evidence Audit',
        questions: [
          {
            question: 'How systematically are cross-module contradictions (e.g., claimed savings without active WAU or retired spend) detected and blocked?',
            levels: [
              '1. Explore: No cross-check between financial claims, adoption telemetry, and quality gates',
              '2. Experiment: Manual spot-checks during quarterly business reviews',
              '3. Formalize: Standardized reconciliation checklist comparing Finance, IT, and Workflow inputs',
              '4. Optimize: Automated contradiction detector flagging mismatches across modules (C, P, A, L, W, Q, F)',
              '5. Transform: Zero-contradiction deterministic ledger with real-time cross-module integrity locks'
            ],
            techPains: [
              { value: 'inconsistent_reporting_periods', label: 'Mismatched date windows between cost ledgers and WAU telemetry', score: 3 }
            ],
            bizPains: [
              { value: 'conflicting_stakeholder_numbers', label: 'IT, Business, and Finance presenting conflicting numbers to leadership', score: 5 }
            ]
          },
          {
            question: 'What proportion of assessment claims are backed by Tier A (System-of-Record) or Tier B (Measured Sample) evidence?',
            levels: [
              '1. Explore: Primarily Tier D (Unsupported Hypothesis) or Tier C (Self-Report Survey)',
              '2. Experiment: <30% Tier A/B evidence; heavy reliance on scoping assumptions',
              '3. Formalize: 30–59% Tier A/B evidence across platform cost and adoption modules',
              '4. Optimize: 60–84% Tier A/B evidence with minimal evidence-adjustment hair-cut',
              '5. Transform: ≥85% Tier A (System-of-Record + Independent Validation) across all value claims'
            ],
            techPains: [
              { value: 'unlinked_artifact_urls', label: 'Missing direct links to BigQuery/Looker/GL evidence artifacts', score: 3 }
            ],
            bizPains: [
              { value: 'steep_evidence_discount', label: 'High raw value score discounted by >40% due to Tier C/D evidence', score: 5 }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'operational_excellence',
    name: '🏆 User Experience & CFO Sign-Off',
    description: 'Evaluate 30-day recall employee survey ratings, preference over legacy tools, and Finance controller attestation.',
    goal: 'Achieve ≥4.0/5.0 user experience rating, ≥75% preference over legacy baseline, and CFO value attestation.',
    dimensions: [
      {
        name: 'Employee Pulse & Task Usefulness',
        questions: [
          {
            question: 'What is the stratified 30-day recall user experience rating for Gemini Enterprise vs. the legacy baseline tool?',
            levels: [
              '1. Explore: Mean rating <2.5/5.0 or negative net satisfaction vs. legacy tool',
              '2. Experiment: Mean rating 2.5–3.2/5.0; mixed feedback across early cohorts',
              '3. Formalize: Mean rating 3.3–3.9/5.0 with positive lift over legacy baseline',
              '4. Optimize: Mean rating 4.0–4.4/5.0 across representative stratified user sample',
              '5. Transform: Mean rating ≥4.5/5.0 with ≥+1.0 pt improvement over legacy baseline tool'
            ],
            techPains: [
              { value: 'low_survey_response_rate', label: 'Unrepresentative survey sample skewed toward power users', score: 3 }
            ],
            bizPains: [
              { value: 'uneven_persona_satisfaction', label: 'Lower satisfaction in non-technical or regional cohorts', score: 4 }
            ]
          },
          {
            question: 'How do users rate output accuracy, citation trustworthiness, and ease of verification in daily work?',
            levels: [
              '1. Explore: Users report frequent inaccuracies and difficulty verifying sources',
              '2. Experiment: Moderate confidence; users double-check every citation manually',
              '3. Formalize: Good confidence (≥3.5/5.0) in inline grounded links and summaries',
              '4. Optimize: High confidence (≥4.2/5.0) in one-click source verification across repositories',
              '5. Transform: Industry-leading user trust (≥4.6/5.0) corroborated by blinded QA audits'
            ],
            techPains: [
              { value: 'citation_snippet_granularity', label: 'Citations linking to document root instead of exact page/paragraph', score: 3 }
            ],
            bizPains: [
              { value: 'verification_hesitation', label: 'Analysts hesitating to rely on AI synthesis for executive briefs', score: 4 }
            ]
          }
        ]
      },
      {
        name: 'User Preference & Corroborated Speed',
        questions: [
          {
            question: 'What percentage of surveyed users prefer Gemini Enterprise over legacy tools and would choose it again?',
            levels: [
              '1. Explore: <40% of users prefer Gemini Enterprise over legacy baseline',
              '2. Experiment: 40–59% preference; significant nostalgia for legacy point tools',
              '3. Formalize: 60–74% of users prefer Gemini Enterprise over legacy tools',
              '4. Optimize: 75–85% of users prefer Gemini Enterprise and would choose it again',
              '5. Transform: >85% user preference across all functional roles and geographies'
            ],
            techPains: [
              { value: 'legacy_prompt_habit_friction', label: 'Users applying legacy prompt habits instead of grounded workspace flows', score: 3 }
            ],
            bizPains: [
              { value: 'pocket_resistance_to_sunset', label: 'Vocal power-user pockets resisting legacy license termination', score: 4 }
            ]
          },
          {
            question: 'How well does self-reported user time savings corroborate independent system-of-record workflow telemetry?',
            levels: [
              '1. Explore: Self-reported minutes unmeasured or wildly divergent from system logs',
              '2. Experiment: Survey recall collected but never compared against workflow telemetry',
              '3. Formalize: Directional alignment between 30-day recall survey and timed pilot studies',
              '4. Optimize: Strong corroboration (within ±15%) between employee pulse and workflow logs',
              '5. Transform: Full triangulation across employee survey, timed studies, and system-of-record logs'
            ],
            techPains: [
              { value: 'recall_bias_variance', label: 'High variance in self-reported 30-day recall time estimates', score: 3 }
            ],
            bizPains: [
              { value: 'survey_only_value_risk', label: 'Risk of relying on survey minutes if system telemetry is absent', score: 4 }
            ]
          }
        ]
      },
      {
        name: 'Approved Loaded Rates & Realization Factors',
        questions: [
          {
            question: 'How are role-based loaded hourly rates and conservative realization factors (0–100%) approved by Customer Finance?',
            levels: [
              '1. Explore: Unapproved industry benchmark salaries used with 100% conversion assumption',
              '2. Experiment: Blended average hourly rate estimated by project team without Finance review',
              '3. Formalize: HR/Finance standard loaded hourly rates by role applied with 50% realization factor',
              '4. Optimize: Controller-approved role-specific loaded rates and cohort realization factors',
              '5. Transform: Audited Finance rate card locked in value ledger with zero unapproved assumptions'
            ],
            techPains: [
              { value: 'missing_role_rate_mapping', label: 'Cohort telemetry not mapped to Finance job-family rate bands', score: 3 }
            ],
            bizPains: [
              { value: 'inflated_labor_valuation', label: 'Finance rejecting inflated hourly rates or 100% productivity conversion', score: 5 }
            ]
          },
          {
            question: 'How strictly are self-reported survey minutes excluded from Col 1 realized cash and Col 2 validated capacity ledgers?',
            levels: [
              '1. Explore: Self-reported survey minutes multiplied by headcount and claimed as cash savings',
              '2. Experiment: Survey minutes blended with pilot studies in headline ROI number',
              '3. Formalize: Survey minutes restricted to UX indicator; only workflow studies enter Col 2',
              '4. Optimize: Strict programmatic firewall preventing U-module survey data from entering Col 1/Col 2',
              '5. Transform: 100% zero-hallucination CFO ledger audited for strict separation of survey vs. cash/capacity'
            ],
            techPains: [
              { value: 'manual_roi_formula_edits', label: 'Ad-hoc spreadsheet edits mixing survey recall into financial cells', score: 4 }
            ],
            bizPains: [
              { value: 'board_credibility_damage', label: 'Loss of board credibility if soft survey minutes are presented as P&L savings', score: 5 }
            ]
          }
        ]
      },
      {
        name: '5-Column MECE Value Ledger Governance',
        questions: [
          {
            question: 'How cleanly separated are Col 1 (Realized Cash), Col 2 (Validated Capacity), Col 3 (Modeled Pipeline), Col 4 (Telemetry), and Col 5 (Strategic Options)?',
            levels: [
              '1. Explore: All benefits lumped into a single undifferentiated "Total Value" number',
              '2. Experiment: Hard vs. soft savings split informally without strict column definitions',
              '3. Formalize: 5-Column MECE Value Ledger adopted for executive reporting',
              '4. Optimize: Every workflow and cost line item deterministically classified into Columns 1–5',
              '5. Transform: CFO-certified 5-Column Ledger with automated drill-down to question-level evidence'
            ],
            techPains: [
              { value: 'blurred_benefit_categories', label: 'Lack of deterministic rules separating Col 2 capacity from Col 3 modeled', score: 3 }
            ],
            bizPains: [
              { value: 'commingled_hard_soft_roi', label: 'Commingled hard cash and soft capacity numbers stalling Finance approval', score: 5 }
            ]
          },
          {
            question: 'How are duplicate-benefit haircuts and multi-initiative attribution shares audited prior to executive readout?',
            levels: [
              '1. Explore: No audit for overlapping benefits with concurrent cloud/ERP/automation programs',
              '2. Experiment: High-level 10% contingency haircut applied arbitrarily',
              '3. Formalize: Workflow-by-workflow review of attribution share and duplicate-claim exclusions',
              '4. Optimize: Formal pre-readout audit with Finance and PMO transformation office',
              '5. Transform: Signed cross-initiative attribution matrix with zero overlap across enterprise portfolio'
            ],
            techPains: [
              { value: 'siloed_pmo_benefit_tracking', label: 'Separate benefit trackers across AI, Cloud FinOps, and Operations PMO', score: 3 }
            ],
            bizPains: [
              { value: 'pmo_attribution_disputes', label: 'Disputes between program owners over shared workflow improvements', score: 4 }
            ]
          }
        ]
      },
      {
        name: 'Executive Sponsor & CFO Attestation',
        questions: [
          {
            question: 'What level of formal sign-off has been achieved from the Customer Finance Controller and Executive Sponsor?',
            levels: [
              '1. Explore: Draft working model only; not yet reviewed with Sponsor or Finance',
              '2. Experiment: Reviewed with IT project lead; Business and Finance sign-off pending',
              '3. Formalize: Business Workflow Owners and Executive Sponsor aligned on Col 2/Col 4 outcomes',
              '4. Optimize: Finance Controller sign-off on Col 1 cost bridge and Col 2 capacity ledger',
              '5. Transform: Formal multi-party executive attestation (Sponsor + CFO + CISO) locked for board & renewal'
            ],
            techPains: [
              { value: 'pending_signoff_workflow', label: 'Pending final invoice/GL cutoff for current quarter sign-off', score: 3 }
            ],
            bizPains: [
              { value: 'unsigned_value_dossier', label: ' entering renewal negotiations without Finance-signed value dossier', score: 5 }
            ]
          },
          {
            question: 'How actionable is the 90-day value expansion roadmap for converting Col 2/Col 3 opportunities into realized savings?',
            levels: [
              '1. Explore: No post-assessment action plan or expansion roadmap defined',
              '2. Experiment: High-level wish list of future AI use cases without owners or timelines',
              '3. Formalize: Prioritized 90-day action plan addressing top adoption and connector blockers',
              '4. Optimize: Quantified 30-60-90 day roadmap converting Col 3 pipeline workflows into Col 2/Col 1 value',
              '5. Transform: Fully funded, owner-assigned value expansion roadmap tied to next wave deployment'
            ],
            techPains: [
              { value: 'backlog_prioritization_gap', label: 'Connector and agent engineering backlog not ranked by dollar impact', score: 3 }
            ],
            bizPains: [
              { value: 'stalled_wave2_expansion', label: 'Delayed progression from Wave 1 proof to Wave 2 enterprise scale', score: 4 }
            ]
          }
        ]
      }
    ]
  }
];

function buildGeValueRealizationFramework(baseFramework) {
  const cloned = JSON.parse(JSON.stringify(baseFramework));
  cloned.customTrackKey = 'ge_value_realization';
  cloned.frameworkTitle = 'Gemini Enterprise Value Realization Assessment';
  cloned.reportTitle = 'Gemini Enterprise Value Realization Report';
  cloned.assessmentAreas = cloned.assessmentAreas.map((baseArea, areaIdx) => {
    const spec = GE_VR_PILLARS_SPEC[areaIdx] || GE_VR_PILLARS_SPEC[0];
    return {
      ...baseArea,
      id: baseArea.id,
      name: spec.name,
      description: spec.description,
      goal: spec.goal,
      dimensions: baseArea.dimensions.map((baseDim, dimIdx) => {
        const dimSpec = spec.dimensions[dimIdx] || spec.dimensions[0];
        return {
          ...baseDim,
          name: dimSpec.name,
          questions: baseDim.questions.map((baseQ, qIdx) => {
            const qSpec = dimSpec.questions[qIdx] || dimSpec.questions[0];
            const levelOptions = (qSpec.levels || []).map((lbl, idx) => ({
              value: idx + 1,
              label: lbl,
              score: idx + 1
            }));
            return {
              ...baseQ,
              id: baseQ.id,
              question: qSpec.question,
              perspectives: [
                {
                  id: 'current_state',
                  label: 'Current State',
                  type: 'single_choice',
                  options: levelOptions
                },
                {
                  id: 'future_state',
                  label: 'Future State Vision',
                  type: 'single_choice',
                  options: levelOptions
                },
                {
                  id: 'technical_pain',
                  label: 'Technical Pain Points',
                  type: 'multiple_choice',
                  options: qSpec.techPains || baseQ.perspectives?.[2]?.options || []
                },
                {
                  id: 'business_pain',
                  label: 'Business Pain Points',
                  type: 'multiple_choice',
                  options: qSpec.bizPains || baseQ.perspectives?.[3]?.options || []
                }
              ],
              commentBox: {
                label: 'Evidence & Value Realization Notes',
                placeholder: 'Document system-of-record evidence, cohort telemetry, or CFO ledger notes...'
              }
            };
          })
        };
      })
    };
  });
  return cloned;
}

function loadCustomAssessmentTypesMap() {
  try {
    const dataDir = process.env.DATA_DIR || path.join(__dirname, '../../data');
    const file = path.join(dataDir, 'custom_assessment_types.json');
    if (fs.existsSync(file)) {
      return JSON.parse(fs.readFileSync(file, 'utf8'));
    }
  } catch (err) {
    // ignore
  }
  return {};
}

function loadDynamicInstancesMap() {
  try {
    const dataDir = process.env.DATA_DIR || path.join(__dirname, '../../data');
    const file = path.join(dataDir, 'dynamic_assessments.json');
    if (fs.existsSync(file)) {
      return JSON.parse(fs.readFileSync(file, 'utf8'));
    }
  } catch (err) {
    // ignore
  }
  return {};
}

const PILLAR_ICONS = ['🧱', '🚀', '💰', '🤖', '🛡️', '⚡'];
const CUSTOM_SUBDIMENSION_LENSES = [
  'Architecture & Design Baseline',
  'Automation & Execution Velocity',
  'Observability & SLA Telemetry',
  'Security & Governance Controls',
  'CFO Value & FinOps Realization'
];
const MATURITY_STAGE_NAMES = ['Explore', 'Experiment', 'Formalize', 'Optimize', 'Transform'];

function buildCustomTrackFramework(typeDef, baseFramework) {
  const customDims = typeDef?.framework?.dimensions;
  if (!Array.isArray(customDims) || customDims.length === 0) {
    return baseFramework;
  }
  const cloned = JSON.parse(JSON.stringify(baseFramework));
  cloned.customTrackKey = typeDef.key || typeDef.title || 'custom_track';
  cloned.frameworkTitle = typeDef.title || 'Enterprise Assessment';
  cloned.reportTitle = `${typeDef.title || 'Enterprise Assessment'} Report`;

  cloned.assessmentAreas = cloned.assessmentAreas.map((baseArea, areaIdx) => {
    const srcDim = customDims[areaIdx % customDims.length];
    const cleanDimName = String(srcDim.name || baseArea.name).replace(/^\d+\.\s*/, '');
    const icon = PILLAR_ICONS[areaIdx % PILLAR_ICONS.length];
    const pillarTitle = areaIdx < customDims.length
      ? `${icon} ${cleanDimName}`
      : `${icon} Executive Governance & Value Realization`;
    const srcQuestions = Array.isArray(srcDim.questions) && srcDim.questions.length > 0
      ? srcDim.questions
      : [];

    return {
      ...baseArea,
      id: baseArea.id,
      name: pillarTitle,
      description: srcDim.description || typeDef.subtitle || typeDef.description || baseArea.description,
      goal: srcDim.description || typeDef.subtitle || baseArea.goal,
      dimensions: baseArea.dimensions.map((baseDim, dimIdx) => {
        const subQ1 = srcQuestions[(dimIdx * 2) % Math.max(1, srcQuestions.length)];
        const subQ2 = srcQuestions[(dimIdx * 2 + 1) % Math.max(1, srcQuestions.length)];
        const lensLabel = CUSTOM_SUBDIMENSION_LENSES[dimIdx % CUSTOM_SUBDIMENSION_LENSES.length];
        const dimLabel = dimIdx === 0
          ? cleanDimName
          : `${cleanDimName}: ${lensLabel}`;

        return {
          ...baseDim,
          name: dimLabel,
          questions: baseDim.questions.map((baseQ, qIdx) => {
            const cQ = qIdx === 0 ? subQ1 : subQ2;
            if (!cQ) return baseQ;

            const levelOptions = Array.isArray(cQ.options) && cQ.options.length > 0
              ? cQ.options.map((opt, idx) => {
                  const stripped = String(opt.label || '')
                    .replace(/^\d+\.\s*/, '')
                    .replace(/^Level\s*\d+\s*:\s*/i, '');
                  const stageName = MATURITY_STAGE_NAMES[idx] || `Level ${idx + 1}`;
                  return {
                    value: opt.value || idx + 1,
                    score: opt.score || idx + 1,
                    label: stripped.toLowerCase().startsWith(stageName.toLowerCase())
                      ? `${idx + 1}. ${stripped}`
                      : `${idx + 1}. ${stageName}: ${stripped}`
                  };
                })
              : baseQ.perspectives?.[0]?.options || [];

            const techPainOptions = Array.isArray(cQ.technicalPainPoints) && cQ.technicalPainPoints.length > 0
              ? cQ.technicalPainPoints.map((tp, idx) => (
                  typeof tp === 'string'
                    ? { value: `tp_${idx + 1}`, label: tp, score: 4 }
                    : tp
                ))
              : baseQ.perspectives?.[2]?.options || [];

            const bizPainOptions = Array.isArray(cQ.businessPainPoints) && cQ.businessPainPoints.length > 0
              ? cQ.businessPainPoints.map((bp, idx) => (
                  typeof bp === 'string'
                    ? { value: `bp_${idx + 1}`, label: bp, score: 4 }
                    : bp
                ))
              : baseQ.perspectives?.[3]?.options || [];

            return {
              ...baseQ,
              id: baseQ.id,
              question: dimIdx === 0
                ? (cQ.text || cQ.question || baseQ.question)
                : `${cQ.text || cQ.question || baseQ.question} (${lensLabel})`,
              perspectives: [
                {
                  id: 'current_state',
                  label: 'Current State',
                  type: 'single_choice',
                  options: levelOptions
                },
                {
                  id: 'future_state',
                  label: 'Future State Vision',
                  type: 'single_choice',
                  options: levelOptions
                },
                {
                  id: 'technical_pain',
                  label: 'Technical Pain Points',
                  type: 'multiple_choice',
                  options: techPainOptions
                },
                {
                  id: 'business_pain',
                  label: 'Business Pain Points',
                  type: 'multiple_choice',
                  options: bizPainOptions
                }
              ],
              commentBox: {
                label: 'Operational Context & Evidence Notes',
                placeholder: cQ.guidance || 'Document architectural context, telemetry baselines, and target modernization scope...'
              }
            };
          })
        };
      })
    };
  });

  return cloned;
}

function resolveAssessmentFrameworkOverlay(assessmentId, baseFramework) {
  const idStr = String(assessmentId || '').trim();
  if (!idStr) return baseFramework;

  const isGeVrId =
    idStr.startsWith('ge_vr_') ||
    idStr.toLowerCase().startsWith('acc-') ||
    idStr === 'inst_bionova_ge_value_realization' ||
    idStr === 'inst_aerovanguard_ge_value_realization' ||
    idStr === 'bionova_ge_vr_2026_q2' ||
    idStr === 'aerovanguard_default' ||
    idStr === 'bionova';

  if (isGeVrId) {
    return buildGeValueRealizationFramework(baseFramework);
  }

  const typesMap = loadCustomAssessmentTypesMap();
  const instancesMap = loadDynamicInstancesMap();
  const dynInstance = instancesMap[idStr];
  const typeKey = dynInstance?.typeKey ||
    (idStr.startsWith('inst_') && idStr.endsWith('_demo')
      ? idStr.replace(/^inst_/, '').replace(/_demo$/, '')
      : null);

  if (typeKey && typeKey !== 'enterprise_data_ai_maturity' && typesMap[typeKey]) {
    return buildCustomTrackFramework(typesMap[typeKey], baseFramework);
  }

  return baseFramework;
}

module.exports = {
  resolveAssessmentFrameworkOverlay,
  buildGeValueRealizationFramework,
  buildCustomTrackFramework
};
