import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiFolder, 
  FiPlus, 
  FiEye, 
  FiCopy, 
  FiTrash2, 
  FiCalendar,
  FiUser,
  FiMail,
  FiBarChart2,
  FiCheckCircle,
  FiClock,
  FiEdit3,
  FiSearch,
  FiFilter,
  FiDownload
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import * as assessmentService from '../services/assessmentService';
import { exportAssessmentToExcel } from '../services/excelExportService';
import LoadingSpinner from './LoadingSpinner';

const ManagementContainer = styled.div`
  min-height: calc(100vh - 80px);
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 40px 20px;
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const HeaderSection = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 40px;
  margin-bottom: 32px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
`;

const HeaderTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
`;

const HeaderSubtitle = styled.p`
  font-size: 1.1rem;
  color: #6b7280;
  margin-bottom: 32px;
`;

const ActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 32px;
`;

const SearchBar = styled.div`
  position: relative;
  flex: 1;
  max-width: 400px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px 12px 44px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 14px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
`;

const ActionButton = styled(motion.button)`
  padding: 12px 20px;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;

  ${props => props.variant === 'primary' && `
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
    }
  `}

  ${props => props.variant === 'secondary' && `
    background: white;
    color: #374151;
    border: 2px solid #e5e7eb;
    
    &:hover {
      border-color: #3b82f6;
      color: #3b82f6;
    }
  `}
`;

const AssessmentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 24px;
`;

const AssessmentCard = styled(motion.div)`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
`;

const CardStatus = styled.span`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  
  ${props => props.status === 'completed' && `
    background: #dcfce7;
    color: #166534;
  `}
  
  ${props => props.status === 'in_progress' && `
    background: #fef3c7;
    color: #92400e;
  `}
`;

const CardInfo = styled.div`
  margin-bottom: 16px;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 14px;
  color: #6b7280;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #f3f4f6;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 16px;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  width: ${props => props.percentage}%;
  transition: width 0.3s ease;
`;

const CardActions = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const CardButton = styled(motion.button)`
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;

  ${props => props.variant === 'view' && `
    background: #eff6ff;
    color: #1d4ed8;
    
    &:hover {
      background: #dbeafe;
    }
  `}

  ${props => props.variant === 'clone' && `
    background: #f0fdf4;
    color: #166534;
    
    &:hover {
      background: #dcfce7;
    }
  `}

  ${props => props.variant === 'delete' && `
    background: #fef2f2;
    color: #dc2626;
    
    &:hover {
      background: #fee2e2;
    }
  `}

  ${props => props.variant === 'continue' && `
    background: #fff7ed;
    color: #ea580c;
    
    &:hover {
      background: #fed7aa;
    }
  `}

  ${props => props.variant === 'export' && `
    background: #ecfdf5;
    color: #059669;
    
    &:hover {
      background: #d1fae5;
    }
  `}
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const EmptyIcon = styled.div`
  width: 80px;
  height: 80px;
  background: #f3f4f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  color: #9ca3af;
`;

const EmptyTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 12px;
`;

const EmptyDescription = styled.p`
  color: #6b7280;
  margin-bottom: 32px;
