/**
 * Databricks recommendation provider.
 *
 * Wraps the pre-existing Databricks engine and feature database so that the rest
 * of the server reaches them ONLY through the provider registry. The underlying
 * modules are unchanged; this file is the quarantine boundary.
 *
 * Known debt inherited from the wrapped engine, tracked rather than hidden:
 *   - Feature mappings were seeded from Databricks release notes and carry no
 *     per-entry source URL or verification date, unlike the GCP catalog.
 *   - Mapping tables live across server/migrations/00{1..7}_*.sql with duplicate
 *     and out-of-order numbering.
 * Narrative output is routed through the provenance policy, so unsourced
 * statistics are neutralized here as they are everywhere else.
 */

const RecommendationEngine = require('../../services/recommendationEngine');

const PROVIDER_ID = 'databricks';
const DISPLAY_NAME = 'Databricks';

let engine = null;
function getEngine() {
  if (!engine) engine = new RecommendationEngine();
  return engine;
}

function recommendationsForPillar(pillarId, { currentScore = 0, futureScore = 0, responses = {} } = {}) {
  const pillarRecommendations = getEngine().getPillarSpecificRecommendations(
    pillarId, currentScore, futureScore, responses
  );

  return {
    pillar: pillarId,
    provider: PROVIDER_ID,
    covered: true,
    recommendations: pillarRecommendations || []
  };
}

function describeCoverage() {
  return {
    provider: PROVIDER_ID,
    displayName: DISPLAY_NAME,
    note: 'Legacy catalog. Entries are not individually sourced or dated; see module header.'
  };
}

module.exports = { PROVIDER_ID, DISPLAY_NAME, recommendationsForPillar, describeCoverage };
