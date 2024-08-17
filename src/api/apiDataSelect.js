import axios from "axios";
import db from "../database/database";

const BASE_URL = "http://localhost:1337/api";

// // Fonction pour récupérer toutes les données d'une table
export const getAllDataFromDexie = async (tableName) => {
  try {
    return await db.table(tableName).toArray();
  } catch (error) {
    console.error(
      `Erreur lors de la récupération des données de la table ${tableName}:`,
      error
    );
    return [];
  }
};

// Fonction pour récupérer les données depuis l'API et les stocker dans localStorage
export const fetchDataAndStore = async (token) => {
  try {
    if (navigator.onLine) {
      // Si l'utilisateur est en ligne
      const [parcoursResponse, modulesResponse, lessonsResponse] =
        await Promise.all([
          axios.get(`${BASE_URL}/get-all-parcours`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${BASE_URL}/get-all-modules`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${BASE_URL}/get-all-lessons`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

      // Stocker les données dans localStorage
      localStorage.setItem("parcours", JSON.stringify(parcoursResponse.data));
      localStorage.setItem("modules", JSON.stringify(modulesResponse.data));
      localStorage.setItem("lessons", JSON.stringify(lessonsResponse.data));
    } else {
      console.warn("Vous êtes hors ligne. Utilisation des données stockées.");
      // Récupérer des données spécifiques (par exemple, parcours)
      const getParcoursFromDexie = await getAllDataFromDexie("parcours");
      const getModulesFromDexie = await getAllDataFromDexie("modules");
      const getLessonsFromDexie = await getAllDataFromDexie("lessons");

      const parcours = getParcoursFromDexie.map((p) => ({
        id: p.id,
        name: p.nom,
      }));
      const modules = getModulesFromDexie.map((m) => ({
        id: m.id,
        name: m.nom,
        idparcour: m.parcour,
      }));
      const lessons = getLessonsFromDexie.map((l) => ({
        id: l.id,
        name: l.nom,
        idmodule: l.module,
      }));
      // Stocker les données simplifiées dans localStorage
      localStorage.setItem("parcours", JSON.stringify(parcours));
      localStorage.setItem("modules", JSON.stringify(modules));
      localStorage.setItem("lessons", JSON.stringify(lessons));
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des données:", error);
    throw error;
  }
};

// Fonction pour récupérer les parcours depuis localStorage
export const getParcoursFromLocalStorage = () => {
  return JSON.parse(localStorage.getItem("parcours")) || [];
};

// Fonction pour récupérer les modules depuis localStorage
export const getModulesFromLocalStorage = () => {
  return JSON.parse(localStorage.getItem("modules")) || [];
};

// Fonction pour récupérer les leçons depuis localStorage
export const getLessonsFromLocalStorage = () => {
  return JSON.parse(localStorage.getItem("lessons")) || [];
};

// Exemple d'utilisation des fonctions ci-dessus
async function initData(token) {
  try {
    // Tenter de récupérer les données et les stocker
    await fetchDataAndStore(token);

    // Récupérer les données depuis localStorage
    const parcours = getParcoursFromLocalStorage();
    const modules = getModulesFromLocalStorage();
    const lessons = getLessonsFromLocalStorage();

    console.log("Parcours:", parcours);
    console.log("Modules:", modules);
    console.log("Leçons:", lessons);
  } catch (error) {
    console.error("Erreur lors de l'initialisation des données:", error);
  }
}

// import axios from "axios";

// const BASE_URL = "http://localhost:1337/api";

// export const fetchDataAndStore = async (token) => {
//   try {
//     const [parcoursResponse, modulesResponse, lessonsResponse] =
//       await Promise.all([
//         axios.get(`${BASE_URL}/get-all-parcours`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         axios.get(`${BASE_URL}/get-all-modules`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         axios.get(`${BASE_URL}/get-all-lessons`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//       ]);

//     const parcours = parcoursResponse.data;
//     const modules = modulesResponse.data;
//     const lessons = lessonsResponse.data;

//     localStorage.setItem("parcours", JSON.stringify(parcours));
//     localStorage.setItem("modules", JSON.stringify(modules));
//     localStorage.setItem("lessons", JSON.stringify(lessons));
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     throw error;
//   }
// };

// export const getParcoursFromLocalStorage = () => {
//   return JSON.parse(localStorage.getItem("parcours")) || [];
// };

// export const getModulesFromLocalStorage = () => {
//   return JSON.parse(localStorage.getItem("modules")) || [];
// };

// export const getLessonsFromLocalStorage = () => {
//   return JSON.parse(localStorage.getItem("lessons")) || [];
// };
