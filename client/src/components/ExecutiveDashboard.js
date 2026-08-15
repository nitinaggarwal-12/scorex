import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  FiTrendingUp,
  FiDollarSign,
  FiAlertTriangle,
  FiAward,
  FiTarget,
  FiZap,
  FiShield,
  FiClock,
  FiEdit2,
  FiTrash2,
  FiPlus
} from 'react-icons/fi';
import toast from 'react-hot-toast';

// =====================
// STYLED COMPONENTS
// =====================

const DashboardContainer = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 48px;
  border-radius: 16px;
  margin-bottom: 40px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -10%;
    width: 600px;
    height: 600px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 50%;
  }

  @media (max-width: 768px) {
    padding: 32px 24px;
  }

  /* 🖨️ PRINT: Keep entire component together */
  @media print {
    page-break-inside: avoid !important;
    break-inside: avoid-page !important;
    page-break-before: auto !important;
    page-break-after: auto !important;
    margin-bottom: 20px !important;
    padding: 32px !important;
    background: white !important;
    border: 2px solid #667eea !important;
    
    &::before {
      display: none !important;
    }
    
    /* Preserve colors in print */
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
  }
`;

const DashboardHeader = styled.div`
  position: relative;
  z-index: 1;
  margin-bottom: 32px;
`;

const DashboardTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const DashboardSubtitle = styled.p`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 32px;
  position: relative;
  z-index: 1;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const MetricCard = styled(motion.div)`
  position: relative;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
  }
`;

const MetricHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const MetricLabel = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const MetricIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.$bg || '#3b82f6'};
  color: white;
`;

const MetricValue = styled(motion.div)`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
  font-family: 'JetBrains Mono', monospace;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const MetricChange = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.$positive ? '#10b981' : '#ef4444'};
`;

const MetricSubtext = styled.div`
  font-size: 0.813rem;
  color: #64748b;
  margin-top: 4px;
`;

const CompetitiveSection = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 32px;
  margin-bottom: 32px;
  position: relative;
  z-index: 1;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 24px 0;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const PositionBar = styled.div`
  position: relative;
  height: 60px;
  background: linear-gradient(90deg, 
    #ef4444 0%, 
    #f59e0b 25%, 
    #eab308 50%, 
    #84cc16 75%, 
    #10b981 100%
  );
  border-radius: 30px;
  margin: 24px 0;
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const PositionMarker = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: ${props => props.$position}%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  z-index: 2;

  &::after {
    content: 'YOU';
    position: absolute;
    bottom: -28px;
    font-size: 0.75rem;
    font-weight: 700;
    color: #1e293b;
    white-space: nowrap;
  }
`;

const PositionLabels = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
  padding: 0 10px;
`;

const PositionLabel = styled.div`
  text-align: center;
  flex: 1;

  .label {
    font-size: 0.813rem;
    font-weight: 600;
    color: #64748b;
    margin-bottom: 4px;
  }

  .percentage {
    font-size: 0.75rem;
    color: #94a3b8;
  }
`;

const ImperativesSection = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 32px;
  position: relative;
  z-index: 1;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const ImperativeCard = styled(motion.div)`
  position: relative;
  background: white;
  border: 2px solid #e5e7eb;
  border-left: 4px solid ${props => props.$color || '#3b82f6'};
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 16px;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${props => props.$color || '#3b82f6'};
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    transform: translateX(4px);
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const ImperativeHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
`;

const ImperativeNumber = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: ${props => props.$color || '#3b82f6'};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.125rem;
  flex-shrink: 0;
`;

const ImperativeContent = styled.div`
  flex: 1;
`;

const ImperativeTitle = styled.div`
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
`;

const ImperativeImpact = styled.div`
  font-size: 0.875rem;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const ImpactBadge = styled.span`
  background: ${props => props.$bg || '#dbeafe'};
  color: ${props => props.$color || '#1e40af'};
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
`;

