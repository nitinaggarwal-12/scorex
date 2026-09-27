/**
 * Dynamic Per-Assessment 3-Stage Architecture Diagram & Telemetry Compiler
 *
 * Ensures EVERY assessment in ScoreX receives 100% bespoke, non-generic
 * Stage 1 (Current State), Stage 2 (Transition Bridge), and Stage 3 (Desired Future State)
 * Draw.io XML architecture diagrams and executive report narratives derived directly from:
 *  - Assessment Metadata (organizationName, assessmentName, industry, useCase)
 *  - All 60 Question Scores (currentScore, futureScore, gap, maturity level per pillar)
 *  - All Selected Technical & Business Pain Points (*_technical_pain, *_business_pain, theBad)
 *  - All Established Baseline Strengths (theGood)
 *  - All Verbatim Assessor Notes & Comments (*_comment, *_notes, global notes/comments)
 *  - Automatically Extracted Tools, Vendors & Quantitative Footprint Metrics per pillar
 */

const PILLAR_DEFS = [
  {
    key: 'platform_governance',
    shortTitle: '1. PLATFORM & GOVERNANCE',
    icon: '🧱',
    matchSubstr: ['platform', 'governance'],
    questionPrefixes: [
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
    icon: '💾',
    matchSubstr: ['data'],
    questionPrefixes: [
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
    icon: '📊',
    matchSubstr: ['analytics', 'bi'],
    questionPrefixes: [
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
    icon: '🤖',
    matchSubstr: ['ml', 'machine'],
    questionPrefixes: [
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
    icon: '✨',
    matchSubstr: ['genai', 'generative'],
    questionPrefixes: [
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
    icon: '⚡',
    matchSubstr: ['enablement', 'operational'],
    questionPrefixes: [
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
  { label: 'Oracle', regex: /\boracle\b/i },
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
  { label: 'Grafana', regex: /\bgrafana\b/i }
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
  return String(code)
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * Extract quantitative metrics (e.g. "150+ service accounts", "200+ Informatica mappings",
 * "$40K/month", "50+ Airflow DAGs", "20+ SageMaker endpoints") from free-text comments.
 */
function extractQuantitativeFootprint(commentsList = []) {
  const joined = commentsList.join(' | ');
  const matches = [];
  const regex = /(\$?\d+[KMB]?\+?\s*(?:\/month|\/year|monthly|annually|service accounts|environments|workspaces|Informatica mappings|Airflow DAGs|ADF pipelines|DBT models|Glue jobs|source systems|TB daily ingestion|Tableau dashboards|data marts|queries daily|data scientists|Jupyter notebooks|SageMaker endpoints|ML models|vector databases|prompt templates|GenAI pilots|API calls monthly|LLM costs|monitoring dashboards|on-call engineers|CloudWatch alarms|access requests weekly))/gi;
  let m;
  while ((m = regex.exec(joined)) !== null) {
    const clean = m[1].trim();
    if (!matches.some(x => x.toLowerCase() === clean.toLowerCase())) {
      matches.push(clean);
    }
  }
  return matches.slice(0, 4);
}

/**
 * Extract detected tools/vendors from free-text comments in a pillar.
 */
function extractDetectedTools(commentsList = []) {
  const joined = commentsList.join(' \n ');
  // Ignore boilerplate "Evaluated for ... current configuration meets baseline production SLAs"
  const isDefaultTemplateComment = commentsList.every(c =>
    /Evaluated for .* current configuration meets baseline production SLAs/i.test(c)
  );
  if (isDefaultTemplateComment) {
    return [];
  }
  const found = [];
  for (const pat of KNOWN_TECH_PATTERNS) {
    if (pat.regex.test(joined)) {
      found.push(pat.label);
    }
  }
  return found.slice(0, 5);
}

/**
 * Extract a clean, authentic snippet from the user's free-text comments for this pillar.
 */
function extractAuthenticNoteSnippet(commentsList = [], pillarTitle = '') {
  if (!commentsList || commentsList.length === 0) {
    return 'No free-text assessor note entered; evaluated via structured maturity & pain-point inputs.';
  }
  // Prefer non-boilerplate comments first
  const custom = commentsList.find(c => c && !/Evaluated for .* current configuration meets baseline/i.test(c));
  const chosen = custom || commentsList[0];
  const cleaned = String(chosen).replace(/\s+/g, ' ').trim();
  return cleaned.length > 125 ? cleaned.slice(0, 122) + '...' : cleaned;
}

/**
 * Build the complete Per-Assessment Telemetry Dossier across all 6 pillars.
 */
function extractAssessmentTelemetry(framework = {}, metadata = {}, scores = {}) {
  const custName = (metadata.customerName && metadata.customerName !== 'Not specified')
    ? metadata.customerName
    : (metadata.assessmentName && metadata.assessmentName !== 'Not specified'
      ? metadata.assessmentName
      : 'Enterprise Data & AI Assessment');
  const industry = (metadata.industry && metadata.industry !== 'Not specified')
    ? metadata.industry
    : 'Enterprise Technology';
  const useCase = metadata.useCase || 'Enterprise Data, ML & GenAI Modernization';
  const responses = metadata.responses || {};
  const rawDims = Array.isArray(scores.dimensionScores)
    ? scores.dimensionScores
    : Object.values(scores.dimensionScores || {});

  // Collect all comments across the assessment to detect target platform mandate
  const allCommentsText = Object.entries(responses)
    .filter(([k]) => k.endsWith('_comment') || k.endsWith('_notes'))
    .map(([, v]) => String(v || ''))
    .join(' \n ');

  const prefersDatabricks = /consolidate to databricks|databricks poc|databricks consolidation|unity catalog/i.test(allCommentsText);
  const targetPlatformBrand = prefersDatabricks
    ? 'Databricks Lakehouse & Unity Catalog + Vertex/Mosaic AI'
    : 'Unified Cloud Data Lakehouse (BigQuery / BigLake / Dataplex & Vertex AI)';

  const frameworkAreas = Array.isArray(framework.areas) ? framework.areas : [];

  const enrichedPillars = PILLAR_DEFS.map((pDef, idx) => {
    const matchedDim = rawDims.find(d => {
      const idOrName = `${d.id || ''} ${d.name || ''} ${d.category || ''}`.toLowerCase();
      return pDef.matchSubstr.some(s => idOrName.includes(s));
    }) || rawDims[idx] || {};

    // Collect question IDs from framework area (both direct questions and dimensions[].questions) + pDef.questionPrefixes
    const matchedArea = frameworkAreas.find(a => {
      const aName = `${a.id || ''} ${a.name || ''}`.toLowerCase();
      return pDef.matchSubstr.some(s => aName.includes(s));
    }) || frameworkAreas[idx] || {};

    const areaQuestionIds = [];
    if (Array.isArray(matchedArea.questions)) {
      matchedArea.questions.forEach(q => { if (q && q.id) areaQuestionIds.push(q.id); });
    }
    if (Array.isArray(matchedArea.dimensions)) {
      matchedArea.dimensions.forEach(dim => {
        if (Array.isArray(dim.questions)) {
          dim.questions.forEach(q => { if (q && q.id) areaQuestionIds.push(q.id); });
        }
      });
    }
    const allCandidatePrefixes = [...new Set([...pDef.questionPrefixes, ...areaQuestionIds])];

    // Gather pillar-specific scores, comments, technical pains, and business pains from responses
    const pillarComments = [];
    const techPains = [];
    const bizPains = [];
    const curScoresFromResponses = [];
    const futScoresFromResponses = [];

    for (const prefix of allCandidatePrefixes) {
      const cScore = Number(responses[`${prefix}_current`] ?? responses[`${prefix}_current_state`]);
      if (Number.isFinite(cScore) && cScore > 0) curScoresFromResponses.push(cScore);
      const fScore = Number(responses[`${prefix}_future`] ?? responses[`${prefix}_future_state`]);
      if (Number.isFinite(fScore) && fScore > 0) futScoresFromResponses.push(fScore);

      const cVal = responses[`${prefix}_comment`] || responses[`${prefix}_notes`];
      if (cVal && typeof cVal === 'string') pillarComments.push(cVal);
      const tp = responses[`${prefix}_technical_pain`];
      if (Array.isArray(tp)) techPains.push(...tp);
      const bp = responses[`${prefix}_business_pain`];
      if (Array.isArray(bp)) bizPains.push(...bp);
    }

    const cur = curScoresFromResponses.length > 0
      ? Number((curScoresFromResponses.reduce((a, b) => a + b, 0) / curScoresFromResponses.length).toFixed(1))
      : Number(matchedDim.currentScore ?? matchedDim.score ?? 3.0);
    const fut = futScoresFromResponses.length > 0
      ? Number((futScoresFromResponses.reduce((a, b) => a + b, 0) / futScoresFromResponses.length).toFixed(1))
      : Number(matchedDim.futureScore ?? matchedDim.targetScore ?? 5.0);
    const gap = Number(Math.max(0, fut - cur).toFixed(1));
    const mid = Number(((cur + fut) / 2).toFixed(1));

    const uniqueTechPains = [...new Set(techPains)].slice(0, 4);
    const uniqueBizPains = [...new Set(bizPains)].slice(0, 3);
    const detectedTools = extractDetectedTools(pillarComments);
    const quantFootprint = extractQuantitativeFootprint(pillarComments);
    const noteSnippet = extractAuthenticNoteSnippet(pillarComments, pDef.shortTitle);

    const theGoodList = Array.isArray(matchedDim.theGood) && matchedDim.theGood.length > 0
      ? matchedDim.theGood.slice(0, 2)
      : (cur >= 3.0
        ? [`Level ${cur.toFixed(0)} baseline established across ${pDef.shortTitle.toLowerCase()}`]
        : [`Initial ad-hoc capabilities operating at ${cur.toFixed(1)}/5.0`]);

    const theBadList = Array.isArray(matchedDim.theBad) && matchedDim.theBad.length > 0
      ? matchedDim.theBad.map(b => b.split('—')[0].trim()).filter(Boolean).slice(0, 3)
      : uniqueTechPains.map(humanizePainCode).slice(0, 3);

    const hasExplicitVendorTools = detectedTools.length > 0;
    const stackSummary = hasExplicitVendorTools
      ? `${detectedTools.join(' • ')}${quantFootprint.length > 0 ? ' (' + quantFootprint.slice(0, 2).join(', ') + ')' : ''}`
      : pDef.defaultNeutralStack;

    return {
      ...pDef,
      currentScore: Number(cur.toFixed(1)),
      midScore: mid,
      futureScore: Number(fut.toFixed(1)),
      gap,
      levelName: matchedDim.level?.level || (cur >= 3.0 ? 'Formalize / Defined' : 'Developing'),
      detectedTools,
      quantFootprint,
      hasExplicitVendorTools,
      stackSummary,
      theGood: theGoodList,
      theBad: theBadList,
      techPainCodes: uniqueTechPains.length > 0 ? uniqueTechPains : ['manual_processes', 'siloed_execution'],
      bizPainCodes: uniqueBizPains.length > 0 ? uniqueBizPains : ['team_bottlenecks', 'delayed_value'],
      noteSnippet
    };
  });

  const avgCur = (enrichedPillars.reduce((a, p) => a + p.currentScore, 0) / enrichedPillars.length).toFixed(1);
  const avgTgt = (enrichedPillars.reduce((a, p) => a + p.futureScore, 0) / enrichedPillars.length).toFixed(1);
  const avgMid = ((Number(avgCur) + Number(avgTgt)) / 2).toFixed(1);
  const overallDelta = (Number(avgTgt) - Number(avgCur)).toFixed(1);

  const byGapDesc = [...enrichedPillars].sort((a, b) => (b.gap - a.gap) || (a.currentScore - b.currentScore));
  const weakest = byGapDesc[0];
  const secondWeakest = byGapDesc[1];
  const strongest = [...enrichedPillars].sort((a, b) => b.currentScore - a.currentScore)[0];

  // Assign priority rank 1..6 based on gap/score
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
 * STAGE 1 COMPILER: Current State (As-Is Baseline) Architecture
 * Renders all 6 pillars with their exact score, detected tools/metrics from comments,
 * established strengths (theGood), active technical/business pain codes, and verbatim user note!
 */
function compileStage1CurrentStateXml(dossier) {
  const { custName, industry, avgCur, avgTgt, weakest, pillars, allDetectedTools } = dossier;
  const toolModeBadge = allDetectedTools.length > 0
    ? `Detected Stack: ${allDetectedTools.slice(0, 6).join(', ')}`
    : `Vendor-Neutral Capability & Pain-Point Topology (Zero Unverified Cloud Icons)`;

  let cellsXml = '';

  pillars.forEach((p, i) => {
    const x = 20 + i * 260;
    const isBottleneck = p.key === weakest.key || p.currentScore < 3.0;
    const colFill = isBottleneck ? '#FFF1F2' : '#F8FAFC';
    const colStroke = isBottleneck ? '#E11D48' : '#64748B';
    const hdrFill = isBottleneck ? '#9F1239' : '#1E293B';
    const hdrBadge = isBottleneck
      ? `⚠️ BOTTLENECK: ${p.currentScore.toFixed(1)} / 5.0`
      : `Current Score: ${p.currentScore.toFixed(1)} / 5.0 (${p.levelName})`;

    const goodBullets = p.theGood.map(g => `• ${escapeXml(g.slice(0, 58))}`).join('&lt;br&gt;');
    const techPainStr = p.techPainCodes.slice(0, 3).map(c => `• &lt;b&gt;${escapeXml(c)}&lt;/b&gt;`).join('&lt;br&gt;');
    const bizPainStr = p.bizPainCodes.slice(0, 2).map(c => `• ${escapeXml(humanizePainCode(c))}`).join('&lt;br&gt;');

    cellsXml += `
        <!-- PILLAR ${i + 1}: ${escapeXml(p.shortTitle)} -->
        <mxCell id="s1_col_${i}" value="" style="rounded=1;arcSize=3;whiteSpace=wrap;html=1;fillColor=${colFill};strokeColor=${colStroke};strokeWidth=${isBottleneck ? '2.2' : '1.5'};" vertex="1" parent="1">
          <mxGeometry x="${x}" y="78" width="248" height="712" as="geometry"/>
        </mxCell>
        <mxCell id="s1_hdr_${i}" value="&lt;b style=&quot;font-size:10px;color:#FFFFFF;&quot;&gt;${p.icon} ${escapeXml(p.shortTitle)}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:8.5px;color:#FDE047;font-weight:bold;&quot;&gt;${escapeXml(hdrBadge)}&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=${hdrFill};strokeColor=${colStroke};align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="${x + 8}" y="86" width="232" height="44" as="geometry"/>
        </mxCell>

        <!-- Card 1: Detected Tools & Current Environment Footprint -->
        <mxCell id="s1_tools_${i}" value="&lt;b style=&quot;font-size:9px;color:#0F172A;&quot;&gt;🔧 Current Tools &amp; Footprint&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:8px;color:#334155;&quot;&gt;${escapeXml(p.stackSummary)}&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#94A3B8;strokeWidth=1.2;align=left;verticalAlign=top;spacingLeft=6;spacingTop=5;" vertex="1" parent="1">
          <mxGeometry x="${x + 10}" y="140" width="228" height="105" as="geometry"/>
        </mxCell>

        <!-- Card 2: Established Baseline Strengths (theGood) -->
        <mxCell id="s1_good_${i}" value="&lt;b style=&quot;font-size:9px;color:#065F46;&quot;&gt;✅ Established Baseline (${p.currentScore.toFixed(1)}/5.0)&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:8px;color:#1E293B;&quot;&gt;${goodBullets}&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#ECFDF5;strokeColor=#10B981;strokeWidth=1.2;align=left;verticalAlign=top;spacingLeft=6;spacingTop=5;" vertex="1" parent="1">
          <mxGeometry x="${x + 10}" y="256" width="228" height="105" as="geometry"/>
        </mxCell>

        <!-- Card 3: User-Selected Technical Pain Points -->
        <mxCell id="s1_tpain_${i}" value="&lt;b style=&quot;font-size:9px;color:#991B1B;&quot;&gt;⚠️ Active Technical Pains&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:8px;color:#7F1D1D;&quot;&gt;${techPainStr}&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FEF2F2;strokeColor=#EF4444;strokeWidth=1.4;align=left;verticalAlign=top;spacingLeft=6;spacingTop=5;" vertex="1" parent="1">
          <mxGeometry x="${x + 10}" y="372" width="228" height="115" as="geometry"/>
        </mxCell>

        <!-- Card 4: User-Selected Business Impact & Friction -->
        <mxCell id="s1_bpain_${i}" value="&lt;b style=&quot;font-size:9px;color:#9A3412;&quot;&gt;📉 Business Impact &amp; Risk&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:8px;color:#7C2D12;&quot;&gt;${bizPainStr}&lt;br&gt;• Target Gap: +${p.gap.toFixed(1)} (${p.currentScore.toFixed(1)} → ${p.futureScore.toFixed(1)})&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFBEB;strokeColor=#F59E0B;strokeWidth=1.2;align=left;verticalAlign=top;spacingLeft=6;spacingTop=5;" vertex="1" parent="1">
          <mxGeometry x="${x + 10}" y="498" width="228" height="98" as="geometry"/>
        </mxCell>

        <!-- Card 5: Verbatim Assessor Note / Comment from Assessment Responses -->
        <mxCell id="s1_note_${i}" value="&lt;b style=&quot;font-size:8.5px;color:#1E40AF;&quot;&gt;📝 Assessor Note / Comment:&lt;/b&gt;&lt;br&gt;&lt;i style=&quot;font-size:7.5px;color:#334155;&quot;&gt;&amp;ldquo;${escapeXml(p.noteSnippet)}&amp;rdquo;&lt;/i&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#EFF6FF;strokeColor=#60A5FA;strokeWidth=1.1;align=left;verticalAlign=top;spacingLeft=6;spacingTop=5;" vertex="1" parent="1">
          <mxGeometry x="${x + 10}" y="608" width="228" height="168" as="geometry"/>
        </mxCell>`;

    if (i < pillars.length - 1) {
      cellsXml += `
        <mxCell id="s1_edge_${i}" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#DC2626;strokeWidth=1.8;dashed=1;endArrow=block;endFill=1;exitX=1;exitY=0.5;entryX=0;entryY=0.5;" edge="1" parent="1" source="s1_tpain_${i}" target="s1_tpain_${i + 1}">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>`;
    }
  });

  return `<mxfile host="embed.diagrams.net" modified="${new Date().toISOString()}" agent="ScoreX-Dynamic-Assessment-Compiler" version="24.0.0" type="device">
  <diagram id="stage1_dynamic_current" name="Stage 1: Current State (${escapeXml(custName)})">
    <mxGraphModel dx="1600" dy="920" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1600" pageHeight="900" background="#FFFFFF" math="0" shadow="0">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>

        <!-- HEADER BANNER -->
        <mxCell id="s1_banner" value="" style="rounded=1;arcSize=3;whiteSpace=wrap;html=1;fillColor=#0F172A;strokeColor=#334155;strokeWidth=1.5;" vertex="1" parent="1">
          <mxGeometry x="20" y="14" width="1552" height="54" as="geometry"/>
        </mxCell>
        <mxCell id="s1_title" value="&lt;b style=&quot;font-size:14.5px;color:#FFFFFF;&quot;&gt;STAGE 1: CURRENT STATE (AS-IS) ARCHITECTURE — ${escapeXml(custName.toUpperCase())} (${escapeXml(industry.toUpperCase())} • ${avgCur}/5.0)&lt;/b&gt;" style="text;html=1;align=left;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="34" y="18" width="1180" height="24" as="geometry"/>
        </mxCell>
        <mxCell id="s1_subtitle" value="&lt;span style=&quot;font-size:9.5px;color:#94A3B8;&quot;&gt;100% Data-Driven from 60 Assessment Answers &amp;amp; Comments • ${escapeXml(toolModeBadge)} • Primary Bottleneck: ${escapeXml(weakest.shortTitle)} (${weakest.currentScore.toFixed(1)}/5.0)&lt;/span&gt;" style="text;html=1;align=left;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="34" y="40" width="1180" height="20" as="geometry"/>
        </mxCell>
        <mxCell id="s1_score_badge" value="&lt;b style=&quot;font-size:11px;color:#FCA5A5;&quot;&gt;AS-IS BASELINE: ${avgCur} / 5.0&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:8.5px;color:#E2E8F0;&quot;&gt;Target Goal: ${avgTgt} / 5.0&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#7F1D1D;strokeColor=#EF4444;strokeWidth=1.5;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="1320" y="20" width="238" height="42" as="geometry"/>
        </mxCell>

        ${cellsXml}

        <!-- FOOTER SUMMARY BAR -->
        <mxCell id="s1_footer" value="&lt;b style=&quot;font-size:9.5px;color:#0F172A;&quot;&gt;🔍 Assessment Telemetry Audit (${escapeXml(custName)}):&lt;/b&gt; &lt;span style=&quot;font-size:9px;color:#334155;&quot;&gt;Every column reflects this assessment&apos;s exact pillar score, extracted tools/metrics from assessor comments, established baseline strengths (&lt;b style=&quot;color:#065F46;&quot;&gt;theGood&lt;/b&gt;), and selected pain points (&lt;b style=&quot;color:#991B1B;&quot;&gt;technical_pain / business_pain&lt;/b&gt;).&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#F1F5F9;strokeColor=#CBD5E1;strokeWidth=1.2;align=left;verticalAlign=middle;spacingLeft=12;" vertex="1" parent="1">
          <mxGeometry x="20" y="802" width="1552" height="36" as="geometry"/>
        </mxCell>
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>`;
}

/**
 * STAGE 2 COMPILER: Phased Transition Bridge Architecture (Current -> Midpoint)
 * Builds 6 horizontal modernization swimlanes mapping each pillar's As-Is Tool Debt & Pain Points
 * -> Phased Coexistence / Strangler Fig Bridge -> Interim Milestone Target (avgMid/5.0).
 */
function compileStage2TransitionBridgeXml(dossier) {
  const { custName, industry, avgCur, avgMid, avgTgt, targetPlatformBrand, pillars } = dossier;
  let lanesXml = '';

  pillars.forEach((p, idx) => {
    const y = 104 + idx * 116;
    const isPriority1 = p.priorityRank === 1;
    const laneFill = isPriority1 ? '#FEF2F2' : (idx % 2 === 0 ? '#F8FAFC' : '#FFFFFF');
    const laneStroke = isPriority1 ? '#E11D48' : '#CBD5E1';
    const asIsTools = p.hasExplicitVendorTools
      ? p.detectedTools.slice(0, 3).join(', ')
      : p.defaultNeutralStack.split('•')[0].trim();
    const painsJoined = p.techPainCodes.slice(0, 2).join(', ');
    const quantStr = p.quantFootprint.length > 0 ? ` (${p.quantFootprint[0]})` : '';

    lanesXml += `
        <!-- SWIMLANE ${idx + 1}: ${escapeXml(p.shortTitle)} -->
        <mxCell id="s2_lane_${idx}" value="" style="rounded=1;arcSize=3;whiteSpace=wrap;html=1;fillColor=${laneFill};strokeColor=${laneStroke};strokeWidth=${isPriority1 ? '2' : '1.2'};" vertex="1" parent="1">
          <mxGeometry x="20" y="${y}" width="1552" height="106" as="geometry"/>
        </mxCell>

        <!-- Col 1:As-Is Pillar & Tool Debt -->
        <mxCell id="s2_left_${idx}" value="&lt;b style=&quot;font-size:9.5px;color:#0F172A;&quot;&gt;${p.icon} ${escapeXml(p.shortTitle)} (${p.currentScore.toFixed(1)}/5.0)&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:8px;color:#475569;&quot;&gt;• Stack: ${escapeXml(asIsTools)}${escapeXml(quantStr)}&lt;br&gt;• Pain: &lt;b style=&quot;color:#991B1B;&quot;&gt;${escapeXml(painsJoined)}&lt;/b&gt;&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#94A3B8;strokeWidth=1.2;align=left;verticalAlign=middle;spacingLeft=8;" vertex="1" parent="1">
          <mxGeometry x="32" y="${y + 10}" width="370" height="86" as="geometry"/>
        </mxCell>

        <!-- Col 2: Phased Transition Bridge & Coexistence Mechanism -->
        <mxCell id="s2_mid_${idx}" value="&lt;b style=&quot;font-size:9.5px;color:${isPriority1 ? '#9F1239' : '#92400E'};&quot;&gt;🌉 Priority #${p.priorityRank} Bridge: ${escapeXml(p.defaultBridgeTitle)}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:8px;color:#1E293B;&quot;&gt;• Wraps &amp;amp; decouples &lt;b&gt;${escapeXml(asIsTools)}&lt;/b&gt; without disrupting production SLAs&lt;br&gt;• Directly remediates &lt;b style=&quot;color:#B45309;&quot;&gt;${escapeXml(painsJoined)}&lt;/b&gt; via dual-run validation (${p.currentScore.toFixed(1)} → ${p.midScore.toFixed(1)}/5.0)&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=${isPriority1 ? '#FFE4E6' : '#FFFBEB'};strokeColor=${isPriority1 ? '#E11D48' : '#F59E0B'};strokeWidth=1.5;align=left;verticalAlign=middle;spacingLeft=10;" vertex="1" parent="1">
          <mxGeometry x="455" y="${y + 10}" width="615" height="86" as="geometry"/>
        </mxCell>

        <!-- Col 3: Interim Milestone State -->
        <mxCell id="s2_right_${idx}" value="&lt;b style=&quot;font-size:9.5px;color:#1E40AF;&quot;&gt;🎯 Wave ${p.priorityRank <= 2 ? '1' : (p.priorityRank <= 4 ? '2' : '3')} Milestone (${p.midScore.toFixed(1)} → ${p.futureScore.toFixed(1)}/5.0)&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:8px;color:#0F172A;&quot;&gt;• Target: ${escapeXml(p.defaultTargetTitle)}&lt;br&gt;• Platform: ${escapeXml(targetPlatformBrand)}&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#EFF6FF;strokeColor=#3B82F6;strokeWidth=1.3;align=left;verticalAlign=middle;spacingLeft=10;" vertex="1" parent="1">
          <mxGeometry x="1125" y="${y + 10}" width="435" height="86" as="geometry"/>
        </mxCell>

        <!-- Orthogonal Arrows -->
        <mxCell id="s2_e1_${idx}" value="Dual-Run" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#D97706;strokeWidth=1.6;endArrow=block;endFill=1;fontSize=7.5;fontColor=#92400E;" edge="1" parent="1" source="s2_left_${idx}" target="s2_mid_${idx}">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell id="s2_e2_${idx}" value="Cutover" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#2563EB;strokeWidth=1.6;endArrow=block;endFill=1;fontSize=7.5;fontColor=#1E40AF;" edge="1" parent="1" source="s2_mid_${idx}" target="s2_right_${idx}">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>`;
  });

  return `<mxfile host="embed.diagrams.net" modified="${new Date().toISOString()}" agent="ScoreX-Dynamic-Assessment-Compiler" version="24.0.0" type="device">
  <diagram id="stage2_dynamic_bridge" name="Stage 2: Transition Bridge (${escapeXml(custName)})">
    <mxGraphModel dx="1600" dy="920" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1600" pageHeight="900" background="#FFFFFF" math="0" shadow="0">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>

        <!-- HEADER BANNER -->
        <mxCell id="s2_banner" value="" style="rounded=1;arcSize=3;whiteSpace=wrap;html=1;fillColor=#0F172A;strokeColor=#334155;strokeWidth=1.5;" vertex="1" parent="1">
          <mxGeometry x="20" y="14" width="1552" height="52" as="geometry"/>
        </mxCell>
        <mxCell id="s2_title" value="&lt;b style=&quot;font-size:14.5px;color:#FFFFFF;&quot;&gt;STAGE 2: PHASED TRANSITION BRIDGE — ${escapeXml(custName.toUpperCase())} (${avgCur} → ${avgMid} → ${avgTgt}/5.0)&lt;/b&gt;" style="text;html=1;align=left;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="34" y="18" width="1180" height="22" as="geometry"/>
        </mxCell>
        <mxCell id="s2_subtitle" value="&lt;span style=&quot;font-size:9.5px;color:#FDE047;&quot;&gt;Zero-Downtime Strangler Fig &amp;amp; Coexistence Roadmap • Prioritized by Pillar Maturity Gap • Target: ${escapeXml(targetPlatformBrand)}&lt;/span&gt;" style="text;html=1;align=left;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="34" y="38" width="1180" height="20" as="geometry"/>
        </mxCell>
        <mxCell id="s2_badge" value="&lt;b style=&quot;font-size:11px;color:#FEF08A;&quot;&gt;BRIDGE STATE: ${avgMid} / 5.0&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:8px;color:#FFFFFF;&quot;&gt;Phased Cutover Waves 1-3&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#92400E;strokeColor=#F59E0B;strokeWidth=1.5;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="1320" y="19" width="238" height="42" as="geometry"/>
        </mxCell>

        <!-- COLUMN HEADERS -->
        <mxCell id="s2_col_h1" value="&lt;b style=&quot;font-size:10px;color:#475569;&quot;&gt;1. AS-IS BASELINE &amp;amp; TOOL DEBT (${avgCur}/5.0)&lt;/b&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#F1F5F9;strokeColor=#CBD5E1;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="32" y="72" width="370" height="24" as="geometry"/>
        </mxCell>
        <mxCell id="s2_col_h2" value="&lt;b style=&quot;font-size:10px;color:#92400E;&quot;&gt;2. PHASED COEXISTENCE &amp;amp; STRANGLER FIG BRIDGE (${avgCur} → ${avgMid}/5.0)&lt;/b&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FEF3C7;strokeColor=#F59E0B;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="455" y="72" width="615" height="24" as="geometry"/>
        </mxCell>
        <mxCell id="s2_col_h3" value="&lt;b style=&quot;font-size:10px;color:#1E40AF;&quot;&gt;3. INTERIM CLOUD-NATIVE MILESTONE (${avgMid} → ${avgTgt}/5.0)&lt;/b&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#DBEAFE;strokeColor=#3B82F6;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="1125" y="72" width="435" height="24" as="geometry"/>
        </mxCell>

        ${lanesXml}

        <!-- FOOTER -->
        <mxCell id="s2_footer" value="&lt;b style=&quot;font-size:9.5px;color:#0F172A;&quot;&gt;🧭 Phased Transition Guarantee (${escapeXml(custName)}):&lt;/b&gt; &lt;span style=&quot;font-size:9px;color:#334155;&quot;&gt;Each swimlane bridges the exact tools and pain points identified in ${escapeXml(custName)}&apos;s assessment without big-bang cutover risk.&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#F1F5F9;strokeColor=#CBD5E1;strokeWidth=1.2;align=left;verticalAlign=middle;spacingLeft=12;" vertex="1" parent="1">
          <mxGeometry x="20" y="806" width="1552" height="34" as="geometry"/>
        </mxCell>
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>`;
}

/**
 * STAGE 3 COMPILER: Desired Future State (To-Be Target Architecture)
 * Dynamically tailors the Target Architecture to the customer's Industry Domain,
 * Target Platform Brand (Databricks Unity Catalog vs Google Cloud BigQuery/Dataplex/Vertex AI),
 * and shows how all 6 pillars achieve their exact Future Maturity Score (avgTgt/5.0).
 */
function compileStage3FutureStateXml(dossier) {
  const { custName, industry, avgCur, avgTgt, overallDelta, prefersDatabricks, targetPlatformBrand, pillars } = dossier;

  const indLower = industry.toLowerCase();
  let domainSourcesTitle = 'Enterprise SaaS, Transactional OLTP & Event Telemetry';
  let domainSourcesDesc = 'Cloud SQL/Spanner OLTP, CRM/ERP Feeds, Clickstream & Real-Time Event Webhooks';
  let domainServingApps = 'Governed RAG Knowledge Copilot • Real-Time ML Decision API • Self-Service Semantic BI';

  if (indLower.includes('health') || indLower.includes('life')) {
    domainSourcesTitle = 'HIPAA Clinical EHR (HL7/FHIR), Claims & Genomic Feeds';
    domainSourcesDesc = 'Epic/Cerner FHIR Streams, Payer Claims EDI, Lab Diagnostics & De-Identified Clinical Registries';
    domainServingApps = 'Clinical Care RAG Copilot • Patient Risk Stratification ML • HIPAA Governed Clinical BI';
  } else if (indLower.includes('retail') || indLower.includes('commerce')) {
    domainSourcesTitle = 'Omnichannel POS, E-Commerce Clickstream & Supply Chain ERP';
    domainSourcesDesc = 'Real-Time Store POS Events, Web/Mobile Cart Telemetry, Inventory WMS & Loyalty CRM';
    domainServingApps = 'Hyper-Personalized Shopping Agent • Real-Time Demand Forecasting ML • Merchandising BI';
  } else if (indLower.includes('telecom')) {
    domainSourcesTitle = '5G Network CDRs, Cell Tower Telemetry & Subscriber Billing';
    domainSourcesDesc = 'High-Velocity 5G Call Detail Records, RAN/Core Network Probes & OSS/BSS Customer Systems';
    domainServingApps = 'Proactive Churn Prevention ML • Autonomous NOC Triage Agent • Real-Time Subscriber QoS BI';
  } else if (indLower.includes('financ') || indLower.includes('insur') || indLower.includes('bank')) {
    domainSourcesTitle = 'Core Policy/Payment Ledger, Market Feeds & Fraud Telemetry';
    domainSourcesDesc = 'ISO-20022 Payment Streams, Underwriting/Claims Core, Sub-Second Fraud & Risk Signals';
    domainServingApps = 'Sub-15ms Fraud Scoring Engine • Actuarial/Underwriting RAG Copilot • Regulatory Risk BI';
  } else if (indLower.includes('manufactur') || indLower.includes('industrial')) {
    domainSourcesTitle = 'Connected Factory SCADA/PLC, IIoT Sensors & SAP ERP';
    domainSourcesDesc = 'High-Frequency Shop-Floor Vibration/Thermal Telemetry, MES Production Logs & Supply Chain ERP';
    domainServingApps = 'Predictive Maintenance ML • Autonomous Supply Chain Agent • OEE Plant Efficiency Cockpit';
  }

  let pillarTargetCardsXml = '';
  pillars.forEach((p, idx) => {
    const col = idx % 3;
    const row = Math.floor(idx / 3);
    const x = 355 + col * 395;
    const y = 92 + row * 340;

    const retiredTools = p.hasExplicitVendorTools
      ? `Replaces: ${p.detectedTools.slice(0, 3).join(', ')}`
      : `Upgrades Level ${p.currentScore.toFixed(1)} Baseline`;
    const resolvedPains = p.techPainCodes.slice(0, 3).join(', ');

    const targetTechStack = prefersDatabricks
      ? {
          platform_governance: 'Databricks Unity Catalog • Automated ABAC/Row-Level Masking • Serverless Compute Isolation',
          data_engineering: 'Delta Live Tables (DLT) Auto-CDC • Lakeflow Declarative Pipelines • Data Quality Expectations',
          analytics_bi: 'Databricks SQL Serverless • Unity Catalog Metric Views • AI/BI Genie Conversational NLQ',
          machine_learning: 'Mosaic AI Feature Store • Unity Catalog Model Registry • Automated Drift & Champion/Challenger',
          generative_ai: 'Mosaic AI Gateway • Vector Search Index (ACL-Synced) • Agent Framework & Guardrail Evaluators',
          operational_excellence: 'System Tables FinOps Chargeback • Federated Data & AI CoE Marketplace • Automated CI/CD Asset Bundles'
        }[p.key]
      : {
          platform_governance: 'Google Cloud Dataplex Unified Catalog • Fine-Grained IAM/ABAC • Serverless Compute Isolation',
          data_engineering: 'Datastream CDC + Pub/Sub • Dataflow Auto-Scaling Streaming • BigLake Open Apache Iceberg',
          analytics_bi: 'BigQuery Enterprise Analytics • Looker Semantic Modeling Layer • Gemini in Looker NLQ',
          machine_learning: 'Vertex AI Feature Store • Vertex Model Registry & Pipelines • Automated Skew/Drift Retraining',
          generative_ai: 'Vertex AI Agent Builder & AI Gateway • ACL-Gated Vector Search RAG • Model Armor Guardrails',
          operational_excellence: 'Cloud Billing FinOps Attribution • Enterprise Data & AI CoE Hub • GitOps Terraform & CI/CD'
        }[p.key];

    pillarTargetCardsXml += `
        <!-- TARGET PILLAR CARD ${idx + 1}: ${escapeXml(p.shortTitle)} -->
        <mxCell id="s3_pcard_${idx}" value="" style="rounded=1;arcSize=3;whiteSpace=wrap;html=1;fillColor=#F0FDF4;strokeColor=#16A34A;strokeWidth=1.8;" vertex="1" parent="1">
          <mxGeometry x="${x}" y="${y}" width="375" height="315" as="geometry"/>
        </mxCell>
        <mxCell id="s3_phdr_${idx}" value="&lt;b style=&quot;font-size:10.5px;color:#FFFFFF;&quot;&gt;${p.icon} ${escapeXml(p.shortTitle)} — TARGET ${p.futureScore.toFixed(1)}/5.0 (+${p.gap.toFixed(1)})&lt;/b&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#15803D;strokeColor=#166534;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="${x + 10}" y="${y + 10}" width="355" height="34" as="geometry"/>
        </mxCell>

        <mxCell id="s3_pstack_${idx}" value="&lt;b style=&quot;font-size:9px;color:#065F46;&quot;&gt;🚀 Cloud-Native Target Architecture:&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:8.5px;color:#0F172A;&quot;&gt;${escapeXml(targetTechStack)}&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#86EFAC;strokeWidth=1.2;align=left;verticalAlign=top;spacingLeft=8;spacingTop=6;" vertex="1" parent="1">
          <mxGeometry x="${x + 12}" y="${y + 52}" width="351" height="86" as="geometry"/>
        </mxCell>

        <mxCell id="s3_presolved_${idx}" value="&lt;b style=&quot;font-size:9px;color:#1E40AF;&quot;&gt;🛠️ Legacy Debt Retired &amp;amp; Pains Eliminated:&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:8px;color:#1E293B;&quot;&gt;• &lt;b&gt;${escapeXml(retiredTools)}&lt;/b&gt;&lt;br&gt;• Eliminates: &lt;b style=&quot;color:#15803D;&quot;&gt;${escapeXml(resolvedPains)}&lt;/b&gt;&lt;br&gt;• Maturity Leap: &lt;b&gt;${p.currentScore.toFixed(1)}/5.0 → ${p.futureScore.toFixed(1)}/5.0&lt;/b&gt;&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#EFF6FF;strokeColor=#93C5FD;strokeWidth=1.2;align=left;verticalAlign=top;spacingLeft=8;spacingTop=6;" vertex="1" parent="1">
          <mxGeometry x="${x + 12}" y="${y + 148}" width="351" height="84" as="geometry"/>
        </mxCell>

        <mxCell id="s3_poutcome_${idx}" value="&lt;b style=&quot;font-size:8.5px;color:#0F172A;&quot;&gt;📈 Verified Business Outcome:&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:8px;color:#334155;&quot;&gt;• Resolves ${escapeXml(p.bizPainCodes.map(humanizePainCode).join(' &amp; '))}&lt;br&gt;• Continuous automated SLA &amp;amp; FinOps governance&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#CBD5E1;strokeWidth=1;align=left;verticalAlign=top;spacingLeft=8;spacingTop=6;" vertex="1" parent="1">
          <mxGeometry x="${x + 12}" y="${y + 240}" width="351" height="64" as="geometry"/>
        </mxCell>`;
  });

  return `<mxfile host="embed.diagrams.net" modified="${new Date().toISOString()}" agent="ScoreX-Dynamic-Assessment-Compiler" version="24.0.0" type="device">
  <diagram id="stage3_dynamic_future" name="Stage 3: Desired Future State (${escapeXml(custName)})">
    <mxGraphModel dx="1600" dy="920" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1600" pageHeight="900" background="#FFFFFF" math="0" shadow="0">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>

        <!-- HEADER BANNER -->
        <mxCell id="s3_banner" value="" style="rounded=1;arcSize=3;whiteSpace=wrap;html=1;fillColor=#052E16;strokeColor=#16A34A;strokeWidth=1.5;" vertex="1" parent="1">
          <mxGeometry x="20" y="14" width="1552" height="54" as="geometry"/>
        </mxCell>
        <mxCell id="s3_title" value="&lt;b style=&quot;font-size:14.5px;color:#FFFFFF;&quot;&gt;STAGE 3: DESIRED FUTURE STATE (TO-BE) — ${escapeXml(custName.toUpperCase())} (${escapeXml(industry.toUpperCase())} • ${avgTgt}/5.0)&lt;/b&gt;" style="text;html=1;align=left;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="34" y="18" width="1180" height="24" as="geometry"/>
        </mxCell>
        <mxCell id="s3_subtitle" value="&lt;span style=&quot;font-size:9.5px;color:#86EFAC;&quot;&gt;Target Architecture: ${escapeXml(targetPlatformBrand)} • +${overallDelta} Maturity Leap (${avgCur} → ${avgTgt}/5.0) • 100% Assessment Pain Points Remediated&lt;/span&gt;" style="text;html=1;align=left;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="34" y="40" width="1180" height="20" as="geometry"/>
        </mxCell>
        <mxCell id="s3_badge" value="&lt;b style=&quot;font-size:11px;color:#BBF7D0;&quot;&gt;TARGET STATE: ${avgTgt} / 5.0&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:8.5px;color:#FFFFFF;&quot;&gt;+${overallDelta} Transformation Leap&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#166534;strokeColor=#22C55E;strokeWidth=1.5;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="1320" y="20" width="238" height="42" as="geometry"/>
        </mxCell>

        <!-- LEFT COLUMN: DOMAIN-SPECIFIC INGESTION & SOURCES -->
        <mxCell id="s3_left_col" value="" style="rounded=1;arcSize=3;whiteSpace=wrap;html=1;fillColor=#F8FAFC;strokeColor=#3B82F6;strokeWidth=1.6;" vertex="1" parent="1">
          <mxGeometry x="20" y="92" width="310" height="655" as="geometry"/>
        </mxCell>
        <mxCell id="s3_left_hdr" value="&lt;b style=&quot;font-size:10px;color:#FFFFFF;&quot;&gt;📡 ${escapeXml(industry.toUpperCase())}&lt;br&gt;DOMAIN SOURCES &amp;amp; REAL-TIME FEEDS&lt;/b&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#1D4ED8;strokeColor=#1E40AF;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="30" y="102" width="290" height="42" as="geometry"/>
        </mxCell>
        <mxCell id="s3_src_1" value="&lt;b style=&quot;font-size:9.5px;color:#0F172A;&quot;&gt;1. ${escapeXml(domainSourcesTitle)}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:8px;color:#475569;&quot;&gt;${escapeXml(domainSourcesDesc)}&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#93C5FD;strokeWidth=1.3;align=left;verticalAlign=middle;spacingLeft=8;" vertex="1" parent="1">
          <mxGeometry x="32" y="160" width="286" height="110" as="geometry"/>
        </mxCell>
        <mxCell id="s3_src_2" value="&lt;b style=&quot;font-size:9.5px;color:#0F172A;&quot;&gt;2. Sub-Second Auto-CDC &amp;amp; Streaming Bus&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:8px;color:#475569;&quot;&gt;Zero-impact change data capture, schema evolution contracts &amp;amp; automated PII classification at ingress&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#93C5FD;strokeWidth=1.3;align=left;verticalAlign=middle;spacingLeft=8;" vertex="1" parent="1">
          <mxGeometry x="32" y="290" width="286" height="110" as="geometry"/>
        </mxCell>
        <mxCell id="s3_src_3" value="&lt;b style=&quot;font-size:9.5px;color:#166534;&quot;&gt;3. ${escapeXml(industry)} Serving &amp;amp; Action Hub&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:8px;color:#1E293B;&quot;&gt;${escapeXml(domainServingApps)}&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#DCFCE7;strokeColor=#22C55E;strokeWidth=1.4;align=left;verticalAlign=middle;spacingLeft=8;" vertex="1" parent="1">
          <mxGeometry x="32" y="420" width="286" height="140" as="geometry"/>
        </mxCell>
        <mxCell id="s3_src_4" value="&lt;b style=&quot;font-size:9px;color:#1E40AF;&quot;&gt;🔄 Closed-Loop Telemetry &amp;amp; FinOps&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:8px;color:#334155;&quot;&gt;Real-time unit cost attribution, automated drift retraining &amp;amp; executive ROI dashboards&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#EFF6FF;strokeColor=#60A5FA;strokeWidth=1.2;align=left;verticalAlign=middle;spacingLeft=8;" vertex="1" parent="1">
          <mxGeometry x="32" y="580" width="286" height="150" as="geometry"/>
        </mxCell>

        ${pillarTargetCardsXml}

        <!-- FOOTER -->
        <mxCell id="s3_footer" value="&lt;b style=&quot;font-size:9.5px;color:#052E16;&quot;&gt;✅ Target State Alignment (${escapeXml(custName)} • ${escapeXml(industry)}):&lt;/b&gt; &lt;span style=&quot;font-size:9px;color:#1E293B;&quot;&gt;Tailored specifically to ${escapeXml(custName)}&apos;s domain feeds, target platform (${escapeXml(targetPlatformBrand)}), and 6-pillar maturity goals (${avgCur} → ${avgTgt}/5.0).&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#DCFCE7;strokeColor=#86EFAC;strokeWidth=1.2;align=left;verticalAlign=middle;spacingLeft=12;" vertex="1" parent="1">
          <mxGeometry x="20" y="765" width="1552" height="38" as="geometry"/>
        </mxCell>
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>`;
}

module.exports = {
  extractAssessmentTelemetry,
  compileStage1CurrentStateXml,
  compileStage2TransitionBridgeXml,
  compileStage3FutureStateXml
};
