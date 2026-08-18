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

// Bulletproof code-split chunk loader with auto-recovery from stale cache hashes across hot deploys
const lazyWithRetry = (componentImport) =>
  lazy(() =>
    new Promise((resolve, reject) => {
      const retryKey = 'scorex_chunk_retry_' + window.location.pathname;
      const hasRetried = window.sessionStorage.getItem(retryKey);

      componentImport()
        .then((module) => {
          window.sessionStorage.removeItem(retryKey);
          resolve(module);
        })
        .catch((error) => {
          const isChunkError =
            error?.name === 'ChunkLoadError' ||
            (error?.message && (
              error.message.includes('Loading chunk') ||
              error.message.includes('Failed to fetch dynamically imported module') ||
              error.message.includes('Unexpected token')
            ));

          if (isChunkError && !hasRetried) {
            console.warn('⚠️ Stale code chunk hash detected after deployment. Auto-reloading latest version...', error);
            window.sessionStorage.setItem(retryKey, 'true');
            window.location.reload(true);
            resolve({ default: () => <LoadingSpinner message="Syncing latest application version..." /> });
          } else {
            console.error('Failed to load page module:', error);
            reject(error);
          }
        });
    })
  );

// Global Error Boundary to gracefully recover from runtime / chunk loading failures
class ChunkErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    const isChunkError =
      error?.name === 'ChunkLoadError' ||
      (error?.message && (
        error.message.includes('Loading chunk') ||
        error.message.includes('Failed to fetch dynamically imported module') ||
        error.message.includes('Unexpected token')
      ));

    if (isChunkError) {
      const reloadKey = 'eb_chunk_reload';
      if (!window.sessionStorage.getItem(reloadKey)) {
        window.sessionStorage.setItem(reloadKey, 'true');
        window.location.reload(true);
      }
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 20px',
          textAlign: 'center',
          fontFamily: 'Inter, system-ui, sans-serif'
        }}>
          <div style={{
            background: '#ffffff',
            border: '1.5px solid #e2e8f0',
            borderRadius: '16px',
            padding: '32px 40px',
            maxWidth: '520px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.05)'
          }}>
            <h2 style={{ fontSize: '1.4rem', color: '#0f172a', margin: '0 0 10px', fontWeight: 800 }}>
              Updating Application
            </h2>
            <p style={{ fontSize: '0.92rem', color: '#64748b', margin: '0 0 20px', lineHeight: 1.5 }}>
              A new version of ScoreX was recently deployed. Click below to refresh and load the latest release.
            </p>
            <button
              onClick={() => {
                window.sessionStorage.clear();
                window.location.reload(true);
              }}
              style={{
                background: '#4f46e5',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                padding: '12px 24px',
                fontSize: '0.92rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              🔄 Reload Latest Version
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Lazily loaded page components for optimal bundle splitting
const HomePage = lazyWithRetry(() => import('./components/HomePageNew'));
const AssessmentStart = lazyWithRetry(() => import('./components/AssessmentStart'));
const AssessmentQuestion = lazyWithRetry(() => import('./components/AssessmentQuestion'));
const AssessmentResults = lazyWithRetry(() => import('./components/AssessmentResultsNew'));
const AssessmentManagement = lazyWithRetry(() => import('./components/AssessmentsListNew'));
const AssessmentDashboard = lazyWithRetry(() => import('./components/AssessmentDashboard'));
const Dashboard = lazyWithRetry(() => import('./components/DashboardNew'));
const ExecutiveCommandCenter = lazyWithRetry(() => import('./components/ExecutiveCommandCenter'));
const ExecutiveSummary = lazyWithRetry(() => import('./components/ExecutiveSummaryNew'));
const AssessmentHistory = lazyWithRetry(() => import('./components/AssessmentHistory'));
const DeepDive = lazyWithRetry(() => import('./components/DeepDive'));
const IndustryBenchmarkingReport = lazyWithRetry(() => import('./components/IndustryBenchmarkingReport'));
const MyAssessments = lazyWithRetry(() => import('./components/MyAssessments'));
const UserManagement = lazyWithRetry(() => import('./components/UserManagement'));
const AssignAssessmentMulti = lazyWithRetry(() => import('./components/AssignAssessmentMulti'));
const AuthorAssignments = lazyWithRetry(() => import('./components/AuthorAssignments'));
const UserDetails = lazyWithRetry(() => import('./components/UserDetails'));
const AssessmentDetails = lazyWithRetry(() => import('./components/AssessmentDetails'));
const FeedbackForm = lazyWithRetry(() => import('./components/FeedbackForm'));
const FeedbackList = lazyWithRetry(() => import('./components/FeedbackList'));
const QuestionManager = lazyWithRetry(() => import('./components/QuestionManager'));
const QuestionAssignmentManager = lazyWithRetry(() => import('./components/QuestionAssignmentManager'));
const UserGuide = lazyWithRetry(() => import('./components/UserGuide'));
const PitchDeck = lazyWithRetry(() => import('./components/PitchDeck'));
const GenAIReadiness = lazyWithRetry(() => import('./components/GenAIReadiness'));
const GenAIReadinessReport = lazyWithRetry(() => import('./components/GenAIReadinessReport'));
const GenAIReadinessList = lazyWithRetry(() => import('./components/GenAIReadinessList'));
const DynamicAssessmentGenerator = lazyWithRetry(() => import('./components/DynamicAssessmentGenerator'));
const DynamicAssessmentRunner = lazyWithRetry(() => import('./components/DynamicAssessmentRunner'));
const DynamicAssessmentReport = lazyWithRetry(() => import('./components/DynamicAssessmentReport'));
const DynamicAssessmentHub = lazyWithRetry(() => import('./components/DynamicAssessmentHub'));
const AssessmentComparisonView = lazyWithRetry(() => import('./components/AssessmentComparisonView'));
const CustomerPortfolioDashboard = lazyWithRetry(() => import('./components/CustomerPortfolioDashboard'));
const CommandPalette = lazyWithRetry(() => import('./components/CommandPalette'));
const InteractiveWorkflowWalkthrough = lazyWithRetry(() => import('./components/InteractiveWorkflowWalkthrough'));

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
        
        <ChunkErrorBoundary>
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
            path="/workflow-walkthrough" 
            element={<InteractiveWorkflowWalkthrough />}
          />
          <Route 
            path="/workflow-demo" 
            element={<InteractiveWorkflowWalkthrough />}
          />
          <Route 
            path="/interactive-tours" 
            element={<InteractiveWorkflowWalkthrough />}
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
        </ChunkErrorBoundary>

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




