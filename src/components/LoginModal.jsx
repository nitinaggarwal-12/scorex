import React, { useState } from 'react';
import { X, Mail, Lock, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';

export default function LoginModal({ isOpen, onClose, onLogin, onExploreAsGuest }) {
  const [activeTab, setActiveTab] = useState('databricks'); // 'databricks' | 'customer'
  const [email, setEmail] = useState('admin@databricks.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e?.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin({
        email: email || (activeTab === 'databricks' ? 'admin@databricks.com' : 'customer@company.com'),
        role: activeTab === 'databricks' ? 'admin' : 'consumer',
        isGuest: false
      });
      onClose();
    }, 300);
  };

  const handleGuest = () => {
    onExploreAsGuest();
    onClose();
  };

  return (
    <div className="login-modal-overlay" onClick={onClose}>
      <div className="login-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button className="login-modal-close" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        {/* LEFT PANEL: Solid Red/Coral Brand Panel */}
        <div className="login-modal-left">
          <div className="login-modal-left-content">
            <h2>{activeTab === 'databricks' ? 'Databricks Team' : 'Enterprise Customer'}</h2>
            <p>
              {activeTab === 'databricks'
                ? 'Access your authoring and administration tools to manage customer assessments and deliver insights.'
                : 'Access your team assessments, view personalized benchmarks, and export executive roadmaps.'}
            </p>
          </div>
          <div className="login-modal-left-footer">
            <ShieldCheck size={18} />
            <span>Secure Enterprise Workspace</span>
          </div>
        </div>

        {/* RIGHT PANEL: Sign In Form */}
        <div className="login-modal-right">
          {/* Segmented Toggle */}
          <div className="login-segmented-toggle">
            <button
              type="button"
              className={`login-segment-btn ${activeTab === 'databricks' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('databricks');
                setEmail('admin@databricks.com');
                setPassword('admin123');
              }}
            >
              Databricks
            </button>
            <button
              type="button"
              className={`login-segment-btn ${activeTab === 'customer' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('customer');
                setEmail('lead@customer.com');
                setPassword('customer123');
              }}
            >
              Customer
            </button>
          </div>

          <div className="login-form-header">
            <h3>Sign In</h3>
            <p>Sign in to your {activeTab === 'databricks' ? 'Databricks' : 'Customer'} account</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-input-group">
              <label>Email Address</label>
              <div className="login-input-wrapper">
                <Mail className="login-input-icon" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            <div className="login-input-group">
              <label>Password</label>
              <div className="login-input-wrapper">
                <Lock className="login-input-icon" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button type="submit" className="login-submit-btn" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Explore as Guest Option */}
          <div className="login-guest-divider">
            <span>OR</span>
          </div>

          <button type="button" className="login-guest-btn" onClick={handleGuest}>
            <Sparkles size={16} />
            <span>Explore as Guest (No sign-in required)</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
