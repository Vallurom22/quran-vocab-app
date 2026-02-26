import React, { useState, useEffect, useRef } from 'react';
import './LandingPage.css';

const LandingPage = ({ onStart, totalWords, knownWords }) => {
  const [isVisible, setIsVisible] = useState(false);
  const isProcessingRef = useRef(false);
  const videoRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
    
    // Ensure video plays on mobile
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log('Video autoplay failed:', error);
      });
    }
  }, []);

  const progressPercentage = Math.round((knownWords / totalWords) * 100);

  const handleStart = (e) => {
    if (isProcessingRef.current) {
      return;
    }
    
    isProcessingRef.current = true;
    
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    onStart();
    
    setTimeout(() => {
      isProcessingRef.current = false;
    }, 1000);
  };

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
      {/* Rest of your content (unchanged) */}
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
            <span className="title-line-1">Kalima - Quarnic Vocabulary</span>
            <span className="title-line-2">Start building your Arabic vocabulary today!!</span>
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle">
            <span style={{ 
              fontSize: '20px', 
              fontWeight: 600, 
              display: 'block', 
              marginBottom: '12px',
              color: '#14ffec'
            }}>
              إِنَّا أَنزَلْنَاهُ قُرْآنًا عَرَبِيًّا لَّعَلَّكُمْ تَعْقِلُونَ
            </span>
            <span style={{ 
              fontSize: '15px', 
              display: 'block', 
              marginBottom: '16px',
              opacity: 0.9,
              fontStyle: 'italic'
            }}>
              "Indeed, We have sent it down as an Arabic Qur'an that you might understand."
            </span>
            <span style={{ fontSize: '13px', opacity: 0.7 }}>— Surah Yusuf (12:2)</span>
            <br /><br />
            <span className="subtitle-highlight">
              ✨ Learn Arabic and understand the Quran more deeply by growing your vocabulary in a simple, effective way.✨
            </span>
          </p>

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

          <button 
            className="hero-cta" 
            onClick={handleStart}
            onTouchEnd={(e) => e.preventDefault()}
            style={{
              touchAction: 'manipulation',
              userSelect: 'none',
              WebkitTouchCallout: 'none',
              WebkitTapHighlightColor: 'transparent'
            }}
          >
            <span className="cta-text">{knownWords > 0 ? 'Continue Learning' : 'Start Learning Free'}</span>
            <span className="cta-icon">→</span>
          </button>

          {/* Quick Stats */}
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-icon">📚</div>
              <div className="stat-number">500</div>
              <div className="stat-label">Free Words</div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">⭐</div>
              <div className="stat-number">+1500 words</div>
              <div className="stat-label">Premium Version Coming Soon</div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">🎯</div>
              <div className="stat-number">4</div>
              <div className="stat-label">Study Modes</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="landing-features">
        <div className="features-container">
          <h2 className="features-title">“What if learning Arabic could finally feel simple, meaningful, and built around real vocabulary growth?”</h2>
          
          <div className="features-grid">
            {/* Feature 1 */}
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">📖</div>
              </div>
              <h3 className="feature-title">Understand the Quran Directly</h3>
              <p className="feature-description">
                Learn the actual words used in the Quran. Understand Allah's message in its original language without translation
              </p>
            </div>

            {/* Feature 2 */}
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">🎴</div>
              </div>
              <h3 className="feature-title">Interactive Learning</h3>
              <p className="feature-description">
                Flashcards, quizzes, and spaced repetition help you memorize and retain words naturally
              </p>
            </div>

            {/* Feature 3 */}
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">🌳</div>
              </div>
              <h3 className="feature-title">Root Word System</h3>
              <p className="feature-description">
                Discover how Arabic words connect through trilateral roots - understand one root, unlock dozens of words
              </p>
            </div>

            {/* Feature 4 */}
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">💯</div>
              </div>
              <h3 className="feature-title">100% Free Core Features</h3>
              <p className="feature-description">
                1000+ essential words, flashcards, quizzes, and progress tracking - completely free forever
              </p>
            </div>

            {/* Feature 5 */}
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">⭐</div>
              </div>
              <h3 className="feature-title">Premium Coming Soon</h3>
              <p className="feature-description">
                1000+ advanced words, grammar lessons, pronunciation guides, and more - stay tuned!
              </p>
            </div>

            {/* Feature 6 */}
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">📊</div>
              </div>
              <h3 className="feature-title">Track Your Progress</h3>
              <p className="feature-description">
                Beautiful analytics show your journey from beginner to understanding the Quran in Arabic
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="landing-how-it-works">
        <div className="how-it-works-container">
          <h2 className="how-it-works-title">Your Journey to Understanding the Quran</h2>
          
          <div className="steps-timeline">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Start with Essential Words</h3>
                <p>Begin with the 1000+ most frequent words in the Quran - these cover over 70% of the text you'll encounter</p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Learn Through Context</h3>
                <p>See each word in actual Quranic verses. Understand how Allah uses these words to convey His message</p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Practice & Memorize</h3>
                <p>Use flashcards and quizzes designed to help you retain vocabulary long-term, not just for a test</p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Experience Understanding</h3>
                <p>Feel the joy of recognizing words during Salah and understanding verses without translation</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="landing-final-cta">
        <div className="final-cta-content">
          <h2 className="final-cta-title">Begin Understanding Allah's Words Today</h2>
          <p className="final-cta-subtitle">
            Join thousands of Muslims worldwide learning to read and understand the Quran in Arabic
            <br />
            <strong style={{ color: '#14ffec', marginTop: '8px', display: 'block' }}>
              Get Started Free • No Commitment • Learn Right Away
            </strong>
          </p>
          <button 
            className="final-cta-button" 
            onClick={handleStart}
            onTouchEnd={(e) => e.preventDefault()}
            style={{
              touchAction: 'manipulation',
              userSelect: 'none'
            }}
          >
            <span>Start Learning Today</span>
            <span className="button-arrow">→</span>
          </button>
        </div>
      </div>

      <button 
        className="skip-landing" 
        onClick={handleStart}
        onTouchEnd={(e) => e.preventDefault()}
        style={{
          touchAction: 'manipulation',
          userSelect: 'none'
        }}
      >
        Skip Introduction →
      </button>
    </div>
  );
};

export default LandingPage;