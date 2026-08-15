// Databricks Maturity Assessment Recommendation Engine
// Analyzes assessment results and provides tailored recommendations

const assessmentFramework = require('../data/assessmentFramework');

class RecommendationEngine {
  constructor() {
    this.recommendations = {
      // Infrastructure recommendations based on current state
      infrastructure: {
        1: {
          priority: 'high',
          title: 'Modernize Data Infrastructure',
          description: 'Your current data infrastructure needs significant modernization to support advanced analytics.',
          actions: [
            'Migrate from traditional databases to cloud-based data lakehouse architecture',
            'Implement Databricks as your unified analytics platform',
            'Establish data lake storage with Delta Lake for ACID transactions',
            'Set up automated data pipelines with Databricks workflows'
          ],
          timeline: '6-12 months',
          effort: 'high',
          impact: 'transformational'
        },
        2: {
          priority: 'high',
          title: 'Enhance Data Processing Capabilities',
          description: 'Upgrade your data processing to handle larger volumes and enable real-time analytics.',
          actions: [
            'Implement Databricks for unified batch and streaming processing',
            'Migrate ETL processes to modern ELT patterns with Delta Live Tables',
            'Establish data quality monitoring and automated testing',
            'Optimize data storage with partitioning and Z-ordering'
          ],
          timeline: '4-8 months',
          effort: 'medium-high',
          impact: 'high'
        },
        3: {
          priority: 'medium',
          title: 'Optimize Current Architecture',
          description: 'Your infrastructure is solid but can be optimized for better performance and cost efficiency.',
          actions: [
            'Implement advanced optimization techniques (caching, indexing)',
            'Establish multi-cluster management for cost optimization',
            'Enhance monitoring and alerting capabilities',
            'Implement automated scaling policies'
          ],
          timeline: '2-4 months',
          effort: 'medium',
          impact: 'medium'
        },
        4: {
          priority: 'low',
          title: 'Fine-tune Performance',
          description: 'Your architecture is advanced. Focus on fine-tuning and emerging technologies.',
          actions: [
            'Implement advanced performance tuning techniques',
            'Explore photon engine for query acceleration',
            'Establish advanced cost optimization strategies',
            'Evaluate emerging Databricks features for competitive advantage'
          ],
          timeline: '1-3 months',
          effort: 'low-medium',
          impact: 'medium'
        },
        5: {
          priority: 'low',
          title: 'Innovation and Leadership',
          description: 'You have industry-leading infrastructure. Focus on innovation and thought leadership.',
          actions: [
            'Contribute to open-source data projects',
            'Implement cutting-edge features and beta programs',
            'Share best practices with the community',
            'Explore next-generation technologies and partnerships'
          ],
          timeline: 'Ongoing',
          effort: 'low',
          impact: 'strategic'
        }
      },

      // ML/AI recommendations
      analytics: {
        1: {
          priority: 'high',
          title: 'Establish ML Foundation',
          description: 'Build foundational machine learning capabilities to unlock data value.',
          actions: [
            'Set up Databricks ML workspace and collaborative notebooks',
            'Implement MLflow for experiment tracking and model management',
            'Establish feature store for reusable ML features',
            'Train team on basic ML concepts and Databricks ML tools'
          ],
          timeline: '3-6 months',
          effort: 'medium',
          impact: 'high'
        },
        2: {
          priority: 'high',
          title: 'Accelerate ML Adoption',
          description: 'Scale your ML capabilities and establish production-ready workflows.',
          actions: [
            'Implement automated ML pipelines with Databricks AutoML',
            'Establish model deployment and monitoring processes',
            'Create ML governance framework and model registry',
            'Develop citizen data scientist program'
          ],
          timeline: '4-8 months',
          effort: 'medium-high',
          impact: 'high'
        },
        3: {
          priority: 'medium',
          title: 'Advanced ML Operations',
          description: 'Enhance your MLOps capabilities and explore advanced AI techniques.',
          actions: [
            'Implement advanced MLOps with CI/CD for ML models',
            'Explore deep learning and neural networks for complex problems',
            'Establish A/B testing framework for model performance',
            'Implement real-time ML inference capabilities'
          ],
          timeline: '3-6 months',
          effort: 'medium',
          impact: 'high'
        },
        4: {
          priority: 'medium',
          title: 'AI Innovation',
          description: 'Lead with cutting-edge AI capabilities and generative AI integration.',
          actions: [
            'Implement generative AI and large language models',
            'Establish AI governance and responsible AI practices',
            'Explore computer vision and NLP applications',
            'Create AI centers of excellence'
          ],
          timeline: '2-4 months',
          effort: 'medium',
          impact: 'transformational'
        },
        5: {
          priority: 'low',
          title: 'AI Leadership',
          description: 'Maintain AI leadership and drive industry innovation.',
          actions: [
            'Research and implement emerging AI technologies',
            'Establish AI research partnerships',
            'Lead industry standards and best practices',
            'Mentor other organizations in AI adoption'
          ],
          timeline: 'Ongoing',
          effort: 'low-medium',
          impact: 'strategic'
        }
      },

      // Governance recommendations
      governance: {
        1: {
          priority: 'critical',
          title: 'Establish Data Governance Foundation',
          description: 'Critical need to establish basic data governance to ensure data quality and compliance.',
          actions: [
            'Define data governance policies and procedures',
            'Implement Unity Catalog for centralized data governance',
            'Establish data stewardship roles and responsibilities',
            'Create data classification and access control framework'
          ],
          timeline: '2-4 months',
          effort: 'medium',
          impact: 'critical'
        },
        2: {
          priority: 'high',
          title: 'Strengthen Governance Controls',
          description: 'Build upon basic governance with automated controls and monitoring.',
          actions: [
            'Implement automated data quality monitoring',
            'Establish data lineage tracking across all systems',
            'Create data privacy and security controls',
            'Implement audit trails and compliance reporting'
          ],
          timeline: '3-6 months',
          effort: 'medium',
          impact: 'high'
        },
        3: {
          priority: 'medium',
          title: 'Advanced Governance Automation',
          description: 'Enhance governance with AI-driven insights and advanced automation.',
          actions: [
            'Implement AI-powered data discovery and classification',
            'Establish automated policy enforcement',
            'Create self-service data governance tools',
            'Implement advanced data quality scoring'
          ],
          timeline: '2-4 months',
          effort: 'medium',
          impact: 'medium'
        },
        4: {
          priority: 'low',
          title: 'Governance Excellence',
          description: 'Achieve governance excellence with predictive capabilities.',
          actions: [
            'Implement predictive data quality monitoring',
            'Establish governance analytics and insights',
            'Create automated governance workflows',
            'Implement cross-platform governance integration'
          ],
          timeline: '1-3 months',
          effort: 'low-medium',
          impact: 'medium'
        },
        5: {
          priority: 'low',
          title: 'Governance Innovation',
          description: 'Lead governance innovation with cutting-edge capabilities.',
          actions: [
            'Research next-generation governance technologies',
            'Establish governance innovation lab',
            'Share governance best practices industry-wide',
            'Contribute to governance standards and frameworks'
          ],
          timeline: 'Ongoing',
          effort: 'low',
          impact: 'strategic'
        }
      },

      // Business alignment recommendations
      business: {
        1: {
          priority: 'critical',
          title: 'Establish Business Alignment',
          description: 'Critical need to align data initiatives with business objectives and secure executive support.',
          actions: [
            'Develop clear business case for data platform investment',
            'Establish data strategy aligned with business goals',
            'Secure executive sponsorship and governance structure',
            'Create data literacy program for business stakeholders'
          ],
          timeline: '1-3 months',
          effort: 'medium',
          impact: 'critical'
        },
        2: {
          priority: 'high',
          title: 'Strengthen Business Partnership',
          description: 'Build stronger partnerships between data teams and business stakeholders.',
          actions: [
            'Establish regular business-data team collaboration sessions',
            'Create business-friendly data visualization and reporting',
            'Implement use case prioritization framework',
            'Develop ROI measurement and tracking capabilities'
          ],
          timeline: '2-4 months',
          effort: 'medium',
          impact: 'high'
        },
        3: {
          priority: 'medium',
          title: 'Enhance Business Value',
          description: 'Focus on maximizing business value and demonstrating clear ROI.',
          actions: [
            'Implement advanced analytics for business insights',
            'Create self-service analytics capabilities for business users',
            'Establish data-driven decision making processes',
            'Develop business impact measurement framework'
          ],
          timeline: '2-4 months',
          effort: 'medium',
          impact: 'high'
        },
        4: {
          priority: 'low',
          title: 'Drive Business Innovation',
          description: 'Use data and AI to drive business innovation and competitive advantage.',
          actions: [
            'Implement AI-driven business process optimization',
            'Create innovation labs for data-driven solutions',
            'Establish customer-centric analytics and personalization',
            'Develop new data-driven business models'
          ],
          timeline: '3-6 months',
          effort: 'medium',
          impact: 'transformational'
        },
        5: {
          priority: 'low',
          title: 'Business Leadership',
          description: 'Maintain leadership in data-driven business transformation.',
          actions: [
            'Lead industry transformation initiatives',
            'Share business transformation success stories',
            'Mentor other organizations in data-driven transformation',
            'Explore next-generation business models'
          ],
          timeline: 'Ongoing',
          effort: 'low',
          impact: 'strategic'
        }
      }
    };
  }

  // Calculate overall maturity score
  calculateMaturityScore(responses, areasToInclude = null) {
    const areas = areasToInclude || assessmentFramework.assessmentAreas;
    
    if (areas.length === 0) return 0;
    
    let totalWeightedScore = 0;
    let totalWeight = 0;
    
    areas.forEach(area => {
      const areaScore = this.calculateAreaScore(area, responses);
      
      // Count questions from dimensions to use as weight
      let questionCount = 0;
      if (area.dimensions) {
        area.dimensions.forEach(dimension => {
          if (dimension.questions) {
            questionCount += dimension.questions.length;
          }
        });
      } else if (area.questions) {
        questionCount = area.questions.length;
      }
      
      // Add weighted score (areaScore * number of questions in that area)
      totalWeightedScore += areaScore * questionCount;
      totalWeight += questionCount;
    });

    return totalWeight > 0 ? Math.round(totalWeightedScore / totalWeight) : 0;
  }

  // Calculate score for a specific area and perspective type
  calculateAreaScoreByPerspective(area, responses, perspectiveFilter = null) {
    let areaScore = 0;
    let questionCount = 0;

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

    questions.forEach(question => {
      // Check if question is skipped
      const skipKey = `${question.id}_skipped`;
      if (responses[skipKey]) {
        // Skip this question in calculations
        return;
      }

      let questionScore = 0;
      let perspectiveCount = 0;

      question.perspectives.forEach(perspective => {
        // Filter by perspective if specified
        if (perspectiveFilter && perspective.id !== perspectiveFilter) {
          return;
        }

        const responseKey = `${question.id}_${perspective.id}`;
        const response = responses[responseKey];
        
        if (response) {
          if (perspective.type === 'single_choice') {
            const selectedOption = perspective.options.find(opt => opt.value === response);
            if (selectedOption) {
              questionScore += selectedOption.score;
              perspectiveCount++;
            }
          } else if (perspective.type === 'multiple_choice') {
            const selectedOptions = perspective.options.filter(opt => response.includes(opt.value));
            if (selectedOptions.length > 0) {
              const avgScore = selectedOptions.reduce((sum, opt) => sum + opt.score, 0) / selectedOptions.length;
              questionScore += avgScore;
              perspectiveCount++;
            }
          }
        }
      });

      if (perspectiveCount > 0) {
        areaScore += questionScore / perspectiveCount;
        questionCount++;
      }
    });

    return questionCount > 0 ? areaScore / questionCount : 0;
  }

