/**
 * State rehydration – loads the persisted AppConfig from localStorage and
 * applies it to the Valtio store before the first React render.
 *
 * Call `rehydrateStore()` once at application startup (e.g. in main.tsx)
 * before mounting the React tree.  If no saved data exists, or if the data
 * fails validation, the store retains its default values.
 */
import type { AppConfig } from '../shared/types';
import { store } from '../state';
import { storageService } from './storageService';

/**
 * Validate that a value loaded from localStorage has the minimum structure
 * required to be a usable AppConfig.
 *
 * Only the top-level shape is checked here; deeper structural issues are
 * handled gracefully by the sanitisation step.
 */
function isValidConfig(config: unknown): config is AppConfig {
  if (typeof config !== 'object' || config === null) return false;
  const c = config as Record<string, unknown>;
  return (
    typeof c.homePageId === 'string' &&
    typeof c.currentPageId === 'string' &&
    typeof c.isEditMode === 'boolean' &&
    Array.isArray(c.pages)
  );
}

/**
 * Sanitise a loaded AppConfig to ensure internal consistency.
 *
 * - If `currentPageId` does not match any page in the config it is reset to
 *   `homePageId` to avoid a blank / broken initial view.
 *
 * The config is mutated in place and returned.
 */
function sanitizeConfig(config: AppConfig): AppConfig {
  const currentPageExists = config.pages.some(
    (p) => p.pageId === config.currentPageId
  );
  if (!currentPageExists) {
    config.currentPageId = config.homePageId;
  }
  return config;
}

/**
 * Load the persisted AppConfig from localStorage and overwrite the Valtio
 * store with the saved state.
 *
 * Restores:
 * - All pages and their squares (including user-added pictures)
 * - Picture usage tracking (`lastUsedTime` on Picture objects)
 * - `currentPageId` (which page was open when the app was last closed)
 * - `isEditMode` state
 *
 * Falls back silently to the store's default values when:
 * - Nothing has been saved yet
 * - The stored data is corrupted or cannot be parsed
 * - The stored data fails the structure validation check
 */
export function rehydrateStore(): void {
  const config = storageService.loadAppConfig();
  if (!config) return;

  if (!isValidConfig(config)) {
    console.warn(
      '[rehydrateStore] Loaded config failed validation. Using defaults.'
    );
    return;
  }

  sanitizeConfig(config);

  store.homePageId = config.homePageId;
  store.currentPageId = config.currentPageId;
  store.isEditMode = config.isEditMode;
  store.pages = config.pages;
}
