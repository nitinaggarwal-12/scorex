import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  FiTarget, 
  FiTrendingUp, 
  FiCheckCircle, 
  FiArrowRight,
  FiBarChart2,
  FiUsers,
  FiClock,
  FiAward,
  FiLayers,
  FiZap,
  FiFolder,
  FiShuffle
} from 'react-icons/fi';
import * as assessmentService from '../services/assessmentService';

const HomeContainer = styled.div`
  min-height: calc(100vh - 80px);
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #06b6d4 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 50%, rgba(255, 107, 53, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const HeroSection = styled.div`
  padding: 100px 20px 80px;
  text-align: center;
  color: white;
  position: relative;
  z-index: 1;
`;

const HeroTitle = styled(motion.h1)`
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: 24px;
  background: linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 1.35rem;
  margin-bottom: 48px;
  opacity: 0.95;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.7;
  font-weight: 300;
`;

const CTAButton = styled(motion.button)`
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
  color: white;
  border: none;
  padding: 18px 48px;
  border-radius: 50px;
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 12px 40px rgba(255, 107, 53, 0.4);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.5s ease;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 16px 50px rgba(255, 107, 53, 0.5);
    
    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(-1px);
  }
`;

const SecondaryButton = styled(motion.button)`
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 14px 32px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  position: relative;
  gap: 8px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const SampleButtonWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const SampleDropdown = styled(motion.div)`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  z-index: 100;
  min-width: 200px;
`;

const SampleMenuItem = styled.button`
  width: 100%;
  text-align: left;
  padding: 12px 16px;
  border: none;
  background: transparent;
  color: #1e3a8a;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  gap: 4px;

  &:hover {
    background: rgba(59, 130, 246, 0.1);
  }

  span:first-child {
    font-weight: 700;
  }

  span:last-child {
    font-size: 0.85rem;
    opacity: 0.7;
  }
`;

const ButtonGroup = styled(motion.div)`
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 60px;
`;

const StatsBar = styled(motion.div)`
  display: flex;
  justify-content: center;
  gap: 60px;
  margin-top: 60px;
  flex-wrap: wrap;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 3rem;
  font-weight: 800;
  color: white;
  line-height: 1;
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const ContentSection = styled.div`
  background: white;
  padding: 80px 20px;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  font-size: 2.8rem;
  font-weight: 800;
  text-align: center;
  color: #1f2937;
  margin-bottom: 20px;
  letter-spacing: -0.02em;
  
  &::after {
    content: '';
    display: block;
    width: 60px;
    height: 4px;
    background: linear-gradient(90deg, #ff6b35, #f7931e);
    margin: 20px auto 0;
    border-radius: 2px;
  }
`;

const SectionSubtitle = styled.p`
  font-size: 1.15rem;
  text-align: center;
  color: #6b7280;
  margin-bottom: 60px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.7;
  font-weight: 400;
`;

const ProcessGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  margin-bottom: 80px;
`;

const ProcessCard = styled(motion.div)`
  background: #f8fafc;
  border-radius: 20px;
  padding: 40px 30px;
  text-align: center;
  border: 2px solid transparent;
  transition: all 0.3s ease;

  &:hover {
    border-color: #3b82f6;
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  }
`;

const ProcessIcon = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  color: white;
`;

const ProcessTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 16px;
`;

const ProcessDescription = styled.p`
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 20px;
`;

const ProcessDetails = styled.ul`
  text-align: left;
  color: #4b5563;
  font-size: 0.9rem;
  line-height: 1.5;

  li {
    margin-bottom: 8px;
    display: flex;
    align-items: flex-start;
    gap: 8px;

    &:before {
      content: '✓';
      color: #10b981;
      font-weight: bold;
      margin-top: 2px;
    }
  }
`;

const PillarsSection = styled.div`
  background: #f9fafb;
  padding: 80px 20px;
`;

const PillarsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
`;

const PillarCard = styled(motion.div)`
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border-left: 5px solid ${props => props.color || '#3b82f6'};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  }
`;

const PillarHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

const PillarIcon = styled.div`
  font-size: 2rem;
  margin-right: 16px;
`;

const PillarTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`;

const PillarDescription = styled.p`
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 16px;
`;

const PillarDimensions = styled.div`
  font-size: 0.9rem;
  color: #4b5563;
  background: #f3f4f6;
  padding: 12px 16px;
  border-radius: 8px;
`;

