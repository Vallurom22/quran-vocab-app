/**
 * 📖 EXTENDED VERSE CONTEXT COMPONENT
 * 
 * Shows verse before + after for better understanding
 * Highlights the target word in the verse
 * Shows full context of the passage
 */

import React, { useState, useEffect } from 'react';
import './VerseContext.css';

const VerseContext = ({ verse, targetWord, onCopy }) => {
  const [extendedContext, setExtendedContext] = useState({
    before: null,
    current: verse,
    after: null
  });
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fetch surrounding verses
  useEffect(() => {
    async function fetchContext() {
      if (!verse) return;
      
      setLoading(true);
      try {
        // Fetch verse before (if exists)
        const beforeVerse = verse.ayah > 1 
          ? await fetchVerse(verse.surah, verse.ayah - 1)
          : null;

        // Fetch verse after
        const afterVerse = await fetchVerse(verse.surah, verse.ayah + 1);

        setExtendedContext({
          before: beforeVerse,
          current: verse,
          after: afterVerse
        });
      } catch (error) {
        console.error('Error fetching context:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchContext();
  }, [verse]);

  // Fetch single verse from API
  async function fetchVerse(surah, ayah) {
    try {
      const response = await fetch(
        `https://api.alquran.cloud/v1/ayah/${surah}:${ayah}/editions/quran-unicode,en.sahih`
      );
      const data = await response.json();
      
      if (data.code === 200 && data.data) {
        return {
          surah: surah,
          ayah: ayah,
          arabic: data.data[0].text,
          translation: data.data[1].text,
          surahName: data.data[0].surah.englishName
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching verse:', error);
      return null;
    }
  }

  // Highlight target word in Arabic text
  function highlightWord(text, word) {
    if (!word || !text) return text;
    
    // Simple highlighting - can be improved with better Arabic matching
    const regex = new RegExp(`(${word})`, 'g');
    return text.replace(regex, '<mark class="word-highlight">$1</mark>');
  }

  // Copy verse to clipboard
  const handleCopy = (verse, includeContext = false) => {
    let textToCopy = '';
    
    if (includeContext && extendedContext.before) {
      textToCopy += `[${extendedContext.before.surah}:${extendedContext.before.ayah}] ${extendedContext.before.arabic}\n`;
      textToCopy += `"${extendedContext.before.translation}"\n\n`;
    }
    
    textToCopy += `[${verse.surah}:${verse.ayah}] ${verse.arabic}\n`;
    textToCopy += `"${verse.translation}"\n`;
    
    if (includeContext && extendedContext.after) {
      textToCopy += `\n[${extendedContext.after.surah}:${extendedContext.after.ayah}] ${extendedContext.after.arabic}\n`;
      textToCopy += `"${extendedContext.after.translation}"`;
    }
    
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    if (onCopy) onCopy(textToCopy);
  };

  if (loading) {
    return (
      <div className="verse-context-loading">
        <div className="spinner-verse"></div>
        <p>Loading context...</p>
      </div>
    );
  }

  return (
    <div className="verse-context-container">
      
      {/* Context Toggle */}
      <div className="context-header">
        <h4 className="context-title">📖 Quranic Context</h4>
        <div className="context-info">
          <span className="surah-badge">
            Surah {verse.surah}: {verse.surahName || 'Loading...'}
          </span>
        </div>
      </div>

      {/* Previous Verse (Context) */}
      {extendedContext.before && (
        <div className="context-verse previous-verse">
          <div className="verse-label">
            <span className="verse-number">Verse {extendedContext.before.ayah}</span>
            <span className="context-badge">Before</span>
          </div>
          <div className="verse-arabic-context">{extendedContext.before.arabic}</div>
          <div className="verse-translation-context">
            "{extendedContext.before.translation}"
          </div>
        </div>
      )}

      {/* Current Verse (Main - Highlighted) */}
      <div className="context-verse current-verse">
        <div className="verse-label">
          <span className="verse-number">Verse {verse.ayah}</span>
          <span className="current-badge">Your Word Appears Here</span>
        </div>
        <div 
          className="verse-arabic-main"
          dangerouslySetInnerHTML={{ 
            __html: highlightWord(verse.arabic, targetWord) 
          }}
        />
        <div className="verse-translation-main">
          "{verse.translation}"
        </div>
        
        {/* Copy Buttons */}
        <div className="verse-actions">
          <button 
            className="copy-btn single"
            onClick={() => handleCopy(verse, false)}
          >
            {copied ? '✓ Copied!' : '📋 Copy This Verse'}
          </button>
          <button 
            className="copy-btn context"
            onClick={() => handleCopy(verse, true)}
          >
            📚 Copy with Context
          </button>
        </div>
      </div>

      {/* Next Verse (Context) */}
      {extendedContext.after && (
        <div className="context-verse next-verse">
          <div className="verse-label">
            <span className="verse-number">Verse {extendedContext.after.ayah}</span>
            <span className="context-badge">After</span>
          </div>
          <div className="verse-arabic-context">{extendedContext.after.arabic}</div>
          <div className="verse-translation-context">
            "{extendedContext.after.translation}"
          </div>
        </div>
      )}

      {/* Context Insight */}
      <div className="context-insight">
        <span className="insight-icon">💡</span>
        <span className="insight-text">
          Reading surrounding verses helps you understand the complete meaning and context
        </span>
      </div>
    </div>
  );
};

export default VerseContext;