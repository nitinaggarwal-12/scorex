const express = require('express');
const router = express.Router();
const pool = require('../db/connection');
const { v4: uuidv4 } = require('uuid');

// Helper function to check if PostgreSQL is available
async function isPostgresAvailable() {
  try {
    await pool.query('SELECT 1');
    return true;
  } catch (error) {
    return false;
  }
}

// Get or create conversation for a user session
router.post('/conversation/start', async (req, res) => {
  try {
    const { userEmail, sessionId, assessmentId } = req.body;

    if (!await isPostgresAvailable()) {
      return res.status(503).json({ error: 'Database not available' });
    }

    // Check if there's an existing active conversation
    let conversation = await pool.query(
      `SELECT * FROM chat_conversations 
       WHERE session_id = $1 
       AND last_message_at > NOW() - INTERVAL '24 hours'
       ORDER BY last_message_at DESC 
       LIMIT 1`,
      [sessionId]
    );

    if (conversation.rows.length > 0) {
      return res.json({ conversation: conversation.rows[0] });
    }

    // Create new conversation
    const newConversation = await pool.query(
      `INSERT INTO chat_conversations (user_email, session_id, assessment_id, context_type)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [userEmail, sessionId, assessmentId, assessmentId ? 'assessment' : 'general']
    );

    res.json({ conversation: newConversation.rows[0] });
  } catch (error) {
    console.error('Error starting conversation:', error);
    res.status(500).json({ error: 'Failed to start conversation' });
  }
});

// Send a message and get AI response
router.post('/message', async (req, res) => {
  try {
    const { conversationId, message, sessionId, userEmail, context } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!await isPostgresAvailable()) {
      return res.status(503).json({ error: 'Database not available' });
    }

    let convId = conversationId;

    // Create conversation if it doesn't exist
    if (!convId) {
      const newConv = await pool.query(
        `INSERT INTO chat_conversations (user_email, session_id, context_type)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [userEmail, sessionId, context?.pageType || 'general']
      );
      convId = newConv.rows[0].id;
    }

    // Save user message
    await pool.query(
      `INSERT INTO chat_messages (conversation_id, role, content)
       VALUES ($1, $2, $3)`,
      [convId, 'user', message]
    );

    // Update last_message_at
    await pool.query(
      `UPDATE chat_conversations 
       SET last_message_at = NOW() 
       WHERE id = $1`,
      [convId]
    );

    // Get conversation context (last 10 messages)
    const contextMessages = await pool.query(
      `SELECT role, content FROM chat_messages 
       WHERE conversation_id = $1 
       ORDER BY created_at DESC 
       LIMIT 10`,
      [convId]
    );

    // Get assessment data if available
    let assessmentData = null;
    if (context?.pageData?.assessmentId) {
      try {
        const assessmentResult = await pool.query(
          `SELECT * FROM assessments WHERE id = $1`,
          [context.pageData.assessmentId]
        );
        if (assessmentResult.rows.length > 0) {
          assessmentData = assessmentResult.rows[0];
        }
      } catch (err) {
        console.error('Error fetching assessment data:', err);
      }
    }

    // Generate AI response with full context
    const { response: aiResponse, suggestedQuestions } = await generateSmartAIResponse(
      message, 
      contextMessages.rows.reverse(), 
      context,
      assessmentData,
      pool
    );

    // Save AI response
    await pool.query(
      `INSERT INTO chat_messages (conversation_id, role, content)
       VALUES ($1, $2, $3)`,
      [convId, 'assistant', aiResponse]
    );

    // Update last_message_at again
    await pool.query(
      `UPDATE chat_conversations 
       SET last_message_at = NOW() 
       WHERE id = $1`,
      [convId]
    );

    console.log('[API] AI Response type:', typeof aiResponse);
    console.log('[API] AI Response keys:', aiResponse ? Object.keys(aiResponse) : 'null');
    console.log('[API] suggestedQuestions type:', typeof suggestedQuestions);
    console.log('[API] suggestedQuestions value:', suggestedQuestions);
    
    // Ensure suggestedQuestions is always an array
    const finalSuggestedQuestions = Array.isArray(suggestedQuestions) && suggestedQuestions.length > 0 
      ? suggestedQuestions 
      : ["Tell me more", "What else?", "How does this work?", "Show me examples"];
    
    console.log('[API] Final suggested questions:', finalSuggestedQuestions);
    console.log('[API] Sending response...');
    
    res.json({
      conversationId: convId,
      response: aiResponse,
      suggestedQuestions: finalSuggestedQuestions
    });
  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

// Get conversation history
router.get('/conversation/:conversationId/messages', async (req, res) => {
  try {
    const { conversationId } = req.params;

    if (!await isPostgresAvailable()) {
      return res.status(503).json({ error: 'Database not available' });
    }

    const messages = await pool.query(
      `SELECT id, role, content, created_at 
       FROM chat_messages 
       WHERE conversation_id = $1 
       ORDER BY created_at ASC`,
      [conversationId]
    );

    res.json({ messages: messages.rows });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Get user's conversations
router.get('/conversations', async (req, res) => {
  try {
    const { sessionId, userEmail } = req.query;

    if (!await isPostgresAvailable()) {
      return res.status(503).json({ error: 'Database not available' });
    }

    let query = `SELECT * FROM chat_conversations WHERE `;
    let params = [];

    if (sessionId) {
      query += `session_id = $1 `;
      params.push(sessionId);
    } else if (userEmail) {
      query += `user_email = $1 `;
      params.push(userEmail);
    } else {
      return res.status(400).json({ error: 'sessionId or userEmail required' });
    }

    query += `ORDER BY last_message_at DESC LIMIT 10`;

    const conversations = await pool.query(query, params);

    res.json({ conversations: conversations.rows });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

// Helper function to get follow-up questions based on topic and context
function getSuggestedFollowUpQuestions(messageLower, pageType, hasAssessmentData, conversationHistory = []) {
  // Count how many messages in this conversation
  const messageCount = conversationHistory.length;
  
  // Use message count to rotate through different question sets
  const rotationIndex = messageCount % 3; // Rotate through 3 different sets
  
  console.log('[Questions] Message count:', messageCount);
  console.log('[Questions] Rotation index:', rotationIndex);
  console.log('[Questions] User message:', messageLower.substring(0, 50));
  
  // Helper to get questions from multiple sets based on rotation
  const getRotatedQuestions = (set1, set2, set3) => {
    const sets = [set1, set2, set3];
    let selected = sets[rotationIndex];
    
    // Filter out questions that are EXACTLY or VERY similar to what user just asked
    const userMessageNormalized = messageLower.replace(/[?!.,]/g, '').trim();
    const filtered = selected.filter(q => {
      const qNormalized = q.toLowerCase().replace(/[?!.,]/g, '').trim();
      // Exact match or very high similarity (>80% of words match)
      if (qNormalized === userMessageNormalized) return false;
      
      const userWords = userMessageNormalized.split(' ').filter(w => w.length > 3);
      const qWords = qNormalized.split(' ').filter(w => w.length > 3);
      const matchCount = qWords.filter(w => userWords.includes(w)).length;
      const similarity = matchCount / Math.max(userWords.length, qWords.length);
      
      // Only filter if >70% similar
      return similarity < 0.7;
    });
    
    // If we filtered out too many, try next set
    if (filtered.length < 3) {
      const nextIndex = (rotationIndex + 1) % 3;
      selected = sets[nextIndex];
      console.log('[Questions] Switched to set', nextIndex + 1, 'due to similarity filtering');
    } else {
      selected = filtered;
    }
    
    console.log('[Questions] User asked:', messageLower.substring(0, 50));
    console.log('[Questions] Returning', selected.length, 'questions:', selected);
    return selected.slice(0, 4);
  };
  // Specific Databricks features mentioned
  if (messageLower.includes('delta lake')) {
    return [
      "How does time travel work in Delta Lake?",
      "What are ACID transactions?",
      "How do I implement Delta Lake?",
      "Tell me about Unity Catalog"
    ];
  }
  
  if (messageLower.includes('unity catalog')) {
    return [
      "How does data lineage work?",
      "What are fine-grained permissions?",
      "How do I set up Unity Catalog?",
      "Tell me about Delta Lake"
    ];
  }
  
  if (messageLower.includes('mlflow')) {
    return [
      "How do I track experiments?",
      "What is the Model Registry?",
      "How do I deploy models?",
      "Tell me about Model Serving"
    ];
  }
  
  if (messageLower.includes('delta live tables') || messageLower.includes('dlt')) {
    return [
      "How do I build DLT pipelines?",
      "What are data quality expectations?",
      "How does auto-scaling work?",
      "Tell me about Auto Loader"
    ];
  }
  
  if (messageLower.includes('photon')) {
    return [
      "How much faster is Photon?",
      "Does it work with my existing code?",
      "What workloads benefit most?",
      "How do I enable Photon?"
    ];
  }
  
  if (messageLower.includes('model serving')) {
    return [
      "How do I deploy a model?",
      "What about real-time inference?",
      "How does auto-scaling work?",
      "Tell me about MLflow"
    ];
  }
  
  if (messageLower.includes('ai gateway')) {
    return [
      "How do I access different LLMs?",
      "What security features are included?",
      "How do I track costs?",
      "Tell me about RAG applications"
    ];
  }
  
  // Specific pillars mentioned
  if (messageLower.includes('platform') && messageLower.includes('governance')) {
    return [
      "Tell me about Unity Catalog",
      "How do I implement access controls?",
      "What about data lineage?",
      "Tell me about Data Engineering"
    ];
  }
  
  if (messageLower.includes('data engineering')) {
    return [
      "Tell me about Delta Lake",
      "What is Delta Live Tables?",
      "How do I ensure data quality?",
      "Tell me about Analytics & BI"
    ];
  }
  
  if (messageLower.includes('analytics') || (messageLower.includes('bi') && !messageLower.includes('databricks'))) {
    return [
      "What is Photon?",
      "How do I create dashboards?",
      "Can I connect to Power BI?",
      "Tell me about Machine Learning"
    ];
  }
  
  if (messageLower.includes('machine learning') || messageLower.includes('mlops')) {
    return [
      "Tell me about MLflow",
      "What is Model Serving?",
      "How do I track experiments?",
      "Tell me about Generative AI"
    ];
  }
  
  if (messageLower.includes('generative ai') || messageLower.includes('gen ai') || messageLower.includes('llm')) {
    return [
      "Tell me about AI Gateway",
      "What is RAG?",
      "How do I fine-tune models?",
      "Tell me about Operational Excellence"
    ];
  }
  
  if (messageLower.includes('operational excellence') || messageLower.includes('operations')) {
    return [
      "How do I optimize costs?",
      "What monitoring tools are available?",
      "How do I improve performance?",
      "Tell me about Platform Governance"
    ];
  }
  
  // Questions about starting/getting started
  if (messageLower.includes('start') || messageLower.includes('begin')) {
    return getRotatedQuestions(
      ["What are the 6 pillars?", "How long does it take?", "What information do I need?", "Can I see a demo?"],
      ["Can I save and resume later?", "What are maturity levels?", "Who should take this assessment?", "Tell me about Data Engineering"],
      ["Tell me about Platform Governance", "Can I skip questions?", "Is there a sample assessment?", "How is the assessment scored?"]
    );
  }
  
  // Questions about pillars (general)
  if (messageLower.includes('pillar') || messageLower.includes('categories') || messageLower.includes('6 pillars')) {
    return getRotatedQuestions(
      ["Tell me about Platform Governance", "Tell me about Data Engineering", "Tell me about Machine Learning", "What are maturity levels?"],
      ["Tell me about Analytics & BI", "Tell me about Generative AI", "Tell me about Operational Excellence", "How are pillars scored?"],
      ["What is Delta Lake?", "What is Unity Catalog?", "How do I rate maturity?", "How long does it take?"]
    );
  }
  
  // Questions about maturity levels/scores
  if (messageLower.includes('maturity level') || messageLower.includes('level') || messageLower.includes('1-5') || messageLower.includes('explore') || messageLower.includes('transform')) {
    if (hasAssessmentData) {
      return [
        "What are my biggest gaps?",
        "How can I improve my scores?",
        "Show me recommendations",
        "Which pillar should I focus on?"
      ];
    }
    return [
      "How do I rate maturity?",
      "What's a good score?",
      "How are scores calculated?",
      "What are the 6 pillars?"
    ];
  }
  
  // Questions about scores/results
  if (messageLower.includes('score') && hasAssessmentData) {
    return [
      "What are my biggest gaps?",
      "How can I improve?",
      "Show me Databricks recommendations",
      "What should I prioritize?"
    ];
  }
  
  // Questions about gaps/improvement
  if (messageLower.includes('gap') || messageLower.includes('improve') || messageLower.includes('priority')) {
    return [
      "Show me specific recommendations",
      "What Databricks features should I adopt?",
      "How do I create a roadmap?",
      "What are quick wins?"
    ];
  }
  
  // Questions about recommendations
  if (messageLower.includes('recommendation') || messageLower.includes('suggest')) {
    return [
      "How do I implement these?",
      "What's the ROI?",
      "What are the next steps?",
      "Can I customize recommendations?"
    ];
  }
  
  // Questions about reports/results
  if (messageLower.includes('report') || messageLower.includes('result')) {
    return [
      "Can I edit the report?",
      "How do I export to PDF?",
      "How do I share this?",
      "What's in the Executive Dashboard?"
    ];
  }
  
  // Questions about editing/customization
  if (messageLower.includes('edit') || messageLower.includes('customize') || messageLower.includes('change')) {
    return [
      "What can I edit?",
      "Can I change colors?",
      "How do I add content?",
      "Are changes saved automatically?"
    ];
  }
  
  // Questions about slideshow/presentation
  if (messageLower.includes('slideshow') || messageLower.includes('present') || messageLower.includes('print')) {
    return [
      "How do I navigate slides?",
      "Can I print to PDF?",
      "Which pages have slideshow?",
      "How do I exit slideshow?"
    ];
  }
  
  // Questions about Excel/export
  if (messageLower.includes('excel') || messageLower.includes('export') || messageLower.includes('download')) {
    return [
      "What's in the Excel file?",
      "Can I edit and re-upload?",
      "How do I import changes?",
      "Can I share with my team?"
    ];
  }
  
  // Questions about collaboration
  if (messageLower.includes('assign') || messageLower.includes('team') || messageLower.includes('collaborate')) {
    return [
      "How do I assign to users?",
      "Can I assign specific questions?",
      "How do I track progress?",
      "Can I send reminders?"
    ];
  }
  
  // Questions about pain points
  if (messageLower.includes('pain point') || messageLower.includes('challenge')) {
    return [
      "How do pain points affect recommendations?",
      "What are common challenges?",
      "How specific should I be?",
      "Can I add more pain points later?"
    ];
  }
  
  // Questions about time/duration
  if (messageLower.includes('time') || messageLower.includes('long') || messageLower.includes('duration')) {
    return [
      "Can I save and resume?",
      "What's the quickest way?",
      "Can I skip questions?",
      "How do I start?"
    ];
  }
  
  // Questions about help/confusion
  if (messageLower.includes('help') || messageLower.includes('stuck') || messageLower.includes('confused')) {
    return [
      "Show me the user guide",
      "What can I do on this page?",
      "How do I navigate?",
      "Can I see examples?"
    ];
  }
  
  // Questions about comparison/benchmarks
  if (messageLower.includes('benchmark') || messageLower.includes('compare') || messageLower.includes('percentile')) {
    return [
      "What's a good percentile?",
      "How do I improve my ranking?",
      "What's the industry average?",
      "Can I see detailed comparisons?"
    ];
  }
  
  // Page-specific follow-ups (only if no specific topic matched)
  const pageFollowUps = {
    home: [
      "How do I start an assessment?",
      "What are the 6 pillars?",
      "Show me a demo",
      "What's the Deep Dive?"
    ],
    assessment: [
      "How do I rate maturity?",
      "What are pain points?",
      "Can I skip questions?",
      "How is progress saved?"
    ],
    maturity_report: [
      "What are my biggest gaps?",
      "Show me Databricks recommendations",
      "Can I edit this report?",
      "How do I export to PDF?"
    ],
    executive_dashboard: [
      "What are Strategic Imperatives?",
      "Show me the investment roadmap",
      "What are success metrics?",
      "How do I present this?"
    ],
    insights_dashboard: [
      "What metrics are shown?",
      "How do I track trends?",
      "Can I compare assessments?",
      "How do I export data?"
    ],
    industry_benchmarks: [
      "What's my percentile ranking?",
      "How do I compare to industry?",
      "What's a good ranking?",
      "How can I improve?"
    ],
    deep_dive: [
      "What are the 6 pillars?",
      "What's the maturity framework?",
      "How is it scored?",
      "What do you assess?"
    ],
    user_guide: [
      "Show me key features",
      "How do I get started?",
      "Where's troubleshooting?",
      "Show me workflows"
    ],
    dashboard: [
      "How do I start new assessment?",
      "Can I export to Excel?",
      "How do I view results?",
      "Can I share assessments?"
    ],
    admin: [
      "How do I manage users?",
      "How do I assign assessments?",
      "Can I add custom questions?",
      "How do I view feedback?"
    ]
  };
  
  return pageFollowUps[pageType] || pageFollowUps.home;
}

// Advanced NLP Helper Functions
function extractIntent(message) {
  const lower = message.toLowerCase();
  
  // Question words
  if (lower.match(/^(what|where|when|why|who|which|whose)\b/)) {
    if (lower.includes('what is') || lower.includes('what are') || lower.includes('what does')) return 'definition';
    if (lower.includes('where') && (lower.includes('find') || lower.includes('located') || lower.includes('see'))) return 'navigation';
    if (lower.includes('why')) return 'explanation';
    if (lower.includes('who')) return 'audience';
    if (lower.includes('which')) return 'comparison';
    return 'information';
  }
  
  if (lower.match(/^(how|can|could|should|would)\b/)) {
    if (lower.includes('how do i') || lower.includes('how to') || lower.includes('how can')) return 'instruction';
    if (lower.includes('can i') || lower.includes('could i')) return 'capability';
    if (lower.includes('should i')) return 'recommendation';
    return 'instruction';
  }
  
  // Action verbs
  if (lower.match(/^(show|tell|explain|describe|list|give|provide)\b/)) return 'request';
  if (lower.match(/^(start|begin|create|add|delete|edit|update|change)\b/)) return 'action';
  if (lower.match(/^(help|assist|guide|support)\b/)) return 'help';
  if (lower.match(/^(compare|difference|versus|vs)\b/)) return 'comparison';
  
  // Sentiment
  if (lower.match(/\b(thank|thanks|appreciate|grateful)\b/)) return 'gratitude';
  if (lower.match(/\b(bye|goodbye|see you|later)\b/)) return 'farewell';
  if (lower.match(/\b(hi|hello|hey|greetings)\b/)) return 'greeting';
  if (lower.match(/\b(stuck|confused|lost|don't understand|unclear)\b/)) return 'confusion';
  if (lower.match(/\b(problem|issue|error|bug|broken|not working)\b/)) return 'problem';
  
  return 'general';
}

function extractEntities(message) {
  const lower = message.toLowerCase();
  const entities = {
    pillars: [],
    features: [],
    actions: [],
    pages: [],
    concepts: []
  };
  
  // Pillars
  if (lower.match(/\b(platform|governance|platform & governance|platform and governance)\b/)) entities.pillars.push('platform_governance');
  if (lower.match(/\b(data engineering|data integration|etl|pipeline)\b/)) entities.pillars.push('data_engineering');
  if (lower.match(/\b(analytics|bi|business intelligence|reporting|dashboard)\b/)) entities.pillars.push('analytics_bi');
  if (lower.match(/\b(machine learning|ml|mlops|model)\b/)) entities.pillars.push('machine_learning');
  if (lower.match(/\b(generative ai|gen ai|genai|llm|ai)\b/)) entities.pillars.push('generative_ai');
  if (lower.match(/\b(operational excellence|operations|monitoring|optimization)\b/)) entities.pillars.push('operational_excellence');
  
  // Databricks Features
  if (lower.match(/\b(delta lake|delta)\b/)) entities.features.push('delta_lake');
  if (lower.match(/\b(unity catalog|catalog)\b/)) entities.features.push('unity_catalog');
  if (lower.match(/\b(mlflow)\b/)) entities.features.push('mlflow');
  if (lower.match(/\b(delta live tables|dlt)\b/)) entities.features.push('delta_live_tables');
  if (lower.match(/\b(photon)\b/)) entities.features.push('photon');
  if (lower.match(/\b(model serving|serving)\b/)) entities.features.push('model_serving');
  if (lower.match(/\b(ai gateway|gateway)\b/)) entities.features.push('ai_gateway');
  if (lower.match(/\b(auto loader|autoloader)\b/)) entities.features.push('auto_loader');
  
  // Actions
  if (lower.match(/\b(start|begin|create|new)\b/)) entities.actions.push('start');
  if (lower.match(/\b(edit|modify|change|update|customize)\b/)) entities.actions.push('edit');
  if (lower.match(/\b(export|download|save)\b/)) entities.actions.push('export');
  if (lower.match(/\b(import|upload|load)\b/)) entities.actions.push('import');
  if (lower.match(/\b(share|collaborate|assign)\b/)) entities.actions.push('share');
  if (lower.match(/\b(view|see|show|display)\b/)) entities.actions.push('view');
  if (lower.match(/\b(print|pdf)\b/)) entities.actions.push('print');
  if (lower.match(/\b(slideshow|present|presentation)\b/)) entities.actions.push('slideshow');
  
  // Pages
  if (lower.match(/\b(home|homepage|main page)\b/)) entities.pages.push('home');
  if (lower.match(/\b(dashboard|assessments)\b/)) entities.pages.push('dashboard');
  if (lower.match(/\b(report|results|maturity report)\b/)) entities.pages.push('maturity_report');
  if (lower.match(/\b(executive|command center|strategic)\b/)) entities.pages.push('executive_dashboard');
  if (lower.match(/\b(insights|analytics)\b/)) entities.pages.push('insights_dashboard');
  if (lower.match(/\b(benchmark|industry|comparison)\b/)) entities.pages.push('industry_benchmarks');
  if (lower.match(/\b(deep dive|methodology)\b/)) entities.pages.push('deep_dive');
  if (lower.match(/\b(user guide|guide|help|documentation)\b/)) entities.pages.push('user_guide');
  if (lower.match(/\b(admin|administration|manage users)\b/)) entities.pages.push('admin');
  
  // Concepts
  if (lower.match(/\b(maturity|level|score|rating)\b/)) entities.concepts.push('maturity');
  if (lower.match(/\b(gap|difference|improvement)\b/)) entities.concepts.push('gap');
  if (lower.match(/\b(recommendation|suggestion|advice)\b/)) entities.concepts.push('recommendation');
  if (lower.match(/\b(pain point|challenge|issue|problem)\b/)) entities.concepts.push('pain_point');
  if (lower.match(/\b(roadmap|timeline|phase|plan)\b/)) entities.concepts.push('roadmap');
  if (lower.match(/\b(metric|kpi|measure)\b/)) entities.concepts.push('metric');
  if (lower.match(/\b(percentile|rank|ranking)\b/)) entities.concepts.push('percentile');
  
  return entities;
}

function buildContextualResponse(intent, entities, pageType, assessmentData, conversationHistory) {
  // Analyze conversation history for context
  const previousTopics = conversationHistory.slice(-3).map(msg => msg.content.toLowerCase());
  const hasDiscussedPillars = previousTopics.some(t => t.includes('pillar'));
  const hasDiscussedMaturity = previousTopics.some(t => t.includes('maturity') || t.includes('level'));
  const hasDiscussedRecommendations = previousTopics.some(t => t.includes('recommendation'));
  
  return {
    intent,
    entities,
    pageType,
    hasAssessmentData: !!assessmentData,
    conversationContext: {
      hasDiscussedPillars,
      hasDiscussedMaturity,
      hasDiscussedRecommendations,
      messageCount: conversationHistory.length
    }
  };
}

// Super Smart Context-Aware AI Response Generator
async function generateSmartAIResponse(userMessage, conversationHistory, context, assessmentData, pool) {
  const messageLower = userMessage.toLowerCase();
  const pageType = context?.pageType || 'home';
  const hasAssessmentData = !!assessmentData;
  
  // Extract intent and entities for smarter responses
  const intent = extractIntent(userMessage);
  const entities = extractEntities(userMessage);
  const contextualInfo = buildContextualResponse(intent, entities, pageType, assessmentData, conversationHistory);
  
  // Helper to return response with suggested questions
  const respond = (text) => {
    console.log('[respond] Called with text length:', text.length);
    console.log('[respond] Calling getSuggestedFollowUpQuestions...');
    const suggestedQuestions = getSuggestedFollowUpQuestions(messageLower, pageType, hasAssessmentData, conversationHistory);
    console.log('[respond] Got suggestedQuestions:', suggestedQuestions);
    console.log('[respond] Type:', typeof suggestedQuestions);
    console.log('[respond] Is array:', Array.isArray(suggestedQuestions));
    console.log('[respond] Length:', suggestedQuestions?.length);
    return { response: text, suggestedQuestions: suggestedQuestions || [] };
  };
  
  // ===== INTELLIGENT ENTITY-BASED RESPONSES =====
  
  // Handle specific Databricks feature questions
  if (entities.features.length > 0) {
    const featureDetails = {
      delta_lake: {
        name: "Delta Lake",
        description: "**Delta Lake** is an open-source storage framework that brings ACID transactions to data lakes.",
        keyFeatures: [
          "**ACID Transactions** - Ensures data reliability and consistency",
          "**Time Travel** - Query historical versions of your data",
          "**Schema Evolution** - Automatically handle schema changes",
          "**Unified Batch & Streaming** - Process both types with one framework",
          "**Scalable Metadata** - Handle petabyte-scale tables efficiently"
        ],
        useCase: "Perfect for building reliable data pipelines and ensuring data quality.",
        pillar: "Data Engineering"
      },
      unity_catalog: {
        name: "Unity Catalog",
        description: "**Unity Catalog** provides unified governance for all your data and AI assets across clouds.",
        keyFeatures: [
          "**Centralized Governance** - Single place to manage all data assets",
          "**Fine-Grained Access Control** - Row/column level security",
          "**Data Lineage** - Track data flow end-to-end",
          "**Audit Logging** - Complete visibility into data access",
          "**Cross-Cloud** - Works across AWS, Azure, and GCP"
        ],
        useCase: "Essential for enterprise data governance and compliance.",
        pillar: "Platform & Governance"
      },
      mlflow: {
        name: "MLflow",
        description: "**MLflow** is an open-source platform for managing the complete ML lifecycle.",
        keyFeatures: [
          "**Experiment Tracking** - Log parameters, metrics, and artifacts",
          "**Model Registry** - Version and manage ML models",
          "**Model Deployment** - Deploy models to production",
          "**Project Packaging** - Reproducible ML workflows",
          "**Integration** - Works with any ML library"
        ],
        useCase: "Critical for MLOps and managing ML model lifecycle.",
        pillar: "Machine Learning"
      },
      delta_live_tables: {
        name: "Delta Live Tables (DLT)",
        description: "**Delta Live Tables** is a declarative framework for building reliable data pipelines.",
        keyFeatures: [
          "**Declarative Pipelines** - Define what you want, not how to build it",
          "**Auto-Scaling** - Automatically scales compute resources",
          "**Data Quality** - Built-in expectations and monitoring",
          "**Dependency Management** - Automatic pipeline orchestration",
          "**Continuous Processing** - Real-time and batch in one framework"
        ],
        useCase: "Simplifies building production-grade data pipelines.",
        pillar: "Data Engineering"
      },
      photon: {
        name: "Photon",
        description: "**Photon** is a high-performance query engine that accelerates Spark workloads.",
        keyFeatures: [
          "**3-5x Faster** - Significantly faster than standard Spark",
          "**Lower Cost** - Better price/performance ratio",
          "**Vectorized Processing** - Modern CPU optimization",
          "**Compatible** - Works with existing Spark code",
          "**Automatic** - No code changes required"
        ],
        useCase: "Accelerates analytics, ETL, and data science workloads.",
        pillar: "Data Engineering & Analytics"
      },
      model_serving: {
        name: "Model Serving",
        description: "**Model Serving** provides scalable, low-latency serving of ML models.",
        keyFeatures: [
          "**Real-Time Inference** - Low-latency predictions",
          "**Auto-Scaling** - Scales based on demand",
          "**Multi-Model** - Serve multiple models simultaneously",
          "**Monitoring** - Built-in performance tracking",
          "**Easy Deployment** - One-click model deployment"
        ],
        useCase: "Deploy ML models to production with enterprise-grade reliability.",
        pillar: "Machine Learning"
      },
      ai_gateway: {
        name: "AI Gateway",
        description: "**AI Gateway** provides secure, governed access to LLMs and GenAI applications.",
        keyFeatures: [
          "**Unified Interface** - Access multiple LLM providers",
          "**Security** - PII detection and redaction",
          "**Cost Control** - Rate limiting and usage tracking",
          "**Monitoring** - Track quality and performance",
          "**Governance** - Centralized policy enforcement"
        ],
        useCase: "Build secure, enterprise-grade GenAI applications.",
        pillar: "Generative AI"
      },
      auto_loader: {
        name: "Auto Loader",
        description: "**Auto Loader** incrementally and efficiently processes new data files as they arrive.",
        keyFeatures: [
          "**Incremental Processing** - Only processes new files",
          "**Schema Inference** - Automatically detects schema",
          "**Scalable** - Handles millions of files",
          "**Fault Tolerant** - Exactly-once processing guarantees",
          "**Cloud Native** - Works with S3, ADLS, GCS"
        ],
        useCase: "Efficiently ingest streaming data from cloud storage.",
        pillar: "Data Engineering"
      }
    };
    
    const feature = entities.features[0];
    const details = featureDetails[feature];
    
    if (details) {
      let response = `${details.description}\n\n**Key Capabilities:**\n${details.keyFeatures.map(f => `• ${f}`).join('\n')}\n\n**Use Case:** ${details.useCase}\n\n**Related Pillar:** ${details.pillar}`;
      
      if (intent === 'instruction' && messageLower.includes('use')) {
        response += `\n\n**Getting Started:**\n• Check your ${details.pillar} maturity score\n• Review recommendations in your maturity report\n• Start with pilot projects to build expertise\n• Leverage Databricks documentation and training`;
      }
      
      return respond(response);
    }
  }
  
  // Handle specific pillar questions with deep context
  if (entities.pillars.length > 0 && (intent === 'definition' || intent === 'information' || intent === 'explanation')) {
    const pillarDetails = {
      platform_governance: {
        name: "Platform & Governance",
        icon: "🏛️",
        description: "Focuses on security, compliance, access control, and unified governance across your data platform.",
        keyAreas: [
          "**Unity Catalog** - Centralized data governance",
          "**Access Controls** - Fine-grained permissions (row/column level)",
          "**Data Lineage** - Track data flow and transformations",
          "**Audit & Compliance** - Complete audit trails",
          "**Security** - Encryption, network isolation, SSO"
        ],
        whyMatters: "Critical for enterprise data security, regulatory compliance, and data democratization with proper controls.",
        typicalChallenges: [
          "Fragmented governance across multiple systems",
          "Lack of centralized access control",
          "Difficulty tracking data lineage",
          "Compliance reporting complexity"
        ]
      },
      data_engineering: {
        name: "Data Engineering & Integration",
        icon: "🔷",
        description: "Covers data pipelines, ETL/ELT processes, data quality, and integration patterns.",
        keyAreas: [
          "**Delta Lake** - Reliable data lake storage",
          "**Delta Live Tables** - Declarative pipeline framework",
          "**Auto Loader** - Incremental file ingestion",
          "**Data Quality** - Expectations and monitoring",
          "**Pipeline Orchestration** - Workflow management"
        ],
        whyMatters: "Foundation for all data initiatives - without reliable data engineering, analytics and ML efforts fail.",
        typicalChallenges: [
          "Data quality issues and inconsistencies",
          "Complex pipeline maintenance",
          "Slow batch processing",
          "Difficulty handling schema changes"
        ]
      },
      analytics_bi: {
        name: "Analytics & BI Modernization",
        icon: "📊",
        description: "Encompasses SQL analytics, reporting, dashboards, and business intelligence capabilities.",
        keyAreas: [
          "**SQL Warehouses** - High-performance SQL engine",
          "**Dashboards** - Interactive visualizations",
          "**Photon Engine** - 3-5x faster queries",
          "**BI Tool Integration** - Tableau, Power BI, Looker",
          "**Semantic Layer** - Consistent business metrics"
        ],
        whyMatters: "Enables data-driven decision making across the organization with fast, reliable analytics.",
        typicalChallenges: [
          "Slow query performance",
          "Inconsistent metrics across tools",
          "Limited self-service capabilities",
          "High cost of analytics infrastructure"
        ]
      },
      machine_learning: {
        name: "Machine Learning & MLOps",
        icon: "🤖",
        description: "Covers ML model development, training, deployment, monitoring, and lifecycle management.",
        keyAreas: [
          "**MLflow** - ML lifecycle management",
          "**Feature Store** - Centralized feature repository",
          "**Model Serving** - Real-time and batch inference",
          "**AutoML** - Automated model training",
          "**Model Monitoring** - Track model performance"
        ],
        whyMatters: "Operationalizes ML at scale, moving from experimental models to production AI systems.",
        typicalChallenges: [
          "Models stuck in development, not production",
          "Lack of model versioning and tracking",
          "Difficulty reproducing results",
          "Model drift and performance degradation"
        ]
      },
      generative_ai: {
        name: "Generative AI & Agentic Capabilities",
        icon: "✨",
        description: "Focuses on LLMs, GenAI applications, RAG systems, and AI agents.",
        keyAreas: [
          "**AI Gateway** - Secure LLM access",
          "**Vector Search** - Semantic search capabilities",
          "**RAG Applications** - Retrieval-augmented generation",
          "**Fine-Tuning** - Customize models for your domain",
          "**AI Agents** - Autonomous AI systems"
        ],
        whyMatters: "Unlocks next-generation AI capabilities for customer service, content generation, and intelligent automation.",
        typicalChallenges: [
          "Security and governance concerns with LLMs",
          "High costs of LLM API calls",
          "Hallucinations and accuracy issues",
          "Difficulty integrating with enterprise data"
        ]
      },
      operational_excellence: {
        name: "Operational Excellence & Adoption",
        icon: "⚙️",
        description: "Encompasses monitoring, optimization, cost management, and platform adoption.",
        keyAreas: [
          "**Cost Optimization** - Right-sizing and auto-scaling",
          "**Monitoring & Alerting** - Platform health tracking",
          "**Performance Tuning** - Query and job optimization",
          "**User Adoption** - Training and enablement",
          "**Best Practices** - Standards and governance"
        ],
        whyMatters: "Ensures sustainable, cost-effective operations and maximizes ROI on data platform investments.",
        typicalChallenges: [
          "Unpredictable or high costs",
          "Performance bottlenecks",
          "Low user adoption",
          "Lack of monitoring and observability"
        ]
      }
    };
    
    const pillar = entities.pillars[0];
    const details = pillarDetails[pillar];
    
    if (details) {
      let response = `${details.icon} **${details.name}**\n\n${details.description}\n\n**Key Areas:**\n${details.keyAreas.map(a => `• ${a}`).join('\n')}\n\n**Why It Matters:**\n${details.whyMatters}`;
      
      if (hasAssessmentData && assessmentData.results?.categoryDetails?.[pillar]) {
        const pillarData = assessmentData.results.categoryDetails[pillar];
        const score = pillarData.score || 0;
        const targetScore = pillarData.targetScore || 0;
        const gap = (targetScore - score).toFixed(1);
        
        response += `\n\n**Your Current Status:**\n• Current Maturity: **${score.toFixed(1)}** / 5.0\n• Target Maturity: **${targetScore.toFixed(1)}** / 5.0\n• Gap to Close: **${gap}** points`;
        
        if (gap > 0) {
          response += `\n\n**Recommended Focus:** Close the ${gap}-point gap by addressing the challenges below.`;
        }
      }
      
      response += `\n\n**Common Challenges:**\n${details.typicalChallenges.map(c => `• ${c}`).join('\n')}`;
      
      return respond(response);
    }
  }
  
  // Handle comparison questions
  if (intent === 'comparison' || entities.concepts.includes('gap')) {
    if (hasAssessmentData && assessmentData.results?.categoryDetails) {
      const categoryDetails = assessmentData.results.categoryDetails;
      const gaps = Object.entries(categoryDetails).map(([pillarId, data]) => ({
        pillar: pillarId,
        name: pillarId.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        current: data.score || 0,
        target: data.targetScore || 0,
        gap: (data.targetScore || 0) - (data.score || 0)
      })).sort((a, b) => b.gap - a.gap);
      
      let response = "**Your Maturity Gaps Analysis:**\n\n";
      response += "Here's where you have the biggest opportunities for improvement:\n\n";
      
      gaps.forEach((item, index) => {
        const priority = index === 0 ? "🔴 **Highest Priority**" : index === 1 ? "🟠 **High Priority**" : index === 2 ? "🟡 **Medium Priority**" : "🟢 **Lower Priority**";
        response += `${index + 1}. **${item.name}**\n`;
        response += `   ${priority}\n`;
        response += `   Current: ${item.current.toFixed(1)} → Target: ${item.target.toFixed(1)} (Gap: ${item.gap.toFixed(1)})\n\n`;
      });
      
      response += `**Strategic Recommendation:**\nFocus on the top 2-3 pillars with the largest gaps for maximum impact. Start with quick wins in ${gaps[0].name} to build momentum.`;
      
      return respond(response);
    }
  }
  
  // Handle greeting with context
  if (intent === 'greeting') {
    const greetings = [
      `Hello! 👋 I'm your Databricks Maturity Assessment assistant. You're currently on the **${pageType.replace('_', ' ')}** page.`,
      `Hi there! 😊 Welcome to the Databricks Maturity Assessment. I can help you with anything on this page.`,
      `Hey! 🎯 Ready to explore the assessment? I'm here to guide you through the **${pageType.replace('_', ' ')}** section.`
    ];
    
    const greeting = greetings[Math.floor(Math.random() * greetings.length)];
    return respond(`${greeting}\n\nWhat would you like to know?`);
  }
  
  // Handle confusion/help requests
  if (intent === 'confusion' || intent === 'help') {
    let response = "I'm here to help! Let me guide you through this.\n\n";
    
    if (pageType === 'assessment') {
      response += "**You're taking an assessment.** Here's what to do:\n\n";
      response += "1. **Rate Current Maturity** - Where are you today? (1-5)\n";
      response += "2. **Rate Target Maturity** - Where do you want to be? (1-5)\n";
      response += "3. **Add Pain Points** - What challenges are you facing?\n";
      response += "4. **Add Notes** - Any additional context\n";
      response += "5. **Click Next** - Move to the next question\n\n";
      response += "Your progress is auto-saved - you can come back anytime!";
    } else if (pageType === 'maturity_report') {
      response += "**You're viewing your Maturity Report.** Here's what you can do:\n\n";
      response += "• **Review Scores** - See your maturity levels for each pillar\n";
      response += "• **Check Gaps** - Identify areas for improvement\n";
      response += "• **Read Recommendations** - Get specific Databricks features to adopt\n";
      response += "• **Edit Content** - Hover over cards to customize\n";
      response += "• **Export** - Use slideshow mode to create PDFs\n\n";
      response += "What specific aspect would you like help with?";
    } else {
      response += `**You're on the ${pageType.replace('_', ' ')} page.**\n\n`;
      response += "I can help you:\n";
      response += "• Understand what's on this page\n";
      response += "• Navigate to other sections\n";
      response += "• Learn about assessment features\n";
      response += "• Answer specific questions\n\n";
      response += "Just ask me anything!";
    }
    
    return respond(response);
  }
  
  // ===== GENERAL KNOWLEDGE RESPONSES (MUST COME FIRST) =====
  
  // Questions about pillars (general) - MOVED UP for priority
  if (messageLower.includes('pillar') || messageLower.includes('categories') || messageLower.includes('areas') || messageLower.includes('6 pillars')) {
    return respond("**The 6 Assessment Pillars:**\n\n🏛️ **[Platform & Governance](/deep-dive#platform-governance)**\nSecurity, compliance, Unity Catalog, access control\n\n🔷 **[Data Engineering](/deep-dive#data-engineering)**\nData pipelines, ETL, Delta Lake, data quality\n\n📊 **[Analytics & BI](/deep-dive#analytics-bi)**\nReporting, dashboards, SQL analytics, visualization\n\n🤖 **[Machine Learning](/deep-dive#machine-learning)**\nML models, MLOps, MLflow, model deployment\n\n✨ **[Generative AI](/deep-dive#generative-ai)**\nLLMs, AI applications, AI Gateway, RAG patterns\n\n⚙️ **[Operational Excellence](/deep-dive#operational-excellence)**\nMonitoring, cost optimization, reliability\n\n📚 [View Full Deep Dive](/deep-dive) - Detailed explanation of all pillars\n🚀 [Start Assessment](/assessment/start) - Begin now");
  }
  
  // ===== PAGE-SPECIFIC CONTEXT RESPONSES =====
  
  // HOME PAGE
  if (pageType === 'home') {
    if ((messageLower.includes('what') || messageLower.includes('this page') || messageLower.includes('here')) && !messageLower.includes('pillar')) {
      return respond("You're on the **Home Page** of the Databricks Maturity Assessment tool.\n\nFrom here you can:\n• **Start a new assessment** - Click 'Start Assessment'\n• **Try a sample** - See a demo assessment\n• **View your dashboard** - See all your assessments\n• **Learn more** - Check out the Deep Dive, User Guide, or Pitch Deck\n\nWhat would you like to do?");
    }
  }
  
  // ASSESSMENT IN PROGRESS
  if (pageType === 'assessment') {
    if (messageLower.includes('what') || messageLower.includes('this page') || messageLower.includes('here')) {
      const progress = context.pageData?.progress || 0;
      return `You're currently taking an assessment (${progress}% complete).\n\n**How to proceed:**\n• Rate your **current maturity** (where you are today)\n• Rate your **target maturity** (where you want to be)\n• Add **technical and business pain points**\n• Add **notes** for context\n• Click **Next** to continue\n\nYour progress is auto-saved. You can resume anytime!`;
    }
    
    if (messageLower.includes('score') || messageLower.includes('rate') || messageLower.includes('maturity')) {
      return respond("**Maturity Levels Explained:**\n\n**Level 1 - Explore**: Ad-hoc, manual processes. Just starting.\n\n**Level 2 - Experiment**: Pilot projects, learning phase. Some automation.\n\n**Level 3 - Formalize**: Standardized processes, documented workflows.\n\n**Level 4 - Optimize**: Advanced automation, measurable ROI, best practices.\n\n**Level 5 - Transform**: Industry-leading, innovation driver, fully optimized.\n\nRate honestly based on your current capabilities!");
    }
    
    if (messageLower.includes('pain point') || messageLower.includes('challenge')) {
      return respond("**Pain Points help us give better recommendations!**\n\n**Technical Pain Points**: Infrastructure issues, performance problems, integration challenges, technical debt.\n\n**Business Pain Points**: Cost concerns, time delays, resource constraints, compliance issues, skill gaps.\n\nBe specific - the more detail you provide, the more tailored your recommendations will be!");
    }
  }
  
  // MATURITY REPORT
  if (pageType === 'maturity_report' && assessmentData) {
    if (messageLower.includes('what') || messageLower.includes('this page') || messageLower.includes('report')) {
      const org = assessmentData.organization || 'your organization';
      return `You're viewing the **Maturity Report** for ${org}.\n\nThis report shows:\n• **Overall maturity scores** across 6 pillars\n• **Current vs Target** maturity levels\n• **Gap analysis** for each pillar\n• **Databricks Recommendations** - specific features to adopt\n• **Next Steps** - actionable roadmap\n\n**Actions you can take:**\n• Edit any section (hover to see edit icons)\n• Start slideshow mode\n• Print the report\n• Customize colors and content`;
    }
    
    if (messageLower.includes('score') || messageLower.includes('maturity') || messageLower.includes('level')) {
      try {
        const results = assessmentData.results || {};
        const categoryDetails = results.categoryDetails || {};
        
        let response = "**Your Maturity Scores:**\n\n";
        const pillars = [
          { id: 'platform_governance', name: 'Platform & Governance' },
          { id: 'data_engineering', name: 'Data Engineering' },
          { id: 'analytics_bi', name: 'Analytics & BI' },
          { id: 'machine_learning', name: 'Machine Learning' },
          { id: 'generative_ai', name: 'Generative AI' },
          { id: 'operational_excellence', name: 'Operational Excellence' }
        ];
        
        pillars.forEach(pillar => {
          const data = categoryDetails[pillar.id];
          if (data) {
            const current = data.score || 0;
            const target = data.targetScore || 0;
            const gap = (target - current).toFixed(1);
            response += `• **${pillar.name}**: ${current.toFixed(1)} → ${target.toFixed(1)} (Gap: ${gap})\n`;
          }
        });
        
        response += "\nFocus on the pillars with the largest gaps for maximum impact!";
        return response;
      } catch (err) {
        return respond("I can see your maturity report. Each pillar shows your current score, target score, and the gap between them. The larger the gap, the more opportunity for improvement!");
      }
    }
    
    if (messageLower.includes('recommendation') || messageLower.includes('databricks') || messageLower.includes('feature')) {
      return respond("**Databricks Recommendations** are tailored to your assessment!\n\nEach pillar shows specific Databricks features and capabilities that match your maturity level and goals:\n\n• **Delta Lake** - For data reliability\n• **Unity Catalog** - For governance\n• **MLflow** - For ML lifecycle\n• **Delta Live Tables** - For data pipelines\n• **Model Serving** - For ML deployment\n• **AI Gateway** - For GenAI apps\n\nScroll down to see recommendations for each pillar. You can edit them too!");
    }
    
    if (messageLower.includes('edit') || messageLower.includes('change') || messageLower.includes('customize')) {
      return respond("**You can edit almost everything!**\n\n• **Hover over any card** to see edit icons\n• **Click edit** to modify text\n• **Click color palette** to change colors\n• **Add/delete items** in lists\n• **Regenerate content** if needed\n\nAll changes are saved automatically. Make this report yours!");
    }
  }
  
  // EXECUTIVE COMMAND CENTER
  if (pageType === 'executive_dashboard') {
    if (messageLower.includes('what') || messageLower.includes('this page') || messageLower.includes('dashboard')) {
      return respond("You're viewing the **Executive Command Center** - a C-level dashboard.\n\nThis page provides:\n• **Strategic Imperatives** - Top 3 priorities\n• **Investment Roadmap** - Phased approach\n• **Risk Assessment** - Key risks and mitigation\n• **Success Metrics** - KPIs to track\n• **Executive Summary** - High-level overview\n\n**Perfect for:**\n• Board presentations\n• Executive briefings\n• Strategic planning sessions\n\nUse slideshow mode for presentations!");
    }
    
    if (messageLower.includes('strategic') || messageLower.includes('imperative') || messageLower.includes('priority')) {
      return respond("**Strategic Imperatives** are your top 3 priorities based on:\n\n• **Largest maturity gaps**\n• **Business impact potential**\n• **Quick wins vs long-term value**\n• **Resource requirements**\n• **Risk factors**\n\nThese are derived from your assessment responses and represent the highest-value initiatives for your organization.");
    }
    
    if (messageLower.includes('roadmap') || messageLower.includes('timeline') || messageLower.includes('phase')) {
      return respond("**Investment Roadmap** breaks down your journey into phases:\n\n**Phase 1 (0-6 months)**: Quick wins, foundation building\n**Phase 2 (6-12 months)**: Core capabilities, process improvements\n**Phase 3 (12-18 months)**: Advanced features, optimization\n\nEach phase includes specific initiatives, expected outcomes, and resource needs.");
    }
  }
  
  // INSIGHTS DASHBOARD
  if (pageType === 'insights_dashboard') {
    if (messageLower.includes('what') || messageLower.includes('this page') || messageLower.includes('insights')) {
      return respond("You're on the **Insights Dashboard** - your analytics hub.\n\nThis dashboard shows:\n• **Key metrics** across all assessments\n• **Trend analysis** over time\n• **Comparative views** across pillars\n• **Progress tracking**\n• **Actionable insights**\n\n**Use this to:**\n• Track improvement over time\n• Identify patterns\n• Make data-driven decisions\n• Report to stakeholders");
    }
  }
  
  // INDUSTRY BENCHMARKS
  if (pageType === 'industry_benchmarks') {
    if (messageLower.includes('what') || messageLower.includes('this page') || messageLower.includes('benchmark')) {
      return respond("You're viewing **Industry Benchmarks** - see how you compare!\n\nThis report includes:\n• **Percentile rankings** for each pillar\n• **Industry averages** vs your scores\n• **Competitive positioning**\n• **Gap analysis** vs industry leaders\n• **Strategic recommendations** based on benchmarks\n\n**Why benchmarks matter:**\n• Validate your assessment\n• Identify competitive advantages\n• Find improvement opportunities\n• Justify investments to leadership");
    }
    
    if (messageLower.includes('percentile') || messageLower.includes('rank') || messageLower.includes('compare')) {
      return respond("**Percentile Rankings** show where you stand:\n\n• **90th+ percentile**: Industry leader\n• **75-90th**: Above average\n• **50-75th**: Average\n• **25-50th**: Below average\n• **<25th**: Needs attention\n\nHigher percentiles mean you're outperforming most organizations in that pillar. Use this to prioritize improvements!");
    }
  }
  
  // DEEP DIVE
  if (pageType === 'deep_dive') {
    if (messageLower.includes('what') || messageLower.includes('this page') || messageLower.includes('deep dive')) {
      return respond("You're on the **Deep Dive** page - comprehensive assessment details.\n\nThis page explains:\n• **What we assess** - All 6 pillars in detail\n• **Why it matters** - Business value and impact\n• **Assessment methodology** - How we calculate scores\n• **Key capabilities** - What we measure in each area\n• **Maturity framework** - The 5-level model\n\nThis is your reference guide for understanding the assessment!");
    }
  }
  
  // USER GUIDE
  if (pageType === 'user_guide') {
    if (messageLower.includes('what') || messageLower.includes('this page') || messageLower.includes('guide')) {
      return respond("You're on the **User Guide** - your complete reference!\n\nThis guide covers:\n• **Getting Started** - How to begin\n• **Key Features** - What the tool offers\n• **Workflows** - Step-by-step processes\n• **Reports** - Understanding your results\n• **FAQs** - Common questions\n• **Troubleshooting** - Solving issues\n\nEverything you need to master the assessment tool!");
    }
  }
  
  // DASHBOARD (All Assessments)
  if (pageType === 'dashboard') {
    if (messageLower.includes('what') || messageLower.includes('this page') || messageLower.includes('dashboard')) {
      return respond("You're on your **Assessments Dashboard** - your control center.\n\nHere you can:\n• **View all assessments** - Past and present\n• **Start new assessments**\n• **Continue in-progress** assessments\n• **View results** and reports\n• **Compare assessments** over time\n• **Export data** to Excel\n• **Manage assignments** (for admins)\n\nYour one-stop shop for all assessment activities!");
    }
  }
  
  // ADMIN
  if (pageType === 'admin') {
    if (messageLower.includes('what') || messageLower.includes('this page') || messageLower.includes('admin')) {
      return respond("You're in the **Admin Section** - management tools.\n\n**Quick Links:**\n👥 [Manage Users](/admin/users)\n📋 [All Assessments](/admin/assessments)\n❓ [Custom Questions](/admin/questions)\n📊 [Assign Users](/admin/assign)\n💬 [View Feedback](/admin/feedback)\n\n**Admin Capabilities:**\n• Create & manage users\n• Assign assessments to teams\n• Add custom questions\n• View all feedback & analytics\n• Track assignments & progress\n• Test different user roles");
    }
  }
  
  // DEMO / SAMPLE REQUESTS
  if (messageLower.includes('demo') || messageLower.includes('sample') || messageLower.includes('try') || messageLower.includes('example')) {
    return respond("**Try a Sample Assessment!** 🎯\n\n[Launch Sample Assessment](/try-sample) - Pre-filled demo with realistic data\n\n**What you'll see:**\n• All 6 pillars with sample responses\n• Current & target maturity levels\n• Pain points and notes\n• Full maturity report\n• Executive dashboard\n• Industry benchmarks\n\n**Perfect for:**\n• Understanding the assessment flow\n• Seeing what reports look like\n• Learning before starting your own\n\nNo signup required - just click and explore!");
  }
  
  // REPORTS / RESULTS
  if (messageLower.includes('report') && !messageLower.includes('maturity report')) {
    return respond("**Your Assessment Reports:** 📊\n\n**Main Reports:**\n📈 [Maturity Report](/results) - Detailed scores & analysis\n🎯 [Executive Dashboard](/executive-dashboard) - C-level summary\n💡 [Insights Dashboard](/insights-dashboard) - Analytics & trends\n📊 [Industry Benchmarks](/industry-benchmarks) - Compare with peers\n\n**Features:**\n• 🎬 Slideshow mode for presentations\n• 🖨️ Print to PDF\n• ✏️ Edit & customize content\n• 📤 Export to Excel\n\n**Not started yet?**\n🚀 [Start Assessment](/assessment/start)\n🎯 [Try Sample First](/try-sample)");
  }
  
  // EXPORT / EXCEL
  if (messageLower.includes('export') || messageLower.includes('excel') || messageLower.includes('download')) {
    return respond("**Export Your Data:** 📥\n\n**Excel Export:**\n1. Go to [Your Dashboard](/dashboard)\n2. Find your assessment\n3. Click the Excel icon (📊)\n4. Download, edit, and re-upload!\n\n**PDF Export:**\n1. Open any report ([Maturity](/results), [Executive](/executive-dashboard), etc.)\n2. Click **Slideshow** button\n3. Click **Print** icon in slideshow\n4. Use browser's Print to PDF\n\n**What's included:**\n• All questions & responses\n• Maturity scores (current & target)\n• Pain points & notes\n• Organized by pillar\n\n[View My Dashboard](/dashboard)");
  }
  
  // ===== GENERAL KNOWLEDGE RESPONSES =====
  
  if (messageLower.includes('databricks') && (messageLower.includes('feature') || messageLower.includes('product') || messageLower.includes('capability'))) {
    return respond("**Key Databricks Capabilities:**\n\n**Data Engineering:**\n• [Delta Lake](/deep-dive#data-engineering) - ACID transactions, time travel\n• Delta Live Tables - Declarative pipelines\n• Auto Loader - Incremental data ingestion\n\n**Governance:**\n• [Unity Catalog](/deep-dive#platform-governance) - Unified governance\n• Data lineage - Track data flow\n• Access controls - Fine-grained permissions\n\n**ML & AI:**\n• [MLflow](/deep-dive#machine-learning) - ML lifecycle management\n• Model Serving - Deploy models at scale\n• [AI Gateway](/deep-dive#generative-ai) - Secure GenAI development\n\n**Performance:**\n• Photon - High-speed query engine\n• Serverless - Auto-scaling compute\n\n📚 [Learn More - Deep Dive](/deep-dive)\n🚀 [Start Assessment](/assessment/start)");
  }
  
  if (messageLower.includes('how to start') || messageLower.includes('how do i start') || messageLower.includes('begin')) {
    return respond("**Ready to start your assessment?** 🚀\n\n**Option 1: Start Fresh**\n[Start New Assessment](/assessment/start) - Begin your maturity assessment now\n\n**Option 2: Try a Demo**\n[Try Sample Assessment](/try-sample) - See how it works with pre-filled data\n\n**Option 3: Learn More First**\n[Deep Dive Guide](/deep-dive) - Understand what we assess\n[User Guide](/user-guide) - Complete walkthrough\n\n**Quick Overview:**\n• 6 pillars, 15-20 minutes\n• Rate current & target maturity (1-5)\n• Auto-saves, resume anytime\n• Get instant reports & recommendations\n\nWhich option works best for you?");
  }
  
  // Handle "Does it work with existing code?" and compatibility questions
  if (messageLower.includes('existing code') || messageLower.includes('work with my code') || messageLower.includes('compatibility') || messageLower.includes('integrate')) {
    return respond("**Yes! The assessment works with ANY Databricks implementation.** ✅\n\n**What we assess:**\n• **Your current processes** - regardless of tools used\n• **Your maturity level** - not specific technologies\n• **Your capabilities** - business outcomes, not code\n• **Your goals** - where you want to be\n\n**No code changes needed!**\nThe assessment evaluates your organization's maturity across data engineering, analytics, ML, GenAI, governance, and operations. It's **technology-agnostic** - we assess capabilities and practices, not specific implementations.\n\n**After assessment:**\nRecommendations show how Databricks features map to your maturity gaps, but the assessment itself is universal.\n\n**Bottom line:** Your existing code, data, and processes are the INPUT - the assessment OUTPUT shows where you are and where you could be.");
  }
  
  if (messageLower.includes('slideshow') || messageLower.includes('present') || messageLower.includes('print')) {
    return respond("**Presentation & Export Options:**\n\n**Slideshow Mode:**\n• Click the **Slideshow button** on any report page\n• Navigate with **arrow keys** or **on-screen arrows**\n• Press **ESC** to exit\n• **Print button** appears in slideshow for PDF export\n\n**Print/PDF:**\n• Click **Print** in slideshow mode\n• Use browser's **Print to PDF**\n• Each slide = one page\n• Perfect for sharing with stakeholders!\n\nAvailable on: Maturity Report, Executive Command Center, Insights Dashboard, Industry Benchmarks, Deep Dive, User Guide.");
  }
  
  if (messageLower.includes('edit') || messageLower.includes('customize') || messageLower.includes('change')) {
    return respond("**Customization Options:**\n\n**On Report Pages:**\n• **Hover over cards** to see edit icons\n• **Edit text** - Click pencil icon\n• **Change colors** - Click palette icon\n• **Add items** - Click + icon\n• **Delete items** - Click trash icon\n• **Reset** - Restore original content\n\n**All changes auto-save!**\n\nMake the report match your organization's language and priorities.");
  }
  
  if (messageLower.includes('excel') || messageLower.includes('export') || messageLower.includes('download')) {
    return respond("**Export to Excel:**\n\n1. Go to your **Dashboard**\n2. Find the assessment you want\n3. Click the **Excel icon** (📊)\n4. Download the file\n\n**Excel includes:**\n• All questions and responses\n• Current & target maturity levels\n• Pain points (technical & business)\n• Notes and context\n• Organized by pillar and dimension\n\n**You can also:**\n• Edit in Excel\n• Upload back to update the assessment\n• Share with team members");
  }
  
  if (messageLower.includes('assign') || messageLower.includes('collaborate') || messageLower.includes('team')) {
    return respond("**Collaboration Features:**\n\n**For Admins:**\n• **Assign assessments** to users\n• **Assign specific questions** to team members\n• **Track status** - See who's completed what\n• **Send reminders** - Follow up on pending items\n• **Approve responses** - Review before finalizing\n\n**For Users:**\n• **View assignments** - See what's assigned to you\n• **Complete questions** - Answer your assigned items\n• **Add follow-up notes** - Provide additional context\n\nGreat for distributed teams and large organizations!");
  }
  
  if (messageLower.includes('feedback') || messageLower.includes('survey') || messageLower.includes('improve')) {
    return respond("**Give Feedback:**\n\nWe value your input! Click **'Give Feedback'** in the user menu to:\n\n• Rate your experience\n• Answer quick survey questions\n• Share suggestions for improvement\n• Report issues\n\n**For Admins:**\nView all feedback in **'View All Feedback'** to see:\n• Response analytics\n• User satisfaction scores\n• Common themes\n• Individual feedback details\n\nHelp us make the tool better!");
  }
  
  if (messageLower.includes('thank') || messageLower.includes('thanks')) {
    return respond("You're welcome! 😊 I'm here anytime you need help. Feel free to ask about anything on this page or the assessment in general!");
  }
  
  if (messageLower.includes('bye') || messageLower.includes('goodbye')) {
    return respond("Goodbye! 👋 I'll be here whenever you need assistance. Good luck with your assessment!");
  }
  
  // ===== CONTEXT-AWARE DEFAULT =====
  const pageContext = {
    'home': "You're on the home page. Ask me about getting started, assessment features, or what you can do here!",
    'assessment': "You're taking an assessment. Ask me about maturity levels, pain points, or how to answer questions!",
    'maturity_report': "You're viewing a maturity report. Ask me about scores, recommendations, or how to customize the report!",
    'executive_dashboard': "You're on the Executive Command Center. Ask me about strategic imperatives, roadmaps, or how to present this!",
    'insights_dashboard': "You're on the Insights Dashboard. Ask me about metrics, trends, or how to interpret the data!",
    'industry_benchmarks': "You're viewing industry benchmarks. Ask me about percentiles, comparisons, or how you rank!",
    'deep_dive': "You're on the Deep Dive page. Ask me about the assessment methodology, pillars, or what we measure!",
    'user_guide': "You're on the User Guide. Ask me about features, workflows, or how to use the tool!",
    'dashboard': "You're on your assessments dashboard. Ask me about viewing, starting, or managing assessments!",
    'admin': "You're in the admin section. Ask me about user management, assignments, or admin features!",
    'pitch_deck': "You're viewing the pitch deck. Ask me about presenting this to customers or the value proposition!"
  };
  
  // Smart default response with contextual links
  const contextualLinks = {
    home: "**Quick Actions:**\n🚀 [Start New Assessment](/assessment/start)\n📊 [View My Dashboard](/dashboard)\n🎯 [Try Sample Assessment](/try-sample)\n📚 [Learn More - Deep Dive](/deep-dive)\n📖 [User Guide](/user-guide)",
    assessment: "**Assessment Help:**\n❓ [What are the 6 pillars?](/deep-dive)\n💾 [How to save progress?](/user-guide#saving)\n📝 [Understanding maturity levels](/deep-dive#maturity-framework)\n🏠 [Back to Home](/)",
    maturity_report: "**Report Actions:**\n📥 [Export to PDF](#) (Print button in slideshow)\n📊 [View Dashboard](/dashboard)\n🎯 [Executive Summary](/executive-dashboard)\n📈 [Industry Benchmarks](/industry-benchmarks)\n🔍 [Deep Dive Analysis](/deep-dive)",
    executive_dashboard: "**Executive Tools:**\n📊 [Full Maturity Report](/results)\n📈 [Industry Benchmarks](/industry-benchmarks)\n💡 [Insights Dashboard](/insights-dashboard)\n🏠 [Back to Home](/)",
    insights_dashboard: "**Analytics:**\n📊 [Maturity Report](/results)\n🎯 [Executive Dashboard](/executive-dashboard)\n📈 [Industry Benchmarks](/industry-benchmarks)\n🏠 [Back to Home](/)",
    industry_benchmarks: "**Benchmarking:**\n📊 [Your Maturity Report](/results)\n🎯 [Executive Dashboard](/executive-dashboard)\n💡 [Insights Dashboard](/insights-dashboard)\n🏠 [Back to Home](/)",
    deep_dive: "**Learn More:**\n🚀 [Start Assessment](/assessment/start)\n📖 [User Guide](/user-guide)\n🎯 [Try Sample](/try-sample)\n🏠 [Back to Home](/)",
    user_guide: "**Resources:**\n🚀 [Start Assessment](/assessment/start)\n📚 [Deep Dive](/deep-dive)\n🎯 [Try Sample](/try-sample)\n💬 [Give Feedback](/feedback)\n🏠 [Back to Home](/)",
    dashboard: "**Dashboard Actions:**\n🚀 [Start New Assessment](/assessment/start)\n📊 [View All Assessments](/dashboard)\n📈 [Export to Excel](#) (Click Excel icon)\n🏠 [Back to Home](/)",
    admin: "**Admin Tools:**\n👥 [Manage Users](/admin/users)\n📋 [Manage Assessments](/admin/assessments)\n❓ [Custom Questions](/admin/questions)\n💬 [View Feedback](/admin/feedback)\n🏠 [Back to Home](/)"
  };
  
  return respond(`I'm your **AI Assessment Assistant**! 🤖\n\n${pageContext[pageType] || "I can help with any questions about the assessment!"}\n\n${contextualLinks[pageType] || contextualLinks.home}\n\n**Ask me anything:**\n• "How do I start?" • "What are the 6 pillars?"\n• "Show me a demo" • "How long does it take?"\n• "What reports do I get?" • "Can I export to Excel?"`);
}

module.exports = router;