const BenefitsSection = styled.div`
  background: white;
  padding: 80px 20px;
`;

const BenefitsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  max-width: 1000px;
  margin: 0 auto;
`;

const BenefitCard = styled(motion.div)`
  text-align: center;
  padding: 30px 20px;
`;

const BenefitIcon = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: white;
`;

const BenefitTitle = styled.h4`
  font-size: 1.2rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 12px;
`;

const BenefitDescription = styled.p`
  color: #6b7280;
  line-height: 1.5;
`;

const MaturityMattersGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: start;
  margin-bottom: 40px;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const HomePage = () => {
  const navigate = useNavigate();
  const [generatingSample, setGeneratingSample] = useState(false);
  const [showSampleMenu, setShowSampleMenu] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSampleMenu(false);
      }
    };

    if (showSampleMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSampleMenu]);

  const handleGenerateSample = async (completionLevel) => {
    try {
      setGeneratingSample(true);
      setShowSampleMenu(false);
      
      toast.loading('Generating sample assessment...', { id: 'sample-gen' });
      
      const response = await assessmentService.generateSampleAssessment(completionLevel);
      
      if (response.success) {
        // Get the first category from the framework to navigate to first question
        const framework = await assessmentService.getAssessmentFramework();
        const firstCategoryId = framework?.assessmentAreas?.[0]?.id;
        
        if (firstCategoryId) {
          toast.success(`Sample assessment "${response.assessment.name}" created! Review your selections...`, {
            id: 'sample-gen',
            duration: 4000
          });
          
          // Navigate to the first question page, not directly to results
          setTimeout(() => {
            navigate(`/assessment/${response.assessment.id}/${firstCategoryId}`);
          }, 1000);
        } else {
          throw new Error('Could not determine first category');
        }
      } else {
        
      }
    } catch (error) {
      console.error('Error generating sample:', error);
      
    } finally {
      setGeneratingSample(false);
    }
  };

  return (
    <HomeContainer>
      <HeroSection>
        <HeroTitle
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Data & AI Technical Maturity Assessment
        </HeroTitle>
        <HeroSubtitle
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Evaluate your organization's Databricks maturity across 6 key pillars and receive personalized recommendations to accelerate your data and AI journey.
        </HeroSubtitle>
        
        <ButtonGroup
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <CTAButton
            onClick={() => navigate('/start')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Assessment
            <FiArrowRight size={22} />
          </CTAButton>
        </ButtonGroup>

        <ButtonGroup
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <SecondaryButton
            onClick={() => navigate('/assessments')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiFolder size={18} />
            Past Assessments
          </SecondaryButton>
          
          <SecondaryButton
            onClick={() => navigate('/explore')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiTarget size={18} />
            Explore Framework
          </SecondaryButton>

          <SampleButtonWrapper ref={dropdownRef}>
            <SecondaryButton
              onClick={() => setShowSampleMenu(!showSampleMenu)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={generatingSample}
            >
              <FiShuffle size={18} />
              {generatingSample ? 'Generating...' : 'Try Sample Assessment'}
            </SecondaryButton>

            {showSampleMenu && (
              <SampleDropdown
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <SampleMenuItem onClick={() => handleGenerateSample('full')}>
                  <span>🎯 Full Assessment</span>
                  <span>All 6 pillars completed</span>
                </SampleMenuItem>
                <SampleMenuItem onClick={() => handleGenerateSample('partial')}>
                  <span>⚡ Partial Assessment</span>
                  <span>3-4 pillars completed</span>
                </SampleMenuItem>
                <SampleMenuItem onClick={() => handleGenerateSample('minimal')}>
                  <span>🔍 Minimal Assessment</span>
                  <span>1-2 pillars completed</span>
                </SampleMenuItem>
              </SampleDropdown>
            )}
          </SampleButtonWrapper>
        </ButtonGroup>

        <StatsBar
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <StatItem>
            <StatNumber>6</StatNumber>
            <StatLabel>Pillars</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>30</StatNumber>
            <StatLabel>Dimensions</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>60</StatNumber>
            <StatLabel>Questions</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>5</StatNumber>
            <StatLabel>Maturity Levels</StatLabel>
          </StatItem>
        </StatsBar>
      </HeroSection>

      <ContentSection>
        <ContentWrapper>
          <SectionTitle>How It Works</SectionTitle>
          <SectionSubtitle>
            Our comprehensive assessment evaluates your Databricks implementation across multiple dimensions, 
            providing actionable insights and a clear roadmap for improvement.
          </SectionSubtitle>

          <ProcessGrid>
            <ProcessCard
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <ProcessIcon>
                <FiTarget size={32} />
              </ProcessIcon>
              <ProcessTitle>1. Choose Your Focus</ProcessTitle>
              <ProcessDescription>
                Select individual pillars or complete the full assessment. Each pillar is independent and provides valuable insights.
              </ProcessDescription>
              <ProcessDetails>
                <li>Start with any pillar that interests you</li>
                <li>Complete pillars at your own pace</li>
                <li>Get immediate results after each pillar</li>
                <li>No dependencies between pillars</li>
              </ProcessDetails>
            </ProcessCard>

            <ProcessCard
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <ProcessIcon>
                <FiCheckCircle size={32} />
              </ProcessIcon>
              <ProcessTitle>2. Answer Questions</ProcessTitle>
              <ProcessDescription>
                For each question, provide your current state, future vision, and identify technical and business pain points.
              </ProcessDescription>
              <ProcessDetails>
                <li>Current State: Where you are today</li>
                <li>Future State: Where you want to be</li>
                <li>Technical Pain Points: Technical challenges</li>
                <li>Business Pain Points: Business impact areas</li>
                <li>Comments: Additional context and details</li>
              </ProcessDetails>
            </ProcessCard>

            <ProcessCard
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <ProcessIcon>
                <FiBarChart2 size={32} />
              </ProcessIcon>
              <ProcessTitle>3. Get Insights</ProcessTitle>
              <ProcessDescription>
                Receive detailed analysis, maturity scoring, and personalized recommendations for improvement.
              </ProcessDescription>
              <ProcessDetails>
                <li>Maturity level assessment (1-5 scale)</li>
                <li>Strengths and improvement areas</li>
                <li>Prioritized action items</li>
                <li>Quick wins and long-term roadmap</li>
                <li>Risk areas and mitigation strategies</li>
              </ProcessDetails>
            </ProcessCard>
          </ProcessGrid>
        </ContentWrapper>
      </ContentSection>

      {/* Why Maturity Matters Section */}
      <ContentSection style={{ background: '#f3f4f6' }}>
        <ContentWrapper>
          <SectionTitle style={{ marginBottom: '16px' }}>Why Maturity Matters – the direct link to VALUE</SectionTitle>
          <SectionSubtitle style={{ marginBottom: '60px' }}>
            An organization's ability to deliver high performing data and analytics solutions is directly linked to the Data Teams' ability to deliver outcome based value to their organization
          </SectionSubtitle>

          <MaturityMattersGrid>
            {/* Left: Maturity Pyramid */}
            <div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937', marginBottom: '30px' }}>
                The Insights-Driven Organisation Maturity Scale
              </h3>
              <img 
                src="/maturity-scale.png" 
                alt="The Insights-Driven Organisation Maturity Scale" 
                style={{ 
                  width: '100%', 
                  height: 'auto',
                  maxWidth: '100%',
                  display: 'block',
                  margin: '0 auto',
                  borderRadius: '12px'
                }} 
              />
              
              {/* Quote */}
              <div style={{ 
                marginTop: '40px', 
                padding: '28px', 
                background: 'white', 
                borderRadius: '12px', 
                borderLeft: '5px solid #3b82f6',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
              }}>
                <p style={{ 
                  fontSize: '1rem', 
                  color: '#374151', 
                  lineHeight: '1.8', 
                  fontStyle: 'italic', 
                  marginBottom: '20px',
                  fontWeight: '400'
                }}>
                  "Virtually all organizations identified as analytics competitors are clear leaders in their fields - they attribute … their success to the masterful exploitation of data … they understand that most business functions can be improved with sophisticated quantitative techniques … and wring every last drop of value from those processes"
                </p>
                <p style={{ fontSize: '0.95rem', color: '#1f2937', fontWeight: '700', marginBottom: '4px' }}>
                  - Thomas H. Davenport, <span style={{ fontWeight: '400', color: '#6b7280' }}>Author, Competing on Analytics</span>
                </p>
                <p style={{ fontSize: '0.85rem', color: '#9ca3af', fontWeight: '500' }}>
                  <a href="https://hbr.org/2006/01/competing-on-analytics" target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', textDecoration: 'none', borderBottom: '1px solid #3b82f6' }}>
                    Harvard Business Review
                  </a>
                </p>
              </div>
            </div>

            {/* Right: Statistics */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '70px' }}>
              <div style={{ 
                background: 'white', 
                padding: '24px 20px', 
                borderRadius: '12px', 
                boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                border: '1px solid #f0f0f0'
              }}>
                <div style={{ 
                  fontSize: '3rem', 
                  fontWeight: '800', 
                  color: '#10b981', 
                  marginBottom: '12px', 
                  lineHeight: '1',
                  letterSpacing: '-0.02em'
                }}>63%</div>
                <p style={{ 
                  fontSize: '0.95rem', 
                  color: '#374151', 
                  lineHeight: '1.6',
                  marginBottom: '0'
                }}>
                  of executives say "analytics improves competitive positioning" (<a href="https://www2.deloitte.com/content/dam/Deloitte/global/Documents/Deloitte-Analytics/dttl-analytics-analytics-advantage-report-061913.pdf" target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '600', borderBottom: '1px solid #3b82f6' }}>Deloitte</a>)
                </p>
              </div>

              <div style={{ 
                background: 'white', 
                padding: '24px 20px', 
                borderRadius: '12px', 
                boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                border: '1px solid #f0f0f0'
              }}>
                <div style={{ 
                  fontSize: '3rem', 
                  fontWeight: '800', 
                  color: '#10b981', 
                  marginBottom: '12px', 
                  lineHeight: '1',
                  letterSpacing: '-0.02em'
                }}>2.8x</div>
                <p style={{ 
                  fontSize: '0.95rem', 
                  color: '#374151', 
                  lineHeight: '1.6',
                  marginBottom: '0'
                }}>
                  increased likelihood among firms with advanced analytics capabilities to report double-digit year-over-year growth (<a href="https://www.forrester.com/blogs/data-analytics-and-insights-investments-produce-tangible-benefits-yes-they-do/" target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '600', borderBottom: '1px solid #3b82f6' }}>Forrester</a>)
                </p>
              </div>

              <div style={{ 
                background: 'white', 
                padding: '24px 20px', 
                borderRadius: '12px', 
                boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                border: '1px solid #f0f0f0'
              }}>
                <div style={{ 
                  fontSize: '3rem', 
                  fontWeight: '800', 
                  color: '#10b981', 
                  marginBottom: '12px', 
                  lineHeight: '1',
                  letterSpacing: '-0.02em'
                }}>6%</div>
                <p style={{ 
                  fontSize: '0.95rem', 
                  color: '#374151', 
                  lineHeight: '1.6',
                  marginBottom: '0'
                }}>
                  average initial increase in profits from big data investments (9% for investments spanning five years) (<a href="https://www.mckinsey.com/industries/technology-media-and-telecommunications/our-insights/big-data-getting-a-better-read-on-performance" target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '600', borderBottom: '1px solid #3b82f6' }}>McKinsey</a>)
                </p>
              </div>
            </div>
          </MaturityMattersGrid>
        </ContentWrapper>
      </ContentSection>

      {/* Data Maturity Curve Section */}
      <ContentSection style={{ background: '#e8e9eb', paddingBottom: '80px' }}>
        <ContentWrapper>
          <SectionTitle style={{ marginBottom: '12px', color: '#2d3748' }}>Data Maturity Curve</SectionTitle>
          <SectionSubtitle style={{ marginBottom: '50px', color: '#4a5568' }}>
            From hindsight to foresight
          </SectionSubtitle>

          <div style={{ 
            position: 'relative', 
            maxWidth: '1400px', 
            margin: '0 auto', 
            padding: '0',
            textAlign: 'center'
          }}>
            <img 
              src="/maturity-curve.png" 
              alt="Data Maturity Curve - From hindsight to foresight" 
              style={{ 
                width: '100%', 
                height: 'auto',
                maxWidth: '100%',
                display: 'block',
                margin: '0 auto',
                borderRadius: '12px'
              }} 
            />
          </div>
        </ContentWrapper>
      </ContentSection>
    </HomeContainer>
  );
};

export default HomePage;
