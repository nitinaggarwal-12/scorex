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
        const result = await geminiService._generateWithFallback(prompt + '\n\nIMPORTANT: Return ONLY a valid JSON object matching the requested schema.', systemPrompt, 0.7);
        const jsonMatch = result.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          console.log(`✅ Gemini (gemini-3.7-flash) generated and parsed successfully (${result.modelUsed})`);
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
2. Specific, actionable, vendor-neutral recommendations using modern cloud data lakehouse, data mesh, and GenAI best practices
3. Strategic guidance focused on business impact, operational resilience, and FinOps ROI
4. Factual analysis without speculative figures

Key principles:
- Base ALL recommendations on actual user responses (current state, future state, pain points, comments)
- Reference proven architectural patterns (Unified Catalog, Declarative Data Pipelines, Lakehouse Storage, Serverless Vectorized SQL, MLOps, RAG, AI Guardrails)
- Focus on measurable business outcomes and operational maturity
- Provide CTO-level strategic narrative, not just high-level platitudes
- Be specific about WHY recommendations matter to THIS organization

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
   * Generate pillar-specific prioritized actions from pillar scores
   */
  generatePillarPrioritizedActions(pillarScores, assessment) {
    const actions = [];
    const responses = assessment.responses || {};
    
    console.log(`[OpenAI] Generating pillar actions for ${Object.keys(pillarScores).length} pillars`);
    
    Object.keys(pillarScores).forEach(pillarId => {
      const pillar = assessmentFramework.assessmentAreas.find(a => a.id === pillarId);
      if (!pillar) return;
      
      // CRITICAL FIX: Only generate actions for pillars with actual responses
      const pillarHasResponses = pillar.dimensions.some(dimension =>
        dimension.questions.some(question => {
          const currentKey = `${question.id}_current_state`;
          const futureKey = `${question.id}_future_state`;
          return responses[currentKey] !== undefined || responses[futureKey] !== undefined;
        })
      );
      
      if (!pillarHasResponses) {
        console.log(`⏭️ Skipping pillar ${pillarId} - no responses found`);
        return; // Skip this pillar - no data to generate actions from
      }
      
      const scores = pillarScores[pillarId];
      const currentScore = Math.round(scores.current);
      const futureScore = Math.round(scores.future);
      const gap = Math.round(scores.gap);
      
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
      
      // Generate action for ALL completed pillars (even if gap is 0)
      console.log(`[OpenAI] Creating action for pillar ${pillarId} (gap: ${gap})`);
      actions.push({
        pillarId: pillarId,
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
        // NOTE: actions/recommendations will be populated by context-aware engine
        // Don't generate generic garbage here - let the pain-point-based recommendations take over
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
    const { overallScores, pillarScores, executiveSummary, recommendations } = content;
    
    // Generate pillar-specific prioritized actions
    const pillarActions = this.generatePillarPrioritizedActions(pillarScores, assessment);
    
    return {
      overall: {
        currentScore: Math.round(overallScores.currentScore),
        futureScore: Math.round(overallScores.futureScore),
        gap: Math.round(overallScores.gap),
        level: this.getMaturityLevel(overallScores.currentScore),
        summary: executiveSummary
      },
      areaScores: Object.keys(pillarScores).reduce((acc, pillarId) => {
        acc[pillarId] = {
          current: Math.round(pillarScores[pillarId].current),
          future: Math.round(pillarScores[pillarId].future),
          gap: Math.round(pillarScores[pillarId].gap),
          overall: Math.round((pillarScores[pillarId].current + pillarScores[pillarId].future) / 2)
        };
        return acc;
      }, {}),
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
    const area = assessmentFramework.assessmentAreas.find(a => a.id === pillarId);
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
    const area = assessmentFramework.assessmentAreas.find(a => a.id === pillarId);
    
    // Generate dimension-level gap actions
    const gapActions = this.generatePillarGapActions(assessment, pillarId);
    
    return {
      pillar: {
        id: pillarId,
        name: area.name,
        currentScore: Math.round(scores.current),
        futureScore: Math.round(scores.future),
        gap: parseFloat(scores.gap.toFixed(1)), // Fix floating point precision
        level: this.getMaturityLevel(scores.current),
        targetLevel: this.getMaturityLevel(scores.future)
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
  formatPillarCategories(pillarScores) {
    const categories = {};
    
    Object.keys(pillarScores).forEach(pillarId => {
      const area = assessmentFramework.assessmentAreas.find(a => a.id === pillarId);
      const scores = pillarScores[pillarId];
      
      categories[pillarId] = {
        name: area.name,
        currentScore: Math.round(scores.current),
        futureScore: Math.round(scores.future),
        gap: Math.round(scores.gap),
        level: this.getMaturityLevel(scores.current),
        targetLevel: this.getMaturityLevel(scores.future),
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

