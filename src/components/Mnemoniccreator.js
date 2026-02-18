import React, { useState, useEffect } from 'react';
import './MnemonicCreator.css';
import { mnemonicManager, MnemonicGenerator, getCommunityMnemonics } from '../utils/MnemonicManager';

const MnemonicCreator = ({ word, onClose, isPremium }) => {
  const [activeTab, setActiveTab] = useState('my');
  const [myMnemonics, setMyMnemonics] = useState([]);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [communityMnemonics, setCommunityMnemonics] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newMnemonic, setNewMnemonic] = useState({ type: 'visual', content: '' });

  useEffect(() => {
    loadMnemonics();
    generateSuggestions();
    loadCommunityMnemonics();
  }, [word]);

  const loadMnemonics = () => {
    const mnemonics = mnemonicManager.getMnemonics(word.id);
    setMyMnemonics(mnemonics);
  };

  const generateSuggestions = () => {
    const suggestions = MnemonicGenerator.generateAllMnemonics(word);
    setAiSuggestions(suggestions);
  };

  const loadCommunityMnemonics = () => {
    const community = getCommunityMnemonics(word.id, isPremium);
    setCommunityMnemonics(Array.isArray(community) ? community : []);
  };

  const handleCreate = () => {
    if (!newMnemonic.content.trim()) return;
    
    mnemonicManager.createMnemonic(word.id, newMnemonic.type, newMnemonic.content);
    setNewMnemonic({ type: 'visual', content: '' });
    setIsCreating(false);
    loadMnemonics();
  };

  const handleUseSuggestion = (type) => {
    setNewMnemonic({ type, content: aiSuggestions[type] });
    setIsCreating(true);
  };

  const handleDelete = (mnemonicId) => {
    mnemonicManager.deleteMnemonic(word.id, mnemonicId);
    loadMnemonics();
  };

  const handleVote = (mnemonicId, delta) => {
    mnemonicManager.voteMnemonic(word.id, mnemonicId, delta);
    loadMnemonics();
  };

  const getMnemonicIcon = (type) => {
    const icons = {
      visual: '🎨',
      sound: '🔊',
      story: '📖',
      association: '🔗'
    };
    return icons[type] || '💭';
  };

  return (
    <div className="mnemonic-creator-overlay">
      <div className="mnemonic-creator-modal">
        
        {/* Header */}
        <div className="mnemonic-header">
          <div className="header-word">
            <h2 className="word-arabic">{word.arabic}</h2>
            <p className="word-meaning">{word.meaning}</p>
          </div>
          <button className="close-mnemonic" onClick={onClose}>✕</button>
        </div>

        {/* Tabs */}
        <div className="mnemonic-tabs">
          <button 
            className={activeTab === 'my' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('my')}
          >
            💭 My Mnemonics ({myMnemonics.length})
          </button>
          <button 
            className={activeTab === 'ai' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('ai')}
          >
            🤖 AI Suggestions
          </button>
          <button 
            className={activeTab === 'community' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('community')}
          >
            👥 Community {!isPremium && '🔒'}
          </button>
        </div>

        {/* Content */}
        <div className="mnemonic-content">
          
          {/* My Mnemonics Tab */}
          {activeTab === 'my' && (
            <div className="my-mnemonics">
              {myMnemonics.length === 0 && !isCreating && (
                <div className="empty-state">
                  <div className="empty-icon">💭</div>
                  <h3>No mnemonics yet</h3>
                  <p>Create your first memory trick to help remember this word!</p>
                  <button className="btn-create" onClick={() => setIsCreating(true)}>
                    ✨ Create Mnemonic
                  </button>
                </div>
              )}

              {myMnemonics.map(mnemonic => (
                <div key={mnemonic.id} className="mnemonic-card">
                  <div className="mnemonic-type">
                    <span className="type-icon">{getMnemonicIcon(mnemonic.type)}</span>
                    <span className="type-label">{mnemonic.type}</span>
                  </div>
                  <p className="mnemonic-text">{mnemonic.content}</p>
                  <div className="mnemonic-actions">
                    <span className="created-date">
                      {new Date(mnemonic.createdAt).toLocaleDateString()}
                    </span>
                    <button 
                      className="btn-delete-mnemonic"
                      onClick={() => handleDelete(mnemonic.id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}

              {myMnemonics.length > 0 && !isCreating && (
                <button className="btn-add-more" onClick={() => setIsCreating(true)}>
                  ➕ Add Another Mnemonic
                </button>
              )}

              {/* Create Form */}
              {isCreating && (
                <div className="create-form">
                  <h4>Create New Mnemonic</h4>
                  
                  <div className="form-group">
                    <label>Type:</label>
                    <div className="type-selector">
                      {['visual', 'sound', 'story', 'association'].map(type => (
                        <button
                          key={type}
                          className={newMnemonic.type === type ? 'type-btn active' : 'type-btn'}
                          onClick={() => setNewMnemonic({ ...newMnemonic, type })}
                        >
                          {getMnemonicIcon(type)} {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Your Memory Trick:</label>
                    <textarea
                      className="mnemonic-input"
                      placeholder={`Describe your ${newMnemonic.type} mnemonic...`}
                      value={newMnemonic.content}
                      onChange={(e) => setNewMnemonic({ ...newMnemonic, content: e.target.value })}
                      rows={4}
                    />
                  </div>

                  <div className="form-actions">
                    <button className="btn-cancel" onClick={() => setIsCreating(false)}>
                      Cancel
                    </button>
                    <button 
                      className="btn-save"
                      onClick={handleCreate}
                      disabled={!newMnemonic.content.trim()}
                    >
                      💾 Save Mnemonic
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* AI Suggestions Tab */}
          {activeTab === 'ai' && aiSuggestions && (
            <div className="ai-suggestions">
              <div className="ai-intro">
                <div className="ai-icon">🤖</div>
                <h3>AI-Generated Memory Tricks</h3>
                <p>Use these suggestions or customize them for better recall</p>
              </div>

              <div className="suggestion-card">
                <div className="suggestion-header">
                  <span className="suggestion-icon">🎨</span>
                  <h4>Visual Mnemonic</h4>
                </div>
                <p className="suggestion-text">{aiSuggestions.visual}</p>
                <button 
                  className="btn-use-suggestion"
                  onClick={() => handleUseSuggestion('visual')}
                >
                  Use This
                </button>
              </div>

              <div className="suggestion-card">
                <div className="suggestion-header">
                  <span className="suggestion-icon">🔊</span>
                  <h4>Sound Association</h4>
                </div>
                <p className="suggestion-text">{aiSuggestions.sound}</p>
                <button 
                  className="btn-use-suggestion"
                  onClick={() => handleUseSuggestion('sound')}
                >
                  Use This
                </button>
              </div>

              <div className="suggestion-card">
                <div className="suggestion-header">
                  <span className="suggestion-icon">📖</span>
                  <h4>Story Mnemonic</h4>
                </div>
                <p className="suggestion-text">{aiSuggestions.story}</p>
                <button 
                  className="btn-use-suggestion"
                  onClick={() => handleUseSuggestion('story')}
                >
                  Use This
                </button>
              </div>

              <div className="suggestion-card">
                <div className="suggestion-header">
                  <span className="suggestion-icon">🔗</span>
                  <h4>Personal Association</h4>
                </div>
                <p className="suggestion-text">{aiSuggestions.association}</p>
                <button 
                  className="btn-use-suggestion"
                  onClick={() => handleUseSuggestion('association')}
                >
                  Use This
                </button>
              </div>
            </div>
          )}

          {/* Community Tab */}
          {activeTab === 'community' && (
            <div className="community-mnemonics">
              {!isPremium ? (
                <div className="premium-lock">
                  <div className="lock-icon">🔒</div>
                  <h3>Community Mnemonics</h3>
                  <p>Unlock thousands of mnemonics created by other learners</p>
                  <ul className="premium-benefits">
                    <li>✓ See what works for others</li>
                    <li>✓ Vote on the best mnemonics</li>
                    <li>✓ Share your own creations</li>
                    <li>✓ Learn from the community</li>
                  </ul>
                  <button className="btn-upgrade">
                    ⭐ Upgrade to Premium
                  </button>
                </div>
              ) : communityMnemonics.length === 0 ? (
                <div className="empty-community">
                  <p>No community mnemonics yet for this word</p>
                  <p>Be the first to share yours!</p>
                </div>
              ) : (
                communityMnemonics.map(mnemonic => (
                  <div key={mnemonic.id} className="community-card">
                    <div className="mnemonic-type">
                      <span className="type-icon">{getMnemonicIcon(mnemonic.type)}</span>
                      <span className="type-label">{mnemonic.type}</span>
                    </div>
                    <p className="mnemonic-text">{mnemonic.content}</p>
                    <div className="community-footer">
                      <span className="author">by {mnemonic.author}</span>
                      <div className="voting">
                        <button className="vote-btn">👍</button>
                        <span className="votes">{mnemonic.votes}</span>
                        <button className="vote-btn">👎</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Learning Tip */}
        <div className="learning-tip">
          <div className="tip-icon">💡</div>
          <div className="tip-content">
            <strong>Tip:</strong> The best mnemonics are personal and vivid. Link words to your own experiences for 2x better recall!
          </div>
        </div>

      </div>
    </div>
  );
};

export default MnemonicCreator;