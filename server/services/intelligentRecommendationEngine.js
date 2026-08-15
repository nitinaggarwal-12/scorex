/**
 * Intelligent Recommendation Engine
 * Generates highly contextual, customer-specific recommendations
 * Based on actual pain points, comments, and current/future state gap
 */

const databricksFeatureMapper = require('./databricksFeatureMapper');

class IntelligentRecommendationEngine {
  constructor() {
    this.featureMapper = databricksFeatureMapper; // It's already an instance
    // Map pain points to specific, actionable solutions
    this.solutionMap = {
      // Platform Governance
      'resource_conflicts': {
        problem: 'Resource conflicts between environments',
        solution: 'Implement workspace-level resource isolation using separate Databricks workspaces for dev/staging/prod, with Unity Catalog providing centralized governance across all environments.',
        steps: [
          'Create dedicated workspaces: dev-workspace, staging-workspace, prod-workspace',
          'Configure workspace-specific cluster policies to prevent resource contention',
          'Use Unity Catalog metastore shared across workspaces for unified governance',
          'Set up budget alerts per workspace to track and control costs',
          'Enable audit logging to monitor cross-workspace activity'
        ],
        databricks_features: ['Unity Catalog', 'Workspace Administration', 'Cluster Policies', 'Budget Alerts']
      },
      'error_handling': {
        problem: 'Poor error handling and recovery',
        solution: 'Implement robust error handling with Delta Live Tables automated retry logic, dead letter queues, and alerting for failed pipeline steps.',
        steps: [
          'Use Delta Live Tables with automatic retry policies for transient failures',
          'Configure @expect_or_drop() for data quality issues to quarantine bad records',
          'Set up dead letter tables to capture and analyze failed records',
          'Enable Databricks Workflows email alerts for pipeline failures',
          'Implement idempotent pipeline logic to safely retry operations'
        ],
        databricks_features: ['Delta Live Tables', 'Workflows', 'Delta Lake ACID', 'Lakehouse Monitoring']
      },
      'manual_deployment': {
        problem: 'Manual, error-prone deployment processes',
        solution: 'Adopt Databricks Asset Bundles (DABs) for infrastructure-as-code deployment, enabling automated, repeatable deployments across environments.',
        steps: [
          'Define infrastructure using databricks.yml bundle configuration',
          'Store bundle code in Git (GitHub/GitLab/Bitbucket)',
          'Use `databricks bundle deploy` command in CI/CD pipeline',
          'Implement separate bundle targets for dev/staging/prod',
          'Enable drift detection to catch manual configuration changes'
        ],
        databricks_features: ['Asset Bundles', 'Databricks CLI', 'Git Integration', 'CI/CD Workflows']
      },
      
      // Data Engineering
      'poor_data_quality': {
        problem: 'Poor data quality at ingestion',
        solution: 'Implement Delta Live Tables with expectations to enforce data quality rules at ingestion, automatically quarantining bad data.',
        steps: [
          'Define DLT pipeline with @dlt.table decorators',
          'Add @expect_or_drop("valid_email", "email IS NOT NULL") for data quality',
          'Use @expect_or_fail() for critical business rules',
          'Monitor data quality metrics in DLT event log',
          'Set up alerts when quality thresholds are breached'
        ],
        databricks_features: ['Delta Live Tables', 'Expectations', 'Auto Loader', 'Lakehouse Monitoring']
      },
      'pipeline_failures': {
        problem: 'Frequent pipeline failures',
        solution: 'Use Databricks Workflows with automated retry logic, notifications, and dependency management to create resilient data pipelines.',
        steps: [
          'Convert notebooks to Delta Live Tables for declarative ETL',
          'Configure retry policies in Workflows (max_retries=3, timeout)',
          'Set up email/Slack alerts for job failures',
          'Use task dependencies to ensure proper execution order',
          'Enable run history and logs for troubleshooting'
        ],
        databricks_features: ['Workflows', 'Delta Live Tables', 'Job Scheduling', 'Alerting']
      },
      
      // Machine Learning
      'no_experiment_tracking': {
        problem: 'No centralized experiment tracking',
        solution: 'Implement MLflow Tracking to automatically log all experiments, parameters, metrics, and models in a centralized registry.',
        steps: [
          'Use mlflow.autolog() to automatically capture experiments',
          'Log parameters with mlflow.log_param("learning_rate", 0.01)',
          'Track metrics with mlflow.log_metric("accuracy", 0.95)',
          'Register models with MLflow Model Registry',
          'Compare experiments using MLflow UI'
        ],
        databricks_features: ['MLflow Tracking', 'MLflow Model Registry', 'Experiments', 'AutoML']
      },
      'model_monitoring': {
        problem: 'No model monitoring in production',
        solution: 'Deploy Lakehouse Monitoring to automatically track model drift, performance degradation, and data quality issues in production.',
        steps: [
          'Enable Lakehouse Monitoring on inference tables',
          'Configure drift detection for input features',
          'Set up prediction quality monitors',
          'Create alerts for performance degradation',
          'Review monitoring dashboards daily'
        ],
        databricks_features: ['Lakehouse Monitoring', 'Model Serving', 'MLflow', 'System Tables']
      },
      
      // Analytics & BI
      'slow_queries': {
        problem: 'Slow query performance',
        solution: 'Enable Photon acceleration, implement Z-ordering and Liquid Clustering on Delta tables, and use Serverless SQL for automatic optimization.',
        steps: [
          'Enable Photon on SQL warehouses for 3-5x speedup',
          'Run OPTIMIZE command with Z-ORDER BY on filter columns',
          'Enable Liquid Clustering: ALTER TABLE SET TBLPROPERTIES("clustering"="true")',
          'Use Serverless SQL warehouses for auto-scaling',
          'Review Query Profile to identify bottlenecks'
        ],
        databricks_features: ['Photon', 'Liquid Clustering', 'Serverless SQL', 'Query Profile']
      },
      'inconsistent_performance': {
        problem: 'Inconsistent query performance',
        solution: 'Implement Delta caching, predictive I/O, and query result caching to ensure consistent performance.',
        steps: [
          'Enable disk caching on frequently accessed tables',
          'Use Serverless SQL for consistent resource allocation',
          'Enable query result caching for repeated queries',
          'Partition tables by date/region for query pruning',
          'Set up query monitoring to track performance trends'
        ],
        databricks_features: ['Delta Caching', 'Serverless SQL', 'Result Caching', 'Predictive I/O']
      },
      
      // Generative AI
      'no_genai_strategy': {
        problem: 'No clear GenAI strategy',
        solution: 'Start with Databricks AI Playground to experiment with foundation models, then build RAG applications using Mosaic AI Agent Framework.',
        steps: [
          'Use AI Playground to test different LLMs (Claude, GPT-4, Llama)',
          'Identify 2-3 high-value use cases (document QA, code generation)',
          'Build POC with Mosaic AI Agent Framework for RAG',
          'Index knowledge base using Vector Search',
          'Deploy agents with MLflow for serving'
        ],
        databricks_features: ['AI Playground', 'Mosaic AI Agent Framework', 'Vector Search', 'Model Serving']
      },
      'prompt_management': {
        problem: 'No prompt engineering practices',
        solution: 'Use AI Playground for prompt development and testing, then version prompts in MLflow for production deployment.',
        steps: [
          'Develop prompts in AI Playground with ground truth evaluation',
          'Version prompts as MLflow experiments',
          'Use prompt templates with variables for dynamic inputs',
          'A/B test different prompts in production',
          'Monitor prompt effectiveness with custom metrics'
        ],
        databricks_features: ['AI Playground', 'Prompt Engineering', 'MLflow', 'A/B Testing']
      }
    };
  }

