import React, { useState } from 'react';
import './WordContext.css';

const WordContext = ({ word, onClose }) => {
  const [activeTab, setActiveTab] = useState('verse');

  // Example verses where this word appears (you'd get these from API or data)
  const exampleVerses = [
    {
      surah: 1,
      ayah: 1,
      surahName: 'Al-Fatiha',
      arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
      translation: 'In the name of Allah, the Most Gracious, the Most Merciful',
      highlight: word.arabic
    }
  ];

  // Related words with same root
  const relatedWords = [
    { arabic: 'رحمة', meaning: 'Mercy', root: word.root },
    { arabic: 'راحم', meaning: 'Merciful (one who shows mercy)', root: word.root }
  ];

  // Usage patterns
  const usagePatterns = [
    { context: 'Divine Attributes', percentage: 45, count: 89 },
    { context: 'Human Qualities', percentage: 30, count: 59 },
    { context: 'Commands', percentage: 15, count: 30 },
    { context: 'Stories', percentage: 10, count: 20 }
  ];

  return (
    <div className="word-context-overlay" onClick={onClose}>
      <div className="word-context-panel" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="context-header">
          <div className="context-word-display">
            <h2 className="context-arabic">{word.arabic}</h2>
            <p className="context-transliteration">{word.transliteration}</p>
            <p className="context-meaning">{word.meaning}</p>
          </div>
          <button className="context-close" onClick={onClose}>✕</button>
        </div>

        {/* Quick Stats */}
        <div className="context-quick-stats">
          <div className="quick-stat">
            <span className="stat-number">{word.occurrences}</span>
            <span className="stat-label">Occurrences</span>
          </div>
          <div className="quick-stat">
            <span className="stat-number">{word.root}</span>
            <span className="stat-label">Root</span>
          </div>
          <div className="quick-stat">
            <span className="stat-number">{word.category}</span>
            <span className="stat-label">Category</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="context-tabs">
          <button 
            className={activeTab === 'verse' ? 'tab-btn active' : 'tab-btn'}
            onClick={() => setActiveTab('verse')}
          >
            📖 Quranic Examples
          </button>
          <button 
            className={activeTab === 'related' ? 'tab-btn active' : 'tab-btn'}
            onClick={() => setActiveTab('related')}
          >
            🌳 Related Words
          </button>
          <button 
            className={activeTab === 'usage' ? 'tab-btn active' : 'tab-btn'}
            onClick={() => setActiveTab('usage')}
          >
            📊 Usage Patterns
          </button>
          <button 
            className={activeTab === 'grammar' ? 'tab-btn active' : 'tab-btn'}
            onClick={() => setActiveTab('grammar')}
          >
            📝 Grammar Notes
          </button>
        </div>

        {/* Tab Content */}
        <div className="context-content">
          
          {/* Verse Examples Tab */}
          {activeTab === 'verse' && (
            <div className="verse-examples">
              <p className="tab-intro">
                See how <strong>{word.arabic}</strong> is used in the Quran:
              </p>
              {exampleVerses.map((verse, idx) => (
                <div key={idx} className="verse-card">
                  <div className="verse-reference">
                    Surah {verse.surah}:{verse.ayah} - {verse.surahName}
                  </div>
                  <div className="verse-arabic">{verse.arabic}</div>
                  <div className="verse-translation">{verse.translation}</div>
                  <button className="view-full-verse">
                    View Full Context →
                  </button>
                </div>
              ))}
              <p className="see-more">
                💡 This word appears {word.occurrences} times in the Quran
              </p>
            </div>
          )}

          {/* Related Words Tab */}
          {activeTab === 'related' && (
            <div className="related-words">
              <p className="tab-intro">
                Words sharing the root <strong>{word.root}</strong>:
              </p>
              <div className="related-grid">
                {relatedWords.map((related, idx) => (
                  <div key={idx} className="related-word-card">
                    <div className="related-arabic">{related.arabic}</div>
                    <div className="related-meaning">{related.meaning}</div>
                    <div className="related-root">Root: {related.root}</div>
                  </div>
                ))}
              </div>
              <div className="root-explanation">
                <h4>🌱 Root Meaning</h4>
                <p>
                  The root <strong>{word.root}</strong> carries the fundamental meaning 
                  related to mercy, compassion, and kindness.
                </p>
              </div>
            </div>
          )}

          {/* Usage Patterns Tab */}
          {activeTab === 'usage' && (
            <div className="usage-patterns">
              <p className="tab-intro">
                Where <strong>{word.arabic}</strong> appears most frequently:
              </p>
              {usagePatterns.map((pattern, idx) => (
                <div key={idx} className="usage-bar-container">
                  <div className="usage-label">
                    <span>{pattern.context}</span>
                    <span className="usage-count">{pattern.count} times</span>
                  </div>
                  <div className="usage-bar-bg">
                    <div 
                      className="usage-bar-fill" 
                      style={{ width: `${pattern.percentage}%` }}
                    >
                      <span className="usage-percentage">{pattern.percentage}%</span>
                    </div>
                  </div>
                </div>
              ))}
              <div className="context-explanation">
                <h4>💡 Insight</h4>
                <p>
                  This word is most commonly used when describing Allah's attributes, 
                  appearing in verses about divine mercy and compassion.
                </p>
              </div>
            </div>
          )}

          {/* Grammar Tab */}
          {activeTab === 'grammar' && (
            <div className="grammar-notes">
              <div className="grammar-section">
                <h4>📚 Word Type</h4>
                <p>Noun (اسم) - Attribute/Quality</p>
              </div>
              <div className="grammar-section">
                <h4>🔤 Forms</h4>
                <div className="forms-list">
                  <div className="form-item">
                    <span className="form-arabic">الرَّحْمَٰن</span>
                    <span className="form-label">Definite (with ال)</span>
                  </div>
                  <div className="form-item">
                    <span className="form-arabic">رَحْمَٰن</span>
                    <span className="form-label">Indefinite</span>
                  </div>
                </div>
              </div>
              <div className="grammar-section">
                <h4>💬 Common Phrases</h4>
                <div className="phrase-item">
                  <div className="phrase-arabic">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
                  <div className="phrase-meaning">
                    In the name of Allah, the Most Gracious, the Most Merciful
                  </div>
                </div>
              </div>
              <div className="grammar-section">
                <h4>🎯 Learning Tip</h4>
                <p className="tip-box">
                  الرحمن (Ar-Rahman) emphasizes the vastness and generosity of Allah's mercy 
                  to all creation, while الرحيم (Ar-Raheem) emphasizes the specific mercy 
                  shown to believers.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Action Buttons */}
        <div className="context-actions">
          <button className="action-btn primary">
            🔊 Hear Pronunciation
          </button>
          <button className="action-btn secondary">
            ⭐ Add to Favorites
          </button>
          <button className="action-btn secondary">
            📤 Share Word
          </button>
        </div>

      </div>
    </div>
  );
};

export default WordContext;
