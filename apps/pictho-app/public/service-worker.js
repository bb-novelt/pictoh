/* global self, caches, fetch, URL, console */
/* eslint-disable no-console */
/**
 * Custom Service Worker for Pict'Oh
 * Implements offline-first architecture with cache strategies
 */

// Workbox will inject the precache manifest here
const PRECACHE_MANIFEST = self.__WB_MANIFEST || [];

const CACHE_VERSION = 'v1';
const CACHE_NAME = `pictoh-${CACHE_VERSION}`;
const APP_SHELL_CACHE = `pictoh-shell-${CACHE_VERSION}`;
const ASSETS_CACHE = `pictoh-assets-${CACHE_VERSION}`;
const IMAGES_CACHE = `pictoh-images-${CACHE_VERSION}`;

// App shell files (cache-first strategy)
const APP_SHELL_FILES = ['/', '/index.html', '/manifest.json', '/favicon.ico'];

/**
 * Install event - cache app shell and precache manifest
 */
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing service worker...');

  event.waitUntil(
    Promise.all([
      // Cache app shell
      caches.open(APP_SHELL_CACHE).then((cache) => {
        console.log('[Service Worker] Caching app shell');
        return cache.addAll(APP_SHELL_FILES);
      }),
      // Cache precache manifest from Workbox
      caches.open(CACHE_NAME).then((cache) => {
        console.log('[Service Worker] Caching precache manifest');
        return cache.addAll(PRECACHE_MANIFEST.map((entry) => entry.url));
      }),
    ]).then(() => {
      // Force the waiting service worker to become the active service worker
      return self.skipWaiting();
    })
  );
});

/**
 * Activate event - clean up old caches
 */
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating service worker...');

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Delete old caches that don't match current version
            if (
              cacheName.startsWith('pictoh-') &&
              cacheName !== CACHE_NAME &&
              cacheName !== APP_SHELL_CACHE &&
              cacheName !== ASSETS_CACHE &&
              cacheName !== IMAGES_CACHE
            ) {
              console.log('[Service Worker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        // Take control of all pages immediately
        return self.clients.claim();
      })
  );
});

/**
 * Fetch event - implement caching strategies
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin requests
  if (url.origin !== self.location.origin) {
    return;
  }

  // Strategy selection based on resource type
  if (isAppShell(url)) {
    // Cache-first for app shell
    event.respondWith(cacheFirst(request, APP_SHELL_CACHE));
  } else if (isImage(url)) {
    // Cache-first for images
    event.respondWith(cacheFirst(request, IMAGES_CACHE));
  } else if (isAsset(url)) {
    // Cache-first for JS/CSS assets
    event.respondWith(cacheFirst(request, ASSETS_CACHE));
  } else {
    // Network-first with cache fallback for other resources
    event.respondWith(networkFirst(request, CACHE_NAME));
  }
});

/**
 * Cache-first strategy
 * Try cache first, fall back to network
 */
async function cacheFirst(request, cacheName) {
  try {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      console.log('[Service Worker] Cache hit:', request.url);
      return cachedResponse;
    }

    console.log(
      '[Service Worker] Cache miss, fetching from network:',
      request.url
    );
    const networkResponse = await fetch(request);

    // Cache the network response for future use
    if (networkResponse && networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.error('[Service Worker] Cache-first failed:', error);
    throw error;
  }
}

/**
 * Network-first strategy with cache fallback
 * Try network first, fall back to cache if offline
 */
async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request);

    // Cache successful network responses
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log('[Service Worker] Network failed, trying cache:', request.url);
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    throw error;
  }
}

/**
 * Check if URL is part of app shell
 */
function isAppShell(url) {
  const pathname = url.pathname;
  return (
    pathname === '/' ||
    pathname === '/index.html' ||
    pathname === '/manifest.json' ||
    pathname.endsWith('.ico')
  );
}

/**
 * Check if URL is an image
 */
function isImage(url) {
  const pathname = url.pathname;
  return pathname.match(/\.(png|jpg|jpeg|svg|gif|webp|ico)$/i);
}

/**
 * Check if URL is a static asset (JS/CSS)
 */
function isAsset(url) {
  const pathname = url.pathname;
  return pathname.match(/\.(js|css|woff|woff2|ttf|eot)$/i);
}

/**
 * Message handler for communication with the app
 */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  // Handle cache preloading requests
  if (event.data && event.data.type === 'CACHE_URLS') {
    const { urls, cacheName = IMAGES_CACHE } = event.data;
    event.waitUntil(
      caches.open(cacheName).then((cache) => {
        console.log('[Service Worker] Preloading URLs to cache:', urls.length);
        return cache.addAll(urls);
      })
    );
  }
});
