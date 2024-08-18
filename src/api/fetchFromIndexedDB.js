// indexedDBUtils.js

import db from "../database/database";

export async function fetchFromIndexedDB(params) {
  console.log("Params:", params); // Afficher les paramètres de recherche

  try {
    // Extraire les critères de recherche depuis les paramètres
    const { name, parcours, modules, lessons } = params;

    // Récupérer toutes les ressources depuis IndexedDB
    const allResources = await db.resources.toArray();
    console.log("All Resources:", allResources); // Afficher toutes les ressources

    // Fonction utilitaire pour vérifier les correspondances
    const checkMatch = (array, criteria) => {
      console.log("Checking match for criteria:", criteria, "in array:", array);
      if (!criteria) return true;
      if (!array || !Array.isArray(array)) return false;
      return criteria.split(",").some((criterion) => {
        console.log("Checking criterion:", criterion);
        return array.some((item) => {
          console.log("Checking item:", item);
          return item.id == criterion.trim();
        });
      });
    };

    // Filtrer les ressources en fonction des critères de recherche
    const filteredResources = allResources.filter((resource) => {
      console.log("Processing Resource:", resource);

      const matchesName = name
        ? resource.nom && resource.nom.includes(name)
        : true;
      console.log("Matches Name:", matchesName, "Resource Name:", resource.nom);

      const matchesParcours = resource.parcours
        ? checkMatch(resource.parcours, parcours)
        : true;
      console.log(
        "Matches Parcours:",
        matchesParcours,
        "Resource Parcours:",
        resource.parcours
      );

      const matchesModules = resource.modules
        ? checkMatch(resource.modules, modules)
        : true;
      console.log(
        "Matches Modules:",
        matchesModules,
        "Resource Modules:",
        resource.modules
      );

      const matchesLessons = resource.lessons
        ? checkMatch(resource.lessons, lessons)
        : true;
      console.log(
        "Matches Lessons:",
        matchesLessons,
        "Resource Lessons:",
        resource.lessons
      );

      const matches =
        matchesName && matchesParcours && matchesModules && matchesLessons;
      console.log("Resource matches all criteria:", matches);

      return matches;
    });

    console.log("Filtered Resources:", filteredResources); // Afficher les ressources filtrées

    // Formater les résultats pour correspondre à la structure souhaitée
    const formattedResults = filteredResources.map((resource) => {
      console.log("Formatting Resource:", resource);

      return {
        id: resource.id,
        name: resource.nom,
        parcours: Array.isArray(resource.parcours)
          ? resource.parcours.map((p) => p.nom).join(", ")
          : "",
        modules: Array.isArray(resource.modules)
          ? resource.modules.map((m) => m.nom).join(", ")
          : "",
        lessons: Array.isArray(resource.lessons)
          ? resource.lessons.map((l) => l.nom).join(", ")
          : "",
        resources: resource.resources
          ? Array.isArray(resource.resources)
            ? resource.resources.map((r) => r.nom).join(", ")
            : ""
          : "",
      };
    });

    console.log("----------------------------------------------");
    console.log("Formatted Results:");
    console.log(formattedResults);
    console.log("----------------------------------------------");

    return formattedResults;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des données depuis IndexedDB:",
      error
    );
    throw new Error(
      "Erreur lors de la récupération des données depuis IndexedDB"
    );
  }
}
