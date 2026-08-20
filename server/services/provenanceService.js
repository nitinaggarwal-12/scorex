'use strict';

/**
 * ScoreX quantitative-claim provenance policy.
 *
 * A number is allowed to look factual only when it is:
 *  - assessment-derived: calculated directly from ScoreX responses/scores;
 *  - customer-provided: supplied explicitly by the customer/user;
 *  - external-sourced: accompanied by a concrete source record; or
 *  - scenario-estimate: clearly labelled as an assumption/model, never a benchmark.
 *
 * Unverified peer statistics, market shares, ROI percentages and research attributions are
 * never promoted to factual output.
 */

const CLAIM_TYPES = Object.freeze({
  ASSESSMENT_DERIVED: 'assessment-derived',
  CUSTOMER_PROVIDED: 'customer-provided',
  EXTERNAL_SOURCED: 'external-sourced',
  SCENARIO_ESTIMATE: 'scenario-estimate',
  UNVERIFIED: 'unverified'
});

const EXTERNAL_DATA_DISCLAIMER =
  'No verified external peer benchmark dataset was supplied. Peer percentiles, industry averages, market-distribution statistics and external ROI claims are therefore not reported.';

const BASELINE_DISCLAIMER =
  'Financial impact requires customer-provided baseline costs and explicit scenario assumptions. ScoreX does not infer dollar value or ROI from maturity scores alone.';

const QUANTITATIVE_PATTERN = /(?:\$\s?\d|\b\d+(?:\.\d+)?\s?%|\b\d+(?:\.\d+)?x\b|\btop\s+\d+\b|\bpercentile\b|\bquartile\b|\bmedian\b|\bindustry\s+average\b|\bsample\s+size\b|\bconfidence\s+level\b)/i;
const PEER_CLAIM_PATTERN = /\b(peer|industry|market|competitor|benchmark|percentile|quartile|decile|median|leader)\b/i;
const ROI_CLAIM_PATTERN = /\b(roi|return|saving|savings|revenue|tco|payback|productivity|cost reduction|dollar.?at.?risk)\b/i;

function asFiniteNumber(value, fallback = null) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function round(value, digits = 2) {
  const n = asFiniteNumber(value);
  if (n === null) return null;
  const factor = 10 ** digits;
  return Math.round(n * factor) / factor;
}

function sourceIsValid(source) {
  if (!source || typeof source !== 'object') return false;
  const hasIdentity = Boolean(source.title || source.publisher || source.name);
  const hasLocator = Boolean(source.url || source.documentId || source.referenceId);
  return hasIdentity && hasLocator;
}

function normalizeSources(sources = []) {
  return (Array.isArray(sources) ? sources : [])
    .filter(sourceIsValid)
    .map((source) => ({
      title: String(source.title || source.name || 'External source').slice(0, 300),
      publisher: source.publisher ? String(source.publisher).slice(0, 200) : null,
      url: source.url ? String(source.url).slice(0, 2_000) : null,
      documentId: source.documentId || null,
      referenceId: source.referenceId || null,
      retrievedAt: source.retrievedAt || null,
      note: source.note ? String(source.note).slice(0, 1_000) : null
    }));
}

function claim(value, type, options = {}) {
  const sources = normalizeSources(options.sources || []);
  let verified = type !== CLAIM_TYPES.UNVERIFIED;
  if (type === CLAIM_TYPES.EXTERNAL_SOURCED) verified = sources.length > 0;

  return {
    value,
    type: verified ? type : CLAIM_TYPES.UNVERIFIED,
    verified,
    label: options.label || null,
    assumptions: Array.isArray(options.assumptions) ? options.assumptions : [],
    sources,
    note: options.note || null
  };
}

function assessmentClaim(value, label, note = null) {
  return claim(value, CLAIM_TYPES.ASSESSMENT_DERIVED, { label, note });
}

function customerClaim(value, label, note = null) {
  return claim(value, CLAIM_TYPES.CUSTOMER_PROVIDED, { label, note });
}

function scenarioClaim(value, label, assumptions = []) {
  return claim(value, CLAIM_TYPES.SCENARIO_ESTIMATE, {
    label,
    assumptions,
    note: 'Illustrative scenario output; validate assumptions before using for investment decisions.'
  });
}

function externalClaim(value, label, sources = []) {
  return claim(value, CLAIM_TYPES.EXTERNAL_SOURCED, { label, sources });
}

function unverifiedClaim(label, note = EXTERNAL_DATA_DISCLAIMER) {
  return claim(null, CLAIM_TYPES.UNVERIFIED, { label, note });
}

function textContainsUnsupportedQuantification(text) {
  return typeof text === 'string' && QUANTITATIVE_PATTERN.test(text);
}

