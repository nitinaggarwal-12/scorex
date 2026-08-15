/**
 * Context-Aware Recommendation Engine
 * Analyzes pain points and customer comments to generate specific, contextual recommendations
 * instead of generic templates based only on maturity level.
 */

class ContextAwareRecommendationEngine {
  constructor() {
    // Map pain point values to specific Databricks solutions
    this.painPointSolutions = {
      // Platform & Governance
      inconsistent_configs: {
        features: ['Terraform Provider for Databricks', 'Databricks CLI', 'Infrastructure as Code templates'],
        recommendations: [
          'Implement Infrastructure as Code with Terraform: `terraform init` → Define workspace config → Apply with `terraform apply` → Version control in Git',
          'Use Databricks CLI for config sync: Install databricks-cli → Configure profiles → Export configs with `databricks workspace export_dir` → Import to standardize',
          'Create environment templates: Define JSON workspace configs → Use REST API `/api/2.0/workspace/import` → Automate with CI/CD pipelines'
        ],
        nextSteps: [
          'IaC Discovery Workshop: Review current environment setup, identify config drift, design Terraform modules for standardization',
          'Databricks CLI Training: Hands-on session on workspace exports, imports, and automation scripts'
        ]
      },
      manual_provisioning: {
        features: ['Workspace Federation', 'Account Console API', 'Terraform Databricks Provider'],
        recommendations: [
          'Automate workspace provisioning: Use Account API `/accounts/{account_id}/workspaces` → POST with config JSON → Integrate with ServiceNow/Jira for approval workflow',
          'Deploy Terraform workspace module: Define azurerm_databricks_workspace resource → Configure private link → Apply with approval gates in GitLab CI',
          'Enable self-service portal: Build internal tool calling Databricks Account API → User fills form → Backend creates workspace with predefined policies'
        ],
        nextSteps: [
          'Automation Readiness Assessment: Audit current provisioning process, identify bottlenecks, design approval workflows',
          'Self-Service POC: Build prototype workspace request portal, integrate with Databricks API, pilot with one team'
        ]
      },
      poor_isolation: {
        features: ['Unity Catalog', 'Private Link/Service Endpoints', 'Network Security'],
        recommendations: [
          'Implement network isolation: Configure Azure Private Link → Create private endpoints for workspace → Set up DNS resolution → Test connectivity isolation',
          'Deploy Unity Catalog metastore per environment: CREATE METASTORE dev_metastore → GRANT CREATE CATALOG to dev_group → Enforce with workspace assignment',
          'Configure workspace-level RBAC: Assign separate metastores (dev/staging/prod) → Use catalog grants for cross-environment access → Enable audit logging'
        ],
        nextSteps: [
          'Network Architecture Workshop: Design private link topology, plan IP address ranges, review security group rules',
          'Unity Catalog Isolation Planning: Define metastore strategy per environment, plan data sharing policies'
        ]
      },
      deployment_issues: {
        features: ['Databricks Asset Bundles', 'Repos API', 'Databricks CLI'],
        recommendations: [
          'Adopt Databricks Asset Bundles: Init with `databricks bundle init` → Define bundle.yml with jobs/DLT pipelines → Deploy with `databricks bundle deploy --target prod`',
          'Integrate Git-based deployments: Connect Databricks Repos to GitHub → Create deployment notebook → Trigger via webhook on PR merge to main branch',
          'Implement blue-green deployments: Maintain two job versions → Route traffic with job parameters → Rollback instantly by switching version parameter'
        ],
        nextSteps: [
          'CI/CD Architecture Design: Map current deployment process, design Git-based workflow, plan rollback strategies',
          'Asset Bundles Pilot: Convert one critical job to bundle format, test deployments across environments'
        ]
      },
      
      // Data Engineering
      no_quality_checks: {
        features: ['Delta Live Tables Expectations', 'Lakehouse Monitoring', 'Data Quality API'],
        recommendations: [
          'Implement DLT expectations: Add @expect_or_fail("valid_email", "email RLIKE \'^[^@]+@[^@]+\\.[^@]+$\'") → Deploy pipeline → Monitor quarantine table',
          'Enable Lakehouse Monitoring: Run CALL create_monitor(table_name, profile_metrics) → Set alerts on drift → Create dashboard with system.monitoring.profiles',
          'Build data quality framework: Create Python library with Great Expectations → Run as DLT Python UDF → Write quality metrics to monitoring table'
        ],
        nextSteps: [
          'Data Quality Assessment: Identify critical tables, define SLAs, catalog existing quality issues',
          'DLT Expectations Workshop: Train team on constraint types (@expect, @expect_or_fail, @expect_or_drop), design rules library'
        ]
      },
      manual_pipelines: {
        features: ['Delta Live Tables', 'Workflows', 'Auto Loader'],
        recommendations: [
          'Migrate to DLT: Convert notebook pipeline → Define bronze/silver/gold layers in DLT Python → Use @dlt.table decorator → Deploy with continuous mode',
          'Implement Auto Loader: Replace file ingestion with `spark.readStream.format("cloudFiles")` → Set schema hints → Enable schema evolution with .option("cloudFiles.schemaEvolution", "true")',
          'Orchestrate with Workflows: Create multi-task job → Add DLT pipeline tasks → Configure dependencies → Enable repair and alerting'
        ],
        nextSteps: [
          'Pipeline Migration Planning: Map current notebooks to DLT structure, identify dependencies, plan incremental migration',
          'Auto Loader POC: Pilot on one S3 bucket, test schema evolution, measure latency improvements'
        ]
      },
      
      // Analytics & BI
      complex_sql: {
        features: ['Databricks SQL', 'AI/BI Dashboards', 'SQL Warehouse Serverless'],
        recommendations: [
          'Deploy Serverless SQL Warehouse: Create warehouse with serverless → Enable Photon → Configure auto-stop 10 min → Grant access to analysts',
          'Build analyst-friendly views: CREATE VIEW sales_summary AS SELECT... → Add descriptions with COMMENT → Tag with CLASSIFY for discovery',
          'Implement dashboard library: Create 10 templated SQL dashboards → Use parameters for filtering → Schedule refreshes with Databricks Jobs'
        ],
        nextSteps: [
          'SQL Enablement Program: Train analysts on Databricks SQL Editor, teach query optimization, create best practices guide',
          'Dashboard Design Workshop: Review current Tableau/PowerBI dashboards, design migration plan to Databricks SQL'
        ]
      },
      no_self_service: {
        features: ['Genie', 'AI/BI', 'Query Federation'],
        recommendations: [
          'Deploy Genie for business users: Create Genie space → Define business metrics YAML → Train on sample questions → Enable for finance team',
          'Enable AI/BI dashboards: Activate AI/BI on SQL warehouse → Create semantic layer with metric definitions → Let business users ask questions',
          'Implement query federation: CREATE CONNECTION postgres_prod USING postgres → Map external tables → Query with `SELECT * FROM postgres_prod.sales`'
        ],
        nextSteps: [
          'Genie Semantic Layer Workshop: Define key business metrics, create relationships, build training questions set',
          'Business User Pilot: Select 10 power users, train on Genie/AI-BI, gather feedback, iterate on semantic model'
        ]
      },
      
      // Machine Learning
      no_ml_tracking: {
        features: ['MLflow', 'Model Registry', 'Unity Catalog for ML'],
        recommendations: [
          'Implement MLflow tracking: Add mlflow.autolog() → Log params with mlflow.log_param() → Register model with mlflow.register_model() → View in MLflow UI',
          'Set up Model Registry: Create UC catalog for ML models → Register with `mlflow.register_model(model_uri, "models.prod.fraud_detection")` → Add tags and descriptions',
          'Deploy experiment tracking: Configure MLflow tracking server → Set MLFLOW_TRACKING_URI env var → Compare runs with MLflow UI → Archive old experiments'
        ],
        nextSteps: [
          'MLOps Maturity Assessment: Audit current ML workflows, identify tracking gaps, design MLflow adoption roadmap',
          'MLflow Training Program: Hands-on workshop on experiment tracking, model registry, deployment patterns'
        ]
      },
      manual_deployment: {
        features: ['Model Serving', 'Webhooks', 'Model Monitoring'],
        recommendations: [
          'Enable Model Serving: Deploy model endpoint → Configure autoscaling (min 1, max 10 instances) → Test with REST API → Monitor latency/throughput',
          'Automate model refresh: Create job that runs monthly → Retrain model → Compare metrics → If accuracy > threshold, promote to registry → Deploy to serving',
          'Implement monitoring: Enable Lakehouse Monitoring on inference table → Track prediction drift → Set alerts on accuracy drops → Create monitoring dashboard'
        ],
        nextSteps: [
          'Model Serving Architecture Workshop: Design endpoint strategy, plan A/B testing approach, define SLAs',
          'Automated Retraining POC: Build pipeline for one model, test trigger mechanisms, validate rollback process'
        ]
      },
      no_feature_store: {
        features: ['Unity Catalog Feature Store', 'Feature Engineering in Unity Catalog'],
        recommendations: [
          'Implement Feature Store: CREATE FEATURE TABLE customer_features → Add features with FeatureEngineeringClient.create_table() → Lookup at training/serving time',
          'Build feature pipeline: Create DLT pipeline → Compute features (aggregations/windows) → Write to feature table → Enable automatic updates',
          'Enable feature serving: Create online table with `CREATE ONLINE TABLE` → Sync from feature table → Serve via Model Serving for real-time inference'
        ],
        nextSteps: [
          'Feature Engineering Assessment: Catalog duplicated features across teams, identify reuse opportunities, design feature taxonomy',
          'Feature Store Pilot: Migrate 5-10 critical features, measure retraining time savings, document patterns'
        ]
      },
      
      // Generative AI
      no_genai: {
        features: ['Mosaic AI', 'Foundation Model APIs', 'Vector Search'],
        recommendations: [
          'Deploy Vector Search: CREATE VECTOR SEARCH INDEX docs_index → Ingest documents with embeddings → Query with similarity_search() → Build RAG app',
          'Enable Foundation Model APIs: Access via `spark.databricks.com/fmaas/v1/completions` → Call Llama-3-70B or MPT-7B → Implement prompt templates → Monitor costs',
          'Build RAG application: Chunk documents → Generate embeddings with instructor-xl → Store in Delta with Vector Search → Retrieve context → Call Foundation Model with context'
        ],
        nextSteps: [
          'GenAI Use Case Discovery: Identify high-value LLM applications, assess data readiness, define success metrics',
          'RAG Architecture Workshop: Design document ingestion pipeline, choose embedding model, plan Vector Search strategy'
        ]
      },
      no_llm_governance: {
        features: ['AI Playground', 'Prompt Engineering', 'LLM Guardrails'],
        recommendations: [
          'Implement prompt management: Create prompt library in Unity Catalog → Version control with Git → Test in AI Playground → Deploy with Model Serving',
          'Add LLM guardrails: Use LangChain guardrails library → Filter PII with regex → Check output safety with HuggingFace moderator → Log all interactions',
          'Monitor LLM quality: Track output diversity with system.monitoring → Implement human feedback loop → A/B test prompts → Measure task success rate'
        ],
        nextSteps: [
          'LLM Governance Framework Design: Define acceptable use policies, create prompt review process, plan audit mechanism',
          'Guardrails Implementation Workshop: Select guardrail library, design safety filters, test with production data'
        ]
      },
      
      // Operational Excellence
      no_training: {
        features: ['Databricks Academy', 'Learning Paths', 'Certification Programs'],
        recommendations: [
          'Launch enablement program: Enroll team in Databricks Academy → Assign role-based learning paths → Track completion in LMS → Offer certification vouchers',
          'Build internal knowledge base: Create Wiki with best practices → Record lunch-and-learn sessions → Maintain FAQ → Create quickstart templates',
          'Establish Center of Excellence: Form CoE with 5 experts → Host weekly office hours → Review code/architecture → Maintain reusable assets library'
        ],
        nextSteps: [
          'Training Needs Assessment: Survey teams on skill gaps, identify priority topics, map to Databricks Academy courses',
          'CoE Formation Workshop: Define CoE charter, select initial members, plan recurring activities'
        ]
      },
      no_cost_tracking: {
        features: ['System Tables', 'Budget Policies', 'Usage Dashboards'],
        recommendations: [
          'Enable System Tables: Query system.billing.usage → Join with system.compute.clusters → Build cost dashboard by team/project → Schedule weekly reports',
          'Implement budget policies: Set cluster policies with max DBUs → Create budget alerts in Account Console → Enforce with `"max_dbus_per_hour": 10` in policy',
          'Build chargeback model: Tag resources with cost center → Aggregate usage by tag → Generate monthly invoices → Integrate with finance systems'
        ],
        nextSteps: [
          'Cost Attribution Workshop: Design tagging strategy, map teams to cost centers, plan reporting cadence',
          'System Tables Dashboard Build: Create Databricks SQL dashboard with cost trends, top spenders, optimization opportunities'
        ]
      }
    };
  }

