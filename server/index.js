// Load environment variables first
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const assessmentFramework = require('./data/assessmentFramework');
const RecommendationEngine = require('./services/recommendationEngine');
const AdaptiveRecommendationEngine = require('./services/adaptiveRecommendationEngine');
const LiveDataEnhancer = require('./services/liveDataEnhancer');
const OpenAIContentGenerator = require('./services/openAIContentGenerator');
const DatabricksFeatureMapper = require('./services/databricksFeatureMapper');
const ContextAwareRecommendationEngine = require('./services/contextAwareRecommendationEngine');
const IntelligentRecommendationEngine = require('./services/intelligentRecommendationEngine_v2');
const featureDB = require('./services/databricksFeatureDatabase');
const sampleAssessmentGenerator = require('./utils/sampleAssessmentGenerator');
const industryBenchmarkingService = require('./services/industryBenchmarkingService');
const db = require('./db/connection');
const { requireAuth } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max file size
  abortOnLimit: true
}));
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// Import routes
const authRoutes = require('./routes/auth');
const assignmentRoutes = require('./routes/assignments');
const notificationRoutes = require('./routes/notifications');
const feedbackRoutes = require('./routes/feedback');
const chatRoutes = require('./routes/chat');
const customQuestionsRoutes = require('./routes/custom-questions');
const excelRoutes = require('./routes/excel');
const questionEditsRoutes = require('./routes/questionEdits');
const questionAssignmentsRoutes = require('./routes/questionAssignments');
const dataCleanupRoutes = require('./routes/dataCleanup');
const authorValidationRoutes = require('./routes/authorValidation');
const genaiReadinessRoutes = require('./routes/genaiReadiness');
const { requireAdmin } = require('./middleware/auth');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/author', require('./routes/authorValidation')); // Enhanced Author features
app.use('/api/notifications', notificationRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/custom-questions', customQuestionsRoutes);
app.use('/api/assessment-excel', excelRoutes);
app.use('/api/question-edits', questionEditsRoutes);
app.use('/api/question-assignments', questionAssignmentsRoutes);
app.use('/api/data-cleanup', dataCleanupRoutes);
app.use('/api/genai-readiness', genaiReadinessRoutes);

// Admin endpoint to release/unrelease assessment results
app.post('/api/admin/release-results/:assessmentId', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { assessmentId } = req.params;
    const { release } = req.body; // true to release, false to unrelease
    const currentUser = req.user;

    const result = await db.query(
      `UPDATE assessments
       SET results_released = $1,
           results_released_by = $2,
           results_released_at = $3
       WHERE id = $4
       RETURNING *`,
      [release, release ? currentUser.id : null, release ? new Date() : null, assessmentId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }

    res.json({
      success: true,
      message: release ? 'Results released successfully' : 'Results unreleased successfully',
      assessment: result.rows[0]
    });
  } catch (error) {
    console.error('Error releasing/unreleasing results:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update results release status',
      error: error.message
    });
  }
});

// Persistent storage for assessments
// Use Railway volume path if available, otherwise fallback to local path
console.log('🔍 DEBUG: Checking DATA_DIR environment variable...');
console.log('🔍 DEBUG: process.env.DATA_DIR =', process.env.DATA_DIR);
console.log('🔍 DEBUG: __dirname =', __dirname);
const dataDir = process.env.DATA_DIR || path.join(__dirname, 'data');
const dataFilePath = path.join(dataDir, 'assessments.json');
console.log(`📁 Data directory: ${dataDir}`);
console.log(`📄 Data file path: ${dataFilePath}`);

// Validate storage is writable on startup
const fs = require('fs');
try {
  if (!fs.existsSync(dataDir)) {
    console.log(`📁 Creating data directory: ${dataDir}`);
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  // Test write to ensure volume is mounted correctly
  const testFile = path.join(dataDir, '.write-test');
  fs.writeFileSync(testFile, 'test', 'utf8');
  fs.unlinkSync(testFile);
  console.log('✅ Storage is writable - data persistence confirmed');
  
  if (process.env.DATA_DIR) {
    console.log('✅ Using Railway persistent volume at:', process.env.DATA_DIR);
  } else {
    console.warn('⚠️  WARNING: DATA_DIR not set - using local storage (data will be lost on redeploy!)');
    console.warn('⚠️  Set DATA_DIR environment variable to use persistent storage');
  }
} catch (error) {
  console.error('❌ CRITICAL: Storage is NOT writable!');
  console.error('❌ Error:', error.message);
  console.error('❌ Data directory:', dataDir);
  console.error('⚠️  ALL DATA WILL BE LOST ON RESTART!');
}

// Initialize engines
const recommendationEngine = new RecommendationEngine();
const adaptiveRecommendationEngine = new AdaptiveRecommendationEngine();
const liveDataEnhancer = new LiveDataEnhancer();
const openAIContentGenerator = new OpenAIContentGenerator();

// Routes

// Root status endpoint (for debugging)
app.get('/status', async (req, res) => {
  try {
    const fs = require('fs');
    const assessmentRepo = require('./db/assessmentRepository');
    const assessmentCount = await assessmentRepo.count();
    const stats = await assessmentRepo.getStats();
    const storageType = 'postgresql';
    const dataFileExists = fs.existsSync(dataFilePath);
    
    res.json({
      success: true,
      message: 'Databricks Maturity Assessment API is running',
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
      storage: {
        type: storageType,
        assessmentCount: assessmentCount,
        stats: stats,
        // Keep legacy fields for compatibility
        dataDir: dataDir,
        dataFilePath: dataFilePath,
        dataFileExists: dataFileExists,
        volumeMounted: process.env.DATA_DIR ? true : false,
        dataDirEnv: process.env.DATA_DIR || 'not set (using default)',
        postgresConfigured: !!process.env.DATABASE_URL,
      },
      features: {
        liveDataEnabled: process.env.USE_LIVE_DATA === 'true',
        openAIConfigured: !!process.env.OPENAI_API_KEY,
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Fetch logo from external URL (bypasses CORS) - with intelligent logo detection
app.post('/api/fetch-logo', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({
        success: false,
        message: 'URL is required'
      });
    }

    // Validate URL format
    let parsedUrl;
    try {
      parsedUrl = new URL(url);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid URL format'
      });
    }

    const axios = require('axios');
    const cheerio = require('cheerio');
    
    console.log(`[fetch-logo] Processing URL: ${url}`);
    
    // Helper function to fetch an image and convert to data URL
    const fetchImageAsDataUrl = async (imageUrl) => {
      try {
        const fullUrl = new URL(imageUrl, url).href;
        console.log(`[fetch-logo] Fetching image: ${fullUrl}`);
        
        const response = await axios.get(fullUrl, {
          responseType: 'arraybuffer',
          timeout: 10000,
          maxRedirects: 5,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
          }
        });
        
        const contentType = response.headers['content-type'];
        if (!contentType || !contentType.startsWith('image/')) {
          throw new Error('Not an image');
        }
        
        const base64 = Buffer.from(response.data).toString('base64');
        return `data:${contentType};base64,${base64}`;
      } catch (error) {
        console.error(`[fetch-logo] Error fetching image ${imageUrl}:`, error.message);
        throw error;
      }
    };
    
    // First, try to fetch the URL to see what we get
    try {
      const response = await axios.get(url, {
        timeout: 10000,
        maxRedirects: 5,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        },
        validateStatus: (status) => status < 400
      });
      
      const contentType = response.headers['content-type'];
      console.log(`[fetch-logo] Content-Type: ${contentType}`);
      
      // If it's already an image, return it directly
      if (contentType && contentType.startsWith('image/')) {
        const base64 = Buffer.from(response.data).toString('base64');
        const dataUrl = `data:${contentType};base64,${base64}`;
        
        console.log(`[fetch-logo] ✅ Direct image found`);
        return res.json({
          success: true,
          data: dataUrl
        });
      }
      
      // If it's HTML, parse it to find the logo
      if (contentType && contentType.includes('html')) {
        const $ = cheerio.load(response.data);
        const logoStrategies = [];
        
        console.log(`[fetch-logo] Parsing HTML to find logo...`);
        
        // Strategy 1: Look for SVG logos (best quality, scalable, usually transparent)
        const $svgLogo = $('img[src*=".svg" i][class*="logo" i], img[src*=".svg" i][id*="logo" i], img[src*=".svg" i][alt*="logo" i]').first();
        const svgLogoSrc = $svgLogo.attr('src');
        if (svgLogoSrc) logoStrategies.push({ name: 'SVG logo', url: svgLogoSrc, priority: 1 });
        
        // Strategy 2: Look for PNG logos with "logo" in the name (usually high quality, often transparent)
        const $pngLogo = $('img[src*="logo" i][src*=".png" i]').first();
        const pngLogoSrc = $pngLogo.attr('src');
        if (pngLogoSrc) logoStrategies.push({ name: 'PNG logo', url: pngLogoSrc, priority: 2 });
        
        // Strategy 3: Look for any img with logo in class/id/alt
        const $logoImg = $('img[class*="logo" i], img[id*="logo" i], img[alt*="logo" i]').first();
        const logoImgSrc = $logoImg.attr('src');
        if (logoImgSrc) logoStrategies.push({ name: 'Logo img', url: logoImgSrc, priority: 3 });
        
        // Strategy 4: Look for Open Graph image (usually high quality)
        const ogImage = $('meta[property="og:image"]').attr('content');
        if (ogImage) logoStrategies.push({ name: 'OG image', url: ogImage, priority: 4 });
        
        // Strategy 5: Look for Twitter card image (usually high quality)
        const twitterImage = $('meta[name="twitter:image"]').attr('content');
        if (twitterImage) logoStrategies.push({ name: 'Twitter image', url: twitterImage, priority: 5 });
        
        // Strategy 6: Look for apple-touch-icon (high quality)
        const appleTouchIcon = $('link[rel="apple-touch-icon"]').attr('href');
        if (appleTouchIcon) logoStrategies.push({ name: 'Apple touch icon', url: appleTouchIcon, priority: 6 });
        
        // Strategy 7: Look for shortcut icon
        const shortcutIcon = $('link[rel="shortcut icon"]').attr('href');
        if (shortcutIcon) logoStrategies.push({ name: 'Shortcut icon', url: shortcutIcon, priority: 7 });
        
        // Strategy 8: Look for standard favicon
        const favicon = $('link[rel="icon"]').attr('href');
        if (favicon) logoStrategies.push({ name: 'Favicon', url: favicon, priority: 8 });
        
        // Strategy 9: Try Unavatar service (aggregates multiple sources, often transparent)
        const domain = new URL(url).hostname.replace('www.', '');
        logoStrategies.push({ name: 'Unavatar service', url: `https://unavatar.io/${domain}?fallback=false`, priority: 9 });
        
        // Strategy 10: Try Clearbit Logo API (good quality but may have white backgrounds)
        logoStrategies.push({ name: 'Clearbit API', url: `https://logo.clearbit.com/${domain}`, priority: 20 });
        
        // Strategy 11: Try Google Favicon Service (256x256, last resort)
        logoStrategies.push({ name: 'Google Favicon', url: `https://www.google.com/s2/favicons?domain=${domain}&sz=256`, priority: 90 });
        
        // Strategy 12: Default favicon.ico (absolute last resort)
        logoStrategies.push({ name: 'Default favicon', url: '/favicon.ico', priority: 99 });
        
        // Sort strategies by priority (lower number = higher priority)
        logoStrategies.sort((a, b) => (a.priority || 50) - (b.priority || 50));
        
        console.log(`[fetch-logo] Found ${logoStrategies.length} potential logo URLs`);
        
        // Try each strategy in priority order until one succeeds
        for (const strategy of logoStrategies) {
          try {
            console.log(`[fetch-logo] Trying ${strategy.name}: ${strategy.url}`);
            const dataUrl = await fetchImageAsDataUrl(strategy.url);
            console.log(`[fetch-logo] ✅ Successfully fetched logo using ${strategy.name}`);
            return res.json({
              success: true,
              data: dataUrl
            });
          } catch (error) {
            console.log(`[fetch-logo] ❌ ${strategy.name} failed: ${error.message}`);
            // Continue to next strategy
          }
        }
        
        // If all strategies failed
        return res.status(404).json({
          success: false,
          message: 'Could not fetch logo - tried all available strategies'
        });
      }
      
      // Neither image nor HTML
      return res.status(400).json({
        success: false,
        message: 'URL does not point to an image or webpage'
      });
      
    } catch (error) {
      console.error('[fetch-logo] Error:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch URL',
        error: error.message
      });
    }
    
  } catch (error) {
    console.error('[fetch-logo] Unexpected error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching logo',
      error: error.message
    });
  }
});

// Get assessment framework
app.get('/api/assessment/framework', async (req, res) => {
  try {
    res.json({
      success: true,
      data: assessmentFramework
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving assessment framework',
      error: error.message
    });
  }
});

// Start new assessment
app.post('/api/assessment/start', requireAuth, async (req, res) => {
  try {
    const { organizationName, contactEmail, contactName, contactRole, industry, assessmentName, assessmentDescription } = req.body;
    
    if (!contactEmail) {
      return res.status(400).json({
        success: false,
        message: 'Contact email is required'
      });
    }

    if (!assessmentName) {
      return res.status(400).json({
        success: false,
        message: 'Assessment name is required'
      });
    }

    const assessmentRepo = require('./db/assessmentRepository');
    const assessmentId = uuidv4();
    
    await assessmentRepo.create({
      id: assessmentId,
      assessmentName,
      assessmentDescription: assessmentDescription || '',
      organizationName: organizationName || 'Not specified',
      contactEmail,
      industry: industry || 'Not specified',
      status: 'in_progress',
      progress: 0,
      currentCategory: assessmentFramework.assessmentAreas[0].id,
      completedCategories: [],
      responses: {},
      editHistory: [],
      startedAt: new Date().toISOString(),
      userId: req.user.id  // Set the creator's user ID
    });

    res.json({
      success: true,
      data: {
      assessmentId,
      currentCategory: assessmentFramework.assessmentAreas[0].id,
      totalCategories: assessmentFramework.assessmentAreas.length,
      assessmentName,
      assessmentDescription
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error starting assessment',
      error: error.message
    });
  }
});

// Get raw assessment data (for Excel export, etc.)
app.get('/api/assessment/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const assessmentRepo = require('./db/assessmentRepository');
    const assessment = await assessmentRepo.findById(id);
    
    if (!assessment) {
      console.log(`❌ [API /assessment/:id] Assessment ${id} not found`);
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }
    
    console.log(`✅ [API /assessment/:id] Found assessment ${id}`);

    // Return the raw assessment data
    res.json(assessment);
  } catch (error) {
    console.error('Error fetching assessment:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching assessment',
      error: error.message
    });
  }
});

