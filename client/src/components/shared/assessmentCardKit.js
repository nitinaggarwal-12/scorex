/**
 * assessmentCardKit — the shared light-theme design kit behind the /assessments
 * card + tab template (AssessmentsListNew.js). Extracted verbatim so every
 * assessment surface (Assessments list, Assessment Catalog & Templates hub)
 * shares one visual language: white cards on #e2e8f0 borders, grey tab rail
 * with white active chips, blue→indigo primary gradient and explicit
 * Edit / Clone / Delete ActionButton triads.
 *
 * Palette is intentionally limited to the enterprise light set
 * (#ffffff / #f8fafc / #f1f5f9 / #eff6ff / #2563eb / #1d4ed8) — never add dark
 * container backgrounds here (UI Gate 6).
 */
import styled from 'styled-components';
import { motion } from 'framer-motion';

// =======================
// STYLED COMPONENTS
// =======================

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(180deg, #fafbfc 0%, #ffffff 100%);
  position: relative;
  padding-top: 68px;

  @media print {
    background: white !important;
    padding-top: 0;
  }
`;

const ContentContainer = styled.div`
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  padding: 28px clamp(16px, 1.8vw, 28px);
  box-sizing: border-box;
  position: relative;
  z-index: 1;

  @media (max-width: 1024px) {
    padding: 24px 20px;
  }

  @media (max-width: 768px) {
    padding: 20px 14px;
  }
`;

const HeaderSection = styled.div`
  margin-bottom: 40px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 16px;

  .left {
    flex: 1;
    min-width: 250px;

    h1 {
      font-size: 2.25rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 8px 0;
      letter-spacing: -0.02em;
    }

    p {
      font-size: 1rem;
      color: #475569;
      margin: 0;
    }
  }

  .right {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  @media (max-width: 768px) {
    .left h1 {
      font-size: 1.5rem;
    }

    .left p {
      font-size: 0.875rem;
    }

    .right {
      width: 100%;
      justify-content: stretch;

      button {
        flex: 1;
      }
    }
  }
`;

const Button = styled(motion.button)`
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid transparent;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  @media (max-width: 768px) {
    padding: 9px 16px;
    font-size: 0.813rem;
  }
`;

const PrimaryButton = styled(Button)`
  background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
  color: white;
  border: none;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.25);

  &:hover {
    background: linear-gradient(135deg, #1d4ed8 0%, #4338ca 100%);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35);
  }

  &:active {
    transform: translateY(0);
  }
`;

const SecondaryButton = styled(Button)`
  background: white;
  color: #64748b;
  border: 2px solid #cbd5e1;

  &:hover {
    background: #f8fafc;
    border-color: #94a3b8;
    color: #475569;
  }
`;

const FilterBar = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);

  .top-row {
    display: flex;
    gap: 12px;
    margin-bottom: 16px;
    flex-wrap: wrap;
  }

  .bottom-row {
    display: flex;
    gap: 12px;
    align-items: center;
    flex-wrap: wrap;
  }

  @media (max-width: 768px) {
    padding: 16px;

    .top-row, .bottom-row {
      gap: 8px;
    }
  }
`;

const SearchBox = styled.div`
  position: relative;
  flex: 1;
  min-width: 250px;

  input {
    width: 100%;
    padding: 10px 12px 10px 40px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 0.875rem;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

    &:focus {
      outline: none;
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
    }

    &::placeholder {
      color: #9ca3af;
    }
  }

  svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
  }

  @media (max-width: 768px) {
    min-width: 100%;

    input {
      padding: 9px 12px 9px 36px;
    }
  }
`;

const TabGroup = styled.div`
  display: flex;
  gap: 8px;
  background: #f3f4f6;
  padding: 4px;
  border-radius: 8px;
`;

const Tab = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: ${props => props.$active ? '600' : '500'};
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  background: ${props => props.$active ? 'white' : 'transparent'};
  color: ${props => props.$active ? '#1e293b' : '#64748b'};
  box-shadow: ${props => props.$active ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'};

  &:hover {
    color: ${props => props.$active ? '#1e293b' : '#2563eb'};
  }

  @media (max-width: 768px) {
    padding: 6px 12px;
    font-size: 0.813rem;
  }
`;

const Dropdown = styled.select`
  padding: 8px 32px 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #374151;
  background: white;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M3 4.5L6 7.5L9 4.5' stroke='%236b7280' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
  }

  @media (max-width: 768px) {
    padding: 7px 28px 7px 10px;
    font-size: 0.813rem;
  }
`;

const BulkActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);

  .left {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .right {
    font-size: 0.875rem;
    color: #6b7280;
  }

  label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.875rem;
    color: #374151;
    cursor: pointer;
  }

  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    cursor: pointer;
  }

  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 12px;

    .left {
      flex: 1;
      min-width: 100%;
    }

    .right {
      width: 100%;
      text-align: right;
    }
  }
`;

const AssessmentsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const AssessmentCard = styled(motion.div)`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);

  &:hover {
    border-color: #cbd5e1;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    transform: translateY(-4px);
  }

  @media print {
    box-shadow: none !important;
    border: 1px solid #e2e8f0 !important;
    transform: none !important;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;
  }

  .title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #111827;
    margin-bottom: 8px;
  }

  .meta {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 0.813rem;
    color: #6b7280;
    margin-bottom: 16px;
    flex-wrap: wrap;
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 6px;

    svg {
      width: 16px;
      height: 16px;
    }
  }

  .pillars {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 16px;
  }

  .progress-section {
    margin-bottom: 16px;
  }

  .progress-label {
    display: flex;
    justify-content: space-between;
    font-size: 0.813rem;
    color: #6b7280;
    margin-bottom: 6px;
  }

  .progress-bar {
    height: 6px;
    background: #f3f4f6;
    border-radius: 3px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #10b981 0%, #059669 100%);
    border-radius: 3px;
    transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-top: 16px;
    border-top: 1px solid #f3f4f6;
  }

  .actions {
    display: flex;
    gap: 8px;
  }

  @media (max-width: 768px) {
    padding: 16px;

    .title {
      font-size: 1rem;
    }

    .meta {
      font-size: 0.75rem;
    }
  }
`;

const StatusBadge = styled.span`
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
  
  ${props => {
    switch (props.$status) {
      case 'completed':
      case 'production':
        return `
          background: #10b981;
          color: white;
        `;
      case 'in_progress':
        return `
          background: #2563eb;
          color: white;
        `;
      case 'draft':
        return `
          background: #f59e0b;
          color: white;
        `;
      case 'not_started':
        return `
          background: #f3f4f6;
          color: #64748b;
        `;
      default:
        return `
          background: #f3f4f6;
          color: #64748b;
        `;
    }
  }}
`;

const PillarTag = styled.span`
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  background: #f8fafc;
  color: #475569;
  border: 1px solid #e2e8f0;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
`;

const ActionButton = styled.button`
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 0.813rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  background: white;
  color: #64748b;
  border: 1px solid #e2e8f0;

  &:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
    color: #475569;
  }

  &.primary {
    background: #1B3B6F;
    color: white;
    border-color: #1B3B6F;

    &:hover {
      background: #152d55;
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: #e2e8f0;
    color: #94a3b8;
    border-color: #e2e8f0;

    &:hover {
      background: #e2e8f0;
      color: #94a3b8;
      border-color: #e2e8f0;
    }

    &.primary {
      background: #cbd5e1;
      color: #94a3b8;
      border-color: #cbd5e1;

      &:hover {
        background: #cbd5e1;
      }
    }
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

const FloatingBatchBar = styled(motion.div)`
  position: fixed;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  background: #ffffff;
  color: #0f172a;
  border-radius: 16px;
  padding: 12px 24px;
  box-shadow: 0 12px 40px rgba(15, 23, 42, 0.16);
  display: flex;
  align-items: center;
  gap: 16px;
  z-index: 1000;
  border: 1px solid #cbd5e1;

  @media (max-width: 768px) {
    width: 92%;
    flex-wrap: wrap;
    padding: 10px 14px;
    gap: 8px;
    justify-content: center;
  }
`;

const BatchActionButton = styled.button`
  padding: 7px 14px;
  border-radius: 8px;
  font-size: 0.825rem;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: none;
  transition: all 0.2s ease;
  background: ${props => props.$danger ? '#ef4444' : props.$primary ? '#3b82f6' : 'rgba(255, 255, 255, 0.12)'};
  color: white;

  &:hover {
    transform: translateY(-1px);
    background: ${props => props.$danger ? '#dc2626' : props.$primary ? '#2563eb' : 'rgba(255, 255, 255, 0.2)'};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 20px;

  .icon {
    font-size: 4rem;
    margin-bottom: 16px;
    opacity: 0.3;
    color: #64748b;
  }

  .title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 8px;
  }

  .message {
    font-size: 1rem;
    color: #64748b;
    margin-bottom: 24px;
  }
`;

const LoadingContainer = styled.div`
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .spinner {
    text-align: center;
    
    .text {
      font-size: 1.125rem;
      color: #6b7280;
      margin-top: 16px;
    }
  }
`;

export {
  PageContainer,
  ContentContainer,
  HeaderSection,
  Button,
  PrimaryButton,
  SecondaryButton,
  FilterBar,
  SearchBox,
  TabGroup,
  Tab,
  Dropdown,
  BulkActionBar,
  AssessmentsGrid,
  AssessmentCard,
  StatusBadge,
  PillarTag,
  ActionButton,
  FloatingBatchBar,
  BatchActionButton,
  EmptyState,
  LoadingContainer
};
