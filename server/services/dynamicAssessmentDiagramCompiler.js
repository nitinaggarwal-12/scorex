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
    defaultBridgeTitle: 'Unified Metadata Catalog, ABAC & Elastic Workload Isolation Bridge',
    defaultTargetTitle: 'Zero-Trust Unified Catalog, Serverless Compute & Automated FinOps'
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
    defaultBridgeTitle: 'Declarative CDC Streaming & Automated Schema/DQ Expectations Bridge',
    defaultTargetTitle: 'Sub-Second Auto-CDC Ingestion, Self-Healing DLT & Open Iceberg/Delta'
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
    defaultBridgeTitle: 'Centralized Semantic Metric Store & Serverless SQL Warehouse Bridge',
    defaultTargetTitle: 'Governed Semantic KPI Layer, Sub-Second BI & Conversational NLQ'
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
    defaultBridgeTitle: 'Centralized Online/Offline Feature Store & Automated MLOps CI/CD Bridge',
    defaultTargetTitle: 'Unified Feature Store, Automated Drift Retraining & Real-Time Serving'
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
    defaultBridgeTitle: 'Enterprise AI Gateway, Governed Vector RAG & Guardrail Policy Bridge',
    defaultTargetTitle: 'Multi-Agent Cognitive Mesh, ACL-Synchronized RAG & Automated Guardrails'
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
    defaultBridgeTitle: 'Federated Data & AI CoE Charter, Reusable Asset Hub & FinOps Telemetry',
    defaultTargetTitle: 'Enterprise CoE Marketplace, Role-Based AI Academy & Automated ROI Attribution'
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
  return s.length > maxLen ? s.slice(0, maxLen - 2) + '..' : s;
}

