const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '../..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');
const provenance = require('../../server/services/provenanceService');
const benchmarkingService = require('../../server/services/industryBenchmarkingService');

const activeFiles = [
  'server/services/industryBenchmarkingService.js',
  'server/services/geminiService.js',
  'server/routes/dynamicAssessments.js',
  'client/src/components/IndustryPeerBenchmarkingCard.js',
  'client/src/components/IndustryBenchmarkingReport.js',
  'client/src/components/ROICalculator.js',
  'client/src/components/FinancialImpactCard.js'
];

const forbiddenLiteralPatterns = [
  /Gartner Data & Analytics Research/i,
  /Forrester Wave Analysis/i,
  /35% of industry peers/i,
  /TCO by 30%/i,
  /75% savings/i,
  /75% discount/i,
  /sampleSize\s*[:=]\s*284/i,
  /confidenceLevel\s*[:=]\s*['"]95%['"]/i,
  /weightFactor\s*=\s*105000/i,
  /gap\s*\*\s*360000/i,
  /50K per engineer/i,
  /Math\.max\(120,\s*calculatedRoi\)/i,
  /percentile\s*=\s*78/i
];

test('active benchmark and value surfaces contain no known fabricated quantitative defaults', () => {
  for (const file of activeFiles) {
    const source = read(file);
    for (const pattern of forbiddenLiteralPatterns) {
      assert.doesNotMatch(source, pattern, `${file} contains prohibited unsupported claim pattern ${pattern}`);
    }
  }
});

test('provenance policy is wired into server benchmark generation', () => {
  const benchmarkService = read('server/services/industryBenchmarkingService.js');
  const dynamicRoute = read('server/routes/dynamicAssessments.js');
  const gemini = read('server/services/geminiService.js');

  assert.match(benchmarkService, /provenanceService/);
  assert.match(benchmarkService, /provenance-v1/);
  assert.match(dynamicRoute, /provenanceService/);
  assert.match(dynamicRoute, /externalBenchmarkDataset:\s*null/);
  assert.match(gemini, /QUANTITATIVE TRUST POLICY/);
  assert.match(gemini, /Never invent peer percentiles/i);
});

test('unsourced fake benchmark fields are removed while assessment evidence is preserved', () => {
  const report = provenance.sanitizeBenchmarkReport({
    competitivePositioning: {
      overallRanking: { percentile: 92, tier: 'Market Leader', peerGroup: 'Fake peers' }
    },
    pillarAnalysis: {
      governance: { name: 'Governance', score: 3.2, targetScore: 4.4, industryAverage: 2.9, topQuartile: 4.1, percentileRank: 84 }
    },
    methodology: { sampleSize: 284, confidenceLevel: '95%' },
    businessImpact: { roi: '300%' }
  }, {
    industry: 'Healthcare',
    overallScore: 3.2,
    pillarScores: {
      governance: { name: 'Governance', score: 3.2, targetScore: 4.4 }
    },
    externalSources: [],
    externalBenchmarkVerified: false
  });

  assert.equal(report.competitivePositioning.overallRanking.percentile, null);
  assert.equal(report.pillarAnalysis.governance.industryAverage, null);
  assert.equal(report.pillarAnalysis.governance.topQuartile, null);
  assert.equal(report.pillarAnalysis.governance.percentileRank, null);
  assert.equal(report.methodology.sampleSize, null);
  assert.equal(report.methodology.confidenceLevel, null);
  assert.equal(report.pillarAnalysis.governance.customerScore, 3.2);
  assert.equal(report.pillarAnalysis.governance.targetScore, 4.4);
  assert.equal(report.pillarAnalysis.governance.gapToTarget, 1.2);
  assert.equal(report.businessImpact.status, 'baseline-required');
  assert.match(report.methodology.disclaimer, /No verified external peer benchmark dataset/i);
});

test('external benchmark claims require an explicit verified source record', () => {
  const base = {
    competitivePositioning: { overallRanking: { percentile: 71, tier: 'Verified position', peerGroup: 'Peer set' } },
    metrics: { overallPercentile: 71 }
  };

  const withoutSource = provenance.sanitizeBenchmarkReport(base, {
    overallScore: 3.1,
    pillarScores: {},
    externalBenchmarkVerified: true,
    externalSources: []
  });
  assert.equal(withoutSource.competitivePositioning.overallRanking.percentile, null);

  const withSource = provenance.sanitizeBenchmarkReport(base, {
    overallScore: 3.1,
    pillarScores: {},
    externalBenchmarkVerified: true,
    externalSources: [{
      title: 'Peer Benchmark Dataset',
      publisher: 'Customer Analytics Team',
      documentId: 'benchmark-2026-08'
    }]
  });
  assert.equal(withSource.competitivePositioning.overallRanking.percentile, 71);
  assert.equal(withSource.methodology.mode, 'verified-external-benchmark');
  assert.equal(withSource.provenance.peerStatistics.verified, true);
});

test('financial quantitative narrative is neutralized without baselines', () => {
  const text = provenance.neutralizeGeneratedText('Expected ROI is 240% with 8 month payback and $2M savings.');
  assert.match(text, /Requires customer baseline data/i);
  assert.doesNotMatch(text, /240%|\$2M|8 month/i);
});

test('fallback positioning is assessment-relative and carries no peer statistics', () => {
  const report = benchmarkingService.getFallbackReport(
    'Financial Services',
    { organizationName: 'Example Co' },
    3.0,
    {
      governance: { name: 'Governance', score: 3.0, targetScore: 4.0 },
      ai: { name: 'AI', score: 2.2, targetScore: 4.2 }
    },
    []
  );

  assert.equal(report.competitivePositioning.overallRanking.percentile, null);
  assert.equal(report.methodology.sampleSize, null);
  assert.equal(report.methodology.confidenceLevel, null);
  assert.equal(report.pillarAnalysis.governance.customerScore, 3.0);
  assert.equal(report.pillarAnalysis.ai.gapToTarget, 2.0);
  assert.equal(report.businessImpact.status, 'baseline-required');
});

test('client ROI and financial cards label calculations as user scenarios, not maturity-derived facts', () => {
  const roi = read('client/src/components/ROICalculator.js');
  const financial = read('client/src/components/FinancialImpactCard.js');

  assert.match(roi, /No default savings assumptions are applied/);
  assert.match(roi, /customer\/user-provided inputs/);
  assert.match(roi, /scenario estimates/);
  assert.match(financial, /maturity gap does not imply a dollar value/i);
  assert.match(financial, /BASELINE REQUIRED/);
});

test('client benchmark surfaces do not default missing peer fields to a percentile or tier', () => {
  const card = read('client/src/components/IndustryPeerBenchmarkingCard.js');
  const report = read('client/src/components/IndustryBenchmarkingReport.js');

  assert.doesNotMatch(card, /percentile\s*=\s*\d+/);
  assert.doesNotMatch(card, /competitiveTier\s*=\s*['"][^'"]+['"]/);
  assert.doesNotMatch(report, /Top\s*\{?100\s*-\s*competitive/i);
  assert.match(report, /Score ÷ 5; this is not a peer percentile/);
  assert.match(report, /No verified external peer dataset connected/);
});
