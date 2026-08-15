import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEdit, FiTrash2, FiPlus, FiChevronDown, FiChevronUp, FiArrowUp, FiArrowDown, FiX, FiChevronLeft, FiChevronRight, FiPlay, FiPrinter } from 'react-icons/fi';
import toast from 'react-hot-toast';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Footer from './Footer';

// =======================
// UTILITY FUNCTIONS
// =======================

// Format text content: converts markdown-style bullets/numbers to HTML
const FormattedText = ({ children, style }) => {
  if (!children) return null;
  
  const lines = children.split('\n');
  const formatted = [];
  let currentList = null;
  let currentListType = null;
  
  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    
    // Check for bullet points
    if (trimmedLine.match(/^[•\-\*]\s+/)) {
      const content = trimmedLine.replace(/^[•\-\*]\s+/, '');
      if (currentListType !== 'ul') {
        if (currentList) formatted.push(currentList);
        currentList = { type: 'ul', items: [] };
        currentListType = 'ul';
      }
      currentList.items.push(content);
    }
    // Check for numbered lists
    else if (trimmedLine.match(/^\d+[\.)]\s+/)) {
      const content = trimmedLine.replace(/^\d+[\.)]\s+/, '');
      if (currentListType !== 'ol') {
        if (currentList) formatted.push(currentList);
        currentList = { type: 'ol', items: [] };
        currentListType = 'ol';
      }
      currentList.items.push(content);
    }
    // Regular text
    else {
      if (currentList) {
        formatted.push(currentList);
        currentList = null;
        currentListType = null;
      }
      if (trimmedLine) {
        formatted.push({ type: 'p', content: trimmedLine });
      }
    }
  });
  
  if (currentList) formatted.push(currentList);
  
  return (
    <div style={{ whiteSpace: 'pre-wrap', ...style }}>
      {formatted.map((item, idx) => {
        if (item.type === 'ul') {
          return (
            <ul key={idx} style={{ margin: '0.5em 0', paddingLeft: '1.5em', listStyleType: 'disc' }}>
              {item.items.map((li, liIdx) => (
                <li key={liIdx} style={{ marginBottom: '0.25em' }}>{li}</li>
              ))}
            </ul>
          );
        } else if (item.type === 'ol') {
          return (
            <ol key={idx} style={{ margin: '0.5em 0', paddingLeft: '1.5em' }}>
              {item.items.map((li, liIdx) => (
                <li key={liIdx} style={{ marginBottom: '0.25em' }}>{li}</li>
              ))}
            </ol>
          );
        } else {
          return <p key={idx} style={{ margin: '0.5em 0' }}>{item.content}</p>;
        }
      })}
    </div>
  );
};

// Format button helper
const insertFormatting = (textAreaRef, prefix, suffix = '') => {
  const textarea = textAreaRef.current;
  if (!textarea) return;
  
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const text = textarea.value;
  const selectedText = text.substring(start, end) || 'text';
  
  const newText = text.substring(0, start) + prefix + selectedText + suffix + text.substring(end);
  return { newText, cursorPos: start + prefix.length + selectedText.length + suffix.length };
};

// =======================
// STYLED COMPONENTS
// =======================

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(180deg, #fafbfc 0%, #ffffff 100%);
  padding-top: 100px;
  padding-bottom: 60px;

  @media print {
    background: white !important;
    padding-top: 0;
  }
`;

const ContentWrapper = styled.div`
  width: 100%;
  margin: 0;
  padding: 40px 40px;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    padding: 40px 16px;
  }

  @media print {
    display: none !important;
  }
`;

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 60px;
  position: relative;
  gap: 24px;
  
  @media (max-width: 1024px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
`;

// Slideshow/Presentation Mode Styles
const PresentationButton = styled(motion.button)`
  position: fixed;
  top: 100px;
  right: 32px;
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(139, 92, 246, 0.4);
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
  white-space: nowrap;
  z-index: 999;

  &:hover {
    background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(139, 92, 246, 0.6);
  }

  @media (max-width: 1024px) {
    top: 90px;
    right: 24px;
    padding: 12px 20px;
    font-size: 14px;
  }
  
  @media (max-width: 768px) {
    top: 80px;
    right: 16px;
    padding: 10px 16px;
    font-size: 13px;
  }
`;

const SlideshowOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(15, 23, 42, 0.98);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// Define these components first so SlideContainer can reference them
const SlideCounter = styled.div`
  position: absolute;
  bottom: 32px;
  right: 32px;
  color: white;
  font-size: 18px;
  font-weight: 600;
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  z-index: 10;
  opacity: 0;
  transition: opacity 0.3s ease;
  
  @media (max-width: 768px) {
    font-size: 16px;
    padding: 10px 16px;
    bottom: 24px;
    right: 24px;
  }
`;

const ExitButton = styled(motion.button)`
  position: absolute;
  top: 20px;
  right: 30px;
  background: rgba(239, 68, 68, 0.9);
  color: white;
  border: none;
  padding: 12px;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 300;
  line-height: 1;
  z-index: 10002;
  opacity: 0;
  transition: all 0.3s ease;
  pointer-events: auto;

  &:hover {
    opacity: 1;
    transform: scale(1.15);
    background: rgba(239, 68, 68, 1);
    box-shadow: 0 4px 16px rgba(239, 68, 68, 0.6);
  }
  
  @media (max-width: 768px) {
    top: 16px;
    right: 16px;
    width: 40px;
    height: 40px;
  }
`;

const PrintButton = styled(motion.button)`
  position: absolute;
  top: 20px;
  right: 90px;
  background: rgba(34, 197, 94, 0.9);
  color: white;
  border: none;
  padding: 12px;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  z-index: 10002;
  opacity: 0;
  transition: all 0.3s ease;
  pointer-events: auto;

  &:hover {
    opacity: 1;
    transform: scale(1.15);
    background: rgba(34, 197, 94, 1);
    box-shadow: 0 4px 16px rgba(34, 197, 94, 0.6);
  }

  @media (max-width: 768px) {
    top: 16px;
    right: 70px;
    width: 40px;
    height: 40px;
  }
`;

const ClickArea = styled.div`
  position: absolute;
  top: 0;
  width: 50%;
  height: 100%;
  cursor: ${props => props.$direction === 'left' ? 'w-resize' : 'e-resize'};
  z-index: 1;
  ${props => props.$direction === 'left' ? 'left: 0;' : 'right: 0;'}
`;

const NavigationButton = styled(motion.button)`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${props => props.$direction === 'left' ? 'left: 32px;' : 'right: 32px;'}
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  border: 2px solid rgba(59, 130, 246, 0.3);
  color: #3b82f6;
  font-size: 1.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 100;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  opacity: 0;
  transition: all 0.2s ease;
  
  &:hover {
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
    transform: translateY(-50%) scale(1.1);
  }
  
  &:active {
    transform: translateY(-50%) scale(0.95);
  }
  
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    
    &:hover {
      background: rgba(255, 255, 255, 0.95);
      color: #3b82f6;
      border-color: rgba(59, 130, 246, 0.3);
      transform: translateY(-50%) scale(1);
    }
  }
`;

const SlideContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #2563eb 100%);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto;

  &:hover ${NavigationButton} {
    opacity: 1;
  }

  &:hover ${SlideCounter} {
    opacity: 1;
  }

  &:hover ${ExitButton} {
    opacity: 1;
  }

  &:hover ${PrintButton} {
    opacity: 1;
  }
`;

const SlideContent = styled(motion.div)`
  position: absolute;
  top: 75px;
  left: 95px;
  right: 95px;
  bottom: 90px;
  background: transparent;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  box-sizing: border-box;
  
  @media (max-width: 768px) {
    top: 70px;
    left: 80px;
    right: 80px;
    bottom: 80px;
  }
  
  @media print {
    overflow: hidden !important;
    padding: 60px 40px !important;
    page-break-inside: avoid !important;
  }
`;

const SlideNavigation = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: rgba(15, 23, 42, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
  z-index: 10001;
  
  @media (max-width: 768px) {
    height: 60px;
    gap: 16px;
  }
`;

const NavButton = styled(motion.button)`
  background: ${props => props.disabled ? 'rgba(100, 116, 139, 0.5)' : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'};
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;

  &:hover {
    ${props => !props.disabled && `
      transform: scale(1.05);
      box-shadow: 0 4px 16px rgba(139, 92, 246, 0.4);
    `}
  }
  
  @media (max-width: 768px) {
    padding: 10px 16px;
    font-size: 14px;
  }
`;

const PrintSlide = styled.div`
  @media print {
    page-break-after: always;
    page-break-inside: avoid;
    width: 11in;
    height: 8.5in;
    max-height: 8.5in;
    min-height: 8.5in;
    position: relative;
    background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #2563eb 100%);
    background-attachment: local;
    display: block;
    padding: 40px !important;
    margin: 0 !important;
    overflow: hidden !important;
    box-sizing: border-box !important;
  }
  
  @media screen {
    display: none;
  }
`;

const SlideHeading = styled.div`
  position: absolute;
  top: 20px;
  left: 60px;
  font-size: 1.8rem;
  font-weight: 700;
  color: white;
  pointer-events: none;
  z-index: 10001;
`;

// Slideshow Content Styles
const SlideGrid = styled.div`
  display: grid;
  grid-template-columns: ${props => props.$columns || 'repeat(2, 1fr)'};
  gap: 24px;
  height: 100%;
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const SlideSection = styled.div`
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 16px;
  padding: 24px;
  overflow-y: auto;
  
  h3 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 3px solid #8b5cf6;
  }
`;

const CompactCard = styled.div`
  background: white;
  border-radius: 10px;
  padding: 12px;
  margin-bottom: 0;
  border-left: 3px solid ${props => props.$color || '#8b5cf6'};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  
  h4 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 8px;
  }
  
  p {
    font-size: 0.875rem;
    color: #64748b;
    line-height: 1.5;
  }
`;



const ExpandCollapseControls = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    justify-content: center;
    margin-top: 24px;
  }
`;

const ToggleAllButton = styled.button`
  background: ${props => props.$allCollapsed ? 
    'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 
    'linear-gradient(135deg, #64748b 0%, #475569 100%)'};
  color: white;
  border: none;
  border-radius: 8px;
  width: 44px;
  height: 44px;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
  }
`;

const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const PageSubtitle = styled.p`
  font-size: 1rem;
  color: #475569;
  margin: 0;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 1200px) {
    white-space: normal;
    font-size: 0.95rem;
  }
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const Section = styled.section`
  margin-bottom: 64px;
  order: ${props => props.order || 0};
`;

const SectionHeader = styled.div`
  text-align: left;
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 3px solid #e2e8f0;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  h2 {
    font-size: 1.875rem;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 16px;
    cursor: pointer;
    user-select: none;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      color: #FF3621;
    }

    @media (max-width: 768px) {
      font-size: 1.5rem;
    }
  }

  p {
    font-size: 1rem;
    color: #475569;
    max-width: 700px;
    margin: 0;
    line-height: 1.6;

    @media (max-width: 768px) {
      font-size: 0.938rem;
    }
  }
`;

const SectionTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;

  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 12px;
  }
`;

const SectionControls = styled.div`
  display: flex;
  gap: 8px;
  pointer-events: auto;
  opacity: 0;
  transition: opacity 0.3s ease;

  section:hover &,
  .maturity-section:hover & {
    opacity: 1;
  }

  @media (max-width: 768px) {
    opacity: 1;
  }
`;

const ReorderButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  background: ${props => props.disabled ? '#f3f4f6' : '#1B3B6F'};
  color: ${props => props.disabled ? '#9ca3af' : 'white'};
  border: none;
  border-radius: 8px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${props => props.disabled ? 'none' : '0 2px 8px rgba(27, 59, 111, 0.25)'};
  pointer-events: ${props => props.disabled ? 'none' : 'auto'};

  &:hover {
    background: ${props => props.disabled ? '#f3f4f6' : '#152d55'};
    transform: ${props => props.disabled ? 'none' : 'translateY(-2px)'};
    box-shadow: ${props => props.disabled ? 'none' : '0 4px 12px rgba(27, 59, 111, 0.35)'};
  }
  
  &:active {
    transform: ${props => props.disabled ? 'none' : 'translateY(0)'};
  }

  &:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  @media (max-width: 768px) {
    width: 30px;
    height: 30px;
  }
`;

const AddButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  background: linear-gradient(135deg, #00A972 0%, #008c5f 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 169, 114, 0.25);
  pointer-events: auto;
  opacity: 0;
  margin-left: auto;
  margin-right: 8px;

  section:hover &,
  .maturity-section:hover & {
    opacity: 1;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 169, 114, 0.35);
    background: linear-gradient(135deg, #008c5f 0%, #007550 100%);
  }
  
  &:active {
    transform: translateY(0);
  }

  &:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  @media (max-width: 768px) {
    width: 30px;
    height: 30px;
    opacity: 1;
  }
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled(motion.div)`
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  height: auto;
  overflow: visible;
  width: 100%;
  min-width: 280px;
  min-height: 180px;
  cursor: default;

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    border-color: #cbd5e1;
    transform: translateY(-4px);
  }

  @media print {
    box-shadow: none !important;
    border: 1px solid #e5e7eb !important;
    transform: none !important;
  }

  /* Resize handle styling */
  &::-webkit-resizer {
    background: linear-gradient(135deg, transparent 0%, transparent 50%, ${props => props.$borderColor || '#3b82f6'} 50%, ${props => props.$borderColor || '#3b82f6'} 100%);
    border-radius: 0 0 14px 0;
  }

  /* Custom resize indicator - only show when card has been resized */
  &::after {
    content: '';
    position: absolute;
    bottom: 4px;
    right: 4px;
    width: 16px;
    height: 16px;
    display: ${props => props.$height ? 'block' : 'none'};
    background: linear-gradient(
      135deg,
      transparent 0%,
      transparent 40%,
      ${props => props.$borderColor || '#94a3b8'} 45%,
      transparent 50%,
      transparent 55%,
      ${props => props.$borderColor || '#94a3b8'} 60%,
      transparent 65%,
      transparent 70%,
      ${props => props.$borderColor || '#94a3b8'} 75%,
      transparent 80%
    );
    pointer-events: none;
    opacity: 0.5;
    transition: opacity 0.3s ease;
  }

  &:hover::after {
    opacity: 0.8;
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
`;

const CardTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  flex: 1;
  line-height: 1.4;
`;

const CardActions = styled.div`
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.3s ease;

  .objective-card:hover &,
  .category-card:hover &,
  .success-card:hover &,
  .analysis-card:hover &,
  .scenario-card:hover &,
  .matrix-card:hover & {
    opacity: 1;
  }
`;

const IconButton = styled.button`
  background: transparent;
  color: ${props => props.$variant === 'delete' ? '#dc2626' : '#64748b'};
  border: 1px solid ${props => props.$variant === 'delete' ? '#fca5a5' : '#cbd5e1'};
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${props => props.$variant === 'delete' ? '#fef2f2' : '#f8fafc'};
    border-color: ${props => props.$variant === 'delete' ? '#dc2626' : '#FF3621'};
    color: ${props => props.$variant === 'delete' ? '#991b1b' : '#FF3621'};
    transform: scale(1.05);
  }

  &:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }
`;

const CardContent = styled.div`
  color: #475569;
  font-size: 0.875rem;
  line-height: 1.6;
  margin-bottom: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  white-space: pre-wrap;
  word-wrap: break-word;
  word-break: break-word;
  overflow-wrap: break-word;
  hyphens: auto;

  ul {
    margin: 12px 0;
    padding-left: 20px;
  }

  li {
    margin-bottom: 8px;
  }
`;

// Category Structure Specific Styles
const CategoryContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 32px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CategoryCard = styled(motion.div)`
  background: white;
  border-radius: 16px;
  padding: 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
  overflow: visible;
  border: 2px solid transparent;
  min-width: 300px;
  position: relative;

  &:hover {
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    border-color: ${props => props.$color || '#e5e7eb'};
  }
`;

const CategoryHeader = styled.div`
  background: ${props => props.$bgColor || '#f3f4f6'};
  color: white;
  padding: 24px 32px;
  position: relative;
`;

const CategoryHeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const CategoryLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.9;
  margin-bottom: 8px;
`;

const CategoryTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  flex: 1;
`;

const CategoryDescription = styled.div`
  font-size: 0.9375rem;
  color: rgba(255, 255, 255, 0.9);
  margin-top: 12px;
  line-height: 1.6;
  font-weight: 400;
`;

const CategoryBody = styled.div`
  padding: 28px 32px;
`;

const SubCategoryList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const SubCategoryItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #e5e7eb;
  position: relative;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #f9fafb;
    margin: 0 -16px;
    padding: 12px 16px;
  }
`;

const SubCategoryLetter = styled.span`
  font-weight: 700;
  color: ${props => props.$color || '#64748b'};
  font-size: 0.875rem;
  flex-shrink: 0;
  width: 20px;
`;

const SubCategoryName = styled.span`
  color: #475569;
  font-size: 0.9375rem;
  line-height: 1.5;
  flex: 1;
`;

const SubCategoryActions = styled.div`
  display: flex;
  gap: 6px;
  opacity: 0;
  transition: opacity 0.2s;

  ${SubCategoryItem}:hover & {
    opacity: 1;
  }
`;

const SmallIconButton = styled.button`
  background: ${props => props.variant === 'delete' ? '#fee2e2' : '#eff6ff'};
  color: ${props => props.variant === 'delete' ? '#dc2626' : '#3b82f6'};
  border: none;
  padding: 4px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${props => props.variant === 'delete' ? '#fecaca' : '#dbeafe'};
    transform: scale(1.1);
  }
`;

// Maturity Matrix Styles
const MaturitySection = styled.div`
  margin-bottom: 80px;
  order: ${props => props.order || 0};
`;

const MaturityCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 40px;
  overflow: visible;
  border: 2px solid transparent;
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
  min-width: 300px;
  position: relative;

  &:hover {
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    border-color: ${props => props.$borderColor || '#e5e7eb'};
  }
`;

const MaturityCardHeader = styled.div`
  background: ${props => props.$bgColor || '#f3f4f6'};
  color: white;
  padding: 24px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MaturityCardTitle = styled.h3`
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0;
`;

const MaturityTable = styled.div`
  overflow-x: auto;
  padding: 24px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 900px;
