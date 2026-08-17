const assessmentFramework = require('../data/assessmentFramework');
const RecommendationEngine = require('./recommendationEngine');
const geminiService = require('./geminiService');

class OpenAIContentGenerator {
  constructor() {
    this.openai = null;
    this.isInitialized = false;
    this.recommendationEngine = new RecommendationEngine();
    
    // Initialize OpenAI if API key is available
    if (process.env.OPENAI_API_KEY) {
      try {
        const OpenAI = require('openai');
        this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        this.isInitialized = true;
        console.log('✅ OpenAI Content Generator initialized');
      } catch (error) {
        console.error('❌ Failed to initialize OpenAI:', error.message);
        this.isInitialized = false;
      }
    }
  }

  /**
   * Generate complete assessment results using Gemini (gemini-3.7-flash) or OpenAI
   * @param {object} assessment - Full assessment object with responses
   * @param {string} pillarId - Optional: specific pillar to generate results for
   * @returns {object} Complete results structure
   */
  async generateAssessmentContent(assessment, pillarId = null) {
    // 🌟 1. Primary: Use Google Gemini (gemini-3.7-flash) if available
    if (geminiService.isAvailable()) {
      try {
        console.log(`🤖 Generating ${pillarId ? 'pillar' : 'overall'} content with Gemini (gemini-3.7-flash) for assessment ${assessment.id}`);
        const prompt = pillarId 
          ? this.buildPillarPrompt(assessment, pillarId)
          : this.buildOverallPrompt(assessment);
        
        const systemPrompt = this.getSystemPrompt();
        const result = await geminiService._generateWithFallback(
          prompt + '\n\nIMPORTANT: Return ONLY a valid JSON object matching the requested schema.', 
          systemPrompt, 
          0.7,
          'application/json'
        );
        let parsed = null;
        try {
          parsed = JSON.parse(result.text);
        } catch (e) {
          const jsonMatch = result.text.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            parsed = JSON.parse(jsonMatch[0]);
          }
        }
        if (parsed) {
          console.log(`✅ Gemini generated and parsed successfully (${result.modelUsed})`);
          const formatted = pillarId 
            ? this.formatPillarResults(parsed, assessment, pillarId)
            : this.formatOverallResults(parsed, assessment);
          formatted.source = 'gemini';
          formatted.model = result.modelUsed;
          formatted.generatedAt = new Date().toISOString();
          return formatted;
        }
      } catch (geminiErr) {
        console.warn('⚠️ Gemini content generation notice, falling back:', geminiErr.message);
      }
    }

    if (!this.isInitialized) {
      return this.generateFallbackContent(assessment, pillarId);
    }

