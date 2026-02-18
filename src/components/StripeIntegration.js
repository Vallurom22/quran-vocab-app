/**
 * 💳 Stripe Integration & Premium Management
 * Handles payments, subscriptions, and premium status
 */

// ==========================================
// STRIPE CONFIGURATION
// ==========================================

// Stripe Publishable Keys (get from Stripe Dashboard)
const STRIPE_PUBLISHABLE_KEY_TEST = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY_TEST;
const STRIPE_PUBLISHABLE_KEY_LIVE = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY_LIVE;

// Use test key in development, live key in production
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
export const STRIPE_KEY = IS_PRODUCTION ? STRIPE_PUBLISHABLE_KEY_LIVE : STRIPE_PUBLISHABLE_KEY_TEST;

// Stripe Price IDs (create these in Stripe Dashboard)
export const STRIPE_PRICES = {
  monthly: process.env.REACT_APP_STRIPE_PRICE_MONTHLY, // e.g., "price_1234..."
  yearly: process.env.REACT_APP_STRIPE_PRICE_YEARLY,   // e.g., "price_5678..."
};

// ==========================================
// PREMIUM STATUS MANAGEMENT
// ==========================================

/**
 * Check if user has active premium subscription
 */
export function isPremiumUser() {
  try {
    const premiumData = localStorage.getItem('premium_status');
    if (!premiumData) return false;

    const { active, expiresAt } = JSON.parse(premiumData);
    
    // Check if subscription is active and not expired
    if (!active) return false;
    if (expiresAt && new Date(expiresAt) < new Date()) {
      // Subscription expired
      setPremiumStatus(false);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error checking premium status:', error);
    return false;
  }
}

/**
 * Set premium status in localStorage
 */
export function setPremiumStatus(isActive, expiresAt = null) {
  const premiumData = {
    active: isActive,
    expiresAt: expiresAt,
    updatedAt: new Date().toISOString(),
  };
  
  localStorage.setItem('premium_status', JSON.stringify(premiumData));
  
  // Trigger event so other parts of app can react
  window.dispatchEvent(new Event('premium_status_changed'));
}

/**
 * Get premium subscription details
 */
export function getPremiumDetails() {
  try {
    const premiumData = localStorage.getItem('premium_status');
    if (!premiumData) return null;

    return JSON.parse(premiumData);
  } catch (error) {
    console.error('Error getting premium details:', error);
    return null;
  }
}

/**
 * Clear premium status (for logout or cancellation)
 */
export function clearPremiumStatus() {
  localStorage.removeItem('premium_status');
  window.dispatchEvent(new Event('premium_status_changed'));
}

// ==========================================
// STRIPE CHECKOUT
// ==========================================

/**
 * Redirect to Stripe Checkout
 * This creates a checkout session and redirects user to Stripe's hosted page
 */
export async function createCheckoutSession(priceId, billingCycle = 'monthly') {
  try {
    // Call your backend to create checkout session
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId: billingCycle === 'monthly' ? STRIPE_PRICES.monthly : STRIPE_PRICES.yearly,
        successUrl: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/pricing`,
      }),
    });

    const { sessionId } = await response.json();

    // Redirect to Stripe Checkout
    const stripe = window.Stripe(STRIPE_KEY);
    const { error } = await stripe.redirectToCheckout({ sessionId });

    if (error) {
      throw new Error(error.message);
    }
  } catch (error) {
    console.error('Checkout error:', error);
    throw error;
  }
}

/**
 * Handle successful payment (call this on success page)
 */
export async function handleSuccessfulPayment(sessionId) {
  try {
    // Verify session with backend
    const response = await fetch(`/api/verify-session/${sessionId}`);
    const data = await response.json();

    if (data.success) {
      // Set premium status
      const expiresAt = data.subscription.current_period_end 
        ? new Date(data.subscription.current_period_end * 1000).toISOString()
        : null;
      
      setPremiumStatus(true, expiresAt);
      
      return {
        success: true,
        subscription: data.subscription,
      };
    }

    return { success: false };
  } catch (error) {
    console.error('Error verifying payment:', error);
    return { success: false, error };
  }
}

// ==========================================
// CUSTOMER PORTAL
// ==========================================

/**
 * Redirect to Stripe Customer Portal
 * Users can manage their subscription, update payment methods, etc.
 */
export async function openCustomerPortal() {
  try {
    const response = await fetch('/api/create-portal-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        returnUrl: window.location.origin + '/dashboard',
      }),
    });

    const { url } = await response.json();
    window.location.href = url;
  } catch (error) {
    console.error('Portal error:', error);
    throw error;
  }
}

// ==========================================
// WEBHOOK HANDLING (for backend)
// ==========================================

/**
 * Example webhook handler
 * Put this in your backend (Node.js/Express example)
 */
export const WEBHOOK_HANDLER_EXAMPLE = `
// Backend: api/webhook.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.post('/api/webhook', express.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(\`Webhook Error: \${err.message}\`);
  }

  // Handle events
  switch (event.type) {
    case 'checkout.session.completed':
      // Payment successful
      const session = event.data.object;
      // Update user's premium status in database
      break;
      
    case 'customer.subscription.updated':
      // Subscription changed
      const subscription = event.data.object;
      // Update user's subscription in database
      break;
      
    case 'customer.subscription.deleted':
      // Subscription cancelled
      const cancelledSub = event.data.object;
      // Remove user's premium status
      break;
  }

  res.json({received: true});
});
`;

// ==========================================
// SIMPLE MODE (No Backend Required)
// ==========================================

/**
 * For quick testing without a backend
 * This simulates a successful payment
 * REMOVE THIS IN PRODUCTION!
 */
export function simulatePremiumPurchase(billingCycle = 'yearly') {
  console.warn('⚠️ SIMULATION MODE - Remove in production!');
  
  const expiresAt = new Date();
  if (billingCycle === 'monthly') {
    expiresAt.setMonth(expiresAt.getMonth() + 1);
  } else {
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);
  }
  
  setPremiumStatus(true, expiresAt.toISOString());
  
  return {
    success: true,
    message: 'Premium activated (simulation)',
    expiresAt: expiresAt.toISOString(),
  };
}

// ==========================================
// REACT HOOK FOR PREMIUM STATUS
// ==========================================

/**
 * Custom React hook to track premium status
 * Usage: const isPremium = usePremiumStatus();
 */
export function usePremiumStatus() {
  const [isPremium, setIsPremium] = React.useState(() => isPremiumUser());

  React.useEffect(() => {
    const handleStatusChange = () => {
      setIsPremium(isPremiumUser());
    };

    window.addEventListener('premium_status_changed', handleStatusChange);
    return () => window.removeEventListener('premium_status_changed', handleStatusChange);
  }, []);

  return isPremium;
}

// ==========================================
// EXPORTS
// ==========================================

export default {
  isPremiumUser,
  setPremiumStatus,
  getPremiumDetails,
  clearPremiumStatus,
  createCheckoutSession,
  handleSuccessfulPayment,
  openCustomerPortal,
  simulatePremiumPurchase, // Remove in production!
  usePremiumStatus,
  STRIPE_KEY,
  STRIPE_PRICES,
};
`;

