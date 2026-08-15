import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiCpu, 
  FiCheckCircle, 
  FiPlay, 
  FiAward, 
  FiLayers, 
  FiEdit2, 
  FiPlus, 
  FiTrash2, 
  FiArrowRight,
  FiHelpCircle,
  FiShield,
  FiDollarSign,
  FiDatabase,
  FiActivity,
  FiGrid,
  FiClock,
  FiUser
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import toast from 'react-hot-toast';
import dynamicAssessmentService from '../services/dynamicAssessmentService';

const Container = styled.div`
  min-height: calc(100vh - 80px);
  background: linear-gradient(135deg, #0b0f19 0%, #111827 50%, #1e1e38 100%);
  color: #f3f4f6;
  padding: 40px 24px;
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%);
  border: 1px solid rgba(139, 92, 246, 0.4);
  color: #c084fc;
  padding: 6px 16px;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 16px;
`;

const Title = styled.h1`
  font-size: 2.75rem;
  font-weight: 800;
  background: linear-gradient(135deg, #ffffff 0%, #cbd5e1 50%, #94a3b8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 12px;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.125rem;
  color: #94a3b8;
  max-width: 750px;
  margin: 0 auto;
  line-height: 1.6;
`;

const PromptCard = styled.div`
  background: rgba(30, 41, 59, 0.7);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 36px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  margin-bottom: 40px;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 16px;
  padding: 20px;
  color: #f8fafc;
  font-size: 1.1rem;
  line-height: 1.6;
  resize: vertical;
  transition: all 0.2s ease;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #818cf8;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.25);
  }

  &::placeholder {
    color: #64748b;
  }
`;

const PresetGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
  margin-top: 20px;
  margin-bottom: 24px;
`;

const PresetChip = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 12px 16px;
  color: #cbd5e1;
  font-size: 0.9rem;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(99, 102, 241, 0.15);
    border-color: rgba(99, 102, 241, 0.4);
    color: #ffffff;
    transform: translateY(-2px);
  }

  svg {
    color: #818cf8;
    font-size: 1.1rem;
    flex-shrink: 0;
  }
`;

const ControlsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
`;

const MetaInputs = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const Input = styled.input`
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 10px 16px;
  color: #f8fafc;
  font-size: 0.9rem;

  &:focus {
    outline: none;
    border-color: #818cf8;
  }
`;

const GenerateButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  color: white;
  border: none;
  border-radius: 14px;
  padding: 14px 32px;
  font-size: 1.05rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 10px 25px rgba(99, 102, 241, 0.4);
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 15px 30px rgba(99, 102, 241, 0.6);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const FrameworkPreview = styled.div`
  background: rgba(30, 41, 59, 0.6);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 40px;
  margin-bottom: 40px;
`;

const FrameworkHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 24px;
  margin-bottom: 32px;
  gap: 24px;
  flex-wrap: wrap;
`;

const FrameworkInfo = styled.div`
  flex: 1;
`;

const FrameworkTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 8px;
`;

const FrameworkDesc = styled.p`
  font-size: 1.05rem;
  color: #94a3b8;
  line-height: 1.6;
`;

const ActionsGroup = styled.div`
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
`;

const SecondaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #ffffff;
  padding: 12px 22px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

const PrimaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border: none;
  color: #ffffff;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 25px rgba(16, 185, 129, 0.45);
  }
`;

const DimensionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const DimensionCard = styled.div`
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  padding: 24px;
`;

const DimensionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const DimensionTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #38bdf8;
`;

const QuestionCount = styled.span`
  font-size: 0.8rem;
  background: rgba(56, 189, 248, 0.15);
  color: #38bdf8;
  padding: 4px 10px;
  border-radius: 20px;
  font-weight: 600;
`;

const DimensionDesc = styled.p`
  font-size: 0.9rem;
  color: #94a3b8;
  margin-bottom: 16px;
  line-height: 1.5;
`;

const QuestionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const QuestionItem = styled.div`
  background: rgba(30, 41, 59, 0.5);
  border-radius: 10px;
  padding: 12px 14px;
  font-size: 0.875rem;
  color: #e2e8f0;
  border-left: 3px solid #818cf8;
`;

// Start Assessment Modal
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: #1e293b;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 24px;
  padding: 36px;
  max-width: 550px;
  width: 100%;
  color: white;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: #cbd5e1;
  margin-bottom: 8px;
`;

