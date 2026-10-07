import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiClock,
  FiUser,
  FiCheck,
  FiEdit3,
  FiFileText,
  FiBarChart2,
  FiTrendingUp,
  FiAlertCircle,
  FiChevronDown,
  FiChevronUp,
  FiArrowLeft,
  FiDownload,
  FiTarget,
  FiZap,
  FiShield,
  FiDatabase,
  FiEye,
  FiCommand,
  FiActivity
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import axios from 'axios';

// =======================
// STYLED COMPONENTS
// =======================

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%);
  padding: 40px 24px;
  padding-top: 108px;

  @media (max-width: 768px) {
    padding: 24px 16px;
    padding-top: 92px;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const HeaderSection = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
`;

const HeaderTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`;

const BackButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f8f9fa;
  border: 1px solid #e2e8f0;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #e2e8f0;
    transform: translateX(-4px);
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 8px 0;
  letter-spacing: -0.02em;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: #64748b;
  margin: 0;
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 24px;
`;

const SummaryCard = styled.div`
  background: linear-gradient(135deg, ${props => props.$bg1 || '#667eea'} 0%, ${props => props.$bg2 || '#764ba2'} 100%);
  padding: 20px;
  border-radius: 12px;
  color: white;
`;

const SummaryLabel = styled.div`
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.9;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const SummaryValue = styled.div`
  font-size: 1.75rem;
  font-weight: 800;
  letter-spacing: -0.02em;
`;

const TimelineContainer = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
`;

const TimelineHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
`;

const TimelineTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const FilterButton = styled(motion.button)`
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid ${props => props.$active ? '#667eea' : '#e2e8f0'};
  background: ${props => props.$active ? '#667eea' : 'white'};
  color: ${props => props.$active ? 'white' : '#64748b'};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #667eea;
    background: ${props => props.$active ? '#667eea' : '#f8f9ff'};
  }
`;

const Timeline = styled.div`
  position: relative;
  padding-left: 40px;

  &::before {
    content: '';
    position: absolute;
    left: 16px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(180deg, #667eea 0%, #e2e8f0 100%);
  }
`;

const TimelineEvent = styled(motion.div)`
  position: relative;
  margin-bottom: 32px;
  background: ${props => props.$expanded ? '#f8f9ff' : 'white'};
  border: 1px solid ${props => props.$expanded ? '#667eea' : '#e2e8f0'};
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    transform: translateX(4px);
  }

  &::before {
    content: '';
    position: absolute;
    left: -32px;
    top: 24px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: ${props => props.$dotColor || '#667eea'};
    border: 3px solid white;
    box-shadow: 0 0 0 2px ${props => props.$dotColor || '#667eea'};
  }
`;

const EventHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
`;

const EventLeft = styled.div`
  flex: 1;
`;

const EventType = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 6px;
  background: ${props => props.$bg || '#f8f9fa'};
  color: ${props => props.$color || '#475569'};
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 12px;
`;

const EventTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
`;

const EventMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 0.875rem;
  color: #64748b;
  flex-wrap: wrap;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const ExpandButton = styled(motion.button)`
  background: none;
  border: none;
  color: #667eea;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.2s;

  &:hover {
    background: #f8f9ff;
  }
`;

const EventDetails = styled(motion.div)`
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
`;

const DetailsSection = styled.div`
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const DetailsTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 12px 0;
`;

const ChangesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ChangeItem = styled.div`
  background: #f8f9fa;
  padding: 12px 16px;
  border-radius: 8px;
  border-left: 3px solid ${props => props.$color || '#667eea'};
`;

const ChangeLabel = styled.div`
  font-size: 0.75rem;
  color: #64748b;
  margin-bottom: 4px;
  font-weight: 600;
`;

const ChangeValue = styled.div`
  font-size: 0.875rem;
  color: #1e293b;
  font-weight: 500;
`;

const ImpactGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
`;

const ImpactBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 8px;
  background: ${props => props.$bg || '#f8f9ff'};
  border: 1px solid ${props => props.$border || '#e2e8f0'};
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.$color || '#475569'};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
`;

const ActionButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid ${props => props.$variant === 'primary' ? '#667eea' : '#e2e8f0'};
  background: ${props => props.$variant === 'primary' ? '#667eea' : 'white'};
  color: ${props => props.$variant === 'primary' ? 'white' : '#475569'};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.$variant === 'primary' ? '#5568d3' : '#f8f9fa'};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #64748b;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 16px;
  opacity: 0.3;
`;

