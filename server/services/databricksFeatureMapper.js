/**
 * Databricks Feature Mapper
 * Maps assessment responses to actual Databricks product features and capabilities
 * Based on official Databricks release notes and documentation
 * 
 * Source: https://docs.databricks.com/aws/en/release-notes/product/
 * Last Updated: October 2025
 */

class DatabricksFeatureMapper {
  constructor() {
    // Latest Databricks features organized by maturity level and pillar
    this.featuresByPillar = {
      platform_governance: {
        emerging: {
          features: [
            {
              name: 'Unity Catalog',
              description: 'Unified governance solution for data and AI',
              benefits: ['Centralized access control', 'Data discovery', 'Lineage tracking'],
              releaseDate: 'GA - October 2024',
              docs: 'https://docs.databricks.com/data-governance/unity-catalog/index.html'
            },
            {
              name: 'Delta Sharing',
              description: 'Open protocol for secure data sharing (Revenue-generating)',
              benefits: ['Share live data securely', 'No data duplication', 'Open standard', 'Cross-platform sharing'],
              releaseDate: 'GA with row/column filters - October 2025',
              docs: 'https://docs.databricks.com/data-sharing/index.html',
              monetization: 'Enables data monetization and ecosystem growth'
            },
            {
              name: 'Databricks Marketplace',
              description: 'Data and AI marketplace for monetization (Revenue-generating)',
              benefits: ['Monetize data assets', 'Discover data products', 'AI app distribution', 'Partner ecosystem'],
              releaseDate: 'GA - October 2025',
              docs: 'https://docs.databricks.com/marketplace/index.html',
              monetization: 'Platform for data product monetization and consumption-based revenue'
            },
            {
              name: 'Serverless Compute',
              description: 'Instantly available compute without cluster management',
              benefits: ['Zero cluster management', 'Sub-second startup', 'Cost optimization'],
              releaseDate: 'Updated to 17.3 - October 2025',
              docs: 'https://docs.databricks.com/serverless-compute/index.html'
            },
            {
              name: 'Clean Rooms',
              description: 'Privacy-preserving data collaboration',
              benefits: ['Secure multi-party analytics', 'No raw data exposure', 'Compliance-friendly'],
              releaseDate: 'Public Preview - October 2025',
              docs: 'https://docs.databricks.com/clean-rooms/index.html',
              monetization: 'Enables secure data collaboration and new revenue streams'
            }
          ],
          recommendations: [
            'Implement Unity Catalog: Create metastore → Assign to workspaces → Migrate existing databases using SYNC command → Configure grants with GRANT SELECT/MODIFY → Enable audit logging',
            'Deploy Serverless SQL warehouses: Create serverless warehouse (Starter/Pro/Enterprise) → Configure scaling (min/max DBU) → Set query timeouts → Enable Photon acceleration → Migrate workloads from classic clusters',
            'Upgrade to DBR 17.3 LTS: Test compatibility with existing code → Update cluster policies → Set Runtime 17.3 as default → Benchmark performance gains → Validate Photon improvements'
          ]
        },
        developing: {
          features: [
            {
              name: 'Context-Based Ingress Control',
              description: 'Advanced network security with context-aware access',
              benefits: ['Enhanced security', 'Conditional access', 'Compliance support'],
              releaseDate: 'Beta - October 2025',
              docs: 'https://docs.databricks.com/security/network/index.html'
            },
            {
              name: 'Data Classification',
              description: 'Automatic PII and sensitive data discovery',
              benefits: ['Automated compliance', 'Risk mitigation', 'Data privacy'],
              releaseDate: 'Public Preview - October 2025',
              docs: 'https://docs.databricks.com/data-governance/data-classification.html'
            },
            {
              name: 'Budget Policy Support',
              description: 'Cost control with automated budget policies',
              benefits: ['Cost management', 'Spending alerts', 'Resource optimization'],
              releaseDate: 'Public Preview - August 2025',
              docs: 'https://docs.databricks.com/administration-guide/account-settings/budgets.html'
            }
          ],
          recommendations: [
            'Implement Context-Based Ingress Control for enhanced security',
            'Enable Data Classification for compliance',
            'Set up Budget Policies for cost governance'
          ]
        },
        maturing: {
          features: [
            {
              name: 'Governed Tags',
              description: 'Enterprise-grade tagging for data assets',
              benefits: ['Better organization', 'Policy enforcement', 'Cost attribution'],
              releaseDate: 'Public Preview - August 2025',
              docs: 'https://docs.databricks.com/data-governance/unity-catalog/tags.html'
            },
            {
              name: 'Certification Status System',
              description: 'Mark trusted data assets with certification badges',
              benefits: ['Data trust', 'Quality assurance', 'User confidence'],
              releaseDate: 'Public Preview - October 2025',
              docs: 'https://docs.databricks.com/data-governance/unity-catalog/index.html'
            },
            {
              name: 'Access Requests in Unity Catalog',
              description: 'Self-service data access request workflow',
              benefits: ['Faster data access', 'Audit trail', 'Governance compliance'],
              releaseDate: 'Public Preview - August 2025',
              docs: 'https://docs.databricks.com/data-governance/unity-catalog/manage-privileges/access-requests.html'
            }
          ],
          recommendations: [
            'Implement Governed Tags for better data organization',
            'Use Certification Status for trusted datasets',
            'Enable Access Requests for self-service governance'
          ]
        },
        optimized: {
          features: [
            {
              name: 'Enhanced Security & Compliance',
              description: 'Enterprise-grade security controls for regulated industries',
              benefits: ['Regulatory compliance', 'Audit readiness', 'Security certifications'],
              releaseDate: 'September 2025',
              docs: 'https://docs.databricks.com/security/index.html'
            },
            {
              name: 'Unity Catalog External Locations',
              description: 'Secure external data access with centralized governance',
              benefits: ['Centralized access control', 'Cloud storage security', 'Audit logging'],
              releaseDate: 'GA',
              docs: 'https://docs.databricks.com/data-governance/unity-catalog/manage-external-locations-and-credentials.html'
            },
            {
              name: 'Advanced Cluster Policies',
              description: 'Fine-grained control over cluster configurations',
              benefits: ['Cost control', 'Security enforcement', 'Standardization'],
              releaseDate: 'GA',
              docs: 'https://docs.databricks.com/administration-guide/clusters/policies.html'
            }
          ],
          recommendations: [
            'Implement advanced security controls and compliance features',
            'Configure Unity Catalog external locations for governed data access',
            'Enforce cluster policies for cost and security governance'
          ]
        },
        innovative: {
          features: [
            {
              name: 'Serverless SQL',
              description: 'Fully managed SQL compute with instant availability',
              benefits: ['Zero infrastructure management', 'Instant queries', 'Auto-scaling'],
              releaseDate: 'GA',
              docs: 'https://docs.databricks.com/sql/admin/create-sql-warehouse.html'
            },
            {
              name: 'Databricks Assistant',
              description: 'AI-powered coding assistant for notebooks and SQL',
              benefits: ['AI code generation', 'Query optimization', 'Error fixing'],
              releaseDate: 'Public Preview',
              docs: 'https://docs.databricks.com/notebooks/databricks-assistant.html'
            }
          ],
          recommendations: [
            'Adopt Serverless SQL for simplified data analytics',
            'Enable Databricks Assistant for AI-powered development',
            'Explore latest platform innovations and beta features'
          ]
        }
      },

      data_engineering: {
        emerging: {
          features: [
            {
              name: 'Lakeflow Connect',
              description: 'Managed connectors for SaaS data ingestion (Revenue-generating)',
              benefits: ['Zero-code SaaS integration', '100+ pre-built connectors', 'Automated schema evolution', 'Reduces time-to-insight from weeks to hours'],
              releaseDate: 'GA - October 2025',
              docs: 'https://docs.databricks.com/connect/index.html',
              monetization: 'Premium feature - DBU consumption based on data volume'
            },
            {
              name: 'Delta Live Tables (DLT)',
              description: 'Declarative ETL framework for reliable pipelines',
              benefits: ['Simplified ETL', 'Data quality checks', 'Auto-recovery'],
              releaseDate: 'GA',
              docs: 'https://docs.databricks.com/delta-live-tables/index.html'
            },
            {
              name: 'Lakeflow Pipelines Editor',
              description: 'Visual pipeline builder for declarative ETL',
              benefits: ['No-code pipeline creation', 'Visual debugging', 'Faster development'],
              releaseDate: 'Public Preview - September 2025',
              docs: 'https://docs.databricks.com/delta-live-tables/pipeline-editor.html'
            },
            {
              name: 'Auto Loader',
              description: 'Efficient incremental file ingestion',
              benefits: ['Automatic schema detection', 'File discovery', 'Cost-effective'],
              releaseDate: 'GA with file events - September 2025',
              docs: 'https://docs.databricks.com/ingestion/auto-loader/index.html'
            },
            {
              name: 'Streaming Tables',
              description: 'Simplified streaming data processing',
              benefits: ['Simplified streaming syntax', 'Automatic backfill', 'Built-in quality checks'],
              releaseDate: 'Public Preview - October 2025',
              docs: 'https://docs.databricks.com/structured-streaming/streaming-tables.html'
            }
          ],
          recommendations: [
            'Migrate to Delta Live Tables: Define pipelines using @dlt.table/@dlt.view decorators → Add expectations for data quality (expect_or_fail/expect_or_drop) → Configure refresh mode (triggered/continuous) → Enable pipeline observability → Set up event logs for monitoring → Implement incremental processing with APPLY CHANGES FOR CDC',
            'Deploy Lakeflow Pipelines Editor: Create visual DAG for data flows → Configure source connections (cloud storage/databases) → Define transformations with SQL/Python → Add data quality rules → Set up lineage tracking → Schedule refresh intervals',
            'Implement Auto Loader for streaming ingestion: Use cloudFiles format → Configure schema evolution (addNewColumns/rescue) → Set up checkpoint location → Enable file notifications (queue/directory) → Define trigger intervals → Add schema hints for complex types'
          ]
        },
        developing: {
          features: [
            {
              name: 'Lakeflow Connect',
              description: 'Enterprise connectors for data ingestion',
              benefits: ['Pre-built connectors', 'Simplified integration', 'Managed pipelines'],
              releaseDate: 'Zerobus Ingest - October 2025',
              docs: 'https://docs.databricks.com/ingestion/lakeflow-connect/index.html'
            },
            {
              name: 'Serverless Jobs Performance Mode',
              description: 'Optimized serverless execution for production workloads',
              benefits: ['Better performance', 'Auto-optimization', 'Cost tracking'],
              releaseDate: 'Default for UI - September 2025',
              docs: 'https://docs.databricks.com/jobs/serverless-jobs.html'
            },
            {
              name: 'Jobs Triggered on Source Table Update',
              description: 'Event-driven pipeline orchestration',
              benefits: ['Real-time processing', 'Reduced latency', 'Efficient resource use'],
              releaseDate: 'October 2025',
              docs: 'https://docs.databricks.com/jobs/delta-live-tables.html'
            }
          ],
          recommendations: [
            'Migrate connectors to Lakeflow Connect',
            'Enable Performance Mode for production jobs',
            'Implement event-driven pipelines with table triggers'
          ]
        },
        maturing: {
          features: [
            {
              name: 'Delta Lake Liquid Clustering',
              description: 'Automatic data clustering for query performance',
              benefits: ['No manual tuning', 'Adaptive optimization', 'Query acceleration'],
              releaseDate: 'GA for DLT - August 2025',
              docs: 'https://docs.databricks.com/delta/clustering.html'
            },
            {
              name: 'Delta Lake Optimizations',
              description: 'Advanced compression and storage optimizations',
              benefits: ['Reduced storage costs', 'Faster queries', 'Better performance'],
              releaseDate: 'GA',
              docs: 'https://docs.databricks.com/delta/optimizations/index.html'
            },
            {
              name: 'Databricks Workflows',
              description: 'Orchestrate data pipelines and jobs',
              benefits: ['Job scheduling', 'Dependency management', 'Monitoring'],
              releaseDate: 'GA',
              docs: 'https://docs.databricks.com/workflows/index.html'
            }
          ],
          recommendations: [
            'Enable Liquid Clustering for all large tables',
            'Migrate to Zstd compression for cost savings',
            'Use Backfill for historical data reprocessing'
          ]
        },
        optimized: {
          features: [
            {
              name: 'Python Custom Data Sources for DLT',
              description: 'Extend DLT with custom Python sources',
              benefits: ['Flexible integration', 'Custom logic', 'Reusable components'],
              releaseDate: 'September 2025',
              docs: 'https://docs.databricks.com/delta-live-tables/python-ref.html'
            },
            {
              name: 'Stream Progress Metrics',
              description: 'Real-time streaming pipeline monitoring',
              benefits: ['Visibility', 'Performance tuning', 'SLA monitoring'],
              releaseDate: 'Public Preview - September 2025',
              docs: 'https://docs.databricks.com/delta-live-tables/observability.html'
            },
            {
              name: 'SCD Type 2 Support',
              description: 'Slowly changing dimensions tracking',
              benefits: ['Historical tracking', 'Audit trail', 'Time-travel queries'],
              releaseDate: 'SQL Server connector - September 2025',
              docs: 'https://docs.databricks.com/delta-live-tables/cdc.html'
            }
          ],
          recommendations: [
            'Implement Python Custom Sources for complex logic',
            'Monitor streaming with Progress Metrics',
            'Use SCD Type 2 for dimension tables'
          ]
        },
        innovative: {
          features: [
            {
              name: 'Lakebase Postgres',
              description: 'Transactional database on lakehouse',
              benefits: ['OLTP on lakehouse', 'Unified platform', 'Cost consolidation'],
              releaseDate: 'Public Preview - August 2025',
              docs: 'https://docs.databricks.com/delta-live-tables/index.html'
            },
            {
              name: 'Lakebase Synced Tables',
              description: 'Real-time sync from external databases',
              benefits: ['Near real-time data', 'Simplified ETL', 'Reduced complexity'],
              releaseDate: 'Snapshot mode - August 2025',
              docs: 'https://docs.databricks.com/ingestion/index.html'
            },
            {
              name: 'ai_parse_document',
              description: 'AI-powered document parsing',
              benefits: ['Extract structured data', 'OCR capabilities', 'Intelligent parsing'],
              releaseDate: 'Public Preview - October 2025',
              docs: 'https://docs.databricks.com/sql/language-manual/sql-ref-functions-builtin.html'
            }
          ],
          recommendations: [
            'Evaluate Lakebase for OLTP workloads',
            'Use Synced Tables for real-time replication',
            'Leverage ai_parse_document for unstructured data'
          ]
        }
      },

      analytics_bi: {
        emerging: {
          features: [
            {
              name: 'Databricks SQL',
              description: 'High-performance SQL analytics platform',
              benefits: ['Fast queries', 'BI tool integration', 'Photon acceleration'],
              releaseDate: 'GA',
              docs: 'https://docs.databricks.com/sql/index.html'
            },
            {
              name: 'Dashboards and Genie Spaces',
              description: 'Interactive dashboards with AI assistant',
              benefits: ['Self-service analytics', 'Natural language queries', 'Collaboration'],
              releaseDate: 'Tagging - October 2025',
              docs: 'https://docs.databricks.com/dashboards/index.html'
            },
            {
              name: 'Databricks Connector for Google Sheets',
              description: 'Direct integration with Google Sheets',
              benefits: ['Familiar interface', 'Easy data access', 'Collaboration'],
              releaseDate: 'Additional features - October 2025',
              docs: 'https://docs.databricks.com/partners/google-sheets.html'
            }
          ],
          recommendations: [
            'Start with Databricks SQL for analytics',
            'Create interactive Dashboards with Genie',
            'Enable Google Sheets connector for business users'
          ]
        },
        developing: {
          features: [
            {
              name: 'Power BI Databricks Connector',
              description: 'M2M OAuth for secure Power BI integration',
              benefits: ['Secure connection', 'SSO support', 'Enterprise ready'],
              releaseDate: 'M2M OAuth - August 2025',
              docs: 'https://docs.databricks.com/partners/bi/power-bi.html'
            },
            {
              name: 'Explore Table Data with LLM',
              description: 'Natural language data exploration',
              benefits: ['No SQL required', 'Faster insights', 'Democratized analytics'],
              releaseDate: 'Public Preview - September 2025',
              docs: 'https://docs.databricks.com/machine-learning/foundation-models/index.html'
            },
            {
              name: 'Partition Metadata',
              description: 'Optimized query planning with partition info',
              benefits: ['Faster queries', 'Better performance', 'Cost reduction'],
              releaseDate: 'GA - October 2025',
              docs: 'https://docs.databricks.com/delta/table-details.html'
            }
          ],
          recommendations: [
            'Upgrade Power BI connector to M2M OAuth',
            'Enable LLM-based exploration for analysts',
            'Leverage Partition Metadata for performance'
          ]
        },
        maturing: {
          features: [
            {
              name: 'Databricks Connector for Microsoft Power Platform',
              description: 'Integration with Power Apps and Power Automate',
              benefits: ['Low-code integration', 'Workflow automation', 'App development'],
              releaseDate: 'Public Preview - September 2025',
              docs: 'https://docs.databricks.com/integrations/partners.html'
            },
            {
              name: 'SQL MCP Server',
              description: 'Model Context Protocol for SQL',
              benefits: ['Standardized interface', 'Tool integration', 'Extensibility'],
              releaseDate: 'Beta - October 2025',
              docs: 'https://docs.databricks.com/integrations/index.html'
            },
            {
              name: 'Unified Runs List',
              description: 'Centralized view of all executions',
              benefits: ['Better monitoring', 'Unified tracking', 'Easier debugging'],
              releaseDate: 'Public Preview - October 2025',
              docs: 'https://docs.databricks.com/workflows/index.html'
            }
          ],
          recommendations: [
            'Integrate with Power Platform for low-code solutions',
            'Adopt SQL MCP Server for standardization',
            'Use Unified Runs List for operational visibility'
          ]
        },
        optimized: {
          features: [
            {
              name: 'Route-Optimized Endpoints',
              description: 'Performance-optimized query endpoints',
              benefits: ['Lower latency', 'Better throughput', 'Cost efficiency'],
              releaseDate: 'September 2025',
              docs: 'https://docs.databricks.com/sql/admin/query-optimization.html'
            },
            {
              name: 'Delta Sharing on Lakehouse Federation',
              description: 'Share data across platforms',
              benefits: ['Cross-platform sharing', 'Secure distribution', 'Unified governance'],
              releaseDate: 'Beta - September 2025',
              docs: 'https://docs.databricks.com/data-sharing/index.html'
            },
            {
              name: 'Tables on Default Storage (Delta Sharing)',
              description: 'Share tables without external storage',
              benefits: ['Simplified sharing', 'Reduced complexity', 'Cost savings'],
              releaseDate: 'Beta - September 2025',
              docs: 'https://docs.databricks.com/data-sharing/index.html'
            }
          ],
          recommendations: [
            'Migrate to Route-Optimized Endpoints',
            'Implement Delta Sharing for data products',
            'Share tables on default storage for simplicity'
          ]
        },
        innovative: {
          features: [
            {
              name: 'Delta Sharing with Row Filters and Column Masks',
              description: 'Fine-grained data sharing controls',
              benefits: ['Privacy-preserving sharing', 'Compliance', 'Granular access'],
              releaseDate: 'GA - October 2025',
              docs: 'https://docs.databricks.com/data-sharing/index.html'
            },
            {
              name: 'Mount Delta Shares to Catalog',
              description: 'Seamless integration of shared data',
              benefits: ['Unified access', 'Simplified discovery', 'Easy consumption'],
              releaseDate: 'September 2025',
              docs: 'https://docs.databricks.com/data-sharing/read-data.html'
            }
          ],
          recommendations: [
            'Implement row-level security for Delta Sharing',
            'Mount shared catalogs for unified access',
            'Build data marketplace with Delta Sharing'
          ]
        }
      },

      machine_learning: {
        emerging: {
          features: [
            {
              name: 'MLflow on Databricks',
              description: 'Enterprise ML lifecycle management',
              benefits: ['Experiment tracking', 'Model registry', 'Deployment automation'],
              releaseDate: 'GA',
              docs: 'https://docs.databricks.com/mlflow/index.html'
            },
            {
              name: 'Feature Engineering in Unity Catalog',
              description: 'Centralized feature store',
              benefits: ['Feature reuse', 'Consistency', 'Governance'],
              releaseDate: 'GA',
              docs: 'https://docs.databricks.com/machine-learning/feature-store/index.html'
            },
            {
              name: 'Serverless GPU Compute',
              description: 'On-demand GPU for ML workloads',
              benefits: ['No cluster management', 'H100 support', 'Multinode training'],
              releaseDate: 'Beta H100 - September 2025',
              docs: 'https://docs.databricks.com/machine-learning/train-model/index.html'
            }
          ],
          recommendations: [
            'Implement MLflow for ML experiment tracking',
            'Create Feature Store in Unity Catalog',
            'Use Serverless GPU for training workloads'
          ]
        },
        developing: {
          features: [
            {
              name: 'Databricks Online Feature Stores',
              description: 'Low-latency feature serving',
              benefits: ['Real-time inference', 'Sub-10ms latency', 'Managed service'],
              releaseDate: 'Public Preview - September 2025',
              docs: 'https://docs.databricks.com/machine-learning/feature-store/online-tables.html'
            },
            {
              name: 'MLflow Metadata in System Tables',
              description: 'Centralized ML metrics and lineage',
              benefits: ['ML governance', 'Audit trail', 'Cost attribution'],
              releaseDate: 'Public Preview - September 2025',
              docs: 'https://docs.databricks.com/machine-learning/manage-model-lifecycle/index.html'
            },
            {
              name: 'Scheduled Jobs for Serverless GPU',
              description: 'Automated ML pipeline execution',
              benefits: ['Scheduled training', 'Cost efficiency', 'Production ML'],
              releaseDate: 'August 2025',
              docs: 'https://docs.databricks.com/compute/serverless.html'
            }
          ],
          recommendations: [
            'Deploy Online Feature Stores for real-time ML',
            'Enable MLflow system tables for governance',
            'Schedule GPU jobs for production pipelines'
          ]
        },
        maturing: {
          features: [
            {
              name: 'Mosaic AI Model Serving',
              description: 'Scalable model deployment platform',
              benefits: ['Auto-scaling', 'A/B testing', 'Monitoring'],
              releaseDate: 'GPT-5 support - October 2025',
              docs: 'https://docs.databricks.com/machine-learning/model-serving/index.html'
            },
            {
              name: 'OpenAI GPT OSS Models',
              description: 'Open-source GPT models on Databricks',
              benefits: ['Function calling', 'Batch inference', 'Structured outputs'],
              releaseDate: 'August 2025',
              docs: 'https://docs.databricks.com/machine-learning/foundation-models/openai-gpt-oss.html'
            },
            {
              name: 'Anthropic Claude Models',
              description: 'Claude Sonnet 4.5 with prompt caching',
              benefits: ['Cost reduction', 'Better performance', 'Enterprise features'],
              releaseDate: 'October 2025',
              docs: 'https://docs.databricks.com/machine-learning/foundation-models/claude.html'
            }
          ],
          recommendations: [
            'Deploy models with Mosaic AI Model Serving',
            'Use OpenAI GPT OSS for cost-effective LLMs',
            'Leverage Claude Sonnet 4.5 with prompt caching'
          ]
        },
        optimized: {
          features: [
            {
              name: 'Multimodal Support',
              description: 'Process text, images, audio, and video',
              benefits: ['Unified processing', 'Richer ML models', 'New use cases'],
              releaseDate: 'October 2025',
              docs: 'https://docs.databricks.com/machine-learning/multimodal.html'
            },
            {
              name: 'Token-Based Rate Limits on AI Gateway',
              description: 'Fine-grained API cost control',
              benefits: ['Cost management', 'Fair usage', 'Budget protection'],
              releaseDate: 'August 2025',
              docs: 'https://docs.databricks.com/machine-learning/ai-gateway/rate-limits.html'
            },
            {
              name: 'Provisioned Throughput for Foundation Models',
              description: 'Guaranteed capacity for production workloads',
              benefits: ['Predictable latency', 'SLA support', 'Cost savings'],
              releaseDate: 'OpenAI GPT OSS - August 2025',
              docs: 'https://docs.databricks.com/machine-learning/foundation-models/provisioned-throughput.html'
            }
          ],
          recommendations: [
            'Enable Multimodal support for advanced use cases',
            'Implement token-based rate limits for cost control',
            'Use Provisioned Throughput for production apps'
          ]
        },
        innovative: {
          features: [
            {
              name: 'Mosaic AI Model Serving with GPT-5',
              description: 'Latest OpenAI GPT-5 models',
              benefits: ['Cutting-edge capabilities', 'Better reasoning', 'Higher quality'],
              releaseDate: 'GA - October 2025',
              docs: 'https://docs.databricks.com/machine-learning/foundation-models/index.html'
            },
            {
              name: 'AWS Capacity Blocks for Compute',
              description: 'Reserve compute capacity on AWS',
              benefits: ['Guaranteed availability', 'Cost predictability', 'Planning'],
              releaseDate: 'October 2025',
              docs: 'https://docs.databricks.com/compute/configure.html'
            }
          ],
          recommendations: [
            'Adopt GPT-5 for state-of-the-art capabilities',
            'Reserve capacity blocks for critical workloads',
            'Participate in beta programs for new models'
          ]
        }
      },

      generative_ai: {
        emerging: {
          features: [
            {
              name: 'Mosaic AI Agent Framework',
              description: 'Build production-quality AI agents',
              benefits: ['RAG support', 'Tool calling', 'Evaluation framework'],
              releaseDate: 'Automatic auth - September 2025',
              docs: 'https://docs.databricks.com/generative-ai/agent-framework/index.html'
            },
            {
              name: 'AI Playground',
              description: 'Interactive testing environment for LLMs',
              benefits: ['Rapid prototyping', 'Model comparison', 'Prompt engineering'],
              releaseDate: 'GA - August 2025',
              docs: 'https://docs.databricks.com/generative-ai/ai-playground.html'
            },
            {
              name: 'Databricks Assistant',
              description: 'AI-powered coding assistant',
              benefits: ['Code generation', 'Natural language SQL', 'Debugging help'],
              releaseDate: 'User instructions - August 2025',
              docs: 'https://docs.databricks.com/assistant/index.html'
            }
          ],
          recommendations: [
            'Build first AI agent with Agent Framework',
            'Use AI Playground for prompt development',
            'Enable Databricks Assistant for productivity'
          ]
        },
        developing: {
          features: [
            {
              name: 'Mosaic AI Vector Search',
              description: 'Managed vector database for RAG',
              benefits: ['Semantic search', 'Hybrid search', 'Auto-sync'],
              releaseDate: 'Reranker - August 2025',
              docs: 'https://docs.databricks.com/generative-ai/vector-search.html'
            },
            {
              name: 'External MCP Servers',
              description: 'Integrate external tools with Model Context Protocol',
              benefits: ['Tool extensibility', 'Custom integrations', 'Enterprise tools'],
              releaseDate: 'Beta - August 2025',
              docs: 'https://docs.databricks.com/generative-ai/agent-framework/index.html'
            },
            {
              name: 'Databricks Apps for Genie',
              description: 'Deploy AI applications with Genie resources',
              benefits: ['Easy deployment', 'No infrastructure', 'Integrated experience'],
              releaseDate: 'September 2025',
              docs: 'https://docs.databricks.com/integrations/genie.html'
            }
          ],
          recommendations: [
            'Implement Vector Search for RAG applications',
            'Integrate external tools with MCP Servers',
            'Deploy AI apps with Databricks Apps'
          ]
        },
        maturing: {
          features: [
            {
              name: 'AI Agents: Authorize On-Behalf-Of-User',
              description: 'User context for AI agent actions',
              benefits: ['Fine-grained permissions', 'Audit trail', 'Secure delegation'],
              releaseDate: 'Public Preview - September 2025',
              docs: 'https://docs.databricks.com/generative-ai/agent-framework/index.html'
            },
            {
              name: 'Data Science Agent (Assistant)',
              description: 'AI agent for data science workflows',
              benefits: ['Code generation', 'Analysis assistance', 'Amazon Bedrock support'],
              releaseDate: 'Beta - September 2025',
              docs: 'https://docs.databricks.com/assistant/index.html'
            },
            {
              name: 'Databricks-Hosted Foundation Models',
              description: 'Pre-deployed models without setup',
              benefits: ['Zero setup', 'Managed infrastructure', 'Cost-effective'],
              releaseDate: 'GA for Assistant - August 2025',
              docs: 'https://docs.databricks.com/machine-learning/foundation-models/hosted-models.html'
            }
          ],
          recommendations: [
            'Use on-behalf-of-user for secure AI agents',
            'Enable Data Science Agent for analysts',
            'Leverage hosted models for quick starts'
          ]
        },
        optimized: {
          features: [
            {
              name: 'Compliance Support for Vector Search',
              description: 'Enterprise-grade vector database compliance',
              benefits: ['Data residency', 'Compliance certifications', 'Audit logs'],
              releaseDate: 'Standard endpoints - September 2025',
              docs: 'https://docs.databricks.com/generative-ai/vector-search.html'
            },
            {
              name: 'Prompt Caching for Claude',
              description: 'Reduce costs with intelligent caching',
              benefits: ['Up to 90% cost reduction', 'Faster responses', 'Better UX'],
              releaseDate: 'October 2025',
              docs: 'https://docs.databricks.com/machine-learning/foundation-models/claude.html'
            },
            {
              name: 'Assistant Edit Mode',
              description: 'Multi-cell refactoring and advanced edits',
              benefits: ['Complex refactoring', 'Multi-cell operations', 'Code quality'],
              releaseDate: 'August 2025',
              docs: 'https://docs.databricks.com/assistant/index.html'
            }
          ],
          recommendations: [
            'Enable compliance features for production Vector Search',
            'Implement prompt caching to reduce costs',
            'Use Assistant Edit Mode for code refactoring'
          ]
        },
        innovative: {
          features: [
            {
              name: 'Alibaba Cloud Qwen3-Next Instruct',
              description: 'Latest multilingual foundation model',
              benefits: ['Multiple languages', 'Strong performance', 'Cost-effective'],
              releaseDate: 'Beta - October 2025',
              docs: 'https://docs.databricks.com/machine-learning/foundation-models/index.html'
            },
            {
              name: 'Assistant Integrated with Compute',
              description: 'Context-aware assistance across platform',
              benefits: ['Better suggestions', 'Resource awareness', 'Unified experience'],
              releaseDate: 'August 2025',
              docs: 'https://docs.databricks.com/assistant/index.html'
            }
          ],
          recommendations: [
            'Experiment with Qwen3-Next for multilingual apps',
            'Leverage compute-integrated Assistant',
            'Contribute to AI feature beta programs'
          ]
        }
      },

      operational_excellence: {
        emerging: {
          features: [
            {
              name: 'Databricks Asset Bundles',
              description: 'Infrastructure as code for Databricks',
              benefits: ['CI/CD automation', 'Version control', 'Repeatable deployments'],
              releaseDate: 'GA in workspace - October 2025',
              docs: 'https://docs.databricks.com/dev-tools/bundles/index.html'
            },
            {
              name: 'Notebook Execution Minimap',
              description: 'Visual tracking of notebook runs',
              benefits: ['Better debugging', 'Execution visibility', 'Navigation'],
              releaseDate: 'August 2025',
              docs: 'https://docs.databricks.com/notebooks/index.html'
            },
            {
              name: 'Enhanced Autocomplete',
              description: 'Context-aware code completion',
              benefits: ['Faster coding', 'Fewer errors', 'Better productivity'],
              releaseDate: 'Complex data types - August 2025',
              docs: 'https://docs.databricks.com/notebooks/autocomplete.html'
            }
          ],
          recommendations: [
            'Adopt Asset Bundles for deployment automation',
            'Use Notebook Minimap for execution tracking',
            'Enable Enhanced Autocomplete for developers'
          ]
        },
        developing: {
          features: [
            {
              name: 'Billable Usage Table for Serverless',
              description: 'Track performance mode and costs',
              benefits: ['Cost transparency', 'Usage optimization', 'Chargeback'],
              releaseDate: 'October 2025',
              docs: 'https://docs.databricks.com/administration-guide/account-settings/usage.html'
            },
            {
              name: 'Git Email Identity for Folders',
              description: 'Author tracking for Git folders',
              benefits: ['Proper attribution', 'Audit trail', 'Collaboration'],
              releaseDate: 'October 2025',
              docs: 'https://docs.databricks.com/repos/index.html'
            },
            {
              name: 'Databricks GitHub App Permissions',
              description: 'Enhanced GitHub integration',
              benefits: ['Better security', 'Fine-grained access', 'Compliance'],
              releaseDate: 'October 2025',
              docs: 'https://docs.databricks.com/repos/repos-setup.html'
            }
          ],
          recommendations: [
            'Monitor serverless usage with billable tables',
            'Configure Git email identity for attribution',
            'Update GitHub App with new permissions'
          ]
        },
        maturing: {
          features: [
            {
              name: 'Pipeline Update Timeline Table',
              description: 'Track DLT pipeline changes over time',
              benefits: ['Change management', 'Debugging', 'Audit trail'],
              releaseDate: 'Public Preview - September 2025',
              docs: 'https://docs.databricks.com/delta-live-tables/observability.html'
            },
            {
              name: 'Set Run-As User for DLT',
              description: 'Execute pipelines as specific users',
              benefits: ['Security', 'Compliance', 'Delegation'],
              releaseDate: 'August 2025',
              docs: 'https://docs.databricks.com/delta-live-tables/index.html'
            },
            {
              name: 'Single-Node Compute (Standard Access Mode)',
              description: 'Simplified single-node clusters',
              benefits: ['Cost savings', 'Faster startup', 'Development efficiency'],
              releaseDate: 'GA - August 2025',
              docs: 'https://docs.databricks.com/clusters/configure.html'
            }
          ],
          recommendations: [
            'Use Pipeline Timeline for change tracking',
            'Configure run-as user for secure pipelines',
            'Adopt single-node clusters for development'
          ]
        },
        optimized: {
          features: [
            {
              name: 'Disable Legacy Features for New Workspaces',
              description: 'Start with modern features only',
              benefits: ['Cleaner experience', 'Better security', 'Future-proof'],
              releaseDate: 'Public Preview - August 2025',
              docs: 'https://docs.databricks.com/workspace/index.html'
            },
            {
              name: 'Account SCIM 2.0 Updates',
              description: 'Enhanced user provisioning',
              benefits: ['Better synchronization', 'SSO integration', 'Automation'],
              releaseDate: 'August 2025',
              docs: 'https://docs.databricks.com/administration-guide/users-groups/scim/index.html'
            },
            {
              name: 'Databricks Terraform Provider (Lakebase)',
              description: 'IaC support for Lakebase resources',
              benefits: ['Automation', 'Consistency', 'GitOps'],
              releaseDate: 'July 2025',
              docs: 'https://registry.terraform.io/providers/databricks/databricks/latest'
            }
          ],
          recommendations: [
            'Disable legacy features for new workspaces',
            'Upgrade to SCIM 2.0 for user management',
            'Use Terraform for infrastructure automation'
          ]
        },
        innovative: {
          features: [
            {
              name: 'Serverless Base Environment Management',
              description: 'Customize serverless Python environments',
              benefits: ['Custom packages', 'Version control', 'Team standards'],
              releaseDate: 'Public Preview - August 2025',
              docs: 'https://docs.databricks.com/serverless-compute/index.html'
            },
            {
              name: 'PrivateLink from Serverless to VPC',
              description: 'Secure serverless connectivity',
              benefits: ['Network isolation', 'Compliance', 'Security'],
              releaseDate: 'GA - August 2025',
              docs: 'https://docs.databricks.com/security/network/classic/privatelink.html'
            }
          ],
          recommendations: [
            'Manage serverless environments centrally',
            'Configure PrivateLink for secure connectivity',
            'Establish center of excellence for best practices'
          ]
        }
      }
    };
  }

