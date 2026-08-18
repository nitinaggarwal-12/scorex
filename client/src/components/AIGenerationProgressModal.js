import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { motion } from "framer-motion";
import { FiCpu, FiLayers, FiDollarSign, FiAward, FiCheckCircle } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi";

const pulse = keyframes`
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(16px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

const ModalCard = styled(motion.div)`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 28px;
  max-width: 580px;
  width: 100%;
  padding: 40px 36px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.15);
  text-align: center;
  position: relative;
  overflow: hidden;
`;

const GlowingBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #eef2ff;
  border: 1px solid #c7d2fe;
  color: #4338ca;
  font-size: 0.85rem;
  font-weight: 700;
  padding: 6px 16px;
  border-radius: 9999px;
  margin-bottom: 20px;
  animation: ${pulse} 3s ease-in-out infinite;
`;

const Title = styled.h2`
  font-size: 1.75rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
`;

const Subtitle = styled.p`
  font-size: 0.95rem;
  color: #475569;
  margin: 0 0 28px 0;
  line-height: 1.5;
`;

const ProgressBarWrapper = styled.div`
  width: 100%;
  height: 8px;
  background: #f1f5f9;
  border-radius: 999px;
  overflow: hidden;
  margin-bottom: 28px;
`;

const ProgressBarFill = styled.div`
  height: 100%;
  width: ${props => props.$progress}%;
  background: linear-gradient(90deg, #4f46e5 0%, #7c3aed 50%, #38bdf8 100%);
  background-size: 200% 100%;
  animation: ${shimmer} 2s linear infinite;
  border-radius: 999px;
  transition: width 0.4s ease;
`;

const StagesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  text-align: left;
  margin-bottom: 24px;
`;

const StageItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-radius: 14px;
  background: ${props => props.$active ? "#f8fafc" : props.$completed ? "#f0fdf4" : "#ffffff"};
  border: 1px solid ${props => props.$active ? "#6366f1" : props.$completed ? "#86efac" : "#e2e8f0"};
  transition: all 0.3s ease;

  .left {
    display: flex;
    align-items: center;
    gap: 12px;

    .icon {
      font-size: 1.15rem;
      color: ${props => props.$completed ? "#16a34a" : props.$active ? "#4f46e5" : "#94a3b8"};
    }

    .label {
      font-size: 0.92rem;
      font-weight: ${props => props.$active || props.$completed ? "700" : "500"};
      color: ${props => props.$completed ? "#166534" : props.$active ? "#0f172a" : "#64748b"};
    }
  }

  .status {
    font-size: 0.8rem;
    font-weight: 700;
    color: ${props => props.$completed ? "#16a34a" : props.$active ? "#4f46e5" : "#94a3b8"};
  }
`;

const FooterNote = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 0.82rem;
  color: #64748b;
  font-weight: 600;
`;

const STAGES = [
  { id: 1, label: "Analyzing Architecture Gaps & Baseline Ratings", icon: FiCpu },
  { id: 2, label: "Synthesizing Google Cloud & Gemini Target Blueprints", icon: FiLayers },
  { id: 3, label: "Modeling 3-Year TCO, NPV & Dollar-at-Risk Mitigation", icon: FiDollarSign },
  { id: 4, label: "Assembling Executive Dossier & Strategic Roadmap", icon: FiAward }
];

const AIGenerationProgressModal = ({ customerName = "Enterprise Organization" }) => {
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [progress, setProgress] = useState(18);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setCurrentStageIdx(1);
      setProgress(45);
    }, 2400);

    const timer2 = setTimeout(() => {
      setCurrentStageIdx(2);
      setProgress(72);
    }, 5800);

    const timer3 = setTimeout(() => {
      setCurrentStageIdx(3);
      setProgress(92);
    }, 8800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <Overlay>
      <ModalCard
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <GlowingBadge>
          <HiSparkles /> Powered by Google Gemini 3.7 Flash
        </GlowingBadge>

        <Title>Synthesizing Executive AI Report</Title>
        <Subtitle>
          Generating audit-grade architectural findings, TCO calculations, and roadmap for <strong>{customerName}</strong>.
        </Subtitle>

        <ProgressBarWrapper>
          <ProgressBarFill $progress={progress} />
        </ProgressBarWrapper>

        <StagesContainer>
          {STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            const isCompleted = idx < currentStageIdx;
            const isActive = idx === currentStageIdx;
            return (
              <StageItem key={stage.id} $active={isActive} $completed={isCompleted}>
                <div className="left">
                  {isCompleted ? <FiCheckCircle className="icon" /> : <Icon className="icon" />}
                  <span className="label">{stage.label}</span>
                </div>
                <div className="status">
                  {isCompleted ? "Done" : isActive ? "Synthesizing..." : "Queued"}
                </div>
              </StageItem>
            );
          })}
        </StagesContainer>

        <FooterNote>
          🔒 All prompts & models isolated with zero public retention.
        </FooterNote>
      </ModalCard>
    </Overlay>
  );
};

export default AIGenerationProgressModal;