  /**
   * Generate intelligent recommendations based on actual customer context
   */
  generateRecommendations(assessment, pillarId, pillarFramework) {
    console.log(`[IntelligentEngine] Analyzing pillar: ${pillarId}`);
    
    const responses = assessment.responses || {};
    const painPoints = this.extractPainPoints(responses, pillarFramework);
    const comments = this.extractComments(responses, pillarFramework);
    const stateGaps = this.analyzeStateGaps(responses, pillarFramework);
    
    console.log(`[IntelligentEngine] Pain points: ${painPoints.length}, Comments: ${comments.length}, State gaps: ${stateGaps.length}`);
    
    const recommendations = {
      theGood: this.extractStrengths(comments, painPoints),
      theBad: this.extractChallenges(painPoints, comments),
      recommendations: this.generateActionableSolutions(painPoints, comments, stateGaps),
      nextSteps: this.generateNextSteps(painPoints, stateGaps),
      databricksFeatures: []
    };
    
    // Get Databricks features from DatabricksFeatureMapper (always reliable)
    const currentScore = Math.round(stateGaps[0]?.current || 3);
    const futureScore = Math.round(stateGaps[0]?.future || 4);
    const pillarRecs = this.featureMapper.getRecommendationsForPillar(pillarId, currentScore, {});
    
    // Extract features from the mapper's response structure
    const currentFeatures = pillarRecs?.currentMaturity?.features || [];
    const nextLevelFeatures = pillarRecs?.nextLevel?.features || [];
    const allMapperFeatures = [...currentFeatures, ...nextLevelFeatures];
    
    // Use feature mapper's features as the primary source
    recommendations.databricksFeatures = allMapperFeatures.slice(0, 4); // Top 4 most relevant
    
    console.log(`[IntelligentEngine] Using ${recommendations.databricksFeatures.length} Databricks features from feature mapper for pillar ${pillarId}`);
    
    return recommendations;
  }

