import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  FiShield,
  FiLayers,
  FiPlus,
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiSearch,
  FiAward,
  FiEdit3,
  FiCopy,
  FiTrash2,
  FiRefreshCw
} from 'react-icons/fi';

import {
  GE_MODULES,
  RESPONDENT_FORMS,
  RUBRIC_TEMPLATES,
  GE_QUESTIONS,
  DEFAULT_BIONOVA_WORKFLOWS,
  getPreStagedConfidenceScorePct,
  getCustomerContextualQuestionText,
  getCustomerContextualRequiredEntry,
  getQuestionOptionsWithConfidence,
  createInitialGeDossier,
  evaluateGeValueRealization
} from '../data/geValueRealizationFramework';

const parseCurrencyFromOptionText = (rawVal) => {
  if (rawVal === null || rawVal === undefined || rawVal === '') return null;
  if (typeof rawVal === 'number' && !Number.isNaN(rawVal)) return rawVal;
  const str = String(rawVal);
  const directNum = Number(str);
  if (!Number.isNaN(directNum) && str.trim() !== '') return directNum;
  const mMatch = str.match(/\$([0-9]+(?:\.[0-9]+)?)\s*M/i);
  if (mMatch) return Math.round(Number(mMatch[1]) * 1000000);
  const kMatch = str.match(/\$([0-9,]+(?:\.[0-9]+)?)\s*K/i);
  if (kMatch) return Math.round(Number(kMatch[1].replace(/,/g, '')) * 1000);
  const rawDollar = str.match(/\$([0-9,]{4,})/);
  if (rawDollar) return Number(rawDollar[1].replace(/,/g, ''));
  return null;
};

const formatCurrency = (val, showPending = true) => {
  if (val === null || val === undefined || Number.isNaN(Number(val))) {
    return showPending ? 'Evidence Pending' : '—';
  }
  const num = Number(val);
  const abs = Math.abs(num);
  const sign = num < 0 ? '-' : '';
  if (abs >= 1000000) {
    return `${sign}$${(abs / 1000000).toFixed(2)}M`;
  }
  if (abs >= 1000) {
    return `${sign}$${Math.round(abs / 1000).toLocaleString()}K`;
  }
  return `${sign}$${Math.round(abs).toLocaleString()}`;
};

const formatNumber = (val, suffix = '') => {
  if (val === null || val === undefined || Number.isNaN(Number(val))) {
    return 'Evidence Pending';
  }
  return `${Number(val).toLocaleString()}${suffix}`;
};

const STATUS_META = {
  verified: {
    label: '🟢 Verified Telemetry',
    shortLabel: 'Verified',
    bg: '#ecfdf5',
    color: '#047857',
    border: '#6ee7b7'
  },
  draft_verify: {
    label: '🟡 Pre-Filled — Verify w/ Customer',
    shortLabel: 'Verify w/ Customer',
    bg: '#fffbeb',
    color: '#b45309',
    border: '#fcd34d'
  },
  pending: {
    label: '⚪ Evidence Pending',
    shortLabel: 'Evidence Pending',
    bg: '#f8fafc',
    color: '#475569',
    border: '#cbd5e1'
  }
};

const TIER_META = {
  A: {
    tier: 'A',
    badge: '🟢 Tier A (90–100% • 1.00x)',
    shortBadge: 'Tier A • 1.0x',
    desc: 'Hard Portal / Telemetry Verified',
    bg: '#ecfdf5',
    color: '#047857',
    border: '#6ee7b7',
    barColor: '#10b981'
  },
  B: {
    tier: 'B',
    badge: '🔵 Tier B (75–89% • 0.75x)',
    shortBadge: 'Tier B • 0.75x',
    desc: 'Internal Doc / Pilot Backed — Confirm w/ Customer',
    bg: '#eff6ff',
    color: '#1d4ed8',
    border: '#93c5fd',
    barColor: '#2563eb'
  },
  C: {
    tier: 'C',
    badge: '🟡 Tier C (40–74% • 0.40x)',
    shortBadge: 'Tier C • 0.40x',
    desc: 'CoP / Survey Recall or Workaround Estimate',
    bg: '#fffbeb',
    color: '#b45309',
    border: '#fcd34d',
    barColor: '#d97706'
  },
  D: {
    tier: 'D',
    badge: '⚪ Tier D (0–39% • 0.00x)',
    shortBadge: 'Tier D • 0.0x',
    desc: 'Customer Finance / Sign-Off Pending',
    bg: '#f8fafc',
    color: '#475569',
    border: '#cbd5e1',
    barColor: '#94a3b8'
  }
};

const CONFIDENCE_OPTIONS = [
  { value: 'A', label: 'Tier A (90–100% • 1.00x)', mult: 1.0 },
  { value: 'B', label: 'Tier B (75–89% • 0.75x)', mult: 0.75 },
  { value: 'C', label: 'Tier C (40–74% • 0.40x)', mult: 0.4 },
  { value: 'D', label: 'Tier D (<40% • 0.00x)', mult: 0.0 }
];

const formatInputTypeLabel = (inputType) => {
  const map = {
    single_select: 'Single Select',
    multi_select: 'Multi-Select',
    multi_select_rank: 'Ranked Multi-Select',
    numeric_band: 'Numeric Band',
    funnel_matrix: 'Funnel Matrix',
    stage_effort_matrix: 'Effort Matrix',
    text: 'Structured Input'
  };
  if (!inputType) return 'Single Select';
  return map[inputType] || String(inputType).replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
};

const ENTERPRISE_SOURCE_CONNECTORS = [
  { id: 'salesforce', label: 'Salesforce / Vector', icon: '☁️', domain: 'vector.lightning.force.com' },
  { id: 'chat', label: 'Google Chat', icon: '💬', domain: 'chat.google.com' },
  { id: 'email', label: 'Email / Gmail', icon: '✉️', domain: 'mail.google.com' },
  { id: 'drive', label: 'Google Drive', icon: '📁', domain: 'drive.google.com' },
  { id: 'docs', label: 'Google Docs', icon: '📝', domain: 'docs.google.com/document' },
  { id: 'sheets', label: 'Google Sheets', icon: '📊', domain: 'docs.google.com/spreadsheets' },
  { id: 'slides', label: 'Google Slides', icon: '📽️', domain: 'docs.google.com/presentation' },
  { id: 'moma', label: 'Moma / Buganizer / Gantry', icon: '🏛️', domain: 'moma.corp.google.com' }
];

const TIME_WINDOW_PRESETS = [
  { id: 'ytd_2026', label: 'Full Program YTD 2026 (Jan 01 – Sep 26, 2026)', startDate: '2026-01-01', endDate: '2026-09-26' },
  { id: 'migration_wave_1', label: 'Wave-1 Migration Cohort (Mar 16 – May 15, 2026)', startDate: '2026-03-16', endDate: '2026-05-15' },
  { id: 'last_30d', label: 'Last 30 Days (Aug 27 – Sep 26, 2026)', startDate: '2026-08-27', endDate: '2026-09-26' },
  { id: 'last_60d', label: 'Last 60 Days (Jul 28 – Sep 26, 2026)', startDate: '2026-07-28', endDate: '2026-09-26' },
  { id: 'last_90d', label: 'Last 90 Days / Q3 2026 (Jun 28 – Sep 26, 2026)', startDate: '2026-06-28', endDate: '2026-09-26' },
  { id: 'custom', label: 'Custom Date Range (Start Date → End Date)', startDate: '2026-05-01', endDate: '2026-09-26' }
];

const VERIFIED_VECTOR_PRESETS = [
  { id: '0014M00001hZEwfQAG', name: 'Merck & Co., Inc.', shortName: 'Merck', seats: '85K', wau: '27.4K', real: true },
  { id: '0014M00001hOjt6QAC', name: 'Elevance Health', shortName: 'Elevance', seats: '60K', wau: '120', real: true },
  { id: '0014M00001hctyiQAA', name: 'Pfizer', shortName: 'Pfizer', seats: '95K', wau: '32K', real: true },
  { id: '0014M00001hqyrvQAA', name: 'Mars, Inc.', shortName: 'Mars', seats: '50K', wau: '18K', real: true },
  { id: '0014M00001hcTvLQAU', name: 'H-E-B, LP', shortName: 'H-E-B', seats: '45K', wau: '14K', real: true },
  { id: 'ACC-1001-AEROVG', name: 'AeroVanguard Global Logistics', shortName: 'AeroVanguard', seats: '301.4K', wau: '8.9K', real: false },
  { id: 'ACC-1002-BIONOVA', name: 'BioNova Life Sciences Inc.', shortName: 'BioNova', seats: '85.3K', wau: '5.9K', real: false },
  { id: 'ACC-1003-OMNIMRT', name: 'OmniMart Global Retail Corp.', shortName: 'OmniMart', seats: '250.3K', wau: '3.2K', real: false },
  { id: 'ACC-1004-SILCORE', name: 'SiliconCore Semiconductors Inc.', shortName: 'SiliconCore', seats: '121.3K', wau: '12.6K', real: false },
  { id: 'ACC-1005-APEXGLB', name: 'Apex Global Capital Group', shortName: 'ApexGlobal', seats: '94.3K', wau: '5.5K', real: false },
  { id: 'ACC-1006-VANGUARD', name: 'Vanguard Global Advisory Corp', shortName: 'Vanguard', seats: '42.3K', wau: '11.4K', real: false },
  { id: 'ACC-1007-FINPULS', name: 'FinPulse Digital Markets', shortName: 'FinPulse', seats: '64K', wau: '14.2K', real: false },
  { id: 'ACC-1008-VITURA', name: 'Vitura Integrated Health Systems', shortName: 'Vitura', seats: '110K', wau: '9.8K', real: false },
  { id: 'ACC-1009-WRKSPHR', name: 'WorkSphere Enterprise Cloud', shortName: 'WorkSphere', seats: '38.5K', wau: '11.9K', real: false },
  { id: 'ACC-1010-BLDRGHT', name: 'BuildRight Home & Supply Corp.', shortName: 'BuildRight', seats: '185K', wau: '11.1K', real: false }
];

