import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiUploadCloud, 
  FiFileText, 
  FiImage, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiX, 
  FiArrowRight, 
  FiCpu, 
  FiDatabase, 
  FiShield, 
  FiLayers 
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { autoPopulateFromDoc } from '../services/assessmentService';

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(8px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

const ModalCard = styled(motion.div)`
  background: #ffffff;
  border-radius: 24px;
  max-width: 680px;
  width: 100%;
  padding: 32px;
  box-shadow: 0 25px 60px -15px rgba(15, 23, 42, 0.3);
  border: 1.5px solid #e2e8f0;
  position: relative;
  max-height: 90vh;
  overflow-y: auto;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 24px;
  right: 24px;
  background: #f1f5f9;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #e2e8f0;
    color: #0f172a;
  }
`;

const Header = styled.div`
  margin-bottom: 24px;
`;

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  color: #1d4ed8;
  font-size: 0.78rem;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 20px;
  border: 1px solid #bfdbfe;
  margin-bottom: 12px;
`;

const Title = styled.h2`
  font-size: 1.6rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 6px 0;
  letter-spacing: -0.02em;
`;

const Subtitle = styled.p`
  font-size: 0.92rem;
  color: #64748b;
  margin: 0;
  line-height: 1.5;
`;

const DropZone = styled.div`
  border: 2px dashed ${props => props.$isDragging ? '#6366f1' : props.$hasFile ? '#10b981' : '#cbd5e1'};
  background: ${props => props.$isDragging ? '#eef2ff' : props.$hasFile ? '#f0fdf4' : '#f8fafc'};
  border-radius: 16px;
  padding: 36px 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.25s ease;
  position: relative;
  margin-bottom: 20px;

  &:hover {
    border-color: #6366f1;
    background: #f8faff;
  }
`;

const DropIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: ${props => props.$hasFile ? '#dcfce7' : '#e0e7ff'};
  color: ${props => props.$hasFile ? '#16a34a' : '#4f46e5'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  margin: 0 auto 14px;
  transition: all 0.2s;
`;

const FileBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: #ffffff;
  border: 1.5px solid #bbf7d0;
  padding: 8px 16px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  margin-top: 10px;
  font-size: 0.88rem;
  font-weight: 600;
  color: #166534;
`;

const MetaGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 24px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 0.82rem;
  font-weight: 700;
  color: #334155;
`;

const Input = styled.input`
  padding: 10px 14px;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.9rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #6366f1;
  }
`;

const Select = styled.select`
  padding: 10px 14px;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.9rem;
  background: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #6366f1;
  }
`;

const SubmitBtn = styled.button`
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 14px 28px;
  font-size: 1rem;
  font-weight: 700;
  width: 100%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 0 4px 15px rgba(79, 70, 229, 0.35);
  transition: all 0.2s;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(79, 70, 229, 0.45);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ProgressBox = styled.div`
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 14px;
  padding: 20px;
  margin-top: 20px;
`;

const StepItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  font-size: 0.88rem;
  color: ${props => props.$active ? '#4f46e5' : props.$done ? '#16a34a' : '#94a3b8'};
  font-weight: ${props => props.$active || props.$done ? '700' : '500'};

  &:last-child {
    margin-bottom: 0;
  }
`;

const ExtractionPreview = styled.div`
  background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%);
  border: 1.5px solid #86efac;
  border-radius: 16px;
  padding: 20px;
  margin-top: 20px;
`;

const INDUSTRIES = [
  'Retail & Consumer Goods',
  'Technology & Software',
  'Financial Services & Banking',
  'Healthcare & Life Sciences',
  'Manufacturing & Supply Chain',
  'Telecommunications',
  'Energy & Utilities',
  'Media & Entertainment'
];

const UploadDocumentModal = ({ isOpen, onClose, targetAssessmentId = null }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [extractedSummary, setExtractedSummary] = useState(null);

  const [metadata, setMetadata] = useState({
    customerName: '',
    industry: 'Retail & Consumer Goods',
    useCase: ''
  });

  if (!isOpen) return null;

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelected = (selectedFile) => {
    const validExtensions = ['.pdf', '.docx', '.png', '.jpg', '.jpeg', '.webp', '.txt', '.md'];
    const fileName = selectedFile.name.toLowerCase();
    const isValid = validExtensions.some(ext => fileName.endsWith(ext));

    if (!isValid) {
      toast.error('Supported formats: PDF, DOCX, PNG, JPG, WEBP, TXT, MD');
      return;
    }

    setFile(selectedFile);
    if (!metadata.customerName) {
      const guessedName = selectedFile.name.split('.')[0]
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
      setMetadata(prev => ({ ...prev, customerName: guessedName }));
    }
  };

  const handleExtractAndPopulate = async () => {
    if (!file) {
      toast.error('Please select an architecture document or diagram file.');
      return;
    }

    setIsProcessing(true);
    setCurrentStep(1);

    const stepTimer = setInterval(() => {
      setCurrentStep(prev => (prev < 4 ? prev + 1 : prev));
    }, 3500);

    try {
      const result = await autoPopulateFromDoc(file, targetAssessmentId, metadata);
      clearInterval(stepTimer);
      setCurrentStep(4);
      setExtractedSummary(result);
      toast.success(`Successfully extracted ${result.organizationName || 'Assessment'} architecture!`);
      
      setTimeout(() => {
        onClose();
        if (result.assessmentId) {
          navigate(`/results/${result.assessmentId}`);
        }
      }, 1500);
    } catch (err) {
      clearInterval(stepTimer);
      setIsProcessing(false);
      toast.error(err.message || 'Failed to extract architecture details from document.');
    }
  };

  return (
    <AnimatePresence>
      <ModalOverlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <ModalCard
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          onClick={e => e.stopPropagation()}
        >
          <CloseButton onClick={onClose}>
            <FiX size={18} />
          </CloseButton>

          <Header>
            <Badge>
              <HiSparkles /> Multimodal Document Ingestion
            </Badge>
            <Title>Auto-Populate from Architecture Spec</Title>
            <Subtitle>
              Upload your cloud architecture PDF, DOCX requirements, whiteboard diagrams, or markdown specs. 
              Gemini Vision analyzes your environment and automatically synthesizes bespoke Current vs Target State architectures.
            </Subtitle>
          </Header>

          {!extractedSummary ? (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.png,.jpg,.jpeg,.webp,.txt,.md"
                style={{ display: 'none' }}
                onChange={e => e.target.files && handleFileSelected(e.target.files[0])}
              />

              <DropZone
                $isDragging={isDragging}
                $hasFile={!!file}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <DropIcon $hasFile={!!file}>
                  {file ? <FiCheckCircle /> : <FiUploadCloud />}
                </DropIcon>
                <div style={{ fontWeight: '700', fontSize: '1rem', color: '#1e293b', marginBottom: '4px' }}>
                  {file ? file.name : 'Click to browse or drag & drop architecture document'}
                </div>
                <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                  Supports PDF reports, Word DOCX, architecture PNG/JPGs, and markdown
                </div>

                {file && (
                  <FileBadge onClick={e => e.stopPropagation()}>
                    <FiFileText />
                    {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready for AI extraction
                  </FileBadge>
                )}
              </DropZone>

              <MetaGrid>
                <FormGroup>
                  <Label>Organization / Client Name</Label>
                  <Input
                    type="text"
                    placeholder="e.g. Apex Retail Solutions"
                    value={metadata.customerName}
                    onChange={e => setMetadata({ ...metadata, customerName: e.target.value })}
                    disabled={isProcessing}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Industry Domain</Label>
                  <Select
                    value={metadata.industry}
                    onChange={e => setMetadata({ ...metadata, industry: e.target.value })}
                    disabled={isProcessing}
                  >
                    {INDUSTRIES.map(ind => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                  </Select>
                </FormGroup>
              </MetaGrid>

              {isProcessing ? (
                <ProgressBox>
                  <div style={{ fontWeight: '800', color: '#1e293b', marginBottom: '14px', fontSize: '0.92rem' }}>
                    Gemini Multimodal Processing Pipeline
                  </div>
                  <StepItem $active={currentStep === 1} $done={currentStep > 1}>
                    <FiCpu /> 1. Parsing document visual layout &amp; tabular specs...
                  </StepItem>
                  <StepItem $active={currentStep === 2} $done={currentStep > 2}>
                    <FiDatabase /> 2. Identifying detected technologies &amp; architecture pain points...
                  </StepItem>
                  <StepItem $active={currentStep === 3} $done={currentStep > 3}>
                    <FiLayers /> 3. Answering 60 maturity questions across 6 pillars...
                  </StepItem>
                  <StepItem $active={currentStep === 4} $done={currentStep > 4}>
                    <HiSparkles /> 4. Synthesizing bespoke Draw.io Current vs Target State diagrams...
                  </StepItem>
                </ProgressBox>
              ) : (
                <SubmitBtn onClick={handleExtractAndPopulate} disabled={!file}>
                  <HiSparkles /> Auto-Populate Assessment &amp; Diagrams
                  <FiArrowRight />
                </SubmitBtn>
              )}
            </>
          ) : (
            <ExtractionPreview>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#15803d', fontWeight: '800', fontSize: '1.1rem', marginBottom: '8px' }}>
                <FiCheckCircle /> Extraction Complete!
              </div>
              <p style={{ fontSize: '0.9rem', color: '#166534', margin: '0 0 14px 0' }}>
                Extracted architecture profile for <b>{extractedSummary.organizationName}</b> ({extractedSummary.industry}). 
                Identified {extractedSummary.detectedTechnologies?.length || 0} technologies and synthesized bespoke architecture blueprints.
              </p>
              <SubmitBtn onClick={() => navigate(`/results/${extractedSummary.assessmentId}`)}>
                View Complete Assessment Report →
              </SubmitBtn>
            </ExtractionPreview>
          )}
        </ModalCard>
      </ModalOverlay>
    </AnimatePresence>
  );
};

export default UploadDocumentModal;
