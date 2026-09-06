const test = require('node:test');
const assert = require('node:assert/strict');

const providers = require('../../server/providers');
const gcp = require('../../server/providers/gcp/recommendationProvider');
const catalog = require('../../server/providers/gcp/capabilityCatalog');

const VENDOR_LEAK = /databricks|delta lake|unity catalog|photon|dbfs|dbsql|mlflow/i;

const PILLARS = [
  'platform_governance',
  'data_engineering',
  'analytics_bi',
  'machine_learning',
  'generative_ai',
  'operational_excellence'
];

test('provider resolution fails closed rather than guessing a vendor', () => {
  assert.throws(() => providers.resolveProvider({}), /no provider set/i);
  assert.throws(() => providers.resolveProvider({ provider: 'snowflake' }), /no provider set/i);
});

test('an explicit legacy provider is honoured', () => {
  assert.equal(
    providers.resolveProvider({}, { assumeLegacyProvider: 'databricks' }),
    'databricks'
  );
});

test('a stored provider always wins over the legacy assumption', () => {
  assert.equal(
    providers.resolveProvider({ provider: 'gcp' }, { assumeLegacyProvider: 'databricks' }),
    'gcp'
  );
});

test('no Databricks identifier can appear anywhere in GCP provider output', () => {
  for (const pillar of PILLARS) {
    const result = gcp.recommendationsForPillar(pillar, {
      painPoints: ['governance', 'quality', 'siloed', 'model', 'deployment']
    });
    const serialized = JSON.stringify(result);
    assert.doesNotMatch(serialized, VENDOR_LEAK, `vendor leak in GCP output for ${pillar}`);
    assert.equal(result.provider, 'gcp');
  }
});

test('every catalog entry carries a Google-documentation source and a verification date', () => {
  const { valid, errors } = catalog.validateCatalog();
  assert.equal(valid, true, `catalog integrity failures:\n${errors.join('\n')}`);
});

test('uncovered pillars return an explicit gap, never filler advice', () => {
  for (const { pillar } of catalog.COVERAGE_GAPS) {
    const result = gcp.recommendationsForPillar(pillar);
    assert.equal(result.covered, false, `${pillar} claims coverage it does not have`);
    assert.equal(result.capabilities.length, 0);
    assert.match(result.note, /no verified/i);
  }
});

test('covered pillars return capabilities that each cite a source', () => {
  const covered = catalog.coverageReport().coveredPillars;
  assert.ok(covered.length > 0, 'catalog has no covered pillars at all');

  for (const pillar of covered) {
    const result = gcp.recommendationsForPillar(pillar, { painPoints: ['governance'] });
    assert.equal(result.covered, true);
    assert.ok(result.capabilities.length > 0);
    // Capabilities are emitted through the shared shape, so the source surfaces
    // as docs + releaseDate rather than a nested source object.
    for (const capability of result.capabilities) {
      assert.match(capability.docs, /^https:\/\/(docs\.)?cloud\.google\.com\//);
      assert.match(capability.releaseDate, /^\d{4}-\d{2}-\d{2}$/);
    }
  }
});

test('coverage gaps are declared, not silently empty', () => {
  const report = catalog.coverageReport();
  const accounted = new Set([...report.coveredPillars, ...report.gaps.map((g) => g.pillar)]);
  for (const pillar of PILLARS) {
    assert.ok(accounted.has(pillar), `${pillar} is neither covered nor declared as a gap`);
  }
});

test('the two providers are loaded independently', () => {
  const a = providers.loadProviderModule('gcp');
  const b = providers.loadProviderModule('databricks');
  assert.equal(a.PROVIDER_ID, 'gcp');
  assert.equal(b.PROVIDER_ID, 'databricks');
  assert.notEqual(a.PROVIDER_ID, b.PROVIDER_ID);
});
