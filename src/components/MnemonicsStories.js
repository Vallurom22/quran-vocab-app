/**
 * 🧠 MNEMONICS & STORIES COMPONENT
 * 
 * Link words to vivid images and memorable stories
 * Features:
 * - Pre-made mnemonics for common words
 * - User-created stories
 * - Visual memory aids
 * - Story sharing
 */

import React, { useState, useEffect } from 'react';
import './MnemonicsStories.css';

// Pre-made mnemonics for common words
const builtInMnemonics = {
  'الله': {
    story: 'Allah - Imagine the word "Allah" written in golden calligraphy shining from the sky, reminding you of the Creator above.',
    image: '☁️',
    technique: 'Visual Association'
  },
  'صَلَاة': {
    story: 'Salah (Prayer) - Think of a person standing in PERFECT LINES (like the letter "L" in Salah), bowing and prostrating to Allah.',
    image: '🕌',
    technique: 'Shape + Action'
  },
  'قُرْآن': {
    story: 'Quran - Imagine a beautiful book RADIATING light ("Qu-ran" sounds like "Ran" with light). The book is so bright it lights up the whole room.',
    image: '📖✨',
    technique: 'Sound + Visual'
  },
  'جَنَّة': {
    story: 'Jannah (Paradise) - Picture a LUSH GARDEN ("Jannah" has "garden" in it) with rivers flowing underneath trees so green they almost glow.',
    image: '🌳🌊',
    technique: 'Word Association'
  },
  'نَار': {
    story: 'Nar (Fire) - "Nar" sounds like "NAR-row escape" from fire. Imagine narrowly escaping flames.',
    image: '🔥',
    technique: 'Sound Association'
  },
};

