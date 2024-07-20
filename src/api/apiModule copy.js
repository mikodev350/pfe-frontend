import axios from "axios";
import { API_BASE_URL } from "../constants/constante";
import db from "../database/database";

// Gérer les conflits entre les données locales et distantes
const handleConflict = (localData, remoteData) => {
  if (new Date(localData.updatedAt) > new Date(remoteData.data.updatedAt)) {
    return localData;
  } else {
    return remoteData;
  }
};

// Handle conflicts between local and remote data
const handleConflict = (localData, remoteData) => {
  if (new Date(localData.updatedAt) > new Date(remoteData.updatedAt)) {
    return localData;
  } else {
    return remoteData;
  }
};

export const fetchModules = async (page, token, search = "", parcoursId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/modules`, {
      params: {
        _page: page,
        _limit: 5,
        _q: search,
        parcour: parcoursId,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Fetching modules...");
    console.log(response.data.data);

    // Store the data in Dexie with conflict handling
    await db.transaction("rw", db.modules, async (tx) => {
      for (const module of response.data.data) {
        try {
          await tx.modules.put({ ...module, version: module.version || 1 });
        } catch (error) {
          if (error.name === "ConstraintError") {
            // Handle conflict, such as by merging or retrying
            const existingModule = await tx.modules.get(module.id);
            if (existingModule) {
              const resolvedData = handleConflict(existingModule, module);
              await tx.modules.put(resolvedData);
            } else {
              throw error;
            }
          } else {
            throw error;
          }
        }
      }
    });

    return {
      data: response.data.data,
      totalPages: Math.ceil(response.data.meta.pagination.total / 5),
    };
  } catch (error) {
    console.error("Error fetching modules:", error);

    // In case of an error, read local data from Dexie
    const localData = await db.modules
      .filter(
        (module) => module.nom.includes(search) && module.parcour === parcoursId
      )
      .offset((page - 1) * 5)
      .limit(5)
      .toArray();

    return {
      data: localData,
      totalPages: 1, // Adjust totalPages according to your needs
    };
  }
};

// export const fetchModules = async (page, token, search = "", parcoursId) => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/modules`, {
//       params: {
//         _page: page,
//         _limit: 5,
//         _q: search,
//         parcour: parcoursId,
//       },
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     console.log("Fetching modules...");
//     console.log(response.data.data);

//     // Store the data in Dexie
//     await db.transaction("rw", db.modules, async (tx) => {
//       for (const module of response.data.data) {
//         await tx.modules.put({ ...module, version: module.version || 1 });
//       }
//     });

//     return {
//       data: response.data.data,
//       totalPages: Math.ceil(response.data.meta.pagination.total / 5),
//     };
//   } catch (error) {
//     console.error("Error fetching modules:", error);

//     // In case of an error, read local data from Dexie
//     const localData = await db.modules
//       .filter(
//         (module) => module.nom.includes(search) && module.parcour === parcoursId
//       )
//       .offset((page - 1) * 5)
//       .limit(5)
//       .toArray();

//     return {
//       data: localData,
//       totalPages: 1, // Adjust totalPages according to your needs
//     };
//   }
// };
// // Fonction pour récupérer les modules
// export const fetchModules = async (page, token, search = "", parcoursId) => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/modules`, {
//       params: {
//         _page: page,
//         _limit: 5,
//         _q: search,
//         parcour: parcoursId,
//       },
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     console.log(response);
//     // Stocker les données dans Dexie
//     await db.transaction("rw", db.modules, async () => {
//       for (const module of response.data.data) {
//         await db.modules.put({ ...module, version: module.version || 1 });
//       }
//     });

//     return {
//       data: response.data.data,
//       totalPages: Math.ceil(response.data.meta.pagination.total / 5),
//     };
//   } catch (error) {
//     console.error("Error fetching modules:", error);

//     // En cas d'erreur, lire les données locales depuis Dexie
//     const localData = await db.modules
//       .filter(
//         (module) => module.nom.includes(search) && module.parcour === parcoursId
//       )
//       .offset((page - 1) * 5)
//       .limit(5)
//       .toArray();

//     return {
//       data: localData,
//       totalPages: 1, // Ajustez totalPages selon vos besoins
//     };
//   }
// };

// Fonction pour créer un module
export const createModule = async (moduleData, token) => {
  if (!navigator.onLine) {
    const newData = {
      ...moduleData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    try {
      const id = await db.modules.add(newData);
      await db.offlineChanges.add({
        type: "add",
        data: { id, ...newData },
        timestamp: Date.now(),
      });
      return { status: "offline" };
    } catch (error) {
      console.error("Error adding data to IndexedDB:", error);
    }
    return { status: "offline" };
  }

  try {
    const newData = {
      ...moduleData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const response = await axios.post(
      `${API_BASE_URL}/modules`,
      { data: newData },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Ajouter les données dans IndexedDB après une réponse réussie
    try {
      await db.modules.add({ id: response.data.data.id, ...newData });
    } catch (error) {
      console.error("Error adding data to IndexedDB:", error);
    }

    return response.data;
  } catch (error) {
    console.error("Error creating module:", error);
    throw error;
  }
};

// Fonction pour mettre à jour un module
export const updateModule = async (id, moduleData, token) => {
  if (!navigator.onLine) {
    const updatedData = {
      ...moduleData,
      updatedAt: new Date().toISOString(),
    };
    try {
      await db.modules.update(Number(id), updatedData);
      await db.offlineChanges.add({
        type: "update",
        data: { id: Number(id), ...updatedData },
        timestamp: Date.now(),
      });
      return { status: "offline" };
    } catch (error) {
      console.error("Error updating data in IndexedDB:", error);
    }
    return { status: "offline" };
  }

  try {
    const updatedData = { ...moduleData, updatedAt: new Date().toISOString() };
    const response = await axios.put(
      `${API_BASE_URL}/modules/${id}`,
      updatedData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Mettre à jour les données dans IndexedDB après une réponse réussie
    try {
      await db.modules.update(Number(id), updatedData);
    } catch (error) {
      console.error("Error updating data in IndexedDB:", error);
    }

    return response.data;
  } catch (error) {
    console.error("Error updating module:", error);
    throw error;
  }
};

// Fonction pour supprimer un module
export const deleteModule = async (id, token) => {
  if (!navigator.onLine) {
    await db.modules.delete(id);
    await db.offlineChanges.add({
      type: "delete",
      data: { id },
      timestamp: Date.now(),
    });
    return { status: "offline" };
  }

  try {
    const response = await axios.delete(`${API_BASE_URL}/modules/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error deleting module:", error);
    throw error;
  }
};

// Fonction pour synchroniser les modifications hors ligne
export const syncOfflineChanges = async (token) => {
  const offlineChanges = await db.offlineChanges.toArray();
  for (const change of offlineChanges) {
    try {
      if (change.type === "add") {
        const response = await axios.post(
          `${API_BASE_URL}/modules`,
          { data: change.data },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        await db.modules.put(response.data.data);
      } else if (change.type === "update") {
        const remoteData = await axios
          .get(`${API_BASE_URL}/modules/${change.data.id}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => response.data);

        const resolvedData = handleConflict(change.data, remoteData);
        const response = await axios.put(
          `${API_BASE_URL}/modules/${resolvedData.id}`,
          resolvedData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        await db.modules.update(resolvedData.id, resolvedData);
      } else if (change.type === "delete") {
        await axios.delete(`${API_BASE_URL}/modules/${change.data.id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        await db.modules.delete(change.data.id);
      }
    } catch (error) {
      console.error("Error syncing change:", change, error);
    }
  }
  await db.offlineChanges.clear();
};

// import axios from "axios";
// import { API_BASE_URL } from "../constants/constante"; // Make sure to define your API base URL in constants

// // Fetch modules with pagination, search, and parcoursId
// export const fetchModules = async (page, token, search = "", parcoursId) => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/modules`, {
//       params: {
//         _page: page,
//         _limit: 5,
//         _q: search,
//         parcour: parcoursId,
//       },
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     return {
//       data: response.data.data,
//       totalPages: Math.ceil(response.data.meta.pagination.total / 5),
//     };
//   } catch (error) {
//     console.error("Error fetching modules:", error);
//     throw error;
//   }
// };

// export const createModule = async (moduleData, token) => {
//   try {
//     const response = await axios.post(`${API_BASE_URL}/modules`, moduleData, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error creating module:", error);
//     throw error;
//   }
// };

// // Update an existing module
// export const updateModule = async (moduleId, module, token) => {
//   try {
//     const response = await axios.put(
//       `${API_BASE_URL}/modules/${moduleId}`,
//       { data: module },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     return response.data;
//   } catch (error) {
//     console.error("Error updating module:", error);
//     throw error;
//   }
// };

// //ici delete the module
// export const deleteModule = async (moduleId, token) => {
//   try {
//     const response = await axios.delete(`${API_BASE_URL}/modules/${moduleId}`, {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error deleting module:", error);
//     throw error;
//   }
// };