  extractPainPoints(responses, framework) {
    const painPoints = [];
    if (!framework || !framework.dimensions) {
      console.log('[IntelligentEngine] No framework or dimensions');
      return painPoints;
    }
    
    console.log(`[IntelligentEngine] Extracting pain points from ${framework.dimensions.length} dimensions`);
    console.log('[IntelligentEngine] Sample response keys:', Object.keys(responses).slice(0, 5));
    
    framework.dimensions.forEach(dim => {
      dim.questions.forEach(q => {
        const techPain = q.perspectives?.find(p => p.id === 'technical_pain');
        if (techPain) {
          const responseKey = `${q.id}_technical_pain`;
          const selected = responses[responseKey];
          console.log(`[IntelligentEngine] Question ${q.id}, technical_pain response:`, selected);
          
          if (Array.isArray(selected) && selected.length > 0) {
            selected.forEach(value => {
              const option = techPain.options.find(o => o.value === value);
              if (option) {
                painPoints.push({ 
                  value, 
                  label: option.label, 
                  type: 'technical',
                  score: option.score || 3
                });
                console.log(`[IntelligentEngine] Found technical pain: ${option.label}`);
              }
            });
          }
        }
        
        const bizPain = q.perspectives?.find(p => p.id === 'business_pain');
        if (bizPain) {
          const responseKey = `${q.id}_business_pain`;
          const selected = responses[responseKey];
          
          if (Array.isArray(selected) && selected.length > 0) {
            selected.forEach(value => {
              const option = bizPain.options.find(o => o.value === value);
              if (option) {
                painPoints.push({ 
                  value, 
                  label: option.label, 
                  type: 'business',
                  score: option.score || 3
                });
                console.log(`[IntelligentEngine] Found business pain: ${option.label}`);
              }
            });
          }
        }
      });
    });
    
    console.log(`[IntelligentEngine] Total pain points extracted: ${painPoints.length}`);
    return painPoints;
  }

  extractComments(responses, framework) {
    const comments = [];
    if (!framework || !framework.dimensions) return comments;
    
    framework.dimensions.forEach(dim => {
      dim.questions.forEach(q => {
        const comment = responses[`${q.id}_comment`];
        if (comment && comment.trim()) {
          comments.push({ question: q.question, text: comment });
        }
      });
    });
    
    return comments;
  }