`;

const CloneModal = styled(motion.div)`
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
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 16px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
`;

const AssessmentManagement = () => {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState([]); // Initialize as empty array
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCloneModal, setShowCloneModal] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [cloneData, setCloneData] = useState({
    contactEmail: '',
    assessmentName: '',
    assessmentDescription: ''
  });

  useEffect(() => {
    loadAssessments();
  }, []);

  const loadAssessments = async () => {
    try {
      setLoading(true);
      const data = await assessmentService.getAllAssessments();
      setAssessments(data || []); // Ensure it's always an array
    } catch (error) {
      console.error('Error loading assessments:', error);
      
      setAssessments([]); // Set to empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleClone = (assessment) => {
    setSelectedAssessment(assessment);
    setCloneData({
      contactEmail: assessment.contactEmail,
      assessmentName: `${assessment.assessmentName} (Copy)`,
      assessmentDescription: assessment.assessmentDescription || ''
    });
    setShowCloneModal(true);
  };

  const confirmClone = async () => {
    try {
      const clonedAssessment = await assessmentService.cloneAssessment(
        selectedAssessment.id,
        cloneData
      );
      
      
      setShowCloneModal(false);
      setSelectedAssessment(null);
      
      // Navigate to the cloned assessment
      navigate(`/assessment/${clonedAssessment.assessmentId}/platform_governance`);
    } catch (error) {
      console.error('Error cloning assessment:', error);
      
    }
  };

  const handleDelete = async (assessmentId) => {
    if (window.confirm('Are you sure you want to delete this assessment? This action cannot be undone.')) {
      try {
        await assessmentService.deleteAssessment(assessmentId);
        
        loadAssessments();
      } catch (error) {
        console.error('Error deleting assessment:', error);
        
      }
    }
  };

  const handleExport = async (assessment) => {
    const loadingToast = toast.loading('Exporting to Excel...');
    
    try {
      const result = await exportAssessmentToExcel(
        assessment.id, 
        assessment.assessmentName
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
    }
  };

  const filteredAssessments = (assessments || []).filter(assessment =>
    assessment.organizationName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assessment.contactEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assessment.assessmentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (assessment.assessmentDescription && assessment.assessmentDescription.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <ManagementContainer>
        <LoadingSpinner message="Loading assessments..." />
      </ManagementContainer>
    );
  }

  return (
    <ManagementContainer>
      <ContentWrapper>
        <HeaderSection
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <HeaderTitle>
            <FiFolder size={32} />
            Assessment Management
          </HeaderTitle>
          <HeaderSubtitle>
            Manage your past assessments, view results, and create new assessments based on previous ones.
          </HeaderSubtitle>

          <ActionBar>
            <SearchBar>
              <SearchIcon>
                <FiSearch size={18} />
              </SearchIcon>
              <SearchInput
                type="text"
                placeholder="Search by assessment name, organization, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </SearchBar>

            <ActionButtons>
              <ActionButton
                variant="primary"
                onClick={() => navigate('/start')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiPlus size={16} />
                New Assessment
              </ActionButton>
            </ActionButtons>
          </ActionBar>
        </HeaderSection>

        {filteredAssessments.length === 0 ? (
          <EmptyState>
            <EmptyIcon>
              <FiFolder size={32} />
            </EmptyIcon>
            <EmptyTitle>No Assessments Found</EmptyTitle>
            <EmptyDescription>
              {searchTerm ? 'No assessments match your search criteria.' : 'You haven\'t created any assessments yet.'}
            </EmptyDescription>
            <ActionButton
              variant="primary"
              onClick={() => navigate('/start')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiPlus size={16} />
              Create Your First Assessment
            </ActionButton>
          </EmptyState>
        ) : (
          <AssessmentGrid>
            {filteredAssessments.map((assessment, index) => (
              <AssessmentCard
                key={assessment.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <CardHeader>
                  <div>
                    <CardTitle>{assessment.assessmentName}</CardTitle>
                    <div style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '4px' }}>
                      {assessment.organizationName}
                    </div>
                    <CardStatus status={assessment.status}>
                      {assessment.status === 'completed' ? 'Completed' : 'In Progress'}
                    </CardStatus>
                  </div>
                </CardHeader>

                <CardInfo>
                  {assessment.assessmentDescription && (
                    <div style={{ 
                      fontSize: '0.9rem', 
                      color: '#4b5563', 
                      marginBottom: '12px',
                      fontStyle: 'italic'
                    }}>
                      {assessment.assessmentDescription}
                    </div>
                  )}
                  <InfoRow>
                    <FiUser size={14} />
                    {assessment.contactEmail}
                  </InfoRow>
                  <InfoRow>
                    <FiCalendar size={14} />
                    Started: {formatDate(assessment.startedAt)}
                  </InfoRow>
                  {assessment.completedAt && (
                    <InfoRow>
                      <FiCheckCircle size={14} />
                      Completed: {formatDate(assessment.completedAt)}
                    </InfoRow>
                  )}
                </CardInfo>

                <ProgressBar>
                  <ProgressFill percentage={assessment.progress} />
                </ProgressBar>

                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '16px' }}>
                  {assessment.completedCategories.length} of {assessment.totalCategories} pillars completed ({assessment.progress}%)
                </div>

                <CardActions>
                  <CardButton
                    variant="view"
                    onClick={() => navigate(`/results/${assessment.id}`)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiBarChart2 size={12} />
                    View Results
                  </CardButton>

                  <CardButton
                    variant="export"
                    onClick={() => handleExport(assessment)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiDownload size={12} />
                    Export
                  </CardButton>

                  <CardButton
                    variant="clone"
                    onClick={() => handleClone(assessment)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiCopy size={12} />
                    Clone
                  </CardButton>

                  {assessment.status === 'in_progress' && (
                    <CardButton
                      variant="continue"
                      onClick={() => navigate(`/assessment/${assessment.id}/platform_governance`)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FiEdit3 size={12} />
                      Continue
                    </CardButton>
                  )}

                  <CardButton
                    variant="delete"
                    onClick={() => handleDelete(assessment.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiTrash2 size={12} />
                    Delete
                  </CardButton>
                </CardActions>
              </AssessmentCard>
            ))}
          </AssessmentGrid>
        )}
      </ContentWrapper>

      <AnimatePresence>
        {showCloneModal && (
          <CloneModal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => e.target === e.currentTarget && setShowCloneModal(false)}
          >
            <ModalContent
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <ModalTitle>Clone Assessment</ModalTitle>
              <p style={{ color: '#6b7280', marginBottom: '24px' }}>
                Create a new assessment based on "{selectedAssessment?.assessmentName}". 
                All responses and progress will be copied to the new assessment.
              </p>

              <FormGroup>
                <Label>Assessment Name</Label>
                <Input
                  type="text"
                  value={cloneData.assessmentName}
                  onChange={(e) => setCloneData({ ...cloneData, assessmentName: e.target.value })}
                  placeholder="Enter assessment name"
                />
              </FormGroup>

              <FormGroup>
                <Label>Assessment Description (Optional)</Label>
                <Input
                  type="text"
                  value={cloneData.assessmentDescription}
                  onChange={(e) => setCloneData({ ...cloneData, assessmentDescription: e.target.value })}
                  placeholder="Enter assessment description"
                />
              </FormGroup>

              <FormGroup>
                <Label>Contact Email</Label>
                <Input
                  type="email"
                  value={cloneData.contactEmail}
                  onChange={(e) => setCloneData({ ...cloneData, contactEmail: e.target.value })}
                  placeholder="Enter contact email"
                />
              </FormGroup>

              <ModalActions>
                <ActionButton
                  variant="secondary"
                  onClick={() => setShowCloneModal(false)}
                >
                  Cancel
                </ActionButton>
                <ActionButton
                  variant="primary"
                  onClick={confirmClone}
                  disabled={!cloneData.assessmentName || !cloneData.contactEmail}
                >
                  <FiCopy size={14} />
                  Clone Assessment
                </ActionButton>
              </ModalActions>
            </ModalContent>
          </CloneModal>
        )}
      </AnimatePresence>
    </ManagementContainer>
  );
};

export default AssessmentManagement;
