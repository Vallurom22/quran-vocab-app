/**
 * 💳 STRIPE INTEGRATION WITH 7-DAY FREE TRIAL
 * Complete payment system for Quran Vocabulary App
 */

import { useState, useEffect } from 'react';

// ==========================================
// CONFIGURATION
// ==========================================

export const STRIPE_CONFIG = {
  publishableKey: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY,
  
  // Replace these with your actual Stripe Price IDs
  prices: {
    monthly: process.env.REACT_APP_STRIPE_MONTHLY_PRICE || 'price_monthly_xxx',
    yearly: process.env.REACT_APP_STRIPE_YEARLY_PRICE || 'price_yearly_xxx',
    lifetime: process.env.REACT_APP_STRIPE_LIFETIME_PRICE || 'price_lifetime_xxx'
  },
  
  trialDays: 7
};

// ==========================================
// STRIPE FUNCTIONS
// ==========================================

/**
 * Initialize Stripe
 */
export const initializeStripe = async () => {
  const { loadStripe } = await import('@stripe/stripe-js');
  return await loadStripe(STRIPE_CONFIG.publishableKey);
};

/**
 * Redirect to Stripe Checkout
 */
export const redirectToCheckout = async (planId, userId, userEmail) => {
  try {
    console.log('🚀 Redirecting to checkout:', { planId, userId, userEmail });
    
    const stripe = await initializeStripe();
    const priceId = STRIPE_CONFIG.prices[planId];

    // In production, this calls your backend API
    // For now, we'll simulate with Stripe Checkout
    const { error } = await stripe.redirectToCheckout({
      lineItems: [{ price: priceId, quantity: 1 }],
      mode: planId === 'lifetime' ? 'payment' : 'subscription',
      successUrl: `${window.location.origin}/payment-success`,
      cancelUrl: `${window.location.origin}/payment-cancelled`,
      customerEmail: userEmail,
      clientReferenceId: userId,
      ...(planId !== 'lifetime' && {
        subscriptionData: {
          trialPeriodDays: STRIPE_CONFIG.trialDays
        }
      })
    });

    if (error) {
      console.error('❌ Stripe error:', error);
      throw error;
    }
  } catch (error) {
    console.error('❌ Checkout error:', error);
    alert('Payment setup failed. Please try again.');
    throw error;
  }
};

/**
 * Start Free Trial (No Payment Required)
 */
export const startFreeTrial = (userId) => {
  const trialEndDate = new Date();
  trialEndDate.setDate(trialEndDate.getDate() + STRIPE_CONFIG.trialDays);

  const trialInfo = {
    userId,
    startDate: new Date().toISOString(),
    endDate: trialEndDate.toISOString(),
    isActive: true
  };

  localStorage.setItem('trial_info', JSON.stringify(trialInfo));
  console.log('✅ Free trial started:', trialInfo);
  
  return trialInfo;
};

/**
 * Check Trial Status
 */
export const checkTrialStatus = () => {
  try {
    const trialInfo = localStorage.getItem('trial_info');
    
    if (!trialInfo) {
      return { isActive: false, daysRemaining: 0 };
    }

    const trial = JSON.parse(trialInfo);
    const now = new Date();
    const endDate = new Date(trial.endDate);
    
    const isActive = now < endDate;
    const daysRemaining = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));

    return {
      isActive,
      daysRemaining: Math.max(0, daysRemaining),
      endDate: trial.endDate
    };
  } catch (error) {
    return { isActive: false, daysRemaining: 0 };
  }
};

/**
 * Check Premium Status (Trial + Subscription)
 */
export const checkPremiumStatus = () => {
  // Check trial first
  const trial = checkTrialStatus();
  if (trial.isActive) {
    return {
      isPremium: true,
      source: 'trial',
      daysRemaining: trial.daysRemaining
    };
  }

  // Check subscription
  const subscription = localStorage.getItem('subscription_status');
  if (subscription) {
    const sub = JSON.parse(subscription);
    if (sub.isActive) {
      return {
        isPremium: true,
        source: 'subscription',
        plan: sub.plan
      };
    }
  }

  return { isPremium: false, source: 'free' };
};

/**
 * Activate Subscription (Called after successful payment)
 */
export const activateSubscription = (planId, subscriptionId) => {
  const subscription = {
    plan: planId,
    subscriptionId,
    isActive: true,
    activatedAt: new Date().toISOString()
  };

  localStorage.setItem('subscription_status', JSON.stringify(subscription));
  
  // Clear trial if exists
  localStorage.removeItem('trial_info');
  
  console.log('✅ Subscription activated:', subscription);
  return subscription;
};

// ==========================================
// REACT HOOK
// ==========================================

/**
 * useSubscription Hook - Use this in your components
 */
export const useSubscription = (userId) => {
  const [status, setStatus] = useState({
    isPremium: false,
    isLoading: true,
    source: 'free',
    daysRemaining: 0
  });

  useEffect(() => {
    const premiumStatus = checkPremiumStatus();
    setStatus({
      ...premiumStatus,
      isLoading: false
    });
  }, [userId]);

  const startTrial = () => {
    startFreeTrial(userId);
    const newStatus = checkPremiumStatus();
    setStatus({
      ...newStatus,
      isLoading: false
    });
  };

  const upgradeToPremium = async (planId, userEmail) => {
    await redirectToCheckout(planId, userId, userEmail);
  };

  return {
    ...status,
    startTrial,
    upgradeToPremium
  };
};

// ==========================================
// LEGACY COMPATIBILITY
// (Remove these once you update all old code)
// ==========================================

/**
 * @deprecated Use useSubscription hook instead
 */
export const usePremiumStatus = () => {
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const status = checkPremiumStatus();
    setIsPremium(status.isPremium);
  }, []);

  return isPremium;
};

/**
 * @deprecated Use startFreeTrial instead
 */
export const simulatePremiumPurchase = (billingCycle) => {
  console.warn('⚠️ simulatePremiumPurchase is deprecated. Use startFreeTrial instead.');
  activateSubscription(billingCycle, 'simulated_' + Date.now());
};

export default {
  redirectToCheckout,
  startFreeTrial,
  checkTrialStatus,
  checkPremiumStatus,
  activateSubscription,
  useSubscription,
  usePremiumStatus, // deprecated
  simulatePremiumPurchase // deprecated
};