`;

const TableHeader = styled.thead`
  background: linear-gradient(135deg, #4f9cf9 0%, #3b82f6 100%);
  color: white;
`;

const TableHeaderCell = styled.th`
  padding: 16px 12px;
  text-align: left;
  font-weight: 700;
  font-size: 0.9375rem;
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;

  &:first-child {
    width: 180px;
    position: sticky;
    left: 0;
    background: linear-gradient(135deg, #4f9cf9 0%, #3b82f6 100%);
    z-index: 10;
  }

  &:last-child {
    border-right: none;
  }
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  transition: all 0.2s;

  &:hover {
    background: #f9fafb;
  }

  &:not(:last-child) {
    border-bottom: 1px solid #e5e7eb;
  }
`;

const TableCell = styled.td`
  padding: 16px 12px;
  font-size: 0.875rem;
  color: #475569;
  line-height: 1.6;
  vertical-align: top;
  border-right: 1px solid #e5e7eb;
  position: relative;

  &:first-child {
    font-weight: 600;
    color: #1e293b;
    background: #f8f9fa;
    width: 180px;
    position: sticky;
    left: 0;
    z-index: 5;
  }

  &:last-child {
    border-right: none;
  }
`;

const CellActions = styled.div`
  position: absolute;
  top: 4px;
  right: 4px;
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s;
  z-index: 10;

  .table-cell:hover &,
  .table-row:hover &,
  .stage-card:hover &,
  .success-column:hover & {
    opacity: 1;
  }

  @media (max-width: 768px) {
    opacity: 1;
  }
`;

const TinyIconButton = styled.button`
  background: ${props => props.variant === 'delete' ? '#fee2e2' : '#eff6ff'};
  color: ${props => props.variant === 'delete' ? '#dc2626' : '#3b82f6'};
  border: none;
  padding: 2px;
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${props => props.variant === 'delete' ? '#fecaca' : '#dbeafe'};
    transform: scale(1.1);
  }
`;

// Technical Success Plan Styles
const SuccessPlanCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: visible;
  margin-bottom: 20px;
  border-left: 4px solid ${props => props.color || '#e5e7eb'};
  transition: box-shadow 0.3s ease;
  min-width: 300px;
  position: relative;

  &:hover {
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  }
`;

const SuccessPlanHeader = styled.div`
  background: ${props => props.color || '#f3f4f6'};
  color: white;
  padding: 20px 24px;
  font-weight: 700;
  font-size: 1.125rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SuccessPlanBody = styled.div`
  padding: 24px;
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const SuccessPlanColumn = styled.div`
  position: relative;
  
  h4 {
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    color: #6b7280;
    margin-bottom: 12px;
    letter-spacing: 0.5px;
  }

  p {
    color: #475569;
    font-size: 0.9375rem;
    line-height: 1.6;
    margin: 0;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    color: #475569;
    font-size: 0.9375rem;
    line-height: 1.6;
    padding: 6px 0;
    display: flex;
    align-items: flex-start;
    gap: 8px;

    &:before {
      content: '•';
      color: ${props => props.$bulletColor || '#3b82f6'};
      font-weight: 700;
      font-size: 1.25rem;
      line-height: 1.4;
    }
  }
`;

// Engagement Plan Styles
const EngagementTable = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
`;

const EngagementTableRow = styled.div`
  display: grid;
  grid-template-columns: 150px 1fr 1fr;
  border-bottom: 1px solid #e5e7eb;
  transition: all 0.2s;

  &:hover {
    background: #f9fafb;
  }

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const EngagementTableHeader = styled(EngagementTableRow)`
  background: linear-gradient(135deg, #334155 0%, #1e293b 100%);
  color: white;
  font-weight: 700;

  &:hover {
    background: linear-gradient(135deg, #334155 0%, #1e293b 100%);
  }
`;

const EngagementTableCell = styled.div`
  padding: 16px 20px;
  font-size: 0.9375rem;
  color: #475569;
  line-height: 1.6;
  display: flex;
  align-items: center;
  position: relative;

  ${EngagementTableHeader} & {
    color: white;
    font-weight: 700;
  }

  &:not(:last-child) {
    border-right: 1px solid #e5e7eb;

    ${EngagementTableHeader} & {
      border-right-color: rgba(255, 255, 255, 0.2);
    }
  }

  @media (max-width: 768px) {
    border-right: none !important;
    border-bottom: 1px solid #e5e7eb;

    &:last-child {
      border-bottom: none;
    }
  }
`;

// Analysis & Actions Styles
const AnalysisCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 40px;
  overflow: visible;
  border: 2px solid transparent;
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
  min-width: 300px;
  position: relative;

  &:hover {
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    border-color: ${props => props.$borderColor || '#e5e7eb'};
  }
`;

const AnalysisCardHeader = styled.div`
  background: ${props => props.$bgColor || '#f3f4f6'};
  color: white;
  padding: 24px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AnalysisCardTitle = styled.h3`
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0;
`;

const AnalysisCardBody = styled.div`
  padding: 32px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 24px;

  @media (max-width: 1400px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 20px;
  }
`;

const AnalysisStageCard = styled.div`
  background: #f9fafb;
  border-radius: 12px;
  padding: 20px;
  border: 2px solid #e5e7eb;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100%;
  min-width: 200px;

  &:hover {
    border-color: ${props => props.color || '#3b82f6'};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }
`;

const AnalysisStageTitle = styled.h4`
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 16px;
`;

const AnalysisStageDescription = styled.p`
  font-size: 0.9375rem;
  color: #475569;
  line-height: 1.7;
  margin-bottom: 16px;
  flex: 1;
`;

const AnalysisStageTools = styled.div`
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
  margin-top: auto;

  strong {
    font-size: 0.875rem;
    color: #64748b;
    font-weight: 600;
  }

  span {
    display: block;
    margin-top: 8px;
    font-size: 0.875rem;
    color: #3b82f6;
    font-weight: 500;
  }
`;

// Engagement Scenarios Styles
const ScenarioCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 40px;
  overflow: visible;
  border-left: 6px solid ${props => props.$color || '#e5e7eb'};
  transition: box-shadow 0.3s ease;
  min-width: 300px;
  position: relative;

  &:hover {
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  }
`;

const ScenarioHeader = styled.div`
  background: ${props => props.$bgColor || '#f3f4f6'};
  color: white;
  padding: 32px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const ScenarioTitle = styled.h3`
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 24px 0;
  color: white;
`;

const MaturityLevelIndicator = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
`;

const MaturityBox = styled.div`
  width: 60px;
  height: 40px;
  border-radius: 4px;
  background: ${props => props.$filled ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.2)'};
  border: 2px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  color: ${props => props.$filled ? '#1e293b' : 'rgba(255, 255, 255, 0.7)'};
  transition: all 0.2s;

  @media (max-width: 768px) {
    width: 50px;
    height: 35px;
    font-size: 0.7rem;
  }
`;

const MaturityLevelText = styled.div`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  margin-bottom: 8px;

  strong {
    font-weight: 700;
    color: white;
  }
`;

const ScenarioBody = styled.div`
  padding: 32px;

  @media (max-width: 768px) {
    padding: 24px;
  }
`;

const ScenarioSection = styled.div`
  margin-bottom: 32px;

  &:last-child {
    margin-bottom: 0;
  }

  h4 {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 16px;
  }

  p {
    font-size: 1rem;
    color: #475569;
    line-height: 1.7;
    margin: 0;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    color: #475569;
    font-size: 0.9375rem;
    line-height: 1.7;
    padding: 10px 0;
    display: flex;
    align-items: flex-start;
    gap: 12px;

    &:before {
      content: '•';
      color: ${props => props.$bulletColor || '#3b82f6'};
      font-weight: 700;
      font-size: 1.5rem;
      line-height: 1.3;
      flex-shrink: 0;
    }
  }
`;

// =======================
// MODAL COMPONENTS
// =======================

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled(motion.div)`
  background: white;
  border-radius: 16px;
  padding: 32px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  h3 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1e293b;
    margin: 0;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #64748b;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;

  &:hover {
    color: #1e293b;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 600;
  color: #1e293b;
  font-size: 0.9375rem;
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  color: #1e293b;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #6366f1;
  }
`;

const TextArea = styled.textarea`
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  color: #1e293b;
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #6366f1;
  }
`;

const FormatToolbar = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
  padding: 8px;
  background: #f8fafc;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
`;

const FormatButton = styled.button`
  padding: 6px 12px;
  background: white;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  font-weight: 600;
  font-size: 0.875rem;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #e0e7ff;
    border-color: #6366f1;
    color: #4f46e5;
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 8px;
`;

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;

  ${props => props.$variant === 'primary' ? `
    background: linear-gradient(135deg, #00A972 0%, #008c5f 100%);
    color: white;
    box-shadow: 0 2px 8px rgba(0, 169, 114, 0.25);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 169, 114, 0.35);
      background: linear-gradient(135deg, #008c5f 0%, #007550 100%);
    }
  ` : `
    background: white;
    color: #64748b;
    border: 2px solid #cbd5e1;

    &:hover {
      background: #f8fafc;
      border-color: #94a3b8;
    }
  `}

  &:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }
`;

// =======================
// RESIZABLE CARD WRAPPER
// =======================

// Simplified card wrapper - no more resize tracking
const ResizableCard = ({ objective, onResize, children, ...props }) => {
  return (
    <Card
      className="objective-card"
      $borderColor={objective.borderColor}
      {...props}
    >
      {children}
    </Card>
  );
};

// =======================
// COMPONENT
// =======================

const DeepDive = () => {
  const location = useLocation();
  
  // Section ordering state
  const [sectionOrder, setSectionOrder] = useState([
    'objectives',
    'categories',
    'successPlan',
    'engagementPlan',
    'analysisActions',
    'scenarios',
    'matrices'
  ]);

  // Presentation Mode State
  const [presentationMode, setPresentationMode] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Auto-start slideshow if URL parameter is present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('slideshow') === 'true') {
      startPresentation();
    }
  }, [location.search]);

  // Define slides - combining sections to maximize space
  const slides = [
    {
      id: 'title',
      title: 'Deep Dive Analysis',
      type: 'title'
    },
    {
      id: 'objectives',
      title: 'Strategic Objectives',
      type: 'single'
    },
    {
      id: 'categories-1',
      title: 'Category Structure (Part 1)',
      type: 'single'
    },
    {
      id: 'categories-2',
      title: 'Category Structure (Part 2)',
      type: 'single'
    },
    {
      id: 'success-plan-1',
      title: 'Technical Success Plan (Part 1)',
      type: 'single'
    },
    {
      id: 'success-plan-2',
      title: 'Technical Success Plan (Part 2)',
      type: 'single'
    },
    {
      id: 'engagement-plan',
      title: 'Targeted Engagement & Enablement Plan',
      type: 'single'
    },
    {
      id: 'analysis-1',
      title: 'Analysis & Actions (Part 1)',
      type: 'single'
    },
    {
      id: 'analysis-2',
      title: 'Analysis & Actions (Part 2)',
      type: 'single'
    },
    {
      id: 'scenarios',
      title: 'Customer Engagement Scenarios',
      type: 'single'
    },
    {
      id: 'matrices-1',
      title: 'Maturity Level Definition',
      type: 'single'
    },
    {
      id: 'matrices-2',
      title: 'Maturity Level Definition',
      type: 'single'
    },
    {
      id: 'matrices-3',
      title: 'Maturity Level Definition',
      type: 'single'
    },
    {
      id: 'matrices-4',
      title: 'Maturity Level Definition',
      type: 'single'
    },
    {
      id: 'matrices-5',
      title: 'Maturity Level Definition',
      type: 'single'
    },
    {
      id: 'matrices-6',
      title: 'Maturity Level Definition',
      type: 'single'
    },
    {
      id: 'thank-you',
      title: 'Thank You',
      type: 'thank-you'
    }
  ];

  // Presentation mode handlers
  const startPresentation = () => {
    setCurrentSlide(0);
    setPresentationMode(true);
    document.body.style.overflow = 'hidden';
  };

  const exitPresentation = () => {
    setPresentationMode(false);
    document.body.style.overflow = 'auto';
  };

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      // Exit slideshow when trying to go past the last slide
      exitPresentation();
    }
  };

  const previousSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handlePrintSlideshow = async () => {
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: 'letter'
    });

    const totalSlides = slides.length;
    
    for (let i = 0; i < totalSlides; i++) {
      setCurrentSlide(i);
      
      // Wait longer for animations and content to render
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Additional delay for DOM update
      await new Promise(resolve => setTimeout(resolve, 200));

      // Find all elements to hide during screenshot
      const elementsToHide = document.querySelectorAll('[data-hide-on-print="true"]');
      
      // Store original display values and hide elements
      const originalDisplayValues = Array.from(elementsToHide).map(el => {
        const originalDisplay = el.style.display;
        el.style.display = 'none';
        return originalDisplay;
      });

      // Temporarily hide body overflow and scrollbars
      const originalOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      // Scroll to top to ensure we capture from the beginning
      window.scrollTo(0, 0);

      // Wait a bit more after hiding elements
      await new Promise(resolve => setTimeout(resolve, 100));

      // Capture the full viewport
      const canvas = await html2canvas(document.body, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#1e3a8a',
        logging: false,
        width: window.innerWidth,
        height: window.innerHeight,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        scrollX: 0,
        scrollY: 0,
        foreignObjectRendering: true
      });

      // Restore body overflow
      document.body.style.overflow = originalOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;

      // Restore original display values
      elementsToHide.forEach((el, index) => {
        el.style.display = originalDisplayValues[index];
      });

      const imgData = canvas.toDataURL('image/png');

      // Calculate dimensions to maintain aspect ratio
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = (pdfHeight - imgHeight * ratio) / 2;

      if (i > 0) {
        pdf.addPage();
      }

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
    }

    pdf.save('deep-dive-presentation.pdf');
  };

  // Keyboard navigation for slideshow
  useEffect(() => {
    if (!presentationMode) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        previousSlide();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        exitPresentation();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [presentationMode, currentSlide]);


  // Click navigation handler
  const handleSlideClick = (e) => {
    const slideWidth = e.currentTarget.offsetWidth;
    const clickX = e.clientX;
    
    // If clicked on left half, go previous; right half, go next
    if (clickX < slideWidth / 2) {
      previousSlide();
    } else {
      nextSlide();
    }
  };

  // Keyboard navigation for presentation
  useEffect(() => {
    if (!presentationMode) return;

    const handleKeyPress = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        previousSlide();
      } else if (e.key === 'Escape') {
        exitPresentation();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [presentationMode, currentSlide]);


  // Section collapse state (all sections expanded by default)
  const [collapsedSections, setCollapsedSections] = useState({
    objectives: false,
    categories: false,
    successPlan: false,
    engagementPlan: false,
    analysisActions: false,
    scenarios: false,
    matrices: false
  });

  const toggleSection = (sectionId) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const toggleAllSections = () => {
    // Check if all sections are collapsed
    const allCollapsed = Object.values(collapsedSections).every(val => val === true);
    
    if (allCollapsed) {
      // Expand all
      setCollapsedSections({
        objectives: false,
        categories: false,
        successPlan: false,
        engagementPlan: false,
        analysisActions: false,
        scenarios: false,
        matrices: false
      });
    } else {
      // Collapse all
      setCollapsedSections({
        objectives: true,
        categories: true,
        successPlan: true,
        engagementPlan: true,
        analysisActions: true,
        scenarios: true,
        matrices: true
      });
    }
  };

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [parentCategory, setParentCategory] = useState(null); // For sub-category editing

  // Move section up
  const moveSectionUp = (sectionId) => {
    console.log('Move up clicked:', sectionId);
    const currentIndex = sectionOrder.indexOf(sectionId);
    if (currentIndex > 0) {
      const newOrder = [...sectionOrder];
      [newOrder[currentIndex - 1], newOrder[currentIndex]] = [newOrder[currentIndex], newOrder[currentIndex - 1]];
      setSectionOrder(newOrder);
      toast.success('Section moved up', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#6366f1',
          color: 'white',
          fontSize: '16px',
          padding: '16px',
          borderRadius: '8px',
        },
      });
    }
  };

  // Move section down
  const moveSectionDown = (sectionId) => {
    console.log('Move down clicked:', sectionId);
    const currentIndex = sectionOrder.indexOf(sectionId);
    if (currentIndex < sectionOrder.length - 1) {
      const newOrder = [...sectionOrder];
      [newOrder[currentIndex], newOrder[currentIndex + 1]] = [newOrder[currentIndex + 1], newOrder[currentIndex]];
      setSectionOrder(newOrder);
      toast.success('Section moved down', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#6366f1',
          color: 'white',
          fontSize: '16px',
          padding: '16px',
          borderRadius: '8px',
        },
      });
    }
  };

  // Maturity levels for table headers
  const maturityLevels = [
    '1. Explore',
    '2. Experiment',
    '3. Formalize',
    '4. Optimize',
    '5. Transform'
  ];

  // Objectives data
  const [objectives, setObjectives] = useState([
    {
      id: 'obj-1',
      title: 'Enable our customers to build a scalable, secure, and governed foundation on Databricks',
      content: `Technical practitioners within our customers' organizations aim to create a platform that is reliable, performant, and compliant with enterprise standards.

The Technical Maturity Model enables Databricks to provide customers with a structured framework to benchmark their platform readiness and operational excellence across the Lakehouse.`,
      icon: '🏗️',
      borderColor: '#f97316'
    },
    {
      id: 'obj-2',
      title: 'Help customers identify and overcome technical and operational gaps',
      content: `A mature platform is not only about performance — success depends on governance, integration, observability, and operational excellence. Technical maturity assessments help highlight dependencies across architecture, data pipelines, security, and team enablement.

The Technical Maturity Model enables us to elevate discussions beyond workloads and clusters — helping customers align technology, processes, and people for long-term scalability and reliability.`,
      icon: '🎯',
      borderColor: '#3b82f6'
    },
    {
      id: 'obj-3',
      title: "Position Databricks as a strategic partner in the customer's modernization journey",
      content: `With thousands of customer engagements, Databricks uniquely understands what 'good' looks like across platform operations, data engineering, analytics, ML, and GenAI adoption.

