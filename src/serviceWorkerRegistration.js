const PUBLIC_VAPID_KEY =
  "BHzzIlXlO1atGV5DucjYMeWz5bNrnsiYyEWdsL17zLzSenrZelA0OQmm4xSYF9WARk9wJ9S0_SW2RV_4dJERwBM";

// Vérifie si l'application est en localhost
const isLocalhost = Boolean(
  window.location.hostname === "localhost" ||
    window.location.hostname === "[::1]" ||
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}$/
    )
);

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

async function sendPushNotification() {
  try {
    const registration = await navigator.serviceWorker.ready;

    // Check if there's already a subscription
    const existingSubscription =
      await registration.pushManager.getSubscription();

    if (existingSubscription) {
      console.log("User is already subscribed to push notifications.");
      return; // No need to resubscribe
    }

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      throw new Error("Permission not granted for Notification");
    }

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY),
    });

    // Send subscription to the server
    await fetch("http://localhost:1337/api/subscribe", {
      method: "POST",
      body: JSON.stringify(subscription),
      headers: {
        "content-type": "application/json",
      },
    });
    console.log("Push Subscription sent to the server...");
  } catch (error) {
    console.error("Failed to subscribe to push notifications:", error);
  }
}

export function register(config) {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      if (isLocalhost) {
        // En localhost, vérifie si le service worker existe
        checkValidServiceWorker(swUrl, config);
      } else {
        // Enregistre le service worker
        registerValidSW(swUrl, config);
      }
    });
  }
}

function registerValidSW(swUrl, config) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      console.log("Service Worker registered.");
      // Envoyer la notification push après l'enregistrement du service worker
      sendPushNotification();

      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        installingWorker.onstatechange = () => {
          if (installingWorker.state === "installed") {
            if (navigator.serviceWorker.controller) {
              // Nouveau contenu disponible; notifier l'utilisateur
              console.log(
                "Nouveau contenu disponible et sera utilisé après la fermeture de tous les onglets de cette page."
              );

              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }
            } else {
              // Contenu précaché pour une utilisation hors ligne
              console.log(
                "Contenu mis en cache pour une utilisation hors ligne."
              );

              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        };
      };
    })
    .catch((error) => {
      console.error(
        "Erreur lors de l'enregistrement du service worker:",
        error
      );
    });
}

function checkValidServiceWorker(swUrl, config) {
  // Vérifie si le service worker peut être trouvé. Sinon, recharge la page.
  fetch(swUrl, {
    headers: { "Service-Worker": "script" },
  })
    .then((response) => {
      const contentType = response.headers.get("content-type");
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf("javascript") === -1)
      ) {
        // Aucun service worker trouvé, probablement une application différente. Recharge la page.
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // Enregistre le service worker normalement
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log(
        "Pas de connexion internet trouvée. L'application est en mode hors ligne."
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

// const PUBLIC_VAPID_KEY =
//   "BHzzIlXlO1atGV5DucjYMeWz5bNrnsiYyEWdsL17zLzSenrZelA0OQmm4xSYF9WARk9wJ9S0_SW2RV_4dJERwBM";

// // Vérifie si l'application est en localhost
// const isLocalhost = Boolean(
//   window.location.hostname === "localhost" ||
//     window.location.hostname === "[::1]" ||
//     window.location.hostname.match(
//       /^127(?:\.(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}$/
//     )
// );

// function urlBase64ToUint8Array(base64String) {
//   const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
//   const base64 = (base64String + padding)
//     .replace(/\-/g, "+")
//     .replace(/_/g, "/");

//   const rawData = window.atob(base64);
//   const outputArray = new Uint8Array(rawData.length);

//   for (let i = 0; i < rawData.length; ++i) {
//     outputArray[i] = rawData.charCodeAt(i);
//   }
//   return outputArray;
// }

// async function sendPushNotification() {
//   try {
//     const registration = await navigator.serviceWorker.ready;

//     const permission = await Notification.requestPermission();
//     if (permission !== "granted") {
//       throw new Error("Permission not granted for Notification");
//     }

//     const subscription = await registration.pushManager.subscribe({
//       userVisibleOnly: true,
//       applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY),
//     });

//     await fetch("http://localhost:1337/api/subscribe", {
//       method: "POST",
//       body: JSON.stringify(subscription),
//       headers: {
//         "content-type": "application/json",
//       },
//     });
//     console.log("Push Subscription sent to the server...");
//   } catch (error) {
//     console.error("Failed to subscribe to push notifications:", error);
//   }
// }

// export function register(config) {
//   if ("serviceWorker" in navigator) {
//     window.addEventListener("load", () => {
//       const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

//       if (isLocalhost) {
//         // En localhost, vérifie si le service worker existe
//         checkValidServiceWorker(swUrl, config);
//       } else {
//         // Enregistre le service worker
//         registerValidSW(swUrl, config);
//       }
//     });
//   }
// }

// function registerValidSW(swUrl, config) {
//   navigator.serviceWorker
//     .register(swUrl)
//     .then((registration) => {
//       console.log("Service Worker registered.");
//       // Envoyer la notification push après l'enregistrement du service worker
//       sendPushNotification();

//       registration.onupdatefound = () => {
//         const installingWorker = registration.installing;
//         if (installingWorker == null) {
//           return;
//         }
//         installingWorker.onstatechange = () => {
//           if (installingWorker.state === "installed") {
//             if (navigator.serviceWorker.controller) {
//               // Nouveau contenu disponible; notifier l'utilisateur
//               console.log(
//                 "Nouveau contenu disponible et sera utilisé après la fermeture de tous les onglets de cette page."
//               );

//               if (config && config.onUpdate) {
//                 config.onUpdate(registration);
//               }
//             } else {
//               // Contenu précaché pour une utilisation hors ligne
//               console.log(
//                 "Contenu mis en cache pour une utilisation hors ligne."
//               );

//               if (config && config.onSuccess) {
//                 config.onSuccess(registration);
//               }
//             }
//           }
//         };
//       };
//     })
//     .catch((error) => {
//       console.error(
//         "Erreur lors de l'enregistrement du service worker:",
//         error
//       );
//     });
// }

// function checkValidServiceWorker(swUrl, config) {
//   // Vérifie si le service worker peut être trouvé. Sinon, recharge la page.
//   fetch(swUrl, {
//     headers: { "Service-Worker": "script" },
//   })
//     .then((response) => {
//       const contentType = response.headers.get("content-type");
//       if (
//         response.status === 404 ||
//         (contentType != null && contentType.indexOf("javascript") === -1)
//       ) {
//         // Aucun service worker trouvé, probablement une application différente. Recharge la page.
//         navigator.serviceWorker.ready.then((registration) => {
//           registration.unregister().then(() => {
//             window.location.reload();
//           });
//         });
//       } else {
//         // Enregistre le service worker normalement
//         registerValidSW(swUrl, config);
//       }
//     })
//     .catch(() => {
//       console.log(
//         "Pas de connexion internet trouvée. L'application est en mode hors ligne."
//       );
//     });
// }

// export function unregister() {
//   if ("serviceWorker" in navigator) {
//     navigator.serviceWorker.ready
//       .then((registration) => {
//         registration.unregister();
//       })
//       .catch((error) => {
//         console.error(error.message);
//       });
//   }
// }
