import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PaymentCancelled.css';

const PaymentCancelled = () => {
  const navigate = useNavigate();

  return (
    <div className="payment-cancelled-page">
      <div className="cancelled-card">
        {/* Cancel Icon */}
        <div className="cancel-icon-wrapper">
          <div className="cancel-icon">✕</div>
        </div>

        {/* Title */}
        <h1 className="cancel-title">Payment Cancelled</h1>
        
        {/* Subtitle */}
        <p className="cancel-subtitle">
          No worries! Your payment was not processed.
        </p>

        {/* Message */}
        <div className="cancel-message">
          <p>You can try again anytime when you're ready.</p>
          <p>Your free trial is still active if you haven't used it yet!</p>
        </div>

        {/* Why Subscribe Section */}
        <div className="why-subscribe">
          <h3>Why Go Premium?</h3>
          <ul>
            <li>📚 Access 1000+ Quranic words</li>
            <li>🧠 Advanced learning features</li>
            <li>📊 Detailed progress tracking</li>
            <li>🎯 Understand 70% of the Quran</li>
            <li>💯 Money-back guarantee</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="cancel-actions">
          <button 
            className="try-again-btn"
            onClick={() => navigate('/?pricing=true')}
          >
            Try Again
          </button>
          <button 
            className="return-btn"
            onClick={() => navigate('/')}
          >
            Return to App
          </button>
        </div>

        {/* Support */}
        <p className="support-text">
          Have questions? Email us at support@quranvocabulary.com
        </p>
      </div>
    </div>
  );
};

export default PaymentCancelled;
