import { describe, it, expect, beforeEach, vi } from 'vitest';
import { storageService } from './storageService';
import type { AppConfig } from '../shared/types';

// ---------------------------------------------------------------------------
// Minimal AppConfig fixture
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
        squares: [],
      },
    ],
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function getStoredRaw(): unknown {
  const raw = localStorage.getItem('pictho_app_config');
  return raw ? JSON.parse(raw) : null;
}

// ---------------------------------------------------------------------------
// Reset localStorage before every test
// ---------------------------------------------------------------------------
beforeEach(() => {
  localStorage.clear();
});

// ---------------------------------------------------------------------------
// saveAppConfig
// ---------------------------------------------------------------------------
describe('saveAppConfig', () => {
  it('writes a JSON envelope to localStorage', () => {
    storageService.saveAppConfig(makeConfig());
    const stored = getStoredRaw() as { version: number; config: AppConfig };
    expect(stored).not.toBeNull();
    expect(typeof stored.version).toBe('number');
    expect(stored.config.homePageId).toBe('home-1');
  });

  it('saves the full config faithfully', () => {
    const cfg = makeConfig({ isEditMode: true, currentPageId: 'home-1' });
    storageService.saveAppConfig(cfg);
    const stored = getStoredRaw() as { version: number; config: AppConfig };
    expect(stored.config).toEqual(cfg);
  });

  it('overwrites a previous save', () => {
    storageService.saveAppConfig(makeConfig({ currentPageId: 'home-1' }));
    storageService.saveAppConfig(makeConfig({ currentPageId: 'page-2' }));
    const stored = getStoredRaw() as { version: number; config: AppConfig };
    expect(stored.config.currentPageId).toBe('page-2');
  });

  it('does not throw when localStorage quota is exceeded', () => {
    const original = localStorage.setItem.bind(localStorage);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementationOnce(() => {
      const err = new Error('QuotaExceededError');
      err.name = 'QuotaExceededError';
      throw err;
    });
    expect(() => storageService.saveAppConfig(makeConfig())).not.toThrow();
    vi.restoreAllMocks();
    // Restore for subsequent tests
    Storage.prototype.setItem = original;
  });
});

// ---------------------------------------------------------------------------
// loadAppConfig
// ---------------------------------------------------------------------------
describe('loadAppConfig', () => {
  it('returns null when nothing is stored', () => {
    expect(storageService.loadAppConfig()).toBeNull();
  });

  it('returns the saved config after saving', () => {
    const cfg = makeConfig();
    storageService.saveAppConfig(cfg);
    const loaded = storageService.loadAppConfig();
    expect(loaded).toEqual(cfg);
  });

  it('returns null for malformed JSON', () => {
    localStorage.setItem('pictho_app_config', 'not-json{{{');
    expect(storageService.loadAppConfig()).toBeNull();
  });

  it('returns null when the stored object is missing the version field', () => {
    localStorage.setItem(
      'pictho_app_config',
      JSON.stringify({ config: makeConfig() })
    );
    expect(storageService.loadAppConfig()).toBeNull();
  });

  it('returns null when the stored object is missing the config field', () => {
    localStorage.setItem('pictho_app_config', JSON.stringify({ version: 1 }));
    expect(storageService.loadAppConfig()).toBeNull();
  });

  it('returns null when a newer schema version is stored', () => {
    localStorage.setItem(
      'pictho_app_config',
      JSON.stringify({ version: 9999, config: makeConfig() })
    );
    expect(storageService.loadAppConfig()).toBeNull();
  });

  it('returns the config when the schema version matches', () => {
    const cfg = makeConfig();
    localStorage.setItem(
      'pictho_app_config',
      JSON.stringify({ version: 1, config: cfg })
    );
    expect(storageService.loadAppConfig()).toEqual(cfg);
  });
});

// ---------------------------------------------------------------------------
// clearAppConfig
// ---------------------------------------------------------------------------
describe('clearAppConfig', () => {
  it('removes the stored data', () => {
    storageService.saveAppConfig(makeConfig());
    storageService.clearAppConfig();
    expect(localStorage.getItem('pictho_app_config')).toBeNull();
  });

  it('loadAppConfig returns null after clearing', () => {
    storageService.saveAppConfig(makeConfig());
    storageService.clearAppConfig();
    expect(storageService.loadAppConfig()).toBeNull();
  });

  it('does not throw when there is nothing to clear', () => {
    expect(() => storageService.clearAppConfig()).not.toThrow();
  });
});
