// /* eslint-disable no-restricted-globals */

// Install event - cache files during installation if not already cached
self.addEventListener("install", (event) => {
  console.log("Service Worker installing.");
  event.waitUntil(
    caches.open("v1").then((cache) => {
      return Promise.all(
        [
          "/", // Cache the root page
          "/index.html", // Cache the index page
          "/styles.css", // Cache styles
          "/main.js", // Cache your main JavaScript bundle
          "/logo192.png", // Cache an image
        ].map((url) => {
          return cache.match(url).then((response) => {
            if (!response) {
              console.log(`Caching new resource: ${url}`);
              return cache.add(url);
            } else {
              console.log(`Resource already cached: ${url}`);
              return Promise.resolve();
            }
          });
        })
      );
    })
  );
  self.skipWaiting(); // Force the waiting service worker to become active
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker activating.");
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== "v1") {
            console.log("Deleting old cache:", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim(); // Take control of all open clients
});

// Fetch event - serve cached content when offline
self.addEventListener("fetch", (event) => {
  console.log("Fetching:", event.request.url);
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).catch(() => {
          // Return a fallback page or resource if the network request fails
          return caches.match("/index.html"); // You can return a specific offline page here
        })
      );
    })
  );
});

// import { clientsClaim } from "workbox-core";
// import { ExpirationPlugin } from "workbox-expiration";
// import { precacheAndRoute, createHandlerBoundToURL } from "workbox-precaching";
// import { registerRoute } from "workbox-routing";
// import { StaleWhileRevalidate, CacheFirst } from "workbox-strategies";

// clientsClaim();

// // Precache all resources mentioned in the manifest
// precacheAndRoute(self.__WB_MANIFEST);

// // Routing for navigation requests
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

// // Stale-While-Revalidate strategy for API requests
// registerRoute(
//   ({ url }) =>
//     url.origin === self.location.origin && url.pathname.startsWith("/api/"),
//   new StaleWhileRevalidate({
//     cacheName: "api-requests",
//     plugins: [new ExpirationPlugin({ maxEntries: 100 })],
//   })
// );

// // Cache-First strategy for static resources (images, styles, scripts, videos, and audio)
// registerRoute(
//   ({ request }) => {
//     console.log("----------------------------");
//     console.log("request cache ");
//     console.log(request);
//     console.log("----------------------------");
//     request.destination === "image" ||
//       request.destination === "style" ||
//       request.destination === "script" ||
//       request.destination === "video" ||
//       request.destination === "audio";
//     return request;
//   },
//   new CacheFirst({
//     cacheName: "resource-files",
//     // plugins: [new ExpirationPlugin({ maxEntries: 50 })],
//     plugins: [
//       new ExpirationPlugin({
//         maxEntries: 100, // Limite du nombre de fichiers dans le cache
//         maxAgeSeconds: 30 * 24 * 60 * 60, // 30 jours
//       }),
//     ],
//   })
// );

// // Listen for SKIP_WAITING message to activate new service worker immediately
// self.addEventListener("message", (event) => {
//   if (event.data && event.data.type === "SKIP_WAITING") {
//     self.skipWaiting();
//   }
// });
