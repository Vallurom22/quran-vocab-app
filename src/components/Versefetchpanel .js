import React, { useState } from 'react';
import './VerseFetchPanel.css';
import { batchFetchVerses, saveVersesToCache, loadVersesFromCache, downloadVersesAsJSON } from '../utils/AutoVerseFetcher';

const VerseFetchPanel = ({ words, onClose }) => {
  const [isFetching, setIsFetching] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fetchedCount, setFetchedCount] = useState(0);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleStartFetch = async () => {
    setIsFetching(true);
    setProgress(0);
    setFetchedCount(0);
    setError(null);
    
    try {
      const verses = await batchFetchVerses(
        words,
        (prog, count) => {
          setProgress(prog);
          setFetchedCount(count);
        }
      );
      
      setResults(verses);
      
      // Save to cache
      saveVersesToCache(verses);
      
      setIsFetching(false);
      
    } catch (err) {
      setError(err.message);
      setIsFetching(false);
    }
  };

  const handleLoadCache = () => {
    const cached = loadVersesFromCache();
    if (cached) {
      setResults(cached);
      setFetchedCount(Object.keys(cached).length);
    } else {
      alert('No cached verses found');
    }
  };

  const handleDownload = () => {
    if (results) {
      downloadVersesAsJSON(results);
    }
  };

  const cachedVerses = loadVersesFromCache();
  const cacheDate = localStorage.getItem('verses_cache_date');

  return (
    <div className="verse-fetch-overlay">
      <div className="verse-fetch-panel">
        
        {/* Header */}
        <div className="panel-header">
          <h2>🤖 Auto-Fetch Quran Verses</h2>
          <button className="close-panel" onClick={onClose}>✕</button>
        </div>

        {/* Info */}
        <div className="panel-info">
          <p>Automatically fetch real Quran verses for all {words.length} words using the Quran.com API.</p>
          <div className="info-stats">
            <div className="info-item">
              <span className="info-label">Total Words:</span>
              <span className="info-value">{words.length}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Cached:</span>
              <span className="info-value">{cachedVerses ? Object.keys(cachedVerses).length : 0}</span>
            </div>
            {cacheDate && (
              <div className="info-item">
                <span className="info-label">Last Updated:</span>
                <span className="info-value">{new Date(cacheDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Warning */}
        <div className="panel-warning">
          <div className="warning-icon">⚠️</div>
          <div className="warning-content">
            <h4>Important Notes:</h4>
            <ul>
              <li>This will fetch ~{words.length * 3} verses from the API</li>
              <li>Process takes ~{Math.ceil(words.length / 10)} minutes (rate-limited)</li>
              <li>Results are cached for 7 days</li>
              <li>Some words may not find exact matches</li>
            </ul>
          </div>
        </div>

        {/* Progress */}
        {isFetching && (
          <div className="fetch-progress">
            <div className="progress-header">
              <span>Fetching verses...</span>
              <span>{progress.toFixed(0)}%</span>
            </div>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="progress-stats">
              <span>✓ {fetchedCount} words processed</span>
              <span>⏱️ Est. {Math.ceil((words.length - fetchedCount) / 10)} min remaining</span>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="fetch-error">
            <div className="error-icon">❌</div>
            <div className="error-message">{error}</div>
          </div>
        )}

        {/* Results */}
        {results && !isFetching && (
          <div className="fetch-results">
            <div className="results-header">
              <div className="results-icon">✅</div>
              <h3>Fetch Complete!</h3>
            </div>
            <div className="results-stats">
              <div className="result-stat">
                <span className="stat-number">{fetchedCount}</span>
                <span className="stat-label">Words with verses</span>
              </div>
              <div className="result-stat">
                <span className="stat-number">{words.length - fetchedCount}</span>
                <span className="stat-label">No matches</span>
              </div>
              <div className="result-stat">
                <span className="stat-number">{((fetchedCount / words.length) * 100).toFixed(0)}%</span>
                <span className="stat-label">Success rate</span>
              </div>
            </div>
            
            <div className="results-actions">
              <button className="btn-download" onClick={handleDownload}>
                📥 Download JSON
              </button>
              <button className="btn-success" onClick={onClose}>
                ✓ Done
              </button>
            </div>
          </div>
        )}

        {/* Actions */}
        {!isFetching && !results && (
          <div className="panel-actions">
            <button 
              className="btn-primary-fetch"
              onClick={handleStartFetch}
              disabled={isFetching}
            >
              🚀 Start Auto-Fetch
            </button>
            
            {cachedVerses && (
              <button className="btn-secondary-fetch" onClick={handleLoadCache}>
                📂 Load Cached Verses
              </button>
            )}
          </div>
        )}

        {/* How it works */}
        <div className="panel-how">
          <h4>How It Works:</h4>
          <ol>
            <li>Searches Quran.com API for each Arabic word</li>
            <li>Finds top 3 verses containing that word</li>
            <li>Generates context based on word category</li>
            <li>Creates basic grammar & etymology info</li>
            <li>Caches results locally for 7 days</li>
          </ol>
        </div>

      </div>
    </div>
  );
};

export default VerseFetchPanel;