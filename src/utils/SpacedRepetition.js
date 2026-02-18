/**
 * 🧠 SPACED REPETITION SYSTEM (SRS)
 * SuperMemo-inspired algorithm for optimal vocabulary retention
 */

// ==========================================
// SRS INTERVALS (in days)
// ==========================================
const SRS_INTERVALS = {
  NEW: 0,           // Just learned
  LEARNING_1: 1,    // Review tomorrow
  LEARNING_2: 3,    // Review in 3 days
  YOUNG: 7,         // Review in 1 week
  MATURE_1: 14,     // Review in 2 weeks
  MATURE_2: 30,     // Review in 1 month
  MATURE_3: 60,     // Review in 2 months
  MATURE_4: 120,    // Review in 4 months
};

// ==========================================
// EASE FACTOR (how easy the word is for you)
// ==========================================
const DEFAULT_EASE = 2.5;
const MIN_EASE = 1.3;
const MAX_EASE = 3.0;

/**
 * Word Review Data Structure
 */
class WordReview {
  constructor(wordId) {
    this.wordId = wordId;
    this.interval = SRS_INTERVALS.NEW;
    this.easeFactor = DEFAULT_EASE;
    this.reviewCount = 0;
    this.correctStreak = 0;
    this.lastReviewed = null;
    this.nextReview = new Date();
    this.lapses = 0; // Times you got it wrong
  }
}

/**
 * SRS Manager
 */
export class SRSManager {
  constructor() {
    this.reviews = this.loadReviews();
  }

  /**
   * Load review data from localStorage
   */
  loadReviews() {
    try {
      const data = localStorage.getItem('srs_reviews');
      if (!data) return new Map();
      
      const parsed = JSON.parse(data);
      const map = new Map();
      
      Object.entries(parsed).forEach(([wordId, review]) => {
        review.nextReview = new Date(review.nextReview);
        review.lastReviewed = review.lastReviewed ? new Date(review.lastReviewed) : null;
        map.set(parseInt(wordId), review);
      });
      
      return map;
    } catch (error) {
      console.error('Error loading SRS reviews:', error);
      return new Map();
    }
  }

  /**
   * Save review data to localStorage
   */
  saveReviews() {
    try {
      const obj = {};
      this.reviews.forEach((review, wordId) => {
        obj[wordId] = review;
      });
      localStorage.setItem('srs_reviews', JSON.stringify(obj));
    } catch (error) {
      console.error('Error saving SRS reviews:', error);
    }
  }

  /**
   * Mark word as learned (first time)
   */
  learnWord(wordId) {
    const review = new WordReview(wordId);
    review.interval = SRS_INTERVALS.LEARNING_1;
    review.nextReview = this.calculateNextReview(1);
    review.lastReviewed = new Date();
    review.reviewCount = 1;
    
    this.reviews.set(wordId, review);
    this.saveReviews();
    
    return review;
  }

  /**
   * Review a word and update based on confidence
   * @param {number} wordId 
   * @param {number} confidence - 1 (Hard), 2 (Good), 3 (Easy)
   */
  reviewWord(wordId, confidence) {
    let review = this.reviews.get(wordId);
    
    if (!review) {
      // Word not in system yet, learn it
      return this.learnWord(wordId);
    }

    review.reviewCount++;
    review.lastReviewed = new Date();

    switch(confidence) {
      case 1: // Hard - Got it wrong or struggled
        review.lapses++;
        review.correctStreak = 0;
        review.easeFactor = Math.max(MIN_EASE, review.easeFactor - 0.2);
        review.interval = Math.max(1, review.interval * 0.5); // Set back
        break;
        
      case 2: // Good - Got it right
        review.correctStreak++;
        review.interval = Math.ceil(review.interval * review.easeFactor);
        break;
        
      case 3: // Easy - Got it easily
        review.correctStreak++;
        review.easeFactor = Math.min(MAX_EASE, review.easeFactor + 0.15);
        review.interval = Math.ceil(review.interval * review.easeFactor * 1.3);
        break;
    }

    // Calculate next review date
    review.nextReview = this.calculateNextReview(review.interval);
    
    this.reviews.set(wordId, review);
    this.saveReviews();
    
    return review;
  }

