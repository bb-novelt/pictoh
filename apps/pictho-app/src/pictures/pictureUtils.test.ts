import { describe, it, expect, beforeEach } from 'vitest';
import { pictureService, PICTURE_DISPLAY_LIMIT } from './pictureService';
import { getDisplayPictures } from './pictureUtils';

beforeEach(() => {
  pictureService.reset();
});

describe('getDisplayPictures – filter', () => {
  it('returns all pictures for "both" filter', () => {
    pictureService.addUserPicture('u1', 'Mon image', 'src');
    const all = getDisplayPictures('', 'both');
    expect(all.some((p) => p.isUserAdded)).toBe(true);
    expect(all.some((p) => !p.isUserAdded)).toBe(true);
  });

  it('returns only built-in pictures for "builtin" filter', () => {
    pictureService.addUserPicture('u1', 'Mon image', 'src');
    const pics = getDisplayPictures('', 'builtin');
    expect(pics.every((p) => !p.isUserAdded)).toBe(true);
  });

  it('returns only user-added pictures for "user" filter', () => {
    pictureService.addUserPicture('u1', 'Mon image', 'src');
    const pics = getDisplayPictures('', 'user');
    expect(pics.every((p) => p.isUserAdded)).toBe(true);
  });

  it('returns empty array when no user pictures and "user" filter', () => {
    expect(getDisplayPictures('', 'user')).toHaveLength(0);
  });
});

describe('getDisplayPictures – search', () => {
  it('filters by name case-insensitively', () => {
    const pics = getDisplayPictures('mai', 'both');
    expect(pics.every((p) => p.text.toLowerCase().includes('mai'))).toBe(true);
  });

  it('returns empty array when nothing matches', () => {
    expect(getDisplayPictures('zzzunknown', 'both')).toHaveLength(0);
  });

  it('trims whitespace from the search text', () => {
    const withSpaces = getDisplayPictures('  chat  ', 'both');
    const clean = getDisplayPictures('chat', 'both');
    expect(withSpaces).toEqual(clean);
  });

  it('returns all pictures for empty search', () => {
    const all = pictureService.getAllPictures();
    expect(getDisplayPictures('', 'both')).toHaveLength(all.length);
  });
});

describe('getDisplayPictures – 50-picture limit', () => {
  it('returns all pictures when count is below the limit', () => {
    const count = pictureService.getAllPictures().length;
    expect(count).toBeLessThanOrEqual(PICTURE_DISPLAY_LIMIT);
    expect(getDisplayPictures('', 'both')).toHaveLength(count);
  });

  it('caps the result at PICTURE_DISPLAY_LIMIT when there are more', () => {
    // Add enough user pictures to exceed the limit
    for (let i = 0; i < PICTURE_DISPLAY_LIMIT; i++) {
      pictureService.addUserPicture(`u${i}`, `Image ${i}`, `src${i}`);
    }
    const pics = getDisplayPictures('', 'both');
    expect(pics).toHaveLength(PICTURE_DISPLAY_LIMIT);
  });

  it('prefers most recently used pictures when applying the limit', () => {
    // Fill up past the limit
    for (let i = 0; i < PICTURE_DISPLAY_LIMIT; i++) {
      pictureService.addUserPicture(`u${i}`, `Image ${i}`, `src${i}`);
    }
    // Mark one specific built-in picture as recently used
    pictureService.updateLastUsedTime('builtin-chat');
    const pics = getDisplayPictures('', 'both');
    // The recently-used built-in must appear in the capped list
    expect(pics.some((p) => p.id === 'builtin-chat')).toBe(true);
  });

  it('returns the capped list sorted alphabetically', () => {
    for (let i = 0; i < PICTURE_DISPLAY_LIMIT; i++) {
      pictureService.addUserPicture(`u${i}`, `Image ${i}`, `src${i}`);
    }
    const pics = getDisplayPictures('', 'both');
    const names = pics.map((p) => p.text);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });
});
