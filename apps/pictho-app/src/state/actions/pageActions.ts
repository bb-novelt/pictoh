/**
 * Page-related state actions
 */
import { store } from '../store';
import type { Page } from '../../types';

/**
 * Navigate to a page by its pageId
 * @param pageId - ID of the page to navigate to
 */
export function navigateToPage(pageId: string): void {
  const pageExists = store.pages.some((page) => page.pageId === pageId);
  if (!pageExists) {
    console.warn(`Page with ID ${pageId} does not exist`);
    return;
  }

  store.currentPageId = pageId;
}

/**
 * Navigate to the home page
 */
export function navigateToHome(): void {
  store.currentPageId = store.homePageId;
}

/**
 * Create a new page and optionally navigate to it
 * @param pageName - Name for the new page
 * @param navigateToNew - Whether to navigate to the new page (default: false)
 * @returns The created page
 */
export function createPage(
  pageName: string,
  navigateToNew: boolean = false
): Page {
  const newPage: Page = {
    pageId: crypto.randomUUID(),
    pageName,
    squares: Array.from({ length: 24 }, (_, i) => ({
      position: i,
      selectedPicture: null,
      associatedText: '',
      displayTextAbovePicture: false,
      openPageId: '',
    })),
  };

  store.pages.push(newPage);

  if (navigateToNew) {
    store.currentPageId = newPage.pageId;
  }

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
  if (pageIndex === -1) {
    console.warn(`Page with ID ${pageId} not found`);
    return;
  }

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
  if (!page) {
    console.warn(`Page with ID ${pageId} not found`);
    return;
  }

  page.pageName = newName;
}

/**
 * Get all pages
 * @returns Array of all pages
 */
export function getAllPages(): Page[] {
  return store.pages;
}

/**
 * Get a page by its pageId
 * @param pageId - ID of the page to retrieve
 * @returns The page or undefined if not found
 */
export function getPageById(pageId: string): Page | undefined {
  return store.pages.find((page) => page.pageId === pageId);
}

/**
 * Get the current active page
 * @returns The current page or undefined if not found
 */
export function getCurrentPage(): Page | undefined {
  return store.pages.find((page) => page.pageId === store.currentPageId);
}
