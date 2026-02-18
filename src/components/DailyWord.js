import React, { useState, useEffect } from 'react';
import './DailyWord.css';
import {
  shareWordOfDay,
  shareToTwitter,
  shareToFacebook,
  shareToWhatsApp,
  shareToTelegram,
  copyWordToClipboard,
  downloadWordImage,
  shareWordImage,
  shareViaEmail,
  shareViaSMS
} from '../utils/SocialSharing';

const DailyWord = ({ words, onLearn, onClose }) => {
  const [dailyWord, setDailyWord] = useState(null);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  useEffect(() => {
    // Select word of the day based on date
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    const wordIndex = dayOfYear % words.length;
    setDailyWord(words[wordIndex]);
  }, [words]);

  const handleShare = async () => {
    const result = await shareWordOfDay(dailyWord);
    
    if (result.success) {
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 3000);
      
      if (result.method === 'clipboard') {
        alert('✅ Word copied to clipboard! Share it anywhere you like.');
      }
    } else if (!result.cancelled) {
      setShowShareMenu(true);
    }
  };

  const handleCopy = async () => {
    const success = await copyWordToClipboard(dailyWord);
    if (success) {
      alert('✅ Word details copied to clipboard!');
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2000);
    } else {
      alert('❌ Could not copy to clipboard');
    }
  };

  const handleDownloadImage = () => {
    downloadWordImage(dailyWord);
    alert('✅ Image downloaded! You can share it anywhere.');
  };

  const handleShareImage = async () => {
    const result = await shareWordImage(dailyWord);
    if (result.success) {
      if (result.method === 'download') {
        alert('✅ Image downloaded! You can now share it on social media.');
      } else {
        alert('✅ Image shared successfully!');
      }
    }
  };

  if (!dailyWord) return null;

  return (
    <div className="daily-word-overlay" onClick={onClose}>
      <div className="daily-word-modal" onClick={(e) => e.stopPropagation()}>
        
        <button className="close-daily" onClick={onClose}>✕</button>

        <div className="daily-word-header">
          <div className="daily-icon">📅</div>
          <h2>Word of the Day</h2>
          <p className="daily-date">{new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</p>
        </div>

        <div className="daily-word-content">
          <div className="word-display-daily">
            <div className="arabic-daily">{dailyWord.arabic}</div>
            <div className="transliteration-daily">{dailyWord.transliteration}</div>
            <div className="meaning-daily">{dailyWord.meaning}</div>
          </div>

          <div className="word-details-daily">
            <div className="detail-item-daily">
              <span className="detail-label-daily">Root:</span>
              <span className="detail-value-daily">{dailyWord.root}</span>
            </div>
            <div className="detail-item-daily">
              <span className="detail-label-daily">Category:</span>
              <span className="detail-value-daily">{dailyWord.category}</span>
            </div>
            <div className="detail-item-daily">
              <span className="detail-label-daily">Occurrences:</span>
              <span className="detail-value-daily">{dailyWord.occurrences}×</span>
            </div>
          </div>

          <div className="motivation-quote">
            <p>💡 Learn one word a day, master the Quran's language one step at a time!</p>
          </div>
        </div>

        {/* WORKING SHARE BUTTONS */}
        <div className="daily-actions">
          
          {/* Main Share Button */}
          <button 
            className={`btn-share-main ${shareSuccess ? 'success' : ''}`}
            onClick={handleShare}
          >
            {shareSuccess ? '✅ Shared!' : '📤 Share'}
          </button>

          {/* Quick Share Options */}
          <div className="quick-share-buttons">
            <button 
              className="quick-share-btn whatsapp"
              onClick={() => shareToWhatsApp(dailyWord)}
              title="Share on WhatsApp"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.304-1.654a11.882 11.882 0 005.713 1.456h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413"/>
              </svg>
            </button>

            <button 
              className="quick-share-btn twitter"
              onClick={() => shareToTwitter(dailyWord)}
              title="Share on Twitter/X"
            >
              𝕏
            </button>

            <button 
              className="quick-share-btn telegram"
              onClick={() => shareToTelegram(dailyWord)}
              title="Share on Telegram"
            >
              ✈️
            </button>

            <button 
              className="quick-share-btn copy"
              onClick={handleCopy}
              title="Copy to clipboard"
            >
              📋
            </button>

            <button 
              className="quick-share-btn image"
              onClick={handleDownloadImage}
              title="Download as image"
            >
              🖼️
            </button>

            <button 
              className="quick-share-btn email"
              onClick={() => shareViaEmail(dailyWord)}
              title="Share via email"
            >
              ✉️
            </button>
          </div>

          {/* More Options Button */}
          <button 
            className="btn-more-options"
            onClick={() => setShowShareMenu(!showShareMenu)}
          >
            {showShareMenu ? 'Less Options' : 'More Options'} {showShareMenu ? '▲' : '▼'}
          </button>

          {/* Expanded Share Menu */}
          {showShareMenu && (
            <div className="expanded-share-menu">
              <button onClick={() => shareToFacebook()}>
                <span>📘</span> Share on Facebook
              </button>
              <button onClick={() => shareViaSMS(dailyWord)}>
                <span>💬</span> Share via SMS/Text
              </button>
              <button onClick={handleShareImage}>
                <span>📸</span> Share as Image
              </button>
              <button onClick={handleDownloadImage}>
                <span>⬇️</span> Download Image
              </button>
            </div>
          )}

          {/* Learn Button */}
          <button 
            className="btn-learn-daily"
            onClick={() => {
              onLearn(dailyWord.id);
              onClose();
            }}
          >
            ✓ Mark as Learned
          </button>
        </div>

        <div className="daily-footer">
          <p>Come back tomorrow for a new word! 🌟</p>
        </div>

      </div>
    </div>
  );
};

export default DailyWord;