// Standardized Maturity Levels for Databricks Assessment
// These levels apply to BOTH Current State and Future State perspectives
// Calibrated so most organizations evaluate at Level 3 or below

const STANDARD_MATURITY_LEVELS = [
  {
    value: 1,
    level: 'Explore',
    score: 1,
    description: 'Ad-hoc, manual processes with limited standardization or automation'
  },
  {
    value: 2,
    level: 'Experiment',
    score: 2,
    description: 'Basic implementation with some repeatability, but inconsistent across teams'
  },
  {
    value: 3,
    level: 'Formalize',
    score: 3,
    description: 'Documented standards and processes in place, consistently followed'
  },
  {
    value: 4,
    level: 'Optimize',
    score: 4,
    description: 'Advanced automation, proactive monitoring, and continuous improvement'
  },
  {
    value: 5,
    level: 'Transform',
    score: 5,
    description: 'Industry-leading practices with AI-driven optimization and innovation'
  }
];

/**
 * Generate context-specific maturity level options for any question
 * @param {string} context - The context to describe (e.g., "environments", "data quality", "ML pipelines")
 * @returns {Array} Array of 5 maturity level options with context-specific labels
 */
function generateMaturityOptions(context) {
  const contextLabels = {
    1: getExploreLabel(context),
    2: getExperimentLabel(context),
    3: getFormalizeLabel(context),
    4: getOptimizeLabel(context),
    5: getTransformLabel(context)
  };

  return STANDARD_MATURITY_LEVELS.map(level => ({
    value: level.value,
    label: `${level.value}. ${level.level}: ${contextLabels[level.value]}`,
    score: level.score
  }));
}

// Level 1: Explore - Ad-hoc, manual processes
function getExploreLabel(context) {
  const labels = {
    'environment': 'Manual, ad-hoc environment setup with no standardization',
    'scaling': 'Single team or limited scaling, frequent resource contention',
    'authentication': 'Inconsistent auth methods, local credentials, minimal access controls',
    'security': 'Basic security with ad-hoc policies, limited audit trails',
    'monitoring': 'Reactive monitoring, manual log reviews, no centralized observability',
    'governance': 'No centralized governance, manual metadata management',
    'cost': 'No cost tracking or attribution, manual budgeting',
    'ingestion': 'Custom scripts for each source, manual data loading',
    'architecture': 'Raw data dumps, no structured data organization',
    'orchestration': 'Manual job execution or basic cron jobs',
    'quality': 'Ad-hoc data validation, issues found in production',
    'observability': 'Limited pipeline visibility, manual debugging',
    'consumption': 'Direct database queries, no self-service capabilities',
    'visualization': 'Static reports created by analysts on request',
    'semantic': 'No shared definitions, inconsistent metrics across teams',
    'collaboration': 'Siloed teams, email-based collaboration',
    'ml_lifecycle': 'Notebook-based experimentation with no tracking',
    'ml_deployment': 'Manual model deployment, ad-hoc serving',
    'ml_monitoring': 'No model monitoring, reactive issue detection',
    'ml_governance': 'No model versioning or approval processes',
    'genai_adoption': 'Exploring ChatGPT or other consumer tools individually',
    'genai_architecture': 'No dedicated GenAI infrastructure',
    'genai_governance': 'No guardrails, policies, or usage tracking',
    'genai_integration': 'Manual copy-paste from GenAI tools',
    'operations': 'Manual deployments with no version control',
    'reliability': 'Frequent outages, manual recovery processes',
    'performance': 'Performance issues discovered by users',
    'compliance': 'Manual compliance checks, paper-based audit trails'
  };
  
  return labels[context] || 'Ad-hoc, manual processes with limited standardization';
}

