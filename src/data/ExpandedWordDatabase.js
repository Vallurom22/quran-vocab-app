/**
 * Expanded Word Database - With 1000 Words
 * FREE: 500 words with full features
 * PREMIUM: 1000 words total
 */

import { quranWords } from './words';
import premiumWords from './PremiumWords_500';
import words501to1000 from './Words501to1000';
import { ADDITIONAL_QURANIC_WORDS } from './AdditionalWords';

// ==========================================
// COMBINE ALL WORDS FIRST (BEFORE USING IT)
// ==========================================
const allWords = [
  ...quranWords, 
  ...premiumWords, 
  ...words501to1000, 
  ...ADDITIONAL_QURANIC_WORDS
];

console.log('✅ Total words loaded:', allWords.length);

// ==========================================
// WORD ENHANCEMENT DATA
// ==========================================
const wordEnhancementData = {
  'الله': {
    verses: [
      { surah: 112, ayah: 1, context: 'Surah Al-Ikhlas - Defines the oneness of Allah' },
      { surah: 1, ayah: 1, context: 'Opening of Al-Fatihah, said before every Surah' },
      { surah: 2, ayah: 255, context: 'Ayat al-Kursi - The Throne Verse' },
    ],
    grammar: {
      type: 'Proper Noun',
      notes: 'The Supreme Name of God in Islam'
    },
    etymology: {
      root: 'اله',
      meaning: 'Divinity, God',
      relatedWords: [
        { arabic: 'إِلَٰه', meaning: 'Deity, God' },
        { arabic: 'أَلَّهَ', meaning: 'To worship, deify' },
      ]
    }
  },
  
  'الرَّحْمَٰن': {
    verses: [
      { surah: 1, ayah: 1, context: 'Bismillah - In the name of Allah' },
      { surah: 1, ayah: 3, context: 'Recited in every prayer' },
      { surah: 55, ayah: 1, context: 'Opening of Surah Ar-Rahman' },
    ],
    grammar: {
      type: 'Intensive Noun (صيغة المبالغة)',
      pattern: 'فَعْلان',
      notes: 'Ar-Rahman is exclusive to Allah'
    },
    etymology: {
      root: 'رحم',
      meaning: 'Mercy, compassion, tenderness',
      relatedWords: [
        { arabic: 'رَحْمَة', meaning: 'Mercy' },
        { arabic: 'رَحِيم', meaning: 'Merciful' },
        { arabic: 'رَاحِم', meaning: 'One who shows mercy' },
        { arabic: 'تَرَحُّم', meaning: 'Seeking mercy' },
      ]
    }
  },
  
  'الرَّحِيم': {
    verses: [
      { surah: 1, ayah: 1, context: 'Bismillah - paired with Ar-Rahman' },
      { surah: 1, ayah: 3, context: 'Describing Allah\'s attributes' },
    ],
    grammar: {
      type: 'Intensive Noun (صيغة المبالغة)',
      pattern: 'فَعِيل',
    },
    etymology: {
      root: 'رحم',
      meaning: 'Mercy, compassion',
      relatedWords: [
        { arabic: 'رَحْمَة', meaning: 'Mercy' },
        { arabic: 'رَحْمَٰن', meaning: 'The Most Gracious' },
      ]
    }
  },

  'صَلَاة': {
    verses: [
      { surah: 2, ayah: 45, context: 'Seek help through patience and prayer' },
      { surah: 2, ayah: 153, context: 'Allah is with the patient' },
      { surah: 20, ayah: 14, context: 'Establish prayer for My remembrance' },
      { surah: 2, ayah: 3, context: 'Who believe in the unseen and establish prayer' },
    ],
    grammar: {
      type: 'Noun (feminine)',
      plural: 'صَلَوَات',
    },
    etymology: {
      root: 'صلو',
      meaning: 'Connection, prayer',
      relatedWords: [
        { arabic: 'مُصَلٍّ', meaning: 'One who prays' },
        { arabic: 'مُصَلَّى', meaning: 'Place of prayer' },
      ]
    }
  },

  'زَكَاة': {
    verses: [
      { surah: 2, ayah: 43, context: 'Establish prayer and give zakah' },
      { surah: 2, ayah: 110, context: 'Prayer and zakah mentioned together' },
      { surah: 2, ayah: 277, context: 'Those who believe and do righteous deeds' },
    ],
    grammar: {
      type: 'Noun (feminine)',
      rootMeaning: 'Purification and growth',
    },
    etymology: {
      root: 'زكو',
      meaning: 'Purification, growth, blessing',
      relatedWords: [
        { arabic: 'زَكِيّ', meaning: 'Pure, righteous' },
        { arabic: 'تَزْكِيَة', meaning: 'Purification' },
      ]
    }
  },

  'صَوْم': {
    verses: [
      { surah: 2, ayah: 183, context: 'O you who believe, fasting is prescribed' },
      { surah: 2, ayah: 184, context: 'Fasting for a limited number of days' },
      { surah: 2, ayah: 187, context: 'Rules and blessings of fasting' },
    ],
    grammar: {
      type: 'Noun (masculine)',
      verbal: 'صَامَ - يَصُومُ'
    },
    etymology: {
      root: 'صوم',
      meaning: 'To abstain, fast',
      relatedWords: [
        { arabic: 'صَائِم', meaning: 'One who fasts' },
        { arabic: 'صِيَام', meaning: 'Fasting' },
      ]
    }
  },

  'حَجّ': {
    verses: [
      { surah: 3, ayah: 97, context: 'Pilgrimage to the House is a duty' },
      { surah: 2, ayah: 196, context: 'Complete Hajj and Umrah for Allah' },
      { surah: 22, ayah: 27, context: 'Proclaim the pilgrimage among people' },
    ],
    grammar: {
      type: 'Noun (masculine)',
    },
    etymology: {
      root: 'حجج',
      meaning: 'To proceed, pilgrimage',
      relatedWords: [
        { arabic: 'حَاجّ', meaning: 'Pilgrim' },
        { arabic: 'مَحَجَّة', meaning: 'Main road, path' },
      ]
    }
  },

  'إِيمَان': {
    verses: [
      { surah: 2, ayah: 285, context: 'The Messenger has believed' },
      { surah: 49, ayah: 14, context: 'The Bedouins say they have believed' },
      { surah: 3, ayah: 173, context: 'Those to whom people said gather against you' },
    ],
    grammar: {
      type: 'Verbal noun (مصدر)',
    },
    etymology: {
      root: 'امن',
      meaning: 'Safety, security, faith',
      relatedWords: [
        { arabic: 'مُؤْمِن', meaning: 'Believer' },
        { arabic: 'أَمِين', meaning: 'Trustworthy' },
        { arabic: 'أَمَان', meaning: 'Safety, security' },
      ]
    }
  },

  'كُفْر': {
    verses: [
      { surah: 2, ayah: 256, context: 'Whoever disbelieves in Taghut' },
      { surah: 5, ayah: 44, context: 'Whoever does not judge by what Allah revealed' },
    ],
    grammar: {
      type: 'Verbal noun (مصدر)',
    },
    etymology: {
      root: 'كفر',
      meaning: 'To cover, conceal, disbelieve',
      relatedWords: [
        { arabic: 'كَافِر', meaning: 'Disbeliever' },
        { arabic: 'كَفَّارَة', meaning: 'Expiation' },
      ]
    }
  },

  'تَقْوَى': {
    verses: [
      { surah: 2, ayah: 2, context: 'Guidance for those conscious of Allah' },
      { surah: 2, ayah: 197, context: 'The best provision is Taqwa' },
      { surah: 3, ayah: 102, context: 'Be conscious of Allah' },
    ],
    grammar: {
      type: 'Verbal noun (مصدر)',
    },
    etymology: {
      root: 'وقي',
      meaning: 'Protection, piety, consciousness',
      relatedWords: [
        { arabic: 'مُتَّقِي', meaning: 'Pious, God-conscious' },
        { arabic: 'وِقَايَة', meaning: 'Protection, prevention' },
      ]
    }
  },

  'صَبْر': {
    verses: [
      { surah: 2, ayah: 45, context: 'Seek help through patience and prayer' },
      { surah: 2, ayah: 153, context: 'Allah is with the patient' },
      { surah: 103, ayah: 3, context: 'And advised each other to patience' },
    ],
    grammar: {
      type: 'Verbal noun (مصدر)',
    },
    etymology: {
      root: 'صبر',
      meaning: 'Patience, perseverance, endurance',
      relatedWords: [
        { arabic: 'صَابِر', meaning: 'Patient one' },
        { arabic: 'صَبُور', meaning: 'Very patient' },
      ]
    }
  },

  'شُكْر': {
    verses: [
      { surah: 2, ayah: 152, context: 'Remember Me; I will remember you' },
      { surah: 14, ayah: 7, context: 'If you are grateful, I will increase you' },
      { surah: 16, ayah: 78, context: 'Allah brought you out of your mothers wombs' },
    ],
    grammar: {
      type: 'Verbal noun (مصدر)',
    },
    etymology: {
      root: 'شكر',
      meaning: 'Gratitude, thankfulness',
      relatedWords: [
        { arabic: 'شَاكِر', meaning: 'Thankful' },
        { arabic: 'شَكُور', meaning: 'Very thankful' },
      ]
    }
  },

  'جَنَّة': {
    verses: [
      { surah: 3, ayah: 133, context: 'Rush toward forgiveness from your Lord and Paradise' },
      { surah: 57, ayah: 21, context: 'A garden whose width is like the heavens and earth' },
      { surah: 13, ayah: 35, context: 'Description of Paradise promised to the righteous' },
    ],
    grammar: {
      type: 'Noun (feminine)',
      plural: 'جَنَّات'
    },
    etymology: {
      root: 'جنن',
      meaning: 'To cover, conceal; garden',
      relatedWords: [
        { arabic: 'جِنّ', meaning: 'Jinn (hidden beings)' },
        { arabic: 'جُنُون', meaning: 'Madness' },
      ]
    }
  },

  'نَار': {
    verses: [
      { surah: 2, ayah: 24, context: 'Fear the Fire whose fuel is people and stones' },
      { surah: 3, ayah: 131, context: 'Fear the Fire prepared for disbelievers' },
      { surah: 104, ayah: 6, context: 'The Fire of Allah, kindled' },
    ],
    grammar: {
      type: 'Noun (feminine)',
    },
    etymology: {
      root: 'نور',
      meaning: 'Fire, heat',
      relatedWords: [
        { arabic: 'نُور', meaning: 'Light' },
      ]
    }
  },

  'قُرْآن': {
    verses: [
      { surah: 2, ayah: 185, context: 'The month of Ramadan in which was revealed the Quran' },
      { surah: 17, ayah: 9, context: 'Indeed, this Quran guides to what is most suitable' },
      { surah: 54, ayah: 17, context: 'We have made the Quran easy for remembrance' },
    ],
    grammar: {
      type: 'Verbal noun (مصدر)',
    },
    etymology: {
      root: 'قرأ',
      meaning: 'Reading, recitation',
      relatedWords: [
        { arabic: 'قَارِئ', meaning: 'Reader, reciter' },
        { arabic: 'قِرَاءَة', meaning: 'Reading' },
      ]
    }
  },

  'رَسُول': {
    verses: [
      { surah: 2, ayah: 285, context: 'The Messenger has believed' },
      { surah: 3, ayah: 144, context: 'Muhammad is not but a messenger' },
      { surah: 33, ayah: 40, context: 'Muhammad is the Messenger of Allah' },
    ],
    grammar: {
      type: 'Noun (masculine)',
      pattern: 'فَعُول'
    },
    etymology: {
      root: 'رسل',
      meaning: 'Messenger, apostle',
      relatedWords: [
        { arabic: 'رِسَالَة', meaning: 'Message' },
        { arabic: 'مُرْسَل', meaning: 'Sent one' },
      ]
    }
  },

  'نَبِيّ': {
    verses: [
      { surah: 3, ayah: 81, context: 'Allah took a covenant from the prophets' },
      { surah: 33, ayah: 40, context: 'But the Messenger of Allah and seal of prophets' },
      { surah: 7, ayah: 157, context: 'Those who follow the unlettered prophet' },
    ],
    grammar: {
      type: 'Noun (masculine)',
      plural: 'أَنْبِيَاء'
    },
    etymology: {
      root: 'نبأ',
      meaning: 'Prophet, news-bringer',
      relatedWords: [
        { arabic: 'نَبَأ', meaning: 'News, information' },
        { arabic: 'نُبُوَّة', meaning: 'Prophethood' },
      ]
    }
  },
};

