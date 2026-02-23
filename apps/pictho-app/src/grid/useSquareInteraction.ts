import { useRef } from 'react';
import type { Square } from '../shared/types';
import { navigateToPage } from '../state/actions/pageActions';
import { speak } from '../tts';

/**
 * Provides the interaction handler for squares in normal (non-edit) mode.
 *
 * Behaviour on touch:
 * 1. Prevents multiple simultaneous touches via a global active-touch lock.
 * 2. Triggers TTS for `associatedText` (fire-and-forget).
 * 3. Navigates to `openPageId` immediately without waiting for TTS.
 *
 * The lock is released after 1 second — the same duration as the border
 * colour flash — so a second touch on any square is ignored while the
 * visual feedback is visible.
 */

const TOUCH_LOCK_MS = 1000;

export function useSquareInteraction() {
  const activeTouchRef = useRef(false);

  function handleInteraction(square: Square): void {
    if (activeTouchRef.current) return;

    activeTouchRef.current = true;
    setTimeout(() => {
      activeTouchRef.current = false;
    }, TOUCH_LOCK_MS);

    // Fire-and-forget TTS
    if (square.associatedText) {
      speak(square.associatedText);
    }

    // Navigate immediately (do not wait for TTS)
    if (square.openPageId) {
      navigateToPage(square.openPageId);
    }
  }

  return { handleInteraction };
}