// Get assessment status
app.get('/api/assessment/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const assessmentRepo = require('./db/assessmentRepository');
    const assessment = await assessmentRepo.findById(id);

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }

    const completedCats = assessment.completedCategories || [];
    const progress = (completedCats.length / assessmentFramework.assessmentAreas.length) * 100;

    res.json({
      success: true,
      data: {
        id: assessment.id,
        assessmentId: assessment.id, // Add for consistency with start endpoint
        assessmentName: assessment.assessmentName,
        assessmentDescription: assessment.assessmentDescription || '',
        organizationName: assessment.organizationName,
        contactEmail: assessment.contactEmail,
        contactName: assessment.contactName || '',
        contactRole: assessment.contactRole || '',
        industry: assessment.industry,
        status: assessment.status,
        progress: Math.round(progress),
        currentCategory: assessment.currentCategory,
        completedCategories: completedCats,
        startedAt: assessment.startedAt,
        createdAt: assessment.createdAt || assessment.startedAt,
        updatedAt: assessment.updatedAt || assessment.startedAt,
        responses: assessment.responses // Include responses for progress calculation
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving assessment status',
      error: error.message
    });
  }
});

// Get questions for a specific assessment area
app.get('/api/assessment/:id/category/:categoryId', async (req, res) => {
  try {
    const { id, categoryId } = req.params;
    const assessmentRepo = require('./db/assessmentRepository');
    const assessment = await assessmentRepo.findById(id);

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }

    const area = assessmentFramework.assessmentAreas.find(a => a.id === categoryId);
    if (!area) {
      return res.status(404).json({
        success: false,
        message: 'Assessment area not found'
      });
    }

    // Get existing responses for this area
    const areaResponses = {};
    const assessmentResponses = assessment.responses || {};
    
    // Handle new pillar structure with dimensions
    const questions = [];
    if (area.dimensions) {
      area.dimensions.forEach(dimension => {
        if (dimension.questions) {
          questions.push(...dimension.questions);
        }
      });
    } else if (area.questions) {
      // Fallback for old structure
      questions.push(...area.questions);
    }
    
    // Fetch and inject custom questions for this pillar and assessment
    // NOTE: Custom questions are automatically included in scoring calculations
    // because they follow the same response format (questionId_perspectiveId).
    // The 'weight' field is stored for potential future weighted scoring implementation.
    try {
      // Fetch custom questions that are either:
      // 1. Assigned specifically to this assessment, OR
      // 2. Set to apply_to_all_assessments = true
      const customQuestionsResult = await db.query(
        `SELECT DISTINCT cq.* 
         FROM custom_questions cq
         LEFT JOIN assessment_custom_questions acq 
           ON cq.id = acq.custom_question_id AND acq.assessment_id = $1
         WHERE cq.is_active = true 
         AND (cq.pillar = $2 OR cq.pillar = 'all')
         AND (acq.id IS NOT NULL OR cq.apply_to_all_assessments = true)
         ORDER BY cq.created_at ASC`,
        [id, categoryId]
      );
      
      // Transform custom questions to match framework structure
      customQuestionsResult.rows.forEach((customQ, index) => {
        // Build maturity level options array
        const maturityOptions = [
          customQ.maturity_level_1 ? { value: 1, label: `Level 1: ${customQ.maturity_level_1}`, score: 1 } : null,
          customQ.maturity_level_2 ? { value: 2, label: `Level 2: ${customQ.maturity_level_2}`, score: 2 } : null,
          customQ.maturity_level_3 ? { value: 3, label: `Level 3: ${customQ.maturity_level_3}`, score: 3 } : null,
          customQ.maturity_level_4 ? { value: 4, label: `Level 4: ${customQ.maturity_level_4}`, score: 4 } : null,
          customQ.maturity_level_5 ? { value: 5, label: `Level 5: ${customQ.maturity_level_5}`, score: 5 } : null
        ].filter(Boolean);
        
        // Generic pain point options
        const technicalPainOptions = [
          { value: 'manual_processes', label: 'Manual and time-consuming processes', score: 4 },
          { value: 'scalability_issues', label: 'Scalability and performance issues', score: 4 },
          { value: 'integration_complexity', label: 'Integration complexity and technical debt', score: 3 },
          { value: 'lack_automation', label: 'Lack of automation and standardization', score: 3 },
          { value: 'monitoring_gaps', label: 'Inadequate monitoring and observability', score: 3 }
        ];
        
        const businessPainOptions = [
          { value: 'slow_delivery', label: 'Slow time-to-market and delivery cycles', score: 4 },
          { value: 'high_costs', label: 'High operational and maintenance costs', score: 3 },
          { value: 'quality_issues', label: 'Quality and reliability concerns', score: 5 },
          { value: 'resource_constraints', label: 'Resource bottlenecks and constraints', score: 4 },
          { value: 'compliance_risks', label: 'Compliance and governance risks', score: 5 }
        ];
        
        const customQuestion = {
          id: `custom_${customQ.id}`,
          question: customQ.question_text,
          topic: customQ.category || 'Custom Question',
          isCustom: true,
          customQuestionId: customQ.id,
          weight: customQ.weight,
          category: customQ.category,
          perspectives: [
            {
              id: 'current_state',
              label: 'Current State',
              type: 'single_choice',
              options: maturityOptions
            },
            {
              id: 'future_state',
              label: 'Future State Vision',
              type: 'single_choice',
              options: maturityOptions
            },
            {
              id: 'technical_pain',
              label: 'Technical Pain Points',
              type: 'multiple_choice',
              options: technicalPainOptions
            },
            {
              id: 'business_pain',
              label: 'Business Pain Points',
              type: 'multiple_choice',
              options: businessPainOptions
            }
          ],
          commentBox: {
            label: 'Notes',
            placeholder: 'Share specific details about your challenges or goals...'
          }
        };
        questions.push(customQuestion);
      });
      
      console.log(`✅ Injected ${customQuestionsResult.rows.length} custom question(s) for assessment ${id}, pillar ${categoryId}`);
    } catch (error) {
      console.error('Error fetching custom questions:', error);
      // Continue without custom questions if fetch fails
    }
    
    questions.forEach(question => {
      // Get responses for all perspectives of this question
      question.perspectives.forEach(perspective => {
        const responseKey = `${question.id}_${perspective.id}`;
        if (assessmentResponses[responseKey]) {
          areaResponses[responseKey] = assessmentResponses[responseKey];
        }
      });
      
      // Get comment responses
      const commentKey = `${question.id}_comment`;
      if (assessmentResponses[commentKey]) {
        areaResponses[commentKey] = assessmentResponses[commentKey];
      }
    });

    const completedCats = assessment.completedCategories || [];
    res.json({
      success: true,
      data: {
        area: {
          ...area,
          questions // Flatten questions for frontend compatibility
        },
        existingResponses: areaResponses,
        isCompleted: completedCats.includes(categoryId)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving assessment area',
      error: error.message
    });
  }
});

// Submit responses for a category
app.post('/api/assessment/:id/category/:categoryId/submit', async (req, res) => {
  try {
    const { id, categoryId } = req.params;
    const { responses } = req.body;
    
    const assessmentRepo = require('./db/assessmentRepository');
    const assessment = await assessmentRepo.findById(id);
    
    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }

    const area = assessmentFramework.assessmentAreas.find(a => a.id === categoryId);
    if (!area) {
      return res.status(404).json({
        success: false,
        message: 'Assessment area not found'
      });
    }

    // Validate responses
    const hasAnyResponses = Object.keys(responses).length > 0;
    if (!hasAnyResponses) {
      return res.status(400).json({
        success: false,
        message: 'No responses provided'
      });
    }

    // Save responses and update assessment
    const currentResponses = assessment.responses || {};
    Object.keys(responses).forEach(questionId => {
      currentResponses[questionId] = responses[questionId];
    });

    // Mark category as completed
    const completedCategories = assessment.completedCategories || [];
    if (!completedCategories.includes(categoryId)) {
      completedCategories.push(categoryId);
    }

    // Calculate progress
    const progress = Math.round((completedCategories.length / assessmentFramework.assessmentAreas.length) * 100);

    // Determine next category and status
    const nextArea = assessmentFramework.assessmentAreas.find(a => 
      !completedCategories.includes(a.id)
    );
    
    const updateData = {
      responses: currentResponses,
      completedCategories: completedCategories,
      progress: progress,
      currentCategory: nextArea ? nextArea.id : null
    };

    if (!nextArea) {
      updateData.status = 'completed';
      updateData.completedAt = new Date().toISOString();
    }

    await assessmentRepo.update(id, updateData);

    res.json({
      success: true,
      data: {
        progress: (assessment.completedCategories.length / assessmentFramework.assessmentAreas.length) * 100,
        nextCategory: nextArea ? nextArea.id : null,
        isCompleted: assessment.status === 'completed'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error submitting category responses',
      error: error.message
    });
  }
});

// Bulk submit all responses at once (for sample assessments)
app.post('/api/assessment/:id/bulk-submit', async (req, res) => {
  try {
    const { id } = req.params;
    const { responses, completedCategories, status } = req.body;
    
    const assessmentRepo = require('./db/assessmentRepository');
    const assessment = await assessmentRepo.findById(id);
    
    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }

    console.log(`[Bulk Submit] Submitting ${Object.keys(responses).length} responses for assessment ${id}`);

    // Prepare update data
    const currentResponses = assessment.responses || {};
    const updateData = {
      responses: { ...currentResponses, ...responses }
    };

    // Mark all categories as completed
    if (completedCategories && Array.isArray(completedCategories)) {
      updateData.completedCategories = completedCategories;
      updateData.progress = Math.round((completedCategories.length / 6) * 100);
    }

    // Update assessment status
    if (status) {
      updateData.status = status;
      if (status === 'completed') {
        updateData.completedAt = new Date().toISOString();
      }
    }

    await assessmentRepo.update(id, updateData);

    console.log(`[Bulk Submit] Successfully saved ${Object.keys(responses).length} responses`);

    res.json({
      success: true,
      data: {
        progress: 100,
        isCompleted: true,
        totalResponses: Object.keys(responses).length
      }
    });
  } catch (error) {
    console.error('[Bulk Submit] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting bulk responses',
      error: error.message
    });
  }
});

// Update assessment metadata (name, email, etc.)
app.patch('/api/assessment/:id/metadata', async (req, res) => {
  try {
    const { id } = req.params;
    const { assessmentName, organizationName, contactEmail, industry, assessmentDescription, editorEmail } = req.body;
    
    const assessmentRepo = require('./db/assessmentRepository');
    const assessment = await assessmentRepo.findById(id);
    
    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }

    // Prepare update data
    const updateData = {};
    const changes = {};
    
    if (assessmentName && assessmentName !== assessment.assessmentName) {
      changes.assessmentName = { from: assessment.assessmentName, to: assessmentName };
      updateData.assessmentName = assessmentName;
    }
    if (organizationName && organizationName !== assessment.organizationName) {
      changes.organizationName = { from: assessment.organizationName, to: organizationName };
      updateData.organizationName = organizationName;
    }
    if (contactEmail && contactEmail !== assessment.contactEmail) {
      changes.contactEmail = { from: assessment.contactEmail, to: contactEmail };
      updateData.contactEmail = contactEmail;
    }
    if (industry && industry !== assessment.industry) {
      changes.industry = { from: assessment.industry, to: industry };
      updateData.industry = industry;
    }
    if (assessmentDescription !== undefined && assessmentDescription !== assessment.assessmentDescription) {
      changes.assessmentDescription = { from: assessment.assessmentDescription, to: assessmentDescription };
      updateData.assessmentDescription = assessmentDescription;
    }

    // Add to edit history
    if (Object.keys(changes).length > 0) {
      const editHistory = assessment.editHistory || [];
      editHistory.push({
        timestamp: new Date().toISOString(),
        editorEmail: editorEmail || contactEmail || 'Unknown',
        changes: changes
      });
      updateData.editHistory = editHistory;
    }

    await assessmentRepo.update(id, updateData);

    res.json({
      success: true,
      message: 'Assessment metadata updated',
      data: {
        id: assessment.id,
        assessmentName: assessment.assessmentName,
        organizationName: assessment.organizationName,
        contactEmail: assessment.contactEmail,
        industry: assessment.industry,
        assessmentDescription: assessment.assessmentDescription,
        lastModified: assessment.lastModified,
        editHistory: assessment.editHistory
      }
    });
  } catch (error) {
    console.error('Error updating assessment metadata:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating assessment metadata',
      error: error.message
    });
  }
});

// Save edited Executive Summary content (SME reviews and refines AI-generated content)
app.put('/api/assessment/:id/edited-executive-summary', async (req, res) => {
  try {
    const { id } = req.params;
    const editedContent = req.body;
    
    const assessmentRepo = require('./db/assessmentRepository');
    const assessment = await assessmentRepo.findById(id);
    
    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }

    // Track edit in history
    const editHistory = assessment.editHistory || [];
    editHistory.push({
      timestamp: new Date().toISOString(),
      action: 'Executive Summary Edited',
      editor: req.body.editorEmail || assessment.contactEmail || 'SME'
    });
    
    await assessmentRepo.update(id, {
      editedExecutiveSummary: editedContent,
      editHistory: editHistory
    });

    console.log(`✅ Executive Summary edited for assessment: ${id}`);

    res.json({
      success: true,
      message: 'Executive Summary content saved',
      data: {
        id: assessment.id,
        lastModified: assessment.lastModified
      }
    });
  } catch (error) {
    console.error('Error saving edited Executive Summary:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving edited content',
      error: error.message
    });
  }
});

// Auto-save individual question responses (with editor tracking)
app.post('/api/assessment/:id/save-progress', async (req, res) => {
  try {
    const { id } = req.params;
    const { questionId, perspectiveId, value, comment, isSkipped, editorEmail } = req.body;
    
    const assessmentRepo = require('./db/assessmentRepository');
    const updatedAssessment = await assessmentRepo.saveProgress(
      id, 
      questionId, 
      perspectiveId, 
      value, 
      comment, 
      isSkipped, 
      editorEmail
    );

    res.json({
      success: true,
      message: 'Progress saved',
      lastSaved: updatedAssessment.updatedAt
    });
  } catch (error) {
    console.error('Error saving progress:', error);
    const statusCode = error.message === 'Assessment not found' ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Error saving progress',
      error: error.message
    });
  }
});

