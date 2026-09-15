import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FiFileText, FiClock, FiCheckCircle, FiLock, FiEye, FiPlay, FiShield, FiPlus, FiExternalLink } from 'react-icons/fi';
import assignmentService from '../services/assignmentService';
import authService from '../services/authService';

const PageContainer = styled.div`
  min-height: 100vh;
  background: #f8fafc;
  padding: 100px 32px 60px;
`;

const Content = styled.div`
  max-width: 1600px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 36px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 16px;
  
  h1 {
    font-size: 2.4rem;
    font-weight: 800;
    color: #0f172a;
    margin-bottom: 8px;
  }
  
  p {
    font-size: 1.05rem;
    color: #64748b;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 32px 0 18px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #e2e8f0;

  h2 {
    font-size: 1.35rem;
    font-weight: 800;
    color: #0f172a;
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 0;
  }
`;

const AssessmentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 24px;
`;

const AssessmentCard = styled(motion.div)`
  background: white;
  border-radius: 14px;
  padding: 24px;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.06);
  cursor: ${props => props.$clickable ? 'pointer' : 'default'};
  border: 2px solid ${props => props.$accentBorder || '#e2e8f0'};
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  
  &:hover {
    border-color: ${props => props.$clickable ? '#2563eb' : (props.$accentBorder || '#e2e8f0')};
    box-shadow: ${props => props.$clickable ? '0 8px 24px rgba(37, 99, 235, 0.15)' : '0 2px 10px rgba(15, 23, 42, 0.06)'};
  }
`;

const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 700;
  margin-bottom: 14px;
  width: fit-content;
  
  ${props => {
    switch(props.$status) {
      case 'assigned':
        return `background: #fef3c7; color: #92400e;`;
      case 'in_progress':
        return `background: #dbeafe; color: #1e40af;`;
      case 'submitted':
        return `background: #e0e7ff; color: #4338ca;`;
      case 'released':
        return `background: #d1fae5; color: #065f46;`;
      case 'eu_ai_act':
        return `background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe;`;
      default:
        return `background: #f1f5f9; color: #475569;`;
    }
  }}
`;

const CardTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 6px;
`;

const CardMeta = styled.div`
  font-size: 0.85rem;
  color: #64748b;
  margin-bottom: 12px;
`;

const CardDescription = styled.p`
  color: #475569;
  font-size: 0.85rem;
  line-height: 1.5;
  margin: 8px 0;
`;

const CardActions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid #f1f5f9;
`;

const Button = styled.button`
  padding: 9px 18px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  display: flex;
  align-items: center;
  gap: 8px;
  
  ${props => props.$primary ? `
    background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
    color: white;
    
    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    }
  ` : `
    background: #f1f5f9;
    color: #334155;
    
    &:hover:not(:disabled) {
      background: #e2e8f0;
    }
  `}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 14px;
  border: 1px dashed #cbd5e1;
  
  svg {
    font-size: 3.5rem;
    color: #94a3b8;
    margin-bottom: 16px;
  }
  
  h3 {
    font-size: 1.35rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 8px;
  }
  
  p {
    font-size: 0.95rem;
    color: #64748b;
  }
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 100px 20px;
  
  p {
    font-size: 1.125rem;
    color: #64748b;
  }
