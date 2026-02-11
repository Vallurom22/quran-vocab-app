import { useState, useEffect } from 'react';
import './Quiz.css';
import { speakArabic } from '../utils/speechUtils';

function Quiz({ words, onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [quizWords, setQuizWords] = useState([]);
  const [answers, setAnswers] = useState([]);

  // Initialize quiz with random words
  useEffect(() => {
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 10); // 10 questions
    setQuizWords(selected);
    generateAnswers(selected[0], selected);
  }, [words]);

  // Generate 4 multiple choice answers
  const generateAnswers = (correctWord, allWords) => {
    const otherWords = allWords.filter(w => w.id !== correctWord.id);
    const wrongAnswers = otherWords
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(w => w.meaning);
    
    const allAnswers = [...wrongAnswers, correctWord.meaning]
      .sort(() => Math.random() - 0.5);
    
    setAnswers(allAnswers);
  };

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    
    if (answer === quizWords[currentQuestion].meaning) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestion < quizWords.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        generateAnswers(quizWords[currentQuestion + 1], quizWords);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 10);
    setQuizWords(selected);
    generateAnswers(selected[0], selected);
  };

  if (quizWords.length === 0) {
    return <div className="quiz-loading">Loading quiz...</div>;
  }

  if (showResult) {
    const percentage = Math.round((score / quizWords.length) * 100);
    let message = '';
    let emoji = '';

    if (percentage === 100) {
      message = 'Perfect! Outstanding!';
      emoji = '🏆';
    } else if (percentage >= 80) {
      message = 'Excellent work!';
      emoji = '🌟';
    } else if (percentage >= 60) {
      message = 'Good job!';
      emoji = '👍';
    } else if (percentage >= 40) {
      message = 'Keep practicing!';
      emoji = '📚';
    } else {
      message = 'Review and try again!';
      emoji = '💪';
    }

    return (
      <div className="quiz-result">
        <div className="result-emoji">{emoji}</div>
        <h2>{message}</h2>
        <div className="result-score">
          {score} / {quizWords.length}
        </div>
        <div className="result-percentage">{percentage}%</div>
        <div className="result-actions">
          <button className="quiz-btn primary" onClick={restartQuiz}>
            🔄 Try Again
          </button>
          <button className="quiz-btn secondary" onClick={onComplete}>
            ← Back to Browse
          </button>
        </div>
      </div>
    );
  }

  const word = quizWords[currentQuestion];
  const isCorrect = selectedAnswer === word.meaning;
 

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <div className="quiz-progress">
          Question {currentQuestion + 1} / {quizWords.length}
        </div>
        <div className="quiz-score">
          Score: {score}
        </div>
      </div>

      <div className="quiz-progress-bar">
        <div 
          className="quiz-progress-fill"
          style={{ width: `${((currentQuestion + 1) / quizWords.length) * 100}%` }}
        />
      </div>

      <div className="quiz-question">
  <h2>What does this mean?</h2>
  <button 
    className="quiz-audio-btn"
    onClick={() => speakArabic(word.arabic)}
    title="Listen to pronunciation"
  >
    🔊 Play Audio
  </button>
  <div className="quiz-arabic">{word.arabic}</div>
  <div className="quiz-transliteration">{word.transliteration}</div>
  <div className="quiz-hint">Root: {word.root}</div>
</div>

      <div className="quiz-answers">
        {answers.map((answer, index) => {
          const isThisCorrect = answer === word.meaning;
          const isSelected = selectedAnswer === answer;
          
          let className = 'quiz-answer';
          if (selectedAnswer) {
            if (isThisCorrect) {
              className += ' correct';
            } else if (isSelected) {
              className += ' wrong';
            } else {
              className += ' disabled';
            }
          }

          return (
            <button
              key={index}
              className={className}
              onClick={() => !selectedAnswer && handleAnswer(answer)}
              disabled={selectedAnswer !== null}
            >
              {answer}
              {selectedAnswer && isThisCorrect && ' ✓'}
              {selectedAnswer && isSelected && !isThisCorrect && ' ✗'}
            </button>
          );
        })}
      </div>

      {selectedAnswer && (
        <div className={`quiz-feedback ${isCorrect ? 'correct' : 'wrong'}`}>
          {isCorrect ? '✓ Correct!' : `✗ Wrong! The answer is: ${word.meaning}`}
        </div>
      )}
    </div>
  );
}

export default Quiz;