// Submit assessment (mark as submitted to enable results viewing)
app.post('/api/assessment/:id/submit', async (req, res) => {
  try {
    const { id } = req.params;
    const assessmentRepo = require('./db/assessmentRepository');
    const assessment = await assessmentRepo.findById(id);

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }

    // Check if at least one pillar is completed
    if (!assessment.completedCategories || assessment.completedCategories.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please complete at least one pillar before submitting'
      });
    }

    // Update status to submitted
    await assessmentRepo.update(id, {
      status: 'submitted',
      completedAt: new Date().toISOString()
    });

    console.log(`✅ Assessment ${id} submitted successfully`);

    res.json({
      success: true,
      message: 'Assessment submitted successfully',
      assessment: {
        id: assessment.id,
        status: assessment.status,
        submittedAt: assessment.submittedAt,
        completedCategories: assessment.completedCategories
      }
    });
  } catch (error) {
    console.error('Error submitting assessment:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting assessment',
      error: error.message
    });
  }
});

// Generate adaptive assessment results (NEW - uses all inputs)
app.get('/api/assessment/:id/adaptive-results', async (req, res) => {
  try {
    const { id } = req.params;
    const assessmentRepo = require('./db/assessmentRepository');
    const assessment = await assessmentRepo.findById(id);

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }

    console.log('🎯 Generating ADAPTIVE results for assessment:', id);
    console.log('Using: Current state, Future state, Pain points, and Comments');
    
    const hasAnyResponses = Object.keys(assessment.responses).length > 0;
    
    if (!hasAnyResponses) {
      return res.json({
        success: true,
        data: {
          message: 'No responses yet',
          assessmentInfo: {
            id: assessment.id,
            assessmentName: assessment.assessmentName,
            startedAt: assessment.startedAt
          }
        }
      });
    }
    
    // Use adaptive engine
    let recommendations = adaptiveRecommendationEngine.generateAdaptiveRecommendations(
      assessment.responses,
      assessment.completedCategories.length > 0 ? assessment.completedCategories : null
    );
    
    console.log('✅ Adaptive recommendations generated successfully');
    console.log('Pain point recommendations:', recommendations.painPointRecommendations.length);
    console.log('Gap-based actions:', recommendations.gapBasedActions.length);
    console.log('Comment insights:', recommendations.commentBasedInsights.length);
    
    // Enhance with live data if enabled
    if (process.env.USE_LIVE_DATA === 'true') {
      console.log('🔄 Enhancing with live data...');
      try {
        recommendations = await liveDataEnhancer.enhanceRecommendations(
          recommendations,
          {
            currentScore: recommendations.overall.currentScore,
            painPoints: recommendations.painPointRecommendations,
            gaps: recommendations.gapBasedActions
          }
        );
        console.log('✅ Live data enhancement completed');
      } catch (error) {
        console.error('❌ Live data enhancement failed:', error);
        console.log('⚠️  Continuing with base recommendations');
      }
    }
    
    res.json({
      success: true,
      data: {
        assessmentInfo: {
          id: assessment.id,
          assessmentName: assessment.assessmentName,
          organizationName: assessment.organizationName,
          startedAt: assessment.startedAt,
          completedAt: assessment.completedAt
        },
        ...recommendations,
        _engineType: 'adaptive',
        _liveDataEnabled: process.env.USE_LIVE_DATA === 'true',
        _liveDataSource: recommendations.whatsNew?.lastUpdated ? 'active' : 'disabled'
      }
    });
  } catch (error) {
    console.error('❌ Error generating adaptive results:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Error generating adaptive assessment results',
      error: error.message
    });
  }
});

