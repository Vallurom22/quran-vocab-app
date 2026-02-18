/**
 * 🔒 Security Utilities for Quran Vocabulary App
 * Production-ready security helpers
 */

// ============================================
// 1. INPUT SANITIZATION
// ============================================

/**
 * Sanitize text to prevent XSS attacks
 * Removes all HTML tags and dangerous characters
 */
export const sanitizeText = (text) => {
  if (typeof text !== 'string') return '';
  
  // Remove HTML tags
  let clean = text.replace(/<[^>]*>/g, '');
  
  // Escape special characters
  clean = clean
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
  
  return clean.trim();
};

/**
 * Sanitize Arabic text specifically
 * Allows only Arabic characters, numbers, and basic punctuation
 */
export const sanitizeArabicText = (text) => {
  if (typeof text !== 'string') return '';
  
  // Allow Arabic Unicode range, numbers, and basic punctuation
  const arabicPattern = /[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\s0-9.,!?'"()-]/g;
  
  return text.replace(arabicPattern, '').trim();
};

/**
 * Sanitize filename to prevent path traversal
 */
export const sanitizeFilename = (filename) => {
  if (typeof filename !== 'string') return null;
  
  // Remove path traversal attempts and dangerous characters
  const clean = filename
    .replace(/\.\./g, '')
    .replace(/[\/\\]/g, '')
    .replace(/[^a-zA-Z0-9_-]/g, '');
  
  // Must have some content
  if (clean.length === 0) return null;
  
  // Length limit
  if (clean.length > 100) return null;
  
  return clean;
};

// ============================================
// 2. INPUT VALIDATION
// ============================================

/**
 * Validate word ID
 */
export const isValidWordId = (id) => {
  return (
    typeof id === 'number' &&
    Number.isInteger(id) &&
    id > 0 &&
    id <= 500
  );
};

/**
 * Validate array of word IDs
 */
export const isValidWordIdArray = (arr) => {
  if (!Array.isArray(arr)) return false;
  if (arr.length > 500) return false; // Sanity check
  return arr.every(isValidWordId);
};

/**
 * Validate streak number
 */
export const isValidStreak = (streak) => {
  return (
    typeof streak === 'number' &&
    Number.isInteger(streak) &&
    streak >= 0 &&
    streak < 10000 // Reasonable maximum
  );
};

/**
 * Validate XP number
 */
export const isValidXP = (xp) => {
  return (
    typeof xp === 'number' &&
    Number.isInteger(xp) &&
    xp >= 0 &&
    xp < 1000000 // Reasonable maximum
  );
};

/**
 * Validate word object structure
 */
export const isValidWord = (word) => {
  if (!word || typeof word !== 'object') return false;
  
  return (
    isValidWordId(word.id) &&
    typeof word.arabic === 'string' &&
    word.arabic.length > 0 &&
    word.arabic.length < 100 &&
    typeof word.transliteration === 'string' &&
    word.transliteration.length < 100 &&
    typeof word.meaning === 'string' &&
    word.meaning.length < 200 &&
    typeof word.root === 'string' &&
    word.root.length > 0 &&
    word.root.length < 10 &&
    typeof word.category === 'string' &&
    word.category.length < 50
  );
};

// ============================================
// 3. SECURE LOCALSTORAGE
// ============================================

/**
 * Secure localStorage wrapper with validation
 */
export const secureStorage = {
  /**
   * Get item from localStorage with validation
   */
  get: (key, defaultValue = null, validator = null) => {
    try {
      // Validate key
      if (typeof key !== 'string' || key.length === 0) {
        console.error('Invalid localStorage key');
        return defaultValue;
      }
      
      const item = localStorage.getItem(key);
      
      // Key doesn't exist
      if (item === null) return defaultValue;
      
      // Parse JSON
      let parsed;
      try {
        parsed = JSON.parse(item);
      } catch (parseError) {
        console.error(`Failed to parse localStorage item: ${key}`, parseError);
        return defaultValue;
      }
      
      // Validate data if validator provided
      if (validator && !validator(parsed)) {
        console.warn(`Invalid data in localStorage for key: ${key}`);
        localStorage.removeItem(key); // Remove corrupt data
        return defaultValue;
      }
      
      return parsed;
      
    } catch (error) {
      console.error(`localStorage get error for ${key}:`, error);
      return defaultValue;
    }
  },
  
  /**
   * Set item in localStorage with validation
   */
  set: (key, value, validator = null) => {
    try {
      // Validate key
      if (typeof key !== 'string' || key.length === 0) {
        console.error('Invalid localStorage key');
        return false;
      }
      
      // Validate value if validator provided
      if (validator && !validator(value)) {
        console.error(`Validation failed for localStorage key: ${key}`);
        return false;
      }
      
      // Convert to JSON
      const jsonString = JSON.stringify(value);
      
      // Check size (localStorage limit is ~5MB)
      if (jsonString.length > 5000000) {
        console.error(`Data too large for localStorage: ${key}`);
        return false;
      }
      
      localStorage.setItem(key, jsonString);
      return true;
      
    } catch (error) {
      console.error(`localStorage set error for ${key}:`, error);
      return false;
    }
  },
  
  /**
   * Remove item from localStorage
   */
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`localStorage remove error for ${key}:`, error);
      return false;
    }
  },
  
  /**
   * Clear all localStorage (use with caution!)
   */
  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('localStorage clear error:', error);
      return false;
    }
  }
};

