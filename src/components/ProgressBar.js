import React from 'react';
import './ProgressBar.css';

const ProgressBar = ({ current, total, label = 'Progress', showPercentage = true }) => {
  const percentage = Math.round((current / total) * 100);
  
  return (
    <div className="progress-container">
      <div className="progress-header">
        <span className="progress-label">{label}</span>
        <span className="progress-numbers">
          {current} / {total}
        </span>
      </div>
      <div className="progress-bar-bg">
        <div 
          className="progress-bar-fill" 
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin="0"
          aria-valuemax="100"
        >
          {showPercentage && percentage > 10 && (
            <span className="progress-percentage">{percentage}%</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