  /**
   * Generate context-aware content based on actual pain points and comments
   * Returns BOTH problems (What You Need) AND solutions (Recommendations)
   */
  generateContextAwareRecommendations(assessment, pillarId, maturityLevel, pillarFramework = null) {
    const responses = assessment.responses || {};
    const result = {
      // SOLUTIONS (for Databricks Recommendations section)
      features: [],
      recommendations: [],
      nextSteps: [],
      insights: []
      // NOTE: We do NOT generate "What You Need" here
      // The existing recommendationEngine.js already correctly generates that from comments
    };

    // Find all pain points for this pillar
    const pillarPainPoints = this.extractPillarPainPoints(responses, pillarId, pillarFramework);
    const pillarComments = this.extractPillarComments(responses, pillarId, pillarFramework);
    
    console.log(`[Context Engine] Pillar: ${pillarId}, Pain points found: ${pillarPainPoints.length}, Comments found: ${pillarComments.length}`);
    
    if (pillarPainPoints.length > 0) {
      console.log(`[Context Engine] Sample pain points for ${pillarId}:`, pillarPainPoints.slice(0, 3).map(p => p.label));
    }

    // Generate SOLUTIONS for each pain point dynamically
    // Group pain points by severity and select top ones
    const topPainPoints = pillarPainPoints
      .sort((a, b) => (b.score || 3) - (a.score || 3))
      .slice(0, 10); // Top 10 most critical pain points
    
    topPainPoints.forEach(painPoint => {
      // Try hardcoded solution first
      const hardcodedSolution = this.painPointSolutions[painPoint.value];
      if (hardcodedSolution) {
        result.features.push(...hardcodedSolution.features);
        result.recommendations.push(...hardcodedSolution.recommendations);
        result.nextSteps.push(...hardcodedSolution.nextSteps);
      } else {
        // Generate dynamic solution based on pain point label
        const dynamicRec = this.generateSmartRecommendation(painPoint, pillarId);
        if (dynamicRec) {
          result.recommendations.push(dynamicRec);
        }
        
        // Also generate a next step
        const nextStep = this.generateNextStep(painPoint, pillarId);
        if (nextStep) {
          result.nextSteps.push(nextStep);
        }
      }
    });
    
    console.log(`[Context Engine] ${pillarId}: Generated ${result.recommendations.length} recommendations from ${pillarPainPoints.length} pain points`);

    // Analyze comments for additional context
    const commentInsights = this.analyzeComments(pillarComments, pillarId);
    result.insights.push(...commentInsights);

    // Add comment-derived solutions
    commentInsights.forEach(insight => {
      if (insight.suggestedFeatures) {
        result.features.push(...insight.suggestedFeatures);
      }
    });

    // Deduplicate
    result.features = [...new Set(result.features)];
    result.recommendations = [...new Set(result.recommendations)];
    result.nextSteps = [...new Set(result.nextSteps)];

    // Limit to top 5 of each
    result.features = result.features.slice(0, 5);
    result.recommendations = result.recommendations.slice(0, 5);
    result.nextSteps = result.nextSteps.slice(0, 5);

    return result;
  }

