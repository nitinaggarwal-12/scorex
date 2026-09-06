'use strict';

const geminiService = require('./geminiService');
const provenance = require('./provenanceService');

/**
 * Evidence-first assessment positioning.
 *
 * This service intentionally does not maintain a synthetic industry benchmark table. External
 * percentile/average/market claims are produced only when a caller provides a verified dataset
 * with concrete source records. Without that evidence the report remains assessment-relative:
 * current score, stated target, target gap, strengths, risks and qualitative industry context.
 */
class IndustryBenchmarkingService {
  async generateComprehensiveBenchmarkReport(
    industry,
    assessment,
    overallScore,
    pillarScores,
    painPoints = [],
    options = {}
  ) {
    const context = {
      industry: industry || assessment?.industry || 'Industry not specified',
      assessment,
      overallScore: provenance.asFiniteNumber(overallScore, 0),
      pillarScores: pillarScores || {},
      painPoints: Array.isArray(painPoints) ? painPoints : [],
      externalSources: provenance.normalizeSources(options.externalSources || []),
      externalBenchmarkVerified: options.externalBenchmarkVerified === true
    };

    let generated = null;
    if (geminiService.isAvailable()) {
      try {
        generated = await geminiService.generateIndustryBenchmarkReport(context);
      } catch (error) {
        console.warn('[BenchmarkProvenance] AI qualitative context unavailable:', error.message);
      }
    }

    const base = generated || this.getFallbackReport(
      context.industry,
      context.assessment,
      context.overallScore,
      context.pillarScores,
      context.painPoints
    );

    return provenance.sanitizeBenchmarkReport(base, context);
  }

  buildBenchmarkingPrompt(industry, assessment, overallScore, pillarScores, painPoints = []) {
    return `
Create a qualitative assessment-positioning narrative for ${industry}.

TRUST POLICY — MANDATORY:
- Use only the ScoreX assessment values explicitly provided below as quantitative facts.
- Do not invent or estimate peer percentiles, industry averages, market shares, adoption rates,
  sample sizes, confidence levels, analyst-research findings, financial savings, ROI or payback.
- Do not attribute anything to an analyst/research firm unless a concrete source is supplied.
- If an external statistic would normally be useful, state that a verified benchmark dataset is
  required instead of supplying a number.
- Recommendations may be qualitative. Financial impact must say that customer baseline data and
  explicit assumptions are required.

Assessment inputs:
${JSON.stringify({
      organization: assessment?.organizationName || assessment?.customerName || 'Organization',
      industry,
      overallScore,
      pillarScores,
      painPoints
    }, null, 2)}

Return JSON with: executiveSummary, competitiveIntelligence, industryTrends,
strategicRecommendations. Preserve assessment numbers exactly; introduce no new quantitative claim.`;
  }

  enrichReportWithMetrics(report, overallScore, pillarScores, industry, assessment = null) {
    return provenance.sanitizeBenchmarkReport(report, {
      overallScore,
      pillarScores,
      industry,
      assessment,
      externalSources: [],
      externalBenchmarkVerified: false
    });
  }

  extractPillarPercentiles() {
    // Kept for backward API compatibility. Percentiles are unavailable without peer data.
    return {};
  }

  calculateStrengthScore(pillarAnalysis = {}) {
    const scores = Object.values(pillarAnalysis)
      .map((p) => provenance.asFiniteNumber(p?.customerScore ?? p?.score))
      .filter((v) => v !== null);
    if (!scores.length) return null;
    return provenance.round((scores.reduce((sum, v) => sum + v, 0) / scores.length) / 5 * 100, 1);
  }

  calculateVulnerabilityScore(pillarAnalysis = {}) {
    const gaps = Object.values(pillarAnalysis)
      .map((p) => provenance.asFiniteNumber(p?.gapToTarget))
      .filter((v) => v !== null && v > 0);
    if (!gaps.length) return 0;
    return provenance.round(gaps.reduce((sum, v) => sum + v, 0) / gaps.length, 2);
  }

  calculateCompetitiveIndex() {
    // An empirical competitive index requires peer observations; never infer it from maturity alone.
    return null;
  }

  generateRadarChartData(pillarAnalysis = {}) {
    return Object.entries(pillarAnalysis).map(([pillarId, data]) => ({
      pillar: data?.pillar || this.getPillarDisplayName(pillarId),
      customerScore: provenance.asFiniteNumber(data?.customerScore ?? data?.score),
      targetScore: provenance.asFiniteNumber(data?.targetScore),
      industryAverage: null,
      topQuartile: null
    }));
  }

  generatePercentileDistribution() {
    return null;
  }

  generatePillarComparison(pillarAnalysis = {}) {
    return this.generateRadarChartData(pillarAnalysis);
  }

  generateTrendData(assessment = null) {
    const history = assessment?.scoreHistory || assessment?.history;
    if (!Array.isArray(history)) return null;
    return history
      .filter((entry) => provenance.asFiniteNumber(entry?.score) !== null)
      .map((entry) => ({
        date: entry.date || entry.timestamp || null,
        score: provenance.asFiniteNumber(entry.score),
        type: 'assessment-derived'
      }));
  }

