/**
 * 💰 PRICING PAGE - CONNECTED TO STRIPE
 * 
 * Plan 1: Monthly - $9.99 (originally $29.99) - NO FREE TRIAL
 * Plan 2: Yearly - $79.99 with 7-day FREE TRIAL
 * Plan 3: Lifetime - $199.99 with 7-day FREE TRIAL
 */

import React, { useState } from 'react';
import { redirectToCheckout, startFreeTrial, checkTrialStatus } from '../utils/StripeIntegration';
import { useAuth } from '../contexts/AuthContext';
import './PricingPageConnected.css';

const PricingPageConnected = ({ onClose, currentPlan = 'free' }) => {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState('yearly');
  const [isProcessing, setIsProcessing] = useState(false);
  const trialStatus = checkTrialStatus();

  const plans = [
    {
      id: 'monthly',
      name: 'Monthly',
      price: '$9.99',
      period: '/month',
      originalPrice: '$29.99',
      savings: 'SAVE $20/month',
      badge: '🔥 SPECIAL OFFER',
      hasTrial: false, // NO FREE TRIAL
      description: 'Limited time special price',
      features: [
        'All 1000+ Quranic words',
        'Advanced spaced repetition',
        'Multi-sensory learning',
        'Active recall quizzes',
        'Verse context & tafsir',
        'Progress analytics',
        'Offline access',
        'Cancel anytime'
      ],
      cta: 'Subscribe Now',
      highlight: false
    },
    {
      id: 'yearly',
      name: 'Yearly',
      price: '$79.99',
      period: '/year',
      originalPrice: null,
      savings: '~$6.67/month',
      badge: '⭐ BEST VALUE',
      hasTrial: true, // HAS 7-DAY FREE TRIAL
      description: 'Best value for serious learners',
      features: [
        '🎁 7-DAY FREE TRIAL',
        'Everything in Monthly',
        'Save vs monthly plan',
        'Priority support',
        'Annual member badge',
        'Early feature access',
        'All future updates',
        'Best overall value'
      ],
      cta: trialStatus.isActive ? 'Subscribe Yearly' : 'Start 7-Day Free Trial',
      highlight: true
    },
    {
      id: 'lifetime',
      name: 'Lifetime',
      price: '$199.99',
      period: 'one-time',
      originalPrice: null,
      savings: 'Pay once, own forever',
      badge: '👑 ULTIMATE',
      hasTrial: true, // HAS 7-DAY FREE TRIAL
      description: 'The ultimate investment',
      features: [
        '🎁 7-DAY FREE TRIAL',
        'Everything in Yearly',
        'Lifetime access forever',
        'All future updates',
        'VIP priority support',
        'Exclusive lifetime badge',
        'Never pay again',
        'Support development'
      ],
      cta: trialStatus.isActive ? 'Get Lifetime Access' : 'Start 7-Day Free Trial',
      highlight: false
    }
  ];

  const handleSelectPlan = async (plan) => {
    if (isProcessing) return;

    // Check if user is logged in
    if (!user) {
      alert('Please sign in first!');
      return;
    }

    setIsProcessing(true);
    setSelectedPlan(plan.id);

    try {
      console.log('🎯 Selected plan:', plan.id);

      // MONTHLY PLAN - Direct to payment (no trial)
      if (plan.id === 'monthly') {
        console.log('💳 Monthly plan - proceeding to payment');
        await redirectToCheckout(plan.id, user.id, user.email);
        return;
      }

      // YEARLY & LIFETIME - Check trial status
      if (trialStatus.isActive) {
        // Already in trial, go to payment
        console.log('💳 Already in trial - proceeding to payment');
        await redirectToCheckout(plan.id, user.id, user.email);
      } else {
        // Start free trial
        console.log('🎉 Starting 7-day free trial');
        startFreeTrial(user.id);
        
        const trialEndDate = new Date();
        trialEndDate.setDate(trialEndDate.getDate() + 7);
        
        alert(
          `🎉 Your 7-day free trial has started!\n\n` +
          `You have full access to all premium features until ${trialEndDate.toLocaleDateString()}.\n\n` +
          `No payment required during the trial!`
        );
        
        onClose();
        window.location.reload();
      }
    } catch (error) {
      console.error('❌ Error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="pricing-overlay">
      <div className="pricing-modal">
        <button className="close-btn" onClick={onClose}>✕</button>

        {/* Header */}
        <div className="pricing-header">
          <h1>Choose Your Path to Understanding the Quran</h1>
          <p className="pricing-subtitle">
            Start learning Quranic Arabic today
          </p>

          {/* Trial Status Banner */}
          {trialStatus.isActive && (
            <div className="trial-active-banner">
              🎉 Your free trial is active! {trialStatus.daysRemaining} days remaining
            </div>
          )}

          {/* Special Offer Banner */}
          <div className="special-offer-banner">
            <span className="offer-badge">🔥 LIMITED TIME</span>
            <span className="offer-text">
              Monthly plan just $9.99 (normally $29.99) - Save $20/month!
            </span>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="trust-badges">
          <span>✓ 7-Day Free Trial on Yearly & Lifetime</span>
          <span>✓ 30-Day Money-Back</span>
          <span>✓ Cancel Anytime</span>
        </div>

        {/* Pricing Cards */}
        <div className="pricing-cards">
          {plans.map(plan => (
            <div 
              key={plan.id}
              className={`pricing-card ${plan.highlight ? 'highlighted' : ''}`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="plan-badge">{plan.badge}</div>
              )}

              {/* Plan Header */}
              <div className="plan-header">
                <h3 className="plan-name">{plan.name}</h3>
                <p className="plan-description">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="plan-price">
                {plan.originalPrice && (
                  <div className="original-price">
                    <span className="strikethrough">{plan.originalPrice}</span>
                  </div>
                )}
                <div className="current-price">
                  <span className="price-amount">{plan.price}</span>
                  <span className="price-period">{plan.period}</span>
                </div>
                {plan.savings && (
                  <div className="savings-badge">{plan.savings}</div>
                )}
              </div>

              {/* Trial Badge */}
              {plan.hasTrial && !trialStatus.isActive && (
                <div className="trial-badge">
                  🎁 Includes 7-Day Free Trial
                </div>
              )}

              {/* Features */}
              <ul className="plan-features">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="feature-item">
                    {feature.includes('🎁') ? (
                      <strong>{feature}</strong>
                    ) : (
                      <>✓ {feature}</>
                    )}
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button 
                className={`cta-btn ${plan.highlight ? 'primary' : 'secondary'}`}
                onClick={() => handleSelectPlan(plan)}
                disabled={isProcessing}
              >
                {isProcessing && selectedPlan === plan.id ? (
                  'Processing...'
                ) : (
                  plan.cta
                )}
              </button>

              {/* No Trial Notice for Monthly */}
              {!plan.hasTrial && (
                <p className="no-trial-notice">
                  ⚡ Instant access - no trial needed
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Trial Explanation */}
        <div className="trial-explanation">
          <h3>🎁 How the Free Trial Works</h3>
          <div className="trial-steps">
            <div className="trial-step">
              <div className="step-number">1</div>
              <p><strong>Start Your Trial</strong><br/>Get instant access to all premium features</p>
            </div>
            <div className="trial-step">
              <div className="step-number">2</div>
              <p><strong>Learn for 7 Days</strong><br/>Try everything with no commitment</p>
            </div>
            <div className="trial-step">
              <div className="step-number">3</div>
              <p><strong>Decide Later</strong><br/>Choose a plan or cancel - your choice!</p>
            </div>
          </div>
          <p className="trial-note">
            💳 No credit card required for trial • Cancel anytime during trial with one click
          </p>
        </div>

        {/* Comparison Table */}
        <div className="comparison-section">
          <h3>📊 Compare Plans</h3>
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Feature</th>
                <th>Free</th>
                <th>Monthly</th>
                <th>Yearly</th>
                <th>Lifetime</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Words Available</td>
                <td>100</td>
                <td>1000+</td>
                <td>1000+</td>
                <td>1000+</td>
              </tr>
              <tr>
                <td>Free Trial</td>
                <td>-</td>
                <td>❌</td>
                <td>✅ 7 days</td>
                <td>✅ 7 days</td>
              </tr>
              <tr>
                <td>Learning Modes</td>
                <td>Basic</td>
                <td>All</td>
                <td>All</td>
                <td>All</td>
              </tr>
              <tr>
                <td>Progress Analytics</td>
                <td>❌</td>
                <td>✅</td>
                <td>✅</td>
                <td>✅</td>
              </tr>
              <tr>
                <td>Offline Access</td>
                <td>❌</td>
                <td>✅</td>
                <td>✅</td>
                <td>✅</td>
              </tr>
              <tr>
                <td>Priority Support</td>
                <td>❌</td>
                <td>❌</td>
                <td>✅</td>
                <td>✅ VIP</td>
              </tr>
              <tr className="highlight-row">
                <td><strong>Price</strong></td>
                <td>Free</td>
                <td><strong>$9.99/mo</strong></td>
                <td>$79.99/yr</td>
                <td>$199.99</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* FAQ */}
        <div className="faq-section">
          <h3>❓ Frequently Asked Questions</h3>
          
          <div className="faq-item">
            <h4>Why doesn't the monthly plan have a free trial?</h4>
            <p>The monthly plan is already discounted to just $9.99 (from $29.99), so it's ready for immediate access at an amazing price!</p>
          </div>

          <div className="faq-item">
            <h4>How does the 7-day free trial work?</h4>
            <p>Start your trial instantly - no credit card needed! You get full access to all premium features for 7 days. After the trial, choose a plan or it expires automatically.</p>
          </div>

          <div className="faq-item">
            <h4>Can I switch plans later?</h4>
            <p>Yes! You can upgrade or downgrade anytime. Monthly subscribers can switch to yearly or lifetime whenever they want.</p>
          </div>

          <div className="faq-item">
            <h4>What's the best value?</h4>
            <p>The <strong>Yearly plan ($79.99)</strong> is best for most learners - you get the free trial AND save compared to monthly. <strong>Lifetime ($199.99)</strong> is best if you're committed long-term.</p>
          </div>

          <div className="faq-item">
            <h4>Is there a money-back guarantee?</h4>
            <p>Yes! All paid plans come with a 30-day money-back guarantee. Not satisfied? Full refund, no questions asked.</p>
          </div>
        </div>

        {/* Final CTA */}
        <div className="final-cta">
          <h3>🚀 Start Understanding the Quran Today</h3>
          <p>Join thousands of Muslims learning Quranic Arabic</p>
          {!user && (
            <p className="signin-prompt">
              <strong>Please sign in to continue</strong>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PricingPageConnected;