Position Databricks as a trusted advisor with deep technical expertise — helping customers accelerate their journey toward platform maturity through best practices, Value Acceleration, Partner Solutions, and Technical Account engagements.`,
      icon: '🤝',
      borderColor: '#8b5cf6'
    }
  ]);

  // Category structure data
  const [categories, setCategories] = useState([
    {
      id: 'cat-1',
      label: 'PLATFORM ALIGNMENT',
      title: 'Platform & Governance',
      color: '#f97316',
      bgColor: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
      subCategories: [
        { letter: 'A.', name: 'Environment Architecture' },
        { letter: 'B.', name: 'Security & Access Control' },
        { letter: 'C.', name: 'Governance & Compliance' },
        { letter: 'D.', name: 'Observability & Monitoring' },
        { letter: 'E.', name: 'Cost Management' }
      ],
      description: 'Foundational platform capabilities for a secure, governed, and scalable Databricks deployment.'
    },
    {
      id: 'cat-2',
      label: 'DATA ALIGNMENT',
      title: 'Data Engineering & Integration',
      color: '#3b82f6',
      bgColor: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      subCategories: [
        { letter: 'A.', name: 'Ingestion Strategy' },
        { letter: 'B.', name: 'Lakehouse Architecture' },
        { letter: 'C.', name: 'Pipeline Orchestration' },
        { letter: 'D.', name: 'Data Quality' },
        { letter: 'E.', name: 'Performance & Scalability' }
      ],
      description: 'Build robust, scalable data pipelines with modern lakehouse architecture and quality controls.'
    },
    {
      id: 'cat-3',
      label: 'ANALYTICS ALIGNMENT',
      title: 'Analytics & BI Modernization',
      color: '#10b981',
      bgColor: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      subCategories: [
        { letter: 'A.', name: 'Query Performance' },
        { letter: 'B.', name: 'Data Modeling' },
        { letter: 'C.', name: 'Visualization & Reporting' },
        { letter: 'D.', name: 'Self-Service Enablement' },
        { letter: 'E.', name: 'Collaboration & Sharing' }
      ],
      description: 'Enable fast, self-service analytics with governed data access and modern BI integration.'
    },
    {
      id: 'cat-4',
      label: 'ML ALIGNMENT',
      title: 'Machine Learning & MLOps',
      color: '#dc2626',
      bgColor: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
      subCategories: [
        { letter: 'A.', name: 'Experimentation & Tracking' },
        { letter: 'B.', name: 'Model Deployment' },
        { letter: 'C.', name: 'Feature Management' },
        { letter: 'D.', name: 'ML Lifecycle Governance' },
        { letter: 'E.', name: 'Business Impact' }
      ],
      description: 'Operationalize machine learning with MLOps best practices and production-grade workflows.'
    },
    {
      id: 'cat-5',
      label: 'GENAI ALIGNMENT',
      title: 'Generative AI & Agentic Capabilities',
      color: '#8b5cf6',
      bgColor: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      subCategories: [
        { letter: 'A.', name: 'GenAI Strategy' },
        { letter: 'B.', name: 'Data & Knowledge Readiness' },
        { letter: 'C.', name: 'Application Development' },
        { letter: 'D.', name: 'Evaluation & Quality Control' },
        { letter: 'E.', name: 'Responsible AI' }
      ],
      description: 'Build enterprise-grade GenAI applications with RAG, LLM governance, and responsible AI practices.'
    },
    {
      id: 'cat-6',
      label: 'ADOPTION ALIGNMENT',
      title: 'Operational Excellence & Adoption',
      color: '#64748b',
      bgColor: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
      subCategories: [
        { letter: 'A.', name: 'Center of Excellence' },
        { letter: 'B.', name: 'Community of Practice' },
        { letter: 'C.', name: 'Training & Enablement' },
        { letter: 'D.', name: 'Financial Management' },
        { letter: 'E.', name: 'Innovation & Improvement' }
      ],
      description: 'Drive platform adoption, community engagement, and continuous improvement across your organization.'
    }
  ]);

  // Technical Success Plan data
  const [technicalSuccessPlan, setTechnicalSuccessPlan] = useState([
    {
      id: 'tsp-1',
      category: 'Platform & Governance',
      color: '#f97316',
      need: 'Establish secure, scalable, and well-governed Databricks environments',
      activities: [
        'Platform Foundations Workshop',
        'ABAC & Unity Catalog implementation review',
        'IaC setup via Terraform & DABs'
      ],
      outcome: 'Standardized & Governed Lakehouse Foundation'
    },
    {
      id: 'tsp-2',
      category: 'Data Engineering & Integration',
      color: '#3b82f6',
      need: 'Streamline ingestion, orchestration, and data quality',
      activities: [
        'LakeFlow Connect onboarding',
        'DLT & Auto Loader enablement',
        'Quality rule automation with expectations'
      ],
      outcome: 'Reliable & Automated Data Pipelines'
    },
    {
      id: 'tsp-3',
      category: 'Analytics & BI Modernization',
      color: '#10b981',
      need: 'Accelerate self-service analytics & performance',
      activities: [
        'DBSQL Serverless adoption',
        'AI BI workshops (Genie / AI Functions)',
        'Cost optimization dashboards'
      ],
      outcome: 'Self-Service Analytics at Scale'
    },
    {
      id: 'tsp-4',
      category: 'Machine Learning & MLOps',
      color: '#dc2626',
      need: 'Standardize ML lifecycle management',
      activities: [
        'MLflow governance setup',
        'Feature Store onboarding',
        'Model Serving & CI/CD enablement'
      ],
      outcome: 'Consistent & Governed ML Deployments'
    },
    {
      id: 'tsp-5',
      category: 'Generative AI & Agents',
      color: '#8b5cf6',
      need: 'Enable GenAI experimentation with governance',
      activities: [
        'AI Gateway integration',
        'Vector Search & embedding pipeline enablement',
        'Agentic app deployment via Databricks Apps'
      ],
      outcome: 'Enterprise GenAI Adoption Readiness'
    },
    {
      id: 'tsp-6',
      category: 'Operational Excellence',
      color: '#c2185b',
      need: 'Drive continuous improvement & adoption',
      activities: [
        'Technical CoE formation',
        'Observability & FinOps enablement',
        'Role-based enablement roadmap'
      ],
      outcome: 'Enterprise-Ready Platform Operations'
    }
  ]);

  // Engagement & Enablement Plan data
  const [engagementPlan, setEngagementPlan] = useState([
    {
      id: 'ep-1',
      time: 'Today',
      engagement: 'Technical Maturity Kickoff + Architecture Review',
      focusArea: 'Define current state, identify platform gaps'
    },
    {
      id: 'ep-2',
      time: 'H1 2026',
      engagement: 'Unity Catalog, IaC, ABAC, Observability Workshops',
      focusArea: 'Secure & Governed Foundation'
    },
    {
      id: 'ep-3',
      time: 'H2 2026',
      engagement: 'DLT, Auto Loader, and DBSQL Serverless Enablement',
      focusArea: 'Data Quality + Performance'
    },
    {
      id: 'ep-4',
      time: 'H1 2027',
      engagement: 'MLflow, Model Serving, Feature Store Workshops',
      focusArea: 'Scalable ML Lifecycle'
    },
    {
      id: 'ep-5',
      time: 'H2 2027',
      engagement: 'GenAI + AI Gateway Enablement',
      focusArea: 'AI-driven Applications'
    },
    {
      id: 'ep-6',
      time: 'Continuous',
      engagement: 'CoE Enablement + FinOps Dashboards',
      focusArea: 'Operational Excellence'
    }
  ]);

  // Customer Engagement Scenarios data
  const [engagementScenarios, setEngagementScenarios] = useState([
    {
      id: 'scenario-1',
      title: 'Digital Native Expert Engineering Team',
      color: '#f97316',
      bgColor: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
      maturityLevel: 4, // Optimize/Transform
      maturityDescriptions: {
        explore: 'Isolated sandboxes; minimal governance.',
        experiment: 'IaC introduced; early DLT or MLflow pilots.',
        formalize: 'Stable CI/CD pipelines; partial Unity Catalog.',
        optimize: 'Automated provisioning, lineage tracking.',
        transform: 'Policy-as-code; self-service Lakehouse platform.'
      },
      scenario: 'Technically mature customers with cloud-native teams seeking optimization and governance across multi-workspace environments.',
      approach: [
        'Run FinOps workshops for cost and performance optimization.',
        'Deep-dive reviews of observability, lineage, and monitoring.',
        'Implement ABAC and central Unity Catalog governance.',
        'Build CI/CD automation using Databricks Asset Bundles.',
        'Position Databricks as the innovation and optimization partner.'
      ]
    },
    {
      id: 'scenario-2',
      title: 'Azure – Already Using Databricks',
      color: '#3b82f6',
      bgColor: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      maturityLevel: 3, // Formalize/Optimize
      maturityDescriptions: {
        explore: 'Ad-hoc usage; limited visibility.',
        experiment: 'Initial pipelines; workspace-specific access.',
        formalize: 'Identity and Unity Catalog integration.',
        optimize: 'IaC automation; monitoring enabled.',
        transform: 'Governed multi-workspace setup with Azure governance and FinOps.'
      },
      scenario: 'Existing Azure Databricks customers underutilizing governance and automation capabilities, needing optimization and enablement alignment.',
      approach: [
        'Conduct Lakehouse Health Check on architecture and usage.',
        'Deploy Terraform templates for workspace consistency.',
        'Integrate Azure Monitor and Lakehouse Monitoring.',
        'Align with Azure GTM for FinOps and governance visibility.'
      ]
    },
    {
      id: 'scenario-3',
      title: 'Migration-Led – Burning Platform',
      color: '#dc2626',
      bgColor: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
      maturityLevel: 3, // Formalize/Optimize
      maturityDescriptions: {
        explore: 'Legacy DWH or Hadoop nearing obsolescence.',
        experiment: 'POCs to validate Databricks migration.',
        formalize: 'Migration factory; hybrid coexistence.',
        optimize: 'DLT pipelines; schema evolution automated.',
        transform: 'Fully modernized Lakehouse governed by Unity Catalog.'
      },
      scenario: 'Customers facing time-sensitive migrations off legacy systems needing fast modernization while ensuring governance and continuity.',
      approach: [
        'Engage migration specialists to define architecture roadmap.',
        'Modernize ingestion using LakeFlow and Delta pipelines.',
        'Embed Unity Catalog and audit readiness from day one.',
        'Deliver TCO reduction through consolidation and automation.'
      ]
    },
    {
      id: 'scenario-4',
      title: 'Shadow IT',
      color: '#10b981',
      bgColor: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      maturityLevel: 3, // Formalize/Optimize
      maturityDescriptions: {
        explore: 'Disparate workspaces; no visibility.',
        experiment: 'Uncoordinated clusters and governance gaps.',
        formalize: 'Central workspace registry; minimal identity integration.',
        optimize: 'Unified catalog and FinOps tagging.',
        transform: 'Fully governed multi-domain Lakehouse with automation.'
      },
      scenario: 'Independent workspaces cause governance fragmentation and duplicated costs, requiring unification and governance centralization.',
      approach: [
        'Run workspace discovery and consolidation assessment.',
        'Implement Unity Catalog with ABAC for federated governance.',
        'Automate provisioning via Terraform for lifecycle control.',
        'Enable FinOps dashboards for visibility and accountability.'
      ]
    },
    {
      id: 'scenario-5',
      title: 'Strategy Directions',
      color: '#8b5cf6',
      bgColor: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      maturityLevel: 3, // Formalize/Optimize
      maturityDescriptions: {
        explore: 'Strategic intent without technical execution.',
        experiment: 'Early pilots and architecture reviews.',
        formalize: 'Unity Catalog and CI/CD adoption.',
        optimize: 'Observability and automation aligned to KPIs.',
        transform: 'Platform-as-a-Service with governed Lakehouse adoption.'
      },
      scenario: 'Executives have defined an AI-first vision but need a concrete technical roadmap to operationalize platform modernization.',
      approach: [
        'Conduct Technical Maturity Assessment across six pillars.',
        'Map current and target states with quantified maturity gaps.',
        'Develop roadmap with modernization milestones and KPIs.',
        'Position Databricks as the enabler of continuous modernization.'
      ]
    }
  ]);

  // Analysis & Actions data
  const [analysisActions, setAnalysisActions] = useState([
    {
      id: 'aa-1',
      title: 'Platform & Governance',
      color: '#f97316',
      bgColor: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
      levels: [
        {
          stage: '1. Explore',
          description: 'Teams operate with ad-hoc environments and manual permissions. Limited understanding of environment separation or compliance. Begin by aligning on the value of governance and automation — the foundation of scalability and auditability.',
          tools: 'Platform Assessment, Governance Blueprint, IaC Starter Kit'
        },
        {
          stage: '2. Experiment',
          description: 'Teams begin adopting Terraform or manual Unity Catalog setup but lack policy consistency. Introduce baseline access models and automated provisioning across dev/test/prod.',
          tools: 'Unity Catalog QuickStart, Terraform Templates, Workspace Policies'
        },
        {
          stage: '3. Formalize',
          description: 'Central teams enforce access and lineage standards using ABAC and UC. Define clear ownership between platform and security.',
          tools: 'ABAC Policy Templates, Audit Dashboards, Monitoring Toolkit'
        },
        {
          stage: '4. Optimize',
          description: 'Environment provisioning and access control are fully automated via IaC. Policies standardized across business units with compliance automation.',
          tools: 'Terraform + DAB Integration, FinOps Dashboard, Compliance-as-Code'
        },
        {
          stage: '5. Transform',
          description: 'Platform operates as a fully governed, self-service data product ecosystem. Dynamic policies adapt to evolving business needs with zero-touch provisioning.',
          tools: 'Data Mesh Framework, Policy-as-Code Orchestration, AI-Driven Governance'
        }
      ]
    },
    {
      id: 'aa-2',
      title: 'Data Engineering & Integration',
      color: '#3b82f6',
      bgColor: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      levels: [
        {
          stage: '1. Explore',
          description: 'Data ingestion is manual and pipelines fail without alerting. Focus on simplifying ingestion using Auto Loader and declarative dataflows.',
          tools: 'Auto Loader Workshop, Ingestion Best Practices'
        },
        {
          stage: '2. Experiment',
          description: 'Teams start using DLT for structured pipelines but lack orchestration. Introduce LakeFlow Connect for data movement and lineage.',
          tools: 'DLT Templates, LakeFlow Connect Onboarding'
        },
        {
          stage: '3. Formalize',
          description: 'Pipelines now include expectations, lineage, and notifications. Standardize CDC patterns and implement monitoring.',
          tools: 'Quality Expectations, Lineage View, Lakehouse Monitoring'
        },
        {
          stage: '4. Optimize',
          description: 'Pipelines are self-healing, version-controlled, and SLA-managed. Data quality continuously validated across environments.',
          tools: 'DLT Advanced Toolkit, SLA Automation Scripts'
        },
        {
          stage: '5. Transform',
          description: 'Data movement operates as intelligent, self-optimizing fabric. Real-time CDC and streaming orchestrated end-to-end with AI-driven anomaly detection.',
          tools: 'Streaming Fabric, AI Quality Automation, Real-Time Lineage'
        }
      ]
    },
    {
      id: 'aa-3',
      title: 'Analytics & BI Modernization',
      color: '#10b981',
      bgColor: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      levels: [
        {
          stage: '1. Explore',
          description: 'Dashboards reside in multiple tools with no single source of truth. Begin consolidating BI workloads onto DBSQL.',
          tools: 'DBSQL QuickStart, BI Modernization Guide'
        },
        {
          stage: '2. Experiment',
          description: 'Teams create ad-hoc dashboards but lack tuning and access control. Introduce AI Functions and define performance SLAs.',
          tools: 'AI BI Workshop, Performance Tuning Playbook'
        },
        {
          stage: '3. Formalize',
          description: 'Business units adopt shared semantic models via Unity Catalog. DBSQL dashboards are certified and automated for refresh.',
          tools: 'Certified Dashboards, Semantic Layer Templates'
        },
        {
          stage: '4. Optimize',
          description: 'DBSQL Serverless and AI BI (Genie) enable natural-language analytics. Predictive insights embedded into workflows.',
          tools: 'AI BI Genie, Predictive Analytics Accelerator'
        },
        {
          stage: '5. Transform',
          description: 'Analytics operates as conversational, AI-native experience. Self-service insights democratized across all personas with zero learning curve.',
          tools: 'Genie Spaces, Compound AI System, Auto-Insights Framework'
        }
      ]
    },
    {
      id: 'aa-4',
      title: 'Machine Learning & MLOps',
      color: '#dc2626',
      bgColor: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
      levels: [
        {
          stage: '1. Explore',
          description: 'Models trained locally without traceability. Introduce MLflow Tracking and centralized artifact management.',
          tools: 'MLflow Starter Notebook, Model Governance Guide'
        },
        {
          stage: '2. Experiment',
          description: 'Teams register models but lack automation. Introduce Feature Store and automate retraining workflows.',
          tools: 'Feature Store QuickStart, CI/CD Templates'
        },
        {
          stage: '3. Formalize',
          description: 'End-to-end pipelines exist with registration, versioning, and monitoring. Integration with lineage dashboards.',
          tools: 'Model Registry, Model Monitoring Toolkit'
        },
        {
          stage: '4. Optimize',
          description: 'Model Serving is automated with event-driven retraining and explainability.',
          tools: 'MLflow + Feature Store Integration, Bias Detection Library'
        },
        {
          stage: '5. Transform',
          description: 'MLOps operates as autonomous ecosystem with CI/CD/CT for real-time model governance and continuous validation.',
          tools: 'Auto-ML Pipeline, Continuous Training Framework, Real-Time Monitoring'
        }
      ]
    },
    {
      id: 'aa-5',
      title: 'Generative AI & Agents',
      color: '#8b5cf6',
      bgColor: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      levels: [
        {
          stage: '1. Explore',
          description: 'Teams test OpenAI endpoints without governance. Define use-case categories and establish standards.',
          tools: 'GenAI Ideation Canvas, Prompt Engineering Guide'
        },
        {
          stage: '2. Experiment',
          description: 'POCs built with API keys and no control. Enable AI Gateway for auditing and traffic management.',
          tools: 'AI Gateway Workshop, LLM Evaluation Toolkit'
        },
        {
          stage: '3. Formalize',
          description: 'GenAI models deployed as Databricks Apps with Vector Search. Compliance and cost governance implemented.',
          tools: 'Vector Search Setup, Observability Dashboards'
        },
        {
          stage: '4. Optimize',
          description: 'Multi-agent architectures orchestrate knowledge retrieval and actions via AI Gateway.',
          tools: 'Multi-Agent Framework, AI Gateway Policy Templates'
        },
        {
          stage: '5. Transform',
          description: 'GenAI ecosystem powers compound AI systems with autonomous agents, unified observability, and adaptive governance.',
          tools: 'Agent Orchestration Platform, Real-Time Governance, Compound AI Templates'
        }
      ]
    },
    {
      id: 'aa-6',
      title: 'Operational Excellence',
      color: '#c2185b',
      bgColor: 'linear-gradient(135deg, #c2185b 0%, #ad1457 100%)',
      levels: [
        {
          stage: '1. Explore',
          description: 'Job failures are detected manually; limited FinOps visibility. Establish observability and cost tracking.',
          tools: 'FinOps Starter Dashboard, Lakehouse Monitoring'
        },
        {
          stage: '2. Experiment',
          description: 'Teams create dashboards but lack alerting. Automate cost tagging and resource reports.',
          tools: 'Monitoring Templates, Cost Tracking Scripts'
        },
        {
          stage: '3. Formalize',
          description: 'Centralized CoE manages operations and audits. Automation covers provisioning and scaling.',
          tools: 'CoE Playbook, Alerting Framework'
        },
        {
          stage: '4. Optimize',
          description: 'Predictive alerting and auto-remediation ensure resilience. FinOps integrated into scorecards.',
          tools: 'FinOps + Observability Dashboard, Policy Automation'
        },
        {
          stage: '5. Transform',
          description: 'Platform operates with AI-driven self-healing, predictive cost optimization, and zero-touch operations.',
          tools: 'AIOps Platform, Intelligent Cost Optimizer, Autonomous Operations Suite'
        }
      ]
    }
  ]);

  // Maturity matrices data
  const [maturityMatrices, setMaturityMatrices] = useState([
    {
      id: 'matrix-1',
      title: '1. Platform & Governance',
      color: '#f97316',
      bgColor: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
      dimensions: [
        {
          name: 'Environment Architecture',
          levels: [
            'Legacy or ad-hoc environments; no separation between dev/test/prod.',
            'Initial attempts to define environments; partial automation via manual scripts.',
            'Environment tiers established; partial CI/CD integration.',
            'Fully automated environment provisioning with IaC (Terraform/Bundle).',
            'Policy-driven multi-workspace strategy across business units.'
          ]
        },
        {
          name: 'Security & Access Control',
          levels: [
            'Minimal identity integration; credentials managed manually.',
            'Some SSO setup; limited access segmentation.',
            'Unity Catalog or SCIM integrated; basic role-based model.',
            'Fine-grained ABAC and table ACLs; access managed centrally.',
            'Enterprise-wide zero-trust model, federated IDP, cross-workspace governance.'
          ]
        },
        {
          name: 'Governance & Compliance',
          levels: [
            'No cataloging or lineage; ad-hoc data ownership.',
            'Manual tagging of assets; limited data stewardship.',
            'Unity Catalog used for governed access and auditing.',
            'Data lineage & classification automated; compliance reports generated.',
            'Policy-as-code and regulatory alignment (HIPAA, HITRUST, GDPR) continuously enforced.'
          ]
        },
        {
          name: 'Observability & Monitoring',
          levels: [
            'Manual job checks; no proactive monitoring.',
            'Basic dashboards for cluster utilization and costs.',
            'Centralized monitoring via Lakehouse Monitoring or MLflow tracking.',
            'Alerting, anomaly detection, and audit dashboards established.',
            'Predictive monitoring; auto-remediation and FinOps optimization integrated.'
          ]
        },
        {
          name: 'Cost Management',
          levels: [
            'Limited visibility into compute costs.',
            'Initial cost tagging per workspace.',
            'Cost dashboards established via SQL & budgets.',
            'Automated job tagging, alerts, and resource scaling.',
            'Unit-economics cost governance integrated with chargeback models.'
          ]
        }
      ]
    },
    {
      id: 'matrix-2',
      title: '2. Data Engineering & Integration',
      color: '#3b82f6',
      bgColor: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      dimensions: [
        {
          name: 'Ingestion Strategy',
          levels: [
            'Manual file uploads; no pipelines.',
            'Initial DLT or Spark ingestion jobs built.',
            'Batch ingestion standardized; CDC evaluated.',
            'LakeFlow Connect / Auto Loader pipelines operationalized.',
            'Event-driven, declarative ingestion with quality SLAs and lineage tracking.'
          ]
        },
        {
          name: 'Lakehouse Architecture',
          levels: [
            'Traditional staging/curated zones without Delta format.',
            'Partial adoption of Delta tables.',
            'Delta Lake adopted; schema enforcement in place.',
            'Multi-hop Delta pipelines standardized.',
            'Delta Universal Format across clouds; unified batch + streaming.'
          ]
        },
        {
          name: 'Pipeline Orchestration',
          levels: [
            'Manual scheduling.',
            'Use of notebooks or cron-based triggers.',
            'Workflows adopted; dependencies defined.',
            'DLT pipelines or Job Workflows modularized.',
            'Fully declarative orchestration with GitOps integration.'
          ]
        },
        {
          name: 'Data Quality',
          levels: [
            'Quality handled manually.',
            'Basic checks via SQL queries.',
            'Expectations defined within pipelines.',
            'Data quality rules embedded in DLT expectations.',
            'Centralized quality registry with continuous validation and auto-healing.'
          ]
        },
        {
          name: 'Performance & Scalability',
          levels: [
            'Manual tuning; performance bottlenecks common.',
            'Initial optimization of cluster configs.',
            'Delta optimization and Z-ordering practices established.',
            'Serverless compute adoption for elasticity.',
            'Adaptive performance tuning using AI-driven optimization.'
          ]
        }
      ]
    },
    {
      id: 'matrix-3',
      title: '3. Analytics & BI',
      color: '#10b981',
      bgColor: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      dimensions: [
        {
          name: 'Query Performance',
          levels: [
            'Reports slow and inconsistent.',
            'Some caching and Z-ordering.',
            'Query optimization and caching policies established.',
            'DBSQL Serverless adopted for BI workloads.',
            'Predictive query optimization across semantic layers.'
          ]
        },
        {
          name: 'Data Modeling',
          levels: [
            'Flat tables; no standard semantic model.',
            'Ad-hoc star schemas built.',
            'Business layer modeled in Delta Live Tables.',
            'Reusable models deployed in Unity Catalog.',
            'Enterprise-wide semantic layer (AI/BI Genie) unified across org.'
          ]
        },
        {
          name: 'Visualization & Reporting',
          levels: [
            'Isolated dashboards.',
            'Experimentation with DBSQL or Power BI connectors.',
            'Standardized BI dashboards in DBSQL.',
            'AI-powered insights via Genie and SQL Functions.',
            'Self-service AI BI embedded across business workflows.'
          ]
        },
        {
          name: 'Self-Service Enablement',
          levels: [
            'Analysts rely on IT.',
            'Limited data marts exposed.',
            'Governed datasets shared with business users.',
            'Metadata-driven self-service analytics enabled.',
            'Fully democratized data access with natural language interface.'
          ]
        },
        {
          name: 'Collaboration & Sharing',
          levels: [
            'Static exports.',
            'BI tools connected via ODBC/JDBC.',
            'Unity Catalog Shares for internal use.',
            'Delta Sharing adopted for partners.',
            'Cross-organization sharing automated with audit trails.'
          ]
        }
      ]
    },
    {
      id: 'matrix-4',
      title: '4. Machine Learning & MLOps',
      color: '#dc2626',
      bgColor: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
      dimensions: [
        {
          name: 'Experimentation & Tracking',
          levels: [
            'Local training; no versioning.',
            'MLflow manually used.',
            'MLflow integrated across teams.',
            'CI/CD pipelines automate model registration.',
            'Full model lineage and reproducibility across org.'
          ]
        },
        {
          name: 'Model Deployment',
          levels: [
            'Ad-hoc APIs.',
            'Model serving tested manually.',
            'Model Serving endpoints created.',
            'Blue-green deployment & rollback supported.',
            'Unified model registry serving across multi-clouds.'
          ]
        },
        {
          name: 'Feature Management',
          levels: [
            'Features embedded in code.',
            'Shared tables used inconsistently.',
            'Feature Store adopted.',
            'Automated feature computation & reuse.',
            'Global feature registry integrated with vector DB.'
          ]
        },
        {
          name: 'ML Lifecycle Governance',
          levels: [
            'No tracking of approvals.',
            'Manual documentation.',
            'Approval workflows in place.',
            'Model cards and bias monitoring automated.',
            'Responsible AI policy integrated with regulatory reporting.'
          ]
        },
        {
          name: 'Business Impact',
          levels: [
            'No linkage to outcomes.',
            'Ad-hoc success stories.',
            'ML KPIs tracked manually.',
            'ROI dashboards for deployed models.',
            'Predictive ROI insights driving business roadmaps.'
          ]
        }
      ]
    },
    {
      id: 'matrix-5',
      title: '5. Generative AI & Agentic Capabilities',
      color: '#8b5cf6',
      bgColor: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      dimensions: [
        {
          name: 'GenAI Strategy',
          levels: [
            'No defined vision for GenAI.',
            'Exploratory pilots using external APIs.',
            'GenAI roadmap defined for select use cases.',
            'Enterprise-wide GenAI enablement framework.',
            'AI fabric embedded in business workflows.'
          ]
        },
        {
          name: 'Data & Knowledge Readiness',
          levels: [
            'Unstructured data unindexed.',
            'Some embeddings experimentation.',
            'Knowledge base indexed via Vector Search.',
            'Multi-source vector federation and caching.',
            'Continuous embedding refresh integrated into pipelines.'
          ]
        },
        {
          name: 'Application Development',
          levels: [
            'PoC chatbots or notebooks.',
            'Simple GenAI apps built with SDKs.',
            'Apps operationalized using Databricks Apps.',
            'Multi-agent orchestration using AI Gateway.',
            'Full enterprise agent network orchestrating workflows.'
          ]
        },
        {
          name: 'Evaluation & Quality Control',
          levels: [
            'No eval metrics for AI output.',
            'Manual qualitative review.',
            'Prompt testing via evaluation sets.',
            'Automated red-teaming and telemetry dashboards.',
            'Continuous evaluation and reward-based fine-tuning.'
          ]
        },
        {
          name: 'Responsible AI',
          levels: [
            'No AI ethics policy.',
            'Awareness of risks.',
            'Responsible AI charter drafted.',
            'AI governance integrated in SDLC.',
            'Responsible AI assurance certified for all apps.'
          ]
        }
      ]
    },
    {
      id: 'matrix-6',
      title: '6. Operational Excellence & Adoption',
      color: '#64748b',
      bgColor: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
      dimensions: [
        {
          name: 'Center of Excellence',
          levels: [
            'No formal CoE.',
            'Small champion group formed.',
            'CoE structure defined with leads.',
            'Cross-BU CoE driving enablement.',
            'Enterprise-wide innovation CoE with OKRs and KPIs.'
          ]
        },
        {
          name: 'Community of Practice',
          levels: [
            'No collaboration forum.',
            'Informal Slack/Teams groups.',
            'Structured sessions established.',
            'Regular showcases and knowledge sharing.',
            'Community-driven innovation pipeline.'
          ]
        },
        {
          name: 'Training & Enablement',
          levels: [
            'Ad-hoc trainings.',
            'Some onboarding materials.',
            'Structured Databricks Academy program.',
            'Role-based enablement pathways.',
            'Continuous learning ecosystem with AI-powered skill tracking.'
          ]
        },
        {
          name: 'Financial Management',
          levels: [
            'No tracking of ROI.',
            'Basic spend visibility.',
            'FinOps dashboarding in SQL.',
            'Automated chargeback model.',
            'Predictive cost governance using AI insights.'
          ]
        },
        {
          name: 'Innovation & Improvement',
          levels: [
            'No feedback loops.',
            'Occasional retrospectives.',
            'Systematic feedback captured.',
            'KPI-driven continuous improvement loops.',
            'Embedded culture of innovation; continuous process optimization.'
          ]
        }
      ]
    }
  ]);

  const handleAdd = (type) => {
    console.log('Add button clicked:', type);
    setModalType(type);
    setEditingItem(null);
    // Set default values including a default icon
    const defaultFormData = {
      icon: '🎯',
      borderColor: '#3b82f6'
    };
    
    // Add default description for scenarios
    if (type === 'scenario') {
      defaultFormData.description = `Explore: Disparate workspaces; no visibility.
