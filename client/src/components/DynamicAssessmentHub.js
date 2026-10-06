import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  FiTrash2,
  FiBarChart2,
  FiCheckCircle,
  FiClock,
  FiSearch,
  FiList,
  FiAward,
  FiLayers,
  FiToggleLeft,
  FiToggleRight,
  FiTarget,
  FiPlay,
  FiChevronDown,
  FiChevronUp,
  FiUploadCloud,
  FiEdit2,
  FiCopy,
  FiStar
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import toast from 'react-hot-toast';
import dynamicAssessmentService from '../services/dynamicAssessmentService';
import LoadingSpinner from './LoadingSpinner';
import UploadDocumentModal from './UploadDocumentModal';
import {
  PageContainer,
  ContentContainer,
  HeaderSection,
  PrimaryButton,
  SecondaryButton,
  FilterBar,
  SearchBox,
  TabGroup,
  Tab,
  Dropdown,
  AssessmentsGrid,
  AssessmentCard,
  StatusBadge,
  PillarTag,
  ActionButton,
  EmptyState
} from './shared/assessmentCardKit';

// =======================
// HUB-SPECIFIC PRIMITIVES (everything else comes from the shared /assessments kit)
// =======================

const CardDescription = styled.p`
  font-size: 0.85rem;
  line-height: 1.5;
  color: #475569;
  margin: 0 0 14px 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const PromoteToggle = styled.button`
  background: none;
  border: none;
  color: ${props => props.$promoted ? '#059669' : '#64748b'};
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  padding: 4px 0;
  transition: color 0.2s ease;
  white-space: nowrap;

  &:hover {
    color: ${props => props.$promoted ? '#047857' : '#2563eb'};
  }

  svg {
    font-size: 1.1rem;
  }
`;

// Pin action footers to the bottom of equal-height grid rows (hub-only; keeps the shared kit untouched)
const CARD_FLEX_STYLE = { display: 'flex', flexDirection: 'column' };
const FOOTER_PIN_STYLE = { marginTop: 'auto' };

// Start Assessment Modal
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 32px;
  width: 100%;
  max-width: 540px;
  box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.25);
  color: #1e293b;

  @media (max-width: 640px) {
    padding: 24px 18px;
    border-radius: 14px;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #334155;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 10px 12px;
  color: #1e293b;
  font-size: 0.875rem;
  box-sizing: border-box;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
  }
`;

// =======================
// STATIC CATALOG DATA
// =======================

const CANONICAL_SAMPLE_REPORTS = {
  enterprise_data_ai_maturity: 'inst_data_ai_maturity_demo',
  openai_to_gemini_enterprise_migration: 'inst_openai_gemini_demo',
  finops_cloud_cost_optimization: 'inst_finops_demo',
  agentic_ai_mesh_mcp_banking_readiness: 'inst_banking_mcp_demo',
  edw_lakehouse_to_bigquery_modernization: 'inst_edw_bq_demo',
  enterprise_ai_zero_trust_security: 'inst_zero_trust_demo'
};

