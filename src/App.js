import './App.css';
import WordCard from './components/WordCard';
import Flashcard from './components/Flashcard';
import Quiz from './components/Quiz';
import DailyWord from './components/DailyWord';
import Review from './components/Review';
import { quranWords } from './data/words';
import { useState, useEffect } from 'react';

function App() {
  // All State Variables
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [mode, setMode] = useState('browse');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [knownWords, setKnownWords] = useState([]);
  const [showDailyWord, setShowDailyWord] = useState(false);
  const [selectedRoot, setSelectedRoot] = useState(null);
  const [showRootExplorer, setShowRootExplorer] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  // Get unique categories
  const categories = ['All', ...new Set(quranWords.map(w => w.category))];

  // Filter words based on search, category, and root
  let filteredWords = quranWords.filter(word => {
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

  // Flashcard Navigation
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

  // Mark word as known
  const handleKnow = (wordId) => {
    if (!knownWords.includes(wordId)) {
      setKnownWords([...knownWords, wordId]);
    }
  };

  // Switch between modes
  const handleModeSwitch = (newMode) => {
    setMode(newMode);
    setCurrentCardIndex(0);
  };

  // Calculate progress
  const progressPercentage = Math.round((knownWords.length / quranWords.length) * 100);

  // Dark Mode Toggle
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', JSON.stringify(newMode));
  };

  // Root Explorer Functions
  const handleRootClick = (root) => {
    setSelectedRoot(root);
    setShowRootExplorer(true);
    setMode('browse');
  };

  const closeRootExplorer = () => {
    setSelectedRoot(null);
    setShowRootExplorer(false);
  };

  const getRootWords = (root) => {
    return quranWords.filter(word => word.root === root);
  };

  // Test Audio Function
  const testAudio = () => {
    if (!('speechSynthesis' in window)) {
      alert('❌ Speech synthesis not supported in this browser. Try Chrome or Edge!');
      return;
    }

    // Test with Arabic
    const utterance = new SpeechSynthesisUtterance('السلام عليكم');
    utterance.lang = 'ar-SA';
    utterance.rate = 0.7;
    
    utterance.onstart = () => {
      console.log('🔊 Test audio started');
    };
    
    utterance.onend = () => {
      console.log('✅ Test audio finished');
      alert('✅ Audio test complete! Check console for details.');
    };
    
    utterance.onerror = (event) => {
      console.error('❌ Audio error:', event.error);
      alert(`❌ Audio error: ${event.error}`);
    };

    window.speechSynthesis.speak(utterance);
    console.log('Test audio triggered: السلام عليكم');
    
    // Log available voices
    setTimeout(() => {
      const voices = window.speechSynthesis.getVoices();
      console.log('📢 Available voices:', voices.length);
      const arabicVoices = voices.filter(v => v.lang.includes('ar'));
      console.log('🇸🇦 Arabic voices:', arabicVoices.length, arabicVoices.map(v => v.name));
    }, 100);
  };

  // Apply dark mode class to body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  // Show daily word on app load (once per day)
  useEffect(() => {
    const today = new Date().toDateString();
    const lastShown = localStorage.getItem('dailyWordLastShown');
    
    if (lastShown !== today) {
      setTimeout(() => {
        setShowDailyWord(true);
        localStorage.setItem('dailyWordLastShown', today);
      }, 2000);
    }
  }, []);

  return (
    <div className="App">
      <header>
        <h1>🕌 Quran Vocabulary</h1>
        <p>Learn Arabic through the Quran</p>
        
        <div className="header-controls">
          <div className="mode-toggle">
            <button 
              className={mode === 'browse' ? 'mode-btn active' : 'mode-btn'}
              onClick={() => handleModeSwitch('browse')}
            >
              📚 Browse
            </button>
            <button 
              className={mode === 'flashcard' ? 'mode-btn active' : 'mode-btn'}
              onClick={() => handleModeSwitch('flashcard')}
            >
              🎴 Flashcards
            </button>
            <button 
              className={mode === 'quiz' ? 'mode-btn active' : 'mode-btn'}
              onClick={() => handleModeSwitch('quiz')}
            >
              🎯 Quiz
            </button>
            <button 
              className={mode === 'review' ? 'mode-btn active' : 'mode-btn'}
              onClick={() => handleModeSwitch('review')}
            >
              🧠 Review
            </button>
          </div>
          
          <button className="dark-mode-toggle" onClick={toggleDarkMode}>
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
          
          <button className="daily-word-trigger" onClick={() => setShowDailyWord(true)}>
            📅 Daily Word
          </button>

          <button className="daily-word-trigger" onClick={testAudio}>
            🔊 Test Audio
          </button>
        </div>
      </header>
      
      <main className="container">
        {mode === 'browse' ? (
          <>
            {/* Browse Mode - Stats */}
            <div className="stats">
              <div className="stat-card">
                <h3>{quranWords.length}</h3>
                <p>Total Words</p>
              </div>
              <div className="stat-card">
                <h3>{knownWords.length}</h3>
                <p>Words Learned</p>
              </div>
              <div className="stat-card">
                <h3>{progressPercentage}%</h3>
                <p>Progress</p>
              </div>
            </div>

            {/* Browse Mode - Search */}
            <div className="search-section">
              <input
                type="text"
                placeholder="🔍 Search by Arabic, English, transliteration, or root..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Browse Mode - Category Filters */}
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

            {/* Browse Mode - Root Explorer Banner */}
            {showRootExplorer && selectedRoot && (
              <div className="root-explorer-banner">
                <div className="root-explorer-content">
                  <h3>🌳 Root Explorer: {selectedRoot}</h3>
                  <p>{getRootWords(selectedRoot).length} words share this root</p>
                </div>
                <button className="close-root-btn" onClick={closeRootExplorer}>
                  ✕ Close
                </button>
              </div>
            )}

            {/* Browse Mode - Words Grid */}
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
            {/* Flashcard Mode */}
            <div className="flashcard-stats">
              <div className="stat-card-small">
                <span className="stat-label">Known:</span>
                <span className="stat-value">{knownWords.length} / {quranWords.length}</span>
              </div>
              <div className="stat-card-small">
                <span className="stat-label">Progress:</span>
                <span className="stat-value">{progressPercentage}%</span>
              </div>
            </div>
            
            {filteredWords.length > 0 ? (
              <Flashcard
                word={filteredWords[currentCardIndex]}
                onNext={handleNext}
                onPrevious={handlePrevious}
                onKnow={handleKnow}
                current={currentCardIndex + 1}
                total={filteredWords.length}
              />
            ) : (
              <div className="no-results">
                <h3>No words to study</h3>
                <button onClick={() => setMode('browse')} className="reset-btn">
                  Go to Browse Mode
                </button>
              </div>
            )}
          </>
        ) : mode === 'quiz' ? (
          <>
            {/* Quiz Mode */}
            <Quiz 
              words={quranWords} 
              onComplete={() => setMode('browse')}
            />
          </>
        ) : mode === 'review' ? (
          <>
            {/* Review Mode - Spaced Repetition */}
            <Review 
              words={quranWords}
              knownWords={knownWords}
              onReviewed={handleKnow}
              onClose={() => setMode('browse')}
            />
          </>
        ) : null}
      </main>
      
      {/* Daily Word Modal */}
      {showDailyWord && (
        <DailyWord 
          words={quranWords}
          onLearn={handleKnow}
          onClose={() => setShowDailyWord(false)}
        />
      )}
    </div>
  );
}

export default App;