  /**
   * Calculate next review date
   */
  calculateNextReview(intervalDays) {
    const date = new Date();
    date.setDate(date.getDate() + intervalDays);
    date.setHours(9, 0, 0, 0); // Set to 9 AM
    return date;
  }

  /**
   * Get words due for review today
   */
  getWordsDueToday() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dueWords = [];
    
    this.reviews.forEach((review, wordId) => {
      if (review.nextReview <= today) {
        dueWords.push({
          wordId,
          ...review,
          daysSinceLearned: this.getDaysSince(review.lastReviewed),
          priority: this.calculatePriority(review)
        });
      }
    });
    
    // Sort by priority (higher = more urgent)
    return dueWords.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Calculate priority for review
   */
  calculatePriority(review) {
    const daysOverdue = this.getDaysSince(review.nextReview);
    const lapseWeight = review.lapses * 2;
    const streakBonus = Math.min(review.correctStreak, 5);
    
    return daysOverdue + lapseWeight - streakBonus;
  }

  /**
   * Get days since a date
   */
  getDaysSince(date) {
    if (!date) return 0;
    const diff = new Date() - new Date(date);
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  /**
   * Get review statistics
   */
  getStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let dueToday = 0;
    let dueSoon = 0; // Next 3 days
    let learning = 0; // Interval < 7 days
    let mature = 0; // Interval >= 30 days
    let totalReviews = 0;
    
    this.reviews.forEach(review => {
      totalReviews += review.reviewCount;
      
      if (review.nextReview <= today) {
        dueToday++;
      } else if (review.nextReview <= this.calculateNextReview(3)) {
        dueSoon++;
      }
      
      if (review.interval < 7) {
        learning++;
      } else if (review.interval >= 30) {
        mature++;
      }
    });
    
    return {
      totalWords: this.reviews.size,
      dueToday,
      dueSoon,
      learning,
      mature,
      totalReviews,
      averageEase: this.getAverageEase(),
    };
  }

  /**
   * Get average ease factor
   */
  getAverageEase() {
    if (this.reviews.size === 0) return DEFAULT_EASE;
    
    let sum = 0;
    this.reviews.forEach(review => {
      sum += review.easeFactor;
    });
    
    return (sum / this.reviews.size).toFixed(2);
  }

  /**
   * Get review data for a word
   */
  getWordReview(wordId) {
    return this.reviews.get(wordId);
  }

  /**
   * Check if word is due for review
   */
  isWordDue(wordId) {
    const review = this.reviews.get(wordId);
    if (!review) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return review.nextReview <= today;
  }

  /**
   * Get next review date for a word
   */
  getNextReviewDate(wordId) {
    const review = this.reviews.get(wordId);
    return review ? review.nextReview : null;
  }

  /**
   * Reset a word's review data
   */
  resetWord(wordId) {
    this.reviews.delete(wordId);
    this.saveReviews();
  }

  /**
   * Get words by interval stage
   */
  getWordsByStage() {
    const stages = {
      new: [],
      learning: [],
      young: [],
      mature: []
    };
    
    this.reviews.forEach((review, wordId) => {
      if (review.interval === 0) {
        stages.new.push(wordId);
      } else if (review.interval < 7) {
        stages.learning.push(wordId);
      } else if (review.interval < 30) {
        stages.young.push(wordId);
      } else {
        stages.mature.push(wordId);
      }
    });
    
    return stages;
  }

  /**
   * Export review data (for backup)
   */
  exportData() {
    const data = {};
    this.reviews.forEach((review, wordId) => {
      data[wordId] = review;
    });
    return JSON.stringify(data, null, 2);
  }

  /**
   * Import review data (from backup)
   */
  importData(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      const map = new Map();
      
      Object.entries(data).forEach(([wordId, review]) => {
        review.nextReview = new Date(review.nextReview);
        review.lastReviewed = review.lastReviewed ? new Date(review.lastReviewed) : null;
        map.set(parseInt(wordId), review);
      });
      
      this.reviews = map;
      this.saveReviews();
      
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }
}

// Create singleton instance
export const srsManager = new SRSManager();

export default SRSManager;