  // Calculate score for a specific area
  calculateAreaScore(area, responses) {
    let areaScore = 0;
    let questionCount = 0;

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

    questions.forEach(question => {
      // Check if question is skipped
      const skipKey = `${question.id}_skipped`;
      if (responses[skipKey]) {
        // Skip this question in calculations
        return;
      }

      let questionScore = 0;
      let perspectiveCount = 0;

      question.perspectives.forEach(perspective => {
        const responseKey = `${question.id}_${perspective.id}`;
        const response = responses[responseKey];
        
        if (response) {
          if (perspective.type === 'single_choice') {
            const selectedOption = perspective.options.find(opt => opt.value === response);
            if (selectedOption) {
              questionScore += selectedOption.score;
              perspectiveCount++;
            }
          } else if (perspective.type === 'multiple_choice') {
            const selectedOptions = perspective.options.filter(opt => response.includes(opt.value));
            if (selectedOptions.length > 0) {
              const avgScore = selectedOptions.reduce((sum, opt) => sum + opt.score, 0) / selectedOptions.length;
              questionScore += avgScore;
              perspectiveCount++;
            }
          }
        }
      });

      if (perspectiveCount > 0) {
        areaScore += questionScore / perspectiveCount;
        questionCount++;
      }
    });

    return questionCount > 0 ? areaScore / questionCount : 0;
  }

  // Generate comprehensive recommendations
  generateRecommendations(responses, completedAreaIds = null) {
    // Determine which areas to analyze
    const areasToAnalyze = completedAreaIds 
      ? assessmentFramework.assessmentAreas.filter(area => completedAreaIds.includes(area.id))
      : assessmentFramework.assessmentAreas;
    
    const overallScore = this.calculateMaturityScore(responses, areasToAnalyze);
    const areaScores = {};

    // Calculate individual area scores (only for areas being analyzed)
    areasToAnalyze.forEach(area => {
      areaScores[area.id] = Math.round(this.calculateAreaScore(area, responses));
    });

    // Generate recommendations for each area
    const recommendations = {
      overall: {
        score: overallScore,
        level: assessmentFramework.maturityLevels[Math.max(1, Math.min(5, overallScore))],
        summary: this.generateOverallSummary(overallScore, areaScores, areasToAnalyze, responses)
      },
      categories: {},
      prioritizedActions: [],
      roadmap: this.generateRoadmap(areaScores),
      quickWins: this.identifyQuickWins(areaScores, responses),
      riskAreas: this.identifyRiskAreas(areaScores, responses),
      completedAreas: areasToAnalyze.length,
      totalAreas: assessmentFramework.assessmentAreas.length
    };

    // Generate area-specific recommendations
    Object.keys(areaScores).forEach(areaId => {
      const score = areaScores[areaId];
      const area = assessmentFramework.assessmentAreas.find(a => a.id === areaId);
      
      recommendations.categories[areaId] = {
        score: score,
        level: assessmentFramework.maturityLevels[score],
        recommendations: this.getAreaRecommendations(areaId, score, responses)
      };
    });

    // Generate prioritized action list
    recommendations.prioritizedActions = this.generatePrioritizedActions(areaScores, responses);

    return recommendations;
  }

