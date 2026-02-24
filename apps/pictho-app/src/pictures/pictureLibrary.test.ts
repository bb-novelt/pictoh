import { describe, it, expect } from 'vitest';
import {
  BUILT_IN_PICTURE_STEMS,
  BUILT_IN_PICTURES,
  createBuiltInPicture,
} from './pictureLibrary';

describe('BUILT_IN_PICTURE_STEMS', () => {
  it('contains at least the 8 test images', () => {
    const expected = [
      'arbre',
      'chat',
      'eau',
      'fleur',
      'maison',
      'manger',
      'soleil',
      'voiture',
    ];
    expected.forEach((stem) => expect(BUILT_IN_PICTURE_STEMS).toContain(stem));
  });

  it('is sorted alphabetically', () => {
    const sorted = [...BUILT_IN_PICTURE_STEMS].sort();
    expect(BUILT_IN_PICTURE_STEMS).toEqual(sorted);
  });
});

describe('createBuiltInPicture', () => {
  it('creates a Picture with a prefixed id', () => {
    const pic = createBuiltInPicture('manger');
    expect(pic.id).toBe('builtin-manger');
  });

  it('capitalises the display text', () => {
    expect(createBuiltInPicture('manger').text).toBe('Manger');
    expect(createBuiltInPicture('eau').text).toBe('Eau');
  });

  it('sets the correct src path', () => {
    expect(createBuiltInPicture('chat').src).toBe('/assets/pictures/chat.svg');
  });

  it('marks the picture as not user-added', () => {
    expect(createBuiltInPicture('arbre').isUserAdded).toBe(false);
  });

  it('does not set lastUsedTime by default', () => {
    expect(createBuiltInPicture('soleil').lastUsedTime).toBeUndefined();
  });
});

describe('BUILT_IN_PICTURES', () => {
  it('has the same length as BUILT_IN_PICTURE_STEMS', () => {
    expect(BUILT_IN_PICTURES).toHaveLength(BUILT_IN_PICTURE_STEMS.length);
  });

  it('each entry matches the expected shape', () => {
    BUILT_IN_PICTURES.forEach((pic) => {
      expect(pic.id).toMatch(/^builtin-/);
      expect(pic.src).toMatch(/^\/assets\/pictures\/.*\.svg$/);
      expect(pic.isUserAdded).toBe(false);
    });
  });
});
