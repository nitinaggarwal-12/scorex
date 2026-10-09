/**
 * GE Value Realization Assessment Framework & Deterministic Calculation Engine
 * (BioNova Life Sciences Inc. — Homegrown OpenAI [NovaAssist] to Gemini Enterprise Migration)
 *
 * Implements:
 * - 75 Questions across 10 Modules (C, P, A, L, W, U, Q, F, V, G)
 * - 6 Role-Based Respondent Forms with Skip Logic
 * - 3 Independent Calculation Engines:
 *   1) Deterministic Financial & Capacity Ledger (5 MECE Columns + Low/Base/High Sensitivity)
 *   2) 0-100 Weighted Value & Evidence Index (Raw vs. Evidence-Adjusted, Capped Hybrid Workflow Rollup)
 *   3) 5 Non-Compensable Governance Gates + Cross-Module Contradiction Detector
 * - Pre-staged BioNova Life Sciences Inc. (ACC-1002-BIONOVA) Dossier + Clean Intake Template
 */

const EVIDENCE_FACTORS = {
  A: { tier: 'A', label: 'Tier A: System-of-Record + Independent Validation', factor: 1.0, color: '#059669' },
  B: { tier: 'B', label: 'Tier B: Sound Sampled Measured Comparison', factor: 0.75, color: '#2563eb' },
  C: { tier: 'C', label: 'Tier C: Self-Report / Survey / Scoping Model', factor: 0.40, color: '#d97706' },
  D: { tier: 'D', label: 'Tier D: Unsupported Hypothesis / Pending Evidence', factor: 0.0, color: '#64748b' }
};

const GE_MODULES = [
  {
    id: 'C',
    code: 'C',
    title: 'Adaptive Configuration',
    shortTitle: 'Adaptive Config (C01–C11)',
    ownerRole: 'Assessment Lead + Sponsor + Analytics',
    weight: 0,
    isRoutingOnly: true,
    description: 'Complete before issuing questionnaires. Determines assessment tier (Focused, Enterprise, Regulated/Complex) and activates applicable pharma and geography modules.'
  },
  {
    id: 'P',
    code: 'P',
    title: 'Program & Migration Scope',
    shortTitle: 'Program Scope (P01–P08)',
    ownerRole: 'Executive Sponsor / Platform Owner',
    weight: 0,
    isRoutingOnly: true,
    description: 'Establishes migration rationale, cutover model, eligible population denominators, capability/connector parity, and value-claim approvers.'
  },
  {
    id: 'A',
    code: 'A',
    title: 'Adoption & Access',
    shortTitle: 'Adoption & Access (15 pts)',
    ownerRole: 'Analytics / Enablement Lead',
    weight: 15,
    kpaId: 'adoption_access',
    description: 'Measures cohort activation funnel (Eligible → Provisioned → Assigned → MAU → WAU → Repeat Active), task completion, feature usage, and ranked blockers.'
  },
  {
    id: 'L',
    code: 'L',
    title: 'Legacy & Gemini Platform Economics',
    shortTitle: 'Platform Economics (20 pts)',
    ownerRole: 'Platform / Procurement / Finance',
    weight: 20,
    kpaId: 'platform_economics',
    description: 'Reconciles annual legacy baseline AI/search costs, actual avoidable cost retired post-cutover, Gemini recurring costs, one-time migration spend, and payback months.'
  },
  {
    id: 'W',
    code: 'W',
    title: 'Priority Workflow Records (Repeatable)',
    shortTitle: 'Workflow Outcomes (35 pts)',
    ownerRole: 'Workflow Business Owners',
    weight: 35,
    kpaId: 'workflow_outcomes',
    isRepeatable: true,
    description: 'Repeats per priority workflow (W01–W13). Captures 6-stage before/after task effort, first-pass quality, rework, cycle time, and financial realization class.'
  },
  {
    id: 'U',
    code: 'U',
    title: 'Employee Pulse Survey (30-Day Recall)',
    shortTitle: 'Employee Survey (10 pts)',
    ownerRole: 'Sampled Users & Nonusers',
    weight: 10,
    kpaId: 'user_experience',
    description: 'Stratified 30-day recall survey comparing legacy baseline tools and Gemini Enterprise. Self-reported minutes never feed realized financial savings.'
  },
  {
    id: 'Q',
    code: 'Q',
    title: 'Quality, Risk & Governance',
    shortTitle: 'Quality, Risk & Governance (20 pts)',
    ownerRole: 'Security / QA / Compliance / Ops',
    weight: 20,
    kpaId: 'quality_governance',
    description: 'Evaluates blinded quality testing, severity-weighted defect rates, source permission enforcement, P50/P95 latency, and compliance validation.'
  },
  {
    id: 'F',
    code: 'F',
    title: 'Finance Validation & Executive Sign-Off',
    shortTitle: 'Finance Sign-Off (F01–F08)',
    ownerRole: 'Customer Finance + Executive Sponsor',
    weight: 0,
    isRoutingOnly: true,
    description: 'Defines approved loaded hourly rates, realization factors (0–100%), attribution share, duplicate-benefit exclusions, and multi-party sign-off.'
  },
  {
    id: 'V',
    code: 'V',
    title: 'Domain & Enterprise Add-On Modules',
    shortTitle: 'Domain Verticals (V01–V08)',
    ownerRole: 'Domain Process Owners & Compliance QA',
    weight: 0,
    isEvidenceAddon: true,
    description: 'Provides domain-specific evidence for linked core questions (W07, W09, A03, Q02, Q03, Q06) across enterprise operations, customer service, engineering, and regulated workflows.'
  },
  {
    id: 'G',
    code: 'G',
    title: 'Multi-Geography & Language Rollout',
    shortTitle: 'Geography Waves (G01–G05)',
    ownerRole: 'Regional Rollout & Privacy Leads',
    weight: 0,
    isEvidenceAddon: true,
    description: 'Segments A01/W02/W03 by country launch date, language equivalence, and local EU Works Council / privacy restrictions.'
  }
];

const RESPONDENT_FORMS = [
  {
    id: 'all_modules',
    title: 'Full Assessment Architect View (All 82 Qs)',
    recipient: 'Value Engineering & Program Leads',
    badge: '82 Questions',
    questionIds: null // all
  },
  {
    id: 'executive_sponsor',
    title: '1. Executive Sponsor Form',
    recipient: 'Customer Executive Sponsor + Business Leads',
    badge: '9 Questions',
    skipRule: 'One enterprise response, then brief validation workshop.',
    questionIds: ['P01', 'P02', 'P03', 'P07', 'P08', 'F07', 'F08', 'W01', 'W09']
  },
  {
    id: 'platform_analytics',
    title: '2. Platform & Analytics Form',
    recipient: 'IT Platform Owner & Telemetry Analyst',
    badge: '22 Questions',
    skipRule: 'One response per platform and reporting period; add regional segment records.',
    questionIds: ['C04', 'C06', 'C07', 'C08', 'P02', 'P03', 'P04', 'P05', 'P06', 'A01', 'A02', 'A03', 'A04', 'A05', 'A06', 'A07', 'Q04', 'G01', 'G02', 'G03', 'G04', 'G05']
  },
  {
    id: 'procurement_finance',
    title: '3. Procurement & Finance Form',
    recipient: 'Procurement, FinOps & Customer Finance Controller',
    badge: '13 Questions',
    skipRule: 'One cost ledger with monthly history; renewal adds committed contract terms and forecast.',
    questionIds: ['L01', 'L02', 'L03', 'L04', 'L05', 'L06', 'F01', 'F02', 'F03', 'F04', 'F05', 'F06', 'F08']
  },
  {
    id: 'workflow_owner',
    title: '4. Priority Workflow Owner Form (Repeatable)',
    recipient: 'Accountable Lead per Priority Use Case / Business Unit',
    badge: '15 Questions / WF',
    skipRule: 'Repeat by materially distinct workflow and cohort, not by individual user.',
    questionIds: ['W01', 'W02', 'W03', 'W04', 'W05', 'W06', 'W07', 'W08', 'W09', 'W10', 'W11', 'W12', 'W13', 'Q01', 'Q02']
  },
  {
    id: 'employee_pulse',
    title: '5. Employee Pulse Survey (30-Day Recall)',
    recipient: 'Sampled Eligible Users, Active Users & Nonusers',
    badge: '10 Questions',
    skipRule: 'Show old-vs-new comparison (U04/U06) only to users who experienced both; route nonusers to blockers.',
    questionIds: ['U01', 'U02', 'U03', 'U04', 'U05', 'U06', 'U07', 'U08', 'U09', 'U10']
  },
  {
    id: 'security_compliance',
    title: '6. Security, Privacy & Compliance Validation Form',
    recipient: 'CISO Security, Privacy, Compliance QA & Process Owners',
    badge: '14 Questions',
    skipRule: 'Only relevant regulated use cases; approve use, evidence, and severity interpretation.',
    questionIds: ['Q01', 'Q02', 'Q03', 'Q04', 'Q05', 'Q06', 'V01', 'V02', 'V03', 'V04', 'V05', 'V06', 'V07', 'V08']
  }
];

const KPA_DEFINITIONS = [
  {
    id: 'platform_economics',
    name: 'Platform Economics',
    title: 'Platform Economics',
    weight: 20,
    okrId: 'O1',
    okrTitle: 'O1: Realize defensible migration economics',
    krSummary: 'KR1: Reconcile 12-mo legacy & GE cost bridge • KR2: Retire avoidable legacy run-rate • KR3: Meet approved payback target (≤12 mos)',
    primaryKpis: ['Retired Legacy Run Cost ($)', 'Gemini Incremental Run Cost ($)', 'Net Platform Cost Delta ($)', 'Payback Period (Months)'],
    questionWeights: { L01: 4, L02: 5, L03: 4, L04: 2, L05: 3, L06: 2 }
  },
  {
    id: 'workflow_outcomes',
    name: 'Workflow Outcomes',
    title: 'Workflow Outcomes',
    weight: 35,
    okrId: 'O2',
    okrTitle: 'O2: Improve meaningful priority work',
    krSummary: 'KR1: Validate ≥5 priority workflows • KR2: Achieve ≥25% median task effort/cycle reduction • KR3: Maintain/improve first-pass quality',
    primaryKpis: ['Completed Tasks/Mo', 'Median Task Effort (Min incl. QA)', 'Gross Hours Released/Mo', 'First-Pass Acceptance (%)', 'End-to-End Cycle Time'],
    questionWeights: { W01: 1, W02: 3, W03: 4, W04: 5, W05: 2, W06: 2, W07: 5, W08: 2, W09: 4, W10: 3, W11: 2, W12: 1, W13: 1 }
  },
  {
    id: 'adoption_access',
    name: 'Adoption & Access',
    title: 'Adoption & Access',
    weight: 15,
    okrId: 'O3',
    okrTitle: 'O3: Expand useful, repeat adoption',
    krSummary: 'KR1: Hit ≥50% WAU/Assigned repeat-use target • KR2: Reduce access/connector blockers <10% • KR3: Demonstrate completed tasks',
    primaryKpis: ['Provisioned / Eligible (%)', 'WAU / Assigned Seats (%)', 'Repeat Active Users (2+ wks)', 'Task Completion Success (%)', 'Blocked Users (%)'],
    questionWeights: { A01: 4, A02: 2, A03: 3, A04: 1, A05: 2, A06: 1, A07: 2 }
  },
  {
    id: 'quality_governance',
    name: 'Quality, Reliability & Governance',
    title: 'Quality, Reliability & Governance',
    weight: 20,
    okrId: 'O4',
    okrTitle: 'O4: Operate safely and reliably in approved scope',
    krSummary: 'KR1: Zero unresolved severe permission/quality defects • KR2: Meet P95 latency & uptime SLAs • KR3: Validate all regulated workflows',
    primaryKpis: ['Severity-Weighted Defect Rate (%)', 'Citation Verification Rate (%)', 'Permission/ACL Pass Rate (%)', 'P95 Latency & Uptime (%)', 'Compliance Validation Coverage'],
    questionWeights: { Q01: 3, Q02: 5, Q03: 5, Q04: 3, Q05: 2, Q06: 2 }
  },
  {
    id: 'user_experience',
    name: 'Employee Experience',
    title: 'Employee Experience',
    weight: 10,
    okrId: 'O3',
    okrTitle: 'O3/O4: Improve task usefulness and user confidence',
    krSummary: 'KR1: Achieve ≥4.0/5.0 composite experience rating • KR2: ≥75% preference over legacy baseline at representative response rate',
    primaryKpis: ['Composite Experience Rating (1–5)', 'Perceived Time Saved (Min)', 'Would Choose Gemini Again (%)', 'Independent Verification Rate (%)'],
    questionWeights: { U01: 1, U02: 0, U03: 1, U04: 2, U05: 1, U06: 2, U07: 1, U08: 1, U09: 1, U10: 0 }
  }
];

const RUBRIC_TEMPLATES = {
  cost_inventory: [
    { score: 0, label: '0: Unmeasured / Missing', desc: 'Cost inventory missing or unreconciled to invoices/contracts' },
    { score: 1, label: '1: Partial Estimate', desc: 'Rough top-line estimate only; support FTEs & infra omitted' },
    { score: 2, label: '2: Documented Summary', desc: 'Major categories documented with minor period/allocation gaps' },
    { score: 3, label: '3: Reconciled Ledger', desc: 'All direct API, hosting, connector & support costs reconciled' },
    { score: 4, label: '4: Audited & Owned', desc: 'Fully reconciled to invoices/timesheets across comparable 12-mo window' }
  ],
  retired_cost: [
    { score: 0, label: '0: Cost Up >20% / Unsupported', desc: 'Net recurring platform cost up >20% or claimed retirement unsupported' },
    { score: 1, label: '1: Cost Up 1–20%', desc: 'Net recurring cost up 1–20% due to unretired parallel run' },
    { score: 2, label: '2: Roughly Flat (±1%)', desc: 'Recurring platform cost roughly flat (±1%) vs. legacy baseline' },
    { score: 3, label: '3: Down >1–10%', desc: 'Avoidable legacy cost retired; net recurring platform cost down 1–10%' },
    { score: 4, label: '4: Down >10% Verified', desc: 'Net recurring cost down >10%, documented and attributable' }
  ],
  transition_payback: [
    { score: 0, label: '0: Unmeasured / Exceeds', desc: 'Unmeasured or migration costs exceed validated first-year benefit' },
    { score: 1, label: '1: Payback >36 mos', desc: 'Payback period exceeds 36 months' },
    { score: 2, label: '2: Payback 19–36 mos', desc: 'Payback period between 19 and 36 months' },
    { score: 3, label: '3: Payback 7–18 mos', desc: 'Payback period between 7 and 18 months' },
    { score: 4, label: '4: Payback ≤6 mos', desc: 'Payback ≤6 months with verified benefit & transition ledger' }
  ],
  adverse_costs: [
    { score: 0, label: '0: Material Unresolved Cost', desc: 'Material unresolved incremental cost or service degradation' },
    { score: 1, label: '1: Measured & Rising', desc: 'Workaround / extra license cost impact measured but rising' },
    { score: 2, label: '2: Net Neutral', desc: 'Minor transition workarounds; net neutral cost impact' },
    { score: 3, label: '3: Impact Falling', desc: 'Adverse workaround costs measured and actively falling' },
    { score: 4, label: '4: Measurably Reduced', desc: 'Zero unresolved degradation; adverse costs measurably reduced' }
  ],
  allocation_integrity: [
    { score: 0, label: '0: No Defensible Rule', desc: 'No defensible cost apportionment or shared-cost rule' },
    { score: 1, label: '1: Broad Unexplained', desc: 'Broad enterprise lump sum without cohort/seat breakdown' },
    { score: 2, label: '2: Documented Enterprise', desc: 'Documented enterprise seat/consumption allocation rule' },
    { score: 3, label: '3: Cohort & Workflow', desc: 'Apportioned by active cohort and priority workflow' },
    { score: 4, label: '4: Reconciled to Billing', desc: 'Reconciled to billing centers with Finance-owned allocation rule' }
  ],
  workflow_coverage: [
    { score: 0, label: '0: No Owner / Baseline', desc: 'No owner, denominator, comparable baseline, or inactive workflow' },
    { score: 1, label: '1: Material Gaps', desc: 'Defined workflow but missing task counts or comparison window' },
    { score: 2, label: '2: Defined w/ Caveat', desc: 'Defined owner & tasks with material comparability caveat' },
    { score: 3, label: '3: Comparable & Owned', desc: 'Comparable pre/post cohort and signed workflow owner' },
    { score: 4, label: '4: System Evidence', desc: 'Repeated, comparable system-of-record evidence and signed owner' }
  ],
  task_outcome: [
    { score: 0, label: '0: Worsening / Defect', desc: 'Meaningful worsening in task time/quality or severe unmitigated issue' },
    { score: 1, label: '1: Slightly Negative', desc: 'Worse or slightly negative net effort after review/rework' },
    { score: 2, label: '2: No Material Change', desc: 'Within noise threshold (±5%) after checking and corrections' },
    { score: 3, label: '3: Meets Target (≥25%)', desc: 'Improvement meets pre-agreed KR target at equal or better quality' },
    { score: 4, label: '4: Exceeds Target (≥50%)', desc: 'Improvement exceeds exceptional target at verified higher quality' }
  ],
  output_use: [
    { score: 0, label: '0: <25% Used', desc: '<25% of Gemini output accepted/used in deliverable' },
    { score: 1, label: '1: 25–49% Used', desc: '25–49% of Gemini output used; heavy rewrite required' },
    { score: 2, label: '2: 50–74% Used', desc: '50–74% of Gemini output used with moderate editing' },
    { score: 3, label: '3: 75–89% Used', desc: '75–89% of Gemini output used with standard review' },
    { score: 4, label: '4: ≥90% Verified', desc: '≥90% accepted and verified with representative sample' }
  ],
  financial_realization: [
    { score: 0, label: '0: No Route to Value', desc: 'No approved route to realization or unit value' },
    { score: 1, label: '1: Modeled Only', desc: 'Modeled pre-sales/scoping hypothesis only (Column 3)' },
    { score: 2, label: '2: Capacity Proxy Only', desc: 'Hours released or outcome proxy, no confirmed financial conversion' },
    { score: 3, label: '3: Owner Validated', desc: 'Business owner validates throughput increase or cost avoidance' },
    { score: 4, label: '4: Finance Signed Cash', desc: 'Finance-approved actual spend reduction or incremental outcome; zero overlap' }
  ],
  adoption: [
    { score: 0, label: '0: <25% of Target', desc: 'Achieves <25% of pre-agreed cohort adoption/completion target' },
    { score: 1, label: '1: 25–49% of Target', desc: 'Achieves 25–49% of agreed cohort target' },
    { score: 2, label: '2: 50–74% of Target', desc: 'Achieves 50–74% of agreed cohort target' },
    { score: 3, label: '3: 75–99% of Target', desc: 'Achieves 75–99% of pre-agreed cohort target' },
    { score: 4, label: '4: ≥100% Validated', desc: '≥100% of pre-agreed cohort target with validated denominator' }
  ],
  blockers: [
    { score: 0, label: '0: >20% Blocked', desc: 'Critical blockers preventing use for >20% of eligible cohort' },
    { score: 1, label: '1: >10–20% Blocked', desc: 'Blockers affecting 10–20% of eligible users' },
    { score: 2, label: '2: >5–10% Blocked', desc: 'Bounded connector/access blockers affecting 5–10% of users' },
    { score: 3, label: '3: >0–5% Blocked', desc: 'Minor blockers affecting <5% of users with active remediation' },
    { score: 4, label: '4: No Material Blockers', desc: 'No material blockers; connector & access parity verified' }
  ],
  quality_ops: [
    { score: 0, label: '0: Severe Unresolved', desc: 'Severe unresolved defect, access leak, or material degradation' },
    { score: 1, label: '1: Below Minimum', desc: 'Testing coverage or quality/latency below minimum threshold' },
    { score: 2, label: '2: Meets w/ Caveat', desc: 'Meets legacy baseline with bounded caveats or pending connector tests' },
    { score: 3, label: '3: Better than Baseline', desc: 'Measurable improvement on pre-agreed quality/latency/control metric' },
    { score: 4, label: '4: Sustained & Monitored', desc: 'Sustained improvement with adequate sampling and zero critical defects' }
  ],
  experience: [
    { score: 0, label: '0: Mean <2.0 / Strongly Neg', desc: 'Mean <2.0/5.0 or >30 min slower after review' },
    { score: 1, label: '1: Mean 2.0–<3.0 / Slower', desc: 'Mean 2.0–2.9/5.0 or 11–30 min slower' },
    { score: 2, label: '2: Mean 3.0–<3.5 / Neutral', desc: 'Mean 3.0–3.4/5.0 or within ±10 min of legacy tool' },
    { score: 3, label: '3: Mean 3.5–<4.2 / Faster', desc: 'Mean 3.5–4.1/5.0 or 11–30 min faster per task' },
    { score: 4, label: '4: Mean ≥4.2 / >30m Faster', desc: 'Mean ≥4.2/5.0 with representative sample & corroborated speed' }
  ]
};

