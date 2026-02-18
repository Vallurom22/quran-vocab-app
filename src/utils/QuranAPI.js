/**
 * 📖 QURAN API INTEGRATION
 * Fetch real verses from Quran.com API
 */

const QURAN_API_BASE = 'https://api.quran.com/api/v4';

// Cache for API responses
const cache = new Map();

/**
 * Fetch verse by Surah:Ayah reference
 * Example: getVerse(1, 1) -> Al-Fatihah 1:1
 */
export async function getVerse(surahNumber, ayahNumber) {
  const cacheKey = `verse_${surahNumber}_${ayahNumber}`;
  
  // Check cache first
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  try {
    const response = await fetch(
      `${QURAN_API_BASE}/verses/by_key/${surahNumber}:${ayahNumber}?translations=131&fields=text_uthmani`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch verse');
    }

    const data = await response.json();
    const verse = data.verse;

    const verseData = {
      surah: surahNumber,
      ayah: ayahNumber,
      surahName: verse.chapter?.name_simple || '',
      surahNameArabic: verse.chapter?.name_arabic || '',
      arabic: verse.text_uthmani || '',
      translation: verse.translations?.[0]?.text || '',
      transliteration: verse.text_imlaei || '',
      juz: verse.juz_number || 0,
      page: verse.page_number || 0,
    };

    // Cache the result
    cache.set(cacheKey, verseData);
    
    return verseData;
  } catch (error) {
    console.error('Error fetching verse:', error);
    return null;
  }
}

/**
 * Get Surah information
 */
export async function getSurahInfo(surahNumber) {
  const cacheKey = `surah_${surahNumber}`;
  
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  try {
    const response = await fetch(`${QURAN_API_BASE}/chapters/${surahNumber}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch surah info');
    }

    const data = await response.json();
    const chapter = data.chapter;

    const surahData = {
      id: chapter.id,
      name: chapter.name_simple,
      arabicName: chapter.name_arabic,
      translatedName: chapter.translated_name?.name || '',
      revelationPlace: chapter.revelation_place,
      versesCount: chapter.verses_count,
    };

    cache.set(cacheKey, surahData);
    
    return surahData;
  } catch (error) {
    console.error('Error fetching surah info:', error);
    return null;
  }
}

/**
 * Search for verses containing a word (basic search)
 * Note: This is a simple implementation - full text search requires more advanced API
 */
export async function searchWord(arabicWord) {
  try {
    // For now, we'll return pre-defined common verses
    // You can enhance this with actual search API when available
    const commonVerses = getCommonVerses(arabicWord);
    return commonVerses;
  } catch (error) {
    console.error('Error searching word:', error);
    return [];
  }
}

/**
 * Get common verses for frequently used words
 * This is a fallback for words we know appear often
 */
function getCommonVerses(arabicWord) {
  const commonWords = {
    'الله': [
      { surah: 1, ayah: 1 },
      { surah: 112, ayah: 1 },
      { surah: 2, ayah: 255 }
    ],
    'الرحمن': [
      { surah: 1, ayah: 1 },
      { surah: 1, ayah: 3 },
      { surah: 55, ayah: 1 }
    ],
    'الرحيم': [
      { surah: 1, ayah: 1 },
      { surah: 1, ayah: 3 }
    ],
    'صلاة': [
      { surah: 2, ayah: 45 },
      { surah: 2, ayah: 153 },
      { surah: 20, ayah: 14 }
    ],
    'إيمان': [
      { surah: 2, ayah: 285 },
      { surah: 49, ayah: 14 }
    ],
  };

  return commonWords[arabicWord] || [];
}

/**
 * Fetch multiple verses at once
 */
export async function getVerses(verseRefs) {
  const promises = verseRefs.map(ref => getVerse(ref.surah, ref.ayah));
  const results = await Promise.all(promises);
  return results.filter(v => v !== null);
}

/**
 * Get verse with context (previous and next ayah for context)
 */
export async function getVerseWithContext(surahNumber, ayahNumber) {
  const [prevVerse, currentVerse, nextVerse] = await Promise.all([
    ayahNumber > 1 ? getVerse(surahNumber, ayahNumber - 1) : null,
    getVerse(surahNumber, ayahNumber),
    getVerse(surahNumber, ayahNumber + 1)
  ]);

  return {
    previous: prevVerse,
    current: currentVerse,
    next: nextVerse
  };
}

/**
 * Get audio URL for verse
 * Uses Quran.com CDN for audio files
 */
export function getVerseAudioUrl(surahNumber, ayahNumber, reciter = 'ar.alafasy') {
  // Pad numbers with zeros
  const surah = String(surahNumber).padStart(3, '0');
  const ayah = String(ayahNumber).padStart(3, '0');
  
  return `https://verses.quran.com/${reciter}/${surah}${ayah}.mp3`;
}

/**
 * Play verse audio
 */
export function playVerseAudio(surahNumber, ayahNumber, reciter = 'ar.alafasy') {
  const url = getVerseAudioUrl(surahNumber, ayahNumber, reciter);
  const audio = new Audio(url);
  
  audio.play().catch(error => {
    console.error('Error playing audio:', error);
  });
  
  return audio;
}

/**
 * Clear cache (useful for memory management)
 */
export function clearCache() {
  cache.clear();
}

/**
 * Available reciters
 */
export const RECITERS = {
  alafasy: { id: 'ar.alafasy', name: 'Mishary Rashid Alafasy' },
  minshawi: { id: 'ar.minshawi', name: 'Mohamed Siddiq Al-Minshawi' },
  husary: { id: 'ar.husary', name: 'Mahmoud Khalil Al-Husary' },
  abdulbasit: { id: 'ar.abdulbasit', name: 'Abdul Basit Abdul Samad' },
  sudais: { id: 'ar.abdurrahmaansudais', name: 'Abdur-Rahman As-Sudais' },
};

export default {
  getVerse,
  getSurahInfo,
  searchWord,
  getVerses,
  getVerseWithContext,
  getVerseAudioUrl,
  playVerseAudio,
  clearCache,
  RECITERS,
};