// src/utils/initializeCriticalData.js
import { fetchAllData } from "../api/fetchAll";
import db from "../database/database";

const initializeCriticalData = async (token) => {
  console.log("Initializing critical data with token:", token);

  try {
    let page = 1;
    let hasMoreData = true;

    while (hasMoreData) {
      const { data, meta } = await fetchAllData(page, 5, "", token);
      const { pageCount } = meta.pagination;

      for (const parcour of data) {
        await db.parcours.put(parcour);

        for (const module of parcour.modules) {
          module.parcour = parcour.id; // Setting parcour ID in module
          await db.modules.put(module);

          for (const lesson of module.lessons) {
            lesson.module = module.id; // Setting module ID in lesson
            await db.lessons.put(lesson);
          }
        }
      }

      page++;
      hasMoreData = page <= pageCount;

      if (page > 100) {
        console.error("Nombre de pages trop élevé, arrêt de la boucle");
        break;
      }
    }

    console.log("Critical data initialization completed.");
  } catch (error) {
    console.error("Error initializing critical data:", error);
    // Gérer les erreurs de réseau et utiliser les données locales si nécessaire
  }
};

export default initializeCriticalData;

// import { fetchModules } from "../api/apiModule";
// import { fetchParcours } from "../api/ApiParcour";
// import { fetchLessons } from "../api/apiLesson";
// import { fetchResources } from "../api/apiResource";

// import db from "../database/database";

// const initializeCriticalData = async (token) => {
//   console.log("Initializing critical data with token:", token);

//   try {
//     // Récupérer les parcours
//     const parcoursResponse = await fetchParcours(1, "", token);
//     const parcours = parcoursResponse.data;
//     console.log("Fetched parcours:", parcours);

//     // Stocker les parcours et les modules dans IndexedDB
//     for (const parcour of parcours) {
//       await db.parcours.put(parcour);

//       // Récupérer un échantillon de modules pour chaque parcours
//       const modulesResponse = await fetchModules(1, token, "", parcour.id);
//       const modules = modulesResponse.data; // Ne pas limiter ici

//       for (const module of modules) {
//         console.log(`Storing module: ${module.nom}`);
//         await db.modules.put(module);

//         // Récupérer toutes les pages de leçons pour chaque module
//         let page = 1;
//         let hasMoreLessons = true;
//         while (hasMoreLessons) {
//           const lessonsResponse = await fetchLessons(
//             page,
//             token,
//             "",
//             module.id
//           );

//           const lessons = lessonsResponse.data;

//           for (const lesson of lessons) {
//             console.log(`Storing lesson: ${lesson.nom}`);
//             await db.lessons.put(lesson);
//           }

//           page++;
//           hasMoreLessons = lessons.length === 5; // Si on a moins de 5 leçons, on arrête

//           // Ajout d'une condition de sécurité pour éviter la boucle infinie
//           if (page > 100) {
//             console.error("Nombre de pages trop élevé, arrêt de la boucle");
//             hasMoreLessons = false;
//           }
//         }
//       }
//     }

//     // Récupérer et stocker les ressources de manière indépendante
//     let resourcePage = 1;
//     let hasMoreResources = true;
//     while (hasMoreResources) {
//       const resourcesResponse = await fetchResources(
//         resourcePage,
//         5,
//         null,
//         "",
//         token
//       );
//       const resources = resourcesResponse.data;

//       for (const resource of resources) {
//         try {
//           console.log(`Storing resource: ${resource.nom}`);
//           console.log("Resource data:", resource);

//           // Assurer que chaque champ a une valeur par défaut s'il est undefined
//           const {
//             id = null,
//             nom = "",
//             format = "",
//             parcours = [],
//             modules = [],
//             lessons = [],
//             note = "",
//             images = null,
//             audio = null,
//             pdf = null,
//             video = null,
//             link = "",
//             users_permissions_user = null,
//             referenceLivre = null,
//           } = resource;

//           // Préparer l'objet à insérer dans IndexedDB
//           const resourceToStore = {
//             id,
//             nom,
//             format,
//             parcours,
//             modules,
//             lessons,
//             note,
//             images,
//             audio,
//             pdf,
//             video,
//             link,
//             users_permissions_user,
//             referenceLivre,
//           };

//           if (id && nom) {
//             // Assurez-vous que chaque ressource a un id et un nom
//             await db.resources.put(resourceToStore);
//             console.log(`Resource stored successfully: ${nom}`);
//           } else {
//             console.error("Invalid resource data:", resource);
//           }
//         } catch (error) {
//           console.error(`Error storing resource: ${resource.nom}`, error);
//         }
//       }

//       resourcePage++;
//       hasMoreResources = resources.length === 5; // Si on a moins de 5 ressources, on arrête

//       // Ajout d'une condition de sécurité pour éviter la boucle infinie
//       if (resourcePage > 100) {
//         console.error(
//           "Nombre de pages trop élevé, arrêt de la boucle des ressources"
//         );
//         hasMoreResources = false;
//       }
//     }

//     console.log("Critical data initialization completed.");
//   } catch (error) {
//     console.error("Error initializing critical data:", error);
//     // Gérer les erreurs de réseau et utiliser les données locales si nécessaire
//   }
// };

// export default initializeCriticalData;
