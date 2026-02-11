import { useState, useEffect } from 'react';
import './Review.css';
import { speakArabic } from '../utils/speechUtils';

function Review({ words, knownWords, onReviewed, onClose }) {
  const [reviewWords, setReviewWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  useEffect(() => {
    // Get words that need review
    const wordsToReview = getWordsNeedingReview(words, knownWords);
    setReviewWords(wordsToReview);
    
    if (wordsToReview.length === 0) {
      setSessionComplete(true);
    }
  }, [words, knownWords]);

  const getWordsNeedingReview = (allWords, known) => {
    const reviewData = JSON.parse(localStorage.getItem('reviewData') || '{}');
    const now = new Date().getTime();
    const oneDayMs = 24 * 60 * 60 * 1000;

    return allWords.filter(word => {
      if (!known.includes(word.id)) return false;

      const data = reviewData[word.id];
      if (!data) return true; // Just learned, needs first review

      // Spaced repetition intervals: 1 day, 3 days, 7 days, 14 days, 30 days
      const intervalDays = [1, 3, 7, 14, 30];
      const level = Math.min(data.level || 0, intervalDays.length - 1);
      const nextReview = data.lastReview + (intervalDays[level] * oneDayMs);

      return now >= nextReview;
    }).sort(() => Math.random() - 0.5).slice(0, 20); // Max 20 words per session
  };

  const handleResponse = (remembered) => {
    const word = reviewWords[currentIndex];
    const reviewData = JSON.parse(localStorage.getItem('reviewData') || '{}');
    
    if (!reviewData[word.id]) {
      reviewData[word.id] = { level: 0, lastReview: new Date().getTime() };
    }

    if (remembered) {
      // Move to next level
      reviewData[word.id].level = (reviewData[word.id].level || 0) + 1;
      reviewData[word.id].lastReview = new Date().getTime();
      setCorrectCount(correctCount + 1);
    } else {
      // Reset to level 0
      reviewData[word.id].level = 0;
      reviewData[word.id].lastReview = new Date().getTime();
    }

    localStorage.setItem('reviewData', JSON.stringify(reviewData));
    onReviewed(word.id, remembered);

    // Move to next word
    if (currentIndex < reviewWords.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    } else {
      setSessionComplete(true);
    }
  };

  if (reviewWords.length === 0 || sessionComplete) {
    const percentage = reviewWords.length > 0 
      ? Math.round((correctCount / reviewWords.length) * 100) 
      : 0;

    return (
      <div className="review-complete">
        <div className="complete-icon">
          {reviewWords.length === 0 ? '🎉' : '✅'}
        </div>
        <h2>
          {reviewWords.length === 0 
            ? 'No Words to Review!' 
            : 'Review Session Complete!'}
        </h2>
        <p>
          {reviewWords.length === 0 
            ? 'All caught up! Come back tomorrow.' 
            : `You remembered ${correctCount} out of ${reviewWords.length} words (${percentage}%)`}
        </p>
        <div className="next-review-info">
          <p>📅 Your next reviews are scheduled based on memory strength</p>
          <p>💡 Words you struggle with appear more frequently</p>
        </div>
        <button className="review-btn primary" onClick={onClose}>
          ← Back to Browse
        </button>
      </div>
    );
  }

  const word = reviewWords[currentIndex];
  const progress = ((currentIndex + 1) / reviewWords.length) * 100;

  return (
    <div className="review-container">
      <div className="review-header">
        <div className="review-progress-text">
          Word {currentIndex + 1} of {reviewWords.length}
        </div>
        <div className="review-score">
          Correct: {correctCount}
        </div>
      </div>

      <div className="review-progress-bar">
        <div className="review-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="review-card">
        <div className="review-question">
          <h2>Do you remember this word?</h2>
          <div className="review-arabic">{word.arabic}</div>
          <div className="review-transliteration">{word.transliteration}</div>
        </div>

        <div className="review-question">
  <h2>Do you remember this word?</h2>
  <button 
    className="review-audio-btn"
    onClick={() => speakArabic(word.arabic)}
    title="Listen to pronunciation"
  >
    🔊 Play Audio
  </button>
  <div className="review-arabic">{word.arabic}</div>
  <div className="review-transliteration">{word.transliteration}</div>
</div>



        {!showAnswer ? (
          <button 
            className="review-btn show-answer"
            onClick={() => setShowAnswer(true)}
          >
            🤔 Show Answer
          </button>
        ) : (
          <>
            <div className="review-answer">
              <div className="answer-meaning">{word.meaning}</div>
              <div className="answer-details">
                <p><strong>Root:</strong> {word.root}</p>
                <p><strong>Category:</strong> {word.category}</p>
                <p><strong>Occurrences:</strong> {word.occurrences}x in Quran</p>
              </div>
            </div>

            <div className="review-response">
              <h3>Did you remember it?</h3>
              <div className="response-buttons">
                <button 
                  className="review-btn wrong"
                  onClick={() => handleResponse(false)}
                >
                  ❌ No, I forgot
                </button>
                <button 
                  className="review-btn correct"
                  onClick={() => handleResponse(true)}
                >
                  ✅ Yes, I knew it!
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="review-info">
        <p>💡 Honest answers help optimize your review schedule</p>
      </div>
    </div>
  );
}

export default Review;