// Interactive Elements
const CardActions = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 10;

  ${MetricCard}:hover &,
  ${ImperativeCard}:hover & {
    opacity: 1;
  }

  @media (max-width: 768px) {
    opacity: 1;
  }

  @media print {
    display: none !important;
  }
`;

const IconButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    background: #3b82f6;
    color: white;
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const AddButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: 0;
  margin-bottom: 16px;

  ${ImperativesSection}:hover & {
    opacity: 1;
  }

  @media (max-width: 768px) {
    opacity: 1;
  }

  &:hover {
    background: #2563eb;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  @media print {
    display: none !important;
  }
`;

// Modal Styled Components
const ModalOverlay = styled.div`
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

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 24px 0;
  display: flex;
  align-items: center;
  gap: 12px;
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
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
`;

const Input = styled.input`
  padding: 12px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const TextArea = styled.textarea`
  padding: 12px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  min-height: 100px;
  font-family: inherit;
  resize: vertical;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
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
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;

  ${props => props.$variant === 'primary' ? `
    background: #3b82f6;
    color: white;
    &:hover {
      background: #2563eb;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }
  ` : `
    background: #f1f5f9;
    color: #64748b;
    &:hover {
      background: #e2e8f0;
    }
  `}

  &:active {
    transform: translateY(0);
  }
