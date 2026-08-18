const db = require('./connection');
const DataStore = require('../utils/dataStore');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const typesFileStore = new DataStore(path.join(__dirname, '../../data/custom_assessment_types.json'));
const instancesFileStore = new DataStore(path.join(__dirname, '../../data/dynamic_assessments.json'));

/**
 * Built-in Production Ready Starter Templates
 */
const STARTER_PRODUCTION_TEMPLATES = [
  {
    "id": "tpl_openai_to_gemini",
    "typeKey": "openai_to_gemini_enterprise_migration",
    "title": "OpenAI to Gemini Enterprise Migration Assessment",
    "subtitle": "Enterprise GenAI Architecture Modernization & Cost Arbitrage",
    "description": "Comprehensive evaluation for migrating enterprise GenAI workloads from OpenAI / Azure OpenAI to Google Gemini Enterprise on Vertex AI, covering prompt compatibility, long context, context caching, security, and agentic orchestration.",
    "icon": "HiSparkles",
    "badge": "GenAI Migration",
    "color": "#8b5cf6",
    "status": "production",
    "isPublished": true,
    "isPromoted": true,
    "createdBy": "system",
    "framework": {
      "typeKey": "openai_to_gemini_enterprise_migration",
      "title": "OpenAI to Gemini Enterprise Migration Assessment",
      "subtitle": "Enterprise GenAI Architecture Modernization & Cost Arbitrage",
      "description": "Evaluate technical feasibility, prompt migration, long-context window optimization, token cost arbitrage, VPC security, and multi-agent mesh for Google Gemini Enterprise.",
      "icon": "HiSparkles",
      "badge": "GenAI Migration",
      "color": "#8b5cf6",
      "targetRole": "Chief AI Officers, Lead GenAI Engineers, Cloud Architects",
      "estimatedMinutes": 15,
      "dimensions": [
        {
          "id": "prompt_api_translation",
          "name": "Prompt & API Architecture Parity",
          "description": "Evaluates compatibility of prompt engineering, system instructions, function calling, and structured JSON outputs.",
          "weight": 1,
          "questions": [
            {
              "id": "api_01",
              "text": "How are prompt templates, system instructions, and JSON schemas structured across your GenAI applications?",
              "guidance": "Assess dependency on OpenAI-specific SDK conventions vs standard OpenAPI schemas and Google GenAI SDK.",
              "options": [
                {
                  "value": 1,
                  "score": 1,
                  "label": "Tightly coupled hardcoded OpenAI SDK calls with proprietary prompt formats and non-standard JSON parsing."
                },
                {
                  "value": 2,
                  "score": 2,
                  "label": "Partial abstraction via LangChain or custom wrappers, but heavy reliance on OpenAI-specific response structures."
                },
                {
                  "value": 3,
                  "score": 3,
                  "label": "Decoupled prompt management with standard OpenAPI JSON Schema validations and parameterized prompts."
                },
                {
                  "value": 4,
                  "score": 4,
                  "label": "Standardized model gateway with automated prompt translation, schema validation, and multi-model routing."
                },
                {
                  "value": 5,
                  "score": 5,
                  "label": "Fully autonomous GenAI platform with automated regression prompt testing, dynamic schema enforcement, and zero vendor lock-in."
                }
              ],
              "technicalPainPoints": [
                "Vendor-specific function calling syntax causing codebase refactoring friction",
                "Hardcoded OpenAI response object parsing across microservices",
                "Lack of automated regression tests for prompt migration",
                "Proprietary tool_choice schema bindings preventing multi-model routing",
                "Inconsistent token counting and non-standard JSON schema parsing"
              ],
              "businessPainPoints": [
                "Inability to negotiate competitive multi-cloud LLM pricing",
                "Risk of vendor lock-in slowing down modernization initiatives",
                "Prolonged release cycles when upgrading model versions",
                "Uncontrolled operational dependencies on single-vendor cloud outages",
                "High developer onboarding overhead navigating proprietary SDK wrappers"
              ]
            },
            {
              "id": "api_02",
              "text": "How are tool definitions, structured function calling, and schema validations handled across microservices?",
              "guidance": "Review how tool schemas are serialized, invoked, and error-handled across backend LLM agents.",
              "options": [
                {
                  "value": 1,
                  "score": 1,
                  "label": "Manual string prompt parsing for tools without formal JSON schema declarations."
                },
                {
                  "value": 2,
                  "score": 2,
                  "label": "OpenAI-specific tool_choice parameters tightly bound to single endpoints."
                },
                {
                  "value": 3,
                  "score": 3,
                  "label": "Standardized JSON Schema tool definitions decoupled from underlying SDKs."
                },
                {
                  "value": 4,
                  "score": 4,
                  "label": "Centralized Model Context Protocol (MCP) server registry with automatic schema validation."
                },
                {
                  "value": 5,
                  "score": 5,
                  "label": "Dynamic zero-trust tool orchestration with automatic schema migration, sandboxing, and execution telemetry."
                }
              ],
              "technicalPainPoints": [
                "Tool schema drift breaking downstream application parsing",
                "Complex parameter transformations between OpenAI and Google GenAI function calling specs",
                "Lack of structured audit logging and distributed tracing for tool invocations",
                "Missing sandboxed runtime execution for agentic code interpreters and bash tools",
                "Brittle JSON Schema type coercion causing recurring hallucinated tool arguments"
              ],
              "businessPainPoints": [
                "Production outages caused by unexpected tool payload format mismatches",
                "Slow developer velocity when attempting to build multi-agent enterprise capabilities",
                "Severe security vulnerabilities from unvalidated function execution",
                "Reputational risk from customer-facing tool failure loops during live workflows",
                "High maintenance overhead managing divergent tool wrappers across separate cloud stacks"
              ]
            }
          ]
        },
        {
          "id": "long_context_rag",
          "name": "Long-Context Windows vs Chunked RAG",
          "description": "Evaluates strategy for leveraging ultra-long context windows (1M–2M tokens) vs legacy chunked vector retrieval.",
          "weight": 1,
          "questions": [
            {
              "id": "ctx_01",
              "text": "What is your current strategy for leveraging ultra-long context windows (1M–2M tokens) vs legacy chunked RAG?",
              "guidance": "Evaluate whether complex vector chunking and brittle embedding retrieval can be simplified using Gemini native long-context.",
              "options": [
                {
                  "value": 1,
                  "score": 1,
                  "label": "Strict 8k-32k token limits forcing complex document chunking, metadata filters, and frequent retrieval failures."
                },
                {
                  "value": 2,
                  "score": 2,
                  "label": "Traditional vector DB retrieval with hybrid search, but significant maintenance overhead and context loss."
                },
                {
                  "value": 3,
                  "score": 3,
                  "label": "Hybrid approach using vector retrieval for large corpora and long-context windows for multi-document synthesis."
                },
                {
                  "value": 4,
                  "score": 4,
                  "label": "Extensive use of 1M+ token context windows with native Prompt Caching, reducing vector database complexity."
                },
                {
                  "value": 5,
                  "score": 5,
                  "label": "Full enterprise multimodal long-context pipeline with automated Context Caching, near-zero retrieval loss, and 80% cost savings."
                }
              ],
              "technicalPainPoints": [
                "Strict 8k-32k token limits forcing complex document chunking, metadata filters, and retrieval failures",
                "High latency and embedding compute cost for multi-step semantic vector search",
                "Loss of cross-document semantic context and reasoning across large PDFs and codebases",
                "Embedding index drift requiring costly vector re-indexing after every knowledge base update",
                "Fragmented chunk stitching leading to hallucinations and inaccurate answer synthesis"
              ],
              "businessPainPoints": [
                "Inability to analyze complete complex enterprise documents, contracts, and codebases in a single query",
                "High infrastructure maintenance costs for dedicated vector databases and vector indexing pipelines",
                "Sub-optimal GenAI response accuracy damaging user trust in mission-critical applications",
                "Delayed product launches due to complex custom RAG tuning and reranker pipeline maintenance",
                "Executive frustration with answers missing critical clauses scattered across large multi-page filings"
              ]
            },
            {
              "id": "ctx_02",
              "text": "How does your architecture handle multi-document synthesis, cross-referencing, and long-form audit trails?",
              "guidance": "Assess multi-document reasoning over entire codebases, technical manuals, or financial portfolios.",
              "options": [
                {
                  "value": 1,
                  "score": 1,
                  "label": "Single-document analysis only; cannot synthesize relationships across multiple source files."
                },
                {
                  "value": 2,
                  "score": 2,
                  "label": "Ad-hoc Map-Reduce summarization chains with high latency and context degradation."
                },
                {
                  "value": 3,
                  "score": 3,
                  "label": "Long-context document ingestion up to 128k tokens with basic citation tracking."
                },
                {
                  "value": 4,
                  "score": 4,
                  "label": "Full multi-file workspace ingestion into 1M token windows with exact line-level citation."
                },
                {
                  "value": 5,
                  "score": 5,
                  "label": "Real-time multi-modal synthesis (text, audio, video, diagrams) across millions of tokens with verified grounding."
                }
              ],
              "technicalPainPoints": [
                "Inability to process multimodal inputs (PDFs, audio, video, spreadsheets) natively in a single prompt",
                "Complex brittle preprocessing pipelines extracting text from images and documents before LLM ingestion",
                "Lack of native token-level grounding and multi-page visual layout understanding",
                "High error rate from intermediate OCR parsers dropping tables, charts, and diagrams",
                "Massive pipeline latency accumulated through multi-stage media extraction microservices"
              ],
              "businessPainPoints": [
                "Missed business value from unexploited rich enterprise assets (customer call recordings, video meetings, scanned PDFs)",
                "High operational costs maintaining separate OCR, audio transcription, and computer vision services",
                "Delayed decision-making in workflows requiring cross-modal analysis (financial audits, claims review)",
                "Customer churn caused by inability to support modern rich multimodal customer support interactions",
                "High vendor subscription sprawl across distinct specialized AI parsing vendors"
              ]
            }
          ]
        },
        {
          "id": "token_economics_caching",
          "name": "Token Economics & Cost Optimization",
          "description": "Assesses cost-per-query, Prompt Caching potential, batch inference, and rate limit quotas.",
          "weight": 1,
          "questions": [
            {
              "id": "cost_01",
              "text": "How actively does your team optimize GenAI token expenditures and leverage prompt caching or batch APIs?",
              "guidance": "Gemini offers native Context Caching with up to 75% cost reduction on cached input tokens.",
              "options": [
                {
                  "value": 1,
                  "score": 1,
                  "label": "Zero caching or rate tracking; full price paid on every prompt token with frequent unpredicted bill spikes."
                },
                {
                  "value": 2,
                  "score": 2,
                  "label": "Manual token usage monitoring with static monthly budgets, but no automated caching or batch pipelines."
                },
                {
                  "value": 3,
                  "score": 3,
                  "label": "Application-level caching for exact queries and basic non-real-time batch processing."
                },
                {
                  "value": 4,
                  "score": 4,
                  "label": "Automated Context Caching enabled for static system prompts and large document repositories with unit cost tracking."
                },
                {
                  "value": 5,
                  "score": 5,
                  "label": "Predictive token routing, dynamic caching across enterprise workloads, automated model tiering, and 70%+ TCO reduction."
                }
              ],
              "technicalPainPoints": [
                "Reprocessing repetitive long system prompts, documentation, and schemas on every single API request",
                "Lack of context caching mechanism leading to linear token cost growth as context size increases",
                "Sub-second latency requirements impossible to meet due to cold prompt parsing on every call",
                "Absence of automated token usage attribution by microservice, team, or business unit",
                "Excessive network bandwidth consumed re-transmitting static few-shot examples across clouds"
              ],
              "businessPainPoints": [
                "Unsustainable monthly GenAI API bills limiting the scaling of enterprise AI initiatives",
                "Poor user experience due to high Time-To-First-Token (TTFT) latency in interactive chat apps",
                "Lack of ROI transparency making executive budget approvals difficult for new GenAI rollouts",
                "Unpredictable billing surges during peak operational traffic without cached token discounts",
                "Inability to offer competitive pricing in customer-facing SaaS products powered by GenAI"
              ]
            },
            {
              "id": "cost_02",
              "text": "What is your model routing strategy across high-performance (Pro/Flash) and cost-optimized tiers?",
              "guidance": "Review automated routing between lightweight models (Gemini Flash) for classification and reasoning models (Gemini Pro) for complex analysis.",
              "options": [
                {
                  "value": 1,
                  "score": 1,
                  "label": "Single expensive flagship model used for all tasks, including trivial classification and extraction."
                },
                {
                  "value": 2,
                  "score": 2,
                  "label": "Manual developer selection of model tier per microservice without centralized cost governance."
                },
                {
                  "value": 3,
                  "score": 3,
                  "label": "Rule-based gateway routing simple queries to lightweight models and complex tasks to flagship models."
                },
                {
                  "value": 4,
                  "score": 4,
                  "label": "Dynamic LLM cascade/router that dynamically elevates queries only upon confidence thresholds."
                },
                {
                  "value": 5,
                  "score": 5,
                  "label": "Autonomous semantic router with real-time latency/cost optimization, batch processing offloading, and automated distillation."
                }
              ],
              "technicalPainPoints": [
                "Routing all queries (simple classification to complex reasoning) to high-cost frontier models",
                "Absence of automated semantic query classification and dynamic model cascading routing",
                "Lack of real-time latency and cost telemetry per inference call",
                "Static configuration files hardcoding expensive model IDs across application codebases",
                "Missing automated fallback logic when rate limits or quotas are hit on premium model endpoints"
              ],
              "businessPainPoints": [
                "Wasted annual cloud AI budget on over-provisioned LLM intelligence for simple tasks",
                "Inability to maintain healthy unit economics as active user count grows exponentially",
                "Financial risk of quota exhaustion causing service degradation for premium enterprise customers",
                "Lack of agility in leveraging lower-cost lightweight models (e.g. Gemini 2.0 Flash) as they launch",
                "Erosion of product profit margins due to unoptimized inference cost per user session"
              ]
            }
          ]
        },
        {
          "id": "security_governance_privacy",
          "name": "Enterprise Security, CMEK & Data Governance",
          "description": "Evaluates private networking (PSC), Customer-Managed Encryption Keys (CMEK), VPC controls, and zero training guarantees.",
          "weight": 1,
          "questions": [
            {
              "id": "sec_01",
              "text": "How are sensitive corporate data and customer prompts secured and isolated during model inference?",
              "guidance": "Review VPC Service Controls, Private Service Connect, CMEK encryption, and zero customer data retention.",
              "options": [
                {
                  "value": 1,
                  "score": 1,
                  "label": "Prompts sent over public internet endpoints with standard multi-tenant defaults and no custom encryption keys."
                },
                {
                  "value": 2,
                  "score": 2,
                  "label": "Basic TLS encryption and standard enterprise agreements, but without private networking or dedicated VPC perimeter."
                },
                {
                  "value": 3,
                  "score": 3,
                  "label": "Private endpoints configured with strict enterprise data protection agreements prohibiting model retraining."
                },
                {
                  "value": 4,
                  "score": 4,
                  "label": "Fully enclosed VPC Service Controls with Private Service Connect (PSC), audit logging, and automated PII redaction."
                },
                {
                  "value": 5,
                  "score": 5,
                  "label": "Zero-trust GenAI architecture with Customer-Managed Encryption Keys (CMEK), real-time safety guardrails, and compliance automation."
                }
              ],
              "technicalPainPoints": [
                "Model traffic egressing over public internet endpoints without VPC Service Controls perimeter defense",
                "Direct API key distribution to developers leading to accidental repository leaks",
                "Missing audit logging and forensic retention for enterprise compliance inspection",
                "Lack of private endpoint peering and surrogate IP whitelisting for backend inference calls",
                "Absence of automated certificate rotation and secrets manager integration for LLM credentials"
              ],
              "businessPainPoints": [
                "Severe regulatory non-compliance penalties under EU AI Act, HIPAA, GDPR, and PCI-DSS",
                "Critical risk of proprietary intellectual property and customer data leakage to public model providers",
                "Delayed enterprise security sign-offs stalling production deployment of generative AI tools",
                "Potential loss of enterprise customer contracts due to third-party data privacy audit failures",
                "Massive financial liability and brand reputation damage from credential leak security breaches"
              ]
            },
            {
              "id": "sec_02",
              "text": "How are prompt injection attacks, sensitive PII leakage, and AI safety guardrails enforced in real time?",
              "guidance": "Assess real-time input/output content filtering, toxicity checks, automated PII scrubbing, and red-teaming protocols.",
              "options": [
                {
                  "value": 1,
                  "score": 1,
                  "label": "No automated safety filtering; reliance on default model behaviors with zero prompt injection defense."
                },
                {
                  "value": 2,
                  "score": 2,
                  "label": "Basic regex-based PII scrubbing before sending prompts to external APIs."
                },
                {
                  "value": 3,
                  "score": 3,
                  "label": "Configurable cloud provider safety filters enabled for toxicity, harassment, and harmful categories."
                },
                {
                  "value": 4,
                  "score": 4,
                  "label": "Comprehensive bidirectional guardrail layer detecting prompt jailbreaks, hallucination drift, and PII masking."
                },
                {
                  "value": 5,
                  "score": 5,
                  "label": "Adaptive Zero-Trust AI firewall with automated red-teaming evals, cryptographic audit trails, and instant policy enforcement."
                }
              ],
              "technicalPainPoints": [
                "Lack of real-time prompt injection, jailbreak, and jailbreak-augmented retrieval detection",
                "No automated PII/PHI de-identification or masking before prompt transmission to model endpoints",
                "Missing content safety filtering and brand reputational guardrails on model outputs",
                "Absence of surrogate tokenization for sensitive entity names and account identifiers",
                "Zero real-time model output sandboxing against destructive SQL injection and executable scripts"
              ],
              "businessPainPoints": [
                "Brand damage and PR disasters from model jailbreaks generating offensive or misleading content",
                "Legal exposure from unintentional exposure of protected customer health or financial records in prompts",
                "Loss of customer trust after high-profile AI hallucination incidents impacting financial advice",
                "Internal executive friction blocking adoption of customer-facing conversational assistants",
                "Litigation risk from copyrighted material generation or unauthorized sensitive data disclosure"
              ]
            }
          ]
        },
        {
          "id": "agentic_tool_mesh",
          "name": "Multi-Agent Mesh & Autonomous Tooling",
          "description": "Evaluates multi-agent orchestration, asynchronous task delegation, Model Context Protocol (MCP), and multimodal ingestion.",
          "weight": 1,
          "questions": [
            {
              "id": "agent_01",
              "text": "How does your platform orchestrate autonomous multi-agent workflows and asynchronous task delegation?",
              "guidance": "Review agent frameworks, state management, supervisor-worker hierarchies, and Model Context Protocol (MCP) integrations.",
              "options": [
                {
                  "value": 1,
                  "score": 1,
                  "label": "Single synchronous prompt-response chains with no agentic delegation or persistent memory."
                },
                {
                  "value": 2,
                  "score": 2,
                  "label": "Linear chain-of-thought scripts with rigid hardcoded step transitions and high failure rates."
                },
                {
                  "value": 3,
                  "score": 3,
                  "label": "Modular agent graph framework with retry mechanics, state persistence, and human-in-the-loop approvals."
                },
                {
                  "value": 4,
                  "score": 4,
                  "label": "Distributed multi-agent mesh with specialized supervisor agents, dynamic tool selection, and asynchronous execution."
                },
                {
                  "value": 5,
                  "score": 5,
                  "label": "Autonomous self-healing multi-agent ecosystem with Model Context Protocol (MCP), continuous evaluation, and real-time telemetry."
                }
              ],
              "technicalPainPoints": [
                "Brittle custom python agent scripts using proprietary loops and fragile state dictionaries",
                "Lack of standardized Model Context Protocol (MCP) server integration for tool abstraction",
                "Missing durable execution, human-in-the-loop approval pause states, and state recovery on crash",
                "Zero distributed tracing across multi-agent handoffs making agent deadlocks impossible to debug",
                "High latency loops between agents without centralized task scheduling and rate limiting"
              ],
              "businessPainPoints": [
                "High engineering cost building and maintaining custom agent frameworks in-house",
                "Inability to reliably execute complex multi-step business workflows without manual intervention",
                "Slow time-to-market for autonomous enterprise agent capabilities compared to agile competitors",
                "Risk of rogue agents executing unintended destructive database actions without human sign-off",
                "Executive skepticism regarding the production readiness and ROI of autonomous agent systems"
              ]
            },
            {
              "id": "agent_02",
              "text": "What is your capability to process and ground multi-modal inputs (PDF diagrams, audio recordings, video feeds, spreadsheets)?",
              "guidance": "Evaluate native multimodal reasoning vs separate OCR/speech-to-text conversion pipelines.",
              "options": [
                {
                  "value": 1,
                  "score": 1,
                  "label": "Text-only processing; separate external OCR and transcription tools required with significant data loss."
                },
                {
                  "value": 2,
                  "score": 2,
                  "label": "Basic OCR for scanned PDFs, but inability to reason over complex tables, charts, or audio/video streams."
                },
                {
                  "value": 3,
                  "score": 3,
                  "label": "Hybrid pipeline supporting images and formatted PDFs alongside textual RAG."
                },
                {
                  "value": 4,
                  "score": 4,
                  "label": "Native multimodal ingestion across high-resolution PDFs, audio, video, and code repositories in a single model pass."
                },
                {
                  "value": 5,
                  "score": 5,
                  "label": "Unified enterprise multimodal intelligence engine with sub-second cross-modal search, grounding, and reasoning."
                }
              ],
              "technicalPainPoints": [
                "Absence of automated LLM-as-a-judge evaluation pipelines for prompt regressions across model updates",
                "No standardized ground truth benchmark datasets to validate model accuracy before deployment",
                "Manual subjective testing of prompts by engineers before production deployment",
                "Lack of CI/CD integration for automated prompt scoring, safety evaluation, and latency benchmarking",
                "Missing observability dashboards tracking model accuracy drift and user feedback in production"
              ],
              "businessPainPoints": [
                "Silent quality regressions in customer-facing AI features after model or prompt adjustments",
                "High developer time spent on manual prompt testing rather than feature development",
                "Inability to prove measurable model accuracy improvements to executive stakeholders",
                "Delayed incident response when model output quality degrades in live production environments",
                "Loss of competitive edge due to slow, risk-averse iteration cycles on generative AI capabilities"
              ]
            }
          ]
        }
      ],
      "maturityLevels": [
        {
          "level": 1,
          "name": "Ad-hoc",
          "label": "Initial / Ad-hoc",
          "scoreMin": 1,
          "scoreMax": 1.9,
          "color": "#ef4444",
          "description": "Hardcoded proprietary LLM calls, high token spend, zero caching, and brittle RAG architectures."
        },
        {
          "level": 2,
          "name": "Developing",
          "label": "Developing / Emerging",
          "scoreMin": 2,
          "scoreMax": 2.9,
          "color": "#f59e0b",
          "description": "Early multi-model awareness, basic wrappers, partial caching experimentation, and standard security agreements."
        },
        {
          "level": 3,
          "name": "Standardized",
          "label": "Defined / Standardized",
          "scoreMin": 3,
          "scoreMax": 3.7,
          "color": "#3b82f6",
          "description": "Decoupled prompt engineering, OpenAPI schema standards, private endpoint routing, and structured cost tracking."
        },
        {
          "level": 4,
          "name": "Optimized",
          "label": "Managed / Automated",
          "scoreMin": 3.8,
          "scoreMax": 4.5,
          "color": "#10b981",
          "description": "Ultra-long context windows, automated Context Caching, VPC Service Controls, and robust multi-model governance."
        },
        {
          "level": 5,
          "name": "Transformative",
          "label": "Optimizing / Transformative",
          "scoreMin": 4.6,
          "scoreMax": 5,
          "color": "#8b5cf6",
          "description": "Industry-leading GenAI platform on Gemini Enterprise with autonomous agentic routing, 75% cost reduction, and zero lock-in."
        }
      ]
    }
  },
  {
    "id": "tpl_finops_cost",
    "typeKey": "finops_cloud_cost_optimization",
    "title": "FinOps & Cloud Cost Optimization Assessment",
    "subtitle": "Enterprise Cloud Financial Management & Unit Economics Framework",
    "description": "Evaluate your organization's capability to understand, optimize, and govern cloud and AI spend while driving maximum business value, unit margin accountability, and automated FinOps execution.",
    "icon": "FiTrendingUp",
    "badge": "FinOps",
    "color": "#10b981",
    "status": "production",
    "isPublished": true,
    "isPromoted": true,
    "createdBy": "system",
    "framework": {
      "typeKey": "finops_cloud_cost_optimization",
      "title": "FinOps & Cloud Cost Optimization Assessment",
      "subtitle": "Enterprise Cloud Financial Management & Unit Economics Framework",
      "description": "Comprehensive 5-dimension FinOps framework covering visibility & tagging, anomaly detection, commitment economics, storage lifecycle, and unit economics.",
      "icon": "FiTrendingUp",
      "badge": "FinOps",
      "color": "#10b981",
      "targetRole": "FinOps Practitioners, Cloud Architects, Engineering Leadership, Finance Directors",
      "estimatedMinutes": 15,
      "dimensions": [
        {
          "id": "cost_visibility",
          "name": "Cost Visibility & Allocation Taxonomy",
          "description": "Mechanisms for tracking, tagging, and allocating cloud expenditure to business units, product squads, and Kubernetes containers.",
          "weight": 1,
          "questions": [
            {
              "id": "cva_01",
              "text": "How granular and automated is your organization's cloud resource tagging and cost allocation strategy?",
              "guidance": "Evaluate tagging policy enforcement, container/Kubernetes-level cost allocation, and showback accuracy.",
              "options": [
                {
                  "value": 1,
                  "score": 1,
                  "label": "Unallocated lump-sum invoices with minimal or no resource tagging (<20% coverage)."
                },
                {
                  "value": 2,
                  "score": 2,
                  "label": "Basic account/subscription-level allocation with partial tagging (20-50%) and manual spreadsheets."
                },
                {
                  "value": 3,
                  "score": 3,
                  "label": "Standardized tagging taxonomy enforced across core services (>75% coverage) with monthly showback."
                },
                {
                  "value": 4,
                  "score": 4,
                  "label": "Automated policy enforcement for tagging (>90% coverage) with direct container cost allocation and showback."
                },
                {
                  "value": 5,
                  "score": 5,
                  "label": "Real-time, fully automated cost allocation (>98% coverage) with proportional shared-cost distribution and unit economics."
                }
              ],
              "technicalPainPoints": [
                "Untagged cloud resources and missing billing labels preventing microservice cost allocation",
                "Disparate billing export formats across multi-cloud accounts and billing accounts",
                "Lack of FOCUS 1.0 open standard billing schema normalization in BigQuery",
                "Inconsistent shared-cost distribution algorithms for multi-tenant GKE and Dataproc clusters",
                "Delayed billing ingestion cycles creating a 48-hour visibility blind spot for engineering teams"
              ],
              "businessPainPoints": [
                "Unallocated cloud spend leading to cross-departmental budget disputes and friction",
                "Inability to calculate accurate unit cost economics per transaction or active customer",
                "Quarterly budget overruns due to delayed visibility into cloud infrastructure cost spikes",
                "Lack of engineering accountability for cloud infrastructure expenditure",
                "Difficulty demonstrating cloud ROI and financial efficiency to the Board of Directors"
              ]
            },
            {
              "id": "cva_02",
              "text": "How automated is your multi-cloud billing data ingestion and monthly showback/chargeback reporting cadence?",
              "guidance": "Review daily billing data exports (FOCUS spec / BigQuery / CUR), automated normalization, and self-service showback portals.",
              "options": [
                {
                  "value": 1,
                  "score": 1,
                  "label": "Manual spreadsheet downloads once a month with no centralized reporting or squad visibility."
                },
                {
                  "value": 2,
                  "score": 2,
                  "label": "Static cloud console cost dashboards reviewed ad-hoc by finance with 15-day reporting lag."
                },
                {
                  "value": 3,
                  "score": 3,
                  "label": "Automated daily billing ingestion into a central warehouse with monthly departmental showback reports."
                },
                {
                  "value": 4,
                  "score": 4,
                  "label": "Automated daily showback dashboard mapped to engineering squads with FOCUS 1.0 schema normalization."
                },
                {
                  "value": 5,
                  "score": 5,
                  "label": "Real-time automated chargeback with direct budget accountability, self-service cost exploration, and executive KPI attribution."
                }
              ],
              "technicalPainPoints": [
                "Siloed cost dashboards disconnected from developer IDEs, CI/CD, and Jira ticketing systems",
                "Manual spreadsheet exports required for monthly cloud financial reconciliation",
                "Lack of real-time spend alert thresholds configured at project, folder, and team levels",
                "Inability to correlate application telemetry (APM) with billing metrics",
                "Absence of automated cost attribution for serverless queries and BigQuery on-demand usage"
              ],
              "businessPainPoints": [
                "Finance and engineering teams operating with divergent data and conflicting priorities",
                "Delayed action on cloud waste due to quarterly rather than real-time review cycles",
                "Surprise cloud bills at month-end creating executive panic and reactive budget cuts",
                "Inability to forecast cloud capacity and annual expenditure accurately",
                "Inefficient resource allocation starving strategic innovation projects of capital"
              ]
            }
          ]
        },
        {
          "id": "anomaly_rightsizing",
          "name": "Anomaly Detection & Continuous Rightsizing",
          "description": "Capabilities to detect runaway spend spikes and continuously optimize compute, storage, and database tiers.",
          "weight": 1,
          "questions": [
            {
              "id": "anom_01",
              "text": "How rapidly does your organization detect and remediate abnormal cloud cost spikes or unutilized resources?",
              "guidance": "Review automated ML anomaly detection alerts and automated decommissioning of orphaned disks/instances.",
              "options": [
                {
                  "value": 1,
                  "score": 1,
                  "label": "Cost spikes are discovered only when the invoice arrives 15-30 days after month-end."
                },
                {
                  "value": 2,
                  "score": 2,
                  "label": "Monthly manual budget reviews with static cloud provider email threshold alerts."
                },
                {
                  "value": 3,
                  "score": 3,
                  "label": "Automated daily anomaly detection alerts routed to team communication channels (Slack/Teams)."
                },
                {
                  "value": 4,
                  "score": 4,
                  "label": "Near-real-time ML anomaly detection with automated root-cause attribution within hours."
                },
                {
                  "value": 5,
                  "score": 5,
                  "label": "Real-time telemetry-driven anomaly detection coupled with automated circuit breakers that throttle runaway jobs."
                }
              ],
              "technicalPainPoints": [
                "Static threshold alerting generating high false-alarm noise or missing subtle cost creep",
                "Lack of ML-driven anomaly detection models analyzing historical seasonal usage patterns",
                "Absence of automated root-cause analysis linking billing surges to specific commit hashes or IAM users",
                "Missing automated circuit breakers or budget capping mechanisms on runaway cloud queries",
                "Delayed notification delivery routing cost spikes to inactive Slack channels or email distribution lists"
              ],
              "businessPainPoints": [
                "Runaway cloud costs from runaway scripts or misconfigured autoscaling draining operating margins",
                "Alert fatigue causing engineering teams to ignore legitimate financial anomaly warnings",
                "Reputational damage and executive escalation following major cloud billing shock incidents",
                "Unplanned budget reallocations disrupting product roadmaps and strategic hiring",
                "Financial write-downs due to unrecoverable infrastructure waste"
              ]
            },
            {
              "id": "anom_02",
              "text": "How automated is the identification and rightsizing of over-provisioned VMs, idle clusters, and orphaned storage?",
              "guidance": "Assess 15-min auto-suspend cluster policies, automated disk cleanup, and serverless compute adoption.",
              "options": [
                {
                  "value": 1,
                  "score": 1,
                  "label": "Static infrastructure with no rightsizing; clusters run 24/7 regardless of actual utilization."
                },
                {
                  "value": 2,
                  "score": 2,
                  "label": "Periodic manual rightsizing reviews during annual budgeting cycles."
                },
                {
                  "value": 3,
                  "score": 3,
                  "label": "Automated recommendations generated by cloud tools with manual engineering sprint execution."
                },
                {
                  "value": 4,
                  "score": 4,
                  "label": "Automated idle resource termination (e.g. 15-min auto-suspend) and weekly rightsizing automation."
                },
                {
                  "value": 5,
                  "score": 5,
                  "label": "Fully autonomous rightsizing with continuous serverless scaling, spot/preemptible arbitrage, and zero idle waste."
                }
              ],
              "technicalPainPoints": [
                "Manual incident triage processes for cloud cost anomalies taking days to resolve",
                "Lack of automated playbooks (e.g. terminating orphaned disks, scaling down idle clusters)",
                "Absence of historical post-mortem tracking for cost incidents across cloud environments",
                "No programmatic integration with PagerDuty or ServiceNow for high-severity cost events",
                "Missing automated rollback triggers when new deployments cause unexpected resource consumption"
              ],
              "businessPainPoints": [
                "Extended Mean-Time-To-Resolution (MTTR) for cost incidents multiplying financial losses",
                "Recurring cost leaks due to failure to institutionalize preventive guardrails after incidents",
                "Engineering distraction from core revenue-generating features to fight cost fires",
                "Vendor invoice disputes and protracted billing negotiations with cloud providers",
                "Erosion of confidence in engineering leadership cloud governance capabilities"
              ]
            }
          ]
        },
        {
          "id": "rate_optimization_commitments",
          "name": "Commitment Economics & Rate Optimization",
          "description": "Strategy for maximizing discount coverage through Reserved Instances (RIs), Savings Plans, Committed Use Discounts (CUDs), and DBU commitments.",
          "weight": 1,
          "questions": [
            {
              "id": "rate_01",
              "text": "What is your organization's coverage and utilization rate for commitment-based discounts (Savings Plans / RIs / CUDs)?",
              "guidance": "Evaluate baseline compute coverage (>75%), flexible multi-year discount strategies, and expiration tracking.",
              "options": [
                {
                  "value": 1,
                  "score": 1,
                  "label": "100% on-demand pricing with zero commitment discounts or reserved instances."
                },
                {
                  "value": 2,
                  "score": 2,
                  "label": "Ad-hoc 1-year RI purchases for specific legacy servers (<40% baseline coverage)."
                },
                {
                  "value": 3,
                  "score": 3,
                  "label": "Centralized commitment strategy achieving 60-75% compute coverage with quarterly reviews."
                },
                {
                  "value": 4,
                  "score": 4,
                  "label": "Portfolio of compute savings plans and flexible CUDs maintaining 75-90% coverage with automated utilization monitoring."
                },
                {
                  "value": 5,
                  "score": 5,
                  "label": "Dynamic algorithmic commitment portfolio management with automated secondary marketplace arbitrage (>92% coverage)."
                }
              ],
              "technicalPainPoints": [
                "Fragmented commitment management across disjointed teams, projects, and cloud accounts",
                "Under-utilization of Committed Use Discounts (CUDs) and BigQuery Editions slot commitments",
                "Lack of automated coverage modeling to balance 1-year and 3-year commitment flexibility",
                "Manual tracking of CUD expiration dates leading to sudden uncommitted on-demand rate shocks",
                "Absence of automated commitment exchange and flex-slot optimization algorithms"
              ],
              "businessPainPoints": [
                "Paying premium on-demand rates for steady-state enterprise workloads (20-40% cost penalty)",
                "Financial risk of committing to rigid long-term contracts for deprecated architectural components",
                "Difficulty forecasting multi-year cloud capital expenditure and margin contributions",
                "Missed volume discount tiering due to decentralized enterprise procurement",
                "Sub-optimal cash flow management from rigid, upfront commitment structures"
              ]
            },
            {
              "id": "rate_02",
              "text": "How are SaaS and specialized data platform commitments (Databricks DBUs, Snowflake Credits, Vertex AI quotas) managed?",
              "guidance": "Assess multi-year pre-commit discounts, consumption draw-down forecasting, and burst rate controls.",
              "options": [
                {
                  "value": 1,
                  "score": 1,
                  "label": "Month-to-month list price billing with no enterprise discount schedule or consumption tracking."
                },
                {
                  "value": 2,
                  "score": 2,
                  "label": "Basic annual contract with manual draw-down monitoring by procurement."
                },
                {
                  "value": 3,
                  "score": 3,
                  "label": "Centralized contract management with monthly consumption burn-rate forecasting against commits."
                },
                {
                  "value": 4,
                  "score": 4,
                  "label": "Tiered enterprise commitment optimization with predictive draw-down alerts and multi-workload allocation."
                },
                {
                  "value": 5,
                  "score": 5,
                  "label": "Fully integrated consumption governance with real-time rate arbitrage, predictive contract re-negotiation, and 40%+ discount realization."
                }
              ],
              "technicalPainPoints": [
                "Static slot allocation models causing throttled query performance during peak business hours",
                "Lack of dynamic autoscaling slot policies for BigQuery Enterprise and Enterprise Plus editions",
                "Inability to route interactive BI workloads and batch ELT transformations to distinct reservation pools",
                "Absence of automated slot utilization telemetry and idle capacity reclamation",
                "Inefficient baseline reservation provisioning resulting in overpaying during off-peak weekend hours"
              ],
              "businessPainPoints": [
                "Degraded dashboard and report performance impacting executive and customer decision-making",
                "Inflated data warehouse spend without commensurate analytical performance gains",
                "Inability to meet strict regulatory reporting SLAs due to compute resource contention",
                "Frustration among business analysts and data scientists facing long query queue times",
                "Inability to scale data platform consumption predictably without exponential cost growth"
              ]
            }
          ]
        },
        {
          "id": "storage_lakehouse_lifecycle",
          "name": "Storage Lifecycle & Data Lakehouse Tiering",
          "description": "Techniques for managing data storage growth, table vacuuming, partition pruning, and automated cold storage tiering.",
          "weight": 1,
          "questions": [
            {
              "id": "stor_01",
              "text": "How automated is your object storage lifecycle policy (GCS / S3 / ADLS) and cold storage tiering strategy?",
              "guidance": "Review automated transitions to Nearline/Coldline/Glacier, non-current version deletion, and incomplete multipart upload cleanup.",
              "options": [
                {
                  "value": 1,
                  "score": 1,
                  "label": "All data retained indefinitely in standard hot storage with zero lifecycle policies or deletion rules."
                },
                {
                  "value": 2,
                  "score": 2,
                  "label": "Basic manual archiving of legacy project folders once every few years."
                },
                {
                  "value": 3,
                  "score": 3,
                  "label": "Standardized lifecycle policies moving data to cooler tiers after 90–180 days across major buckets."
                },
                {
                  "value": 4,
                  "score": 4,
                  "label": "Automated policy-driven tiering (Hot -> Cool -> Archive) with automated cleanup of incomplete uploads and old versions."
                },
                {
                  "value": 5,
                  "score": 5,
                  "label": "Intelligent access-tiering with zero-copy analytics, automated retention compliance enforcement, and 70% storage TCO reduction."
                }
              ],
              "technicalPainPoints": [
                "Millions of uncompressed, un-partitioned data files accumulating in Cloud Storage and BigLake",
                "Absence of automated Object Lifecycle Management (OLM) rules tiering data to Coldline/Archive",
                "Lack of automatic partition expiration and table compaction on analytical lakehouse tables",
                "Orphaned staging tables, temporary datasets, and dangling compute disks persisting indefinitely",
                "Missing automated metadata scanning to identify redundant, obsolete, or trivial (ROT) datasets"
              ],
              "businessPainPoints": [
                "Skyrocketing monthly storage bills growing exponentially faster than business revenue",
                "Increased attack surface and compliance liability from retaining legacy unmanaged data",
                "Slow analytical query response times scanning petabytes of un-compacted historical data",
                "High operational burden on data platform engineers manually cleaning up abandoned buckets",
                "Audit non-compliance with data retention policies mandated by GDPR and industry regulators"
              ]
            },
            {
              "id": "stor_02",
              "text": "How consistently are Delta Lake / Apache Iceberg table maintenance operations (VACUUM, OPTIMIZE, partition pruning) automated?",
              "guidance": "Assess automated deletion of expired table snapshots, compaction of small files, and partition maintenance.",
              "options": [
                {
                  "value": 1,
                  "score": 1,
                  "label": "No open table format maintenance; uncompacted small files and expired snapshots persist forever."
                },
                {
                  "value": 2,
                  "score": 2,
                  "label": "Ad-hoc manual OPTIMIZE / VACUUM scripts run only when table query performance noticeably degrades."
                },
                {
                  "value": 3,
                  "score": 3,
                  "label": "Scheduled weekly maintenance jobs compacting files and vacuuming snapshots older than 30 days."
                },
                {
                  "value": 4,
                  "score": 4,
                  "label": "Automated serverless table maintenance pipelines optimizing layout (Z-Order/Liquid Clustering) and enforcing 7-day retention."
                },
                {
                  "value": 5,
                  "score": 5,
                  "label": "Self-tuning lakehouse engine with automated continuous compaction, zero-overhead time travel, and optimized physical layout."
                }
              ],
              "technicalPainPoints": [
                "Uncompressed, non-columnar file formats (CSV, uncompressed JSON) utilized in analytical storage",
                "Lack of automated migration pipelines converting raw assets to Parquet, ORC, or Delta/Iceberg formats",
                "Absence of BigQuery Physical Storage Billing model adoption for massive data compression savings",
                "Duplicate data copies replicated across multiple disparate analytics platforms and object buckets",
                "Missing automated storage deduplication and zero-copy cross-region replication policies"
              ],
              "businessPainPoints": [
                "Paying 5x to 10x higher storage and query egress costs due to uncompressed data formats",
                "Slower analytical query execution degrading end-user experience across business dashboards",
                "Excessive network egress expenses incurred moving uncompressed files across cloud regions",
                "Complexity and governance confusion caused by maintaining redundant copies of golden datasets",
                "Inability to leverage modern open lakehouse engines efficiently without standardized table formats"
              ]
            }
          ]
        },
        {
          "id": "unit_economics_governance",
          "name": "Unit Economics & FinOps Culture",
          "description": "Ability to measure cost per business transaction, enforce CI/CD cost guardrails, and foster cultural accountability.",
          "weight": 1,
          "questions": [
            {
              "id": "gov_01",
              "text": "How mature is your organization's cloud unit economics capability (cost per active user, cost per query, cost per order)?",
              "guidance": "Evaluate correlation of cloud telemetry with business KPIs and gross margin impact modeling.",
              "options": [
                {
                  "value": 1,
                  "score": 1,
                  "label": "Cloud is treated as an undifferentiated overhead cost center with zero unit margin visibility."
                },
                {
                  "value": 2,
                  "score": 2,
                  "label": "Basic top-line metrics (total cloud spend vs company revenue) calculated quarterly in spreadsheets."
                },
                {
                  "value": 3,
                  "score": 3,
                  "label": "Key customer and product tier unit costs tracked monthly and shared with engineering managers."
                },
                {
                  "value": 4,
                  "score": 4,
                  "label": "Automated unit economic dashboards tracking cost per transaction/user embedded in product roadmap planning."
                },
                {
                  "value": 5,
                  "score": 5,
                  "label": "Real-time unit economic telemetry driving dynamic pricing, customer gross margin optimization, and automated resource quotas."
                }
              ],
              "technicalPainPoints": [
                "Lack of automated FinOps policy enforcement in CI/CD deployment pipelines (e.g. Infracost)",
                "Developers able to spin up expensive GPU instances and uncommitted resources without approval gates",
                "Absence of policy-as-code guardrails restricting deployment of oversized virtual machine types",
                "Missing mandatory resource tagging verification blocking non-compliant infrastructure code",
                "Zero automated drift detection flagging infrastructure deployed outside centralized Terraform modules"
              ],
              "businessPainPoints": [
                "Culture of unaccountable cloud spending with engineering prioritizing speed over cost efficiency",
                "Cost optimization viewed as a retroactive, punitive exercise rather than continuous engineering hygiene",
                "Executive inability to enforce cloud governance policies across decentralized global engineering teams",
                "Uncontrolled proliferation of experimental sandbox environments that never get decommissioned",
                "Erosion of company operating margins due to unchecked infrastructure provisioning"
              ]
            },
            {
              "id": "gov_02",
              "text": "How integrated are shift-left cost estimates, CI/CD budget guardrails, and FinOps training across engineering teams?",
              "guidance": "Assess Infracost/Terraform PR cost checks, automated pipeline circuit breakers, and FinOps Foundation practitioner certifications.",
              "options": [
                {
                  "value": 1,
                  "score": 1,
                  "label": "Zero cost visibility during development; engineers deploy infrastructure without cost awareness."
                },
                {
                  "value": 2,
                  "score": 2,
                  "label": "Informal cost awareness through periodic all-hands presentations with no tooling integration."
                },
                {
                  "value": 3,
                  "score": 3,
                  "label": "Automated PR cost estimation comments in CI/CD (e.g. Infracost) with required manager sign-off for large changes."
                },
                {
                  "value": 4,
                  "score": 4,
                  "label": "Shift-left policy-as-code guardrails blocking unauthorized expensive resource deployment, with dedicated FinOps champions."
                },
                {
                  "value": 5,
                  "score": 5,
                  "label": "Comprehensive FinOps culture with gamified team efficiency metrics, automated circuit breakers, and continuous certification."
                }
              ],
              "technicalPainPoints": [
                "FinOps metrics not integrated into team engineering scorecards, OKRs, or performance reviews",
                "Lack of automated cost efficiency gamification (e.g. team unit-cost leaderboards and waste reduction badges)",
                "Absence of formal training programs on cloud cost optimization best practices for developers",
                "Missing centralized FinOps repository of approved architecture patterns and rightsizing blueprints",
                "No structured executive cadence for reviewing unit economic metrics alongside product performance"
              ],
              "businessPainPoints": [
                "Persistent skill gaps in cloud financial management across software and data engineering teams",
                "High employee turnover in FinOps roles due to lack of leadership backing and tooling support",
                "Inability to transform cloud from a cost center into a strategic competitive differentiator",
                "Failure to achieve industry benchmark cost efficiency metrics compared to peer organizations",
                "Missed opportunities to reinvest cloud savings into high-impact AI and product innovation"
              ]
            }
          ]
        }
      ],
      "maturityLevels": [
        {
          "level": 1,
          "name": "Crawl",
          "label": "Initial / Crawl",
          "scoreMin": 1,
          "scoreMax": 1.9,
          "color": "#ef4444",
          "description": "Monolithic IT overhead, zero tagging discipline, manual reactive cleanups, and frequent billing surprises."
        },
        {
          "level": 2,
          "name": "Walk",
          "label": "Developing / Walk",
          "scoreMin": 2,
          "scoreMax": 2.9,
          "color": "#f59e0b",
          "description": "Basic tagging standards, monthly showback, initial commitment purchases, but siloed team processes."
        },
        {
          "level": 3,
          "name": "Run",
          "label": "Defined / Run",
          "scoreMin": 3,
          "scoreMax": 3.7,
          "color": "#3b82f6",
          "description": "Centralized FinOps practice, automated anomaly alerts, regular rightsizing cadences, and monthly unit cost metrics."
        },
        {
          "level": 4,
          "name": "Fly",
          "label": "Managed / Fly",
          "scoreMin": 3.8,
          "scoreMax": 4.5,
          "color": "#10b981",
          "description": "Shift-left CI/CD cost checks, real-time container cost allocation, high commitment coverage (>75%), and squad accountability."
        },
        {
          "level": 5,
          "name": "Transform",
          "label": "Optimizing / Transform",
          "scoreMin": 4.6,
          "scoreMax": 5,
          "color": "#8b5cf6",
          "description": "Industry-leading autonomous optimization, unit economics driving pricing, and financial engineering as core culture."
        }
      ]
    }
  },
  {
    "id": "eb230088-04bf-406e-9f61-2e71d8a88b33",
    "typeKey": "agentic_ai_mesh_mcp_banking_readiness",
    "title": "Autonomous Multi-Agent AI Mesh Architecture & MCP Readiness",
    "subtitle": "Enterprise Agentic Framework, Protocol Standardization, State Persistence & Telemetry Evaluation",
    "description": "Evaluates an organization's maturity in architecting, orchestrating, and securing distributed multi-agent AI ecosystems using Model Context Protocol (MCP), durable state machines, and end-to-end telemetry within highly regulated financial banking environments.",
    "icon": "FiCpu",
    "badge": "Agentic AI",
    "color": "#6366f1",
    "status": "production",
    "isPublished": true,
    "isPromoted": true,
    "createdBy": "system",
    "framework": {
      "typeKey": "agentic_ai_mesh_mcp_banking_readiness",
      "title": "Autonomous Multi-Agent AI Mesh Architecture & MCP Readiness",
      "subtitle": "Enterprise Agentic Framework, Protocol Standardization, State Persistence & Telemetry Evaluation",
      "description": "Evaluates an organization's maturity in architecting, orchestrating, and securing distributed multi-agent AI ecosystems using Model Context Protocol (MCP), durable state machines, and end-to-end telemetry within highly regulated financial banking environments.",
      "icon": "FiCpu",
      "badge": "Agentic AI",
      "color": "#6366f1",
      "targetRole": "Chief AI Architects, Heads of Machine Learning, and Enterprise AI Platform Leads",
      "estimatedMinutes": 15,
      "dimensions": [
        {
          "id": "agent_mesh_orchestration",
          "name": "Multi-Agent Topology & Dynamic Orchestration",
          "description": "Architectural paradigms for agent collaboration, routing, consensus, and delegation across banking domains.",
          "weight": 1,
          "questions": [
            {
              "id": "q_agent_orchestration_topology",
              "text": "How structured and resilient is your multi-agent interaction topology across banking services (e.g., fraud, underwriting, wealth advisory)?",
              "guidance": "Assess how agents discover one another, delegate sub-tasks, and reach consensus while preventing runaway execution loops.",
              "options": [
                {
                  "value": 1,
                  "score": 1,
                  "label": "Isolated, single-turn LLM scripts with hardcoded API calls and no autonomous multi-agent coordination."
                },
                {
                  "value": 2,
                  "score": 2,
                  "label": "Point-to-point, hardcoded sequential agent chaining with limited error recovery and manual intervention."
                },
                {
                  "value": 3,
                  "score": 3,
                  "label": "Centralized orchestrator (e.g., plan-and-solve graph) coordinating specialized domain agents with deterministic fallback rules."
                },
                {
                  "value": 4,
                  "score": 4,
                  "label": "Decentralized mesh with dynamic agent discovery, automated task decomposition, and verifiable consensus mechanisms."
                },
                {
                  "value": 5,
                  "score": 5,
                  "label": "Self-optimizing agent mesh featuring adaptive topology routing, dynamic sub-agent spawning, and automated cost/latency arbitration."
                }
              ],
              "technicalPainPoints": [
                "Technical architecture fragmentation in multi-agent topology & dynamic orchestration",
                "Lack of automated validation & regression telemetry for q_agent_orchestration_topology",
                "Deployment consistency and latency bottlenecks across environments",
                "High operational overhead managing legacy scripts and configurations",
                "Missing end-to-end distributed tracing and telemetry integration"
              ],
              "businessPainPoints": [
                "High operational expenditures and engineering resource bottlenecks",
                "Delayed time-to-market for strategic enterprise modernization initiatives",
                "Elevated compliance and governance audit liability risks",
                "Inability to scale infrastructure cost-effectively under business growth",
                "Erosion of executive trust due to inconsistent operational SLAs"
              ]
            },
            {
              "id": "q_human_in_the_loop_governance",
              "text": "How are Human-in-the-Loop (HITL) checkpoints and autonomous authority boundaries enforced across financial agent actions?",
              "guidance": "Examine operational guardrails, step-up authorization, and policy enforcement points for autonomous financial transactions.",
              "options": [
                {
                  "value": 1,
                  "score": 1,
                  "label": "No systematic autonomy boundaries; human review is completely manual and post-hoc."
                },
                {
                  "value": 2,
                  "score": 2,
                  "label": "Basic threshold-based stops requiring manual code intervention to resume failed or flagged workflows."
                },
                {
                  "value": 3,
                  "score": 3,
                  "label": "Standardized policy engine enforcing step-up human authorization for critical actions (e.g., transactions over limit)."
                },
                {
                  "value": 4,
                  "score": 4,
                  "label": "Context-aware HITL integration with granular time-to-live approval tokens, asynchronous resumption, and role-based sign-offs."
                },
                {
                  "value": 5,
                  "score": 5,
                  "label": "Dynamic risk-adaptive autonomy framework continuously calibrating human oversight based on agent confidence, historical drift, and portfolio exposure."
                }
              ],
              "technicalPainPoints": [
                "Technical architecture fragmentation in multi-agent topology & dynamic orchestration",
                "Lack of automated validation & regression telemetry for q_human_in_the_loop_governance",
                "Deployment consistency and latency bottlenecks across environments",
                "High operational overhead managing legacy scripts and configurations",
                "Missing end-to-end distributed tracing and telemetry integration"
              ],
              "businessPainPoints": [
                "High operational expenditures and engineering resource bottlenecks",
                "Delayed time-to-market for strategic enterprise modernization initiatives",
                "Elevated compliance and governance audit liability risks",
                "Inability to scale infrastructure cost-effectively under business growth",
                "Erosion of executive trust due to inconsistent operational SLAs"
              ]
            }
          ]
        },
        {
          "id": "mcp_protocol_standardization",
          "name": "Model Context Protocol (MCP) & Tool Abstraction",
          "description": "Standardization of context delivery, tool invocation schemas, and secure core banking integration via Model Context Protocol.",
          "weight": 1,
          "questions": [
            {
              "id": "q_mcp_implementation_maturity",
              "text": "To what degree is the Model Context Protocol (MCP) adopted for decoupling agent models from financial data sources and tools?",
              "guidance": "Evaluate adherence to standard MCP servers, client implementations, JSON-RPC primitives, and vendor-neutral tool interfaces.",
              "options": [
                {
                  "value": 1,
                  "score": 1,
                  "label": "Proprietary, proprietary prompt-embedded tool definitions tightly coupled to specific LLM vendor SDKs."
                },
                {
                  "value": 2,
                  "score": 2,
                  "label": "Ad-hoc Function Calling wrappers with inconsistent input/output JSON schemas across different internal teams."
                },
                {
                  "value": 3,
                  "score": 3,
                  "label": "Formalized MCP client-server architecture deployed for internal tool abstraction and standard context exposure."
                },
                {
                  "value": 4,
                  "score": 4,
                  "label": "Enterprise-wide MCP registry with semantic versioning, automated tool discovery, schema validation, and secure sandboxing."
                },
                {
                  "value": 5,
                  "score": 5,
                  "label": "Federated MCP ecosystem enabling multi-institutional context exchange with real-time zero-trust validation and schema synthesis."
                }
              ],
              "technicalPainPoints": [
                "Technical architecture fragmentation in model context protocol (mcp) & tool abstraction",
                "Lack of automated validation & regression telemetry for q_mcp_implementation_maturity",
                "Deployment consistency and latency bottlenecks across environments",
                "High operational overhead managing legacy scripts and configurations",
                "Missing end-to-end distributed tracing and telemetry integration"
              ],
              "businessPainPoints": [
                "High operational expenditures and engineering resource bottlenecks",
                "Delayed time-to-market for strategic enterprise modernization initiatives",
                "Elevated compliance and governance audit liability risks",
                "Inability to scale infrastructure cost-effectively under business growth",
                "Erosion of executive trust due to inconsistent operational SLAs"
              ]
            },
            {
              "id": "q_mcp_security_context_filtering",
              "text": "How robust are the context-filtering, data-masking, and privilege-boundary controls within your MCP servers?",
              "guidance": "Assess how sensitive customer data (PII, PCI-DSS, MNPI) is sanitized before passing through MCP context providers.",
              "options": [
                {
                  "value": 1,
                  "score": 1,
                  "label": "Raw database responses and unmasked context passed directly into model prompt windows."
                },
                {
                  "value": 2,
                  "score": 2,
                  "label": "Basic regex-based PII redaction applied inconsistently across different MCP context endpoints."
                },
                {
                  "value": 3,
                  "score": 3,
                  "label": "Standardized MCP middleware enforcing attribute-based access control (ABAC) and bidirectional tokenized masking."
                },
                {
                  "value": 4,
                  "score": 4,
                  "label": "Zero-trust MCP gateway performing real-time prompt-injection defense, semantic payload analysis, and least-privilege scoping."
                },
                {
                  "value": 5,
                  "score": 5,
                  "label": "Cryptographically verifiable differential privacy and automated contextual containment running natively at the MCP transport layer."
                }
              ],
              "technicalPainPoints": [
                "Technical architecture fragmentation in model context protocol (mcp) & tool abstraction",
                "Lack of automated validation & regression telemetry for q_mcp_security_context_filtering",
                "Deployment consistency and latency bottlenecks across environments",
                "High operational overhead managing legacy scripts and configurations",
                "Missing end-to-end distributed tracing and telemetry integration"
              ],
              "businessPainPoints": [
                "High operational expenditures and engineering resource bottlenecks",
                "Delayed time-to-market for strategic enterprise modernization initiatives",
                "Elevated compliance and governance audit liability risks",
                "Inability to scale infrastructure cost-effectively under business growth",
                "Erosion of executive trust due to inconsistent operational SLAs"
              ]
            }
          ]
        },
        {
          "id": "state_persistence_memory",
          "name": "State Persistence, Memory & Long-Term Context",
          "description": "Architectures for episodic, semantic, and working memory, durable execution, and state recovery in multi-turn workflows.",
          "weight": 1,
          "questions": [
            {
              "id": "q_durable_state_execution",
              "text": "How are long-running, multi-step agent execution states persisted and recovered across infrastructure failures?",
              "guidance": "Assess the durability of agent execution graphs, checkpointing, and deterministic replay capabilities.",
              "options": [
                {
                  "value": 1,
                  "score": 1,
                  "label": "In-memory only; process crashes or network disconnects cause complete loss of agent state and reasoning progress."
                },
                {
                  "value": 2,
                  "score": 2,
                  "label": "Ephemeral cache (e.g., Redis session) with basic key-value storage of chat history, lacking execution graph checkpointing."
                },
                {
                  "value": 3,
                  "score": 3,
                  "label": "Durable event-driven workflow engine (e.g., Temporal/state-machine) storing step checkpoints and intermediate agent thoughts."
                },
                {
                  "value": 4,
                  "score": 4,
                  "label": "ACID-compliant transactional state stores supporting deterministic event sourcing, step-level rollbacks, and exactly-once execution."
                },
                {
                  "value": 5,
                  "score": 5,
                  "label": "Distributed, time-travel enabled state mesh allowing full historical branching, deterministic simulation replay, and multi-region failover."
                }
              ],
              "technicalPainPoints": [
                "Technical architecture fragmentation in state persistence, memory & long-term context",
                "Lack of automated validation & regression telemetry for q_durable_state_execution",
                "Deployment consistency and latency bottlenecks across environments",
                "High operational overhead managing legacy scripts and configurations",
                "Missing end-to-end distributed tracing and telemetry integration"
              ],
              "businessPainPoints": [
                "High operational expenditures and engineering resource bottlenecks",
                "Delayed time-to-market for strategic enterprise modernization initiatives",
                "Elevated compliance and governance audit liability risks",
                "Inability to scale infrastructure cost-effectively under business growth",
                "Erosion of executive trust due to inconsistent operational SLAs"
              ]
            },
            {
              "id": "q_hierarchical_memory_architecture",
              "text": "How effectively does your architecture manage hierarchical memory (working, episodic, and semantic) for banking entities?",
              "guidance": "Evaluate vector embeddings, relational state, graph stores, and consolidation/compaction pipelines over extended temporal horizons.",
              "options": [
                {
                  "value": 1,
                  "score": 1,
                  "label": "Short-term prompt window stuffing only; no persistent memory across distinct customer interactions."
                },
                {
                  "value": 2,
                  "score": 2,
                  "label": "Naive vector database retrieval without metadata filtering, recency weighting, or entity extraction."
                },
                {
                  "value": 3,
                  "score": 3,
                  "label": "Multi-tiered memory separating short-term conversation state, customer episodic interactions, and institutional knowledge bases."
                },
                {
                  "value": 4,
                  "score": 4,
                  "label": "Graph-augmented hybrid retrieval (Vector + Knowledge Graph) with automated memory reflection, summarization, and forgetfulness policies."
                },
                {
                  "value": 5,
                  "score": 5,
                  "label": "Self-curating enterprise memory fabric dynamically synthesizing multi-agent experiences into verifiable financial ontology graphs with temporal decay."
                }
              ],
              "technicalPainPoints": [
                "Technical architecture fragmentation in state persistence, memory & long-term context",
                "Lack of automated validation & regression telemetry for q_hierarchical_memory_architecture",
                "Deployment consistency and latency bottlenecks across environments",
                "High operational overhead managing legacy scripts and configurations",
                "Missing end-to-end distributed tracing and telemetry integration"
              ],
              "businessPainPoints": [
                "High operational expenditures and engineering resource bottlenecks",
                "Delayed time-to-market for strategic enterprise modernization initiatives",
                "Elevated compliance and governance audit liability risks",
                "Inability to scale infrastructure cost-effectively under business growth",
                "Erosion of executive trust due to inconsistent operational SLAs"
              ]
            }
          ]
        },
        {
          "id": "telemetry_observability_evaluation",
          "name": "Telemetry, Observability & Continuous Evaluation",
          "description": "Comprehensive tracing of agent reasoning chains, OpenTelemetry standard instrumentation, cost tracking, and LLM evaluation benchmarks.",
          "weight": 1,
          "questions": [
            {
              "id": "q_agent_distributed_tracing",
              "text": "How granular is your distributed tracing across multi-agent reasoning steps, tool calls, and backend integrations?",
              "guidance": "Review OpenTelemetry compliance, span propagation, token attribution, and latency tracking across the entire agent lifecycle.",
              "options": [
                {
                  "value": 1,
                  "score": 1,
                  "label": "Basic application stdout logs with no correlation IDs between LLM invocations and underlying microservice calls."
                },
                {
                  "value": 2,
                  "score": 2,
                  "label": "Centralized log aggregation with manually injected request IDs, but lacking visibility into internal agent reasoning loops."
                },
                {
                  "value": 3,
                  "score": 3,
                  "label": "Standardized GenAI tracing (e.g., OpenInference/OTel) capturing prompts, completions, tool inputs/outputs, and token metrics."
                },
                {
                  "value": 4,
                  "score": 4,
                  "label": "Full-mesh distributed tracing correlating business transactions, agent reasoning DAGs, vector search metrics, and infrastructure spans."
                },
                {
                  "value": 5,
                  "score": 5,
                  "label": "Real-time anomaly detection over execution graphs with automated root-cause isolation for multi-agent synchronization bottlenecks."
                }
              ],
              "technicalPainPoints": [
                "Technical architecture fragmentation in telemetry, observability & continuous evaluation",
                "Lack of automated validation & regression telemetry for q_agent_distributed_tracing",
                "Deployment consistency and latency bottlenecks across environments",
                "High operational overhead managing legacy scripts and configurations",
                "Missing end-to-end distributed tracing and telemetry integration"
              ],
              "businessPainPoints": [
                "High operational expenditures and engineering resource bottlenecks",
                "Delayed time-to-market for strategic enterprise modernization initiatives",
                "Elevated compliance and governance audit liability risks",
                "Inability to scale infrastructure cost-effectively under business growth",
                "Erosion of executive trust due to inconsistent operational SLAs"
              ]
            },
            {
              "id": "q_automated_eval_guardrails",
              "text": "How rigorous are your automated evaluation pipelines (LLM-as-a-judge, benchmark suites) and real-time safety guardrails?",
              "guidance": "Assess pre-deployment evals, continuous in-production sampling, hallucination metrics (e.g., Faithfulness, Relevance), and safety filters.",
              "options": [
                {
                  "value": 1,
                  "score": 1,
                  "label": "Manual, subjective spot-checking of agent responses prior to production release."
                },
                {
                  "value": 2,
                  "score": 2,
                  "label": "Static golden-dataset testing during CI/CD without continuous runtime safety or hallucination tracking."
                },
                {
                  "value": 3,
                  "score": 3,
                  "label": "Automated CI/CD eval harness (testing toxicity, ground truth alignment, tool selection accuracy) plus standard input/output guardrails."
                },
                {
                  "value": 4,
                  "score": 4,
                  "label": "Continuous online evaluation sampling production traces with multi-dimensional judges, toxicity monitors, and automated shadow deployments."
                },
                {
                  "value": 5,
                  "score": 5,
                  "label": "Closed-loop reinforcement system automatically generating synthetic edge-case evals and updating dynamic guardrail policies in real-time."
                }
              ],
              "technicalPainPoints": [
                "Technical architecture fragmentation in telemetry, observability & continuous evaluation",
                "Lack of automated validation & regression telemetry for q_automated_eval_guardrails",
                "Deployment consistency and latency bottlenecks across environments",
                "High operational overhead managing legacy scripts and configurations",
                "Missing end-to-end distributed tracing and telemetry integration"
              ],
              "businessPainPoints": [
                "High operational expenditures and engineering resource bottlenecks",
                "Delayed time-to-market for strategic enterprise modernization initiatives",
                "Elevated compliance and governance audit liability risks",
                "Inability to scale infrastructure cost-effectively under business growth",
                "Erosion of executive trust due to inconsistent operational SLAs"
              ]
            }
          ]
        },
        {
          "id": "security_identity_compliance",
          "name": "Agent Identity, Entitlements & Regulatory Compliance",
          "description": "Cryptographic workload identity, least-privilege tool execution, zero-trust delegation, and alignment with financial compliance mandates.",
          "weight": 1,
          "questions": [
            {
              "id": "q_agent_identity_entitlement",
              "text": "How are cryptographic workload identities and granular access entitlements managed for autonomous agents?",
              "guidance": "Review SPIFFE/SPIRE implementations, dynamic OAuth/OIDC token exchange, and agent-specific credential delegation.",
              "options": [
                {
                  "value": 1,
                  "score": 1,
                  "label": "Shared static API keys with broad administrative privileges used across all agents and services."
                },
                {
                  "value": 2,
                  "score": 2,
                  "label": "Individual service accounts with static credentials, lacking down-scoping or on-behalf-of customer user context."
                },
                {
                  "value": 3,
                  "score": 3,
                  "label": "Short-lived cryptographic workload identities (e.g., SPIFFE/OIDC) with scoped entitlements tied to the agent function."
                },
                {
                  "value": 4,
                  "score": 4,
                  "label": "Dynamic credential delegation utilizing bounded token exchange (RFC 8693) ensuring agents act strictly under dual-context authority."
                },
                {
                  "value": 5,
                  "score": 5,
                  "label": "Cryptographic zero-trust mesh with mutual TLS, hardware-attested enclaves (TEE) for agent execution, and continuous identity verification."
                }
              ],
              "technicalPainPoints": [
                "Technical architecture fragmentation in agent identity, entitlements & regulatory compliance",
                "Lack of automated validation & regression telemetry for q_agent_identity_entitlement",
                "Deployment consistency and latency bottlenecks across environments",
                "High operational overhead managing legacy scripts and configurations",
                "Missing end-to-end distributed tracing and telemetry integration"
              ],
              "businessPainPoints": [
                "High operational expenditures and engineering resource bottlenecks",
                "Delayed time-to-market for strategic enterprise modernization initiatives",
                "Elevated compliance and governance audit liability risks",
                "Inability to scale infrastructure cost-effectively under business growth",
                "Erosion of executive trust due to inconsistent operational SLAs"
              ]
            },
            {
              "id": "q_regulatory_auditability_explainability",
              "text": "How completely does the multi-agent mesh preserve deterministic provenance and explainability for regulatory audits?",
              "guidance": "Assess the recording of complete reasoning graphs, context snapshots, tool parameter logs, and compliance evidence packages.",
              "options": [
                {
                  "value": 1,
                  "score": 1,
                  "label": "Black-box architecture; intermediate chain-of-thought and tool parameters are discarded after execution."
                },
                {
                  "value": 2,
                  "score": 2,
                  "label": "Ad-hoc storage of final prompts and outputs without historical context or dynamic tool invocation logs."
                },
                {
                  "value": 3,
                  "score": 3,
                  "label": "Immutable audit log capturing exact prompt states, MCP context snapshots, model versions, and tool outputs for critical operations."
                },
                {
                  "value": 4,
                  "score": 4,
                  "label": "Automated compliance ledger providing cryptographic non-repudiation, step-by-step reasoning attribution, and regulatory report generation."
                },
                {
                  "value": 5,
                  "score": 5,
                  "label": "Real-time supervisory audit-agent interface offering continuous self-attesting compliance proofs, counterfactual explanations, and instantaneous e-discovery."
                }
              ],
              "technicalPainPoints": [
                "Technical architecture fragmentation in agent identity, entitlements & regulatory compliance",
                "Lack of automated validation & regression telemetry for q_regulatory_auditability_explainability",
                "Deployment consistency and latency bottlenecks across environments",
                "High operational overhead managing legacy scripts and configurations",
                "Missing end-to-end distributed tracing and telemetry integration"
              ],
              "businessPainPoints": [
                "High operational expenditures and engineering resource bottlenecks",
                "Delayed time-to-market for strategic enterprise modernization initiatives",
                "Elevated compliance and governance audit liability risks",
                "Inability to scale infrastructure cost-effectively under business growth",
                "Erosion of executive trust due to inconsistent operational SLAs"
              ]
            }
          ]
        }
      ],
      "maturityLevels": [
        {
          "level": 1,
          "name": "Initial",
          "label": "Initial / Ad-hoc",
          "scoreMin": 1,
          "scoreMax": 1.9,
          "color": "#ef4444",
          "description": "Fragmented, prototype-level agent scripting with static prompts, zero state persistence, lack of standardized protocols, and unmanaged compliance risks."
        },
        {
          "level": 2,
          "name": "Developing",
          "label": "Developing / Emerging",
          "scoreMin": 2,
          "scoreMax": 2.9,
          "color": "#f59e0b",
          "description": "Basic multi-agent chains with ephemeral caching and emerging tool integration, but constrained by brittle point-to-point connections and high manual review burden."
        },
        {
          "level": 3,
          "name": "Defined",
          "label": "Defined / Standardized",
          "scoreMin": 3,
          "scoreMax": 3.7,
          "color": "#3b82f6",
          "description": "Standardized MCP adoption, durable state execution engines, robust OpenTelemetry logging, and formalized human-in-the-loop governance for banking services."
        },
        {
          "level": 4,
          "name": "Managed",
          "label": "Managed / Automated",
          "scoreMin": 3.8,
          "scoreMax": 4.5,
          "color": "#10b981",
          "description": "Decentralized agent mesh with dynamic discovery, cryptographic workload delegation, continuous automated evaluation, and immutable regulatory audit ledgers."
        },
        {
          "level": 5,
          "name": "Optimizing",
          "label": "Optimizing / Transformative",
          "scoreMin": 4.6,
          "scoreMax": 5,
          "color": "#8b5cf6",
          "description": "Self-orchestrating, zero-trust autonomous AI fabric featuring adaptive risk boundaries, self-healing topologies, real-time verifiable telemetry, and industry-leading compliance."
        }
      ]
    }
  },
  {
    "id": "tpl_edw_lakehouse_bigquery",
    "typeKey": "edw_lakehouse_to_bigquery_modernization",
    "title": "Snowflake / Teradata / Databricks to BigQuery Lakehouse Modernization",
    "subtitle": "Open Storage (Iceberg), Predictable Slots & Zero-Egress Analytics",
    "description": "Comprehensive 10-question evaluation for modernizing legacy data warehouses (Teradata, Netezza, Snowflake, Databricks) to BigQuery + BigLake open lakehouse architecture with predictable Editions pricing and unified Dataplex governance.",
    "icon": "HiDatabase",
    "badge": "Lakehouse Modernization",
    "color": "#2563eb",
    "status": "production",
    "isPublished": true,
    "isPromoted": true,
    "createdBy": "system",
    "framework": {
      "typeKey": "edw_lakehouse_to_bigquery_modernization",
      "title": "Snowflake / Teradata / Databricks to BigQuery Lakehouse Modernization",
      "subtitle": "Open Storage (Iceberg), Predictable Slots & Zero-Egress Analytics",
      "description": "Assess table format standardization (Apache Iceberg / Delta), multi-cloud zero-egress querying (BigQuery Omni), BigQuery Editions reservation capacity, Dataplex catalog lineage, streaming CDC, and in-database ML.",
      "icon": "HiDatabase",
      "badge": "Lakehouse Modernization",
      "color": "#2563eb",
      "targetRole": "Chief Data Officers, Enterprise Data Architects, Heads of Data Platform, VP of Infrastructure",
      "estimatedMinutes": 15,
      "dimensions": [
        {
          "id": "edw_dim_01",
          "name": "Open Storage & Multi-Cloud Federation",
          "description": "Evaluates open table format adoption (Apache Iceberg/Delta), multi-cloud zero-egress querying, and storage decoupling.",
          "weight": 1,
          "questions": [
            {
              "id": "edw_01",
              "text": "How are enterprise analytical tables formatted, stored, and shared across compute engines?",
              "guidance": "Evaluate proprietary warehouse formats vs universal open table formats (Apache Iceberg / Delta UniForm / BigLake).",
              "options": [
                {
                  "value": 1,
                  "score": 1,
                  "label": "Proprietary vendor storage formats locked inside a single data warehouse; duplicate copies exported as raw CSVs for other teams."
                },
                {
                  "value": 2,
                  "score": 2,
                  "label": "Siloed Parquet files in object storage alongside proprietary warehouse tables without unified cataloging."
                },
                {
                  "value": 3,
                  "score": 3,
                  "label": "Standardized on a single table format (Delta or Iceberg), but locked to a specific compute engine."
                },
                {
                  "value": 4,
                  "score": 4,
                  "label": "Universal Open Lakehouse (Apache Iceberg / Delta UniForm) queried zero-copy by BigQuery, Spark, and Trino simultaneously."
                },
                {
                  "value": 5,
                  "score": 5,
                  "label": "Autonomous storage tiering with automated compaction, vacuuming, and cross-cloud zero-copy data sharing via BigLake."
                }
              ],
              "technicalPainPoints": [
                "Proprietary SQL dialects (Snowflake SQL, Teradata BTEQ, Databricks Spark SQL) requiring manual translation",
                "Complex stored procedures with procedural loops that do not map directly to ANSI SQL standard",
                "Lack of automated SQL dialect translation and validation tooling causing migration delays",
                "Hardcoded database connection strings and non-standard datetime parsing across legacy ETL jobs",
                "High risk of silent semantic differences in floating-point calculations and string concatenation"
              ],
              "businessPainPoints": [
                "Astronomical migration consulting fees and multi-year project timeline overruns",
                "Business downtime during critical financial reporting periods caused by broken SQL logic",
                "Vendor lock-in preventing adoption of high-performance modern cloud analytics platforms",
                "Frustration among business users due to delayed access to modernized data warehouse capabilities",
                "Risk of business decisions based on inconsistently translated financial metrics and KPI calculations"
              ]
            },
            {
              "id": "edw_02",
              "text": "How does your platform query and analyze data distributed across multiple cloud providers (AWS, Azure, GCP)?",
              "guidance": "Evaluate expensive cross-cloud batch replication vs BigQuery Omni in-place federated execution.",
              "options": [
                {
                  "value": 1,
                  "score": 1,
                  "label": "Heavy daily cross-cloud batch data transfers incurring massive egress fees and latency."
                },
                {
                  "value": 2,
                  "score": 2,
                  "label": "Ad-hoc manual exports between AWS S3, Azure Blob, and GCP buckets when cross-cloud analysis is requested."
                },
                {
                  "value": 3,
                  "score": 3,
                  "label": "Scheduled ETL replication pipelines syncing key operational tables across clouds."
                },
                {
                  "value": 4,
                  "score": 4,
                  "label": "BigQuery Omni & BigLake executing distributed SQL queries in-place directly where data resides in AWS/Azure without egress."
                },
                {
                  "value": 5,
                  "score": 5,
                  "label": "Intelligent multi-cloud query planner pushing compute to remote storage regions and returning only aggregated result sets."
                }
              ],
              "technicalPainPoints": [
                "Incompatible data types (e.g. Teradata INTERVAL, Snowflake VARIANT) causing pipeline ingestion failures",
                "Complex schema hierarchies with deeply nested JSON arrays that require schema redesign for BigQuery",
                "Lack of automated schema mapping and validation tools between source and target databases",
                "Absence of automated schema drift detection between operational databases and analytics warehouse",
                "Legacy table partitioning schemes that do not translate efficiently to BigQuery partition/cluster models"
              ],
              "businessPainPoints": [
                "Data pipeline failures stalling critical executive reporting dashboards and daily business operations",
                "High engineering costs spent manually debugging data type conversion errors and schema mismatches",
                "Delayed time-to-value for strategic cloud analytics and business intelligence initiatives",
                "Inability to ingest new operational data sources quickly to support dynamic business needs",
                "Inaccurate or incomplete business reports caused by dropped or truncated data fields during migration"
              ]
            }
          ]
        },
        {
          "id": "edw_dim_02",
          "name": "SQL Analytics Engine & Reservation FinOps",
          "description": "Evaluates compute autoscaling predictability, BigQuery Editions slot reservations, and semantic layer acceleration.",
          "weight": 1,
          "questions": [
            {
              "id": "edw_03",
              "text": "How are data warehouse compute costs, concurrency scaling, and budget predictability managed?",
              "guidance": "Evaluate unpredictable credit consumption vs BigQuery Editions baseline slot reservations with dynamic autoscaling.",
              "options": [
                {
                  "value": 1,
                  "score": 1,
                  "label": "Uncapped auto-scaling virtual warehouses burning volatile credits when unoptimized queries run."
                },
                {
                  "value": 2,
                  "score": 2,
                  "label": "Fixed warehouse sizes with manual resizing; frequent end-of-month budget overruns."
                },
                {
                  "value": 3,
                  "score": 3,
                  "label": "Departmental spend caps and auto-suspend timers (e.g. 5 mins) configured per warehouse cluster."
                },
                {
                  "value": 4,
                  "score": 4,
                  "label": "BigQuery Editions (Standard/Enterprise/Enterprise Plus) with committed baseline reservations and burst autoscaling."
                },
                {
                  "value": 5,
                  "score": 5,
                  "label": "Autonomous slot sharing across business units with predictive budget scaling and dynamic queue prioritization."
                }
              ],
              "technicalPainPoints": [
                "Legacy batch ETL pipelines with multi-hour batch windows causing stale data in operational dashboards",
                "Lack of real-time Change Data Capture (CDC) replication from operational OLTP databases",
                "Brittle orchestration scripts with complex inter-job dependencies that frequently fail and require manual restart",
                "Inability to handle streaming data ingestion at scale without significant infrastructure provisioning",
                "High latency in data pipeline execution preventing real-time analytics and fast decision-making"
              ],
              "businessPainPoints": [
                "Business stakeholders making critical decisions based on stale data that is 24 to 48 hours old",
                "Missed business opportunities in fast-moving markets due to lack of real-time operational insights",
                "High operational overhead maintaining legacy batch ETL infrastructure and overnight support shifts",
                "Customer dissatisfaction from delayed order tracking, billing updates, and real-time alerts",
                "Inability to support modern real-time AI and machine learning use cases with batch-only data pipelines"
              ]
            },
            {
              "id": "edw_04",
              "text": "How does your analytical architecture handle executive BI dashboard concurrency and sub-second query latency?",
              "guidance": "Evaluate extract cubes vs governed in-memory BI acceleration (Looker / BigQuery BI Engine).",
              "options": [
                {
                  "value": 1,
                  "score": 1,
                  "label": "Long-running batch queries block interactive dashboards; executive reports take 30+ seconds to load."
                },
                {
                  "value": 2,
                  "score": 2,
                  "label": "Heavy reliance on periodic BI extracts and duplicate caching servers requiring constant maintenance."
                },
                {
                  "value": 3,
                  "score": 3,
                  "label": "Materialized database views refreshed on hourly schedules to support dashboard queries."
                },
                {
                  "value": 4,
                  "score": 4,
                  "label": "Governed Semantic Layer with BigQuery BI Engine delivering sub-second in-memory SQL acceleration without extracts."
                },
                {
                  "value": 5,
                  "score": 5,
                  "label": "Conversational BI powered by Gemini querying the unified semantic layer with natural language and sub-second visual rendering."
                }
              ],
              "technicalPainPoints": [
                "Orchestration workflows managed across disparate legacy tools (Cron, Autosys, Control-M, Airflow)",
                "Lack of unified workflow observability, dependency mapping, and automated SLA alerting",
                "Absence of automated retry mechanisms and backfill pipelines for transient network failures",
                "Complex pipeline codebases lacking standardized CI/CD and automated regression testing",
                "Difficulty maintaining pipeline versioning and environment promotion between Dev, QA, and Prod"
              ],
              "businessPainPoints": [
                "Frequent missed SLAs on critical regulatory and executive business reports",
                "High engineering maintenance burden fixing brittle, un-documented legacy pipeline workflows",
                "Slow delivery of new data models and dashboards to business units due to deployment friction",
                "Loss of trust from business executives in the reliability and timeliness of enterprise data assets",
                "High operational costs from dedicated onshore/offshore teams needed for 24/7 pipeline babysitting"
              ]
            }
          ]
        },
        {
          "id": "edw_dim_03",
          "name": "Data Governance, Lineage & Data Quality",
          "description": "Evaluates automated metadata cataloging, end-to-end data lineage, and automated data contracts via Dataplex.",
          "weight": 1,
          "questions": [
            {
              "id": "edw_05",
              "text": "How is data asset discovery, metadata tagging, and end-to-end column-level lineage managed across the data platform?",
              "guidance": "Evaluate manual wiki documentation vs automated Dataplex cataloging and pipeline lineage.",
              "options": [
                {
                  "value": 1,
                  "score": 1,
                  "label": "Tribal knowledge; no centralized documentation of tables, schema definitions, or data owners."
                },
                {
                  "value": 2,
                  "score": 2,
                  "label": "Static data dictionaries in spreadsheets or Confluence updated manually once a quarter."
                },
                {
                  "value": 3,
                  "score": 3,
                  "label": "Standalone metadata catalog requiring data engineers to manually register and document new tables."
                },
                {
                  "value": 4,
                  "score": 4,
                  "label": "Automated Dataplex Catalog and column-level lineage tracing data transformations from ingestion to BI dashboards."
                },
                {
                  "value": 5,
                  "score": 5,
                  "label": "Active metadata governance with automated data health scoring and automated impact analysis for proposed schema changes."
                }
              ],
              "technicalPainPoints": [
                "Data locked in proprietary storage formats requiring vendor-specific compute engines to access",
                "Lack of open table format support (Apache Iceberg, Delta Lake) across enterprise storage buckets",
                "Absence of a universal catalog (e.g. Dataplex / Apache Polaris) managing metadata across clouds",
                "Duplicate copies of large datasets copied across multiple object buckets and analytical engines",
                "High storage and egress costs moving data between disparate analytics platforms and clouds"
              ],
              "businessPainPoints": [
                "High risk of vendor lock-in with escalating software licensing and compute costs over time",
                "Inability to choose the best-of-breed compute engine for specific analytical and ML workloads",
                "Data silos preventing cross-functional collaboration and 360-degree customer analytics",
                "High infrastructure expenditure storing redundant copies of petabyte-scale enterprise datasets",
                "Difficulty enforcing unified security, compliance, and governance policies across isolated data silos"
              ]
            },
            {
              "id": "edw_06",
              "text": "How does your platform enforce data quality rules, detect schema drift, and prevent silent data corruption?",
              "guidance": "Evaluate end-user bug reports vs automated Dataplex data quality contracts and anomaly alerts.",
              "options": [
                {
                  "value": 1,
                  "score": 1,
                  "label": "No automated tests; data quality issues are discovered only after corrupted numbers reach executive dashboards."
                },
                {
                  "value": 2,
                  "score": 2,
                  "label": "Basic row count assertions executed manually before monthly financial closes."
                },
                {
                  "value": 3,
                  "score": 3,
                  "label": "dbt / SQL test assertions validating primary key uniqueness and null constraints during scheduled runs."
                },
                {
                  "value": 4,
                  "score": 4,
                  "label": "Automated Data Contracts & Dataplex Quality Rules blocking non-conforming data at the ingestion boundary."
                },
                {
                  "value": 5,
                  "score": 5,
                  "label": "AI-driven statistical profiling detecting subtle data distribution shifts and auto-quarantining anomalous batches."
                }
              ],
              "technicalPainPoints": [
                "Siloed metadata catalogs making data discovery, search, and semantic understanding difficult",
                "Lack of automated data profiling, quality anomaly detection, and data lineage visualization",
                "Manual tagging and classification of sensitive data assets leading to inconsistent coverage",
                "Inability to track end-to-end data provenance from source transaction to executive dashboard",
                "Absence of programmatic API access to metadata for automated governance and CI/CD pipelines"
              ],
              "businessPainPoints": [
                "Data consumers wasting 30-40% of their time searching for, verifying, and understanding data assets",
                "Regulatory audit non-compliance due to inability to demonstrate complete data lineage and provenance",
                "Inaccurate analytical insights generated from poorly understood or obsolete data tables",
                "Slow onboarding of new analysts and data scientists due to lack of searchable data documentation",
                "Duplication of analytical effort across teams building redundant datasets that already exist"
              ]
            }
          ]
        },
        {
          "id": "edw_dim_04",
          "name": "Modern ELT, Real-Time CDC & In-Database AI",
          "description": "Evaluates declarative pipeline orchestration (Dataform/dbt), sub-second streaming CDC ingestion, and BigQuery ML AI integration.",
          "weight": 1,
          "questions": [
            {
              "id": "edw_07",
              "text": "How are data transformation pipelines (ELT) engineered, version-controlled, and deployed?",
              "guidance": "Evaluate monolithic stored procedures vs declarative Dataform/dbt pipelines with Git CI/CD.",
              "options": [
                {
                  "value": 1,
                  "score": 1,
                  "label": "Monolithic, 5,000-line stored procedures with no version control, testing, or rollback mechanisms."
                },
                {
                  "value": 2,
                  "score": 2,
                  "label": "SQL scripts version-controlled in Git, but executed via manual cron jobs and unmonitored scripts."
                },
                {
                  "value": 3,
                  "score": 3,
                  "label": "Orchestrated dbt / Dataform pipelines with staging environments and automated branch testing."
                },
                {
                  "value": 4,
                  "score": 4,
                  "label": "Serverless declarative pipelines with incremental materialized tables and automated CI/CD deployment."
                },
                {
                  "value": 5,
                  "score": 5,
                  "label": "Autonomous self-optimizing pipelines with dynamic resource allocation, automated query refactoring, and auto-healing retries."
                }
              ],
              "technicalPainPoints": [
                "Full table scans executing on multi-terabyte tables due to missing partition and cluster pruning",
                "Lack of query performance optimization best practices (e.g. anti-patterns with SELECT *, Cartesian joins)",
                "Unpredictable query latencies causing dashboard timeouts during high concurrent usage periods",
                "Absence of materialized views and automated BI Engine caching for sub-second executive reporting",
                "Inefficient join algorithms on un-clustered tables consuming excessive compute slot resources"
              ],
              "businessPainPoints": [
                "Poor user experience on customer and executive dashboards leading to low adoption rates",
                "Skyrocketing on-demand query costs from un-optimized SQL queries scanning massive data volumes",
                "Analytical bottlenecks stalling time-sensitive financial closes and operational decision-making",
                "Frustration among business analysts whose queries get queued or cancelled during peak hours",
                "Inability to scale data platform consumption to thousands of concurrent users cost-effectively"
              ]
            },
            {
              "id": "edw_08",
              "text": "How is operational transactional data (Postgres, Oracle, SQL Server, SAP) ingested into the analytical lakehouse?",
              "guidance": "Evaluate batch nightly dumps vs real-time Change Data Capture (CDC) streaming via BigQuery Storage Write API.",
              "options": [
                {
                  "value": 1,
                  "score": 1,
                  "label": "Nightly full database dumps placing heavy read locks and performance penalties on production OLTP databases."
                },
                {
                  "value": 2,
                  "score": 2,
                  "label": "Timestamp-based polling queries running every 4 hours with high duplicate record risks."
                },
                {
                  "value": 3,
                  "score": 3,
                  "label": "Log-based CDC streaming into staging tables with hourly SQL merge operations."
                },
                {
                  "value": 4,
                  "score": 4,
                  "label": "Sub-second real-time streaming ingestion using BigQuery Storage Write API applying CDC mutations in real time."
                },
                {
                  "value": 5,
                  "score": 5,
                  "label": "Unified real-time event mesh seamlessly powering operational dashboards, fraud detection, and transactional microservices."
                }
              ],
              "technicalPainPoints": [
                "Unpredictable on-demand query pricing causing volatile and uncontrollable monthly cloud bills",
                "Lack of workload management reservation pools isolating batch ELT from interactive executive BI",
                "Absence of dynamic autoscaling slot policies for BigQuery Enterprise and Enterprise Plus editions",
                "Missing query execution budgets and automated circuit breakers on runaway analytical queries",
                "Inability to track and allocate data warehouse costs accurately to specific business units and projects"
              ],
              "businessPainPoints": [
                "Unbudgeted cloud expense surges causing finance escalations and unplanned budget reallocations",
                "Inability to forecast annual data platform expenditures with confidence and precision",
                "Disputes between business units over shared data warehouse costs without granular attribution",
                "Executive hesitation to expand data analytics access across the enterprise due to cost fears",
                "Erosion of data platform ROI due to unchecked compute expenditure on low-value ad-hoc queries"
              ]
            },
            {
              "id": "edw_09",
              "text": "How are machine learning models and generative AI functions integrated into your data warehouse workflow?",
              "guidance": "Evaluate exporting data to local notebooks vs in-database SQL AI functions (BigQuery ML + Gemini).",
              "options": [
                {
                  "value": 1,
                  "score": 1,
                  "label": "Data scientists export massive CSVs to local machines; zero operational ML or AI in the data warehouse."
                },
                {
                  "value": 2,
                  "score": 2,
                  "label": "Custom Python ETL jobs copying warehouse data to external ML platforms; complex separate deployment infrastructure."
                },
                {
                  "value": 3,
                  "score": 3,
                  "label": "Batch scoring pipelines running Python models externally and loading prediction tables back into the warehouse overnight."
                },
                {
                  "value": 4,
                  "score": 4,
                  "label": "Direct SQL AI Functions (BigQuery ML + Gemini) executing text embeddings, classification, and forecasting inside SQL queries."
                },
                {
                  "value": 5,
                  "score": 5,
                  "label": "Continuous real-time ML inference and vector search executed directly inside the SQL engine with automated model drift monitoring."
                }
              ],
              "technicalPainPoints": [
                "Static dataset-level IAM permissions providing all-or-nothing access to entire database tables",
                "Lack of granular column-level security and dynamic row-level security (RLS) policies",
                "Manual policy management across hundreds of datasets resulting in configuration drift and gaps",
                "Absence of automated PII masking and surrogate tokenization for sensitive customer attributes",
                "Inability to enforce attribute-based access control (ABAC) based on user department and clearance"
              ],
              "businessPainPoints": [
                "Severe regulatory compliance risks under GDPR, CCPA, HIPAA, and industry-specific privacy laws",
                "Overly restrictive data access policies blocking legitimate business analysts from doing their jobs",
                "Risk of unauthorized exposure of sensitive customer, financial, and employee data records",
                "Audit failures and prolonged audit preparation cycles requiring manual access entitlement reviews",
                "Inability to safely share analytical datasets with external partners and clients"
              ]
            },
            {
              "id": "edw_10",
              "text": "What automated migration tooling, SQL translation, and validation mechanisms are used for database modernization?",
              "guidance": "Evaluate manual line-by-line SQL rewrites vs BigQuery Migration Service automated translation and validation.",
              "options": [
                {
                  "value": 1,
                  "score": 1,
                  "label": "Fully manual line-by-line SQL and stored procedure rewrites by developers; high error rate."
                },
                {
                  "value": 2,
                  "score": 2,
                  "label": "Basic regex find-and-replace scripts for syntax differences, followed by extensive manual debugging."
                },
                {
                  "value": 3,
                  "score": 3,
                  "label": "Third-party migration consulting tools with semi-automated SQL dialect conversion."
                },
                {
                  "value": 4,
                  "score": 4,
                  "label": "BigQuery Migration Service with automated SQL dialect translation, schema mapping, and automated data comparison validation."
                },
                {
                  "value": 5,
                  "score": 5,
                  "label": "Autonomous AI-accelerated migration pipeline with automatic query performance optimization and zero-downtime dual-run validation."
                }
              ],
              "technicalPainPoints": [
                "Absence of automated data quality testing in production pipelines before data is published to BI",
                "Lack of real-time anomaly detection for unexpected nulls, schema changes, and volume deviations",
                "Missing automated data validation pipelines verifying consistency between legacy EDW and BigQuery",
                "Inability to automatically quarantine corrupted data batches without stopping the entire pipeline",
                "No automated data health dashboards alerting data engineers to quality degradation before users notice"
              ],
              "businessPainPoints": [
                "Flawed business decisions based on corrupted, incomplete, or inaccurate analytical reports",
                "Loss of credibility and trust in enterprise data assets across executive leadership and board",
                "Costly manual reconciliation efforts by finance and operations teams to fix bad data in reports",
                "Customer-facing errors and billing discrepancies resulting from corrupted operational data feeds",
                "Compliance penalties for submitting inaccurate regulatory reports to government authorities"
              ]
            }
          ]
        }
      ],
      "maturityLevels": [
        {
          "level": 1,
          "name": "Ad-hoc",
          "label": "Legacy / Siloed",
          "scoreMin": 1,
          "scoreMax": 1.9,
          "color": "#ef4444",
          "description": "Locked in proprietary formats, volatile compute costs, no automated catalog, and manual stored procedures."
        },
        {
          "level": 2,
          "name": "Developing",
          "label": "Developing / Fragmented",
          "scoreMin": 2,
          "scoreMax": 2.9,
          "color": "#f59e0b",
          "description": "Partial Parquet files, basic spend alerts, static metadata sheets, and batch nightly ETL dumps."
        },
        {
          "level": 3,
          "name": "Defined",
          "label": "Defined / Standardized",
          "scoreMin": 3,
          "scoreMax": 3.7,
          "color": "#3b82f6",
          "description": "Single table format, departmental warehouse caps, standalone catalog, and orchestrated dbt pipelines."
        },
        {
          "level": 4,
          "name": "Managed",
          "label": "Managed / Modern Lakehouse",
          "scoreMin": 3.8,
          "scoreMax": 4.5,
          "color": "#10b981",
          "description": "Universal Iceberg/BigLake, BigQuery Editions slot reservations, automated Dataplex lineage, and BigQuery ML."
        },
        {
          "level": 5,
          "name": "Optimizing",
          "label": "Optimizing / Autonomous Data Mesh",
          "scoreMin": 4.6,
          "scoreMax": 5,
          "color": "#8b5cf6",
          "description": "Multi-cloud zero-egress Omni, conversational Looker BI, real-time CDC storage write API, and self-healing data mesh."
        }
      ]
    }
  },
  {
    "id": "tpl_enterprise_ai_zero_trust_security",
    "typeKey": "enterprise_ai_zero_trust_security",
    "title": "Enterprise AI & Zero-Trust Security Assessment",
    "subtitle": "CISO Posture, Real-Time DLP, Shadow AI Gateway & Zero-Trust Mesh",
    "description": "Comprehensive executive evaluation across Shadow AI Gateway governance, Real-Time DLP & PII masking, Workload Identity (IAM/PAM), Model Armor prompt defense, and SIEM/SOAR compliance for EU AI Act, HIPAA & NIST.",
    "icon": "HiShieldCheck",
    "badge": "CISO & Zero-Trust",
    "color": "#0ea5e9",
    "status": "production",
    "isPublished": true,
    "isPromoted": true,
    "createdBy": "system",
    "framework": {
      "typeKey": "enterprise_ai_zero_trust_security",
      "title": "Enterprise AI & Zero-Trust Security Assessment",
      "subtitle": "CISO Posture, Real-Time DLP, Shadow AI Gateway & Zero-Trust Mesh",
      "description": "Audit shadow AI exposure, centralized AI gateway architecture (Apigee + Model Armor), real-time DLP data masking, customer-managed encryption (CMEK/EKM), workload identity federation, and immutable audit trails for EU AI Act / HIPAA / NIST compliance.",
      "icon": "HiShieldCheck",
      "badge": "CISO & Zero-Trust",
      "color": "#0ea5e9",
      "targetRole": "CISOs, Chief Risk Officers, Data Protection Officers, Security Architects",
      "estimatedMinutes": 15,
      "dimensions": [
        {
          "id": "sec_dim_01",
          "name": "Shadow AI Discovery & Perimeter Gateway Defense",
          "description": "Evaluates visibility into unmanaged AI consumption, centralized API gateways (Apigee / Vertex), and private VPC Service Controls isolation.",
          "weight": 1,
          "questions": [
            {
              "id": "sec_ai_01",
              "text": "How does your organization discover, monitor, and govern employee and application traffic to external AI models?",
              "guidance": "Evaluate visibility into unapproved AI web usage, developer keys, and centralized enterprise AI gateway interception.",
              "options": [
                {
                  "value": 1,
                  "score": 1,
                  "label": "Zero visibility: Employees freely paste proprietary code and data into consumer AI platforms without controls."
                },
                {
                  "value": 2,
                  "score": 2,
                  "label": "Basic CASB domain blocking of AI URLs without approved enterprise AI alternatives for staff."
                },
                {
                  "value": 3,
                  "score": 3,
                  "label": "Approved corporate AI chat sandbox available, but application API keys and developer CLI tools remain unmonitored."
                },
                {
                  "value": 4,
                  "score": 4,
                  "label": "Centralized Enterprise AI Gateway capturing 100% of internal developer and application AI traffic with rate limiting."
                },
                {
                  "value": 5,
                  "score": 5,
                  "label": "Automated shadow AI discovery across CI/CD and Git, dynamic token auto-revocation, and VPC-SC private perimeter isolation."
                }
              ],
              "technicalPainPoints": [
                "Unmanaged browser extensions and CLI tools capturing internal source code and prompts",
                "Hardcoded public OpenAI/Anthropic API keys leaked in code repositories and dev configs",
                "Lack of visibility into which enterprise departments are transmitting data to external LLMs",
                "Direct egress to public AI model APIs bypassing corporate forward-proxy inspection",
                "Missing centralized gateway enforcing rate limits, enterprise quotas, and tenant isolation"
              ],
              "businessPainPoints": [
                "Severe risk of intellectual property leaks and confidential trade secret exposure",
                "Regulatory compliance violations under EU AI Act, HIPAA, and GDPR Article 28",
                "Unpredictable, unmetered AI spending across shadow department credit card subscriptions",
                "Legal liability resulting from employees using non-enterprise compliant AI tools",
                "Loss of institutional knowledge and governance over automated customer communications"
              ]
            },
            {
              "id": "sec_ai_02",
              "text": "What network isolation and egress controls protect sensitive enterprise GenAI workloads from data exfiltration?",
              "guidance": "Review private connectivity (Private Service Connect / VPC Service Controls) and zero-egress architecture.",
              "options": [
                {
                  "value": 1,
                  "score": 1,
                  "label": "Public internet API calls with static API keys transmitted over public DNS."
                },
                {
                  "value": 2,
                  "score": 2,
                  "label": "TLS encryption over public endpoints with IP allowlisting but no perimeter isolation."
                },
                {
                  "value": 3,
                  "score": 3,
                  "label": "Private VPC peering with basic egress firewalls for internal model deployments."
                },
                {
                  "value": 4,
                  "score": 4,
                  "label": "Private Service Connect (PSC) and VPC Service Controls blocking all unauthorized data exfiltration paths."
                },
                {
                  "value": 5,
                  "score": 5,
                  "label": "Confidential Computing enclaves with memory encryption, zero-egress perimeter mesh, and automated boundary verification."
                }
              ],
              "technicalPainPoints": [
                "Model traffic traversing public internet endpoints without VPC Service Controls perimeter defense",
                "Direct API key distribution to developers leading to accidental repository leaks",
                "Missing audit logging and forensic retention for enterprise compliance inspection",
                "Lack of private endpoint peering and surrogate IP whitelisting for backend inference calls",
                "Absence of automated certificate rotation and secrets manager integration for LLM credentials"
              ],
              "businessPainPoints": [
                "Severe regulatory non-compliance penalties under EU AI Act, HIPAA, GDPR, and PCI-DSS",
                "Critical risk of proprietary intellectual property and customer data leakage to public model providers",
                "Delayed enterprise security sign-offs stalling production deployment of generative AI tools",
                "Potential loss of enterprise customer contracts due to third-party data privacy audit failures",
                "Massive financial liability and brand reputation damage from credential leak security breaches"
              ]
            }
          ]
        },
        {
          "id": "sec_dim_02",
          "name": "Real-Time Data Loss Prevention (DLP) & PII/PHI Tokenization",
          "description": "Maturity of automated inspection, dynamic masking, surrogate tokenization, and customer-managed encryption (CMEK/EKM).",
          "weight": 1,
          "questions": [
            {
              "id": "sec_dlp_01",
              "text": "How are sensitive customer data, PII, PHI, and credentials sanitized before being ingested into LLM prompts or RAG stores?",
              "guidance": "Assess automated Cloud DLP inspection, cryptographic tokenization, and real-time masking proxies.",
              "options": [
                {
                  "value": 1,
                  "score": 1,
                  "label": "No automated sanitization; raw data including PII/PHI is sent directly to model inference endpoints."
                },
                {
                  "value": 2,
                  "score": 2,
                  "label": "Basic regex-based client-side masking for emails and phone numbers with frequent false negatives."
                },
                {
                  "value": 3,
                  "score": 3,
                  "label": "Automated Cloud DLP scanning on batch training data and pre-indexed vector stores."
                },
                {
                  "value": 4,
                  "score": 4,
                  "label": "Real-time proxy-level DLP inspection with dynamic surrogate tokenization and reversibility under strict RBAC."
                },
                {
                  "value": 5,
                  "score": 5,
                  "label": "Autonomous zero-knowledge DLP mesh with homomorphic encryption, policy-driven masking, and continuous compliance scoring."
                }
              ],
              "technicalPainPoints": [
                "Lack of automated sensitive data classification scanning across structured and unstructured data stores",
                "Absence of real-time Cloud Data Loss Prevention (Cloud DLP) integration in application API gateways",
                "Static masking rules that break downstream data utility for analytical and machine learning models",
                "Inability to detect sensitive intellectual property (source code, formulas) in conversational prompts",
                "High latency overhead from unoptimized regex-based DLP inspection pipelines"
              ],
              "businessPainPoints": [
                "Massive regulatory fines for transmitting unencrypted customer PII/PHI to external AI cloud models",
                "Loss of trade secrets and patented algorithms through unmonitored employee AI usage",
                "Inability to safely deploy AI applications in highly regulated industries (healthcare, banking)",
                "Complex and costly manual privacy auditing processes required for every new AI feature release",
                "Customer backlash and contract terminations following inadvertent privacy policy violations"
              ]
            },
            {
              "id": "sec_dlp_02",
              "text": "What cryptographic key management controls protect vector database embeddings, prompts, and cached artifacts?",
              "guidance": "Evaluate Default Google-managed keys vs Customer-Managed Encryption Keys (CMEK) and External Key Management (Cloud EKM).",
              "options": [
                {
                  "value": 1,
                  "score": 1,
                  "label": "Default cloud-provider managed encryption with shared keys and no visibility into key access."
                },
                {
                  "value": 2,
                  "score": 2,
                  "label": "Static customer-managed keys without automated rotation or granular access logging."
                },
                {
                  "value": 3,
                  "score": 3,
                  "label": "CMEK via Cloud KMS enabled for major storage buckets and databases with annual rotation."
                },
                {
                  "value": 4,
                  "score": 4,
                  "label": "Universal CMEK across all GenAI assets (Vertex AI, Vector Search, BigQuery, Prompt Caching) with automated rotation."
                },
                {
                  "value": 5,
                  "score": 5,
                  "label": "External Key Management (Cloud EKM) with Hardware Security Modules (HSM) and Key Access Justifications (KAJ)."
                }
              ],
              "technicalPainPoints": [
                "Reliance on cloud provider default encryption keys without Customer-Managed Encryption Keys (CMEK)",
                "Lack of Hardware Security Module (Cloud EKM) integration for critical cryptographic key storage",
                "Absence of automated key rotation policies enforced across all data storage and model caches",
                "Missing cryptographic shredding capabilities to instantly revoke access to compromised datasets",
                "Inability to enforce cryptographic access policies across multi-region and multi-cloud backups"
              ],
              "businessPainPoints": [
                "Failure to satisfy stringent enterprise client security questionnaires and compliance mandates",
                "Inability to achieve sovereign cloud compliance in jurisdictions requiring local key control",
                "Vulnerability to extraterritorial subpoena access without customer cryptographic authorization",
                "Loss of institutional investor confidence following third-party cloud security assessments",
                "Inability to win Fortune 500 enterprise customer contracts requiring Bring Your Own Key (BYOK)"
              ]
            }
          ]
        },
        {
          "id": "sec_dim_03",
          "name": "Identity Governance, Zero Standing Privilege & Workload Federation (IAM/PAM)",
          "description": "Maturity of Workload Identity Federation, ephemeral just-in-time access, and eliminating static service account keys.",
          "weight": 1,
          "questions": [
            {
              "id": "sec_iam_01",
              "text": "How are user and machine identities authenticated and authorized across your hybrid multi-cloud estate?",
              "guidance": "Evaluate Workload Identity Federation (OIDC), elimination of static JSON keys, and attribute-based access control (ABAC).",
              "options": [
                {
                  "value": 1,
                  "score": 1,
                  "label": "Static service account keys stored on local disks, CI/CD runners, and unmanaged Git repos."
                },
                {
                  "value": 2,
                  "score": 2,
                  "label": "Centralized SSO for employees, but machine credentials rely on static JSON keys with manual rotation."
                },
                {
                  "value": 3,
                  "score": 3,
                  "label": "Short-lived credentials via Workload Identity Federation for major CI/CD pipelines; 90-day key rotations."
                },
                {
                  "value": 4,
                  "score": 4,
                  "label": "100% elimination of downloadable service account keys via OIDC federation, adaptive MFA, and ABAC policies."
                },
                {
                  "value": 5,
                  "score": 5,
                  "label": "Zero standing privileges with just-in-time (JIT) ephemeral token minting and AI-driven continuous behavioral anomaly revocation."
                }
              ],
              "technicalPainPoints": [
                "Proliferation of static, long-lived JSON service account keys downloaded to developer laptops",
                "Absence of Workload Identity Federation (OIDC) for GitHub Actions, GitLab, and external apps",
                "Lack of automated key age tracking and automated service account key revocation pipelines",
                "Broad primitive IAM roles (Owner, Editor) assigned to service accounts instead of least-privilege",
                "Missing anomaly detection flagging service account key usage from unexpected external IP addresses"
              ],
              "businessPainPoints": [
                "Catastrophic security breach risk from leaked service account keys posted on public GitHub repositories",
                "Failed SOC 2, ISO 27001, and FedRAMP security audits due to unmanaged cryptographic credentials",
                "High blast radius in the event of an account compromise allowing lateral movement across cloud projects",
                "Extensive engineering downtime required to rotate compromised keys during emergency security drills",
                "Financial liabilities and breach notification costs exceeding millions of dollars"
              ]
            },
            {
              "id": "sec_iam_02",
              "text": "To what extent is Privileged Access Management (PAM) enforced for production infrastructure and AI model deployments?",
              "guidance": "Evaluate Just-In-Time (JIT) elevation, peer approval workflows, and immutable session recording.",
              "options": [
                {
                  "value": 1,
                  "score": 1,
                  "label": "Permanent admin roles assigned to engineers with unmonitored production access."
                },
                {
                  "value": 2,
                  "score": 2,
                  "label": "Shared privileged credentials stored in password vaults with manual checkout."
                },
                {
                  "value": 3,
                  "score": 3,
                  "label": "Role-based access with dual-custody approval for high-risk production changes."
                },
                {
                  "value": 4,
                  "score": 4,
                  "label": "Automated JIT access elevation expiring in <4 hours with comprehensive session auditing."
                },
                {
                  "value": 5,
                  "score": 5,
                  "label": "Context-aware ephemeral PAM with automated blast radius containment and continuous telemetry verification."
                }
              ],
              "technicalPainPoints": [
                "Standing administrative privileges granted to engineers permanently rather than on-demand",
                "Lack of Just-In-Time (JIT) Privileged Access Management (PAM) with automated multi-person approvals",
                "Absence of session recording and immutable command audit logging for privileged cloud access",
                "Missing automated privilege revocation after designated maintenance or troubleshooting windows",
                "No contextual access evaluation based on user device health, location, and MFA authentication strength"
              ],
              "businessPainPoints": [
                "Insider threat vulnerabilities from disgruntled or compromised employees with excessive permissions",
                "Difficulty proving least-privilege compliance to enterprise clients and regulatory examiners",
                "Accidental destructive production changes executed by engineers with unconstrained administrative rights",
                "Slow security investigations due to ambiguous attribution of shared administrative actions",
                "Loss of cybersecurity insurance coverage or inflated premiums due to inadequate PAM controls"
              ]
            }
          ]
        },
        {
          "id": "sec_dim_04",
          "name": "Model Armor, Prompt Injection Defense & Runtime Safety",
          "description": "Defenses against adversarial prompt injection, jailbreaking, insecure output handling, model hallucinations, and Model Armor integration.",
          "weight": 1,
          "questions": [
            {
              "id": "sec_armor_01",
              "text": "What automated defenses protect your GenAI applications against indirect prompt injection, jailbreaks, and system prompt exfiltration?",
              "guidance": "Evaluate runtime safety filters, Google Cloud Model Armor, Llama Guard, and heuristic input sanitization.",
              "options": [
                {
                  "value": 1,
                  "score": 1,
                  "label": "Zero defensive guardrails; raw user prompts are concatenated directly into LLM context without validation."
                },
                {
                  "value": 2,
                  "score": 2,
                  "label": "Static system prompt instructions pleading with the model not to reveal instructions or execute malicious commands."
                },
                {
                  "value": 3,
                  "score": 3,
                  "label": "Basic blocklists for forbidden keywords and standard safety threshold filters (Hate, Harassment, Sexual)."
                },
                {
                  "value": 4,
                  "score": 4,
                  "label": "Dedicated Model Armor / Guardrails inspection layer evaluating semantic intent, prompt injection heuristics, and jailbreak patterns."
                },
                {
                  "value": 5,
                  "score": 5,
                  "label": "Multi-layer adversarial defense with dynamic red-teaming, Model Armor real-time scoring, sandboxed agent execution, and automated quarantine."
                }
              ],
              "technicalPainPoints": [
                "Lack of Model Armor or equivalent real-time guardrail filtering on raw LLM prompt inputs",
                "Vulnerability to indirect prompt injection via compromised external websites or emails in RAG",
                "Missing system-prompt leak detection preventing extraction of proprietary corporate instructions",
                "Absence of automated red-teaming test suites probing for new adversarial jailbreak vectors",
                "Zero rate-limiting on repetitive adversarial probing attempts from malicious external users"
              ],
              "businessPainPoints": [
                "Exfiltration of confidential corporate prompts, internal endpoints, and proprietary business logic",
                "Compromise of backend systems through prompt injection manipulating agentic database tools",
                "Public embarrassment and viral social media exposure of model guardrail bypasses",
                "Customer data theft executed via subtle indirect prompt injection payloads in support tickets",
                "Severe legal liability if AI agents execute unauthorized financial transactions via prompt hijack"
              ]
            },
            {
              "id": "sec_armor_02",
              "text": "How does your architecture validate, sanitize, and verify the safety of LLM-generated code, SQL queries, and tool execution payloads?",
              "guidance": "Assess insecure output handling, sandboxed code execution, and parameter validation before downstream execution.",
              "options": [
                {
                  "value": 1,
                  "score": 1,
                  "label": "Unsanitized model output executed directly in databases or terminal shells with full privileges."
                },
                {
                  "value": 2,
                  "score": 2,
                  "label": "Basic string regex checks before running model-generated SQL or code."
                },
                {
                  "value": 3,
                  "score": 3,
                  "label": "Read-only database replicas and restricted execution scopes for model-generated queries."
                },
                {
                  "value": 4,
                  "score": 4,
                  "label": "Strict OpenAPI JSON Schema validation and sandboxed isolated container execution for all generated code."
                },
                {
                  "value": 5,
                  "score": 5,
                  "label": "Zero-trust tool execution mesh with signed AST verification, deterministic capability tokens, and real-time execution sandboxing."
                }
              ],
              "technicalPainPoints": [
                "Lack of automated output validation ensuring responses comply with brand safety and legal guidelines",
                "Absence of real-time detection for hallucinated malicious URLs, phishing links, and toxic language",
                "Missing semantic similarity filtering against competitor brand mentions and non-approved advice",
                "Zero automated structural verification ensuring JSON outputs do not contain executable payloads",
                "No automated feedback loop logging blocked outputs to security telemetry pipelines for model tuning"
              ],
              "businessPainPoints": [
                "Brand damage resulting from AI generating defamatory, offensive, or politically biased statements",
                "Regulatory enforcement actions from AI generating non-compliant financial or medical advice",
                "Customer litigation resulting from relying on un-grounded, fabricated AI output recommendations",
                "Erosion of executive and customer confidence in automated AI decision-making workflows",
                "Copyright infringement claims arising from verbatim memorized text generation without attribution"
              ]
            }
          ]
        },
        {
          "id": "sec_dim_05",
          "name": "Continuous SIEM/SOAR Ingestion, Audit Trails & Regulatory Compliance",
          "description": "End-to-end immutability of AI audit logs, Cloud Audit Logs to BigQuery/Chronicle SIEM integration, and alignment with EU AI Act, NIST AI RMF & HIPAA.",
          "weight": 1,
          "questions": [
            {
              "id": "sec_audit_01",
              "text": "How are prompt inputs, model responses, tool calls, and user context logged and ingested into enterprise security platforms?",
              "guidance": "Review Cloud Audit Logs, BigQuery log sinks, Chronicle SIEM ingestion, and tamper-proof log immutability.",
              "options": [
                {
                  "value": 1,
                  "score": 1,
                  "label": "No centralized logging; ephemeral console outputs lost upon container restart."
                },
                {
                  "value": 2,
                  "score": 2,
                  "label": "Application-level log files written to local disks with manual ad-hoc log querying."
                },
                {
                  "value": 3,
                  "score": 3,
                  "label": "Centralized Cloud Logging stream with basic 30-day retention for system errors."
                },
                {
                  "value": 4,
                  "score": 4,
                  "label": "Automated export of Cloud Audit Logs and AI gateway telemetry into BigQuery and Chronicle SIEM for real-time threat hunting."
                },
                {
                  "value": 5,
                  "score": 5,
                  "label": "Cryptographically verifiable, immutable audit ledger with AI threat graph detection, automated SOAR incident response, and instant regulatory report generation."
                }
              ],
              "technicalPainPoints": [
                "Fragmented, ephemeral log storage across microservices preventing unified security investigations",
                "Lack of sub-second log ingestion into Google Security Operations (Chronicle SIEM)",
                "Absence of automated log parsing and normalization into the Unified Data Model (UDM) schema",
                "Missing log retention policies satisfying 1-year to 7-year regulatory compliance requirements",
                "Inability to execute petabyte-scale security searches across years of telemetry in seconds"
              ],
              "businessPainPoints": [
                "Undetected attacker dwell time measured in months due to lack of centralized security visibility",
                "Massive audit penalties for failing to maintain tamper-proof audit trails for regulated workloads",
                "Inability to definitively establish the scope of data exfiltration during post-breach forensics",
                "Skyrocketing SIEM licensing costs from legacy volume-based security analytics platforms",
                "Loss of customer trust and contractual penalties for failing to report security incidents within SLAs"
              ]
            },
            {
              "id": "sec_audit_02",
              "text": "What formal governance frameworks and continuous compliance audits validate your enterprise AI and Cloud security posture?",
              "guidance": "Assess alignment with NIST AI RMF, ISO/IEC 42001, EU AI Act, SOC2 Type II, and CSPM posture management.",
              "options": [
                {
                  "value": 1,
                  "score": 1,
                  "label": "No formal security governance framework; ad-hoc checklist before major releases."
                },
                {
                  "value": 2,
                  "score": 2,
                  "label": "Annual manual third-party penetration testing and static policy documents."
                },
                {
                  "value": 3,
                  "score": 3,
                  "label": "SOC2 Type II and ISO 27001 certifications maintained with automated CSPM posture scanning."
                },
                {
                  "value": 4,
                  "score": 4,
                  "label": "NIST AI RMF and EU AI Act compliance program with automated continuous posture assessment via Security Command Center."
                },
                {
                  "value": 5,
                  "score": 5,
                  "label": "Continuous autonomous compliance guardrails with automated policy-as-code remediation, certified ISO 42001, and executive transparency reporting."
                }
              ],
              "technicalPainPoints": [
                "Manual incident response workflows requiring security analysts to manually revoke keys and isolate VMs",
                "Absence of Security Orchestraction, Automation, and Response (SOAR) playbooks for automated containment",
                "Lack of automated threat intelligence correlation against global vulnerability and IOC feeds",
                "Missing bi-directional integration between SIEM alerts, ticketing systems, and cloud IAM controllers",
                "High Mean-Time-To-Contain (MTTC) for automated attacks propagating across multi-cloud environments"
              ],
              "businessPainPoints": [
                "Overwhelmed Security Operations Center (SOC) teams suffering burnout and high attrition",
                "Compromised systems remaining active in production for hours before manual human intervention",
                "Extensive financial losses resulting from delayed containment of ransomware and cryptomining attacks",
                "Inability to demonstrate proactive security posture to cyber insurance underwriters",
                "Competitive disadvantage compared to industry peers with sub-minute automated response capabilities"
              ]
            }
          ]
        }
      ],
      "maturityLevels": [
        {
          "level": 1,
          "name": "Exposed",
          "label": "Initial / Exposed",
          "scoreMin": 1,
          "scoreMax": 1.9,
          "color": "#ef4444",
          "description": "Zero visibility into shadow AI, static credentials, unencrypted data exfiltration paths, and high breach exposure."
        },
        {
          "level": 2,
          "name": "Fragmented",
          "label": "Developing / Fragmented",
          "scoreMin": 2,
          "scoreMax": 2.9,
          "color": "#f59e0b",
          "description": "Basic URL filtering, static SSO, partial regex masking, and manual incident investigation."
        },
        {
          "level": 3,
          "name": "Governed",
          "label": "Defined / Governed",
          "scoreMin": 3,
          "scoreMax": 3.7,
          "color": "#3b82f6",
          "description": "Centralized AI Gateway, Cloud DLP on batch data, Workload Identity Federation, and 24/7 SIEM monitoring."
        },
        {
          "level": 4,
          "name": "Zero-Trust",
          "label": "Managed / Zero-Trust AI Posture",
          "scoreMin": 3.8,
          "scoreMax": 4.5,
          "color": "#10b981",
          "description": "Model Armor runtime defense, real-time surrogate tokenization, VPC Service Controls, universal CMEK, and automated SOAR playbooks."
        },
        {
          "level": 5,
          "name": "Continuous Defense",
          "label": "Optimizing / Continuous Autonomous Defense",
          "scoreMin": 4.6,
          "scoreMax": 5,
          "color": "#8b5cf6",
          "description": "Zero standing privileges, confidential computing enclaves, AI threat graph hunting, self-healing cloud security mesh, and certified ISO 42001 compliance."
        }
      ]
    }
  }
];

