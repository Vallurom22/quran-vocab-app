import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { activateSubscription } from '../utils/StripeIntegration';
import './PaymentSuccess.css';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    // Get session ID from URL
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');

    if (sessionId) {
      // Activate subscription
      activateSubscription('premium', sessionId);
      
      // Save to localStorage as backup
      localStorage.setItem('premium_activated', 'true');
      localStorage.setItem('activation_date', new Date().toISOString());
      
      console.log('✅ Premium activated with session:', sessionId);
    }

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Redirect to app
          navigate('/');
          window.location.reload();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="payment-success-page">
      <div className="success-card">
        {/* Success Icon */}
        <div className="success-icon-wrapper">
          <div className="success-icon">✓</div>
          <div className="success-glow"></div>
        </div>

        {/* Title */}
        <h1 className="success-title">Payment Successful!</h1>
        
        {/* Subtitle */}
        <p className="success-subtitle">
          🎉 Welcome to Premium! You now have full access to all features.
        </p>

        {/* Features Unlocked */}
        <div className="unlocked-features">
          <h3>✨ You've Unlocked:</h3>
          <ul>
            <li>✓ 1000+ Quranic vocabulary words</li>
            <li>✓ Advanced spaced repetition</li>
            <li>✓ Multi-sensory learning modes</li>
            <li>✓ Active recall quizzes</li>
            <li>✓ Verse context & tafsir</li>
            <li>✓ Progress analytics</li>
            <li>✓ Offline access</li>
            <li>✓ Zero ads forever</li>
          </ul>
        </div>

        {/* Redirect Message */}
        <div className="redirect-message">
          <p>Redirecting to your dashboard in <strong>{countdown}</strong> seconds...</p>
          <button 
            className="continue-btn"
            onClick={() => {
              navigate('/');
              window.location.reload();
            }}
          >
            Continue to App →
          </button>
        </div>

        {/* Support */}
        <p className="support-text">
          Questions? Email us at support@quranvocabulary.com
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
