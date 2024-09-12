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
        "/SignUpStyle.css",
        "/css/customHome.css",
        "/index.html",
        "/login",
        "/login.css",
        "/manifest.json",
        "/service-worker.js",
        "/signup",
        "/static/css/main.0204a804.css",
        "/static/js/bundle.js",
        "/static/js/main.f33b2338.js",
        "/dashboard/assignments",
        "/dashboard/home",
        "/chat",
        "/dashboard/communaute/amis",
        "/dashboard/communaute/coaching",
        "/dashboard/communaute/enseignants",
        "/dashboard/communaute/invitations",
        "/dashboard/devoirs",
        "/dashboard/my-profile",
        "/dashboard/new-parcour",
        "/dashboard/new-resource",
        "/dashboard/notes",
        "/dashboard/parcours",
        "/dashboard/quizzes",
        "/dashboard/resources",
        "/dashboard/notifications",
        "/dashboard/suivi-pedagogique",
        "/settings/change-password",
        "/dashboard/resource-preview/",
        "/ajax/libs/ace/1.4.2/ace.js",
        "/ajax/libs/ace/1.4.2/mode-html.js",
        "/ajax/libs/ace/1.4.2/theme-idle_fingers.js",
        "/ajax/libs/js-beautify/1.14.4/beautify-html.min.js",
        "/ajax/libs/js-beautify/1.14.4/beautify.min.js",
        "/s/cairo/v28/SLXgc1nY6HkvangtZmpQdkhzfH5lkSs2SgRjCAGMQ1z0hOA-a1PiLA.woff2",
        "/s/roboto/v32/KFOmCnqEu92Fr1Mu4mxK.woff2",
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

self.addEventListener("push", (event) => {
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: "./icon-144x144.png", // chemin vers votre icône
    data: {
      url: `http://localhost:3000${data.url}`, // Lien de redirection à partir du push
    },
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

/***************************************************************************************************/