// Generate assessment results and recommendations (ADAPTIVE with live data)
app.get('/api/assessment/:id/results', requireAuth, async (req, res) => {
  try {
    console.log(`🎯 [RESULTS ENDPOINT] Request for assessment: ${req.params.id}`);
    
    // CRITICAL: Prevent caching of dynamic results
    res.set({
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Surrogate-Control': 'no-store'
    });

    const { id } = req.params;
    const currentUser = req.user;
    
    // Try PostgreSQL first, then fallback to file storage
    const assessmentRepo = require('./db/assessmentRepository');
    let assessment = null;
    
    assessment = await assessmentRepo.findById(id);

    if (!assessment) {
      console.log(`❌ [RESULTS ENDPOINT] Assessment ${id} not found`);
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }
    
    // Check if results are released (only for non-admin users)
    if (currentUser.role !== 'admin' && !assessment.results_released) {
      console.log(`🔒 [RESULTS ENDPOINT] Results not released for assessment ${id}`);
      return res.status(403).json({
        success: false,
        message: 'Results have not been released yet. Please contact your administrator.',
        resultsReleased: false
      });
    }
    
    console.log(`✅ [RESULTS ENDPOINT] Found assessment ${id}, has ${Object.keys(assessment.responses || {}).length} responses`);

    // DEBUG: Log what we retrieved
    console.log('🔍 Results endpoint - Retrieved assessment:', id);
    console.log('🔍 Assessment object keys:', Object.keys(assessment));
    console.log('🔍 Assessment.responses type:', typeof assessment.responses);
    console.log('🔍 Assessment.responses null/undefined?:', assessment.responses === null || assessment.responses === undefined);
    console.log('🔍 Assessment.responses is object?:', assessment.responses && typeof assessment.responses === 'object');

    // FIX: Ensure responses exists and is an object
    if (!assessment.responses || typeof assessment.responses !== 'object') {
      console.warn('⚠️  WARNING: Assessment responses is null/undefined or not an object! Initializing to empty object.');
      assessment.responses = {};
    }

    // Allow results even with no responses - will show zero state
    const hasAnyResponses = Object.keys(assessment.responses).length > 0;
    const hasCompletedCategories = assessment.completedCategories.length > 0;
    
    console.log('Generating results for assessment:', id);
    console.log('Assessment responses:', JSON.stringify(assessment.responses, null, 2));
    console.log('Has responses:', hasAnyResponses, 'Completed categories:', assessment.completedCategories.length);
    
    // Calculate total questions and answered questions
    const totalQuestions = assessmentFramework.assessmentAreas.reduce((total, area) => {
      return total + area.dimensions.reduce((dimTotal, dim) => {
        return dimTotal + (dim.questions?.length || 0);
      }, 0);
    }, 0);
    
    // Count answered questions (excluding comments and skipped)
    // Extract unique question IDs by removing perspective suffixes
    const questionIds = new Set();
    Object.keys(assessment.responses).forEach(key => {
      if (key.includes('_comment') || key.includes('_skipped')) return;
      
      // Remove perspective suffixes to get question ID
      let questionId = key;
      const perspectiveSuffixes = ['_current_state', '_future_state', '_technical_pain', '_business_pain'];
      for (const suffix of perspectiveSuffixes) {
        if (key.endsWith(suffix)) {
          questionId = key.substring(0, key.length - suffix.length);
          break;
        }
      }
      questionIds.add(questionId);
    });
    const answeredQuestions = questionIds.size;
    
    console.log(`Questions answered: ${answeredQuestions} of ${totalQuestions}`);
    
    // Find areas with any responses (completed or partial)
    const areasWithResponses = hasAnyResponses 
      ? assessmentFramework.assessmentAreas.filter(area => {
          // Check if there are any responses for this area
          const hasAreaResponses = Object.keys(assessment.responses).some(key => {
            // Skip comment and skipped keys
            if (key.includes('_comment') || key.includes('_skipped')) return false;
            
            // Extract question ID from response key (format: questionId_perspectiveId)
            // Perspective IDs are: current_state, future_state, technical_pain, business_pain
            let questionId = key;
            const perspectiveSuffixes = ['_current_state', '_future_state', '_technical_pain', '_business_pain'];
            for (const suffix of perspectiveSuffixes) {
              if (key.endsWith(suffix)) {
                questionId = key.substring(0, key.length - suffix.length);
                break;
              }
            }
            
            // Check if this question belongs to this area
            if (area.dimensions) {
              return area.dimensions.some(dim => 
                dim.questions && dim.questions.some(q => q.id === questionId)
              );
            } else if (area.questions) {
              return area.questions.some(q => q.id === questionId);
            }
            return false;
          });
          console.log(`Area ${area.id}: has responses = ${hasAreaResponses}`);
          return hasAreaResponses;
        })
      : []; // No responses yet
    
    console.log(`Total areas with responses: ${areasWithResponses.length}`);
    
    // Generate content using OpenAI (dynamically generates ALL content based on assessment data)
    let recommendations;
    if (hasAnyResponses) {
      console.log('🤖 Generating content using OpenAI for overall assessment');
      console.log('Sending ALL assessment data: Current state, Future state, Pain points, Comments');
      
      // Use OpenAI to generate fresh content on every request
      recommendations = await openAIContentGenerator.generateAssessmentContent(assessment, null);
      
      console.log('✅ OpenAI content generation completed');
      console.log('Overall scores:', recommendations.overall);
      console.log('Recommendations:', recommendations.prioritizedActions?.length || 0);
      
      // 🎯 ENHANCE with real Databricks product features
      console.log('🔧 Enhancing recommendations with actual Databricks features...');
      try {
        // Enhance prioritizedActions with real Databricks features for each pillar
        if (recommendations.prioritizedActions && Array.isArray(recommendations.prioritizedActions)) {
          recommendations.prioritizedActions = recommendations.prioritizedActions.map(action => {
            const pillarId = action.pillarId || action.area || action.pillar;
            const maturityLevel = recommendations.areaScores?.[pillarId]?.currentScore || action.currentScore || 1;
            
            // Get contextualized Databricks features for this pillar
            const databricksRecs = DatabricksFeatureMapper.getRecommendationsForPillar(
              pillarId,
              Math.round(maturityLevel),
              assessment.responses
            );
            
            console.log(`🔧 Enhancing pillar ${pillarId} (level ${Math.round(maturityLevel)}) with ${databricksRecs.currentMaturity?.features?.length || 0} features`);
            
            // Enhance action with actual Databricks features
            // NOTE: specificRecommendations (Next Steps) will be set by IntelligentRecommendationEngine later
            return {
              ...action,
              databricksFeatures: databricksRecs.currentMaturity?.features || [],
              nextLevelFeatures: databricksRecs.nextLevel?.features || [],
              quickWins: databricksRecs.quickWins || [],
              strategicMoves: databricksRecs.strategicMoves || [],
              // DO NOT SET specificRecommendations here - let intelligent engine handle it
              _source: 'Databricks Release Notes - October 2025',
              _docsUrl: 'https://docs.databricks.com/aws/en/release-notes/product/'
            };
          });
          console.log(`✅ Enhanced ${recommendations.prioritizedActions.length} pillar recommendations with Databricks features`);
          // Log first pillar for debugging
          if (recommendations.prioritizedActions.length > 0) {
            console.log(`📊 Sample enhanced pillar:`, {
              pillarId: recommendations.prioritizedActions[0].pillarId || recommendations.prioritizedActions[0].area,
              databricksFeatures: recommendations.prioritizedActions[0].databricksFeatures?.length || 0,
              quickWins: recommendations.prioritizedActions[0].quickWins?.length || 0,
              specificRecommendations: recommendations.prioritizedActions[0].specificRecommendations?.length || 0
            });
          }
        }
        
        // Add Databricks-specific quick wins to overall recommendations
        if (recommendations.quickWins) {
          const databricksQuickWins = [];
          Object.keys(recommendations.areaScores || {}).forEach(pillarId => {
            const level = Math.round(recommendations.areaScores[pillarId].currentScore || 1);
            const recs = DatabricksFeatureMapper.getRecommendationsForPillar(pillarId, level);
            if (recs.quickWins) {
              databricksQuickWins.push(...recs.quickWins);
            }
          });
          recommendations.databricksQuickWins = databricksQuickWins.slice(0, 5);
          console.log(`✅ Added ${databricksQuickWins.length} Databricks quick wins`);
        }
        
      } catch (error) {
        console.error('⚠️  Error enhancing with Databricks features:', error);
        console.log('Continuing with base recommendations');
      }
    } else {
      // Provide default empty recommendations structure
      recommendations = {
        overall: {
          currentScore: 0,
          futureScore: 0,
          gap: 0,
          level: assessmentFramework.maturityLevels[1],
          summary: 'No responses yet. Start answering questions to see your maturity assessment results.'
        },
        areaScores: {},
        categories: {},
        painPointRecommendations: [],
        gapBasedActions: [],
        commentBasedInsights: [],
        prioritizedActions: [],
        roadmap: { immediate: [], shortTerm: [], longTerm: [] },
        quickWins: [],
        riskAreas: [],
        executiveSummary: ''
      };
      console.log('No responses yet - using default empty state');
    }
    
    // Calculate detailed category scores from ADAPTIVE engine (for all areas with responses)
    const categoryDetails = {};
    
    // Ensure areaScores exists
    if (!recommendations.areaScores) {
      recommendations.areaScores = {};
    }
    
    console.log('🔍 DEBUG: recommendations.areaScores:', JSON.stringify(recommendations.areaScores, null, 2));
    console.log('🔍 DEBUG: areasWithResponses:', areasWithResponses.map(a => a.id));
    
    // 🚨 NEW: Filter to only FULLY COMPLETED pillars (all questions answered or skipped)
    const fullyCompletedAreas = areasWithResponses.filter(area => {
      let totalQuestions = 0;
      let addressedQuestions = 0; // answered or skipped
      
      area.dimensions.forEach(dimension => {
        dimension.questions.forEach(question => {
          totalQuestions++;
          const currentKey = `${question.id}_current_state`;
          const skippedKey = `${question.id}_skipped`;
          
          if (assessment.responses[currentKey] !== undefined || assessment.responses[skippedKey]) {
            addressedQuestions++;
          }
        });
      });
      
      const isFullyCompleted = addressedQuestions === totalQuestions;
      console.log(`📊 Pillar ${area.id}: ${addressedQuestions}/${totalQuestions} questions addressed - ${isFullyCompleted ? '✅ COMPLETE' : '⏸️ PARTIAL (excluded)'}`);
      return isFullyCompleted;
    });
    
    console.log(`✅ Fully completed pillars: ${fullyCompletedAreas.length}/${areasWithResponses.length}`);
    
    // Only process fully completed pillars
    fullyCompletedAreas.forEach(area => {
      const areaScore = recommendations.areaScores[area.id] || { current: 0, future: 0 };
      console.log(`🔍 DEBUG: Area ${area.id} - areaScore from recommendations:`, areaScore);
      
      // 🔥 FIX: Calculate scores from ACTUAL responses if OpenAI didn't provide them
      let currentScore = areaScore.current || 0;
      let futureScore = areaScore.future || 0;
      
      // If OpenAI scores are 0/missing, calculate from actual responses
      if (currentScore === 0 && futureScore === 0) {
        console.log(`⚠️ OpenAI scores missing for ${area.id}, calculating from responses...`);
        let currentSum = 0;
        let futureSum = 0;
        let answeredCount = 0;
        let totalQuestions = 0;
        
        area.dimensions.forEach(dimension => {
          dimension.questions.forEach(question => {
            const currentKey = `${question.id}_current_state`;
            const futureKey = `${question.id}_future_state`;
            const skippedKey = `${question.id}_skipped`;
            
            // Count all non-skipped questions as part of the denominator
            if (!assessment.responses[skippedKey]) {
              totalQuestions++;
              
              // Only add to sum if actually answered
              if (assessment.responses[currentKey] !== undefined) {
                currentSum += assessment.responses[currentKey];
                futureSum += assessment.responses[futureKey] || assessment.responses[currentKey];
                answeredCount++;
              }
            }
          });
        });
        
        // FIX: Divide by total non-skipped questions, not just answered questions
        // This ensures partial completion shows lower scores (e.g., 1/10 = 0.5, not 5/1 = 5.0)
        if (totalQuestions > 0) {
          currentScore = currentSum / totalQuestions;
          futureScore = futureSum / totalQuestions;
          console.log(`✅ Calculated scores for ${area.id}: answered=${answeredCount}/${totalQuestions}, current=${currentScore.toFixed(2)}, future=${futureScore.toFixed(2)}`);
        }
      }
      
      const isCompleted = assessment.completedCategories.includes(area.id);
      
      // Calculate questions answered for this pillar AND dimension-level scores
      let questionsAnsweredForPillar = 0;
      let totalQuestionsForPillar = 0;
      const dimensionScores = {};
      
      area.dimensions.forEach(dimension => {
        let dimCurrentSum = 0;
        let dimFutureSum = 0;
        let dimQuestionCount = 0;
        let dimAnsweredCount = 0;
        
        dimension.questions.forEach(question => {
          totalQuestionsForPillar++;
          dimQuestionCount++;
          
          const currentKey = `${question.id}_current_state`;
          const futureKey = `${question.id}_future_state`;
          
          if (assessment.responses[currentKey] !== undefined) {
            questionsAnsweredForPillar++;
            dimAnsweredCount++;
            dimCurrentSum += assessment.responses[currentKey];
            dimFutureSum += assessment.responses[futureKey] || assessment.responses[currentKey];
          }
        });
        
        // Calculate dimension scores
        if (dimAnsweredCount > 0) {
          const dimCurrentScore = dimCurrentSum / dimAnsweredCount;
          const dimFutureScore = dimFutureSum / dimAnsweredCount;
          dimensionScores[dimension.id] = {
            id: dimension.id,
            name: dimension.name,
            currentScore: parseFloat(dimCurrentScore.toFixed(1)), // 🔥 FIX: 1 decimal place
            futureScore: parseFloat(dimFutureScore.toFixed(1)),
            gap: parseFloat((dimFutureScore - dimCurrentScore).toFixed(1)),
            questionsAnswered: dimAnsweredCount,
            totalQuestions: dimQuestionCount
          };
        }
      });
      
      categoryDetails[area.id] = {
        id: area.id,
        name: area.name,
        description: area.description,
        score: parseFloat(currentScore.toFixed(1)), // 🔥 FIX: Use 1 decimal place (2.0, 3.5, etc.)
        currentScore: parseFloat(currentScore.toFixed(1)),
        futureScore: parseFloat(futureScore.toFixed(1)),
        gap: parseFloat((futureScore - currentScore).toFixed(1)),
        level: adaptiveRecommendationEngine.getMaturityLevel(currentScore),
        weight: areasWithResponses.length > 0 ? 1 / areasWithResponses.length : 0,
        isPartial: !isCompleted,
        questionsAnswered: questionsAnsweredForPillar,
        totalQuestions: totalQuestionsForPillar,
        dimensions: dimensionScores // ADD dimension-level scores
      };
    });

    // 🔥 INTELLIGENT RECOMMENDATIONS: Generate customer-specific, actionable recommendations
    console.log('🧠 Generating intelligent, customer-specific recommendations...');
    const intelligentEngine = new IntelligentRecommendationEngine();
    
    // 🚨 FIX: Generate intelligent recommendations for ANY PILLAR WITH RESPONSES (not just fully completed)
    for (const area of areasWithResponses) {
      const pillarId = area.id;
      const pillarMaturity = categoryDetails[pillarId]?.score || 3;
      
      console.log(`🧠 Analyzing pillar: ${pillarId} (maturity: ${pillarMaturity})`);
      
      // Get the pillar framework data to pass actual question IDs
      const pillarFramework = assessmentFramework.assessmentAreas.find(a => a.id === pillarId);
      
      // Generate intelligent, customer-specific recommendations (NOW WITH DATABASE! 🚀)
      const intelligentRecs = await intelligentEngine.generateRecommendations(
        assessment,
        pillarId,
        pillarFramework
      );
      
      console.log(`✅ Found ${intelligentRecs.recommendations.length} intelligent recommendations for ${pillarId}`);
      console.log(`✅ Found ${intelligentRecs.nextSteps.length} customer-specific next steps for ${pillarId}`);
      console.log(`✅ Found ${intelligentRecs.databricksFeatures.length} Databricks features for ${pillarId}`);
      console.log(`✅ Found ${intelligentRecs.theGood.length} strengths and ${intelligentRecs.theBad.length} challenges for ${pillarId}`);
      
      // 🚨 CRITICAL FIX: Populate categoryDetails with intelligent recommendations
      if (categoryDetails[pillarId]) {
        categoryDetails[pillarId].theGood = intelligentRecs.theGood || [];
        categoryDetails[pillarId].theBad = intelligentRecs.theBad || [];
        categoryDetails[pillarId].recommendations = intelligentRecs.recommendations || [];
        categoryDetails[pillarId].nextSteps = intelligentRecs.nextSteps || [];
        categoryDetails[pillarId].databricksFeatures = intelligentRecs.databricksFeatures || [];
        categoryDetails[pillarId].painPoints = intelligentRecs.theBad || []; // Alias for backward compatibility
        categoryDetails[pillarId]._intelligentEngine = true;
        categoryDetails[pillarId]._painPointsAnalyzed = intelligentRecs.theBad?.length || 0;
        categoryDetails[pillarId]._strengthsIdentified = intelligentRecs.theGood?.length || 0;
      }
    }
    
    // Enhance each pillar's prioritizedActions with intelligent, customer-specific recommendations
    if (recommendations.prioritizedActions && Array.isArray(recommendations.prioritizedActions)) {
      recommendations.prioritizedActions = await Promise.all(recommendations.prioritizedActions.map(async (action) => {
        const pillarId = action.pillarId || action.area || action.pillar;
        
        // Use the intelligent recommendations we already generated for categoryDetails
        const pillarDetails = categoryDetails[pillarId];
        if (pillarDetails && pillarDetails._intelligentEngine) {
          console.log(`✅ Using cached intelligent recommendations for ${pillarId} in prioritizedActions`);
          return {
            ...action,
            theGood: pillarDetails.theGood || [],
            theBad: pillarDetails.theBad || [],
            recommendations: pillarDetails.recommendations || [],
            nextSteps: pillarDetails.nextSteps || [],
            specificRecommendations: pillarDetails.nextSteps || [],
            databricksFeatures: pillarDetails.databricksFeatures || [],
            _intelligentEngine: true,
            _painPointsAnalyzed: pillarDetails._painPointsAnalyzed || 0,
            _strengthsIdentified: pillarDetails._strengthsIdentified || 0
          };
        }
        
        // Fallback if pillar not in categoryDetails (shouldn't happen)
        console.warn(`⚠️ Pillar ${pillarId} not found in categoryDetails, skipping intelligent recommendations`);
        return action;
      }));
      
      // 🗺️ GENERATE DYNAMIC STRATEGIC ROADMAP based on prioritized actions
      console.log('🗺️ Generating dynamic strategic roadmap...');
      const dynamicRoadmap = intelligentEngine.generateStrategicRoadmap(recommendations.prioritizedActions);
      recommendations.roadmap = dynamicRoadmap;
      console.log(`✅ Dynamic roadmap generated with ${dynamicRoadmap.phases?.length || 0} phases`);
      
      // 💰 CALCULATE BUSINESS IMPACT based on assessment gaps and features
      console.log('💰 Calculating dynamic business impact metrics...');
      const businessImpact = intelligentEngine.calculateBusinessImpact(
        assessment,
        recommendations.prioritizedActions,
        assessment.industry || 'Technology'
      );
      recommendations.businessImpact = businessImpact;
      console.log(`✅ Business impact calculated: ${businessImpact.decisionSpeed?.value}, ${businessImpact.costOptimization?.value}, ${businessImpact.manualOverhead?.value}`);
      
      // 📊 GENERATE DYNAMIC MATURITY SUMMARY based on assessment
      console.log('📊 Generating dynamic maturity summary...');
      const currentScore = recommendations.overall?.currentScore || 3;
      const targetScore = recommendations.overall?.futureScore || 4;
      const maturitySummary = intelligentEngine.generateMaturitySummary(
        assessment,
        recommendations.prioritizedActions,
        currentScore,
        targetScore,
        assessment.industry || 'Technology'
      );
      recommendations.maturitySummary = maturitySummary;
      console.log(`✅ Maturity summary generated: ${maturitySummary.current.level} → ${maturitySummary.target.level}`);
    }

    // 🚨 RECALCULATE overall score using ONLY fully completed pillars
    if (fullyCompletedAreas.length > 0) {
      const completedPillarScores = fullyCompletedAreas.map(area => {
        const detail = categoryDetails[area.id];
        return {
          current: detail?.currentScore || 0,
          future: detail?.futureScore || 0
        };
      });
      
      const avgCurrent = completedPillarScores.reduce((sum, s) => sum + s.current, 0) / completedPillarScores.length;
      const avgFuture = completedPillarScores.reduce((sum, s) => sum + s.future, 0) / completedPillarScores.length;
      
      recommendations.overall = {
        currentScore: parseFloat(avgCurrent.toFixed(1)),
        futureScore: parseFloat(avgFuture.toFixed(1)),
        gap: parseFloat((avgFuture - avgCurrent).toFixed(1)),
        level: avgCurrent < 2 ? 'Initial' : avgCurrent < 3 ? 'Developing' : avgCurrent < 4 ? 'Defined' : avgCurrent < 4.5 ? 'Advanced' : 'Optimized',
        summary: `Based on ${fullyCompletedAreas.length} completed pillar(s)`
      };
      
      console.log(`✅ Overall score recalculated from ${fullyCompletedAreas.length} fully completed pillars: ${avgCurrent.toFixed(1)} → ${avgFuture.toFixed(1)}`);
    } else {
      // No fully completed pillars - return empty/minimal results
      recommendations.overall = {
        currentScore: 0,
        futureScore: 0,
        gap: 0,
        level: 'Not Started',
        summary: 'No pillars fully completed yet. Complete all questions in at least one pillar to see results.'
      };
      console.log(`⚠️ No fully completed pillars - returning minimal results`);
    }

    const results = {
      assessmentInfo: {
        id: assessment.id,
        assessmentName: assessment.assessmentName,
        assessmentDescription: assessment.assessmentDescription,
        organizationName: assessment.organizationName,
        contactEmail: assessment.contactEmail,
        industry: assessment.industry,
        completedAt: assessment.completedAt,
        startedAt: assessment.startedAt,
        isPartialAssessment: fullyCompletedAreas.length < assessmentFramework.assessmentAreas.length,
        completedPillars: fullyCompletedAreas.length, // 🚨 Changed to fully completed count
        totalPillars: assessmentFramework.assessmentAreas.length,
        pillarsWithResponses: areasWithResponses.length,
        questionsAnswered: answeredQuestions,
        totalQuestions: totalQuestions,
        completionPercentage: totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0,
        lastModified: assessment.lastModified,
        lastEditor: assessment.lastEditor,
        editHistory: assessment.editHistory || []
      },
      overall: recommendations.overall, // ADAPTIVE: includes currentScore, futureScore, gap, level, summary
      categoryDetails,
      categories: recommendations.categories,
      painPointRecommendations: recommendations.painPointRecommendations || [], // ADAPTIVE: Critical pain points to address
      gapBasedActions: recommendations.gapBasedActions || [], // ADAPTIVE: Actions to bridge current → future gap
      commentBasedInsights: recommendations.commentBasedInsights || [], // ADAPTIVE: Insights from user notes
      prioritizedActions: recommendations.prioritizedActions,
      roadmap: recommendations.roadmap,
      businessImpact: recommendations.businessImpact, // DYNAMIC: Calculated based on gaps, industry, and features
      maturitySummary: recommendations.maturitySummary, // DYNAMIC: Descriptions of current, target, and improvement
      quickWins: recommendations.quickWins,
      riskAreas: recommendations.riskAreas,
      executiveSummary: recommendations.executiveSummary || '', // ADAPTIVE: Executive summary
      whatsNew: recommendations.whatsNew, // ADAPTIVE: Latest Databricks features
      pillarStatus: assessmentFramework.assessmentAreas.map(area => {
        const isCompleted = assessment.completedCategories.includes(area.id);
        const hasResponses = areasWithResponses.some(a => a.id === area.id);
        return {
          id: area.id,
          name: area.name,
          completed: isCompleted,
          hasResponses: hasResponses,
          isPartial: hasResponses && !isCompleted,
          score: hasResponses ? categoryDetails[area.id]?.score : null,
          currentScore: hasResponses ? categoryDetails[area.id]?.currentScore : null,
          futureScore: hasResponses ? categoryDetails[area.id]?.futureScore : null,
          gap: hasResponses ? categoryDetails[area.id]?.gap : null
        };
      }),
      _engineType: 'openai',
      _contentSource: 'openai-generated',
      _generatedAt: new Date().toISOString(), // Track when this was generated
      _isDynamic: true // Flag indicating this is ALWAYS dynamically generated, NEVER cached
    };

    // ⚠️ NO CACHING - Results are ALWAYS generated fresh from current assessment data
    // Every API call regenerates results using OpenAI based on latest responses
    console.log('✅ Results generated dynamically - NO CACHING');

    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error('Detailed error generating results:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Error generating assessment results',
      error: error.message
    });
  }
});

