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
 * @returns A cleanup function that stops watching and cancels any pending save.
 */
export function initAutoSave(): () => void {
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  const unsubscribe = subscribe(store, () => {
    if (debounceTimer !== null) {
      clearTimeout(debounceTimer);
    }

    debounceTimer = setTimeout(() => {
      debounceTimer = null;
      storageService.saveAppConfig(store);
      listeners.forEach((l) => l());
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
