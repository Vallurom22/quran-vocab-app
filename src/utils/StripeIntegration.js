// Copy this ENTIRE code into src/utils/StripeIntegration.js

import { useState, useEffect } from 'react';

export function isPremiumUser() {
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
    console.error('Error checking premium:', error);
    return false;
  }
}

export function setPremiumStatus(isActive, expiresAt = null) {
  const premiumData = {
    active: isActive,
    expiresAt: expiresAt,
    updatedAt: new Date().toISOString(),
  };
  
  localStorage.setItem('premium_status', JSON.stringify(premiumData));
  window.dispatchEvent(new Event('premium_status_changed'));
}

export function usePremiumStatus() {
  const [isPremium, setIsPremium] = useState(() => isPremiumUser());

  useEffect(() => {
    const handleStatusChange = () => {
      setIsPremium(isPremiumUser());
    };

    window.addEventListener('premium_status_changed', handleStatusChange);
    return () => window.removeEventListener('premium_status_changed', handleStatusChange);
  }, []);

  return isPremium;
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