const { v4: uuidv4 } = require('uuid');
const assessmentFramework = require('../data/assessmentFramework');

/**
 * Generate a sample assessment with random realistic responses
 */
class SampleAssessmentGenerator {
  constructor() {
    // Diverse, realistic company names across different industries
    this.companyNames = [
      // Technology Companies
      'Nexus Technologies', 'DataStream Solutions', 'CloudFirst Innovations', 
      'Quantum Analytics Corp', 'ByteForge Systems', 'Synapse AI Labs',
      'TechNova Enterprises', 'CoreLogic Software', 'InfraScale Global',
      
      // Financial Services
      'Silverline Financial Group', 'Apex Capital Management', 'TrustBank Corporation',
      'Summit Investment Partners', 'Heritage Credit Union', 'Pinnacle Asset Management',
      
      // Healthcare & Life Sciences
      'MedTech Innovations', 'HealthBridge Systems', 'BioGenesis Research',
      'CareFirst Medical Group', 'LifeScience Analytics', 'Wellness Data Corp',
      
      // Retail & E-commerce
      'GlobalMart Retail', 'ShopSphere Digital', 'NextGen Commerce',
      'PrimeLine Distributors', 'MarketPlace Ventures', 'Urban Retail Group',
      
      // Manufacturing & Industrial
      'Precision Manufacturing Inc', 'Industrial IoT Solutions', 'SmartFactory Systems',
      'AutomationFirst Corp', 'Advanced Materials Group', 'PowerGrid Industries',
      
      // Media & Entertainment
      'StreamVision Media', 'Digital Content Studios', 'MediaHub Networks',
      'ContentFirst Productions', 'NextWave Entertainment', 'BroadcastPro Systems',
      
      // Telecommunications
      'TeleConnect Global', 'NetworkEdge Communications', 'FiberLink Technologies',
      'MobileFirst Networks', 'ConnectPlus Telecom', 'DataWave Communications',
      
      // Energy & Utilities
      'GreenPower Energy', 'SmartGrid Solutions', 'RenewEnergy Corp',
      'PowerGen Utilities', 'CleanTech Energy Group', 'EcoGrid Systems',
      
      // Transportation & Logistics
      'LogiChain Solutions', 'FastTrack Logistics', 'TransGlobal Shipping',
      'RouteOptimize Systems', 'SupplyChain Innovations', 'FleetManage Pro',
      
      // Government & Public Sector
      'Metro Government Services', 'Public Safety Systems', 'CityTech Solutions',
      'StateWide Data Initiative', 'GovCloud Services', 'Municipal Analytics Group'
    ];
    
    // More specific, realistic industries
    this.industries = [
      'Technology & Software', 
      'Financial Services & Banking', 
      'Healthcare & Life Sciences', 
      'Retail & E-commerce', 
      'Manufacturing & Industrial',
      'Telecommunications', 
      'Energy & Utilities', 
      'Media & Entertainment',
      'Transportation & Logistics',
      'Insurance',
      'Pharmaceuticals',
      'Government & Public Sector',
      'Education',
      'Professional Services',
      'Hospitality & Travel'
    ];
    
    // More varied assessment purposes
    this.assessmentDescriptions = [
      'Q4 2025 data platform maturity assessment for board presentation',
      'Cloud migration readiness evaluation - Phase 2',
      'Annual Databricks optimization and cost analysis review',
      'Post-merger data integration capability assessment',
      'GenAI readiness and ML platform evaluation',
      'Regulatory compliance and data governance audit',
      'Enterprise data strategy roadmap development',
      'Digital transformation initiative - data workstream',
      'Data lake modernization feasibility study',
      'Real-time analytics capability assessment'
    ];
    
    this.painPointProbabilities = {
      technical_pain: 0.6, // 60% chance of selecting each technical pain point
      business_pain: 0.5   // 50% chance of selecting each business pain point
    };
  }

  /**
   * Get random integer between min and max (inclusive)
   */
  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Get random item from array
   */
  randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * Get random boolean based on probability
   */
  randomBool(probability = 0.5) {
    return Math.random() < probability;
  }

  /**
   * Generate realistic current and future state values
   * Current state: Only 1, 2, or 3 (never 4 or 5) - organizations seeking modernization
   * Future state: Always +1 or +2 higher than current (shows improvement goal)
   */
  generateMaturityPair() {
    // Current state: Only 1, 2, or 3 (representing organizations that need modernization)
    // Weighted distribution: 20% level 1, 50% level 2, 30% level 3
    const rand = Math.random();
    let currentState;
    
    if (rand < 0.20) {
      currentState = 1; // 20% - Explore (ad-hoc)
    } else if (rand < 0.70) {
      currentState = 2; // 50% - Experiment (repeatable)
    } else {
      currentState = 3; // 30% - Formalize (defined processes)
    }

    // Future state: Always +1 or +2 levels higher (showing improvement ambition)
    const gap = this.randomInt(1, 2); // Gap is 1 or 2 levels (never 0)
    const futureState = Math.min(5, currentState + gap);

    return { currentState, futureState };
  }

