const DYNAMIC_CACHE_NAME = "dynamic-cache-v1";
const RESOURCE_CACHE_NAME = "resource-files";

// Installation du service worker et mise en cache initiale
self.addEventListener("install", (event) => {
  console.log("[Service Worker] Installation en cours...");
  event.waitUntil(
    caches
      .open(DYNAMIC_CACHE_NAME)
      .then((cache) => {
        console.log("[Service Worker] Mise en cache des ressources initiales");
        return cache.addAll([
          "/", // Exemple de fichiers dynamiques à cacher
          "/index.html",
          "/static/js/bundle.js",
        ]);
      })
      .then(() => self.skipWaiting())
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

  // Gérer uniquement les fichiers multimédias
  if (
    requestUrl.pathname.endsWith(".jpg") ||
    requestUrl.pathname.endsWith(".png") ||
    requestUrl.pathname.endsWith(".pdf") ||
    requestUrl.pathname.endsWith(".mp4") || // Pour les vidéos
    requestUrl.pathname.endsWith(".mp3") || // Pour les fichiers audio
    requestUrl.pathname.endsWith(".txt")
  ) {
    event.respondWith(handleMediaRequest(event));
  } else {
    // Pour toutes les autres requêtes (HTML, JS, CSS, etc.)
    event.respondWith(handleGenericRequest(event));
  }
});

// Fonction pour gérer les requêtes de fichiers multimédias
function handleMediaRequest(event) {
  return caches.open(RESOURCE_CACHE_NAME).then((cache) => {
    return cache.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request)
        .then((networkResponse) => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        })
        .catch(() => {
          // Retourner une réponse par défaut si le réseau est indisponible
          return caches.match(event.request).then((fallbackResponse) => {
            return (
              fallbackResponse ||
              new Response("Offline and no cached data available", {
                status: 503,
              })
            );
          });
        });
    });
  });
}

// Fonction pour gérer les autres requêtes (HTML, JS, CSS, etc.)
function handleGenericRequest(event) {
  return fetch(event.request).catch(() => {
    // Si la requête échoue (par exemple, en mode hors ligne), renvoyer une réponse par défaut ou du cache
    return caches.match(event.request).then((cachedResponse) => {
      return (
        cachedResponse ||
        new Response("Offline and no network connection available", {
          status: 503,
        })
      );
    });
  });
}
// // Interception des requêtes
// self.addEventListener("fetch", (event) => {
//   const requestUrl = new URL(event.request.url);
//   console.log(
//     `[Service Worker] Interception de la requête: ${requestUrl.href}`
//   );

//   // Gérer uniquement les fichiers multimédias
//   if (
//     requestUrl.pathname.endsWith(".jpg") ||
//     requestUrl.pathname.endsWith(".png") ||
//     requestUrl.pathname.endsWith(".pdf") ||
//     requestUrl.pathname.endsWith(".mp4") || // Pour les vidéos
//     requestUrl.pathname.endsWith(".mp3") || // Pour les fichiers audio
//     requestUrl.pathname.endsWith(".txt")
//   ) {
//     event.respondWith(
//       caches.open(RESOURCE_CACHE_NAME).then((cache) => {
//         return cache.match(event.request).then((cachedResponse) => {
//           if (cachedResponse) {
//             return cachedResponse;
//           }
//           return fetch(event.request)
//             .then((networkResponse) => {
//               cache.put(event.request, networkResponse.clone());
//               return networkResponse;
//             })
//             .catch(() => {
//               // Retourner une réponse par défaut si le réseau est indisponible
//               return caches.match(event.request).then((fallbackResponse) => {
//                 return (
//                   fallbackResponse ||
//                   new Response("Offline and no cached data available", {
//                     status: 503,
//                   })
//                 );
//               });
//             });
//         });
//       })
//     );
//   } else {
//     // Pour toutes les autres requêtes
//     event.respondWith(
//       fetch(event.request).catch(() => {
//         // Si la requête échoue (par exemple, en mode hors ligne), renvoyer une réponse par défaut ou du cache
//         return new Response("Offline and no network connection available", {
//           status: 503,
//         });
//       })
//     );
//   }
// });

// // Gestion des requêtes
// self.addEventListener("fetch", (event) => {
//   const requestUrl = new URL(event.request.url);
//   console.log(
//     `[Service Worker] Interception de la requête: ${requestUrl.href}`
//   );

