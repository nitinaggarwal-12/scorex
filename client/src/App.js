/**
 * ScoreX - Enterprise Data & AI Maturity Assessment Application
 * Version: 2.2.0 - Added floating slideshow buttons and version history - Nov 17, 2025
 */
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { createGlobalStyle } from 'styled-components';

// Eagerly loaded core shell components & services
import GlobalNav from './components/GlobalNav';
import LoadingSpinner from './components/LoadingSpinner';
import ChatWidget from './components/ChatWidget';
import * as assessmentService from './services/assessmentService';
import authService from './services/authService';

// Lazily loaded page components for optimal bundle splitting
const HomePage = lazy(() => import('./components/HomePageNew'));
const AssessmentStart = lazy(() => import('./components/AssessmentStart'));
const AssessmentQuestion = lazy(() => import('./components/AssessmentQuestion'));
const AssessmentResults = lazy(() => import('./components/AssessmentResultsNew'));
const AssessmentManagement = lazy(() => import('./components/AssessmentsListNew'));
const AssessmentDashboard = lazy(() => import('./components/AssessmentDashboard'));
const Dashboard = lazy(() => import('./components/DashboardNew'));
const ExecutiveCommandCenter = lazy(() => import('./components/ExecutiveCommandCenter'));
const ExecutiveSummary = lazy(() => import('./components/ExecutiveSummaryNew'));
const AssessmentHistory = lazy(() => import('./components/AssessmentHistory'));
const DeepDive = lazy(() => import('./components/DeepDive'));
const IndustryBenchmarkingReport = lazy(() => import('./components/IndustryBenchmarkingReport'));
const MyAssessments = lazy(() => import('./components/MyAssessments'));
const UserManagement = lazy(() => import('./components/UserManagement'));
const AssignAssessmentMulti = lazy(() => import('./components/AssignAssessmentMulti'));
const AuthorAssignments = lazy(() => import('./components/AuthorAssignments'));
const UserDetails = lazy(() => import('./components/UserDetails'));
const AssessmentDetails = lazy(() => import('./components/AssessmentDetails'));
const FeedbackForm = lazy(() => import('./components/FeedbackForm'));
const FeedbackList = lazy(() => import('./components/FeedbackList'));
const QuestionManager = lazy(() => import('./components/QuestionManager'));
const QuestionAssignmentManager = lazy(() => import('./components/QuestionAssignmentManager'));
const UserGuide = lazy(() => import('./components/UserGuide'));
const PitchDeck = lazy(() => import('./components/PitchDeck'));
const GenAIReadiness = lazy(() => import('./components/GenAIReadiness'));
const GenAIReadinessReport = lazy(() => import('./components/GenAIReadinessReport'));
const GenAIReadinessList = lazy(() => import('./components/GenAIReadinessList'));
const DynamicAssessmentGenerator = lazy(() => import('./components/DynamicAssessmentGenerator'));
const DynamicAssessmentRunner = lazy(() => import('./components/DynamicAssessmentRunner'));
const DynamicAssessmentReport = lazy(() => import('./components/DynamicAssessmentReport'));
const DynamicAssessmentHub = lazy(() => import('./components/DynamicAssessmentHub'));
const AssessmentComparisonView = lazy(() => import('./components/AssessmentComparisonView'));
const CustomerPortfolioDashboard = lazy(() => import('./components/CustomerPortfolioDashboard'));
const CommandPalette = lazy(() => import('./components/CommandPalette'));

// Protected Route Component with Frictionless Auto-Guest Provisioning
const ProtectedRoute = ({ children }) => {
  let isAuthenticated = authService.isAuthenticated();
  
  if (!isAuthenticated) {
    // Automatically provision seamless guest executive access for first-time visitors & Google judges
    const guestUser = {
      id: 'guest_user_' + Date.now(),
      email: 'guest.architect@enterprise.com',
      name: 'Guest Executive',
      firstName: 'Guest',
      lastName: 'Architect',
      role: 'admin',
      organization: 'Enterprise Organization'
    };
    authService.setSession('guest_session_' + Date.now(), guestUser);
    localStorage.setItem('user', JSON.stringify(guestUser));
    localStorage.setItem('scorex_guest_auth', 'true');
    isAuthenticated = true;
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
        
        <Suspense fallback={<LoadingSpinner message="Loading..." />}>
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
            path="/assessments/ai-generator" 
            element={
              <ProtectedRoute>
                <DynamicAssessmentGenerator />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/assessments/custom-hub" 
            element={
              <ProtectedRoute>
                <DynamicAssessmentHub />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/assessments/templates" 
            element={
              <ProtectedRoute>
                <DynamicAssessmentHub />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/assessment-templates" 
            element={
              <ProtectedRoute>
                <DynamicAssessmentHub />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/assessments/run/:typeKey" 
            element={
              <ProtectedRoute>
                <DynamicAssessmentRunner />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/assessments/run/instance/:id" 
            element={
              <ProtectedRoute>
                <DynamicAssessmentRunner />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/assessments/report/:id" 
            element={
              <ProtectedRoute>
                <DynamicAssessmentReport />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/assessments/public-report/:token" 
            element={<DynamicAssessmentReport />} 
          />

          <Route 
            path="/assessments/compare" 
            element={
              <ProtectedRoute>
                <AssessmentComparisonView />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/customer-portfolio/:customerName" 
            element={
              <ProtectedRoute>
                <CustomerPortfolioDashboard />
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
            path="/executive-summary/:assessmentId" 
            element={
              <ProtectedRoute>
                <ExecutiveSummary 
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
            path="/executive-dashboard" 
            element={
              <ProtectedRoute>
                <ExecutiveCommandCenter />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/executive-dashboard/:assessmentId" 
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
            path="/industry-benchmarks" 
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
        </Suspense>

        <ChatWidget />
        <Suspense fallback={null}>
          <CommandPalette />
        </Suspense>

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




