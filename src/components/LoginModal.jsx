import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, User, Sparkles, X, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function LoginModal({ isOpen, onClose, onLogin, onExploreAsGuest }) {
  const [activeTab, setActiveTab] = useState('advisor'); // 'advisor' | 'customer'
  const [email, setEmail] = useState('admin@enterprise.com');
  const [password, setPassword] = useState('admin123');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onLogin) {
      onLogin({
        email: email || (activeTab === 'advisor' ? 'admin@enterprise.com' : 'customer@enterprise.com'),
        role: activeTab === 'advisor' ? 'admin' : 'consumer',
        isGuest: false
      });
    }
    onClose();
  };

  const handleGuestEntry = () => {
    if (onExploreAsGuest) {
      onExploreAsGuest();
    }
    onClose();
  };

  return (
    <div className="login-modal-overlay" onClick={onClose}>
      <div className="login-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="login-modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        {/* Left Coral / Amber Brand Panel */}
        <div className="login-modal-left">
          <div className="login-modal-left-content">
            <h2>{activeTab === 'advisor' ? 'Enterprise Assessment Suite' : 'Enterprise Customer'}</h2>
            <p>
              {activeTab === 'advisor' 
                ? 'Sign in to access your cross-workload portfolio diagnostics, executive benchmarks, and live dynamic maturity evaluations.'
                : 'Complete assigned maturity assessments, view targeted architectural gap analysis, and explore transformation roadmaps.'}
            </p>
          </div>
          <div className="login-modal-left-footer">
            <ShieldCheck size={16} />
            <span>Enterprise-Grade Security & Governance</span>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="login-modal-right">
          {/* Segmented Toggle */}
          <div className="login-segmented-toggle">
            <button
              type="button"
              className={`login-segment-btn ${activeTab === 'advisor' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('advisor');
                setEmail('admin@enterprise.com');
              }}
            >
              Advisor / Lead
            </button>
            <button
              type="button"
              className={`login-segment-btn ${activeTab === 'customer' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('customer');
                setEmail('customer@enterprise.com');
              }}
            >
              Customer / Stakeholder
            </button>
          </div>

          <div className="login-form-header">
            <h3>Welcome Back</h3>
            <p>Sign in to your {activeTab === 'advisor' ? 'Advisor' : 'Customer'} account</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-input-group">
              <label>Email Address</label>
              <div className="login-input-wrapper">
                <Mail size={16} className="login-input-icon" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@enterprise.com"
                  required
                />
              </div>
            </div>

            <div className="login-input-group">
              <label>Password</label>
              <div className="login-input-wrapper">
                <Lock size={16} className="login-input-icon" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button type="submit" className="login-submit-btn">
              Sign In
            </button>
          </form>

          <div className="login-guest-divider">
            <span>OR</span>
          </div>

          {/* Direct Guest Bypass Option */}
          <button 
            type="button" 
            className="login-guest-btn"
            onClick={handleGuestEntry}
          >
            <Sparkles size={16} />
            <span>Explore as Guest (No sign in required)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