/**
 * Complete 75-Question Specification across all 10 Modules
 */
const GE_QUESTIONS = [
  // ================= C. ADAPTIVE CONFIGURATION (C01-C11) =================
  {
    id: 'C01', module: 'C', weight: 0, inputType: 'multi_select',
    question: 'What is the engagement purpose?',
    requiredEntry: 'Migration retrospective; renewal proof; expansion case; quarterly optimization; executive readout; other',
    routingConsequence: 'Retrospective requires legacy baseline; renewal adds contract and cost horizon; expansion adds forecast and unserved cohorts.',
    options: ['Migration retrospective', 'Renewal proof', 'Expansion case', 'Quarterly optimization', 'Executive readout', 'Other (specify)']
  },
  {
    id: 'C02', module: 'C', weight: 0, inputType: 'numeric_band',
    question: 'How many people are eligible?',
    requiredEntry: '<1,000; 1,000–9,999; 10,000–49,999; 50,000+; unknown; record exact count',
    routingConsequence: 'At 10,000+, report cohort-level denominators and structured sampling; at 50,000+, add rollout-wave and population-weighted rollups.',
    options: ['<1,000', '1,000–9,999', '10,000–49,999', '50,000+', 'Unknown'],
    unitLabel: 'eligible people'
  },
  {
    id: 'C03', module: 'C', weight: 0, inputType: 'single_select',
    question: 'What is the expected annual contract value (ACV)?',
    requiredEntry: 'Customer-defined bands or confidential numeric entry; not disclosed (Never shown in employee forms; never multiplies claimed value)',
    routingConsequence: 'Determines executive review cadence and analytical resources, never multiplies claimed value.',
    options: ['Tier 1 Strategic Alliance ($10M+ ACV / 85k Seats)', 'Enterprise Band ($1M–$10M ACV)', 'Focused Band (<$1M ACV)', 'Confidential / Not Disclosed in Tool']
  },
  {
    id: 'C04', module: 'C', weight: 0, inputType: 'single_select',
    question: 'How many countries and languages are in scope?',
    requiredEntry: '1; 2–5; 6+; enter list, launch dates, language and business calendar',
    routingConsequence: 'If >1, enable geography module (G01–G05); report pre/post by comparable region and rollout wave.',
    options: ['1 country / single language', '2–5 countries / languages', '6+ countries / global multi-language']
  },
  {
    id: 'C05', module: 'C', weight: 0, inputType: 'multi_select',
    question: 'Which regulated context applies?',
    requiredEntry: 'None; GxP; clinical; medical information; pharmacovigilance; privacy; commercial/promotional; other',
    routingConsequence: 'Enable only applicable pharma modules (V01–V08); obtain process owner and compliance/validation review. Auto-escalates tier to Regulated / Complex.',
    options: ['None', 'GxP (Manufacturing / Quality / CSV)', 'Clinical Operations (GCP)', 'Medical / Scientific Information', 'Pharmacovigilance / Drug Safety', 'Data Privacy / Works Council', 'Commercial / Promotional (MLR)', 'Other (specify)']
  },
  {
    id: 'C06', module: 'C', weight: 0, inputType: 'multi_select',
    question: 'What is the integration pattern?',
    requiredEntry: 'Standalone app; Microsoft 365/SharePoint/OneDrive; Enterprise CRM; other enterprise sources; custom agents/API; multiple',
    routingConsequence: 'Enable connector and agent questions (P05, V07, V08) for deployed capabilities only.',
    options: ['Standalone web app', 'Microsoft 365 / SharePoint / OneDrive', 'Enterprise CRM', 'OmniDesk ITSM (OOTB & MCP)', 'RegVault DMS (Regulatory / Clinical)', 'BigQuery / Enterprise Data Lakehouse', 'Custom Agents / ADK / API', 'Multiple enterprise integrations']
  },
  {
    id: 'C07', module: 'C', weight: 0, inputType: 'single_select',
    question: 'What is the state of the previous system (Legacy NovaAssist / OpenAI)?',
    requiredEntry: 'Fully decommissioned; parallel run; retained for subset; unknown',
    routingConsequence: 'Parallel run requires cost and usage attribution and date-bounded separation from L02 retired savings; decommissioned requires retirement evidence.',
    options: ['Fully decommissioned', 'Parallel run (Coexistence during transition)', 'Retained for specific subset', 'Unknown']
  },
  {
    id: 'C08', module: 'C', weight: 0, inputType: 'single_select',
    question: 'What usable legacy baseline exists?',
    requiredEntry: 'Logs + cost + workflow outcomes; logs + cost; cost only; survey recall only; none',
    routingConsequence: 'Select measured comparison, targeted timed study, or scenario estimate; prevent unsupported enterprise-wide extrapolation.',
    options: ['Logs + cost + workflow outcomes (Full system baseline)', 'Logs + cost only', 'Cost only', 'Survey recall / pilot timed study only', 'None']
  },
  {
    id: 'C09', module: 'C', weight: 0, inputType: 'single_select',
    question: 'How many priority workflows are investigated?',
    requiredEntry: '1–3; 4–8; 9+; undecided',
    routingConsequence: 'Start with highest volume/value/risk, then sample by function; do not survey every task.',
    options: ['1–3 workflows (Focused)', '4–8 workflows (Enterprise Standard)', '9+ workflows (Broad Portfolio)', 'Undecided']
  },
  {
    id: 'C10', module: 'C', weight: 0, inputType: 'multi_select',
    question: 'What data access is approved by customer data owners?',
    requiredEntry: 'Aggregated analytics; pseudonymous event data; opt-in survey; timed observation; finance cost data; none',
    routingConsequence: 'Only issue instruments and joins that BioNova data owners approve; aggregate reporting where Works Council / privacy rules require.',
    options: ['Aggregated platform analytics', 'Pseudonymous event data', 'Opt-in employee pulse survey', 'Timed workflow observation study', 'Finance cost & invoice data', 'None']
  },
  {
    id: 'C11', module: 'C', weight: 0, inputType: 'multi_select',
    question: 'What is the primary executive audience and cadence?',
    requiredEntry: 'CFO/Finance; CIO/platform; business leads; risk/compliance; quarterly steering; renewal',
    routingConsequence: 'Tailor executive output to decisions while maintaining the same underlying evidence ledger.',
    options: ['CFO / Finance Leadership', 'CIO / Platform Engineering', 'Business Unit Leads (R&D, Clinical, Commercial, Mfg)', 'Risk / Compliance / GxP QA', 'Quarterly Joint Steering Committee', 'Renewal / Expansion Executive Readout']
  },

  // ================= P. PROGRAM & MIGRATION SCOPE (P01-P08) =================
  {
    id: 'P01', module: 'P', weight: 0, inputType: 'multi_select_rank', rankLimit: 3,
    question: 'Why was the migration from NovaAssist (OpenAI) to Gemini Enterprise undertaken?',
    requiredEntry: 'Multi-select: lower cost; broader access; better answer quality; enterprise search; agents/workflows; security/governance; supportability; vendor strategy; other. Rank top three.',
    options: ['Enterprise search & grounding', 'Agents / multi-step workflows', 'Broader employee access (85k scale)', 'Better answer quality & citations', 'Lower total cost of ownership', 'Security, VPC-SC & governance', 'Supportability & managed connectors', 'Strategic Google Cloud alliance', 'Other (specify)']
  },
  {
    id: 'P02', module: 'P', weight: 0, inputType: 'single_select',
    question: 'What was the migration model and cutover schedule?',
    requiredEntry: 'Full replacement; partial replacement; coexistence; phased by function; phased by geography; other. Enter cutover dates.',
    options: ['Phased by function & wave (300 pilot → 10.6k Wave 1 → 85k)', 'Coexistence / parallel run pending chat history export', 'Full immediate replacement', 'Partial replacement', 'Phased by geography', 'Other (specify)']
  },
  {
    id: 'P03', module: 'P', weight: 0, inputType: 'numeric_with_unit',
    question: 'What is the eligible and provisioned population across cohorts?',
    requiredEntry: 'Enter eligible headcount by function, geography, employee/contractor, and license type, plus measurement-period dates.',
    unitLabel: 'seats provisioned'
  },
  {
    id: 'P04', module: 'P', weight: 0, inputType: 'capability_matrix',
    question: 'Which capabilities existed in each platform (Legacy NovaAssist vs. Gemini Enterprise)?',
    requiredEntry: 'Matrix for chat; enterprise search; grounded answers; connectors; document analysis; agents; research; creation; APIs: old only / both / Gemini only / neither / unknown.',
    matrixRows: ['Conversational Chat', 'Enterprise Search', 'Grounded Answers w/ Citations', 'Enterprise Connectors (M365/OmniDesk ITSM/RegVault)', 'Long-Context Document Analysis', 'Autonomous / ADK Agents', 'Deep Research V2', 'Multimodal Content Creation / Canvas', 'Developer APIs & MCP'],
    matrixCols: ['Old (NovaAssist) Only', 'Both Platforms', 'Gemini Only', 'Neither', 'Unknown']
  },
  {
    id: 'P05', module: 'P', weight: 0, inputType: 'connector_matrix',
    question: 'Which enterprise systems were connected and usable?',
    requiredEntry: 'For each Microsoft 365/SharePoint/OneDrive, Enterprise CRM, internal knowledge, other: connected; permission tested; indexed; actively used; blocked; not planned. Enter go-live date.',
    matrixRows: ['Microsoft 365 / SharePoint / OneDrive', 'OmniDesk ITSM (OOTB & Cloud Run MCP)', 'BigQuery / NOVA-AI Gold Layer', 'RegVault DMS (Regulatory & Clinical)', 'CoreERP / SupplySuite / LIMS / BioMES', 'Enterprise CRM / Commercial CRM'],
    matrixCols: ['Actively Used', 'Permission Tested / Pilot', 'Connected / Indexed', 'Blocked (Cloud Blocker)', 'Not Planned']
  },
  {
    id: 'P06', module: 'P', weight: 0, inputType: 'single_select',
    question: 'What happened to legacy NovaAssist users and workflows?',
    requiredEntry: 'Completely moved; partially moved; still on legacy; abandoned; replaced by another tool; unknown. Enter counts and exceptions.',
    options: ['Partially moved (Wave 1 active on GE; NovaAssist retained pending chat history export)', 'Completely moved to Gemini Enterprise', 'Still primarily on legacy tool', 'Replaced by another third-party tool', 'Abandoned', 'Unknown']
  },
  {
    id: 'P07', module: 'P', weight: 0, inputType: 'multi_select',
    question: 'What external changes or confounders affect the pre/post comparison?',
    requiredEntry: 'Multi-select: headcount; task volume; policy; process; seasonality; restructuring; other AI tools; none known. Enter dates/impacted groups.',
    options: ['Other AI tools in parallel (M365 Copilot / domain tools)', 'Community of Practice (CoP) prompt engineering rollout', 'Data platform modernization (BigQuery Gold Layer)', 'Task volume / seasonal launch spikes', 'Policy or regulatory process changes', 'Headcount / org restructuring', 'None known']
  },
  {
    id: 'P08', module: 'P', weight: 0, inputType: 'signoff_matrix',
    question: 'Who approves value claims across the 5 governance domains?',
    requiredEntry: 'Name owners for business, Finance, IT, security/privacy, and analytics; status: agreed / pending / disputed.',
    options: ['Agreed', 'Pending Verification', 'Disputed']
  },

  // ================= A. ADOPTION & ACCESS (A01-A07, 15 PTS) =================
  {
    id: 'A01', module: 'A', weight: 4, kpaId: 'adoption_access', inputType: 'funnel_matrix', rubricType: 'adoption',
    question: 'How many users were eligible, provisioned, assigned, activated, WAU, MAU, and repeat active?',
    requiredEntry: 'Actual counts by month and cohort for both platforms; define repeat active (2+ separate weeks in 30-day window).'
  },
  {
    id: 'A02', module: 'A', weight: 2, kpaId: 'adoption_access', inputType: 'single_select', rubricType: 'adoption',
    question: 'How concentrated is usage across functions, geographies, and weekly frequency bands?',
    requiredEntry: 'Actual users and events by function, geography, role, tenure, and frequency band: 0; 1 day; 2–3 days; 4+ days per week.',
    options: [
      'Cohort & feature telemetry tracked (Assist 5,386 / Search 4,992 / Agent 1,710 WAU); role/tenure drilldown pending IdP join',
      'Full granular frequency distribution (0, 1d, 2–3d, 4+d/wk) joined to HR role & geography',
      'Aggregate platform totals only; no functional segmentation',
      'Unknown / Not tracked'
    ]
  },
  {
    id: 'A03', module: 'A', weight: 3, kpaId: 'adoption_access', inputType: 'single_select', rubricType: 'adoption',
    question: 'What portion of eligible/assigned people can complete their intended task end-to-end?',
    requiredEntry: '0–20%; 21–40%; 41–60%; 61–80%; 81–100%; unknown. Enter tested count and blockers.',
    options: ['81–100%', '61–80%', '41–60%', '21–40%', '0–20%', 'Unknown']
  },
  {
    id: 'A04', module: 'A', weight: 1, kpaId: 'adoption_access', inputType: 'multi_select', rubricType: 'adoption',
    question: 'Which Gemini Enterprise features are actively used?',
    requiredEntry: 'Multi-select: chat; search; sources/citations; document analysis; agents; research; other. Enter distinct users and events by feature.',
    options: ['Conversational Assist / Chat (5,386 WAU)', 'Enterprise Search (4,992 WAU)', 'Sources & Grounded Citations', 'Document Analysis & Summarization', 'Custom Agents / ADK (1,710 WAU • 12,385 7d reqs)', 'Deep Research V2 / Canvas (Preview)', 'Other (specify)']
  },
  {
    id: 'A05', module: 'A', weight: 2, kpaId: 'adoption_access', inputType: 'multi_select_rank', rankLimit: 3, rubricType: 'blockers',
    question: 'What prevents or blocks broader use?',
    requiredEntry: 'Multi-select: awareness; access; connector gaps; permissions; relevance; latency; trust; training; unclear use case; policy; alternative tools; no blocker. Rank and enter affected user count.',
    options: [
      'Connector gaps (RegVault DMS / CoreERP / SharePoint opt-in controls)',
      'Permissions / WIF group limits & Private Endpoint access',
      'Alternative tools & Legacy NovaAssist chat history export dependency',
      'Unclear workflow observability / task tagging',
      'Awareness & role-specific prompt training',
      'Latency on complex cross-cloud queries',
      'Trust / citation verification burden',
      'Policy / GxP validation hold',
      'No blocker',
      'Other (specify)'
    ]
  },
  {
    id: 'A06', module: 'A', weight: 1, kpaId: 'adoption_access', inputType: 'multi_select', rubricType: 'adoption',
    question: 'What training and support did users receive?',
    requiredEntry: 'None; self-service; live session; champion; role-specific coaching. Enter attendance, completions, support tickets and resolution time.',
    options: ['Community of Practice (CoP) monthly live sessions & showcases', 'Embedded BU AI Champions network', 'Centralized SharePoint/Confluence Prompt & Use Case Library', 'Self-service demos & onboarding guides', 'Role-specific FDE / PSO workshop coaching', 'None']
  },
  {
    id: 'A07', module: 'A', weight: 2, kpaId: 'adoption_access', inputType: 'single_select', rubricType: 'adoption',
    question: 'How was platform usage mapped to specific business workflows?',
    requiredEntry: 'Direct task tagging; opt-in survey; sampled study; inferred from metadata; unavailable. Enter coverage and privacy approval.',
    options: [
      'Sampled pilot study + agent endpoint telemetry (Enterprise-wide workflow tagging identified as "Black Box" gap to close)',
      'Direct telemetry task tagging across all workflows',
      'Opt-in employee survey mapping only',
      'Inferred from connector metadata only',
      'Unavailable'
    ]
  },

  // ================= L. LEGACY & GEMINI COST (L01-L06, 20 PTS) =================
  {
    id: 'L01', module: 'L', weight: 4, kpaId: 'platform_economics', inputType: 'cost_ledger', rubricType: 'cost_inventory',
    question: 'What were annual legacy NovaAssist (OpenAI) platform costs?',
    requiredEntry: 'Actual $ by OpenAI/model/API, cloud/hosting/storage, search/connectors, monitoring/security, licenses, vendor support, contractor, internal support and engineering hours × approved rate. Scored on completeness/reconciliation.'
  },
  {
    id: 'L02', module: 'L', weight: 5, kpaId: 'platform_economics', inputType: 'cost_ledger', rubricType: 'retired_cost',
    question: 'Which legacy NovaAssist costs have ended or will end?',
    requiredEntry: 'Per cost: retired; contractually committed until date; partly retained; redeployed capacity; unknown. Enter amount and effective date. Scored on actual avoidable cost retired.'
  },
  {
    id: 'L03', module: 'L', weight: 4, kpaId: 'platform_economics', inputType: 'cost_ledger', rubricType: 'cost_inventory',
    question: 'What are Gemini Enterprise recurring costs?',
    requiredEntry: 'Actual $ by seats/subscription, consumption, infrastructure, connectors, logging, support and administration; document allocation/shared-cost rule. Scored on completeness/reconciliation.'
  },
  {
    id: 'L04', module: 'L', weight: 2, kpaId: 'platform_economics', inputType: 'numeric_with_unit', rubricType: 'transition_payback',
    question: 'What were one-time migration and parallel-run transition costs?',
    requiredEntry: 'Actual $ and hours for build, data preparation, security review, change management, training, consulting, parallel run, decommissioning. Scored on payback months.',
    unitLabel: 'USD one-time'
  },
  {
    id: 'L05', module: 'L', weight: 3, kpaId: 'platform_economics', inputType: 'single_select', rubricType: 'adverse_costs',
    question: 'Are there costs from service degradation, workarounds, or unmet needs?',
    requiredEntry: 'None; workaround; extra license/tool; productivity loss; unresolved. Enter volume and actual cost.',
    options: [
      'Workaround effort during parallel run (manual NovaAssist chat export & RegVault/SharePoint connector staging)',
      'None — zero service degradation or workaround cost',
      'Extra third-party license/tool retained due to feature gap',
      'Material unresolved productivity loss',
      'Unknown'
    ]
  },
  {
    id: 'L06', module: 'L', weight: 2, kpaId: 'platform_economics', inputType: 'single_select', rubricType: 'allocation_integrity',
    question: 'How are platform costs apportioned across cohorts and workflows?',
    requiredEntry: 'Enterprise total; per active user; per licensed user; per workflow; per transaction; other. Enter billing period, currency and assumption owner.',
    options: [
      'Per assigned/active seat for core GE + direct GCP project/consumption tracking for ADK agents (710492831045)',
      'Enterprise total lump sum only',
      'Per licensed seat across all 85,300 contracted users',
      'Per transaction / API call',
      'Unallocated / Unknown'
    ]
  },

  // ================= W. WORKFLOW RECORD (W01-W13, 35 PTS — REPEATABLE PER WORKFLOW) =================
  {
    id: 'W01', module: 'W', weight: 1, kpaId: 'workflow_outcomes', inputType: 'workflow_identity', rubricType: 'workflow_coverage',
    question: 'What is the workflow, business outcome, classification, and accountable owner?',
    requiredEntry: 'Name, function, owner, input, deliverable, decision/action, and business-system record; classify: search, drafting, analysis, summarization, agent action, other.'
  },
  {
    id: 'W02', module: 'W', weight: 3, kpaId: 'workflow_outcomes', inputType: 'numeric_with_unit', rubricType: 'workflow_coverage',
    question: 'How many people and completed tasks per month does this workflow cover?',
    requiredEntry: 'Actual eligible users, active users, completed tasks/month; peak/seasonal variation; source of counts.',
    unitLabel: 'completed tasks/month'
  },
  {
    id: 'W03', module: 'W', weight: 4, kpaId: 'workflow_outcomes', inputType: 'single_select', rubricType: 'workflow_coverage',
    question: 'What is the before/after comparison method?',
    requiredEntry: 'Same people/tasks pre/post; matched cohorts; timed study; retrospective survey; modeled only. Record dates and sample sizes.',
    options: [
      'Same people/tasks pre/post with system logs',
      'Timed pilot comparison study on representative task sample',
      'Matched cohort comparison',
      'Retrospective survey recall only',
      'Modeled / scoping target only'
    ]
  },
  {
    id: 'W04', module: 'W', weight: 5, kpaId: 'workflow_outcomes', inputType: 'task_time_matrix', rubricType: 'task_outcome',
    question: 'How long did one completed task take before (Legacy/Manual) and after (Gemini Enterprise)?',
    requiredEntry: 'Actual minutes for discovery, drafting, verification, correction, approval, and handoff for each platform; median and IQR spread.'
  },
  {
    id: 'W05', module: 'W', weight: 2, kpaId: 'workflow_outcomes', inputType: 'single_select', rubricType: 'workflow_coverage',
    question: 'Did task volume, complexity, or quality requirements change between periods?',
    requiredEntry: 'No; yes (describe and quantify); unknown. Record adjustment method.',
    options: [
      'No material complexity change; task mix held constant in comparison sample',
      'Yes — higher complexity/regulatory citation rigor applied (quantified & adjusted)',
      'Yes — unadjusted volume/complexity shift',
      'Unknown'
    ]
  },
  {
    id: 'W06', module: 'W', weight: 2, kpaId: 'workflow_outcomes', inputType: 'single_select', rubricType: 'output_use',
    question: 'What percent of Gemini output is accepted and used in the final deliverable?',
    requiredEntry: 'None; <25%; 25–49%; 50–74%; 75–99%; nearly all. Enter denominator and review method.',
    options: ['Nearly all (≥90%)', '75–89%', '50–74%', '25–49%', '<25%', 'None / Not yet in production']
  },
  {
    id: 'W07', module: 'W', weight: 5, kpaId: 'workflow_outcomes', inputType: 'single_select', rubricType: 'task_outcome',
    question: 'What are the first-pass quality, rework %, critical error %, and citation verification results?',
    requiredEntry: 'Actual accepted-first-pass %, rework %, critical error %, citations verified %, and review minutes per task, before/after (Auto-linked to W04 review stages).',
    options: [
      'First-pass acceptance ≥80%, rework reduced, 100% source citations verified via HITL review',
      'Meets legacy quality baseline with human verification loop (+2–4 min QA review)',
      'Pilot / scoping stage — benchmark testing in progress',
      'Higher rework or unverified hallucinations observed'
    ]
  },
  {
    id: 'W08', module: 'W', weight: 2, kpaId: 'workflow_outcomes', inputType: 'single_select', rubricType: 'task_outcome',
    question: 'What changed in end-to-end elapsed cycle time (request to approved outcome)?',
    requiredEntry: 'Actual elapsed hours/days from request to approved outcome, before/after; identify queue vs working time.',
    options: [
      'Dramatic cycle compression (>50% faster end-to-end turnaround)',
      'Moderate cycle compression (20–50% faster)',
      'Working time faster, but approval queue unchanged (<20% E2E change)',
      'No change or Scoping stage only'
    ]
  },
  {
    id: 'W09', module: 'W', weight: 4, kpaId: 'workflow_outcomes', inputType: 'multi_select', rubricType: 'task_outcome',
    question: 'What measurable business outcome changed?',
    requiredEntry: 'Multi-select: output volume; resolution; turnaround; decision quality; customer/employee satisfaction; compliance; time to milestone; none. Enter baseline, current, unit, period, source.',
    options: ['Faster turnaround / cycle time', 'Higher output volume / throughput', 'Improved decision quality & reference coverage', 'First-contact resolution / ticket deflection', 'Time to clinical/regulatory/commercial milestone', 'Compliance & audit trail completeness', 'Employee satisfaction', 'None yet (Scoping)']
  },
  {
    id: 'W10', module: 'W', weight: 3, kpaId: 'workflow_outcomes', inputType: 'single_select', rubricType: 'financial_realization',
    question: 'How is released capacity financially realized?',
    requiredEntry: 'Reduced overtime; avoided contractors; avoided hire with approved plan; more throughput with measurable value; redeployed without measured return; time saved only. Enter substantiating record.',
    options: [
      'Avoided contractors / external agency spend (Finance-substantiated → Col 1 Cash)',
      'Avoided hire with approved budget plan (Finance-substantiated → Col 1 Cash)',
      'More throughput / revenue protection with measurable value (Col 2/3)',
      'Redeployed to priority work without direct cash budget cut (Col 2 Capacity)',
      'Time saved only / Unmonetized productivity (Col 2 Capacity)'
    ]
  },
  {
    id: 'W11', module: 'W', weight: 2, kpaId: 'workflow_outcomes', inputType: 'numeric_with_unit', rubricType: 'financial_realization',
    question: 'What is the Finance-approved unit value per improved outcome?',
    requiredEntry: 'Actual approved $ per avoided error, processed case, sale, milestone, or other outcome; alternatively unmonetized. Capture Finance owner and derivation.',
    unitLabel: 'USD / outcome unit'
  },
  {
    id: 'W12', module: 'W', weight: 1, kpaId: 'workflow_outcomes', inputType: 'single_select', rubricType: 'task_outcome',
    question: 'What incremental costs, checking burden, or harms occurred in this workflow?',
    requiredEntry: 'Additional checking; errors; delays; missed sources; policy escalation; none. Enter counts, severity, actual costs.',
    options: [
      'None — zero adverse incidents; review minutes already accounted for in W04',
      'Additional human citation checking (+2–5 min/task captured in W04 stage 3)',
      'Missed sources due to unindexed connector (manual lookup fallback)',
      'Material error or policy escalation requiring rework'
    ]
  },
  {
    id: 'W13', module: 'W', weight: 1, kpaId: 'workflow_outcomes', inputType: 'single_select', rubricType: 'workflow_coverage',
    question: 'What is the current deployment maturity of this workflow?',
    requiredEntry: 'Proposed; pilot; scaled; retired; blocked. Enter effective date and next action.',
    options: ['Scaled in production', 'Pilot (Measured cohort active)', 'Proposed / Scoping (Quarantined to Col 3 Modeled Opportunity)', 'Blocked (Awaiting connector / GxP gate)', 'Retired']
  },

  // ================= U. EMPLOYEE PULSE SURVEY (U01-U10, 10 PTS) =================
  {
    id: 'U01', module: 'U', weight: 1, kpaId: 'user_experience', inputType: 'single_select', rubricType: 'adoption',
    question: 'Which tools did sampled employees use for their primary task in the last 30 days?',
    requiredEntry: 'Legacy NovaAssist; Gemini Enterprise; both; another AI tool; no AI. Frequency: never; monthly; weekly; 2–3 days/week; 4+ days/week.',
    options: [
      'Gemini Enterprise primary (≥2–3 days/wk) with <20% legacy NovaAssist co-use',
      'Both Legacy NovaAssist and Gemini Enterprise in parallel (Coexistence cohort)',
      'Primarily Legacy NovaAssist or another AI tool (M365 Copilot)',
      'No AI tool used in last 30 days (Routed to blockers)'
    ]
  },
  {
    id: 'U02', module: 'U', weight: 0, kpaId: 'user_experience', inputType: 'multi_select',
    question: 'What is the respondent role and primary task distribution in the survey sample?',
    requiredEntry: 'Function/role from controlled list; task from W01 list; other (0 pts — stratification identifier).',
    options: ['R&D / Discovery Scientists', 'Clinical Operations & Medical Writing', 'Commercial & Market Access Analysts', 'Manufacturing / CMC / Quality Engineers', 'Global Support Functions (HR, Finance, IT, Procurement)']
  },
  {
    id: 'U03', module: 'U', weight: 1, kpaId: 'user_experience', inputType: 'single_select', rubricType: 'adoption',
    question: 'How often did Gemini Enterprise help users complete their task?',
    requiredEntry: 'Never; <25%; 25–49%; 50–74%; 75%+; unsure.',
    options: ['75%+ of attempts', '50–74% of attempts', '25–49% of attempts', '<25% of attempts', 'Never / Unsure']
  },
  {
    id: 'U04', module: 'U', weight: 2, kpaId: 'user_experience', inputType: 'single_select', rubricType: 'experience',
    question: 'Compared with the legacy workflow, how much perceived time did Gemini save per completed task (including checking and fixes)?',
    requiredEntry: 'More than 30 min slower; 11–30 min slower; within 10 min; 11–30 min faster; 31–60 min faster; >60 min faster; cannot compare. (Never monetized directly).',
    options: ['>30 min faster per task (after review)', '11–30 min faster per task', 'Within ±10 min (roughly neutral)', '11–30 min slower', '>30 min slower', 'Cannot compare']
  },
  {
    id: 'U05', module: 'U', weight: 1, kpaId: 'user_experience', inputType: 'single_select', rubricType: 'experience',
    question: 'What happened to the time released according to employees?',
    requiredEntry: 'More same work; different priority work; reduced overtime; reduced outside spend; learning; no time released; unsure.',
    options: ['Reinvested into higher-priority work & deeper analysis', 'Completed more volume of the same work', 'Reduced overtime / after-hours work', 'Reduced outside agency/contractor spend', 'Used for learning / experimentation', 'No time released / Unsure']
  },
  {
    id: 'U06', module: 'U', weight: 2, kpaId: 'user_experience', inputType: 'rating_matrix_1_5', rubricType: 'experience',
    question: 'Rate answer relevance, source findability, accuracy, speed, ease, and confidence (1–5 scale, Legacy NovaAssist vs. Gemini Enterprise).',
    requiredEntry: 'Separate 1–5 scale for legacy and Gemini: 1 very poor to 5 excellent; not used.'
  },
  {
    id: 'U07', module: 'U', weight: 1, kpaId: 'user_experience', inputType: 'single_select', rubricType: 'quality_ops',
    question: 'How often do users independently verify AI outputs against primary sources?',
    requiredEntry: 'Always; usually; sometimes; rarely; never; task does not require it.',
    options: ['Always / Usually (High verification discipline on regulated & commercial tasks)', 'Sometimes (Spot-checking citations)', 'Rarely / Never (Unverified reliance risk)', 'Task does not require verification']
  },
  {
    id: 'U08', module: 'U', weight: 1, kpaId: 'user_experience', inputType: 'single_select', rubricType: 'quality_ops',
    question: 'Have users seen an incorrect, unsafe, or inaccessible result in the last 30 days?',
    requiredEntry: 'Never; once; monthly; weekly; daily; prefer not to say. Enter type (not sensitive content) and whether reported.',
    options: [
      'Rarely / Once (Minor unindexed SharePoint/RegVault source gaps; zero privacy/safety leaks)',
      'Never',
      'Monthly (Bounded hallucination or stale document retrieval)',
      'Weekly / Daily (Material quality or permission defect)'
    ]
  },
  {
    id: 'U09', module: 'U', weight: 1, kpaId: 'user_experience', inputType: 'single_select', rubricType: 'experience',
    question: 'Would sampled users choose Gemini Enterprise for this task again?',
    requiredEntry: 'Definitely; probably; uncertain; probably not; definitely not. Why: optional categorized reason.',
    options: ['Definitely yes (≥80% positive preference)', 'Probably yes (65–79% preference)', 'Uncertain / Mixed', 'Probably not', 'Definitely not']
  },
  {
    id: 'U10', module: 'U', weight: 0, kpaId: 'user_experience', inputType: 'multi_select_rank', rankLimit: 2,
    question: 'What do employees report is still missing? (Rank top two)',
    requiredEntry: 'Multi-select: source coverage; permissions; workflow action; better accuracy; faster responses; training; support; no gap; other. Rank top two.',
    options: ['Source coverage (RegVault DMS, CoreERP, historical NovaAssist chats)', 'Permissions & connector opt-in simplicity', 'Direct workflow actions / write-back', 'Role-specific prompt templates & training', 'Better accuracy on complex tables', 'Faster response latency', 'Support routing (PulseFeedback / BioNova helpdesk link)', 'No gap']
  },

  // ================= Q. QUALITY, RISK & GOVERNANCE (Q01-Q06, 20 PTS) =================
  {
    id: 'Q01', module: 'Q', weight: 3, kpaId: 'quality_governance', inputType: 'single_select', rubricType: 'quality_ops',
    question: 'How is answer and agent output quality systematically tested?',
    requiredEntry: 'No test; user feedback; sampled human review; blinded old/new comparison; held-out benchmark. Enter sample size, rubric, reviewer and dates.',
    options: [
      'Held-out golden benchmark + Gemini Auditor + SME human review (NOVA-AI Pricing & Clinical pilots)',
      'Blinded old (NovaAssist) vs. new (Gemini) SME evaluation',
      'Sampled human review on pilot cohorts',
      'Ad-hoc user thumbs up/down feedback only',
      'No systematic testing'
    ]
  },
  {
    id: 'Q02', module: 'Q', weight: 5, kpaId: 'quality_governance', inputType: 'single_select', rubricType: 'quality_ops',
    question: 'What are the severity-weighted failure rates before and after migration?',
    requiredEntry: 'Actual count and rate by hallucination, wrong source, access error, unsafe recommendation, incomplete answer, tool failure, privacy/security event.',
    options: [
      'Zero critical safety/privacy events; hallucination rate <2% with mandatory hyperlink citation policy',
      'Meets baseline; minor incomplete answers when connectors are unindexed',
      'Moderate error rate requiring rework',
      'Severe unresolved safety, privacy, or hallucination defect (Triggers Gate 1 or Gate 2)'
    ]
  },
  {
    id: 'Q03', module: 'Q', weight: 5, kpaId: 'quality_governance', inputType: 'single_select', rubricType: 'quality_ops',
    question: 'Are source permissions (ACLs), VPC-SC isolation, and auditability working?',
    requiredEntry: 'Tested and passed; tested with gaps; untested; not applicable. Enter test scope, incidents and remediation.',
    options: [
      'Tested and passed across all connectors with continuous audit logging',
      'VPC-SC & core ACLs passed; user/group connector visibility & NotebookLM sharing in bounded remediation',
      'Untested on live enterprise connectors',
      'Confirmed inappropriate access or material privacy incident (Triggers Gate 1)'
    ]
  },
  {
    id: 'Q04', module: 'Q', weight: 3, kpaId: 'quality_governance', inputType: 'single_select', rubricType: 'quality_ops',
    question: 'What are platform availability, P50/P95 latency, and support MTTR results?',
    requiredEntry: 'Actual uptime, P50/P95 latency by task class, failure rate, support tickets, MTTR and affected users, before/after.',
    options: [
      '99.9% uptime; P50 <2.2s (Search/Assist), P95 <6.5s (Agents); 24 Issue Tracker items actively tracked',
      'Exceeds all latency and ticket MTTR targets with zero open bugs',
      'Meets minimum availability with occasional cross-cloud query latency spikes',
      'Below minimum SLA or severe outage'
    ]
  },
  {
    id: 'Q05', module: 'Q', weight: 2, kpaId: 'quality_governance', inputType: 'single_select', rubricType: 'quality_ops',
    question: 'What is the enterprise risk impact and control effectiveness status?',
    requiredEntry: 'Per risk: probability basis, loss range, control owner, control evidence; quantified and Finance-approved / scenario only / qualitative.',
    options: [
      'Controls defined & tested (VPC-SC, zero model training, citation grounding, HITL review); formal GxP sign-off in progress',
      'Fully quantified, Finance-approved and signed off across all regulated & non-regulated scopes',
      'Qualitative risk register only; controls incomplete',
      'Severe unresolved control gap'
    ]
  },
  {
    id: 'Q06', module: 'Q', weight: 2, kpaId: 'quality_governance', inputType: 'single_select', rubricType: 'quality_ops',
    question: 'Were any regulated or GxP-adjacent workflows affected, and are they validated?',
    requiredEntry: 'Yes validated; yes unvalidated; no; unknown. Capture classification, validation owner and permissible use (Unvalidated production use triggers Gate 3).',
    options: [
      'Yes — Regulated workflows (BNV-04 Clinical, BNV-05 CMC, BNV-13 Regulatory) scoped in pilot; formal GxP CSV validation required prior to scale (Gate 3 Active)',
      'Yes — All regulated workflows formally validated with 21 CFR Part 11 / Annex 11 audit trail sign-off',
      'No regulated or GxP-adjacent workflows in scope (Human-in-the-loop non-GxP only)',
      'Yes — Unvalidated regulated use in production (Severe Gate 3 Violation)'
    ]
  },

  // ================= F. FINANCE VALIDATION & EXECUTIVE OUTCOMES (F01-F08) =================
  {
    id: 'F01', module: 'F', weight: 0, inputType: 'finance_rates',
    question: 'What loaded hourly rates ($/hr) and realization rules (0–100%) are approved by BioNova Finance?',
    requiredEntry: 'Rate by role; eligible cost category; realization factor 0–100%; approver and effective dates.'
  },
  {
    id: 'F02', module: 'F', weight: 0, inputType: 'multi_select',
    question: 'What counts as an approved financial or capacity benefit under BioNova CFO rules?',
    requiredEntry: 'Cash released; budget avoided; capacity with demonstrated throughput; modeled opportunity; nonfinancial only. Define documentary threshold for each.',
    options: [
      'Column 1 (Realized Cash): Requires terminated legacy contract/invoice (L02) or signed budget/contractor reduction (W10)',
      'Column 2 (Validated Capacity): Requires measured W04 task time reduction + W07 quality parity; reported in hours & capacity eq.',
      'Column 3 (Modeled Opportunity): Pre-production pilots (NOVA-AI Pricing, AHEAD, Ask HR) reported separately from realized ROI',
      'Column 4 (Nonfinancial Indicators): WAU, search completion, cycle speed, and citation accuracy'
    ]
  },
  {
    id: 'F03', module: 'F', weight: 0, inputType: 'numeric_with_unit',
    question: 'What attribution adjustment (0–100% share attributable to Gemini migration) is required?',
    requiredEntry: '0–100% share attributable to migration per workflow, with reason and counterfactual evidence (accounting for CoP training & BigQuery data prep).',
    unitLabel: '% attribution share'
  },
  {
    id: 'F04', module: 'F', weight: 0, inputType: 'single_select',
    question: 'What overall confidence tier governs the current assessment ledger?',
    requiredEntry: 'A: system-of-record and validated control (1.0x); B: sampled measured comparison (0.75x); C: survey/assumption (0.40x); D: unsupported hypothesis (0.0x).',
    options: [
      'Tier B (0.75x) for Adoption & Pilot Time Studies; Tier C/D for Scoping Value & Pending Legacy Invoices',
      'Tier A (1.00x) — Full system-of-record & signed Finance audit across all modules',
      'Tier C (0.40x) — Survey recall and modeled assumptions only',
      'Tier D (0.00x) — Unsupported hypothesis'
    ]
  },
  {
    id: 'F05', module: 'F', weight: 0, inputType: 'single_select',
    question: 'Are any claimed benefits duplicated across hours, cycle time, rework, or workflows?',
    requiredEntry: 'No; yes between hours/cycle time; yes between error/rework; yes across workflows; unresolved. Enter exclusion decision.',
    options: [
      'No — W04 verification minutes auto-linked to W07; cycle time (W08) not double-monetized with task hours (W04)',
      'Yes — overlap between hours and cycle time (Excluded in calculation)',
      'Yes — overlap between error reduction and rework minutes (Excluded in calculation)',
      'Unresolved overlap (Triggers Gate 5)'
    ]
  },
  {
    id: 'F06', module: 'F', weight: 0, inputType: 'single_select',
    question: 'What reporting periods and financial horizons are used?',
    requiredEntry: 'Actual monthly/quarterly; annualized run rate; first-year cash flow; 3-year forecast; enter cutover and ramp assumptions.',
    options: [
      'Comparable 60-day pre/post cohort window + Annualized Run-Rate + First-Year Net Value (deducting L04)',
      'Actual quarterly realized cash only',
      '3-Year strategic alliance forecast only'
    ]
  },
  {
    id: 'F07', module: 'F', weight: 0, inputType: 'multi_select_rank', rankLimit: 5,
    question: 'Which executive outcomes does BioNova leadership prioritize? (Rank top five)',
    requiredEntry: 'Rank top five: net cost; cash savings; capacity; throughput; quality; search success; governance; employee experience; innovation; adoption.',
    options: ['Throughput & cycle-time compression (R&D / Commercial)', 'Search success & enterprise knowledge findability', 'Quality, citation accuracy & GxP governance', 'Active repeat adoption across 85k seats', 'Net platform cost & NovaAssist retirement savings', 'Released engineering & clinical capacity', 'Employee experience & CoP velocity', 'Commercial pricing & launch innovation']
  },
  {
    id: 'F08', module: 'F', weight: 0, inputType: 'signoff_matrix',
    question: 'Multi-party executive sign-off on the assessment readout (Business, Platform, Finance, Security/GxP)',
    requiredEntry: 'Business owner, platform, Finance, security as applicable: approved; approved with caveat; pending; rejected. Capture date and caveat.'
  },

  // ================= V. INDUSTRY & PHARMA ADD-ON MODULE (V01-V08) =================
  {
    id: 'V01', module: 'V', weight: 0, linkedQuestions: ['W07', 'W09'], inputType: 'single_select',
    question: 'Research / Discovery: Which research output is accelerated (BNV-01 Co-Scientist / Literature Triage)?',
    requiredEntry: 'Literature triage; hypothesis development; knowledge discovery; protocol drafting; other. Record baseline/current elapsed time, accepted outputs, and review burden.',
    options: ['Literature triage & 500+ paper structured extraction (CoP & R&D pilots)', 'Hypothesis development & target validation', 'Protocol drafting', 'Not in current GE scope']
  },
  {
    id: 'V02', module: 'V', weight: 0, linkedQuestions: ['W07', 'Q02', 'Q06'], inputType: 'single_select',
    question: 'Clinical Operations: Does AI influence study documentation or site operations (BNV-04)?',
    requiredEntry: 'No; drafting only; human-reviewed recommendation; decision support; autonomous action. Record approval gate, error rate and rework.',
    options: ['Human-reviewed drafting & clinical data review configuration (100% HITL gate)', 'Autonomous action on clinical records (Triggers Gate 3 if unvalidated)', 'Reference search only', 'Not in scope']
  },
  {
    id: 'V03', module: 'V', weight: 0, linkedQuestions: ['W07', 'Q02'], inputType: 'single_select',
    question: 'Medical / Scientific Information: How are medical and HTA answers substantiated (BNV-07 AHEAD)?',
    requiredEntry: 'Approved-source retrieval; source verification; medical review; escalation; not applicable. Record first-pass accuracy, correction and escalation counts.',
    options: ['Approved-source retrieval + mandatory hyperlink verification + medical/HTA review', 'Unverified generative drafting', 'Not applicable']
  },
  {
    id: 'V04', module: 'V', weight: 0, linkedQuestions: ['Q02', 'Q06'], inputType: 'single_select',
    question: 'Pharmacovigilance: Is safety case intake, triage, or adverse-event reporting affected?',
    requiredEntry: 'No; search only; draft support; triage support; regulated decision. Do not monetize without approved validation evidence.',
    options: ['No regulated PV case decisions in Wave 1 (VPC-SC isolated; AE policy banner active)', 'Search / draft support only with human QA', 'Regulated safety triage decision']
  },
  {
    id: 'V05', module: 'V', weight: 0, linkedQuestions: ['W07', 'W09', 'Q06'], inputType: 'single_select',
    question: 'Manufacturing / Quality: Does output touch deviations, CAPA, SOPs, or CMC tech transfer (BNV-05)?',
    requiredEntry: 'No; reference lookup; drafting; quality recommendation; controlled record. Record review effort, cycle time, quality events and controls.',
    options: ['CMC Tech Transfer & QMS/SOP contextualization (BNV-05 in Scoping; controlled records require QA sign-off)', 'Reference lookup only', 'Direct write to controlled batch records']
  },
  {
    id: 'V06', module: 'V', weight: 0, linkedQuestions: ['W07', 'W09'], inputType: 'single_select',
    question: 'Commercial / Market Access: Does output touch pricing simulations or promotional content (BNV-06 NOVA-AI)?',
    requiredEntry: 'No; internal research; drafting; approved-content adaptation; external publication. Record review and approval cycles.',
    options: ['Internal global pricing simulation (BNV-06 NOVA-AI) & internal market access drafting with human approval', 'External promotional publication without MLR review', 'Not applicable']
  },
  {
    id: 'V07', module: 'V', weight: 0, linkedQuestions: ['A03', 'Q03'], inputType: 'single_select',
    question: 'Enterprise Knowledge / M365: Did users find permission-correct, current sources across SharePoint/OneDrive?',
    requiredEntry: 'Always; usually; sometimes; rarely; never. Capture sampled source coverage, permission defects, stale-source findings.',
    options: ['Usually — SharePoint/OneDrive bug resolved; user/group connector visibility opt-in under verification', 'Always — 100% source coverage and zero permission gaps', 'Sometimes / Rarely — major connector outage']
  },
  {
    id: 'V08', module: 'V', weight: 0, linkedQuestions: ['W09', 'Q02', 'Q03'], inputType: 'single_select',
    question: 'Agents / Actions: What level of autonomy can deployed Gemini Enterprise agents take?',
    requiredEntry: 'Read only; draft; update record with approval; update record automatically; external action. Record completion, rollback, exception and human approval rates.',
    options: ['Read-only retrieval, simulation & draft generation with mandatory human approval (OmniDesk ITSM MCP & NOVA-AI Pricing)', 'Update enterprise records automatically without human review', 'Read-only search only']
  },

  // ================= G. GEOGRAPHY ADD-ON MODULE (G01-G05) =================
  {
    id: 'G01', module: 'G', weight: 0, linkedQuestions: ['A01', 'W02'], inputType: 'single_select',
    question: 'When was Gemini Enterprise usable in each country and rollout wave?',
    requiredEntry: 'Launch date, effective access date, connected-source date, training date; unknown.',
    options: ['US/NORTHAM Wave 1 Live (Q1–Q2 2026); EMEA/APAC/LATAM phased waves tracked', 'All global regions launched simultaneously', 'Unknown']
  },
  {
    id: 'G02', module: 'G', weight: 0, linkedQuestions: ['A01', 'W02'], inputType: 'single_select',
    question: 'What is the comparable regional cohort denominator?',
    requiredEntry: 'Eligible and active users, function, workflow volume, language, baseline/current dates.',
    options: ['Segmented by NORTHAM (primary 10,663 assigned wave) vs. International cohorts', 'Unsegmented global total only', 'Unknown']
  },
  {
    id: 'G03', module: 'G', weight: 0, linkedQuestions: ['W03'], inputType: 'single_select',
    question: 'Are content and outcomes comparable across non-English languages (ES, FR, DE, JA)?',
    requiredEntry: 'Validated equivalent; partly comparable; local use cases differ; untested. Record sample and owner.',
    options: ['Partly comparable — English validated; ES/FR/DE/JA localization roadmap tracked with Henrik Lindqvist', 'Validated equivalent across all languages', 'Untested']
  },
  {
    id: 'G04', module: 'G', weight: 0, linkedQuestions: ['A01', 'A02'], inputType: 'multi_select',
    question: 'Are local privacy, data residency, or Works Council restrictions material?',
    requiredEntry: 'None; access; privacy; data residency; works council/employee monitoring; regulated use; other. Capture approved measurement method.',
    options: ['EU / German Works Council (k-anonymity aggregated telemetry rule)', 'Data residency / regional routing logic (Adrian Chen)', 'Regulated pharma GxP market rules', 'None']
  },
  {
    id: 'G05', module: 'G', weight: 0, linkedQuestions: ['A01', 'W02'], inputType: 'single_select',
    question: 'Should multi-country results be pooled or reported separately?',
    requiredEntry: 'Yes with population/task-volume weights; no, report separately; pending review. Record rule and approver.',
    options: ['Report NORTHAM Wave 1 primary; pool international waves only after localization & Works Council parity', 'Pool all regions unconditionally', 'Pending review']
  }
];

