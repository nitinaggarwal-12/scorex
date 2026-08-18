const cheerio = require('cheerio');
const geminiService = require('./geminiService');
const masterBlueprintCatalog = require('./masterBlueprintCatalog');

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
3. MANDATORY REQUIREMENT: Provide EXACTLY 5 distinct, high-impact, realistic Technical Pain Points and EXACTLY 5 distinct, high-impact Business Pain Points for EVERY single question without exception.
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
        const currentScore = (val !== undefined && val !== null && !isNaN(Number(val))) ? Number(val) : 0;
        if (currentScore > 0) {
          dimSum += currentScore;
          dimCount++;
          totalScoreSum += currentScore;
          totalQuestionsCount++;
        }

        // Future target score - strictly higher than current baseline
        const targetVal = responses[`${q.id}_future_state`] !== undefined 
          ? responses[`${q.id}_future_state`] 
          : responses[`${q.id}_target`];
        if (targetVal !== undefined && targetVal !== null && !isNaN(Number(targetVal))) {
          const minTarget = currentScore > 0 ? Math.min(5, currentScore + 1) : 1;
          const tScore = Math.min(5, Math.max(minTarget, Number(targetVal)));
          dimTargetSum += tScore;
          dimTargetCount++;
          totalTargetSum += tScore;
          totalTargetCount++;
        }
      });

      const avgScore = dimCount > 0 ? parseFloat((dimSum / dimCount).toFixed(2)) : 0;
      const rawAvgTarget = dimTargetCount > 0 ? (dimTargetSum / dimTargetCount) : (avgScore + 1.2);
      const avgTargetScore = parseFloat(Math.min(5.0, Math.max(avgScore, rawAvgTarget)).toFixed(2));
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
    const rawOverallTarget = totalTargetCount > 0 ? (totalTargetSum / totalTargetCount) : (overallScore + 1.2);
    const overallTarget = parseFloat(Math.min(5.0, Math.max(overallScore, rawOverallTarget)).toFixed(2));
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

    const keyType = (framework.typeKey || '').toLowerCase();
    const isGenAI = keyType.includes('openai') || keyType.includes('gemini') || keyType.includes('genai');
    const isSec = keyType.includes('security') || keyType.includes('zero_trust');
    const isFin = keyType.includes('finops') || keyType.includes('cost');
    const isEDW = keyType.includes('lakehouse') || keyType.includes('bigquery') || keyType.includes('edw');

    let domainGuidance = "- Open Data Lakehouse: Dataplex Universal Catalog, Apache Iceberg, BigLake, and Dataform SQLX.";
    if (isGenAI) {
      domainGuidance = `- GenAI Modernization & Parity: OpenAI API to Google Cloud Vertex AI translation, Gemini 1.5/2.5 Pro & Flash native 2M context windows.
- FinOps Token Economics: Vertex AI Prompt Context Caching (75% token discount), dynamic model routing (Flash for triage, Pro for reasoning).
- Security & Agent Mesh: Google Cloud Model Armor prompt injection defense, Model Context Protocol (MCP) standardized tool calling, and VPC Service Controls.
- CI/CD Quality: Automated LLM-as-a-judge regression evaluation pipelines. STRICTLY avoid referencing BigQuery reservation slots or Lakehouse catalogs in GenAI assessments unless explicitly mentioned by user.`;
    } else if (isSec) {
      domainGuidance = `- Zero-Trust AI & Security: Google Cloud VPC Service Controls, Customer-Managed Encryption Keys (KMS CMEK), Cloud DLP surrogate tokenization, Workload Identity Federation (OIDC elimination of static keys), and Chronicle SIEM.`;
    } else if (isFin) {
      domainGuidance = `- Cloud FinOps & Cost Optimization: BigQuery edition slot reservation commitments, autoscaling 15-minute auto-termination, Cloud Billing BigQuery export, and GKE compute right-sizing.`;
    }

    const systemInstruction = `You are a Lead Executive Advisor and CTO Strategy Consultant at ScoreX.
You specialize in synthesizing maturity assessments into executive-ready strategic transformation reports for Board Members, CTOs, CIOs, and VP-level leaders.

Deliver a rigorous, consultative, highly contextualized report based on the customer's actual scores, identified pain points, and specific notes.
Ground all strategic guidance in proven modern architectural patterns:
${domainGuidance}

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
        parsed.architectureDiagrams = this._generateDeterministicDiagramsFallback(framework, instance, scores);
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
        const defaultBlueprints = masterBlueprintCatalog.getMasterArchitectureDiagrams(framework, metadata, scores);
        parsed.currentStateXml = this._sanitizeDrawioXml(parsed.currentStateXml, defaultBlueprints.currentStateXml);
        parsed.targetStateXml = this._sanitizeDrawioXml(parsed.targetStateXml, defaultBlueprints.targetStateXml);
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
    return masterBlueprintCatalog.getMasterArchitectureDiagrams(framework, metadata, scores);
  }

  _sanitizeDrawioXml(xml, fallbackXml = null) {
    if (!xml) return fallbackXml || '';
    
    // 0. Remove markdown code fences if generated by Gemini
    let cleaned = xml
      .replace(/^```(?:xml)?\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    // 1. Clean broken attribute & tag closing artifacts (e.g. /="geometry"/>, as="geometry"/&gt;, etc.)
    cleaned = cleaned
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

    // 5. Strict structural XML validation & Auto-Heal
    const hasMxGraphModel = cleaned.includes('<mxGraphModel') && cleaned.includes('</mxGraphModel>');
    const hasRoot = cleaned.includes('<root>') && cleaned.includes('</root>');
    const hasCells = cleaned.includes('<mxCell');

    // Check that tags aren't truncated or unclosed
    const isTruncated = cleaned.endsWith('<') || cleaned.endsWith('</') || /<mxCell[^>]*$/.test(cleaned) || !hasMxGraphModel || !hasRoot || !hasCells;

    if (isTruncated && fallbackXml) {
      console.warn('⚠️ Malformed or truncated Draw.io XML detected, auto-healing with master blueprint fallback.');
      return fallbackXml;
    }

    try {
      const $ = cheerio.load(cleaned, { xmlMode: true });
      const rootTag = $.root().children().first().prop('tagName');
      const cellsCount = $('mxCell').length;
      if (!rootTag || cellsCount === 0) {
        throw new Error('XML lacks root element or mxCell nodes');
      }
      return cleaned;
    } catch (e) {
      console.warn('⚠️ XML syntax validation failed in _sanitizeDrawioXml, auto-healing with fallback:', e.message);
      return fallbackXml || cleaned;
    }
  }
}

module.exports = new DynamicAssessmentEngine();
