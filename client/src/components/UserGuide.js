import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {
  FiBook,
  FiUsers,
  FiTarget,
  FiCheckCircle,
  FiPlay,
  FiEdit3,
  FiEye,
  FiBarChart2,
  FiMonitor,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiPrinter,
  FiZap,
  FiTrendingUp,
  FiShield,
  FiHelpCircle,
  FiAlertCircle,
  FiFileText
} from 'react-icons/fi';

// =======================
// STYLED COMPONENTS
// =======================

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 100px 0 40px 0;
  position: relative;
  overflow: hidden;
`;

const FloatingSlideshowButton = styled.button`
  position: fixed;
  top: 100px;
  right: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
  z-index: 100;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 40px rgba(102, 126, 234, 0.6);
  }
  
  @media print {
    display: none !important;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 40px;
`;

const HeroSection = styled.div`
  text-align: center;
  margin-bottom: 40px;
  color: white;
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  font-weight: 900;
  margin-bottom: 15px;
  color: white;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
`;

const HeroSubtitle = styled.p`
  font-size: 1.2rem;
  opacity: 0.95;
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.6;
  color: white;
`;

const Section = styled.div`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin-bottom: 25px;
  text-align: left;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const Card = styled(motion.div)`
  background: rgba(255, 255, 255, 0.98);
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.25);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35);
  }
`;

const IconWrapper = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 16px;
  background: ${props => props.color || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 18px;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
  
  svg {
    width: 30px;
    height: 30px;
    color: white;
  }
`;

const CardTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 12px;
`;

const CardDescription = styled.p`
  font-size: 0.95rem;
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 16px;
`;

const CardList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const CardListItem = styled.li`
  font-size: 0.9rem;
  color: #475569;
  padding: 8px 0;
  padding-left: 25px;
  position: relative;
  line-height: 1.4;
  
  &:before {
    content: '✓';
    position: absolute;
    left: 0;
    color: #10b981;
    font-weight: 700;
    font-size: 1.1rem;
  }
`;

const WorkflowCard = styled(Card)`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.95) 100%);
`;

const WorkflowNumber = styled.div`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: ${props => props.color || '#667eea'};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  font-weight: 800;
  margin-bottom: 16px;
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.3);
`;

const WorkflowTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 14px;
`;

const WorkflowSteps = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const WorkflowStep = styled.div`
  padding: 10px 14px;
  background: #f8fafc;
  border-radius: 8px;
  border-left: 4px solid ${props => props.color || '#667eea'};
  font-size: 0.9rem;
  color: #475569;
  line-height: 1.4;
`;

const FAQItem = styled.div`
  background: rgba(255, 255, 255, 0.98);
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
`;

const FAQQuestion = styled.h4`
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const FAQAnswer = styled.p`
  font-size: 0.95rem;
  color: #64748b;
  line-height: 1.6;
  margin: 0;
`;

const ReportCard = styled(Card)`
  border-left: 5px solid ${props => props.borderColor || '#667eea'};
`;

const ReportTitle = styled.h4`
  font-size: 1.2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 10px;
`;

const ReportDescription = styled.p`
  font-size: 0.9rem;
  color: #64748b;
  line-height: 1.5;
  margin-bottom: 12px;
`;

const ReportFeatures = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const ReportFeature = styled.li`
  font-size: 0.85rem;
  color: #475569;
  padding-left: 20px;
  position: relative;
  
  &:before {
    content: '•';
    position: absolute;
    left: 0;
    color: ${props => props.color || '#667eea'};
    font-weight: 700;
    font-size: 1.2rem;
  }
`;

const TroubleshootCard = styled.div`
  background: rgba(255, 255, 255, 0.98);
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 16px;
  border-left: 5px solid #ef4444;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
`;

const TroubleshootTitle = styled.h4`
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const TroubleshootSolution = styled.p`
  font-size: 0.9rem;
  color: #64748b;
  line-height: 1.6;
  margin: 0;
`;

// Slideshow Styles
const SlideshowOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  z-index: 10000;
  display: flex;
  flex-direction: column;
`;

const SlideshowHeader = styled.div`
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0, 0, 0, 0.2);
  
  @media print {
    display: none !important;
  }
`;

const SlideshowTitle = styled.h2`
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }
  
  svg {
    width: 22px;
    height: 22px;
  }
  
  @media print {
    display: none !important;
  }
`;

const SlideContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  position: relative;
`;

const SlideContent = styled.div`
  position: absolute;
  top: 75px;
  left: 95px;
  right: 95px;
  bottom: 90px;
  display: flex;
  flex-direction: column;
  
  @media print {
    position: relative;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
`;

const NavigationButton = styled.button`
  position: absolute;
  top: 50%;
  ${props => props.direction === 'left' ? 'left: 30px' : 'right: 30px'};
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-50%) scale(1.1);
  }
  
  svg {
    width: 30px;
    height: 30px;
  }
  
  @media print {
    display: none !important;
  }
`;

const SlideCounter = styled.div`
  position: absolute;
  bottom: 30px;
  right: 40px;
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
  background: rgba(0, 0, 0, 0.3);
  padding: 10px 20px;
  border-radius: 25px;
  
  @media print {
    display: none !important;
  }
`;

const PrintButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 12px 24px;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  z-index: 10;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.05);
  }
  
  @media print {
    display: none !important;
  }
`;

// =======================
// MAIN COMPONENT
// =======================

const UserGuide = () => {
  const [showSlideshow, setShowSlideshow] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPrinting, setIsPrinting] = useState(false);

  const slides = [
    { id: 'title', title: 'User Guide', type: 'title' },
    { id: 'overview', title: 'Overview', type: 'overview' },
    { id: 'admin', title: 'Admin Role', type: 'role', index: 0 },
    { id: 'author', title: 'Author Role', type: 'role', index: 1 },
    { id: 'consumer', title: 'Consumer Role', type: 'role', index: 2 },
    { id: 'workflow-1', title: 'Create Assessment', type: 'workflow', index: 0 },
    { id: 'workflow-2', title: 'Assign Users', type: 'workflow', index: 1 },
    { id: 'workflow-3', title: 'Complete Assessment', type: 'workflow', index: 2 },
    { id: 'workflow-4', title: 'View Reports', type: 'workflow', index: 3 },
    { id: 'features', title: 'Key Features', type: 'features' },
    { id: 'reports', title: 'Reports', type: 'reports' },
    { id: 'faq', title: 'FAQ & Troubleshooting', type: 'faq-troubleshooting' },
    { id: 'thank-you', title: 'Thank You', type: 'thank-you' }
  ];

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!showSlideshow) return;
      
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'Escape') {
        setShowSlideshow(false);
        setCurrentSlide(0);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showSlideshow, currentSlide]);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handlePrint = async () => {
    setIsPrinting(true);
    
    setTimeout(async () => {
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [1920, 1080]
      });

      for (let i = 0; i < slides.length; i++) {
        setCurrentSlide(i);
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const slideElement = document.querySelector('[data-slide-content="true"]');
        if (slideElement) {
          const canvas = await html2canvas(slideElement, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#667eea',
            width: slideElement.offsetWidth,
            height: slideElement.offsetHeight
          });

          const imgData = canvas.toDataURL('image/png');
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
          
          if (i > 0) {
            pdf.addPage();
          }
          
          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        }
      }

      pdf.save('user-guide.pdf');
      setCurrentSlide(0);
      setIsPrinting(false);
    }, 100);
  };

  const renderSlideContent = () => {
    const slide = slides[currentSlide];

    // Title Slide
    if (slide.type === 'title') {
      return (
        <SlideContent data-slide-content="true">
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            textAlign: 'center',
            gap: '40px'
          }}>
            <div style={{ fontSize: '8rem' }}>📚</div>
            <h1 style={{
              fontSize: '4.5rem',
              fontWeight: 800,
              color: 'white',
              margin: 0
            }}>
              User Guide
            </h1>
            <p style={{
              fontSize: '2rem',
              color: 'rgba(255, 255, 255, 0.95)',
              maxWidth: '900px',
              margin: 0
            }}>
              Everything you need to know about the Databricks Technical Maturity Assessment tool
            </p>
          </div>
        </SlideContent>
      );
    }

    // Overview Slide
    if (slide.type === 'overview') {
      return (
        <SlideContent data-slide-content="true">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '30px',
            height: '100%'
          }}>
            {[
              { icon: <FiTarget />, title: 'Purpose', desc: 'Evaluate your organization\'s data & AI maturity across 6 key pillars', color: '#667eea' },
              { icon: <FiTrendingUp />, title: 'Outcome', desc: 'Get actionable insights, benchmarks, and a strategic roadmap', color: '#10b981' },
              { icon: <FiUsers />, title: 'Who Uses It', desc: 'Admins, Authors, and Consumers collaborate on assessments', color: '#f59e0b' },
              { icon: <FiCheckCircle />, title: 'Key Benefits', desc: 'Data-driven decisions, industry comparisons, and executive reports', color: '#ec4899' }
            ].map((item, idx) => (
              <div key={idx} style={{
                background: 'rgba(255, 255, 255, 0.98)',
                borderRadius: '20px',
                padding: '40px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '20px',
                  background: item.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '25px'
                }}>
                  {React.cloneElement(item.icon, { style: { width: '40px', height: '40px', color: 'white' } })}
                </div>
                <h3 style={{
                  fontSize: '2rem',
                  fontWeight: 700,
                  color: '#1e293b',
                  marginBottom: '15px'
                }}>
                  {item.title}
                </h3>
                <p style={{
                  fontSize: '1.3rem',
                  color: '#64748b',
                  lineHeight: 1.6
                }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </SlideContent>
      );
    }

    // Role Slides
    if (slide.type === 'role') {
      const roles = [
        {
          icon: <FiShield />,
          title: 'Admin Role',
          color: '#667eea',
          features: [
            'Full system access and control',
            'Create and manage all assessments',
            'Assign users and manage permissions',
            'View all reports and analytics',
            'Configure custom questions',
            'Export and import data'
          ]
        },
        {
          icon: <FiEdit3 />,
          title: 'Author Role',
          color: '#10b981',
          features: [
            'Create new assessments',
            'Assign assessments to consumers',
            'View assigned assessments',
            'Monitor assessment progress',
            'Access reports for owned assessments',
            'Collaborate with consumers'
          ]
        },
        {
          icon: <FiEye />,
          title: 'Consumer Role',
          color: '#f59e0b',
          features: [
            'Complete assigned assessments',
            'Answer assessment questions',
            'Provide pain points and notes',
            'View assessment results',
            'Access maturity reports',
            'Track progress over time'
          ]
        }
      ];

      const role = roles[slide.index];

      return (
        <SlideContent data-slide-content="true">
          <div style={{
            background: 'rgba(255, 255, 255, 0.98)',
            borderRadius: '30px',
            padding: '60px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 30px 80px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{
              width: '90px',
              height: '90px',
              borderRadius: '25px',
              background: role.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '30px'
            }}>
              {React.cloneElement(role.icon, { style: { width: '45px', height: '45px', color: 'white' } })}
            </div>
            <h2 style={{
              fontSize: '3rem',
              fontWeight: 700,
              color: '#1e293b',
              marginBottom: '40px'
            }}>
              {role.title}
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '20px',
              flex: 1
            }}>
              {role.features.map((feature, idx) => (
                <div key={idx} style={{
                  background: '#f8fafc',
                  borderRadius: '15px',
                  padding: '25px',
                  borderLeft: `5px solid ${role.color}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px'
                }}>
                  <div style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    background: role.color,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    flexShrink: 0
                  }}>
                    {idx + 1}
                  </div>
                  <span style={{
                    fontSize: '1.2rem',
                    color: '#475569',
                    lineHeight: 1.5
                  }}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </SlideContent>
      );
    }

    // Workflow Slides
    if (slide.type === 'workflow') {
      const workflows = [
        {
          number: '1',
          title: 'Create Assessment',
          color: '#667eea',
          steps: [
            'Login as Admin or Author',
            'Click "Start Assessment"',
            'Enter organization details',
            'Assessment created and ready'
          ]
        },
        {
          number: '2',
          title: 'Assign Users',
          color: '#10b981',
          steps: [
            'Go to Assignments → Assign Users',
            'Select assessment',
            'Add user emails',
            'Users receive access'
          ]
        },
        {
          number: '3',
          title: 'Complete Assessment',
          color: '#f59e0b',
          steps: [
            'Login as Consumer',
            'View "My Assessments"',
            'Answer questions for each pillar',
            'Rate current/future state',
            'Submit when complete'
          ]
        },
        {
          number: '4',
          title: 'View Reports',
          color: '#ec4899',
          steps: [
            'Navigate to assessment',
            'Click "View Report"',
            'Explore maturity scores',
            'View Executive Command Center',
            'Check Industry Benchmarks',
            'Export or print reports'
          ]
        }
      ];

      const workflow = workflows[slide.index];

      // Adjust spacing based on number of steps
      const hasMoreSteps = workflow.steps.length > 4;
      const stepGap = hasMoreSteps ? '10px' : '18px';
      const stepPadding = hasMoreSteps ? '14px 20px' : '20px 25px';
      const stepFontSize = hasMoreSteps ? '1.05rem' : '1.2rem';
      const badgeSize = hasMoreSteps ? '55px' : '70px';
      const badgeFontSize = hasMoreSteps ? '1.8rem' : '2.5rem';
      const titleSize = hasMoreSteps ? '2rem' : '2.5rem';
      const titleMargin = hasMoreSteps ? '18px' : '35px';
      const containerPadding = hasMoreSteps ? '35px 60px' : '50px 60px';

      return (
        <SlideContent data-slide-content="true">
          <div style={{
            background: 'rgba(255, 255, 255, 0.98)',
            borderRadius: '30px',
            padding: containerPadding,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 30px 80px rgba(0, 0, 0, 0.3)',
            overflow: 'hidden'
          }}>
            <div style={{
              width: badgeSize,
              height: badgeSize,
              borderRadius: '50%',
              background: workflow.color,
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: badgeFontSize,
              fontWeight: 800,
              marginBottom: '20px'
            }}>
              {workflow.number}
            </div>
            <h2 style={{
              fontSize: titleSize,
              fontWeight: 700,
              color: '#1e293b',
              marginBottom: titleMargin
            }}>
              {workflow.title}
            </h2>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: stepGap,
              flex: 1,
              overflow: 'auto'
            }}>
              {workflow.steps.map((step, idx) => (
                <div key={idx} style={{
                  background: '#f8fafc',
                  borderRadius: '12px',
                  padding: stepPadding,
                  borderLeft: `5px solid ${workflow.color}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  fontSize: stepFontSize,
                  color: '#475569',
                  lineHeight: 1.4
                }}>
                  <div style={{
                    width: hasMoreSteps ? '34px' : '38px',
                    height: hasMoreSteps ? '34px' : '38px',
                    borderRadius: '50%',
                    background: workflow.color,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: hasMoreSteps ? '1rem' : '1.1rem',
                    fontWeight: 700,
                    flexShrink: 0
                  }}>
                    {idx + 1}
                  </div>
                  {step}
                </div>
              ))}
            </div>
          </div>
        </SlideContent>
      );
    }

    // Key Features Slide
    if (slide.type === 'features') {
      const features = [
        { icon: '📊', title: 'Maturity Scoring', color: '#667eea' },
        { icon: '🎯', title: 'Gap Analysis', color: '#10b981' },
        { icon: '⚡', title: 'Quick Wins', color: '#f59e0b' },
        { icon: '📈', title: 'Progress Tracking', color: '#ec4899' },
        { icon: '✓', title: 'Best Practices', color: '#8b5cf6' },
        { icon: '👥', title: 'Stakeholder Alignment', color: '#06b6d4' },
        { icon: '💻', title: 'Executive Dashboards', color: '#f43f5e' },
        { icon: '🛡️', title: 'Industry Benchmarks', color: '#14b8a6' },
        { icon: '📚', title: 'Comprehensive Reports', color: '#a855f7' }
      ];

      return (
        <SlideContent data-slide-content="true">
          <div style={{
            background: 'rgba(255, 255, 255, 0.98)',
            borderRadius: '30px',
            padding: '50px',
            height: '100%',
            boxShadow: '0 30px 80px rgba(0, 0, 0, 0.3)',
            overflow: 'auto'
          }}>
            <h2 style={{
              fontSize: '3rem',
              fontWeight: 700,
              color: '#1e293b',
              marginBottom: '40px',
              textAlign: 'center'
            }}>
              Key Features
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '25px'
            }}>
              {features.map((feature, idx) => (
                <div key={idx} style={{
                  background: '#f8fafc',
                  borderRadius: '16px',
                  padding: '25px',
                  textAlign: 'center',
                  borderTop: `4px solid ${feature.color}`
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: '15px' }}>{feature.icon}</div>
                  <h3 style={{
                    fontSize: '1.3rem',
                    fontWeight: 700,
                    color: '#1e293b',
                    margin: 0
                  }}>
                    {feature.title}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </SlideContent>
      );
    }

    // Reports Slide
    if (slide.type === 'reports') {
      const reports = [
        { icon: '📄', title: 'Maturity Assessment Report', color: '#667eea' },
        { icon: '📊', title: 'Executive Command Center', color: '#10b981' },
        { icon: '📈', title: 'Industry Benchmarks', color: '#f59e0b' },
        { icon: '💻', title: 'Insights Dashboard', color: '#ec4899' }
      ];

      return (
        <SlideContent data-slide-content="true">
          <div style={{
            background: 'rgba(255, 255, 255, 0.98)',
            borderRadius: '30px',
            padding: '60px',
            height: '100%',
            boxShadow: '0 30px 80px rgba(0, 0, 0, 0.3)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <h2 style={{
              fontSize: '3rem',
              fontWeight: 700,
              color: '#1e293b',
              marginBottom: '40px',
              textAlign: 'center'
            }}>
              Available Reports
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '30px',
              flex: 1
            }}>
              {reports.map((report, idx) => (
                <div key={idx} style={{
                  background: '#f8fafc',
                  borderRadius: '20px',
                  padding: '35px',
                  borderLeft: `6px solid ${report.color}`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '4rem', marginBottom: '20px' }}>{report.icon}</div>
                  <h3 style={{
                    fontSize: '1.6rem',
                    fontWeight: 700,
                    color: '#1e293b',
                    margin: 0
                  }}>
                    {report.title}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </SlideContent>
      );
    }

    // FAQ & Troubleshooting Slide
    if (slide.type === 'faq-troubleshooting') {
      return (
        <SlideContent data-slide-content="true">
          <div style={{
            background: 'rgba(255, 255, 255, 0.98)',
            borderRadius: '30px',
            padding: '50px',
            height: '100%',
            boxShadow: '0 30px 80px rgba(0, 0, 0, 0.3)',
            overflow: 'auto'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '40px',
              height: '100%'
            }}>
              {/* FAQ */}
              <div>
                <h2 style={{
                  fontSize: '2.2rem',
                  fontWeight: 700,
                  color: '#667eea',
                  marginBottom: '25px'
                }}>
                  ❓ FAQ
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {[
                    { q: 'How long does an assessment take?', a: '30-45 minutes' },
                    { q: 'Can I edit responses?', a: 'Yes, admins can edit anytime' },
                    { q: 'How are scores calculated?', a: 'Average of all dimensions' },
                    { q: 'Can I export data?', a: 'Yes, to Excel and PDF' },
                    { q: 'How often to reassess?', a: 'Every 6-12 months' },
                    { q: 'Who can view results?', a: 'Role-based access control' }
                  ].map((item, idx) => (
                    <div key={idx} style={{
                      background: '#f8fafc',
                      borderRadius: '12px',
                      padding: '15px',
                      borderLeft: '4px solid #667eea'
                    }}>
                      <div style={{
                        fontSize: '1rem',
                        fontWeight: 700,
                        color: '#1e293b',
                        marginBottom: '6px'
                      }}>
                        {item.q}
                      </div>
                      <div style={{
                        fontSize: '0.9rem',
                        color: '#64748b'
                      }}>
                        {item.a}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Troubleshooting */}
              <div>
                <h2 style={{
                  fontSize: '2.2rem',
                  fontWeight: 700,
                  color: '#ef4444',
                  marginBottom: '25px'
                }}>
                  🔧 Troubleshooting
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {[
                    { issue: 'Can\'t see assessments', fix: 'Check login email' },
                    { issue: 'Progress not saving', fix: 'Check internet connection' },
                    { issue: 'Reports not generating', fix: 'Complete at least one pillar' },
                    { issue: 'Excel import failing', fix: 'Use original template' },
                    { issue: 'Can\'t assign users', fix: 'Verify role permissions' },
                    { issue: 'Need help?', fix: 'Contact support' }
                  ].map((item, idx) => (
                    <div key={idx} style={{
                      background: '#fef2f2',
                      borderRadius: '12px',
                      padding: '15px',
                      borderLeft: '4px solid #ef4444'
                    }}>
                      <div style={{
                        fontSize: '1rem',
                        fontWeight: 700,
                        color: '#1e293b',
                        marginBottom: '6px'
                      }}>
                        {item.issue}
                      </div>
                      <div style={{
                        fontSize: '0.9rem',
                        color: '#64748b'
                      }}>
                        {item.fix}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </SlideContent>
      );
    }

    // Thank You Slide
    if (slide.type === 'thank-you') {
      return (
        <SlideContent data-slide-content="true">
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            textAlign: 'center',
            gap: '40px'
          }}>
            <div style={{ fontSize: '8rem' }}>✨</div>
            <h1 style={{
              fontSize: '5rem',
              fontWeight: 800,
              color: 'white',
              margin: 0
            }}>
              Thank You
            </h1>
            <p style={{
              fontSize: '2rem',
              color: 'rgba(255, 255, 255, 0.95)',
              maxWidth: '900px',
              margin: 0
            }}>
              For any questions or support, contact us at:
            </p>
            <p style={{
              fontSize: '1.5rem',
              color: 'white',
              fontWeight: 600
            }}>
              nitin.aggarwal@databricks.com
            </p>
          </div>
        </SlideContent>
      );
    }

    return null;
  };

  if (showSlideshow) {
    return (
      <SlideshowOverlay>
        <SlideshowHeader>
          <SlideshowTitle>User Guide</SlideshowTitle>
          <CloseButton onClick={() => setShowSlideshow(false)}>
            <FiX />
          </CloseButton>
        </SlideshowHeader>

        <SlideContainer>
          {renderSlideContent()}
          
          {currentSlide > 0 && (
            <NavigationButton direction="left" onClick={prevSlide}>
              <FiChevronLeft />
            </NavigationButton>
          )}
          
          {currentSlide < slides.length - 1 && (
            <NavigationButton direction="right" onClick={nextSlide}>
              <FiChevronRight />
            </NavigationButton>
          )}

          <PrintButton onClick={handlePrint} disabled={isPrinting}>
            <FiPrinter />
            {isPrinting ? 'Generating PDF...' : 'Print'}
          </PrintButton>

          <SlideCounter>
            {currentSlide + 1} / {slides.length}
          </SlideCounter>
        </SlideContainer>
      </SlideshowOverlay>
    );
  }

  return (
    <PageContainer>
      <FloatingSlideshowButton onClick={() => setShowSlideshow(true)}>
        <FiMonitor /> Slideshow
      </FloatingSlideshowButton>

      <ContentWrapper>
        {/* User Roles */}
        <Section>
          <SectionTitle>User Roles</SectionTitle>
          <Grid>
            <Card
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <IconWrapper color="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
                <FiShield />
              </IconWrapper>
              <CardTitle>Admin</CardTitle>
              <CardDescription>
                Full system access with complete control over assessments, users, and configurations.
              </CardDescription>
              <CardList>
                <CardListItem>Create and manage all assessments</CardListItem>
                <CardListItem>Assign users and permissions</CardListItem>
                <CardListItem>Configure custom questions</CardListItem>
                <CardListItem>View all reports and analytics</CardListItem>
                <CardListItem>Export and import data</CardListItem>
              </CardList>
            </Card>

            <Card
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <IconWrapper color="linear-gradient(135deg, #10b981 0%, #059669 100%)">
                <FiEdit3 />
              </IconWrapper>
              <CardTitle>Author</CardTitle>
              <CardDescription>
                Create assessments and assign them to consumers for completion.
              </CardDescription>
              <CardList>
                <CardListItem>Create new assessments</CardListItem>
                <CardListItem>Assign to consumers</CardListItem>
                <CardListItem>Monitor progress</CardListItem>
                <CardListItem>View owned assessment reports</CardListItem>
                <CardListItem>Collaborate with consumers</CardListItem>
              </CardList>
            </Card>

            <Card
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <IconWrapper color="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)">
                <FiEye />
              </IconWrapper>
              <CardTitle>Consumer</CardTitle>
              <CardDescription>
                Complete assigned assessments and view results for your organization.
              </CardDescription>
              <CardList>
                <CardListItem>Complete assigned assessments</CardListItem>
                <CardListItem>Answer assessment questions</CardListItem>
                <CardListItem>Provide pain points and notes</CardListItem>
                <CardListItem>View assessment results</CardListItem>
                <CardListItem>Track progress over time</CardListItem>
              </CardList>
            </Card>
          </Grid>
        </Section>

        {/* Key Workflows */}
        <Section>
          <SectionTitle>Key Workflows</SectionTitle>
          <Grid>
            <WorkflowCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <WorkflowNumber color="#667eea">1</WorkflowNumber>
              <WorkflowTitle>Create Assessment</WorkflowTitle>
              <WorkflowSteps>
                <WorkflowStep color="#667eea">Login as Admin or Author</WorkflowStep>
                <WorkflowStep color="#667eea">Click "Start Assessment"</WorkflowStep>
                <WorkflowStep color="#667eea">Enter organization details</WorkflowStep>
                <WorkflowStep color="#667eea">Assessment created and ready</WorkflowStep>
              </WorkflowSteps>
            </WorkflowCard>

            <WorkflowCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <WorkflowNumber color="#10b981">2</WorkflowNumber>
              <WorkflowTitle>Assign Users</WorkflowTitle>
              <WorkflowSteps>
                <WorkflowStep color="#10b981">Go to Assignments → Assign Users</WorkflowStep>
                <WorkflowStep color="#10b981">Select assessment</WorkflowStep>
                <WorkflowStep color="#10b981">Add user emails</WorkflowStep>
                <WorkflowStep color="#10b981">Users receive access</WorkflowStep>
              </WorkflowSteps>
            </WorkflowCard>

            <WorkflowCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <WorkflowNumber color="#f59e0b">3</WorkflowNumber>
              <WorkflowTitle>Complete Assessment</WorkflowTitle>
              <WorkflowSteps>
                <WorkflowStep color="#f59e0b">Login as Consumer</WorkflowStep>
                <WorkflowStep color="#f59e0b">View "My Assessments"</WorkflowStep>
                <WorkflowStep color="#f59e0b">Answer questions for each pillar</WorkflowStep>
                <WorkflowStep color="#f59e0b">Rate current/future state</WorkflowStep>
                <WorkflowStep color="#f59e0b">Submit when complete</WorkflowStep>
              </WorkflowSteps>
            </WorkflowCard>

            <WorkflowCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <WorkflowNumber color="#ec4899">4</WorkflowNumber>
              <WorkflowTitle>View Reports</WorkflowTitle>
              <WorkflowSteps>
                <WorkflowStep color="#ec4899">Navigate to assessment</WorkflowStep>
                <WorkflowStep color="#ec4899">Click "View Report"</WorkflowStep>
                <WorkflowStep color="#ec4899">Explore maturity scores</WorkflowStep>
                <WorkflowStep color="#ec4899">View Executive Command Center</WorkflowStep>
                <WorkflowStep color="#ec4899">Check Industry Benchmarks</WorkflowStep>
                <WorkflowStep color="#ec4899">Export or print reports</WorkflowStep>
              </WorkflowSteps>
            </WorkflowCard>
          </Grid>
        </Section>

        {/* Key Features */}
        <Section>
          <SectionTitle>Key Features</SectionTitle>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
            marginBottom: '30px'
          }}>
            {[
              { icon: <FiBarChart2 />, title: 'Maturity Scoring', desc: 'Quantified maturity levels across all dimensions', color: '#667eea' },
              { icon: <FiTarget />, title: 'Gap Analysis', desc: 'Clear visualization of gaps between current and target state', color: '#10b981' },
              { icon: <FiZap />, title: 'Quick Wins', desc: 'Immediate opportunities for impact in 30-90 days', color: '#f59e0b' },
              { icon: <FiTrendingUp />, title: 'Progress Tracking', desc: 'Re-assess over time to measure improvement', color: '#ec4899' },
              { icon: <FiCheckCircle />, title: 'Best Practices', desc: 'Access to proven patterns and frameworks', color: '#8b5cf6' },
              { icon: <FiUsers />, title: 'Stakeholder Alignment', desc: 'Reports tailored for different audiences', color: '#06b6d4' },
              { icon: <FiMonitor />, title: 'Executive Dashboards', desc: 'High-level insights for leadership teams', color: '#f43f5e' },
              { icon: <FiShield />, title: 'Industry Benchmarks', desc: 'Compare against industry standards', color: '#14b8a6' },
              { icon: <FiBook />, title: 'Comprehensive Reports', desc: 'Detailed analysis and recommendations', color: '#a855f7' }
            ].map((feature, idx) => (
              <Card
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <IconWrapper color={feature.color}>
                  {feature.icon}
                </IconWrapper>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.desc}</CardDescription>
              </Card>
            ))}
          </div>
        </Section>

        {/* Reports */}
        <Section>
          <SectionTitle>Reports</SectionTitle>
          <Grid>
            <ReportCard
              borderColor="#667eea"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <IconWrapper color="#667eea">
                <FiFileText />
              </IconWrapper>
              <ReportTitle>Maturity Assessment Report</ReportTitle>
              <ReportDescription>
                Comprehensive analysis of your organization's maturity across all pillars
              </ReportDescription>
              <ReportFeatures>
                <ReportFeature color="#667eea">Current vs. target state comparison</ReportFeature>
                <ReportFeature color="#667eea">Pillar-specific maturity scores</ReportFeature>
                <ReportFeature color="#667eea">Dimension-level breakdown</ReportFeature>
                <ReportFeature color="#667eea">Improvement recommendations</ReportFeature>
              </ReportFeatures>
            </ReportCard>

            <ReportCard
              borderColor="#10b981"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <IconWrapper color="#10b981">
                <FiBarChart2 />
              </IconWrapper>
              <ReportTitle>Executive Command Center</ReportTitle>
              <ReportDescription>
                High-level strategic insights for leadership and stakeholders
              </ReportDescription>
              <ReportFeatures>
                <ReportFeature color="#10b981">Top strategic imperatives</ReportFeature>
                <ReportFeature color="#10b981">Quick wins and priorities</ReportFeature>
                <ReportFeature color="#10b981">Risk assessment</ReportFeature>
                <ReportFeature color="#10b981">Executive summary</ReportFeature>
              </ReportFeatures>
            </ReportCard>

            <ReportCard
              borderColor="#f59e0b"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <IconWrapper color="#f59e0b">
                <FiTrendingUp />
              </IconWrapper>
              <ReportTitle>Industry Benchmarks</ReportTitle>
              <ReportDescription>
                Compare your maturity against industry standards and peers
              </ReportDescription>
              <ReportFeatures>
                <ReportFeature color="#f59e0b">Competitive positioning</ReportFeature>
                <ReportFeature color="#f59e0b">Industry averages by pillar</ReportFeature>
                <ReportFeature color="#f59e0b">Gap analysis vs. leaders</ReportFeature>
                <ReportFeature color="#f59e0b">Strategic recommendations</ReportFeature>
              </ReportFeatures>
            </ReportCard>

            <ReportCard
              borderColor="#ec4899"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <IconWrapper color="#ec4899">
                <FiMonitor />
              </IconWrapper>
              <ReportTitle>Insights Dashboard</ReportTitle>
              <ReportDescription>
                Real-time analytics and progress tracking across assessments
              </ReportDescription>
              <ReportFeatures>
                <ReportFeature color="#ec4899">Assessment completion rates</ReportFeature>
                <ReportFeature color="#ec4899">Maturity trends over time</ReportFeature>
                <ReportFeature color="#ec4899">User engagement metrics</ReportFeature>
                <ReportFeature color="#ec4899">Cross-pillar insights</ReportFeature>
              </ReportFeatures>
            </ReportCard>
          </Grid>
        </Section>

        {/* FAQ & Troubleshooting Side by Side */}
        <Section>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '30px'
          }}>
            {/* FAQ - Left Side */}
            <div>
              <SectionTitle style={{ textAlign: 'left', marginBottom: '20px' }}>Frequently Asked Questions</SectionTitle>
              <FAQItem>
                <FAQQuestion>
                  <FiHelpCircle style={{ color: '#667eea', flexShrink: 0 }} />
                  How long does an assessment take?
                </FAQQuestion>
                <FAQAnswer>
                  A typical assessment takes 30-45 minutes to complete, depending on the depth of responses. You can save progress and return later if needed.
                </FAQAnswer>
              </FAQItem>

              <FAQItem>
                <FAQQuestion>
                  <FiHelpCircle style={{ color: '#667eea', flexShrink: 0 }} />
                  Can I edit my responses after submission?
                </FAQQuestion>
                <FAQAnswer>
                  Yes, admins can edit assessment responses at any time. Changes are tracked in the assessment history for audit purposes.
                </FAQAnswer>
              </FAQItem>

              <FAQItem>
                <FAQQuestion>
                  <FiHelpCircle style={{ color: '#667eea', flexShrink: 0 }} />
                  How are maturity scores calculated?
                </FAQQuestion>
                <FAQAnswer>
                  Maturity scores are calculated based on your responses across all dimensions within each pillar. Each dimension is weighted equally, and the overall pillar score is the average of its dimensions.
                </FAQAnswer>
              </FAQItem>

              <FAQItem>
                <FAQQuestion>
                  <FiHelpCircle style={{ color: '#667eea', flexShrink: 0 }} />
                  Can I export assessment data?
                </FAQQuestion>
                <FAQAnswer>
                  Yes, admins can export assessments to Excel format, make changes offline, and re-import them. All reports can also be printed or saved as PDFs.
                </FAQAnswer>
              </FAQItem>

              <FAQItem>
                <FAQQuestion>
                  <FiHelpCircle style={{ color: '#667eea', flexShrink: 0 }} />
                  How often should we reassess?
                </FAQQuestion>
                <FAQAnswer>
                  We recommend reassessing every 6-12 months to track progress and measure the impact of implemented improvements. This helps demonstrate ROI and identify new opportunities.
                </FAQAnswer>
              </FAQItem>

              <FAQItem>
                <FAQQuestion>
                  <FiHelpCircle style={{ color: '#667eea', flexShrink: 0 }} />
                  Who can view assessment results?
                </FAQQuestion>
                <FAQAnswer>
                  Admins can view all assessments. Authors can view assessments they created or are assigned to. Consumers can view assessments they've been assigned to complete. Access is role-based and secure.
                </FAQAnswer>
              </FAQItem>
            </div>

            {/* Troubleshooting - Right Side */}
            <div>
              <SectionTitle style={{ textAlign: 'left', marginBottom: '20px' }}>Troubleshooting</SectionTitle>
              <TroubleshootCard>
                <TroubleshootTitle>
                  <FiAlertCircle style={{ color: '#ef4444', flexShrink: 0 }} />
                  I can't see my assigned assessments
                </TroubleshootTitle>
                <TroubleshootSolution>
                  <strong>Solution:</strong> Make sure you're logged in with the correct email address that was used for the assignment. Check the "My Assessments" section under the Assessments dropdown. If the issue persists, contact your admin to verify the assignment.
                </TroubleshootSolution>
              </TroubleshootCard>

              <TroubleshootCard>
                <TroubleshootTitle>
                  <FiAlertCircle style={{ color: '#ef4444', flexShrink: 0 }} />
                  Assessment progress is not saving
                </TroubleshootTitle>
                <TroubleshootSolution>
                  <strong>Solution:</strong> Ensure you have a stable internet connection. The system auto-saves after each question, but you can also manually click "Save Progress". Clear your browser cache and try again if the issue continues.
                </TroubleshootSolution>
              </TroubleshootCard>

              <TroubleshootCard>
                <TroubleshootTitle>
                  <FiAlertCircle style={{ color: '#ef4444', flexShrink: 0 }} />
                  Reports are not generating or showing errors
                </TroubleshootTitle>
                <TroubleshootSolution>
                  <strong>Solution:</strong> Reports require at least one completed pillar. Ensure the assessment has sufficient data. Try refreshing the page or logging out and back in. If the error persists, contact support with the assessment ID.
                </TroubleshootSolution>
              </TroubleshootCard>

              <TroubleshootCard>
                <TroubleshootTitle>
                  <FiAlertCircle style={{ color: '#ef4444', flexShrink: 0 }} />
                  Excel import is failing
                </TroubleshootTitle>
                <TroubleshootSolution>
                  <strong>Solution:</strong> Ensure you're using the exact Excel file exported from the system without changing column headers or structure. Check that all required fields are filled and data types match (e.g., numbers for scores). Re-download a fresh template if needed.
                </TroubleshootSolution>
              </TroubleshootCard>

              <TroubleshootCard>
                <TroubleshootTitle>
                  <FiAlertCircle style={{ color: '#ef4444', flexShrink: 0 }} />
                  Unable to assign users to assessments
                </TroubleshootTitle>
                <TroubleshootSolution>
                  <strong>Solution:</strong> Verify you have Author or Admin role permissions. Ensure the email addresses are valid and properly formatted. Check that the assessment exists and is not archived. Users will receive access immediately upon assignment.
                </TroubleshootSolution>
              </TroubleshootCard>

              <TroubleshootCard>
                <TroubleshootTitle>
                  <FiAlertCircle style={{ color: '#ef4444', flexShrink: 0 }} />
                  Need additional help?
                </TroubleshootTitle>
                <TroubleshootSolution>
                  <strong>Contact Support:</strong> For issues not covered here, reach out to <strong>nitin.aggarwal@databricks.com</strong> with your assessment ID, role, and a description of the problem. Include screenshots if possible.
                </TroubleshootSolution>
              </TroubleshootCard>
            </div>
          </div>
        </Section>
      </ContentWrapper>
    </PageContainer>
  );
};

export default UserGuide;
