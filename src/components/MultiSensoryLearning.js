import React, { useState, useRef, useEffect } from 'react';
import './MultiSensoryLearning.css';

const MultiSensoryLearning = ({ word, onClose }) => {
  const [activeMode, setActiveMode] = useState('draw'); // draw, voice, listen, write
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [recordings, setRecordings] = useState([]);
  const canvasRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#0d7377');
  const [brushSize, setBrushSize] = useState(3);

  useEffect(() => {
    if (activeMode === 'draw' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
  }, [activeMode]);

  // ==========================================
  // DRAWING FUNCTIONS
  // ==========================================
  
  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveDrawing = () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `${word.arabic}-${word.meaning}-drawing.png`;
    link.href = dataURL;
    link.click();
    alert('✅ Drawing saved!');
  };

  // ==========================================
  // VOICE RECORDING FUNCTIONS
  // ==========================================
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        setRecordings([...recordings, { url, timestamp: new Date() }]);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('❌ Could not access microphone. Please grant permission.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const playNativeAudio = () => {
    const utterance = new SpeechSynthesisUtterance(word.arabic);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.7;
    speechSynthesis.speak(utterance);
  };

  const compareRecordings = () => {
    if (!audioURL) {
      alert('Please record your voice first!');
      return;
    }
    alert('🎯 Compare Feature:\n\n1. Listen to native pronunciation\n2. Listen to your recording\n3. Practice until they match!');
  };

  return (
    <div className="multisensory-overlay">
      <div className="multisensory-modal">
        
        {/* Header */}
        <div className="multisensory-header">
          <button className="close-multisensory" onClick={onClose}>✕</button>
          <h2>🎨 Multi-Sensory Learning</h2>
          <div className="word-display-multi">
            <span className="word-arabic-multi">{word.arabic}</span>
            <span className="word-meaning-multi">{word.meaning}</span>
          </div>
        </div>

        {/* Mode Tabs */}
        <div className="mode-tabs-multi">
          <button
            className={activeMode === 'draw' ? 'mode-tab active' : 'mode-tab'}
            onClick={() => setActiveMode('draw')}
          >
            ✏️ Draw
          </button>
          <button
            className={activeMode === 'voice' ? 'mode-tab active' : 'mode-tab'}
            onClick={() => setActiveMode('voice')}
          >
            🎤 Voice
          </button>
          <button
            className={activeMode === 'listen' ? 'mode-tab active' : 'mode-tab'}
            onClick={() => setActiveMode('listen')}
          >
            🔊 Listen
          </button>
          <button
            className={activeMode === 'write' ? 'mode-tab active' : 'mode-tab'}
            onClick={() => setActiveMode('write')}
          >
            ✍️ Write
          </button>
        </div>

        {/* Content */}
        <div className="multisensory-content">
          
          {/* DRAW MODE */}
          {activeMode === 'draw' && (
            <div className="draw-mode">
              <div className="draw-instructions">
                <h3>✏️ Draw the Word</h3>
                <p>Practice writing <strong>{word.arabic}</strong> by drawing it below</p>
              </div>

              <div className="canvas-container">
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={400}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  className="drawing-canvas"
                />
              </div>

              <div className="drawing-controls">
                <div className="control-group">
                  <label>Color:</label>
                  <div className="color-options">
                    {['#0d7377', '#000000', '#ff6b6b', '#4dabf7', '#51cf66', '#ffc107'].map(color => (
                      <button
                        key={color}
                        className={`color-btn ${brushColor === color ? 'active' : ''}`}
                        style={{ backgroundColor: color }}
                        onClick={() => setBrushColor(color)}
                      />
                    ))}
                  </div>
                </div>

                <div className="control-group">
                  <label>Size:</label>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={brushSize}
                    onChange={(e) => setBrushSize(parseInt(e.target.value))}
                    className="size-slider"
                  />
                  <span className="size-value">{brushSize}px</span>
                </div>
              </div>

              <div className="drawing-actions">
                <button className="btn-clear" onClick={clearCanvas}>
                  🗑️ Clear
                </button>
                <button className="btn-save-drawing" onClick={saveDrawing}>
                  💾 Save Drawing
                </button>
              </div>

              <div className="learning-tip">
                <strong>💡 Tip:</strong> Writing engages motor memory, helping you remember 2x better!
              </div>
            </div>
          )}

          {/* VOICE MODE */}
          {activeMode === 'voice' && (
            <div className="voice-mode">
              <div className="voice-instructions">
                <h3>🎤 Record Your Voice</h3>
                <p>Practice pronouncing <strong>{word.arabic}</strong></p>
              </div>

              <div className="recording-area">
                <div className={`recording-visualizer ${isRecording ? 'active' : ''}`}>
                  {isRecording ? (
                    <>
                      <div className="pulse-ring"></div>
                      <div className="recording-icon">🎤</div>
                      <p className="recording-text">Recording...</p>
                    </>
                  ) : (
                    <>
                      <div className="mic-icon">🎤</div>
                      <p className="ready-text">Ready to record</p>
                    </>
                  )}
                </div>

                <div className="recording-controls">
                  {!isRecording ? (
                    <button className="btn-record" onClick={startRecording}>
                      ⏺️ Start Recording
                    </button>
                  ) : (
                    <button className="btn-stop-recording" onClick={stopRecording}>
                      ⏹️ Stop Recording
                    </button>
                  )}
                </div>

                {audioURL && (
                  <div className="playback-section">
                    <h4>Your Recording:</h4>
                    <audio src={audioURL} controls className="audio-player" />
                    <div className="playback-actions">
                      <button className="btn-compare" onClick={compareRecordings}>
                        🔄 Compare with Native
                      </button>
                      <button className="btn-play-native" onClick={playNativeAudio}>
                        🔊 Hear Native Pronunciation
                      </button>
                    </div>
                  </div>
                )}

                {recordings.length > 0 && (
                  <div className="recordings-history">
                    <h4>Previous Recordings ({recordings.length}):</h4>
                    {recordings.slice(-3).reverse().map((rec, idx) => (
                      <div key={idx} className="recording-item">
                        <span>Recording {recordings.length - idx}</span>
                        <audio src={rec.url} controls className="audio-player-small" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="learning-tip">
                <strong>💡 Tip:</strong> Speaking aloud activates different brain regions, strengthening memory!
              </div>
            </div>
          )}

          {/* LISTEN MODE */}
          {activeMode === 'listen' && (
            <div className="listen-mode">
              <div className="listen-instructions">
                <h3>🔊 Active Listening</h3>
                <p>Listen carefully and repeat</p>
              </div>

              <div className="listen-area">
                <div className="word-display-large">
                  <div className="arabic-huge">{word.arabic}</div>
                  <div className="transliteration-huge">{word.transliteration}</div>
                </div>

                <button className="btn-play-large" onClick={playNativeAudio}>
                  <span className="play-icon">▶️</span>
                  <span>Play Pronunciation</span>
                </button>

                <div className="listen-steps">
                  <div className="step">
                    <div className="step-number">1</div>
                    <div className="step-text">Listen to the pronunciation</div>
                  </div>
                  <div className="step">
                    <div className="step-number">2</div>
                    <div className="step-text">Repeat out loud 3 times</div>
                  </div>
                  <div className="step">
                    <div className="step-number">3</div>
                    <div className="step-text">Listen again to compare</div>
                  </div>
                </div>
              </div>

              <div className="learning-tip">
                <strong>💡 Tip:</strong> Repeat each word 3-5 times for best retention!
              </div>
            </div>
          )}

          {/* WRITE MODE */}
          {activeMode === 'write' && (
            <div className="write-mode">
              <div className="write-instructions">
                <h3>✍️ Handwriting Practice</h3>
                <p>Practice writing <strong>{word.arabic}</strong> on paper</p>
              </div>

              <div className="write-guide">
                <div className="guide-card">
                  <h4>📝 How to Practice:</h4>
                  <ol>
                    <li>Get a piece of paper and pen</li>
                    <li>Look at the word: <strong className="arabic-example">{word.arabic}</strong></li>
                    <li>Write it 10 times without looking</li>
                    <li>Compare your writing with the original</li>
                    <li>Repeat until you can write it perfectly</li>
                  </ol>
                </div>

                <div className="reference-card">
                  <h4>Reference:</h4>
                  <div className="word-reference">
                    <div className="ref-arabic">{word.arabic}</div>
                    <div className="ref-transliteration">{word.transliteration}</div>
                    <div className="ref-meaning">{word.meaning}</div>
                    <div className="ref-root">Root: {word.root}</div>
                  </div>
                </div>

                <div className="practice-tracker">
                  <h4>✓ Practice Tracker:</h4>
                  <p>Mark off each time you write the word:</p>
                  <div className="checkboxes">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <label key={num} className="checkbox-item">
                        <input type="checkbox" />
                        <span>{num}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="learning-tip">
                <strong>💡 Tip:</strong> Handwriting creates stronger neural pathways than typing!
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="multisensory-footer">
          <p className="science-note">
            🧠 <strong>Learning Science:</strong> Using multiple senses together can improve retention by up to 400%!
          </p>
        </div>

      </div>
    </div>
  );
};

export default MultiSensoryLearning;