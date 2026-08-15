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
        solution: 'Implement environment-level resource isolation (dev/staging/prod) with an enterprise Unified Catalog providing centralized metadata governance, access control, and quota enforcement across all environments.',
        steps: [
          'Establish dedicated workspace environments: dev, staging, and production',
          'Configure compute auto-scaling policies and resource quotas to prevent noisy-neighbor contention',
          'Use centralized metadata catalog shared across environments for unified governance and lineage',
          'Set up automated budget alerts per project to track and control cloud compute costs',
          'Enable unified audit logging to monitor cross-environment operations and access'
        ],
        databricks_features: ['Unified Metadata Catalog', 'Environment Resource Isolation', 'Automated Quota & Compute Policies', 'FinOps Budget Alerts']
      },
      'error_handling': {
        problem: 'Poor error handling and recovery',
        solution: 'Implement robust declarative data pipeline error handling with automated retry policies, dead-letter queues, and real-time observability alerts for failed processing stages.',
        steps: [
          'Deploy declarative data pipelines with automated retry logic for transient infrastructure failures',
          'Configure automated data quality assertions to quarantine invalid records without crashing pipelines',
          'Set up dead-letter queues/tables to isolate and inspect rejected records for root cause analysis',
          'Enable automated alerting channels (Slack, Email, PagerDuty) for pipeline execution anomalies',
          'Implement idempotent pipeline logic and checkpointing to safely retry failed operations'
        ],
        databricks_features: ['Declarative Pipeline Framework', 'Automated Quality Assertions & Quarantining', 'Dead Letter Queues', 'Pipeline Observability & Alerting']
      },
      'manual_deployment': {
        problem: 'Manual, error-prone deployment processes',
        solution: 'Adopt declarative Infrastructure-as-Code (IaC) and CI/CD automation pipelines for reproducible, zero-downtime deployments across staging and production environments.',
        steps: [
          'Define platform infrastructure and job configurations as code (Terraform / declarative templates)',
          'Store all pipeline definitions and configuration in version control (Git)',
          'Automate linting, unit testing, and deployment execution in CI/CD runners',
          'Implement isolated staging and production deployment targets with automated verification gates',
          'Enable drift detection to catch manual configuration changes and enforce consistency'
        ],
        databricks_features: ['Infrastructure-as-Code (IaC)', 'CI/CD Automated Deployment', 'Git Version Control Integration', 'Drift Detection & Guardrails']
      },
      
      // Data Engineering
      'poor_data_quality': {
        problem: 'Poor data quality at ingestion',
        solution: 'Implement declarative data pipelines with automated data quality expectations and validation gates at ingestion, quarantining bad data while preserving pipeline uptime.',
        steps: [
          'Define multi-layer lakehouse architecture (Raw/Bronze -> Cleansed/Silver -> Curated/Gold)',
          'Add automated schema enforcement and data validation rules at ingestion boundaries',
          'Configure automated quarantine tables for failed schema or business constraint records',
          'Monitor data quality anomaly metrics and freshness thresholds in continuous telemetry dashboards',
          'Set up automated notifications when data quality drop rates exceed SLA thresholds'
        ],
        databricks_features: ['Declarative Data Pipelines', 'Automated Data Quality Gates', 'Streaming Ingestion Engine', 'Continuous Data Quality Monitoring']
      },
      'pipeline_failures': {
        problem: 'Frequent pipeline failures',
        solution: 'Use enterprise workflow orchestration with automated DAG dependency management, intelligent retry backoffs, and execution checkpointing to ensure resilient data pipelines.',
        steps: [
          'Modernize legacy batch scripts into structured DAGs with clear task dependencies',
          'Configure exponential retry backoffs and timeout policies for resilient job execution',
          'Set up integrated alerting notifications for task failures and SLA misses',
          'Utilize checkpointed state storage to allow resumes from the point of failure',
          'Centralize execution logs and metrics for accelerated troubleshooting'
        ],
        databricks_features: ['Enterprise Workflow Orchestration', 'Automated Retry & Checkpointing', 'DAG Dependency Management', 'Real-time Pipeline Alerting']
      },
      
      // Machine Learning
      'no_experiment_tracking': {
        problem: 'No centralized experiment tracking',
        solution: 'Implement a centralized Model Registry and Experiment Tracking platform to automatically record hyperparameters, code versions, metrics, and model artifacts in a reproducible repository.',
        steps: [
          'Integrate open standard experiment tracking to automatically log model runs and parameters',
          'Standardize metric logging (accuracy, F1, loss, latency) across all data science teams',
          'Centralize model versioning and transition stages (staging, production, archived) in a model registry',
          'Enable model artifact lineage linking training datasets to deployed models',
          'Implement visual model comparison dashboards to evaluate candidate architectures'
        ],
        databricks_features: ['Centralized Experiment Tracking', 'Model Registry & Lifecycle Management', 'Automated Hyperparameter Logging', 'Model Benchmarking Dashboards']
      },
      'model_monitoring': {
        problem: 'No model monitoring in production',
        solution: 'Deploy full-lifecycle model observability to continuously monitor model prediction quality, data drift, feature distribution shifts, and inference latency in production.',
        steps: [
          'Log inference request and prediction payloads to governed monitoring tables',
          'Configure automated statistical drift detection for input feature distributions',
          'Set up performance degradation alerts based on ground truth feedback loops',
          'Establish automated retraining pipelines triggered by drift thresholds',
          'Publish live model health and SLA dashboards for engineering and business stakeholders'
        ],
        databricks_features: ['Continuous Model Observability', 'Automated Feature Drift Detection', 'Managed Model Inference Endpoints', 'Automated Retraining Triggers']
      },
      
      // Analytics & BI
      'slow_queries': {
        problem: 'Slow query performance',
        solution: 'Implement serverless vectorized query engines, automated open table compaction, data clustering, and intelligent caching for sub-second query performance on lakehouse storage.',
        steps: [
          'Enable serverless vectorized SQL compute pools for elastic auto-scaling',
          'Apply data clustering and auto-compaction on high-cardinality filter columns',
          'Configure intelligent result caching and intermediate materialize views for repetitive queries',
          'Utilize query execution profiling to identify table scan bottlenecks and missing partition filters',
          'Establish right-sized compute tiers mapped to workload complexity'
        ],
        databricks_features: ['Vectorized Serverless SQL Engine', 'Open Table Auto-Compaction & Clustering', 'Intelligent Result Caching', 'Query Execution Profiler']
      },
      'inconsistent_performance': {
        problem: 'Inconsistent query performance',
        solution: 'Implement centralized semantic data modeling, predictive data caching, and auto-scaling compute pools to ensure deterministic query performance across peak loads.',
        steps: [
          'Deploy a centralized semantic layer to standardize metrics and eliminate redundant scans',
          'Configure elastic compute auto-scaling to absorb peak analytical concurrency spikes',
          'Enable predictive I/O and query result caching for executive dashboards',
          'Partition underlying storage by optimal time/region dimensions',
          'Track query concurrency metrics to maintain consistent SLAs'
        ],
        databricks_features: ['Centralized Semantic Layer', 'Elastic Auto-Scaling Compute', 'Predictive Caching & Materialized Views', 'Workload Concurrency Management']
      },
      
      // Generative AI
      'no_genai_strategy': {
        problem: 'No clear GenAI strategy',
        solution: 'Establish an enterprise Generative AI roadmap starting with governed vector search for Retrieval-Augmented Generation (RAG), secure AI gateways, and multi-model benchmarking.',
        steps: [
          'Establish an AI Gateway with cost attribution, rate limiting, and token controls',
          'Identify and prioritize top 2-3 high-ROI business use cases (knowledge retrieval, automated synthesis)',
          'Deploy governed vector databases synced with curated enterprise data for RAG pipelines',
          'Implement automated LLM evaluation frameworks to benchmark accuracy, hallucination, and latency',
          'Deploy secure inference endpoints with role-based access control and PII guardrails'
        ],
        databricks_features: ['Enterprise AI Gateway', 'Governed Vector Database & RAG', 'Automated LLM Evaluation Framework', 'Multi-Model Inference Endpoints']
      },
      'prompt_management': {
        problem: 'No prompt engineering practices',
        solution: 'Implement prompt versioning, automated evaluation harnesses, and enterprise guardrails to ensure consistent, secure GenAI deployments.',
        steps: [
          'Centralize prompt templates in a version-controlled repository with parameterized inputs',
          'Implement automated ground-truth evaluation suites for prompt regression testing',
          'Deploy input and output guardrails to detect PII leaks, prompt injection, and hallucinations',
          'Perform structured A/B testing on prompt variants in staging environments',
          'Track prompt performance, latency, and token cost metrics across models'
        ],
        databricks_features: ['Centralized Prompt Repository', 'Automated Prompt Evaluation Suites', 'LLM Safety & PII Guardrails', 'A/B Testing & Cost Profiling']
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

