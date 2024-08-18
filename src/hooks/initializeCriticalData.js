// src/utils/initializeCriticalData.js
import { cacheFile } from "../api/apiResource";
import { fetchAllData } from "../api/fetchAll";
import db from "../database/database";

const initializeCriticalData = async (token) => {
  console.log("Initializing critical data with token:", token);

  try {
    // Récupérer toutes les données en une seule requête
    const { data } = await fetchAllData(1, 5, "", token); // Le deuxième paramètre (5) peut être ajusté si nécessaire

    if (!data) {
      console.error("Données manquantes");
      return;
    }

    // Gérer les parcours et leurs données associées
    if (data.parcours && Array.isArray(data.parcours)) {
      for (const parcour of data.parcours) {
        await db.parcours.put(parcour);

        if (parcour.modules && Array.isArray(parcour.modules)) {
          for (const module of parcour.modules) {
            module.parcour = parcour.id; // Associer l'ID du parcours au module
            await db.modules.put(module);

            if (module.lessons && Array.isArray(module.lessons)) {
              for (const lesson of module.lessons) {
                lesson.module = module.id; // Associer l'ID du module à la leçon
                await db.lessons.put(lesson);
              }
            }
          }
        }
      }
    }

    // Gérer les ressources et mettre en cache les fichiers
    if (data.resources && Array.isArray(data.resources)) {
      for (const resource of data.resources) {
        // Mise en cache des fichiers si nécessaire
        if (resource.images && Array.isArray(resource.images)) {
          resource.images = await Promise.all(
            resource.images.map(async (image) => {
              return (
                (await cacheFile(`http://localhost:1337${image.url}`)) ||
                `http://localhost:1337${image.url}`
              );
            })
          );
        }

        if (resource.audio && resource.audio.url) {
          resource.audio = await cacheFile(
            `http://localhost:1337${resource.audio.url}`
          );
        }

        if (resource.video && resource.video.url) {
          resource.video = await cacheFile(
            `http://localhost:1337${resource.video.url}`
          );
        }

        if (resource.pdf && resource.pdf.url) {
          resource.pdf = await cacheFile(
            `http://localhost:1337${resource.pdf.url}`
          );
        }

        await db.resources.put(resource);
      }
    }

    console.log("Critical data initialization completed.");
  } catch (error) {
    console.error("Error initializing critical data:", error);
    // Gérer les erreurs de réseau et utiliser les données locales si nécessaire
  }
};

export default initializeCriticalData;

// // src/utils/initializeCriticalData.js
// import { fetchAllData } from "../api/fetchAll";
// import db from "../database/database";

// const initializeCriticalData = async (token) => {
//   console.log("Initializing critical data with token:", token);

//   try {
//     // Supposons qu'il n'y a qu'une seule page de données
//     const { data } = await fetchAllData(1, 5, "", token); // Récupération des données

//     if (!data) {
//       console.error("Données manquantes");
//       return;
//     }

//     // Gestion des parcours et de leurs données imbriquées
//     if (data.parcours && Array.isArray(data.parcours)) {
//       for (const parcour of data.parcours) {
//         await db.parcours.put(parcour);

//         if (parcour.modules && Array.isArray(parcour.modules)) {
//           for (const module of parcour.modules) {
//             module.parcour = parcour.id; // Définir l'ID du parcours dans le module
//             await db.modules.put(module);

//             if (module.lessons && Array.isArray(module.lessons)) {
//               for (const lesson of module.lessons) {
//                 lesson.module = module.id; // Définir l'ID du module dans la leçon
//                 await db.lessons.put(lesson);
//               }
//             }
//           }
//         }
//       }
//     }

//     // Gestion des ressources
//     if (data.resources && Array.isArray(data.resources)) {
//       for (const resource of data.resources) {
//         await db.resources.put(resource);

//         if (resource.parcours && Array.isArray(resource.parcours)) {
//           for (const parcour of resource.parcours) {
//             parcour.resource = resource.id; // Définir l'ID de la ressource dans le parcours
//             await db.parcours.put(parcour);
//           }
//         }

//         if (resource.modules && Array.isArray(resource.modules)) {
//           for (const module of resource.modules) {
//             module.resource = resource.id; // Définir l'ID de la ressource dans le module
//             await db.modules.put(module);
//           }
//         }

//         if (resource.lessons && Array.isArray(resource.lessons)) {
//           for (const lesson of resource.lessons) {
//             lesson.resource = resource.id; // Définir l'ID de la ressource dans la leçon
//             await db.lessons.put(lesson);
//           }
//         }
//       }
//     }

//     console.log("Critical data initialization completed.");
//   } catch (error) {
//     console.error("Error initializing critical data:", error);
//     // Gérer les erreurs de réseau et utiliser les données locales si nécessaire
//   }
// };

// export default initializeCriticalData;
