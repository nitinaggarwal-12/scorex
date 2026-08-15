import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FiShield } from 'react-icons/fi';

const FooterContainer = styled.footer`
  background: #0f172a;
  color: rgba(255, 255, 255, 0.8);
  padding: 64px 24px 32px;

  @media (max-width: 768px) {
    padding: 48px 20px 24px;
  }

  @media print {
    display: none !important;
  }
`;

const FooterContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 48px;
  margin-bottom: 48px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 32px;
  }
`;

const FooterBrand = styled.div`
  h3 {
    font-size: 1.25rem;
    color: white;
    font-weight: 700;
    margin-bottom: 12px;
  }

  p {
    font-size: 0.938rem;
    line-height: 1.6;
    margin-bottom: 20px;
  }

  .security {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.875rem;
    color: #86efac;

    svg {
      color: #86efac;
    }
  }
`;

const FooterLinks = styled.div`
  h4 {
    font-size: 0.875rem;
    color: white;
    font-weight: 600;
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
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      font-size: 0.938rem;
      transition: color 0.2s;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
      font-family: inherit;

      &:hover {
        color: white;
      }
    }
  }
`;

const FooterCTA = styled.div`
  h4 {
    font-size: 0.875rem;
    color: white;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 16px;
  }

  p {
    font-size: 0.875rem;
    margin-bottom: 16px;
    line-height: 1.5;
  }

  button {
    width: 100%;
    padding: 12px 20px;
    background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      opacity: 0.9;
    }
  }
`;

const FooterBottom = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding-top: 32px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.5);
`;

const Footer = () => {
  const navigate = useNavigate();

  return (
    <FooterContainer>
      <FooterContent>
        <FooterBrand>
          <h3>Data & AI Maturity Assessment</h3>
          <p>
            A comprehensive framework to evaluate, benchmark, and accelerate your Databricks journey. 
            Built by practitioners, for practitioners.
          </p>
          <div className="security">
            <FiShield />
            <span>Enterprise-grade security & privacy</span>
          </div>
        </FooterBrand>

        <FooterLinks>
          <h4>Resources</h4>
          <ul>
            <li><button onClick={() => navigate('/')}>Why Assessment</button></li>
            <li><button onClick={() => navigate('/')}>Assessment Pillars</button></li>
            <li><button onClick={() => navigate('/')}>How It Works</button></li>
            <li><button onClick={() => navigate('/assessments')}>Past Assessments</button></li>
          </ul>
        </FooterLinks>

        <FooterCTA>
          <h4>Get Started</h4>
          <p>Start your free assessment today and unlock insights.</p>
          <button onClick={() => navigate('/start')}>Start Assessment</button>
        </FooterCTA>
      </FooterContent>

      <FooterBottom>
        <p>&copy; 2025 Data & AI Technical Maturity Assessment Platform. All rights reserved.</p>
      </FooterBottom>
    </FooterContainer>
  );
};

export default Footer;

