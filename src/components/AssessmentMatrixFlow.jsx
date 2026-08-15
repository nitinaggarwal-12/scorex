import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ChevronRight, 
  ChevronDown, 
  Edit3, 
  Trash2, 
  Save, 
  HelpCircle, 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  Layers,
  Database,
  BarChart2,
  Cpu,
  Zap,
  ShieldCheck,
  Award
} from 'lucide-react';

// ==========================================================================
// 6-Pillar, 30-Dimension Generic Enterprise Questionnaire (ScoreX Framework)
// ==========================================================================
export const PILLARS_DATA = [
  {
    id: 'platform_governance',
    name: '1. Architecture & Platform',
    icon: Layers,
    emoji: '🧱',
    progress: '5/5 100%',
    isComplete: true,
    dimensions: [
      { id: 'dim_p1', name: 'Environment Architecture & Scalability', done: true },
      { id: 'dim_p2', name: 'Identity, Zero-Trust Security & RBAC', done: true },
      { id: 'dim_p3', name: 'Centralized Governance & Cataloging', done: true },
      { id: 'dim_p4', name: 'Observability, Telemetry & Lineage', done: true },
      { id: 'dim_p5', name: 'FinOps, Tokenomics & Compute Efficiency', done: true }
    ],
    questions: [
      {
        id: 'q_p1',
        title: 'How standardized and isolated are your enterprise environments across development, staging, and production?',
        dimName: 'Environment Architecture & Scalability',
        currentStateLevels: [
          '1. Explore: Manual, ad-hoc environment setup with no standardization',
          '2. Experiment: Basic environment separation (dev/prod), but inconsistent configurations',
          '3. Formalize: Standardized Infrastructure-as-Code (IaC) for all workspaces, consistent configurations',
          '4. Optimize: Self-service environment provisioning with automated governance and cost policies',
          '5. Transform: Platform engineering with dynamic ephemeral workspaces and continuous compliance'
        ],
        futureStateLevels: [
          '1. Explore: Manual, ad-hoc environment setup with no standardization',
          '2. Experiment: Basic environment separation (dev/prod), but inconsistent configurations',
          '3. Formalize: Standardized Infrastructure-as-Code (IaC) for all workspaces, consistent configurations',
          '4. Optimize: Self-service environment provisioning with automated governance and cost policies',
          '5. Transform: Platform engineering with dynamic ephemeral workspaces and continuous compliance'
        ],
        technicalPains: [
          'Inconsistent environment configurations across cloud regions',
          'Manual environment provisioning bottlenecks',
          'Poor workspace isolation causing noisy-neighbor issues',
          'Deployment consistency and configuration drift',
          'Resource contention and compute capacity limits'
        ],
        businessPains: [
          'Slow time-to-market for digital and AI capabilities',
          'High environment management and idle compute costs',
          'Engineering teams blocked waiting for workspace access',
          'Quality issues and regressions caused by environment differences',
          'Audit and compliance risks from undocumented infrastructure'
        ]
      },
      {
        id: 'q_p2',
        title: 'How are enterprise identities, RBAC, and zero-trust policies enforced across workspaces?',
        dimName: 'Identity, Zero-Trust Security & RBAC',
        currentStateLevels: [
          '1. Explore: Shared root/admin accounts and hardcoded credentials',
          '2. Experiment: Basic IAM roles with static service account keys',
          '3. Formalize: Centralized IdP federation (SSO / SCIM) with least-privilege RBAC',
          '4. Optimize: Just-In-Time (JIT) privileged access with automated credential rotation',
          '5. Transform: Continuous adaptive zero-trust posture with real-time risk assessment'
        ],
        futureStateLevels: [
          '1. Explore: Shared root/admin accounts and hardcoded credentials',
          '2. Experiment: Basic IAM roles with static service account keys',
          '3. Formalize: Centralized IdP federation (SSO / SCIM) with least-privilege RBAC',
          '4. Optimize: Just-In-Time (JIT) privileged access with automated credential rotation',
          '5. Transform: Continuous adaptive zero-trust posture with real-time risk assessment'
        ],
        technicalPains: [
          'Over-privileged service accounts and static tokens',
          'Manual credential rotation and certificate renewal overhead',
          'Lack of centralized audit trails across microservices',
          'Orphaned user access in legacy projects'
        ],
        businessPains: [
          'Audit failure risk during compliance reviews',
          'Privilege escalation vulnerabilities and data leak exposure',
          'Slow onboarding and offboarding for engineering staff'
        ]
      },
      {
        id: 'q_p3',
        title: 'How centralized is your metadata management, data cataloging, and automated compliance tagging?',
        dimName: 'Centralized Governance & Cataloging',
        currentStateLevels: [
          '1. Explore: Siloed data storage with no searchable metadata catalog',
          '2. Experiment: Decentralized wikis and spreadsheets tracking critical tables',
          '3. Formalize: Unified enterprise data catalog with automated schema discovery',
          '4. Optimize: Automated classification of PII/PHI with tag-based access control',
          '5. Transform: Active metadata graph driving autonomous policy orchestration'
        ],
        futureStateLevels: [
          '1. Explore: Siloed data storage with no searchable metadata catalog',
          '2. Experiment: Decentralized wikis and spreadsheets tracking critical tables',
          '3. Formalize: Unified enterprise data catalog with automated schema discovery',
          '4. Optimize: Automated classification of PII/PHI with tag-based access control',
          '5. Transform: Active metadata graph driving autonomous policy orchestration'
        ],
        technicalPains: [
          'Manual metadata entry and stale dictionary documentation',
          'No automated PII/PHI detection across unstructured data',
          'Fragmented catalogs across on-premises and multi-cloud systems'
        ],
        businessPains: [
          'Regulatory penalties for unclassified sensitive data',
          'Data scientists wasting 40%+ of time searching for data assets',
          'Inability to prove regulatory compliance across data pipelines'
        ]
      },
      {
        id: 'q_p4',
        title: 'How comprehensive is your pipeline observability, end-to-end data lineage, and anomaly alerting?',
        dimName: 'Observability, Telemetry & Lineage',
        currentStateLevels: [
          '1. Explore: Reactive debugging from user error reports with no central logs',
          '2. Experiment: Component-level logs stored in local files or separate dashboards',
          '3. Formalize: Centralized log aggregation with automated error alerts and metrics',
          '4. Optimize: Full column-level data lineage and proactive anomaly detection',
          '5. Transform: Self-healing operations with automated root cause diagnosis'
        ],
        futureStateLevels: [
          '1. Explore: Reactive debugging from user error reports with no central logs',
          '2. Experiment: Component-level logs stored in local files or separate dashboards',
          '3. Formalize: Centralized log aggregation with automated error alerts and metrics',
          '4. Optimize: Full column-level data lineage and proactive anomaly detection',
          '5. Transform: Self-healing operations with automated root cause diagnosis'
        ],
        technicalPains: [
          'Blind spots in distributed multi-agent workflows',
          'Alert fatigue from noisy, uncalibrated thresholds',
          'Lack of backward and forward data lineage graphs'
        ],
        businessPains: [
          'Prolonged outages impacting critical business decisions',
          'SLA breaches and customer trust degradation',
          'Expensive manual troubleshooting hours'
        ]
      },
      {
        id: 'q_p5',
        title: 'How effectively do you track, attribute, and optimize cloud compute and foundation model costs?',
        dimName: 'FinOps, Tokenomics & Compute Efficiency',
        currentStateLevels: [
          '1. Explore: Aggregated cloud bills with no workload-level cost breakdown',
          '2. Experiment: Periodic manual invoice reviews and static budget caps',
          '3. Formalize: Tag-based cost allocation mapped to departments and workloads',
          '4. Optimize: Real-time unit cost tracking (cost-per-token / cost-per-query) with autoscaling',
          '5. Transform: Predictive cost optimization with dynamic model routing and spot arbitrage'
        ],
        futureStateLevels: [
          '1. Explore: Aggregated cloud bills with no workload-level cost breakdown',
          '2. Experiment: Periodic manual invoice reviews and static budget caps',
          '3. Formalize: Tag-based cost allocation mapped to departments and workloads',
          '4. Optimize: Real-time unit cost tracking (cost-per-token / cost-per-query) with autoscaling',
          '5. Transform: Predictive cost optimization with dynamic model routing and spot arbitrage'
        ],
        technicalPains: [
          'Uncontrolled GPU/compute idle spend during experimentation',
          'No token usage rate-limiting per tenant or department',
          'Complex multi-cloud billing reconciliation'
        ],
        businessPains: [
          'Unexpected budget overruns halting AI initiatives',
          'Inability to calculate unit ROI on generative use cases',
          'Finance friction blocking infrastructure expansion'
        ]
      }
    ]
  },
  {
    id: 'data_engineering',
    name: '2. Data Engineering & Pipelines',
    icon: Database,
    emoji: '💾',
    progress: '5/5 100%',
    isComplete: true,
    dimensions: [
      { id: 'dim_d1', name: 'High-Throughput Batch & Real-Time CDC Ingestion', done: true },
      { id: 'dim_d2', name: 'Automated Data Quality & Contract Enforcement', done: true },
      { id: 'dim_d3', name: 'Declarative Transformations & DAG Orchestration', done: true },
      { id: 'dim_d4', name: 'Storage Optimization & Open Table Formats', done: true },
      { id: 'dim_d5', name: 'Self-Healing Resilience & Schema Evolution', done: true }
    ],
    questions: [
      {
        id: 'q_d1',
        title: 'How mature are your streaming and batch data ingestion pipelines?',
        dimName: 'High-Throughput Batch & Real-Time CDC Ingestion',
        currentStateLevels: [
          '1. Explore: Ad-hoc manual file uploads and custom script-based dumps',
          '2. Experiment: Scheduled cron batch jobs with frequent unmonitored breaks',
          '3. Formalize: Automated declarative pipelines with Change Data Capture (CDC)',
          '4. Optimize: Unified real-time streaming with automated backpressure handling',
          '5. Transform: Autonomous self-healing data ingestion mesh with automated contract enforcement'
        ],
        futureStateLevels: [
          '1. Explore: Ad-hoc manual file uploads and custom script-based dumps',
          '2. Experiment: Scheduled cron batch jobs with frequent unmonitored breaks',
          '3. Formalize: Automated declarative pipelines with Change Data Capture (CDC)',
          '4. Optimize: Unified real-time streaming with automated backpressure handling',
          '5. Transform: Autonomous self-healing data ingestion mesh with automated contract enforcement'
        ],
        technicalPains: [
          'Fragile batch pipeline failures requiring manual reruns',
          'High ingestion latency for downstream analytics tables',
          'Connector maintenance debt across disparate source databases'
        ],
        businessPains: [
          'Business stakeholders relying on stale, out-of-date data',
          'High engineering maintenance overhead (toil)',
          'Delayed customer reporting and insights'
        ]
      },
      {
        id: 'q_d2',
        title: 'How are data quality constraints and pipeline SLAs validated across production datasets?',
        dimName: 'Automated Data Quality & Contract Enforcement',
        currentStateLevels: [
          '1. Explore: No validation checks; data errors discovered by end users',
          '2. Experiment: Ad-hoc SQL assertions run manually after incidents',
          '3. Formalize: Automated schema and null checks integrated into CI/CD pipelines',
          '4. Optimize: Circuit-breaker pipelines that quarantine bad records without failing jobs',
          '5. Transform: ML-driven anomaly detection with automated data reconciliation'
        ],
        futureStateLevels: [
          '1. Explore: No validation checks; data errors discovered by end users',
          '2. Experiment: Ad-hoc SQL assertions run manually after incidents',
          '3. Formalize: Automated schema and null checks integrated into CI/CD pipelines',
          '4. Optimize: Circuit-breaker pipelines that quarantine bad records without failing jobs',
          '5. Transform: ML-driven anomaly detection with automated data reconciliation'
        ],
        technicalPains: [
          'Silent data corruption corrupting downstream model weights',
          'Lack of automated data testing in staging environments',
          'No automated quarantine or dead-letter queues'
        ],
        businessPains: [
          'Loss of executive trust in core dashboards and metrics',
          'Incorrect regulatory reporting submissions',
          'Costly business decisions based on flawed datasets'
        ]
      },
      {
        id: 'q_d3',
        title: 'How are complex multi-step data transformations orchestrated and scheduled across pipelines?',
        dimName: 'Declarative Transformations & DAG Orchestration',
        currentStateLevels: [
          '1. Explore: Independent cron jobs with hardcoded sleep intervals',
          '2. Experiment: Basic workflow schedulers with rigid time-based dependencies',
          '3. Formalize: Modern declarative DAG orchestration with dependency graphs',
          '4. Optimize: Event-driven execution triggered dynamically upon data arrival',
          '5. Transform: Serverless autonomous pipeline orchestration with dynamic resource tuning'
        ],
        futureStateLevels: [
          '1. Explore: Independent cron jobs with hardcoded sleep intervals',
          '2. Experiment: Basic workflow schedulers with rigid time-based dependencies',
          '3. Formalize: Modern declarative DAG orchestration with dependency graphs',
          '4. Optimize: Event-driven execution triggered dynamically upon data arrival',
          '5. Transform: Serverless autonomous pipeline orchestration with dynamic resource tuning'
        ],
        technicalPains: [
          'Cascading pipeline failures caused by timing misalignments',
          'Difficult rollback mechanisms during pipeline version updates',
          'Rigid orchestration architectures that do not scale'
        ],
        businessPains: [
          'Lengthy maintenance windows preventing 24/7 operations',
          'Missed operational deadlines and delayed insights',
          'High engineering on-call burden'
        ]
      },
      {
        id: 'q_d4',
        title: 'How are lakehouse storage layers, partitioning, and open table formats (Parquet/Iceberg/Delta) managed?',
        dimName: 'Storage Optimization & Open Table Formats',
        currentStateLevels: [
          '1. Explore: Raw unstructured files dumped in object storage with no partitioning',
          '2. Experiment: Basic file partitioning with occasional manual compaction',
          '3. Formalize: Standardized open table formats with automated ACID transactions',
          '4. Optimize: Automated time-travel queries, file clustering, and vacuum policies',
          '5. Transform: Universal storage tiering with cross-cloud zero-copy data virtualization'
        ],
        futureStateLevels: [
          '1. Explore: Raw unstructured files dumped in object storage with no partitioning',
          '2. Experiment: Basic file partitioning with occasional manual compaction',
          '3. Formalize: Standardized open table formats with automated ACID transactions',
          '4. Optimize: Automated time-travel queries, file clustering, and vacuum policies',
          '5. Transform: Universal storage tiering with cross-cloud zero-copy data virtualization'
        ],
        technicalPains: [
          'Small file problem degrading analytical query speeds',
          'No transactional consistency during concurrent writes',
          'Vendor-locked proprietary storage formats'
        ],
        businessPains: [
          'Exploding storage and query compute costs',
          'Inability to audit historical data states (time travel)',
          'Slow analytical performance impacting business velocity'
        ]
      },
      {
        id: 'q_d5',
        title: 'How do pipelines handle schema evolution, breaking changes, and automated recovery?',
        dimName: 'Self-Healing Resilience & Schema Evolution',
        currentStateLevels: [
          '1. Explore: Upstream schema changes immediately break all downstream jobs',
          '2. Experiment: Manual pipeline edits and schema migration scripts required',
          '3. Formalize: Automated additive schema evolution with schema registry validation',
          '4. Optimize: Automated backward-compatible transformations with alerting',
          '5. Transform: Autonomous self-healing pipelines that adapt to upstream mutations dynamically'
        ],
        futureStateLevels: [
          '1. Explore: Upstream schema changes immediately break all downstream jobs',
          '2. Experiment: Manual pipeline edits and schema migration scripts required',
          '3. Formalize: Automated additive schema evolution with schema registry validation',
          '4. Optimize: Automated backward-compatible transformations with alerting',
          '5. Transform: Autonomous self-healing pipelines that adapt to upstream mutations dynamically'
        ],
        technicalPains: [
          'Frequent emergency hotfixes when external API schemas mutate',
          'Data type mismatch errors during batch ingestion',
          'Lack of automated schema diffing tools'
        ],
        businessPains: [
          'Sudden data outages halting client-facing features',
          'Developers distracted from roadmap feature development',
          'Reputational harm from broken downstream analytics'
        ]
      }
    ]
  },
  {
    id: 'analytics_bi',
    name: '3. Analytics & Semantic Layer',
    icon: BarChart2,
    emoji: '📊',
    progress: '5/5 100%',
    isComplete: true,
    dimensions: [
      { id: 'dim_a1', name: 'Governed Metric Stores & Unified Semantic Layer', done: true },
      { id: 'dim_a2', name: 'Self-Service Conversational BI & NL-to-SQL', done: true },
      { id: 'dim_a3', name: 'Real-Time Analytics & Low-Latency Query Acceleration', done: true },
      { id: 'dim_a4', name: 'Cross-Department Data Sharing & Clean Rooms', done: true },
      { id: 'dim_a5', name: 'Executive Decision Intelligence & Predictive Scoring', done: true }
    ],
    questions: [
      {
        id: 'q_a1',
        title: 'How standardized and centralized are your business definitions, KPIs, and semantic metric layers?',
        dimName: 'Governed Metric Stores & Unified Semantic Layer',
        currentStateLevels: [
          '1. Explore: Different teams define conflicting revenue and churn metrics in separate SQL files',
          '2. Experiment: Business glossary written in documentation but not enforced in SQL tools',
          '3. Formalize: Centralized semantic layer defining single source of truth for all KPIs',
          '4. Optimize: Version-controlled metric store consumed dynamically by all BI and AI tools',
          '5. Transform: AI-orchestrated semantic fabric that detects and flags metric drift autonomously'
        ],
        futureStateLevels: [
          '1. Explore: Different teams define conflicting revenue and churn metrics in separate SQL files',
          '2. Experiment: Business glossary written in documentation but not enforced in SQL tools',
          '3. Formalize: Centralized semantic layer defining single source of truth for all KPIs',
          '4. Optimize: Version-controlled metric store consumed dynamically by all BI and AI tools',
          '5. Transform: AI-orchestrated semantic fabric that detects and flags metric drift autonomously'
        ],
        technicalPains: [
          'Duplicated business logic scattered across BI tools and dashboards',
          'No programmatic API for AI agents to query governed metrics',
          'Heavy compute waste from recalculating redundant aggregations'
        ],
        businessPains: [
          'Executive meetings wasted debating whose numbers are correct',
          'Inconsistent customer metrics across sales, marketing, and finance',
          'Slow decision-making due to lack of metric confidence'
        ]
      },
      {
        id: 'q_a2',
        title: 'How accessible is self-service conversational analytics and natural-language querying for business users?',
        dimName: 'Self-Service Conversational BI & NL-to-SQL',
        currentStateLevels: [
          '1. Explore: All reports require specialized data engineers writing custom SQL',
          '2. Experiment: Drag-and-drop dashboard templates with limited drill-down capability',
          '3. Formalize: Self-service dashboards with guided filters and verified query templates',
          '4. Optimize: Natural language AI assistants generating verified SQL on governed schemas',
          '5. Transform: Autonomous proactive intelligence delivering continuous insights without prompts'
        ],
        futureStateLevels: [
          '1. Explore: All reports require specialized data engineers writing custom SQL',
          '2. Experiment: Drag-and-drop dashboard templates with limited drill-down capability',
          '3. Formalize: Self-service dashboards with guided filters and verified query templates',
          '4. Optimize: Natural language AI assistants generating verified SQL on governed schemas',
          '5. Transform: Autonomous proactive intelligence delivering continuous insights without prompts'
        ],
        technicalPains: [
          'AI SQL generators hallucinating table joins and column names',
          'Lack of semantic metadata grounding for LLM queries',
          'Security risks from unconstrained ad-hoc SQL generation'
        ],
        businessPains: [
          'Data team swamped with basic reporting requests (ticket backlog)',
          'Business users blocked waiting days for urgent data queries',
          'Low analytics adoption across non-technical departments'
        ]
      },
      {
        id: 'q_a3',
        title: 'How do you optimize analytical query performance for sub-second dashboards and interactive drill-downs?',
        dimName: 'Real-Time Analytics & Low-Latency Query Acceleration',
        currentStateLevels: [
          '1. Explore: Slow queries scanning full datasets with 30s+ response times',
          '2. Experiment: Static summary tables refreshed once nightly',
          '3. Formalize: Automated materialized views and columnar caching',
          '4. Optimize: Intelligent query acceleration with adaptive indexing and memory tiering',
          '5. Transform: Sub-second interactive OLAP querying across petabyte-scale lakehouse assets'
        ],
        futureStateLevels: [
          '1. Explore: Slow queries scanning full datasets with 30s+ response times',
          '2. Experiment: Static summary tables refreshed once nightly',
          '3. Formalize: Automated materialized views and columnar caching',
          '4. Optimize: Intelligent query acceleration with adaptive indexing and memory tiering',
          '5. Transform: Sub-second interactive OLAP querying across petabyte-scale lakehouse assets'
        ],
        technicalPains: [
          'High warehouse concurrency timeouts during peak executive hours',
          'Expensive full-table scans inflating cloud compute invoices',
          'Complex cache invalidation logic'
        ],
        businessPains: [
          'Lagging executive dashboards causing frustration',
          'Inability to analyze live operational data during trading or launches',
          'High infrastructure costs for mediocre performance'
        ]
      },
      {
        id: 'q_a4',
        title: 'How securely and seamlessly is data shared across internal business units and external partners?',
        dimName: 'Cross-Department Data Sharing & Clean Rooms',
        currentStateLevels: [
          '1. Explore: Data shared via manual CSV email attachments and FTP',
          '2. Experiment: Point-to-point database copies causing data duplication',
          '3. Formalize: Governed zero-copy data sharing with fine-grained access policies',
          '4. Optimize: Privacy-preserving clean rooms with differential privacy guarantees',
          '5. Transform: Frictionless global data marketplace with automated entitlement provisioning'
        ],
        futureStateLevels: [
          '1. Explore: Data shared via manual CSV email attachments and FTP',
          '2. Experiment: Point-to-point database copies causing data duplication',
          '3. Formalize: Governed zero-copy data sharing with fine-grained access policies',
          '4. Optimize: Privacy-preserving clean rooms with differential privacy guarantees',
          '5. Transform: Frictionless global data marketplace with automated entitlement provisioning'
        ],
        technicalPains: [
          'Data duplication across cloud storage buckets and accounts',
          'Lack of access revocation audit trails for third-party partners',
          'Complex ETL pipelines built solely for sharing data'
        ],
        businessPains: [
          'Severe security and intellectual property leak vulnerabilities',
          'Regulatory non-compliance with data residency laws',
          'Slow partner integrations delaying joint venture ROI'
        ]
      },
      {
        id: 'q_a5',
        title: 'How mature is your executive decision intelligence and forward-looking predictive analytics?',
        dimName: 'Executive Decision Intelligence & Predictive Scoring',
        currentStateLevels: [
          '1. Explore: Exclusively backward-looking descriptive reports with no forecasting',
          '2. Experiment: Basic linear regression spreadsheets prepared manually',
          '3. Formalize: Production predictive models embedded in executive dashboards',
          '4. Optimize: Prescriptive decision simulations showing expected outcome probabilities',
          '5. Transform: Automated closed-loop decision intelligence triggering business actions'
        ],
        futureStateLevels: [
          '1. Explore: Exclusively backward-looking descriptive reports with no forecasting',
          '2. Experiment: Basic linear regression spreadsheets prepared manually',
          '3. Formalize: Production predictive models embedded in executive dashboards',
          '4. Optimize: Prescriptive decision simulations showing expected outcome probabilities',
          '5. Transform: Automated closed-loop decision intelligence triggering business actions'
        ],
        technicalPains: [
          'Disconnection between ML prediction endpoints and BI dashboards',
          'Lack of scenario simulation capabilities in standard BI tools',
          'Static forecasting models that fail during market volatility'
        ],
        businessPains: [
          'Leadership reacting to problems after they occur rather than anticipating them',
          'Missed revenue opportunities in pricing, churn, and supply chain',
          'Competitors outmaneuvering with predictive intelligence'
        ]
      }
    ]
  },
  {
    id: 'machine_learning',
    name: '4. Production ML & MLOps',
    icon: Cpu,
    emoji: '🤖',
    progress: '5/5 100%',
    isComplete: true,
    dimensions: [
      { id: 'dim_m1', name: 'Model Registry, Versioning & Lineage Tracking', done: true },
      { id: 'dim_m2', name: 'Feature Store & Real-Time Feature Serving', done: true },
      { id: 'dim_m3', name: 'Automated CI/CD Training & Hyperparameter Tuning', done: true },
      { id: 'dim_m4', name: 'Low-Latency Inference Serving & Autoscaling', done: true },
      { id: 'dim_m5', name: 'Continuous Drift Detection & Explainability', done: true }
    ],
    questions: [
      {
        id: 'q_m1',
        title: 'How standardized is your model registry, experiment tracking, and artifact versioning?',
        dimName: 'Model Registry, Versioning & Lineage Tracking',
        currentStateLevels: [
          '1. Explore: Models saved as local pickle files on developer laptops with no lineage',
          '2. Experiment: Basic shared experiment tracking server, but deployment is manual',
          '3. Formalize: Centralized Model Registry tracking code, data hashes, and metrics',
          '4. Optimize: Automated stage transitions (Staging -> Production) with sign-off gates',
          '5. Transform: End-to-end cryptographic model provenance with automated governance'
        ],
        futureStateLevels: [
          '1. Explore: Models saved as local pickle files on developer laptops with no lineage',
          '2. Experiment: Basic shared experiment tracking server, but deployment is manual',
          '3. Formalize: Centralized Model Registry tracking code, data hashes, and metrics',
          '4. Optimize: Automated stage transitions (Staging -> Production) with sign-off gates',
          '5. Transform: End-to-end cryptographic model provenance with automated governance'
        ],
        technicalPains: [
          'Inability to reproduce historical model training runs',
          'Orphaned model binaries deployed in production with unknown training data',
          'Lack of artifact version control and dependency lockfiles'
        ],
        businessPains: [
          'Severe audit and regulatory compliance exposure',
          'Model rollback failures causing prolonged outages',
          'High onboarding friction for data science hires'
        ]
      },
      {
        id: 'q_m2',
        title: 'How are ML features shared, computed, and served between training and real-time inference?',
        dimName: 'Feature Store & Real-Time Feature Serving',
        currentStateLevels: [
          '1. Explore: Each model re-implements custom feature engineering scripts from scratch',
          '2. Experiment: Shared SQL queries for batch training, but separate code for online serving',
          '3. Formalize: Centralized Feature Store ensuring training/serving consistency',
          '4. Optimize: Real-time streaming feature computation with sub-10ms online lookup',
          '5. Transform: Automated feature discovery and feature importance recommendations'
        ],
        futureStateLevels: [
          '1. Explore: Each model re-implements custom feature engineering scripts from scratch',
          '2. Experiment: Shared SQL queries for batch training, but separate code for online serving',
          '3. Formalize: Centralized Feature Store ensuring training/serving consistency',
          '4. Optimize: Real-time streaming feature computation with sub-10ms online lookup',
          '5. Transform: Automated feature discovery and feature importance recommendations'
        ],
        technicalPains: [
          'Training-serving skew causing silent model degradation in production',
          'Duplicated feature engineering logic across multiple ML teams',
          'High latency during real-time feature retrieval'
        ],
        businessPains: [
          'Sub-optimal model accuracy in production',
          'Wasted engineering cycles rebuilding existing features',
          'Delayed launch of real-time personalization and fraud models'
        ]
      },
      {
        id: 'q_m3',
        title: 'How automated is your end-to-end CI/CD model retraining, testing, and validation workflow?',
        dimName: 'Automated CI/CD Training & Hyperparameter Tuning',
        currentStateLevels: [
          '1. Explore: Models trained manually in Jupyter Notebooks and exported via script',
          '2. Experiment: Automated batch training scripts triggered on schedule without validation gates',
          '3. Formalize: Automated CI/CD pipelines executing regression and benchmark tests on push',
          '4. Optimize: Automated hyperparameter tuning (HPO) and canary deployment testing',
          '5. Transform: Continuous learning system with autonomous champion/challenger evaluation'
        ],
        futureStateLevels: [
          '1. Explore: Models trained manually in Jupyter Notebooks and exported via script',
          '2. Experiment: Automated batch training scripts triggered on schedule without validation gates',
          '3. Formalize: Automated CI/CD pipelines executing regression and benchmark tests on push',
          '4. Optimize: Automated hyperparameter tuning (HPO) and canary deployment testing',
          '5. Transform: Continuous learning system with autonomous champion/challenger evaluation'
        ],
        technicalPains: [
          'Deployment bottlenecks requiring manual engineering interventions',
          'Lack of automated regression and fairness testing before production rollout',
          'High compute waste on unoptimized hyperparameter search'
        ],
        businessPains: [
          'Model updates taking months to reach production',
          'Stale models delivering degrading business performance',
          'High operational risk during major release updates'
        ]
      },
      {
        id: 'q_m4',
        title: 'How scalable, low-latency, and cost-effective is your real-time model inference infrastructure?',
        dimName: 'Low-Latency Inference Serving & Autoscaling',
        currentStateLevels: [
          '1. Explore: Models served via basic unmonitored Flask/FastAPI wrappers on single VMs',
          '2. Experiment: Containerized model endpoints on Kubernetes without autoscaling',
          '3. Formalize: Enterprise inference cluster with dynamic GPU/CPU autoscaling',
          '4. Optimize: Multi-model serving with dynamic batching and optimized runtimes (ONNX/TensorRT)',
          '5. Transform: Global edge inference with intelligent cold-start elimination and zero downtime'
        ],
        futureStateLevels: [
          '1. Explore: Models served via basic unmonitored Flask/FastAPI wrappers on single VMs',
          '2. Experiment: Containerized model endpoints on Kubernetes without autoscaling',
          '3. Formalize: Enterprise inference cluster with dynamic GPU/CPU autoscaling',
          '4. Optimize: Multi-model serving with dynamic batching and optimized runtimes (ONNX/TensorRT)',
          '5. Transform: Global edge inference with intelligent cold-start elimination and zero downtime'
        ],
        technicalPains: [
          'High cold-start latency causing application timeouts',
          'Inability to scale under sudden burst traffic spikes',
          'Expensive dedicated GPU provisioning for low-traffic endpoints'
        ],
        businessPains: [
          'Poor end-user experience due to sluggish application response times',
          'Lost transactions and revenue during high-traffic events',
          'Inflated infrastructure costs from idle GPU capacity'
        ]
      },
      {
        id: 'q_m5',
        title: 'How do you monitor production models for data drift, concept drift, and performance degradation?',
        dimName: 'Continuous Drift Detection & Explainability',
        currentStateLevels: [
          '1. Explore: No model monitoring; degradation discovered after business complaints',
          '2. Experiment: Periodic manual ground-truth evaluation and offline accuracy checks',
          '3. Formalize: Continuous statistical drift monitoring with automated threshold alerts',
          '4. Optimize: Real-time explainability (SHAP/LIME) and automated retraining triggers',
          '5. Transform: Closed-loop governance that routes anomalous predictions to human-in-the-loop reviewers'
        ],
        futureStateLevels: [
          '1. Explore: No model monitoring; degradation discovered after business complaints',
          '2. Experiment: Periodic manual ground-truth evaluation and offline accuracy checks',
          '3. Formalize: Continuous statistical drift monitoring with automated threshold alerts',
          '4. Optimize: Real-time explainability (SHAP/LIME) and automated retraining triggers',
          '5. Transform: Closed-loop governance that routes anomalous predictions to human-in-the-loop reviewers'
        ],
        technicalPains: [
          'Silent model failure as real-world distributions shift',
          'Lack of ground-truth latency feedback loops',
          'Black-box predictions that cannot be explained to regulatory auditors'
        ],
        businessPains: [
          'Severe business losses caused by drifted recommendations/pricing',
          'Regulatory penalties for unexplainable decisions',
          'Loss of consumer trust in AI-driven features'
        ]
      }
    ]
  },
  {
    id: 'generative_ai',
    name: '5. Generative & Agentic AI',
    icon: Sparkles,
    emoji: '✨',
    progress: '5/5 100%',
    isComplete: true,
    dimensions: [
      { id: 'dim_g1', name: 'Multi-Model Gateway & LLM Orchestration', done: true },
      { id: 'dim_g2', name: 'Hybrid Enterprise RAG & Vector Grounding', done: true },
      { id: 'dim_g3', name: 'Multi-Agent Systems, Tool Calling & Autonomy', done: true },
      { id: 'dim_g4', name: 'AI Guardrails, Prompt Defense & Red Teaming', done: true },
      { id: 'dim_g5', name: 'LLM Evaluation, Benchmarking & Evals', done: true }
    ],
    questions: [
      {
        id: 'q_g1',
        title: 'How do you orchestrate, route, and manage multiple foundation models without vendor lock-in?',
        dimName: 'Multi-Model Gateway & LLM Orchestration',
        currentStateLevels: [
          '1. Explore: Hardcoded API calls to a single proprietary consumer LLM',
          '2. Experiment: Lightweight wrapper class, but prompt templates remain tightly coupled',
          '3. Formalize: Centralized LLM Gateway with unified API schemas, rate-limiting, and key management',
          '4. Optimize: Dynamic model routing based on prompt complexity, cost, and latency budgets',
          '5. Transform: Enterprise-wide model-agnostic mesh with real-time semantic fallback and self-hosting'
        ],
        futureStateLevels: [
          '1. Explore: Hardcoded API calls to a single proprietary consumer LLM',
          '2. Experiment: Lightweight wrapper class, but prompt templates remain tightly coupled',
          '3. Formalize: Centralized LLM Gateway with unified API schemas, rate-limiting, and key management',
          '4. Optimize: Dynamic model routing based on prompt complexity, cost, and latency budgets',
          '5. Transform: Enterprise-wide model-agnostic mesh with real-time semantic fallback and self-hosting'
        ],
        technicalPains: [
          'Single-vendor lock-in with breaking changes during upstream model deprecations',
          'No automatic failover when third-party model APIs experience outages',
          'Expensive frontier models used for simple parsing tasks'
        ],
        businessPains: [
          'Vulnerability to vendor price hikes and API throttling',
          'Extended downtime when model providers suffer outages',
          'Inability to rapidly leverage newly released state-of-the-art models'
        ]
      },
      {
        id: 'q_g2',
        title: 'How mature is your Enterprise RAG architecture, vector search, and clinical/domain grounding?',
        dimName: 'Hybrid Enterprise RAG & Vector Grounding',
        currentStateLevels: [
          '1. Explore: Basic naive vector search with simple chunking and top-k cosine similarity',
          '2. Experiment: Vector database with metadata filtering, but high hallucination rates',
          '3. Formalize: Advanced hybrid search (Dense Vector + Sparse BM25) with semantic re-ranking',
          '4. Optimize: Document hierarchy parsing, parent-child chunking, and contextual compression',
          '5. Transform: GraphRAG with dynamic knowledge graph traversal and multi-hop reasoning'
        ],
        futureStateLevels: [
          '1. Explore: Basic naive vector search with simple chunking and top-k cosine similarity',
          '2. Experiment: Vector database with metadata filtering, but high hallucination rates',
          '3. Formalize: Advanced hybrid search (Dense Vector + Sparse BM25) with semantic re-ranking',
          '4. Optimize: Document hierarchy parsing, parent-child chunking, and contextual compression',
          '5. Transform: GraphRAG with dynamic knowledge graph traversal and multi-hop reasoning'
        ],
        technicalPains: [
          'Chunking breaking tables, code blocks, and complex PDF layouts',
          'Retrieval hallucinations from out-of-context vector matches',
          'Inability to perform multi-document synthesis'
        ],
        businessPains: [
          'Users receiving inaccurate answers and losing faith in AI tools',
          'Legal and regulatory liability from ungrounded claims',
          'Inability to search across rich corporate knowledge silos'
        ]
      },
      {
        id: 'q_g3',
        title: 'How do you architect and control multi-agent workflows, tool execution, and state persistence?',
        dimName: 'Multi-Agent Systems, Tool Calling & Autonomy',
        currentStateLevels: [
          '1. Explore: Single-prompt question answering with no tool calling or memory',
          '2. Experiment: Basic sequential chains (prompt A -> prompt B) without error recovery',
          '3. Formalize: State machine multi-agent frameworks with defined tool execution schemas',
          '4. Optimize: Multi-agent coordination with specialized personas, memory persistence, and human checkpoints',
          '5. Transform: Self-correcting autonomous multi-agent teams with dynamic sub-task decomposition'
        ],
        futureStateLevels: [
          '1. Explore: Single-prompt question answering with no tool calling or memory',
          '2. Experiment: Basic sequential chains (prompt A -> prompt B) without error recovery',
          '3. Formalize: State machine multi-agent frameworks with defined tool execution schemas',
          '4. Optimize: Multi-agent coordination with specialized personas, memory persistence, and human checkpoints',
          '5. Transform: Self-correcting autonomous multi-agent teams with dynamic sub-task decomposition'
        ],
        technicalPains: [
          'Infinite loops and runaway token consumption in unconstrained agent loops',
          'Tool execution failure leading to deadlocked agent states',
          'Loss of conversation context across multi-turn sessions'
        ],
        businessPains: [
          'AI taking unpredictable actions on production enterprise systems',
          'Difficulty scoping engineering deliverables for agentic projects',
          'High compute costs from looping agent calls'
        ]
      },
      {
        id: 'q_g4',
        title: 'How robust are your generative AI safety guardrails, prompt injection defenses, and PII masking?',
        dimName: 'AI Guardrails, Prompt Defense & Red Teaming',
        currentStateLevels: [
          '1. Explore: No input/output filtering; raw prompt passed directly to model',
          '2. Experiment: Basic regex blacklists for offensive words and PII',
          '3. Formalize: Dedicated guardrail layers scanning for prompt injections, jailbreaks, and PII leakage',
          '4. Optimize: Dual-pass validation (input scanning + semantic output validation) with automated red-teaming',
          '5. Transform: Cryptographic watermarking and real-time adversarial defense with automated blocking'
        ],
        futureStateLevels: [
          '1. Explore: No input/output filtering; raw prompt passed directly to model',
          '2. Experiment: Basic regex blacklists for offensive words and PII',
          '3. Formalize: Dedicated guardrail layers scanning for prompt injections, jailbreaks, and PII leakage',
          '4. Optimize: Dual-pass validation (input scanning + semantic output validation) with automated red-teaming',
          '5. Transform: Cryptographic watermarking and real-time adversarial defense with automated blocking'
        ],
        technicalPains: [
          'Direct and indirect prompt injection attacks bypassing system prompts',
          'Accidental leakage of confidential customer data in model prompts',
          'Latency overhead introduced by multi-step guardrail pipelines'
        ],
        businessPains: [
          'Catastrophic brand damage from rogue model outputs',
          'GDPR/HIPAA fines for data exposure in public LLMs',
          'Security teams vetoing production generative deployments'
        ]
      },
      {
        id: 'q_g5',
        title: 'How rigorously do you evaluate, benchmark, and track hallucination rates in generative outputs?',
        dimName: 'LLM Evaluation, Benchmarking & Evals',
        currentStateLevels: [
          '1. Explore: "Vibe checks" and anecdotal developer testing with no formal test dataset',
          '2. Experiment: Small spreadsheet of 20 test prompts reviewed manually before launches',
          '3. Formalize: Automated LLM-as-a-Judge evaluations measuring Faithfulness, Answer Relevance, and Context Recall',
          '4. Optimize: Continuous CI/CD evals with golden datasets, semantic regression testing, and latency budgets',
          '5. Transform: Real-time production telemetry logging user feedback to automatically generate new eval benchmarks'
        ],
        futureStateLevels: [
          '1. Explore: "Vibe checks" and anecdotal developer testing with no formal test dataset',
          '2. Experiment: Small spreadsheet of 20 test prompts reviewed manually before launches',
          '3. Formalize: Automated LLM-as-a-Judge evaluations measuring Faithfulness, Answer Relevance, and Context Recall',
          '4. Optimize: Continuous CI/CD evals with golden datasets, semantic regression testing, and latency budgets',
          '5. Transform: Real-time production telemetry logging user feedback to automatically generate new eval benchmarks'
        ],
        technicalPains: [
          'Inability to determine if a prompt change improved or degraded overall performance',
          'Lack of standardized golden benchmark datasets for domain tasks',
          'High cost and latency of running LLM-as-a-judge pipelines'
        ],
        businessPains: [
          'Fear of deploying prompt updates due to unknown side-effects',
          'Slow release cycles and engineering hesitation',
          'Undetected hallucination creep degrading business outcomes'
        ]
      }
    ]
  },
  {
    id: 'enablement',
    name: '6. Operational Excellence & ROI',
    icon: ShieldCheck,
    emoji: '⚡',
    progress: '5/5 100%',
    isComplete: true,
    dimensions: [
      { id: 'dim_e1', name: 'AI Governance Council, RACI & Policy Framework', done: true },
      { id: 'dim_e2', name: 'Continuous Regulatory, GxP & Compliance Sign-Off', done: true },
      { id: 'dim_e3', name: 'Human-In-The-Loop (HITL) Workflow & Audit Logging', done: true },
      { id: 'dim_e4', name: 'Enterprise Literacy, Talent Upskilling & Preservation', done: true },
      { id: 'dim_e5', name: 'Business Value Realization & TCO Payback Tracking', done: true }
    ],
    questions: [
      {
        id: 'q_e1',
        title: 'How structured is your enterprise AI steering committee, RACI ownership, and risk governance?',
        dimName: 'AI Governance Council, RACI & Policy Framework',
        currentStateLevels: [
          '1. Explore: Ad-hoc shadow AI projects with no centralized oversight or risk policy',
          '2. Experiment: Informal working group discussing AI ideas without executive decision rights',
          '3. Formalize: Cross-functional AI Governance Council with clear RACI matrix and risk tiering',
          '4. Optimize: Automated compliance intake gating projects by regulatory and data risk',
          '5. Transform: Embedded enterprise operating model driving strategic innovation with clear accountability'
        ],
        futureStateLevels: [
          '1. Explore: Ad-hoc shadow AI projects with no centralized oversight or risk policy',
          '2. Experiment: Informal working group discussing AI ideas without executive decision rights',
          '3. Formalize: Cross-functional AI Governance Council with clear RACI matrix and risk tiering',
          '4. Optimize: Automated compliance intake gating projects by regulatory and data risk',
          '5. Transform: Embedded enterprise operating model driving strategic innovation with clear accountability'
        ],
        technicalPains: [
          'Conflicting architectural guidelines from different department leads',
          'Lack of standard architectural review boards for AI projects',
          'Unclear ownership for AI incidents in production'
        ],
        businessPains: [
          'Paralysis from fear of regulatory penalties',
          'Siloed duplicate AI investments across business units',
          'Executive misalignment on AI strategy and resource allocation'
        ]
      },
      {
        id: 'q_e2',
        title: 'How are regulatory compliance, GxP validation, and data sovereignty boundaries certified?',
        dimName: 'Continuous Regulatory, GxP & Compliance Sign-Off',
        currentStateLevels: [
          '1. Explore: Compliance assumed without formal documentation or review',
          '2. Experiment: Manual legal and compliance review before major production launches',
          '3. Formalize: Documented compliance validation artifacts (GxP/SOC2/HIPAA) with audit sign-offs',
          '4. Optimize: Automated continuous compliance verification integrated into deployment pipelines',
          '5. Transform: Continuous regulatory attestation with automated audit-ready documentation'
        ],
        futureStateLevels: [
          '1. Explore: Compliance assumed without formal documentation or review',
          '2. Experiment: Manual legal and compliance review before major production launches',
          '3. Formalize: Documented compliance validation artifacts (GxP/SOC2/HIPAA) with audit sign-offs',
          '4. Optimize: Automated continuous compliance verification integrated into deployment pipelines',
          '5. Transform: Continuous regulatory attestation with automated audit-ready documentation'
        ],
        technicalPains: [
          'Manual generation of complex validation traceability matrices',
          'Inability to prove data residency compliance across global cloud regions',
          'Audit trail gaps during formal regulatory inspections'
        ],
        businessPains: [
          'Delayed commercial launches waiting for compliance approval',
          'Warning letters and fines from regulatory agencies',
          'High external consulting legal fees for compliance audits'
        ]
      },
      {
        id: 'q_e3',
        title: 'How are manual overrides, human reviews, and exception workflows recorded and audited?',
        dimName: 'Human-In-The-Loop (HITL) Workflow & Audit Logging',
        currentStateLevels: [
          '1. Explore: No override logging; users copy-paste and edit AI text freely',
          '2. Experiment: Overrides discussed via email/Slack; manual spreadsheets track approvals',
          '3. Formalize: In-app review interface with mandatory justification notes for overrides',
          '4. Optimize: Role-based routing sending high-risk overrides to designated compliance leads',
          '5. Transform: Cryptographically signed audit trails with real-time risk profile scoring'
        ],
        futureStateLevels: [
          '1. Explore: No override logging; users copy-paste and edit AI text freely',
          '2. Experiment: Overrides discussed via email/Slack; manual spreadsheets track approvals',
          '3. Formalize: In-app review interface with mandatory justification notes for overrides',
          '4. Optimize: Role-based routing sending high-risk overrides to designated compliance leads',
          '5. Transform: Cryptographically signed audit trails with real-time risk profile scoring'
        ],
        technicalPains: [
          'No centralized database recording human feedback deltas',
          'Lack of cryptographic tamper-proof logging for legal discovery',
          'Slow review UI interfaces causing human reviewer fatigue'
        ],
        businessPains: [
          'Undocumented human overrides creating legal liability',
          'Review bottlenecks delaying customer-facing outputs',
          'Inability to train future models from expert human corrections'
        ]
      },
      {
        id: 'q_e4',
        title: 'How do you train, upskill, and preserve enterprise institutional knowledge as workflows evolve?',
        dimName: 'Enterprise Literacy, Talent Upskilling & Preservation',
        currentStateLevels: [
          '1. Explore: No training; employees experiment with consumer tools individually',
          '2. Experiment: Occasional brown-bag sessions and shared prompt tip sheets',
          '3. Formalize: Structured prompt engineering and AI literacy certification programs',
          '4. Optimize: Role-specific workflow enablement with embedded coaching assistants',
          '5. Transform: Continuous organizational learning flywheel capturing veteran expertise into AI agents'
        ],
        futureStateLevels: [
          '1. Explore: No training; employees experiment with consumer tools individually',
          '2. Experiment: Occasional brown-bag sessions and shared prompt tip sheets',
          '3. Formalize: Structured prompt engineering and AI literacy certification programs',
          '4. Optimize: Role-specific workflow enablement with embedded coaching assistants',
          '5. Transform: Continuous organizational learning flywheel capturing veteran expertise into AI agents'
        ],
        technicalPains: [
          'Prompt engineering best practices not shared across engineering repositories',
          'High dependency on single key contributors who hold critical domain logic',
          'Lack of interactive sandboxes for hands-on employee training'
        ],
        businessPains: [
          'Low user adoption of expensive enterprise AI licenses',
          'Loss of institutional memory when senior staff retire or leave',
          'Employee anxiety and resistance toward automated workflows'
        ]
      },
      {
        id: 'q_e5',
        title: 'How do you measure hard business ROI, labor hour savings, and TCO payback timelines?',
        dimName: 'Business Value Realization & TCO Payback Tracking',
        currentStateLevels: [
          '1. Explore: Unmeasured; projects justified by curiosity and technology hype',
          '2. Experiment: Anecdotal soft efficiency claims with no baseline metrics',
          '3. Formalize: Standardized tracking of FTE hours saved and compute costs per project',
          '4. Optimize: Automated executive dashboard tracking real-time ROI and revenue impact',
          '5. Transform: Enterprise value realization framework tying AI metrics directly to quarterly P&L'
        ],
        futureStateLevels: [
          '1. Explore: Unmeasured; projects justified by curiosity and technology hype',
          '2. Experiment: Anecdotal soft efficiency claims with no baseline metrics',
          '3. Formalize: Standardized tracking of FTE hours saved and compute costs per project',
          '4. Optimize: Automated executive dashboard tracking real-time ROI and revenue impact',
          '5. Transform: Enterprise value realization framework tying AI metrics directly to quarterly P&L'
        ],
        technicalPains: [
          'Telemetry disconnected from enterprise financial tracking systems',
          'Difficulty isolating AI contribution from broader operational improvements',
          'Lack of automated baseline capture prior to deployment'
        ],
        businessPains: [
          'CFO skepticism and budget freezes for follow-on AI investments',
          'Inability to identify which AI projects are generating real value vs wasting budget',
          'Difficulty building defensible business cases for leadership approval'
        ]
      }
    ]
  }
];

