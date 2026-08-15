import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import authService from '../services/authService';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
  color: white;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 10px;
  font-weight: 700;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  opacity: 0.9;
`;

const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
`;

const StepContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StepCard = styled.div`
  background: ${props => props.$active ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f8f9fa'};
  color: ${props => props.$active ? 'white' : '#333'};
  border-radius: 12px;
  padding: 20px;
  cursor: ${props => props.$clickable ? 'pointer' : 'default'};
  transition: all 0.3s ease;
  border: 2px solid ${props => props.$active ? '#667eea' : '#e0e0e0'};

  &:hover {
    transform: ${props => props.$clickable ? 'translateY(-2px)' : 'none'};
    box-shadow: ${props => props.$clickable ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'none'};
  }
`;

const StepNumber = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.$active ? 'rgba(255, 255, 255, 0.2)' : '#667eea'};
  color: ${props => props.$active ? 'white' : 'white'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.2rem;
  margin-bottom: 15px;
`;

const StepTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 8px;
  font-weight: 600;
`;

const StepDescription = styled.p`
  font-size: 0.95rem;
  opacity: 0.8;
`;

const SelectionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 15px;
  margin-top: 20px;
`;

const SelectableCard = styled.div`
  background: ${props => props.$selected ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white'};
  color: ${props => props.$selected ? 'white' : '#333'};
  border: 2px solid ${props => props.$selected ? '#667eea' : '#e0e0e0'};
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border-color: #667eea;
  }
`;

const CardTitle = styled.h4`
  font-size: 1.1rem;
  margin-bottom: 8px;
  font-weight: 600;
`;

const CardDetail = styled.p`
  font-size: 0.9rem;
  opacity: 0.8;
  margin: 4px 0;
`;

const QuestionCard = styled(SelectableCard)`
  padding: 15px;
`;

const QuestionText = styled.div`
  font-size: 0.95rem;
  font-weight: 500;
  margin-bottom: 10px;
  line-height: 1.4;
`;

const QuestionMeta = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 10px;
`;

const Badge = styled.span`
  background: ${props => props.$selected ? 'rgba(255, 255, 255, 0.2)' : '#667eea'};
  color: ${props => props.$selected ? 'white' : 'white'};
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
`;

const UserInputSection = styled.div`
  margin-top: 20px;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 30px;
`;

const Button = styled.button`
  padding: 12px 30px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PrimaryButton = styled(Button)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
`;

const SecondaryButton = styled(Button)`
  background: white;
  color: #667eea;
  border: 2px solid #667eea;

  &:hover:not(:disabled) {
    background: #f8f9fa;
  }
`;

const SummarySection = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  margin-top: 20px;
`;

const SummaryTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 15px;
  color: #333;
`;

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #e0e0e0;

  &:last-child {
    border-bottom: none;
  }
`;

const SummaryLabel = styled.span`
  font-weight: 600;
  color: #666;
`;

const SummaryValue = styled.span`
  color: #333;
  font-weight: 500;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  color: #667eea;
  font-size: 1.2rem;
`;

const ErrorMessage = styled.div`
  background: #fee;
  color: #c33;
  padding: 15px 20px;
  border-radius: 8px;
  margin: 20px 0;
  border-left: 4px solid #c33;
`;

const SuccessMessage = styled.div`
  background: #efe;
  color: #3c3;
  padding: 15px 20px;
  border-radius: 8px;
  margin: 20px 0;
  border-left: 4px solid #3c3;
`;

const QuestionAssignmentManager = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Data
  const [assessments, setAssessments] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [users, setUsers] = useState([]);

  // Selections
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [assignmentNotes, setAssignmentNotes] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    loadAssessments();
    loadUsers();
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    try {
      // Try to get from localStorage first (synchronous)
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      } else {
        // Fallback to API call
        const user = await authService.getCurrentUser();
        if (user) {
          setCurrentUser(user);
        }
      }
    } catch (err) {
      console.error('Error loading current user:', err);
    }
  };

  const loadAssessments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api/assessments`, {
        headers: {
          'x-session-id': localStorage.getItem('sessionId')
        }
      });
      
      if (!response.ok) throw new Error('Failed to load assessments');
      
      const result = await response.json();
      setAssessments(result.data || result);
    } catch (err) {
      console.error('Error loading assessments:', err);
      setError('Failed to load assessments: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api/auth/users`, {
        headers: {
          'x-session-id': localStorage.getItem('sessionId')
        }
      });
      
      if (!response.ok) throw new Error('Failed to load users');
      
      const result = await response.json();
      const usersData = result.users || result;
      setUsers(Array.isArray(usersData) ? usersData : []);
    } catch (err) {
      console.error('Error loading users:', err);
      setError('Failed to load users: ' + err.message);
    }
  };

  const loadQuestionsForAssessment = async (assessmentId) => {
    try {
      setLoading(true);
      
      // Load assessment framework
      const frameworkResponse = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api/assessment/framework`);
      if (!frameworkResponse.ok) throw new Error('Failed to load framework');
      
      const frameworkResult = await frameworkResponse.json();
      const framework = frameworkResult.data || frameworkResult;
      
      console.log('📚 Framework loaded:', framework);
      
      // Extract all questions from all pillars
      const allQuestions = [];
      framework.assessmentAreas?.forEach(pillar => {
        pillar.dimensions?.forEach(dimension => {
          dimension.questions?.forEach(question => {
            allQuestions.push({
              ...question,
              pillar: pillar.id,
              pillarName: pillar.name,
              dimension: dimension.name
            });
          });
        });
      });
      
      console.log(`📝 Extracted ${allQuestions.length} framework questions`);
      
      // Load custom questions for this assessment
      const customResponse = await fetch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api/custom-questions?assessmentId=${assessmentId}`,
        {
          headers: {
            'x-session-id': localStorage.getItem('sessionId')
          }
        }
      );
      
      if (customResponse.ok) {
        const customResult = await customResponse.json();
        const customQuestions = customResult.questions || customResult;
        
        console.log('🎨 Custom questions loaded:', customQuestions);
        
        if (Array.isArray(customQuestions)) {
          customQuestions.forEach(q => {
            allQuestions.push({
              id: q.id,
              question: q.question_text,
              pillar: q.pillar,
              pillarName: q.pillar.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
              dimension: 'Custom Question',
              isCustom: true
            });
          });
          console.log(`✅ Added ${customQuestions.length} custom questions`);
        }
      }
      
      console.log(`🎯 Total questions loaded: ${allQuestions.length}`);
      setQuestions(allQuestions);
    } catch (err) {
      console.error('Error loading questions:', err);
      setError('Failed to load questions: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAssessmentSelect = (assessment) => {
    setSelectedAssessment(assessment);
    setSelectedQuestions([]);
    loadQuestionsForAssessment(assessment.id);
    setCurrentStep(2);
    setError('');
  };

  const handleQuestionToggle = (question) => {
    setSelectedQuestions(prev => {
      const exists = prev.find(q => q.id === question.id);
      if (exists) {
        return prev.filter(q => q.id !== question.id);
      } else {
        return [...prev, question];
      }
    });
  };

  const handleUserToggle = (user) => {
    setSelectedUsers(prev => {
      const exists = prev.find(u => u.email === user.email);
      if (exists) {
        return prev.filter(u => u.email !== user.email);
      } else {
        return [...prev, user];
      }
    });
  };

  const handleSubmitAssignments = async () => {
    if (selectedQuestions.length === 0) {
      setError('Please select at least one question');
      return;
    }
    
    if (selectedUsers.length === 0) {
      setError('Please select at least one user');
      return;
    }

    if (!currentUser || !currentUser.email) {
      setError('User session not loaded. Please refresh the page.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const assignments = [];
      
      // Create assignment for each question-user combination
      for (const question of selectedQuestions) {
        for (const user of selectedUsers) {
          const assignment = {
            assessment_id: selectedAssessment.id,
            question_id: question.id,
            pillar: question.pillar,
            assigned_to_email: user.email,
            assigned_by_email: currentUser.email,
            notes: assignmentNotes,
            due_date: dueDate || null
          };
          
          console.log('📤 Creating assignment:', assignment);
          console.log('Question:', question);
          console.log('User:', user);
          console.log('Current User:', currentUser);
          
          const response = await fetch(
            `${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api/question-assignments`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-session-id': localStorage.getItem('sessionId')
              },
              body: JSON.stringify(assignment)
            }
          );
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to create assignment');
          }
          
          const result = await response.json();
          assignments.push(result);
        }
      }
      
      setSuccess(`Successfully created ${assignments.length} assignment(s)!`);
      
      // Reset after 3 seconds
      setTimeout(() => {
        setCurrentStep(1);
        setSelectedAssessment(null);
        setSelectedQuestions([]);
        setSelectedUsers([]);
        setAssignmentNotes('');
        setDueDate('');
        setSuccess('');
      }, 3000);
      
    } catch (err) {
      console.error('Error creating assignments:', err);
      setError('Failed to create assignments: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const groupQuestionsByPillar = () => {
    const grouped = {};
    questions.forEach(q => {
      if (!grouped[q.pillarName]) {
        grouped[q.pillarName] = [];
      }
      grouped[q.pillarName].push(q);
    });
    return grouped;
  };

  return (
    <PageContainer>
      <ContentWrapper>
        <Header>
          <Title>📋 Question Assignment Manager</Title>
          <Subtitle>Assign specific questions to users for collaborative assessment</Subtitle>
        </Header>

        <Card>
          <StepContainer>
            <StepCard $active={currentStep === 1} $clickable={true} onClick={() => setCurrentStep(1)}>
              <StepNumber $active={currentStep === 1}>1</StepNumber>
              <StepTitle>Select Assessment</StepTitle>
              <StepDescription>
                {selectedAssessment ? selectedAssessment.organization_name : 'Choose an assessment'}
              </StepDescription>
            </StepCard>

            <StepCard $active={currentStep === 2} $clickable={selectedAssessment !== null} onClick={() => selectedAssessment && setCurrentStep(2)}>
              <StepNumber $active={currentStep === 2}>2</StepNumber>
              <StepTitle>Select Questions</StepTitle>
              <StepDescription>
                {selectedQuestions.length > 0 ? `${selectedQuestions.length} selected` : 'Choose questions to assign'}
              </StepDescription>
            </StepCard>

            <StepCard $active={currentStep === 3} $clickable={selectedQuestions.length > 0} onClick={() => selectedQuestions.length > 0 && setCurrentStep(3)}>
              <StepNumber $active={currentStep === 3}>3</StepNumber>
              <StepTitle>Select Users</StepTitle>
              <StepDescription>
                {selectedUsers.length > 0 ? `${selectedUsers.length} selected` : 'Choose users to assign'}
              </StepDescription>
            </StepCard>

            <StepCard $active={currentStep === 4} $clickable={selectedUsers.length > 0} onClick={() => selectedUsers.length > 0 && setCurrentStep(4)}>
              <StepNumber $active={currentStep === 4}>4</StepNumber>
              <StepTitle>Review & Submit</StepTitle>
              <StepDescription>Confirm and create assignments</StepDescription>
            </StepCard>
          </StepContainer>

          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}

          {loading && <LoadingSpinner>⏳ Loading...</LoadingSpinner>}

          {/* Step 1: Select Assessment */}
          {currentStep === 1 && !loading && (
            <>
              <h2 style={{ marginBottom: '20px', color: '#333' }}>Select an Assessment</h2>
              <SelectionGrid>
                {assessments.map(assessment => (
                  <SelectableCard
                    key={assessment.id}
                    $selected={selectedAssessment?.id === assessment.id}
                    onClick={() => handleAssessmentSelect(assessment)}
                  >
                    <CardTitle>{assessment.organization_name}</CardTitle>
                    <CardDetail>📊 Industry: {assessment.industry}</CardDetail>
                    <CardDetail>📅 Created: {new Date(assessment.created_at).toLocaleDateString()}</CardDetail>
                    <CardDetail>✅ Progress: {assessment.progress || 0}%</CardDetail>
                  </SelectableCard>
                ))}
              </SelectionGrid>
            </>
          )}

          {/* Step 2: Select Questions */}
          {currentStep === 2 && !loading && (
            <>
              <h2 style={{ marginBottom: '20px', color: '#333' }}>
                Select Questions from {selectedAssessment?.organization_name}
              </h2>
              
              {questions.length === 0 ? (
                <div style={{ 
                  padding: '40px', 
                  textAlign: 'center', 
                  background: '#f8f9fa', 
                  borderRadius: '12px',
                  color: '#666'
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📝</div>
                  <h3 style={{ color: '#333', marginBottom: '10px' }}>No Questions Available</h3>
                  <p>There are no questions loaded for this assessment.</p>
                  <p style={{ marginTop: '10px', fontSize: '0.9rem' }}>
                    This could mean the assessment framework hasn't loaded yet or there was an error.
                  </p>
                </div>
              ) : (
                <>
                  {Object.entries(groupQuestionsByPillar()).map(([pillarName, pillarQuestions]) => (
                    <div key={pillarName} style={{ marginBottom: '30px' }}>
                      <h3 style={{ color: '#667eea', marginBottom: '15px', fontSize: '1.2rem' }}>
                        {pillarName} ({pillarQuestions.length} questions)
                      </h3>
                      <SelectionGrid>
                        {pillarQuestions.map(question => {
                          const isSelected = selectedQuestions.find(q => q.id === question.id);
                          return (
                            <QuestionCard
                              key={question.id}
                              $selected={isSelected}
                              onClick={() => handleQuestionToggle(question)}
                            >
                              <QuestionText>{question.question}</QuestionText>
                              <QuestionMeta>
                                <Badge $selected={isSelected}>{question.dimension}</Badge>
                                {question.isCustom && <Badge $selected={isSelected}>Custom</Badge>}
                              </QuestionMeta>
                            </QuestionCard>
                          );
                        })}
                      </SelectionGrid>
                    </div>
                  ))}
                </>
              )}
              
              <ButtonGroup>
                <SecondaryButton onClick={() => setCurrentStep(1)}>← Back</SecondaryButton>
                <PrimaryButton 
                  onClick={() => setCurrentStep(3)}
                  disabled={selectedQuestions.length === 0}
                >
                  Next: Select Users →
                </PrimaryButton>
              </ButtonGroup>
            </>
          )}

          {/* Step 3: Select Users */}
          {currentStep === 3 && !loading && (
            <>
              <h2 style={{ marginBottom: '20px', color: '#333' }}>Select Users to Assign Questions</h2>
              <SelectionGrid>
                {users.map(user => {
                  const isSelected = selectedUsers.find(u => u.email === user.email);
                  return (
                    <SelectableCard
                      key={user.email}
                      $selected={isSelected}
                      onClick={() => handleUserToggle(user)}
                    >
                      <CardTitle>{user.name}</CardTitle>
                      <CardDetail>📧 {user.email}</CardDetail>
                      <CardDetail>👤 Role: {user.role}</CardDetail>
                    </SelectableCard>
                  );
                })}
              </SelectionGrid>

              <UserInputSection>
                <Label>Assignment Notes (Optional)</Label>
                <TextArea
                  value={assignmentNotes}
                  onChange={(e) => setAssignmentNotes(e.target.value)}
                  placeholder="Add any instructions or context for the assigned users..."
                />
              </UserInputSection>

              <UserInputSection>
                <Label>Due Date (Optional)</Label>
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </UserInputSection>

              <ButtonGroup>
                <SecondaryButton onClick={() => setCurrentStep(2)}>← Back</SecondaryButton>
                <PrimaryButton 
                  onClick={() => setCurrentStep(4)}
                  disabled={selectedUsers.length === 0}
                >
                  Next: Review →
                </PrimaryButton>
              </ButtonGroup>
            </>
          )}

          {/* Step 4: Review & Submit */}
          {currentStep === 4 && !loading && (
            <>
              <h2 style={{ marginBottom: '20px', color: '#333' }}>Review Assignment Details</h2>
              
              <SummarySection>
                <SummaryTitle>Assignment Summary</SummaryTitle>
                <SummaryItem>
                  <SummaryLabel>Assessment:</SummaryLabel>
                  <SummaryValue>{selectedAssessment?.organization_name}</SummaryValue>
                </SummaryItem>
                <SummaryItem>
                  <SummaryLabel>Questions Selected:</SummaryLabel>
                  <SummaryValue>{selectedQuestions.length}</SummaryValue>
                </SummaryItem>
                <SummaryItem>
                  <SummaryLabel>Users Selected:</SummaryLabel>
                  <SummaryValue>{selectedUsers.length}</SummaryValue>
                </SummaryItem>
                <SummaryItem>
                  <SummaryLabel>Total Assignments:</SummaryLabel>
                  <SummaryValue>{selectedQuestions.length * selectedUsers.length}</SummaryValue>
                </SummaryItem>
                {dueDate && (
                  <SummaryItem>
                    <SummaryLabel>Due Date:</SummaryLabel>
                    <SummaryValue>{new Date(dueDate).toLocaleDateString()}</SummaryValue>
                  </SummaryItem>
                )}
              </SummarySection>

              <div style={{ marginTop: '20px' }}>
                <h3 style={{ color: '#333', marginBottom: '10px' }}>Selected Questions:</h3>
                <ul style={{ paddingLeft: '20px', color: '#666' }}>
                  {selectedQuestions.map(q => (
                    <li key={q.id} style={{ marginBottom: '8px' }}>
                      <strong>{q.pillarName}</strong>: {q.question}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ marginTop: '20px' }}>
                <h3 style={{ color: '#333', marginBottom: '10px' }}>Selected Users:</h3>
                <ul style={{ paddingLeft: '20px', color: '#666' }}>
                  {selectedUsers.map(u => (
                    <li key={u.email} style={{ marginBottom: '8px' }}>
                      {u.name} ({u.email})
                    </li>
                  ))}
                </ul>
              </div>

              {assignmentNotes && (
                <div style={{ marginTop: '20px' }}>
                  <h3 style={{ color: '#333', marginBottom: '10px' }}>Notes:</h3>
                  <p style={{ color: '#666', fontStyle: 'italic' }}>{assignmentNotes}</p>
                </div>
              )}

              <ButtonGroup>
                <SecondaryButton onClick={() => setCurrentStep(3)}>← Back</SecondaryButton>
                <PrimaryButton onClick={handleSubmitAssignments}>
                  ✅ Create Assignments
                </PrimaryButton>
              </ButtonGroup>
            </>
          )}
        </Card>
      </ContentWrapper>
    </PageContainer>
  );
};

export default QuestionAssignmentManager;

