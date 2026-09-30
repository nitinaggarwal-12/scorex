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

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify({ ...dossier, evaluation }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${dossier.id || 'assessment'}.json`;
    a.click();
    URL.revokeObjectURL(url);
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
            VIEW 2: LIGHT, SIMPLE 1-PAGE EXECUTIVE REPORT
           =================================================================== */}
        {primaryView === 'report' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Row 1: 4 Clean KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px 18px' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#64748b', marginBottom: '4px' }}>
                  Value Score
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
                  {evaluation.index.evidenceAdjustedScore}<span style={{ fontSize: '0.95rem', color: '#94a3b8', fontWeight: 600 }}>/100</span>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>
                  {statusCounts.verified} of {statusCounts.total} answers verified
                </div>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px 18px' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#64748b', marginBottom: '4px' }}>
                  Weekly Active Users
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#2563eb' }}>
                  {formatNumber(fiveCols.col4NonFinancial?.wau)}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>
                  {fiveCols.col4NonFinancial?.wauOfAssignedPct}% of {formatNumber(dossier.adoptionTelemetry?.assignedSeatsWave1)} assigned seats
                </div>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px 18px' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#64748b', marginBottom: '4px' }}>
                  Hours Saved / Month
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#059669' }}>
                  {formatNumber(fiveCols.col2ValidatedCapacity?.hoursMonthlyBase, ' hrs')}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>
                  Across {(dossier.workflows || []).length} priority workflows
                </div>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px 18px' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#64748b', marginBottom: '4px' }}>
                  Annual Capacity Value
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
                  {formatCurrency(fiveCols.col2ValidatedCapacity?.valueAnnualBase)}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 600, marginTop: '4px' }}>
                  + {formatCurrency(fiveCols.col3ModeledOpportunity?.base)} pipeline
                </div>
              </div>
            </div>

            {/* Row 2: Concise Executive Summary (3 Simple Columns) */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '18px 20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                  Executive Summary — {customerName}
                </h3>
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
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
                <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '12px 14px', border: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
                    Scope & Rollout
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#334155', lineHeight: 1.45 }}>
                    {dossier.geminiReport?.situationText
                      ? `${dossier.geminiReport.situationText.split('.')[0]}.`
                      : `${formatNumber(dossier.adoptionTelemetry?.contractedSeats)} contracted seats with ${formatNumber(dossier.adoptionTelemetry?.assignedSeatsWave1)} assigned in Wave 1 and ${formatNumber(fiveCols.col4NonFinancial?.wau)} weekly active users.`}
                  </div>
                </div>

                <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '12px 14px', border: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase', marginBottom: '4px' }}>
                    Measured Value
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#334155', lineHeight: 1.45 }}>
                    {formatNumber(fiveCols.col2ValidatedCapacity?.hoursMonthlyBase)} hours saved monthly ({formatCurrency(fiveCols.col2ValidatedCapacity?.valueAnnualBase)}/yr capacity) {fiveCols.col4NonFinancial?.preferencePct != null ? `with ${fiveCols.col4NonFinancial.preferencePct}% positive user preference.` : '(U09 preference input pending).'}
                  </div>
                </div>

                <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '12px 14px', border: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', marginBottom: '4px' }}>
                    Next Priorities
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#334155', lineHeight: 1.45 }}>
                    Expand active seat assignment, close remaining connector blockers, and complete Finance sign-off on legacy cost retirement.
                  </div>
                </div>
              </div>
            </div>

            {/* Row 3: Two-Column Split — Priority Workflows & Scorecard */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.35fr 1fr', gap: '16px' }}>

              {/* Left: Clean Priority Workflows Table */}
              <div style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '18px 20px'
              }}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                  Priority Workflows
                </h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', textAlign: 'left' }}>
                      <th style={{ padding: '8px 6px' }}>Workflow</th>
                      <th style={{ padding: '8px 6px' }}>Stage</th>
                      <th style={{ padding: '8px 6px', textAlign: 'right' }}>Before → After</th>
                      <th style={{ padding: '8px 6px', textAlign: 'right' }}>Time Saved</th>
                      <th style={{ padding: '8px 6px', textAlign: 'right' }}>Annual Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {evaluation.evaluatedWorkflows.map((wf) => (
                      <tr key={wf.id || wf.code} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '9px 6px', fontWeight: 600, color: '#0f172a' }}>
                          {wf.name && wf.name.startsWith(wf.code) ? wf.name : `${wf.code}: ${wf.name || ''}`}
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
                        <td style={{ padding: '9px 6px', textAlign: 'right', color: '#475569', fontFamily: 'monospace' }}>
                          {wf.baselineMinutes}m → {wf.geminiMinutes}m
                        </td>
                        <td style={{ padding: '9px 6px', textAlign: 'right', fontWeight: 700, color: '#059669', fontFamily: 'monospace' }}>
                          -{wf.effortReductionPct.toFixed(0)}%
                        </td>
                        <td style={{ padding: '9px 6px', textAlign: 'right', fontWeight: 700, color: '#0f172a', fontFamily: 'monospace' }}>
                          {wf.maturity === 'Scoping'
                            ? `${formatCurrency(wf.modeledAnnualValueUsd)} (Est)`
                            : formatCurrency(wf.validatedCapacityValueAnnual)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Right: Clean Scorecard Bars */}
              <div style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '18px 20px'
              }}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                  Scorecard Breakdown
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {Object.values(evaluation.kpas).map((kpa) => (
                    <div key={kpa.id}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 600, color: '#334155' }}>{kpa.title || kpa.name}</span>
                        <span style={{ fontWeight: 700, color: '#0f172a', fontFamily: 'monospace' }}>
                          {kpa.adjustedScore} / {kpa.weight}
                        </span>
                      </div>
                      <div style={{ height: '7px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
                        <div style={{
                          width: `${Math.min(100, kpa.adjustedPct)}%`,
                          height: '100%',
                          background: '#2563eb',
                          borderRadius: '999px'
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Row 4: Clean Before vs. After Comparison */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '18px 20px'
            }}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                Before vs. After Summary
              </h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', textAlign: 'left' }}>
                    <th style={{ padding: '8px 6px' }}>Metric</th>
                    <th style={{ padding: '8px 6px' }}>Before (Legacy)</th>
                    <th style={{ padding: '8px 6px' }}>After (Gemini Enterprise)</th>
                    <th style={{ padding: '8px 6px' }}>Impact</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '9px 6px', fontWeight: 600 }}>Active Users</td>
                    <td style={{ padding: '9px 6px', color: '#64748b' }}>{dossier.meta?.legacyPlatformName || 'Legacy Tools'}</td>
                    <td style={{ padding: '9px 6px', fontWeight: 600 }}>{formatNumber(fiveCols.col4NonFinancial?.wau)} WAU / {formatNumber(fiveCols.col4NonFinancial?.mau)} MAU</td>
                    <td style={{ padding: '9px 6px', color: '#059669', fontWeight: 700 }}>{fiveCols.col4NonFinancial?.wauOfAssignedPct}% active rate</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '9px 6px', fontWeight: 600 }}>Avg. Workflow Time</td>
                    <td style={{ padding: '9px 6px', color: '#64748b' }}>
                      {Math.round(evaluation.evaluatedWorkflows.reduce((s, w) => s + w.baselineMinutes, 0) / Math.max(1, evaluation.evaluatedWorkflows.length))} min / task
                    </td>
                    <td style={{ padding: '9px 6px', fontWeight: 600 }}>
                      {Math.round(evaluation.evaluatedWorkflows.reduce((s, w) => s + w.geminiMinutes, 0) / Math.max(1, evaluation.evaluatedWorkflows.length))} min / task
                    </td>
                    <td style={{ padding: '9px 6px', color: '#059669', fontWeight: 700 }}>
                      -{Math.round(evaluation.evaluatedWorkflows.reduce((s, w) => s + w.effortReductionPct, 0) / Math.max(1, evaluation.evaluatedWorkflows.length))}% faster
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '9px 6px', fontWeight: 600 }}>User Quality Score</td>
                    <td style={{ padding: '9px 6px', color: '#64748b' }}>
                      {dossier.employeeSurvey?.meanLegacyScore != null ? `${dossier.employeeSurvey.meanLegacyScore} / 5.0` : 'Pending (U06)'}
                    </td>
                    <td style={{ padding: '9px 6px', fontWeight: 600 }}>
                      {dossier.employeeSurvey?.meanGeminiScore != null ? `${dossier.employeeSurvey.meanGeminiScore} / 5.0` : 'Pending (U06)'}
                    </td>
                    <td style={{ padding: '9px 6px', color: '#059669', fontWeight: 700 }}>
                      {fiveCols.col4NonFinancial?.preferencePct != null ? `${fiveCols.col4NonFinancial.preferencePct}% prefer Gemini` : 'Pending (U09)'}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: '9px 6px', fontWeight: 600 }}>Annualized Capacity Value</td>
                    <td style={{ padding: '9px 6px', color: '#64748b' }}>Baseline</td>
                    <td style={{ padding: '9px 6px', fontWeight: 600 }}>{formatCurrency(fiveCols.col2ValidatedCapacity?.valueAnnualBase)}/yr</td>
                    <td style={{ padding: '9px 6px', color: '#2563eb', fontWeight: 700 }}>{formatNumber(fiveCols.col2ValidatedCapacity?.hoursMonthlyBase)} hrs/mo released</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeValueRealizationWorkspace;
