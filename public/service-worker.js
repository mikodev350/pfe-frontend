const DYNAMIC_CACHE_NAME = "dynamic-cache-v1";
const RESOURCE_CACHE_NAME = "resource-files";
const OFFLINE_REQUESTS_CACHE = "offline-requests";

// Installation du service worker et mise en cache initiale
self.addEventListener("install", (event) => {
  console.log("[Service Worker] Installation en cours...");
  event.waitUntil(
    caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Mise en cache des ressources initiales");
      return cache.addAll([
        "/", // Exemple de fichiers dynamiques à cacher
        "static/media/Innovation-pana.8527f565ac6225580235.png",
        "/static/media/teacher.9960d468f9ad3344dffe.png",
        "/static/media/Webinar-amico.ff7a750bf0fe6d44ef29.png",
        "/static/media/Learning-pana.c74dd50e55d794962f08.png",
        "/static/media/Webinar-pana.004019215e87ee062376.png",
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
        "dashboard/home",
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
        "/dashboard/suivi-pedagogique",
        "/settings/change-password",
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
          if (
            cache !== DYNAMIC_CACHE_NAME &&
            cache !== RESOURCE_CACHE_NAME &&
            cache !== OFFLINE_REQUESTS_CACHE
          ) {
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

  if (event.request.method !== "GET") {
    const clonedRequest = event.request.clone();

    event.respondWith(
      fetch(event.request).catch(async () => {
        // Mise en cache de la requête en cas d'échec réseau
        await cacheRequestForLater(clonedRequest);

        // Enregistrer une tâche de synchronisation pour tenter la requête plus tard
        self.registration.sync.register("sync-requests");

        // Retourner une réponse pour indiquer que la requête a été mise en file d'attente
        return new Response(
          "Requête mise en file d'attente pour synchronisation.",
          { status: 202 }
        );
      })
    );
  }
  // Gérer les requêtes de fichiers multimédias
  else if (
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
    icon: "./img/logo without name .png", // chemin vers votre icône
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

/****************************************************************************/
// mise en cache des requete  dans le cachee
// Fonction pour mettre en cache les requêtes non GET en cas d'échec
async function cacheRequestForLater(request) {
  try {
    // Cloner la requête pour accéder à son contenu
    const clonedRequest = request.clone();

    // Lire le corps de la requête sous forme de texte
    const body = await clonedRequest.text();

    // Construire les données à stocker
    const requestData = {
      url: clonedRequest.url,
      method: clonedRequest.method,
      headers: [...clonedRequest.headers.entries()],
      body: body, // Stocker le corps sous forme de chaîne de caractères
    };

    // Utiliser une clé unique basée sur l'URL et un timestamp
    const cacheKey = clonedRequest.url + "?" + Date.now();

    // Stocker les données dans le cache sous forme de JSON stringifié
    const cache = await caches.open(OFFLINE_REQUESTS_CACHE);
    await cache.put(cacheKey, new Response(JSON.stringify(requestData)));

    console.log(
      "[Service Worker] Requête POST mise en cache pour synchronisation ultérieure :",
      clonedRequest.url
    );

    return new Response(
      "Requête mise en file d'attente pour synchronisation.",
      { status: 202 }
    );
  } catch (error) {
    console.error("Erreur lors de la mise en cache de la requête :", error);
    return new Response("Erreur lors de la mise en cache de la requête.", {
      status: 500,
    });
  }
}

async function syncOfflineRequests() {
  try {
    console.log("Ouverture du cache des requêtes en attente...");
    const cache = await caches.open(OFFLINE_REQUESTS_CACHE);

    console.log("Récupération des clés de requêtes stockées...");
    const requests = await cache.keys();
    console.log(`Nombre de requêtes trouvées: ${requests.length}`);

    // Itérer sur chaque requête stockée
    for (const request of requests) {
      // Extraire les données de la requête stockée

      console.log("====================================");
      console.log("<<<<<<<<<<<<<------------request------>>>>>>>>>>>>>>>>>");
      console.log(request);
      console.log("====================================");
      const response = await cache.match(request);
      const data = await response.json();
      console.log("====================================");
      console.log("<<<<<<<<<<<<<------------data------>>>>>>>>>>>>>>>>>");
      console.log(data);
      console.log("====================================");
      // Reconstituer les options de la requête
      const fetchOptions = {
        method: data.method,
        headers: new Headers(data.headers),
        body: data.body, // Repasser le corps stocké
      };

      try {
        console.log("====================================");
        console.log("tryy the networkk parttt ");
        console.log("====================================");
        console.log("data.url");

        console.log(data.url);
        console.log("====================================");
        console.log("====================================");
        console.log("====================================");
        console.log(fetchOptions);
        console.log("====================================");
        // Exécuter la requête avec fetch
        const networkResponse = await fetch(data.url, fetchOptions);

        console.log("====================================");

        console.log(networkResponse);
        console.log("====================================");
        // Si la requête réussit, supprimer du cache
        if (networkResponse.ok) {
          console.log(
            "[Service Worker] Requête synchronisée avec succès :",
            data.url
          );
          await cache.delete(request); // Supprimer la requête du cache après succès
        } else {
          console.error(
            "[Service Worker] Échec de la synchronisation de la requête :",
            data.url,
            networkResponse.status
          );
        }
      } catch (error) {
        console.error(
          "[Service Worker] Erreur lors de la synchronisation de la requête :",
          error
        );
        // La requête restera dans le cache pour une tentative de synchronisation ultérieure
      }
    }
  } catch (error) {
    console.error(
      "[Service Worker] Erreur lors de la synchronisation des requêtes :",
      error
    );
  }
}

self.addEventListener("sync", (event) => {
  console.log("====================================");
  console.log("sync  --------------------->>>>> self.addEventListener");
  console.log("====================================");
  if (event.tag === "sync-requests") {
    event.waitUntil(syncOfflineRequests());
  }
});
// async function syncOfflineRequests() {
//   const cache = await caches.open(OFFLINE_REQUESTS_CACHE);
//   const requests = await cache.keys();

//   for (const request of requests) {
//     const response = await cache.match(request);
//     const data = await response.json();

//     const fetchOptions = {
//       method: data.method,
//       headers: new Headers(data.headers),
//       body: data.body,
//     };

//     await fetch(request.url, fetchOptions).then((networkResponse) => {
//       if (networkResponse.ok) {
//         cache.delete(request); // Supprimer la requête du cache après succès
//       }
//     });
//   }
// }

// function cacheRequestForLater(request) {
//   return caches.open(OFFLINE_REQUESTS_CACHE).then((cache) => {
//     return request
//       .clone()
//       .text()
//       .then((body) => {
//         const url = request.url;
//         const headers = [...request.headers];

//         // Stocker les informations de la requête (méthode, URL, headers, body)
//         cache.put(
//           url,
//           new Response(
//             JSON.stringify({ method: request.method, headers, body })
//           )
//         );
//         return new Response(
//           "Requête mise en file d'attente pour synchronisation.",
//           { status: 202 }
//         );
//       });
//   });
// }
