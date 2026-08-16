const geminiService = require('./geminiService');

/**
 * Dynamic Assessment Engine
 * Generates custom assessment frameworks, questions, options, and comprehensive executive reports
 * powered by Google Gemini (gemini-3.7-flash).
 */
class DynamicAssessmentEngine {
  constructor() {
    this.gemini = geminiService;
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

    // Ensure slug key is valid
    if (!parsed.typeKey) {
      parsed.typeKey = (parsed.title || 'custom_assessment').toLowerCase().replace(/[^a-z0-9]/g, '_');
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

    dimensions.forEach(dim => {
      let dimSum = 0;
      let dimCount = 0;

      (dim.questions || []).forEach(q => {
        const val = responses[q.id] !== undefined ? responses[q.id] : responses[`${q.id}_current_state`];
        if (val !== undefined && val !== null && !isNaN(Number(val))) {
          const score = Number(val);
          dimSum += score;
          dimCount++;
          totalScoreSum += score;
          totalQuestionsCount++;
        }
      });

      const avgScore = dimCount > 0 ? parseFloat((dimSum / dimCount).toFixed(2)) : 0;
      dimensionScores[dim.id] = {
        id: dim.id,
        name: dim.name,
        score: avgScore,
        answeredCount: dimCount,
        totalQuestions: (dim.questions || []).length,
        percentage: Math.round((avgScore / 5) * 100)
      };
    });

    const overallScore = totalQuestionsCount > 0 ? parseFloat((totalScoreSum / totalQuestionsCount).toFixed(2)) : 0;
    const maxScore = 5.0;

    // Match maturity level
    const maturityLevels = framework.maturityLevels || [];
    let matchedLevel = maturityLevels.find(l => overallScore >= l.scoreMin && overallScore <= l.scoreMax);
    if (!matchedLevel && maturityLevels.length > 0) {
      matchedLevel = overallScore < 2 ? maturityLevels[0] : maturityLevels[maturityLevels.length - 1];
    }

    return {
      overallScore,
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
- Open Data Lakehouse: Unity Catalog metadata unification, Delta Lake & Apache Iceberg UniForm zero-copy interoperability.
- Declarative Streaming: Serverless Auto-Loader, declarative data pipelines (SDF / dbt), and automated CDC data contracts.
- Production MLOps: Centralized MLflow Model & Prompt Registry, automated drift alerting, and feature store reuse.
- Next-Gen Compound GenAI: Autonomous Multi-Agent Orchestration (MCP), Prompt Context Caching (75% input token discount), Model Routing, and Zero-Trust Guardrails.
- FinOps: 15-minute cluster auto-termination, predictive cost anomaly alerts, and serverless SQL right-sizing.

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
      strategicRoadmap: {
        phase1: {
          title: 'Phase 1: Foundation, Unified Governance & FinOps Quick Wins',
          timeline: '1–3 Months',
          focus: 'Eliminate security vulnerabilities and stop cloud spend leakage',
          milestones: [
            'Deploy unified Unity Catalog metastore and map IAM role delegations',
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
      calculatedScores: scores
    };
  }
}

module.exports = new DynamicAssessmentEngine();
