/**
 * ScoreX - Enterprise Data & AI Maturity Assessment Application
 * Version: 2.2.0 - Added floating slideshow buttons and version history - Nov 17, 2025
 */
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
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
      const isChunk =
        this.state.error?.name === 'ChunkLoadError' ||
        (this.state.error?.message && (
          this.state.error.message.includes('Loading chunk') ||
          this.state.error.message.includes('Failed to fetch dynamically imported module') ||
          this.state.error.message.includes('Unexpected token')
        ));

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
              {isChunk ? 'Updating Application' : 'Application Recovered'}
            </h2>
            <p style={{ fontSize: '0.92rem', color: '#64748b', margin: '0 0 20px', lineHeight: 1.5 }}>
              {isChunk
                ? 'A new version of ScoreX was recently deployed. Click below to refresh and load the latest release.'
                : 'A view component encountered a recoverable state change. Click below to refresh and continue.'}
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
              🔄 Reload Application
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Lazily loaded canonical page components for optimal bundle splitting
const HomePage = lazyWithRetry(() => import('./components/HomePageNew'));
const AssessmentManagement = lazyWithRetry(() => import('./components/AssessmentsListNew'));
const DeepDive = lazyWithRetry(() => import('./components/DeepDive'));
const UserManagement = lazyWithRetry(() => import('./components/UserManagement'));
const UserDetails = lazyWithRetry(() => import('./components/UserDetails'));
const FeedbackForm = lazyWithRetry(() => import('./components/FeedbackForm'));
const FeedbackList = lazyWithRetry(() => import('./components/FeedbackList'));
const QuestionManager = lazyWithRetry(() => import('./components/QuestionManager'));
const QuestionAssignmentManager = lazyWithRetry(() => import('./components/QuestionAssignmentManager'));
const DynamicAssessmentGenerator = lazyWithRetry(() => import('./components/DynamicAssessmentGenerator'));
const DynamicAssessmentRunner = lazyWithRetry(() => import('./components/DynamicAssessmentRunner'));
const DynamicAssessmentReport = lazyWithRetry(() => import('./components/DynamicAssessmentReport'));
const DynamicAssessmentHub = lazyWithRetry(() => import('./components/DynamicAssessmentHub'));
const AssessmentComparisonView = lazyWithRetry(() => import('./components/AssessmentComparisonView'));
const CustomerPortfolioDashboard = lazyWithRetry(() => import('./components/CustomerPortfolioDashboard'));
const CommandPalette = lazyWithRetry(() => import('./components/CommandPalette'));
const InteractiveWorkflowWalkthrough = lazyWithRetry(() => import('./components/InteractiveWorkflowWalkthrough'));
const EuAiComplianceWorkspace = lazyWithRetry(() => import('./components/EuAiComplianceWorkspace'));
const GeValueRealizationWorkspace = lazyWithRetry(() => import('./components/GeValueRealizationWorkspace'));

// Protected Route Component with Frictionless Auto-Guest Provisioning
const ProtectedRoute = ({ children }) => {
  let isAuthenticated = authService.isAuthenticated();
  
  if (!isAuthenticated) {
    // Automatically provision seamless guest executive access for first-time visitors
    authService.createGuestSession();
    localStorage.setItem('scorex_disclaimer_accepted', 'true');
  }
  
  return children;
};

// Parameter-preserving Legacy Redirect Helpers
const LegacyReportRedirect = ({ fallbackId = 'inst_enterprise_data_ai_maturity_demo' }) => {
  const params = useParams();
  const rawId = params.assessmentId || params.id;
  const targetId = (!rawId || rawId === 'sample' || rawId === 'demo') ? fallbackId : rawId;
  return <Navigate to={`/assessments/report/${targetId}`} replace />;
};

