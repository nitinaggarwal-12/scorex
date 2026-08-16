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
    description: 'Comprehensive evaluation for migrating enterprise GenAI workloads from OpenAI / Azure OpenAI to Google Gemini Enterprise on Vertex AI, covering prompt compatibility, long context, and token economics.',
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
      description: 'Evaluate technical feasibility, prompt migration, long-context window optimization, and cost arbitrage for migrating to Google Gemini Enterprise.',
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
            }
          ]
        },
        {
          id: 'security_governance_privacy',
          name: 'Enterprise Security, CMEK & Data Governance',
          description: 'Evaluates private networking (PSC), Customer-Managed Encryption Keys (CMEK), and zero training guarantees.',
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
    description: 'Evaluate your organization\'s capability to understand, optimize, and govern cloud and AI spend while driving maximum business value and unit margin accountability.',
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
      description: 'Comprehensive FinOps framework covering visibility, rightsizing, anomaly detection, rate commitments, and FinOps culture.',
      icon: 'FiTrendingUp',
      badge: 'FinOps',
      color: '#10b981',
      targetRole: 'FinOps Practitioners, Cloud Architects, Engineering Leadership, Finance Directors',
      estimatedMinutes: 15,
      dimensions: [
        {
          id: 'cost_visibility',
          name: 'Cost Visibility & Allocation',
          description: 'Mechanisms for tracking, tagging, and allocating cloud expenditure to business units and product squads.',
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
            }
          ]
        },
        {
          id: 'anomaly_rightsizing',
          name: 'Anomaly Detection & Rightsizing',
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
  }

  ensureStarterTemplates() {
    try {
      const existing = typesFileStore.getAll() || {};
      if (Object.keys(existing).length < 2) {
        STARTER_PRODUCTION_TEMPLATES.forEach(tpl => {
          typesFileStore.set(tpl.typeKey, tpl);
        });
        console.log('✅ Seeded production-ready assessment starter templates in registry.');
      }
    } catch (e) {
      console.warn('Could not seed starter templates:', e.message);
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
      const query = 'SELECT * FROM custom_assessment_types WHERE type_key = $1 OR id = $1';
      const result = await db.query(query, [typeKey]);
      if (result.rows.length === 0) {
        return typesFileStore.get(typeKey) || null;
      }
      return this.mapRowToType(result.rows[0]);
    } catch (error) {
      console.warn('PostgreSQL findAssessmentTypeByKey fallback to file store:', error.message);
      return typesFileStore.get(typeKey) || null;
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

      if (filters.customerName) {
        params.push(`%${filters.customerName}%`);
        query += ` AND customer_name ILIKE $${params.length}`;
      }
      if (filters.typeKey) {
        params.push(filters.typeKey);
        query += ` AND type_key = $${params.length}`;
      }
      query += ' ORDER BY created_at DESC';

      const result = await db.query(query, params);
      let items = result.rows.map(r => this.mapRowToInstance(r));
      if (items.length === 0) {
        items = Object.values(instancesFileStore.getAll() || {});
      }
      return items;
    } catch (error) {
      console.warn('PostgreSQL getAllInstances fallback to file store:', error.message);
      let all = Object.values(instancesFileStore.getAll() || {});
      if (filters.customerName) {
        const needle = filters.customerName.toLowerCase();
        all = all.filter(i => (i.customerName || '').toLowerCase().includes(needle));
      }
      if (filters.typeKey) {
        all = all.filter(i => i.typeKey === filters.typeKey);
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
      createdBy: row.created_by,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      completedAt: row.completed_at
    };
  }
}

module.exports = new CustomAssessmentRepository();
