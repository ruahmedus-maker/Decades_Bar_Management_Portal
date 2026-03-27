/// Aggressive Self-Destruct Service Worker
// THIS WORKER MUST DIE IMMEDIATELY TO PREVENT NETWORK INTERCEPTIONS

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    self.clients.claim().then(() => {
      // Unregister immediately
      return self.registration.unregister();
    }).then(() => {
      // Force all clients to reload and clear the interceptor
      return self.clients.matchAll();
    }).then(clients => {
      clients.forEach(client => {
        if (client.url && 'navigate' in client) {
          client.navigate(client.url);
        }
      });
    })
  );
});

// REMOVE ALL FETCH LISTENERS - Do not intercept anything!
self.addEventListener('fetch', (event) => {
  // Pass-through to network immediately, no caching, no logic
  return;
});