    try {
      console.log(`🤖 Generating ${pillarId ? 'pillar' : 'overall'} content for assessment ${assessment.id}`);
      console.log(`   Organization: ${assessment.organizationName}`);
      console.log(`   Industry: ${assessment.industry}`);
      console.log(`   Total responses: ${Object.keys(assessment.responses || {}).length}`);
      
      const prompt = pillarId 
        ? this.buildPillarPrompt(assessment, pillarId)
        : this.buildOverallPrompt(assessment);
      
      console.log(`📝 Prompt length: ${prompt.length} characters`);
      console.log(`🔑 Assessment ID in prompt: ${assessment.id}`);
      
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: this.getSystemPrompt()
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000,
        response_format: { type: 'json_object' }
      });

      const content = JSON.parse(response.choices[0].message.content);
      console.log('✅ AI content generated successfully');
      
      return pillarId 
        ? this.formatPillarResults(content, assessment, pillarId)
        : this.formatOverallResults(content, assessment);
      
    } catch (error) {
      console.error('❌ Error generating content from AI generator:', error.message);
      return this.generateFallbackContent(assessment, pillarId);
    }
  }

  /**
   * Get system prompt for AI Content Generation
   */
  getSystemPrompt() {
    return `You are a Principal Enterprise Data & AI Architect and CTO advisor specializing in enterprise data platform maturity assessments.

Your role is to analyze assessment responses and provide:
1. Accurate, data-driven insights based on actual user input
2. Specific, actionable, vendor-neutral recommendations using modern cloud data lakehouse (Delta/Iceberg UniForm), data mesh, and Next-Gen GenAI best practices (Autonomous Agents, MCP, Context Caching)
3. Strategic guidance focused on business impact, operational resilience, and FinOps ROI
4. Factual analysis without speculative figures

Key architectural principles to weave into recommendations:
- Open Lakehouse & Unified Governance: Open metadata catalog (Apache Polaris / Unity Catalog / Google Dataplex / AWS Glue), Delta Lake & Apache Iceberg open table formats, column/row-level ABAC security, automated end-to-end lineage.
- Declarative & Streaming Data Engineering: Serverless Ingestion, Declarative Pipelines (dbt / Dataform / Spark Streaming), automated CDC, data contract expectations.
- High-Performance Analytics & BI: Serverless Vectorized SQL Engine, automated compute auto-suspend, governed semantic metric layer.
- Production MLOps: Centralized Model & Prompt Registry, automated feature stores, continuous concept drift detection.
- Next-Gen GenAI & Compound AI: Autonomous Multi-Agent Orchestration, Model Context Protocol (MCP) standardized tools, Prompt Context Caching (75% input token discount), Dynamic SLM/LLM Model Routing, Zero-Trust AI Guardrails, and CMEK private networking.
- FinOps & Operational Excellence: Compute auto-termination, predictive cost alerting, CI/CD automated deployment.

Return ONLY valid JSON with the exact structure requested.`;
  }

  /**
   * Build prompt for overall assessment results
   */
  buildOverallPrompt(assessment) {
    const { responses } = assessment;
    
    // DEBUG: Log what we're receiving
    console.log('🔍 buildOverallPrompt called');
    console.log('🔍 Assessment ID:', assessment.id);
    console.log('🔍 Responses type:', typeof responses);
    console.log('🔍 Responses null/undefined?:', responses === null || responses === undefined);
    console.log('🔍 Responses keys:', responses ? Object.keys(responses).length : 0);
    
    // FIX: Ensure responses is an object
    const validResponses = responses || {};
    
    // Extract all filled responses by pillar
    const pillarData = assessmentFramework.assessmentAreas.map(area => {
      const questions = this.getAreaQuestions(area);
      const filledQuestions = [];
      
      questions.forEach(question => {
        const currentState = validResponses[`${question.id}_current_state`];
        const futureState = validResponses[`${question.id}_future_state`];
        const technicalPain = validResponses[`${question.id}_technical_pain`] || [];
        const businessPain = validResponses[`${question.id}_business_pain`] || [];
        const comment = validResponses[`${question.id}_comment`] || '';
        const skipped = validResponses[`${question.id}_skipped`] || false;
        
        if (!skipped && (currentState || futureState)) {
          filledQuestions.push({
            topic: question.topic,
            currentState,
            futureState,
            technicalPain,
            businessPain,
            comment
          });
        }
      });
      
      return {
        pillar: area.name,
        pillarId: area.id,
        questionsAnswered: filledQuestions.length,
        questions: filledQuestions
      };
    });

    return `# ScoreX Enterprise Data & AI Maturity Assessment Analysis

## Organization Context
- **Assessment ID:** ${assessment.id}
- **Organization:** ${assessment.organizationName || 'Not provided'}
- **Industry:** ${assessment.industry || 'Not provided'}
- **Assessment Name:** ${assessment.assessmentName || 'Unnamed Assessment'}
- **Timestamp:** ${new Date().toISOString()}

⚠️ CRITICAL: Generate UNIQUE content for this specific assessment (ID: ${assessment.id}).
⚠️ Do NOT reuse generic templates or previous responses.
⚠️ Every assessment has different responses, pain points, and context.
⚠️ Your analysis MUST reflect THIS assessment's specific data, organization, and industry context.

## Assessment Data by Pillar

${pillarData.map(p => `### ${p.pillar} (${p.questionsAnswered} questions answered)

${p.questions.map((q, idx) => `
**Question ${idx + 1}: ${q.topic}**
- Current State: Level ${q.currentState || 'Not answered'}
- Future/Target State: Level ${q.futureState || 'Not answered'}
- Technical Pain Points: ${q.technicalPain.length > 0 ? q.technicalPain.join(', ') : 'None'}
- Business Pain Points: ${q.businessPain.length > 0 ? q.businessPain.join(', ') : 'None'}
- Additional Comments: ${q.comment || 'None'}
`).join('\n')}
`).join('\n\n')}

## Task
Based ONLY on the data provided above, generate a comprehensive overall assessment with:

1. **Overall Maturity Scores:**
   - Current maturity score (average across all answered questions)
   - Target maturity score (average of future states)
   - Maturity gap (target - current)

2. **Pillar-Specific Scores:**
   For each pillar with answered questions, calculate:
   - Current score, Future score, Gap
   
3. **Strategic Executive Summary:**
   Write a CTO-level narrative (300-500 words) covering:
   - Current state assessment with specific strengths/weaknesses identified from responses
   - Critical constraints impacting the organization (be specific based on pain points selected)
   - Transformation roadmap with timeline (reference actual gap sizes)
   - Priority initiatives with modern architecture capabilities that address identified pain points
   - Expected business outcomes (based on gaps and pain points, not made-up numbers)

4. **Top 5 Priority Recommendations:**
   For each recommendation provide:
   - Title
   - Description (why it matters to THIS organization based on their responses)
   - Specific actions (using modern cloud data lakehouse, data mesh, and GenAI best practices)
   - Business impact (based on pain points addressed)
   - Timeline estimate
   - Priority level (critical/high/medium/low)

Return JSON with this structure:
{
  "overallScores": {
    "currentScore": <number 1-5>,
    "futureScore": <number 1-5>,
    "gap": <number>
  },
  "pillarScores": {
    "<pillarId>": {
      "current": <number 1-5>,
      "future": <number 1-5>,
      "gap": <number>
    }
  },
  "executiveSummary": "<markdown text>",
  "recommendations": [
    {
      "title": "<string>",
      "description": "<string>",
      "actions": ["<action1>", "<action2>"],
      "businessImpact": "<string>",
      "timeline": "<string>",
      "priority": "<critical|high|medium|low>"
    }
  ]
}`;
  }

  /**
   * Build prompt for pillar-specific results
   */
  buildPillarPrompt(assessment, pillarId) {
    const { responses } = assessment;
    const area = assessmentFramework.assessmentAreas.find(a => a.id === pillarId);
    
    if (!area) {
      throw new Error(`Pillar ${pillarId} not found`);
    }
    
    // DEBUG: Log what we're receiving
    console.log('🔍 buildPillarPrompt called for pillar:', pillarId);
    console.log('🔍 Assessment ID:', assessment.id);
    console.log('🔍 Responses null/undefined?:', responses === null || responses === undefined);
    console.log('🔍 Responses keys:', responses ? Object.keys(responses).length : 0);
    
    // FIX: Ensure responses is an object
    const validResponses = responses || {};
    
    const questions = this.getAreaQuestions(area);
    const filledQuestions = [];
    
    questions.forEach(question => {
      const currentState = validResponses[`${question.id}_current_state`];
      const futureState = validResponses[`${question.id}_future_state`];
      const technicalPain = validResponses[`${question.id}_technical_pain`] || [];
      const businessPain = validResponses[`${question.id}_business_pain`] || [];
      const comment = validResponses[`${question.id}_comment`] || '';
      const skipped = validResponses[`${question.id}_skipped`] || false;
      
      if (!skipped && (currentState || futureState)) {
        filledQuestions.push({
          topic: question.topic,
          currentState,
          futureState,
          technicalPain,
          businessPain,
          comment
        });
      }
    });

    return `# ${area.name} Pillar Assessment Analysis

## Organization Context
- **Assessment ID:** ${assessment.id}
- **Organization:** ${assessment.organizationName || 'Not provided'}
- **Industry:** ${assessment.industry || 'Not provided'}
- **Pillar:** ${area.name}
- **Timestamp:** ${new Date().toISOString()}

⚠️ CRITICAL: Generate UNIQUE content for this specific assessment (ID: ${assessment.id}) and pillar (${area.name}).
⚠️ Do NOT reuse generic templates or previous responses.
⚠️ This organization's ${area.name} responses are UNIQUE - analyze THEIR specific data.

## ${area.name} Questions (${filledQuestions.length} answered)

${filledQuestions.map((q, idx) => `
**Question ${idx + 1}: ${q.topic}**
- Current State: Level ${q.currentState || 'Not answered'}
- Future/Target State: Level ${q.futureState || 'Not answered'}
- Technical Pain Points: ${q.technicalPain.length > 0 ? q.technicalPain.join(', ') : 'None'}
- Business Pain Points: ${q.businessPain.length > 0 ? q.businessPain.join(', ') : 'None'}
- Additional Comments: ${q.comment || 'None'}
`).join('\n')}

## Task - Act as Enterprise Lead Architect for ${area.name}

You are a Principal Enterprise Solutions Architect specializing in ${area.name}. You design and implement scalable, resilient, vendor-neutral enterprise data and AI platforms.

## Modern Architectural Capabilities for ${area.name}:

${this.getPillarSpecificContext(pillarId)}

## Your Task:
Generate DIRECT, ACTIONABLE, UNAMBIGUOUS recommendations based on the assessment data above.

### Requirements for Actionable Recommendations:
- **Be Specific**: Name exact architectural patterns, services, or protocols
- **Be Prescriptive**: Tell them WHAT to do, HOW to do it, and WHEN to do it
- **Be Technical**: Include actual implementation steps, not high-level platitudes
- **Address Pain Points**: Explicitly map each recommendation to the pain points they selected
- **Provide Timelines**: Specify sprint/week/month estimates for each phase
- **Include Prerequisites**: State what needs to be in place first

Generate:

1. **Pillar Maturity Scores:**
   - Current maturity score (average across answered questions)
   - Target maturity score
   - Maturity gap

2. **Executive Summary (100-150 words):**
   - What's working: 2-3 specific strengths from their responses
   - Critical gaps: 2-3 specific weaknesses with business impact
   - Transformation approach: The exact path forward with timeline

3. **Top 3-5 Actionable Recommendations:**
   Each must include:
   - **Title**: Action-oriented (starts with verb: "Enable...", "Migrate...", "Implement...")
   - **Why Now**: Which specific pain point(s) this addresses from their responses
   - **Specific Actions**: Numbered steps (1, 2, 3...) with modern architectural practices
   - **Prerequisites**: What must be in place first
   - **Timeline**: Weeks or sprints (be realistic: 1-4 weeks typical)
   - **Team Required**: Who needs to execute (Data Engineers, Platform Admin, etc.)
   - **Success Metrics**: How to measure completion
   - **Priority**: Critical/High/Medium based on pain severity

4. **Strategic Platform Capabilities** (3-5 specific items):
   - Capability name (e.g., "Unified Catalog & Lineage", "Declarative Streaming Pipelines", "Serverless Vectorized SQL Engine")
   - Status (GA)
   - Why relevant: Map directly to their pain points
   - Quick win or foundational: Flag if this unlocks other capabilities

Return JSON with this structure:
{
  "scores": {
    "current": <number 1-5>,
    "future": <number 1-5>,
    "gap": <number>
  },
  "summary": "<markdown text 100-150 words>",
  "recommendations": [
    {
      "title": "<Action-oriented title starting with verb>",
      "whyNow": "<Which pain points this addresses>",
      "actions": [
        "Step 1: <Specific action with platform capability>",
        "Step 2: <Next specific action>",
        "Step 3: <Continue...>"
      ],
      "prerequisites": "<What must be in place first>",
      "timeline": "<Specific weeks/sprints: e.g., '3-4 weeks' or 'Sprint 1-2'>",
      "teamRequired": "<Who executes: Data Engineers, Platform Admin, etc.>",
      "successMetrics": "<How to measure completion>",
      "priority": "<critical|high|medium based on pain severity>"
    }
  ],
  "databricksFeatures": [
    {
      "name": "<Capability name>",
      "status": "GA",
      "relevance": "<Why relevant to their pain points>",
      "type": "<quick-win|foundational>",
      "action": "<How to get started with this capability>"
    }
  ]
}`;
  }

  /**
   * Resolve any variation of pillar id or name to standard assessmentFramework area
   */
  matchPillar(idOrName) {
    if (!idOrName) return null;
    const clean = idOrName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    
    const direct = assessmentFramework.assessmentAreas.find(a => 
      a.id === idOrName || 
      a.id.toLowerCase() === idOrName.toLowerCase() ||
      a.name.toLowerCase() === idOrName.toLowerCase()
    );
    if (direct) return direct;
    
    if (clean.includes('platform') || clean.includes('governance')) {
      return assessmentFramework.assessmentAreas.find(a => a.id === 'platform_governance');
    }
    if (clean.includes('data_eng') || (clean.includes('data') && !clean.includes('science'))) {
      return assessmentFramework.assessmentAreas.find(a => a.id === 'data_engineering');
    }
    if (clean.includes('analytic') || clean.includes('bi')) {
      return assessmentFramework.assessmentAreas.find(a => a.id === 'analytics_bi');
    }
    if (clean.includes('genai') || clean.includes('generative') || clean.includes('llm')) {
      return assessmentFramework.assessmentAreas.find(a => a.id === 'generative_ai');
    }
    if (clean.includes('machine') || clean.includes('ml') || clean.includes('ai')) {
      return assessmentFramework.assessmentAreas.find(a => a.id === 'machine_learning');
    }
    if (clean.includes('operat') || clean.includes('enable') || clean.includes('coe')) {
      return assessmentFramework.assessmentAreas.find(a => a.id === 'operational_excellence');
    }
    
    return null;
  }

  /**
   * Generate pillar-specific prioritized actions from pillar scores
   */
  generatePillarPrioritizedActions(pillarScores = {}, assessment) {
    const actions = [];
    const responses = assessment.responses || {};
    
    assessmentFramework.assessmentAreas.forEach(pillar => {
      // CRITICAL FIX: Only generate actions for pillars with actual responses
      const pillarHasResponses = pillar.dimensions.some(dimension =>
        dimension.questions.some(question => {
          const currentKey = `${question.id}_current_state`;
          const futureKey = `${question.id}_future_state`;
          return responses[currentKey] !== undefined || responses[futureKey] !== undefined;
        })
      );
      
      if (!pillarHasResponses) {
        return;
      }
      
      let scores = pillarScores[pillar.id];
      if (!scores) {
        const matchedKey = Object.keys(pillarScores || {}).find(k => this.matchPillar(k)?.id === pillar.id);
        if (matchedKey) scores = pillarScores[matchedKey];
      }
      scores = scores || {};

      const currentScore = Math.round(typeof scores.current === 'number' ? scores.current : 3);
      const futureScore = Math.round(typeof scores.future === 'number' ? scores.future : 4);
      const gap = Math.round(typeof scores.gap === 'number' ? scores.gap : (futureScore - currentScore));
      
      // Get pain points for this pillar
      const pillarPainPoints = [];
      pillar.dimensions.forEach(dimension => {
        dimension.questions.forEach(question => {
          const techPainKey = `${question.id}_technical_pain`;
          const bizPainKey = `${question.id}_business_pain`;
          
          if (responses[techPainKey]) {
            const painArray = Array.isArray(responses[techPainKey]) ? responses[techPainKey] : [responses[techPainKey]];
            pillarPainPoints.push(...painArray.map(p => `Technical: ${p}`));
          }
          if (responses[bizPainKey]) {
            const painArray = Array.isArray(responses[bizPainKey]) ? responses[bizPainKey] : [responses[bizPainKey]];
            pillarPainPoints.push(...painArray.map(p => `Business: ${p}`));
          }
        });
      });
      
      actions.push({
        pillarId: pillar.id,
        pillarName: pillar.name,
        currentScore: currentScore,
        targetScore: futureScore,
        gap: gap,
        priority: gap >= 2 ? 'critical' : gap >= 1 ? 'high' : 'low',
        rationale: gap > 0 
          ? `This pillar shows a ${gap}-level maturity gap between your current state (Level ${currentScore}) and desired future state (Level ${futureScore}). ${pillarPainPoints.length > 0 ? `You've identified ${pillarPainPoints.length} pain points that need attention.` : 'Focused improvement is needed.'}`
          : `You're satisfied with the current maturity level (Level ${currentScore}) for this pillar. ${pillarPainPoints.length > 0 ? `However, you've identified ${pillarPainPoints.length} pain points that could be addressed to optimize operations.` : 'Continue maintaining best practices.'}`,
        theGood: this.recommendationEngine.extractPositiveAspects(pillar, responses, currentScore),
        theBad: this.recommendationEngine.extractChallenges(
          pillarPainPoints.filter(p => p.startsWith('Technical:')).map(p => p.replace('Technical: ', '')),
          pillarPainPoints.filter(p => p.startsWith('Business:')).map(p => p.replace('Business: ', '')),
          responses,
          pillar
        ),
        actions: [],
        recommendations: []
      });
    });
    
    console.log(`[OpenAI] Generated ${actions.length} pillar actions total`);
    
    // Sort by gap (largest first) then by priority
    return actions.sort((a, b) => {
      if (b.gap !== a.gap) return b.gap - a.gap;
      const priorityOrder = { 'critical': 3, 'high': 2, 'medium': 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  /**
   * Format overall results from OpenAI response
   */
  formatOverallResults(content, assessment) {
    const overallScores = content.overallScores || content.overall || content.scores || {};
    const pillarScores = content.pillarScores || content.pillar_scores || content.areaScores || content.pillars || {};
    const executiveSummary = content.executiveSummary || content.summary || content.narrative || '';
    const recommendations = content.recommendations || content.topRecommendations || [];
    
    // Generate pillar-specific prioritized actions
    const pillarActions = this.generatePillarPrioritizedActions(pillarScores, assessment);
    
    const currentScore = typeof overallScores.currentScore === 'number' ? overallScores.currentScore : 3;
    const futureScore = typeof overallScores.futureScore === 'number' ? overallScores.futureScore : 4;
    const gap = typeof overallScores.gap === 'number' ? overallScores.gap : (futureScore - currentScore);

    const validPillars = {};
    assessmentFramework.assessmentAreas.forEach(area => {
      let pScore = pillarScores[area.id];
      if (!pScore) {
        const matchedKey = Object.keys(pillarScores || {}).find(k => this.matchPillar(k)?.id === area.id);
        if (matchedKey) pScore = pillarScores[matchedKey];
      }
      pScore = pScore || {};
      const c = typeof pScore.current === 'number' ? pScore.current : 3;
      const f = typeof pScore.future === 'number' ? pScore.future : 4;
      const g = typeof pScore.gap === 'number' ? pScore.gap : (f - c);
      validPillars[area.id] = {
        current: Math.round(c),
        future: Math.round(f),
        gap: Math.round(g),
        overall: Math.round((c + f) / 2)
      };
    });

    return {
      overall: {
        currentScore: Math.round(currentScore),
        futureScore: Math.round(futureScore),
        gap: Math.round(gap),
        level: this.getMaturityLevel(currentScore),
        summary: executiveSummary
      },
      areaScores: validPillars,
      categories: this.formatPillarCategories(pillarScores),
      prioritizedActions: pillarActions, // Use pillar-structured actions
      painPointRecommendations: recommendations || [],
      gapBasedActions: [],
      commentBasedInsights: [],
      roadmap: {},
      quickWins: [],
      riskAreas: []
    };
  }

  /**
   * Generate dimension-level gap-based actions for a pillar
   */
  generatePillarGapActions(assessment, pillarId) {
    const area = this.matchPillar(pillarId);
    if (!area) return [];

    const responses = assessment.responses || {};
    const actions = [];

    area.dimensions.forEach(dimension => {
      dimension.questions.forEach(question => {
        const currentKey = `${question.id}_current_state`;
        const futureKey = `${question.id}_future_state`;
        
        const currentValue = parseInt(responses[currentKey]) || 0;
        const futureValue = parseInt(responses[futureKey]) || 0;
        const gap = futureValue - currentValue;

        if (gap > 0) {
          // Get the maturity level labels
          const currentLevel = this.getMaturityLevel(currentValue);
          const futureLevel = this.getMaturityLevel(futureValue);
          
          actions.push({
            dimension: dimension.name,
            question: question.question,
            current: currentValue,
            future: futureValue,
            gap: parseFloat(gap.toFixed(1)), // Fix floating point precision
            currentLevel: currentLevel ? currentLevel.level : 'Unknown',
            futureLevel: futureLevel ? futureLevel.level : 'Unknown',
            recommendation: `Progress from Level ${currentValue} (${currentLevel?.level || 'Unknown'}) to Level ${futureValue} (${futureLevel?.level || 'Unknown'}) by implementing structured improvements in ${dimension.name.toLowerCase()}.`
          });
        }
      });
    });

    // Sort by gap (largest first)
    return actions.sort((a, b) => b.gap - a.gap);
  }

  /**
   * Format pillar results from OpenAI response
   */
  formatPillarResults(content, assessment, pillarId) {
    const { scores, summary, recommendations, databricksFeatures } = content;
    const area = this.matchPillar(pillarId);
    
    // Generate dimension-level gap actions
    const gapActions = this.generatePillarGapActions(assessment, pillarId);
    
    return {
      pillar: {
        id: area ? area.id : pillarId,
        name: area ? area.name : pillarId,
        currentScore: Math.round(scores?.current || 3),
        futureScore: Math.round(scores?.future || 4),
        gap: parseFloat((scores?.gap || 1).toFixed(1)), // Fix floating point precision
        level: this.getMaturityLevel(scores?.current || 3),
        targetLevel: this.getMaturityLevel(scores?.future || 4)
      },
      summary: summary || '',
      recommendations: recommendations || [],
      databricksFeatures: databricksFeatures || [],
      painPointRecommendations: recommendations || [],
      gapBasedActions: gapActions,
      commentBasedInsights: []
    };
  }

  /**
   * Format pillar categories for overall results
   */
  formatPillarCategories(pillarScores = {}) {
    const categories = {};
    
    assessmentFramework.assessmentAreas.forEach(area => {
      let scores = pillarScores[area.id];
      if (!scores) {
        const matchedKey = Object.keys(pillarScores || {}).find(k => this.matchPillar(k)?.id === area.id);
        if (matchedKey) scores = pillarScores[matchedKey];
      }
      scores = scores || {};
      const current = typeof scores.current === 'number' ? scores.current : 3;
      const future = typeof scores.future === 'number' ? scores.future : 4;
      const gap = typeof scores.gap === 'number' ? scores.gap : (future - current);
      
      categories[area.id] = {
        name: area.name,
        currentScore: Math.round(current),
        futureScore: Math.round(future),
        gap: Math.round(gap),
        level: this.getMaturityLevel(current),
        targetLevel: this.getMaturityLevel(future),
        recommendations: []
      };
    });
    
    return categories;
  }

  /**
   * Fallback content when OpenAI is unavailable
   */
  generateFallbackContent(assessment, pillarId) {
    console.log('⚠️  Generating fallback content (OpenAI unavailable)');
    console.log('🔍 Fallback - Assessment ID:', assessment.id);
    console.log('🔍 Fallback - Responses null/undefined?:', assessment.responses === null || assessment.responses === undefined);
    console.log('🔍 Fallback - Responses keys:', assessment.responses ? Object.keys(assessment.responses).length : 0);
    
    // FIX: Ensure responses is not null
    const validResponses = assessment.responses || {};
    
    // Import the adaptive engine for fallback
    const AdaptiveRecommendationEngine = require('./adaptiveRecommendationEngine');
    const engine = new AdaptiveRecommendationEngine();
    
    if (pillarId) {
      // Generate pillar-specific fallback
      const recommendations = engine.generateAdaptiveRecommendations(
        validResponses,
        [pillarId]
      );
      
      const area = assessmentFramework.assessmentAreas.find(a => a.id === pillarId);
      const scores = recommendations.areaScores[pillarId] || { current: 0, future: 0, gap: 0 };
      
      // Generate dimension-level gap actions using the same method as OpenAI path
      const gapActions = this.generatePillarGapActions(assessment, pillarId);
      
      return {
        pillar: {
          id: pillarId,
          name: area.name,
          currentScore: scores.current,
          futureScore: scores.future,
          gap: parseFloat(scores.gap.toFixed(1)), // Fix floating point precision
          level: this.getMaturityLevel(scores.current),
          targetLevel: this.getMaturityLevel(scores.future)
        },
        summary: `Based on your responses, this pillar shows a ${scores.gap}-level gap requiring focused attention.`,
        recommendations: recommendations.prioritizedActions || [],
        databricksFeatures: [],
        painPointRecommendations: recommendations.painPointRecommendations || [],
        gapBasedActions: gapActions, // Use dimension-level gaps
        commentBasedInsights: recommendations.commentBasedInsights || []
      };
    } else {
      // Generate overall fallback
      console.log('[OpenAI] ⭐ FALLBACK: Generating overall assessment (not pillar-specific)');
      const recommendations = engine.generateAdaptiveRecommendations(
        validResponses
      );
      console.log('[OpenAI] ⭐ FALLBACK: Adaptive engine returned, checking areaScores...');
      console.log('[OpenAI] ⭐ FALLBACK: recommendations object keys:', Object.keys(recommendations || {}));
      
      // Transform to use pillar-structured actions
      console.log('[OpenAI] About to generate pillar actions. areaScores:', Object.keys(recommendations.areaScores || {}).length, 'pillars');
      const pillarActions = this.generatePillarPrioritizedActions(recommendations.areaScores, assessment);
      console.log('[OpenAI] pillarActions generated:', pillarActions.length);
      recommendations.prioritizedActions = pillarActions;
      console.log('[OpenAI] ⭐ FALLBACK: Returning recommendations with prioritizedActions:', recommendations.prioritizedActions?.length);
      
      return recommendations;
    }
  }

  /**
   * Get pillar-specific architecture expertise context
   */
  getPillarSpecificContext(pillarId) {
    const contexts = {
      platform_governance: `
**Platform & Governance Expertise:**
- Enterprise Unified Catalog for unified governance across multi-cloud object storage and databases
- Fine-grained attribute-based access control (ABAC) and dynamic row/column filtering
- Automated data lineage tracking from source ingestion to BI dashboards and ML models
- Centralized audit logging, query history, and compliance tagging (GDPR, HIPAA, SOC2)
- Infrastructure-as-Code (Terraform / Pulumi) for deterministic workspace and security provisioning
- Automated FinOps policies, tagging enforcement, and cluster cost-management policies

**Quick Wins (Week 1-2):**
1. Establish unified catalog namespace and access policies
2. Configure centralized cloud storage access with IAM roles
3. Implement automated metadata tagging for sensitive/PII data
4. Enforce automated budget thresholds and inactive cluster auto-termination`,

      data_engineering: `
**Data Engineering Expertise:**
- Modern multi-layer lakehouse architecture (Raw/Bronze, Cleansed/Silver, Curated/Gold)
- Declarative data pipelines with built-in data quality expectations and schema enforcement
- Automated schema evolution and real-time CDC (Change Data Capture) ingestion
- Open table formats (Delta Lake, Apache Iceberg) with automated compaction and file optimization
- Orchestrated directed acyclic graphs (DAGs) with automated retries and alerting
- Separation of storage and compute for elastic processing efficiency

**Quick Wins (Week 1-2):**
1. Migrate legacy batch scripts to declarative pipeline definitions
2. Implement schema validation and data quality assertions on ingest
3. Configure automated change data capture for core transactional sources
4. Set up unified data pipeline observability and failure notifications`,

      analytics_bi: `
**Analytics & BI Expertise:**
- Serverless vectorized SQL engines for sub-second query performance on lakehouse storage
- Centralized semantic data layer to eliminate metric inconsistencies across departments
- Governed data sharing protocols for secure internal and external consumer exchange
- Natural-language query interfaces and self-service BI exploration
- Multi-engine query federation across enterprise warehouses without massive ETL duplication
- Comprehensive query execution profiling to identify bottleneck scans and resource waste

**Quick Wins (Week 1-2):**
1. Provision elastic serverless SQL compute pools
2. Build verified semantic models for core executive KPIs
3. Connect enterprise BI tools via optimized native connectors
4. Implement automated query acceleration and caching policies`,

      machine_learning: `
**Machine Learning Expertise:**
- Standardized MLOps lifecycle: experiment tracking, model registry, and reproducible pipelines
- Centralized Feature Store ensuring training/serving consistency and feature reuse
- Managed Model Serving with auto-scaling (CPU/GPU) and automated zero-downtime rollouts
- Automated data and concept drift detection with retraining triggers
- End-to-end lineage linking raw data versions to deployed inference endpoints
- Distributed hyperparameter optimization and automated baseline model benchmarking

**Quick Wins (Week 1-2):**
1. Register existing production models into a centralized model registry
2. Deploy real-time inference endpoints with auto-scaling policies
3. Create a standardized feature repository for top model features
4. Set up continuous model performance and data drift monitoring`,

      generative_ai: `
**Generative AI Expertise:**
- Enterprise Retrieval-Augmented Generation (RAG) with governed vector databases and hybrid search
- Enterprise AI Gateway with rate limiting, cost attribution, and multi-model fallback routing
- Comprehensive LLM evaluation frameworks (hallucination scoring, ground truth adherence, latency)
- Guardrails, content filtering, and automated PII redaction on inputs and outputs
- Fine-tuning and parameter-efficient adaptation (PEFT/LoRA) for domain-specific tasks
- Agentic multi-agent orchestration for autonomous business workflows

**Quick Wins (Week 1-2):**
1. Provision governed vector database endpoints synced with clean curated data
2. Establish centralized AI gateway with automated token cost tracking
3. Implement automated evaluation benchmarks and guardrails for GenAI prototypes
4. Deploy structured RAG pipelines for internal enterprise knowledge retrieval`,

      operational_excellence: `
**Operational Excellence Expertise:**
- Automated CI/CD deployment pipelines for data, analytics, and machine learning assets
- Full-stack platform telemetry, audit analytics, and centralized observability dashboards
- FinOps chargeback models, compute right-sizing, and automated idle capacity termination
- Comprehensive disaster recovery (RPO < 15 min, RTO < 1 hour) with cross-region replication
- Center of Excellence (CoE) operating models with self-service enablement paths
- Automated security scanning, secret management, and access review certifications

**Quick Wins (Week 1-2):**
1. Implement automated CI/CD for pipeline code and infrastructure configuration
2. Configure centralized cluster cost allocation dashboards and FinOps alerts
3. Establish disaster recovery runbooks and automated backup snapshots
4. Deploy standardized self-service templates for new analytical project onboarding`
    };

    return contexts[pillarId] || `**${pillarId} - Modern architecture guidance**`;
  }

  /**
   * Get area questions
   */
  getAreaQuestions(area) {
    const questions = [];
    if (area.dimensions) {
      area.dimensions.forEach(dimension => {
        if (dimension.questions) {
          questions.push(...dimension.questions);
        }
      });
    } else if (area.questions) {
      questions.push(...area.questions);
    }
    return questions;
  }

  /**
   * Get maturity level for a given score
   */
  getMaturityLevel(score) {
    const roundedScore = Math.round(score);
    const level = Math.max(1, Math.min(5, roundedScore));
    
    const maturityLevels = {
      1: {
        level: 'Explore',
        description: 'Ad-hoc, manual processes with limited standardization',
        color: '#ff4444'
      },
      2: {
        level: 'Experiment',
        description: 'Basic implementation with some repeatability',
        color: '#ff8800'
      },
      3: {
        level: 'Formalize',
        description: 'Documented standards and processes consistently followed',
        color: '#ffaa00'
      },
      4: {
        level: 'Optimize',
        description: 'Advanced automation and continuous improvement',
        color: '#88cc00'
      },
      5: {
        level: 'Transform',
        description: 'Industry-leading practices with AI-driven optimization',
        color: '#00cc44'
      }
    };
    
    return maturityLevels[level];
  }
}

module.exports = OpenAIContentGenerator;

