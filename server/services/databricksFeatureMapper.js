/**
 * Enterprise Architecture Capability & Feature Mapper
 * Maps assessment responses to modern open data, analytics, and AI architecture capabilities
 */

class DatabricksFeatureMapper {
  constructor() {
    // Enterprise architecture capabilities organized by maturity level and pillar
    this.featuresByPillar = {
      platform_governance: {
        emerging: {
          features: [
            {
              name: "Unified Metadata & Catalog Governance",
              description: "Centralized metadata catalog and access policy enforcement across multi-cloud storage",
              benefits: ["Centralized access control", "Data discovery", "Automated lineage tracking"],
              releaseDate: "GA"
            },
            {
              name: "Governed Data Exchange",
              description: "Open protocol for zero-copy secure data exchange with internal and external partners",
              benefits: ["Secure cross-platform data sharing", "Zero data duplication", "Fine-grained policy enforcement"],
              releaseDate: "GA"
            },
            {
              name: "Enterprise Data Product Catalog",
              description: "Self-service marketplace for governed data assets, metrics, and models",
              benefits: ["Accelerated data discovery", "Domain-driven data ownership", "Consumer self-service"],
              releaseDate: "GA"
            },
            {
              name: "Elastic Serverless Compute Pools",
              description: "On-demand elastic compute infrastructure without manual cluster management",
              benefits: ["Zero cluster provisioning", "Sub-second elasticity", "Automated idle termination"],
              releaseDate: "GA"
            }
          ],
          recommendations: [
            "Deploy Unified Metadata Catalog: Establish 3-tier namespace (catalog.schema.table) -> Configure IAM access policies -> Enable centralized audit logging",
            "Provision Elastic Serverless Compute: Configure auto-scaling compute pools -> Define max execution timeouts -> Enforce auto-termination for inactive resources",
            "Standardize Infrastructure-as-Code: Define workspace and access policies in Terraform / Pulumi -> Automate deployment via CI/CD"
          ]
        },
        developing: {
          features: [
            {
              name: "Attribute-Based Access Control (ABAC)",
              description: "Dynamic tag-based access control and runtime column/row level security filtering",
              benefits: ["Dynamic security policies", "Reduced policy sprawl", "Automated compliance"],
              releaseDate: "GA"
            },
            {
              name: "Automated PII & Sensitive Data Discovery",
              description: "Continuous scanning and classification for sensitive data and compliance tags",
              benefits: ["Automated compliance (GDPR/HIPAA)", "Risk mitigation", "Data privacy enforcement"],
              releaseDate: "GA"
            },
            {
              name: "FinOps Budget & Quota Enforcement",
              description: "Automated spending controls, project-level quotas, and proactive cost anomaly alerts",
              benefits: ["Cost transparency", "Proactive budget alerting", "Resource chargeback"],
              releaseDate: "GA"
            }
          ],
          recommendations: [
            "Implement Attribute-Based Access Control (ABAC) for dynamic row and column level masking",
            "Enable automated PII classification across all ingestion landing zones",
            "Configure project-level FinOps budget alerts and cluster auto-termination rules"
          ]
        },
        maturing: {
          features: [
            {
              name: "Governed Metadata Tagging System",
              description: "Enterprise-grade classification taxonomy and policy enforcement tags",
              benefits: ["Consistent taxonomy", "Automated policy inheritance", "Cost attribution"],
              releaseDate: "GA"
            },
            {
              name: "Asset Trust & Certification Framework",
              description: "Official gold-standard asset badges and verified data quality seals",
              benefits: ["Data consumer trust", "Verified data products", "Executive dashboard reliability"],
              releaseDate: "GA"
            },
            {
              name: "Self-Service Access Request Workflows",
              description: "Automated access approval workflows with time-bound credentials and audit trails",
              benefits: ["Faster access approval", "Complete audit trail", "Zero privilege creep"],
              releaseDate: "GA"
            }
          ],
          recommendations: [
            "Implement governed taxonomy tags for business domain organization",
            "Enforce certification status badges on production analytical datasets",
            "Deploy self-service data access request workflows with automated manager approval"
          ]
        },
        optimized: {
          features: [
            {
              name: "Automated Compliance & Security Profiles",
              description: "Continuous security auditing against SOC2, HIPAA, and ISO27001 benchmarks",
              benefits: ["Continuous compliance verification", "Audit readiness", "Automated remediation"],
              releaseDate: "GA"
            },
            {
              name: "Governed Multi-Cloud Storage Gateways",
              description: "Secure cloud object storage connectivity with centralized credential rotation",
              benefits: ["Direct IAM role federation", "Encrypted transit", "Centralized storage audit"],
              releaseDate: "GA"
            }
          ],
          recommendations: [
            "Deploy continuous security posture and compliance profile monitoring",
            "Configure governed multi-cloud storage gateways with automated IAM credential rotation"
          ]
        },
        innovative: {
          features: [
            {
              name: "Autonomous Governance & Self-Healing Policies",
              description: "AI-assisted anomaly detection for data access, lineage deviations, and schema drift",
              benefits: ["Zero-touch policy enforcement", "Predictive threat prevention", "Automated documentation"],
              releaseDate: "GA"
            }
          ],
          recommendations: [
            "Adopt autonomous governance policies for real-time anomaly detection and access prevention",
            "Enable AI-assisted metadata enrichment and documentation synthesis"
          ]
        }
      },

      data_engineering: {
        emerging: {
          features: [
            {
              name: "Declarative Data Pipelines",
              description: "Declarative ETL/ELT pipelines with built-in data quality expectations and auto-recovery",
              benefits: ["Simplified pipeline development", "Built-in quality assertions", "Automated lineage capture"],
              releaseDate: "GA"
            },
            {
              name: "Streaming Ingestion & Schema Evolution",
              description: "Scalable streaming ingestion from cloud storage with automated schema detection",
              benefits: ["Automated schema drift handling", "Incremental file discovery", "Zero-maintenance ingest"],
              releaseDate: "GA"
            },
            {
              name: "Open Table Format Optimization",
              description: "High-performance open table storage (Delta Lake / Iceberg) with automated compaction",
              benefits: ["ACID transactions", "Time travel & rollback", "Sub-second read performance"],
              releaseDate: "GA"
            }
          ],
          recommendations: [
            "Migrate legacy scripts to declarative data pipelines with automated data quality assertions",
            "Implement streaming ingestion for landing zones with automated schema evolution",
            "Standardize on open table formats with automated file compaction and clustering"
          ]
        },
        developing: {
          features: [
            {
              name: "Automated Change Data Capture (CDC)",
              description: "Real-time incremental change capture from transactional databases into the lakehouse",
              benefits: ["Sub-minute data freshness", "Low source database impact", "Simplified SCD Type 1 & 2"],
              releaseDate: "GA"
            },
            {
              name: "Pipeline Observability & Alerting",
              description: "Comprehensive runtime telemetry, latency tracking, and proactive anomaly notifications",
              benefits: ["Proactive issue detection", "SLA tracking", "Root cause diagnostic insights"],
              releaseDate: "GA"
            }
          ],
          recommendations: [
            "Implement automated CDC ingestion for core relational and transactional databases",
            "Configure pipeline observability dashboards with automated Slack and email alerts"
          ]
        },
        maturing: {
          features: [
            {
              name: "Event-Driven Workflow Orchestration",
              description: "Enterprise DAG orchestration triggered by data arrival, schedules, or API webhooks",
              benefits: ["End-to-end dependency management", "Idempotent execution", "Automated retry backoffs"],
              releaseDate: "GA"
            }
          ],
          recommendations: [
            "Modernize batch orchestrations to event-driven DAG execution models",
            "Implement automated retry and error-handling policies across all data transformation workflows"
          ]
        },
        optimized: {
          features: [
            {
              name: "Zero-Copy Data Virtualization",
              description: "Query remote databases and object storage without massive data duplication",
              benefits: ["Instant cross-system analytics", "Reduced storage duplication", "Unified query layer"],
              releaseDate: "GA"
            }
          ],
          recommendations: [
            "Deploy zero-copy query federation across operational databases and lakehouse storage"
          ]
        },
        innovative: {
          features: [
            {
              name: "Autonomous Pipeline Optimization",
              description: "Self-tuning data pipelines that optimize compute sizing and file layouts dynamically",
              benefits: ["Automated cost minimization", "Maximized throughput", "Zero manual tuning"],
              releaseDate: "GA"
            }
          ],
          recommendations: [
            "Enable autonomous compute sizing and adaptive file compaction policies"
          ]
        }
      },

      analytics_bi: {
        emerging: {
          features: [
            {
              name: "Vectorized Serverless SQL Engine",
              description: "Elastic SQL compute pool with sub-second response times and auto-suspend",
              benefits: ["Instant query availability", "Zero infrastructure management", "Pay-per-query efficiency"],
              releaseDate: "GA"
            },
            {
              name: "Centralized Semantic Layer",
              description: "Standardized business metrics definitions, dimensions, and KPI calculations",
              benefits: ["Single source of truth", "Consistent metrics across BI tools", "Faster self-service"],
              releaseDate: "GA"
            },
            {
              name: "Executive Dashboard & Alerting System",
              description: "Interactive analytics dashboards with scheduled refreshes and automated KPI threshold alerts",
              benefits: ["Real-time KPI monitoring", "Self-service exploration", "Automated executive reports"],
              releaseDate: "GA"
            }
          ],
          recommendations: [
            "Provision serverless SQL compute pools for elastic BI and analytical exploration",
            "Establish centralized semantic layer definitions for core corporate KPIs",
            "Connect enterprise BI tools (Power BI, Tableau, ThoughtSpot) via native connectors"
          ]
        },
        developing: {
          features: [
            {
              name: "Natural Language AI Analytics",
              description: "Conversational natural language interface for non-technical business analytics",
              benefits: ["Democratized data access", "Instant ad-hoc answers", "Reduced analyst backlog"],
              releaseDate: "GA"
            },
            {
              name: "Intelligent Query Result Caching",
              description: "Multi-tiered caching layer for accelerated repeated queries and executive dashboards",
              benefits: ["Zero-compute repeat queries", "Instant dashboard load times", "Lower cloud costs"],
              releaseDate: "GA"
            }
          ],
          recommendations: [
            "Enable natural-language query interfaces for self-service business user exploration",
            "Configure predictive result caching for high-concurrency executive dashboards"
          ]
        },
        maturing: {
          features: [
            {
              name: "Cross-Engine Query Federation",
              description: "Direct querying across cloud warehouses and object storage without ETL movement",
              benefits: ["Faster cross-platform insights", "Eliminates redundant data pipelines", "Unified SQL interface"],
              releaseDate: "GA"
            }
          ],
          recommendations: [
            "Implement query federation to query external databases directly without bespoke pipelines"
          ]
        },
        optimized: {
          features: [
            {
              name: "Continuous Real-Time Streaming Analytics",
              description: "Sub-second real-time streaming SQL queries on continuous event data",
              benefits: ["Immediate operational decisioning", "Live telemetry monitoring", "Fraud detection"],
              releaseDate: "GA"
            }
          ],
          recommendations: [
            "Deploy real-time streaming analytics pipelines for live operational visibility"
          ]
        },
        innovative: {
          features: [
            {
              name: "Predictive & Prescriptive Business Insights",
              description: "Embedded machine learning algorithms generating automated trend forecasts and root cause analysis",
              benefits: ["Automated anomaly explanation", "Forward-looking insights", "Proactive business alerts"],
              releaseDate: "GA"
            }
          ],
          recommendations: [
            "Embed automated trend forecasting and prescriptive insights into business reporting"
          ]
        }
      },

      machine_learning: {
        emerging: {
          features: [
            {
              name: "Centralized Experiment Tracking",
              description: "Standardized logging for model parameters, code versions, metrics, and artifacts",
              benefits: ["Reproducible experiments", "Side-by-side model comparison", "Team collaboration"],
              releaseDate: "GA"
            },
            {
              name: "Enterprise Model Registry",
              description: "Governed model lifecycle management from staging to production and deprecation",
              benefits: ["Versioned model artifacts", "Automated governance checks", "Controlled release gates"],
              releaseDate: "GA"
            },
            {
              name: "Managed Real-Time Model Serving",
              description: "Auto-scaling inference endpoints with zero-downtime rollouts and traffic splitting",
              benefits: ["Low-latency inference", "Elastic CPU/GPU scaling", "A/B testing support"],
              releaseDate: "GA"
            }
          ],
          recommendations: [
            "Integrate open standard experiment tracking to record all data science training runs",
            "Establish an enterprise Model Registry to govern production model deployments",
            "Deploy real-time model inference endpoints with automated scaling policies"
          ]
        },
        developing: {
          features: [
            {
              name: "Centralized Feature Store & Serving",
              description: "Shared repository for curated features ensuring training/serving consistency",
              benefits: ["Eliminated feature drift", "Feature reusability across teams", "Low-latency online lookup"],
              releaseDate: "GA"
            },
            {
              name: "Automated Model Drift & Observability",
              description: "Continuous monitoring of model prediction quality, data drift, and latency degradation",
              benefits: ["Proactive degradation alerts", "Automated retraining triggers", "Ground truth tracking"],
              releaseDate: "GA"
            }
          ],
          recommendations: [
            "Deploy a centralized Feature Store for top ML features to guarantee training-serving parity",
            "Configure production model monitoring dashboards with automated drift alerts"
          ]
        },
        maturing: {
          features: [
            {
              name: "Distributed AutoML & Hyperparameter Tuning",
              description: "Automated model architecture search, hyperparameter optimization, and baseline generation",
              benefits: ["Accelerated experimentation", "Optimal model architectures", "Automated code generation"],
              releaseDate: "GA"
            }
          ],
          recommendations: [
            "Utilize distributed AutoML for rapid baseline model generation and hyperparameter search"
          ]
        },
        optimized: {
          features: [
            {
              name: "Continuous Retraining & CI/CD for ML (CT/CD)",
              description: "Automated continuous training pipelines triggered by model drift or new data volume",
              benefits: ["Zero-touch model updates", "Persistent high model accuracy", "Deterministic releases"],
              releaseDate: "GA"
            }
          ],
          recommendations: [
            "Implement automated continuous retraining (CT) pipelines integrated with CI/CD gates"
          ]
        },
        innovative: {
          features: [
            {
              name: "Domain-Specific Foundation Model Adaptation",
              description: "Fine-tuning (PEFT/LoRA) and continuous pre-training on proprietary enterprise corpus",
              benefits: ["Specialized domain accuracy", "Protected intellectual property", "Lower inference costs"],
              releaseDate: "GA"
            }
          ],
          recommendations: [
            "Deploy parameter-efficient fine-tuning (PEFT) for proprietary enterprise NLP tasks"
          ]
        }
      },

      generative_ai: {
        emerging: {
          features: [
            {
              name: "Enterprise AI Gateway",
              description: "Centralized gateway for model routing, token rate limiting, cost tracking, and security",
              benefits: ["Multi-model fallback", "Centralized cost attribution", "Credential protection"],
              releaseDate: "GA"
            },
            {
              name: "Governed Vector Database & Hybrid Search",
              description: "Managed vector search index synced with enterprise data lakehouse for RAG pipelines",
              benefits: ["Sub-50ms vector search", "Hybrid lexical & semantic search", "Role-based access filtering"],
              releaseDate: "GA"
            },
            {
              name: "Enterprise RAG Architecture",
              description: "End-to-end Retrieval-Augmented Generation pipeline for contextual knowledge retrieval",
              benefits: ["Grounded LLM outputs", "Zero hallucination on internal data", "Dynamic document sync"],
              releaseDate: "GA"
            }
          ],
          recommendations: [
            "Deploy an enterprise AI Gateway to manage token costs, API rate limits, and model routing",
            "Provision governed vector databases synced with curated enterprise documents for RAG",
            "Build validated RAG prototypes for internal high-impact knowledge discovery use cases"
          ]
        },
        developing: {
          features: [
            {
              name: "Automated LLM Evaluation Framework",
              description: "Automated benchmarking for hallucination rate, ground truth adherence, and latency",
              benefits: ["Objective model scoring", "Regression prevention", "Quality assurance gates"],
              releaseDate: "GA"
            },
            {
              name: "AI Safety Guardrails & PII Masking",
              description: "Real-time input and output filtering for PII redaction, prompt injection, and toxic content",
              benefits: ["Enterprise data privacy", "Prompt injection mitigation", "Brand safety enforcement"],
              releaseDate: "GA"
            }
          ],
          recommendations: [
            "Implement automated evaluation benchmarks to score LLM outputs before production release",
            "Deploy input and output safety guardrails with automatic PII masking"
          ]
        },
        maturing: {
          features: [
            {
              name: "Autonomous Multi-Agent Orchestration",
              description: "Multi-agent frameworks for complex multi-step reasoning, tool execution, and planning",
              benefits: ["Automated complex workflows", "Specialized tool use", "Human-in-the-loop oversight"],
              releaseDate: "GA"
            }
          ],
          recommendations: [
            "Deploy multi-agent orchestrators for autonomous, multi-step enterprise workflows"
          ]
        },
        optimized: {
          features: [
            {
              name: "Enterprise Parameter-Efficient Fine-Tuning (PEFT)",
              description: "Domain adaptation of open foundation models using LoRA/QLoRA on private enterprise data",
              benefits: ["Superior domain precision", "Lower inference footprint", "Complete data sovereignty"],
              releaseDate: "GA"
            }
          ],
          recommendations: [
            "Implement PEFT fine-tuning pipelines for high-value vertical specialized domains"
          ]
        },
        innovative: {
          features: [
            {
              name: "Autonomous Self-Improving AI Systems",
              description: "Continuous feedback reinforcement and automated synthetic data generation for optimization",
              benefits: ["Self-optimizing prompt strategies", "Continuous quality uplift", "Reduced manual tuning"],
              releaseDate: "GA"
            }
          ],
          recommendations: [
            "Integrate user feedback telemetry into automated fine-tuning and evaluation loops"
          ]
        }
      },

      operational_excellence: {
        emerging: {
          features: [
            {
              name: "Full-Stack Platform Telemetry & Observability",
              description: "Centralized query history, cluster utilization metrics, and user audit logs",
              benefits: ["Unified observability", "Resource right-sizing", "Instant root cause debugging"],
              releaseDate: "GA"
            },
            {
              name: "Declarative Infrastructure-as-Code (IaC)",
              description: "Automated environment and access provisioning using version-controlled templates",
              benefits: ["Repeatable environments", "Zero manual drift", "Automated CI/CD validation"],
              releaseDate: "GA"
            },
            {
              name: "Automated FinOps & Cost Allocation",
              description: "Granular cost attribution per department, budget thresholds, and auto-idle shutdown",
              benefits: ["Eliminated cloud waste", "Transparent chargeback", "Proactive budget alerting"],
              releaseDate: "GA"
            }
          ],
          recommendations: [
            "Establish centralized observability dashboards tracking cluster utilization and query latency",
            "Standardize platform provisioning using Infrastructure-as-Code (IaC) templates",
            "Implement automated FinOps policies including idle compute auto-termination"
          ]
        },
        developing: {
          features: [
            {
              name: "Continuous Integration & Deployment (CI/CD)",
              description: "Automated test runners, pull-request verification, and zero-downtime releases",
              benefits: ["Accelerated release velocity", "Higher code quality", "Automated rollback capability"],
              releaseDate: "GA"
            },
            {
              name: "Disaster Recovery & Multi-Region Replication",
              description: "Automated snapshotting, cross-region replication, and rapid failover runbooks",
              benefits: ["RPO < 15 min, RTO < 1 hour", "Business continuity", "Data loss prevention"],
              releaseDate: "GA"
            }
          ],
          recommendations: [
            "Deploy automated CI/CD deployment pipelines for all analytical data and ML code",
            "Configure cross-region data replication and test disaster recovery failover procedures"
          ]
        },
        maturing: {
          features: [
            {
              name: "Center of Excellence (CoE) & Enablement Hub",
              description: "Standardized architectural design patterns, onboarding templates, and training tracks",
              benefits: ["Democratized platform adoption", "Architecture standardization", "Faster team ramp-up"],
              releaseDate: "GA"
            }
          ],
          recommendations: [
            "Establish a Center of Excellence (CoE) with standardized reference architectures and training"
          ]
        },
        optimized: {
          features: [
            {
              name: "Autonomous Workload Right-Sizing",
              description: "AI-driven compute profiling that dynamically selects optimal cluster sizes and memory",
              benefits: ["Optimized price-performance", "Automated resource tuning", "Zero over-provisioning"],
              releaseDate: "GA"
            }
          ],
          recommendations: [
            "Enable autonomous workload profiling and right-sizing for all recurring jobs"
          ]
        },
        innovative: {
          features: [
            {
              name: "Zero-Touch Autonomous Platform Operations",
              description: "Self-healing platform operations with automated anomaly remediation and proactive scaling",
              benefits: ["99.99% platform availability", "Zero manual maintenance", "Autonomous resilience"],
              releaseDate: "GA"
            }
          ],
          recommendations: [
            "Implement self-healing automated operational runbooks for proactive issue resolution"
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
      1: "emerging",
      2: "developing",
      3: "maturing",
      4: "optimized",
      5: "innovative"
    };

    const level = maturityLevelMap[maturityLevel] || "emerging";
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
        features: nextLevel.features.slice(0, 3),
        recommendations: nextLevel.recommendations.slice(0, 3)
      } : null,
      quickWins: this.identifyQuickWins(pillarId, maturityLevel, responses),
      strategicMoves: this.identifyStrategicMoves(pillarId, maturityLevel, responses)
    };
  }

  /**
   * Identify next steps (advisory activities)
   */
  identifyQuickWins(pillarId, maturityLevel, responses) {
    const currentLevel = this.featuresByPillar[pillarId];
    if (!currentLevel) return [];

    const nextStepsByPillar = {
      platform_governance: [
        "Conduct Unified Catalog discovery workshop to assess enterprise data governance maturity",
        "Implement fine-grained access control with row/column filtering and dynamic data masking",
        "Deploy automated sensitive data classification and compliance tagging (GDPR/HIPAA/SOC2)",
        "Configure centralized audit logging, access review workflows, and FinOps budget guardrails"
      ],
      data_engineering: [
        "Design declarative data pipelines with automated data quality expectations and validation gates",
        "Implement auto-scaling streaming ingestion and automated schema evolution for object storage",
        "Standardize on open table formats (Delta/Iceberg) with automated compaction and file clustering",
        "Set up automated workflow orchestration DAGs with proactive alerting and CI/CD verification"
      ],
      analytics_bi: [
        "Provision elastic serverless vectorized SQL compute pools for sub-second query performance",
        "Deploy centralized enterprise semantic layer to standardize KPIs and business metric definitions",
        "Implement zero-copy query federation across enterprise databases and object storage",
        "Conduct executive dashboard optimization and natural-language analytical query enablement"
      ],
      machine_learning: [
        "Establish centralized Experiment Tracking and Model Registry for reproducible ML lifecycles",
        "Deploy enterprise Feature Store to eliminate feature drift between training and inference",
        "Configure auto-scaling managed model serving endpoints with zero-downtime rollouts",
        "Implement production model observability, prediction monitoring, and automated retraining triggers"
      ],
      generative_ai: [
        "Deploy governed vector databases and hybrid search for enterprise RAG architectures",
        "Establish an enterprise AI Gateway with token rate limiting, cost attribution, and security filters",
        "Implement automated evaluation benchmarks for hallucination scoring, latency, and ground truth",
        "Deploy multi-model inference endpoints with safety guardrails and automated PII redaction"
      ],
      operational_excellence: [
        "Establish Center of Excellence (CoE) operating model and data enablement paths",
        "Implement Infrastructure-as-Code (IaC) templates for automated environment provisioning",
        "Deploy full-stack platform observability, compute right-sizing, and idle resource elimination",
        "Establish disaster recovery runbooks with cross-region replication and automated snapshot testing"
      ]
    };

    const pillarSteps = nextStepsByPillar[pillarId] || [
      "Schedule architecture review session to assess current technical maturity",
      "Conduct hands-on technical workshop for core target platform capabilities",
      "Deploy targeted proof-of-concept to validate critical business use cases",
      "Book strategic architecture deep-dive with Principal Data & AI Architects"
    ];

    const numberOfSteps = maturityLevel <= 2 ? 4 : 3;
    return pillarSteps.slice(0, numberOfSteps);
  }

  /**
   * Identify strategic initiatives
   */
  identifyStrategicMoves(pillarId, maturityLevel, responses) {
    if (maturityLevel >= 5) return [];

    const nextLevelKey = { 1: "developing", 2: "maturing", 3: "optimized", 4: "innovative" }[maturityLevel];
    const nextLevel = this.featuresByPillar[pillarId]?.[nextLevelKey];

    if (!nextLevel) return [];

    return nextLevel.features.slice(0, 2).map(f => ({
      title: f.name,
      description: f.description,
      benefits: f.benefits,
      timeline: "3-6 months",
      impact: "Transformational",
      docs: null
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
        recommendations: ["Assess your current state", "Identify gaps", "Plan improvements"]
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
