import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiEdit3, FiHome, FiFileText, FiTarget, FiBarChart2, FiDownload } from 'react-icons/fi';
import toast from 'react-hot-toast';
import EditAssessmentModal from './EditAssessmentModal';
import { exportAssessmentToExcel } from '../services/excelExportService';

const HeaderContainer = styled.div`
  background: white;
  border-bottom: 2px solid #e5e7eb;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 68px; /* Position below GlobalNav (68px height) */
  z-index: 100;
`;

const HeaderContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 16px 20px;
  
  @media (max-width: 768px) {
    padding: 12px 16px;
  }
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  gap: 12px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 10px;
  }
`;

const TitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    width: 100%;
    gap: 8px;
  }
`;

const AssessmentName = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  
  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`;

const SampleBadge = styled.div`
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #92400e;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
  border: 1px solid #fbbf24;
  
  @media (max-width: 480px) {
    font-size: 0.7rem;
    padding: 3px 10px;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-end;
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-start;
    gap: 6px;
  }
`;

const EditButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;

  &:hover {
    background: #2563eb;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
    transform: none;
  }
`;

const ExportButton = styled.button`
  background: #10b981;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;

  &:hover {
    background: #059669;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
    transform: none;
  }
`;

const HomeButton = styled.button`
  background: white;
  color: #6b7280;
  border: 2px solid #e5e7eb;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;

  &:hover {
    background: #f9fafb;
    border-color: #d1d5db;
  }
`;

const NavigationTabs = styled.div`
  display: flex;
  gap: 4px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 4px;
  }
  
  @media (max-width: 768px) {
    gap: 2px;
    padding-bottom: 4px;
  }
`;

const Tab = styled(motion.button)`
  background: ${props => props.active ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' : 'transparent'};
  color: ${props => props.active ? 'white' : '#6b7280'};
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  white-space: nowrap;
  
  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 0.85rem;
  }
  
  @media (max-width: 480px) {
    padding: 8px 12px;
    font-size: 0.8rem;
  }
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  transition: all 0.2s;
  position: relative;

  &:hover {
    background: ${props => props.active ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' : '#f3f4f6'};
    color: ${props => props.active ? 'white' : '#374151'};
  }

  ${props => props.active && `
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
  `}
`;

const OrganizationInfo = styled.div`
  font-size: 0.85rem;
  color: #6b7280;
  margin-top: 4px;
`;

const AssessmentHeader = ({ 
  assessmentId, 
  assessmentName = 'Assessment',
  organizationName,
  currentView,
  onAssessmentUpdate,
  isSample = false
}) => {
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [assessment, setAssessment] = useState({
    id: assessmentId,
    assessmentName,
    organizationName
  });

  const handleTabClick = (view) => {
    switch(view) {
      case 'questions':
        // Navigate to first pillar (Platform & Governance)
        navigate(`/assessment/${assessmentId}/platform_governance`);
        break;
      case 'results':
        navigate(`/results/${assessmentId}`);
        break;
      case 'executive':
        navigate(`/executive-summary/${assessmentId}`);
        break;
      default:
        break;
    }
  };

  const handleUpdateAssessment = (updatedData) => {
    setAssessment(prev => ({ ...prev, ...updatedData }));
    if (onAssessmentUpdate) {
      onAssessmentUpdate(updatedData);
    }
  };

  const handleExportToExcel = async () => {
    if (!assessmentId) {
      
      return;
    }

    setIsExporting(true);
    const loadingToast = toast.loading('Exporting to Excel...');

    try {
      const result = await exportAssessmentToExcel(
        assessmentId, 
        assessment.assessmentName || assessmentName
      );
      
      toast.success(`Successfully exported: ${result.fileName}`, {
        id: loadingToast,
        duration: 4000
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export to Excel. Please try again.', {
        id: loadingToast
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <HeaderContainer>
        <HeaderContent>
          <TopRow>
            <TitleSection>
              <AssessmentName>{assessment.assessmentName || assessmentName}</AssessmentName>
              {isSample && (
                <SampleBadge>
                  🎲 Sample
                </SampleBadge>
              )}
            </TitleSection>
            
            <ActionButtons>
              <ExportButton 
                onClick={handleExportToExcel}
                disabled={isExporting}
              >
                <FiDownload size={16} />
                {isExporting ? 'Exporting...' : 'Export to Excel'}
              </ExportButton>
              {currentView !== 'pillar-results' && (
                <>
                  <EditButton onClick={() => setShowEditModal(true)}>
                    <FiEdit3 size={16} />
                    Edit
                  </EditButton>
                  <HomeButton onClick={() => navigate('/')}>
                    <FiHome size={16} />
                    Home
                  </HomeButton>
                </>
              )}
            </ActionButtons>
          </TopRow>

          {assessment.organizationName && (
            <OrganizationInfo>
              {assessment.organizationName}
            </OrganizationInfo>
          )}

          <NavigationTabs>
            <Tab
              active={currentView === 'questions' || currentView === 'pillar-results'}
              onClick={() => handleTabClick('questions')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiEdit3 size={16} />
              {currentView === 'pillar-results' ? 'Edit Assessment' : 'Questions'}
            </Tab>
            <Tab
              active={currentView === 'results'}
              onClick={() => handleTabClick('results')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiBarChart2 size={16} />
              Overall Results
            </Tab>
            {currentView !== 'pillar-results' && (
              <Tab
                active={currentView === 'executive'}
                onClick={() => handleTabClick('executive')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiTarget size={16} />
                Executive Summary
              </Tab>
            )}
          </NavigationTabs>
        </HeaderContent>
      </HeaderContainer>

      {showEditModal && (
        <EditAssessmentModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          assessment={assessment}
          onUpdate={handleUpdateAssessment}
        />
      )}
    </>
  );
};

export default AssessmentHeader;

