/**
 * 🤖 AUTOMATIC VERSE FETCHER
 * Fetches real Quran verses for all words using Quran.com API
 */

import { getVerses } from './QuranAPI';

/**
 * Search for verses containing a specific Arabic word
 * Uses Quran.com search API
 */
export async function searchWordInQuran(arabicWord, limit = 3) {
  try {
    // Clean the word (remove diacritics for better matching)
    const cleanWord = arabicWord.replace(/[\u064B-\u0652]/g, '');
    
    // Search API endpoint
    const response = await fetch(
      `https://api.quran.com/api/v4/search?q=${encodeURIComponent(cleanWord)}&size=${limit}&language=ar`
    );
    
    if (!response.ok) {
      throw new Error('Search failed');
    }
    
    const data = await response.json();
    
    if (!data.search?.results || data.search.results.length === 0) {
      return [];
    }
    
    // Extract verse references
    const verses = data.search.results.map(result => ({
      surah: result.verse_key.split(':')[0],
      ayah: result.verse_key.split(':')[1],
      text: result.text,
      translation: result.translations?.[0]?.text || '',
    }));
    
    return verses;
  } catch (error) {
    console.error(`Error searching for word ${arabicWord}:`, error);
    return [];
  }
}

/**
 * Generate context description for a word based on category
 */
function generateContext(word, verseKey) {
  const [surah, ayah] = verseKey.split(':');
  
  const contexts = {
    'Divine Names': `One of Allah's beautiful names, mentioned in Surah ${surah}`,
    'Worship': `A pillar of Islamic practice, referenced in Surah ${surah}`,
    'Faith': `A fundamental concept of belief in Surah ${surah}`,
    'Moral Qualities': `An essential character trait mentioned in Surah ${surah}`,
    'Prophets': `Referenced in the story of the prophets in Surah ${surah}`,
    'Creation': `Part of Allah's creation described in Surah ${surah}`,
    'Afterlife': `Relating to the Day of Judgment in Surah ${surah}`,
    'Commands': `A divine command in Surah ${surah}`,
  };
  
  return contexts[word.category] || `Found in Surah ${surah}, ayah ${ayah}`;
}

/**
 * Fetch verses for a single word
 */
export async function fetchVersesForWord(word) {
  try {
    // Search for the word
    const searchResults = await searchWordInQuran(word.arabic, 3);
    
    if (searchResults.length === 0) {
      return null;
    }
    
    // Format verses with context
    const verses = searchResults.map(result => ({
      surah: parseInt(result.surah),
      ayah: parseInt(result.ayah),
      context: generateContext(word, `${result.surah}:${result.ayah}`)
    }));
    
    return {
      verses,
      grammar: generateGrammar(word),
      etymology: generateEtymology(word)
    };
  } catch (error) {
    console.error(`Error fetching verses for ${word.arabic}:`, error);
    return null;
  }
}

/**
 * Generate basic grammar info based on category
 */
function generateGrammar(word) {
  const grammarPatterns = {
    'Divine Names': { type: 'Divine Attribute', notes: `One of Allah's 99 names` },
    'Common Nouns': { type: 'Noun', notes: 'Common Quranic term' },
    'Common Verbs': { type: 'Verb', notes: 'Action word' },
    'Worship': { type: 'Noun (religious)', notes: 'Act of worship' },
    'Prophets': { type: 'Proper Noun', notes: 'Name of a prophet' },
  };
  
  return grammarPatterns[word.category] || { 
    type: 'Noun', 
    notes: `Appears ${word.occurrences} times in the Quran` 
  };
}

/**
 * Generate etymology based on root
 */
function generateEtymology(word) {
  return {
    root: word.root,
    meaning: `From the root ${word.root}`,
    relatedWords: []
  };
}

/**
 * Batch process words with rate limiting
 */
