// --------------------------------------
// SERVICE WORKER: LVS SAFE VERSION
// --------------------------------------

// Direct updaten bij nieuwe deploy
self.addEventListener("install", (event) => {
  console.log("[SW] Installed");
  self.skipWaiting(); // Activeer nieuwe versie direct

  // Optionele simpele cache
  const CACHE_NAME = "lvs-cache-v1";
  const urlsToCache = ["/", "/index.html"];

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("activate", (event) => {
  console.log("[SW] Activated");
  event.waitUntil(clients.claim()); // Neem alle tabs direct over

  // Oude caches opruimen
  const whitelist = ["lvs-cache-v1"];
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (!whitelist.includes(key)) {
            return caches.delete(key);
          }
        })
      )
    )
  );
});

// Offline fallback (extreem basic)
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request);
    })
  );
});
