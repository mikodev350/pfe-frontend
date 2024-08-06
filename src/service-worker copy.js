/* eslint-disable no-restricted-globals */

import { clientsClaim } from "workbox-core";
import { ExpirationPlugin } from "workbox-expiration";
import { precacheAndRoute, createHandlerBoundToURL } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { StaleWhileRevalidate, CacheFirst } from "workbox-strategies";

clientsClaim();

// Precache all resources mentioned in the manifest
precacheAndRoute(self.__WB_MANIFEST);

// Routing for navigation requests
const fileExtensionRegexp = new RegExp("/[^/?]+\\.[^/]+$");
registerRoute(({ request, url }) => {
  if (request.mode !== "navigate") {
    return false;
  }
  if (url.pathname.startsWith("/_")) {
    return false;
  }
  if (url.pathname.match(fileExtensionRegexp)) {
    return false;
  }
  return true;
}, createHandlerBoundToURL(process.env.PUBLIC_URL + "/index.html"));

// Stale-While-Revalidate strategy for API requests
registerRoute(
  ({ url }) =>
    url.origin === self.location.origin && url.pathname.startsWith("/api/"),
  new StaleWhileRevalidate({
    cacheName: "api-requests",
    plugins: [new ExpirationPlugin({ maxEntries: 100 })],
  })
);

// Cache-First strategy for static resources (images, styles, scripts, videos, and audio)
registerRoute(
  ({ request }) =>
    request.destination === "image" ||
    request.destination === "style" ||
    request.destination === "script" ||
    request.destination === "video" ||
    request.destination === "audio",
  new CacheFirst({
    cacheName: "static-resources",
    plugins: [new ExpirationPlugin({ maxEntries: 50 })],
  })
);

// Listen for SKIP_WAITING message to activate new service worker immediately
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
// /* eslint-disable no-restricted-globals */

// import { clientsClaim } from "workbox-core";
// import { ExpirationPlugin } from "workbox-expiration";
// import { precacheAndRoute, createHandlerBoundToURL } from "workbox-precaching";
// import { registerRoute } from "workbox-routing";
// import { StaleWhileRevalidate, CacheFirst } from "workbox-strategies";

// clientsClaim();

// // Précache toutes les ressources mentionnées dans le manifeste de précache
// precacheAndRoute(self.__WB_MANIFEST);

// // Route pour les requêtes de navigation
// const fileExtensionRegexp = new RegExp("/[^/?]+\\.[^/]+$");
// registerRoute(({ request, url }) => {
//   if (request.mode !== "navigate") {
//     return false;
//   }
//   if (url.pathname.startsWith("/_")) {
//     return false;
//   }
//   if (url.pathname.match(fileExtensionRegexp)) {
//     return false;
//   }
//   return true;
// }, createHandlerBoundToURL(process.env.PUBLIC_URL + "/index.html"));

// // Utilisation de la stratégie Stale-While-Revalidate pour les requêtes dynamiques
// registerRoute(
//   ({ url }) =>
//     url.origin === self.location.origin && url.pathname.startsWith("/api/"),
//   new StaleWhileRevalidate({
//     cacheName: "api-requests",
//     plugins: [new ExpirationPlugin({ maxEntries: 100 })],
//   })
// );

// // Utilisation de la stratégie Cache-First pour les ressources statiques
// registerRoute(
//   ({ request }) =>
//     request.destination === "image" ||
//     request.destination === "style" ||
//     request.destination === "script",
//   new CacheFirst({
//     cacheName: "static-resources",
//     plugins: [new ExpirationPlugin({ maxEntries: 50 })],
//   })
// );

// // Écoute des messages pour SKIP_WAITING
// self.addEventListener("message", (event) => {
//   if (event.data && event.data.type === "SKIP_WAITING") {
//     self.skipWaiting();
//   }
// });

// // /* eslint-disable no-restricted-globals */

// // import { clientsClaim } from "workbox-core";
// // import { ExpirationPlugin } from "workbox-expiration";
// // import { precacheAndRoute, createHandlerBoundToURL } from "workbox-precaching";
// // import { registerRoute } from "workbox-routing";
// // import { StaleWhileRevalidate } from "workbox-strategies";

// // clientsClaim();
// // console.log("test");
// // precacheAndRoute(self.__WB_MANIFEST);

// // const fileExtensionRegexp = new RegExp("/[^/?]+\\.[^/]+$");
// // registerRoute(({ request, url }) => {
// //   if (request.mode !== "navigate") {
// //     return false;
// //   }
// //   if (url.pathname.startsWith("/_")) {
// //     return false;
// //   }
// //   if (url.pathname.match(fileExtensionRegexp)) {
// //     return false;
// //   }
// //   return true;
// // }, createHandlerBoundToURL(process.env.PUBLIC_URL + "/index.html"));

// // registerRoute(
// //   ({ url }) => url.origin === self.location.origin,
// //   new StaleWhileRevalidate({
// //     cacheName: "all-requests",
// //     plugins: [new ExpirationPlugin({ maxEntries: 100 })],
// //   })
// // );

// // self.addEventListener("message", (event) => {
// //   if (event.data && event.data.type === "SKIP_WAITING") {
// //     self.skipWaiting();
// //   }
// // });