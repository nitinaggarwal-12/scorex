import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiX, 
  FiChevronLeft, 
  FiChevronRight, 
  FiMaximize2, 
  FiAward, 
  FiTrendingUp, 
  FiDollarSign, 
  FiLayers,
  FiCheckCircle
} from 'react-icons/fi';
import DynamicRadarChart from './DynamicRadarChart';
import ExecutiveHeatmapMatrix from './ExecutiveHeatmapMatrix';
import FinancialImpactCard from './FinancialImpactCard';

const FullscreenOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #090d16;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  color: #f8fafc;
  overflow: hidden;
`;

const TopDeckBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 32px;
  background: rgba(15, 23, 42, 0.8);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
`;

const SlideContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 40px 60px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 20px 16px;
  }
`;

const SlideFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 32px;
  background: rgba(15, 23, 42, 0.8);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const NavBtn = styled.button`
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #ffffff;
  border-radius: 10px;
  padding: 8px 16px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: rgba(99, 102, 241, 0.3);
    border-color: #818cf8;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const CoverSlide = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  gap: 20px;
`;

const PresentationModeModal = ({ isOpen, onClose, instance, report, framework }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const totalSlides = 5;

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        setCurrentSlide(prev => Math.min(totalSlides - 1, prev + 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        setCurrentSlide(prev => Math.max(0, prev - 1));
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const scores = report?.calculatedScores || {
    overallScore: instance?.totalScore || 3.0,
    maturityLevel: instance?.maturityLevel || 'Defined',
    dimensionScores: instance?.scores || {}
  };

  return (
    <AnimatePresence>
      <FullscreenOverlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <TopDeckBar>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.75rem', background: '#6366f1', color: '#fff', padding: '3px 8px', borderRadius: '6px', fontWeight: 700 }}>
              SLIDE DECK
            </span>
            <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#cbd5e1' }}>
              {instance?.customerName} • {framework?.title}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>
              Slide {currentSlide + 1} of {totalSlides}
            </span>
            <button
              onClick={onClose}
              style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}
            >
              <FiX /> Exit Presentation
            </button>
          </div>
        </TopDeckBar>

        <SlideContainer>
          <AnimatePresence mode="wait">
            {currentSlide === 0 && (
              <motion.div
                key="slide-0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <CoverSlide>
                  <div style={{ width: '72px', height: '72px', borderRadius: '20px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
                    <FiAward color="#fff" />
                  </div>
                  <h1 style={{ fontSize: '3rem', fontWeight: 900, margin: 0, background: 'linear-gradient(135deg, #ffffff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    {framework?.title}
                  </h1>
                  <h3 style={{ fontSize: '1.4rem', color: '#818cf8', fontWeight: 600, margin: 0 }}>
                    Executive Transformation Readout for {instance?.customerName}
                  </h3>
                  <div style={{ background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '20px', padding: '24px 48px', display: 'flex', gap: '32px', alignItems: 'center', marginTop: '20px' }}>
                    <div>
                      <div style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Overall Maturity Index</div>
                      <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#34d399' }}>{scores.overallScore} / 5.0</div>
                    </div>
                    <div style={{ width: '1px', height: '50px', background: 'rgba(255,255,255,0.1)' }} />
                    <div>
                      <div style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Maturity Stage</div>
                      <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff' }}>{scores.maturityLevel}</div>
                    </div>
                  </div>
                </CoverSlide>
              </motion.div>
            )}

            {currentSlide === 1 && (
              <motion.div
                key="slide-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '20px', color: '#ffffff' }}>
                  1. Capability vs. Operational Risk Exposure
                </h2>
                <ExecutiveHeatmapMatrix
                  dimensions={framework?.dimensions || []}
                  dimensionScores={scores.dimensionScores || {}}
                  responses={instance?.responses || {}}
                />
              </motion.div>
            )}

            {currentSlide === 2 && (
              <motion.div
                key="slide-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '20px', color: '#ffffff' }}>
                  2. Polar Spider Radar & Baseline Analysis
                </h2>
                <DynamicRadarChart
                  dimensions={framework?.dimensions || []}
                  dimensionScores={scores.dimensionScores || {}}
                  responses={instance?.responses || {}}
                />
              </motion.div>
            )}

            {currentSlide === 3 && (
              <motion.div
                key="slide-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '20px', color: '#ffffff' }}>
                  3. Quantified Financial & TCO ROI Impact
                </h2>
                <FinancialImpactCard
                  pillarScores={scores.dimensionScores || {}}
                  framework={framework}
                  overallCurrent={scores.overallScore || 2.5}
                  overallTarget={4.0}
                />
              </motion.div>
            )}

            {currentSlide === 4 && (
              <motion.div
                key="slide-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '20px', color: '#ffffff' }}>
                  4. Strategic Roadmap & Priority Backlog
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {(report?.prioritizedRecommendations || report?.prioritizedActions || []).slice(0, 4).map((rec, rIdx) => (
                    <div
                      key={rIdx}
                      style={{
                        background: 'rgba(30, 41, 59, 0.6)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '14px',
                        padding: '18px 24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '16px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                          {rIdx + 1}
                        </div>
                        <div>
                          <h4 style={{ margin: '0 0 4px 0', fontSize: '1.05rem', color: '#ffffff' }}>{rec.title || rec.recommendation}</h4>
                          <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>{rec.impact || rec.description}</p>
                        </div>
                      </div>

                      <span style={{ fontSize: '0.8rem', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '4px 10px', borderRadius: '6px', fontWeight: 700 }}>
                        {rec.timeframe || 'Phase 1'}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </SlideContainer>

        <SlideFooter>
          <NavBtn
            onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
            disabled={currentSlide === 0}
          >
            <FiChevronLeft /> Previous Slide
          </NavBtn>

          <div style={{ display: 'flex', gap: '8px' }}>
            {Array.from({ length: totalSlides }).map((_, idx) => (
              <div
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                style={{
                  width: idx === currentSlide ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  background: idx === currentSlide ? '#818cf8' : 'rgba(255,255,255,0.2)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              />
            ))}
          </div>

          <NavBtn
            onClick={() => setCurrentSlide(prev => Math.min(totalSlides - 1, prev + 1))}
            disabled={currentSlide === totalSlides - 1}
          >
            Next Slide <FiChevronRight />
          </NavBtn>
        </SlideFooter>
      </FullscreenOverlay>
    </AnimatePresence>
  );
};

export default PresentationModeModal;
