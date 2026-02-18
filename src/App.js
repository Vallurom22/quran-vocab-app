import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import { getWordDatabase } from './data/ExpandedWordDatabase';
import { usePremiumStatus, simulatePremiumPurchase } from './utils/StripeIntegration';
import WordContextPremium from './components/WordContextPremium';
import PricingPage from './components/PricingPage';
import WordCard from './components/WordCard';
import Flashcard from './components/Flashcard';
import Quiz from './components/Quiz';
import DailyWord from './components/DailyWord';
import Review from './components/Review';
import LearningDashboard from './components/InteractiveLearningDashboard';
import LandingPage from './components/LandingPage';
import MultiSensoryLearning from './components/MultiSensoryLearning';
import ThemedClusters from './components/ThemedClusters';


import {
  secureStorage,
  isValidWordId,
  isValidWordIdArray,
  isValidStreak,
  sanitizeText,
  createRateLimiter,
  safeExecute
} from './utils/SecurityUtils';

function App() {
  const isPremium = usePremiumStatus();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [mode, setMode] = useState('browse');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [selectedRoot, setSelectedRoot] = useState(null);
  const [showRootExplorer, setShowRootExplorer] = useState(false);
  const [selectedWord, setSelectedWord] = useState(null);
  const [selectedWordIndex, setSelectedWordIndex] = useState(0);
  const [showMultiSensory, setShowMultiSensory] = useState(false);
const [multiSensoryWord, setMultiSensoryWord] = useState(null);
const [showThemedClusters, setShowThemedClusters] = useState(false);
const [activeCluster, setActiveCluster] = useState(null);
  
  const [showLanding, setShowLanding] = useState(() => {
    const hasVisited = secureStorage.get('hasVisited', false, (val) => typeof val === 'boolean');
    return !hasVisited;
  });
  
  const [showDailyWord, setShowDailyWord] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showWordContext, setShowWordContext] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  
  const [knownWords, setKnownWords] = useState(() => {
    return secureStorage.get('knownWords', [], isValidWordIdArray);
  });
  
  const [darkMode, setDarkMode] = useState(() => {
    return secureStorage.get('darkMode', false, (val) => typeof val === 'boolean');
  });
  
  const [streak, setStreak] = useState(() => {
    return secureStorage.get('learningStreak', 0, isValidStreak);
  });

  const validatedWords = getWordDatabase(isPremium);
  const storageRateLimiter = createRateLimiter(1000);
  const categories = ['All', ...new Set(validatedWords.map(w => w.category))];

  const handleMarkAsKnown = useCallback((wordId) => {
    safeExecute(() => {
      if (!isValidWordId(wordId)) return;
      const wordExists = validatedWords.find(w => w.id === wordId);
      if (!wordExists) return;
      if (knownWords.includes(wordId)) return;
      if (!storageRateLimiter.canCall()) return;
      
      const updated = [...knownWords, wordId];
      setKnownWords(updated);
      secureStorage.set('knownWords', updated, isValidWordIdArray);
      updateStreak();
    });
  }, [knownWords, validatedWords, storageRateLimiter]);

  const toggleDarkMode = useCallback(() => {
    safeExecute(() => {
      const newMode = !darkMode;
      setDarkMode(newMode);
      secureStorage.set('darkMode', newMode, (val) => typeof val === 'boolean');
    });
  }, [darkMode]);

  const handleSearchChange = useCallback((e) => {
    safeExecute(() => {
      const sanitized = sanitizeText(e.target.value);
      const limited = sanitized.slice(0, 100);
      setSearchTerm(limited);
    });
  }, []);

  const handleWordClick = useCallback((word) => {
    safeExecute(() => {
      const wordIndex = validatedWords.findIndex(w => w.id === word.id);
      setSelectedWord(word);
      setSelectedWordIndex(wordIndex);
      setShowWordContext(true);
    });
  }, [validatedWords]);

  const handleStartLearning = () => {
    setShowLanding(false);
    secureStorage.set('hasVisited', true);
  };

 const handleOpenMultiSensory = (word) => {
  setMultiSensoryWord(word);
  setShowMultiSensory(true);
};

const handleOpenThemedClusters = () => {
  setShowThemedClusters(true);
};

const handleSelectCluster = (clusterWords, theme) => {
  setActiveCluster({ words: clusterWords, theme });
  // Optionally filter to show only cluster words
  // or navigate to a special cluster view
  alert(`Starting ${theme.title} with ${clusterWords.length} words!`);
};
 
  const handleSelectPlan = (plan, billingCycle) => {
    if (plan === 'premium') {
      simulatePremiumPurchase(billingCycle);
      alert('🎉 Premium activated! Refreshing to load premium features...');
      window.location.reload();
    }
    setShowPricing(false);
  };

  const updateStreak = useCallback(() => {
    safeExecute(() => {
      const today = new Date().toDateString();
      const lastStudy = secureStorage.get('lastStudyDate', null, (val) => typeof val === 'string');
      
      if (lastStudy !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();
        
        let newStreak = lastStudy === yesterdayStr ? streak + 1 : 1;
        
        if (isValidStreak(newStreak)) {
          setStreak(newStreak);
          secureStorage.set('learningStreak', newStreak, isValidStreak);
          secureStorage.set('lastStudyDate', today);
          
          const bestStreak = secureStorage.get('bestStreak', 0, isValidStreak);
          if (newStreak > bestStreak) {
            secureStorage.set('bestStreak', newStreak, isValidStreak);
          }
        }
      }
    });
  }, [streak]);

  const handleNext = () => {
    if (currentCardIndex < filteredWords.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  const handleModeSwitch = (newMode) => {
    setMode(newMode);
    setCurrentCardIndex(0);
    setShowMenu(false);
  };

  const handleRootClick = (root) => {
    setSelectedRoot(root);
    setShowRootExplorer(true);
    setMode('browse');
  };

  const closeRootExplorer = () => {
    setSelectedRoot(null);
    setShowRootExplorer(false);
  };

  const progressPercentage = Math.round((knownWords.length / validatedWords.length) * 100);

  const filteredWords = validatedWords.filter(word => {
    const matchesSearch = 
      word.arabic.includes(searchTerm) ||
      word.transliteration.toLowerCase().includes(searchTerm.toLowerCase()) ||
      word.meaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
      word.root.includes(searchTerm);
    
    const matchesCategory = 
      selectedCategory === 'All' || word.category === selectedCategory;
    
    const matchesRoot = 
      !selectedRoot || word.root === selectedRoot;
    
    return matchesSearch && matchesCategory && matchesRoot;
  });

  useEffect(() => {
    safeExecute(() => {
      if (darkMode) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    });
  }, [darkMode]);

  useEffect(() => {
    safeExecute(() => {
      const today = new Date().toDateString();
      const lastShown = secureStorage.get('dailyWordLastShown', null, (val) => typeof val === 'string');
      
      if (lastShown !== today) {
        setTimeout(() => {
          setShowDailyWord(true);
          secureStorage.set('dailyWordLastShown', today);
        }, 2000);
      }
    });
  }, []);

  return (
    <div className="App">
      {showLanding ? (
        <LandingPage 
          onStart={handleStartLearning}
          totalWords={validatedWords.length}
          knownWords={knownWords.length}
        />
      ) : (
        <>
          <header className="app-header-clean">
            <div className="header-content-clean">
              <h1 className="app-title-clean">🕌 Quran Vocabulary</h1>
              <button className="menu-toggle" onClick={() => setShowMenu(!showMenu)}>
                {showMenu ? '✕' : '☰'}
              </button>
            </div>
          </header>

          <nav className="mode-tabs">
            <button 
              className={mode === 'browse' ? 'tab active' : 'tab'}
              onClick={() => handleModeSwitch('browse')}
            >
              <span className="tab-icon">📚</span>
              <span className="tab-label">Browse</span>
            </button>
            <button 
              className={mode === 'flashcard' ? 'tab active' : 'tab'}
              onClick={() => handleModeSwitch('flashcard')}
            >
              <span className="tab-icon">🎴</span>
              <span className="tab-label">Flashcard</span>
            </button>
            <button 
              className={mode === 'quiz' ? 'tab active' : 'tab'}
              onClick={() => handleModeSwitch('quiz')}
            >
              <span className="tab-icon">🎯</span>
              <span className="tab-label">Quiz</span>
            </button>
            <button 
              className={mode === 'review' ? 'tab active' : 'tab'}
              onClick={() => handleModeSwitch('review')}
            >
              <span className="tab-icon">🧠</span>
              <span className="tab-label">Review</span>
            </button>
          </nav>

          <div className="stats-bar">
            <div className="stat-compact">
              <span className="stat-number">{validatedWords.length}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat-compact">
              <span className="stat-number">{knownWords.length}</span>
              <span className="stat-label">Learned</span>
            </div>
            <div className="stat-compact">
              <span className="stat-number">{progressPercentage}%</span>
              <span className="stat-label">Progress</span>
            </div>
            {streak > 0 && (
              <div className="stat-compact streak">
                <span className="stat-number">🔥 {streak}</span>
                <span className="stat-label">Streak</span>
              </div>
            )}
          </div>
          
          <main className="container">
            {mode === 'browse' ? (
              <>
                <div className="search-section">
                  <input
                    type="text"
                    placeholder="🔍 Search by Arabic, English, transliteration, or root..."
                    className="search-input"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    maxLength={100}
                  />
                </div>

                <div className="filters-section">
                  <h3>Filter by Category:</h3>
                  <div className="category-filters">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        className={selectedCategory === cat ? 'filter-btn active' : 'filter-btn'}
                        onClick={() => setSelectedCategory(cat)}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {showRootExplorer && selectedRoot && (
                  <div className="root-explorer-banner">
                    <div className="root-explorer-content">
                      <h3>🌳 Root Explorer: {selectedRoot}</h3>
                      <p>{filteredWords.length} words share this root</p>
                    </div>
                    <button className="close-root-btn" onClick={closeRootExplorer}>
                      ✕ Close
                    </button>
                  </div>
                )}

                <section className="words-section">
                  <h2>
                    {filteredWords.length} {filteredWords.length === 1 ? 'Word' : 'Words'}
                    {selectedCategory !== 'All' && ` in ${selectedCategory}`}
                    {showRootExplorer && selectedRoot && ` from root ${selectedRoot}`}
                  </h2>
                  
                  {filteredWords.length > 0 ? (
                    <div className="words-grid">
                      {filteredWords.map(word => (
                        <WordCard 
                          key={word.id} 
                          word={word}
                          onRootClick={handleRootClick}
                          onClick={() => handleWordClick(word)}
                          isKnown={knownWords.includes(word.id)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="no-results">
                      <h3>😕 No words found</h3>
                      <p>Try a different search term or category</p>
                      <button 
                        className="reset-btn"
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedCategory('All');
                          closeRootExplorer();
                        }}
                      >
                        Reset Filters
                      </button>
                    </div>
                  )}
                </section>
              </>
            ) : mode === 'flashcard' ? (
              <>
                {filteredWords.length > 0 && filteredWords[currentCardIndex] ? (
                  <Flashcard
                    word={filteredWords[currentCardIndex]}
                    onNext={handleNext}
                    onPrevious={handlePrevious}
                    onKnow={handleMarkAsKnown}
                    current={currentCardIndex + 1}
                    total={filteredWords.length}
                    isPremium={isPremium}
                    relatedWords={validatedWords.filter(w => 
                      w.root === filteredWords[currentCardIndex].root && 
                      w.id !== filteredWords[currentCardIndex].id
                    )}
                  />
                ) : (
                  <div className="no-results">
                    <h3>No words to study</h3>
                    <button onClick={() => handleModeSwitch('browse')} className="reset-btn">
                      Go to Browse Mode
                    </button>
                  </div>
                )}
              </>
            ) : mode === 'quiz' ? (
              <Quiz 
                words={validatedWords} 
                onComplete={() => handleModeSwitch('browse')}
                isPremium={isPremium}
              />
            ) : mode === 'review' ? (
              <Review 
                words={validatedWords}
                knownWords={knownWords}
                onReviewed={handleMarkAsKnown}
                onClose={() => handleModeSwitch('browse')}
              />
            ) : null}
          </main>
          
          <div className="floating-actions">
            <button 
              className="fab fab-primary" 
              onClick={() => setShowDashboard(true)}
              title="View Dashboard"
            >
              📊
            </button>
            <button 
              className="fab fab-secondary" 
              onClick={toggleDarkMode}
              title="Toggle Dark Mode"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            <button 
              className="fab fab-secondary" 
              onClick={() => setShowDailyWord(true)}
              title="Daily Word"
            >
              📅
            </button>
            <button 
              className={`fab ${isPremium ? 'fab-premium' : 'fab-upgrade'}`}
              onClick={() => setShowPricing(true)}
              title={isPremium ? 'Premium Active' : 'Upgrade to Premium'}
            >
              {isPremium ? '⭐' : '⬆️'}
            </button>
          </div>

          {showMenu && (
            <div className="mobile-menu-overlay" onClick={() => setShowMenu(false)}>
              <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
                <h3>Menu</h3>
                <button onClick={() => { setShowDashboard(true); setShowMenu(false); }}>
                  📊 Dashboard
                </button>
                <button onClick={() => { toggleDarkMode(); setShowMenu(false); }}>
                  {darkMode ? '☀️' : '🌙'} {darkMode ? 'Light' : 'Dark'} Mode
                </button>
                <button onClick={() => { setShowDailyWord(true); setShowMenu(false); }}>
                  📅 Daily Word
                </button>
                <button onClick={() => { setShowPricing(true); setShowMenu(false); }}>
                  {isPremium ? '⭐ Premium' : '⬆️ Upgrade'}
                </button>
              </div>
            </div>
          )}
      
          {showDailyWord && (
            <DailyWord
              words={validatedWords}
              onLearn={handleMarkAsKnown}
              onClose={() => setShowDailyWord(false)}
            />
          )}

          {showDashboard && (
            <LearningDashboard
              words={validatedWords}
              knownWords={knownWords}
              totalWords={validatedWords.length}
              onClose={() => setShowDashboard(false)}
            />
          )}

          {showWordContext && selectedWord && (
            <WordContextPremium
              word={selectedWord}
              wordIndex={selectedWordIndex}
              onClose={() => setShowWordContext(false)}
              isPremium={isPremium}
              onUpgrade={() => setShowPricing(true)}
              onOpenMultiSensory={handleOpenMultiSensory}
            />
          )}

          {showPricing && (
            <PricingPage 
              onClose={() => setShowPricing(false)}
              onSelectPlan={handleSelectPlan}
              currentPlan={isPremium ? 'premium' : 'free'}
            />
          )}
          {/* ✅ NEW MODALS - ADD THESE */}
          {showMultiSensory && multiSensoryWord && (
            <MultiSensoryLearning
              word={multiSensoryWord}
              onClose={() => setShowMultiSensory(false)}
            />
          )}

          {showThemedClusters && (
            <ThemedClusters
              words={validatedWords}
              onSelectCluster={handleSelectCluster}
              onClose={() => setShowThemedClusters(false)}
              isPremium={isPremium}
       />
          )}

        </>
      )}
    </div>
  );
}

export default App;