`;

// =====================
// COMPONENT
// =====================

const ExecutiveDashboard = ({ results, assessment, hideImperatives = false }) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [animatedRevenue, setAnimatedRevenue] = useState(0);
  const [animatedRisks, setAnimatedRisks] = useState(0);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(''); // 'imperative'
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    impact: '',
    timeline: '',
    priority: '',
    color: ''
  });

  // Editable strategic imperatives
  const [imperatives, setImperatives] = useState([]);

  // FIX: API returns results.overall.currentScore, not results.overallScore
  const overallScore = results?.overall?.currentScore || results?.overallScore || 0;
  const categoryDetails = results?.categoryDetails || {};
  
  // Calculate metrics
  const maturityScore = overallScore.toFixed(1);
  const maturityChange = 0.8; // Could be calculated from previous assessment
  
  // Calculate revenue opportunity (simplified - should come from backend)
  const revenueOpportunity = calculateRevenueOpportunity(categoryDetails);
  
  // Calculate risk exposure
  const riskExposure = calculateRiskExposure(results);
  
  // Calculate competitive position (percentile)
  const competitivePosition = calculateCompetitivePosition(overallScore);
  
  // Get top 3 strategic imperatives (initial load)
  const strategicImperatives = imperatives.length > 0 ? imperatives : getStrategicImperatives(results, categoryDetails);

  // Initialize imperatives on first load
  useEffect(() => {
    if (imperatives.length === 0 && results) {
      const initialImperatives = getStrategicImperatives(results, categoryDetails);
      setImperatives(initialImperatives);
    }
  }, [results, categoryDetails, imperatives.length]);

  // Animate numbers on mount
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setAnimatedScore(overallScore * progress);
      setAnimatedRevenue(revenueOpportunity * progress);
      setAnimatedRisks(Math.floor(riskExposure.count * progress));

      if (currentStep >= steps) {
        clearInterval(timer);
        setAnimatedScore(overallScore);
        setAnimatedRevenue(revenueOpportunity);
        setAnimatedRisks(riskExposure.count);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [overallScore, revenueOpportunity, riskExposure.count]);

  // Handler functions
  const handleAdd = () => {
    setModalType('imperative');
    setEditingItem(null);
    setFormData({
      title: '',
      impact: '',
      timeline: '',
      priority: 'Medium',
      color: '#3b82f6'
    });
    setModalOpen(true);
  };

  const handleEdit = (type, item, index) => {
    setModalType(type);
    setEditingItem({ ...item, index });
    setFormData({
      title: item.title || '',
      impact: item.impact || '',
      timeline: item.timeline || '',
      priority: item.priority || 'Medium',
      color: item.color || '#3b82f6'
    });
    setModalOpen(true);
  };

  const handleDelete = (type, index) => {
    if (type === 'imperative') {
      setImperatives(prev => prev.filter((_, i) => i !== index));
      
    }
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    
    if (modalType === 'imperative') {
      if (editingItem !== null) {
        // Edit existing
        setImperatives(prev => prev.map((imp, i) => 
          i === editingItem.index ? { ...formData } : imp
        ));
        
      } else {
        // Add new
        setImperatives(prev => [...prev, { ...formData, id: Date.now() }]);
        
      }
    }
    
    setModalOpen(false);
    setEditingItem(null);
  };

  const handleCancel = () => {
    setModalOpen(false);
    setEditingItem(null);
  };

  return (
    <DashboardContainer>
      <DashboardHeader>
        <DashboardTitle>
          <FiTarget size={32} />
          Executive Command Center
        </DashboardTitle>
        <DashboardSubtitle>
          Real-time insights into your data platform maturity and business impact
        </DashboardSubtitle>
      </DashboardHeader>

      {/* Key Metrics */}
      <MetricsGrid>
        <MetricCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <MetricHeader>
            <MetricLabel>Maturity Score</MetricLabel>
            <MetricIcon $bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
              <FiAward size={20} />
            </MetricIcon>
          </MetricHeader>
          <MetricValue>
            {animatedScore.toFixed(1)}<span style={{ fontSize: '1.5rem', color: '#94a3b8' }}>/5.0</span>
          </MetricValue>
          <MetricChange $positive={maturityChange > 0}>
            <FiTrendingUp size={16} />
            +{maturityChange.toFixed(1)} from baseline
          </MetricChange>
          <MetricSubtext>
            {getMaturityLabel(overallScore)}
          </MetricSubtext>
        </MetricCard>

        <MetricCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <MetricHeader>
            <MetricLabel>Revenue Opportunity</MetricLabel>
            <MetricIcon $bg="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)">
              <FiDollarSign size={20} />
            </MetricIcon>
          </MetricHeader>
          <MetricValue>
            ${(animatedRevenue / 1000000).toFixed(1)}M
          </MetricValue>
          <MetricChange $positive={true}>
            <FiTrendingUp size={16} />
            Annual potential
          </MetricChange>
          <MetricSubtext>
            Based on maturity improvements
          </MetricSubtext>
        </MetricCard>

        <MetricCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <MetricHeader>
            <MetricLabel>Risk Exposure</MetricLabel>
            <MetricIcon $bg="linear-gradient(135deg, #fa709a 0%, #fee140 100%)">
              <FiAlertTriangle size={20} />
            </MetricIcon>
          </MetricHeader>
          <MetricValue style={{ color: riskExposure.level === 'HIGH' ? '#ef4444' : riskExposure.level === 'MEDIUM' ? '#f59e0b' : '#10b981' }}>
            {riskExposure.level}
          </MetricValue>
          <MetricChange $positive={false}>
            <FiShield size={16} />
            {animatedRisks} critical gaps
          </MetricChange>
          <MetricSubtext>
            Requires immediate attention
          </MetricSubtext>
        </MetricCard>
      </MetricsGrid>

      {/* Competitive Positioning */}
      <CompetitiveSection>
        <SectionTitle>
          <FiTarget />
          Competitive Positioning
        </SectionTitle>
        <div style={{ fontSize: '1rem', color: '#64748b', marginBottom: '16px' }}>
          You rank in the <strong style={{ color: '#1e293b' }}>{competitivePosition.percentile}th percentile</strong> - {competitivePosition.tier}
        </div>
        <PositionBar>
          <PositionMarker
            $position={competitivePosition.percentile}
            initial={{ left: '0%' }}
            animate={{ left: `${competitivePosition.percentile}%` }}
            transition={{ duration: 2, ease: 'easeOut', delay: 0.5 }}
          >
            ⭐
          </PositionMarker>
        </PositionBar>
        <PositionLabels>
          <PositionLabel>
            <div className="label">Laggard</div>
            <div className="percentage">0-25%</div>
          </PositionLabel>
          <PositionLabel>
            <div className="label">Average</div>
            <div className="percentage">25-50%</div>
          </PositionLabel>
          <PositionLabel>
            <div className="label">Fast Follower</div>
            <div className="percentage">50-75%</div>
          </PositionLabel>
          <PositionLabel>
            <div className="label">Leader</div>
            <div className="percentage">75-100%</div>
          </PositionLabel>
        </PositionLabels>
      </CompetitiveSection>

      {/* Top 3 Strategic Imperatives */}
      {!hideImperatives && (
        <ImperativesSection>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <SectionTitle style={{ margin: 0 }}>
              <FiZap />
              Top 3 Strategic Imperatives
            </SectionTitle>
            <AddButton onClick={handleAdd}>
              <FiPlus size={16} />
              Add Imperative
            </AddButton>
          </div>
          {strategicImperatives.map((imperative, index) => (
            <ImperativeCard
              key={imperative.id || index}
              $color={imperative.color}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
            >
              <CardActions>
                <IconButton onClick={() => handleEdit('imperative', imperative, index)} title="Edit">
                  <FiEdit2 size={14} />
                </IconButton>
                <IconButton onClick={() => handleDelete('imperative', index)} title="Delete">
                  <FiTrash2 size={14} />
                </IconButton>
              </CardActions>
              <ImperativeHeader>
                <ImperativeNumber $color={imperative.color}>
                  {index + 1}
                </ImperativeNumber>
                <ImperativeContent>
                  <ImperativeTitle>{imperative.title}</ImperativeTitle>
                  <ImperativeImpact>
                    <ImpactBadge $bg="#dcfce7" $color="#166534">
                      <FiDollarSign size={12} style={{ display: 'inline', marginRight: '2px' }} />
                      {imperative.impact}
                    </ImpactBadge>
                    <ImpactBadge $bg="#dbeafe" $color="#1e40af">
                      <FiClock size={12} style={{ display: 'inline', marginRight: '2px' }} />
                      {imperative.timeline}
                    </ImpactBadge>
                    <ImpactBadge $bg="#fef3c7" $color="#92400e">
                      <FiTarget size={12} style={{ display: 'inline', marginRight: '2px' }} />
                      {imperative.priority}
                    </ImpactBadge>
                  </ImperativeImpact>
                </ImperativeContent>
              </ImperativeHeader>
            </ImperativeCard>
          ))}
        </ImperativesSection>
      )}

      {/* Edit Modal */}
      {modalOpen && (
        <ModalOverlay onClick={handleCancel}>
          <ModalContent
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <ModalTitle>
              <FiZap />
              {editingItem ? 'Edit Strategic Imperative' : 'Add Strategic Imperative'}
            </ModalTitle>
            <Form onSubmit={handleSubmitForm}>
              <FormGroup>
                <Label>Title</Label>
                <Input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Deploy Unity Catalog for centralized governance"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Impact</Label>
                <Input
                  type="text"
                  value={formData.impact}
                  onChange={(e) => setFormData({ ...formData, impact: e.target.value })}
                  placeholder="e.g., Reduce compliance risk 60%"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Timeline</Label>
                <Input
                  type="text"
                  value={formData.timeline}
                  onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                  placeholder="e.g., 4-6 weeks"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Priority</Label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  style={{
                    padding: '12px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                >
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </FormGroup>

              <FormGroup>
                <Label>Color</Label>
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  style={{
                    width: '100%',
                    height: '50px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                />
              </FormGroup>

              <ButtonGroup>
                <Button type="button" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button type="submit" $variant="primary">
                  {editingItem ? 'Update' : 'Add'} Imperative
                </Button>
              </ButtonGroup>
            </Form>
          </ModalContent>
        </ModalOverlay>
      )}
    </DashboardContainer>
  );
};

// =====================
// HELPER FUNCTIONS
// =====================

function calculateRevenueOpportunity(categoryDetails) {
  // Simplified calculation - should be more sophisticated in production
  let totalOpportunity = 0;
  
  Object.values(categoryDetails).forEach(category => {
    const gap = (category.futureScore || 0) - (category.currentScore || 0);
    // Each maturity point improvement = ~$400K in value
    totalOpportunity += gap * 400000;
  });
  
  return Math.max(totalOpportunity, 500000); // Minimum $500K
}

function calculateRiskExposure(results) {
  const categoryDetails = results?.categoryDetails || {};
  let criticalGaps = 0;
  
  Object.values(categoryDetails).forEach(category => {
    const gap = (category.futureScore || 0) - (category.currentScore || 0);
    if (gap >= 2) criticalGaps++;
  });
  
  let level = 'LOW';
  if (criticalGaps >= 3) level = 'HIGH';
  else if (criticalGaps >= 1) level = 'MEDIUM';
  
  return { level, count: criticalGaps };
}

function calculateCompetitivePosition(overallScore) {
  // Map score to percentile (simplified - should use actual industry data)
  const percentile = Math.min(Math.round((overallScore / 5) * 100), 95);
  
  let tier = 'Laggard';
  if (percentile >= 75) tier = 'Market Leader';
  else if (percentile >= 50) tier = 'Fast Follower';
  else if (percentile >= 25) tier = 'Industry Average';
  
  return { percentile, tier };
}

function getMaturityLabel(score) {
  if (score >= 4.5) return 'Optimized & Innovative';
  if (score >= 3.5) return 'Maturing & Scaling';
  if (score >= 2.5) return 'Developing Capabilities';
  if (score >= 1.5) return 'Initial & Ad-hoc';
  return 'Emerging Practices';
}

function getStrategicImperatives(results, categoryDetails) {
  // Get top 3 gaps
  const gaps = Object.entries(categoryDetails).map(([id, data]) => ({
    id,
    name: data.name || id,
    gap: (data.futureScore || 0) - (data.currentScore || 0),
    currentScore: data.currentScore || 0
  })).sort((a, b) => b.gap - a.gap);
  
  const imperatives = [];
  const colors = ['#ef4444', '#f59e0b', '#3b82f6'];
  
  gaps.slice(0, 3).forEach((gap, index) => {
    let title = '';
    let impact = '';
    let timeline = '';
    
    // Customize based on pillar
    if (gap.id.includes('platform') || gap.id.includes('governance')) {
      title = 'Deploy Unity Catalog for centralized governance';
      impact = 'Reduce compliance risk 60%';
      timeline = '4-6 weeks';
    } else if (gap.id.includes('data_engineering')) {
      title = 'Implement Lakeflow Connect for data ingestion';
      impact = 'Accelerate ingestion 10x';
      timeline = '6-8 weeks';
    } else if (gap.id.includes('genai') || gap.id.includes('generative')) {
      title = 'Launch Mosaic AI Agents for GenAI apps';
      impact = 'Unlock $800K revenue';
      timeline = '8-12 weeks';
    } else if (gap.id.includes('machine_learning') || gap.id.includes('ml')) {
      title = 'Deploy Mosaic AI Model Serving for production ML';
      impact = 'Reduce deployment time 70%';
      timeline = '6-8 weeks';
    } else if (gap.id.includes('analytics')) {
      title = 'Scale Databricks SQL with serverless warehouses';
      impact = 'Improve query speed 3x';
      timeline = '2-4 weeks';
    } else {
      title = `Improve ${gap.name} maturity`;
      impact = `Close ${gap.gap.toFixed(1)} point gap`;
      timeline = '6-8 weeks';
    }
    
    imperatives.push({
      title,
      impact,
      timeline,
      priority: index === 0 ? 'Critical' : index === 1 ? 'High' : 'Medium',
      color: colors[index]
    });
  });
  
  return imperatives;
}

export default ExecutiveDashboard;

