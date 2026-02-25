/**
 * StorageService – persists and rehydrates the AppConfig using localStorage.
 *
 * A schema version is stored alongside the data so future breaking changes
 * can be handled through explicit migration functions.
 */
import type { AppConfig } from '../shared/types';

/** localStorage key used to store the serialised AppConfig. */
const STORAGE_KEY = 'pictho_app_config';

/**
 * Current schema version.
 * Increment this whenever a breaking change is made to AppConfig so that
 * old persisted data can be migrated (or discarded) safely.
 */
const SCHEMA_VERSION = 1;

/** Shape of the envelope written to localStorage. */
interface StoredData {
  version: number;
  config: AppConfig;
}

/**
 * Migrate persisted data from an older schema version to the current one.
 * Returns the migrated config, or null if the data cannot be recovered.
 *
 * @param version - The schema version found in localStorage.
 * @param config  - The raw config object read from localStorage.
 */
function migrate(version: number, config: AppConfig): AppConfig | null {
  // Version is already current – nothing to do.
  if (version === SCHEMA_VERSION) return config;

  // Unknown / future version – discard the stored data to avoid corruption.
  if (version > SCHEMA_VERSION) {
    console.warn(
      `[StorageService] Stored schema version (${version}) is newer than the app (${SCHEMA_VERSION}). Discarding saved data.`
    );
    return null;
  }

  // Version < SCHEMA_VERSION: apply incremental migrations here as the app
  // evolves.  Add a case for each version step:
  //
  //   if (version < 2) { /* migrate v1 → v2 */ version = 2; }
  //   if (version < 3) { /* migrate v2 → v3 */ version = 3; }
  //
  // For now there are no older versions, so nothing to do.
  return config;
}

class StorageService {
  /**
   * Persist the full AppConfig to localStorage.
   * Silently handles quota-exceeded errors to avoid crashing the app.
   *
   * @param config - The current AppConfig to save.
   */
  saveAppConfig(config: AppConfig): void {
    const data: StoredData = { version: SCHEMA_VERSION, config };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      // QuotaExceededError or SecurityError (private-browsing restrictions)
      console.error('[StorageService] Failed to save app config:', error);
    }
  }

  /**
   * Load the AppConfig from localStorage.
   * Returns null when no data is stored, or when the stored data is invalid
   * or cannot be migrated to the current schema version.
   */
  loadAppConfig(): AppConfig | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;

      const parsed: unknown = JSON.parse(raw);

      if (
        typeof parsed !== 'object' ||
        parsed === null ||
        !('version' in parsed) ||
        !('config' in parsed)
      ) {
        console.warn(
          '[StorageService] Stored data has unexpected shape. Discarding.'
        );
        return null;
      }

      const { version, config } = parsed as StoredData;

      if (typeof version !== 'number') {
        console.warn(
          '[StorageService] Stored version is not a number. Discarding.'
        );
        return null;
      }

      return migrate(version, config);
    } catch (error) {
      console.error('[StorageService] Failed to load app config:', error);
      return null;
    }
  }

  /**
   * Remove the persisted AppConfig from localStorage.
   * Used to reset the application to its default state.
   */
  clearAppConfig(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('[StorageService] Failed to clear app config:', error);
    }
  }
}

/**
 * Singleton instance used throughout the application.
 */
export const storageService = new StorageService();
