/**
 * Pure utility functions for picture selection logic.
 */
import type { Picture } from '../shared/types';
import { pictureService, PICTURE_DISPLAY_LIMIT } from './pictureService';

export type FilterType = 'both' | 'builtin' | 'user';

/**
 * Returns the pictures to display based on the active filter, search text,
 * and the 50-picture display limit.
 *
 * When there are more pictures than the limit, the most recently used ones
 * are kept and the resulting set is sorted alphabetically.
 */
export function getDisplayPictures(
  searchText: string,
  filter: FilterType
): Picture[] {
  let pictures: Picture[];
  if (filter === 'builtin') {
    pictures = pictureService.getBuiltInPictures();
  } else if (filter === 'user') {
    pictures = pictureService.getUserAddedPictures();
  } else {
    pictures = pictureService.getAllPictures();
  }

  // Apply search filter
  const q = searchText.trim().toLowerCase();
  if (q) {
    pictures = pictures.filter((p) => p.text.toLowerCase().includes(q));
  }

  // Apply display limit: keep the most recently used pictures, sorted alpha
  if (pictures.length > PICTURE_DISPLAY_LIMIT) {
    pictures = [...pictures]
      .sort((a, b) => (b.lastUsedTime ?? 0) - (a.lastUsedTime ?? 0))
      .slice(0, PICTURE_DISPLAY_LIMIT)
      .sort((a, b) => a.text.localeCompare(b.text));
  }

  return pictures;
}
