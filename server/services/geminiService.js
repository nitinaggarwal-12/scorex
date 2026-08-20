'use strict';

const { GoogleGenAI } = require('@google/genai');
const provenance = require('./provenanceService');

/**
 * Gemini generation with evidence-first quantitative-claim rules.
 * AI may synthesize narrative and recommendations, but it may not manufacture benchmark statistics,
 * analyst-research provenance, savings, ROI, payback or market adoption numbers.
 */
class GeminiService {
  constructor() {
    this.primaryModel = process.env.GEMINI_MODEL || 'gemini-3.7-flash';
    this.fallbackModels = ['gemini-2.0-flash', 'gemini-2.0-flash-lite', 'gemini-1.5-pro', 'gemini-1.5-flash'];
    this.client = null;
    this.initClient();
  }

  getApiKey() {
    return process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.GOOGLE_GEMINI_API_KEY || null;
  }

  initClient() {
    const key = this.getApiKey();
    if (!key) return null;
    try {
      this.client = new GoogleGenAI({ apiKey: key });
      console.log(`Gemini AI Service initialized with default model: ${this.primaryModel}`);
      return this.client;
    } catch (error) {
      console.warn('Failed to initialize GoogleGenAI client:', error.message);
      return null;
    }
  }

  isAvailable() {
    if (!this.client && this.getApiKey()) this.initClient();
    return Boolean(this.client);
  }

  async _generateWithFallback(prompt, systemInstruction = '', temperature = 0.7, responseMimeType = null, maxRetries = 2) {
    if (!this.isAvailable()) {
      throw new Error('Gemini API key is not configured');
    }

    const modelsToTry = [this.primaryModel, ...this.fallbackModels];
    let lastError = null;

    for (const model of modelsToTry) {
      for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
        try {
          const config = { temperature };
          if (systemInstruction) config.systemInstruction = systemInstruction;
          if (responseMimeType) config.responseMimeType = responseMimeType;

          const response = await this.client.models.generateContent({ model, contents: prompt, config });
          if (response?.text) return { text: response.text, modelUsed: model };
        } catch (error) {
          lastError = error;
          const isRetryable = /429|RESOURCE_EXHAUSTED|503|Quota/i.test(error.message || '');
          if (isRetryable && attempt < maxRetries) {
            const backoffMs = (2 ** attempt) * 1000 + Math.random() * 500;
            await new Promise((resolve) => setTimeout(resolve, backoffMs));
            continue;
          }
          break;
        }
      }
    }