const EmptyText = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 8px;
`;

const EmptySubtext = styled.div`
  font-size: 0.875rem;
  opacity: 0.8;
`;

// =======================
// HELPER FUNCTIONS
// =======================

const getEventTypeConfig = (eventType) => {
  const configs = {
    assessment_created: {
      label: 'Created',
      icon: <FiFileText />,
      bg: '#dcfce7',
      color: '#16a34a',
      dotColor: '#22c55e'
    },
    metadata_updated: {
      label: 'Updated',
      icon: <FiEdit3 />,
      bg: '#dbeafe',
      color: '#2563eb',
      dotColor: '#3b82f6'
    },
    pillar_completed: {
      label: 'Pillar Completed',
      icon: <FiCheck />,
      bg: '#fef3c7',
      color: '#ca8a04',
      dotColor: '#eab308'
    },
    assessment_completed: {
      label: 'Completed',
      icon: <FiTarget />,
      bg: '#e9d5ff',
      color: '#9333ea',
      dotColor: '#a855f7'
    },
    response_updated: {
      label: 'Response Updated',
      icon: <FiBarChart2 />,
      bg: '#f3e8ff',
      color: '#7c3aed',
      dotColor: '#8b5cf6'
    }
  };

  return configs[eventType] || {
    label: eventType,
    icon: <FiAlertCircle />,
    bg: '#f8f9fa',
    color: '#475569',
    dotColor: '#94a3b8'
  };
};

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Helper function to format change values in a human-readable way
const formatChangeValue = (value) => {
  // Debug logging
  console.log('formatChangeValue called with:', { value, type: typeof value, isArray: Array.isArray(value) });
  
  // Handle null/undefined
  if (value === null || value === undefined) {
    return <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>(empty)</span>;
  }
  
  // Handle boolean
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  
  // Handle number
  if (typeof value === 'number') {
    return value.toFixed(2);
  }
  
  // Handle string (MUST be before Array check since strings are iterable)
  if (typeof value === 'string') {
    return value || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>(empty)</span>;
  }
  
  // Handle array
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>(none)</span>;
    }
    return (
      <div style={{ marginTop: '4px' }}>
        {value.map((item, idx) => (
          <div key={idx} style={{ 
            padding: '4px 8px', 
            background: '#f8fafc', 
            borderRadius: '4px',
            marginBottom: '4px',
            border: '1px solid #e2e8f0'
          }}>
            {typeof item === 'object' && item !== null 
              ? JSON.stringify(item, null, 2) 
              : String(item)}
          </div>
        ))}
      </div>
    );
  }
  
  // Handle object
  if (typeof value === 'object') {
    const entries = Object.entries(value);
    console.log('Object entries:', entries);
    
    // If object has numeric keys (0, 1, 2...), it's likely a string that got converted
    const keys = Object.keys(value);
    const isNumericKeys = keys.every(k => !isNaN(parseInt(k)));
    
    if (isNumericKeys && keys.length > 0) {
      // Reconstruct the string from numeric keys
      const reconstructed = keys.sort((a, b) => parseInt(a) - parseInt(b)).map(k => value[k]).join('');
      console.log('Reconstructed string from object:', reconstructed);
      return reconstructed;
    }
    
    return (
      <div style={{ marginTop: '4px' }}>
        {entries.map(([k, v]) => (
          <div key={k} style={{ marginBottom: '4px' }}>
            <strong style={{ color: '#667eea' }}>{k}:</strong> {' '}
            {typeof v === 'object' ? JSON.stringify(v, null, 2) : String(v)}
          </div>
        ))}
      </div>
    );
  }
  
  // Fallback to string conversion
  return String(value);
};

// =======================
// MAIN COMPONENT
// =======================

const AssessmentHistory = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [auditData, setAuditData] = useState(null);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [expandedEvents, setExpandedEvents] = useState(new Set());

  useEffect(() => {
    fetchAuditTrail();
  }, [assessmentId]);

  useEffect(() => {
    filterEvents();
  }, [events, activeFilter]);

  const fetchAuditTrail = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/assessment/${assessmentId}/audit-trail`);
      
      if (response.data.success) {
        setAuditData(response.data.data);
        setEvents(response.data.data.events || []);
      } else {
        
      }
    } catch (error) {
      console.error('Error fetching audit trail:', error);
      
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    if (activeFilter === 'all') {
      setFilteredEvents(events);
    } else {
      setFilteredEvents(events.filter(e => e.eventType === activeFilter));
    }
  };

  const toggleEventExpansion = (eventId) => {
    setExpandedEvents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });
  };

  const renderEventDetails = (event) => {
    // Determine which actions are available based on event type and impact
    const canViewReport = event.afterSnapshot?.completedCategories?.length > 0;
    const canViewExecutive = event.afterSnapshot?.status === 'completed' || 
                            (event.afterSnapshot?.completedCategories?.length >= 3);
    const canViewPillar = event.changes?.pillar?.id;
    const canViewDashboard = event.afterSnapshot?.completedCategories?.length > 0;

    const handleViewReport = (e) => {
      e.stopPropagation();
      navigate(`/results/${assessmentId}`);
      toast.success(`Viewing full assessment report`, {
        icon: '📊'
      });
    };

    const handleViewExecutive = (e) => {
      e.stopPropagation();
      navigate(`/executive/${assessmentId}`);
      toast.success(`Opening Executive Command Center`, {
        icon: '🎯'
      });
    };

    const handleViewPillar = (e) => {
      e.stopPropagation();
      const pillarId = event.changes?.pillar?.id;
      if (pillarId) {
        navigate(`/results/${assessmentId}#pillar-${pillarId}`);
        toast.success(`Viewing ${event.changes.pillar.name} results`, {
          icon: '📈'
        });
      }
    };

    const handleViewDashboard = (e) => {
      e.stopPropagation();
      navigate(`/insights-dashboard`);
      toast.success(`Opening Dashboard`, {
        icon: '📊'
      });
    };

    return (
      <EventDetails
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Changes */}
        {event.changes && Object.keys(event.changes).length > 0 && (
          <DetailsSection>
            <DetailsTitle>Changes Made</DetailsTitle>
            <ChangesList>
              {(() => {
                console.log('event.changes:', event.changes);
                
                // Filter out numeric keys from the changes object
                const changes = Object.entries(event.changes).filter(([key]) => isNaN(parseInt(key)));
                
                // If no valid changes remain, it means the whole thing is a malformed object
                if (changes.length === 0) {
                  // Try to reconstruct if it's a string split into numeric keys
                  const keys = Object.keys(event.changes).sort((a, b) => parseInt(a) - parseInt(b));
                  const reconstructed = keys.map(k => event.changes[k]).join('');
                  return (
                    <ChangeItem $color="#667eea">
                      <ChangeLabel>Update</ChangeLabel>
                      <ChangeValue>{reconstructed}</ChangeValue>
                    </ChangeItem>
                  );
                }
                
                return changes.map(([key, value]) => (
                  <ChangeItem key={key} $color="#667eea">
                    <ChangeLabel>{key.replace(/([A-Z])/g, ' $1').trim()}</ChangeLabel>
                    {typeof value === 'object' && value !== null && value.from !== undefined && value.to !== undefined ? (
                      <ChangeValue>
                        <div style={{ marginBottom: '8px' }}>
                          <span style={{ color: '#dc2626', fontWeight: 600 }}>Before:</span>
                          <div style={{ marginLeft: '8px', marginTop: '4px' }}>
                            {formatChangeValue(value.from)}
                          </div>
                        </div>
                        <div>
                          <span style={{ color: '#16a34a', fontWeight: 600 }}>After:</span>
                          <div style={{ marginLeft: '8px', marginTop: '4px' }}>
                            {formatChangeValue(value.to)}
                          </div>
                        </div>
                      </ChangeValue>
                    ) : (
                      <ChangeValue>{formatChangeValue(value)}</ChangeValue>
                    )}
                  </ChangeItem>
                ));
              })()}
            </ChangesList>
          </DetailsSection>
        )}

        {/* Impact on Reports */}
        {event.impact && Object.keys(event.impact).length > 0 && (
          <DetailsSection>
            <DetailsTitle>Impact Analysis</DetailsTitle>
            
            {/* Show specific impact details */}
            <ChangesList style={{ marginBottom: '16px' }}>
              {event.impact.maturityScoreChanged && event.changes && event.changes.pillar && (
                <ChangeItem $color="#f59e0b">
                  <ChangeLabel>
                    <FiTrendingUp style={{ marginRight: '8px' }} />
                    Maturity Score Impact
                  </ChangeLabel>
                  <ChangeValue style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                    <div>
                      <strong>{event.changes.pillar.name || 'Pillar'}</strong> maturity score will be recalculated
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                      This affects your overall maturity level, pillar-specific recommendations, and strategic roadmap priorities
                    </div>
                  </ChangeValue>
                </ChangeItem>
              )}
              
              {event.impact.recommendationsChanged && (
                <ImpactBadge $bg="#dbeafe" $border="#60a5fa" $color="#1e40af" style={{ marginBottom: '12px' }}>
                  <FiZap /> Recommendations will be regenerated based on new responses
                </ImpactBadge>
              )}
              
              {event.impact.executiveSummaryChanged && (
                <ImpactBadge $bg="#e9d5ff" $border="#c084fc" $color="#6b21a8" style={{ marginBottom: '12px' }}>
                  <FiShield /> Executive Summary will reflect updated maturity assessment
                </ImpactBadge>
              )}
              
              {event.impact.strategicRoadmapChanged && (
                <ImpactBadge $bg="#d1fae5" $border="#6ee7b7" $color="#065f46" style={{ marginBottom: '12px' }}>
                  <FiTarget /> Strategic Roadmap phases will be adjusted based on new priorities
                </ImpactBadge>
              )}
              
              {event.impact.benchmarkingChanged && (
                <ImpactBadge $bg="#fce7f3" $border="#f9a8d4" $color="#9f1239" style={{ marginBottom: '12px' }}>
                  <FiBarChart2 /> Industry Benchmarking position will be recalculated
                </ImpactBadge>
              )}
              
              {event.impact.pillarResultsAvailable && event.changes && event.changes.pillar && (
                <ChangeItem $color="#10b981">
                  <ChangeLabel>
                    <FiDatabase style={{ marginRight: '8px' }} />
                    Pillar Results Now Available
                  </ChangeLabel>
                  <ChangeValue style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                    <div>
                      <strong>{event.changes.pillar.name || 'This pillar'}</strong> is now complete and results are available
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                      View detailed insights, recommendations, and next steps in the full report
                    </div>
                  </ChangeValue>
                </ChangeItem>
              )}
              
              {!event.impact.maturityScoreChanged && !event.impact.recommendationsChanged && 
               !event.impact.executiveSummaryChanged && !event.impact.strategicRoadmapChanged && 
               !event.impact.benchmarkingChanged && !event.impact.pillarResultsAvailable && (
                <div style={{ 
                  padding: '16px', 
                  background: '#f8f9fa', 
                  borderRadius: '8px',
                  color: '#64748b',
                  fontSize: '0.9rem',
                  textAlign: 'center'
                }}>
                  <FiAlertCircle style={{ marginRight: '8px' }} />
                  This change had minimal impact on reports. Refresh the assessment page to see updated responses.
                </div>
              )}
            </ChangesList>
            
            {/* Show detailed impact comparison if both before and after snapshots exist */}
            {event.beforeSnapshot && event.afterSnapshot && (
              <ChangesList>
                {/* Progress comparison */}
                {event.beforeSnapshot.progress !== undefined && event.afterSnapshot.progress !== undefined && 
                 event.beforeSnapshot.progress !== event.afterSnapshot.progress && (
                  <ChangeItem $color="#3b82f6">
                    <ChangeLabel>Assessment Progress</ChangeLabel>
                    <ChangeValue>
                      <span style={{ color: '#dc2626' }}>{event.beforeSnapshot.progress}%</span>
                      {' → '}
                      <span style={{ color: '#16a34a' }}>{event.afterSnapshot.progress}%</span>
                      <span style={{ 
                        marginLeft: '8px', 
                        padding: '2px 8px', 
                        borderRadius: '4px',
                        background: event.afterSnapshot.progress > event.beforeSnapshot.progress ? '#dcfce7' : '#fee2e2',
                        color: event.afterSnapshot.progress > event.beforeSnapshot.progress ? '#166534' : '#991b1b',
                        fontSize: '0.85rem',
                        fontWeight: 600
                      }}>
                        {event.afterSnapshot.progress > event.beforeSnapshot.progress ? '+' : ''}
                        {(event.afterSnapshot.progress - event.beforeSnapshot.progress).toFixed(1)}%
                      </span>
                    </ChangeValue>
                  </ChangeItem>
                )}
                
                {/* Status comparison */}
                {event.beforeSnapshot.status && event.afterSnapshot.status && 
                 event.beforeSnapshot.status !== event.afterSnapshot.status && (
                  <ChangeItem $color="#22c55e">
                    <ChangeLabel>Status</ChangeLabel>
                    <ChangeValue>
                      <span style={{ color: '#dc2626', textTransform: 'capitalize' }}>{event.beforeSnapshot.status}</span>
                      {' → '}
                      <span style={{ color: '#16a34a', textTransform: 'capitalize' }}>{event.afterSnapshot.status}</span>
                    </ChangeValue>
                  </ChangeItem>
                )}
                
                {/* Response count comparison */}
                {event.beforeSnapshot.responseCount !== undefined && event.afterSnapshot.responseCount !== undefined && 
                 event.beforeSnapshot.responseCount !== event.afterSnapshot.responseCount && (
                  <ChangeItem $color="#eab308">
                    <ChangeLabel>Total Responses</ChangeLabel>
                    <ChangeValue>
                      <span style={{ color: '#dc2626' }}>{event.beforeSnapshot.responseCount} responses</span>
                      {' → '}
                      <span style={{ color: '#16a34a' }}>{event.afterSnapshot.responseCount} responses</span>
                      <span style={{ 
                        marginLeft: '8px', 
                        padding: '2px 8px', 
                        borderRadius: '4px',
                        background: '#fef3c7',
                        color: '#92400e',
                        fontSize: '0.85rem',
                        fontWeight: 600
                      }}>
                        +{event.afterSnapshot.responseCount - event.beforeSnapshot.responseCount}
                      </span>
                    </ChangeValue>
                  </ChangeItem>
                )}
                
                {/* Completed pillars comparison */}
                {event.beforeSnapshot.completedCategories && event.afterSnapshot.completedCategories && 
                 event.beforeSnapshot.completedCategories.length !== event.afterSnapshot.completedCategories.length && (
                  <ChangeItem $color="#a855f7">
                    <ChangeLabel>Completed Pillars</ChangeLabel>
                    <ChangeValue>
                      <span style={{ color: '#dc2626' }}>{event.beforeSnapshot.completedCategories.length}</span>
                      {' → '}
                      <span style={{ color: '#16a34a' }}>{event.afterSnapshot.completedCategories.length}</span>
                      <span style={{ marginLeft: '8px', color: '#64748b', fontSize: '0.85rem' }}>
                        / {auditData?.summary?.totalPillars || 6} total
                      </span>
                    </ChangeValue>
                  </ChangeItem>
                )}
              </ChangesList>
            )}
          </DetailsSection>
        )}

        {/* After Snapshot */}
        {event.afterSnapshot && (
          <DetailsSection>
            <DetailsTitle>Snapshot After Change</DetailsTitle>
            <ChangesList>
              {event.afterSnapshot.status && (
                <ChangeItem $color="#22c55e">
                  <ChangeLabel>Status</ChangeLabel>
                  <ChangeValue>{event.afterSnapshot.status}</ChangeValue>
                </ChangeItem>
              )}
              {event.afterSnapshot.progress !== undefined && (
                <ChangeItem $color="#3b82f6">
                  <ChangeLabel>Progress</ChangeLabel>
                  <ChangeValue>{event.afterSnapshot.progress}%</ChangeValue>
                </ChangeItem>
              )}
              {event.afterSnapshot.completedCategories && (
                <ChangeItem $color="#a855f7">
                  <ChangeLabel>Completed Pillars</ChangeLabel>
                  <ChangeValue>{event.afterSnapshot.completedCategories.length} / {auditData?.summary?.totalPillars || 6}</ChangeValue>
                </ChangeItem>
              )}
              {event.afterSnapshot.responseCount !== undefined && (
                <ChangeItem $color="#eab308">
                  <ChangeLabel>Total Responses</ChangeLabel>
                  <ChangeValue>{event.afterSnapshot.responseCount}</ChangeValue>
                </ChangeItem>
              )}
            </ChangesList>
          </DetailsSection>
        )}

        {/* Action Buttons */}
        {(canViewReport || canViewExecutive || canViewPillar || canViewDashboard) && (
          <ActionButtons>
            {canViewReport && (
              <ActionButton
                $variant="primary"
                onClick={handleViewReport}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiEye /> View Full Report
              </ActionButton>
            )}
            {canViewExecutive && (
              <ActionButton
                onClick={handleViewExecutive}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiCommand /> Executive Center
              </ActionButton>
            )}
            {canViewPillar && (
              <ActionButton
                onClick={handleViewPillar}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiActivity /> View Pillar
              </ActionButton>
            )}
            {canViewDashboard && (
              <ActionButton
                onClick={handleViewDashboard}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiBarChart2 /> Dashboard
              </ActionButton>
            )}
          </ActionButtons>
        )}
      </EventDetails>
    );
  };

  if (loading) {
    return (
      <PageContainer>
        <ContentWrapper>
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '16px' }}>⏳</div>
            <div style={{ fontSize: '1.125rem', color: '#64748b' }}>Loading audit trail...</div>
          </div>
        </ContentWrapper>
      </PageContainer>
    );
  }

  if (!auditData) {
    return (
      <PageContainer>
        <ContentWrapper>
          <EmptyState>
            <EmptyIcon>📋</EmptyIcon>
            <EmptyText>No Audit Trail Found</EmptyText>
            <EmptySubtext>This assessment doesn't have any recorded history yet.</EmptySubtext>
          </EmptyState>
        </ContentWrapper>
      </PageContainer>
    );
  }

  const eventTypes = [...new Set(events.map(e => e.eventType))];

  return (
    <PageContainer>
      <ContentWrapper>
        {/* Header */}
        <HeaderSection>
          <HeaderTop>
            <BackButton
              onClick={() => navigate(`/results/${assessmentId}`)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiArrowLeft /> Back to Report
            </BackButton>
          </HeaderTop>

          <Title>{auditData.assessmentName} - History</Title>
          <Subtitle>{auditData.organizationName}</Subtitle>

          {/* Summary Cards */}
          <SummaryGrid>
            <SummaryCard $bg1="#667eea" $bg2="#764ba2">
              <SummaryLabel>
                <FiClock /> Total Events
              </SummaryLabel>
              <SummaryValue>{auditData.totalEvents}</SummaryValue>
            </SummaryCard>

            <SummaryCard $bg1="#f093fb" $bg2="#f5576c">
              <SummaryLabel>
                <FiUser /> Contributors
              </SummaryLabel>
              <SummaryValue>{auditData.summary.totalEditors}</SummaryValue>
            </SummaryCard>

            <SummaryCard $bg1="#4facfe" $bg2="#00f2fe">
              <SummaryLabel>
                <FiCheck /> Pillars Completed
              </SummaryLabel>
              <SummaryValue>
                {auditData.summary.pillarsCompleted} / {auditData.summary.totalPillars}
              </SummaryValue>
            </SummaryCard>

            <SummaryCard $bg1="#43e97b" $bg2="#38f9d7">
              <SummaryLabel>
                <FiBarChart2 /> Total Responses
              </SummaryLabel>
              <SummaryValue>{auditData.summary.responseCount}</SummaryValue>
            </SummaryCard>
          </SummaryGrid>
        </HeaderSection>

        {/* Timeline */}
        <TimelineContainer>
          <TimelineHeader>
            <TimelineTitle>
              <FiClock />
              Activity Timeline
            </TimelineTitle>

            <FilterGroup>
              <FilterButton
                $active={activeFilter === 'all'}
                onClick={() => setActiveFilter('all')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                All ({events.length})
              </FilterButton>
              {eventTypes.map(type => {
                const config = getEventTypeConfig(type);
                const count = events.filter(e => e.eventType === type).length;
                return (
                  <FilterButton
                    key={type}
                    $active={activeFilter === type}
                    onClick={() => setActiveFilter(type)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {config.label} ({count})
                  </FilterButton>
                );
              })}
            </FilterGroup>
          </TimelineHeader>

          {filteredEvents.length === 0 ? (
            <EmptyState>
              <EmptyIcon>🔍</EmptyIcon>
              <EmptyText>No events match your filter</EmptyText>
              <EmptySubtext>Try selecting a different filter</EmptySubtext>
            </EmptyState>
          ) : (
            <Timeline>
              <AnimatePresence>
                {filteredEvents.map((event, index) => {
                  const config = getEventTypeConfig(event.eventType);
                  const isExpanded = expandedEvents.has(event.id);

                  return (
                    <TimelineEvent
                      key={event.id}
                      $expanded={isExpanded}
                      $dotColor={config.dotColor}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => toggleEventExpansion(event.id)}
                    >
                      <EventHeader>
                        <EventLeft>
                          <EventType $bg={config.bg} $color={config.color}>
                            {config.icon}
                            {config.label}
                          </EventType>
                          <EventTitle>
                            {event.changes.pillar?.name || 
                             event.changes.assessmentName?.to || 
                             config.label}
                          </EventTitle>
                          <EventMeta>
                            <MetaItem>
                              <FiClock />
                              {formatTimestamp(event.timestamp)}
                            </MetaItem>
                            <MetaItem>
                              <FiUser />
                              {event.userEmail || 'System'}
                            </MetaItem>
                            {event.afterSnapshot?.progress !== undefined && (
                              <MetaItem>
                                <FiTrendingUp />
                                Progress: {event.afterSnapshot.progress}%
                              </MetaItem>
                            )}
                          </EventMeta>
                        </EventLeft>

                        <ExpandButton
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {isExpanded ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
                        </ExpandButton>
                      </EventHeader>

                      {isExpanded && renderEventDetails(event)}
                    </TimelineEvent>
                  );
                })}
              </AnimatePresence>
            </Timeline>
          )}
        </TimelineContainer>
      </ContentWrapper>
    </PageContainer>
  );
};

export default AssessmentHistory;

