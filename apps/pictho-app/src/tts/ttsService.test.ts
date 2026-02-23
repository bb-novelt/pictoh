import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { speak, initTts, pickFrenchFemaleVoice, ttsState } from './ttsService';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeVoice(lang: string, name: string): SpeechSynthesisVoice {
  return { lang, name } as SpeechSynthesisVoice;
}

/** Minimal SpeechSynthesisUtterance mock used to capture callbacks. */
class MockUtterance {
  lang = '';
  voice: SpeechSynthesisVoice | null = null;
  onstart: (() => void) | null = null;
  onend: (() => void) | null = null;
  onerror: ((event: { error: string }) => void) | null = null;
  constructor(public text: string) {}
}

// ---------------------------------------------------------------------------
// pickFrenchFemaleVoice
// ---------------------------------------------------------------------------

describe('pickFrenchFemaleVoice', () => {
  it('returns null when the voice list is empty', () => {
    expect(pickFrenchFemaleVoice([])).toBeNull();
  });

  it('returns null when no French voices are available', () => {
    const voices = [makeVoice('en-US', 'Samantha'), makeVoice('de-DE', 'Anna')];
    expect(pickFrenchFemaleVoice(voices)).toBeNull();
  });

  it('returns the first French voice when no female voice is detected', () => {
    const pierre = makeVoice('fr-FR', 'Pierre');
    const jean = makeVoice('fr-FR', 'Jean');
    expect(pickFrenchFemaleVoice([pierre, jean])).toBe(pierre);
  });

  it('prefers a voice named Marie over a non-female voice', () => {
    const pierre = makeVoice('fr-FR', 'Pierre');
    const marie = makeVoice('fr-FR', 'Marie');
    expect(pickFrenchFemaleVoice([pierre, marie])).toBe(marie);
  });

  it('matches a voice named Amélie', () => {
    const pierre = makeVoice('fr-FR', 'Pierre');
    const amelie = makeVoice('fr-FR', 'Amélie');
    expect(pickFrenchFemaleVoice([pierre, amelie])).toBe(amelie);
  });

  it('matches a voice with "siwis" in the name (Piper fr_FR-siwis)', () => {
    const siwis = makeVoice('fr-FR', 'fr_FR-siwis-medium');
    expect(pickFrenchFemaleVoice([siwis])).toBe(siwis);
  });

  it('accepts fr-CA voices as French', () => {
    const frCa = makeVoice('fr-CA', 'Chantal');
    expect(pickFrenchFemaleVoice([frCa])).toBe(frCa);
  });
});

// ---------------------------------------------------------------------------
// speak()
// ---------------------------------------------------------------------------

describe('speak', () => {
  let mockSpeak: ReturnType<typeof vi.fn>;
  let mockCancel: ReturnType<typeof vi.fn>;
  let capturedUtterance: MockUtterance | null;

  beforeEach(() => {
    capturedUtterance = null;
    mockSpeak = vi.fn((utterance: MockUtterance) => {
      capturedUtterance = utterance;
    });
    mockCancel = vi.fn();

    vi.stubGlobal('speechSynthesis', {
      speak: mockSpeak,
      cancel: mockCancel,
      getVoices: vi.fn().mockReturnValue([]),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
    vi.stubGlobal('SpeechSynthesisUtterance', MockUtterance);

    // Reset reactive state before each test
    ttsState.status = 'idle';
    ttsState.errorMessage = null;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('does nothing when text is empty', () => {
    speak('');
    expect(mockSpeak).not.toHaveBeenCalled();
  });

  it('cancels any ongoing speech before speaking', () => {
    speak('bonjour');
    expect(mockCancel).toHaveBeenCalled();
  });

  it('calls speechSynthesis.speak with an utterance', () => {
    speak('bonjour');
    expect(mockSpeak).toHaveBeenCalledTimes(1);
  });

  it('sets utterance lang to fr-FR', () => {
    speak('bonjour');
    expect(capturedUtterance?.lang).toBe('fr-FR');
  });

  it('updates ttsState.status to "speaking" when utterance starts', () => {
    speak('bonjour');
    capturedUtterance?.onstart?.();
    expect(ttsState.status).toBe('speaking');
    expect(ttsState.errorMessage).toBeNull();
  });

  it('updates ttsState.status to "idle" when utterance ends', () => {
    speak('bonjour');
    capturedUtterance?.onstart?.();
    capturedUtterance?.onend?.();
    expect(ttsState.status).toBe('idle');
  });

  it('updates ttsState.status to "error" on synthesis error', () => {
    speak('bonjour');
    capturedUtterance?.onerror?.({ error: 'interrupted' });
    expect(ttsState.status).toBe('error');
    expect(ttsState.errorMessage).toBe('interrupted');
  });

  it('does not throw when speechSynthesis is unavailable', () => {
    vi.stubGlobal('speechSynthesis', undefined);
    expect(() => speak('bonjour')).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// initTts()
// ---------------------------------------------------------------------------

describe('initTts', () => {
  beforeEach(() => {
    vi.stubGlobal('speechSynthesis', {
      speak: vi.fn(),
      cancel: vi.fn(),
      getVoices: vi.fn().mockReturnValue([]),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('does not throw when speechSynthesis is unavailable', () => {
    vi.stubGlobal('speechSynthesis', undefined);
    expect(() => initTts()).not.toThrow();
  });

  it('calls getVoices on init', () => {
    initTts();
    expect(window.speechSynthesis.getVoices).toHaveBeenCalled();
  });

  it('registers a voiceschanged listener', () => {
    initTts();
    expect(window.speechSynthesis.addEventListener).toHaveBeenCalledWith(
      'voiceschanged',
      expect.any(Function)
    );
  });

  it('updates selectedVoice when voiceschanged fires with French voices', () => {
    const marie = makeVoice('fr-FR', 'Marie');
    const addListenerMock = vi.fn();
    const getVoicesMock = vi.fn().mockReturnValue([]); // start with no voices
    vi.stubGlobal('speechSynthesis', {
      speak: vi.fn(),
      cancel: vi.fn(),
      getVoices: getVoicesMock,
      addEventListener: addListenerMock,
      removeEventListener: vi.fn(),
    });
    vi.stubGlobal('SpeechSynthesisUtterance', MockUtterance);

    initTts(); // selectedVoice is null (no voices yet)

    // Simulate the browser making voices available and firing voiceschanged
    getVoicesMock.mockReturnValue([marie]);
    const listener = addListenerMock.mock.calls[0][1] as () => void;
    listener(); // loadVoice() → selectedVoice = marie

    // speak() should now attach the selected voice to the utterance
    let capturedUtterance: MockUtterance | null = null;
    (
      window.speechSynthesis.speak as ReturnType<typeof vi.fn>
    ).mockImplementation((utterance: MockUtterance) => {
      capturedUtterance = utterance;
    });
    speak('test');

    expect(capturedUtterance).not.toBeNull();
    expect(capturedUtterance?.voice).toBe(marie);
  });
});