function neutralizeGeneratedText(text, { externalSources = [], allowAssessmentNumbers = false } = {}) {
  if (typeof text !== 'string') return text;
  if (!textContainsUnsupportedQuantification(text)) return text;

  const hasSources = normalizeSources(externalSources).length > 0;
  if (hasSources) return text;

  // Assessment score statements such as "3.2/5" may be generated from supplied inputs.
  if (allowAssessmentNumbers && !PEER_CLAIM_PATTERN.test(text) && !ROI_CLAIM_PATTERN.test(text)) {
    return text;
  }

  if (ROI_CLAIM_PATTERN.test(text)) {
    return 'Requires customer baseline data and explicit scenario assumptions before financial impact can be quantified.';
  }
  return EXTERNAL_DATA_DISCLAIMER;
}

function sanitizeGeneratedNarrative(value, options = {}) {
  if (typeof value === 'string') return neutralizeGeneratedText(value, options);
  if (Array.isArray(value)) return value.map((item) => sanitizeGeneratedNarrative(item, options));
  if (!value || typeof value !== 'object') return value;

  const result = {};
  for (const [key, item] of Object.entries(value)) {
    result[key] = sanitizeGeneratedNarrative(item, options);
  }
  return result;
}

function getScoreFromPillar(pillar) {
  if (typeof pillar === 'number') return round(pillar, 2);
  if (!pillar || typeof pillar !== 'object') return null;
  return round(
    pillar.customerScore ?? pillar.score ?? pillar.currentScore ?? pillar.current ?? pillar.current_state,
    2
  );
}

function getTargetFromPillar(pillar, current) {
  if (!pillar || typeof pillar !== 'object') return null;
  const target = round(
    pillar.targetScore ?? pillar.futureScore ?? pillar.future ?? pillar.target ?? pillar.future_state,
    2
  );
  if (target !== null) return target;
  return current === null ? null : null;
}

function statusAgainstTarget(current, target) {
  if (current === null || target === null) return 'Target not supplied';
  const gap = round(target - current, 2);
  if (gap <= 0) return 'At or above stated target';
  if (gap <= 0.5) return 'Near stated target';
  if (gap <= 1.25) return 'Moderate target gap';
  return 'Priority target gap';
}

function buildAssessmentPillarAnalysis(pillarScores = {}) {
  const analysis = {};
  for (const [pillarId, raw] of Object.entries(pillarScores || {})) {
    const current = getScoreFromPillar(raw);
    const target = getTargetFromPillar(raw, current);
    const gapToTarget = current !== null && target !== null ? round(target - current, 2) : null;

    analysis[pillarId] = {
      pillar: raw?.name || pillarId,
      customerScore: current,
      targetScore: target,
      gapToTarget,
      status: statusAgainstTarget(current, target),
      competitiveGap: gapToTarget === null
        ? 'A target score was not supplied for this pillar.'
        : `${Math.max(0, gapToTarget).toFixed(1)} point gap to the stated target`,
      industryAverage: null,
      industryMedian: null,
      topQuartile: null,
      topDecile: null,
      percentileRank: null,
      provenance: {
        customerScore: assessmentClaim(current, 'Current maturity score'),
        targetScore: target === null ? unverifiedClaim('Target maturity score', 'Target not supplied') : assessmentClaim(target, 'Stated target maturity score'),
        peerStatistics: unverifiedClaim('External peer benchmark')
      }
    };
  }
  return analysis;
}

