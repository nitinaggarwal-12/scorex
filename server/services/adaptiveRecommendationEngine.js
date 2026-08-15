// Enhanced Adaptive Recommendation Engine
// Analyzes ALL aspects: current state, future state, pain points, and comments

const assessmentFramework = require('../data/assessmentFramework');

class AdaptiveRecommendationEngine {
  constructor() {
    // Pain point to recommendation mapping
    this.painPointRecommendations = {
      // Technical Pain Points
      'data_quality_issues': {
        priority: 'critical',
        title: 'Implement Data Quality Framework',
        actions: [
          'Deploy data quality monitoring with Great Expectations or Databricks data quality rules',
          'Establish data validation checkpoints in pipelines',
          'Implement automated data profiling and anomaly detection',
          'Create data quality dashboards and alerts'
        ],
        impact: 'Addresses your reported data quality concerns directly'
      },
      'performance_issues': {
        priority: 'high',
        title: 'Optimize Performance and Query Speed',
        actions: [
          'Enable Photon engine for query acceleration',
          'Implement Delta Lake optimization (Z-ordering, compaction)',
          'Review and optimize cluster configurations',
          'Implement caching strategies for frequently accessed data'
        ],
        impact: 'Resolves your performance bottlenecks'
      },
      'scalability_concerns': {
        priority: 'high',
        title: 'Enhance Scalability Architecture',
        actions: [
          'Implement auto-scaling cluster policies',
          'Optimize data partitioning strategy',
          'Deploy multi-cluster management for workload isolation',
          'Consider serverless SQL for elastic compute'
        ],
        impact: 'Addresses your scalability challenges'
      },
      'integration_complexity': {
        priority: 'high',
        title: 'Simplify Integration Architecture',
        actions: [
          'Implement Databricks Partner Connect for common integrations',
          'Standardize on REST APIs and streaming interfaces',
          'Deploy integration templates and reusable connectors',
          'Document integration patterns and best practices'
        ],
        impact: 'Reduces integration complexity you\'re experiencing'
      },
      'security_gaps': {
        priority: 'critical',
        title: 'Strengthen Security Posture',
        actions: [
          'Implement Unity Catalog for centralized governance',
          'Enable audit logging and compliance monitoring',
          'Deploy column and row-level security',
          'Implement secrets management and credential vaulting'
        ],
        impact: 'Closes your identified security gaps'
      },
      'cost_management': {
        priority: 'medium',
        title: 'Implement Cost Optimization Strategy',
        actions: [
          'Deploy cost monitoring and budget alerts',
          'Implement cluster policies and auto-termination',
          'Optimize storage with lifecycle policies',
          'Review and rightsize compute resources'
        ],
        impact: 'Addresses your cost concerns'
      },
      'lack_of_automation': {
        priority: 'medium',
        title: 'Increase Automation Coverage',
        actions: [
          'Implement Databricks Workflows for orchestration',
          'Automate deployment with CI/CD pipelines',
          'Deploy auto-scaling and auto-recovery policies',
          'Implement automated testing and validation'
        ],
        impact: 'Reduces manual effort you\'ve identified'
      },
      'monitoring_gaps': {
        priority: 'medium',
        title: 'Enhance Monitoring and Observability',
        actions: [
          'Deploy comprehensive monitoring dashboards',
          'Implement alerting for critical metrics',
          'Integrate with enterprise monitoring tools',
          'Establish SLAs and SLO tracking'
        ],
        impact: 'Fills your monitoring gaps'
      },

      // Business Pain Points
      'slow_time_to_insights': {
        priority: 'high',
        title: 'Accelerate Time-to-Insights',
        actions: [
          'Implement self-service analytics with Databricks SQL',
          'Deploy pre-built dashboards and templates',
          'Optimize query performance for faster results',
          'Enable real-time streaming analytics'
        ],
        impact: 'Speeds up insights delivery as requested'
      },
      'limited_self_service': {
        priority: 'high',
        title: 'Enable Self-Service Analytics',
        actions: [
          'Deploy Databricks SQL with user-friendly interface',
          'Create curated datasets and semantic layer',
          'Implement role-based access control',
          'Provide training and documentation'
        ],
        impact: 'Empowers business users per your needs'
      },
      'data_silos': {
        priority: 'high',
        title: 'Break Down Data Silos',
        actions: [
          'Implement unified lakehouse architecture',
          'Deploy Delta Sharing for cross-organization data access',
          'Establish data mesh with federated ownership',
          'Create enterprise data catalog'
        ],
        impact: 'Unifies your siloed data sources'
      },
      'compliance_challenges': {
        priority: 'critical',
        title: 'Ensure Regulatory Compliance',
        actions: [
          'Implement Unity Catalog for compliance controls',
          'Deploy audit logging and data lineage tracking',
          'Establish data retention and deletion policies',
          'Create compliance dashboards and reports'
        ],
        impact: 'Addresses your compliance concerns'
      },
      'skill_gaps': {
        priority: 'medium',
        title: 'Close Skill Gaps',
        actions: [
          'Implement Databricks Academy training programs',
          'Deploy collaborative notebooks for knowledge sharing',
          'Create internal centers of excellence',
          'Hire or train data engineering expertise'
        ],
        impact: 'Builds capabilities you\'ve identified as lacking'
      },
      'change_management': {
        priority: 'medium',
        title: 'Improve Change Management',
        actions: [
          'Establish clear adoption roadmap',
          'Create executive sponsorship program',
          'Deploy pilot projects for quick wins',
          'Implement regular training and communication'
        ],
        impact: 'Addresses your change management challenges'
      },
      'roi_concerns': {
        priority: 'medium',
        title: 'Demonstrate and Track ROI',
        actions: [
          'Implement value tracking dashboards',
          'Establish baseline metrics for comparison',
          'Deploy quick-win projects for immediate value',
          'Create business case templates'
        ],
        impact: 'Addresses your ROI measurement needs'
      },
      'vendor_lock_in': {
        priority: 'low',
        title: 'Maintain Platform Flexibility',
        actions: [
          'Use open formats (Delta Lake, Parquet)',
          'Implement abstraction layers where needed',
          'Document migration paths and procedures',
          'Leverage open-source tools'
        ],
        impact: 'Reduces vendor lock-in concerns'
      }
    };
  }

