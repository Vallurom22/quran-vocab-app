/**
 * 🎴 WORD CARD WITH CATEGORY COLORS
 * 
 * Each category has its own unique color scheme
 * Makes it easy to visually identify word types
 */

import React from 'react';
import './WordCard.css';
import { getCategoryColor } from '../utils/CategoryColors';

const WordCardColored = ({ word, onClick, onRootClick, isKnown }) => {
  const categoryColor = getCategoryColor(word.category);
  
  return (
    <div 
      className={`word-card-colored ${isKnown ? 'known' : ''}`}
      onClick={onClick}
      style={{
        '--category-primary': categoryColor.primary,
        '--category-light': categoryColor.light,
        '--category-dark': categoryColor.dark,
        '--category-gradient': categoryColor.gradient
      }}
    >
      {/* Category Color Strip (Top) */}
      <div className="category-color-strip"></div>

      {/* Known Badge */}
      {isKnown && (
        <div className="known-indicator">
          <span className="check-icon">✓</span>
        </div>
      )}

      {/* Arabic Word (Large, Top) */}
      <div className="word-arabic-main">{word.arabic}</div>
      
      {/* English Meaning (Directly Under Arabic) */}
      <div className="word-english-main">{word.meaning}</div>

      {/* Transliteration */}
      <div className="word-transliteration-sub">{word.transliteration}</div>

      {/* Divider Line */}
      <div className="card-divider"></div>

      {/* Info Badges Grid */}
      <div className="info-badges-grid">
        
        {/* Root Badge */}
        {word.root && (
          <div 
            className="info-badge root-badge"
            onClick={(e) => {
              e.stopPropagation();
              onRootClick && onRootClick(word.root);
            }}
            title="Click to explore this root"
          >
            <span className="badge-icon">🌳</span>
            <div className="badge-content">
              <span className="badge-label">Root</span>
              <span className="badge-value">{word.root}</span>
            </div>
          </div>
        )}

        {/* Category Badge - Uses category color */}
        <div className="info-badge category-badge category-colored">
          <span className="badge-icon">📁</span>
          <div className="badge-content">
            <span className="badge-label">Category</span>
            <span className="badge-value">{word.category}</span>
          </div>
        </div>

        {/* Occurrences Badge */}
        {word.occurrences && (
          <div className="info-badge occurrence-badge">
            <span className="badge-icon">📖</span>
            <div className="badge-content">
              <span className="badge-label">Quran</span>
              <span className="badge-value">{word.occurrences}x</span>
            </div>
          </div>
        )}
        
      </div>

      {/* Hover Indicator */}
      <div className="card-hover-hint">
        <span className="hint-icon">👁</span>
        <span className="hint-text">Click to learn more</span>
      </div>
    </div>
  );
};

export default WordCardColored;