import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FiCheckCircle, 
  FiArrowRight, 
  FiArrowLeft, 
  FiSave, 
  FiHelpCircle, 
  FiAlertTriangle,
  FiFileText,
  FiClock,
  FiUser
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import toast from 'react-hot-toast';
import dynamicAssessmentService from '../services/dynamicAssessmentService';
import LoadingSpinner from './LoadingSpinner';

const Container = styled.div`
  min-height: calc(100vh - 80px);
  background: linear-gradient(135deg, #0b0f19 0%, #111827 50%, #1a1e36 100%);
  color: #f3f4f6;
  padding: 40px 20px;
`;

const Wrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const StickyHeader = styled.div`
  background: rgba(30, 41, 59, 0.7);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 24px 32px;
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
`;

const HeaderMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const AssessmentTitle = styled.h1`
  font-size: 1.6rem;
  font-weight: 700;
  color: #ffffff;
`;

const CustomerBadge = styled.span`
  font-size: 0.9rem;
  color: #94a3b8;
  display: inline-flex;
  align-items: center;
  gap: 6px;

  strong {
    color: #38bdf8;
  }
`;

const ScoreMeter = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const ScoreCircle = styled.div`
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2));
  border: 2px solid #818cf8;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.25rem;
  color: #c084fc;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 12px;
  margin-bottom: 24px;
  scrollbar-width: thin;
`;

const TabButton = styled.button`
  background: ${props => props.$active ? 'rgba(99, 102, 241, 0.3)' : 'rgba(30, 41, 59, 0.6)'};
  border: 1px solid ${props => props.$active ? '#818cf8' : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.$active ? '#ffffff' : '#94a3b8'};
  padding: 12px 20px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;

  &:hover {
    color: #ffffff;
    background: rgba(99, 102, 241, 0.2);
  }
`;

const QuestionCard = styled.div`
  background: rgba(30, 41, 59, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 32px;
  margin-bottom: 24px;
`;

const QuestionNumber = styled.div`
  font-size: 0.85rem;
  font-weight: 700;
  color: #818cf8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 8px;
`;

const QuestionText = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  color: #f8fafc;
  margin-bottom: 12px;
  line-height: 1.5;
`;

const GuidanceBox = styled.div`
  background: rgba(15, 23, 42, 0.5);
  border-left: 3px solid #38bdf8;
  padding: 10px 14px;
  border-radius: 6px;
  font-size: 0.875rem;
  color: #94a3b8;
  margin-bottom: 20px;
`;

const OptionsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 24px;
`;

const OptionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 16px;
  background: ${props => props.$selected ? 'rgba(99, 102, 241, 0.25)' : 'rgba(15, 23, 42, 0.6)'};
  border: 1.5px solid ${props => props.$selected ? '#818cf8' : 'rgba(255, 255, 255, 0.08)'};
  border-radius: 12px;
  padding: 14px 20px;
  color: ${props => props.$selected ? '#ffffff' : '#cbd5e1'};
  font-size: 0.95rem;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #818cf8;
    background: rgba(99, 102, 241, 0.15);
  }
`;

const OptionScoreBadge = styled.div`
  background: ${props => props.$selected ? '#818cf8' : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.$selected ? '#ffffff' : '#94a3b8'};
  font-weight: 700;
  font-size: 0.85rem;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const SectionSubheading = styled.h4`
  font-size: 0.9rem;
  font-weight: 600;
  color: #cbd5e1;
  margin-top: 20px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const PainChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 18px;
`;

const PainChip = styled.button`
  background: ${props => props.$selected ? 'rgba(239, 68, 68, 0.25)' : 'rgba(15, 23, 42, 0.6)'};
  border: 1px solid ${props => props.$selected ? '#ef4444' : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.$selected ? '#fca5a5' : '#94a3b8'};
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #ef4444;
    color: #ffffff;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 12px;
  color: #f8fafc;
  font-size: 0.9rem;
  min-height: 70px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #818cf8;
  }
`;

const FooterNav = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;
  flex-wrap: wrap;
  gap: 16px;
`;

const ActionBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
`;

const SaveBtn = styled(ActionBtn)`
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  &:hover { background: rgba(255, 255, 255, 0.2); }
`;

