/**
 * 📚 SIMPLIFIED WORD CONTEXT MODAL
 * 
 * Changes:
 * ✅ Simplified tabs (3 instead of 5)
 * ✅ "Learning" tab combines grammar, etymology, roots
 * ✅ "Verses" tab for Quranic examples
 * ✅ "Usage" tab for usage info
 * ✅ Cleaner, more focused information
 */

import React, { useState, useEffect } from 'react';
import './WordContextPremium.css';
import { getVerses, playVerseAudio } from '../utils/QuranAPI';
import { getRootMeaning } from '../utils/RootMeaningsDatabase';
import VerseContext from './VerseContext';
import RelatedWords from './RelatedWords';

const WordContextSimplified = ({ 
  word, 
  onClose, 
  isPremium, 
  onUpgrade, 
  wordIndex = 0, 
  onOpenMultiSensory 
}) => {
  const [activeTab, setActiveTab] = useState('learning');
  const [playingAudio, setPlayingAudio] = useState(false);
  const [verseData, setVerseData] = useState([]);
  const [loadingVerses, setLoadingVerses] = useState(false);

  const premiumData = word.premium || {};
  const isFeatureLocked = wordIndex >= 500 && !isPremium;

  // Fetch verses
  useEffect(() => {
    async function fetchVerses() {
      if (!isFeatureLocked && premiumData.verses && premiumData.verses.length > 0) {
        setLoadingVerses(true);
        try {
          const verses = await getVerses(premiumData.verses);
          const enrichedVerses = verses.map((verse, idx) => ({
            ...verse,
            context: premiumData.verses[idx]?.context || ''
          }));
          setVerseData(enrichedVerses);
        } catch (error) {
          console.error('Error fetching verses:', error);
          setVerseData([]);
        } finally {
          setLoadingVerses(false);
        }
      }
    }
    fetchVerses();
  }, [isFeatureLocked, word, premiumData]);

  // Play audio
  const handlePlayAudio = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word.arabic);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
      setPlayingAudio(true);
      setTimeout(() => setPlayingAudio(false), 3000);
    }
  };

  return (
    <div className="word-context-overlay-simplified" onClick={onClose}>
      <div className="word-context-modal-simplified" onClick={(e) => e.stopPropagation()}>

        {/* Close Button */}
        <button className="close-btn-simplified" onClick={onClose}>✕</button>

        {/* Header Section */}
        <div className="modal-header-simplified">
          
          {/* Arabic Word */}
          <div className="word-display-large">{word.arabic}</div>
          
          {/* English Meaning */}
          <div className="word-meaning-large">{word.meaning}</div>
          
          {/* Transliteration */}
          <div className="word-trans-sub">{word.transliteration}</div>

          {/* Listen Button */}
          <button 
            className="listen-btn-header"
            onClick={handlePlayAudio}
            disabled={playingAudio}
          >
            {playingAudio ? '🔊 Playing...' : '▶️ Listen'}
          </button>

          {/* Quick Info Chips */}
          <div className="quick-info-chips">
            <div className="info-chip">
              <span className="chip-icon">🌳</span>
              <span className="chip-text">{word.root}</span>
            </div>
            <div className="info-chip">
              <span className="chip-icon">📁</span>
              <span className="chip-text">{word.category}</span>
            </div>
            <div className="info-chip">
              <span className="chip-icon">📖</span>
              <span className="chip-text">{word.occurrences}x</span>
            </div>
          </div>
        </div>

        {/* Simplified Tabs (3 tabs only) */}
        <div className="tabs-simplified">
          <button
            className={`tab-simplified ${activeTab === 'learning' ? 'active' : ''}`}
            onClick={() => setActiveTab('learning')}
          >
            <span className="tab-icon">📚</span>
            <span className="tab-label">Learning</span>
          </button>
          <button
            className={`tab-simplified ${activeTab === 'verses' ? 'active' : ''}`}
            onClick={() => setActiveTab('verses')}
          >
            <span className="tab-icon">📖</span>
            <span className="tab-label">Quranic Verses</span>
          </button>
          <button
            className={`tab-simplified ${activeTab === 'usage' ? 'active' : ''}`}
            onClick={() => setActiveTab('usage')}
          >
            <span className="tab-icon">💡</span>
            <span className="tab-label">Usage & Insights</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content-simplified">

          {/* LEARNING TAB - Combines Grammar, Etymology, Roots */}
          {activeTab === 'learning' && (
            <div className="learning-content">
              
              {/* Root Breakdown */}
              <div className="learning-section">
                <h3 className="section-title">🌳 Root & Etymology</h3>
                <div className="root-display-box">
                  <div className="root-letters">
                    {word.root.split('-').map((letter, idx) => (
                      <div key={idx} className="root-letter-item">
                        {letter}
                      </div>
                    ))}
                  </div>
                  <div className="root-meaning-text">
                    <strong>Core Meaning:</strong> {getRootMeaning(word.root)}
                  </div>
                </div>
              </div>

              {/* Grammar (if available) */}
              {premiumData.grammar && (
                <div className="learning-section">
                  <h3 className="section-title">📝 Grammar</h3>
                  <div className="grammar-info-box">
                    <div className="grammar-item">
                      <span className="grammar-label">Word Type:</span>
                      <span className="grammar-value">{premiumData.grammar.type}</span>
                    </div>
                    {premiumData.grammar.pattern && (
                      <div className="grammar-item">
                        <span className="grammar-label">Pattern:</span>
                        <span className="grammar-value">{premiumData.grammar.pattern}</span>
                      </div>
                    )}
                    {premiumData.grammar.notes && (
                      <div className="grammar-notes">
                        <p>{premiumData.grammar.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Learning Tip */}
              <div className="learning-tip-box">
                <span className="tip-icon">💡</span>
                <span className="tip-text">
                  Understanding the root <strong>{word.root}</strong> helps you learn related words faster!
                </span>
              </div>
            </div>
          )}

          {/* VERSES TAB */}
          {activeTab === 'verses' && (
            <div className="verses-content">
              {loadingVerses ? (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>Loading verses...</p>
                </div>
              ) : verseData.length > 0 ? (
                <>
                  <div className="verses-intro">
                    <p>This word appears <strong>{word.occurrences}</strong> times in the Quran</p>
                  </div>
                  {verseData.map((verse, idx) => (
                    <div key={idx} className="verse-card-simple">
                      <div className="verse-reference">
                        Surah {verse.surah}:{verse.ayah}
                        {verse.surahName && ` - ${verse.surahName}`}
                      </div>
                      <div className="verse-arabic-text">{verse.arabic}</div>
                      <div className="verse-translation-text">"{verse.translation}"</div>
                      {verse.context && (
                        <div className="verse-context-note">
                          💡 {verse.context}
                        </div>
                      )}
                    </div>
                  ))}
                </>
              ) : (
                <div className="empty-state">
                  <p className="empty-icon">📖</p>
                  <p className="empty-text">Quranic verses coming soon</p>
                  <p className="empty-subtext">
                    This word appears {word.occurrences} times in the Quran
                  </p>
                </div>
              )}
            </div>
          )}

          {/* USAGE TAB */}
          {activeTab === 'usage' && (
            <div className="usage-content">
              
              {/* Stats */}
              <div className="usage-section">
                <h3 className="section-title">📊 Quranic Statistics</h3>
                <div className="stats-grid">
                  <div className="stat-box">
                    <div className="stat-number">{word.occurrences}</div>
                    <div className="stat-label">Total Uses</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-number">{word.category}</div>
                    <div className="stat-label">Category</div>
                  </div>
                </div>
              </div>

              {/* Insights (if available) */}
              {premiumData.tafsir ? (
                <div className="usage-section">
                  <h3 className="section-title">💡 Scholar Insights</h3>
                  <div className="insights-box">
                    {premiumData.tafsir.brief && (
                      <p>{premiumData.tafsir.brief}</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="usage-section">
                  <div className="insights-placeholder">
                    <p className="placeholder-icon">📚</p>
                    <p>Detailed usage insights coming soon</p>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer - Multi-Sensory Button */}
        {onOpenMultiSensory && (
          <div className="modal-footer-simplified">
            <button 
              className="multisensory-cta"
              onClick={() => {
                onOpenMultiSensory(word);
                onClose();
              }}
            >
              <span className="cta-icon">🎨</span>
              <span className="cta-content">
                <span className="cta-title">Multi-Sensory Learning</span>
                <span className="cta-subtitle">Interactive visual experience</span>
              </span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default WordContextSimplified;