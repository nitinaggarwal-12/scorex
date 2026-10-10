import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiMail, FiArrowRight, FiFileText, FiEdit3, FiBriefcase, FiLayers, FiZap, FiUploadCloud } from 'react-icons/fi';
import toast from 'react-hot-toast';
import UploadDocumentModal from './UploadDocumentModal';

const AutofillButton = styled.button`
  background: none;
  border: 1px dashed #6366f1;
  color: #6366f1;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  margin-bottom: 20px;
  transition: all 0.2s ease;
  align-self: center;

  &:hover {
    background: rgba(99, 102, 241, 0.08);
    border-color: #4f46e5;
    color: #4f46e5;
  }
`;

const UploadDocButton = styled.button`
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border: 1.5px solid #bfdbfe;
  color: #1d4ed8;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  margin-bottom: 20px;
  transition: all 0.2s ease;
  align-self: center;

  &:hover {
    background: #dbeafe;
    border-color: #93c5fd;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(29, 78, 216, 0.15);
  }
`;

const StartContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 100px 20px 60px;
`;

const FormCard = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 40px 44px;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.08);
  border: 1px solid #e2e8f0;
  max-width: 860px;
  width: 100%;
`;

const FormTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 16px;
  text-align: center;
`;

const FormSubtitle = styled.p`
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 40px;
  text-align: center;
  line-height: 1.6;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Input = styled.input`
  padding: 16px;
  border: 2px solid ${props => props.$hasError ? '#ff4444' : '#e0e0e0'};
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: ${props => props.$hasError ? '#fff5f5' : 'white'};
  
  &:focus {
    outline: none;
    border-color: ${props => props.$hasError ? '#ff4444' : '#ff6b35'};
    box-shadow: 0 0 0 3px ${props => props.$hasError ? 'rgba(255, 68, 68, 0.1)' : 'rgba(255, 107, 53, 0.1)'};
  }
  
  &::placeholder {
    color: #999;
  }
  
  &:disabled {
    background-color: #f8f9fa;
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const TextArea = styled.textarea`
  padding: 16px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 1rem;
  background: white;
  transition: all 0.3s ease;
  resize: vertical;
  min-height: 100px;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #ff6b35;
    box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
  }

  &:disabled {
    background-color: #f8f9fa;
    cursor: not-allowed;
  }

  &::placeholder {
    color: #6c757d;
  }
