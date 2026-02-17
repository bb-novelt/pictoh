/**
 * Picture tracking and usage actions
 */
import type { Picture } from '../../types';

/**
 * Update the last used timestamp for a picture
 * This is used to track picture usage so we can display only the most recently used pictures
 * in the selection UI (limited to 50 pictures)
 * @param picture - Picture to update
 */
export function updatePictureUsage(picture: Picture): void {
  // Update the picture's last used time
  picture.lastUsedTime = Date.now();
}

/**
 * Get pictures sorted by most recently used
 * @param pictures - Array of pictures to sort
 * @returns Pictures sorted by last used time (most recent first)
 */
export function getPicturesByRecentUsage(pictures: Picture[]): Picture[] {
  return [...pictures].sort((a, b) => {
    const timeA = a.lastUsedTime || 0;
    const timeB = b.lastUsedTime || 0;
    return timeB - timeA;
  });
}

/**
 * Get the top N most recently used pictures
 * Used to limit picture selection UI to 50 most recently used pictures
 * @param pictures - Array of pictures to filter
 * @param limit - Maximum number of pictures to return (default: 50)
 * @returns Top N most recently used pictures
 */
export function getMostRecentlyUsedPictures(
  pictures: Picture[],
  limit: number = 50
): Picture[] {
  // Sort by most recently used first, then take the top N
  return getPicturesByRecentUsage(pictures).slice(0, limit);
}

/**
 * Reset usage tracking for a picture
 * @param picture - Picture to reset
 */
export function resetPictureUsage(picture: Picture): void {
  picture.lastUsedTime = undefined;
}

/**
 * Reset usage tracking for all pictures
 * @param pictures - Array of pictures to reset
 */
export function resetAllPictureUsage(pictures: Picture[]): void {
  pictures.forEach((picture) => {
    picture.lastUsedTime = undefined;
  });
}
