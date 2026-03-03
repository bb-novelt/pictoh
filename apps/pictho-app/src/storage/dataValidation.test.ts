import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validateAppConfig } from './dataValidation';
import type { AppConfig, Page, Square, Picture } from '../shared/types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makePicture(overrides: Partial<Picture> = {}): Picture {
  return {
    id: 'pic-1',
    text: 'Chat',
    src: '/images/chat.webp',
    isUserAdded: false,
    ...overrides,
  };
}

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

function makePage(overrides: Partial<Page> = {}): Page {
  return {
    pageId: 'home-1',
    pageName: 'Home',
    squares: [makeSquare()],
    ...overrides,
  };
}

function makeConfig(overrides: Partial<AppConfig> = {}): AppConfig {
  return {
    homePageId: 'home-1',
    currentPageId: 'home-1',
    isEditMode: false,
    pages: [makePage()],
    ...overrides,
  };
}

beforeEach(() => {
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

// ---------------------------------------------------------------------------
// Top-level config validation
// ---------------------------------------------------------------------------

describe('validateAppConfig – top-level', () => {
  it('returns a valid config as-is', () => {
    const cfg = makeConfig();
    const result = validateAppConfig(cfg);
    expect(result).not.toBeNull();
    expect(result?.homePageId).toBe('home-1');
  });

  it('returns null for null input', () => {
    expect(validateAppConfig(null)).toBeNull();
  });

  it('returns null for a non-object input', () => {
    expect(validateAppConfig('string')).toBeNull();
    expect(validateAppConfig(42)).toBeNull();
    expect(validateAppConfig([])).toBeNull();
  });

  it('returns null when homePageId is missing', () => {
    const bad = { currentPageId: 'h', isEditMode: false, pages: [] };
    expect(validateAppConfig(bad)).toBeNull();
  });

  it('returns null when homePageId is not a string', () => {
    const bad = {
      homePageId: 1,
      currentPageId: 'h',
      isEditMode: false,
      pages: [],
    };
    expect(validateAppConfig(bad)).toBeNull();
  });

  it('returns null when currentPageId is missing', () => {
    const bad = { homePageId: 'h', isEditMode: false, pages: [] };
    expect(validateAppConfig(bad)).toBeNull();
  });

  it('returns null when isEditMode is missing', () => {
    const bad = { homePageId: 'h', currentPageId: 'h', pages: [] };
    expect(validateAppConfig(bad)).toBeNull();
  });

  it('returns null when isEditMode is not a boolean', () => {
    const bad = {
      homePageId: 'h',
      currentPageId: 'h',
      isEditMode: 'yes',
      pages: [],
    };
    expect(validateAppConfig(bad)).toBeNull();
  });

  it('returns null when pages is not an array', () => {
    const bad = {
      homePageId: 'h',
      currentPageId: 'h',
      isEditMode: false,
      pages: 'nope',
    };
    expect(validateAppConfig(bad)).toBeNull();
  });

  it('returns null when pages is empty (no valid pages)', () => {
    const cfg = makeConfig({ pages: [] });
    expect(validateAppConfig(cfg)).toBeNull();
  });

  it('returns null when homePageId does not match any page', () => {
    const cfg = makeConfig({
      homePageId: 'nonexistent',
      currentPageId: 'home-1',
    });
    expect(validateAppConfig(cfg)).toBeNull();
  });

  it('logs an error when returning null', () => {
    validateAppConfig(null);
    expect(console.error).toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// currentPageId sanitisation
// ---------------------------------------------------------------------------

describe('validateAppConfig – currentPageId sanitisation', () => {
  it('keeps currentPageId when it exists in pages', () => {
    const cfg = makeConfig({
      pages: [
        makePage({ pageId: 'home-1' }),
        makePage({ pageId: 'page-2', pageName: 'Repas' }),
      ],
      currentPageId: 'page-2',
    });
    const result = validateAppConfig(cfg);
    expect(result?.currentPageId).toBe('page-2');
  });

  it('resets currentPageId to homePageId when the page no longer exists', () => {
    const cfg = makeConfig({
      homePageId: 'home-1',
      currentPageId: 'deleted-page',
      pages: [makePage({ pageId: 'home-1' })],
    });
    const result = validateAppConfig(cfg);
    expect(result?.currentPageId).toBe('home-1');
  });

  it('logs a warning when currentPageId is reset', () => {
    const cfg = makeConfig({
      homePageId: 'home-1',
      currentPageId: 'ghost',
      pages: [makePage({ pageId: 'home-1' })],
    });
    validateAppConfig(cfg);
    expect(console.warn).toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Page validation
// ---------------------------------------------------------------------------

describe('validateAppConfig – page validation', () => {
  it('discards pages with missing pageId', () => {
    const badPage = { pageName: 'X', squares: [] };
    const cfg = makeConfig({
      pages: [makePage({ pageId: 'home-1' }), badPage as unknown as Page],
    });
    const result = validateAppConfig(cfg);
    expect(result?.pages).toHaveLength(1);
  });

  it('discards pages with missing pageName', () => {
    const badPage = { pageId: 'home-1', squares: [] };
    // homePageId is 'home-1' but the only page with that id has no pageName
    const cfg = makeConfig({
      pages: [badPage as unknown as Page],
    });
    // After discarding, no valid pages → null
    expect(validateAppConfig(cfg)).toBeNull();
  });

  it('discards pages where squares is not an array', () => {
    const badPage = { pageId: 'extra', pageName: 'X', squares: 'bad' };
    const cfg = makeConfig({
      pages: [makePage({ pageId: 'home-1' }), badPage as unknown as Page],
    });
    const result = validateAppConfig(cfg);
    expect(result?.pages).toHaveLength(1);
    expect(result?.pages[0].pageId).toBe('home-1');
  });

  it('discards non-object pages', () => {
    const cfg = makeConfig({
      pages: [
        makePage({ pageId: 'home-1' }),
        null as unknown as Page,
        'bad' as unknown as Page,
      ],
    });
    const result = validateAppConfig(cfg);
    expect(result?.pages).toHaveLength(1);
  });

  it('returns null when all pages are invalid', () => {
    const cfg = makeConfig({
      pages: [{ notAPage: true } as unknown as Page],
    });
    expect(validateAppConfig(cfg)).toBeNull();
  });

  it('logs a warning when discarding an invalid page', () => {
    const badPage = { pageName: 'X', squares: [] };
    const cfg = makeConfig({
      pages: [makePage({ pageId: 'home-1' }), badPage as unknown as Page],
    });
    validateAppConfig(cfg);
    expect(console.warn).toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Square validation
// ---------------------------------------------------------------------------

describe('validateAppConfig – square validation', () => {
  it('keeps valid squares', () => {
    const sq = makeSquare({ position: 3, associatedText: 'Eau' });
    const cfg = makeConfig({
      pages: [makePage({ squares: [sq] })],
    });
    const result = validateAppConfig(cfg);
    expect(result?.pages[0].squares).toHaveLength(1);
    expect(result?.pages[0].squares[0].position).toBe(3);
  });

  it('discards squares missing required fields', () => {
    const badSquare = { position: 0 };
    const cfg = makeConfig({
      pages: [
        makePage({ squares: [makeSquare(), badSquare as unknown as Square] }),
      ],
    });
    const result = validateAppConfig(cfg);
    expect(result?.pages[0].squares).toHaveLength(1);
  });

  it('discards non-object squares', () => {
    const cfg = makeConfig({
      pages: [makePage({ squares: [null as unknown as Square, makeSquare()] })],
    });
    const result = validateAppConfig(cfg);
    expect(result?.pages[0].squares).toHaveLength(1);
  });

  it('keeps a square with a null selectedPicture', () => {
    const cfg = makeConfig({
      pages: [makePage({ squares: [makeSquare({ selectedPicture: null })] })],
    });
    const result = validateAppConfig(cfg);
    expect(result?.pages[0].squares[0].selectedPicture).toBeNull();
  });

  it('discards squares where position is not a number', () => {
    const bad = {
      position: 'x',
      associatedText: '',
      displayTextAbovePicture: false,
      openPageId: '',
    };
    const cfg = makeConfig({
      pages: [makePage({ squares: [bad as unknown as Square] })],
    });
    const result = validateAppConfig(cfg);
    expect(result?.pages[0].squares).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// Picture validation
// ---------------------------------------------------------------------------

describe('validateAppConfig – picture validation', () => {
  it('keeps a valid picture on a square', () => {
    const pic = makePicture({ lastUsedTime: 1700000000 });
    const cfg = makeConfig({
      pages: [makePage({ squares: [makeSquare({ selectedPicture: pic })] })],
    });
    const result = validateAppConfig(cfg);
    expect(result?.pages[0].squares[0].selectedPicture).toEqual(pic);
  });

  it('replaces an invalid picture with null (does not discard the square)', () => {
    const badPic = { id: 'x' };
    const cfg = makeConfig({
      pages: [
        makePage({
          squares: [
            makeSquare({ selectedPicture: badPic as unknown as Picture }),
          ],
        }),
      ],
    });
    const result = validateAppConfig(cfg);
    expect(result?.pages[0].squares).toHaveLength(1);
    expect(result?.pages[0].squares[0].selectedPicture).toBeNull();
  });

  it('keeps a picture without optional lastUsedTime', () => {
    const pic = makePicture();
    delete pic.lastUsedTime;
    const cfg = makeConfig({
      pages: [makePage({ squares: [makeSquare({ selectedPicture: pic })] })],
    });
    const result = validateAppConfig(cfg);
    expect(
      result?.pages[0].squares[0].selectedPicture?.lastUsedTime
    ).toBeUndefined();
  });

  it('keeps lastUsedTime when present', () => {
    const pic = makePicture({ lastUsedTime: 12345 });
    const cfg = makeConfig({
      pages: [makePage({ squares: [makeSquare({ selectedPicture: pic })] })],
    });
    const result = validateAppConfig(cfg);
    expect(result?.pages[0].squares[0].selectedPicture?.lastUsedTime).toBe(
      12345
    );
  });

  it('returns null for a picture with missing id', () => {
    const bad = { text: 'x', src: '/x.webp', isUserAdded: false };
    const cfg = makeConfig({
      pages: [
        makePage({
          squares: [makeSquare({ selectedPicture: bad as unknown as Picture })],
        }),
      ],
    });
    const result = validateAppConfig(cfg);
    expect(result?.pages[0].squares[0].selectedPicture).toBeNull();
  });

  it('returns null for a picture with a non-boolean isUserAdded', () => {
    const bad = { id: 'x', text: 'x', src: '/x.webp', isUserAdded: 'yes' };
    const cfg = makeConfig({
      pages: [
        makePage({
          squares: [makeSquare({ selectedPicture: bad as unknown as Picture })],
        }),
      ],
    });
    const result = validateAppConfig(cfg);
    expect(result?.pages[0].squares[0].selectedPicture).toBeNull();
  });

  it('logs a warning when an invalid picture is replaced with null', () => {
    const bad = { id: 'x' };
    const cfg = makeConfig({
      pages: [
        makePage({
          squares: [makeSquare({ selectedPicture: bad as unknown as Picture })],
        }),
      ],
    });
    validateAppConfig(cfg);
    expect(console.warn).toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Backwards compatibility
// ---------------------------------------------------------------------------

describe('validateAppConfig – backwards compatibility', () => {
  it('accepts a config with extra unknown fields', () => {
    const cfg = {
      ...makeConfig(),
      unknownField: 'value',
    };
    const result = validateAppConfig(cfg);
    expect(result).not.toBeNull();
  });

  it('accepts pages with extra unknown fields', () => {
    const cfg = makeConfig({
      pages: [{ ...makePage(), extraField: 'x' } as unknown as Page],
    });
    const result = validateAppConfig(cfg);
    expect(result?.pages).toHaveLength(1);
  });

  it('accepts squares with extra unknown fields', () => {
    const cfg = makeConfig({
      pages: [
        makePage({
          squares: [{ ...makeSquare(), extra: true } as unknown as Square],
        }),
      ],
    });
    const result = validateAppConfig(cfg);
    expect(result?.pages[0].squares).toHaveLength(1);
  });
});
