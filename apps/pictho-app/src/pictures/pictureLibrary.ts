/**
 * Picture library – built-in picture discovery and object creation.
 *
 * Discovery approach: the BUILT_IN_PICTURE_STEMS list is used to enumerate all
 * pictures available in /public/assets/pictures/.  When new images are added to
 * that directory, add the filename stem (without extension) to the list below.
 * A manifest-generation script can replace this list in the future.
 */
import type { Picture } from '../shared/types';

/**
 * Filename stems (without extension) for every built-in SVG in
 * /public/assets/pictures/.  Keep sorted alphabetically.
 */
export const BUILT_IN_PICTURE_STEMS: string[] = [
  'arbre',
  'chat',
  'eau',
  'fleur',
  'maison',
  'manger',
  'soleil',
  'voiture',
];

/**
 * Create a built-in Picture object from a filename stem.
 * e.g. 'manger' → { id: 'builtin-manger', text: 'Manger', src: '/assets/pictures/manger.svg', … }
 */
export function createBuiltInPicture(stem: string): Picture {
  return {
    id: `builtin-${stem}`,
    text: stem.charAt(0).toUpperCase() + stem.slice(1),
    src: `/assets/pictures/${stem}.svg`,
    isUserAdded: false,
  };
}

/**
 * All built-in Picture objects, sorted alphabetically by stem.
 */
export const BUILT_IN_PICTURES: Picture[] =
  BUILT_IN_PICTURE_STEMS.map(createBuiltInPicture);
