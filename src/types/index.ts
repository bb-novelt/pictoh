/**
 * Picture metadata
 */
export interface Picture {
  id: string; // filename without extension
  fileName: string; // full filename
  text: string; // associated text (default = filename)
  isFavorite: boolean; // becomes true once used
}

/**
 * Square in the grid
 */
export interface Square {
  id: number; // 0-23
  selectedPicture?: string; // Picture id
  associatedText: string;
  displayTextAbovePicture: boolean;
  openPageName: string; // empty = no navigation
}

/**
 * Page containing 24 squares (6x4 grid)
 */
export interface Page {
  pageName: string;
  squares: Square[]; // always 24 squares
}

/**
 * App configuration
 */
export interface AppConfig {
  homePageName: string;
  pages: Page[];
  pictures: Picture[];
  currentPageName: string;
  isEditMode: boolean;
}

/**
 * Initial state factory
 */
export const createEmptySquare = (id: number): Square => ({
  id,
  selectedPicture: undefined,
  associatedText: '',
  displayTextAbovePicture: true,
  openPageName: '',
});

export const createEmptyPage = (pageName: string): Page => ({
  pageName,
  squares: Array.from({ length: 24 }, (_, i) => createEmptySquare(i)),
});

export const createInitialConfig = (): AppConfig => ({
  homePageName: 'Accueil',
  pages: [createEmptyPage('Accueil')],
  pictures: [],
  currentPageName: 'Accueil',
  isEditMode: false,
});
