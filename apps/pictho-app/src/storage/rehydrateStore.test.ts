import { describe, it, expect, beforeEach, vi } from 'vitest';

// ---------------------------------------------------------------------------
// Mocks – set up before importing the module under test
// ---------------------------------------------------------------------------

vi.mock('./storageService', () => ({
  storageService: {
    loadAppConfig: vi.fn(),
  },
}));

import { rehydrateStore } from './rehydrateStore';
import { storageService } from './storageService';
import { store } from '../state/store';
import type { AppConfig } from '../shared/types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeConfig(overrides: Partial<AppConfig> = {}): AppConfig {
  return {
    homePageId: 'home-1',
    currentPageId: 'home-1',
    isEditMode: false,
    pages: [
      {
        pageId: 'home-1',
        pageName: 'Home',
        squares: Array.from({ length: 24 }, (_, i) => ({
          position: i,
          selectedPicture: null,
          associatedText: '',
          displayTextAbovePicture: false,
          openPageId: '',
        })),
      },
    ],
    ...overrides,
  };
}

/** Reset the store back to known defaults between tests. */
function resetStore() {
  const homeId = store.homePageId;
  store.currentPageId = homeId;
  store.isEditMode = false;
  store.pages.splice(
    0,
    store.pages.length,
    store.pages.find((p) => p.pageId === homeId)!
  );
}

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------

beforeEach(() => {
  vi.clearAllMocks();
  resetStore();
});

// ---------------------------------------------------------------------------
// No saved data
// ---------------------------------------------------------------------------

describe('rehydrateStore – no saved data', () => {
  it('does nothing when loadAppConfig returns null', () => {
    vi.mocked(storageService.loadAppConfig).mockReturnValue(null);
    const homeIdBefore = store.homePageId;
    rehydrateStore();
    expect(store.homePageId).toBe(homeIdBefore);
  });

  it('keeps default pages when nothing is stored', () => {
    vi.mocked(storageService.loadAppConfig).mockReturnValue(null);
    const pagesBefore = store.pages.length;
    rehydrateStore();
    expect(store.pages.length).toBe(pagesBefore);
  });
});

// ---------------------------------------------------------------------------
// Invalid / corrupted data
// ---------------------------------------------------------------------------

describe('rehydrateStore – invalid data', () => {
  it('ignores a config missing homePageId', () => {
    const bad = {
      currentPageId: 'h',
      isEditMode: false,
      pages: [],
    } as unknown as AppConfig;
    vi.mocked(storageService.loadAppConfig).mockReturnValue(bad);
    const homeIdBefore = store.homePageId;
    rehydrateStore();
    expect(store.homePageId).toBe(homeIdBefore);
  });

  it('ignores a config where pages is not an array', () => {
    const bad = {
      homePageId: 'h',
      currentPageId: 'h',
      isEditMode: false,
      pages: 'wrong',
    } as unknown as AppConfig;
    vi.mocked(storageService.loadAppConfig).mockReturnValue(bad);
    const homeIdBefore = store.homePageId;
    rehydrateStore();
    expect(store.homePageId).toBe(homeIdBefore);
  });

  it('ignores a config where isEditMode is not a boolean', () => {
    const bad = {
      homePageId: 'h',
      currentPageId: 'h',
      isEditMode: 'yes',
      pages: [],
    } as unknown as AppConfig;
    vi.mocked(storageService.loadAppConfig).mockReturnValue(bad);
    const homeIdBefore = store.homePageId;
    rehydrateStore();
    expect(store.homePageId).toBe(homeIdBefore);
  });
});

// ---------------------------------------------------------------------------
// Successful rehydration
// ---------------------------------------------------------------------------

