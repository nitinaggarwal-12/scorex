const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const shape = require('../../server/providers/capabilityShape');
const gcp = require('../../server/providers/gcp/recommendationProvider');

const root = path.join(__dirname, '../..');
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

/**
 * One questionnaire, one report, every vendor. Vendors differ in what is rendered,
 * never in how. These tests exist because the layout was already shared while the
 * data contract was not — the report read `databricksFeatures` directly, so a
 * non-Databricks assessment rendered an empty recommendations block silently.
 */

const SHARED_SURFACES = [
  'client/src/components/AssessmentQuestion.js',
  'client/src/components/DynamicAssessmentRunner.js',
  'client/src/components/AssessmentResultsNew.js',
  'client/src/components/ExecutiveSummaryNew.js',
  'client/src/services/pdfExportService.js',
  'client/src/services/pptxExportService.js'
];

const VENDOR_NAMES = /\b(databricks|unity catalog|delta lake|photon|dbfs|redshift|synapse|snowflake)\b/i;

test('no vendor name appears in the shared questionnaire or report surfaces', () => {
  for (const rel of SHARED_SURFACES) {
    const src = read(rel);
    const hits = src.split('\n')
      .map((line, i) => [i + 1, line])
      .filter(([, line]) => VENDOR_NAMES.test(line))
      // one deliberate exception: the back-compat read of the legacy field name
      .filter(([, line]) => !line.includes('legacy'))
      .filter(([, line]) => !/prioritized\?\.databricksFeatures/.test(line));

    assert.deepEqual(hits, [],
      `${rel} names a vendor in shared layout code:\n` +
      hits.map(([n, l]) => `  ${n}: ${l.trim()}`).join('\n'));
  }
});

test('the report reads a vendor-neutral capability field', () => {
  const src = read('client/src/components/AssessmentResultsNew.js');
  assert.match(src, /prioritized\?\.capabilities/,
    'report must read `capabilities` first');
  assert.match(src, /prioritized\?\.capabilities \|\| prioritized\?\.databricksFeatures/,
    'report must still fall back to the legacy field so persisted assessments render');
});

test('every provider emits the same capability shape', () => {
  const result = gcp.recommendationsForPillar('platform_governance', {
    painPoints: ['data_silos', 'governance_policy_gap']
  });

  assert.ok(result.capabilities.length > 0);
  for (const capability of result.capabilities) {
    assert.deepEqual(
      Object.keys(capability).sort(),
      ['description', 'docs', 'id', 'matched', 'name', 'releaseDate'],
      'capability shape drifted from the shared contract'
    );
  }
});

test('normalization accepts both legacy and current field names', () => {
  const legacy = shape.readCapabilities({
    databricksFeatures: [{ name: 'Some Feature', description: 'x', docs: 'https://example.com' }]
  });
  const current = shape.readCapabilities({
    capabilities: [{ name: 'Some Feature', description: 'x', docs: 'https://example.com' }]
  });

  assert.equal(legacy.length, 1);
  assert.deepEqual(Object.keys(legacy[0]).sort(), Object.keys(current[0]).sort());
});

test('normalization drops unusable entries rather than rendering blanks', () => {
  const out = shape.normalizeCapabilities([null, {}, { description: 'no name' }, { name: 'Real' }]);
  assert.equal(out.length, 1);
  assert.equal(out[0].name, 'Real');
});

test('provider pages share one accent — vendor identity comes from content, not colour', () => {
  const shell = read('client/src/components/providers/ProviderHomeShell.js');
  assert.match(shell, /export const PROVIDER_ACCENT/);

  for (const page of ['GcpAssessmentHome', 'DatabricksAssessmentHome']) {
    const src = read(`client/src/components/providers/${page}.js`);
    assert.match(src, /accent=\{PROVIDER_ACCENT\}/, `${page} must use the shared accent`);
    assert.doesNotMatch(src, /accent="#/, `${page} hardcodes a vendor colour`);
  }
});
