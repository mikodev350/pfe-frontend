import { fetchLessons } from "../api/apiLesson";
import { fetchModules } from "../api/apiModule";
import { fetchParcours } from "../api/ApiParcour";
import db from "../database/database";

const initializeCriticalData = async (token) => {
  alert(token);

  try {
    // Fetch parcours
    const parcoursResponse = await fetchParcours(1, "", token);
    console.log("====================================");
    console.log(parcoursResponse);
    console.log("====================================");
    const parcours = parcoursResponse.data;

    // Store parcours, modules, and lessons in IndexedDB
    await db.transaction(
      "rw",
      [db.parcours, db.modules, db.lessons],
      async (tx) => {
        for (const parcour of parcours) {
          await tx.parcours.put(parcour);

          // Fetch a sample of modules for each parcours
          const modulesResponse = await fetchModules(1, token, "", parcour.id);
          const modules = modulesResponse.data.slice(0, 2); // Limit to 2 modules as an example

          for (const module of modules) {
            await tx.modules.put(module);

            // Fetch all pages of lessons for each module
            let page = 1;
            let hasMoreLessons = true;
            while (hasMoreLessons) {
              const lessonsResponse = await fetchLessons(
                page,
                token,
                "",
                module.id
              );
              const lessons = lessonsResponse.data;

              for (const lesson of lessons) {
                await tx.lessons.put(lesson);
              }

              page++;
              hasMoreLessons = lessons.length === 5; // If there are fewer than 5 lessons, stop
            }
          }
        }
      }
    );
  } catch (error) {
    console.error("Error initializing critical data:", error);
    // Handle network errors and use local data if necessary
  }
};

export default initializeCriticalData;
