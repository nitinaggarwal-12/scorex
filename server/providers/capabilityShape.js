/**
 * Canonical capability shape.
 *
 * The questionnaire and the report are shared across every vendor: one layout, one
 * component tree, one PDF and PPTX template. Vendors differ in WHAT is rendered,
 * never in HOW. That only holds if every provider hands the report the same shape,
 * so this module defines it and both providers normalize through it.
 *
 * Field names are deliberately vendor-neutral. The report previously read
 * `databricksFeatures` directly, which meant a Google Cloud assessment rendered an
 * empty recommendations block with no error — the layout was already shared, but
 * the data contract was not.
 *
 *   id           stable identifier
 *   name         product or capability name as the vendor writes it
 *   description  one or two sentences
 *   docs         link to the vendor's own documentation, or null
 *   releaseDate  ISO date or null — rendered as a freshness hint
 *   matched      canonical technical pains this capability addresses
 */

function normalizeCapability(raw = {}) {
  return {
    id: raw.id || raw.feature_id || raw.name || null,
    name: raw.name || raw.title || null,
    description: raw.description || raw.summary || '',
    docs: raw.docs || raw.docsUrl || raw.source?.url || null,
    releaseDate: raw.releaseDate || raw.release_date || raw.source?.verifiedAt || null,
    matched: raw.matched || raw.matchedPainPoints || []
  };
}

function normalizeCapabilities(list = []) {
  return list.filter(Boolean).map(normalizeCapability).filter((c) => c.name);
}

/**
 * Read capabilities from a payload that may predate the rename. Persisted
 * assessments still carry `databricksFeatures`; reading both keeps old reports
 * rendering instead of silently emptying them.
 */
function readCapabilities(payload = {}) {
  const list = payload.capabilities
    || payload.databricksFeatures // legacy field, pre-provider-split
    || [];
  return normalizeCapabilities(list);
}

module.exports = { normalizeCapability, normalizeCapabilities, readCapabilities };
