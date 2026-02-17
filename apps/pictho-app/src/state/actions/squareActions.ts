/**
 * Square-related state actions
 */
import type { Square, Picture } from '../../types';
import { getCurrentPage } from './pageActions';

/**
 * Get a square by position on the current page
 * @param position - Square position (0-23)
 * @returns The square or undefined if not found
 */
export function getSquareByPosition(position: number): Square | undefined {
  const currentPage = getCurrentPage();
  if (!currentPage) return undefined;

  return currentPage.squares.find((square) => square.position === position);
}

/**
 * Get a square at a specific grid position (row, col)
 * @param row - Row index (0-3)
 * @param col - Column index (0-5)
 * @returns The square or undefined if not found
 */
export function getSquareAtPosition(
  row: number,
  col: number
): Square | undefined {
  if (row < 0 || row > 3 || col < 0 || col > 5) {
    console.warn(`Invalid grid position: row=${row}, col=${col}`);
    return undefined;
  }

  const position = row * 6 + col;
  return getSquareByPosition(position);
}

/**
 * Update a square's properties
 * @param position - Square position (0-23)
 * @param updates - Partial square updates
 */
export function updateSquare(position: number, updates: Partial<Square>): void {
  const currentPage = getCurrentPage();
  if (!currentPage) {
    console.warn('No current page found');
    return;
  }

  const squareIndex = currentPage.squares.findIndex(
    (s) => s.position === position
  );
  if (squareIndex === -1) {
    console.warn(`Square at position ${position} not found`);
    return;
  }

  // Apply updates to the square
  Object.assign(currentPage.squares[squareIndex], updates);
}

/**
 * Set the picture for a square
 * @param position - Square position (0-23)
 * @param picture - Picture to set (null to clear)
 */
export function setSquarePicture(
  position: number,
  picture: Picture | null
): void {
  updateSquare(position, { selectedPicture: picture });
}

/**
 * Set the text for a square
 * @param position - Square position (0-23)
 * @param text - Text to set
 */
export function setSquareText(position: number, text: string): void {
  updateSquare(position, { associatedText: text });
}

/**
 * Toggle whether text is displayed above the picture
 * @param position - Square position (0-23)
 */
export function toggleSquareTextDisplay(position: number): void {
  const square = getSquareByPosition(position);
  if (!square) {
    console.warn(`Square at position ${position} not found`);
    return;
  }

  updateSquare(position, {
    displayTextAbovePicture: !square.displayTextAbovePicture,
  });
}

/**
 * Set the page to open when the square is clicked
 * @param position - Square position (0-23)
 * @param pageId - Page ID to navigate to (empty string for none)
 */
export function setSquareNavigationTarget(
  position: number,
  pageId: string
): void {
  updateSquare(position, { openPageId: pageId });
}

/**
 * Clear all properties of a square (reset to empty)
 * @param position - Square position (0-23)
 */
export function clearSquare(position: number): void {
  updateSquare(position, {
    selectedPicture: null,
    associatedText: '',
    displayTextAbovePicture: false,
    openPageId: '',
  });
}