  // Main method: Generate fully adaptive recommendations
  generateAdaptiveRecommendations(responses, completedAreaIds = null) {
    const areasToAnalyze = completedAreaIds 
      ? assessmentFramework.assessmentAreas.filter(area => completedAreaIds.includes(area.id))
      : assessmentFramework.assessmentAreas;
    
    // Calculate scores
    const overallScore = this.calculateMaturityScore(responses, areasToAnalyze);
    const areaScores = {};
    const areaGaps = {};
    
    areasToAnalyze.forEach(area => {
      const current = this.calculateAreaScoreByPerspective(area, responses, 'current_state');
      const future = this.calculateAreaScoreByPerspective(area, responses, 'future_state');
      
      areaScores[area.id] = {
        current: parseFloat(current.toFixed(1)), // 🔥 FIX: Use 1 decimal place
        future: parseFloat(future.toFixed(1)),
        gap: parseFloat((future - current).toFixed(1)),
        overall: parseFloat(((current + future) / 2).toFixed(1))
      };
      
      areaGaps[area.id] = future - current;
    });

    // Extract pain points and comments
    const painPointAnalysis = this.analyzePainPoints(responses, areasToAnalyze);
    const commentInsights = this.extractCommentInsights(responses, areasToAnalyze);
    
    // Generate adaptive recommendations
    const currentScoreVal = this.calculateMaturityScoreByPerspective(responses, areasToAnalyze, 'current_state');
    const futureScoreVal = this.calculateMaturityScoreByPerspective(responses, areasToAnalyze, 'future_state');
    
    const recommendations = {
      overall: {
        currentScore: parseFloat(currentScoreVal.toFixed(1)), // 🔥 FIX: Use 1 decimal place
        futureScore: parseFloat(futureScoreVal.toFixed(1)),
        gap: 0, // Will calculate
        level: assessmentFramework.maturityLevels[Math.max(1, Math.min(5, overallScore))],
        summary: this.generateAdaptiveSummary(areaScores, painPointAnalysis, commentInsights)
      },
      areaScores: areaScores, // CRITICAL: Include area scores for pillar-level results
      categories: {},
      painPointRecommendations: this.generatePainPointRecommendations(painPointAnalysis),
      gapBasedActions: this.generateGapBasedActions(areaGaps, areaScores),
      commentBasedInsights: commentInsights,
      prioritizedActions: [],
      roadmap: {},
      quickWins: [],
      riskAreas: [],
      executiveSummary: {}
    };

    recommendations.overall.gap = parseFloat((recommendations.overall.futureScore - recommendations.overall.currentScore).toFixed(1)); // 🔥 FIX: 1 decimal place

    // Generate area-specific adaptive recommendations
    Object.keys(areaScores).forEach(areaId => {
      const area = assessmentFramework.assessmentAreas.find(a => a.id === areaId);
      const scores = areaScores[areaId];
      const areaPainPoints = painPointAnalysis[areaId] || {};
      const areaComments = commentInsights.filter(c => c.areaId === areaId);
      
      recommendations.categories[areaId] = {
        name: area.name,
        currentScore: scores.current,
        futureScore: scores.future,
        gap: scores.gap,
        level: assessmentFramework.maturityLevels[scores.current],
        targetLevel: assessmentFramework.maturityLevels[scores.future],
        recommendations: this.getAdaptiveAreaRecommendations(areaId, scores, areaPainPoints, areaComments, responses)
      };
    });

    // Generate prioritized actions based on all inputs
    recommendations.prioritizedActions = this.generatePrioritizedActions(areaScores, painPointAnalysis, commentInsights);
    
    // Generate roadmap based on gaps and priorities
    recommendations.roadmap = this.generateAdaptiveRoadmap(areaScores, areaGaps, painPointAnalysis);
    
    // Identify quick wins from pain points and gaps
    recommendations.quickWins = this.identifyAdaptiveQuickWins(areaScores, painPointAnalysis, areaGaps);
    
    // Identify risk areas from pain points and low scores
    recommendations.riskAreas = this.identifyAdaptiveRiskAreas(areaScores, painPointAnalysis);
    
    // Generate executive summary
    recommendations.executiveSummary = this.generateExecutiveSummary(recommendations, painPointAnalysis, commentInsights);

    return recommendations;
  }