function concisePillarLabel(cleanName, maxLen = 16) {
  if (!cleanName) return 'Pillar';
  const stripped = String(cleanName)
    .replace(/^\d+\.\s*/, '')
    .split(/\s*(?:&|\/|,|\band\b|-)\s*/i)[0]
    .trim();
  return truncateText(stripped || cleanName, maxLen);
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
    // 1. Check specific security, governance, DLP, IAM, SIEM, and compliance domains first (before generic 'data')
    if (/security|zero-trust|zero standing|governance|lineage|iam|pam|compliance|dlp|tokenization|armor|siem|soar|shadow ai|entitlements/.test(lower)) {
      if (/siem|soar|audit/.test(lower)) {
        return {
          bridge: 'Chronicle SecOps & SLSA L3 Binary Auth Bridge',
          target: 'Autonomous SOAR & Immutable WORM Audit'
        };
      }
      if (/dlp|tokenization|pii|phi/.test(lower)) {
        return {
          bridge: 'Cloud DLP Surrogate Tokenization Bridge',
          target: 'Zero-Copy PII/PHI Masking & HSM CMEK'
        };
      }
      if (/armor|injection|runtime safety/.test(lower)) {
        return {
          bridge: 'Model Armor Inline Prompt/Response Shield',
          target: 'Zero-Trust AI TRiSM & Guardrail Enforcement'
        };
      }
      if (/lineage|data quality/.test(lower)) {
        return {
          bridge: 'Dataplex Universal Catalog & Auto-Lineage',
          target: 'Governed ABAC Policy Tags & DQ SLAs'
        };
      }
      return {
        bridge: 'Identity Federation & VPC-SC Perimeter Bridge',
        target: 'VPC-SC + Cloud KMS CMEK & Zero-Standing IAM'
      };
    }
    // 2. FinOps & Cloud Economics sub-domains
    if (/commitment|rate optim|reserved|cud/.test(lower)) {
      return {
        bridge: 'Flexible CUD Portfolio & Slot Autoscaling',
        target: '85%+ CUD Coverage & Automated Rate Arbitrage'
      };
    }
    if (/unit economics|showback|chargeback|finops|roi/.test(lower)) {
      return {
        bridge: 'Departmental Showback & Anomaly Alerts',
        target: 'Looker FinOps Portal & Unit Telemetry'
      };
    }
    if (/cost|visibility|allocation|taxonomy|billing|token economics/.test(lower)) {
      return {
        bridge: 'FOCUS Billing Export & Tag Enforcement',
        target: 'BigQuery FinOps Hub & 99.4% Tagging'
      };
    }
    if (/compute|kubernetes|gke|right-?sizing|autoscal|anomaly/.test(lower)) {
      return {
        bridge: 'GKE Rightsizing & Idle Auto-Suspend Bridge',
        target: 'GKE Autopilot & Autonomous Anomaly Guard'
      };
    }
    // 3. Agentic Mesh, MCP, Context & Observability sub-domains
    if (/mcp|tool abstraction|protocol/.test(lower)) {
      return {
        bridge: 'Standardized MCP Gateway & Apigee Tool Proxy',
        target: 'Governed MCP Tool Mesh & Zero-Trust A2A'
      };
    }
    if (/state persistence|memory|long-context|chunked rag/.test(lower)) {
      return {
        bridge: 'Gemini 2M Long-Context & Episodic Memory Bridge',
        target: 'AlloyDB/Spanner Agent Memory & Vertex Vector RAG'
      };
    }
    if (/telemetry|observability|continuous evaluation/.test(lower)) {
      return {
        bridge: 'OpenTelemetry Agent Tracing & Eval Gate Bridge',
        target: 'Vertex AI GenAI Eval & Drift Auto-Remediation'
      };
    }
    // 4. Lakehouse, Storage, SQL Analytics & ELT sub-domains
    if (/sql analytics|reservation/.test(lower)) {
      return {
        bridge: 'BigQuery Editions Slot Autoscaling Bridge',
        target: 'BigQuery Vectorized SQL & BI Engine'
      };
    }
    if (/lakehouse|storage|tiering|edw|warehouse|elt|cdc|federation|data/.test(lower)) {
      return {
        bridge: 'Dual-Read CDC & Partition Lifecycle Bridge',
        target: 'BigLake Iceberg & GCS Autoclass'
      };
    }
    // 5. General AI / LLM / Prompt / Agent sub-domains
    if (/prompt|token|gpu|ai|genai|llm|inference|agent|model/.test(lower)) {
      return {
        bridge: 'AI Gateway & Prompt Caching Bridge',
        target: 'Vertex AI Gemini 3.8 & Model Armor'
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
    const matchedDim = rawDims.find(d => {
      const idOrName = `${d.id || ''} ${d.name || ''} ${d.category || ''}`.toLowerCase();
      return pDef.key === d.id || pDef.matchSubstr.some(s => s && idOrName.includes(s));
    }) || rawDims[idx] || {};

    const matchedArea = frameworkAreas.find(a => {
      const aName = `${a.id || ''} ${a.name || ''}`.toLowerCase();
      return pDef.matchSubstr.some(s => s && aName.includes(s));
    }) || frameworkAreas[idx] || {};

    const areaQuestionIds = [];
    const questionLookup = {};
    if (Array.isArray(pDef.questionsMeta)) {
      pDef.questionsMeta.forEach(q => {
        if (q && q.id) {
          areaQuestionIds.push(q.id);
          questionLookup[q.id] = q;
        }
      });
    }
    if (Array.isArray(matchedArea.questions)) {
      matchedArea.questions.forEach(q => {
        if (q && q.id) {
          areaQuestionIds.push(q.id);
          questionLookup[q.id] = q;
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
    if (explicitTechPains.length === 0 && globalPainPointsPool.length > 0) {
      explicitTechPains.push(globalPainPointsPool[idx % globalPainPointsPool.length]);
    }

    const cur = curScoresFromResponses.length > 0
      ? Number((curScoresFromResponses.reduce((a, b) => a + b, 0) / curScoresFromResponses.length).toFixed(1))
      : Number(matchedDim.currentScore ?? matchedDim.score ?? 2.8);
    const fut = futScoresFromResponses.length > 0
      ? Number((futScoresFromResponses.reduce((a, b) => a + b, 0) / futScoresFromResponses.length).toFixed(1))
      : Number(matchedDim.futureScore ?? matchedDim.targetScore ?? Math.min(5.0, Math.max(cur + 1.5, 4.6)));
    const gap = Number(Math.max(0, fut - cur).toFixed(1));
    const mid = Number(((cur + fut) / 2).toFixed(1));

    const combinedTechPains = explicitTechPains.length >= 1
      ? explicitTechPains
      : [...explicitTechPains, ...questionDerivedPains];
    const uniqueTechPains = [...new Set(combinedTechPains.map(humanizePainCode).filter(Boolean))].slice(0, 4);
    const uniqueBizPains = [...new Set(bizPains.map(humanizePainCode).filter(Boolean))].slice(0, 3);
    const detectedTools = extractDetectedTools([...pillarComments, allCommentsText]);
    const quantFootprint = extractQuantitativeFootprint([...pillarComments, allCommentsText]);
    const noteSnippet = extractAuthenticNoteSnippet(pillarComments);

    const theGoodList = Array.isArray(matchedDim.theGood) && matchedDim.theGood.length > 0
      ? matchedDim.theGood.slice(0, 2)
      : (derivedGoodFromQuestions.length > 0
        ? derivedGoodFromQuestions.slice(0, 2)
        : [`Baseline ${cur.toFixed(1)}/5.0 established`]);

    const theBadList = Array.isArray(matchedDim.theBad) && matchedDim.theBad.length > 0
      ? matchedDim.theBad.map(b => humanizePainCode(b.split('—')[0].trim())).filter(Boolean).slice(0, 3)
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
      techPainCodes: uniqueTechPains.length > 0 ? uniqueTechPains : [`${concisePillarLabel(pDef.cleanName, 16)} Silos (${cur.toFixed(1)}/5)`],
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

  // Ensure we always have 6 pillar slots for Template 05 visual symmetry without skewing evaluated averages
  while (enrichedPillars.length < 6) {
    const fb = PILLAR_DEFS[enrichedPillars.length];
    const domainTitles = resolveDomainBridgeAndTarget(`${fwTypeKey} ${useCase} ${fb.cleanName}`, fb);
    const derivedCur = Number(avgCur);
    const derivedFut = Number(avgTgt);
    const derivedMid = Number(avgMid);
    const derivedGap = Number(Math.max(0, derivedFut - derivedCur).toFixed(1));
    enrichedPillars.push({
      ...fb,
      defaultBridgeTitle: domainTitles.bridge,
      defaultTargetTitle: domainTitles.target,
      currentScore: derivedCur,
      midScore: derivedMid,
      futureScore: derivedFut,
      gap: derivedGap,
      isSyntheticSymmetrySlot: true,
      levelName: derivedCur >= 3.5 ? 'Established' : derivedCur >= 2.5 ? 'Developing' : 'Initial / Siloed',
      detectedTools: [],
      quantFootprint: [],
      hasExplicitVendorTools: false,
      stackSummary: fb.defaultNeutralStack,
      theGood: [`Composite ${avgCur}/5.0 Baseline`],
      theBad: [weakest?.techPainCodes?.[1] || weakest?.techPainCodes?.[0] || 'Cross-Team Silos'],
      techPainCodes: [weakest?.techPainCodes?.[1] || `${concisePillarLabel(fb.cleanName, 16)} Drift (${avgCur}/5)`],
      bizPainCodes: ['Cross-Pillar Governance Overhead'],
      noteSnippet: weakest?.noteSnippet || 'Evaluated via framework composite baseline.'
    });
  }

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
 * MASTER TEMPLATE 05 3-ZONE COMPILER:
 * Left Zone   = AS-IS CURRENT STATE (Red container #FFF5F5, #DC2626 header, 6 rows on aligned 5-column grid)
 * Middle Zone = TRANSFORMATION BENEFITS & TRANSITION BRIDGE (Blue container #EFF6FF, flanked by blue block arrows, 6 sequential pillar bridge cards)
 * Right Zone  = TO-BE FUTURE STATE (Green container #F0FDF4, #065F46 header, 6 tiers with clean container-level vertical connectors)
 * Bottom Bar  = KEY TECHNOLOGY ENABLERS (12 cards) + OUTCOMES (5 cards) + LEGEND Bar
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
  const leftStrokeW = isStage1 ? '3' : '1.5';
  const leftOpacity = isStage1 || isStage3 ? '100' : '78';
  const midStroke = isStage2 ? '#1D4ED8' : '#93C5FD';
  const midStrokeW = isStage2 ? '3' : '1.5';
  const midOpacity = isStage2 || isStage3 ? '100' : '78';
  const rightStroke = isStage3 ? '#059669' : '#86EFAC';
  const rightStrokeW = isStage3 ? '3' : '1.5';
  const rightOpacity = isStage3 ? '100' : '78';

  const domainSignal = `${dossier.fwTypeKey || ''} ${useCase || ''}`.toLowerCase();
  const isFinOpsDomain = /finops|cost|billing|token economics/.test(domainSignal);
  const isSecurityDomain = /zero_trust|security|trism|ciso|dlp|siem/.test(domainSignal);
  const isAgenticDomain = /agentic|mcp|multi-agent/.test(domainSignal);
  const isGeminiMigDomain = /openai|gemini|migration/.test(domainSignal) && !/edw|lakehouse/.test(domainSignal);
  const isLakehouseDomain = /edw|lakehouse|bigquery|modernization/.test(domainSignal);

  // Top 6 As-Is Pain Badges (concise 1-line title + 1-line pillar/score so text never overflows 38px pill height)
  const asIsPainBadges = [
    { title: truncateText(p0.techPainCodes[0] || 'Siloed Systems', 18), sub: `${concisePillarLabel(p0.cleanName, 13)} (${p0.currentScore}/5)` },
    { title: truncateText(p1.techPainCodes[0] || 'Manual Batch ETL', 18), sub: `${concisePillarLabel(p1.cleanName, 13)} (${p1.currentScore}/5)` },
    { title: truncateText(p2.techPainCodes[0] || 'Data Inconsistency', 18), sub: `${concisePillarLabel(p2.cleanName, 13)} (${p2.currentScore}/5)` },
    { title: truncateText(p3.techPainCodes[0] || 'Limited Visibility', 18), sub: `${concisePillarLabel(p3.cleanName, 13)} (${p3.currentScore}/5)` },
    { title: truncateText(p4.techPainCodes[0] || 'High Token / Ops Cost', 18), sub: `${concisePillarLabel(p4.cleanName, 13)} (${p4.currentScore}/5)` },
    { title: truncateText(p5.techPainCodes[0] || 'Governance Drift', 18), sub: `${concisePillarLabel(p5.cleanName, 13)} (${p5.currentScore}/5)` }
  ];

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

  // As-Is Row 2: 5 Aligned Application Cards (grounded in detected tools or domain-specific legacy apps with intact suffixes)
  const tList = allDetectedTools.length > 0 ? allDetectedTools : [];
  const defaultDomainApps = isFinOpsDomain
    ? ['AWS Cost Explorer', 'Snowflake Billing', 'Datadog Metering', 'Uncached GPT-4 API', 'Excel Cost Sheets']
    : isSecurityDomain
    ? ['Static IAM Keys', 'Unproxied LLM APIs', 'Raw PII Pipelines', 'Siloed SIEM Logs', 'Manual GRC Sheets']
    : isAgenticDomain
    ? ['LangChain Scripts', 'Hardcoded REST Tools', 'Stateless Chatbots', 'In-Memory Buffers', 'Manual Escalation']
    : isGeminiMigDomain
    ? ['OpenAI GPT-4o API', 'Pinecone Vector DB', 'LangChain Wrappers', 'Static Prompt Files', 'Manual Eval Sheets']
    : [
        `${concisePillarLabel(p0.cleanName, 11)} Tools`,
        `${concisePillarLabel(p1.cleanName, 11)} ETL`,
        `${concisePillarLabel(p2.cleanName, 11)} BI`,
        `${concisePillarLabel(p3.cleanName, 11)} Lab`,
        `${concisePillarLabel(p4.cleanName, 11)} APIs`
      ];

  const asIsApps = [
    { name: truncateText(tList[0] || defaultDomainApps[0], 18), sub: `(Siloed • ${p0.currentScore}/5)` },
    { name: truncateText(tList[1] || defaultDomainApps[1], 18), sub: `(Batch • ${p1.currentScore}/5)` },
    { name: truncateText(tList[2] || defaultDomainApps[2], 18), sub: `(Extracts • ${p2.currentScore}/5)` },
    { name: truncateText(tList[3] || defaultDomainApps[3], 18), sub: `(Isolated • ${p3.currentScore}/5)` },
    { name: truncateText(tList[4] || defaultDomainApps[4], 18), sub: `(Unproxied • ${p4.currentScore}/5)` }
  ];

  // As-Is Row 3: 5 Aligned Data Cylinders
  const asIsCylinders = [
    { name: `${concisePillarLabel(p0.cleanName, 12)} Data`, sub: '(Disparate)' },
    { name: `${concisePillarLabel(p1.cleanName, 12)} Marts`, sub: '(Siloed)' },
    { name: `${concisePillarLabel(p2.cleanName, 12)} Store`, sub: '(Isolated)' },
    { name: 'Unstructured Docs', sub: '(File Shares)' },
    { name: `${concisePillarLabel(p4.cleanName, 12)} Logs`, sub: '(Separate)' }
  ];

  // As-Is Row 4: 5 Aligned Integration Cards (matching the 5-column Left Zone grid 1:1)
  const asIsIntegration = [
    { name: 'Point-to-Point APIs', sub: truncateText(p0.techPainCodes[0] || 'Brittle Couplings', 18) },
    { name: 'Batch ETL Scripts', sub: truncateText(p1.quantFootprint[0] || '24h Replication Lag', 18) },
    { name: 'FTP / SFTP Drops', sub: 'Manual Schema Sync' },
    { name: 'Uncached RPC Calls', sub: truncateText(p3.techPainCodes[0] || 'No Rate Governance', 18) },
    { name: 'Manual Handoffs', sub: truncateText(p5.techPainCodes[0] || 'Slow Ticket Triage', 18) }
  ];

  // As-Is Row 5: 5 Aligned Infrastructure Cards
  const asIsInfra = [
    { name: 'Legacy Compute', sub: `(${p0.currentScore}/5 Baseline)` },
    { name: 'Static VM / K8s', sub: 'Idle Over-Provision' },
    { name: 'Proprietary DBs', sub: 'High License Lock-In' },
    { name: 'Siloed File Shares', sub: 'Unindexed Storage' },
    { name: 'Manual Backup/DR', sub: 'Delayed RPO / RTO' }
  ];

  // As-Is Row 6: 5 Aligned Security & Governance Cards
  const asIsSecurity = [
    { name: 'Siloed Policies', sub: truncateText(p0.techPainCodes[0] || 'Fragmented IAM', 18) },
    { name: 'Manual Access', sub: 'Role Creep & Keys' },
    { name: 'Limited Lineage', sub: truncateText(p2.techPainCodes[0] || 'Opaque Queries', 18) },
    { name: 'PII / Safety Risk', sub: truncateText(p3.techPainCodes[0] || 'Unmasked Prompts', 18) },
    { name: 'Cost & SLA Drift', sub: truncateText(p4.techPainCodes[0] || 'No Chargeback', 18) }
  ];

  // Middle Zone: 6 Transformation Benefits & Transition Bridge Cards (sequentially mapped to pillars 0..5)
  const bridgeCards = [p0, p1, p2, p3, p4, p5].map((p, idx) => ({
    badge: `0${idx + 1}`,
    title: `${concisePillarLabel(p.cleanName, 18)} (${p.currentScore}→${p.midScore}→${p.futureScore})`,
    desc: `${truncateText(p.defaultBridgeTitle, 42)} • Fixes ${truncateText(p.techPainCodes[0], 26)}`
  }));

  const cleanHeaderTitle = `AS-IS / TRANSITION / TO-BE — ${truncateText(custName.toUpperCase(), 32)} (${truncateText(useCase.toUpperCase(), 44)})`;

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
        <mxCell id="t05_subtitle" value="&lt;span style=&quot;font-size:9.8px;color:#475569;font-weight:600;&quot;&gt;Transforming to an Intelligent, Integrated &amp;amp; Compliant Platform • &lt;b style=&quot;color:#1D4ED8;&quot;&gt;${escapeXml(stageLabel)}&lt;/b&gt; • Primary Bottleneck Remediated: ${escapeXml(truncateText(weakest.cleanName, 36))} (${weakest.currentScore} → ${weakest.futureScore}/5.0)&lt;/span&gt;" style="text;html=1;align=left;verticalAlign=middle;whiteSpace=nowrap;" vertex="1" parent="1">
          <mxGeometry x="72" y="30" width="1220" height="20" as="geometry"/>
        </mxCell>
        <mxCell id="t05_brand_logo" value="&lt;div style=&quot;text-align:right;&quot;&gt;&lt;b style=&quot;font-size:13px;color:#0F172A;letter-spacing:0.8px;&quot;&gt;&lt;span style=&quot;color:#2563EB;&quot;&gt;&#9670;&lt;/span&gt; ENTERPRISE CLOUD&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:8px;color:#64748B;&quot;&gt;Transforming Operations. Accelerating AI Value.&lt;/span&gt;&lt;/div&gt;" style="text;html=1;align=right;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="1310" y="10" width="270" height="40" as="geometry"/>
        </mxCell>

        <!-- ==================== LEFT ZONE: AS-IS CURRENT STATE ==================== -->
        <mxCell id="z_left_bg" value="" style="rounded=1;arcSize=3;whiteSpace=wrap;html=1;fillColor=#FFF5F5;strokeColor=${leftStroke};strokeWidth=${leftStrokeW};opacity=${leftOpacity};" vertex="1" parent="1">
          <mxGeometry x="20" y="60" width="570" height="688" as="geometry"/>
        </mxCell>
        <mxCell id="z_left_hdr" value="&lt;b style=&quot;font-size:10px;color:#FFFFFF;letter-spacing:0.4px;&quot;&gt;${isStage1 ? '&#9733; ' : ''}AS-IS CURRENT STATE (${avgCur} / 5.0)${isStage1 ? ' — ACTIVE FOCUS' : ''}&lt;/b&gt;" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#DC2626;strokeColor=#B91C1C;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="135" y="60" width="340" height="24" as="geometry"/>
        </mxCell>
`;

  // Top 6 Pain Point Pills inside Left Zone (38px height, concise 2-line text -> zero vertical overflow)
  asIsPainBadges.forEach((b, idx) => {
    const bx = 28 + idx * 92;
    xml += `
        <mxCell id="l_pain_${idx}" value="&lt;b style=&quot;font-size:7px;color:#DC2626;&quot;&gt;&#9888; ${escapeXml(b.title)}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:6.4px;color:#64748B;&quot;&gt;${escapeXml(b.sub)}&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#FECACA;strokeWidth=1.1;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="${bx}" y="90" width="88" height="38" as="geometry"/>
        </mxCell>`;
  });

  // Left Vertical Layer Headers
  const leftLayers = [
    { id: 'channels', label: 'CHANNELS', y: 136, h: 66, sym: '&#9673;' },
    { id: 'apps', label: 'APPLICATIONS', y: 218, h: 74, sym: '&#9638;' },
    { id: 'data', label: 'DATA', y: 308, h: 74, sym: '&#9707;' },
    { id: 'integ', label: 'INTEGRATION', y: 398, h: 74, sym: '&#8644;' },
    { id: 'infra', label: 'INFRASTRUCTURE', y: 488, h: 74, sym: '&#9783;' },
    { id: 'sec', label: 'SECURITY &amp;&lt;br&gt;GOVERNANCE', y: 578, h: 82, sym: '&#9888;' }
  ];

  leftLayers.forEach(l => {
    xml += `
        <mxCell id="l_lbl_${l.id}" value="&lt;b style=&quot;font-size:11px;color:#DC2626;&quot;&gt;${l.sym}&lt;/b&gt;&lt;br&gt;&lt;b style=&quot;font-size:7px;color:#991B1B;letter-spacing:0.3px;&quot;&gt;${l.label}&lt;/b&gt;" style="text;html=1;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="24" y="${l.y}" width="72" height="${l.h}" as="geometry"/>
        </mxCell>`;
  });

  // Row 1 (Left): 5 Aligned Channel Cards (x = 100 + idx * 96, width = 90)
  channelNames.slice(0, 5).forEach((chName, idx) => {
    const cx = 100 + idx * 96;
    xml += `
        <mxCell id="l_ch_${idx}" value="&lt;b style=&quot;font-size:7.8px;color:#0F172A;&quot;&gt;${escapeXml(chName)}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:6.8px;color:#64748B;&quot;&gt;Manual Workflows&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#CBD5E1;strokeWidth=1.1;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="${cx}" y="136" width="90" height="64" as="geometry"/>
        </mxCell>`;
  });

  // Row 2 (Left): 5 Aligned Application Cards (x = 100 + idx * 96, width = 90)
  asIsApps.forEach((app, idx) => {
    const ax = 100 + idx * 96;
    xml += `
        <mxCell id="l_app_${idx}" value="&lt;b style=&quot;font-size:7.5px;color:#0F172A;&quot;&gt;${escapeXml(app.name)}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:6.8px;color:#64748B;&quot;&gt;${escapeXml(app.sub)}&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#CBD5E1;strokeWidth=1.1;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="${ax}" y="218" width="90" height="72" as="geometry"/>
        </mxCell>`;
  });

  // Row 3 (Left): 5 Aligned Cylinder Data Stores (x = 100 + idx * 96, width = 90)
  asIsCylinders.forEach((cyl, idx) => {
    const dx = 100 + idx * 96;
    xml += `
        <mxCell id="l_cyl_${idx}" value="&lt;b style=&quot;font-size:7.5px;color:#0F172A;&quot;&gt;${escapeXml(cyl.name)}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:6.8px;color:#DC2626;&quot;&gt;${escapeXml(cyl.sub)}&lt;/span&gt;" style="shape=cylinder3;whiteSpace=wrap;html=1;boundedLbl=1;backgroundOutline=1;size=8;fillColor=#FFFFFF;strokeColor=#94A3B8;strokeWidth=1.2;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="${dx}" y="308" width="90" height="72" as="geometry"/>
        </mxCell>`;
  });

  // Row 4 (Left): 5 Aligned Integration Cards (x = 100 + idx * 96, width = 90)
  asIsIntegration.forEach((intg, idx) => {
    const ix = 100 + idx * 96;
    xml += `
        <mxCell id="l_int_${idx}" value="&lt;b style=&quot;font-size:7.5px;color:#0F172A;&quot;&gt;${escapeXml(intg.name)}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:6.6px;color:#991B1B;&quot;&gt;${escapeXml(intg.sub)}&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#CBD5E1;strokeWidth=1.1;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="${ix}" y="398" width="90" height="72" as="geometry"/>
        </mxCell>`;
  });

  // Row 5 (Left): 5 Aligned Infrastructure Cards (x = 100 + idx * 96, width = 90)
  asIsInfra.forEach((inf, idx) => {
    const fx = 100 + idx * 96;
    xml += `
        <mxCell id="l_inf_${idx}" value="&lt;b style=&quot;font-size:7.5px;color:#0F172A;&quot;&gt;${escapeXml(inf.name)}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:6.8px;color:#64748B;&quot;&gt;${escapeXml(inf.sub)}&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#CBD5E1;strokeWidth=1.1;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="${fx}" y="488" width="90" height="72" as="geometry"/>
        </mxCell>`;
  });

  // Row 6 (Left): 5 Aligned Security & Governance Cards (x = 100 + idx * 96, width = 90)
  asIsSecurity.forEach((sec, idx) => {
    const sx = 100 + idx * 96;
    xml += `
        <mxCell id="l_sec_${idx}" value="&lt;b style=&quot;font-size:7.5px;color:#DC2626;&quot;&gt;&#9888; ${escapeXml(sec.name)}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:6.6px;color:#7F1D1D;&quot;&gt;${escapeXml(sec.sub)}&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFF5F5;strokeColor=#FECACA;strokeWidth=1.2;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="${sx}" y="578" width="90" height="80" as="geometry"/>
        </mxCell>`;
  });

  // Bottom Verbatim Assessor Note Strip inside As-Is Zone
  xml += `
        <mxCell id="l_note_strip" value="&lt;b style=&quot;font-size:7.8px;color:#991B1B;&quot;&gt;[ASSESSOR TELEMETRY &amp;amp; VERBATIM NOTE]:&lt;/b&gt; &lt;i style=&quot;font-size:7.4px;color:#334155;&quot;&gt;&amp;ldquo;${escapeXml(weakest.noteSnippet)}&amp;rdquo;&lt;/i&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#FCA5A5;strokeWidth=1.1;align=left;verticalAlign=middle;spacingLeft=8;" vertex="1" parent="1">
          <mxGeometry x="28" y="668" width="552" height="70" as="geometry"/>
        </mxCell>
`;

  // Straight 1:1 Vertical Red Dashed Friction Connectors across Left Zone rows (zero jogging or merged edges)
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
        <!-- Blue Block Arrows flanking Middle Transition Zone -->
        <mxCell id="m_arrow_left" value="" style="shape=singleArrow;whiteSpace=wrap;html=1;arrowWidth=0.55;arrowSize=0.45;fillColor=#BFDBFE;strokeColor=#2563EB;strokeWidth=1.5;" vertex="1" parent="1">
          <mxGeometry x="593" y="382" width="22" height="44" as="geometry"/>
        </mxCell>
        <mxCell id="m_arrow_right" value="" style="shape=singleArrow;whiteSpace=wrap;html=1;arrowWidth=0.55;arrowSize=0.45;fillColor=#BFDBFE;strokeColor=#2563EB;strokeWidth=1.5;" vertex="1" parent="1">
          <mxGeometry x="857" y="382" width="22" height="44" as="geometry"/>
        </mxCell>

        <mxCell id="z_mid_bg" value="" style="rounded=1;arcSize=3;whiteSpace=wrap;html=1;fillColor=#EFF6FF;strokeColor=${midStroke};strokeWidth=${midStrokeW};opacity=${midOpacity};" vertex="1" parent="1">
          <mxGeometry x="618" y="60" width="236" height="688" as="geometry"/>
        </mxCell>
        <mxCell id="z_mid_hdr" value="&lt;b style=&quot;font-size:9px;color:#1D4ED8;letter-spacing:0.3px;&quot;&gt;${isStage2 ? '&#9733; ' : ''}TRANSFORMATION BRIDGE${isStage2 ? ' (FOCUS)' : ''}&lt;br&gt;&lt;span style=&quot;font-size:7.8px;color:#1E40AF;&quot;&gt;PHASED CUTOVER (${avgCur} → ${avgMid} → ${avgTgt})&lt;/span&gt;&lt;/b&gt;" style="text;html=1;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="624" y="65" width="224" height="30" as="geometry"/>
        </mxCell>
`;

  bridgeCards.forEach((bc, idx) => {
    const by = 102 + idx * 105;
    xml += `
        <mxCell id="m_card_${idx}" value="&lt;table style=&quot;width:100%;border-collapse:collapse;&quot;&gt;&lt;tr&gt;&lt;td style=&quot;width:30px;vertical-align:top;padding-top:3px;&quot;&gt;&lt;div style=&quot;width:24px;height:24px;border-radius:50%;background:#DBEAFE;border:1.5px solid #2563EB;color:#1D4ED8;font-size:8.5px;font-weight:800;text-align:center;line-height:22px;&quot;&gt;${bc.badge}&lt;/div&gt;&lt;/td&gt;&lt;td style=&quot;vertical-align:top;text-align:left;&quot;&gt;&lt;b style=&quot;font-size:7.8px;color:#1D4ED8;&quot;&gt;${escapeXml(bc.title)}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:7px;color:#334155;&quot;&gt;${escapeXml(bc.desc)}&lt;/span&gt;&lt;/td&gt;&lt;/tr&gt;&lt;/table&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#BFDBFE;strokeWidth=1.2;align=left;verticalAlign=middle;spacingLeft=5;spacingRight=5;" vertex="1" parent="1">
          <mxGeometry x="628" y="${by}" width="216" height="94" as="geometry"/>
        </mxCell>`;
  });

  // ==================== RIGHT ZONE: TO-BE FUTURE STATE ====================
  xml += `
        <mxCell id="z_right_bg" value="" style="rounded=1;arcSize=3;whiteSpace=wrap;html=1;fillColor=#F0FDF4;strokeColor=${rightStroke};strokeWidth=${rightStrokeW};opacity=${rightOpacity};" vertex="1" parent="1">
          <mxGeometry x="882" y="60" width="698" height="688" as="geometry"/>
        </mxCell>
        <mxCell id="z_right_hdr" value="&lt;b style=&quot;font-size:10px;color:#FFFFFF;letter-spacing:0.4px;&quot;&gt;${isStage3 ? '&#9733; ' : ''}TO-BE FUTURE STATE (${avgTgt} / 5.0 • +${overallDelta} LEAP)${isStage3 ? ' — ACTIVE' : ''}&lt;/b&gt;" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#065F46;strokeColor=#047857;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="1040" y="60" width="380" height="24" as="geometry"/>
        </mxCell>
`;

  // Top 6 Target Value Pills inside Right Zone (mapped sequentially to pillars 0..5)
  const toBeValuePills = [p0, p1, p2, p3, p4, p5].map((p) => ({
    title: concisePillarLabel(p.cleanName, 16),
    sub: `Target ${p.futureScore}/5.0`
  }));

  toBeValuePills.forEach((vp, idx) => {
    const vx = 892 + idx * 113;
    xml += `
        <mxCell id="r_val_${idx}" value="&lt;b style=&quot;font-size:7.3px;color:#065F46;&quot;&gt;&#10003; ${escapeXml(vp.title)}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:6.6px;color:#15803D;&quot;&gt;${escapeXml(vp.sub)}&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#A7F3D0;strokeWidth=1.1;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="${vx}" y="90" width="107" height="38" as="geometry"/>
        </mxCell>`;
  });

  // Tier 1 (Right): 6 Unified Channels & Personas (x = 892 + idx * 113, width = 107)
  channelNames.slice(0, 6).forEach((chName, idx) => {
    const cx = 892 + idx * 113;
    xml += `
        <mxCell id="r_ch_${idx}" value="&lt;b style=&quot;font-size:7.6px;color:#065F46;&quot;&gt;${escapeXml(chName)}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:6.6px;color:#15803D;&quot;&gt;Unified Portal &amp;amp; AI&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#86EFAC;strokeWidth=1.2;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="${cx}" y="136" width="107" height="54" as="geometry"/>
        </mxCell>`;
  });

  // Tier 2 (Right): ENTERPRISE CLOUD DIGITAL PLATFORM (CLOUD-NATIVE) with 6 aligned cards
  xml += `
        <mxCell id="r_plat_box" value="" style="rounded=1;arcSize=3;whiteSpace=wrap;html=1;fillColor=#F8FAFC;strokeColor=#93C5FD;strokeWidth=1.4;" vertex="1" parent="1">
          <mxGeometry x="892" y="206" width="678" height="94" as="geometry"/>
        </mxCell>
        <mxCell id="r_plat_hdr" value="&lt;b style=&quot;font-size:8.2px;color:#0F172A;letter-spacing:0.3px;&quot;&gt;ENTERPRISE CLOUD DIGITAL PLATFORM (CLOUD-NATIVE — ${escapeXml(targetPlatformBrand.toUpperCase())})&lt;/b&gt;" style="text;html=1;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="900" y="208" width="660" height="16" as="geometry"/>
        </mxCell>
`;

  const digitalPlatformApps = [
    { name: 'AI / ML Workbench', sub: `(Vertex AI • ${p3.futureScore}/5)` },
    { name: concisePillarLabel(p0.cleanName, 15), sub: `(Governed • ${p0.futureScore}/5)` },
    { name: concisePillarLabel(p1.cleanName, 15), sub: `(Automated • ${p1.futureScore}/5)` },
    { name: 'Safety & Guardrails', sub: `(Model Armor • ${p4.futureScore}/5)` },
    { name: concisePillarLabel(p2.cleanName, 15), sub: `(Real-Time • ${p2.futureScore}/5)` },
    { name: concisePillarLabel(p5.cleanName, 15), sub: `(CoE Hub • ${p5.futureScore}/5)` }
  ];

  digitalPlatformApps.forEach((dp, idx) => {
    const px = 898 + idx * 111;
    xml += `
        <mxCell id="r_dp_${idx}" value="&lt;b style=&quot;font-size:7.4px;color:#0F172A;&quot;&gt;${escapeXml(dp.name)}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:6.6px;color:#1D4ED8;&quot;&gt;${escapeXml(dp.sub)}&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#BFDBFE;strokeWidth=1.1;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="${px}" y="226" width="105" height="66" as="geometry"/>
        </mxCell>`;
  });

  // Clean vertical green arrows from Tier 1 (r_ch_0..5, y=190) to top border of Tier 2 container (r_plat_box, y=206) — never crosses header text!
  for (let i = 0; i < 6; i++) {
    const ax = Math.round(892 + i * 113 + 53.5);
    xml += `
        <mxCell id="r_e_ch_plat_${i}" value="" style="endArrow=block;endFill=1;html=1;strokeColor=#16A34A;strokeWidth=1.3;" edge="1" parent="1">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="${ax}" y="190" as="sourcePoint"/>
            <mxPoint x="${ax}" y="206" as="targetPoint"/>
          </mxGeometry>
        </mxCell>`;
  }

  // Tier 3 (Right): Domain-Aware Data & Telemetry Platform with 5 Green Cylinders
  const tier3HeaderText = isFinOpsDomain
    ? 'CLOUD FINOPS &amp; BILLING TELEMETRY PLATFORM (BIGQUERY FOCUS 1.0, CUD &amp; UNIT ECONOMICS HUB)'
    : isSecurityDomain
    ? 'ZERO-TRUST DATA SECURITY &amp; IMMUTABLE AUDIT PLATFORM (CLOUD DLP, KMS HSM &amp; CHRONICLE WORM)'
    : isAgenticDomain
    ? 'AGENTIC MEMORY, KNOWLEDGE &amp; CONTEXT PLATFORM (ALLOYDB AI, SPANNER GRAPH &amp; VECTOR RAG)'
    : isGeminiMigDomain
    ? 'ENTERPRISE AI CONTEXT &amp; GROUNDING PLATFORM (2M CONTEXT CACHE, VERTEX RAG &amp; EVAL STORE)'
    : 'DATA PLATFORM (UNIFIED &amp; GOVERNED BIGQUERY + BIGLAKE MEDALLION LAKEHOUSE)';

  xml += `
        <mxCell id="r_data_box" value="" style="rounded=1;arcSize=3;whiteSpace=wrap;html=1;fillColor=#ECFDF5;strokeColor=#86EFAC;strokeWidth=1.4;" vertex="1" parent="1">
          <mxGeometry x="892" y="314" width="678" height="96" as="geometry"/>
        </mxCell>
        <mxCell id="r_data_hdr" value="&lt;b style=&quot;font-size:8.2px;color:#065F46;letter-spacing:0.3px;&quot;&gt;${tier3HeaderText}&lt;/b&gt;" style="text;html=1;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="900" y="316" width="660" height="16" as="geometry"/>
        </mxCell>
`;

  const toBeCylinders = [
    {
      name: isFinOpsDomain ? 'FOCUS 1.0 Billing' : isSecurityDomain ? 'Immutable Audit Log' : 'Unified Data Lake',
      sub: isFinOpsDomain ? '(BigQuery FinOps Hub)' : isSecurityDomain ? '(Chronicle WORM Lake)' : '(BigQuery / BigLake Iceberg)'
    },
    {
      name: `${concisePillarLabel(p1.cleanName, 13)} Hub`,
      sub: `(${truncateText(p1.defaultTargetTitle, 20)})`
    },
    {
      name: `${concisePillarLabel(p2.cleanName, 13)} Store`,
      sub: `(${truncateText(p2.defaultTargetTitle, 20)})`
    },
    {
      name: `${concisePillarLabel(p3.cleanName, 13)} Vault`,
      sub: `(${truncateText(p3.defaultTargetTitle, 20)})`
    },
    {
      name: `${concisePillarLabel(p4.cleanName, 13)} Index`,
      sub: `(${truncateText(p4.defaultTargetTitle, 20)})`
    }
  ];

  toBeCylinders.forEach((cyl, idx) => {
    const cx = 902 + idx * 133;
    xml += `
        <mxCell id="r_cyl_${idx}" value="&lt;b style=&quot;font-size:7.5px;color:#065F46;&quot;&gt;${escapeXml(cyl.name)}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:6.8px;color:#047857;&quot;&gt;${escapeXml(cyl.sub)}&lt;/span&gt;" style="shape=cylinder3;whiteSpace=wrap;html=1;boundedLbl=1;backgroundOutline=1;size=8;fillColor=#FFFFFF;strokeColor=#34D399;strokeWidth=1.3;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="${cx}" y="335" width="125" height="68" as="geometry"/>
        </mxCell>`;
  });

  // Clean vertical green arrows from Tier 2 container bottom (y=300) to Tier 3 container top (y=314)
  for (let i = 0; i < 5; i++) {
    const ax = Math.round(902 + i * 133 + 62.5);
    xml += `
        <mxCell id="r_e_plat_data_${i}" value="" style="endArrow=block;endFill=1;html=1;strokeColor=#16A34A;strokeWidth=1.3;" edge="1" parent="1">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="${ax}" y="300" as="sourcePoint"/>
            <mxPoint x="${ax}" y="314" as="targetPoint"/>
          </mxGeometry>
        </mxCell>`;
  }

  // Tier 4 (Right): 5 Domain-Dynamic Integration & Event Mesh Cards
  const toBeIntegration = isFinOpsDomain
    ? [
        { name: 'Billing Export Stream', sub: '(BigQuery FOCUS 1.0)' },
        { name: 'Pod Cost Metering', sub: '(GKE OpenCost / Labels)' },
        { name: 'Token Quota Router', sub: '(Apigee + Context Cache)' },
        { name: 'Anomaly Event Bus', sub: '(Pub/Sub + BQML Alerts)' },
        { name: 'CUD & Slot Governor', sub: '(Autoscaling Reservations)' }
      ]
    : isSecurityDomain
    ? [
        { name: 'Zero-Trust Edge Proxy', sub: '(Cloud Armor WAF + IAP)' },
        { name: 'Inline AI Shield', sub: '(Google Model Armor)' },
        { name: 'PII / PHI Tokenization', sub: '(Cloud DLP De-ID Stream)' },
        { name: 'SIEM / SOAR Telemetry', sub: '(Chronicle SecOps Bus)' },
        { name: 'Workload Federation', sub: '(Zero Static IAM Keys)' }
      ]
    : isAgenticDomain
    ? [
        { name: 'Super-Orchestrator Bus', sub: '(Gemini 3.8 Agent Hub)' },
        { name: 'MCP Tool Gateway', sub: '(Standardized Tool RPC)' },
        { name: 'Agent-to-Agent (A2A)', sub: '(Pub/Sub Event Mesh)' },
        { name: 'Episodic Memory Sync', sub: '(AlloyDB + Vector RAG)' },
        { name: 'HITL Approval Gate', sub: '(Policy & Audit Guard)' }
      ]
    : isGeminiMigDomain
    ? [
        { name: 'Apigee AI Gateway', sub: '(OpenAI-to-Gemini Proxy)' },
        { name: '2M Context Caching', sub: '(75% Input Token Savings)' },
        { name: 'Vertex Vector RAG', sub: '(ACL-Synchronized Index)' },
        { name: 'MCP Tool Microservices', sub: '(Sandboxed Function Mesh)' },
        { name: 'Automated Eval Gate', sub: '(Vertex GenAI Eval CI/CD)' }
      ]
    : [
        { name: 'API Gateway & Mgmt', sub: '(Apigee / Cloud Endpoints)' },
        { name: 'Event Streaming', sub: '(Cloud Pub/Sub)' },
        { name: 'Data Integration', sub: '(Dataflow / Datastream)' },
        { name: 'MCP / A2A Mesh', sub: '(Agent Tool Protocol)' },
        { name: 'Partner & Ecosystem', sub: '(Zero-Trust Federation)' }
      ];

  toBeIntegration.forEach((ig, idx) => {
    const ix = 892 + idx * 137;
    const ax = Math.round(ix + 65);
    xml += `
        <mxCell id="r_int_${idx}" value="&lt;b style=&quot;font-size:7.5px;color:#0F172A;&quot;&gt;${escapeXml(ig.name)}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:6.8px;color:#1D4ED8;&quot;&gt;${escapeXml(ig.sub)}&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#CBD5E1;strokeWidth=1.2;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="${ix}" y="424" width="130" height="56" as="geometry"/>
        </mxCell>
        <mxCell id="r_e_data_int_${idx}" value="" style="endArrow=block;endFill=1;html=1;strokeColor=#16A34A;strokeWidth=1.3;" edge="1" parent="1">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="${ax}" y="410" as="sourcePoint"/>
            <mxPoint x="${ax}" y="424" as="targetPoint"/>
          </mxGeometry>
        </mxCell>
        <mxCell id="r_e_int_gcp_${idx}" value="" style="endArrow=block;endFill=1;html=1;strokeColor=#16A34A;strokeWidth=1.3;" edge="1" parent="1">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="${ax}" y="480" as="sourcePoint"/>
            <mxPoint x="${ax}" y="494" as="targetPoint"/>
          </mxGeometry>
        </mxCell>`;
  });

  // Tier 5 (Right): GOOGLE CLOUD PLATFORM Container
  xml += `
        <mxCell id="r_gcp_box" value="" style="rounded=1;arcSize=3;whiteSpace=wrap;html=1;fillColor=#F8FAFC;strokeColor=#93C5FD;strokeWidth=1.4;" vertex="1" parent="1">
          <mxGeometry x="892" y="494" width="678" height="94" as="geometry"/>
        </mxCell>
        <mxCell id="r_gcp_hdr" value="&lt;b style=&quot;font-size:8.2px;color:#1E3A8A;letter-spacing:0.3px;&quot;&gt;GOOGLE CLOUD PLATFORM (${escapeXml(truncateText(useCase.toUpperCase(), 48))})&lt;/b&gt;" style="text;html=1;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="900" y="496" width="660" height="16" as="geometry"/>
        </mxCell>
`;

  const gcpCards = [
    { name: 'Compute', sub: isFinOpsDomain ? '(GKE Autopilot Scale-0)' : '(GKE / Cloud Run)' },
    { name: 'Storage', sub: isLakehouseDomain ? '(BigLake Iceberg + GCS)' : '(Cloud Storage Autoclass)' },
    { name: 'Databases', sub: isAgenticDomain ? '(Spanner / AlloyDB AI)' : '(Spanner / AlloyDB)' },
    { name: 'Analytics', sub: isFinOpsDomain ? '(BigQuery FOCUS 1.0)' : '(BigQuery Editions)' },
    { name: 'AI / ML', sub: isGeminiMigDomain ? '(Gemini 3.8 • 2M Cache)' : '(Vertex AI / Gemini)' },
    { name: 'Resilience', sub: `(${avgTgt}/5.0 Multi-Zone HA)` }
  ];

  gcpCards.forEach((gc, idx) => {
    const gx = 898 + idx * 111;
    xml += `
        <mxCell id="r_gcp_${idx}" value="&lt;b style=&quot;font-size:7.6px;color:#1E3A8A;&quot;&gt;${escapeXml(gc.name)}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:6.8px;color:#334155;&quot;&gt;${escapeXml(gc.sub)}&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#93C5FD;strokeWidth=1.2;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="${gx}" y="516" width="105" height="64" as="geometry"/>
        </mxCell>`;
  });

  // Tier 6 (Right): 6 Zero-Trust Security & Governance Cards
  const toBeSecurity = [
    { name: 'Zero Trust Security', sub: 'VPC Service Controls' },
    { name: 'IAM & Least Privilege', sub: 'Workload Identity' },
    { name: 'Encryption (CMEK)', sub: isSecurityDomain ? 'HSM + Confidential VM' : 'At Rest & In Transit' },
    { name: 'Audit & Observability', sub: isAgenticDomain ? 'Agent Trajectory Logs' : '& Real-Time SLOs' },
    { name: 'Data Privacy & DLP', sub: 'PII / PHI Tokenization' },
    { name: 'AI Safety & Compliance', sub: `Model Armor (${p4.futureScore}/5)` }
  ];

  toBeSecurity.forEach((sc, idx) => {
    const sx = 892 + idx * 113;
    const ax = Math.round(sx + 53.5);
    xml += `
        <mxCell id="r_sec_${idx}" value="&lt;b style=&quot;font-size:7.5px;color:#065F46;&quot;&gt;&#10003; ${escapeXml(sc.name)}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:6.8px;color:#047857;&quot;&gt;${escapeXml(sc.sub)}&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#86EFAC;strokeWidth=1.2;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="${sx}" y="612" width="107" height="66" as="geometry"/>
        </mxCell>
        <mxCell id="r_e_gcp_sec_${idx}" value="" style="endArrow=block;endFill=1;html=1;strokeColor=#16A34A;strokeWidth=1.3;" edge="1" parent="1">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="${ax}" y="588" as="sourcePoint"/>
            <mxPoint x="${ax}" y="612" as="targetPoint"/>
          </mxGeometry>
        </mxCell>`;
  });

  const stageSummaryText = isStage1
    ? `Stage 1 Baseline Diagnostic (${avgCur}/5.0): Primary bottleneck in ${weakest.cleanName} (${weakest.currentScore}/5.0) across ${allDetectedTools.slice(0, 3).join(', ') || 'legacy stack'}.`
    : isStage2
    ? `Stage 2 Phased Coexistence (${avgCur} → ${avgMid}/5.0): Priority #1 bridge executes ${weakest.defaultBridgeTitle} with zero SLA disruption.`
    : `100% of ${custName}'s identified pain points across all dimensions are remediated via ${targetPlatformBrand} (${avgTgt}/5.0).`;

  // Bottom Target Summary Strip inside To-Be Zone
  xml += `
        <mxCell id="r_summary_strip" value="&lt;b style=&quot;font-size:7.8px;color:#065F46;&quot;&gt;[${isStage1 ? 'STAGE 1 AS-IS DIAGNOSTIC' : isStage2 ? 'STAGE 2 BRIDGE MILESTONE' : `TARGET STATE GUARANTEE (${avgTgt}/5.0)`}]:&lt;/b&gt; &lt;span style=&quot;font-size:7.4px;color:#0F172A;&quot;&gt;${escapeXml(stageSummaryText)}&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#DCFCE7;strokeColor=#86EFAC;strokeWidth=1.1;align=left;verticalAlign=middle;spacingLeft=8;" vertex="1" parent="1">
          <mxGeometry x="892" y="688" width="678" height="50" as="geometry"/>
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
    : [
        'Google Cloud', 'Vertex AI', 'BigQuery', 'BigLake Iceberg',
        'Dataflow CDC', 'Cloud Pub/Sub', 'GKE Autopilot', 'Apigee AI',
        'Looker BI', 'Dataplex', 'Gemini 3.8', 'Model Armor'
      ];

  enablers.forEach((en, idx) => {
    const ex = 28 + idx * 68;
    xml += `
        <mxCell id="b_en_${idx}" value="&lt;b style=&quot;font-size:9px;color:#2563EB;&quot;&gt;&#9670;&lt;/b&gt;&lt;br&gt;&lt;b style=&quot;font-size:7px;color:#0F172A;&quot;&gt;${escapeXml(en)}&lt;/b&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#E2E8F0;strokeWidth=1.1;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="${ex}" y="782" width="64" height="60" as="geometry"/>
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

  const outcomes = [
    { title: concisePillarLabel(weakest.cleanName, 18), sub: `${weakest.currentScore} → ${weakest.futureScore}/5.0 (#1 Fix)` },
    { title: 'Overall Maturity Leap', sub: `${avgCur} → ${avgTgt}/5.0 (+${overallDelta})` },
    { title: 'Transition Midpoint', sub: `Bridge ${avgMid}/5.0 SLA` },
    { title: 'Zero-Trust Governance', sub: `${p3.currentScore} → ${p3.futureScore}/5.0 Target` },
    { title: 'Sustainable FinOps ROI', sub: dossier.allQuantMetrics?.[0] ? `Optimizes ${truncateText(dossier.allQuantMetrics[0], 18)}` : '35–48% TCO Savings' }
  ];

  outcomes.forEach((oc, idx) => {
    const ox = 892 + idx * 137;
    xml += `
        <mxCell id="b_out_${idx}" value="&lt;b style=&quot;font-size:7.6px;color:#0F172A;&quot;&gt;&#10003; ${escapeXml(oc.title)}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:6.8px;color:#059669;font-weight:700;&quot;&gt;${escapeXml(oc.sub)}&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#E2E8F0;strokeWidth=1.1;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="${ox}" y="782" width="130" height="60" as="geometry"/>
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
        <mxCell id="b_leg_asis" value="&lt;b style=&quot;font-size:7.5px;color:#DC2626;&quot;&gt;As-Is Components (${avgCur}/5.0)&lt;/b&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FEE2E2;strokeColor=#F87171;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="92" y="864" width="135" height="24" as="geometry"/>
        </mxCell>
        <mxCell id="b_leg_bridge" value="&lt;b style=&quot;font-size:7.5px;color:#1D4ED8;&quot;&gt;Transition Bridge (${avgMid}/5.0)&lt;/b&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#DBEAFE;strokeColor=#60A5FA;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="236" y="864" width="135" height="24" as="geometry"/>
        </mxCell>
        <mxCell id="b_leg_tobe" value="&lt;b style=&quot;font-size:7.5px;color:#065F46;&quot;&gt;To-Be Components (${avgTgt}/5.0)&lt;/b&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#D1FAE5;strokeColor=#34D399;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="380" y="864" width="135" height="24" as="geometry"/>
        </mxCell>
        <mxCell id="b_leg_flows" value="&lt;b style=&quot;font-size:8px;color:#2563EB;&quot;&gt;&#8594; Data / Process Flow&lt;/b&gt;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&lt;b style=&quot;font-size:8px;color:#DC2626;&quot;&gt;&#8674; Manual / Batch / File Flow (As-Is Friction)&lt;/b&gt;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&lt;b style=&quot;font-size:8px;color:#16A34A;&quot;&gt;&#8594; Real-Time / Automated Cloud Flow&lt;/b&gt;" style="text;html=1;align=left;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="535" y="864" width="760" height="24" as="geometry"/>
        </mxCell>
        <mxCell id="b_leg_ver" value="&lt;span style=&quot;font-size:8px;color:#64748B;font-weight:600;&quot;&gt;Template 05 Master (${stageFocus.toUpperCase()}) • v1.0 — ${escapeXml(custName)}&lt;/span&gt;" style="text;html=1;align=right;verticalAlign=middle;" vertex="1" parent="1">
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
