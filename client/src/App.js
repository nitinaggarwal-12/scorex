/**
 * Databricks Maturity Assessment Application
 * Version: 2.2.0 - Added floating slideshow buttons and version history - Nov 17, 2025
 */
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { createGlobalStyle } from 'styled-components';

// Components
import GlobalNav from './components/GlobalNav';
import HomePage from './components/HomePageNew';
import AssessmentStart from './components/AssessmentStart';
import AssessmentQuestion from './components/AssessmentQuestion';
import AssessmentResults from './components/AssessmentResultsNew';
import AssessmentManagement from './components/AssessmentsListNew';
import AssessmentDashboard from './components/AssessmentDashboard';
import Dashboard from './components/DashboardNew';
import LoadingSpinner from './components/LoadingSpinner';
import ExecutiveCommandCenter from './components/ExecutiveCommandCenter';
import AssessmentHistory from './components/AssessmentHistory';
import DeepDive from './components/DeepDive';
import IndustryBenchmarkingReport from './components/IndustryBenchmarkingReport';
import MyAssessments from './components/MyAssessments';
import UserManagement from './components/UserManagement';
import AssignAssessmentMulti from './components/AssignAssessmentMulti';
import AuthorAssignments from './components/AuthorAssignments';
import UserDetails from './components/UserDetails';
import AssessmentDetails from './components/AssessmentDetails';
import FeedbackForm from './components/FeedbackForm';
import FeedbackList from './components/FeedbackList';
import QuestionManager from './components/QuestionManager';
import QuestionAssignmentManager from './components/QuestionAssignmentManager';
import ChatWidget from './components/ChatWidget';
import UserGuide from './components/UserGuide';
import PitchDeck from './components/PitchDeck';
import GenAIReadiness from './components/GenAIReadiness';
import GenAIReadinessReport from './components/GenAIReadinessReport';
import GenAIReadinessList from './components/GenAIReadinessList';

