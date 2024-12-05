/* When downloading the service worker, it doesn't activate itself until the user reloads the page.
 * This is a workaround to activate the service worker immediately.
 */
self.addEventListener('install', (event) => event.waitUntil(self.skipWaiting()));
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

// We want to intercept requests for the WebAssembly files and cache them.
self.addEventListener('fetch', async (event) => {
  const url = new URL(event.request.url);
  const wasmUrls = [
    'stockfish-16.1.wasm',
    'stockfish-16.1-single.wasm',
    'stockfish-16.1-lite.wasm',
    'stockfish-16.1-lite-single.wasm',
  ];

  if (new RegExp(wasmUrls.join('|')).test(url.pathname)) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return (
          response ||
          fetch(event.request).then((networkResponse) => {
            return caches.open('engine-cache').then((cache) => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
          })
        );
      }),
    );
  }
});