// Get industry benchmarking report
app.get('/api/assessment/:id/benchmark', requireAuth, async (req, res) => {
  try {
    console.log(`🎯 [BENCHMARK ENDPOINT] Request for assessment: ${req.params.id}`);
    
    // Prevent caching
    res.set({
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Surrogate-Control': 'no-store'
    });

    const { id } = req.params;
    const currentUser = req.user;
    const assessmentRepo = require('./db/assessmentRepository');
    const assessment = await assessmentRepo.findById(id);

    if (!assessment) {
      console.log(`❌ [BENCHMARK ENDPOINT] Assessment ${id} not found`);
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }
    
    // Check if results are released (only for non-admin users)
    if (currentUser.role !== 'admin' && !assessment.results_released) {
      console.log(`🔒 [BENCHMARK ENDPOINT] Results not released for assessment ${id}`);
      return res.status(403).json({
        success: false,
        message: 'Benchmark report has not been released yet. Please contact your administrator.',
        resultsReleased: false
      });
    }
    
    console.log(`✅ [BENCHMARK ENDPOINT] Assessment ${id} found, generating benchmarking report`);

    // Ensure responses exists
    if (!assessment.responses || typeof assessment.responses !== 'object') {
      assessment.responses = {};
    }

    const hasAnyResponses = Object.keys(assessment.responses).length > 0;
    
    if (!hasAnyResponses) {
      return res.json({
        success: true,
        data: {
          message: 'No responses yet - complete assessment to generate benchmarking report',
          assessmentInfo: {
            id: assessment.id,
            assessmentName: assessment.assessmentName,
            industry: assessment.industry,
            startedAt: assessment.startedAt
          }
        }
      });
    }

    // Calculate pillar scores
    const pillarScores = {};
    const areasWithResponses = [];
    
    for (const area of assessmentFramework.assessmentAreas) {
      // Calculate current and future scores
      let currentTotal = 0;
      let futureTotal = 0;
      let answeredCount = 0;
      let totalNonSkippedQuestions = 0;

      // Count all questions in this area and calculate scores
      area.dimensions.forEach(dimension => {
        dimension.questions.forEach(question => {
          const currentKey = `${question.id}_current_state`;
          const futureKey = `${question.id}_future_state`;
          const skippedKey = `${question.id}_skipped`;
          
          // Count non-skipped questions
          if (!assessment.responses[skippedKey]) {
            totalNonSkippedQuestions++;
            
            // Add to totals if answered
            if (assessment.responses[currentKey] !== undefined) {
              currentTotal += parseFloat(assessment.responses[currentKey]);
              answeredCount++;
            }
            if (assessment.responses[futureKey] !== undefined) {
              futureTotal += parseFloat(assessment.responses[futureKey]);
            }
          }
        });
      });

      // Only include pillar if it has responses
      if (answeredCount > 0) {
        areasWithResponses.push(area);
        
        // Divide by total non-skipped questions to reflect partial completion
        const currentScore = totalNonSkippedQuestions > 0 ? parseFloat((currentTotal / totalNonSkippedQuestions).toFixed(1)) : 0;
        const futureScore = totalNonSkippedQuestions > 0 ? parseFloat((futureTotal / totalNonSkippedQuestions).toFixed(1)) : 0;
        const gap = parseFloat((futureScore - currentScore).toFixed(1));

        pillarScores[area.id] = {
          currentScore,
          futureScore,
          gap,
          responseCount: answeredCount
        };
      }
    }

    // Calculate overall score (average of current scores)
    const pillarCurrentScores = Object.values(pillarScores).map(p => p.currentScore);
    const overallScore = pillarCurrentScores.length > 0
      ? parseFloat((pillarCurrentScores.reduce((sum, s) => sum + s, 0) / pillarCurrentScores.length).toFixed(1))
      : 0;

    // Extract pain points from responses
    const painPoints = [];
    Object.values(assessment.responses).forEach(response => {
      if (response.painPoints && Array.isArray(response.painPoints)) {
        response.painPoints.forEach(pp => {
          if (!painPoints.find(p => p.value === pp.value || p.label === pp.label)) {
            painPoints.push(pp);
          }
        });
      }
    });

    console.log(`📊 [BENCHMARK] Overall Score: ${overallScore}, Pillars: ${Object.keys(pillarScores).length}, Pain Points: ${painPoints.length}`);

    // Generate comprehensive benchmarking report
    const benchmarkReport = await industryBenchmarkingService.generateComprehensiveBenchmarkReport(
      assessment.industry || 'Technology',
      assessment,
      overallScore,
      pillarScores,
      painPoints
    );

    console.log('✅ [BENCHMARK] Report generated successfully');

    res.json({
      success: true,
      data: benchmarkReport
    });

  } catch (error) {
    console.error('❌ [BENCHMARK] Error generating benchmarking report:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Error generating benchmarking report',
      error: error.message
    });
  }
});

// Submit NPS feedback
app.post('/api/assessment/:id/nps-feedback', async (req, res) => {
  try {
    const { id } = req.params;
    const { score, comment, assessmentName } = req.body;
    
    console.log(`[NPS Feedback] Received for assessment ${id}:`, { score, comment });
    
    // Validate score
    if (score === null || score === undefined || score < 0 || score > 10) {
      return res.status(400).json({
        success: false,
        message: 'Invalid NPS score. Must be between 0 and 10.'
      });
    }
    
    const assessmentRepo = require('./db/assessmentRepository');
    const assessment = await assessmentRepo.findById(id);
    
    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }
    
    // Add NPS feedback to assessment
    const npsFeedback = {
      score: parseInt(score, 10),
      comment: comment || '',
      submittedAt: new Date().toISOString(),
      category: score >= 9 ? 'Promoter' : score >= 7 ? 'Passive' : 'Detractor'
    };
    
    await assessmentRepo.update(id, { npsFeedback });
    
    console.log(`[NPS Feedback] Saved successfully for ${id}`);
    
    res.json({
      success: true,
      message: 'Feedback submitted successfully',
      data: assessment.npsFeedback
    });
  } catch (error) {
    console.error('Error submitting NPS feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting feedback',
      error: error.message
    });
  }
});

// Helper functions for NPS calculation
function calculateNPS(assessments) {
  const withFeedback = assessments.filter(a => a.npsFeedback && a.npsFeedback.score !== null && a.npsFeedback.score !== undefined);
  
  if (withFeedback.length === 0) {
    return 'Awaiting feedback'; // No feedback yet
  }
  
  const promoters = withFeedback.filter(a => a.npsFeedback.score >= 9).length;
  const detractors = withFeedback.filter(a => a.npsFeedback.score <= 6).length;
  const total = withFeedback.length;
  
  // NPS = (% Promoters - % Detractors)
  const nps = ((promoters / total) * 100) - ((detractors / total) * 100);
  
  return nps.toFixed(1);
}

function calculateNPSTrend(allAssessments, recentAssessments, previousAssessments) {
  const recentNPS = calculateNPS(recentAssessments);
  const previousNPS = calculateNPS(previousAssessments);
  
  if (recentNPS === 'Awaiting feedback' || previousNPS === 'Awaiting feedback') {
    return '0.0';
  }
  
  const trend = parseFloat(recentNPS) - parseFloat(previousNPS);
  return trend.toFixed(1);
}

function getNPSBreakdown(assessments) {
  const withFeedback = assessments.filter(a => a.npsFeedback && a.npsFeedback.score !== null && a.npsFeedback.score !== undefined);
  
  if (withFeedback.length === 0) {
    return {
      promoters: 0,
      passives: 0,
      detractors: 0,
      total: 0,
      promotersPercent: 0,
      passivesPercent: 0,
      detractorsPercent: 0
    };
  }
  
  const promoters = withFeedback.filter(a => a.npsFeedback.score >= 9).length;
  const passives = withFeedback.filter(a => a.npsFeedback.score >= 7 && a.npsFeedback.score <= 8).length;
  const detractors = withFeedback.filter(a => a.npsFeedback.score <= 6).length;
  const total = withFeedback.length;
  
  return {
    promoters,
    passives,
    detractors,
    total,
    promotersPercent: ((promoters / total) * 100).toFixed(1),
    passivesPercent: ((passives / total) * 100).toFixed(1),
    detractorsPercent: ((detractors / total) * 100).toFixed(1)
  };
}

