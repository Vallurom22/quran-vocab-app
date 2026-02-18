import React, { useState, useEffect } from 'react';
import './LandingPage.css';

const LandingPage = ({ onStart, totalWords, knownWords }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const progressPercentage = Math.round((knownWords / totalWords) * 100);

  return (
    <div className={`landing-page ${isVisible ? 'visible' : ''}`}>
      {/* Animated Background */}
      <div className="landing-bg">
        <div className="floating-stars">
          <span className="star">✦</span>
          <span className="star">✦</span>
          <span className="star">✦</span>
          <span className="star">✦</span>
          <span className="star">✦</span>
        </div>
        <div className="floating-crescents">
          <span className="crescent">☾</span>
          <span className="crescent">☾</span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="landing-hero">
        <div className="hero-content">
          {/* Animated Logo */}
          <div className="hero-logo">
            <div className="logo-circle">
              <span className="logo-icon">🕌</span>
            </div>
            <div className="logo-glow"></div>
          </div>

          {/* Title with Animation */}
          <h1 className="hero-title">
            <span className="title-line-1">Quran Vocabulary</span>
            <span className="title-line-2">Master 500 Essential Arabic Words</span>
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle">
            Learn Arabic through the beauty of the Quran
            <br />
            <span className="subtitle-highlight">✨ Free • Interactive • Engaging ✨</span>
          </p>

          {/* Progress Preview (if user has started) */}
          {knownWords > 0 && (
            <div className="hero-progress-preview">
              <div className="progress-preview-card">
                <div className="progress-circle-mini">
                  <svg viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" className="progress-bg-circle" />
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="45" 
                      className="progress-fill-circle"
                      style={{
                        strokeDasharray: `${progressPercentage * 2.827}, 282.7`
                      }}
                    />
                  </svg>
                  <div className="progress-text-mini">{progressPercentage}%</div>
                </div>
                <div className="progress-preview-text">
                  <strong>{knownWords} words learned</strong>
                  <span>Continue your journey!</span>
                </div>
              </div>
            </div>
          )}

          {/* CTA Button */}
          <button className="hero-cta" onClick={onStart}>
            <span className="cta-text">{knownWords > 0 ? 'Continue Learning' : 'Start Learning'}</span>
            <span className="cta-icon">→</span>
          </button>

          {/* Quick Stats */}
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-icon">📚</div>
              <div className="stat-number">500</div>
              <div className="stat-label">Words</div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">🎯</div>
              <div className="stat-number">4</div>
              <div className="stat-label">Modes</div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">⚡</div>
              <div className="stat-number">Free</div>
              <div className="stat-label">Forever</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="landing-features">
        <div className="features-container">
          <h2 className="features-title">Why Learn With Us?</h2>
          
          <div className="features-grid">
            {/* Feature 1 */}
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">📖</div>
              </div>
              <h3 className="feature-title">Quranic Context</h3>
              <p className="feature-description">
                Every word comes with examples from the Quran, showing real usage and meaning
              </p>
            </div>

            {/* Feature 2 */}
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">🎴</div>
              </div>
              <h3 className="feature-title">Interactive Flashcards</h3>
              <p className="feature-description">
                Engaging flashcard system helps you memorize words faster and retain them longer
              </p>
            </div>

            {/* Feature 3 */}
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">🎯</div>
              </div>
              <h3 className="feature-title">Quiz Yourself</h3>
              <p className="feature-description">
                Test your knowledge with fun quizzes and track your progress over time
              </p>
            </div>

            {/* Feature 4 */}
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">🌳</div>
              </div>
              <h3 className="feature-title">Root Explorer</h3>
              <p className="feature-description">
                Discover word families and understand the beautiful structure of Arabic
              </p>
            </div>

            {/* Feature 5 */}
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">📊</div>
              </div>
              <h3 className="feature-title">Track Progress</h3>
              <p className="feature-description">
                Beautiful dashboard shows your learning journey with stats and achievements
              </p>
            </div>

            {/* Feature 6 */}
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">🌙</div>
              </div>
              <h3 className="feature-title">Beautiful Design</h3>
              <p className="feature-description">
                Ramadan-themed interface with peaceful colors and smooth animations
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="landing-how-it-works">
        <div className="how-it-works-container">
          <h2 className="how-it-works-title">How It Works</h2>
          
          <div className="steps-timeline">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Browse Words</h3>
                <p>Explore 500 carefully selected Quranic words organized by category</p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Study & Learn</h3>
                <p>Use flashcards, see examples, and explore root word families</p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Test Yourself</h3>
                <p>Take quizzes and review words to reinforce your learning</p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Track Progress</h3>
                <p>Watch your vocabulary grow and celebrate milestones</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="landing-final-cta">
        <div className="final-cta-content">
          <h2 className="final-cta-title">Ready to Begin Your Journey?</h2>
          <p className="final-cta-subtitle">
            Join thousands learning Quranic Arabic
          </p>
          <button className="final-cta-button" onClick={onStart}>
            <span>Start Learning Now</span>
            <span className="button-arrow">→</span>
          </button>
        </div>
      </div>

      {/* Skip Button */}
      <button className="skip-landing" onClick={onStart}>
        Skip Introduction →
      </button>
    </div>
  );
};

export default LandingPage;