const MnemonicsStories = ({ words, onClose, userProgress = {} }) => {
  const [selectedWord, setSelectedWord] = useState(null);
  const [userStories, setUserStories] = useState({});
  const [newStory, setNewStory] = useState('');
  const [filter, setFilter] = useState('all'); // all, with-mnemonics, my-stories
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Load user stories from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('userMnemonics');
    if (saved) {
      setUserStories(JSON.parse(saved));
    }
  }, []);

  // Save story
  const handleSaveStory = () => {
    if (!newStory.trim() || !selectedWord) return;

    const updated = {
      ...userStories,
      [selectedWord.arabic]: {
        story: newStory,
        createdAt: new Date().toISOString(),
        wordId: selectedWord.id
      }
    };

    setUserStories(updated);
    localStorage.setItem('userMnemonics', JSON.stringify(updated));
    setNewStory('');
    setShowCreateModal(false);
  };

  // Delete story
  const handleDeleteStory = (arabicWord) => {
    const updated = { ...userStories };
    delete updated[arabicWord];
    setUserStories(updated);
    localStorage.setItem('userMnemonics', JSON.stringify(updated));
  };

  // Get mnemonic for word
  const getMnemonic = (word) => {
    // Check user stories first
    if (userStories[word.arabic]) {
      return { ...userStories[word.arabic], source: 'user' };
    }
    // Check built-in mnemonics
    if (builtInMnemonics[word.arabic]) {
      return { ...builtInMnemonics[word.arabic], source: 'built-in' };
    }
    return null;
  };

  // Filter words
  const filteredWords = words.filter(word => {
    if (filter === 'with-mnemonics') {
      return builtInMnemonics[word.arabic];
    }
    if (filter === 'my-stories') {
      return userStories[word.arabic];
    }
    return true;
  });

  return (
    <div className="mnemonics-container">
      
      {/* Header */}
      <div className="mnemonics-header">
        <button className="back-btn" onClick={onClose}>← Back</button>
        <h2 className="mnemonics-title">Mnemonics & Stories</h2>
        <div className="stats-badge">
          {Object.keys(userStories).length} Your Stories
        </div>
      </div>

      {/* Info Banner */}
      <div className="info-banner">
        <div className="info-icon">🧠</div>
        <div className="info-text">
          <strong>Make it memorable!</strong> Create vivid mental images and stories to remember words 2x better.
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        <button
          className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Words ({words.length})
        </button>
        <button
          className={`filter-tab ${filter === 'with-mnemonics' ? 'active' : ''}`}
          onClick={() => setFilter('with-mnemonics')}
        >
          With Mnemonics ({Object.keys(builtInMnemonics).length})
        </button>
        <button
          className={`filter-tab ${filter === 'my-stories' ? 'active' : ''}`}
          onClick={() => setFilter('my-stories')}
        >
          My Stories ({Object.keys(userStories).length})
        </button>
      </div>

      {/* Words Grid */}
      <div className="mnemonics-grid">
        {filteredWords.map(word => {
          const mnemonic = getMnemonic(word);
          const hasStory = !!mnemonic;

          return (
            <div 
              key={word.id}
              className={`mnemonic-card ${hasStory ? 'has-story' : ''}`}
              onClick={() => setSelectedWord(word)}
            >
              {/* Badge */}
              {hasStory && (
                <div className={`story-badge ${mnemonic.source}`}>
                  {mnemonic.source === 'user' ? '✍️ Your Story' : '📚 Built-in'}
                </div>
              )}

              {/* Word */}
              <div className="card-arabic">{word.arabic}</div>
              <div className="card-english">{word.meaning}</div>
              <div className="card-trans">{word.transliteration}</div>

              {/* Story Preview */}
              {hasStory ? (
                <div className="story-preview">
                  <div className="preview-icon">{mnemonic.image || '🧠'}</div>
                  <div className="preview-text">
                    {mnemonic.story.substring(0, 60)}...
                  </div>
                </div>
              ) : (
                <div className="create-prompt">
                  <div className="prompt-icon">➕</div>
                  <div className="prompt-text">Create a story</div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Word Detail Modal */}
      {selectedWord && (
        <div className="detail-modal-overlay" onClick={() => setSelectedWord(null)}>
          <div className="detail-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedWord(null)}>✕</button>

            {/* Word Info */}
            <div className="modal-word-info">
              <div className="modal-arabic">{selectedWord.arabic}</div>
              <div className="modal-english">{selectedWord.meaning}</div>
              <div className="modal-trans">{selectedWord.transliteration}</div>
            </div>

            {/* Mnemonic Display */}
            {(() => {
              const mnemonic = getMnemonic(selectedWord);
              
              if (mnemonic) {
                return (
                  <div className="mnemonic-display">
                    <div className="mnemonic-header">
                      <h3>
                        {mnemonic.source === 'user' ? '✍️ Your Story' : '📚 Suggested Mnemonic'}
                      </h3>
                      {mnemonic.technique && (
                        <span className="technique-badge">{mnemonic.technique}</span>
                      )}
                    </div>

                    <div className="mnemonic-content">
                      {mnemonic.image && (
                        <div className="mnemonic-image">{mnemonic.image}</div>
                      )}
                      <p className="mnemonic-story">{mnemonic.story}</p>
                    </div>

                    {mnemonic.source === 'user' && (
                      <div className="story-actions">
                        <button 
                          className="edit-story-btn"
                          onClick={() => {
                            setNewStory(mnemonic.story);
                            setShowCreateModal(true);
                          }}
                        >
                          ✏️ Edit
                        </button>
                        <button 
                          className="delete-story-btn"
                          onClick={() => handleDeleteStory(selectedWord.arabic)}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    )}
                  </div>
                );
              }

              // No mnemonic - show create prompt
              return (
                <div className="create-mnemonic-prompt">
                  <div className="prompt-icon-large">🧠</div>
                  <h3>Create Your Own Story</h3>
                  <p>Make it vivid, personal, and memorable!</p>
                  <button 
                    className="create-story-btn"
                    onClick={() => setShowCreateModal(true)}
                  >
                    ✍️ Create Story
                  </button>
                </div>
              );
            })()}

            {/* Tips Section */}
            <div className="mnemonic-tips">
              <h4>💡 Tips for Great Mnemonics:</h4>
              <ul>
                <li>Use <strong>vivid imagery</strong> - The more detailed, the better</li>
                <li>Make it <strong>personal</strong> - Connect to your own experiences</li>
                <li>Add <strong>emotion</strong> - Funny, shocking, or touching stories stick</li>
                <li>Use <strong>sound</strong> - Connect Arabic sounds to English words</li>
                <li>Create <strong>visual scenes</strong> - Picture a mini-movie in your mind</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Create Story Modal */}
      {showCreateModal && selectedWord && (
        <div className="create-modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="create-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Create Your Story for: {selectedWord.arabic}</h3>
            <p className="create-subtitle">{selectedWord.meaning}</p>

            <textarea
              className="story-input"
              value={newStory}
              onChange={(e) => setNewStory(e.target.value)}
              placeholder="Write your memorable story here...

Example: Imagine a giant book floating in the sky, radiating golden light. Every time you say 'Quran', the book opens and light pours down..."
              rows={6}
            />

            <div className="create-actions">
              <button 
                className="save-story-btn"
                onClick={handleSaveStory}
                disabled={!newStory.trim()}
              >
                💾 Save Story
              </button>
              <button 
                className="cancel-btn"
                onClick={() => {
                  setShowCreateModal(false);
                  setNewStory('');
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MnemonicsStories;