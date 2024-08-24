const CACHE_NAME = "dynamic-cache-v1";

const URLS_TO_CACHE = [
  "/",
  "/index.html",
  "static/js/bundle.js",
  // Add more URLs as needed
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(URLS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});
// self.addEventListener("install", (event) => {
//   // Skip the waiting phase
//   self.skipWaiting();
// });

self.addEventListener("activate", (event) => {
  // Remove old caches if necessary
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);

  // Si la requête est pour une image, un PDF ou un fichier texte, utilise le cache `resource-files`
  if (
    requestUrl.pathname.endsWith(".jpg") ||
    requestUrl.pathname.endsWith(".png") ||
    requestUrl.pathname.endsWith(".pdf") ||
    requestUrl.pathname.endsWith(".txt")
  ) {
    event.respondWith(
      caches
        .match(event.request, { cacheName: RESOURCE_CACHE_NAME })
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(event.request).then((networkResponse) => {
            return caches.open(RESOURCE_CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
          });
        })
    );
  } else {
    // Pour les autres requêtes, utilise le cache dynamique
    event.respondWith(
      caches
        .match(event.request, { cacheName: DYNAMIC_CACHE_NAME })
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(event.request).then((networkResponse) => {
            return caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
          });
        })
    );
  }
});

// self.addEventListener("fetch", (event) => {
//   event.respondWith(
//     caches
//       .match(event.request)
//       .then((cachedResponse) => {
//         console.log(cachedResponse);

//         // If the request is found in the cache, return it
//         if (cachedResponse) {
//           return cachedResponse;
//         }

//         // Otherwise, fetch the request from the network
//         return fetch(event.request).then((networkResponse) => {
//           console.log(networkResponse);
//           // Return the network response directly without caching it
//           return networkResponse;
//         });
//       })
//       .catch(() => {
//         // Handle errors or offline scenarios
//         return caches.match("/offline.html"); // Example of a fallback page
//       })
//   );
// });
