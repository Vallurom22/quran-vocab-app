import { useState, useEffect } from 'react';
import './Flashcard.css';
import { speakArabic } from '../utils/speechUtils';

function Flashcard({ word, onNext, onPrevious, onKnow, current, total }) {
  const [flipped, setFlipped] = useState(false);
  const [autoPlay, setAutoPlay] = useState(() => {
    const saved = localStorage.getItem('autoPlayAudio');
    return saved ? JSON.parse(saved) : true;
  });

  // Auto-play when card loads
  useEffect(() => {
    if (autoPlay && !flipped) {
      setTimeout(() => speakArabic(word.arabic), 500);
    }
  }, [word, autoPlay, flipped]);

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  const handleNext = () => {
    setFlipped(false);
    onNext();
  };

  const handlePrevious = () => {
    setFlipped(false);
    onPrevious();
  };

  const handleKnow = () => {
    onKnow(word.id);
    setFlipped(false);
    onNext();
  };

  const toggleAutoPlay = () => {
    const newValue = !autoPlay;
    setAutoPlay(newValue);
    localStorage.setItem('autoPlayAudio', JSON.stringify(newValue));
  };

  const handlePlayAudio = () => {
    speakArabic(word.arabic);
  };

  return (
    <div className="flashcard-container">
      <div className="flashcard-header">
        <button onClick={handlePrevious} disabled={current === 1}>
          ← Previous
        </button>
        <span className="card-counter">{current} / {total}</span>
        <button onClick={handleNext} disabled={current === total}>
          Next →
        </button>
      </div>

      <div className="flashcard-controls">
        <button 
          className="audio-control-btn"
          onClick={handlePlayAudio}
          title="Play audio"
        >
          🔊 Play Audio
        </button>
        <button 
          className={`audio-control-btn ${autoPlay ? 'active' : ''}`}
          onClick={toggleAutoPlay}
          title="Toggle auto-play"
        >
          {autoPlay ? '🔄 Auto-play ON' : '🔄 Auto-play OFF'}
        </button>
      </div>

      <div 
        className={`flashcard ${flipped ? 'flipped' : ''}`}
        onClick={handleFlip}
      >
        <div className="flashcard-face flashcard-front">
          <div className="flip-hint">👆 Click to flip</div>
          <div className="arabic-huge">{word.arabic}</div>
          <div className="category-badge">{word.category}</div>
        </div>
        
        <div className="flashcard-face flashcard-back">
          <div className="flip-hint">👆 Click to flip back</div>
          <div className="transliteration-huge">{word.transliteration}</div>
          <div className="meaning-huge">{word.meaning}</div>
          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">Root:</span>
              <span className="detail-value">{word.root}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Occurrences:</span>
              <span className="detail-value">{word.occurrences}x</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flashcard-actions">
        <button className="action-btn know-btn" onClick={handleKnow}>
          ✓ I Know This
        </button>
        <button className="action-btn study-btn" onClick={handleNext}>
          📚 Study More
        </button>
      </div>
    </div>
  );
}

export default Flashcard;