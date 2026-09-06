/**
 * Provider registry.
 *
 * ScoreX runs two independent assessment offerings that must never share
 * recommendation content:
 *
 *   gcp        — Google Cloud capability recommendations
 *   databricks — Databricks capability recommendations (legacy engine)
 *
 * An assessment's provider is fixed at creation and is immutable thereafter. A
 * clone inherits the provider of its parent; it cannot be re-pointed at the other
 * vendor, because that would silently swap the vendor under a report a customer
 * has already seen.
 *
 * Nothing outside this directory should require a vendor module directly. Import
 * resolveProvider() and go through the returned interface, so that adding a third
 * provider does not mean auditing the whole server for stray requires.
 */

const PROVIDERS = Object.freeze({
  GCP: 'gcp',
  DATABRICKS: 'databricks'
});

const DEFAULT_PROVIDER = PROVIDERS.GCP;
const VALID_PROVIDERS = Object.freeze(Object.values(PROVIDERS));

function isValidProvider(value) {
  return typeof value === 'string' && VALID_PROVIDERS.includes(value.toLowerCase().trim());
}

function normalizeProvider(value) {
  if (!isValidProvider(value)) return null;
  return value.toLowerCase().trim();
}

/**
 * Resolve the provider for an assessment record.
 *
 * Fails closed: an assessment with an unrecognised or missing provider does NOT
 * silently fall back to a vendor. Legacy rows written before the provider column
 * existed are handled explicitly by the caller via assumeLegacyProvider.
 */
function resolveProvider(assessment, { assumeLegacyProvider = null } = {}) {
  const stored = normalizeProvider(assessment?.provider);
  if (stored) return stored;

  const legacy = normalizeProvider(assumeLegacyProvider);
  if (legacy) return legacy;

  throw new Error(
    'Assessment has no provider set. Refusing to guess a vendor for a customer-facing report. '
    + 'Backfill the provider column or pass assumeLegacyProvider explicitly.'
  );
}

function loadProviderModule(provider) {
  const normalized = normalizeProvider(provider);
  if (!normalized) throw new Error(`Unknown provider: ${provider}`);

  // Required lazily so that loading one provider never pulls the other's
  // catalog into memory alongside it.
  if (normalized === PROVIDERS.GCP) return require('./gcp/recommendationProvider');
  return require('./databricks/recommendationProvider');
}

module.exports = {
  PROVIDERS,
  VALID_PROVIDERS,
  DEFAULT_PROVIDER,
  isValidProvider,
  normalizeProvider,
  resolveProvider,
  loadProviderModule
};