class CustomAssessmentRepository {
  constructor() {
    this.ensureStarterTemplates();
    this.ensureStarterInstances();
  }

  ensureStarterTemplates() {
    try {
      // Prune legacy/redundant assessment keys
      typesFileStore.delete('cloud_security_zero_trust_architecture');
      typesFileStore.delete('cloud_security___zero_trust_architecture_readiness');
      typesFileStore.delete('ciso_enterprise_ai_security_shadow_gateway');

      STARTER_PRODUCTION_TEMPLATES.forEach(tpl => {
        typesFileStore.set(tpl.typeKey, tpl);
      });
      console.log('✅ Synchronized 4 golden production assessment starter templates in registry.');
    } catch (e) {
      console.warn('Could not seed starter templates:', e.message);
    }
  }

  ensureStarterInstances() {
    try {
      const existing = instancesFileStore.getAll();
      if (!existing || Object.keys(existing).length === 0) {
        const dynamicEngine = require('../services/dynamicAssessmentEngine');
        STARTER_PRODUCTION_TEMPLATES.forEach(tpl => {
          const instanceId = `inst_${tpl.typeKey}_demo`;
          const framework = tpl.framework;
          const dimensions = framework.dimensions || [];
          const sampleResponses = {};
          
          dimensions.forEach((dim, dIdx) => {
            (dim.questions || []).forEach((q, qIdx) => {
              const score = ((dIdx + qIdx) % 3) + 2;
              sampleResponses[q.id] = score;
              sampleResponses[`${q.id}_current_state`] = score;
              sampleResponses[`${q.id}_future_state`] = Math.min(5, score + 2);
              if (q.technicalPainPoints && q.technicalPainPoints.length > 0) {
                sampleResponses[`${q.id}_technical_pain`] = [q.technicalPainPoints[0]];
              }
              if (q.businessPainPoints && q.businessPainPoints.length > 0) {
                sampleResponses[`${q.id}_business_pain`] = [q.businessPainPoints[0]];
              }
              sampleResponses[`${q.id}_comment`] = 'Production baseline verified during architectural audit.';
            });
          });

          const calculated = dynamicEngine.calculateScores(sampleResponses, framework);
          const customerNames = {
            enterprise_ai_zero_trust_security: 'Apex Health & FinTech Global',
            finops_cloud_cost_optimization: 'Nova Retail Group',
            openai_to_gemini_enterprise_migration: 'Quantum FinTech Global',
            edw_lakehouse_to_bigquery_modernization: 'Global Logistics Alliance'
          };

          const instance = {
            id: instanceId,
            typeKey: tpl.typeKey,
            customerName: customerNames[tpl.typeKey] || 'Enterprise Modernization Partner',
            useCase: tpl.subtitle || 'Zero Trust & Cloud Modernization Initiative',
            contactEmail: 'lead-architect@enterprise.org',
            frameworkSnapshot: framework,
            responses: sampleResponses,
            scores: calculated.dimensionScores,
            totalScore: calculated.overallScore,
            maxScore: calculated.maxScore,
            maturityLevel: calculated.maturityLevel,
            status: 'completed',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          instancesFileStore.set(instanceId, instance);
        });
        console.log('✅ Seeded production starter assessment instances for fresh deployments.');
      }
    } catch (e) {
      console.warn('Could not seed starter instances:', e.message);
    }
  }

  // ==========================================
  // 1. ASSESSMENT TYPES / TEMPLATES
  // ==========================================

  async saveAssessmentType(typeData) {
    const id = typeData.id || uuidv4();
    const typeKey = typeData.typeKey || typeData.type_key || (typeData.title || 'custom').toLowerCase().replace(/[^a-z0-9]/g, '_');
    
    const formatted = {
      id,
      typeKey,
      title: typeData.title || 'Custom Assessment',
      subtitle: typeData.subtitle || '',
      description: typeData.description || '',
      icon: typeData.icon || 'FiAward',
      badge: typeData.badge || 'Custom',
      color: typeData.color || '#6366f1',
      framework: typeData.framework || {},
      status: typeData.status || (typeData.isPromoted ? 'production' : 'draft'),
      isPublished: typeData.isPublished !== undefined ? Boolean(typeData.isPublished) : true,
      isPromoted: typeData.isPromoted !== undefined ? Boolean(typeData.isPromoted) : false,
      createdBy: typeData.createdBy || 'system',
      createdAt: typeData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      const query = `
        INSERT INTO custom_assessment_types (
          id, type_key, title, subtitle, description, icon, badge, color,
          framework, is_published, is_promoted, created_by, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        ON CONFLICT (type_key) DO UPDATE SET
          title = EXCLUDED.title,
          subtitle = EXCLUDED.subtitle,
          description = EXCLUDED.description,
          icon = EXCLUDED.icon,
          badge = EXCLUDED.badge,
          color = EXCLUDED.color,
          framework = EXCLUDED.framework,
          is_published = EXCLUDED.is_published,
          is_promoted = EXCLUDED.is_promoted,
          updated_at = NOW()
        RETURNING *
      `;

      const values = [
        formatted.id,
        formatted.typeKey,
        formatted.title,
        formatted.subtitle,
        formatted.description,
        formatted.icon,
        formatted.badge,
        formatted.color,
        JSON.stringify(formatted.framework),
        formatted.isPublished,
        formatted.isPromoted,
        formatted.createdBy,
        formatted.createdAt,
        formatted.updatedAt
      ];

      const result = await db.query(query, values);
      const saved = this.mapRowToType(result.rows[0]);
      typesFileStore.set(formatted.typeKey, { ...formatted, ...saved });
      return saved;
    } catch (error) {
      console.warn('PostgreSQL saveAssessmentType fallback to file store:', error.message);
      typesFileStore.set(formatted.typeKey, formatted);
      return formatted;
    }
  }

  async getAllAssessmentTypes(promotedOnly = false, status = null) {
    try {
      let query = 'SELECT * FROM custom_assessment_types WHERE is_published = TRUE';
      if (promotedOnly) {
        query += ' AND is_promoted = TRUE';
      }
      query += ' ORDER BY created_at DESC';

      const result = await db.query(query);
      let items = result.rows.map(r => this.mapRowToType(r));
      if (items.length === 0) {
        items = Object.values(typesFileStore.getAll() || {});
      }
      if (status) {
        items = items.filter(t => (t.status || (t.isPromoted ? 'production' : 'draft')) === status);
      }
      if (promotedOnly) {
        items = items.filter(t => t.isPromoted === true);
      }
      return items;
    } catch (error) {
      console.warn('PostgreSQL getAllAssessmentTypes fallback to file store:', error.message);
      let all = Object.values(typesFileStore.getAll() || {});
      if (all.length === 0) {
        all = STARTER_PRODUCTION_TEMPLATES;
        all.forEach(t => typesFileStore.set(t.typeKey, t));
      }
      if (promotedOnly) {
        all = all.filter(t => t.isPromoted === true);
      }
      if (status) {
        all = all.filter(t => (t.status || (t.isPromoted ? 'production' : 'draft')) === status);
      }
      return all;
    }
  }

  async findAssessmentTypeByKey(typeKey) {
    try {
      const normalized = typeKey.replace(/_+/g, '_');
      const query = 'SELECT * FROM custom_assessment_types WHERE type_key = $1 OR type_key = $2 OR id = $1';
      const result = await db.query(query, [typeKey, normalized]);
      if (result.rows.length === 0) {
        return typesFileStore.get(typeKey) || 
               typesFileStore.get(normalized) || 
               typesFileStore.get('cloud_security_zero_trust_architecture') || 
               null;
      }
      return this.mapRowToType(result.rows[0]);
    } catch (error) {
      console.warn('PostgreSQL findAssessmentTypeByKey fallback to file store:', error.message);
      const normalized = typeKey.replace(/_+/g, '_');
      return typesFileStore.get(typeKey) || 
             typesFileStore.get(normalized) || 
             typesFileStore.get('cloud_security_zero_trust_architecture') || 
             null;
    }
  }

  async togglePromotion(idOrKey, isPromoted) {
    try {
      const query = `
        UPDATE custom_assessment_types
        SET is_promoted = $1, updated_at = NOW()
        WHERE id = $2 OR type_key = $2
        RETURNING *
      `;
      const result = await db.query(query, [isPromoted, idOrKey]);
      if (result.rows.length > 0) {
        const item = this.mapRowToType(result.rows[0]);
        typesFileStore.set(item.typeKey, item);
        return item;
      }
      return null;
    } catch (error) {
      console.warn('PostgreSQL togglePromotion fallback to file store:', error.message);
      const item = typesFileStore.get(idOrKey);
      if (item) {
        item.isPromoted = isPromoted;
        if (isPromoted) item.status = 'production';
        item.updatedAt = new Date().toISOString();
        typesFileStore.set(item.typeKey, item);
        return item;
      }
      return null;
    }
  }

  async updateAssessmentType(idOrKey, updates) {
    try {
      const item = await this.findAssessmentTypeByKey(idOrKey);
      if (!item) return null;
      const updated = {
        ...item,
        ...updates,
        updatedAt: new Date().toISOString()
      };
      return await this.saveAssessmentType(updated);
    } catch (error) {
      console.warn('updateAssessmentType error:', error.message);
      return null;
    }
  }

  async deleteAssessmentType(idOrKey) {
    try {
      await db.query('DELETE FROM custom_assessment_types WHERE id = $1 OR type_key = $1', [idOrKey]);
      typesFileStore.delete(idOrKey);
      return true;
    } catch (error) {
      console.warn('PostgreSQL deleteAssessmentType fallback to file store:', error.message);
      typesFileStore.delete(idOrKey);
      return true;
    }
  }

  // ==========================================
  // 2. DYNAMIC ASSESSMENT INSTANCES
  // ==========================================

  async createInstance(instanceData) {
    const id = instanceData.id || uuidv4();
    const formatted = {
      id,
      typeKey: instanceData.typeKey || instanceData.type_key || 'custom',
      customerName: instanceData.customerName || 'Organization',
      useCase: instanceData.useCase || '',
      contactEmail: instanceData.contactEmail || '',
      frameworkSnapshot: instanceData.frameworkSnapshot || {},
      responses: instanceData.responses || {},
      scores: instanceData.scores || {},
      totalScore: parseFloat(instanceData.totalScore || 0),
      maxScore: parseFloat(instanceData.maxScore || 5.0),
      maturityLevel: instanceData.maturityLevel || 'Initial',
      status: instanceData.status || 'in_progress',
      aiReport: instanceData.aiReport || null,
      createdBy: instanceData.createdBy || 'system',
      createdAt: instanceData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completedAt: instanceData.completedAt || null
    };

    try {
      const query = `
        INSERT INTO dynamic_assessments (
          id, type_key, customer_name, use_case, contact_email,
          framework_snapshot, responses, scores, total_score, max_score,
          maturity_level, status, ai_report, created_by, created_at, updated_at, completed_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
        RETURNING *
      `;

      const values = [
        formatted.id,
        formatted.typeKey,
        formatted.customerName,
        formatted.useCase,
        formatted.contactEmail,
        JSON.stringify(formatted.frameworkSnapshot),
        JSON.stringify(formatted.responses),
        JSON.stringify(formatted.scores),
        formatted.totalScore,
        formatted.maxScore,
        formatted.maturityLevel,
        formatted.status,
        formatted.aiReport ? JSON.stringify(formatted.aiReport) : null,
        formatted.createdBy,
        formatted.createdAt,
        formatted.updatedAt,
        formatted.completedAt
      ];

      const result = await db.query(query, values);
      const saved = this.mapRowToInstance(result.rows[0]);
      instancesFileStore.set(saved.id, saved);
      return saved;
    } catch (error) {
      console.warn('PostgreSQL createInstance fallback to file store:', error.message);
      instancesFileStore.set(formatted.id, formatted);
      return formatted;
    }
  }

  async getInstanceById(id) {
    try {
      const query = 'SELECT * FROM dynamic_assessments WHERE id = $1';
      const result = await db.query(query, [id]);
      if (result.rows.length === 0) {
        return instancesFileStore.get(id) || null;
      }
      return this.mapRowToInstance(result.rows[0]);
    } catch (error) {
      console.warn('PostgreSQL getInstanceById fallback to file store:', error.message);
      return instancesFileStore.get(id) || null;
    }
  }

  async updateInstance(id, updateData) {
    try {
      const current = await this.getInstanceById(id);
      if (!current) return null;

      const updated = {
        ...current,
        ...updateData,
        updatedAt: new Date().toISOString(),
        completedAt: updateData.status === 'completed' ? (current.completedAt || new Date().toISOString()) : current.completedAt
      };

      const query = `
        UPDATE dynamic_assessments
        SET responses = $1, scores = $2, total_score = $3, max_score = $4,
            maturity_level = $5, status = $6, ai_report = $7,
            updated_at = NOW(), completed_at = $8
        WHERE id = $9
        RETURNING *
      `;

      const values = [
        JSON.stringify(updated.responses),
        JSON.stringify(updated.scores),
        parseFloat(updated.totalScore || 0),
        parseFloat(updated.maxScore || 5.0),
        updated.maturityLevel,
        updated.status,
        updated.aiReport ? JSON.stringify(updated.aiReport) : null,
        updated.completedAt,
        id
      ];

      const result = await db.query(query, values);
      if (result.rows.length > 0) {
        const saved = this.mapRowToInstance(result.rows[0]);
        instancesFileStore.set(id, saved);
        return saved;
      }
      instancesFileStore.set(id, updated);
      return updated;
    } catch (error) {
      console.warn('PostgreSQL updateInstance fallback to file store:', error.message);
      const item = instancesFileStore.get(id);
      if (item) {
        const updated = { ...item, ...updateData, updatedAt: new Date().toISOString() };
        if (updateData.status === 'completed' && !updated.completedAt) {
          updated.completedAt = new Date().toISOString();
        }
        instancesFileStore.set(id, updated);
        return updated;
      }
      return null;
    }
  }

  async getAllInstances(filters = {}) {
    try {
      let query = 'SELECT * FROM dynamic_assessments WHERE 1=1';
      const params = [];

      if (filters.search) {
        params.push(`%${filters.search}%`);
        query += ` AND (customer_name ILIKE $${params.length} OR use_case ILIKE $${params.length} OR type_key ILIKE $${params.length})`;
      }
      if (filters.customerName) {
        params.push(`%${filters.customerName}%`);
        query += ` AND customer_name ILIKE $${params.length}`;
      }
      if (filters.typeKey) {
        params.push(filters.typeKey);
        query += ` AND type_key = $${params.length}`;
      }
      if (filters.status && filters.status !== 'all') {
        params.push(filters.status);
        query += ` AND status = $${params.length}`;
      }
      query += ' ORDER BY created_at DESC';

      const result = await db.query(query, params);
      let items = result.rows.map(r => this.mapRowToInstance(r));
      if (items.length === 0) {
        items = Object.values(instancesFileStore.getAll() || {});
        if (filters.search) {
          const s = filters.search.toLowerCase();
          items = items.filter(i => 
            (i.customerName || '').toLowerCase().includes(s) ||
            (i.useCase || '').toLowerCase().includes(s) ||
            (i.typeKey || '').toLowerCase().includes(s) ||
            (i.frameworkSnapshot?.title || '').toLowerCase().includes(s)
          );
        }
        if (filters.customerName) {
          const needle = filters.customerName.toLowerCase();
          items = items.filter(i => (i.customerName || '').toLowerCase().includes(needle));
        }
        if (filters.typeKey) {
          items = items.filter(i => i.typeKey === filters.typeKey);
        }
        if (filters.status && filters.status !== 'all') {
          items = items.filter(i => i.status === filters.status);
        }
        items.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      }

      const total = items.length;
      const limit = filters.limit ? Math.min(Math.max(1, filters.limit), 200) : undefined;
      const offset = filters.offset ? Math.max(0, filters.offset) : 0;

      if (limit !== undefined) {
        const paginatedItems = items.slice(offset, offset + limit);
        return {
          items: paginatedItems,
          total,
          limit,
          offset,
          hasMore: offset + limit < total
        };
      }

      return items;
    } catch (error) {
      console.warn('PostgreSQL getAllInstances fallback to file store:', error.message);
      let all = Object.values(instancesFileStore.getAll() || {});
      if (filters.search) {
        const s = filters.search.toLowerCase();
        all = all.filter(i => 
          (i.customerName || '').toLowerCase().includes(s) ||
          (i.useCase || '').toLowerCase().includes(s) ||
          (i.typeKey || '').toLowerCase().includes(s) ||
          (i.frameworkSnapshot?.title || '').toLowerCase().includes(s)
        );
      }
      if (filters.customerName) {
        const needle = filters.customerName.toLowerCase();
        all = all.filter(i => (i.customerName || '').toLowerCase().includes(needle));
      }
      if (filters.typeKey) {
        all = all.filter(i => i.typeKey === filters.typeKey);
      }
      if (filters.status && filters.status !== 'all') {
        all = all.filter(i => i.status === filters.status);
      }
      all.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

      const total = all.length;
      const limit = filters.limit ? Math.min(Math.max(1, filters.limit), 200) : undefined;
      const offset = filters.offset ? Math.max(0, filters.offset) : 0;

      if (limit !== undefined) {
        return {
          items: all.slice(offset, offset + limit),
          total,
          limit,
          offset,
          hasMore: offset + limit < total
        };
      }

      return all;
    }
  }

  async deleteInstance(id) {
    try {
      await db.query('DELETE FROM dynamic_assessments WHERE id = $1', [id]);
      instancesFileStore.delete(id);
      return true;
    } catch (error) {
      console.warn('PostgreSQL deleteInstance fallback to file store:', error.message);
      instancesFileStore.delete(id);
      return true;
    }
  }

  // ==========================================
  // 3. ROW MAPPING HELPERS
  // ==========================================

  mapRowToType(row) {
    if (!row) return null;
    return {
      id: row.id,
      typeKey: row.type_key,
      title: row.title,
      subtitle: row.subtitle,
      description: row.description,
      icon: row.icon,
      badge: row.badge,
      color: row.color,
      framework: typeof row.framework === 'string' ? JSON.parse(row.framework) : (row.framework || {}),
      status: row.status || (row.is_promoted ? 'production' : 'draft'),
      isPublished: row.is_published,
      isPromoted: row.is_promoted,
      createdBy: row.created_by,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  mapRowToInstance(row) {
    if (!row) return null;
    return {
      id: row.id,
      typeKey: row.type_key,
      customerName: row.customer_name,
      useCase: row.use_case,
      contactEmail: row.contact_email,
      frameworkSnapshot: typeof row.framework_snapshot === 'string' ? JSON.parse(row.framework_snapshot) : (row.framework_snapshot || {}),
      responses: typeof row.responses === 'string' ? JSON.parse(row.responses) : (row.responses || {}),
      scores: typeof row.scores === 'string' ? JSON.parse(row.scores) : (row.scores || {}),
      totalScore: parseFloat(row.total_score || 0),
      maxScore: parseFloat(row.max_score || 5.0),
      maturityLevel: row.maturity_level,
      status: row.status,
      aiReport: typeof row.ai_report === 'string' ? JSON.parse(row.ai_report) : (row.ai_report || null),
      version: row.version ? parseInt(row.version, 10) : 1,
      createdBy: row.created_by,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      completedAt: row.completed_at
    };
  }
}

module.exports = new CustomAssessmentRepository();
