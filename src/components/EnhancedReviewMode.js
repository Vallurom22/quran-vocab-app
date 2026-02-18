import React, { useState, useEffect } from 'react';
import './EnhancedReviewMode.css';
import { srsManager } from '../utils/SpacedRepetition';

const EnhancedReviewMode = ({ words, onClose, onComplete }) => {
  const [dueWords, setDueWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [reviewMode, setReviewMode] = useState('recall'); // recall, type, audio, write
  const [userInput, setUserInput] = useState('');
  const [sessionStats, setSessionStats] = useState({
    reviewed: 0,
    correct: 0,
    hard: 0,
    good: 0,
    easy: 0,
    startTime: new Date(),
  });
  const [showCelebration, setShowCelebration] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    loadDueWords();
  }, [words]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (isRevealed) {
        if (e.key === '1') handleConfidence(1);
        if (e.key === '2') handleConfidence(2);
        if (e.key === '3') handleConfidence(3);
      } else if (e.key === ' ' && reviewMode !== 'type') {
        e.preventDefault();
        handleReveal();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isRevealed, reviewMode]);

  const loadDueWords = () => {
    const due = srsManager.getWordsDueToday();
    
    // Get word objects for due IDs
    const dueWordObjects = due
      .map(d => words.find(w => w.id === d.wordId))
      .filter(w => w !== undefined);
    
    setDueWords(dueWordObjects);
  };

  const handleConfidence = (confidence) => {
    const currentWord = dueWords[currentIndex];
    
    // Update SRS
    const review = srsManager.reviewWord(currentWord.id, confidence);
    
    // Update session stats
    const confidenceMap = { 1: 'hard', 2: 'good', 3: 'easy' };
    setSessionStats(prev => ({
      ...prev,
      reviewed: prev.reviewed + 1,
      [confidenceMap[confidence]]: prev[confidenceMap[confidence]] + 1,
      correct: confidence >= 2 ? prev.correct + 1 : prev.correct,
    }));
    
    // Move to next word
    if (currentIndex < dueWords.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsRevealed(false);
      setUserInput('');
      setShowHint(false);
    } else {
      // Session complete!
      setShowCelebration(true);
      if (onComplete) onComplete(sessionStats);
    }
  };

  const handleReveal = () => {
    setIsRevealed(true);
  };

  const handleTypeCheck = () => {
    const currentWord = dueWords[currentIndex];
    const isCorrect = userInput.toLowerCase().trim() === currentWord.meaning.toLowerCase();
    
    setIsRevealed(true);
    
    // Auto-rate based on correctness with delay
    if (isCorrect) {
      setTimeout(() => handleConfidence(2), 1500); // Good
    }
  };

  const playAudio = () => {
    const currentWord = dueWords[currentIndex];
    const utterance = new SpeechSynthesisUtterance(currentWord.arabic);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
  };

  const toggleHint = () => {
    setShowHint(!showHint);
  };

  if (dueWords.length === 0) {
    return (
      <div className="review-mode-overlay">
        <div className="review-mode-container">
          <div className="review-empty">
            <div className="empty-icon">🎉</div>
            <h2>All Caught Up!</h2>
            <p>No words are due for review right now.</p>
            <div className="next-review-info">
              <p>✓ Great job staying on track!</p>
              <p>Come back later to review more words</p>
            </div>
            <button className="btn-close" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showCelebration) {
    const accuracy = sessionStats.reviewed > 0 
      ? ((sessionStats.correct / sessionStats.reviewed) * 100).toFixed(0) 
      : 0;
    const duration = Math.round((new Date() - sessionStats.startTime) / 1000 / 60);
    
    return (
      <div className="review-mode-overlay">
        <div className="review-mode-container">
          <div className="celebration-screen">
            <div className="confetti-container">
              <div className="confetti">🎊</div>
              <div className="confetti">✨</div>
              <div className="confetti">🎉</div>
            </div>
            
            <h1 className="celebration-title">Session Complete!</h1>
            <p className="celebration-subtitle">You're making great progress</p>
            
            <div className="session-summary">
              <div className="summary-stat main">
                <span className="stat-number">{sessionStats.reviewed}</span>
                <span className="stat-label">Words Reviewed</span>
              </div>
              <div className="summary-stat">
                <span className="stat-number">{accuracy}%</span>
                <span className="stat-label">Accuracy</span>
              </div>
              <div className="summary-stat">
                <span className="stat-number">{duration}m</span>
                <span className="stat-label">Study Time</span>
              </div>
            </div>
            
            <div className="confidence-breakdown">
              <div className="breakdown-item easy">
                <span className="breakdown-icon">😊</span>
                <span className="breakdown-count">{sessionStats.easy}</span>
                <span className="breakdown-label">Easy</span>
              </div>
              <div className="breakdown-item good">
                <span className="breakdown-icon">👍</span>
                <span className="breakdown-count">{sessionStats.good}</span>
                <span className="breakdown-label">Good</span>
              </div>
              <div className="breakdown-item hard">
                <span className="breakdown-icon">😅</span>
                <span className="breakdown-count">{sessionStats.hard}</span>
                <span className="breakdown-label">Hard</span>
              </div>
            </div>

            <div className="next-steps">
              <h3>🎯 Next Steps:</h3>
              <p>These words will be reviewed again at optimal intervals</p>
              <ul>
                <li>Easy words: Review in 1-2 weeks</li>
                <li>Good words: Review in 3-7 days</li>
                <li>Hard words: Review tomorrow</li>
              </ul>
            </div>

            <button className="btn-done" onClick={onClose}>
              ✓ Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentWord = dueWords[currentIndex];
  const progress = ((currentIndex / dueWords.length) * 100).toFixed(0);
  const reviewData = srsManager.getWordReview(currentWord.id);

  return (
    <div className="review-mode-overlay">
      <div className="review-mode-container">
        
        {/* Header */}
        <div className="review-header">
          <button className="close-btn-review" onClick={onClose}>✕</button>
          <div className="header-info">
            <h2>🔄 Spaced Repetition Review</h2>
            <p className="header-subtitle">Active recall strengthens memory</p>
          </div>
          <div className="review-progress-container">
            <span className="progress-text">{currentIndex + 1} / {dueWords.length}</span>
            <div className="progress-bar-review">
              <div className="progress-fill-review" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="mode-selector">
          <button 
            className={reviewMode === 'recall' ? 'mode-btn active' : 'mode-btn'}
            onClick={() => { setReviewMode('recall'); setIsRevealed(false); }}
            title="Cover and recall"
          >
            <span className="mode-icon">👁️</span>
            <span className="mode-label">Recall</span>
          </button>
          <button 
            className={reviewMode === 'type' ? 'mode-btn active' : 'mode-btn'}
            onClick={() => { setReviewMode('type'); setIsRevealed(false); setUserInput(''); }}
            title="Type the answer"
          >
            <span className="mode-icon">⌨️</span>
            <span className="mode-label">Type</span>
          </button>
          <button 
            className={reviewMode === 'audio' ? 'mode-btn active' : 'mode-btn'}
            onClick={() => { setReviewMode('audio'); setIsRevealed(false); }}
            title="Listen and recall"
          >
            <span className="mode-icon">🔊</span>
            <span className="mode-label">Audio</span>
          </button>
        </div>

        {/* Review Card */}
        <div className="review-card-main">
          
          {/* Word Status Info */}
          {reviewData && (
            <div className="word-status-bar">
              <div className="status-item">
                <span className="status-label">Reviews:</span>
                <span className="status-value">{reviewData.reviewCount}</span>
              </div>
              <div className="status-item">
                <span className="status-label">Streak:</span>
                <span className="status-value">{reviewData.correctStreak} 🔥</span>
              </div>
              <div className="status-item">
                <span className="status-label">Next:</span>
                <span className="status-value">{reviewData.interval}d</span>
              </div>
            </div>
          )}

          {/* Front Side */}
          <div className={`card-content ${isRevealed ? 'revealed' : ''}`}>
            
            {reviewMode === 'audio' ? (
              <div className="audio-prompt">
                <button className="audio-play-btn-large" onClick={playAudio}>
                  <span className="audio-icon">🔊</span>
                  <span>Play Audio</span>
                </button>
                <p className="audio-hint">Listen carefully and recall the word</p>
                {showHint && <p className="hint-text">Category: {currentWord.category}</p>}
              </div>
            ) : (
              <div className="word-prompt">
                <h1 className="arabic-display-large">{currentWord.arabic}</h1>
                <p className="transliteration-large">{currentWord.transliteration}</p>
                <div className="word-meta">
                  <span className="meta-item">Root: {currentWord.root}</span>
                  <span className="meta-divider">•</span>
                  <span className="meta-item">{currentWord.category}</span>
                </div>
              </div>
            )}

            {/* Type Mode Input */}
            {reviewMode === 'type' && !isRevealed && (
              <div className="type-section">
                <input
                  type="text"
                  className="type-input-large"
                  placeholder="Type the English meaning..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && userInput.trim() && handleTypeCheck()}
                  autoFocus
                />
                <button 
                  className="btn-check-answer"
                  onClick={handleTypeCheck}
                  disabled={!userInput.trim()}
                >
                  ✓ Check Answer
                </button>
              </div>
            )}

            {/* Hint Button */}
            {!isRevealed && (
              <button className="btn-hint" onClick={toggleHint}>
                💡 {showHint ? 'Hide Hint' : 'Show Hint'}
              </button>
            )}

            {/* Reveal Button */}
            {!isRevealed && reviewMode !== 'type' && (
              <button className="btn-reveal-large" onClick={handleReveal}>
                <span>👁️ Reveal Answer</span>
              </button>
            )}

            {/* Answer (Revealed) */}
            {isRevealed && (
              <div className="answer-section">
                <div className="answer-divider"></div>
                
                <div className="answer-content">
                  {reviewMode === 'type' && (
                    <div className="type-result">
                      {userInput.toLowerCase().trim() === currentWord.meaning.toLowerCase() ? (
                        <div className="result-correct">
                          <span className="result-icon">✓</span>
                          <span className="result-text">Correct!</span>
                        </div>
                      ) : (
                        <div className="result-incorrect">
                          <span className="result-icon">✗</span>
                          <span className="result-text">Not quite</span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <h2 className="answer-meaning">{currentWord.meaning}</h2>
                  
                  {currentWord.premium && currentWord.premium.verses && (
                    <div className="context-example">
                      <p className="context-label">Used in Quran:</p>
                      <p className="context-text">"{currentWord.premium.verses[0]?.translation}"</p>
                      <p className="context-ref">Surah {currentWord.premium.verses[0]?.surah}:{currentWord.premium.verses[0]?.ayah}</p>
                    </div>
                  )}

                  <div className="answer-actions">
                    <button className="action-btn" onClick={playAudio}>
                      🔊 Hear it
                    </button>
                    <button className="action-btn">
                      📖 See Context
                    </button>
                  </div>
                </div>

                {/* Confidence Buttons */}
                <div className="confidence-section">
                  <p className="confidence-prompt">How well did you know this word?</p>
                  <div className="confidence-buttons">
                    <button 
                      className="confidence-btn hard"
                      onClick={() => handleConfidence(1)}
                    >
                      <span className="conf-icon">😅</span>
                      <span className="conf-label">Hard</span>
                      <span className="conf-desc">Review tomorrow</span>
                    </button>
                    <button 
                      className="confidence-btn good"
                      onClick={() => handleConfidence(2)}
                    >
                      <span className="conf-icon">👍</span>
                      <span className="conf-label">Good</span>
                      <span className="conf-desc">Review in 3-7 days</span>
                    </button>
                    <button 
                      className="confidence-btn easy"
                      onClick={() => handleConfidence(3)}
                    >
                      <span className="conf-icon">😊</span>
                      <span className="conf-label">Easy</span>
                      <span className="conf-desc">Review in 1-2 weeks</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Keyboard Shortcuts Hint */}
        <div className="keyboard-hints">
          <span className="hint-item">Space: Reveal</span>
          <span className="hint-divider">•</span>
          <span className="hint-item">1: Hard</span>
          <span className="hint-divider">•</span>
          <span className="hint-item">2: Good</span>
          <span className="hint-divider">•</span>
          <span className="hint-item">3: Easy</span>
        </div>

      </div>
    </div>
  );
};

export default EnhancedReviewMode;