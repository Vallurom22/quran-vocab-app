/**
 * 💭 MNEMONIC MANAGER
 * Create, store, and share memory tricks for better word retention
 */

/**
 * Mnemonic data structure
 */
class Mnemonic {
  constructor(wordId, type, content, author = 'user', votes = 0) {
    this.id = Date.now() + Math.random();
    this.wordId = wordId;
    this.type = type; // 'visual', 'sound', 'story', 'association'
    this.content = content;
    this.author = author;
    this.votes = votes;
    this.createdAt = new Date();
  }
}

/**
 * Mnemonic Manager Class
 */
export class MnemonicManager {
  constructor() {
    this.mnemonics = this.loadMnemonics();
  }

  /**
   * Load mnemonics from localStorage
   */
  loadMnemonics() {
    try {
      const data = localStorage.getItem('word_mnemonics');
      if (!data) return new Map();
      
      const parsed = JSON.parse(data);
      const map = new Map();
      
      Object.entries(parsed).forEach(([wordId, mnemonics]) => {
        map.set(parseInt(wordId), mnemonics.map(m => ({
          ...m,
          createdAt: new Date(m.createdAt)
        })));
      });
      
      return map;
    } catch (error) {
      console.error('Error loading mnemonics:', error);
      return new Map();
    }
  }

  /**
   * Save mnemonics to localStorage
   */
  saveMnemonics() {
    try {
      const obj = {};
      this.mnemonics.forEach((mnemonics, wordId) => {
        obj[wordId] = mnemonics;
      });
      localStorage.setItem('word_mnemonics', JSON.stringify(obj));
    } catch (error) {
      console.error('Error saving mnemonics:', error);
    }
  }

  /**
   * Create a new mnemonic
   */
  createMnemonic(wordId, type, content) {
    const mnemonic = new Mnemonic(wordId, type, content);
    
    if (!this.mnemonics.has(wordId)) {
      this.mnemonics.set(wordId, []);
    }
    
    this.mnemonics.get(wordId).push(mnemonic);
    this.saveMnemonics();
    
    return mnemonic;
  }

  /**
   * Get mnemonics for a word
   */
  getMnemonics(wordId) {
    return this.mnemonics.get(wordId) || [];
  }

  /**
   * Vote on a mnemonic
   */
  voteMnemonic(wordId, mnemonicId, delta) {
    const mnemonics = this.mnemonics.get(wordId);
    if (!mnemonics) return;
    
    const mnemonic = mnemonics.find(m => m.id === mnemonicId);
    if (mnemonic) {
      mnemonic.votes += delta;
      this.saveMnemonics();
    }
  }

  /**
   * Delete a mnemonic
   */
  deleteMnemonic(wordId, mnemonicId) {
    const mnemonics = this.mnemonics.get(wordId);
    if (!mnemonics) return;
    
    const filtered = mnemonics.filter(m => m.id !== mnemonicId);
    this.mnemonics.set(wordId, filtered);
    this.saveMnemonics();
  }
}

/**
 * AI-Powered Mnemonic Generator
 */
export class MnemonicGenerator {
  /**
   * Generate visual mnemonic (image association)
   */
  static generateVisualMnemonic(word) {
    const templates = [
      `Picture ${word.meaning.toLowerCase()} as a bright, glowing ${word.arabic} written in the sky`,
      `Imagine a giant ${word.meaning.toLowerCase()} with the letters ${word.arabic} carved on it`,
      `Visualize ${word.arabic} transforming into ${word.meaning.toLowerCase()}`,
      `See ${word.meaning.toLowerCase()} surrounded by Arabic calligraphy: ${word.arabic}`,
    ];
    
    return templates[Math.floor(Math.random() * templates.length)];
  }

  /**
   * Generate sound association mnemonic
   */
  static generateSoundMnemonic(word) {
    // Try to find English words that sound similar
    const transliteration = word.transliteration.toLowerCase();
    
    const soundAssociations = {
      'salah': 'sounds like "salad" - imagine praying over a giant salad',
      'sawm': 'sounds like "solemn" - fasting is a solemn act',
      'hajj': 'sounds like "hatch" - pilgrims hatch from their old lives',
      'iman': 'sounds like "I man" - I am a man of faith',
      'sabr': 'sounds like "saber" - patience is your saber/sword',
    };
    
    if (soundAssociations[transliteration]) {
      return soundAssociations[transliteration];
    }
    
    return `${word.transliteration} - Break it down: ${this.breakIntoSyllables(word.transliteration)}`;
  }

  /**
   * Generate story mnemonic
   */
  static generateStoryMnemonic(word) {
    const stories = {
      'prayer': `Once, a traveler lost in the desert found ${word.arabic}. As they recited it, they felt guided toward water.`,
      'fasting': `A wise teacher said: "${word.arabic} is like holding treasure - you don't consume it all at once, you preserve it."`,
      'patience': `Imagine a mighty tree with roots spelling ${word.arabic} - it grows slowly but strong through ${word.meaning}.`,
    };
    
    const category = word.category.toLowerCase();
    if (stories[category]) {
      return stories[category];
    }
    
    return `In a village, when people needed ${word.meaning.toLowerCase()}, they would call out "${word.arabic}!" and help would come.`;
  }

  /**
   * Generate association mnemonic (link to personal experience)
   */
  static generateAssociationMnemonic(word) {
    const associations = [
      `Think of a time when you experienced ${word.meaning.toLowerCase()}. Link that feeling to ${word.arabic}.`,
      `${word.arabic} appears ${word.occurrences} times in the Quran - imagine counting that high!`,
      `From root ${word.root} - like branches of ${word.meaning} growing from this root`,
      `When you see ${word.arabic}, remember it's in the ${word.category} category`,
    ];
    
    return associations[Math.floor(Math.random() * associations.length)];
  }

  /**
   * Break word into syllables for easier learning
   */
  static breakIntoSyllables(transliteration) {
    // Simple syllable breaking
    const syllables = transliteration.match(/[^aeiou]*[aeiou]+(?:[^aeiou]*$|[^aeiou](?=[^aeiou]))?/gi);
    return syllables ? syllables.join(' · ') : transliteration;
  }

  /**
   * Generate all types of mnemonics for a word
   */
  static generateAllMnemonics(word) {
    return {
      visual: this.generateVisualMnemonic(word),
      sound: this.generateSoundMnemonic(word),
      story: this.generateStoryMnemonic(word),
      association: this.generateAssociationMnemonic(word),
    };
  }
}

/**
 * Community Mnemonics (simulated - would come from database in production)
 */
export const COMMUNITY_MNEMONICS = {
  1: [ // Allah
    {
      id: 1,
      type: 'visual',
      content: 'Picture the entire universe spelling out الله in stars',
      author: 'Ahmed',
      votes: 42
    },
    {
      id: 2,
      type: 'sound',
      content: 'Allah - emphasize the "Ah" sound, like saying "Ahhh" in wonder',
      author: 'Fatima',
      votes: 38
    }
  ],
  // Add more community mnemonics...
};

/**
 * Get community mnemonics for a word
 */
export function getCommunityMnemonics(wordId, isPremium = false) {
  if (!isPremium) {
    return {
      locked: true,
      message: "Community mnemonics are a premium feature"
    };
  }
  
  return COMMUNITY_MNEMONICS[wordId] || [];
}

// Create singleton instance
export const mnemonicManager = new MnemonicManager();

export default {
  MnemonicManager,
  MnemonicGenerator,
  mnemonicManager,
  getCommunityMnemonics,
};