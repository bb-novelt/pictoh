/**
 * Service Worker Registration Module
 * Handles registration, updates, and lifecycle events
 */

/**
 * Extended window interface to store update interval ID
 */
declare global {
  interface Window {
    __swUpdateInterval?: number;
  }
}

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

export interface Config {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onOfflineReady?: () => void;
}

/**
 * Register the service worker
 */
export function register(config?: Config): void {
  if ('serviceWorker' in navigator) {
    // Wait for the page to load before registering
    window.addEventListener('load', () => {
      const swUrl = `/service-worker.js`;

      if (isLocalhost) {
        // This is running on localhost. Check if a service worker still exists or not.
        checkValidServiceWorker(swUrl, config);
      } else {
        // Is not localhost. Just register service worker
        registerValidSW(swUrl, config);
      }
    });
  }
}

/**
 * Register a valid service worker
 */
function registerValidSW(swUrl: string, config?: Config): void {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      // Service worker registered successfully

      // Check for updates periodically
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }

        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // New content is available; please refresh.

              // Execute callback
              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }
            } else {
              // Content is cached for offline use.

              // Execute callback
              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }

              if (config && config.onOfflineReady) {
                config.onOfflineReady();
              }
            }
          }
        };
      };

      // Check for updates every hour - store interval ID for cleanup
      const updateCheckInterval = setInterval(
        () => {
          registration.update();
        },
        60 * 60 * 1000
      );

      // Store interval ID for cleanup in unregister
      window.__swUpdateInterval = updateCheckInterval;
    })
    .catch((error) => {
      console.error('[Service Worker] Registration failed:', error);
    });
}

/**
 * Check if service worker can be found. If it can't reload the page.
 */
function checkValidServiceWorker(swUrl: string, config?: Config): void {
  // Check if the service worker can be found.
  fetch(swUrl, {
    headers: { 'Service-Worker': 'script' },
  })
    .then((response) => {
      // Ensure service worker exists, and that we really are getting a JS file.
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        // No service worker found. Probably a different app. Reload the page.
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // Service worker found. Proceed as normal.
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      // No internet connection found. App is running in offline mode.
    });
}

/**
 * Unregister the service worker
 */
export function unregister(): void {
  // Clear update check interval if it exists
  if (window.__swUpdateInterval) {
    clearInterval(window.__swUpdateInterval);
    delete window.__swUpdateInterval;
  }

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(
          '[Service Worker] Error during service worker unregistration:',
          error
        );
      });
  }
}

/**
 * Send a message to the service worker to skip waiting
 */
export function skipWaiting(): void {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
  }
}

/**
 * Preload URLs into cache via service worker
 */
export function cacheUrls(urls: string[], cacheName?: string): void {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'CACHE_URLS',
      urls,
      cacheName,
    });
  }
}
