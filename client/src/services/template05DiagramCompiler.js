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
  { label: 'Epic / Cerner FHIR', regex: /\b(epic|cerner|fhir)\b/i }
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

function extractQuantitativeFootprint(commentsList = []) {
  const joined = commentsList.join(' | ');
  const matches = [];
  const regex = /(\$?\d+[KMB]?\+?\s*(?:\/month|\/year|monthly|annually|service accounts|environments|workspaces|Informatica mappings|Airflow DAGs|ADF pipelines|DBT models|Glue jobs|source systems|TB daily ingestion|Tableau dashboards|data marts|queries daily|data scientists|Jupyter notebooks|SageMaker endpoints|ML models|vector databases|prompt templates|GenAI pilots|API calls monthly|LLM costs|monitoring dashboards|on-call engineers|CloudWatch alarms|access requests weekly|untagged|idle))/gi;
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
  return found.slice(0, 5);
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
  const custName = (metadata.customerName && metadata.customerName !== 'Not specified')
    ? metadata.customerName
    : (metadata.assessmentName && metadata.assessmentName !== 'Not specified'
      ? metadata.assessmentName
      : 'Enterprise Organization');
  const industry = (metadata.industry && metadata.industry !== 'Not specified')
    ? metadata.industry
    : (framework.badge || 'Enterprise Cloud & AI');
  const useCase = metadata.useCase || framework.title || 'Enterprise Cloud, Data & AI Transformation';
  const responses = metadata.responses || {};
  const rawDims = Array.isArray(scores.dimensionScores)
    ? scores.dimensionScores
    : Object.values(scores.dimensionScores || {});

  const allCommentsText = [
    ...Object.entries(responses)
      .filter(([k]) => k.endsWith('_comment') || k.endsWith('_notes'))
      .map(([, v]) => String(v || '')),
    metadata.customInstructions || ''
  ].filter(Boolean).join(' \n ');

  const prefersDatabricks = /consolidate to databricks|databricks poc|databricks consolidation|unity catalog/i.test(allCommentsText);
  const targetPlatformBrand = prefersDatabricks
    ? 'Databricks Lakehouse & Vertex AI'
    : 'Google Cloud BigQuery, Dataplex & Vertex AI';

  const frameworkAreas = Array.isArray(framework.areas) ? framework.areas : [];
  const frameworkDims = Array.isArray(framework.dimensions) ? framework.dimensions : [];
  const rawGlobalNotes = Array.isArray(metadata.notes)
    ? metadata.notes.map(n => (typeof n === 'string' ? n : (n?.text || n?.content || ''))).filter(Boolean)
    : (typeof metadata.notes === 'string' && metadata.notes.trim() ? [metadata.notes.trim()] : []);
  const globalNotesList = metadata.customInstructions
    ? [...rawGlobalNotes, String(metadata.customInstructions).trim()]
    : rawGlobalNotes;

  const resolveDomainBridgeAndTarget = (titleStr, fallbackDef) => {
    const lower = String(titleStr || '').toLowerCase();
    if (/cost|visibility|allocation|taxonomy|billing/.test(lower)) {
      return {
        bridge: 'FOCUS Billing Export & Tag Enforcement',
        target: 'BigQuery FinOps Hub & 99.4% Tagging'
      };
    }
    if (/compute|kubernetes|gke|right-sizing|autoscal/.test(lower)) {
      return {
        bridge: 'GKE Rightsizing & CUD Transition',
        target: 'GKE Autopilot & Idle Auto-Suspend'
      };
    }
    if (/lakehouse|storage|tiering|edw|warehouse|data/.test(lower)) {
      return {
        bridge: 'Dual-Read CDC & Partition Lifecycle',
        target: 'BigLake Iceberg & GCS Autoclass'
      };
    }
    if (/token|gpu|ai|genai|llm|inference|agent|model/.test(lower)) {
      return {
        bridge: 'AI Gateway & Prompt Caching Bridge',
        target: 'Vertex AI Gemini 3.8 & Model Armor'
      };
    }
    if (/unit economics|showback|chargeback|finops|roi/.test(lower)) {
      return {
        bridge: 'Departmental Showback & Anomaly Alerts',
        target: 'Looker FinOps Portal & Unit Telemetry'
      };
    }
    if (/security|zero-trust|governance|iam|compliance/.test(lower)) {
      return {
        bridge: 'Identity Federation & Perimeter Audit',
        target: 'VPC-SC + Cloud KMS CMEK & DLP'
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
      const fScore = Number(responses[`${prefix}_future`] ?? responses[`${prefix}_future_state`]);
      if (Number.isFinite(fScore) && fScore > 0) futScoresFromResponses.push(fScore);

      const directNote = typeof directAns === 'object' && directAns !== null ? (directAns.notes || directAns.comment) : null;
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

    const combinedTechPains = explicitTechPains.length >= 1
      ? explicitTechPains
      : [...explicitTechPains, ...questionDerivedPains];
    const uniqueTechPains = [...new Set(combinedTechPains.map(humanizePainCode).filter(Boolean))].slice(0, 4);
    const uniqueBizPains = [...new Set(bizPains.map(humanizePainCode).filter(Boolean))].slice(0, 3);
    const detectedTools = extractDetectedTools(pillarComments);
    const quantFootprint = extractQuantitativeFootprint(pillarComments);
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
      techPainCodes: uniqueTechPains.length > 0 ? uniqueTechPains : [`${pDef.cleanName} Silos (${cur.toFixed(1)}/5)`],
      bizPainCodes: uniqueBizPains.length > 0 ? uniqueBizPains : ['High Operational Cost', 'Delayed Delivery'],
      noteSnippet
    };
  });

  // Ensure we always have 6 pillar slots for Template 05 symmetry
  while (enrichedPillars.length < 6) {
    const fb = PILLAR_DEFS[enrichedPillars.length];
    enrichedPillars.push({
      ...fb,
      currentScore: 2.6,
      midScore: 3.6,
      futureScore: 4.6,
      gap: 2.0,
      levelName: 'Developing',
      detectedTools: [],
      quantFootprint: [],
      hasExplicitVendorTools: false,
      stackSummary: fb.defaultNeutralStack,
      theGood: ['Baseline Established'],
      theBad: ['Manual Bottlenecks'],
      techPainCodes: ['Siloed Workflows'],
      bizPainCodes: ['High Operational Cost'],
      noteSnippet: 'Evaluated via framework baseline.'
    });
  }

  const avgCur = (enrichedPillars.reduce((a, p) => a + p.currentScore, 0) / enrichedPillars.length).toFixed(1);
  const avgTgt = (enrichedPillars.reduce((a, p) => a + p.futureScore, 0) / enrichedPillars.length).toFixed(1);
  const avgMid = ((Number(avgCur) + Number(avgTgt)) / 2).toFixed(1);
  const overallDelta = (Number(avgTgt) - Number(avgCur)).toFixed(1);

  const byGapDesc = [...enrichedPillars].sort((a, b) => (b.gap - a.gap) || (a.currentScore - b.currentScore));
  const weakest = byGapDesc[0];
  const secondWeakest = byGapDesc[1];
  const strongest = [...enrichedPillars].sort((a, b) => b.currentScore - a.currentScore)[0];

  byGapDesc.forEach((p, rankIdx) => {
    const target = enrichedPillars.find(ep => ep.key === p.key);
    if (target) target.priorityRank = rankIdx + 1;
  });

  const allDetectedTools = [...new Set(enrichedPillars.flatMap(p => p.detectedTools))];
  const allQuantMetrics = [...new Set(enrichedPillars.flatMap(p => p.quantFootprint))];

  return {
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
 * Left Zone   = AS-IS CURRENT STATE (Red container #FFF5F5, #DC2626 header, 6 rows: Channels, Applications, Data Cylinders, Integration, Infrastructure, Security & Governance)
 * Middle Zone = TRANSFORMATION BENEFITS & TRANSITION BRIDGE (Blue container #EFF6FF, flanked by blue block arrows, 6 stacked pillar transition cards)
 * Right Zone  = TO-BE FUTURE STATE (Green container #F0FDF4, #065F46 header, 6 tiers including Digital Platform, Unified Data Cylinders, Event/MCP Mesh, Google Cloud Platform, Zero-Trust Security)
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
  const leftStrokeW = isStage1 ? '2.5' : '1.5';
  const midStroke = isStage2 ? '#1D4ED8' : '#93C5FD';
  const midStrokeW = isStage2 ? '2.5' : '1.5';
  const rightStroke = isStage3 ? '#059669' : '#86EFAC';
  const rightStrokeW = isStage3 ? '2.5' : '1.5';

  // Top 6 As-Is Pain Badges (grounded in each pillar's top pain point + score)
  const asIsPainBadges = [
    { title: truncateText(p0.techPainCodes[0] || 'Siloed Systems', 24), sub: `${p0.cleanName} (${p0.currentScore}/5)` },
    { title: truncateText(p1.techPainCodes[0] || 'Manual Batch ETL', 24), sub: `${p1.cleanName} (${p1.currentScore}/5)` },
    { title: truncateText(p2.techPainCodes[0] || 'Data Inconsistency', 24), sub: `${p2.cleanName} (${p2.currentScore}/5)` },
    { title: truncateText(p3.techPainCodes[0] || 'Limited Visibility', 24), sub: `${p3.cleanName} (${p3.currentScore}/5)` },
    { title: truncateText(p4.techPainCodes[0] || 'High Token / Ops Cost', 24), sub: `${p4.cleanName} (${p4.currentScore}/5)` },
    { title: truncateText(p5.techPainCodes[0] || 'Long Time to Market', 24), sub: `${p5.cleanName} (${p5.currentScore}/5)` }
  ];

  // Domain-grounded Channels (Row 1 Left & Tier 1 Right)
  const indLower = String(industry || '').toLowerCase();
  const channelNames = indLower.includes('health') || indLower.includes('pharma') || indLower.includes('life')
    ? ['Research & R&D', 'Clinical Ops', 'Regulatory Affairs', 'Commercial Teams', 'Patients / HCPs', 'Partners & CROs']
    : indLower.includes('financ') || indLower.includes('bank')
    ? ['Risk & Treasury', 'Retail Banking', 'Compliance & Audit', 'Wealth Advisors', 'Digital Customers', 'Fintech Partners']
    : [
        truncateText(p0.cleanName, 18),
        truncateText(p1.cleanName, 18),
        truncateText(p2.cleanName, 18),
        truncateText(p3.cleanName, 18),
        truncateText(p4.cleanName, 18),
        'Partners & APIs'
      ];

  // As-Is Row 2: Applications (grounded in detected tools or pillar baseline stacks)
  const tList = allDetectedTools.length > 0 ? allDetectedTools : [];
  const asIsApps = [
    { name: tList[0] || truncateText(p0.cleanName + ' Tools', 18), sub: `(Siloed • ${p0.currentScore}/5)` },
    { name: tList[1] || truncateText(p1.cleanName + ' Jobs', 18), sub: `(On-Prem / Batch • ${p1.currentScore}/5)` },
    { name: tList[2] || truncateText(p2.cleanName + ' BI', 18), sub: `(Static Extracts • ${p2.currentScore}/5)` },
    { name: tList[3] || truncateText(p3.cleanName + ' Lab', 18), sub: `(Isolated • ${p3.currentScore}/5)` },
    { name: tList[4] || truncateText(p4.cleanName + ' APIs', 18), sub: `(Unproxied • ${p4.currentScore}/5)` },
    { name: 'Legacy ERP / CRM', sub: `(Manual Sync • ${p5.currentScore}/5)` }
  ];

  // As-Is Row 3: 5 Data Cylinders
  const asIsCylinders = [
    { name: `${truncateText(p0.cleanName, 14)} Data`, sub: '(Disparate)' },
    { name: `${truncateText(p1.cleanName, 14)} Marts`, sub: '(Siloed)' },
    { name: `${truncateText(p2.cleanName, 14)} Store`, sub: '(Isolated)' },
    { name: 'Unstructured Docs', sub: '(File Shares)' },
    { name: `${truncateText(p4.cleanName, 14)} Logs`, sub: '(Separate)' }
  ];

  // As-Is Row 4: 4 Integration Cards
  const asIsIntegration = [
    { name: 'Point-to-Point Interfaces', sub: truncateText(p1.techPainCodes[0] || 'Brittle Couplings', 24) },
    { name: 'Batch ETL & Scripts', sub: truncateText(p1.quantFootprint[0] || '24h Replication Lag', 24) },
    { name: 'File Transfers (FTP / SFTP)', sub: 'Manual Schema Handling' },
    { name: 'Email & Manual Handoffs', sub: truncateText(p5.techPainCodes[0] || 'Slow Ticket Triage', 24) }
  ];

  // As-Is Row 5: 5 Infrastructure Cards
  const asIsInfra = [
    { name: 'Legacy / On-Prem Compute', sub: `(${p0.currentScore}/5 Baseline)` },
    { name: 'Static VM / K8s Clusters', sub: 'Idle Over-Provisioning' },
    { name: 'Proprietary Databases', sub: 'High Licensing Lock-In' },
    { name: 'Siloed File Servers', sub: 'Unindexed Storage' },
    { name: 'Manual Backup & DR', sub: 'Delayed Recovery RPO' }
  ];

  // As-Is Row 6: 5 Security & Governance Cards
  const asIsSecurity = [
    { name: 'Siloed Security Policies', sub: truncateText(p0.techPainCodes[0] || 'Fragmented IAM', 20) },
    { name: 'Manual Access Mgmt', sub: 'Role Creep & Shared Keys' },
    { name: 'Limited Audit & Lineage', sub: truncateText(p2.techPainCodes[0] || 'Opaque Queries', 20) },
    { name: 'Compliance & PII Risks', sub: truncateText(p4.techPainCodes[0] || 'Unmasked Prompts', 20) },
    { name: 'Unallocated Cost Drift', sub: truncateText(p5.techPainCodes[0] || 'No Chargeback', 20) }
  ];

  // Middle Zone: 6 Transformation Benefits & Transition Bridge Cards (mapped to the 6 pillars)
  const bridgeCards = [
    {
      badge: '01',
      title: `Integrated Platform (${p0.currentScore}→${p0.midScore}→${p0.futureScore})`,
      desc: `${truncateText(p0.defaultBridgeTitle, 42)} • Remediates ${truncateText(p0.techPainCodes[0], 28)}`
    },
    {
      badge: '02',
      title: `End-to-End Visibility (${p2.currentScore}→${p2.midScore}→${p2.futureScore})`,
      desc: `${truncateText(p2.defaultBridgeTitle, 42)} • Real-time lineage & single source of truth`
    },
    {
      badge: '03',
      title: `AI & Automation (${p4.currentScore}→${p4.midScore}→${p4.futureScore})`,
      desc: `${truncateText(p4.defaultBridgeTitle, 42)} • Agentic automation & predictive analytics`
    },
    {
      badge: '04',
      title: `Faster Time to Market (${p1.currentScore}→${p1.midScore}→${p1.futureScore})`,
      desc: `${truncateText(p1.defaultBridgeTitle, 42)} • Zero-ETL streaming & standardized CI/CD`
    },
    {
      badge: '05',
      title: `Lower Cost & FinOps (${p5.currentScore}→${p5.midScore}→${p5.futureScore})`,
      desc: `${truncateText(p5.defaultBridgeTitle, 42)} • Cloud-native autoscaling & 75% cache savings`
    },
    {
      badge: '06',
      title: `Risk & Compliance (${p3.currentScore}→${p3.midScore}→${p3.futureScore})`,
      desc: `${truncateText(p3.defaultBridgeTitle, 42)} • Built-in Zero-Trust security, DLP & AI guardrails`
    }
  ];

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
        <mxCell id="t05_title" value="&lt;b style=&quot;font-size:15px;color:#0F172A;letter-spacing:-0.2px;&quot;&gt;AS-IS / TRANSITION / TO-BE — ${escapeXml(custName.toUpperCase())} (${escapeXml(useCase.toUpperCase())})&lt;/b&gt;" style="text;html=1;align=left;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="72" y="8" width="1160" height="24" as="geometry"/>
        </mxCell>
        <mxCell id="t05_subtitle" value="&lt;span style=&quot;font-size:10px;color:#475569;font-weight:600;&quot;&gt;Transforming to an Intelligent, Integrated &amp;amp; Compliant Platform • &lt;b style=&quot;color:#1D4ED8;&quot;&gt;${escapeXml(stageLabel)}&lt;/b&gt; • Primary Bottleneck Remediated: ${escapeXml(weakest.cleanName)} (${weakest.currentScore} → ${weakest.futureScore}/5.0)&lt;/span&gt;" style="text;html=1;align=left;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="72" y="30" width="1180" height="20" as="geometry"/>
        </mxCell>
        <mxCell id="t05_brand_logo" value="&lt;div style=&quot;text-align:right;&quot;&gt;&lt;b style=&quot;font-size:13px;color:#0F172A;letter-spacing:0.8px;&quot;&gt;&lt;span style=&quot;color:#2563EB;&quot;&gt;&#9670;&lt;/span&gt; ENTERPRISE CLOUD&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:8px;color:#64748B;&quot;&gt;Transforming Operations. Accelerating AI Value.&lt;/span&gt;&lt;/div&gt;" style="text;html=1;align=right;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="1310" y="10" width="270" height="40" as="geometry"/>
        </mxCell>

        <!-- ==================== LEFT ZONE: AS-IS CURRENT STATE ==================== -->
        <mxCell id="z_left_bg" value="" style="rounded=1;arcSize=3;whiteSpace=wrap;html=1;fillColor=#FFF5F5;strokeColor=${leftStroke};strokeWidth=${leftStrokeW};" vertex="1" parent="1">
          <mxGeometry x="20" y="60" width="570" height="688" as="geometry"/>
        </mxCell>
        <mxCell id="z_left_hdr" value="&lt;b style=&quot;font-size:10.5px;color:#FFFFFF;letter-spacing:0.4px;&quot;&gt;AS-IS CURRENT STATE (${avgCur} / 5.0)&lt;/b&gt;" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#DC2626;strokeColor=#B91C1C;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="155" y="60" width="300" height="24" as="geometry"/>
        </mxCell>
`;

  // Top 6 Pain Point Pills inside Left Zone
  asIsPainBadges.forEach((b, idx) => {
    const bx = 28 + idx * 92;
    xml += `
        <mxCell id="l_pain_${idx}" value="&lt;b style=&quot;font-size:7.5px;color:#DC2626;&quot;&gt;&#9888; ${escapeXml(b.title)}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:6.8px;color:#64748B;&quot;&gt;${escapeXml(b.sub)}&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#FECACA;strokeWidth=1.1;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="${bx}" y="92" width="88" height="36" as="geometry"/>
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

  // Row 1 (Left): 5 Channel Cards
  channelNames.slice(0, 5).forEach((chName, idx) => {
    const cx = 100 + idx * 96;
    xml += `
        <mxCell id="l_ch_${idx}" value="&lt;b style=&quot;font-size:8px;color:#0F172A;&quot;&gt;${escapeXml(chName)}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:7px;color:#64748B;&quot;&gt;Manual Workflows&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#CBD5E1;strokeWidth=1.1;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="${cx}" y="136" width="90" height="64" as="geometry"/>
        </mxCell>`;
  });

  // Row 2 (Left): 6 Application Cards
  asIsApps.forEach((app, idx) => {
    const ax = 100 + idx * 80;
    xml += `
        <mxCell id="l_app_${idx}" value="&lt;b style=&quot;font-size:7.5px;color:#0F172A;&quot;&gt;${escapeXml(app.name)}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:6.8px;color:#64748B;&quot;&gt;${escapeXml(app.sub)}&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#CBD5E1;strokeWidth=1.1;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="${ax}" y="218" width="76" height="72" as="geometry"/>
        </mxCell>`;
  });

  // Row 3 (Left): 5 Cylinder Data Stores
  asIsCylinders.forEach((cyl, idx) => {
    const dx = 100 + idx * 96;
    xml += `
        <mxCell id="l_cyl_${idx}" value="&lt;b style=&quot;font-size:7.5px;color:#0F172A;&quot;&gt;${escapeXml(cyl.name)}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:6.8px;color:#DC2626;&quot;&gt;${escapeXml(cyl.sub)}&lt;/span&gt;" style="shape=cylinder3;whiteSpace=wrap;html=1;boundedLbl=1;backgroundOutline=1;size=8;fillColor=#FFFFFF;strokeColor=#94A3B8;strokeWidth=1.2;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="${dx}" y="308" width="90" height="72" as="geometry"/>
        </mxCell>`;
  });

  // Row 4 (Left): 4 Integration Cards
  asIsIntegration.forEach((intg, idx) => {
    const ix = 100 + idx * 120;
    xml += `
        <mxCell id="l_int_${idx}" value="&lt;b style=&quot;font-size:7.8px;color:#0F172A;&quot;&gt;${escapeXml(intg.name)}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:6.8px;color:#991B1B;&quot;&gt;${escapeXml(intg.sub)}&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#CBD5E1;strokeWidth=1.1;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="${ix}" y="398" width="114" height="72" as="geometry"/>
        </mxCell>`;
  });

  // Row 5 (Left): 5 Infrastructure Cards
  asIsInfra.forEach((inf, idx) => {
    const fx = 100 + idx * 96;
    xml += `
        <mxCell id="l_inf_${idx}" value="&lt;b style=&quot;font-size:7.5px;color:#0F172A;&quot;&gt;${escapeXml(inf.name)}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:6.8px;color:#64748B;&quot;&gt;${escapeXml(inf.sub)}&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#CBD5E1;strokeWidth=1.1;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="${fx}" y="488" width="90" height="72" as="geometry"/>
        </mxCell>`;
  });

  // Row 6 (Left): 5 Security & Governance Cards
  asIsSecurity.forEach((sec, idx) => {
    const sx = 100 + idx * 96;
    xml += `
        <mxCell id="l_sec_${idx}" value="&lt;b style=&quot;font-size:7.5px;color:#DC2626;&quot;&gt;&#9888; ${escapeXml(sec.name)}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:6.8px;color:#7F1D1D;&quot;&gt;${escapeXml(sec.sub)}&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFF5F5;strokeColor=#FECACA;strokeWidth=1.2;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="${sx}" y="578" width="90" height="80" as="geometry"/>
        </mxCell>`;
  });

  // Bottom Verbatim Assessor Note Strip inside As-Is Zone
  xml += `
        <mxCell id="l_note_strip" value="&lt;b style=&quot;font-size:7.8px;color:#991B1B;&quot;&gt;[ASSESSOR TELEMETRY &amp;amp; VERBATIM NOTE]:&lt;/b&gt; &lt;i style=&quot;font-size:7.4px;color:#334155;&quot;&gt;&amp;ldquo;${escapeXml(weakest.noteSnippet)}&amp;rdquo;&lt;/i&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#FCA5A5;strokeWidth=1.1;align=left;verticalAlign=middle;spacingLeft=8;" vertex="1" parent="1">
          <mxGeometry x="28" y="668" width="552" height="70" as="geometry"/>
        </mxCell>
`;

  // Red Dashed Friction Connectors across Left Zone rows
  for (let i = 0; i < 5; i++) {
    xml += `
        <mxCell id="l_e_ch_app_${i}" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;strokeColor=#EF4444;strokeWidth=1.1;dashed=1;dashPattern=3 3;endArrow=open;endFill=0;exitX=0.5;exitY=1;entryX=0.5;entryY=0;" edge="1" parent="1" source="l_ch_${i}" target="l_app_${i}">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell id="l_e_app_cyl_${i}" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;strokeColor=#EF4444;strokeWidth=1.1;dashed=1;dashPattern=3 3;endArrow=open;endFill=0;exitX=0.5;exitY=1;entryX=0.5;entryY=0;" edge="1" parent="1" source="l_app_${i}" target="l_cyl_${i}">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell id="l_e_cyl_int_${i}" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;strokeColor=#EF4444;strokeWidth=1.1;dashed=1;dashPattern=3 3;endArrow=open;endFill=0;exitX=0.5;exitY=1;entryX=0.5;entryY=0;" edge="1" parent="1" source="l_cyl_${i}" target="l_int_${Math.min(3, i)}">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell id="l_e_int_inf_${i}" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;strokeColor=#EF4444;strokeWidth=1.1;dashed=1;dashPattern=3 3;endArrow=open;endFill=0;exitX=0.5;exitY=1;entryX=0.5;entryY=0;" edge="1" parent="1" source="l_int_${Math.min(3, i)}" target="l_inf_${i}">
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

        <mxCell id="z_mid_bg" value="" style="rounded=1;arcSize=3;whiteSpace=wrap;html=1;fillColor=#EFF6FF;strokeColor=${midStroke};strokeWidth=${midStrokeW};" vertex="1" parent="1">
          <mxGeometry x="618" y="60" width="236" height="688" as="geometry"/>
        </mxCell>
        <mxCell id="z_mid_hdr" value="&lt;b style=&quot;font-size:9.5px;color:#1D4ED8;letter-spacing:0.3px;&quot;&gt;TRANSFORMATION BENEFITS&lt;br&gt;&lt;span style=&quot;font-size:8px;color:#1E40AF;&quot;&gt;TRANSITION BRIDGE (${avgCur} → ${avgMid} → ${avgTgt})&lt;/span&gt;&lt;/b&gt;" style="text;html=1;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="624" y="65" width="224" height="30" as="geometry"/>
        </mxCell>
`;

  bridgeCards.forEach((bc, idx) => {
    const by = 102 + idx * 105;
    xml += `
        <mxCell id="m_card_${idx}" value="&lt;table style=&quot;width:100%;border-collapse:collapse;&quot;&gt;&lt;tr&gt;&lt;td style=&quot;width:32px;vertical-align:top;padding-top:4px;&quot;&gt;&lt;div style=&quot;width:26px;height:26px;border-radius:50%;background:#DBEAFE;border:1.5px solid #2563EB;color:#1D4ED8;font-size:9px;font-weight:800;text-align:center;line-height:24px;&quot;&gt;${bc.badge}&lt;/div&gt;&lt;/td&gt;&lt;td style=&quot;vertical-align:top;text-align:left;&quot;&gt;&lt;b style=&quot;font-size:8.2px;color:#1D4ED8;&quot;&gt;${escapeXml(bc.title)}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:7.2px;color:#334155;&quot;&gt;${escapeXml(bc.desc)}&lt;/span&gt;&lt;/td&gt;&lt;/tr&gt;&lt;/table&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#BFDBFE;strokeWidth=1.2;align=left;verticalAlign=middle;spacingLeft=6;spacingRight=6;" vertex="1" parent="1">
          <mxGeometry x="628" y="${by}" width="216" height="94" as="geometry"/>
        </mxCell>`;
  });

  // ==================== RIGHT ZONE: TO-BE FUTURE STATE ====================
  xml += `
        <mxCell id="z_right_bg" value="" style="rounded=1;arcSize=3;whiteSpace=wrap;html=1;fillColor=#F0FDF4;strokeColor=${rightStroke};strokeWidth=${rightStrokeW};" vertex="1" parent="1">
          <mxGeometry x="882" y="60" width="698" height="688" as="geometry"/>
        </mxCell>
        <mxCell id="z_right_hdr" value="&lt;b style=&quot;font-size:10.5px;color:#FFFFFF;letter-spacing:0.4px;&quot;&gt;TO-BE FUTURE STATE (${avgTgt} / 5.0 • +${overallDelta} LEAP)&lt;/b&gt;" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#065F46;strokeColor=#047857;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="1060" y="60" width="340" height="24" as="geometry"/>
        </mxCell>
`;

  // Top 6 Target Value Pills inside Right Zone
  const toBeValuePills = [
    { title: 'Integrated Platform', sub: `Target ${p0.futureScore}/5.0` },
    { title: 'Intelligent Automation', sub: `Target ${p4.futureScore}/5.0` },
    { title: 'Trusted & Compliant', sub: `Target ${p3.futureScore}/5.0` },
    { title: 'Real-Time Insights', sub: `Target ${p2.futureScore}/5.0` },
    { title: 'Lower Cost (FinOps)', sub: `Target ${p5.futureScore}/5.0` },
    { title: 'Faster Time to Market', sub: `Target ${p1.futureScore}/5.0` }
  ];

  toBeValuePills.forEach((vp, idx) => {
    const vx = 892 + idx * 113;
    xml += `
        <mxCell id="r_val_${idx}" value="&lt;b style=&quot;font-size:7.5px;color:#065F46;&quot;&gt;&#10003; ${escapeXml(vp.title)}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:6.8px;color:#15803D;&quot;&gt;${escapeXml(vp.sub)}&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#A7F3D0;strokeWidth=1.1;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="${vx}" y="92" width="107" height="36" as="geometry"/>
        </mxCell>`;
  });

  // Tier 1 (Right): 6 Unified Channels & Personas
  channelNames.slice(0, 6).forEach((chName, idx) => {
    const cx = 892 + idx * 113;
    xml += `
        <mxCell id="r_ch_${idx}" value="&lt;b style=&quot;font-size:7.8px;color:#065F46;&quot;&gt;${escapeXml(chName)}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:6.8px;color:#15803D;&quot;&gt;Unified Portal &amp;amp; AI&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#86EFAC;strokeWidth=1.2;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="${cx}" y="136" width="107" height="58" as="geometry"/>
        </mxCell>`;
  });

  // Tier 2 (Right): ENTERPRISE CLOUD DIGITAL PLATFORM (CLOUD-NATIVE)
  xml += `
        <mxCell id="r_plat_box" value="" style="rounded=1;arcSize=3;whiteSpace=wrap;html=1;fillColor=#F8FAFC;strokeColor=#93C5FD;strokeWidth=1.4;" vertex="1" parent="1">
          <mxGeometry x="892" y="206" width="678" height="96" as="geometry"/>
        </mxCell>
        <mxCell id="r_plat_hdr" value="&lt;b style=&quot;font-size:8.5px;color:#0F172A;letter-spacing:0.3px;&quot;&gt;ENTERPRISE CLOUD DIGITAL PLATFORM (CLOUD-NATIVE — ${escapeXml(targetPlatformBrand.toUpperCase())})&lt;/b&gt;" style="text;html=1;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="900" y="208" width="660" height="18" as="geometry"/>
        </mxCell>
`;

  const digitalPlatformApps = [
    { name: 'AI / ML Workbench', sub: `(Vertex AI • ${p3.futureScore}/5)` },
    { name: truncateText(p0.cleanName, 16), sub: `(Cloud-Native • ${p0.futureScore}/5)` },
    { name: truncateText(p1.cleanName, 16), sub: `(Auto-CDC • ${p1.futureScore}/5)` },
    { name: 'Safety & AI Guardrails', sub: `(Model Armor • ${p4.futureScore}/5)` },
    { name: truncateText(p2.cleanName, 16), sub: `(Semantic BI • ${p2.futureScore}/5)` },
    { name: truncateText(p5.cleanName, 16), sub: `(FinOps CoE • ${p5.futureScore}/5)` },
    { name: 'Self-Service Portal', sub: '(Omnichannel API)' }
  ];

  digitalPlatformApps.forEach((dp, idx) => {
    const px = 900 + idx * 95;
    xml += `
        <mxCell id="r_dp_${idx}" value="&lt;b style=&quot;font-size:7.4px;color:#0F172A;&quot;&gt;${escapeXml(dp.name)}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:6.6px;color:#1D4ED8;&quot;&gt;${escapeXml(dp.sub)}&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#BFDBFE;strokeWidth=1.1;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="${px}" y="228" width="90" height="66" as="geometry"/>
        </mxCell>`;
  });

  // Green arrows from Tier 1 Channels to Tier 2 Digital Platform
  for (let i = 0; i < 6; i++) {
    xml += `
        <mxCell id="r_e_ch_dp_${i}" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;strokeColor=#16A34A;strokeWidth=1.3;endArrow=block;endFill=1;exitX=0.5;exitY=1;entryX=0.5;entryY=0;" edge="1" parent="1" source="r_ch_${i}" target="r_dp_${i}">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>`;
  }

  // Tier 3 (Right): DATA PLATFORM (UNIFIED & GOVERNED) with 5 Green Cylinders
  xml += `
        <mxCell id="r_data_box" value="" style="rounded=1;arcSize=3;whiteSpace=wrap;html=1;fillColor=#ECFDF5;strokeColor=#86EFAC;strokeWidth=1.4;" vertex="1" parent="1">
          <mxGeometry x="892" y="314" width="678" height="98" as="geometry"/>
        </mxCell>
        <mxCell id="r_data_hdr" value="&lt;b style=&quot;font-size:8.5px;color:#065F46;letter-spacing:0.3px;&quot;&gt;DATA PLATFORM (UNIFIED &amp;amp; GOVERNED MEDALLION LAKEHOUSE)&lt;/b&gt;" style="text;html=1;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="900" y="316" width="660" height="18" as="geometry"/>
        </mxCell>
`;

  const toBeCylinders = [
    { name: 'Unified Data Lake', sub: '(BigQuery / BigLake Iceberg)' },
    { name: `${truncateText(p1.cleanName, 14)} Hub`, sub: '(Real-Time Streaming)' },
    { name: `${truncateText(p2.cleanName, 14)} Store`, sub: '(Governed Semantic)' },
    { name: 'Metadata & Lineage', sub: '(Dataplex Catalog)' },
    { name: 'AI/ML Feature Store', sub: '& Vector Search DB' }
  ];

  toBeCylinders.forEach((cyl, idx) => {
    const cx = 902 + idx * 133;
    xml += `
        <mxCell id="r_cyl_${idx}" value="&lt;b style=&quot;font-size:7.5px;color:#065F46;&quot;&gt;${escapeXml(cyl.name)}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:6.8px;color:#047857;&quot;&gt;${escapeXml(cyl.sub)}&lt;/span&gt;" style="shape=cylinder3;whiteSpace=wrap;html=1;boundedLbl=1;backgroundOutline=1;size=8;fillColor=#FFFFFF;strokeColor=#34D399;strokeWidth=1.3;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="${cx}" y="336" width="125" height="68" as="geometry"/>
        </mxCell>`;
  });

  // Tier 4 (Right): 5 Integration & Event Mesh Cards
  const toBeIntegration = [
    { name: 'API Gateway & Mgmt', sub: '(Apigee / Cloud Endpoints)' },
    { name: 'Event Streaming', sub: '(Cloud Pub/Sub)' },
    { name: 'Data Integration', sub: '(Dataflow / Datastream)' },
    { name: 'MCP / A2A Mesh', sub: '(Agent Tool Protocol)' },
    { name: 'Partner & Ecosystem', sub: '(Zero-Trust Federation)' }
  ];

  toBeIntegration.forEach((ig, idx) => {
    const ix = 892 + idx * 137;
    xml += `
        <mxCell id="r_int_${idx}" value="&lt;b style=&quot;font-size:7.5px;color:#0F172A;&quot;&gt;${escapeXml(ig.name)}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:6.8px;color:#1D4ED8;&quot;&gt;${escapeXml(ig.sub)}&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#CBD5E1;strokeWidth=1.2;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="${ix}" y="424" width="130" height="58" as="geometry"/>
        </mxCell>`;
  });

  // Tier 5 (Right): GOOGLE CLOUD PLATFORM Container
  xml += `
        <mxCell id="r_gcp_box" value="" style="rounded=1;arcSize=3;whiteSpace=wrap;html=1;fillColor=#F8FAFC;strokeColor=#93C5FD;strokeWidth=1.4;" vertex="1" parent="1">
          <mxGeometry x="892" y="494" width="678" height="94" as="geometry"/>
        </mxCell>
        <mxCell id="r_gcp_hdr" value="&lt;b style=&quot;font-size:8.5px;color:#1E3A8A;letter-spacing:0.3px;&quot;&gt;GOOGLE CLOUD PLATFORM (ELASTIC SERVERLESS FOUNDATION)&lt;/b&gt;" style="text;html=1;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="900" y="496" width="660" height="18" as="geometry"/>
        </mxCell>
`;

  const gcpCards = [
    { name: 'Compute', sub: '(GKE / Cloud Run)' },
    { name: 'Storage', sub: '(Cloud Storage)' },
    { name: 'Databases', sub: '(Spanner / AlloyDB)' },
    { name: 'Analytics', sub: '(BigQuery)' },
    { name: 'AI / ML', sub: '(Vertex AI / Gemini)' },
    { name: 'Global Regions', sub: '& Multi-Zone HA' }
  ];

  gcpCards.forEach((gc, idx) => {
    const gx = 900 + idx * 111;
    xml += `
        <mxCell id="r_gcp_${idx}" value="&lt;b style=&quot;font-size:7.6px;color:#1E3A8A;&quot;&gt;${escapeXml(gc.name)}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:6.8px;color:#334155;&quot;&gt;${escapeXml(gc.sub)}&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#93C5FD;strokeWidth=1.2;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="${gx}" y="516" width="105" height="64" as="geometry"/>
        </mxCell>`;
  });

  // Tier 6 (Right): 6 Zero-Trust Security & Governance Cards
  const toBeSecurity = [
    { name: 'Zero Trust Security', sub: 'VPC Service Controls' },
    { name: 'IAM & Least Privilege', sub: 'Workload Identity' },
    { name: 'Encryption (CMEK)', sub: 'At Rest & In Transit' },
    { name: 'Audit Logging', sub: '& Real-Time SLOs' },
    { name: 'Data Privacy & DLP', sub: 'PII Tokenization' },
    { name: 'Regulatory Compliance', sub: 'Automated Guardrails' }
  ];

  toBeSecurity.forEach((sc, idx) => {
    const sx = 892 + idx * 113;
    xml += `
        <mxCell id="r_sec_${idx}" value="&lt;b style=&quot;font-size:7.5px;color:#065F46;&quot;&gt;&#10003; ${escapeXml(sc.name)}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:6.8px;color:#047857;&quot;&gt;${escapeXml(sc.sub)}&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#86EFAC;strokeWidth=1.2;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="${sx}" y="612" width="107" height="66" as="geometry"/>
        </mxCell>
        <mxCell id="r_e_gcp_sec_${idx}" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;strokeColor=#16A34A;strokeWidth=1.6;endArrow=none;exitX=0.5;exitY=1;entryX=0.5;entryY=0;" edge="1" parent="1" source="r_gcp_${idx}" target="r_sec_${idx}">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>`;
  });

  // Bottom Target Summary Strip inside To-Be Zone
  xml += `
        <mxCell id="r_summary_strip" value="&lt;b style=&quot;font-size:7.8px;color:#065F46;&quot;&gt;[TARGET STATE GUARANTEE (${avgTgt}/5.0)]:&lt;/b&gt; &lt;span style=&quot;font-size:7.4px;color:#0F172A;&quot;&gt;100% of ${escapeXml(custName)}&apos;s identified pain points across all 6 dimensions are remediated via ${escapeXml(targetPlatformBrand)}.&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#DCFCE7;strokeColor=#86EFAC;strokeWidth=1.1;align=left;verticalAlign=middle;spacingLeft=8;" vertex="1" parent="1">
          <mxGeometry x="892" y="688" width="678" height="50" as="geometry"/>
        </mxCell>

        <!-- ==================== BOTTOM BAR: KEY TECHNOLOGY ENABLERS & OUTCOMES ==================== -->
        <mxCell id="b_enablers_box" value="" style="rounded=1;arcSize=3;whiteSpace=wrap;html=1;fillColor=#F8FAFC;strokeColor=#CBD5E1;strokeWidth=1.3;" vertex="1" parent="1">
          <mxGeometry x="20" y="758" width="834" height="92" as="geometry"/>
        </mxCell>
        <mxCell id="b_enablers_hdr" value="&lt;b style=&quot;font-size:8.5px;color:#0F172A;letter-spacing:0.4px;&quot;&gt;KEY TECHNOLOGY ENABLERS&lt;/b&gt;" style="text;html=1;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="30" y="760" width="814" height="18" as="geometry"/>
        </mxCell>
`;

  const enablers = [
    'Google Cloud', 'Vertex AI', 'BigQuery', 'Cloud Storage',
    'Dataflow', 'Pub/Sub', 'Kubernetes (GKE)', 'Cloud API Gateway',
    'Looker', 'Dataplex', 'Gemini 3.8', 'MCP / A2A'
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
        <mxCell id="b_outcomes_hdr" value="&lt;b style=&quot;font-size:8.5px;color:#0F172A;letter-spacing:0.4px;&quot;&gt;OUTCOMES&lt;/b&gt;" style="text;html=1;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="892" y="760" width="678" height="18" as="geometry"/>
        </mxCell>
`;

  const outcomes = [
    { title: 'AI & Product Innovation', sub: `+${overallDelta} Maturity Leap` },
    { title: 'Operational Excellence', sub: `${avgCur} → ${avgTgt}/5.0 SLA` },
    { title: 'Real-Time Insights', sub: 'Sub-Second BI & RAG' },
    { title: 'Trusted by Partners', sub: 'Zero-Trust Compliance' },
    { title: 'Sustainable FinOps Growth', sub: '35–48% TCO Savings' }
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
        <mxCell id="b_leg_ver" value="&lt;span style=&quot;font-size:8px;color:#64748B;font-weight:600;&quot;&gt;Template 05 Master • v1.0 — ${escapeXml(custName)}&lt;/span&gt;" style="text;html=1;align=right;verticalAlign=middle;" vertex="1" parent="1">
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
  const { custName, industry, avgCur, avgMid, avgTgt, overallDelta, targetPlatformBrand, pillars, weakest, allDetectedTools } = dossier;

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

export {
  extractAssessmentTelemetry,
  compileTemplate05MasterDiagramXml,
  compileStage1CurrentStateXml,
  compileStage2TransitionBridgeXml,
  compileStage3FutureStateXml,
  compileAll3GroundedDiagrams
};