export default function AssessmentMatrixFlow({ 
  customerTitle = 'Enterprise Data & AI Maturity Assessment', 
  onBack,
  onSubmit
}) {
  const [selectedPillarId, setSelectedPillarId] = useState('platform_governance');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'done' | 'todo'
  const [isSaved, setIsSaved] = useState(true);

  // Active question responses state
  const [answers, setAnswers] = useState({
    currentState: 2, // 1-5
    futureState: 4,   // 1-5
    technicalPains: [],
    businessPains: [],
    notes: 'Current architecture relies on custom scripts across multi-cloud environments. We are seeking to consolidate data governance, improve streaming SLAs, and enable governed agentic AI capabilities.'
  });

  const activePillar = PILLARS_DATA.find(p => p.id === selectedPillarId) || PILLARS_DATA[0];
  const questionsList = activePillar.questions || [];
  const currentQuestion = questionsList[currentQuestionIndex] || questionsList[0] || {
    id: 'q_default',
    title: 'How standardized are your enterprise data and AI workflows?',
    dimName: 'Enterprise Foundation',
    currentStateLevels: [
      '1. Explore: Manual, ad-hoc processes with limited standardization',
      '2. Experiment: Basic repeatability with some siloed automation',
      '3. Formalize: Documented standards consistently followed across teams',
      '4. Optimize: Advanced automation with proactive governance and cost metrics',
      '5. Transform: Industry-leading autonomous operations with continuous learning'
    ],
    futureStateLevels: [
      '1. Explore: Manual, ad-hoc processes with limited standardization',
      '2. Experiment: Basic repeatability with some siloed automation',
      '3. Formalize: Documented standards consistently followed across teams',
      '4. Optimize: Advanced automation with proactive governance and cost metrics',
      '5. Transform: Industry-leading autonomous operations with continuous learning'
    ],
    technicalPains: ['Inconsistent configurations', 'Manual deployment bottlenecks', 'Lack of observability'],
    businessPains: ['Slow time to market', 'High operational toil', 'Compliance risks']
  };

  const handlePillarClick = (pillarId) => {
    setSelectedPillarId(pillarId);
    setCurrentQuestionIndex(0);
  };

  const handleOptionSelect = (type, value) => {
    setAnswers(prev => ({
      ...prev,
      [type]: value
    }));
    setIsSaved(false);
    setTimeout(() => setIsSaved(true), 600);
  };

  const handleCheckboxToggle = (type, item) => {
    setAnswers(prev => {
      const list = prev[type] || [];
      const exists = list.includes(item);
      const updated = exists ? list.filter(x => x !== item) : [...list, item];
      return {
        ...prev,
        [type]: updated
      };
    });
    setIsSaved(false);
    setTimeout(() => setIsSaved(true), 600);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questionsList.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Find next pillar
      const currentIndex = PILLARS_DATA.findIndex(p => p.id === selectedPillarId);
      if (currentIndex < PILLARS_DATA.length - 1) {
        setSelectedPillarId(PILLARS_DATA[currentIndex + 1].id);
        setCurrentQuestionIndex(0);
      } else {
        if (onSubmit) onSubmit(answers);
      }
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    } else {
      const currentIndex = PILLARS_DATA.findIndex(p => p.id === selectedPillarId);
      if (currentIndex > 0) {
        const prevPillar = PILLARS_DATA[currentIndex - 1];
        setSelectedPillarId(prevPillar.id);
        setCurrentQuestionIndex((prevPillar.questions?.length || 1) - 1);
      } else if (onBack) {
        onBack();
      }
    }
  };

  return (
    <div className="assessment-matrix-layout">
      {/* LEFT SIDEBAR */}
      <aside className="matrix-sidebar">
        {/* Customer / Assessment Badge */}
        <div className="matrix-customer-badge">
          <div className="matrix-customer-header">
            <h4>{customerTitle}</h4>
            <button className="btn-edit-badge" onClick={() => alert("Edit customer metadata...")}>
              <Edit3 size={12} />
              <span>Edit</span>
            </button>
          </div>
          <div className="matrix-customer-meta">
            <span>ScoreX Enterprise Maturity Matrix</span>
          </div>
        </div>

        {/* 6-Pillar Accordion List */}
        <div className="matrix-pillars-list">
          {PILLARS_DATA.map((p, pIdx) => {
            const isSelected = p.id === selectedPillarId;
            return (
              <div key={p.id} className={`matrix-pillar-group ${isSelected ? 'is-selected' : ''}`}>
                <div 
                  className="matrix-pillar-header"
                  onClick={() => handlePillarClick(p.id)}
                >
                  <div className="pillar-header-left">
                    <span className="pillar-emoji">{p.emoji}</span>
                    <span className="pillar-name">{p.name}</span>
                  </div>
                  <div className="pillar-header-right">
                    <span className="pillar-progress-pill">{p.progress}</span>
                    <ChevronDown size={14} style={{ transform: isSelected ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </div>
                </div>

                {/* Sub-Dimensions Accordion when active */}
                {isSelected && (
                  <div className="matrix-dimensions-sublist">
                    <div className="dimension-action-row">
                      <Edit3 size={13} />
                      <span>{activePillar.name} Dimensions:</span>
                    </div>
                    {p.dimensions.map((dim, dIdx) => (
                      <div 
                        key={dim.id} 
                        className={`dimension-sub-item ${dIdx === currentQuestionIndex ? 'is-active-dim' : ''}`}
                        onClick={() => setCurrentQuestionIndex(Math.min(dIdx, (p.questions?.length || 1) - 1))}
                        style={{ cursor: 'pointer', fontWeight: dIdx === currentQuestionIndex ? 700 : 400, color: dIdx === currentQuestionIndex ? '#2563eb' : '#475569' }}
                      >
                        <CheckCircle2 size={13} color="#10b981" />
                        <span>{dim.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Sidebar Bottom CTA */}
        <div className="matrix-sidebar-footer">
          <button 
            className="btn-ready-submit"
            onClick={() => {
              if (onSubmit) onSubmit(answers);
            }}
          >
            <Sparkles size={16} />
            <span>Submit & Generate Report</span>
          </button>
        </div>
      </aside>

      {/* MAIN QUESTION WORKSPACE */}
      <main className="matrix-main-workspace">
        {/* Top Control Bar */}
        <div className="matrix-top-bar">
          <div className="matrix-title-lockup">
            <span className="pillar-badge-icon">{activePillar.emoji}</span>
            <div>
              <h3>{activePillar.name}</h3>
              <p className="dim-subtitle">{currentQuestion.dimName || 'Dimension Evaluation'}</p>
            </div>
          </div>

          <div className="matrix-filter-controls">
            {/* Filter Toggle */}
            <div className="q-filter-group">
              <button 
                className={`q-filter-pill ${filterMode === 'all' ? 'active' : ''}`}
                onClick={() => setFilterMode('all')}
              >
                All
              </button>
              <button 
                className={`q-filter-pill ${filterMode === 'done' ? 'active' : ''}`}
                onClick={() => setFilterMode('done')}
              >
                Done
              </button>
              <button 
                className={`q-filter-pill ${filterMode === 'todo' ? 'active' : ''}`}
                onClick={() => setFilterMode('todo')}
              >
                To Do
              </button>
            </div>

            {/* Question Bubbles 1..5 */}
            <div className="q-bubbles-row">
              {questionsList.map((q, idx) => (
                <button
                  key={q.id}
                  className={`q-bubble-btn ${idx === currentQuestionIndex ? 'is-current' : 'is-done'}`}
                  onClick={() => setCurrentQuestionIndex(idx)}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            {/* Saved Status & Skip */}
            <div className="q-meta-status">
              <span className="saved-indicator">
                <CheckCircle2 size={13} />
                <span>{isSaved ? 'Saved' : 'Saving...'}</span>
              </span>
              <span className="q-index-pill">
                {currentQuestionIndex + 1} of {questionsList.length}
              </span>
              <label className="q-skip-label">
                <input type="checkbox" />
                <span>Skip</span>
              </label>
            </div>
          </div>
        </div>

        {/* Question Header Card */}
        <div className="matrix-question-header-card">
          <div className="q-header-left">
            <h2>{currentQuestion.title}</h2>
          </div>
          <div className="q-header-actions">
            <button className="btn-q-action edit" onClick={() => alert("Edit question prompt...")}>
              <Edit3 size={13} />
              <span>Edit</span>
            </button>
            <button className="btn-q-action delete" onClick={() => alert("Reset question responses...")}>
              <Trash2 size={13} />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* 5-Column Matrix Grid */}
        <div className="matrix-5col-grid">
          {/* Col 1: Current State */}
          <div className="matrix-col">
            <div className="col-header">
              <span>1. Current State</span>
              <HelpCircle size={14} className="help-icon" />
            </div>
            <div className="col-options-list">
              {currentQuestion.currentStateLevels?.map((lvlText, idx) => {
                const scoreVal = idx + 1;
                const isSelected = answers.currentState === scoreVal;
                return (
                  <div 
                    key={idx}
                    className={`matrix-option-card ${isSelected ? 'is-selected' : ''}`}
                    onClick={() => handleOptionSelect('currentState', scoreVal)}
                  >
                    <span>{lvlText}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Col 2: Future State Vision */}
          <div className="matrix-col">
            <div className="col-header">
              <span>2. Future State Vision</span>
              <HelpCircle size={14} className="help-icon" />
            </div>
            <div className="col-options-list">
              {currentQuestion.futureStateLevels?.map((lvlText, idx) => {
                const scoreVal = idx + 1;
                const isSelected = answers.futureState === scoreVal;
                return (
                  <div 
                    key={idx}
                    className={`matrix-option-card ${isSelected ? 'is-selected' : ''}`}
                    onClick={() => handleOptionSelect('futureState', scoreVal)}
                  >
                    <span>{lvlText}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Col 3: Technical Pain Points */}
          <div className="matrix-col">
            <div className="col-header">
              <span>3. Technical Pain Points</span>
              <HelpCircle size={14} className="help-icon" />
            </div>
            <div className="col-checkbox-list">
              {currentQuestion.technicalPains?.map((tp, idx) => {
                const isChecked = answers.technicalPains.includes(tp);
                return (
                  <label key={idx} className={`matrix-checkbox-card ${isChecked ? 'is-checked' : ''}`}>
                    <input 
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleCheckboxToggle('technicalPains', tp)}
                    />
                    <span>{tp}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Col 4: Business Pain Points */}
          <div className="matrix-col">
            <div className="col-header">
              <span>4. Business Pain Points</span>
              <HelpCircle size={14} className="help-icon" />
            </div>
            <div className="col-checkbox-list">
              {currentQuestion.businessPains?.map((bp, idx) => {
                const isChecked = answers.businessPains.includes(bp);
                return (
                  <label key={idx} className={`matrix-checkbox-card ${isChecked ? 'is-checked' : ''}`}>
                    <input 
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleCheckboxToggle('businessPains', bp)}
                    />
                    <span>{tp || bp}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Col 5: Qualitative Notes */}
          <div className="matrix-col">
            <div className="col-header">
              <span>5. Qualitative Notes</span>
              <HelpCircle size={14} className="help-icon" />
            </div>
            <div className="matrix-notes-wrapper">
              <textarea
                className="matrix-notes-textarea"
                value={answers.notes}
                onChange={(e) => {
                  setAnswers(prev => ({ ...prev, notes: e.target.value }));
                  setIsSaved(false);
                  setTimeout(() => setIsSaved(true), 600);
                }}
                placeholder="Capture specific customer infrastructure nuances, legacy tooling debt, team friction, or strategic goals..."
              />
            </div>
          </div>
        </div>

        {/* Bottom Navigation Controls */}
        <div className="matrix-bottom-bar">
          <button className="btn-matrix-back" onClick={handleBack}>
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>
          <button className="btn-matrix-next" onClick={handleNext}>
            <span>{currentQuestionIndex === questionsList.length - 1 && selectedPillarId === PILLARS_DATA[PILLARS_DATA.length - 1].id ? 'Complete & Score Assessment →' : 'Next Question →'}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </main>
    </div>
  );
}
