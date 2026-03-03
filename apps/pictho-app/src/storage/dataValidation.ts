/**
 * Data validation for persisted AppConfig.
 *
 * Provides deep structural validation of the config loaded from localStorage:
 * - Required fields are checked at every level (config, page, square, picture).
 * - Invalid nested items are discarded (invalid pages removed, invalid squares
 *   dropped, invalid pictures replaced with null).
 * - Fixable inconsistencies (e.g. orphaned currentPageId) are corrected.
 * - All validation errors are logged via console.warn / console.error.
 */
import type { AppConfig, Page, Picture, Square } from '../shared/types';

// ---------------------------------------------------------------------------
// Picture
// ---------------------------------------------------------------------------

/**
 * Validate a raw value as a Picture.
 * Returns the Picture if valid, or null if any required field is missing or
 * has the wrong type.
 */
function validatePicture(raw: unknown): Picture | null {
  if (typeof raw !== 'object' || raw === null) {
    console.warn('[dataValidation] Picture is not an object:', raw);
    return null;
  }
  const p = raw as Record<string, unknown>;
  if (
    typeof p.id !== 'string' ||
    typeof p.text !== 'string' ||
    typeof p.src !== 'string' ||
    typeof p.isUserAdded !== 'boolean'
  ) {
    console.warn(
      '[dataValidation] Picture has missing or invalid fields:',
      raw
    );
    return null;
  }
  const picture: Picture = {
    id: p.id,
    text: p.text,
    src: p.src,
    isUserAdded: p.isUserAdded,
  };
  if (typeof p.lastUsedTime === 'number') {
    picture.lastUsedTime = p.lastUsedTime;
  }
  return picture;
}

// ---------------------------------------------------------------------------
// Square
// ---------------------------------------------------------------------------

/**
 * Validate a raw value as a Square.
 * An invalid selectedPicture is replaced with null rather than discarding
 * the whole square so we don't silently lose grid layout.
 * Returns null only when the square's own required fields are invalid.
 */
function validateSquare(raw: unknown): Square | null {
  if (typeof raw !== 'object' || raw === null) {
    console.warn('[dataValidation] Square is not an object:', raw);
    return null;
  }
  const s = raw as Record<string, unknown>;
  if (
    typeof s.position !== 'number' ||
    typeof s.associatedText !== 'string' ||
    typeof s.displayTextAbovePicture !== 'boolean' ||
    typeof s.openPageId !== 'string'
  ) {
    console.warn('[dataValidation] Square has missing or invalid fields:', raw);
    return null;
  }

  let selectedPicture: Picture | null = null;
  if (s.selectedPicture !== null && s.selectedPicture !== undefined) {
    selectedPicture = validatePicture(s.selectedPicture);
    if (selectedPicture === null) {
      console.warn(
        '[dataValidation] Square at position',
        s.position,
        'had an invalid picture – replaced with null.'
      );
    }
  }

  return {
    position: s.position,
    selectedPicture,
    associatedText: s.associatedText,
    displayTextAbovePicture: s.displayTextAbovePicture,
    openPageId: s.openPageId,
  };
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

/**
 * Validate a raw value as a Page.
 * Invalid squares within the page are discarded (not the whole page).
 * Returns null only when the page's own required fields are invalid.
 */
function validatePage(raw: unknown): Page | null {
  if (typeof raw !== 'object' || raw === null) {
    console.warn('[dataValidation] Page is not an object:', raw);
    return null;
  }
  const pg = raw as Record<string, unknown>;
  if (
    typeof pg.pageId !== 'string' ||
    typeof pg.pageName !== 'string' ||
    !Array.isArray(pg.squares)
  ) {
    console.warn('[dataValidation] Page has missing or invalid fields:', raw);
    return null;
  }

  const squares: Square[] = [];
  for (const rawSquare of pg.squares as unknown[]) {
    const square = validateSquare(rawSquare);
    if (square !== null) {
      squares.push(square);
    }
  }

  return {
    pageId: pg.pageId,
    pageName: pg.pageName,
    squares,
  };
}

// ---------------------------------------------------------------------------
// AppConfig
// ---------------------------------------------------------------------------

/**
 * Validate and sanitise a raw value as an AppConfig.
 *
 * - Invalid pages are discarded from the pages array.
 * - If no valid pages remain the config is considered unrecoverable and null
 *   is returned.
 * - If homePageId does not match any valid page the config is unrecoverable.
 * - If currentPageId does not match any valid page it is reset to homePageId.
 *
 * @returns A validated (and possibly sanitised) AppConfig, or null when the
 *          data cannot be recovered.
 */
export function validateAppConfig(raw: unknown): AppConfig | null {
  if (typeof raw !== 'object' || raw === null) {
    console.error('[dataValidation] Config is not an object:', raw);
    return null;
  }
  const c = raw as Record<string, unknown>;

  if (
    typeof c.homePageId !== 'string' ||
    typeof c.currentPageId !== 'string' ||
    typeof c.isEditMode !== 'boolean' ||
    !Array.isArray(c.pages)
  ) {
    console.error(
      '[dataValidation] Config has missing or invalid top-level fields:',
      raw
    );
    return null;
  }

  const pages: Page[] = [];
  for (const rawPage of c.pages as unknown[]) {
    const page = validatePage(rawPage);
    if (page !== null) {
      pages.push(page);
    }
  }

  if (pages.length === 0) {
    console.error(
      '[dataValidation] No valid pages found in config. Discarding saved data.'
    );
    return null;
  }

  const homePageExists = pages.some((p) => p.pageId === c.homePageId);
  if (!homePageExists) {
    console.error(
      '[dataValidation] homePageId',
      c.homePageId,
      'does not match any valid page. Discarding saved data.'
    );
    return null;
  }

  const currentPageExists = pages.some((p) => p.pageId === c.currentPageId);
  const currentPageId = currentPageExists
    ? (c.currentPageId as string)
    : (c.homePageId as string);

  if (!currentPageExists) {
    console.warn(
      '[dataValidation] currentPageId',
      c.currentPageId,
      'not found – reset to homePageId.'
    );
  }

  return {
    homePageId: c.homePageId as string,
    currentPageId,
    isEditMode: c.isEditMode as boolean,
    pages,
  };
}
