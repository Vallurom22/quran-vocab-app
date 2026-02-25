import React, { useState, useEffect } from 'react';
import './InteractiveLearningDashboard.css';
import { srsManager } from '../utils/SpacedRepetition';

// Import learning method components
import ActiveRecall from './ActiveRecall';
import MnemonicsStories from './MnemonicsStories';
import MultiSensoryLearning from './MultiSensoryLearning';
import Flashcard from './Flashcard';

const InteractiveLearningDashboard = ({ 
  words = [], 
  knownWords = [], 
  onClose, 
  onStartReview,
  onStartLearn,
  isPremium 
}) => {
  const [currentView, setCurrentView] = useState('overview');
  const [srsStats, setSrsStats] = useState({});
  const [dailyRoutine, setDailyRoutine] = useState({});
  const [timeOfDay, setTimeOfDay] = useState('morning');
  
  // NEW: State for active learning method
  const [activeMethod, setActiveMethod] = useState(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  useEffect(() => {
    loadStats();
    determineTimeOfDay();
    loadDailyRoutine();
  }, []);

  const loadStats = () => {
    const stats = srsManager.getStats();
    setSrsStats(stats);
  };

  const determineTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay('morning');
    else if (hour < 17) setTimeOfDay('midday');
    else setTimeOfDay('evening');
  };

  const loadDailyRoutine = () => {
    const routine = JSON.parse(localStorage.getItem('daily_routine') || '{}');
    setDailyRoutine(routine);
  };

  const markRoutineComplete = (session) => {
    const today = new Date().toDateString();
    const routine = { ...dailyRoutine };
    
    if (!routine[today]) {
      routine[today] = {};
    }
    
    routine[today][session] = true;
    setDailyRoutine(routine);
    localStorage.setItem('daily_routine', JSON.stringify(routine));
  };

  const isSessionComplete = (session) => {
    const today = new Date().toDateString();
    return dailyRoutine[today]?.[session] || false;
  };

  // SAFETY CHECK: Make sure words is an array
  const safeWords = Array.isArray(words) ? words : [];
  const safeKnownWords = Array.isArray(knownWords) ? knownWords : [];

  // Calculate learning metrics
  const totalWords = safeWords.length;
  const learnedCount = safeKnownWords.length;
  const progressPercent = totalWords > 0 ? ((learnedCount / totalWords) * 100).toFixed(0) : 0;
  const wordsToGo = totalWords - learnedCount;

  // Get recommendation based on time of day
  const getTimeBasedRecommendation = () => {
    const dueCount = srsStats.dueToday || 0;
    
    switch(timeOfDay) {
      case 'morning':
        return {
          title: '☀️ Good Morning!',
          subtitle: 'Best time for review',
          action: dueCount > 0 ? 'Review Words' : 'Learn New Words',
          description: dueCount > 0 
            ? `${dueCount} words are waiting for review` 
            : 'Start your day by learning something new',
          icon: '📚',
          type: dueCount > 0 ? 'review' : 'learn'
        };
      case 'midday':
        return {
          title: '🌤️ Afternoon Session',
          subtitle: 'Perfect for new learning',
          action: 'Learn with Stories',
          description: 'Create mnemonics and contextual connections',
          icon: '💡',
          type: 'mnemonic'
        };
      case 'evening':
        return {
          title: '🌙 Evening Practice',
          subtitle: 'Active recall time',
          action: 'Test Yourself',
          description: 'Strengthen what you learned today',
          icon: '🎯',
          type: 'test'
        };
      default:
        return {
          title: '👋 Welcome!',
          subtitle: 'Ready to learn',
          action: 'Start Learning',
          description: 'Begin your Quran vocabulary journey',
          icon: '📖',
          type: 'learn'
        };
    }
  };

  const recommendation = getTimeBasedRecommendation();

  // ========================================
  // LEARNING METHOD HANDLERS
  // ========================================

  const handleStartMethod = (methodType) => {
    setActiveMethod(methodType);
    setCurrentWordIndex(0);
  };

  const handleCloseMethod = () => {
    setActiveMethod(null);
    setCurrentWordIndex(0);
  };

  const handleNextWord = () => {
    if (currentWordIndex < safeWords.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
    }
  };

  const handlePreviousWord = () => {
    if (currentWordIndex > 0) {
      setCurrentWordIndex(currentWordIndex - 1);
    }
  };

  // ========================================
  // RENDER ACTIVE LEARNING METHOD
  // ========================================

  // If a learning method is active, show it instead of dashboard
  if (activeMethod === 'spaced-repetition') {
    return (
      <Flashcard
        word={safeWords[currentWordIndex]}
        onNext={handleNextWord}
        onPrevious={handlePreviousWord}
        onKnow={(wordId) => {/* mark as known */}}
        current={currentWordIndex + 1}
        total={safeWords.length}
        relatedWords={safeWords.filter(w => w.root === safeWords[currentWordIndex]?.root)}
        onClose={handleCloseMethod}
      />
    );
  }

  if (activeMethod === 'mnemonics') {
    return (
      <MnemonicsStories
        words={safeWords}
        onClose={handleCloseMethod}
      />
    );
  }

  if (activeMethod === 'active-recall') {
    return (
      <ActiveRecall
        words={safeWords}
        onClose={handleCloseMethod}
        knownWords={safeKnownWords}
      />
    );
  }

  if (activeMethod === 'multi-sensory') {
    return (
      <MultiSensoryLearning
        word={safeWords[currentWordIndex]}
        onClose={handleCloseMethod}
        onNext={handleNextWord}
      />
    );
  }

  // ========================================
  // MAIN DASHBOARD RENDER
  // ========================================

  return (
    <div className="learning-dashboard-overlay">
      <div className="learning-dashboard-modal">
        
        {/* Header */}
        <div className="dashboard-header">
          <button className="close-dashboard" onClick={onClose}>✕</button>
          <h2>🧠 Learning Dashboard</h2>
          <div className="header-tabs">
            <button 
              className={currentView === 'overview' ? 'tab active' : 'tab'}
              onClick={() => setCurrentView('overview')}
            >
              Overview
            </button>
            <button 
              className={currentView === 'routine' ? 'tab active' : 'tab'}
              onClick={() => setCurrentView('routine')}
            >
              Daily Routine
            </button>
            <button 
              className={currentView === 'progress' ? 'tab active' : 'tab'}
              onClick={() => setCurrentView('progress')}
            >
              Progress
            </button>
          </div>
        </div>

        {/* OVERVIEW TAB */}
        {currentView === 'overview' && (
          <div className="dashboard-content">
            
            {/* Time-based Recommendation */}
            <div className="recommendation-card">
              <div className="rec-header">
                <h3>{recommendation.title}</h3>
                <p className="rec-subtitle">{recommendation.subtitle}</p>
              </div>
              <div className="rec-body">
                <div className="rec-icon">{recommendation.icon}</div>
                <div className="rec-info">
                  <h4>{recommendation.action}</h4>
                  <p>{recommendation.description}</p>
                </div>
              </div>
              <button 
                className="rec-action-btn"
                onClick={() => {
                  if (recommendation.type === 'review') handleStartMethod('spaced-repetition');
                  else if (recommendation.type === 'mnemonic') handleStartMethod('mnemonics');
                  else if (recommendation.type === 'test') handleStartMethod('active-recall');
                  else if (recommendation.type === 'learn' && onStartLearn) onStartLearn();
                }}
              >
                Start Now →
              </button>
            </div>

            {/* Quick Stats Grid */}
            <div className="quick-stats-grid">
              <div className="stat-card due">
                <div className="stat-icon">⏰</div>
                <div className="stat-value">{srsStats.dueToday || 0}</div>
                <div className="stat-label">Due Today</div>
                {srsStats.dueToday > 0 && (
                  <button 
                    className="stat-action" 
                    onClick={() => handleStartMethod('spaced-repetition')}
                  >
                    Review Now
                  </button>
                )}
              </div>

              <div className="stat-card learning">
                <div className="stat-icon">📖</div>
                <div className="stat-value">{srsStats.learning || 0}</div>
                <div className="stat-label">Learning</div>
                <div className="stat-hint">{'< 1 week old'}</div>
              </div>

              <div className="stat-card mature">
                <div className="stat-icon">🌟</div>
                <div className="stat-value">{srsStats.mature || 0}</div>
                <div className="stat-label">Mastered</div>
                <div className="stat-hint">{'> 1 month'}</div>
              </div>

              <div className="stat-card total">
                <div className="stat-icon">📊</div>
                <div className="stat-value">{learnedCount}</div>
                <div className="stat-label">Total Learned</div>
                <div className="stat-hint">{progressPercent}% complete</div>
              </div>
            </div>

            {/* Learning Method Cards */}
            <div className="methods-section">
              <h3>🎓 Learning Methods</h3>
              
              {/* Spaced Repetition */}
              <div className="method-card">
                <div className="method-icon">🔄</div>
                <div className="method-content">
                  <h4>Spaced Repetition</h4>
                  <p>Review words at optimal intervals before you forget them</p>
                  <div className="method-stats">
                    <span>✓ Boosts retention by 80%</span>
                    <span>✓ Schedules: 1d → 3d → 1w → 1m</span>
                  </div>
                </div>
                <button 
                  className="method-btn" 
                  onClick={() => handleStartMethod('spaced-repetition')}
                >
                  Start
                </button>
              </div>

              {/* Mnemonics & Stories */}
              <div className="method-card">
                <div className="method-icon">💭</div>
                <div className="method-content">
                  <h4>Mnemonics & Stories</h4>
                  <p>Link words to vivid images and memorable stories</p>
                  <div className="method-stats">
                    <span>✓ 2x better recall</span>
                    <span>✓ Visual + emotional memory</span>
                  </div>
                </div>
                <button 
                  className="method-btn"
                  onClick={() => handleStartMethod('mnemonics')}
                >
                  Create
                </button>
              </div>

              {/* Active Recall */}
              <div className="method-card">
                <div className="method-icon">🎯</div>
                <div className="method-content">
                  <h4>Active Recall</h4>
                  <p>Test yourself without looking at answers</p>
                  <div className="method-stats">
                    <span>✓ 50% better recall</span>
                    <span>✓ Strengthens neural pathways</span>
                  </div>
                </div>
                <button 
                  className="method-btn"
                  onClick={() => handleStartMethod('active-recall')}
                >
                  Practice
                </button>
              </div>

              {/* Multi-Sensory */}
              <div className="method-card">
                <div className="method-icon">🎨</div>
                <div className="method-content">
                  <h4>Multi-Sensory Learning</h4>
                  <p>Write, speak, listen, and draw</p>
                  <div className="method-stats">
                    <span>✓ Engages 4 types of memory</span>
                    <span>✓ Deeper retention</span>
                  </div>
                </div>
                <button 
                  className="method-btn"
                  onClick={() => handleStartMethod('multi-sensory')}
                >
                  Practice
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DAILY ROUTINE TAB */}
        {currentView === 'routine' && (
          <div className="dashboard-content">
            <div className="routine-intro">
              <h3>🌅 Your Daily Learning Routine</h3>
              <p>Follow this science-backed schedule for maximum retention</p>
            </div>

            {/* Morning Session */}
            <div className={`routine-session ${isSessionComplete('morning') ? 'completed' : ''}`}>
              <div className="session-time">
                <div className="time-icon">☀️</div>
                <div className="time-info">
                  <h4>Morning (6-11 AM)</h4>
                  <p>Best time for review</p>
                </div>
                {isSessionComplete('morning') && <div className="check-icon">✓</div>}
              </div>
              
              <div className="session-tasks">
                <div className="task">
                  <span className="task-icon">🔄</span>
                  <div className="task-content">
                    <h5>Review 5-10 Spaced Repetition Words</h5>
                    <p>Review words that are due today based on the forgetting curve</p>
                  </div>
                  <button 
                    className="task-btn" 
                    onClick={() => {
                      handleStartMethod('spaced-repetition');
                      markRoutineComplete('morning');
                    }}
                  >
                    Start Review
                  </button>
                </div>
              </div>
            </div>

            {/* Midday Session */}
            <div className={`routine-session ${isSessionComplete('midday') ? 'completed' : ''}`}>
              <div className="session-time">
                <div className="time-icon">🌤️</div>
                <div className="time-info">
                  <h4>Midday (12-4 PM)</h4>
                  <p>Create connections</p>
                </div>
                {isSessionComplete('midday') && <div className="check-icon">✓</div>}
              </div>
              
              <div className="session-tasks">
                <div className="task">
                  <span className="task-icon">💭</span>
                  <div className="task-content">
                    <h5>Create Mnemonics & Mini-Stories</h5>
                    <p>Link 3-5 new words with vivid imagery and personal stories</p>
                  </div>
                  <button 
                    className="task-btn"
                    onClick={() => {
                      handleStartMethod('mnemonics');
                      markRoutineComplete('midday');
                    }}
                  >
                    Create Stories
                  </button>
                </div>

                <div className="task">
                  <span className="task-icon">📚</span>
                  <div className="task-content">
                    <h5>Themed Clustering</h5>
                    <p>Learn 5 words from the same theme (e.g., food, family)</p>
                  </div>
                  <button 
                    className="task-btn"
                    onClick={() => handleStartMethod('multi-sensory')}
                  >
                    Choose Theme
                  </button>
                </div>
              </div>
            </div>

            {/* Evening Session */}
            <div className={`routine-session ${isSessionComplete('evening') ? 'completed' : ''}`}>
              <div className="session-time">
                <div className="time-icon">🌙</div>
                <div className="time-info">
                  <h4>Evening (5-9 PM)</h4>
                  <p>Active practice</p>
                </div>
                {isSessionComplete('evening') && <div className="check-icon">✓</div>}
              </div>
              
              <div className="session-tasks">
                <div className="task">
                  <span className="task-icon">🎯</span>
                  <div className="task-content">
                    <h5>Active Recall Test</h5>
                    <p>Cover and say words aloud without looking</p>
                  </div>
                  <button 
                    className="task-btn"
                    onClick={() => {
                      handleStartMethod('active-recall');
                      markRoutineComplete('evening');
                    }}
                  >
                    Start Test
                  </button>
                </div>

                <div className="task">
                  <span className="task-icon">🗣️</span>
                  <div className="task-content">
                    <h5>Speak & Listen</h5>
                    <p>Say 5 words aloud and listen to native pronunciation</p>
                  </div>
                  <button 
                    className="task-btn"
                    onClick={() => handleStartMethod('multi-sensory')}
                  >
                    Practice
                  </button>
                </div>
              </div>
            </div>

            {/* Anytime Tasks */}
            <div className="routine-session anytime">
              <div className="session-time">
                <div className="time-icon">⚡</div>
                <div className="time-info">
                  <h4>Anytime</h4>
                  <p>Quick practice</p>
                </div>
              </div>
              
              <div className="session-tasks">
                <div className="task">
                  <span className="task-icon">🏠</span>
                  <div className="task-content">
                    <h5>Label Household Items</h5>
                    <p>Put Arabic labels on 5 items in your home</p>
                  </div>
                </div>

                <div className="task">
                  <span className="task-icon">🎧</span>
                  <div className="task-content">
                    <h5>Background Listening</h5>
                    <p>Listen to Quran recitation while doing other tasks</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Routine Stats */}
            <div className="routine-stats">
              <h4>📈 This Week's Progress</h4>
              <div className="week-calendar">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
                  <div key={idx} className="day-cell">
                    <div className="day-label">{day}</div>
                    <div className="day-indicator">
                      <span className="session-dot morning">•</span>
                      <span className="session-dot midday">•</span>
                      <span className="session-dot evening">•</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PROGRESS TAB - Keep existing code */}
        {currentView === 'progress' && (
          <div className="dashboard-content">
            
            {/* Overall Progress */}
            <div className="progress-overview">
              <h3>📊 Your Learning Journey</h3>
              
              <div className="progress-circle-container">
                <svg className="progress-circle" viewBox="0 0 200 200">
                  <circle
                    cx="100"
                    cy="100"
                    r="85"
                    fill="none"
                    stroke="#e0e0e0"
                    strokeWidth="15"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="85"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="15"
                    strokeDasharray={`${progressPercent * 5.34} 534`}
                    strokeLinecap="round"
                    transform="rotate(-90 100 100)"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#0d7377" />
                      <stop offset="100%" stopColor="#14ffec" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="progress-text">
                  <span className="progress-percent">{progressPercent}%</span>
                  <span className="progress-label">Complete</span>
                </div>
              </div>

              <div className="progress-details">
                <div className="detail-item">
                  <span className="detail-label">Words Learned:</span>
                  <span className="detail-value">{learnedCount} / {totalWords}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Words Remaining:</span>
                  <span className="detail-value">{wordsToGo}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Total Reviews:</span>
                  <span className="detail-value">{srsStats.totalReviews || 0}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Average Ease:</span>
                  <span className="detail-value">{srsStats.averageEase || '2.50'}</span>
                </div>
              </div>
            </div>

            {/* Learning Stages */}
            <div className="learning-stages">
              <h4>📈 Learning Stages</h4>
              
              <div className="stage-bar">
                <div className="stage new">
                  <div className="stage-fill" style={{ width: '25%' }}></div>
                  <div className="stage-info">
                    <span className="stage-label">New</span>
                    <span className="stage-count">0</span>
                  </div>
                </div>
                <div className="stage learning">
                  <div className="stage-fill" style={{ width: '60%' }}></div>
                  <div className="stage-info">
                    <span className="stage-label">Learning</span>
                    <span className="stage-count">{srsStats.learning || 0}</span>
                  </div>
                </div>
                <div className="stage young">
                  <div className="stage-fill" style={{ width: '40%' }}></div>
                  <div className="stage-info">
                    <span className="stage-label">Young</span>
                    <span className="stage-count">{srsStats.dueSoon || 0}</span>
                  </div>
                </div>
                <div className="stage mature">
                  <div className="stage-fill" style={{ width: '80%' }}></div>
                  <div className="stage-info">
                    <span className="stage-label">Mature</span>
                    <span className="stage-count">{srsStats.mature || 0}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="achievements-section">
              <h4>🏆 Achievements</h4>
              <div className="achievements-grid">
                <div className={`achievement ${learnedCount >= 10 ? 'unlocked' : 'locked'}`}>
                  <div className="achievement-icon">🌱</div>
                  <div className="achievement-name">First Steps</div>
                  <div className="achievement-desc">Learn 10 words</div>
                </div>
                <div className={`achievement ${learnedCount >= 50 ? 'unlocked' : 'locked'}`}>
                  <div className="achievement-icon">📚</div>
                  <div className="achievement-name">Dedicated Learner</div>
                  <div className="achievement-desc">Learn 50 words</div>
                </div>
                <div className={`achievement ${learnedCount >= 100 ? 'unlocked' : 'locked'}`}>
                  <div className="achievement-icon">⭐</div>
                  <div className="achievement-name">Century Club</div>
                  <div className="achievement-desc">Learn 100 words</div>
                </div>
                <div className={`achievement ${srsStats.mature >= 25 ? 'unlocked' : 'locked'}`}>
                  <div className="achievement-icon">🎓</div>
                  <div className="achievement-name">Master</div>
                  <div className="achievement-desc">Master 25 words</div>
                </div>
              </div>
            </div>

            {/* Learning Tips */}
            <div className="tips-section">
              <h4>💡 Learning Science Tips</h4>
              <div className="tip-card">
                <div className="tip-icon">🧠</div>
                <div className="tip-content">
                  <h5>Why Spaced Repetition Works</h5>
                  <p>Your brain strengthens memories each time you recall them. By reviewing just before you forget, you create stronger neural pathways with less total study time.</p>
                </div>
              </div>
              <div className="tip-card">
                <div className="tip-icon">💭</div>
                <div className="tip-content">
                  <h5>The Power of Mnemonics</h5>
                  <p>Linking new information to vivid mental images activates your visual cortex and amygdala (emotion center), creating memories 2x stronger than rote repetition.</p>
                </div>
              </div>
              <div className="tip-card">
                <div className="tip-icon">🎯</div>
                <div className="tip-content">
                  <h5>Active Recall vs Passive Review</h5>
                  <p>Testing yourself (active recall) is 50% more effective than re-reading. Your brain works harder to retrieve the answer, strengthening the memory pathway.</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default InteractiveLearningDashboard;