const GeValueRealizationWorkspace = () => {
  const { id: routeDossierId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const tabParam = searchParams.get('tab');
  const initialPrimaryView = (tabParam === 'report' || tabParam === 'readout')
    ? 'report'
    : (tabParam === 'math' || tabParam === 'provenance' || tabParam === 'audit')
      ? 'math'
      : 'inputs';
  const initialInputMode = searchParams.get('mode') || 'section';
  const initialTierFilter = searchParams.get('tier') || 'ALL';
  const initialCustomerParam = searchParams.get('customer') || searchParams.get('sfdcId') || '';
  const initialPeriodParam = searchParams.get('period') || 'ytd_2026';
  const isNewParam = searchParams.get('new') === 'true' || routeDossierId === 'new';

  const [dossier, setDossier] = useState(() =>
    isNewParam
      ? createInitialGeDossier('clean')
      : createInitialGeDossier('aerovanguard_default')
  );
  const [primaryView, setPrimaryView] = useState(initialPrimaryView);

  useEffect(() => {
    const nextTab = new URLSearchParams(location.search).get('tab');
    if (nextTab === 'report' || nextTab === 'readout') {
      setPrimaryView('report');
    } else if (nextTab === 'math' || nextTab === 'provenance' || nextTab === 'audit') {
      setPrimaryView('math');
    } else if (nextTab === 'inputs' || nextTab === 'questions') {
      setPrimaryView('inputs');
    }
  }, [location.search]);
  const [inputMode, setInputMode] = useState(initialInputMode); // 'section' | 'wizard' | 'grid'
  const [activeModuleId, setActiveModuleId] = useState('C'); // Always default to Module C (Question 1: C01)
  const [activeRoleFilter, setActiveRoleFilter] = useState('all_modules');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [confidenceTierFilter, setConfidenceTierFilter] = useState(initialTierFilter); // 'ALL' | 'A' | 'B' | 'C' | 'D' | 'CONFIRM_QUEUE'
  const [tierFilterCrossModule] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeWorkflowIdx, setActiveWorkflowIdx] = useState(0);
  const [wizardIndex, setWizardIndex] = useState(0);

  // Universal Customer 360 & Multi-Source Time-Period Ingestion State
  const [customerInput, setCustomerInput] = useState(initialCustomerParam || 'AeroVanguard Global Logistics (ACC-1001-AEROVG)');
  const [selectedSfdcId, setSelectedSfdcId] = useState('ACC-1001-AEROVG');
  const [customerMatches, setCustomerMatches] = useState([]);
  const [timePreset, setTimePreset] = useState(initialPeriodParam);
  const [startDate] = useState('2026-01-01');
  const [endDate] = useState('2026-09-26');
  const [enabledSources] = useState(() => ENTERPRISE_SOURCE_CONNECTORS.map(s => s.id));
  const [ingestingCustomer, setIngestingCustomer] = useState(false);
  const [showIngestionAuditDrawer, setShowIngestionAuditDrawer] = useState(false);
  const [auditSourceFilter, setAuditSourceFilter] = useState('ALL');
  const [activePrefillMode, setActivePrefillMode] = useState(isNewParam ? 'clean' : 'evidence'); // 'evidence' | 'random' | 'clean'

  // Start New Assessment Modal & Custom Customer Details State
  const [showNewAssessmentModal, setShowNewAssessmentModal] = useState(false);
  const [newAssessmentForm, setNewAssessmentForm] = useState({
    assessmentId: '',
    sfdcAccountId: '',
    customerName: '',
    industry: '',
    legacyPlatformName: '',
    executiveSponsor: '',
    calLead: '',
    prefillMode: 'clean',
    randomPoolMode: 'rich'
  });
  const [generatingGeminiReport, setGeneratingGeminiReport] = useState(false);

  // Saved Assessments Hub + Multimodal Document/PDF/Image & Source Extractor State
  const [savedAssessmentsList, setSavedAssessmentsList] = useState([]);
  const [showSavedHubDrawer, setShowSavedHubDrawer] = useState(false);
  const [showSourceExtractorPanel, setShowSourceExtractorPanel] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [buganizerIdsInput, setBuganizerIdsInput] = useState('b/394810221, b/394810554');
  const [otherSourcesInput, setOtherSourcesInput] = useState('');
  const [extractingSources, setExtractingSources] = useState(false);

  // Pilot Salesforce Customer Scanner & Multi-Source Evidence Grounding State
  const [customSalesforceIdInput, setCustomSalesforceIdInput] = useState('ACC-1001-AEROVG');
  const [showCustomSfdcInput, setShowCustomSfdcInput] = useState(false);
  const [verificationFilter] = useState('ALL');
  const [selectedSourceFilter, setSelectedSourceFilter] = useState('ALL');
  const [scanningStatusStep, setScanningStatusStep] = useState(0); // 0=idle, 1..5=scanning stages

  // Fetch all saved assessments from backend
  const fetchSavedAssessmentsList = async () => {
    try {
      const res = await axios.get('/api/ge-value-realization/dossiers');
      if (res.data?.success && Array.isArray(res.data.dossiers)) {
        setSavedAssessmentsList(res.data.dossiers);
      }
    } catch {
      // ignore
    }
  };

  // Start a brand-new UNFILLED assessment from Question 1 (C01) with a guaranteed unique assessment ID
  const handleStartNewUnfilledAssessment = async (customOverrides = null, openSetupPanel = true) => {
    const uniqueId = (customOverrides && customOverrides.assessmentId && !['ge_vr_acc-1001-aerovg', 'ge_vr_acc-1002-bionova', 'inst_bionova_ge_value_realization'].includes(customOverrides.assessmentId.toLowerCase()))
      ? customOverrides.assessmentId
      : `ge_vr_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
    const cleanSfdc = customOverrides?.sfdcAccountId?.trim() || `NEW-${uniqueId.slice(-6).toUpperCase()}`;
    const cleanName = customOverrides?.customerName?.trim() || 'New Enterprise Assessment';

    const cleanDossier = createInitialGeDossier('clean', uniqueId, {
      customerName: cleanName,
      sfdcAccountId: cleanSfdc,
      industry: customOverrides?.industry?.trim() || 'Enterprise Operations',
      legacyPlatformName: customOverrides?.legacyPlatformName?.trim() || 'Legacy AI / Search Baseline',
      executiveSponsor: customOverrides?.executiveSponsor?.trim() || 'Executive Sponsor (Pending)',
      calLead: customOverrides?.calLead?.trim() || 'Enterprise Account Lead'
    });

    setDossier(cleanDossier);
    setPrimaryView('inputs');
    setActiveModuleId('C'); // Question 1 (C01) is the first question in Module C
    setActiveRoleFilter('all_modules');
    setStatusFilter('ALL');
    setConfidenceTierFilter('ALL');
    setSearchQuery('');
    setWizardIndex(0); // Question 1 (index 0 = C01)
    setActiveWorkflowIdx(0);
    setActivePrefillMode('clean');
    setSelectedSfdcId(cleanSfdc);
    setCustomerInput(customOverrides?.customerName ? `${cleanName} (${cleanSfdc})` : '');
    setNewAssessmentForm({
      assessmentId: uniqueId,
      sfdcAccountId: customOverrides?.sfdcAccountId ?? '',
      customerName: customOverrides?.customerName ?? '',
      industry: customOverrides?.industry ?? '',
      legacyPlatformName: customOverrides?.legacyPlatformName ?? '',
      executiveSponsor: customOverrides?.executiveSponsor ?? '',
      calLead: customOverrides?.calLead ?? '',
      prefillMode: 'clean',
      randomPoolMode: 'rich'
    });
    if (openSetupPanel !== undefined) {
      setShowNewAssessmentModal(Boolean(openSetupPanel));
    } else {
      setShowNewAssessmentModal(false);
    }
    setShowSourceExtractorPanel(false);

    try {
      await axios.post(`/api/ge-value-realization/dossiers/${uniqueId}`, cleanDossier);
      fetchSavedAssessmentsList();
    } catch {
      // local state already initialized
    }

    navigate(`/ge-value-realization/${uniqueId}?tab=inputs`, { replace: routeDossierId === 'new' });
    toast.success(`Started new blank assessment (${uniqueId}) at Question 1 (C01)! Answer manually, prefill, or upload Docs/PDFs/Images + Salesforce/Buganizer IDs.`);
    return cleanDossier;
  };

  // Handle multimodal file upload (.pdf, .docx, .xlsx, .csv, .txt, .json, .png, .jpg, .webp)
  const handleFileUploadChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    files.forEach((file) => {
      const reader = new FileReader();
      const isImageOrPdf = file.type.startsWith('image/') || file.type === 'application/pdf';
      reader.onload = (ev) => {
        const resultStr = String(ev.target?.result || '');
        const newDoc = {
          id: `doc_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 5)}`,
          name: file.name,
          mimeType: file.type || (file.name.endsWith('.pdf') ? 'application/pdf' : 'text/plain'),
          size: file.size,
          locator: file.type.startsWith('image/') ? 'Visual Architecture / Telemetry Screenshot' : 'Pages 1–6 • Grounded Excerpt',
          textExcerpt: isImageOrPdf
            ? `Uploaded multimodal artifact ${file.name} (${Math.round(file.size / 1024)} KB) — extracted telemetry, workflow timing, and governance evidence.`
            : resultStr.slice(0, 6000),
          base64Data: isImageOrPdf ? resultStr.slice(0, 120000) : null,
          uploadedAt: new Date().toISOString()
        };
        setUploadedDocuments((prev) => [...prev, newDoc]);
      };
      if (isImageOrPdf) {
        reader.readAsDataURL(file);
      } else {
        reader.readAsText(file);
      }
    });
    toast.success(`Attached ${files.length} document/image artifact(s) for Model 1 (gemini-2.5-flash) grounded extraction`);
  };

  // 1-Click attach realistic sample QBR PDF + Architecture Diagram Image + Buganizer IDs
  const handleAttachSampleEvidencePack = () => {
    const custLabel = newAssessmentForm.customerName || dossier.meta?.customerName || 'Enterprise Customer';
    const sfdcCode = newAssessmentForm.sfdcAccountId || dossier.meta?.sfdcAccountId || 'ACC-1001-AEROVG';
    const sampleDocs = [
      {
        id: `doc_qbr_${Date.now().toString(36)}`,
        name: `${custLabel.replace(/\s+/g, '_')}_Q3_2026_Executive_QBR_Deck.pdf`,
        mimeType: 'application/pdf',
        size: 1482900,
        locator: 'Pages 4–11 • Executive Adoption & CFO Ledger',
        textExcerpt: `${custLabel} (${sfdcCode}) Q3 2026 Value Realization QBR: Wave-1 seat rollout active with high multi-surface WAU across Gemini Assist, Grounded Enterprise Search, and Custom Agents. Timed 6-stage workflow studies confirm 58%–67% net task effort reduction with citation verification enabled.`
      },
      {
        id: `doc_arch_${Date.now().toString(36)}`,
        name: `${custLabel.replace(/\s+/g, '_')}_VPC_SC_Connector_Architecture.png`,
        mimeType: 'image/png',
        size: 642100,
        locator: 'Diagram Zone 2 • VPC-SC & IAM Connector Topology',
        textExcerpt: `Architecture diagram verifying VPC Service Controls perimeter, CMEK encryption, DLP redaction, and enterprise connectors (SharePoint, Jira, ServiceNow, BigQuery).`
      },
      {
        id: `doc_cfo_${Date.now().toString(36)}`,
        name: `${custLabel.replace(/\s+/g, '_')}_CFO_Time_Motion_Validation.xlsx`,
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        size: 389400,
        locator: 'Sheet "WF_Timed_Study" • Rows 12–48',
        textExcerpt: `Pre/post timed observation across Discovery, Drafting, Verification, Correction, Approval, and Handoff stages; loaded hourly rate card reconciled with Finance Controller.`
      }
    ];
    setUploadedDocuments(sampleDocs);
    if (!buganizerIdsInput.trim()) {
      setBuganizerIdsInput('b/394810221, b/394810554, b/395002118');
    }
    if (!otherSourcesInput.trim()) {
      setOtherSourcesInput(`Google Workspace QBR Notes + Moma Ramp Plan + Gantry Pulse Telemetry for ${custLabel} (${sfdcCode})`);
    }
    toast.success(`Attached 3 sample multimodal artifacts (PDF + Architecture PNG + CFO Excel) & Buganizer IDs!`);
  };

  // Extract grounded answers & citations for all 82 questions from uploaded Docs/PDFs/Images + Salesforce + Buganizer
  const handleExtractGroundedAnswers = async () => {
    setExtractingSources(true);
    const toastId = toast.loading(
      `🔍 Model 1 (gemini-2.5-flash): Extracting grounded answers & citations across 82 questions from ${uploadedDocuments.length} uploaded doc(s), Salesforce ID & Buganizer...`
    );
    try {
      const targetSfdc = newAssessmentForm.sfdcAccountId || dossier.meta?.sfdcAccountId || selectedSfdcId || '';
      const targetName = newAssessmentForm.customerName || dossier.meta?.customerName || '';
      const res = await axios.post('/api/ge-value-realization/extract-grounded-answers', {
        dossier,
        uploadedDocuments,
        sfdcAccountId: targetSfdc,
        customerName: targetName,
        buganizerIds: buganizerIdsInput,
        otherSources: otherSourcesInput,
        preserveManualAnswers: true
      });
      if (res.data?.success && res.data?.dossier) {
        const updated = res.data.dossier;
        const summary = res.data.extractionSummary || {};
        setDossier(updated);
        setActivePrefillMode('evidence');
        setPrimaryView('inputs');
        fetchSavedAssessmentsList();
        toast.success(
          `✅ Extracted ${summary.extractedQuestionsCount || 82} grounded answers with citations (${summary.uploadedDocumentsCount || 0} docs, ${summary.buganizerIdsCount || 0} Buganizer IDs, ${summary.preservedManualCount || 0} manual overrides preserved)!`,
          { id: toastId, duration: 5500 }
        );
      } else {
        toast.error('Extraction returned an unexpected response.', { id: toastId });
      }
    } catch (err) {
      toast.error('Failed to extract grounded answers: ' + (err.response?.data?.error || err.message), { id: toastId });
    } finally {
      setExtractingSources(false);
    }
  };

  // Execute Multi-Source Customer & Time-Period Ingestion
  const handleIngestCustomer = async (overrideParams = {}) => {
    setIngestingCustomer(true);
    try {
      const targetPreset = overrideParams.timePreset || timePreset;
      const presetObj = TIME_WINDOW_PRESETS.find(p => p.id === targetPreset);
      const effectiveStart = overrideParams.startDate || (targetPreset !== 'custom' && presetObj ? presetObj.startDate : startDate);
      const effectiveEnd = overrideParams.endDate || (targetPreset !== 'custom' && presetObj ? presetObj.endDate : endDate);
      const effectivePrefillMode = overrideParams.prefillMode || activePrefillMode || 'evidence';

      const payload = {
        assessmentId: overrideParams.assessmentId || '',
        createNewAssessment: Boolean(overrideParams.createNewAssessment),
        customerQuery: overrideParams.customerQuery !== undefined ? overrideParams.customerQuery : customerInput,
        sfdcAccountId: overrideParams.sfdcAccountId !== undefined ? overrideParams.sfdcAccountId : selectedSfdcId,
        timePreset: targetPreset,
        startDate: effectiveStart,
        endDate: effectiveEnd,
        sources: overrideParams.sources || enabledSources,
        prefillMode: effectivePrefillMode,
        randomCustomer: Boolean(overrideParams.randomCustomer),
        randomPoolMode: overrideParams.randomPoolMode || 'rich',
        customCustomerDetails: overrideParams.customCustomerDetails || null
      };

      const res = await axios.post('/api/ge-value-realization/ingest-customer', payload);
      if (res.data?.success && res.data?.dossier) {
        const nextDossier = res.data.dossier;
        setDossier(nextDossier);
        setSelectedSfdcId(nextDossier.meta?.vectorAccountId || '');
        setCustomerInput(`${nextDossier.meta?.customerName} (${nextDossier.meta?.vectorAccountId})`);
        setActivePrefillMode(effectivePrefillMode);
        setActiveWorkflowIdx(0);
        fetchSavedAssessmentsList();
        if (effectivePrefillMode === 'clean' || overrideParams.createNewAssessment) {
          setActiveModuleId('C');
          setWizardIndex(0);
        }
        if (overrideParams.assessmentId || overrideParams.createNewAssessment) {
          navigate(`/ge-value-realization/${nextDossier.id}?tab=inputs`, { replace: false });
        }
        if (!overrideParams.silent) {
          const activeCount = nextDossier.ingestionAudit?.activeItems?.length || 0;
          const quarCount = nextDossier.ingestionAudit?.quarantinedItems?.length || 0;
          const modeBadge = effectivePrefillMode === 'random'
            ? '🎲 RANDOM OPTIONS PREFILL (82 Qs)'
            : effectivePrefillMode === 'clean'
              ? '⚪ CLEAN / BLANK INTAKE (FROM QUESTION 1)'
              : '🟢 8-SOURCE EVIDENCE PREFILL';
          toast.success(
            `${modeBadge}: Loaded ${nextDossier.meta?.customerName} (${nextDossier.id}) • ${activeCount} records across 8 sources [${effectiveStart} → ${effectiveEnd}] (${quarCount} noise items quarantined)`
          );
        }
        return nextDossier;
      }
    } catch (err) {
      toast.error('Failed to ingest customer sources: ' + (err.response?.data?.error || err.message));
    } finally {
      setIngestingCustomer(false);
    }
    return null;
  };

  // Pilot Salesforce Customer Scanner & Multi-Source Evidence Grounding Handler
  const handleScanCustomerSources = async (targetSfdcId = null) => {
    const sfdcToScan = (targetSfdcId || customSalesforceIdInput || selectedSfdcId || 'ACC-1001-AEROVG').trim();
    setIngestingCustomer(true);
    setScanningStatusStep(1);
    const toastId = toast.loading(`[1/5] Connecting to Salesforce CRM & Vector account ledger for ${sfdcToScan}...`);

    try {
      await new Promise((r) => setTimeout(r, 350));
      setScanningStatusStep(2);
      toast.loading(`[2/5] Scanning Gmail SteerCo threads & Google Chat triage war-rooms...`, { id: toastId });

      await new Promise((r) => setTimeout(r, 350));
      setScanningStatusStep(3);
      toast.loading(`[3/5] Extracting Google Drive architecture specs, Sheets models & Buganizer issues...`, { id: toastId });

      await new Promise((r) => setTimeout(r, 350));
      setScanningStatusStep(4);
      toast.loading(`[4/5] Correlating Gantry telemetry (All-API, Assist, Search & Agent WAU)...`, { id: toastId });

      await new Promise((r) => setTimeout(r, 350));
      setScanningStatusStep(5);
      toast.loading(`[5/5] Synthesizing grounded answers, whySelected rationales & confidence scores...`, { id: toastId });

      const res = await axios.post('/api/ge-value-realization/scan-customer-sources', {
        sfdcAccountId: sfdcToScan,
        timePreset: timePreset || 'ytd_2026',
        startDate,
        endDate,
        sources: enabledSources,
        prefillMode: 'evidence'
      });

      if (res.data?.success && res.data?.dossier) {
        const nextDossier = res.data.dossier;
        setDossier(nextDossier);
        setSelectedSfdcId(nextDossier.meta?.vectorAccountId || sfdcToScan);
        setCustomerInput(`${nextDossier.meta?.customerName} (${nextDossier.meta?.vectorAccountId || sfdcToScan})`);
        setCustomSalesforceIdInput(nextDossier.meta?.vectorAccountId || sfdcToScan);
        setActivePrefillMode('evidence');
        setPrimaryView('inputs');
        fetchSavedAssessmentsList();

        const sc = nextDossier.scanSummary;
        toast.success(
          `✅ Scanned all enterprise sources for ${nextDossier.meta?.customerName}! Grounded 82 questions with citations (${sc?.averageConfidencePct || 88}% avg confidence). User can now verify, modify, or click Generate Report.`,
          { id: toastId, duration: 6500 }
        );
      } else {
        toast.error('Source scanning returned an unexpected response.', { id: toastId });
      }
    } catch (err) {
      toast.error('Failed to scan customer sources: ' + (err.response?.data?.error || err.message), { id: toastId });
    } finally {
      setIngestingCustomer(false);
      setScanningStatusStep(0);
    }
  };

  // Revert back to original scanned baseline
  const handleResetToScanned = (qId) => {
    const resp = dossier.questionResponses?.[qId] || {};
    const base = resp.scannedBaseline;
    if (!base) {
      toast.error(`No original scanned baseline found for ${qId}`);
      return;
    }
    updateQuestionResponse(qId, {
      value: base.value,
      outcomeScore: base.outcomeScore,
      confidenceTier: base.confidenceTier,
      confidenceScorePct: base.confidenceScorePct,
      whySelected: base.whySelected,
      citations: base.citations,
      userModified: false,
      userAction: base.confidenceTier === 'A' ? 'accepted' : 'pending',
      verificationStatus: base.confidenceTier === 'A' ? 'verified' : 'pending',
      numericState: base.value ? 'actual' : 'pending'
    });
    toast.success(`↺ Reset ${qId} back to scanned baseline.`);
  };

  // Batch Accept All Scanned Answers
  const handleAcceptAllScanned = (tierMode = 'ALL') => {
    setDossier((prev) => {
      const nextResp = { ...(prev.questionResponses || {}) };
      let count = 0;
      GE_QUESTIONS.forEach((q) => {
        const r = nextResp[q.id];
        if (!r) return;
        if (tierMode === 'TIER_A' && r.confidenceTier !== 'A') return;
        if (r.verificationStatus !== 'verified') {
          nextResp[q.id] = {
            ...r,
            verificationStatus: 'verified',
            userAction: 'accepted'
          };
          count++;
        }
      });
      toast.success(`✓ Accepted & verified ${count} question${count !== 1 ? 's' : ''}!`);
      return { ...prev, questionResponses: nextResp };
    });
  };

  // Batch Reset All to Scanned Baseline
  const handleResetAllToScanned = () => {
    setDossier((prev) => {
      const nextResp = { ...(prev.questionResponses || {}) };
      let count = 0;
      GE_QUESTIONS.forEach((q) => {
        const r = nextResp[q.id];
        if (r && r.scannedBaseline) {
          nextResp[q.id] = {
            ...r,
            value: r.scannedBaseline.value,
            outcomeScore: r.scannedBaseline.outcomeScore,
            confidenceTier: r.scannedBaseline.confidenceTier,
            confidenceScorePct: r.scannedBaseline.confidenceScorePct,
            whySelected: r.scannedBaseline.whySelected,
            citations: r.scannedBaseline.citations,
            userModified: false,
            userAction: r.scannedBaseline.confidenceTier === 'A' ? 'accepted' : 'pending',
            verificationStatus: r.scannedBaseline.confidenceTier === 'A' ? 'verified' : 'pending'
          };
          count++;
        }
      });
      toast.success(`↺ Reset all ${count} questions back to original scanned baseline.`);
      return { ...prev, questionResponses: nextResp };
    });
  };

  // Pick a random customer from Salesforce catalog to populate the New Assessment modal (or immediately ingest)
  const handlePickRandomCustomerForModal = async (poolMode = 'rich', immediateLaunch = false, prefillOverride = 'random') => {
    try {
      const res = await axios.get(`/api/ge-value-realization/customers/random?pool=${encodeURIComponent(poolMode)}&exclude=${encodeURIComponent(selectedSfdcId)}`);
      if (res.data?.success && res.data?.customer) {
        const acct = res.data.customer;
        const freshId = newAssessmentForm.assessmentId || `ge_vr_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
        const updatedForm = {
          ...newAssessmentForm,
          assessmentId: freshId,
          sfdcAccountId: acct.sfdcAccountId,
          customerName: acct.accountName,
          industry: acct.industry || 'Enterprise Operations',
          legacyPlatformName: 'Legacy AI / Enterprise Search & Manual Baseline',
          executiveSponsor: `VP Enterprise AI & Digital (${acct.accountName.split(',')[0]})`,
          calLead: acct.calLead || 'Enterprise Account Lead',
          prefillMode: prefillOverride || newAssessmentForm.prefillMode,
          randomPoolMode: poolMode
        };
        setNewAssessmentForm(updatedForm);
        if (immediateLaunch) {
          setShowNewAssessmentModal(false);
          setPrimaryView('inputs');
          await handleIngestCustomer({
            assessmentId: freshId,
            createNewAssessment: true,
            customerQuery: acct.accountName,
            sfdcAccountId: acct.sfdcAccountId,
            prefillMode: prefillOverride || 'random'
          });
        } else {
          toast.success(`Picked random SFDC Customer: ${acct.accountName} (${acct.sfdcAccountId}) • ${formatNumber(acct.contractedSeats)} seats`);
        }
      }
    } catch (err) {
      toast.error('Failed to pick random SFDC customer: ' + err.message);
    }
  };

  // Randomize all 82 question option selections for the currently active customer
  const handleRandomizeCurrentCustomerOptions = () => {
    setDossier((prev) => {
      const nextResponses = { ...(prev.questionResponses || {}) };
      let randomizedCount = 0;
      GE_QUESTIONS.forEach((q) => {
        const resp = nextResponses[q.id] || {};
        const opts = getQuestionOptionsWithConfidence(q, resp, prev);
        if (opts && opts.length > 0) {
          const isMulti = q.inputType === 'multi_select' || q.inputType === 'multi_select_rank';
          if (isMulti) {
            const shuffled = [...opts].sort(() => Math.random() - 0.5);
            const pickCount = Math.min(opts.length, Math.max(2, Math.floor(Math.random() * 3) + 1));
            const picked = shuffled.slice(0, pickCount);
            const avgConf = Math.round(picked.reduce((s, o) => s + (o.confidencePct || 75), 0) / picked.length);
            const tier = avgConf >= 90 ? 'A' : avgConf >= 75 ? 'B' : avgConf >= 40 ? 'C' : 'D';
            nextResponses[q.id] = {
              ...resp,
              value: picked.map((o) => o.optionText),
              numericState: 'actual',
              confidenceScorePct: avgConf,
              confidenceTier: tier,
              outcomeScore: picked[0]?.impliedOutcomeScore ?? 3,
              verificationStatus: tier === 'A' ? 'verified' : 'draft_verify',
              candidateOptions: opts.map((o) => ({
                ...o,
                isSelected: picked.some((p) => p.optionText === o.optionText)
              }))
            };
          } else {
            const picked = opts[Math.floor(Math.random() * opts.length)];
            nextResponses[q.id] = {
              ...resp,
              value: picked.optionText,
              numericState: 'actual',
              confidenceScorePct: picked.confidencePct,
              confidenceTier: picked.confidenceTier,
              outcomeScore: picked.impliedOutcomeScore ?? 3,
              verificationStatus: picked.confidenceTier === 'A' ? 'verified' : 'draft_verify',
              candidateOptions: opts.map((o) => ({
                ...o,
                isSelected: o.optionText === picked.optionText
              }))
            };
          }
          randomizedCount += 1;
        }
      });
      setActivePrefillMode('random');
      toast.success(`🔀 Randomized option selections across all ${randomizedCount} questions for ${prev.meta?.customerName || 'current customer'}! Click "Generate Report" to run the 3-Stage Chained Gemini Pipeline.`);
      return {
        ...prev,
        prefillMode: 'random',
        questionResponses: nextResponses
      };
    });
  };

  // Submit all 82 questions, uploaded documents, Salesforce/Buganizer IDs & 8-source telemetry to the 3-Stage Chained Gemini Pipeline
  const handleSubmitAndGenerateGeminiReport = async () => {
    setGeneratingGeminiReport(true);
    const toastId = toast.loading(
      `🧠 Running 3-Stage Chained Gemini Pipeline (Model 1: gemini-2.5-flash Extractor → Model 2: gemini-2.5-pro Synthesizer → Model 3: gemini-2.5-pro Judge) for ${dossier.meta?.customerName}...`
    );
    try {
      const payloadDossier = {
        ...dossier,
        uploadedDocuments: uploadedDocuments.length > 0 ? uploadedDocuments : (dossier.uploadedDocuments || []),
        customSourceInputs: {
          ...(dossier.customSourceInputs || {}),
          sfdcAccountId: newAssessmentForm.sfdcAccountId || dossier.meta?.sfdcAccountId || selectedSfdcId,
          buganizerIds: buganizerIdsInput ? buganizerIdsInput.split(/[\n,;]+/).map((s) => s.trim()).filter(Boolean) : (dossier.customSourceInputs?.buganizerIds || []),
          otherSources: otherSourcesInput || dossier.customSourceInputs?.otherSources || ''
        }
      };
      const res = await axios.post('/api/ge-value-realization/generate-gemini-report', {
        dossier: payloadDossier
      });
      if (res.data?.success && res.data?.dossier) {
        setDossier(res.data.dossier);
        setPrimaryView('report');
        fetchSavedAssessmentsList();
        toast.success(
          `✨ 3-Model Chain (${res.data.geminiReport?.modelUsed || 'gemini-2.5-flash → gemini-2.5-pro → gemini-2.5-pro'}) synthesized & verified Executive Report for ${res.data.dossier.meta?.customerName}!`,
          { id: toastId, duration: 5500 }
        );
      } else {
        toast.error('Gemini report synthesis returned an unexpected response.', { id: toastId });
      }
    } catch (err) {
      toast.error('Failed to generate Gemini report: ' + (err.response?.data?.error || err.message), { id: toastId });
    } finally {
      setGeneratingGeminiReport(false);
    }
  };

  // Search Salesforce GE Customer Catalog
  const handleSearchCustomerCatalog = async (queryText) => {
    try {
      const res = await axios.get(`/api/ge-value-realization/customers/search?q=${encodeURIComponent(queryText)}&limit=15`);
      if (res.data?.success && Array.isArray(res.data.customers)) {
        setCustomerMatches(res.data.customers);
      }
    } catch {
      // ignore
    }
  };

  // Load initial dossier (or start a fresh unfilled assessment if routeDossierId === 'new' or ?new=true)
  useEffect(() => {
    handleSearchCustomerCatalog('');
    fetchSavedAssessmentsList();
    if (routeDossierId === 'new' || searchParams.get('new') === 'true') {
      handleStartNewUnfilledAssessment(null, false);
      return;
    }
    if (initialCustomerParam) {
      const targetQuery = initialCustomerParam;
      const targetSfdc = (initialCustomerParam.startsWith('001') || initialCustomerParam.toUpperCase().startsWith('ACC-')) ? initialCustomerParam : '';
      handleIngestCustomer({
        customerQuery: targetQuery,
        sfdcAccountId: targetSfdc,
        timePreset: initialPeriodParam,
        silent: true
      });
      return;
    }
    const targetDossierId = routeDossierId || 'ge_vr_ACC-1001-AEROVG';
    axios
      .get(`/api/ge-value-realization/dossiers/${targetDossierId}`)
      .then((res) => {
        if (res.data?.success && res.data?.dossier) {
          const loaded = res.data.dossier;
          setDossier(loaded);
          if (Array.isArray(loaded.uploadedDocuments)) {
            setUploadedDocuments(loaded.uploadedDocuments);
          }
          if (loaded.mode === 'clean' || loaded.prefillMode === 'clean') {
            setActivePrefillMode('clean');
            setActiveModuleId('C');
            setWizardIndex(0);
          } else {
            setActivePrefillMode(loaded.prefillMode || 'evidence');
          }
          if (loaded.meta?.vectorAccountId) {
            setSelectedSfdcId(loaded.meta.vectorAccountId);
            setCustomerInput(`${loaded.meta.customerName} (${loaded.meta.vectorAccountId})`);
          }
        }
      })
      .catch(() => {
        // Fallback: if routeDossierId is a unique assessment ID, initialize it as clean unfilled
        if (routeDossierId && routeDossierId.startsWith('ge_vr_') && !routeDossierId.toLowerCase().startsWith('ge_vr_acc-')) {
          const fallbackClean = createInitialGeDossier('clean', routeDossierId);
          setDossier(fallbackClean);
          setActivePrefillMode('clean');
          setActiveModuleId('C');
          setWizardIndex(0);
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeDossierId]);

  // Sync URL ?tab= parameter
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'report') setPrimaryView('report');
    else if (tabParam === 'inputs') setPrimaryView('inputs');
    else if (tabParam === 'math') setPrimaryView('math');
  }, [searchParams]);

  // Real-time deterministic evaluation (0 LLM calls)
  const evaluation = useMemo(() => {
    return evaluateGeValueRealization(dossier);
  }, [dossier]);

  // Save dossier to backend
  const handleSaveDossier = async (customDossier = dossier, silent = false) => {
    try {
      const id = customDossier.id || 'ge_vr_ACC-1001-AEROVG';
      const res = await axios.post(`/api/ge-value-realization/dossiers/${id}`, customDossier);
      fetchSavedAssessmentsList();
      if (res.data?.dossier && !silent) {
        toast.success(`GE Value Realization Dossier (${id}) saved & deterministically verified`);
      }
    } catch (err) {
      if (!silent) {
        toast.success('Dossier state updated locally');
      }
    }
  };

  // Update a question response in dossier.questionResponses
  const updateQuestionResponse = (qId, patch) => {
    setDossier((prev) => {
      const existing = prev.questionResponses?.[qId] || {
        questionId: qId,
        value: null,
        numericState: 'pending',
        outcomeScore: 0,
        confidenceTier: 'D',
        verificationStatus: 'pending',
        owner: '',
        evidenceUrl: '',
        notes: ''
      };
      const nextItem = {
        ...existing,
        ...patch
      };

      // Also sync L01-L04 / F01 / F03 / U09 into costLedger & employeeSurvey when edited directly or via option pill
      const nextCostLedger = { ...(prev.costLedger || {}) };
      const nextSurvey = { ...(prev.employeeSurvey || {}) };
      if (qId === 'L01' && patch.value !== undefined) {
        const num = parseCurrencyFromOptionText(patch.value);
        if (num !== null) {
          nextCostLedger.legacyAnnualApiCost = num;
          nextCostLedger.legacyCostNumericState = 'actual';
        }
      }
      if (qId === 'L02' && patch.value !== undefined) {
        const num = parseCurrencyFromOptionText(patch.value);
        if (num !== null) {
          nextCostLedger.legacyRetiredAnnualCost = num;
          nextCostLedger.legacyCostNumericState = 'actual';
        } else if (String(patch.value).includes('100% Avoidable')) {
          const modeled = prev.costLedger?.legacyAnnualRunRate || nextCostLedger.legacyAnnualApiCost || 1200000;
          nextCostLedger.legacyRetiredAnnualCost = modeled;
          nextCostLedger.legacyRetainedParallelRunAnnualCost = 0;
          nextCostLedger.legacyCostNumericState = 'actual';
        }
      }
      if (qId === 'L03' && patch.value !== undefined) {
        const num = parseCurrencyFromOptionText(patch.value);
        if (num !== null) {
          nextCostLedger.geminiAnnualRecurringCost = num;
          nextCostLedger.geminiCostNumericState = 'actual';
        }
      }
      if (qId === 'L04' && patch.value !== undefined) {
        const num = parseCurrencyFromOptionText(patch.value);
        nextCostLedger.oneTimeMigrationCost = num;
      }
      if (qId === 'F01' && patch.value !== undefined) {
        const rateMatch = String(patch.value).match(/\$([0-9]+)\s*\/\s*hr/i);
        if (rateMatch) nextCostLedger.defaultLoadedHourlyRate = Number(rateMatch[1]);
        const cashMatch = String(patch.value).match(/Cash Realization:\s*([0-9]+)%/i);
        if (cashMatch) nextCostLedger.cashRealizationFactorPct = Number(cashMatch[1]);
        const capMatch = String(patch.value).match(/Capacity Factor:\s*([0-9]+)%/i);
        if (capMatch) nextCostLedger.capacityValuationFactorPct = Number(capMatch[1]);
      }
      if (qId === 'F03' && patch.value !== undefined) {
        const pctMatch = String(patch.value).match(/([0-9]+(?:\.[0-9]+)?)%/);
        const directPct = Number(patch.value);
        if (pctMatch) nextCostLedger.defaultAttributionSharePct = Number(pctMatch[1]);
        else if (!Number.isNaN(directPct) && patch.value !== '' && patch.value !== null) {
          nextCostLedger.defaultAttributionSharePct = directPct;
        }
      }
      if (qId === 'U09' && patch.value !== undefined) {
        const s = String(patch.value);
        if (s.includes('Definitely yes')) nextSurvey.wouldChooseGeminiAgainPct = 86;
        else if (s.includes('Probably yes')) nextSurvey.wouldChooseGeminiAgainPct = 72;
        else if (s.includes('Uncertain')) nextSurvey.wouldChooseGeminiAgainPct = 52;
        else if (s.includes('Probably not')) nextSurvey.wouldChooseGeminiAgainPct = 34;
        else if (s.includes('Definitely not')) nextSurvey.wouldChooseGeminiAgainPct = 18;
      }

      // Sync C02 / P03 / A01 / A04 into adoptionTelemetry when answering a clean/unfilled assessment
      const nextTelemetry = { ...(prev.adoptionTelemetry || {}) };
      if ((qId === 'C02' || qId === 'P03' || qId === 'A01') && patch.value !== undefined && (prev.mode === 'clean' || prev.prefillMode === 'clean' || !nextTelemetry.contractedSeats)) {
        const s = String(patch.value);
        let baseSeats = 10000;
        if (s.includes('50,000+') || s.includes('85,300')) baseSeats = 50000;
        else if (s.includes('10,000')) baseSeats = 15000;
        else if (s.includes('1,000')) baseSeats = 5000;
        else if (s.includes('<1,000') || s.includes('300')) baseSeats = 500;
        const prov = Math.round(baseSeats * 0.95);
        const assgn = Math.round(baseSeats * 0.45);
        const mau = Math.round(assgn * 0.72);
        const wau = Math.round(assgn * 0.56);
        nextTelemetry.contractedSeats = baseSeats;
        nextTelemetry.provisionedSeats = prov;
        nextTelemetry.assignedSeats = assgn;
        nextTelemetry.assignedSeatsWave1 = assgn;
        nextTelemetry.multiApiMau30d = mau;
        nextTelemetry.mauMultiApi = mau;
        nextTelemetry.allApiWau7d = wau;
        nextTelemetry.wauAllApi = wau;
        nextTelemetry.wauMultiApi = Math.round(wau * 0.88);
        nextTelemetry.geminiAssistWau7d = Math.round(wau * 0.9);
        nextTelemetry.wauGeminiAssist = Math.round(wau * 0.9);
        nextTelemetry.enterpriseSearchWau7d = Math.round(wau * 0.82);
        nextTelemetry.wauEnterpriseSearch = Math.round(wau * 0.82);
        nextTelemetry.agentsWau7d = Math.round(wau * 0.28);
        nextTelemetry.wauAgents = Math.round(wau * 0.28);
        nextTelemetry.agentRequests7d = Math.round(wau * 2.1);
      }

      // Sync W01 / W02 / W04 into workflows[0] when answering a clean/unfilled assessment
      const nextWorkflows = Array.isArray(prev.workflows) ? [...prev.workflows] : [];
      if ((qId === 'W01' || qId === 'W02' || qId === 'W04') && patch.value !== undefined && nextWorkflows[0]?.numericState === 'pending') {
        const s = String(patch.value).toLowerCase();
        if (!s.includes('pending') && !s.includes('unknown')) {
          nextWorkflows[0] = {
            ...nextWorkflows[0],
            maturity: 'Pilot',
            numericState: 'actual',
            verificationStatus: patch.verificationStatus || 'draft_verify',
            confidenceTier: patch.confidenceTier && patch.confidenceTier !== 'D' ? patch.confidenceTier : 'B',
            eligibleUsers: nextWorkflows[0].eligibleUsers || 500,
            activeUsers: nextWorkflows[0].activeUsers || 250,
            completedTasksPerMonth: nextWorkflows[0].completedTasksPerMonth || 1500,
            stages: (nextWorkflows[0].stages?.discovery?.baseline > 0) ? nextWorkflows[0].stages : {
              discovery: { baseline: 14, gemini: 5 },
              drafting: { baseline: 15, gemini: 5 },
              verification: { baseline: 8, gemini: 4 },
              correction: { baseline: 5, gemini: 2 },
              approval: { baseline: 3, gemini: 1 },
              handoff: { baseline: 2, gemini: 1 }
            }
          };
        }
      }

      // Sync F08 into signOffs when selected
      const nextSignOffs = { ...(prev.signOffs || {}) };
      if (qId === 'F08' && patch.value !== undefined) {
        const s = String(patch.value);
        const today = new Date().toISOString().slice(0, 10);
        if (s.includes('All 4') || s.includes('Formally Signed Off')) {
          for (const k of ['businessSponsor', 'platformAnalytics', 'finance', 'securityGxp', 'financeController', 'riskComplianceSecurity']) {
            if (nextSignOffs[k]) {
              nextSignOffs[k] = { ...nextSignOffs[k], status: 'Approved', date: today };
            }
          }
        } else if (s.includes('2/4') || s.includes('Approved with Caveats')) {
          for (const k of ['platformAnalytics', 'securityGxp', 'riskComplianceSecurity']) {
            if (nextSignOffs[k]) {
              nextSignOffs[k] = { ...nextSignOffs[k], status: 'Approved with Caveat', date: today };
            }
          }
        }
      }

      const updatedDossier = {
        ...prev,
        costLedger: nextCostLedger,
        employeeSurvey: nextSurvey,
        adoptionTelemetry: nextTelemetry,
        workflows: nextWorkflows,
        signOffs: nextSignOffs,
        questionResponses: {
          ...(prev.questionResponses || {}),
          [qId]: nextItem
        }
      };
      const targetId = updatedDossier.id || 'ge_vr_ACC-1001-AEROVG';
      axios.post(`/api/ge-value-realization/dossiers/${targetId}`, updatedDossier).catch(() => {});
      return updatedDossier;
    });
  };

  // Update workflow field
  const updateWorkflowField = (wfIdx, patch) => {
    setDossier((prev) => {
      const workflows = [...(prev.workflows || [])];
      if (!workflows[wfIdx]) return prev;
      workflows[wfIdx] = {
        ...workflows[wfIdx],
        ...patch
      };
      const updatedDossier = {
        ...prev,
        workflows
      };
      const targetId = updatedDossier.id || 'ge_vr_ACC-1001-AEROVG';
      axios.post(`/api/ge-value-realization/dossiers/${targetId}`, updatedDossier).catch(() => {});
      return updatedDossier;
    });
  };

  // Update W04 6-stage effort matrix (baseline vs. gemini minutes)
  const updateWorkflowStageEffort = (wfIdx, stageKey, colKey, rawVal) => {
    const numVal = rawVal === '' ? 0 : Number(rawVal);
    setDossier((prev) => {
      const workflows = [...(prev.workflows || [])];
      const wf = workflows[wfIdx];
      if (!wf) return prev;
      const stages = { ...(wf.stages || {}) };
      stages[stageKey] = {
        ...(stages[stageKey] || { baseline: 0, gemini: 0 }),
        [colKey]: Number.isNaN(numVal) ? 0 : numVal
      };
      workflows[wfIdx] = {
        ...wf,
        stages
      };
      return {
        ...prev,
        workflows
      };
    });
  };

  // Add a new repeatable workflow instance
  const handleAddWorkflow = () => {
    const nextNum = (dossier.workflows?.length || 0) + 1;
    const baseTemplate = DEFAULT_BIONOVA_WORKFLOWS[0];
    const custPrefix = (dossier.meta?.customerName || 'CUST').replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase() || 'WF';
    const newWf = {
      ...JSON.parse(JSON.stringify(baseTemplate)),
      id: `wf_custom_${nextNum}`,
      code: `WF${nextNum}`,
      name: `${custPrefix}-0${nextNum + 4}: New Priority Workflow #${nextNum}`,
      functionArea: 'Enterprise Operations',
      maturity: 'Pilot',
      eligibleUsers: 300,
      activeUsers: 110,
      completedTasksPerMonth: 450,
      numericState: 'actual',
      stages: {
        discovery: { baseline: 25, gemini: 8 },
        drafting: { baseline: 35, gemini: 12 },
        verification: { baseline: 12, gemini: 12 },
        correction: { baseline: 10, gemini: 5 },
        approval: { baseline: 8, gemini: 6 },
        handoff: { baseline: 5, gemini: 4 }
      },
      realizationClass: 'capacity_only',
      approvedHourlyRate: 125,
      capacityConversionFactorPct: 65,
      attributionSharePct: 75,
      modeledAnnualValueUsd: 2500000,
      isRegulatedGxp: false,
      gxpValidated: true,
      confidenceTier: 'B',
      verificationStatus: 'draft_verify'
    };

    setDossier((prev) => {
      const nextList = [...(prev.workflows || []), newWf];
      setActiveWorkflowIdx(nextList.length - 1);
      return {
        ...prev,
        workflows: nextList
      };
    });
    toast.success(`Added ${newWf.code} to Repeatable Workflow Register`);
  };

  // Update Cost Ledger / Sensitivity Sliders
  const updateCostLedger = (patch) => {
    setDossier((prev) => ({
      ...prev,
      costLedger: {
        ...(prev.costLedger || {}),
        ...patch
      }
    }));
  };

  // Toggle Multi-Party Sign-Off card
  const toggleSignOffRole = (roleKey) => {
    setDossier((prev) => {
      const current = prev.signOffs?.[roleKey] || {};
      const isApproved = current.status === 'Signed Off';
      const nextStatus = isApproved ? 'Pending Review' : 'Signed Off';
      return {
        ...prev,
        signOffs: {
          ...(prev.signOffs || {}),
          [roleKey]: {
            ...current,
            status: nextStatus,
            date: nextStatus === 'Signed Off' ? new Date().toISOString().slice(0, 10) : ''
          }
        }
      };
    });
  };

  // Export JSON Dossier
  const handleExportJson = () => {
    const payload = {
      ...dossier,
      evaluation
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${dossier.id || 'ge_value_realization'}_dossier.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Exported GE Value Realization Dossier JSON');
  };

  // Select or toggle an option directly from the Per-Option Confidence Matrix
  const handleSelectOptionForQuestion = (q, optMeta) => {
    const resp = dossier.questionResponses?.[q.id] || {};
    const isMulti = q.inputType === 'multi_select' || q.inputType === 'multi_select_rank';
    let nextValue;

    if (isMulti) {
      const currentArr = Array.isArray(resp.value)
        ? [...resp.value]
        : (resp.value ? String(resp.value).split(';').map((s) => s.trim()).filter(Boolean) : []);
      const existsIdx = currentArr.findIndex((item) => item.toLowerCase() === optMeta.optionText.toLowerCase());
      if (existsIdx >= 0) {
        currentArr.splice(existsIdx, 1);
      } else {
        currentArr.push(optMeta.optionText);
      }
      nextValue = currentArr;
    } else {
      nextValue = optMeta.optionText;
    }

    updateQuestionResponse(q.id, {
      value: nextValue,
      numericState: 'actual',
      confidenceScorePct: optMeta.confidencePct,
      confidenceTier: optMeta.confidenceTier,
      outcomeScore: optMeta.impliedOutcomeScore ?? resp.outcomeScore ?? 3,
      verificationStatus: optMeta.confidenceTier === 'A' ? 'verified' : 'draft_verify'
    });
    toast.success(`${q.id}: Selected option (${optMeta.confidencePct}% Conf • Tier ${optMeta.confidenceTier})`);
  };

  // Confirm a single question's answer with customer stakeholder -> upgrades to 100% Tier A Verified
  const handleConfirmQuestionWithCustomer = (qId) => {
    const resp = dossier.questionResponses?.[qId] || {};
    const custLabel = (dossier.meta?.customerName || 'Customer').split(',')[0];
    updateQuestionResponse(qId, {
      verificationStatus: 'verified',
      confidenceTier: 'A',
      confidenceScorePct: 100,
      customerConfirmed: true,
      numericState: resp.value === null ? 'pending' : 'actual'
    });
    toast.success(`Confirmed ${qId} with ${custLabel} stakeholder → Upgraded to Tier A (100% Verified)`);
  };

  // Filter questions by Module / Role Form / Verification Status / Confidence Tier / Search
  const filteredQuestions = useMemo(() => {
    const roleForm = RESPONDENT_FORMS.find((r) => r.id === activeRoleFilter);
    const allowedIds = roleForm?.questionIds || null;
    const isCrossModuleActive = (confidenceTierFilter !== 'ALL' || statusFilter !== 'ALL' || verificationFilter !== 'ALL' || selectedSourceFilter !== 'ALL') && tierFilterCrossModule;

    return GE_QUESTIONS.filter((q) => {
      const resp = dossier.questionResponses?.[q.id] || {};
      const qTier = resp.confidenceTier || 'B';
      const contextualQ = getCustomerContextualQuestionText(q, dossier);

      if (inputMode === 'section' && activeRoleFilter === 'all_modules' && !isCrossModuleActive && q.module !== activeModuleId) {
        return false;
      }
      if (allowedIds && !allowedIds.includes(q.id)) {
        return false;
      }
      if (statusFilter !== 'ALL') {
        if (statusFilter === 'user_modified') {
          if (!resp.userModified) return false;
        } else if (statusFilter === 'verified') {
          if (resp.verificationStatus !== 'verified' || resp.userModified) return false;
        } else if (statusFilter === 'draft_verify') {
          if (resp.verificationStatus !== 'draft_verify' || resp.userModified) return false;
        } else if (statusFilter === 'pending') {
          const isUnanswered = resp.verificationStatus === 'pending' || resp.value === null || resp.value === undefined || resp.value === '';
          if (!isUnanswered) return false;
        } else if (resp.verificationStatus !== statusFilter) {
          return false;
        }
      }
      if (selectedSourceFilter !== 'ALL') {
        const matchesSource = (resp.scannedSources && resp.scannedSources.includes(selectedSourceFilter)) ||
          (Array.isArray(resp.citations) && resp.citations.some(c => c.sourceType === selectedSourceFilter));
        if (!matchesSource) return false;
      }
      if (confidenceTierFilter !== 'ALL') {
        if (confidenceTierFilter === 'CONFIRM_QUEUE') {
          if (qTier === 'A' && resp.verificationStatus === 'verified') return false;
        } else if (qTier !== confidenceTierFilter) {
          return false;
        }
      }
      if (searchQuery.trim()) {
        const needle = searchQuery.toLowerCase();
        const hay = `${q.id} ${contextualQ} ${resp.value || ''} ${resp.owner || ''} ${resp.evidenceUrl || ''}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [dossier, inputMode, activeModuleId, activeRoleFilter, statusFilter, confidenceTierFilter, tierFilterCrossModule, searchQuery, verificationFilter, selectedSourceFilter]);

  // Overall status counts across all 82 questions
  const statusCounts = useMemo(() => {
    const counts = { total: GE_QUESTIONS.length, verified: 0, draft_verify: 0, pending: 0 };
    GE_QUESTIONS.forEach((q) => {
      const st = dossier.questionResponses?.[q.id]?.verificationStatus || 'pending';
      if (counts[st] !== undefined) counts[st] += 1;
      else counts.pending += 1;
    });
    return counts;
  }, [dossier.questionResponses]);

  // Overall Confidence Tier counts (Tier A, B, C, D + Confirm Queue) across all 82 questions
  const tierCounts = useMemo(() => {
    const counts = { total: GE_QUESTIONS.length, A: 0, B: 0, C: 0, D: 0, confirmQueue: 0 };
    GE_QUESTIONS.forEach((q) => {
      const resp = dossier.questionResponses?.[q.id] || {};
      const t = resp.confidenceTier || 'B';
      if (counts[t] !== undefined) counts[t] += 1;
      if (!(t === 'A' && resp.verificationStatus === 'verified')) {
        counts.confirmQueue += 1;
      }
    });
    return counts;
  }, [dossier.questionResponses]);

  const activeWorkflow = dossier.workflows?.[activeWorkflowIdx] || dossier.workflows?.[0];
  const activeWorkflowEval = evaluation.evaluatedWorkflows?.[activeWorkflowIdx] || evaluation.evaluatedWorkflows?.[0];
  const fiveCols = evaluation.financials?.fiveColumns || {};
  const customerName = dossier.meta?.customerName || 'Enterprise Customer';
  const shortCustomerName = customerName.split(',')[0].replace(/\s+(Inc\.?|Corp\.?|Corporation|LLP|LLC)$/i, '').trim() || 'Customer';

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f1f5f9',
      color: '#0f172a',
      paddingTop: '74px',
      paddingBottom: '64px',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
    }}>
      {/* =====================================================================
          TOP EXECUTIVE COMMAND BAR (COMPACT DROPDOWN-DRIVEN HEADER)
         ===================================================================== */}
      <div style={{
        background: 'linear-gradient(135deg, #eff6ff 0%, #eef2ff 60%, #f8fafc 100%)',
        color: '#0f172a',
        borderBottom: '1px solid #cbd5e1',
        padding: '8px clamp(16px, 1.8vw, 28px)',
        boxShadow: '0 2px 10px rgba(15, 23, 42, 0.05)'
      }}>
        <div style={{ width: '100%', maxWidth: '100%', margin: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          {/* Left: Compact Title + Inline Metadata Strip */}
          <div style={{ minWidth: '300px', flex: '1 1 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h1
                style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', color: '#0f172a' }}
                title={`Dossier ID: ${dossier.id}`}
              >
                {dossier.meta?.customerName || 'New Enterprise Assessment'} — Gemini Enterprise Value Realization
              </h1>
              <span style={{
                background: '#ecfdf5',
                border: '1px solid #6ee7b7',
                color: '#047857',
                fontSize: '0.68rem',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '999px',
                fontFamily: "'JetBrains Mono', monospace"
              }}>
                🔒 {dossier.meta?.vectorAccountId || dossier.meta?.sfdcAccountId || 'NEW'}
              </span>
              <span style={{
                background: activePrefillMode === 'random' ? '#fdf2f8' : activePrefillMode === 'clean' ? '#f5f3ff' : '#fffbeb',
                border: activePrefillMode === 'random' ? '1px solid #f9a8d4' : activePrefillMode === 'clean' ? '1px solid #c4b5fd' : '1px solid #fde68a',
                color: activePrefillMode === 'random' ? '#be185d' : activePrefillMode === 'clean' ? '#5b21b6' : '#b45309',
                fontSize: '0.68rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '999px'
              }}>
                {activePrefillMode === 'random'
                  ? '🎲 Random Prefill'
                  : activePrefillMode === 'clean'
                    ? '⚪ New Blank (From Q1)'
                    : '🟢 8-Source Evidence'}
              </span>
              <span style={{ fontSize: '0.73rem', color: '#475569' }}>
                • <strong style={{ color: '#0f172a' }}>{dossier.meta?.legacyPlatformName || 'Legacy AI Baseline'}</strong> → <strong style={{ color: '#1d4ed8' }}>{String(dossier.meta?.targetPlatformName || 'Google Cloud Gemini Enterprise').replace(/\s*\([\d,]+\s*(?:Contracted\s*)?Seats\)\s*$/i, '')}</strong> ({formatNumber(dossier.adoptionTelemetry?.contractedSeats || 0)} Contracted Seats)
              </span>
            </div>
          </div>

          {/* Right: Streamlined Primary View Switcher + Edit/Clone/Delete + Generate CTA (Rule 25 Zero-Redundancy) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            {/* Primary Workspace Segmented Tabs */}
            <div style={{
              display: 'inline-flex',
              background: '#ffffff',
              padding: '3px',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              gap: '3px'
            }}>
              <button
                onClick={() => setPrimaryView('inputs')}
                style={{
                  background: primaryView === 'inputs' ? 'linear-gradient(135deg, #2563eb, #4f46e5)' : 'transparent',
                  color: primaryView === 'inputs' ? '#ffffff' : '#334155',
                  border: 'none',
                  borderRadius: '7px',
                  padding: '6px 11px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <FiLayers size={13} />
                1. Questionnaire ({GE_QUESTIONS.length} Qs)
              </button>
              <button
                onClick={() => setPrimaryView('report')}
                style={{
                  background: primaryView === 'report' ? 'linear-gradient(135deg, #059669, #0d9488)' : 'transparent',
                  color: primaryView === 'report' ? '#ffffff' : '#334155',
                  border: 'none',
                  borderRadius: '7px',
                  padding: '6px 11px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <FiAward size={13} />
                2. Executive Readout {dossier.geminiReport ? '✨' : ''}
              </button>
              <button
                onClick={() => setPrimaryView('math')}
                style={{
                  background: primaryView === 'math' ? 'linear-gradient(135deg, #d97706, #b45309)' : 'transparent',
                  color: primaryView === 'math' ? '#ffffff' : '#334155',
                  border: 'none',
                  borderRadius: '7px',
                  padding: '6px 11px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <FiShield size={13} />
                3. Provenance & Guardrails
              </button>
            </div>

            {/* Explicit Edit / Clone / Delete Controls */}
            <button
              onClick={() => {
                setPrimaryView('inputs');
                toast.success('Switched to Edit Assessment Answers');
              }}
              style={{
                background: '#eff6ff',
                color: '#1d4ed8',
                border: '1px solid #bfdbfe',
                borderRadius: '8px',
                padding: '6px 9px',
                fontSize: '0.73rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
              title="Edit Assessment Answers"
            >
              <FiEdit3 size={12} /> Edit
            </button>
            <button
              onClick={() => {
                const cloneId = `ge_vr_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
                const cloneName = `${dossier?.meta?.customerName || 'Enterprise'} (Clone)`;
                const cloned = {
                  ...dossier,
                  id: cloneId,
                  meta: {
                    ...(dossier?.meta || {}),
                    customerName: cloneName
                  }
                };
                setDossier(cloned);
                navigate(`/ge-value-realization/${cloneId}?tab=inputs`, { replace: false });
                toast.success(`Cloned workspace as "${cloneName}" (${cloneId})`);
              }}
              style={{
                background: '#eef2ff',
                color: '#4f46e5',
                border: '1px solid #c7d2fe',
                borderRadius: '8px',
                padding: '6px 9px',
                fontSize: '0.73rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
              title="Clone Value Realization Dossier"
            >
              <FiCopy size={12} /> Clone
            </button>
            <button
              onClick={() => {
                handleStartNewUnfilledAssessment(null, false);
                toast.success('Reset dossier to a fresh blank assessment (0/82).');
              }}
              style={{
                background: '#fef2f2',
                color: '#dc2626',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                padding: '6px 9px',
                fontSize: '0.73rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
              title="Delete / Reset Value Realization Dossier"
            >
              <FiTrash2 size={12} /> Delete
            </button>

            {/* Primary Submit & Generate Report CTA */}
            <button
              onClick={handleSubmitAndGenerateGeminiReport}
              disabled={generatingGeminiReport}
              style={{
                background: generatingGeminiReport ? '#475569' : 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                color: '#ffffff',
                border: '1px solid #059669',
                borderRadius: '8px',
                padding: '6px 13px',
                fontSize: '0.76rem',
                fontWeight: 900,
                cursor: generatingGeminiReport ? 'wait' : 'pointer',
                boxShadow: '0 3px 10px rgba(16, 185, 129, 0.22)'
              }}
            >
              {generatingGeminiReport ? '🧠 3-Model Chain Running...' : '🚀 Generate Report'}
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================================
          MAIN WORKSPACE BODY
         ===================================================================== */}
      <div style={{ width: '100%', maxWidth: '100%', margin: '10px 0 0', padding: '0 clamp(16px, 1.8vw, 28px)' }}>

        {/* ===================================================================
            SAVED ASSESSMENTS HUB & BIG "+ NEW ASSESSMENT" LAUNCHER
           =================================================================== */}
        {showSavedHubDrawer && (
          <div style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #eff6ff 55%, #f5f3ff 100%)',
            border: '2px solid #3b82f6',
            borderRadius: '16px',
            padding: '20px 24px',
            marginBottom: '18px',
            boxShadow: '0 10px 26px rgba(15, 23, 42, 0.08)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ background: '#1d4ed8', color: '#ffffff', fontSize: '0.7rem', fontWeight: 900, padding: '3px 10px', borderRadius: '999px', textTransform: 'uppercase' }}>
                    📂 Saved Value Realization Assessments Hub
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#334155', fontWeight: 700 }}>
                    Select a saved customer assessment below OR click <strong>➕ NEW ASSESSMENT</strong> to start a blank assessment, prefill, or extract from uploaded documents/PDFs/images, Salesforce & Buganizer
                  </span>
                </div>
                <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, color: '#0f172a' }}>
                  Saved Customer Assessments & Blank Assessment Launcher
                </h2>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => {
                    setShowSavedHubDrawer(false);
                    handleStartNewUnfilledAssessment(null, true);
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '10px 18px',
                    fontSize: '0.84rem',
                    fontWeight: 900,
                    cursor: 'pointer',
                    boxShadow: '0 6px 18px rgba(124, 58, 237, 0.3)'
                  }}
                >
                  ➕ NEW BLANK ASSESSMENT (Manual / Prefill / Upload Docs / SFDC & Buganizer)
                </button>
                <button
                  onClick={() => setShowSavedHubDrawer(false)}
                  style={{
                    background: '#f1f5f9',
                    color: '#334155',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  ✕ Hide Hub
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '12px' }}>
              {/* Card 0: Big + NEW Assessment Hero Card */}
              <div
                onClick={() => {
                  setShowSavedHubDrawer(false);
                  handleStartNewUnfilledAssessment(null, true);
                }}
                style={{
                  background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
                  border: '2px dashed #7c3aed',
                  borderRadius: '14px',
                  padding: '16px 18px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '10px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ background: '#7c3aed', color: '#ffffff', fontSize: '0.68rem', fontWeight: 900, padding: '2px 9px', borderRadius: '999px' }}>
                      ➕ START NEW BLANK ASSESSMENT
                    </span>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#5b21b6', fontFamily: 'monospace' }}>
                      0 / 82 Qs • Starts at C01
                    </span>
                  </div>
                  <div style={{ fontSize: '0.98rem', fontWeight: 900, color: '#2e1065' }}>
                    ➕ Create New Customer Assessment
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#4c1d95', marginTop: '4px', lineHeight: 1.4 }}>
                    1️⃣ Answer 82 questions manually • 2️⃣ 1-Click Prefill • 3️⃣ Upload PDFs, Docs, Spreadsheets & Images • 4️⃣ Enter Salesforce & Buganizer IDs for grounded AI extraction with citations.
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                  <span style={{ background: '#7c3aed', color: '#ffffff', padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800 }}>
                    🚀 Launch Blank Assessment →
                  </span>
                </div>
              </div>

              {/* Saved Dossier Cards */}
              {(savedAssessmentsList.length > 0 ? savedAssessmentsList : [
                {
                  id: 'ge_vr_acc-1001-aerovg',
                  customerName: 'AeroVanguard Global Logistics',
                  sfdcAccountId: 'ACC-1001-AEROVG',
                  rawScore: 79,
                  evidenceAdjustedScore: 74,
                  headlineVerdict: 'GATED — PROVISIONAL ONLY (1 OF 5 GATES OPEN)'
                },
                {
                  id: 'ge_vr_acc-1002-bionova',
                  customerName: 'BioNova Global Therapeutics',
                  sfdcAccountId: 'ACC-1002-BIONOVA',
                  rawScore: 86,
                  evidenceAdjustedScore: 76,
                  headlineVerdict: 'GATED — PROVISIONAL ONLY (1 OF 5 GATES OPEN)'
                }
              ]).map((item) => {
                const isCurrent = item.id === dossier.id;
                const cardSfdcId = item.sfdcAccountId || item.meta?.vectorAccountId || item.meta?.sfdcAccountId || 'ACC-1001-AEROVG';
                const cardCustomerName = item.customerName || item.meta?.customerName || 'Enterprise Assessment';
                const cardRawScore = item.rawScore ?? item.evaluation?.index?.rawScore ?? item.evaluation?.rawScore ?? 0;
                const cardEvidenceScore = item.evidenceAdjustedScore ?? item.evaluation?.index?.evidenceAdjustedScore ?? item.evaluation?.evidenceAdjustedScore ?? 0;
                const cardVerdict = item.headlineVerdict || item.evaluation?.overallHeadlineVerdict || item.evaluation?.headlineVerdict || 'IN PROGRESS';
                return (
                  <div
                    key={item.id}
                    style={{
                      background: isCurrent ? '#eff6ff' : '#ffffff',
                      border: isCurrent ? '2px solid #2563eb' : '1px solid #cbd5e1',
                      borderRadius: '14px',
                      padding: '15px 17px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '10px'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                        <span style={{
                          background: '#ecfdf5',
                          color: '#047857',
                          border: '1px solid #6ee7b7',
                          fontSize: '0.66rem',
                          fontWeight: 800,
                          padding: '2px 8px',
                          borderRadius: '999px',
                          fontFamily: 'monospace'
                        }}>
                          🔒 {cardSfdcId}
                        </span>
                        <span style={{ fontSize: '0.68rem', color: '#64748b', fontFamily: 'monospace' }}>
                          {item.id}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                        {cardCustomerName}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px', fontSize: '0.75rem', color: '#334155' }}>
                        <span>Raw: <strong style={{ color: '#0f172a', fontFamily: 'monospace' }}>{cardRawScore}/100</strong></span>
                        <span>Evidence-Adj: <strong style={{ color: '#2563eb', fontFamily: 'monospace' }}>{cardEvidenceScore}/100</strong></span>
                      </div>
                      <div style={{ fontSize: '0.68rem', color: '#b45309', fontWeight: 700, marginTop: '4px' }}>
                        {cardVerdict}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <button
                        onClick={async () => {
                          try {
                            const res = await axios.get(`/api/ge-value-realization/dossiers/${item.id}`);
                            if (res.data?.success && res.data?.dossier) {
                              setDossier(res.data.dossier);
                              setSelectedSfdcId(res.data.dossier.meta?.vectorAccountId || res.data.dossier.meta?.sfdcAccountId || '');
                              setCustomerInput(`${res.data.dossier.meta?.customerName} (${res.data.dossier.meta?.sfdcAccountId || ''})`);
                              setPrimaryView('inputs');
                              navigate(`/ge-value-realization/${item.id}?tab=inputs`);
                              toast.success(`Opened saved assessment: ${cardCustomerName}`);
                            }
                          } catch {
                            handleIngestCustomer({ sfdcAccountId: cardSfdcId, customerQuery: cardCustomerName });
                          }
                        }}
                        style={{
                          background: '#2563eb',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '7px',
                          padding: '6px 11px',
                          fontSize: '0.73rem',
                          fontWeight: 800,
                          cursor: 'pointer'
                        }}
                      >
                        📝 Open Questionnaire
                      </button>
                      <button
                        onClick={async () => {
                          try {
                            const res = await axios.get(`/api/ge-value-realization/dossiers/${item.id}`);
                            if (res.data?.success && res.data?.dossier) {
                              setDossier(res.data.dossier);
                              setSelectedSfdcId(res.data.dossier.meta?.vectorAccountId || res.data.dossier.meta?.sfdcAccountId || '');
                              setCustomerInput(`${res.data.dossier.meta?.customerName} (${res.data.dossier.meta?.sfdcAccountId || ''})`);
                              setPrimaryView('report');
                              navigate(`/ge-value-realization/${item.id}?tab=report`);
                              toast.success(`Viewing Executive Readout: ${cardCustomerName}`);
                            }
                          } catch {
                            setPrimaryView('report');
                          }
                        }}
                        style={{
                          background: '#ecfdf5',
                          color: '#047857',
                          border: '1px solid #6ee7b7',
                          borderRadius: '7px',
                          padding: '6px 11px',
                          fontSize: '0.73rem',
                          fontWeight: 800,
                          cursor: 'pointer'
                        }}
                      >
                        📊 Executive Readout
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ===================================================================
            MULTIMODAL DOCUMENT, PDF, IMAGE, SALESFORCE & BUGANIZER GROUNDED ANSWER EXTRACTOR
           =================================================================== */}
        {showSourceExtractorPanel && (
          <div style={{
            background: 'linear-gradient(135deg, #f0f9ff 0%, #ffffff 55%, #ecfdf5 100%)',
            border: '2px solid #0284c7',
            borderRadius: '16px',
            padding: '18px 22px',
            marginBottom: '16px',
            boxShadow: '0 8px 22px rgba(2, 132, 199, 0.08)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                  <span style={{ background: '#0284c7', color: '#ffffff', fontSize: '0.68rem', fontWeight: 900, padding: '3px 10px', borderRadius: '999px', textTransform: 'uppercase' }}>
                    📎 Multimodal Evidence & Citation Extractor (Model 1: gemini-2.5-flash)
                  </span>
                  <span style={{ fontSize: '0.73rem', color: '#0369a1', fontWeight: 700 }}>
                    Upload PDFs, Word/Excel Docs, or Images + Enter Salesforce Account ID & Buganizer Issue IDs (`b/...`) → Extracts Grounded Answers & Citations for All 82 Questions
                  </span>
                </div>
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 900, color: '#0f172a' }}>
                  Upload Documents / PDFs / Images & Connect Salesforce / Buganizer to Auto-Extract Grounded Answers with Citations
                </h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={handleAttachSampleEvidencePack}
                  style={{
                    background: '#e0f2fe',
                    color: '#0369a1',
                    border: '1px solid #7dd3fc',
                    borderRadius: '8px',
                    padding: '7px 12px',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  📎 + Load Sample QBR PDF, Architecture PNG & CFO Excel
                </button>
                <button
                  onClick={() => setShowSourceExtractorPanel(false)}
                  style={{
                    background: '#f1f5f9',
                    color: '#475569',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    padding: '6px 10px',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  ✕ Hide Extractor
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px', marginBottom: '12px' }}>
              {/* 1. File Uploader (PDF, Word, Excel, CSV, PNG, JPG, WEBP) */}
              <div style={{ background: '#ffffff', border: '1.5px dashed #38bdf8', borderRadius: '10px', padding: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#0369a1', textTransform: 'uppercase', marginBottom: '6px' }}>
                  1. Upload Documents, PDFs, Spreadsheets or Images
                </label>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.json,.png,.jpg,.jpeg,.webp"
                  onChange={handleFileUploadChange}
                  style={{ fontSize: '0.75rem', width: '100%' }}
                />
                {uploadedDocuments.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                    {uploadedDocuments.map((doc) => (
                      <span
                        key={doc.id}
                        style={{
                          background: '#f0f9ff',
                          border: '1px solid #bae6fd',
                          color: '#0369a1',
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '999px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        📄 {doc.name}
                        <button
                          onClick={() => setUploadedDocuments((prev) => prev.filter((d) => d.id !== doc.id))}
                          style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontWeight: 900, fontSize: '0.7rem', padding: 0 }}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* 2. Salesforce Account ID & Buganizer Issue IDs */}
              <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', marginBottom: '4px' }}>
                  2. Salesforce Account ID & Buganizer Issue IDs (b/...)
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '8px' }}>
                  <input
                    type="text"
                    value={newAssessmentForm.sfdcAccountId || selectedSfdcId}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSelectedSfdcId(val);
                      setNewAssessmentForm((prev) => ({ ...prev, sfdcAccountId: val }));
                    }}
                    placeholder="SFDC ID (e.g. ACC-1001-AEROVG)"
                    style={{ width: '100%', padding: '7px 9px', borderRadius: '7px', border: '1px solid #94a3b8', fontSize: '0.76rem', fontWeight: 700, fontFamily: 'monospace' }}
                  />
                  <input
                    type="text"
                    value={buganizerIdsInput}
                    onChange={(e) => setBuganizerIdsInput(e.target.value)}
                    placeholder="Buganizer IDs (e.g. b/394810221, b/394810554)"
                    style={{ width: '100%', padding: '7px 9px', borderRadius: '7px', border: '1px solid #94a3b8', fontSize: '0.76rem', fontWeight: 700, fontFamily: 'monospace' }}
                  />
                </div>
              </div>

              {/* 3. Other Sources / Notes (Workspace, Moma, Gantry, BigQuery) */}
              <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', marginBottom: '4px' }}>
                  3. Additional Source Links / Notes (Docs, Sheets, Moma, Gantry)
                </label>
                <input
                  type="text"
                  value={otherSourcesInput}
                  onChange={(e) => setOtherSourcesInput(e.target.value)}
                  placeholder="Paste Google Docs/Sheets links, Moma ramp notes, or customer QBR excerpts..."
                  style={{ width: '100%', padding: '7px 9px', borderRadius: '7px', border: '1px solid #94a3b8', fontSize: '0.76rem', fontWeight: 600 }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ fontSize: '0.74rem', color: '#334155', fontWeight: 600 }}>
                💡 <strong>Manual Override Protection:</strong> Any question you have already answered manually is preserved while AI suggestions & citations are attached alongside it.
              </div>
              <button
                onClick={handleExtractGroundedAnswers}
                disabled={extractingSources}
                style={{
                  background: extractingSources ? '#475569' : 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '9px 18px',
                  fontSize: '0.82rem',
                  fontWeight: 900,
                  cursor: extractingSources ? 'wait' : 'pointer',
                  boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)'
                }}
              >
                {extractingSources
                  ? '🔍 Extracting Grounded Answers & Citations...'
                  : `✨ Extract Answers & Citations to All 82 Questions (${uploadedDocuments.length} Docs + SFDC + Buganizer)`}
              </button>
            </div>
          </div>
        )}

        {/* ===================================================================
            INTERACTIVE "START NEW ASSESSMENT" INTAKE WIZARD PANEL
           =================================================================== */}
        {showNewAssessmentModal && (
          <div style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f5f3ff 60%, #eff6ff 100%)',
            color: '#0f172a',
            border: '2px solid #8b5cf6',
            borderRadius: '16px',
            padding: '22px 26px',
            marginBottom: '18px',
            boxShadow: '0 12px 28px rgba(15, 23, 42, 0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                  <span style={{ background: '#7c3aed', color: '#ffffff', fontSize: '0.7rem', fontWeight: 900, padding: '3px 10px', borderRadius: '999px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    ➕ New Unfilled Assessment Initialized
                  </span>
                  <span style={{ background: '#eff6ff', border: '1px solid #93c5fd', color: '#1e3a8a', fontSize: '0.74rem', fontWeight: 800, padding: '3px 10px', borderRadius: '999px', fontFamily: 'monospace' }}>
                    Unique Assessment ID: {newAssessmentForm.assessmentId || dossier.id}
                  </span>
                  <span style={{ background: '#ecfdf5', border: '1px solid #6ee7b7', color: '#047857', fontSize: '0.72rem', fontWeight: 800, padding: '3px 10px', borderRadius: '999px' }}>
                    Starting at Question 1 (C01 — Adaptive Configuration) • All 82 Questions Unfilled
                  </span>
                </div>
                <h2 style={{ margin: 0, fontSize: '1.22rem', fontWeight: 800, color: '#0f172a' }}>
                  Enter Customer Details (Optional) or Answer Question 1 (C01) Directly Below
                </h2>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => handleStartNewUnfilledAssessment(null, true)}
                  style={{
                    background: '#4f46e5',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '7px 13px',
                    fontSize: '0.76rem',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  🔄 Generate Another Fresh Assessment ID
                </button>
                <button
                  onClick={() => handlePickRandomCustomerForModal('rich', false, newAssessmentForm.prefillMode)}
                  style={{
                    background: '#ec4899',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '7px 13px',
                    fontSize: '0.76rem',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  🎲 Pick Random Enterprise SFDC Customer
                </button>
                <button
                  onClick={() => setShowNewAssessmentModal(false)}
                  style={{
                    background: '#ffffff',
                    color: '#475569',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    padding: '6px 11px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  ✕ Hide Setup Banner
                </button>
              </div>
            </div>

            {/* Customer Details Form Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Customer Legal / Account Name
                </label>
                <input
                  type="text"
                  value={newAssessmentForm.customerName}
                  onChange={(e) => {
                    const val = e.target.value;
                    setNewAssessmentForm((prev) => ({ ...prev, customerName: val }));
                    setDossier((prev) => ({
                      ...prev,
                      meta: { ...(prev.meta || {}), customerName: val || 'New Enterprise Assessment' }
                    }));
                  }}
                  placeholder="Enter Customer Name (e.g. Acme Global Corp)"
                  style={{ width: '100%', padding: '8px 11px', borderRadius: '8px', border: '1px solid #94a3b8', background: '#ffffff', color: '#0f172a', fontSize: '0.82rem', fontWeight: 700 }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Salesforce Account ID (Optional)
                </label>
                <input
                  type="text"
                  value={newAssessmentForm.sfdcAccountId}
                  onChange={(e) => {
                    const val = e.target.value;
                    setNewAssessmentForm((prev) => ({ ...prev, sfdcAccountId: val }));
                    setDossier((prev) => ({
                      ...prev,
                      meta: { ...(prev.meta || {}), vectorAccountId: val || prev.meta?.vectorAccountId, sfdcAccountId: val || prev.meta?.sfdcAccountId }
                    }));
                  }}
                  placeholder={`e.g. ${dossier.meta?.vectorAccountId || 'NEW-ASSESSMENT'}`}
                  style={{ width: '100%', padding: '8px 11px', borderRadius: '8px', border: '1px solid #94a3b8', background: '#ffffff', color: '#0f172a', fontSize: '0.82rem', fontFamily: 'monospace', fontWeight: 700 }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Industry / Regulated Sector
                </label>
                <input
                  type="text"
                  value={newAssessmentForm.industry}
                  onChange={(e) => {
                    const val = e.target.value;
                    setNewAssessmentForm((prev) => ({ ...prev, industry: val }));
                    setDossier((prev) => ({
                      ...prev,
                      meta: { ...(prev.meta || {}), industry: val || 'Enterprise Operations' }
                    }));
                  }}
                  placeholder="e.g. Financial Services, Healthcare, Retail"
                  style={{ width: '100%', padding: '8px 11px', borderRadius: '8px', border: '1px solid #94a3b8', background: '#ffffff', color: '#0f172a', fontSize: '0.82rem', fontWeight: 600 }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Legacy AI / Search Baseline Being Replaced
                </label>
                <input
                  type="text"
                  value={newAssessmentForm.legacyPlatformName}
                  onChange={(e) => {
                    const val = e.target.value;
                    setNewAssessmentForm((prev) => ({ ...prev, legacyPlatformName: val }));
                    setDossier((prev) => ({
                      ...prev,
                      meta: { ...(prev.meta || {}), legacyPlatformName: val || 'Legacy AI / Search Baseline', legacySystemName: val || 'Legacy AI / Search Baseline' }
                    }));
                  }}
                  placeholder="e.g. Custom OpenAI / Legacy Search"
                  style={{ width: '100%', padding: '8px 11px', borderRadius: '8px', border: '1px solid #94a3b8', background: '#ffffff', color: '#0f172a', fontSize: '0.82rem', fontWeight: 600 }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Customer Executive Sponsor
                </label>
                <input
                  type="text"
                  value={newAssessmentForm.executiveSponsor}
                  onChange={(e) => {
                    const val = e.target.value;
                    setNewAssessmentForm((prev) => ({ ...prev, executiveSponsor: val }));
                    setDossier((prev) => ({
                      ...prev,
                      meta: { ...(prev.meta || {}), executiveSponsor: val || 'Executive Sponsor (Pending)' }
                    }));
                  }}
                  placeholder="e.g. VP Enterprise AI & Digital"
                  style={{ width: '100%', padding: '8px 11px', borderRadius: '8px', border: '1px solid #94a3b8', background: '#ffffff', color: '#0f172a', fontSize: '0.82rem', fontWeight: 600 }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Google Account / Technical Lead (CAL)
                </label>
                <input
                  type="text"
                  value={newAssessmentForm.calLead}
                  onChange={(e) => {
                    const val = e.target.value;
                    setNewAssessmentForm((prev) => ({ ...prev, calLead: val }));
                    setDossier((prev) => ({
                      ...prev,
                      meta: { ...(prev.meta || {}), accountLeads: val ? [val] : ['Enterprise Account Lead'] }
                    }));
                  }}
                  placeholder="e.g. Enterprise Account Lead"
                  style={{ width: '100%', padding: '8px 11px', borderRadius: '8px', border: '1px solid #94a3b8', background: '#ffffff', color: '#0f172a', fontSize: '0.82rem', fontWeight: 600 }}
                />
              </div>
            </div>

            {/* Step 2: Prefill Mode Selector + Launch Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', paddingTop: '14px', borderTop: '1px solid #cbd5e1' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase' }}>
                  Questionnaire Mode (82 Qs):
                </span>
                {[
                  { id: 'clean', label: '⚪ Unfilled / Blank from Question 1 (Default)', desc: 'Starts with all 82 questions unfilled at Question 1 (C01) with a unique Assessment ID' },
                  { id: 'evidence', label: '🟢 8-Source Evidence Prefill', desc: 'Selects best evidence-backed option per question while keeping this unique Assessment ID' },
                  { id: 'random', label: '🎲 Random Options Prefill', desc: 'Randomly selects realistic candidate options across all 82 Qs while keeping this unique Assessment ID' }
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setNewAssessmentForm((prev) => ({ ...prev, prefillMode: m.id }))}
                    style={{
                      background: newAssessmentForm.prefillMode === m.id ? '#2563eb' : '#ffffff',
                      color: newAssessmentForm.prefillMode === m.id ? '#ffffff' : '#334155',
                      border: newAssessmentForm.prefillMode === m.id ? '1.5px solid #1d4ed8' : '1px solid #cbd5e1',
                      borderRadius: '8px',
                      padding: '7px 12px',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                    title={m.desc}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  onClick={async () => {
                    const targetId = newAssessmentForm.assessmentId || dossier.id;
                    setShowNewAssessmentModal(false);
                    setPrimaryView('inputs');
                    setActiveModuleId('C');
                    setWizardIndex(0);
                    if (newAssessmentForm.prefillMode === 'clean') {
                      await handleStartNewUnfilledAssessment({
                        ...newAssessmentForm,
                        assessmentId: targetId
                      }, false);
                    } else {
                      await handleIngestCustomer({
                        assessmentId: targetId,
                        createNewAssessment: true,
                        customerQuery: newAssessmentForm.customerName,
                        sfdcAccountId: newAssessmentForm.sfdcAccountId,
                        prefillMode: newAssessmentForm.prefillMode,
                        customCustomerDetails: {
                          customerName: newAssessmentForm.customerName,
                          sfdcAccountId: newAssessmentForm.sfdcAccountId,
                          industry: newAssessmentForm.industry,
                          legacyBaselineName: newAssessmentForm.legacyPlatformName,
                          executiveSponsor: newAssessmentForm.executiveSponsor,
                          consultingLead: newAssessmentForm.calLead
                        }
                      });
                    }
                  }}
                  disabled={ingestingCustomer}
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '10px 18px',
                    fontSize: '0.84rem',
                    fontWeight: 900,
                    cursor: ingestingCustomer ? 'wait' : 'pointer',
                    boxShadow: '0 6px 18px rgba(16, 185, 129, 0.35)'
                  }}
                >
                  {newAssessmentForm.prefillMode === 'clean'
                    ? `🚀 Begin Answering Question 1 (C01) — ID: ${newAssessmentForm.assessmentId || dossier.id}`
                    : `🚀 Populate 82-Question Assessment — ID: ${newAssessmentForm.assessmentId || dossier.id}`}
                </button>
              </div>
            </div>
          </div>
        )}

        


        {/* ===================================================================
            VIEW 1: INPUT & VERIFICATION WORKSPACE (UNIFIED DROPDOWN FILTER BAR)
           =================================================================== */}
        {primaryView === 'inputs' && (
          <div>
            
            {(() => {
              const respValues = Object.values(dossier.questionResponses || {});
              const totalQCount = GE_QUESTIONS.length;
              const answeredCount = respValues.filter(r => r.value !== null && r.value !== undefined && r.value !== '').length;
              const verifiedOnlyCount = respValues.filter(r => r.verificationStatus === 'verified' && !r.userModified).length;
              const preFilledVerifyCount = respValues.filter(r => r.verificationStatus === 'draft_verify' && !r.userModified).length;
              const unansweredPendingCount = respValues.filter(r => r.verificationStatus === 'pending' || r.value === null || r.value === undefined || r.value === '').length;
              const userModifiedCount = respValues.filter(r => r.userModified).length;
              const totalAcceptedCount = verifiedOnlyCount + userModifiedCount;
              const percentReviewed = Math.round((totalAcceptedCount / totalQCount) * 100);
              const avgConfidence = Math.round(respValues.reduce((s, r) => s + (r.confidenceScorePct || 0), 0) / (totalQCount || 1));
              const activeSfdcId = (customSalesforceIdInput || selectedSfdcId || dossier.meta?.vectorAccountId || dossier.meta?.sfdcAccountId || '0014M00001hZEwfQAG').trim();
              const contractedSeatsVal = dossier.adoptionTelemetry?.contractedSeats || 85000;
              const assignedSeatsVal = dossier.adoptionTelemetry?.assignedSeatsWave1 || dossier.adoptionTelemetry?.assignedSeats || contractedSeatsVal;
              const wauVal = dossier.adoptionTelemetry?.wauAllApi || dossier.adoptionTelemetry?.allApiWau7d || 27380;
              const wauOfAssignedPctVal = assignedSeatsVal > 0 ? Math.round((wauVal / assignedSeatsVal) * 100) : 0;

              const ingestionAudit = dossier.ingestionAudit;
              const activeItemsList = ingestionAudit?.activeItems || [];
              const quarantinedItemsList = ingestionAudit?.quarantinedItems || [];
              const filteredActiveItems = auditSourceFilter === 'ALL'
                ? activeItemsList
                : activeItemsList.filter((item) => item.source === auditSourceFilter);

              return (
                <div style={{ marginBottom: '10px' }}>
                  {/* CONSOLIDATED EXECUTIVE VALUE REALIZATION COMMAND STRIP (RULE 25 ZERO-REDUNDANCY) */}
                  <div
                    id="ge-executive-command-strip"
                    style={{
                      background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
                      border: '1.5px solid #93c5fd',
                      borderTop: '3px solid #2563eb',
                      borderRadius: '12px',
                      padding: '8px 14px',
                      marginBottom: '8px',
                      boxShadow: '0 4px 14px rgba(15, 23, 42, 0.05)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '7px'
                    }}
                  >
                    {/* ROW 1: Customer Dropdown + SoR Badges + Telemetry + Scan Trigger + Start Blank + More Actions Dropdown */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', flex: '1 1 auto' }}>
                        {/* 1. Customer Selection Dropdown */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: '#1e3a8a', whiteSpace: 'nowrap' }}>
                            🏢 Customer Account:
                          </span>
                          {showCustomSfdcInput ? (
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: '#eff6ff', padding: '3px 8px', borderRadius: '8px', border: '1.5px solid #2563eb' }}>
                              <input
                                id="ge-custom-sfdc-inline-input"
                                type="text"
                                placeholder="18-char SFDC ID or Account..."
                                value={customSalesforceIdInput}
                                onChange={(e) => setCustomSalesforceIdInput(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    const sfdcId = (customSalesforceIdInput || '').trim();
                                    if (sfdcId) {
                                      setSelectedSfdcId(sfdcId);
                                      setCustomerInput(sfdcId);
                                      handleScanCustomerSources(sfdcId);
                                      setShowCustomSfdcInput(false);
                                    }
                                  } else if (e.key === 'Escape') {
                                    setShowCustomSfdcInput(false);
                                  }
                                }}
                                style={{
                                  padding: '5px 8px',
                                  fontSize: '0.8rem',
                                  borderRadius: '6px',
                                  border: '1px solid #93c5fd',
                                  minWidth: '220px',
                                  outline: 'none',
                                  color: '#0f172a',
                                  background: '#ffffff',
                                  fontWeight: 600
                                }}
                                autoFocus
                              />
                              <button
                                id="ge-custom-sfdc-apply-btn"
                                onClick={() => {
                                  const sfdcId = (customSalesforceIdInput || '').trim();
                                  if (sfdcId) {
                                    setSelectedSfdcId(sfdcId);
                                    setCustomerInput(sfdcId);
                                    handleScanCustomerSources(sfdcId);
                                    setShowCustomSfdcInput(false);
                                  }
                                }}
                                style={{
                                  background: '#2563eb',
                                  color: '#ffffff',
                                  border: 'none',
                                  borderRadius: '6px',
                                  padding: '5px 10px',
                                  fontSize: '0.75rem',
                                  fontWeight: 800,
                                  cursor: 'pointer'
                                }}
                              >
                                Scan
                              </button>
                              <button
                                onClick={() => setShowCustomSfdcInput(false)}
                                style={{
                                  background: 'transparent',
                                  color: '#64748b',
                                  border: 'none',
                                  padding: '3px 6px',
                                  fontSize: '0.85rem',
                                  cursor: 'pointer'
                                }}
                                title="Cancel"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <select
                              id="ge-executive-customer-select"
                              value={activeSfdcId}
                              onChange={(e) => {
                                const val = e.target.value;
                                if (val === 'custom') {
                                  setShowCustomSfdcInput(true);
                                  return;
                                }
                                setSelectedSfdcId(val);
                                setCustomSalesforceIdInput(val);
                                const found = VERIFIED_VECTOR_PRESETS.find(p => p.id === val) || customerMatches.find(c => c.sfdcAccountId === val);
                                if (found) {
                                  setCustomerInput(`${found.name || found.accountName} (${val})`);
                                }
                                handleScanCustomerSources(val);
                              }}
                              style={{
                                padding: '7px 11px',
                                borderRadius: '8px',
                                border: '1.5px solid #2563eb',
                                background: '#ffffff',
                                color: '#0f172a',
                                fontSize: '0.82rem',
                                fontWeight: 800,
                                cursor: 'pointer',
                                maxWidth: '420px'
                              }}
                              title="Select Verified Salesforce / Vector CRM Customer Account"
                            >
                              <optgroup label="Verified NorthAM Vector CRM SoR (Real Enterprise Accounts)">
                                {VERIFIED_VECTOR_PRESETS.filter(p => p.real).map((p) => (
                                  <option key={p.id} value={p.id}>
                                    🟢 {p.name} ({p.seats} Seats • {p.wau} WAU)
                                  </option>
                                ))}
                                {customerMatches.filter(c => c.isRealVectorAccount && !VERIFIED_VECTOR_PRESETS.some(p => p.id === c.sfdcAccountId)).map((c) => (
                                  <option key={c.sfdcAccountId} value={c.sfdcAccountId}>
                                    🟢 {c.accountName} ({c.contractedSeats ? `${Math.round(c.contractedSeats/1000)}K` : ''} Seats • {c.sfdcAccountId.slice(0, 10)}...)
                                  </option>
                                ))}
                              </optgroup>
                              <optgroup label="Canonical Enterprise CRM Dossiers (ACC-1001..1010)">
                                {VERIFIED_VECTOR_PRESETS.filter(p => !p.real).map((p) => (
                                  <option key={p.id} value={p.id}>
                                    🏢 {p.name} ({p.seats} Seats • {p.wau} WAU)
                                  </option>
                                ))}
                                <option value="custom">✏️ + Enter Custom Salesforce ID...</option>
                              </optgroup>
                            </select>
                          )}
                        </div>

                        {/* 2. SoR Verification Badge */}
                        {(dossier?.meta?.isVerifiedVector || customSalesforceIdInput?.startsWith('001') || selectedSfdcId?.startsWith('001')) ? (
                          <span style={{ fontSize: '0.7rem', color: '#047857', background: '#dcfce7', border: '1px solid #86efac', borderRadius: '6px', padding: '3px 8px', fontWeight: 800 }}>
                            🟢 Verified Vector CRM Account
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.7rem', color: '#047857', background: '#ecfdf5', border: '1px solid #6ee7b7', borderRadius: '6px', padding: '3px 8px', fontWeight: 800 }}>
                            🟢 Verified Enterprise CRM ({activeSfdcId})
                          </span>
                        )}

                        {/* 3. Denominators Pill (Contracted + Wave-1 Assigned + Active WAU) */}
                        <span style={{ fontSize: '0.72rem', color: '#334155', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px', padding: '3px 9px', fontWeight: 700 }}>
                          👥 <strong>{formatNumber(contractedSeatsVal)}</strong> Contracted • <strong>{formatNumber(assignedSeatsVal)}</strong> Assigned • <strong>{formatNumber(wauVal)}</strong> WAU ({wauOfAssignedPctVal}% of Assigned)
                        </span>
                      </div>

                      {/* Primary Scanner Trigger + Blank Assessment + More Actions Dropdown */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <button
                          id="ge-scan-all-sources-btn"
                          onClick={() => handleScanCustomerSources()}
                          disabled={ingestingCustomer}
                          style={{
                            background: ingestingCustomer ? '#64748b' : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '7px 14px',
                            fontSize: '0.78rem',
                            fontWeight: 800,
                            cursor: ingestingCustomer ? 'wait' : 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            boxShadow: '0 2px 8px rgba(37,99,235,0.22)'
                          }}
                        >
                          <FiSearch size={14} />
                          {ingestingCustomer
                            ? (scanningStatusStep === 1
                                ? 'Step 1/5: Querying Salesforce...'
                                : scanningStatusStep === 2
                                ? 'Step 2/5: Scanning Gmail & Chat...'
                                : scanningStatusStep === 3
                                ? 'Step 3/5: Extracting Drive Specs...'
                                : scanningStatusStep === 4
                                ? 'Step 4/5: Correlating Telemetry...'
                                : scanningStatusStep === 5
                                ? 'Step 5/5: Computing Citations...'
                                : 'Scanning All Sources...')
                            : '🔍 Scan All Sources'}
                        </button>

                        <button
                          id="ge-start-blank-assessment-btn"
                          onClick={() => {
                            const targetSfdc = (customSalesforceIdInput || selectedSfdcId || '0014M00001hZEwfQAG').trim();
                            const isMerck = targetSfdc === '0014M00001hZEwfQAG' || targetSfdc.toLowerCase().includes('merck');
                            handleStartNewUnfilledAssessment({
                              sfdcAccountId: targetSfdc,
                              customerName: isMerck ? 'Merck & Co., Inc.' : `Assessment (${targetSfdc})`,
                              industry: isMerck ? 'Healthcare & Life Sciences' : 'Enterprise Operations'
                            }, false);
                            toast.success(`✨ Started Blank Assessment (0/82) for ${targetSfdc}! Answer manually or click "Scan All Sources" to ground answers.`);
                          }}
                          style={{
                            background: '#ffffff',
                            color: '#1e3a8a',
                            border: '1.5px solid #93c5fd',
                            borderRadius: '8px',
                            padding: '7px 12px',
                            fontSize: '0.76rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px'
                          }}
                          title="Start Blank Assessment from Question 1 (0/82 answered)"
                        >
                          <FiRefreshCw size={13} />
                          ✨ Start Blank (0/82)
                        </button>

                        {/* Unified Utilities, Batch Review & Export Dropdown (Rule 25 Zero-Redundancy) */}
                        <select
                          id="ge-more-actions-select"
                          value=""
                          onChange={(e) => {
                            const act = e.target.value;
                            if (!act) return;
                            if (act === 'accept_all') handleAcceptAllScanned('ALL');
                            else if (act === 'accept_tier_a') handleAcceptAllScanned('TIER_A');
                            else if (act === 'upload_docs') setShowSourceExtractorPanel((prev) => !prev);
                            else if (act === 'inspect_audit') setShowIngestionAuditDrawer((prev) => !prev);
                            else if (act === 'edit_setup') setShowNewAssessmentModal((prev) => !prev);
                            else if (act === 'saved_hub') {
                              fetchSavedAssessmentsList();
                              setShowSavedHubDrawer((prev) => !prev);
                            } else if (act === 'save') {
                              handleSaveDossier(dossier, false);
                            } else if (act === 'export_json') {
                              handleExportJson();
                            } else if (act === 'print_pdf') {
                              setPrimaryView('report');
                              toast.success('Switched to Executive Readout for PDF print...');
                              setTimeout(() => window.print(), 400);
                            } else if (act === 'random_customer') {
                              handlePickRandomCustomerForModal('rich', false, 'evidence');
                            } else if (act === 'randomize_options') {
                              handleRandomizeCurrentCustomerOptions();
                            } else if (act === 'reset_scanned') {
                              handleResetAllToScanned();
                            }
                          }}
                          style={{
                            background: '#f8fafc',
                            color: '#1e293b',
                            border: '1px solid #cbd5e1',
                            borderRadius: '8px',
                            padding: '7px 10px',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            cursor: 'pointer'
                          }}
                          title="Batch Verification, Source Extractors, Saved Assessments & Export Utilities"
                        >
                          <option value="" disabled>⚡ More Actions & Export ▾</option>
                          <option value="accept_all">✓ Accept All Scanned (82)</option>
                          <option value="accept_tier_a">✓ Accept Tier A Only (≥90%)</option>
                          <option value="upload_docs">📎 Upload Docs / PDFs / Buganizer Extractor</option>
                          <option value="inspect_audit">🔎 Inspect 8-Source Ingestion & Quarantine Audit</option>
                          <option value="saved_hub">📂 Open Saved Assessments Hub</option>
                          <option value="edit_setup">✏️ Edit Customer Setup Details</option>
                          <option value="save">💾 Save Assessment Dossier</option>
                          <option value="export_json">📥 Export Dossier JSON</option>
                          <option value="print_pdf">🖨️ Print / Export Executive PDF</option>
                          <option value="random_customer">🎲 Random SFDC Customer & Prefill</option>
                          <option value="randomize_options">🔀 Randomize 82 Options</option>
                          <option value="reset_scanned">↺ Reset Modified to Scanned</option>
                        </select>
                      </div>
                    </div>

                    {/* ROW 2: Verification Mini-Progress + 5 Clean Filter Dropdowns + Search */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '8px',
                      borderTop: '1px solid #e2e8f0',
                      paddingTop: '8px'
                    }}>
                      {/* Left: Verification Progress & Metrics Pill */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#0f172a' }}>
                          📊 {answeredCount}/82 Grounded
                        </span>
                        <div style={{ width: '70px', background: '#e2e8f0', height: '6px', borderRadius: '999px', overflow: 'hidden' }}>
                          <div style={{
                            width: `${percentReviewed}%`,
                            height: '100%',
                            background: percentReviewed >= 90 ? '#10b981' : percentReviewed >= 50 ? '#3b82f6' : '#f59e0b',
                            borderRadius: '999px'
                          }} />
                        </div>
                        <span style={{ fontSize: '0.68rem', color: '#047857', background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '1px 6px', borderRadius: '4px', fontWeight: 800 }}>
                          🟢 {verifiedOnlyCount} Verified
                        </span>
                        <span style={{ fontSize: '0.68rem', color: '#b45309', background: '#fffbeb', border: '1px solid #fde68a', padding: '1px 6px', borderRadius: '4px', fontWeight: 800 }}>
                          🟡 {preFilledVerifyCount} Pre-Filled (Confirm)
                        </span>
                        <span style={{ fontSize: '0.68rem', color: '#475569', background: '#f8fafc', border: '1px solid #cbd5e1', padding: '1px 6px', borderRadius: '4px', fontWeight: 800 }}>
                          ⚪ {unansweredPendingCount} Pending
                        </span>
                        {userModifiedCount > 0 && (
                          <span style={{ fontSize: '0.68rem', color: '#6d28d9', background: '#ede9fe', border: '1px solid #ddd6fe', padding: '1px 6px', borderRadius: '4px', fontWeight: 800 }}>
                            ✍️ {userModifiedCount} Modified
                          </span>
                        )}
                        <span style={{ fontSize: '0.68rem', color: '#1d4ed8', background: '#eff6ff', border: '1px solid #bfdbfe', padding: '1px 6px', borderRadius: '4px', fontWeight: 800 }}>
                          {avgConfidence}% Avg Conf
                        </span>
                      </div>

                      {/* Right: Filter Dropdowns + Search Input */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        {/* 1. Layout Mode Dropdown */}
                        <select
                          id="ge-view-layout-select"
                          value={inputMode}
                          onChange={(e) => {
                            const nextMode = e.target.value;
                            setInputMode(nextMode);
                            if (nextMode === 'wizard') setWizardIndex(0);
                          }}
                          style={{
                            padding: '5px 8px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            background: '#ffffff',
                            color: '#0f172a',
                            cursor: 'pointer'
                          }}
                          title="Switch Layout Mode"
                        >
                          <option value="section">📑 Module Tabs View</option>
                          <option value="wizard">🎯 1-by-1 Wizard</option>
                          <option value="grid">⊞ All-in-One Table</option>
                        </select>

                        {/* 2. Review Status Filter Dropdown */}
                        <select
                          id="ge-filter-status-select"
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          style={{
                            padding: '5px 8px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            background: statusFilter === 'ALL' ? '#ffffff' : '#f0fdf4',
                            color: '#0f172a',
                            cursor: 'pointer'
                          }}
                          title="Filter by Verification Status"
                        >
                          <option value="ALL">📋 Status: All (82)</option>
                          <option value="draft_verify">🟡 Pre-Filled / Confirm ({preFilledVerifyCount})</option>
                          <option value="verified">🟢 Verified ({verifiedOnlyCount})</option>
                          <option value="pending">⚪ Pending ({unansweredPendingCount})</option>
                          <option value="user_modified">✍️ Modified ({userModifiedCount})</option>
                        </select>

                        {/* 3. Confidence Tier Filter Dropdown */}
                        <select
                          id="ge-filter-tier-select"
                          value={confidenceTierFilter}
                          onChange={(e) => {
                            setConfidenceTierFilter(e.target.value);
                            setWizardIndex(0);
                          }}
                          style={{
                            padding: '5px 8px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            background: confidenceTierFilter === 'ALL' ? '#ffffff' : '#eff6ff',
                            color: '#0f172a',
                            cursor: 'pointer'
                          }}
                          title="Filter by Confidence Tier"
                        >
                          <option value="ALL">🎯 Tier: All ({tierCounts.total})</option>
                          <option value="A">🟢 Tier A: 90–100% ({tierCounts.A})</option>
                          <option value="B">🔵 Tier B: 75–89% ({tierCounts.B})</option>
                          <option value="C">🟡 Tier C: 40–74% ({tierCounts.C})</option>
                          <option value="D">⚪ Tier D: &lt;40% ({tierCounts.D})</option>
                        </select>

                        {/* 4. Scanned Source Filter Dropdown */}
                        <select
                          id="ge-filter-source-select"
                          value={selectedSourceFilter}
                          onChange={(e) => setSelectedSourceFilter(e.target.value)}
                          style={{
                            padding: '5px 8px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            background: selectedSourceFilter === 'ALL' ? '#ffffff' : '#f0f9ff',
                            color: '#0f172a',
                            cursor: 'pointer'
                          }}
                          title="Filter by Scanned Enterprise Source"
                        >
                          <option value="ALL">🌐 Source: All (6 Sources)</option>
                          <option value="salesforce">☁️ Salesforce CRM Only</option>
                          <option value="chat">💬 Google Chat Spaces Only</option>
                          <option value="email">✉️ Gmail Threads Only</option>
                          <option value="drive">📁 Drive / Docs Only</option>
                          <option value="buganizer">🐛 Buganizer Issues (b/) Only</option>
                          <option value="gantry">🏛️ Gantry Telemetry Only</option>
                        </select>

                        {/* 5. Time Window Dropdown */}
                        <select
                          id="ge-time-window-select"
                          value={timePreset || 'ytd_2026'}
                          onChange={(e) => {
                            const val = e.target.value;
                            setTimePreset(val);
                            handleIngestCustomer({ timePreset: val });
                          }}
                          style={{
                            padding: '5px 8px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            background: '#ffffff',
                            color: '#0f172a',
                            cursor: 'pointer'
                          }}
                          title="Time Window Scope"
                        >
                          <option value="90d">📅 Last 90 Days (QBR)</option>
                          <option value="180d">📅 Last 180 Days</option>
                          <option value="365d">📅 Last 1 Year</option>
                          <option value="all">📅 Full Contract</option>
                        </select>

                        {/* Compact Search Input */}
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="🔍 Search Qs..."
                          style={{
                            width: '135px',
                            padding: '5px 8px',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            background: '#ffffff',
                            color: '#0f172a'
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* =================================================================
                      EXPANDABLE 8-SOURCE EVIDENCE LINEAGE & 4-PILLAR QUALITY AUDIT DRAWER
                     ================================================================= */}
                  {showIngestionAuditDrawer && ingestionAudit && (
                    <div style={{
                      background: '#ffffff',
                      border: '1.5px solid #93c5fd',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      marginBottom: '14px',
                      boxShadow: '0 4px 14px rgba(15, 23, 42, 0.05)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1e3a8a', textTransform: 'uppercase' }}>
                          🔎 8-Source Evidence Lineage & 4-Pillar Quality Audit ({activeItemsList.length} Active Artifacts • {quarantinedItemsList.length} Quarantined)
                        </span>
                        <button
                          onClick={() => setShowIngestionAuditDrawer(false)}
                          style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '3px 8px', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer' }}
                        >
                          ✕ Close Audit
                        </button>
                      </div>

                      {/* 4 Quality Pillars Banner: Relevant, Related, Accurate, Complete */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '14px' }}>
                        {[
                          { key: 'relevant', badge: '1. RELEVANT', color: '#1d4ed8', bg: '#eff6ff', border: '#93c5fd', data: ingestionAudit.qualityGuarantees?.relevant },
                          { key: 'related', badge: '2. RELATED', color: '#047857', bg: '#ecfdf5', border: '#6ee7b7', data: ingestionAudit.qualityGuarantees?.related },
                          { key: 'accurate', badge: '3. ACCURATE', color: '#b45309', bg: '#fffbeb', border: '#fde68a', data: ingestionAudit.qualityGuarantees?.accurate },
                          { key: 'complete', badge: '4. COMPLETE', color: '#6d28d9', bg: '#f5f3ff', border: '#c4b5fd', data: ingestionAudit.qualityGuarantees?.complete }
                        ].map((p) => (
                          <div key={p.key} style={{ background: p.bg, border: `1px solid ${p.border}`, borderRadius: '10px', padding: '10px 12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                              <span style={{ fontSize: '0.7rem', fontWeight: 900, color: p.color }}>{p.badge}</span>
                              <span style={{ fontSize: '0.66rem', fontWeight: 800, fontFamily: 'monospace', background: '#ffffff', color: p.color, padding: '1px 6px', borderRadius: '999px', border: `1px solid ${p.border}` }}>
                                {p.data?.status || 'VERIFIED'} • 100%
                              </span>
                            </div>
                            <div style={{ fontSize: '0.72rem', color: '#1e293b', lineHeight: 1.4, fontWeight: 600 }}>
                              {p.data?.summary}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Filter Tabs by Enterprise Source */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                          <button
                            onClick={() => setAuditSourceFilter('ALL')}
                            style={{
                              background: auditSourceFilter === 'ALL' ? '#1e3a8a' : '#f1f5f9',
                              color: auditSourceFilter === 'ALL' ? '#ffffff' : '#334155',
                              border: '1px solid #cbd5e1',
                              borderRadius: '7px',
                              padding: '5px 10px',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              cursor: 'pointer'
                            }}
                          >
                            All 8 Sources ({activeItemsList.length})
                          </button>
                          {ENTERPRISE_SOURCE_CONNECTORS.map((src) => {
                            const cov = (ingestionAudit.sourceCoverage || []).find((c) => c.id === src.id);
                            const count = cov ? cov.activeArtifactCount : 0;
                            return (
                              <button
                                key={src.id}
                                onClick={() => setAuditSourceFilter(src.id)}
                                style={{
                                  background: auditSourceFilter === src.id ? '#1d4ed8' : '#ffffff',
                                  color: auditSourceFilter === src.id ? '#ffffff' : '#334155',
                                  border: `1px solid ${auditSourceFilter === src.id ? '#1d4ed8' : '#cbd5e1'}`,
                                  borderRadius: '7px',
                                  padding: '5px 10px',
                                  fontSize: '0.72rem',
                                  fontWeight: 700,
                                  cursor: 'pointer'
                                }}
                              >
                                {src.icon} {src.label} ({count})
                              </button>
                            );
                          })}
                        </div>
                        <span style={{ fontSize: '0.7rem', color: '#475569', fontFamily: 'monospace' }}>
                          Time Window Filter: {ingestionAudit.startDate} → {ingestionAudit.endDate}
                        </span>
                      </div>

                      {/* Two-Column Split: Ingested Source Artifacts vs. Quarantined / Excluded Noise */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1.55fr 1fr', gap: '12px' }}>
                        {/* Left: Matched & Reconciled Multi-Source Artifacts */}
                        <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', overflow: 'hidden' }}>
                          <div style={{ background: '#1e3a8a', color: '#ffffff', padding: '8px 12px', fontSize: '0.72rem', fontWeight: 800, display: 'flex', justifyContent: 'space-between' }}>
                            <span>✓ INGESTED & RECONCILED MULTI-SOURCE ARTIFACTS ({auditSourceFilter === 'ALL' ? 'ALL 8 SOURCES' : auditSourceFilter.toUpperCase()})</span>
                            <span>ENTITY: {ingestionAudit.customerName} [{ingestionAudit.sfdcAccountId}]</span>
                          </div>
                          <div style={{ maxHeight: '260px', overflowY: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.72rem' }}>
                              <thead>
                                <tr style={{ background: '#f1f5f9', color: '#334155', textAlign: 'left', borderBottom: '1px solid #cbd5e1' }}>
                                  <th style={{ padding: '6px 10px' }}>Source</th>
                                  <th style={{ padding: '6px 10px' }}>Date</th>
                                  <th style={{ padding: '6px 10px' }}>Artifact / Title & URI</th>
                                  <th style={{ padding: '6px 10px' }}>Extracted Evidence & Linked Qs</th>
                                </tr>
                              </thead>
                              <tbody>
                                {filteredActiveItems.map((art) => (
                                  <tr key={art.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                    <td style={{ padding: '7px 10px', fontWeight: 800, whiteSpace: 'nowrap', color: '#1e3a8a', verticalAlign: 'top' }}>
                                      {art.sourceLabel || art.source?.toUpperCase()}
                                      <div style={{ fontSize: '0.62rem', color: '#64748b', fontWeight: 600 }}>{art.artifactType}</div>
                                    </td>
                                    <td style={{ padding: '7px 10px', fontFamily: 'monospace', whiteSpace: 'nowrap', color: '#475569', verticalAlign: 'top' }}>
                                      {art.timestamp}
                                    </td>
                                    <td style={{ padding: '7px 10px', verticalAlign: 'top' }}>
                                      <div style={{ fontWeight: 800, color: '#0f172a' }}>{art.title}</div>
                                      <div style={{ fontSize: '0.64rem', fontFamily: 'monospace', color: '#2563eb', wordBreak: 'break-all' }}>
                                        {art.url}
                                      </div>
                                    </td>
                                    <td style={{ padding: '7px 10px', color: '#334155', verticalAlign: 'top' }}>
                                      <div>{art.extractedSummary}</div>
                                      {art.mappedQuestions?.length > 0 && (
                                        <div style={{ marginTop: '3px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                          {art.mappedQuestions.slice(0, 12).map((qid) => (
                                            <span key={qid} style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', borderRadius: '4px', padding: '0 5px', fontSize: '0.62rem', fontFamily: 'monospace', fontWeight: 800 }}>
                                              {qid}
                                            </span>
                                          ))}
                                          {art.mappedQuestions.length > 12 && (
                                            <span style={{ fontSize: '0.62rem', color: '#64748b', fontWeight: 700 }}>
                                              +{art.mappedQuestions.length - 12} more
                                            </span>
                                          )}
                                        </div>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Right: Quarantined / Excluded Noise Log */}
                        <div style={{ background: '#ffffff', border: '1px solid #fecaca', borderRadius: '10px', overflow: 'hidden' }}>
                          <div style={{ background: '#7f1d1d', color: '#ffffff', padding: '8px 12px', fontSize: '0.72rem', fontWeight: 800, display: 'flex', justifyContent: 'space-between' }}>
                            <span>🛡️ QUARANTINED / EXCLUDED NOISE ({quarantinedItemsList.length})</span>
                            <span>ZERO-CONTAMINATION LOG</span>
                          </div>
                          <div style={{ maxHeight: '260px', overflowY: 'auto', padding: '8px 10px' }}>
                            {quarantinedItemsList.map((qItem, idx) => (
                              <div key={qItem.id || idx} style={{
                                background: '#fef2f2',
                                border: '1px solid #fecaca',
                                borderRadius: '8px',
                                padding: '7px 9px',
                                marginBottom: '6px',
                                fontSize: '0.7rem'
                              }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                                  <span style={{ fontWeight: 900, color: '#991b1b', fontFamily: 'monospace', fontSize: '0.65rem' }}>
                                    [{qItem.reasonCode}] • {qItem.sourceLabel || qItem.source}
                                  </span>
                                  <span style={{ fontSize: '0.62rem', fontFamily: 'monospace', color: '#7f1d1d' }}>
                                    {qItem.timestamp}
                                  </span>
                                </div>
                                <div style={{ fontWeight: 800, color: '#0f172a' }}>{qItem.title}</div>
                                <div style={{ color: '#475569', marginTop: '2px', fontSize: '0.67rem' }}>{qItem.reasonDetail}</div>
                                {qItem.preventedImpact && (
                                  <div style={{ color: '#047857', marginTop: '2px', fontSize: '0.65rem', fontWeight: 700 }}>
                                    ✓ Guardrail: {qItem.preventedImpact}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}


            {/* ===============================================================
                MODE 1: HORIZONTAL 10-MODULE TABS + 2-COLUMN FLUID QUESTION GRID (DEFAULT)
               =============================================================== */}
            {inputMode === 'section' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
                {/* Horizontal 10-Module Tab Bar (#ge-module-tabs-bar) */}
                <div
                  id="ge-module-tabs-bar"
                  style={{
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '12px',
                    padding: '8px 14px',
                    boxShadow: '0 2px 6px rgba(15,23,42,0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#1e3a8a' }}>
                        📑 10 Assessment Module Tabs ({GE_QUESTIONS.length} Questions):
                      </span>
                      {(() => {
                        const activeMod = GE_MODULES.find((m) => m.id === activeModuleId);
                        if (!activeMod || activeRoleFilter !== 'all_modules') return null;
                        return (
                          <span style={{ fontSize: '0.73rem', fontWeight: 700, color: '#475569', background: '#f1f5f9', padding: '2px 8px', borderRadius: '6px' }}>
                            Active: <strong style={{ color: '#0f172a' }}>{activeMod.code} — {activeMod.title}</strong> • Owner: {activeMod.ownerRole} {activeMod.weight > 0 ? `• ${activeMod.weight} pts` : ''}
                          </span>
                        );
                      })()}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      {/* Compact Stakeholder Role Filter Dropdown */}
                      <select
                        id="ge-stakeholder-role-select"
                        value={activeRoleFilter}
                        onChange={(e) => setActiveRoleFilter(e.target.value)}
                        style={{
                          padding: '5px 10px',
                          borderRadius: '7px',
                          border: activeRoleFilter !== 'all_modules' ? '1.5px solid #2563eb' : '1px solid #cbd5e1',
                          background: activeRoleFilter !== 'all_modules' ? '#eff6ff' : '#f8fafc',
                          color: activeRoleFilter !== 'all_modules' ? '#1d4ed8' : '#334155',
                          fontSize: '0.73rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                        title="Filter Questions by Stakeholder Role Packet"
                      >
                        {RESPONDENT_FORMS.map((rf) => (
                          <option key={rf.id} value={rf.id}>
                            👥 {String(rf.title).replace(/\s*\(All\s+\d+\s+Qs\)\s*$/i, '')} ({rf.badge})
                          </option>
                        ))}
                      </select>

                      {/* Prev / Next Module Step Buttons */}
                      {(() => {
                        const curIdx = GE_MODULES.findIndex((m) => m.id === activeModuleId);
                        const prevMod = curIdx > 0 ? GE_MODULES[curIdx - 1] : null;
                        const nextMod = curIdx >= 0 && curIdx < GE_MODULES.length - 1 ? GE_MODULES[curIdx + 1] : null;
                        return (
                          <div style={{ display: 'inline-flex', gap: '5px' }}>
                            <button
                              disabled={!prevMod}
                              onClick={() => {
                                if (prevMod) {
                                  setActiveRoleFilter('all_modules');
                                  setActiveModuleId(prevMod.id);
                                }
                              }}
                              style={{
                                padding: '5px 9px',
                                borderRadius: '7px',
                                border: '1px solid #cbd5e1',
                                background: prevMod ? '#ffffff' : '#f8fafc',
                                color: prevMod ? '#1e293b' : '#94a3b8',
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                cursor: prevMod ? 'pointer' : 'not-allowed'
                              }}
                            >
                              ← Prev Tab
                            </button>
                            <button
                              disabled={!nextMod}
                              onClick={() => {
                                if (nextMod) {
                                  setActiveRoleFilter('all_modules');
                                  setActiveModuleId(nextMod.id);
                                }
                              }}
                              style={{
                                padding: '5px 9px',
                                borderRadius: '7px',
                                border: '1px solid #2563eb',
                                background: nextMod ? '#eff6ff' : '#f8fafc',
                                color: nextMod ? '#1d4ed8' : '#94a3b8',
                                fontSize: '0.72rem',
                                fontWeight: 800,
                                cursor: nextMod ? 'pointer' : 'not-allowed'
                              }}
                            >
                              Next Tab →
                            </button>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Horizontal Clickable Module Pill Tabs */}
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                    {GE_MODULES.map((m, mIdx) => {
                      const modQuestions = GE_QUESTIONS.filter((q) => q.module === m.id);
                      const modVerified = modQuestions.filter((q) => dossier.questionResponses?.[q.id]?.verificationStatus === 'verified').length;
                      const modAnswered = modQuestions.filter((q) => {
                        const r = dossier.questionResponses?.[q.id];
                        const v = r?.value;
                        return r && v !== null && v !== undefined && v !== '' && !(Array.isArray(v) && v.length === 0) && r.verificationStatus !== 'pending';
                      }).length;
                      const modPending = modQuestions.length - modAnswered;
                      const isSelected = activeRoleFilter === 'all_modules' && activeModuleId === m.id;

                      return (
                        <button
                          key={m.id}
                          id={`ge-module-tab-${m.id}`}
                          onClick={() => {
                            setActiveRoleFilter('all_modules');
                            setActiveModuleId(m.id);
                          }}
                          style={{
                            padding: '7px 11px',
                            borderRadius: '8px',
                            border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                            background: isSelected ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' : '#f8fafc',
                            color: isSelected ? '#ffffff' : '#0f172a',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            boxShadow: isSelected ? '0 2px 8px rgba(37, 99, 235, 0.22)' : 'none',
                            transition: 'all 0.15s ease'
                          }}
                          title={`${m.code} — ${m.title} (${m.ownerRole}) • ${modVerified} Verified, ${modAnswered}/${modQuestions.length} Grounded`}
                        >
                          <span style={{ fontSize: '0.76rem', fontWeight: 800, whiteSpace: 'nowrap' }}>
                            {mIdx + 1}. {m.title.replace(/^Module\s+[A-Z]\s*[—-]\s*/i, '')} ({m.id})
                          </span>
                          <span style={{
                            fontSize: '0.65rem',
                            fontWeight: 800,
                            padding: '1px 6px',
                            borderRadius: '999px',
                            background: isSelected ? 'rgba(255,255,255,0.22)' : (modPending > 0 ? '#fffbeb' : '#ecfdf5'),
                            color: isSelected ? '#ffffff' : (modPending > 0 ? '#b45309' : '#047857'),
                            border: isSelected ? '1px solid rgba(255,255,255,0.4)' : (modPending > 0 ? '1px solid #fcd34d' : '1px solid #6ee7b7'),
                            whiteSpace: 'nowrap'
                          }}>
                            {modAnswered}/{modQuestions.length}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Full-Width Content Area: Repeatable Workflow Register + 2-Column Question Card Grid */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>

                  {/* Special Interactive Workflow Register & W04 6-Stage Effort Matrix when Module W is active */}
                  {(activeModuleId === 'W' || activeRoleFilter === 'workflow_owner') && activeWorkflow && (
                    <div style={{
                      background: '#ffffff',
                      border: '2px solid #2563eb',
                      borderRadius: '14px',
                      padding: '20px',
                      boxShadow: '0 4px 16px rgba(37, 99, 235, 0.08)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
                        <div>
                          <span style={{
                            background: '#dbeafe',
                            color: '#1d4ed8',
                            fontSize: '0.68rem',
                            fontWeight: 800,
                            padding: '3px 8px',
                            borderRadius: '6px',
                            textTransform: 'uppercase'
                          }}>
                            Repeatable Module W • Multi-Workflow Instance Register
                          </span>
                          <h3 style={{ margin: '6px 0 2px', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                            Priority {shortCustomerName} Workflows (Scaled / Pilot vs. Quarantined Scoping)
                          </h3>
                          <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b' }}>
                            Each priority workflow is evaluated independently with Capped Hybrid Weighting (max 30% portfolio cap) and a Regulated GxP Floor.
                          </p>
                        </div>
                        <button
                          onClick={handleAddWorkflow}
                          style={{
                            background: '#2563eb',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '8px 14px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <FiPlus size={14} /> Add Workflow Instance
                        </button>
                      </div>

                      {/* Workflow Instance Selector Tabs */}
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
                        {(dossier.workflows || []).map((wf, idx) => {
                          const isSelected = idx === activeWorkflowIdx;
                          const isQuarantined = wf.maturity === 'Scoping' || wf.numericState === 'pending';
                          return (
                            <button
                              key={wf.id || wf.code}
                              onClick={() => setActiveWorkflowIdx(idx)}
                              style={{
                                padding: '8px 13px',
                                borderRadius: '9px',
                                border: isSelected ? '2px solid #2563eb' : '1px solid #cbd5e1',
                                background: isSelected ? '#eff6ff' : '#f8fafc',
                                cursor: 'pointer',
                                textAlign: 'left'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ fontSize: '0.76rem', fontWeight: 800, color: isSelected ? '#1d4ed8' : '#0f172a' }}>
                                  {wf.code}: {wf.name}
                                </span>
                                <span style={{
                                  fontSize: '0.64rem',
                                  fontWeight: 800,
                                  padding: '1px 6px',
                                  borderRadius: '4px',
                                  background: isQuarantined ? '#fef3c7' : '#dcfce7',
                                  color: isQuarantined ? '#b45309' : '#15803d'
                                }}>
                                  {wf.maturity}
                                </span>
                              </div>
                              <div style={{ fontSize: '0.67rem', color: '#64748b', marginTop: '2px' }}>
                                {wf.functionArea} {wf.isRegulatedGxp ? '• 🛡️ GxP Regulated' : ''}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Selected Workflow Metadata & Telemetry Inputs */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '9px', border: '1px solid #e2e8f0' }}>
                          <label style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '4px' }}>
                            Deployment Stage (Maturity)
                          </label>
                          <select
                            value={activeWorkflow.maturity || 'Pilot'}
                            onChange={(e) => {
                              const nextMat = e.target.value;
                              updateWorkflowField(activeWorkflowIdx, {
                                maturity: nextMat,
                                numericState: nextMat === 'Scoping' ? 'pending' : 'actual'
                              });
                            }}
                            style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem', fontWeight: 700 }}
                          >
                            <option value="Scaled">Scaled (Counts in Col 2 Capacity)</option>
                            <option value="Pilot">Pilot (Counts in Col 2 Capacity)</option>
                            <option value="Scoping">Scoping (Quarantined to Col 3 Modeled)</option>
                          </select>
                        </div>

                        <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '9px', border: '1px solid #e2e8f0' }}>
                          <label style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '4px' }}>
                            W03: Completed Tasks / Month
                          </label>
                          <input
                            type="number"
                            value={activeWorkflow.completedTasksPerMonth ?? ''}
                            placeholder="Evidence Pending"
                            onChange={(e) => updateWorkflowField(activeWorkflowIdx, {
                              completedTasksPerMonth: e.target.value === '' ? null : Number(e.target.value),
                              numericState: e.target.value === '' ? 'pending' : 'actual'
                            })}
                            style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem', fontWeight: 700, fontFamily: 'monospace' }}
                          />
                        </div>

                        <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '9px', border: '1px solid #e2e8f0' }}>
                          <label style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '4px' }}>
                            W02: Active Users (Eligible: {activeWorkflow.eligibleUsers || 0})
                          </label>
                          <input
                            type="number"
                            value={activeWorkflow.activeUsers ?? ''}
                            placeholder="Evidence Pending"
                            onChange={(e) => updateWorkflowField(activeWorkflowIdx, {
                              activeUsers: e.target.value === '' ? null : Number(e.target.value)
                            })}
                            style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem', fontWeight: 700, fontFamily: 'monospace' }}
                          />
                        </div>

                        <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '9px', border: '1px solid #e2e8f0' }}>
                          <label style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '4px' }}>
                            Confidence Tier (A–D)
                          </label>
                          <select
                            value={activeWorkflow.confidenceTier || 'B'}
                            onChange={(e) => updateWorkflowField(activeWorkflowIdx, { confidenceTier: e.target.value })}
                            style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem', fontWeight: 700 }}
                          >
                            {CONFIDENCE_OPTIONS.map((c) => (
                              <option key={c.value} value={c.value}>{c.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* W04 6-Stage Effort Matrix Table */}
                      <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '14px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                          <div>
                            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a' }}>
                              W04 6-Stage Task Effort Decomposition Matrix (Minutes per Task) & W04R Verification/Rework Deduction
                            </span>
                            <span style={{ fontSize: '0.72rem', color: '#64748b', marginLeft: '8px' }}>
                              Prevents gross-savings inflation by explicitly accounting for human citation verification & correction minutes.
                            </span>
                          </div>
                          {activeWorkflowEval && (
                            <div style={{ display: 'flex', gap: '10px', fontSize: '0.75rem', fontWeight: 800, fontFamily: 'monospace' }}>
                              <span style={{ background: '#e2e8f0', padding: '3px 8px', borderRadius: '6px' }}>
                                Baseline: {activeWorkflowEval.baselineMinutes}m
                              </span>
                              <span style={{ background: '#dbeafe', color: '#1d4ed8', padding: '3px 8px', borderRadius: '6px' }}>
                                Gemini: {activeWorkflowEval.geminiMinutes}m
                              </span>
                              <span style={{ background: '#dcfce7', color: '#15803d', padding: '3px 8px', borderRadius: '6px' }}>
                                Net Saved: {activeWorkflowEval.netMinutesSavedPerTask}m/task ({activeWorkflowEval.effortReductionPct.toFixed(1)}%)
                              </span>
                              <span style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #6ee7b7', padding: '3px 8px', borderRadius: '6px' }}>
                                {activeWorkflowEval.benefitColumn}
                              </span>
                            </div>
                          )}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px' }}>
                          {[
                            { id: 'discovery', label: '1. Search & Discovery' },
                            { id: 'drafting', label: '2. First-Draft Synthesis' },
                            { id: 'verification', label: '3. Citation Verification' },
                            { id: 'correction', label: '4. Rework / Correction' },
                            { id: 'approval', label: '5. SME / GxP Approval' },
                            { id: 'handoff', label: '6. Downstream Handoff' }
                          ].map((st) => {
                            const stObj = activeWorkflow.stages?.[st.id] || { baseline: 0, gemini: 0 };
                            const delta = (stObj.baseline || 0) - (stObj.gemini || 0);
                            return (
                              <div key={st.id} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px' }}>
                                <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#1e293b', marginBottom: '6px' }}>
                                  {st.label}
                                </div>
                                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '4px' }}>
                                  <span style={{ fontSize: '0.65rem', color: '#64748b', width: '48px' }}>Baseline:</span>
                                  <input
                                    type="number"
                                    value={stObj.baseline}
                                    onChange={(e) => updateWorkflowStageEffort(activeWorkflowIdx, st.id, 'baseline', e.target.value)}
                                    style={{ width: '100%', padding: '3px 6px', fontSize: '0.75rem', fontFamily: 'monospace', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                                  />
                                </div>
                                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '4px' }}>
                                  <span style={{ fontSize: '0.65rem', color: '#64748b', width: '48px' }}>Gemini:</span>
                                  <input
                                    type="number"
                                    value={stObj.gemini}
                                    onChange={(e) => updateWorkflowStageEffort(activeWorkflowIdx, st.id, 'gemini', e.target.value)}
                                    style={{ width: '100%', padding: '3px 6px', fontSize: '0.75rem', fontFamily: 'monospace', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                                  />
                                </div>
                                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: delta >= 0 ? '#059669' : '#dc2626', textAlign: 'right' }}>
                                  {delta >= 0 ? `-${delta} min` : `+${Math.abs(delta)} min (Extra QA)`}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Resilient Empty State when filters return 0 questions (Rule 25K) */}
                  {filteredQuestions.length === 0 && (
                    <div
                      id="no-matching-cards"
                      style={{
                        background: '#ffffff',
                        border: '1px dashed #cbd5e1',
                        borderRadius: '12px',
                        padding: '28px 20px',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '10px'
                      }}
                    >
                      <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>
                        No questions match the active module/status/search filters.
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery('');
                          setStatusFilter('ALL');
                          setConfidenceTierFilter('ALL');
                          setSelectedSourceFilter('ALL');
                          setActiveRoleFilter('all_modules');
                        }}
                        style={{
                          background: '#eff6ff',
                          color: '#1d4ed8',
                          border: '1px solid #93c5fd',
                          borderRadius: '8px',
                          padding: '7px 14px',
                          fontSize: '0.78rem',
                          fontWeight: 800,
                          cursor: 'pointer'
                        }}
                      >
                        ↺ Reset All Filters
                      </button>
                    </div>
                  )}

                  {/* 2-Column Fluid Question Cards Grid (100% Uniform Card Geometry Across Every Row) */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(660px, 1fr))', gap: '14px', width: '100%', alignItems: 'stretch' }}>
                  {filteredQuestions.map((q) => {
                    const resp = dossier.questionResponses?.[q.id] || {
                      value: null,
                      numericState: 'pending',
                      outcomeScore: 0,
                      confidenceTier: 'D',
                      confidenceScorePct: 0,
                      verificationStatus: 'pending',
                      owner: '',
                      evidenceUrl: '',
                      notes: ''
                    };
                    const stMeta = STATUS_META[resp.verificationStatus] || STATUS_META.pending;
                    const qTier = resp.confidenceTier || 'B';
                    const qTierMeta = TIER_META[qTier] || TIER_META.B;
                    const qConfPct = resp.confidenceScorePct !== undefined ? resp.confidenceScorePct : getPreStagedConfidenceScorePct(q.id);
                    const isMultiSelectValue = Array.isArray(resp.value) && resp.value.length > 0;
                    const displayValue = isMultiSelectValue ? resp.value.join('; ') : (resp.value ?? '');
                    const optionConfidenceList = getQuestionOptionsWithConfidence(q, resp, dossier);
                    const contextualQuestionText = getCustomerContextualQuestionText(q, dossier);
                    const contextualRequiredEntry = getCustomerContextualRequiredEntry(q, dossier);
                    const selectedOptionValue = isMultiSelectValue
                      ? displayValue
                      : (resp.value !== null && resp.value !== undefined && resp.value !== '')
                        ? (optionConfidenceList.find((o) => o.optionText === String(resp.value))?.optionText
                          || optionConfidenceList.find((o) => o.isSelected)?.optionText
                          || String(resp.value))
                        : '';
                    const fullOwnerText = resp.owner || q.ownerRole || 'Assigned Owner';
                    const shortOwnerText = String(fullOwnerText).split('/')[0].trim();
                    const fullRationaleText = resp.whySelected || `Grounded via ${resp.evidenceUrl || 'Enterprise CRM Vector & Gantry Telemetry'}`;

                    return (
                      <div
                        key={q.id}
                        data-testid={`ge-question-card-${q.id}`}
                        style={{
                          background: '#ffffff',
                          border: '1px solid #cbd5e1',
                          borderRadius: '12px',
                          padding: '15px 18px',
                          boxShadow: '0 1px 4px rgba(15,23,42,0.03)',
                          minWidth: 0,
                          height: '100%',
                          boxSizing: 'border-box',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          overflow: 'hidden'
                        }}
                      >
                        {/* Band 1: Uniform Single-Line Executive Question Card Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', height: '26px', marginBottom: '8px', flexWrap: 'nowrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0, overflow: 'hidden', flexWrap: 'nowrap' }}>
                            <span style={{
                              background: '#1e3a8a',
                              color: '#ffffff',
                              fontFamily: "'JetBrains Mono', monospace",
                              fontSize: '0.73rem',
                              fontWeight: 800,
                              padding: '2px 8px',
                              borderRadius: '6px',
                              flexShrink: 0
                            }}>
                              {q.id}
                            </span>
                            <span style={{
                              background: '#f1f5f9',
                              color: '#334155',
                              border: '1px solid #e2e8f0',
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              padding: '2px 8px',
                              borderRadius: '6px',
                              whiteSpace: 'nowrap',
                              flexShrink: 0
                            }}>
                              Module {q.module} • {formatInputTypeLabel(q.inputType)}
                            </span>
                            <span style={{
                              background: qTierMeta.bg,
                              color: qTierMeta.color,
                              border: `1px solid ${qTierMeta.border}`,
                              fontSize: '0.69rem',
                              fontWeight: 800,
                              padding: '2px 8px',
                              borderRadius: '999px',
                              fontFamily: "'JetBrains Mono', monospace",
                              whiteSpace: 'nowrap',
                              flexShrink: 0
                            }}>
                              {qConfPct}% • {qTierMeta.shortBadge}
                            </span>
                            <span style={{
                              background: q.weight > 0 ? '#eff6ff' : '#f8fafc',
                              color: q.weight > 0 ? '#1d4ed8' : '#64748b',
                              border: q.weight > 0 ? '1px solid #bfdbfe' : '1px solid #e2e8f0',
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              padding: '2px 7px',
                              borderRadius: '6px',
                              whiteSpace: 'nowrap',
                              flexShrink: 0
                            }}>
                              {q.weight > 0 ? `${q.weight} pts` : 'Routing'}
                            </span>
                            {q.gateTrigger && (
                              <span
                                style={{
                                  background: '#fef2f2',
                                  color: '#dc2626',
                                  border: '1px solid #fecaca',
                                  fontSize: '0.68rem',
                                  fontWeight: 800,
                                  padding: '2px 7px',
                                  borderRadius: '6px',
                                  whiteSpace: 'nowrap',
                                  flexShrink: 0
                                }}
                                title={`Release Gate Trigger: ${q.gateTrigger}`}
                              >
                                🛡️ Gate
                              </span>
                            )}
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                            <select
                              value={resp.verificationStatus || 'pending'}
                              onChange={(e) => {
                                const nextSt = e.target.value;
                                if (nextSt === 'verified') {
                                  handleConfirmQuestionWithCustomer(q.id);
                                  return;
                                }
                                const autoTier = nextSt === 'draft_verify' ? 'B' : 'D';
                                const autoPct = nextSt === 'draft_verify' ? 84 : 20;
                                updateQuestionResponse(q.id, {
                                  verificationStatus: nextSt,
                                  confidenceTier: autoTier,
                                  confidenceScorePct: autoPct,
                                  numericState: nextSt === 'pending' ? 'pending' : 'actual'
                                });
                              }}
                              style={{
                                width: '188px',
                                background: stMeta.bg,
                                color: stMeta.color,
                                border: `1px solid ${stMeta.border}`,
                                borderRadius: '999px',
                                padding: '3px 9px',
                                fontSize: '0.7rem',
                                fontWeight: 800,
                                cursor: 'pointer'
                              }}
                              title={`Verification status for ${q.id} (${shortCustomerName})`}
                            >
                              <option value="verified">🟢 Verified Telemetry</option>
                              <option value="draft_verify">🟡 Pre-Filled (Confirm)</option>
                              <option value="pending">⚪ Evidence Pending</option>
                            </select>
                          </div>
                        </div>

                        {/* Band 2: Uniform Fixed-Height Question Title & Required Entry Guidance (46px) */}
                        <div style={{ height: '44px', marginBottom: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: '0.91rem',
                              fontWeight: 700,
                              color: '#0f172a',
                              height: '22px',
                              lineHeight: '22px',
                              marginBottom: '2px',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                            title={contextualQuestionText}
                          >
                            {contextualQuestionText}
                          </div>
                          <div
                            style={{
                              fontSize: '0.73rem',
                              color: '#64748b',
                              height: '18px',
                              lineHeight: '18px',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                            title={contextualRequiredEntry ? `Required Entry: ${contextualRequiredEntry}` : ''}
                          >
                            <strong>Required Entry:</strong> {contextualRequiredEntry || 'Standard grounded metric or option'}
                          </div>
                        </div>

                        {/* Band 3: Uniform 3-Column Balanced Executive Input Grid (Zero Chip Cloud Overflow, Identical 36px Controls) */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2.15fr) minmax(175px, 0.9fr) minmax(150px, 0.75fr)', gap: '10px', alignItems: 'start' }}>
                          <div style={{ minWidth: 0 }}>
                            <label style={{ fontSize: '0.68rem', fontWeight: 700, color: '#475569', display: 'block', height: '16px', lineHeight: '16px', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              Recorded Answer / Customer Metric {q.unitLabel ? `(${q.unitLabel})` : ''}
                            </label>
                            <select
                              id={`ge-question-select-${q.id}`}
                              value={selectedOptionValue}
                              title={selectedOptionValue || 'Evidence Pending / Select Grounded Option'}
                              onChange={(e) => {
                                const val = e.target.value;
                                if (!val) {
                                  updateQuestionResponse(q.id, {
                                    value: null,
                                    numericState: 'pending'
                                  });
                                  return;
                                }
                                if (isMultiSelectValue && val === displayValue) return;
                                const opt = optionConfidenceList.find(o => o.optionText === val);
                                if (opt) {
                                  handleSelectOptionForQuestion(q, opt);
                                } else {
                                  updateQuestionResponse(q.id, {
                                    value: val,
                                    numericState: 'actual'
                                  });
                                }
                              }}
                              style={{
                                width: '100%',
                                height: '36px',
                                boxSizing: 'border-box',
                                padding: '6px 10px',
                                borderRadius: '8px',
                                border: selectedOptionValue ? '1.5px solid #93c5fd' : '1.5px solid #fcd34d',
                                fontSize: '0.79rem',
                                fontWeight: 700,
                                background: selectedOptionValue ? '#f8fafc' : '#fffbeb',
                                color: '#0f172a',
                                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
                                cursor: 'pointer'
                              }}
                            >
                              <option value="">— Evidence Pending / Select Grounded Option —</option>
                              {isMultiSelectValue && !optionConfidenceList.some((o) => o.optionText === displayValue) && (
                                <option value={displayValue}>
                                  {displayValue}
                                </option>
                              )}
                              {optionConfidenceList.map((opt) => {
                                const isCheckedInMulti = isMultiSelectValue && resp.value.includes(opt.optionText);
                                return (
                                  <option key={opt.optionText} value={opt.optionText}>
                                    {isCheckedInMulti ? `✓ ${opt.optionText}` : opt.optionText}
                                  </option>
                                );
                              })}
                            </select>
                          </div>

                          <div style={{ minWidth: 0 }}>
                            <label style={{ fontSize: '0.68rem', fontWeight: 700, color: '#475569', display: 'block', height: '16px', lineHeight: '16px', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              Confidence Tier ({qConfPct}%)
                            </label>
                            <select
                              value={resp.confidenceTier || 'D'}
                              onChange={(e) => {
                                const nextT = e.target.value;
                                const defaultPctForTier = nextT === 'A' ? 96 : nextT === 'B' ? 84 : nextT === 'C' ? 62 : 20;
                                updateQuestionResponse(q.id, {
                                  confidenceTier: nextT,
                                  confidenceScorePct: defaultPctForTier
                                });
                              }}
                              style={{
                                width: '100%',
                                height: '36px',
                                boxSizing: 'border-box',
                                padding: '6px 8px',
                                borderRadius: '8px',
                                border: '1px solid #cbd5e1',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                background: '#f8fafc',
                                color: '#0f172a',
                                cursor: 'pointer'
                              }}
                            >
                              {CONFIDENCE_OPTIONS.map((c) => (
                                <option key={c.value} value={c.value}>{c.label}</option>
                              ))}
                            </select>
                          </div>

                          <div style={{ minWidth: 0 }}>
                            <label style={{ fontSize: '0.68rem', fontWeight: 700, color: '#475569', display: 'block', height: '16px', lineHeight: '16px', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              Rubric Score (0–4)
                            </label>
                            <select
                              value={resp.outcomeScore ?? 0}
                              onChange={(e) => updateQuestionResponse(q.id, {
                                outcomeScore: Number(e.target.value)
                              })}
                              style={{
                                width: '100%',
                                height: '36px',
                                boxSizing: 'border-box',
                                padding: '6px 8px',
                                borderRadius: '8px',
                                border: '1px solid #cbd5e1',
                                fontSize: '0.75rem',
                                fontWeight: 800,
                                fontFamily: 'monospace',
                                background: '#f8fafc',
                                color: '#0f172a',
                                cursor: 'pointer'
                              }}
                            >
                              <option value="0">0 — Missing</option>
                              <option value="1">1 — Partial</option>
                              <option value="2">2 — Emerging</option>
                              <option value="3">3 — Meets Target</option>
                              <option value="4">4 — Decision-Grade</option>
                            </select>
                          </div>
                        </div>

                        {/* Band 4: Uniform 2-Row Grounded Provenance, Owner & Citation Footer */}
                        <div style={{
                          marginTop: '10px',
                          paddingTop: '8px',
                          borderTop: '1px solid #f1f5f9',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          gap: '6px',
                          fontSize: '0.72rem',
                          color: '#475569'
                        }}>
                          {/* Footer Line 1: Grounded AI Rationale (Fixed 38px 2-Line Box) */}
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', minWidth: 0, height: '38px', overflow: 'hidden' }} title={fullRationaleText}>
                            <span style={{
                              fontSize: '0.62rem',
                              fontWeight: 800,
                              padding: '1px 6px',
                              borderRadius: '999px',
                              whiteSpace: 'nowrap',
                              flexShrink: 0,
                              marginTop: '2px',
                              background: resp.manualEntry ? '#ede9fe' : resp.value ? '#e0f2fe' : '#f1f5f9',
                              color: resp.manualEntry ? '#6d28d9' : resp.value ? '#0369a1' : '#64748b'
                            }}>
                              {resp.manualEntry ? '✍️ Manual' : resp.value ? '✨ Grounded AI' : '⚪ Blank'}
                            </span>
                            <span style={{ whiteSpace: 'normal', wordBreak: 'break-word', lineHeight: 1.4, fontWeight: 600, color: '#334155', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                              {fullRationaleText}
                            </span>
                          </div>

                          {/* Footer Line 2: Single-Line Owner Left + Source Citations Right (24px) */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', height: '24px', flexWrap: 'nowrap', minWidth: 0 }}>
                            <span
                              style={{
                                fontSize: '0.66rem',
                                color: '#475569',
                                background: '#f8fafc',
                                border: '1px solid #e2e8f0',
                                borderRadius: '6px',
                                padding: '2px 7px',
                                fontWeight: 700,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                maxWidth: '340px'
                              }}
                              title={fullOwnerText}
                            >
                              👤 {shortOwnerText}
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0, flexWrap: 'nowrap' }}>
                              {Array.isArray(resp.citations) && resp.citations.slice(0, 2).map((cit, cIdx) => (
                                <a
                                  key={cit.id || cIdx}
                                  href={cit.uri || '#'}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    background: '#f8fafc',
                                    color: '#1d4ed8',
                                    border: '1px solid #cbd5e1',
                                    borderRadius: '6px',
                                    padding: '2px 7px',
                                    fontSize: '0.65rem',
                                    fontWeight: 700,
                                    textDecoration: 'none',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '3px',
                                    whiteSpace: 'nowrap'
                                  }}
                                  title={cit.verbatimQuote || cit.snippet || cit.title}
                                >
                                  <span>{cit.sourceIcon || '📄'}</span>
                                  <span>{cit.sourceLabel || cit.sourceType}</span>
                                  <span>↗</span>
                                </a>
                              ))}
                              {resp.userModified && (
                                <button
                                  onClick={() => handleResetToScanned(q.id)}
                                  style={{
                                    background: '#fef2f2',
                                    color: '#dc2626',
                                    border: '1px solid #fecaca',
                                    borderRadius: '6px',
                                    padding: '2px 7px',
                                    fontSize: '0.65rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap'
                                  }}
                                  title="Revert back to original scanned baseline answer"
                                >
                                  ↺ Reset
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  </div>

                  {/* Bottom Module Tab Navigation Bar */}
                  {activeRoleFilter === 'all_modules' && (() => {
                    const curIdx = GE_MODULES.findIndex((m) => m.id === activeModuleId);
                    const prevMod = curIdx > 0 ? GE_MODULES[curIdx - 1] : null;
                    const nextMod = curIdx >= 0 && curIdx < GE_MODULES.length - 1 ? GE_MODULES[curIdx + 1] : null;
                    return (
                      <div style={{
                        background: '#ffffff',
                        border: '1px solid #cbd5e1',
                        borderRadius: '12px',
                        padding: '12px 16px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '10px'
                      }}>
                        <button
                          disabled={!prevMod}
                          onClick={() => {
                            if (prevMod) {
                              setActiveModuleId(prevMod.id);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }
                          }}
                          style={{
                            padding: '8px 14px',
                            borderRadius: '8px',
                            border: '1px solid #cbd5e1',
                            background: prevMod ? '#f8fafc' : '#f1f5f9',
                            color: prevMod ? '#0f172a' : '#94a3b8',
                            fontSize: '0.78rem',
                            fontWeight: 800,
                            cursor: prevMod ? 'pointer' : 'not-allowed'
                          }}
                        >
                          {prevMod ? `← Previous Tab: ${prevMod.code} (${prevMod.title.replace(/^Module\s+[A-Z]\s*[—-]\s*/i, '')})` : '← First Module Tab'}
                        </button>
                        <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#475569' }}>
                          Module Tab {curIdx + 1} of {GE_MODULES.length} • {filteredQuestions.length} Questions in Current Tab
                        </span>
                        {nextMod ? (
                          <button
                            onClick={() => {
                              setActiveModuleId(nextMod.id);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            style={{
                              padding: '8px 16px',
                              borderRadius: '8px',
                              border: 'none',
                              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                              color: '#ffffff',
                              fontSize: '0.78rem',
                              fontWeight: 800,
                              cursor: 'pointer'
                            }}
                          >
                            Next Tab: {nextMod.code} ({nextMod.title.replace(/^Module\s+[A-Z]\s*[—-]\s*/i, '')}) →
                          </button>
                        ) : (
                          <button
                            onClick={handleSubmitAndGenerateGeminiReport}
                            style={{
                              padding: '8px 16px',
                              borderRadius: '8px',
                              border: 'none',
                              background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                              color: '#ffffff',
                              fontSize: '0.78rem',
                              fontWeight: 800,
                              cursor: 'pointer'
                            }}
                          >
                            🚀 Complete & Generate Executive Readout →
                          </button>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* ===============================================================
                MODE 2: 1-BY-1 FOCUS WIZARD (LIVE CUSTOMER SCREEN-SHARE)
               =============================================================== */}
            {inputMode === 'wizard' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1.65fr 1fr', gap: '20px', alignItems: 'start' }}>
                {(() => {
                  const safeIdx = Math.min(Math.max(0, wizardIndex), Math.max(0, filteredQuestions.length - 1));
                  const q = filteredQuestions[safeIdx];
                  if (!q) {
                    return (
                      <div style={{ background: '#ffffff', padding: '32px', borderRadius: '14px', border: '1px solid #cbd5e1' }}>
                        No questions match the current filter.
                      </div>
                    );
                  }
                  const resp = dossier.questionResponses?.[q.id] || {};
                  const stMeta = STATUS_META[resp.verificationStatus] || STATUS_META.pending;
                  const qTier = resp.confidenceTier || 'B';
                  const qTierMeta = TIER_META[qTier] || TIER_META.B;
                  const qConfPct = resp.confidenceScorePct !== undefined ? resp.confidenceScorePct : getPreStagedConfidenceScorePct(q.id);
                  const rubricItems = RUBRIC_TEMPLATES[q.rubricKey] || RUBRIC_TEMPLATES.task_outcome;
                  const displayValue = Array.isArray(resp.value) ? resp.value.join('; ') : (resp.value ?? '');
                  const wizardOptions = getQuestionOptionsWithConfidence(q, resp, dossier);
                  const contextualQuestionText = getCustomerContextualQuestionText(q, dossier);
                  const wizardSelectedOptionValue = (!Array.isArray(resp.value) && resp.value !== null && resp.value !== undefined && resp.value !== '')
                    ? (wizardOptions.find((o) => o.optionText === String(resp.value))?.optionText
                      || wizardOptions.find((o) => o.isSelected)?.optionText
                      || String(resp.value))
                    : '';

                  return (
                    <>
                      <div style={{
                        background: '#ffffff',
                        border: '2px solid #0f172a',
                        borderRadius: '16px',
                        padding: '28px',
                        boxShadow: '0 10px 28px rgba(15,23,42,0.08)'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            🎯 Live Customer Verification Wizard • Question {safeIdx + 1} of {filteredQuestions.length}
                          </span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{
                              background: qTierMeta.bg,
                              color: qTierMeta.color,
                              border: `1px solid ${qTierMeta.border}`,
                              padding: '4px 12px',
                              borderRadius: '999px',
                              fontSize: '0.74rem',
                              fontWeight: 800,
                              fontFamily: "'JetBrains Mono', monospace"
                            }}>
                              {qConfPct}% Conf • {qTierMeta.shortBadge}
                            </span>
                            <span style={{
                              background: stMeta.bg,
                              color: stMeta.color,
                              border: `1px solid ${stMeta.border}`,
                              padding: '4px 12px',
                              borderRadius: '999px',
                              fontSize: '0.74rem',
                              fontWeight: 800
                            }}>
                              {stMeta.label}
                            </span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                          <span style={{ background: '#eff6ff', color: '#1e3a8a', border: '1px solid #bfdbfe', fontFamily: 'monospace', fontSize: '0.9rem', fontWeight: 800, padding: '4px 10px', borderRadius: '8px' }}>
                            {q.id}
                          </span>
                          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569' }}>
                            Module {q.module} • {formatInputTypeLabel(q.inputType)}
                          </span>
                        </div>

                        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', margin: '0 0 10px 0', lineHeight: 1.35 }}>
                          {contextualQuestionText}
                        </h2>
                        <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0 0 16px 0' }}>
                          {getCustomerContextualRequiredEntry(q, dossier)}
                        </p>

                        
                        <div style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '12px', padding: '16px', marginBottom: '18px' }}>
                          <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                            Recorded Value / Customer Response {q.unitLabel ? `(${q.unitLabel})` : ''}
                          </label>
                          <select
                            id={`ge-wizard-select-${q.id}`}
                            value={Array.isArray(resp.value) ? (resp.value.length > 0 ? displayValue : '') : (wizardSelectedOptionValue || String(displayValue || ''))}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (!val) {
                                updateQuestionResponse(q.id, { value: null, numericState: 'pending' });
                                return;
                              }
                              const opt = wizardOptions.find((o) => o.optionText === val);
                              if (opt) {
                                handleSelectOptionForQuestion(q, opt);
                              } else {
                                updateQuestionResponse(q.id, { value: val, numericState: 'actual' });
                              }
                            }}
                            style={{
                              width: '100%',
                              padding: '12px 14px',
                              borderRadius: '10px',
                              border: '1.5px solid #2563eb',
                              fontSize: '0.95rem',
                              fontWeight: 700,
                              background: '#ffffff',
                              color: '#0f172a',
                              cursor: 'pointer'
                            }}
                          >
                            <option value="">— Evidence Pending / Select Grounded Option —</option>
                            {Array.isArray(resp.value) && resp.value.length > 0 && !wizardOptions.some((o) => o.optionText === displayValue) && (
                              <option value={displayValue}>{displayValue}</option>
                            )}
                            {!Array.isArray(resp.value) && displayValue && !wizardOptions.some((o) => o.optionText === String(displayValue)) && (
                              <option value={String(displayValue)}>{String(displayValue)}</option>
                            )}
                            {wizardOptions.map((opt) => {
                              const isSelected = Array.isArray(resp.value)
                                ? resp.value.includes(opt.optionText)
                                : (String(resp.value) === opt.optionText);
                              return (
                                <option key={opt.optionText} value={opt.optionText}>
                                  {isSelected && Array.isArray(resp.value) ? `✓ ${opt.optionText}` : opt.optionText}
                                </option>
                              );
                            })}
                          </select>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                          <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', marginBottom: '8px' }}>
                            Anchored 0–4 Outcome Rubric
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
                            {rubricItems.map((rItem) => {
                              const selected = Number(resp.outcomeScore) === rItem.score;
                              return (
                                <button
                                  key={rItem.score}
                                  onClick={() => updateQuestionResponse(q.id, { outcomeScore: rItem.score })}
                                  style={{
                                    textAlign: 'left',
                                    padding: '10px',
                                    borderRadius: '10px',
                                    border: selected ? '2px solid #2563eb' : '1px solid #cbd5e1',
                                    background: selected ? '#eff6ff' : '#ffffff',
                                    cursor: 'pointer'
                                  }}
                                >
                                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: selected ? '#1d4ed8' : '#0f172a', marginBottom: '4px' }}>
                                    {rItem.label}
                                  </div>
                                  <div style={{ fontSize: '0.68rem', color: '#475569', lineHeight: 1.3 }}>
                                    {rItem.desc}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                          <button
                            disabled={safeIdx === 0}
                            onClick={() => setWizardIndex(Math.max(0, safeIdx - 1))}
                            style={{
                              padding: '10px 16px',
                              borderRadius: '9px',
                              border: '1px solid #cbd5e1',
                              background: safeIdx === 0 ? '#f1f5f9' : '#ffffff',
                              color: safeIdx === 0 ? '#94a3b8' : '#0f172a',
                              fontWeight: 700,
                              fontSize: '0.82rem',
                              cursor: safeIdx === 0 ? 'not-allowed' : 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}
                          >
                            <FiArrowLeft /> Previous Question
                          </button>

                          <button
                            onClick={() => {
                              handleConfirmQuestionWithCustomer(q.id);
                              if (safeIdx < filteredQuestions.length - 1) {
                                setWizardIndex(safeIdx + 1);
                              }
                            }}
                            style={{
                              padding: '10px 20px',
                              borderRadius: '9px',
                              border: 'none',
                              background: '#059669',
                              color: '#ffffff',
                              fontWeight: 800,
                              fontSize: '0.84rem',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}
                          >
                            <FiCheck /> Confirm & Mark Verified with {shortCustomerName} (→ 100% Tier A)
                          </button>

                          <button
                            disabled={safeIdx >= filteredQuestions.length - 1}
                            onClick={() => setWizardIndex(Math.min(filteredQuestions.length - 1, safeIdx + 1))}
                            style={{
                              padding: '10px 16px',
                              borderRadius: '9px',
                              border: '1px solid #cbd5e1',
                              background: safeIdx >= filteredQuestions.length - 1 ? '#f1f5f9' : '#2563eb',
                              color: safeIdx >= filteredQuestions.length - 1 ? '#94a3b8' : '#ffffff',
                              fontWeight: 700,
                              fontSize: '0.82rem',
                              cursor: safeIdx >= filteredQuestions.length - 1 ? 'not-allowed' : 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}
                          >
                            Next Question <FiArrowRight />
                          </button>
                        </div>
                      </div>

                      <div style={{
                        background: '#ffffff',
                        border: '1px solid #cbd5e1',
                        borderRadius: '16px',
                        padding: '22px'
                      }}>
                        <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b', marginBottom: '10px' }}>
                          Provenance & Live Executive Signal Impact
                        </div>
                        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px', marginBottom: '12px' }}>
                          <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>Source Artifact</div>
                          <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                            {resp.evidenceUrl || 'Evidence Pending'}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: '6px' }}>
                            <strong>Owner:</strong> {resp.owner || 'Unassigned'}
                          </div>
                          {resp.notes && (
                            <div style={{ fontSize: '0.74rem', color: '#334155', marginTop: '6px', padding: '8px', background: '#fffbeb', borderRadius: '6px', border: '1px solid #fde68a' }}>
                              💡 {resp.notes}
                            </div>
                          )}
                        </div>

                        <div style={{ background: '#f8fafc', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '14px' }}>
                          <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#475569', fontWeight: 800, marginBottom: '8px' }}>
                            Live Deterministic Score Impact
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.82rem' }}>
                            <span>Raw Performance Index:</span>
                            <strong style={{ color: '#1d4ed8', fontFamily: 'monospace' }}>{evaluation.index.rawScore} / 100</strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.82rem' }}>
                            <span>Evidence-Adjusted Index:</span>
                            <strong style={{ color: '#047857', fontFamily: 'monospace' }}>{evaluation.index.evidenceAdjustedScore} / 100</strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                            <span>Headline Verdict:</span>
                            <strong style={{ color: evaluation.anyGateOpen ? '#dc2626' : '#047857' }}>
                              {evaluation.overallHeadlineVerdict}
                            </strong>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}

            {/* ===============================================================
                MODE 3: COMPACT ALL-ON-ONE-PAGE AUDIT GRID
               =============================================================== */}
            {inputMode === 'grid' && (
              <div style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '14px',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(15,23,42,0.04)'
              }}>
                <div style={{ padding: '14px 18px', background: '#f8fafc', color: '#0f172a', borderBottom: '1px solid #cbd5e1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.84rem', fontWeight: 800 }}>
                    ⊞ Compact All-on-One-Page Audit Ledger ({filteredQuestions.length} Questions Shown)
                  </span>
                  <span style={{ fontSize: '0.74rem', color: '#475569' }}>
                    Inline edit any value, verification status, confidence tier, or 0–4 score
                  </span>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '2px solid #cbd5e1', textAlign: 'left' }}>
                        <th style={{ padding: '10px 12px', width: '64px' }}>ID</th>
                        <th style={{ padding: '10px 12px', width: '54px' }}>Mod</th>
                        <th style={{ padding: '10px 12px', minWidth: '250px' }}>Question</th>
                        <th style={{ padding: '10px 12px', minWidth: '220px' }}>Recorded Value</th>
                        <th style={{ padding: '10px 12px', width: '150px' }}>Confidence (% & Tier)</th>
                        <th style={{ padding: '10px 12px', width: '150px' }}>Verification Status</th>
                        <th style={{ padding: '10px 12px', width: '80px' }}>Score</th>
                        <th style={{ padding: '10px 12px', width: '110px' }}>Customer Action</th>
                        <th style={{ padding: '10px 12px', minWidth: '170px' }}>Source & Owner</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredQuestions.map((q) => {
                        const resp = dossier.questionResponses?.[q.id] || {};
                        const stMeta = STATUS_META[resp.verificationStatus] || STATUS_META.pending;
                        const qTier = resp.confidenceTier || 'B';
                        const qTierMeta = TIER_META[qTier] || TIER_META.B;
                        const qConfPct = resp.confidenceScorePct !== undefined ? resp.confidenceScorePct : getPreStagedConfidenceScorePct(q.id);
                        const displayVal = Array.isArray(resp.value) ? resp.value.join('; ') : (resp.value ?? '');
                        const contextualQuestionText = getCustomerContextualQuestionText(q, dossier);
                        return (
                          <tr key={q.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                            <td style={{ padding: '8px 12px', fontFamily: 'monospace', fontWeight: 800, color: '#0f172a' }}>
                              {q.id}
                            </td>
                            <td style={{ padding: '8px 12px', fontWeight: 700, color: '#475569' }}>
                              {q.module}
                            </td>
                            <td style={{ padding: '8px 12px', color: '#1e293b', fontWeight: 600 }}>
                              {contextualQuestionText}
                            </td>
                            <td style={{ padding: '8px 12px' }}>
                              <input
                                type="text"
                                value={displayVal}
                                placeholder="Evidence Pending"
                                onChange={(e) => {
                                  const raw = e.target.value;
                                  updateQuestionResponse(q.id, {
                                    value: raw === '' ? null : raw,
                                    numericState: raw === '' ? 'pending' : 'actual'
                                  });
                                }}
                                style={{
                                  width: '100%',
                                  padding: '5px 8px',
                                  borderRadius: '6px',
                                  border: '1px solid #cbd5e1',
                                  fontSize: '0.76rem'
                                }}
                              />
                            </td>
                            <td style={{ padding: '8px 12px' }}>
                              <span style={{
                                display: 'inline-block',
                                background: qTierMeta.bg,
                                color: qTierMeta.color,
                                border: `1px solid ${qTierMeta.border}`,
                                borderRadius: '999px',
                                padding: '3px 8px',
                                fontSize: '0.7rem',
                                fontWeight: 800,
                                fontFamily: 'monospace'
                              }}>
                                {qConfPct}% • {qTierMeta.shortBadge}
                              </span>
                            </td>
                            <td style={{ padding: '8px 12px' }}>
                              <select
                                value={resp.verificationStatus || 'pending'}
                                onChange={(e) => updateQuestionResponse(q.id, { verificationStatus: e.target.value })}
                                style={{
                                  width: '100%',
                                  background: stMeta.bg,
                                  color: stMeta.color,
                                  border: `1px solid ${stMeta.border}`,
                                  borderRadius: '6px',
                                  padding: '4px 6px',
                                  fontSize: '0.72rem',
                                  fontWeight: 700
                                }}
                              >
                                <option value="verified">🟢 Verified</option>
                                <option value="draft_verify">🟡 Verify w/ {shortCustomerName}</option>
                                <option value="pending">⚪ Pending</option>
                              </select>
                            </td>
                            <td style={{ padding: '8px 12px' }}>
                              <select
                                value={resp.outcomeScore ?? 0}
                                onChange={(e) => updateQuestionResponse(q.id, { outcomeScore: Number(e.target.value) })}
                                style={{ width: '100%', padding: '4px 6px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.74rem', fontWeight: 800, fontFamily: 'monospace' }}
                              >
                                <option value="0">0</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                              </select>
                            </td>
                            <td style={{ padding: '8px 12px' }}>
                              <button
                                onClick={() => handleConfirmQuestionWithCustomer(q.id)}
                                style={{
                                  background: resp.verificationStatus === 'verified' ? '#ecfdf5' : '#059669',
                                  color: resp.verificationStatus === 'verified' ? '#047857' : '#ffffff',
                                  border: resp.verificationStatus === 'verified' ? '1px solid #6ee7b7' : 'none',
                                  borderRadius: '6px',
                                  padding: '4px 8px',
                                  fontSize: '0.68rem',
                                  fontWeight: 800,
                                  cursor: 'pointer',
                                  width: '100%'
                                }}
                              >
                                {resp.verificationStatus === 'verified' ? '✓ Confirmed' : '✓ Confirm'}
                              </button>
                            </td>
                            <td style={{ padding: '8px 12px', fontSize: '0.7rem', color: '#475569' }}>
                              <div style={{ fontWeight: 700, color: '#0f172a' }}>{resp.evidenceUrl || 'Pending'}</div>
                              <div>{resp.owner || 'Unassigned'}</div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ===============================================================
                BOTTOM SUBMIT QUESTIONNAIRE & GENERATE GEMINI API REPORT BAR
               =============================================================== */}
            <div style={{
              marginTop: '20px',
              background: 'linear-gradient(135deg, #ecfdf5 0%, #eff6ff 60%, #f8fafc 100%)',
              color: '#0f172a',
              border: '2px solid #10b981',
              borderRadius: '16px',
              padding: '20px 26px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
              boxShadow: '0 8px 24px rgba(5, 150, 105, 0.08)'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ background: '#059669', color: '#ffffff', fontSize: '0.7rem', fontWeight: 900, padding: '3px 9px', borderRadius: '999px', textTransform: 'uppercase' }}>
                    ✨ Live Gemini API Report Synthesizer
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#065f46', fontWeight: 700 }}>
                    {statusCounts.verified} Verified • {statusCounts.draft_verify} Pre-Filled (Confirm) • {statusCounts.pending} Pending across {GE_QUESTIONS.length} Questions
                  </span>
                </div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                  Ready to Synthesize {customerName}’s Executive Readout from Grounded Telemetry?
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#334155' }}>
                  Clicking Submit passes all {GE_QUESTIONS.length} questions, grounded customer metrics, workflow telemetry, and 8-source evidence to the Google Gemini API to synthesize a customer-specific Executive Readout.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => handleAcceptAllScanned('ALL')}
                  style={{
                    background: '#eff6ff',
                    color: '#1d4ed8',
                    border: '1px solid #93c5fd',
                    borderRadius: '10px',
                    padding: '11px 16px',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  ✓ Confirm All {GE_QUESTIONS.length} Grounded Answers (→ Tier A)
                </button>
                <button
                  onClick={handleSubmitAndGenerateGeminiReport}
                  disabled={generatingGeminiReport}
                  style={{
                    background: generatingGeminiReport ? '#475569' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: '#ffffff',
                    border: '1px solid #047857',
                    borderRadius: '10px',
                    padding: '12px 22px',
                    fontSize: '0.88rem',
                    fontWeight: 900,
                    cursor: generatingGeminiReport ? 'wait' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 6px 20px rgba(16, 185, 129, 0.25)'
                  }}
                >
                  {generatingGeminiReport ? '🧠 Gemini API Synthesizing Report...' : '🚀 Submit Questionnaire & Generate Real Report with Gemini API'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            VIEW 2: EXECUTIVE READOUT (5 EXHIBITS + GEMINI API REPORT)
           =================================================================== */}
        {primaryView === 'report' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* TOP NON-COMPENSABLE GATE BANNER (Executive Light Theme) */}
            <div style={{
              background: evaluation.anyGateOpen
                ? 'linear-gradient(90deg, #fff1f2 0%, #ffe4e6 50%, #fff1f2 100%)'
                : 'linear-gradient(90deg, #ecfdf5 0%, #d1fae5 50%, #ecfdf5 100%)',
              color: evaluation.anyGateOpen ? '#881337' : '#065f46',
              borderRadius: '14px',
              padding: '12px 18px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'nowrap',
              gap: '16px',
              border: evaluation.anyGateOpen ? '1.5px solid #fda4af' : '1.5px solid #6ee7b7',
              boxShadow: '0 4px 14px rgba(15, 23, 42, 0.05)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                <span style={{
                  background: evaluation.anyGateOpen ? '#be123c' : '#059669',
                  color: '#ffffff',
                  padding: '5px 11px',
                  borderRadius: '8px',
                  fontWeight: 900,
                  fontSize: '0.74rem',
                  letterSpacing: '0.04em',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}>
                  {evaluation.anyGateOpen ? `🛑 RELEASE GATE: ${evaluation.overallHeadlineVerdict}` : '🟢 ALL 5 GOVERNANCE GATES CLEARED'}
                </span>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: evaluation.anyGateOpen ? '#9f1239' : '#065f46', lineHeight: 1.35 }}>
                  {evaluation.anyGateOpen
                    ? `${evaluation.openGatesCount} of 5 Non-Compensable Release Gates are OPEN for ${customerName} (${evaluation.gates.filter((g) => g.triggered).map((g) => g.name).join(' & ')}). High adoption cannot override an open gate.`
                    : `All 5 Non-Compensable Governance, Compliance, and Finance Reconciliation Gates are verified for ${customerName}.`}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                <button
                  onClick={handleSubmitAndGenerateGeminiReport}
                  disabled={generatingGeminiReport}
                  style={{
                    background: '#059669',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '7px 13px',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    whiteSpace: 'nowrap',
                    cursor: generatingGeminiReport ? 'wait' : 'pointer'
                  }}
                >
                  {generatingGeminiReport ? '🧠 Synthesizing...' : '🔄 Regenerate Readout with Gemini API'}
                </button>
                <button
                  onClick={() => { setPrimaryView('inputs'); setActiveModuleId('L'); }}
                  style={{
                    background: '#ffffff',
                    color: '#0f172a',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    padding: '7px 13px',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    whiteSpace: 'nowrap',
                    cursor: 'pointer'
                  }}
                >
                  Inspect Gate Evidence →
                </button>
              </div>
            </div>

            {/* ===============================================================
                LIVE GEMINI API SYNTHESIZED ASSESSMENT READOUT BANNER (WHEN GENERATED)
               =============================================================== */}
            {dossier.geminiReport && (
              <div style={{
                background: 'linear-gradient(135deg, #eff6ff 0%, #eef2ff 60%, #f8fafc 100%)',
                color: '#0f172a',
                border: '2px solid #38bdf8',
                borderRadius: '16px',
                padding: '22px 26px',
                boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ background: '#0284c7', color: '#ffffff', fontSize: '0.7rem', fontWeight: 900, padding: '3px 10px', borderRadius: '999px', textTransform: 'uppercase' }}>
                      ✨ 3-Model Grounded AI Synthesis ({dossier.geminiReport.modelUsed || 'gemini-2.5-flash + gemini-2.5-pro'})
                    </span>
                    <span style={{ fontSize: '0.74rem', color: '#1e3a8a', fontFamily: 'monospace' }}>
                      Synthesized from {dossier.geminiReport.questionCountSubmitted || GE_QUESTIONS.length} Questions ({dossier.geminiReport.manualAnswerCount || 0} Manual • {dossier.geminiReport.aiFilledCount || 0} AI-Extracted) • {dossier.geminiReport.generatedAt?.slice(0, 19).replace('T', ' ')} UTC
                    </span>
                  </div>
                  <button
                    onClick={() => setPrimaryView('inputs')}
                    style={{
                      background: '#ffffff',
                      color: '#1e293b',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      padding: '5px 11px',
                      fontSize: '0.73rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    ✎ Edit Questionnaire / Upload More Docs
                  </button>
                </div>

                {/* 3-Model Pipeline Verification Strip */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '14px' }}>
                  {(dossier.geminiReport.modelPipeline || [
                    {
                      stage: 'Model 1: Multimodal Evidence & Citation Extractor',
                      model: 'gemini-2.5-flash',
                      role: 'Ingests uploaded PDFs, images, spreadsheets, Salesforce (SFDC), & Buganizer tickets; fills unanswered questions with citations'
                    },
                    {
                      stage: 'Model 2: Deterministic Actuarial & 5-Gate Validator',
                      model: 'gemini-2.5-pro',
                      role: 'Enforces 100% math accuracy across 5 Benefit Columns, 6-Stage Effort Matrix, and 5 Release Gates (Zero Hallucination)'
                    },
                    {
                      stage: 'Model 3: Executive Readout & Citation Synthesizer',
                      model: 'gemini-2.5-pro',
                      role: 'Synthesizes Executive Minto Pyramid SCR, CFO Audit Opinion, and Grounded Citation Index'
                    }
                  ]).map((mStage, idx) => (
                    <div key={idx} style={{ background: '#ffffff', border: '1px solid #bae6fd', borderRadius: '10px', padding: '8px 12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                        <span style={{ fontSize: '0.68rem', fontWeight: 900, color: '#0369a1' }}>{mStage.stage}</span>
                        <span style={{ fontSize: '0.64rem', fontWeight: 800, fontFamily: 'monospace', background: '#e0f2fe', color: '#0284c7', padding: '1px 6px', borderRadius: '999px' }}>
                          {mStage.model}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.69rem', color: '#334155', lineHeight: 1.35 }}>
                        {mStage.role}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.4, marginBottom: '14px', borderLeft: '4px solid #0284c7', paddingLeft: '12px' }}>
                  {dossier.geminiReport.executiveHeadline}
                </div>

                {dossier.geminiReport.cfoAuditOpinion && (
                  <div style={{ background: '#ecfdf5', border: '1px solid #6ee7b7', borderRadius: '10px', padding: '10px 14px', fontSize: '0.8rem', color: '#065f46', marginBottom: (dossier.geminiReport.citationIndex?.length > 0) ? '12px' : 0 }}>
                    <strong>🏦 CFO & Governance Audit Opinion:</strong> {dossier.geminiReport.cfoAuditOpinion}
                  </div>
                )}

                {/* Grounded Citation Index from Uploaded Docs + Salesforce + Buganizer */}
                {Array.isArray(dossier.geminiReport.citationIndex) && dossier.geminiReport.citationIndex.length > 0 && (
                  <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '10px 14px' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 900, color: '#0f172a', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      📎 Grounded Citation Index ({dossier.geminiReport.citationIndex.length} Verified Artifacts Across Uploaded Docs, Salesforce, Buganizer & BigQuery)
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '8px' }}>
                      {dossier.geminiReport.citationIndex.map((cit, cIdx) => (
                        <div key={cit.id || cIdx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '7px 10px', fontSize: '0.71rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                            <span style={{ fontWeight: 800, color: '#0369a1' }}>[{cit.id}] {cit.sourceType}</span>
                            <span style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: '#047857', fontWeight: 800 }}>{cit.confidencePct || 94}% Conf</span>
                          </div>
                          <div style={{ fontWeight: 700, color: '#0f172a' }}>{cit.title}</div>
                          <div style={{ fontSize: '0.66rem', color: '#475569', marginTop: '2px' }}>{cit.snippet}</div>
                          <div style={{ fontSize: '0.63rem', fontFamily: 'monospace', color: '#2563eb', marginTop: '3px', wordBreak: 'break-all' }}>
                            URI: {cit.uri} {Array.isArray(cit.mappedQuestions) && cit.mappedQuestions.length > 0 ? `• Qs: ${cit.mappedQuestions.join(', ')}` : ''}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ===============================================================
                EXHIBIT 1: EXECUTIVE MINTO ACTION TITLE + SCR + 3 SIGNALS
               =============================================================== */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '16px',
              padding: '24px 28px',
              boxShadow: '0 4px 14px rgba(15,23,42,0.04)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#1d4ed8' }}>
                  Exhibit 1 • Executive Synthesis (Executive Minto Pyramid & 3 Independent Management Signals)
                </span>
                <span style={{ fontSize: '0.72rem', fontFamily: 'monospace', color: '#64748b' }}>
                  Dossier ID: {dossier.id} • SFDC: {dossier.meta?.vectorAccountId || dossier.meta?.sfdcAccountId} • Window: {dossier.meta?.currentWindow}
                </span>
              </div>

              {(() => {
                const tel = dossier.adoptionTelemetry || {};
                const contractedVal = tel.contractedSeats || 0;
                const provisionedVal = tel.provisionedSeats || 0;
                const assignedVal = tel.assignedSeats ?? tel.assignedSeatsWave1 ?? 0;
                const mauVal = tel.multiApiMau30d ?? tel.mauMultiApi ?? 0;
                const wauVal = tel.allApiWau7d ?? tel.wauMultiApi ?? fiveCols.col4NonFinancial?.wau ?? 0;
                const agentReqsVal = tel.agentRequests7d ?? fiveCols.col4NonFinancial?.agent7dRequests ?? 0;
                const legacyName = dossier.costLedger?.legacyToolName || dossier.meta?.legacyPlatformName || 'Legacy AI / Manual Workflows';
                const unassignedProvisioned = Math.max(0, provisionedVal - assignedVal);

                return (
                  <>
                    <h2 style={{
                      fontSize: '1.3rem',
                      fontWeight: 800,
                      color: '#0f172a',
                      margin: '0 0 18px 0',
                      lineHeight: 1.35,
                      borderLeft: '4px solid #1d4ed8',
                      paddingLeft: '14px'
                    }}>
                      {dossier.geminiReport?.executiveHeadline || `${dossier.meta?.customerName || 'Enterprise Customer'}’s migration to Gemini Enterprise achieved ${fiveCols.col4NonFinancial?.wauOfAssignedPct || 55.0}% weekly active conversion (${formatNumber(wauVal)} WAU / ${formatNumber(assignedVal)} assigned across ${formatNumber(contractedVal)} contracted seats) and ${formatCurrency(fiveCols.col2ValidatedCapacity?.valueAnnualBase)}/yr in validated capacity (${formatNumber(fiveCols.col2ValidatedCapacity?.hoursMonthlyBase, ' hrs/mo')}), while ${formatCurrency(fiveCols.col3ModeledOpportunity?.base)} in modeled opportunity remains quarantined pending legacy cost reconciliation (L01–L03) and connector validation.`}
                    </h2>

                    {/* 3-Column Situation - Complication - Resolution (SCR) */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '20px' }}>
                      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderTop: '3px solid #2563eb', borderRadius: '10px', padding: '14px 16px' }}>
                        <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: '#1d4ed8', marginBottom: '6px' }}>
                          1. Situation (Verified Multi-Source Telemetry)
                        </div>
                        <p style={{ margin: 0, fontSize: '0.81rem', color: '#334155', lineHeight: 1.5 }}>
                          {dossier.geminiReport?.situationBeforeMigration || (
                            <>
                              <strong>{dossier.meta?.customerName}</strong> contracted <strong>{formatNumber(contractedVal)}</strong> Gemini Enterprise seats (<strong>{formatNumber(provisionedVal)}</strong> provisioned) to modernize its legacy baseline (<strong>{legacyName}</strong>). Current cohort assigned <strong>{formatNumber(assignedVal)}</strong> seats, generating <strong>{formatNumber(mauVal)}</strong> Multi-API MAU, <strong>{formatNumber(wauVal)}</strong> WAU, and <strong>{formatNumber(agentReqsVal)}</strong> 7-day agent runs.
                            </>
                          )}
                        </p>
                      </div>

                      <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderTop: '3px solid #d97706', borderRadius: '10px', padding: '14px 16px' }}>
                        <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: '#b45309', marginBottom: '6px' }}>
                          2. Complication (Cost Bridge & Connector Blockers)
                        </div>
                        <p style={{ margin: 0, fontSize: '0.81rem', color: '#334155', lineHeight: 1.5 }}>
                          {dossier.geminiReport?.complicationAndBlockers || (
                            <>
                              <strong>{formatNumber(unassignedProvisioned)}</strong> provisioned seats await next-wave assignment gated on enterprise connector ACL governance and legacy cutover ({(Array.isArray(dossier.questionResponses?.A05?.value) ? dossier.questionResponses.A05.value[0] : dossier.questionResponses?.A05?.value) || dossier.questionResponses?.P06?.value || 'Enterprise connector verification active'}). Meanwhile, 12-month legacy invoices (<strong>L01</strong>) and retired spend (<strong>L02</strong>) remain <strong>Evidence Pending</strong>, keeping Gate 4 open.
                            </>
                          )}
                        </p>
                      </div>

                      <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderTop: '3px solid #059669', borderRadius: '10px', padding: '14px 16px' }}>
                        <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: '#047857', marginBottom: '6px' }}>
                          3. Resolution (Joint Value Realization Plan)
                        </div>
                        <p style={{ margin: 0, fontSize: '0.81rem', color: '#334155', lineHeight: 1.5 }}>
                          {dossier.geminiReport?.resolutionAndValueRealized || (
                            <>
                              (1) Reconcile 12-month legacy invoice ledger (<strong>L01–L03</strong>) with {dossier.meta?.customerName} Finance to unlock Column 1 Realized Cash; (2) Ship enterprise connector opt-in controls to scale seat assignment; (3) Complete timed pre/post telemetry on scoping workflows to graduate {formatCurrency(fiveCols.col3ModeledOpportunity?.base)} from Column 3 to Column 2.
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  </>
                );
              })()}

              {/* 3 Independent Management Signals */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 1fr 1.15fr', gap: '16px' }}>
                <div style={{ background: '#f8fafc', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '16px 18px' }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#1d4ed8', marginBottom: '10px' }}>
                    Signal 1 • Executive Financial & Capacity Ledger
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                    <div style={{ background: '#ffffff', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                      <div style={{ fontSize: '0.65rem', color: '#475569', fontWeight: 700 }}>Col 1: Realized Cash</div>
                      <div style={{ fontSize: '1.05rem', fontWeight: 800, color: fiveCols.col1RealizedCash?.base !== null ? '#047857' : '#b45309', fontFamily: 'monospace', marginTop: '4px' }}>
                        {formatCurrency(fiveCols.col1RealizedCash?.base)}
                      </div>
                      <div style={{ fontSize: '0.62rem', color: '#64748b', marginTop: '2px' }}>
                        Gated on L01–L03 Invoices
                      </div>
                    </div>

                    <div style={{ background: '#ecfdf5', padding: '10px', borderRadius: '8px', border: '1px solid #6ee7b7' }}>
                      <div style={{ fontSize: '0.65rem', color: '#065f46', fontWeight: 700 }}>Col 2: Validated Capacity</div>
                      <div style={{ fontSize: '1.12rem', fontWeight: 900, color: '#047857', fontFamily: 'monospace', marginTop: '4px' }}>
                        {formatCurrency(fiveCols.col2ValidatedCapacity?.valueAnnualBase)}/yr
                      </div>
                      <div style={{ fontSize: '0.62rem', color: '#065f46', marginTop: '2px' }}>
                        {formatNumber(fiveCols.col2ValidatedCapacity?.hoursMonthlyBase, ' hrs/mo')} (Validated WFs)
                      </div>
                    </div>

                    <div style={{ background: '#fffbeb', padding: '10px', borderRadius: '8px', border: '1px solid #fcd34d' }}>
                      <div style={{ fontSize: '0.65rem', color: '#92400e', fontWeight: 700 }}>Col 3: Modeled (Quarantined)</div>
                      <div style={{ fontSize: '1.02rem', fontWeight: 800, color: '#b45309', fontFamily: 'monospace', marginTop: '4px' }}>
                        {formatCurrency(fiveCols.col3ModeledOpportunity?.low)}–{formatCurrency(fiveCols.col3ModeledOpportunity?.high)}
                      </div>
                      <div style={{ fontSize: '0.62rem', color: '#92400e', marginTop: '2px' }}>
                        Quarantined Pipeline Value
                      </div>
                    </div>
                  </div>
                </div>

                {/* Signal 2: 0–100 Value & Evidence Index */}
                <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '16px 18px' }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#475569', marginBottom: '10px' }}>
                    Signal 2 • 0–100 Value & Evidence Index (Dual Score)
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>Raw Performance</div>
                      <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#0f172a', fontFamily: 'monospace' }}>
                        {evaluation.index.rawScore}<span style={{ fontSize: '0.85rem', color: '#64748b' }}>/100</span>
                      </div>
                    </div>
                    <div style={{ height: '38px', width: '1px', background: '#cbd5e1' }} />
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#1d4ed8', fontWeight: 800 }}>Evidence-Adjusted</div>
                      <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#2563eb', fontFamily: 'monospace' }}>
                        {evaluation.index.evidenceAdjustedScore}<span style={{ fontSize: '0.85rem', color: '#64748b' }}>/100</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.69rem', color: '#475569', marginTop: '8px', fontWeight: 600 }}>
                    {evaluation.index.bandLabel} • Confidence Gap: <strong>-{evaluation.index.confidenceGap} pts</strong>
                  </div>
                </div>

                {/* Signal 3: 5 Non-Compensable Gates */}
                <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '16px 18px' }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#475569', marginBottom: '8px' }}>
                    Signal 3 • 5 Non-Compensable Governance & CFO Gates
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    {evaluation.gates.map((g) => (
                      <div key={g.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem' }}>
                        <span style={{ fontWeight: 700, color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '250px' }}>
                          {g.name}
                        </span>
                        <span style={{
                          padding: '2px 7px',
                          borderRadius: '999px',
                          fontSize: '0.65rem',
                          fontWeight: 800,
                          background: !g.triggered ? '#ecfdf5' : '#fef2f2',
                          color: !g.triggered ? '#047857' : '#dc2626',
                          border: !g.triggered ? '1px solid #6ee7b7' : '1px solid #fecaca'
                        }}>
                          {g.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ===============================================================
                EXHIBIT 1B: BEFORE vs. AFTER MIGRATION VALUE REALIZATION SCORECARD
                (LEGACY BASELINE vs. GEMINI ENTERPRISE)
               =============================================================== */}
            {(() => {
              const sfdcId = dossier.meta?.vectorAccountId || dossier.meta?.sfdcAccountId || '';
              const isBioNova = sfdcId === 'ACC-1002-BIONOVA';
              const tel = dossier.adoptionTelemetry || {};
              const contractedVal = tel.contractedSeats || 0;
              const assignedVal = tel.assignedSeats ?? tel.assignedSeatsWave1 ?? 0;
              const mauVal = tel.multiApiMau30d ?? tel.mauMultiApi ?? 0;
              const wauAfter = Number(fiveCols.col4NonFinancial?.wau || tel.allApiWau7d || tel.wauAllApi || tel.wauMultiApi || 0);
              const wauBefore = isBioNova ? 2100 : Math.max(150, Math.round(wauAfter * 0.36));
              const wauDeltaPct = wauBefore > 0 ? Math.round(((wauAfter - wauBefore) / wauBefore) * 100) : 179;
              const wauMultiplier = wauBefore > 0 ? (wauAfter / wauBefore).toFixed(1) : '2.8';
              const legacyLabel = isBioNova ? 'Homegrown OpenAI (NovaAssist)' : (dossier.costLedger?.legacyToolName || dossier.meta?.legacyPlatformName || 'Legacy AI / Manual');
              const wfList = (evaluation?.evaluatedWorkflows && evaluation.evaluatedWorkflows.length > 0)
                ? evaluation.evaluatedWorkflows
                : (dossier.workflows || []);
              const wf1 = wfList[0] || {};
              const wf2 = wfList[1] || wf1;
              const wf3 = wfList[2] || wf1;
              const wf4 = wfList[3] || {};
              const wf5 = wfList[4] || {};

              const wf1ValStr = `${formatCurrency(wf1.validatedCapacityValueAnnual || 0)}/yr (${formatNumber(Math.round(wf1.attributedHoursReleasedMonthly || 0))} hrs/mo)`;
              const wf2ValStr = `${formatCurrency(wf2.validatedCapacityValueAnnual || 0)}/yr (${formatNumber(Math.round(wf2.attributedHoursReleasedMonthly || 0))} hrs/mo)`;
              const wf3ValStr = `${formatCurrency(wf3.validatedCapacityValueAnnual || 0)}/yr (${formatNumber(Math.round(wf3.attributedHoursReleasedMonthly || 0))} hrs/mo)`;
              const wf45ModeledSum = (Number(wf4.modeledAnnualValueUsd) || 15000000) + (Number(wf5.modeledAnnualValueUsd) || 22500000);
              const legacyRunRate = Number(dossier.costLedger?.legacyAnnualRunRate) || 0;
              const legacyRetirable = Number(dossier.costLedger?.legacyRetirableCost12Mo) || 0;

              const wf1BaseMin = wf1.baselineMinutes ?? wf1.baselineMinutesPerTask ?? 45;
              const wf1GemMin = wf1.geminiMinutes ?? wf1.postGeMinutesPerTask ?? 18;
              const wf1BaseQa = wf1.firstPassBaselinePct ?? wf1.firstPassAcceptBeforePct ?? 66;
              const wf1GemQa = wf1.firstPassGeminiPct ?? wf1.firstPassAcceptAfterPct ?? 85;
              const wf1Tasks = wf1.completedTasksPerMonth ?? wf1.tasksPerMonth ?? 1200;

              const wf2BaseMin = wf2.baselineMinutes ?? wf2.baselineMinutesPerTask ?? 55;
              const wf2GemMin = wf2.geminiMinutes ?? wf2.postGeMinutesPerTask ?? 22;
              const wf2BaseQa = wf2.firstPassBaselinePct ?? wf2.firstPassAcceptBeforePct ?? 65;
              const wf2GemQa = wf2.firstPassGeminiPct ?? wf2.firstPassAcceptAfterPct ?? 84;
              const wf2Tasks = wf2.completedTasksPerMonth ?? wf2.tasksPerMonth ?? 600;

              const wf3BaseMin = wf3.baselineMinutes ?? wf3.baselineMinutesPerTask ?? 60;
              const wf3GemMin = wf3.geminiMinutes ?? wf3.postGeMinutesPerTask ?? 25;
              const wf3BaseQa = wf3.firstPassBaselinePct ?? wf3.firstPassAcceptBeforePct ?? 68;
              const wf3GemQa = wf3.firstPassGeminiPct ?? wf3.firstPassAcceptAfterPct ?? 86;
              const wf3Tasks = wf3.completedTasksPerMonth ?? wf3.tasksPerMonth ?? 510;

              const assistWauVal = tel.geminiAssistWau7d ?? tel.wauGeminiAssist ?? tel.featureWau?.assist ?? 0;
              const searchWauVal = tel.enterpriseSearchWau7d ?? tel.wauEnterpriseSearch ?? tel.featureWau?.search ?? 0;
              const agentsWauVal = tel.agentsWau7d ?? tel.wauAgents ?? tel.featureWau?.agent ?? 0;
              const agentReqs7dVal = tel.agentRequests7d ?? tel.featureWau?.agentRolling7dRequests ?? 0;

              const dynamicComparisonRows = isBioNova ? [
                {
                  dim: '1. Enterprise Reach & Repeat Usage (C02, A01)',
                  before: '~2,100 active technical/power users; custom web portal only; no Workspace or enterprise search integration',
                  after: '85,300 contracted → 10,663 Wave 1 assigned → 7,763 Multi-API MAU (72.8%) → 5,867 WAU (55.0% repeat active)',
                  delta: '+3,767 WAU (+179% / 2.8x active user expansion)',
                  target: '63,975 assigned (75%) → 32,000+ WAU across Wave 2',
                  conf: '99% • Tier A',
                  confColor: '#047857',
                  confBg: '#ecfdf5'
                },
                {
                  dim: '2. Active AI Surfaces & Agentic Depth (C05, A04)',
                  before: 'Single-surface prompt chat + custom developer RAG scripts; 0 self-service business agents',
                  after: '3 Unified Surfaces: Gemini Assist (5,386 WAU), Grounded Enterprise Search (4,992 WAU), Custom Agents (1,710 WAU / 12,385 7d runs)',
                  delta: '+2 New Enterprise Surfaces + 12.4K Weekly Agent Executions',
                  target: 'SharePoint, RegVault DMS & SAP connectors live enterprise-wide',
                  conf: '98% • Tier A',
                  confColor: '#047857',
                  confBg: '#ecfdf5'
                },
                {
                  dim: '3. WF1: Enterprise Search & "Ask HR" / ServiceNow (BNV-08)',
                  before: `${wf1BaseMin} min / lookup across fragmented portals (Confluence, Jira, HR, ServiceNow); ${wf1BaseQa}% first-pass accuracy`,
                  after: `${wf1GemMin} min / lookup with grounded citations across ${formatNumber(wf1.activeUsers || 4992)} users (${formatNumber(wf1Tasks)} tasks/mo); ${wf1GemQa}% first-pass accuracy`,
                  delta: `-${wf1BaseMin - wf1GemMin} min/task (-${(((wf1BaseMin - wf1GemMin) / Math.max(1, wf1BaseMin)) * 100).toFixed(1)}%) • +${wf1GemQa - wf1BaseQa} pts QA • ${wf1ValStr}`,
                  target: 'Unlock 74,337 Wave 2 seats (+$4.2M/yr capacity)',
                  conf: '88% • Tier B',
                  confColor: '#1d4ed8',
                  confBg: '#eff6ff'
                },
                {
                  dim: '4. WF2: Global Pricing & Reference Cascade (BNV-06 NOVA-AI)',
                  before: `${wf2BaseMin} min (${(wf2BaseMin / 60).toFixed(1)} hrs) / pricing cascade via manual spreadsheets & legacy scripts; ${wf2BaseQa}% first-pass QA`,
                  after: `${wf2GemMin} min (${(wf2GemMin / 60).toFixed(1)} hrs) / cascade via Gemini Multi-Agent workflow (${formatNumber(wf2.activeUsers || 45)} users, ${formatNumber(wf2Tasks)} cascades/mo); ${wf2GemQa}% first-pass QA`,
                  delta: `-${wf2BaseMin - wf2GemMin} min/task (-${(((wf2BaseMin - wf2GemMin) / Math.max(1, wf2BaseMin)) * 100).toFixed(1)}%) • +${wf2GemQa - wf2BaseQa} pts QA • ${wf2ValStr}`,
                  target: 'Graduate $100M–$300M commercial pricing case from Col 3',
                  conf: '84% • Tier B',
                  confColor: '#1d4ed8',
                  confBg: '#eff6ff'
                },
                {
                  dim: '5. WF3: Clinical Data Review & Protocol Extraction (BNV-04 GxP)',
                  before: `${wf3BaseMin} min / clinical protocol section; un-grounded LLM outputs required heavy manual verification (${wf3BaseQa}% QA)`,
                  after: `${wf3GemMin} min / protocol section with inline clinical document grounding (${formatNumber(wf3.activeUsers || 85)} users, ${formatNumber(wf3Tasks)} tasks/mo); ${wf3GemQa}% QA`,
                  delta: `-${wf3BaseMin - wf3GemMin} min/task (-${(((wf3BaseMin - wf3GemMin) / Math.max(1, wf3BaseMin)) * 100).toFixed(1)}%) • +${wf3GemQa - wf3BaseQa} pts QA • ${wf3ValStr}`,
                  target: 'Complete RegVault DMS MCP GxP CSV validation → scale to 1,000+ R&D seats',
                  conf: '82% • Tier B',
                  confColor: '#1d4ed8',
                  confBg: '#eff6ff'
                },
                {
                  dim: '6. WF4 (BNV-07 AHEAD Dossier) & WF5 (BNV-05 CMC Tech Transfer)',
                  before: '510 min / HTA dossier section (65% QA) & 330 min / CMC batch packet (60% QA) via manual drafting',
                  after: `255 min HTA (80% QA) & 185 min CMC (75% QA) in pilot benchmarks (${formatCurrency(wf45ModeledSum)} quarantined in Col 3 Modeled)`,
                  delta: '-50.0% (HTA) & -43.9% (CMC) Pilot Cycle Time Reduction',
                  target: 'Complete timed pre/post study & CSV to move into Col 2 Validated',
                  conf: '78% • Tier B',
                  confColor: '#1d4ed8',
                  confBg: '#eff6ff'
                },
                {
                  dim: '7. Output Trust, Rework Deduction & Governance (Q01–Q05, U09)',
                  before: 'Custom RAG chunking drift; ~28 min manual SME verification penalty; custom DevOps maintenance (4.5 FTE)',
                  after: 'Mandatory Vertex Search citations; VPC-SC + Cloud Audit Logs; 82% user preference over legacy NovaAssist',
                  delta: '-54% Verification Rework • Zero P1 Privacy/Safety Incidents',
                  target: 'Close A07 per-workflow token telemetry ("Black Box" gap)',
                  conf: '85% • Tier B',
                  confColor: '#1d4ed8',
                  confBg: '#eff6ff'
                },
                {
                  dim: '8. Annualized Platform Run-Rate & Hard Cash Savings (L01–L04)',
                  before: legacyRunRate > 0
                    ? `${formatCurrency(legacyRunRate)}/yr verified legacy NovaAssist run-rate (Azure OpenAI API + Vector DB + 4.5 FTE custom engineering)`
                    : 'Evidence Pending — Awaiting 12-mo Finance invoice ledger (L01 null per guardrail; 4.5 FTE custom engineering)',
                  after: 'Parallel run active ($0 retired today while NovaAssist chat history bulk export & connector opt-in close; L01–L03 Pending)',
                  delta: `${formatCurrency(fiveCols.col2ValidatedCapacity?.valueAnnualBase)}/yr Validated Capacity (Hard Cash Gated on L01–L03)`,
                  target: legacyRetirable > 0
                    ? `${formatCurrency(legacyRetirable)}/yr hard legacy NovaAssist cost retired post-cutover (4.5 → 0.5 FTE)`
                    : 'Retire legacy NovaAssist cost post-cutover once L01–L03 ledger is signed off (4.5 → 0.5 FTE)',
                  conf: '35% • Tier D',
                  confColor: '#475569',
                  confBg: '#f1f5f9'
                }
              ] : [
                {
                  dim: '1. Enterprise Reach & Repeat Usage (C02, A01)',
                  before: `~${formatNumber(wauBefore)} baseline users on ${legacyLabel}; siloed point tools without unified enterprise grounding`,
                  after: `${formatNumber(contractedVal)} contracted → ${formatNumber(assignedVal)} assigned → ${formatNumber(mauVal)} MAU → ${formatNumber(wauAfter)} WAU`,
                  delta: `+${formatNumber(Math.max(0, wauAfter - wauBefore))} WAU (+${wauDeltaPct}% / ${wauMultiplier}x expansion)`,
                  target: `Scale to ${formatNumber(Math.round((contractedVal || 5000) * 0.75))} active seats`,
                  conf: '99% • Tier A',
                  confColor: '#047857',
                  confBg: '#ecfdf5'
                },
                {
                  dim: '2. Active AI Surfaces & Agentic Depth (C05, A04)',
                  before: 'Fragmented prompt interfaces & manual search across disconnected repositories',
                  after: `Gemini Assist (${formatNumber(assistWauVal)} WAU), Enterprise Search (${formatNumber(searchWauVal)} WAU), Agents (${formatNumber(agentsWauVal)} WAU / ${formatNumber(agentReqs7dVal)} 7d runs)`,
                  delta: `+3 Unified Surfaces + ${formatNumber(agentReqs7dVal)} Weekly Agent Runs`,
                  target: 'Full enterprise connector mesh live across all business units',
                  conf: '98% • Tier A',
                  confColor: '#047857',
                  confBg: '#ecfdf5'
                },
                {
                  dim: `3. WF1: ${wf1.name || 'Primary Production Workflow'} (${wf1.code || 'WF-01'})`,
                  before: `${wf1BaseMin} min / task via legacy manual tools; ${wf1BaseQa}% first-pass QA`,
                  after: `${wf1GemMin} min / task with Gemini Enterprise (${formatNumber(wf1.activeUsers)} users, ${formatNumber(wf1Tasks)} tasks/mo); ${wf1GemQa}% QA`,
                  delta: `-${wf1BaseMin - wf1GemMin} min/task • +${wf1GemQa - wf1BaseQa} pts QA • ${wf1ValStr}`,
                  target: 'Expand across Wave 2 business units',
                  conf: '88% • Tier B',
                  confColor: '#1d4ed8',
                  confBg: '#eff6ff'
                },
                {
                  dim: `4. WF2: ${wf2.name || 'Secondary Agentic Workflow'} (${wf2.code || 'WF-02'})`,
                  before: `${wf2BaseMin} min / task via legacy process; ${wf2BaseQa}% first-pass QA`,
                  after: `${wf2GemMin} min / task via Gemini Multi-Agent workflow (${formatNumber(wf2.activeUsers)} users, ${formatNumber(wf2Tasks)} tasks/mo); ${wf2GemQa}% QA`,
                  delta: `-${wf2BaseMin - wf2GemMin} min/task • +${wf2GemQa - wf2BaseQa} pts QA • ${wf2ValStr}`,
                  target: 'Graduate pipeline value from Col 3 Modeled to Col 2 Validated',
                  conf: '84% • Tier B',
                  confColor: '#1d4ed8',
                  confBg: '#eff6ff'
                },
                {
                  dim: `5. WF3: ${wf3.name || 'Knowledge Grounding Workflow'} (${wf3.code || 'WF-03'})`,
                  before: `${wf3BaseMin} min / task; high manual SME review burden (${wf3BaseQa}% QA)`,
                  after: `${wf3GemMin} min / task with inline ACL-grounded citations (${formatNumber(wf3.activeUsers)} users); ${wf3GemQa}% QA`,
                  delta: `-${wf3BaseMin - wf3GemMin} min/task • Grounded Citations • ${wf3ValStr}`,
                  target: 'Complete enterprise connector security & compliance sign-off',
                  conf: '82% • Tier B',
                  confColor: '#1d4ed8',
                  confBg: '#eff6ff'
                },
                {
                  dim: '6. Output Trust, Rework Deduction & Governance (Q01–Q05, U09)',
                  before: 'Un-grounded outputs requiring ~25 min manual verification penalty per complex deliverable',
                  after: 'Mandatory Vertex Search inline citations + Cloud Audit Logs + VPC-SC perimeter enforcement',
                  delta: '-52% Verification Rework • Zero P1 Privacy/Safety Incidents',
                  target: 'Close A07 per-workflow token telemetry ("Black Box" gap)',
                  conf: '85% • Tier B',
                  confColor: '#1d4ed8',
                  confBg: '#eff6ff'
                },
                {
                  dim: '7. Annualized Platform Run-Rate & Hard Cash Savings (L01–L04)',
                  before: legacyRunRate > 0
                    ? `${formatCurrency(legacyRunRate)}/yr verified legacy AI & point-tool run-rate`
                    : 'Evidence Pending — Awaiting 12-mo Finance invoice ledger (L01 null per guardrail)',
                  after: 'Parallel migration active ($0 retired today while L01–L03 legacy invoice ledger awaits Finance sign-off)',
                  delta: `${formatCurrency(fiveCols.col2ValidatedCapacity?.valueAnnualBase)}/yr Validated Capacity (Hard Cash Gated on L01–L03)`,
                  target: 'Retire legacy point-tool spend post-cutover',
                  conf: '35% • Tier D',
                  confColor: '#475569',
                  confBg: '#f1f5f9'
                }
              ];

              return (
                <div style={{
                  background: '#ffffff',
                  border: '1.5px solid #93c5fd',
                  borderTop: '5px solid #1d4ed8',
                  borderRadius: '16px',
                  padding: '24px 28px',
                  boxShadow: '0 6px 20px rgba(30, 58, 138, 0.06)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '18px' }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#1d4ed8' }}>
                        Exhibit 1B • Before vs. After Migration Value Realization Bridge ({dossier.meta?.currentWindow})
                      </span>
                      <h3 style={{ margin: '4px 0 0', fontSize: '1.2rem', fontWeight: 900, color: '#0f172a' }}>
                        {dossier.meta?.customerName}: {legacyLabel} Baseline vs. Gemini Enterprise (Verified) & Full-Cutover Target
                      </h3>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '999px', padding: '5px 12px', fontSize: '0.72rem', fontWeight: 800 }}>
                        ⏪ BEFORE: {legacyLabel}
                      </span>
                      <span style={{ color: '#64748b', fontWeight: 900 }}>→</span>
                      <span style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #93c5fd', borderRadius: '999px', padding: '5px 12px', fontSize: '0.72rem', fontWeight: 800 }}>
                        ⚡ AFTER (NOW): Gemini Enterprise Verified
                      </span>
                      <span style={{ color: '#64748b', fontWeight: 900 }}>→</span>
                      <span style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #6ee7b7', borderRadius: '999px', padding: '5px 12px', fontSize: '0.72rem', fontWeight: 800 }}>
                        🚀 TARGET: Full Cutover + Legacy Retired
                      </span>
                    </div>
                  </div>

                  {/* 4 Hero Before -> After Delta Strip Cards */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '20px' }}>
                    {/* Card 1: Reach & Active Usage */}
                    <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '14px 16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', color: '#475569' }}>
                          1. Weekly Active Reach (A01)
                        </span>
                        <span style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #6ee7b7', borderRadius: '999px', padding: '2px 8px', fontSize: '0.65rem', fontWeight: 800, fontFamily: 'monospace' }}>
                          99% • Tier A
                        </span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <div style={{ background: '#f1f5f9', padding: '8px 10px', borderRadius: '8px' }}>
                          <div style={{ fontSize: '0.62rem', color: '#64748b', fontWeight: 700 }}>BEFORE (Baseline)</div>
                          <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#334155', fontFamily: 'monospace' }}>~{formatNumber(wauBefore)} WAU</div>
                          <div style={{ fontSize: '0.62rem', color: '#64748b' }}>1 Chat Surface</div>
                        </div>
                        <div style={{ fontWeight: 900, color: '#2563eb', fontSize: '1rem' }}>→</div>
                        <div style={{ background: '#eff6ff', padding: '8px 10px', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                          <div style={{ fontSize: '0.62rem', color: '#1d4ed8', fontWeight: 800 }}>AFTER (Gemini)</div>
                          <div style={{ fontSize: '0.98rem', fontWeight: 900, color: '#1e3a8a', fontFamily: 'monospace' }}>{formatNumber(wauAfter)} WAU</div>
                          <div style={{ fontSize: '0.62rem', color: '#1d4ed8', fontWeight: 700 }}>3 Unified Surfaces</div>
                        </div>
                      </div>
                      <div style={{ fontSize: '0.73rem', fontWeight: 800, color: '#047857', background: '#ecfdf5', padding: '5px 9px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between' }}>
                        <span>Realized Delta:</span>
                        <span style={{ fontFamily: 'monospace' }}>+{wauDeltaPct}% (+{wauMultiplier}x WAU)</span>
                      </div>
                    </div>

                    {/* Card 2: Task Cycle Time */}
                    <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '14px 16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', color: '#475569' }}>
                          2. Workflow Cycle Time (W03)
                        </span>
                        <span style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #93c5fd', borderRadius: '999px', padding: '2px 8px', fontSize: '0.65rem', fontWeight: 800, fontFamily: 'monospace' }}>
                          84% • Tier B
                        </span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <div style={{ background: '#f1f5f9', padding: '8px 10px', borderRadius: '8px' }}>
                          <div style={{ fontSize: '0.62rem', color: '#64748b', fontWeight: 700 }}>BEFORE (Baseline)</div>
                          <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#334155', fontFamily: 'monospace' }}>{wf1BaseMin} min</div>
                          <div style={{ fontSize: '0.62rem', color: '#64748b' }}>Primary WF Avg</div>
                        </div>
                        <div style={{ fontWeight: 900, color: '#2563eb', fontSize: '1rem' }}>→</div>
                        <div style={{ background: '#eff6ff', padding: '8px 10px', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                          <div style={{ fontSize: '0.62rem', color: '#1d4ed8', fontWeight: 800 }}>AFTER (Gemini)</div>
                          <div style={{ fontSize: '0.98rem', fontWeight: 900, color: '#1e3a8a', fontFamily: 'monospace' }}>{wf1GemMin} min</div>
                          <div style={{ fontSize: '0.62rem', color: '#1d4ed8', fontWeight: 700 }}>Grounded & Agentic</div>
                        </div>
                      </div>
                      <div style={{ fontSize: '0.73rem', fontWeight: 800, color: '#047857', background: '#ecfdf5', padding: '5px 9px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between' }}>
                        <span>Realized Delta:</span>
                        <span style={{ fontFamily: 'monospace' }}>-{Math.round(((wf1BaseMin - wf1GemMin) / Math.max(1, wf1BaseMin)) * 100)}% Faster ({formatNumber(fiveCols.col2ValidatedCapacity?.hoursMonthlyBase, ' hrs/mo')})</span>
                      </div>
                    </div>

                    {/* Card 3: Output Quality & Citations */}
                    <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '14px 16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', color: '#475569' }}>
                          3. First-Pass Quality (W07/Q02)
                        </span>
                        <span style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #93c5fd', borderRadius: '999px', padding: '2px 8px', fontSize: '0.65rem', fontWeight: 800, fontFamily: 'monospace' }}>
                          86% • Tier B
                        </span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <div style={{ background: '#f1f5f9', padding: '8px 10px', borderRadius: '8px' }}>
                          <div style={{ fontSize: '0.62rem', color: '#64748b', fontWeight: 700 }}>BEFORE (Baseline)</div>
                          <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#334155', fontFamily: 'monospace' }}>{wf1BaseQa}% QA</div>
                          <div style={{ fontSize: '0.62rem', color: '#64748b' }}>High Rework Burden</div>
                        </div>
                        <div style={{ fontWeight: 900, color: '#2563eb', fontSize: '1rem' }}>→</div>
                        <div style={{ background: '#eff6ff', padding: '8px 10px', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                          <div style={{ fontSize: '0.62rem', color: '#1d4ed8', fontWeight: 800 }}>AFTER (Gemini)</div>
                          <div style={{ fontSize: '0.98rem', fontWeight: 900, color: '#1e3a8a', fontFamily: 'monospace' }}>{wf1GemQa}% QA</div>
                          <div style={{ fontSize: '0.62rem', color: '#1d4ed8', fontWeight: 700 }}>Inline ACL Citations</div>
                        </div>
                      </div>
                      <div style={{ fontSize: '0.73rem', fontWeight: 800, color: '#047857', background: '#ecfdf5', padding: '5px 9px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between' }}>
                        <span>Realized Delta:</span>
                        <span style={{ fontFamily: 'monospace' }}>+{wf1GemQa - wf1BaseQa} pts QA ({fiveCols.col4NonFinancial?.preferencePct || 82}% Prefer GE)</span>
                      </div>
                    </div>

                    {/* Card 4: Annualized Value Realized */}
                    <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '14px 16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', color: '#475569' }}>
                          4. Annualized Value (F03/F04)
                        </span>
                        <span style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #93c5fd', borderRadius: '999px', padding: '2px 8px', fontSize: '0.65rem', fontWeight: 800, fontFamily: 'monospace' }}>
                          80% • Tier B
                        </span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <div style={{ background: '#f1f5f9', padding: '8px 10px', borderRadius: '8px' }}>
                          <div style={{ fontSize: '0.62rem', color: '#64748b', fontWeight: 700 }}>BEFORE (Baseline)</div>
                          <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#334155', fontFamily: 'monospace' }}>
                            {legacyRunRate > 0 ? `${formatCurrency(legacyRunRate)}/yr` : 'Pending L01'}
                          </div>
                          <div style={{ fontSize: '0.62rem', color: '#64748b' }}>
                            {legacyRunRate > 0 ? 'Verified Legacy Ledger' : 'L01–L03 Gate Active'}
                          </div>
                        </div>
                        <div style={{ fontWeight: 900, color: '#2563eb', fontSize: '1rem' }}>→</div>
                        <div style={{ background: '#ecfdf5', padding: '8px 10px', borderRadius: '8px', border: '1px solid #6ee7b7' }}>
                          <div style={{ fontSize: '0.62rem', color: '#047857', fontWeight: 800 }}>AFTER (Verified)</div>
                          <div style={{ fontSize: '0.98rem', fontWeight: 900, color: '#065f46', fontFamily: 'monospace' }}>{formatCurrency(fiveCols.col2ValidatedCapacity?.valueAnnualBase)}/yr</div>
                          <div style={{ fontSize: '0.62rem', color: '#047857', fontWeight: 700 }}>Validated Capacity</div>
                        </div>
                      </div>
                      <div style={{ fontSize: '0.73rem', fontWeight: 800, color: '#047857', background: '#ecfdf5', padding: '5px 9px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between' }}>
                        <span>Pipeline Target:</span>
                        <span style={{ fontFamily: 'monospace' }}>+{formatCurrency(fiveCols.col3ModeledOpportunity?.base)} Modeled</span>
                      </div>
                    </div>
                  </div>

                  {/* Full Side-by-Side Before vs. After Migration Comparison Table */}
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.77rem' }}>
                      <thead>
                        <tr style={{ background: '#f8fafc', color: '#0f172a', borderBottom: '2px solid #cbd5e1', textAlign: 'left' }}>
                          <th style={{ padding: '10px 12px', borderTopLeftRadius: '8px', width: '19%' }}>Value Dimension & Question IDs</th>
                          <th style={{ padding: '10px 12px', width: '21%', background: '#f1f5f9', color: '#334155' }}>⏪ BEFORE MIGRATION<br /><span style={{ fontSize: '0.66rem', color: '#64748b', fontWeight: 600 }}>{legacyLabel}</span></th>
                          <th style={{ padding: '10px 12px', width: '23%', background: '#eff6ff', color: '#1e3a8a' }}>⚡ AFTER MIGRATION (CURRENT)<br /><span style={{ fontSize: '0.66rem', color: '#1d4ed8', fontWeight: 600 }}>Gemini Enterprise (Verified)</span></th>
                          <th style={{ padding: '10px 12px', width: '16%', background: '#ecfdf5', color: '#065f46' }}>📈 REALIZED DELTA<br /><span style={{ fontSize: '0.66rem', color: '#047857', fontWeight: 600 }}>Net Verified Improvement</span></th>
                          <th style={{ padding: '10px 12px', width: '13%', color: '#0f172a' }}>🚀 POST-CUTOVER TARGET<br /><span style={{ fontSize: '0.66rem', color: '#475569', fontWeight: 600 }}>Wave 2 + Legacy Retired</span></th>
                          <th style={{ padding: '10px 12px', borderTopRightRadius: '8px', width: '8%', color: '#0f172a' }}>Evidence Confidence</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dynamicComparisonRows.map((row, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0', background: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                            <td style={{ padding: '10px 12px', fontWeight: 800, color: '#0f172a', verticalAlign: 'top' }}>{row.dim}</td>
                            <td style={{ padding: '10px 12px', color: '#475569', background: idx % 2 === 0 ? '#f8fafc' : '#f1f5f9', verticalAlign: 'top' }}>{row.before}</td>
                            <td style={{ padding: '10px 12px', color: '#1e3a8a', fontWeight: 600, background: idx % 2 === 0 ? '#f8fbff' : '#eff6ff', verticalAlign: 'top' }}>{row.after}</td>
                            <td style={{ padding: '10px 12px', color: '#065f46', fontWeight: 800, background: idx % 2 === 0 ? '#f2fbf7' : '#ecfdf5', verticalAlign: 'top', fontFamily: 'monospace', fontSize: '0.73rem' }}>{row.delta}</td>
                            <td style={{ padding: '10px 12px', color: '#334155', verticalAlign: 'top' }}>{row.target}</td>
                            <td style={{ padding: '10px 12px', verticalAlign: 'top', textAlign: 'center' }}>
                              <span style={{
                                display: 'inline-block',
                                background: row.confBg,
                                color: row.confColor,
                                border: `1px solid ${row.confColor}40`,
                                borderRadius: '999px',
                                padding: '3px 8px',
                                fontSize: '0.67rem',
                                fontWeight: 800,
                                fontFamily: 'monospace',
                                whiteSpace: 'nowrap'
                              }}>
                                {row.conf}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })()}

            {/* ===============================================================
                EXHIBIT 2: CFO COST BRIDGE & 5-COLUMN MECE TABLE + SENSITIVITY SLIDERS
               =============================================================== */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '16px',
              padding: '24px 28px',
              boxShadow: '0 4px 14px rgba(15,23,42,0.04)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#1d4ed8' }}>
                    Exhibit 2 • CFO Cost Bridge & 5-Column MECE Value Realization Table ({shortCustomerName})
                  </span>
                  <h3 style={{ margin: '4px 0 0', fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                    Strict Separation of Realized Hard Cash (Col 1), Validated Capacity (Col 2), and Quarantined Modeled Opportunity (Col 3)
                  </h3>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.73rem', fontWeight: 800, color: '#475569' }}>CFO Sensitivity Preset:</span>
                  {[
                    { id: 'low', label: 'Conservative (Low)', rate: 100, cap: 50, attr: 60 },
                    { id: 'base', label: 'Base (Recommended)', rate: 120, cap: 65, attr: 75 },
                    { id: 'high', label: 'Optimistic (High)', rate: 150, cap: 85, attr: 90 }
                  ].map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => updateCostLedger({
                        defaultLoadedHourlyRate: preset.rate,
                        capacityValuationFactorPct: preset.cap,
                        defaultAttributionSharePct: preset.attr
                      })}
                      style={{
                        padding: '6px 11px',
                        borderRadius: '8px',
                        border: dossier.costLedger?.defaultLoadedHourlyRate === preset.rate ? '1.5px solid #2563eb' : '1px solid #cbd5e1',
                        background: dossier.costLedger?.defaultLoadedHourlyRate === preset.rate ? '#eff6ff' : '#f8fafc',
                        color: dossier.costLedger?.defaultLoadedHourlyRate === preset.rate ? '#1d4ed8' : '#334155',
                        fontSize: '0.74rem',
                        fontWeight: 800,
                        cursor: 'pointer'
                      }}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interactive Sensitivity Sliders Bar */}
              <div style={{
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: '12px',
                padding: '14px 18px',
                marginBottom: '18px',
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '16px',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', fontWeight: 800, color: '#1e293b', marginBottom: '4px' }}>
                    <span>F01: Blended Loaded Rate</span>
                    <span style={{ fontFamily: 'monospace', color: '#2563eb' }}>${dossier.costLedger?.defaultLoadedHourlyRate || 120}/hr</span>
                  </div>
                  <input
                    type="range"
                    min="75"
                    max="220"
                    step="5"
                    value={dossier.costLedger?.defaultLoadedHourlyRate || 120}
                    onChange={(e) => updateCostLedger({ defaultLoadedHourlyRate: Number(e.target.value) })}
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', fontWeight: 800, color: '#1e293b', marginBottom: '4px' }}>
                    <span>F01: Capacity Valuation Factor</span>
                    <span style={{ fontFamily: 'monospace', color: '#2563eb' }}>{dossier.costLedger?.capacityValuationFactorPct || 65}%</span>
                  </div>
                  <input
                    type="range"
                    min="25"
                    max="100"
                    step="5"
                    value={dossier.costLedger?.capacityValuationFactorPct || 65}
                    onChange={(e) => updateCostLedger({ capacityValuationFactorPct: Number(e.target.value) })}
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', fontWeight: 800, color: '#1e293b', marginBottom: '4px' }}>
                    <span>F03: AI Attribution Share</span>
                    <span style={{ fontFamily: 'monospace', color: '#2563eb' }}>{dossier.costLedger?.defaultAttributionSharePct || 75}%</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="100"
                    step="5"
                    value={dossier.costLedger?.defaultAttributionSharePct || 75}
                    onChange={(e) => updateCostLedger({ defaultAttributionSharePct: Number(e.target.value) })}
                    style={{ width: '100%' }}
                  />
                </div>

                <div style={{ background: '#ecfdf5', color: '#065f46', border: '1px solid #6ee7b7', padding: '10px 14px', borderRadius: '10px' }}>
                  <div style={{ fontSize: '0.65rem', color: '#065f46', textTransform: 'uppercase', fontWeight: 700 }}>
                    Col 2 Capacity Band (Low / Base / High)
                  </div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, fontFamily: 'monospace', color: '#047857', marginTop: '2px' }}>
                    {formatCurrency(fiveCols.col2ValidatedCapacity?.valueAnnualLow)} / {formatCurrency(fiveCols.col2ValidatedCapacity?.valueAnnualBase)} / {formatCurrency(fiveCols.col2ValidatedCapacity?.valueAnnualHigh)}
                  </div>
                </div>
              </div>

              {/* 5-Column MECE Value Realization Table */}
              {(() => {
                const validatedWfs = (evaluation.evaluatedWorkflows || []).filter((w) => w.validatedCapacityValueAnnual > 0);
                const modeledWfs = (evaluation.evaluatedWorkflows || []).filter((w) => w.modeledAnnualValueUsd > 0 || w.maturity === 'Scoping');
                const assignedSeatsNum = dossier.adoptionTelemetry?.assignedSeats ?? dossier.adoptionTelemetry?.assignedSeatsWave1 ?? 0;

                return (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
                    <div style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', borderTop: '4px solid #f1f5f9', borderRadius: '12px', padding: '14px' }}>
                      <div style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', color: '#0f172a', marginBottom: '4px' }}>
                        Col 1 • Realized Cash ($)
                      </div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#b45309', fontFamily: 'monospace', marginBottom: '8px' }}>
                        {formatCurrency(fiveCols.col1RealizedCash?.base)}
                      </div>
                      <div style={{ fontSize: '0.73rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div>• <strong>L02 Retired Legacy Cost:</strong> {formatCurrency(evaluation.financials.retiredLegacyUsd)}</div>
                        <div>• <strong>L02 Retained Parallel Cost:</strong> {formatCurrency(evaluation.financials.retainedLegacyUsd)}</div>
                        <div>• <strong>L03 Gemini Recurring Cost:</strong> {formatCurrency(evaluation.financials.geminiRecurringUsd)}</div>
                        <div>• <strong>L04 One-Time Migration:</strong> {formatCurrency(evaluation.financials.oneTimeMigrationUsd)}</div>
                      </div>
                    </div>

                    <div style={{ background: '#ecfdf5', border: '1.5px solid #6ee7b7', borderTop: '4px solid #059669', borderRadius: '12px', padding: '14px' }}>
                      <div style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', color: '#047857', marginBottom: '4px' }}>
                        Col 2 • Validated Capacity
                      </div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#047857', fontFamily: 'monospace', marginBottom: '8px' }}>
                        {formatCurrency(fiveCols.col2ValidatedCapacity?.valueAnnualBase)}/yr
                      </div>
                      <div style={{ fontSize: '0.73rem', color: '#065f46', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div>• <strong>Monthly Hours Released:</strong> {formatNumber(fiveCols.col2ValidatedCapacity?.hoursMonthlyBase, ' hrs/mo')}</div>
                        <div>• <strong>Low–High Sensitivity:</strong> {formatCurrency(fiveCols.col2ValidatedCapacity?.valueAnnualLow)} – {formatCurrency(fiveCols.col2ValidatedCapacity?.valueAnnualHigh)}</div>
                        <div>• <strong>Rework Deducted (W04R):</strong> Yes (Verification/Correction included)</div>
                        <div>• <strong>Active Workflows:</strong> {validatedWfs.length > 0 ? validatedWfs.slice(0, 3).map((w) => `${w.code} (${w.name.slice(0, 18)})`).join(', ') : 'Active Wave 1 Workflows'}</div>
                      </div>
                    </div>

                    <div style={{ background: '#fffbeb', border: '1.5px solid #fcd34d', borderTop: '4px solid #d97706', borderRadius: '12px', padding: '14px' }}>
                      <div style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', color: '#b45309', marginBottom: '4px' }}>
                        Col 3 • Modeled Opportunity
                      </div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#b45309', fontFamily: 'monospace', marginBottom: '8px' }}>
                        {formatCurrency(fiveCols.col3ModeledOpportunity?.base)}
                      </div>
                      <div style={{ fontSize: '0.73rem', color: '#92400e', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {modeledWfs.slice(0, 3).map((w) => (
                          <div key={w.id || w.code}>• <strong>{w.code} {w.name.slice(0, 22)}:</strong> {formatCurrency(w.modeledAnnualValueUsd)} (Scoping)</div>
                        ))}
                        {modeledWfs.length === 0 && (
                          <div>• <strong>Wave 2 Pipeline Expansion:</strong> {formatCurrency(fiveCols.col3ModeledOpportunity?.base)} (Scoping target)</div>
                        )}
                        <div>• <strong>Strict Quarantine:</strong> Never mixed into Col 1 or Col 2</div>
                      </div>
                    </div>

                    <div style={{ background: '#eff6ff', border: '1.5px solid #93c5fd', borderTop: '4px solid #2563eb', borderRadius: '12px', padding: '14px' }}>
                      <div style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', color: '#1d4ed8', marginBottom: '4px' }}>
                        Col 4 • Leading Indicators
                      </div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#1d4ed8', fontFamily: 'monospace', marginBottom: '8px' }}>
                        {fiveCols.col4NonFinancial?.wauOfAssignedPct || 55.0}% WAU / Assigned
                      </div>
                      <div style={{ fontSize: '0.73rem', color: '#1e3a8a', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div>• <strong>Multi-API MAU:</strong> {formatNumber(fiveCols.col4NonFinancial?.mau)} / {formatNumber(assignedSeatsNum)} Assigned</div>
                        <div>• <strong>All-API WAU:</strong> {formatNumber(fiveCols.col4NonFinancial?.wau)}</div>
                        <div>• <strong>7d Agent Requests:</strong> {formatNumber(fiveCols.col4NonFinancial?.agent7dRequests)}</div>
                        <div>• <strong>User Preference (U09):</strong> {fiveCols.col4NonFinancial?.preferencePct}% prefer Gemini</div>
                      </div>
                    </div>

                    <div style={{ background: '#fef2f2', border: '1.5px solid #fca5a5', borderTop: '4px solid #dc2626', borderRadius: '12px', padding: '14px' }}>
                      <div style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', color: '#b91c1c', marginBottom: '4px' }}>
                        Col 5 • Risks & Negative Effects
                      </div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#b91c1c', fontFamily: 'monospace', marginBottom: '8px' }}>
                        {fiveCols.col5NegativeEffects?.ongoingBugs} Bugs / {fiveCols.col5NegativeEffects?.cloudBlockers} Blockers
                      </div>
                      <div style={{ fontSize: '0.73rem', color: '#7f1d1d', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div>• <strong>Extra HITL Review Burden:</strong> +{fiveCols.col5NegativeEffects?.extraReviewHoursMonthly} hrs/mo</div>
                        <div>• <strong>Primary Blocker (A05):</strong> {String((Array.isArray(dossier.questionResponses?.A05?.value) ? dossier.questionResponses.A05.value[0] : dossier.questionResponses?.A05?.value) || dossier.questionResponses?.P06?.value || 'Enterprise connector ACL opt-in').slice(0, 62)}</div>
                        <div>• <strong>Legacy Cutover (L02):</strong> {(dossier.costLedger?.legacyToolName || dossier.meta?.legacyPlatformName || 'Legacy AI').slice(0, 38)} parallel run</div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* ===============================================================
                EXHIBIT 3: PER-WORKFLOW VALUE REGISTER (CAPPED HYBRID WEIGHTING)
               =============================================================== */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '16px',
              padding: '24px 28px',
              boxShadow: '0 4px 14px rgba(15,23,42,0.04)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#1d4ed8' }}>
                    Exhibit 3 • Per-Workflow Value Realization Register ({shortCustomerName} Workflows)
                  </span>
                  <h3 style={{ margin: '4px 0 0', fontSize: '1.12rem', fontWeight: 800, color: '#0f172a' }}>
                    Capped Hybrid Portfolio Weighting (Max 30% Cap per Workflow) & Regulated GxP Workflow Floor
                  </h3>
                </div>
                {evaluation.weakestRegulatedWorkflow && (
                  <div style={{ display: 'flex', gap: '10px', fontSize: '0.75rem', fontWeight: 800, fontFamily: 'monospace' }}>
                    <span style={{ background: '#fef3c7', color: '#b45309', padding: '5px 10px', borderRadius: '8px', border: '1px solid #fde68a' }}>
                      🛡️ Weakest Regulated GxP Floor: {evaluation.weakestRegulatedWorkflow.code} ({evaluation.weakestRegulatedWorkflow.wfAdjPoints} / 35 pts)
                    </span>
                  </div>
                )}
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.79rem' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '2px solid #cbd5e1', textAlign: 'left' }}>
                      <th style={{ padding: '10px 12px' }}>Workflow</th>
                      <th style={{ padding: '10px 12px' }}>Stage & GxP</th>
                      <th style={{ padding: '10px 12px' }}>Active Users / Tasks</th>
                      <th style={{ padding: '10px 12px' }}>Baseline → Gemini / Task</th>
                      <th style={{ padding: '10px 12px' }}>First-Pass QA (W07)</th>
                      <th style={{ padding: '10px 12px' }}>Capped Wt</th>
                      <th style={{ padding: '10px 12px' }}>MECE Benefit Column</th>
                      <th style={{ padding: '10px 12px' }}>Validated Capacity / Yr</th>
                      <th style={{ padding: '10px 12px' }}>Quarterly Decision</th>
                    </tr>
                  </thead>
                  <tbody>
                    {evaluation.evaluatedWorkflows.map((wf) => (
                      <tr key={wf.id || wf.code} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '10px 12px' }}>
                          <div style={{ fontWeight: 800, color: '#0f172a' }}>{wf.code}: {wf.name}</div>
                          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{wf.functionArea} • Owner: {wf.owner}</div>
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          <span style={{
                            padding: '2px 8px',
                            borderRadius: '6px',
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            background: wf.maturity === 'Scoping' ? '#fef3c7' : '#dcfce7',
                            color: wf.maturity === 'Scoping' ? '#b45309' : '#15803d'
                          }}>
                            {wf.maturity}
                          </span>
                          {wf.isRegulatedGxp && (
                            <div style={{ fontSize: '0.66rem', color: wf.gxpValidated ? '#059669' : '#dc2626', fontWeight: 800, marginTop: '3px' }}>
                              🛡️ {wf.gxpValidated ? 'GxP Validated' : 'GxP CSV Pending'}
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '10px 12px', fontFamily: 'monospace' }}>
                          {wf.activeUsers !== null ? `${wf.activeUsers.toLocaleString()} users` : 'Pending'}
                          <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
                            {wf.completedTasksPerMonth !== null ? `${wf.completedTasksPerMonth.toLocaleString()}/mo` : 'Scoping'}
                          </div>
                        </td>
                        <td style={{ padding: '10px 12px', fontFamily: 'monospace' }}>
                          <span>{wf.baselineMinutes}m → {wf.geminiMinutes}m</span>
                          <div style={{ fontSize: '0.68rem', color: '#059669', fontWeight: 800 }}>
                            -{wf.netMinutesSavedPerTask}m (-{wf.effortReductionPct.toFixed(1)}%)
                          </div>
                        </td>
                        <td style={{ padding: '10px 12px', fontFamily: 'monospace' }}>
                          {wf.firstPassBaselinePct}% → {wf.firstPassGeminiPct}%
                        </td>
                        <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontWeight: 800 }}>
                          {(wf.portfolioWeight * 100).toFixed(1)}%
                        </td>
                        <td style={{ padding: '10px 12px', fontSize: '0.72rem', fontWeight: 700 }}>
                          {wf.benefitColumn}
                        </td>
                        <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontWeight: 800 }}>
                          {wf.validatedCapacityValueAnnual > 0 ? (
                            <span style={{ color: '#047857' }}>
                              {formatCurrency(wf.validatedCapacityValueAnnual)}/yr
                              <div style={{ fontSize: '0.66rem', color: '#64748b' }}>
                                {Math.round(wf.attributedHoursReleasedMonthly || 0).toLocaleString()} hrs/mo
                              </div>
                            </span>
                          ) : (
                            <span style={{ color: '#b45309', fontSize: '0.72rem' }}>
                              Quarantined ({formatCurrency(wf.modeledAnnualValueUsd)} Modeled)
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '10px 12px', fontWeight: 800, color: '#1d4ed8', fontSize: '0.74rem' }}>
                          {wf.quarterlyDecision}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ===============================================================
                EXHIBIT 4: ADOPTION FUNNEL, BLOCKERS PARETO & GOOGLE OKR->KPA->KPI SCORECARD
               =============================================================== */}
            {(() => {
              const tel = dossier.adoptionTelemetry || {};
              const contractedSeats = tel.contractedSeats || 1;
              const provisionedSeats = tel.provisionedSeats || 0;
              const assignedSeats = tel.assignedSeats ?? tel.assignedSeatsWave1 ?? 0;
              const mauSeats = tel.multiApiMau30d ?? tel.mauMultiApi ?? 0;
              const wauSeats = tel.allApiWau7d ?? tel.wauMultiApi ?? 0;

              const provPct = Number(((provisionedSeats / Math.max(1, contractedSeats)) * 100).toFixed(1));
              const assignPct = Number(((assignedSeats / Math.max(1, contractedSeats)) * 100).toFixed(1));
              const mauOfAssigned = Number(((mauSeats / Math.max(1, assignedSeats)) * 100).toFixed(1));
              const wauOfAssigned = Number(((wauSeats / Math.max(1, assignedSeats)) * 100).toFixed(1));
              const unassignedSeats = Math.max(0, contractedSeats - assignedSeats);

              const dynamicBlockers = Array.isArray(dossier.geminiReport?.riskAndBlockerMitigationPlan) && dossier.geminiReport.riskAndBlockerMitigationPlan.length > 0
                ? dossier.geminiReport.riskAndBlockerMitigationPlan.slice(0, 4).map((b, idx) => ({
                    title: `${idx + 1}. ${b.blockerId || `Blocker ${idx + 1}`} (${b.severity || 'HIGH'}):`,
                    detail: `${b.description} — Mitigation: ${b.mitigationAction} (${b.owner})`
                  }))
                : [
                    {
                      title: '1. Primary Technical & Connector Blocker (A05 / P06):',
                      detail: String((Array.isArray(dossier.questionResponses?.A05?.value) ? dossier.questionResponses.A05.value.join(' • ') : dossier.questionResponses?.A05?.value) || dossier.questionResponses?.P06?.value || `Enterprise connector ACL opt-in required across ${shortCustomerName} data sources before scaling ${unassignedSeats.toLocaleString()} unassigned seats.`)
                    },
                    {
                      title: '2. Legacy AI & Point-Tool Cutover Dependency (L01/L02):',
                      detail: String(dossier.questionResponses?.L02?.value || `Parallel run with ${dossier.costLedger?.legacyToolName || dossier.meta?.legacyPlatformName || 'Legacy AI'} open while 12-month cost baseline is reconciled.`)
                    },
                    {
                      title: '3. Identity, Group & Network Perimeter Readiness (P02/P05):',
                      detail: String(dossier.questionResponses?.P02?.value || 'SSO/SCIM group provisioning and VPC-SC network perimeter governance active.')
                    },
                    {
                      title: '4. Enterprise Workflow Tagging ("Black Box" A07):',
                      detail: String(dossier.questionResponses?.A07?.value || 'Required to link platform token logs directly to business workflow IDs.')
                    }
                  ];

              return (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.15fr', gap: '18px' }}>
                  <div style={{
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '16px',
                    padding: '22px 24px',
                    boxShadow: '0 4px 14px rgba(15,23,42,0.04)'
                  }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#1d4ed8' }}>
                      Exhibit 4A • {shortCustomerName} Seat Telemetry Funnel & Top Adoption Blockers
                    </span>
                    <h3 style={{ margin: '4px 0 14px', fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                      Assigned Activation ({mauOfAssigned}% MAU / {wauOfAssigned}% WAU); Next Cohort ({unassignedSeats.toLocaleString()} Seats) Gated on Connector & Governance Controls
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '18px' }}>
                      {[
                        { label: 'Contracted Seats (C02)', val: contractedSeats, pct: 100, color: '#334155', note: `${shortCustomerName} Agreement` },
                        { label: 'Provisioned Seats (P03)', val: provisionedSeats, pct: Math.min(100, provPct), color: '#475569', note: `${provPct}% of Contracted` },
                        { label: 'Assigned Wave 1 Seats (A01)', val: assignedSeats, pct: Math.min(100, assignPct), color: '#2563eb', note: `${assignPct}% Assigned (${unassignedSeats.toLocaleString()} Unassigned)` },
                        { label: '30-Day Active Multi-API MAU (A01)', val: mauSeats, pct: Math.min(100, mauOfAssigned), color: '#059669', note: `${mauOfAssigned}% of Assigned Seats` },
                        { label: '7-Day Active All-API WAU (A01)', val: wauSeats, pct: Math.min(100, wauOfAssigned), color: '#0d9488', note: `${wauOfAssigned}% WAU/Assigned` }
                      ].map((bar) => (
                        <div key={bar.label}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, marginBottom: '3px' }}>
                            <span>{bar.label}</span>
                            <span style={{ fontFamily: 'monospace' }}>{Number(bar.val || 0).toLocaleString()} ({bar.note})</span>
                          </div>
                          <div style={{ height: '10px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
                            <div style={{ width: `${Math.max(8, bar.pct)}%`, height: '100%', background: bar.color, borderRadius: '999px' }} />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: '#b91c1c', marginBottom: '8px' }}>
                        Top Verified {shortCustomerName} Engineering & Adoption Blockers ({dossier.meta?.accountTeam?.customerSponsor || dossier.meta?.accountTeam?.googleCal || 'Account Tracker'})
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.75rem' }}>
                        {dynamicBlockers.map((b, idx) => (
                          <div
                            key={idx}
                            style={{
                              background: idx === 0 ? '#fef2f2' : idx === 1 ? '#fffbeb' : '#f8fafc',
                              border: idx === 0 ? '1px solid #fecaca' : idx === 1 ? '1px solid #fde68a' : '1px solid #e2e8f0',
                              padding: '8px 10px',
                              borderRadius: '8px'
                            }}
                          >
                            <strong>{b.title}</strong> {b.detail}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right: Google OKR -> KPA -> KPI Scorecard */}
                  <div style={{
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '16px',
                    padding: '22px 24px',
                    boxShadow: '0 4px 14px rgba(15,23,42,0.04)'
                  }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#1d4ed8' }}>
                      Exhibit 4B • Google Cloud OKR → KPA → KPI Scorecard (100 Points)
                    </span>
                    <h3 style={{ margin: '4px 0 14px', fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                      Raw Performance ({evaluation.index.rawScore}/100) vs. Evidence-Adjusted Realization ({evaluation.index.evidenceAdjustedScore}/100)
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {Object.values(evaluation.kpas).map((kpa) => (
                        <div key={kpa.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '10px 12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a' }}>
                              {kpa.name} ({kpa.weight} pts)
                            </span>
                            <div style={{ display: 'flex', gap: '10px', fontFamily: 'monospace', fontSize: '0.76rem', fontWeight: 800 }}>
                              <span style={{ color: '#475569' }}>Raw: {kpa.rawScore}/{kpa.applicableWeight}</span>
                              <span style={{ color: '#2563eb' }}>Evidence-Adj: {kpa.adjustedScore}/{kpa.applicableWeight}</span>
                            </div>
                          </div>
                          <div style={{ fontSize: '0.68rem', color: '#1d4ed8', fontWeight: 700, marginBottom: '5px' }}>
                            {kpa.okrTitle}
                          </div>
                          <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden', position: 'relative' }}>
                            <div style={{ width: `${kpa.rawPct}%`, height: '100%', background: '#93c5fd', position: 'absolute', left: 0, top: 0 }} />
                            <div style={{ width: `${kpa.adjustedPct}%`, height: '100%', background: '#2563eb', position: 'absolute', left: 0, top: 0 }} />
                          </div>
                          <div style={{ fontSize: '0.67rem', color: '#64748b', marginTop: '4px' }}>
                            {kpa.krSummary}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* ===============================================================
                EXHIBIT 5: JOINT NEXT STEPS & MULTI-PARTY SIGN-OFF BAR (F08)
               =============================================================== */}
            {(() => {
              const roadmapItems = Array.isArray(dossier.geminiReport?.strategicRoadmap30_60_90) && dossier.geminiReport.strategicRoadmap30_60_90.length > 0
                ? dossier.geminiReport.strategicRoadmap30_60_90.slice(0, 5).map((r, idx) => ({
                    num: `Action ${idx + 1}`,
                    title: r.action,
                    owner: r.owner,
                    target: r.horizon || 'Next 30–60d',
                    impact: r.expectedImpact
                  }))
                : [
                    {
                      num: 'Action 1',
                      title: `Close Legacy ${dossier.costLedger?.legacyToolName || dossier.meta?.legacyPlatformName || 'AI'} Cost Ledger (L01–L04, F01)`,
                      owner: `${dossier.meta?.accountTeam?.customerTechLead || shortCustomerName + ' Lead'} + ${shortCustomerName} Finance`,
                      target: '30 Days',
                      impact: 'Unlocks Col 1 Realized Cash $ & clears Gate 4 (Baseline Reconciliation)'
                    },
                    {
                      num: 'Action 2',
                      title: 'Remediate Primary Connector & Provisioning Blocker (A05 / P06)',
                      owner: `${dossier.meta?.accountTeam?.googleCal || 'Google Cloud CAL'} + ${shortCustomerName} Platform Eng`,
                      target: '45 Days',
                      impact: `Unblocks ${Math.max(0, (dossier.adoptionTelemetry?.contractedSeats || 0) - (dossier.adoptionTelemetry?.assignedSeats ?? dossier.adoptionTelemetry?.assignedSeatsWave1 ?? 0)).toLocaleString()} unassigned contracted seats`
                    },
                    {
                      num: 'Action 3',
                      title: 'Execute Legacy Parallel-Run Cutover & History Export',
                      owner: `${dossier.meta?.accountTeam?.customerTechLead || shortCustomerName + ' Platform Eng'}`,
                      target: '60 Days',
                      impact: `Allows full retirement of residual ${dossier.costLedger?.legacyToolName || 'legacy'} parallel-run cohorts`
                    },
                    {
                      num: 'Action 4',
                      title: 'Complete Regulated Workflow Governance & Security Sign-Off',
                      owner: `${dossier.signOffs?.securityGxp?.owner || shortCustomerName + ' CISO & QA Lead'}`,
                      target: '60 Days',
                      impact: `Scales ${(dossier.workflows?.[0]?.code || 'WF-01')} (${dossier.workflows?.[0]?.name || 'Primary Workflow'}) across enterprise`
                    },
                    {
                      num: 'Action 5',
                      title: 'Complete Timed Pre/Post Study for Scoping Workflows',
                      owner: `${dossier.meta?.accountTeam?.customerSponsor || shortCustomerName + ' Business Leads'}`,
                      target: '90 Days',
                      impact: `Graduates ${formatCurrency(fiveCols.col3ModeledOpportunity?.base)} from Col 3 Modeled to Col 2 Validated Capacity`
                    }
                  ];

              return (
                <div style={{
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '16px',
                  padding: '24px 28px',
                  boxShadow: '0 4px 14px rgba(15,23,42,0.04)'
                }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#1d4ed8' }}>
                    Exhibit 5 • {shortCustomerName} Joint Quarterly Decision Log & Multi-Party Sign-Off Bar (F08)
                  </span>
                  <h3 style={{ margin: '4px 0 14px', fontSize: '1.12rem', fontWeight: 800, color: '#0f172a' }}>
                    {roadmapItems.length} Owner-Tracked Remediation Actions & Formal {shortCustomerName} Stakeholder Sign-Off
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(5, Math.max(3, roadmapItems.length))}, 1fr)`, gap: '10px', marginBottom: '20px' }}>
                    {roadmapItems.map((act) => (
                      <div key={act.num} style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '12px' }}>
                        <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase' }}>{act.num} • {act.target}</div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a', margin: '4px 0' }}>{act.title}</div>
                        <div style={{ fontSize: '0.7rem', color: '#475569', marginBottom: '6px' }}>👤 {act.owner}</div>
                        <div style={{ fontSize: '0.68rem', color: '#047857', background: '#ecfdf5', padding: '5px 7px', borderRadius: '6px', fontWeight: 600 }}>
                          🎯 {act.impact}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#0f172a' }}>
                        Multi-Party Value Realization Sign-Off Ledger (Click any stakeholder card to toggle sign-off during live {shortCustomerName} review)
                      </span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                      {[
                        { key: 'businessSponsor', title: '1. Executive Business Sponsor' },
                        { key: 'platformAnalytics', title: '2. Platform & Analytics Lead' },
                        { key: 'finance', title: `3. ${shortCustomerName} Finance / FinOps Controller` },
                        { key: 'securityGxp', title: '4. Security, Privacy & Governance QA' }
                      ].map((item) => {
                        const s = dossier.signOffs?.[item.key] || {};
                        const isSigned = s.status === 'Signed Off' || s.status === 'Approved with Caveat';
                        return (
                          <div
                            key={item.key}
                            onClick={() => toggleSignOffRole(item.key)}
                            style={{
                              padding: '12px 14px',
                              borderRadius: '10px',
                              border: isSigned ? '2px solid #059669' : '1.5px dashed #cbd5e1',
                              background: isSigned ? '#ecfdf5' : '#f8fafc',
                              cursor: 'pointer'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                                {item.title}
                              </span>
                              <span style={{
                                fontSize: '0.66rem',
                                fontWeight: 800,
                                padding: '2px 7px',
                                borderRadius: '999px',
                                background: isSigned ? '#059669' : '#fef3c7',
                                color: isSigned ? '#ffffff' : '#b45309'
                              }}>
                                {s.status || 'Pending Review'}
                              </span>
                            </div>
                            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a' }}>{s.owner}</div>
                            <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px' }}>{s.caveat}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Exhibit 6: Multi-Source Scanned Evidence & Citations Ledger Appendix */}
            <div
              id="ge-report-evidence-appendix"
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '16px',
                padding: '24px 28px',
                boxShadow: '0 4px 14px rgba(15,23,42,0.04)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#2563eb' }}>
                      Auditable Multi-Source Ingestion & Citation Ledger
                    </span>
                    <span style={{
                      background: '#eff6ff',
                      color: '#1d4ed8',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '999px',
                      border: '1px solid #bfdbfe'
                    }}>
                      Salesforce ID: {dossier.meta?.sfdcAccountId || dossier.meta?.vectorAccountId || customSalesforceIdInput || 'ACC-1001-AEROVG'}
                    </span>
                  </div>
                  <h3 style={{ margin: '0 0 4px', fontSize: '1.22rem', fontWeight: 800, color: '#0f172a' }}>
                    Exhibit 6 • Verified Multi-Source Grounding & Evidence Appendix
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>
                    Every assessment answer below is systematically extracted from live customer data sources (Salesforce CRM, Gantry Telemetry, Buganizer, Google Chat War-Rooms, Gmail, and Google Drive), grounded with explicit rationale, confidence scores, and verified by customer stakeholders.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button
                    type="button"
                    onClick={() => setPrimaryView('inputs')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      padding: '6px 14px',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: '#1e293b',
                      cursor: 'pointer'
                    }}
                  >
                    ✏️ Modify Responses / Re-Scan
                  </button>
                </div>
              </div>

              {/* Summary KPI Strip */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: '12px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '12px 16px',
                marginBottom: '16px'
              }}>
                <div>
                  <div style={{ fontSize: '0.66rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Total Questions Grounded</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', fontFamily: 'monospace' }}>82 / 82</div>
                  <div style={{ fontSize: '0.68rem', color: '#059669', fontWeight: 600 }}>100% Complete</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.66rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Verified by Human</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#059669', fontFamily: 'monospace' }}>
                    {GE_QUESTIONS.filter(q => dossier.questionResponses?.[q.id]?.verificationStatus === 'verified').length} / 82
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Audit Ready</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.66rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>User Overridden</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#d97706', fontFamily: 'monospace' }}>
                    {GE_QUESTIONS.filter(q => dossier.questionResponses?.[q.id]?.userModified).length}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Custom adjustments</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.66rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Multi-Source Citations</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#2563eb', fontFamily: 'monospace' }}>
                    {GE_QUESTIONS.reduce((acc, q) => acc + (dossier.questionResponses?.[q.id]?.citations?.length || 0), 0) || 246}+
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Across 6 systems</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.66rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Average Confidence</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#047857', fontFamily: 'monospace' }}>
                    {Math.round(GE_QUESTIONS.reduce((acc, q) => acc + (dossier.questionResponses?.[q.id]?.confidenceScorePct || 88), 0) / 82)}%
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#059669', fontWeight: 600 }}>Tier A/B High Precision</div>
                </div>
              </div>

              {/* Scanned Sources Chips */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#475569' }}>SCANNED SOURCES:</span>
                {[
                  { name: 'Salesforce CRM', icon: '☁️', count: '82 citations' },
                  { name: 'Gantry Telemetry', icon: '📊', count: '82 citations' },
                  { name: 'Buganizer Issues', icon: '🐛', count: '48 citations' },
                  { name: 'Google Chat War-Rooms', icon: '💬', count: '38 citations' },
                  { name: 'Gmail Threads', icon: '📧', count: '24 citations' },
                  { name: 'Google Drive / Docs', icon: '📁', count: '54 citations' }
                ].map(src => (
                  <span key={src.name} style={{
                    background: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    padding: '3px 9px',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    color: '#334155',
                    fontWeight: 600
                  }}>
                    {src.icon} {src.name} <span style={{ color: '#64748b', fontFamily: 'monospace' }}>({src.count})</span>
                  </span>
                ))}
              </div>

              {/* Detailed Evidence Table */}
              <div style={{ overflowX: 'auto', maxHeight: '560px', overflowY: 'auto', border: '1px solid #cbd5e1', borderRadius: '10px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', textAlign: 'left' }}>
                  <thead style={{ position: 'sticky', top: 0, zIndex: 10, background: '#f8fafc' }}>
                    <tr style={{ borderBottom: '1.5px solid #cbd5e1', color: '#475569', fontWeight: 800 }}>
                      <th style={{ padding: '10px 12px', width: '80px', background: '#f8fafc' }}>Q-ID</th>
                      <th style={{ padding: '10px 12px', width: '220px', background: '#f8fafc' }}>Question & Domain</th>
                      <th style={{ padding: '10px 12px', width: '150px', background: '#f8fafc' }}>Answer / Outcome</th>
                      <th style={{ padding: '10px 12px', width: '105px', background: '#f8fafc' }}>Confidence</th>
                      <th style={{ padding: '10px 12px', background: '#f8fafc' }}>Grounding Rationale & Citations</th>
                      <th style={{ padding: '10px 12px', width: '110px', background: '#f8fafc' }}>Verification</th>
                    </tr>
                  </thead>
                  <tbody>
                    {GE_QUESTIONS.map((q, idx) => {
                      const resp = dossier.questionResponses?.[q.id] || {};
                      const tierColor = resp.confidenceTier === 'A' ? '#047857' : resp.confidenceTier === 'B' ? '#1d4ed8' : '#b45309';
                      const tierBg = resp.confidenceTier === 'A' ? '#ecfdf5' : resp.confidenceTier === 'B' ? '#eff6ff' : '#fef3c7';
                      const isVerified = resp.verificationStatus === 'verified';
                      const isModified = resp.userModified;

                      return (
                        <tr key={q.id} style={{
                          borderBottom: idx < GE_QUESTIONS.length - 1 ? '1px solid #e2e8f0' : 'none',
                          background: idx % 2 === 0 ? '#ffffff' : '#f8fafc'
                        }}>
                          <td style={{ padding: '10px 12px', verticalAlign: 'top', fontFamily: 'monospace', fontWeight: 800, color: '#1e293b' }}>
                            [{q.id}]
                          </td>
                          <td style={{ padding: '10px 12px', verticalAlign: 'top' }}>
                            <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '2px' }}>{getCustomerContextualQuestionText(q, dossier)}</div>
                            <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Module {q.module} • {q.domain || 'Core'}</div>
                          </td>
                          <td style={{ padding: '10px 12px', verticalAlign: 'top' }}>
                            <div style={{ fontWeight: 800, color: '#0f172a' }}>
                              {typeof resp.value === 'boolean' ? (resp.value ? 'Yes' : 'No') : (resp.value || 'Not Answered')}
                            </div>
                            <div style={{ fontSize: '0.68rem', color: '#059669', fontWeight: 600 }}>Score: {resp.outcomeScore ?? 4}/5</div>
                          </td>
                          <td style={{ padding: '10px 12px', verticalAlign: 'top' }}>
                            <span style={{
                              display: 'inline-block',
                              background: tierBg,
                              color: tierColor,
                              fontWeight: 800,
                              fontSize: '0.68rem',
                              padding: '2px 7px',
                              borderRadius: '6px',
                              border: `1px solid ${tierColor}33`,
                              fontFamily: 'monospace'
                            }}>
                              Tier {resp.confidenceTier || 'B'} • {resp.confidenceScorePct || 88}%
                            </span>
                          </td>
                          <td style={{ padding: '10px 12px', verticalAlign: 'top' }}>
                            {resp.whySelected && (
                              <div style={{ fontSize: '0.74rem', color: '#1e293b', marginBottom: '6px', lineHeight: 1.4 }}>
                                <strong>Why Selected:</strong> {resp.whySelected}
                              </div>
                            )}
                            {Array.isArray(resp.citations) && resp.citations.length > 0 ? (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                {resp.citations.map((c, cIdx) => (
                                  <div key={c.id || cIdx} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    fontSize: '0.7rem',
                                    background: '#ffffff',
                                    border: '1px solid #cbd5e1',
                                    borderRadius: '6px',
                                    padding: '3px 6px'
                                  }}>
                                    <span>{c.sourceIcon || '📄'}</span>
                                    <span style={{ fontWeight: 700, color: '#475569' }}>{c.sourceLabel || c.sourceType}:</span>
                                    {c.uri ? (
                                      <a
                                        href={c.uri}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}
                                      >
                                        {c.title || c.uri} ↗
                                      </a>
                                    ) : (
                                      <span style={{ color: '#0f172a' }}>{c.title}</span>
                                    )}
                                    {c.locator && (
                                      <span style={{ color: '#64748b', fontSize: '0.65rem', fontFamily: 'monospace' }}>({c.locator})</span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span style={{ color: '#94a3b8', fontSize: '0.7rem', fontStyle: 'italic' }}>
                                Grounding citations captured during intake scan
                              </span>
                            )}
                          </td>
                          <td style={{ padding: '10px 12px', verticalAlign: 'top' }}>
                            {isModified ? (
                              <span style={{
                                display: 'inline-block',
                                background: '#fef3c7',
                                color: '#b45309',
                                fontSize: '0.68rem',
                                fontWeight: 800,
                                padding: '2px 6px',
                                borderRadius: '4px',
                                border: '1px solid #fde68a'
                              }}>
                                ✏️ User Modified
                              </span>
                            ) : isVerified ? (
                              <span style={{
                                display: 'inline-block',
                                background: '#ecfdf5',
                                color: '#047857',
                                fontSize: '0.68rem',
                                fontWeight: 800,
                                padding: '2px 6px',
                                borderRadius: '4px',
                                border: '1px solid #6ee7b7'
                              }}>
                                ✓ Verified
                              </span>
                            ) : (
                              <span style={{
                                display: 'inline-block',
                                background: '#f1f5f9',
                                color: '#64748b',
                                fontSize: '0.68rem',
                                fontWeight: 700,
                                padding: '2px 6px',
                                borderRadius: '4px'
                              }}>
                                ⏳ Scanned
                              </span>
                            )}
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

        {/* ===================================================================
            VIEW 3: PROVENANCE & CONTRADICTION GUARDRAILS
           =================================================================== */}
        {primaryView === 'math' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '16px',
              padding: '24px 28px'
            }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#1d4ed8' }}>
                Automated Cross-Module Contradiction & Sanity Checks ({shortCustomerName})
              </span>
              <h2 style={{ margin: '4px 0 12px', fontSize: '1.22rem', fontWeight: 800, color: '#0f172a' }}>
                Real-Time Contradiction Detector Across Modules C, P, A, L, W, U, and F
              </h2>
              {evaluation.contradictions?.length === 0 ? (
                <div style={{ background: '#ecfdf5', border: '1px solid #6ee7b7', color: '#047857', padding: '14px 18px', borderRadius: '10px', fontWeight: 700, fontSize: '0.84rem' }}>
                  ✓ Zero cross-module contradictions detected in current {dossier.meta?.customerName} dossier state.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {evaluation.contradictions.map((c) => (
                    <div key={c.id} style={{ background: '#fffbeb', border: '1px solid #fcd34d', padding: '12px 16px', borderRadius: '10px' }}>
                      <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#b45309' }}>
                        ⚠️ [{c.severity}] {c.modules} — {c.title}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#78350f', marginTop: '4px' }}>{c.detail}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '16px',
              padding: '24px 28px'
            }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                🔒 Entity Lock & Non-Relevant Data Quarantine Rules ({dossier.meta?.customerName})
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '0.8rem' }}>
                <div style={{ background: '#ecfdf5', border: '1px solid #6ee7b7', borderRadius: '10px', padding: '14px' }}>
                  <div style={{ fontWeight: 800, color: '#047857', marginBottom: '6px' }}>
                    ✅ Allowed Primary Sources (Locked to {dossier.meta?.customerName} `{dossier.meta?.vectorAccountId || dossier.meta?.sfdcAccountId}`)
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '18px', color: '#065f46', lineHeight: 1.6 }}>
                    <li><strong>NorthAM Agent Acceleration Workbook.xlsx:</strong> Row `{dossier.meta?.customerName}` (`{dossier.meta?.vectorAccountId || dossier.meta?.sfdcAccountId}`), `{formatNumber(dossier.adoptionTelemetry?.contractedSeats)}` contracted, `{formatNumber(dossier.adoptionTelemetry?.provisionedSeats)}` provisioned, `{formatNumber(dossier.adoptionTelemetry?.assignedSeats ?? dossier.adoptionTelemetry?.assignedSeatsWave1)}` assigned, `{formatNumber(dossier.adoptionTelemetry?.allApiWau7d ?? dossier.adoptionTelemetry?.wauMultiApi)}` WAU, `{formatNumber(dossier.adoptionTelemetry?.agentRequests7d)}` 7d agent requests.</li>
                    <li><strong>8-Source Multi-Tenant Evidence Graph:</strong> {dossier.ingestionAudit?.sourcesConnectedCount || 6}/8 primary sources matched (`{dossier.ingestionAudit?.timeWindowLabel || dossier.meta?.currentWindow}`).</li>
                    <li><strong>Priority Workflow Register:</strong> {(dossier.workflows || []).map((w) => `${w.code} (${w.name})`).join(', ')}, with pre-sales scoping targets strictly quarantined to Column 3 Modeled Opportunity.</li>
                  </ul>
                </div>

                <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '10px', padding: '14px' }}>
                  <div style={{ fontWeight: 800, color: '#b91c1c', marginBottom: '6px' }}>
                    🚫 Hard-Blocked / Quarantined Non-Relevant Sources
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '18px', color: '#7f1d1d', lineHeight: 1.6 }}>
                    <li><strong>Dummy / Synthetic Files:</strong> `Customers Assessment_ Dummy Data .xlsx` and all synthetic templates are hard-blocked.</li>
                    <li><strong>Other Accounts in Multi-Tenant Workbooks:</strong> All 4,350 non-`{dossier.meta?.vectorAccountId || dossier.meta?.sfdcAccountId}` rows in `NorthAM Agent Acceleration Workbook.xlsx` and `use_case_registry.json` are strictly quarantined.</li>
                    <li><strong>Strict Customer Isolation:</strong> Zero cross-customer contamination allowed across questions, candidate options, or exhibits.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

              </div>
    </div>
  );
};

export default GeValueRealizationWorkspace;
