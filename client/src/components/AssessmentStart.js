import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiMail, FiArrowRight, FiFileText, FiEdit3, FiBriefcase, FiLayers, FiZap, FiUploadCloud } from 'react-icons/fi';
import toast from 'react-hot-toast';
import UploadDocumentModal from './UploadDocumentModal';

const AutofillButton = styled.button`
  background: #f5f3ff;
  border: 1.5px dashed #6366f1;
  color: #4f46e5;
  padding: 9px 16px;
  border-radius: 10px;
  font-size: 0.84rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: #ede9fe;
    border-color: #4f46e5;
    color: #3730a3;
    transform: translateY(-1px);
  }
`;

const UploadDocButton = styled.button`
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border: 1.5px solid #93c5fd;
  color: #1d4ed8;
  padding: 9px 16px;
  border-radius: 10px;
  font-size: 0.84rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: #dbeafe;
    border-color: #60a5fa;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(29, 78, 216, 0.15);
  }
`;

const StartContainer = styled.div`
  min-height: 100vh;
  background: #f8fafc;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 76px clamp(16px, 1.8vw, 28px) 32px;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
`;

const FormCard = styled(motion.div)`
  background: #ffffff;
  border-radius: 16px;
  padding: 22px clamp(20px, 2.2vw, 32px);
  box-shadow: 0 10px 32px rgba(15, 23, 42, 0.06);
  border: 1px solid #cbd5e1;
  max-width: 100%;
  width: 100%;
  box-sizing: border-box;
`;

const FormTitle = styled.h1`
  font-size: 1.65rem;
  font-weight: 800;
  color: #0f172a;
  margin: 4px 0 4px;
  letter-spacing: -0.02em;
`;