    throw lastError || new Error('All Gemini models failed to generate content');
  }

  quantitativeTrustInstruction() {
    return `
QUANTITATIVE TRUST POLICY — MANDATORY:
- Treat only numbers explicitly present in the supplied ScoreX assessment as quantitative facts.
- Never invent peer percentiles, industry averages, medians, quartiles, market shares, adoption
  rates, sample sizes, confidence levels, analyst-study findings, savings, revenue, ROI or payback.
- Never attribute a claim to an analyst/research firm unless the prompt contains a concrete source
  record for that claim.
- If financial impact would be useful, say it requires customer baseline costs and explicit scenario
  assumptions; do not estimate from maturity scores.
- If peer comparison would be useful, say it requires a verified peer benchmark dataset.
- Qualitative recommendations are allowed. Preserve assessment scores exactly.`;
  }

  async generateChatResponse(userMessage, conversationHistory = [], context = {}, assessmentData = null) {
    if (!this.isAvailable()) return null;

    const systemInstruction = `You are the Lead Enterprise Data & AI Maturity Advisor for ScoreX.
Provide concise, vendor-neutral architecture guidance across governance, data engineering, analytics,
ML, generative AI and operational excellence. Discuss techniques such as unified metadata/catalogs,
declarative pipelines, model lifecycle controls, agent orchestration, context caching where supported,
guardrails, cost controls and workload-appropriate idle termination policies.

${this.quantitativeTrustInstruction()}

Use clear Markdown. Keep the answer focused and actionable.`;

    const contextDetails = assessmentData ? {
      organization: assessmentData.organizationName || assessmentData.organization_name || 'Enterprise Client',
      industry: assessmentData.industry || 'Industry not specified',
      status: assessmentData.status || 'In Progress',
      progress: assessmentData.progress ?? null
    } : null;

    const historyText = Array.isArray(conversationHistory)
      ? conversationHistory.slice(-6).map((m) => `${m.role === 'user' ? 'User' : 'Advisor'}: ${m.content}`).join('\n')
      : '';

    const prompt = `
Assessment context: ${JSON.stringify(contextDetails)}
Conversation history:\n${historyText || 'No prior messages.'}
User question: ${JSON.stringify(String(userMessage || '').slice(0, 8_000))}

Answer directly. At the end, on a separate line prefixed SUGGESTED_QUESTIONS:, provide 3-4 comma-separated follow-up questions.`;

    try {
      const result = await this._generateWithFallback(prompt, systemInstruction, 0.6);
      const fullText = String(result.text || '').trim();
      const parts = fullText.split('SUGGESTED_QUESTIONS:');
      const mainResponse = provenance.neutralizeGeneratedText(parts[0].trim(), {
        externalSources: [],
        allowAssessmentNumbers: true
      });
      const suggestedQuestions = (parts[1] || '')
        .split(/,|\n/)
        .map((q) => q.replace(/^[-*\d.\s"]+|["\s]+$/g, '').trim())
        .filter((q) => q.length > 5)
        .slice(0, 4);

      return {
        response: mainResponse,
        suggestedQuestions: suggestedQuestions.length ? suggestedQuestions : [
          'What is our biggest maturity gap?',
          'What evidence should we collect next?',
          'How should we prioritize the target-state roadmap?'
        ],
        model: result.modelUsed,
        claimPolicy: 'provenance-v1'
      };
    } catch (error) {
      console.warn('Gemini chat generation failed:', error.message);
      return null;
    }
  }

  async generateExecutiveReportSummary(assessment, overallScore, stage, pillarScores = {}) {
    if (!this.isAvailable()) return null;

    const systemInstruction = `You are an executive enterprise architect synthesizing a ScoreX maturity assessment.
Use only supplied assessment evidence as quantitative fact. Recommendations must be vendor-neutral.
${this.quantitativeTrustInstruction()}`;

    const prompt = `
Generate an executive-level assessment summary for:
${JSON.stringify({
      organization: assessment?.organizationName || assessment?.organization_name || 'Client',
      industry: assessment?.industry || 'Industry not specified',
      overallScore,
      stage,
      pillarScores
    }, null, 2)}

Return only JSON:
{
  "executiveSummary": "2-3 paragraph overview of assessment-derived strengths, gaps and priorities",
  "keyStrengths": ["assessment-grounded strength"],
  "criticalGaps": ["assessment-grounded gap"],
  "strategicRoadmap": [
    {"phase":"Foundation","actions":["action"]},
    {"phase":"Modernization","actions":["action"]},
    {"phase":"Scale","actions":["action"]}
  ]
}
Do not introduce financial or peer-statistical claims.`;

    const generated = await this.generateJSON(prompt, systemInstruction, 0.35);
    return generated ? provenance.sanitizeGeneratedNarrative(generated, { allowAssessmentNumbers: true }) : null;
  }

  async generateExecutiveCommandCenterData(assessment, customerScore, pillarScores, prioritizedActions = []) {
    if (!this.isAvailable()) return null;

    const systemInstruction = `You are a principal enterprise strategist preparing board-ready ScoreX guidance.
Quantify only from supplied assessment inputs. Financial/value statements require a user baseline and
explicit assumptions. Peer claims require a verified peer dataset.
${this.quantitativeTrustInstruction()}`;

    const prompt = `
Create executive command-center intelligence from these inputs only:
${JSON.stringify({
      organization: assessment?.organizationName || assessment?.organization_name || 'Enterprise',
      industry: assessment?.industry || 'Industry not specified',
      customerScore,
      pillarScores,
      prioritizedActions
    }, null, 2)}

Return only JSON with:
{
  "strategicImperatives": [
    {
      "id":"imp-1",
      "title":"...",
      "description":"...",
      "targetPillar":"...",
      "priority":"Critical|High|Medium",
      "estimatedImpact":"Requires customer baseline and KPI definition before quantification",
      "timeline":"Sequence recommendation, not a guaranteed delivery date"
    }
  ],
  "transformationRoadmap": [
    {
      "phase":"Foundation|Modernization|Scale",
      "timeframe":"Planning horizon",
      "keyMilestones":["..."],
      "expectedROI":"Requires customer baseline costs and explicit scenario assumptions"
    }
  ],
  "riskGovernanceScorecard": [
    {"category":"...","riskLevel":"Low|Medium|High","mitigation":"..."}
  ]
}
Do not introduce new percentages, dollar amounts, multipliers, ROI or market statistics.`;

    const generated = await this.generateJSON(prompt, systemInstruction, 0.35);
    if (!generated) return null;
    return provenance.sanitizeGeneratedNarrative(generated, { externalSources: [], allowAssessmentNumbers: true });
  }

  async generateIndustryBenchmarkReport(...args) {
    if (!this.isAvailable()) return null;

    let context;
    if (args.length === 1 && args[0] && typeof args[0] === 'object' && args[0].pillarScores) {
      context = args[0];
    } else {
      const [industry, assessment, overallScore, pillarScores, painPoints = []] = args;
      context = { industry, assessment, overallScore, pillarScores, painPoints };
    }

    const externalSources = provenance.normalizeSources(context.externalSources || []);
    const externalBenchmarkVerified = context.externalBenchmarkVerified === true && externalSources.length > 0;

    const systemInstruction = `You are an enterprise strategy advisor preparing assessment-relative positioning.
${this.quantitativeTrustInstruction()}
Return qualitative industry context only unless a verified source record is explicitly present.`;

    const prompt = `
Create an assessment-positioning narrative from:
${JSON.stringify({
      industry: context.industry || context.assessment?.industry || 'Industry not specified',
      organization: context.assessment?.organizationName || context.assessment?.organization_name || 'Enterprise',
      overallScore: context.overallScore,
      pillarScores: context.pillarScores || {},
      painPoints: context.painPoints || [],
      externalSources: externalBenchmarkVerified ? externalSources : []
    }, null, 2)}

Return only JSON:
{
  "executiveSummary": {
    "headline":"assessment-grounded statement",
    "keyFindings":["assessment-grounded finding"],
    "marketContext":"qualitative context; state that verified peer data is required for statistics"
  },
  "competitiveIntelligence": {
    "strengths":[{"area":"...","evidence":"assessment score/gap only","recommendation":"..."}],
    "vulnerabilities":[{"area":"...","evidence":"assessment score/gap only","remediation":"..."}],
    "whiteSpace":[{"opportunity":"...","note":"validate business value with customer baselines"}]
  },
  "industryTrends":[{"trend":"qualitative trend hypothesis","impact":"Validate with current cited source","relevance":"..."}],
  "strategicRecommendations": {
    "immediate":[{"action":"...","rationale":"...","impact":"Requires baseline/KPI before quantification"}],
    "shortTerm":[{"action":"...","rationale":"...","impact":"Requires baseline/KPI before quantification"}],
    "longTerm":[{"action":"...","rationale":"...","impact":"Requires baseline/KPI before quantification"}]
  }
}`;

    const generated = await this.generateJSON(prompt, systemInstruction, 0.35);
    if (!generated) return null;
    return provenance.sanitizeBenchmarkReport(generated, {
      ...context,
      externalSources,
      externalBenchmarkVerified
    });
  }

  async generateJSON(prompt, systemInstruction = '', temperature = 0.4) {
    if (!this.isAvailable()) return null;
    try {
      const result = await this._generateWithFallback(
        `${prompt}\n\nIMPORTANT: Output ONLY pure valid JSON.`,
        systemInstruction,
        temperature,
        'application/json'
      );
      if (!result?.text) return null;
      try {
        return JSON.parse(result.text);
      } catch (_) {
        const jsonMatch = result.text.match(/\{[\s\S]*\}/);
        return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
      }
    } catch (error) {
      console.warn('Gemini generateJSON notice:', error.message);
      return null;
    }
  }
}

module.exports = new GeminiService();