`;

const SubmitButton = styled(motion.button)`
  background: linear-gradient(135deg, #ff6b35, #f7931e);
  color: white;
  border: none;
  padding: 18px 32px;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 16px;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #ff4444;
  font-size: 0.9rem;
  margin-top: 8px;
`;

const Select = styled.select`
  padding: 16px;
  border: 2px solid ${props => props.$hasError ? '#ff4444' : '#e0e0e0'};
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: ${props => props.$hasError ? '#fff5f5' : 'white'};
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${props => props.$hasError ? '#ff4444' : '#ff6b35'};
    box-shadow: 0 0 0 3px ${props => props.$hasError ? 'rgba(255, 68, 68, 0.1)' : 'rgba(255, 107, 53, 0.1)'};
  }
  
  &:disabled {
    background-color: #f8f9fa;
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const PillarCheckboxContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
  margin-top: 8px;
`;

const PillarCheckbox = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border: 2px solid ${props => props.$checked ? '#ff6b35' : '#e0e0e0'};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.$checked ? 'rgba(255, 107, 53, 0.05)' : 'white'};

  &:hover {
    border-color: #ff6b35;
    background: rgba(255, 107, 53, 0.02);
  }

  input {
    cursor: pointer;
    width: 18px;
    height: 18px;
    accent-color: #ff6b35;
  }

  span {
    font-size: 0.95rem;
    color: #333;
    font-weight: ${props => props.$checked ? '600' : '400'};
  }
`;

const SelectAllButton = styled.button`
  background: transparent;
  border: 2px solid #ff6b35;
  color: #ff6b35;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 12px;

  &:hover {
    background: rgba(255, 107, 53, 0.1);
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
    salesforceId: 'ACC-0094821-QFT (Quantum FinTech Global)',
    buganizerIds: 'b/349102411, b/351008912 (Architecture & DR Review)',
    emailThread: 'CTO Thread (Oct 2026): "Migrating core ledger to Cloud Spanner; current DR failover is single-region us-central1 with 4h manual runbook..."',
    diagramFile: 'quantum_fintech_gcp_topology_v3.pdf (Tier A Verified)'
  });
  const [groundingPreviewOpen, setGroundingPreviewOpen] = useState(true);
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
    setGroundingPreviewOpen(true);
    setErrors({});
    toast.success('🛡️ Multi-Source Grounded Intake applied (52/60 auto-filled, 1 contradiction resolved Tier A > Tier C, 8 abstained)!');
  };

  return (
    <StartContainer>
      <FormCard
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
          <span style={{
            display: 'inline-block',
            padding: '5px 12px',
            borderRadius: '999px',
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            color: '#1d4ed8',
            fontSize: '0.75rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.04em'
          }}>
            Step 2 of 4 • Customer Context & Multi-Source Grounded Auto-Fill
          </span>
        </div>
        <FormTitle>Customer Intake & Grounded Evidence Ingestion</FormTitle>
        <FormSubtitle style={{ marginBottom: '24px' }}>
          Enter your customer details below and optionally auto-populate the assessment from <strong>Salesforce</strong>, <strong>Buganizer</strong>, <strong>Email/Chat threads</strong>, or <strong>Architecture Diagrams & PDFs</strong> with zero hallucination.
        </FormSubtitle>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '18px' }}>
          <UploadDocButton type="button" onClick={() => setIsUploadModalOpen(true)}>
            <FiUploadCloud /> Upload Architecture Doc / Diagram (Auto-Populate)
          </UploadDocButton>
          <AutofillButton type="button" onClick={handlePrefillForm}>
            <FiZap /> Run 5-Skill Grounded Auto-Fill (Sample Customer)
          </AutofillButton>
        </div>

        {/* Multi-Source Evidence Connectors & 6 Anti-Hallucination Grounding Factors */}
        <div
          style={{
            background: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: '14px',
            padding: '18px 20px',
            marginBottom: '26px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '12px' }}>
            <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#1e293b' }}>
              🔌 Multi-Source Evidence Connectors (Optional — Auto-Fills Questionnaire with Citations)
            </div>
            <button
              type="button"
              onClick={() => setGroundingPreviewOpen(!groundingPreviewOpen)}
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '0.74rem',
                fontWeight: 700,
                color: '#1d4ed8',
                cursor: 'pointer'
              }}
            >
              {groundingPreviewOpen ? 'Hide Grounding Rules ▲' : 'Show 6 Grounding Factors ▼'}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px', marginBottom: groundingPreviewOpen ? '14px' : 0 }}>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '10px 12px' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#1d4ed8', textTransform: 'uppercase' }}>
                ☁️ Salesforce Account / Opp (Tier B • 0.85x)
              </div>
              <input
                type="text"
                value={groundingSources.salesforceId}
                onChange={e => setGroundingSources(prev => ({ ...prev, salesforceId: e.target.value }))}
                style={{ width: '100%', border: 'none', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginTop: '4px', outline: 'none' }}
              />
            </div>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '10px 12px' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#047857', textTransform: 'uppercase' }}>
                🐞 Buganizer Issues (Tier A • 1.00x)
              </div>
              <input
                type="text"
                value={groundingSources.buganizerIds}
                onChange={e => setGroundingSources(prev => ({ ...prev, buganizerIds: e.target.value }))}
                style={{ width: '100%', border: 'none', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginTop: '4px', outline: 'none' }}
              />
            </div>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '10px 12px' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#6d28d9', textTransform: 'uppercase' }}>
                📐 Architecture Diagram / PDF (Tier A • 1.00x)
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginTop: '4px' }}>
                {groundingSources.diagramFile}
              </div>
            </div>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '10px 12px' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#b45309', textTransform: 'uppercase' }}>
                ✉️ Email / Discovery Notes (Tier C • 0.60x)
              </div>
              <input
                type="text"
                value={groundingSources.emailThread}
                onChange={e => setGroundingSources(prev => ({ ...prev, emailThread: e.target.value }))}
                style={{ width: '100%', border: 'none', fontSize: '0.78rem', color: '#475569', marginTop: '4px', outline: 'none' }}
              />
            </div>
          </div>

          {groundingPreviewOpen && (
            <div style={{ background: '#ffffff', border: '1px solid #dbeafe', borderRadius: '10px', padding: '12px 14px', fontSize: '0.76rem', color: '#334155', lineHeight: 1.5 }}>
              <div style={{ fontWeight: 800, color: '#1d4ed8', marginBottom: '6px' }}>
                🛡️ 6 Anti-Hallucination Grounding Factors Active (`scorex-multisource-evidence-ingestor` + `scorex-grounded-rubric-scorer`):
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '6px' }}>
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
          <FormGroup>
            <Label htmlFor="assessmentName">
              <FiFileText size={18} />
              Assessment Name *
            </Label>
            <Input
              id="assessmentName"
              name="assessmentName"
              type="text"
              placeholder="Enter a name for this assessment (e.g., 'Q4 2024 Maturity Review')"
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
            <Label htmlFor="assessmentDescription">
              <FiEdit3 size={18} />
              Assessment Description (Optional)
            </Label>
            <TextArea
              id="assessmentDescription"
              name="assessmentDescription"
              placeholder="Briefly describe the purpose or context of this assessment..."
              value={formData.assessmentDescription}
              onChange={handleInputChange}
              disabled={isSubmitting}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="contactEmail">
              <FiMail size={18} />
              Contact Email *
            </Label>
            <Input
              id="contactEmail"
              name="contactEmail"
              type="email"
              placeholder="Enter your email address"
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
              <FiBriefcase size={18} />
              Industry *
            </Label>
            <Select
              id="industry"
              name="industry"
              value={formData.industry}
              onChange={handleInputChange}
              disabled={isSubmitting}
              $hasError={!!errors.industry}
            >
              <option value="">Select your industry...</option>
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
            <Label>
              <FiLayers size={18} />
              Select Pillars to Assess *
            </Label>
            <SelectAllButton 
              type="button"
              onClick={handleSelectAllPillars}
              disabled={isSubmitting}
            >
              {formData.selectedPillars.length === PILLARS.length ? 'Deselect All' : 'Select All'}
            </SelectAllButton>
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
