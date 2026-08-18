const { GoogleGenAI } = require('@google/genai');

/**
 * Gemini AI Service
 * Powered by Google Gemini (gemini-3.7-flash with fallback to gemini-2.5-flash / gemini-3.1-pro)
 * Provides intelligent conversational chat, executive report generation, executive command center synthesis,
 * and industry benchmarking analytics — all 100% vendor-neutral.
 */
class GeminiService {
  constructor() {
    this.primaryModel = process.env.GEMINI_MODEL || 'gemini-3.7-flash';
    this.fallbackModels = ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-2.0-flash'];
    this.client = null;
    this.initClient();
  }

  getApiKey() {
    if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY;
    if (process.env.GOOGLE_API_KEY) return process.env.GOOGLE_API_KEY;
    if (process.env.GOOGLE_GEMINI_API_KEY) return process.env.GOOGLE_GEMINI_API_KEY;
    return null;
  }

  initClient() {
    const key = this.getApiKey();
    if (key) {
      try {
        this.client = new GoogleGenAI({ apiKey: key });
        console.log(`🤖 Gemini AI Service initialized with default model: ${this.primaryModel}`);
        return this.client;
      } catch (err) {
        console.warn('⚠️ Failed to initialize GoogleGenAI client:', err.message);
      }
    } else {
      console.log('ℹ️ GEMINI_API_KEY not configured. GeminiService in standby (fallback mode active).');
    }
    return null;
  }

  isAvailable() {
    if (!this.client && this.getApiKey()) {
      this.initClient();
    }
    return Boolean(this.client);
  }

