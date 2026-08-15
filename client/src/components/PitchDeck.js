import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiArrowRight, FiCheckCircle, FiTrendingUp, FiTarget, FiAward, FiZap, FiBarChart2, FiUsers, FiDollarSign, FiClock, FiShield, FiActivity, FiMonitor, FiPrinter, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 80px 0 10px 0;
  overflow-x: hidden;
  
  @media print {
    padding: 0;
    background: white;
  }
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
  overflow: hidden;
`;

const SlideshowHeader = styled.div`
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  
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

const SlideshowControls = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
`;

const ControlButton = styled.button`
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
  overflow: hidden;
  
  @media print {
    padding: 0;
    page-break-after: always;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
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
    width: 100%;
    height: 100%;
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
  backdrop-filter: blur(10px);
  
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
  backdrop-filter: blur(10px);
  z-index: 10;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.05);
  }
  
  @media print {
    display: none !important;
  }
`;

const HeroSection = styled.div`
  max-width: 1400px;
  margin: 0 auto 20px auto;
  padding: 20px 40px 0 40px;
  text-align: center;
  color: white;
`;

const HeroTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 12px;
  line-height: 1.2;
  background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.95);
  max-width: 900px;
  margin: 0 auto;
  line-height: 1.4;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const CTAButton = styled.button`
  background: white;
  color: #667eea;
  padding: 18px 48px;
  font-size: 1.2rem;
  font-weight: 700;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
    background: #f8f9ff;
  }
`;

const ContentSection = styled.div`
  max-width: 1400px;
  margin: 0 auto 30px auto;
  padding: 0 40px;
`;

const SectionTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 12px;
  color: white;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const SectionSubtitle = styled.p`
  font-size: 1rem;
  text-align: center;
  margin-bottom: 25px;
  color: rgba(255, 255, 255, 0.9);
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.5;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.98);
  border-radius: 16px;
  padding: 25px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  border: 2px solid rgba(255, 255, 255, 0.3);
  height: 100%;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
    border-color: rgba(255, 255, 255, 0.6);
  }
`;

const IconWrapper = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 15px;
  background: ${props => props.color || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
  
  svg {
    width: 25px;
    height: 25px;
    color: white;
  }
`;

const CardTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 10px;
  line-height: 1.3;
`;

const CardDescription = styled.p`
  font-size: 0.9rem;
  color: #64748b;
  line-height: 1.5;
  margin-bottom: 12px;
`;

const CardList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;
`;

const CardListItem = styled.li`
  font-size: 0.85rem;
  color: #475569;
  padding: 6px 0;
  padding-left: 22px;
  position: relative;
  line-height: 1.4;
  
  &:before {
    content: '✓';
    position: absolute;
    left: 0;
    color: #10b981;
    font-weight: 700;
    font-size: 1rem;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin: 0;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 20px;
  text-align: center;
  border: 2px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: scale(1.05);
  }
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 800;
  color: white;
  margin-bottom: 8px;
  line-height: 1;
`;

const StatLabel = styled.div`
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.95);
  font-weight: 500;
`;

