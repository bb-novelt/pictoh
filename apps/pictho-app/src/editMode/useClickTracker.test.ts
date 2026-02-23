import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useClickTracker } from './useClickTracker';
import { store } from '../state';
import { disableEditMode } from '../state/actions/editModeActions';

describe('useClickTracker', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    disableEditMode();
  });

  afterEach(() => {
    vi.useRealTimers();
    disableEditMode();
  });

  it('activates edit mode after 5 clicks', () => {
    renderHook(() => useClickTracker());

    expect(store.isEditMode).toBe(false);

    act(() => {
      for (let i = 0; i < 5; i++) {
        window.dispatchEvent(new MouseEvent('click'));
      }
    });

    expect(store.isEditMode).toBe(true);
  });

  it('does not activate edit mode after fewer than 5 clicks', () => {
    renderHook(() => useClickTracker());

    act(() => {
      for (let i = 0; i < 4; i++) {
        window.dispatchEvent(new MouseEvent('click'));
      }
    });

    expect(store.isEditMode).toBe(false);
  });

  it('resets counter after timeout and requires 5 more clicks', () => {
    renderHook(() => useClickTracker());

    act(() => {
      for (let i = 0; i < 4; i++) {
        window.dispatchEvent(new MouseEvent('click'));
      }
      vi.advanceTimersByTime(2000);
    });

    expect(store.isEditMode).toBe(false);

    // Needs 5 more clicks from scratch
    act(() => {
      for (let i = 0; i < 4; i++) {
        window.dispatchEvent(new MouseEvent('click'));
      }
    });
    expect(store.isEditMode).toBe(false);

    act(() => {
      window.dispatchEvent(new MouseEvent('click'));
    });
    expect(store.isEditMode).toBe(true);
  });

  it('does not increment counter when edit mode is already active', () => {
    renderHook(() => useClickTracker());

    // Activate edit mode manually
    act(() => {
      store.isEditMode = true;
    });

    // Clicks should not re-trigger anything
    act(() => {
      for (let i = 0; i < 5; i++) {
        window.dispatchEvent(new MouseEvent('click'));
      }
    });

    // Edit mode stays true (unchanged, not re-triggered)
    expect(store.isEditMode).toBe(true);
  });

  it('resets counter when edit mode changes', async () => {
    renderHook(() => useClickTracker());

    // 3 clicks towards threshold
    act(() => {
      for (let i = 0; i < 3; i++) {
        window.dispatchEvent(new MouseEvent('click'));
      }
    });

    // Edit mode activates externally; flush Valtio microtask so subscribeKey fires
    store.isEditMode = true;
    await Promise.resolve();

    // Edit mode deactivates; flush again so counter is reset to 0
    store.isEditMode = false;
    await Promise.resolve();

    // Counter was reset; needs 5 fresh clicks
    act(() => {
      for (let i = 0; i < 4; i++) {
        window.dispatchEvent(new MouseEvent('click'));
      }
    });
    expect(store.isEditMode).toBe(false);

    act(() => {
      window.dispatchEvent(new MouseEvent('click'));
    });
    expect(store.isEditMode).toBe(true);
  });
});