  /**
   * Generate realistic, tool-specific comment describing current legacy solutions
   * Highlights specific tools, metrics, and pain points to identify modernization opportunities
   */
  generateComment(question, currentState, futureState, pillarId, dimensionName) {
    // Legacy tools and systems by pillar
    const legacyToolLibrary = {
      platform_governance: {
        tools: ['manual Excel spreadsheets', 'legacy IAM', 'custom Python scripts', 'shared service accounts', 'Terraform', 'Azure DevOps'],
        metrics: ['150+ service accounts', '50+ access requests weekly', '20+ environments', '500+ users', '30+ workspaces', '200+ manual policies'],
        problems: ['security gaps', 'compliance risks', 'audit failures', 'access sprawl', 'no lineage tracking', 'cost overruns']
      },
      data_engineering: {
        tools: ['Informatica PowerCenter', 'Azure Data Factory', 'SSIS', 'Talend', 'FiveTran', 'Airflow', 'Glue jobs', 'DBT', 'stored procedures', 'Stitch'],
        metrics: ['200+ Informatica mappings', '150+ ADF pipelines', '80+ SSIS packages', '100+ Glue jobs', '50+ Airflow DAGs', '300+ DBT models', '5TB daily ingestion', '20+ source systems'],
        problems: ['frequent pipeline failures', 'schema drift issues', 'slow processing', 'high maintenance burden', 'vendor lock-in', '$200K+ annual licensing', 'no monitoring', 'manual deployments']
      },
      analytics_bi: {
        tools: ['Tableau', 'Power BI', 'Snowflake', 'Redshift', 'Oracle', 'SQL Server', 'Looker', 'Excel reports', 'Qlik', 'MicroStrategy'],
        metrics: ['100+ Tableau dashboards', '200+ Power BI reports', '50+ data marts', '500+ queries daily', '1000+ business users', '10TB Snowflake warehouse', '$40K monthly Snowflake costs', '30+ data sources'],
        problems: ['slow queries (5+ min)', 'dashboard sprawl', 'inconsistent metrics', 'exploding costs', 'no self-service', 'data silos', 'manual refreshes', 'poor performance']
      },
      machine_learning: {
        tools: ['SageMaker', 'Jupyter notebooks', 'Azure ML', 'on-prem Python', 'Excel models', 'R scripts', 'SAS', 'custom Flask APIs', 'MLflow OSS'],
        metrics: ['50+ ML models', '30+ scattered Jupyter notebooks', '20+ SageMaker endpoints', '100+ untracked experiments', '10+ data scientists', '15+ model versions', '200GB model artifacts'],
        problems: ['no experiment tracking', 'manual deployment', 'version chaos', 'zero monitoring', 'model drift undetected', 'slow iteration cycles', 'siloed work', '3-week deployment delays']
      },
      generative_ai: {
        tools: ['OpenAI API', 'Azure OpenAI', 'custom LLM wrappers', 'Pinecone', 'Chroma', 'LangChain', 'Hugging Face', 'AWS Bedrock'],
        metrics: ['10+ GenAI pilots', '50+ unmanaged API keys', '20+ prompt templates', '5+ use cases', '100K+ API calls monthly', '$10K+ monthly LLM costs', '3+ vector databases'],
        problems: ['no governance', 'cost explosion', 'security vulnerabilities', 'hallucinations', 'no evaluation framework', 'compliance gaps', 'siloed experiments', 'zero ROI tracking']
      },
      operational_excellence: {
        tools: ['CloudWatch', 'DataDog', 'Splunk', 'manual log analysis', 'Excel cost tracking', 'email alerts', 'Grafana', 'PagerDuty', 'New Relic'],
        metrics: ['500+ CloudWatch alarms', '20+ monitoring dashboards', '100GB+ logs daily', '50+ false alerts weekly', '$50K+ monthly cloud spend', '10+ disconnected tools', '30+ on-call engineers'],
        problems: ['alert fatigue', 'no cost attribution', 'reactive firefighting', 'manual investigation', 'siloed metrics', 'hidden costs', 'poor visibility', '2+ hour MTTR']
      }
    };
    
    // Get pillar-specific context
    const pillarTools = legacyToolLibrary[pillarId] || legacyToolLibrary.operational_excellence;
    
    // Select 1-2 random legacy tools and metrics
    const tool1 = this.randomChoice(pillarTools.tools);
    const tool2 = this.randomChoice(pillarTools.tools.filter(t => t !== tool1));
    const metric = this.randomChoice(pillarTools.metrics);
    const problem = this.randomChoice(pillarTools.problems);
    
    // Detailed comment templates describing current legacy state
    const commentTemplates = [
      `Currently using ${tool1} to handle this. We maintain ${metric} which is becoming unmanageable. Major pain points: ${problem}, blocking our ability to innovate. Team spends 50%+ time on maintenance vs building new capabilities.`,
      
      `We rely on ${tool1} and ${tool2} for this today. Managing ${metric} manually with significant ${problem}. Looking to modernize - current licensing costs $150K/year plus operational overhead.`,
      
      `Legacy ${tool1} environment is hurting productivity. We have ${metric} with constant ${problem}. Our data engineering team wastes 60% of time troubleshooting instead of delivering value. Need to consolidate to Databricks.`,
      
      `Running outdated ${tool1} with ${metric}. System performance degrading - experiencing ${problem} weekly. Maintenance window growing, business getting frustrated. Evaluating Databricks for 10x improvement.`,
      
      `Stuck on ${tool1} managing ${metric}. Critical issues: ${problem}, high TCO ($200K+ annually), vendor limitations. Business approved migration to modern Lakehouse - targeting 50% cost reduction.`,
      
      `Current setup: ${tool1} + ${tool2} with ${metric}. ${problem} causing SLA breaches and business impact. CTO pushing for unified platform - Databricks POC approved for Q1 2026.`,
      
      `Maintaining ${metric} across fragmented ${tool1} infrastructure. Daily ${problem} requiring manual intervention. Team morale low due to technical debt. Executive mandate to modernize platform.`,
      
      `Operations bottleneck with ${tool1} - managing ${metric}. ${problem} limiting our competitive advantage. Cannot support real-time use cases or ML workloads with current architecture.`,
      
      `Multi-vendor cost spiral: ${tool1} ($120K/year), Snowflake warehouse ($40K/month), ${tool2} licenses ($80K/year). Total: $600K+ annually. Plus ${metric} and ${problem}. ROI case for Databricks consolidation approved.`,
      
      `Painful fragmentation: ${tool1} for ingestion, Snowflake for storage, ${tool2} for transformation. ${metric} scattered across tools. ${problem} due to lack of integration. Need unified Lakehouse platform.`,
      
      `Technical debt accumulating with ${tool1}. We have ${metric} that nobody wants to touch. ${problem} becoming existential risk. Board asking why we can't do real-time analytics like competitors.`,
      
      `Currently on ${tool1} which lacks modern capabilities. ${metric} managed through manual processes and scripts. ${problem} preventing us from adopting GenAI and advanced analytics. Migration planning underway.`
    ];
    
    return this.randomChoice(commentTemplates);
  }