  // Analyze pain points from responses
  analyzePainPoints(responses, areas) {
    const painPoints = {};
    
    areas.forEach(area => {
      painPoints[area.id] = {
        technical: [],
        business: []
      };
      
      const questions = this.getAreaQuestions(area);
      
      questions.forEach(question => {
        // Get technical pain points
        const technicalKey = `${question.id}_technical_pain`;
        if (responses[technicalKey] && Array.isArray(responses[technicalKey])) {
          painPoints[area.id].technical.push(...responses[technicalKey]);
        }
        
        // Get business pain points
        const businessKey = `${question.id}_business_pain`;
        if (responses[businessKey] && Array.isArray(responses[businessKey])) {
          painPoints[area.id].business.push(...responses[businessKey]);
        }
      });
      
      // Deduplicate
      painPoints[area.id].technical = [...new Set(painPoints[area.id].technical)];
      painPoints[area.id].business = [...new Set(painPoints[area.id].business)];
    });
    
    return painPoints;
  }

  // Extract insights from user comments
  extractCommentInsights(responses, areas) {
    const insights = [];
    
    areas.forEach(area => {
      const questions = this.getAreaQuestions(area);
      
      questions.forEach(question => {
        const commentKey = `${question.id}_comment`;
        if (responses[commentKey] && responses[commentKey].trim().length > 0) {
          insights.push({
            areaId: area.id,
            areaName: area.name,
            questionId: question.id,
            questionTopic: question.topic,
            comment: responses[commentKey],
            keywords: this.extractKeywords(responses[commentKey])
          });
        }
      });
    });
    
    return insights;
  }

