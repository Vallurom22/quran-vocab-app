import React from 'react';
import './WordCard.css';

const WordCard = ({ word, onClick, onRootClick, isKnown }) => {
  return (
    <div 
      className={`word-card ${isKnown ? 'known' : ''}`}
      data-category={word.category}
      onClick={onClick}
    >
      <h3 className="word-arabic">{word.arabic}</h3>
      
      <p className="word-transliteration">{word.transliteration}</p>
      
      <p className="word-meaning">{word.meaning}</p>
      
      <div className="word-details">
        {word.root && (
          <span 
            className="word-root badge root-badge" 
            onClick={(e) => {
              e.stopPropagation();
              onRootClick && onRootClick(word.root);
            }}
            data-tooltip="Click to explore this root"
          >
            Root: {word.root}
          </span>
        )}
        
        <span 
          className="word-category badge category-badge" 
          data-category={word.category}
        >
          {word.category}
        </span>
        
        {word.occurrences && (
          <span className="word-occurrences badge" data-tooltip="Times in Quran">
            {word.occurrences}x
          </span>
        )}
      </div>
    </div>
  );
};

export default WordCard;