//   // Gestion des ressources spécifiques (images, PDFs, etc.)
//   if (
//     requestUrl.pathname.endsWith(".jpg") ||
//     requestUrl.pathname.endsWith(".png") ||
//     requestUrl.pathname.endsWith(".pdf") ||
//     requestUrl.pathname.endsWith(".txt")
//   ) {
//     event.respondWith(
//       caches
//         .match(event.request, { cacheName: RESOURCE_CACHE_NAME })
//         .then((cachedResponse) => {
//           if (cachedResponse) {
//             return cachedResponse;
//           }
//           return fetch(event.request).then((networkResponse) => {
//             return caches.open(RESOURCE_CACHE_NAME).then((cache) => {
//               cache.put(event.request, networkResponse.clone());
//               return networkResponse;
//             });
//           });
//         })
//         .catch(
//           () =>
//             new Response(
//               "Network unavailable and no cached content available.",
//               { status: 503 }
//             )
//         )
//     );
//   } else {
//     // Gestion des autres requêtes avec le cache dynamique
//     event.respondWith(
//       caches
//         .match(event.request, { cacheName: DYNAMIC_CACHE_NAME })
//         .then((cachedResponse) => {
//           if (cachedResponse) {
//             return cachedResponse;
//           }
//           return fetch(event.request).then((networkResponse) => {
//             return caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
//               cache.put(event.request, networkResponse.clone());
//               return networkResponse;
//             });
//           });
//         })
//         .catch(
//           () =>
//             new Response(
//               "Network unavailable and no cached content available.",
//               { status: 503 }
//             )
//         )
//     );
//   }
// });

// const CACHE_NAME = "dynamic-cache-v1";

// const URLS_TO_CACHE = [
//   "/",
//   "/index.html",
//   "/static/js/bundle.js",
//   // Ajoutez d'autres URLs au besoin
// ];

// self.addEventListener("install", (event) => {
//   console.log("[Service Worker] Installation en cours...");
//   event.waitUntil(
//     caches
//       .open(CACHE_NAME)
//       .then((cache) => {
//         console.log("[Service Worker] Mise en cache des ressources initiales");
//         return cache.addAll(URLS_TO_CACHE);
//       })
//       .then(() => self.skipWaiting())
//   );
// });

// self.addEventListener("activate", (event) => {
//   console.log("[Service Worker] Activation en cours...");
//   event.waitUntil(
//     caches.keys().then((cacheNames) => {
//       return Promise.all(
//         cacheNames.map((cache) => {
//           if (cache !== CACHE_NAME) {
//             console.log(
//               `[Service Worker] Suppression de l'ancien cache: ${cache}`
//             );
//             return caches.delete(cache);
//           }
//         })
//       );
//     })
//   );
//   console.log("[Service Worker] Clients claim activé");
//   self.clients.claim();
// });

// self.addEventListener("fetch", (event) => {
//   const requestUrl = new URL(event.request.url);
//   console.log(
//     `[Service Worker] Interception de la requête: ${requestUrl.href}`
//   );

//   if (
//     requestUrl.pathname.endsWith(".jpg") ||
//     requestUrl.pathname.endsWith(".png") ||
//     requestUrl.pathname.endsWith(".pdf") ||
//     requestUrl.pathname.endsWith(".txt")
//   ) {
//     console.log(
//       "[Service Worker] Requête pour une image, PDF ou texte détectée"
//     );
//     event.respondWith(
//       caches
//         .match(event.request, { cacheName: "resource-files" })
//         .then((cachedResponse) => {
//           if (cachedResponse) {
//             console.log(
//               "[Service Worker] Réponse trouvée dans le cache 'resource-files'"
//             );
//             return cachedResponse;
//           }
//           console.log(
//             "[Service Worker] Réponse non trouvée dans le cache, récupération réseau en cours"
//           );
//           return fetch(event.request).then((networkResponse) => {
//             return caches.open("resource-files").then((cache) => {
//               console.log(
//                 `[Service Worker] Mise en cache de la nouvelle ressource: ${event.request.url}`
//               );
//               cache.put(event.request, networkResponse.clone());
//               return networkResponse;
//             });
//           });
//         })
//         .catch(() => {
//           console.log(
//             "[Service Worker] Pas de réseau disponible et pas de cache disponible"
//           );
//           return new Response(
//             "Network unavailable and no cached content available.",
//             {
//               status: 503,
//               statusText: "Service Unavailable",
//             }
//           );
//         })
//     );
//   } else {
//     console.log(
//       "[Service Worker] Requête pour autre chose, utilisation du cache dynamique"
//     );
//     event.respondWith(
//       caches
//         .match(event.request, { cacheName: CACHE_NAME })
//         .then((cachedResponse) => {
//           if (cachedResponse) {
//             console.log(
//               `[Service Worker] Réponse trouvée dans le cache dynamique pour: ${event.request.url}`
//             );
//             return cachedResponse;
//           }
//           console.log(
//             `[Service Worker] Réponse non trouvée dans le cache dynamique, récupération réseau en cours pour: ${event.request.url}`
//           );
//           return fetch(event.request).then((networkResponse) => {
//             return caches.open(CACHE_NAME).then((cache) => {
//               console.log(
//                 `[Service Worker] Mise en cache de la nouvelle ressource dans le cache dynamique: ${event.request.url}`
//               );
//               cache.put(event.request, networkResponse.clone());
//               return networkResponse;
//             });
//           });
//         })
//         .catch(() => {
//           console.log(
//             "[Service Worker] Pas de réseau disponible et pas de cache disponible"
//           );
//           return new Response(
//             "Network unavailable and no cached content available.",
//             {
//               status: 503,
//               statusText: "Service Unavailable",
//             }
//           );
//         })
//     );
//   }
// });
