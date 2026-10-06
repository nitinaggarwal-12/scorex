/**
 * Dynamic Per-Assessment Template 05 (3-Zone AS-IS / TRANSITION / TO-BE) Architecture Compiler
 *
 * Implements the canonical "05 AS-IS / TRANSITION / TO-BE — ENTERPRISE CLOUD" 3-zone layout
 * across ALL assessments and ALL 3 architecture designs:
 *  - LEFT ZONE:   AS-IS CURRENT STATE (Channels, Applications, Data Cylinders, Integration, Infrastructure, Security & Governance)
 *  - MIDDLE ZONE: TRANSITION STATE / TRANSFORMATION BRIDGE (6 Phased Pillar Bridge Cards flanked by Blue Block Arrows)
 *  - RIGHT ZONE:  TO-BE FUTURE STATE (Target Value Pillars, Channels, Cloud-Native Digital Platform, Unified Data Platform Cylinders, Event/MCP Integration, Google Cloud Platform, Zero-Trust Security)
 *  - BOTTOM BAR:  KEY TECHNOLOGY ENABLERS (12 Cloud/AI Enablers) + OUTCOMES (5 Quantified Outcomes) + LEGEND Bar
 *
 * Every single card, score badge, pain point, tool name, and transition bridge is 100% grounded
 * in the evaluated assessment's responses, scores, pain points, and verbatim assessor comments.
 */

const PILLAR_DEFS = [
  {
    key: 'platform_governance',
    shortTitle: '1. PLATFORM & GOVERNANCE',
    cleanName: 'Platform & Governance',
    icon: '[P1]',
    matchSubstr: ['platform', 'governance'],
    questionPrefixes: [
      'platform_governance',
      'env_standardization', 'scaling_effectiveness', 'auth_consistency', 'security_controls',
      'governance_centralization', 'compliance_management', 'visibility_comprehensiveness',
      'proactive_monitoring', 'cost_tracking', 'optimization_practices'
    ],
    defaultNeutralStack: 'Multi-Env (Dev/Stg/Prod) • Shared Compute Clusters • RBAC/IAM Policies',
    defaultBridgeTitle: 'Dataplex Catalog & ABAC Isolation',
    defaultTargetTitle: 'Zero-Trust Catalog & Auto-FinOps'
  },
  {
    key: 'data_engineering',
    shortTitle: '2. DATA ENGINEERING',
    cleanName: 'Data Engineering',
    icon: '[P2]',
    matchSubstr: ['data'],
    questionPrefixes: [
      'data_engineering',
      'ingestion_automation', 'ingestion_resilience', 'architecture_adaptability',
      'orchestration_reliability', 'pipeline_lifecycle', 'quality_monitoring',
      'performance_optimization', 'scalability_demand', 'data_discovery', 'cross_domain_analytics'
    ],
    defaultNeutralStack: 'Bronze/Silver/Gold Medallion Tables • Scheduled Batch & Incremental ETL',
    defaultBridgeTitle: 'Datastream CDC & Auto-DQ Pipeline',
    defaultTargetTitle: 'Sub-Sec Auto-CDC & BigLake Iceberg'
  },
  {
    key: 'analytics_bi',
    shortTitle: '3. ANALYTICS & BI',
    cleanName: 'Analytics & BI',
    icon: '[P3]',
    matchSubstr: ['analytics', 'bi'],
    questionPrefixes: [
      'analytics_bi',
      'performance_consistency', 'optimization_approach', 'dashboard_integration',
      'reporting_governance', 'user_empowerment', 'governed_autonomy', 'external_sharing'
    ],
    defaultNeutralStack: 'Certified BI Datasets • Departmental Dashboards • Scheduled Extracts',
    defaultBridgeTitle: 'Looker Semantic Layer & BI Engine',
    defaultTargetTitle: 'Governed KPIs & Conversational BI'
  },
  {
    key: 'machine_learning',
    shortTitle: '4. DATA SCIENCE & ML',
    cleanName: 'Data Science & ML',
    icon: '[P4]',
    matchSubstr: ['ml', 'machine'],
    questionPrefixes: [
      'machine_learning',
      'experiment_tracking', 'deployment_automation', 'model_monitoring', 'feature_store',
      'data_prep', 'ml_ownership', 'ml_compliance', 'production_delivery', 'ml_scalability'
    ],
    defaultNeutralStack: 'Versioned Model Registry • Notebook Feature Prep • Manual Promotion',
    defaultBridgeTitle: 'Vertex Feature Store & MLOps CI/CD',
    defaultTargetTitle: 'Unified Feature Store & Live Serving'
  },
  {
    key: 'generative_ai',
    shortTitle: '5. GENERATIVE AI',
    cleanName: 'Generative AI',
    icon: '[P5]',
    matchSubstr: ['genai', 'generative'],
    questionPrefixes: [
      'generative_ai',
      'genai_vision', 'use_case_definition', 'knowledge_sources', 'knowledge_governance',
      'application_capability', 'integration_patterns', 'output_validation',
      'genai_monitoring', 'ethical_guardrails', 'genai_transparency'
    ],
    defaultNeutralStack: 'Initial LLM Pilots • Ad-Hoc Prompt Templates • Isolated Vector Indexes',
    defaultBridgeTitle: 'Apigee AI Gateway & Vector RAG Hub',
    defaultTargetTitle: 'Multi-Agent Mesh & Model Armor'
  },
  {
    key: 'operational_excellence',
    shortTitle: '6. ENABLEMENT & CoE',
    cleanName: 'Enablement & FinOps CoE',
    icon: '[P6]',
    matchSubstr: ['enablement', 'operational'],
    questionPrefixes: [
      'operational_excellence',
      'coe_structure', 'coe_effectiveness', 'collaboration_strength', 'asset_exchange',
      'training_programs', 'continuous_learning', 'value_linkage', 'value_reviews',
      'continuous_improvement'
    ],
    defaultNeutralStack: 'Baseline SLA Monitoring • Departmental Teams • Periodic Value Reviews',
    defaultBridgeTitle: 'Federated AI CoE & FinOps Telemetry',
    defaultTargetTitle: 'CoE Marketplace & Automated ROI'
  }
];

const KNOWN_TECH_PATTERNS = [
  { label: 'Snowflake', regex: /\bsnowflake\b/i },
  { label: 'Databricks', regex: /\bdatabricks\b/i },
  { label: 'BigQuery', regex: /\bbigquery\b/i },
  { label: 'Redshift', regex: /\bredshift\b/i },
  { label: 'Oracle RAC / Exadata', regex: /\boracle\b/i },
  { label: 'SAP ECC / S4', regex: /\bsap\b/i },
  { label: 'Azure DevOps', regex: /\bazure devops\b/i },
  { label: 'Terraform', regex: /\bterraform\b/i },
  { label: 'Legacy IAM', regex: /\blegacy iam\b/i },
  { label: 'Shared Service Accounts', regex: /\bservice accounts?\b/i },
  { label: 'Excel Spreadsheets', regex: /\bexcel\b/i },
  { label: 'Informatica PowerCenter', regex: /\binformatica\b/i },
  { label: 'Talend', regex: /\btalend\b/i },
  { label: 'Stitch', regex: /\bstitch\b/i },
  { label: 'Fivetran', regex: /\bfivetran\b/i },
  { label: 'AWS Glue', regex: /\bglue\b/i },
  { label: 'AWS Lambda', regex: /\blambda\b/i },
  { label: 'AWS S3', regex: /\bs3\b/i },
  { label: 'GKE / Kubernetes', regex: /\b(gke|eks|aks|kubernetes)\b/i },
  { label: 'Apache Spark', regex: /\bspark\b/i },
  { label: 'Apache Kafka', regex: /\bkafka\b/i },
  { label: 'Apache Airflow', regex: /\bairflow\b/i },
  { label: 'Azure Data Factory (ADF)', regex: /\b(azure data factory|adf)\b/i },
  { label: 'dbt Models', regex: /\bdbt\b/i },
  { label: 'Stored Procedures', regex: /\bstored procedures?\b/i },
  { label: 'Custom Python Scripts', regex: /\b(custom python|on-prem python|python scripts)\b/i },
  { label: 'Looker', regex: /\blooker\b/i },
  { label: 'Tableau', regex: /\btableau\b/i },
  { label: 'Power BI', regex: /\bpower\s*bi\b/i },
  { label: 'Qlik', regex: /\bqlik\b/i },
  { label: 'Cognos', regex: /\bcognos\b/i },
  { label: 'AWS SageMaker', regex: /\bsagemaker\b/i },
  { label: 'Azure ML', regex: /\bazure ml\b/i },
  { label: 'MLflow OSS', regex: /\bmlflow\b/i },
  { label: 'Jupyter Notebooks', regex: /\bjupyter\b/i },
  { label: 'SAS', regex: /\bsas\b/i },
  { label: 'R Scripts', regex: /\br scripts\b/i },
  { label: 'Custom Flask APIs', regex: /\bflask\b/i },
  { label: 'OpenAI GPT-4 API', regex: /\b(openai|gpt-4|gpt4)\b/i },
  { label: 'Azure OpenAI', regex: /\bazure openai\b/i },
  { label: 'AWS Bedrock', regex: /\bbedrock\b/i },
  { label: 'Vertex AI / Gemini', regex: /\b(vertex ai|gemini)\b/i },
  { label: 'Hugging Face', regex: /\bhugging\s*face\b/i },
  { label: 'Pinecone Vector DB', regex: /\bpinecone\b/i },
  { label: 'Chroma Vector DB', regex: /\bchroma\b/i },
  { label: 'Custom LLM Wrappers', regex: /\bllm wrappers\b/i },
  { label: 'Datadog', regex: /\bdatadog\b/i },
  { label: 'New Relic', regex: /\bnew relic\b/i },
  { label: 'PagerDuty', regex: /\bpagerduty\b/i },
  { label: 'Splunk', regex: /\bsplunk\b/i },
  { label: 'CloudWatch', regex: /\bcloudwatch\b/i },
  { label: 'Grafana', regex: /\bgrafana\b/i },
  { label: 'ServiceNow', regex: /\bservicenow\b/i },
  { label: 'Salesforce CRM', regex: /\bsalesforce\b/i },
  { label: 'Epic / Cerner FHIR', regex: /\b(epic|cerner|fhir)\b/i },
  { label: 'AWS Cost Explorer', regex: /\bcost explorer\b/i },
  { label: 'AWS EC2 / Cloud', regex: /\b(aws|ec2)\b/i },
  { label: 'Teradata EDW', regex: /\bteradata\b/i },
  { label: 'Cloudera Hadoop', regex: /\b(cloudera|hadoop|hdfs)\b/i },
  { label: 'CyberArk / Vault', regex: /\b(cyberark|hashicorp|vault)\b/i },
  { label: 'LangChain / OSS Agent', regex: /\b(langchain|semantic kernel|autogen)\b/i }
];

function escapeXml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function humanizePainCode(code) {
  if (!code) return '';
  const str = String(code).trim();
  if (str.includes('_')) {
    return str
      .replace(/_/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());
  }
  return str;
}

function truncateText(str, maxLen = 38) {
  if (!str) return '';
  const s = String(str).replace(/\s+/g, ' ').trim();
  if (s.length <= maxLen) return s;
  const sliced = s.slice(0, maxLen - 2).trim();
  const lastSpace = sliced.lastIndexOf(' ');
  if (lastSpace >= Math.floor(maxLen * 0.6)) {
    return sliced.slice(0, lastSpace).replace(/[,;:/—–-]+$/, '') + '..';
  }
  return sliced + '..';
}

function concisePillarLabel(cleanName, maxLen = 16) {
  if (!cleanName) return 'Pillar';
  const raw = String(cleanName).replace(/^\d+\.\s*/, '').trim();
  const lower = raw.toLowerCase();

  // Canonical semantic compressions so hyphenated & multi-word domain titles never truncate to single words
  const knownMappings = [
    [/shadow ai discovery/i, 'Shadow AI Guard'],
    [/real-time data loss prevention|data loss prevention/i, 'Real-Time DLP'],
    [/identity governance|zero standing privilege/i, 'Zero-Trust IAM'],
    [/model armor|prompt injection defense/i, 'Model Armor'],
    [/continuous siem\/soar|siem\/soar ingestion/i, 'SIEM & Audit'],
    [/multi-agent topology/i, 'Multi-Agent Mesh'],
    [/model context protocol/i, 'MCP Gateway'],
    [/state persistence,\s*memory/i, 'Agentic Memory'],
    [/telemetry,\s*observability/i, 'Agent Telemetry'],
    [/agent identity,\s*entitlements/i, 'Agent IAM & GRC'],
    [/prompt\s*&\s*api architecture/i, 'Prompt & API'],
    [/long-context windows/i, '2M Long-Context'],
    [/token economics/i, 'Token Economics'],
    [/enterprise security,\s*cmek/i, 'CMEK & Safety'],
    [/multi-agent mesh/i, 'Agent Tooling'],
    [/cost visibility/i, 'Cost Visibility'],
    [/anomaly detection/i, 'K8s Rightsizing'],
    [/commitment economics/i, 'CUD Rate Optim'],
    [/storage lifecycle/i, 'Storage Tiering'],
    [/unit economics/i, 'Unit Economics'],
    [/open storage/i, 'Open Lakehouse'],
    [/sql analytics engine/i, 'BQ Slot FinOps'],
    [/data governance,\s*lineage/i, 'Dataplex Lineage'],
    [/modern elt,\s*real-time cdc/i, 'Real-Time CDC'],
    [/bi semantic layer/i, 'Looker Semantic'],
    [/data mesh coe/i, 'Data Mesh CoE'],
    [/platform governance\s*&\s*operations|platform\s*&\s*governance/i, 'Platform & Gov'],
    [/data architecture\s*&\s*management|data engineering/i, 'Data Lakehouse'],
    [/analytics\s*&\s*business intelligence|analytics\s*&\s*bi/i, 'Analytics & BI'],
    [/ai,\s*machine learning\s*&\s*mlops|data science\s*&\s*ml/i, 'MLOps & GenAI'],
    [/security,\s*compliance\s*&\s*privacy/i, 'Zero-Trust Sec'],
    [/cloud economics\s*&\s*finops/i, 'Cloud FinOps'],
    [/generative ai/i, 'Generative AI'],
    [/enablement\s*&\s*finops coe|enablement\s*&\s*coe/i, 'Enablement CoE']
  ];

  for (const [regex, label] of knownMappings) {
    if (regex.test(lower)) {
      return label.length <= maxLen ? label : truncateText(label, maxLen);
    }
  }

  // Never split on intra-word hyphens (e.g. Real-Time, Multi-Agent, Long-Context, Zero-Trust)
  const stripped = raw
    .replace(/\s*\([^)]*\)/g, '')
    .split(/\s*(?:&|\/|,|\band\b|\bvs\.?\b)\s*|\s+[-–—]\s+/i)[0]
    .trim();
  return truncateText(stripped || raw, maxLen);
}

function concisePainPoint(rawPain, fallbackLabel = 'Siloed Baseline', maxLen = 19) {
  if (!rawPain) return truncateText(fallbackLabel, maxLen);
  const s = String(rawPain).replace(/\s+/g, ' ').trim();
  const lower = s.toLowerCase();

  const painMappings = [
    [/42%\s*untagged|untagged cloud/i, 'Untagged Spend'],
    [/untagged shared/i, 'Untagged AI Spend'],
    [/zero prompt cach|reprocessing/i, 'No Context Caching'],
    [/idle dev\/test|idle.*cluster|static threshold/i, 'Idle K8s & Alerts'],
    [/on-demand token|volatile credit|fragmented commit/i, 'Low CUD Coverage'],
    [/uncompacted cold|duplicate copies|millions of/i, 'Cold Storage Sprawl'],
    [/manual showback|manual cost/i, 'Manual Showback'],
    [/finops policy/i, 'Manual Cost Gate'],
    [/pii\/phi in prompts|unredacted rag|sensitive customer data|sensitive data/i, 'Unmasked PII in RAG'],
    [/unmanaged browser|shadow ai|public openai/i, 'Shadow AI Egress'],
    [/model traffic|public internet/i, 'Public API Egress'],
    [/static.*service account|static.*json.*key/i, 'Static IAM Keys'],
    [/shared service/i, 'Shared Service IAM'],
    [/standing administrative|permanent admin/i, 'Standing Admin IAM'],
    [/model armor|indirect prompt injection|jailbreak/i, 'No Prompt Shield'],
    [/default encryption|without customer-managed|cmek/i, 'No CMEK Key Control'],
    [/ephemeral console|centralized logging|missing audit|fragmented.*audit|fragmented.*siem|fragmented/i, 'Fragmented SIEM'],
    [/single-agent|brittle.*prompt chain|technical architecture/i, 'Rigid Agent Chains'],
    [/hardcoded rest|tool wrapper|brittle custom/i, 'Brittle Tool Loops'],
    [/validation\s*&|mcp schema/i, 'No MCP Schema Gate'],
    [/stateless|context lost|episodic memory|deployment consist/i, 'Stateless Agent Ctx'],
    [/trajectory|agent tracing|observability|high operational/i, 'No Agent Tracing'],
    [/human-in-the-loop|hitl/i, 'Missing HITL Gate'],
    [/end-to-end|over-privileged|entitlement/i, 'Over-Scoped Agent'],
    [/512-token|chunked rag|strict 8k-32k|8k-32k/i, '8k–32k Context Cap'],
    [/siloed metadata|tribal knowledge|data locked in/i, 'No Column Lineage'],
    [/openai sdk|vendor lock|vendor-specific/i, 'Locked Legacy SDKs'],
    [/proprietary sql|teradata|snowflake sql|stored procedure/i, 'Proprietary SQL'],
    [/proprietary.*format|proprietary storage|proprietary/i, 'Closed Formats'],
    [/multi-hour batch|batch etl|24 to 48 hours|14-hour nightly/i, '24h Batch ETL Lag'],
    [/full table scans|slot contention/i, 'Full-Table Scans'],
    [/schema drift|data quality/i, 'Silent Schema Drift'],
    [/cross-cloud.*egress|egress fees/i, 'High Egress Costs'],
    [/isolated notebook/i, 'Notebook Silos'],
    [/coarse table-level|coarse acl/i, 'Coarse Table ACLs'],
    [/bi query queuing/i, 'BI Query Queuing'],
    [/siloed bi|manual sql/i, 'Manual SQL Cutover']
  ];

  for (const [regex, compressed] of painMappings) {
    if (regex.test(lower)) {
      return compressed.length <= maxLen ? compressed : truncateText(compressed, maxLen);
    }
  }

  const stripped = s
    .replace(/^(Lack of|Absence of|Missing|Inability to|Proliferation of|Reliance on|Heavy reliance on|Zero|No|High risk of|Difficulty|Complex|Unmanaged)\s+(automated\s+|centralized\s+|real-time\s+|unified\s+|standardized\s+|enterprise\s+)?/i, '')
    .replace(/\b(across|requiring|without|causing|leading to|preventing)\b.*$/i, '')
    .trim();

  const capitalized = stripped ? stripped.charAt(0).toUpperCase() + stripped.slice(1) : s;
  return truncateText(capitalized, maxLen);
}