Experiment: Uncoordinated clusters and governance gaps.
Formalize: Central workspace registry; minimal identity integration.
Optimize: Unified catalog and FinOps tagging.
Transform: Fully governed multi-domain Lakehouse with automation.`;
    }
    
    setFormData(defaultFormData);
    setModalOpen(true);
  };

  const handleEdit = (type, item) => {
    console.log('Edit button clicked:', type, item);
    setModalType(type);
    setEditingItem(item);
    
    // Map item data to form data based on type
    if (type === 'objective') {
      setFormData(item);
    } else if (type === 'category') {
      setFormData({
        title: item.title,
        description: item.description
      });
    } else if (type === 'sub-category') {
      setFormData({
        title: item.name || '',
        description: item.letter || ''
      });
    } else if (type === 'success plan') {
      setFormData({
        title: item.category,
        description: '',
        borderColor: item.color
      });
    } else if (type === 'plan-need') {
      setFormData({
        title: 'Need',
        description: item.plan.need
      });
    } else if (type === 'plan-activities') {
      setFormData({
        title: 'Activities',
        description: item.plan.activities.join('\n')
      });
    } else if (type === 'plan-outcome') {
      setFormData({
        title: 'Outcome',
        description: item.plan.outcome
      });
    } else if (type === 'activity-item') {
      setFormData({
        title: `Activity ${item.index + 1}`,
        description: item.activity
      });
    } else if (type === 'approach-item') {
      setFormData({
        title: `Approach ${item.index + 1}`,
        description: item.item
      });
    } else if (type === 'engagement plan') {
      setFormData({
        title: item.time || '',
        description: item.engagement || '',
        content: item.focusArea || ''
      });
    } else if (type === 'scenario') {
      setFormData({
        title: item.title,
        description: item.scenario
      });
    } else if (type === 'analysis') {
      setFormData({
        title: item.title,
        description: item.stages?.[0]?.description || ''
      });
    } else if (type === 'stage') {
      setFormData({
        title: item.stage || '',
        description: item.description || '',
        tools: item.tools || '',
        content: item.tools || '' // For backwards compatibility
      });
    } else if (type === 'maturity matrix') {
      setFormData({
        title: item.title,
        description: item.dimensions?.[0]?.dimension || ''
      });
    } else if (type === 'cell') {
      setFormData({
        title: `${item.dimension.name} - Level ${item.levelIdx + 1}`,
        description: item.content || ''
      });
    } else {
      setFormData(item);
    }
    
    setModalOpen(true);
  };

  const handleDelete = (type, itemId) => {
    console.log('Delete button clicked:', type, itemId);
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    if (type === 'objective') {
      setObjectives(prev => prev.filter(obj => obj.id !== itemId));
      
    } else if (type === 'category') {
      setCategories(prev => prev.filter(cat => cat.id !== itemId));
      
    } else if (type === 'sub-category') {
      // Delete sub-category from its parent category
      if (itemId.subCat && itemId.categoryId) {
        setCategories(prev => prev.map(cat => {
          if (cat.id === itemId.categoryId) {
            return {
              ...cat,
              subCategories: cat.subCategories.filter(sc => sc.letter !== itemId.subCat.letter)
            };
          }
          return cat;
        }));
        
      }
    } else if (type === 'success plan') {
      setTechnicalSuccessPlan(prev => prev.filter(item => item.id !== itemId));
      
    } else if (type === 'plan-need') {
      setTechnicalSuccessPlan(prev => prev.map(plan => 
        plan.id === itemId.planId ? { ...plan, need: '' } : plan
      ));
      
    } else if (type === 'plan-activities') {
      setTechnicalSuccessPlan(prev => prev.map(plan => 
        plan.id === itemId.planId ? { ...plan, activities: [] } : plan
      ));
      
    } else if (type === 'plan-outcome') {
      setTechnicalSuccessPlan(prev => prev.map(plan => 
        plan.id === itemId.planId ? { ...plan, outcome: '' } : plan
      ));
      
    } else if (type === 'activity-item') {
      setTechnicalSuccessPlan(prev => prev.map(plan => 
        plan.id === itemId.planId 
          ? { ...plan, activities: plan.activities.filter((_, idx) => idx !== itemId.index) } 
          : plan
      ));
      
    } else if (type === 'approach-item') {
      setEngagementScenarios(prev => prev.map(scenario => 
        scenario.id === itemId.scenarioId 
          ? { ...scenario, approach: scenario.approach.filter((_, idx) => idx !== itemId.index) } 
          : scenario
      ));
      
    } else if (type === 'engagement plan') {
      setEngagementPlan(prev => prev.filter(item => item.id !== itemId));
      
    } else if (type === 'scenario') {
      setEngagementScenarios(prev => prev.filter(item => item.id !== itemId));
      
    } else if (type === 'analysis') {
      setAnalysisActions(prev => prev.filter(item => item.id !== itemId));
      
    } else if (type === 'maturity matrix') {
      setMaturityMatrices(prev => prev.filter(item => item.id !== itemId));
      
    } else if (type === 'cell') {
      setMaturityMatrices(prev => prev.map(matrix => 
        matrix.id === itemId.matrixId 
          ? {
              ...matrix,
              dimensions: matrix.dimensions.map((dim, idx) => 
                idx === itemId.dimIdx 
                  ? {
                      ...dim,
                      levels: dim.levels.map((level, levelIdx) => 
                        levelIdx === itemId.levelIdx ? '' : level
                      )
                    }
                  : dim
              )
            }
          : matrix
      ));
      
    }
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    
    if (modalType === 'objective') {
      if (editingItem) {
        // Edit existing
        setObjectives(prev => prev.map(obj => 
          obj.id === editingItem.id ? { ...formData, id: editingItem.id } : obj
        ));
        
      } else {
        // Add new
        const newObjective = {
          ...formData,
          id: `obj-${Date.now()}`,
          borderColor: formData.borderColor || '#3b82f6',
          width: null,
          height: null
        };
        setObjectives(prev => [...prev, newObjective]);
        
      }
    } else if (modalType === 'category') {
      if (editingItem) {
        // Edit existing category - preserve existing fields
        setCategories(prev => prev.map(cat => 
          cat.id === editingItem.id 
            ? { 
                ...cat,
                label: formData.title.toUpperCase(),
                title: formData.title,
                description: formData.description
              } 
            : cat
        ));
        
      } else {
        // Add new category
        const colors = ['#f97316', '#3b82f6', '#10b981', '#dc2626', '#8b5cf6', '#64748b', '#ec4899', '#f59e0b'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        const newCategory = {
          id: `cat-${Date.now()}`,
          label: formData.title.toUpperCase(),
          title: formData.title,
          color: randomColor,
          bgColor: `linear-gradient(135deg, ${randomColor} 0%, ${randomColor}dd 100%)`,
          subCategories: [],
          description: formData.description
        };
        setCategories(prev => [...prev, newCategory]);
        
      }
    } else if (modalType === 'success plan') {
      if (editingItem) {
        setTechnicalSuccessPlan(prev => prev.map(item => 
          item.id === editingItem.id 
            ? { ...item, category: formData.title, color: formData.borderColor || item.color }
            : item
        ));
        
      } else {
        const colors = ['#f97316', '#3b82f6', '#10b981', '#dc2626', '#8b5cf6', '#c2185b'];
        const newItem = {
          id: `tsp-${Date.now()}`,
          category: formData.title,
          color: formData.borderColor || colors[Math.floor(Math.random() * colors.length)],
          need: formData.description || '',
          activities: [],
          outcome: ''
        };
        setTechnicalSuccessPlan(prev => [...prev, newItem]);
        
      }
    } else if (modalType === 'plan-need') {
      setTechnicalSuccessPlan(prev => prev.map(plan => 
        plan.id === editingItem.plan.id 
          ? { ...plan, need: formData.description }
          : plan
      ));
      
    } else if (modalType === 'plan-activities') {
      const activitiesArray = formData.description.split('\n').filter(line => line.trim() !== '');
      setTechnicalSuccessPlan(prev => prev.map(plan => 
        plan.id === editingItem.plan.id 
          ? { ...plan, activities: activitiesArray }
          : plan
      ));
      
    } else if (modalType === 'plan-outcome') {
      setTechnicalSuccessPlan(prev => prev.map(plan => 
        plan.id === editingItem.plan.id 
          ? { ...plan, outcome: formData.description }
          : plan
      ));
      
    } else if (modalType === 'activity-item') {
      setTechnicalSuccessPlan(prev => prev.map(plan => 
        plan.id === editingItem.plan.id 
          ? { 
              ...plan, 
              activities: plan.activities.map((act, idx) => 
                idx === editingItem.index ? formData.description : act
              )
            }
          : plan
      ));
      
    } else if (modalType === 'approach-item') {
      setEngagementScenarios(prev => prev.map(scenario => 
        scenario.id === editingItem.scenario.id 
          ? { 
              ...scenario, 
              approach: scenario.approach.map((item, idx) => 
                idx === editingItem.index ? formData.description : item
              )
            }
          : scenario
      ));
      
    } else if (modalType === 'engagement plan') {
      if (editingItem) {
        setEngagementPlan(prev => prev.map(item => 
          item.id === editingItem.id 
            ? { ...item, time: formData.title, engagement: formData.description || '', focusArea: formData.content || '' }
            : item
        ));
        
      } else {
        const newItem = {
          id: `ep-${Date.now()}`,
          time: formData.title || 'TBD',
          engagement: formData.description || '',
          focusArea: formData.content || ''
        };
        setEngagementPlan(prev => [...prev, newItem]);
        
      }
    } else if (modalType === 'scenario') {
      if (editingItem) {
        setEngagementScenarios(prev => prev.map(item => 
          item.id === editingItem.id 
            ? { ...item, title: formData.title, scenario: formData.description, approach: [] }
            : item
        ));
        
      } else {
        const colors = ['#f97316', '#3b82f6', '#10b981', '#dc2626', '#8b5cf6'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const newItem = {
          id: `scenario-${Date.now()}`,
          title: formData.title,
          color: randomColor,
          bgColor: `linear-gradient(135deg, ${randomColor} 0%, ${randomColor}dd 100%)`,
          scenario: formData.description,
          approach: []
        };
        setEngagementScenarios(prev => [...prev, newItem]);
        
      }
    } else if (modalType === 'analysis') {
      if (editingItem) {
        setAnalysisActions(prev => prev.map(item => 
          item.id === editingItem.id 
            ? { ...item, title: formData.title, stages: [] }
            : item
        ));
        
      } else {
        const colors = ['#f97316', '#3b82f6', '#10b981', '#dc2626', '#8b5cf6', '#64748b'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const newItem = {
          id: `aa-${Date.now()}`,
          title: formData.title,
          color: randomColor,
          bgColor: `linear-gradient(135deg, ${randomColor} 0%, ${randomColor}dd 100%)`,
          stages: []
        };
        setAnalysisActions(prev => [...prev, newItem]);
        
      }
    } else if (modalType === 'stage') {
      setAnalysisActions(prev => prev.map(analysis => 
        analysis.id === editingItem.analysisId 
          ? {
              ...analysis,
              levels: analysis.levels.map(level => 
                level.stage === editingItem.stage
                  ? {
                      stage: formData.title,
                      description: formData.description,
                      tools: formData.tools || formData.content || ''
                    }
                  : level
              )
            }
          : analysis
      ));
      
    } else if (modalType === 'maturity matrix') {
      if (editingItem) {
        setMaturityMatrices(prev => prev.map(item => 
          item.id === editingItem.id 
            ? { ...item, title: formData.title, dimensions: [] }
            : item
        ));
        
      } else {
        const colors = ['#f97316', '#3b82f6', '#10b981', '#dc2626', '#8b5cf6', '#64748b'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const newItem = {
          id: `matrix-${Date.now()}`,
          title: formData.title,
          color: randomColor,
          bgColor: `linear-gradient(135deg, ${randomColor} 0%, ${randomColor}dd 100%)`,
          dimensions: []
        };
        setMaturityMatrices(prev => [...prev, newItem]);
        
      }
    } else if (modalType === 'cell') {
      setMaturityMatrices(prev => prev.map(matrix => 
        matrix.id === editingItem.matrix.id 
          ? {
              ...matrix,
              dimensions: matrix.dimensions.map((dim, idx) => 
                idx === editingItem.dimIdx 
                  ? {
                      ...dim,
                      levels: dim.levels.map((level, levelIdx) => 
                        levelIdx === editingItem.levelIdx ? formData.description : level
                      )
                    }
                  : dim
              )
            }
          : matrix
      ));
      
    } else {
      // Fallback for any other types
      const itemName = modalType.charAt(0).toUpperCase() + modalType.slice(1);
      
      console.log(`${modalType} data:`, formData);
    }
    
    setModalOpen(false);
    setEditingItem(null);
    setFormData({});
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Render section controls (up/down arrows)
  const renderSectionControls = (sectionId, sectionName) => {
    const currentIndex = sectionOrder.indexOf(sectionId);
    const isFirst = currentIndex === 0;
    const isLast = currentIndex === sectionOrder.length - 1;

    return (
      <SectionControls>
        <ReorderButton
          onClick={() => moveSectionUp(sectionId)}
          disabled={isFirst}
          whileHover={{ scale: isFirst ? 1 : 1.05 }}
          whileTap={{ scale: isFirst ? 1 : 0.95 }}
          title={isFirst ? "Already at top" : `Move ${sectionName} up`}
        >
          <FiArrowUp size={18} />
        </ReorderButton>
        <ReorderButton
          onClick={() => moveSectionDown(sectionId)}
          disabled={isLast}
          whileHover={{ scale: isLast ? 1 : 1.05 }}
          whileTap={{ scale: isLast ? 1 : 0.95 }}
          title={isLast ? "Already at bottom" : `Move ${sectionName} down`}
        >
          <FiArrowDown size={18} />
        </ReorderButton>
      </SectionControls>
    );
  };


  // Helper function to render slide content for print
  const renderSlideContentForPrint = (slide) => {
    // Strategic Objectives
    if (slide.id === 'objectives') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'center', height: '100%' }}>
          {objectives.map((obj) => (
            <div key={obj.id} style={{ 
              background: 'white',
              borderRadius: '10px',
              border: `2px solid ${obj.borderColor}`,
              padding: '18px 20px',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)'
            }}>
              <div style={{ 
                display: 'flex',
                alignItems: 'center',
                marginBottom: '12px',
                paddingBottom: '10px',
                borderBottom: `2px solid ${obj.borderColor}`
              }}>
                <span style={{ fontSize: '1.8rem', marginRight: '14px' }}>{obj.icon}</span>
                <h3 style={{ 
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: '#1e293b',
                  margin: 0
                }}>
                  {obj.title}
                </h3>
              </div>
              <div style={{ 
                fontSize: '1.05rem',
                lineHeight: '1.5',
                color: '#475569'
              }}>
                {obj.content || 'No content available'}
              </div>
            </div>
          ))}
        </div>
      );
    }
    
    // Categories Part 1
    if (slide.id === 'categories-1') {
      return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {categories.slice(0, 3).map((cat) => (
            <div key={cat.id} style={{ 
              background: 'white', 
              borderRadius: '12px', 
              padding: '16px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
            }}>
              <div style={{ 
                background: cat.bgColor, 
                color: 'white', 
                padding: '16px', 
                borderRadius: '12px 12px 0 0',
                marginBottom: '12px',
                marginTop: '-16px',
                marginLeft: '-16px',
                marginRight: '-16px'
              }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '8px', textTransform: 'uppercase' }}>
                  {cat.label}
                </div>
                <h4 style={{ color: 'white', marginBottom: '8px', fontSize: '1.1rem', fontWeight: 700 }}>{cat.title}</h4>
                <p style={{ fontSize: '0.9rem', opacity: 1, lineHeight: '1.4', color: 'rgba(255, 255, 255, 0.95)' }}>{cat.description}</p>
              </div>
              <div>
                {cat.subCategories && cat.subCategories.map((subCat, idx) => (
                  <div key={idx} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px', 
                    padding: '8px 0',
                    borderBottom: idx < cat.subCategories.length - 1 ? '1px solid #e2e8f0' : 'none'
                  }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '6px',
                      background: cat.bgColor,
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '1rem',
                      flexShrink: 0
                    }}>
                      {subCat.letter}
                    </div>
                    <div style={{ 
                      fontSize: '1rem', 
                      color: '#1e293b',
                      fontWeight: 600,
                      flex: 1,
                      lineHeight: '1.3'
                    }}>
                      {subCat.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    }
    
    // Categories Part 2
    if (slide.id === 'categories-2') {
      return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {categories.slice(3, 6).map((cat) => (
            <div key={cat.id} style={{ 
              background: 'white', 
              borderRadius: '12px', 
              padding: '16px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
            }}>
              <div style={{ 
                background: cat.bgColor, 
                color: 'white', 
                padding: '16px', 
                borderRadius: '12px 12px 0 0',
                marginBottom: '12px',
                marginTop: '-16px',
                marginLeft: '-16px',
                marginRight: '-16px'
              }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '8px', textTransform: 'uppercase' }}>
                  {cat.label}
                </div>
                <h4 style={{ color: 'white', marginBottom: '8px', fontSize: '1.1rem', fontWeight: 700 }}>{cat.title}</h4>
                <p style={{ fontSize: '0.9rem', opacity: 1, lineHeight: '1.4', color: 'rgba(255, 255, 255, 0.95)' }}>{cat.description}</p>
              </div>
              <div>
                {cat.subCategories && cat.subCategories.map((subCat, idx) => (
                  <div key={idx} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px', 
                    padding: '8px 0',
                    borderBottom: idx < cat.subCategories.length - 1 ? '1px solid #e2e8f0' : 'none'
                  }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '6px',
                      background: cat.bgColor,
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '1rem',
                      flexShrink: 0
                    }}>
                      {subCat.letter}
                    </div>
                    <div style={{ 
                      fontSize: '1rem', 
                      color: '#1e293b',
                      fontWeight: 600,
                      flex: 1,
                      lineHeight: '1.3'
                    }}>
                      {subCat.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    }
    
    // Technical Success Plan Part 1
    if (slide.id === 'success-plan-1') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {technicalSuccessPlan.slice(0, 3).map((item) => (
            <div key={item.id} style={{
              background: 'rgba(255, 255, 255, 0.95)',
              padding: '0',
              borderLeft: `4px solid ${item.color}`,
              overflow: 'hidden'
            }}>
              <div style={{
                background: item.color,
                color: 'white',
                padding: '16px 20px',
                fontSize: '1.1rem',
                fontWeight: 700
              }}>
                {item.category}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '20px', padding: '20px' }}>
                <div>
                  <h4 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#6b7280', marginBottom: '10px' }}>
                    NEEDS
                  </h4>
                  <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>{item.need}</p>
                </div>
                <div>
                  <h4 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#6b7280', marginBottom: '10px' }}>
                    ACTIVITIES
                  </h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {item.activities.map((activity, idx) => (
                      <li key={idx} style={{ color: '#475569', fontSize: '0.9rem', lineHeight: '1.5', padding: '4px 0', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                        <span style={{ color: item.color, fontWeight: 700, fontSize: '1.1rem' }}>•</span>
                        <span>{activity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#6b7280', marginBottom: '10px' }}>
                    OUTCOME
                  </h4>
                  <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>{item.outcome}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Technical Success Plan Part 2
    if (slide.id === 'success-plan-2') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {technicalSuccessPlan.slice(3, 6).map((item) => (
            <div key={item.id} style={{
              background: 'rgba(255, 255, 255, 0.95)',
              padding: '0',
              border: `3px solid ${item.color}`,
              borderRadius: '10px',
              overflow: 'hidden'
            }}>
              <div style={{
                background: item.color,
                color: 'white',
                padding: 'clamp(8px, 1.2vh, 16px) clamp(12px, 1.5vw, 20px)',
                fontSize: 'clamp(1rem, 1.3vw, 1.5rem)',
                fontWeight: 700
              }}>
                {item.category}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: 'clamp(12px, 1.5vw, 20px)', padding: 'clamp(12px, 1.5vw, 20px)' }}>
                <div>
                  <h4 style={{ fontSize: 'clamp(0.7rem, 0.8vw, 1rem)', fontWeight: 700, textTransform: 'uppercase', color: '#6b7280', marginBottom: 'clamp(6px, 0.8vh, 10px)' }}>
                    NEEDS
                  </h4>
                  <p style={{ color: '#475569', fontSize: 'clamp(0.75rem, 0.85vw, 1rem)', lineHeight: '1.5', margin: 0 }}>{item.need}</p>
                </div>
                <div>
                  <h4 style={{ fontSize: 'clamp(0.7rem, 0.8vw, 1rem)', fontWeight: 700, textTransform: 'uppercase', color: '#6b7280', marginBottom: 'clamp(6px, 0.8vh, 10px)' }}>
                    ACTIVITIES
                  </h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {item.activities.map((activity, idx) => (
                      <li key={idx} style={{ color: '#475569', fontSize: 'clamp(0.75rem, 0.85vw, 1rem)', lineHeight: '1.5', padding: '4px 0', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                        <span style={{ color: item.color, fontWeight: 700, fontSize: 'clamp(0.9rem, 1vw, 1.2rem)' }}>•</span>
                        <span>{activity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 style={{ fontSize: 'clamp(0.7rem, 0.8vw, 1rem)', fontWeight: 700, textTransform: 'uppercase', color: '#6b7280', marginBottom: 'clamp(6px, 0.8vh, 10px)' }}>
                    OUTCOME
                  </h4>
                  <p style={{ color: '#475569', fontSize: 'clamp(0.75rem, 0.85vw, 1rem)', lineHeight: '1.5', margin: 0 }}>{item.outcome}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Engagement Plan
    if (slide.id === 'engagement-plan') {
      return (
        <div style={{ background: 'rgba(255, 255, 255, 0.95)', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr 1fr', borderBottom: '1px solid #e5e7eb', background: '#f9fafb' }}>
            <div style={{ padding: '16px', fontWeight: 700, fontSize: '0.9rem', color: '#1e293b', textAlign: 'center' }}>TIMELINE</div>
            <div style={{ padding: '16px', fontWeight: 700, fontSize: '0.9rem', color: '#1e293b', borderLeft: '1px solid #e5e7eb' }}>ENGAGEMENT</div>
            <div style={{ padding: '16px', fontWeight: 700, fontSize: '0.9rem', color: '#1e293b', borderLeft: '1px solid #e5e7eb' }}>FOCUS AREA</div>
          </div>
          {engagementPlan.map((item, idx) => (
            <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '150px 1fr 1fr', borderBottom: idx < engagementPlan.length - 1 ? '1px solid #e5e7eb' : 'none', transition: 'all 0.2s' }}>
              <div style={{ padding: '16px', background: '#fef3c7', fontWeight: 700, fontSize: '0.9rem', color: '#92400e', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.time}</div>
              <div style={{ padding: '16px', fontSize: '0.9rem', color: '#1e293b', lineHeight: '1.5', borderLeft: '1px solid #e5e7eb', display: 'flex', alignItems: 'center' }}>{item.engagement}</div>
              <div style={{ padding: '16px', fontSize: '0.9rem', color: '#64748b', lineHeight: '1.5', borderLeft: '1px solid #e5e7eb', display: 'flex', alignItems: 'center' }}>{item.focusArea}</div>
            </div>
          ))}
        </div>
      );
    }

    // Analysis & Actions Part 1
    if (slide.id === 'analysis-1') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {analysisActions.slice(0, 3).map((item) => (
            <div key={item.id} style={{ marginBottom: '0' }}>
              <div style={{
                background: item.bgColor,
                color: 'white',
                padding: '8px 14px',
                fontWeight: 700,
                fontSize: '1.2rem',
                borderRadius: '8px 8px 0 0',
                border: `2px solid ${item.color}`,
                borderBottom: 'none'
              }}>
                {item.title}
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: '4px',
                padding: '8px',
                background: 'white',
                border: `2px solid ${item.color}`,
                borderTop: 'none',
                borderRadius: '0 0 8px 8px'
              }}>
                {item.levels && item.levels.map((level, idx) => (
                  <div key={idx} style={{
                    background: '#f8fafc',
                    borderRadius: '6px',
                    padding: '6px',
                    border: `1px solid ${item.color}30`
                  }}>
                    <div style={{
                      fontWeight: 700,
                      color: item.color,
                      marginBottom: '3px',
                      fontSize: '1rem'
                    }}>
                      {level.stage}
                    </div>
                    <div style={{
                      fontSize: '0.8rem',
                      color: '#475569',
                      lineHeight: '1.35',
                      marginBottom: '3px'
                    }}>
                      {level.description}
                    </div>
                    <div style={{
                      fontSize: '0.72rem',
                      color: '#64748b',
                      lineHeight: '1.3'
                    }}>
                      <strong>Helpful Tools:</strong> {level.tools}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Analysis & Actions Part 2
    if (slide.id === 'analysis-2') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {analysisActions.slice(3, 6).map((item) => (
            <div key={item.id} style={{ marginBottom: '0' }}>
              <div style={{
                background: item.bgColor,
                color: 'white',
                padding: '8px 14px',
                fontWeight: 700,
                fontSize: '1.2rem',
                borderRadius: '8px 8px 0 0',
                border: `2px solid ${item.color}`,
                borderBottom: 'none'
              }}>
                {item.title}
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: '4px',
                padding: '8px',
                background: 'white',
                border: `2px solid ${item.color}`,
                borderTop: 'none',
                borderRadius: '0 0 8px 8px'
              }}>
                {item.levels && item.levels.map((level, idx) => (
                  <div key={idx} style={{
                    background: '#f8fafc',
                    borderRadius: '6px',
                    padding: '6px',
                    border: `1px solid ${item.color}30`
                  }}>
                    <div style={{
                      fontWeight: 700,
                      color: item.color,
                      marginBottom: '3px',
                      fontSize: '1rem'
                    }}>
                      {level.stage}
                    </div>
                    <div style={{
                      fontSize: '0.8rem',
                      color: '#475569',
                      lineHeight: '1.35',
                      marginBottom: '3px'
                    }}>
                      {level.description}
                    </div>
                    <div style={{
                      fontSize: '0.72rem',
                      color: '#64748b',
                      lineHeight: '1.3'
                    }}>
                      <strong>Helpful Tools:</strong> {level.tools}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Customer Engagement Scenarios
    if (slide.id === 'scenarios') {
      return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
          {engagementScenarios.slice(0, 4).map((scenario) => (
            <div key={scenario.id} style={{ background: 'rgba(255, 255, 255, 0.95)', padding: '0', overflow: 'hidden', borderLeft: `4px solid ${scenario.color}` }}>
              <div style={{ background: scenario.bgColor, color: 'white', padding: '16px', fontWeight: 700, fontSize: '1rem' }}>{scenario.title}</div>
              <div style={{ padding: '16px' }}>
                <div style={{ fontSize: '0.85rem', color: '#475569', lineHeight: '1.5', marginBottom: '12px' }}>{scenario.scenario}</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#6b7280', marginBottom: '8px' }}>KEY ACTIONS</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {scenario.approach.slice(0, 3).map((action, idx) => (
                    <li key={idx} style={{ fontSize: '0.8rem', color: '#475569', lineHeight: '1.4', padding: '4px 0', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                      <span style={{ color: scenario.color, fontWeight: 700, fontSize: '1rem' }}>•</span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Maturity matrices slides (6 pillars)
    if (slide.id.startsWith('matrices-')) {
      const matrixIndex = parseInt(slide.id.split('-')[1]) - 1;
      const matrix = maturityMatrices[matrixIndex];
      
      if (!matrix) return <div>No data</div>;

      return (
        <div style={{ background: 'rgba(255, 255, 255, 0.95)', padding: '20px', maxWidth: '100%', overflow: 'hidden', boxSizing: 'border-box' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: matrix.color, marginBottom: '20px', margin: '0 0 20px 0' }}>{matrix.title}</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem', tableLayout: 'fixed' }}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                <th style={{ padding: '8px', textAlign: 'left', fontWeight: 700, color: '#1e293b', border: '1px solid #e5e7eb', width: '18%', wordWrap: 'break-word' }}>Dimension</th>
                <th style={{ padding: '8px', textAlign: 'center', fontWeight: 700, color: '#1e293b', border: '1px solid #e5e7eb', fontSize: '0.7rem', wordWrap: 'break-word' }}>1. Explore</th>
                <th style={{ padding: '8px', textAlign: 'center', fontWeight: 700, color: '#1e293b', border: '1px solid #e5e7eb', fontSize: '0.7rem', wordWrap: 'break-word' }}>2. Experiment</th>
                <th style={{ padding: '8px', textAlign: 'center', fontWeight: 700, color: '#1e293b', border: '1px solid #e5e7eb', fontSize: '0.7rem', wordWrap: 'break-word' }}>3. Formalize</th>
                <th style={{ padding: '8px', textAlign: 'center', fontWeight: 700, color: '#1e293b', border: '1px solid #e5e7eb', fontSize: '0.7rem', wordWrap: 'break-word' }}>4. Optimize</th>
                <th style={{ padding: '8px', textAlign: 'center', fontWeight: 700, color: '#1e293b', border: '1px solid #e5e7eb', fontSize: '0.7rem', wordWrap: 'break-word' }}>5. Transform</th>
              </tr>
            </thead>
            <tbody>
              {matrix.dimensions.map((dim, idx) => (
                <tr key={idx}>
                  <td style={{ padding: '8px', fontWeight: 600, color: matrix.color, border: '1px solid #e5e7eb', background: '#f9fafb', wordWrap: 'break-word', fontSize: '0.75rem' }}>{dim.name}</td>
                  {dim.levels.map((level, levelIdx) => (
                    <td key={levelIdx} style={{ padding: '8px', color: '#475569', lineHeight: '1.3', border: '1px solid #e5e7eb', verticalAlign: 'top', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                      {level}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    // Thank You slide
    if (slide.id === 'thank-you') {
      return (
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '60px',
          gap: '30px'
        }}>
          <div style={{
            fontSize: '4rem',
            fontWeight: 800,
            color: 'white',
            marginBottom: '20px',
            textShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
          }}>
            Thank You
          </div>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: 400,
            color: 'rgba(255, 255, 255, 0.9)',
            lineHeight: '1.6',
            maxWidth: '800px'
          }}>
            For your time and participation in the Technical Maturity Assessment
          </div>
        </div>
      );
    }

    // Fallback for any undefined slides
    return (
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem',
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        padding: '40px',
        fontWeight: 600
      }}>
        {slide.title}
      </div>
    );
  };

  return (
    <PageContainer>
      <ContentWrapper>
        <PageHeader>
          <ExpandCollapseControls>
            {(() => {
              const allCollapsed = Object.values(collapsedSections).every(val => val === true);
              return (
                <ToggleAllButton 
                  $allCollapsed={allCollapsed} 
                  onClick={toggleAllSections}
                  title={allCollapsed ? "Expand all sections" : "Collapse all sections"}
                >
                  {allCollapsed ? (
                    <FiChevronDown size={20} />
                  ) : (
                    <FiChevronUp size={20} />
                  )}
                </ToggleAllButton>
              );
            })()}
          </ExpandCollapseControls>
          
          <div style={{ flex: 1 }}>
            <PageTitle>The Objective of a Technical Maturity Assessment</PageTitle>
            <PageSubtitle>
              Understand the strategic goals and comprehensive framework behind Databricks maturity assessments
            </PageSubtitle>
          </div>
          
        </PageHeader>
        
        {/* Floating Start Slideshow Button */}
        {!presentationMode && (
          <PresentationButton
            onClick={startPresentation}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiPlay size={18} />
            Slideshow
          </PresentationButton>
        )}

        {/* Objectives Section */}
        <Section order={sectionOrder.indexOf('objectives')}>
          <SectionHeader>
            <SectionTitleRow>
              <h2 onClick={() => toggleSection('objectives')}>
                Strategic Objectives
                {collapsedSections.objectives ? <FiChevronDown size={32} /> : <FiChevronUp size={32} />}
              </h2>
              <AddButton
                onClick={() => handleAdd('objective')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Add new objective"
              >
                <FiPlus size={18} />
              </AddButton>
              {renderSectionControls('objectives', 'Strategic Objectives')}
            </SectionTitleRow>
            <p>Three core objectives guide our technical maturity assessment approach</p>
          </SectionHeader>

          <AnimatePresence>
            {!collapsedSections.objectives && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ overflow: 'hidden' }}
              >
                <CardGrid>
            {objectives.map((objective, index) => (
              <ResizableCard
                key={objective.id}
                objective={objective}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <CardHeader>
                  <CardTitle>
                    <span style={{ fontSize: '2rem', marginRight: '12px' }}>{objective.icon}</span>
                    {objective.title}
                  </CardTitle>
                  <CardActions>
                    <IconButton onClick={() => handleEdit('objective', objective)}>
                      <FiEdit size={16} />
                    </IconButton>
                    <IconButton 
                      $variant="delete" 
                      onClick={() => handleDelete('objective', objective.id)}
                    >
                      <FiTrash2 size={16} />
                    </IconButton>
                  </CardActions>
                </CardHeader>
                <CardContent>
                  <FormattedText>{objective.content}</FormattedText>
                </CardContent>
              </ResizableCard>
            ))}
                </CardGrid>
              </motion.div>
            )}
          </AnimatePresence>
        </Section>

        {/* Category Structure Section */}
        <Section order={sectionOrder.indexOf('categories')}>
          <SectionHeader>
            <SectionTitleRow>
              <h2 onClick={() => toggleSection('categories')}>
                Category Structure and Definitions
                {collapsedSections.categories ? <FiChevronDown size={32} /> : <FiChevronUp size={32} />}
              </h2>
              <AddButton
                onClick={() => handleAdd('category', 'new')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Add new category"
              >
                <FiPlus size={18} />
              </AddButton>
              {renderSectionControls('categories', 'Category Structure')}
            </SectionTitleRow>
            <p>Evaluation categories and sub-categories across the six alignment pillars</p>
          </SectionHeader>

          <AnimatePresence>
            {!collapsedSections.categories && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ overflow: 'hidden' }}
              >
                <CategoryContainer>
            {categories.map((category, index) => (
              <CategoryCard
                className="category-card"
                key={category.id}
                $color={category.color}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <CategoryHeader $bgColor={category.bgColor}>
                  <CategoryHeaderTop>
                    <div style={{ flex: 1 }}>
                      <CategoryLabel>{category.label}</CategoryLabel>
                      <CategoryTitle>{category.title}</CategoryTitle>
                      <CategoryDescription>
                        <FormattedText>{category.description}</FormattedText>
                      </CategoryDescription>
                    </div>
                    <CardActions>
                      <IconButton onClick={() => handleEdit('category', category)}>
                        <FiEdit size={16} />
                      </IconButton>
                      <IconButton 
                        $variant="delete" 
                        onClick={() => handleDelete('category', category.id)}
                      >
                        <FiTrash2 size={16} />
                      </IconButton>
                    </CardActions>
                  </CategoryHeaderTop>
                </CategoryHeader>

                <CategoryBody>
                  <SubCategoryList>
                    {category.subCategories.map((subCat, idx) => (
                      <SubCategoryItem key={idx}>
                        <SubCategoryLetter $color={category.color}>
                          {subCat.letter}
                        </SubCategoryLetter>
                        <SubCategoryName>{subCat.name}</SubCategoryName>
                        <SubCategoryActions>
                          <SmallIconButton onClick={() => {
                            setParentCategory(category);
                            handleEdit('sub-category', { ...subCat, categoryId: category.id });
                          }}>
                            <FiEdit size={12} />
                          </SmallIconButton>
                          <SmallIconButton 
                            $variant="delete" 
                            onClick={() => {
                              setParentCategory(category);
                              handleDelete('sub-category', { subCat, categoryId: category.id });
                            }}
                          >
                            <FiTrash2 size={12} />
                          </SmallIconButton>
                        </SubCategoryActions>
                      </SubCategoryItem>
                    ))}
                  </SubCategoryList>
                </CategoryBody>
              </CategoryCard>
            ))}
                </CategoryContainer>
              </motion.div>
            )}
          </AnimatePresence>
        </Section>

        {/* Technical Success Plan Section */}
        <Section order={sectionOrder.indexOf('successPlan')}>
          <SectionHeader>
            <SectionTitleRow>
              <h2 onClick={() => toggleSection('successPlan')}>
                Technical Success Plan
                {collapsedSections.successPlan ? <FiChevronDown size={32} /> : <FiChevronUp size={32} />}
              </h2>
              <AddButton
                onClick={() => handleAdd('success plan', 'new')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Add new plan item"
              >
                <FiPlus size={18} />
              </AddButton>
              {renderSectionControls('successPlan', 'Technical Success Plan')}
            </SectionTitleRow>
            <p>How Results Play in Technical Success Plan - Mapping needs to activities and outcomes</p>
          </SectionHeader>

          <AnimatePresence>
            {!collapsedSections.successPlan && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ overflow: 'hidden' }}
              >
          {technicalSuccessPlan.map((plan, index) => (
            <SuccessPlanCard className="success-card" key={plan.id} color={plan.color}>
              <SuccessPlanHeader color={plan.color}>
                {plan.category}
                <CardActions>
                  <IconButton onClick={() => handleEdit('success plan', plan)}>
                    <FiEdit size={16} />
                  </IconButton>
                  <IconButton 
                    $variant="delete" 
                    onClick={() => handleDelete('success plan', plan.id)}
                  >
                    <FiTrash2 size={16} />
                  </IconButton>
                </CardActions>
              </SuccessPlanHeader>
              <SuccessPlanBody>
                <SuccessPlanColumn className="success-column">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4>Need</h4>
                    <CellActions>
                      <TinyIconButton onClick={() => handleEdit('plan-need', { plan, field: 'need' })}>
                        <FiEdit size={10} />
                      </TinyIconButton>
                      <TinyIconButton 
                        $variant="delete" 
                        onClick={() => handleDelete('plan-need', { planId: plan.id, field: 'need' })}
                      >
                        <FiTrash2 size={10} />
                      </TinyIconButton>
                    </CellActions>
                  </div>
                  <FormattedText style={{ color: '#475569', fontSize: '0.9375rem', lineHeight: '1.6', margin: 0 }}>
                    {plan.need}
                  </FormattedText>
                </SuccessPlanColumn>
                <SuccessPlanColumn className="success-column" $bulletColor={plan.color}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4>Activities (High-Level Ideas)</h4>
                    <CellActions>
                      <TinyIconButton onClick={() => handleEdit('plan-activities', { plan, field: 'activities' })}>
                        <FiEdit size={10} />
                      </TinyIconButton>
                      <TinyIconButton 
                        $variant="delete" 
                        onClick={() => handleDelete('plan-activities', { planId: plan.id, field: 'activities' })}
                      >
                        <FiTrash2 size={10} />
                      </TinyIconButton>
                    </CellActions>
                  </div>
                  <ul>
                    {plan.activities.map((activity, idx) => (
                      <li key={idx}>{activity}</li>
                    ))}
                  </ul>
                </SuccessPlanColumn>
                <SuccessPlanColumn className="success-column">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4>Outcome</h4>
                    <CellActions>
                      <TinyIconButton onClick={() => handleEdit('plan-outcome', { plan, field: 'outcome' })}>
                        <FiEdit size={10} />
                      </TinyIconButton>
                      <TinyIconButton 
                        $variant="delete" 
                        onClick={() => handleDelete('plan-outcome', { planId: plan.id, field: 'outcome' })}
                      >
                        <FiTrash2 size={10} />
                      </TinyIconButton>
                    </CellActions>
                  </div>
                  <FormattedText style={{ color: '#475569', fontSize: '0.9375rem', lineHeight: '1.6', margin: 0 }}>
                    {plan.outcome}
                  </FormattedText>
                </SuccessPlanColumn>
              </SuccessPlanBody>
            </SuccessPlanCard>
          ))}
              </motion.div>
            )}
          </AnimatePresence>
        </Section>

        {/* Engagement & Enablement Plan Section */}
        <Section order={sectionOrder.indexOf('engagementPlan')}>
          <SectionHeader>
            <SectionTitleRow>
              <h2 onClick={() => toggleSection('engagementPlan')}>
                Targeted Engagement & Enablement Plan
                {collapsedSections.engagementPlan ? <FiChevronDown size={32} /> : <FiChevronUp size={32} />}
              </h2>
              <AddButton
                onClick={() => handleAdd('engagement plan', 'new')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Add new timeline item"
              >
                <FiPlus size={18} />
              </AddButton>
              {renderSectionControls('engagementPlan', 'Engagement & Enablement Plan')}
            </SectionTitleRow>
            <p>Timeline for engagement activities and focus areas</p>
          </SectionHeader>

          <AnimatePresence>
            {!collapsedSections.engagementPlan && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ overflow: 'hidden' }}
              >
          <EngagementTable>
            <EngagementTableHeader>
              <EngagementTableCell>Time</EngagementTableCell>
              <EngagementTableCell>Engagement</EngagementTableCell>
              <EngagementTableCell>Focus Area</EngagementTableCell>
            </EngagementTableHeader>
            {engagementPlan.map((item, index) => (
              <EngagementTableRow key={item.id} className="table-row" style={{ position: 'relative' }}>
                <EngagementTableCell>
                  <strong>{item.time}</strong>
                </EngagementTableCell>
                <EngagementTableCell>
                  {item.engagement}
                </EngagementTableCell>
                <EngagementTableCell>
                  {item.focusArea}
                </EngagementTableCell>
                <CellActions style={{ right: '8px', top: '50%', transform: 'translateY(-50%)' }}>
                  <TinyIconButton onClick={() => handleEdit('engagement plan', item)}>
                    <FiEdit size={10} />
                  </TinyIconButton>
                  <TinyIconButton 
                    $variant="delete" 
                    onClick={() => handleDelete('engagement plan', item.id)}
                  >
                    <FiTrash2 size={10} />
                  </TinyIconButton>
                </CellActions>
              </EngagementTableRow>
            ))}
          </EngagementTable>
              </motion.div>
            )}
          </AnimatePresence>
        </Section>

        {/* Analysis & Actions Section */}
        <Section order={sectionOrder.indexOf('analysisActions')}>
          <SectionHeader>
            <SectionTitleRow>
              <h2 onClick={() => toggleSection('analysisActions')}>
                Analysis & Actions
                {collapsedSections.analysisActions ? <FiChevronDown size={32} /> : <FiChevronUp size={32} />}
              </h2>
              <AddButton
                onClick={() => handleAdd('analysis', 'new')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Add new analysis"
              >
                <FiPlus size={18} />
              </AddButton>
              {renderSectionControls('analysisActions', 'Analysis & Actions')}
            </SectionTitleRow>
            <p>Maturity improvement recommendations at each stage of the Maturity Model</p>
          </SectionHeader>

          <AnimatePresence>
            {!collapsedSections.analysisActions && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ overflow: 'hidden' }}
              >
          {analysisActions.map((analysis, index) => (
            <AnalysisCard className="analysis-card" key={analysis.id} $borderColor={analysis.color}>
              <AnalysisCardHeader $bgColor={analysis.bgColor}>
                <AnalysisCardTitle>{analysis.title}</AnalysisCardTitle>
                <CardActions>
                  <IconButton onClick={() => handleEdit('analysis', analysis)}>
                    <FiEdit size={16} />
                  </IconButton>
                  <IconButton 
                    $variant="delete" 
                    onClick={() => handleDelete('analysis', analysis.id)}
                  >
                    <FiTrash2 size={16} />
                  </IconButton>
                </CardActions>
              </AnalysisCardHeader>
              <AnalysisCardBody>
                {analysis.levels.map((level, idx) => (
                  <AnalysisStageCard className="stage-card" key={idx} color={analysis.color}>
                    <AnalysisStageTitle>{level.stage}</AnalysisStageTitle>
                    <AnalysisStageDescription>
                      {level.description}
                    </AnalysisStageDescription>
                    <AnalysisStageTools>
                      <strong>Helpful Tools:</strong>
                      <span>{level.tools}</span>
                    </AnalysisStageTools>
                    <CellActions>
                      <TinyIconButton onClick={() => handleEdit('stage', { ...level, analysisId: analysis.id })}>
                        <FiEdit size={10} />
                      </TinyIconButton>
                      <TinyIconButton 
                        $variant="delete" 
                        onClick={() => handleDelete('stage', level.stage)}
                      >
                        <FiTrash2 size={10} />
                      </TinyIconButton>
                    </CellActions>
                  </AnalysisStageCard>
                ))}
              </AnalysisCardBody>
            </AnalysisCard>
          ))}
              </motion.div>
            )}
          </AnimatePresence>
        </Section>

        {/* Customer Engagement Scenarios Section */}
        <Section order={sectionOrder.indexOf('scenarios')}>
          <SectionHeader>
            <SectionTitleRow>
              <h2 onClick={() => toggleSection('scenarios')}>
                Customer Engagement Scenarios
                {collapsedSections.scenarios ? <FiChevronDown size={32} /> : <FiChevronUp size={32} />}
              </h2>
              <AddButton
                onClick={() => handleAdd('scenario', 'new')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Add new scenario"
              >
                <FiPlus size={18} />
              </AddButton>
              {renderSectionControls('scenarios', 'Customer Engagement Scenarios')}
            </SectionTitleRow>
            <p>Tailored approaches for different customer maturity levels and situations</p>
          </SectionHeader>

          <AnimatePresence>
            {!collapsedSections.scenarios && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ overflow: 'hidden' }}
              >
          {engagementScenarios.map((scenario, index) => {
            const maturityLevels = ['Explore', 'Experiment', 'Formalize', 'Optimize', 'Transform'];
            
            return (
              <ScenarioCard className="scenario-card" key={scenario.id} $color={scenario.color}>
                <ScenarioHeader $bgColor={scenario.bgColor}>
                  <div style={{ flex: 1 }}>
                    <ScenarioTitle>{scenario.title}</ScenarioTitle>
                    <MaturityLevelIndicator>
                      {maturityLevels.map((level, idx) => (
                        <MaturityBox 
                          key={idx} 
                          $filled={idx < scenario.maturityLevel}
                          title={level}
                        >
                          {level.slice(0, 3)}
                        </MaturityBox>
                      ))}
                    </MaturityLevelIndicator>
                    <MaturityLevelText>
                      <strong>Explore:</strong> {scenario.maturityDescriptions.explore}
                    </MaturityLevelText>
                    <MaturityLevelText>
                      <strong>Experiment:</strong> {scenario.maturityDescriptions.experiment}
                    </MaturityLevelText>
                    <MaturityLevelText>
                      <strong>Formalize:</strong> {scenario.maturityDescriptions.formalize}
                    </MaturityLevelText>
                    <MaturityLevelText>
                      <strong>Optimize:</strong> {scenario.maturityDescriptions.optimize}
                    </MaturityLevelText>
                    <MaturityLevelText>
                      <strong>Transform:</strong> {scenario.maturityDescriptions.transform}
                    </MaturityLevelText>
                  </div>
                  <CardActions>
                    <IconButton onClick={() => handleEdit('scenario', scenario)}>
                      <FiEdit size={16} />
                    </IconButton>
                    <IconButton 
                      $variant="delete" 
                      onClick={() => handleDelete('scenario', scenario.id)}
                    >
                      <FiTrash2 size={16} />
                    </IconButton>
                  </CardActions>
                </ScenarioHeader>

                <ScenarioBody>
                  <ScenarioSection>
                    <h4>Scenario</h4>
                    <p>{scenario.scenario}</p>
                  </ScenarioSection>

                  <ScenarioSection $bulletColor={scenario.color}>
                    <h4>Approach</h4>
                    <ul>
                      {scenario.approach.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </ScenarioSection>
                </ScenarioBody>
              </ScenarioCard>
            );
          })}
              </motion.div>
            )}
          </AnimatePresence>
        </Section>

        {/* Maturity Matrices Section */}
        <MaturitySection className="maturity-section" order={sectionOrder.indexOf('matrices')}>
          <SectionHeader>
            <SectionTitleRow>
              <h2 onClick={() => toggleSection('matrices')}>
                Maturity Level Definitions
                {collapsedSections.matrices ? <FiChevronDown size={32} /> : <FiChevronUp size={32} />}
              </h2>
              <AddButton
                onClick={() => handleAdd('maturity matrix', 'new')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Add new matrix"
              >
                <FiPlus size={18} />
              </AddButton>
              {renderSectionControls('matrices', 'Maturity Level Definitions')}
            </SectionTitleRow>
            <p>Detailed maturity progression for each dimension across all six categories</p>
          </SectionHeader>

          <AnimatePresence>
            {!collapsedSections.matrices && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ overflow: 'hidden' }}
              >
          {maturityMatrices.map((matrix, matrixIdx) => (
            <MaturityCard className="matrix-card" key={matrix.id} $borderColor={matrix.color}>
              <MaturityCardHeader $bgColor={matrix.bgColor}>
                <MaturityCardTitle>{matrix.title}</MaturityCardTitle>
                <CardActions>
                  <IconButton onClick={() => handleEdit('maturity matrix', matrix)}>
                    <FiEdit size={16} />
                  </IconButton>
                  <IconButton 
                    $variant="delete" 
                    onClick={() => handleDelete('maturity matrix', matrix.id)}
                  >
                    <FiTrash2 size={16} />
                  </IconButton>
                </CardActions>
              </MaturityCardHeader>

              <MaturityTable>
                <Table>
                  <TableHeader>
                    <tr>
                      <TableHeaderCell>Dimension</TableHeaderCell>
                      {maturityLevels.map((level, idx) => (
                        <TableHeaderCell key={idx}>{level}</TableHeaderCell>
                      ))}
                    </tr>
                  </TableHeader>
                  <TableBody>
                    {matrix.dimensions.map((dimension, dimIdx) => (
                      <TableRow key={dimIdx}>
                        <TableCell>{dimension.name}</TableCell>
                        {dimension.levels.map((levelDesc, levelIdx) => (
                          <TableCell className="table-cell" key={levelIdx}>
                            {levelDesc}
                            <CellActions>
                              <TinyIconButton onClick={() => handleEdit('cell', { 
                                matrix, 
                                dimension, 
                                dimIdx, 
                                levelIdx, 
                                content: levelDesc 
                              })}>
                                <FiEdit size={10} />
                              </TinyIconButton>
                              <TinyIconButton 
                                $variant="delete" 
                                onClick={() => handleDelete('cell', { 
                                  matrixId: matrix.id, 
                                  dimIdx, 
                                  levelIdx 
                                })}
                              >
                                <FiTrash2 size={10} />
                              </TinyIconButton>
                            </CellActions>
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </MaturityTable>
            </MaturityCard>
          ))}
              </motion.div>
            )}
          </AnimatePresence>
        </MaturitySection>
      </ContentWrapper>

      {/* Modal for Add/Edit */}
      <AnimatePresence>
        {modalOpen && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalOpen(false)}
          >
            <ModalContent
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalHeader>
                <h3>
                  {editingItem ? 'Edit' : 'Add'} {
                    modalType === 'objective' ? 'Objective' :
                    modalType === 'plan-need' ? 'Need' :
                    modalType === 'plan-activities' ? 'Activities' :
                    modalType === 'plan-outcome' ? 'Outcome' :
                    modalType === 'activity-item' ? 'Activity' :
                    modalType === 'approach-item' ? 'Approach Item' :
                    modalType === 'cell' ? 'cell' :
                    modalType
                  }
                </h3>
                <CloseButton onClick={() => setModalOpen(false)}>
                  <FiX />
                </CloseButton>
              </ModalHeader>

              {modalType === 'objective' && (
                <Form onSubmit={handleSubmitForm}>
                  <FormGroup>
                    <Label>Icon (Select an emoji)</Label>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(8, 1fr)', 
                      gap: '8px',
                      padding: '12px',
                      background: '#f8fafc',
                      borderRadius: '8px',
                      marginBottom: '8px'
                    }}>
                      {['🎯', '🏗️', '🤝', '💡', '🚀', '⚡', '🔧', '📊', '🎨', '🔒', '🌟', '💪', '🎓', '🔥', '✨', '🎁'].map(emoji => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => handleFormChange('icon', emoji)}
                          style={{
                            fontSize: '2rem',
                            padding: '8px',
                            border: formData.icon === emoji ? '2px solid #6366f1' : '2px solid transparent',
                            borderRadius: '8px',
                            background: formData.icon === emoji ? '#eef2ff' : 'white',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => e.target.style.transform = 'scale(1.2)'}
                          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                    <div style={{ 
                      textAlign: 'center', 
                      fontSize: '3rem', 
                      padding: '16px',
                      background: '#f1f5f9',
                      borderRadius: '8px',
                      marginTop: '8px'
                    }}>
                      {formData.icon || '❓'}
                    </div>
                  </FormGroup>

                  <FormGroup>
                    <Label>Title *</Label>
                    <Input
                      type="text"
                      value={formData.title || ''}
                      onChange={(e) => handleFormChange('title', e.target.value)}
                      placeholder="Enter objective title"
                      required
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Content *</Label>
                    <div style={{ marginBottom: '8px', fontSize: '1.175rem', color: '#6b7280' }}>
                      💡 <strong>Formatting tips:</strong> Start lines with <code style={{ background: '#f3f4f6', padding: '2px 6px', borderRadius: '4px' }}>•</code> or <code style={{ background: '#f3f4f6', padding: '2px 6px', borderRadius: '4px' }}>-</code> for bullets, <code style={{ background: '#f3f4f6', padding: '2px 6px', borderRadius: '4px' }}>1.</code> for numbers. Press Enter for new lines.
                    </div>
                    <TextArea
                      value={formData.content || ''}
                      onChange={(e) => handleFormChange('content', e.target.value)}
                      placeholder="Enter objective description&#10;• Use bullets for lists&#10;• Use numbers: 1. 2. 3.&#10;• Press Enter for new lines"
                      rows="6"
                      required
                      style={{ 
                        fontFamily: 'monospace',
                        whiteSpace: 'pre-wrap',
                        lineHeight: '1.6'
                      }}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Border Color</Label>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <Input
                        type="color"
                        value={formData.borderColor || '#3b82f6'}
                        onChange={(e) => handleFormChange('borderColor', e.target.value)}
                        style={{ width: '80px', height: '50px', cursor: 'pointer' }}
                      />
                      <span style={{ 
                        padding: '8px 16px', 
                        background: formData.borderColor || '#3b82f6',
                        color: 'white',
                        borderRadius: '6px',
                        fontWeight: '600'
                      }}>
                        Preview Color
                      </span>
                    </div>
                  </FormGroup>

                  <ButtonGroup>
                    <Button type="button" onClick={() => setModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" $variant="primary">
                      {editingItem ? 'Update' : 'Create'}
                    </Button>
                  </ButtonGroup>
                </Form>
              )}

              {modalType !== 'objective' && (
                <Form onSubmit={handleSubmitForm}>
                  {modalType === 'category' && !editingItem && (
                    <FormGroup>
                      <Label>Choose Category Type</Label>
                      <select
                        style={{
                          width: '100%',
                          padding: '12px',
                          borderRadius: '8px',
                          border: '2px solid #e5e7eb',
                          fontSize: '1.3rem',
                          marginBottom: '12px'
                        }}
                        onChange={(e) => {
                          const selected = e.target.value;
                          if (selected === 'platform') {
                            handleFormChange('title', 'Platform & Governance');
                            handleFormChange('description', 'Foundational platform capabilities for a secure, governed, and scalable Databricks deployment.');
                          } else if (selected === 'data') {
                            handleFormChange('title', 'Data Engineering & Integration');
                            handleFormChange('description', 'Build robust, scalable data pipelines with modern lakehouse architecture and quality controls.');
                          } else if (selected === 'analytics') {
                            handleFormChange('title', 'Analytics & BI Modernization');
                            handleFormChange('description', 'Enable fast, self-service analytics with governed data access and modern BI integration.');
                          } else if (selected === 'ml') {
                            handleFormChange('title', 'Machine Learning & MLOps');
                            handleFormChange('description', 'Operationalize machine learning with MLOps best practices and production-grade workflows.');
                          } else if (selected === 'genai') {
                            handleFormChange('title', 'Generative AI & Agentic Capabilities');
                            handleFormChange('description', 'Build enterprise-grade GenAI applications with RAG, LLM governance, and responsible AI practices.');
                          } else if (selected === 'adoption') {
                            handleFormChange('title', 'Operational Excellence & Adoption');
                            handleFormChange('description', 'Drive platform adoption, community engagement, and continuous improvement across your organization.');
                          } else if (selected === 'custom') {
                            handleFormChange('title', '');
                            handleFormChange('description', '');
                          }
                        }}
                        defaultValue=""
                      >
                        <option value="">-- Select a category or create custom --</option>
                        <option value="platform">Platform & Governance</option>
                        <option value="data">Data Engineering & Integration</option>
                        <option value="analytics">Analytics & BI Modernization</option>
                        <option value="ml">Machine Learning & MLOps</option>
                        <option value="genai">Generative AI & Agentic Capabilities</option>
                        <option value="adoption">Operational Excellence & Adoption</option>
                        <option value="custom">➕ Create Custom Category</option>
                      </select>
                    </FormGroup>
                  )}

                  {modalType === 'cell' && (
                    <FormGroup>
                      <Label>Cell Location</Label>
                      <Input
                        type="text"
                        value={formData.title || ''}
                        readOnly
                        style={{ 
                          background: '#f3f4f6',
                          cursor: 'not-allowed',
                          color: '#6b7280'
                        }}
                      />
                    </FormGroup>
                  )}

                  {modalType !== 'cell' && (
                    <FormGroup>
                      <Label>
                        {modalType === 'sub-category' ? 'Name' : 
                         modalType === 'engagement plan' ? 'Time' :
                         modalType === 'plan-need' || modalType === 'plan-activities' || modalType === 'plan-outcome' || modalType === 'activity-item' || modalType === 'approach-item' ? '' : 
                         'Title'} *
                      </Label>
                      {!(modalType === 'plan-need' || modalType === 'plan-activities' || modalType === 'plan-outcome' || modalType === 'activity-item' || modalType === 'approach-item') && (
                        <Input
                          type="text"
                          value={formData.title || ''}
                          onChange={(e) => handleFormChange('title', e.target.value)}
                          placeholder={
                            modalType === 'sub-category' ? 'Enter sub-category name' : 
                            modalType === 'engagement plan' ? 'Enter time (e.g., H1 2026, Q2 2026, Today)' :
                            `Enter ${modalType} title`
                          }
                          required
                        />
                      )}
                    </FormGroup>
                  )}

                  {modalType === 'success plan' && editingItem && (
                    <div style={{ 
                      marginBottom: '16px', 
                      padding: '12px', 
                      background: '#eff6ff', 
                      borderRadius: '8px',
                      fontSize: '1.175rem',
                      color: '#1e40af'
                    }}>
                      ℹ️ <strong>Note:</strong> Editing the success plan card only changes the category name and color. 
                      Use the individual edit icons on Need, Activities, and Outcome to edit their content.
                    </div>
                  )}

                  {modalType === 'engagement plan' && (
                    <>
                      <FormGroup>
                        <Label>Engagement *</Label>
                        <FormatToolbar>
                          <FormatButton type="button" onClick={() => {
                            const result = insertFormatting({ current: document.querySelector('[name="engagement"]') }, '**', '**');
                            if (result) {
                              handleFormChange('description', result.newText);
                            }
                          }}>
                            <strong>B</strong>
                          </FormatButton>
                          <FormatButton type="button" onClick={() => {
                            const result = insertFormatting({ current: document.querySelector('[name="engagement"]') }, '_', '_');
                            if (result) {
                              handleFormChange('description', result.newText);
                            }
                          }}>
                            <em>I</em>
                          </FormatButton>
                          <FormatButton type="button" onClick={() => {
                            const result = insertFormatting({ current: document.querySelector('[name="engagement"]') }, '__', '__');
                            if (result) {
                              handleFormChange('description', result.newText);
                            }
                          }}>
                            <u>U</u>
                          </FormatButton>
                          <FormatButton type="button" onClick={() => {
                            const textarea = document.querySelector('[name="engagement"]');
                            const cursorPos = textarea.selectionStart;
                            const newText = formData.description.substring(0, cursorPos) + '\n• ' + formData.description.substring(cursorPos);
                            handleFormChange('description', newText);
                          }}>
                            • Bullet
                          </FormatButton>
                        </FormatToolbar>
                        <TextArea
                          name="engagement"
                          value={formData.description || ''}
                          onChange={(e) => handleFormChange('description', e.target.value)}
                          placeholder="Enter engagement text"
                          rows="4"
                          required
                        />
                      </FormGroup>

                      <FormGroup>
                        <Label>Focus Area *</Label>
                        <FormatToolbar>
                          <FormatButton type="button" onClick={() => {
                            const result = insertFormatting({ current: document.querySelector('[name="focusArea"]') }, '**', '**');
                            if (result) {
                              handleFormChange('content', result.newText);
                            }
                          }}>
                            <strong>B</strong>
                          </FormatButton>
                          <FormatButton type="button" onClick={() => {
                            const result = insertFormatting({ current: document.querySelector('[name="focusArea"]') }, '_', '_');
                            if (result) {
                              handleFormChange('content', result.newText);
                            }
                          }}>
                            <em>I</em>
                          </FormatButton>
                          <FormatButton type="button" onClick={() => {
                            const result = insertFormatting({ current: document.querySelector('[name="focusArea"]') }, '__', '__');
                            if (result) {
                              handleFormChange('content', result.newText);
                            }
                          }}>
                            <u>U</u>
                          </FormatButton>
                          <FormatButton type="button" onClick={() => {
                            const textarea = document.querySelector('[name="focusArea"]');
                            const cursorPos = textarea.selectionStart;
                            const newText = formData.content.substring(0, cursorPos) + '\n• ' + formData.content.substring(cursorPos);
                            handleFormChange('content', newText);
                          }}>
                            • Bullet
                          </FormatButton>
                        </FormatToolbar>
                        <TextArea
                          name="focusArea"
                          value={formData.content || ''}
                          onChange={(e) => handleFormChange('content', e.target.value)}
                          placeholder="Enter focus area text"
                          rows="4"
                          required
                        />
                      </FormGroup>
                    </>
                  )}

                  {!(modalType === 'success plan' && editingItem) && modalType !== 'engagement plan' && (
                    <FormGroup>
                      <Label>
                        {modalType === 'sub-category' ? 'Letter/Identifier' : 
                         modalType === 'cell' ? 'Cell Content' :
                         modalType === 'plan-need' ? 'Need' :
                         modalType === 'plan-activities' ? 'Activities (one per line)' :
                         modalType === 'plan-outcome' ? 'Outcome' :
                         modalType === 'activity-item' ? 'Activity Text' :
                         modalType === 'approach-item' ? 'Approach Text' :
                         modalType === 'success plan' ? 'Initial Need (optional)' :
                         'Description'} {modalType === 'success plan' && !editingItem ? '' : '*'}
                      </Label>
                      <div style={{ marginBottom: '8px', fontSize: '1.175rem', color: '#6b7280' }}>
                        💡 <strong>Formatting tips:</strong> Start lines with <code style={{ background: '#f3f4f6', padding: '2px 6px', borderRadius: '4px' }}>•</code> or <code style={{ background: '#f3f4f6', padding: '2px 6px', borderRadius: '4px' }}>-</code> for bullets, <code style={{ background: '#f3f4f6', padding: '2px 6px', borderRadius: '4px' }}>1.</code> for numbers. Press Enter for new lines.
                      </div>
                      <TextArea
                        value={formData.description || formData.content || ''}
                        onChange={(e) => handleFormChange('description', e.target.value)}
                        placeholder={
                          modalType === 'sub-category' ? 'Enter letter (e.g., A., B., C.)' :
                          modalType === 'engagement plan' ? 'Engagement text here\n---\nFocus Area text here' :
                          modalType === 'cell' ? 'Enter cell content\n• Use bullets for lists\n• Press Enter for new lines' :
                          modalType === 'success plan' ? '(Optional) Enter initial need text. You can edit this later.' :
                          modalType === 'plan-activities' ? 'Enter each activity on a new line (will be shown as bullets)' :
                          modalType === 'plan-outcome' ? 'Enter outcome\n• Use bullets for lists\n• Press Enter for new lines' :
                          'Enter text here\n• Use bullets: - or •\n• Use numbers: 1. 2. 3.\n• Press Enter for new lines'
                        }
                        rows={modalType === 'sub-category' ? 2 : modalType === 'plan-activities' ? 8 : 6}
                        required={!(modalType === 'success plan')}
                        style={{ 
                          fontFamily: 'monospace',
                          whiteSpace: 'pre-wrap',
                          lineHeight: '1.6'
                        }}
                      />
                    </FormGroup>
                  )}

                  {modalType === 'stage' && (
                    <FormGroup>
                      <Label>Helpful Tools *</Label>
                      <div style={{ marginBottom: '8px', fontSize: '1.175rem', color: '#6b7280' }}>
                        💡 <strong>Formatting tips:</strong> Separate multiple tools with commas (e.g., Tool A, Tool B, Tool C)
                      </div>
                      <TextArea
                        value={formData.tools || ''}
                        onChange={(e) => handleFormChange('tools', e.target.value)}
                        placeholder="Enter helpful tools, separated by commas&#10;e.g., ABAC Policy Templates, Audit Dashboards, Monitoring Toolkit"
                        rows="3"
                        required
                        style={{ 
                          fontFamily: 'monospace',
                          whiteSpace: 'pre-wrap',
                          lineHeight: '1.6'
                        }}
                      />
                    </FormGroup>
                  )}

                  {modalType === 'success plan' && (
                    <FormGroup>
                      <Label>Card Color</Label>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <Input
                          type="color"
                          value={formData.borderColor || '#3b82f6'}
                          onChange={(e) => handleFormChange('borderColor', e.target.value)}
                          style={{ width: '80px', height: '50px', cursor: 'pointer' }}
                        />
                        <span style={{ 
                          padding: '8px 16px', 
                          background: formData.borderColor || '#3b82f6',
                          color: 'white',
                          borderRadius: '6px',
                          fontWeight: '600'
                        }}>
                          Preview Color
                        </span>
                      </div>
                    </FormGroup>
                  )}

                  <ButtonGroup>
                    <Button type="button" onClick={() => setModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" $variant="primary">
                      {editingItem ? 'Update' : 'Create'}
                    </Button>
                  </ButtonGroup>
                </Form>
              )}
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>

      {/* Slideshow/Presentation Mode */}
      <AnimatePresence>
        {presentationMode && (
          <SlideshowOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <SlideContainer>
              <ClickArea data-hide-on-print="true" $direction="left" onClick={previousSlide} />
              <ClickArea data-hide-on-print="true" $direction="right" onClick={nextSlide} />
              
              {/* Navigation Buttons - Show on hover */}
              <NavigationButton
                data-hide-on-print="true"
                $direction="left"
                onClick={previousSlide}
                disabled={currentSlide === 0}
                whileTap={{ scale: 0.9 }}
              >
                ←
              </NavigationButton>
              
              <NavigationButton
                data-hide-on-print="true"
                $direction="right"
                onClick={nextSlide}
                whileTap={{ scale: 0.9 }}
              >
                →
              </NavigationButton>
              
              {slides[currentSlide].id !== 'thank-you' && slides[currentSlide].id !== 'title' && (
                <SlideHeading>{slides[currentSlide].title}</SlideHeading>
              )}
              <SlideCounter 
                data-hide-on-print="true"
              >
                {currentSlide + 1} / {slides.length}
              </SlideCounter>
              
              <ExitButton
                data-hide-on-print="true"
                onClick={exitPresentation}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                ×
              </ExitButton>

              <PrintButton
                data-hide-on-print="true"
                onClick={handlePrintSlideshow}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiPrinter size={20} />
              </PrintButton>
              
              <SlideContent
                key={currentSlide}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >

                {/* Slide 1: Strategic Objectives */}
                {slides[currentSlide].id === 'objectives' && (
                  <div style={{ 
                    width: '100%', 
                    maxWidth: '100%', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '18px',
                    padding: '0',
                    marginTop: '0',
                    height: '100%'
                  }}>
                    {objectives.map((obj) => (
                      <div key={obj.id} style={{ 
                        background: 'white',
                        borderRadius: '16px',
                        border: `4px solid ${obj.borderColor}`,
                        padding: '24px 32px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
                        display: 'flex',
                        flexDirection: 'column',
                        flex: 1
                      }}>
                        <div style={{ 
                          display: 'flex',
                          alignItems: 'center',
                          marginBottom: '14px',
                          paddingBottom: '12px',
                          borderBottom: `3px solid ${obj.borderColor}`
                        }}>
                          <span style={{ fontSize: '2.4rem', marginRight: '16px' }}>{obj.icon}</span>
                          <h3 style={{ 
                            fontSize: '1.5rem',
                            fontWeight: 700,
                            color: '#1e293b',
                            margin: 0,
                            lineHeight: 1.3
                          }}>
                            {obj.title}
                          </h3>
                        </div>
                        <div style={{ 
                          fontSize: '1.15rem',
                          lineHeight: '1.6',
                          color: '#475569'
                        }}>
                          {obj.content || 'No content available'}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Slide 2: Category Structure - Part 1 (First 3 Categories) */}
                {slides[currentSlide].id === 'categories-1' && (
                  <SlideGrid $columns="repeat(3, 1fr)" style={{ paddingTop: '0', gap: '14px', width: '100%', height: '100%', display: 'grid' }}>
                    {categories.slice(0, 3).map((cat) => (
                      <CompactCard key={cat.id} $color={cat.color} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <div style={{ 
                          background: cat.bgColor, 
                          color: 'white', 
                          padding: '20px', 
                          borderRadius: '10px 10px 0 0',
                          marginBottom: '16px',
                          marginTop: '-16px',
                          marginLeft: '-16px',
                          marginRight: '-16px'
                        }}>
                          <div style={{ fontSize: '0.95rem', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '10px', textTransform: 'uppercase' }}>
                            {cat.label}
                          </div>
                          <h4 style={{ color: 'white', marginBottom: '12px', fontSize: '1.4rem', fontWeight: 700, lineHeight: 1.3 }}>{cat.title}</h4>
                          <p style={{ fontSize: '1.05rem', opacity: 1, lineHeight: '1.5', color: 'rgba(255, 255, 255, 0.95)' }}>{cat.description}</p>
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly' }}>
                          {cat.subCategories && cat.subCategories.map((subCat, idx) => (
                            <div key={idx} style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              gap: '14px', 
                              padding: '12px 0',
                              flex: 1,
                              borderBottom: idx < cat.subCategories.length - 1 ? '1px solid #e2e8f0' : 'none'
                            }}>
                              <div style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '7px',
                                background: cat.bgColor,
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 700,
                                fontSize: '1.2rem',
                                flexShrink: 0
                              }}>
                                {subCat.letter}
                              </div>
                              <div style={{ 
                                fontSize: '1.1rem', 
                                color: '#1e293b',
                                fontWeight: 600,
                                flex: 1,
                                lineHeight: '1.4'
                              }}>
                                {subCat.name}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CompactCard>
                    ))}
                  </SlideGrid>
                )}

                {/* Slide 3: Category Structure - Part 2 (Last 3 Categories) */}
                {slides[currentSlide].id === 'categories-2' && (
                  <SlideGrid $columns="repeat(3, 1fr)" style={{ paddingTop: '0', gap: '14px', width: '100%', height: '100%', display: 'grid' }}>
                    {categories.slice(3, 6).map((cat) => (
                      <CompactCard key={cat.id} $color={cat.color} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <div style={{ 
                          background: cat.bgColor, 
                          color: 'white', 
                          padding: '20px', 
                          borderRadius: '10px 10px 0 0',
                          marginBottom: '16px',
                          marginTop: '-16px',
                          marginLeft: '-16px',
                          marginRight: '-16px'
                        }}>
                          <div style={{ fontSize: '0.95rem', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '10px', textTransform: 'uppercase' }}>
                            {cat.label}
                          </div>
                          <h4 style={{ color: 'white', marginBottom: '12px', fontSize: '1.4rem', fontWeight: 700, lineHeight: 1.3 }}>{cat.title}</h4>
                          <p style={{ fontSize: '1.05rem', opacity: 1, lineHeight: '1.5', color: 'rgba(255, 255, 255, 0.95)' }}>{cat.description}</p>
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly' }}>
                          {cat.subCategories && cat.subCategories.map((subCat, idx) => (
                            <div key={idx} style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              gap: '14px', 
                              padding: '12px 0',
                              flex: 1,
                              borderBottom: idx < cat.subCategories.length - 1 ? '1px solid #e2e8f0' : 'none'
                            }}>
                              <div style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '7px',
                                background: cat.bgColor,
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 700,
                                fontSize: '1.2rem',
                                flexShrink: 0
                              }}>
                                {subCat.letter}
                              </div>
                              <div style={{ 
                                fontSize: '1.1rem', 
                                color: '#1e293b',
                                fontWeight: 600,
                                flex: 1,
                                lineHeight: '1.4'
                              }}>
                                {subCat.name}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CompactCard>
                    ))}
                  </SlideGrid>
                )}

                {/* Slide 3: Technical Success Plan - Part 1 (First 3 Pillars) */}
                {slides[currentSlide].id === 'success-plan-1' && (
                  <SlideGrid $columns="1fr" style={{ paddingTop: '0', paddingBottom: '0', width: '100%', height: '100%' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', height: '100%' }}>
                      {technicalSuccessPlan.slice(0, 3).map((plan) => (
                        <div key={plan.id} style={{ 
                          border: `4px solid ${plan.color}`,
                          borderRadius: '12px',
                          overflow: 'hidden',
                          background: 'white',
                          display: 'flex',
                          flexDirection: 'column',
                          flex: 1
                        }}>
                          <div style={{ 
                            background: `linear-gradient(135deg, ${plan.color} 0%, ${plan.color}dd 100%)`,
                            color: 'white',
                            padding: 'clamp(14px, 1.6vh, 20px) clamp(18px, 2vw, 26px)',
                            fontWeight: 700,
                            fontSize: 'clamp(1rem, 1.4vw, 1.5rem)'
                          }}>
                            {plan.category}
                          </div>
                          <div style={{ 
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: '0'
                          }}>
                            <div style={{ 
                              padding: 'clamp(16px, 2vh, 24px)',
                              borderRight: '2px solid #e2e8f0',
                              display: 'flex',
                              flexDirection: 'column'
                            }}>
                              <h4 style={{ 
                                fontSize: 'clamp(0.75rem, 0.95vw, 1.05rem)',
                                fontWeight: 700,
                                color: plan.color,
                                marginBottom: 'clamp(10px, 1.2vh, 14px)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                              }}>
                                Need
                              </h4>
                              <div style={{ 
                                color: '#475569',
                                fontSize: 'clamp(0.8rem, 0.95vw, 1.05rem)',
                                lineHeight: '1.4'
                              }}>
                                {plan.need || 'No need defined'}
                              </div>
                            </div>
                            <div style={{ 
                              padding: 'clamp(16px, 2vh, 24px)',
                              borderRight: '2px solid #e2e8f0',
                              display: 'flex',
                              flexDirection: 'column'
                            }}>
                              <h4 style={{ 
                                fontSize: 'clamp(0.75rem, 0.95vw, 1.05rem)',
                                fontWeight: 700,
                                color: plan.color,
                                marginBottom: 'clamp(10px, 1.2vh, 14px)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                              }}>
                                Activities (High-Level Ideas)
                              </h4>
                              <ul style={{ 
                                margin: 0,
                                paddingLeft: 'clamp(18px, 2vw, 26px)',
                                color: '#475569',
                                fontSize: 'clamp(0.8rem, 0.95vw, 1.05rem)',
                                lineHeight: '1.4'
                              }}>
                                {plan.activities && plan.activities.map((activity, idx) => (
                                  <li key={idx} style={{ marginBottom: 'clamp(5px, 0.7vh, 9px)' }}>{activity}</li>
                                ))}
                              </ul>
                            </div>
                            <div style={{ 
                              padding: 'clamp(16px, 2vh, 24px)',
                              display: 'flex',
                              flexDirection: 'column'
                            }}>
                              <h4 style={{ 
                                fontSize: 'clamp(0.75rem, 0.95vw, 1.05rem)',
                                fontWeight: 700,
                                color: plan.color,
                                marginBottom: 'clamp(10px, 1.2vh, 14px)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                              }}>
                                Outcome
                              </h4>
                              <div style={{ 
                                color: '#475569',
                                fontSize: 'clamp(0.8rem, 0.95vw, 1.05rem)',
                                lineHeight: '1.4'
                              }}>
                                {plan.outcome || 'No outcome defined'}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </SlideGrid>
                )}

                {/* Slide 4: Technical Success Plan - Part 2 (Last 3 Pillars) */}
                {slides[currentSlide].id === 'success-plan-2' && (
                  <SlideGrid $columns="1fr" style={{ paddingTop: '0', paddingBottom: '0', width: '100%', height: '100%' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
                      {technicalSuccessPlan.slice(3, 6).map((plan) => (
                        <div key={plan.id} style={{ 
                          border: `4px solid ${plan.color}`,
                          borderRadius: '14px',
                          overflow: 'visible',
                          background: 'white',
                          display: 'flex',
                          flexDirection: 'column',
                          flex: 1
                        }}>
                          <div style={{ 
                            background: `linear-gradient(135deg, ${plan.color} 0%, ${plan.color}dd 100%)`,
                            color: 'white',
                            padding: 'clamp(8px, 1.2vh, 14px) clamp(12px, 1.5vw, 18px)',
                            fontWeight: 700,
                            fontSize: 'clamp(0.95rem, 1.4vw, 1.5rem)'
                          }}>
                            {plan.category}
                          </div>
                          <div style={{ 
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: '0'
                          }}>
                            <div style={{ 
                              padding: 'clamp(10px, 1.5vh, 18px)',
                              borderRight: '2px solid #e2e8f0',
                              display: 'flex',
                              flexDirection: 'column'
                            }}>
                              <h4 style={{ 
                                fontSize: 'clamp(0.7rem, 0.9vw, 1rem)',
                                fontWeight: 700,
                                color: plan.color,
                                marginBottom: 'clamp(6px, 0.8vh, 10px)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                              }}>
                                Need
                              </h4>
                              <div style={{ 
                                color: '#475569',
                                fontSize: 'clamp(0.75rem, 0.95vw, 1rem)',
                                lineHeight: '1.4'
                              }}>
                                {plan.need || 'No need defined'}
                              </div>
                            </div>
                            <div style={{ 
                              padding: 'clamp(10px, 1.5vh, 18px)',
                              borderRight: '2px solid #e2e8f0',
                              display: 'flex',
                              flexDirection: 'column'
                            }}>
                              <h4 style={{ 
                                fontSize: 'clamp(0.7rem, 0.9vw, 1rem)',
                                fontWeight: 700,
                                color: plan.color,
                                marginBottom: 'clamp(8px, 1.2vh, 14px)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                              }}>
                                Activities (High-Level Ideas)
                              </h4>
                              <ul style={{ 
                                margin: 0,
                                paddingLeft: 'clamp(14px, 1.5vw, 20px)',
                                color: '#475569',
                                fontSize: 'clamp(0.75rem, 0.95vw, 1rem)',
                                lineHeight: '1.4'
                              }}>
                                {plan.activities && plan.activities.map((activity, idx) => (
                                  <li key={idx} style={{ marginBottom: 'clamp(4px, 0.5vh, 7px)' }}>{activity}</li>
                                ))}
                              </ul>
                            </div>
                            <div style={{ 
                              padding: 'clamp(10px, 1.5vh, 18px)',
                              display: 'flex',
                              flexDirection: 'column'
                            }}>
                              <h4 style={{ 
                                fontSize: 'clamp(0.7rem, 0.9vw, 1rem)',
                                fontWeight: 700,
                                color: plan.color,
                                marginBottom: 'clamp(6px, 0.8vh, 10px)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                              }}>
                                Outcome
                              </h4>
                              <div style={{ 
                                color: '#475569',
                                fontSize: 'clamp(0.75rem, 0.95vw, 1rem)',
                                lineHeight: '1.4'
                              }}>
                                {plan.outcome || 'No outcome defined'}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </SlideGrid>
                )}

                {/* Slide 5: Engagement & Enablement Plan */}
                {slides[currentSlide].id === 'engagement-plan' && (
                  <SlideGrid $columns="1fr" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ 
                        border: '3px solid #e2e8f0',
                        borderRadius: '14px',
                        overflow: 'hidden',
                        background: 'white',
                        display: 'flex',
                        flexDirection: 'column',
                        flex: 1
                      }}>
                        <div style={{ 
                          display: 'grid',
                          gridTemplateColumns: 'repeat(3, 1fr)',
                          background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                          color: 'white',
                          padding: '18px 0',
                          fontWeight: 700,
                          fontSize: '1.4rem'
                        }}>
                          <div style={{ padding: '0 20px' }}>Time</div>
                          <div style={{ padding: '0 20px' }}>Engagement</div>
                          <div style={{ padding: '0 20px' }}>Focus Area</div>
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                          {engagementPlan.map((item, idx) => (
                            <div key={item.id} style={{ 
                              display: 'grid',
                              gridTemplateColumns: 'repeat(3, 1fr)',
                              borderBottom: idx < engagementPlan.length - 1 ? '1px solid #e2e8f0' : 'none',
                              padding: '18px 0',
                              flex: 1,
                              alignItems: 'center'
                            }}>
                              <div style={{ padding: '0 20px', fontSize: '1.35rem', color: '#1e293b', fontWeight: 600 }}>
                                {item.time || 'Not specified'}
                              </div>
                              <div style={{ padding: '0 20px', fontSize: '1.35rem', color: '#475569' }}>
                                {item.engagement || 'Not specified'}
                              </div>
                              <div style={{ padding: '0 20px', fontSize: '1.35rem', color: '#475569' }}>
                                {item.focusArea || 'Not specified'}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </SlideGrid>
                )}

                {/* Slide 7: Analysis & Actions - Part 1 (First 3 Pillars) */}
                {slides[currentSlide].id === 'analysis-1' && (
                  <SlideGrid $columns="1fr" style={{ paddingTop: '0', paddingBottom: '0', gap: '10px', width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                    {analysisActions.slice(0, 3).map((analysis) => (
                      <div key={analysis.id} style={{ marginBottom: '0', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <div style={{
                          background: analysis.bgColor,
                          color: 'white',
                          padding: 'clamp(6px, 0.8vh, 10px) clamp(10px, 1.2vw, 14px)',
                          fontWeight: 700,
                          fontSize: 'clamp(0.97rem, 1.3vw, 1.37rem)',
                          borderRadius: '8px 8px 0 0',
                          border: `2px solid ${analysis.color}`,
                          borderBottom: 'none'
                        }}>
                          {analysis.title}
                        </div>
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(5, 1fr)',
                          gap: 'clamp(3px, 0.5vw, 6px)',
                          padding: 'clamp(6px, 0.8vh, 10px)',
                          background: 'white',
                          border: `2px solid ${analysis.color}`,
                          borderTop: 'none',
                          borderRadius: '0 0 8px 8px',
                          flex: 1
                        }}>
                          {analysis.levels && analysis.levels.map((level, idx) => (
                            <div key={idx} style={{
                              background: '#f8fafc',
                              borderRadius: '6px',
                              padding: 'clamp(5px, 0.7vh, 8px)',
                              border: `1px solid ${analysis.color}30`
                            }}>
                              <div style={{
                                fontWeight: 700,
                                color: analysis.color,
                                marginBottom: 'clamp(2px, 0.4vh, 5px)',
                                fontSize: 'clamp(0.82rem, 1.06vw, 1.17rem)'
                              }}>
                                {level.stage}
                              </div>
                              <div style={{
                                fontSize: 'clamp(0.72rem, 0.86vw, 0.92rem)',
                                color: '#475569',
                                lineHeight: '1.3',
                                marginBottom: 'clamp(2px, 0.4vh, 5px)'
                              }}>
                                {level.description}
                              </div>
                              <div style={{
                                fontSize: 'clamp(0.67rem, 0.81vw, 0.87rem)',
                                color: '#64748b',
                                lineHeight: '1.25'
                              }}>
                                <strong>Helpful Tools:</strong> {level.tools}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </SlideGrid>
                )}

                {/* Slide 8: Analysis & Actions - Part 2 (Last 3 Pillars) */}
                {slides[currentSlide].id === 'analysis-2' && (
                  <SlideGrid $columns="1fr" style={{ paddingTop: '0', paddingBottom: '0', gap: '10px', width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                    {analysisActions.slice(3, 6).map((analysis) => (
                      <div key={analysis.id} style={{ marginBottom: '0', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <div style={{
                          background: analysis.bgColor,
                          color: 'white',
                          padding: 'clamp(6px, 0.8vh, 10px) clamp(10px, 1.2vw, 14px)',
                          fontWeight: 700,
                          fontSize: 'clamp(0.97rem, 1.3vw, 1.37rem)',
                          borderRadius: '8px 8px 0 0',
                          border: `2px solid ${analysis.color}`,
                          borderBottom: 'none'
                        }}>
                          {analysis.title}
                        </div>
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(5, 1fr)',
                          gap: 'clamp(3px, 0.5vw, 6px)',
                          padding: 'clamp(6px, 0.8vh, 10px)',
                          background: 'white',
                          border: `2px solid ${analysis.color}`,
                          borderTop: 'none',
                          borderRadius: '0 0 8px 8px',
                          flex: 1
                        }}>
                          {analysis.levels && analysis.levels.map((level, idx) => (
                            <div key={idx} style={{
                              background: '#f8fafc',
                              borderRadius: '6px',
                              padding: 'clamp(5px, 0.7vh, 8px)',
                              border: `1px solid ${analysis.color}30`
                            }}>
                              <div style={{
                                fontWeight: 700,
                                color: analysis.color,
                                marginBottom: 'clamp(2px, 0.4vh, 5px)',
                                fontSize: 'clamp(0.82rem, 1.06vw, 1.17rem)'
                              }}>
                                {level.stage}
                              </div>
                              <div style={{
                                fontSize: 'clamp(0.72rem, 0.86vw, 0.92rem)',
                                color: '#475569',
                                lineHeight: '1.3',
                                marginBottom: 'clamp(2px, 0.4vh, 5px)'
                              }}>
                                {level.description}
                              </div>
                              <div style={{
                                fontSize: 'clamp(0.67rem, 0.81vw, 0.87rem)',
                                color: '#64748b',
                                lineHeight: '1.25'
                              }}>
                                <strong>Helpful Tools:</strong> {level.tools}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </SlideGrid>
                )}

                {/* Slide 9: Customer Scenarios - ALL 5 in Compact Grid (3 + 2 centered) */}
                {slides[currentSlide].id === 'scenarios' && (
                  <div style={{ 
                    paddingTop: '15px',
                    paddingBottom: '10px',
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(6, 1fr)',
                    gridTemplateRows: 'repeat(2, 1fr)',
                    gap: '20px',
                    height: '100%',
                    width: '100%'
                  }}>
                    {engagementScenarios.map((scenario, idx) => {
                      const maturityLevels = ['1. Explore', '2. Experiment', '3. Formalize', '4. Optimize', '5. Transform'];
                      
                      // First row: 3 cards (each spans 2 columns)
                      // Second row: 2 cards centered (each spans 2 columns, with 1 column offset)
                      let gridColumn;
                      if (idx < 3) {
                        gridColumn = `${idx * 2 + 1} / span 2`;
                      } else if (idx === 3) {
                        gridColumn = '2 / span 2'; // Start at column 2
                      } else {
                        gridColumn = '4 / span 2'; // Start at column 4
                      }
                      
                      return (
                        <div key={scenario.id} style={{ 
                          display: 'flex',
                          flexDirection: 'column',
                          minHeight: 0,
                          gridColumn: gridColumn,
                          gridRow: idx < 3 ? '1' : '2'
                        }}>
                          <div style={{
                            background: scenario.bgColor,
                            color: 'white',
                            padding: '14px 16px',
                            borderRadius: '10px 10px 0 0',
                            border: `3px solid ${scenario.color}`,
                            borderBottom: 'none',
                            flexShrink: 0
                          }}>
                            <div style={{ fontWeight: 700, fontSize: '1.375rem', marginBottom: '6px', lineHeight: '1.2' }}>
                              {scenario.title}
                            </div>
                            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                              {maturityLevels.map((level, levelIdx) => (
                                <div key={levelIdx} style={{
                                  padding: '3px 6px',
                                  background: levelIdx < scenario.maturityLevel ? 'white' : 'rgba(255,255,255,0.3)',
                                  color: levelIdx < scenario.maturityLevel ? scenario.color : 'white',
                                  borderRadius: '4px',
                                  fontSize: '1.125rem',
                                  fontWeight: 600,
                                  lineHeight: '1'
                                }}>
                                  {level.slice(0, 3)}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div style={{
                            background: 'white',
                            padding: '12px 14px',
                            border: `3px solid ${scenario.color}`,
                            borderTop: 'none',
                            borderRadius: '0 0 10px 10px',
                            fontSize: '1.175rem',
                            color: '#475569',
                            lineHeight: '1.3',
                            flex: 1,
                            minHeight: 0,
                            overflow: 'auto'
                          }}>
                            {scenario.maturityDescriptions && (
                              <>
                                <div style={{ marginBottom: '6px' }}>
                                  <strong>Explore:</strong> {scenario.maturityDescriptions.explore}
                                </div>
                                <div style={{ marginBottom: '6px' }}>
                                  <strong>Experiment:</strong> {scenario.maturityDescriptions.experiment}
                                </div>
                                <div style={{ marginBottom: '6px' }}>
                                  <strong>Formalize:</strong> {scenario.maturityDescriptions.formalize}
                                </div>
                                <div style={{ marginBottom: '6px' }}>
                                  <strong>Optimize:</strong> {scenario.maturityDescriptions.optimize}
                                </div>
                                <div>
                                  <strong>Transform:</strong> {scenario.maturityDescriptions.transform}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Matrix Slides - One per Pillar */}
                {slides[currentSlide].id === 'matrices-1' && maturityMatrices[0] && (
                  <SlideGrid $columns="1fr" style={{ paddingTop: '0', paddingBottom: '0', width: '100%', height: '100%' }}>
                    {(() => {
                      const matrix = maturityMatrices[0];
                      const maturityLevels = ['1. Explore', '2. Experiment', '3. Formalize', '4. Optimize', '5. Transform'];
                      return (
                        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                          <div style={{
                            background: matrix.bgColor,
                            color: 'white',
                            padding: '16px 20px',
                            fontWeight: 700,
                            fontSize: '1.75rem',
                            borderRadius: '10px 10px 0 0',
                            border: `3px solid ${matrix.color}`,
                            borderBottom: 'none'
                          }}>
                            {matrix.title}
                          </div>
                          <div style={{
                            background: 'white',
                            border: `3px solid ${matrix.color}`,
                            borderTop: 'none',
                            borderRadius: '0 0 10px 10px',
                            overflow: 'auto',
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column'
                          }}>
                            <table style={{ width: '100%', height: '100%', borderCollapse: 'collapse', fontSize: '1rem' }}>
                              <thead>
                                <tr style={{ background: '#f8fafc' }}>
                                  <th style={{ padding: '14px 16px', border: '2px solid #e2e8f0', textAlign: 'left', fontWeight: 700, color: '#1e293b', width: '14%' }}>
                                    Dimension
                                  </th>
                                  {maturityLevels.map((level, idx) => (
                                    <th key={idx} style={{ padding: '14px 16px', border: '2px solid #e2e8f0', textAlign: 'left', fontWeight: 700, color: '#1e293b' }}>
                                      {level}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {matrix.dimensions && matrix.dimensions.map((dim, dimIdx) => (
                                  <tr key={dimIdx}>
                                    <td style={{ padding: '10px 12px', border: '1px solid #e2e8f0', fontWeight: 600, color: '#475569', verticalAlign: 'top' }}>
                                      {dim.name}
                                    </td>
                                    {dim.levels && dim.levels.map((levelDesc, levelIdx) => (
                                      <td key={levelIdx} style={{ padding: '10px 12px', border: '1px solid #e2e8f0', color: '#64748b', lineHeight: '1.5', verticalAlign: 'top' }}>
                                        {levelDesc}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      );
                    })()}
                  </SlideGrid>
                )}

                {slides[currentSlide].id === 'matrices-2' && maturityMatrices[1] && (
                  <SlideGrid $columns="1fr" style={{ paddingTop: '0', paddingBottom: '0', width: '100%', height: '100%' }}>
                    {(() => {
                      const matrix = maturityMatrices[1];
                      const maturityLevels = ['1. Explore', '2. Experiment', '3. Formalize', '4. Optimize', '5. Transform'];
                      return (
                        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                          <div style={{
                            background: matrix.bgColor,
                            color: 'white',
                            padding: '16px 20px',
                            fontWeight: 700,
                            fontSize: '1.75rem',
                            borderRadius: '10px 10px 0 0',
                            border: `3px solid ${matrix.color}`,
                            borderBottom: 'none'
                          }}>
                            {matrix.title}
                          </div>
                          <div style={{
                            background: 'white',
                            border: `3px solid ${matrix.color}`,
                            borderTop: 'none',
                            borderRadius: '0 0 10px 10px',
                            overflow: 'auto',
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column'
                          }}>
                            <table style={{ width: '100%', height: '100%', borderCollapse: 'collapse', fontSize: '1rem' }}>
                              <thead>
                                <tr style={{ background: '#f8fafc' }}>
                                  <th style={{ padding: '14px 16px', border: '2px solid #e2e8f0', textAlign: 'left', fontWeight: 700, color: '#1e293b', width: '14%' }}>
                                    Dimension
                                  </th>
                                  {maturityLevels.map((level, idx) => (
                                    <th key={idx} style={{ padding: '14px 16px', border: '2px solid #e2e8f0', textAlign: 'left', fontWeight: 700, color: '#1e293b' }}>
                                      {level}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {matrix.dimensions && matrix.dimensions.map((dim, dimIdx) => (
                                  <tr key={dimIdx}>
                                    <td style={{ padding: '10px 12px', border: '1px solid #e2e8f0', fontWeight: 600, color: '#475569', verticalAlign: 'top' }}>
                                      {dim.name}
                                    </td>
                                    {dim.levels && dim.levels.map((levelDesc, levelIdx) => (
                                      <td key={levelIdx} style={{ padding: '10px 12px', border: '1px solid #e2e8f0', color: '#64748b', lineHeight: '1.5', verticalAlign: 'top' }}>
                                        {levelDesc}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      );
                    })()}
                  </SlideGrid>
                )}

                {slides[currentSlide].id === 'matrices-3' && maturityMatrices[2] && (
                  <SlideGrid $columns="1fr" style={{ paddingTop: '0', paddingBottom: '0', width: '100%', height: '100%' }}>
                    {(() => {
                      const matrix = maturityMatrices[2];
                      const maturityLevels = ['1. Explore', '2. Experiment', '3. Formalize', '4. Optimize', '5. Transform'];
                      return (
                        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                          <div style={{
                            background: matrix.bgColor,
                            color: 'white',
                            padding: '16px 20px',
                            fontWeight: 700,
                            fontSize: '1.75rem',
                            borderRadius: '10px 10px 0 0',
                            border: `3px solid ${matrix.color}`,
                            borderBottom: 'none'
                          }}>
                            {matrix.title}
                          </div>
                          <div style={{
                            background: 'white',
                            border: `3px solid ${matrix.color}`,
                            borderTop: 'none',
                            borderRadius: '0 0 10px 10px',
                            overflow: 'auto',
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column'
                          }}>
                            <table style={{ width: '100%', height: '100%', borderCollapse: 'collapse', fontSize: '1rem' }}>
                              <thead>
                                <tr style={{ background: '#f8fafc' }}>
                                  <th style={{ padding: '14px 16px', border: '2px solid #e2e8f0', textAlign: 'left', fontWeight: 700, color: '#1e293b', width: '14%' }}>
                                    Dimension
                                  </th>
                                  {maturityLevels.map((level, idx) => (
                                    <th key={idx} style={{ padding: '14px 16px', border: '2px solid #e2e8f0', textAlign: 'left', fontWeight: 700, color: '#1e293b' }}>
                                      {level}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {matrix.dimensions && matrix.dimensions.map((dim, dimIdx) => (
                                  <tr key={dimIdx}>
                                    <td style={{ padding: '10px 12px', border: '1px solid #e2e8f0', fontWeight: 600, color: '#475569', verticalAlign: 'top' }}>
                                      {dim.name}
                                    </td>
                                    {dim.levels && dim.levels.map((levelDesc, levelIdx) => (
                                      <td key={levelIdx} style={{ padding: '10px 12px', border: '1px solid #e2e8f0', color: '#64748b', lineHeight: '1.5', verticalAlign: 'top' }}>
                                        {levelDesc}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      );
                    })()}
                  </SlideGrid>
                )}

                {slides[currentSlide].id === 'matrices-4' && maturityMatrices[3] && (
                  <SlideGrid $columns="1fr" style={{ paddingTop: '0', paddingBottom: '0', width: '100%', height: '100%' }}>
                    {(() => {
                      const matrix = maturityMatrices[3];
                      const maturityLevels = ['1. Explore', '2. Experiment', '3. Formalize', '4. Optimize', '5. Transform'];
                      return (
                        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                          <div style={{
                            background: matrix.bgColor,
                            color: 'white',
                            padding: '16px 20px',
                            fontWeight: 700,
                            fontSize: '1.75rem',
                            borderRadius: '10px 10px 0 0',
                            border: `3px solid ${matrix.color}`,
                            borderBottom: 'none'
                          }}>
                            {matrix.title}
                          </div>
                          <div style={{
                            background: 'white',
                            border: `3px solid ${matrix.color}`,
                            borderTop: 'none',
                            borderRadius: '0 0 10px 10px',
                            overflow: 'auto',
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column'
                          }}>
                            <table style={{ width: '100%', height: '100%', borderCollapse: 'collapse', fontSize: '1rem' }}>
                              <thead>
                                <tr style={{ background: '#f8fafc' }}>
                                  <th style={{ padding: '14px 16px', border: '2px solid #e2e8f0', textAlign: 'left', fontWeight: 700, color: '#1e293b', width: '14%' }}>
                                    Dimension
                                  </th>
                                  {maturityLevels.map((level, idx) => (
                                    <th key={idx} style={{ padding: '14px 16px', border: '2px solid #e2e8f0', textAlign: 'left', fontWeight: 700, color: '#1e293b' }}>
                                      {level}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {matrix.dimensions && matrix.dimensions.map((dim, dimIdx) => (
                                  <tr key={dimIdx}>
                                    <td style={{ padding: '10px 12px', border: '1px solid #e2e8f0', fontWeight: 600, color: '#475569', verticalAlign: 'top' }}>
                                      {dim.name}
                                    </td>
                                    {dim.levels && dim.levels.map((levelDesc, levelIdx) => (
                                      <td key={levelIdx} style={{ padding: '10px 12px', border: '1px solid #e2e8f0', color: '#64748b', lineHeight: '1.5', verticalAlign: 'top' }}>
                                        {levelDesc}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      );
                    })()}
                  </SlideGrid>
                )}

                {slides[currentSlide].id === 'matrices-5' && maturityMatrices[4] && (
                  <SlideGrid $columns="1fr" style={{ paddingTop: '0', paddingBottom: '0', width: '100%', height: '100%' }}>
                    {(() => {
                      const matrix = maturityMatrices[4];
                      const maturityLevels = ['1. Explore', '2. Experiment', '3. Formalize', '4. Optimize', '5. Transform'];
                      return (
                        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                          <div style={{
                            background: matrix.bgColor,
                            color: 'white',
                            padding: '16px 20px',
                            fontWeight: 700,
                            fontSize: '1.75rem',
                            borderRadius: '10px 10px 0 0',
                            border: `3px solid ${matrix.color}`,
                            borderBottom: 'none'
                          }}>
                            {matrix.title}
                          </div>
                          <div style={{
                            background: 'white',
                            border: `3px solid ${matrix.color}`,
                            borderTop: 'none',
                            borderRadius: '0 0 10px 10px',
                            overflow: 'auto',
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column'
                          }}>
                            <table style={{ width: '100%', height: '100%', borderCollapse: 'collapse', fontSize: '1rem' }}>
                              <thead>
                                <tr style={{ background: '#f8fafc' }}>
                                  <th style={{ padding: '14px 16px', border: '2px solid #e2e8f0', textAlign: 'left', fontWeight: 700, color: '#1e293b', width: '14%' }}>
                                    Dimension
                                  </th>
                                  {maturityLevels.map((level, idx) => (
                                    <th key={idx} style={{ padding: '14px 16px', border: '2px solid #e2e8f0', textAlign: 'left', fontWeight: 700, color: '#1e293b' }}>
                                      {level}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {matrix.dimensions && matrix.dimensions.map((dim, dimIdx) => (
                                  <tr key={dimIdx}>
                                    <td style={{ padding: '10px 12px', border: '1px solid #e2e8f0', fontWeight: 600, color: '#475569', verticalAlign: 'top' }}>
                                      {dim.name}
                                    </td>
                                    {dim.levels && dim.levels.map((levelDesc, levelIdx) => (
                                      <td key={levelIdx} style={{ padding: '10px 12px', border: '1px solid #e2e8f0', color: '#64748b', lineHeight: '1.5', verticalAlign: 'top' }}>
                                        {levelDesc}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      );
                    })()}
                  </SlideGrid>
                )}

                {slides[currentSlide].id === 'matrices-6' && maturityMatrices[5] && (
                  <SlideGrid $columns="1fr" style={{ paddingTop: '0', paddingBottom: '0', width: '100%', height: '100%' }}>
                    {(() => {
                      const matrix = maturityMatrices[5];
                      const maturityLevels = ['1. Explore', '2. Experiment', '3. Formalize', '4. Optimize', '5. Transform'];
                      return (
                        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                          <div style={{
                            background: matrix.bgColor,
                            color: 'white',
                            padding: '16px 20px',
                            fontWeight: 700,
                            fontSize: '1.75rem',
                            borderRadius: '10px 10px 0 0',
                            border: `3px solid ${matrix.color}`,
                            borderBottom: 'none'
                          }}>
                            {matrix.title}
                          </div>
                          <div style={{
                            background: 'white',
                            border: `3px solid ${matrix.color}`,
                            borderTop: 'none',
                            borderRadius: '0 0 10px 10px',
                            overflow: 'auto',
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column'
                          }}>
                            <table style={{ width: '100%', height: '100%', borderCollapse: 'collapse', fontSize: '1rem' }}>
                              <thead>
                                <tr style={{ background: '#f8fafc' }}>
                                  <th style={{ padding: '14px 16px', border: '2px solid #e2e8f0', textAlign: 'left', fontWeight: 700, color: '#1e293b', width: '14%' }}>
                                    Dimension
                                  </th>
                                  {maturityLevels.map((level, idx) => (
                                    <th key={idx} style={{ padding: '14px 16px', border: '2px solid #e2e8f0', textAlign: 'left', fontWeight: 700, color: '#1e293b' }}>
                                      {level}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {matrix.dimensions && matrix.dimensions.map((dim, dimIdx) => (
                                  <tr key={dimIdx}>
                                    <td style={{ padding: '10px 12px', border: '1px solid #e2e8f0', fontWeight: 600, color: '#475569', verticalAlign: 'top' }}>
                                      {dim.name}
                                    </td>
                                    {dim.levels && dim.levels.map((levelDesc, levelIdx) => (
                                      <td key={levelIdx} style={{ padding: '10px 12px', border: '1px solid #e2e8f0', color: '#64748b', lineHeight: '1.5', verticalAlign: 'top' }}>
                                        {levelDesc}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      );
                    })()}
                  </SlideGrid>
                )}

                {/* Title Slide */}
                {slides[currentSlide].id === 'title' && (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    padding: '60px',
                    gap: '40px'
                  }}>
                    <div style={{
                      fontSize: '6rem',
                      marginBottom: '20px',
                      filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.3))'
                    }}>
                      🔍
                    </div>
                    <div style={{
                      fontSize: '4.5rem',
                      fontWeight: 900,
                      color: 'white',
                      marginBottom: '20px',
                      textShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                      letterSpacing: '-0.02em'
                    }}>
                      Deep Dive Analysis
                    </div>
                    <div style={{
                      fontSize: '2rem',
                      fontWeight: 400,
                      color: 'rgba(255, 255, 255, 0.9)',
                      lineHeight: '1.6',
                      maxWidth: '900px'
                    }}>
                      Technical Maturity Assessment
                    </div>
                    <div style={{
                      fontSize: '1.5rem',
                      fontWeight: 400,
                      color: 'rgba(255, 255, 255, 0.7)',
                      marginTop: '20px'
                    }}>
                      Comprehensive insights and strategic recommendations
                    </div>
                  </div>
                )}

                {/* Thank You Slide */}
                {slides[currentSlide].id === 'thank-you' && (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    padding: '60px',
                    gap: '30px'
                  }}>
                    <div style={{
                      fontSize: '4rem',
                      fontWeight: 800,
                      color: 'white',
                      marginBottom: '20px',
                      textShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                    }}>
                      Thank You
                    </div>
                    <div style={{
                      fontSize: '1.5rem',
                      fontWeight: 400,
                      color: 'rgba(255, 255, 255, 0.9)',
                      lineHeight: '1.6',
                      maxWidth: '800px'
                    }}>
                      For your time and participation in the Technical Maturity Assessment
                    </div>
                  </div>
                )}
              </SlideContent>
            </SlideContainer>
          </SlideshowOverlay>
        )}
      </AnimatePresence>

      {/* Footer */}
      <Footer />
    </PageContainer>
  );
};

export default DeepDive;