  // Extract keywords from comments for contextual recommendations
  extractKeywords(comment) {
    const urgencyKeywords = ['urgent', 'critical', 'immediate', 'asap', 'priority', 'blocker'];
    const positiveKeywords = ['working', 'good', 'success', 'effective', 'satisfied'];
    const negativeKeywords = ['issue', 'problem', 'challenge', 'difficulty', 'concern', 'struggling'];
    const costKeywords = ['expensive', 'cost', 'budget', 'savings', 'roi'];
    const timeKeywords = ['slow', 'fast', 'delay', 'bottleneck', 'quick', 'speed'];
    
    const lowerComment = comment.toLowerCase();
    const found = {
      urgency: urgencyKeywords.some(kw => lowerComment.includes(kw)),
      positive: positiveKeywords.some(kw => lowerComment.includes(kw)),
      negative: negativeKeywords.some(kw => lowerComment.includes(kw)),
      cost: costKeywords.some(kw => lowerComment.includes(kw)),
      time: timeKeywords.some(kw => lowerComment.includes(kw))
    };
    
    return found;
  }

  // Generate recommendations based on pain points
  generatePainPointRecommendations(painPointAnalysis) {
    const recommendations = [];
    const allTechnicalPain = [];
    const allBusinessPain = [];
    
    Object.values(painPointAnalysis).forEach(areaPain => {
      allTechnicalPain.push(...areaPain.technical);
      allBusinessPain.push(...areaPain.business);
    });
    
    // Deduplicate and count frequency
    const technicalFreq = this.countFrequency(allTechnicalPain);
    const businessFreq = this.countFrequency(allBusinessPain);
    
    // Generate recommendations for most frequent pain points
    [...Object.entries(technicalFreq), ...Object.entries(businessFreq)]
      .sort((a, b) => b[1] - b[1]) // Sort by frequency
      .forEach(([painPoint, frequency]) => {
        if (this.painPointRecommendations[painPoint]) {
          recommendations.push({
            ...this.painPointRecommendations[painPoint],
            frequency: frequency,
            type: allTechnicalPain.includes(painPoint) ? 'technical' : 'business'
          });
        }
      });
    
    return recommendations;
  }

  // Generate actions based on maturity gaps
  generateGapBasedActions(areaGaps, areaScores) {
    const actions = [];
    
    // Sort areas by gap size (descending)
    const sortedGaps = Object.entries(areaGaps).sort((a, b) => b[1] - a[1]);
    
    sortedGaps.forEach(([areaId, gap]) => {
      if (gap > 0) {
        const area = assessmentFramework.assessmentAreas.find(a => a.id === areaId);
        const scores = areaScores[areaId];
        
        actions.push({
          area: area.name,
          areaId: areaId,
          currentLevel: scores.current,
          targetLevel: scores.future,
          gap: gap,
          priority: gap >= 2 ? 'high' : gap >= 1 ? 'medium' : 'low',
          title: `Bridge ${gap}-level gap in ${area.name}`,
          description: `You've indicated a desired improvement from level ${scores.current} to level ${scores.future}. This represents significant ambition and requires focused effort.`,
          effort: gap >= 2 ? 'high' : 'medium',
          timeline: gap >= 2 ? '6-12 months' : '3-6 months'
        });
      }
    });
    
    return actions;
  }