/**
 * Default Priority Workflows for BioNova Life Sciences Inc. (ACC-1002-BIONOVA)
 * Strictly distinguishes Scaled vs. Pilot vs. Scoping (quarantining Scoping to Column 3 Modeled Opportunity)
 */
const DEFAULT_BIONOVA_WORKFLOWS = [
  {
    id: 'wf_enterprise_search',
    code: 'WF1',
    name: 'Enterprise Knowledge Search & "Ask HR" / OmniDesk ITSM Assistant (BNV-08)',
    functionArea: 'Enterprise-Wide & Global Support',
    classification: 'search',
    owner: 'Lucas Sterling / Global Support Lead',
    maturity: 'Scaled', // W13: Scaled | Pilot | Scoping | Blocked
    portfolioWeightCap: 0.30, // Capped at 30% so high search volume does not drown out regulated workflows
    eligibleUsers: 10663,
    activeUsers: 4992,
    completedTasksPerMonth: 14500,
    comparisonMethod: 'Timed pilot comparison study on representative task sample',
    baselinePeriod: 'Jan 15 – Mar 15, 2026 (Legacy NovaAssist)',
    currentPeriod: 'Mar 16 – May 15, 2026 (Gemini Enterprise)',
    sampleSize: 320,
    numericState: 'actual', // actual | pending | unknown | na
    stages: {
      discovery: { baseline: 12, gemini: 3 },
      drafting: { baseline: 5, gemini: 2 },
      verification: { baseline: 3, gemini: 2 },
      correction: { baseline: 1, gemini: 1 },
      approval: { baseline: 0, gemini: 0 },
      handoff: { baseline: 1, gemini: 1 }
    },
    iqrBaseline: 6,
    iqrGemini: 3,
    outputUsedPct: '75–89%',
    firstPassBaselinePct: 68,
    firstPassGeminiPct: 84,
    reworkBaselinePct: 18,
    reworkGeminiPct: 9,
    criticalErrorPct: 0.2,
    citationsVerifiedPct: 94,
    cycleTimeBaselineHours: 4.0,
    cycleTimeGeminiHours: 0.5,
    realizationClass: 'capacity_only', // cash_realized | capacity_only | modeled_only
    approvedHourlyRate: 95,
    realizationFactorPct: 0, // 0% cash realization (unredeployed time stays in Col 2 Capacity)
    capacityConversionFactorPct: 65,
    attributionSharePct: 80,
    modeledAnnualValueUsd: 22500000, // $20M-$25M BNV-08 target kept in Col 3 Modeled Opportunity
    isRegulatedGxp: false,
    gxpValidated: true,
    confidenceTier: 'B',
    verificationStatus: 'draft_verify', // verified | draft_verify | pending
    sourceProvenance: 'Enterprise_Agent_Acceleration_Workbook.xlsx (Row 11: 4,992 Search WAU / 5,386 Assist WAU; BNV-08 Ask HR)',
    quarterlyDecision: 'Scale',
    nextAction: 'Expand seat assignment from 10,663 toward 85,000 as SharePoint opt-in & NovaAssist chat export close',
    outcomeScores: {
      W01: 4, W02: 4, W03: 3, W04: 3, W05: 3, W06: 3, W07: 3, W08: 3, W09: 3, W10: 2, W11: 2, W12: 3, W13: 4, Q01: 3, Q02: 3
    }
  },
  {
    id: 'wf_nova_pricing',
    code: 'WF2',
    name: 'BNV-06: NOVA-AI Global Pricing & Reference Cascade Agent (IRP / MFN)',
    functionArea: 'Commercial / Global Market Access',
    classification: 'agent action',
    owner: 'Global Market Access Lead / PSO',
    maturity: 'Pilot',
    portfolioWeightCap: 0.20,
    eligibleUsers: 120,
    activeUsers: 45,
    completedTasksPerMonth: 90,
    comparisonMethod: 'Timed pilot comparison study on representative task sample',
    baselinePeriod: 'Q4 2025 – Q1 2026 (Manual Excel IRP Cascade)',
    currentPeriod: 'Q2 2026 (ADK + Gemini + BigQuery Gold Layer)',
    sampleSize: 24,
    numericState: 'actual',
    stages: {
      discovery: { baseline: 180, gemini: 10 },
      drafting: { baseline: 240, gemini: 15 },
      verification: { baseline: 90, gemini: 25 },
      correction: { baseline: 60, gemini: 10 },
      approval: { baseline: 45, gemini: 15 },
      handoff: { baseline: 25, gemini: 5 }
    },
    iqrBaseline: 120,
    iqrGemini: 15,
    outputUsedPct: '75–89%',
    firstPassBaselinePct: 62,
    firstPassGeminiPct: 88,
    reworkBaselinePct: 28,
    reworkGeminiPct: 8,
    criticalErrorPct: 0.0,
    citationsVerifiedPct: 100,
    cycleTimeBaselineHours: 720, // multi-week/month manual coordination compressed to minutes/hours
    cycleTimeGeminiHours: 2.5,
    realizationClass: 'modeled_only', // Pilot stage -> $100M-$300M strictly quarantined to Col 3 Modeled Opportunity
    approvedHourlyRate: 145,
    realizationFactorPct: 0,
    capacityConversionFactorPct: 75,
    attributionSharePct: 75,
    modeledAnnualValueUsd: 150000000, // Conservative $150M midpoint of $100M-$300M charter target (Col 3 Only)
    isRegulatedGxp: false,
    gxpValidated: true,
    confidenceTier: 'B',
    verificationStatus: 'draft_verify',
    sourceProvenance: 'NovaAssist_Pricing_Agent_Capability_Charter.pdf & BioNova_Architecture_Discussion.pdf',
    quarterlyDecision: 'Validate further',
    nextAction: 'Obtain BioNova Finance sign-off on 0.5% price retention attribution (F01/F03) & finalize BigQuery Gold Layer',
    outcomeScores: {
      W01: 4, W02: 3, W03: 3, W04: 4, W05: 3, W06: 3, W07: 4, W08: 4, W09: 3, W10: 2, W11: 2, W12: 3, W13: 3, Q01: 4, Q02: 4
    }
  },
  {
    id: 'wf_clinical_review',
    code: 'WF3',
    name: 'BNV-04: Automated Clinical Data Review & Protocol Extraction',
    functionArea: 'Clinical Operations / R&D (GxP Regulated)',
    classification: 'analysis',
    owner: 'Elena Rostova / Clinical Ops Lead',
    maturity: 'Pilot',
    portfolioWeightCap: 0.20,
    eligibleUsers: 1000,
    activeUsers: 85,
    completedTasksPerMonth: 1400,
    comparisonMethod: 'Timed pilot comparison study on representative task sample',
    baselinePeriod: 'Jan – Feb 2026 (Manual Protocol/CRF Review)',
    currentPeriod: 'Mar – May 2026 (Gemini Protocol Extraction Pilot)',
    sampleSize: 85,
    numericState: 'actual',
    stages: {
      discovery: { baseline: 22, gemini: 6 },
      drafting: { baseline: 38, gemini: 11 },
      verification: { baseline: 12, gemini: 15 }, // +3 min extra human QA verification explicitly captured
      correction: { baseline: 10, gemini: 5 },
      approval: { baseline: 5, gemini: 4 },
      handoff: { baseline: 3, gemini: 3 }
    },
    iqrBaseline: 18,
    iqrGemini: 9,
    outputUsedPct: '75–89%',
    firstPassBaselinePct: 70,
    firstPassGeminiPct: 86,
    reworkBaselinePct: 22,
    reworkGeminiPct: 10,
    criticalErrorPct: 0.0,
    citationsVerifiedPct: 100,
    cycleTimeBaselineHours: 48,
    cycleTimeGeminiHours: 16,
    realizationClass: 'capacity_only',
    approvedHourlyRate: 135,
    realizationFactorPct: 0,
    capacityConversionFactorPct: 70,
    attributionSharePct: 75,
    modeledAnnualValueUsd: 18500000,
    isRegulatedGxp: true,
    gxpValidated: false, // Triggers Gate 3 (Regulated GxP validation & RegVault DMS MCP pending)
    confidenceTier: 'B',
    verificationStatus: 'draft_verify',
    sourceProvenance: 'Enterprise_Agent_Acceleration_Workbook.xlsx (BNV-04: 1,000 staff @ 70% manual) & RegVault Cloud Blocker Log',
    quarterlyDecision: 'Improve / Unblock',
    nextAction: 'Unblock RegVault DMS MCP connector & complete 21 CFR Part 11 / GxP CSV validation prior to full 1,000-seat scale',
    outcomeScores: {
      W01: 4, W02: 3, W03: 3, W04: 3, W05: 3, W06: 3, W07: 3, W08: 3, W09: 3, W10: 2, W11: 1, W12: 2, W13: 2, Q01: 3, Q02: 3
    }
  },
  {
    id: 'wf_project_ahead',
    code: 'WF4',
    name: 'BNV-07: Project AHEAD — Automated HTA Dossier Generation',
    functionArea: 'Commercial / Regulatory Market Access',
    classification: 'drafting',
    owner: 'Market Access Dossier Lead / PSO',
    maturity: 'Scoping', // Scoping -> strictly quarantined to Col 3 (0 realized hrs/$)
    portfolioWeightCap: 0.15,
    eligibleUsers: 220,
    activeUsers: 60,
    completedTasksPerMonth: null, // Evidence Pending
    comparisonMethod: 'Modeled / scoping target only',
    baselinePeriod: 'Q1 2026 Baseline Scoping',
    currentPeriod: 'Q2 2026 Prototype',
    sampleSize: 12,
    numericState: 'pending',
    stages: {
      discovery: { baseline: 120, gemini: 35 },
      drafting: { baseline: 240, gemini: 90 },
      verification: { baseline: 60, gemini: 65 },
      correction: { baseline: 45, gemini: 25 },
      approval: { baseline: 30, gemini: 30 },
      handoff: { baseline: 15, gemini: 10 }
    },
    iqrBaseline: 60,
    iqrGemini: 30,
    outputUsedPct: '50–74%',
    firstPassBaselinePct: 65,
    firstPassGeminiPct: 80,
    reworkBaselinePct: 25,
    reworkGeminiPct: 14,
    criticalErrorPct: 0.0,
    citationsVerifiedPct: 95,
    cycleTimeBaselineHours: 360,
    cycleTimeGeminiHours: 180,
    realizationClass: 'modeled_only',
    approvedHourlyRate: 140,
    realizationFactorPct: 0,
    capacityConversionFactorPct: 0,
    attributionSharePct: 70,
    modeledAnnualValueUsd: 15000000,
    isRegulatedGxp: true,
    gxpValidated: false,
    confidenceTier: 'C',
    verificationStatus: 'pending',
    sourceProvenance: 'Enterprise_Agent_Acceleration_Workbook.xlsx (BNV-07) & BioNova_Architecture_Discussion.pdf (p.2)',
    quarterlyDecision: 'Validate further',
    nextAction: 'Execute timed pre/post dossier drafting study (W03/W04) once OneSearch/ClinMetrics data feeds are connected',
    outcomeScores: {
      W01: 3, W02: 2, W03: 1, W04: 3, W05: 2, W06: 2, W07: 2, W08: 3, W09: 2, W10: 1, W11: 1, W12: 2, W13: 1, Q01: 2, Q02: 2
    }
  },
  {
    id: 'wf_cmc_tech_transfer',
    code: 'WF5',
    name: 'BNV-05: CMC R&D-to-Manufacturing Tech Transfer Contextualization',
    functionArea: 'Manufacturing / CMC Quality (GxP)',
    classification: 'analysis',
    owner: 'CMC Manufacturing Lead / Delta FDE',
    maturity: 'Scoping', // Scoping -> strictly quarantined to Col 3 (0 realized hrs/$)
    portfolioWeightCap: 0.15,
    eligibleUsers: 450,
    activeUsers: 180,
    completedTasksPerMonth: null, // Evidence Pending
    comparisonMethod: 'Modeled / scoping target only',
    baselinePeriod: 'Historical 24-Month CMC Transfer Cycle',
    currentPeriod: 'Q2 2026 Scoping (CoreERP/LIMS/BioMES/Cloud DataHub)',
    sampleSize: 0,
    numericState: 'pending',
    stages: {
      discovery: { baseline: 90, gemini: 30 },
      drafting: { baseline: 110, gemini: 45 },
      verification: { baseline: 45, gemini: 45 },
      correction: { baseline: 35, gemini: 20 },
      approval: { baseline: 30, gemini: 30 },
      handoff: { baseline: 20, gemini: 15 }
    },
    iqrBaseline: 45,
    iqrGemini: 20,
    outputUsedPct: '25–49%',
    firstPassBaselinePct: 60,
    firstPassGeminiPct: 75,
    reworkBaselinePct: 30,
    reworkGeminiPct: 18,
    criticalErrorPct: 0.0,
    citationsVerifiedPct: 90,
    cycleTimeBaselineHours: 1440,
    cycleTimeGeminiHours: 540,
    realizationClass: 'modeled_only',
    approvedHourlyRate: 130,
    realizationFactorPct: 0,
    capacityConversionFactorPct: 0,
    attributionSharePct: 65,
    modeledAnnualValueUsd: 25000000,
    isRegulatedGxp: true,
    gxpValidated: false,
    confidenceTier: 'D',
    verificationStatus: 'pending',
    sourceProvenance: 'Enterprise_Agent_Acceleration_Workbook.xlsx (BNV-05: 24-mo to 9-mo CMC target; CoreERP connector feature request)',
    quarterlyDecision: 'Improve / Unblock',
    nextAction: 'Establish BigQuery bridge to Legacy Cloud DataHub, LIMS, BioMES & QMS; define GxP CSV boundary',
    outcomeScores: {
      W01: 3, W02: 1, W03: 1, W04: 2, W05: 2, W06: 1, W07: 2, W08: 2, W09: 2, W10: 1, W11: 0, W12: 2, W13: 1, Q01: 1, Q02: 2
    }
  }
];

const DEFAULT_BIONOVA_GEOGRAPHIES = [
  {
    id: 'geo_northam',
    region: 'NORTHAM (US — Cambridge, MA & North America)',
    language: 'English',
    launchDate: '2026-02-15',
    eligibleSeats: 85000,
    assignedSeats: 10663,
    wau: 5867,
    mau: 7763,
    worksCouncilRestriction: 'None (Standard US Enterprise Governance)',
    comparabilityStatus: 'Validated Primary Baseline (Vector ACC-1002-BIONOVA)',
    poolingRule: 'Primary benchmark cohort'
  },
  {
    id: 'geo_emea',
    region: 'EMEA (Germany, France, Spain, UK, Switzerland)',
    language: 'English, German, French, Spanish',
    launchDate: '2026-05-01',
    eligibleSeats: null,
    assignedSeats: null,
    wau: null,
    mau: null,
    worksCouncilRestriction: 'EU / Works Council k-anonymity (min N=15 per cell; no individual event tracking)',
    comparabilityStatus: 'Localization roadmap (ES/FR/DE) tracked with Henrik Lindqvist',
    poolingRule: 'Report separately until language parity & Works Council review complete'
  },
  {
    id: 'geo_apac',
    region: 'APAC (Japan & Asia-Pacific)',
    language: 'Japanese, English',
    launchDate: '2026-06-01',
    eligibleSeats: null,
    assignedSeats: null,
    wau: null,
    mau: null,
    worksCouncilRestriction: 'APAC Privacy & Japanese localization verification',
    comparabilityStatus: 'Pending Japanese localization benchmark',
    poolingRule: 'Report separately'
  }
];

