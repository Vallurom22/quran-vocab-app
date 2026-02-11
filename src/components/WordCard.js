import './WordCard.css';
import { speakArabic } from '../utils/speechUtils';
import { useState } from 'react';

function WordCard({ word, onRootClick }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayAudio = (e) => {
    e.stopPropagation(); // Prevent card click events
    setIsPlaying(true);
    speakArabic(word.arabic);
    
    // Reset playing state after 2 seconds
    setTimeout(() => setIsPlaying(false), 2000);
  };

  return (
    <div className="word-card">
      <div className="card-header">
        <button 
          className={`audio-btn ${isPlaying ? 'playing' : ''}`}
          onClick={handlePlayAudio}
          title="Listen to pronunciation"
        >
          {isPlaying ? '🔊' : '🔈'}
        </button>
      </div>
      
      <div className="arabic">{word.arabic}</div>
      <div className="transliteration">{word.transliteration}</div>
      <div className="meaning">{word.meaning}</div>
      <div className="details">
        {onRootClick ? (
          <button 
            className="badge badge-clickable"
            onClick={() => onRootClick(word.root)}
            title="Click to see all words from this root"
          >
            Root: {word.root}
          </button>
        ) : (
          <span className="badge">Root: {word.root}</span>
        )}
        <span className="badge">Occurs: {word.occurrences}x</span>
        <span className="badge category">{word.category}</span>
      </div>
    </div>
  );
}

export default WordCard;