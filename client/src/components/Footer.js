import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FiShield } from 'react-icons/fi';

const FooterContainer = styled.footer`
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  color: #475569;
  padding: 64px 24px 32px;

  @media (max-width: 768px) {
    padding: 48px 20px 24px;
  }

  @media print {
    display: none !important;
  }
`;

const FooterContent = styled.div`
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 48px;
  margin-bottom: 48px;
  padding: 0 clamp(16px, 2vw, 32px);
  box-sizing: border-box;

  @media (max-width: 1024px) {
    padding: 0 24px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 32px;
    padding: 0 20px;
  }
`;

const FooterBrand = styled.div`
  h3 {
    font-size: 1.25rem;
    color: #0f172a;
    font-weight: 700;
    margin-bottom: 12px;
  }

  p {
    font-size: 0.938rem;
    line-height: 1.6;
    margin-bottom: 20px;
    color: #475569;
  }

  .security {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.875rem;
    color: #059669;
    font-weight: 600;

    svg {
      color: #059669;
    }
  }
`;

const FooterLinks = styled.div`
  h4 {
    font-size: 0.875rem;
    color: #0f172a;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 16px;
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  li {
    margin-bottom: 12px;

    a, button {
      color: #475569;
      text-decoration: none;
      font-size: 0.938rem;
      transition: color 0.2s;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
      font-family: inherit;

      &:hover {
        color: #2563eb;
      }
    }
  }
`;

const FooterCTA = styled.div`
  h4 {
    font-size: 0.875rem;
    color: #0f172a;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 16px;
  }

  p {
    font-size: 0.875rem;
    margin-bottom: 16px;
    line-height: 1.5;
    color: #475569;
  }

  button {
    width: 100%;
    padding: 12px 20px;
    background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      opacity: 0.92;
    }
  }
`;

const FooterBottom = styled.div`
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  padding: 32px clamp(16px, 2vw, 32px) 0;
  box-sizing: border-box;
  border-top: 1px solid #e2e8f0;
  text-align: center;
  font-size: 0.875rem;
  color: #64748b;

  @media (max-width: 768px) {
    padding: 24px 20px 0;
  }
`;

const Footer = () => {
  const navigate = useNavigate();

  const handleSectionLink = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      navigate('/', { state: { scrollTo: sectionId } });
    }
  };

  return (
    <FooterContainer>
      <FooterContent>
        <FooterBrand>
          <h3>ScoreX — Enterprise AI, FinOps &amp; Regulatory Readiness</h3>
          <p>
            A unified 3-engine platform for Dynamic Architecture Blueprints, Gemini Enterprise Value Realization (82Q), and EU AI Act (Regulation 2024/1689) Statutory Compliance.
          </p>
          <div className="security">
            <FiShield />
            <span>Enterprise-grade security, auditability &amp; zero-hallucination grounding</span>
          </div>
        </FooterBrand>

        <FooterLinks>
          <h4>Platform &amp; Engines</h4>
          <ul>
            <li><button onClick={() => handleSectionLink('pillars')}>6 Maturity Pillars</button></li>
            <li><button onClick={() => navigate('/assessments/hub')}>Dynamic Blueprints Hub</button></li>
            <li><button onClick={() => navigate('/ge-value-realization')}>GE Value Realization (82Q)</button></li>
            <li><button onClick={() => navigate('/eu-ai-compliance')}>EU AI Act Dossier (20Q)</button></li>
            <li><button onClick={() => navigate('/assessments')}>My Assessments Portfolio</button></li>
          </ul>
        </FooterLinks>

        <FooterCTA>
          <h4>Get Started</h4>
          <p>Launch a 15-minute guided assessment or explore executive readouts.</p>
          <button onClick={() => navigate('/assessments/run/enterprise_data_ai_maturity')}>Start Assessment</button>
        </FooterCTA>
      </FooterContent>

      <FooterBottom>
        <p>&copy; {new Date().getFullYear()} ScoreX — Enterprise AI, FinOps &amp; Regulatory Readiness Platform. All rights reserved.</p>
      </FooterBottom>
    </FooterContainer>
  );
};

export default Footer;

