/**
 * GCP recommendation provider.
 *
 * Produces recommendations strictly from the verified capability catalog. Where a
 * pillar has no verified entries, this returns an explicit gap marker rather than
 * generic filler — a blank the customer can see is safer than prose that reads
 * like advice but is not grounded in anything.
 */

const catalog = require('./capabilityCatalog');
const provenance = require('../../services/provenanceService');
const { normalizeCapabilities } = require('../capabilityShape');

const PROVIDER_ID = 'gcp';
const DISPLAY_NAME = 'Google Cloud';

function recommendationsForPillar(pillarId, { painPoints = [] } = {}) {
  const entries = catalog.capabilitiesForPillar(pillarId);

  if (entries.length === 0) {
    const gap = catalog.COVERAGE_GAPS.find((g) => g.pillar === pillarId);
    return {
      pillar: pillarId,
      provider: PROVIDER_ID,
      covered: false,
      capabilities: [],
      note: gap
        ? `No verified Google Cloud capability mapping exists for this pillar yet. ${gap.note}`
        : 'No verified Google Cloud capability mapping exists for this pillar yet.'
    };
  }

  const painSet = new Set(painPoints.map((p) => String(p?.value || p).toLowerCase()));

  const ranked = entries
    .map((entry) => {
      const matched = (entry.addressesPainPoints || []).filter((p) => painSet.has(p));
      return { entry, matchCount: matched.length, matchedPainPoints: matched };
    })
    .sort((a, b) => b.matchCount - a.matchCount);

  return {
    pillar: pillarId,
    provider: PROVIDER_ID,
    covered: true,
    // Normalized through the shared shape so the report renders GCP and Databricks
    // results with the same components and the same template.
    capabilities: normalizeCapabilities(ranked.map(({ entry, matchedPainPoints }) => ({
      id: entry.id,
      name: entry.name,
      formerlyKnownAs: entry.formerlyKnownAs || [],
      // Summaries are catalog text, not model output, but they pass through the
      // same policy so a future edit cannot introduce an unsourced statistic.
      summary: provenance.neutralizeGeneratedText(entry.summary, {
        externalSources: [{ title: entry.name, url: entry.sourceUrl }]
      }),
      matchedPainPoints,
      source: { url: entry.sourceUrl, verifiedAt: entry.verifiedAt }
    })))
  };
}

function describeCoverage() {
  return { provider: PROVIDER_ID, displayName: DISPLAY_NAME, ...catalog.coverageReport() };
}

module.exports = {
  PROVIDER_ID,
  DISPLAY_NAME,
  recommendationsForPillar,
  describeCoverage,
  validate: catalog.validateCatalog,
  staleEntries: catalog.staleEntries
};
