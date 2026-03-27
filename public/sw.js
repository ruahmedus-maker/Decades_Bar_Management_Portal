// Nullified Service Worker
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Force the waiting service worker to become the active service worker.
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim()); // Takes control of all pages immediately.
});

// No fetch listener = No interceptions = No hung app!