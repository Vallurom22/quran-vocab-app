/**
 * 🔐 LOGIN COMPONENT
 * Beautiful login form with email/password authentication
 */

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Auth.css';

const Login = ({ onClose, onSwitchToSignup, onSwitchToReset }) => {
  const { signIn } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }

    setLoading(true);

    try {
      const { user, error: signInError } = await signIn(email, password);

      if (signInError) {
        // Handle specific errors
        if (signInError.message.includes('Invalid login credentials')) {
          setError('Invalid email or password');
        } else if (signInError.message.includes('Email not confirmed')) {
          setError('Please verify your email before logging in');
        } else {
          setError(signInError.message);
        }
        return;
      }

      if (user) {
        // Success! Close modal
        onClose();
        window.location.reload(); // Reload to sync data
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        
        {/* Close Button */}
        <button className="auth-close" onClick={onClose}>✕</button>

        {/* Header */}
        <div className="auth-header">
          <div className="auth-icon">🕌</div>
          <h2>"Welcome to Kalima"</h2>
          <p>Sign in to continue your learning journey</p>
        </div>

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit}>
          
          {/* Error Message */}
          {error && (
            <div className="auth-error">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          {/* Email Input */}
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <span className="input-icon">✉️</span>
              <input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                autoComplete="email"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="form-footer">
            <button
              type="button"
              className="forgot-password-link"
              onClick={onSwitchToReset}
            >
              Forgot password?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="auth-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Signing in...
              </>
            ) : (
              <>
                <span>🚀</span>
                Sign In
              </>
            )}
          </button>

        </form>

        {/* Footer */}
        <div className="auth-footer">
          <p>Don't have an account?</p>
          <button className="auth-switch-btn" onClick={onSwitchToSignup}>
            Create Account
          </button>
        </div>

      </div>
    </div>
  );
};

export default Login;