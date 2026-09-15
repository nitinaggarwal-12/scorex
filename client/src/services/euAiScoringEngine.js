/**
 * EU AI Act Statutory Scoring, Weighting & Classification Engine
 * Deterministic regulatory decision tree, statutory penalty tier weighting,
 * live remediation resolution credit loop, multi-regulator fine stacking (AI Act + GDPR + NIS2),
 * mathematical score justification, and remediation task compiler.
 */

import { EU_AI_QUESTIONS } from '../data/euAiComplianceData';

/**
 * Statutory Weight Multipliers & Legal Justifications per Question (Regulation (EU) 2024/1689)
 * Justified directly by Article 99 Penalty Tiers & Pre-Market Conformity Enforcement Severity:
 * - Tier 1 (Weight 3.5x + Veto Cap): Art. 5 Prohibited Practices (Up to €35M or 7% Global Turnover)
 * - Tier 2 (Weight 2.0x - 2.5x): Art. 9-15 High-Risk Core Obligations, Art. 25 Provider Reclassification, Art. 51-55 GPAI Systemic Risk (Up to €15M or 3% Turnover)
 * - Tier 3 (Weight 1.5x - 1.8x): Art. 13, 26(7), 49, 50, 86 Transparency, Registry & Explainability Rights (€7.5M - €15M / 1.5% - 3% Turnover)
 * - Tier 4 (Weight 1.0x): Art. 4 General Staff AI Literacy Baseline
 */
export const QUESTION_STATUTORY_WEIGHTS = {
  q1: {
    weight: 2.5,
    tier: 'Tier 2: Value-Chain Liability (Art. 16 & 25)',
    maxFineRule: '€15M or 3% Worldwide Turnover',
    justification: 'Substantial modification or white-labeling transfers full €15M–€35M Provider statutory liabilities onto the deployer under Article 25.'
  },
  q2: {
    weight: 2.5,
    tier: 'Tier 2: GPAI Systemic Risk (Art. 51–55 & Art. 101)',
    maxFineRule: '€15M or 3% Worldwide Turnover',
    justification: 'Foundation models exceeding 10^25 FLOPs face direct European Commission AI Office enforcement, mandatory adversarial red-teaming, and systemic incident reporting.'
  },
  q3: {
    weight: 1.0,
    tier: 'Tier 4: Universal AI Literacy (Art. 4)',
    maxFineRule: 'Baseline Statutory Mandate (Enforced Feb 2, 2025)',
    justification: 'Applies universally across all AI systems; foundational operational requirement but carries lower direct financial penalty than Art. 5 or Art. 9–15 breaches.'
  },
  q4: {
    weight: 3.5,
    tier: 'Tier 1: Prohibited AI Practices (Art. 5 & Art. 99(3))',
    maxFineRule: '€35M or 7% Worldwide Turnover (STATUTORY VETO)',
    justification: 'Highest statutory severity under EU law. Any violation triggers an absolute market ban and hard-caps overall readiness below 25% regardless of other controls.'
  },
  q5: {
    weight: 2.2,
    tier: 'Tier 2: Annex I & III High-Risk Domain Scope (Art. 6)',
    maxFineRule: '€15M or 3% Worldwide Turnover',
    justification: 'Determines whether mandatory pre-market CE conformity assessment (Articles 8–15) and EU database registration legally apply.'
  },
  q6: {
    weight: 2.0,
    tier: 'Tier 2: Article 6(3) Derogation Substantiation',
    maxFineRule: '€15M or 3% Turnover + Art. 79 Market Withdrawal',
    justification: 'Invalid or undocumented Article 6(3) exemption claims result in immediate national surveillance authority market recall and uncertified high-risk operation fines.'
  },
  q7: {
    weight: 2.5,
    tier: 'Tier 2: Data Governance & Special Category PII (Art. 10 & GDPR Art. 9)',
    maxFineRule: '€15M / 3% (AI Act) + €20M / 4% (GDPR Art. 83)',
    justification: 'Dual statutory liability under EU AI Act Article 10 and GDPR Article 9/32 for training/inference on unredacted biometric or sensitive personal data.'
  },
  q8: {
    weight: 2.5,
    tier: 'Tier 2: Algorithmic Bias & Non-Discrimination (Art. 10(2)(f))',
    maxFineRule: '€15M or 3% Worldwide Turnover',
    justification: 'Core EU Charter of Fundamental Rights protection; statistical disparate impact in employment, credit, or healthcare triggers severe regulatory enforcement.'
  },
  q9: {
    weight: 2.0,
    tier: 'Tier 2: Automatic Event Logging & WORM Retention (Art. 12)',
    maxFineRule: '€15M or 3% Worldwide Turnover',
    justification: 'Without immutable Write-Once-Read-Many (WORM) logs retained for ≥6 months, post-incident forensic investigation by national authorities is impossible.'
  },
  q10: {
    weight: 2.0,
    tier: 'Tier 2: Annex IV Technical Documentation (Art. 11)',
    maxFineRule: '€15M or 3% Worldwide Turnover',
    justification: 'Mandatory statutory prerequisite for signing the EU Declaration of Conformity (Article 47) and affixing the CE Marking (Article 48).'
  },
  q11: {
    weight: 2.5,
    tier: 'Tier 2: Robustness, Accuracy & Cybersecurity (Art. 15)',
    maxFineRule: '€15M or 3% Worldwide Turnover',
    justification: 'Mandates resilience against prompt injection, data poisoning, model evasion, and adversarial attacks, intersecting directly with NIS2 and DORA.'
  },
  q12: {
    weight: 2.5,
    tier: 'Tier 2: Human Oversight & Kill-Switch Interlock (Art. 14)',
    maxFineRule: '€15M or 3% Worldwide Turnover',
    justification: 'High-risk systems cannot legally operate autonomously without verified Human-in-the-Loop (HITL) intervention and a <500ms safe stop switch.'
  },
  q13: {
    weight: 1.5,
    tier: 'Tier 3: Deployer Instructions for Use (IFU) (Art. 13)',
    maxFineRule: '€7.5M–€15M or 1.5%–3% Turnover',
    justification: 'Ensures downstream deployers understand system capabilities, confidence thresholds, and known failure modes.'
  },
  q14: {
    weight: 1.8,
    tier: 'Tier 3: Individual Right to Explanation (Art. 86)',
    maxFineRule: '€15M or 3% Turnover + Civil Litigation Exposure',
    justification: 'Grants natural persons directly affected by high-risk AI decisions a legally enforceable right to a clear, meaningful explanation of the decision logic.'
  },
  q15: {
    weight: 1.5,
    tier: 'Tier 3: Workplace Representative Notification (Art. 26(7))',
    maxFineRule: '€15M or 3% Turnover + Labor Injunctions',
    justification: 'Mandatory prior consultation and information notice to Works Councils and employee representatives before workplace AI deployment.'
  },
  q16: {
    weight: 2.2,
    tier: 'Tier 2: Fundamental Rights Impact Assessment (FRIA) (Art. 27)',
    maxFineRule: '€15M or 3% Worldwide Turnover',
    justification: 'Mandatory pre-deployment assessment for public bodies and private operators in banking, insurance, education, and essential services.'
  },
  q17: {
    weight: 1.5,
    tier: 'Tier 3: EU Central Database Registration (Art. 49 & 71)',
    maxFineRule: '€15M or 3% Turnover (Unregistered Operation)',
    justification: 'Public Annex VIII registration in the European Commission database is legally required prior to placing high-risk AI on the market.'
  },
  q18: {
    weight: 1.5,
    tier: 'Tier 3: Conversational AI User Disclosure (Art. 50(1))',
    maxFineRule: '€15M or 3% Worldwide Turnover',
    justification: 'Natural persons must be explicitly informed they are interacting with an AI system unless obvious from the context.'
  },
  q19: {
    weight: 1.5,
    tier: 'Tier 3: Synthetic Content & Deepfake Watermarking (Art. 50(2))',
    maxFineRule: '€15M or 3% Worldwide Turnover',
    justification: 'Generative AI outputs (audio, image, video, text) must embed machine-readable, tamper-evident cryptographic provenance (e.g. C2PA).'
  },
  q20: {
    weight: 2.0,
    tier: 'Tier 2: Post-Market Surveillance & 15-Day Incident SLA (Art. 72–73)',
    maxFineRule: '€15M or 3% Worldwide Turnover',
    justification: 'Continuous production drift monitoring and mandatory 15-day (or 2-day widespread infringement) serious incident reporting to national authorities.'
  }
};

