/**
 * 💳 SMART UPGRADE PROMPT - AUTH REQUIRED
 * Redirects to signup if not logged in
 */

import React, { useState } from 'react';
import { redirectToCheckout, checkTrialStatus } from '../components/StripeIntegration';
import { useAuth } from '../contexts/AuthContext';
import './SmartUpgradePrompt.css';

const SmartUpgradePrompt = ({ trigger, onClose }) => {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState('yearly');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const trialStatus = checkTrialStatus();

  const content = {
    milestone: {
      icon: '🎉',
      title: 'Amazing Progress!',
      subtitle: "You've mastered all 100 free words!",
      message: 'Ready to continue your journey?'
    },
    locked_feature: {
      icon: '🔒',
      title: 'Premium Feature',
      subtitle: 'This learning mode is available with Premium',
      message: 'Unlock all advanced features:'
    },
    word_limit: {
      icon: '📚',
      title: 'More Words Available',
      subtitle: 'Continue learning with Premium',
      message: 'Get access to 900+ more words:'
    }
  };

  const data = content[trigger] || content.word_limit;

  const plans = [
    {
      id: 'monthly',
      name: 'Monthly',
      price: '$9.99',
      period: '/month',
      originalPrice: '$29.99',
      badge: '🔥 SPECIAL',
      hasTrial: false,
      description: 'Limited time special price',
      features: ['All 1000+ words', 'All learning modes', 'Cancel anytime'],
      ctaText: 'Subscribe Now'
    },
    {
      id: 'yearly',
      name: 'Yearly',
      price: '$79.99',
      period: '/year',
      badge: '⭐ BEST VALUE',
      hasTrial: true,
      description: 'Best value for serious learners',
      features: [
        '🎁 7-day trial • $0 today',
        'Charged after 7 days',
        'Save $40/year',
        'Priority support'
      ],
      ctaText: 'Start 7-Day Trial'
    },
    {
      id: 'lifetime',
      name: 'Lifetime',
      price: '$199.99',
      period: 'one-time',
      badge: '👑 ULTIMATE',
      hasTrial: true,
      description: 'The ultimate investment',
      features: [
        '🎁 7-day trial • $0 today',
        'Charged after 7 days',
        'Pay once forever',
        'VIP support'
      ],
      ctaText: 'Start 7-Day Trial'
    }
  ];

  const handleSelectPlan = async (plan) => {
    if (isProcessing) return;

    // ✅ CHECK: User must be logged in
    if (!user) {
      console.log('❌ User not logged in - showing auth prompt');
      setShowAuthPrompt(true);
      return;
    }

    setIsProcessing(true);

    try {
      console.log('💳 Redirecting to Stripe for:', plan.id);
      
      // Save selected plan to continue after login
      localStorage.setItem('pending_plan', plan.id);
      
      // Redirect to Stripe
      await redirectToCheckout(plan.id, user.id, user.email);
      
    } catch (error) {
      console.error('❌ Error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSignup = () => {
    // Save selected plan for after signup
    localStorage.setItem('pending_plan', selectedPlan);
    localStorage.setItem('return_to_pricing', 'true');
    
    onClose();
    
    // Trigger signup modal in App.js
    window.dispatchEvent(new CustomEvent('openSignup'));
  };

  const handleLogin = () => {
    // Save selected plan for after login
    localStorage.setItem('pending_plan', selectedPlan);
    localStorage.setItem('return_to_pricing', 'true');
    
    onClose();
    
    // Trigger login modal in App.js
    window.dispatchEvent(new CustomEvent('openLogin'));
  };

  // ✅ Show auth prompt if not logged in
  if (showAuthPrompt) {
    return (
      <div className="pricing-overlay" onClick={onClose}>
        <div className="pricing-modal auth-prompt-modal" onClick={(e) => e.stopPropagation()}>
          <button className="close-btn" onClick={onClose}>✕</button>

          <div className="auth-prompt-content">
            <div className="auth-prompt-icon">🔐</div>
            <h2>Sign In Required</h2>
            <p className="auth-prompt-text">
              Please create an account or sign in to continue with your purchase.
            </p>

            <div className="auth-prompt-benefits">
              <h4>Why create an account?</h4>
              <ul>
                <li>✓ Save your learning progress</li>
                <li>✓ Sync across all devices</li>
                <li>✓ Manage your subscription</li>
                <li>✓ Access premium features</li>
              </ul>
            </div>

            <div className="auth-prompt-buttons">
              <button className="auth-btn primary" onClick={handleSignup}>
                Create Account
              </button>
              <button className="auth-btn secondary" onClick={handleLogin}>
                Sign In
              </button>
            </div>

            <p className="auth-prompt-note">
              We'll bring you back to complete your purchase after signing in.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pricing-overlay" onClick={onClose}>
      <div className="pricing-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>

        {/* Header */}
        <div className="pricing-header">
          <div className="prompt-icon">{data.icon}</div>
          <h2>{data.title}</h2>
          <p className="prompt-subtitle">{data.subtitle}</p>
        </div>

        {/* Features */}
        <div className="prompt-features">
          <h3>{data.message}</h3>
          <ul>
            <li>✓ All 1000+ Quranic words</li>
            <li>✓ Advanced learning modes</li>
            <li>✓ Spaced repetition</li>
            <li>✓ Verse context & tafsir</li>
            <li>✓ Progress analytics</li>
            <li>✓ Offline access</li>
          </ul>
        </div>

        {/* Pricing Plans */}
        <div className="prompt-plans">
          {plans.map(plan => (
            <div 
              key={plan.id}
              className={`plan-option ${selectedPlan === plan.id ? 'selected' : ''}`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.badge && <div className="plan-badge">{plan.badge}</div>}
              
              {plan.originalPrice && (
                <div className="original-price">{plan.originalPrice}</div>
              )}
              <div className="plan-name">{plan.name}</div>
              <div className="plan-price">
                {plan.price}
                <span className="plan-period">{plan.period}</span>
              </div>
              <ul className="plan-features-mini">
                {plan.features.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button 
          className="prompt-upgrade-btn"
          onClick={() => handleSelectPlan(plans.find(p => p.id === selectedPlan))}
          disabled={isProcessing}
        >
          {isProcessing ? 'Redirecting to Stripe...' : 
           plans.find(p => p.id === selectedPlan)?.ctaText}
        </button>

        {/* Clear explanation */}
        <div className="trial-explanation">
          {selectedPlan === 'monthly' ? (
            <p className="trial-note">
              💳 Charged $9.99 today<br/>
              ✓ Cancel anytime<br/>
              ✓ 30-day money-back guarantee
            </p>
          ) : (
            <p className="trial-note">
              💳 Credit card required • $0 charged today<br/>
              ✓ Full access for 7 days<br/>
              ✓ Charged ${plans.find(p => p.id === selectedPlan)?.price} after trial<br/>
              ✓ Cancel anytime during trial = $0 charged
            </p>
          )}
        </div>

        <button className="prompt-maybe-later" onClick={onClose}>
          Maybe Later
        </button>
      </div>
    </div>
  );
};

export default SmartUpgradePrompt;
