/**
 * State rehydration – loads the persisted AppConfig from localStorage and
 * applies it to the Valtio store before the first React render.
 *
 * Call `rehydrateStore()` once at application startup (e.g. in main.tsx)
 * before mounting the React tree.  If no saved data exists, or if the data
 * fails validation, the store retains its default values.
 */
import { store } from '../state';
import { validateAppConfig } from './dataValidation';
import { storageService } from './storageService';

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
  const raw = storageService.loadAppConfig();
  if (!raw) return;

  const config = validateAppConfig(raw);
  if (!config) {
    console.warn(
      '[rehydrateStore] Loaded config failed validation. Using defaults.'
    );
    return;
  }

  store.homePageId = config.homePageId;
  store.currentPageId = config.currentPageId;
  store.isEditMode = config.isEditMode;
  store.pages = config.pages;
}