// Services
import * as assessmentService from './services/assessmentService';
import authService from './services/authService';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Global Print Styles - Applied across all components
const GlobalPrintStyles = createGlobalStyle`
  @media print {
    /* Force background graphics to print */
    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }
    
    /* Remove browser headers and footers by setting page margins to 0 */
    @page {
      margin: 0;
      size: letter landscape;
    }
    
    /* Add custom margins to content to prevent clipping */
    body {
      margin: 0.5in !important;
    }
    
    /* Ensure gradient backgrounds print */
    [style*="gradient"],
    [style*="linear-gradient"],
    [style*="radial-gradient"] {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    
    /* Ensure colored backgrounds print */
    [style*="background"],
    [class*="background"] {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
  }
`;

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [currentAssessment, setCurrentAssessment] = useState(null);
  const [assessmentFramework, setAssessmentFramework] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Track pathname changes
  useEffect(() => {
    const updatePath = () => setCurrentPath(window.location.pathname);
    
    // Listen to popstate (back/forward buttons)
    window.addEventListener('popstate', updatePath);
    
    // Intercept pushState and replaceState for React Router navigation
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;
    
    window.history.pushState = function(...args) {
      originalPushState.apply(this, args);
      updatePath();
    };
    
    window.history.replaceState = function(...args) {
      originalReplaceState.apply(this, args);
      updatePath();
    };
    
    return () => {
      window.removeEventListener('popstate', updatePath);
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    };
  }, []);

  useEffect(() => {
    loadAssessmentFramework();
    loadCurrentSession();
  }, []);

  // REMOVED: localStorage caching was causing stale data issues
  // Assessment data is now always fetched fresh from the server based on URL
  const loadCurrentSession = () => {
    // No-op: kept for compatibility
  };

  const saveCurrentSession = (assessment) => {
    // No-op: kept for compatibility
  };

  // Load current assessment when URL changes
  useEffect(() => {
    const loadCurrentAssessment = async () => {
      const path = currentPath; // ✅ Use tracked pathname state
      const assessmentMatch = path.match(/\/assessment\/([^\/]+)|\/results\/([^\/]+)|\/pillar-results\/([^\/]+)|\/executive-summary\/([^\/]+)|\/dashboard/);
      
      if (assessmentMatch) {
        // Extract assessment ID from URL or use from localStorage
        const assessmentId = assessmentMatch[1] || assessmentMatch[2] || assessmentMatch[3] || assessmentMatch[4];
        
        // If on dashboard and no ID in URL, try to load from localStorage
        if (path === '/dashboard' && !assessmentId) {
          const savedAssessment = localStorage.getItem('currentAssessment');
          if (savedAssessment) {
            try {
              const assessment = JSON.parse(savedAssessment);
              // Refresh assessment data from server
              const refreshedAssessment = await assessmentService.getAssessmentStatus(assessment.id || assessment.assessmentId);
              if (refreshedAssessment) {
                setCurrentAssessment(refreshedAssessment);
                saveCurrentSession(refreshedAssessment);
              }
            } catch (error) {
              console.error('Error loading assessment from localStorage:', error);
            }
          }
          return;
        }
        
        if (assessmentId) {
          try {
            const assessment = await assessmentService.getAssessmentStatus(assessmentId);
            if (assessment) {
              // Calculate progress
              const totalQuestions = assessmentFramework?.assessmentAreas?.reduce((total, area) => {
                return total + (area.dimensions?.reduce((dimTotal, dim) => {
                  return dimTotal + (dim.questions?.length || 0);
                }, 0) || 0);
              }, 0) || 0;
              
              // Count unique questions (not perspectives)
              const questionIds = new Set();
              Object.keys(assessment.responses || {}).forEach(key => {
                if (key.includes('_comment') || key.includes('_skipped')) return;
                
                // Remove perspective suffixes to get question ID
                let questionId = key;
                const perspectiveSuffixes = ['_current_state', '_future_state', '_technical_pain', '_business_pain'];
                for (const suffix of perspectiveSuffixes) {
                  if (key.endsWith(suffix)) {
                    questionId = key.substring(0, key.length - suffix.length);
                    break;
                  }
                }
                questionIds.add(questionId);
              });
              const answeredQuestions = questionIds.size;
              
              const progress = totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0;
              
              setCurrentAssessment({
                ...assessment,
                progress
              });
              saveCurrentSession(assessment);
            }
          } catch (error) {
            console.error('Error loading current assessment:', error);
          }
        }
      }
      // Don't clear currentAssessment when navigating to other pages
      // Only clear it explicitly via logout
    };

    if (assessmentFramework) {
      loadCurrentAssessment();
    }
  }, [currentPath, assessmentFramework]); // ✅ currentPath is reactive state

  const loadAssessmentFramework = async () => {
    try {
      setLoading(true);
      const framework = await assessmentService.getAssessmentFramework();
      setAssessmentFramework(framework);
    } catch (error) {
      console.error('Error loading assessment framework:', error);
      
    } finally {
      setLoading(false);
    }
  };

  const startAssessment = async (organizationInfo) => {
    try {
      const assessment = await assessmentService.startAssessment(organizationInfo);
      setCurrentAssessment(assessment);
      saveCurrentSession(assessment);
      // Toast notification shown in AssessmentStart component to avoid duplicate
      return assessment;
    } catch (error) {
      console.error('Error starting assessment:', error);
      
      throw error;
    }
  };

  const handleLogout = () => {
    setCurrentAssessment(null);
    saveCurrentSession(null);
  };

  const updateAssessmentStatus = async (assessmentId) => {
    try {
      const status = await assessmentService.getAssessmentStatus(assessmentId);
      setCurrentAssessment(prev => ({ ...prev, ...status }));
      return status;
    } catch (error) {
      console.error('Error updating assessment status:', error);
      
      throw error;
    }
  };

  if (loading) {
    return (
      <>
        <GlobalPrintStyles />
        <Router>
          <div className="App">
            <GlobalNav />
            <LoadingSpinner message="Loading assessment framework..." />
            <ChatWidget />
          </div>
        </Router>
      </>
    );
  }

  return (
    <>
      <GlobalPrintStyles />
      <Router>
        <div className="App">
          <GlobalNav />
        
        <Routes>
          <Route 
            path="/" 
            element={<HomePage />} 
          />
          
          <Route 
            path="/insights-dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/deep-dive" 
            element={<DeepDive />} 
          />
          
          <Route 
            path="/genai-readiness" 
            element={
              <ProtectedRoute>
                <GenAIReadiness />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/genai-readiness/edit/:id" 
            element={
              <ProtectedRoute>
                <GenAIReadiness />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/genai-readiness/list" 
            element={
              <ProtectedRoute>
                <GenAIReadinessList />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/genai-readiness/report/:id" 
            element={
              <ProtectedRoute>
                <GenAIReadinessReport />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/dashboard" 
            element={
              <AssessmentDashboard 
                currentAssessment={currentAssessment}
                framework={assessmentFramework}
                onLogout={handleLogout}
              />
            } 
          />
          
          <Route 
            path="/dashboard/:assessmentId" 
            element={
              <AssessmentDashboard 
                currentAssessment={currentAssessment}
                framework={assessmentFramework}
                onLogout={handleLogout}
              />
            } 
          />
          
          {/* Removed /explore route - all content is on home page with scroll navigation */}
          
          <Route 
            path="/start" 
            element={
              <ProtectedRoute>
                <AssessmentStart 
                  onStart={startAssessment}
                />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/assessment/:assessmentId/:categoryId" 
            element={
              <ProtectedRoute>
                <AssessmentQuestion 
                  framework={assessmentFramework}
                  currentAssessment={currentAssessment}
                  onUpdateStatus={updateAssessmentStatus}
                />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/results/:assessmentId" 
            element={
              <ProtectedRoute>
                <AssessmentResults 
                  currentAssessment={currentAssessment}
                  framework={assessmentFramework}
                />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/executive/:assessmentId" 
            element={
              <ProtectedRoute>
                <ExecutiveCommandCenter />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/benchmarks/:assessmentId" 
            element={
              <ProtectedRoute>
                <IndustryBenchmarkingReport />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/history/:assessmentId" 
            element={
              <ProtectedRoute>
                <AssessmentHistory />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/assessments" 
            element={
              <ProtectedRoute>
                <AssessmentManagement />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/my-assessments" 
            element={
              <ProtectedRoute>
                <MyAssessments />
              </ProtectedRoute>
            }
          />
          
          <Route 
            path="/user-management" 
            element={
              <ProtectedRoute>
                <UserManagement />
              </ProtectedRoute>
            }
          />
          
          <Route 
            path="/assign-assessment" 
            element={
              <ProtectedRoute>
                <AssignAssessmentMulti />
              </ProtectedRoute>
            }
          />
          
          <Route 
            path="/my-assignments" 
            element={
              <ProtectedRoute>
                <AuthorAssignments />
              </ProtectedRoute>
            }
          />
          
          <Route 
            path="/user-details/:userId" 
            element={
              <ProtectedRoute>
                <UserDetails />
              </ProtectedRoute>
            }
          />
          
          <Route 
            path="/assessment-details/:assessmentId" 
            element={
              <ProtectedRoute>
                <AssessmentDetails />
              </ProtectedRoute>
            }
          />
          
          <Route 
            path="/feedback" 
            element={<FeedbackForm />} 
          />
          
          <Route 
            path="/admin/feedback" 
            element={
              <ProtectedRoute>
                <FeedbackList />
              </ProtectedRoute>
            }
          />
          
          <Route 
            path="/admin/questions" 
            element={
              <ProtectedRoute>
                <QuestionManager />
              </ProtectedRoute>
            }
          />
          
          <Route 
            path="/question-assignments" 
            element={
              <ProtectedRoute>
                <QuestionAssignmentManager />
              </ProtectedRoute>
            }
          />
          
          <Route 
            path="/user-guide" 
            element={<UserGuide />}
          />
          
          <Route 
            path="/pitch-deck" 
            element={<PitchDeck />}
          />
          
          <Route 
            path="*" 
            element={<Navigate to="/" replace />} 
          />
        </Routes>

        <ChatWidget />

        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              theme: {
                primary: '#4aed88',
              },
            },
            error: {
              duration: 5000,
              theme: {
                primary: '#ff4b4b',
              },
            },
          }}
        />
      </div>
    </Router>
    </>
  );
}

export default App;