function extractQuantitativeFootprint(commentsList = []) {
  const joined = commentsList.join(' | ');
  const matches = [];
  const regex = /(\$?\d+%?\s*[KMB]?\+?\s*(?:\/month|\/year|monthly|annually|service accounts|environments|workspaces|Informatica mappings|Airflow DAGs|ADF pipelines|DBT models|Glue jobs|source systems|TB daily ingestion|Tableau dashboards|data marts|queries daily|data scientists|Jupyter notebooks|SageMaker endpoints|ML models|vector databases|prompt templates|GenAI pilots|API calls monthly|LLM costs|monitoring dashboards|on-call engineers|CloudWatch alarms|access requests weekly|untagged[^,.|]*|idle[^,.|]*|tokens[^,.|]*|hour nightly[^,.|]*))/gi;
  let m;
  while ((m = regex.exec(joined)) !== null) {
    const clean = m[1].trim();
    if (!matches.some(x => x.toLowerCase() === clean.toLowerCase())) {
      matches.push(clean);
    }
  }
  return matches.slice(0, 4);
}

function extractDetectedTools(commentsList = []) {
  const joined = commentsList.join(' \n ');
  const isDefaultTemplateComment = commentsList.every(c =>
    /Evaluated for .* current configuration meets baseline production SLAs/i.test(c)
  );
  if (isDefaultTemplateComment) {
    return [];
  }
  const found = [];
  for (const pat of KNOWN_TECH_PATTERNS) {
    if (pat.regex.test(joined) && !found.includes(pat.label)) {
      found.push(pat.label);
    }
  }
  return found.slice(0, 6);
}

function extractAuthenticNoteSnippet(commentsList = []) {
  if (!commentsList || commentsList.length === 0) {
    return 'Evaluated via structured maturity scores & selected pain points.';
  }
  const custom = commentsList.find(c => c && !/Evaluated for .* current configuration meets baseline/i.test(c));
  const chosen = custom || commentsList[0];
  const cleaned = String(chosen).replace(/\s+/g, ' ').trim();
  return cleaned.length > 110 ? cleaned.slice(0, 107) + '...' : cleaned;
}

/**
 * Build the complete Per-Assessment Telemetry Dossier across all 6 pillars.
 */