describe('rehydrateStore – successful rehydration', () => {
  it('restores homePageId', () => {
    vi.mocked(storageService.loadAppConfig).mockReturnValue(
      makeConfig({ homePageId: 'home-1' })
    );
    rehydrateStore();
    expect(store.homePageId).toBe('home-1');
  });

  it('restores currentPageId', () => {
    const cfg = makeConfig({
      pages: [
        { pageId: 'home-1', pageName: 'Home', squares: [] },
        { pageId: 'page-2', pageName: 'Repas', squares: [] },
      ],
      currentPageId: 'page-2',
    });
    vi.mocked(storageService.loadAppConfig).mockReturnValue(cfg);
    rehydrateStore();
    expect(store.currentPageId).toBe('page-2');
  });

  it('restores isEditMode', () => {
    vi.mocked(storageService.loadAppConfig).mockReturnValue(
      makeConfig({ isEditMode: true })
    );
    rehydrateStore();
    expect(store.isEditMode).toBe(true);
  });

  it('restores all pages', () => {
    const cfg = makeConfig({
      pages: [
        { pageId: 'home-1', pageName: 'Home', squares: [] },
        { pageId: 'page-2', pageName: 'Animaux', squares: [] },
        { pageId: 'page-3', pageName: 'Repas', squares: [] },
      ],
    });
    vi.mocked(storageService.loadAppConfig).mockReturnValue(cfg);
    rehydrateStore();
    expect(store.pages).toHaveLength(3);
    expect(store.pages.map((p) => p.pageName)).toEqual([
      'Home',
      'Animaux',
      'Repas',
    ]);
  });

  it('restores squares including their selectedPicture', () => {
    const picture = {
      id: 'pic-1',
      text: 'Chat',
      src: '/images/chat.webp',
      isUserAdded: false,
      lastUsedTime: 1234567890,
    };
    const cfg = makeConfig({
      pages: [
        {
          pageId: 'home-1',
          pageName: 'Home',
          squares: [
            {
              position: 0,
              selectedPicture: picture,
              associatedText: 'Chat',
              displayTextAbovePicture: true,
              openPageId: '',
            },
          ],
        },
      ],
    });
    vi.mocked(storageService.loadAppConfig).mockReturnValue(cfg);
    rehydrateStore();
    expect(store.pages[0].squares[0].selectedPicture).toEqual(picture);
    expect(store.pages[0].squares[0].associatedText).toBe('Chat');
  });

  it('restores user-added pictures', () => {
    const userPicture = {
      id: 'user-pic-1',
      text: 'Mon dessin',
      src: 'data:image/png;base64,abc',
      isUserAdded: true,
      lastUsedTime: 9999,
    };
    const cfg = makeConfig({
      pages: [
        {
          pageId: 'home-1',
          pageName: 'Home',
          squares: [
            {
              position: 0,
              selectedPicture: userPicture,
              associatedText: 'Mon dessin',
              displayTextAbovePicture: false,
              openPageId: '',
            },
          ],
        },
      ],
    });
    vi.mocked(storageService.loadAppConfig).mockReturnValue(cfg);
    rehydrateStore();
    const restoredPic = store.pages[0].squares[0].selectedPicture;
    expect(restoredPic?.isUserAdded).toBe(true);
    expect(restoredPic?.src).toBe('data:image/png;base64,abc');
  });

  it('restores picture usage tracking (lastUsedTime)', () => {
    const picture = {
      id: 'pic-2',
      text: 'Eau',
      src: '/images/eau.webp',
      isUserAdded: false,
      lastUsedTime: 1700000000000,
    };
    const cfg = makeConfig({
      pages: [
        {
          pageId: 'home-1',
          pageName: 'Home',
          squares: [
            {
              position: 0,
              selectedPicture: picture,
              associatedText: 'Eau',
              displayTextAbovePicture: true,
              openPageId: '',
            },
          ],
        },
      ],
    });
    vi.mocked(storageService.loadAppConfig).mockReturnValue(cfg);
    rehydrateStore();
    expect(store.pages[0].squares[0].selectedPicture?.lastUsedTime).toBe(
      1700000000000
    );
  });
});

// ---------------------------------------------------------------------------
// Sanitisation
// ---------------------------------------------------------------------------

describe('rehydrateStore – sanitisation', () => {
  it('resets currentPageId to homePageId when the saved page no longer exists', () => {
    const cfg = makeConfig({
      homePageId: 'home-1',
      currentPageId: 'deleted-page',
      pages: [{ pageId: 'home-1', pageName: 'Home', squares: [] }],
    });
    vi.mocked(storageService.loadAppConfig).mockReturnValue(cfg);
    rehydrateStore();
    expect(store.currentPageId).toBe('home-1');
  });

  it('keeps currentPageId when it exists in the pages list', () => {
    const cfg = makeConfig({
      homePageId: 'home-1',
      currentPageId: 'page-2',
      pages: [
        { pageId: 'home-1', pageName: 'Home', squares: [] },
        { pageId: 'page-2', pageName: 'Repas', squares: [] },
      ],
    });
    vi.mocked(storageService.loadAppConfig).mockReturnValue(cfg);
    rehydrateStore();
    expect(store.currentPageId).toBe('page-2');
  });
});