/**
 * Granular option credit multiplier (0.00 to 1.00)
 * Evaluates complianceStatus, statutory question weight severity, and live remediation task overrides!
 */
function getOptionCreditMultiplier(qId, l1Id, l2Id, complianceStatus, taskOverrideStatus = null) {
  // If user marked the remediation task for this question as Completed or Resolved, grant full 1.00 credit!
  if (taskOverrideStatus === 'Completed' || taskOverrideStatus === 'Resolved') {
    return 1.0;
  }
  if (complianceStatus === 'COMPLIANT') {
    return 1.0;
  }
  if (complianceStatus === 'NON_COMPLIANT') {
    // If remediation is actively In Progress on a non-compliant item, grant partial 0.35 progress credit
    return taskOverrideStatus === 'In Progress' ? 0.35 : 0.0;
  }
  // REMEDIATION_REQUIRED granular differentiation:
  // High-weight Tier 2 core obligations (weight >= 2.2) carry stricter baseline credit (0.48) when un-remediated,
  // proving visually and mathematically how statutory weighting penalizes core technical gaps more than flat averages.
  const qWeight = QUESTION_STATUTORY_WEIGHTS[qId]?.weight || 1.5;
  let baseCredit = qWeight >= 2.2 ? 0.48 : 0.64;

  // If remediation task is marked 'In Progress', boost credit by +0.22
  if (taskOverrideStatus === 'In Progress') {
    baseCredit = Math.min(0.88, baseCredit + 0.22);
  }
  return Number(baseCredit.toFixed(2));
}