function extractAssessmentTelemetry(framework = {}, metadata = {}, scores = {}) {
  const unwrappedFw = (framework && framework.framework && typeof framework.framework === 'object')
    ? framework.framework
    : (framework || {});
  const fwTypeKey = String(unwrappedFw.typeKey || framework?.typeKey || unwrappedFw.id || framework?.id || '').toLowerCase();
  const fwTitle = unwrappedFw.title || framework?.title || 'Enterprise Cloud, Data & AI Transformation';

  const custName = (metadata.customerName && metadata.customerName !== 'Not specified')
    ? metadata.customerName
    : (metadata.assessmentName && metadata.assessmentName !== 'Not specified'
      ? metadata.assessmentName
      : 'Enterprise Organization');
  const industry = (metadata.industry && metadata.industry !== 'Not specified')
    ? metadata.industry
    : (unwrappedFw.badge || framework?.badge || 'Enterprise Cloud & AI');
  const useCase = metadata.useCase || fwTitle;

  const rawQuestionScores = (scores && typeof scores.questionScores === 'object' && scores.questionScores)
    || (metadata && typeof metadata.questionScores === 'object' && metadata.questionScores)
    || {};
  const responses = { ...rawQuestionScores, ...(metadata.responses || {}) };

  const rawDims = Array.isArray(scores.dimensionScores)
    ? scores.dimensionScores
    : Object.entries(scores.dimensionScores || {}).map(([k, v]) => (
        typeof v === 'object' && v !== null ? { id: k, ...v } : { id: k, currentScore: Number(v) }
      ));

  const questionScoreEntries = Object.entries(rawQuestionScores).map(([qKey, qVal]) => ({
    qKey,
    ...(typeof qVal === 'object' && qVal !== null ? qVal : { score: Number(qVal) })
  }));

  const allCommentsText = [
    ...Object.entries(responses)
      .filter(([k]) => k.endsWith('_comment') || k.endsWith('_notes'))
      .map(([, v]) => String(v || '')),
    ...questionScoreEntries.map(q => String(q.comments || q.comment || q.notes || '')),
    metadata.executiveSummary || '',
    metadata.customInstructions || ''
  ].filter(Boolean).join(' \n ');

  const prefersDatabricks = /consolidate to databricks|databricks poc|databricks consolidation|unity catalog/i.test(allCommentsText);
  const targetPlatformBrand = prefersDatabricks
    ? 'Databricks Lakehouse & Vertex AI'
    : 'Google Cloud BigQuery, Dataplex & Vertex AI';

  const frameworkAreas = Array.isArray(unwrappedFw.areas) ? unwrappedFw.areas : [];
  const frameworkDims = Array.isArray(unwrappedFw.dimensions) ? unwrappedFw.dimensions : [];
  const rawGlobalNotes = Array.isArray(metadata.notes)
    ? metadata.notes.map(n => (typeof n === 'string' ? n : (n?.text || n?.content || ''))).filter(Boolean)
    : (typeof metadata.notes === 'string' && metadata.notes.trim() ? [metadata.notes.trim()] : []);
  const extraGlobalNotes = [
    ...questionScoreEntries.map(q => q.comments || q.comment || q.notes).filter(Boolean),
    metadata.executiveSummary,
    metadata.customInstructions
  ].filter(Boolean).map(s => String(s).trim());
  const globalNotesList = [...new Set([...rawGlobalNotes, ...extraGlobalNotes])];
  const globalPainPointsPool = [
    ...new Set(
      questionScoreEntries
        .flatMap(q => Array.isArray(q.painPoints) ? q.painPoints : [])
        .map(humanizePainCode)
        .filter(Boolean)
    )
  ];

  const resolveDomainBridgeAndTarget = (titleStr, fallbackDef) => {
    const lower = String(titleStr || '').toLowerCase();
    // 1. Specific Security, DLP, IAM, Model Armor & SIEM pillars
    if (/siem|soar|audit/.test(lower)) {
      return {
        bridge: 'Chronicle SecOps & SLSA L3 Auth',
        target: 'Autonomous SOAR & WORM Audit'
      };
    }
    if (/dlp|tokenization|pii|phi/.test(lower)) {
      return {
        bridge: 'Cloud DLP Surrogate Tokenization',
        target: 'Zero-Copy PII Masking & HSM CMEK'
      };
    }
    if (/armor|injection|runtime safety/.test(lower)) {
      return {
        bridge: 'Model Armor Inline Prompt Shield',
        target: 'Zero-Trust AI TRiSM & Guardrails'
      };
    }
    if (/shadow ai|perimeter gateway/.test(lower)) {
      return {
        bridge: 'Apigee AI Gateway & VPC-SC Bridge',
        target: 'Zero-Egress VPC-SC & AI Firewall'
      };
    }
    if (/identity governance|zero standing|workload federation|iam\/pam/.test(lower)) {
      return {
        bridge: 'Workload Identity & JIT PAM Bridge',
        target: 'Zero-Standing IAM & OIDC Tokens'
      };
    }
    if (/agent identity|entitlements/.test(lower)) {
      return {
        bridge: 'Scoped OAuth & HITL Policy Gate',
        target: 'Least-Privilege Agent IAM & Audit'
      };
    }
    if (/cmek|enterprise security/.test(lower)) {
      return {
        bridge: 'Cloud KMS CMEK & VPC-SC Perimeter',
        target: 'HSM CMEK, VPC-SC & Model Armor'
      };
    }
    if (/lineage|data quality/.test(lower)) {
      return {
        bridge: 'Dataplex Catalog & Auto-Lineage',
        target: 'Governed ABAC Tags & DQ SLAs'
      };
    }
    // 2. FinOps, Token Economics & Cloud Economics pillars
    if (/token economics/.test(lower)) {
      return {
        bridge: '2M Context Cache & Prov. Throughput',
        target: '75% Token Savings & Tier Routing'
      };
    }
    if (/commitment|rate optim|reserved|cud/.test(lower)) {
      return {
        bridge: 'Flexible CUDs & Slot Autoscaling',
        target: '85%+ CUDs & Auto Rate Arbitrage'
      };
    }
    if (/unit economics|showback|chargeback|finops culture/.test(lower)) {
      return {
        bridge: 'Departmental Showback & Cost Alerts',
        target: 'Looker FinOps Hub & Unit Telemetry'
      };
    }
    if (/cost visibility|allocation|taxonomy|billing/.test(lower)) {
      return {
        bridge: 'FOCUS Billing Export & Tag Policy',
        target: 'BigQuery FinOps Hub & 99.4% Tags'
      };
    }
    if (/anomaly detection|rightsizing|compute|kubernetes|gke/.test(lower)) {
      return {
        bridge: 'GKE Rightsizing & Idle Auto-Suspend',
        target: 'GKE Autopilot & Anomaly Guard'
      };
    }
    // 3. Agentic Mesh, MCP, Context & Observability pillars
    if (/multi-agent topology|dynamic orchestration|multi-agent mesh|autonomous tooling/.test(lower)) {
      return {
        bridge: 'Vertex Agent Engine & A2A Router',
        target: 'Hierarchical Agent Mesh & Tools'
      };
    }
    if (/mcp|tool abstraction|protocol/.test(lower)) {
      return {
        bridge: 'Standardized MCP & Apigee Proxy',
        target: 'Governed MCP Mesh & Zero-Trust A2A'
      };
    }
    if (/state persistence|memory|long-context|chunked rag/.test(lower)) {
      return {
        bridge: 'Gemini 2M Context & Episodic Memory',
        target: 'AlloyDB Memory & Vertex Vector RAG'
      };
    }
    if (/telemetry|observability|continuous evaluation/.test(lower)) {
      return {
        bridge: 'OpenTelemetry Trace & Eval CI/CD',
        target: 'Vertex GenAI Eval & Drift Guard'
      };
    }
    // 4. Lakehouse, Storage, SQL Analytics & ELT pillars
    if (/sql analytics|reservation/.test(lower)) {
      return {
        bridge: 'BigQuery Editions Slot Autoscaler',
        target: 'BigQuery Vectorized SQL & BI Engine'
      };
    }
    if (/open storage|multi-cloud federation/.test(lower)) {
      return {
        bridge: 'BigLake Iceberg & BQ Omni Bridge',
        target: 'Open Lakehouse & Zero-Egress SQL'
      };
    }
    if (/modern elt|real-time cdc|in-database ai/.test(lower)) {
      return {
        bridge: 'Datastream CDC & Dataform SQL ELT',
        target: 'Sub-Sec Streaming CDC & In-DB BQML'
      };
    }
    if (/storage lifecycle|lakehouse tiering|tiering/.test(lower)) {
      return {
        bridge: 'BigLake Partition & Autoclass Tier',
        target: 'BigLake Iceberg & Coldline Tiering'
      };
    }
    // 5. Enterprise Data & AI Maturity 6-Pillar & General Prompt/Platform pillars
    if (/platform governance.*operations|platform\s*&\s*governance/.test(lower)) {
      return {
        bridge: 'Dataplex Catalog & ABAC Isolation',
        target: 'Zero-Trust Catalog & Auto-FinOps'
      };
    }
    if (/data architecture.*management|data engineering/.test(lower)) {
      return {
        bridge: 'Datastream CDC & Auto-DQ Pipeline',
        target: 'Sub-Sec Auto-CDC & BigLake Iceberg'
      };
    }
    if (/analytics.*business intelligence|analytics\s*&\s*bi|bi semantic/.test(lower)) {
      return {
        bridge: 'Looker Semantic Layer & BI Engine',
        target: 'Governed KPIs & Conversational BI'
      };
    }
    if (/ai,\s*machine learning|mlops|data science/.test(lower)) {
      return {
        bridge: 'Vertex Feature Store & MLOps CI/CD',
        target: 'Unified Feature Store & Live Serving'
      };
    }
    if (/security,\s*compliance.*privacy/.test(lower)) {
      return {
        bridge: 'VPC-SC Perimeter, DLP & KMS CMEK',
        target: 'Zero-Trust VPC-SC & Model Armor'
      };
    }
    if (/cloud economics.*finops/.test(lower)) {
      return {
        bridge: 'FOCUS Billing & CUD Rate Optimizer',
        target: 'Automated Showback & Token Cache'
      };
    }
    if (/prompt.*api|architecture parity/.test(lower)) {
      return {
        bridge: 'Apigee OpenAI-to-Gemini Proxy',
        target: 'Vertex Gemini 3.8 Native SDK'
      };
    }
    return {
      bridge: fallbackDef.defaultBridgeTitle,
      target: fallbackDef.defaultTargetTitle
    };
  };

  const dynamicPillarDefs = (frameworkDims.length > 0 && frameworkAreas.length === 0)
    ? frameworkDims.slice(0, 6).map((dim, idx) => {
        const fallbackDef = PILLAR_DEFS[idx % PILLAR_DEFS.length];
        const dimTitle = dim.name || dim.title || fallbackDef.cleanName;
        const domainTitles = resolveDomainBridgeAndTarget(dimTitle, fallbackDef);
        return {
          key: dim.id || `dim_${idx + 1}`,
          shortTitle: /^\d+\./.test(dimTitle) ? dimTitle.toUpperCase() : `${idx + 1}. ${dimTitle.toUpperCase()}`,
          cleanName: String(dimTitle).replace(/^\d+\.\s*/, ''),
          icon: fallbackDef.icon,
          matchSubstr: [String(dim.id || '').toLowerCase(), String(dimTitle).toLowerCase().split(/\s+/)[0]],
          questionPrefixes: [dim.id, ...(dim.questions || []).map(q => q.id)].filter(Boolean),
          questionsMeta: dim.questions || [],
          defaultNeutralStack: fallbackDef.defaultNeutralStack,
          defaultBridgeTitle: domainTitles.bridge,
          defaultTargetTitle: domainTitles.target
        };
      })
    : PILLAR_DEFS;

  const enrichedPillars = dynamicPillarDefs.map((pDef, idx) => {
    const exactIdDim = rawDims.find(d => d.id === pDef.key);
    const matchedDim = exactIdDim || rawDims[idx] || rawDims.find(d => {
      const idOrName = `${d.id || ''} ${d.name || ''} ${d.category || ''}`.toLowerCase();
      return pDef.matchSubstr.some(s => s && idOrName.includes(s));
    }) || {};

    const matchedArea = frameworkAreas.find(a => {
      const aName = `${a.id || ''} ${a.name || ''}`.toLowerCase();
      return pDef.matchSubstr.some(s => s && aName.includes(s));
    }) || frameworkAreas[idx] || {};

    const areaQuestionIds = [];
    const questionLookup = {};
    const metaTechPains = [];
    const metaBizPains = [];
    if (Array.isArray(pDef.questionsMeta)) {
      pDef.questionsMeta.forEach(q => {
        if (q && q.id) {
          areaQuestionIds.push(q.id);
          questionLookup[q.id] = q;
        }
        if (Array.isArray(q?.technicalPainPoints)) {
          metaTechPains.push(...q.technicalPainPoints.map(humanizePainCode).filter(Boolean));
        }
        if (Array.isArray(q?.businessPainPoints)) {
          metaBizPains.push(...q.businessPainPoints.map(humanizePainCode).filter(Boolean));
        }
      });
    }
    if (Array.isArray(matchedArea.questions)) {
      matchedArea.questions.forEach(q => {
        if (q && q.id) {
          areaQuestionIds.push(q.id);
          questionLookup[q.id] = q;
        }
        if (Array.isArray(q?.technicalPainPoints)) {
          metaTechPains.push(...q.technicalPainPoints.map(humanizePainCode).filter(Boolean));
        }
      });
    }
    if (Array.isArray(matchedArea.dimensions)) {
      matchedArea.dimensions.forEach(dim => {
        if (dim && dim.id) areaQuestionIds.push(dim.id);
        if (Array.isArray(dim.questions)) {
          dim.questions.forEach(q => {
            if (q && q.id) {
              areaQuestionIds.push(q.id);
              questionLookup[q.id] = q;
            }
            if (Array.isArray(q?.technicalPainPoints)) {
              metaTechPains.push(...q.technicalPainPoints.map(humanizePainCode).filter(Boolean));
            }
          });
        }
      });
    }
    const allCandidatePrefixes = [...new Set([pDef.key, ...pDef.questionPrefixes, ...areaQuestionIds].filter(Boolean))];

    const pillarComments = [];
    const explicitTechPains = [];
    const questionDerivedPains = [];
    const bizPains = [];
    const derivedGoodFromQuestions = [];
    const curScoresFromResponses = [];
    const futScoresFromResponses = [];

    for (const prefix of allCandidatePrefixes) {
      const directAns = responses[prefix];
      const directScore = typeof directAns === 'object' && directAns !== null
        ? Number(directAns.score ?? directAns.value)
        : Number(directAns);
      const cScore = Number.isFinite(directScore) && directScore > 0
        ? directScore
        : Number(responses[`${prefix}_current`] ?? responses[`${prefix}_current_state`]);
      if (Number.isFinite(cScore) && cScore > 0) {
        curScoresFromResponses.push(cScore);
        const qMeta = questionLookup[prefix];
        if (qMeta) {
          const matchedOpt = Array.isArray(qMeta.options)
            ? qMeta.options.find(o => Number(o.score ?? o.value) === cScore)
            : null;
          const rawOptText = matchedOpt?.label || matchedOpt?.text || qMeta.text || humanizePainCode(prefix);
          const conciseOptText = String(rawOptText)
            .replace(/^(How would you rate|How mature is|To what extent does|What is the current state of)\s+/i, '')
            .replace(/\?$/, '')
            .trim();
          const finalOptLabel = conciseOptText.length > 44 ? conciseOptText.slice(0, 41) + '...' : conciseOptText;
          if (cScore <= 2.5) {
            questionDerivedPains.push(`${finalOptLabel}`);
          } else if (cScore >= 3.5) {
            derivedGoodFromQuestions.push(`${finalOptLabel}`);
          }
        }
      }
      const fScore = Number(
        (typeof directAns === 'object' && directAns !== null ? (directAns.targetScore ?? directAns.futureScore) : null)
        ?? responses[`${prefix}_future`]
        ?? responses[`${prefix}_future_state`]
      );
      if (Number.isFinite(fScore) && fScore > 0) futScoresFromResponses.push(fScore);

      const directNote = typeof directAns === 'object' && directAns !== null
        ? (directAns.notes || directAns.comment || directAns.comments)
        : null;
      const cVal = directNote || responses[`${prefix}_comment`] || responses[`${prefix}_notes`];
      if (cVal && typeof cVal === 'string') pillarComments.push(cVal);
      const tp = (typeof directAns === 'object' && directAns !== null && Array.isArray(directAns.painPoints))
        ? directAns.painPoints
        : (responses[`${prefix}_technical_pain`] || responses[`${prefix}_painPoints`]);
      if (Array.isArray(tp)) {
        explicitTechPains.push(...tp.map(humanizePainCode).filter(Boolean));
      }
      const bp = responses[`${prefix}_business_pain`];
      if (Array.isArray(bp)) {
        bizPains.push(...bp.map(humanizePainCode).filter(Boolean));
      }
    }

    if (pillarComments.length === 0 && globalNotesList.length > 0) {
      pillarComments.push(globalNotesList[idx % globalNotesList.length]);
    }

    const cur = curScoresFromResponses.length > 0
      ? Number((curScoresFromResponses.reduce((a, b) => a + b, 0) / curScoresFromResponses.length).toFixed(1))
      : Number(matchedDim.currentScore ?? matchedDim.score ?? 2.8);
    const fut = futScoresFromResponses.length > 0
      ? Number((futScoresFromResponses.reduce((a, b) => a + b, 0) / futScoresFromResponses.length).toFixed(1))
      : Number(matchedDim.futureScore ?? matchedDim.targetScore ?? Math.min(5.0, Math.max(cur + 1.5, 4.6)));
    const gap = Number(Math.max(0, fut - cur).toFixed(1));
    const mid = Number(((cur + fut) / 2).toFixed(1));

    const dimBadList = Array.isArray(matchedDim.theBad) && matchedDim.theBad.length > 0
      ? matchedDim.theBad.map(b => humanizePainCode(b.split('—')[0].trim())).filter(Boolean)
      : [];

    // Prioritize pillar-specific pain points over global modulo fallback so badges never repeat across pillars
    const combinedTechPains = [
      ...explicitTechPains,
      ...dimBadList,
      ...metaTechPains,
      ...questionDerivedPains
    ];
    if (combinedTechPains.length === 0 && globalPainPointsPool.length > idx) {
      combinedTechPains.push(globalPainPointsPool[idx]);
    }
    const uniqueTechPains = [...new Set(combinedTechPains.map(humanizePainCode).filter(Boolean))].slice(0, 6);
    const uniqueBizPains = [...new Set([...bizPains, ...metaBizPains].map(humanizePainCode).filter(Boolean))].slice(0, 3);
    const detectedTools = extractDetectedTools([...pillarComments, allCommentsText]);
    const quantFootprint = extractQuantitativeFootprint([...pillarComments, allCommentsText]);
    const noteSnippet = extractAuthenticNoteSnippet(pillarComments);

    const theGoodList = Array.isArray(matchedDim.theGood) && matchedDim.theGood.length > 0
      ? matchedDim.theGood.slice(0, 2)
      : (derivedGoodFromQuestions.length > 0
        ? derivedGoodFromQuestions.slice(0, 2)
        : [`Baseline ${cur.toFixed(1)}/5.0 established`]);

    const theBadList = dimBadList.length > 0
      ? dimBadList.slice(0, 3)
      : uniqueTechPains.slice(0, 3);

    const hasExplicitVendorTools = detectedTools.length > 0;
    const stackSummary = hasExplicitVendorTools
      ? `${detectedTools.join(' • ')}`
      : pDef.defaultNeutralStack;

    return {
      ...pDef,
      currentScore: Number(cur.toFixed(1)),
      midScore: mid,
      futureScore: Number(fut.toFixed(1)),
      gap,
      levelName: matchedDim.level?.level || (cur >= 3.5 ? 'Established' : cur >= 2.5 ? 'Developing' : 'Initial / Siloed'),
      detectedTools,
      quantFootprint,
      hasExplicitVendorTools,
      stackSummary,
      theGood: theGoodList,
      theBad: theBadList,
      techPainCodes: uniqueTechPains.length > 0 ? uniqueTechPains : [`${concisePillarLabel(pDef.cleanName, 14)} Silos`],
      bizPainCodes: uniqueBizPains.length > 0 ? uniqueBizPains : ['High Operational Cost', 'Delayed Delivery'],
      noteSnippet
    };
  });

  const evaluatedPillars = enrichedPillars.length > 0 ? [...enrichedPillars] : [];
  const avgCur = evaluatedPillars.length > 0
    ? (evaluatedPillars.reduce((a, p) => a + p.currentScore, 0) / evaluatedPillars.length).toFixed(1)
    : '2.6';
  const avgTgt = evaluatedPillars.length > 0
    ? (evaluatedPillars.reduce((a, p) => a + p.futureScore, 0) / evaluatedPillars.length).toFixed(1)
    : '4.6';
  const avgMid = ((Number(avgCur) + Number(avgTgt)) / 2).toFixed(1);
  const overallDelta = (Number(avgTgt) - Number(avgCur)).toFixed(1);

  const evalByGapDesc = [...evaluatedPillars].sort((a, b) => (b.gap - a.gap) || (a.currentScore - b.currentScore));
  const weakest = evalByGapDesc[0] || enrichedPillars[0];
  const secondWeakest = evalByGapDesc[1] || weakest;
  const strongest = [...evaluatedPillars].sort((a, b) => b.currentScore - a.currentScore)[0] || weakest;

  const domainContextSignal = `${fwTypeKey} ${useCase}`.toLowerCase();
  const coeSlotMeta = /openai|gemini_enterprise_migration|openai_to_gemini/.test(domainContextSignal)
    ? { shortTitle: '6. GEMINI CoE & EVAL AUTOMATION', cleanName: 'Enablement & FinOps CoE', bridge: 'Prompt Translation & Eval CI/CD Gate', target: 'Gemini CoE & Parity Certification', pain: 'Manual Eval Sheets' }
    : /finops|cost/.test(domainContextSignal)
    ? { shortTitle: '6. ENABLEMENT & FINOPS CoE', cleanName: 'Enablement & FinOps CoE', bridge: 'Federated FinOps CoE & Budget Policy', target: 'Self-Service FinOps & Showback SLAs', pain: 'Manual Showback' }
    : /zero_trust|security|dlp|siem/.test(domainContextSignal)
    ? { shortTitle: '6. AI TRiSM & SAFETY CoE', cleanName: 'Enablement & FinOps CoE', bridge: 'AI TRiSM Board & Red-Team CI/CD', target: 'Continuous AI Safety Certification', pain: 'Manual GRC Audits' }
    : /agentic|mcp/.test(domainContextSignal)
    ? { shortTitle: '6. AGENTIC CoE & SKILL HUB', cleanName: 'Enablement & FinOps CoE', bridge: 'Agentic CoE & Reusable Skill Hub', target: 'Agent Marketplace & HITL Governance', pain: 'Siloed Agent Pilots' }
    : /edw|lakehouse|bigquery/.test(domainContextSignal)
    ? { shortTitle: '6. DATA MESH CoE & SQL CUTOVER', cleanName: 'Data Mesh CoE & SQL Cutover', bridge: 'Automated SQL Translation & Data CoE', target: 'Zero-Downtime EDW Offload & Mesh', pain: 'Manual SQL Cutover' }
    : { shortTitle: PILLAR_DEFS[5].shortTitle, cleanName: PILLAR_DEFS[5].cleanName, bridge: PILLAR_DEFS[5].defaultBridgeTitle, target: PILLAR_DEFS[5].defaultTargetTitle, pain: 'Cross-Team Silos' };

  // Ensure we always have 6 pillar slots for Template 05 visual symmetry without skewing evaluated averages
  while (enrichedPillars.length < 6) {
    const slotIdx = enrichedPillars.length;
    const fb = PILLAR_DEFS[slotIdx];
    const isLakehouseSlot5 = slotIdx === 4 && /edw|lakehouse|bigquery/.test(domainContextSignal);
    const slotMeta = isLakehouseSlot5
      ? {
          shortTitle: '5. BI SEMANTIC LAYER & LOOKER CONSOLIDATION',
          cleanName: 'BI Semantic Layer & Looker Consolidation',
          bridge: 'Looker Semantic Layer & BI Engine',
          target: 'Governed KPIs & Conversational BI',
          pain: 'BI Query Queuing'
        }
      : coeSlotMeta;

    const extraDim = rawDims[slotIdx];
    const hasExtraDimScore = isLakehouseSlot5 && extraDim && Number.isFinite(Number(extraDim.currentScore ?? extraDim.score));
    const derivedCur = hasExtraDimScore ? Number(Number(extraDim.currentScore ?? extraDim.score).toFixed(1)) : Number(avgCur);
    const derivedFut = hasExtraDimScore ? Number(Number(extraDim.futureScore ?? extraDim.targetScore ?? avgTgt).toFixed(1)) : Number(avgTgt);
    const derivedMid = Number(((derivedCur + derivedFut) / 2).toFixed(1));
    const derivedGap = Number(Math.max(0, derivedFut - derivedCur).toFixed(1));
    enrichedPillars.push({
      ...fb,
      shortTitle: slotMeta.shortTitle || fb.shortTitle,
      cleanName: slotMeta.cleanName || fb.cleanName,
      defaultBridgeTitle: slotMeta.bridge,
      defaultTargetTitle: slotMeta.target,
      currentScore: derivedCur,
      midScore: derivedMid,
      futureScore: derivedFut,
      gap: derivedGap,
      isSyntheticSymmetrySlot: !hasExtraDimScore,
      levelName: derivedCur >= 3.5 ? 'Established' : derivedCur >= 2.5 ? 'Developing' : 'Initial / Siloed',
      detectedTools: [],
      quantFootprint: [],
      hasExplicitVendorTools: false,
      stackSummary: fb.defaultNeutralStack,
      theGood: [`Composite ${derivedCur.toFixed(1)}/5.0 Baseline`],
      theBad: [slotMeta.pain],
      techPainCodes: [slotMeta.pain],
      bizPainCodes: ['Cross-Pillar Governance Overhead'],
      noteSnippet: weakest?.noteSnippet || 'Evaluated via framework composite baseline.'
    });
  }

  // Guarantee 100% unique primary pain labels across all 6 pillars so top pain badges never repeat
  const usedPainLabels = new Set();
  enrichedPillars.forEach((p) => {
    const fallbackPain = `${concisePillarLabel(p.cleanName, 12)} Gap`;
    let chosenPain = null;
    for (const rawCandidate of p.techPainCodes) {
      const candidate = concisePainPoint(rawCandidate, fallbackPain, 19);
      if (!usedPainLabels.has(candidate.toLowerCase())) {
        chosenPain = candidate;
        break;
      }
    }
    if (!chosenPain) {
      chosenPain = concisePainPoint(fallbackPain, fallbackPain, 19);
    }
    usedPainLabels.add(chosenPain.toLowerCase());
    p.primaryPainLabel = chosenPain;
    p.techPainCodes = [chosenPain, ...p.techPainCodes.filter(x => x !== chosenPain)];
  });

  const byGapDesc = [...enrichedPillars].sort((a, b) => {
    if (Boolean(a.isSyntheticSymmetrySlot) !== Boolean(b.isSyntheticSymmetrySlot)) {
      return a.isSyntheticSymmetrySlot ? 1 : -1;
    }
    return (b.gap - a.gap) || (a.currentScore - b.currentScore);
  });

  byGapDesc.forEach((p, rankIdx) => {
    const target = enrichedPillars.find(ep => ep.key === p.key);
    if (target) target.priorityRank = rankIdx + 1;
  });

  const allDetectedTools = [...new Set(enrichedPillars.flatMap(p => p.detectedTools))];
  const allQuantMetrics = [...new Set(enrichedPillars.flatMap(p => p.quantFootprint))];

  return {
    fwTypeKey,
    custName,
    industry,
    useCase,
    avgCur,
    avgMid,
    avgTgt,
    overallDelta,
    prefersDatabricks,
    targetPlatformBrand,
    pillars: enrichedPillars,
    weakest,
    secondWeakest,
    strongest,
    allDetectedTools,
    allQuantMetrics
  };
}

/**
 * Returns an XML-escaped inline SVG icon for the 6 Left Zone architectural layers.
 */
function getLayerIconHtml(layerId) {
  const icons = {
    channels: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
    apps: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>',
    data: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>',
    integ: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D97706" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/></svg>',
    infra: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#475569" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>',
    sec: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>'
  };
  return escapeXml(icons[layerId] || icons.apps);
}

/**
 * Returns an XML-escaped inline SVG icon + category badge metadata for each Technology Enabler card.
 */
function getEnablerVisualMeta(name = '') {
  const n = String(name).toLowerCase();
  if (/bigquery|bqml|slot|focus/.test(n)) {
    return {
      cat: 'ANALYTICS',
      color: '#1A73E8',
      bg: '#EFF6FF',
      svg: escapeXml('<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1A73E8" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="14" x2="8" y2="10"/><line x1="11" y1="14" x2="11" y2="8"/><line x1="14" y1="14" x2="14" y2="11"/></svg>')
    };
  }
  if (/vertex|gemini|vector|agent/.test(n)) {
    return {
      cat: 'GEN AI / ML',
      color: '#7C3AED',
      bg: '#F5F3FF',
      svg: escapeXml('<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>')
    };
  }
  if (/gke|cloud run|opencost|compute|confidential|terraform/.test(n)) {
    return {
      cat: 'CLOUD INFRA',
      color: '#2563EB',
      bg: '#EFF6FF',
      svg: escapeXml('<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>')
    };
  }
  if (/vpc|armor|dlp|kms|chronicle|beyondcorp|workload|binary|scc|abac/.test(n)) {
    return {
      cat: 'ZERO-TRUST',
      color: '#059669',
      bg: '#ECFDF5',
      svg: escapeXml('<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>')
    };
  }
  if (/apigee|mcp|a2a|pub\/sub|dataflow/.test(n)) {
    return {
      cat: 'EVENT MESH',
      color: '#0284C7',
      bg: '#F0F9FF',
      svg: escapeXml('<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0284C7" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>')
    };
  }
  if (/biglake|alloydb|billing|cud/.test(n)) {
    return {
      cat: 'LAKEHOUSE',
      color: '#0D9488',
      bg: '#F0FDFA',
      svg: escapeXml('<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0D9488" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>')
    };
  }
  return {
    cat: 'GOVERNANCE',
    color: '#D97706',
    bg: '#FFFBEB',
    svg: escapeXml('<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D97706" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>')
  };
}

