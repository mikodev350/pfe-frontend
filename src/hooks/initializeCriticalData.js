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

      // Handle parcours and their nested data
      for (const parcour of data.parcours) {
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

      // Handle resources
      for (const resource of data.resources) {
        await db.resources.put(resource);

        if (resource.parcours) {
          for (const parcour of resource.parcours) {
            parcour.resource = resource.id; // Setting resource ID in parcour
            await db.parcours.put(parcour);
          }
        }

        if (resource.modules) {
          for (const module of resource.modules) {
            module.resource = resource.id; // Setting resource ID in module
            await db.modules.put(module);
          }
        }

        if (resource.lessons) {
          for (const lesson of resource.lessons) {
            lesson.resource = resource.id; // Setting resource ID in lesson
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
