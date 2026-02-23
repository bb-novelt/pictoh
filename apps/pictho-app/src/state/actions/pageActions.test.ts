import { describe, it, expect, beforeEach } from 'vitest';
import {
  navigateToPage,
  navigateToHome,
  createPage,
  deletePage,
  renamePage,
  getCurrentPage,
  getPageById,
  getAllPages,
} from './pageActions';
import { store } from '../store';

function resetStore() {
  // Remove all non-home pages
  const homeId = store.homePageId;
  store.pages.splice(
    0,
    store.pages.length,
    store.pages.find((p) => p.pageId === homeId)!
  );
  store.currentPageId = homeId;
  store.isEditMode = false;
}

describe('navigateToPage', () => {
  beforeEach(resetStore);

  it('sets currentPageId when the page exists', () => {
    const page = createPage('Cat Page');
    navigateToPage(page.pageId);
    expect(store.currentPageId).toBe(page.pageId);
  });

  it('does not change currentPageId when the page does not exist', () => {
    const before = store.currentPageId;
    navigateToPage('non-existent-id');
    expect(store.currentPageId).toBe(before);
  });

  it('navigates by pageId (not pageName)', () => {
    const page = createPage('Maison');
    navigateToPage(page.pageId);
    expect(store.currentPageId).toBe(page.pageId);
    // The name is irrelevant to navigation
    expect(store.currentPageId).not.toBe('Maison');
  });
});

describe('navigateToHome', () => {
  beforeEach(resetStore);

  it('sets currentPageId to homePageId', () => {
    const page = createPage('Other');
    store.currentPageId = page.pageId;
    navigateToHome();
    expect(store.currentPageId).toBe(store.homePageId);
  });
});

describe('createPage', () => {
  beforeEach(resetStore);

  it('adds a new page to the store', () => {
    const before = store.pages.length;
    createPage('Animaux');
    expect(store.pages.length).toBe(before + 1);
  });

  it('assigns a unique pageId', () => {
    const a = createPage('A');
    const b = createPage('B');
    expect(a.pageId).not.toBe(b.pageId);
  });

  it('does not navigate to new page by default', () => {
    const homeId = store.homePageId;
    createPage('New Page');
    expect(store.currentPageId).toBe(homeId);
  });

  it('navigates to new page when navigateToNew is true', () => {
    const page = createPage('Nav Page', true);
    expect(store.currentPageId).toBe(page.pageId);
  });

  it('creates page with 24 empty squares', () => {
    const page = createPage('Squares');
    expect(page.squares).toHaveLength(24);
  });
});

describe('deletePage', () => {
  beforeEach(resetStore);

  it('removes a non-home page from the store', () => {
    const page = createPage('To Delete');
    const before = store.pages.length;
    deletePage(page.pageId);
    expect(store.pages.length).toBe(before - 1);
    expect(store.pages.find((p) => p.pageId === page.pageId)).toBeUndefined();
  });

  it('does not delete the home page', () => {
    const before = store.pages.length;
    deletePage(store.homePageId);
    expect(store.pages.length).toBe(before);
  });

  it('navigates to home when deleting the current page', () => {
    const page = createPage('Current');
    store.currentPageId = page.pageId;
    deletePage(page.pageId);
    expect(store.currentPageId).toBe(store.homePageId);
  });

  it('does not change currentPageId when deleting a non-current page', () => {
    const page = createPage('Other');
    const homeId = store.homePageId;
    deletePage(page.pageId);
    expect(store.currentPageId).toBe(homeId);
  });
});

describe('renamePage', () => {
  beforeEach(resetStore);

  it('updates pageName while keeping pageId unchanged', () => {
    const page = createPage('Old Name');
    const id = page.pageId;
    renamePage(id, 'New Name');
    const found = store.pages.find((p) => p.pageId === id);
    expect(found?.pageName).toBe('New Name');
    expect(found?.pageId).toBe(id);
  });

  it('does nothing when page does not exist', () => {
    const before = store.pages.map((p) => p.pageName).join(',');
    renamePage('bad-id', 'Name');
    const after = store.pages.map((p) => p.pageName).join(',');
    expect(after).toBe(before);
  });
});

describe('getCurrentPage', () => {
  beforeEach(resetStore);

  it('returns the page matching currentPageId', () => {
    const page = createPage('Current');
    store.currentPageId = page.pageId;
    expect(getCurrentPage()?.pageId).toBe(page.pageId);
  });
});

describe('getPageById', () => {
  beforeEach(resetStore);

  it('returns the page with the given id', () => {
    const page = createPage('ById');
    expect(getPageById(page.pageId)?.pageName).toBe('ById');
  });

  it('returns undefined for unknown id', () => {
    expect(getPageById('unknown')).toBeUndefined();
  });
});

describe('getAllPages', () => {
  beforeEach(resetStore);

  it('returns all pages in the store', () => {
    createPage('Extra');
    const pages = getAllPages();
    expect(pages.length).toBeGreaterThanOrEqual(2);
  });
});