  /**
   * Extract all pain points for a specific pillar using actual framework structure
   * Returns pain point objects with { value, label, type }
   */
  extractPillarPainPoints(responses, pillarId, pillarFramework = null) {
    const painPointsMap = new Map(); // Use Map to avoid duplicates by value
    
    if (!pillarFramework || !pillarFramework.dimensions) {
      console.warn(`[Context Engine] No pillar framework provided for ${pillarId}`);
      return [];
    }
    
    // Get all question IDs from this pillar's dimensions
    pillarFramework.dimensions.forEach(dimension => {
      if (dimension.questions) {
        dimension.questions.forEach(question => {
          // Find technical pain perspective
          const techPerspective = question.perspectives?.find(p => p.id === 'technical_pain');
          if (techPerspective && techPerspective.options) {
            const technicalKey = `${question.id}_technical_pain`;
            if (responses[technicalKey] && Array.isArray(responses[technicalKey])) {
              responses[technicalKey].forEach(painValue => {
                const painOption = techPerspective.options.find(opt => opt.value === painValue);
                if (painOption && !painPointsMap.has(painValue)) {
                  painPointsMap.set(painValue, {
                    value: painValue,
                    label: painOption.label,
                    type: 'technical',
                    score: painOption.score || 3
                  });
                }
              });
            }
          }
          
          // Find business pain perspective
          const bizPerspective = question.perspectives?.find(p => p.id === 'business_pain');
          if (bizPerspective && bizPerspective.options) {
            const businessKey = `${question.id}_business_pain`;
            if (responses[businessKey] && Array.isArray(responses[businessKey])) {
              responses[businessKey].forEach(painValue => {
                const painOption = bizPerspective.options.find(opt => opt.value === painValue);
                if (painOption && !painPointsMap.has(painValue)) {
                  painPointsMap.set(painValue, {
                    value: painValue,
                    label: painOption.label,
                    type: 'business',
                    score: painOption.score || 3
                  });
                }
              });
            }
          }
        });
      }
    });

    return Array.from(painPointsMap.values());
  }

