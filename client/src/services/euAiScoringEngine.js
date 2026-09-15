/**
 * EU AI Act Statutory Scoring & Classification Engine
 * Deterministic regulatory decision tree and remediation task compiler
 */

import { EU_AI_QUESTIONS } from '../data/euAiComplianceData';

export function evaluateCompliance(answers = {}, meta = {}) {
  const answeredCount = Object.keys(answers).filter(k => answers[k]?.level1OptionId).length;
  const totalQuestions = EU_AI_QUESTIONS.length;
  const isComplete = answeredCount === totalQuestions;

  // 1. Overall Risk Tier Determination
  let overallRiskTier = 'Minimal / Low Risk (General Art. 4 Literacy Applies)';
  let riskTierBadgeColor = '#10b981'; // green
  let riskTierDescription = 'The system operates outside Annex I & III high-risk domains and does not deploy prohibited techniques. General Article 4 AI literacy obligations apply.';

  // Check Question 2 (GPAI Systemic Risk Art. 51-55)
  const q2Ans = answers['q2'];
  const isGpaiSystemic = q2Ans?.level1OptionId === '2.2' || q2Ans?.level1OptionId === '2.3';

  // Check Question 4 (Article 5 Prohibited Practices)
  const q4Ans = answers['q4'];
  const isUnacceptable = q4Ans?.level2OptionId === '4.2.1' || 
                         q4Ans?.level2OptionId === '4.3.1' || 
                         q4Ans?.level2OptionId === '4.3.2';

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

  // 2. Conformity Determination
  let conformityStatus = 'Compliant (Ready for Sign-off)';
  let conformityBadgeColor = '#10b981';
  let nonCompliantCount = 0;
  let remediationCount = 0;
  let compliantCount = 0;

  // 3. Remediation Tasks Collection
  const remediationTasks = [];

  EU_AI_QUESTIONS.forEach(q => {
    const userAns = answers[q.id];
    if (!userAns || !userAns.level1OptionId) return;

    const l1 = q.options.find(o => o.id === userAns.level1OptionId);
    if (!l1) return;

    const l2 = l1.subOptions?.find(s => s.id === userAns.level2OptionId);
    if (!l2) return;

    if (l2.complianceStatus === 'NON_COMPLIANT') {
      nonCompliantCount++;
    } else if (l2.complianceStatus === 'REMEDIATION_REQUIRED') {
      remediationCount++;
    } else {
      compliantCount++;
    }

    if (l2.remediation) {
      remediationTasks.push({
        id: `task_${q.id}_${l2.id.replace(/\./g, '_')}`,
        questionId: q.id,
        questionTitle: q.title,
        severity: l2.remediation.severity,
        article: l2.remediation.article,
        task: l2.remediation.task,
        targetOwner: l2.remediation.targetOwner,
        sourceLabel: l2.label,
        status: 'Todo'
      });
    }
  });

  if (isUnacceptable || nonCompliantCount > 0) {
    conformityStatus = 'Non-Compliant / Prohibited';
    conformityBadgeColor = '#ef4444';
  } else if (remediationCount > 0 || (overallRiskTier.includes('High-Risk') && remediationTasks.length > 0)) {
    conformityStatus = 'Remediation Required';
    conformityBadgeColor = '#ea580c';
  } else if (!isComplete) {
    conformityStatus = `In Progress (${answeredCount} of ${totalQuestions} Answered)`;
    conformityBadgeColor = '#3b82f6';
  }

  // 4. Compliance Health Score Calculation (0-100)
  // Max possible points based on total questions (20)
  let healthScore = 0;
  if (answeredCount > 0) {
    const totalAssessed = compliantCount + remediationCount + nonCompliantCount;
    if (totalAssessed > 0) {
      const rawPoints = (compliantCount * 5) + (remediationCount * 2.2) - (nonCompliantCount * 6);
      const maxPossible = totalAssessed * 5;
      healthScore = Math.max(0, Math.min(100, Math.round((rawPoints / maxPossible) * 100)));
    }
  }

  // 5. 7 Core Statutory Vectors Breakdown
  const vectorMap = {
    riskManagement: { name: 'Risk Management (Art. 9)', qIds: ['q4', 'q11', 'q20'], score: 0, weight: 1 },
    dataGovernance: { name: 'Data Governance & Bias (Art. 10)', qIds: ['q7', 'q8'], score: 0, weight: 1 },
    technicalDocs: { name: 'Technical Documentation (Art. 11)', qIds: ['q2', 'q10'], score: 0, weight: 1 },
    loggingRetention: { name: 'Logging & Retention (Art. 12)', qIds: ['q9'], score: 0, weight: 1 },
    humanOversight: { name: 'Human Oversight (Art. 14)', qIds: ['q12', 'q13', 'q14'], score: 0, weight: 1 },
    robustnessCyber: { name: 'Robustness & Cybersecurity (Art. 15)', qIds: ['q11'], score: 0, weight: 1 },
    transparency: { name: 'Transparency & Watermarking (Art. 50)', qIds: ['q18', 'q19'], score: 0, weight: 1 }
  };

  Object.keys(vectorMap).forEach(vKey => {
    const vector = vectorMap[vKey];
    let vPoints = 0;
    let vTotal = 0;

    vector.qIds.forEach(qid => {
      const uAns = answers[qid];
      if (!uAns?.level2OptionId) {
        vTotal += 100;
        vPoints += 40; // baseline if unassessed
        return;
      }

      const q = EU_AI_QUESTIONS.find(x => x.id === qid);
      const l1 = q?.options.find(o => o.id === uAns.level1OptionId);
      const l2 = l1?.subOptions?.find(s => s.id === uAns.level2OptionId);

      vTotal += 100;
      if (l2?.complianceStatus === 'COMPLIANT') {
        vPoints += 100;
      } else if (l2?.complianceStatus === 'REMEDIATION_REQUIRED') {
        vPoints += 55;
      } else {
        vPoints += 10;
      }
    });

    vector.score = Math.round(vPoints / (vTotal || 1));
  });

  // 6. Statutory Scorecard Generation
  const scorecardItems = [
    {
      article: 'Article 4',
      title: 'AI Literacy Framework',
      status: answers['q3']?.level2OptionId === '3.1.1' || answers['q3']?.level2OptionId === '3.1.2' ? 'PASSED' : 
              answers['q3']?.level2OptionId?.startsWith('3.2') ? 'REMEDIATION REQUIRED' : 
              answers['q3']?.level2OptionId?.startsWith('3.3') ? 'FAILED' : 'PENDING',
      notes: answers['q3']?.notes || 'Mandatory role-specific training curricula.'
    },
    {
      article: 'Article 5',
      title: 'Prohibited Practices Screen',
      status: isUnacceptable ? 'PROHIBITED / FAILED' : 
              answers['q4']?.level1OptionId === '4.1' ? 'PASSED' : 'REMEDIATION REQUIRED',
      notes: answers['q4']?.notes || 'Screening for subliminal distortion and biometric categorization.'
    },
    {
      article: 'Articles 6 & 25',
      title: 'Classification & Value Chain',
      status: answers['q1']?.level2OptionId === '1.3.1' || answers['q1']?.level2OptionId === '1.3.2' ? 'RECLASSIFIED AS PROVIDER' : 'PASSED',
      notes: answers['q1']?.notes || 'Value-chain liability and substantial modification analysis.'
    },
    {
      article: 'Article 10',
      title: 'Data Governance & Bias',
      status: answers['q7']?.level2OptionId?.startsWith('7.1') && answers['q8']?.level2OptionId?.startsWith('8.1') ? 'PASSED' : 'REMEDIATION REQUIRED',
      notes: `${answers['q7']?.notes || ''} ${answers['q8']?.notes || ''}`.trim() || 'Data provenance and statistical bias mitigations.'
    },
    {
      article: 'Article 11 & Annex IV',
      title: 'Technical Documentation',
      status: answers['q10']?.level2OptionId === '10.1.1' ? 'PASSED' : 'REMEDIATION REQUIRED',
      notes: answers['q10']?.notes || 'Comprehensive Annex IV technical dossier.'
    },
    {
      article: 'Article 12',
      title: 'Automatic Event Logging (WORM)',
      status: answers['q9']?.level2OptionId?.startsWith('9.1') ? 'PASSED' : 'REMEDIATION REQUIRED',
      notes: answers['q9']?.notes || 'Minimum 6-month tamper-resistant write-once logging.'
    },
    {
      article: 'Article 13',
      title: 'Transparency & Instructions for Use',
      status: answers['q13']?.level2OptionId?.startsWith('13.1') ? 'PASSED' : 'REMEDIATION REQUIRED',
      notes: answers['q13']?.notes || 'Instructions for use and automation bias cues.'
    },
    {
      article: 'Article 14',
      title: 'Human Oversight (HITL/HOTL)',
      status: answers['q12']?.level2OptionId?.startsWith('12.1') || answers['q12']?.level2OptionId?.startsWith('12.2') ? 'PASSED' : 'FAILED',
      notes: answers['q12']?.notes || 'Human-in-the-loop intervention and emergency kill-switch.'
    },
    {
      article: 'Article 15',
      title: 'Accuracy & Adversarial Hardening',
      status: answers['q11']?.level2OptionId?.startsWith('11.1') ? 'PASSED' : 'REMEDIATION REQUIRED',
      notes: answers['q11']?.notes || 'AI-specific penetration testing and prompt injection resilience.'
    },
    {
      article: 'Article 26(7)',
      title: 'Workplace Worker Notification',
      status: answers['q15']?.level2OptionId?.startsWith('15.1') ? 'PASSED' : 
              answers['q15']?.level2OptionId?.startsWith('15.2') ? 'IN PROGRESS (HELD)' : 'REMEDIATION REQUIRED',
      notes: answers['q15']?.notes || 'Works council / employee representative information notice.'
    },
    {
      article: 'Article 27',
      title: 'Fundamental Rights Impact Assessment (FRIA)',
      status: answers['q16']?.level2OptionId?.startsWith('16.1') || answers['q16']?.level2OptionId?.startsWith('16.3') ? 'PASSED' : 'REMEDIATION REQUIRED',
      notes: answers['q16']?.notes || 'Mandatory evaluation for public bodies and designated sectors.'
    },
    {
      article: 'Articles 49 & 71',
      title: 'EU Database Registration',
      status: answers['q17']?.level2OptionId?.startsWith('17.1') ? 'PASSED' : 'PENDING REGISTRATION',
      notes: answers['q17']?.notes || 'Annex VIII registration on official EU Central Database.'
    },
    {
      article: 'Article 50',
      title: 'Generative AI & Watermarking',
      status: answers['q18']?.level2OptionId?.startsWith('18.1') && (answers['q19']?.level2OptionId?.startsWith('19.1') || answers['q19']?.level2OptionId?.startsWith('19.2')) ? 'PASSED' : 'REMEDIATION REQUIRED',
      notes: answers['q18']?.notes || 'Conversational interaction disclosure and C2PA watermarking.'
    },
    {
      article: 'Articles 72 & 73',
      title: 'Post-Market Telemetry & Incident Reporting',
      status: answers['q20']?.level2OptionId?.startsWith('20.1') ? 'PASSED' : 'REMEDIATION REQUIRED',
      notes: answers['q20']?.notes || 'Production drift alerts and 15-day statutory incident SLA.'
    },
    {
      article: 'Article 86',
      title: 'Affected Individual Right to Explanation',
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
    stats: {
      compliantCount,
      remediationCount,
      nonCompliantCount,
      criticalRemediations: remediationTasks.filter(t => t.severity === 'CRITICAL').length,
      highRemediations: remediationTasks.filter(t => t.severity === 'HIGH').length,
      mediumRemediations: remediationTasks.filter(t => t.severity === 'MEDIUM').length
    },
    vectorBreakdown: vectorMap,
    remediationTasks,
    scorecardItems
  };
}
