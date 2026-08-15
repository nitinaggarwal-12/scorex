import React, { useState, useRef, useEffect } from 'react';
import { 
  BarChart2, 
  ChevronDown, 
  User, 
  LogOut, 
  Lock, 
  MessageSquare, 
  ListChecks, 
  Sparkles, 
  FileText, 
  Layers, 
  LogIn, 
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Users
} from 'lucide-react';
import { ASSESSMENTS } from '../data/assessmentCatalog';

export default function Navbar({
  user,
  onLoginClick,
  onLogoutClick,
  onOpenDashboard,
  onSelectAssessment,
  activeFramework = 'option12',
  onOpenSettings,
  onOpenDisclaimer,
  onTrySample
}) {
  const [isAssessmentsOpen, setIsAssessmentsOpen] = useState(false);
  const [isAssignmentsOpen, setIsAssignmentsOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const assessmentsRef = useRef(null);
  const assignmentsRef = useRef(null);
  const adminRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (assessmentsRef.current && !assessmentsRef.current.contains(e.target)) {
        setIsAssessmentsOpen(false);
      }
      if (assignmentsRef.current && !assignmentsRef.current.contains(e.target)) {
        setIsAssignmentsOpen(false);
      }
      if (adminRef.current && !adminRef.current.contains(e.target)) {
        setIsAdminOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleNavClick = (section) => {
    if (section === 'home') {
      window.location.hash = '#home';
    } else if (section === 'dashboard') {
      onOpenDashboard();
    } else {
      alert(`📌 Navigating to ${section.replace('-', ' ').toUpperCase()} section...`);
    }
  };

  return (
    <header className="ref-navbar no-print">
      {/* LEFT NAVIGATION LINKS */}
      <div className="ref-nav-left">
        <button className="ref-nav-link active" onClick={() => handleNavClick('home')}>
          Home
        </button>
        <button className="ref-nav-link" onClick={() => handleNavClick('deep-dive')}>
          Deep Dive
        </button>
        <button className="ref-nav-link" onClick={() => handleNavClick('pitch-deck')}>
          Pitch Deck
        </button>
        <button className="ref-nav-link" onClick={() => handleNavClick('user-guide')}>
          User Guide
        </button>
        <button className="ref-nav-link" onClick={() => handleNavClick('workflow-demo')}>
          Workflow Demo
        </button>
      </div>

      {/* RIGHT ACTION CONTROLS */}
      <div className="ref-nav-right">
        {/* Dashboard Button */}
        <button className="btn-nav-dashboard" onClick={onOpenDashboard}>
          Dashboard
        </button>

        {/* Assessments Dropdown */}
        <div className="ref-nav-dropdown-wrapper" ref={assessmentsRef}>
          <button 
            className="btn-nav-dropdown"
            onClick={() => {
              setIsAssessmentsOpen(!isAssessmentsOpen);
              setIsAssignmentsOpen(false);
              setIsAdminOpen(false);
            }}
          >
            <FileText size={15} />
            <span>Assessments</span>
            <ChevronDown size={14} />
          </button>

          {isAssessmentsOpen && (
            <div className="ref-dropdown-menu">
              <div className="dropdown-header-label">AVAILABLE ASSESSMENTS</div>
              {Object.values(ASSESSMENTS).map((a) => (
                <button
                  key={a.id}
                  className="ref-dropdown-item"
                  onClick={() => {
                    onSelectAssessment(a.id);
                    setIsAssessmentsOpen(false);
                  }}
                >
                  <span className="dropdown-item-accent" style={{ color: a.accent }}>●</span>
                  <div className="dropdown-item-text">
                    <span className="item-title">{a.name}</span>
                    <span className="item-sub">{a.tagline}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Assignments Dropdown */}
        <div className="ref-nav-dropdown-wrapper" ref={assignmentsRef}>
          <button 
            className="btn-nav-dropdown"
            onClick={() => {
              setIsAssignmentsOpen(!isAssignmentsOpen);
              setIsAssessmentsOpen(false);
              setIsAdminOpen(false);
            }}
          >
            <ListChecks size={15} />
            <span>Assignments</span>
            <ChevronDown size={14} />
          </button>

          {isAssignmentsOpen && (
            <div className="ref-dropdown-menu">
              <div className="dropdown-header-label">ACTIVE ASSIGNMENTS</div>
              <button 
                className="ref-dropdown-item"
                onClick={() => {
                  onSelectAssessment('option12');
                  setIsAssignmentsOpen(false);
                }}
              >
                <div className="dropdown-item-text">
                  <span className="item-title">CityTech Solutions Data & AI</span>
                  <span className="item-sub">6 of 6 pillars • Ready for review</span>
                </div>
              </button>
              <button 
                className="ref-dropdown-item"
                onClick={() => {
                  onSelectAssessment('option5');
                  setIsAssignmentsOpen(false);
                }}
              >
                <div className="dropdown-item-text">
                  <span className="item-title">Merck Clinical Trial ML Audit</span>
                  <span className="item-sub">Draft • 4 of 6 pillars</span>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Try Sample Button (if guest or logged in) */}
        <button className="btn-nav-sample" onClick={onTrySample}>
          <Sparkles size={14} />
          <span>Try Sample</span>
        </button>

        {/* Start Assessment CTA */}
        <button 
          className="btn-nav-start"
          onClick={() => onSelectAssessment('option12')}
        >
          <span>Start Assessment →</span>
        </button>

        {/* User / Admin Dropdown or Login button */}
        {user ? (
          <div className="ref-nav-dropdown-wrapper" ref={adminRef}>
            <button 
              className="btn-nav-admin"
              onClick={() => {
                setIsAdminOpen(!isAdminOpen);
                setIsAssessmentsOpen(false);
                setIsAssignmentsOpen(false);
              }}
            >
              <User size={15} />
              <span>{user.role === 'admin' ? 'Admin' : 'Account'}</span>
              <ChevronDown size={14} />
            </button>

            {isAdminOpen && (
              <div className="ref-dropdown-menu admin-menu">
                <button className="ref-dropdown-item" onClick={() => { alert("Switched to Author mode"); setIsAdminOpen(false); }}>
                  <UserCheck size={16} />
                  <span>Switch to Author</span>
                </button>
                <button className="ref-dropdown-item" onClick={() => { alert("Switched to Consumer mode"); setIsAdminOpen(false); }}>
                  <Users size={16} />
                  <span>Switch to Consumer</span>
                </button>
                <button className="ref-dropdown-item" onClick={() => { onOpenSettings(); setIsAdminOpen(false); }}>
                  <Lock size={16} />
                  <span>Change Password / Keys</span>
                </button>
                <button className="ref-dropdown-item" onClick={() => { onLogoutClick(); setIsAdminOpen(false); }}>
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
                <div className="dropdown-divider"></div>
                <button className="ref-dropdown-item" onClick={() => { alert("Feedback modal opened."); setIsAdminOpen(false); }}>
                  <MessageSquare size={16} />
                  <span>Give Feedback</span>
                </button>
                <button className="ref-dropdown-item" onClick={() => { alert("Viewing all feedback..."); setIsAdminOpen(false); }}>
                  <MessageSquare size={16} />
                  <span>View All Feedback</span>
                </button>
                <div className="dropdown-user-email">
                  <span>{user.email || 'admin@databricks.com'}</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button className="btn-nav-login" onClick={onLoginClick}>
            <LogIn size={15} />
            <span>Login</span>
          </button>
        )}
      </div>
    </header>
  );
}
