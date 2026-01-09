import { Picture } from '../types';

/**
 * Load pictures from the assets directory
 * For now, we'll use a hardcoded list of sample pictures
 * In production, this could be loaded dynamically
 */
export const loadPictures = (): Picture[] => {
  // Sample pictures - in production, this would scan the assets/pictures directory
  const samplePictures = [
    'maison',
    'chat',
    'chien',
    'voiture',
    'arbre',
    'soleil',
    'eau',
    'manger',
    'boire',
    'dormir',
    'jouer',
    'livre',
    'musique',
    'telephone',
    'ordinateur',
  ];

  return samplePictures.map((name) => ({
    id: name,
    fileName: `${name}.svg`,
    text: name.charAt(0).toUpperCase() + name.slice(1),
    isFavorite: false,
  }));
};

/**
 * Initialize pictures in the app state if not already loaded
 */
export const initializePictures = (
  currentPictures: Picture[]
): Picture[] => {
  if (currentPictures.length === 0) {
    return loadPictures();
  }
  return currentPictures;
};