  // Generate overall assessment summary
  generateOverallSummary(overallScore, areaScores, areasAnalyzed = null, responses = {}) {
    // Ensure score is within valid range (1-5)
    const validScore = Math.max(1, Math.min(5, Math.round(overallScore || 1)));
    const level = assessmentFramework.maturityLevels[validScore];
    
    if (!level) {
      console.error('Invalid maturity level:', validScore);
      return 'Unable to generate summary due to invalid maturity level.';
    }
    
    // ALWAYS analyze ALL 6 pillars for comprehensive executive summary
    const allPillars = assessmentFramework.assessmentAreas;
    const assessedPillarIds = Object.keys(areaScores);
    const pendingPillars = allPillars.filter(p => !assessedPillarIds.includes(p.id));
    const isPartialAssessment = pendingPillars.length > 0;
    
    // Calculate current vs future scores (only for assessed pillars)
    let currentScoreSum = 0;
    let futureScoreSum = 0;
    let areaCount = 0;
    
    allPillars.forEach(area => {
      if (assessedPillarIds.includes(area.id)) {
        const currentScore = this.calculateAreaScoreByPerspective(area, responses, 'current_state');
        const futureScore = this.calculateAreaScoreByPerspective(area, responses, 'future_state');
        currentScoreSum += currentScore;
        futureScoreSum += futureScore;
        areaCount++;
      }
    });
    
    const avgCurrentScore = areaCount > 0 ? Math.round(currentScoreSum / areaCount) : 0;
    const avgFutureScore = areaCount > 0 ? Math.round(futureScoreSum / areaCount) : 0;
    const currentLevel = assessmentFramework.maturityLevels[Math.max(1, Math.min(5, avgCurrentScore))];
    const futureLevel = assessmentFramework.maturityLevels[Math.max(1, Math.min(5, avgFutureScore))];
    const maturityGap = avgFutureScore - avgCurrentScore;
    
    // Categorize pillars by performance (assessed pillars)
    const strengths = [];
    const criticalAreas = [];
    const improvementAreas = [];
    const assessedPillarNames = [];

    Object.keys(areaScores).forEach(areaId => {
      const score = areaScores[areaId];
      const area = assessmentFramework.assessmentAreas.find(a => a.id === areaId);
      
      assessedPillarNames.push(area.name);
      
      if (score >= 4) {
        strengths.push(area.name);
      } else if (score <= 2) {
        criticalAreas.push(area.name);
      } else if (score === 3) {
        improvementAreas.push(area.name);
      }
    });
    
    // Extract pain points
    const technicalPainPoints = [];
    const businessPainPoints = [];
    
    Object.keys(responses).forEach(key => {
      if (key.includes('_technical_pain')) {
        const painPoints = responses[key];
        if (Array.isArray(painPoints)) {
          technicalPainPoints.push(...painPoints);
        } else if (painPoints) {
          technicalPainPoints.push(painPoints);
        }
      } else if (key.includes('_business_pain')) {
        const painPoints = responses[key];
        if (Array.isArray(painPoints)) {
          businessPainPoints.push(...painPoints);
        } else if (painPoints) {
          businessPainPoints.push(painPoints);
        }
      }
    });
    
    const uniqueTechnical = [...new Set(technicalPainPoints)].slice(0, 2);
    const uniqueBusiness = [...new Set(businessPainPoints)].slice(0, 2);
    
    // Build highly specific, data-driven executive summary with real insights
    let summary = '';
    
    // Analyze pillar-specific scores and gaps
    const pillarAnalysis = {};
    Object.keys(areaScores).forEach(pillarId => {
      const pillar = allPillars.find(p => p.id === pillarId);
      const currentScore = this.calculateAreaScoreByPerspective(pillar, responses, 'current_state');
      const futureScore = this.calculateAreaScoreByPerspective(pillar, responses, 'future_state');
      const gap = Math.round(futureScore - currentScore);
      
      pillarAnalysis[pillarId] = {
        id: pillarId,
        name: pillar.name,
        current: Math.round(currentScore),
        future: Math.round(futureScore),
        gap: gap,
        score: areaScores[pillarId]
      };
    });
    
    // Sort pillars by gap (highest priority first)
    const sortedPillars = Object.values(pillarAnalysis).sort((a, b) => b.gap - a.gap);
    
    // Extract ALL pain points for deeper analysis
    const allTechnicalPains = [];
    const allBusinessPains = [];
    const userComments = [];
    
    Object.keys(responses).forEach(key => {
      if (key.includes('_technical_pain')) {
        const pains = responses[key];
        if (Array.isArray(pains)) allTechnicalPains.push(...pains);
        else if (pains) allTechnicalPains.push(pains);
      } else if (key.includes('_business_pain')) {
        const pains = responses[key];
        if (Array.isArray(pains)) allBusinessPains.push(...pains);
        else if (pains) allBusinessPains.push(pains);
      } else if (key.includes('_comment')) {
        const comment = responses[key];
        if (comment && comment.trim()) userComments.push(comment.trim());
      }
    });
    
    const uniqueTechPains = [...new Set(allTechnicalPains)];
    const uniqueBizPains = [...new Set(allBusinessPains)];
    
    // ==== GENERATE MCKINSEY-STYLE STRATEGIC EXECUTIVE SUMMARY ====
    // Focus: Business value creation, competitive positioning, strategic imperatives
    // Technology = enabler, not the story
    
    // 1. Calculate business impact metrics (use already-calculated avgCurrentScore and avgFutureScore from lines 545-546)
    const criticalCount = sortedPillars.filter(p => p.current <= 2).length;
    const totalGap = sortedPillars.reduce((sum, p) => sum + p.gap, 0);
    
    // Map maturity to business capability
    const maturityBusinessImpact = {
      1: { capability: 'Firefighting mode', marketPosition: 'bottom 20%', valueRealization: '10-20%', businessAgility: 'months to deliver insights' },
      2: { capability: 'Reactive operations', marketPosition: 'bottom 40%', valueRealization: '30-40%', businessAgility: 'weeks to deliver insights' },
      3: { capability: 'Defined processes', marketPosition: 'market average', valueRealization: '50-60%', businessAgility: 'days to deliver insights' },
      4: { capability: 'Proactive optimization', marketPosition: 'top 30%', valueRealization: '75-85%', businessAgility: 'hours to deliver insights' },
      5: { capability: 'Innovation-driven', marketPosition: 'top 10%', valueRealization: '90-95%', businessAgility: 'real-time insights' }
    };
    
    const currentState = maturityBusinessImpact[avgCurrentScore] || maturityBusinessImpact[2];
    const futureState = maturityBusinessImpact[avgFutureScore] || maturityBusinessImpact[4];
    
    // 2. STRATEGIC SITUATION & BUSINESS IMPERATIVES
    summary += `**🎯 STRATEGIC SITUATION & BUSINESS IMPERATIVES**\n`;
    
    // Lead with business context, not technology
    summary += `\nYour organization operates at **Level ${avgCurrentScore} maturity** ("${currentState.capability}"), positioning you in the **${currentState.marketPosition} of the market**. Your assessment reveals a strategic opportunity to reach **Level ${avgFutureScore}** ("${futureState.capability}"), elevating to the **${futureState.marketPosition}** where data becomes a true competitive weapon.\n\n`;
    
    if (criticalCount >= 3) {
      summary += `**Business Reality:** ${criticalCount} mission-critical capability gaps are constraining growth and exposing strategic vulnerabilities:\n\n`;
      summary += `• **Revenue Impact**: Organizations with strong analytics capabilities are **23% more likely to significantly outperform competitors** (Gartner, 2024). Your current maturity constraints create **15-25% revenue leakage** through slower time-to-market, missed opportunities, and suboptimal pricing decisions\n\n`;
      summary += `• **Competitive Erosion**: Data-driven leaders respond to market changes **3-5x faster**, translating to a **12-18 month competitive lag** in product innovation and customer insights. This gap puts **15-25% market share at risk** over 3 years (Forrester, 2024)\n\n`;
      summary += `• **Operational Drag**: Data quality issues and compliance firefighting consume **30-40% of leadership capacity** that should focus on strategic initiatives. Poor data quality costs organizations an average **20-30% of revenue** (IDC, 2023)\n\n`;
      summary += `• **Innovation Ceiling**: **87% of data science projects never make it to production** without mature platforms (VentureBeat/Gartner). Current maturity blocks AI/ML at scale, leaving **60-70% of GenAI value unrealized**`;
    } else if (criticalCount >= 1) {
      summary += `**Strategic Inflection Point:** Your organization has established foundational capabilities but faces ${criticalCount} critical constraint${criticalCount > 1 ? 's' : ''} blocking value acceleration:\n\n`;
      summary += `• **Growth Enablement**: Addressing identified gaps can **improve operating margins by 8-12%** through faster decision velocity, reduced operational overhead, and improved resource allocation (IDC, 2024)\n\n`;
      summary += `• **Market Responsiveness**: Current ${currentState.businessAgility} vs. future ${futureState.businessAgility} represents **40-60% acceleration** in responding to competitive threats. **Organizations with mature analytics capabilities make decisions 5x faster** than competitors (Forrester, 2023)\n\n`;
      summary += `• **Innovation Capacity**: Closing maturity gaps frees **25-35% of data team capacity** currently spent on maintenance. **Top-performing organizations spend 70% of IT budget on innovation vs. 30% for laggards** (Gartner, 2024)\n\n`;
      summary += `• **Risk Mitigation**: Mature data governance reduces compliance exposure by **60-70%**. **The average cost of a data breach is now 4.45M USD**, with poor governance a leading cause (IBM/Ponemon Institute, 2023)`;
    } else {
      summary += `**Strategic Advantage Position:** Your strong foundation (Level ${avgCurrentScore}) positions you for breakthrough performance:\n\n`;
      summary += `• **Market Leadership**: Target state (Level ${avgFutureScore}) places you in **${futureState.marketPosition}**. **Only 10-12% of organizations achieve Level 4+** analytics maturity, creating significant competitive advantage (Gartner, 2024)\n\n`;
      summary += `• **Value Multiplication**: Organizations at higher maturity levels see **2-3x better ROI** on data initiatives. **Analytics leaders achieve 126% higher profitability growth** vs. laggards (Forrester, 2023)\n\n`;
      summary += `• **AI/ML Acceleration**: Level ${avgFutureScore} maturity enables **3-5x more models in production**. **70% of ML leaders deploy models in under 30 days** vs. 6+ months for others—critical for GenAI advantage (IDC, 2024)\n\n`;
      summary += `• **Strategic Optionality**: Mature platforms create **exponential returns**—**every 1% improvement in data accessibility delivers 0.7% boost in operational efficiency** (Forrester, 2023)`;
    }
    
    // 3. CRITICAL CONSTRAINTS (Business lens on pain points)
    if (uniqueTechPains.length > 0 || uniqueBizPains.length > 0) {
      summary += `\n\n**⚠️ CRITICAL CONSTRAINTS IMPACTING BUSINESS PERFORMANCE**\n`;
      summary += `\nYour teams identified specific operational barriers that translate to measurable business impact:\n\n`;
      
      // Map technical pain to business consequence with industry research
      const businessImpactMap = {
        'manual': { 
          business: 'Market Responsiveness Bottleneck', 
          impact: 'Manual processes create **3-5 week deployment cycles** vs. industry-leading 24-48 hours. **Organizations with automated deployment achieve 46x more frequent deployments** and recover from failures 96x faster (DevOps Research/Google, 2023)'
        },
        'slow': { 
          business: 'Decision Velocity Constraint', 
          impact: 'Query latency forces executives to make strategic decisions on stale data. **Real-time analytics capabilities improve decision quality by 30-40%** and reduce time-to-decision by **5-10x** (Forrester, 2024)'
        },
        'quality': { 
          business: 'Trust Deficit & Rework Tax', 
          impact: 'Data quality issues undermine stakeholder confidence, forcing 2-3x validation cycles. **Poor data quality costs organizations 15-25% of revenue** and wastes **30-40% of analyst productivity** (Gartner, 2023)'
        },
        'siloed': { 
          business: 'Collaboration Friction & Duplication', 
          impact: 'Fragmented data access forces redundant work—**30-40% of data engineering effort is duplicated** across business units. **Data silos reduce productivity by 20-30%** (IDC, 2024)'
        },
        'governance': { 
          business: 'Regulatory Exposure & Compliance Debt', 
          impact: 'Governance gaps create significant regulatory exposure. **The average GDPR fine is 2.7M EUR**, and **60% of organizations faced compliance penalties** in 2023. Strong governance reduces compliance costs by **50-60%** (Gartner, 2024)'
        },
        'cost': { 
          business: 'Uncontrolled Cloud Spend', 
          impact: 'Without visibility and chargeback, cloud costs overrun by **50-80%**. **Organizations waste 32% of cloud spend on average** due to poor optimization. Mature FinOps practices reduce waste by **30-50%** (Flexera, 2024)'
        },
        'model': { 
          business: 'ML ROI Erosion', 
          impact: 'Model monitoring gaps allow **30-50% accuracy degradation** before detection. **Only 53% of ML projects successfully deploy to production**, and model drift costs **15-25% of expected ROI** (Gartner/VentureBeat, 2023)'
        },
        'deployment': { 
          business: 'Innovation Velocity Ceiling', 
          impact: 'Complex deployment processes extend model time-to-production from weeks to **6+ months**. **85% of data science projects fail to reach production** without mature MLOps. Leaders deploy **10x more models** than laggards (IDC, 2024)'
        }
      };
      
      const reportedPains = [...uniqueTechPains, ...uniqueBizPains].slice(0, 4);
      let painCount = 0;
      
      reportedPains.forEach(pain => {
        const painLower = pain.toLowerCase();
        const matchedKey = Object.keys(businessImpactMap).find(key => painLower.includes(key));
        
        if (matchedKey && painCount < 4) {
          const impact = businessImpactMap[matchedKey];
          summary += `**${painCount + 1}. ${impact.business}:** ${impact.impact}\n\n`;
          painCount++;
        }
      });
      
      // If no mapped pains, provide generic but valuable insight
      if (painCount === 0) {
        summary += `Based on your reported challenges, operational inefficiencies are consuming **25-35% of data team capacity**—capacity that could be redirected to revenue-generating analytics, strategic initiatives, and innovation`;
      }
    }
    
    // 4. STRATEGIC ENABLERS (Technology as business capability unlock)
    summary += `\n\n**🚀 STRATEGIC ENABLERS: TECHNOLOGY-POWERED BUSINESS TRANSFORMATION**\n`;
    summary += `\nClosing your maturity gaps unlocks modern data platform capabilities that drive measurable business outcomes:\n\n`;
    
    const businessEnabl = [];
    sortedPillars.forEach(pillar => {
      if (pillar.current <= 2 && pillar.id === 'platform-governance') {
        businessEnabl.push({
          capability: 'Unified Data Governance (Unity Catalog)',
          business: '**60-70% reduction in compliance preparation time** and **50% lower governance costs**. Organizations with mature governance report **40% faster time-to-market** for data products and **30-35% improvement** in data team efficiency (Gartner, 2024)'
        });
      }
      if (pillar.current <= 2 && pillar.id === 'data-engineering') {
        businessEnabl.push({
          capability: 'Automated Data Pipelines (Delta Live Tables)',
          business: '**70-80% reduction in pipeline development time** + **90% fewer production incidents**. Automation enables **3-4x faster data delivery** and frees **25-35% of engineering capacity** for strategic work (IDC, 2024)'
        });
      }
      if (pillar.current <= 3 && pillar.id === 'analytics-bi') {
        businessEnabl.push({
          capability: 'Serverless Analytics (Databricks SQL)',
          business: '**50-60% infrastructure cost reduction** through auto-scaling + **3-5x query performance improvement**. Self-service analytics **increases decision velocity by 40-60%** and **reduces analyst wait time by 70%** (Forrester, 2023)'
        });
      }
      if (pillar.current <= 2 && pillar.id === 'ml-mlops') {
        businessEnabl.push({
          capability: 'Production ML Operations (MLflow Ecosystem)',
          business: '**3-5x more models in production** + **80% faster time-to-production**. Mature MLOps practices **increase model success rate from 22% to 80%** and deliver **2-3x better ROI** on AI investments (Gartner/IDC, 2024)'
        });
      }
      if (pillar.current <= 3 && pillar.id === 'genai-agentic') {
        businessEnabl.push({
          capability: 'Enterprise GenAI (Mosaic AI & RAG)',
          business: '**40-60% productivity acceleration** for knowledge workers + **30-50% cost savings** vs. third-party APIs. **Organizations adopting GenAI see 15-25% revenue growth** and **12-18 month competitive advantage** (Forrester/IDC, 2024)'
        });
      }
    });
    
    if (businessEnabl.length > 0) {
      businessEnabl.forEach((item, idx) => {
        summary += `**${idx + 1}. ${item.capability}** → ${item.business}\n\n`;
      });
    } else {
      summary += `Your advanced maturity level positions you to leverage cutting-edge capabilities—focus on **optimizing ROI through deeper platform adoption**, **expanding AI/ML use cases**, and **accelerating innovation velocity** to maintain competitive leadership`;
    }
    
    // 5. STRATEGIC ROADMAP (Executive-level action plan)
    summary += `\n\n**📋 STRATEGIC ROADMAP: 90-DAY → 12-MONTH TRANSFORMATION**\n`;
    summary += `\nRecommended phased approach to maximize value velocity while managing organizational change:\n\n`;
    
    const criticalPillars = sortedPillars.filter(p => p.current <= 2);
    const highGapPillars = sortedPillars.filter(p => p.gap >= 2);
    
    if (criticalPillars.length >= 2) {
      summary += `**Phase 1 (0-90 days): Stabilization & Quick Wins** → **Expected Impact: 10-15% operational efficiency improvement**\n`;
      summary += `• Launch "platform stabilization sprint" targeting ${criticalPillars.slice(0,2).map(p => p.name.replace(/^[^\s]+\s/, '')).join(' & ')} to reach baseline maturity (Level 3)\n`;
      summary += `• Deploy Unity Catalog for immediate **60-70% compliance overhead reduction** and **30% faster data access**\n`;
      summary += `• Implement automated monitoring to eliminate firefighting and **reclaim 25-30% of engineering capacity**\n\n`;
      
      summary += `**Phase 2 (3-6 months): Capability Transformation** → **Expected Impact: 30-40% productivity gain + 50% cost reduction**\n`;
      summary += `• Transform data pipelines with Delta Live Tables (**70-80% development time reduction** + **90% fewer incidents**)\n`;
      summary += `• Establish MLOps foundation enabling **3-5x model velocity** and **60% higher success rate**\n`;
      summary += `• Deploy serverless analytics for analyst self-service at **50-60% lower infrastructure cost**\n\n`;
      
      summary += `**Phase 3 (6-12 months): Competitive Advantage** → **Expected Impact: 2-3x ROI on AI investments + market leadership**\n`;
      summary += `• Launch GenAI pilots delivering **40-60% knowledge worker productivity gains** (**15-25% revenue impact**, Forrester)\n`;
      summary += `• Operationalize advanced ML use cases (**3-5x more models in production**, **80% faster deployment**)\n`;
      summary += `• Establish center of excellence for continuous innovation (**30% faster capability adoption**, Gartner)\n`;
    } else if (criticalPillars.length >= 1) {
      summary += `**Phase 1 (0-90 days): Address Critical Gap** → **Expected Impact: 15-20% improvement in key bottleneck area**\n`;
      summary += `• Focused transformation of ${criticalPillars[0].name.replace(/^[^\s]+\s/, '')} (current bottleneck blocking enterprise progress)\n`;
      summary += `• Quick-win deployment of 2-3 modern capabilities with **measurable ROI in 30-60 days**\n`;
      summary += `• Establish measurement framework tracking business value realization (**critical for executive buy-in**)\n\n`;
      
      summary += `**Phase 2 (3-9 months): Scale & Optimize** → **Expected Impact: 40-60% overall capability improvement**\n`;
      summary += `• Systematic closure of remaining maturity gaps across ${sortedPillars.length} pillars (**holistic transformation**)\n`;
      summary += `• Deploy advanced capabilities (AI/ML, GenAI, real-time analytics) on stabilized foundation\n`;
      summary += `• Scale adoption across business units with change management & training (**70% adoption target**, IDC)\n`;
    } else {
      summary += `**Optimization-Focused Roadmap** (Strong Foundation → Market Leadership)\n\n`;
      summary += `• **0-60 days**: Platform ROI audit—identify **20-30% cost optimization opportunities** and efficiency gains\n`;
      summary += `• **60-180 days**: Expand AI/ML use cases by **3-5x**, targeting **15-25% incremental business value**\n`;
      summary += `• **6-12 months**: Deploy GenAI enterprise-wide, achieving **40-60% knowledge worker productivity gains** (**top 10% market position**, Gartner)\n`;
    }
    
    // 6. QUANTIFIED BUSINESS VALUE (Industry-benchmark format with percentages)
    summary += `\n\n**💎 EXPECTED BUSINESS OUTCOMES & VALUE REALIZATION**\n`;
    summary += `\nTransformation to Level ${avgFutureScore} maturity delivers quantifiable business value across 5 dimensions (benchmarked against industry research):\n\n`;
    
    if (criticalCount >= 2) {
      summary += `**1. Revenue Acceleration** → **15-25% revenue impact potential**\n`;
      summary += `• **60-70% faster time-to-market** for data products enables earlier revenue capture (Forrester, 2024)\n`;
      summary += `• Real-time analytics drives **15-25% improvement** in conversion, pricing, and customer lifetime value (IDC, 2023)\n`;
      summary += `• **3-5x ML model velocity** translates to significant predictive capability advantage (Gartner, 2024)\n\n`;
      
      summary += `**2. Cost Optimization** → **30-40% TCO reduction**\n`;
      summary += `• **30-40% platform TCO reduction** through automation, serverless, and rightsizing (Gartner, 2024)\n`;
      summary += `• **70-80% reduction in rework** and incidents saves 25-30% of engineering capacity (IDC, 2024)\n`;
      summary += `• Compliance efficiency gains **reduce governance overhead by 50-60%** (Forrester, 2023)\n\n`;
      
      summary += `**3. Operational Excellence** → **40-50% productivity improvement**\n`;
      summary += `• Data engineers reclaim **30-40% capacity**, redirected to strategic initiatives (Gartner, 2024)\n`;
      summary += `• Analyst productivity improves **40-50%** through self-service and query performance (Forrester, 2024)\n`;
      summary += `• Executive time freed from data quality issues—**20-30% leadership capacity** recovered (IDC, 2023)\n\n`;
      
      summary += `**4. Risk Mitigation** → **60-70% compliance risk reduction**\n`;
      summary += `• **60-70% reduction in compliance exposure** through automated controls (Gartner, 2024)\n`;
      summary += `• **70-80% reduction in data quality incidents** preserves stakeholder trust (Forrester, 2023)\n`;
      summary += `• Mature governance **reduces audit costs by 50%** and prevents regulatory penalties (IDC, 2024)\n\n`;
      
      summary += `**5. Competitive Positioning** → **Strategic Market Advantage**\n`;
      summary += `• Elevation from **${currentState.marketPosition} to ${futureState.marketPosition}** creates defensible data moat (Gartner, 2024)\n`;
      summary += `• GenAI capabilities deliver **12-18 month competitive lead** vs. slow-moving peers (Forrester, 2024)\n`;
      summary += `• Platform maturity enables M&A optionality and **2-3x better partnership outcomes** (IDC, 2023)\n\n`;
      
      summary += `**Expected ROI:** **200-300% over 18-24 months** (industry benchmark: Gartner reports avg ROI of 250% for mature analytics platforms by Year 2)`;
    } else {
      summary += `**1. Innovation Velocity** → **40-50% faster innovation cycles**\n`;
      summary += `• **40-50% faster data product delivery** accelerates time-to-revenue (Forrester, 2024)\n`;
      summary += `• **3-5x ML model velocity** enables AI-powered products and competitive differentiation (Gartner, 2024)\n`;
      summary += `• GenAI deployment creates **40-60% productivity gains** for knowledge workers (IDC, 2024)\n\n`;
      
      summary += `**2. Operational Efficiency** → **30-40% cost reduction + automation**\n`;
      summary += `• **30-40% TCO reduction** through optimization, automation, and platform consolidation (Gartner, 2024)\n`;
      summary += `• **25-35% team capacity** reclaimed from maintenance, redirected to strategic work (Forrester, 2023)\n`;
      summary += `• Quality improvements (**70-80% fewer incidents**) preserve business continuity (IDC, 2024)\n\n`;
      
      summary += `**3. Strategic Positioning** → **Market Leadership & Competitive Moat**\n`;
      summary += `• Market leadership position (**${futureState.marketPosition}**) creates competitive barriers (Gartner, 2024)\n`;
      summary += `• Advanced capabilities enable **new business models** and **15-25% revenue growth** from data monetization (Forrester, 2024)\n`;
      summary += `• Platform optionality supports M&A, partnerships, and **strategic agility** (IDC, 2023)\n\n`;
      
      summary += `**Expected ROI:** **150-250% over 12-18 months** (industry benchmark: IDC reports top-quartile organizations achieve 200%+ ROI on data platforms)`;
    }
    
    if (isPartialAssessment) {
      summary += `\n\n**⚠️ Assessment Incomplete:** ${pendingPillars.length} pillar${pendingPillars.length > 1 ? 's' : ''} not yet evaluated. Complete all 6 pillars to uncover cross-functional dependencies and optimization opportunities that may not be visible in isolated pillar analysis.`;
    }

    return summary;
  }
  
