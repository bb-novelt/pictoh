import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSquareInteraction } from './useSquareInteraction';
import { store } from '../state';
import * as pageActions from '../state/actions/pageActions';
import * as ttsService from '../tts/ttsService';
import type { Square } from '../shared/types';

function makeSquare(overrides: Partial<Square> = {}): Square {
  return {
    position: 0,
    selectedPicture: null,
    associatedText: '',
    displayTextAbovePicture: false,
    openPageId: '',
    ...overrides,
  };
}

describe('useSquareInteraction', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(pageActions, 'navigateToPage');
    vi.spyOn(ttsService, 'speak');
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    // Reset store to home page
    store.currentPageId = store.homePageId;
  });

  it('calls speak with associatedText when text is set', () => {
    const { result } = renderHook(() => useSquareInteraction());
    const square = makeSquare({ associatedText: 'cat' });

    act(() => {
      result.current.handleInteraction(square);
    });

    expect(ttsService.speak).toHaveBeenCalledWith('cat');
  });

  it('does not call speak when associatedText is empty', () => {
    const { result } = renderHook(() => useSquareInteraction());
    const square = makeSquare({ associatedText: '' });

    act(() => {
      result.current.handleInteraction(square);
    });

    expect(ttsService.speak).not.toHaveBeenCalled();
  });

  it('navigates to openPageId when openPageId is set', () => {
    const { result } = renderHook(() => useSquareInteraction());
    const square = makeSquare({ openPageId: 'page-123' });

    act(() => {
      result.current.handleInteraction(square);
    });

    expect(pageActions.navigateToPage).toHaveBeenCalledWith('page-123');
  });

  it('does not navigate when openPageId is empty', () => {
    const { result } = renderHook(() => useSquareInteraction());
    const square = makeSquare({ openPageId: '' });

    act(() => {
      result.current.handleInteraction(square);
    });

    expect(pageActions.navigateToPage).not.toHaveBeenCalled();
  });

  it('prevents a second simultaneous interaction within the lock window', () => {
    const { result } = renderHook(() => useSquareInteraction());
    const square = makeSquare({ associatedText: 'dog', openPageId: 'page-1' });

    act(() => {
      result.current.handleInteraction(square);
      result.current.handleInteraction(square); // second touch while locked
    });

    // speak and navigate called only once
    expect(ttsService.speak).toHaveBeenCalledTimes(1);
    expect(pageActions.navigateToPage).toHaveBeenCalledTimes(1);
  });

  it('allows a new interaction after the lock window expires', () => {
    const { result } = renderHook(() => useSquareInteraction());
    const square = makeSquare({ associatedText: 'bird' });

    act(() => {
      result.current.handleInteraction(square);
      vi.advanceTimersByTime(1000);
      result.current.handleInteraction(square);
    });

    expect(ttsService.speak).toHaveBeenCalledTimes(2);
  });

  it('navigates immediately without waiting for TTS (both called in same tick)', () => {
    const callOrder: string[] = [];
    vi.mocked(ttsService.speak).mockImplementation(() => {
      callOrder.push('speak');
    });
    vi.mocked(pageActions.navigateToPage).mockImplementation(() => {
      callOrder.push('navigate');
    });

    const { result } = renderHook(() => useSquareInteraction());
    const square = makeSquare({
      associatedText: 'horse',
      openPageId: 'page-2',
    });

    act(() => {
      result.current.handleInteraction(square);
    });

    expect(callOrder).toEqual(['speak', 'navigate']);
  });
});