const NextBtn = styled(ActionBtn)`
  background: linear-gradient(135deg, #6366f1, #a855f7);
  color: #ffffff;
  &:hover { transform: translateY(-2px); }
`;

const CompleteBtn = styled(ActionBtn)`
  background: linear-gradient(135deg, #10b981, #059669);
  color: #ffffff;
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.35);
  &:hover { transform: translateY(-2px); box-shadow: 0 12px 25px rgba(16, 185, 129, 0.5); }
`;

const DynamicAssessmentRunner = () => {
  const { id, typeKey } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [instance, setInstance] = useState(null);
  const [framework, setFramework] = useState(null);
  const [responses, setResponses] = useState({});
  const [activeDimIdx, setActiveDimIdx] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, [id, typeKey]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (id) {
        // Load instance by ID
        const inst = await dynamicAssessmentService.getInstance(id);
        if (inst) {
          setInstance(inst);
          setFramework(inst.frameworkSnapshot);
          setResponses(inst.responses || {});
        }
      } else if (typeKey) {
        // Start new instance from template
        const type = await dynamicAssessmentService.getAssessmentTypeByKey(typeKey);
        if (type) {
          setFramework(type.framework);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load assessment data');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (qId, score) => {
    setResponses(prev => ({
      ...prev,
      [qId]: score
    }));
  };

  const handleTogglePain = (qId, pain) => {
    const key = `${qId}_pain_points`;
    const current = responses[key] || [];
    const updated = current.includes(pain)
      ? current.filter(p => p !== pain)
      : [...current, pain];

    setResponses(prev => ({
      ...prev,
      [key]: updated
    }));
  };

  const handleCommentChange = (qId, text) => {
    setResponses(prev => ({
      ...prev,
      [`${qId}_comment`]: text
    }));
  };

  const handleSaveProgress = async () => {
    if (!instance?.id) return;
    try {
      await dynamicAssessmentService.updateInstance(instance.id, {
        responses
      });
      toast.success('Progress saved');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save progress');
    }
  };

  const handleCompleteAndReport = async () => {
    if (!instance?.id) return;
    setIsSubmitting(true);
    try {
      toast.loading('Generating executive report with Gemini 3.7...', { id: 'report-gen' });
      await dynamicAssessmentService.updateInstance(instance.id, {
        responses,
        status: 'completed'
      });

      const reportResult = await dynamicAssessmentService.generateReport(instance.id);
      if (reportResult.success) {
        toast.success('Executive report generated successfully!', { id: 'report-gen' });
        navigate(`/assessments/report/${instance.id}`);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Failed to generate report', { id: 'report-gen' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !framework) {
    return <LoadingSpinner message="Loading assessment questions..." />;
  }

  const dimensions = framework.dimensions || [];
  const currentDim = dimensions[activeDimIdx] || dimensions[0];

  // Calculate quick score
  let answered = 0;
  let totalQ = 0;
  let sumScore = 0;
  dimensions.forEach(d => {
    (d.questions || []).forEach(q => {
      totalQ++;
      if (responses[q.id] !== undefined) {
        answered++;
        sumScore += Number(responses[q.id]);
      }
    });
  });
  const currentAvg = answered > 0 ? (sumScore / answered).toFixed(1) : '0.0';

  return (
    <Container>
      <Wrapper>
        {/* Header */}
        <StickyHeader>
          <HeaderMeta>
            <AssessmentTitle>{framework.title}</AssessmentTitle>
            <CustomerBadge>
              <FiUser /> Organization: <strong>{instance?.customerName || 'Organization'}</strong>
              {instance?.useCase && ` | Initiative: ${instance.useCase}`}
            </CustomerBadge>
          </HeaderMeta>

          <ScoreMeter>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', textAlign: 'right' }}>
                Completed {answered}/{totalQ}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#38bdf8', fontWeight: '600' }}>
                Live Maturity Score
              </div>
            </div>
            <ScoreCircle>{currentAvg}</ScoreCircle>
          </ScoreMeter>
        </StickyHeader>

        {/* Dimension Tabs */}
        <TabContainer>
          {dimensions.map((dim, idx) => (
            <TabButton 
              key={dim.id || idx}
              $active={idx === activeDimIdx}
              onClick={() => setActiveDimIdx(idx)}
            >
              {dim.name}
            </TabButton>
          ))}
        </TabContainer>

        {/* Current Dimension Questions */}
        <div>
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '4px' }}>
              {currentDim.name}
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>{currentDim.description}</p>
          </div>

          {(currentDim.questions || []).map((q, qIdx) => {
            const selectedVal = responses[q.id];
            const currentPains = responses[`${q.id}_pain_points`] || [];
            const comment = responses[`${q.id}_comment`] || '';

            return (
              <QuestionCard key={q.id || qIdx}>
                <QuestionNumber>Question {qIdx + 1} of {currentDim.questions.length}</QuestionNumber>
                <QuestionText>{q.text}</QuestionText>

                {q.guidance && (
                  <GuidanceBox>
                    <FiHelpCircle style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                    {q.guidance}
                  </GuidanceBox>
                )}

                <OptionsGrid>
                  {(q.options || []).map((opt) => {
                    const isSelected = Number(selectedVal) === Number(opt.score || opt.value);
                    return (
                      <OptionButton 
                        key={opt.score || opt.value}
                        $selected={isSelected}
                        onClick={() => handleSelectOption(q.id, opt.score || opt.value)}
                      >
                        <OptionScoreBadge $selected={isSelected}>
                          {opt.score || opt.value}
                        </OptionScoreBadge>
                        <div>{opt.label}</div>
                      </OptionButton>
                    );
                  })}
                </OptionsGrid>

                {/* Technical & Business Pain Points */}
                {((q.technicalPainPoints && q.technicalPainPoints.length > 0) || 
                  (q.businessPainPoints && q.businessPainPoints.length > 0)) && (
                  <div>
                    <SectionSubheading>
                      <FiAlertTriangle color="#f59e0b" /> Identify Technical & Operational Pain Points (Optional)
                    </SectionSubheading>
                    <PainChips>
                      {[...(q.technicalPainPoints || []), ...(q.businessPainPoints || [])].map((pain, pIdx) => {
                        const isSelected = currentPains.includes(pain);
                        return (
                          <PainChip 
                            key={pIdx}
                            $selected={isSelected}
                            onClick={() => handleTogglePain(q.id, pain)}
                          >
                            {isSelected ? '✓ ' : '+ '}
                            {pain}
                          </PainChip>
                        );
                      })}
                    </PainChips>
                  </div>
                )}

                {/* Contextual Notes */}
                <div>
                  <SectionSubheading>
                    <FiFileText color="#818cf8" /> Assessor Observations / Context Notes (Optional)
                  </SectionSubheading>
                  <TextArea 
                    placeholder="Add specific observations, systems involved, or context for the AI report..."
                    value={comment}
                    onChange={(e) => handleCommentChange(q.id, e.target.value)}
                  />
                </div>
              </QuestionCard>
            );
          })}
        </div>

        {/* Footer Navigation */}
        <FooterNav>
          <div style={{ display: 'flex', gap: '12px' }}>
            {activeDimIdx > 0 && (
              <ActionBtn style={{ background: 'rgba(255,255,255,0.08)', color: '#fff' }} onClick={() => setActiveDimIdx(prev => prev - 1)}>
                <FiArrowLeft /> Previous Dimension
              </ActionBtn>
            )}
            <SaveBtn onClick={handleSaveProgress}>
              <FiSave /> Save Draft
            </SaveBtn>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            {activeDimIdx < dimensions.length - 1 ? (
              <NextBtn onClick={() => setActiveDimIdx(prev => prev + 1)}>
                Next Dimension <FiArrowRight />
              </NextBtn>
            ) : (
              <CompleteBtn onClick={handleCompleteAndReport} disabled={isSubmitting}>
                <HiSparkles />
                {isSubmitting ? 'Generating AI Report...' : 'Complete & Generate AI Report'}
              </CompleteBtn>
            )}
          </div>
        </FooterNav>
      </Wrapper>
    </Container>
  );
};

export default DynamicAssessmentRunner;