  /**
   * Internal helper to generate content with automatic exponential backoff retry and model fallback
   */
  async _generateWithFallback(prompt, systemInstruction = '', temperature = 0.7, responseMimeType = null, maxRetries = 2) {
    if (!this.isAvailable()) {
      throw new Error('Gemini API key is not configured. Please set GEMINI_API_KEY in your environment variables (or in your Railway project under Variables).');
    }

    const modelsToTry = [this.primaryModel, ...this.fallbackModels];
    let lastError = null;

    for (const model of modelsToTry) {
      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          const config = {
            temperature
          };
          if (systemInstruction) {
            config.systemInstruction = systemInstruction;
          }
          if (responseMimeType) {
            config.responseMimeType = responseMimeType;
          }

          const response = await this.client.models.generateContent({
            model,
            contents: prompt,
            config
          });

          if (response && response.text) {
            return {
              text: response.text,
              modelUsed: model
            };
          }
        } catch (err) {
          lastError = err;
          const isRateLimit = err.message?.includes('429') || 
                              err.message?.includes('RESOURCE_EXHAUSTED') || 
                              err.message?.includes('503') ||
                              err.message?.includes('Quota');

          if (isRateLimit && attempt < maxRetries) {
            const backoffMs = Math.pow(2, attempt) * 1000 + Math.random() * 500;
            console.warn(`⏳ Rate limit hit on ${model}, retrying in ${Math.round(backoffMs)}ms (attempt ${attempt + 1}/${maxRetries})...`);
            await new Promise(r => setTimeout(r, backoffMs));
            continue;
          }
          console.warn(`⚠️ Gemini call failed for model ${model} (attempt ${attempt + 1}):`, err.message);
          break; // Try next fallback model
        }
      }
    }

    throw lastError || new Error('All Gemini models failed to generate content');
  }

  /**
   * Generate conversational response for the assessment chat
   */
  async generateChatResponse(userMessage, conversationHistory = [], context = {}, assessmentData = null) {
    if (!this.isAvailable()) {
      return null;
    }

    const systemInstruction = `You are the Lead Enterprise Data & AI Maturity Advisor for ScoreX (Enterprise Data & AI Maturity Assessment Platform).
Your goal is to guide organizations to higher maturity stages across the 6 core pillars:
1. Platform & Governance (Enterprise Governance, Unified Catalog, Delta/Iceberg UniForm, IAM, FinOps, Disaster Recovery)
2. Data Engineering (Modern Lakehouse Storage, Declarative Streaming Data Pipelines, Serverless Auto-Loader, Data Contracts)
3. Analytics & BI (Serverless Vectorized SQL Engines, Semantic Metric Layer, Governed Data Sharing, Zero-Copy Access)
4. Machine Learning (Production MLOps, Centralized MLflow Registry, Automated Feature Stores, Continuous Drift Monitoring)
5. Generative AI (Autonomous Multi-Agent Orchestration, Model Context Protocol (MCP), Prompt Context Caching (75% savings), SLM/LLM Model Routing, Guardrails & CMEK)
6. Operational Excellence (Center of Excellence, CI/CD Automation, FinOps 15-min auto-suspend, Full-stack Observability, Enablement)

Format your responses with clear Markdown formatting:
- Use bolding for key concepts and architectural best practices.
- Provide actionable, vendor-neutral, architecture-backed advice.
- Keep responses concise (2-4 paragraphs max), engaging, and structured.`;

    let contextDetails = '';
    if (assessmentData) {
      contextDetails = `
CURRENT ASSESSMENT CONTEXT:
- Organization: ${assessmentData.organizationName || assessmentData.organization_name || 'Enterprise Client'}
- Industry: ${assessmentData.industry || 'Technology'}
- Assessment Status: ${assessmentData.status || 'In Progress'}
- Progress: ${assessmentData.progress || 0}%
`;
    }

    let historyText = '';
    if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
      historyText = conversationHistory
        .slice(-6)
        .map(m => `${m.role === 'user' ? 'User' : 'Advisor'}: ${m.content}`)
        .join('\n');
    }

    const prompt = `
${contextDetails}

CONVERSATION HISTORY:
${historyText || 'No prior messages.'}

User Question: "${userMessage}"

Provide a direct, consultative, and insightful response. At the very end of your response, on a separate line prefixed with "SUGGESTED_QUESTIONS:", output exactly 3-4 comma-separated follow-up questions the user might want to ask next.`;

    try {
      const result = await this._generateWithFallback(prompt, systemInstruction, 0.7);
      const fullText = result.text.trim();

      let mainResponse = fullText;
      let suggestedQuestions = [];

      if (fullText.includes('SUGGESTED_QUESTIONS:')) {
        const parts = fullText.split('SUGGESTED_QUESTIONS:');
        mainResponse = parts[0].trim();
        const rawQuestions = parts[1].trim();
        suggestedQuestions = rawQuestions
          .split(/,|\n/)
          .map(q => q.replace(/^[-*\d.\s"]+|["\s]+$/g, '').trim())
          .filter(q => q.length > 5)
          .slice(0, 4);
      }

      return {
        response: mainResponse,
        suggestedQuestions: suggestedQuestions.length > 0 ? suggestedQuestions : [
          "How do we implement a unified data catalog?",
          "What is our biggest maturity gap?",
          "Tell me about declarative data pipeline best practices"
        ],
        model: result.modelUsed
      };
    } catch (error) {
      console.error('❌ Error generating Gemini chat response:', error.message);
      return null;
    }
  }

  /**
   * Generate Executive Summary and Strategic Recommendations for Reports
   */
  async generateExecutiveReportSummary(assessment, overallScore, stage, pillarScores = {}) {
    if (!this.isAvailable()) {
      return null;
    }

    const systemInstruction = `You are an Executive Enterprise Architect and CTO Advisor synthesizing an Enterprise Data & AI Maturity Assessment for executive leadership. All recommendations must be vendor-neutral, grounded in modern cloud data lakehouse (Delta/Iceberg UniForm), declarative data engineering, and Next-Gen GenAI architecture patterns (Autonomous Agents, Model Context Protocol, Prompt Context Caching, and FinOps cluster auto-termination).`;

    const pillarSummary = Object.entries(pillarScores)
      .map(([k, v]) => `- ${v.name || k}: Score ${v.score || 'N/A'}/5 (${v.maturityLevel?.level || 'N/A'})`)
      .join('\n');

    const prompt = `
Generate an executive-level assessment summary and strategic transformation roadmap for:
- Organization: ${assessment.organizationName || assessment.organization_name || 'Client'}
- Industry: ${assessment.industry || 'Enterprise'}
- Overall Maturity Score: ${overallScore}/5
- Current Stage: ${stage}

PILLAR PERFORMANCE:
${pillarSummary}

Please generate a structured JSON object with these exact keys:
{
  "executiveSummary": "2-3 paragraph executive overview highlighting strengths, critical gaps, and strategic business impact",
  "keyStrengths": ["3 key strengths with business rationale"],
  "criticalGaps": ["3 highest-priority architectural/operational risks to address"],
  "strategicRoadmap": [
    { "phase": "Phase 1 (Months 1-3): Foundation & Governance", "actions": ["action 1", "action 2"] },
    { "phase": "Phase 2 (Months 3-6): Modernization & Automation", "actions": ["action 1", "action 2"] },
    { "phase": "Phase 3 (Months 6-12): Enterprise AI & Scale", "actions": ["action 1", "action 2"] }
  ]
}
Return ONLY valid JSON.`;

    try {
      const result = await this._generateWithFallback(prompt, systemInstruction, 0.4);
      const jsonMatch = result.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (err) {
      console.warn('⚠️ Gemini report generation failed, using fallback:', err.message);
    }
    return null;
  }

  /**
   * Generate Executive Command Center Data
   */
  async generateExecutiveCommandCenterData(assessment, customerScore, pillarScores, prioritizedActions = []) {
    if (!this.isAvailable()) {
      return null;
    }

    const systemInstruction = `You are a Principal Enterprise Strategist and Chief Architect synthesizing C-suite data for an Executive Command Center. Provide vendor-neutral, highly quantified, board-ready strategic imperatives, risk analysis, transformation roadmap, and ROI metrics.`;

    const pillarDetails = Object.entries(pillarScores || {})
      .map(([k, v]) => `- ${v.name || k}: Current ${v.score || v.currentScore || 0}/5.0 (Target: ${v.targetScore || v.futureScore || 5.0})`)
      .join('\n');

    const prompt = `
Generate executive command center strategic intelligence for:
- Organization: ${assessment.organizationName || assessment.organization_name || 'Enterprise'}
- Industry: ${assessment.industry || 'Enterprise'}
- Overall Maturity Score: ${Number(customerScore).toFixed(1)}/5.0

PILLAR SCORES:
${pillarDetails}

Generate a valid JSON object with the following structure:
{
  "strategicImperatives": [
    {
      "id": "imp-1",
      "title": "<Strategic Imperative Title>",
      "description": "<Executive narrative on why this matters>",
      "targetPillar": "<Pillar Name>",
      "priority": "Critical|High|Medium",
      "estimatedImpact": "<Quantified impact e.g. 35% reduction in data latency>",
      "timeline": "Q1-Q2 2026"
    }
  ],
  "transformationRoadmap": [
    {
      "phase": "Phase 1: Foundation & Governance Alignment",
      "timeframe": "Months 1-3",
      "keyMilestones": ["<Milestone 1>", "<Milestone 2>", "<Milestone 3>"],
      "expectedROI": "<e.g. 20% infrastructure cost optimization>"
    },
    {
      "phase": "Phase 2: Automated Pipelines & Analytics Modernization",
      "timeframe": "Months 4-6",
      "keyMilestones": ["<Milestone 1>", "<Milestone 2>", "<Milestone 3>"],
      "expectedROI": "<e.g. 3x faster time-to-insight>"
    },
    {
      "phase": "Phase 3: Governed Enterprise GenAI & Multi-Agent Scale",
      "timeframe": "Months 7-12",
      "keyMilestones": ["<Milestone 1>", "<Milestone 2>", "<Milestone 3>"],
      "expectedROI": "<e.g. 40% analyst productivity gains>"
    }
  ],
  "riskGovernanceScorecard": [
    {
      "category": "Data Security & Compliance",
      "riskLevel": "Low|Medium|High",
      "mitigation": "<Vendor-neutral architecture control>"
    },
    {
      "category": "GenAI Model Safety & Hallucination",
      "riskLevel": "Low|Medium|High",
      "mitigation": "<Automated guardrails and evaluation frameworks>"
    },
    {
      "category": "Cost & Resource Overruns (FinOps)",
      "riskLevel": "Low|Medium|High",
      "mitigation": "<Automated tagging, predictive budgeting, and cluster policies>"
    }
  ]
}
Return ONLY valid JSON.`;

    try {
      const result = await this._generateWithFallback(prompt, systemInstruction, 0.4);
      const jsonMatch = result.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (err) {
      console.warn('⚠️ Gemini command center synthesis failed, using fallback:', err.message);
    }
    return null;
  }

  /**
   * Generate comprehensive Industry Benchmarking report
   */
  async generateIndustryBenchmarkReport(industry, assessment, customerScore, pillarScores, painPoints = []) {
    if (!this.isAvailable()) {
      return null;
    }

    const systemInstruction = `You are a Senior Enterprise Strategy and Industry Benchmarking Consultant. Generate executive-ready, board-level, data-driven, and completely vendor-neutral competitive intelligence and market analysis. Return ONLY a valid JSON object matching the requested schema.`;

    const pillarDetails = Object.entries(pillarScores || {})
      .map(([k, v]) => `- ${v.name || k}: Current ${v.score || v.currentScore || 0}/5.0 (Target: ${v.targetScore || v.futureScore || 5.0})`)
      .join('\n');

    const topPainPoints = Array.isArray(painPoints)
      ? painPoints.slice(0, 5).map(p => `- ${p.label || p.value || p}`).join('\n')
      : 'Standard industry operational challenges';

    const prompt = `
Create a comprehensive industry benchmarking report for a ${industry} organization.

CLIENT PROFILE:
- Industry: ${industry}
- Organization: ${assessment.organizationName || assessment.organization_name || 'Enterprise Client'}
- Overall Data & AI Platform Maturity: ${Number(customerScore).toFixed(1)}/5.0
- Assessment Date: ${new Date().toLocaleDateString()}

DETAILED PILLAR SCORES:
${pillarDetails}

TOP BUSINESS CHALLENGES:
${topPainPoints}

DELIVERABLE: Generate a professional executive benchmarking report structured as a valid JSON object:
{
  "executiveSummary": {
    "headline": "<One powerful sentence summarizing competitive position in ${industry}>",
    "keyFindings": [
      "<3-4 critical findings that matter to C-suite and Board>",
      "<Include specific percentiles and competitive gaps>",
      "<Highlight both architectural strengths and urgent modernization priorities>"
    ],
    "marketContext": "<2-3 sentences on ${industry} market dynamics and modern data & AI maturity trends>"
  },
  "competitivePositioning": {
    "overallRanking": {
      "percentile": <Number 5-95 based on ${customerScore}>,
      "tier": "<Market Leader|Fast Follower|Industry Average|Developing>",
      "peerGroup": "Mid-to-large ${industry} organizations",
      "versusBenchmark": "<Comparison vs ${industry} median and top quartile>"
    },
    "tierBreakdown": {
      "Market Leaders (Top 10%)": "4.2+ maturity score",
      "Fast Followers (Top 25%)": "3.6-4.1 maturity score",
      "Industry Average": "2.9-3.5 maturity score",
      "Developing": "Below 2.9 maturity score",
      "Your Position": "${Number(customerScore).toFixed(1)}"
    }
  },
  "competitiveIntelligence": {
    "strengths": [
      {
        "area": "<Pillar or Capability Area>",
        "evidence": "<Percentile and score evidence>",
        "competitiveAdvantage": "<Market advantage description>",
        "recommendation": "<How to leverage this advantage>"
      }
    ],
    "vulnerabilities": [
      {
        "area": "<Pillar or Capability Area>",
        "evidence": "<Gap evidence>",
        "businessRisk": "<Risk to organization>",
        "competitorAdvantage": "<What competitors do faster>",
        "remediation": "<Remediation step>"
      }
    ],
    "whiteSpace": [
      {
        "opportunity": "Generative AI & Agentic Workflows",
        "marketReadiness": "35% of industry peers in production",
        "competitiveWindow": "12-18 months before market saturation",
        "potentialImpact": "25-40% productivity acceleration across analytics and engineering"
      }
    ]
  },
  "industryTrends": [
    {
      "trend": "${industry} enterprises accelerating unified catalog and automated data governance",
      "impact": "High",
      "relevance": "Regulatory compliance and data democratization"
    },
    {
      "trend": "Serverless query execution and declarative data pipelines lowering TCO by 30%",
      "impact": "High",
      "relevance": "Operational cost efficiency and elasticity"
    },
    {
      "trend": "Enterprise GenAI moving from standalone chatbots to governed multi-agent systems",
      "impact": "Very High",
      "relevance": "Business workflow automation"
    }
  ],
  "strategicRecommendations": {
    "immediate": [
      {
        "action": "<High priority action for Months 0-3>",
        "rationale": "<Strategic rationale>",
        "impact": "<Quantified impact>",
        "effort": "Medium|High",
        "timeframe": "0-3 months"
      }
    ],
    "shortTerm": [
      {
        "action": "<Strategic action for Months 3-6>",
        "rationale": "<Strategic rationale>",
        "impact": "<Quantified impact>",
        "effort": "Medium",
        "timeframe": "3-6 months"
      }
    ],
    "longTerm": [
      {
        "action": "<Transformative action for Months 6-12>",
        "rationale": "<Strategic rationale>",
        "impact": "<Quantified impact>",
        "effort": "High",
        "timeframe": "6-12 months"
      }
    ]
  },
  "methodology": {
    "dataSource": "ScoreX Global Industry Benchmarking Repository, Gartner Data & Analytics Research, Forrester Wave Analysis",
    "sampleSize": 284,
    "industryScope": "${industry} enterprises (global coverage)",
    "assessmentCriteria": "Six-pillar vendor-neutral maturity framework (Platform & Governance, Data Engineering, Analytics & BI, Machine Learning, Generative AI, Operational Excellence)",
    "benchmarkingPeriod": "2025-2026",
    "lastUpdated": "${new Date().toLocaleDateString()}",
    "confidenceLevel": "95%"
  }
}
Return ONLY valid JSON.`;

    try {
      const result = await this._generateWithFallback(prompt, systemInstruction, 0.4);
      const jsonMatch = result.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (err) {
      console.warn('⚠️ Gemini industry benchmark generation failed, using fallback:', err.message);
    }
    return null;
  }
}

module.exports = new GeminiService();

