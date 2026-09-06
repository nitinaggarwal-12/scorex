/**
 * GCP Capability Catalog
 *
 * Maps assessment pillars and pain points to Google Cloud capabilities.
 *
 * PROVENANCE CONTRACT
 * -------------------
 * Every entry MUST carry a sourceUrl pointing at Google's own product
 * documentation, and a verifiedAt date recording when a human last confirmed the
 * entry against that page. Entries failing either check are rejected at load time
 * by validateCatalog().
 *
 * This is deliberate. The Databricks catalog this replaces grew by accumulation
 * and ended up shipping unsourced third-party statistics into customer reports.
 * The constraint here is that an unsourced capability cannot enter the catalog at
 * all, so the failure mode is visible thin coverage rather than invisible invention.
 *
 * Google renames these products often. Two examples confirmed while this catalog
 * was written:
 *   - Dataplex Universal Catalog became Knowledge Catalog.
 *   - Vertex AI ceased to exist as a standalone product name in May 2026; its
 *     services are delivered through Gemini Enterprise Agent Platform.
 * Treat verifiedAt older than ~90 days as stale and re-check before a customer session.
 */

const taxonomy = require('../../data/painPointTaxonomy');

const STALE_AFTER_DAYS = 90;

/**
 * Pillars with no verified entries yet. These are declared rather than left
 * silently empty, so the report can say "not yet covered" instead of rendering a
 * confident blank. Do not delete a line here without adding real entries above.
 */
const COVERAGE_GAPS = Object.freeze([
  { pillar: 'data_engineering', note: 'Needs verified entries for ingestion, transformation and orchestration.' },
  { pillar: 'analytics_bi', note: 'Needs verified entries for warehousing, semantic layer and BI delivery.' },
  { pillar: 'machine_learning', note: 'Needs verified entries for training, registry, serving and monitoring.' },
  { pillar: 'operational_excellence', note: 'Needs verified entries for cost management, reliability and observability.' }
]);

const CAPABILITIES = Object.freeze([
  {
    id: 'knowledge_catalog',
    pillar: 'platform_governance',
    name: 'Knowledge Catalog',
    formerlyKnownAs: ['Dataplex Universal Catalog', 'Data Catalog'],
    summary:
      'Unified governance and cataloguing layer across the Google Cloud data estate. Holds business, '
      + 'technical and runtime metadata, and applies AI to surface relationships and semantics.',
    addressesPainPoints: ['governance_policy_gap', 'lineage_metadata_gap', 'data_silos', 'access_friction'],
    sourceUrl: 'https://docs.cloud.google.com/dataplex/docs',
    verifiedAt: '2026-09-06'
  },
  {
    id: 'knowledge_catalog_governance',
    pillar: 'platform_governance',
    name: 'Knowledge Catalog — automated governance',
    summary:
      'Scans data to identify sensitive information, tracks lineage, and monitors data quality. '
      + 'Metadata is schema-driven rather than free-text tags, which supports programmatic governance at scale.',
    addressesPainPoints: ['governance_policy_gap', 'data_quality', 'regulatory_compliance_risk'],
    sourceUrl: 'https://docs.cloud.google.com/dataplex/docs/faq',
    verifiedAt: '2026-09-06'
  },
  {
    id: 'knowledge_catalog_data_products',
    pillar: 'platform_governance',
    name: 'Knowledge Catalog — data products',
    summary:
      'Packages curated collections of assets as governed data products with access groups mapped to '
      + 'IAM roles, and contracts stating refresh cadence and thresholds.',
    addressesPainPoints: ['data_silos', 'access_friction', 'governance_policy_gap'],
    sourceUrl: 'https://docs.cloud.google.com/dataplex/docs/data-products-overview',
    verifiedAt: '2026-09-06'
  },
  {
    id: 'gemini_enterprise_agent_platform',
    pillar: 'generative_ai',
    name: 'Gemini Enterprise Agent Platform',
    formerlyKnownAs: ['Vertex AI', 'Vertex AI Agent Builder'],
    summary:
      'Unified platform to build, deploy, govern and optimize enterprise AI agents, covering the AI '
      + 'lifecycle from foundation model access through deployment and management.',
    addressesPainPoints: ['genai_readiness_gap', 'model_lifecycle_gap', 'deployment_friction'],
    sourceUrl: 'https://docs.cloud.google.com/gemini-enterprise-agent-platform/overview',
    verifiedAt: '2026-09-06'
  },
  {
    id: 'agent_development_kit',
    pillar: 'generative_ai',
    name: 'Agent Development Kit (ADK)',
    summary:
      'Modular, model-agnostic framework for building agents capable of complex reasoning and tool use. '
      + 'Code-first path for teams that have outgrown low-code prototyping.',
    addressesPainPoints: ['engineering_practice_gap', 'deployment_friction'],
    sourceUrl: 'https://docs.cloud.google.com/gemini-enterprise-agent-platform/overview',
    verifiedAt: '2026-09-06'
  },
  {
    id: 'agent_studio',
    pillar: 'generative_ai',
    name: 'Agent Studio',
    summary:
      'Low-code visual canvas for designing, prototyping and managing agent reasoning loops and '
      + 'workflows without writing code.',
    addressesPainPoints: ['engineering_practice_gap', 'deployment_friction'],
    sourceUrl: 'https://docs.cloud.google.com/gemini-enterprise-agent-platform/overview',
    verifiedAt: '2026-09-06'
  },
  {
    id: 'model_armor',
    pillar: 'generative_ai',
    name: 'Agent Gateway with Model Armor',
    summary:
      'Secures agent interactions and enforces runtime policies, helping protect against threats and '
      + 'supporting compliant operation. Pairs with Agent Identity for granular agent permissions.',
    addressesPainPoints: ['ai_safety_evaluation_gap', 'security_access_control'],
    sourceUrl: 'https://docs.cloud.google.com/gemini-enterprise-agent-platform/overview',
    verifiedAt: '2026-09-06'
  }
]);

