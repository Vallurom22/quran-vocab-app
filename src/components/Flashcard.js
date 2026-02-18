import React, { useState } from 'react';
import './Flashcard.css';

const FlashcardEnhanced = ({ 
  word, 
  onNext, 
  onPrevious, 
  onKnow, 
  current, 
  total,
  relatedWords = [],
  isPremium = false // For future Stripe integration
}) => {
  const [flipped, setFlipped] = useState(false);
  const [showRelated, setShowRelated] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  const handleKnow = () => {
    onKnow(word.id);
    // Auto advance after marking as known
    setTimeout(() => {
      if (current < total) {
        onNext();
        setFlipped(false);
        setShowRelated(false);
        setShowHint(false);
      }
    }, 500);
  };

  const handleNext = () => {
    onNext();
    setFlipped(false);
    setShowRelated(false);
    setShowHint(false);
  };

  const handlePrevious = () => {
    onPrevious();
    setFlipped(false);
    setShowRelated(false);
    setShowHint(false);
  };

  const handleAudio = () => {
    if (isPremium) {
      // Premium: Professional reciter
      playPremiumAudio();
    } else {
      // Free: Browser TTS
      playBrowserTTS();
    }
  };

  const playBrowserTTS = () => {
    const utterance = new SpeechSynthesisUtterance(word.arabic);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
  };

  const playPremiumAudio = () => {
    // Placeholder for premium audio
    alert('🔊 Premium feature: Professional Quran reciter audio!\n\nUpgrade to unlock high-quality audio.');
  };

  const progressPercent = (current / total) * 100;

  return (
    <div className="flashcard-enhanced-container">
      {/* Progress Bar */}
      <div className="flashcard-progress-bar">
        <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
        <span className="progress-text">{current} / {total}</span>
      </div>

      {/* Main Flashcard */}
      <div className="flashcard-wrapper">
        <div 
          className={`flashcard-3d ${flipped ? 'flipped' : ''}`}
          onClick={handleFlip}
        >
          {/* Front Side */}
          <div className="flashcard-front">
            <div className="card-corner-decoration">✦</div>
            
            <div className="card-content-center">
              <h2 className="flashcard-arabic-large">{word.arabic}</h2>
              <p className="flashcard-transliteration-front">{word.transliteration}</p>
              
              {showHint && (
                <div className="hint-box">
                  <span className="hint-icon">💡</span>
                  <span className="hint-text">
                    Category: {word.category}
                  </span>
                </div>
              )}
            </div>

            <div className="card-tap-hint">
              <span className="tap-icon">👆</span>
              <span>Tap to reveal meaning</span>
            </div>
          </div>

          {/* Back Side */}
          <div className="flashcard-back">
            <div className="card-corner-decoration">✦</div>
            
            <div className="card-content-center">
              <h3 className="flashcard-meaning-large">{word.meaning}</h3>
              
              <div className="flashcard-details-enhanced">
                <div className="detail-row">
                  <span className="detail-icon">🌱</span>
                  <span className="detail-text">Root: <strong>{word.root}</strong></span>
                </div>
                <div className="detail-row">
                  <span className="detail-icon">📚</span>
                  <span className="detail-text">Category: <strong>{word.category}</strong></span>
                </div>
                {word.occurrences && (
                  <div className="detail-row">
                    <span className="detail-icon">📖</span>
                    <span className="detail-text">
                      Appears <strong>{word.occurrences} times</strong> in Quran
                    </span>
                  </div>
                )}
              </div>

              {/* Quick Actions on Back */}
              <div className="quick-actions-back">
                <button 
                  className="quick-action-btn success"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleKnow();
                  }}
                >
                  ✓ I Know This
                </button>
                <button 
                  className="quick-action-btn secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowRelated(!showRelated);
                  }}
                >
                  🌳 Related Words
                </button>
              </div>
            </div>

            <div className="card-tap-hint">
              <span className="tap-icon">👆</span>
              <span>Tap to flip back</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Words Panel */}
      {showRelated && relatedWords.length > 0 && (
        <div className="related-words-flashcard">
          <h4 className="related-title">🌳 Words from Root: {word.root}</h4>
          <div className="related-words-grid-flashcard">
            {relatedWords.slice(0, 4).map((related, idx) => (
              <div key={idx} className="related-mini-card">
                <div className="related-mini-arabic">{related.arabic}</div>
                <div className="related-mini-meaning">{related.meaning}</div>
              </div>
            ))}
          </div>
          {!isPremium && relatedWords.length > 4 && (
            <div className="premium-upsell-mini">
              <span className="lock-icon-mini">🔒</span>
              <span>See all {relatedWords.length} related words with Premium</span>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flashcard-actions-enhanced">
        <div className="action-row-top">
          <button 
            className="action-btn-enhanced hint-btn"
            onClick={() => setShowHint(!showHint)}
          >
            💡 {showHint ? 'Hide' : 'Show'} Hint
          </button>
          
          <button 
            className="action-btn-enhanced audio-btn"
            onClick={handleAudio}
          >
            🔊 Pronunciation
            {!isPremium && <span className="premium-badge-mini">PRO</span>}
          </button>
        </div>

        <div className="action-row-main">
          <button 
            className="action-btn-enhanced nav-btn"
            onClick={handlePrevious}
            disabled={current === 1}
          >
            <span className="btn-icon">←</span>
            <span className="btn-text">Previous</span>
          </button>

          <button 
            className="action-btn-enhanced know-btn"
            onClick={handleKnow}
          >
            <span className="btn-icon">✓</span>
            <span className="btn-text">I Know This</span>
          </button>

          <button 
            className="action-btn-enhanced nav-btn"
            onClick={handleNext}
            disabled={current === total}
          >
            <span className="btn-text">Next</span>
            <span className="btn-icon">→</span>
          </button>
        </div>

        <div className="action-row-bottom">
          <button className="action-btn-enhanced secondary-btn">
            ⭐ Favorite
          </button>
          <button 
            className="action-btn-enhanced secondary-btn"
            onClick={() => setShowRelated(!showRelated)}
          >
            🌳 Root Words ({relatedWords.length})
          </button>
          <button className="action-btn-enhanced secondary-btn">
            📤 Share
          </button>
        </div>
      </div>

      {/* Keyboard Shortcuts Hint */}
      <div className="keyboard-shortcuts-hint">
        <span>💡 Shortcuts: </span>
        <kbd>Space</kbd> Flip • 
        <kbd>←</kbd> Previous • 
        <kbd>→</kbd> Next • 
        <kbd>K</kbd> Know
      </div>

      {/* Premium Upsell (only for free users) */}
      {!isPremium && (
        <div className="premium-flashcard-upsell">
          <div className="upsell-content">
            <span className="upsell-icon">⭐</span>
            <div className="upsell-text">
              <strong>Upgrade to Premium</strong>
              <span>Professional audio, offline mode, advanced analytics & more!</span>
            </div>
            <button className="upsell-btn">View Plans</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashcardEnhanced;