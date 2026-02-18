import React from 'react';
import './Loading.css';

const Loading = ({ message = 'Loading Quranic Vocabulary...' }) => {
  return (
    <div className="loading-container">
      <div className="loading-spinner">
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>
      <p className="loading-text">{message}</p>
      <div className="loading-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
};

export default Loading;