  // Generate adaptive summary
  generateAdaptiveSummary(areaScores, painPointAnalysis, commentInsights) {
    const avgCurrent = Math.round(Object.values(areaScores).reduce((sum, s) => sum + s.current, 0) / Object.values(areaScores).length);
    const avgFuture = Math.round(Object.values(areaScores).reduce((sum, s) => sum + s.future, 0) / Object.values(areaScores).length);
    const avgGap = avgFuture - avgCurrent;
    
    // Get maturity level names
    const currentLevel = assessmentFramework.maturityLevels[avgCurrent] || assessmentFramework.maturityLevels[1];
    const futureLevel = assessmentFramework.maturityLevels[avgFuture] || assessmentFramework.maturityLevels[5];
    
    // Collect pain points by area
    const painPointsByArea = {};
    Object.entries(painPointAnalysis).forEach(([areaId, pains]) => {
      const area = assessmentFramework.assessmentAreas.find(a => a.id === areaId);
      if (!painPointsByArea[area.name]) {
        painPointsByArea[area.name] = { technical: [], business: [] };
      }
      painPointsByArea[area.name].technical = pains.technical;
      painPointsByArea[area.name].business = pains.business;
    });
    
    const totalPainPoints = Object.values(painPointAnalysis).reduce((sum, p) => sum + p.technical.length + p.business.length, 0);
    
    // Identify areas with biggest gaps for roadmap
    const areasWithGaps = Object.entries(areaScores)
      .filter(([_, scores]) => scores.gap > 0)
      .sort((a, b) => b[1].gap - a[1].gap)
      .slice(0, 3);
    
    // Build executive narrative
    let summary = '## STRATEGIC SITUATION & BUSINESS VALUE\n\n';
    
    summary += `**Current Maturity:** Level ${avgCurrent} - ${currentLevel.level}\n`;
    summary += `${currentLevel.description}\n\n`;
    
    summary += `**Target Maturity:** Level ${avgFuture} - ${futureLevel.level}\n`;
    summary += `${futureLevel.description}\n\n`;
    
    if (avgGap > 1) {
      summary += `**Improvement Scope:** This ${avgGap}-level improvement is achievable with targeted initiatives and focused effort over the next 6-12 months.\n\n`;
    } else if (avgGap === 1) {
      summary += `**Improvement Scope:** This 1-level improvement is achievable with targeted initiatives and focused effort over the next 6-12 months.\n\n`;
    } else {
      summary += `**Optimization Focus:** You're close to your target state, requiring fine-tuning and optimization rather than major transformation.\n\n`;
    }
    
    // Critical Constraints - be specific about actual pain points
    summary += '## CRITICAL CONSTRAINTS IMPACTING PERFORMANCE\n\n';
    
    if (totalPainPoints > 0) {
      summary += 'Your assessment identified specific challenges across multiple pillars:\n\n';
      
      Object.entries(painPointsByArea).forEach(([area, pains]) => {
        const totalInArea = pains.technical.length + pains.business.length;
        if (totalInArea > 0) {
          summary += `**${area}:** `;
          const issues = [];
          if (pains.technical.length > 0) issues.push(`${pains.technical.length} technical constraints`);
          if (pains.business.length > 0) issues.push(`${pains.business.length} business impacts`);
          summary += issues.join(' and ') + '\n';
        }
      });
      summary += '\n';
      summary += 'These constraints are limiting platform capabilities, team productivity, and business agility. The transformation roadmap below addresses these specific challenges.\n\n';
    } else {
      summary += 'No significant pain points identified. Your platform is performing well and meeting current needs.\n\n';
    }
    
    // Transformation Roadmap - show clear path
    summary += '## TRANSFORMATION ROADMAP & BUSINESS VALUE\n\n';
    
    if (areasWithGaps.length > 0) {
      summary += '**Priority Initiatives:**\n\n';
      areasWithGaps.forEach(([areaId, scores], idx) => {
        const area = assessmentFramework.assessmentAreas.find(a => a.id === areaId);
        const timeline = scores.gap >= 2 ? '6-12 months' : '3-6 months';
        summary += `${idx + 1}. **${area.name}** (Level ${scores.current} → ${scores.future})\n`;
        summary += `   Timeline: ${timeline} | Impact: ${scores.gap >= 2 ? 'High' : 'Medium'}\n`;
        
        // Add specific Databricks features to adopt
        if (areaId === 'platform_governance') {
          summary += '   Key Actions: Implement Unity Catalog for centralized governance, enable audit logging, deploy RBAC with attribute-based access control\n';
        } else if (areaId === 'data_engineering') {
          summary += '   Key Actions: Adopt Delta Live Tables for automated pipelines, implement Lakehouse Monitoring for data quality, enable Auto Loader for streaming ingestion\n';
        } else if (areaId === 'analytics_bi') {
          summary += '   Key Actions: Deploy Databricks SQL with Serverless compute, enable AI/BI dashboards, implement Genie for natural language queries\n';
        } else if (areaId === 'machine_learning') {
          summary += '   Key Actions: Adopt MLflow for experiment tracking, deploy Feature Store for reusable features, implement Model Registry for governance\n';
        } else if (areaId === 'generative_ai') {
          summary += '   Key Actions: Deploy Vector Search for RAG applications, use Model Serving for LLM deployment, implement Agent Framework for AI applications\n';
        } else if (areaId === 'operational_excellence') {
          summary += '   Key Actions: Enable Serverless Compute for cost optimization, implement FinOps dashboards, deploy automated scaling policies\n';
        }
        summary += '\n';
      });
    }
    
    summary += '**Expected Business Outcomes:**\n';
    summary += '• Improved data platform reliability and governance posture\n';
    summary += '• Faster time-to-insight with modern Databricks capabilities\n';
    summary += '• Reduced manual effort through automation and AI\n';
    summary += '• Better cost efficiency through serverless and optimized compute\n';
    summary += '• Enhanced compliance and audit capabilities\n\n';
    
    const allAreas = Object.keys(areaScores);
    summary += `**Assessment Confidence:** Based on ${allAreas.length} pillar(s) with ${totalPainPoints} specific challenges identified`;

    return summary;
  }

