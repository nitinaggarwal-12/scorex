const geminiService = require('./geminiService');

/**
 * Dynamic Assessment Engine
 * Generates custom assessment frameworks, questions, options, and comprehensive executive reports
 * powered by Google Gemini (gemini-3.7-flash).
 */
class DynamicAssessmentEngine {
  constructor() {
    this.gemini = geminiService;
    this.geminiService = geminiService;
  }

  /**
   * AI-generate a complete structured assessment framework from a user prompt
   */
  async generateFrameworkFromPrompt(prompt, options = {}) {
    const tier = options.tier || 'deep_dive'; // 'rapid' | 'deep_dive' | 'comprehensive'
    console.log(`🤖 Generating dynamic assessment framework (Tier: ${tier}) with Gemini (gemini-3.7-flash)...`);
    console.log('📝 Prompt:', prompt);

    let tierConfig = {
      dimRange: '5 to 6 distinct dimensions',
      qPerDim: 'exactly 2 rigorous, distinct questions per dimension',
      totalTarget: '10 to 12 questions total',
      estimatedMinutes: 15,
      descriptionDepth: 'comprehensive capability deep-dive'
    };

    if (tier === 'rapid') {
      tierConfig = {
        dimRange: '3 to 4 distinct dimensions',
        qPerDim: 'exactly 2 focused questions per dimension',
        totalTarget: '6 to 8 questions total',
        estimatedMinutes: 8,
        descriptionDepth: 'rapid executive diagnostic pulse'
      };
    } else if (tier === 'comprehensive') {
      tierConfig = {
        dimRange: '6 to 8 distinct dimensions',
        qPerDim: '3 to 4 granular questions per dimension',
        totalTarget: '24 to 32 questions total',
        estimatedMinutes: 45,
        descriptionDepth: 'full enterprise due-diligence audit'
      };
    }

    const systemInstruction = `You are a Principal Enterprise Strategy & Assessment Framework Architect.
Your role is to design world-class, audit-grade maturity assessments for any technology, domain, industry, architecture, or business discipline.

Generate a comprehensive, production-ready assessment framework JSON that conforms EXACTLY to the specified schema.
The assessment must be deep, practical, and highly actionable with ${tierConfig.dimRange} and ${tierConfig.qPerDim} (${tierConfig.totalTarget}).

CRITICAL DEPTH MANDATE:
- Never generate a shallow 1-question or 2-question stub.
- You MUST create ${tierConfig.dimRange} with ${tierConfig.qPerDim} so the assessment captures complete operational reality.

Rules for Question & Option Design:
1. Each question must evaluate a specific capability, process, or architectural pattern.
2. Provide exactly 5 distinct maturity options for each question (Scores 1 to 5):
   - Score 1: Ad-hoc / Manual / No formal practice
   - Score 2: Initial experimentation / Fragmented / Early stage
   - Score 3: Standardized / Documented / Consistent baseline
   - Score 4: Advanced / Automated / Integrated / Governed
   - Score 5: Optimized / Continuous improvement / AI-augmented / Industry leading
3. Include 2-4 realistic Technical Pain Points and 2-4 Business Pain Points per question.
4. Keep all terminology open, vendor-neutral, and aligned with modern industry best practices.`;

    const userPrompt = `DESIGN AN ASSESSMENT FRAMEWORK FOR:
${prompt}

- Target Depth Tier: ${tier.toUpperCase()} (${tierConfig.descriptionDepth}, ${tierConfig.totalTarget})
${options.industry ? `- Target Industry: ${options.industry}` : ''}
${options.targetAudience ? `- Target Audience: ${options.targetAudience}` : ''}
${options.focusAreas ? `- Specific Focus Areas: ${options.focusAreas}` : ''}

Output a strictly valid JSON object with the following schema:
{
  "typeKey": "<slug_snake_case_key_e.g_cloud_security_readiness>",
  "title": "<Concise Assessment Title, e.g. Cloud Security & Zero Trust Readiness>",
  "subtitle": "<Sub-heading, e.g. Enterprise Security Architecture & Compliance Framework>",
  "description": "<2-3 sentence overview of what this assessment evaluates and why it matters>",
  "icon": "<React Icon Name, e.g. FiShield, FiDollarSign, FiCpu, FiDatabase, FiLock, FiCloud, FiTrendingUp, FiActivity, FiLayers, FiCheckSquare, FiAward>",
  "badge": "<Short 1-2 word badge label, e.g. Security, FinOps, Data Mesh, Compliance, MLOps>",
  "color": "<HEX color code, e.g. #6366f1, #10b981, #f59e0b, #ef4444, #8b5cf6, #06b6d4, #ec4899>",
  "targetRole": "<Target participants, e.g. Security Architects, FinOps Leads, Engineering Managers>",
  "estimatedMinutes": 15,
  "dimensions": [
    {
      "id": "<dim_id_snake_case>",
      "name": "<Dimension Name>",
      "description": "<Brief description of this dimension>",
      "weight": 1.0,
      "questions": [
        {
          "id": "<q_id_unique>",
          "text": "<Clear, evaluative question text>",
          "guidance": "<1-2 sentences of helpful guidance for the assessor>",
          "options": [
            { "value": 1, "score": 1, "label": "<Level 1 descriptive answer>" },
            { "value": 2, "score": 2, "label": "<Level 2 descriptive answer>" },
            { "value": 3, "score": 3, "label": "<Level 3 descriptive answer>" },
            { "value": 4, "score": 4, "label": "<Level 4 descriptive answer>" },
            { "value": 5, "score": 5, "label": "<Level 5 descriptive answer>" }
          ],
          "technicalPainPoints": ["<Tech Pain 1>", "<Tech Pain 2>", "<Tech Pain 3>"],
          "businessPainPoints": ["<Biz Pain 1>", "<Biz Pain 2>", "<Biz Pain 3>"]
        }
      ]
    }
  ],
  "maturityLevels": [
    { "level": 1, "name": "Initial", "label": "Initial / Ad-hoc", "scoreMin": 1.0, "scoreMax": 1.9, "color": "#ef4444", "description": "<Description of Level 1 organization>" },
    { "level": 2, "name": "Developing", "label": "Developing / Emerging", "scoreMin": 2.0, "scoreMax": 2.9, "color": "#f59e0b", "description": "<Description of Level 2 organization>" },
    { "level": 3, "name": "Defined", "label": "Defined / Standardized", "scoreMin": 3.0, "scoreMax": 3.7, "color": "#3b82f6", "description": "<Description of Level 3 organization>" },
    { "level": 4, "name": "Managed", "label": "Managed / Automated", "scoreMin": 3.8, "scoreMax": 4.5, "color": "#10b981", "description": "<Description of Level 4 organization>" },
    { "level": 5, "name": "Optimizing", "label": "Optimizing / Transformative", "scoreMin": 4.6, "scoreMax": 5.0, "color": "#8b5cf6", "description": "<Description of Level 5 organization>" }
  ]
}`;

    const result = await this.gemini._generateWithFallback(
      userPrompt + '\n\nIMPORTANT: Output ONLY pure JSON matching the schema.',
      systemInstruction,
      0.7,
      'application/json'
    );

    let parsed = null;
    try {
      parsed = JSON.parse(result.text);
    } catch (e) {
      const match = result.text.match(/\{[\s\S]*\}/);
      if (match) parsed = JSON.parse(match[0]);
    }

    if (!parsed || !parsed.dimensions || parsed.dimensions.length === 0) {
      throw new Error('Failed to generate a valid assessment framework');
    }

    // Ensure slug key is deterministic, sanitized RFC 3986, and valid
    if (!parsed.typeKey) {
      const baseSlug = (parsed.title || 'custom_assessment')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '')
        .slice(0, 48);
      parsed.typeKey = baseSlug || `custom_${Date.now()}`;
    } else {
      parsed.typeKey = parsed.typeKey.toLowerCase().replace(/[^a-z0-9_]+/g, '_').slice(0, 48);
    }

