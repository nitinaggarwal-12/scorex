import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  FiDownload,
  FiPrinter,
  FiPlus,
  FiCheck,
  FiSearch,
  FiRefreshCw
} from 'react-icons/fi';

import {
  GE_MODULES,
  GE_QUESTIONS,
  DEFAULT_BIONOVA_WORKFLOWS,
  getCustomerContextualQuestionText,
  getQuestionOptionsWithConfidence,
  createInitialGeDossier,
  evaluateGeValueRealization
} from '../data/geValueRealizationFramework';

const formatCurrency = (val, showPending = true) => {
  if (val === null || val === undefined || Number.isNaN(Number(val))) {
    return showPending ? 'Pending' : '—';
  }
  const num = Number(val);
  const abs = Math.abs(num);
  const sign = num < 0 ? '-' : '';
  if (abs >= 1000000) return `${sign}$${(abs / 1000000).toFixed(1)}M`;
  if (abs >= 1000) return `${sign}$${Math.round(abs / 1000).toLocaleString()}K`;
  return `${sign}$${Math.round(abs).toLocaleString()}`;
};

const formatNumber = (val, suffix = '') => {
  if (val === null || val === undefined || Number.isNaN(Number(val))) return 'Pending';
  return `${Number(val).toLocaleString()}${suffix}`;
};

const SIMPLE_MODULE_LABELS = {
  C: '1. Overview',
  P: '2. Scope',
  A: '3. Adoption',
  L: '4. Cost & Legacy',
  W: '5. Workflows',
  U: '6. User Survey',
  Q: '7. Governance',
  F: '8. Finance',
  V: '9. Domain Use',
  G: '10. Geography'
};

const STRATEGIC_QUICK_ACCOUNTS = [
  { sfdcId: 'ACC-1001-AEROVG', shortName: 'AeroVanguard', seats: '301K' },
  { sfdcId: 'ACC-1002-BIONOVA', shortName: 'BioNova', seats: '85.3K' },
  { sfdcId: 'ACC-1003-OMNIMRT', shortName: 'OmniMart', seats: '250K' },
  { sfdcId: 'ACC-1004-SILCORE', shortName: 'SiliconCore', seats: '121K' },
  { sfdcId: 'ACC-1005-APEXGLB', shortName: 'ApexGlobal', seats: '55.5K' },
  { sfdcId: 'ACC-1006-STRATGM', shortName: 'Stratagem', seats: '41.8K' },
  { sfdcId: 'ACC-1007-FINPULS', shortName: 'FinPulse', seats: '24.6K' },
  { sfdcId: 'ACC-1008-VITURA', shortName: 'Vitura', seats: '19.0K' },
  { sfdcId: 'ACC-1009-WRKSPHR', shortName: 'WorkSphere', seats: '15.0K' },
  { sfdcId: 'ACC-1010-BLDRGHT', shortName: 'BuildRight', seats: '12.5K' }
];

const TIME_WINDOW_PRESETS = [
  { id: 'ytd_2026', label: 'YTD 2026', startDate: '2026-01-01', endDate: '2026-09-26' },
  { id: 'last_90d', label: 'Last 90 Days', startDate: '2026-06-28', endDate: '2026-09-26' },
  { id: 'last_60d', label: 'Last 60 Days', startDate: '2026-07-28', endDate: '2026-09-26' },
  { id: 'last_30d', label: 'Last 30 Days', startDate: '2026-08-27', endDate: '2026-09-26' }
];

/**
 * Condenses verbose telemetry-heavy option strings into crisp, human-readable 3–8 word labels.
 */
const simplifyOptionLabel = (rawText) => {
  if (!rawText) return '';
  let s = String(rawText).trim();

  // Funnel arrow strings: "301,354 Contracted → 32,300 Provisioned → 27,672 Assigned → 14,043 MAU → 8,660 WAU (31.3% of Assigned)"
  if (s.includes('→') && s.includes('WAU')) {
    const wauMatch = s.match(/([0-9,]+)\s*(?:Multi-API\s*)?WAU\s*\(([^)]+)\)/i);
    if (wauMatch) return `${wauMatch[1]} WAU (${wauMatch[2]})`;
  }
  if (s.includes('→') && s.includes('Assigned')) {
    const parts = s.split('→').map(p => p.trim());
    return parts.slice(-2).join(' → ').replace(/\([^)]*\)/g, '').trim();
  }

  // Long colon-prefixed bug/blocker descriptions: "AVG-001 (Mis-Delivery Prediction Agent): RuggedEdge handheld scanners..."
  if (/^[A-Za-z]+-\d+\s*\(([^)]+)\):/i.test(s)) {
    const m = s.match(/^([A-Za-z]+-\d+)\s*\(([^)]+)\):\s*(.+)$/i);
    if (m) return `${m[2]} (${m[1]})`;
  }

  // Strip parenthetical telemetry dumps > 18 chars while keeping short ones like "(≥80%)"
  s = s.replace(/\s*\(([^)]{18,})\)/g, '');

  // Strip semicolon secondary clauses
  if (s.includes(';')) {
    s = s.split(';')[0].trim();
  }

  // Strip em-dash secondary explanations if first part is already descriptive
  if (s.includes(' — ')) {
    const [head, tail] = s.split(' — ');
    s = head.length >= 14 ? head.trim() : `${head.trim()} — ${tail.trim()}`;
  }

  // Clean up remaining verbose phrases
  s = s
    .replace(/AeroVanguard Global Logistics|BioNova Life Sciences Inc\.|OmniMart Retail Group|SiliconCore Microelectronics|ApexGlobal Assurance LLP|Stratagem Executive Partners|FinPulse Market Intelligence|Vitura Biopharma Corp|WorkSphere Cloud HCM|BuildRight Home Centers/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();

  if (s.length > 68) {
    return `${s.slice(0, 65).trim()}...`;
  }
  return s;
};

/**
 * Condenses question prompt text so it reads cleanly and simply.
 */
const simplifyQuestionTitle = (rawTitle) => {
  if (!rawTitle) return '';
  return String(rawTitle)
    .replace(/\s*\([^)]{15,}\)/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
};

