/**
 * 📝 SIGNUP COMPONENT
 * Beautiful signup form with email verification
 */

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Auth.css';

const Signup = ({ onClose, onSwitchToLogin }) => {
  const { signUp } = useAuth();
  
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    const { displayName, email, password, confirmPassword } = formData;

    if (!displayName || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return false;
    }

    if (displayName.length < 2) {
      setError('Name must be at least 2 characters');
      return false;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email');
      return false;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      const { user, error: signUpError } = await signUp(
        formData.email,
        formData.password,
        formData.displayName
      );

      if (signUpError) {
        // Handle specific errors
        if (signUpError.message.includes('already registered')) {
          setError('This email is already registered. Please sign in instead.');
        } else if (signUpError.message.includes('invalid email')) {
          setError('Please enter a valid email address');
        } else {
          setError(signUpError.message);
        }
        return;
      }

      if (user) {
        // Success! Show verification message
        setSuccess(true);
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Success screen
  if (success) {
    return (
      <div className="auth-overlay" onClick={onClose}>
        <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
          <button className="auth-close" onClick={onClose}>✕</button>
          
          <div className="auth-success">
            <div className="success-icon">✅</div>
            <h2>Account Created!</h2>
            <p>We've sent a verification email to:</p>
            <div className="email-badge">{formData.email}</div>
            <p className="verification-note">
              Please check your inbox and click the verification link to activate your account.
            </p>
            <div className="success-tips">
              <h4>What's next?</h4>
              <ul>
                <li>📧 Check your email (including spam folder)</li>
                <li>✉️ Click the verification link</li>
                <li>🚀 Sign in and start learning!</li>
              </ul>
            </div>
            <button className="auth-submit-btn" onClick={onSwitchToLogin}>
              Go to Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Signup form
  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        
        {/* Close Button */}
        <button className="auth-close" onClick={onClose}>✕</button>

        {/* Header */}
        <div className="auth-header">
          <div className="auth-icon">🌟</div>
          <h2>Create Account</h2>
          <p>Start your Quranic vocabulary journey</p>
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

          {/* Display Name Input */}
          <div className="form-group">
            <label htmlFor="displayName">Your Name</label>
            <div className="input-wrapper">
              <span className="input-icon">👤</span>
              <input
                id="displayName"
                name="displayName"
                type="text"
                placeholder="Enter your name"
                value={formData.displayName}
                onChange={handleChange}
                disabled={loading}
                autoComplete="name"
                required
              />
            </div>
          </div>

          {/* Email Input */}
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <span className="input-icon">✉️</span>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleChange}
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
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a password (min 6 characters)"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                autoComplete="new-password"
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
            <div className="password-strength">
              {formData.password.length >= 6 ? (
                <span className="strength-good">✓ Strong password</span>
              ) : formData.password.length > 0 ? (
                <span className="strength-weak">⚠️ At least 6 characters</span>
              ) : null}
            </div>
          </div>

          {/* Confirm Password Input */}
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading}
                autoComplete="new-password"
                required
              />
            </div>
            {formData.confirmPassword && (
              <div className="password-match">
                {formData.password === formData.confirmPassword ? (
                  <span className="match-good">✓ Passwords match</span>
                ) : (
                  <span className="match-bad">✗ Passwords don't match</span>
                )}
              </div>
            )}
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
                Creating account...
              </>
            ) : (
              <>
                <span>🚀</span>
                Create Account
              </>
            )}
          </button>

        </form>

        {/* Footer */}
        <div className="auth-footer">
          <p>Already have an account?</p>
          <button className="auth-switch-btn" onClick={onSwitchToLogin}>
            Sign In
          </button>
        </div>

      </div>
    </div>
  );
};

export default Signup;