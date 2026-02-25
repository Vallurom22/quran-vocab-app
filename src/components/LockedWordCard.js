/**
 * 🔒 LOCKED WORD CARD
 * Shows blurred premium words with unlock button
 */

import React from 'react';
import './LockedWordCard.css';

const LockedWordCard = ({ word, onUnlock }) => {
  return (
    <div className="locked-word-card" onClick={onUnlock}>
      {/* Blurred content preview */}
      <div className="word-preview-blurred">
        <div className="arabic-blurred">●●●●●</div>
        <div className="transliteration-blurred">●●●●●●●</div>
        <div className="meaning-blurred">●●●●●●●●</div>
      </div>

      {/* Premium overlay */}
      <div className="premium-overlay-card">
        <div className="lock-icon-large">🔒</div>
        <div className="premium-text">
          <strong>Premium Word</strong>
          <span>Unlock with Premium</span>
        </div>
        <button className="unlock-btn-card">
          Unlock Now
        </button>
      </div>

      {/* Premium badge */}
      <div className="premium-badge-corner">⭐</div>
    </div>
  );
};

export default LockedWordCard;