  // Generate area-specific adaptive recommendations
  getAdaptiveAreaRecommendations(areaId, scores, painPoints, comments, responses) {
    const recommendations = [];
    const gap = scores.gap;
    
    // Gap-based recommendations
    if (gap > 0) {
      recommendations.push({
        priority: gap >= 2 ? 'critical' : 'high',
        title: `Close ${gap}-Level Maturity Gap`,
        description: `Based on your input, you want to improve from level ${scores.current} to ${scores.future}.`,
        actions: this.getGapClosingActions(areaId, scores.current, scores.future),
        rationale: 'Directly addresses your stated ambition and goals',
        timeline: gap >= 2 ? '9-12 months' : '4-6 months'
      });
    }
    
    // Technical pain point recommendations
    if (painPoints.technical && painPoints.technical.length > 0) {
      painPoints.technical.forEach(painPoint => {
        if (this.painPointRecommendations[painPoint]) {
          recommendations.push({
            ...this.painPointRecommendations[painPoint],
            rationale: 'Addresses your reported technical pain point',
            source: 'technical_pain_point'
          });
        }
      });
    }
    
    // Business pain point recommendations
    if (painPoints.business && painPoints.business.length > 0) {
      painPoints.business.forEach(painPoint => {
        if (this.painPointRecommendations[painPoint]) {
          recommendations.push({
            ...this.painPointRecommendations[painPoint],
            rationale: 'Addresses your reported business pain point',
            source: 'business_pain_point'
          });
        }
      });
    }
    
    // Comment-based recommendations
    comments.forEach(comment => {
      if (comment.keywords.urgency) {
        recommendations.push({
          priority: 'critical',
          title: 'Address Urgent Concern',
          description: `You mentioned: "${comment.comment.substring(0, 100)}..."`,
          actions: ['Immediate assessment and action plan required'],
          rationale: 'Based on your urgent comment',
          source: 'user_comment'
        });
      }
      
      if (comment.keywords.cost) {
        recommendations.push({
          priority: 'high',
          title: 'Cost Optimization Initiative',
          description: 'Address cost concerns mentioned in your comments',
          actions: [
            'Conduct cost analysis and optimization review',
            'Implement cost monitoring and budgeting',
            'Review and rightsize resources'
          ],
          rationale: 'Based on cost concerns in your comments',
          source: 'user_comment'
        });
      }
    });
    
    // Deduplicate and prioritize
    return this.deduplicateAndPrioritize(recommendations);
  }