const REQUIRED_FIELDS = ['id', 'pillar', 'name', 'summary', 'sourceUrl', 'verifiedAt'];
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function validateCatalog(entries = CAPABILITIES) {
  const errors = [];
  const seen = new Set();

  entries.forEach((entry, index) => {
    const label = entry?.id || `index ${index}`;

    for (const field of REQUIRED_FIELDS) {
      if (!entry?.[field] || String(entry[field]).trim() === '') {
        errors.push(`${label}: missing required field "${field}"`);
      }
    }

    if (seen.has(entry?.id)) errors.push(`${label}: duplicate id`);
    seen.add(entry?.id);

    if (entry?.sourceUrl && !/^https:\/\/(docs\.)?cloud\.google\.com\//.test(entry.sourceUrl)) {
      errors.push(`${label}: sourceUrl must point at Google Cloud documentation`);
    }

    if (entry?.verifiedAt && !ISO_DATE.test(entry.verifiedAt)) {
      errors.push(`${label}: verifiedAt must be an ISO date (YYYY-MM-DD)`);
    }

    // Catalogs key off canonical technical pains only. A business impact is a
    // consequence, not something a product resolves.
    for (const code of entry?.addressesPainPoints || []) {
      if (!taxonomy.isCanonicalTechnical(code)) {
        errors.push(`${label}: "${code}" is not a canonical technical pain`);
      }
    }
  });

  return { valid: errors.length === 0, errors };
}

function staleEntries(asOf = new Date(), entries = CAPABILITIES) {
  const cutoff = new Date(asOf.getTime() - STALE_AFTER_DAYS * 24 * 60 * 60 * 1000);
  return entries.filter((entry) => new Date(entry.verifiedAt) < cutoff);
}

function capabilitiesForPillar(pillarId) {
  return CAPABILITIES.filter((entry) => entry.pillar === pillarId);
}

function coverageReport() {
  const covered = [...new Set(CAPABILITIES.map((entry) => entry.pillar))];
  return {
    coveredPillars: covered,
    gaps: COVERAGE_GAPS,
    totalCapabilities: CAPABILITIES.length
  };
}

module.exports = {
  CAPABILITIES,
  COVERAGE_GAPS,
  STALE_AFTER_DAYS,
  validateCatalog,
  staleEntries,
  capabilitiesForPillar,
  coverageReport
};
