const test = require('node:test');
const assert = require('node:assert/strict');

const provenance = require('../../server/services/provenanceService');
const RecommendationEngine = require('../../server/services/recommendationEngine');
const geminiService = require('../../server/services/geminiService');

const neutralize = (text) =>
  provenance.neutralizeGeneratedText(text, { allowAssessmentNumbers: true });

// Claims that are not derivable from a single customer's assessment must never ship
// as fact, whether or not they carry a pattern the quantitative matcher recognizes.
const UNSUPPORTED_CLAIMS = [
  '**Expected ROI:** **200-300% over 18-24 months** (Gartner reports avg ROI of 250%)',
  'Governance gaps create exposure. **The average GDPR fine is 2.7M EUR** (Gartner, 2024)',
  '**87% of data science projects never make it to production** (VentureBeat/Gartner).',
  'Only 53% of ML projects successfully deploy to production.',
  '**60% of organizations faced compliance penalties** in 2023.',
  'Organizations waste 32% of cloud spend on average due to idle resources.',
  'Forrester finds mature platforms cut time-to-insight by half.',
  'Poor data quality costs organizations 15-25% of revenue.'
];

// Statements derived from the customer's own answers, or purely qualitative guidance,
// must survive untouched — the policy is about provenance, not about removing numbers.
const SUPPORTED_STATEMENTS = [
  'Current overall maturity is 3.2/5 based on your responses.',
  'Your target state for Data Engineering is Level 4, a gap of 1.3 from today.',
  'Three of six pillars are below their target state.',
  'Establish a governance council with named owners for each data domain.',
  'Consolidate duplicate ingestion pipelines before adding new sources.'
];

test('analyst attributions are neutralized without a declared source', () => {
  for (const claim of UNSUPPORTED_CLAIMS) {
    assert.notEqual(neutralize(claim), claim, `claim shipped unchanged: ${claim}`);
  }
});

test('financial claims degrade to an explicit baseline request', () => {
  const out = neutralize('**Expected ROI:** **200-300% over 18-24 months** (Gartner, 2024)');
  assert.match(out, /customer baseline data/i);
});

test('assessment-derived and qualitative statements pass through unchanged', () => {
  for (const statement of SUPPORTED_STATEMENTS) {
    assert.equal(neutralize(statement), statement, `statement was wrongly stripped: ${statement}`);
  }
});

test('a declared source permits the claim to stand', () => {
  const claim = 'Gartner reports 40% of enterprises will adopt this by 2027.';
  const out = provenance.neutralizeGeneratedText(claim, {
    externalSources: [{ title: 'Gartner Market Guide', url: 'https://example.com/report' }]
  });
  assert.equal(out, claim);
});

test('recommendation engine summaries are sanitized line by line', () => {
  const engine = new RecommendationEngine();
  const summary = engine.generateOverallSummary(2.6, {
    platform_governance: 2.4,
    data_engineering: 2.8,
    analytics_bi: 3.0,
    machine_learning: 2.2,
    generative_ai: 1.9,
    operational_excellence: 2.7
  }, null, {});

  assert.equal(typeof summary, 'string');
  assert.doesNotMatch(summary, /Gartner|Forrester|IDC|VentureBeat/i,
    'analyst attribution leaked into the executive summary');
  assert.doesNotMatch(summary, /\d+\s?%\s+of\s+(?:\w+\s+){0,2}organi[sz]ations/i,
    'population statistic leaked into the executive summary');
});

test('recommendation engine output is not collapsed into a single disclaimer', () => {
  const engine = new RecommendationEngine();
  const summary = engine.generateOverallSummary(3.1, {
    platform_governance: 3.0,
    data_engineering: 3.2,
    analytics_bi: 3.4,
    machine_learning: 2.8,
    generative_ai: 2.5,
    operational_excellence: 3.1
  }, null, {});

  const disclaimers = (summary.match(/Requires customer baseline data/g) || []).length;
  assert.ok(summary.length > 200, 'summary was over-sanitized into near-nothing');
  assert.ok(disclaimers < 10, `summary collapsed into ${disclaimers} repeated disclaimers`);
});

test('gemini fallback chain contains no retired models', () => {
  const retired = [/gemini-1\.0/, /gemini-1\.5/, /gemini-2\.0-flash/];
  const chain = [geminiService.primaryModel, ...(geminiService.fallbackModels || [])];

  assert.ok(chain.length > 0, 'no model chain exposed for verification');
  for (const model of chain) {
    for (const pattern of retired) {
      assert.doesNotMatch(String(model), pattern, `retired model still in chain: ${model}`);
    }
  }
});
