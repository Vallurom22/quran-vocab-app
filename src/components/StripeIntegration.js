/**
 * 💳 UNIFIED STRIPE INTEGRATION - PRODUCTION READY
 * Handles all premium access: Monthly, Yearly, Lifetime, AND Free Trial
 * ✅ Works in development AND production (auto-detects domain)
 */

import { useState, useEffect } from 'react';

// ==========================================
// CONFIGURATION
// ==========================================

export const STRIPE_CONFIG = {
  publishableKey: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY,
  
  prices: {
    monthly: process.env.REACT_APP_STRIPE_MONTHLY_PRICE || 'price_monthly_xxx',
    yearly: process.env.REACT_APP_STRIPE_YEARLY_PRICE || 'price_yearly_xxx',
    lifetime: process.env.REACT_APP_STRIPE_LIFETIME_PRICE || 'price_lifetime_xxx'
  },
  
  trialDays: 7
};

// ✅ NEW: Get base URL dynamically (works in dev AND production)
const getBaseUrl = () => {
  // Always use current origin (works everywhere)
  return window.location.origin;
};

// ==========================================
// CORE FUNCTIONS
// ==========================================

export const initializeStripe = async () => {
  const { loadStripe } = await import('@stripe/stripe-js');
  return await loadStripe(STRIPE_CONFIG.publishableKey);
};

export const redirectToCheckout = async (planId, userId, userEmail) => {
  try {
    console.log('🚀 Redirecting to checkout:', { planId, userId, userEmail });
    
    const stripe = await initializeStripe();
    const priceId = STRIPE_CONFIG.prices[planId];

    // ✅ FIXED: Dynamic URLs based on current domain
    const baseUrl = getBaseUrl();
    const successUrl = `${baseUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${baseUrl}/payment-cancelled`;
    
    console.log('📍 Current domain:', baseUrl);
    console.log('✅ Redirect URLs:', { successUrl, cancelUrl });

    const { error } = await stripe.redirectToCheckout({
      lineItems: [{ price: priceId, quantity: 1 }],
      mode: planId === 'lifetime' ? 'payment' : 'subscription',
      successUrl,
      cancelUrl,
      customerEmail: userEmail,
      clientReferenceId: userId,
      ...(planId !== 'lifetime' && planId !== 'monthly' && {
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
    throw error;
  }
};

export const startFreeTrial = (userId) => {
  const trialEndDate = new Date();
  trialEndDate.setDate(trialEndDate.getDate() + STRIPE_CONFIG.trialDays);

  const trialInfo = {
    userId,
    startDate: new Date().toISOString(),
    endDate: trialEndDate.toISOString(),
    isActive: true,
    source: 'trial'
  };

  localStorage.setItem('trial_info', JSON.stringify(trialInfo));
  console.log('✅ Free trial started:', trialInfo);
  
  return trialInfo;
};

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
      endDate: trial.endDate,
      source: 'trial'
    };
  } catch (error) {
    return { isActive: false, daysRemaining: 0 };
  }
};

export const checkSubscriptionStatus = () => {
  try {
    const subscription = localStorage.getItem('subscription_status');
    
    if (!subscription) {
      return { isActive: false, plan: null };
    }

    const sub = JSON.parse(subscription);
    
    return {
      isActive: sub.isActive,
      plan: sub.plan,
      source: 'subscription',
      activatedAt: sub.activatedAt
    };
  } catch (error) {
    return { isActive: false, plan: null };
  }
};

export const checkPremiumStatus = () => {
  // Priority 1: Check active subscription
  const subscription = checkSubscriptionStatus();
  if (subscription.isActive) {
    return {
      isPremium: true,
      source: 'subscription',
      plan: subscription.plan,
      activatedAt: subscription.activatedAt
    };
  }

  // Priority 2: Check active trial
  const trial = checkTrialStatus();
  if (trial.isActive) {
    return {
      isPremium: true,
      source: 'trial',
      daysRemaining: trial.daysRemaining,
      endDate: trial.endDate
    };
  }

  // No premium access
  return {
    isPremium: false,
    source: 'free'
  };
};

export const activateSubscription = (planId, subscriptionId) => {
  const subscription = {
    plan: planId,
    subscriptionId,
    isActive: true,
    activatedAt: new Date().toISOString()
  };

  localStorage.setItem('subscription_status', JSON.stringify(subscription));
  localStorage.removeItem('trial_info');
  
  console.log('✅ Subscription activated:', subscription);
  return subscription;
};

export const clearPremiumStatus = () => {
  localStorage.removeItem('trial_info');
  localStorage.removeItem('subscription_status');
  console.log('🧹 All premium status cleared');
};

// ==========================================
// REACT HOOK - USE THIS IN COMPONENTS
// ==========================================

export const useSubscription = (userId) => {
  const [status, setStatus] = useState({
    isPremium: false,
    isLoading: true,
    source: 'free',
    plan: null,
    daysRemaining: 0
  });

  useEffect(() => {
    const loadStatus = () => {
      const premiumStatus = checkPremiumStatus();
      
      setStatus({
        ...premiumStatus,
        isLoading: false
      });

      console.log('🔍 Premium status checked:', premiumStatus);
    };

    loadStatus();
    
    const interval = setInterval(loadStatus, 60000);
    
    return () => clearInterval(interval);
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

// Legacy compatibility
export const usePremiumStatus = () => {
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const status = checkPremiumStatus();
    setIsPremium(status.isPremium);
    
    const interval = setInterval(() => {
      const newStatus = checkPremiumStatus();
      setIsPremium(newStatus.isPremium);
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return isPremium;
};

export const simulatePremiumPurchase = (billingCycle) => {
  console.warn('⚠️ simulatePremiumPurchase is deprecated');
  activateSubscription(billingCycle, 'simulated_' + Date.now());
};

export default {
  initializeStripe,
  redirectToCheckout,
  startFreeTrial,
  checkTrialStatus,
  checkSubscriptionStatus,
  checkPremiumStatus,
  activateSubscription,
  clearPremiumStatus,
  useSubscription,
  usePremiumStatus,
  STRIPE_CONFIG
};