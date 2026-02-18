import React, { useState, useEffect } from 'react';
import './Quiz.css';

const QuizEnhanced = ({ words, onComplete, isPremium = false }) => {
  const [quizType, setQuizType] = useState(null); // 'multiple-choice', 'typing', 'matching'
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [quizWords, setQuizWords] = useState([]);
  const [timeLeft, setTimeLeft] = useState(null);
  const [streak, setStreak] = useState(0);
  const [achievements, setAchievements] = useState([]);
  const [options, setOptions] = useState([]); // Options for multiple choice

  // Quiz settings
  const QUIZ_LENGTH = isPremium ? 20 : 10; // Premium gets longer quizzes
  const TIME_PER_QUESTION = isPremium ? 30 : 20; // Premium gets more time

  // Initialize quiz
  useEffect(() => {
    if (quizType && words.length > 0) {
      const shuffled = [...words].sort(() => Math.random() - 0.5);
      setQuizWords(shuffled.slice(0, QUIZ_LENGTH));
      setTimeLeft(TIME_PER_QUESTION);
    }
  }, [quizType, words]);

  // Timer
  useEffect(() => {
    if (quizType && timeLeft > 0 && !showFeedback) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showFeedback) {
      handleSubmit();
    }
  }, [timeLeft, showFeedback]);

  // Generate options for multiple choice
  useEffect(() => {
    if (quizType === 'multiple-choice' && quizWords.length > 0 && currentQuestion < quizWords.length) {
      const currentWord = quizWords[currentQuestion];
      const newOptions = [currentWord];
      const otherWords = words.filter(w => w.id !== currentWord.id);
      
      while (newOptions.length < 4) {
        const randomWord = otherWords[Math.floor(Math.random() * otherWords.length)];
        if (!newOptions.find(opt => opt.id === randomWord.id)) {
          newOptions.push(randomWord);
        }
      }
      
      setOptions(newOptions.sort(() => Math.random() - 0.5));
    }
  }, [quizType, currentQuestion, quizWords, words]);

  // Quiz type selection screen
  if (!quizType) {
    return (
      <div className="quiz-type-selection">
        <h2 className="quiz-title">Choose Quiz Type</h2>
        <p className="quiz-subtitle">Test your knowledge in different ways!</p>

        <div className="quiz-types-grid">
          {/* Multiple Choice */}
          <div 
            className="quiz-type-card"
            onClick={() => setQuizType('multiple-choice')}
          >
            <div className="quiz-type-icon">📝</div>
            <h3>Multiple Choice</h3>
            <p>Choose the correct meaning from 4 options</p>
            <div className="quiz-type-meta">
              <span className="difficulty easy">Easy</span>
              <span className="questions">{QUIZ_LENGTH} Questions</span>
            </div>
          </div>

          {/* Typing Quiz */}
          <div 
            className="quiz-type-card"
            onClick={() => setQuizType('typing')}
          >
            <div className="quiz-type-icon">⌨️</div>
            <h3>Type the Meaning</h3>
            <p>Type the correct English meaning</p>
            <div className="quiz-type-meta">
              <span className="difficulty medium">Medium</span>
              <span className="questions">{QUIZ_LENGTH} Questions</span>
            </div>
          </div>

          {/* Matching Quiz - Premium */}
          <div 
            className={`quiz-type-card ${!isPremium ? 'locked' : ''}`}
            onClick={() => isPremium ? setQuizType('matching') : alert('Premium feature!')}
          >
            {!isPremium && <div className="premium-lock">🔒 Premium</div>}
            <div className="quiz-type-icon">🔗</div>
            <h3>Matching Pairs</h3>
            <p>Match Arabic words with meanings</p>
            <div className="quiz-type-meta">
              <span className="difficulty hard">Hard</span>
              <span className="questions">15 Pairs</span>
            </div>
          </div>

          {/* Root Explorer Quiz - Premium */}
          <div 
            className={`quiz-type-card ${!isPremium ? 'locked' : ''}`}
            onClick={() => isPremium ? setQuizType('root-quiz') : alert('Premium feature!')}
          >
            {!isPremium && <div className="premium-lock">🔒 Premium</div>}
            <div className="quiz-type-icon">🌳</div>
            <h3>Root Family</h3>
            <p>Identify words from the same root</p>
            <div className="quiz-type-meta">
              <span className="difficulty hard">Hard</span>
              <span className="questions">10 Questions</span>
            </div>
          </div>
        </div>

        {!isPremium && (
          <div className="premium-quiz-upsell">
            <span className="upsell-icon">⭐</span>
            <span className="upsell-text">
              Unlock advanced quiz types with Premium!
            </span>
            <button className="upsell-btn-quiz">Upgrade Now</button>
          </div>
        )}
      </div>
    );
  }

  // Quiz complete screen
  if (currentQuestion >= quizWords.length) {
    const percentage = Math.round((score / quizWords.length) * 100);
    const passed = percentage >= 70;

    return (
      <div className="quiz-complete">
        <div className={`result-card ${passed ? 'passed' : 'failed'}`}>
          <div className="result-icon">
            {passed ? '🎉' : '📚'}
          </div>
          
          <h2 className="result-title">
            {passed ? 'Great Job!' : 'Keep Learning!'}
          </h2>
          
          <div className="result-score">
            <div className="score-circle">
              <svg viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" className="score-bg" />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="45" 
                  className="score-fill"
                  style={{
                    strokeDasharray: `${percentage * 2.827}, 282.7`
                  }}
                />
              </svg>
              <div className="score-text">{percentage}%</div>
            </div>
            
            <div className="score-details">
              <div className="score-item">
                <span className="score-label">Correct</span>
                <span className="score-value">{score} / {quizWords.length}</span>
              </div>
              <div className="score-item">
                <span className="score-label">Streak</span>
                <span className="score-value">🔥 {streak}</span>
              </div>
            </div>
          </div>

          {/* Achievements */}
          {achievements.length > 0 && (
            <div className="achievements-earned">
              <h3>🏆 Achievements Unlocked!</h3>
              <div className="achievements-list">
                {achievements.map((achievement, idx) => (
                  <div key={idx} className="achievement-badge">
                    <span className="achievement-icon">{achievement.icon}</span>
                    <span className="achievement-name">{achievement.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="result-actions">
            <button className="result-btn primary" onClick={() => window.location.reload()}>
              🔄 Try Again
            </button>
            <button className="result-btn secondary" onClick={onComplete}>
              ✓ Done
            </button>
          </div>

          {/* Premium Upsell */}
          {!isPremium && percentage >= 80 && (
            <div className="quiz-premium-prompt">
              <p>⭐ You're doing great! Unlock advanced analytics with Premium</p>
              <button className="premium-btn-small">View Plans</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  const currentWord = quizWords[currentQuestion];

  // Handle answer submission
  const handleSubmit = (selectedOption = null) => {
    let correct = false;

    if (quizType === 'multiple-choice') {
      correct = selectedOption?.id === currentWord.id;
    } else if (quizType === 'typing') {
      const userAnswerLower = userAnswer.toLowerCase().trim();
      const correctAnswerLower = currentWord.meaning.toLowerCase();
      correct = userAnswerLower === correctAnswerLower || 
                correctAnswerLower.includes(userAnswerLower);
    }

    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      setScore(score + 1);
      setStreak(streak + 1);
      
      // Check for achievements
      if (streak + 1 === 5) {
        setAchievements([...achievements, { icon: '🔥', name: '5 Streak!' }]);
      }
    } else {
      setStreak(0);
    }

    // Auto advance after feedback
    setTimeout(() => {
      setShowFeedback(false);
      setUserAnswer('');
      setCurrentQuestion(currentQuestion + 1);
      setTimeLeft(TIME_PER_QUESTION);
    }, 2000);
  };

  return (
    <div className="quiz-container-enhanced">
      {/* Header */}
      <div className="quiz-header">
        <div className="quiz-progress-info">
          <span className="question-counter">
            Question {currentQuestion + 1} / {quizWords.length}
          </span>
          <div className="quiz-progress-bar">
            <div 
              className="quiz-progress-fill"
              style={{ width: `${((currentQuestion + 1) / quizWords.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="quiz-stats">
          <div className="stat-item-quiz">
            <span className="stat-icon">✓</span>
            <span className="stat-value">{score}</span>
          </div>
          <div className="stat-item-quiz">
            <span className="stat-icon">🔥</span>
            <span className="stat-value">{streak}</span>
          </div>
          <div className="stat-item-quiz timer">
            <span className="stat-icon">⏱️</span>
            <span className={`stat-value ${timeLeft <= 5 ? 'warning' : ''}`}>
              {timeLeft}s
            </span>
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="question-card">
        <h3 className="question-prompt">
          {quizType === 'multiple-choice' ? 'What does this word mean?' : 'Type the meaning:'}
        </h3>
        
        <div className="question-word">
          <div className="word-arabic-quiz">{currentWord.arabic}</div>
          <div className="word-transliteration-quiz">{currentWord.transliteration}</div>
        </div>

        {/* Multiple Choice Options */}
        {quizType === 'multiple-choice' && (
          <div className="quiz-options">
            {options.map((option, idx) => (
              <button
                key={idx}
                className={`quiz-option ${
                  showFeedback 
                    ? option.id === currentWord.id 
                      ? 'correct' 
                      : 'incorrect'
                    : ''
                }`}
                onClick={() => !showFeedback && handleSubmit(option)}
                disabled={showFeedback}
              >
                <span className="option-letter">{String.fromCharCode(65 + idx)}</span>
                <span className="option-text">{option.meaning}</span>
              </button>
            ))}
          </div>
        )}

        {/* Typing Input */}
        {quizType === 'typing' && (
          <div className="typing-section">
            <input
              type="text"
              className="typing-input"
              placeholder="Type the meaning here..."
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !showFeedback && handleSubmit()}
              disabled={showFeedback}
              autoFocus
            />
            <button 
              className="submit-btn"
              onClick={() => handleSubmit()}
              disabled={!userAnswer || showFeedback}
            >
              Submit Answer
            </button>
          </div>
        )}

        {/* Feedback */}
        {showFeedback && (
          <div className={`feedback ${isCorrect ? 'correct-feedback' : 'incorrect-feedback'}`}>
            <div className="feedback-icon">
              {isCorrect ? '✓' : '✗'}
            </div>
            <div className="feedback-text">
              {isCorrect ? (
                <span><strong>Correct!</strong> Well done!</span>
              ) : (
                <span>
                  <strong>Not quite.</strong> The correct answer is: <strong>{currentWord.meaning}</strong>
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Hint Button */}
      <div className="quiz-hint-section">
        <button className="hint-btn-quiz">
          💡 Show Hint
          {!isPremium && <span className="premium-badge-quiz">PRO</span>}
        </button>
      </div>
    </div>
  );
};

export default QuizEnhanced;