const PRESET_PROMPTS = [
  {
    title: "Cloud Security & Zero Trust Architecture",
    prompt: "Create a comprehensive Cloud Security & Zero Trust readiness assessment covering identity isolation, network segmentation, secrets management, automated compliance, and threat observability.",
    icon: FiShield
  },
  {
    title: "FinOps & Cloud Cost Optimization",
    prompt: "Design a FinOps and Cloud Cost Optimization maturity assessment covering spend visibility, unit economics, automated rightsizing, rate optimization commitments, and organizational FinOps culture.",
    icon: FiDollarSign
  },
  {
    title: "Agentic AI & Multi-Agent Architecture",
    prompt: "Design an Agentic AI Architecture readiness assessment covering autonomous agent orchestration, tool integration protocols, evaluation guardrails, memory/context caching, and human-in-the-loop controls.",
    icon: FiCpu
  },
  {
    title: "Data Mesh & Domain Governance",
    prompt: "Create a Data Mesh maturity assessment evaluating domain-oriented data ownership, data-as-a-product standards, self-serve data platform infrastructure, and federated computational governance.",
    icon: FiDatabase
  },
  {
    title: "Healthcare HIPAA & FHIR Data Readiness",
    prompt: "Design a Healthcare & Life Sciences Data Readiness assessment covering HIPAA/HITRUST compliance, FHIR interoperability, clinical data de-identification, and real-world evidence analytics.",
    icon: FiActivity
  }
];