/**
 * Bijectively assigns the 6 evaluated pillars onto the 6 horizontal architectural tiers
 * (0: Channels/CoE, 1: Apps/Workbench, 2: Data/Storage/Memory, 3: Integration/Gateway, 4: Infra/Compute, 5: Security/Governance)
 * so that every horizontal bridge arrow (Row i -> Bridge 0(i+1) -> Tier i+1) is 100% logically coherent.
 */
function assignPillarsToArchitecturalTiers(pillars = []) {
  const tierRules = [
    { tierIdx: 0, tag: 'L1 CHANNELS', regex: /unit economics|cloud economics|cost_finops|culture|enablement|coe|portal|channel|experience|adoption/i },
    { tierIdx: 1, tag: 'L2 WORKBENCH', regex: /prompt.*api|multi-agent topology|model armor|sql analytics|analytics.*bi|analytics.*business|bi semantic|workbench|application/i },
    { tierIdx: 2, tag: 'L3 DATA & MEM', regex: /storage lifecycle|tiering|data loss prevention|dlp|state persistence|memory|long-context|open storage|lakehouse|data engineering|data architecture/i },
    { tierIdx: 3, tag: 'L4 EVENT MESH', regex: /cost visibility|shadow ai|perimeter gateway|model context protocol|mcp|multi-agent mesh|autonomous tooling|modern elt|real-time cdc|generative ai|platform governance.*operations/i },
    { tierIdx: 4, tag: 'L5 CLOUD INFRA', regex: /anomaly detection|rightsizing|siem|soar|telemetry|observability|token economics|data science|machine learning|mlops|ai_mlops|platform/i },
    { tierIdx: 5, tag: 'L6 ZERO-TRUST', regex: /commitment economics|rate optim|identity governance|zero standing|agent identity|entitlements|enterprise security|security,\s*compliance|security_compliance|cmek|data governance|lineage|platform.*governance/i }
  ];

  const assigned = new Array(6).fill(null);
  const usedPillarIndices = new Set();

  // Pass 1: Match each tier to its highest-affinity unassigned pillar
  tierRules.forEach((rule) => {
    let bestIdx = -1;
    let bestScore = 0;
    pillars.forEach((p, pIdx) => {
      if (usedPillarIndices.has(pIdx)) return;
      const text = `${p.key || ''} ${p.cleanName || ''} ${p.defaultBridgeTitle || ''}`;
      if (rule.regex.test(text)) {
        const score = (rule.tierIdx === 0 && p.isSyntheticSymmetrySlot) ? 3 : 2;
        if (score > bestScore) {
          bestScore = score;
          bestIdx = pIdx;
        }
      }
    });
    if (bestIdx !== -1) {
      assigned[rule.tierIdx] = { pillar: pillars[bestIdx], layerTag: rule.tag };
      usedPillarIndices.add(bestIdx);
    }
  });

  // Pass 2: Fill any remaining tier slots in deterministic order
  let nextPillarIdx = 0;
  for (let t = 0; t < 6; t++) {
    if (!assigned[t]) {
      while (usedPillarIndices.has(nextPillarIdx) && nextPillarIdx < pillars.length) {
        nextPillarIdx++;
      }
      const fallbackPillar = pillars[nextPillarIdx] || pillars[t] || pillars[0];
      usedPillarIndices.add(nextPillarIdx);
      assigned[t] = { pillar: fallbackPillar, layerTag: tierRules[t].tag };
    }
  }

  return assigned;
}

/**
 * MASTER TEMPLATE 05 3-ZONE COMPILER:
 * Left Zone   = AS-IS CURRENT STATE (Red container #FFF5F5, #DC2626 header, 6 rows on aligned 5-column grid with tier-specific shapes & score pills)
 * Middle Zone = TRANSFORMATION BENEFITS & TRANSITION BRIDGE (Blue container #EFF6FF, 6 tier-aligned bridge cards + 6-row horizontal flow arrows)
 * Right Zone  = TO-BE FUTURE STATE (Green container #F0FDF4, #065F46 header, 6 labeled architectural tier containers with clean vertical connectors)
 * Bottom Bar  = KEY TECHNOLOGY ENABLERS (12 SVG icon cards) + QUANTIFIED OUTCOMES (5 cards) + LEGEND Bar
 *
 * @param {object} dossier - Extracted customer telemetry dossier
 * @param {'current' | 'transition' | 'target'} stageFocus - Which stage tab is active
 */