  /**
   * Generate responses for a single question
   */
  generateQuestionResponses(question, pillarId, dimensionName) {
    const responses = {};
    const { currentState, futureState } = this.generateMaturityPair();
    
    // Generate responses for each perspective
    question.perspectives.forEach(perspective => {
      const responseKey = `${question.id}_${perspective.id}`;
      
      if (perspective.id === 'current_state') {
        responses[responseKey] = currentState;
      } else if (perspective.id === 'future_state') {
        responses[responseKey] = futureState;
      } else if (perspective.id === 'technical_pain') {
        // Select 0-3 pain points randomly
        const selectedPains = perspective.options
          .filter(() => this.randomBool(this.painPointProbabilities.technical_pain))
          .map(opt => opt.value);
        if (selectedPains.length > 0) {
          responses[responseKey] = selectedPains;
        }
      } else if (perspective.id === 'business_pain') {
        // Select 0-3 pain points randomly
        const selectedPains = perspective.options
          .filter(() => this.randomBool(this.painPointProbabilities.business_pain))
          .map(opt => opt.value);
        if (selectedPains.length > 0) {
          responses[responseKey] = selectedPains;
        }
      }
    });
    
    // Add comment (90% of the time) - describing current legacy tools and pain points
    if (this.randomBool(0.9)) {
      const comment = this.generateComment(question, currentState, futureState, pillarId, dimensionName);
      if (comment) {
        responses[`${question.id}_comment`] = comment;
      }
    }
    
    return responses;
  }

