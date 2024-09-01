const DYNAMIC_CACHE_NAME = "dynamic-cache-v1";
const RESOURCE_CACHE_NAME = "resource-files";

// Installation du service worker et mise en cache initiale
self.addEventListener("install", (event) => {
  console.log("[Service Worker] Installation en cours...");
  event.waitUntil(
    caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Mise en cache des ressources initiales");
      return cache.addAll([
        "/", // Exemple de fichiers dynamiques à cacher
        "/index.html",
        "/static/js/bundle.js",
      ]);
    })
  );
});

// Activation du service worker et nettoyage des anciens caches
self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Activation en cours...");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== DYNAMIC_CACHE_NAME && cache !== RESOURCE_CACHE_NAME) {
            console.log(
              `[Service Worker] Suppression de l'ancien cache: ${cache}`
            );
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Interception des requêtes
self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);
  console.log(
    `[Service Worker] Interception de la requête: ${requestUrl.href}`
  );

  // Gérer les requêtes de fichiers multimédias
  if (
    requestUrl.pathname.endsWith(".jpg") ||
    requestUrl.pathname.endsWith(".png") ||
    requestUrl.pathname.endsWith(".pdf") ||
    requestUrl.pathname.endsWith(".mp4") ||
    requestUrl.pathname.endsWith(".mp3") ||
    requestUrl.pathname.endsWith(".txt")
  ) {
    event.respondWith(
      caches.open(RESOURCE_CACHE_NAME).then((cache) => {
        return cache
          .match(event.request)
          .then((cachedResponse) => {
            return (
              cachedResponse ||
              fetch(event.request).then((networkResponse) => {
                cache.put(event.request, networkResponse.clone());
                return networkResponse;
              })
            );
          })
          .catch(() => {
            return new Response("Offline and no cached data available", {
              status: 503,
              statusText: "Service Unavailable",
            });
          });
      })
    );
  } else {
    // Gérer les autres requêtes (HTML, JS, CSS, etc.)
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          return caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() => {
          return caches.match(event.request).then((cachedResponse) => {
            return (
              cachedResponse ||
              new Response("Offline and no network connection available", {
                status: 503,
                statusText: "Service Unavailable",
              })
            );
          });
        })
    );
  }
});
