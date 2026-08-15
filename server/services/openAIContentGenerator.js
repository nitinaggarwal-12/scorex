// OpenAI Content Generator - Generates all assessment content dynamically
// This service sends assessment data to OpenAI and gets back personalized recommendations

const assessmentFramework = require('../data/assessmentFramework');
const RecommendationEngine = require('./recommendationEngine');

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
    } else {
      console.warn('⚠️  OpenAI API key not configured. Content generation will use fallback logic.');
    }
  }

  /**
   * Generate complete assessment results using OpenAI
   * @param {object} assessment - Full assessment object with responses
   * @param {string} pillarId - Optional: specific pillar to generate results for
   * @returns {object} Complete results structure
   */
  async generateAssessmentContent(assessment, pillarId = null) {
    if (!this.isInitialized) {
      console.warn('⚠️  OpenAI not initialized, using fallback content');
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
        model: 'gpt-4-turbo-preview',
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
        temperature: 0.9, // 🔥 INCREASED: Generate more varied, unique content for each assessment
        max_tokens: 4000,
        response_format: { type: 'json_object' }
      });

      const content = JSON.parse(response.choices[0].message.content);
      console.log('✅ OpenAI content generated successfully');
      console.log(`   Executive Summary length: ${content.executiveSummary?.length || 0} chars`);
      console.log(`   Recommendations count: ${content.recommendations?.length || 0}`);
      console.log(`   First 100 chars of summary: ${(content.executiveSummary || '').substring(0, 100)}...`);
      
      return pillarId 
        ? this.formatPillarResults(content, assessment, pillarId)
        : this.formatOverallResults(content, assessment);
      
    } catch (error) {
      console.error('❌ Error generating content from OpenAI:', error.message);
      return this.generateFallbackContent(assessment, pillarId);
    }
  }

  /**
   * Get system prompt for OpenAI
   */
  getSystemPrompt() {
    return `You are a Databricks platform expert and CTO advisor specializing in data platform maturity assessments.

Your role is to analyze assessment responses and provide:
1. Accurate, data-driven insights based on actual user input
2. Specific, actionable recommendations using latest Databricks features (2024-2025)
3. Strategic guidance focused on business impact and ROI
4. Factual analysis without speculative dollar amounts

Key principles:
- Base ALL recommendations on actual user responses (current state, future state, pain points, comments)
- Reference only real Databricks features with verified capabilities
- Focus on measurable business outcomes, not made-up cost figures
- Provide CTO-level strategic narrative, not just technical lists
- Be specific about WHY recommendations matter to THIS organization

Latest Databricks capabilities to consider:
- Unity Catalog for governance and data sharing
- Delta Live Tables for automated data pipelines
- Lakehouse Monitoring for data quality
- Serverless compute for cost optimization
- AI/BI with Genie for natural language queries
- Mosaic AI for GenAI applications
- Vector Search for RAG applications
- Model Serving for LLM deployment

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

    return `# Databricks Platform Maturity Assessment Analysis

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
   - Priority initiatives with specific Databricks features that address identified pain points
   - Expected business outcomes (based on gaps and pain points, not made-up numbers)

4. **Top 5 Priority Recommendations:**
   For each recommendation provide:
   - Title
   - Description (why it matters to THIS organization based on their responses)
   - Specific actions (using latest Databricks features)
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

## Task - Act as Databricks ${area.name} SME (Subject Matter Expert)

You are a PASSIONATE Databricks solutions architect with 8+ years of hands-on experience. You've implemented ${area.name} for Fortune 500 companies. You LOVE Databricks and know every feature intimately. You speak with confidence and specificity because you've done this dozens of times.

## Your Databricks Expertise Context (Oct 2024):

**Latest Databricks Capabilities:**
- Unity Catalog: Fine-grained governance, attribute-based access control (ABAC), data lineage across clouds
- Delta Live Tables (DLT): Declarative ETL, auto-scaling, expectations for data quality, CDC support
- Databricks SQL Serverless: Sub-second query response, photon engine, automatic scaling
- MLflow 2.x: Model registry, automated retraining, feature serving, LLM tracking
- Databricks Assistant: AI-powered SQL/Python code generation, debugging assistant
- Vector Search: Native vector database for RAG applications, auto-sync with Delta tables
- Lakehouse Federation: Query Snowflake, BigQuery, PostgreSQL without data movement
- AI/BI Dashboards: Genie for natural language queries, automatic insights
- Workflows: Orchestration with 100+ tasks, dynamic task mapping, better than Airflow
- Databricks Apps: Deploy Streamlit/Gradio apps directly on platform

**Common Anti-Patterns You've Seen:**
- Manual workspace provisioning → Use Terraform + Unity Catalog assignment automation
- Scattered notebooks → Migrate to DLT pipelines with Git integration
- Manual cluster management → Use Serverless SQL and Jobs compute
- Custom monitoring → Use System Tables (audit logs, query history, lineage)
- Multiple ETL tools → Consolidate to DLT + Workflows
- Fragmented governance → Unity Catalog as single source of truth

**Pillar-Specific Databricks Expertise for ${area.name}:**

${this.getPillarSpecificContext(pillarId)}

## Your Task:
Generate DIRECT, ACTIONABLE, UNAMBIGUOUS recommendations based on the data above.

**Remember:** You're not a consultant giving vague advice. You're a hands-on architect who has BUILT this exact solution 50+ times. Give them the EXACT steps you would take if you joined their team tomorrow. Use real feature names, real commands, real timelines from your experience.

### Requirements for Actionable Recommendations:
- **Be Specific**: Name exact Databricks features/products (Unity Catalog, Delta Live Tables, MLflow, etc.)
- **Be Prescriptive**: Tell them WHAT to do, HOW to do it, and WHEN to do it
- **Be Technical**: Include actual implementation steps, not high-level platitudes
- **Address Pain Points**: Explicitly map each recommendation to the pain points they selected
- **Provide Timelines**: Specify sprint/week/month estimates for each phase
- **Include Prerequisites**: State what needs to be in place first

### Bad Example (Too Generic):
❌ "Implement proper governance" 
❌ "Enhance monitoring and observability"
❌ "Improve security posture"

### Good Example (Specific & Actionable):
✅ "Enable Unity Catalog on your workspace within 2 weeks: 1) Create metastore in your region, 2) Assign to workspace, 3) Migrate 5 critical schemas using UC migration tool, 4) Configure external locations for your S3 buckets. This addresses your 'Inconsistent access control' pain point."

✅ "Implement Delta Live Tables for your ETL pipelines: Week 1-2: Identify 3 critical batch jobs, Week 3-4: Rewrite using DLT declarative syntax, Week 5: Set up expectations for data quality, Week 6: Enable CDC for incremental loads. This solves your 'Manual pipeline monitoring' pain."

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
   - **Specific Actions**: Numbered steps (1, 2, 3...) with exact Databricks features
   - **Prerequisites**: What must be in place first
   - **Timeline**: Weeks or sprints (be realistic: 1-4 weeks typical)
   - **Team Required**: Who needs to execute (Data Engineers, Platform Admin, etc.)
   - **Success Metrics**: How to measure completion
   - **Priority**: Critical/High/Medium based on pain severity

4. **Databricks Features/Products** (3-5 specific items):
   - Feature name (e.g., "Unity Catalog", "Delta Live Tables", "Databricks SQL Serverless")
   - Status (GA/Public Preview/Private Preview as of Oct 2024)
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
        "Step 1: <Specific action with Databricks feature>",
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
      "name": "<Exact Databricks feature name>",
      "status": "<GA|Public Preview|Private Preview>",
      "relevance": "<Why relevant to their pain points>",
      "type": "<quick-win|foundational>",
      "action": "<How to get started with this feature>"
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
   * Get pillar-specific Databricks expertise context
   */
  getPillarSpecificContext(pillarId) {
    const contexts = {
      platform_governance: `
**Platform & Governance Expertise:**
- Unity Catalog is THE game-changer (GA since 2023). It's not optional anymore.
- Start with account-level metastore → Assign to workspaces → Migrate legacy Hive metastore
- Use external locations for S3/ADLS/GCS buckets (no more mount points!)
- Implement attribute-based access control (ABAC) for dynamic row/column filtering
- System tables (system.access, system.audit, system.query) are goldmines for monitoring
- Terraform provider 1.x has full UC support - infrastructure as code is mandatory
- Personal Compute clusters for dev, Serverless for production (cost optimization)
- Compliance view shows PII/PHI automatically - huge for GDPR/HIPAA

**Quick Wins (Week 1-2):**
1. Enable UC on workspace
2. Create 3-tier namespace (catalog.schema.table)
3. Set up external locations
4. Migrate 5 critical tables`,

      data_engineering: `
**Data Engineering Expertise:**
- Delta Live Tables (DLT) > custom notebooks. Period. 10x faster to build, 5x less code.
- Use DLT expectations for data quality: @dlt.expect() for warnings, @dlt.expect_or_drop() for drops
- Streaming tables with Auto Loader for S3/ADLS (handles schema evolution automatically)
- Liquid clustering replaces Z-ORDER (no more manual optimization!)
- Change Data Feed (CDF) for incremental processing - enable with ALTER TABLE
- Unity Catalog volumes for unstructured data (PDFs, images, etc.)
- Workflows > Airflow - native integration, better UI, automatic retries

**Quick Wins (Week 1-2):**
1. Convert 1 notebook to DLT pipeline
2. Enable Auto Loader for landing zone
3. Add expectations for data quality
4. Set up incremental processing with CDF`,

      analytics_bi: `
**Analytics & BI Expertise:**
- Databricks SQL Serverless = game over for Snowflake on cost (pay per query second)
- Photon engine 2.0: 3-5x faster, no config needed
- Genie (AI/BI) for natural language queries - business users LOVE this
- SQL warehouses with serverless compute auto-scale 0 to 100+ clusters
- Query federation to read Snowflake/BigQuery without ETL (saves months)
- Dashboards with automatic refresh, alerts, scheduled emails
- SQL UDFs and Databricks Functions for reusable logic
- Query profile shows exact bottlenecks (scan vs compute vs network)

**Quick Wins (Week 1-2):**
1. Create serverless SQL warehouse
2. Connect Power BI/Tableau
3. Build 5 dashboards from key tables
4. Enable Genie for business users`,

      machine_learning: `
**Machine Learning Expertise:**
- MLflow is industry standard (not just Databricks) - 10M+ downloads/month
- Feature Store for reusable features across models (training/serving consistency)
- Model serving with auto-scaling (CPU or GPU), A/B testing built-in
- AutoML for baseline models in 10 minutes (95% accuracy often)
- Hyperopt for distributed hyperparameter tuning (100x faster)
- Unity Catalog for model governance (lineage from data to model to endpoint)
- Mosaic AI Model Training for distributed LLMs (LLaMA, Mistral, etc.)

**Quick Wins (Week 1-2):**
1. Register existing model in MLflow
2. Deploy to Model Serving endpoint
3. Create Feature Store for top 10 features
4. Run AutoML on one use case`,

      generative_ai: `
**Generative AI Expertise:**
- Mosaic AI is the ONLY platform that does end-to-end LLMs (training → serving → monitoring)
- Vector Search (GA): Native integration with Delta tables, auto-sync, 10x faster than Pinecone
- RAG Studio for building retrieval apps visually (no code needed for PoC)
- DBRX model (open-source, outperforms GPT-3.5) runs natively
- LLM eval suite for testing quality (perplexity, ROUGE, BLEU)
- AI Functions (ai_query, ai_extract) in SQL - query your data with natural language
- Model Serving supports vLLM, TGI, MLflow (flexible deployment)
- Pay per token pricing for Foundation Model APIs

**Quick Wins (Week 1-2):**
1. Create vector search endpoint
2. Ingest documents to Delta table
3. Build RAG chatbot with RAG Studio
4. Deploy with Databricks Apps`,

      operational_excellence: `
**Operational Excellence Expertise:**
- System tables are your monitoring layer (free, always on, 14 days retention)
- Use system.compute.clusters to track cluster utilization and right-size
- Query history (system.query.history) shows slow queries and optimization opportunities
- Workflows for orchestration: 100+ task types, dynamic mapping, error handling
- Databricks CLI 0.2+ uses REST API 2.1 (10x faster than legacy CLI)
- Terraform provider 1.x for infrastructure as code (workspaces, clusters, jobs, notebooks)
- Budget alerts to prevent cost overruns (set at workspace or job level)
- Enhanced autoscaling: Scale down to zero for cost, scale up in seconds

**Quick Wins (Week 1-2):**
1. Query system.compute.clusters for right-sizing
2. Create Terraform for common patterns
3. Set up budget alerts
4. Migrate 3 jobs to Workflows`
    };

    return contexts[pillarId] || `**${pillarId} - Expertise coming soon**`;
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