  /**
   * Extract all comments for a specific pillar using actual framework structure
   */
  extractPillarComments(responses, pillarId, pillarFramework = null) {
    const comments = [];
    
    if (!pillarFramework || !pillarFramework.dimensions) {
      console.warn(`[Context Engine] No pillar framework provided for ${pillarId}`);
      return comments;
    }
    
    // Get all question IDs from this pillar's dimensions
    pillarFramework.dimensions.forEach(dimension => {
      if (dimension.questions) {
        dimension.questions.forEach(question => {
          const commentKey = `${question.id}_comment`;
          const comment = responses[commentKey];
          if (comment && comment.trim()) {
            comments.push(comment);
          }
        });
      }
    });

    return comments;
  }

  /**
   * Generate Next Step (customer engagement activity) for a pain point
   */
  generateNextStep(painPoint, pillarId) {
    const label = painPoint.label.toLowerCase();
    const problem = painPoint.label;
    
    // Generate customer engagement activities based on pain point type
    if (label.includes('manual') || label.includes('automation')) {
      return `Automation Workshop for ${problem}: Review current manual processes → Design workflow automation with Databricks Jobs → Build POC pipeline → Measure time savings`;
    }
    
    if (label.includes('performance') || label.includes('slow') || label.includes('optimization')) {
      return `Performance Optimization Assessment: Profile slow queries and jobs → Identify bottlenecks → Implement Photon and caching → Measure performance improvements`;
    }
    
    if (label.includes('cost') || label.includes('budget')) {
      return `Cost Optimization Review: Analyze spending patterns with system.billing.usage → Identify optimization opportunities → Implement cluster policies → Track savings`;
    }
    
    if (label.includes('security') || label.includes('governance') || label.includes('compliance')) {
      return `Governance Framework Workshop: Assess current security posture → Design Unity Catalog implementation → Plan RBAC and audit strategy → Define rollout timeline`;
    }
    
    if (label.includes('quality') || label.includes('validation') || label.includes('error')) {
      return `Data Quality Assessment: Catalog data quality issues → Design DLT expectations framework → Implement monitoring → Establish quality SLAs`;
    }
    
    if (label.includes('deployment') || label.includes('release')) {
      return `CI/CD Implementation Workshop: Review deployment process → Design Asset Bundles structure → Integrate with GitHub Actions → Train team on best practices`;
    }
    
    if (label.includes('training') || label.includes('skill') || label.includes('knowledge')) {
      return `Databricks Training Program: Assess skill gaps → Assign Databricks Academy courses → Conduct hands-on workshops → Establish internal knowledge base`;
    }
    
    if (label.includes('collaboration') || label.includes('sharing')) {
      return `Collaboration Enhancement Session: Review current workflows → Implement Databricks Repos and workspace structure → Train on sharing and version control`;
    }
    
    // Default next step
    return `Discovery Session for ${problem}: Understand current state → Identify quick wins → Design solution architecture → Define implementation roadmap`;
  }