  // Generate executive summary
  generateExecutiveSummary(recommendations, painPointAnalysis, commentInsights) {
    const criticalActions = recommendations.prioritizedActions.filter(a => a.priority === 'critical');
    const highPriorityActions = recommendations.prioritizedActions.filter(a => a.priority === 'high');
    
    return {
      currentState: {
        score: recommendations.overall.currentScore,
        level: assessmentFramework.maturityLevels[recommendations.overall.currentScore],
        description: `Your organization is currently at maturity level ${recommendations.overall.currentScore}`
      },
      desiredState: {
        score: recommendations.overall.futureScore,
        level: assessmentFramework.maturityLevels[recommendations.overall.futureScore],
        description: `Your target is to reach maturity level ${recommendations.overall.futureScore}`
      },
      gap: {
        levels: recommendations.overall.gap,
        description: recommendations.overall.gap > 1 ? 'Significant transformation required' : 'Incremental improvement needed',
        effort: recommendations.overall.gap >= 2 ? 'High' : recommendations.overall.gap >= 1 ? 'Medium' : 'Low'
      },
      keyPainPoints: {
        technical: this.getTopPainPoints(painPointAnalysis, 'technical', 5),
        business: this.getTopPainPoints(painPointAnalysis, 'business', 5)
      },
      criticalActions: criticalActions.slice(0, 3),
      topPriorities: highPriorityActions.slice(0, 5),
      quickWins: recommendations.quickWins.slice(0, 3),
      estimatedTimeline: this.calculateOverallTimeline(recommendations),
      investmentLevel: this.calculateInvestmentLevel(recommendations),
      keyInsights: this.extractKeyInsights(commentInsights)
    };
  }

  // Helper methods
  calculateMaturityScore(responses, areas) {
    if (areas.length === 0) return 0;
    let totalScore = 0;
    let areaCount = 0;
    
    areas.forEach(area => {
      const score = this.calculateAreaScore(area, responses);
      if (score > 0) {
        totalScore += score;
        areaCount++;
      }
    });
    
    return areaCount > 0 ? Math.round(totalScore / areaCount) : 0;
  }

  calculateMaturityScoreByPerspective(responses, areas, perspective) {
    if (areas.length === 0) return 0;
    let totalScore = 0;
    let areaCount = 0;
    
    areas.forEach(area => {
      const score = this.calculateAreaScoreByPerspective(area, responses, perspective);
      if (score > 0) {
        totalScore += score;
        areaCount++;
      }
    });
    
    return areaCount > 0 ? totalScore / areaCount : 0;
  }

  calculateAreaScore(area, responses) {
    const current = this.calculateAreaScoreByPerspective(area, responses, 'current_state');
    const future = this.calculateAreaScoreByPerspective(area, responses, 'future_state');
    return (current + future) / 2;
  }

  calculateAreaScoreByPerspective(area, responses, perspectiveFilter) {
    let areaScore = 0;
    let questionCount = 0;
    
    const questions = this.getAreaQuestions(area);
    console.log(`[Score Calc] Area: ${area.name}, Questions: ${questions.length}, Perspective: ${perspectiveFilter}`);
    
    questions.forEach(question => {
      const skipKey = `${question.id}_skipped`;
      if (responses[skipKey]) {
        console.log(`[Score Calc] Question ${question.id} skipped`);
        return;
      }
      
      let questionScore = 0;
      let perspectiveCount = 0;
      
      question.perspectives.forEach(perspective => {
        if (perspectiveFilter && perspective.id !== perspectiveFilter) return;
        
        const responseKey = `${question.id}_${perspective.id}`;
        const response = responses[responseKey];
        
        console.log(`[Score Calc] Checking ${responseKey}: response=${response}, type=${typeof response}, perspective.type=${perspective.type}`);
        
        if (response && perspective.type === 'single_choice') {
          // CRITICAL FIX: Convert response to number if it's a string
          // Responses are saved as strings but options use numeric values
          const normalizedResponse = typeof response === 'string' ? parseInt(response, 10) : response;
          
          const selectedOption = perspective.options.find(opt => opt.value === normalizedResponse);
          if (selectedOption) {
            console.log(`[Score Calc] ✅ Found option for ${responseKey}: score=${selectedOption.score}`);
            questionScore += selectedOption.score;
            perspectiveCount++;
          } else {
            console.log(`[Score Calc] ❌ No matching option found for ${responseKey}, response=${response} (normalized: ${normalizedResponse})`);
            console.log(`[Score Calc] Available options:`, perspective.options.map(o => ({ value: o.value, type: typeof o.value })));
          }
        } else if (!response) {
          console.log(`[Score Calc] No response for ${responseKey}`);
        }
      });
      
      if (perspectiveCount > 0) {
        areaScore += questionScore / perspectiveCount;
        questionCount++;
        console.log(`[Score Calc] Question ${question.id} avg score: ${questionScore / perspectiveCount}`);
      }
    });
    
    const finalScore = questionCount > 0 ? areaScore / questionCount : 0;
    console.log(`[Score Calc] Final area score: ${finalScore} (from ${questionCount} questions)`);
    return finalScore;
  }

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