  /**
   * Generate contextualized recommendations based on assessment responses
   * @param {Object} pillarId - The assessment pillar
   * @param {Number} maturityLevel - Current maturity level (1-5)
   * @param {Object} responses - User's assessment responses
   * @returns {Object} Customized recommendations
   */
  getRecommendationsForPillar(pillarId, maturityLevel, responses = {}) {
    const maturityLevelMap = {
      1: 'emerging',
      2: 'developing',
      3: 'maturing',
      4: 'optimized',
      5: 'innovative'
    };

    const level = maturityLevelMap[maturityLevel] || 'emerging';
    const pillarFeatures = this.featuresByPillar[pillarId];

    if (!pillarFeatures || !pillarFeatures[level]) {
      return this.getGenericRecommendations(maturityLevel);
    }

    const currentLevel = pillarFeatures[level];
    const nextLevel = maturityLevel < 5 ? pillarFeatures[maturityLevelMap[maturityLevel + 1]] : null;

    return {
      currentMaturity: {
        level: maturityLevel,
        name: level.charAt(0).toUpperCase() + level.slice(1),
        features: currentLevel.features,
        recommendations: currentLevel.recommendations
      },
      nextLevel: nextLevel ? {
        level: maturityLevel + 1,
        name: maturityLevelMap[maturityLevel + 1].charAt(0).toUpperCase() + maturityLevelMap[maturityLevel + 1].slice(1),
        features: nextLevel.features.slice(0, 3), // Top 3 next-level features
        recommendations: nextLevel.recommendations.slice(0, 3)
      } : null,
      quickWins: this.identifyQuickWins(pillarId, maturityLevel, responses),
      strategicMoves: this.identifyStrategicMoves(pillarId, maturityLevel, responses)
    };
  }

