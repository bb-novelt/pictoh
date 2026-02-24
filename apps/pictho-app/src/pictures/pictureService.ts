/**
 * PictureService – manages the built-in picture library and user-added pictures.
 *
 * Loaded pictures are cached in memory so repeated calls are O(1) after the
 * first access.  User-added pictures are held in memory for this session;
 * persistence will be added in Epic 9 (storage service).
 */
import type { Picture } from '../shared/types';
import { BUILT_IN_PICTURES, createBuiltInPicture } from './pictureLibrary';

/**
 * Maximum number of pictures shown at once in the selection UI.
 */
export const PICTURE_DISPLAY_LIMIT = 50;

class PictureService {
  /** In-memory cache of built-in pictures (populated on first access). */
  private builtInCache: Picture[] | null = null;

  /** User-added pictures for this session. */
  private userAddedPictures: Picture[] = [];

  // ─── built-in pictures ────────────────────────────────────────────────────

  /**
   * Returns all built-in pictures, sorted alphabetically by name.
   * Results are cached in memory after the first call.
   * Each picture object is a shallow copy so mutations stay local to this service.
   */
  getBuiltInPictures(): Picture[] {
    if (!this.builtInCache) {
      this.builtInCache = BUILT_IN_PICTURES.map((p) => ({ ...p })).sort(
        (a, b) => a.text.localeCompare(b.text)
      );
    }
    return this.builtInCache;
  }

  // ─── user-added pictures ──────────────────────────────────────────────────

  /**
   * Returns all user-added pictures, sorted alphabetically by name.
   */
  getUserAddedPictures(): Picture[] {
    return [...this.userAddedPictures].sort((a, b) =>
      a.text.localeCompare(b.text)
    );
  }

  /**
   * Add a user-provided picture to the library.
   * @param id   - Unique identifier for the picture.
   * @param text - Display name for the picture.
   * @param src  - URL or data URL to the image file.
   * @returns The newly created Picture object.
   */
  addUserPicture(id: string, text: string, src: string): Picture {
    const picture: Picture = { id, text, src, isUserAdded: true };
    this.userAddedPictures.push(picture);
    return picture;
  }

  // ─── combined access ──────────────────────────────────────────────────────

  /**
   * Returns all pictures (built-in + user-added), sorted alphabetically.
   * Loaded once and cached in memory.
   */
  getAllPictures(): Picture[] {
    return [...this.getBuiltInPictures(), ...this.getUserAddedPictures()].sort(
      (a, b) => a.text.localeCompare(b.text)
    );
  }

  // ─── search ───────────────────────────────────────────────────────────────

  /**
   * Filter all pictures whose display name contains the query string
   * (case-insensitive).
   * @param query - Search string.
   * @returns Matching pictures, sorted alphabetically.
   */
  searchPictures(query: string): Picture[] {
    const q = query.trim().toLowerCase();
    if (!q) return this.getAllPictures();
    return this.getAllPictures().filter((p) =>
      p.text.toLowerCase().includes(q)
    );
  }

  // ─── usage tracking ───────────────────────────────────────────────────────

  /**
   * Update the lastUsedTime for a picture (identified by id) across both
   * built-in and user-added libraries.
   * @param pictureId - ID of the picture that was used.
   */
  updateLastUsedTime(pictureId: string): void {
    const now = Date.now();

    // Ensure the cache is populated so we always work on our own copies.
    const builtIns = this.getBuiltInPictures();
    const pic = builtIns.find((p) => p.id === pictureId);
    if (pic) {
      pic.lastUsedTime = now;
      return;
    }

    // Check user-added pictures
    const userPic = this.userAddedPictures.find((p) => p.id === pictureId);
    if (userPic) {
      userPic.lastUsedTime = now;
    }
  }

  /**
   * Returns all pictures sorted by most recently used (most recent first).
   * Pictures with no lastUsedTime appear at the end.
   */
  getPicturesSortedByLastUsed(): Picture[] {
    return [...this.getAllPictures()].sort((a, b) => {
      const tA = a.lastUsedTime ?? 0;
      const tB = b.lastUsedTime ?? 0;
      return tB - tA;
    });
  }

  // ─── utility ──────────────────────────────────────────────────────────────

  /**
   * Create a built-in Picture object for the given stem and register it.
   * Useful when the store needs a canonical Picture reference.
   */
  createBuiltIn(stem: string): Picture {
    return createBuiltInPicture(stem);
  }

  /** Clears in-memory caches (useful for testing). */
  reset(): void {
    this.builtInCache = null;
    this.userAddedPictures = [];
  }
}

/**
 * Singleton instance used throughout the application.
 */
export const pictureService = new PictureService();