  countFrequency(array) {
    return array.reduce((acc, item) => {
      acc[item] = (acc[item] || 0) + 1;
      return acc;
    }, {});
  }

  getTopPainPoints(painPointAnalysis, type, limit) {
    const allPainPoints = [];
    Object.values(painPointAnalysis).forEach(areaPain => {
      allPainPoints.push(...areaPain[type]);
    });
    
    const freq = this.countFrequency(allPainPoints);
    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([painPoint, count]) => ({
        painPoint,
        count,
        description: this.painPointRecommendations[painPoint]?.title || painPoint
      }));
  }

  getGapClosingActions(areaId, currentLevel, futureLevel) {
    // Return specific actions based on the gap
    return [
      `Assess current ${assessmentFramework.assessmentAreas.find(a => a.id === areaId)?.name} capabilities`,
      `Define roadmap from level ${currentLevel} to level ${futureLevel}`,
      `Identify and address capability gaps`,
      `Implement best practices and standards`,
      `Measure progress and adjust strategy`
    ];
  }

  deduplicateAndPrioritize(recommendations) {
    // Remove duplicates and sort by priority
    const unique = recommendations.filter((rec, index, self) =>
      index === self.findIndex(r => r.title === rec.title)
    );
    
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return unique.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  }

  generatePrioritizedActions(areaScores, painPointAnalysis, commentInsights) {
    const actions = [];
    
    // Add pain point actions
    const painPointRecs = this.generatePainPointRecommendations(painPointAnalysis);
    actions.push(...painPointRecs.slice(0, 5).map(rec => ({
      ...rec,
      category: 'Pain Point Resolution'
    })));
    
    // Add gap-based actions
    Object.entries(areaScores).forEach(([areaId, scores]) => {
      if (scores.gap >= 2) {
        actions.push({
          priority: 'high',
          category: 'Capability Gap',
          title: `Close gap in ${assessmentFramework.assessmentAreas.find(a => a.id === areaId)?.name}`,
          gap: scores.gap,
          impact: 'Achieves your stated maturity goals'
        });
      }
    });
    
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return actions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]).slice(0, 10);
  }

  generateAdaptiveRoadmap(areaScores, areaGaps, painPointAnalysis) {
    return {
      immediate: [], // 0-3 months
      shortTerm: [], // 3-6 months
      mediumTerm: [], // 6-12 months
      longTerm: [] // 12+ months
    };
    // Implementation would add items to each phase
  }

  identifyAdaptiveQuickWins(areaScores, painPointAnalysis, areaGaps) {
    // Quick wins are: high impact + low effort + addresses pain points
    return [];
  }

  identifyAdaptiveRiskAreas(areaScores, painPointAnalysis) {
    // Risk areas: low scores + critical pain points
    return [];
  }

  calculateOverallTimeline(recommendations) {
    // Calculate based on gaps and actions
    return '6-12 months for significant improvements';
  }

  calculateInvestmentLevel(recommendations) {
    // Calculate based on gaps and priorities
    return 'Medium to High';
  }

  extractKeyInsights(commentInsights) {
    return commentInsights
      .filter(c => c.keywords.urgency || c.keywords.negative)
      .slice(0, 5)
      .map(c => ({
        area: c.areaName,
        insight: c.comment.substring(0, 150)
      }));
  }

  /**
   * Get maturity level for a given score
   * @param {number} score - Maturity score (1-5)
   * @returns {object} Maturity level details
   */
  getMaturityLevel(score) {
    const roundedScore = Math.round(score);
    const level = Math.max(1, Math.min(5, roundedScore)); // Clamp between 1-5
    
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

module.exports = AdaptiveRecommendationEngine;