export async function batchFetchVerses(words, onProgress) {
  const results = {};
  const BATCH_SIZE = 10;
  const DELAY_MS = 1000; // 1 second between batches
  
  for (let i = 0; i < words.length; i += BATCH_SIZE) {
    const batch = words.slice(i, i + BATCH_SIZE);
    
    // Process batch in parallel
    const batchResults = await Promise.allSettled(
      batch.map(word => fetchVersesForWord(word))
    );
    
    // Store results
    batchResults.forEach((result, idx) => {
      const word = batch[idx];
      if (result.status === 'fulfilled' && result.value) {
        results[word.arabic] = result.value;
      }
    });
    
    // Update progress
    if (onProgress) {
      const progress = Math.min(100, ((i + BATCH_SIZE) / words.length) * 100);
      onProgress(progress, Object.keys(results).length);
    }
    
    // Rate limiting delay
    if (i + BATCH_SIZE < words.length) {
      await new Promise(resolve => setTimeout(resolve, DELAY_MS));
    }
  }
  
  return results;
}

/**
 * Save fetched verses to localStorage
 */
export function saveVersesToCache(verses) {
  try {
    localStorage.setItem('cached_verses', JSON.stringify(verses));
    localStorage.setItem('verses_cache_date', new Date().toISOString());
    return true;
  } catch (error) {
    console.error('Error saving verses to cache:', error);
    return false;
  }
}

/**
 * Load verses from localStorage cache
 */
export function loadVersesFromCache() {
  try {
    const cached = localStorage.getItem('cached_verses');
    const cacheDate = localStorage.getItem('verses_cache_date');
    
    if (!cached) return null;
    
    // Check if cache is older than 7 days
    if (cacheDate) {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      if (new Date(cacheDate) < weekAgo) {
        console.log('Verse cache expired');
        return null;
      }
    }
    
    return JSON.parse(cached);
  } catch (error) {
    console.error('Error loading verses from cache:', error);
    return null;
  }
}

/**
 * Download verses as JSON file
 */
export function downloadVersesAsJSON(verses) {
  const dataStr = JSON.stringify(verses, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `quran-verses-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  
  URL.revokeObjectURL(url);
}

/**
 * MANUAL VERSE DATABASE
 * For words we've manually verified
 */
export const MANUAL_VERSES = {
  'الله': {
    verses: [
      { surah: 112, ayah: 1, context: 'Surah Al-Ikhlas - Defines the oneness of Allah' },
      { surah: 1, ayah: 1, context: 'Opening of Al-Fatihah' },
      { surah: 2, ayah: 255, context: 'Ayat al-Kursi - The Throne Verse' },
    ],
    grammar: { type: 'Proper Noun', notes: 'The Supreme Name of God in Islam' },
    etymology: { root: 'اله', meaning: 'Divinity, God', relatedWords: [] }
  },
  
  'الرَّحْمَٰن': {
    verses: [
      { surah: 1, ayah: 1, context: 'Bismillah - In the name of Allah' },
      { surah: 1, ayah: 3, context: 'Recited in every prayer' },
      { surah: 55, ayah: 1, context: 'Opening of Surah Ar-Rahman' },
    ],
    grammar: { type: 'Intensive Noun', pattern: 'فَعْلان', notes: 'Exclusive to Allah' },
    etymology: { root: 'رحم', meaning: 'Mercy, compassion', relatedWords: [] }
  },
  
  'صَلَاة': {
    verses: [
      { surah: 2, ayah: 45, context: 'Seek help through patience and prayer' },
      { surah: 2, ayah: 153, context: 'Allah is with the patient' },
      { surah: 20, ayah: 14, context: 'Establish prayer for My remembrance' },
    ],
    grammar: { type: 'Noun (feminine)', plural: 'صَلَوَات' },
    etymology: { root: 'صلو', meaning: 'Connection, prayer', relatedWords: [] }
  },
  
  // Add more manually verified words here...
};

/**
 * Get verses for a word (manual first, then auto-fetched, then cache)
 */
export function getWordVerses(word) {
  // 1. Check manual database first
  if (MANUAL_VERSES[word.arabic]) {
    return MANUAL_VERSES[word.arabic];
  }
  
  // 2. Check cache
  const cached = loadVersesFromCache();
  if (cached && cached[word.arabic]) {
    return cached[word.arabic];
  }
  
  // 3. Return null (will trigger auto-fetch)
  return null;
}

export default {
  searchWordInQuran,
  fetchVersesForWord,
  batchFetchVerses,
  saveVersesToCache,
  loadVersesFromCache,
  downloadVersesAsJSON,
  getWordVerses,
  MANUAL_VERSES,
};