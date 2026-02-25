import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { initAutoSave, onSave } from './autoSave';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

// Mock the Valtio store
vi.mock('../state', () => ({
  store: {
    homePageId: 'h1',
    currentPageId: 'h1',
    isEditMode: false,
    pages: [],
  },
}));

// Capture the subscribe callback so tests can trigger it manually
let subscribedCallback: (() => void) | null = null;

vi.mock('valtio', () => ({
  subscribe: (_target: unknown, cb: () => void) => {
    subscribedCallback = cb;
    return () => {
      subscribedCallback = null;
    };
  },
}));

// Mock storageService
vi.mock('./storageService', () => ({
  storageService: {
    saveAppConfig: vi.fn(),
  },
}));

// Import after mocks are set up
import { storageService } from './storageService';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function triggerStoreChange() {
  if (subscribedCallback) subscribedCallback();
}

// ---------------------------------------------------------------------------
// Setup / teardown
// ---------------------------------------------------------------------------
beforeEach(() => {
  vi.useFakeTimers();
  vi.clearAllMocks();
  subscribedCallback = null;
});

afterEach(() => {
  vi.useRealTimers();
});

// ---------------------------------------------------------------------------
// initAutoSave
// ---------------------------------------------------------------------------
describe('initAutoSave', () => {
  it('subscribes to the store immediately', () => {
    const cleanup = initAutoSave();
    expect(subscribedCallback).not.toBeNull();
    cleanup();
  });

  it('does not save immediately after a store change (debounce)', () => {
    const cleanup = initAutoSave();
    triggerStoreChange();
    expect(storageService.saveAppConfig).not.toHaveBeenCalled();
    cleanup();
  });

  it('saves after the debounce delay', () => {
    const cleanup = initAutoSave();
    triggerStoreChange();
    vi.advanceTimersByTime(500);
    expect(storageService.saveAppConfig).toHaveBeenCalledTimes(1);
    cleanup();
  });

  it('debounces rapid changes into a single save', () => {
    const cleanup = initAutoSave();
    triggerStoreChange();
    vi.advanceTimersByTime(200);
    triggerStoreChange();
    vi.advanceTimersByTime(200);
    triggerStoreChange();
    vi.advanceTimersByTime(500);
    expect(storageService.saveAppConfig).toHaveBeenCalledTimes(1);
    cleanup();
  });

  it('notifies onSave listeners after saving', () => {
    const listener = vi.fn();
    const unsubscribe = onSave(listener);
    const cleanup = initAutoSave();
    triggerStoreChange();
    vi.advanceTimersByTime(500);
    expect(listener).toHaveBeenCalledTimes(1);
    unsubscribe();
    cleanup();
  });

  it('cleanup cancels a pending debounced save', () => {
    const cleanup = initAutoSave();
    triggerStoreChange();
    cleanup(); // cancel before debounce fires
    vi.advanceTimersByTime(500);
    expect(storageService.saveAppConfig).not.toHaveBeenCalled();
  });

  it('cleanup stops future store changes from saving', () => {
    const cleanup = initAutoSave();
    cleanup();
    subscribedCallback = null; // simulate unsubscribe clearing the callback
    triggerStoreChange();
    vi.advanceTimersByTime(500);
    expect(storageService.saveAppConfig).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// onSave
// ---------------------------------------------------------------------------
describe('onSave', () => {
  it('returns an unsubscribe function that removes the listener', () => {
    const listener = vi.fn();
    const unsubscribe = onSave(listener);
    unsubscribe();
    const cleanup = initAutoSave();
    triggerStoreChange();
    vi.advanceTimersByTime(500);
    expect(listener).not.toHaveBeenCalled();
    cleanup();
  });

  it('supports multiple listeners at the same time', () => {
    const l1 = vi.fn();
    const l2 = vi.fn();
    const unsub1 = onSave(l1);
    const unsub2 = onSave(l2);
    const cleanup = initAutoSave();
    triggerStoreChange();
    vi.advanceTimersByTime(500);
    expect(l1).toHaveBeenCalledTimes(1);
    expect(l2).toHaveBeenCalledTimes(1);
    unsub1();
    unsub2();
    cleanup();
  });
});
