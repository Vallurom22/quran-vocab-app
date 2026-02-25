/**
 * 🎯 SMART UPGRADE PROMPT
 * Shows at the right moments with pricing plans
 * Connects directly to Stripe checkout
 */

import React, { useState } from 'react';
import { redirectToCheckout, startFreeTrial, checkTrialStatus } from '../components/StripeIntegration';
import { useAuth } from '../contexts/AuthContext';
import './SmartUpgradePrompt.css';

const SmartUpgradePrompt = ({ 
  trigger, // 'milestone' | 'locked_feature' | 'word_limit'
  onClose
}) => {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState('yearly');
  const [isProcessing, setIsProcessing] = useState(false);
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
      features: ['All 1000+ words', 'All learning modes', 'Cancel anytime']
    },
    {
      id: 'yearly',
      name: 'Yearly',
      price: '$79.99',
      period: '/year',
      badge: '⭐ BEST VALUE',
      hasTrial: true,
      features: ['7-day FREE trial', 'Save $40/year', 'Priority support']
    },
    {
      id: 'lifetime',
      name: 'Lifetime',
      price: '$199.99',
      period: 'one-time',
      badge: '👑 ULTIMATE',
      hasTrial: true,
      features: ['7-day FREE trial', 'Pay once forever', 'VIP support']
    }
  ];

  const handleSelectPlan = async (plan) => {
    if (isProcessing) return;

    if (!user) {
      alert('Please sign in first to upgrade!');
      onClose();
      return;
    }

    setIsProcessing(true);

    try {
      // Monthly - direct to payment
      if (plan.id === 'monthly') {
        await redirectToCheckout(plan.id, user.id, user.email);
        return;
      }

      // Yearly/Lifetime - check trial
      if (trialStatus.isActive) {
        await redirectToCheckout(plan.id, user.id, user.email);
      } else {
        startFreeTrial(user.id);
        alert('🎉 7-day free trial started! Full access unlocked.');
        onClose();
        window.location.reload();
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="upgrade-prompt-overlay" onClick={onClose}>
      <div className="upgrade-prompt-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-prompt-btn" onClick={onClose}>✕</button>

        {/* Header */}
        <div className="prompt-header">
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
          {isProcessing ? 'Processing...' : 
           selectedPlan === 'monthly' ? 'Subscribe Now' :
           trialStatus.isActive ? `Get ${plans.find(p => p.id === selectedPlan)?.name}` :
           'Start 7-Day Free Trial'}
        </button>

        <button className="prompt-maybe-later" onClick={onClose}>
          Maybe Later
        </button>
      </div>
    </div>
  );
};

export default SmartUpgradePrompt;
