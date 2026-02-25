/**
 * 🎯 USE UPGRADE PROMPT HOOK
 * Smart timing logic for showing upgrade prompts
 */

import { useState, useEffect, useCallback } from 'react';

export const useUpgradePrompt = (isPremium, knownWordsCount) => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [promptTrigger, setPromptTrigger] = useState(null);

  // Check if we can show prompt (max once per day)
  const canShowPrompt = useCallback(() => {
    if (isPremium) return false;

    const lastShown = localStorage.getItem('last_upgrade_prompt');
    const today = new Date().toDateString();
    
    return lastShown !== today;
  }, [isPremium]);

  // Mark prompt as shown
  const markPromptShown = useCallback(() => {
    const today = new Date().toDateString();
    localStorage.setItem('last_upgrade_prompt', today);
  }, []);

  // Check milestone (100 words)
  useEffect(() => {
    if (isPremium) return;
    
    if (knownWordsCount === 100 && canShowPrompt()) {
      setPromptTrigger('milestone');
      setShowPrompt(true);
      markPromptShown();
    }
  }, [knownWordsCount, isPremium, canShowPrompt, markPromptShown]);

  // Handle locked feature click
  const onLockedFeatureClick = useCallback(() => {
    if (isPremium) return;
    
    if (canShowPrompt()) {
      setPromptTrigger('locked_feature');
      setShowPrompt(true);
      markPromptShown();
    }
  }, [isPremium, canShowPrompt, markPromptShown]);

  // Handle locked word click
  const onLockedWordClick = useCallback(() => {
    if (isPremium) return;
    
    if (canShowPrompt()) {
      setPromptTrigger('word_limit');
      setShowPrompt(true);
      markPromptShown();
    }
  }, [isPremium, canShowPrompt, markPromptShown]);

  // Check if word is accessible
  const checkWordAccess = useCallback((wordId) => {
    if (isPremium) return true;
    return wordId <= 100;
  }, [isPremium]);

  // Check if feature is accessible
  const checkFeatureAccess = useCallback((featureName) => {
    if (isPremium) return true;
    
    // Free features
    const freeFeatures = ['browse', 'flashcard', 'basic_quiz', 'daily_word'];
    return freeFeatures.includes(featureName);
  }, [isPremium]);

  return {
    showPrompt,
    promptTrigger,
    setShowPrompt,
    onLockedFeatureClick,
    onLockedWordClick,
    checkWordAccess,
    checkFeatureAccess
  };
};

export default useUpgradePrompt;
