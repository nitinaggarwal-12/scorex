const { GoogleGenAI } = require('@google/genai');

/**
 * Gemini AI Service
 * Powered by Google Gemini (gemini-3.1-pro with fallback to gemini-2.5-pro / gemini-2.5-flash)
 * Provides intelligent conversational chat and executive report generation.
 */
class GeminiService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || null;
    this.primaryModel = process.env.GEMINI_MODEL || 'gemini-3.1-pro-preview';
    this.fallbackModels = ['gemini-3.1-pro', 'gemini-2.5-pro', 'gemini-2.5-flash'];
    this.client = null;

    if (this.apiKey) {
      try {
        this.client = new GoogleGenAI({ apiKey: this.apiKey });
        console.log(`🤖 Gemini AI Service initialized with model: ${this.primaryModel}`);
      } catch (err) {
        console.warn('⚠️ Failed to initialize GoogleGenAI client:', err.message);
      }
    } else {
      console.log('ℹ️ GEMINI_API_KEY not configured. GeminiService in standby (fallback mode active).');
    }
  }

  isAvailable() {
    return Boolean(this.apiKey && this.client);
  }

  /**
   * Internal helper to generate content with automatic model fallback
   */
  async _generateWithFallback(prompt, systemInstruction = '', temperature = 0.7) {
    if (!this.isAvailable()) {
      throw new Error('Gemini API key is not configured');
    }

    const modelsToTry = [this.primaryModel, ...this.fallbackModels];
    let lastError = null;

    for (const model of modelsToTry) {
      try {
        const config = {
          temperature
        };
        if (systemInstruction) {
          config.systemInstruction = systemInstruction;
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
        console.warn(`⚠️ Gemini call failed for model ${model}:`, err.message);
        lastError = err;
        // Continue loop to try fallback model
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
1. Platform & Governance (Enterprise Governance, Unified Catalog, IAM, FinOps, Disaster Recovery)
2. Data Engineering (Modern Lakehouse Storage, Declarative Data Pipelines, Auto-scaling Ingestion, Workflows)
3. Analytics & BI (Serverless SQL Engines, Vectorized Query Acceleration, Semantic Layer, Governed Data Sharing)
4. Machine Learning (MLOps, Feature Stores, Managed Model Serving, Drift Monitoring)
5. Generative AI (Foundation Models, Vector Databases, RAG Architectures, Evaluation & Guardrails)
6. Operational Excellence (Center of Excellence, CI/CD Automation, Full-stack Observability, Enablement)

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
      return null; // Return null so caller can gracefully fallback to rule engine
    }
  }

  /**
   * Generate Executive Summary and Strategic Recommendations for Reports
   */
  async generateExecutiveReportSummary(assessment, overallScore, stage, pillarScores = {}) {
    if (!this.isAvailable()) {
      return null;
    }

    const systemInstruction = `You are an Executive Enterprise Architect synthesizing an Enterprise Data & AI Maturity Assessment for executive leadership.`;

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
}

module.exports = new GeminiService();
