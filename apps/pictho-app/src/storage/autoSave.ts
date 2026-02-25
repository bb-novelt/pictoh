/**
 * Auto-save module – subscribes to Valtio store changes and persists the
 * AppConfig to localStorage after a short debounce.
 *
 * Usage:
 *   const cleanup = initAutoSave();   // call once on mount
 *   cleanup();                        // call on unmount (optional)
 *
 * Consumers that want to react to saves (e.g. a save indicator) can register
 * via onSave() and will be notified after each successful write.
 */
import { subscribe } from 'valtio';
import { store } from '../state';
import { storageService } from './storageService';

/** Debounce delay in milliseconds before persisting a state change. */
const DEBOUNCE_MS = 500;

/** Callbacks notified after every successful save. */
type SaveListener = () => void;
const listeners = new Set<SaveListener>();

/**
 * Register a callback that is called after every successful save.
 * Returns an unsubscribe function.
 */
export function onSave(listener: SaveListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * Start watching the Valtio store for changes and auto-saving to localStorage.
 * Saves are debounced by DEBOUNCE_MS to avoid writing on every keystroke.
 *
 * Navigation changes (currentPageId) are always persisted but do NOT trigger
 * the save indicator — only meaningful edits do.
 *
 * @returns A cleanup function that stops watching and cancels any pending save.
 */
export function initAutoSave(): () => void {
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;
  let prevCurrentPageId = store.currentPageId;
  /** True when the current debounce window contains at least one non-navigation change. */
  let showIndicator = false;

  const unsubscribe = subscribe(store, () => {
    const isNavigation = store.currentPageId !== prevCurrentPageId;
    prevCurrentPageId = store.currentPageId;

    // Accumulate: if any change in this debounce window is not a navigation,
    // the indicator should be shown after the save.
    if (!isNavigation) {
      showIndicator = true;
    }

    if (debounceTimer !== null) {
      clearTimeout(debounceTimer);
    }

    debounceTimer = setTimeout(() => {
      debounceTimer = null;
      storageService.saveAppConfig(store);
      if (showIndicator) {
        listeners.forEach((l) => l());
      }
      showIndicator = false;
    }, DEBOUNCE_MS);
  });

  return () => {
    unsubscribe();
    if (debounceTimer !== null) {
      clearTimeout(debounceTimer);
      debounceTimer = null;
    }
  };
}