  analyzeStateGaps(responses, framework) {
    const gaps = [];
    if (!framework || !framework.dimensions) return gaps;
    
    framework.dimensions.forEach(dim => {
      dim.questions.forEach(q => {
        const currentKey = `${q.id}_current_state`;
        const futureKey = `${q.id}_future_state`;
        const current = responses[currentKey];
        const future = responses[futureKey];
        
        if (current && future) {
          const currentScore = this.getScoreFromValue(current, q, 'current_state');
          const futureScore = this.getScoreFromValue(future, q, 'future_state');
          const gap = futureScore - currentScore;
          
          if (gap > 0) {
            gaps.push({
              question: q.question,
              currentScore,
              futureScore,
              gap,
              current,
              future
            });
          }
        }
      });
    });
    
    return gaps.sort((a, b) => b.gap - a.gap); // Prioritize largest gaps
  }

  getScoreFromValue(value, question, perspectiveId) {
    const perspective = question.perspectives?.find(p => p.id === perspectiveId);
    if (!perspective) return 0;
    
    const option = perspective.options?.find(o => o.value === value);
    return option?.score || 0;
  }

  extractStrengths(comments, painPoints) {
    const strengths = [];
    const positiveKeywords = ['working well', 'good', 'successful', 'effective', 'established', 'mature', 'automated', 'centralized', 'tested'];
    
    comments.forEach(c => {
      const text = c.text.toLowerCase();
      if (positiveKeywords.some(kw => text.includes(kw))) {
        strengths.push(c.text);
      }
    });
    
    // If no pain point selected for a common issue, that's a strength
    const commonIssues = ['no_version_control', 'no_testing', 'no_documentation'];
    commonIssues.forEach(issue => {
      if (!painPoints.find(pp => pp.value === issue)) {
        strengths.push(`${issue.replace(/_/g, ' ').replace('no ', '')} is in place`);
      }
    });
    
    return strengths.slice(0, 5); // Top 5
  }

  extractChallenges(painPoints, comments) {
    return painPoints.slice(0, 5).map(pp => pp.label); // Top 5 pain points
  }

  generateActionableSolutions(painPoints, comments, stateGaps) {
    const solutions = [];
    
    // Prioritize pain points by frequency and severity
    const topPainPoints = painPoints.slice(0, 3);
    
    topPainPoints.forEach(pp => {
      const solution = this.solutionMap[pp.value];
      if (solution) {
        // Create customer-specific recommendation
        const relatedComment = comments.find(c => 
          c.text.toLowerCase().includes(pp.label.toLowerCase().substring(0, 20))
        );
        
        let recommendation = `**${solution.problem}**: ${solution.solution}`;
        
        if (relatedComment) {
          recommendation += `\n\n*Based on your note: "${relatedComment.text.substring(0, 100)}..."*`;
        }
        
        recommendation += `\n\n**Action Steps:**\n${solution.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}`;
        
        solutions.push(recommendation);
      } else {
        // Generate generic but helpful recommendation
        solutions.push(`Address **${pp.label}**: Implement best practices for ${pp.label.toLowerCase()}, leverage Databricks platform capabilities, and establish automated monitoring.`);
      }
    });
    
    return solutions;
  }

  generateNextSteps(painPoints, stateGaps) {
    const steps = [];
    
    // Based on top 3 pain points
    painPoints.slice(0, 3).forEach(pp => {
      const solution = this.solutionMap[pp.value];
      if (solution) {
        steps.push(`Workshop: ${solution.problem} - 2 hour discovery session to assess current state and design solution architecture`);
      } else {
        steps.push(`Discovery Session: Assess ${pp.label.toLowerCase()} and identify quick wins`);
      }
    });
    
    // Add general next steps
    steps.push('POC Development: Build proof-of-concept for top priority use case (2-4 weeks)');
    steps.push('Training: Databricks platform training for team (1 day hands-on workshop)');
    
    return steps;
  }
}

module.exports = IntelligentRecommendationEngine;