function compileTemplate05MasterDiagramXml(dossier, stageFocus = 'target') {
  const {
    custName,
    industry,
    useCase,
    avgCur,
    avgMid,
    avgTgt,
    overallDelta,
    targetPlatformBrand,
    pillars,
    weakest,
    secondWeakest,
    allDetectedTools
  } = dossier;

  const p0 = pillars[0];
  const p1 = pillars[1];
  const p2 = pillars[2];
  const p3 = pillars[3];
  const p4 = pillars[4];
  const p5 = pillars[5];

  const isStage1 = stageFocus === 'current';
  const isStage2 = stageFocus === 'transition';
  const isStage3 = stageFocus === 'target';

  const stageLabel = isStage1
    ? `STAGE 1 FOCUS: AS-IS CURRENT STATE (${avgCur}/5.0)`
    : isStage2
    ? `STAGE 2 FOCUS: TRANSITION BRIDGE (${avgCur} → ${avgMid}/5.0)`
    : `STAGE 3 FOCUS: TO-BE FUTURE STATE (${avgTgt}/5.0 • +${overallDelta} LEAP)`;

  const leftStroke = isStage1 ? '#DC2626' : '#FCA5A5';
  const leftStrokeW = isStage1 ? '3.2' : '1.5';
  const leftOpacity = isStage1 ? '100' : isStage3 ? '90' : '58';
  const midStroke = isStage2 ? '#1D4ED8' : '#93C5FD';
  const midStrokeW = isStage2 ? '3.2' : '1.5';
  const midOpacity = isStage2 ? '100' : isStage3 ? '94' : '52';
  const rightStroke = isStage3 ? '#059669' : '#86EFAC';
  const rightStrokeW = isStage3 ? '3.2' : '1.5';
  const rightOpacity = isStage3 ? '100' : isStage2 ? '62' : '50';

  const domainSignal = `${dossier.fwTypeKey || ''} ${useCase || ''}`.toLowerCase();
  const isFinOpsDomain = /finops|cost|billing/.test(domainSignal) && !/openai|gemini|edw|lakehouse/.test(domainSignal);
  const isSecurityDomain = /zero_trust|security|trism|ciso|dlp|siem/.test(domainSignal);
  const isAgenticDomain = /agentic|mcp|multi-agent/.test(domainSignal);
  const isGeminiMigDomain = /openai|gemini|migration/.test(domainSignal) && !/edw|lakehouse/.test(domainSignal);
  const isLakehouseDomain = /edw|lakehouse|bigquery|modernization/.test(domainSignal);

  // Top 6 As-Is Pain Badges (y=86, height=34 -> 100% unique primaryPainLabel per pillar)
  const asIsPainBadges = [p0, p1, p2, p3, p4, p5].map((p) => ({
    title: p.primaryPainLabel || concisePainPoint(p.techPainCodes[0], 'Siloed Baseline', 19),
    sub: `${concisePillarLabel(p.cleanName, 18)} (${p.currentScore}/5)`
  }));

  // Industry & Domain-grounded Channels (distinct personas, never repeating pillar names)
  const indLower = String(industry || '').toLowerCase();
  const channelNames = indLower.includes('health') || indLower.includes('pharma') || indLower.includes('life')
    ? ['Research & R&D', 'Clinical Trial Ops', 'Regulatory Affairs', 'Commercial Teams', 'Patients / HCPs', 'Partners & CROs']
    : indLower.includes('financ') || indLower.includes('bank') || indLower.includes('wealth')
    ? ['Risk & Treasury', 'Retail Banking', 'Compliance & Audit', 'Wealth Advisors', 'Digital Customers', 'Fintech Partners']
    : indLower.includes('retail') || indLower.includes('commerce')
    ? ['Digital Storefront', 'Merchandising Ops', 'Supply Chain & ERP', 'FinOps & Cloud CoE', 'Loyalty & CRM', 'Supplier APIs']
    : indLower.includes('defense') || indLower.includes('sovereign') || indLower.includes('federal') || isSecurityDomain
    ? ['SOC & Threat Intel', 'Mission Operations', 'Compliance & GRC', 'Zero-Trust IAM Hub', 'SecOps Analysts', 'Classified APIs']
    : indLower.includes('media') || indLower.includes('publish') || isGeminiMigDomain
    ? ['Editorial Studio', 'Subscriber Portal', 'AdTech & Revenue', 'AI Product Teams', 'Content Search', 'Syndication APIs']
    : indLower.includes('freight') || indLower.includes('logistics') || indLower.includes('fleet')
    ? ['Fleet Telemetry', 'Warehouse WMS', 'Route Dispatch', 'Finance & Billing', 'Carrier Portal', 'Customs & EDI']
    : indLower.includes('telecom') || indLower.includes('5g')
    ? ['5G Network Ops', 'Subscriber Billing', 'Field Engineering', 'Customer Care AI', 'Enterprise B2B', 'Partner APIs']
    : [
        'Executive & FinOps',
        'Data & AI Teams',
        'Business Analysts',
        'App Developers',
        'Digital Customers',
        'Partners & APIs'
      ];

  // As-Is Row 2: 5 Aligned Application Cards (grounded in detected tools or domain-specific legacy apps)
  const tList = allDetectedTools.length > 0 ? allDetectedTools : [];
  const defaultDomainApps = isFinOpsDomain
    ? ['AWS Cost Explorer', 'Snowflake Billing', 'Datadog Metering', 'Uncached GPT-4 API', 'Excel Cost Sheets']
    : isSecurityDomain
    ? ['Static IAM Keys', 'Unproxied LLM APIs', 'Raw PII Pipelines', 'Siloed SIEM Logs', 'Manual GRC Sheets']
    : isAgenticDomain
    ? ['LangChain Scripts', 'Hardcoded REST API', 'Stateless Chatbots', 'In-Memory Buffers', 'Manual Escalation']
    : isGeminiMigDomain
    ? ['OpenAI GPT-4o API', 'Pinecone Vector DB', 'LangChain Wrappers', 'Static Prompt Files', 'Manual Eval Sheets']
    : isLakehouseDomain
    ? ['Teradata BTEQ SQL', 'Informatica Batch', 'Snowflake Marts', 'Tableau Extracts', 'Autosys Cron Jobs']
    : [
        'Legacy Collibra UI',
        'Informatica Batch',
        'Siloed Tableau BI',
        'Local Jupyter Lab',
        'Static IAM Policies'
      ];

  const asIsApps = [
    { name: truncateText(tList[0] || defaultDomainApps[0], 20), tag: 'LEGACY APP', pill: `Siloed • ${p0.currentScore}/5` },
    { name: truncateText(tList[1] || defaultDomainApps[1], 20), tag: 'BATCH TOOL', pill: `Batch • ${p1.currentScore}/5` },
    { name: truncateText(tList[2] || defaultDomainApps[2], 20), tag: 'EXTRACTS', pill: `Static • ${p2.currentScore}/5` },
    { name: truncateText(tList[3] || defaultDomainApps[3], 20), tag: 'ISOLATED', pill: `Ad-Hoc • ${p3.currentScore}/5` },
    { name: truncateText(tList[4] || defaultDomainApps[4], 20), tag: 'UNPROXIED', pill: `Manual • ${p4.currentScore}/5` }
  ];

  // As-Is Row 3: 5 Aligned Domain-Specific Data Cylinders
  const asIsCylinders = isFinOpsDomain
    ? [
        { name: 'Raw Billing CSVs', sub: 'Siloed Exports' },
        { name: 'Untagged K8s Logs', sub: '42% Unallocated' },
        { name: 'Cold Petabytes', sub: 'Uncompacted Tables' },
        { name: 'Shadow AI Spend', sub: 'Unmetered Tokens' },
        { name: 'Duplicate Marts', sub: '3x Storage Copy' }
      ]
    : isSecurityDomain
    ? [
        { name: 'Unmasked PII/PHI', sub: 'Raw RAG Chunks' },
        { name: 'Default Key Store', sub: 'No Customer CMEK' },
        { name: 'Local JSON Keys', sub: 'Static Credentials' },
        { name: 'Ephemeral Logs', sub: 'No WORM Retention' },
        { name: 'Shadow Prompt Log', sub: 'Public SaaS Leak' }
      ]
    : isAgenticDomain
    ? [
        { name: 'In-Memory State', sub: 'Lost on Restart' },
        { name: 'Isolated Vectors', sub: 'Stale Embeddings' },
        { name: 'Unindexed Logs', sub: 'Zero Trace IDs' },
        { name: 'Static Prompts', sub: 'Hardcoded Templates' },
        { name: 'Local SQLite DB', sub: 'Single-Node State' }
      ]
    : isGeminiMigDomain
    ? [
        { name: '512-Token Chunks', sub: 'Fragile RAG Splits' },
        { name: 'Pinecone Vectors', sub: 'External Egress' },
        { name: 'GPT-4 Prompt Repo', sub: 'Model-Locked JSON' },
        { name: 'Uncached Context', sub: 'Repeated Token Burn' },
        { name: 'CSV Eval Sheets', sub: 'Manual Spot Checks' }
      ]
    : isLakehouseDomain
    ? [
        { name: 'Teradata EDW', sub: 'Proprietary Tables' },
        { name: 'Snowflake Marts', sub: 'Duplicate Storage' },
        { name: 'Siloed S3 Parquet', sub: 'Uncataloged Files' },
        { name: 'Staging CSV Drops', sub: 'Nightly Extracts' },
        { name: 'Isolated BI Cubes', sub: 'Stale Refreshes' }
      ]
    : [
        { name: 'Siloed Governance', sub: 'Disparate Catalog' },
        { name: 'Legacy EDW Marts', sub: 'Nightly Copies' },
        { name: 'Isolated BI Cubes', sub: 'Static Extracts' },
        { name: 'Unstructured Docs', sub: 'Raw File Shares' },
        { name: 'Unindexed Audit', sub: 'Local Log Files' }
      ];

  // As-Is Row 4: 5 Aligned Domain-Specific Hexagonal Integration Nodes
  const asIsIntegration = isFinOpsDomain
    ? [
        { name: 'Manual CSV Export', sub: 'Monthly Billing Lag' },
        { name: 'Ad-Hoc Tag Scripts', sub: '42% Missing Labels' },
        { name: 'Uncached LLM RPCs', sub: 'Zero Context Cache' },
        { name: 'Static Budget Cron', sub: 'Reactive Email Alert' },
        { name: 'Siloed Cloud APIs', sub: 'No FOCUS Schema' }
      ]
    : isSecurityDomain
    ? [
        { name: 'Direct Public DNS', sub: 'Bypasses VPC-SC' },
        { name: 'Unproxied LLM API', sub: 'No Gateway Shield' },
        { name: 'Client Regex Mask', sub: 'High False Negative' },
        { name: 'Manual Key Copy', sub: 'Git Repo Exposure' },
        { name: 'Unmonitored Hooks', sub: 'Zero SIEM Ingest' }
      ]
    : isAgenticDomain
    ? [
        { name: 'Brittle Prompt Chain', sub: 'Single-Thread Loop' },
        { name: 'Hardcoded REST API', sub: 'No MCP Standard' },
        { name: 'Blocking Sync RPC', sub: 'Timeout Cascades' },
        { name: 'Custom Tool Glue', sub: 'Fragile JSON Parse' },
        { name: 'Manual Escalation', sub: 'Slow Ticket Handoff' }
      ]
    : isGeminiMigDomain
    ? [
        { name: 'Locked OpenAI SDK', sub: 'Hardcoded Endpoints' },
        { name: 'Custom Retry Loop', sub: '429 Rate Limit Drops' },
        { name: 'Brittle Chunk ETL', sub: 'Lost Cross-Doc Ctx' },
        { name: 'Uncached Token RPC', sub: '100% Re-Tokenized' },
        { name: 'Manual Model Route', sub: 'No Tier Arbitrage' }
      ]
    : isLakehouseDomain
    ? [
        { name: 'Nightly Batch ETL', sub: '24h Replication Lag' },
        { name: 'Proprietary BTEQ', sub: '2,400+ Stored Procs' },
        { name: 'Cross-Cloud Egress', sub: 'High S3/Blob Fees' },
        { name: 'Cron / Autosys Jobs', sub: 'Brittle Job Chains' },
        { name: 'Manual Schema Sync', sub: 'Frequent Breakage' }
      ]
    : [
        { name: 'Point-to-Point APIs', sub: p0.primaryPainLabel || 'Brittle Couplings' },
        { name: 'Batch ETL Scripts', sub: p1.primaryPainLabel || '24h Replication Lag' },
        { name: 'Manual Schema Sync', sub: p2.primaryPainLabel || 'Schema Drift' },
        { name: 'Uncached Model RPC', sub: p3.primaryPainLabel || 'No Rate Governance' },
        { name: 'Manual Handoffs', sub: p4.primaryPainLabel || 'Slow Ticket Triage' }
      ];

  // As-Is Row 5: 5 Aligned Domain-Specific Infrastructure Cards
  const asIsInfra = isFinOpsDomain
    ? [
        { name: 'Idle Dev/Test K8s', sub: '24/7 Unscaled Nodes' },
        { name: 'On-Demand GPUs', sub: 'Zero Spot / CUDs' },
        { name: 'Over-Sized VMs', sub: '18% Avg CPU Util' },
        { name: 'Unpooled BQ Slots', sub: 'Isolated Silo Caps' },
        { name: 'Unattached Disks', sub: 'Orphaned Volumes' }
      ]
    : isSecurityDomain
    ? [
        { name: 'Public Endpoints', sub: 'No Private Peering' },
        { name: 'Shared Key Vaults', sub: 'No HSM Hardware' },
        { name: 'Standard Compute', sub: 'Unencrypted RAM' },
        { name: 'Unverified Images', sub: 'No Binary Auth' },
        { name: 'Manual Firewalls', sub: 'Permissive Egress' }
      ]
    : isAgenticDomain
    ? [
        { name: 'Single-Node Pods', sub: 'No Auto-Scaling' },
        { name: 'Unpooled Quotas', sub: 'Throttled Bursts' },
        { name: 'Shared Containers', sub: 'No Code Sandbox' },
        { name: 'Static GPU Pools', sub: 'High Idle Latency' },
        { name: 'Manual Failover', sub: 'Single-Region Risk' }
      ]
    : isGeminiMigDomain
    ? [
        { name: 'Pay-As-You-Go API', sub: 'Volatile Token Cost' },
        { name: 'External Vector VM', sub: 'Cross-Cloud Latency' },
        { name: 'Rate-Capped Tiers', sub: 'TPM Bottlenecks' },
        { name: 'Siloed GPU Workers', sub: 'Underutilized VRAM' },
        { name: 'Manual Region DR', sub: 'No Auto-Failover' }
      ]
    : isLakehouseDomain
    ? [
        { name: 'Fixed EDW Racks', sub: 'CapEx Appliance Lock' },
        { name: 'Uncapped Credits', sub: 'Auto-Scale Spikes' },
        { name: 'Redundant Storage', sub: 'Multi-Bucket Copies' },
        { name: 'Single-Cloud Lock', sub: 'Zero Federation' },
        { name: 'Manual Compaction', sub: 'Slow Table Scans' }
      ]
    : [
        { name: 'Legacy Compute', sub: `${p0.currentScore}/5 Baseline` },
        { name: 'Static VM / K8s', sub: 'Idle Over-Provision' },
        { name: 'Proprietary DBs', sub: 'High License Lock-In' },
        { name: 'Siloed File Shares', sub: 'Unindexed Storage' },
        { name: 'Manual Backup/DR', sub: 'Delayed RPO / RTO' }
      ];

  // As-Is Row 6: 5 Aligned Domain-Specific Security & Governance Cards
  const asIsSecurity = isFinOpsDomain
    ? [
        { name: '42% Untagged Spend', sub: 'Opaque Cost Centers' },
        { name: 'Zero Token Quotas', sub: 'Uncapped LLM Loops' },
        { name: 'No Showback SLAs', sub: 'Monthly Finance Lag' },
        { name: 'Reactive Alerts', sub: 'Post-Bill Surprises' },
        { name: 'On-Demand Drift', sub: 'Low CUD Coverage' }
      ]
    : isSecurityDomain
    ? [
        { name: 'Unmasked PII / PHI', sub: 'Prompt & RAG Leaks' },
        { name: 'Standing Admin IAM', sub: 'No JIT Expiration' },
        { name: 'No Prompt Shield', sub: 'Jailbreak Exposure' },
        { name: 'Provider Keys Only', sub: 'Missing CMEK/EKM' },
        { name: 'SIEM Blindspots', sub: 'Unlogged AI Calls' }
      ]
    : isAgenticDomain
    ? [
        { name: 'Shared Agent Keys', sub: 'Excessive Blast Radius' },
        { name: 'Missing HITL Gate', sub: 'Unchecked Actions' },
        { name: 'Opaque Tool Calls', sub: 'No Lineage Audit' },
        { name: 'Unbounded Loops', sub: 'Runaway Token Burn' },
        { name: 'Policy Drift', sub: 'Manual Compliance' }
      ]
    : isGeminiMigDomain
    ? [
        { name: 'Public API Egress', sub: 'No VPC-SC Boundary' },
        { name: 'No Customer CMEK', sub: 'Shared Provider Keys' },
        { name: 'Heuristic Filters', sub: 'Brittle Regex Rules' },
        { name: 'Zero Eval CI/CD', sub: 'Unverified Prompts' },
        { name: 'High Token Burn', sub: 'Zero Context Cache' }
      ]
    : isLakehouseDomain
    ? [
        { name: 'Tribal Catalog', sub: 'Spreadsheet Docs' },
        { name: 'No Column Lineage', sub: 'Broken Impact Trace' },
        { name: 'Silent Data Drift', sub: 'Corrupted KPIs' },
        { name: 'Fragmented RBAC', sub: 'Per-Engine Policies' },
        { name: 'Volatile Spend', sub: 'Unpredictable Bills' }
      ]
    : [
        { name: 'Siloed Policies', sub: p0.primaryPainLabel || 'Fragmented IAM' },
        { name: 'Manual Access', sub: 'Role Creep & Keys' },
        { name: 'Limited Lineage', sub: p2.primaryPainLabel || 'Opaque Queries' },
        { name: 'PII / Safety Risk', sub: p3.primaryPainLabel || 'Unmasked Prompts' },
        { name: 'Cost & SLA Drift', sub: p4.primaryPainLabel || 'No Chargeback' }
      ];

  // 6 Canonical Tier Vertical Centers: aligns Left Zone rows, Middle Bridge cards 01..06, and Right Zone Tier 1..6 containers 1:1!
  const tierSpec = [
    { idx: 0, boxY: 128, boxH: 76, cardY: 134, cardH: 64, centerY: 166 },
    { idx: 1, boxY: 216, boxH: 80, cardY: 222, cardH: 68, centerY: 256 },
    { idx: 2, boxY: 308, boxH: 84, cardY: 314, cardH: 72, centerY: 350 },
    { idx: 3, boxY: 404, boxH: 80, cardY: 410, cardH: 68, centerY: 444 },
    { idx: 4, boxY: 496, boxH: 80, cardY: 502, cardH: 68, centerY: 536 },
    { idx: 5, boxY: 588, boxH: 80, cardY: 594, cardH: 68, centerY: 628 }
  ];

  // Middle Zone: 6 Transformation Bridge Cards bijectively aligned 1:1 with the 6 horizontal architectural tiers
  const tierAlignedPillars = assignPillarsToArchitecturalTiers([p0, p1, p2, p3, p4, p5]);
  const bridgeCards = tierAlignedPillars.map(({ pillar: p, layerTag }, idx) => ({
    badge: `0${idx + 1}`,
    layerTag,
    title: concisePillarLabel(p.cleanName, 18),
    scorePill: `${p.currentScore} → ${p.midScore} → ${p.futureScore}`,
    bridge: truncateText(p.defaultBridgeTitle, 38),
    remedy: `Fixes ${p.primaryPainLabel || concisePainPoint(p.techPainCodes[0], 'Siloed Baseline', 19)}`
  }));

  const cleanHeaderTitle = `AS-IS / TRANSITION / TO-BE — ${truncateText(custName.toUpperCase(), 34)} (${truncateText(useCase.toUpperCase(), 68)})`;

  let xml = `<mxfile host="embed.diagrams.net" modified="${new Date().toISOString()}" agent="ScoreX-Template05-Master-Compiler" version="24.0.0" type="device">
  <diagram id="template05_${stageFocus}" name="Template 05: As-Is / Transition / To-Be (${escapeXml(custName)})">
    <mxGraphModel dx="1600" dy="920" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1600" pageHeight="920" background="#FFFFFF" math="0" shadow="0">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>

        <!-- ==================== TOP HEADER BAR (TEMPLATE 05) ==================== -->
        <mxCell id="t05_badge" value="&lt;b style=&quot;font-size:15px;color:#FFFFFF;&quot;&gt;05&lt;/b&gt;" style="rounded=1;arcSize=18;whiteSpace=wrap;html=1;fillColor=#0F172A;strokeColor=#1E293B;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="20" y="10" width="44" height="42" as="geometry"/>
        </mxCell>
        <mxCell id="t05_title" value="&lt;b style=&quot;font-size:13.5px;color:#0F172A;letter-spacing:-0.2px;&quot;&gt;${escapeXml(cleanHeaderTitle)}&lt;/b&gt;" style="text;html=1;align=left;verticalAlign=middle;whiteSpace=nowrap;" vertex="1" parent="1">
          <mxGeometry x="72" y="8" width="1220" height="22" as="geometry"/>
        </mxCell>
        <mxCell id="t05_subtitle" value="&lt;span style=&quot;font-size:9.8px;color:#475569;font-weight:600;&quot;&gt;Transforming to an Intelligent, Integrated &amp;amp; Compliant Platform • &lt;b style=&quot;color:#1D4ED8;&quot;&gt;${escapeXml(stageLabel)}&lt;/b&gt; • Primary Bottleneck Remediated: ${escapeXml(truncateText(weakest.cleanName, 60))} (${weakest.currentScore} → ${weakest.futureScore}/5.0)&lt;/span&gt;" style="text;html=1;align=left;verticalAlign=middle;whiteSpace=nowrap;" vertex="1" parent="1">
          <mxGeometry x="72" y="30" width="1220" height="20" as="geometry"/>
        </mxCell>
        <mxCell id="t05_brand_logo" value="&lt;div style=&quot;text-align:right;&quot;&gt;&lt;b style=&quot;font-size:13px;color:#0F172A;letter-spacing:0.8px;&quot;&gt;&lt;span style=&quot;color:#4285F4;&quot;&gt;&#9670;&lt;/span&gt;&lt;span style=&quot;color:#EA4335;&quot;&gt;&#9670;&lt;/span&gt;&lt;span style=&quot;color:#FBBC05;&quot;&gt;&#9670;&lt;/span&gt;&lt;span style=&quot;color:#34A853;&quot;&gt;&#9670;&lt;/span&gt; ENTERPRISE CLOUD&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:8px;color:#64748B;&quot;&gt;Transforming Operations. Accelerating AI Value.&lt;/span&gt;&lt;/div&gt;" style="text;html=1;align=right;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="1300" y="10" width="280" height="40" as="geometry"/>
        </mxCell>

        <!-- ==================== LEFT ZONE: AS-IS CURRENT STATE ==================== -->
        <mxCell id="z_left_bg" value="" style="rounded=1;arcSize=3;whiteSpace=wrap;html=1;fillColor=#FFF5F5;strokeColor=${leftStroke};strokeWidth=${leftStrokeW};opacity=${leftOpacity};" vertex="1" parent="1">
          <mxGeometry x="20" y="60" width="570" height="688" as="geometry"/>
        </mxCell>
        <mxCell id="z_left_hdr" value="&lt;b style=&quot;font-size:10px;color:#FFFFFF;letter-spacing:0.4px;&quot;&gt;${isStage1 ? '&#9733; ' : ''}AS-IS CURRENT STATE (${avgCur} / 5.0)${isStage1 ? ' — ACTIVE FOCUS' : ''}&lt;/b&gt;" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#DC2626;strokeColor=#B91C1C;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="135" y="60" width="340" height="22" as="geometry"/>
        </mxCell>
`;

  // Top 6 Pain Point Pills inside Left Zone (y=86, height=34)
  asIsPainBadges.forEach((b, idx) => {
    const bx = 28 + idx * 92;
    xml += `
        <mxCell id="l_pain_${idx}" value="&lt;b style=&quot;font-size:7px;color:#DC2626;&quot;&gt;&#9888; ${escapeXml(b.title)}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;display:inline-block;margin-top:2px;background:#FEE2E2;color:#991B1B;border-radius:4px;padding:0px 4px;font-size:6.2px;font-weight:700;&quot;&gt;${escapeXml(b.sub)}&lt;/span&gt;" style="rounded=1;arcSize=20;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#FECACA;strokeWidth=1.1;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="${bx}" y="86" width="88" height="34" as="geometry"/>
        </mxCell>`;
  });

  // Left Vertical Layer Headers with Vector SVG Icons
  const leftLayers = [
    { id: 'channels', label: 'CHANNELS', y: tierSpec[0].cardY, h: tierSpec[0].cardH },
    { id: 'apps', label: 'APPLICATIONS', y: tierSpec[1].cardY, h: tierSpec[1].cardH },
    { id: 'data', label: 'DATA STORES', y: tierSpec[2].cardY, h: tierSpec[2].cardH },
    { id: 'integ', label: 'INTEGRATION', y: tierSpec[3].cardY, h: tierSpec[3].cardH },
    { id: 'infra', label: 'INFRASTRUCTURE', y: tierSpec[4].cardY, h: tierSpec[4].cardH },
    { id: 'sec', label: 'SECURITY &amp;&lt;br&gt;GOVERNANCE', y: tierSpec[5].cardY, h: tierSpec[5].cardH }
  ];

  leftLayers.forEach(l => {
    xml += `
        <mxCell id="l_lbl_${l.id}" value="&lt;div style=&quot;display:inline-block;padding:3px;border-radius:6px;background:#FEE2E2;margin-bottom:2px;&quot;&gt;${getLayerIconHtml(l.id)}&lt;/div&gt;&lt;br&gt;&lt;b style=&quot;font-size:6.8px;color:#991B1B;letter-spacing:0.3px;&quot;&gt;${l.label}&lt;/b&gt;" style="rounded=1;arcSize=14;whiteSpace=wrap;html=1;fillColor=#FFF1F2;strokeColor=#FECDD3;strokeWidth=1;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="26" y="${l.y}" width="68" height="${l.h}" as="geometry"/>
        </mxCell>`;
  });

  // Row 1 (Left): 5 Pill-Shaped Persona Channel Cards (arcSize=28)
  channelNames.slice(0, 5).forEach((chName, idx) => {
    const cx = 100 + idx * 96;
    xml += `
        <mxCell id="l_ch_${idx}" value="&lt;b style=&quot;font-size:7.8px;color:#0F172A;&quot;&gt;${escapeXml(chName)}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;display:inline-block;margin-top:4px;background:#FEE2E2;color:#991B1B;border-radius:6px;padding:1px 5px;font-size:6.4px;font-weight:700;&quot;&gt;Manual Workflows&lt;/span&gt;" style="rounded=1;arcSize=28;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#FCA5A5;strokeWidth=1.2;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="${cx}" y="${tierSpec[0].cardY}" width="90" height="${tierSpec[0].cardH}" as="geometry"/>
        </mxCell>`;
  });

  // Row 2 (Left): 5 Application Cards with Crimson Top Accent Band & Score Pill
  asIsApps.forEach((app, idx) => {
    const ax = 100 + idx * 96;
    xml += `
        <mxCell id="l_app_${idx}" value="&lt;div style=&quot;font-size:5.8px;font-weight:800;color:#991B1B;background:#FEE2E2;border-radius:3px;padding:1px 4px;margin-bottom:3px;display:inline-block;letter-spacing:0.3px;&quot;&gt;${escapeXml(app.tag)}&lt;/div&gt;&lt;br&gt;&lt;b style=&quot;font-size:7.6px;color:#0F172A;&quot;&gt;${escapeXml(app.name)}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;display:inline-block;margin-top:3px;background:#FEF2F2;border:1px solid #FECACA;color:#B91C1C;border-radius:5px;padding:0px 4px;font-size:6.3px;font-weight:700;&quot;&gt;${escapeXml(app.pill)}&lt;/span&gt;" style="rounded=1;arcSize=12;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#CBD5E1;strokeWidth=1.2;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="${ax}" y="${tierSpec[1].cardY}" width="90" height="${tierSpec[1].cardH}" as="geometry"/>
        </mxCell>`;
  });

  // Row 3 (Left): 5 Tinted 3D Cylinder Data Stores
  asIsCylinders.forEach((cyl, idx) => {
    const dx = 100 + idx * 96;
    xml += `
        <mxCell id="l_cyl_${idx}" value="&lt;b style=&quot;font-size:7.5px;color:#0F172A;&quot;&gt;${escapeXml(cyl.name)}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;display:inline-block;margin-top:3px;background:#FFE4E6;color:#BE123C;border-radius:5px;padding:0px 4px;font-size:6.2px;font-weight:700;&quot;&gt;${escapeXml(cyl.sub)}&lt;/span&gt;" style="shape=cylinder3;whiteSpace=wrap;html=1;boundedLbl=1;backgroundOutline=1;size=9;fillColor=#FFF1F2;strokeColor=#F43F5E;strokeWidth=1.2;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="${dx}" y="${tierSpec[2].cardY}" width="90" height="${tierSpec[2].cardH}" as="geometry"/>
        </mxCell>`;
  });

  // Row 4 (Left): 5 Hexagonal Integration / Brittle Pipeline Nodes (shape=hexagon)
  asIsIntegration.forEach((intg, idx) => {
    const ix = 100 + idx * 96;
    xml += `
        <mxCell id="l_int_${idx}" value="&lt;b style=&quot;font-size:7.3px;color:#78350F;&quot;&gt;${escapeXml(intg.name)}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;display:inline-block;margin-top:3px;background:#FEF3C7;color:#B45309;border-radius:4px;padding:0px 4px;font-size:6.1px;font-weight:700;&quot;&gt;${escapeXml(intg.sub)}&lt;/span&gt;" style="shape=hexagon;perimeter=hexagonPerimeter2;whiteSpace=wrap;html=1;fixedSize=1;size=10;fillColor=#FFFBEB;strokeColor=#F59E0B;strokeWidth=1.3;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="${ix}" y="${tierSpec[3].cardY}" width="90" height="${tierSpec[3].cardH}" as="geometry"/>
        </mxCell>`;
  });

  // Row 5 (Left): 5 Slate Compute & Infrastructure Nodes
  asIsInfra.forEach((inf, idx) => {
    const fx = 100 + idx * 96;
    xml += `
        <mxCell id="l_inf_${idx}" value="&lt;div style=&quot;font-size:5.8px;font-weight:800;color:#475569;background:#E2E8F0;border-radius:3px;padding:1px 4px;margin-bottom:3px;display:inline-block;&quot;&gt;ON-PREM / STATIC&lt;/div&gt;&lt;br&gt;&lt;b style=&quot;font-size:7.5px;color:#0F172A;&quot;&gt;${escapeXml(inf.name)}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:6.5px;color:#64748B;font-weight:600;&quot;&gt;${escapeXml(inf.sub)}&lt;/span&gt;" style="rounded=1;arcSize=10;whiteSpace=wrap;html=1;fillColor=#F8FAFC;strokeColor=#94A3B8;strokeWidth=1.3;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="${fx}" y="${tierSpec[4].cardY}" width="90" height="${tierSpec[4].cardH}" as="geometry"/>
        </mxCell>`;
  });

  // Row 6 (Left): 5 Dashed-Perimeter Security & Governance Risk Nodes
  asIsSecurity.forEach((sec, idx) => {
    const sx = 100 + idx * 96;
    xml += `
        <mxCell id="l_sec_${idx}" value="&lt;b style=&quot;font-size:7.4px;color:#DC2626;&quot;&gt;&#9888; ${escapeXml(sec.name)}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;display:inline-block;margin-top:3px;background:#FEE2E2;color:#7F1D1D;border-radius:4px;padding:1px 4px;font-size:6.1px;font-weight:700;&quot;&gt;${escapeXml(sec.sub)}&lt;/span&gt;" style="rounded=1;arcSize=12;whiteSpace=wrap;html=1;fillColor=#FFF5F5;strokeColor=#EF4444;strokeWidth=1.3;dashed=1;dashPattern=4 2;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="${sx}" y="${tierSpec[5].cardY}" width="90" height="${tierSpec[5].cardH}" as="geometry"/>
        </mxCell>`;
  });

  // Bottom Verbatim Assessor Note Strip inside As-Is Zone (y=678, height=60)
  xml += `
        <mxCell id="l_note_strip" value="&lt;b style=&quot;font-size:7.8px;color:#991B1B;&quot;&gt;[ASSESSOR TELEMETRY &amp;amp; VERBATIM NOTE]:&lt;/b&gt; &lt;i style=&quot;font-size:7.3px;color:#334155;&quot;&gt;&amp;ldquo;${escapeXml(weakest.noteSnippet)}&amp;rdquo;&lt;/i&gt;" style="rounded=1;arcSize=10;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#FCA5A5;strokeWidth=1.2;align=left;verticalAlign=middle;spacingLeft=8;" vertex="1" parent="1">
          <mxGeometry x="26" y="678" width="554" height="60" as="geometry"/>
        </mxCell>
`;

  // Straight 1:1 Vertical Red Dashed Friction Connectors across Left Zone rows
  for (let i = 0; i < 5; i++) {
    xml += `
        <mxCell id="l_e_ch_app_${i}" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;strokeColor=#EF4444;strokeWidth=1.1;dashed=1;dashPattern=3 3;endArrow=open;endFill=0;exitX=0.5;exitY=1;entryX=0.5;entryY=0;" edge="1" parent="1" source="l_ch_${i}" target="l_app_${i}">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell id="l_e_app_cyl_${i}" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;strokeColor=#EF4444;strokeWidth=1.1;dashed=1;dashPattern=3 3;endArrow=open;endFill=0;exitX=0.5;exitY=1;entryX=0.5;entryY=0;" edge="1" parent="1" source="l_app_${i}" target="l_cyl_${i}">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell id="l_e_cyl_int_${i}" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;strokeColor=#EF4444;strokeWidth=1.1;dashed=1;dashPattern=3 3;endArrow=open;endFill=0;exitX=0.5;exitY=1;entryX=0.5;entryY=0;" edge="1" parent="1" source="l_cyl_${i}" target="l_int_${i}">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell id="l_e_int_inf_${i}" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;strokeColor=#EF4444;strokeWidth=1.1;dashed=1;dashPattern=3 3;endArrow=open;endFill=0;exitX=0.5;exitY=1;entryX=0.5;entryY=0;" edge="1" parent="1" source="l_int_${i}" target="l_inf_${i}">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell id="l_e_inf_sec_${i}" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;strokeColor=#EF4444;strokeWidth=1.1;dashed=1;dashPattern=3 3;endArrow=open;endFill=0;exitX=0.5;exitY=1;entryX=0.5;entryY=0;" edge="1" parent="1" source="l_inf_${i}" target="l_sec_${i}">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>`;
  }

  // ==================== MIDDLE ZONE: TRANSFORMATION BENEFITS & TRANSITION BRIDGE ====================
  xml += `
        <mxCell id="z_mid_bg" value="" style="rounded=1;arcSize=3;whiteSpace=wrap;html=1;fillColor=#EFF6FF;strokeColor=${midStroke};strokeWidth=${midStrokeW};opacity=${midOpacity};" vertex="1" parent="1">
          <mxGeometry x="618" y="60" width="236" height="688" as="geometry"/>
        </mxCell>
        <mxCell id="z_mid_hdr" value="&lt;b style=&quot;font-size:9px;color:#FFFFFF;letter-spacing:0.3px;&quot;&gt;${isStage2 ? '&#9733; ' : ''}TRANSFORMATION BRIDGE${isStage2 ? ' (FOCUS)' : ''}&lt;/b&gt;" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#1D4ED8;strokeColor=#1E40AF;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="636" y="60" width="200" height="22" as="geometry"/>
        </mxCell>
        <mxCell id="z_mid_sub" value="&lt;span style=&quot;display:inline-block;background:#DBEAFE;border:1px solid #93C5FD;color:#1E40AF;border-radius:6px;padding:2px 8px;font-size:7.2px;font-weight:800;&quot;&gt;PHASED CUTOVER: ${avgCur} → ${avgMid} → ${avgTgt}/5.0&lt;/span&gt;" style="text;html=1;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="626" y="88" width="220" height="28" as="geometry"/>
        </mxCell>
`;

  // 6 Tier-Aligned Bridge Cards + 6 Left-to-Middle and Middle-to-Right Horizontal Flow Arrows
  bridgeCards.forEach((bc, idx) => {
    const ts = tierSpec[idx];
    xml += `
        <mxCell id="m_card_${idx}" value="&lt;table style=&quot;width:100%;border-collapse:collapse;&quot;&gt;&lt;tr&gt;&lt;td style=&quot;width:28px;vertical-align:middle;&quot;&gt;&lt;div style=&quot;width:24px;height:24px;border-radius:50%;background:#1D4ED8;color:#FFFFFF;font-size:8.5px;font-weight:800;text-align:center;line-height:24px;&quot;&gt;${bc.badge}&lt;/div&gt;&lt;/td&gt;&lt;td style=&quot;vertical-align:middle;text-align:left;&quot;&gt;&lt;span style=&quot;background:#EFF6FF;border:1px solid #BFDBFE;color:#1E40AF;border-radius:3px;padding:0px 3px;font-size:5.5px;font-weight:800;margin-right:3px;&quot;&gt;${escapeXml(bc.layerTag)}&lt;/span&gt;&lt;b style=&quot;font-size:7.3px;color:#0F172A;&quot;&gt;${escapeXml(bc.title)}&lt;/b&gt; &lt;span style=&quot;background:#DBEAFE;color:#1D4ED8;border-radius:4px;padding:0px 4px;font-size:6.1px;font-weight:800;&quot;&gt;${escapeXml(bc.scorePill)}&lt;/span&gt;&lt;br&gt;&lt;span style=&quot;font-size:6.7px;color:#1E40AF;font-weight:700;&quot;&gt;${escapeXml(bc.bridge)}&lt;/span&gt;&lt;br&gt;&lt;span style=&quot;font-size:6.2px;color:#475569;&quot;&gt;${escapeXml(bc.remedy)}&lt;/span&gt;&lt;/td&gt;&lt;/tr&gt;&lt;/table&gt;" style="rounded=1;arcSize=12;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#60A5FA;strokeWidth=1.3;align=left;verticalAlign=middle;spacingLeft=5;spacingRight=5;" vertex="1" parent="1">
          <mxGeometry x="626" y="${ts.boxY}" width="220" height="${ts.boxH}" as="geometry"/>
        </mxCell>
        <mxCell id="m_flow_in_${idx}" value="" style="endArrow=block;endFill=1;html=1;strokeColor=#2563EB;strokeWidth=1.6;" edge="1" parent="1">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="590" y="${ts.centerY}" as="sourcePoint"/>
            <mxPoint x="626" y="${ts.centerY}" as="targetPoint"/>
          </mxGeometry>
        </mxCell>
        <mxCell id="m_flow_out_${idx}" value="" style="endArrow=block;endFill=1;html=1;strokeColor=#059669;strokeWidth=1.6;" edge="1" parent="1">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="846" y="${ts.centerY}" as="sourcePoint"/>
            <mxPoint x="892" y="${ts.centerY}" as="targetPoint"/>
          </mxGeometry>
        </mxCell>`;
  });

  // Matching Bottom Summary Strip inside Middle Bridge Zone (y=678, height=60)
  xml += `
        <mxCell id="m_summary_strip" value="&lt;b style=&quot;font-size:7.4px;color:#1D4ED8;&quot;&gt;[WAVE 1–2 BRIDGE SLA]:&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:6.8px;color:#1E293B;&quot;&gt;Dual-run cutover lifts maturity &lt;b&gt;${avgCur} → ${avgMid}/5.0&lt;/b&gt; with zero downtime.&lt;/span&gt;" style="rounded=1;arcSize=10;whiteSpace=wrap;html=1;fillColor=#DBEAFE;strokeColor=#60A5FA;strokeWidth=1.2;align=center;verticalAlign=middle;spacingLeft=4;spacingRight=4;" vertex="1" parent="1">
          <mxGeometry x="626" y="678" width="220" height="60" as="geometry"/>
        </mxCell>
`;

  // ==================== RIGHT ZONE: TO-BE FUTURE STATE ====================
  xml += `
        <mxCell id="z_right_bg" value="" style="rounded=1;arcSize=3;whiteSpace=wrap;html=1;fillColor=#F0FDF4;strokeColor=${rightStroke};strokeWidth=${rightStrokeW};opacity=${rightOpacity};" vertex="1" parent="1">
          <mxGeometry x="882" y="60" width="698" height="688" as="geometry"/>
        </mxCell>
        <mxCell id="z_right_hdr" value="&lt;b style=&quot;font-size:10px;color:#FFFFFF;letter-spacing:0.4px;&quot;&gt;${isStage3 ? '&#9733; ' : ''}TO-BE FUTURE STATE (${avgTgt} / 5.0 • +${overallDelta} LEAP)${isStage3 ? ' — ACTIVE' : ''}&lt;/b&gt;" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#065F46;strokeColor=#047857;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="1040" y="60" width="380" height="22" as="geometry"/>
        </mxCell>
`;

  // Top 6 Target Value Pills inside Right Zone (y=86, height=34)
  const toBeValuePills = [p0, p1, p2, p3, p4, p5].map((p) => ({
    title: concisePillarLabel(p.cleanName, 18),
    sub: `Target ${p.futureScore}/5.0 (+${p.gap})`
  }));

  toBeValuePills.forEach((vp, idx) => {
    const vx = 892 + idx * 113;
    xml += `
        <mxCell id="r_val_${idx}" value="&lt;b style=&quot;font-size:7.2px;color:#065F46;&quot;&gt;&#10003; ${escapeXml(vp.title)}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;display:inline-block;margin-top:2px;background:#D1FAE5;color:#047857;border-radius:4px;padding:0px 4px;font-size:6.2px;font-weight:700;&quot;&gt;${escapeXml(vp.sub)}&lt;/span&gt;" style="rounded=1;arcSize=20;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#6EE7B7;strokeWidth=1.1;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="${vx}" y="86" width="107" height="34" as="geometry"/>
        </mxCell>`;
  });

  // Tier 1 (Right): Container + 6 Unified Pill-Shaped Persona Channels (y=128, height=76)
  xml += `
        <mxCell id="r_tier1_box" value="" style="rounded=1;arcSize=4;whiteSpace=wrap;html=1;fillColor=#ECFDF5;strokeColor=#6EE7B7;strokeWidth=1.3;" vertex="1" parent="1">
          <mxGeometry x="892" y="${tierSpec[0].boxY}" width="678" height="${tierSpec[0].boxH}" as="geometry"/>
        </mxCell>
        <mxCell id="r_tier1_hdr" value="&lt;b style=&quot;font-size:7.8px;color:#065F46;letter-spacing:0.3px;&quot;&gt;TIER 1: UNIFIED OMNICHANNEL, PERSONA &amp;amp; AI EXPERIENCE LAYER&lt;/b&gt;" style="text;html=1;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="900" y="130" width="660" height="14" as="geometry"/>
        </mxCell>
`;

  channelNames.slice(0, 6).forEach((chName, idx) => {
    const cx = 898 + idx * 111;
    xml += `
        <mxCell id="r_ch_${idx}" value="&lt;b style=&quot;font-size:7.5px;color:#065F46;&quot;&gt;${escapeXml(chName)}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;display:inline-block;margin-top:3px;background:#D1FAE5;color:#047857;border-radius:6px;padding:1px 5px;font-size:6.2px;font-weight:700;&quot;&gt;Unified AI Portal&lt;/span&gt;" style="rounded=1;arcSize=28;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#34D399;strokeWidth=1.2;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="${cx}" y="146" width="105" height="52" as="geometry"/>
        </mxCell>`;
  });

  // Tier 2 (Right): Container + 6 Enterprise Cloud Digital Platform Cards (y=216, height=80)
  xml += `
        <mxCell id="r_plat_box" value="" style="rounded=1;arcSize=4;whiteSpace=wrap;html=1;fillColor=#F8FAFC;strokeColor=#93C5FD;strokeWidth=1.4;" vertex="1" parent="1">
          <mxGeometry x="892" y="${tierSpec[1].boxY}" width="678" height="${tierSpec[1].boxH}" as="geometry"/>
        </mxCell>
        <mxCell id="r_plat_hdr" value="&lt;b style=&quot;font-size:7.8px;color:#0F172A;letter-spacing:0.3px;&quot;&gt;TIER 2: ENTERPRISE CLOUD DIGITAL PLATFORM (CLOUD-NATIVE — ${escapeXml(targetPlatformBrand.toUpperCase())})&lt;/b&gt;" style="text;html=1;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="900" y="218" width="660" height="14" as="geometry"/>
        </mxCell>
`;

  const digitalPlatformApps = [
    { name: 'AI / ML Workbench', tag: 'VERTEX AI', pill: `${p3.futureScore}/5 • Active` },
    { name: concisePillarLabel(p0.cleanName, 18), tag: 'GOVERNED', pill: `${p0.futureScore}/5 • Policy` },
    { name: concisePillarLabel(p1.cleanName, 18), tag: 'AUTOMATED', pill: `${p1.futureScore}/5 • Stream` },
    { name: 'Safety & Guardrails', tag: 'MODEL ARMOR', pill: `${p4.futureScore}/5 • Inline` },
    { name: concisePillarLabel(p2.cleanName, 18), tag: 'REAL-TIME', pill: `${p2.futureScore}/5 • Live` },
    { name: concisePillarLabel(p5.cleanName, 18), tag: 'COE PORTAL', pill: `${p5.futureScore}/5 • Self-Svc` }
  ];

  digitalPlatformApps.forEach((dp, idx) => {
    const px = 898 + idx * 111;
    xml += `
        <mxCell id="r_dp_${idx}" value="&lt;div style=&quot;font-size:5.6px;font-weight:800;color:#1E40AF;background:#DBEAFE;border-radius:3px;padding:1px 4px;margin-bottom:2px;display:inline-block;&quot;&gt;${escapeXml(dp.tag)}&lt;/div&gt;&lt;br&gt;&lt;b style=&quot;font-size:7.4px;color:#0F172A;&quot;&gt;${escapeXml(dp.name)}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;display:inline-block;margin-top:2px;background:#D1FAE5;color:#065F46;border-radius:4px;padding:0px 4px;font-size:6.2px;font-weight:700;&quot;&gt;${escapeXml(dp.pill)}&lt;/span&gt;" style="rounded=1;arcSize=12;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#60A5FA;strokeWidth=1.2;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="${px}" y="234" width="105" height="56" as="geometry"/>
        </mxCell>`;
  });

  // Clean vertical green arrows from Tier 1 container bottom (y=204) to Tier 2 container top (y=216)
  for (let i = 0; i < 6; i++) {
    const ax = Math.round(898 + i * 111 + 52.5);
    xml += `
        <mxCell id="r_e_ch_plat_${i}" value="" style="endArrow=block;endFill=1;html=1;strokeColor=#16A34A;strokeWidth=1.3;" edge="1" parent="1">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="${ax}" y="204" as="sourcePoint"/>
            <mxPoint x="${ax}" y="216" as="targetPoint"/>
          </mxGeometry>
        </mxCell>`;
  }

  // Tier 3 (Right): Domain-Aware Data & Telemetry Platform with 5 Green Cylinders (y=308, height=84)
  const tier3HeaderText = isFinOpsDomain
    ? 'TIER 3: CLOUD FINOPS &amp; BILLING TELEMETRY PLATFORM (BIGQUERY FOCUS 1.0, CUD &amp; UNIT ECONOMICS HUB)'
    : isSecurityDomain
    ? 'TIER 3: ZERO-TRUST DATA SECURITY &amp; IMMUTABLE AUDIT PLATFORM (CLOUD DLP, KMS HSM &amp; CHRONICLE WORM)'
    : isAgenticDomain
    ? 'TIER 3: AGENTIC MEMORY, KNOWLEDGE &amp; CONTEXT PLATFORM (ALLOYDB AI, SPANNER GRAPH &amp; VECTOR RAG)'
    : isGeminiMigDomain
    ? 'TIER 3: ENTERPRISE AI CONTEXT &amp; GROUNDING PLATFORM (2M CONTEXT CACHE, VERTEX RAG &amp; EVAL STORE)'
    : 'TIER 3: DATA PLATFORM (UNIFIED &amp; GOVERNED BIGQUERY + BIGLAKE MEDALLION LAKEHOUSE)';

  xml += `
        <mxCell id="r_data_box" value="" style="rounded=1;arcSize=4;whiteSpace=wrap;html=1;fillColor=#ECFDF5;strokeColor=#6EE7B7;strokeWidth=1.4;" vertex="1" parent="1">
          <mxGeometry x="892" y="${tierSpec[2].boxY}" width="678" height="${tierSpec[2].boxH}" as="geometry"/>
        </mxCell>
        <mxCell id="r_data_hdr" value="&lt;b style=&quot;font-size:7.8px;color:#065F46;letter-spacing:0.3px;&quot;&gt;${tier3HeaderText}&lt;/b&gt;" style="text;html=1;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="900" y="310" width="660" height="14" as="geometry"/>
        </mxCell>
`;

  const toBeCylinders = isFinOpsDomain
    ? [
        { name: 'FOCUS 1.0 Billing', sub: 'BigQuery FinOps Hub' },
        { name: 'GKE Cost Allocation', sub: 'Autopilot + OpenCost' },
        { name: 'CUD Portfolio Store', sub: '85%+ Flex Coverage' },
        { name: 'BigLake Cold Tier', sub: 'Autoclass Lifecycle' },
        { name: 'Unit Economics Mart', sub: 'Looker Showback SLA' }
      ]
    : isSecurityDomain
    ? [
        { name: 'Immutable Audit Log', sub: 'Chronicle WORM Lake' },
        { name: 'Tokenized PII Vault', sub: 'Cloud DLP Surrogates' },
        { name: 'HSM CMEK Key Store', sub: 'Cloud KMS Hardware' },
        { name: 'Verified Model Repo', sub: 'SLSA L3 Binary Auth' },
        { name: 'AI Telemetry Lake', sub: 'Zero-Egress VPC-SC' }
      ]
    : isAgenticDomain
    ? [
        { name: 'Episodic Memory DB', sub: 'AlloyDB AI + Spanner' },
        { name: 'MCP Tool Registry', sub: 'Governed Schema Hub' },
        { name: 'Vector RAG Index', sub: 'Vertex Vector Search' },
        { name: 'Agent Trace Store', sub: 'OpenTelemetry Spans' },
        { name: 'Entitlement Ledger', sub: 'Scoped OAuth + HITL' }
      ]
    : isGeminiMigDomain
    ? [
        { name: '2M Context Cache', sub: '75% Token Savings' },
        { name: 'Vertex Vector RAG', sub: 'Zero-Chunk Grounding' },
        { name: 'Canonical Prompt DB', sub: 'Gemini 3.8 Schemas' },
        { name: 'Eval Golden Dataset', sub: 'Continuous CI/CD QA' },
        { name: 'CMEK Audit Store', sub: 'Zero-Retention Logs' }
      ]
    : isLakehouseDomain
    ? [
        { name: 'BigLake Open Iceberg', sub: 'Zero-Copy Multi-Cloud' },
        { name: 'BigQuery Editions', sub: 'Vectorized Slot Pool' },
        { name: 'Dataplex Catalog', sub: 'Auto-Lineage & ABAC' },
        { name: 'Streaming CDC Hub', sub: 'Sub-Sec Datastream' },
        { name: 'Looker Semantic Hub', sub: 'Governed BI Metrics' }
      ]
    : [
        { name: 'Unified Lakehouse', sub: 'BigQuery + BigLake' },
        { name: 'Dataplex Catalog', sub: 'Lineage & ABAC Tags' },
        { name: 'Looker Metric Store', sub: 'Semantic BI Engine' },
        { name: 'Vertex Feature Store', sub: 'Online / Offline ML' },
        { name: 'FinOps & Audit Hub', sub: 'FOCUS + KMS CMEK' }
      ];

  toBeCylinders.forEach((cyl, idx) => {
    const cx = 902 + idx * 133;
    xml += `
        <mxCell id="r_cyl_${idx}" value="&lt;b style=&quot;font-size:7.4px;color:#065F46;&quot;&gt;${escapeXml(cyl.name)}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;display:inline-block;margin-top:2px;background:#D1FAE5;color:#047857;border-radius:4px;padding:0px 4px;font-size:6.1px;font-weight:700;&quot;&gt;${escapeXml(cyl.sub)}&lt;/span&gt;" style="shape=cylinder3;whiteSpace=wrap;html=1;boundedLbl=1;backgroundOutline=1;size=8;fillColor=#FFFFFF;strokeColor=#10B981;strokeWidth=1.3;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="${cx}" y="326" width="125" height="60" as="geometry"/>
        </mxCell>`;
  });

  // Clean vertical green arrows from Tier 2 container bottom (y=296) to Tier 3 container top (y=308)
  for (let i = 0; i < 5; i++) {
    const ax = Math.round(902 + i * 133 + 62.5);
    xml += `
        <mxCell id="r_e_plat_data_${i}" value="" style="endArrow=block;endFill=1;html=1;strokeColor=#16A34A;strokeWidth=1.3;" edge="1" parent="1">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="${ax}" y="296" as="sourcePoint"/>
            <mxPoint x="${ax}" y="308" as="targetPoint"/>
          </mxGeometry>
        </mxCell>`;
  }

  // Tier 4 (Right): Container + 5 Hexagonal Cloud-Native Integration & Event Mesh Nodes (y=404, height=80)
  xml += `
        <mxCell id="r_int_box" value="" style="rounded=1;arcSize=4;whiteSpace=wrap;html=1;fillColor=#F0F9FF;strokeColor=#7DD3FC;strokeWidth=1.3;" vertex="1" parent="1">
          <mxGeometry x="892" y="${tierSpec[3].boxY}" width="678" height="${tierSpec[3].boxH}" as="geometry"/>
        </mxCell>
        <mxCell id="r_int_hdr" value="&lt;b style=&quot;font-size:7.8px;color:#0369A1;letter-spacing:0.3px;&quot;&gt;TIER 4: CLOUD-NATIVE INTEGRATION, API GATEWAY &amp;amp; EVENT MESH&lt;/b&gt;" style="text;html=1;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="900" y="406" width="660" height="14" as="geometry"/>
        </mxCell>
`;

  const toBeIntegration = isFinOpsDomain
    ? [
        { name: 'Billing Export Stream', sub: 'BigQuery FOCUS 1.0' },
        { name: 'Pod Cost Metering', sub: 'GKE OpenCost / Labels' },
        { name: 'Token Quota Router', sub: 'Apigee + Context Cache' },
        { name: 'Anomaly Event Bus', sub: 'Pub/Sub + BQML Alerts' },
        { name: 'CUD & Slot Governor', sub: 'Autoscaling Reservations' }
      ]
    : isSecurityDomain
    ? [
        { name: 'Zero-Trust Edge Proxy', sub: 'Cloud Armor WAF + IAP' },
        { name: 'Inline AI Shield', sub: 'Google Model Armor' },
        { name: 'PII / PHI Tokenization', sub: 'Cloud DLP De-ID Stream' },
        { name: 'SIEM / SOAR Telemetry', sub: 'Chronicle SecOps Bus' },
        { name: 'Workload Federation', sub: 'Zero Static IAM Keys' }
      ]
    : isAgenticDomain
    ? [
        { name: 'Super-Orchestrator Bus', sub: 'Gemini 3.8 Agent Hub' },
        { name: 'MCP Tool Gateway', sub: 'Standardized Tool RPC' },
        { name: 'Agent-to-Agent (A2A)', sub: 'Pub/Sub Event Mesh' },
        { name: 'Episodic Memory Sync', sub: 'AlloyDB + Vector RAG' },
        { name: 'HITL Approval Gate', sub: 'Policy & Audit Guard' }
      ]
    : isGeminiMigDomain
    ? [
        { name: 'Apigee AI Gateway', sub: 'OpenAI-to-Gemini Proxy' },
        { name: '2M Context Caching', sub: '75% Input Token Savings' },
        { name: 'Vertex Vector RAG', sub: 'ACL-Synchronized Index' },
        { name: 'MCP Tool Microservices', sub: 'Sandboxed Function Mesh' },
        { name: 'Automated Eval Gate', sub: 'Vertex GenAI Eval CI/CD' }
      ]
    : isLakehouseDomain
    ? [
        { name: 'Datastream CDC', sub: 'Sub-Second Replication' },
        { name: 'Dataform Declarative', sub: 'Git-Backed SQL ELT' },
        { name: 'BigQuery Omni Mesh', sub: 'Cross-Cloud Zero-Egress' },
        { name: 'Pub/Sub Event Bus', sub: 'Streaming Ingestion' },
        { name: 'Looker Semantic API', sub: 'Governed BI Acceleration' }
      ]
    : [
        { name: 'API Gateway & Mgmt', sub: 'Apigee / Cloud Endpoints' },
        { name: 'Event Streaming', sub: 'Cloud Pub/Sub' },
        { name: 'Data Integration', sub: 'Dataflow / Datastream' },
        { name: 'MCP / A2A Mesh', sub: 'Agent Tool Protocol' },
        { name: 'Partner & Ecosystem', sub: 'Zero-Trust Federation' }
      ];

  toBeIntegration.forEach((ig, idx) => {
    const ix = 902 + idx * 133;
    const ax = Math.round(ix + 62.5);
    xml += `
        <mxCell id="r_int_${idx}" value="&lt;b style=&quot;font-size:7.3px;color:#0F172A;&quot;&gt;${escapeXml(ig.name)}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;display:inline-block;margin-top:2px;background:#E0F2FE;color:#0369A1;border-radius:4px;padding:0px 4px;font-size:6.1px;font-weight:700;&quot;&gt;${escapeXml(ig.sub)}&lt;/span&gt;" style="shape=hexagon;perimeter=hexagonPerimeter2;whiteSpace=wrap;html=1;fixedSize=1;size=10;fillColor=#FFFFFF;strokeColor=#0284C7;strokeWidth=1.3;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="${ix}" y="422" width="125" height="56" as="geometry"/>
        </mxCell>
        <mxCell id="r_e_data_int_${idx}" value="" style="endArrow=block;endFill=1;html=1;strokeColor=#16A34A;strokeWidth=1.3;" edge="1" parent="1">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="${ax}" y="392" as="sourcePoint"/>
            <mxPoint x="${ax}" y="404" as="targetPoint"/>
          </mxGeometry>
        </mxCell>
        <mxCell id="r_e_int_gcp_${idx}" value="" style="endArrow=block;endFill=1;html=1;strokeColor=#16A34A;strokeWidth=1.3;" edge="1" parent="1">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="${ax}" y="484" as="sourcePoint"/>
            <mxPoint x="${ax}" y="496" as="targetPoint"/>
          </mxGeometry>
        </mxCell>`;
  });

  // Tier 5 (Right): GOOGLE CLOUD PLATFORM Container with 4-Color Accent & Product Icons (y=496, height=80)
  xml += `
        <mxCell id="r_gcp_box" value="" style="rounded=1;arcSize=4;whiteSpace=wrap;html=1;fillColor=#F8FAFC;strokeColor=#93C5FD;strokeWidth=1.4;" vertex="1" parent="1">
          <mxGeometry x="892" y="${tierSpec[4].boxY}" width="678" height="${tierSpec[4].boxH}" as="geometry"/>
        </mxCell>
        <mxCell id="r_gcp_hdr" value="&lt;b style=&quot;font-size:7.8px;color:#1E3A8A;letter-spacing:0.3px;&quot;&gt;TIER 5: GOOGLE CLOUD PLATFORM (${escapeXml(truncateText(useCase.toUpperCase(), 68))})&lt;/b&gt;" style="text;html=1;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="900" y="498" width="660" height="14" as="geometry"/>
        </mxCell>
`;

  const gcpCards = [
    { name: 'Compute', sub: isFinOpsDomain ? 'GKE Autopilot Scale-0' : 'GKE / Cloud Run', color: '#4285F4' },
    { name: 'Storage', sub: isLakehouseDomain ? 'BigLake Iceberg + GCS' : 'Cloud Storage Autoclass', color: '#34A853' },
    { name: 'Databases', sub: isAgenticDomain ? 'Spanner / AlloyDB AI' : 'Spanner / AlloyDB', color: '#FBBC05' },
    { name: 'Analytics', sub: isFinOpsDomain ? 'BigQuery FOCUS 1.0' : 'BigQuery Editions', color: '#EA4335' },
    { name: 'AI / ML', sub: isGeminiMigDomain ? 'Gemini 3.8 • 2M Cache' : 'Vertex AI / Gemini', color: '#7C3AED' },
    { name: 'Resilience', sub: `${avgTgt}/5.0 Multi-Zone HA`, color: '#059669' }
  ];

  gcpCards.forEach((gc, idx) => {
    const gx = 898 + idx * 111;
    xml += `
        <mxCell id="r_gcp_${idx}" value="&lt;div style=&quot;width:70%;height:3px;background:${gc.color};margin:0 auto 3px auto;border-radius:2px;&quot;&gt;&lt;/div&gt;&lt;b style=&quot;font-size:7.6px;color:#1E3A8A;&quot;&gt;${escapeXml(gc.name)}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;display:inline-block;margin-top:2px;background:#EFF6FF;color:#1D4ED8;border-radius:4px;padding:0px 4px;font-size:6.1px;font-weight:700;&quot;&gt;${escapeXml(gc.sub)}&lt;/span&gt;" style="rounded=1;arcSize=12;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#60A5FA;strokeWidth=1.2;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="${gx}" y="514" width="105" height="56" as="geometry"/>
        </mxCell>`;
  });

  // Tier 6 (Right): Container + 6 Zero-Trust Security & Governance Perimeter Cards (y=588, height=80)
  xml += `
        <mxCell id="r_sec_box" value="" style="rounded=1;arcSize=4;whiteSpace=wrap;html=1;fillColor=#ECFDF5;strokeColor=#34D399;strokeWidth=1.4;" vertex="1" parent="1">
          <mxGeometry x="892" y="${tierSpec[5].boxY}" width="678" height="${tierSpec[5].boxH}" as="geometry"/>
        </mxCell>
        <mxCell id="r_sec_hdr" value="&lt;b style=&quot;font-size:7.8px;color:#065F46;letter-spacing:0.3px;&quot;&gt;TIER 6: ZERO-TRUST SECURITY, AI SAFETY &amp;amp; GOVERNANCE PERIMETER&lt;/b&gt;" style="text;html=1;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="900" y="590" width="660" height="14" as="geometry"/>
        </mxCell>
`;

  const toBeSecurity = [
    { name: 'Zero Trust Security', sub: 'VPC Service Controls' },
    { name: 'IAM & Least Privilege', sub: 'Workload Identity' },
    { name: 'Encryption (CMEK)', sub: isSecurityDomain ? 'HSM + Confidential VM' : 'At Rest & In Transit' },
    { name: 'Audit & Observability', sub: isAgenticDomain ? 'Agent Trajectory Logs' : 'Real-Time SLOs' },
    { name: 'Data Privacy & DLP', sub: 'PII / PHI Tokenization' },
    { name: 'AI Safety & Compliance', sub: `Model Armor (${p4.futureScore}/5)` }
  ];

  toBeSecurity.forEach((sc, idx) => {
    const sx = 898 + idx * 111;
    const ax = Math.round(sx + 52.5);
    xml += `
        <mxCell id="r_sec_${idx}" value="&lt;b style=&quot;font-size:7.3px;color:#065F46;&quot;&gt;&#10003; ${escapeXml(sc.name)}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;display:inline-block;margin-top:3px;background:#D1FAE5;color:#047857;border-radius:4px;padding:1px 4px;font-size:6.1px;font-weight:700;&quot;&gt;${escapeXml(sc.sub)}&lt;/span&gt;" style="rounded=1;arcSize=12;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#10B981;strokeWidth=1.3;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="${sx}" y="606" width="105" height="56" as="geometry"/>
        </mxCell>
        <mxCell id="r_e_gcp_sec_${idx}" value="" style="endArrow=block;endFill=1;html=1;strokeColor=#16A34A;strokeWidth=1.3;" edge="1" parent="1">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="${ax}" y="576" as="sourcePoint"/>
            <mxPoint x="${ax}" y="588" as="targetPoint"/>
          </mxGeometry>
        </mxCell>`;
  });

  const toBeGuaranteeText = `100% of ${custName}'s identified pain points across all 6 dimensions are remediated on ${targetPlatformBrand}, lifting composite maturity +${overallDelta} points (${avgCur} → ${avgTgt}/5.0) with primary bottleneck ${weakest.cleanName} elevated from ${weakest.currentScore} to ${weakest.futureScore}/5.0.`;

  // Bottom Target Summary Strip inside To-Be Zone (y=678, height=60)
  xml += `
        <mxCell id="r_summary_strip" value="&lt;b style=&quot;font-size:7.8px;color:#065F46;&quot;&gt;[TO-BE TARGET ARCHITECTURE (${avgTgt}/5.0)]:&lt;/b&gt; &lt;span style=&quot;font-size:7.3px;color:#0F172A;&quot;&gt;${escapeXml(toBeGuaranteeText)}&lt;/span&gt;" style="rounded=1;arcSize=10;whiteSpace=wrap;html=1;fillColor=#DCFCE7;strokeColor=#34D399;strokeWidth=1.2;align=left;verticalAlign=middle;spacingLeft=8;" vertex="1" parent="1">
          <mxGeometry x="892" y="678" width="678" height="60" as="geometry"/>
        </mxCell>

        <!-- ==================== BOTTOM BAR: KEY TECHNOLOGY ENABLERS & OUTCOMES ==================== -->
        <mxCell id="b_enablers_box" value="" style="rounded=1;arcSize=3;whiteSpace=wrap;html=1;fillColor=#F8FAFC;strokeColor=#CBD5E1;strokeWidth=1.3;" vertex="1" parent="1">
          <mxGeometry x="20" y="758" width="834" height="92" as="geometry"/>
        </mxCell>
        <mxCell id="b_enablers_hdr" value="&lt;b style=&quot;font-size:8.5px;color:#0F172A;letter-spacing:0.4px;&quot;&gt;KEY TECHNOLOGY ENABLERS (${escapeXml(custName.toUpperCase())})&lt;/b&gt;" style="text;html=1;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="30" y="760" width="814" height="18" as="geometry"/>
        </mxCell>
`;

  const enablers = isFinOpsDomain
    ? ['BigQuery FOCUS', 'GKE Autopilot', 'Vertex Caching', 'Looker FinOps', 'Cloud Billing', 'OpenCost', 'Slot Autoscaler', 'CUD Optimizer', 'BQML Alerts', 'Terraform', 'Apigee Quotas', 'Dataplex']
    : isSecurityDomain
    ? ['VPC-SC', 'Model Armor', 'Cloud DLP', 'Cloud KMS HSM', 'Chronicle SIEM', 'BeyondCorp IAP', 'Cloud Armor', 'Workload ID', 'Binary Auth', 'Confidential VM', 'Dataplex ABAC', 'SCC Enterprise']
    : isAgenticDomain
    ? ['Gemini 3.8', 'Vertex Agent', 'MCP Gateway', 'A2A Protocol', 'AlloyDB AI', 'Vector Search', 'Apigee Gateway', 'Cloud Pub/Sub', 'Model Armor', 'OpenTelemetry', 'BigQuery', 'Cloud Run']
    : isGeminiMigDomain
    ? ['Gemini 3.8', 'Gemini 3.1 Pro', '2M Ctx Cache', 'Vertex RAG', 'Apigee Proxy', 'GenAI Eval', 'Model Armor', 'Provisioned TP', 'Cloud KMS', 'VPC-SC', 'Vertex Agent', 'BigQuery']
    : isLakehouseDomain
    ? ['BQ Editions', 'BigLake Iceberg', 'BigQuery Omni', 'Datastream CDC', 'Dataform ELT', 'Dataplex ABAC', 'BI Engine', 'Looker BI', 'BQML In-DB', 'Cloud Composer', 'GCS Autoclass', 'Cloud KMS']
    : [
        'Google Cloud', 'Vertex AI', 'BigQuery', 'BigLake Iceberg',
        'Dataflow CDC', 'Cloud Pub/Sub', 'GKE Autopilot', 'Apigee AI',
        'Looker BI', 'Dataplex', 'Gemini 3.8', 'Model Armor'
      ];

  enablers.forEach((en, idx) => {
    const ex = 28 + idx * 68;
    const meta = getEnablerVisualMeta(en);
    xml += `
        <mxCell id="b_en_${idx}" value="&lt;div style=&quot;display:inline-block;padding:3px;border-radius:6px;background:${meta.bg};margin-bottom:2px;&quot;&gt;${meta.svg}&lt;/div&gt;&lt;br&gt;&lt;b style=&quot;font-size:6.8px;color:#0F172A;&quot;&gt;${escapeXml(en)}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:5.2px;font-weight:800;color:${meta.color};letter-spacing:0.2px;&quot;&gt;${meta.cat}&lt;/span&gt;" style="rounded=1;arcSize=14;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#CBD5E1;strokeWidth=1.1;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="${ex}" y="780" width="64" height="64" as="geometry"/>
        </mxCell>`;
  });

  xml += `
        <mxCell id="b_outcomes_box" value="" style="rounded=1;arcSize=3;whiteSpace=wrap;html=1;fillColor=#F8FAFC;strokeColor=#CBD5E1;strokeWidth=1.3;" vertex="1" parent="1">
          <mxGeometry x="882" y="758" width="698" height="92" as="geometry"/>
        </mxCell>
        <mxCell id="b_outcomes_hdr" value="&lt;b style=&quot;font-size:8.5px;color:#0F172A;letter-spacing:0.4px;&quot;&gt;QUANTIFIED TARGET OUTCOMES (${escapeXml(custName.toUpperCase())})&lt;/b&gt;" style="text;html=1;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="892" y="760" width="678" height="18" as="geometry"/>
        </mxCell>
`;

  const domainOutcome5 = isFinOpsDomain
    ? { title: 'Cloud & AI Cost ROI', sub: '35–48% Unit TCO Savings', badge: 'FINOPS IMPACT' }
    : isSecurityDomain
    ? { title: 'Zero-Breach AI Posture', sub: '100% PII/PHI & Key Guard', badge: 'ZERO-TRUST SLA' }
    : isAgenticDomain
    ? { title: 'Autonomous Velocity', sub: '4.2x Faster Multi-Agent Ops', badge: 'AGENTIC ROI' }
    : isGeminiMigDomain
    ? { title: 'Token & Latency ROI', sub: '75% Cache Savings • 2M Ctx', badge: 'MIGRATION ROI' }
    : isLakehouseDomain
    ? { title: 'Zero-Egress Analytics', sub: 'Sub-Sec BI • 40% Lower TCO', badge: 'LAKEHOUSE ROI' }
    : {
        title: 'Enterprise Value ROI',
        sub: dossier.allQuantMetrics?.[0] ? `Optimizes ${truncateText(dossier.allQuantMetrics[0], 16)}` : '35–48% TCO & Velocity',
        badge: 'BUSINESS IMPACT'
      };

  const outcomes = [
    { title: concisePillarLabel(weakest.cleanName, 18), sub: `${weakest.currentScore} → ${weakest.futureScore}/5.0 (#1 Fix)`, badge: 'PRIMARY BOTTLENECK' },
    { title: concisePillarLabel((secondWeakest || p1).cleanName, 18), sub: `${(secondWeakest || p1).currentScore} → ${(secondWeakest || p1).futureScore}/5.0 (#2 Fix)`, badge: 'SECOND PRIORITY' },
    { title: 'Overall Maturity Leap', sub: `${avgCur} → ${avgTgt}/5.0 (+${overallDelta})`, badge: 'COMPOSITE SCORE' },
    { title: 'Wave 1–2 Bridge Target', sub: `${avgCur} → ${avgMid}/5.0 Zero-Downtime`, badge: 'PHASED CUTOVER' },
    domainOutcome5
  ];

  outcomes.forEach((oc, idx) => {
    const ox = 892 + idx * 137;
    xml += `
        <mxCell id="b_out_${idx}" value="&lt;div style=&quot;font-size:5.6px;font-weight:800;color:#047857;background:#D1FAE5;border-radius:3px;padding:1px 4px;margin-bottom:3px;display:inline-block;&quot;&gt;${escapeXml(oc.badge)}&lt;/div&gt;&lt;br&gt;&lt;b style=&quot;font-size:7.5px;color:#0F172A;&quot;&gt;&#10003; ${escapeXml(oc.title)}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;display:inline-block;margin-top:2px;font-size:6.8px;color:#059669;font-weight:800;&quot;&gt;${escapeXml(oc.sub)}&lt;/span&gt;" style="rounded=1;arcSize=14;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#A7F3D0;strokeWidth=1.2;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="${ox}" y="780" width="130" height="64" as="geometry"/>
        </mxCell>`;
  });

  // ==================== BOTTOM LEGEND BAR ====================
  xml += `
        <mxCell id="b_legend_bar" value="" style="rounded=1;arcSize=3;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#CBD5E1;strokeWidth=1.2;" vertex="1" parent="1">
          <mxGeometry x="20" y="858" width="1560" height="36" as="geometry"/>
        </mxCell>
        <mxCell id="b_leg_lbl" value="&lt;b style=&quot;font-size:8.5px;color:#0F172A;&quot;&gt;LEGEND:&lt;/b&gt;" style="text;html=1;align=left;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="32" y="864" width="60" height="24" as="geometry"/>
        </mxCell>
        <mxCell id="b_leg_asis" value="&lt;b style=&quot;font-size:7.5px;color:#DC2626;&quot;&gt;As-Is Silos (${avgCur}/5.0)&lt;/b&gt;" style="rounded=1;arcSize=16;whiteSpace=wrap;html=1;fillColor=#FEE2E2;strokeColor=#F87171;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="92" y="864" width="135" height="24" as="geometry"/>
        </mxCell>
        <mxCell id="b_leg_bridge" value="&lt;b style=&quot;font-size:7.5px;color:#1D4ED8;&quot;&gt;Transition Bridge (${avgMid}/5.0)&lt;/b&gt;" style="rounded=1;arcSize=16;whiteSpace=wrap;html=1;fillColor=#DBEAFE;strokeColor=#60A5FA;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="236" y="864" width="135" height="24" as="geometry"/>
        </mxCell>
        <mxCell id="b_leg_tobe" value="&lt;b style=&quot;font-size:7.5px;color:#065F46;&quot;&gt;To-Be Cloud Target (${avgTgt}/5.0)&lt;/b&gt;" style="rounded=1;arcSize=16;whiteSpace=wrap;html=1;fillColor=#D1FAE5;strokeColor=#34D399;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="380" y="864" width="135" height="24" as="geometry"/>
        </mxCell>
        <mxCell id="b_leg_flows" value="&lt;b style=&quot;font-size:8px;color:#2563EB;&quot;&gt;&#10142; Tier Transformation Bridge&lt;/b&gt;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&lt;b style=&quot;font-size:8px;color:#DC2626;&quot;&gt;&#8674; Manual / Batch Friction (As-Is)&lt;/b&gt;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&lt;b style=&quot;font-size:8px;color:#16A34A;&quot;&gt;&#10142; Automated Cloud Flow (To-Be)&lt;/b&gt;" style="text;html=1;align=left;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="535" y="864" width="760" height="24" as="geometry"/>
        </mxCell>
        <mxCell id="b_leg_ver" value="&lt;span style=&quot;font-size:8px;color:#64748B;font-weight:600;&quot;&gt;Template 05 Master (${stageFocus.toUpperCase()}) • v2.0 — ${escapeXml(custName)}&lt;/span&gt;" style="text;html=1;align=right;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="1310" y="864" width="256" height="24" as="geometry"/>
        </mxCell>
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>`;

  return xml;
}