  /**
   * Generate smart, contextual Databricks recommendation based on pain point label
   */
  generateSmartRecommendation(painPoint, pillarId) {
    const label = painPoint.label.toLowerCase();
    const type = painPoint.type;
    
    // Keyword-based recommendation generation
    if (label.includes('manual') || label.includes('automation')) {
      return `Automate ${painPoint.label.toLowerCase()}: Implement Databricks Workflows with task dependencies → Use job parameters for flexibility → Schedule with cron or event triggers → Enable automatic retries and alerts`;
    }
    
    if (label.includes('monitoring') || label.includes('observability') || label.includes('visibility')) {
      return `Implement Lakehouse Monitoring for ${painPoint.label.toLowerCase()}: Enable system tables (system.billing.usage, system.compute.clusters) → Create monitoring dashboards → Set up alerts with Databricks SQL → Track metrics over time`;
    }
    
    if (label.includes('quality') || label.includes('validation')) {
      return `Address ${painPoint.label.toLowerCase()}: Use Delta Live Tables expectations with @expect_or_fail() → Implement data quality checks → Monitor with Lakehouse Monitoring → Create quarantine tables for invalid data`;
    }
    
    if (label.includes('performance') || label.includes('slow') || label.includes('latency')) {
      return `Optimize ${painPoint.label.toLowerCase()}: Enable Photon acceleration → Use caching with CACHE TABLE → Implement Z-ordering on Delta tables → Monitor query performance with Query History`;
    }
    
    if (label.includes('cost') || label.includes('expensive') || label.includes('budget')) {
      return `Control ${painPoint.label.toLowerCase()}: Implement cluster policies to limit DBU usage → Use Serverless compute for auto-scaling → Enable auto-termination → Track costs with system.billing.usage tables`;
    }
    
    if (label.includes('security') || label.includes('access') || label.includes('permission')) {
      return `Secure ${painPoint.label.toLowerCase()}: Implement Unity Catalog for centralized governance → Use fine-grained ACLs → Enable audit logging → Set up attribute-based access control (ABAC)`;
    }
    
    if (label.includes('deployment') || label.includes('release') || label.includes('ci/cd')) {
      return `Streamline ${painPoint.label.toLowerCase()}: Use Databricks Asset Bundles (databricks bundle deploy) → Integrate with GitHub Actions → Implement blue-green deployments → Version control notebooks and jobs`;
    }
    
    if (label.includes('governance') || label.includes('compliance') || label.includes('audit')) {
      return `Establish ${painPoint.label.toLowerCase()}: Deploy Unity Catalog for lineage tracking → Enable audit logs → Implement data classification with tags → Create compliance reports from system tables`;
    }
    
    if (label.includes('collaboration') || label.includes('sharing') || label.includes('team')) {
      return `Improve ${painPoint.label.toLowerCase()}: Use Databricks Repos for Git integration → Share dashboards with stakeholders → Implement workspace folders structure → Enable notebook comments and version control`;
    }
    
    if (label.includes('scale') || label.includes('capacity') || label.includes('growth')) {
      return `Scale for ${painPoint.label.toLowerCase()}: Use autoscaling clusters (min/max workers) → Implement Delta Lake for ACID transactions at scale → Enable Photon for faster processing → Use Serverless SQL for elastic compute`;
    }
    
    // Default technical recommendation
    return `Address ${painPoint.label}: Leverage Databricks platform capabilities → Implement automation with Workflows → Monitor with system tables → Apply best practices from Databricks documentation`;
  }