  /**
   * Identify next steps (customer engagement activities)
   */
  identifyQuickWins(pillarId, maturityLevel, responses) {
    const currentLevel = this.featuresByPillar[pillarId];
    if (!currentLevel) return [];

    // Customer engagement activities mapped to each pillar
    const nextStepsByPillar = {
      platform_governance: [
        'Schedule Unity Catalog discovery workshop to assess current data governance maturity',
        'Conduct hands-on training on row/column-level security and dynamic views',
        'Arrange proof-of-concept for automated data classification and tagging',
        'Book technical deep-dive session on audit logging and compliance reporting'
      ],
      data_engineering: [
        'Attend Delta Live Tables workshop for automated pipeline orchestration',
        'Schedule hands-on training for Auto Loader and streaming ingestion patterns',
        'Conduct lakehouse architecture assessment and migration planning session',
        'Arrange technical enablement on Databricks Workflows and CI/CD best practices'
      ],
      analytics_bi: [
        'Schedule Serverless SQL and Photon acceleration discovery session',
        'Conduct AI/BI and Genie demo for natural language analytics capabilities',
        'Arrange hands-on training for dashboard best practices and query optimization',
        'Book technical workshop on semantic layer and metrics definitions'
      ],
      machine_learning: [
        'Schedule MLflow and Feature Store technical deep-dive session',
        'Conduct hands-on training for model deployment and monitoring workflows',
        'Arrange proof-of-concept for AutoML and hyperparameter tuning',
        'Book enablement session on experiment tracking and model registry best practices'
      ],
      generative_ai: [
        'Schedule Vector Search and RAG architecture workshop',
        'Conduct Mosaic AI and Foundation Models discovery session',
        'Arrange hands-on training for prompt engineering and evaluation frameworks',
        'Book technical deep-dive on GenAI governance and security controls'
      ],
      operational_excellence: [
        'Establish Center of Excellence (CoE) structure and governance framework',
        'Schedule platform adoption workshop and change management training',
        'Conduct cost optimization and chargeback model planning session',
        'Arrange technical enablement program for team upskilling and certification'
      ]
    };

    const pillarSteps = nextStepsByPillar[pillarId] || [
      'Schedule discovery session to assess current capabilities',
      'Conduct hands-on training for key platform features',
      'Arrange proof-of-concept to validate use cases',
      'Book technical deep-dive with Databricks solution architects'
    ];

    // Return 3-4 relevant next steps based on maturity level
    const numberOfSteps = maturityLevel <= 2 ? 4 : 3;
    return pillarSteps.slice(0, numberOfSteps);
  }