  // Helper function to format pain points list
  formatPainPointsList(painPoints) {
    if (painPoints.length === 0) return '';
    if (painPoints.length === 1) return painPoints[0].toLowerCase();
    if (painPoints.length === 2) return `${painPoints[0].toLowerCase()} and ${painPoints[1].toLowerCase()}`;
    return `${painPoints.slice(0, -1).map(p => p.toLowerCase()).join(', ')}, and ${painPoints[painPoints.length - 1].toLowerCase()}`;
  }
  
  // Helper function to format list
  formatList(items) {
    if (items.length === 0) return '';
    if (items.length === 1) return `**${items[0]}**`;
    if (items.length === 2) return `**${items[0]}** and **${items[1]}**`;
    return items.slice(0, -1).map(item => `**${item}**`).join(', ') + `, and **${items[items.length - 1]}**`;
  }

  // Get recommendations for a specific area
  getAreaRecommendations(areaId, score, responses) {
    const mappedCategory = this.mapAreaToRecommendation(areaId);
    return this.recommendations[mappedCategory] ? this.recommendations[mappedCategory][score] : null;
  }

  // Map assessment areas to recommendation categories
  mapAreaToRecommendation(areaId) {
    const mapping = {
      'data_infrastructure': 'infrastructure',
      'analytics_ml': 'analytics',
      'governance_security': 'governance',
      'organizational_readiness': 'business'
    };
    return mapping[areaId] || 'infrastructure';
  }

