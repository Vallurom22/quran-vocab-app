import { useState, useEffect } from 'react';
import './DailyWord.css';

function DailyWord({ words, onLearn, onClose }) {
  const [dailyWord, setDailyWord] = useState(null);

  useEffect(() => {
    const today = new Date().toDateString();
    const storedData = localStorage.getItem('dailyWord');
    
    if (storedData) {
      const { word, date } = JSON.parse(storedData);
      
      // Check if it's still the same day
      if (date === today) {
        setDailyWord(word);
        return;
      }
    }
    
    // New day - pick a random word
    const randomWord = words[Math.floor(Math.random() * words.length)];
    const wordData = { word: randomWord, date: today };
    
    localStorage.setItem('dailyWord', JSON.stringify(wordData));
    setDailyWord(randomWord);
  }, [words]);

  const handleLearn = () => {
    if (dailyWord) {
      onLearn(dailyWord.id);
    }
  };

  if (!dailyWord) {
    return <div className="daily-word-loading">Loading word of the day...</div>;
  }

  return (
    <div className="daily-word-overlay" onClick={onClose}>
      <div className="daily-word-modal" onClick={(e) => e.stopPropagation()}>
        <button className="daily-word-close" onClick={onClose}>✕</button>
        
        <div className="daily-word-header">
          <div className="daily-word-icon">📅</div>
          <h2>Word of the Day</h2>
          <p className="daily-word-date">{new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</p>
        </div>

        <div className="daily-word-content">
          <div className="daily-word-arabic">{dailyWord.arabic}</div>
          <div className="daily-word-transliteration">{dailyWord.transliteration}</div>
          <div className="daily-word-meaning">{dailyWord.meaning}</div>
          
          <div className="daily-word-details">
            <div className="detail-row">
              <span className="detail-label">Root:</span>
              <span className="detail-value">{dailyWord.root}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Category:</span>
              <span className="detail-value">{dailyWord.category}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Occurrences in Quran:</span>
              <span className="detail-value">{dailyWord.occurrences}x</span>
            </div>
          </div>
        </div>

        <div className="daily-word-actions">
          <button className="daily-word-btn primary" onClick={handleLearn}>
            ✓ I Learned This
          </button>
          <button className="daily-word-btn secondary" onClick={onClose}>
            Remind Me Later
          </button>
        </div>
      </div>
    </div>
  );
}

export default DailyWord;