// Level 2: Experiment - Basic implementation, inconsistent
function getExperimentLabel(context) {
  const labels = {
    'environment': 'Basic environment separation (dev/prod), but inconsistent configurations',
    'scaling': 'Few teams sharing resources, some isolation but frequent conflicts',
    'authentication': 'Basic SSO implemented, but inconsistent RBAC across workspaces',
    'security': 'Some security policies in place, but not consistently enforced',
    'monitoring': 'Basic alerts configured, but high noise and alert fatigue',
    'governance': 'Unity Catalog partially implemented, incomplete metadata',
    'cost': 'Basic cost reports available, but no optimization actions',
    'ingestion': 'Mix of Auto Loader and custom scripts, not standardized',
    'architecture': 'Bronze/Silver partially implemented, no clear standards',
    'orchestration': 'Using Databricks Jobs, but manual failure handling',
    'quality': 'Some data validation in pipelines, but not comprehensive',
    'observability': 'Basic job monitoring, but limited pipeline-level insights',
    'consumption': 'SQL endpoints available, but most users still use notebooks',
    'visualization': 'Dashboards created by data team, limited self-service',
    'semantic': 'Some shared metrics, but inconsistent definitions',
    'collaboration': 'Git repos for code, but inconsistent branching strategies',
    'ml_lifecycle': 'MLflow tracking experiments, but not all projects use it',
    'ml_deployment': 'Some models in production, manual versioning',
    'ml_monitoring': 'Basic performance tracking, manual drift checks',
    'ml_governance': 'Informal review process, no approval gates',
    'genai_adoption': 'Teams experimenting with OpenAI API or Databricks Foundation Models',
    'genai_architecture': 'Proof-of-concepts built, but no production deployment',
    'genai_governance': 'Basic guidelines documented, but not enforced',
    'genai_integration': 'Some apps using GenAI APIs, ad-hoc implementation',
    'operations': 'Some CI/CD pipelines, but many manual steps remain',
    'reliability': 'Basic backup processes, manual disaster recovery',
    'performance': 'Some query optimization, but reactive approach',
    'compliance': 'Automated audit logs collected, but not actively monitored'
  };
  
  return labels[context] || 'Basic implementation with some repeatability, inconsistent across teams';
}

// Level 3: Formalize - Documented standards, consistently followed
// MOST ORGANIZATIONS SHOULD BE HERE OR BELOW
function getFormalizeLabel(context) {
  const labels = {
    'environment': 'Standardized IaC for all environments, consistent configurations',
    'scaling': 'Multi-tenant architecture supporting 10-50 teams with clear isolation',
    'authentication': 'Enterprise SSO with SCIM provisioning, consistent RBAC policies',
    'security': 'Unity Catalog fully implemented, automated compliance checks',
    'monitoring': 'Centralized observability with Databricks System Tables and custom dashboards',
    'governance': 'Complete metadata catalog, data lineage tracking in place',
    'cost': 'Chargeback model implemented, cost allocated to teams and projects',
    'ingestion': 'Standardized on Auto Loader and DLT for all ingestion',
    'architecture': 'Full medallion architecture (Bronze/Silver/Gold) implemented',
    'orchestration': 'Databricks Workflows with automated retries and error handling',
    'quality': 'Data quality framework with expectations and automated testing',
    'observability': 'End-to-end pipeline monitoring, automated failure notifications',
    'consumption': 'Self-service SQL/BI tools available, governed data access',
    'visualization': 'Standardized dashboards and reports, self-service with governance',
    'semantic': 'Shared semantic layer, consistent metrics across organization',
    'collaboration': 'Git-based workflows, CI/CD for all code, peer review required',
    'ml_lifecycle': 'MLflow used consistently, experiments tracked and reproducible',
    'ml_deployment': 'Automated model deployment pipelines, version control enforced',
    'ml_monitoring': 'Automated drift detection, scheduled retraining triggers',
    'ml_governance': 'Approval gates for production deployment, model registry',
    'genai_adoption': 'Production GenAI applications with Databricks Model Serving',
    'genai_architecture': 'RAG pipelines built with Vector Search and Feature Serving',
    'genai_governance': 'Content filtering, PII detection, usage monitoring in place',
    'genai_integration': 'Standardized GenAI integration patterns across applications',
    'operations': 'Full CI/CD automation, blue-green deployments',
    'reliability': 'SLAs defined and monitored, automated failover',
    'performance': 'Proactive optimization, performance SLIs tracked',
    'compliance': 'Automated compliance reporting, real-time policy enforcement'
  };
  
  return labels[context] || 'Documented standards and processes in place, consistently followed';
}