    console.log(`✅ Dynamic framework generated successfully: "${parsed.title}" (${parsed.dimensions.length} dimensions)`);
    return parsed;
  }

  /**
   * Calculate mathematical scores for a dynamic assessment run
   */
  calculateScores(responses = {}, framework = {}) {
    const dimensions = framework.dimensions || [];
    const dimensionScores = {};
    let totalScoreSum = 0;
    let totalQuestionsCount = 0;
    let totalTargetSum = 0;
    let totalTargetCount = 0;

    dimensions.forEach(dim => {
      let dimSum = 0;
      let dimCount = 0;
      let dimTargetSum = 0;
      let dimTargetCount = 0;

      (dim.questions || []).forEach(q => {
        // Current score
        const val = responses[q.id] !== undefined ? responses[q.id] : responses[`${q.id}_current_state`];
        if (val !== undefined && val !== null && !isNaN(Number(val))) {
          const score = Number(val);
          dimSum += score;
          dimCount++;
          totalScoreSum += score;
          totalQuestionsCount++;
        }

        // Future target score
        const targetVal = responses[`${q.id}_future_state`] !== undefined 
          ? responses[`${q.id}_future_state`] 
          : responses[`${q.id}_target`];
        if (targetVal !== undefined && targetVal !== null && !isNaN(Number(targetVal))) {
          const tScore = Number(targetVal);
          dimTargetSum += tScore;
          dimTargetCount++;
          totalTargetSum += tScore;
          totalTargetCount++;
        }
      });

      const avgScore = dimCount > 0 ? parseFloat((dimSum / dimCount).toFixed(2)) : 0;
      const avgTargetScore = dimTargetCount > 0 
        ? parseFloat((dimTargetSum / dimTargetCount).toFixed(2)) 
        : Math.min(5.0, parseFloat((avgScore + 1.2).toFixed(2)));
      const gap = parseFloat(Math.max(0, avgTargetScore - avgScore).toFixed(2));

      dimensionScores[dim.id] = {
        id: dim.id,
        name: dim.name,
        score: avgScore,
        currentScore: avgScore,
        targetScore: avgTargetScore,
        futureScore: avgTargetScore,
        gap,
        answeredCount: dimCount,
        totalQuestions: (dim.questions || []).length,
        percentage: Math.round((avgScore / 5) * 100)
      };
    });

    const overallScore = totalQuestionsCount > 0 ? parseFloat((totalScoreSum / totalQuestionsCount).toFixed(2)) : 0;
    const overallTarget = totalTargetCount > 0 
      ? parseFloat((totalTargetSum / totalTargetCount).toFixed(2)) 
      : Math.min(5.0, parseFloat((overallScore + 1.2).toFixed(2)));
    const overallGap = parseFloat(Math.max(0, overallTarget - overallScore).toFixed(2));
    const maxScore = 5.0;

    // Match maturity level
    const maturityLevels = framework.maturityLevels || [];
    let matchedLevel = maturityLevels.find(l => overallScore >= l.scoreMin && overallScore <= l.scoreMax);
    if (!matchedLevel && maturityLevels.length > 0) {
      matchedLevel = overallScore < 2 ? maturityLevels[0] : maturityLevels[maturityLevels.length - 1];
    }

    return {
      overallScore,
      currentScore: overallScore,
      targetScore: overallTarget,
      overallTarget,
      overallGap,
      gap: overallGap,
      maxScore,
      percentage: Math.round((overallScore / maxScore) * 100),
      maturityLevel: matchedLevel ? matchedLevel.name : (overallScore >= 4 ? 'Optimizing' : overallScore >= 3 ? 'Defined' : overallScore >= 2 ? 'Developing' : 'Initial'),
      maturityDetails: matchedLevel || null,
      dimensionScores,
      totalAnswered: totalQuestionsCount
    };
  }

  /**
   * AI-generate an executive report for a completed dynamic assessment
   * Accepts both (instance, framework) and (framework, responses, scores, options) signatures
   */
  async generateExecutiveReport(frameworkOrInstance, responsesOrFramework, scoresOrOptions, options = {}) {
    // Detect if called as generateExecutiveReport(framework, responses, scores, options)
    if (responsesOrFramework && (responsesOrFramework.dimensions || frameworkOrInstance.dimensions)) {
      let framework = frameworkOrInstance.dimensions ? frameworkOrInstance : responsesOrFramework;
      let instance = {
        customerName: options.customerName || scoresOrOptions?.customerName || 'Enterprise Organization',
        useCase: options.useCase || scoresOrOptions?.useCase || framework.title || 'Enterprise Modernization',
        responses: typeof responsesOrFramework === 'object' && !responsesOrFramework.dimensions ? responsesOrFramework : (frameworkOrInstance.responses || {})
      };
      return this.generateDynamicReport(instance, framework);
    }
    return this.generateDynamicReport(frameworkOrInstance, responsesOrFramework);
  }

  /**
   * Main report synthesis engine
   */
  async generateDynamicReport(instance, framework) {
    console.log(`🤖 Generating executive report for "${instance.customerName}" (${framework.title}) with Gemini 3.7...`);

    const scores = this.calculateScores(instance.responses, framework);
    const selectedPainPoints = [];
    const commentsList = [];

    // Extract pain points & comments
    (framework.dimensions || []).forEach(dim => {
      (dim.questions || []).forEach(q => {
        const painResp = instance.responses[`${q.id}_pain_points`] || instance.responses[`${q.id}_technical_pain`];
        if (Array.isArray(painResp) && painResp.length > 0) {
          selectedPainPoints.push(...painResp.map(p => `[${dim.name}] ${p}`));
        }
        const comment = instance.responses[`${q.id}_comment`];
        if (comment && comment.trim()) {
          commentsList.push(`[${dim.name} - ${q.text}]: "${comment.trim()}"`);
        }
      });
    });

    const systemInstruction = `You are a Lead Executive Advisor and CTO Strategy Consultant at ScoreX.
You specialize in synthesizing maturity assessments into executive-ready strategic transformation reports for Board Members, CTOs, CIOs, and VP-level leaders.

Deliver a rigorous, consultative, highly contextualized report based on the customer's actual scores, identified pain points, and specific notes.
Ground all strategic guidance in proven modern architectural patterns:
- Open Data Lakehouse: Open metadata catalog (Apache Polaris / Unity Catalog / Google Dataplex / AWS Glue), Delta Lake & Apache Iceberg open table format interoperability.
- Declarative Streaming: Serverless Ingestion, declarative data pipelines (dbt / Dataform / Spark Streaming), and automated CDC data contracts.
- Production MLOps: Centralized Model & Prompt Registry, automated drift alerting, and feature store reuse.
- Next-Gen Compound GenAI: Autonomous Multi-Agent Orchestration (Model Context Protocol - MCP), Prompt Context Caching (75% input token discount), Dynamic Model Routing, and Zero-Trust AI Guardrails.
- FinOps: Compute auto-termination, predictive cost anomaly alerts, and serverless right-sizing.

Avoid generic fluff or vendor bias. Every recommendation must be actionable, architectural, and strategic.`;

    const userPrompt = `ASSESSMENT CONTEXT:
- Assessment Type: ${framework.title} (${framework.subtitle || ''})
- Customer / Organization: ${instance.customerName || 'Enterprise Organization'}
- Use Case / Business Initiative: ${instance.useCase || 'Core Enterprise Modernization'}
- Overall Maturity Score: ${scores.overallScore} / 5.0 (Maturity Stage: ${scores.maturityLevel})

DIMENSION SCORES:
${Object.values(scores.dimensionScores).map(d => `- ${d.name}: ${d.score}/5.0 (${d.percentage}% maturity, ${d.answeredCount}/${d.totalQuestions} questions)`).join('\n')}

CUSTOMER PAIN POINTS & BOTTLENECKS IDENTIFIED:
${selectedPainPoints.length > 0 ? selectedPainPoints.join('\n') : 'General process and architecture evolution opportunities'}

ASSESSOR CONTEXTUAL NOTES & COMMENTS:
${commentsList.length > 0 ? commentsList.join('\n') : 'Standard deployment review'}

Generate a comprehensive JSON executive report matching this schema:
{
  "executiveSummary": "<Markdown 3-4 paragraphs: CTO-level analysis of current maturity, key strategic inflection points, technical debt / risk posture, and the business rationale for transformation>",
  "maturityBadge": {
    "level": ${scores.overallScore >= 4 ? 4 : scores.overallScore >= 3 ? 3 : scores.overallScore >= 2 ? 2 : 1},
    "name": "${scores.maturityLevel}",
    "score": ${scores.overallScore},
    "summary": "<1-sentence summary of what this maturity score means for the customer's business>"
  },
  "radarChartData": [
    ${Object.values(scores.dimensionScores).map(d => `{"dimension": "${d.name}", "currentScore": ${d.score}, "targetScore": ${Math.min(5, Number(d.score) + 1.2)}, "maxScore": 5}`).join(',\n')}
  ],
  "dimensionInsights": [
    {
      "dimensionId": "<id>",
      "dimensionName": "<Name>",
      "currentScore": <number>,
      "targetScore": <number>,
      "status": "<Strong|Moderate|Critical Gap>",
      "findings": "<1-2 sentences on current state findings based on responses>",
      "priorityAction": "<Primary high-impact action to close gap>"
    }
  ],
  "keyStrengths": [
    "<Strength 1: specific capability organization is doing well>",
    "<Strength 2>",
    "<Strength 3>"
  ],
  "criticalConstraints": [
    "<Constraint 1: key bottleneck or vulnerability based on pain points>",
    "<Constraint 2>",
    "<Constraint 3>"
  ],
  "transformationRoadmap": {
    "phase1": {
      "title": "Phase 1: Foundation & Quick Wins",
      "timeline": "0–3 Months",
      "focus": "<Core objective of Phase 1>",
      "milestones": [
        "<Milestone 1>",
        "<Milestone 2>",
        "<Milestone 3>"
      ]
    },
    "phase2": {
      "title": "Phase 2: Scale & Operationalization",
      "timeline": "3–6 Months",
      "focus": "<Core objective of Phase 2>",
      "milestones": [
        "<Milestone 1>",
        "<Milestone 2>",
        "<Milestone 3>"
      ]
    },
    "phase3": {
      "title": "Phase 3: Optimization & Continuous Value",
      "timeline": "6–12 Months",
      "focus": "<Core objective of Phase 3>",
      "milestones": [
        "<Milestone 1>",
        "<Milestone 2>",
        "<Milestone 3>"
      ]
    }
  },
  "prioritizedRecommendations": [
    {
      "id": 1,
      "title": "<Actionable initiative title>",
      "dimension": "<Related Dimension>",
      "priority": "<Critical|High|Medium>",
      "timeline": "<e.g. 1-2 months>",
      "whyItMatters": "<Direct business & technical rationale>",
      "actionSteps": [
        "<Step 1>",
        "<Step 2>",
        "<Step 3>"
      ],
      "expectedImpact": "<Quantified / strategic impact on velocity, risk, or cost>"
    }
  ],
  "expectedOutcomes": [
    "<Outcome 1: e.g. 40% reduction in deployment latency>",
    "<Outcome 2: e.g. 100% compliance audit trail visibility>",
    "<Outcome 3: e.g. Multi-million dollar savings from automated right-sizing>"
  ]
}`;

    let parsed = null;
    try {
      const result = await this.gemini._generateWithFallback(
        userPrompt + '\n\nIMPORTANT: Output ONLY pure JSON matching the schema.',
        systemInstruction,
        0.7,
        'application/json'
      );

      try {
        parsed = JSON.parse(result.text);
      } catch (e) {
        const match = result.text.match(/\{[\s\S]*\}/);
        if (match) parsed = JSON.parse(match[0]);
      }

      if (parsed) {
        parsed.architectureDiagrams = this._generateDeterministicDiagramsFallback(framework, metadata, scores);
        parsed.generatedAt = new Date().toISOString();
        parsed.modelUsed = result.modelUsed;
        parsed.calculatedScores = scores;
        console.log(`✅ Executive report generated successfully with ${result.modelUsed}`);
        return parsed;
      }
    } catch (aiError) {
      console.warn('⚠️ AI report generation failed, falling back to deterministic synthesis:', aiError.message);
    }

    // High-craft deterministic fallback ensures 100% uptime with zero 500 crashes
    console.log('🛡️ Synthesizing deterministic executive report fallback');
    return this._generateDeterministicReportFallback(framework, instance, scores, selectedPainPoints);
  }

  /**
   * Deterministic fallback synthesis for guaranteed 100% uptime and resilience
   */
  _generateDeterministicReportFallback(framework, instance, scores, selectedPainPoints = []) {
    const customer = instance.customerName || 'Enterprise Client';
    const overall = scores.overallScore || 2.5;
    const stage = scores.maturityLevel || 'Defined';

    return {
      executiveSummary: `This maturity assessment report provides a comprehensive architectural evaluation of ${customer}'s data and AI capabilities across key operational domains. With an overall maturity rating of ${overall}/5.0 (Stage: ${stage}), the organization demonstrates solid structural foundations while holding substantial opportunities for accelerated transformation through unified lakehouse governance, declarative streaming data engineering, serverless compute auto-termination, and compound GenAI agent orchestration.`,
      maturityBadge: {
        stage: stage,
        scoreText: `${overall} / 5.0`,
        summaryText: `Enterprise capability evaluated at ${stage} maturity with positive trajectory for modernization.`
      },
      strategicContext: {
        marketDrivers: [
          'Demand for unified, zero-copy open data sharing across multi-cloud environments',
          'Urgency to govern Foundation Models and GenAI agents with standardized MCP tool contracts',
          'FinOps mandates to eliminate idle over-provisioned cluster costs via 15-minute auto-termination'
        ],
        organizationalImplications: [
          'Transition from fractured siloed pipelines to declarative, version-controlled streaming data contracts',
          'Deployment of centralized Unity Catalog metadata for automated column/row PII masking',
          'Establishment of an Enterprise Center of Excellence for production MLOps and Prompt Context Caching'
        ]
      },
      keyStrengths: [
        `Established baseline operational capability in core ${framework.title || 'Data & AI'} architecture`,
        'Demonstrated organizational commitment to enterprise data platform modernization',
        'Initial governance controls in place with clear roadmap trajectory towards autonomous AI scale'
      ],
      criticalConstraints: selectedPainPoints.length > 0 
        ? selectedPainPoints.slice(0, 4) 
        : [
          'Manual pipeline orchestration creating operational latency bottlenecks',
          'Siloed metadata visibility impeding cross-functional compliance auditing',
          'Cloud infrastructure compute spend lack of real-time auto-termination policies'
        ],
      transformationRoadmap: {
        phase1: {
          title: 'Phase 1: Foundation, Unified Governance & FinOps Quick Wins',
          timeline: '1–3 Months',
          focus: 'Eliminate security vulnerabilities and stop cloud spend leakage',
          milestones: [
            'Deploy unified Unity Catalog / Cloud Metastore and map IAM role delegations',
            'Configure 15-minute auto-termination policies on all development SQL warehouses',
            'Enable automated Delta Lake / Apache Iceberg UniForm for zero-copy sharing'
          ]
        },
        phase2: {
          title: 'Phase 2: Modernization, Declarative Streaming & MLOps Registry',
          timeline: '3–6 Months',
          focus: 'Automate data movement and centralize production ML model deployments',
          milestones: [
            'Migrate batch pipelines to Serverless Auto-Loader with schema evolution',
            'Deploy centralized MLflow Model and Prompt Registry with automated evaluation gates',
            'Implement declarative data pipelines (SDF / dbt) with automated data quality expectations'
          ]
        },
        phase3: {
          title: 'Phase 3: Autonomous Multi-Agent Mesh & Continuous FinOps Optimization',
          timeline: '6–12 Months',
          focus: 'Scale Compound GenAI systems with enterprise-grade latency and cost control',
          milestones: [
            'Implement Model Context Protocol (MCP) standardized tool calling across agents',
            'Configure Prompt Context Caching for 75% input token discount on repeated schemas',
            'Deploy self-service semantic metric layer for sub-second executive BI query acceleration'
          ]
        }
      },
      strategicRoadmap: {
        phase1: {
          title: 'Phase 1: Foundation, Unified Governance & FinOps Quick Wins',
          timeline: '1–3 Months',
          focus: 'Eliminate security vulnerabilities and stop cloud spend leakage',
          milestones: [
            'Deploy unified Unity Catalog / Cloud Metastore and map IAM role delegations',
            'Configure 15-minute auto-termination policies on all development SQL warehouses',
            'Enable automated Delta Lake / Apache Iceberg UniForm for zero-copy sharing'
          ]
        },
        phase2: {
          title: 'Phase 2: Modernization, Declarative Streaming & MLOps Registry',
          timeline: '3–6 Months',
          focus: 'Automate data movement and centralize production ML model deployments',
          milestones: [
            'Migrate batch pipelines to Serverless Auto-Loader with schema evolution',
            'Deploy centralized MLflow Model and Prompt Registry with automated evaluation gates',
            'Implement declarative data pipelines (SDF / dbt) with automated data quality expectations'
          ]
        },
        phase3: {
          title: 'Phase 3: Autonomous Multi-Agent Mesh & Continuous FinOps Optimization',
          timeline: '6–12 Months',
          focus: 'Scale Compound GenAI systems with enterprise-grade latency and cost control',
          milestones: [
            'Implement Model Context Protocol (MCP) standardized tool calling across agents',
            'Configure Prompt Context Caching for 75% input token discount on repeated schemas',
            'Deploy self-service semantic metric layer for sub-second executive BI query acceleration'
          ]
        }
      },
      prioritizedRecommendations: Object.values(scores.dimensionScores || {}).slice(0, 3).map((dim, idx) => ({
        id: idx + 1,
        title: `Modernize ${dim.name} Architecture & Governance Controls`,
        dimension: dim.name,
        priority: idx === 0 ? 'Critical' : 'High',
        timeline: idx === 0 ? '1–2 Months' : '2–4 Months',
        whyItMatters: `Identified capability gap in ${dim.name} (Score: ${dim.score}/5.0) limits team velocity and increases operational risk.`,
        actionSteps: [
          `Audit current ${dim.name} pipelines and establish automated CI/CD deployment gates`,
          `Deploy standardized data contracts and continuous drift detection alerts`,
          `Implement tag-based attribute access control (ABAC) and FinOps resource tagging`
        ],
        expectedImpact: '40% acceleration in delivery velocity and quantified reduction in compliance exposure.'
      })),
      expectedOutcomes: [
        '40% reduction in data engineering pipeline maintenance overhead',
        '75% cost reduction on repeated LLM agent inference via Prompt Context Caching',
        'Sub-second query response times with serverless vectorized SQL engines'
      ],
      generatedAt: new Date().toISOString(),
      modelUsed: 'rule-based-deterministic-synthesis',
      calculatedScores: scores,
      architectureDiagrams: this._generateDeterministicDiagramsFallback(framework, instance, scores)
    };
  }

  /**
   * AI-generate bespoke Draw.io XML Architecture Diagrams using Gemini 3.7 Flash
   */
  async generateArchitectureDiagramsWithGemini(framework, responses = {}, scores = {}, metadata = {}, customInstructions = '') {
    console.log(`🤖 [Gemini 3.7 Flash] Generating bespoke Architecture Diagrams for: ${metadata.customerName || 'Enterprise Client'} (${framework.title})...`);

    // Extract pain points, notes, dimension scores
    const selectedPainPoints = [];
    const commentsList = [];
    if (responses) {
      Object.entries(responses).forEach(([k, v]) => {
        if (k.endsWith('_painPoints') && Array.isArray(v)) {
          v.forEach(p => selectedPainPoints.push(`- ${p}`));
        }
        if (k.endsWith('_notes') && typeof v === 'string' && v.trim()) {
          commentsList.push(`- ${v.trim()}`);
        }
      });
    }

    const systemInstruction = `You are a Principal Enterprise Cloud & AI Solutions Architect at the highest industry tier.
Your role is to generate authentic, production-ready Draw.io / mxGraph XML architecture diagrams representing:
1. CURRENT BASELINE ARCHITECTURE (Current State): The client's specific legacy stack, fragmented tools, batch scripts, static clusters, unmanaged data lakes, bottlenecks, and identified technical debt.
2. DESIRED FUTURE STATE ARCHITECTURE (Target State): The modern, governed, scalable, domain-accurate target state tailored to the client's actual cloud environment and assessment domain.

CRITICAL VENDOR-NEUTRALITY & DOMAIN RELEVANCE MANDATE:
- NEVER force Databricks, Unity Catalog, Delta Lake, or Photon into the diagram UNLESS the assessment explicitly requests Databricks.
- Match the architecture technologies strictly to the assessment framework and customer context:
  * If FINOPS / CLOUD COST: Focus on Kubernetes (EKS/GKE) Autopilot, FOCUS 1.0 Cloud Billing Export, OpenCost/Kubecost, Anomaly Alerting, 15-min auto-suspend, and multi-tenant attribution.
  * If GENAI / AGENTIC AI: Focus on Model Context Protocol (MCP), Model Gateway & Guardrails, Vector Databases, RAG Grounding, Prompt Context Caching (75% token discount), Multi-Agent Mesh, and CMEK isolation.
  * If GOOGLE CLOUD: Focus on Cloud Pub/Sub, Cloud Dataflow (Beam), Cloud Storage, BigQuery BigLake (Apache Iceberg), Dataplex Universal Catalog, Vertex AI Multi-Agent, Gemini 3.7 Flash Reasoner, and Looker.
  * If AWS: Focus on Amazon MSK, AWS Glue, Amazon S3 (Apache Iceberg), AWS Lake Formation, Amazon Bedrock Agentic Mesh, and Amazon QuickSight.
  * If SNOWFLAKE: Focus on Fivetran/Kafka, Snowflake Polaris Catalog (Apache Iceberg), dbt Core/Cloud, Snowflake Cortex AI, and Streamlit.
  * If VENDOR-NEUTRAL / GENERAL DATA & AI: Focus on Open Standards (Apache Kafka, Apache Iceberg, Apache Polaris Catalog / OpenMetadata, Trino / Serverless SQL, MLflow / Model Registry, MCP Multi-Agent Mesh, and Semantic Metric Layer).

CRITICAL XML FORMAT & TYPOGRAPHY RULES:
- Return a strictly valid JSON object matching the output schema.
- "currentStateXml" and "targetStateXml" must contain valid Draw.io / mxGraph XML starting with:
<mxGraphModel dx="1200" dy="800" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1400" pageHeight="850" background="#0f172a" math="0" shadow="0"><root><mxCell id="0"/><mxCell id="1" parent="0"/>... and ending with </root></mxGraphModel>.
- Top Header Banner: x=40, y=20, width=1320, height=60, title font-size:15px, subtitle font-size:10.5px.
- 4 Granular Swimlanes across X=40, 380, 720, 1060 (width=280 to 300, height=660, startSize=44). Header title font-size:11px, header subtitle font-size:9px.
- Card Geometry & Typography (CRITICAL TO PREVENT OVERFLOW):
  * Card dimensions: x=20, width=240 (or 260 in last lane), height=85.
  * Card title style: &lt;b style=&quot;font-size:10.5px;color:...;line-height:1.2;&quot;&gt;Title&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:8.5px;color:#cbd5e1;line-height:1.3;&quot;&gt;Sub-items and metrics&lt;/span&gt;
  * Never use font-size > 11px inside card bodies.
  * Warning badges (Current State): height=55, &lt;b style=&quot;font-size:9.5px;color:#ef4444;&quot;&gt;⚠️ Warning Title&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:8px;color:#fca5a5;&quot;&gt;Quantified bottleneck&lt;/span&gt;
  * Value badges (Target State): height=55, &lt;b style=&quot;font-size:9.5px;color:#10b981;&quot;&gt;✓ Value Unlock&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:8px;color:#a7f3d0;&quot;&gt;Quantified ROI metric&lt;/span&gt;
- For CURRENT STATE: Use dark reddish/amber/slate palette (fillColor=#311018, strokeColor=#f43f5e, fontColor=#ffffff, title #f87171).
- For DESIRED FUTURE STATE: Use modern emerald/teal/indigo palette (fillColor=#064e3b, strokeColor=#10b981, fontColor=#ffffff, title #34d399).
- Connect cards across stages with orthogonal directional arrows (&lt;mxCell style=&quot;edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;strokeWidth=2;...&quot; edge=&quot;1&quot; parent=&quot;1&quot; source=&quot;...&quot; target=&quot;...&quot;/&gt;).
- Do NOT truncate or abbreviate XML. Return full, syntactically complete mxGraphModel trees.`;

    const userPrompt = `ENTERPRISE ARCHITECTURE CONTEXT:
- Assessment Framework: ${framework.title || 'Enterprise Data & AI Maturity Assessment'}
- Subtitle: ${framework.subtitle || ''}
- Customer Name: ${metadata.customerName || 'Enterprise Organization'}
- Strategic Initiative / Business Use Case: ${metadata.useCase || 'Core Enterprise Modernization'}
- Overall Maturity Score: ${scores.overallScore || 2.5} / 5.0 (${scores.maturityLevel || 'Developing'})
- Dimension Scores:
${Object.values(scores.dimensionScores || {}).map(d => `  * ${d.name}: ${d.score}/5.0`).join('\n')}

IDENTIFIED PAIN POINTS & BOTTLENECKS:
${selectedPainPoints.length > 0 ? selectedPainPoints.join('\n') : 'Legacy batch latency, fragmented data silos, unmanaged cluster spend, slow analytics turnaround.'}

ASSESSOR CONTEXTUAL NOTES:
${commentsList.length > 0 ? commentsList.join('\n') : 'Standard deployment assessment.'}

${customInstructions ? `USER FOCUS INSTRUCTIONS:\n${customInstructions}\n` : ''}

Generate a strictly valid JSON response matching this schema:
{
  "reasoning": "<2-3 sentence architectural explanation of the transformation journey tailored to this customer and domain>",
  "currentTitle": "<Title for Current State, e.g. Current Baseline Architecture: Legacy Batch & Fragmented Silos>",
  "currentSubtitle": "<Subtitle, e.g. Maturity Level 2.6 (Developing) • 38% Failure Rate • Static VM Waste>",
  "targetTitle": "<Title for Target State, e.g. Desired Future State: Modern Open Lakehouse & Autonomous Agentic Mesh>",
  "targetSubtitle": "<Subtitle, e.g. Target Maturity Level 4.5 (Optimized) • Sub-Second Streaming • Zero-Copy Governance>",
  "currentStateXml": "<COMPLETE Draw.io mxGraphModel XML for Current Baseline Architecture>",
  "targetStateXml": "<COMPLETE Draw.io mxGraphModel XML for Desired Future State Modern Architecture>",
  "keyTransformations": [
    "<Key shift 1: e.g. Nightly cron batch -> Real-time CDC Auto-Loader>",
    "<Key shift 2: e.g. Siloed buckets -> Open Table Formats (Apache Iceberg) with centralized governance>",
    "<Key shift 3: e.g. Static 24/7 VMs -> Serverless FinOps compute with 15-min auto-suspend>",
    "<Key shift 4: e.g. Unguarded APIs -> Model Context Protocol (MCP) Multi-Agent Mesh with 75% prompt context caching>"
  ]
}`;

    try {
      const result = await this.gemini._generateWithFallback(
        userPrompt + '\n\nIMPORTANT: Output ONLY pure JSON matching the schema.',
        systemInstruction,
        0.7,
        'application/json'
      );

      let parsed = null;
      try {
        parsed = JSON.parse(result.text);
      } catch (e) {
        const match = result.text.match(/\{[\s\S]*\}/);
        if (match) parsed = JSON.parse(match[0]);
      }

      if (parsed && parsed.currentStateXml && parsed.targetStateXml) {
        parsed.currentStateXml = this._sanitizeDrawioXml(parsed.currentStateXml);
        parsed.targetStateXml = this._sanitizeDrawioXml(parsed.targetStateXml);
        parsed.generatedAt = new Date().toISOString();
        parsed.modelUsed = result.modelUsed;
        console.log(`✅ Architecture diagrams successfully generated by ${result.modelUsed}`);
        return parsed;
      }
    } catch (err) {
      console.warn('⚠️ Gemini diagram generation failed, falling back to deterministic diagrams:', err.message);
    }

    // Fallback to high-craft deterministic diagrams
    return this._generateDeterministicDiagramsFallback(framework, metadata, scores);
  }

  _generateDeterministicDiagramsFallback(framework = {}, metadata = {}, scores = {}) {
    const cust = metadata.customerName || metadata.customer || "Enterprise Client";
    const lvl = scores.overallScore || 2.6;
    const tgt = 4.5;
    const key = (framework.typeKey || "").toLowerCase();
    const title = (framework.title || "").toLowerCase();

    const isGenAI = key.includes("openai") || key.includes("gemini") || title.includes("gemini") || title.includes("openai") || title.includes("genai");
    const isSecurity = key.includes("security") || key.includes("zero_trust") || key.includes("ciso") || title.includes("security") || title.includes("zero trust");
    const isLakehouse = key.includes("lakehouse") || key.includes("bigquery") || key.includes("edw") || key.includes("snowflake") || title.includes("lakehouse") || title.includes("bigquery") || title.includes("snowflake");
    const isFinOps = key.includes("finops") || key.includes("cost") || key.includes("billing") || title.includes("finops") || title.includes("cost");

    let currentTitle = "Current Baseline: Fragmented Legacy Silos (" + cust + ")";
    let currentSubtitle = "Maturity Level " + lvl + "/5.0 (Developing) • Brittle Cron Batch • Data Silos • Static VM Costs";
    let curReasoning = "Fragmented legacy pipelines and batch cron jobs cause high failure rates, unmonitored infrastructure spend, and delayed business analytics.";
    
    let curL1Title = "STAGE 1: INGESTION"; let curL1Sub = "Brittle Batch & SFTP";
    let curC1_1T = "Legacy OLTP & Files"; let curC1_1S = "Postgres, MySQL, SFTP<br>Point-to-point unmanaged exports";
    let curC1_2T = "Cron Batch Scripts"; let curC1_2S = "Python/Bash cron jobs<br>24-hour latency, no dead-letter queue";
    let curWarn1T = "⚠️ 38% Failure Rate"; let curWarn1S = "Silent schema breakages halt nightly ETL runs";

    let curL2Title = "STAGE 2: DATA SILOS"; let curL2Sub = "Split Warehouse + Lakes";
    let curC2_1T = "Unmanaged Cloud Buckets"; let curC2_1S = "Raw CSV / JSON dumps<br>Fragmented bucket ACLs, no lineage";
    let curC2_2T = "Isolated Data Warehouse"; let curC2_2S = "Proprietary SQL Warehouse<br>Duplicate data copies & sync lag";
    let curWarn2T = "⚠️ Manual IAM Spreadsheets"; let curWarn2S = "No automated row/column masking";

    let curL3Title = "STAGE 3: COMPUTE & MLOps"; let curL3Sub = "Over-Provisioned Clusters";
    let curC3_1T = "Static 24/7 Compute VMs"; let curC3_1S = "Always-on oversized clusters<br>Lack of automated auto-termination";
    let curC3_2T = "Disconnected Notebooks"; let curC3_2S = "Ad-hoc local Jupyter environments<br>No centralized model registry";
    let curWarn3T = "⚠️ $480k Annual Idle Waste"; let curWarn3S = "Zero cluster FinOps kill switches";

    let curL4Title = "STAGE 4: SERVING & BI"; let curL4Sub = "Unguarded LLMs & Heavy Backlog";
    let curC4_1T = "Direct Unguarded LLM APIs"; let curC4_1S = "No prompt caching (100% token spend)<br>No enterprise PII filters or guardrails";
    let curC4_2T = "Stale Daily BI Extracts"; let curC4_2S = "Slow queries over legacy schemas<br>14-day turnaround on custom metrics";
    let curWarn4T = "⚠️ 14-Day Delivery Lag"; let curWarn4S = "Analyst team overwhelmed by custom SQL";

    let curFoundTitle = "⚠️ FRAGMENTED PERIMETER & COMPLIANCE (CROSS-CUTTING TECHNICAL DEBT)";
    let curFoundSub = "Siloed IAM Accounts • Public Egress Endpoints • Hardcoded Keys • 14-Day Manual SOC2 Audit Prep";

    let targetTitle = "Target State: Modern Open Lakehouse & Agentic Mesh (" + cust + ")";
    let targetSubtitle = "Target Maturity Level " + tgt + "/5.0 (Optimized) • Sub-Second Streaming • Apache Iceberg • Serverless FinOps";
    let tgtL1Title = "STAGE 1: REAL-TIME INGESTION"; let tgtL1Sub = "Declarative Streaming & CDC";
    let tgtC1_1T = "Multi-Source Event Streams"; let tgtC1_1S = "Kafka, Kinesis, Google Pub/Sub<br>Sub-second real-time event capture";
    let tgtC1_2T = "Serverless Auto-Loader / CDC"; let tgtC1_2S = "Automated schema evolution<br>Declarative data transformations";
    let tgtVal1T = "✓ Zero Ingestion Latency"; let tgtVal1S = "Automated retry & dead-letter isolation";

    let tgtL2Title = "STAGE 2: OPEN LAKEHOUSE"; let tgtL2Sub = "Apache Iceberg & Open Formats";
    let tgtC2_1T = "Open Table Formats"; let tgtC2_1S = "Apache Iceberg / BigLake<br>Single source of truth, zero lock-in";
    let tgtC2_2T = "Centralized Metadata & Lineage"; let tgtC2_2S = "Dataplex Universal Catalog<br>Row/column masking & end-to-end lineage";
    let tgtVal2T = "✓ Unified Governance Plane"; let tgtVal2S = "Cross-cloud zero-copy data sharing";

    let tgtL3Title = "STAGE 3: SERVERLESS FINOPS"; let tgtL3Sub = "Autoscaling Vectorized Engine";
    let tgtC3_1T = "Serverless Vectorized SQL"; let tgtC3_1S = "Instant 15-min auto-suspend switches<br>35% to 50% compute TCO savings";
    let tgtC3_2T = "Production MLOps Registry"; let tgtC3_2S = "Automated CI/CD model verification<br>Real-time concept drift & feature store";
    let tgtVal3T = "✓ Automated FinOps & CI/CD"; let tgtVal3S = "Zero idle spend & fully tracked models";

    let tgtL4Title = "STAGE 4: AI MESH & BI"; let tgtL4Sub = "MCP Protocol & Semantic Layer";
    let tgtC4_1T = "Compound Multi-Agent Mesh"; let tgtC4_1S = "MCP protocol & 75% prompt context caching<br>Zero-Trust AI guardrails & CMEK isolation";
    let tgtC4_2T = "Self-Service Semantic BI Layer"; let tgtC4_2S = "Looker Semantic Model<br>Sub-second dashboard refresh speeds";
    let tgtVal4T = "✓ Real-Time Self-Service"; let tgtVal4S = "Instant answers for BI & autonomous agents";

    let tgtFoundTitle = "🛡️ UNIFIED GOVERNANCE & SECURITY FOUNDATION (CROSS-CUTTING CONTROLS)";
    let tgtFoundSub = "Dataplex Universal Catalog • VPC Service Controls • Customer-Managed CMEK • Chronicle SIEM";

    let transformations = [
      "Shift from 24h cron batch scripts to sub-second streaming CDC data contracts",
      "Consolidate siloed relational databases into an open table format Lakehouse (Apache Iceberg)",
      "Replace static 24/7 VMs with serverless autoscaling compute engines (15-min auto-suspend)",
      "Deploy Compound Multi-Agent Mesh with Model Context Protocol (MCP) & 75% prompt context caching"
    ];

    if (isGenAI) {
      currentTitle = "Current Baseline: Brittle OpenAI Endpoints & High Token Costs (" + cust + ")";
      currentSubtitle = "Maturity Level " + lvl + "/5.0 (Developing) • 8k Chunked RAG Loss • 100% Token Inefficiency • Prompt Injection Risk";
      curReasoning = "Direct un-cached OpenAI and Azure endpoints cause exorbitant token bills, 8k context chunking loss, high latency, and vulnerability to indirect prompt injection.";

      curL1Title = "STAGE 1: CONSUMER APPS"; curL1Sub = "Public API Calls & Git Keys";
      curC1_1T = "Direct OpenAI API Calls"; curC1_1S = "Public internet endpoints<br>Hardcoded developer keys in local repos";
      curC1_2T = "Unmanaged Developer Chat"; curC1_2S = "Public LLM web interfaces<br>Proprietary code pasted without DLP masking";
      curWarn1T = "⚠️ Severe Data Leakage Risk"; curWarn1S = "Zero perimeter isolation or API key rotation";

      curL2Title = "STAGE 2: FRAGMENTED RAG"; curL2Sub = "8k Chunking & High Latency";
      curC2_1T = "Static Vector Database"; curC2_1S = "Ad-hoc open source vector store<br>Missing enterprise RBAC document filters";
      curC2_2T = "Lossy Text Chunking (8k)"; curC2_2S = "Splitting 500-page docs into snippets<br>High semantic loss & hallucination rate";
      curWarn2T = "⚠️ 42% Hallucination Surge"; curWarn2S = "Missing cross-document synthesis context";

      curL3Title = "STAGE 3: RUNTIME COST"; curL3Sub = "Exorbitant Token Inefficiency";
      curC3_1T = "Zero Context Caching"; curC3_1S = "Reprocessing 100k system prompt tokens on every request<br>Exorbitant monthly API bills";
      curC3_2T = "Unmonitored Rate Limits"; curC3_2S = "HTTP 429 throttling spikes during peak<br>No multi-region automatic model failover";
      curWarn3T = "⚠️ $620k Annual LLM Spend"; curWarn3S = "100% full price paid on every token";

      curL4Title = "STAGE 4: UNGUARDED AGENTS"; curL4Sub = "Custom Tool Script Sprawl";
      curC4_1T = "Hardcoded Agent Chains"; curC4_1S = "Brittle LangChain / custom glue code<br>No standard schema protocol or validation";
      curC4_2T = "Unguarded Model Outputs"; curC4_2S = "Direct SQL / code execution from LLMs<br>Vulnerable to jailbreaks & SSRF exploits";
      curWarn4T = "⚠️ Critical Security Vulnerability"; curWarn4S = "Direct tool execution without guardrail sandboxes";

      curFoundTitle = "⚠️ UNPROTECTED MODEL PERIMETER: Hardcoded Secrets, No DLP Filters, Missing Model Armor";
      curFoundSub = "No VPC Service Controls • Unencrypted API Keys in Code • Zero Prompt Injection Filtering • Ephemeral Logs";

      targetTitle = "Target State: Google Vertex AI & Gemini Enterprise Mesh (" + cust + ")";
      targetSubtitle = "Target Maturity Level " + tgt + "/5.0 (Optimized) • Gemini 2M Context • 75% Prompt Caching • Model Armor Defense";

      tgtL1Title = "STAGE 1: APIGEE AI GATEWAY"; tgtL1Sub = "Centralized Routing & Quotas";
      tgtC1_1T = "Enterprise AI Gateway"; tgtC1_1S = "Apigee LLM Gateway + VPC-SC<br>Zero public endpoints, strict token quotas";
      tgtC1_2T = "Real-Time Cloud DLP"; tgtC1_2S = "Surrogate tokenization & PII masking<br>Automated HIPAA / GDPR compliance filters";
      tgtVal1T = "✓ 100% Data Perimeter Guard"; tgtVal1S = "Zero PII leakage into external training sets";

      tgtL2Title = "STAGE 2: NATIVE LONG-CONTEXT"; tgtL2Sub = "Gemini 2M Token Processing";
      tgtC2_1T = "Gemini 2.5 / 3.7 Pro & Flash"; tgtC2_1S = "1M–2M token native context window<br>Eliminating lossy vector chunking";
      tgtC2_2T = "Vertex Multimodal Embeddings"; tgtC2_2S = "Hybrid dense + sparse semantic search<br>Grounding with Enterprise Google Search";
      tgtVal2T = "✓ 98.4% Factuality & Recall"; tgtVal2S = "Complete multi-document holistic reasoning";

      tgtL3Title = "STAGE 3: FINOPS PROMPT CACHING"; tgtL3Sub = "75% Token Discount Engine";
      tgtC3_1T = "Vertex Context Caching"; tgtC3_1S = "75% cost discount on cached system instructions<br>Sub-200ms TTFT latency response";
      tgtC3_2T = "Dynamic Model Cascading"; tgtC3_2S = "Flash for high-volume triage (90%)<br>Pro for complex multi-step reasoning (10%)";
      tgtVal3T = "✓ 68% GenAI TCO Savings"; tgtVal3S = "$420k annualized API cost reduction";

      tgtL4Title = "STAGE 4: MCP AGENTIC MESH"; tgtL4Sub = "Model Context Protocol & Armor";
      tgtC4_1T = "Model Context Protocol (MCP)"; tgtC4_1S = "Standardized open protocol tool calling<br>Decoupled backend tool microservices";
      tgtC4_2T = "Google Cloud Model Armor"; tgtC4_2S = "Real-time prompt injection sanitization<br>Automated jailbreak & toxicity shielding";
      tgtVal4T = "✓ Enterprise Sandboxed Agents"; tgtVal4S = "Autonomous execution with strict guardrails";

      tgtFoundTitle = "🛡️ VERTEX AI ZERO-TRUST PERIMETER: VPC Service Controls • Cloud KMS CMEK • Model Armor";
      tgtFoundSub = "Google Security Operations (Chronicle) • Automated DLP Surrogate Tokenization • IAM Workload Federation";

      transformations = [
        "Migrate brittle OpenAI API calls to Apigee Enterprise AI Gateway with VPC Service Controls",
        "Replace 8k lossy RAG chunking with Vertex AI Gemini 2M native long-context processing",
        "Enable Vertex AI Prompt Context Caching for 75% input token discount and sub-200ms latency",
        "Deploy Google Cloud Model Armor and Model Context Protocol (MCP) for sandboxed agent defense"
      ];
    } else if (isSecurity) {
      currentTitle = "Current Baseline: Shadow AI Exposure & Static Key Sprawl (" + cust + ")";
      currentSubtitle = "Maturity Level " + lvl + "/5.0 (Developing) • Unmonitored Shadow AI • Static JSON Keys • Raw PII in Prompts";
      curReasoning = "Unmanaged employee and application access to external AI platforms, static service account keys, lack of real-time DLP, and siloed log storage expose the enterprise to data exfiltration and regulatory penalties.";

      curL1Title = "STAGE 1: SHADOW AI & EGRESS"; curL1Sub = "Unmonitored Web Usage";
      curC1_1T = "Unmanaged AI Traffic"; curC1_1S = "Employees using personal LLM accounts<br>Source code & customer PII pasted into web chats";
      curC1_2T = "Public Internet Egress"; curC1_2S = "Open internet routing for model calls<br>Zero VPC perimeter or egress firewalls";
      curWarn1T = "⚠️ Uncontrolled IP Leakage"; curWarn1S = "Proprietary IP transmitted to public model servers";

      curL2Title = "STAGE 2: DATA & ENCRYPTION"; curL2Sub = "Raw PII & Default Keys";
      curC2_1T = "Unsanitized Prompts"; curC2_1S = "Raw customer SSNs, credit cards & PHI<br>Zero automated DLP inspection before inference";
      curC2_2T = "Provider-Managed Keys"; curC2_2S = "Default cloud encryption keys<br>No customer key control (CMEK) or shredding";
      curWarn2T = "⚠️ Regulatory Non-Compliance"; curWarn2S = "Severe penalties under EU AI Act, GDPR & HIPAA";

      curL3Title = "STAGE 3: IAM & PRIVILEGE"; curL3Sub = "Static JSON Service Accounts";
      curC3_1T = "Static Service Account Keys"; curC3_1S = "Downloadable JSON keys on dev laptops<br>Zero automated 90-day rotation";
      curC3_2T = "Standing Admin Rights"; curC3_2S = "Permanent superuser access for 25+ engineers<br>No peer review or emergency break-glass";
      curWarn3T = "⚠️ Broad Breach Blast Radius"; curWarn3S = "Compromised laptop yields full cloud admin rights";

      curL4Title = "STAGE 4: SECOPS & AUDIT"; curL4Sub = "Siloed Logs & Manual Audits";
      curC4_1T = "Fragmented Local Logs"; curC4_1S = "Application logs stored on ephemeral disks<br>No centralized SIEM correlation";
      curC4_2T = "Manual Incident Triage"; curC4_2S = "On-call engineers executing manual shell scripts<br>MTTR > 4.5 hours during incidents";
      curWarn4T = "⚠️ 14-Day Audit Prep Drag"; curWarn4S = "Engineering hours wasted on manual SOC2 screenshots";

      curFoundTitle = "⚠️ UNMANAGED CREDENTIAL & LOG PLANE: Ephemeral Disks, No Central SIEM, Standing IAM";
      curFoundSub = "Static Credentials on Laptops • Unencrypted Transit • Missing Real-Time DLP • Manual Incident Triage";

      targetTitle = "Target State: Enterprise AI & Zero-Trust Defense Mesh (" + cust + ")";
      targetSubtitle = "Target Maturity Level " + tgt + "/5.0 (Optimized) • Apigee AI Gateway • Real-Time Cloud DLP • Ephemeral OIDC • Chronicle SIEM";

      tgtL1Title = "STAGE 1: ENTERPRISE GATEWAY"; tgtL1Sub = "Apigee Gateway & VPC-SC";
      tgtC1_1T = "Centralized AI Gateway"; tgtC1_1S = "Apigee Enterprise AI Gateway<br>100% interception of developer & app AI calls";
      tgtC1_2T = "VPC Service Controls"; tgtC1_2S = "Cryptographic perimeter defense<br>Blocking unauthorized data exfiltration";
      tgtVal1T = "✓ 100% Shadow AI Containment"; tgtVal1S = "Zero unauthorized AI traffic across enterprise";

      tgtL2Title = "STAGE 2: DATA PROTECTION"; tgtL2Sub = "Real-Time DLP & Cloud EKM";
      tgtC2_1T = "Real-Time Cloud DLP Mesh"; tgtC2_1S = "Dynamic PII/PHI surrogate tokenization<br>Reversible masking under strict RBAC";
      tgtC2_2T = "Customer-Managed EKM / CMEK"; tgtC2_2S = "Cloud KMS FIPS 140-3 HSM keys<br>Key Access Justifications (KAJ) audit logging";
      tgtVal2T = "✓ Cryptographic Key Control"; tgtVal2S = "Instant cryptographic tenant data shredding";

      tgtL3Title = "STAGE 3: ZERO-TRUST IAM"; tgtL3Sub = "Workload Federation (OIDC)";
      tgtC3_1T = "Workload Identity Federation"; tgtC3_1S = "100% elimination of static JSON keys<br>Short-lived OIDC tokens for CI/CD & apps";
      tgtC3_2T = "Just-in-Time PAM Elevation"; tgtC3_2S = "Automated ephemeral elevation (<4h)<br>Full session recording & peer approval";
      tgtVal3T = "✓ Zero Standing Privileges"; tgtVal3S = "Elimination of persistent credential attack surface";

      tgtL4Title = "STAGE 4: SECOPS & SOAR"; tgtL4Sub = "Chronicle SIEM & Model Armor";
      tgtC4_1T = "Google Security Operations"; tgtC4_1S = "Chronicle SIEM ingesting 100% of audit logs<br>Sub-second threat hunting across petabytes";
      tgtC4_2T = "Automated SOAR Playbooks"; tgtC4_2S = "Sub-2 minute automated token revocation<br>Continuous ISO 42001 & NIST compliance";
      tgtVal4T = "✓ Autonomous Threat Response"; tgtVal4S = "Sub-2 minute automated incident containment";

      tgtFoundTitle = "🛡️ SECURE ENTERPRISE BOUNDARY: Cloud KMS CMEK • Workload Identity Federation • Chronicle SIEM";
      tgtFoundSub = "Apigee Enterprise AI Gateway • Cloud DLP Dynamic Masking • VPC Service Controls • JIT PAM Approval";

      transformations = [
        "Deploy Apigee Enterprise AI Gateway and VPC Service Controls to contain 100% of shadow AI traffic",
        "Implement Real-Time Cloud DLP dynamic surrogate tokenization and Cloud EKM hardware encryption",
        "Eliminate all static service account keys via Workload Identity Federation (OIDC) and Just-in-Time PAM",
        "Stream Cloud Audit Logs to Google Security Operations (Chronicle SIEM) with automated SOAR playbooks"
      ];
    } else if (isLakehouse) {
      currentTitle = "Current Baseline: Siloed Proprietary EDW & Egress Friction (" + cust + ")";
      currentSubtitle = "Maturity Level " + lvl + "/5.0 (Developing) • Proprietary Lock-In • 40% Compute Spikes • Heavy Egress Fees";
      curReasoning = "Legacy proprietary data warehouses (Teradata/Snowflake/Databricks) cause unmanaged compute credit volatility, expensive multi-cloud data copying, duplicate storage formats, and delayed analytics delivery.";

      curL1Title = "STAGE 1: BATCH INGESTION"; curL1Sub = "Brittle Point-to-Point Pipelines";
      curC1_1T = "Legacy ETL Tools"; curC1_1S = "Informatica, DataStage, SSIS<br>Complex maintenance & high licensing fees";
      curC1_2T = "Cross-Cloud SFTP Transfers"; curC1_2S = "Uncompressed daily batch CSVs<br>High network egress transfer costs";
      curWarn1T = "⚠️ $280k Annual Egress Fees"; curWarn1S = "Unnecessary multi-cloud network transfer drag";

      curL2Title = "STAGE 2: PROPRIETARY STORAGE"; curL2Sub = "Vendor Format Lock-In";
      curC2_1T = "Closed Storage Formats"; curC2_1S = "Proprietary database micro-partitions<br>Requires paid compute clusters just to read";
      curC2_2T = "Duplicate Data Copies"; curC2_2S = "Replicating tables for BI and ML squads<br>High storage sprawl & governance drift";
      curWarn2T = "⚠️ Vendor Lock-In Trap"; curWarn2S = "Inability to query data with open-source tools";

      curL3Title = "STAGE 3: COMPUTE CREDITS"; curL3Sub = "Unpredictable Credit Consumption";
      curC3_1T = "Fixed Compute Warehouses"; curC3_1S = "Always-on medium/large clusters<br>Surging credit consumption during ETL runs";
      curC3_2T = "Unoptimized Query Plans"; curC3_2S = "Cartesian joins and un-clustered queries<br>Draining monthly budget before month-end";
      curWarn3T = "⚠️ 40% Budget Overruns"; curWarn3S = "Surprise monthly cloud invoices";

      curL4Title = "STAGE 4: SERVING & BI"; curL4Sub = "Stale Extracts & Slow Queries";
      curC4_1T = "Daily Cubes & Extracts"; curC4_1S = "Pre-aggregated snapshot tables<br>Data is 24-hours stale before executives see it";
      curC4_2T = "Heavy Ad-Hoc SQL Backlog"; curC4_2S = "Data team building custom tables manually<br>10-day turnaround on executive requests";
      curWarn4T = "⚠️ Stale Executive Insights"; curWarn4S = "Decision makers operating on yesterday data";

      curFoundTitle = "⚠️ SILOED STORAGE & GOVERNANCE: Proprietary Lock-In, Fragmented Access Control, Multi-Cloud Egress";
      curFoundSub = "No Universal Catalog • Incompatible Cross-Engine Formats • Manual Spreadsheet ACLs • High Licensing";

      targetTitle = "Target State: Google BigQuery & BigLake Modern Fabric (" + cust + ")";
      targetSubtitle = "Target Maturity Level " + tgt + "/5.0 (Optimized) • BigLake Apache Iceberg • BigQuery Editions • Dataplex Governance";

      tgtL1Title = "STAGE 1: STREAMING & CDC"; tgtL1Sub = "Serverless Cloud Dataflow";
      tgtC1_1T = "Datastream Serverless CDC"; tgtC1_1S = "Real-time MySQL/Postgres/Oracle replication<br>Sub-second change capture into BigQuery";
      tgtC1_2T = "BigQuery Storage Write API"; tgtC1_2S = "High-throughput streaming ingestion<br>Exactly-once delivery semantics";
      tgtVal1T = "✓ Sub-Second Ingestion"; tgtVal1S = "Real-time data availability for downstream analytics";

      tgtL2Title = "STAGE 2: OPEN BIGLAKE"; tgtL2Sub = "Apache Iceberg & Delta Lake";
      tgtC2_1T = "BigLake Open Table Formats"; tgtC2_1S = "Apache Iceberg & Delta Lake storage<br>Query directly on Cloud Storage without copying";
      tgtC2_2T = "Dataplex Universal Catalog"; tgtC2_2S = "Unified metadata, automated data profiling<br>Attribute-based access control (ABAC)";
      tgtVal2T = "✓ Zero Vendor Lock-In"; tgtVal2S = "Single copy of data queryable by any open engine";

      tgtL3Title = "STAGE 3: BIGQUERY EDITIONS"; tgtL3Sub = "Autoscaling & BigQuery Omni";
      tgtC3_1T = "BigQuery Enterprise Slots"; tgtC3_1S = "Dynamic autoscaling slot commitments<br>Baseline slots with instant surge capacity";
      tgtC3_2T = "BigQuery Omni Multi-Cloud"; tgtC3_2S = "Query data in AWS S3 and Azure Blob<br>Zero data movement or egress charges";
      tgtVal3T = "✓ 45% Compute TCO Savings"; tgtVal3S = "Predictable monthly spend with slot reservations";

      tgtL4Title = "STAGE 4: BI & GEMINI SERVING"; tgtL4Sub = "Looker Semantic BI & Vertex AI";
      tgtC4_1T = "Looker Semantic Modeling"; tgtC4_1S = "Single source of truth for corporate metrics<br>Direct BigLake pushdown query execution";
      tgtC4_2T = "BigQuery Studio + Gemini AI"; tgtC4_2S = "SQL generation, automated data exploration<br>Direct ML model inference inside BigQuery";
      tgtVal4T = "✓ Real-Time Decision Velocity"; tgtVal4S = "Sub-second BI dashboards & conversational analytics";

      tgtFoundTitle = "🛡️ DATAPLEX GOVERNANCE & SECURITY: Fine-Grained Masking, Automated Lineage & VPC-SC";
      tgtFoundSub = "Dataplex Data Quality Rules • Column-Level Encryption (CMEK) • IAM ABAC Policies • Chronicle SIEM";

      transformations = [
        "Replace legacy batch ETL with Datastream CDC and BigQuery Storage Write API for real-time replication",
        "Adopt BigLake Apache Iceberg open table formats to eliminate proprietary data lock-in and egress fees",
        "Consolidate compute on BigQuery Editions autoscaling slots and BigQuery Omni for cross-cloud querying",
        "Deploy Looker Semantic Layer and BigQuery Studio with Gemini AI assistance for self-service analytics"
      ];
    } else if (isFinOps) {
      currentTitle = "Current Baseline: Uncontrolled Multi-Cloud Spend & Idle Waste (" + cust + ")";
      currentSubtitle = "Maturity Level " + lvl + "/5.0 (Developing) • 40% Untagged Resources • Static 24/7 Clusters • No Unit Economics";
      curReasoning = "Lack of standardized billing exports, missing resource tagging, over-provisioned static compute clusters, and uncoordinated cloud commitments result in significant financial waste and missed savings.";

      curL1Title = "STAGE 1: UNTAGGED ASSETS"; curL1Sub = "Missing Cost Attribution";
      curC1_1T = "Uncategorized Cloud Spend"; curC1_1S = "40% of cloud resources lack owner tags<br>Inability to identify department cost drivers";
      curC1_2T = "Fragmented Invoices"; curC1_2S = "Multiple cloud provider billing consoles<br>Manual CSV consolidation taking 8 days";
      curWarn1T = "⚠️ 40% Shadow Cloud Waste"; curWarn1S = "Millions in unallocated infrastructure spend";

      curL2Title = "STAGE 2: STATIC COMPUTE"; curL2Sub = "Always-On Oversized VMs";
      curC2_1T = "Static 24/7 Virtual Machines"; curC2_1S = "Development clusters running on weekends<br>Zero automated scheduled shutdown policies";
      curC2_2T = "Orphaned Cloud Storage"; curC2_2S = "Unattached persistent disks & old snapshots<br>Paying monthly storage fees for abandoned data";
      curWarn2T = "⚠️ $540k Idle Cluster Waste"; curWarn2S = "Paying for compute with 0% CPU utilization";

      curL3Title = "STAGE 3: UNTRACKED CONTAINERS"; curL3Sub = "Shared Cluster Black Hole";
      curC3_1T = "Multi-Tenant K8s Clusters"; curC3_1S = "Shared Kubernetes nodes without pod metering<br>No visibility into which microservice costs most";
      curC3_2T = "Unused Memory Allocations"; curC3_2S = "Developers over-requesting pod RAM & CPU<br>Actual utilization averaging only 18%";
      curWarn3T = "⚠️ 82% Cluster Over-Provisioning"; curWarn3S = "Paying for reserved capacity that is never used";

      curL4Title = "STAGE 4: UNMANAGED CUDs"; curL4Sub = "Missed Commitment Discounts";
      curC4_1T = "On-Demand Hourly Rates"; curC4_1S = "Workloads running on full list prices<br>Less than 30% commitment discount coverage";
      curC4_2T = "Unexpected Invoice Spikes"; curC4_2S = "Runaway ETL queries creating bill shocks<br>No automated budget alerts or quota caps";
      curWarn4T = "⚠️ Missed 50%+ CUD Discounts"; curWarn4S = "Overpaying for steady-state baseline workloads";

      curFoundTitle = "⚠️ MANUAL SPREADSHEET CHARGEBACK: 8-Day Financial Lag, No Unit Economics, Untagged Assets";
      curFoundSub = "No Automated Quota Caps • Unmonitored Billing Invoices • Zero Developer Accountability • List Prices";

      targetTitle = "Target State: Continuous Cloud FinOps & Unit Economics Fabric (" + cust + ")";
      targetSubtitle = "Target Maturity Level " + tgt + "/5.0 (Optimized) • FOCUS 1.0 Standard • OpenCost Pod Attribution • 85%+ CUD Coverage";

      tgtL1Title = "STAGE 1: FOCUS 1.0 BILLING"; tgtL1Sub = "Unified BigQuery Billing Lake";
      tgtC1_1T = "Automated Billing Export"; tgtC1_1S = "Daily export of GCP and AWS billing to BigQuery<br>FOCUS 1.0 open cost schema normalization";
      tgtC1_2T = "Automated Tagging Policy"; tgtC1_2S = "Terraform CI/CD automated resource tagging<br>100% cost attribution across all projects";
      tgtVal1T = "✓ 100% Ingestion Coverage"; tgtVal1S = "Single unified billing schema across all clouds";

      tgtL2Title = "STAGE 2: UNIT ECONOMICS"; tgtL2Sub = "OpenCost & Pod-Level Metrics";
      tgtC2_1T = "OpenCost / Kubecost Engine"; tgtC2_1S = "Real-time pod and namespace cost attribution<br>Direct allocation of shared cluster resources";
      tgtC2_2T = "Automated Chargeback Portals"; tgtC2_2S = "Self-service cost dashboards for squad leads<br>Unit cost metrics per customer transaction";
      tgtVal2T = "✓ 100% Cost Transparency"; tgtVal2S = "Engineering teams accountable for unit economics";

      tgtL3Title = "STAGE 3: COMPUTE FINOPS"; tgtL3Sub = "GKE Autopilot & Auto-Suspend";
      tgtC3_1T = "GKE Autopilot Dynamic Scaling"; tgtC3_1S = "Pod-level billing without paying for unused nodes<br>Instant 15-min auto-suspend switches";
      tgtC3_2T = "Automated Resource Rightsizer"; tgtC3_2S = "Continuous machine learning rightsizing engine<br>Automated pruning of orphaned storage disks";
      tgtVal3T = "✓ 45% Compute Bill Reduction"; tgtVal3S = "Zero idle spend on unutilized compute capacity";

      tgtL4Title = "STAGE 4: PROCUREMENT AI"; tgtL4Sub = "Automated CUD & Anomaly Alerting";
      tgtC4_1T = "Automated CUD Rebalancing"; tgtC4_1S = "Flexible 1-year and 3-year commitment planner<br>Achieving 85%+ commitment discount coverage";
      tgtC4_2T = "Real-Time Anomaly Detection"; tgtC4_2S = "AI-driven hourly spending anomaly triggers<br>Automated Slack / PagerDuty escalation";
      tgtVal4T = "✓ 35% Unit Cost Savings"; tgtVal4S = "Maximum discount tiers with automated protection";

      tgtFoundTitle = "🛡️ CONTINUOUS FINOPS GOVERNANCE: Automated Quota Caps, Budget Alarms & CUD Optimizer";
      tgtFoundSub = "FOCUS 1.0 BigQuery Schema • OpenCost Kubernetes Metric Exporter • Looker Executive Dashboards";

      transformations = [
        "Adopt FOCUS 1.0 open billing standard with automated daily export into BigQuery",
        "Deploy OpenCost for granular container and namespace unit economics cost attribution",
        "Migrate workloads to GKE Autopilot with automated 15-minute scale-to-zero kill switches",
        "Implement automated Committed Use Discount (CUD) rebalancing to achieve 85%+ coverage"
      ];
    }

    const currentXml = `<mxGraphModel dx="1200" dy="800" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1400" pageHeight="470" background="#0f172a" math="0" shadow="0"><root><mxCell id="0"/><mxCell id="1" parent="0"/><mxCell id="title" value="&lt;b style=&quot;font-size:14px;color:#f87171;&quot;&gt;⚠️ ${currentTitle.toUpperCase()}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:10px;color:#94a3b8;&quot;&gt;${currentSubtitle}&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#1e1b4b;strokeColor=#ef4444;strokeWidth=2;fontColor=#ffffff;align=center;shadow=1;" vertex="1" parent="1"><mxGeometry x="40" y="15" width="1320" height="50" as="geometry"/></mxCell><mxCell id="stage1_box" value="&lt;b style=&quot;color:#f87171;font-size:11px;&quot;&gt;${curL1Title}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:9px;color:#cbd5e1;&quot;&gt;${curL1Sub}&lt;/span&gt;" style="swimlane;html=1;startSize=40;fillColor=#1e293b;strokeColor=#f43f5e;fontColor=#ffffff;fontSize=11;fontStyle=1;rounded=1;" vertex="1" parent="1"><mxGeometry x="40" y="75" width="280" height="260" as="geometry"/></mxCell><mxCell id="s1_card1" value="&lt;b style=&quot;color:#fda4af;font-size:10.5px;&quot;&gt;${curC1_1T}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:8.5px;color:#cbd5e1;&quot;&gt;${curC1_1S}&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#311018;strokeColor=#f43f5e;fontColor=#ffffff;align=left;spacingLeft=8;" vertex="1" parent="stage1_box"><mxGeometry x="15" y="48" width="250" height="65" as="geometry"/></mxCell><mxCell id="s1_card2" value="&lt;b style=&quot;color:#fda4af;font-size:10.5px;&quot;&gt;${curC1_2T}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:8.5px;color:#cbd5e1;&quot;&gt;${curC1_2S}&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#311018;strokeColor=#f43f5e;fontColor=#ffffff;align=left;spacingLeft=8;" vertex="1" parent="stage1_box"><mxGeometry x="15" y="122" width="250" height="65" as="geometry"/></mxCell><mxCell id="s1_warn" value="&lt;b style=&quot;color:#ef4444;font-size:9.5px;&quot;&gt;${curWarn1T}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:8px;color:#fca5a5;&quot;&gt;${curWarn1S}&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#450a0a;strokeColor=#ef4444;fontColor=#ffffff;align=center;" vertex="1" parent="stage1_box"><mxGeometry x="15" y="196" width="250" height="50" as="geometry"/></mxCell><mxCell id="stage2_box" value="&lt;b style=&quot;color:#f87171;font-size:11px;&quot;&gt;${curL2Title}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:9px;color:#cbd5e1;&quot;&gt;${curL2Sub}&lt;/span&gt;" style="swimlane;html=1;startSize=40;fillColor=#1e293b;strokeColor=#f43f5e;fontColor=#ffffff;fontSize=11;fontStyle=1;rounded=1;" vertex="1" parent="1"><mxGeometry x="380" y="75" width="280" height="260" as="geometry"/></mxCell><mxCell id="s2_card1" value="&lt;b style=&quot;color:#fda4af;font-size:10.5px;&quot;&gt;${curC2_1T}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:8.5px;color:#cbd5e1;&quot;&gt;${curC2_1S}&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#311018;strokeColor=#f43f5e;fontColor=#ffffff;align=left;spacingLeft=8;" vertex="1" parent="stage2_box"><mxGeometry x="15" y="48" width="250" height="65" as="geometry"/></mxCell><mxCell id="s2_card2" value="&lt;b style=&quot;color:#fda4af;font-size:10.5px;&quot;&gt;${curC2_2T}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:8.5px;color:#cbd5e1;&quot;&gt;${curC2_2S}&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#311018;strokeColor=#f43f5e;fontColor=#ffffff;align=left;spacingLeft=8;" vertex="1" parent="stage2_box"><mxGeometry x="15" y="122" width="250" height="65" as="geometry"/></mxCell><mxCell id="s2_warn" value="&lt;b style=&quot;color:#ef4444;font-size:9.5px;&quot;&gt;${curWarn2T}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:8px;color:#fca5a5;&quot;&gt;${curWarn2S}&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#450a0a;strokeColor=#ef4444;fontColor=#ffffff;align=center;" vertex="1" parent="stage2_box"><mxGeometry x="15" y="196" width="250" height="50" as="geometry"/></mxCell><mxCell id="stage3_box" value="&lt;b style=&quot;color:#f87171;font-size:11px;&quot;&gt;${curL3Title}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:9px;color:#cbd5e1;&quot;&gt;${curL3Sub}&lt;/span&gt;" style="swimlane;html=1;startSize=40;fillColor=#1e293b;strokeColor=#f43f5e;fontColor=#ffffff;fontSize=11;fontStyle=1;rounded=1;" vertex="1" parent="1"><mxGeometry x="720" y="75" width="280" height="260" as="geometry"/></mxCell><mxCell id="s3_card1" value="&lt;b style=&quot;color:#fda4af;font-size:10.5px;&quot;&gt;${curC3_1T}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:8.5px;color:#cbd5e1;&quot;&gt;${curC3_1S}&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#311018;strokeColor=#f43f5e;fontColor=#ffffff;align=left;spacingLeft=8;" vertex="1" parent="stage3_box"><mxGeometry x="15" y="48" width="250" height="65" as="geometry"/></mxCell><mxCell id="s3_card2" value="&lt;b style=&quot;color:#fda4af;font-size:10.5px;&quot;&gt;${curC3_2T}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:8.5px;color:#cbd5e1;&quot;&gt;${curC3_2S}&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#311018;strokeColor=#f43f5e;fontColor=#ffffff;align=left;spacingLeft=8;" vertex="1" parent="stage3_box"><mxGeometry x="15" y="122" width="250" height="65" as="geometry"/></mxCell><mxCell id="s3_warn" value="&lt;b style=&quot;color:#ef4444;font-size:9.5px;&quot;&gt;${curWarn3T}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:8px;color:#fca5a5;&quot;&gt;${curWarn3S}&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#450a0a;strokeColor=#ef4444;fontColor=#ffffff;align=center;" vertex="1" parent="stage3_box"><mxGeometry x="15" y="196" width="250" height="50" as="geometry"/></mxCell><mxCell id="stage4_box" value="&lt;b style=&quot;color:#f87171;font-size:11px;&quot;&gt;${curL4Title}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:9px;color:#cbd5e1;&quot;&gt;${curL4Sub}&lt;/span&gt;" style="swimlane;html=1;startSize=40;fillColor=#1e293b;strokeColor=#f43f5e;fontColor=#ffffff;fontSize=11;fontStyle=1;rounded=1;" vertex="1" parent="1"><mxGeometry x="1060" y="75" width="300" height="260" as="geometry"/></mxCell><mxCell id="s4_card1" value="&lt;b style=&quot;color:#fda4af;font-size:10.5px;&quot;&gt;${curC4_1T}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:8.5px;color:#cbd5e1;&quot;&gt;${curC4_1S}&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#311018;strokeColor=#f43f5e;fontColor=#ffffff;align=left;spacingLeft=8;" vertex="1" parent="stage4_box"><mxGeometry x="15" y="48" width="260" height="65" as="geometry"/></mxCell><mxCell id="s4_card2" value="&lt;b style=&quot;color:#fda4af;font-size:10.5px;&quot;&gt;${curC4_2T}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:8.5px;color:#cbd5e1;&quot;&gt;${curC4_2S}&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#311018;strokeColor=#f43f5e;fontColor=#ffffff;align=left;spacingLeft=8;" vertex="1" parent="stage4_box"><mxGeometry x="15" y="122" width="260" height="65" as="geometry"/></mxCell><mxCell id="s4_warn" value="&lt;b style=&quot;color:#ef4444;font-size:9.5px;&quot;&gt;${curWarn4T}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:8px;color:#fca5a5;&quot;&gt;${curWarn4S}&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#450a0a;strokeColor=#ef4444;fontColor=#ffffff;align=center;" vertex="1" parent="stage4_box"><mxGeometry x="15" y="196" width="260" height="50" as="geometry"/></mxCell><mxCell id="cur_found_box" value="&lt;b style=&quot;color:#fca5a5;font-size:11px;&quot;&gt;${curFoundTitle}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:9px;color:#cbd5e1;&quot;&gt;${curFoundSub}&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#1e1b4b;strokeColor=#ef4444;strokeWidth=1.5;fontColor=#ffffff;align=center;shadow=1;" vertex="1" parent="1"><mxGeometry x="40" y="350" width="1320" height="85" as="geometry"/></mxCell><mxCell id="flow1" value="Data Friction" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;strokeWidth=2;strokeColor=#ef4444;dashed=1;fontColor=#fca5a5;fontSize=8.5;" edge="1" parent="1" source="s1_card2" target="s2_card1"><mxGeometry relative="1" as="geometry"/></mxCell><mxCell id="flow2" value="Unmanaged ETL" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;strokeWidth=2;strokeColor=#ef4444;dashed=1;fontColor=#fca5a5;fontSize=8.5;" edge="1" parent="1" source="s2_card2" target="s3_card1"><mxGeometry relative="1" as="geometry"/></mxCell><mxCell id="flow3" value="Manual Queries" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;strokeWidth=2;strokeColor=#ef4444;dashed=1;fontColor=#fca5a5;fontSize=8.5;" edge="1" parent="1" source="s3_card1" target="s4_card1"><mxGeometry relative="1" as="geometry"/></mxCell></root></mxGraphModel>`;

    const targetXml = `<mxGraphModel dx="1200" dy="800" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1400" pageHeight="470" background="#0f172a" math="0" shadow="0"><root><mxCell id="0"/><mxCell id="1" parent="0"/><mxCell id="title" value="&lt;b style=&quot;font-size:14px;color:#34d399;&quot;&gt;✨ ${targetTitle.toUpperCase()}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:10px;color:#94a3b8;&quot;&gt;${targetSubtitle}&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#064e3b;strokeColor=#10b981;strokeWidth=2;fontColor=#ffffff;align=center;shadow=1;" vertex="1" parent="1"><mxGeometry x="40" y="15" width="1320" height="50" as="geometry"/></mxCell><mxCell id="stage1_box" value="&lt;b style=&quot;color:#34d399;font-size:11px;&quot;&gt;${tgtL1Title}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:9px;color:#cbd5e1;&quot;&gt;${tgtL1Sub}&lt;/span&gt;" style="swimlane;html=1;startSize=40;fillColor=#022c22;strokeColor=#10b981;fontColor=#ffffff;fontSize=11;fontStyle=1;rounded=1;" vertex="1" parent="1"><mxGeometry x="40" y="75" width="280" height="260" as="geometry"/></mxCell><mxCell id="s1_card1" value="&lt;b style=&quot;color:#6ee7b7;font-size:10.5px;&quot;&gt;${tgtC1_1T}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:8.5px;color:#cbd5e1;&quot;&gt;${tgtC1_1S}&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#064e3b;strokeColor=#10b981;fontColor=#ffffff;align=left;spacingLeft=8;" vertex="1" parent="stage1_box"><mxGeometry x="15" y="48" width="250" height="65" as="geometry"/></mxCell><mxCell id="s1_card2" value="&lt;b style=&quot;color:#6ee7b7;font-size:10.5px;&quot;&gt;${tgtC1_2T}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:8.5px;color:#cbd5e1;&quot;&gt;${tgtC1_2S}&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#064e3b;strokeColor=#10b981;fontColor=#ffffff;align=left;spacingLeft=8;" vertex="1" parent="stage1_box"><mxGeometry x="15" y="122" width="250" height="65" as="geometry"/></mxCell><mxCell id="s1_val" value="&lt;b style=&quot;color:#10b981;font-size:9.5px;&quot;&gt;${tgtVal1T}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:8px;color:#a7f3d0;&quot;&gt;${tgtVal1S}&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#065f46;strokeColor=#10b981;fontColor=#ffffff;align=center;" vertex="1" parent="stage1_box"><mxGeometry x="15" y="196" width="250" height="50" as="geometry"/></mxCell><mxCell id="stage2_box" value="&lt;b style=&quot;color:#34d399;font-size:11px;&quot;&gt;${tgtL2Title}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:9px;color:#cbd5e1;&quot;&gt;${tgtL2Sub}&lt;/span&gt;" style="swimlane;html=1;startSize=40;fillColor=#022c22;strokeColor=#10b981;fontColor=#ffffff;fontSize=11;fontStyle=1;rounded=1;" vertex="1" parent="1"><mxGeometry x="380" y="75" width="280" height="260" as="geometry"/></mxCell><mxCell id="s2_card1" value="&lt;b style=&quot;color:#6ee7b7;font-size:10.5px;&quot;&gt;${tgtC2_1T}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:8.5px;color:#cbd5e1;&quot;&gt;${tgtC2_1S}&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#064e3b;strokeColor=#10b981;fontColor=#ffffff;align=left;spacingLeft=8;" vertex="1" parent="stage2_box"><mxGeometry x="15" y="48" width="250" height="65" as="geometry"/></mxCell><mxCell id="s2_card2" value="&lt;b style=&quot;color:#6ee7b7;font-size:10.5px;&quot;&gt;${tgtC2_2T}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:8.5px;color:#cbd5e1;&quot;&gt;${tgtC2_2S}&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#064e3b;strokeColor=#10b981;fontColor=#ffffff;align=left;spacingLeft=8;" vertex="1" parent="stage2_box"><mxGeometry x="15" y="122" width="250" height="65" as="geometry"/></mxCell><mxCell id="s2_val" value="&lt;b style=&quot;color:#10b981;font-size:9.5px;&quot;&gt;${tgtVal2T}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:8px;color:#a7f3d0;&quot;&gt;${tgtVal2S}&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#065f46;strokeColor=#10b981;fontColor=#ffffff;align=center;" vertex="1" parent="stage2_box"><mxGeometry x="15" y="196" width="250" height="50" as="geometry"/></mxCell><mxCell id="stage3_box" value="&lt;b style=&quot;color:#34d399;font-size:11px;&quot;&gt;${tgtL3Title}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:9px;color:#cbd5e1;&quot;&gt;${tgtL3Sub}&lt;/span&gt;" style="swimlane;html=1;startSize=40;fillColor=#022c22;strokeColor=#10b981;fontColor=#ffffff;fontSize=11;fontStyle=1;rounded=1;" vertex="1" parent="1"><mxGeometry x="720" y="75" width="280" height="260" as="geometry"/></mxCell><mxCell id="s3_card1" value="&lt;b style=&quot;color:#6ee7b7;font-size:10.5px;&quot;&gt;${tgtC3_1T}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:8.5px;color:#cbd5e1;&quot;&gt;${tgtC3_1S}&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#064e3b;strokeColor=#10b981;fontColor=#ffffff;align=left;spacingLeft=8;" vertex="1" parent="stage3_box"><mxGeometry x="15" y="48" width="250" height="65" as="geometry"/></mxCell><mxCell id="s3_card2" value="&lt;b style=&quot;color:#6ee7b7;font-size:10.5px;&quot;&gt;${tgtC3_2T}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:8.5px;color:#cbd5e1;&quot;&gt;${tgtC3_2S}&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#064e3b;strokeColor=#10b981;fontColor=#ffffff;align=left;spacingLeft=8;" vertex="1" parent="stage3_box"><mxGeometry x="15" y="122" width="250" height="65" as="geometry"/></mxCell><mxCell id="s3_val" value="&lt;b style=&quot;color:#10b981;font-size:9.5px;&quot;&gt;${tgtVal3T}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:8px;color:#a7f3d0;&quot;&gt;${tgtVal3S}&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#065f46;strokeColor=#10b981;fontColor=#ffffff;align=center;" vertex="1" parent="stage3_box"><mxGeometry x="15" y="196" width="250" height="50" as="geometry"/></mxCell><mxCell id="stage4_box" value="&lt;b style=&quot;color:#34d399;font-size:11px;&quot;&gt;${tgtL4Title}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:9px;color:#cbd5e1;&quot;&gt;${tgtL4Sub}&lt;/span&gt;" style="swimlane;html=1;startSize=40;fillColor=#022c22;strokeColor=#10b981;fontColor=#ffffff;fontSize=11;fontStyle=1;rounded=1;" vertex="1" parent="1"><mxGeometry x="1060" y="75" width="300" height="260" as="geometry"/></mxCell><mxCell id="s4_card1" value="&lt;b style=&quot;color:#6ee7b7;font-size:10.5px;&quot;&gt;${tgtC4_1T}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:8.5px;color:#cbd5e1;&quot;&gt;${tgtC4_1S}&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#064e3b;strokeColor=#10b981;fontColor=#ffffff;align=left;spacingLeft=8;" vertex="1" parent="stage4_box"><mxGeometry x="15" y="48" width="260" height="65" as="geometry"/></mxCell><mxCell id="s4_card2" value="&lt;b style=&quot;color:#6ee7b7;font-size:10.5px;&quot;&gt;${tgtC4_2T}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:8.5px;color:#cbd5e1;&quot;&gt;${tgtC4_2S}&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#064e3b;strokeColor=#10b981;fontColor=#ffffff;align=left;spacingLeft=8;" vertex="1" parent="stage4_box"><mxGeometry x="15" y="122" width="260" height="65" as="geometry"/></mxCell><mxCell id="s4_val" value="&lt;b style=&quot;color:#10b981;font-size:9.5px;&quot;&gt;${tgtVal4T}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:8px;color:#a7f3d0;&quot;&gt;${tgtVal4S}&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#065f46;strokeColor=#10b981;fontColor=#ffffff;align=center;" vertex="1" parent="stage4_box"><mxGeometry x="15" y="196" width="260" height="50" as="geometry"/></mxCell><mxCell id="tgt_found_box" value="&lt;b style=&quot;color:#6ee7b7;font-size:11px;&quot;&gt;${tgtFoundTitle}&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:9px;color:#cbd5e1;&quot;&gt;${tgtFoundSub}&lt;/span&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#022c22;strokeColor=#10b981;strokeWidth=1.5;fontColor=#ffffff;align=center;shadow=1;" vertex="1" parent="1"><mxGeometry x="40" y="350" width="1320" height="85" as="geometry"/></mxCell><mxCell id="flow1" value="Streaming CDC" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;strokeWidth=2.5;strokeColor=#10b981;fontColor=#6ee7b7;fontSize=8.5;" edge="1" parent="1" source="s1_card2" target="s2_card1"><mxGeometry relative="1" as="geometry"/></mxCell><mxCell id="flow2" value="Zero-Copy Engine" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;strokeWidth=2.5;strokeColor=#10b981;fontColor=#6ee7b7;fontSize=8.5;" edge="1" parent="1" source="s2_card2" target="s3_card1"><mxGeometry relative="1" as="geometry"/></mxCell><mxCell id="flow3" value="MCP Autonomous Mesh" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;strokeWidth=2.5;strokeColor=#10b981;fontColor=#6ee7b7;fontSize=8.5;" edge="1" parent="1" source="s3_card1" target="s4_card1"><mxGeometry relative="1" as="geometry"/></mxCell></root></mxGraphModel>`;

    return {
      reasoning: curReasoning,
      currentTitle: currentTitle,
      currentSubtitle: currentSubtitle,
      targetTitle: targetTitle,
      targetSubtitle: targetSubtitle,
      currentStateXml: currentXml,
      targetStateXml: targetXml,
      keyTransformations: transformations,
      generatedAt: new Date().toISOString(),
      modelUsed: "rule-based-deterministic-synthesis"
    };
  }

  _sanitizeDrawioXml(xml) {
    if (!xml) return xml;
    
    // 1. Clean broken attribute & tag closing artifacts (e.g. /="geometry"/>, as="geometry"/&gt;, etc.)
    let cleaned = xml
      .replace(/\/&gt;/g, '/>')
      .replace(/\/&amp;gt;/g, '/>')
      .replace(/\/="[^"]*"/g, '')
      .replace(/\bas="geometry"\s*as="geometry"/g, 'as="geometry"')
      .replace(/\/+\s*\/>/g, '/>')
      .replace(/\/\s*>/g, '/>');

    // 2. Convert non-ASCII unicode characters/emojis into safe numeric HTML entities
    cleaned = cleaned.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]|[^\x00-\x7F]/gu, function(char) {
      const code = char.codePointAt(0);
      return code ? '&#' + code + ';' : '';
    });

    // Clean invalid surrogate entities
    cleaned = cleaned.replace(/&#(?:5[5-6][0-9]{3}|57[0-2][0-9]{2}|573[0-3][0-9]|5734[0-3]);/g, '');

    // 3. Escape raw unescaped ampersands (e.g. "FinOps & AI" -> "FinOps &amp; AI")
    cleaned = cleaned.replace(/&(?!(amp|lt|gt|quot|apos|#[0-9]+|#x[0-9a-fA-F]+);)/g, '&amp;');

    // 4. Fix unescaped raw '<' and inner double quotes inside value attributes
    cleaned = cleaned.replace(/\bvalue="([\s\S]*?)"(?=\s+[a-zA-Z_:][a-zA-Z0-9_:-]*=|\s*\/?>)/g, function(match, valContent) {
      const sanitized = valContent
        .replace(/&quot;/g, "'")
        .replace(/"/g, "'")
        .replace(/<(\/?[a-zA-Z0-9]+(?:\s+[^>]*)?)>/g, '&lt;$1&gt;')
        .replace(/<([0-9]+)/g, '&lt;$1')
        .replace(/<(?![a-zA-Z0-9/])/g, '&lt;');
      return 'value="' + sanitized + '"';
    });

    return cleaned;
  }
}

module.exports = new DynamicAssessmentEngine();
