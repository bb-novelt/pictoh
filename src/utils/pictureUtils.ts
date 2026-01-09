import { appState } from '../state/appState';

/**
 * Get the full image path for a picture ID
 */
export const getPicturePath = (pictureId: string): string => {
  const picture = appState.pictures.find((p) => p.id === pictureId);
  if (picture) {
    return `/assets/pictures/${picture.fileName}`;
  }
  // Fallback to SVG
  return `/assets/pictures/${pictureId}.svg`;
};