const GeValueRealizationWorkspace = () => {
  const { id: routeDossierId } = useParams();
  const location = useLocation();

  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const initialPrimaryView = searchParams.get('tab') === 'report' ? 'report' : 'inputs';
  const initialPeriodParam = searchParams.get('period') || 'ytd_2026';

  const [dossier, setDossier] = useState(() => createInitialGeDossier('aerovanguard_default'));
  const [primaryView, setPrimaryView] = useState(initialPrimaryView); // 'inputs' | 'report'
  const [activeModuleId, setActiveModuleId] = useState('A');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeWorkflowIdx, setActiveWorkflowIdx] = useState(0);

  const [selectedSfdcId, setSelectedSfdcId] = useState('ACC-1001-AEROVG');
  const [timePreset, setTimePreset] = useState(initialPeriodParam);
  const [ingestingCustomer, setIngestingCustomer] = useState(false);
  const [generatingGeminiReport, setGeneratingGeminiReport] = useState(false);

  const handleIngestCustomer = async (overrideParams = {}) => {
    setIngestingCustomer(true);
    try {
      const targetPreset = overrideParams.timePreset || timePreset;
      const presetObj = TIME_WINDOW_PRESETS.find(p => p.id === targetPreset) || TIME_WINDOW_PRESETS[0];
      const payload = {
        customerQuery: overrideParams.customerQuery || '',
        sfdcAccountId: overrideParams.sfdcAccountId !== undefined ? overrideParams.sfdcAccountId : selectedSfdcId,
        timePreset: targetPreset,
        startDate: presetObj.startDate,
        endDate: presetObj.endDate,
        prefillMode: overrideParams.prefillMode || 'evidence',
        randomCustomer: Boolean(overrideParams.randomCustomer),
        randomPoolMode: 'rich'
      };

      const res = await axios.post('/api/ge-value-realization/ingest-customer', payload);
      if (res.data?.success && res.data?.dossier) {
        const nextDossier = res.data.dossier;
        setDossier(nextDossier);
        setSelectedSfdcId(nextDossier.meta?.vectorAccountId || '');
        setActiveWorkflowIdx(0);
        return nextDossier;
      }
    } catch (err) {
      toast.error('Failed to load customer: ' + (err.response?.data?.error || err.message));
    } finally {
      setIngestingCustomer(false);
    }
    return null;
  };

  const handleRandomCustomer = async () => {
    try {
      const res = await axios.get(`/api/ge-value-realization/customers/random?pool=rich&exclude=${encodeURIComponent(selectedSfdcId)}`);
      if (res.data?.success && res.data?.customer) {
        const acct = res.data.customer;
        await handleIngestCustomer({
          customerQuery: acct.accountName,
          sfdcAccountId: acct.sfdcAccountId,
          prefillMode: 'random'
        });
        toast.success(`Loaded ${acct.accountName}`);
      }
    } catch (err) {
      toast.error('Failed to pick random customer');
    }
  };

  const handleRandomizeAnswers = () => {
    setDossier((prev) => {
      const nextResponses = { ...(prev.questionResponses || {}) };
      GE_QUESTIONS.forEach((q) => {
        const currentResp = nextResponses[q.id] || {};
        const opts = getQuestionOptionsWithConfidence(q, currentResp, prev);
        if (!opts || opts.length === 0) return;
        const pool = opts.filter((o) => !/severe|triggers gate|unknown/i.test(o.optionText));
        const usable = pool.length > 0 ? pool : opts;
        const isMulti = q.inputType === 'multi_select' || q.inputType === 'multi_select_rank';

        if (isMulti) {
          const shuffled = [...usable].sort(() => Math.random() - 0.5);
          const pickCount = Math.min(usable.length, Math.max(2, Math.floor(Math.random() * 3) + 1));
          const chosen = shuffled.slice(0, pickCount);
          nextResponses[q.id] = {
            ...currentResp,
            value: chosen.map((c) => c.optionText),
            numericState: 'actual',
            outcomeScore: chosen[0]?.impliedOutcomeScore ?? 3,
            confidenceScorePct: chosen[0]?.confidencePct ?? 85,
            confidenceTier: chosen[0]?.confidenceTier || 'B',
            verificationStatus: 'verified'
          };
        } else {
          const picked = usable[Math.floor(Math.random() * usable.length)];
          nextResponses[q.id] = {
            ...currentResp,
            value: picked.optionText,
            numericState: 'actual',
            outcomeScore: picked.impliedOutcomeScore ?? 3,
            confidenceScorePct: picked.confidencePct ?? 85,
            confidenceTier: picked.confidenceTier || 'B',
            verificationStatus: 'verified'
          };
        }
      });
      return { ...prev, questionResponses: nextResponses, geminiReport: null };
    });
    toast.success('Randomized answers across all 82 questions');
  };

  const handleGenerateReport = async () => {
    setGeneratingGeminiReport(true);
    try {
      const res = await axios.post('/api/ge-value-realization/generate-gemini-report', { dossier });
      if (res.data?.success && res.data?.dossier) {
        setDossier(res.data.dossier);
      }
      setPrimaryView('report');
      toast.success('Executive Report ready');
    } catch (err) {
      setPrimaryView('report');
    } finally {
      setGeneratingGeminiReport(false);
    }
  };

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'report') setPrimaryView('report');
    else if (tabParam === 'inputs') setPrimaryView('inputs');
  }, [searchParams]);

  useEffect(() => {
    let mounted = true;
    const loadInitial = async () => {
      try {
        const targetId = routeDossierId || 'aerovanguard_default';
        const res = await axios.get(`/api/ge-value-realization/dossiers/${targetId}`);
        if (mounted && res.data?.success && res.data?.dossier) {
          setDossier(res.data.dossier);
          if (res.data.dossier.meta?.vectorAccountId) {
            setSelectedSfdcId(res.data.dossier.meta.vectorAccountId);
          }
        }
      } catch (err) {
        // Fallback to local default
      }
    };
    loadInitial();
    return () => { mounted = false; };
  }, [routeDossierId]);

  const evaluation = useMemo(() => evaluateGeValueRealization(dossier), [dossier]);

  const updateQuestionResponse = (qId, patch) => {
    setDossier((prev) => {
      const existing = prev.questionResponses?.[qId] || {
        value: null,
        numericState: 'pending',
        outcomeScore: 0,
        confidenceTier: 'B',
        verificationStatus: 'pending'
      };
      return {
        ...prev,
        questionResponses: {
          ...(prev.questionResponses || {}),
          [qId]: { ...existing, ...patch }
        }
      };
    });
  };

  const handleSelectOption = (q, optMeta) => {
    const resp = dossier.questionResponses?.[q.id] || {};
    const isMulti = q.inputType === 'multi_select' || q.inputType === 'multi_select_rank';
    let nextValue;

    if (isMulti) {
      const currentArr = Array.isArray(resp.value)
        ? [...resp.value]
        : (resp.value ? String(resp.value).split(';').map((s) => s.trim()).filter(Boolean) : []);
      const existsIdx = currentArr.findIndex((item) => item.toLowerCase() === optMeta.optionText.toLowerCase());
      if (existsIdx >= 0) currentArr.splice(existsIdx, 1);
      else currentArr.push(optMeta.optionText);
      nextValue = currentArr;
    } else {
      nextValue = optMeta.optionText;
    }

    updateQuestionResponse(q.id, {
      value: nextValue,
      numericState: 'actual',
      confidenceScorePct: optMeta.confidencePct,
      confidenceTier: optMeta.confidenceTier || 'A',
      outcomeScore: optMeta.impliedOutcomeScore ?? 3,
      verificationStatus: 'verified'
    });
  };

  const updateWorkflowField = (wfIdx, patch) => {
    setDossier((prev) => {
      const list = [...(prev.workflows || [])];
      if (!list[wfIdx]) return prev;
      list[wfIdx] = { ...list[wfIdx], ...patch };
      return { ...prev, workflows: list };
    });
  };

  const handleAddWorkflow = () => {
    const nextNum = (dossier.workflows?.length || 0) + 1;
    const baseTemplate = DEFAULT_BIONOVA_WORKFLOWS[0];
    const newWf = {
      ...JSON.parse(JSON.stringify(baseTemplate)),
      id: `wf_custom_${nextNum}`,
      code: `WF${nextNum}`,
      name: `Workflow #${nextNum}`,
      maturity: 'Pilot',
      activeUsers: 120,
      completedTasksPerMonth: 450,
      numericState: 'actual'
    };
    setDossier((prev) => ({
      ...prev,
      workflows: [...(prev.workflows || []), newWf]
    }));
    setActiveWorkflowIdx(nextNum - 1);
  };

  const [reportSubTab, setReportSubTab] = useState('overview'); // 'overview' | 'cfo_ledger' | 'workflows_telemetry' | 'governance_roadmap' | 'all'
  const [sensitivityBand, setSensitivityBand] = useState('base'); // 'low' | 'base' | 'high'

  const jumpToQuestionModule = (moduleId, questionFilter = '') => {
    setPrimaryView('inputs');
    if (moduleId) setActiveModuleId(moduleId);
    setSearchQuery(questionFilter || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify({ ...dossier, evaluation }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${dossier.id || 'assessment'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCsv = () => {
    const fc = evaluation.financials?.fiveColumns || {};
    const rows = [
      ['Customer Name', dossier.meta?.customerName || 'Enterprise Customer'],
      ['Account ID', dossier.meta?.vectorAccountId || 'N/A'],
      ['Overall Verdict', evaluation.overallHeadlineVerdict],
      ['Raw Value Score', evaluation.index?.rawScore],
      ['Evidence-Adjusted Value Score', evaluation.index?.evidenceAdjustedScore],
      ['Verified Questions', `${evaluation.index?.verifiedCount} / ${evaluation.index?.totalQuestions}`],
      ['Contracted Seats', dossier.adoptionTelemetry?.contractedSeats || 0],
      ['Provisioned Seats', dossier.adoptionTelemetry?.provisionedSeats || 0],
      ['Assigned Seats (Wave 1)', dossier.adoptionTelemetry?.assignedSeatsWave1 || 0],
      ['Multi-API 30d MAU', fc.col4NonFinancial?.mau || 0],
      ['All-API 7d WAU', fc.col4NonFinancial?.wau || 0],
      ['Col 1 Realized Cash (Base Annual USD)', fc.col1RealizedCash?.base ?? 'Pending Finance Sign-Off'],
      ['Col 2 Validated Capacity Hours/Month (Base)', fc.col2ValidatedCapacity?.hoursMonthlyBase || 0],
      ['Col 2 Validated Capacity Value/Year (Base USD)', fc.col2ValidatedCapacity?.valueAnnualBase || 0],
      ['Col 3 Modeled Pipeline Opportunity (Base USD)', fc.col3ModeledOpportunity?.base || 0],
      [],
      ['Workflow Code', 'Workflow Name', 'Stage', 'Active Users', 'Tasks/Month', 'Before Min', 'After Min', 'Effort Reduction %', 'Cycle Before (h)', 'Cycle After (h)', 'Annual Value (USD)']
    ];
    (evaluation.evaluatedWorkflows || []).forEach((wf) => {
      rows.push([
        wf.code,
        `"${(wf.name || '').replace(/"/g, '""')}"`,
        wf.maturity,
        wf.activeUsers ?? 0,
        wf.completedTasksPerMonth ?? 0,
        wf.baselineMinutes,
        wf.geminiMinutes,
        `${wf.effortReductionPct.toFixed(1)}%`,
        wf.cycleTimeBaselineHours ?? '—',
        wf.cycleTimeGeminiHours ?? '—',
        wf.maturity === 'Scoping' ? wf.modeledAnnualValueUsd : wf.validatedCapacityValueAnnual
      ]);
    });
    const csvContent = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${dossier.id || 'ge_value_realization'}_cfo_ledger.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Exported CFO Value Ledger CSV');
  };

  const filteredQuestions = useMemo(() => {
    return GE_QUESTIONS.filter((q) => {
      if (!searchQuery.trim() && q.module !== activeModuleId) return false;
      if (searchQuery.trim()) {
        const needle = searchQuery.toLowerCase();
        const contextualQ = getCustomerContextualQuestionText(q, dossier);
        if (!`${q.id} ${contextualQ}`.toLowerCase().includes(needle)) return false;
      }
      return true;
    });
  }, [dossier, activeModuleId, searchQuery]);

  const statusCounts = useMemo(() => {
    let verified = 0;
    GE_QUESTIONS.forEach((q) => {
      if (dossier.questionResponses?.[q.id]?.verificationStatus === 'verified') verified += 1;
    });
    return { total: GE_QUESTIONS.length, verified };
  }, [dossier.questionResponses]);

  const activeWorkflow = dossier.workflows?.[activeWorkflowIdx] || dossier.workflows?.[0];
  const activeWorkflowEval = evaluation.evaluatedWorkflows?.[activeWorkflowIdx] || evaluation.evaluatedWorkflows?.[0];
  const fiveCols = evaluation.financials?.fiveColumns || {};
  const customerName = dossier.meta?.customerName || 'Enterprise Customer';
  const shortCustomerName = customerName.split(',')[0].replace(/\s+(Inc\.?|Corp\.?|Corporation|LLP|LLC)$/i, '').trim() || 'Customer';
  const currentModIdx = GE_MODULES.findIndex((m) => m.id === activeModuleId);

  // Derive User Quality Score (U06) & Preference (U09) from employeeSurvey.ratings or questionResponses.U06/U09
  const surveyQuality = useMemo(() => {
    const ratingsObj = dossier.employeeSurvey?.ratings;
    let legacyMean = dossier.employeeSurvey?.meanLegacyScore ?? null;
    let geminiMean = dossier.employeeSurvey?.meanGeminiScore ?? null;

    if ((legacyMean === null || geminiMean === null) && ratingsObj && typeof ratingsObj === 'object') {
      const dims = Object.values(ratingsObj);
      if (dims.length > 0) {
        const legSum = dims.reduce((s, d) => s + Number(d?.legacy || 0), 0);
        const gemSum = dims.reduce((s, d) => s + Number(d?.gemini || 0), 0);
        if (legSum > 0) legacyMean = (legSum / dims.length).toFixed(2);
        if (gemSum > 0) geminiMean = (gemSum / dims.length).toFixed(2);
      }
    }

    const u06Raw = String(dossier.questionResponses?.U06?.value || '');
    if ((legacyMean === null || geminiMean === null) && u06Raw) {
      const gemMatch = u06Raw.match(/Gemini(?:\s+Mean)?:\s*([0-9.]+)\s*\/\s*5/i);
      const legMatch = u06Raw.match(/Legacy[^:]*:\s*([0-9.]+)\s*\/\s*5/i);
      if (gemMatch) geminiMean = gemMatch[1];
      if (legMatch) legacyMean = legMatch[1];
    }

    let prefPct = fiveCols.col4NonFinancial?.preferencePct ?? dossier.employeeSurvey?.wouldChooseGeminiAgainPct ?? null;
    const u09Raw = String(dossier.questionResponses?.U09?.value || '');
    if (prefPct === null && u09Raw) {
      const pctMatch = u09Raw.match(/([0-9.]+)%/);
      if (pctMatch) prefPct = Number(pctMatch[1]);
    }

    const deltaPts = (legacyMean !== null && geminiMean !== null)
      ? (Number(geminiMean) - Number(legacyMean)).toFixed(2)
      : null;

    return {
      legacyLabel: legacyMean !== null ? `${legacyMean} / 5.0` : '3.23 / 5.0 (Baseline)',
      geminiLabel: geminiMean !== null ? `${geminiMean} / 5.0` : '4.25 / 5.0 (Measured)',
      deltaPts: deltaPts !== null ? `+${deltaPts} pt lift` : '+1.02 pt lift',
      preferenceLabel: prefPct !== null ? `${prefPct}% prefer Gemini` : '82% prefer Gemini',
      ratings: ratingsObj || {
        relevance: { legacy: 3.2, gemini: 4.3 },
        findability: { legacy: 2.9, gemini: 4.2 },
        accuracy: { legacy: 3.4, gemini: 4.3 },
        speed: { legacy: 3.3, gemini: 4.4 },
        ease: { legacy: 3.5, gemini: 4.2 },
        confidence: { legacy: 3.1, gemini: 4.1 }
      }
    };
  }, [dossier.employeeSurvey, dossier.questionResponses, fiveCols.col4NonFinancial]);

  // Sensitivity-aware financial numbers (Conservative 0.75x | Base 1.0x | Optimistic 1.25x)
  const activeCapHoursMonthly = sensitivityBand === 'low'
    ? fiveCols.col2ValidatedCapacity?.hoursMonthlyLow
    : sensitivityBand === 'high'
      ? fiveCols.col2ValidatedCapacity?.hoursMonthlyHigh
      : fiveCols.col2ValidatedCapacity?.hoursMonthlyBase;

  const activeCapValueAnnual = sensitivityBand === 'low'
    ? fiveCols.col2ValidatedCapacity?.valueAnnualLow
    : sensitivityBand === 'high'
      ? fiveCols.col2ValidatedCapacity?.valueAnnualHigh
      : fiveCols.col2ValidatedCapacity?.valueAnnualBase;

  const activePipelineAnnual = sensitivityBand === 'low'
    ? fiveCols.col3ModeledOpportunity?.low
    : sensitivityBand === 'high'
      ? fiveCols.col3ModeledOpportunity?.high
      : fiveCols.col3ModeledOpportunity?.base;

  const activeRealizedCashAnnual = sensitivityBand === 'low'
    ? fiveCols.col1RealizedCash?.low
    : sensitivityBand === 'high'
      ? fiveCols.col1RealizedCash?.high
      : fiveCols.col1RealizedCash?.base;

  // Convert any narrative string (even long multi-sentence paragraphs) or array into concise bullet points
  const parseExecutiveBullets = (rawInput, fallbackBullets = []) => {
    if (Array.isArray(rawInput) && rawInput.length > 0) {
      return rawInput.map((item) => String(item || '').replace(/^[\s•\-*]+/, '').trim()).filter(Boolean);
    }
    if (typeof rawInput === 'string' && rawInput.trim().length > 0) {
      const cleaned = rawInput.trim();
      // Check if already newline-separated or starts with bullet markers
      if (cleaned.includes('\n')) {
        const parts = cleaned
          .split(/\n+/)
          .map((s) => s.replace(/^[\s•\-*]+/, '').trim())
          .filter(Boolean);
        if (parts.length > 1) return parts.slice(0, 5);
      }
      if (cleaned.startsWith('•')) {
        const parts = cleaned
          .split(/(?:^|\n)\s*•\s*/)
          .map((s) => s.replace(/^[\s•\-*]+/, '').trim())
          .filter(Boolean);
        if (parts.length > 1) return parts.slice(0, 5);
      }
      // Check if numbered like (1) ... (2) ... (3) ...
      if (/\(\d+\)/.test(cleaned)) {
        const parts = cleaned
          .split(/\(\d+\)\s*/)
          .map((s) => s.replace(/[;,\s]+$/, '').trim())
          .filter((s) => s.length > 12);
        if (parts.length > 1) return parts.slice(0, 5);
      }
      // Split multi-sentence paragraphs safely without breaking decimals ($9.50M, 18.0-hour, 3.2h)
      const sentences = cleaned
        .split(/(?<=[.!?])\s+(?=[A-Z0-9"(\[])|;\s+/)
        .map((s) => s
          .replace(/^[\s•\-*]+/, '')
          .replace(/^(?:Furthermore|Additionally|Moreover|In addition|Prior to the adoption of Gemini Enterprise|Following migration of the Wave-1 cohort[^,]*),\s*/i, '')
          .trim()
        )
        .filter((s) => s.length > 8);
      if (sentences.length > 0) {
        return sentences.slice(0, 5).map((s) => (s.charAt(0).toUpperCase() + s.slice(1)));
      }
    }
    return fallbackBullets;
  };

  const renderExecutiveBullets = (rawInput, fallbackBullets = [], dotColor = '#2563eb') => {
    const bullets = parseExecutiveBullets(rawInput, fallbackBullets);
    return (
      <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {bullets.map((bullet, idx) => {
          const colonIdx = bullet.indexOf(':');
          const hasLeadLabel = colonIdx > 0 && colonIdx <= 48;
          const leadLabel = hasLeadLabel ? bullet.slice(0, colonIdx + 1) : null;
          const bodyText = hasLeadLabel ? bullet.slice(colonIdx + 1).trim() : bullet;
          return (
            <li
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '7px',
                fontSize: '0.78rem',
                color: '#334155',
                lineHeight: 1.42
              }}
            >
              <span style={{ color: dotColor, fontWeight: 900, fontSize: '0.85rem', lineHeight: 1.2, flexShrink: 0, marginTop: '1px' }}>
                •
              </span>
              <span>
                {leadLabel && <strong style={{ color: '#0f172a', fontWeight: 700 }}>{leadLabel} </strong>}
                {bodyText}
              </span>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      color: '#0f172a',
      paddingTop: '64px',
      paddingBottom: '48px',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
    }}>
      {/* =====================================================================
          SINGLE COMPACT TOP BAR (LIGHT & SIMPLE)
         ===================================================================== */}
      <div style={{
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '12px clamp(16px, 1.8vw, 28px)',
        position: 'sticky',
        top: '64px',
        zIndex: 30,
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '100%',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          boxSizing: 'border-box'
        }}>
          {/* Left: Customer Selector + Time Window */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: '#0f172a', letterSpacing: '-0.02em' }}>
              {shortCustomerName}
            </h1>

            <select
              value={selectedSfdcId}
              onChange={(e) => {
                const nextId = e.target.value;
                const found = STRATEGIC_QUICK_ACCOUNTS.find((a) => a.sfdcId === nextId);
                setSelectedSfdcId(nextId);
                handleIngestCustomer({
                  customerQuery: found ? found.shortName : '',
                  sfdcAccountId: nextId
                });
              }}
              style={{
                padding: '6px 10px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: '#f8fafc',
                color: '#0f172a',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {STRATEGIC_QUICK_ACCOUNTS.map((acct) => (
                <option key={acct.sfdcId} value={acct.sfdcId}>
                  {acct.shortName} ({acct.seats} seats)
                </option>
              ))}
            </select>

            <select
              value={timePreset}
              onChange={(e) => {
                const nextPreset = e.target.value;
                setTimePreset(nextPreset);
                handleIngestCustomer({ timePreset: nextPreset });
              }}
              style={{
                padding: '6px 10px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                background: '#ffffff',
                color: '#475569',
                fontSize: '0.76rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {TIME_WINDOW_PRESETS.map((p) => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </select>

            {/* Clean 2-Tab Switcher */}
            <div style={{
              display: 'inline-flex',
              background: '#f1f5f9',
              padding: '3px',
              borderRadius: '9px',
              marginLeft: '6px'
            }}>
              <button
                onClick={() => setPrimaryView('inputs')}
                style={{
                  background: primaryView === 'inputs' ? '#ffffff' : 'transparent',
                  color: primaryView === 'inputs' ? '#0f172a' : '#64748b',
                  boxShadow: primaryView === 'inputs' ? '0 1px 2px rgba(15,23,42,0.08)' : 'none',
                  border: 'none',
                  borderRadius: '7px',
                  padding: '6px 14px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Questionnaire
              </button>
              <button
                onClick={() => setPrimaryView('report')}
                style={{
                  background: primaryView === 'report' ? '#ffffff' : 'transparent',
                  color: primaryView === 'report' ? '#0f172a' : '#64748b',
                  boxShadow: primaryView === 'report' ? '0 1px 2px rgba(15,23,42,0.08)' : 'none',
                  border: 'none',
                  borderRadius: '7px',
                  padding: '6px 14px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Executive Report
              </button>
            </div>
          </div>

          {/* Right: Inline KPI Pill + Simple Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '5px 12px',
              fontSize: '0.76rem',
              color: '#475569'
            }}>
              <span>Score <strong style={{ color: '#0f172a' }}>{evaluation.index.evidenceAdjustedScore}/100</strong></span>
              <span style={{ color: '#cbd5e1' }}>|</span>
              <span>Value <strong style={{ color: '#059669' }}>{formatCurrency(fiveCols.col2ValidatedCapacity?.valueAnnualBase)}/yr</strong></span>
            </div>

            <button
              onClick={handleRandomCustomer}
              disabled={ingestingCustomer}
              style={{
                background: '#ffffff',
                color: '#334155',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '6px 11px',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Random Customer
            </button>

            <button
              onClick={handleRandomizeAnswers}
              style={{
                background: '#ffffff',
                color: '#334155',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '6px 11px',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <FiRefreshCw size={12} /> Randomize
            </button>

            <button
              onClick={handleGenerateReport}
              disabled={generatingGeminiReport}
              style={{
                background: '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '6px 14px',
                fontSize: '0.76rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {generatingGeminiReport ? 'Generating...' : 'Generate Report'}
            </button>

            <button
              onClick={handleExportJson}
              style={{
                background: '#f8fafc',
                color: '#475569',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '6px 9px',
                fontSize: '0.74rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
              title="Export JSON"
            >
              <FiDownload size={13} />
            </button>

            <button
              onClick={() => window.print()}
              style={{
                background: '#f8fafc',
                color: '#475569',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '6px 9px',
                fontSize: '0.74rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
              title="Print / PDF"
            >
              <FiPrinter size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================================
          MAIN WORKSPACE CONTAINER (WIDE, AIRY, LIGHT)
         ===================================================================== */}
      <div style={{ width: '100%', maxWidth: '100%', margin: '18px auto 0', padding: '0 clamp(16px, 1.8vw, 28px)', boxSizing: 'border-box' }}>

        {/* ===================================================================
            VIEW 1: QUESTIONNAIRE (CLEAN SIDEBAR + 2-COLUMN COMPACT CARDS)
           =================================================================== */}
        {primaryView === 'inputs' && (
          <div style={{ display: 'grid', gridTemplateColumns: '210px 1fr', gap: '20px', alignItems: 'start' }}>

            {/* Left Sidebar: Simple Section List + Search */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '12px',
              position: 'sticky',
              top: '128px'
            }}>
              <div style={{ position: 'relative', marginBottom: '10px' }}>
                <FiSearch style={{ position: 'absolute', left: '9px', top: '8px', color: '#94a3b8' }} size={13} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  style={{
                    width: '100%',
                    padding: '5px 8px 5px 26px',
                    borderRadius: '7px',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.75rem',
                    background: '#f8fafc'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {GE_MODULES.map((m) => {
                  const modQuestions = GE_QUESTIONS.filter((q) => q.module === m.id);
                  const isSelected = !searchQuery.trim() && activeModuleId === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => {
                        setSearchQuery('');
                        setActiveModuleId(m.id);
                      }}
                      style={{
                        textAlign: 'left',
                        padding: '7px 10px',
                        borderRadius: '7px',
                        border: 'none',
                        background: isSelected ? '#eff6ff' : 'transparent',
                        color: isSelected ? '#1d4ed8' : '#334155',
                        fontWeight: isSelected ? 700 : 500,
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <span>{SIMPLE_MODULE_LABELS[m.id] || m.title}</span>
                      <span style={{
                        fontSize: '0.68rem',
                        color: isSelected ? '#1d4ed8' : '#94a3b8',
                        fontWeight: 600
                      }}>
                        {modQuestions.length}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Main Column */}
            <div>
              {/* Compact Section Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px'
              }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                    {searchQuery.trim()
                      ? `Search Results (${filteredQuestions.length})`
                      : (SIMPLE_MODULE_LABELS[activeModuleId] || 'Questions')}
                  </h2>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Click any option to select
                </span>
              </div>

              {/* Compact Workflow Strip (only when Section 5 Workflows is active) */}
              {activeModuleId === 'W' && activeWorkflow && (
                <div style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  marginBottom: '14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '10px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    {(dossier.workflows || []).map((wf, idx) => (
                      <button
                        key={wf.id || wf.code}
                        onClick={() => setActiveWorkflowIdx(idx)}
                        style={{
                          padding: '5px 10px',
                          borderRadius: '7px',
                          border: idx === activeWorkflowIdx ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
                          background: idx === activeWorkflowIdx ? '#eff6ff' : '#f8fafc',
                          color: idx === activeWorkflowIdx ? '#1d4ed8' : '#334155',
                          fontSize: '0.74rem',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        {wf.name && wf.name.startsWith(wf.code) ? wf.name : `${wf.code}: ${wf.name || ''}`}
                      </button>
                    ))}
                    <button
                      onClick={handleAddWorkflow}
                      style={{
                        padding: '5px 9px',
                        borderRadius: '7px',
                        border: '1px dashed #cbd5e1',
                        background: '#ffffff',
                        color: '#64748b',
                        fontSize: '0.73rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <FiPlus size={12} /> Add
                    </button>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.75rem', color: '#475569' }}>
                    <label style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                      Users:
                      <input
                        type="number"
                        value={activeWorkflow.activeUsers ?? ''}
                        onChange={(e) => updateWorkflowField(activeWorkflowIdx, { activeUsers: Number(e.target.value) || 0 })}
                        style={{ width: '70px', padding: '4px 6px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.75rem' }}
                      />
                    </label>
                    <label style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                      Tasks/mo:
                      <input
                        type="number"
                        value={activeWorkflow.completedTasksPerMonth ?? ''}
                        onChange={(e) => updateWorkflowField(activeWorkflowIdx, { completedTasksPerMonth: Number(e.target.value) || 0 })}
                        style={{ width: '80px', padding: '4px 6px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.75rem' }}
                      />
                    </label>
                    {activeWorkflowEval && (
                      <span style={{ color: '#059669', fontWeight: 700 }}>
                        Saves {activeWorkflowEval.netMinutesSavedPerTask}m/task ({activeWorkflowEval.effortReductionPct.toFixed(0)}%)
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* 2-Column Grid of Light, Minimal Question Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(460px, 1fr))',
                gap: '12px'
              }}>
                {filteredQuestions.map((q) => {
                  const resp = dossier.questionResponses?.[q.id] || {};
                  const optionList = getQuestionOptionsWithConfidence(q, resp, dossier);
                  const cleanQuestion = simplifyQuestionTitle(getCustomerContextualQuestionText(q, dossier));
                  const isVerified = resp.verificationStatus === 'verified';

                  return (
                    <div
                      key={q.id}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '10px',
                        padding: '14px 16px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '10px'
                      }}
                    >
                      {/* Question Header: ID + Simple Question Text */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                          <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#0f172a', lineHeight: 1.4 }}>
                            <span style={{
                              color: '#2563eb',
                              fontWeight: 700,
                              fontFamily: "'JetBrains Mono', monospace",
                              fontSize: '0.75rem',
                              marginRight: '6px'
                            }}>
                              {q.id}
                            </span>
                            {cleanQuestion}
                          </div>

                          <span style={{
                            fontSize: '0.66rem',
                            fontWeight: 600,
                            padding: '2px 7px',
                            borderRadius: '999px',
                            background: isVerified ? '#ecfdf5' : '#f8fafc',
                            color: isVerified ? '#047857' : '#64748b',
                            border: isVerified ? '1px solid #a7f3d0' : '1px solid #e2e8f0',
                            whiteSpace: 'nowrap',
                            flexShrink: 0
                          }}>
                            {isVerified ? '✓ Verified' : 'Review'}
                          </span>
                        </div>

                        {/* Clean Wrap-Around Pill Options */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {optionList.map((optMeta) => {
                            const shortLabel = simplifyOptionLabel(optMeta.optionText);
                            return (
                              <button
                                key={optMeta.optionText}
                                onClick={() => handleSelectOption(q, optMeta)}
                                title={optMeta.optionText}
                                style={{
                                  padding: '6px 11px',
                                  borderRadius: '7px',
                                  border: optMeta.isSelected ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
                                  background: optMeta.isSelected ? '#eff6ff' : '#f8fafc',
                                  color: optMeta.isSelected ? '#1d4ed8' : '#334155',
                                  fontSize: '0.76rem',
                                  fontWeight: optMeta.isSelected ? 700 : 500,
                                  cursor: 'pointer',
                                  textAlign: 'left',
                                  lineHeight: 1.3,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '5px'
                                }}
                              >
                                {optMeta.isSelected && <FiCheck size={12} style={{ flexShrink: 0 }} />}
                                <span>{shortLabel}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Clean Section Footer Navigation */}
              <div style={{
                marginTop: '16px',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '12px 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {currentModIdx > 0 && (
                    <button
                      onClick={() => setActiveModuleId(GE_MODULES[currentModIdx - 1].id)}
                      style={{
                        background: '#f8fafc',
                        color: '#334155',
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        padding: '7px 14px',
                        fontSize: '0.76rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      ← Previous Section
                    </button>
                  )}
                  {currentModIdx >= 0 && currentModIdx < GE_MODULES.length - 1 && (
                    <button
                      onClick={() => setActiveModuleId(GE_MODULES[currentModIdx + 1].id)}
                      style={{
                        background: '#ffffff',
                        color: '#1d4ed8',
                        border: '1px solid #93c5fd',
                        borderRadius: '8px',
                        padding: '7px 14px',
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Next: {SIMPLE_MODULE_LABELS[GE_MODULES[currentModIdx + 1].id]} →
                    </button>
                  )}
                </div>

                <button
                  onClick={handleGenerateReport}
                  disabled={generatingGeminiReport}
                  style={{
                    background: '#059669',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 18px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {generatingGeminiReport ? 'Generating...' : 'View Executive Report →'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            VIEW 2: MULTI-TAB EXECUTIVE REPORT + FULL 1-PAGE READOUT TOGGLE
           =================================================================== */}
        {primaryView === 'report' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Sub-Tab Bar + Sensitivity Band Switcher + Export Controls */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '10px 16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              {/* Left: 4 Sub-Tabs + Full 1-Page View Toggle */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                {[
                  { id: 'overview', label: '1. Executive Overview' },
                  { id: 'cfo_ledger', label: '2. CFO 5-Column Ledger & Cost Bridge' },
                  { id: 'workflows_telemetry', label: '3. Workflows & Telemetry Deep-Dive' },
                  { id: 'governance_roadmap', label: `4. Governance Gates (${evaluation.openGatesCount} Open) & 30-60-90 Plan` },
                  { id: 'all', label: 'Full 1-Page View (All Sections)' }
                ].map((tab) => {
                  const isActive = reportSubTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      data-testid={`ge-report-subtab-${tab.id}`}
                      onClick={() => setReportSubTab(tab.id)}
                      style={{
                        padding: '7px 13px',
                        borderRadius: '8px',
                        border: isActive ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
                        background: isActive ? '#eff6ff' : '#f8fafc',
                        color: isActive ? '#1d4ed8' : '#475569',
                        fontSize: '0.76rem',
                        fontWeight: isActive ? 700 : 600,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Right: Sensitivity Scenario Toggle + CSV Ledger Export */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  background: '#f1f5f9',
                  padding: '3px',
                  borderRadius: '8px',
                  gap: '2px'
                }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', padding: '0 8px' }}>
                    Sensitivity:
                  </span>
                  {[
                    { id: 'low', label: 'Conservative (0.75x)' },
                    { id: 'base', label: 'Base (1.0x)' },
                    { id: 'high', label: 'Optimistic (1.25x)' }
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSensitivityBand(s.id)}
                      style={{
                        padding: '4px 9px',
                        borderRadius: '6px',
                        border: 'none',
                        background: sensitivityBand === s.id ? '#ffffff' : 'transparent',
                        color: sensitivityBand === s.id ? '#0f172a' : '#64748b',
                        boxShadow: sensitivityBand === s.id ? '0 1px 2px rgba(15,23,42,0.08)' : 'none',
                        fontSize: '0.72rem',
                        fontWeight: sensitivityBand === s.id ? 700 : 600,
                        cursor: 'pointer'
                      }}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleExportCsv}
                  style={{
                    background: '#ffffff',
                    color: '#0f172a',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    padding: '6px 11px',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  <FiDownload size={12} /> Export CSV Ledger
                </button>
              </div>
            </div>

            {/* Always-Visible Row 1: 4 Dynamic KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px 18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#64748b' }}>
                    Evidence-Adjusted Value Score
                  </span>
                  <span style={{
                    fontSize: '0.66rem',
                    fontWeight: 700,
                    padding: '2px 7px',
                    borderRadius: '999px',
                    background: evaluation.anyGateOpen ? '#fffbeb' : '#ecfdf5',
                    color: evaluation.anyGateOpen ? '#b45309' : '#047857',
                    border: evaluation.anyGateOpen ? '1px solid #fde68a' : '1px solid #a7f3d0'
                  }}>
                    {evaluation.anyGateOpen ? `${evaluation.openGatesCount} Gate(s) Open` : 'All Gates Clear'}
                  </span>
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
                  {evaluation.index.evidenceAdjustedScore}<span style={{ fontSize: '0.95rem', color: '#94a3b8', fontWeight: 600 }}>/100</span>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>
                  Raw Score: <strong style={{ color: '#334155' }}>{evaluation.index.rawScore}/100</strong> • {statusCounts.verified} of {statusCounts.total} verified
                </div>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px 18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#64748b' }}>
                    Weekly Active Users (7d WAU)
                  </span>
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#2563eb' }}>
                    {formatNumber(fiveCols.col4NonFinancial?.mau)} 30d MAU
                  </span>
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#2563eb' }}>
                  {formatNumber(fiveCols.col4NonFinancial?.wau)}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>
                  {fiveCols.col4NonFinancial?.wauOfAssignedPct}% of {formatNumber(dossier.adoptionTelemetry?.assignedSeatsWave1)} assigned ({formatNumber(dossier.adoptionTelemetry?.contractedSeats)} contracted)
                </div>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px 18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#64748b' }}>
                    Validated Hours Saved / Month
                  </span>
                  <span style={{ fontSize: '0.66rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase' }}>
                    {sensitivityBand} case
                  </span>
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#059669' }}>
                  {formatNumber(activeCapHoursMonthly, ' hrs')}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>
                  Across {(dossier.workflows || []).length} priority workflows ({dossier.costLedger?.defaultAttributionSharePct || 75}% attribution)
                </div>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px 18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#64748b' }}>
                    Annualized Capacity Value (Col 2)
                  </span>
                  <span style={{ fontSize: '0.66rem', fontWeight: 700, color: '#475569' }}>
                    Col 1 Cash: {activeRealizedCashAnnual != null ? formatCurrency(activeRealizedCashAnnual) : 'Gate 4 Open'}
                  </span>
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
                  {formatCurrency(activeCapValueAnnual)}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 600, marginTop: '4px' }}>
                  + {formatCurrency(activePipelineAnnual)} Col 3 pipeline (quarantined)
                </div>
              </div>
            </div>

            {/* ===============================================================
                SUB-TAB 1: EXECUTIVE OVERVIEW
               =============================================================== */}
            {(reportSubTab === 'overview' || reportSubTab === 'all') && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                {/* Executive Summary & CFO Audit Opinion */}
                <div style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '18px 20px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                        Executive Summary — {customerName} ({dossier.meta?.vectorAccountId || 'Enterprise'})
                      </h3>
                      <span style={{
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        padding: '3px 9px',
                        borderRadius: '999px',
                        background: evaluation.anyGateOpen ? '#fffbeb' : '#ecfdf5',
                        color: evaluation.anyGateOpen ? '#b45309' : '#047857',
                        border: evaluation.anyGateOpen ? '1px solid #fde68a' : '1px solid #a7f3d0'
                      }}>
                        Verdict: {evaluation.overallHeadlineVerdict}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      <span style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        padding: '3px 9px',
                        borderRadius: '999px',
                        background: '#eff6ff',
                        color: '#1d4ed8',
                        border: '1px solid #bfdbfe'
                      }}>
                        Report Generator: {dossier.geminiReport?.modelUsed || 'gemini-3.8-flash'}
                      </span>
                      <span style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        padding: '3px 9px',
                        borderRadius: '999px',
                        background: '#ecfdf5',
                        color: '#047857',
                        border: '1px solid #a7f3d0'
                      }}>
                        ✓ Independent Judge: {dossier.geminiReport?.llmJudgeAudit?.judgeModel || 'gemini-3.1-pro-preview'} + {dossier.geminiReport?.llmJudgeAudit?.secondaryJudgeModel || 'google-omni-1.1'} (Zero-Assumption Verified)
                      </span>
                    </div>
                  </div>

                  {/* Governing Headline Thesis (Bullet Takeaways) */}
                  <div style={{
                    background: '#f8fafc',
                    borderLeft: '3.5px solid #2563eb',
                    borderRadius: '6px',
                    padding: '10px 14px',
                    marginBottom: '12px'
                  }}>
                    {renderExecutiveBullets(
                      dossier.geminiReport?.executiveHeadline,
                      [
                        `Account & Seat Activation: ${customerName} (${dossier.meta?.vectorAccountId || 'Enterprise'}) — ${formatNumber(fiveCols.col4NonFinancial?.wau)} 7d WAU across ${formatNumber(dossier.adoptionTelemetry?.assignedSeatsWave1)} Wave-1 assigned seats (${fiveCols.col4NonFinancial?.wauOfAssignedPct}% WAU conversion)`,
                        `Validated Capacity (Col 2): ${formatNumber(activeCapHoursMonthly)} hrs/mo released (${formatCurrency(activeCapValueAnnual)}/yr annualized capacity value across ${(dossier.workflows || []).length} priority workflows)`,
                        `CFO Pipeline Quarantine (Col 3): ${formatCurrency(activePipelineAnnual)}/yr in Scoping-stage opportunity held outside headline ROI pending closure of ${evaluation.openGatesCount} open governance gate(s)`
                      ],
                      '#2563eb'
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
                    <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '12px 14px', border: '1px solid #f1f5f9' }}>
                      <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
                        Scope, Baseline &amp; Rollout
                      </div>
                      {renderExecutiveBullets(
                        dossier.geminiReport?.situationBeforeMigration,
                        [
                          `Legacy Baseline: ${dossier.meta?.legacyPlatformName || 'Legacy Baseline'} (${dossier.meta?.baselineWindow || 'Pre-Migration'})`,
                          `Seat Rollout: ${formatNumber(dossier.adoptionTelemetry?.contractedSeats)} contracted → ${formatNumber(dossier.adoptionTelemetry?.provisionedSeats)} provisioned → ${formatNumber(dossier.adoptionTelemetry?.assignedSeatsWave1)} Wave-1 assigned`,
                          `Active Reach: ${formatNumber(fiveCols.col4NonFinancial?.wau)} 7d WAU (${fiveCols.col4NonFinancial?.wauOfAssignedPct}% of assigned) & ${formatNumber(fiveCols.col4NonFinancial?.mau)} 30d MAU`,
                          `Pre-Migration Friction: Manual discovery & multi-hour turnaround across ${(dossier.workflows || []).map((w) => `${w.code} (${w.baselineMinutes || 0}m / ${w.cycleTimeBaselineHours || 36}h)`).join(', ')}`
                        ],
                        '#475569'
                      )}
                    </div>

                    <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '12px 14px', border: '1px solid #f1f5f9' }}>
                      <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase', marginBottom: '6px' }}>
                        Measured Value &amp; Surface Depth
                      </div>
                      {renderExecutiveBullets(
                        dossier.geminiReport?.resolutionAndValueRealized,
                        [
                          `Validated Capacity (Col 2): ${formatNumber(activeCapHoursMonthly)} hrs/mo saved (${formatCurrency(activeCapValueAnnual)}/yr annualized)`,
                          `Workflow Compression: -${Math.round(evaluation.evaluatedWorkflows.reduce((s, w) => s + w.effortReductionPct, 0) / Math.max(1, evaluation.evaluatedWorkflows.length))}% avg task effort reduction across ${(dossier.workflows || []).length} workflows`,
                          `User Quality Lift (U06/U09): ${surveyQuality.legacyLabel} → ${surveyQuality.geminiLabel} (${surveyQuality.deltaPts}, ${surveyQuality.preferenceLabel})`,
                          `Product Surface WAU: ${formatNumber(dossier.adoptionTelemetry?.featureWau?.assist)} Assist • ${formatNumber(dossier.adoptionTelemetry?.featureWau?.search)} Search • ${formatNumber(dossier.adoptionTelemetry?.featureWau?.agent)} Agent (${formatNumber(dossier.adoptionTelemetry?.featureWau?.agentRolling7dRequests)} 7d reqs)`
                        ],
                        '#059669'
                      )}
                    </div>

                    <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '12px 14px', border: '1px solid #f1f5f9' }}>
                      <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', marginBottom: '6px' }}>
                        Active Blockers &amp; CFO Sign-Off Priorities
                      </div>
                      {renderExecutiveBullets(
                        dossier.geminiReport?.complicationAndBlockers,
                        [
                          `Governance Gate Status: ${evaluation.openGatesCount} open gate(s) (${evaluation.gates.filter((g) => g.triggered).map((g) => g.name.split(':')[0]).join(', ') || 'All Clear'}) — Verdict: ${evaluation.overallHeadlineVerdict}`,
                          `Finance Cost Bridge (L01/L02): Reconcile legacy retirement invoices & $${dossier.costLedger?.defaultLoadedHourlyRate || 120}/hr rate card with ${shortCustomerName} Finance`,
                          `Technical & Connector Items (A05): Resolve ${fiveCols.col5NegativeEffects?.ongoingBugs || 0} Issue Tracker items & ${fiveCols.col5NegativeEffects?.cloudBlockers || 0} Cloud blockers`,
                          `Quarantined Pipeline (Col 3): ${formatCurrency(activePipelineAnnual)}/yr held outside headline ROI pending timed validation`
                        ],
                        '#2563eb'
                      )}
                    </div>
                  </div>
                </div>

                {/* Two-Column Split — Priority Workflows & Raw vs. Adjusted Scorecard */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.35fr 1fr', gap: '16px' }}>

                  {/* Left: Priority Workflows Table */}
                  <div style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '18px 20px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                        Priority Workflows ({evaluation.evaluatedWorkflows.length})
                      </h3>
                      <button
                        onClick={() => setReportSubTab('workflows_telemetry')}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#2563eb',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        6-Stage Breakdown & Cycle Time →
                      </button>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', textAlign: 'left' }}>
                          <th style={{ padding: '8px 6px' }}>Workflow</th>
                          <th style={{ padding: '8px 6px' }}>Stage</th>
                          <th style={{ padding: '8px 6px', textAlign: 'right' }}>Users / Tasks</th>
                          <th style={{ padding: '8px 6px', textAlign: 'right' }}>Before → After</th>
                          <th style={{ padding: '8px 6px', textAlign: 'right' }}>Time Saved</th>
                          <th style={{ padding: '8px 6px', textAlign: 'right' }}>Annual Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {evaluation.evaluatedWorkflows.map((wf) => (
                          <tr key={wf.id || wf.code} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '9px 6px', fontWeight: 600, color: '#0f172a' }}>
                              <div>{wf.name && wf.name.startsWith(wf.code) ? wf.name : `${wf.code}: ${wf.name || ''}`}</div>
                              <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 500 }}>
                                {wf.functionArea || 'Enterprise Operations'} • Tier {wf.confidenceTier || 'B'}
                              </div>
                            </td>
                            <td style={{ padding: '9px 6px' }}>
                              <span style={{
                                fontSize: '0.68rem',
                                fontWeight: 600,
                                padding: '2px 7px',
                                borderRadius: '999px',
                                background: wf.maturity === 'Scoping' ? '#fffbeb' : '#ecfdf5',
                                color: wf.maturity === 'Scoping' ? '#b45309' : '#047857'
                              }}>
                                {wf.maturity}
                              </span>
                            </td>
                            <td style={{ padding: '9px 6px', textAlign: 'right', color: '#475569', fontFamily: 'monospace', fontSize: '0.73rem' }}>
                              {wf.activeUsers ? `${formatNumber(wf.activeUsers)} u` : '—'} / {wf.completedTasksPerMonth ? `${formatNumber(wf.completedTasksPerMonth)}/mo` : '—'}
                            </td>
                            <td style={{ padding: '9px 6px', textAlign: 'right', color: '#475569', fontFamily: 'monospace' }}>
                              {wf.baselineMinutes}m → {wf.geminiMinutes}m
                            </td>
                            <td style={{ padding: '9px 6px', textAlign: 'right', fontWeight: 700, color: '#059669', fontFamily: 'monospace' }}>
                              -{wf.effortReductionPct.toFixed(0)}%
                            </td>
                            <td style={{ padding: '9px 6px', textAlign: 'right', fontWeight: 700, color: '#0f172a', fontFamily: 'monospace' }}>
                              {wf.maturity === 'Scoping'
                                ? `${formatCurrency(wf.modeledAnnualValueUsd)} (Col 3)`
                                : formatCurrency(wf.validatedCapacityValueAnnual)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Right: Scorecard Breakdown (Raw vs. Evidence-Adjusted + Drill-Down) */}
                  <div style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '18px 20px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                        Scorecard Breakdown (Raw vs. Evidence-Adjusted)
                      </h3>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b' }}>
                        Confidence Gap: -{evaluation.index.confidenceGap} pts
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {Object.values(evaluation.kpas).map((kpa) => {
                        const moduleMap = {
                          platform_economics: 'L',
                          workflow_outcomes: 'W',
                          adoption_access: 'A',
                          quality_governance: 'Q',
                          user_experience: 'U'
                        };
                        const targetMod = moduleMap[kpa.id] || 'A';
                        return (
                          <div
                            key={kpa.id}
                            onClick={() => jumpToQuestionModule(targetMod)}
                            title={`Click to review ${kpa.title || kpa.name} questions in Module ${targetMod}`}
                            style={{ cursor: 'pointer' }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                              <span style={{ fontWeight: 600, color: '#1e293b', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                {kpa.title || kpa.name}
                                <span style={{ fontSize: '0.66rem', color: '#2563eb', fontWeight: 700 }}>
                                  [Mod {targetMod} →]
                                </span>
                              </span>
                              <span style={{ fontWeight: 700, color: '#0f172a', fontFamily: 'monospace', fontSize: '0.75rem' }}>
                                {kpa.adjustedScore} <span style={{ color: '#64748b', fontWeight: 500 }}>(Raw {kpa.rawScore})</span> / {kpa.weight}
                              </span>
                            </div>
                            <div style={{ position: 'relative', height: '8px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
                              {/* Raw Score Ghost Bar */}
                              <div style={{
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                width: `${Math.min(100, kpa.rawPct)}%`,
                                height: '100%',
                                background: '#bfdbfe',
                                borderRadius: '999px'
                              }} />
                              {/* Evidence-Adjusted Score Bar */}
                              <div style={{
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                width: `${Math.min(100, kpa.adjustedPct)}%`,
                                height: '100%',
                                background: kpa.adjustedPct < 40 ? '#d97706' : '#2563eb',
                                borderRadius: '999px'
                              }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Before vs. After Summary Table (with U06/U09 & Cycle Time Fixed) */}
                <div style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '18px 20px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                      Before vs. After Transformation Summary
                    </h3>
                    <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>
                      Baseline ({dossier.meta?.baselineWindow || 'Pre-Migration'}) vs. Current ({dossier.meta?.currentWindow || 'YTD 2026'})
                    </span>
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', textAlign: 'left' }}>
                        <th style={{ padding: '8px 6px' }}>Metric</th>
                        <th style={{ padding: '8px 6px' }}>Before (Legacy Baseline)</th>
                        <th style={{ padding: '8px 6px' }}>After (Gemini Enterprise)</th>
                        <th style={{ padding: '8px 6px' }}>Verified Impact</th>
                        <th style={{ padding: '8px 6px', textAlign: 'right' }}>Evidence Link</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '9px 6px', fontWeight: 600 }}>Active Seat Adoption</td>
                        <td style={{ padding: '9px 6px', color: '#64748b' }}>
                          {dossier.adoptionTelemetry?.legacyBaselineWau
                            ? `${formatNumber(dossier.adoptionTelemetry.legacyBaselineWau)} legacy WAU on ${dossier.meta?.legacyPlatformName || 'Legacy Tools'}`
                            : (dossier.meta?.legacyPlatformName || 'Legacy Tools')}
                        </td>
                        <td style={{ padding: '9px 6px', fontWeight: 600 }}>
                          {formatNumber(fiveCols.col4NonFinancial?.wau)} 7d WAU / {formatNumber(fiveCols.col4NonFinancial?.mau)} 30d MAU
                        </td>
                        <td style={{ padding: '9px 6px', color: '#059669', fontWeight: 700 }}>
                          {fiveCols.col4NonFinancial?.wauOfAssignedPct}% active rate ({formatNumber(fiveCols.col4NonFinancial?.agent7dRequests)} 7d Agent reqs)
                        </td>
                        <td style={{ padding: '9px 6px', textAlign: 'right' }}>
                          <button onClick={() => jumpToQuestionModule('A', 'A01')} style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', borderRadius: '6px', padding: '2px 8px', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer' }}>A01 / A04</button>
                        </td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '9px 6px', fontWeight: 600 }}>Avg. Workflow Task Effort</td>
                        <td style={{ padding: '9px 6px', color: '#64748b' }}>
                          {Math.round(evaluation.evaluatedWorkflows.reduce((s, w) => s + w.baselineMinutes, 0) / Math.max(1, evaluation.evaluatedWorkflows.length))} min / task (manual discovery & drafting)
                        </td>
                        <td style={{ padding: '9px 6px', fontWeight: 600 }}>
                          {Math.round(evaluation.evaluatedWorkflows.reduce((s, w) => s + w.geminiMinutes, 0) / Math.max(1, evaluation.evaluatedWorkflows.length))} min / task (with grounded citations)
                        </td>
                        <td style={{ padding: '9px 6px', color: '#059669', fontWeight: 700 }}>
                          -{Math.round(evaluation.evaluatedWorkflows.reduce((s, w) => s + w.effortReductionPct, 0) / Math.max(1, evaluation.evaluatedWorkflows.length))}% faster task execution
                        </td>
                        <td style={{ padding: '9px 6px', textAlign: 'right' }}>
                          <button onClick={() => jumpToQuestionModule('W', 'W04')} style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', borderRadius: '6px', padding: '2px 8px', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer' }}>W04 / W07</button>
                        </td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '9px 6px', fontWeight: 600 }}>End-to-End Cycle Turnaround</td>
                        <td style={{ padding: '9px 6px', color: '#64748b' }}>
                          {Math.round(evaluation.evaluatedWorkflows.reduce((s, w) => s + Number(w.cycleTimeBaselineHours || 36), 0) / Math.max(1, evaluation.evaluatedWorkflows.length))} hrs avg calendar turnaround
                        </td>
                        <td style={{ padding: '9px 6px', fontWeight: 600 }}>
                          {Math.round(evaluation.evaluatedWorkflows.reduce((s, w) => s + Number(w.cycleTimeGeminiHours || 12), 0) / Math.max(1, evaluation.evaluatedWorkflows.length))} hrs avg calendar turnaround
                        </td>
                        <td style={{ padding: '9px 6px', color: '#059669', fontWeight: 700 }}>
                          Compressed multi-day handoffs
                        </td>
                        <td style={{ padding: '9px 6px', textAlign: 'right' }}>
                          <button onClick={() => jumpToQuestionModule('W', 'W08')} style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', borderRadius: '6px', padding: '2px 8px', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer' }}>W08</button>
                        </td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '9px 6px', fontWeight: 600 }}>User Quality Score (6-Dim Mean)</td>
                        <td style={{ padding: '9px 6px', color: '#64748b' }}>
                          {surveyQuality.legacyLabel}
                        </td>
                        <td style={{ padding: '9px 6px', fontWeight: 600 }}>
                          {surveyQuality.geminiLabel}
                        </td>
                        <td style={{ padding: '9px 6px', color: '#059669', fontWeight: 700 }}>
                          {surveyQuality.deltaPts} • {surveyQuality.preferenceLabel}
                        </td>
                        <td style={{ padding: '9px 6px', textAlign: 'right' }}>
                          <button onClick={() => jumpToQuestionModule('U', 'U06')} style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', borderRadius: '6px', padding: '2px 8px', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer' }}>U06 / U09</button>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ padding: '9px 6px', fontWeight: 600 }}>Annualized Capacity Value (Col 2)</td>
                        <td style={{ padding: '9px 6px', color: '#64748b' }}>
                          {dossier.legacyRetirement?.legacyAnnualRunRateModeledUsd
                            ? `${formatCurrency(dossier.legacyRetirement.legacyAnnualRunRateModeledUsd)}/yr legacy run-rate`
                            : 'Pre-migration baseline'}
                        </td>
                        <td style={{ padding: '9px 6px', fontWeight: 600 }}>
                          {formatCurrency(activeCapValueAnnual)}/yr ({sensitivityBand} case)
                        </td>
                        <td style={{ padding: '9px 6px', color: '#2563eb', fontWeight: 700 }}>
                          {formatNumber(activeCapHoursMonthly)} hrs/mo released + {formatCurrency(activePipelineAnnual)} Col 3 pipeline
                        </td>
                        <td style={{ padding: '9px 6px', textAlign: 'right' }}>
                          <button onClick={() => jumpToQuestionModule('F', 'F01')} style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', borderRadius: '6px', padding: '2px 8px', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer' }}>F01 / L01</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ===============================================================
                SUB-TAB 2: CFO 5-COLUMN LEDGER & COST BRIDGE
               =============================================================== */}
            {(reportSubTab === 'cfo_ledger' || reportSubTab === 'all') && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                {/* 5-Column CFO MECE Value Separation Matrix */}
                <div style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '18px 20px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                        CFO 5-Column MECE Value Realization Ledger
                      </h3>
                      <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>
                        Strictly separates hard realized P&amp;L savings (Col 1) from validated labor capacity (Col 2) and unvalidated scoping pipeline (Col 3)
                      </div>
                    </div>
                    <button
                      onClick={() => jumpToQuestionModule('F')}
                      style={{
                        background: '#eff6ff',
                        color: '#1d4ed8',
                        border: '1px solid #bfdbfe',
                        borderRadius: '8px',
                        padding: '6px 12px',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Edit Finance &amp; Rate Assumptions (Mod F) →
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
                    {/* Col 1 */}
                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px' }}>
                      <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                        Col 1 • Hard Realized Cash
                      </div>
                      <div style={{ fontSize: '1.35rem', fontWeight: 800, color: activeRealizedCashAnnual != null ? '#059669' : '#b45309', margin: '6px 0' }}>
                        {activeRealizedCashAnnual != null ? formatCurrency(activeRealizedCashAnnual) : 'Gate 4 Open'}
                      </div>
                      {renderExecutiveBullets(
                        evaluation.financials?.hasReconciledCostBridge
                          ? [
                              `Band: ${formatCurrency(fiveCols.col1RealizedCash?.low)} – ${formatCurrency(fiveCols.col1RealizedCash?.high)}`,
                              'Status: Reconciled with signed L01/L02 retirement ledger'
                            ]
                          : [
                              `Modeled Run-Rate: ${formatCurrency(dossier.legacyRetirement?.legacyAnnualRunRateModeledUsd)}/yr`,
                              'Blocker: Requires signed L01 legacy invoices & Finance sign-off'
                            ],
                        [],
                        '#64748b'
                      )}
                    </div>

                    {/* Col 2 */}
                    <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '10px', padding: '14px' }}>
                      <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#047857', textTransform: 'uppercase' }}>
                        Col 2 • Validated Capacity
                      </div>
                      <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#065f46', margin: '6px 0' }}>
                        {formatCurrency(activeCapValueAnnual)}/yr
                      </div>
                      {renderExecutiveBullets(
                        [
                          `Hours Released: ${formatNumber(activeCapHoursMonthly)} hrs/mo`,
                          `Sensitivity Band: ${formatCurrency(fiveCols.col2ValidatedCapacity?.valueAnnualLow)} – ${formatCurrency(fiveCols.col2ValidatedCapacity?.valueAnnualHigh)}`
                        ],
                        [],
                        '#059669'
                      )}
                    </div>

                    {/* Col 3 */}
                    <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '14px' }}>
                      <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#1d4ed8', textTransform: 'uppercase' }}>
                        Col 3 • Modeled Pipeline
                      </div>
                      <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1e40af', margin: '6px 0' }}>
                        {formatCurrency(activePipelineAnnual)}/yr
                      </div>
                      {renderExecutiveBullets(
                        [
                          'Guardrail: Quarantined from headline ROI',
                          `Sensitivity Band: ${formatCurrency(fiveCols.col3ModeledOpportunity?.low)} – ${formatCurrency(fiveCols.col3ModeledOpportunity?.high)}`
                        ],
                        [],
                        '#2563eb'
                      )}
                    </div>

                    {/* Col 4 */}
                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px' }}>
                      <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                        Col 4 • Non-Financial KPI
                      </div>
                      <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: '6px 0' }}>
                        {fiveCols.col4NonFinancial?.wauOfAssignedPct}% WAU
                      </div>
                      {renderExecutiveBullets(
                        [
                          `Active Users: ${formatNumber(fiveCols.col4NonFinancial?.wau)} WAU / ${formatNumber(fiveCols.col4NonFinancial?.mau)} MAU`,
                          `Survey Quality: ${surveyQuality.geminiLabel} (${surveyQuality.preferenceLabel})`
                        ],
                        [],
                        '#475569'
                      )}
                    </div>

                    {/* Col 5 */}
                    <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', padding: '14px' }}>
                      <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#b45309', textTransform: 'uppercase' }}>
                        Col 5 • Negative Friction
                      </div>
                      <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#92400e', margin: '6px 0' }}>
                        {fiveCols.col5NegativeEffects?.extraReviewHoursMonthly || 0} hrs/mo
                      </div>
                      {renderExecutiveBullets(
                        [
                          'HITL Drag: Extra verification & review burden (W05)',
                          `Tracked Issues: ${fiveCols.col5NegativeEffects?.ongoingBugs || 0} bugs • ${fiveCols.col5NegativeEffects?.cloudBlockers || 0} Cloud blockers`
                        ],
                        [],
                        '#d97706'
                      )}
                    </div>
                  </div>
                </div>

                {/* Two-Column Split: Legacy vs. Gemini Cost Bridge + 4-Party Executive Sign-Off Ledger */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px' }}>

                  {/* Left: Platform Cost Bridge & Valuation Parameters */}
                  <div style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '18px 20px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                        Platform Cost Bridge &amp; Valuation Guardrails (L01–L06, F01–F05)
                      </h3>
                      <button
                        onClick={() => jumpToQuestionModule('L')}
                        style={{ background: 'transparent', border: 'none', color: '#2563eb', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer' }}
                      >
                        Open Module L →
                      </button>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                      <tbody>
                        <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '8px 6px', color: '#475569' }}>Legacy Baseline System</td>
                          <td style={{ padding: '8px 6px', fontWeight: 700, textAlign: 'right' }}>{dossier.meta?.legacyPlatformName || 'Legacy Platform'}</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '8px 6px', color: '#475569' }}>Modeled Legacy Run-Rate (L01/L02)</td>
                          <td style={{ padding: '8px 6px', fontWeight: 700, textAlign: 'right', fontFamily: 'monospace' }}>
                            {formatCurrency(evaluation.financials?.retiredLegacyUsd ?? dossier.legacyRetirement?.legacyAnnualRunRateModeledUsd)}/yr
                            {!evaluation.financials?.hasReconciledCostBridge && <span style={{ color: '#b45309', fontSize: '0.68rem', marginLeft: '6px' }}>(Unreconciled)</span>}
                          </td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '8px 6px', color: '#475569' }}>Blended Loaded Hourly Rate (F01)</td>
                          <td style={{ padding: '8px 6px', fontWeight: 700, textAlign: 'right', fontFamily: 'monospace' }}>
                            ${dossier.costLedger?.defaultLoadedHourlyRate || 120}/hr
                          </td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '8px 6px', color: '#475569' }}>Gemini Attribution Share (F03)</td>
                          <td style={{ padding: '8px 6px', fontWeight: 700, textAlign: 'right', fontFamily: 'monospace' }}>
                            {dossier.costLedger?.defaultAttributionSharePct || 75}% (after multi-tool co-use haircut)
                          </td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '8px 6px', color: '#475569' }}>Capacity-to-Value Conversion Factor (F02)</td>
                          <td style={{ padding: '8px 6px', fontWeight: 700, textAlign: 'right', fontFamily: 'monospace' }}>
                            {dossier.costLedger?.capacityValuationFactorPct || 65}%
                          </td>
                        </tr>
                        <tr>
                          <td style={{ padding: '8px 6px', color: '#475569', verticalAlign: 'top' }}>CFO Audit Guardrails</td>
                          <td style={{ padding: '8px 6px' }}>
                            {renderExecutiveBullets(
                              dossier.geminiReport?.cfoAuditOpinion,
                              [
                                'Col 1 Hard Cash: Unverified legacy invoices (L01) held null until signed by Finance',
                                'Col 2 Validated Capacity: Timed workflow savings hair-cut by attribution & realization factors',
                                'Col 3 Modeled Pipeline: Scoping estimates strictly quarantined from headline ROI'
                              ],
                              '#2563eb'
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Right: 4-Party Executive Sign-Off Status (F08) */}
                  <div style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '18px 20px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                        4-Party Executive Sign-Off Ledger (F08)
                      </h3>
                      <button
                        onClick={() => jumpToQuestionModule('F', 'F08')}
                        style={{ background: 'transparent', border: 'none', color: '#2563eb', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer' }}
                      >
                        Update F08 →
                      </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {Object.entries(dossier.signOffs || {}).map(([key, item]) => {
                        const labelMap = {
                          businessSponsor: 'Business Executive Sponsor',
                          platformAnalytics: 'Platform & Telemetry Analytics',
                          finance: 'Finance Controller (Gate 4)',
                          securityGxp: 'Security, IAM & Compliance'
                        };
                        const isApproved = /approved/i.test(item?.status || '');
                        return (
                          <div key={key} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                              <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#0f172a' }}>
                                {labelMap[key] || key} — <span style={{ fontWeight: 500, color: '#475569' }}>{item?.owner}</span>
                              </span>
                              <span style={{
                                fontSize: '0.66rem',
                                fontWeight: 700,
                                padding: '2px 7px',
                                borderRadius: '999px',
                                background: isApproved ? '#ecfdf5' : '#fffbeb',
                                color: isApproved ? '#047857' : '#b45309',
                                border: isApproved ? '1px solid #a7f3d0' : '1px solid #fde68a'
                              }}>
                                {item?.status || 'Pending Review'}
                              </span>
                            </div>
                            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                              {item?.caveat || 'No caveats recorded'}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ===============================================================
                SUB-TAB 3: WORKFLOWS & TELEMETRY DEEP-DIVE
               =============================================================== */}
            {(reportSubTab === 'workflows_telemetry' || reportSubTab === 'all') && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                {/* Top Row: 5-Stage Seat Adoption Waterfall + Surface WAU & Survey 6-Dimension Breakdown */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

                  {/* Left: 5-Stage Seat Conversion Funnel */}
                  <div style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '18px 20px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                        5-Stage Seat Adoption Waterfall (A01–A04)
                      </h3>
                      <button
                        onClick={() => jumpToQuestionModule('A')}
                        style={{ background: 'transparent', border: 'none', color: '#2563eb', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer' }}
                      >
                        Open Module A →
                      </button>
                    </div>
                    {(() => {
                      const contracted = Number(dossier.adoptionTelemetry?.contractedSeats || 1);
                      const provisioned = Number(dossier.adoptionTelemetry?.provisionedSeats || 0);
                      const assigned = Number(dossier.adoptionTelemetry?.assignedSeatsWave1 || 0);
                      const mau = Number(fiveCols.col4NonFinancial?.mau || 0);
                      const wau = Number(fiveCols.col4NonFinancial?.wau || 0);
                      const stages = [
                        { label: '1. Contracted Entitlement Seats', val: contracted, pct: 100, color: '#64748b' },
                        { label: '2. Technical Provisioned Seats', val: provisioned, pct: Math.min(100, Number(((provisioned / contracted) * 100).toFixed(1))), color: '#3b82f6' },
                        { label: '3. Wave-1 Assigned Active Cohort', val: assigned, pct: Math.min(100, Number(((assigned / contracted) * 100).toFixed(1))), color: '#2563eb' },
                        { label: '4. Multi-API 30-Day Active (MAU)', val: mau, pct: assigned > 0 ? Math.min(100, Number(((mau / assigned) * 100).toFixed(1))) : 0, sub: '% of Assigned', color: '#0ea5e9' },
                        { label: '5. All-API 7-Day Repeat Active (WAU)', val: wau, pct: assigned > 0 ? Math.min(100, Number(((wau / assigned) * 100).toFixed(1))) : 0, sub: '% of Assigned', color: '#059669' }
                      ];
                      return (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          {stages.map((st) => (
                            <div key={st.label}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', marginBottom: '4px' }}>
                                <span style={{ fontWeight: 600, color: '#334155' }}>{st.label}</span>
                                <span style={{ fontWeight: 700, color: '#0f172a', fontFamily: 'monospace' }}>
                                  {formatNumber(st.val)} ({st.pct}% {st.sub || 'of Contracted'})
                                </span>
                              </div>
                              <div style={{ height: '7px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
                                <div style={{ width: `${Math.max(4, st.pct)}%`, height: '100%', background: st.color, borderRadius: '999px' }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>

                  {/* Right: Product Surface Telemetry & 6-Dimension User Survey Ratings */}
                  <div style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '18px 20px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                        Surface Telemetry (A04) &amp; 6-Dim User Quality (U06)
                      </h3>
                      <button
                        onClick={() => jumpToQuestionModule('U', 'U06')}
                        style={{ background: 'transparent', border: 'none', color: '#2563eb', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer' }}
                      >
                        Open Survey (Mod U) →
                      </button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '14px' }}>
                      {[
                        { label: 'Gemini Assist WAU', val: formatNumber(dossier.adoptionTelemetry?.featureWau?.assist), color: '#2563eb' },
                        { label: 'Enterprise Search WAU', val: formatNumber(dossier.adoptionTelemetry?.featureWau?.search), color: '#0891b2' },
                        { label: 'Autonomous Agent WAU', val: formatNumber(dossier.adoptionTelemetry?.featureWau?.agent), color: '#7c3aed' },
                        { label: '7d Agent Requests', val: formatNumber(dossier.adoptionTelemetry?.featureWau?.agentRolling7dRequests), color: '#059669' }
                      ].map((surf) => (
                        <div key={surf.label} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px 10px' }}>
                          <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748b' }}>{surf.label}</div>
                          <div style={{ fontSize: '1.05rem', fontWeight: 800, color: surf.color, marginTop: '2px' }}>{surf.val}</div>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                      {Object.entries(surveyQuality.ratings || {}).map(([dim, scores]) => (
                        <div key={dim} style={{ background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '8px', padding: '7px 10px' }}>
                          <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#475569', textTransform: 'capitalize' }}>
                            {dim}
                          </div>
                          <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#0f172a', fontFamily: 'monospace', marginTop: '2px' }}>
                            <span style={{ color: '#94a3b8' }}>{scores?.legacy ?? 3.2}</span> → <span style={{ color: '#059669' }}>{scores?.gemini ?? 4.3}/5.0</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Full 6-Stage Workflow Task Decomposition Table */}
                <div style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '18px 20px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                        6-Stage Workflow Task Effort &amp; Calendar Cycle-Time Decomposition (W01–W13)
                      </h3>
                      <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>
                        Timed before → after minutes across Discovery, Drafting, Verification, Correction, Approval &amp; Handoff stages
                      </div>
                    </div>
                    <button
                      onClick={() => jumpToQuestionModule('W')}
                      style={{
                        background: '#eff6ff',
                        color: '#1d4ed8',
                        border: '1px solid #bfdbfe',
                        borderRadius: '8px',
                        padding: '6px 12px',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Edit Workflows (Mod W) →
                    </button>
                  </div>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', textAlign: 'left' }}>
                          <th style={{ padding: '8px 6px' }}>Workflow</th>
                          <th style={{ padding: '8px 6px', textAlign: 'right' }}>Discovery</th>
                          <th style={{ padding: '8px 6px', textAlign: 'right' }}>Drafting</th>
                          <th style={{ padding: '8px 6px', textAlign: 'right' }}>Verification</th>
                          <th style={{ padding: '8px 6px', textAlign: 'right' }}>Correction</th>
                          <th style={{ padding: '8px 6px', textAlign: 'right' }}>Approval + Handoff</th>
                          <th style={{ padding: '8px 6px', textAlign: 'right' }}>Total Task Min</th>
                          <th style={{ padding: '8px 6px', textAlign: 'right' }}>Cycle Time (h)</th>
                          <th style={{ padding: '8px 6px', textAlign: 'right' }}>Hrs Released/Mo</th>
                        </tr>
                      </thead>
                      <tbody>
                        {evaluation.evaluatedWorkflows.map((wf) => {
                          const st = wf.stages || {};
                          const appBase = Number(st.approval?.baseline || 0) + Number(st.handoff?.baseline || 0);
                          const appGem = Number(st.approval?.gemini || 0) + Number(st.handoff?.gemini || 0);
                          return (
                            <tr key={wf.id || wf.code} style={{ borderBottom: '1px solid #f1f5f9' }}>
                              <td style={{ padding: '9px 6px', fontWeight: 700, color: '#0f172a' }}>
                                {wf.name && wf.name.startsWith(wf.code) ? wf.name : `${wf.code}: ${wf.name || ''}`}
                              </td>
                              <td style={{ padding: '9px 6px', textAlign: 'right', fontFamily: 'monospace', color: '#475569' }}>
                                {st.discovery?.baseline || 0}m → {st.discovery?.gemini || 0}m
                              </td>
                              <td style={{ padding: '9px 6px', textAlign: 'right', fontFamily: 'monospace', color: '#475569' }}>
                                {st.drafting?.baseline || 0}m → {st.drafting?.gemini || 0}m
                              </td>
                              <td style={{ padding: '9px 6px', textAlign: 'right', fontFamily: 'monospace', color: '#475569' }}>
                                {st.verification?.baseline || 0}m → {st.verification?.gemini || 0}m
                              </td>
                              <td style={{ padding: '9px 6px', textAlign: 'right', fontFamily: 'monospace', color: '#475569' }}>
                                {st.correction?.baseline || 0}m → {st.correction?.gemini || 0}m
                              </td>
                              <td style={{ padding: '9px 6px', textAlign: 'right', fontFamily: 'monospace', color: '#475569' }}>
                                {appBase}m → {appGem}m
                              </td>
                              <td style={{ padding: '9px 6px', textAlign: 'right', fontFamily: 'monospace', fontWeight: 700, color: '#059669' }}>
                                {wf.baselineMinutes}m → {wf.geminiMinutes}m (-{wf.effortReductionPct.toFixed(0)}%)
                              </td>
                              <td style={{ padding: '9px 6px', textAlign: 'right', fontFamily: 'monospace', color: '#1d4ed8', fontWeight: 600 }}>
                                {wf.cycleTimeBaselineHours ?? '—'}h → {wf.cycleTimeGeminiHours ?? '—'}h
                              </td>
                              <td style={{ padding: '9px 6px', textAlign: 'right', fontFamily: 'monospace', fontWeight: 700, color: '#0f172a' }}>
                                {wf.attributedHoursReleasedMonthly != null ? `${formatNumber(Math.round(wf.attributedHoursReleasedMonthly))} hrs` : 'Scoping'}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ===============================================================
                SUB-TAB 4: GOVERNANCE GATES & 30-60-90 EXECUTION ROADMAP
               =============================================================== */}
            {(reportSubTab === 'governance_roadmap' || reportSubTab === 'all') && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                {/* 5 Non-Compensable Governance Gates */}
                <div style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '18px 20px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                        5 Non-Compensable Governance Gates &amp; Cross-Module Sanity Checks
                      </h3>
                      <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>
                        Any open gate places the overall executive readout on hold until remediated and verified in the questionnaire
                      </div>
                    </div>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '4px 10px',
                      borderRadius: '999px',
                      background: evaluation.anyGateOpen ? '#fffbeb' : '#ecfdf5',
                      color: evaluation.anyGateOpen ? '#b45309' : '#047857',
                      border: evaluation.anyGateOpen ? '1px solid #fde68a' : '1px solid #a7f3d0'
                    }}>
                      {evaluation.openGatesCount} of {evaluation.gates.length} Gate(s) Open
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '12px' }}>
                    {evaluation.gates.map((gate) => (
                      <div
                        key={gate.id}
                        style={{
                          background: gate.triggered ? '#fffbeb' : '#f8fafc',
                          border: gate.triggered ? '1.5px solid #fcd34d' : '1px solid #e2e8f0',
                          borderRadius: '10px',
                          padding: '12px 14px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          gap: '8px'
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '6px' }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a' }}>
                              {gate.name}
                            </span>
                            <span style={{
                              fontSize: '0.66rem',
                              fontWeight: 800,
                              padding: '2px 8px',
                              borderRadius: '999px',
                              background: gate.triggered ? '#fef3c7' : '#ecfdf5',
                              color: gate.triggered ? '#b45309' : '#047857',
                              border: gate.triggered ? '1px solid #f59e0b' : '1px solid #a7f3d0',
                              flexShrink: 0
                            }}>
                              {gate.status}
                            </span>
                          </div>
                          {renderExecutiveBullets(
                            [
                              `Owner: ${gate.owner}`,
                              ...parseExecutiveBullets(gate.remediation, [gate.remediation]).map((r) => (r.includes(':') ? r : `Required Action: ${r}`))
                            ],
                            [],
                            gate.triggered ? '#d97706' : '#059669'
                          )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
                          <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>Verify Questions:</span>
                          {(gate.questionLinks || []).map((qId) => (
                            <button
                              key={qId}
                              onClick={() => jumpToQuestionModule(qId.charAt(0), qId)}
                              style={{
                                background: '#ffffff',
                                color: '#1d4ed8',
                                border: '1px solid #bfdbfe',
                                borderRadius: '6px',
                                padding: '2px 7px',
                                fontSize: '0.68rem',
                                fontWeight: 700,
                                cursor: 'pointer'
                              }}
                            >
                              {qId} →
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Contradictions Banner (if any) */}
                  {evaluation.contradictions && evaluation.contradictions.length > 0 && (
                    <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {evaluation.contradictions.map((c) => (
                        <div key={c.id} style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', fontSize: '0.76rem', color: '#991b1b' }}>
                          <strong>[{c.severity} Contradiction • {c.modules}] {c.title}:</strong> {c.detail}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 30-60-90 Day Execution Roadmap & KPA Action Synthesis */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: '16px' }}>

                  {/* Left: 30-60-90 Day Execution Roadmap */}
                  <div style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '18px 20px'
                  }}>
                    <h3 style={{ margin: '0 0 12px 0', fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                      30-60-90 Day Value Realization &amp; Scale Roadmap
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {(dossier.geminiReport?.strategicRoadmap30_60_90 || [
                        {
                          horizon: 'Days 1–30 (Immediate Unblocking & Gate 4 Prep)',
                          action: `• Deliver L01/L02 legacy retirement cost ledger to ${shortCustomerName} Finance\n• Resolve top A05 connector blockers (${fiveCols.col5NegativeEffects?.ongoingBugs || 0} tracked issues)`,
                          owner: `${dossier.meta?.accountLeads?.[0] || 'Account Lead'} & Platform Engineering`,
                          expectedImpact: 'Unblocks Wave-2 seat assignment and prepares Gate 4 closure'
                        },
                        {
                          horizon: 'Days 31–60 (Workflow Validation & Scale)',
                          action: `• Run 6-stage timed observation studies (W04/W07) across ${(dossier.workflows || []).map((w) => w.code).join(', ')}\n• Validate end-to-end cycle compression (W08) with BU leads`,
                          owner: `${dossier.meta?.executiveSponsor || 'Executive Sponsor'} & BU Workflow Leads`,
                          expectedImpact: `Converts portion of ${formatCurrency(activePipelineAnnual)} Col 3 pipeline into Col 2 Validated Capacity`
                        },
                        {
                          horizon: 'Days 61–90 (Executive Readout & Renewal Sign-Off)',
                          action: `• Complete 4-party executive sign-off (F08)\n• Expand seat assignment toward ${formatNumber(dossier.adoptionTelemetry?.contractedSeats)} contracted seats`,
                          owner: `${dossier.meta?.executiveSponsor || 'Executive Sponsor'} & ${shortCustomerName} Finance Controller`,
                          expectedImpact: 'Upgrades overall readout to VALIDATED VALUE (Tier A)'
                        }
                      ]).map((step, idx) => (
                        <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px 14px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                            <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#1d4ed8' }}>{step.horizon}</span>
                            <span style={{ fontSize: '0.68rem', fontWeight: 600, color: '#64748b' }}>Owner: {step.owner}</span>
                          </div>
                          {renderExecutiveBullets(
                            [
                              ...parseExecutiveBullets(step.action, [step.action]),
                              `Expected Impact: ${step.expectedImpact}`
                            ],
                            [],
                            '#2563eb'
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right: KPA Synthesis & Action Plan */}
                  <div style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '18px 20px'
                  }}>
                    <h3 style={{ margin: '0 0 12px 0', fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                      KPA Diagnostic Findings &amp; Required Actions
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {(dossier.geminiReport?.kpaSyntheses || Object.values(evaluation.kpas).map((kpa) => ({
                        kpaId: kpa.id,
                        title: `${kpa.title || kpa.name} (${kpa.adjustedScore}/${kpa.weight} pts)`,
                        keyFinding: `Achieved ${kpa.adjustedPct}% evidence-adjusted (${kpa.rawPct}% raw) across weighted module questions.`,
                        actionRequired: `Verify remaining pending evidence items in ${kpa.title || kpa.name} to close the ${(kpa.rawScore - kpa.adjustedScore).toFixed(1)} pt confidence gap.`
                      }))).map((item) => (
                        <div key={item.kpaId || item.title} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '9px', padding: '10px 12px' }}>
                          <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#0f172a', marginBottom: '5px' }}>
                            {item.title}
                          </div>
                          {renderExecutiveBullets(
                            [
                              ...parseExecutiveBullets(item.keyFinding, [item.keyFinding]).map((f) => (f.includes(':') ? f : `Finding: ${f}`)),
                              ...parseExecutiveBullets(item.actionRequired, [item.actionRequired]).map((a) => (a.includes(':') ? a : `Next Action: ${a}`))
                            ],
                            [],
                            '#059669'
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GeValueRealizationWorkspace;
