import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiAlertCircle, FiEdit2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import * as assessmentService from '../services/assessmentService';
import AssessmentHeader from './AssessmentHeader';

const SummaryContainer = styled.div`
  min-height: calc(100vh - 80px);
  background: #f8f9fa;
  padding: 20px 16px;
  max-width: 1400px;
  margin: 0 auto;
`;

const BackButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #374151;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 24px;
  transition: all 0.2s;

  &:hover {
    background: #f9fafb;
    border-color: #d1d5db;
  }
`;

const HeaderSection = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const Section = styled(motion.div)`
  background: white;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const ExecutiveSummary = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const routerLocation = useLocation(); // renamed to avoid eslint warning
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const data = await assessmentService.getAssessmentResults(assessmentId);
        setResults(data);
      } catch (err) {
        console.error('Error fetching results:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (assessmentId) {
      fetchResults();
    }
  }, [assessmentId, routerLocation.key]);

  if (loading) {
    return (
      <SummaryContainer>
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '1.2rem', color: '#6b7280' }}>Loading Executive Summary...</div>
        </div>
      </SummaryContainer>
    );
  }

  if (error || !results) {
    return (
      <SummaryContainer>
        <BackButton onClick={() => navigate(`/results/${assessmentId}`)}>
          <FiArrowLeft /> Back to Results
        </BackButton>
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '1.2rem', color: '#dc2626', marginBottom: '16px' }}>
            Unable to load Executive Summary
          </div>
          <div style={{ color: '#6b7280' }}>{error || 'No summary available'}</div>
        </div>
      </SummaryContainer>
    );
  }

  return (
    <>
      <AssessmentHeader
        assessmentId={assessmentId}
        assessmentName={results?.assessmentInfo?.assessmentName || 'Executive Summary'}
        organizationName={results?.assessmentInfo?.organizationName}
        currentView="executive"
        onAssessmentUpdate={(updatedData) => {
          // Auto-refresh handled by useEffect with routerLocation.key dependency
          if (updatedData) {
            // Page will refresh automatically when navigating back
          }
        }}
        isSample={results?.assessmentInfo?.organizationName?.includes('Sample')}
      />
      
      <SummaryContainer>
        <BackButton
          onClick={() => navigate(`/results/${assessmentId}`)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
        <FiArrowLeft /> Back to Results
      </BackButton>

      <HeaderSection>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1a1a1a', marginBottom: '12px', letterSpacing: '-0.02em' }}>
              Executive Summary
            </h1>
            <p style={{ fontSize: '1.1rem', color: '#6b7280', margin: 0 }}>
              Strategic insights and business value analysis for {results.assessmentInfo?.assessmentName || 'your organization'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => {
                // Navigate to first selected pillar, or platform_governance as fallback
                const selectedPillars = results?.selectedPillars || results?.assessmentInfo?.selectedPillars;
                const targetPillar = (selectedPillars && selectedPillars.length > 0) 
                  ? selectedPillars[0] 
                  : 'platform_governance';
                navigate(`/assessment/${assessmentId}/${targetPillar}`);
                
              }}
              style={{
                padding: '10px 20px',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.9rem',
                fontWeight: 600,
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.target.style.background = '#2563eb'}
              onMouseOut={(e) => e.target.style.background = '#3b82f6'}
              title="Edit assessment responses"
            >
              <FiEdit2 size={16} />
              Edit Assessment
            </button>
          </div>
        </div>
      </HeaderSection>

      <Section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fef9c3 100%)', border: '2px solid #fbbf24', boxShadow: '0 4px 20px rgba(251, 191, 36, 0.15)' }}
      >
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#92400e', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <FiAlertCircle size={24} style={{ color: '#f59e0b' }} />
          What This Assessment Reveals
        </h2>
        
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          padding: '32px', 
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          lineHeight: '1.8'
        }}>
          {/* Strategic Situation & Business Value */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1f2937', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.5rem' }}>🎯</span> Strategic Situation & Business Value
            </h3>
            <div style={{ fontSize: '1.05rem', color: '#374151', lineHeight: '1.9' }}>
              {(() => {
                const summaryText = results.overall?.summary || results.summary || '';
                const lines = summaryText.split('\n').filter(line => line.trim());
                const strategicSection = lines.findIndex(line => line.includes('STRATEGIC SITUATION'));
                const constraintsSection = lines.findIndex(line => line.includes('CRITICAL CONSTRAINTS'));
                
                if (strategicSection >= 0) {
                  const endIdx = constraintsSection >= 0 ? constraintsSection : lines.length;
                  const insights = lines.slice(strategicSection + 1, endIdx).filter(line => line.trim() && !line.includes('STRATEGIC SITUATION'));
                  return (
                    <div style={{ background: '#f0f9ff', padding: '20px', borderRadius: '10px', border: '1px solid #bae6fd' }}>
                      {insights.map((insight, idx) => (
                        <p key={idx} style={{ marginBottom: '14px', lineHeight: '1.8' }}>
                          <span dangerouslySetInnerHTML={{ __html: insight.replace(/\*\*(.*?)\*\*/g, '<strong style="color: #1e40af;">$1</strong>').replace(/^[•\-]\s*/, '') }} />
                        </p>
                      ))}
                    </div>
                  );
                }
                return <p style={{ color: '#6b7280', fontStyle: 'italic' }}>Analyzing strategic situation...</p>;
              })()}
            </div>
          </div>

          {/* Critical Constraints */}
          <div style={{ marginBottom: '32px', padding: '24px', background: '#fef2f2', borderRadius: '10px', border: '1px solid #fecaca' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#991b1b', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.5rem' }}>⚠️</span> Critical Constraints Impacting Performance
            </h3>
            <div style={{ fontSize: '1.05rem', color: '#991b1b', lineHeight: '1.9' }}>
              {(() => {
                const summaryText = results.overall?.summary || results.summary || '';
                const lines = summaryText.split('\n').filter(line => line.trim());
                const constraintsSection = lines.findIndex(line => line.includes('CRITICAL CONSTRAINTS'));
                const enablersSection = lines.findIndex(line => line.includes('STRATEGIC ENABLERS'));
                
                if (constraintsSection >= 0) {
                  const endIdx = enablersSection >= 0 ? enablersSection : lines.length;
                  const constraints = lines.slice(constraintsSection + 1, endIdx).filter(line => line.trim() && !line.includes('CRITICAL CONSTRAINTS'));
                  return (
                    <div>
                      {constraints.length > 0 ? (
                        constraints.map((constraint, idx) => (
                          <p key={idx} style={{ marginBottom: '16px', lineHeight: '1.9' }}>
                            <span dangerouslySetInnerHTML={{ __html: constraint.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/^\d+\.\s*/, '').replace(/^[•\-]\s*/, '') }} />
                          </p>
                        ))
                      ) : (
                        <p style={{ fontStyle: 'italic' }}>No significant operational constraints identified.</p>
                      )}
                    </div>
                  );
                }
                return <p style={{ fontStyle: 'italic' }}>Analyzing operational constraints...</p>;
              })()}
            </div>
          </div>

          {/* Strategic Opportunities & Transformation Roadmap */}
          <div style={{ padding: '24px', background: '#f0fdf4', borderRadius: '10px', border: '1px solid #86efac' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#166534', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.5rem' }}>🚀</span> Transformation Roadmap & Business Value
            </h3>
            <div style={{ fontSize: '1.05rem', color: '#166534', lineHeight: '1.9' }}>
              {(() => {
                const summaryText = results.overall?.summary || results.summary || '';
                const lines = summaryText.split('\n').filter(line => line.trim());
                const enablersSection = lines.findIndex(line => line.includes('STRATEGIC ENABLERS'));
                const roadmapSection = lines.findIndex(line => line.includes('STRATEGIC ROADMAP'));
                const valueSection = lines.findIndex(line => line.includes('EXPECTED BUSINESS OUTCOMES'));
                
                const enablersLines = enablersSection >= 0 && roadmapSection >= 0 ? 
                  lines.slice(enablersSection + 1, roadmapSection).filter(line => line.trim() && !line.includes('STRATEGIC ENABLERS')) : [];
                
                const roadmapLines = roadmapSection >= 0 && valueSection >= 0 ?
                  lines.slice(roadmapSection + 1, valueSection).filter(line => line.trim() && !line.includes('STRATEGIC ROADMAP')) : [];
                
                const valueLines = valueSection >= 0 ?
                  lines.slice(valueSection + 1).filter(line => line.trim() && !line.includes('EXPECTED BUSINESS') && !line.includes('⚠️')) : [];
                
                return (
                    <div>
                      {enablersLines.length > 0 && (
                        <>
                          <p style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '14px', color: '#065f46' }}>💎 Technology-Powered Business Transformation:</p>
                          <div style={{ marginBottom: '28px' }}>
                            {enablersLines.map((line, idx) => (
                              <p key={idx} style={{ marginBottom: '14px', lineHeight: '1.9', paddingLeft: '0' }}>
                                <span dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong style="color: #059669;">$1</strong>').replace(/^\d+\.\s*/, '').replace(/^[•\-]\s*/, '') }} />
                              </p>
                            ))}
                          </div>
                        </>
                      )}
                      
                      {roadmapLines.length > 0 && (
                        <>
                          <p style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '14px', color: '#065f46' }}>📋 Phased Transformation Plan:</p>
                          <div style={{ background: '#dcfce7', padding: '18px', borderRadius: '8px', border: '1px solid #86efac', marginBottom: '28px' }}>
                            {roadmapLines.map((line, idx) => (
                              <p key={idx} style={{ marginBottom: '12px', lineHeight: '1.9', color: '#065f46' }}>
                                <span dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/^[•\-]\s*/, '') }} />
                              </p>
                            ))}
                          </div>
                        </>
                      )}
                      
                      {valueLines.length > 0 && (
                        <>
                          <p style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '14px', color: '#065f46' }}>💰 Quantified Business Outcomes:</p>
                          <div style={{ background: '#f0fdf4', padding: '18px', borderRadius: '8px', border: '2px solid #059669' }}>
                            {valueLines.map((line, idx) => (
                              <p key={idx} style={{ marginBottom: '12px', lineHeight: '1.9', color: '#065f46', fontWeight: idx === valueLines.length - 1 ? '700' : '400' }}>
                                <span dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong style="color: #059669;">$1</strong>').replace(/^[•\-]\s*/, '').replace(/^\d+\.\s*/, '') }} />
                              </p>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                );
              })()}
            </div>
          </div>
        </div>
      </Section>
    </SummaryContainer>
    </>
  );
};

export default ExecutiveSummary;

