// Improved speech synthesis utility for Arabic pronunciation

let voicesLoaded = false;
let availableVoices = [];

// Force load voices with multiple attempts
const loadVoices = () => {
  return new Promise((resolve) => {
    let attempts = 0;
    const maxAttempts = 10;

    const checkVoices = () => {
      availableVoices = window.speechSynthesis.getVoices();
      
      if (availableVoices.length > 0) {
        voicesLoaded = true;
        console.log('✅ Voices loaded:', availableVoices.length);
        console.log('Arabic voices:', availableVoices.filter(v => v.lang.includes('ar')));
        resolve(availableVoices);
      } else {
        attempts++;
        if (attempts < maxAttempts) {
          console.log(`⏳ Waiting for voices... attempt ${attempts}`);
          setTimeout(checkVoices, 100);
        } else {
          console.warn('⚠️ No voices loaded after 10 attempts');
          resolve([]);
        }
      }
    };

    // Start checking
    checkVoices();

    // Also listen for the voices changed event
    window.speechSynthesis.onvoiceschanged = () => {
      availableVoices = window.speechSynthesis.getVoices();
      voicesLoaded = true;
      console.log('🔄 Voices changed event fired:', availableVoices.length);
      resolve(availableVoices);
    };
  });
};

// Pre-load voices when module loads
if ('speechSynthesis' in window) {
  loadVoices();
}

export const speakArabic = async (text, rate = 0.8) => {
  console.log('🎤 speakArabic called with:', text);

  // Check if browser supports speech synthesis
  if (!('speechSynthesis' in window)) {
    console.error('❌ Speech synthesis NOT supported');
    alert('🔇 Your browser does not support text-to-speech. Try Chrome or Edge!');
    return false;
  }

  console.log('✅ Speech synthesis IS supported');

  // Cancel any ongoing speech first
  window.speechSynthesis.cancel();
  console.log('🛑 Cancelled any previous speech');

  // Make sure voices are loaded
  if (!voicesLoaded || availableVoices.length === 0) {
    console.log('⏳ Voices not loaded yet, loading now...');
    await loadVoices();
  }

  console.log('📢 Total voices available:', availableVoices.length);

  // Try to find an Arabic voice
  const arabicVoices = availableVoices.filter(voice => 
    voice.lang.toLowerCase().includes('ar')
  );

  console.log('🇸🇦 Arabic voices found:', arabicVoices.length);
  if (arabicVoices.length > 0) {
    console.log('Arabic voice names:', arabicVoices.map(v => `${v.name} (${v.lang})`));
  }

  const utterance = new SpeechSynthesisUtterance(text);
  
  // Use Arabic voice if available
  if (arabicVoices.length > 0) {
    utterance.voice = arabicVoices[0];
    utterance.lang = arabicVoices[0].lang;
    console.log('🎯 Using voice:', arabicVoices[0].name);
  } else {
    utterance.lang = 'ar-SA';
    console.log('⚠️ No Arabic voice, using ar-SA language code');
  }
  
  utterance.rate = rate;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;

  // Add comprehensive event listeners
  utterance.onstart = (event) => {
    console.log('🔊 AUDIO STARTED', event);
  };
  
  utterance.onend = (event) => {
    console.log('✅ AUDIO ENDED', event);
  };
  
  utterance.onerror = (event) => {
    console.error('❌ AUDIO ERROR:', event.error, event);
    alert(`Audio error: ${event.error}. Check console for details.`);
  };

  utterance.onpause = () => {
    console.log('⏸️ Audio paused');
  };

  utterance.onresume = () => {
    console.log('▶️ Audio resumed');
  };

  utterance.onboundary = (event) => {
    console.log('📍 Boundary:', event.name, 'at', event.charIndex);
  };

  console.log('🚀 About to speak...');
  window.speechSynthesis.speak(utterance);
  console.log('✅ Speak command executed');

  // Check if it's actually speaking
  setTimeout(() => {
    const speaking = window.speechSynthesis.speaking;
    const pending = window.speechSynthesis.pending;
    console.log('📊 Status check - Speaking:', speaking, 'Pending:', pending);
  }, 100);

  return true;
};

// Stop any ongoing speech
export const stopSpeech = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    console.log('🛑 Speech stopped');
  }
};

// Check if speech synthesis is available
export const isSpeechAvailable = () => {
  const available = 'speechSynthesis' in window;
  console.log('Speech available:', available);
  return available;
};

// Get list of available voices (with forced load)
export const getAvailableVoices = async () => {
  if (!voicesLoaded) {
    await loadVoices();
  }
  return availableVoices;
};