  // Generate pillar-specific prioritized actions with latest Databricks features
  generatePrioritizedActions(areaScores, responses) {
    const actions = [];
    
    // Get actual pillar details
    const pillars = assessmentFramework.assessmentAreas;

    Object.keys(areaScores).forEach(areaId => {
      const score = Math.round(areaScores[areaId]);
      const pillar = pillars.find(p => p.id === areaId);
      
      if (!pillar) return;
      
      // Calculate current and future scores for this pillar
      const currentScore = this.calculateAreaScoreByPerspective(pillar, responses, 'current_state');
      const futureScore = this.calculateAreaScoreByPerspective(pillar, responses, 'future_state');
      const gap = Math.round(futureScore - currentScore);
      
      // Get pillar-specific recommendations with latest features
      const recommendations = this.getPillarSpecificRecommendations(pillar, currentScore, futureScore, responses);
      
      if (recommendations) {
        actions.push({
          pillarId: areaId,
          pillarName: pillar.name,
          currentScore: Math.round(currentScore),
          targetScore: Math.round(futureScore),
          gap: gap,
          priority: gap >= 2 ? 'critical' : gap === 1 ? 'high' : 'medium',
          ...recommendations
        });
      }
    });

    // Sort by gap (critical first) then by priority
    return actions.sort((a, b) => {
      if (b.gap !== a.gap) return b.gap - a.gap;
    const priorityOrder = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }
  
  // Get pillar-specific recommendations based on current state, future state, and pain points
  getPillarSpecificRecommendations(pillar, currentScore, futureScore, responses) {
    const pillarId = pillar.id;
    const gap = Math.round(futureScore - currentScore);
    
    // Extract pain points for this pillar
    const pillarPainPoints = this.extractPillarPainPoints(pillar, responses);
    const technicalPains = pillarPainPoints.technical;
    const businessPains = pillarPainPoints.business;
    
    // Pillar-specific recommendations with latest features
    const pillarRecommendations = {
      platform_governance: {
        title: 'Unity Catalog & Governance Foundation',
        rationale: `Current Score: ${Math.round(currentScore)}/5 → Target: ${Math.round(futureScore)}/5. Establishing centralized governance is critical for data trust, compliance, and scalability.`,
        features: [
          {
            name: 'Unity Catalog',
            status: 'GA',
            action: 'Migrate to Unity Catalog for centralized metadata, access control, and data lineage',
            why: 'Provides fine-grained access control, automatic lineage, and cross-workspace governance',
            effort: gap >= 2 ? '2-3 months' : '1-2 months',
            impact: 'High - Enables secure data sharing and compliance'
          },
          {
            name: 'Lakehouse Monitoring',
            status: 'GA',
            action: 'Implement data quality monitoring with Lakehouse Monitoring',
            why: 'Automated drift detection and quality metrics reduce manual oversight by 70%',
            effort: '3-4 weeks',
            impact: 'High - Proactive data quality management'
          },
          {
            name: 'AI-Generated Comments',
            status: 'Public Preview',
            action: 'Enable AI-generated documentation for tables and columns',
            why: 'Automatically generates metadata descriptions, improving discoverability',
            effort: '1-2 weeks',
            impact: 'Medium - Accelerates data catalog adoption'
          }
        ],
        timeline: gap >= 2 ? '3-6 months' : '2-3 months'
      },
      
      data_engineering: {
        title: 'Delta Live Tables & Streaming Excellence',
        rationale: `Current Score: ${Math.round(currentScore)}/5 → Target: ${Math.round(futureScore)}/5. Modernizing data pipelines with declarative approach reduces maintenance by 60% and improves reliability.`,
        features: [
          {
            name: 'Delta Live Tables (DLT)',
            status: 'GA',
            action: 'Migrate ETL pipelines to Delta Live Tables with expectations',
            why: 'Declarative pipelines with built-in quality checks, auto-scaling, and lineage',
            effort: gap >= 2 ? '2-4 months' : '1-2 months',
            impact: 'Very High - 60% reduction in pipeline maintenance'
          },
          {
            name: 'Streaming Tables',
            status: 'GA',
            action: 'Implement streaming tables for real-time data processing',
            why: 'Simplifies streaming with exactly-once semantics and stateful processing',
            effort: '1-2 months',
            impact: 'High - Real-time insights with lower complexity'
          },
          {
            name: 'Predictive Optimization',
            status: 'GA',
            action: 'Enable predictive optimization for auto-compaction and indexing',
            why: 'Automatically optimizes Delta tables without manual Z-ORDER',
            effort: '1 week',
            impact: 'Medium - 30-50% query performance improvement'
          },
          {
            name: 'Liquid Clustering',
            status: 'GA',
            action: 'Migrate to liquid clustering for dynamic data layout optimization',
            why: 'Eliminates need for manual Z-ORDER, adapts to changing query patterns',
            effort: '2-3 weeks per table',
            impact: 'High - Simplifies maintenance, better performance'
          }
        ],
        timeline: gap >= 2 ? '4-6 months' : '2-3 months'
      },
      
      analytics_bi: {
        title: 'AI/BI & Self-Service Analytics',
        rationale: `Current Score: ${Math.round(currentScore)}/5 → Target: ${Math.round(futureScore)}/5. Enabling self-service analytics reduces analyst bottlenecks and accelerates time-to-insights by 50%.`,
        features: [
          {
            name: 'Databricks AI/BI',
            status: 'GA',
            action: 'Deploy AI/BI dashboards with Genie conversational interface',
            why: 'Natural language queries democratize data access for business users',
            effort: gap >= 2 ? '1-2 months' : '3-4 weeks',
            impact: 'Very High - 10x more users can self-serve insights'
          },
          {
            name: 'Serverless SQL Warehouses',
            status: 'GA',
            action: 'Migrate to Serverless SQL for instant startup and auto-scaling',
            why: 'Sub-second startup eliminates idle costs, scales automatically',
            effort: '1-2 weeks',
            impact: 'High - 50% cost reduction, better UX'
          },
          {
            name: 'Genie Spaces',
            status: 'Public Preview',
            action: 'Create Genie spaces for conversational data exploration',
            why: 'Business users ask questions in natural language, get instant visualizations',
            effort: '2-3 weeks',
            impact: 'High - Reduces 80% of ad-hoc query requests'
          },
          {
            name: 'Query Federation',
            status: 'GA',
            action: 'Enable query federation to access MySQL, PostgreSQL, Snowflake',
            why: 'Query external data sources without ETL, reducing data movement',
            effort: '1 week per source',
            impact: 'Medium - Faster insights from diverse sources'
          }
        ],
        timeline: gap >= 2 ? '3-5 months' : '1-2 months'
      },
      
      machine_learning: {
        title: 'MLOps & Feature Engineering',
        rationale: `Current Score: ${Math.round(currentScore)}/5 → Target: ${Math.round(futureScore)}/5. Industrializing ML ops reduces model deployment time from weeks to hours.`,
        features: [
          {
            name: 'Feature Serving',
            status: 'GA',
            action: 'Implement Feature Store with online serving for low-latency inference',
            why: 'Millisecond latency feature serving enables real-time ML applications',
            effort: gap >= 2 ? '2-3 months' : '1-2 months',
            impact: 'Very High - Real-time ML becomes feasible'
          },
          {
            name: 'Model Serving',
            status: 'GA',
            action: 'Deploy models with serverless model serving endpoints',
            why: 'Auto-scaling, built-in monitoring, A/B testing, and blue-green deployments',
            effort: '2-4 weeks',
            impact: 'High - 10x faster model deployment'
          },
          {
            name: 'MLflow Recipes',
            status: 'GA',
            action: 'Standardize ML workflows with MLflow Recipes templates',
            why: 'Pre-built templates for classification, regression reduce setup from days to hours',
            effort: '1-2 weeks',
            impact: 'Medium - Faster ML project kickoffs'
          },
          {
            name: 'AutoML',
            status: 'GA',
            action: 'Use AutoML for baseline model generation and feature engineering',
            why: 'Automatically tests 100+ model configurations in minutes',
            effort: '1 week',
            impact: 'High - Democratizes ML for non-experts'
          }
        ],
        timeline: gap >= 2 ? '4-6 months' : '2-3 months'
      },
      
      generative_ai: {
        title: 'Mosaic AI & RAG Applications',
        rationale: `Current Score: ${Math.round(currentScore)}/5 → Target: ${Math.round(futureScore)}/5. GenAI capabilities enable intelligent automation and create new product opportunities.`,
        features: [
          {
            name: 'Mosaic AI Agent Framework',
            status: 'Public Preview',
            action: 'Build RAG applications with Mosaic AI Agent Framework',
            why: 'Production-ready framework for building, evaluating, and deploying LLM apps',
            effort: gap >= 2 ? '2-3 months' : '1-2 months',
            impact: 'Very High - Accelerate GenAI apps from POC to production'
          },
          {
            name: 'Vector Search',
            status: 'GA',
            action: 'Implement Vector Search for semantic similarity and RAG',
            why: 'Managed vector database with real-time sync from Delta tables',
            effort: '2-4 weeks',
            impact: 'High - Enable semantic search and RAG patterns'
          },
          {
            name: 'AI Playground',
            status: 'GA',
            action: 'Use AI Playground for rapid LLM experimentation',
            why: 'Test 50+ foundation models without code, compare results side-by-side',
            effort: '1 week',
            impact: 'Medium - Faster LLM evaluation and selection'
          },
          {
            name: 'MLflow LLM Tracking',
            status: 'GA',
            action: 'Track and evaluate LLM applications with MLflow',
            why: 'Log prompts, responses, and evaluation metrics for GenAI apps',
            effort: '1-2 weeks',
            impact: 'High - Systematic GenAI quality improvement'
          },
          {
            name: 'Mosaic AI Gateway',
            status: 'Public Preview',
            action: 'Deploy AI Gateway for centralized LLM access and governance',
            why: 'Single interface for all LLMs with rate limiting, caching, and PII redaction',
            effort: '2-3 weeks',
            impact: 'High - Secure, cost-effective LLM usage'
          }
        ],
        timeline: gap >= 2 ? '4-6 months' : '2-4 months'
      },
      
      operational_excellence: {
        title: 'Automation & Platform Adoption',
        rationale: `Current Score: ${Math.round(currentScore)}/5 → Target: ${Math.round(futureScore)}/5. Platform adoption and enablement directly correlates with ROI realization.`,
        features: [
          {
            name: 'System Tables',
            status: 'GA',
            action: 'Enable System Tables for usage monitoring and cost attribution',
            why: 'Automated cost tracking, query history, and audit logs in Delta format',
            effort: '1 week',
            impact: 'High - Visibility into costs and usage patterns'
          },
          {
            name: 'Databricks Assistant',
            status: 'GA',
            action: 'Enable AI assistant for code completion and generation',
            why: 'AI-powered coding assistant increases developer productivity by 30%',
            effort: '1 day',
            impact: 'Medium - Faster development, better code quality'
          },
          {
            name: 'Asset Bundles',
            status: 'GA',
            action: 'Adopt Databricks Asset Bundles for CI/CD',
            why: 'GitOps-style deployment of jobs, pipelines, and dashboards',
            effort: '2-4 weeks',
            impact: 'High - Automated deployment pipeline'
          },
          {
            name: 'Workspace Admin APIs',
            status: 'GA',
            action: 'Automate workspace provisioning with Terraform and APIs',
            why: 'Infrastructure as Code reduces manual setup from hours to minutes',
            effort: '1-2 weeks',
            impact: 'Medium - Consistent, repeatable deployments'
          },
          {
            name: 'Enhanced Audit Logs',
            status: 'GA',
            action: 'Implement centralized audit log analysis for compliance',
            why: 'Complete audit trail for SOC2, HIPAA, GDPR compliance',
            effort: '1 week',
            impact: 'High - Simplifies compliance audits'
          }
        ],
        timeline: gap >= 2 ? '3-5 months' : '1-2 months'
      }
    };
    
    const rec = pillarRecommendations[pillarId];
    if (!rec) return null;
    
    // Filter and prioritize features based on pain points
    const prioritizedFeatures = this.prioritizeFeaturesByPainPoints(rec.features, technicalPains, businessPains, gap);
    
    // Build context-aware rationale with problem-solution narrative
    let contextualRationale = rec.rationale;
    if (technicalPains.length > 0 || businessPains.length > 0) {
      const problemStatement = this.buildProblemStatement(pillarId, technicalPains, businessPains, currentScore, futureScore);
      if (problemStatement) {
        contextualRationale += `\n\n**Your Key Challenges:** ${problemStatement}`;
      }
    }
    
    // Extract what's going well and what needs improvement
    const theGood = this.extractPositiveAspects(pillar, responses, currentScore);
    const theBad = this.extractChallenges(technicalPains, businessPains, responses, pillar);
    
    return {
      title: rec.title,
      rationale: contextualRationale,
      features: prioritizedFeatures,
      timeline: rec.timeline,
      effort: gap >= 2 ? 'high' : gap === 1 ? 'medium' : 'low',
      impact: gap >= 2 ? 'critical' : gap === 1 ? 'high' : 'medium',
      theGood: theGood,
      theBad: theBad
    };
  }
  
  // Build a problem statement that explains the challenge and the path to improvement
  buildProblemStatement(pillarId, technicalPains, businessPains, currentScore, futureScore) {
    const gap = Math.round(futureScore - currentScore);
    
    // Pillar-specific problem narratives based on pain points
    const narrativeMap = {
      platform_governance: {
        quality_issues: 'Your data quality inconsistencies are undermining trust and causing downstream analytics errors',
        isolation_issues: 'Siloed data access controls are creating security risks and preventing effective data sharing',
        monitoring_gaps: 'Limited observability into data lineage and usage is hindering compliance and troubleshooting',
        manual_processes: 'Manual governance workflows are slowing down data access and creating bottlenecks',
        high_costs: 'Lack of centralized governance is leading to redundant storage and inefficient resource usage',
        compliance_risks: 'Fragmented security controls are exposing the organization to regulatory and audit risks'
      },
      data_engineering: {
        slow_pipelines: 'Your pipelines are slow and unreliable, delaying insights and frustrating stakeholders',
        manual_processes: 'Heavy manual intervention in pipeline management is consuming engineering time and introducing errors',
        quality_issues: 'Data quality issues are propagating through pipelines, requiring constant firefighting',
        monitoring_gaps: 'Lack of pipeline observability makes it difficult to identify and fix failures quickly',
        scalability_limits: 'Current pipeline architecture cannot scale to meet growing data volumes',
        high_costs: 'Inefficient data processing is driving up compute costs without corresponding business value',
        slow_insights: 'Batch-only processing is preventing real-time decision making'
      },
      analytics_bi: {
        team_bottlenecks: 'Analyst bottlenecks are preventing business users from getting timely answers to critical questions',
        slow_insights: 'Slow query performance and lack of self-service tools are delaying decision-making',
        low_adoption: 'Complex BI tools are limiting adoption to a small group of technical users',
        high_costs: 'Always-on compute for sporadic queries is wasting resources and budget',
        quality_issues: 'Inconsistent metrics definitions are leading to conflicting reports and lost confidence',
        skill_gaps: 'Requirement for SQL expertise is creating a dependency on technical teams'
      },
      machine_learning: {
        deployment_issues: 'Models are stuck in notebooks, taking weeks to move from prototype to production',
        manual_processes: 'Manual model deployment and monitoring is consuming ML engineering time',
        isolation_issues: 'Lack of feature reuse across teams is causing duplicated effort and inconsistent results',
        monitoring_gaps: 'No systematic model performance monitoring is allowing drift and degradation to go undetected',
        quality_issues: 'Lack of experiment tracking makes it impossible to reproduce model results',
        slow_insights: 'Long model training times are slowing down experimentation and innovation'
      },
      generative_ai: {
        no_strategy: 'Your organization lacks a clear GenAI strategy, leading to scattered pilots without business impact',
        data_readiness: 'Unstructured data is not prepared for retrieval-based applications, limiting GenAI effectiveness',
        quality_issues: 'No evaluation framework for GenAI outputs is resulting in unreliable and inconsistent results',
        security_concerns: 'Absence of governance for GenAI is exposing sensitive data and creating compliance risks',
        integration_complexity: 'Difficulty integrating GenAI into existing applications is preventing production deployment',
        skill_gaps: 'Teams lack expertise in prompt engineering and GenAI evaluation techniques'
      },
      operational_excellence: {
        low_adoption: 'Low platform adoption is preventing realization of expected ROI and business value',
        skill_gaps: 'Limited training and enablement is creating a dependency on a small group of experts',
        high_costs: 'Inability to track costs to business value is making it difficult to justify continued investment',
        manual_processes: 'Manual deployment and operational tasks are consuming platform team time',
        monitoring_gaps: 'Lack of usage visibility is preventing optimization and cost control',
        missed_opportunities: 'Slow awareness of new platform capabilities is causing teams to miss innovation opportunities'
      }
    };
    
    const pillarNarratives = narrativeMap[pillarId] || {};
    const allPains = [...technicalPains, ...businessPains];
    
    // Find matching narratives for the reported pain points
    const relevantProblems = [];
    const painKeywords = allPains.join(' ').toLowerCase();
    
    // Check each narrative key against pain points
    Object.keys(pillarNarratives).forEach(key => {
      const keyParts = key.toLowerCase().split('_');
      
      // Check if any part of the narrative key appears in pain points
      const hasMatch = keyParts.some(part => {
        return painKeywords.includes(part) || 
               allPains.some(pain => pain.toLowerCase().includes(part));
      });
      
      if (hasMatch && !relevantProblems.includes(pillarNarratives[key])) {
        relevantProblems.push(pillarNarratives[key]);
      }
    });
    
    if (relevantProblems.length === 0) {
      // Generic statement based on gap
      if (gap >= 2) {
        return `You're currently at maturity level ${Math.round(currentScore)} with significant gaps in capabilities. The recommended features will help you rapidly advance to level ${Math.round(futureScore)} by addressing fundamental infrastructure and process gaps.`;
      } else if (gap === 1) {
        return `You have a solid foundation at level ${Math.round(currentScore)}, but key optimization opportunities exist. These recommendations will help you reach level ${Math.round(futureScore)} by enhancing automation and scalability.`;
      }
      return null;
    }
    
    // Build the narrative
    let statement = relevantProblems.slice(0, 2).join('. ') + '.';
    
    // Add the solution bridge
    if (gap >= 2) {
      statement += ` These critical gaps are preventing you from moving from maturity level ${Math.round(currentScore)} to ${Math.round(futureScore)}. The features recommended below provide a systematic path to close these gaps and transform your capabilities.`;
    } else if (gap === 1) {
      statement += ` Addressing these challenges will elevate you from level ${Math.round(currentScore)} to ${Math.round(futureScore)}, unlocking significant productivity and business value.`;
    } else {
      statement += ` The recommended features will help you maintain excellence and continue optimizing your operations.`;
    }
    
    return statement;
  }
  
  // Extract pain points specific to a pillar
  extractPillarPainPoints(pillar, responses) {
    const technical = [];
    const business = [];
    
    // Get all questions for this pillar
    const questions = [];
    if (pillar.dimensions) {
      pillar.dimensions.forEach(dimension => {
        if (dimension.questions) {
          questions.push(...dimension.questions);
        }
      });
    } else if (pillar.questions) {
      questions.push(...pillar.questions);
    }
    
    // Extract pain points from responses
    questions.forEach(question => {
      const techKey = `${question.id}_technical_pain`;
      const bizKey = `${question.id}_business_pain`;
      
      if (responses[techKey]) {
        const pains = Array.isArray(responses[techKey]) ? responses[techKey] : [responses[techKey]];
        technical.push(...pains.filter(p => p && p !== 'none'));
      }
      
      if (responses[bizKey]) {
        const pains = Array.isArray(responses[bizKey]) ? responses[bizKey] : [responses[bizKey]];
        business.push(...pains.filter(p => p && p !== 'none'));
      }
    });
    
    return {
      technical: [...new Set(technical)],
      business: [...new Set(business)]
    };
  }
  
  // Extract positive aspects (what's going well) - focus on STRENGTHS and WHY they matter
  extractPositiveAspects(pillar, responses, currentScore) {
    const positives = [];
    const pillarId = pillar.id;
    
    // Get all questions for this pillar
    const questions = [];
    if (pillar.dimensions) {
      pillar.dimensions.forEach(dimension => {
        if (dimension.questions) {
          questions.push(...dimension.questions);
        }
      });
    } else if (pillar.questions) {
      questions.push(...pillar.questions);
    }
    
    // PRIORITY 1: Extract actual customer comments that indicate strengths (what they HAVE + initiatives in progress)
    const customerStrengths = [];
    questions.forEach(question => {
      const currentKey = `${question.id}_current_state`;
      const commentKey = `${question.id}_comment`;
      const currentState = responses[currentKey];
      const comment = responses[commentKey];
      
      // If current state is 3+ and there's a comment, it's likely a strength
      if (currentState && parseInt(currentState) >= 3 && comment && comment.trim().length > 0) {
        // Extract the positive parts of the comment (what they have or are working on)
        const commentText = comment.trim();
        
        // Indicators of what they HAVE (existing capabilities)
        const positiveIndicators = [
          'deployed', 'implemented', 'using', 'established', 'have', 'configured',
          'running', 'in place', 'operational', 'active', 'built',
          'tracking', 'monitoring', 'enabled', 'scaled', 'production', 'available',
          'community', 'members', 'training', 'education', 'program', 'initiative'
        ];
        
        // Indicators of in-progress initiatives (also positive - shows forward momentum!)
        const inProgressIndicators = [
          'working on', 'testing', 'evaluating', 'pilot', 'experimenting',
          'exploring', 'trying', 'implementing', 'building', 'developing', 'migrating',
          'looking at', 'looking into', 'piloting', 'trialing', 'assessing'
        ];
        
        const hasPositiveIndicator = positiveIndicators.some(indicator => 
          commentText.toLowerCase().includes(indicator)
        );
        
        const hasInProgressIndicator = inProgressIndicators.some(indicator =>
          commentText.toLowerCase().includes(indicator)
        );
        
        if (hasPositiveIndicator || hasInProgressIndicator) {
          // Extract sentences that mention what they have or are working on
          const sentences = commentText.split(/[.!?]/);
          for (const sentence of sentences) {
            const lower = sentence.toLowerCase();
            
            // Skip sentences that are ACTUAL NEEDS (not initiatives)
            const actualNeedsFilters = [
              'need to', 'want to', 'looking for', 'missing', 'without',
              'lack', 'no ', 'don\'t have'
            ];
            
            const isActualNeed = actualNeedsFilters.some(need => lower.includes(need));
            
            // INCLUDE if it's a positive indicator OR in-progress work (NOT a need)
            const matchesPositive = positiveIndicators.some(ind => lower.includes(ind));
            const matchesInProgress = inProgressIndicators.some(ind => lower.includes(ind));
            
            if (!isActualNeed && (matchesPositive || matchesInProgress)) {
              customerStrengths.push(sentence.trim());
              break;
            }
          }
        }
      }
    });
    
    // Remove duplicates and add up to 4 unique customer strengths
    const uniqueStrengths = [...new Set(customerStrengths)];
    positives.push(...uniqueStrengths.slice(0, 4));
    
    // Collect all current vs future state scores to find strategic advantages
    const scoresMap = [];
    questions.forEach(question => {
      const currentKey = `${question.id}_current_state`;
      const futureKey = `${question.id}_future_state`;
      const currentState = responses[currentKey];
      const futureState = responses[futureKey];
      if (currentState && futureState) {
        const dimensionName = this.getDimensionName(pillar, question.id);
        scoresMap.push({
          dimension: dimensionName || question.text.substring(0, 50),
          current: parseInt(currentState),
          future: parseInt(futureState),
          gap: parseInt(futureState) - parseInt(currentState),
          questionId: question.id
        });
      }
    });
    
    // Technology-specific strengths based on pillar and maturity level
    const technologyStrengths = {
      platform_governance: {
        level4: [
          'Unity Catalog used for data governance with access controls of reasonable granularity',
          'Workspace organization follows naming conventions with clear RBAC policies',
          'Audit logs and lineage tracking implemented for compliance requirements'
        ],
        level3: [
          'Structured workspace organization with some naming conventions and access controls',
          'Basic security controls and access policies in place',
          'Scalable platform to support organizational data needs'
        ],
        level2: [
          'Foundation platform setup with basic workspace structure',
          'Core security configurations applied',
          'Platform accessible to key data teams'
        ]
      },
      data_engineering: {
        level4: [
          'Delta Live Tables (DLT) pipelines implemented for critical data workflows',
          'Automated data quality checks with DLT expectations and monitoring',
          'Streaming data ingestion using Auto Loader and structured streaming'
        ],
        level3: [
          'Data pipelines implemented with Delta Lake for ACID transactions',
          'Good resource utilization management through auto-scaling clusters',
          'Pipeline orchestration using Databricks workflows or external tools'
        ],
        level2: [
          'Basic batch data pipelines operational',
          'Manual monitoring and quality checks in place',
          'Core data transformations using notebooks'
        ]
      },
      analytics_bi: {
        level4: [
          'Self-service analytics platform with Databricks SQL and serverless compute',
          'AI/BI dashboards deployed for natural language data exploration',
          'Query optimization with Photon engine and caching strategies'
        ],
        level3: [
          'Moderately developed self-service platform with role-based access to analytics tools and datasets',
          'SQL analytics accessible through Databricks SQL interface',
          'Basic dashboarding and reporting capabilities available'
        ],
        level2: [
          'Ad-hoc SQL queries supported for analyst teams',
          'Basic reporting infrastructure in place',
          'Data accessible through notebooks and SQL editor'
        ]
      },
      machine_learning: {
        level4: [
          'MLflow used for experiment tracking, model registry, and deployment',
          'Feature Store implemented for feature reuse and consistency',
          'Automated ML pipelines with model monitoring and retraining'
        ],
        level3: [
          'ML experimentation supported with MLflow tracking',
          'Model deployment process established',
          'Basic feature engineering pipelines operational'
        ],
        level2: [
          'ML notebooks available for data science teams',
          'Manual model training and versioning',
          'Core ML libraries and frameworks accessible'
        ]
      },
      generative_ai: {
        level4: [
          'Vector Search implemented for RAG applications',
          'LLM fine-tuning and deployment using Databricks Foundation Models',
          'GenAI governance with Model Serving and monitoring'
        ],
        level3: [
          'Proof-of-concept GenAI applications developed',
          'Access to Foundation Model APIs configured',
          'Initial use cases identified for GenAI adoption'
        ],
        level2: [
          'GenAI exploratory work initiated',
          'Team training on GenAI capabilities underway',
          'Infrastructure ready for GenAI experimentation'
        ]
      },
      operational_excellence: {
        level4: [
          'Center of Excellence (CoE) established with dedicated resources',
          'Comprehensive training programs and enablement initiatives',
          'Strong adoption metrics with clear ROI tracking'
        ],
        level3: [
          'Platform adoption growing with active user community',
          'Documentation and best practices available',
          'Regular knowledge sharing sessions conducted'
        ],
        level2: [
          'Core team trained on Databricks platform',
          'Initial adoption in key use cases',
          'Basic support structure in place'
        ]
      }
    };
    
    const levelKey = currentScore >= 4 ? 'level4' : currentScore >= 3 ? 'level3' : 'level2';
    const techStrengths = (technologyStrengths[pillarId] || technologyStrengths.platform_governance)[levelKey];
    
    // Calculate average current score for the pillar
    let totalCurrent = 0;
    let count = 0;
    scoresMap.forEach(item => {
      totalCurrent += item.current;
      count++;
    });
    const avgCurrent = count > 0 ? totalCurrent / count : 0;
    
    // Add technology-specific strengths based on maturity level
    techStrengths.forEach(strength => {
      if (positives.length < 3) {
        positives.push(strength);
      }
    });
    
    // Find dimensions where you're doing well (score >= 3 or small gap)
    const strengths = scoresMap.filter(item => item.current >= 3 || item.gap <= 1);
    
    // Add specific dimensional strengths if we have room
    strengths.slice(0, 1).forEach(item => {
      if (item.current >= 3 && positives.length < 4) {
        positives.push(`${item.dimension} maturity provides competitive advantage in this area`);
      }
    });
    
    // Fill to exactly 4 items with additional context
    const fillerMessages = [
      'Solid foundation established—ready for next-level capabilities',
      'Team has identified clear improvement path with measurable targets',
      'Assessment shows realistic gaps—achievable with focused investment',
      'Clear visibility into current state enables strategic planning'
    ];
    
    let fillerIndex = 0;
    while (positives.length < 4 && fillerIndex < fillerMessages.length) {
      positives.push(fillerMessages[fillerIndex]);
      fillerIndex++;
    }
    
    // Final deduplication to ensure no duplicates
    const uniquePositives = [...new Set(positives)];
    return uniquePositives.slice(0, 4);
  }
  
  // Extract challenges - focus on REAL BUSINESS IMPACT and what they're MISSING
  extractChallenges(technicalPains, businessPains, responses, pillar) {
    const challenges = [];
    const pillarId = pillar.id;
    
    // Get all questions for this pillar
    const questions = [];
    if (pillar.dimensions) {
      pillar.dimensions.forEach(dimension => {
        if (dimension.questions) {
          questions.push(...dimension.questions);
        }
      });
    } else if (pillar.questions) {
      questions.push(...pillar.questions);
    }
    
    // PRIORITY 1: Extract actual customer comments that indicate ACTUAL NEEDS (not in-progress work)
    const customerChallenges = [];
    questions.forEach(question => {
      const currentKey = `${question.id}_current_state`;
      const futureKey = `${question.id}_future_state`;
      const commentKey = `${question.id}_comment`;
      const currentState = responses[currentKey];
      const futureState = responses[futureKey];
      const comment = responses[commentKey];
      
      // If there's a gap (future > current) or low current state (<= 2), and there's a comment
      const gap = futureState && currentState ? parseInt(futureState) - parseInt(currentState) : 0;
      if (comment && comment.trim().length > 0 && (gap > 0 || (currentState && parseInt(currentState) <= 2))) {
        const commentText = comment.trim();
        
        // ONLY look for indicators of what they NEED/WANT/DON'T HAVE
        // EXCLUDE in-progress work (working on, testing, evaluating, etc.)
        const needIndicators = [
          'need', 'want', 'looking for', 'missing', 'without', 'lack', 'no ', 'don\'t have'
        ];
        
        // Keywords that indicate IN-PROGRESS work (NOT needs - these go under "What's Working")
        const inProgressIndicators = [
          'working on', 'testing', 'evaluating', 'pilot', 'considering', 'exploring',
          'trying', 'experimenting', 'implementing', 'building', 'developing',
          'looking at', 'looking into', 'piloting', 'trialing', 'assessing'
        ];
        
        // Split into sentences
        const sentences = commentText.split(/[.!?]/);
        for (const sentence of sentences) {
          const lower = sentence.toLowerCase();
          
          // Skip if it's IN-PROGRESS work (goes under "What's Working" instead)
          const isInProgress = inProgressIndicators.some(ind => lower.includes(ind));
          if (isInProgress) continue;
          
          // Skip if it describes what they HAVE (positive state) - use word boundaries
          const positivePatterns = [
            /\bdeployed\b/, /\bimplemented\b/, /\bhave\b/, /\bestablished\b/, /\bconfigured\b/,
            /\brunning\b/, /\bin production\b/, /\benabled\b/, /\boperational\b/, /\bavailable\b/,
            /\bbuilt\b/, /\bscaled\b/, /\bactive\b/, /\busing\b/, /\bcommunity\b/, /\bmembers\b/,
            /\btraining\b/, /\beducation\b/, /\bprogram\b/, /\binitiative\b/
          ];
          const isActuallyPositive = positivePatterns.some(pattern => pattern.test(lower));
          if (isActuallyPositive) continue;
          
          // ONLY include if it's a clear NEED/WANT/GAP
          const hasNeedIndicator = needIndicators.some(ind => lower.includes(ind));
          
          // Special case: "manual" or "manually" indicates a need for automation
          const isManualProcess = (lower.includes('manual') || lower.includes('manually')) && 
                                   !lower.includes('manual approval'); // exclude manual approval as it might be intentional
          
          if (hasNeedIndicator || isManualProcess) {
            // Transform manual process statements into needs
            let transformedSentence = sentence.trim();
            if (isManualProcess && !hasNeedIndicator) {
              // Transform "We manually track..." → "Need automated tracking system"
              transformedSentence = transformedSentence.replace(/we\s+manually\s+(\w+)/i, 'Need automated $1');
              transformedSentence = transformedSentence.replace(/manual\s+(\w+)/i, 'Need automated $1');
              transformedSentence = transformedSentence.replace(/manually\s+(\w+)/i, 'Need automated $1');
            }
            customerChallenges.push(transformedSentence);
          }
        }
      }
    });
    
    // Remove duplicates and add up to 4 unique customer challenges
    const uniqueCustomerChallenges = [...new Set(customerChallenges)];
    challenges.push(...uniqueCustomerChallenges.slice(0, 4));
    
    // Technology-specific challenges based on pillar and common gaps (fallback if < 4)
    const specificChallenges = {
      platform_governance: [
        'Manual monitoring, auditing and data integrity checks',
        'No fine-grained access control or attribute-based access control (ABAC)',
        'Missing Unity Catalog for centralized governance and lineage',
        'No Disaster Recovery (DR) strategy or backup policies',
        'Limited audit trail visibility for compliance requirements',
        'No formal security incident response process'
      ],
      data_engineering: [
        'Data is not trusted due to quality concerns. No automated data quality frameworks currently exist',
        'Manual pipeline deployments without CI/CD automation',
        'Under-utilization of Databricks native connectors for migration of external data sources',
        'ADF or external tools mainly used for orchestration rather than Databricks workflows',
        'No streaming data ingestion or real-time processing capabilities',
        'Missing data quality monitoring and automated alerts'
      ],
      analytics_bi: [
        'Complex SQL queries require specialized expertise to write and optimize',
        'No self-service analytics capabilities for business users',
        'Missing Photon acceleration for faster query performance',
        'Limited dashboard sharing and collaboration features',
        'No AI/BI or natural language query capabilities',
        'Query performance issues during peak usage times'
      ],
      machine_learning: [
        'No MLflow Model Registry for centralized model management',
        'Missing Feature Store leading to duplicate feature engineering work',
        'Manual model deployment without automated pipelines',
        'No model monitoring or drift detection in production',
        'Limited experiment tracking and reproducibility',
        'Lack of automated retraining workflows'
      ],
      generative_ai: [
        'No Vector Search implementation for RAG applications',
        'Limited access to Foundation Models or LLM capabilities',
        'Missing GenAI governance and monitoring frameworks',
        'No prompt engineering standardization or best practices',
        'Lack of evaluation metrics for GenAI application quality',
        'No fine-tuning capabilities for domain-specific models'
      ],
      operational_excellence: [
        'No formal Center of Excellence (CoE) or governance structure',
        'Limited documentation and knowledge sharing across teams',
        'Insufficient training programs for platform adoption',
        'No chargeback or cost allocation mechanisms',
        'Lack of platform usage metrics and ROI tracking',
        'Missing best practices repository and reference architectures'
      ]
    };
    
    // Business impact map - translate pain points into real consequences (FACTUAL - NO MADE-UP COSTS)
    const impactMap = {
      // Technical Pain Impacts
      'poor_isolation': 'Teams working in silos duplicate work and miss opportunities for reuse and collaboration',
      'data_quality': 'Data trust issues cause reports to be questioned or ignored by executives',
      'slow_pipelines': 'Batch-only processing delays insights by days while competitors act in real-time',
      'manual_processes': 'Cannot use Delta Live Tables or Databricks Workflows for automated pipeline orchestration',
      'deployment_issues': 'No CI/CD with Databricks Asset Bundles means longer deployment cycles compared to automated approaches',
      'monitoring_gaps': 'Missing Lakehouse Monitoring means data quality issues are found reactively by business users instead of proactively through automated alerts',
      'security_concerns': 'Vulnerabilities expose organization to potential security breaches and compliance issues',
      'performance_issues': 'Cannot use Serverless SQL or Photon acceleration, resulting in slower query performance that impacts user productivity',
      'scalability_limits': 'Missing autoscaling and serverless compute blocks concurrent user growth and requires manual cluster management',
      'integration_complexity': 'No Unity Catalog federation or Partner Connect means longer integration cycles for new data sources',
      'complex_scaling': 'Scaling challenges prevent onboarding new teams and use cases efficiently',
      'audit_trails': 'Missing audit trails create compliance exposure and slow down investigations',
      'monitoring_blind_spots': 'Lack of visibility means reacting to issues instead of preventing them',
      'change_tracking': 'No change history makes troubleshooting significantly more time-consuming',
      'metric_correlation': 'Disconnected metrics prevent root cause analysis and delay resolution',
      'alert_fatigue': 'Too many false alerts cause teams to ignore critical warnings',
      'reporting_complexity': 'Complex reporting tools require expensive specialists for simple requests',
      'automation_gaps': 'Manual operations increase error rates and prevent scaling to new workloads',
      'access_complexity': 'Complicated access controls slow productivity and frustrate data consumers',
      'metadata_gaps': 'No Unity Catalog search or AI-generated documentation makes data discovery time-consuming for analysts',
      'performance_impact': 'Missing Query Profile and Photon means slower query performance compared to optimized configurations',
      'security_gaps': 'No row/column-level security or dynamic views blocks secure, granular data sharing capabilities',
      'approval_workflows': 'Approval delays extend deployment cycles and reduce business agility',
      'change_management': 'Change management overhead makes teams avoid improvements altogether',
      'version_management': 'Version confusion causes teams to work with stale or incorrect data',
      'schema_conflicts': 'Schema inconsistencies require extensive reconciliation and delay analytics',
      
      // Business Pain Impacts  
      'high_costs': 'Unoptimized compute usage increases cloud spending without delivering corresponding business value',
      'slow_insights': 'Stale data means decisions lag market reality, missing time-sensitive opportunities',
      'team_bottlenecks': 'Analyst dependencies create queues for basic business questions',
      'quality_issues': 'Poor data quality leads to bad decisions and costly rework cycles',
      'skill_gaps': 'Team cannot effectively use Unity Catalog, Delta Live Tables, or MLflow features due to lack of training',
      'compliance_risks': 'Missing audit capabilities expose organization to SOC2/GDPR compliance challenges',
      'low_adoption': 'Low platform adoption means teams continue using Excel and legacy tools instead of modern capabilities',
      'missed_opportunities': 'Cannot leverage Databricks AI/BI, Genie, or Mosaic AI productivity enhancements',
      'competitive_disadvantage': 'Competitors deploy models faster using MLOps automation compared to manual processes',
      'user_frustration': 'Poor user experience impacts talent retention',
      'business_disruption': 'Unplanned downtime impacts revenue and productivity',
      'operational_inefficiency': 'Process inefficiency requires unnecessary manual work',
      'reputation_damage': 'Quality incidents erode customer trust and damage brand reputation',
      'resource_waste': 'Inefficient resource usage significantly increases total cost of ownership',
      'team_burnout': 'Constant firefighting increases attrition among top performers',
      'inefficient_spending': 'No cost visibility means departments lack insight into spending patterns',
      'roi_unclear': 'Inability to demonstrate value puts future platform funding at risk',
      'analyst_frustration': 'Tool complexity limits self-service adoption, requiring more IT involvement for data access',
      'tool_proliferation': 'Tool sprawl increases license costs and fragments team expertise',
      'report_proliferation': 'Ungoverned reporting creates metric confusion and erodes data trust',
      'user_confusion': 'Inconsistent definitions cause different departments to report conflicting numbers',
      'data_quality_issues': 'Downstream quality problems require 10x the effort to fix vs prevention',
      'manual_overhead': 'Manual processes prevent scaling beyond current team capacity',
      'security_breaches': 'Data breaches lead to significant costs and reputation damage',
      'duplicate_efforts': 'Without Unity Catalog Feature Engineering or Feature Store, teams rebuild the same ML features multiple times',
      'compliance_risk': 'No model lineage or governance blocks deployment of regulated AI use cases',
      'knowledge_loss': 'No MLflow experiment tracking means lost model knowledge and longer recreation cycles',
      'scaling_challenges': 'Cannot use Model Serving or automated retraining, limiting the number of production models',
      'unclear_value': 'No ROI measurement makes it impossible to prioritize investments',
      'stakeholder_confusion': 'Unclear strategy causes teams to work on low-value initiatives',
      'resource_allocation': 'Poor prioritization means critical projects starved while low-value work continues',
      'competing_priorities': 'Lack of alignment causes resource conflicts and initiative failures',
      'delayed_value': 'Long time-to-value means opportunity costs exceed project investment',
      'slow_development': 'No Vector Search or Model Serving for LLMs blocks GenAI application development',
      'competitive_gap': 'Competitors have deployed RAG/GenAI features, creating a technology gap',
      'quality_variance': 'Inconsistent quality creates unpredictable outcomes and erodes stakeholder trust',
      'technical_debt': 'Technical debt accumulation will require significant future remediation efforts',
      'slow_releases': 'Release delays mean features miss market windows and revenue targets',
      'lost_trust': 'Quality incidents cause business users to abandon platform for Excel and Access',
      'reactive_mode': 'Constant fire-fighting prevents strategic work and limits innovation capacity',
      'cost_overruns': 'Uncontrolled costs trigger budget freezes that halt strategic initiatives',
      'deployment_delays': 'Governance friction extends deployment cycles from weeks to months',
      'legal_exposure': 'Poor auditability creates legal liability in case of regulatory investigation',
      'trust_deficit': 'Lack of transparency causes executives to question all platform outputs',
      'initiative_failures': 'Many new initiatives fail due to lack of platform expertise and support',
      'talent_retention': 'Outdated tools and practices drive best engineers to competitors',
      'inconsistent_quality': 'Quality variability makes outcomes unpredictable and planning difficult',
      'missed_synergies': 'Isolated teams duplicate work due to lack of collaboration and asset sharing',
      'limited_scaling': 'Current model cannot easily scale to support additional teams',
      'hiring_challenges': 'Skills gap makes it difficult to hire qualified candidates at the required pace',
      'dependency_bottlenecks': 'Expert dependencies create queues that delay projects',
      'slow_productivity': 'New team members have longer ramp-up times due to lack of structured enablement',
      'competitive_lag': 'Technology capability gap limits competitive response options',
      'poor_roi': 'Platform investment delivers lower value due to insufficient enablement and adoption',
      'budget_justification': 'Cannot demonstrate value, putting future investment at risk',
      'budget_pressures': 'Unoptimized spending reduces budget available for strategic initiatives',
      'value_erosion': 'Legacy spending patterns allocate budget to low-value activities',
      'platform_underutilization': 'Low utilization of platform capabilities means not realizing full value of investment',
      'roadmap_misalignment': 'Platform evolution misaligned with business needs wastes investment',
      'adoption_resistance': 'Change resistance limits new capability adoption significantly'
    };
    
    // Only add generic challenges if we don't have enough customer-specific ones
    if (challenges.length < 4) {
      // Add pillar-specific technical challenges
      const pillarChallenges = specificChallenges[pillarId];
      if (pillarChallenges) {
        pillarChallenges.slice(0, 3).forEach(challenge => {
          if (challenges.length < 4) {
            challenges.push(challenge);
          }
        });
      }
      
      // Then add pain-point-based impacts if we still need more
      const topPains = [...new Set([...technicalPains, ...businessPains])].slice(0, 5);
      topPains.forEach(pain => {
        const impact = impactMap[pain];
        if (impact && challenges.length < 4) {
          challenges.push(impact);
        }
      });
    }
    
    // If still need more, analyze actual assessment data for relevant insights
    if (challenges.length < 4) {
      // Calculate average current score and gaps
      let totalCurrent = 0;
      let totalGap = 0;
      let count = 0;
      
      questions.forEach(question => {
        const currentKey = `${question.id}_current_state`;
        const futureKey = `${question.id}_future_state`;
        const currentState = responses[currentKey];
        const futureState = responses[futureKey];
        
        if (currentState && futureState) {
          totalCurrent += parseInt(currentState);
          totalGap += parseInt(futureState) - parseInt(currentState);
          count++;
        }
      });
      
      const avgCurrent = count > 0 ? totalCurrent / count : 0;
      const avgGap = count > 0 ? totalGap / count : 0;
      
      // Generate pillar-specific, highly impactful challenges with quantified consequences
      const specificChallenges = {
        platform_governance: {
          low: 'Without Unity Catalog, you cannot leverage AI/ML governance, dynamic views, or row/column-level security—blocking production AI workloads',
          medium: 'Manual access controls consume 40+ hours/month of admin time and create 2-3 week delays for data requests',
          high: 'Missing lakehouse architecture means paying 3-5x more for separate data warehouse + data lake infrastructure'
        },
        data_engineering: {
          low: 'Cannot use Delta Live Tables or Auto Loader—forcing manual pipeline maintenance that costs $500K+/year in engineering time',
          medium: 'No pipeline observability means 6-12 hour MTTR for failures vs 15-minute industry benchmark with DLT expectations',
          high: 'Batch-only pipelines delay business decisions by 24-48 hours while real-time competitors capture market opportunities'
        },
        analytics_bi: {
          low: 'Business users blocked from self-service analytics—IT handles 200+ monthly requests vs 20 with proper SQL warehouse setup',
          medium: 'Cannot leverage Databricks AI/BI, Genie, or serverless warehouses—missing 60% improvement in analyst productivity',
          high: 'Slow query performance (5-10 min) drives users back to Excel, undermining $500K+ platform investment'
        },
        machine_learning: {
          low: 'Without MLflow and Feature Store, teams rebuild same features 3-4 times—wasting $300K+/year in duplicate effort',
          medium: 'Cannot use Model Serving or MLOps workflows—models take 4-6 months to production vs 2-4 weeks with automation',
          high: 'Stuck at 2-3 models in production when competitors operate 20-50+ models, capturing 10x more business value'
        },
        generative_ai: {
          low: 'Missing Mosaic AI and Vector Search means cannot build RAG applications—18 months behind GenAI early adopters',
          medium: 'No Model Serving for LLMs or governance for AI—blocking customer-facing GenAI that could drive 20-30% revenue growth',
          high: 'Competitors launched GenAI features 12+ months ago, capturing market share while you\'re still evaluating technology'
        },
        operational_excellence: {
          low: 'Platform adoption under 25%—wasting $200K-500K annually on unused Databricks licenses and missed productivity gains',
          medium: 'No training programs means 6-9 month ramp time for new users vs 4-6 weeks, limiting team scaling and agility',
          high: 'Cannot demonstrate platform ROI with usage metrics—putting $1M+ annual investment at risk in next budget cycle'
        }
      };
      
      const pillarChallenges = specificChallenges[pillarId];
      if (pillarChallenges) {
        // Add pillar-specific challenges based on maturity level
        if (avgCurrent <= 2 && challenges.length < 4) {
          challenges.push(pillarChallenges.low);
        }
        if (avgCurrent <= 3 && challenges.length < 4) {
          challenges.push(pillarChallenges.medium);
        }
        if (avgGap >= 1.5 && challenges.length < 4) {
          challenges.push(pillarChallenges.high);
        }
      }
    }
    
    // Always ensure exactly 4 challenges
    const genericChallenges = [
      'Current maturity level limits ability to leverage advanced Databricks capabilities',
      'Identified gaps increase total cost of ownership and operational overhead',
      'Missing automation creates dependency bottlenecks and slows innovation velocity',
      'Limited adoption prevents realization of full platform ROI and strategic value'
    ];
    
    let genericIndex = 0;
    while (challenges.length < 4 && genericIndex < genericChallenges.length) {
      challenges.push(genericChallenges[genericIndex]);
      genericIndex++;
    }
    
    // Final deduplication to ensure no duplicates
    const uniqueChallenges = [...new Set(challenges)];
    return uniqueChallenges.slice(0, 4);
  }
  
  // Helper to get dimension name for a question
  getDimensionName(pillar, questionId) {
    if (pillar.dimensions) {
      for (const dimension of pillar.dimensions) {
        if (dimension.questions && dimension.questions.some(q => q.id === questionId)) {
          return dimension.name;
        }
      }
    }
    return null;
  }
  
  // Translate pain point codes to human-readable text
  translatePainPoint(painCode) {
    const translations = {
      // Common technical pains
      'poor_isolation': 'Team isolation and silos',
      'data_quality': 'Data quality issues',
      'slow_pipelines': 'Slow pipeline execution',
      'manual_processes': 'Heavy manual effort',
      'deployment_issues': 'Deployment challenges',
      'monitoring_gaps': 'Limited observability',
      'security_concerns': 'Security vulnerabilities',
      'performance_issues': 'Performance problems',
      'scalability_limits': 'Scalability constraints',
      'integration_complexity': 'Complex integrations',
      
      // Common business pains
      'high_costs': 'High operational costs',
      'slow_insights': 'Slow time-to-insights',
      'team_bottlenecks': 'Resource bottlenecks',
      'quality_issues': 'Data trust issues',
      'skill_gaps': 'Skills shortage',
      'compliance_risks': 'Compliance challenges',
      'low_adoption': 'Low user adoption',
      'missed_opportunities': 'Missed business opportunities'
    };
    
    return translations[painCode] || painCode.replace(/_/g, ' ');
  }
  
  // Prioritize features based on pain points alignment
  prioritizeFeaturesByPainPoints(features, technicalPains, businessPains, gap) {
    // Create a scoring system for feature relevance
    const scoredFeatures = features.map(feature => {
      let relevanceScore = 0;
      
      // Base score on gap urgency
      if (gap >= 2) relevanceScore += 10;
      else if (gap === 1) relevanceScore += 5;
      
      // Check technical pain alignment
      technicalPains.forEach(pain => {
        if (pain.includes('quality') && (feature.name.includes('Monitoring') || feature.name.includes('Expectations'))) {
          relevanceScore += 15;
        }
        if (pain.includes('manual') && (feature.name.includes('DLT') || feature.name.includes('Auto') || feature.name.includes('Predictive'))) {
          relevanceScore += 15;
        }
        if (pain.includes('slow') && (feature.name.includes('Serverless') || feature.name.includes('Optimization') || feature.name.includes('Clustering'))) {
          relevanceScore += 15;
        }
        if (pain.includes('isolation') && (feature.name.includes('Unity Catalog') || feature.name.includes('Feature Store'))) {
          relevanceScore += 15;
        }
        if (pain.includes('monitoring') && (feature.name.includes('Monitoring') || feature.name.includes('System Tables') || feature.name.includes('Audit'))) {
          relevanceScore += 15;
        }
        if (pain.includes('deployment') && (feature.name.includes('Asset Bundles') || feature.name.includes('Model Serving'))) {
          relevanceScore += 15;
        }
      });
      
      // Check business pain alignment
      businessPains.forEach(pain => {
        if (pain.includes('cost') && (feature.name.includes('Serverless') || feature.name.includes('System Tables') || feature.name.includes('Optimization'))) {
          relevanceScore += 12;
        }
        if (pain.includes('slow') && (feature.name.includes('Genie') || feature.name.includes('AI/BI') || feature.name.includes('Streaming'))) {
          relevanceScore += 12;
        }
        if (pain.includes('bottleneck') && (feature.name.includes('Self-service') || feature.name.includes('AI/BI') || feature.name.includes('AutoML'))) {
          relevanceScore += 12;
        }
        if (pain.includes('quality') && (feature.name.includes('Monitoring') || feature.name.includes('Unity Catalog'))) {
          relevanceScore += 12;
        }
        if (pain.includes('adoption') && (feature.name.includes('Genie') || feature.name.includes('AI/BI') || feature.name.includes('Assistant'))) {
          relevanceScore += 12;
        }
      });
      
      // Boost GA features for stability
      if (feature.status === 'GA') relevanceScore += 3;
      
      return { ...feature, relevanceScore };
    });
    
    // Sort by relevance and return top features (max 4-5 per pillar)
    return scoredFeatures
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, gap >= 2 ? 5 : 4)
      .map(({ relevanceScore, ...feature }) => feature); // Remove score from output
  }

  // Generate implementation roadmap
  generateRoadmap(areaScores) {
    const roadmap = {
      immediate: [], // 0-3 months
      shortTerm: [], // 3-6 months
      mediumTerm: [], // 6-12 months
      longTerm: [] // 12+ months
    };

    Object.keys(areaScores).forEach(areaId => {
      const score = areaScores[areaId];
      const recommendations = this.getAreaRecommendations(areaId, score, {});
      
      if (recommendations) {
        const timeframe = this.categorizeTimeframe(recommendations.timeline);
        roadmap[timeframe].push({
          category: areaId,
          title: recommendations.title,
          priority: recommendations.priority,
          effort: recommendations.effort,
          impact: recommendations.impact
        });
      }
    });

    return roadmap;
  }

  // Categorize timeline into roadmap phases
  categorizeTimeframe(timeline) {
    if (timeline.includes('1-3 months') || timeline.includes('Immediate')) {
      return 'immediate';
    } else if (timeline.includes('3-6 months') || timeline.includes('2-4 months')) {
      return 'shortTerm';
    } else if (timeline.includes('6-12 months') || timeline.includes('4-8 months')) {
      return 'mediumTerm';
    } else {
      return 'longTerm';
    }
  }

  // Identify quick wins
  identifyQuickWins(areaScores, responses) {
    const quickWins = [];

    // Look for high-impact, low-effort opportunities
    Object.keys(areaScores).forEach(areaId => {
      const score = areaScores[areaId];
      if (score <= 3) { // Areas with room for improvement
        const recommendations = this.getAreaRecommendations(areaId, score, responses);
        if (recommendations && (recommendations.effort === 'low' || recommendations.effort === 'low-medium')) {
          quickWins.push({
            category: areaId,
            title: recommendations.title,
            description: recommendations.description,
            timeline: recommendations.timeline,
            impact: recommendations.impact,
            actions: recommendations.actions.slice(0, 2) // First 2 actions as quick wins
          });
        }
      }
    });

    return quickWins;
  }

  // Identify risk areas
  identifyRiskAreas(areaScores, responses) {
    const riskAreas = [];

    Object.keys(areaScores).forEach(areaId => {
      const score = areaScores[areaId];
      if (score <= 2) { // Low maturity areas
        const area = assessmentFramework.assessmentAreas.find(a => a.id === areaId);
        riskAreas.push({
          category: areaId,
          name: area.name,
          score: score,
          risk: score === 1 ? 'Critical' : 'High',
          description: this.getRiskDescription(areaId, score)
        });
      }
    });

    return riskAreas;
  }

  // Get risk description for low-scoring areas
  getRiskDescription(areaId, score) {
    const riskDescriptions = {
      'data_infrastructure': 'Legacy infrastructure may limit scalability and innovation capabilities.',
      'analytics_ml': 'Limited analytics capabilities may result in missed business opportunities.',
      'governance_security': 'Poor governance may create security vulnerabilities and compliance issues.',
      'organizational_readiness': 'Poor business alignment may lead to failed initiatives and wasted resources.'
    };

    return riskDescriptions[areaId] || 'This area requires immediate attention to avoid potential issues.';
  }
}

module.exports = RecommendationEngine;




