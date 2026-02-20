/**
 * Valtio state store for Pict'Oh application
 */
import { proxy } from 'valtio';
import type { AppConfig, Page, Square } from '../shared/types';

/**
 * Generate a unique ID using crypto.randomUUID
 */
function generateId(): string {
  return crypto.randomUUID();
}

/**
 * Create an empty square at a specific position
 */
function createEmptySquare(position: number): Square {
  return {
    position,
    selectedPicture: null,
    associatedText: '',
    displayTextAbovePicture: false,
    openPageId: '',
  };
}

/**
 * Create a page with 24 empty squares (6 columns x 4 rows)
 */
function createPage(pageName: string, pageId?: string): Page {
  const id = pageId || generateId();
  const squares: Square[] = [];

  // Create 24 squares (6 columns x 4 rows)
  for (let i = 0; i < 24; i++) {
    squares.push(createEmptySquare(i));
  }

  return {
    pageId: id,
    pageName,
    squares,
  };
}

/**
 * Initialize the default application state
 */
function initializeStore(): AppConfig {
  // Create the default "Home" page
  const homePage = createPage('Home');

  return {
    homePageId: homePage.pageId,
    currentPageId: homePage.pageId,
    pages: [homePage],
    isEditMode: false,
  };
}

/**
 * Main application state store (Valtio proxy)
 */
export const store = proxy<AppConfig>(initializeStore());

/**
 * Get the current active page
 */
export function getCurrentPage(): Page | undefined {
  return store.pages.find((page) => page.pageId === store.currentPageId);
}

/**
 * Get a square at a specific grid position (row, col)
 * @param row - Row index (0-3)
 * @param col - Column index (0-5)
 */
export function getSquareAtPosition(
  row: number,
  col: number
): Square | undefined {
  const currentPage = getCurrentPage();
  if (!currentPage) return undefined;

  const position = row * 6 + col;
  return currentPage.squares.find((square) => square.position === position);
}

/**
 * Update a square's properties
 * @param position - Square position (0-23)
 * @param updates - Partial square updates
 */
export function updateSquare(position: number, updates: Partial<Square>): void {
  const currentPage = getCurrentPage();
  if (!currentPage) return;

  const squareIndex = currentPage.squares.findIndex(
    (s) => s.position === position
  );
  if (squareIndex === -1) return;

  // Apply updates to the square
  Object.assign(currentPage.squares[squareIndex], updates);
}

/**
 * Add a new page with a generated unique pageId
 * @param pageName - Name for the new page
 * @returns The created page
 */
export function addPage(pageName: string): Page {
  const newPage = createPage(pageName);
  store.pages.push(newPage);
  return newPage;
}

/**
 * Delete a page by its pageId
 * @param pageId - ID of the page to delete
 */
export function deletePage(pageId: string): void {
  // Don't allow deleting the home page
  if (pageId === store.homePageId) {
    console.warn('Cannot delete the home page');
    return;
  }

  const pageIndex = store.pages.findIndex((page) => page.pageId === pageId);
  if (pageIndex === -1) return;

  // If we're deleting the current page, navigate to home
  if (store.currentPageId === pageId) {
    store.currentPageId = store.homePageId;
  }

  store.pages.splice(pageIndex, 1);
}

/**
 * Rename a page by its pageId
 * @param pageId - ID of the page to rename
 * @param newName - New name for the page
 */
export function renamePage(pageId: string, newName: string): void {
  const page = store.pages.find((p) => p.pageId === pageId);
  if (page) {
    page.pageName = newName;
  }
}
