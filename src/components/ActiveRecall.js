import React, { useState, useEffect } from 'react';
import './ActiveRecall.css';

const ActiveRecall = ({ words, onClose, knownWords = [] }) => {
  const [quizType, setQuizType] = useState('arabic-to-english');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizWords, setQuizWords] = useState([]);
  const [isComplete, setIsComplete] = useState(false);

  // Initialize quiz
  useEffect(() => {
    const shuffled = [...words].sort(() => Math.random() - 0.5).slice(0, 10);
    setQuizWords(shuffled);
    generateAnswers(shuffled[0], quizType);
  }, [words, quizType]);

  // Generate answer options
  const generateAnswers = (correctWord, type) => {
    const correct = type === 'arabic-to-english' 
      ? correctWord.meaning 
      : correctWord.arabic;

    // Get 3 random wrong answers
    const wrongAnswers = words
      .filter(w => w.id !== correctWord.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(w => type === 'arabic-to-english' ? w.meaning : w.arabic);

    // Combine and shuffle
    const allAnswers = [correct, ...wrongAnswers]
      .sort(() => Math.random() - 0.5);

    setAnswers(allAnswers);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  // Check answer
  const handleAnswer = (answer) => {
    if (showResult) return;

    setSelectedAnswer(answer);
    setShowResult(true);

    const currentWord = quizWords[currentQuestion];
    const correctAnswer = quizType === 'arabic-to-english' 
      ? currentWord.meaning 
      : currentWord.arabic;

    if (answer === correctAnswer) {
      setScore(score + 1);
    }
  };

  // Next question
  const handleNext = () => {
    if (currentQuestion < quizWords.length - 1) {
      const nextQuestion = currentQuestion + 1;
      setCurrentQuestion(nextQuestion);
      generateAnswers(quizWords[nextQuestion], quizType);
    } else {
      setIsComplete(true);
    }
  };

  // Restart quiz
  const handleRestart = () => {
    setCurrentQuestion(0);
    setScore(0);
    setIsComplete(false);
    const shuffled = [...words].sort(() => Math.random() - 0.5).slice(0, 10);
    setQuizWords(shuffled);
    generateAnswers(shuffled[0], quizType);
  };

  if (quizWords.length === 0) {
    return <div className="loading">Loading quiz...</div>;
  }

  const currentWord = quizWords[currentQuestion];
  const correctAnswer = quizType === 'arabic-to-english' 
    ? currentWord.meaning 
    : currentWord.arabic;

  // Results screen
  if (isComplete) {
    const percentage = Math.round((score / quizWords.length) * 100);
    
    return (
      <div className="active-recall-container">
        <div className="quiz-complete">
          <h1 className="complete-title">Quiz Complete! 🎉</h1>
          
          <div className="score-display">
            <div className="score-circle">
              <div className="score-number">{percentage}%</div>
              <div className="score-label">{score}/{quizWords.length} Correct</div>
            </div>
          </div>

          <div className="performance-message">
            {percentage === 100 && "Perfect! You're mastering these words! 🌟"}
            {percentage >= 80 && percentage < 100 && "Excellent work! Keep it up! 💪"}
            {percentage >= 60 && percentage < 80 && "Good job! Review and try again! 📚"}
            {percentage < 60 && "Keep practicing! You'll get better! 🎯"}
          </div>

          <div className="quiz-actions">
            <button className="restart-btn" onClick={handleRestart}>
              🔄 Try Again
            </button>
            <button className="close-btn" onClick={onClose}>
              ✅ Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="active-recall-container">
      
      {/* Header */}
      <div className="quiz-header">
        <button className="back-btn" onClick={onClose}>← Back</button>
        <h2 className="quiz-title">Active Recall Quiz</h2>
        <div className="quiz-score">
          Score: {score}/{currentQuestion}
        </div>
      </div>

      {/* Quiz Type Selector */}
      <div className="quiz-type-selector">
        <button
          className={`type-btn ${quizType === 'arabic-to-english' ? 'active' : ''}`}
          onClick={() => {
            setQuizType('arabic-to-english');
            setCurrentQuestion(0);
            setScore(0);
            generateAnswers(quizWords[0], 'arabic-to-english');
          }}
        >
          Arabic → English
        </button>
        <button
          className={`type-btn ${quizType === 'english-to-arabic' ? 'active' : ''}`}
          onClick={() => {
            setQuizType('english-to-arabic');
            setCurrentQuestion(0);
            setScore(0);
            generateAnswers(quizWords[0], 'english-to-arabic');
          }}
        >
          English → Arabic
        </button>
      </div>

      {/* Progress Bar */}
      <div className="quiz-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${((currentQuestion + 1) / quizWords.length) * 100}%` }}
          />
        </div>
        <div className="progress-text">
          Question {currentQuestion + 1} of {quizWords.length}
        </div>
      </div>

      {/* Question */}
      <div className="quiz-question">
        <div className="question-label">
          {quizType === 'arabic-to-english' ? 'What does this mean?' : 'How do you say this in Arabic?'}
        </div>
        <div className="question-word">
          {quizType === 'arabic-to-english' ? currentWord.arabic : currentWord.meaning}
        </div>
        {quizType === 'arabic-to-english' && (
          <div className="question-transliteration">{currentWord.transliteration}</div>
        )}
      </div>

      {/* Answer Options */}
      <div className="answer-options">
        {answers.map((answer, index) => {
          const isCorrect = answer === correctAnswer;
          const isSelected = answer === selectedAnswer;
          
          let className = 'answer-option';
          if (showResult) {
            if (isCorrect) className += ' correct';
            else if (isSelected) className += ' incorrect';
          }

          return (
            <button
              key={index}
              className={className}
              onClick={() => handleAnswer(answer)}
              disabled={showResult}
            >
              <span className="option-letter">{String.fromCharCode(65 + index)}</span>
              <span className="option-text">{answer}</span>
              {showResult && isCorrect && <span className="check-icon">✓</span>}
              {showResult && isSelected && !isCorrect && <span className="x-icon">✗</span>}
            </button>
          );
        })}
      </div>

      {/* Result & Next Button */}
      {showResult && (
        <div className={`result-feedback ${selectedAnswer === correctAnswer ? 'correct' : 'incorrect'}`}>
          {selectedAnswer === correctAnswer ? (
            <>
              <div className="feedback-icon">✓</div>
              <div className="feedback-text">Correct! Well done!</div>
            </>
          ) : (
            <>
              <div className="feedback-icon">✗</div>
              <div className="feedback-text">
                Incorrect. The answer was: <strong>{correctAnswer}</strong>
              </div>
            </>
          )}
          
          <button className="next-btn" onClick={handleNext}>
            {currentQuestion < quizWords.length - 1 ? 'Next Question →' : 'See Results'}
          </button>
        </div>
      )}

      {/* Word Info (shown after answering) */}
      {showResult && (
        <div className="word-info-box">
          <div className="info-row">
            <span className="info-label">Arabic:</span>
            <span className="info-value">{currentWord.arabic}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Meaning:</span>
            <span className="info-value">{currentWord.meaning}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Root:</span>
            <span className="info-value">{currentWord.root}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Category:</span>
            <span className="info-value">{currentWord.category}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveRecall;