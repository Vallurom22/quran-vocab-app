import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
// Import learning method components
import ActiveRecall from './ActiveRecall';
import MnemonicsStories from './MnemonicsStories';
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
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Signup from './components/Signup';
import './components/Auth.css';
import InstallPrompt from './components/InstallPrompt';
import {
  secureStorage,
  isValidWordId,
  isValidWordIdArray,
  isValidStreak,
  sanitizeText,
  createRateLimiter,
  safeExecute
} from './utils/SecurityUtils';
import {
  saveKnownWord,
  getKnownWords,
  updateUserProgress,
  getUserProgress
} from './utils/supabaseClient';

function AppContent() {
  const isPremium = usePremiumStatus();
  const { user, signOut } = useAuth();
  
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
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
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

  // ✅ NEW: Sync data when user logs in
  useEffect(() => {
    const syncUserData = async () => {
      if (user) {
        console.log('👤 User logged in, syncing data from cloud...');
        
        try {
          // Load known words from Supabase
          const { words, error: wordsError } = await getKnownWords(user.id);
          
          if (!wordsError && words) {
            const cloudWordIds = words.map(w => w.word_id);
            const localWords = secureStorage.get('knownWords', [], isValidWordIdArray);
            
            // Merge and deduplicate
            const mergedWords = [...new Set([...cloudWordIds, ...localWords])];
            
            setKnownWords(mergedWords);
            secureStorage.set('knownWords', mergedWords, isValidWordIdArray);
            
            console.log('✅ Synced', mergedWords.length, 'known words from cloud');
          }
          
          // Load user progress
          const { progress, error: progressError } = await getUserProgress(user.id);
          if (!progressError && progress) {
            setStreak(progress.learning_streak || 0);
            secureStorage.set('learningStreak', progress.learning_streak || 0, isValidStreak);
            console.log('✅ Synced learning streak:', progress.learning_streak);
          }
        } catch (error) {
          console.error('Error syncing user data:', error);
        }
      }
    };
    
    syncUserData();
  }, [user]);

  // ✅ UPDATED: Save to cloud when marking word as known
  const handleMarkAsKnown = useCallback(async (wordId) => {
    await safeExecute(async () => {
      if (!isValidWordId(wordId)) return;
      const wordExists = validatedWords.find(w => w.id === wordId);
      if (!wordExists) return;
      if (knownWords.includes(wordId)) return;
      if (!storageRateLimiter.canCall()) return;
      
      const updated = [...knownWords, wordId];
      setKnownWords(updated);
      secureStorage.set('knownWords', updated, isValidWordIdArray);
      
      // Save to Supabase if user is logged in
      if (user) {
        const { word, error } = await saveKnownWord(user.id, wordId);
        if (!error) {
          console.log('✅ Saved to cloud:', wordId);
        } else {
          console.error('❌ Failed to save to cloud:', error);
        }
      }
      
      updateStreak();
    });
  }, [knownWords, validatedWords, storageRateLimiter, user]);

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

  // ✅ UPDATED: Sync streak to cloud
  const updateStreak = useCallback(async () => {
    await safeExecute(async () => {
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
          
          // Sync to Supabase if user is logged in
          if (user) {
            const { progress, error } = await updateUserProgress(user.id, {
              learning_streak: newStreak,
              best_streak: Math.max(newStreak, bestStreak),
              last_study_date: today,
              total_words_learned: knownWords.length + 1
            });
            
            if (!error) {
              console.log('✅ Synced streak to cloud:', newStreak);
            } else {
              console.error('❌ Failed to sync streak:', error);
            }
          }
        }
      }
    });
  }, [streak, user, knownWords]);

  // ✅ NEW: Sign out handler
  const handleSignOut = async () => {
    await signOut();
    console.log('👋 User signed out');
    // Optionally reload to reset state
    // window.location.reload();
  };

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
              
              {/* ✅ UPDATED: Shows user email and sign out when logged in */}
              <div className="header-auth" style={{ display: 'flex', gap: '12px', alignItems: 'center', position: 'relative', zIndex: 100, pointerEvents: 'auto' }}>
                {user ? (
                  <>
                    <span className="user-email" style={{ fontSize: '14px', fontWeight: 600 }}>
                      👤 {user.email}
                    </span>
                    <button 
                      className="auth-trigger-btn"
                      style={{ cursor: 'pointer', pointerEvents: 'auto' }}
                      onClick={handleSignOut}
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      className="auth-trigger-btn"
                      style={{ cursor: 'pointer', pointerEvents: 'auto', position: 'relative', zIndex: 101 }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowLogin(true);
                      }}
                    >
                      Sign In
                    </button>
                    <button 
                      className="auth-trigger-btn primary"
                      style={{ cursor: 'pointer', pointerEvents: 'auto', position: 'relative', zIndex: 101 }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowSignup(true);
                      }}
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </div>
              
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
                    <button className="close-root-btn" onClick={closeRootExplorer}>✕ Close</button>
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
                      <button className="reset-btn" onClick={() => {
                        setSearchTerm('');
                        setSelectedCategory('All');
                        closeRootExplorer();
                      }}>Reset Filters</button>
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
            <button className="fab fab-secondary" onClick={toggleDarkMode} title="Toggle Dark Mode">{darkMode ? '☀️' : '🌙'}</button>
            <button className="fab fab-secondary" onClick={() => setShowDailyWord(true)} title="Daily Word">📅</button>
            <button className={`fab ${isPremium ? 'fab-premium' : 'fab-upgrade'}`} onClick={() => setShowPricing(true)} title={isPremium ? 'Premium Active' : 'Upgrade to Premium'}>
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
                <button onClick={() => { toggleDarkMode(); setShowMenu(false); }}>{darkMode ? '☀️' : '🌙'} {darkMode ? 'Light' : 'Dark'} Mode</button>
                <button onClick={() => { setShowDailyWord(true); setShowMenu(false); }}>📅 Daily Word</button>
                <button onClick={() => { setShowPricing(true); setShowMenu(false); }}>{isPremium ? '⭐ Premium' : '⬆️ Upgrade'}</button>
                {user ? (
                  <button onClick={() => { handleSignOut(); setShowMenu(false); }}>👋 Sign Out</button>
                ) : (
                  <>
                    <button onClick={() => { setShowLogin(true); setShowMenu(false); }}>🔐 Sign In</button>
                    <button onClick={() => { setShowSignup(true); setShowMenu(false); }}>📝 Sign Up</button>
                  </>
                )}
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

          {showLogin && <Login onClose={() => setShowLogin(false)} onSwitchToSignup={() => { setShowLogin(false); setShowSignup(true); }} onSwitchToReset={() => setShowLogin(false)} />}
          {showSignup && <Signup onClose={() => setShowSignup(false)} onSwitchToLogin={() => { setShowSignup(false); setShowLogin(true); }} />}
        </>
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;