import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { pictureService, PICTURE_DISPLAY_LIMIT } from './pictureService';
import { BUILT_IN_PICTURE_STEMS } from './pictureLibrary';

beforeEach(() => {
  pictureService.reset();
});

describe('PICTURE_DISPLAY_LIMIT', () => {
  it('is 50', () => {
    expect(PICTURE_DISPLAY_LIMIT).toBe(50);
  });
});

describe('getBuiltInPictures', () => {
  it('returns one entry per built-in stem', () => {
    expect(pictureService.getBuiltInPictures()).toHaveLength(
      BUILT_IN_PICTURE_STEMS.length
    );
  });

  it('returns pictures sorted alphabetically by text', () => {
    const names = pictureService.getBuiltInPictures().map((p) => p.text);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });

  it('marks pictures as not user-added', () => {
    pictureService.getBuiltInPictures().forEach((p) => {
      expect(p.isUserAdded).toBe(false);
    });
  });

  it('returns the same array reference on second call (cached)', () => {
    const first = pictureService.getBuiltInPictures();
    const second = pictureService.getBuiltInPictures();
    expect(first).toBe(second);
  });
});

describe('getUserAddedPictures', () => {
  it('returns empty array when no user pictures have been added', () => {
    expect(pictureService.getUserAddedPictures()).toHaveLength(0);
  });

  it('returns added pictures sorted alphabetically', () => {
    pictureService.addUserPicture('u1', 'Zèbre', 'data:image/png;base64,abc');
    pictureService.addUserPicture('u2', 'Ane', 'data:image/png;base64,def');
    const names = pictureService.getUserAddedPictures().map((p) => p.text);
    expect(names).toEqual(['Ane', 'Zèbre']);
  });
});

describe('addUserPicture', () => {
  it('creates a Picture marked as user-added', () => {
    const pic = pictureService.addUserPicture(
      'u1',
      'Mon image',
      'data:image/png;base64,abc'
    );
    expect(pic.isUserAdded).toBe(true);
    expect(pic.id).toBe('u1');
    expect(pic.text).toBe('Mon image');
    expect(pic.src).toBe('data:image/png;base64,abc');
  });

  it('increments the user-added count', () => {
    pictureService.addUserPicture('u1', 'A', 'src-a');
    pictureService.addUserPicture('u2', 'B', 'src-b');
    expect(pictureService.getUserAddedPictures()).toHaveLength(2);
  });
});

describe('getAllPictures', () => {
  it('combines built-in and user-added, sorted alphabetically', () => {
    pictureService.addUserPicture('u1', 'Zèbre', 'src');
    const all = pictureService.getAllPictures();
    const names = all.map((p) => p.text);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
    expect(all.some((p) => p.text === 'Zèbre')).toBe(true);
    expect(all.some((p) => p.id === 'builtin-chat')).toBe(true);
  });
});

describe('searchPictures', () => {
  it('returns all pictures for empty query', () => {
    expect(pictureService.searchPictures('')).toHaveLength(
      pictureService.getAllPictures().length
    );
  });

  it('filters by name case-insensitively', () => {
    const results = pictureService.searchPictures('mai');
    expect(results.every((p) => p.text.toLowerCase().includes('mai'))).toBe(
      true
    );
  });

  it('returns empty array when nothing matches', () => {
    expect(pictureService.searchPictures('zzzunknown')).toHaveLength(0);
  });

  it('also searches user-added pictures', () => {
    pictureService.addUserPicture('u1', 'Banane', 'src');
    const results = pictureService.searchPictures('bana');
    expect(results.some((p) => p.text === 'Banane')).toBe(true);
  });

  it('trims whitespace from the query', () => {
    const withSpaces = pictureService.searchPictures('  chat  ');
    const clean = pictureService.searchPictures('chat');
    expect(withSpaces).toEqual(clean);
  });
});

describe('updateLastUsedTime', () => {
  it('sets lastUsedTime on a built-in picture', () => {
    const before = Date.now();
    pictureService.updateLastUsedTime('builtin-manger');
    const pics = pictureService.getBuiltInPictures();
    const pic = pics.find((p) => p.id === 'builtin-manger')!;
    expect(pic.lastUsedTime).toBeGreaterThanOrEqual(before);
  });

  it('sets lastUsedTime on a user-added picture', () => {
    pictureService.addUserPicture('u1', 'Test', 'src');
    const before = Date.now();
    pictureService.updateLastUsedTime('u1');
    const pic = pictureService
      .getUserAddedPictures()
      .find((p) => p.id === 'u1')!;
    expect(pic.lastUsedTime).toBeGreaterThanOrEqual(before);
  });

  it('does nothing for an unknown id', () => {
    // Should not throw
    expect(() => pictureService.updateLastUsedTime('unknown-id')).not.toThrow();
  });
});

describe('getPicturesSortedByLastUsed', () => {
  afterEach(() => vi.useRealTimers());

  it('returns all pictures', () => {
    expect(pictureService.getPicturesSortedByLastUsed()).toHaveLength(
      pictureService.getAllPictures().length
    );
  });

  it('places most recently used first', () => {
    vi.useFakeTimers();
    vi.setSystemTime(1000);
    pictureService.updateLastUsedTime('builtin-chat');
    vi.setSystemTime(2000);
    pictureService.updateLastUsedTime('builtin-manger');
    const sorted = pictureService.getPicturesSortedByLastUsed();
    const mangerIdx = sorted.findIndex((p) => p.id === 'builtin-manger');
    const chatIdx = sorted.findIndex((p) => p.id === 'builtin-chat');
    expect(mangerIdx).toBeLessThan(chatIdx);
  });

  it('puts pictures with no lastUsedTime at the end', () => {
    vi.useFakeTimers();
    vi.setSystemTime(1000);
    pictureService.updateLastUsedTime('builtin-chat');
    const sorted = pictureService.getPicturesSortedByLastUsed();
    const chatIdx = sorted.findIndex((p) => p.id === 'builtin-chat');
    const noTimeIdx = sorted.findIndex((p) => !p.lastUsedTime);
    expect(chatIdx).toBeLessThan(noTimeIdx);
  });
});

describe('reset', () => {
  it('clears user-added pictures', () => {
    pictureService.addUserPicture('u1', 'A', 'src');
    pictureService.reset();
    expect(pictureService.getUserAddedPictures()).toHaveLength(0);
  });

  it('clears the built-in cache', () => {
    const first = pictureService.getBuiltInPictures();
    pictureService.reset();
    const second = pictureService.getBuiltInPictures();
    expect(first).not.toBe(second);
  });
});