const FormSubtitle = styled.p`
  font-size: 0.9rem;
  color: #475569;
  margin: 0;
  line-height: 1.45;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const IntakeFieldsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px 18px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const Label = styled.label`
  font-size: 0.85rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const Input = styled.input`
  padding: 11px 14px;
  border: 1.5px solid ${props => props.$hasError ? '#ef4444' : '#cbd5e1'};
  border-radius: 10px;
  font-size: 0.92rem;
  color: #0f172a;
  font-weight: 500;
  transition: all 0.2s ease;
  background-color: ${props => props.$hasError ? '#fef2f2' : '#f8fafc'};
  
  &:focus {
    outline: none;
    background-color: #ffffff;
    border-color: ${props => props.$hasError ? '#ef4444' : '#2563eb'};
    box-shadow: 0 0 0 3px ${props => props.$hasError ? 'rgba(239, 68, 68, 0.12)' : 'rgba(37, 99, 235, 0.14)'};
  }
  
  &::placeholder {
    color: #94a3b8;
  }
  
  &:disabled {
    background-color: #f1f5f9;
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const TextArea = styled.textarea`
  padding: 11px 14px;
  border: 1.5px solid #cbd5e1;
  border-radius: 10px;
  font-size: 0.92rem;
  color: #0f172a;
  background: #f8fafc;
  transition: all 0.2s ease;
  resize: vertical;
  min-height: 44px;
  height: 44px;
  font-family: inherit;

  &:focus {
    outline: none;
    background: #ffffff;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.14);
  }

  &:disabled {
    background-color: #f1f5f9;
    cursor: not-allowed;
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

const SubmitButton = styled(motion.button)`
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: #ffffff;
  border: none;
  padding: 14px 28px;
  font-size: 1rem;
  font-weight: 800;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 4px;
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.25);
  
  &:hover {
    background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  font-size: 0.8rem;
  font-weight: 600;
  margin-top: 5px;
`;

const Select = styled.select`
  padding: 11px 14px;
  border: 1.5px solid ${props => props.$hasError ? '#ef4444' : '#cbd5e1'};
  border-radius: 10px;
  font-size: 0.92rem;
  color: #0f172a;
  font-weight: 500;
  transition: all 0.2s ease;
  background-color: ${props => props.$hasError ? '#fef2f2' : '#f8fafc'};
  cursor: pointer;
  
  &:focus {
    outline: none;
    background-color: #ffffff;
    border-color: ${props => props.$hasError ? '#ef4444' : '#2563eb'};
    box-shadow: 0 0 0 3px ${props => props.$hasError ? 'rgba(239, 68, 68, 0.12)' : 'rgba(37, 99, 235, 0.14)'};
  }
  
  &:disabled {
    background-color: #f1f5f9;
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const PillarCheckboxContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 10px;
  margin-top: 6px;

  @media (max-width: 1280px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 680px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const PillarCheckbox = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border: 1.5px solid ${props => props.$checked ? '#2563eb' : '#cbd5e1'};
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.$checked ? '#eff6ff' : '#f8fafc'};

  &:hover {
    border-color: #2563eb;
    background: #eff6ff;
  }

  input {
    cursor: pointer;
    width: 16px;
    height: 16px;
    accent-color: #2563eb;
    flex-shrink: 0;
  }

  span {
    font-size: 0.86rem;
    color: ${props => props.$checked ? '#1e3a8a' : '#334155'};
    font-weight: ${props => props.$checked ? '700' : '600'};
  }
`;

const SelectAllButton = styled.button`
  background: #eff6ff;
  border: 1px solid #93c5fd;
  color: #1d4ed8;
  padding: 5px 12px;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #dbeafe;
  }
`;


const INDUSTRIES = [
  'Healthcare',
  'Life Sciences',
  'Financial Services',
  'Manufacturing',
  'Retail & Consumer Goods',
  'Technology & Software',
  'Telecommunications',
  'Energy & Utilities',
  'Media & Entertainment',
  'Public Sector',
  'Education',
  'Other'
];

const PILLARS = [
  { id: 'platform_governance', name: '🧱 Platform & Governance' },
  { id: 'data_engineering', name: '💾 Data Engineering' },
  { id: 'analytics_bi', name: '📊 Analytics & BI' },
  { id: 'machine_learning', name: '🤖 Machine Learning' },
  { id: 'generative_ai', name: '✨ Generative AI' },
  { id: 'operational_excellence', name: '⚡ Operational Excellence' }
];

const AssessmentStart = ({ onStart }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    contactEmail: '',
    assessmentName: '',
    assessmentDescription: '',
    industry: '',
    selectedPillars: []
  });
  const [groundingSources, setGroundingSources] = useState({
    salesforceId: '',
    buganizerIds: '',
    emailThread: '',
    diagramFile: ''
  });
  const [groundingPreviewOpen, setGroundingPreviewOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePillarToggle = (pillarId) => {
    setFormData(prev => {
      const isSelected = prev.selectedPillars.includes(pillarId);
      return {
        ...prev,
        selectedPillars: isSelected
          ? prev.selectedPillars.filter(id => id !== pillarId)
          : [...prev.selectedPillars, pillarId]
      };
    });
    
    // Clear error when user selects a pillar
    if (errors.selectedPillars) {
      setErrors(prev => ({
        ...prev,
        selectedPillars: ''
      }));
    }
  };

  const handleSelectAllPillars = () => {
    if (formData.selectedPillars.length === PILLARS.length) {
      // Deselect all
      setFormData(prev => ({ ...prev, selectedPillars: [] }));
    } else {
      // Select all
      setFormData(prev => ({ ...prev, selectedPillars: PILLARS.map(p => p.id) }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email address';
    }

    if (!formData.assessmentName.trim()) {
      newErrors.assessmentName = 'Assessment name is required';
    }

    if (!formData.industry) {
      newErrors.industry = 'Please select an industry';
    }

    if (formData.selectedPillars.length === 0) {
      newErrors.selectedPillars = 'Please select at least one pillar';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      
      return;
    }

    setIsSubmitting(true);

    try {
      const assessment = await onStart(formData);
      
      
      // Navigate to first selected pillar
      const firstPillar = formData.selectedPillars[0];
      navigate(`/assessment/${assessment.assessmentId}/${firstPillar}`);
    } catch (error) {
      console.error('Error starting assessment:', error);
      
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrefillForm = () => {
    setFormData({
      assessmentName: 'Quantum FinTech — Enterprise Data & AI Maturity Review',
      assessmentDescription: 'Grounded via Salesforce ACC-0094821-QFT, Buganizer b/349102411, and Architecture Diagram v3.0 (52/60 questions auto-filled with Tier A/B/C citations; 8 abstained for live discovery).',
      contactEmail: 'lead.architect@quantum-fintech.com',
      industry: 'Financial Services',
      selectedPillars: PILLARS.map(p => p.id)
    });
    setGroundingSources({
      salesforceId: 'ACC-0094821-QFT (Quantum FinTech)',
      buganizerIds: 'b/349102411, b/351092810',
      diagramFile: 'gcp_hybrid_mesh_v3.drawio.xml (Tier A • 1.00x)',
      emailThread: 'VP Eng Discovery Notes (2026-09-14)'
    });
    setGroundingPreviewOpen(true);
    setErrors({});
    toast.success('🛡️ Multi-Source Grounded Intake applied (52/60 auto-filled, 1 contradiction resolved Tier A > Tier C, 8 abstained)!');
  };

  return (
    <StartContainer>
      <FormCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        {/* Top Executive Header Bar: Left Title/Subtitle + Right Auto-Populate Actions */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '16px',
          paddingBottom: '16px',
          marginBottom: '16px',
          borderBottom: '1px solid #e2e8f0'
        }}>
          <div style={{ flex: '1 1 520px', minWidth: 0 }}>
            <span style={{
              display: 'inline-block',
              padding: '3px 10px',
              borderRadius: '999px',
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              color: '#1d4ed8',
              fontSize: '0.7rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.04em'
            }}>
              Step 2 of 4 • Customer Context & Multi-Source Grounded Auto-Fill
            </span>
            <FormTitle>Customer Intake & Grounded Evidence Ingestion</FormTitle>
            <FormSubtitle>
              Enter customer details below and optionally connect <strong>Salesforce CRM</strong>, <strong>Buganizer</strong>, <strong>Email/Chat threads</strong>, or <strong>Architecture Diagrams & PDFs</strong> for zero-hallucination auto-fill.
            </FormSubtitle>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <UploadDocButton type="button" onClick={() => setIsUploadModalOpen(true)}>
              <FiUploadCloud size={16} /> Upload Architecture Doc / Diagram
            </UploadDocButton>
            <AutofillButton type="button" onClick={handlePrefillForm}>
              <FiZap size={16} /> Run 5-Skill Grounded Auto-Fill (Sample)
            </AutofillButton>
          </div>
        </div>

        {/* Multi-Source Evidence Connectors & 6 Anti-Hallucination Grounding Factors */}
        <div
          style={{
            background: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: '12px',
            padding: '14px 16px',
            marginBottom: '18px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
            <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0f172a' }}>
              🔌 Multi-Source Evidence Connectors <span style={{ fontWeight: 500, color: '#64748b', fontSize: '0.78rem' }}>(Optional — Auto-populates questions with Tier A/B/C citations)</span>
            </div>
            <button
              type="button"
              onClick={() => setGroundingPreviewOpen(!groundingPreviewOpen)}
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '0.73rem',
                fontWeight: 700,
                color: '#1d4ed8',
                cursor: 'pointer'
              }}
            >
              {groundingPreviewOpen ? 'Hide Grounding Rules ▲' : 'Show 6 Grounding Factors ▼'}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '10px', marginBottom: groundingPreviewOpen ? '12px' : 0 }}>
            <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '9px 11px' }}>
              <label style={{ fontSize: '0.68rem', fontWeight: 800, color: '#1d4ed8', textTransform: 'uppercase', display: 'block', marginBottom: '5px' }}>
                ☁️ Salesforce Account / Opp (Tier B • 0.85x)
              </label>
              <input
                type="text"
                placeholder="e.g. 0014M00001hZEwfQAG or Account"
                value={groundingSources.salesforceId}
                onChange={e => setGroundingSources(prev => ({ ...prev, salesforceId: e.target.value }))}
                style={{ width: '100%', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px 9px', fontSize: '0.78rem', fontWeight: 600, color: '#0f172a', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '9px 11px' }}>
              <label style={{ fontSize: '0.68rem', fontWeight: 800, color: '#047857', textTransform: 'uppercase', display: 'block', marginBottom: '5px' }}>
                🐞 Buganizer Issues (Tier A • 1.00x)
              </label>
              <input
                type="text"
                placeholder="e.g. b/349102411, b/351092810"
                value={groundingSources.buganizerIds}
                onChange={e => setGroundingSources(prev => ({ ...prev, buganizerIds: e.target.value }))}
                style={{ width: '100%', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px 9px', fontSize: '0.78rem', fontWeight: 600, color: '#0f172a', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '9px 11px' }}>
              <label style={{ fontSize: '0.68rem', fontWeight: 800, color: '#6d28d9', textTransform: 'uppercase', display: 'block', marginBottom: '5px' }}>
                📐 Architecture Diagram / PDF (Tier A • 1.00x)
              </label>
              <input
                type="text"
                placeholder="e.g. gcp_hybrid_mesh_v3.drawio.xml"
                value={groundingSources.diagramFile}
                onChange={e => setGroundingSources(prev => ({ ...prev, diagramFile: e.target.value }))}
                style={{ width: '100%', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px 9px', fontSize: '0.78rem', fontWeight: 600, color: '#0f172a', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '9px 11px' }}>
              <label style={{ fontSize: '0.68rem', fontWeight: 800, color: '#b45309', textTransform: 'uppercase', display: 'block', marginBottom: '5px' }}>
                ✉️ Email / Discovery Notes (Tier C • 0.60x)
              </label>
              <input
                type="text"
                placeholder="e.g. QBR thread or stakeholder notes"
                value={groundingSources.emailThread}
                onChange={e => setGroundingSources(prev => ({ ...prev, emailThread: e.target.value }))}
                style={{ width: '100%', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px 9px', fontSize: '0.78rem', fontWeight: 600, color: '#0f172a', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          {groundingPreviewOpen && (
            <div style={{ background: '#ffffff', border: '1px solid #dbeafe', borderRadius: '10px', padding: '10px 14px', fontSize: '0.75rem', color: '#334155', lineHeight: 1.45 }}>
              <div style={{ fontWeight: 800, color: '#1d4ed8', marginBottom: '4px' }}>
                🛡️ 6 Anti-Hallucination Grounding Factors Active (`scorex-multisource-evidence-ingestor` + `scorex-grounded-rubric-scorer`):
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '4px 12px' }}>
                <div>• <strong>GF-1 Authority Tiering:</strong> Diagram/Buganizer (Tier A) &gt; CRM (Tier B) &gt; Email (Tier C)</div>
                <div>• <strong>GF-2 Verbatim Quote:</strong> Exact snippet + coordinate required per answer</div>
                <div>• <strong>GF-3 Rubric Entailment:</strong> Must prove target Level 1–5 SLA/RTO metrics</div>
                <div>• <strong>GF-4 Conflict Resolution:</strong> Tier A overrides optimistic Tier C email claims</div>
                <div>• <strong>GF-5 Abstention Gate:</strong> Confidence &lt; 0.75 stays unanswered for human review</div>
                <div>• <strong>GF-6 Forensic Critic:</strong> Cross-model audit via <code>scorex-omni-forensic-critic</code></div>
              </div>
            </div>
          )}
        </div>

        <Form onSubmit={handleSubmit}>
          {/* 2x2 Executive Intake Grid */}
          <IntakeFieldsGrid>
            <FormGroup>
              <Label htmlFor="assessmentName">
                <FiFileText size={16} color="#2563eb" />
                Assessment Name *
              </Label>
              <Input
                id="assessmentName"
                name="assessmentName"
                type="text"
                placeholder="e.g., Quantum FinTech — Q4 2026 Maturity Review"
                value={formData.assessmentName}
                onChange={handleInputChange}
                disabled={isSubmitting}
                $hasError={!!errors.assessmentName}
              />
              {errors.assessmentName && (
                <ErrorMessage>{errors.assessmentName}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="contactEmail">
                <FiMail size={16} color="#2563eb" />
                Stakeholder Contact Email *
              </Label>
              <Input
                id="contactEmail"
                name="contactEmail"
                type="email"
                placeholder="e.g., lead.architect@enterprise.com"
                value={formData.contactEmail}
                onChange={handleInputChange}
                disabled={isSubmitting}
                $hasError={!!errors.contactEmail}
              />
              {errors.contactEmail && (
                <ErrorMessage>{errors.contactEmail}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="industry">
                <FiBriefcase size={16} color="#2563eb" />
                Industry Vertical *
              </Label>
              <Select
                id="industry"
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
                disabled={isSubmitting}
                $hasError={!!errors.industry}
              >
                <option value="">Select industry vertical...</option>
                {INDUSTRIES.map(industry => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </Select>
              {errors.industry && (
                <ErrorMessage>{errors.industry}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="assessmentDescription">
                <FiEdit3 size={16} color="#2563eb" />
                Assessment Scope & Context (Optional)
              </Label>
              <TextArea
                id="assessmentDescription"
                name="assessmentDescription"
                placeholder="Briefly describe target workloads, executive sponsor, or business objectives..."
                value={formData.assessmentDescription}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
            </FormGroup>
          </IntakeFieldsGrid>

          <FormGroup>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', flexWrap: 'wrap', gap: '8px' }}>
              <Label style={{ marginBottom: 0 }}>
                <FiLayers size={16} color="#2563eb" />
                Select Architectural Pillars to Assess *
              </Label>
              <SelectAllButton 
                type="button"
                onClick={handleSelectAllPillars}
                disabled={isSubmitting}
              >
                {formData.selectedPillars.length === PILLARS.length ? '✓ Deselect All (6/6)' : 'Select All 6 Pillars'}
              </SelectAllButton>
            </div>
            <PillarCheckboxContainer>
              {PILLARS.map(pillar => (
                <PillarCheckbox
                  key={pillar.id}
                  $checked={formData.selectedPillars.includes(pillar.id)}
                >
                  <input
                    type="checkbox"
                    checked={formData.selectedPillars.includes(pillar.id)}
                    onChange={() => handlePillarToggle(pillar.id)}
                    disabled={isSubmitting}
                  />
                  <span>{pillar.name}</span>
                </PillarCheckbox>
              ))}
            </PillarCheckboxContainer>
            {errors.selectedPillars && (
              <ErrorMessage>{errors.selectedPillars}</ErrorMessage>
            )}
          </FormGroup>

          <SubmitButton
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isSubmitting ? 'Starting Assessment...' : 'Begin Assessment'}
            <FiArrowRight size={20} />
          </SubmitButton>
        </Form>
      </FormCard>

      <UploadDocumentModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
    </StartContainer>
  );
};

export default AssessmentStart;
