import { useEffect, useRef } from 'react';
import { subscribeKey } from 'valtio/utils';
import { store } from '../state';
import { enableEditMode } from '../state/actions/editModeActions';

/** Number of clicks required to activate edit mode */
const CLICK_THRESHOLD = 5;

/** Time window (ms) within which clicks must occur */
const TIME_WINDOW_MS = 2000;

/**
 * Tracks clicks anywhere on the screen and activates edit mode when
 * CLICK_THRESHOLD clicks occur within TIME_WINDOW_MS milliseconds.
 *
 * - Counter resets on timeout or whenever edit mode changes.
 * - Does nothing when edit mode is already active.
 */
export function useClickTracker(): void {
  const clickCountRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function resetCounter() {
      clickCountRef.current = 0;
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }

    function handleClick() {
      // Read the store proxy directly to always get the current value
      if (store.isEditMode) return;

      clickCountRef.current += 1;

      // Clear the existing reset timer on every click
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }

      if (clickCountRef.current >= CLICK_THRESHOLD) {
        clickCountRef.current = 0;
        timeoutRef.current = null;
        enableEditMode();
        return;
      }

      // Start a new reset timer
      timeoutRef.current = setTimeout(() => {
        clickCountRef.current = 0;
        timeoutRef.current = null;
      }, TIME_WINDOW_MS);
    }

    // Reset counter whenever edit mode is toggled
    const unsubscribe = subscribeKey(store, 'isEditMode', resetCounter);

    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('click', handleClick);
      unsubscribe();
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);
}
