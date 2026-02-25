/**
 * 📊 ENHANCED INTERACTIVE LEARNING DASHBOARD
 * Bold, distinct buttons with better visual hierarchy
 */

import React, { useState } from 'react';
import './InteractiveLearningDashboard_Enhanced.css';
import ActiveRecall from './ActiveRecall';
import MnemonicsStories from './MnemonicsStories';
import MultiSensoryLearning from './MultiSensoryLearning';
import Flashcard from './Flashcard';

const InteractiveLearningDashboard = ({ 
  words, 
  knownWords, 
  totalWords, 
  onClose 
}) => {
  const [activeMethod, setActiveMethod] = useState(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  const handleStartMethod = (method) => {
    setActiveMethod(method);
    setCurrentWordIndex(0);
  };

  const handleCloseMethod = () => {
    setActiveMethod(null);
  };

  const handleNextWord = () => {
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
    }
  };

  const handlePreviousWord = () => {
    if (currentWordIndex > 0) {
      setCurrentWordIndex(currentWordIndex - 1);
    }
  };

  // If a method is active, show that component
  if (activeMethod === 'spaced_repetition' && words[currentWordIndex]) {
    return (
      <Flashcard
        word={words[currentWordIndex]}
        onNext={handleNextWord}
        onPrevious={handlePreviousWord}
        onClose={handleCloseMethod}
        current={currentWordIndex + 1}
        total={words.length}
      />
    );
  }

  if (activeMethod === 'mnemonics') {
    return (
      <MnemonicsStories
        words={words}
        knownWords={knownWords}
        onClose={handleCloseMethod}
      />
    );
  }

  if (activeMethod === 'active_recall') {
    return (
      <ActiveRecall
        words={words}
        knownWords={knownWords}
        onClose={handleCloseMethod}
      />
    );
  }

  if (activeMethod === 'multi_sensory' && words[currentWordIndex]) {
    return (
      <MultiSensoryLearning
        word={words[currentWordIndex]}
        onClose={handleCloseMethod}
      />
    );
  }

  // Main dashboard view
  return (
    <div className="dashboard-overlay-enhanced">
      <div className="dashboard-modal-enhanced">
        <button className="close-btn-enhanced" onClick={onClose}>✕</button>

        {/* Header */}
        <div className="dashboard-header-enhanced">
          <h1>🎓 Learning Methods</h1>
          <p className="dashboard-subtitle">Choose how you want to study today</p>
        </div>

        {/* Progress Summary */}
        <div className="progress-summary-enhanced">
          <div className="progress-stat">
            <div className="stat-number">{knownWords.length}</div>
            <div className="stat-label">Words Learned</div>
          </div>
          <div className="progress-stat">
            <div className="stat-number">{totalWords}</div>
            <div className="stat-label">Total Words</div>
          </div>
          <div className="progress-stat">
            <div className="stat-number">
              {Math.round((knownWords.length / totalWords) * 100)}%
            </div>
            <div className="stat-label">Progress</div>
          </div>
        </div>

        {/* Learning Methods Grid */}
        <div className="methods-grid-enhanced">
          
          {/* Method 1: Spaced Repetition */}
          <div className="method-card-enhanced spaced-repetition">
            <div className="method-icon-large">🎴</div>
            <h3 className="method-title">Spaced Repetition</h3>
            <p className="method-description">
              Review words at scientifically optimal intervals for maximum retention
            </p>
            <div className="method-benefits">
              <span className="benefit-tag">✓ Long-term memory</span>
              <span className="benefit-tag">✓ Proven effective</span>
            </div>
            <button 
              className="method-btn-enhanced primary"
              onClick={() => handleStartMethod('spaced_repetition')}
            >
              <span className="btn-text">Start Flashcards</span>
              <span className="btn-arrow">→</span>
            </button>
          </div>

          {/* Method 2: Mnemonics */}
          <div className="method-card-enhanced mnemonics">
            <div className="method-icon-large">💭</div>
            <h3 className="method-title">Mnemonics & Stories</h3>
            <p className="method-description">
              Create memorable stories and visual associations for each word
            </p>
            <div className="method-benefits">
              <span className="benefit-tag">✓ Creative learning</span>
              <span className="benefit-tag">✓ Fun & engaging</span>
            </div>
            <button 
              className="method-btn-enhanced secondary"
              onClick={() => handleStartMethod('mnemonics')}
            >
              <span className="btn-text">Create Stories</span>
              <span className="btn-arrow">→</span>
            </button>
          </div>

          {/* Method 3: Active Recall */}
          <div className="method-card-enhanced active-recall">
            <div className="method-icon-large">🧠</div>
            <h3 className="method-title">Active Recall</h3>
            <p className="method-description">
              Test yourself with quizzes to strengthen memory and comprehension
            </p>
            <div className="method-benefits">
              <span className="benefit-tag">✓ Self-testing</span>
              <span className="benefit-tag">✓ Quick progress</span>
            </div>
            <button 
              className="method-btn-enhanced accent"
              onClick={() => handleStartMethod('active_recall')}
            >
              <span className="btn-text">Take Quiz</span>
              <span className="btn-arrow">→</span>
            </button>
          </div>

          {/* Method 4: Multi-Sensory */}
          <div className="method-card-enhanced multi-sensory">
            <div className="method-icon-large">🎨</div>
            <h3 className="method-title">Multi-Sensory</h3>
            <p className="method-description">
              Engage multiple senses by writing, speaking, and visualizing words
            </p>
            <div className="method-benefits">
              <span className="benefit-tag">✓ Interactive</span>
              <span className="benefit-tag">✓ Deep learning</span>
            </div>
            <button 
              className="method-btn-enhanced highlight"
              onClick={() => handleStartMethod('multi_sensory')}
            >
              <span className="btn-text">Start Practice</span>
              <span className="btn-arrow">→</span>
            </button>
          </div>

        </div>

        {/* Info Section */}
        <div className="dashboard-info-enhanced">
          <h4>💡 Choose the method that fits your learning style</h4>
          <p>
            Each method is designed to help you learn and retain Quranic vocabulary effectively.
            Mix and match methods for the best results!
          </p>
        </div>
      </div>
    </div>
  );
};

export default InteractiveLearningDashboard;