/**
 * Builds the default pre-staged BioNova Life Sciences Inc. (ACC-1002-BIONOVA) dossier
 * OR a clean zero-assumption customer intake dossier when mode === 'clean'
 */
function createInitialGeDossier(mode = 'aerovanguard_default', customId = null, customMeta = {}) {
  const isClean = mode === 'clean';
  const isAeroVanguard = mode === 'aerovanguard_default';

  if (isAeroVanguard) {
    return {
      id: customId || 'ge_vr_acc-1001-aerovg',
      typeKey: 'ge_value_realization',
      mode: 'multi_source_ingested',
      meta: {
        customerName: 'AeroVanguard Global Logistics',
        vectorAccountId: 'ACC-1001-AEROVG',
        gcpProjectId: 'aerovanguard-ge-logistics-prod-01',
        industry: 'Global Logistics, Air/Ground Express & Supply Chain',
        regionPrimary: 'NORTHAM (Atlanta, GA HQ + Global Hubs)',
        legacySystemName: 'M365 Copilot Pilot + Disconnected SharePoint/OmniDesk ITSM Search',
        legacyPlatformName: 'M365 Copilot Pilot + Disconnected SharePoint/OmniDesk ITSM Search',
        targetSystemName: 'Google Cloud Gemini Enterprise (10,000 Contracted Seats)',
        executiveSponsor: 'Rohan Kapoor (EVP, Chief Digital & Information Officer)',
        customerLeads: 'Enterprise AI & Digital Operations Platform Lead, Global Logistics Ops Director',
        googleLeads: 'AeroVanguard Strategic Account Director, Google Cloud Supply Chain Principal Architect',
        accountTeam: {
          customerSponsor: 'Rohan Kapoor (EVP, Chief Digital & Information Officer)',
          customerTechLead: 'Enterprise AI & Digital Operations Platform Lead',
          googleCal: 'AeroVanguard Strategic Account Director',
          googleCeLead: 'Google Cloud Supply Chain Principal Architect'
        },
        assessmentTier: 'Enterprise Standard',
        tierOverrideReason: 'High over-assignment density (138% assigned vs contracted) & RuggedEdge mobile handheld edge blocker.',
        baselineWindow: 'Jan 15, 2026 – Mar 15, 2026 (60 Days)',
        currentWindow: 'Mar 16, 2026 – May 15, 2026 (60 Days)',
        cutoverDate: '2026-06-30',
        lastUpdated: new Date().toISOString()
      },
      agreedKrTargets: {
        targetWauToAssignedPct: 50.0,
        targetTaskEffortReductionPct: 25.0,
        targetExceptionalEffortReductionPct: 50.0,
        targetFirstPassAcceptancePct: 80.0,
        targetPaybackMonths: 12,
        maxSingleWorkflowWeightCap: 0.30,
        version: 'v1.0 (Pre-Agreed Baseline Contract)'
      },
      costLedger: {
        currency: 'USD',
        legacyAnnualApiCost: null,
        legacyAnnualHostingSearchCost: null,
        legacyAnnualSupportFteCost: null,
        legacyCostNumericState: 'pending',
        legacyRetiredAnnualCost: null,
        legacyRetainedParallelRunAnnualCost: null,
        legacyRetirementState: 'parallel_run',
        geminiAnnualRecurringCost: null,
        geminiCostNumericState: 'pending',
        oneTimeMigrationCost: null,
        adverseWorkaroundAnnualCost: 0,
        defaultLoadedHourlyRate: 112,
        cashRealizationFactorPct: 0,
        capacityValuationFactorPct: 65,
        defaultAttributionSharePct: 75,
        sensitivityLowMultiplier: 0.75,
        sensitivityHighMultiplier: 1.25
      },
      adoptionTelemetry: {
        contractedSeats: 10000,
        provisionedSeats: 10000,
        assignedSeatsWave1: 13803,
        assignedSeats: 13803,
        mauMultiApi: 9854,
        multiApiMau30d: 9854,
        wauAllApi: 8900,
        allApiWau7d: 8900,
        wauMultiApi: 8148,
        dauMultiApi: 1300,
        geminiAssistWau7d: 8003,
        wauGeminiAssist: 8003,
        enterpriseSearchWau7d: 7508,
        wauEnterpriseSearch: 7508,
        agentsWau7d: 1154,
        wauAgents: 1154,
        agentRequests7d: 13699,
        featureWau: {
          assist: 8003,
          search: 7508,
          agent: 1154,
          agentRolling7dRequests: 13699
        },
        trackerOngoingIssues: 0,
        cloudBlockersInReview: 1
      },
      legacyRetirement: {
        legacyToolName: 'M365 Copilot Pilot + Disconnected SharePoint/OmniDesk ITSM Search',
        legacyAnnualRunRateModeledUsd: 1950000
      },
      workflows: [
        {
          ...DEFAULT_BIONOVA_WORKFLOWS[0],
          id: 'wf_aerovanguard_1',
          code: 'WF1',
          name: 'Global Customs & Export Tariff Document Triage',
          functionArea: 'International Customs & Trade Compliance',
          owner: 'VP Global Trade & Customs Operations',
          maturity: 'Scaled',
          eligibleUsers: 4500,
          activeUsers: 3850,
          completedTasksPerMonth: 18500,
          stages: {
            discovery: { baseline: 14, gemini: 4 },
            drafting: { baseline: 12, gemini: 4 },
            verification: { baseline: 8, gemini: 5 },
            correction: { baseline: 5, gemini: 2 },
            approval: { baseline: 3, gemini: 1 },
            handoff: { baseline: 2, gemini: 1 }
          },
          approvedHourlyRate: 112,
          modeledAnnualValueUsd: 9500000,
          isRegulatedGxp: false,
          gxpValidated: true,
          confidenceTier: 'A',
          verificationStatus: 'verified'
        }
      ],
      geographies: [],
      employeeSurvey: {
        invitedCount: 1500,
        respondentCount: 610,
        responseRatePct: 40.7,
        coUseOtherAiToolPct: 18.0,
        perceivedMinutesSavedMedian: 22,
        wouldChooseGeminiAgainPct: 85.0,
        ratings: {
          relevance: { legacy: 3.1, gemini: 4.4 },
          findability: { legacy: 2.8, gemini: 4.3 },
          accuracy: { legacy: 3.3, gemini: 4.4 },
          speed: { legacy: 3.2, gemini: 4.5 },
          ease: { legacy: 3.4, gemini: 4.3 },
          confidence: { legacy: 3.1, gemini: 4.2 }
        }
      },
      signOffs: {
        businessSponsor: { owner: 'Rohan Kapoor (EVP, CDIO)', status: 'Pending Review', date: '2026-05-20', caveat: 'Awaiting Wave-1 Cost Bridge & RuggedEdge mobile edge roadmap' },
        platformAnalytics: { owner: 'Enterprise AI & Digital Operations Platform Lead', status: 'Approved with Caveat', date: '2026-05-18', caveat: 'Vector WAU/MAU verified (8,900 WAU / 13,803 assigned)' },
        finance: { owner: 'AeroVanguard Global Logistics Finance Controller', status: 'Pending Review', date: '', caveat: 'Awaiting L01 legacy invoices & F01 loaded rate sign-off' },
        securityGxp: { owner: 'AeroVanguard InfoSec & Compliance QA', status: 'Approved with Caveat', date: '2026-05-18', caveat: 'VPC-SC & citations verified; RuggedEdge mobile edge auth in progress' }
      },
      questionResponses: buildDefaultQuestionResponses(false)
    };
  }

  const generatedCleanId = customId || `ge_vr_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
  const cleanSfdcId = customMeta?.sfdcAccountId || customMeta?.vectorAccountId || `NEW-${generatedCleanId.slice(-6).toUpperCase()}`;

  return {
    id: isClean ? generatedCleanId : (customId || 'inst_bionova_ge_value_realization'),
    typeKey: 'ge_value_realization',
    mode: isClean ? 'clean' : 'bionova_draft',
    prefillMode: isClean ? 'clean' : 'evidence',
    meta: {
      customerName: isClean ? (customMeta?.customerName || 'New Enterprise Assessment') : 'BioNova Life Sciences Inc.',
      vectorAccountId: isClean ? cleanSfdcId : 'ACC-1002-BIONOVA',
      sfdcAccountId: isClean ? cleanSfdcId : 'ACC-1002-BIONOVA',
      gcpProjectId: isClean ? (customMeta?.gcpProjectId || 'Pending GCP Project') : '710492831045 (bionova-ai-prod-4102) / 820194736201',
      industry: isClean ? (customMeta?.industry || 'Enterprise Operations') : 'Pharmaceuticals & Biotechnology (HCLS)',
      legacySystemName: isClean ? (customMeta?.legacyPlatformName || 'Legacy AI / Search Baseline') : 'NovaAssist / NOVA-AI (Homegrown OpenAI GPT-4o + 300 Early Pilot Seats)',
      legacyPlatformName: isClean ? (customMeta?.legacyPlatformName || 'Legacy AI / Search Baseline') : 'NovaAssist / NOVA-AI (Homegrown OpenAI GPT-4o + 300 Early Pilot Seats)',
      targetSystemName: isClean ? (customMeta?.targetPlatformName || 'Google Cloud Gemini Enterprise') : 'Google Cloud Gemini Enterprise (85,300 Contracted Seats)',
      targetPlatformName: isClean ? (customMeta?.targetPlatformName || 'Google Cloud Gemini Enterprise') : 'Google Cloud Gemini Enterprise (85,300 Contracted Seats)',
      executiveSponsor: isClean ? (customMeta?.executiveSponsor || 'Executive Sponsor (Pending)') : 'Marcus Vance, CIO',
      accountLeads: isClean ? (customMeta?.calLead ? [customMeta.calLead] : ['Enterprise Account Lead']) : ['Lucas Sterling (Platform/IT)', 'Elena Rostova (R&D/Clinical)', 'Vikram Desai (Google CAL)'],
      customerLeads: isClean ? (customMeta?.customerLeads || '') : 'Lucas Sterling (Platform/IT), Elena Rostova (R&D/Clinical), Devon Thorne',
      googleLeads: isClean ? (customMeta?.calLead || '') : 'Jordan Hayes (OCE GE HCLS), Vikram Desai (Consulting), Claire Montgomery (FDE)',
      assessmentTier: isClean ? 'Enterprise Standard' : 'Regulated / Complex',
      tierOverrideReason: isClean
        ? 'New unfilled customer assessment initialized at Question 1 (C01).'
        : 'Auto-escalated to Regulated / Complex due to GxP Clinical (BNV-04), CMC Manufacturing (BNV-05), and Multi-System ADK Agents (BNV-06).',
      baselineWindow: 'Jan 15, 2026 – Mar 15, 2026 (60 Days)',
      currentWindow: 'Mar 16, 2026 – May 15, 2026 (60 Days)',
      cutoverDate: '2026-06-30',
      lastUpdated: new Date().toISOString()
    },

    // Pre-agreed KR Targets (Locked before scoring per Governance Law)
    agreedKrTargets: {
      targetWauToAssignedPct: 50.0,
      targetTaskEffortReductionPct: 25.0,
      targetExceptionalEffortReductionPct: 50.0,
      targetFirstPassAcceptancePct: 80.0,
      targetPaybackMonths: 12,
      maxSingleWorkflowWeightCap: 0.30,
      version: 'v1.0 (Pre-Agreed Baseline Contract)'
    },

    // Platform Economics & Cost Bridge Ledger (L01-L06, F01-F06)
    costLedger: {
      currency: 'USD',
      // L01: Legacy NovaAssist Annual Costs (Strictly null/pending until BioNova Finance provides actual invoices!)
      legacyAnnualApiCost: null,
      legacyAnnualHostingSearchCost: null,
      legacyAnnualSupportFteCost: null,
      legacyCostNumericState: 'pending', // actual | pending | unknown
      // L02: Retired vs. Retained Legacy Cost
      legacyRetiredAnnualCost: null,
      legacyRetainedParallelRunAnnualCost: null,
      legacyRetirementState: 'parallel_run', // retired | parallel_run | partly_retained
      // L03: Gemini Enterprise Recurring Annual Cost
      geminiAnnualRecurringCost: null,
      geminiCostNumericState: 'pending',
      // L04: One-Time Migration & Parallel Run Cost
      oneTimeMigrationCost: null,
      // L05: Adverse / Workaround Cost
      adverseWorkaroundAnnualCost: 0,
      // F01 / F03: Finance Realization & Sensitivity Parameters
      defaultLoadedHourlyRate: 120,
      cashRealizationFactorPct: 0, // 0% until Finance approves headcount/overtime/contractor budget reduction
      capacityValuationFactorPct: 65,
      defaultAttributionSharePct: 75,
      sensitivityLowMultiplier: 0.75,
      sensitivityHighMultiplier: 1.25
    },

    // Adoption & Access Telemetry (A01-A07 — Verified from Vector Extract ACC-1002-BIONOVA)
    adoptionTelemetry: {
      contractedSeats: isClean ? null : 85300,
      provisionedSeats: isClean ? null : 85000,
      assignedSeatsWave1: isClean ? null : 10663,
      assignedSeats: isClean ? null : 10663,
      mauMultiApi: isClean ? null : 7763,
      multiApiMau30d: isClean ? null : 7763,
      wauAllApi: isClean ? null : 5867,
      allApiWau7d: isClean ? null : 5867,
      wauMultiApi: isClean ? null : 5037,
      dauMultiApi: isClean ? null : 550,
      geminiAssistWau7d: isClean ? null : 5386,
      wauGeminiAssist: isClean ? null : 5386,
      enterpriseSearchWau7d: isClean ? null : 4992,
      wauEnterpriseSearch: isClean ? null : 4992,
      agentsWau7d: isClean ? null : 1710,
      wauAgents: isClean ? null : 1710,
      agentRequests7d: isClean ? null : 12385,
      featureWau: {
        assist: isClean ? null : 5386,
        search: isClean ? null : 4992,
        agent: isClean ? null : 1710,
        agentRolling7dRequests: isClean ? null : 12385
      },
      legacyBaselineEligible: isClean ? null : 15000,
      legacyBaselineWau: isClean ? null : 3200,
      trackerOngoingIssues: isClean ? null : 24,
      cloudBlockersInReview: isClean ? null : 2
    },

    // Repeatable Priority Workflows (W01-W13)
    workflows: isClean ? [
      {
        ...DEFAULT_BIONOVA_WORKFLOWS[0],
        id: 'wf_clean_1',
        code: 'WF1',
        name: 'Priority Workflow 1',
        businessUnit: 'Pending Input',
        owner: 'Pending Input',
        maturity: 'Scoping',
        activeUsers: null,
        completedTasksPerMonth: null,
        numericState: 'pending',
        verificationStatus: 'pending',
        confidenceTier: 'D',
        stages: {
          discovery: { baseline: 0, gemini: 0 },
          synthesis: { baseline: 0, gemini: 0 },
          drafting: { baseline: 0, gemini: 0 },
          review: { baseline: 0, gemini: 0 },
          rework: { baseline: 0, gemini: 0 },
          handoff: { baseline: 0, gemini: 0 }
        },
        cycleTimeBaselineHours: null,
        cycleTimeGeminiHours: null,
        realizedCashSavingsAnnualUsd: 0,
        modeledAnnualValueUsd: 0,
        outcomeScores: {}
      }
    ] : JSON.parse(JSON.stringify(DEFAULT_BIONOVA_WORKFLOWS)),

    // Geographies (G01-G05)
    geographies: isClean ? [] : JSON.parse(JSON.stringify(DEFAULT_BIONOVA_GEOGRAPHIES)),

    // Employee Survey Summary (U01-U10)
    employeeSurvey: {
      invitedCount: isClean ? null : 1200,
      respondentCount: isClean ? null : 420,
      responseRatePct: isClean ? null : 35.0,
      coUseOtherAiToolPct: isClean ? null : 22.0, // Used to check F03 attribution ceiling
      perceivedMinutesSavedMedian: isClean ? null : 24, // Never monetized!
      wouldChooseGeminiAgainPct: isClean ? null : 82.0,
      meanLegacyScore: isClean ? null : 3.23,
      meanGeminiScore: isClean ? null : 4.25,
      preferencePct: isClean ? null : 82.0,
      ratings: isClean ? {} : {
        relevance: { legacy: 3.2, gemini: 4.3 },
        findability: { legacy: 2.9, gemini: 4.2 },
        accuracy: { legacy: 3.4, gemini: 4.3 },
        speed: { legacy: 3.3, gemini: 4.4 },
        ease: { legacy: 3.5, gemini: 4.2 },
        confidence: { legacy: 3.1, gemini: 4.1 }
      }
    },

    // Multi-Party Sign-Off (F08 & P08)
    signOffs: isClean ? {
      businessSponsor: { owner: 'Pending Assignment', status: 'Pending Review', date: '', caveat: 'Awaiting customer input & workflow scoping' },
      platformAnalytics: { owner: 'Pending Assignment', status: 'Pending Review', date: '', caveat: 'Awaiting telemetry ingestion (A01–A07)' },
      finance: { owner: 'Pending Assignment', status: 'Pending Review', date: '', caveat: 'Awaiting L01 legacy invoices & F01 loaded rate sign-off' },
      securityGxp: { owner: 'Pending Assignment', status: 'Pending Review', date: '', caveat: 'Awaiting security & governance questionnaire (Q01–Q06)' }
    } : {
      businessSponsor: { owner: 'Marcus Vance (CIO)', status: 'Pending Review', date: '2026-05-20', caveat: 'Awaiting Wave-1 Cost Bridge & NOVA-AI Pilot readout' },
      platformAnalytics: { owner: 'Lucas Sterling', status: 'Approved with Caveat', date: '2026-05-18', caveat: 'Vector WAU/MAU verified; A07 workflow tagging & NovaAssist chat export in progress' },
      finance: { owner: 'BioNova Finance Controller', status: 'Pending Review', date: '', caveat: 'Awaiting L01 NovaAssist invoices & F01 loaded rate sign-off' },
      securityGxp: { owner: 'Enterprise Security Leads (Security) & GxP QA', status: 'Approved with Caveat', date: '2026-05-18', caveat: 'VPC-SC & citations verified; Gate 3 open until BNV-04/13 RegVault GxP CSV closes' }
    },

    // Per-Question Responses, Outcome Scores (0-4), Confidence Tiers (A-D), and Verification States
    questionResponses: buildDefaultQuestionResponses(isClean)
  };
}

function buildDefaultQuestionResponses(isClean) {
  const map = {};
  for (const q of GE_QUESTIONS) {
    const confPct = isClean ? 0 : getPreStagedConfidenceScorePct(q.id);
    const tier = isClean ? 'D' : getPreStagedConfidenceTier(q.id);
    map[q.id] = {
      questionId: q.id,
      value: isClean ? null : getPreStagedValue(q.id),
      numericState: isClean ? 'pending' : getPreStagedNumericState(q.id),
      outcomeScore: isClean ? 0 : getPreStagedOutcomeScore(q.id),
      confidenceTier: tier,
      confidenceScorePct: confPct,
      verificationStatus: isClean ? 'pending' : getPreStagedVerificationStatus(q.id),
      owner: isClean ? '' : getPreStagedOwner(q.id),
      evidenceUrl: isClean ? '' : getPreStagedEvidenceSource(q.id),
      notes: isClean ? '' : getPreStagedNotes(q.id)
    };
  }
  return map;
}

function getPreStagedValue(qId) {
  const defaults = {
    C01: ['Migration retrospective', 'Expansion case', 'Executive readout'],
    C02: '50,000+ (85,300 Contracted / 85,000 Provisioned / 10,663 Wave-1 Assigned)',
    C03: 'Tier 1 Strategic Alliance ($10M+ ACV / 85k Seats)',
    C04: '6+ countries / global multi-language',
    C05: ['GxP (Manufacturing / Quality / CSV)', 'Clinical Operations (GCP)', 'Medical / Scientific Information', 'Data Privacy / Works Council', 'Commercial / Promotional (MLR)'],
    C06: ['Microsoft 365 / SharePoint / OneDrive', 'OmniDesk ITSM (OOTB & MCP)', 'RegVault DMS (Regulatory / Clinical)', 'BigQuery / Enterprise Data Lakehouse', 'Custom Agents / ADK / API'],
    C07: 'Parallel run (Coexistence during transition)',
    C08: 'Survey recall / pilot timed study only',
    C09: '4–8 workflows (Enterprise Standard)',
    C10: ['Aggregated platform analytics', 'Opt-in employee pulse survey', 'Timed workflow observation study'],
    C11: ['CFO / Finance Leadership', 'CIO / Platform Engineering', 'Business Unit Leads (R&D, Clinical, Commercial, Mfg)', 'Risk / Compliance / GxP QA'],
    P01: ['Enterprise search & grounding', 'Agents / multi-step workflows', 'Broader employee access (85k scale)'],
    P02: 'Phased by function & wave (300 pilot → 10.6k Wave 1 → 85k)',
    P03: '85,300 Contracted / 85,000 Provisioned / 10,663 Wave-1 Assigned (Vector Extract)',
    P04: 'Chat, Doc Analysis & APIs in Both; Grounded Search, Managed Connectors (M365/OmniDesk ITSM/RegVault), ADK Agents & Deep Research in Gemini Only',
    P05: 'M365/SharePoint & BigQuery Actively Used; OmniDesk ITSM MCP in Pilot; RegVault DMS & CoreERP Blocked/In-Flight',
    P06: 'Partially moved (Wave 1 active on GE; NovaAssist retained pending chat history export)',
    P07: ['Community of Practice (CoP) prompt engineering rollout', 'Data platform modernization (BigQuery Gold Layer)', 'Other AI tools in parallel (M365 Copilot / domain tools)'],
    P08: 'Named Owners Identified (Marcus Vance, Lucas Sterling, Elena Rostova, Enterprise Security Leads, BioNova Finance); Finance Claim Sign-Off Pending',
    A01: '85,300 Contracted → 85,000 Provisioned → 10,663 Assigned → 7,763 MAU → 5,867 WAU (55.0% of Assigned)',
    A02: 'Cohort & feature telemetry tracked (Assist 5,386 / Search 4,992 / Agent 1,710 WAU); role/tenure drilldown pending IdP join',
    A03: '61–80%',
    A04: ['Conversational Assist / Chat (5,386 WAU)', 'Enterprise Search (4,992 WAU)', 'Sources & Grounded Citations', 'Document Analysis & Summarization', 'Custom Agents / ADK (1,710 WAU • 12,385 7d reqs)'],
    A05: ['Connector gaps (RegVault DMS / CoreERP / SharePoint opt-in controls)', 'Permissions / WIF group limits & Private Endpoint access', 'Alternative tools & Legacy NovaAssist chat history export dependency'],
    A06: ['Community of Practice (CoP) monthly live sessions & showcases', 'Embedded BU AI Champions network', 'Centralized SharePoint/Confluence Prompt & Use Case Library', 'Role-specific FDE / PSO workshop coaching'],
    A07: 'Sampled pilot study + agent endpoint telemetry (Enterprise-wide workflow tagging identified as "Black Box" gap to close)',
    L01: 'Evidence Pending — Awaiting BioNova Finance NovaAssist (Azure OpenAI + Vector DB + Support FTE) 12-mo invoice ledger',
    L02: 'Parallel Run — NovaAssist retirement gated on closing Bulk Chat History Export blocker',
    L03: 'Evidence Pending — Awaiting BioNova Procurement allocation of 85k GE seat commitment & GCP Project 710492831045 run-rate',
    L04: null,
    L05: 'Workaround effort during parallel run (manual NovaAssist chat export & RegVault/SharePoint connector staging)',
    L06: 'Per assigned/active seat for core GE + direct GCP project/consumption tracking for ADK agents (710492831045)',
    W01: '5 Priority Workflows Defined (WF1 Search/Ask HR, WF2 NOVA-AI Pricing, WF3 Clinical/Reg, WF4 AHEAD, WF5 CMC) with Named Owners',
    W02: 'Telemetry-Backed Active Users & Monthly Task Volumes Recorded for Scaled/Pilot Workflows (WF1–WF3); WF4–WF5 Quarantined in Scoping',
    W04: '6-Stage Task Effort Decomposition Recorded (Discovery, Drafting, Verification, Correction, Approval, Handoff) with HITL Review Deduction',
    W11: 'Unmonetized in Col 1 Cash (Kept in Col 2 Validated Capacity at 65% Factor & Col 3 Modeled Opportunity until Finance Sign-Off)',
    U01: 'Both Legacy NovaAssist and Gemini Enterprise in parallel (Coexistence cohort)',
    U02: ['R&D / Discovery Scientists', 'Clinical Operations & Medical Writing', 'Commercial & Market Access Analysts', 'Manufacturing / CMC / Quality Engineers', 'Global Support Functions (HR, Finance, IT, Procurement)'],
    U03: '75%+ of attempts',
    U04: '11–30 min faster per task',
    U05: 'Reinvested into higher-priority work & deeper analysis',
    U06: 'Gemini Mean: 4.25 / 5.0 vs. Legacy NovaAssist Mean: 3.23 / 5.0 (+1.02 pt gain across 6 dimensions)',
    U07: 'Always / Usually (High verification discipline on regulated & commercial tasks)',
    U08: 'Rarely / Once (Minor unindexed SharePoint/RegVault source gaps; zero privacy/safety leaks)',
    U09: 'Definitely yes (≥80% positive preference)',
    U10: ['Source coverage (RegVault DMS, CoreERP, historical NovaAssist chats)', 'Permissions & connector opt-in simplicity'],
    Q01: 'Held-out golden benchmark + Gemini Auditor + SME human review (NOVA-AI Pricing & Clinical pilots)',
    Q02: 'Zero critical safety/privacy events; hallucination rate <2% with mandatory hyperlink citation policy',
    Q03: 'VPC-SC & core ACLs passed; user/group connector visibility & NotebookLM sharing in bounded remediation',
    Q04: '99.9% uptime; P50 <2.2s (Search/Assist), P95 <6.5s (Agents); 24 Issue Tracker items actively tracked',
    Q05: 'Controls defined & tested (VPC-SC, zero model training, citation grounding, HITL review); formal GxP sign-off in progress',
    Q06: 'Yes — Regulated workflows (BNV-04 Clinical, BNV-05 CMC, BNV-13 Regulatory) scoped in pilot; formal GxP CSV validation required prior to scale (Gate 3 Active)',
    F01: 'Blended Loaded Rate: $120/hr (Support $95/hr, Clinical/CMC $135/hr, Commercial $145/hr) • Cash Realization: 0% (Pending) • Capacity Factor: 65%',
    F02: [
      'Column 1 (Realized Cash): Requires terminated legacy contract/invoice (L02) or signed budget/contractor reduction (W10)',
      'Column 2 (Validated Capacity): Requires measured W04 task time reduction + W07 quality parity; reported in hours & capacity eq.',
      'Column 3 (Modeled Opportunity): Pre-production pilots (NOVA-AI Pricing, AHEAD, Ask HR) reported separately from realized ROI'
    ],
    F03: '75% Attribution Share to Gemini Enterprise (Accounting for 22% Multi-Tool Co-Use & CoP Training Confounders)',
    F04: 'Tier B (0.75x) for Adoption & Pilot Time Studies; Tier C/D for Scoping Value & Pending Legacy Invoices',
    F05: 'No — W04 verification minutes auto-linked to W07; cycle time (W08) not double-monetized with task hours (W04)',
    F06: 'Comparable 60-day pre/post cohort window + Annualized Run-Rate + First-Year Net Value (deducting L04)',
    F07: ['Throughput & cycle-time compression (R&D / Commercial)', 'Search success & enterprise knowledge findability', 'Quality, citation accuracy & GxP governance', 'Active repeat adoption across 85k seats', 'Net platform cost & NovaAssist retirement savings'],
    F08: 'Platform & Security Approved with Caveats (2/4); Executive Sponsor & BioNova Finance Pending Final Cost Bridge (Gate 4)',
    V01: 'Literature triage & 500+ paper structured extraction (CoP & R&D pilots)',
    V02: 'Human-reviewed drafting & clinical data review configuration (100% HITL gate)',
    V03: 'Approved-source retrieval + mandatory hyperlink verification + medical/HTA review',
    V04: 'No regulated PV case decisions in Wave 1 (VPC-SC isolated; AE policy banner active)',
    V05: 'CMC Tech Transfer & QMS/SOP contextualization (BNV-05 in Scoping; controlled records require QA sign-off)',
    V06: 'Internal global pricing simulation (BNV-06 NOVA-AI) & internal market access drafting with human approval',
    V07: 'Usually — SharePoint/OneDrive bug resolved; user/group connector visibility opt-in under verification',
    V08: 'Read-only retrieval, simulation & draft generation with mandatory human approval (OmniDesk ITSM MCP & NOVA-AI Pricing)',
    G01: 'US/NORTHAM Wave 1 Live (Q1–Q2 2026); EMEA/APAC/LATAM phased waves tracked',
    G02: 'Segmented by NORTHAM (primary 10,663 assigned wave) vs. International cohorts',
    G03: 'Partly comparable — English validated; ES/FR/DE/JA localization roadmap tracked with Henrik Lindqvist',
    G04: ['EU / German Works Council (k-anonymity aggregated telemetry rule)', 'Data residency / regional routing logic (Adrian Chen)', 'Regulated pharma GxP market rules'],
    G05: 'Report NORTHAM Wave 1 primary; pool international waves only after localization & Works Council parity'
  };
  return defaults[qId] !== undefined ? defaults[qId] : 'Defined in Workflow Register (W01–W13)';
}

function getPreStagedNumericState(qId) {
  if (['L01', 'L02', 'L03', 'L04'].includes(qId)) return 'pending';
  return 'actual';
}

function getPreStagedOutcomeScore(qId) {
  const scores = {
    // Platform Economics (L01-L06 = 20 pts)
    L01: 2, // 2/4 on inventory structure; invoice actuals pending
    L02: 1, // 1/4 because parallel run retains NovaAssist until chat export closes
    L03: 3, // 3/4 contract seats & project 710492831045 known; dollar sign-off pending
    L04: 2, // 2/4 transition effort tracked
    L05: 2, // 2/4 net neutral workaround effort
    L06: 3, // 3/4 seat + project allocation rule defined
    // Adoption & Access (A01-A07 = 15 pts)
    A01: 4, // 5,867 WAU / 10,663 assigned = 55% (exceeds 50% target)
    A02: 3, // Feature & cohort concentration tracked
    A03: 3, // 61-80% task completion on connected sources
    A04: 4, // Assist, Search, Agents all active with telemetry
    A05: 2, // Bounded connector/export blockers actively remediated
    A06: 4, // Community of Practice (CoP) + Champions + Prompt Library live
    A07: 2, // Pilot mapping done; enterprise "Black Box" observability gap open
    // Quality, Risk & Governance (Q01-Q06 = 20 pts)
    Q01: 3, // Golden benchmark + Gemini Auditor on NOVA-AI & Clinical
    Q02: 4, // Zero critical safety/privacy leaks; mandatory citation grounding
    Q03: 3, // VPC-SC passed; connector opt-in visibility in bounded remediation
    Q04: 3, // Service targets met; 24 Issue Tracker items tracked
    Q05: 3, // Controls tested for pilot scope
    Q06: 2, // Regulated workflows identified; GxP CSV validation incomplete (Gate 3)
    // Employee Experience (U01-U10 = 10 pts)
    U01: 3,
    U02: 0,
    U03: 3,
    U04: 3,
    U05: 3,
    U06: 4,
    U07: 4,
    U08: 3,
    U09: 4,
    U10: 0
  };
  return scores[qId] !== undefined ? scores[qId] : 3;
}

/**
 * Exact 0–100% Confidence Score per question based on internal portal/doc grounding:
 * - Tier A (90–100%): Hard telemetry, contract records, or Issue Tracker/blocker logs (28 Qs)
 * - Tier B (75–89%): Grounded in CE use-case portfolio (BNV-04..13), pilot studies, & weekly sync docs (34 Qs)
 * - Tier C (40–74%): Directional CoP feedback / pulse survey recall or workaround estimate (14 Qs)
 * - Tier D (0–39%): Strictly BioNova-internal Finance invoices or formal multi-party sign-off pending (6 Qs)
 */
const QUESTION_CONFIDENCE_PCT_MAP = {
  // Module C (9 Tier A, 2 Tier B)
  C01: 96, C02: 99, C03: 98, C04: 94, C05: 95, C06: 96, C07: 95, C08: 92, C09: 95, C10: 84, C11: 88,
  // Module P (6 Tier A, 2 Tier B)
  P01: 92, P02: 96, P03: 99, P04: 95, P05: 94, P06: 94, P07: 85, P08: 82,
  // Module A (5 Tier A, 1 Tier B, 1 Tier C)
  A01: 99, A02: 92, A03: 82, A04: 98, A05: 94, A06: 95, A07: 64,
  // Module L (1 Tier A, 1 Tier C, 4 Tier D)
  L01: 15, L02: 20, L03: 35, L04: 25, L05: 65, L06: 91,
  // Module W (11 Tier B, 2 Tier C)
  W01: 88, W02: 84, W03: 85, W04: 80, W05: 82, W06: 81, W07: 83, W08: 80, W09: 82, W10: 58, W11: 52, W12: 84, W13: 88,
  // Module U (10 Tier C — 30-day recall survey cohort)
  U01: 68, U02: 65, U03: 64, U04: 60, U05: 62, U06: 66, U07: 68, U08: 65, U09: 66, U10: 64,
  // Module Q (2 Tier A, 4 Tier B)
  Q01: 85, Q02: 86, Q03: 92, Q04: 95, Q05: 82, Q06: 84,
  // Module F (2 Tier A, 4 Tier B, 2 Tier D)
  F01: 30, F02: 94, F03: 78, F04: 85, F05: 88, F06: 92, F07: 84, F08: 25,
  // Module V (2 Tier A, 6 Tier B)
  V01: 85, V02: 86, V03: 82, V04: 88, V05: 80, V06: 86, V07: 92, V08: 93,
  // Module G (1 Tier A, 4 Tier B)
  G01: 95, G02: 86, G03: 82, G04: 85, G05: 84
};

function getPreStagedConfidenceScorePct(qId) {
  return QUESTION_CONFIDENCE_PCT_MAP[qId] !== undefined ? QUESTION_CONFIDENCE_PCT_MAP[qId] : 80;
}

function getPreStagedConfidenceTier(qId) {
  const pct = getPreStagedConfidenceScorePct(qId);
  if (pct >= 90) return 'A';
  if (pct >= 75) return 'B';
  if (pct >= 40) return 'C';
  return 'D';
}

function getPreStagedVerificationStatus(qId) {
  const tier = getPreStagedConfidenceTier(qId);
  if (tier === 'A') return 'verified';
  if (tier === 'D') return 'pending';
  return 'draft_verify';
}

function getPreStagedOwner(qId) {
  if (qId.startsWith('A') || qId.startsWith('P')) return 'Lucas Sterling (BioNova IT / Platform)';
  if (qId.startsWith('L') || qId.startsWith('F')) return 'BioNova Finance & Procurement / Vikram Desai';
  if (qId.startsWith('Q') || qId.startsWith('V')) return 'Elena Rostova / Enterprise Security Leads (Security & GxP QA)';
  if (qId.startsWith('U')) return 'Jordan Hayes / CoP Survey Lead';
  return 'Lucas Sterling / Program Office';
}

function getPreStagedEvidenceSource(qId) {
  if (['A01', 'A02', 'A04', 'P02', 'P03', 'C02', 'C03', 'G01'].includes(qId)) {
    return 'Enterprise_Agent_Acceleration_Workbook.xlsx → Import of GE Customers Extract (Row 11: ACC-1002-BIONOVA)';
  }
  if (['A05', 'P05', 'P06', 'C04', 'C07', 'C08', 'Q03', 'Q04', 'A07', 'L05', 'V07'].includes(qId)) {
    return 'BioNova_Cloud_Blockers_Tracker.xlsx & BioNova_Product_UX_Tracker.xlsx';
  }
  if (['A06', 'P01', 'P07', 'U01', 'U02', 'U03', 'U04', 'U05', 'U06', 'U07', 'U08', 'U09', 'U10', 'V01'].includes(qId)) {
    return 'BioNova_Gemini_Community_of_Practice_Readout.pdf & CoP Pulse Readout';
  }
  if (['C05', 'C06', 'C09', 'W01', 'W02', 'W03', 'W04', 'W05', 'W06', 'W07', 'W08', 'W09', 'W12', 'W13', 'Q01', 'Q02', 'Q05', 'Q06', 'V02', 'V03', 'V04', 'V05', 'V06', 'V08'].includes(qId)) {
    return 'BioNova CE Use-Case Tracker (BNV-04 Clinical, BNV-05 CMC, BNV-06 NOVA-AI, BNV-07 AHEAD, BNV-08 Ask HR, BNV-13 Reg)';
  }
  if (['L01', 'L02', 'L03', 'L04', 'F01', 'F08', 'W10', 'W11'].includes(qId)) {
    return 'Evidence Pending — Requires BioNova Finance Invoice Ledger & Controller Sign-Off';
  }
  return 'BioNova GE Assessment Dossier (ACC-1002-BIONOVA • GCP Project 710492831045)';
}

function getPreStagedNotes(qId) {
  if (qId === 'A01') return 'Verified from Vector extract: 85,300 contracted, 85,000 provisioned, 10,663 assigned, 7,763 Multi-API MAU, 5,867 All-API WAU.';
  if (qId === 'A05') return 'Top blockers from Lucas Sterling sheet: (1) RegVault/CoreERP/SharePoint opt-in controls, (2) NovaAssist chat history bulk export, (3) WIF group limit & Private Endpoint.';
  if (qId === 'L01') return 'Unanswered numeric field kept null per guardrail (never defaulted to $0).';
  return '';
}

/**
 * Fallback candidate options for structured/numeric/matrix questions so that ALL 82 questions
 * present explicit selectable options with per-option Confidence Scores & Tiers for customer confirmation.
 */
const FALLBACK_STRUCTURED_OPTIONS = {
  C02: [
    '50,000+ (85,300 Contracted / 85,000 Provisioned / 10,663 Wave-1 Assigned)',
    '10,000–49,999 (Wave-1 Assigned Population Only: 10,663)',
    '1,000–9,999 (Active Monthly Cohort Only: 7,763 MAU)',
    '<1,000 (Pilot Cohort Only: 300)'
  ],
  P03: [
    '85,300 Contracted / 85,000 Provisioned / 10,663 Wave-1 Assigned (Vector Extract)',
    '85,000 Provisioned across global cohorts (Full Enterprise Activation)',
    '10,663 Wave-1 NORTHAM Assigned Cohort Only',
    'Unknown / Pending HR Denominator Audit'
  ],
  P04: [
    'Chat, Doc Analysis & APIs in Both; Grounded Search, Managed Connectors (M365/OmniDesk ITSM/RegVault), ADK Agents & Deep Research in Gemini Only',
    'Conversational Chat & Basic Search in Both; Custom Agents in Gemini Only',
    'Full capability parity across Legacy NovaAssist and Gemini Enterprise'
  ],
  P05: [
    'M365/SharePoint & BigQuery Actively Used; OmniDesk ITSM MCP in Pilot; RegVault DMS & CoreERP Blocked/In-Flight',
    'M365/SharePoint Only Connected; All Other Enterprise Connectors Pending',
    'All Enterprise Connectors (M365, OmniDesk ITSM, RegVault, CoreERP) Live in Production'
  ],
  P08: [
    'Named Owners Identified (Marcus Vance, Lucas Sterling, Elena Rostova, Enterprise Security Leads, BioNova Finance); Finance Claim Sign-Off Pending',
    'All 5 Governance Domain Owners Formally Signed Off',
    'Governance Owners Unassigned / Disputed'
  ],
  A01: [
    '85,300 Contracted → 85,000 Provisioned → 10,663 Assigned → 7,763 MAU → 5,867 WAU (55.0% of Assigned)',
    '10,663 Assigned → 5,037 Multi-API WAU (47.2% Multi-Surface Repeat Active)',
    'Pending Regional Cohort Breakdown'
  ],
  L01: [
    'Evidence Pending — Awaiting BioNova Finance NovaAssist (Azure OpenAI + Vector DB + Support FTE) 12-mo invoice ledger',
    'Preliminary Scoping Estimate: $1.8M–$2.4M/yr Legacy NovaAssist API + Hosting + Engineering Support',
    'Audited 12-Month BioNova Finance Legacy NovaAssist Invoice Ledger Reconciled'
  ],
  L02: [
    'Parallel Run — NovaAssist retirement gated on closing Bulk Chat History Export blocker',
    'Partial Legacy NovaAssist API Spend Retired Following Wave-1 Cutover',
    '100% Avoidable Legacy NovaAssist Run-Rate Decommissioned & Verified by BioNova Finance'
  ],
  L03: [
    'Evidence Pending — Awaiting BioNova Procurement allocation of 85k GE seat commitment & GCP Project 710492831045 run-rate',
    'Apportioned by Active Wave-1 Assigned Seats (10,663 / 85,000) + Direct GCP Project 710492831045 Billing',
    'Full 85,300-Seat Enterprise Contract Reconciled with BioNova Procurement'
  ],
  L04: [
    'Google PSO SOWs Known ($590K NOVA-AI + $750K AHEAD = $1.34M); Internal BioNova IT Transition Hours Pending',
    'Full One-Time Migration & Parallel-Run Transition Ledger Reconciled by BioNova Finance',
    'Unknown / Unmeasured Transition Spend'
  ],
  W01: [
    '5 Priority Workflows Defined (WF1 Search/Ask HR, WF2 NOVA-AI Pricing, WF3 Clinical/Reg, WF4 AHEAD, WF5 CMC) with Named Owners',
    '3 Active Pilot/Scaled Workflows Only (WF1, WF2, WF3); Scoping Workflows Excluded',
    'Workflow Owners & Definitions Pending'
  ],
  W02: [
    'Telemetry-Backed Active Users & Monthly Task Volumes Recorded for Scaled/Pilot Workflows (WF1–WF3); WF4–WF5 Quarantined in Scoping',
    'Full System-Logged Task Volumes Across All 5 Workflows',
    'Estimated Task Volumes Only'
  ],
  W04: [
    '6-Stage Task Effort Decomposition Recorded (Discovery, Drafting, Verification, Correction, Approval, Handoff) with HITL Review Deduction',
    'Top-Line Task Duration Estimate Only (Without 6-Stage Review/Correction Split)',
    'Timed Observation Study Pending'
  ],
  W11: [
    'Unmonetized in Col 1 Cash (Kept in Col 2 Validated Capacity at 65% Factor & Col 3 Modeled Opportunity until Finance Sign-Off)',
    'Finance-Approved Unit Dollar Value per Outcome Signed Off for Col 1 Realized Cash',
    'Nonfinancial KPI Tracking Only'
  ],
  U06: [
    'Gemini Mean: 4.25 / 5.0 vs. Legacy NovaAssist Mean: 3.23 / 5.0 (+1.02 pt gain across 6 dimensions)',
    'Moderate Improvement: Gemini Mean 3.8 / 5.0 vs. Legacy NovaAssist Mean 3.3 / 5.0',
    'Neutral / Comparable Rating Between Legacy NovaAssist and Gemini Enterprise'
  ],
  F01: [
    'Blended Loaded Rate: $120/hr (Support $95/hr, Clinical/CMC $135/hr, Commercial $145/hr) • Cash Realization: 0% (Pending) • Capacity Factor: 65%',
    'BioNova Finance Controller Signed-Off Rate Card & Cash Realization Factor (>0%)',
    'Unmonetized Hours Only (No Loaded Hourly Rate Applied)'
  ],
  F03: [
    '75% Attribution Share to Gemini Enterprise (Accounting for 22% Multi-Tool Co-Use & CoP Training Confounders)',
    '50% Conservative Attribution Share to Gemini Enterprise',
    '100% Attribution Share to Gemini Enterprise (Zero Confounder Haircut)'
  ],
  F08: [
    'Platform & Security Approved with Caveats (2/4); Executive Sponsor & BioNova Finance Pending Final Cost Bridge (Gate 4)',
    'All 4 Governance Domains (Sponsor, Platform, Finance, Security/GxP) Formally Signed Off',
    'Pending Initial Executive Steering Review'
  ]
};

/**
 * Dynamically adapts question prompt text to the active customer so non-BioNova customers
 * never display BioNova/NovaAssist-specific references in question titles.
 */
function getCustomerContextualQuestionText(question, dossier = null) {
  if (!question) return '';
  const isBioNova = !dossier || !dossier.meta?.vectorAccountId || dossier.meta?.vectorAccountId === 'ACC-1002-BIONOVA';
  if (isBioNova) return question.question;

  const custName = dossier.meta?.customerName || 'Enterprise Customer';
  const legacyName = dossier.meta?.legacyPlatformName || dossier.meta?.legacySystemName || 'Legacy Baseline';
  const wfs = dossier.workflows || [];
  const wf1Name = wfs[0]?.name || 'WF1 Primary Workflow';
  const wf2Name = wfs[1]?.name || wf1Name;

  const map = {
    C07: `What is the state of the previous system (${legacyName})?`,
    P01: `Why was the migration from ${legacyName} to Gemini Enterprise undertaken?`,
    P04: `Which capabilities existed in each platform (${legacyName} vs. Gemini Enterprise)?`,
    P06: `What happened to legacy baseline users and workflows at ${custName}?`,
    L01: `What were annual legacy baseline platform & tool costs at ${custName}?`,
    L02: `Which legacy baseline costs at ${custName} have ended or will end?`,
    F01: `What loaded hourly rates ($/hr) and realization rules (0–100%) are approved by ${custName} Finance?`,
    F02: `What counts as an approved financial or capacity benefit under ${custName} CFO rules?`,
    F07: `Which executive outcomes does ${custName} leadership prioritize? (Rank top five)`,
    V01: `Domain Knowledge & Triage: Which research or operational output is accelerated (${wf1Name})?`,
    V02: `Core Operations: Does AI influence operational documentation or decision workflows (${wf2Name})?`,
    V03: `Information Substantiation: How are domain and customer answers substantiated (${wf1Name})?`,
    V05: `Operations / Quality: Does output touch SOPs, manuals, or controlled operational records at ${custName}?`,
    V06: `Commercial / Customer Operations: Does output touch pricing, claims, or customer workflows (${wf2Name})?`
  };

  return map[question.id] || question.question.replace(/BioNova/g, custName).replace(/NovaAssist \(OpenAI\)|Legacy NovaAssist|NovaAssist/g, legacyName);
}

/**
 * Dynamically adapts requiredEntry / routingConsequence helper text to the active customer
 * so non-BioNova customers never display "Legacy NovaAssist" or "BioNova" in question helper text.
 */
function getCustomerContextualRequiredEntry(question, dossier = null) {
  if (!question || !question.requiredEntry) return '';
  const isBioNova = !dossier || !dossier.meta?.vectorAccountId || dossier.meta?.vectorAccountId === 'ACC-1002-BIONOVA';
  if (isBioNova) return question.requiredEntry;
  const custName = dossier.meta?.customerName || 'Enterprise Customer';
  const legacyName = dossier.meta?.legacyPlatformName || dossier.meta?.legacySystemName || 'Legacy Baseline';
  return String(question.requiredEntry)
    .replace(/Legacy NovaAssist/g, legacyName)
    .replace(/NovaAssist/g, legacyName)
    .replace(/BioNova/g, custName);
}

/**
 * Returns every option for a given question enriched with its deterministic Confidence Score (0–100%),
 * Confidence Tier ('A' | 'B' | 'C' | 'D'), Evidence Multiplier, Selection Status, and Source Provenance.
 * Uses customer-specific `resp.candidateOptions` from the 8-source ingestor whenever present!
 */
function getQuestionOptionsWithConfidence(question, resp = {}, dossier = null) {
  if (!question) return [];

  const isOptionSelected = (optText, valToTest) => {
    if (valToTest === null || valToTest === undefined) return false;
    if (Array.isArray(valToTest)) {
      return valToTest.some(v => String(v).toLowerCase() === String(optText).toLowerCase() || String(optText).toLowerCase().includes(String(v).toLowerCase()));
    }
    const sVal = String(valToTest).toLowerCase().trim();
    const sOpt = String(optText).toLowerCase().trim();
    if (!sVal) return false;
    return sVal === sOpt || sOpt.includes(sVal) || sVal.includes(sOpt);
  };

  const currentVal = resp.value !== undefined && resp.value !== null
    ? resp.value
    : '';

  // 1. If the multi-source customer ingestor populated customer-specific candidateOptions, use them directly!
  if (Array.isArray(resp.candidateOptions) && resp.candidateOptions.length > 0) {
    return resp.candidateOptions.map((cOpt, idx) => {
      const selectedNow = isOptionSelected(cOpt.optionText, currentVal);
      let confPct = cOpt.confidencePct ?? 80;
      let tier = cOpt.confidenceTier || (confPct >= 90 ? 'A' : confPct >= 75 ? 'B' : confPct >= 40 ? 'C' : 'D');
      let basis = cOpt.sourceBasis || resp.evidenceUrl || '8-Source Customer Evidence Ledger';

      if (selectedNow && resp.verificationStatus === 'verified' && resp.customerConfirmed) {
        confPct = 100;
        tier = 'A';
        basis = `Customer Confirmed + ${resp.evidenceUrl || basis}`;
      }

      const factorObj = EVIDENCE_FACTORS[tier] || EVIDENCE_FACTORS.D;
      return {
        ...cOpt,
        index: idx,
        isSelected: selectedNow,
        confidencePct: confPct,
        confidenceTier: tier,
        evidenceMultiplier: factorObj.factor,
        tierBadgeText: `Tier ${tier} (${factorObj.factor.toFixed(2)}x)`,
        sourceBasis: basis
      };
    });
  }

  // 2. Fallback for local default BioNova or Clean dossier
  const custName = dossier?.meta?.customerName || 'BioNova Life Sciences Inc.';
  const rawOptions = (Array.isArray(question.options) && question.options.length > 0)
    ? question.options
    : (FALLBACK_STRUCTURED_OPTIONS[question.id] || []);

  const preStagedVal = resp.portalBackedValue !== undefined ? resp.portalBackedValue : getPreStagedValue(question.id);
  const baseQuestionConf = Number(resp.confidenceScorePct ?? getPreStagedConfidenceScorePct(question.id));
  const evidenceSource = resp.evidenceUrl || getPreStagedEvidenceSource(question.id);

  return rawOptions.map((rawOptText, idx) => {
    const optText = custName !== 'BioNova Life Sciences Inc.'
      ? String(rawOptText).replace(/BioNova/g, custName).replace(/NovaAssist/g, 'Legacy Baseline')
      : rawOptText;
    const selectedNow = isOptionSelected(optText, currentVal);
    const backedByInternalPortal = isOptionSelected(optText, preStagedVal) || (question.id === 'L04' && idx === 0);

    let confPct;
    let basisLabel;
    let impliedOutcomeScore;

    if (selectedNow && resp.verificationStatus === 'verified' && resp.customerConfirmed) {
      confPct = 100;
      basisLabel = `Customer Confirmed + ${evidenceSource}`;
      impliedOutcomeScore = Number(resp.outcomeScore ?? 4);
    } else if (backedByInternalPortal) {
      const itemOffset = Array.isArray(preStagedVal) ? Math.min(4, idx) : 0;
      confPct = Math.max(15, Math.min(99, baseQuestionConf - itemOffset));
      basisLabel = evidenceSource;
      impliedOutcomeScore = getPreStagedOutcomeScore(question.id);
    } else {
      if (idx === 1 && baseQuestionConf >= 75) {
        confPct = 52;
        basisLabel = `Alternative Scope / Partial Pilot Evidence — Confirm w/ ${custName} to Select`;
        impliedOutcomeScore = Math.max(1, getPreStagedOutcomeScore(question.id) - 1);
      } else if (String(optText).toLowerCase().includes('unknown') || String(optText).toLowerCase().includes('none') || String(optText).toLowerCase().includes('untested')) {
        confPct = 10;
        basisLabel = 'Unmeasured / Fallback Option (Tier D — 0.0x)';
        impliedOutcomeScore = 0;
      } else {
        confPct = 28;
        basisLabel = 'Not Observed in Current Internal Telemetry — Requires Customer Evidence Override';
        impliedOutcomeScore = idx === 0 ? 4 : Math.max(1, 3 - idx);
      }
    }

    let tier = 'D';
    if (confPct >= 90) tier = 'A';
    else if (confPct >= 75) tier = 'B';
    else if (confPct >= 40) tier = 'C';

    const factorObj = EVIDENCE_FACTORS[tier] || EVIDENCE_FACTORS.D;

    return {
      optionText: optText,
      index: idx,
      isSelected: selectedNow,
      isPortalBacked: backedByInternalPortal,
      confidencePct: confPct,
      confidenceTier: tier,
      evidenceMultiplier: factorObj.factor,
      tierBadgeText: `Tier ${tier} (${factorObj.factor.toFixed(2)}x)`,
      sourceBasis: basisLabel,
      impliedOutcomeScore
    };
  });
}

/**
 * Deterministic Evaluation Engine:
 * Computes (1) Financial & Capacity Ledger, (2) 0-100 Weighted Index (Raw vs. Evidence-Adjusted),
 * (3) 5 Non-Compensable Gates, and (4) Cross-Module Contradiction Warnings.
 */
function evaluateGeValueRealization(dossier) {
  const safeDossier = dossier || createInitialGeDossier('bionova_draft');
  const workflows = Array.isArray(safeDossier.workflows) ? safeDossier.workflows : DEFAULT_BIONOVA_WORKFLOWS;
  const qMap = safeDossier.questionResponses || {};
  const cost = safeDossier.costLedger || {};
  const telemetry = safeDossier.adoptionTelemetry || {};
  const kr = safeDossier.agreedKrTargets || {};
  const custName = safeDossier.meta?.customerName || 'BioNova Life Sciences Inc.';
  const isBioNova = !safeDossier.meta?.vectorAccountId || safeDossier.meta?.vectorAccountId === 'ACC-1002-BIONOVA';

  // =========================================================================
  // 1. EVALUATE WORKFLOW-LEVEL METRICS & CAPPED HYBRID PORTFOLIO WEIGHTS
  // =========================================================================
  const rawVolumes = workflows.map(wf => {
    const vol = Number(wf.completedTasksPerMonth) || 0;
    return Math.max(vol, 50);
  });
  const totalRawVol = rawVolumes.reduce((a, b) => a + b, 0) || 1;
  const maxCap = kr.maxSingleWorkflowWeightCap || 0.30;

  let weights = workflows.map((wf, idx) => {
    if (wf.portfolioWeightCap) return wf.portfolioWeightCap;
    return Math.min(maxCap, rawVolumes[idx] / totalRawVol);
  });
  const weightSum = weights.reduce((a, b) => a + b, 0) || 1;
  weights = weights.map(w => w / weightSum);

  let totalRealizedCashWorkflowsAnnual = 0;
  let totalValidatedCapacityHoursMonthly = 0;
  let totalValidatedCapacityValueAnnual = 0;
  let totalModeledOpportunityAnnual = 0;
  let totalReviewExtraMinutesPerMonth = 0;

  const evaluatedWorkflows = workflows.map((wf, idx) => {
    const portfolioWeight = weights[idx];
    const stages = wf.stages || {};
    const stageKeys = ['discovery', 'drafting', 'verification', 'correction', 'approval', 'handoff'];

    let baselineMinutes = 0;
    let geminiMinutes = 0;
    for (const sk of stageKeys) {
      baselineMinutes += Number(stages[sk]?.baseline || 0);
      geminiMinutes += Number(stages[sk]?.gemini || 0);
    }

    const reviewBaselineMin = Number(stages.verification?.baseline || 0) + Number(stages.correction?.baseline || 0) + Number(stages.approval?.baseline || 0);
    const reviewGeminiMin = Number(stages.verification?.gemini || 0) + Number(stages.correction?.gemini || 0) + Number(stages.approval?.gemini || 0);
    const reviewDeltaMin = reviewGeminiMin - reviewBaselineMin;

    const netMinutesSavedPerTask = baselineMinutes - geminiMinutes;
    const effortReductionPct = baselineMinutes > 0 ? (netMinutesSavedPerTask / baselineMinutes) * 100 : 0;

    const isScopingOrProposed = wf.maturity === 'Scoping' || wf.maturity === 'Proposed' || wf.numericState === 'pending' || wf.numericState === 'unknown';
    const tasksPerMonth = (!isScopingOrProposed && wf.completedTasksPerMonth !== null && wf.completedTasksPerMonth !== undefined)
      ? Number(wf.completedTasksPerMonth)
      : null;

    const attributionShare = (Number(wf.attributionSharePct ?? cost.defaultAttributionSharePct ?? 75)) / 100;
    const loadedRate = Number(wf.approvedHourlyRate || cost.defaultLoadedHourlyRate || 120);
    const cashRealizationFactor = (Number(wf.realizationFactorPct ?? cost.cashRealizationFactorPct ?? 0)) / 100;
    const capacityFactor = (Number(wf.capacityConversionFactorPct ?? cost.capacityValuationFactorPct ?? 65)) / 100;

    let grossHoursReleasedMonthly = null;
    let attributedHoursReleasedMonthly = null;
    let realizedCashAnnual = 0;
    let validatedCapacityValueAnnual = 0;
    let benefitColumn = 'Col 3: Modeled Opportunity (Scoping / Pilot)';

    if (tasksPerMonth !== null && !isScopingOrProposed) {
      grossHoursReleasedMonthly = (tasksPerMonth * netMinutesSavedPerTask) / 60;
      attributedHoursReleasedMonthly = grossHoursReleasedMonthly * attributionShare;

      if (reviewDeltaMin > 0) {
        totalReviewExtraMinutesPerMonth += tasksPerMonth * reviewDeltaMin;
      }

      if (wf.realizationClass === 'cash_realized' && cashRealizationFactor > 0 && (wf.confidenceTier === 'A' || wf.confidenceTier === 'B')) {
        realizedCashAnnual = Math.max(0, attributedHoursReleasedMonthly * 12 * loadedRate * cashRealizationFactor);
        totalRealizedCashWorkflowsAnnual += realizedCashAnnual;
        benefitColumn = 'Col 1: Realized Cash ($)';
      } else if (wf.maturity === 'Scaled' || wf.maturity === 'Pilot') {
        totalValidatedCapacityHoursMonthly += Math.max(0, attributedHoursReleasedMonthly);
        validatedCapacityValueAnnual = Math.max(0, attributedHoursReleasedMonthly * 12 * loadedRate * capacityFactor);
        totalValidatedCapacityValueAnnual += validatedCapacityValueAnnual;
        benefitColumn = 'Col 2: Validated Capacity (Hrs & $ eq)';
      }
    }

    const modeledUsd = Number(wf.modeledAnnualValueUsd || 0);
    totalModeledOpportunityAnnual += modeledUsd;

    // Score Workflow Questions (W01-W13 = 35 pts) blending workflow-specific scores and questionnaire responses
    const wfWeights = KPA_DEFINITIONS.find(k => k.id === 'workflow_outcomes').questionWeights;
    const wfConfFactor = EVIDENCE_FACTORS[wf.confidenceTier || 'C']?.factor ?? 0.4;
    let wfRawPoints = 0;
    let wfAdjPoints = 0;
    for (const [qId, qWt] of Object.entries(wfWeights)) {
      const qResp = qMap[qId];
      const isWfPending = wf.numericState === 'pending' && (!qResp || qResp.numericState === 'pending' || qResp.value === null || qResp.value === '');
      const hasExplicitWfScore = wf.outcomeScores && wf.outcomeScores[qId] !== undefined && wf.outcomeScores[qId] !== null;
      const baseWfScore = isWfPending ? 0 : (hasExplicitWfScore ? Number(wf.outcomeScores[qId]) : Number(qResp?.outcomeScore ?? 0));
      const oScore = isWfPending ? 0 : (hasExplicitWfScore && qResp?.outcomeScore !== undefined ? Number((baseWfScore + Number(qResp.outcomeScore)) / 2) : baseWfScore);
      const qConfFactor = qResp?.confidenceTier ? (EVIDENCE_FACTORS[qResp.confidenceTier]?.factor ?? wfConfFactor) : wfConfFactor;
      const effectiveFactor = isWfPending ? 0 : (wfConfFactor + qConfFactor) / 2;
      const raw = qWt * (Math.min(4, Math.max(0, oScore)) / 4);
      wfRawPoints += raw;
      wfAdjPoints += raw * effectiveFactor;
    }

    return {
      ...wf,
      portfolioWeight,
      baselineMinutes,
      geminiMinutes,
      reviewBaselineMin,
      reviewGeminiMin,
      reviewDeltaMin,
      netMinutesSavedPerTask,
      effortReductionPct,
      grossHoursReleasedMonthly,
      attributedHoursReleasedMonthly,
      realizedCashAnnual,
      validatedCapacityValueAnnual,
      benefitColumn,
      wfRawPoints: Number(wfRawPoints.toFixed(2)),
      wfAdjPoints: Number(wfAdjPoints.toFixed(2))
    };
  });

  // =========================================================================
  // 2. COMPUTE 0–100 WEIGHTED VALUE & EVIDENCE INDEX ACROSS 5 KPAS
  // =========================================================================
  const kpaResults = {};
  let totalApplicableWeight = 0;
  let totalRawPoints = 0;
  let totalAdjustedPoints = 0;
  let answeredCount = 0;
  let verifiedCount = 0;
  let pendingCount = 0;

  for (const q of GE_QUESTIONS) {
    const resp = qMap[q.id] || {};
    if (resp.VerificationStatus === 'verified' || resp.verificationStatus === 'verified') verifiedCount++;
    if (resp.numericState === 'pending' || resp.verificationStatus === 'pending' || resp.value === null) {
      pendingCount++;
    } else {
      answeredCount++;
    }
  }

  for (const kpa of KPA_DEFINITIONS) {
    let kpaApplicableWeight = 0;
    let kpaRaw = 0;
    let kpaAdj = 0;

    if (kpa.id === 'workflow_outcomes') {
      kpaApplicableWeight = 35;
      for (const eWf of evaluatedWorkflows) {
        kpaRaw += eWf.wfRawPoints * eWf.portfolioWeight;
        kpaAdj += eWf.wfAdjPoints * eWf.portfolioWeight;
      }
    } else {
      for (const [qId, qWt] of Object.entries(kpa.questionWeights)) {
        if (qWt === 0) continue;
        const resp = qMap[qId] || {};
        if (resp.numericState === 'na') {
          continue;
        }
        kpaApplicableWeight += qWt;
        const isUnknownOrPending = resp.numericState === 'unknown' || resp.numericState === 'pending';
        const outcomeScore = Number(resp.outcomeScore ?? 0);
        const tierKey = isUnknownOrPending ? 'D' : (resp.confidenceTier || 'C');
        const evFactor = EVIDENCE_FACTORS[tierKey]?.factor ?? 0;

        const raw = qWt * (Math.min(4, Math.max(0, outcomeScore)) / 4);
        const adj = raw * evFactor;
        kpaRaw += raw;
        kpaAdj += adj;
      }
    }

    totalApplicableWeight += kpaApplicableWeight;
    totalRawPoints += kpaRaw;
    totalAdjustedPoints += kpaAdj;

    kpaResults[kpa.id] = {
      ...kpa,
      applicableWeight: kpaApplicableWeight,
      rawScore: Number(kpaRaw.toFixed(2)),
      adjustedScore: Number(kpaAdj.toFixed(2)),
      rawPct: kpaApplicableWeight > 0 ? Number(((kpaRaw / kpaApplicableWeight) * 100).toFixed(1)) : 0,
      adjustedPct: kpaApplicableWeight > 0 ? Number(((kpaAdj / kpaApplicableWeight) * 100).toFixed(1)) : 0
    };
  }

  const normalizedRawIndex = totalApplicableWeight > 0 ? Number(((100 * totalRawPoints) / totalApplicableWeight).toFixed(1)) : 0;
  const normalizedAdjustedIndex = totalApplicableWeight > 0 ? Number(((100 * totalAdjustedPoints) / totalApplicableWeight).toFixed(1)) : 0;
  const coveragePct = Number(totalApplicableWeight.toFixed(1));
  const completenessPct = Number(((answeredCount / GE_QUESTIONS.length) * 100).toFixed(1));

  const regulatedWfs = evaluatedWorkflows.filter(w => w.isRegulatedGxp);
  const weakestRegulatedWorkflow = regulatedWfs.length > 0
    ? regulatedWfs.reduce((min, cur) => (cur.wfAdjPoints < min.wfAdjPoints ? cur : min), regulatedWfs[0])
    : null;

  // =========================================================================
  // 3. EVALUATE PLATFORM COST BRIDGE & 5-COLUMN MECE VALUE LEDGER
  // =========================================================================
  const hasReconciledCostBridge =
    cost.legacyCostNumericState === 'actual' &&
    cost.geminiCostNumericState === 'actual' &&
    cost.legacyRetiredAnnualCost !== null &&
    cost.geminiAnnualRecurringCost !== null;

  const retiredLegacyUsd = hasReconciledCostBridge ? Number(cost.legacyRetiredAnnualCost || 0) : null;
  const retainedLegacyUsd = hasReconciledCostBridge ? Number(cost.legacyRetainedParallelRunAnnualCost || 0) : null;
  const geminiRecurringUsd = hasReconciledCostBridge ? Number(cost.geminiAnnualRecurringCost || 0) : null;
  const oneTimeMigrationUsd = cost.oneTimeMigrationCost !== null ? Number(cost.oneTimeMigrationCost) : null;
  const adverseCostUsd = Number(cost.adverseWorkaroundAnnualCost || 0);

  const netPlatformCostChangeUsd = hasReconciledCostBridge
    ? (retiredLegacyUsd - geminiRecurringUsd - retainedLegacyUsd)
    : null;

  const totalRealizedCashAnnualUsd = hasReconciledCostBridge
    ? Math.max(0, netPlatformCostChangeUsd) + totalRealizedCashWorkflowsAnnual - adverseCostUsd
    : totalRealizedCashWorkflowsAnnual;

  const grossInvestmentAnnualUsd = (geminiRecurringUsd || 0) + (oneTimeMigrationUsd || 0);
  const realizedRoiPct = (hasReconciledCostBridge && grossInvestmentAnnualUsd > 0)
    ? Number((((totalRealizedCashAnnualUsd - grossInvestmentAnnualUsd) / grossInvestmentAnnualUsd) * 100).toFixed(1))
    : null;

  const paybackMonths = (hasReconciledCostBridge && oneTimeMigrationUsd > 0 && totalRealizedCashAnnualUsd > 0)
    ? Number(((oneTimeMigrationUsd / totalRealizedCashAnnualUsd) * 12).toFixed(1))
    : null;

  const lowMult = Number(cost.sensitivityLowMultiplier || 0.75);
  const highMult = Number(cost.sensitivityHighMultiplier || 1.25);

  // =========================================================================
  // 4. EVALUATE 5 NON-COMPENSABLE GOVERNANCE GATES
  // =========================================================================
  const q02Val = String(qMap.Q02?.value || '');
  const q03Val = String(qMap.Q03?.value || '');
  const q06Val = String(qMap.Q06?.value || '');
  const f05Val = String(qMap.F05?.value || '');

  const hasUnvalidatedRegulatedWf = evaluatedWorkflows.some(w => w.isRegulatedGxp && !w.gxpValidated && w.maturity !== 'Retired');
  const leadOwner = safeDossier.meta?.accountLeads?.[0] || safeDossier.meta?.executiveSponsor || 'Account Lead';

  const gates = [
    {
      id: 'gate_1_access_privacy',
      name: 'Gate 1: Unauthorized Access or Material Privacy Incident',
      triggered: q03Val.includes('Confirmed inappropriate access') || q02Val.includes('Triggers Gate 1'),
      status: (q03Val.includes('Confirmed inappropriate access') || q02Val.includes('Triggers Gate 1')) ? 'OPEN' : 'CLEAR',
      owner: isBioNova ? 'Enterprise Security Leads (BioNova Security) & Lucas Sterling' : `${custName} Security & Platform Architecture`,
      remediation: `VPC-SC perimeter & zero-training enforced for ${custName}; connector group visibility under verification.`,
      questionLinks: ['Q02', 'Q03', 'V07']
    },
    {
      id: 'gate_2_quality_safety',
      name: 'Gate 2: Severe Unresolved Quality or Safety Defect',
      triggered: q02Val.includes('Severe unresolved') || evaluatedWorkflows.some(w => Number(w.criticalErrorPct) > 5),
      status: (q02Val.includes('Severe unresolved') || evaluatedWorkflows.some(w => Number(w.criticalErrorPct) > 5)) ? 'OPEN' : 'CLEAR',
      owner: isBioNova ? 'Elena Rostova & BU Workflow Leads' : `${leadOwner} & BU Workflow Leads`,
      remediation: 'Mandatory hyperlink citation grounding policy active; HITL verification built into W04 workflow stages.',
      questionLinks: ['Q01', 'Q02', 'W07', 'W12']
    },
    {
      id: 'gate_3_regulated_gxp',
      name: 'Gate 3: Unvalidated Regulated / Compliance Use Beyond Approved Scope',
      triggered: hasUnvalidatedRegulatedWf || q06Val.includes('Gate 3'),
      status: (hasUnvalidatedRegulatedWf || q06Val.includes('Gate 3')) ? 'OPEN' : 'CLEAR',
      owner: isBioNova ? 'Elena Rostova / GxP QA Validation Owner' : `${custName} Compliance & QA Validation Lead`,
      remediation: isBioNova
        ? 'Complete RegVault DMS MCP connector qualification and 21 CFR Part 11 / Annex 11 CSV sign-off for BNV-04 & BNV-05 prior to production scale.'
        : `Complete connector & compliance qualification for ${custName} pilot workflows prior to full production scale.`,
      questionLinks: ['Q06', 'V02', 'V04', 'V05']
    },
    {
      id: 'gate_4_baseline_reconciliation',
      name: 'Gate 4: Reconcilable Legacy Baseline for Claimed Financial Savings',
      triggered: !hasReconciledCostBridge,
      status: !hasReconciledCostBridge ? 'OPEN' : 'CLEAR',
      owner: isBioNova ? 'BioNova Finance Controller & Lucas Sterling' : `${custName} Finance Controller & ${leadOwner}`,
      remediation: `Enter 12-month legacy baseline cost ledger (L01), confirm legacy retirement schedule (L02), and sign off F01 loaded rates with ${custName} Finance.`,
      questionLinks: ['L01', 'L02', 'L03', 'C08', 'F01']
    },
    {
      id: 'gate_5_duplicate_benefit',
      name: 'Gate 5: Unresolved Duplicate Financial Benefit Across Workflows/Metrics',
      triggered: f05Val.includes('Unresolved overlap'),
      status: f05Val.includes('Unresolved overlap') ? 'OPEN' : 'CLEAR',
      owner: `${custName} Finance & Value Engineering Lead`,
      remediation: 'W04 verification stages locked to W07 review burden; W08 cycle compression excluded from labor-hour monetization.',
      questionLinks: ['F05', 'W04', 'W07', 'W08', 'W10']
    }
  ];

  const openGates = gates.filter(g => g.triggered);
  const anyGateOpen = openGates.length > 0;

  let indexBandLabel = 'Limited demonstrated value or insufficient evidence (0–39)';
  if (normalizedAdjustedIndex >= 80) indexBandLabel = 'Strong, corroborated value realization (80–100)';
  else if (normalizedAdjustedIndex >= 60) indexBandLabel = 'Positive with material improvement opportunities (60–79)';
  else if (normalizedAdjustedIndex >= 40) indexBandLabel = 'Mixed or weakly substantiated value (40–59)';

  const overallHeadlineVerdict = anyGateOpen
    ? 'ON HOLD / NEEDS INVESTIGATION'
    : `VALIDATED VALUE (${indexBandLabel})`;

  // =========================================================================
  // 5. AUTOMATED CROSS-MODULE CONTRADICTION & SANITY CHECKS
  // =========================================================================
  const contradictions = [];

  const c07Val = String(qMap.C07?.value || '');
  if (c07Val.includes('Parallel run') && Number(cost.legacyRetiredAnnualCost || 0) > 0 && Number(cost.legacyRetainedParallelRunAnnualCost || 0) === 0) {
    contradictions.push({
      id: 'chk_parallel_cost',
      severity: 'HIGH',
      modules: 'C07 ↔ L02',
      title: 'Parallel Run vs. Retired Legacy Cost Contradiction',
      detail: 'C07 indicates Legacy Baseline is in Parallel Run, but L02 claims retired legacy cost with $0 retained parallel-run cost.'
    });
  }

  const maxWfActiveUsers = Math.max(...evaluatedWorkflows.map(w => Number(w.activeUsers || 0)), 0);
  if (telemetry.mauMultiApi && maxWfActiveUsers > telemetry.mauMultiApi) {
    contradictions.push({
      id: 'chk_active_users',
      severity: 'HIGH',
      modules: 'W02 ↔ A01',
      title: 'Workflow Active Users Exceed Platform MAU',
      detail: `A workflow claims ${maxWfActiveUsers.toLocaleString()} active users in W02, which exceeds total platform Multi-API MAU (${telemetry.mauMultiApi.toLocaleString()}) in A01.`
    });
  }

  const coUsePct = Number(safeDossier.employeeSurvey?.coUseOtherAiToolPct || 0);
  const impliedAttributionCeiling = 100 - Math.round(coUsePct * 0.5);
  if (Number(cost.defaultAttributionSharePct || 75) > impliedAttributionCeiling) {
    contradictions.push({
      id: 'chk_attribution_ceiling',
      severity: 'MEDIUM',
      modules: 'U01/P07 ↔ F03',
      title: 'Attribution Share Exceeds Multi-Tool Co-Usage Ceiling',
      detail: `F03 claims ${cost.defaultAttributionSharePct}% attribution to Gemini, while U01/P07 shows ${coUsePct}% co-use of other AI tools / training (recommended ceiling ≤${impliedAttributionCeiling}%).`
    });
  }

  return {
    overallHeadlineVerdict,
    anyGateOpen,
    openGatesCount: openGates.length,
    gates,
    index: {
      rawScore: normalizedRawIndex,
      evidenceAdjustedScore: normalizedAdjustedIndex,
      confidenceGap: Number((normalizedRawIndex - normalizedAdjustedIndex).toFixed(1)),
      coveragePct,
      completenessPct,
      answeredCount,
      verifiedCount,
      pendingCount,
      totalQuestions: GE_QUESTIONS.length,
      bandLabel: indexBandLabel
    },
    kpas: kpaResults,
    financials: {
      hasReconciledCostBridge,
      retiredLegacyUsd,
      retainedLegacyUsd,
      geminiRecurringUsd,
      netPlatformCostChangeUsd,
      oneTimeMigrationUsd,
      adverseCostUsd,
      realizedRoiPct,
      paybackMonths,
      fiveColumns: {
        col1RealizedCash: {
          low: hasReconciledCostBridge ? Math.round(totalRealizedCashAnnualUsd * lowMult) : null,
          base: hasReconciledCostBridge ? Math.round(totalRealizedCashAnnualUsd) : null,
          high: hasReconciledCostBridge ? Math.round(totalRealizedCashAnnualUsd * highMult) : null
        },
        col2ValidatedCapacity: {
          hoursMonthlyLow: Math.round(totalValidatedCapacityHoursMonthly * lowMult),
          hoursMonthlyBase: Math.round(totalValidatedCapacityHoursMonthly),
          hoursMonthlyHigh: Math.round(totalValidatedCapacityHoursMonthly * highMult),
          valueAnnualLow: Math.round(totalValidatedCapacityValueAnnual * lowMult),
          valueAnnualBase: Math.round(totalValidatedCapacityValueAnnual),
          valueAnnualHigh: Math.round(totalValidatedCapacityValueAnnual * highMult)
        },
        col3ModeledOpportunity: {
          low: Math.round(totalModeledOpportunityAnnual * 0.7),
          base: Math.round(totalModeledOpportunityAnnual),
          high: Math.round(totalModeledOpportunityAnnual * 1.8)
        },
        col4NonFinancial: {
          wau: telemetry.wauAllApi,
          mau: telemetry.mauMultiApi,
          wauOfAssignedPct: telemetry.assignedSeatsWave1 ? Number(((telemetry.wauAllApi / telemetry.assignedSeatsWave1) * 100).toFixed(1)) : null,
          agent7dRequests: telemetry.featureWau?.agentRolling7dRequests,
          preferencePct: safeDossier.employeeSurvey?.wouldChooseGeminiAgainPct
        },
        col5NegativeEffects: {
          extraReviewHoursMonthly: Number((totalReviewExtraMinutesPerMonth / 60).toFixed(1)),
          ongoingBugs: telemetry.trackerOngoingIssues,
          cloudBlockers: telemetry.cloudBlockersInReview
        }
      }
    },
    evaluatedWorkflows,
    weakestRegulatedWorkflow,
    contradictions
  };
}

module.exports = {
  EVIDENCE_FACTORS,
  GE_MODULES,
  RESPONDENT_FORMS,
  KPA_DEFINITIONS,
  RUBRIC_TEMPLATES,
  GE_QUESTIONS,
  DEFAULT_BIONOVA_WORKFLOWS,
  DEFAULT_BIONOVA_GEOGRAPHIES,
  QUESTION_CONFIDENCE_PCT_MAP,
  getPreStagedConfidenceScorePct,
  getCustomerContextualQuestionText,
  getCustomerContextualRequiredEntry,
  getQuestionOptionsWithConfidence,
  createInitialGeDossier,
  evaluateGeValueRealization
};