  getPillarDisplayName(pillarId) {
    return String(pillarId || '')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  getFallbackReport(industry, assessment, overallScore, pillarScores, painPoints = []) {
    const pillarAnalysis = provenance.buildAssessmentPillarAnalysis(pillarScores || {});
    const entries = Object.entries(pillarAnalysis);

    const rankedByScore = [...entries]
      .filter(([, p]) => p.customerScore !== null)
      .sort((a, b) => b[1].customerScore - a[1].customerScore);
    const rankedByGap = [...entries]
      .filter(([, p]) => p.gapToTarget !== null)
      .sort((a, b) => b[1].gapToTarget - a[1].gapToTarget);

    const strengths = rankedByScore.slice(0, 3).map(([id, p]) => ({
      pillar: p.pillar || this.getPillarDisplayName(id),
      evidence: `Current ScoreX maturity score: ${p.customerScore?.toFixed?.(1) ?? p.customerScore}/5.0`,
      implication: 'Relative strength within this assessment; this is not a peer-ranking claim.'
    }));

    const vulnerabilities = rankedByGap
      .filter(([, p]) => p.gapToTarget > 0)
      .slice(0, 3)
      .map(([id, p]) => ({
        pillar: p.pillar || this.getPillarDisplayName(id),
        evidence: `${p.gapToTarget.toFixed(1)} point gap to the organization\'s stated target`,
        implication: 'Prioritize discovery and delivery planning for this target-state gap.'
      }));

    const priorityPillars = rankedByGap
      .filter(([, p]) => p.gapToTarget > 0)
      .slice(0, 4)
      .map(([id, p]) => p.pillar || this.getPillarDisplayName(id));

    const orgName = assessment?.organizationName || assessment?.customerName || 'The organization';
    const safePainPoints = (painPoints || []).slice(0, 5).map((p) => String(p).slice(0, 300));

    return {
      executiveSummary: {
        headline: `${orgName} has an assessment-derived maturity score of ${Number(overallScore || 0).toFixed(1)}/5.0.`,
        keyFindings: [
          strengths.length
            ? `Highest assessed maturity areas: ${strengths.map((s) => s.pillar).join(', ')}.`
            : 'No scored pillars were available to identify assessment-relative strengths.',
          priorityPillars.length
            ? `Largest gaps to stated targets: ${priorityPillars.join(', ')}.`
            : 'No current-to-target pillar gaps were available.',
          safePainPoints.length
            ? `Assessment evidence includes ${safePainPoints.length} recorded pain-point signal(s) that should be validated during planning.`
            : 'No explicit pain-point evidence was supplied for this report.'
        ],
        marketContext: 'Qualitative industry context can support planning, but peer statistics require a verified external benchmark dataset.'
      },
      competitivePositioning: {
        overallRanking: {
          percentile: null,
          tier: 'Assessment-only view',
          peerGroup: 'Verified peer dataset not connected',
          versusBenchmark: provenance.EXTERNAL_DATA_DISCLAIMER
        },
        tierBreakdown: null,
        marketSegmentation: null
      },
      pillarAnalysis,
      competitiveIntelligence: {
        strengths,
        vulnerabilities,
        whiteSpace: priorityPillars.map((pillar) => ({
          area: pillar,
          opportunity: 'Close the stated target-state gap and validate business value with customer baselines.'
        }))
      },
      industryTrends: [
        {
          trend: `${industry} architecture priorities should be validated against current, cited sources before being represented as market facts.`,
          implication: 'Treat external market context as qualitative until evidence is attached.'
        }
      ],
      strategicRecommendations: {
        immediate: priorityPillars.slice(0, 2).map((pillar) => ({
          action: `Validate target-state requirements and blockers for ${pillar}.`,
          expectedImpact: 'Impact requires customer baseline and success metrics; no financial estimate is inferred.'
        })),
        shortTerm: priorityPillars.slice(2, 4).map((pillar) => ({
          action: `Build an evidence-backed improvement plan for ${pillar}.`,
          expectedImpact: 'Measure against the organization\'s stated target score and operational KPIs.'
        })),
        longTerm: [{
          action: 'Connect a governed peer benchmark dataset if external competitive positioning is required.',
          expectedImpact: 'Enables sourced peer comparisons without synthetic statistics.'
        }]
      },
      businessImpact: {
        status: 'baseline-required',
        disclaimer: provenance.BASELINE_DISCLAIMER
      },
      methodology: {
        mode: 'assessment-relative',
        dataSource: 'ScoreX assessment responses and scoring framework',
        externalBenchmarkDataset: null,
        sampleSize: null,
        confidenceLevel: null,
        disclaimer: provenance.EXTERNAL_DATA_DISCLAIMER,
        claimPolicy: 'provenance-v1'
      },
      metadata: {
        generatedAt: new Date().toISOString(),
        claimPolicy: 'provenance-v1',
        externalBenchmarkingAvailable: false
      }
    };
  }
}

module.exports = new IndustryBenchmarkingService();