  /**
   * Identify strategic initiatives
   */
  identifyStrategicMoves(pillarId, maturityLevel, responses) {
    if (maturityLevel >= 5) return [];

    const nextLevelKey = { 1: 'developing', 2: 'maturing', 3: 'optimized', 4: 'innovative' }[maturityLevel];
    const nextLevel = this.featuresByPillar[pillarId]?.[nextLevelKey];

    if (!nextLevel) return [];

    return nextLevel.features.slice(0, 2).map(f => ({
      title: f.name,
      description: f.description,
      benefits: f.benefits,
      timeline: '3-6 months',
      impact: 'Transformational',
      docs: f.docs
    }));
  }

  /**
   * Get generic recommendations as fallback
   */
  getGenericRecommendations(maturityLevel) {
    return {
      currentMaturity: {
        level: maturityLevel,
        features: [],
        recommendations: ['Assess your current state', 'Identify gaps', 'Plan improvements']
      },
      nextLevel: null,
      quickWins: [],
      strategicMoves: []
    };
  }

  /**
   * Generate prioritized action plan
   */
  generateActionPlan(assessmentResults) {
    const plan = {
      immediate: [],   // 0-3 months
      shortTerm: [],   // 3-6 months
      mediumTerm: [],  // 6-12 months
      longTerm: []     // 12+ months
    };

    // Analyze each pillar and categorize recommendations
    Object.keys(assessmentResults.pillars || {}).forEach(pillarId => {
      const pillar = assessmentResults.pillars[pillarId];
      const recs = this.getRecommendationsForPillar(pillarId, pillar.currentScore || 1, pillar.responses);

      if (recs.quickWins) {
        plan.immediate.push(...recs.quickWins);
      }

      if (recs.strategicMoves) {
        plan.mediumTerm.push(...recs.strategicMoves);
      }
    });

    return plan;
  }
}

module.exports = new DatabricksFeatureMapper();

