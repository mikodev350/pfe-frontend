// serviceWorkerRegistration.js

const isLocalhost = Boolean(
  window.location.hostname === "localhost" ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === "[::1]" ||
    // 127.0.0.0/8 sont considérées comme localhost pour IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}$/
    )
);

export function register(config) {
  if ("serviceWorker" in navigator) {
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
    if (publicUrl.origin !== window.location.origin) {
      return;
    }

    window.addEventListener("load", () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      if (isLocalhost) {
        // Ceci fonctionne en localhost
        checkValidServiceWorker(swUrl, config);

        // Ajoute un logging supplémentaire pour localhost
        navigator.serviceWorker.ready.then(() => {
          console.log(
            "This web app is being served cache-first by a service worker. To learn more, visit https://cra.link/PWA"
          );
        });
      } else {
        // Enregistre le service worker normalement
        registerValidSW(swUrl, config);
      }
    });
  }
}

function registerValidSW(swUrl, config) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        installingWorker.onstatechange = () => {
          if (installingWorker.state === "installed") {
            if (navigator.serviceWorker.controller) {
              // Nouveau contenu disponible
              console.log(
                "New content is available and will be used when all tabs for this page are closed. See https://cra.link/PWA."
              );

              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }
            } else {
              // Contenu précaché pour une utilisation hors ligne
              console.log("Content is cached for offline use.");

              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        };
      };
    })
    .catch((error) => {
      console.error("Error during service worker registration:", error);
    });
}

function checkValidServiceWorker(swUrl, config) {
  // Vérifie si le service worker peut être trouvé. Si ce n'est pas le cas, recharge la page.
  fetch(swUrl, {
    headers: { "Service-Worker": "script" },
  })
    .then((response) => {
      // Assure que le service worker existe et que nous obtenons vraiment un fichier JS.
      const contentType = response.headers.get("content-type");
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf("javascript") === -1)
      ) {
        // Aucun service worker trouvé. Probablement une application différente. Recharge la page.
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log(
        "No internet connection found. App is running in offline mode."
      );
    });
}

export function unregister() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}

// module.exports = {
//   globDirectory: "build/",
//   globPatterns: ["**/*.{js,css,html,png,jpg,jpeg,gif,svg,eot,ttf,woff,woff2}"],
//   swDest: "build/service-worker.js",
//   clientsClaim: true,
//   skipWaiting: true,
//   runtimeCaching: [
//     {
//       urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
//       handler: "CacheFirst",
//       options: {
//         cacheName: "images",
//         expiration: {
//           maxEntries: 10,
//           maxAgeSeconds: 30 * 24 * 60 * 60, // 30 jours
//         },
//       },
//     },
//     {
//       urlPattern: /^https:\/\/fonts\.googleapis\.com/,
//       handler: "StaleWhileRevalidate",
//       options: {
//         cacheName: "google-fonts-stylesheets",
//       },
//     },
//     {
//       urlPattern: /^https:\/\/api\.example\.com/,
//       handler: "NetworkFirst",
//       options: {
//         cacheName: "api-cache",
//         expiration: {
//           maxEntries: 10,
//           maxAgeSeconds: 5 * 60, // 5 minutes
//         },
//       },
//     },
//   ],
// };
