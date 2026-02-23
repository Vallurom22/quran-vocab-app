/**
 * 🔗 RELATED WORDS COMPONENT
 * 
 * Suggests related words based on:
 * - Same root family
 * - Same category
 * - Similar themes
 * - Commonly learned together
 */

import React, { useState, useMemo } from 'react';
import './RelatedWords.css';

const RelatedWords = ({ 
  currentWord, 
  allWords, 
  onWordClick, 
  knownWords = [] 
}) => {
  const [activeTab, setActiveTab] = useState('root');

  // Get related words by different criteria
  const relatedWordsSets = useMemo(() => {
    if (!currentWord || !allWords) return {};

    // 1. Same Root Family
    const sameRoot = allWords.filter(w => 
      w.id !== currentWord.id && 
      w.root === currentWord.root
    ).slice(0, 8);

    // 2. Same Category
    const sameCategory = allWords.filter(w => 
      w.id !== currentWord.id && 
      w.category === currentWord.category &&
      w.root !== currentWord.root // Don't duplicate root words
    ).slice(0, 8);

    // 3. Similar Meaning (simple keyword matching)
    const keywords = currentWord.meaning.toLowerCase().split(' ');
    const similarMeaning = allWords.filter(w => {
      if (w.id === currentWord.id) return false;
      const wMeaning = w.meaning.toLowerCase();
      return keywords.some(keyword => 
        keyword.length > 3 && wMeaning.includes(keyword)
      );
    }).slice(0, 8);

    // 4. Frequently learned together (based on difficulty/frequency)
    const similarFrequency = allWords.filter(w => {
      if (w.id === currentWord.id) return false;
      const freqDiff = Math.abs(w.occurrences - currentWord.occurrences);
      return freqDiff < 100; // Similar frequency in Quran
    }).slice(0, 8);

    return {
      root: sameRoot,
      category: sameCategory,
      meaning: similarMeaning,
      frequency: similarFrequency
    };
  }, [currentWord, allWords]);

  // Get active list
  const activeWords = relatedWordsSets[activeTab] || [];

  // Check if word is known
  const isWordKnown = (wordId) => knownWords.includes(wordId);

  // Calculate learning priority
  const getLearningPriority = (word) => {
    let score = 0;
    
    // Higher priority for same root (learn word families together)
    if (word.root === currentWord.root) score += 3;
    
    // Higher priority for same category
    if (word.category === currentWord.category) score += 2;
    
    // Higher priority for frequent words
    if (word.occurrences > 100) score += 2;
    if (word.occurrences > 500) score += 3;
    
    // Lower priority if already known
    if (isWordKnown(word.id)) score -= 5;
    
    return score;
  };

  // Sort by priority
  const sortedWords = useMemo(() => {
    return [...activeWords].sort((a, b) => 
      getLearningPriority(b) - getLearningPriority(a)
    );
  }, [activeWords, knownWords]);

  if (!currentWord || activeWords.length === 0) {
    return (
      <div className="related-words-empty">
        <p className="empty-icon">🔍</p>
        <p>No related words found</p>
      </div>
    );
  }

  return (
    <div className="related-words-container">
      
      {/* Header */}
      <div className="related-header">
        <h3 className="related-title">🔗 Related Words</h3>
        <p className="related-subtitle">
          Expand your vocabulary by learning connected words
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="related-tabs">
        <button
          className={`related-tab ${activeTab === 'root' ? 'active' : ''}`}
          onClick={() => setActiveTab('root')}
        >
          <span className="tab-icon">🌳</span>
          <span className="tab-text">Same Root</span>
          <span className="tab-count">{relatedWordsSets.root?.length || 0}</span>
        </button>
        <button
          className={`related-tab ${activeTab === 'category' ? 'active' : ''}`}
          onClick={() => setActiveTab('category')}
        >
          <span className="tab-icon">📁</span>
          <span className="tab-text">Same Topic</span>
          <span className="tab-count">{relatedWordsSets.category?.length || 0}</span>
        </button>
        <button
          className={`related-tab ${activeTab === 'meaning' ? 'active' : ''}`}
          onClick={() => setActiveTab('meaning')}
        >
          <span className="tab-icon">💡</span>
          <span className="tab-text">Similar</span>
          <span className="tab-count">{relatedWordsSets.meaning?.length || 0}</span>
        </button>
        <button
          className={`related-tab ${activeTab === 'frequency' ? 'active' : ''}`}
          onClick={() => setActiveTab('frequency')}
        >
          <span className="tab-icon">📊</span>
          <span className="tab-text">Suggested</span>
          <span className="tab-count">{relatedWordsSets.frequency?.length || 0}</span>
        </button>
      </div>

      {/* Words Grid */}
      <div className="related-words-grid">
        {sortedWords.map(word => {
          const known = isWordKnown(word.id);
          const priority = getLearningPriority(word);
          
          return (
            <div 
              key={word.id}
              className={`related-word-card ${known ? 'known' : ''}`}
              onClick={() => onWordClick(word)}
            >
              {/* Known Badge */}
              {known && (
                <div className="known-badge-small">✓</div>
              )}

              {/* Priority Badge */}
              {!known && priority >= 5 && (
                <div className="priority-badge">
                  <span className="priority-icon">⭐</span>
                  <span className="priority-text">Recommended</span>
                </div>
              )}

              {/* Arabic Word */}
              <div className="related-arabic">{word.arabic}</div>

              {/* English Meaning */}
              <div className="related-english">{word.meaning}</div>

              {/* Transliteration */}
              <div className="related-trans">{word.transliteration}</div>

              {/* Meta Info */}
              <div className="related-meta">
                <div className="meta-item">
                  <span className="meta-icon">🌳</span>
                  <span className="meta-text">{word.root}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-icon">📖</span>
                  <span className="meta-text">{word.occurrences}x</span>
                </div>
              </div>

              {/* Learn Button */}
              <button className="learn-this-btn">
                {known ? 'Review' : 'Learn This'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Learning Tip */}
      <div className="related-tip">
        <span className="tip-icon">💡</span>
        <span className="tip-text">
          {activeTab === 'root' && `These words share the root ${currentWord.root} - learn them together for better retention!`}
          {activeTab === 'category' && `All these words are about ${currentWord.category} - build your themed vocabulary!`}
          {activeTab === 'meaning' && `These words have similar meanings - perfect for expanding your understanding!`}
          {activeTab === 'frequency' && `These words appear at similar frequency in the Quran - learn them at the same pace!`}
        </span>
      </div>
    </div>
  );
};

export default RelatedWords;