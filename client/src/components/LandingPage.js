import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FiTrendingUp, 
  FiUsers, 
  FiClock, 
  FiAward, 
  FiLayers, 
  FiZap 
} from 'react-icons/fi';

const LandingContainer = styled.div`
  min-height: calc(100vh - 80px);
  background: #f8f9fa;
`;

const BenefitsSection = styled.section`
  background: white;
  padding: 80px 20px;
`;

const PillarsSection = styled.section`
  background: #f8f9fa;
  padding: 80px 20px;
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  font-size: 3rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 16px;
  color: #1a1a1a;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const SectionSubtitle = styled.p`
  font-size: 1.15rem;
  text-align: center;
  margin-bottom: 60px;
  color: #64748b;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.7;
`;

const PillarsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 32px;
  margin-bottom: 40px;
`;

const PillarCard = styled(motion.div)`
  background: white;
  padding: 32px;
  border-radius: 16px;
  border: 2px solid ${props => props.color}20;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    border-color: ${props => props.color};
  }
`;

const PillarHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 2px solid ${props => props.color}20;
`;

const PillarIcon = styled.div`
  font-size: 2.5rem;
  line-height: 1;
`;

const PillarTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1.3;
`;

const PillarDescription = styled.p`
  font-size: 1rem;
  color: #64748b;
  margin-bottom: 20px;
  line-height: 1.6;
`;

const PillarDimensions = styled.p`
  font-size: 0.9rem;
  color: #94a3b8;
  line-height: 1.6;
  
  strong {
    color: #475569;
    font-weight: 600;
  }
`;

const BenefitsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const BenefitCard = styled(motion.div)`
  background: white;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }
`;

const BenefitIcon = styled.div`
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  color: white;
`;

const BenefitTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 12px;
  color: #1a1a1a;
`;

const BenefitDescription = styled.p`
  font-size: 1rem;
  color: #64748b;
  line-height: 1.7;
`;

const LandingPage = ({ framework, onStartAssessment }) => {
  const pillarsData = [
    {
      icon: '🧱',
      title: 'Platform & Governance',
      description: 'Assess how well your Databricks foundation is secured, scalable, and governed.',
      dimensions: 'Environment Architecture, Security & Access Control, Governance & Compliance, Observability & Monitoring, Cost Management',
      color: '#3b82f6'
    },
    {
      icon: '💾',
      title: 'Data Engineering & Integration',
      description: 'Evaluate how efficiently data is ingested, transformed, and managed within Databricks.',
      dimensions: 'Ingestion Strategy, Lakehouse Architecture, Pipeline Orchestration, Data Quality, Performance & Scalability',
      color: '#10b981'
    },
    {
      icon: '📊',
      title: 'Analytics & BI Modernization',
      description: 'Assess how Databricks supports governed analytics, performance, and self-service access.',
      dimensions: 'Query Performance, Data Modeling, Visualization & Reporting, Self-Service Enablement, Collaboration & Sharing',
      color: '#f59e0b'
    },
    {
      icon: '🧠',
      title: 'Machine Learning & MLOps',
      description: 'Understand how Databricks is leveraged for classical and predictive ML use cases.',
      dimensions: 'Experimentation & Tracking, Model Deployment, Feature Management, ML Lifecycle Governance, Business Impact',
      color: '#8b5cf6'
    },
    {
      icon: '🤖',
      title: 'Generative AI & Agentic Capabilities',
      description: 'Evaluate readiness to operationalize GenAI and agent-based intelligence within Databricks.',
      dimensions: 'GenAI Strategy, Data & Knowledge Readiness, Application Development, Evaluation & Quality Control, Responsible AI',
      color: '#ef4444'
    },
    {
      icon: '🚀',
      title: 'Operational Excellence & Adoption',
      description: 'Measure organizational readiness, adoption velocity, and realized value from Databricks.',
      dimensions: 'Center of Excellence, Community of Practice, Training & Enablement, Financial Management, Innovation & Improvement',
      color: '#06b6d4'
    }
  ];

  return (
    <LandingContainer>
      <BenefitsSection>
        <ContentWrapper>
          <SectionTitle>Why Take This Assessment?</SectionTitle>
          <SectionSubtitle>
            Gain clarity on your Databricks journey and unlock the full potential of your data and AI initiatives.
          </SectionSubtitle>

          <BenefitsGrid>
            {/* Row 1: Strategic & Business Value */}
            <BenefitCard
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <BenefitIcon>
                <FiTrendingUp size={24} />
              </BenefitIcon>
              <BenefitTitle>Accelerate Growth</BenefitTitle>
              <BenefitDescription>
                Identify opportunities to maximize your Databricks investment and accelerate your data maturity journey.
              </BenefitDescription>
            </BenefitCard>

            <BenefitCard
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <BenefitIcon>
                <FiZap size={24} />
              </BenefitIcon>
              <BenefitTitle>Maximize ROI</BenefitTitle>
              <BenefitDescription>
                Optimize your platform costs, improve resource utilization, and demonstrate measurable business value.
              </BenefitDescription>
            </BenefitCard>

            <BenefitCard
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <BenefitIcon>
                <FiUsers size={24} />
              </BenefitIcon>
              <BenefitTitle>Align Teams</BenefitTitle>
              <BenefitDescription>
                Create a shared understanding of priorities and build consensus around your data strategy and roadmap.
              </BenefitDescription>
            </BenefitCard>

            {/* Row 2: Operational & Practical Benefits */}
            <BenefitCard
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <BenefitIcon>
                <FiClock size={24} />
              </BenefitIcon>
              <BenefitTitle>Save Time</BenefitTitle>
              <BenefitDescription>
                Focus your efforts on the highest-impact improvements with prioritized recommendations and clear next steps.
              </BenefitDescription>
            </BenefitCard>

            <BenefitCard
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <BenefitIcon>
                <FiLayers size={24} />
              </BenefitIcon>
              <BenefitTitle>Reduce Risk</BenefitTitle>
              <BenefitDescription>
                Identify security gaps, governance weaknesses, and operational risks before they impact your business.
              </BenefitDescription>
            </BenefitCard>

            <BenefitCard
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <BenefitIcon>
                <FiAward size={24} />
              </BenefitIcon>
              <BenefitTitle>Best Practices</BenefitTitle>
              <BenefitDescription>
                Learn from industry best practices and proven patterns for successful Databricks implementations.
              </BenefitDescription>
            </BenefitCard>
          </BenefitsGrid>
        </ContentWrapper>
      </BenefitsSection>

      <PillarsSection>
        <ContentWrapper>
          <SectionTitle>Assessment Pillars</SectionTitle>
          <SectionSubtitle>
            Evaluate your Databricks maturity across these 6 comprehensive pillars, each containing 5 dimensions with targeted questions.
          </SectionSubtitle>

          <PillarsGrid>
            {pillarsData.map((pillar, index) => (
              <PillarCard
                key={index}
                color={pillar.color}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <PillarHeader color={pillar.color}>
                  <PillarIcon>{pillar.icon}</PillarIcon>
                  <PillarTitle>{pillar.title}</PillarTitle>
                </PillarHeader>
                <PillarDescription>{pillar.description}</PillarDescription>
                <PillarDimensions>
                  <strong>Dimensions:</strong> {pillar.dimensions}
                </PillarDimensions>
              </PillarCard>
            ))}
          </PillarsGrid>
        </ContentWrapper>
      </PillarsSection>
    </LandingContainer>
  );
};

export default LandingPage;