// Level 4: Optimize - Advanced automation, proactive monitoring
// ONLY MATURE ORGANIZATIONS REACH THIS LEVEL
function getOptimizeLabel(context) {
  const labels = {
    'environment': 'Self-service environment provisioning with automated governance and cost controls',
    'scaling': 'Elastic scaling supporting 50+ teams, automated resource optimization',
    'authentication': 'Zero-trust security model, just-in-time access, automated attestation',
    'security': 'Automated security posture management, predictive threat detection',
    'monitoring': 'AI-powered anomaly detection, predictive alerting, automated remediation',
    'governance': 'AI-powered data discovery, automated classification and tagging',
    'cost': 'Predictive cost modeling, automated optimization recommendations',
    'ingestion': 'Intelligent data quality at ingestion, automated schema evolution',
    'architecture': 'Automated data lifecycle management, intelligent tiering',
    'orchestration': 'Self-healing pipelines, intelligent retry strategies',
    'quality': 'ML-powered data quality, automated root cause analysis',
    'observability': 'Predictive pipeline monitoring, automated performance optimization',
    'consumption': 'AI-powered query optimization, automated materialized views',
    'visualization': 'AI-assisted analytics, automated insight generation',
    'semantic': 'AI-powered metric recommendations, automated consistency checks',
    'collaboration': 'Automated code review suggestions, continuous optimization',
    'ml_lifecycle': 'AutoML pipelines, automated feature engineering',
    'ml_deployment': 'Canary deployments, automated A/B testing',
    'ml_monitoring': 'Predictive model degradation alerts, automated retraining',
    'ml_governance': 'Automated bias detection, explainability dashboards',
    'genai_adoption': 'Advanced RAG with fine-tuned models, multi-agent systems',
    'genai_architecture': 'Compound AI systems with feedback loops and continuous learning',
    'genai_governance': 'Real-time content moderation, automated safety testing',
    'genai_integration': 'Embedded GenAI in all critical business workflows',
    'operations': 'Automated deployment optimization, self-healing infrastructure',
    'reliability': 'Chaos engineering, automated resilience testing',
    'performance': 'Predictive performance optimization, auto-scaling all layers',
    'compliance': 'Real-time compliance validation, automated remediation'
  };
  
  return labels[context] || 'Advanced automation, proactive monitoring, and continuous improvement';
}

// Level 5: Transform - Industry-leading, AI-driven innovation
// VERY FEW ORGANIZATIONS ACHIEVE THIS
function getTransformLabel(context) {
  const labels = {
    'environment': 'Platform engineering team providing internal developer platform (IDP)',
    'scaling': 'Unlimited elastic scaling with multi-region, multi-cloud orchestration',
    'authentication': 'Adaptive authentication with behavioral biometrics and risk-based access',
    'security': 'Quantum-ready security, AI-driven threat hunting and response',
    'monitoring': 'Autonomous operations with self-optimizing systems',
    'governance': 'Federated governance with AI-powered policy recommendations',
    'cost': 'Autonomous cost optimization, sustainability-driven compute allocation',
    'ingestion': 'Real-time streaming at massive scale with intelligent backpressure',
    'architecture': 'Dynamic schema evolution, AI-optimized data layouts',
    'orchestration': 'Autonomous data pipelines with intelligent resource allocation',
    'quality': 'Zero-defect data pipelines with autonomous quality assurance',
    'observability': 'Full-stack observability with AI-driven root cause analysis',
    'consumption': 'Natural language to insights, autonomous data preparation',
    'visualization': 'AI-native analytics with automated narrative generation',
    'semantic': 'Universal semantic layer with AI-powered metric governance',
    'collaboration': 'AI pair programming, autonomous code optimization',
    'ml_lifecycle': 'Autonomous ML with closed-loop learning systems',
    'ml_deployment': 'Zero-downtime, autonomous model evolution',
    'ml_monitoring': 'Self-healing models with continuous learning',
    'ml_governance': 'Autonomous compliance with AI-powered audit trails',
    'genai_adoption': 'AI-first organization with GenAI embedded in all processes',
    'genai_architecture': 'Autonomous AI agents orchestrating business processes',
    'genai_governance': 'Constitutional AI with self-improving safety systems',
    'genai_integration': 'Seamless human-AI collaboration across entire organization',
    'operations': 'Autonomous platform operations with predictive issue prevention',
    'reliability': 'Self-healing systems with autonomous disaster recovery',
    'performance': 'AI-optimized resource allocation across all layers',
    'compliance': 'Autonomous compliance with predictive risk management'
  };
  
  return labels[context] || 'Industry-leading practices with AI-driven optimization and innovation';
}

module.exports = {
  STANDARD_MATURITY_LEVELS,
  generateMaturityOptions
};





