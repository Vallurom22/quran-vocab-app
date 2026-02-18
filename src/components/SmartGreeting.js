import React, { useState, useEffect } from 'react';
import './SmartGreeting.css';

const SmartGreeting = ({ dueCount, onStartReview, onStartLearning, onDismiss, isPremium }) => {
  const [greeting, setGreeting] = useState('');
  const [timeOfDay, setTimeOfDay] = useState('');
  const [recommendation, setRecommendation] = useState({});

  useEffect(() => {
    generateGreeting();
  }, []);

  const generateGreeting = () => {
    const hour = new Date().getHours();
    let time = '';
    let greet = '';
    let rec = {};

    if (hour < 12) {
      time = 'morning';
      greet = '☀️ Good Morning!';
      rec = {
        icon: '🧠',
        title: 'Perfect Time for Review',
        description: 'Your brain is fresh and ready to reinforce memories',
        action: 'Start Morning Review',
        secondary: 'Learn New Words Instead'
      };
    } else if (hour < 17) {
      time = 'afternoon';
      greet = '🌤️ Good Afternoon!';
      rec = {
        icon: '📚',
        title: 'Great Time to Learn',
        description: 'Build new connections with fresh vocabulary',
        action: 'Learn New Words',
        secondary: 'Review Due Words'
      };
    } else {
      time = 'evening';
      greet = '🌙 Good Evening!';
      rec = {
        icon: '🎯',
        title: 'Time to Solidify',
        description: 'Test yourself with active recall before sleep',
        action: 'Review & Test',
        secondary: 'Quick Learning Session'
      };
    }

    setGreeting(greet);
    setTimeOfDay(time);
    setRecommendation(rec);
  };

  const getDaysInStreak = () => {
    const streak = parseInt(localStorage.getItem('learningStreak') || '0');
    return streak;
  };

  const getTodaySessions = () => {
    return parseInt(localStorage.getItem('session_count_today') || '0');
  };

  const streak = getDaysInStreak();
  const sessionsToday = getTodaySessions();

  return (
    <div className="smart-greeting-overlay">
      <div className="smart-greeting-modal">
        
        {/* Close button */}
        <button className="greeting-close" onClick={onDismiss}>✕</button>

        {/* Header with greeting */}
        <div className="greeting-header">
          <h1 className="greeting-title">{greeting}</h1>
          <p className="greeting-subtitle">Ready to strengthen your Quran vocabulary?</p>
        </div>

        {/* Stats Bar */}
        <div className="greeting-stats-bar">
          <div className="greeting-stat">
            <span className="stat-icon">⏰</span>
            <div className="stat-content">
              <span className="stat-number">{dueCount}</span>
              <span className="stat-label">Words Due</span>
            </div>
          </div>
          
          {streak > 0 && (
            <div className="greeting-stat">
              <span className="stat-icon">🔥</span>
              <div className="stat-content">
                <span className="stat-number">{streak}</span>
                <span className="stat-label">Day Streak</span>
              </div>
            </div>
          )}
          
          {sessionsToday > 0 && (
            <div className="greeting-stat">
              <span className="stat-icon">✓</span>
              <div className="stat-content">
                <span className="stat-number">{sessionsToday}</span>
                <span className="stat-label">Today</span>
              </div>
            </div>
          )}
        </div>

        {/* Main Recommendation Card */}
        <div className="recommendation-main">
          <div className="rec-icon-large">{recommendation.icon}</div>
          <h2 className="rec-title">{recommendation.title}</h2>
          <p className="rec-description">{recommendation.description}</p>
          
          {/* Primary Action */}
          <button 
            className="action-btn primary-action"
            onClick={timeOfDay === 'afternoon' ? onStartLearning : onStartReview}
          >
            <span className="action-text">{recommendation.action}</span>
            <span className="action-arrow">→</span>
          </button>

          {/* Secondary Action */}
          <button 
            className="action-btn secondary-action"
            onClick={timeOfDay === 'afternoon' ? onStartReview : onStartLearning}
          >
            {recommendation.secondary}
          </button>
        </div>

        {/* Quick Stats Preview */}
        <div className="quick-preview">
          <div className="preview-item">
            <span className="preview-icon">⚡</span>
            <span className="preview-text">
              {dueCount > 0 ? `${dueCount} words ready` : 'All caught up!'}
            </span>
          </div>
          <div className="preview-item">
            <span className="preview-icon">⏱️</span>
            <span className="preview-text">
              ~{Math.ceil(dueCount * 0.5)} min session
            </span>
          </div>
          <div className="preview-item">
            <span className="preview-icon">🎯</span>
            <span className="preview-text">
              {dueCount > 0 ? 'Build retention' : 'Stay sharp'}
            </span>
          </div>
        </div>

        {/* Learning Science Tip */}
        <div className="science-tip">
          <div className="tip-header">
            <span className="tip-icon">💡</span>
            <span className="tip-title">Did you know?</span>
          </div>
          <p className="tip-text">
            {timeOfDay === 'morning' && 
              "Reviewing within 24 hours of learning prevents 80% of forgetting. You're doing it right!"}
            {timeOfDay === 'afternoon' && 
              "Learning new material midday helps with long-term retention when combined with evening review."}
            {timeOfDay === 'evening' && 
              "Testing yourself before sleep helps consolidate memories during REM sleep."}
          </p>
        </div>

        {/* Dismiss Option */}
        <button className="btn-dismiss" onClick={onDismiss}>
          Maybe Later
        </button>

      </div>
    </div>
  );
};

export default SmartGreeting;