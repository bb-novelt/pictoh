/* global self, caches, fetch, URL, console */
/* eslint-disable no-console */
/**
 * Custom Service Worker for Pict'Oh
 * Implements offline-first architecture with cache-first strategy
 * and cache expiration policies
 */

// Workbox will inject the precache manifest here
const PRECACHE_MANIFEST = self.__WB_MANIFEST || [];

const CACHE_VERSION = 'v1';
const CACHE_NAME = `pictoh-${CACHE_VERSION}`;
const APP_SHELL_CACHE = `pictoh-shell-${CACHE_VERSION}`;
const ASSETS_CACHE = `pictoh-assets-${CACHE_VERSION}`;
const IMAGES_CACHE = `pictoh-images-${CACHE_VERSION}`;
const USER_PICTURES_CACHE = `pictoh-user-pictures-${CACHE_VERSION}`;

// Cache expiration policies
const MAX_IMAGE_CACHE_ENTRIES = 200;
const MAX_USER_PICTURES_CACHE_ENTRIES = 50;
const MAX_CACHE_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

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

  const currentCaches = new Set([
    CACHE_NAME,
    APP_SHELL_CACHE,
    ASSETS_CACHE,
    IMAGES_CACHE,
    USER_PICTURES_CACHE,
  ]);

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Delete old caches that don't match current version
            if (
              cacheName.startsWith('pictoh-') &&
              !currentCaches.has(cacheName)
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
  } else if (isUserPicture(url)) {
    // Cache-first for user-added pictures (separate cache with stricter limits)
    event.respondWith(
      cacheFirst(request, USER_PICTURES_CACHE, MAX_USER_PICTURES_CACHE_ENTRIES)
    );
  } else if (isImage(url)) {
    // Cache-first for built-in library images
    event.respondWith(
      cacheFirst(request, IMAGES_CACHE, MAX_IMAGE_CACHE_ENTRIES)
    );
  } else if (isAsset(url)) {
    // Cache-first for JS/CSS assets
    event.respondWith(cacheFirst(request, ASSETS_CACHE));
  } else {
    // Cache-first for all other resources (100% offline app)
    event.respondWith(cacheFirst(request, CACHE_NAME));
  }
});

/**
 * Cache-first strategy with optional max entries enforcement
 * Try cache first, fall back to network; evict oldest entries when limit is exceeded
 */
async function cacheFirst(request, cacheName, maxEntries) {
  try {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      // Check if the cached response is still fresh
      if (!isCacheExpired(cachedResponse)) {
        console.log('[Service Worker] Cache hit:', request.url);
        return cachedResponse;
      }
      console.log('[Service Worker] Cache expired, refetching:', request.url);
    }

    console.log(
      '[Service Worker] Cache miss, fetching from network:',
      request.url
    );
    const networkResponse = await fetch(request);

    // Cache the network response for future use
    if (networkResponse && networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
      // Enforce max entries limit after adding new entry
      if (maxEntries) {
        enforceCacheLimit(cache, maxEntries);
      }
    }

    return networkResponse;
  } catch (error) {
    console.error('[Service Worker] Cache-first failed:', error);
    throw error;
  }
}

/**
 * Check if a cached response has exceeded the max cache age
 */
function isCacheExpired(response) {
  const dateHeader = response.headers.get('date');
  if (!dateHeader) return false;
  const cachedAt = new Date(dateHeader).getTime();
  return Date.now() - cachedAt > MAX_CACHE_AGE_MS;
}

/**
 * Evict the oldest cache entries when the cache exceeds maxEntries.
 * Note: cache.keys() returns entries in insertion order in all major browsers,
 * so deleting from the front removes the oldest entries first (FIFO eviction).
 */
async function enforceCacheLimit(cache, maxEntries) {
  const keys = await cache.keys();
  if (keys.length > maxEntries) {
    const entriesToDelete = keys.length - maxEntries;
    for (let i = 0; i < entriesToDelete; i++) {
      await cache.delete(keys[i]);
    }
    console.log(
      '[Service Worker] Evicted',
      entriesToDelete,
      'old cache entries'
    );
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
 * Check if URL is an image from the built-in picture library
 */
function isImage(url) {
  const pathname = url.pathname;
  return pathname.match(/\.(png|jpg|jpeg|svg|gif|webp)$/i);
}

/**
 * Check if URL is a user-added picture (data URL stored as blob or separate path)
 */
function isUserPicture(url) {
  const pathname = url.pathname;
  return pathname.startsWith('/user-pictures/');
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

  // Handle bulk cache preloading requests (e.g. picture library on first launch)
  if (event.data && event.data.type === 'CACHE_URLS') {
    const { urls, cacheName = IMAGES_CACHE } = event.data;
    event.waitUntil(
      caches.open(cacheName).then((cache) => {
        console.log('[Service Worker] Preloading URLs to cache:', urls.length);
        return cache.addAll(urls);
      })
    );
  }

  // Handle single user-added picture caching (immediate offline availability)
  if (event.data && event.data.type === 'CACHE_USER_PICTURE') {
    const { url } = event.data;
    event.waitUntil(
      caches.open(USER_PICTURES_CACHE).then(async (cache) => {
        console.log('[Service Worker] Caching user picture:', url);
        const response = await fetch(url);
        if (response && response.status === 200) {
          await cache.put(url, response);
          await enforceCacheLimit(cache, MAX_USER_PICTURES_CACHE_ENTRIES);
        }
      })
    );
  }
});