  /**
   * Analyze comments for Databricks feature mentions and generate insights
   */
  analyzeComments(comments, pillarId) {
    const insights = [];
    const featureKeywords = {
      'Unity Catalog': ['unity catalog', 'uc', 'metastore', 'catalog'],
      'Delta Live Tables': ['dlt', 'delta live tables', 'live tables', 'expectations'],
      'MLflow': ['mlflow', 'model registry', 'experiment tracking'],
      'Vector Search': ['vector search', 'embeddings', 'similarity search', 'rag'],
      'Databricks SQL': ['dbsql', 'sql warehouse', 'serverless', 'photon'],
      'Auto Loader': ['auto loader', 'cloudfiles', 'streaming ingestion'],
      'Genie': ['genie', 'natural language', 'ai/bi'],
      'Model Serving': ['model serving', 'inference', 'endpoint'],
      'Mosaic AI': ['mosaic', 'foundation model', 'llm fine-tuning']
    };

    comments.forEach(comment => {
      const lowerComment = comment.toLowerCase();
      
      Object.keys(featureKeywords).forEach(feature => {
        const keywords = featureKeywords[feature];
        const mentioned = keywords.some(kw => lowerComment.includes(kw));
        
        if (mentioned) {
          insights.push({
            type: 'feature_mention',
            feature: feature,
            context: comment.substring(0, 100) + '...',
            suggestedFeatures: [feature]
          });
        }
      });

      // Check for negative sentiment indicating needs
      const needIndicators = ['need', 'want', 'looking for', 'planning', 'considering', 'lack', 'missing'];
      const hasNeed = needIndicators.some(indicator => lowerComment.includes(indicator));
      
      if (hasNeed) {
        insights.push({
          type: 'stated_need',
          context: comment,
          suggestedFeatures: []
        });
      }
    });

    return insights;
  }
}

module.exports = ContextAwareRecommendationEngine;

