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

module.exports = {
  globDirectory: "build/",
  globPatterns: ["**/*.{js,css,html,png,jpg,jpeg,gif,svg,eot,ttf,woff,woff2}"],
  swDest: "build/service-worker.js",
  clientsClaim: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
      handler: "CacheFirst",
      options: {
        cacheName: "images",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 jours
        },
      },
    },
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com/,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "google-fonts-stylesheets",
      },
    },
    {
      urlPattern: /^https:\/\/api\.example\.com/,
      handler: "NetworkFirst",
      options: {
        cacheName: "api-cache",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 5 * 60, // 5 minutes
        },
      },
    },
  ],
};
