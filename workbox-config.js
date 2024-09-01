module.exports = {
  globDirectory: "build/",
  globPatterns: [
    "**/*.{html,js,css}", // Inclure les fichiers HTML, JS, CSS pour precaching
    "static/media/*.{jpg,png,svg,mp4,mp3,pdf}", // Inclure les fichiers multimédias dans le precache
  ],
  swDest: "public/service-worker.js",
  runtimeCaching: [
    {
      urlPattern: ({ request }) => request.mode === "navigate",
      handler: "NetworkFirst",
      options: {
        cacheName: "pages",
        networkTimeoutSeconds: 10, // Utiliser le réseau, mais revenir au cache après 10 secondes si le réseau n'est pas disponible
      },
    },
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|mp4|mp3|pdf)$/,
      handler: "CacheFirst",
      options: {
        cacheName: "resource-files",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 jours
        },
      },
    },
    {
      urlPattern: /\.(?:html|js|css)$/,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "static-resources",
      },
    },
    {
      urlPattern: /\/api\//,
      handler: "NetworkOnly", // Ne pas mettre en cache les requêtes API
    },
  ],
  skipWaiting: true,
  clientsClaim: true,
};
