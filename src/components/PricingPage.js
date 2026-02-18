import React, { useState } from 'react';
import './PricingPage.css';

const PricingPage = ({ onClose, onSelectPlan, currentPlan = 'free' }) => {
  const [billingCycle, setBillingCycle] = useState('yearly'); // 'monthly' or 'yearly'

  const plans = {
    free: {
      name: 'Free',
      price: 0,
      description: 'Perfect for getting started',
      features: [
        { text: 'Access to 500 Quranic words', included: true },
        { text: 'Browse & search all words', included: true },
        { text: 'Basic flashcards', included: true },
        { text: '2 quiz types', included: true },
        { text: 'Basic progress tracking', included: true },
        { text: 'Browser TTS audio', included: true },
        { text: 'Dark mode', included: true },
        { text: '10 questions per quiz', included: true },
        { text: 'Professional reciter audio', included: false },
        { text: 'Offline mode (PWA)', included: false },
        { text: 'Advanced analytics', included: false },
        { text: 'Spaced repetition AI', included: false },
        { text: 'All quiz types (4+)', included: false },
        { text: 'Certificate of completion', included: false },
        { text: 'Priority support', included: false },
      ]
    },
    premium: {
      name: 'Premium',
      monthlyPrice: 2.99,
      yearlyPrice: 19.99,
      description: 'Unlock the full learning experience',
      popular: true,
      savings: 'Save $16/year',
      features: [
        { text: 'Everything in Free, plus:', included: true, bold: true },
        { text: '🔊 Professional Quran reciter audio', included: true },
        { text: '📱 Offline mode - study anywhere', included: true },
        { text: '📊 Advanced analytics & insights', included: true },
        { text: '🧠 AI-powered spaced repetition', included: true },
        { text: '🎯 All 4+ quiz types unlocked', included: true },
        { text: '📜 Certificate of completion', included: true },
        { text: '☁️ Cloud sync across devices', included: true },
        { text: '🤖 AI tutor - ask questions', included: true },
        { text: '📖 Verse memorization tools', included: true },
        { text: '📝 Custom word lists', included: true },
        { text: '⚡ 20+ questions per quiz', included: true },
        { text: '🏆 Achievements & milestones', included: true },
        { text: '💬 Priority email support', included: true },
        { text: '🆕 Early access to new features', included: true },
      ]
    }
  };

  const getCurrentPrice = () => {
    if (billingCycle === 'monthly') {
      return plans.premium.monthlyPrice;
    }
    return plans.premium.yearlyPrice;
  };

  const getPricePerMonth = () => {
    if (billingCycle === 'monthly') {
      return plans.premium.monthlyPrice;
    }
    return (plans.premium.yearlyPrice / 12).toFixed(2);
  };

  return (
    <div className="pricing-overlay" onClick={onClose}>
      <div className="pricing-modal" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="pricing-header">
          <button className="pricing-close" onClick={onClose}>✕</button>
          <h2 className="pricing-title">Choose Your Plan</h2>
          <p className="pricing-subtitle">
            Start learning for free, upgrade anytime for premium features
          </p>

          {/* Billing Toggle */}
          <div className="billing-toggle">
            <button 
              className={billingCycle === 'monthly' ? 'active' : ''}
              onClick={() => setBillingCycle('monthly')}
            >
              Monthly
            </button>
            <button 
              className={billingCycle === 'yearly' ? 'active' : ''}
              onClick={() => setBillingCycle('yearly')}
            >
              Yearly
              <span className="save-badge">Save 44%</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="pricing-cards">
          
          {/* Free Plan */}
          <div className={`pricing-card ${currentPlan === 'free' ? 'current' : ''}`}>
            <div className="card-header">
              <h3 className="plan-name">Free</h3>
              <div className="plan-price">
                <span className="price-amount">$0</span>
                <span className="price-period">/forever</span>
              </div>
              <p className="plan-description">{plans.free.description}</p>
            </div>

            <ul className="features-list">
              {plans.free.features.map((feature, idx) => (
                <li key={idx} className={feature.included ? 'included' : 'not-included'}>
                  <span className="feature-icon">
                    {feature.included ? '✓' : '✗'}
                  </span>
                  <span className="feature-text">{feature.text}</span>
                </li>
              ))}
            </ul>

            <button 
              className="plan-button free-button"
              onClick={() => onSelectPlan('free')}
              disabled={currentPlan === 'free'}
            >
              {currentPlan === 'free' ? 'Current Plan' : 'Get Started Free'}
            </button>
          </div>

          {/* Premium Plan */}
          <div className={`pricing-card premium ${currentPlan === 'premium' ? 'current' : ''}`}>
            {plans.premium.popular && (
              <div className="popular-badge">Most Popular</div>
            )}
            
            <div className="card-header">
              <h3 className="plan-name">Premium</h3>
              <div className="plan-price">
                <span className="price-amount">${getCurrentPrice()}</span>
                <span className="price-period">/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
              </div>
              {billingCycle === 'yearly' && (
                <p className="price-breakdown">
                  Just ${getPricePerMonth()}/month • {plans.premium.savings}
                </p>
              )}
              <p className="plan-description">{plans.premium.description}</p>
            </div>

            <ul className="features-list">
              {plans.premium.features.map((feature, idx) => (
                <li key={idx} className={feature.included ? 'included' : 'not-included'}>
                  <span className="feature-icon">
                    {feature.included ? '✓' : '✗'}
                  </span>
                  <span className={`feature-text ${feature.bold ? 'bold' : ''}`}>
                    {feature.text}
                  </span>
                </li>
              ))}
            </ul>

            <button 
              className="plan-button premium-button"
              onClick={() => onSelectPlan('premium', billingCycle)}
              disabled={currentPlan === 'premium'}
            >
              {currentPlan === 'premium' ? 'Current Plan' : 'Upgrade to Premium'}
            </button>

            <p className="money-back">30-day money-back guarantee</p>
          </div>

        </div>

        {/* Trust Badges */}
        <div className="trust-section">
          <div className="trust-item">
            <span className="trust-icon">🔒</span>
            <span className="trust-text">Secure Payment via Stripe</span>
          </div>
          <div className="trust-item">
            <span className="trust-icon">✓</span>
            <span className="trust-text">Cancel Anytime</span>
          </div>
          <div className="trust-item">
            <span className="trust-icon">💰</span>
            <span className="trust-text">30-Day Money Back</span>
          </div>
        </div>

        {/* FAQ */}
        <div className="pricing-faq">
          <h3>Frequently Asked Questions</h3>
          <div className="faq-grid">
            <div className="faq-item">
              <h4>Can I switch plans?</h4>
              <p>Yes! You can upgrade or downgrade at any time.</p>
            </div>
            <div className="faq-item">
              <h4>Is my payment secure?</h4>
              <p>Absolutely. We use Stripe for secure payment processing.</p>
            </div>
            <div className="faq-item">
              <h4>Will free features always be free?</h4>
              <p>Yes! Core learning will always remain free.</p>
            </div>
            <div className="faq-item">
              <h4>How does the money-back guarantee work?</h4>
              <p>If you're not satisfied within 30 days, we'll refund you fully.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PricingPage;