// Add React import for the hook
import React from 'react';

// Re-export the hook so it can be used
export function usePremiumStatus() {
  const [isPremium, setIsPremium] = React.useState(() => isPremiumUser());

  React.useEffect(() => {
    const handleStatusChange = () => {
      setIsPremium(isPremiumUser());
    };

    window.addEventListener('premium_status_changed', handleStatusChange);
    return () => window.removeEventListener('premium_status_changed', handleStatusChange);
  }, []);

  return isPremium;
}

function isPremiumUser() {
  try {
    const premiumData = localStorage.getItem('premium_status');
    if (!premiumData) return false;

    const { active, expiresAt } = JSON.parse(premiumData);
    
    if (!active) return false;
    if (expiresAt && new Date(expiresAt) < new Date()) {
      setPremiumStatus(false);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error checking premium status:', error);
    return false;
  }
}

function setPremiumStatus(isActive, expiresAt = null) {
  const premiumData = {
    active: isActive,
    expiresAt: expiresAt,
    updatedAt: new Date().toISOString(),
  };
  
  localStorage.setItem('premium_status', JSON.stringify(premiumData));
  window.dispatchEvent(new Event('premium_status_changed'));
}

export function simulatePremiumPurchase(billingCycle = 'yearly') {
  console.warn('⚠️ SIMULATION MODE - Remove in production!');
  
  const expiresAt = new Date();
  if (billingCycle === 'monthly') {
    expiresAt.setMonth(expiresAt.getMonth() + 1);
  } else {
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);
  }
  
  setPremiumStatus(true, expiresAt.toISOString());
  
  return {
    success: true,
    message: 'Premium activated (simulation)',
    expiresAt: expiresAt.toISOString(),
  };
}

export function clearPremiumStatus() {
  localStorage.removeItem('premium_status');
  window.dispatchEvent(new Event('premium_status_changed'));
}