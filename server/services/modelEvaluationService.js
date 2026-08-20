'use strict';

const provenance = require('./provenanceService');
const observability = require('./observabilityService');

const SUSPICIOUS_KEYS = /(?:percentile|industryAverage|industryMedian|topQuartile|topDecile|marketShare|adoptionRate|sampleSize|confidenceLevel|roi|returnOnInvestment|savings|revenueImpact|payback|dollarAtRisk|financialImpact|costReduction)/i;
const FINANCIAL_KEYS = /(?:roi|returnOnInvestment|savings|revenueImpact|payback|dollarAtRisk|financialImpact|costReduction)/i;
const PEER_KEYS = /(?:percentile|industryAverage|industryMedian|topQuartile|topDecile|marketShare|adoptionRate|sampleSize|confidenceLevel)/i;

function hasVerifiedExternalSources(context = {}) {
  return context.externalBenchmarkVerified === true && provenance.normalizeSources(context.externalSources || []).length > 0;
}

function hasFinancialBaseline(context = {}) {
  return Boolean(context.financialBaselineVerified || context.customerBaselineProvided || (Array.isArray(context.assumptions) && context.assumptions.length));
}

function collectViolations(value, context = {}, path = '$', violations = []) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectViolations(item, context, `${path}[${index}]`, violations));
    return violations;
  }
  if (!value || typeof value !== 'object') return violations;

  for (const [key, item] of Object.entries(value)) {
    const itemPath = `${path}.${key}`;
    if (SUSPICIOUS_KEYS.test(key) && item !== null && item !== undefined && item !== '') {
      if (PEER_KEYS.test(key) && !hasVerifiedExternalSources(context)) {
        violations.push({ path: itemPath, type: 'unsourced-peer-quantification', key });
      }
      if (FINANCIAL_KEYS.test(key) && !hasFinancialBaseline(context)) {
        violations.push({ path: itemPath, type: 'unbased-financial-quantification', key });
      }
    }
    collectViolations(item, context, itemPath, violations);
  }
  return violations;
}

function nullUnsupportedFields(value, context = {}, corrections = [], path = '$') {
  if (Array.isArray(value)) {
    return value.map((item, index) => nullUnsupportedFields(item, context, corrections, `${path}[${index}]`));
  }
  if (!value || typeof value !== 'object') return value;

  const output = {};
  for (const [key, item] of Object.entries(value)) {
    const itemPath = `${path}.${key}`;
    const unsupportedPeer = PEER_KEYS.test(key) && item !== null && item !== undefined && item !== '' && !hasVerifiedExternalSources(context);
    const unsupportedFinancial = FINANCIAL_KEYS.test(key) && item !== null && item !== undefined && item !== '' && !hasFinancialBaseline(context);

    if (unsupportedPeer || unsupportedFinancial) {
      output[key] = null;
      corrections.push({ path: itemPath, reason: unsupportedPeer ? 'external-source-required' : 'customer-baseline-required' });
      continue;
    }

    if (typeof item === 'string') {
      const sanitized = provenance.neutralizeGeneratedText(item, {
        externalSources: hasVerifiedExternalSources(context) ? context.externalSources : [],
        allowAssessmentNumbers: context.allowAssessmentNumbers !== false
      });
      if (sanitized !== item) corrections.push({ path: itemPath, reason: 'unsupported-generated-quantification' });
      output[key] = sanitized;
    } else {
      output[key] = nullUnsupportedFields(item, context, corrections, itemPath);
    }
  }
  return output;
}

function evaluate(value, context = {}) {
  const violations = collectViolations(value, context);
  return {
    passed: violations.length === 0,
    violationCount: violations.length,
    violations,
    policy: 'model-eval-v1'
  };
}

function enforce(value, context = {}) {
  const before = evaluate(value, context);
  const corrections = [];
  const output = nullUnsupportedFields(value, context, corrections);
  const after = evaluate(output, context);
  const status = after.passed ? (corrections.length ? 'corrected' : 'passed') : 'rejected';
  observability.recordModelEvaluation(status);

  if (corrections.length || !after.passed) {
    observability.structuredLog(after.passed ? 'warn' : 'error', 'model_output_evaluation', {
      status,
      correctionCount: corrections.length,
      remainingViolationCount: after.violationCount,
      policy: 'model-eval-v1'
    });
  }

  return {
    output: after.passed ? output : null,
    evaluation: {
      ...after,
      status,
      corrected: corrections.length > 0,
      corrections
    }
  };
}

module.exports = {
  SUSPICIOUS_KEYS,
  collectViolations,
  evaluate,
  enforce
};
