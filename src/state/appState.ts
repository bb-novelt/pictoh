import { proxy, subscribe } from 'valtio';
import { AppConfig, createInitialConfig, Page, Picture, Square } from '../types';

const STORAGE_KEY = 'pictho-config';

/**
 * Load state from localStorage
 */
const loadStateFromStorage = (): AppConfig => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading state from localStorage:', error);
  }
  return createInitialConfig();
};

/**
 * Save state to localStorage
 */
const saveStateToStorage = (state: AppConfig) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving state to localStorage:', error);
  }
};

/**
 * Global app state
 */
export const appState = proxy<AppConfig>(loadStateFromStorage());

/**
 * Auto-save on every change
 */
subscribe(appState, () => {
  saveStateToStorage(appState);
});

/**
 * State actions
 */
export const actions = {
  // Page actions
  setCurrentPage(pageName: string) {
    appState.currentPageName = pageName;
  },

  createPage(pageName: string) {
    const newPage: Page = {
      pageName,
      squares: Array.from({ length: 24 }, (_, i) => ({
        id: i,
        selectedPicture: undefined,
        associatedText: '',
        displayTextAbovePicture: true,
        openPageName: '',
      })),
    };
    appState.pages.push(newPage);
    appState.currentPageName = pageName;
  },

  renamePage(oldName: string, newName: string) {
    const page = appState.pages.find((p) => p.pageName === oldName);
    if (page) {
      page.pageName = newName;
      if (appState.currentPageName === oldName) {
        appState.currentPageName = newName;
      }
      if (appState.homePageName === oldName) {
        appState.homePageName = newName;
      }
      // Update all squares that reference this page
      appState.pages.forEach((p) => {
        p.squares.forEach((s) => {
          if (s.openPageName === oldName) {
            s.openPageName = newName;
          }
        });
      });
    }
  },

  deletePage(pageName: string) {
    const index = appState.pages.findIndex((p) => p.pageName === pageName);
    if (index !== -1) {
      appState.pages.splice(index, 1);
      // If deleting current page, go to home
      if (appState.currentPageName === pageName) {
        appState.currentPageName = appState.homePageName;
      }
      // Clear references to deleted page
      appState.pages.forEach((p) => {
        p.squares.forEach((s) => {
          if (s.openPageName === pageName) {
            s.openPageName = '';
          }
        });
      });
    }
  },

  // Edit mode actions
  setEditMode(enabled: boolean) {
    appState.isEditMode = enabled;
  },

  toggleEditMode() {
    appState.isEditMode = !appState.isEditMode;
  },

  // Square actions
  updateSquare(pageIndex: number, squareId: number, updates: Partial<Square>) {
    const square = appState.pages[pageIndex]?.squares[squareId];
    if (square) {
      Object.assign(square, updates);
      
      // Mark picture as favorite if used
      if (updates.selectedPicture) {
        const picture = appState.pictures.find((p) => p.id === updates.selectedPicture);
        if (picture && !picture.isFavorite) {
          picture.isFavorite = true;
        }
      }
    }
  },

  // Picture actions
  addPicture(picture: Picture) {
    const existing = appState.pictures.find((p) => p.id === picture.id);
    if (!existing) {
      appState.pictures.push(picture);
    }
  },

  updatePicture(pictureId: string, updates: Partial<Picture>) {
    const picture = appState.pictures.find((p) => p.id === pictureId);
    if (picture) {
      Object.assign(picture, updates);
    }
  },
};

/**
 * Selectors
 */
export const selectors = {
  getCurrentPage(): Page | undefined {
    return appState.pages.find((p) => p.pageName === appState.currentPageName);
  },

  getFavoritePictures(): Picture[] {
    return appState.pictures.filter((p) => p.isFavorite);
  },

  getAllPictures(): Picture[] {
    return appState.pictures;
  },
};