function sanitizeBenchmarkReport(report = {}, context = {}) {
  const externalSources = normalizeSources(context.externalSources || report.externalSources || []);
  const hasExternalDataset = externalSources.length > 0 && context.externalBenchmarkVerified === true;
  const pillarAnalysis = buildAssessmentPillarAnalysis(context.pillarScores || report.pillarAnalysis || {});
  const overallScore = round(context.overallScore ?? report?.metrics?.overallScore ?? report?.overallScore, 2);

  const safeExecutive = sanitizeGeneratedNarrative(report.executiveSummary || {}, {
    externalSources: hasExternalDataset ? externalSources : [],
    allowAssessmentNumbers: true
  });

  const safeRecommendations = sanitizeGeneratedNarrative(report.strategicRecommendations || {}, {
    externalSources: hasExternalDataset ? externalSources : [],
    allowAssessmentNumbers: false
  });

  const scoreValues = Object.values(pillarAnalysis)
    .map((p) => p.customerScore)
    .filter((v) => Number.isFinite(v));
  const maturityIndex = scoreValues.length
    ? round((scoreValues.reduce((sum, v) => sum + v, 0) / scoreValues.length) / 5 * 100, 1)
    : (overallScore === null ? null : round(overallScore / 5 * 100, 1));

  const radarChart = Object.entries(pillarAnalysis).map(([pillarId, p]) => ({
    pillar: p.pillar || pillarId,
    customerScore: p.customerScore,
    targetScore: p.targetScore,
    industryAverage: null,
    topQuartile: null
  }));

  return {
    ...report,
    reportType: hasExternalDataset ? 'verified-peer-benchmark' : 'assessment-positioning',
    title: hasExternalDataset ? 'Verified Peer Benchmark Report' : 'Assessment Positioning & Evidence Report',
    executiveSummary: {
      headline: safeExecutive.headline || 'Assessment-derived maturity positioning',
      keyFindings: Array.isArray(safeExecutive.keyFindings) ? safeExecutive.keyFindings : [],
      marketContext: hasExternalDataset
        ? safeExecutive.marketContext
        : 'Industry context is qualitative only because a verified peer dataset was not supplied.'
    },
    competitivePositioning: {
      overallRanking: {
        percentile: hasExternalDataset ? asFiniteNumber(report?.competitivePositioning?.overallRanking?.percentile) : null,
        tier: hasExternalDataset ? (report?.competitivePositioning?.overallRanking?.tier || 'Verified peer position') : 'Assessment-only view',
        peerGroup: hasExternalDataset ? (report?.competitivePositioning?.overallRanking?.peerGroup || context.industry || 'Verified peer dataset') : 'Verified peer dataset not connected',
        versusBenchmark: hasExternalDataset ? (report?.competitivePositioning?.overallRanking?.versusBenchmark || '') : EXTERNAL_DATA_DISCLAIMER
      },
      tierBreakdown: hasExternalDataset ? (report?.competitivePositioning?.tierBreakdown || null) : null,
      marketSegmentation: hasExternalDataset ? (report?.competitivePositioning?.marketSegmentation || null) : null
    },
    pillarAnalysis,
    competitiveIntelligence: sanitizeGeneratedNarrative(report.competitiveIntelligence || {}, {
      externalSources: hasExternalDataset ? externalSources : [],
      allowAssessmentNumbers: false
    }),
    industryTrends: sanitizeGeneratedNarrative(report.industryTrends || [], {
      externalSources: hasExternalDataset ? externalSources : [],
      allowAssessmentNumbers: false
    }),
    strategicRecommendations: safeRecommendations,
    businessImpact: {
      status: 'baseline-required',
      financialModelAvailable: false,
      disclaimer: BASELINE_DISCLAIMER
    },
    methodology: {
      mode: hasExternalDataset ? 'verified-external-benchmark' : 'assessment-relative',
      dataSource: hasExternalDataset
        ? externalSources.map((s) => s.title).join('; ')
        : 'ScoreX assessment responses and scoring framework',
      externalBenchmarkDataset: hasExternalDataset ? externalSources : null,
      sampleSize: hasExternalDataset ? (report?.methodology?.sampleSize ?? null) : null,
      confidenceLevel: hasExternalDataset ? (report?.methodology?.confidenceLevel ?? null) : null,
      disclaimer: hasExternalDataset
        ? 'External statistics are reported only where a concrete source record is attached.'
        : EXTERNAL_DATA_DISCLAIMER,
      claimPolicy: 'provenance-v1'
    },
    metrics: {
      overallScore,
      assessmentMaturityIndex: maturityIndex,
      overallPercentile: hasExternalDataset ? asFiniteNumber(report?.metrics?.overallPercentile) : null,
      externalBenchmarkingAvailable: hasExternalDataset
    },
    visualizations: {
      radarChart,
      percentileDistribution: hasExternalDataset ? (report?.visualizations?.percentileDistribution || null) : null,
      pillarComparison: Object.entries(pillarAnalysis).map(([pillarId, p]) => ({
        pillar: p.pillar || pillarId,
        customerScore: p.customerScore,
        targetScore: p.targetScore,
        industryAverage: null,
        topQuartile: null
      })),
      trendData: report?.visualizations?.trendData || null
    },
    provenance: {
      policy: 'provenance-v1',
      generatedAt: new Date().toISOString(),
      overallScore: assessmentClaim(overallScore, 'Overall maturity score'),
      maturityIndex: assessmentClaim(maturityIndex, 'Assessment maturity index (score / 5)'),
      peerStatistics: hasExternalDataset
        ? externalClaim('available', 'Verified peer statistics', externalSources)
        : unverifiedClaim('Peer statistics'),
      financialImpact: unverifiedClaim('Financial impact', BASELINE_DISCLAIMER)
    },
    metadata: {
      ...(report.metadata || {}),
      claimPolicy: 'provenance-v1',
      externalBenchmarkingAvailable: hasExternalDataset,
      generatedAt: new Date().toISOString()
    }
  };
}

module.exports = {
  CLAIM_TYPES,
  EXTERNAL_DATA_DISCLAIMER,
  BASELINE_DISCLAIMER,
  asFiniteNumber,
  round,
  normalizeSources,
  claim,
  assessmentClaim,
  customerClaim,
  scenarioClaim,
  externalClaim,
  unverifiedClaim,
  neutralizeGeneratedText,
  sanitizeGeneratedNarrative,
  buildAssessmentPillarAnalysis,
  sanitizeBenchmarkReport
};
