import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiMessageSquare, FiUser, FiMail, FiBriefcase, FiClock, FiBarChart2 } from 'react-icons/fi';
import feedbackService from '../services/feedbackService';

const PageContainer = styled.div`
  min-height: 100vh;
  background: #f8fafc;
  padding: 120px 20px 40px 20px;
`;

const Header = styled.div`
  max-width: 1400px;
  margin: 0 auto 40px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 10px;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #64748b;
`;

const AnalyticsSection = styled.div`
  max-width: 1400px;
  margin: 0 auto 40px;
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const AnalyticsTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const AnalyticsSubtitle = styled.p`
  font-size: 1rem;
  color: #64748b;
  margin-bottom: 30px;
`;

const CombinedChartContainer = styled.div`
  background: #f8fafc;
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 40px;
  position: relative;
`;

const CombinedChartTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 10px;
  text-align: center;
`;

const CombinedChartSubtitle = styled.p`
  font-size: 0.95rem;
  color: #64748b;
  margin-bottom: 25px;
  text-align: center;
`;

const OverallStatsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  text-align: center;
  padding: 20px;
  background: white;
  border-radius: 10px;
  min-width: 120px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${props => 
    props.$type === 'Yes' ? '#10b981' : 
    props.$type === 'No' ? '#ef4444' : 
    props.$type === 'Neutral' ? '#f59e0b' :
    '#1e293b'
  };
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StatPercentage = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: #94a3b8;
  margin-top: 4px;
`;

const CombinedBarGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const QuestionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const QuestionLabel = styled.div`
  min-width: 80px;
  font-size: 0.95rem;
  font-weight: 700;
  color: #1e293b;
  text-align: right;
`;

const BarsContainer = styled.div`
  flex: 1;
  display: flex;
  gap: 4px;
  height: 40px;
  background: #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
`;

const SegmentBar = styled(motion.div)`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.85rem;
  font-weight: 700;
  background: ${props => 
    props.$type === 'Yes' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 
    props.$type === 'No' ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : 
    'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
  };
  cursor: pointer;
  transition: filter 0.3s ease;

  &:hover {
    filter: brightness(1.1);
  }
`;

const Legend = styled.div`
  position: absolute;
  top: 30px;
  right: 30px;
  display: flex;
  gap: 20px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const LegendColor = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: ${props => 
    props.$type === 'Yes' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 
    props.$type === 'No' ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : 
    'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
  };
`;

const LegendLabel = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #475569;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;

  @media (max-width: 1400px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background: #f8fafc;
  border-radius: 12px;
  padding: 20px;
`;

const ChartTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 16px;
  text-align: center;
`;

const BarGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const BarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const BarLabel = styled.div`
  min-width: 60px;
  font-size: 0.9rem;
  font-weight: 600;
  color: ${props => 
    props.$type === 'Yes' ? '#10b981' : 
    props.$type === 'No' ? '#ef4444' : 
    '#f59e0b'
  };
`;

const BarContainer = styled.div`
  flex: 1;
  height: 32px;
  background: #e2e8f0;
  border-radius: 6px;
  overflow: hidden;
  position: relative;
`;

const BarFill = styled(motion.div)`
  height: 100%;
  background: ${props => 
    props.$type === 'Yes' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 
    props.$type === 'No' ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : 
    'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
  };
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.85rem;
  font-weight: 700;
`;

const BarValue = styled.div`
  min-width: 45px;
  text-align: right;
  font-size: 0.9rem;
  font-weight: 600;
  color: #475569;
`;

const FeedbackGrid = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
`;

const FeedbackCard = styled(motion.div)`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    transform: translateY(-4px);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f1f5f9;
`;

const UserIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  font-weight: 700;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
`;

const UserEmail = styled.div`
  font-size: 0.9rem;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
  color: #475569;
  margin-bottom: 12px;
`;

const ResponsePreview = styled.div`
  margin-top: 16px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #64748b;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const NoFeedback = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #94a3b8;
  font-size: 1.2rem;
`;

// Modal Components
const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
  overflow-y: auto;
`;

const ModalContent = styled(motion.div)`
  background: white;
  border-radius: 20px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

const ModalHeader = styled.div`
  padding: 30px;
  border-bottom: 2px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
  border-radius: 20px 20px 0 0;
`;

const ModalTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #94a3b8;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: #f1f5f9;
    color: #475569;
  }
`;

const ModalBody = styled.div`
  padding: 30px;
`;

const DetailSection = styled.div`
  margin-bottom: 30px;
`;

const SectionTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const DetailRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: #f8fafc;
  border-radius: 10px;
  margin-bottom: 8px;
  font-size: 1rem;
  color: #475569;
`;

const QuestionBlock = styled.div`
  margin-bottom: 24px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
`;

const Question = styled.div`
  font-size: 1.05rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 12px;
`;

const Answer = styled.div`
  font-size: 1rem;
  color: #475569;
  padding: 10px 16px;
  background: white;
  border-radius: 8px;
  border-left: 4px solid ${props => 
    props.$answer === 'Yes' ? '#10b981' : 
    props.$answer === 'No' ? '#ef4444' : 
    '#f59e0b'
  };
`;

const FreeTextAnswer = styled.div`
  font-size: 1rem;
  color: #475569;
  padding: 16px;
  background: white;
  border-radius: 8px;
  line-height: 1.6;
  white-space: pre-wrap;
`;

const QUESTIONS = [
  "Is the Databricks Maturity Assessment tool easy to use?",
  "Do the assessment results provide valuable insights?",
  "Would you recommend this tool to your colleagues?",
  "Are the recommendations actionable and relevant?",
  "Would you be interested in contributing to this open-source project?"
];

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const data = await feedbackService.getAllFeedback();
      setFeedbacks(data);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate analytics for each question
  const calculateQuestionStats = (questionKey) => {
    if (feedbacks.length === 0) return { Yes: 0, Neutral: 0, No: 0 };
    
    const counts = { Yes: 0, Neutral: 0, No: 0 };
    feedbacks.forEach(feedback => {
      const response = feedback[questionKey];
      if (response && counts.hasOwnProperty(response)) {
        counts[response]++;
      }
    });
    
    return counts;
  };

  // Calculate overall stats across all questions and all feedback
  const calculateOverallStats = () => {
    if (feedbacks.length === 0) return { Yes: 0, Neutral: 0, No: 0, total: 0 };
    
    const counts = { Yes: 0, Neutral: 0, No: 0 };
    
    // Loop through all feedbacks and all 5 questions
    feedbacks.forEach(feedback => {
      for (let i = 1; i <= 5; i++) {
        const response = feedback[`question${i}_response`];
        if (response && counts.hasOwnProperty(response)) {
          counts[response]++;
        }
      }
    });
    
    const total = counts.Yes + counts.Neutral + counts.No;
    return { ...counts, total };
  };

  if (loading) {
    return (
      <PageContainer>
        <Header>
          <Title>Loading Feedback...</Title>
        </Header>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {feedbacks.length === 0 ? (
        <NoFeedback>
          <FiMessageSquare size={64} style={{ marginBottom: '20px' }} />
          <div>No feedback received yet</div>
        </NoFeedback>
      ) : (
        <>
          {/* Analytics Section */}
          <AnalyticsSection>
            {/* Combined Chart */}
            <CombinedChartContainer>
              <CombinedChartTitle>Overall Feedback Score</CombinedChartTitle>
              <CombinedChartSubtitle>
                Aggregated responses from {feedbacks.length} user{feedbacks.length !== 1 ? 's' : ''} across all 5 questions ({feedbacks.length * 5} total responses)
              </CombinedChartSubtitle>
              
              {(() => {
                const overallStats = calculateOverallStats();
                const yesPercent = overallStats.total > 0 ? (overallStats.Yes / overallStats.total) * 100 : 0;
                const neutralPercent = overallStats.total > 0 ? (overallStats.Neutral / overallStats.total) * 100 : 0;
                const noPercent = overallStats.total > 0 ? (overallStats.No / overallStats.total) * 100 : 0;
                
                return (
                  <>
                    <OverallStatsContainer>
                      <StatCard>
                        <StatValue $type="Yes">{overallStats.Yes}</StatValue>
                        <StatLabel>Yes</StatLabel>
                        <StatPercentage>{Math.round(yesPercent)}%</StatPercentage>
                      </StatCard>
                      <StatCard>
                        <StatValue $type="Neutral">{overallStats.Neutral}</StatValue>
                        <StatLabel>Neutral</StatLabel>
                        <StatPercentage>{Math.round(neutralPercent)}%</StatPercentage>
                      </StatCard>
                      <StatCard>
                        <StatValue $type="No">{overallStats.No}</StatValue>
                        <StatLabel>No</StatLabel>
                        <StatPercentage>{Math.round(noPercent)}%</StatPercentage>
                      </StatCard>
                      <StatCard>
                        <StatValue>{overallStats.total}</StatValue>
                        <StatLabel>Total</StatLabel>
                        <StatPercentage>100%</StatPercentage>
                      </StatCard>
                    </OverallStatsContainer>
                    
                    <Legend>
                      <LegendItem>
                        <LegendColor $type="Yes" />
                        <LegendLabel>Yes</LegendLabel>
                      </LegendItem>
                      <LegendItem>
                        <LegendColor $type="Neutral" />
                        <LegendLabel>Neutral</LegendLabel>
                      </LegendItem>
                      <LegendItem>
                        <LegendColor $type="No" />
                        <LegendLabel>No</LegendLabel>
                      </LegendItem>
                    </Legend>
                  </>
                );
              })()}
            </CombinedChartContainer>
            
            <ChartsGrid>
              {QUESTIONS.map((question, index) => {
                const stats = calculateQuestionStats(`question${index + 1}_response`);
                const total = feedbacks.length;
                
                return (
                  <ChartCard key={index}>
                    <ChartTitle>Q{index + 1}: {question}</ChartTitle>
                    <BarGroup>
                      {['Yes', 'Neutral', 'No'].map(type => {
                        const count = stats[type];
                        const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
                        
                        return (
                          <BarRow key={type}>
                            <BarLabel $type={type}>{type}</BarLabel>
                            <BarContainer>
                              <BarFill
                                $type={type}
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ duration: 0.8, ease: 'easeOut' }}
                              >
                                {percentage > 15 && `${percentage}%`}
                              </BarFill>
                            </BarContainer>
                            <BarValue>{count}</BarValue>
                          </BarRow>
                        );
                      })}
                    </BarGroup>
                  </ChartCard>
                );
              })}
            </ChartsGrid>
          </AnalyticsSection>

          {/* Feedback Cards */}
          <FeedbackGrid>
          {feedbacks.map((feedback) => (
            <FeedbackCard
              key={feedback.id}
              onClick={() => setSelectedFeedback(feedback)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CardHeader>
                <UserIcon>{feedback.name.charAt(0).toUpperCase()}</UserIcon>
                <UserInfo>
                  <UserName>{feedback.name}</UserName>
                  <UserEmail>
                    <FiMail size={14} />
                    {feedback.email}
                  </UserEmail>
                </UserInfo>
              </CardHeader>

              <InfoRow>
                <FiBriefcase size={16} />
                {feedback.company}
              </InfoRow>

              <InfoRow>
                <FiClock size={16} />
                {formatDate(feedback.created_at)}
              </InfoRow>

              <ResponsePreview>
                "{feedback.question6_response}"
              </ResponsePreview>
            </FeedbackCard>
          ))}
        </FeedbackGrid>
        </>
      )}

      <AnimatePresence>
        {selectedFeedback && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedFeedback(null)}
          >
            <ModalContent
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalHeader>
                <div>
                  <ModalTitle>{selectedFeedback.name}</ModalTitle>
                  <UserEmail style={{ fontSize: '1rem' }}>
                    <FiMail size={16} />
                    {selectedFeedback.email}
                  </UserEmail>
                </div>
                <CloseButton onClick={() => setSelectedFeedback(null)}>
                  <FiX />
                </CloseButton>
              </ModalHeader>

              <ModalBody>
                <DetailSection>
                  <SectionTitle>
                    <FiUser />
                    Contact Information
                  </SectionTitle>
                  <DetailRow>
                    <FiBriefcase size={18} />
                    <strong>Company:</strong> {selectedFeedback.company}
                  </DetailRow>
                  <DetailRow>
                    <FiClock size={18} />
                    <strong>Submitted:</strong> {formatDate(selectedFeedback.created_at)}
                  </DetailRow>
                </DetailSection>

                <DetailSection>
                  <SectionTitle>
                    <FiMessageSquare />
                    Survey Responses
                  </SectionTitle>
                  
                  {QUESTIONS.map((question, index) => (
                    <QuestionBlock key={index}>
                      <Question>{index + 1}. {question}</Question>
                      <Answer $answer={selectedFeedback[`question${index + 1}_response`]}>
                        {selectedFeedback[`question${index + 1}_response`]}
                      </Answer>
                    </QuestionBlock>
                  ))}

                  <QuestionBlock>
                    <Question>6. What improvements or features would you like to see?</Question>
                    <FreeTextAnswer>{selectedFeedback.question6_response}</FreeTextAnswer>
                  </QuestionBlock>
                </DetailSection>
              </ModalBody>
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </PageContainer>
  );
};

export default FeedbackList;