const DynamicAssessmentGenerator = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [industry, setIndustry] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedFramework, setGeneratedFramework] = useState(null);
  
  // Modal state for starting assessment
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [useCase, setUseCase] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [isStarting, setIsStarting] = useState(false);

  const handleGenerate = async (customPrompt) => {
    const textToUse = customPrompt || prompt;
    if (!textToUse || !textToUse.trim()) {
      toast.error('Please enter a description or select an assessment prompt');
      return;
    }

    setIsGenerating(true);
    setGeneratedFramework(null);

    try {
      toast.loading('Generating custom assessment framework with Gemini 3.7...', { id: 'generating' });
      const response = await dynamicAssessmentService.generateFramework(textToUse.trim(), {
        industry,
        targetAudience
      });

      if (response.success && response.framework) {
        setGeneratedFramework(response.framework);
        toast.success(`Assessment framework "${response.framework.title}" generated!`, { id: 'generating' });
      } else {
        toast.error('Could not generate framework. Please try again.', { id: 'generating' });
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Failed to generate assessment', { id: 'generating' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePromoteAsType = async () => {
    if (!generatedFramework) return;

    try {
      toast.loading('Promoting framework as official Assessment Type...', { id: 'promoting' });
      const response = await dynamicAssessmentService.saveAssessmentType({
        title: generatedFramework.title,
        subtitle: generatedFramework.subtitle,
        description: generatedFramework.description,
        icon: generatedFramework.icon || 'FiAward',
        badge: generatedFramework.badge || 'Custom',
        color: generatedFramework.color || '#6366f1',
        framework: generatedFramework,
        isPromoted: true
      });

      if (response.success) {
        toast.success(`"${generatedFramework.title}" is now live in the Assessments menu!`, { id: 'promoting' });
        // Force refresh or notify
        window.dispatchEvent(new Event('assessment-types-updated'));
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to promote assessment type', { id: 'promoting' });
    }
  };

  const handleStartAssessment = async () => {
    if (!customerName || !customerName.trim()) {
      toast.error('Please enter Organization / Customer name');
      return;
    }

    setIsStarting(true);
    try {
      const instance = await dynamicAssessmentService.createInstance({
        customerName: customerName.trim(),
        useCase: useCase.trim(),
        contactEmail: contactEmail.trim(),
        typeKey: generatedFramework.typeKey,
        frameworkSnapshot: generatedFramework
      });

      if (instance && instance.id) {
        toast.success('Assessment session created!');
        setIsModalOpen(false);
        navigate(`/assessments/run/instance/${instance.id}`);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to start assessment');
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <Container>
      <ContentWrapper>
        <HeaderSection>
          <Badge>
            <HiSparkles /> Powered by Google Gemini 3.7 Flash
          </Badge>
          <Title>AI Assessment Generator</Title>
          <Subtitle>
            Describe any architecture, domain, technology stack, or business discipline.
            Gemini 3.7 will architect a complete, tailored maturity assessment with dimensional questions, scoring criteria, and actionable recommendations.
          </Subtitle>
        </HeaderSection>

        {/* Prompt Input Card */}
        <PromptCard>
          <TextArea 
            placeholder="e.g. Create a FinOps and Cloud Cost Optimization assessment covering visibility, compute rightsizing, anomaly detection, rate commitments, and FinOps culture..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          <PresetGrid>
            {PRESET_PROMPTS.map((preset, idx) => {
              const IconComponent = preset.icon;
              return (
                <PresetChip 
                  key={idx}
                  onClick={() => {
                    setPrompt(preset.prompt);
                    handleGenerate(preset.prompt);
                  }}
                >
                  <IconComponent />
                  <span>{preset.title}</span>
                </PresetChip>
              );
            })}
          </PresetGrid>

          <ControlsRow>
            <MetaInputs>
              <Input 
                placeholder="Industry (Optional, e.g. Healthcare)"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              />
              <Input 
                placeholder="Target Audience (e.g. CTO, Architects)"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
              />
            </MetaInputs>

            <GenerateButton 
              disabled={isGenerating || !prompt.trim()}
              onClick={() => handleGenerate(prompt)}
            >
              <HiSparkles />
              {isGenerating ? 'Architecting Framework...' : 'Generate Assessment'}
            </GenerateButton>
          </ControlsRow>
        </PromptCard>

        {/* Framework Preview */}
        {generatedFramework && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <FrameworkPreview>
              <FrameworkHeader>
                <FrameworkInfo>
                  <Badge style={{ background: 'rgba(56, 189, 248, 0.2)', borderColor: 'rgba(56, 189, 248, 0.4)', color: '#38bdf8' }}>
                    {generatedFramework.badge || 'Custom Assessment'}
                  </Badge>
                  <FrameworkTitle>{generatedFramework.title}</FrameworkTitle>
                  <FrameworkDesc>{generatedFramework.description}</FrameworkDesc>
                </FrameworkInfo>

                <ActionsGroup>
                  <SecondaryButton onClick={handlePromoteAsType}>
                    <FiAward />
                    Promote to Assessment Type
                  </SecondaryButton>
                  <PrimaryButton onClick={() => setIsModalOpen(true)}>
                    <FiPlay />
                    Start Assessment Now
                  </PrimaryButton>
                </ActionsGroup>
              </FrameworkHeader>

              <h4 style={{ fontSize: '1.25rem', marginBottom: '20px', color: '#e2e8f0' }}>
                Framework Dimensions & Capabilities ({generatedFramework.dimensions.length} Dimensions)
              </h4>

              <DimensionsGrid>
                {generatedFramework.dimensions.map((dim, idx) => (
                  <DimensionCard key={dim.id || idx}>
                    <DimensionHeader>
                      <DimensionTitle>{dim.name}</DimensionTitle>
                      <QuestionCount>{dim.questions?.length || 0} Questions</QuestionCount>
                    </DimensionHeader>
                    <DimensionDesc>{dim.description}</DimensionDesc>

                    <QuestionList>
                      {(dim.questions || []).map((q, qIdx) => (
                        <QuestionItem key={q.id || qIdx}>
                          <strong>Q{qIdx + 1}:</strong> {q.text}
                        </QuestionItem>
                      ))}
                    </QuestionList>
                  </DimensionCard>
                ))}
              </DimensionsGrid>
            </FrameworkPreview>
          </motion.div>
        )}

        {/* Start Assessment Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <ModalOverlay onClick={() => setIsModalOpen(false)}>
              <ModalContent onClick={(e) => e.stopPropagation()}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '8px' }}>
                  Start Assessment
                </h2>
                <p style={{ color: '#94a3b8', marginBottom: '24px', fontSize: '0.95rem' }}>
                  Configure the target organization and use case for this assessment run.
                </p>

                <FormGroup>
                  <Label>Customer / Organization Name *</Label>
                  <Input 
                    style={{ width: '100%' }}
                    placeholder="e.g. Acme Financial Services"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    autoFocus
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Use Case / Initiative (Optional)</Label>
                  <Input 
                    style={{ width: '100%' }}
                    placeholder="e.g. Hybrid Cloud Zero Trust Migration"
                    value={useCase}
                    onChange={(e) => setUseCase(e.target.value)}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Contact Email (Optional)</Label>
                  <Input 
                    style={{ width: '100%' }}
                    type="email"
                    placeholder="architect@organization.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                  />
                </FormGroup>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '28px' }}>
                  <SecondaryButton onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </SecondaryButton>
                  <PrimaryButton onClick={handleStartAssessment} disabled={isStarting}>
                    {isStarting ? 'Starting...' : 'Launch Assessment'}
                    <FiArrowRight />
                  </PrimaryButton>
                </div>
              </ModalContent>
            </ModalOverlay>
          )}
        </AnimatePresence>
      </ContentWrapper>
    </Container>
  );
};

export default DynamicAssessmentGenerator;
