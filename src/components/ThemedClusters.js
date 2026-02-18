import React, { useState } from 'react';
import './ThemedClusters.css';

const ThemedClusters = ({ words, onSelectCluster, onClose, isPremium }) => {
  const [selectedTheme, setSelectedTheme] = useState(null);

  // Define themed learning paths
  const themes = [
    {
      id: 'divine-names',
      title: '99 Names of Allah',
      icon: '🌟',
      description: 'Learn the beautiful names of Allah',
      wordCount: 99,
      color: '#9775fa',
      difficulty: 'Medium',
      estimatedTime: '2 hours',
      premium: true,
      categories: ['Divine Names']
    },
    {
      id: 'worship',
      title: 'Acts of Worship',
      icon: '🕌',
      description: 'Prayer, fasting, zakat, and hajj',
      wordCount: 25,
      color: '#0d7377',
      difficulty: 'Beginner',
      estimatedTime: '30 min',
      premium: false,
      categories: ['Worship', 'Faith']
    },
    {
      id: 'prophets',
      title: 'Prophets & Messengers',
      icon: '📜',
      description: 'Names and stories of the prophets',
      wordCount: 30,
      color: '#4dabf7',
      difficulty: 'Beginner',
      estimatedTime: '45 min',
      premium: false,
      categories: ['Prophets']
    },
    {
      id: 'nature',
      title: 'Nature & Creation',
      icon: '🌍',
      description: 'Sky, earth, mountains, seas, and animals',
      wordCount: 40,
      color: '#51cf66',
      difficulty: 'Beginner',
      estimatedTime: '1 hour',
      premium: false,
      categories: ['Creation', 'Nature']
    },
    {
      id: 'moral-values',
      title: 'Moral Values',
      icon: '💎',
      description: 'Patience, gratitude, honesty, and justice',
      wordCount: 35,
      color: '#ffc107',
      difficulty: 'Medium',
      estimatedTime: '45 min',
      premium: false,
      categories: ['Moral Qualities']
    },
    {
      id: 'afterlife',
      title: 'Day of Judgment',
      icon: '⚖️',
      description: 'Paradise, hell, judgment, and resurrection',
      wordCount: 30,
      color: '#ff6b6b',
      difficulty: 'Medium',
      estimatedTime: '45 min',
      premium: false,
      categories: ['Afterlife']
    },
    {
      id: 'daily-life',
      title: 'Daily Life',
      icon: '🏠',
      description: 'Family, food, clothing, and household',
      wordCount: 45,
      color: '#ff9800',
      difficulty: 'Beginner',
      estimatedTime: '1 hour',
      premium: true,
      categories: ['Common Nouns']
    },
    {
      id: 'emotions',
      title: 'Emotions & Feelings',
      icon: '❤️',
      description: 'Love, fear, hope, and happiness',
      wordCount: 25,
      color: '#e91e63',
      difficulty: 'Beginner',
      estimatedTime: '30 min',
      premium: true,
      categories: ['Emotions']
    }
  ];

  const getWordsForTheme = (theme) => {
    return words.filter(word => 
      theme.categories.some(cat => word.category === cat)
    ).slice(0, theme.wordCount);
  };

  const handleSelectTheme = (theme) => {
    if (theme.premium && !isPremium) {
      alert('🔒 This themed cluster requires Premium. Upgrade to unlock!');
      return;
    }

    const themeWords = getWordsForTheme(theme);
    
    if (themeWords.length === 0) {
      alert('No words available for this theme yet.');
      return;
    }

    onSelectCluster(themeWords, theme);
    onClose();
  };

  const handleViewDetails = (theme) => {
    setSelectedTheme(theme);
  };

  if (selectedTheme) {
    const themeWords = getWordsForTheme(selectedTheme);
    
    return (
      <div className="themed-clusters-overlay">
        <div className="themed-clusters-modal large">
          <button className="close-themed" onClick={() => setSelectedTheme(null)}>✕</button>
          
          <div className="theme-detail-header" style={{ background: selectedTheme.color }}>
            <div className="theme-icon-large">{selectedTheme.icon}</div>
            <h2>{selectedTheme.title}</h2>
            <p>{selectedTheme.description}</p>
          </div>

          <div className="theme-detail-content">
            <div className="theme-stats">
              <div className="stat-item">
                <span className="stat-label">Words:</span>
                <span className="stat-value">{themeWords.length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Difficulty:</span>
                <span className="stat-value">{selectedTheme.difficulty}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Time:</span>
                <span className="stat-value">{selectedTheme.estimatedTime}</span>
              </div>
            </div>

            <div className="word-preview-section">
              <h3>📚 Words in this cluster:</h3>
              <div className="word-preview-grid">
                {themeWords.slice(0, 12).map(word => (
                  <div key={word.id} className="word-preview-card">
                    <div className="word-preview-arabic">{word.arabic}</div>
                    <div className="word-preview-meaning">{word.meaning}</div>
                  </div>
                ))}
                {themeWords.length > 12 && (
                  <div className="word-preview-card more">
                    <div className="more-count">+{themeWords.length - 12}</div>
                    <div className="more-text">more words</div>
                  </div>
                )}
              </div>
            </div>

            <div className="learning-path">
              <h3>🎯 Learning Path:</h3>
              <ol className="learning-steps">
                <li>Browse all {themeWords.length} words in this theme</li>
                <li>Practice with flashcards</li>
                <li>Create mnemonics for difficult words</li>
                <li>Test yourself with a quiz</li>
                <li>Review using spaced repetition</li>
              </ol>
            </div>

            <button 
              className="btn-start-theme"
              style={{ background: selectedTheme.color }}
              onClick={() => handleSelectTheme(selectedTheme)}
            >
              🚀 Start Learning
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="themed-clusters-overlay">
      <div className="themed-clusters-modal">
        
        <div className="themed-header">
          <button className="close-themed" onClick={onClose}>✕</button>
          <h2>📚 Themed Learning Paths</h2>
          <p>Organized clusters for focused learning</p>
        </div>

        <div className="themes-grid">
          {themes.map(theme => {
            const themeWords = getWordsForTheme(theme);
            const isLocked = theme.premium && !isPremium;

            return (
              <div 
                key={theme.id} 
                className={`theme-card ${isLocked ? 'locked' : ''}`}
                style={{ borderColor: theme.color }}
              >
                {isLocked && <div className="lock-overlay">🔒</div>}
                
                <div className="theme-card-header" style={{ background: theme.color }}>
                  <div className="theme-icon">{theme.icon}</div>
                  {theme.premium && <span className="premium-badge">PREMIUM</span>}
                </div>

                <div className="theme-card-body">
                  <h3>{theme.theme}</h3>
                  <p className="theme-description">{theme.description}</p>

                  <div className="theme-meta">
                    <div className="meta-item">
                      <span className="meta-icon">📝</span>
                      <span>{themeWords.length} words</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-icon">⏱️</span>
                      <span>{theme.estimatedTime}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-icon">📊</span>
                      <span>{theme.difficulty}</span>
                    </div>
                  </div>
                </div>

                <div className="theme-card-actions">
                  <button 
                    className="btn-view-details"
                    onClick={() => handleViewDetails(theme)}
                    disabled={isLocked}
                  >
                    👁️ View Details
                  </button>
                  <button 
                    className="btn-start-cluster"
                    onClick={() => handleSelectTheme(theme)}
                    style={{ background: isLocked ? '#ccc' : theme.color }}
                    disabled={isLocked}
                  >
                    {isLocked ? '🔒 Locked' : '🚀 Start'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="themed-footer">
          <p className="learning-tip">
            💡 <strong>Tip:</strong> Learning words by theme improves retention by creating contextual connections!
          </p>
        </div>

      </div>
    </div>
  );
};

export default ThemedClusters;