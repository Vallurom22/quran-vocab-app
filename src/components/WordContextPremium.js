import React, { useState, useEffect } from 'react';
import './WordContextPremium.css';
import { getVerses, playVerseAudio } from '../utils/QuranAPI';

const WordContextPremium = ({ word, onClose, isPremium, onUpgrade, wordIndex = 0, onOpenMultiSensory }) => {
  const [activeTab, setActiveTab] = useState('verses');
  const [playingAudio, setPlayingAudio] = useState(false);
  const [verseData, setVerseData] = useState([]);
  const [loadingVerses, setLoadingVerses] = useState(false);

  const premiumData = word.premium || {};

  // ✅ CORRECT LOCK LOGIC:
  // Words 0-499 (first 500): FREE - never locked
  // Words 500+: Need premium
  const isFeatureLocked = wordIndex >= 500 && !isPremium;

  // Fetch real verses when component mounts
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

  return (
    <div className="word-context-overlay-premium" onClick={onClose}>
      <div className="word-context-modal-premium" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="context-header-premium">
          <button className="context-close-premium" onClick={onClose}>✕</button>

          <div className="word-display-premium">
            <h2 className="arabic-display-premium">{word.arabic}</h2>
            <p className="transliteration-display-premium">{word.transliteration}</p>
            <p className="meaning-display-premium">{word.meaning}</p>
          </div>

          {/* Audio Button - available to all users */}
          {!isFeatureLocked && (
            <button
              className="audio-btn-premium"
              onClick={() => {
                const utterance = new SpeechSynthesisUtterance(word.arabic);
                utterance.lang = 'ar-SA';
                utterance.rate = 0.8;
                speechSynthesis.speak(utterance);
                setPlayingAudio(true);
                setTimeout(() => setPlayingAudio(false), 3000);
              }}
            >
              {playingAudio ? '⏸️' : '🔊'} 
            </button>
          )}

          {/* Quick Stats - always visible */}
          <div className="quick-stats-premium">
            <div className="stat-premium">
              <span className="stat-icon-premium">📖</span>
              <span className="stat-value-premium">{word.occurrences}</span>
              <span className="stat-label-premium">Occurrences</span>
            </div>
            <div className="stat-premium">
              <span className="stat-icon-premium">🌱</span>
              <span className="stat-value-premium">{word.root}</span>
              <span className="stat-label-premium">Root</span>
            </div>
            <div className="stat-premium">
              <span className="stat-icon-premium">📚</span>
              <span className="stat-value-premium">{word.category}</span>
              <span className="stat-label-premium">Category</span>
            </div>
          </div>
        </div>

        {/* ✅ FIXED TABS - only show lock if word is 501+ */}
        <div className="context-tabs-premium">
          <button
            className={`tab-btn-premium ${activeTab === 'verses' ? 'active' : ''}`}
            onClick={() => setActiveTab('verses')}

          >
            📝 Grammar & Morphology
            {isFeatureLocked && <span className="lock-badge">🔒</span>}
          </button>
          <button
            className={`tab-btn-premium ${activeTab === 'linguistics' ? 'active' : ''}`}
            onClick={() => setActiveTab('linguistics')}
          >
            🔤 Etymology & Roots
            {isFeatureLocked && <span className="lock-badge">🔒</span>}
          </button>
          <button
            className={`tab-btn-premium ${activeTab === 'usage' ? 'active' : ''}`}
            onClick={() => setActiveTab('usage')}
          >
            📊 Quranic Usage
            {isFeatureLocked && <span className="lock-badge">🔒</span>}
          </button>
        </div>

        {/* Content Area */}
        <div className="context-content-premium">

          

          {/* GRAMMAR TAB */}
          {activeTab === 'grammar' && (
            <div className="grammar-section-premium">
              {isFeatureLocked ? (
                <div className="premium-lock-premium">
                  <div className="lock-icon-premium">🔒</div>
                  <h3>Premium Feature</h3>
                  <p>Upgrade to Premium to unlock words 501-1000!</p>
                  <button className="upgrade-btn-premium" onClick={onUpgrade}>
                    ⭐ Upgrade to Premium
                  </button>
                </div>
              ) : premiumData.grammar ? (
                <>
                  <h3 className="section-title-premium">📝 Grammatical Analysis</h3>
                  <div className="grammar-grid-premium">
                    <div className="grammar-item-premium">
                      <label>Word Type:</label>
                      <span>{premiumData.grammar.type}</span>
                    </div>
                    {premiumData.grammar.pattern && (
                      <div className="grammar-item-premium">
                        <label>Form/Pattern:</label>
                        <span>{premiumData.grammar.pattern}</span>
                      </div>
                    )}
                  </div>
                  {premiumData.grammar.notes && (
                    <div className="grammar-notes-premium">
                      <h4>📌 Important Notes:</h4>
                      <p>{premiumData.grammar.notes}</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="no-verses-yet">
                  <h3 className="section-title-premium">📝 Grammar Analysis</h3>
                  <div className="coming-soon-message">
                    <p className="coming-soon-icon">📚</p>
                    <p className="coming-soon-text">
                      Detailed grammar analysis for this word is being added.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* LINGUISTICS TAB */}
          {activeTab === 'linguistics' && (
            <div className="linguistics-section-premium">
              {isFeatureLocked ? (
                <div className="premium-lock-premium">
                  <div className="lock-icon-premium">🔒</div>
                  <h3>Premium Feature</h3>
                  <p>Upgrade to Premium to unlock words 501-1000!</p>
                  <button className="upgrade-btn-premium" onClick={onUpgrade}>
                    ⭐ Upgrade to Premium
                  </button>
                </div>
              ) : premiumData.etymology ? (
                <>
                  <h3 className="section-title-premium">🔤 Etymology & Word Family</h3>
                  <div className="root-analysis-premium">
                    <div className="root-display-premium">
                      <label>Arabic Root:</label>
                      <div className="root-letters-premium">
                        {word.root.split('').map((letter, idx) => (
                          <span key={idx} className="root-letter-premium">{letter}</span>
                        ))}
                      </div>
                    </div>
                    <div className="root-meaning-premium">
                      <label>Root Meaning:</label>
                      <p>{premiumData.etymology.meaning}</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="no-verses-yet">
                  <h3 className="section-title-premium">🔤 Etymology & Roots</h3>
                  <div className="coming-soon-message">
                    <p className="coming-soon-icon">🌳</p>
                    <p className="coming-soon-text">
                      Etymology and word family analysis is being added.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* USAGE TAB */}
          {activeTab === 'usage' && (
            <div className="usage-section-premium">
              {isFeatureLocked ? (
                <div className="premium-lock-premium">
                  <div className="lock-icon-premium">🔒</div>
                  <h3>Premium Feature</h3>
                  <p>Upgrade to Premium to unlock words 501-1000!</p>
                  <button className="upgrade-btn-premium" onClick={onUpgrade}>
                    ⭐ Upgrade to Premium
                  </button>
                </div>
              ) : premiumData.quranUsage ? (
                <>
                  <h3 className="section-title-premium">📊 Quranic Usage Analysis</h3>
                  <div className="usage-stats-premium">
                    <div className="usage-card-premium">
                      <div className="usage-number-premium">{premiumData.quranUsage.totalOccurrences || word.occurrences}</div>
                      <div className="usage-label-premium">Total Occurrences</div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="no-verses-yet">
                  <h3 className="section-title-premium">📊 Quranic Usage</h3>
                  <div className="coming-soon-message">
                    <p className="coming-soon-icon">📊</p>
                    <p className="coming-soon-text">Usage analysis is being added.</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* INSIGHTS TAB */}
          {activeTab === 'insights' && (
            <div className="insights-section-premium">
              {isFeatureLocked ? (
                <div className="premium-lock-premium">
                  <div className="lock-icon-premium">🔒</div>
                  <h3>Premium Feature</h3>
                  <p>Upgrade to Premium to unlock words 501-1000!</p>
                  <button className="upgrade-btn-premium" onClick={onUpgrade}>
                    ⭐ Upgrade to Premium
                  </button>
                </div>
              ) : premiumData.tafsir ? (
                <>
                  <h3 className="section-title-premium">💡 Scholar Insights</h3>
                  {premiumData.tafsir.brief && (
                    <div className="tafsir-brief-premium">
                      <h4>Quick Summary:</h4>
                      <p>{premiumData.tafsir.brief}</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="no-verses-yet">
                  <h3 className="section-title-premium">💡 Scholar Insights</h3>
                  <div className="coming-soon-message">
                    <p className="coming-soon-icon">📜</p>
                    <p className="coming-soon-text">
                      Scholar insights and tafsir are being added.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* ✅ FIXED FOOTER */}
        <div className="context-footer-premium">
          {onOpenMultiSensory && (
            <button 
              className="footer-btn-premium primary"
              onClick={() => {
                onOpenMultiSensory(word);
                onClose();
              }}
            >
              🎨 Multi-Sensory Learning
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default WordContextPremium;