const PitchDeck = () => {
  const [showSlideshow, setShowSlideshow] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPrinting, setIsPrinting] = useState(false);

  const slides = [
    { id: 'title', title: 'Transform Your Data & AI Journey', type: 'title' },
    { id: 'stats', title: 'Impact at a Glance', type: 'stats' },
    { id: 'why-clarity', title: 'Strategic Clarity', type: 'why-card', index: 0 },
    { id: 'why-roadmap', title: 'Actionable Roadmap', type: 'why-card', index: 1 },
    { id: 'why-insights', title: 'Executive-Ready Insights', type: 'why-card', index: 2 },
    { id: 'how-it-works', title: 'How It Works', type: 'how' },
    { id: 'roi', title: 'Expected Return on Investment', type: 'roi' },
    { id: 'benefits', title: 'What You Will Get', type: 'benefits' },
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

      pdf.save('databricks-pitch-deck.pdf');
      setCurrentSlide(0);
      setIsPrinting(false);
    }, 100);
  };

  const renderSlideContent = () => {
    const slide = slides[currentSlide];

    // Title Slide
    if (slide.id === 'title') {
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
            <div style={{ fontSize: '8rem' }}>🚀</div>
            <h1 style={{
              fontSize: '4.5rem',
              fontWeight: 800,
              color: 'white',
              margin: 0,
              lineHeight: 1.2
            }}>
              Transform Your Data & AI Journey
            </h1>
            <p style={{
              fontSize: '2rem',
              color: 'rgba(255, 255, 255, 0.95)',
              maxWidth: '1000px',
              lineHeight: 1.6,
              margin: 0
            }}>
              A comprehensive, executive-grade assessment that maps your current state, identifies gaps, and provides a clear roadmap to data & AI excellence with Databricks.
            </p>
          </div>
        </SlideContent>
      );
    }

    // Stats Slide
    if (slide.id === 'stats') {
      return (
        <SlideContent data-slide-content="true">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '40px',
            height: '100%',
            alignItems: 'center'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '30px',
              padding: '80px',
              textAlign: 'center',
              border: '3px solid rgba(255, 255, 255, 0.3)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <div style={{ fontSize: '6rem', fontWeight: 800, color: 'white', marginBottom: '20px' }}>30%</div>
              <div style={{ fontSize: '1.8rem', color: 'rgba(255, 255, 255, 0.95)', fontWeight: 500 }}>Average Cost Reduction</div>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '30px',
              padding: '80px',
              textAlign: 'center',
              border: '3px solid rgba(255, 255, 255, 0.3)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <div style={{ fontSize: '6rem', fontWeight: 800, color: 'white', marginBottom: '20px' }}>5x</div>
              <div style={{ fontSize: '1.8rem', color: 'rgba(255, 255, 255, 0.95)', fontWeight: 500 }}>Faster Time to Insights</div>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '30px',
              padding: '80px',
              textAlign: 'center',
              border: '3px solid rgba(255, 255, 255, 0.3)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <div style={{ fontSize: '6rem', fontWeight: 800, color: 'white', marginBottom: '20px' }}>60%</div>
              <div style={{ fontSize: '1.8rem', color: 'rgba(255, 255, 255, 0.95)', fontWeight: 500 }}>Improved Team Productivity</div>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '30px',
              padding: '80px',
              textAlign: 'center',
              border: '3px solid rgba(255, 255, 255, 0.3)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <div style={{ fontSize: '6rem', fontWeight: 800, color: 'white', marginBottom: '20px' }}>90%</div>
              <div style={{ fontSize: '1.8rem', color: 'rgba(255, 255, 255, 0.95)', fontWeight: 500 }}>Client Satisfaction Rate</div>
            </div>
          </div>
        </SlideContent>
      );
    }

    // Why Cards
    if (slide.type === 'why-card') {
      const whyData = [
        {
          icon: <FiTarget />,
          color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          title: 'Strategic Clarity',
          description: 'Get a clear, unbiased view of where you stand across 6 critical pillars of data & AI maturity.',
          items: [
            'Platform & Governance',
            'Data Engineering & Integration',
            'Analytics & BI Modernization',
            'Machine Learning & MLOps',
            'Generative AI & Agentic Capabilities',
            'Operational Excellence & Adoption'
          ]
        },
        {
          icon: <FiTrendingUp />,
          color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          title: 'Actionable Roadmap',
          description: 'Don\'t just identify gaps—get specific, prioritized recommendations to close them.',
          items: [
            'Tailored to your current state',
            'Prioritized by business impact',
            'Aligned with industry best practices',
            'Ready-to-execute next steps',
            'Resource and timeline estimates'
          ]
        },
        {
          icon: <FiAward />,
          color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          title: 'Executive-Ready Insights',
          description: 'Present compelling, data-backed insights to your leadership and board.',
          items: [
            'Beautiful, interactive dashboards',
            'Industry benchmarking comparisons',
            'ROI projections and business cases',
            'Executive command center view',
            'Exportable reports and presentations'
          ]
        }
      ];

      const data = whyData[slide.index];

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
              background: data.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '30px',
              boxShadow: '0 15px 40px rgba(102, 126, 234, 0.4)'
            }}>
              {React.cloneElement(data.icon, { style: { width: '45px', height: '45px', color: 'white' } })}
            </div>
            <h2 style={{
              fontSize: '3rem',
              fontWeight: 700,
              color: '#1e293b',
              marginBottom: '25px',
              lineHeight: 1.2
            }}>
              {data.title}
            </h2>
            <p style={{
              fontSize: '1.5rem',
              color: '#64748b',
              lineHeight: 1.7,
              marginBottom: '35px'
            }}>
              {data.description}
            </p>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              flex: 1
            }}>
              {data.items.map((item, idx) => (
                <li key={idx} style={{
                  fontSize: '1.3rem',
                  color: '#475569',
                  padding: '15px 0',
                  paddingLeft: '40px',
                  position: 'relative',
                  lineHeight: 1.5
                }}>
                  <span style={{
                    position: 'absolute',
                    left: 0,
                    color: '#10b981',
                    fontWeight: 700,
                    fontSize: '1.6rem'
                  }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </SlideContent>
      );
    }

    // How It Works
    if (slide.id === 'how-it-works') {
      const steps = [
        {
          number: '1',
          title: 'Assessment (30-45 min)',
          description: 'Answer guided questions across 6 pillars. Rate your current and desired future state on 5 dimensions per pillar. Capture pain points and context along the way.'
        },
        {
          number: '2',
          title: 'Instant Analysis',
          description: 'Our intelligent engine analyzes your responses, calculates maturity scores, identifies gaps, and generates personalized recommendations based on proven frameworks.'
        },
        {
          number: '3',
          title: 'Comprehensive Reports',
          description: 'Access multiple views: Deep Dive Analysis, Executive Command Center, Industry Benchmarks, and Strategic Insights Dashboard—all designed for different stakeholders.'
        },
        {
          number: '4',
          title: 'Action & Track',
          description: 'Export your roadmap, share with stakeholders, and track progress over time. Re-assess quarterly to measure improvement and adjust your strategy.'
        }
      ];

      return (
        <SlideContent data-slide-content="true">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '30px',
            height: '100%'
          }}>
            {steps.map((step, idx) => (
              <div key={idx} style={{
                background: 'rgba(255, 255, 255, 0.98)',
                borderRadius: '25px',
                padding: '45px',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)'
              }}>
                <div style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.5rem',
                  fontWeight: 800,
                  marginBottom: '25px',
                  boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)'
                }}>
                  {step.number}
                </div>
                <h3 style={{
                  fontSize: '2rem',
                  fontWeight: 700,
                  color: '#1e293b',
                  marginBottom: '20px',
                  lineHeight: 1.3
                }}>
                  {step.title}
                </h3>
                <p style={{
                  fontSize: '1.3rem',
                  color: '#64748b',
                  lineHeight: 1.7,
                  flex: 1
                }}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </SlideContent>
      );
    }

    // ROI Slide
    if (slide.id === 'roi') {
      const roiData = [
        { icon: <FiDollarSign />, value: '$2.5M+', label: 'Average Annual Savings', color: '#10b981' },
        { icon: <FiClock />, value: '40%', label: 'Faster Project Delivery', color: '#f59e0b' },
        { icon: <FiShield />, value: '70%', label: 'Reduction in Data Risks', color: '#3b82f6' },
        { icon: <FiActivity />, value: '3x', label: 'Increase in Data Utilization', color: '#ec4899' }
      ];

      return (
        <SlideContent data-slide-content="true">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '40px',
            height: '100%',
            alignItems: 'center'
          }}>
            {roiData.map((item, idx) => (
              <div key={idx} style={{
                background: 'rgba(255, 255, 255, 0.98)',
                borderRadius: '30px',
                padding: '60px',
                textAlign: 'center',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <div style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  background: item.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '30px'
                }}>
                  {React.cloneElement(item.icon, { style: { width: '45px', height: '45px', color: 'white' } })}
                </div>
                <div style={{
                  fontSize: '4rem',
                  fontWeight: 800,
                  color: '#1e293b',
                  marginBottom: '15px'
                }}>
                  {item.value}
                </div>
                <div style={{
                  fontSize: '1.5rem',
                  color: '#64748b',
                  fontWeight: 500
                }}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </SlideContent>
      );
    }

    // Benefits Slide
    if (slide.id === 'benefits') {
      const benefits = [
        { icon: <FiBarChart2 />, title: 'Maturity Scoring', color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
        { icon: <FiZap />, title: 'Quick Wins Identification', color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
        { icon: <FiUsers />, title: 'Stakeholder Alignment', color: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)' },
        { icon: <FiCheckCircle />, title: 'Best Practices Library', color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' },
        { icon: <FiTarget />, title: 'Gap Analysis', color: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)' },
        { icon: <FiTrendingUp />, title: 'Progress Tracking', color: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' }
      ];

      return (
        <SlideContent data-slide-content="true">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '30px',
            height: '100%',
            alignItems: 'stretch'
          }}>
            {benefits.map((benefit, idx) => (
              <div key={idx} style={{
                background: 'rgba(255, 255, 255, 0.98)',
                borderRadius: '25px',
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
                  background: benefit.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '25px',
                  boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
                }}>
                  {React.cloneElement(benefit.icon, { style: { width: '40px', height: '40px', color: 'white' } })}
                </div>
                <h3 style={{
                  fontSize: '1.6rem',
                  fontWeight: 700,
                  color: '#1e293b',
                  lineHeight: 1.3
                }}>
                  {benefit.title}
                </h3>
              </div>
            ))}
          </div>
        </SlideContent>
      );
    }

    // Thank You Slide
    if (slide.id === 'thank-you') {
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
              lineHeight: 1.6,
              margin: 0
            }}>
              Ready to transform your data & AI capabilities?
            </p>
            <p style={{
              fontSize: '1.5rem',
              color: 'rgba(255, 255, 255, 0.9)',
              margin: 0
            }}>
              Contact us at: <strong>nitin.aggarwal@databricks.com</strong>
            </p>
          </div>
        </SlideContent>
      );
    }

    return null;
  };

  const handleGetStarted = () => {
    window.location.href = '/';
  };

  if (showSlideshow) {
    return (
      <SlideshowOverlay>
        <SlideshowHeader>
          <SlideshowTitle>Databricks Data & AI Transformation</SlideshowTitle>
          <SlideshowControls>
            <ControlButton onClick={() => setShowSlideshow(false)}>
              <FiX />
            </ControlButton>
          </SlideshowControls>
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

      {/* Hero Section */}
      <HeroSection>
        <HeroTitle>
          Transform Your Data & AI Journey
        </HeroTitle>
        <HeroSubtitle>
          A comprehensive, executive-grade assessment that maps your current state, identifies gaps, and provides a clear roadmap to data & AI excellence with Databricks.
        </HeroSubtitle>
      </HeroSection>

      {/* Stats Section */}
      <ContentSection>
        <StatsGrid>
          <StatCard>
            <StatNumber>30%</StatNumber>
            <StatLabel>Average Cost Reduction</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>5x</StatNumber>
            <StatLabel>Faster Time to Insights</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>60%</StatNumber>
            <StatLabel>Improved Team Productivity</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>90%</StatNumber>
            <StatLabel>Client Satisfaction Rate</StatLabel>
          </StatCard>
        </StatsGrid>
      </ContentSection>

      {/* Why This Matters Section */}
      <ContentSection>
        <SectionTitle>Why This Assessment Matters</SectionTitle>
        <SectionSubtitle>
          In today's data-driven world, understanding your maturity is the first step to competitive advantage.
        </SectionSubtitle>
        <Grid>
          <Card>
            <IconWrapper color="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
              <FiTarget />
            </IconWrapper>
            <CardTitle>Strategic Clarity</CardTitle>
            <CardDescription>
              Get a clear, unbiased view of where you stand across 6 critical pillars of data & AI maturity.
            </CardDescription>
            <CardList>
              <CardListItem>Platform & Governance</CardListItem>
              <CardListItem>Data Engineering & Integration</CardListItem>
              <CardListItem>Analytics & BI Modernization</CardListItem>
              <CardListItem>Machine Learning & MLOps</CardListItem>
              <CardListItem>Generative AI & Agentic Capabilities</CardListItem>
              <CardListItem>Operational Excellence & Adoption</CardListItem>
            </CardList>
          </Card>

          <Card>
            <IconWrapper color="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)">
              <FiTrendingUp />
            </IconWrapper>
            <CardTitle>Actionable Roadmap</CardTitle>
            <CardDescription>
              Don't just identify gaps—get specific, prioritized recommendations to close them.
            </CardDescription>
            <CardList>
              <CardListItem>Tailored to your current state</CardListItem>
              <CardListItem>Prioritized by business impact</CardListItem>
              <CardListItem>Aligned with industry best practices</CardListItem>
              <CardListItem>Ready-to-execute next steps</CardListItem>
              <CardListItem>Resource and timeline estimates</CardListItem>
            </CardList>
          </Card>

          <Card>
            <IconWrapper color="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)">
              <FiAward />
            </IconWrapper>
            <CardTitle>Executive-Ready Insights</CardTitle>
            <CardDescription>
              Present compelling, data-backed insights to your leadership and board.
            </CardDescription>
            <CardList>
              <CardListItem>Beautiful, interactive dashboards</CardListItem>
              <CardListItem>Industry benchmarking comparisons</CardListItem>
              <CardListItem>ROI projections and business cases</CardListItem>
              <CardListItem>Executive command center view</CardListItem>
              <CardListItem>Exportable reports and presentations</CardListItem>
            </CardList>
          </Card>
        </Grid>
      </ContentSection>
    </PageContainer>
  );
};

export default PitchDeck;