export function evaluateCompliance(answers = {}, meta = {}, financialConfig = {}, taskStatusOverrides = {}) {
  const answeredCount = Object.keys(answers).filter(k => answers[k]?.level1OptionId).length;
  const totalQuestions = EU_AI_QUESTIONS.length;
  const isComplete = answeredCount === totalQuestions;

  // Financial parameters (dynamic CFO simulator)
  const globalTurnoverMillions = Number(financialConfig.globalTurnoverMillions) || 2500; // Default €2.5B
  const isSme = Boolean(financialConfig.isSme); // Article 99(6) SME lower-of-two cap rule
  const includeConcurrentGdprNis2 = financialConfig.includeConcurrentGdprNis2 !== false; // Default true

  // 1. Overall Risk Tier Determination
  let overallRiskTier = 'Minimal / Low Risk (General Art. 4 Literacy Applies)';
  let riskTierBadgeColor = '#10b981'; // green
  let riskTierDescription = 'The system operates outside Annex I & III high-risk domains and does not deploy prohibited techniques. General Article 4 AI literacy obligations apply.';

  // Check Question 2 (GPAI Systemic Risk Art. 51-55)
  const q2Ans = answers['q2'];
  const isGpaiSystemic = q2Ans?.level1OptionId === '2.2' || q2Ans?.level1OptionId === '2.3';

  // Check Question 4 (Article 5 Prohibited Practices)
  const q4Ans = answers['q4'];
  const q4TaskId = q4Ans?.level2OptionId ? `task_q4_${q4Ans.level2OptionId.replace(/\./g, '_')}` : '';
  const isQ4Resolved = taskStatusOverrides[q4TaskId] === 'Completed' || taskStatusOverrides[q4TaskId] === 'Resolved';
  const isUnacceptable = !isQ4Resolved && (
    q4Ans?.level2OptionId === '4.2.1' || 
    q4Ans?.level2OptionId === '4.3.1' || 
    q4Ans?.level2OptionId === '4.3.2'
  );

  // Check Question 5 & 6 (High-Risk Domains & Derogations)
  const q5Ans = answers['q5'];
  const q6Ans = answers['q6'];
  const isCriticalDomain = ['5.1', '5.2', '5.3', '5.4'].includes(q5Ans?.level1OptionId);
  const isDerogationClaimed = q6Ans?.level1OptionId === '6.2';

  // Check Question 18 & 19 (Article 50 Transparency)
  const q18Ans = answers['q18'];
  const q19Ans = answers['q19'];
  const hasTransparencyObligation = ['18.1', '18.2'].includes(q18Ans?.level1OptionId) || 
                                   ['19.1', '19.2', '19.3'].includes(q19Ans?.level1OptionId);

  if (isUnacceptable) {
    overallRiskTier = 'Unacceptable Risk (Prohibited under Art. 5)';
    riskTierBadgeColor = '#ef4444'; // red
    riskTierDescription = 'CRITICAL STATUTORY BLOCKER: System utilizes prohibited techniques (e.g. emotion recognition in workplace or behavioral manipulation). Deployment is banned within the EU under Article 5.';
  } else if (isGpaiSystemic && !isCriticalDomain) {
    overallRiskTier = 'General-Purpose AI with Systemic Risk (Art. 51–55)';
    riskTierBadgeColor = '#dc2626'; // crimson
    riskTierDescription = 'Foundation model exceeds 10^25 FLOPs or exhibits high-impact systemic capabilities. Subject to mandatory Article 53 copyright/training summary AND Article 55 adversarial red-teaming, systemic risk mitigation, and EU AI Office incident reporting.';
  } else if (isCriticalDomain && !isDerogationClaimed) {
    overallRiskTier = 'High-Risk AI System (Full Articles 8–15 Enforceable)';
    riskTierBadgeColor = '#ea580c'; // deep orange
    riskTierDescription = 'System operates within Annex I or Annex III critical sectors (Employment, Essential Services, Product Safety). Mandatory pre-market CE marking, Annex IV technical dossier, and post-market logging are legally binding.';
  } else if (isCriticalDomain && isDerogationClaimed) {
    overallRiskTier = 'Qualified Narrow Exception (Article 6(3) Derogation)';
    riskTierBadgeColor = '#f59e0b'; // amber
    riskTierDescription = 'System falls in an Annex III domain but satisfies Article 6(3) procedural support criteria with zero profiling impact. Formal derogation documentation must be registered before launch.';
  } else if (hasTransparencyObligation) {
    overallRiskTier = 'Specific Transparency Risk (Article 50)';
    riskTierBadgeColor = '#8b5cf6'; // purple
    riskTierDescription = 'System interacts directly with natural persons or generates synthetic content. Mandatory user notifications and C2PA machine-readable watermarking apply under Article 50.';
  }

  // 2. Conformity & Weighted Mathematical Score Calculation (Live Remediation Loop Active)
  let conformityStatus = 'Compliant (Ready for Sign-off)';
  let conformityBadgeColor = '#10b981';
  let nonCompliantCount = 0;
  let remediationCount = 0;
  let compliantCount = 0;
  let resolvedRemediationCount = 0;

  const remediationTasks = [];
  const questionAuditTrail = [];

  let totalPossibleWeight = 0;
  let totalEarnedWeightedPoints = 0;
  let unweightedEarnedPoints = 0;
  let unweightedAssessedCount = 0;

  EU_AI_QUESTIONS.forEach(q => {
    const weightConfig = QUESTION_STATUTORY_WEIGHTS[q.id] || {
      weight: 1.5,
      tier: 'Tier 3: General Compliance Obligation',
      maxFineRule: '€15M or 3% Turnover',
      justification: 'Statutory requirement under Regulation (EU) 2024/1689.'
    };
    const qWeight = weightConfig.weight;
    totalPossibleWeight += qWeight;

    const userAns = answers[q.id];
    const l1 = q.options.find(o => o.id === userAns?.level1OptionId);
    const l2 = l1?.subOptions?.find(s => s.id === userAns?.level2OptionId);

    if (!userAns || !l1 || !l2) {
      questionAuditTrail.push({
        id: q.id,
        number: q.id.replace('q', ''),
        title: q.title,
        article: q.articleReference || weightConfig.tier.split(':')[0],
        weight: qWeight,
        tier: weightConfig.tier,
        maxFineRule: weightConfig.maxFineRule,
        justification: weightConfig.justification,
        selectedOptionLabel: 'Unanswered / Pending Assessment',
        complianceStatus: 'UNASSESSED',
        optionCreditMultiplier: 0,
        weightedPointsEarned: 0,
        maxWeightedPoints: qWeight
      });
      return;
    }

    const taskId = `task_${q.id}_${l2.id.replace(/\./g, '_')}`;
    const taskOverrideStatus = taskStatusOverrides[taskId] || null;
    const isTaskResolved = taskOverrideStatus === 'Completed' || taskOverrideStatus === 'Resolved';

    unweightedAssessedCount++;
    const creditMultiplier = getOptionCreditMultiplier(q.id, l1.id, l2.id, l2.complianceStatus, taskOverrideStatus);
    const earnedWeighted = Number((qWeight * creditMultiplier).toFixed(2));

    // Unweighted flat model gives 1.0 for COMPLIANT or resolved, 0.70 for REMEDIATION_REQUIRED, 0.0 for NON_COMPLIANT
    const flatCredit = isTaskResolved || l2.complianceStatus === 'COMPLIANT'
      ? 1.0
      : (l2.complianceStatus === 'REMEDIATION_REQUIRED' ? 0.70 : 0.0);

    totalEarnedWeightedPoints += earnedWeighted;
    unweightedEarnedPoints += flatCredit;

    if (isTaskResolved) {
      compliantCount++;
      if (l2.remediation) resolvedRemediationCount++;
    } else if (l2.complianceStatus === 'NON_COMPLIANT') {
      nonCompliantCount++;
    } else if (l2.complianceStatus === 'REMEDIATION_REQUIRED') {
      remediationCount++;
    } else {
      compliantCount++;
    }

    if (l2.remediation) {
      remediationTasks.push({
        id: taskId,
        questionId: q.id,
        questionTitle: q.title,
        severity: l2.remediation.severity,
        article: l2.remediation.article,
        task: l2.remediation.task,
        targetOwner: l2.remediation.targetOwner,
        sourceLabel: l2.label,
        statutoryWeight: qWeight,
        status: taskOverrideStatus || 'Todo'
      });
    }

    questionAuditTrail.push({
      id: q.id,
      number: q.id.replace('q', ''),
      title: q.title,
      article: q.articleReference || weightConfig.tier.split(':')[0],
      weight: qWeight,
      tier: weightConfig.tier,
      maxFineRule: weightConfig.maxFineRule,
      justification: weightConfig.justification,
      selectedOptionLabel: `${l1.label} → ${l2.label}`,
      complianceStatus: isTaskResolved ? 'COMPLIANT (REMEDIATED)' : l2.complianceStatus,
      optionCreditMultiplier: creditMultiplier,
      weightedPointsEarned: earnedWeighted,
      maxWeightedPoints: qWeight,
      notes: userAns.notes || ''
    });
  });

  // Sort remediation tasks by statutory weight * severity priority
  const severityRank = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
  remediationTasks.sort((a, b) => {
    const rankDiff = (severityRank[b.severity] || 0) - (severityRank[a.severity] || 0);
    if (rankDiff !== 0) return rankDiff;
    return (b.statutoryWeight || 1) - (a.statutoryWeight || 1);
  });

  const openRemediationTasks = remediationTasks.filter(t => {
    const st = taskStatusOverrides[t.id] || t.status;
    return st !== 'Completed' && st !== 'Resolved';
  });

  if (isUnacceptable || nonCompliantCount > 0) {
    conformityStatus = 'Non-Compliant / Prohibited';
    conformityBadgeColor = '#ef4444';
  } else if (openRemediationTasks.length > 0) {
    conformityStatus = 'Remediation Required';
    conformityBadgeColor = '#ea580c';
  } else if (!isComplete) {
    conformityStatus = `In Progress (${answeredCount} of ${totalQuestions} Answered)`;
    conformityBadgeColor = '#3b82f6';
  } else if (resolvedRemediationCount > 0) {
    conformityStatus = `Compliant (All ${resolvedRemediationCount} Remediation Tasks Verified)`;
    conformityBadgeColor = '#10b981';
  }

  // 3. Weighted Compliance Health Score vs Unweighted Score
  let rawWeightedPercentage = totalPossibleWeight > 0
    ? Math.round((totalEarnedWeightedPoints / totalPossibleWeight) * 100)
    : 0;
  const unweightedPercentage = unweightedAssessedCount > 0
    ? Math.round((unweightedEarnedPoints / totalQuestions) * 100)
    : 0;

  // Statutory Veto Override Rule: If Article 5 Prohibited Practice is active, cap readiness score at 18%
  let vetoTriggered = false;
  let vetoReason = null;
  let healthScore = rawWeightedPercentage;

  if (isUnacceptable) {
    vetoTriggered = true;
    vetoReason = 'Article 5 Prohibited AI Practice Veto Applied: Non-compliance with Article 5 cannot be offset by compliant technical documentation or logging elsewhere. Score hard-capped at 18% (Critical Non-Conformity).';
    healthScore = Math.min(rawWeightedPercentage, 18);
  } else if (nonCompliantCount > 0) {
    healthScore = Math.min(rawWeightedPercentage, 64);
  }

  // 4. 7 Core Statutory Vectors Breakdown (Weighted by Question Statutory Multipliers & Live Remediation Status)
  const vectorMap = {
    riskManagement: { name: 'Risk Management (Art. 9)', qIds: ['q4', 'q11', 'q20'], score: 0, weightSum: 0 },
    dataGovernance: { name: 'Data Governance & Bias (Art. 10)', qIds: ['q7', 'q8'], score: 0, weightSum: 0 },
    technicalDocs: { name: 'Technical Documentation (Art. 11)', qIds: ['q2', 'q10'], score: 0, weightSum: 0 },
    loggingRetention: { name: 'Logging & Retention (Art. 12)', qIds: ['q9'], score: 0, weightSum: 0 },
    humanOversight: { name: 'Human Oversight (Art. 14)', qIds: ['q12', 'q13', 'q14'], score: 0, weightSum: 0 },
    robustnessCyber: { name: 'Robustness & Cybersecurity (Art. 15)', qIds: ['q11'], score: 0, weightSum: 0 },
    transparency: { name: 'Transparency & Watermarking (Art. 50)', qIds: ['q18', 'q19'], score: 0, weightSum: 0 }
  };

  Object.keys(vectorMap).forEach(vKey => {
    const vector = vectorMap[vKey];
    let vWeightedEarned = 0;
    let vWeightedMax = 0;

    vector.qIds.forEach(qid => {
      const qWeight = QUESTION_STATUTORY_WEIGHTS[qid]?.weight || 1.5;
      vWeightedMax += qWeight;

      const uAns = answers[qid];
      const q = EU_AI_QUESTIONS.find(x => x.id === qid);
      const l1 = q?.options.find(o => o.id === uAns?.level1OptionId);
      const l2 = l1?.subOptions?.find(s => s.id === uAns?.level2OptionId);

      if (!l2) {
        vWeightedEarned += qWeight * 0.35;
      } else {
        const taskId = `task_${qid}_${l2.id.replace(/\./g, '_')}`;
        const credit = getOptionCreditMultiplier(qid, l1.id, l2.id, l2.complianceStatus, taskStatusOverrides[taskId]);
        vWeightedEarned += qWeight * credit;
      }
    });

    vector.weightSum = Number(vWeightedMax.toFixed(1));
    vector.score = Math.round((vWeightedEarned / (vWeightedMax || 1)) * 100);
  });

  // 5. Dynamic CFO Financial Penalty, Multi-Regulator Stacking & Remediation ROI Simulator
  const pctFineArt5 = Number((globalTurnoverMillions * 0.07).toFixed(2));
  const fixedFineArt5 = 35.0;
  const maxFineArt5Millions = isSme ? Math.min(fixedFineArt5, pctFineArt5) : Math.max(fixedFineArt5, pctFineArt5);

  const pctFineArt9to15 = Number((globalTurnoverMillions * 0.03).toFixed(2));
  const fixedFineArt9to15 = 15.0;
  const maxFineArt9to15Millions = isSme ? Math.min(fixedFineArt9to15, pctFineArt9to15) : Math.max(fixedFineArt9to15, pctFineArt9to15);

  const aiActCeilingMillions = isUnacceptable
    ? maxFineArt5Millions
    : (isCriticalDomain || isGpaiSystemic || nonCompliantCount > 0 || openRemediationTasks.length > 0 ? maxFineArt9to15Millions : 7.5);

  // Concurrent GDPR Art. 83(5) (4% or €20M) & NIS2 Art. 34 (2% or €10M) Fine Stacking
  const hasGdprPiiOrProfilingGap = openRemediationTasks.some(t => ['q7', 'q8', 'q14'].includes(t.questionId)) || nonCompliantCount > 0;
  const hasNis2CyberGap = openRemediationTasks.some(t => ['q9', 'q11', 'q20'].includes(t.questionId));

  const gdprFineMillions = (includeConcurrentGdprNis2 && hasGdprPiiOrProfilingGap)
    ? (isSme ? Math.min(20.0, globalTurnoverMillions * 0.04) : Math.max(20.0, globalTurnoverMillions * 0.04))
    : 0;
  const nis2FineMillions = (includeConcurrentGdprNis2 && hasNis2CyberGap)
    ? (isSme ? Math.min(10.0, globalTurnoverMillions * 0.02) : Math.max(10.0, globalTurnoverMillions * 0.02))
    : 0;

  const applicableStatutoryCeilingMillions = Number((aiActCeilingMillions + gdprFineMillions + nis2FineMillions).toFixed(2));

  // Probability-weighted Regulatory Value-at-Risk (VaR) drops dynamically as remediation tasks are marked Completed!
  const riskExposureFactor = openRemediationTasks.length === 0 && !isUnacceptable
    ? 0.01 // 99% risk reduction when all remediation tasks are resolved
    : Math.max(0.03, (100 - healthScore) / 100);

  const expectedValueAtRiskMillions = Number((applicableStatutoryCeilingMillions * riskExposureFactor * (isUnacceptable ? 0.95 : 0.42)).toFixed(2));

  const criticalOpenCount = openRemediationTasks.filter(t => t.severity === 'CRITICAL').length;
  const highOpenCount = openRemediationTasks.filter(t => t.severity === 'HIGH').length;
  const mediumOpenCount = openRemediationTasks.filter(t => t.severity === 'MEDIUM').length;

  const estimatedRemediationCostMillions = Number(
    Math.max(0.05, (criticalOpenCount * 0.18) + (highOpenCount * 0.09) + (mediumOpenCount * 0.04)).toFixed(2)
  );

  const netComplianceRoiMultiplier = estimatedRemediationCostMillions > 0
    ? Number((expectedValueAtRiskMillions / estimatedRemediationCostMillions).toFixed(1))
    : 12.5;

  const financialSimulation = {
    globalTurnoverMillions,
    isSme,
    includeConcurrentGdprNis2,
    aiActCeilingMillions: Number(aiActCeilingMillions.toFixed(2)),
    gdprFineMillions: Number(gdprFineMillions.toFixed(2)),
    nis2FineMillions: Number(nis2FineMillions.toFixed(2)),
    applicableArticleRule: isUnacceptable ? 'EU AI Act Art. 99(3) (7% / €35M)' : 'EU AI Act Art. 99(4) (3% / €15M)',
    smeRuleApplied: isSme ? 'Article 99(6) SME Protection Active (LOWER of Fixed Cap or Turnover %)' : 'Standard Enterprise Cap (HIGHER of Fixed Cap or Turnover %)',
    applicableStatutoryCeilingMillions,
    expectedValueAtRiskMillions,
    estimatedRemediationCostMillions,
    netSavingsAvoidedMillions: Number(Math.max(0, expectedValueAtRiskMillions - estimatedRemediationCostMillions).toFixed(2)),
    netComplianceRoiMultiplier
  };

  // 6. Dynamic Article 27 Fundamental Rights Impact Assessment (FRIA) 6-Point Statutory Matrix
  const friaCriteria = [
    {
      clause: 'Article 27(1)(a)',
      title: 'Deployer Processes & Intended Purpose Alignment',
      status: answers['q1']?.level2OptionId?.startsWith('1.1') || answers['q5']?.level1OptionId ? 'VERIFIED' : 'GAP DETECTED',
      assessment: answers['q5']?.notes || `System operates in ${meta.operatingDepartment || 'enterprise workflows'} with defined operational boundaries under ${overallRiskTier}.`
    },
    {
      clause: 'Article 27(1)(b)',
      title: 'Temporal & Geographic Scope of Affected Persons',
      status: answers['q17']?.level2OptionId?.startsWith('17.1') ? 'VERIFIED' : 'ACTION REQUIRED',
      assessment: `Continuous production deployment across EU member state jurisdictions; registered under Dossier ${meta.documentId || 'Active'}.`
    },
    {
      clause: 'Article 27(1)(c)',
      title: 'Specific Categories of Natural Persons & Vulnerable Groups',
      status: answers['q8']?.level2OptionId?.startsWith('8.1') || taskStatusOverrides['task_q8_8_2_1'] === 'Completed' ? 'VERIFIED (PROTECTED)' : 'HIGH EXPOSURE GAP',
      assessment: answers['q8']?.notes || 'Evaluates disparate impact across protected cohorts (age, gender, ethnicity, disability, employment applicants).'
    },
    {
      clause: 'Article 27(1)(d)',
      title: 'Specific Risks of Harm to Fundamental Rights (EU Charter)',
      status: isUnacceptable ? 'CRITICAL VIOLATION' : (answers['q4']?.level1OptionId === '4.1' ? 'MITIGATED' : 'REMEDIATION REQUIRED'),
      assessment: isUnacceptable ? 'Prohibited Article 5 practice detected; severe fundamental rights infringement.' : 'Screened against non-discrimination, privacy (Art. 7/8 Charter), and human dignity.'
    },
    {
      clause: 'Article 27(1)(e)',
      title: 'Human Oversight Measures (Article 14 Implementation)',
      status: answers['q12']?.level2OptionId?.startsWith('12.1') ? 'VERIFIED (HITL ACTIVE)' : 'DEFICIENT OVERRIDE',
      assessment: answers['q12']?.notes || 'Requires dual-control human review prior to adverse citizen/employee decisions and <500ms kill-switch.'
    },
    {
      clause: 'Article 27(1)(f)',
      title: 'Internal Governance, Complaint Mechanism & Art. 86 Redress',
      status: answers['q14']?.level2OptionId?.startsWith('14.1') && (answers['q20']?.level2OptionId?.startsWith('20.1') || taskStatusOverrides['task_q20_20_2_1'] === 'Completed') ? 'VERIFIED' : 'REMEDIATION REQUIRED',
      assessment: answers['q14']?.notes || 'Provides affected individuals with plain-language decision explanations and a 15-day incident response workflow.'
    }
  ];

  // 7. Statutory Scorecard Generation
  const scorecardItems = [
    {
      article: 'Article 4',
      title: 'AI Literacy Framework',
      weight: '1.0x',
      status: answers['q3']?.level2OptionId === '3.1.1' || answers['q3']?.level2OptionId === '3.1.2' ? 'PASSED' : 
              answers['q3']?.level2OptionId?.startsWith('3.2') ? 'REMEDIATION REQUIRED' : 
              answers['q3']?.level2OptionId?.startsWith('3.3') ? 'FAILED' : 'PENDING',
      notes: answers['q3']?.notes || 'Mandatory role-specific training curricula.'
    },
    {
      article: 'Article 5',
      title: 'Prohibited Practices Screen',
      weight: '3.5x (Veto)',
      status: isUnacceptable ? 'PROHIBITED / FAILED' : 
              answers['q4']?.level1OptionId === '4.1' ? 'PASSED' : 'REMEDIATION REQUIRED',
      notes: answers['q4']?.notes || 'Screening for subliminal distortion and biometric categorization.'
    },
    {
      article: 'Articles 6 & 25',
      title: 'Classification & Value Chain',
      weight: '2.5x',
      status: answers['q1']?.level2OptionId === '1.3.1' || answers['q1']?.level2OptionId === '1.3.2' ? 'RECLASSIFIED AS PROVIDER' : 'PASSED',
      notes: answers['q1']?.notes || 'Value-chain liability and substantial modification analysis.'
    },
    {
      article: 'Article 10',
      title: 'Data Governance & Bias',
      weight: '2.5x',
      status: (answers['q7']?.level2OptionId?.startsWith('7.1') || taskStatusOverrides['task_q7_7_2_1'] === 'Completed') &&
              (answers['q8']?.level2OptionId?.startsWith('8.1') || taskStatusOverrides['task_q8_8_2_1'] === 'Completed') ? 'PASSED' : 'REMEDIATION REQUIRED',
      notes: `${answers['q7']?.notes || ''} ${answers['q8']?.notes || ''}`.trim() || 'Data provenance and statistical bias mitigations.'
    },
    {
      article: 'Article 11 & Annex IV',
      title: 'Technical Documentation',
      weight: '2.0x',
      status: answers['q10']?.level2OptionId === '10.1.1' ? 'PASSED' : 'REMEDIATION REQUIRED',
      notes: answers['q10']?.notes || 'Comprehensive Annex IV technical dossier.'
    },
    {
      article: 'Article 12',
      title: 'Automatic Event Logging (WORM)',
      weight: '2.0x',
      status: answers['q9']?.level2OptionId?.startsWith('9.1') || taskStatusOverrides['task_q9_9_2_1'] === 'Completed' ? 'PASSED' : 'REMEDIATION REQUIRED',
      notes: answers['q9']?.notes || 'Minimum 6-month tamper-resistant write-once logging.'
    },
    {
      article: 'Article 13',
      title: 'Transparency & Instructions for Use',
      weight: '1.5x',
      status: answers['q13']?.level2OptionId?.startsWith('13.1') ? 'PASSED' : 'REMEDIATION REQUIRED',
      notes: answers['q13']?.notes || 'Instructions for use and automation bias cues.'
    },
    {
      article: 'Article 14',
      title: 'Human Oversight (HITL/HOTL)',
      weight: '2.5x',
      status: answers['q12']?.level2OptionId?.startsWith('12.1') || answers['q12']?.level2OptionId?.startsWith('12.2') ? 'PASSED' : 'FAILED',
      notes: answers['q12']?.notes || 'Human-in-the-loop intervention and emergency kill-switch.'
    },
    {
      article: 'Article 15',
      title: 'Accuracy & Adversarial Hardening',
      weight: '2.5x',
      status: answers['q11']?.level2OptionId?.startsWith('11.1') || taskStatusOverrides['task_q11_11_2_1'] === 'Completed' ? 'PASSED' : 'REMEDIATION REQUIRED',
      notes: answers['q11']?.notes || 'AI-specific penetration testing and prompt injection resilience.'
    },
    {
      article: 'Article 26(7)',
      title: 'Workplace Worker Notification',
      weight: '1.5x',
      status: answers['q15']?.level2OptionId?.startsWith('15.1') || taskStatusOverrides['task_q15_15_2_1'] === 'Completed' ? 'PASSED' : 
              answers['q15']?.level2OptionId?.startsWith('15.2') ? 'IN PROGRESS (HELD)' : 'REMEDIATION REQUIRED',
      notes: answers['q15']?.notes || 'Works council / employee representative information notice.'
    },
    {
      article: 'Article 27',
      title: 'Fundamental Rights Impact Assessment (FRIA)',
      weight: '2.2x',
      status: answers['q16']?.level2OptionId?.startsWith('16.1') || answers['q16']?.level2OptionId?.startsWith('16.3') ? 'PASSED' : 'REMEDIATION REQUIRED',
      notes: answers['q16']?.notes || 'Mandatory evaluation for public bodies and designated sectors.'
    },
    {
      article: 'Articles 49 & 71',
      title: 'EU Database Registration',
      weight: '1.5x',
      status: answers['q17']?.level2OptionId?.startsWith('17.1') || taskStatusOverrides['task_q17_17_2_1'] === 'Completed' ? 'PASSED' : 'PENDING REGISTRATION',
      notes: answers['q17']?.notes || 'Annex VIII registration on official EU Central Database.'
    },
    {
      article: 'Article 50',
      title: 'Generative AI & Watermarking',
      weight: '1.5x',
      status: answers['q18']?.level2OptionId?.startsWith('18.1') && (answers['q19']?.level2OptionId?.startsWith('19.1') || answers['q19']?.level2OptionId?.startsWith('19.2')) ? 'PASSED' : 'REMEDIATION REQUIRED',
      notes: answers['q18']?.notes || 'Conversational interaction disclosure and C2PA watermarking.'
    },
    {
      article: 'Articles 72 & 73',
      title: 'Post-Market Telemetry & Incident Reporting',
      weight: '2.0x',
      status: answers['q20']?.level2OptionId?.startsWith('20.1') || taskStatusOverrides['task_q20_20_2_1'] === 'Completed' ? 'PASSED' : 'REMEDIATION REQUIRED',
      notes: answers['q20']?.notes || 'Production drift alerts and 15-day statutory incident SLA.'
    },
    {
      article: 'Article 86',
      title: 'Affected Individual Right to Explanation',
      weight: '1.8x',
      status: answers['q14']?.level2OptionId?.startsWith('14.1') || answers['q14']?.level2OptionId?.startsWith('14.2') ? 'PASSED' : 'FAILED',
      notes: answers['q14']?.notes || 'Delivery of plain-language decision rationale upon request.'
    }
  ];

  return {
    meta,
    answeredCount,
    totalQuestions,
    isComplete,
    overallRiskTier,
    riskTierBadgeColor,
    riskTierDescription,
    conformityStatus,
    conformityBadgeColor,
    healthScore,
    weightedBreakdown: {
      totalPossibleWeight: Number(totalPossibleWeight.toFixed(1)),
      totalEarnedWeightedPoints: Number(totalEarnedWeightedPoints.toFixed(2)),
      rawWeightedPercentage,
      unweightedPercentage,
      weightingDelta: healthScore - unweightedPercentage,
      vetoTriggered,
      vetoReason,
      questionAuditTrail
    },
    financialSimulation,
    friaCriteria,
    stats: {
      compliantCount,
      remediationCount,
      nonCompliantCount,
      openRemediationCount: openRemediationTasks.length,
      resolvedRemediationCount,
      criticalRemediations: criticalOpenCount,
      highRemediations: highOpenCount,
      mediumRemediations: mediumOpenCount
    },
    vectorBreakdown: vectorMap,
    remediationTasks,
    openRemediationTasks,
    scorecardItems,
    cisoBriefing: {
      securityPostureStatus: (answers['q11']?.level2OptionId?.startsWith('11.1') || taskStatusOverrides['task_q11_11_2_1'] === 'Completed') &&
                             (answers['q9']?.level2OptionId?.startsWith('9.1') || taskStatusOverrides['task_q9_9_2_1'] === 'Completed')
        ? 'HARDENED (ART. 12 & 15 COMPLIANT)'
        : (isUnacceptable ? 'CRITICAL STATUTORY VIOLATION (DECOMMISSION)' : 'ACTION REQUIRED (SECURITY & LOGGING GAPS)'),
      threatSurfaceVectors: [
        {
          vector: 'Adversarial Prompt / Input Injection & Data Poisoning (Art. 15(4))',
          mitreId: 'AML.T0051 / AML.T0020',
          status: answers['q11']?.level2OptionId?.startsWith('11.1') || taskStatusOverrides['task_q11_11_2_1'] === 'Completed' ? 'Mitigated' : 'Remediation Required',
          control: answers['q11']?.notes || 'Deploy runtime input sanitization, prompt guardrails, and adversarial red-teaming.'
        },
        {
          vector: 'Model Weight Exfiltration & Supply Chain Integrity',
          mitreId: 'AML.T0044 / SLSA-L3',
          status: answers['q2']?.level2OptionId?.startsWith('2.1') || answers['q2']?.level2OptionId?.startsWith('2.2') ? 'Mitigated' : 'Review Required',
          control: 'Cryptographic SHA-256 model signing, private VPC isolation, and zero-egress inference endpoints.'
        },
        {
          vector: 'Audit Trail Tampering & Non-Repudiation Failure (Art. 12)',
          mitreId: 'EU-AIA-ART12',
          status: answers['q9']?.level2OptionId?.startsWith('9.1') || taskStatusOverrides['task_q9_9_2_1'] === 'Completed' ? 'Mitigated (WORM Active)' : 'Gap Detected (<6 Mo Retention)',
          control: answers['q9']?.notes || 'Enforce immutable Write-Once-Read-Many (WORM) cold storage bucket with minimum 6-month statutory retention.'
        },
        {
          vector: 'PII / Biometric Special Category Data Leakage (Art. 10 & GDPR Art. 9)',
          mitreId: 'GDPR-ART9 / ART32',
          status: answers['q7']?.level2OptionId?.startsWith('7.1') || taskStatusOverrides['task_q7_7_2_1'] === 'Completed' ? 'Mitigated' : 'Remediation Required',
          control: answers['q7']?.notes || 'Enforce automated PII/biometric redaction middleware prior to inference payload ingestion.'
        }
      ],
      crossFrameworkMapping: [
        { framework: 'NIS2 Directive (EU 2022/2555)', article: 'Art. 21 Risk Management & Supply Chain Security', alignment: answers['q11']?.level2OptionId?.startsWith('11.1') || taskStatusOverrides['task_q11_11_2_1'] === 'Completed' ? 'Aligned' : 'Partial Gap' },
        { framework: 'DORA (EU 2022/2554 Financial ICT)', article: 'Art. 8–11 ICT Resilience & Incident Classification', alignment: answers['q20']?.level2OptionId?.startsWith('20.1') || taskStatusOverrides['task_q20_20_2_1'] === 'Completed' ? 'Aligned' : 'Action Needed' },
        { framework: 'ISO/IEC 42001:2023 (AIMS)', article: 'Clause 6.1.2 AI Risk Assessment & Annex B Controls', alignment: healthScore >= 80 ? 'Certified Ready' : 'In Progress' },
        { framework: 'GDPR (EU 2016/679)', article: 'Art. 22 Automated Profiling & Art. 32 Security of Processing', alignment: answers['q14']?.level2OptionId?.startsWith('14.1') ? 'Aligned' : 'Review Required' }
      ],
      incidentResponseSla: {
        statutoryDeadline: isGpaiSystemic ? '24 Hours (Art. 55 Systemic Incident)' : '15 Days Max / 2 Days Widespread Infringement (Art. 73)',
        authorityTarget: isGpaiSystemic ? 'European Commission AI Office & ENISA' : 'National Market Surveillance Authority & CSIRT',
        currentReadiness: answers['q20']?.notes || 'Establish automated SIEM/SOAR webhook bridge to legal counsel and national authority reporting portal.'
      }
    },
    caioBriefing: {
      governanceMaturity: healthScore >= 85 ? 'OPTIMIZED (BOARD READY)' : (healthScore >= 65 ? 'MANAGED (REMEDIATION TRACKED)' : 'EXPOSED (IMMEDIATE GOVERNANCE INTERVENTION)'),
      valueChainRoleAnalysis: {
        currentRole: answers['q1']?.level1OptionId === '1.2' ? 'Upstream Provider (Art. 16 Full Liability)' :
                     answers['q1']?.level1OptionId === '1.3' ? 'De-Facto Provider via Modification (Art. 25 Liability Shift)' :
                     answers['q1']?.level1OptionId === '1.4' ? 'Distributor / Internal Enterprise Tooling' : 'Downstream Deployer (Art. 26 Obligations)',
        substantialModificationRisk: answers['q1']?.level1OptionId === '1.3' || answers['q1']?.level2OptionId === '1.1.2'
          ? 'HIGH ALERT: Fine-tuning or prompt modification outside vendor IFU transfers full €15M–€35M Provider obligations to your enterprise under Article 25.'
          : 'CONTROLLED: Operating within documented parameters preserves downstream Deployer boundaries.',
        conformityPathway: isUnacceptable ? 'PROHIBITED — CANNOT BE CE MARKED' :
                           isCriticalDomain ? 'Mandatory Pre-Market Conformity Assessment (Annex VI Internal Control or Annex VII Notified Body) + CE Marking + Art. 49 EU Database Registration' :
                           isGpaiSystemic ? 'Mandatory EU AI Office Notification + Annex XI/XII Technical Documentation + Art. 55 Adversarial Evaluations' :
                           'Self-Assessment & Article 50 Transparency / Article 4 Staff AI Literacy'
      },
      algorithmicFairnessAndData: {
        biasAuditStatus: answers['q8']?.level2OptionId?.startsWith('8.1') || taskStatusOverrides['task_q8_8_2_1'] === 'Completed' ? 'Disparate Impact & Equalized Odds Verified (<2% Variance)' : 'Disparate Impact Audit Pending / Gap Detected',
        dataProvenanceStatus: answers['q7']?.level2OptionId?.startsWith('7.1') || taskStatusOverrides['task_q7_7_2_1'] === 'Completed' ? 'Curated Lineage & TDM Copyright Opt-Out Verified' : 'Data Sanitization & Provenance Documentation Required',
        notes: answers['q8']?.notes || 'Implement automated pre-release demographic parity testing across gender, age, ethnicity, and disability cohorts.'
      },
      humanOversightAndExplainability: {
        hitlArchitecture: answers['q12']?.level2OptionId?.startsWith('12.1') ? 'Active Human-in-the-Loop (HITL) Dual-Control & Hardware/Software Stop Button (Art. 14)' : 'Human Oversight Protocol Deficient',
        explainabilityStandard: answers['q13']?.level2OptionId?.startsWith('13.1') && answers['q14']?.level2OptionId?.startsWith('14.1')
          ? 'SHAP/Counterfactual Feature Attribution + Art. 86 Plain-Language Individual Rationale Active'
          : 'Explainability & Operator Confidence Bounds Require Upgrade',
        aiLiteracyCompliance: answers['q3']?.level2OptionId?.startsWith('3.1') ? '100% Operator AI Literacy Certified (Art. 4)' : 'Mandatory Staff AI Literacy Training Required'
      },
      lifecycleMonitoringMetrics: [
        { metric: 'Population Stability Index (PSI) / Drift Threshold', target: '< 0.15 Quarterly Shift', currentStatus: answers['q20']?.level2OptionId?.startsWith('20.1') || taskStatusOverrides['task_q20_20_2_1'] === 'Completed' ? 'Monitored Active' : 'Unmonitored' },
        { metric: 'Disparate Impact Ratio (80% Rule / Four-Fifths Rule)', target: '0.85 – 1.15 Parity Band', currentStatus: answers['q8']?.level2OptionId?.startsWith('8.1') || taskStatusOverrides['task_q8_8_2_1'] === 'Completed' ? 'Verified Pass' : 'Audit Pending' },
        { metric: 'Hallucination / Factual Grounding Accuracy Rate', target: '> 98.5% Grounded Citations', currentStatus: answers['q11']?.level2OptionId?.startsWith('11.1') || taskStatusOverrides['task_q11_11_2_1'] === 'Completed' ? 'Within SLA' : 'Calibration Needed' },
        { metric: 'Human Override / Kill-Switch Latency (Art. 14(4)(e))', target: '< 500ms Safe Fallback', currentStatus: answers['q12']?.level2OptionId?.startsWith('12.1') ? 'Hardware/API Interlock Ready' : 'Not Implemented' }
      ]
    }
  };
}
