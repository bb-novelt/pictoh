/**
 * Picture tracking and usage actions
 */
import type { Picture } from '../../types';

/**
 * Update the last used timestamp for a picture
 * This is used to track and limit frequently used pictures in the selection UI
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
 * Get pictures that haven't been used recently
 * Useful for hiding frequently used pictures in the selection UI
 * @param pictures - Array of pictures to filter
 * @param recentThreshold - Time in milliseconds to consider "recent" (default: 5 minutes)
 * @returns Pictures that haven't been used within the threshold
 */
export function getUnusedRecentPictures(
  pictures: Picture[],
  recentThreshold: number = 5 * 60 * 1000
): Picture[] {
  const now = Date.now();
  return pictures.filter((picture) => {
    const lastUsed = picture.lastUsedTime || 0;
    return now - lastUsed > recentThreshold;
  });
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
