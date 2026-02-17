/**
 * Core TypeScript type definitions for Pict'Oh
 */

/**
 * Represents a picture in the library (built-in or user-added)
 */
export interface Picture {
  /** Unique identifier for the picture */
  id: string;
  /** Display name/text for the picture */
  text: string;
  /** Path or URL to the picture file */
  src: string;
  /** Whether this is a user-added picture (vs built-in) */
  isUserAdded: boolean;
  /** Timestamp of last usage (for tracking and limiting display) */
  lastUsedTime?: number;
}

/**
 * Represents a square in the 6x4 grid
 */
export interface Square {
  /** Position in the grid (0-23) */
  position: number;
  /** Selected picture (null if empty square) */
  selectedPicture: Picture | null;
  /** Text to be read aloud when square is touched */
  associatedText: string;
  /** Whether to display text above the picture */
  displayTextAbovePicture: boolean;
  /** Page ID to navigate to when square is touched (empty = no navigation) */
  openPageId: string;
}

/**
 * Represents a page with a 6x4 grid of squares
 */
export interface Page {
  /** Unique identifier for the page */
  pageId: string;
  /** Display name for the page (can be renamed) */
  pageName: string;
  /** Fixed array of 24 squares (6 columns x 4 rows) */
  squares: Square[];
}

/**
 * App-level configuration and state
 */
export interface AppConfig {
  /** ID of the home page */
  homePageId: string;
  /** ID of the currently active page */
  currentPageId: string;
  /** All pages in the app */
  pages: Page[];
  /** Whether edit mode is currently active */
  isEditMode: boolean;
}