// ============================================
// 4. RATE LIMITING
// ============================================

/**
 * Create a rate limiter
 */
export const createRateLimiter = (minInterval = 1000) => {
  return {
    lastCall: 0,
    minInterval: minInterval,
    
    canCall: function() {
      const now = Date.now();
      if (now - this.lastCall < this.minInterval) {
        return false;
      }
      this.lastCall = now;
      return true;
    },
    
    reset: function() {
      this.lastCall = 0;
    }
  };
};

// ============================================
// 5. ERROR HANDLING
// ============================================

/**
 * Safe function execution with error handling
 */
export const safeExecute = (fn, fallback = null) => {
  try {
    return fn();
  } catch (error) {
    console.error('Safe execute error:', error);
    return fallback;
  }
};

/**
 * Async safe execution
 */
export const safeExecuteAsync = async (fn, fallback = null) => {
  try {
    return await fn();
  } catch (error) {
    console.error('Safe async execute error:', error);
    return fallback;
  }
};

// ============================================
// 6. DATA SANITIZATION HELPERS
// ============================================

/**
 * Sanitize word data object
 */
export const sanitizeWord = (word) => {
  if (!word || typeof word !== 'object') return null;
  
  return {
    id: isValidWordId(word.id) ? word.id : 0,
    arabic: sanitizeArabicText(word.arabic || ''),
    transliteration: sanitizeText(word.transliteration || ''),
    meaning: sanitizeText(word.meaning || ''),
    root: sanitizeArabicText(word.root || ''),
    category: sanitizeText(word.category || ''),
    occurrences: typeof word.occurrences === 'number' ? word.occurrences : 0,
    difficulty: typeof word.difficulty === 'number' ? word.difficulty : 1
  };
};

/**
 * Sanitize array of words
 */
export const sanitizeWords = (words) => {
  if (!Array.isArray(words)) return [];
  
  return words
    .map(sanitizeWord)
    .filter(word => word && word.id > 0);
};

// ============================================
// 7. URL/PATH VALIDATION
// ============================================

/**
 * Validate URL (for external resources)
 */
export const isValidUrl = (url, allowedDomains = []) => {
  try {
    const urlObj = new URL(url);
    
    // Only allow http and https
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return false;
    }
    
    // Check allowed domains if specified
    if (allowedDomains.length > 0) {
      const domain = urlObj.hostname;
      return allowedDomains.some(allowed => domain.endsWith(allowed));
    }
    
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate audio file path
 */
export const isValidAudioPath = (path) => {
  if (typeof path !== 'string') return false;
  
  // Must start with /audio/
  if (!path.startsWith('/audio/')) return false;
  
  // Must end with .mp3
  if (!path.endsWith('.mp3')) return false;
  
  // No path traversal
  if (path.includes('..')) return false;
  
  // No slashes in filename
  const filename = path.replace('/audio/', '');
  if (filename.includes('/')) return false;
  
  return true;
};

// ============================================
// 8. OBJECT MERGING (Prevent Prototype Pollution)
// ============================================

/**
 * Safe object merge (prevents prototype pollution)
 */
export const safeMerge = (target, source, allowedKeys = []) => {
  const result = { ...target };
  
  // If no allowed keys specified, use target's keys
  const keys = allowedKeys.length > 0 ? allowedKeys : Object.keys(target);
  
  for (const key of keys) {
    // Don't allow prototype pollution
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      continue;
    }
    
    // Only copy if source has the property
    if (source && source.hasOwnProperty(key)) {
      result[key] = source[key];
    }
  }
  
  return result;
};

// ============================================
// 9. CONSTANTS
// ============================================

export const SECURITY_CONSTANTS = {
  MAX_WORD_ID: 500,
  MAX_STREAK: 10000,
  MAX_XP: 1000000,
  MAX_STRING_LENGTH: 1000,
  MAX_ARRAY_LENGTH: 500,
  RATE_LIMIT_AUDIO: 500, // ms
  RATE_LIMIT_STORAGE: 1000, // ms
  ALLOWED_AUDIO_DOMAINS: ['everyayah.com'],
  STORAGE_SIZE_LIMIT: 5000000 // ~5MB
};

// ============================================
// 10. EXPORT ALL
// ============================================

export default {
  sanitizeText,
  sanitizeArabicText,
  sanitizeFilename,
  isValidWordId,
  isValidWordIdArray,
  isValidStreak,
  isValidXP,
  isValidWord,
  secureStorage,
  createRateLimiter,
  safeExecute,
  safeExecuteAsync,
  sanitizeWord,
  sanitizeWords,
  isValidUrl,
  isValidAudioPath,
  safeMerge,
  SECURITY_CONSTANTS
};
