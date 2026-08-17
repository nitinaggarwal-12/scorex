import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, 
  FiFileText, 
  FiPlus, 
  FiAward, 
  FiTrendingUp, 
  FiGrid, 
  FiMoon, 
  FiSun, 
  FiCpu, 
  FiCornerDownLeft,
  FiX
} from 'react-icons/fi';
import dynamicAssessmentService from '../services/dynamicAssessmentService';

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(8px);
  z-index: 9999;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 120px;
`;

const PaletteCard = styled(motion.div)`
  background: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  width: 90%;
  max-width: 640px;
  overflow: hidden;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6);
  color: #f8fafc;
`;

const SearchInputRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    font-size: 1.1rem;
    color: #ffffff;
    font-weight: 500;

    &::placeholder {
      color: #64748b;
    }
  }
`;

const ResultsList = styled.div`
  max-height: 400px;
  overflow-y: auto;
  padding: 12px;
`;

const ResultCategory = styled.div`
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #64748b;
  padding: 8px 12px 4px;
`;

const ResultItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-radius: 10px;
  cursor: pointer;
  background: ${props => props.$selected ? 'rgba(99, 102, 241, 0.2)' : 'transparent'};
  border: 1px solid ${props => props.$selected ? 'rgba(139, 92, 246, 0.4)' : 'transparent'};
  color: ${props => props.$selected ? '#ffffff' : '#cbd5e1'};
  transition: all 0.15s ease;

  &:hover {
    background: rgba(99, 102, 241, 0.15);
    color: #ffffff;
  }

  .left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .title {
    font-weight: 600;
    font-size: 0.9rem;
  }

  .subtitle {
    font-size: 0.78rem;
    color: #94a3b8;
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background: #090d16;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 0.75rem;
  color: #64748b;

  .keys {
    display: flex;
    gap: 8px;

    span {
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
  }
`;

const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentAssessments, setRecentAssessments] = useState([]);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      } else if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      loadRecent();
    } else {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const loadRecent = async () => {
    try {
      const list = await dynamicAssessmentService.getInstances();
      if (Array.isArray(list)) {
        setRecentAssessments(list.slice(0, 5));
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const STATIC_ACTIONS = [
    {
      id: 'gen-new',
      title: 'Generate New Assessment with AI',
      subtitle: 'Create bespoke multi-dimension maturity framework',
      icon: FiPlus,
      action: () => navigate('/assessments/generate')
    },
    {
      id: 'all-assessments',
      title: 'Browse All Assessments Hub',
      subtitle: 'View portfolio, templates, and active client evaluations',
      icon: FiGrid,
      action: () => navigate('/assessments')
    },
    {
      id: 'compare-diff',
      title: 'Compare Assessments (Progression Diff)',
      subtitle: 'Side-by-side quarter-over-quarter delta matrix',
      icon: FiTrendingUp,
      action: () => navigate('/assessments/compare')
    },
    {
      id: 'finops-sample',
      title: 'Launch FinOps Cost Optimization Assessment',
      subtitle: 'Instant pre-loaded cloud financial maturity sample',
      icon: FiAward,
      action: () => navigate('/assessments/run/finops_cloud_cost_optimization')
    },
    {
      id: 'gemini-sample',
      title: 'Launch OpenAI to Gemini Enterprise Migration',
      subtitle: 'Evaluates model latency, routing gateways & agent security',
      icon: FiCpu,
      action: () => navigate('/assessments/run/openai_to_gemini_enterprise_migration')
    }
  ];

  const filteredActions = STATIC_ACTIONS.filter(a => 
    a.title.toLowerCase().includes(query.toLowerCase()) || 
    a.subtitle.toLowerCase().includes(query.toLowerCase())
  );

  const filteredAssessments = recentAssessments.filter(a => 
    (a.customerName || '').toLowerCase().includes(query.toLowerCase()) ||
    (a.useCase || '').toLowerCase().includes(query.toLowerCase()) ||
    (a.frameworkSnapshot?.title || '').toLowerCase().includes(query.toLowerCase())
  );

  const allItems = [
    ...filteredActions.map(item => ({ ...item, category: 'Actions' })),
    ...filteredAssessments.map(item => ({
      id: item.id,
      title: item.frameworkSnapshot?.title || item.useCase || 'Assessment',
      subtitle: `${item.customerName || 'Org'} • Score: ${item.totalScore || 0}/5.0`,
      icon: FiFileText,
      category: 'Recent Assessments',
      action: () => navigate(`/assessments/report/${item.id}`)
    }))
  ];

  const handleSelect = (item) => {
    setIsOpen(false);
    item.action();
  };

  const handleKeyDownNav = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, allItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + allItems.length) % Math.max(1, allItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (allItems[selectedIndex]) {
        handleSelect(allItems[selectedIndex]);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
        >
          <PaletteCard
            initial={{ scale: 0.94, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: -20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <SearchInputRow>
              <FiSearch size={20} color="#818cf8" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search assessments, templates, or actions... (Cmd + K)"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDownNav}
              />
              <button
                onClick={() => setIsOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: 0 }}
              >
                <FiX size={18} />
              </button>
            </SearchInputRow>

            <ResultsList>
              {allItems.length === 0 ? (
                <div style={{ padding: '32px', textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>
                  No matching assessments or commands found.
                </div>
              ) : (
                allItems.map((item, idx) => {
                  const Icon = item.icon;
                  const isSelected = idx === selectedIndex;

                  return (
                    <ResultItem
                      key={item.id}
                      $selected={isSelected}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                    >
                      <div className="left">
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          background: isSelected ? 'rgba(99, 102, 241, 0.4)' : 'rgba(255, 255, 255, 0.08)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: isSelected ? '#ffffff' : '#818cf8'
                        }}>
                          <Icon size={16} />
                        </div>
                        <div>
                          <div className="title">{item.title}</div>
                          <div className="subtitle">{item.subtitle}</div>
                        </div>
                      </div>

                      {isSelected && (
                        <FiCornerDownLeft size={14} color="#818cf8" />
                      )}
                    </ResultItem>
                  );
                })
              )}
            </ResultsList>

            <Footer>
              <div className="keys">
                <span><kbd style={{ background: '#1e293b', padding: '2px 5px', borderRadius: '4px', border: '1px solid #334155' }}>↑↓</kbd> Navigate</span>
                <span><kbd style={{ background: '#1e293b', padding: '2px 5px', borderRadius: '4px', border: '1px solid #334155' }}>↵</kbd> Select</span>
                <span><kbd style={{ background: '#1e293b', padding: '2px 5px', borderRadius: '4px', border: '1px solid #334155' }}>Esc</kbd> Close</span>
              </div>
              <span>ScoreX Omnibar ⚡</span>
            </Footer>
          </PaletteCard>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