// Dashboard statistics endpoint - ALL DYNAMIC DATA
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const assessmentRepo = require('./db/assessmentRepository');
    const allAssessments = await assessmentRepo.findAll();
    console.log(`[Dashboard Stats] Processing ${allAssessments.length} assessments`);
    
    // Sort assessments by date for trend calculations
    const sortedByDate = [...allAssessments].sort((a, b) => 
      new Date(a.startedAt) - new Date(b.startedAt)
    );
    
    // Calculate date ranges for trends (last 30 days vs previous 30 days)
    const now = Date.now();
    const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = now - (60 * 24 * 60 * 60 * 1000);
    
    const recentAssessments = allAssessments.filter(a => 
      new Date(a.startedAt).getTime() >= thirtyDaysAgo
    );
    const previousAssessments = allAssessments.filter(a => 
      new Date(a.startedAt).getTime() >= sixtyDaysAgo && 
      new Date(a.startedAt).getTime() < thirtyDaysAgo
    );
    
    // 1. TOTAL ASSESSMENTS with trend
    const totalAssessments = allAssessments.length;
    const totalAssessmentsTrend = recentAssessments.length - previousAssessments.length;
    
    // 2. ACTIVE CUSTOMERS with trend
    const activeCustomers = new Set(allAssessments.map(a => a.organizationName)).size;
    const recentCustomers = new Set(recentAssessments.map(a => a.organizationName)).size;
    const previousCustomers = new Set(previousAssessments.map(a => a.organizationName)).size;
    const activeCustomersTrend = recentCustomers - previousCustomers;
    
    // 3. AVERAGE COMPLETION TIME with trend
    // 🔥 FIX: Handle both completedAt and submittedAt, both startedAt and createdAt
    const completedAssessments = allAssessments.filter(a => a.completedAt || a.submittedAt).map(a => ({
      ...a,
      completedAt: a.completedAt || a.submittedAt,
      startedAt: a.startedAt || a.createdAt
    }));
    const recentCompleted = completedAssessments.filter(a => 
      new Date(a.completedAt).getTime() >= thirtyDaysAgo
    );
    const previousCompleted = completedAssessments.filter(a => 
      new Date(a.completedAt).getTime() >= sixtyDaysAgo && 
      new Date(a.completedAt).getTime() < thirtyDaysAgo
    );
    
    const calcAvgTime = (assessments) => {
      if (assessments.length === 0) return 0;
      return assessments.reduce((sum, a) => {
        const completed = new Date(a.completedAt || a.submittedAt);
        const started = new Date(a.startedAt || a.createdAt);
        const hours = (completed - started) / (1000 * 60 * 60);
        return sum + (hours > 0 ? hours : 0);
      }, 0) / assessments.length;
    };
    
    const avgCompletionTime = calcAvgTime(completedAssessments);
    const recentAvgTime = calcAvgTime(recentCompleted);
    const previousAvgTime = calcAvgTime(previousCompleted);
    const avgCompletionTimeTrend = previousAvgTime > 0 ? 
      (previousAvgTime - recentAvgTime).toFixed(1) : '0.0';
    
    // 4. AVERAGE MATURITY LEVEL with trend
    const calcAvgMaturity = (assessments) => {
      let totalMaturity = 0;
      let count = 0;
      assessments.forEach(assessment => {
        if (assessment.responses && Object.keys(assessment.responses).length > 0) {
          const currentStates = Object.keys(assessment.responses)
            .filter(key => key.endsWith('_current_state'))
            .map(key => parseInt(assessment.responses[key], 10))
            .filter(val => !isNaN(val));
          
          if (currentStates.length > 0) {
            totalMaturity += currentStates.reduce((a, b) => a + b, 0) / currentStates.length;
            count++;
          }
        }
      });
      return count > 0 ? totalMaturity / count : 0;
    };
    
    const avgMaturityLevel = calcAvgMaturity(allAssessments);
    const recentAvgMaturity = calcAvgMaturity(recentAssessments);
    const previousAvgMaturity = calcAvgMaturity(previousAssessments);
    const avgMaturityLevelTrend = previousAvgMaturity > 0 ? 
      (recentAvgMaturity - previousAvgMaturity).toFixed(1) : '0.0';
    
    // 5. AVERAGE IMPROVEMENT POTENTIAL with trend
    const calcAvgImprovement = (assessments) => {
      let totalImprovement = 0;
      let count = 0;
      assessments.forEach(assessment => {
        if (assessment.responses && Object.keys(assessment.responses).length > 0) {
          const keys = Object.keys(assessment.responses);
          const questionIds = new Set();
          keys.forEach(key => {
            if (key.endsWith('_current_state') || key.endsWith('_future_state')) {
              const qId = key.replace('_current_state', '').replace('_future_state', '');
              questionIds.add(qId);
            }
          });
          
          questionIds.forEach(qId => {
            const current = parseInt(assessment.responses[`${qId}_current_state`], 10);
            const future = parseInt(assessment.responses[`${qId}_future_state`], 10);
            if (!isNaN(current) && !isNaN(future)) {
              totalImprovement += (future - current);
              count++;
            }
          });
        }
      });
      return count > 0 ? totalImprovement / count : 0;
    };
    
    const avgImprovementPotential = calcAvgImprovement(allAssessments);
    const recentAvgImprovement = calcAvgImprovement(recentAssessments);
    const previousAvgImprovement = calcAvgImprovement(previousAssessments);
    const avgImprovementPotentialTrend = previousAvgImprovement > 0 ? 
      (recentAvgImprovement - previousAvgImprovement).toFixed(1) : '0.0';
    
    // 6. PILLAR-SPECIFIC MATURITY (dynamic by pillar)
    const pillarIds = ['platform_governance', 'data_engineering', 'analytics_bi', 'ml_mlops', 'genai_agentic', 'operational_excellence'];
    const pillarMaturityCurrent = [];
    const pillarMaturityTarget = [];
    
    pillarIds.forEach(pillarId => {
      let pillarCurrentTotal = 0;
      let pillarFutureTotal = 0;
      let pillarCount = 0;
      
      allAssessments.forEach(assessment => {
        if (assessment.responses) {
          const pillarKeys = Object.keys(assessment.responses).filter(key => 
            key.startsWith(pillarId) && (key.endsWith('_current_state') || key.endsWith('_future_state'))
          );
          
          const currentStates = pillarKeys
            .filter(key => key.endsWith('_current_state'))
            .map(key => parseInt(assessment.responses[key], 10))
            .filter(val => !isNaN(val));
          
          const futureStates = pillarKeys
            .filter(key => key.endsWith('_future_state'))
            .map(key => parseInt(assessment.responses[key], 10))
            .filter(val => !isNaN(val));
          
          if (currentStates.length > 0) {
            pillarCurrentTotal += currentStates.reduce((a, b) => a + b, 0) / currentStates.length;
            pillarCount++;
          }
          
          if (futureStates.length > 0) {
            pillarFutureTotal += futureStates.reduce((a, b) => a + b, 0) / futureStates.length;
          }
        }
      });
      
      pillarMaturityCurrent.push(pillarCount > 0 ? (pillarCurrentTotal / pillarCount).toFixed(1) : 3.0);
      pillarMaturityTarget.push(pillarCount > 0 ? (pillarFutureTotal / pillarCount).toFixed(1) : 4.0);
    });
    
    // 7. WEEKLY COMPLETIONS (last 6 weeks) - DYNAMIC
    const weeklyCompletions = { labels: [], counts: [], avgHours: [] };
    const weeksAgo = 6;
    
    for (let i = weeksAgo - 1; i >= 0; i--) {
      const weekStart = now - ((i + 1) * 7 * 24 * 60 * 60 * 1000);
      const weekEnd = now - (i * 7 * 24 * 60 * 60 * 1000);
      
      const weekCompleted = completedAssessments.filter(a => {
        const completedTime = new Date(a.completedAt).getTime();
        return completedTime >= weekStart && completedTime < weekEnd;
      });
      
      const weekLabel = `W${weeksAgo - i}`;
      const weekCount = weekCompleted.length;
      const weekAvgHours = calcAvgTime(weekCompleted);
      
      weeklyCompletions.labels.push(weekLabel);
      weeklyCompletions.counts.push(weekCount);
      weeklyCompletions.avgHours.push(weekAvgHours > 0 ? parseFloat(weekAvgHours.toFixed(1)) : 0);
    }
    
    // 8. CUSTOMER PORTFOLIO with dynamic key gaps
    const customerPortfolio = allAssessments
      .sort((a, b) => new Date(b.startedAt || b.createdAt) - new Date(a.startedAt || a.createdAt))
      .slice(0, 10)
      .map(assessment => {
        const completion = Math.round((assessment.completedCategories?.length || 0) / 6 * 100);
        let status = 'On Track';
        if (completion < 50) status = 'Delayed';
        else if (completion < 80) status = 'At Risk';
        
        // Calculate maturity and target from responses
        let maturity = 0;
        let target = 0;
        if (assessment.responses && Object.keys(assessment.responses).length > 0) {
          const currentStates = Object.keys(assessment.responses)
            .filter(key => key.endsWith('_current_state'))
            .map(key => parseInt(assessment.responses[key], 10))
            .filter(val => !isNaN(val));
          
          const futureStates = Object.keys(assessment.responses)
            .filter(key => key.endsWith('_future_state'))
            .map(key => parseInt(assessment.responses[key], 10))
            .filter(val => !isNaN(val));
          
          if (currentStates.length > 0) {
            maturity = currentStates.reduce((a, b) => a + b, 0) / currentStates.length;
          }
          
          if (futureStates.length > 0) {
            target = futureStates.reduce((a, b) => a + b, 0) / futureStates.length;
          }
        }
        
        // Calculate key gaps dynamically (pillars with largest gaps)
        const pillarGaps = [];
        const pillarNames = {
          'platform_governance': 'Platform',
          'data_engineering': 'Data Eng',
          'analytics_bi': 'Analytics',
          'ml_mlops': 'ML/MLOps',
          'genai_agentic': 'GenAI',
          'operational_excellence': 'Ops'
        };
        
        pillarIds.forEach(pillarId => {
          if (assessment.responses) {
            const pillarKeys = Object.keys(assessment.responses).filter(key => key.startsWith(pillarId));
            const currentStates = pillarKeys
              .filter(key => key.endsWith('_current_state'))
              .map(key => parseInt(assessment.responses[key], 10))
              .filter(val => !isNaN(val));
            const futureStates = pillarKeys
              .filter(key => key.endsWith('_future_state'))
              .map(key => parseInt(assessment.responses[key], 10))
              .filter(val => !isNaN(val));
            
            if (currentStates.length > 0 && futureStates.length > 0) {
              const avgCurrent = currentStates.reduce((a, b) => a + b, 0) / currentStates.length;
              const avgFuture = futureStates.reduce((a, b) => a + b, 0) / futureStates.length;
              const gap = avgFuture - avgCurrent;
              pillarGaps.push({ pillar: pillarNames[pillarId], gap });
            }
          }
        });
        
        // Get top 2 gaps
        const keyGaps = pillarGaps
          .sort((a, b) => b.gap - a.gap)
          .slice(0, 2)
          .map(g => g.pillar);
        
        return {
          name: assessment.organizationName || 'Unknown',
          assessmentId: assessment.id,
          maturity: maturity > 0 ? maturity.toFixed(1) : '0.0',
          target: target > 0 ? target.toFixed(1) : '0.0',
          completion: completion,
          keyGaps: keyGaps.length > 0 ? keyGaps : ['Assessment in progress'],
          status: status
        };
      });
    
    // 9. FASTEST COMPLETIONS (top 2)
    const fastest = completedAssessments
      .map(a => ({
        ...a,
        completionTime: (new Date(a.completedAt) - new Date(a.startedAt)) / (1000 * 60 * 60)
      }))
      .sort((a, b) => a.completionTime - b.completionTime)
      .slice(0, 2)
      .map(a => ({
        name: a.organizationName || 'Unknown',
        organizationName: a.organizationName || 'Unknown',
        industry: a.industry || 'Not Specified',
        startedAt: a.startedAt,
        assessmentId: a.id,
        completionTime: parseFloat(a.completionTime.toFixed(1)), // 🔥 Include completionTime for frontend
        detail: `${a.completionTime.toFixed(1)} hrs • Owner: ${a.contactEmail?.split('@')[0] || 'Unknown'}`
      }));
    
    // 10. BIGGEST IMPROVEMENTS (top 2 by gap)
    const improvementList = allAssessments
      .map(a => {
        const improvement = calcAvgImprovement([a]);
        return { ...a, improvement };
      })
      .filter(a => a.improvement > 0)
      .sort((a, b) => b.improvement - a.improvement)
      .slice(0, 2)
      .map(a => ({
        name: a.organizationName || 'Unknown',
        assessmentId: a.id,
        detail: `+${a.improvement.toFixed(1)} gap • Owner: ${a.contactEmail?.split('@')[0] || 'Unknown'}`
      }));
    
    // 11. STALLED ASSESSMENTS (not completed, oldest first)
    const stalled = allAssessments
      .filter(a => !a.completedAt && !a.submittedAt)
      .map(a => ({
        ...a,
        stalledTime: (now - new Date(a.startedAt || a.createdAt).getTime()) / (1000 * 60 * 60)
      }))
      .sort((a, b) => b.stalledTime - a.stalledTime)
      .slice(0, 2)
      .map(a => ({
        name: a.organizationName || 'Unknown',
        assessmentId: a.id,
        detail: `${a.stalledTime.toFixed(0)} hrs stalled • Owner: ${a.contactEmail?.split('@')[0] || 'Unknown'}`
      }));
    
    // 🚨 ADD MISSING FIELDS: industryBreakdown, pillarBreakdown, recentAssessments
    const industryBreakdown = {};
    allAssessments.forEach(a => {
      const industry = a.industry || 'Not Specified';
      if (!industryBreakdown[industry]) {
        industryBreakdown[industry] = { count: 0, avgScore: 0, totalScore: 0 };
      }
      industryBreakdown[industry].count++;
      const score = calcAvgMaturity([a]);
      industryBreakdown[industry].totalScore += score;
      industryBreakdown[industry].avgScore = industryBreakdown[industry].totalScore / industryBreakdown[industry].count;
    });
    
    const pillarBreakdown = {};
    pillarIds.forEach(pillarId => {
      const pillarNames = {
        'platform_governance': 'Platform & Governance',
        'data_engineering': 'Data Engineering',
        'analytics_bi': 'Analytics & BI',
        'machine_learning': 'Machine Learning',
        'generative_ai': 'Generative AI',
        'operational_excellence': 'Operational Excellence'
      };
      const current = pillarMaturityCurrent[pillarIds.indexOf(pillarId)] || 0;
      const target = pillarMaturityTarget[pillarIds.indexOf(pillarId)] || 0;
      pillarBreakdown[pillarId] = {
        name: pillarNames[pillarId],
        avgCurrent: current,
        avgTarget: target,
        gap: target - current
      };
    });
    
    const recentAssessmentsFormatted = allAssessments
      .sort((a, b) => new Date(b.startedAt || b.createdAt) - new Date(a.startedAt || a.createdAt))
      .slice(0, 10)
      .map(a => {
        // Calculate completion time if assessment is completed
        let completionTime = null;
        if (a.completedAt || a.submittedAt) {
          const completed = new Date(a.completedAt || a.submittedAt);
          const started = new Date(a.startedAt || a.createdAt);
          const hours = (completed - started) / (1000 * 60 * 60);
          completionTime = hours > 0 ? parseFloat(hours.toFixed(1)) : 0.0;
        }
        
        return {
          id: a.id,
          organizationName: a.organizationName,
          industry: a.industry,
          status: a.status || 'in_progress',
          startedAt: a.startedAt || a.createdAt,
          completedAt: a.completedAt || a.submittedAt,
          overallScore: calcAvgMaturity([a]),
          completionTime // 🔥 FIX: Add completion time for Top Performers
        };
      });
    
    console.log('[Dashboard Stats] Calculations complete');
    
    res.json({
      success: true,
      data: {
        totalAssessments,
        totalAssessmentsTrend,
        completedAssessments: completedAssessments.length, // 🔥 FIX: Add completed assessments count
        activeCustomers,
        activeCustomersTrend,
        avgCompletionTime: avgCompletionTime > 0 ? avgCompletionTime.toFixed(1) : '0.0',
        avgCompletionTimeTrend,
        avgMaturityLevel: avgMaturityLevel > 0 ? avgMaturityLevel.toFixed(1) : '0.0',
        avgMaturityLevelTrend,
        avgImprovementPotential: avgImprovementPotential > 0 ? avgImprovementPotential.toFixed(1) : '0.0',
        avgImprovementPotentialTrend,
        feedbackNPS: calculateNPS(allAssessments),
        feedbackNPSTrend: calculateNPSTrend(allAssessments, recentAssessments, previousAssessments),
        npsBreakdown: getNPSBreakdown(allAssessments),
        avgMaturityByPillar: {
          current: pillarMaturityCurrent,
          target: pillarMaturityTarget
        },
        weeklyCompletions,
        customerPortfolio,
        fastest: fastest.length > 0 ? fastest : [{ name: 'No data', assessmentId: null, detail: 'Complete assessments to see data' }],
        improvement: improvementList.length > 0 ? improvementList : [{ name: 'No data', assessmentId: null, detail: 'Complete assessments to see data' }],
        stalled: stalled.length > 0 ? stalled : [{ name: 'No data', assessmentId: null, detail: 'All assessments completed' }],
        // 🚨 NEW FIELDS for frontend
        industryBreakdown: Object.entries(industryBreakdown).map(([industry, data]) => ({
          industry,
          count: data.count,
          avgScore: parseFloat(data.avgScore.toFixed(1))
        })),
        pillarBreakdown: Object.entries(pillarBreakdown).map(([pillar, data]) => ({
          pillar,
          name: data.name,
          avgScore: parseFloat((data.avgCurrent || 0).toString()),
          avgCurrent: parseFloat((data.avgCurrent || 0).toString()),
          avgTarget: parseFloat((data.avgTarget || 0).toString()),
          current: parseFloat((data.avgCurrent || 0).toString()),
          target: parseFloat((data.avgTarget || 0).toString()),
          gap: parseFloat(((data.avgTarget || 0) - (data.avgCurrent || 0)).toString()),
          count: allAssessments.length,
          avgGap: parseFloat(((data.avgTarget || 0) - (data.avgCurrent || 0)).toString())
        })),
        recentAssessments: recentAssessmentsFormatted
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
      error: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  res.json({
    status: 'ok',
    success: true,
    message: 'Databricks Maturity Assessment API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Feature database health check endpoint
app.get('/api/health/features-db', async (req, res) => {
  try {
    const health = await featureDB.healthCheck();
    res.json({
      success: true,
      data: health
    });
  } catch (error) {
    console.error('[API] Feature DB health check failed:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get latest features from database
app.get('/api/features/latest', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const features = await featureDB.getLatestFeatures(limit);
    res.json({
      success: true,
      data: features
    });
  } catch (error) {
    console.error('[API] Error fetching latest features:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Get all assessments (PostgreSQL only)
app.get('/api/assessments', requireAuth, async (req, res) => {
  try {
    console.log(`[GET /api/assessments] User: ${req.user.email}, Role: ${req.user.role}, ID: ${req.user.id}`);
    
    const assessmentRepo = require('./db/assessmentRepository');
    const userRepo = require('./db/userRepository');
    const currentUser = req.user;
    
    let assessmentsList = [];
    
    // Query PostgreSQL assessments with user info - filtered by role
    let pgAssessments;
    
    if (currentUser.role === 'admin') {
      // Admins see all assessments
      console.log('[GET /api/assessments] Fetching all assessments (admin)');
      pgAssessments = await assessmentRepo.findAll();
    } else if (currentUser.role === 'author') {
      console.log('[GET /api/assessments] Fetching author assessments from user_assignments');
      // Authors see: assessments they created OR are assigned to
      const authorAssessmentsQuery = await db.query(
        `SELECT DISTINCT a.* 
         FROM assessments a
         LEFT JOIN user_assignments ua ON a.id::text = ua.assessment_id::text
         WHERE a.user_id = $1 
           OR (ua.user_id = $1 AND ua.role = 'author' AND ua.status != 'cancelled')
         ORDER BY a.updated_at DESC`,
        [currentUser.id]
      );
      console.log(`[GET /api/assessments] Found ${authorAssessmentsQuery.rows.length} assessments for author`);
      
      // Map raw SQL results to proper format (snake_case to camelCase)
      pgAssessments = authorAssessmentsQuery.rows.map(row => {
        try {
          return {
            id: row.id,
            assessmentName: row.assessment_name,
            assessmentDescription: row.assessment_description,
            organizationName: row.organization_name,
            contactEmail: row.contact_email,
            industry: row.industry,
            status: row.status,
            progress: row.progress,
            currentCategory: row.current_category,
            completedCategories: row.completed_categories || [],
            responses: row.responses || {},
            editHistory: row.edit_history || [],
            startedAt: row.started_at,
            completedAt: row.completed_at,
            updatedAt: row.updated_at,
            createdAt: row.created_at,
            user_id: row.user_id,
          };
        } catch (mapError) {
          console.error('[GET /api/assessments] Error mapping row:', mapError, 'Row:', row);
          throw mapError;
        }
      });
    } else {
      // Consumers see ONLY assessments they're assigned to via user_assignments
      console.log('[GET /api/assessments] Fetching consumer assessments from user_assignments');
      const consumerAssessmentsQuery = await db.query(
        `SELECT DISTINCT a.* 
         FROM assessments a
         INNER JOIN user_assignments ua ON a.id::text = ua.assessment_id::text
         WHERE ua.user_id = $1 
           AND ua.role = 'consumer'
           AND ua.status != 'cancelled'
         ORDER BY a.updated_at DESC`,
        [currentUser.id]
      );
      console.log(`[GET /api/assessments] Found ${consumerAssessmentsQuery.rows.length} assigned assessments for consumer`);
      
      // Map raw SQL results to proper format (snake_case to camelCase)
      pgAssessments = consumerAssessmentsQuery.rows.map(row => {
        try {
          return {
            id: row.id,
            assessmentName: row.assessment_name,
            assessmentDescription: row.assessment_description,
            organizationName: row.organization_name,
            contactEmail: row.contact_email,
            industry: row.industry,
            status: row.status,
            progress: row.progress,
            currentCategory: row.current_category,
            completedCategories: row.completed_categories || [],
            responses: row.responses || {},
            editHistory: row.edit_history || [],
            startedAt: row.started_at,
            completedAt: row.completed_at,
            updatedAt: row.updated_at,
            createdAt: row.created_at,
            user_id: row.user_id,
          };
        } catch (mapError) {
          console.error('[GET /api/assessments] Error mapping row:', mapError, 'Row:', row);
          throw mapError;
        }
      });
    }
    
    console.log(`[GET /api/assessments] Processing ${pgAssessments.length} assessments`);
    console.log(`[GET /api/assessments] Processing ${pgAssessments.length} assessments`);
    
    for (const assessment of pgAssessments) {
      try {
        let creatorName = 'Unknown';
        const userId = assessment.user_id || assessment.userId;
        if (userId) {
          try {
            const user = await userRepo.findById(userId);
            if (user) {
              creatorName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email;
            }
          } catch (err) {
            console.warn('Could not fetch user:', err.message);
          }
        }
        
        assessmentsList.push({
          id: assessment.id,
          organization_name: assessment.organizationName || '',
          contact_email: assessment.contactEmail || '',
          contact_name: '',
          contact_role: '',
          industry: assessment.industry || '',
          assessment_name: assessment.assessmentName || 'Untitled Assessment',
          assessment_description: assessment.assessmentDescription || '',
          status: assessment.status || 'in_progress',
          started_at: assessment.startedAt,
          created_at: assessment.createdAt,
          updated_at: assessment.updatedAt,
          completed_at: assessment.completedAt,
          completedCategories: assessment.completedCategories || [],
          completed_categories: assessment.completedCategories || [],
          total_categories: assessmentFramework.assessmentAreas.length,
          progress: assessment.progress || 0,
          creator_name: creatorName,
          user_id: userId,
          results_released: assessment.results_released || false
        });
      } catch (itemError) {
        console.error('[GET /api/assessments] Error processing assessment:', itemError, 'Assessment ID:', assessment?.id);
        // Continue processing other assessments
      }
    }
    
    console.log(`✅ Fetched ${assessmentsList.length} assessments from PostgreSQL`);

    // Sort by most recent first
    assessmentsList.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    res.json({
      success: true,
      data: assessmentsList
    });
  } catch (error) {
    console.error('Error retrieving assessments:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving assessments',
      error: error.message
    });
  }
});

// Get single assessment by ID
app.get('/api/assessments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const assessmentRepo = require('./db/assessmentRepository');
    const assessment = await assessmentRepo.findById(id);
    
    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }

    const completedCats = assessment.completedCategories || [];
    const progress = Math.round((completedCats.length / assessmentFramework.assessmentAreas.length) * 100);

    res.json({
      success: true,
      assessment: {
        id: assessment.id,
        assessment_name: assessment.assessmentName || 'Untitled Assessment',
        assessment_description: assessment.assessmentDescription || '',
        organization_name: assessment.organizationName,
        contact_email: assessment.contactEmail,
        industry: assessment.industry,
        status: assessment.status,
        progress: progress,
        started_at: assessment.startedAt,
        created_at: assessment.createdAt || assessment.startedAt,
        completed_at: assessment.completedAt,
        responses: assessment.responses,
        completed_categories: completedCats
      }
    });
  } catch (error) {
    console.error('Error retrieving assessment:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving assessment',
      error: error.message
    });
  }
});

// Clone an existing assessment
app.post('/api/assessment/:id/clone', async (req, res) => {
  try {
    const { id } = req.params;
    const { organizationName, contactEmail, industry, assessmentName, assessmentDescription } = req.body;
    
    const assessmentRepo = require('./db/assessmentRepository');
    const originalAssessment = await assessmentRepo.findById(id);
    
    if (!originalAssessment) {
      return res.status(404).json({
        success: false,
        message: 'Original assessment not found'
      });
    }

    if (!assessmentName) {
      return res.status(400).json({
        success: false,
        message: 'Assessment name is required'
      });
    }

    // Create new assessment with cloned data
    const newAssessmentId = uuidv4();
    const completedCats = originalAssessment.completedCategories || [];
    const progress = Math.round((completedCats.length / 6) * 100);
    
    await assessmentRepo.create({
      id: newAssessmentId,
      assessmentName,
      assessmentDescription: assessmentDescription || '',
      organizationName: organizationName || originalAssessment.organizationName,
      contactEmail: contactEmail || originalAssessment.contactEmail,
      industry: industry || originalAssessment.industry,
      status: 'in_progress',
      progress: progress,
      currentCategory: originalAssessment.currentCategory,
      completedCategories: completedCats,
      responses: originalAssessment.responses || {},
      editHistory: [],
      startedAt: new Date().toISOString()
    });

    res.json({
      success: true,
      data: {
        assessmentId: newAssessmentId,
        originalId: id,
        organizationName: clonedAssessment.organizationName,
        assessmentName: clonedAssessment.assessmentName,
        assessmentDescription: clonedAssessment.assessmentDescription,
        completedCategories: clonedAssessment.completedCategories.length,
        totalCategories: assessmentFramework.assessmentAreas.length
      }
    });
  } catch (error) {
    console.error('Error cloning assessment:', error);
    res.status(500).json({
      success: false,
      message: 'Error cloning assessment',
      error: error.message
    });
  }
});

// Delete an assessment
// Delete all assessments
app.delete('/api/assessments/all', async (req, res) => {
  try {
    console.log('🗑️  Deleting all assessments...');
    
    const assessmentRepo = require('./db/assessmentRepository');
    const allAssessments = await assessmentRepo.findAll();
    const assessmentIds = allAssessments.map(a => a.id);
    
    console.log(`Found ${assessmentIds.length} assessments to delete`);
    
    // Delete each assessment
    let deletedCount = 0;
    for (const id of assessmentIds) {
      try {
        await assessmentRepo.delete(id);
        deletedCount++;
      } catch (error) {
        console.error(`Failed to delete assessment ${id}:`, error);
      }
    }
    
    console.log(`✅ Successfully deleted ${deletedCount} assessments`);

    res.json({
      success: true,
      message: `Successfully deleted ${deletedCount} assessment(s)`,
      deletedCount
    });
  } catch (error) {
    console.error('Error deleting all assessments:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting all assessments',
      error: error.message
    });
  }
});

// Delete individual assessment
app.delete('/api/assessment/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const assessmentRepo = require('./db/assessmentRepository');
    const assessment = await assessmentRepo.findById(id);
    
    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }

    await assessmentRepo.delete(id);

    res.json({
      success: true,
      message: 'Assessment deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting assessment:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting assessment',
      error: error.message
    });
  }
});

// Get pillar-specific ADAPTIVE results (uses all inputs + latest features)
app.get('/api/assessment/:id/pillar/:pillarId/results', async (req, res) => {
  try {
    // CRITICAL: Prevent caching of dynamic pillar results
    res.set({
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Surrogate-Control': 'no-store'
    });

    const { id, pillarId } = req.params;
    const assessmentRepo = require('./db/assessmentRepository');
    const assessment = await assessmentRepo.findById(id);

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }

    // DEBUG: Log what we retrieved for pillar
    console.log('🔍 Pillar endpoint - Retrieved assessment:', id);
    console.log('🔍 Assessment.responses type:', typeof assessment.responses);
    console.log('🔍 Assessment.responses null/undefined?:', assessment.responses === null || assessment.responses === undefined);

    // FIX: Ensure responses exists and is an object
    if (!assessment.responses || typeof assessment.responses !== 'object') {
      console.warn('⚠️  WARNING: Assessment responses is null/undefined or not an object! Initializing to empty object.');
      assessment.responses = {};
    }

    // Find the specific pillar
    const pillar = assessmentFramework.assessmentAreas.find(area => area.id === pillarId);
    if (!pillar) {
      return res.status(404).json({
        success: false,
        message: 'Pillar not found'
      });
    }

    // Check if this pillar has responses (don't require it to be "completed")
    const pillarResponses = Object.keys(assessment.responses || {}).filter(key => {
      if (key.includes('_comment') || key.includes('_skipped')) return false;
      // Check if this response belongs to this pillar
      const pillarQuestions = pillar.dimensions.flatMap(d => d.questions).map(q => q.id);
      const questionId = key.split('_current_state')[0].split('_future_state')[0].split('_technical_pain')[0].split('_business_pain')[0];
      return pillarQuestions.includes(questionId);
    });
    
    if (pillarResponses.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No responses found for this pillar yet. Please answer some questions first.'
      });
    }
    
    console.log(`Found ${pillarResponses.length} responses for pillar ${pillarId}`);

    console.log(`🤖 Generating content using OpenAI for pillar: ${pillarId}`);
    console.log('Sending ALL assessment data for this pillar to OpenAI');

    // Use OpenAI to generate fresh content for this specific pillar
    let pillarResults = await openAIContentGenerator.generateAssessmentContent(assessment, pillarId);

    console.log('✅ OpenAI pillar content generation completed:', pillarId);

    // Extract scores from the pillar results
    const currentScore = pillarResults.pillar.currentScore || 0;
    const futureScore = pillarResults.pillar.futureScore || 0;
    const gap = pillarResults.pillar.gap || 0;
    
    // 🎯 ENHANCE with real Databricks product features
    console.log(`🔧 Enhancing pillar ${pillarId} with actual Databricks features...`);
    try {
      const databricksRecs = DatabricksFeatureMapper.getRecommendationsForPillar(
        pillarId,
        Math.round(currentScore),
        assessment.responses
      );
      
      // Add Databricks features to pillar results
      pillarResults.databricksFeatures = databricksRecs.currentMaturity?.features || [];
      pillarResults.nextLevelFeatures = databricksRecs.nextLevel?.features || [];
      pillarResults.quickWins = databricksRecs.quickWins || [];
      pillarResults.strategicMoves = databricksRecs.strategicMoves || [];
      pillarResults.specificRecommendations = databricksRecs.quickWins || []; // Use quickWins for "Next Steps" (customer engagement)
      pillarResults._source = 'Databricks Release Notes - October 2025';
      pillarResults._docsUrl = 'https://docs.databricks.com/aws/en/release-notes/product/';
      
      console.log(`✅ Enhanced pillar ${pillarId} with ${pillarResults.databricksFeatures.length} Databricks features`);
    } catch (error) {
      console.error('⚠️  Error enhancing pillar with Databricks features:', error);
      pillarResults.databricksFeatures = [];
    }
    
    // 🔥 INTELLIGENT RECOMMENDATIONS: Generate customer-specific, actionable solutions (NOW WITH DATABASE! 🚀)
    console.log(`🧠 Generating intelligent recommendations for pillar ${pillarId}...`);
    try {
      const intelligentEngine = new IntelligentRecommendationEngine();
      const intelligentRecs = await intelligentEngine.generateRecommendations(
        assessment,
        pillarId,
        pillar // Pass the pillar framework structure
      );
      
      console.log(`✅ Generated ${intelligentRecs.recommendations.length} intelligent recommendations`);
      console.log(`✅ Generated ${intelligentRecs.nextSteps.length} customer-specific next steps`);
      console.log(`✅ Identified ${intelligentRecs.theGood.length} strengths and ${intelligentRecs.theBad.length} challenges`);
      
      // Replace with intelligent, customer-specific recommendations
      if (intelligentRecs.theGood.length > 0) {
        pillarResults.theGood = intelligentRecs.theGood;
      }
      if (intelligentRecs.theBad.length > 0) {
        pillarResults.theBad = intelligentRecs.theBad;
      }
      if (intelligentRecs.recommendations.length > 0) {
        pillarResults.recommendations = intelligentRecs.recommendations;
      }
      if (intelligentRecs.nextSteps.length > 0) {
        pillarResults.specificRecommendations = intelligentRecs.nextSteps;
        pillarResults.quickWins = intelligentRecs.nextSteps;
      }
      if (intelligentRecs.databricksFeatures.length > 0) {
        pillarResults.databricksFeatures = intelligentRecs.databricksFeatures;
      }
      
      pillarResults._intelligentEngine = true;
      pillarResults._painPointsAnalyzed = intelligentRecs.theBad.length;
      pillarResults._strengthsIdentified = intelligentRecs.theGood.length;
    } catch (error) {
      console.error('⚠️  Error in intelligent recommendation generation:', error);
    }
    
    // Use pillar details from OpenAI
    const pillarDetails = {
      id: pillar.id,
      name: pillar.name,
      description: pillar.description,
      score: Math.round(currentScore),
      currentScore: Math.round(currentScore),
      futureScore: Math.round(futureScore),
      gap: Math.round(gap),
      maturityLevel: pillarResults.pillar.level,
      dimensionsCompleted: pillar.dimensions.length,
      questionsAnswered: pillar.dimensions.reduce((total, dim) => total + (dim.questions?.length || 0), 0)
    };

    res.json({
      success: true,
      pillarDetails,
      summary: pillarResults.summary || '',
      // 🎯 Context-aware strengths and challenges
      theGood: pillarResults.theGood || [],
      theBad: pillarResults.theBad || [],
      recommendations: pillarResults.recommendations || [],
      // NEW: Databricks-specific features
      databricksFeatures: pillarResults.databricksFeatures || [],
      nextLevelFeatures: pillarResults.nextLevelFeatures || [],
      quickWins: pillarResults.quickWins || [],
      strategicMoves: pillarResults.strategicMoves || [],
      specificRecommendations: pillarResults.specificRecommendations || [],
      _source: pillarResults._source || null,
      _docsUrl: pillarResults._docsUrl || null,
      // Original fields
      painPointRecommendations: pillarResults.painPointRecommendations || [],
      gapBasedActions: pillarResults.gapBasedActions || [],
      commentBasedInsights: pillarResults.commentBasedInsights || [],
      prioritizedActions: pillarResults.recommendations || [],
      assessmentId: id,
      pillarId,
      generatedAt: new Date().toISOString(),
      isPillarSpecific: true,
      _engineType: 'openai',
      _contentSource: 'openai-generated'
    });
  } catch (error) {
    console.error('❌ Error generating pillar results:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Error generating pillar results',
      error: error.message
    });
  }
});

