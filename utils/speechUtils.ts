export const speak = (text: string) => {
  if (!window.speechSynthesis) return;

  // Cancel any ongoing speech to ensure immediate reaction
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.0; // Normal speed
  utterance.pitch = 1.1; // Slightly higher pitch for a friendlier tone
  utterance.volume = 1.0;

  // Try to select a "Google" or "English" voice that sounds good
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(v => v.name.includes('Google US English')) || 
                         voices.find(v => v.name.includes('Samantha')) ||
                         voices.find(v => v.lang.startsWith('en'));
  
  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  window.speechSynthesis.speak(utterance);
};

// Pre-load voices (needed for some browsers like Chrome)
if (window.speechSynthesis) {
    window.speechSynthesis.getVoices();
}
