/**
 * Text-to-Speech service — Web Speech API implementation.
 *
 * Uses the device-local speech engine (Web Speech API), which works
 * fully offline on modern tablets (Android / iOS both ship built-in
 * offline voices).  No model file needs to be downloaded; the TTS
 * download phase in the first-launch worker stays empty.
 *
 * Public API:
 *   initTts()   — call once on app start to pre-select the French voice.
 *   speak(text) — fire-and-forget synthesis; updates ttsState.
 *   ttsState    — reactive Valtio proxy: { status, errorMessage }.
 */

import { proxy } from 'valtio';

// ---------------------------------------------------------------------------
// TTS State
// ---------------------------------------------------------------------------

export type TtsStatus = 'idle' | 'speaking' | 'error';

interface TtsStateShape {
  status: TtsStatus;
  errorMessage: string | null;
}

/**
 * Reactive TTS status observable via Valtio.
 * Subscribe in components that need to react to TTS state changes.
 */
export const ttsState = proxy<TtsStateShape>({
  status: 'idle',
  errorMessage: null,
});

// ---------------------------------------------------------------------------
// Voice selection
// ---------------------------------------------------------------------------

/** The pre-selected French female voice, or null if unavailable. */
let selectedVoice: SpeechSynthesisVoice | null = null;

/**
 * Pick the best French female voice from the provided list.
 *
 * Exported for unit-testing.
 */
export function pickFrenchFemaleVoice(
  voices: SpeechSynthesisVoice[]
): SpeechSynthesisVoice | null {
  const frenchVoices = voices.filter((v) => v.lang.startsWith('fr'));
  if (frenchVoices.length === 0) return null;

  // Prefer voices whose names hint at a female speaker
  return (
    frenchVoices.find((v) =>
      /female|woman|marie|am[eé]lie|siwis/i.test(v.name)
    ) ?? frenchVoices[0]
  );
}

// ---------------------------------------------------------------------------
// Initialisation
// ---------------------------------------------------------------------------

/**
 * Module-level callback so the same reference can be passed to both
 * addEventListener and removeEventListener, preventing duplicate listeners
 * if initTts is called more than once.
 */
function loadVoice(): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  selectedVoice = pickFrenchFemaleVoice(window.speechSynthesis.getVoices());
}

/**
 * Initialise the TTS engine by selecting the best available French female
 * voice.  Must be called once when the app starts.
 *
 * Chromium loads the voice list asynchronously, so we also register a
 * `voiceschanged` listener to update the selection when the list arrives.
 * The listener is removed before being added so that repeated calls to
 * `initTts` never register it more than once.
 */
export function initTts(): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  loadVoice();
  window.speechSynthesis.removeEventListener('voiceschanged', loadVoice);
  window.speechSynthesis.addEventListener('voiceschanged', loadVoice);
}

// ---------------------------------------------------------------------------
// speak()
// ---------------------------------------------------------------------------

/**
 * Speak the given text aloud using the device-local TTS engine.
 *
 * - Fire-and-forget: returns immediately.
 * - Updates `ttsState.status` to `'speaking'` while audio plays, then `'idle'`.
 * - On error: updates `ttsState.status` to `'error'` and `ttsState.errorMessage`.
 *
 * @param text - Text to synthesise
 */
export function speak(text: string): void {
  if (!text || typeof window === 'undefined' || !window.speechSynthesis) {
    return;
  }

  // Cancel any speech already in progress
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'fr-FR';
  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }

  utterance.onstart = () => {
    ttsState.status = 'speaking';
    ttsState.errorMessage = null;
  };

  utterance.onend = () => {
    ttsState.status = 'idle';
  };

  utterance.onerror = (event: SpeechSynthesisErrorEvent) => {
    ttsState.status = 'error';
    ttsState.errorMessage = event.error;
    console.error('[TTS] Speech synthesis error:', event.error);
  };

  window.speechSynthesis.speak(utterance);
}
