/**
 * Talking and listening, with the browser's built-in Web Speech API.
 *
 *   Speech.canListen()  speech recognition available (Chrome, Edge, Safari)
 *   Speech.listen(...)  hear one answer; returns a stop() function
 *   Speech.canSpeak()   speech synthesis available (all modern browsers)
 *   Speech.say(text)    read a text aloud (cancels what was being said)
 *
 * Note: in Chrome, recognition is done by Google's servers, so it needs internet.
 */
const LOCALES = { en: 'en-US', fr: 'fr-FR' };
const Recognition = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);

export const Speech = {
  canListen: () => Boolean(Recognition),

  /**
   * @param {'en'|'fr'} lang
   * @param {{ onResult: (alternatives: string[]) => void, onEnd?: () => void, onError?: (code: string) => void }} handlers
   */
  listen(lang, { onResult, onEnd = () => {}, onError = () => {} }) {
    if (!Recognition) { onError('unsupported'); return () => {}; }
    const rec = new Recognition();
    rec.lang = LOCALES[lang] || lang;
    rec.interimResults = false;
    rec.maxAlternatives = 5;
    rec.onresult = e => onResult([...e.results[0]].map(alt => alt.transcript.trim()));
    rec.onerror = e => onError(e.error);
    rec.onend = onEnd;
    try { rec.start(); } catch { onError('busy'); }
    return () => { try { rec.abort(); } catch { /* already stopped */ } };
  },

  canSpeak: () => typeof window !== 'undefined' && 'speechSynthesis' in window,

  say(text, lang, rate = 1) {
    if (!Speech.canSpeak() || !text) return;
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = LOCALES[lang] || lang;
    utterance.rate = rate;
    speechSynthesis.speak(utterance);
  },

  stopTalking() { if (Speech.canSpeak()) speechSynthesis.cancel(); },
};