const LegacyRunnerRedirect = () => {
  const { assessmentId } = useParams();
  if (!assessmentId || assessmentId === 'new' || assessmentId === 'enterprise_data_ai_maturity') {
    return <Navigate to="/assessments/run/enterprise_data_ai_maturity" replace />;
  }
  return <Navigate to={`/assessments/run/instance/${assessmentId}`} replace />;
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
  const [loading, setLoading] = useState(true);
  
  // Handle Corporate SSO redirect callback on application load
  useEffect(() => {
    const ssoResult = authService.checkAndProcessSSOCallback();
    if (ssoResult) {
      if (ssoResult.success) {
        toast.success(`Signed in via Corporate SSO (${(ssoResult.provider || 'OIDC').toUpperCase()}) as ${ssoResult.user.email}`);
        window.location.href = '/assessments';
      } else if (ssoResult.error) {
        toast.error(`Corporate SSO Error: ${ssoResult.error}`);
      }
    }
  }, []);

  useEffect(() => {
    setLoading(false);
  }, []);

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
              path="/deep-dive" 
              element={<DeepDive />} 
            />

            {/* Canonical Engine 1: Dynamic Assessment Blueprints & AI Compiler */}
            <Route 
              path="/assessments/ai-generator" 
              element={
                <ProtectedRoute>
                  <DynamicAssessmentGenerator />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/assessments/generate" 
              element={<Navigate to="/assessments/ai-generator" replace />} 
            />

            <Route 
              path="/assessments/generator" 
              element={<Navigate to="/assessments/ai-generator" replace />} 
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
              element={<Navigate to="/assessments/custom-hub" replace />} 
            />

            <Route 
              path="/assessment-templates" 
              element={<Navigate to="/assessments/custom-hub" replace />} 
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
              path="/assessments/results/:id" 
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

            {/* Canonical Engine 2: GE Value Realization */}
            <Route 
              path="/ge-value-realization" 
              element={
                <ProtectedRoute>
                  <GeValueRealizationWorkspace />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/ge-value-realization/:id" 
              element={
                <ProtectedRoute>
                  <GeValueRealizationWorkspace />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/assessments/ge-value-realization" 
              element={<Navigate to="/ge-value-realization" replace />} 
            />

            <Route 
              path="/assessments/ge-value-realization/:id" 
              element={
                <ProtectedRoute>
                  <GeValueRealizationWorkspace />
                </ProtectedRoute>
              } 
            />

            {/* Canonical Engine 3: EU AI Act Statutory Compliance */}
            <Route 
              path="/eu-ai-compliance" 
              element={
                <ProtectedRoute>
                  <EuAiComplianceWorkspace />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/eu-ai-act" 
              element={<Navigate to="/eu-ai-compliance" replace />} 
            />

            <Route 
              path="/eu-ai-compliance/:id" 
              element={
                <ProtectedRoute>
                  <EuAiComplianceWorkspace />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/assessments/eu-ai-compliance" 
              element={<Navigate to="/eu-ai-compliance" replace />} 
            />

            <Route 
              path="/assessments/eu-ai-compliance/:id" 
              element={
                <ProtectedRoute>
                  <EuAiComplianceWorkspace />
                </ProtectedRoute>
              } 
            />

            {/* Canonical Portfolio, Account Rollup & Progression Diff Views */}
            <Route 
              path="/assessments" 
              element={
                <ProtectedRoute>
                  <AssessmentManagement />
                </ProtectedRoute>
              } 
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

            {/* Canonical Governance, Users, Questions & Enablement Routes */}
            <Route 
              path="/user-management" 
              element={
                <ProtectedRoute>
                  <UserManagement />
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

            {/* Consolidated Legacy Redirects to Canonical Views */}
            <Route path="/value-realization" element={<Navigate to="/ge-value-realization" replace />} />
            <Route path="/workflow-demo" element={<Navigate to="/workflow-walkthrough" replace />} />
            <Route path="/interactive-tours" element={<Navigate to="/workflow-walkthrough" replace />} />
            <Route path="/user-guide" element={<Navigate to="/workflow-walkthrough" replace />} />
            <Route path="/pitch-deck" element={<Navigate to="/deep-dive" replace />} />
            <Route path="/start" element={<Navigate to="/assessments/run/enterprise_data_ai_maturity" replace />} />
            <Route path="/assessment/:assessmentId/:categoryId" element={<LegacyRunnerRedirect />} />
            <Route path="/assessment/:assessmentId" element={<LegacyRunnerRedirect />} />
            <Route path="/results" element={<Navigate to="/assessments/report/inst_enterprise_data_ai_maturity_demo" replace />} />
            <Route path="/results/:assessmentId" element={<LegacyReportRedirect />} />
            <Route path="/executive-summary/:assessmentId" element={<LegacyReportRedirect />} />
            <Route path="/executive/:assessmentId" element={<LegacyReportRedirect />} />
            <Route path="/executive-dashboard" element={<Navigate to="/assessments/report/inst_enterprise_data_ai_maturity_demo" replace />} />
            <Route path="/executive-dashboard/:assessmentId" element={<LegacyReportRedirect />} />
            <Route path="/dashboard" element={<Navigate to="/assessments" replace />} />
            <Route path="/dashboard/:assessmentId" element={<LegacyReportRedirect />} />
            <Route path="/insights" element={<Navigate to="/assessments" replace />} />
            <Route path="/insights/:assessmentId" element={<LegacyReportRedirect />} />
            <Route path="/insights-dashboard" element={<Navigate to="/assessments" replace />} />
            <Route path="/my-assessments" element={<Navigate to="/assessments" replace />} />
            <Route path="/assessment-details/:assessmentId" element={<LegacyReportRedirect />} />
            <Route path="/deep-dive/:assessmentId" element={<LegacyReportRedirect />} />
            <Route path="/edit-questions/:assessmentId" element={<LegacyRunnerRedirect />} />
            <Route path="/history/:assessmentId" element={<Navigate to="/assessments/compare" replace />} />
            <Route path="/benchmarks" element={<Navigate to="/assessments/report/inst_enterprise_data_ai_maturity_demo" replace />} />
            <Route path="/benchmarks/:assessmentId" element={<LegacyReportRedirect />} />
            <Route path="/industry-benchmarks" element={<Navigate to="/assessments/report/inst_enterprise_data_ai_maturity_demo" replace />} />
            <Route path="/genai-readiness" element={<Navigate to="/assessments/run/openai_to_gemini_enterprise_migration" replace />} />
            <Route path="/genai-readiness/edit/:id" element={<Navigate to="/assessments/run/openai_to_gemini_enterprise_migration" replace />} />
            <Route path="/genai-readiness/list" element={<Navigate to="/assessments" replace />} />
            <Route path="/genai-readiness/report/:id" element={<LegacyReportRedirect fallbackId="inst_openai_to_gemini_enterprise_migration_demo" />} />
            <Route path="/assign-assessment" element={<Navigate to="/question-assignments" replace />} />
            <Route path="/my-assignments" element={<Navigate to="/question-assignments" replace />} />
            <Route path="/custom-questions" element={<Navigate to="/admin/questions" replace />} />
            <Route path="/feedback-analytics" element={<Navigate to="/admin/feedback" replace />} />
            <Route path="/admin" element={<Navigate to="/user-management" replace />} />
            <Route path="/analytics" element={<Navigate to="/assessments" replace />} />
            <Route path="/author-dashboard" element={<Navigate to="/question-assignments" replace />} />
            <Route path="/consumer-dashboard" element={<Navigate to="/assessments" replace />} />
            <Route path="/tco-calculator" element={<Navigate to="/assessments/report/inst_finops_cloud_cost_optimization_demo" replace />} />
            <Route path="/roi-calculator" element={<Navigate to="/ge-value-realization?tab=report" replace />} />

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




