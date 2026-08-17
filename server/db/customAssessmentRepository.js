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
    id: 'tpl_openai_to_gemini',
    typeKey: 'openai_to_gemini_enterprise_migration',
    title: 'OpenAI to Gemini Enterprise Migration Assessment',
    subtitle: 'Enterprise GenAI Architecture Modernization & Cost Arbitrage',
    description: 'Comprehensive evaluation for migrating enterprise GenAI workloads from OpenAI / Azure OpenAI to Google Gemini Enterprise on Vertex AI, covering prompt compatibility, long context, context caching, security, and agentic orchestration.',
    icon: 'HiSparkles',
    badge: 'GenAI Migration',
    color: '#8b5cf6',
    status: 'production',
    isPublished: true,
    isPromoted: true,
    createdBy: 'system',
    framework: {
      typeKey: 'openai_to_gemini_enterprise_migration',
      title: 'OpenAI to Gemini Enterprise Migration Assessment',
      subtitle: 'Enterprise GenAI Architecture Modernization & Cost Arbitrage',
      description: 'Evaluate technical feasibility, prompt migration, long-context window optimization, token cost arbitrage, VPC security, and multi-agent mesh for Google Gemini Enterprise.',
      icon: 'HiSparkles',
      badge: 'GenAI Migration',
      color: '#8b5cf6',
      targetRole: 'Chief AI Officers, Lead GenAI Engineers, Cloud Architects',
      estimatedMinutes: 15,
      dimensions: [
        {
          id: 'prompt_api_translation',
          name: 'Prompt & API Architecture Parity',
          description: 'Evaluates compatibility of prompt engineering, system instructions, function calling, and structured JSON outputs.',
          weight: 1,
          questions: [
            {
              id: 'api_01',
              text: 'How are prompt templates, system instructions, and JSON schemas structured across your GenAI applications?',
              guidance: 'Assess dependency on OpenAI-specific SDK conventions vs standard OpenAPI schemas and Google GenAI SDK.',
              options: [
                { value: 1, score: 1, label: 'Tightly coupled hardcoded OpenAI SDK calls with proprietary prompt formats and non-standard JSON parsing.' },
                { value: 2, score: 2, label: 'Partial abstraction via LangChain or custom wrappers, but heavy reliance on OpenAI-specific response structures.' },
                { value: 3, score: 3, label: 'Decoupled prompt management with standard OpenAPI JSON Schema validations and parameterized prompts.' },
                { value: 4, score: 4, label: 'Standardized model gateway with automated prompt translation, schema validation, and multi-model routing.' },
                { value: 5, score: 5, label: 'Fully autonomous GenAI platform with automated regression prompt testing, dynamic schema enforcement, and zero vendor lock-in.' }
              ],
              technicalPainPoints: [
                'Vendor-specific function calling syntax causing codebase refactoring friction',
                'Hardcoded OpenAI response object parsing across microservices',
                'Lack of automated regression tests for prompt migration'
              ],
              businessPainPoints: [
                'Inability to negotiate competitive multi-cloud LLM pricing',
                'Risk of vendor lock-in slowing down modernization initiatives',
                'Prolonged release cycles when upgrading model versions'
              ]
            },
            {
              id: 'api_02',
              text: 'How are tool definitions, structured function calling, and schema validations handled across microservices?',
              guidance: 'Review how tool schemas are serialized, invoked, and error-handled across backend LLM agents.',
              options: [
                { value: 1, score: 1, label: 'Manual string prompt parsing for tools without formal JSON schema declarations.' },
                { value: 2, score: 2, label: 'OpenAI-specific tool_choice parameters tightly bound to single endpoints.' },
                { value: 3, score: 3, label: 'Standardized JSON Schema tool definitions decoupled from underlying SDKs.' },
                { value: 4, score: 4, label: 'Centralized Model Context Protocol (MCP) server registry with automatic schema validation.' },
                { value: 5, score: 5, label: 'Dynamic zero-trust tool orchestration with automatic schema migration, sandboxing, and execution telemetry.' }
              ],
              technicalPainPoints: [
                'Tool schema drift breaking downstream application parsing',
                'Complex parameter transformations between OpenAI and Gemini function calling specs',
                'Lack of audit logging for tool invocations'
              ],
              businessPainPoints: [
                'Production outages caused by unexpected tool payload changes',
                'Slow developer velocity building agentic capabilities',
                'Security vulnerabilities from unvalidated function execution'
              ]
            }
          ]
        },
        {
          id: 'long_context_rag',
          name: 'Long-Context Windows vs Chunked RAG',
          description: 'Evaluates strategy for leveraging ultra-long context windows (1M–2M tokens) vs legacy chunked vector retrieval.',
          weight: 1,
          questions: [
            {
              id: 'ctx_01',
              text: 'What is your current strategy for leveraging ultra-long context windows (1M–2M tokens) vs legacy chunked RAG?',
              guidance: 'Evaluate whether complex vector chunking and brittle embedding retrieval can be simplified using Gemini native long-context.',
              options: [
                { value: 1, score: 1, label: 'Strict 8k-32k token limits forcing complex document chunking, metadata filters, and frequent retrieval failures.' },
                { value: 2, score: 2, label: 'Traditional vector DB retrieval with hybrid search, but significant maintenance overhead and context loss.' },
                { value: 3, score: 3, label: 'Hybrid approach using vector retrieval for large corpora and long-context windows for multi-document synthesis.' },
                { value: 4, score: 4, label: 'Extensive use of 1M+ token context windows with native Prompt Caching, reducing vector database complexity.' },
                { value: 5, score: 5, label: 'Full enterprise multimodal long-context pipeline with automated Context Caching, near-zero retrieval loss, and 80% cost savings.' }
              ],
              technicalPainPoints: [
                'Brittle vector chunking algorithms losing critical document context',
                'High maintenance overhead and latency for external vector databases',
                'Embedding model drift degrading retrieval accuracy over time'
              ],
              businessPainPoints: [
                'Inaccurate hallucinations in complex compliance and legal document analysis',
                'High infrastructure costs for dedicated vector database clusters',
                'Delayed user responses due to multi-hop RAG latency'
              ]
            },
            {
              id: 'ctx_02',
              text: 'How does your architecture handle multi-document synthesis, cross-referencing, and long-form audit trails?',
              guidance: 'Assess multi-document reasoning over entire codebases, technical manuals, or financial portfolios.',
              options: [
                { value: 1, score: 1, label: 'Single-document analysis only; cannot synthesize relationships across multiple source files.' },
                { value: 2, score: 2, label: 'Ad-hoc Map-Reduce summarization chains with high latency and context degradation.' },
                { value: 3, score: 3, label: 'Long-context document ingestion up to 128k tokens with basic citation tracking.' },
                { value: 4, score: 4, label: 'Full multi-file workspace ingestion into 1M token windows with exact line-level citation.' },
                { value: 5, score: 5, label: 'Real-time multi-modal synthesis (text, audio, video, diagrams) across millions of tokens with verified grounding.' }
              ],
              technicalPainPoints: [
                'Information loss across Map-Reduce summarization chains',
                'Inability to analyze complete code repositories or long recordings in a single pass',
                'High error rates in multi-hop query resolution'
              ],
              businessPainPoints: [
                'Missed critical cross-document compliance red flags',
                'Analyst burnout from manual verification of fragmented summaries',
                'Slower turnaround time on strategic business intelligence reports'
              ]
            }
          ]
        },
        {
          id: 'token_economics_caching',
          name: 'Token Economics & Cost Optimization',
          description: 'Assesses cost-per-query, Prompt Caching potential, batch inference, and rate limit quotas.',
          weight: 1,
          questions: [
            {
              id: 'cost_01',
              text: 'How actively does your team optimize GenAI token expenditures and leverage prompt caching or batch APIs?',
              guidance: 'Gemini offers native Context Caching with up to 75% cost reduction on cached input tokens.',
              options: [
                { value: 1, score: 1, label: 'Zero caching or rate tracking; full price paid on every prompt token with frequent unpredicted bill spikes.' },
                { value: 2, score: 2, label: 'Manual token usage monitoring with static monthly budgets, but no automated caching or batch pipelines.' },
                { value: 3, score: 3, label: 'Application-level caching for exact queries and basic non-real-time batch processing.' },
                { value: 4, score: 4, label: 'Automated Context Caching enabled for static system prompts and large document repositories with unit cost tracking.' },
                { value: 5, score: 5, label: 'Predictive token routing, dynamic caching across enterprise workloads, automated model tiering, and 70%+ TCO reduction.' }
              ],
              technicalPainPoints: [
                'Repetitive transmission of large system instructions wasting token budget',
                'Hitting aggressive API rate limits (TPM/RPM) during peak enterprise usage',
                'Lack of telemetry correlating token spend to specific user transactions'
              ],
              businessPainPoints: [
                'Skyrocketing operational GenAI costs threatening project profitability',
                'Unpredictable monthly invoice volatility causing budget disputes',
                'Inability to scale GenAI features to all enterprise end-users'
              ]
            },
            {
              id: 'cost_02',
              text: 'What is your model routing strategy across high-performance (Pro/Flash) and cost-optimized tiers?',
              guidance: 'Review automated routing between lightweight models (Gemini Flash) for classification and reasoning models (Gemini Pro) for complex analysis.',
              options: [
                { value: 1, score: 1, label: 'Single expensive flagship model used for all tasks, including trivial classification and extraction.' },
                { value: 2, score: 2, label: 'Manual developer selection of model tier per microservice without centralized cost governance.' },
                { value: 3, score: 3, label: 'Rule-based gateway routing simple queries to lightweight models and complex tasks to flagship models.' },
                { value: 4, score: 4, label: 'Dynamic LLM cascade/router that dynamically elevates queries only upon confidence thresholds.' },
                { value: 5, score: 5, label: 'Autonomous semantic router with real-time latency/cost optimization, batch processing offloading, and automated distillation.' }
              ],
              technicalPainPoints: [
                'Over-utilization of premium models for low-complexity formatting tasks',
                'Lack of automated failover or routing between model tiers',
                'High latency on user-facing applications due to oversized model invocation'
              ],
              businessPainPoints: [
                'Massive unnecessary cloud spend on commodity AI operations',
                'Slower application responsiveness degrading user conversion',
                'Inability to budget predictable cost-per-user margins'
              ]
            }
          ]
        },
        {
          id: 'security_governance_privacy',
          name: 'Enterprise Security, CMEK & Data Governance',
          description: 'Evaluates private networking (PSC), Customer-Managed Encryption Keys (CMEK), VPC controls, and zero training guarantees.',
          weight: 1,
          questions: [
            {
              id: 'sec_01',
              text: 'How are sensitive corporate data and customer prompts secured and isolated during model inference?',
              guidance: 'Review VPC Service Controls, Private Service Connect, CMEK encryption, and zero customer data retention.',
              options: [
                { value: 1, score: 1, label: 'Prompts sent over public internet endpoints with standard multi-tenant defaults and no custom encryption keys.' },
                { value: 2, score: 2, label: 'Basic TLS encryption and standard enterprise agreements, but without private networking or dedicated VPC perimeter.' },
                { value: 3, score: 3, label: 'Private endpoints configured with strict enterprise data protection agreements prohibiting model retraining.' },
                { value: 4, score: 4, label: 'Fully enclosed VPC Service Controls with Private Service Connect (PSC), audit logging, and automated PII redaction.' },
                { value: 5, score: 5, label: 'Zero-trust GenAI architecture with Customer-Managed Encryption Keys (CMEK), real-time safety guardrails, and compliance automation.' }
              ],
              technicalPainPoints: [
                'Risk of sensitive data leakage over public egress routes',
                'Lack of granular IAM policies for prompt and grounding datasets',
                'Complex compliance certification for multi-tenant SaaS LLMs'
              ],
              businessPainPoints: [
                'Enterprise infosec blocking GenAI adoption due to compliance concerns',
                'Severe regulatory fines under HIPAA, GDPR, or financial regulations',
                'Customer mistrust regarding data privacy and proprietary IP protection'
              ]
            },
            {
              id: 'sec_02',
              text: 'How are prompt injection attacks, sensitive PII leakage, and AI safety guardrails enforced in real time?',
              guidance: 'Assess real-time input/output content filtering, toxicity checks, automated PII scrubbing, and red-teaming protocols.',
              options: [
                { value: 1, score: 1, label: 'No automated safety filtering; reliance on default model behaviors with zero prompt injection defense.' },
                { value: 2, score: 2, label: 'Basic regex-based PII scrubbing before sending prompts to external APIs.' },
                { value: 3, score: 3, label: 'Configurable cloud provider safety filters enabled for toxicity, harassment, and harmful categories.' },
                { value: 4, score: 4, label: 'Comprehensive bidirectional guardrail layer detecting prompt jailbreaks, hallucination drift, and PII masking.' },
                { value: 5, score: 5, label: 'Adaptive Zero-Trust AI firewall with automated red-teaming evals, cryptographic audit trails, and instant policy enforcement.' }
              ],
              technicalPainPoints: [
                'Vulnerability to direct and indirect prompt injection attacks',
                'Accidental transmission of confidential customer PII in prompt logs',
                'Lack of real-time monitoring for toxic or hallucinated outputs'
              ],
              businessPainPoints: [
                'Severe brand and reputational damage from unvetted AI responses',
                'Legal liability from leaked proprietary or customer confidential data',
                'Executive hesitation to deploy customer-facing autonomous agents'
              ]
            }
          ]
        },
        {
          id: 'agentic_tool_mesh',
          name: 'Multi-Agent Mesh & Autonomous Tooling',
          description: 'Evaluates multi-agent orchestration, asynchronous task delegation, Model Context Protocol (MCP), and multimodal ingestion.',
          weight: 1,
          questions: [
            {
              id: 'agent_01',
              text: 'How does your platform orchestrate autonomous multi-agent workflows and asynchronous task delegation?',
              guidance: 'Review agent frameworks, state management, supervisor-worker hierarchies, and Model Context Protocol (MCP) integrations.',
              options: [
                { value: 1, score: 1, label: 'Single synchronous prompt-response chains with no agentic delegation or persistent memory.' },
                { value: 2, score: 2, label: 'Linear chain-of-thought scripts with rigid hardcoded step transitions and high failure rates.' },
                { value: 3, score: 3, label: 'Modular agent graph framework with retry mechanics, state persistence, and human-in-the-loop approvals.' },
                { value: 4, score: 4, label: 'Distributed multi-agent mesh with specialized supervisor agents, dynamic tool selection, and asynchronous execution.' },
                { value: 5, score: 5, label: 'Autonomous self-healing multi-agent ecosystem with Model Context Protocol (MCP), continuous evaluation, and real-time telemetry.' }
              ],
              technicalPainPoints: [
                'Agent hallucination loops and compounding errors across multi-step chains',
                'Lack of standardized protocol for connecting agents to enterprise data tools',
                'High latency and token waste from redundant agent deliberations'
              ],
              businessPainPoints: [
                'Inability to automate complex, end-to-end knowledge workflows',
                'High human supervision overhead negating automation efficiency gains',
                'Slow time-to-market for enterprise agentic product features'
              ]
            },
            {
              id: 'agent_02',
              text: 'What is your capability to process and ground multi-modal inputs (PDF diagrams, audio recordings, video feeds, spreadsheets)?',
              guidance: 'Evaluate native multimodal reasoning vs separate OCR/speech-to-text conversion pipelines.',
              options: [
                { value: 1, score: 1, label: 'Text-only processing; separate external OCR and transcription tools required with significant data loss.' },
                { value: 2, score: 2, label: 'Basic OCR for scanned PDFs, but inability to reason over complex tables, charts, or audio/video streams.' },
                { value: 3, score: 3, label: 'Hybrid pipeline supporting images and formatted PDFs alongside textual RAG.' },
                { value: 4, score: 4, label: 'Native multimodal ingestion across high-resolution PDFs, audio, video, and code repositories in a single model pass.' },
                { value: 5, score: 5, label: 'Unified enterprise multimodal intelligence engine with sub-second cross-modal search, grounding, and reasoning.' }
              ],
              technicalPainPoints: [
                'Brittle multi-tool pipelines converting PDFs and audio into imperfect text',
                'Loss of layout and spatial context in complex tabular documents and diagrams',
                'Massive latency penalty coordinating multiple specialized models'
              ],
              businessPainPoints: [
                'Inability to automate document-heavy workflows in insurance, legal, and healthcare',
                'High operational cost of maintaining multiple third-party conversion services',
                'Poor user experience when interacting with rich enterprise assets'
              ]
            }
          ]
        }
      ],
      maturityLevels: [
        { level: 1, name: 'Ad-hoc', label: 'Initial / Ad-hoc', scoreMin: 1, scoreMax: 1.9, color: '#ef4444', description: 'Hardcoded proprietary LLM calls, high token spend, zero caching, and brittle RAG architectures.' },
        { level: 2, name: 'Developing', label: 'Developing / Emerging', scoreMin: 2, scoreMax: 2.9, color: '#f59e0b', description: 'Early multi-model awareness, basic wrappers, partial caching experimentation, and standard security agreements.' },
        { level: 3, name: 'Standardized', label: 'Defined / Standardized', scoreMin: 3, scoreMax: 3.7, color: '#3b82f6', description: 'Decoupled prompt engineering, OpenAPI schema standards, private endpoint routing, and structured cost tracking.' },
        { level: 4, name: 'Optimized', label: 'Managed / Automated', scoreMin: 3.8, scoreMax: 4.5, color: '#10b981', description: 'Ultra-long context windows, automated Context Caching, VPC Service Controls, and robust multi-model governance.' },
        { level: 5, name: 'Transformative', label: 'Optimizing / Transformative', scoreMin: 4.6, scoreMax: 5, color: '#8b5cf6', description: 'Industry-leading GenAI platform on Gemini Enterprise with autonomous agentic routing, 75% cost reduction, and zero lock-in.' }
      ]
    }
  },
  {
    id: 'tpl_finops_cost',
    typeKey: 'finops_cloud_cost_optimization',
    title: 'FinOps & Cloud Cost Optimization Assessment',
    subtitle: 'Enterprise Cloud Financial Management & Unit Economics Framework',
    description: 'Evaluate your organization\'s capability to understand, optimize, and govern cloud and AI spend while driving maximum business value, unit margin accountability, and automated FinOps execution.',
    icon: 'FiTrendingUp',
    badge: 'FinOps',
    color: '#10b981',
    status: 'production',
    isPublished: true,
    isPromoted: true,
    createdBy: 'system',
    framework: {
      typeKey: 'finops_cloud_cost_optimization',
      title: 'FinOps & Cloud Cost Optimization Assessment',
      subtitle: 'Enterprise Cloud Financial Management & Unit Economics Framework',
      description: 'Comprehensive 5-dimension FinOps framework covering visibility & tagging, anomaly detection, commitment economics, storage lifecycle, and unit economics.',
      icon: 'FiTrendingUp',
      badge: 'FinOps',
      color: '#10b981',
      targetRole: 'FinOps Practitioners, Cloud Architects, Engineering Leadership, Finance Directors',
      estimatedMinutes: 15,
      dimensions: [
        {
          id: 'cost_visibility',
          name: 'Cost Visibility & Allocation Taxonomy',
          description: 'Mechanisms for tracking, tagging, and allocating cloud expenditure to business units, product squads, and Kubernetes containers.',
          weight: 1,
          questions: [
            {
              id: 'cva_01',
              text: 'How granular and automated is your organization\'s cloud resource tagging and cost allocation strategy?',
              guidance: 'Evaluate tagging policy enforcement, container/Kubernetes-level cost allocation, and showback accuracy.',
              options: [
                { value: 1, score: 1, label: 'Unallocated lump-sum invoices with minimal or no resource tagging (<20% coverage).' },
                { value: 2, score: 2, label: 'Basic account/subscription-level allocation with partial tagging (20-50%) and manual spreadsheets.' },
                { value: 3, score: 3, label: 'Standardized tagging taxonomy enforced across core services (>75% coverage) with monthly showback.' },
                { value: 4, score: 4, label: 'Automated policy enforcement for tagging (>90% coverage) with direct container cost allocation and showback.' },
                { value: 5, score: 5, label: 'Real-time, fully automated cost allocation (>98% coverage) with proportional shared-cost distribution and unit economics.' }
              ],
              technicalPainPoints: [
                'Untagged cloud resources causing untraceable monthly spend',
                'Shared Kubernetes cluster costs impossible to split between microservices',
                'Delayed billing data ingestion from cloud providers'
              ],
              businessPainPoints: [
                'Unexpected monthly cloud bill shocks and budget overruns',
                'Lack of accountability among product and engineering squads',
                'Inability to calculate accurate customer unit gross margins'
              ]
            },
            {
              id: 'cva_02',
              text: 'How automated is your multi-cloud billing data ingestion and monthly showback/chargeback reporting cadence?',
              guidance: 'Review daily billing data exports (FOCUS spec / BigQuery / CUR), automated normalization, and self-service showback portals.',
              options: [
                { value: 1, score: 1, label: 'Manual spreadsheet downloads once a month with no centralized reporting or squad visibility.' },
                { value: 2, score: 2, label: 'Static cloud console cost dashboards reviewed ad-hoc by finance with 15-day reporting lag.' },
                { value: 3, score: 3, label: 'Automated daily billing ingestion into a central warehouse with monthly departmental showback reports.' },
                { value: 4, score: 4, label: 'Automated daily showback dashboard mapped to engineering squads with FOCUS 1.0 schema normalization.' },
                { value: 5, score: 5, label: 'Real-time automated chargeback with direct budget accountability, self-service cost exploration, and executive KPI attribution.' }
              ],
              technicalPainPoints: [
                'Inconsistent billing schemas across AWS, GCP, and Azure requiring manual reconciliation',
                'High latency in billing data exports masking real-time runaway spend',
                'Lack of granular daily breakdown by team and application tier'
              ],
              businessPainPoints: [
                'Disputed inter-departmental chargebacks causing friction between engineering and finance',
                'Slow financial close cycles due to manual cloud invoice auditing',
                'Zero squad-level motivation to optimize infrastructure spend'
              ]
            }
          ]
        },
        {
          id: 'anomaly_rightsizing',
          name: 'Anomaly Detection & Continuous Rightsizing',
          description: 'Capabilities to detect runaway spend spikes and continuously optimize compute, storage, and database tiers.',
          weight: 1,
          questions: [
            {
              id: 'anom_01',
              text: 'How rapidly does your organization detect and remediate abnormal cloud cost spikes or unutilized resources?',
              guidance: 'Review automated ML anomaly detection alerts and automated decommissioning of orphaned disks/instances.',
              options: [
                { value: 1, score: 1, label: 'Cost spikes are discovered only when the invoice arrives 15-30 days after month-end.' },
                { value: 2, score: 2, label: 'Monthly manual budget reviews with static cloud provider email threshold alerts.' },
                { value: 3, score: 3, label: 'Automated daily anomaly detection alerts routed to team communication channels (Slack/Teams).' },
                { value: 4, score: 4, label: 'Near-real-time ML anomaly detection with automated root-cause attribution within hours.' },
                { value: 5, score: 5, label: 'Real-time telemetry-driven anomaly detection coupled with automated circuit breakers that throttle runaway jobs.' }
              ],
              technicalPainPoints: [
                'Infinite loop ETL scripts or runaway clusters generating thousands in spend overnight',
                'Alert fatigue from noisy, uncalibrated static budget alert thresholds',
                'Lengthy root-cause investigations correlating billing metrics back to commits'
              ],
              businessPainPoints: [
                'Unbudgeted quarterly budget overruns wiping out operational margins',
                'Erosion of executive trust in engineering cloud governance',
                'Reactive firefighting disrupting sprint product roadmap delivery'
              ]
            },
            {
              id: 'anom_02',
              text: 'How automated is the identification and rightsizing of over-provisioned VMs, idle clusters, and orphaned storage?',
              guidance: 'Assess 15-min auto-suspend cluster policies, automated disk cleanup, and serverless compute adoption.',
              options: [
                { value: 1, score: 1, label: 'Static infrastructure with no rightsizing; clusters run 24/7 regardless of actual utilization.' },
                { value: 2, score: 2, label: 'Periodic manual rightsizing reviews during annual budgeting cycles.' },
                { value: 3, score: 3, label: 'Automated recommendations generated by cloud tools with manual engineering sprint execution.' },
                { value: 4, score: 4, label: 'Automated idle resource termination (e.g. 15-min auto-suspend) and weekly rightsizing automation.' },
                { value: 5, score: 5, label: 'Fully autonomous rightsizing with continuous serverless scaling, spot/preemptible arbitrage, and zero idle waste.' }
              ],
              technicalPainPoints: [
                'Orphaned unattached disks and idle test databases accumulating silent recurring costs',
                'Over-provisioned memory and CPU buffers on non-production clusters',
                'Engineers ignoring manual rightsizing ticket backlogs'
              ],
              businessPainPoints: [
                'Wasted 20–40% of monthly cloud budget on non-productive computing power',
                'High carbon footprint and ESG inefficiency from unutilized cloud hardware',
                'Capital misallocation that could otherwise fund product innovation'
              ]
            }
          ]
        },
        {
          id: 'rate_optimization_commitments',
          name: 'Commitment Economics & Rate Optimization',
          description: 'Strategy for maximizing discount coverage through Reserved Instances (RIs), Savings Plans, Committed Use Discounts (CUDs), and DBU commitments.',
          weight: 1,
          questions: [
            {
              id: 'rate_01',
              text: 'What is your organization\'s coverage and utilization rate for commitment-based discounts (Savings Plans / RIs / CUDs)?',
              guidance: 'Evaluate baseline compute coverage (>75%), flexible multi-year discount strategies, and expiration tracking.',
              options: [
                { value: 1, score: 1, label: '100% on-demand pricing with zero commitment discounts or reserved instances.' },
                { value: 2, score: 2, label: 'Ad-hoc 1-year RI purchases for specific legacy servers (<40% baseline coverage).' },
                { value: 3, score: 3, label: 'Centralized commitment strategy achieving 60-75% compute coverage with quarterly reviews.' },
                { value: 4, score: 4, label: 'Portfolio of compute savings plans and flexible CUDs maintaining 75-90% coverage with automated utilization monitoring.' },
                { value: 5, score: 5, label: 'Dynamic algorithmic commitment portfolio management with automated secondary marketplace arbitrage (>92% coverage).' }
              ],
              technicalPainPoints: [
                'Rigid legacy instance reservations stranded after architectural migrations',
                'Lack of visibility into commitment expiration schedules causing surprise rate hikes',
                'Difficulty forecasting dynamic GenAI compute workloads for multi-year commitments'
              ],
              businessPainPoints: [
                'Paying 30–60% higher on-demand compute premiums across core production systems',
                'Unused commitment waste due to poor capacity forecasting',
                'Lack of financial engineering alignment between procurement and engineering'
              ]
            },
            {
              id: 'rate_02',
              text: 'How are SaaS and specialized data platform commitments (Databricks DBUs, Snowflake Credits, Vertex AI quotas) managed?',
              guidance: 'Assess multi-year pre-commit discounts, consumption draw-down forecasting, and burst rate controls.',
              options: [
                { value: 1, score: 1, label: 'Month-to-month list price billing with no enterprise discount schedule or consumption tracking.' },
                { value: 2, score: 2, label: 'Basic annual contract with manual draw-down monitoring by procurement.' },
                { value: 3, score: 3, label: 'Centralized contract management with monthly consumption burn-rate forecasting against commits.' },
                { value: 4, score: 4, label: 'Tiered enterprise commitment optimization with predictive draw-down alerts and multi-workload allocation.' },
                { value: 5, score: 5, label: 'Fully integrated consumption governance with real-time rate arbitrage, predictive contract re-negotiation, and 40%+ discount realization.' }
              ],
              technicalPainPoints: [
                'Unmonitored credit burn leading to early contract exhaustion and high overage rates',
                'Siloed contract negotiations across different business units forfeiting enterprise volume tiers',
                'No tooling to correlate SaaS platform consumption with underlying cloud infrastructure'
              ],
              businessPainPoints: [
                'Unexpected six-figure overage true-up bills at annual contract renewal',
                'Sub-optimal enterprise discount tiers due to fragmented vendor negotiations',
                'Inability to accurately forecast annual software and data platform CapEx/OpEx'
              ]
            }
          ]
        },
        {
          id: 'storage_lakehouse_lifecycle',
          name: 'Storage Lifecycle & Data Lakehouse Tiering',
          description: 'Techniques for managing data storage growth, table vacuuming, partition pruning, and automated cold storage tiering.',
          weight: 1,
          questions: [
            {
              id: 'stor_01',
              text: 'How automated is your object storage lifecycle policy (GCS / S3 / ADLS) and cold storage tiering strategy?',
              guidance: 'Review automated transitions to Nearline/Coldline/Glacier, non-current version deletion, and incomplete multipart upload cleanup.',
              options: [
                { value: 1, score: 1, label: 'All data retained indefinitely in standard hot storage with zero lifecycle policies or deletion rules.' },
                { value: 2, score: 2, label: 'Basic manual archiving of legacy project folders once every few years.' },
                { value: 3, score: 3, label: 'Standardized lifecycle policies moving data to cooler tiers after 90–180 days across major buckets.' },
                { value: 4, score: 4, label: 'Automated policy-driven tiering (Hot -> Cool -> Archive) with automated cleanup of incomplete uploads and old versions.' },
                { value: 5, score: 5, label: 'Intelligent access-tiering with zero-copy analytics, automated retention compliance enforcement, and 70% storage TCO reduction.' }
              ],
              technicalPainPoints: [
                'Storage volume growing exponentially year-over-year with unreferenced historical data',
                'Terabytes of orphaned multipart upload chunks accumulating silent billing charges',
                'Inconsistent bucket-level retention policies causing compliance risks'
              ],
              businessPainPoints: [
                'Rapidly ballooning monthly cloud storage bills with diminishing analytical utility',
                'Increased attack surface from unbounded, unmonitored historical data lakes',
                'High retrieval cost surprises when un-archiving bulk data for audits'
              ]
            },
            {
              id: 'stor_02',
              text: 'How consistently are Delta Lake / Apache Iceberg table maintenance operations (VACUUM, OPTIMIZE, partition pruning) automated?',
              guidance: 'Assess automated deletion of expired table snapshots, compaction of small files, and partition maintenance.',
              options: [
                { value: 1, score: 1, label: 'No open table format maintenance; uncompacted small files and expired snapshots persist forever.' },
                { value: 2, score: 2, label: 'Ad-hoc manual OPTIMIZE / VACUUM scripts run only when table query performance noticeably degrades.' },
                { value: 3, score: 3, label: 'Scheduled weekly maintenance jobs compacting files and vacuuming snapshots older than 30 days.' },
                { value: 4, score: 4, label: 'Automated serverless table maintenance pipelines optimizing layout (Z-Order/Liquid Clustering) and enforcing 7-day retention.' },
                { value: 5, score: 5, label: 'Self-tuning lakehouse engine with automated continuous compaction, zero-overhead time travel, and optimized physical layout.' }
              ],
              technicalPainPoints: [
                'Millions of small files (the "small file problem") causing 10x slower query performance and high metadata costs',
                'Accumulated historical snapshots consuming 50%+ of total lakehouse storage',
                'Table maintenance jobs failing due to cluster resource contention'
              ],
              businessPainPoints: [
                'Degraded BI dashboard refresh speeds frustrating business decision-makers',
                'Inflated query scan costs in serverless SQL engines due to lack of partition pruning',
                'High engineering maintenance overhead manually tuning database tables'
              ]
            }
          ]
        },
        {
          id: 'unit_economics_governance',
          name: 'Unit Economics & FinOps Culture',
          description: 'Ability to measure cost per business transaction, enforce CI/CD cost guardrails, and foster cultural accountability.',
          weight: 1,
          questions: [
            {
              id: 'gov_01',
              text: 'How mature is your organization\'s cloud unit economics capability (cost per active user, cost per query, cost per order)?',
              guidance: 'Evaluate correlation of cloud telemetry with business KPIs and gross margin impact modeling.',
              options: [
                { value: 1, score: 1, label: 'Cloud is treated as an undifferentiated overhead cost center with zero unit margin visibility.' },
                { value: 2, score: 2, label: 'Basic top-line metrics (total cloud spend vs company revenue) calculated quarterly in spreadsheets.' },
                { value: 3, score: 3, label: 'Key customer and product tier unit costs tracked monthly and shared with engineering managers.' },
                { value: 4, score: 4, label: 'Automated unit economic dashboards tracking cost per transaction/user embedded in product roadmap planning.' },
                { value: 5, score: 5, label: 'Real-time unit economic telemetry driving dynamic pricing, customer gross margin optimization, and automated resource quotas.' }
              ],
              technicalPainPoints: [
                'Inability to attribute backend pipeline costs to specific customer tenants or business events',
                'Disjointed telemetry between application logs, business analytics, and cloud billing',
                'Lack of real-time unit margin alerts when customer usage patterns change'
              ],
              businessPainPoints: [
                'Unknowingly servicing unprofitable customers with negative unit gross margins',
                'Inability to price complex enterprise SaaS tiers accurately',
                'Finance and engineering operating with conflicting priorities and metrics'
              ]
            },
            {
              id: 'gov_02',
              text: 'How integrated are shift-left cost estimates, CI/CD budget guardrails, and FinOps training across engineering teams?',
              guidance: 'Assess Infracost/Terraform PR cost checks, automated pipeline circuit breakers, and FinOps Foundation practitioner certifications.',
              options: [
                { value: 1, score: 1, label: 'Zero cost visibility during development; engineers deploy infrastructure without cost awareness.' },
                { value: 2, score: 2, label: 'Informal cost awareness through periodic all-hands presentations with no tooling integration.' },
                { value: 3, score: 3, label: 'Automated PR cost estimation comments in CI/CD (e.g. Infracost) with required manager sign-off for large changes.' },
                { value: 4, score: 4, label: 'Shift-left policy-as-code guardrails blocking unauthorized expensive resource deployment, with dedicated FinOps champions.' },
                { value: 5, score: 5, label: 'Comprehensive FinOps culture with gamified team efficiency metrics, automated circuit breakers, and continuous certification.' }
              ],
              technicalPainPoints: [
                'Accidental deployment of oversized instances ($10k+/mo) slipping past code reviews',
                'No automated pre-deployment cost checks in Terraform / CloudFormation pipelines',
                'Lack of automated feedback loops informing developers of the cost of their code'
              ],
              businessPainPoints: [
                'Cost overruns caught only weeks after production deployment rather than at code review',
                'High friction between DevOps, Finance, and Architecture teams',
                'Lack of engineering ownership for sustainable cloud architecture'
              ]
            }
          ]
        }
      ],
      maturityLevels: [
        { level: 1, name: 'Crawl', label: 'Initial / Crawl', scoreMin: 1, scoreMax: 1.9, color: '#ef4444', description: 'Monolithic IT overhead, zero tagging discipline, manual reactive cleanups, and frequent billing surprises.' },
        { level: 2, name: 'Walk', label: 'Developing / Walk', scoreMin: 2, scoreMax: 2.9, color: '#f59e0b', description: 'Basic tagging standards, monthly showback, initial commitment purchases, but siloed team processes.' },
        { level: 3, name: 'Run', label: 'Defined / Run', scoreMin: 3, scoreMax: 3.7, color: '#3b82f6', description: 'Centralized FinOps practice, automated anomaly alerts, regular rightsizing cadences, and monthly unit cost metrics.' },
        { level: 4, name: 'Fly', label: 'Managed / Fly', scoreMin: 3.8, scoreMax: 4.5, color: '#10b981', description: 'Shift-left CI/CD cost checks, real-time container cost allocation, high commitment coverage (>75%), and squad accountability.' },
        { level: 5, name: 'Transform', label: 'Optimizing / Transform', scoreMin: 4.6, scoreMax: 5, color: '#8b5cf6', description: 'Industry-leading autonomous optimization, unit economics driving pricing, and financial engineering as core culture.' }
      ]
    }
  },
  {
    id: 'f337cd53-dcc4-45e9-9650-4c96e05fa7e7',
    typeKey: 'cloud_security_zero_trust_architecture',
    title: 'Cloud Security & Zero Trust Architecture Readiness',
    subtitle: 'Enterprise Security Architecture & Compliance Framework',
    description: 'Evaluates enterprise maturity across Identity Governance (IAM/PAM), Network Micro-Segmentation, Data Protection/CMEK, DevSecOps/CSPM, and Automated SIEM/SOAR Incident Response.',
    icon: 'FiLock',
    badge: 'Security',
    color: '#06b6d4',
    status: 'production',
    isPublished: true,
    isPromoted: true,
    createdBy: 'system',
    createdAt: new Date().toISOString(),
    framework: {
      typeKey: 'cloud_security_zero_trust_architecture',
      title: 'Cloud Security & Zero Trust Architecture Readiness',
      subtitle: 'Enterprise Security Architecture & Compliance Framework',
      description: 'Evaluates enterprise maturity across Identity Governance (IAM/PAM), Network Micro-Segmentation, Data Protection/CMEK, DevSecOps/CSPM, and Automated SIEM/SOAR Incident Response.',
      icon: 'FiLock',
      badge: 'Security',
      color: '#06b6d4',
      targetRole: 'Security Architects, CISOs, Cloud SecOps Leads',
      estimatedMinutes: 15,
      dimensions: [
        {
          id: 'sec_dim_01',
          name: 'Identity Governance & Privileged Access (IAM/PAM)',
          description: 'Maturity of centralized IdP, adaptive MFA, just-in-time PAM elevation, and service account key rotation.',
          weight: 1.0,
          questions: [
            {
              id: 'sec_01',
              text: 'How are user and service identities authenticated, authorized, and governed across your multi-cloud estate?',
              guidance: 'Evaluate centralized SSO/IdP federation, conditional access, and passwordless authentication enforcement.',
              options: [
                { value: 1, score: 1, label: 'Siloed IAM per cloud account with long-lived static API keys and no centralized MFA enforcement.' },
                { value: 2, score: 2, label: 'Centralized SSO for human users, but unmanaged service account credentials and static secret sprawl in Git.' },
                { value: 3, score: 3, label: 'Mandatory adaptive MFA, centralized SCIM provisioning, and automated 90-day secret rotation.' },
                { value: 4, score: 4, label: 'Ephemeral Workload Identity Federation (OIDC) eliminating all static keys; risk-based conditional access.' },
                { value: 5, score: 5, label: 'Continuous adaptive Zero Trust authorization with AI anomaly detection, real-time token revocation, and passwordless biometric authentication.' }
              ],
              technicalPainPoints: [
                'Static credential leakage in developer repositories and CI/CD logs',
                'Lack of unified visibility into multi-cloud service account permissions'
              ],
              businessPainPoints: [
                'High vulnerability to credential compromise and unauthorized account takeover',
                'Compliance audit penalties across SOX, HIPAA, and ISO 27001'
              ]
            },
            {
              id: 'sec_02',
              text: 'What mechanisms control and audit privileged administrative access (PAM) to production environments?',
              guidance: 'Evaluate standing administrative privileges vs Just-in-Time (JIT) ephemeral role activation.',
              options: [
                { value: 1, score: 1, label: 'Permanent standing administrator privileges assigned directly to personal accounts.' },
                { value: 2, score: 2, label: 'Shared root/admin credentials managed in password managers with manual approval tickets.' },
                { value: 3, score: 3, label: 'Role-based access control (RBAC) with time-bound break-glass procedures for production changes.' },
                { value: 4, score: 4, label: 'Just-in-Time (JIT) elevation requiring dual peer approval, automatic expiration, and session recording.' },
                { value: 5, score: 5, label: 'Zero standing privileges (ZSP) architecture where infrastructure is entirely immutable and admin sessions are mathematically impossible.' }
              ],
              technicalPainPoints: [
                'Excessive standing privileges across legacy engineering teams',
                'Audit log gaps during urgent production break-glass incidents'
              ],
              businessPainPoints: [
                'Internal insider threat exposure and catastrophic unauthorized infrastructure modifications',
                'Inability to pass SOC 2 Type II strict access control criteria'
              ]
            }
          ]
        },
        {
          id: 'sec_dim_02',
          name: 'Network Micro-Segmentation & Boundary Defense',
          description: 'Zero Trust network topology, VPC service controls, mutual TLS (mTLS), and ingress/egress filtering.',
          weight: 1.0,
          questions: [
            {
              id: 'sec_03',
              text: 'How is network traffic segmented and inspected between microservices and data tiers?',
              guidance: 'Evaluate flat VPC networks vs service mesh micro-segmentation and VPC Service Controls.',
              options: [
                { value: 1, score: 1, label: 'Flat network architecture where internal systems trust all internal IP traffic without inspection.' },
                { value: 2, score: 2, label: 'Basic subnet isolation and security groups with open internal ports and broad CIDR ranges.' },
                { value: 3, score: 3, label: 'Strict Layer 4 network policies and private VPC peering with no public IP exposure on databases.' },
                { value: 4, score: 4, label: 'Service mesh with mutual TLS (mTLS) cryptographic encryption and Layer 7 micro-segmentation policies.' },
                { value: 5, score: 5, label: 'Hardware-enforced confidential computing perimeters (e.g. VPC Service Controls, Private Service Connect) preventing data exfiltration even under compromised credentials.' }
              ],
              technicalPainPoints: [
                'Lateral movement risk if a single edge container or VM is breached',
                'Complex firewall rule drift causing unexpected production connectivity outages'
              ],
              businessPainPoints: [
                'Exposure to major multi-tenant data spills and lateral ransomware propagation',
                'Customer contract breach for sensitive enterprise client data isolation'
              ]
            },
            {
              id: 'sec_04',
              text: 'How are outbound internet traffic and API calls restricted from production data workloads?',
              guidance: 'Evaluate egress proxies, DNS security, and data exfiltration guardrails.',
              options: [
                { value: 1, score: 1, label: 'Unrestricted direct internet access from all backend servers and database nodes.' },
                { value: 2, score: 2, label: 'NAT gateways with basic port blocking but unmonitored HTTP/HTTPS egress destinations.' },
                { value: 3, score: 3, label: 'Centralized egress firewall with domain allowlisting and DNS sinkholing for known malicious hosts.' },
                { value: 4, score: 4, label: 'Deep Packet Inspection (DPI) with automated Data Loss Prevention (DLP) inline proxies blocking sensitive exfiltration.' },
                { value: 5, score: 5, label: 'Air-gapped private endpoints exclusively; zero internet gateway attachment with cryptographic egress attestation.' }
              ],
              technicalPainPoints: [
                'Unmonitored outbound traffic enabling covert command-and-control communication',
                'Risk of developers streaming proprietary training data to unauthorized external SaaS APIs'
              ],
              businessPainPoints: [
                'Catastrophic IP theft and regulatory disclosure liabilities under GDPR/CCPA',
                'Massive forensic investigation costs following undetected exfiltration'
              ]
            }
          ]
        },
        {
          id: 'sec_dim_03',
          name: 'Data Protection, Encryption & Key Management (CMEK)',
          description: 'Cryptographic data protection at rest and in transit, Customer-Managed Encryption Keys (CMEK), and tokenization.',
          weight: 1.0,
          questions: [
            {
              id: 'sec_05',
              text: 'How is data encrypted and classified across databases, object storage, and streaming pipelines?',
              guidance: 'Evaluate default cloud-managed keys vs Customer-Managed Encryption Keys (CMEK) and Hardware Security Modules (HSM).',
              options: [
                { value: 1, score: 1, label: 'Unencrypted object stores and plaintext data in transit over internal HTTP endpoints.' },
                { value: 2, score: 2, label: 'Default cloud-provider encryption at rest; TLS 1.2+ for external traffic but internal plaintext.' },
                { value: 3, score: 3, label: 'Enforced TLS 1.3 across all tiers; centralized KMS key management with automated annual rotation.' },
                { value: 4, score: 4, label: 'Customer-Managed Encryption Keys (CMEK) with FIPS 140-3 Level 3 Cloud HSM and automated field-level column encryption.' },
                { value: 5, score: 5, label: 'Confidential Space / Enclave computing with hardware-encrypted memory and zero-knowledge format-preserving tokenization.' }
              ],
              technicalPainPoints: [
                'Key management operational complexity and risk of accidental data lockout',
                'Lack of automated discovery for unencrypted PII/PHI stored in legacy data lakes'
              ],
              businessPainPoints: [
                'Failure to meet sovereign banking and healthcare data residency regulations',
                'Loss of institutional trust and multi-million dollar regulatory fines'
              ]
            },
            {
              id: 'sec_06',
              text: 'What controls prevent unauthorized copying or downloading of sensitive datasets?',
              guidance: 'Evaluate DLP scanning, data masking, and dynamic pseudonymization.',
              options: [
                { value: 1, score: 1, label: 'Developers and analysts have direct raw CSV/Parquet export permissions to local workstations.' },
                { value: 2, score: 2, label: 'Written security policies prohibiting data export, but no technical enforcement or monitoring.' },
                { value: 3, score: 3, label: 'Dynamic data masking for PII fields and role-based download blocking in BI reporting tools.' },
                { value: 4, score: 4, label: 'Automated sensitive data classification engine (DLP) blocking downloads and alerting on abnormal bulk query volumes.' },
                { value: 5, score: 5, label: 'Clean room analytics environment with differential privacy where raw data never leaves secure VPC enclaves.' }
              ],
              technicalPainPoints: [
                'PII leakage into developer dev/test environments and unmanaged staging buckets',
                'Lack of automated lineage tracking for derived sensitive data exports'
              ],
              businessPainPoints: [
                'Insider data theft leading to public breach scandals',
                'Inability to serve regulated healthcare and government enterprise clients'
              ]
            }
          ]
        },
        {
          id: 'sec_dim_04',
          name: 'DevSecOps, CSPM & Infrastructure Posture',
          description: 'Automated SAST/DAST/SCA scanning, Cloud Security Posture Management (CSPM), and policy-as-code guardrails.',
          weight: 1.0,
          questions: [
            {
              id: 'sec_07',
              text: 'How are infrastructure drift and security misconfigurations detected and remediated across cloud accounts?',
              guidance: 'Evaluate periodic manual audits vs continuous Cloud Security Posture Management (CSPM) and auto-remediation.',
              options: [
                { value: 1, score: 1, label: 'Manual infrastructure provisioning in cloud web consoles with no misconfiguration auditing.' },
                { value: 2, score: 2, label: 'Basic Terraform/CloudFormation usage, but manual quarterly reviews for open security groups or public buckets.' },
                { value: 3, score: 3, label: 'Automated CSPM scanning with daily alert notifications sent to infrastructure engineering channels.' },
                { value: 4, score: 4, label: 'Real-time CSPM with automated policy-as-code guardrails blocking non-compliant PRs before deployment.' },
                { value: 5, score: 5, label: 'Autonomous self-healing security mesh that instantly auto-remediates drift (e.g. auto-closing public S3 buckets within 5 seconds).' }
              ],
              technicalPainPoints: [
                'Alert fatigue from hundreds of low-severity CSPM warnings without prioritization',
                'Shadow IT cloud accounts created outside standard Terraform pipelines'
              ],
              businessPainPoints: [
                'Accidental public bucket exposure leading to immediate cyber extortion and data leaks',
                'Extremely long Mean Time to Remediate (MTTR) critical infrastructure flaws'
              ]
            },
            {
              id: 'sec_08',
              text: 'How are container images, dependencies, and application source code secured throughout CI/CD?',
              guidance: 'Evaluate Software Bill of Materials (SBOM), container vulnerability scanning, and signed artifact attestation.',
              options: [
                { value: 1, score: 1, label: 'No automated scanning; developers deploy third-party public container images directly to production.' },
                { value: 2, score: 2, label: 'Basic npm audit / pip check in local terminals, but no automated CI/CD gating.' },
                { value: 3, score: 3, label: 'Automated SAST and container image scanning in CI/CD failing builds on Critical CVEs.' },
                { value: 4, score: 4, label: 'Cryptographic container image signing (Cosign/Sigstore) and mandatory SBOM generation for all deployed artifacts.' },
                { value: 5, score: 5, label: 'Zero-trust software supply chain (SLSA Level 3+) with admission controllers rejecting any unsigned or unverified binary.' }
              ],
              technicalPainPoints: [
                'Vulnerable open-source dependencies introducing zero-day exploits into production workloads',
                'Slow deployment pipelines delayed by false-positive security scanner alerts'
              ],
              businessPainPoints: [
                'Software supply chain attack vulnerability (SolarWinds/Log4j style vectors)',
                'Loss of security certifications required by tier-1 enterprise customers'
              ]
            }
          ]
        },
        {
          id: 'sec_dim_05',
          name: 'SIEM, Threat Detection & Automated SOAR Response',
          description: 'Centralized security telemetry, behavioral anomaly detection, and Security Orchestration, Automation & Response (SOAR).',
          weight: 1.0,
          questions: [
            {
              id: 'sec_09',
              text: 'How is security telemetry ingested, correlated, and analyzed across multi-cloud environments?',
              guidance: 'Evaluate siloed log files vs centralized cloud-native SIEM with behavioral analytics.',
              options: [
                { value: 1, score: 1, label: 'Fragmented logs stored in separate cloud consoles with no centralized correlation or search capability.' },
                { value: 2, score: 2, label: 'CloudTrail / Audit logs archived to cold object storage, but only queried during retrospective post-mortems.' },
                { value: 3, score: 3, label: 'Centralized SIEM streaming all VPC flow logs, IAM audit trails, and application events with rule-based alerting.' },
                { value: 4, score: 4, label: 'Next-Gen SIEM with Machine Learning User and Entity Behavior Analytics (UEBA) detecting compromised credentials in real-time.' },
                { value: 5, score: 5, label: 'Unified Threat Intelligence Lakehouse aggregating petabyte-scale security telemetry with sub-second AI graph threat hunting.' }
              ],
              technicalPainPoints: [
                'High log ingestion costs and query timeouts during critical active incident triage',
                'Inability to correlate multi-cloud identity events with underlying network flow anomalies'
              ],
              businessPainPoints: [
                'Excessive breach dwell time (industry avg 200+ days) allowing attackers full undetected lateral movement',
                'Severe regulatory non-compliance for mandatory 72-hour incident disclosure windows'
              ]
            },
            {
              id: 'sec_10',
              text: 'What automated incident response (SOAR) capabilities exist when active threats are detected?',
              guidance: 'Evaluate manual human triage vs automated playbooks (e.g. isolating compromised pods, revoking user sessions).',
              options: [
                { value: 1, score: 1, label: 'Fully manual on-call paging with no standardized runbooks or response scripts.' },
                { value: 2, score: 2, label: 'Documented PDF runbooks requiring manual engineer console logins to block compromised IPs or accounts.' },
                { value: 3, score: 3, label: 'Semi-automated response scripts triggered by on-call engineers via Slack / Microsoft Teams ChatOps.' },
                { value: 4, score: 4, label: 'Automated SOAR playbooks that instantly quarantine compromised containers, revoke IAM tokens, and capture forensic snapshots.' },
                { value: 5, score: 5, label: 'Autonomous AI-orchestrated defense mesh that dynamically alters network routing, rotates credentials, and traps attackers in deception environments.' }
              ],
              technicalPainPoints: [
                'Human response delays during off-hours allowing ransomware to encrypt entire storage tiers',
                'Risk of automated response scripts accidentally breaking critical customer-facing production services'
              ],
              businessPainPoints: [
                'Catastrophic operational downtime and business interruption during cybersecurity attacks',
                'Immense brand reputational damage from slow containment'
              ]
            }
          ]
        }
      ],
      maturityLevels: [
        { level: 1, name: 'Ad-hoc', label: 'Initial / Perimeter-Only', scoreMin: 1, scoreMax: 1.9, color: '#ef4444', description: 'Legacy perimeter mindset with flat internal networks, unmanaged keys, and manual reactive responses.' },
        { level: 2, name: 'Developing', label: 'Developing / Emerging', scoreMin: 2, scoreMax: 2.9, color: '#f59e0b', description: 'Basic SSO and scanning in place, but static secret sprawl, manual PAM, and fragmented security logging.' },
        { level: 3, name: 'Defined', label: 'Defined / Standardized', scoreMin: 3, scoreMax: 3.7, color: '#3b82f6', description: 'Enforced adaptive MFA, centralized KMS encryption, daily CSPM posture checks, and 24/7 SIEM monitoring.' },
        { level: 4, name: 'Managed', label: 'Managed / Automated Zero Trust', scoreMin: 3.8, scoreMax: 4.5, color: '#10b981', description: 'Just-in-Time elevation, mTLS micro-segmentation, CMEK, signed container supply chains, and automated SOAR playbooks.' },
        { level: 5, name: 'Optimizing', label: 'Optimizing / Continuous Autonomous Defense', scoreMin: 4.6, scoreMax: 5, color: '#8b5cf6', description: 'Zero standing privileges, confidential computing enclaves, AI threat graph hunting, and self-healing cloud security mesh.' }
      ]
    }
  },
  {
    id: 'tpl_ciso_ai_security',
    typeKey: 'ciso_enterprise_ai_security_shadow_gateway',
    title: 'CISO Enterprise AI Security & Shadow Gateway Assessment',
    subtitle: 'Zero-Trust AI Posture, Real-Time DLP & Regulatory Guardrails',
    description: 'Comprehensive evaluation of enterprise AI security posture, shadow AI containment, real-time PII/PHI masking, attribute-based access control (ABAC), Model Armor, and audit logging to unblock enterprise GenAI adoption.',
    icon: 'HiShieldCheck',
    badge: 'Security & CISO',
    color: '#0ea5e9',
    status: 'production',
    isPublished: true,
    isPromoted: true,
    createdBy: 'system',
    framework: {
      typeKey: 'ciso_enterprise_ai_security_shadow_gateway',
      title: 'CISO Enterprise AI Security & Shadow Gateway Assessment',
      subtitle: 'Zero-Trust AI Posture, Real-Time DLP & Regulatory Guardrails',
      description: 'Audit shadow AI exposure, centralized AI gateway architecture (Apigee + Model Armor), real-time DLP data masking, customer-managed encryption (CMEK/EKM), and immutable audit trails for EU AI Act / HIPAA / NIST compliance.',
      icon: 'HiShieldCheck',
      badge: 'Security & CISO',
      color: '#0ea5e9',
      targetRole: 'CISOs, Chief Risk Officers, Data Protection Officers, Security Architects',
      estimatedMinutes: 15,
      dimensions: [
        {
          id: 'ciso_dim_01',
          name: 'Shadow AI Discovery & Perimeter Defense',
          description: 'Evaluates visibility into unmanaged AI consumption, network perimeter controls, and private VPC isolation.',
          weight: 1.0,
          questions: [
            {
              id: 'ciso_01',
              text: 'How does your organization discover, monitor, and govern employee and developer traffic to external AI endpoints?',
              guidance: 'Evaluate visibility into shadow AI web usage vs centralized enterprise AI gateway interception.',
              options: [
                { value: 1, score: 1, label: 'Zero visibility; employees freely paste company data and code into consumer AI web platforms without controls.' },
                { value: 2, score: 2, label: 'CASB firewall domain blocking of popular AI URLs; no approved enterprise AI alternative provided to staff.' },
                { value: 3, score: 3, label: 'Approved corporate web sandbox available, but application API keys and developer tools remain unmonitored.' },
                { value: 4, score: 4, label: 'Centralized Enterprise AI Gateway (Apigee / Vertex) capturing 100% of internal developer and application AI traffic.' },
                { value: 5, score: 5, label: 'Automated shadow AI discovery across CI/CD and GitHub with dynamic token auto-revocation and continuous perimeter posture enforcement.' }
              ],
              technicalPainPoints: [
                'Unmanaged third-party browser extensions capturing proprietary code and prompts',
                'Hardcoded public OpenAI/Anthropic API keys leaked in code repositories',
                'Lack of visibility into which departments are sending data to external LLMs'
              ],
              businessPainPoints: [
                'Catastrophic corporate IP and source code leakage to third-party public models',
                'CISO blanket-blocking AI domains causing productivity loss and employee friction',
                'Severe regulatory non-compliance with data residency mandates'
              ]
            },
            {
              id: 'ciso_02',
              text: 'How are AI inference workloads isolated at the network and infrastructure level?',
              guidance: 'Evaluate public internet API calls vs private VPC Service Controls (VPC-SC) perimeters.',
              options: [
                { value: 1, score: 1, label: 'Inference traffic routed over public internet using shared multi-tenant SaaS endpoints.' },
                { value: 2, score: 2, label: 'Standard commercial API endpoints with vendor no-training terms, but accessible via public DNS.' },
                { value: 3, score: 3, label: 'Private IP interconnects configured with static firewall ingress rules and API gateway authentication.' },
                { value: 4, score: 4, label: 'VPC Service Controls (VPC-SC) perimeter preventing data exfiltration, combined with Customer-Managed Encryption Keys (CMEK).' },
                { value: 5, score: 5, label: 'Confidential Computing enclaves with hardware-level memory encryption and zero-trust mTLS verification per inference call.' }
              ],
              technicalPainPoints: [
                'Data in transit exposed to interception over public internet routes',
                'Inability to apply network perimeter boundaries around external SaaS LLMs',
                'Complex firewall routing rules slowing down developer onboarding'
              ],
              businessPainPoints: [
                'Failure to meet strict banking and defense sector network isolation standards',
                'Subpoena and third-party data access risks on public cloud endpoints'
              ]
            }
          ]
        },
        {
          id: 'ciso_dim_02',
          name: 'Real-Time DLP & Adversarial Defense',
          description: 'Evaluates real-time PII/PHI redaction, prompt injection defense, and cryptographic key management.',
          weight: 1.0,
          questions: [
            {
              id: 'ciso_03',
              text: 'How does your architecture prevent PII, PHI, financial records, or secrets from being transmitted to LLMs?',
              guidance: 'Evaluate post-hoc manual auditing vs inline real-time Cloud Data Loss Prevention (DLP) de-identification.',
              options: [
                { value: 1, score: 1, label: 'No automated filtering; users and backend services transmit raw customer data, SSNs, and credentials.' },
                { value: 2, score: 2, label: 'Basic client-side regex checks for emails and credit cards; easily bypassed by whitespace or formatting changes.' },
                { value: 3, score: 3, label: 'Asynchronous batch auditing flagging sensitive data leaks in log files hours after transmission.' },
                { value: 4, score: 4, label: 'Inline Cloud DLP streaming proxy de-identifying, masking, and tokenizing sensitive info before payloads reach models.' },
                { value: 5, score: 5, label: 'Cryptographic surrogate tokenization allowing LLMs to reason over masked entities and securely re-hydrating in authorized responses.' }
              ],
              technicalPainPoints: [
                'High false-positive rates in legacy regex sanitizers breaking legitimate application prompts',
                'High latency added by sequential synchronous DLP inspection proxies',
                'Unstructured PII inside uploaded PDF/image attachments bypassing text filters'
              ],
              businessPainPoints: [
                'Multimillion-dollar GDPR, HIPAA, and PCI-DSS compliance fines from leaked customer records',
                'Customer trust destruction following data leakage in AI-generated customer responses'
              ]
            },
            {
              id: 'ciso_04',
              text: 'What defenses are deployed against direct and indirect prompt injection, jailbreaks, and adversarial attacks?',
              guidance: 'Evaluate naive system prompt instructions vs dedicated Model Armor guardrails and embedding inspection.',
              options: [
                { value: 1, score: 1, label: 'Passive system instructions (e.g. "please do not reveal instructions"); zero adversarial filtering.' },
                { value: 2, score: 2, label: 'Static keyword blacklists blocking known phrases like "ignore previous instructions".' },
                { value: 3, score: 3, label: 'Secondary lightweight LLM classifier screening user prompts for malicious intent.' },
                { value: 4, score: 4, label: 'Model Armor & SAIF guardrails inspecting both user inputs and ingested RAG vector embeddings for indirect injection.' },
                { value: 5, score: 5, label: 'Real-time adaptive adversarial defense mesh with continuous red-teaming and automated zero-day signature distribution.' }
              ],
              technicalPainPoints: [
                'Indirect prompt injection embedded inside third-party web pages or uploaded documents hijacking agent execution',
                'Jailbreak attacks bypassing basic guardrails to extract backend database connection strings',
                'Latency overhead of multi-pass LLM safety classifiers'
              ],
              businessPainPoints: [
                'Unauthorized data manipulation and fraudulent transactions triggered via malicious prompts',
                'Severe brand and PR crises caused by toxic or unaligned model outputs'
              ]
            },
            {
              id: 'ciso_05',
              text: 'How are cryptographic keys managed for AI model storage, vector databases, and embeddings?',
              guidance: 'Evaluate cloud provider default keys vs Customer-Managed Encryption Keys (CMEK) and External Key Management (Cloud EKM).',
              options: [
                { value: 1, score: 1, label: 'Default cloud provider managed keys; customer has no visibility or control over key rotation.' },
                { value: 2, score: 2, label: 'Cloud KMS keys managed by customer inside the cloud platform, but without hardware root ownership.' },
                { value: 3, score: 3, label: 'Customer-Managed Encryption Keys (CMEK) applied to model weights, vector databases, and prompt caches.' },
                { value: 4, score: 4, label: 'External Key Management (Cloud EKM) storing cryptographic root keys in customer’s on-premises HSM.' },
                { value: 5, score: 5, label: 'Key Access Justification (KAJ) requiring automated cryptographic sign-off per inference invocation with full air-gapped sovereignty.' }
              ],
              technicalPainPoints: [
                'Complex key rotation procedures causing intermittent vector database downtime',
                'Latency overhead when verifying external HSM keys on high-throughput inference calls',
                'Fragmented key management policies across multi-cloud environments'
              ],
              businessPainPoints: [
                'Inability to pass financial regulatory audits requiring sovereign cryptographic key ownership',
                'Risk of cloud provider unauthorized data access under extraterritorial legal requests'
              ]
            }
          ]
        },
        {
          id: 'ciso_dim_03',
          name: 'Access Control & Delegated Agent Permissions',
          description: 'Evaluates pre-retrieval attribute-based access control (ABAC), fine-grained RAG filtering, and multi-agent tool scoping.',
          weight: 1.0,
          questions: [
            {
              id: 'ciso_06',
              text: 'How is user authorization and document-level permissioning enforced in GenAI RAG pipelines?',
              guidance: 'Evaluate shared vector databases vs pre-retrieval Attribute-Based Access Control (ABAC).',
              options: [
                { value: 1, score: 1, label: 'Unified global vector index; all users can retrieve and view all indexed company files and financial reports.' },
                { value: 2, score: 2, label: 'Siloed vector databases per department with manual, error-prone synchronization.' },
                { value: 3, score: 3, label: 'Post-retrieval filtering in application code, where unauthorized chunks are queried but discarded before display.' },
                { value: 4, score: 4, label: 'Pre-retrieval Attribute-Based Access Control (ABAC) applying Dataplex / IAM user tags directly into vector query filters.' },
                { value: 5, score: 5, label: 'Dynamic zero-trust authorization with automated classification inheritance and real-time security label enforcement in AI responses.' }
              ],
              technicalPainPoints: [
                'Post-retrieval filtering leaking sensitive document existence through metadata',
                'High indexing costs from duplicating shared enterprise documents into team-specific vector stores',
                'ACL permission sync lag when employees change roles or leave the company'
              ],
              businessPainPoints: [
                'Unauthorized employee access to executive salaries, M&A strategy, and board minutes via enterprise AI search',
                'Major insider trading and confidentiality breach exposure'
              ]
            },
            {
              id: 'ciso_07',
              text: 'How are permissions, credentials, and write privileges scoped for autonomous AI agents and tool integrations?',
              guidance: 'Evaluate global service accounts vs scoped user-delegated tokens (Model Context Protocol / OAuth).',
              options: [
                { value: 1, score: 1, label: 'Global admin service accounts with unrestricted read/write access across corporate databases and APIs.' },
                { value: 2, score: 2, label: 'Hardcoded API tokens in agent scripts; no human-in-the-loop validation for mutating actions.' },
                { value: 3, score: 3, label: 'Read-only tool access by default, with manual human approval prompts required for any write operation.' },
                { value: 4, score: 4, label: 'Scoped OAuth / MCP Tool Tokens executing with user’s down-scoped delegated permissions and automated policy boundaries.' },
                { value: 5, score: 5, label: 'Autonomous multi-signature approval mesh with automated risk scoring and transactional rollback capabilities for all agent actions.' }
              ],
              technicalPainPoints: [
                'Autonomous agents executing unintended database updates or deletions due to hallucinated parameters',
                'Over-privileged service accounts violating least-privilege principles',
                'Lack of granular auditing for multi-agent tool execution chains'
              ],
              businessPainPoints: [
                'Catastrophic production data corruption or unauthorized fund transfers initiated by autonomous agents',
                'Inability to assign legal liability for actions performed by AI agents'
              ]
            }
          ]
        },
        {
          id: 'ciso_dim_04',
          name: 'Auditability, Lineage & Model Governance',
          description: 'Evaluates immutable compliance audit trails, hallucination scoring, IP indemnification, and model lifecycle deprecation.',
          weight: 1.0,
          questions: [
            {
              id: 'ciso_08',
              text: 'How are AI prompt interactions, responses, and model metadata logged for legal and regulatory compliance?',
              guidance: 'Evaluate ephemeral logs vs immutable BigQuery compliance audit trails with cryptographic hashing.',
              options: [
                { value: 1, score: 1, label: 'Zero logging; no historical record of prompt inputs, generated outputs, or model versions.' },
                { value: 2, score: 2, label: 'Standard application text logs purged after 14–30 days with no search or audit indexing.' },
                { value: 3, score: 3, label: 'Centralized Cloud Logging capturing user ID, timestamp, and token counts (without full payload inspection).' },
                { value: 4, score: 4, label: 'Immutable BigQuery Compliance Audit Trail recording cryptographically hashed prompts, outputs, model versions, and safety scores.' },
                { value: 5, score: 5, label: 'Automated regulatory reporting engine continuously auditing interactions against EU AI Act, NIST AI RMF, and ISO 42001.' }
              ],
              technicalPainPoints: [
                'Massive log storage costs when saving full prompt and response payloads across high-volume applications',
                'Inability to execute fast forensic search across billions of historical AI interactions',
                'Risk of audit logs themselves containing unmasked PII'
              ],
              businessPainPoints: [
                'Inability to comply with legal e-discovery mandates or government regulatory inquiries',
                'Uninsurable liability under upcoming EU AI Act high-risk system compliance deadlines'
              ]
            },
            {
              id: 'ciso_09',
              text: 'How does your organization manage hallucination liability, factuality verification, and copyright risk?',
              guidance: 'Evaluate unverified generative text vs Google Grounding Attribution and enterprise copyright indemnification.',
              options: [
                { value: 1, score: 1, label: 'Unverified model generation presented as absolute fact with no grounding citations or disclaimer.' },
                { value: 2, score: 2, label: 'Generic prompt instructions asking the model to provide source URLs when possible.' },
                { value: 3, score: 3, label: 'Grounded Search against internal documents displaying clickable reference links.' },
                { value: 4, score: 4, label: 'Grounding Attribution Scoring rejecting responses below 90% confidence, backed by cloud vendor copyright indemnification.' },
                { value: 5, score: 5, label: 'Real-time multi-source factual verification mesh with automated legal citation generation and continuous calibration.' }
              ],
              technicalPainPoints: [
                'Model hallucinations generating plausible but completely fabricated regulatory or financial guidance',
                'Broken citation links pointing to deleted or outdated source documents',
                'Inability to mathematically quantify model confidence before returning text to end users'
              ],
              businessPainPoints: [
                'Direct legal liability and financial loss from users acting on hallucinated AI advice',
                'Copyright infringement lawsuits resulting from generative models reproducing training data verbatim'
              ]
            },
            {
              id: 'ciso_10',
              text: 'How are model versions, deprecation schedules, and model registry lifecycles governed across the enterprise?',
              guidance: 'Evaluate unpinned model tags vs formal 90-day deprecation governance with automated regression benchmarking.',
              options: [
                { value: 1, score: 1, label: 'Relying on generic ":latest" model endpoints that change unexpectedly and break production behavior.' },
                { value: 2, score: 2, label: 'Model versions pinned in application code, but tracked manually in static documentation.' },
                { value: 3, score: 3, label: 'Centralized Model Registry tracking active production endpoints and registered downstream consumers.' },
                { value: 4, score: 4, label: 'Formal model lifecycle governance with automated regression benchmarking and 90-day deprecation migration windows.' },
                { value: 5, score: 5, label: 'Continuous shadow deployment comparing candidate model versions against live traffic before automated zero-downtime promotion.' }
              ],
              technicalPainPoints: [
                'Upstream model vendor deprecations breaking production microservices with short notice',
                'Subtle behavioral drifts in newer model iterations degrading downstream parsing accuracy',
                'Lack of standardized staging environments for testing new model versions'
              ],
              businessPainPoints: [
                'Critical production outages caused by unexpected model API deprecations',
                'Prolonged engineering hold-ups when upgrading enterprise-wide AI systems'
              ]
            }
          ]
        }
      ],
      maturityLevels: [
        { level: 1, name: 'Ad-hoc', label: 'Initial / High Risk', scoreMin: 1, scoreMax: 1.9, color: '#ef4444', description: 'Unmonitored shadow AI, public API keys, zero PII masking, and broad un-scoped agent access.' },
        { level: 2, name: 'Developing', label: 'Developing / Reactive', scoreMin: 2, scoreMax: 2.9, color: '#f59e0b', description: 'Basic CASB blocking and regex filters, but static secrets, un-audited RAG stores, and manual triage.' },
        { level: 3, name: 'Defined', label: 'Defined / Standardized', scoreMin: 3, scoreMax: 3.7, color: '#3b82f6', description: 'Enterprise AI Gateway, approved sandbox, RBAC document permissions, and centralized logging in place.' },
        { level: 4, name: 'Managed', label: 'Managed / Zero-Trust AI', scoreMin: 3.8, scoreMax: 4.5, color: '#10b981', description: 'VPC-SC perimeter, inline Cloud DLP redaction, Model Armor guardrails, ABAC vector permissions, and CMEK/EKM.' },
        { level: 5, name: 'Optimizing', label: 'Optimizing / Continuous Autonomous Governance', scoreMin: 4.6, scoreMax: 5, color: '#8b5cf6', description: 'Confidential computing enclaves, surrogate tokenization, automated EU AI Act compliance auditing, and self-healing security mesh.' }
      ]
    }
  },
  {
    id: 'tpl_edw_lakehouse_bigquery',
    typeKey: 'edw_lakehouse_to_bigquery_modernization',
    title: 'Snowflake / Teradata / Databricks to BigQuery Lakehouse Modernization',
    subtitle: 'Open Storage (Iceberg), Predictable Slots & Zero-Egress Analytics',
    description: 'Comprehensive 10-question evaluation for modernizing legacy data warehouses (Teradata, Netezza, Snowflake, Databricks) to BigQuery + BigLake open lakehouse architecture with predictable Editions pricing and unified Dataplex governance.',
    icon: 'HiDatabase',
    badge: 'Lakehouse Modernization',
    color: '#2563eb',
    status: 'production',
    isPublished: true,
    isPromoted: true,
    createdBy: 'system',
    framework: {
      typeKey: 'edw_lakehouse_to_bigquery_modernization',
      title: 'Snowflake / Teradata / Databricks to BigQuery Lakehouse Modernization',
      subtitle: 'Open Storage (Iceberg), Predictable Slots & Zero-Egress Analytics',
      description: 'Assess table format standardization (Apache Iceberg / Delta), multi-cloud zero-egress querying (BigQuery Omni), BigQuery Editions reservation capacity, Dataplex catalog lineage, streaming CDC, and in-database ML.',
      icon: 'HiDatabase',
      badge: 'Lakehouse Modernization',
      color: '#2563eb',
      targetRole: 'Chief Data Officers, Enterprise Data Architects, Heads of Data Platform, VP of Infrastructure',
      estimatedMinutes: 15,
      dimensions: [
        {
          id: 'edw_dim_01',
          name: 'Open Storage & Multi-Cloud Federation',
          description: 'Evaluates open table format adoption (Apache Iceberg/Delta), multi-cloud zero-egress querying, and storage decoupling.',
          weight: 1.0,
          questions: [
            {
              id: 'edw_01',
              text: 'How are enterprise analytical tables formatted, stored, and shared across compute engines?',
              guidance: 'Evaluate proprietary warehouse formats vs universal open table formats (Apache Iceberg / Delta UniForm / BigLake).',
              options: [
                { value: 1, score: 1, label: 'Proprietary vendor storage formats locked inside a single data warehouse; duplicate copies exported as raw CSVs for other teams.' },
                { value: 2, score: 2, label: 'Siloed Parquet files in object storage alongside proprietary warehouse tables without unified cataloging.' },
                { value: 3, score: 3, label: 'Standardized on a single table format (Delta or Iceberg), but locked to a specific compute engine.' },
                { value: 4, score: 4, label: 'Universal Open Lakehouse (Apache Iceberg / Delta UniForm) queried zero-copy by BigQuery, Spark, and Trino simultaneously.' },
                { value: 5, score: 5, label: 'Autonomous storage tiering with automated compaction, vacuuming, and cross-cloud zero-copy data sharing via BigLake.' }
              ],
              technicalPainPoints: [
                'Double storage costs and pipeline overhead from maintaining duplicate copies in warehouse and data lake',
                'Vendor lock-in preventing modern AI engines from directly querying analytical tables',
                'Slow partition scanning and file listing overhead on petabyte-scale datasets'
              ],
              businessPainPoints: [
                'Exorbitant storage egress and proprietary warehouse licensing fees',
                'Inability to support cross-functional BI and ML initiatives from a single source of truth'
              ]
            },
            {
              id: 'edw_02',
              text: 'How does your platform query and analyze data distributed across multiple cloud providers (AWS, Azure, GCP)?',
              guidance: 'Evaluate expensive cross-cloud batch replication vs BigQuery Omni in-place federated execution.',
              options: [
                { value: 1, score: 1, label: 'Heavy daily cross-cloud batch data transfers incurring massive egress fees and latency.' },
                { value: 2, score: 2, label: 'Ad-hoc manual exports between AWS S3, Azure Blob, and GCP buckets when cross-cloud analysis is requested.' },
                { value: 3, score: 3, label: 'Scheduled ETL replication pipelines syncing key operational tables across clouds.' },
                { value: 4, score: 4, label: 'BigQuery Omni & BigLake executing distributed SQL queries in-place directly where data resides in AWS/Azure without egress.' },
                { value: 5, score: 5, label: 'Intelligent multi-cloud query planner pushing compute to remote storage regions and returning only aggregated result sets.' }
              ],
              technicalPainPoints: [
                'High cloud data egress bills and delayed sync schedules causing stale cross-cloud reporting',
                'Brittle cross-cloud replication scripts failing on network blips',
                'Complex credential management across cloud boundaries'
              ],
              businessPainPoints: [
                'Hundreds of thousands spent annually on cloud egress fees',
                'Delayed executive decision-making due to 24-hour cross-cloud data sync lags'
              ]
            }
          ]
        },
        {
          id: 'edw_dim_02',
          name: 'SQL Analytics Engine & Reservation FinOps',
          description: 'Evaluates compute autoscaling predictability, BigQuery Editions slot reservations, and semantic layer acceleration.',
          weight: 1.0,
          questions: [
            {
              id: 'edw_03',
              text: 'How are data warehouse compute costs, concurrency scaling, and budget predictability managed?',
              guidance: 'Evaluate unpredictable credit consumption vs BigQuery Editions baseline slot reservations with dynamic autoscaling.',
              options: [
                { value: 1, score: 1, label: 'Uncapped auto-scaling virtual warehouses burning volatile credits when unoptimized queries run.' },
                { value: 2, score: 2, label: 'Fixed warehouse sizes with manual resizing; frequent end-of-month budget overruns.' },
                { value: 3, score: 3, label: 'Departmental spend caps and auto-suspend timers (e.g. 5 mins) configured per warehouse cluster.' },
                { value: 4, score: 4, label: 'BigQuery Editions (Standard/Enterprise/Enterprise Plus) with committed baseline reservations and burst autoscaling.' },
                { value: 5, score: 5, label: 'Autonomous slot sharing across business units with predictive budget scaling and dynamic queue prioritization.' }
              ],
              technicalPainPoints: [
                'Rogue Cartesian join queries burning thousands of dollars in compute credits overnight',
                'Rigid cluster sizing forcing over-provisioning for peak morning hours',
                'Query queueing and timeouts under high user concurrency'
              ],
              businessPainPoints: [
                'Unpredictable monthly cloud data warehouse invoices blowing CFO budgets',
                'Inability to accurately forecast annual data platform expansion costs'
              ]
            },
            {
              id: 'edw_04',
              text: 'How does your analytical architecture handle executive BI dashboard concurrency and sub-second query latency?',
              guidance: 'Evaluate extract cubes vs governed in-memory BI acceleration (Looker / BigQuery BI Engine).',
              options: [
                { value: 1, score: 1, label: 'Long-running batch queries block interactive dashboards; executive reports take 30+ seconds to load.' },
                { value: 2, score: 2, label: 'Heavy reliance on periodic BI extracts and duplicate caching servers requiring constant maintenance.' },
                { value: 3, score: 3, label: 'Materialized database views refreshed on hourly schedules to support dashboard queries.' },
                { value: 4, score: 4, label: 'Governed Semantic Layer with BigQuery BI Engine delivering sub-second in-memory SQL acceleration without extracts.' },
                { value: 5, score: 5, label: 'Conversational BI powered by Gemini querying the unified semantic layer with natural language and sub-second visual rendering.' }
              ],
              technicalPainPoints: [
                'Dashboard refresh timeouts during Monday morning peak executive traffic',
                'Stale extracts causing discrepancy between operational database and BI dashboards',
                'High memory cache costs on standalone BI servers'
              ],
              businessPainPoints: [
                'Slow executive adoption due to sluggish dashboard performance',
                'Conflicting business metric definitions between Finance and Sales reports'
              ]
            }
          ]
        },
        {
          id: 'edw_dim_03',
          name: 'Data Governance, Lineage & Data Quality',
          description: 'Evaluates automated metadata cataloging, end-to-end data lineage, and automated data contracts via Dataplex.',
          weight: 1.0,
          questions: [
            {
              id: 'edw_05',
              text: 'How is data asset discovery, metadata tagging, and end-to-end column-level lineage managed across the data platform?',
              guidance: 'Evaluate manual wiki documentation vs automated Dataplex cataloging and pipeline lineage.',
              options: [
                { value: 1, score: 1, label: 'Tribal knowledge; no centralized documentation of tables, schema definitions, or data owners.' },
                { value: 2, score: 2, label: 'Static data dictionaries in spreadsheets or Confluence updated manually once a quarter.' },
                { value: 3, score: 3, label: 'Standalone metadata catalog requiring data engineers to manually register and document new tables.' },
                { value: 4, score: 4, label: 'Automated Dataplex Catalog and column-level lineage tracing data transformations from ingestion to BI dashboards.' },
                { value: 5, score: 5, label: 'Active metadata governance with automated data health scoring and automated impact analysis for proposed schema changes.' }
              ],
              technicalPainPoints: [
                'Engineers spending days trying to trace which upstream pipeline broke a downstream financial metric',
                'Proliferation of duplicate and zombie tables across development environments',
                'Lack of column-level lineage for sensitive compliance audits'
              ],
              businessPainPoints: [
                'Slow data discovery preventing analysts from building new revenue-generating reports',
                'Failure to satisfy regulatory data lineage requirements under BCBS 239 / GDPR'
              ]
            },
            {
              id: 'edw_06',
              text: 'How does your platform enforce data quality rules, detect schema drift, and prevent silent data corruption?',
              guidance: 'Evaluate end-user bug reports vs automated Dataplex data quality contracts and anomaly alerts.',
              options: [
                { value: 1, score: 1, label: 'No automated tests; data quality issues are discovered only after corrupted numbers reach executive dashboards.' },
                { value: 2, score: 2, label: 'Basic row count assertions executed manually before monthly financial closes.' },
                { value: 3, score: 3, label: 'dbt / SQL test assertions validating primary key uniqueness and null constraints during scheduled runs.' },
                { value: 4, score: 4, label: 'Automated Data Contracts & Dataplex Quality Rules blocking non-conforming data at the ingestion boundary.' },
                { value: 5, score: 5, label: 'AI-driven statistical profiling detecting subtle data distribution shifts and auto-quarantining anomalous batches.' }
              ],
              technicalPainPoints: [
                'Silent data corruption corrupting historical records without triggering pipeline errors',
                'Upstream schema migrations dropping columns and breaking all downstream dbt models',
                'High engineering burden maintaining thousands of custom SQL data validation scripts'
              ],
              businessPainPoints: [
                'Executive loss of trust in corporate analytics after publishing incorrect public financial figures',
                'Costly business errors resulting from automated algorithms acting on corrupted data'
              ]
            }
          ]
        },
        {
          id: 'edw_dim_04',
          name: 'Modern ELT, Real-Time CDC & In-Database AI',
          description: 'Evaluates declarative pipeline orchestration (Dataform/dbt), sub-second streaming CDC ingestion, and BigQuery ML AI integration.',
          weight: 1.0,
          questions: [
            {
              id: 'edw_07',
              text: 'How are data transformation pipelines (ELT) engineered, version-controlled, and deployed?',
              guidance: 'Evaluate monolithic stored procedures vs declarative Dataform/dbt pipelines with Git CI/CD.',
              options: [
                { value: 1, score: 1, label: 'Monolithic, 5,000-line stored procedures with no version control, testing, or rollback mechanisms.' },
                { value: 2, score: 2, label: 'SQL scripts version-controlled in Git, but executed via manual cron jobs and unmonitored scripts.' },
                { value: 3, score: 3, label: 'Orchestrated dbt / Dataform pipelines with staging environments and automated branch testing.' },
                { value: 4, score: 4, label: 'Serverless declarative pipelines with incremental materialized tables and automated CI/CD deployment.' },
                { value: 5, score: 5, label: 'Autonomous self-optimizing pipelines with dynamic resource allocation, automated query refactoring, and auto-healing retries.' }
              ],
              technicalPainPoints: [
                'Fragile legacy stored procedures that take weeks to safely modify or debug',
                'Long pipeline execution windows causing morning SLAs to be missed consistently',
                'Lack of staging and rollback environments for database schema updates'
              ],
              businessPainPoints: [
                'Massive technical debt slowing down the launch of new business analytics features',
                'High onboarding costs for new data engineers trying to understand undocumented SQL pipelines'
              ]
            },
            {
              id: 'edw_08',
              text: 'How is operational transactional data (Postgres, Oracle, SQL Server, SAP) ingested into the analytical lakehouse?',
              guidance: 'Evaluate batch nightly dumps vs real-time Change Data Capture (CDC) streaming via BigQuery Storage Write API.',
              options: [
                { value: 1, score: 1, label: 'Nightly full database dumps placing heavy read locks and performance penalties on production OLTP databases.' },
                { value: 2, score: 2, label: 'Timestamp-based polling queries running every 4 hours with high duplicate record risks.' },
                { value: 3, score: 3, label: 'Log-based CDC streaming into staging tables with hourly SQL merge operations.' },
                { value: 4, score: 4, label: 'Sub-second real-time streaming ingestion using BigQuery Storage Write API applying CDC mutations in real time.' },
                { value: 5, score: 5, label: 'Unified real-time event mesh seamlessly powering operational dashboards, fraud detection, and transactional microservices.' }
              ],
              technicalPainPoints: [
                'Production transactional database performance degradation caused by heavy analytical ETL queries',
                'Complex out-of-order CDC event handling causing data synchronization discrepancies',
                'High streaming ingestion costs on legacy warehouse architectures'
              ],
              businessPainPoints: [
                'Operations and fraud teams operating with 24-hour old stale data',
                'Lost revenue opportunities from inability to trigger real-time customer interventions'
              ]
            },
            {
              id: 'edw_09',
              text: 'How are machine learning models and generative AI functions integrated into your data warehouse workflow?',
              guidance: 'Evaluate exporting data to local notebooks vs in-database SQL AI functions (BigQuery ML + Gemini).',
              options: [
                { value: 1, score: 1, label: 'Data scientists export massive CSVs to local machines; zero operational ML or AI in the data warehouse.' },
                { value: 2, score: 2, label: 'Custom Python ETL jobs copying warehouse data to external ML platforms; complex separate deployment infrastructure.' },
                { value: 3, score: 3, label: 'Batch scoring pipelines running Python models externally and loading prediction tables back into the warehouse overnight.' },
                { value: 4, score: 4, label: 'Direct SQL AI Functions (BigQuery ML + Gemini) executing text embeddings, classification, and forecasting inside SQL queries.' },
                { value: 5, score: 5, label: 'Continuous real-time ML inference and vector search executed directly inside the SQL engine with automated model drift monitoring.' }
              ],
              technicalPainPoints: [
                '6-month cycle time to take a trained ML model from Jupyter notebook to production database scoring',
                'Complex ETL infrastructure required just to calculate vector embeddings for text columns',
                'High network egress latency and costs when moving data to external AI services'
              ],
              businessPainPoints: [
                'Missed AI business value due to long model deployment bottlenecks',
                'High overhead and specialized headcount required to maintain standalone ML infrastructure'
              ]
            },
            {
              id: 'edw_10',
              text: 'What automated migration tooling, SQL translation, and validation mechanisms are used for database modernization?',
              guidance: 'Evaluate manual line-by-line SQL rewrites vs BigQuery Migration Service automated translation and validation.',
              options: [
                { value: 1, score: 1, label: 'Fully manual line-by-line SQL and stored procedure rewrites by developers; high error rate.' },
                { value: 2, score: 2, label: 'Basic regex find-and-replace scripts for syntax differences, followed by extensive manual debugging.' },
                { value: 3, score: 3, label: 'Third-party migration consulting tools with semi-automated SQL dialect conversion.' },
                { value: 4, score: 4, label: 'BigQuery Migration Service with automated SQL dialect translation, schema mapping, and automated data comparison validation.' },
                { value: 5, score: 5, label: 'Autonomous AI-accelerated migration pipeline with automatic query performance optimization and zero-downtime dual-run validation.' }
              ],
              technicalPainPoints: [
                'Thousands of proprietary Teradata/Snowflake SQL dialect nuances breaking during migration',
                'Lack of automated tools to verify data consistency between legacy and new warehouse tables',
                'Prolonged dual-run periods with high operational overhead'
              ],
              businessPainPoints: [
                'Multi-year migration timelines causing project fatigue and executive budget re-evaluations',
                'Fear of business disruption delaying the transition away from expensive legacy vendors'
              ]
            }
          ]
        }
      ],
      maturityLevels: [
        { level: 1, name: 'Ad-hoc', label: 'Legacy / Siloed', scoreMin: 1, scoreMax: 1.9, color: '#ef4444', description: 'Locked in proprietary formats, volatile compute costs, no automated catalog, and manual stored procedures.' },
        { level: 2, name: 'Developing', label: 'Developing / Fragmented', scoreMin: 2, scoreMax: 2.9, color: '#f59e0b', description: 'Partial Parquet files, basic spend alerts, static metadata sheets, and batch nightly ETL dumps.' },
        { level: 3, name: 'Defined', label: 'Defined / Standardized', scoreMin: 3, scoreMax: 3.7, color: '#3b82f6', description: 'Single table format, departmental warehouse caps, standalone catalog, and orchestrated dbt pipelines.' },
        { level: 4, name: 'Managed', label: 'Managed / Modern Lakehouse', scoreMin: 3.8, scoreMax: 4.5, color: '#10b981', description: 'Universal Iceberg/BigLake, BigQuery Editions slot reservations, automated Dataplex lineage, and BigQuery ML.' },
        { level: 5, name: 'Optimizing', label: 'Optimizing / Autonomous Data Mesh', scoreMin: 4.6, scoreMax: 5, color: '#8b5cf6', description: 'Multi-cloud zero-egress Omni, conversational Looker BI, real-time CDC storage write API, and self-healing data mesh.' }
      ]
    }
  }
];

/**
 * Custom & Dynamic Assessment Repository
 * Handles persistent storage for AI-generated assessment frameworks (types)
 * and completed/in-progress assessment instances with dual PostgreSQL + file fallback.
 */
class CustomAssessmentRepository {
  constructor() {
    this.ensureStarterTemplates();
    this.ensureStarterInstances();
  }

  ensureStarterTemplates() {
    try {
      STARTER_PRODUCTION_TEMPLATES.forEach(tpl => {
        typesFileStore.set(tpl.typeKey, tpl);
      });
      console.log('✅ Synchronized 10-question production assessment starter templates in registry.');
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
            cloud_security_zero_trust_architecture: 'ConnectPlus Telecom',
            finops_cloud_cost_optimization: 'Nova Retail Group',
            openai_to_gemini_enterprise_migration: 'Quantum FinTech Global'
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