// Debug endpoint to manually complete an assessment for testing
app.post('/api/assessment/:id/debug/complete', async (req, res) => {
  try {
    const { id } = req.params;
    const assessmentRepo = require('./db/assessmentRepository');
    const assessment = await assessmentRepo.findById(id);

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }

    const updateData = {};
    const currentResponses = assessment.responses || {};
    
    // Add some sample responses if none exist
    if (Object.keys(currentResponses).length === 0) {
      updateData.responses = {
        'env_standardization_current_state': 3,
        'env_standardization_future_state': 4,
        'scaling_effectiveness_current_state': 2,
        'scaling_effectiveness_future_state': 5
      };
    }

    // Mark all categories as completed
    updateData.completedCategories = assessmentFramework.assessmentAreas.map(a => a.id);
    updateData.status = 'completed';
    updateData.progress = 100;
    updateData.completedAt = new Date().toISOString();
    
    await assessmentRepo.update(id, updateData);

    res.json({
      success: true,
      message: 'Assessment marked as completed for testing',
      data: {
        status: assessment.status,
        completedCategories: assessment.completedCategories.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error completing assessment',
      error: error.message
    });
  }
});

// Create new assessment
app.post('/api/assessment', requireAuth, async (req, res) => {
  try {
    const { organizationName, industry, contactEmail, assessmentName } = req.body;
    
    if (!organizationName || !assessmentName) {
      return res.status(400).json({
        success: false,
        message: 'Organization name and assessment name are required'
      });
    }
    
    const assessmentRepo = require('./db/assessmentRepository');
    const newId = `assessment_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    await assessmentRepo.create({
      id: newId,
      assessmentName,
      assessmentDescription: '',
      organizationName,
      contactEmail: contactEmail || '',
      industry: industry || '',
      status: 'in_progress',
      progress: 0,
      currentCategory: null,
      completedCategories: [],
      responses: {},
      editHistory: [],
      startedAt: new Date().toISOString(),
      userId: req.user.id  // Set the creator's user ID
    });
    
    console.log(`✅ New assessment created: ${newId} (${assessmentName})`);
    
    res.json({
      success: true,
      message: 'Assessment created successfully',
      id: newId,
      assessmentName: assessmentName,
      organizationName: organizationName
    });
  } catch (error) {
    console.error('❌ Error creating assessment:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating assessment',
      error: error.message
    });
  }
});

// Generate sample assessment with random realistic data
app.post('/api/assessment/generate-sample', requireAuth, async (req, res) => {
  try {
    const { completionLevel = 'full', specificPillars = null } = req.body;
    
    console.log(`🎲 Generating sample assessment with completion level: ${completionLevel} for user: ${req.user.email}`);
    
    // Generate sample assessment
    const sampleAssessment = sampleAssessmentGenerator.generateSampleAssessment({
      completionLevel,
      specificPillars
    });
    
    // Save to PostgreSQL
    const assessmentRepo = require('./db/assessmentRepository');
    await assessmentRepo.create({
      id: sampleAssessment.id,
      assessmentName: sampleAssessment.assessmentName,
      assessmentDescription: sampleAssessment.assessmentDescription || '',
      organizationName: sampleAssessment.organizationName,
      contactEmail: sampleAssessment.contactEmail,
      industry: sampleAssessment.industry,
      status: sampleAssessment.status,
      progress: sampleAssessment.progress || Math.round((sampleAssessment.completedCategories.length / 6) * 100),
      currentCategory: sampleAssessment.currentCategory || null,
      completedCategories: sampleAssessment.completedCategories,
      responses: sampleAssessment.responses,
      editHistory: sampleAssessment.editHistory || [],
      startedAt: sampleAssessment.startedAt || new Date().toISOString(),
      userId: req.user.id  // Set the creator's user ID
    });
    
    console.log(`✅ Sample assessment created in PostgreSQL: ${sampleAssessment.id} (${sampleAssessment.assessmentName})`);
    console.log(`   Completed pillars: ${sampleAssessment.completedCategories.length}/6`);
    console.log(`   Total responses: ${Object.keys(sampleAssessment.responses).length}`);
    
    res.json({
      success: true,
      message: 'Sample assessment generated successfully',
      assessment: {
        id: sampleAssessment.id,
        assessmentName: sampleAssessment.assessmentName,
        organizationName: sampleAssessment.organizationName,
        industry: sampleAssessment.industry,
        contactEmail: sampleAssessment.contactEmail,
        editorEmail: sampleAssessment.editorEmail,
        assessmentDescription: sampleAssessment.assessmentDescription,
        status: sampleAssessment.status,
        completedCategories: sampleAssessment.completedCategories,
        responses: sampleAssessment.responses,  // Include responses for validation
        totalResponses: Object.keys(sampleAssessment.responses).length
      }
    });
  } catch (error) {
    console.error('❌ Error generating sample assessment:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating sample assessment',
      error: error.message
    });
  }
});

// ============================================
// AUDIT TRAIL ENDPOINTS
// ============================================

// Get audit trail for an assessment
app.get('/api/assessment/:id/audit-trail', async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 100, offset = 0 } = req.query;
    
    const assessmentRepo = require('./db/assessmentRepository');
    const assessment = await assessmentRepo.findById(id);
    
    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }
    
    // Build audit trail from edit_history and responses
    const auditEvents = [];
    
    // 1. Assessment creation event
    auditEvents.push({
      id: 'event_created',
      eventType: 'assessment_created',
      timestamp: assessment.startedAt || assessment.createdAt,
      userEmail: assessment.contactEmail,
      userName: assessment.contactName || 'System',
      changes: {
        assessmentName: { to: assessment.assessmentName },
        organizationName: { to: assessment.organizationName },
        industry: { to: assessment.industry }
      },
      impact: {
        reportCreated: true,
        dashboardAvailable: false
      },
      afterSnapshot: {
        status: 'in_progress',
        progress: 0,
        completedCategories: [],
        responseCount: 0
      }
    });
    
    // 2. Add events from edit_history
    if (assessment.editHistory && Array.isArray(assessment.editHistory)) {
      assessment.editHistory.forEach((edit, index) => {
        auditEvents.push({
          id: `event_edit_${index}`,
          eventType: 'metadata_updated',
          timestamp: edit.timestamp,
          userEmail: edit.editorEmail || edit.editor || assessment.contactEmail,
          userName: edit.editorName || 'User',
          changes: edit.changes || {},
          impact: {
            reportHeaderChanged: !!(edit.changes.organizationName || edit.changes.assessmentName),
            benchmarkingChanged: !!edit.changes.industry
          }
        });
      });
    }
    
    // 3. Track response changes (group by pillar completion)
    const responsesByPillar = {};
    Object.keys(assessment.responses || {}).forEach(key => {
      if (key.includes('_skipped') || key.includes('_comment')) return;
      
      // Extract pillar from question ID
      const questionId = key.split('_current_state')[0].split('_future_state')[0].split('_technical_pain')[0].split('_business_pain')[0];
      const pillar = assessmentFramework.assessmentAreas.find(area => 
        area.dimensions.some(dim => 
          dim.questions.some(q => q.id === questionId)
        )
      );
      
      if (pillar) {
        if (!responsesByPillar[pillar.id]) {
          responsesByPillar[pillar.id] = {
            pillarName: pillar.name,
            responses: []
          };
        }
        responsesByPillar[pillar.id].responses.push(key);
      }
    });
    
    // 4. Add pillar completion events
    (assessment.completedCategories || []).forEach((pillarId, index) => {
      const pillar = assessmentFramework.assessmentAreas.find(a => a.id === pillarId);
      const pillarData = responsesByPillar[pillarId] || { responses: [] };
      
      auditEvents.push({
        id: `event_pillar_${pillarId}`,
        eventType: 'pillar_completed',
        timestamp: assessment.lastModified || assessment.updatedAt || assessment.startedAt,
        userEmail: assessment.lastEditor || assessment.contactEmail,
        userName: assessment.lastEditorName || 'User',
        changes: {
          completedCategories: {
            from: index,
            to: index + 1
          },
          pillar: {
            id: pillarId,
            name: pillar?.name || pillarId
          }
        },
        impact: {
          maturityScoreChanged: true,
          recommendationsChanged: true,
          executiveSummaryChanged: true,
          strategicRoadmapChanged: true,
          pillarResultsAvailable: true
        },
        afterSnapshot: {
          progress: Math.round(((index + 1) / assessmentFramework.assessmentAreas.length) * 100),
          completedCategories: assessment.completedCategories.slice(0, index + 1),
          responseCount: pillarData.responses.length
        }
      });
    });
    
    // 5. Assessment completion event
    if (assessment.status === 'completed' && assessment.completedAt) {
      auditEvents.push({
        id: 'event_completed',
        eventType: 'assessment_completed',
        timestamp: assessment.completedAt,
        userEmail: assessment.lastEditor || assessment.contactEmail,
        userName: assessment.lastEditorName || 'User',
        changes: {
          status: {
            from: 'in_progress',
            to: 'completed'
          }
        },
        impact: {
          fullReportAvailable: true,
          executiveCommandCenterAvailable: true,
          benchmarkingAvailable: true,
          exportAvailable: true
        },
        afterSnapshot: {
          status: 'completed',
          progress: 100,
          completedCategories: assessment.completedCategories,
          responseCount: Object.keys(assessment.responses || {}).filter(k => !k.includes('_skipped') && !k.includes('_comment')).length
        }
      });
    }
    
    // Sort by timestamp (newest first)
    auditEvents.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Apply pagination
    const paginatedEvents = auditEvents.slice(parseInt(offset), parseInt(offset) + parseInt(limit));
    
    res.json({
      success: true,
      data: {
        assessmentId: id,
        assessmentName: assessment.assessmentName,
        organizationName: assessment.organizationName,
        totalEvents: auditEvents.length,
        events: paginatedEvents,
        summary: {
          created: assessment.startedAt,
          lastModified: assessment.lastModified || assessment.updatedAt,
          completed: assessment.completedAt,
          totalEditors: [...new Set(auditEvents.map(e => e.userEmail).filter(Boolean))].length,
          pillarsCompleted: assessment.completedCategories?.length || 0,
          totalPillars: assessmentFramework.assessmentAreas.length,
          responseCount: Object.keys(assessment.responses || {}).filter(k => !k.includes('_skipped') && !k.includes('_comment')).length
        }
      }
    });
  } catch (error) {
    console.error('Error retrieving audit trail:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving audit trail',
      error: error.message
    });
  }
});

// Add audit event (for manual tracking or future use)
app.post('/api/assessment/:id/audit-event', async (req, res) => {
  try {
    const { id } = req.params;
    const { eventType, userEmail, userName, changes, metadata } = req.body;
    
    const assessmentRepo = require('./db/assessmentRepository');
    const assessment = await assessmentRepo.findById(id);
    
    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }
    
    // Add event to edit history
    const editHistory = assessment.editHistory || [];
    editHistory.push({
      timestamp: new Date().toISOString(),
      eventType,
      editorEmail: userEmail,
      editorName: userName,
      changes: changes || {},
      metadata: metadata || {}
    });
    
    // Save assessment
    await assessmentRepo.update(id, { editHistory });
    
    res.json({
      success: true,
      message: 'Audit event recorded'
    });
  } catch (error) {
    console.error('Error recording audit event:', error);
    res.status(500).json({
      success: false,
      message: 'Error recording audit event',
      error: error.message
    });
  }
});

// Serve React app for all non-API routes in production
if (process.env.NODE_ENV === 'production') {
  // Serve static files (JS, CSS, images, manifest.json, etc.) - must be BEFORE catch-all
  app.use(express.static(path.join(__dirname, '../client/build'), {
    setHeaders: (res, filePath) => {
      // Set proper content types
      if (filePath.endsWith('.json')) {
        res.setHeader('Content-Type', 'application/json');
      }
    }
  }));
  
  // Catch-all handler for non-API routes - must be LAST
  app.get('*', async (req, res) => {
    const indexPath = path.join(__dirname, '../client/build', 'index.html');
    console.log(`Serving index.html from: ${indexPath}`);
    res.sendFile(indexPath, (err) => {
      if (err) {
        console.error('Error serving index.html:', err);
        res.status(500).send('Error loading application');
      }
    });
  });
}

// Start server (only if not in serverless environment)
if (process.env.VERCEL !== '1') {
  // Initialize database connection BEFORE starting the server
  const db = require('./db/connection');
  
  (async () => {
    await db.initialize();
    
    app.listen(PORT, async () => {
      console.log(`🚀 Databricks Maturity Assessment API running on port ${PORT}`);
      console.log(`📊 Assessment framework loaded with ${assessmentFramework.assessmentAreas.length} areas`);
      
      // Get assessment count asynchronously
      try {
        const assessmentRepo = require('./db/assessmentRepository');
        const count = await assessmentRepo.count();
        console.log(`💾 ${count} assessment(s) in PostgreSQL database`);
      } catch (error) {
        console.log(`💾 Assessment storage initialized (count unavailable)`);
      }
      
      console.log(`🔗 API Health Check: http://localhost:${PORT}/api/health`);
    });
  })();
}

module.exports = app;