`;

const MyAssessments = () => {
  const [assignments, setAssignments] = useState([]);
  const [euAiDossiers, setEuAiDossiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    
    loadAllPortfolioItems();
  }, []);

  const loadAllPortfolioItems = async () => {
    setLoading(true);
    try {
      // 1. Fetch legacy/dynamic assignments if authenticated
      if (authService.isAuthenticated()) {
        const result = await assignmentService.getMyAssignments();
        if (result.success) {
          setAssignments(result.assignments || []);
        }
      }

      // 2. Fetch EU AI Act Compliance Dossiers from Backend + LocalStorage
      const dossierMap = new Map();
      try {
        const localRaw = localStorage.getItem('scorex_eu_ai_dossiers_v2');
        if (localRaw) {
          const parsedLocal = JSON.parse(localRaw);
          Object.values(parsedLocal).forEach((d) => {
            if (d && d.dossierId) dossierMap.set(d.dossierId, d);
          });
        }
        // Scan all individual localStorage dossier records
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('scorex_eu_ai_compliance_') && key !== 'scorex_eu_ai_compliance_state') {
            const rawVal = localStorage.getItem(key);
            if (rawVal) {
              const parsed = JSON.parse(rawVal);
              const docId = parsed?.dossierId || parsed?.meta?.documentId || key.replace('scorex_eu_ai_compliance_', '');
              if (docId) {
                dossierMap.set(docId, { ...parsed, dossierId: docId });
              }
            }
          }
        }
      } catch (e) {
        // ignore local parse error
      }

      try {
        const res = await axios.get('/api/eu-ai-compliance/dossiers');
        if (res.data?.success && Array.isArray(res.data.dossiers)) {
          res.data.dossiers.forEach((d) => {
            if (d && d.dossierId) dossierMap.set(d.dossierId, d);
          });
        }
      } catch (e) {
        // ignore network error
      }

      const combinedDossiers = Array.from(dossierMap.values()).sort(
        (a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0)
      );
      setEuAiDossiers(combinedDossiers);
    } finally {
      setLoading(false);
    }
  };
  
  const getPageTitle = () => {
    if (!currentUser) return 'Unified Governance & Assessment Portfolio';
    switch(currentUser.role) {
      case 'admin':
        return 'Enterprise Assessment & EU AI Act Dossier Portfolio';
      case 'author':
        return 'My Created Assessments & Statutory Dossiers';
      case 'consumer':
        return 'My Assigned Assessments & Regulatory Dossiers';
      default:
        return 'Unified Governance & Assessment Portfolio';
    }
  };
  
  const getPageSubtitle = () => {
    return 'Centralized command center for EU AI Act Regulation (EU) 2024/1689 Statutory Dossiers and Enterprise Maturity Assessments.';
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'assigned':
        return <FiClock />;
      case 'in_progress':
        return <FiPlay />;
      case 'submitted':
        return <FiFileText />;
      case 'released':
        return <FiCheckCircle />;
      default:
        return <FiLock />;
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'assigned':
        return 'Not Started';
      case 'in_progress':
        return 'In Progress';
      case 'submitted':
        return 'Pending Review';
      case 'released':
        return 'Results Available';
      default:
        return status;
    }
  };

  const handleCardClick = (assignment) => {
    if (assignment.status === 'assigned' || assignment.status === 'in_progress') {
      navigate(`/assessment/${assignment.assessment_id}/platform_governance`);
    } else if (assignment.status === 'released') {
      navigate(`/results/${assignment.assessment_id}`);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <Content>
          <LoadingState>
            <p>Loading unified assessment portfolio...</p>
          </LoadingState>
        </Content>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Content>
        <Header>
          <div>
            <h1>{getPageTitle()}</h1>
            <p>{getPageSubtitle()}</p>
            {currentUser && currentUser.role && (
              <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.4rem', fontWeight: '600' }}>
                Viewing as: <span style={{ color: '#2563eb', textTransform: 'capitalize' }}>{currentUser.role}</span>
              </p>
            )}
          </div>
          <Button $primary onClick={() => navigate('/eu-ai-compliance')}>
            <FiPlus size={16} />
            New EU AI Act Statutory Assessment
          </Button>
        </Header>

        {/* SECTION 1: EU AI ACT STATUTORY COMPLIANCE DOSSIERS */}
        <SectionHeader>
          <h2>
            <FiShield style={{ color: '#2563eb' }} />
            🇪🇺 EU AI Act Statutory Compliance Dossiers (Regulation (EU) 2024/1689)
          </h2>
          <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#475569' }}>
            {euAiDossiers.length} Active Dossier{euAiDossiers.length === 1 ? '' : 's'}
          </span>
        </SectionHeader>

        {euAiDossiers.length === 0 ? (
          <EmptyState style={{ marginBottom: '32px' }}>
            <FiShield />
            <h3>No Saved EU AI Act Compliance Dossiers Found</h3>
            <p>Launch a new EU AI Act statutory assessment across 12 industry presets to generate a CISO, CAIO, and CFO conformity dossier.</p>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
              <Button $primary onClick={() => navigate('/eu-ai-compliance')}>
                <FiPlus size={16} />
                Launch EU AI Act Workspace
              </Button>
            </div>
          </EmptyState>
        ) : (
          <AssessmentGrid style={{ marginBottom: '44px' }}>
            {euAiDossiers.map((dossier) => {
              const meta = dossier.meta || {};
              const taskOverrides = dossier.taskStatusOverrides || {};
              const resolvedCount = Object.values(taskOverrides).filter(s => s === 'Completed' || s === 'Resolved').length;
              return (
                <AssessmentCard
                  key={dossier.dossierId}
                  $clickable
                  $accentBorder="#bfdbfe"
                  onClick={() => navigate(`/eu-ai-compliance/${dossier.dossierId}`)}
                  whileHover={{ y: -4 }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                      <StatusBadge $status="eu_ai_act">
                        🇪🇺 Dossier ID: {dossier.dossierId}
                      </StatusBadge>
                      {resolvedCount > 0 && (
                        <span style={{ background: '#dcfce7', color: '#15803d', fontSize: '0.72rem', fontWeight: '800', padding: '3px 8px', borderRadius: '999px' }}>
                          ✓ {resolvedCount} Remediated
                        </span>
                      )}
                    </div>

                    <CardTitle>{meta.systemName || 'Untitled AI System Dossier'}</CardTitle>
                    <CardMeta>
                      <strong>{meta.organizationName || 'Enterprise Organization'}</strong> • Domain: {meta.sector || 'High-Risk AI'}
                    </CardMeta>
                    <CardDescription>
                      Primary Owner: <strong>{meta.ownerName || 'CISO / CAIO Office'}</strong> ({meta.systemVersion || 'v1.0'})
                      <br />
                      Last Updated: {dossier.updatedAt ? new Date(dossier.updatedAt).toLocaleString() : 'Live Session'}
                    </CardDescription>
                  </div>

                  <CardActions>
                    <Button
                      $primary
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/eu-ai-compliance/${dossier.dossierId}`);
                      }}
                    >
                      <FiExternalLink size={15} />
                      Open Statutory Dossier
                    </Button>
                  </CardActions>
                </AssessmentCard>
              );
            })}
          </AssessmentGrid>
        )}

        {/* SECTION 2: LEGACY / ENTERPRISE MATURITY ASSESSMENTS */}
        <SectionHeader>
          <h2>
            <FiFileText style={{ color: '#4f46e5' }} />
            📊 Enterprise Data & AI Maturity Assessments
          </h2>
          <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#475569' }}>
            {assignments.length} Assessment{assignments.length === 1 ? '' : 's'}
          </span>
        </SectionHeader>

        {assignments.length === 0 ? (
          <EmptyState>
            <FiFileText />
            <h3>No Enterprise Maturity Assignments Found</h3>
            <p>Assigned pillar assessments will appear here when issued by your organization administrator.</p>
          </EmptyState>
        ) : (
          <AssessmentGrid>
            {assignments.map((assignment) => (
              <AssessmentCard
                key={assignment.id}
                $clickable={assignment.status !== 'submitted'}
                onClick={() => assignment.status !== 'submitted' && handleCardClick(assignment)}
                whileHover={{ y: assignment.status !== 'submitted' ? -4 : 0 }}
              >
                <div>
                  <StatusBadge $status={assignment.status}>
                    {getStatusIcon(assignment.status)}
                    {getStatusLabel(assignment.status)}
                  </StatusBadge>
                  
                  <CardTitle>{assignment.assessment_name}</CardTitle>
                  {assignment.organization_name && (
                    <CardMeta>{assignment.organization_name}</CardMeta>
                  )}
                  
                  {currentUser && (currentUser.role === 'admin' || currentUser.role === 'author') && assignment.consumer_email && (
                    <CardMeta style={{ color: '#3b82f6', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                      👤 Assigned to: {assignment.consumer_first_name} {assignment.consumer_last_name} ({assignment.consumer_email})
                    </CardMeta>
                  )}
                  {currentUser && currentUser.role === 'consumer' && assignment.author_email && (
                    <CardMeta style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                      Created by: {assignment.author_first_name} {assignment.author_last_name}
                    </CardMeta>
                  )}
                  
                  {assignment.status === 'submitted' && (
                    <CardDescription>
                      Your assessment has been submitted and is awaiting review by your assessment administrator.
                    </CardDescription>
                  )}
                  
                  {assignment.status === 'assigned' && (
                    <CardDescription>
                      Start your assessment to evaluate your organization's data and AI maturity.
                    </CardDescription>
                  )}
                  
                  {assignment.status === 'in_progress' && assignment.progress > 0 && (
                    <CardDescription>
                      Progress: {assignment.progress}% complete
                    </CardDescription>
                  )}
                  
                  {assignment.status === 'released' && (
                    <CardDescription>
                      Your maturity assessment results are now available to view.
                    </CardDescription>
                  )}
                </div>

                {assignment.status === 'released' && (
                  <CardActions>
                    <Button 
                      $primary
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/results/${assignment.assessment_id}`);
                      }}
                    >
                      <FiEye size={16} />
                      View Results
                    </Button>
                  </CardActions>
                )}
                
                {(assignment.status === 'assigned' || assignment.status === 'in_progress') && (
                  <CardActions>
                    <Button 
                      $primary
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/assessment/${assignment.assessment_id}/platform_governance`);
                      }}
                    >
                      <FiPlay size={16} />
                      {assignment.status === 'assigned' ? 'Start Assessment' : 'Continue'}
                    </Button>
                  </CardActions>
                )}
              </AssessmentCard>
            ))}
          </AssessmentGrid>
        )}
      </Content>
    </PageContainer>
  );
};

export default MyAssessments;