// Suite badge palette shared with /assessments (AssessmentsListNew.js suiteBadges)
const SUITE_BADGES = {
  dynamic: { label: 'Dynamic Blueprint', bg: '#f3e8ff', text: '#6d28d9', border: '#ddd6fe' },
  draft: { label: 'Draft Framework', bg: '#fffbeb', text: '#b45309', border: '#fde68a' },
  ge_value_realization: { label: 'GE Value Realization', bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
  eu_ai_act: { label: 'EU AI Act Dossier', bg: '#fffbeb', text: '#b45309', border: '#fde68a' },
  pinned: { label: '📌 Pinned in Nav', bg: '#ecfdf5', text: '#047857', border: '#a7f3d0' }
};

// The two specialised, hard-wired production suites (own routes + own nav entries)
const SPECIALIZED_TEMPLATES = [
  {
    key: 'ge_value_realization',
    badge: SUITE_BADGES.ge_value_realization,
    title: 'GE Value Realization (BioNova Migration)',
    description: 'Zero-hallucination value realization assessment for migrating legacy AI (NovaAssist / NOVA-AI) to Google Gemini Enterprise across 85,300 seats, 5 workflows, and a 5-Column CFO Cost Bridge.',
    meta: [
      { Icon: FiLayers, label: '10 Modules (C–G)' },
      { Icon: FiTarget, label: '82 Qs + 5 Workflows' },
      { Icon: FiClock, label: '3 Input Modes' }
    ],
    pillars: ['5-Column CFO Cost Bridge', '85,300 Seats', '5 Workflows', '3 Input Modes'],
    footnote: 'Pre-Staged • ACC-1002-BIONOVA',
    accentBorder: '#93c5fd',
    editPath: '/ge-value-realization/inst_bionova_ge_value_realization?tab=inputs',
    secondary: { label: 'Executive Value Report', path: '/ge-value-realization/inst_bionova_ge_value_realization?tab=report' },
    primary: { label: 'Open Inputs (3 Modes)', path: '/ge-value-realization/inst_bionova_ge_value_realization?tab=inputs' }
  },
  {
    key: 'eu_ai_act',
    badge: SUITE_BADGES.eu_ai_act,
    title: 'EU AI Act Compliance Engine & Audit Workspace',
    description: 'Statutory risk classification (Art. 5 tripwires, Annex III High-Risk), 7-vector conformity audit (Arts. 8–15), and formal regulatory attestation dossier.',
    meta: [
      { Icon: FiLayers, label: '9 Statutory Sections' },
      { Icon: FiTarget, label: '20 Multi-Branch Qs' },
      { Icon: FiClock, label: '~15 mins' }
    ],
    pillars: ['Art. 5 Tripwires', 'Annex III High-Risk', 'Arts. 8–15 Conformity', 'Attestation Dossier'],
    footnote: 'Core Statutory Suite',
    accentBorder: null,
    editPath: '/eu-ai-compliance',
    secondary: { label: 'Try Sample', path: '/eu-ai-compliance?demo=high-risk-hr' },
    primary: { label: 'Start Assessment', path: '/eu-ai-compliance' }
  }
];

const badgeStyle = (badge) => ({
  display: 'inline-block',
  padding: '3px 9px',
  borderRadius: '999px',
  fontSize: '0.72rem',
  fontWeight: 700,
  background: badge.bg,
  color: badge.text,
  border: `1px solid ${badge.border}`
});

const formatDate = (value) => {
  if (!value) return 'n/a';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return 'n/a';
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

const countQuestions = (type) =>
  (type.framework?.dimensions || []).reduce((acc, d) => acc + (d.questions?.length || 0), 0);

// =======================
// COMPONENT
// =======================

const DynamicAssessmentHub = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('production'); // 'production', 'drafts', 'portfolio'
  const [loading, setLoading] = useState(true);
  const [types, setTypes] = useState([]);
  const [instances, setInstances] = useState([]);
  const [expandedPreview, setExpandedPreview] = useState({});
  const [startModalType, setStartModalType] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [templateFilter, setTemplateFilter] = useState('all'); // 'all' | 'pinned' | 'unpinned'
  const [runFilter, setRunFilter] = useState('all'); // 'all' | 'completed' | 'in_progress'
  const [sortBy, setSortBy] = useState('catalog'); // 'catalog' | 'title' | 'questions'
  const [modalForm, setModalForm] = useState({
    customerName: '',
    useCase: '',
    contactEmail: ''
  });

  useEffect(() => {
    loadHubData();
  }, []);

  const loadHubData = async () => {
    setLoading(true);
    try {
      const [typesRes, instancesRes] = await Promise.all([
        dynamicAssessmentService.getAssessmentTypes(false),
        dynamicAssessmentService.getInstances()
      ]);
      setTypes(typesRes || []);
      setInstances(instancesRes || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load assessment hub data');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePromote = async (type) => {
    try {
      const newStatus = !type.isPromoted;
      await dynamicAssessmentService.togglePromotion(type.id || type.typeKey, newStatus);
      setTypes(prev => prev.map(t => (t.id === type.id || t.typeKey === type.typeKey) ? { ...t, isPromoted: newStatus } : t));
      toast.success(newStatus ? `"${type.title}" pinned to Assessments menu` : `"${type.title}" unpinned`);
      window.dispatchEvent(new Event('assessment-types-updated'));
    } catch (err) {
      console.error(err);
      toast.error('Failed to update promotion status');
    }
  };

  const handleDeleteType = async (type) => {
    if (!window.confirm(`Are you sure you want to delete template "${type.title}"?`)) return;
    try {
      await dynamicAssessmentService.deleteAssessmentType(type.id || type.typeKey);
      setTypes(prev => prev.filter(t => t.id !== type.id && t.typeKey !== type.typeKey));
      toast.success(`Template "${type.title}" deleted.`);
      window.dispatchEvent(new Event('assessment-types-updated'));
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete template');
    }
  };

  const handleEditType = (type) => {
    const canonicalId = CANONICAL_SAMPLE_REPORTS[type?.typeKey];
    if (canonicalId) {
      navigate(`/assessments/run/instance/${canonicalId}`);
      return;
    }
    handleOpenStartModal(type);
  };

  const handleCloneType = async (type) => {
    try {
      toast.loading(`Cloning "${type.title}"...`, { id: 'clone-type' });
      const res = await dynamicAssessmentService.forkAssessmentType(
        type.id || type.typeKey,
        `${type.title} (Copy)`
      );
      if (res?.type) {
        setTypes(prev => [res.type, ...prev]);
        toast.success(`Cloned "${type.title}"!`, { id: 'clone-type' });
        window.dispatchEvent(new Event('assessment-types-updated'));
      } else {
        toast.error('Failed to clone template', { id: 'clone-type' });
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to clone template', { id: 'clone-type' });
    }
  };

  const handleCloneInstance = async (run) => {
    try {
      toast.loading(`Cloning assessment for ${run.customerName || 'Customer'}...`, { id: 'clone-run' });
      const res = await dynamicAssessmentService.cloneInstance(run.id, 'Cloned Copy');
      const newInst = res?.instance || res;
      if (newInst?.id) {
        setInstances(prev => [newInst, ...prev]);
        toast.success('Assessment cloned!', { id: 'clone-run' });
      } else {
        toast.error('Failed to clone assessment', { id: 'clone-run' });
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to clone assessment', { id: 'clone-run' });
    }
  };

  const handleDeleteInstance = async (run) => {
    if (!window.confirm(`Are you sure you want to delete this assessment for "${run.customerName || 'Customer'}"?`)) return;
    try {
      await dynamicAssessmentService.deleteInstance(run.id);
      setInstances(prev => prev.filter(i => i.id !== run.id));
      toast.success('Assessment deleted.');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete assessment');
    }
  };

  const handleOpenStartModal = (type) => {
    setStartModalType(type);
    const savedUser = (() => {
      try {
        return JSON.parse(localStorage.getItem('user') || 'null');
      } catch {
        return null;
      }
    })();
    const orgDefault = (savedUser?.organization && savedUser.organization !== 'ScoreX Demo Workspace')
      ? savedUser.organization
      : 'Enterprise Organization';
    const emailDefault = (savedUser?.email && savedUser.email !== 'demo.guest@scorex.local')
      ? savedUser.email
      : '';
    setModalForm({
      customerName: orgDefault,
      useCase: type.framework?.title ? `${type.framework.title} Initiative` : 'Digital Transformation',
      contactEmail: emailDefault
    });
  };

  const handleLaunchAssessment = async (e) => {
    e.preventDefault();
    if (!modalForm.customerName.trim()) {
      toast.error('Organization / Customer name is required');
      return;
    }

    try {
      toast.loading('Initializing customer assessment...', { id: 'launch-assessment' });
      const instance = await dynamicAssessmentService.createInstance({
        typeKey: startModalType.typeKey,
        customerName: modalForm.customerName.trim(),
        useCase: modalForm.useCase.trim(),
        contactEmail: modalForm.contactEmail.trim(),
        frameworkSnapshot: startModalType.framework,
        responses: {}
      });

      toast.success('Assessment initialized!', { id: 'launch-assessment' });
      setStartModalType(null);
      navigate(`/assessments/run/instance/${instance.id}`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to launch assessment', { id: 'launch-assessment' });
    }
  };

  const handleTrySample = async (type) => {
    const canonicalId = CANONICAL_SAMPLE_REPORTS[type?.typeKey];
    if (canonicalId) {
      navigate(`/assessments/report/${canonicalId}`);
      return;
    }
    try {
      toast.loading(`Spinning up sample for "${type.title}"...`, { id: 'sample-run' });
      const result = await dynamicAssessmentService.generateSampleForType(type.typeKey);
      toast.success('Sample assessment loaded!', { id: 'sample-run' });
      navigate(`/assessments/report/${result.instanceId}`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate sample assessment', { id: 'sample-run' });
    }
  };

  const togglePreview = (typeKey) => {
    setExpandedPreview(prev => ({
      ...prev,
      [typeKey]: !prev[typeKey]
    }));
  };

  // -----------------------
  // Derived collections
  // -----------------------
  const productionTypes = types.filter(t => (t.status === 'production' || t.isPromoted));
  const draftTypes = types.filter(t => t.status === 'draft' && !t.isPromoted);

  const query = searchTerm.trim().toLowerCase();
  const typeMatchesSearch = (t) => !query || [
    t.title,
    t.description,
    t.badge,
    t.typeKey,
    ...((t.framework?.dimensions || []).map(d => d.name))
  ].filter(Boolean).join(' ').toLowerCase().includes(query);
  const typeMatchesPin = (t) => templateFilter === 'all'
    || (templateFilter === 'pinned' ? !!t.isPromoted : !t.isPromoted);
  const sortTypes = (arr) => {
    if (sortBy === 'title') return [...arr].sort((a, b) => String(a.title || '').localeCompare(String(b.title || '')));
    if (sortBy === 'questions') return [...arr].sort((a, b) => countQuestions(b) - countQuestions(a));
    return arr;
  };

  const visibleProductionTypes = sortTypes(productionTypes.filter(typeMatchesSearch).filter(typeMatchesPin));
  const visibleDraftTypes = sortTypes(draftTypes.filter(typeMatchesSearch).filter(typeMatchesPin));
  // Specialised suites are permanently wired into the nav, so they count as "pinned"
  const visibleSpecialized = templateFilter === 'unpinned'
    ? []
    : SPECIALIZED_TEMPLATES.filter(s => !query || `${s.title} ${s.description} ${s.badge.label}`.toLowerCase().includes(query));

  const runMatchesSearch = (r) => !query || [
    r.customerName,
    r.useCase,
    r.frameworkSnapshot?.title,
    r.typeKey,
    r.contactEmail
  ].filter(Boolean).join(' ').toLowerCase().includes(query);
  const runMatchesStatus = (r) => runFilter === 'all'
    || (runFilter === 'completed' ? !!r.aiReport : !r.aiReport);
  // Flat grid like /assessments: cluster by customer, newest run first within a customer
  const visibleInstances = instances
    .filter(runMatchesSearch)
    .filter(runMatchesStatus)
    .slice()
    .sort((a, b) => {
      const byCustomer = String(a.customerName || 'Other').localeCompare(String(b.customerName || 'Other'));
      if (byCustomer !== 0) return byCustomer;
      return new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0);
    });

  const productionCount = productionTypes.length + SPECIALIZED_TEMPLATES.length;
  const visibleCount = activeTab === 'production'
    ? visibleProductionTypes.length + visibleSpecialized.length
    : activeTab === 'drafts'
    ? visibleDraftTypes.length
    : visibleInstances.length;
  const totalCount = activeTab === 'production'
    ? productionCount
    : activeTab === 'drafts'
    ? draftTypes.length
    : instances.length;

  const collectionPills = [
    { id: 'production', label: 'Production Ready', count: productionCount, color: '#059669', Icon: FiCheckCircle },
    { id: 'drafts', label: 'Drafts & AI Frameworks', count: draftTypes.length, color: '#b45309', Icon: FiAward },
    { id: 'portfolio', label: 'Customer Portfolio Runs', count: instances.length, color: '#1d4ed8', Icon: FiBarChart2 }
  ];

  const stopThen = (fn) => (e) => {
    if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
    fn();
  };

  // -----------------------
  // Card renderers (all on the shared /assessments AssessmentCard anatomy)
  // -----------------------
  const renderSpecializedCard = (tpl) => (
    <AssessmentCard
      key={tpl.key}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{ ...CARD_FLEX_STYLE, cursor: 'default', borderColor: tpl.accentBorder || undefined }}
    >
      <div className="header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
            <span style={badgeStyle(tpl.badge)}>{tpl.badge.label}</span>
            <span style={badgeStyle(SUITE_BADGES.pinned)}>{SUITE_BADGES.pinned.label}</span>
          </div>
          <div className="title">{tpl.title}</div>
          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '6px' }}>
            <strong style={{ color: '#475569', fontWeight: 600 }}>{tpl.footnote}</strong>
          </div>
        </div>
        <StatusBadge $status="production" style={{ whiteSpace: 'nowrap' }}>Production</StatusBadge>
      </div>

      <CardDescription title={tpl.description}>{tpl.description}</CardDescription>

      <div className="meta">
        {tpl.meta.map(({ Icon, label }) => (
          <span className="meta-item" key={label}><Icon /> {label}</span>
        ))}
      </div>

      <div className="pillars">
        {tpl.pillars.map(p => <PillarTag key={p}>{p}</PillarTag>)}
      </div>

      <div className="footer" style={FOOTER_PIN_STYLE}>
        <div className="actions" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          <ActionButton onClick={() => navigate(tpl.editPath)} title="Edit assessment inputs">
            <FiEdit2 /> Edit
          </ActionButton>
          <ActionButton
            onClick={() => navigate(tpl.secondary.path)}
            title={tpl.secondary.label}
            style={{ color: '#059669', borderColor: '#a7f3d0', background: '#ecfdf5' }}
          >
            <FiStar /> {tpl.secondary.label}
          </ActionButton>
          <ActionButton className="primary" onClick={() => navigate(tpl.primary.path)} title={tpl.primary.label}>
            <FiPlay /> {tpl.primary.label}
          </ActionButton>
        </div>
      </div>
    </AssessmentCard>
  );

  const renderTypeCard = (type, { isDraft }) => {
    const dimensions = type.framework?.dimensions || [];
    const totalQ = countQuestions(type);
    const isExpanded = !!expandedPreview[type.typeKey];
    const visibleDims = isExpanded ? dimensions : dimensions.slice(0, 4);
    const hiddenCount = dimensions.length - visibleDims.length;
    const runsForType = instances.filter(i => i.typeKey === type.typeKey).length;
    const badge = isDraft
      ? { ...SUITE_BADGES.draft, label: type.badge || SUITE_BADGES.draft.label }
      : {
          label: type.badge || SUITE_BADGES.dynamic.label,
          bg: type.color ? `${type.color}1f` : SUITE_BADGES.dynamic.bg,
          text: type.color || SUITE_BADGES.dynamic.text,
          border: type.color ? `${type.color}55` : SUITE_BADGES.dynamic.border
        };

    return (
      <AssessmentCard
        key={type.id || type.typeKey}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{ ...CARD_FLEX_STYLE, cursor: 'default' }}
      >
        <div className="header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
              <span style={badgeStyle(badge)}>{badge.label}</span>
              {type.isPromoted && (
                <span style={badgeStyle(SUITE_BADGES.pinned)}>{SUITE_BADGES.pinned.label}</span>
              )}
            </div>
            <div className="title">{type.title}</div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '6px' }}>
              Key: <strong style={{ color: '#475569', fontWeight: 600 }}>{type.typeKey}</strong>
              {runsForType > 0 && <> • {runsForType} customer run{runsForType === 1 ? '' : 's'}</>}
            </div>
          </div>
          <StatusBadge $status={isDraft ? 'draft' : 'production'} style={{ whiteSpace: 'nowrap' }}>{isDraft ? 'Draft' : 'Production'}</StatusBadge>
        </div>

        <CardDescription title={type.description || ''}>
          {type.description || (isDraft ? 'AI-generated assessment framework draft.' : 'Enterprise structured assessment framework.')}
        </CardDescription>

        <div className="meta">
          <span className="meta-item"><FiLayers /> {dimensions.length} Dimensions</span>
          <span className="meta-item"><FiTarget /> {totalQ} Questions</span>
          <span className="meta-item"><FiClock /> ~{type.framework?.estimatedMinutes || 15} mins</span>
        </div>

        {dimensions.length > 0 && (
          <div className="pillars">
            {visibleDims.map((dim, dIdx) => (
              <PillarTag key={dim.id || dIdx} title={`${dim.questions?.length || 0} questions`}>
                {dim.name}
              </PillarTag>
            ))}
            {dimensions.length > 4 && (
              <PillarTag
                as="button"
                type="button"
                onClick={() => togglePreview(type.typeKey)}
                style={{ cursor: 'pointer', fontFamily: 'inherit', color: '#2563eb', borderColor: '#bfdbfe', background: '#eff6ff', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                title={isExpanded ? 'Collapse dimension list' : 'Preview all dimensions'}
              >
                {isExpanded ? <><FiChevronUp size={12} /> Show less</> : <><FiChevronDown size={12} /> +{hiddenCount} more</>}
              </PillarTag>
            )}
          </div>
        )}

        <div className="footer" style={{ ...FOOTER_PIN_STYLE, justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
          <PromoteToggle
            type="button"
            $promoted={type.isPromoted}
            onClick={() => handleTogglePromote(type)}
            title={type.isPromoted ? 'Remove from the Assessments navigation menu' : 'Pin this framework to the Assessments navigation menu'}
          >
            {type.isPromoted ? <FiToggleRight /> : <FiToggleLeft />}
            {type.isPromoted ? 'Pinned in Nav' : (isDraft ? 'Promote to Prod' : 'Pin to Nav')}
          </PromoteToggle>
          <div className="actions" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <ActionButton onClick={() => handleEditType(type)} title="Edit assessment responses">
              <FiEdit2 /> Edit
            </ActionButton>
            <ActionButton onClick={() => handleCloneType(type)} title="Clone this assessment template">
              <FiCopy /> Clone
            </ActionButton>
            <ActionButton
              onClick={() => handleDeleteType(type)}
              title="Delete this template"
              style={{ color: '#dc2626', borderColor: '#fecaca', background: '#fef2f2' }}
            >
              <FiTrash2 /> Delete
            </ActionButton>
            <ActionButton
              onClick={() => handleTrySample(type)}
              title="Open a sample executive report for this framework"
              style={{ color: '#059669', borderColor: '#a7f3d0', background: '#ecfdf5' }}
            >
              🧪 Try Sample
            </ActionButton>
            <ActionButton className="primary" onClick={() => handleOpenStartModal(type)} title="Start a new customer assessment with this framework">
              <FiPlay /> Start Assessment
            </ActionButton>
          </div>
        </div>
      </AssessmentCard>
    );
  };

  const renderRunCard = (run) => {
    const hasReport = !!run.aiReport;
    const score = Number(run.totalScore || 0);
    const status = hasReport ? 'completed' : (score > 0 ? 'in_progress' : 'not_started');
    const statusLabel = hasReport ? 'Completed' : (score > 0 ? 'In Progress' : 'Not Started');
    const pct = Math.max(0, Math.min(100, Math.round((score / 5) * 100)));
    const typeMeta = types.find(t => t.typeKey === run.typeKey);
    const badge = { ...SUITE_BADGES.dynamic, label: typeMeta?.badge || SUITE_BADGES.dynamic.label };
    const owner = run.contactEmail ? run.contactEmail.split('@')[0] : 'Lead Architect';
    const openRun = () => navigate(hasReport ? `/assessments/report/${run.id}` : `/assessments/run/instance/${run.id}`);

    return (
      <AssessmentCard
        key={run.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        onClick={openRun}
        style={CARD_FLEX_STYLE}
      >
        <div className="header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
              <span style={badgeStyle(badge)}>{badge.label}</span>
            </div>
            <div className="title">{run.frameworkSnapshot?.title || typeMeta?.title || run.typeKey}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', fontSize: '0.84rem', fontWeight: 600, color: '#334155', marginTop: '6px' }}>
              <span>{run.customerName || 'Customer'}</span>
              {run.useCase && (
                <span style={{ color: '#64748b', fontWeight: 500 }}>• {run.useCase}</span>
              )}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '6px' }}>
              Owner: <strong style={{ color: '#475569', fontWeight: 600 }}>{owner}</strong> • {formatDate(run.updatedAt || run.createdAt)}
            </div>
          </div>
          <StatusBadge $status={status} style={{ whiteSpace: 'nowrap' }}>{statusLabel}</StatusBadge>
        </div>

        <div className="progress-section">
          <div className="progress-label">
            <span>Maturity Score{run.maturityLevel ? ` • ${run.maturityLevel}` : ''}</span>
            <span><strong>{score > 0 ? `${score.toFixed(1)} / 5.0` : 'In Progress'}</strong></span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>

        <div className="footer" style={FOOTER_PIN_STYLE}>
          <div className="actions" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <ActionButton onClick={stopThen(() => navigate(`/assessments/run/instance/${run.id}`))} title="Edit assessment responses">
              <FiEdit2 /> Edit
            </ActionButton>
            <ActionButton onClick={stopThen(() => handleCloneInstance(run))} title="Clone this assessment">
              <FiCopy /> Clone
            </ActionButton>
            <ActionButton
              onClick={stopThen(() => handleDeleteInstance(run))}
              title="Delete this assessment"
              style={{ color: '#dc2626', borderColor: '#fecaca', background: '#fef2f2' }}
            >
              <FiTrash2 /> Delete
            </ActionButton>
            <ActionButton
              className="primary"
              disabled={!hasReport}
              onClick={stopThen(() => navigate(`/assessments/report/${run.id}`))}
              title={hasReport ? 'View executive assessment report' : 'Complete the assessment to generate the executive report'}
            >
              <FiStar /> Report
            </ActionButton>
          </div>
        </div>
      </AssessmentCard>
    );
  };

  const renderSearchEmptyState = () => (
    <EmptyState>
      <div className="icon"><FiSearch /></div>
      <div className="title">No matches for “{searchTerm.trim()}”</div>
      <div className="message">Try a different keyword, or clear the search and filters to see the full catalog.</div>
      <SecondaryButton onClick={() => { setSearchTerm(''); setTemplateFilter('all'); setRunFilter('all'); }} style={{ margin: '0 auto' }}>
        Clear search &amp; filters
      </SecondaryButton>
    </EmptyState>
  );

  if (loading) {
    return <LoadingSpinner message="Loading Assessment Hub..." />;
  }

  return (
    <PageContainer>
      <ContentContainer>
        <HeaderSection>
          <div className="left">
            <h1>Assessment Catalog &amp; Templates</h1>
            <p>
              Explore verified production-ready frameworks, launch customized customer evaluations, and manage AI-generated assessment drafts.
            </p>
          </div>
          <div className="right">
            <SecondaryButton
              onClick={() => setIsUploadModalOpen(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiUploadCloud size={16} />
              Auto-Populate from Document
            </SecondaryButton>
            <PrimaryButton
              onClick={() => navigate('/assessments/ai-generator')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <HiSparkles size={16} />
              Create with Gemini 3.8 Flash
            </PrimaryButton>
          </div>
        </HeaderSection>

        {/* Collection pills (same rail as the /assessments suite filter) */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
          marginBottom: '16px',
          alignItems: 'center'
        }}>
          {collectionPills.map(({ id, label, count, color, Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                data-hub-collection={id}
                onClick={() => setActiveTab(id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '999px',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 700 : 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: isActive ? color : '#ffffff',
                  color: isActive ? '#ffffff' : '#475569',
                  border: `1.5px solid ${isActive ? color : '#e2e8f0'}`,
                  boxShadow: isActive ? '0 4px 12px rgba(15, 23, 42, 0.12)' : '0 1px 2px rgba(0, 0, 0, 0.04)'
                }}
              >
                <Icon size={15} />
                <span>{label}</span>
                <span style={{
                  background: isActive ? 'rgba(255, 255, 255, 0.22)' : '#f1f5f9',
                  color: isActive ? '#ffffff' : '#334155',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  fontWeight: 700
                }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Filter Bar */}
        <FilterBar>
          <div className="top-row">
            <SearchBox>
              <FiSearch size={18} />
              <input
                type="text"
                placeholder={activeTab === 'portfolio'
                  ? 'Search customers, initiatives, frameworks...'
                  : 'Search frameworks, badges, dimensions...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </SearchBox>
            {activeTab === 'portfolio' ? (
              <TabGroup>
                <Tab $active={runFilter === 'all'} onClick={() => setRunFilter('all')}>All</Tab>
                <Tab $active={runFilter === 'completed'} onClick={() => setRunFilter('completed')}>Completed</Tab>
                <Tab $active={runFilter === 'in_progress'} onClick={() => setRunFilter('in_progress')}>In Progress</Tab>
              </TabGroup>
            ) : (
              <TabGroup>
                <Tab $active={templateFilter === 'all'} onClick={() => setTemplateFilter('all')}>All</Tab>
                <Tab $active={templateFilter === 'pinned'} onClick={() => setTemplateFilter('pinned')}>Pinned in Nav</Tab>
                <Tab $active={templateFilter === 'unpinned'} onClick={() => setTemplateFilter('unpinned')}>Not Pinned</Tab>
              </TabGroup>
            )}
          </div>
          <div className="bottom-row">
            {activeTab !== 'portfolio' && (
              <Dropdown value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="catalog">Sort by: Catalog order</option>
                <option value="title">Sort by: Title A–Z</option>
                <option value="questions">Sort by: Most questions</option>
              </Dropdown>
            )}
            <span style={{ marginLeft: 'auto', fontSize: '0.813rem', color: '#64748b' }}>
              Showing <strong style={{ color: '#1e293b' }}>{visibleCount}</strong> of {totalCount}
              {activeTab === 'portfolio' ? ' customer runs' : activeTab === 'drafts' ? ' draft frameworks' : ' production frameworks'}
            </span>
          </div>
        </FilterBar>

        {/* Tab 1: Production Ready Templates */}
        {activeTab === 'production' && (
          (visibleSpecialized.length + visibleProductionTypes.length) === 0 ? (
            renderSearchEmptyState()
          ) : (
            <AssessmentsGrid>
              {visibleSpecialized.map(renderSpecializedCard)}
              {visibleProductionTypes.map((type) => renderTypeCard(type, { isDraft: false }))}
            </AssessmentsGrid>
          )
        )}

        {/* Tab 2: Drafts & AI Generated Frameworks */}
        {activeTab === 'drafts' && (
          draftTypes.length === 0 ? (
            <EmptyState>
              <div className="icon"><HiSparkles /></div>
              <div className="title">No Draft Frameworks</div>
              <div className="message">
                Generate custom assessment frameworks for specific industries, customer migrations, or emerging technology stacks using Gemini 3.8 Flash.
              </div>
              <PrimaryButton
                onClick={() => navigate('/assessments/ai-generator')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{ margin: '0 auto' }}
              >
                <HiSparkles size={16} /> Generate New Assessment
              </PrimaryButton>
            </EmptyState>
          ) : visibleDraftTypes.length === 0 ? (
            renderSearchEmptyState()
          ) : (
            <AssessmentsGrid>
              {visibleDraftTypes.map((type) => renderTypeCard(type, { isDraft: true }))}
            </AssessmentsGrid>
          )
        )}

        {/* Tab 3: Customer Portfolio Runs */}
        {activeTab === 'portfolio' && (
          instances.length === 0 ? (
            <EmptyState>
              <div className="icon"><FiList /></div>
              <div className="title">No Customer Assessments Yet</div>
              <div className="message">
                Launch a new evaluation with a client or try a sample assessment to see the interactive 5-column runner and executive report.
              </div>
              <PrimaryButton
                onClick={() => setActiveTab('production')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{ margin: '0 auto' }}
              >
                Explore Assessment Templates
              </PrimaryButton>
            </EmptyState>
          ) : visibleInstances.length === 0 ? (
            renderSearchEmptyState()
          ) : (
            <AssessmentsGrid>
              {visibleInstances.map(renderRunCard)}
            </AssessmentsGrid>
          )
        )}
      </ContentContainer>

      {/* Start Assessment Modal */}
      {startModalType && (
        <ModalOverlay onClick={() => setStartModalType(null)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.2rem' }}>
                <FiPlay />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>Start New Assessment</h3>
                <span style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>{startModalType.title}</span>
              </div>
            </div>

            <form onSubmit={handleLaunchAssessment}>
              <FormGroup>
                <Label>Customer / Organization Name *</Label>
                <Input 
                  type="text" 
                  value={modalForm.customerName}
                  onChange={e => setModalForm({ ...modalForm, customerName: e.target.value })}
                  placeholder="e.g. Acme Health Systems"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Primary Initiative / Use Case</Label>
                <Input 
                  type="text" 
                  value={modalForm.useCase}
                  onChange={e => setModalForm({ ...modalForm, useCase: e.target.value })}
                  placeholder="e.g. OpenAI to Gemini Migration"
                />
              </FormGroup>

              <FormGroup>
                <Label>Lead Evaluator Email</Label>
                <Input 
                  type="email" 
                  value={modalForm.contactEmail}
                  onChange={e => setModalForm({ ...modalForm, contactEmail: e.target.value })}
                  placeholder="e.g. lead.evaluator@enterprise.com"
                />
              </FormGroup>

              <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
                <SecondaryButton type="button" onClick={() => setStartModalType(null)} style={{ flex: 1 }}>
                  Cancel
                </SecondaryButton>
                <PrimaryButton type="submit" style={{ flex: 2 }}>
                  Launch Assessment →
                </PrimaryButton>
              </div>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Multimodal Architecture Document Upload Modal */}
      <UploadDocumentModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
    </PageContainer>
  );
};

export default DynamicAssessmentHub;