  /**
   * Generate a complete sample assessment
   * @param {Object} options - Generation options
   * @param {string} options.completionLevel - 'full', 'partial', or 'minimal'
   * @param {string[]} options.specificPillars - Array of pillar IDs to complete (optional)
   * @returns {Object} Complete assessment object
   */
  generateSampleAssessment(options = {}) {
    const {
      completionLevel = 'full', // 'full', 'partial', 'minimal'
      specificPillars = null
    } = options;

    const assessmentId = uuidv4();
    const companyName = this.randomChoice(this.companyNames);
    const industry = this.randomChoice(this.industries);
    const description = this.randomChoice(this.assessmentDescriptions);
    
    // Generate realistic company domain (remove special chars, handle spaces)
    const companyDomain = companyName.toLowerCase()
      .replace(/corporation|corp|inc|ltd|llc|group|enterprises|systems|solutions|services|technologies|global/gi, '')
      .replace(/[^a-z0-9]/g, '')
      .trim();
    
    // Varied email formats
    const emailFormats = [
      `contact@${companyDomain}.com`,
      `info@${companyDomain}.com`,
      `data-team@${companyDomain}.com`,
      `analytics@${companyDomain}.com`,
      `platform-team@${companyDomain}.com`,
      `assessment@${companyDomain}.com`
    ];
    const contactEmail = this.randomChoice(emailFormats);
    
    // More realistic assessment names with context
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    const currentMonth = months[new Date().getMonth()];
    const currentYear = new Date().getFullYear();
    
    const nameFormats = [
      `${companyName} - ${currentMonth} ${currentYear} Maturity Assessment`,
      `${companyName} Data Platform Assessment - Q${Math.ceil((new Date().getMonth() + 1) / 3)} ${currentYear}`,
      `${companyName} Databricks Readiness Evaluation`,
      `${companyName} - ${completionLevel === 'full' ? 'Comprehensive' : 'Preliminary'} Technical Review`,
      `${companyName} Cloud Analytics Assessment ${currentYear}`
    ];
    const assessmentName = this.randomChoice(nameFormats);
    
    const assessment = {
      id: assessmentId,
      assessmentName: assessmentName,
      organizationName: companyName,
      contactEmail: contactEmail,
      industry: industry,
      assessmentDescription: description,
      editorEmail: `${this.randomChoice(['john.smith', 'jane.doe', 'michael.chen', 'sarah.johnson', 'david.williams'])}@${companyDomain}.com`,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'in_progress',
      responses: {},
      completedCategories: [], // Changed from completedAreas to match frontend expectation
      editHistory: [
        {
          timestamp: new Date().toISOString(),
          editorEmail: 'sample-generator@databricks.com',
          changes: 'Sample assessment created'
        }
      ]
    };

    // Determine which pillars to complete
    let pillarsToComplete = assessmentFramework.assessmentAreas;
    
    if (specificPillars && specificPillars.length > 0) {
      pillarsToComplete = assessmentFramework.assessmentAreas
        .filter(area => specificPillars.includes(area.id));
    } else if (completionLevel === 'partial') {
      // Complete 3-4 random pillars
      const numPillars = this.randomInt(3, 4);
      pillarsToComplete = assessmentFramework.assessmentAreas
        .sort(() => Math.random() - 0.5)
        .slice(0, numPillars);
    } else if (completionLevel === 'minimal') {
      // Complete only 1-2 pillars
      const numPillars = this.randomInt(1, 2);
      pillarsToComplete = assessmentFramework.assessmentAreas
        .sort(() => Math.random() - 0.5)
        .slice(0, numPillars);
    }

    // Generate responses for selected pillars
    pillarsToComplete.forEach(area => {
      area.dimensions.forEach(dimension => {
        dimension.questions.forEach(question => {
          const questionResponses = this.generateQuestionResponses(question, area.id, dimension.name);
          Object.assign(assessment.responses, questionResponses);
        });
      });
      
      assessment.completedCategories.push(area.id);
    });

    // Update status
    if (assessment.completedCategories.length === assessmentFramework.assessmentAreas.length) {
      assessment.status = 'completed';
    }

    return assessment;
  }

  /**
   * Generate multiple sample assessments
   */
  generateMultipleSamples(count = 3) {
    const samples = [];
    const completionLevels = ['full', 'partial', 'minimal'];
    
    for (let i = 0; i < count; i++) {
      const level = this.randomChoice(completionLevels);
      samples.push(this.generateSampleAssessment({ completionLevel: level }));
    }
    
    return samples;
  }
}

module.exports = new SampleAssessmentGenerator();

