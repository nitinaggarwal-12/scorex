import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  FiShield, 
  FiLock, 
  FiFileText, 
  FiCheckCircle, 
  FiAlertTriangle, 
  FiInfo, 
  FiAward, 
  FiArrowRight 
} from 'react-icons/fi';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(11, 25, 56, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
`;

const ModalContainer = styled.div`
  background: #ffffff;
  border-radius: 20px;
  max-width: 840px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const ModalHeader = styled.div`
  background: linear-gradient(135deg, #0b1938 0%, #1e3a8a 100%);
  color: #ffffff;
  padding: 28px 36px;
  display: flex;
  align-items: center;
  gap: 16px;
`;

const IconBadge = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #60a5fa;
`;

const HeaderText = styled.div`
  h2 {
    font-size: 1.5rem;
    font-weight: 800;
    margin: 0 0 4px 0;
    color: #ffffff;
  }
  p {
    font-size: 0.9rem;
    margin: 0;
    opacity: 0.85;
    color: #cbd5e1;
  }
`;

const TabsRow = styled.div`
  display: flex;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  padding: 0 36px;
`;

const TabButton = styled.button`
  padding: 14px 20px;
  background: transparent;
  border: none;
  border-bottom: 3px solid ${props => props.$active ? '#2563eb' : 'transparent'};
  color: ${props => props.$active ? '#1e293b' : '#64748b'};
  font-weight: ${props => props.$active ? '700' : '600'};
  font-size: 0.92rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;

  &:hover {
    color: #1e293b;
  }
`;

const ContentBody = styled.div`
  padding: 28px 36px;
  overflow-y: auto;
  flex: 1;
  color: #334155;
  font-size: 0.93rem;
  line-height: 1.65;

  h3 {
    font-size: 1.15rem;
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 12px 0;
  }

  p {
    margin-bottom: 14px;
  }

  ul {
    margin: 0 0 16px 20px;
    padding: 0;
  }

  li {
    margin-bottom: 8px;
  }
`;

const AlertBox = styled.div`
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 10px;
  padding: 14px 18px;
  margin: 16px 0;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  color: #166534;
  font-size: 0.88rem;
`;

const ModalFooter = styled.div`
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  padding: 20px 36px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #1e293b;
  cursor: pointer;
  user-select: none;

  input {
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: #2563eb;
  }
`;

const AcceptButton = styled.button`
  background: ${props => props.disabled ? '#94a3b8' : 'linear-gradient(135deg, #ff5722 0%, #f97316 100%)'};
  color: #ffffff;
  border: none;
  padding: 12px 28px;
  border-radius: 10px;
  font-weight: 800;
  font-size: 0.95rem;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: ${props => props.disabled ? 'none' : '0 4px 16px rgba(249, 115, 22, 0.35)'};
  transition: all 0.2s;

  &:hover {
    transform: ${props => props.disabled ? 'none' : 'translateY(-2px)'};
  }
`;

export default function DisclaimerPolicyModal({ isOpen, onAccept }) {
  const [activeTab, setActiveTab] = useState('disclaimer');
  const [isChecked, setIsChecked] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (isChecked) {
      localStorage.setItem('scorex_disclaimer_accepted', 'true');
      if (onAccept) onAccept();
    }
  };

  return (
    <ModalOverlay>
      <ModalContainer>
        {/* Header */}
        <ModalHeader>
          <IconBadge>
            <FiShield />
          </IconBadge>
          <HeaderText>
            <h2>Terms of Use, Privacy Policy & Advisory Disclaimer</h2>
            <p>ScoreX Enterprise Data & AI Maturity Assessment Platform</p>
          </HeaderText>
        </ModalHeader>

        {/* Tab Selection */}
        <TabsRow>
          <TabButton 
            $active={activeTab === 'disclaimer'} 
            onClick={() => setActiveTab('disclaimer')}
          >
            <FiAlertTriangle />
            <span>Advisory Disclaimer</span>
          </TabButton>
          <TabButton 
            $active={activeTab === 'privacy'} 
            onClick={() => setActiveTab('privacy')}
          >
            <FiLock />
            <span>Privacy & Data Protection</span>
          </TabButton>
          <TabButton 
            $active={activeTab === 'copyright'} 
            onClick={() => setActiveTab('copyright')}
          >
            <FiFileText />
            <span>Copyright & Intellectual Property</span>
          </TabButton>
        </TabsRow>

        {/* Content Area */}
        <ContentBody>
          {activeTab === 'disclaimer' && (
            <div>
              <h3>1. Advisory & Strategic Scoping Scope</h3>
              <p>
                The ScoreX Enterprise Data & AI Maturity Assessment Suite provides consultative benchmarking, architectural scoring, and strategic recommendations based on self-reported operational practices and AI-assisted synthesis.
              </p>
              <ul>
                <li><strong>Directional Insights:</strong> All scores, radar charts, and maturity levels are intended for diagnostic and planning purposes.</li>
                <li><strong>Vendor Neutrality:</strong> Recommendations reflect general cloud-scale data engineering, MLOps, and agentic AI best practices and do not constitute mandatory procurement endorsements.</li>
                <li><strong>Implementation Discretion:</strong> Final architectural decisions, security configurations, and compliance attestations remain the sole responsibility of the customer.</li>
              </ul>
              <AlertBox>
                <FiCheckCircle size={20} style={{ flexShrink: 0 }} />
                <span>
                  By proceeding, you acknowledge that assessment outputs represent strategic advisory models designed to guide enterprise roadmaps.
                </span>
              </AlertBox>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div>
              <h3>2. Privacy Policy & Zero Data Retention Guarantee</h3>
              <p>
                We adhere to strict enterprise privacy standards to protect your confidential information and architectural details:
              </p>
              <ul>
                <li><strong>No Customer Data Retention:</strong> Qualitative notes and architectural inputs are processed in-memory during assessment generation and are not used to train public foundation models.</li>
                <li><strong>Ephemeral Assessment Sessions:</strong> Public assessments and guest explorations are sandboxed within your local browser storage or private tenant instance.</li>
                <li><strong>Zero Third-Party Tracking:</strong> We do not sell, rent, or share customer metadata or architectural assessment answers with external data brokers.</li>
              </ul>
              <AlertBox>
                <FiLock size={20} style={{ flexShrink: 0 }} />
                <span>
                  Your responses remain confidential and isolated to your active assessment session.
                </span>
              </AlertBox>
            </div>
          )}

          {activeTab === 'copyright' && (
            <div>
              <h3>3. Copyright, Licensing & Intellectual Property</h3>
              <p>
                © 2026 ScoreX Enterprise Intelligence. All rights reserved.
              </p>
              <ul>
                <li><strong>Assessment Framework & Scoring Methodology:</strong> The 6-pillar, 30-dimension diagnostic taxonomy, maturity formulas, and AI reasoning templates are proprietary intellectual property.</li>
                <li><strong>Customer Work Product Ownership:</strong> Generated assessment reports, customized roadmaps, and exported PDF dossiers belong exclusively to the customer organization.</li>
                <li><strong>Permitted Use:</strong> Authorized for internal enterprise architecture planning, executive briefings, and workload modernizations.</li>
              </ul>
            </div>
          )}
        </ContentBody>

        {/* Footer */}
        <ModalFooter>
          <CheckboxLabel>
            <input 
              type="checkbox" 
              checked={isChecked} 
              onChange={(e) => setIsChecked(e.target.checked)} 
            />
            <span>I have read and accept the Disclaimer, Privacy Policy, and Terms of Use</span>
          </CheckboxLabel>

          <AcceptButton 
            disabled={!isChecked} 
            onClick={handleConfirm}
          >
            <span>Accept & Enter Portal</span>
            <FiArrowRight />
          </AcceptButton>
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
}