function compileStage1CurrentStateXml(dossier) {
  return compileTemplate05MasterDiagramXml(dossier, 'current');
}

function compileStage2TransitionBridgeXml(dossier) {
  return compileTemplate05MasterDiagramXml(dossier, 'transition');
}

function compileStage3FutureStateXml(dossier) {
  return compileTemplate05MasterDiagramXml(dossier, 'target');
}

/**
 * Compile all 3 customer-grounded architecture diagrams (Current State, Transition Bridge, Desired Future State)
 * using the canonical Template 05 3-Zone layout (Left = Current State, Middle = Transition, Right = Future State).
 */
function compileAll3GroundedDiagrams(framework = {}, metadata = {}, scores = {}) {
  const dossier = extractAssessmentTelemetry(framework, metadata, scores);
  const { custName, industry, avgCur, avgMid, avgTgt, overallDelta, targetPlatformBrand, pillars, weakest } = dossier;

  const currentStateXml = compileStage1CurrentStateXml(dossier);
  const transitionStateXml = compileStage2TransitionBridgeXml(dossier);
  const targetStateXml = compileStage3FutureStateXml(dossier);

  return {
    currentTitle: `1. Current State (As-Is) → Transition → To-Be: ${custName} (${avgCur}/5.0 Baseline Focus)`,
    currentSubtitle: `Template 05 3-Zone Blueprint • Left: As-Is (${avgCur}/5.0) • Middle: Transition (${avgMid}/5.0) • Right: To-Be (${avgTgt}/5.0) • Bottleneck: ${weakest.cleanName}`,
    curReasoning: `Template 05 3-Zone Architecture (${custName} • ${industry}): Left side maps As-Is Current State (${avgCur}/5.0) grounded in submitted scores, pain points, and verbatim assessor notes; Middle maps the 6-Pillar Transition Bridge (${avgMid}/5.0); Right maps the To-Be Future State (${avgTgt}/5.0).`,
    currentStateXml,

    transitionTitle: `2. Transition State Bridge (As-Is → Bridge → To-Be): ${custName} (${avgCur} → ${avgMid} → ${avgTgt}/5.0)`,
    transitionSubtitle: `Template 05 3-Zone Blueprint • Active Focus: Middle Transformation Bridge (${avgCur} → ${avgMid}/5.0) • Priority #1: ${weakest.cleanName}`,
    transitionReasoning: `Template 05 3-Zone Architecture (${avgCur} → ${avgMid} → ${avgTgt}/5.0): Highlights the 6-Pillar Phased Transition Bridge connecting ${custName}'s As-Is Current State on the left to the To-Be Future State on the right.`,
    transitionStateXml,

    targetTitle: `3. Desired Future State (As-Is → Transition → To-Be): ${custName} — ${targetPlatformBrand} (${avgTgt}/5.0)`,
    targetSubtitle: `Template 05 3-Zone Blueprint • Active Focus: Right To-Be Future State (${avgTgt}/5.0 • +${overallDelta} Leap) • 100% Pain Points Remediated`,
    tgtReasoning: `Template 05 3-Zone Architecture (${custName} • ${avgTgt}/5.0): Full end-to-end view with Left = Current State (${avgCur}/5.0), Middle = Transition Bridge (${avgMid}/5.0), and Right = Desired Future State (${avgTgt}/5.0) on ${targetPlatformBrand}.`,
    targetStateXml,

    transformations: pillars
      .slice()
      .sort((a, b) => a.priorityRank - b.priorityRank)
      .map(p => `[Priority #${p.priorityRank} • ${p.shortTitle} (${p.currentScore.toFixed(1)} → ${p.midScore.toFixed(1)} → ${p.futureScore.toFixed(1)}/5.0)]: Bridges ${p.hasExplicitVendorTools ? p.detectedTools.slice(0, 3).join(', ') : 'current baseline'} (remediating ${p.techPainCodes.slice(0, 2).join(' & ')}) → ${p.defaultTargetTitle}`),
    keyTransformations: pillars
      .slice()
      .sort((a, b) => a.priorityRank - b.priorityRank)
      .map(p => `[Priority #${p.priorityRank} • ${p.shortTitle} (${p.currentScore.toFixed(1)} → ${p.midScore.toFixed(1)} → ${p.futureScore.toFixed(1)}/5.0)]: Bridges ${p.hasExplicitVendorTools ? p.detectedTools.slice(0, 3).join(', ') : 'current baseline'} (remediating ${p.techPainCodes.slice(0, 2).join(' & ')}) → ${p.defaultTargetTitle}`),
    diagramCount: 3,
    diagramEngine: 'nano-banana-2',
    imageModel: 'gemini-3.1-flash-image-preview',
    modelUsed: 'Nano Banana 2 (nano-banana-2 / gemini-3.1-flash-image-preview) • Template 05 3-Zone Compiler',
    promptCanvasSource: true,
    grounded3StageCompiler: true,
    template05MasterLayout: true,
    generatedAt: new Date().toISOString()
  };
}

module.exports = {
  extractAssessmentTelemetry,
  compileTemplate05MasterDiagramXml,
  compileStage1CurrentStateXml,
  compileStage2TransitionBridgeXml,
  compileStage3FutureStateXml,
  compileAll3GroundedDiagrams
};