// ==========================================
// HELPER FUNCTIONS (AFTER allWords is defined)
// ==========================================

/**
 * Enrich a word with enhancement data
 */
function enrichWordWithData(word) {
  const enhancementData = wordEnhancementData[word.arabic];
  
  if (enhancementData) {
    return {
      ...word,
      premium: enhancementData
    };
  }
  
  return word;
}

/**
 * Get word database based on premium status
 * FREE: 500 words with FULL features
 * PREMIUM: 1000 words with FULL features
 */
export function getWordDatabase(isPremium = false) {
  if (isPremium) {
    // Premium users get ALL words with enhancements
    return allWords.map(word => enrichWordWithData(word));
  } else {
    // Free users get first 500 words with FULL enhancements
    return allWords.slice(0, 500).map(word => enrichWordWithData(word));
  }
}

/**
 * Get enhancement context for a specific word
 */
export function getPremiumContext(word, isPremium = false, wordIndex = 0) {
  // Free users get full features for first 500 words
  if (wordIndex < 500) {
    const enhancementData = wordEnhancementData[word.arabic];
    
    if (enhancementData) {
      return {
        ...enhancementData,
        locked: false,
        availableToFree: true
      };
    }
    
    return {
      locked: false,
      verses: [],
      availableToFree: true,
      message: "Quranic verses for this word will be added soon"
    };
  }
  
  // Words 501-1000 require premium
  if (!isPremium) {
    return {
      locked: true,
      message: "Upgrade to Premium to unlock words 501-1000"
    };
  }
  
  // Premium user accessing words 501-1000
  const enhancementData = wordEnhancementData[word.arabic];
  
  if (enhancementData) {
    return {
      ...enhancementData,
      locked: false
    };
  }
  
  return {
    locked: false,
    verses: [],
    message: "Quranic verses for this word will be added soon"
  };
}

/**
 * Check if word has enhancement data
 */
export function hasEnhancementData(arabicWord) {
  return wordEnhancementData.hasOwnProperty(arabicWord);
}

/**
 * Get all words that have enhancement data
 */
export function getWordsWithEnhancementData() {
  return Object.keys(wordEnhancementData);
}

export default {
  getWordDatabase,
  getPremiumContext,
  hasEnhancementData,
  getWordsWithEnhancementData,
};