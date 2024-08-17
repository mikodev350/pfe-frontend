import axios from "axios";
import { API_BASE_URL } from "../constants/constante";
import db from "../database/database";

const handleConflict = (localData, remoteData) => {
  if (new Date(localData.updatedAt) > new Date(remoteData.data.updatedAt)) {
    return localData;
  } else {
    return remoteData;
  }
};

// Fonction pour récupérer les parcours
export const fetchParcours = async (page, search, token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/parcours`, {
      params: {
        _page: page,
        _limit: 5,
        _q: search,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    // Store data in IndexedDB
    await db.transaction("rw", db.parcours, async (tx) => {
      for (const parcour of response.data.data) {
        await tx.parcours.put({ ...parcour, version: parcour.version || 1 });
      }
    });
    console.log("response.data.meta");

    console.log(response.data.meta);
    return {
      data: response.data.data,
      totalPages: Math.ceil(response.data.meta.pagination.total / 5),
    };
  } catch (error) {
    console.error("Error fetching parcours:", error);

    // Fetch local data from IndexedDB in case of error
    const localData = await db.parcours
      .filter((parcour) => parcour.nom.includes(search))
      .offset((page - 1) * 5)
      .limit(5)
      .toArray();

    // Count the total number of local parcours
    const totalLocalDataCount = await db.parcours
      .filter((parcour) => parcour.nom.includes(search))
      .count();
    console.log(
      "-------------------------------------------------------------------------------"
    );
    console.log("totalLocalDataCount  :");
    console.log(totalLocalDataCount);
    console.log(
      "-------------------------------------------------------------------------------"
    );

    return {
      data: localData,
      totalPages: Math.ceil(totalLocalDataCount / 5), // Adjust total pages based on local data count
    };
  }
};
// export const fetchParcours = async (page, search, token) => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/parcours`, {
//       params: {
//         _page: page,
//         _limit: 5,
//         _q: search,
//       },
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     // Stocker les données dans Dexie
//     await db.transaction("rw", db.parcours, async (tx) => {
//       for (const parcour of response.data.data) {
//         await tx.parcours.put({ ...parcour, version: parcour.version || 1 });
//       }
//     });

//     return {
//       data: response.data.data,
//       totalPages: Math.ceil(response.data.meta.pagination.total / 5),
//     };
//   } catch (error) {
//     console.error("Error fetching parcours:", error);

//     // En cas d'erreur, lire les données locales depuis Dexie
//     const localData = await db.parcours
//       .filter((parcour) => parcour.nom.includes(search))
//       .offset((page - 1) * 5)
//       .limit(5)
//       .toArray();

//     return {
//       data: localData,
//       totalPages: 1, // Ajustez totalPages selon vos besoins
//     };
//   }
// };

// // Fonction pour récupérer les parcours
// export const fetchParcours = async (page, search, token) => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/parcours`, {
//       params: {
//         _page: page,
//         _limit: 5,
//         _q: search,
//       },
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     // Stocker les données dans Dexie
//     await db.transaction("rw", db.parcours, async () => {
//       for (const parcour of response.data.data) {
//         await db.parcours.put({ ...parcour, version: parcour.version || 1 });
//       }
//     });

//     return {
//       data: response.data.data,
//       totalPages: Math.ceil(response.data.meta.pagination.total / 5),
//     };
//   } catch (error) {
//     console.error("Error fetching parcours:", error);

//     // En cas d'erreur, lire les données locales depuis Dexie
//     const localData = await db.parcours
//       .filter((parcour) => parcour.nom.includes(search))
//       .offset((page - 1) * 5)
//       .limit(5)
//       .toArray();

//     return {
//       data: localData,
//       totalPages: 1, // Ajustez totalPages selon vos besoins
//     };
//   }
// };

// export const fetchParcours = async (page, search, token) => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/parcours`, {
//       params: {
//         _page: page,
//         _limit: 5,
//         _q: search,
//       },
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     // Stocker les données dans Dexie
//     await db.transaction("rw", db.parcours, async () => {
//       for (const parcour of response.data.data) {
//         await db.parcours.put({ ...parcour, version: parcour.version || 1 });
//       }
//     });

//     return {
//       data: response.data.data,
//       totalPages: Math.ceil(response.data.meta.pagination.total / 5),
//     };
//   } catch (error) {
//     console.error("Error fetching parcours:", error);

//     // En cas d'erreur, lire les données locales depuis Dexie
//     const localData = await db.parcours
//       .filter((parcour) => parcour.nom.includes(search))
//       .offset((page - 1) * 5)
//       .limit(5)
//       .toArray();

//     return {
//       data: localData,
//       totalPages: 1, // Ajustez totalPages selon vos besoins
//     };
//   }
// };
// Fonction pour créer un parcours
export const createPathway = async (pathwayData, token) => {
  console.log("Starting createPathway function...");
  console.log("Pathway Data:", pathwayData);

  if (!navigator.onLine) {
    console.log("Offline mode: adding data to IndexedDB...");
    const newData = {
      ...pathwayData,
      createdAt: new Date().toISOString(), // Ajouter ou mettre à jour le timestamp de création
      updatedAt: new Date().toISOString(), // Ajouter ou mettre à jour le timestamp de mise à jour
    };
    try {
      const id = await db.parcours.add(newData);
      await db.offlineChanges.add({
        type: "add",
        dataBase: "parcour",
        data: { id, ...newData },
        timestamp: Date.now(),
      });
      console.log("Data added to IndexedDB and offlineChanges:", newData);
    } catch (error) {
      console.error("Error adding data to IndexedDB:", error);
    }
    return { status: "offline" };
  }

  try {
    const newData = {
      ...pathwayData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const response = await axios.post(
      `${API_BASE_URL}/parcours`,
      { data: newData },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("createPathway response from server:", response);

    // Ajouter les données dans IndexedDB après une réponse réussie
    try {
      await db.parcours.add({ id: response.data.data.id, ...newData });
      console.log("Data added to IndexedDB:", newData);
    } catch (error) {
      console.error("Error adding data to IndexedDB:", error);
    }

    return response.data;
  } catch (error) {
    console.error("Error creating pathway:", error);
    throw error;
  }
};

// Fonction pour mettre à jour un parcours
export const updatePathway = async (id, pathwayData, token) => {
  console.log("Starting updatePathway function...");
  console.log("ID:", id);
  console.log("Pathway Data:", pathwayData);

  const updatedData = {
    ...pathwayData,
    updatedAt: new Date().toISOString(), // Ajouter ou mettre à jour le timestamp
  };

  if (!navigator.onLine) {
    console.log("Offline mode: updating data in IndexedDB...");
    try {
      await db.parcours.update(Number(id), updatedData);
      await db.offlineChanges.add({
        type: "update",
        dataBase: "parcour",
        data: { id, ...updatedData },
        timestamp: Date.now(),
      });
      console.log(
        "Data updated in IndexedDB and added to offlineChanges:",
        updatedData
      );
      return { status: "offline", data: updatedData };
    } catch (error) {
      console.error("Error updating data in IndexedDB:", error);
    }
  } else {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/parcours/${id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("updatePathway response from server:", response);

      // Mettre à jour les données dans IndexedDB après une réponse réussie
      try {
        await db.parcours.update(Number(id), updatedData);
        console.log("Data updated in IndexedDB:", updatedData);
      } catch (error) {
        console.error("Error updating data in IndexedDB:", error);
      }

      return { status: "success", data: response.data.data };
    } catch (error) {
      console.error("Error updating pathway:", error);
      throw error;
    }
  }
};

// // Fonction pour mettre à jour un parcours
// export const updatePathway = async (id, pathwayData, token) => {
//   console.log("Starting updatePathway function...");
//   console.log("ID:", id);
//   console.log("Pathway Data:", pathwayData);

//   if (!navigator.onLine) {
//     console.log("Offline mode: updating data in IndexedDB...");
//     const updatedData = {
//       ...pathwayData,
//       updatedAt: new Date().toISOString(),
//     };
//     try {
//       await db.parcours.update(Number(id), updatedData);
//       await db.offlineChanges.add({
//         type: "update",
//         data: { id, ...updatedData },
//         timestamp: Date.now(),
//       });
//       console.log(
//         "Data updated in IndexedDB and added to offlineChanges:",
//         updatedData
//       );
//     } catch (error) {
//       console.error("Error updating data in IndexedDB:", error);
//     }
//     return { status: "offline", data: updatedData };
//   }

//   try {
//     const updatedData = { ...pathwayData, updatedAt: new Date().toISOString() };
//     const response = await axios.put(
//       `${API_BASE_URL}/parcours/${id}`,
//       updatedData,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );
//     console.log("updatePathway response from server:", response);

//     // Mettre à jour les données dans IndexedDB après une réponse réussie
//     try {
//       await db.parcours.update(Number(id), updatedData);
//       console.log("Data updated in IndexedDB:", updatedData);
//     } catch (error) {
//       console.error("Error updating data in IndexedDB:", error);
//     }

//     return { status: "success", data: response.data.data };
//   } catch (error) {
//     console.error("Error updating pathway:", error);
//     throw error;
//   }
// };

//
// Fonction pour supprimer un parcours
export const deletePathway = async (id, token) => {
  if (!navigator.onLine) {
    console.log("Offline mode: deleting data in IndexedDB...");
    try {
      await db.parcours.delete(id);
      await db.offlineChanges.add({
        type: "delete",
        dataBase: "parcour",

        data: { id },
        timestamp: Date.now(),
      });
      console.log("Data deleted in IndexedDB and added to offlineChanges.");
      return { status: "offline" };
    } catch (error) {
      console.error("Error deleting data in IndexedDB:", error);
      throw error;
    }
  }

  try {
    const response = await axios.delete(`${API_BASE_URL}/parcours/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Supprimer également l'élément de IndexedDB après une suppression réussie
    await db.parcours.delete(id);
    console.log("Data deleted from server and IndexedDB.");

    return { status: "success", data: response.data };
  } catch (error) {
    console.error("Error deleting pathway:", error);
    throw error;
  }
};

/**********************************************************************************/
// Fonction pour récupérer un parcours par ID
export const getPathwayById = async (id, token) => {
  if (!navigator.onLine) {
    const localData = await db.parcours.get(parseInt(id)); // Assurez-vous que l'ID est bien un entier
    return { data: localData };
  }
  const response = await axios.get(`${API_BASE_URL}/parcours/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

/**************************************************************************************************/

export const syncOfflineChanges = async (token, queryClient, change) => {
  try {
    const data = change.data; // Ajoutez cette ligne pour définir `data`
    if (change.type === "add") {
      const response = await axios.post(
        `${API_BASE_URL}/parcours`,
        { data },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await db.parcours.put(response.data.data);
      queryClient.setQueryData(["parcours"], (oldData) => {
        return {
          ...oldData,
          data: [...oldData.data, response.data.data],
        };
      });
    } else if (change.type === "update") {
      const remoteData = await axios
        .get(`${API_BASE_URL}/parcours/${data.id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => response.data);

      const resolvedData = handleConflict(data, remoteData);
      const response = await axios.put(
        `${API_BASE_URL}/parcours/${resolvedData.id}`,
        resolvedData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await db.parcours.update(resolvedData.id, resolvedData);
      queryClient.setQueryData(["parcours"], (oldData) => {
        return {
          ...oldData,
          data: oldData.data.map((item) =>
            item.id === resolvedData.id ? resolvedData : item
          ),
        };
      });
    } else if (change.type === "delete") {
      const response = await axios.delete(
        `${API_BASE_URL}/parcours/${data.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Delete response:", response.data); // Utilisez response ici
      await db.parcours.delete(data.id);
      queryClient.setQueryData(["parcours"], (oldData) => {
        return {
          ...oldData,
          data: oldData.data.filter((item) => item.id !== data.id),
        };
      });
    }
  } catch (error) {
    console.error("Error syncing change:", error);
  }
};
/****************************************************************************************************************/

// Fonction pour synchroniser les modifications hors ligne

// // Fonction pour synchroniser les modifications hors ligne
// export const syncOfflineChanges = async (token, queryClient) => {
//   const offlineChanges = await db.offlineChanges.toArray();
//   for (const change of offlineChanges) {
//     try {
//       console.log("Synchronizing change:", change);
//       if (change.type === "add") {
//         const response = await axios.post(
//           `${API_BASE_URL}/parcours`,
//           { data: change.data },
//           {
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         console.log("Add response:", response.data);
//         await db.parcours.put(response.data.data);
//         queryClient.setQueryData(["parcours"], (oldData) => {
//           return {
//             ...oldData,
//             data: [...oldData.data, response.data.data],
//           };
//         });
//       } else if (change.type === "update") {
//         const remoteData = await axios
//           .get(`${API_BASE_URL}/parcours/${change.data.id}`, {
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//           })
//           .then((response) => response.data);

//         const resolvedData = handleConflict(change.data, remoteData);
//         const response = await axios.put(
//           `${API_BASE_URL}/parcours/${resolvedData.id}`,
//           resolvedData,
//           {
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         console.log("Update response:", response.data);
//         await db.parcours.update(resolvedData.id, resolvedData);
//         queryClient.setQueryData(["parcours"], (oldData) => {
//           return {
//             ...oldData,
//             data: oldData.data.map((item) =>
//               item.id === resolvedData.id ? resolvedData : item
//             ),
//           };
//         });
//       } else if (change.type === "delete") {
//         const response = await axios.delete(
//           `${API_BASE_URL}/parcours/${change.data.id}`,
//           {
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         console.log("Delete response:", response.data);
//         await db.parcours.delete(change.data.id);
//         queryClient.setQueryData(["parcours"], (oldData) => {
//           return {
//             ...oldData,
//             data: oldData.data.filter((item) => item.id !== change.data.id),
//           };
//         });
//       }
//       await db.offlineChanges.delete(change.id); // Supprimer l'élément traité de offlineChanges
//     } catch (error) {
//       console.error("Error syncing change:", change, error);
//     }
//   }
//   // await db.offlineChanges.clear();
// };

/*************************************************************************************/
// // Fonction pour synchroniser les modifications hors ligne
// export const syncOfflineChanges = async (token) => {
//   const offlineChanges = await db.offlineChanges.toArray();
//   for (const change of offlineChanges) {
//     try {
//       console.log("Synchronizing change:", change);
//       if (change.type === "add") {
//         const response = await axios.post(
//           `${API_BASE_URL}/parcours`,
//           { data: change.data },
//           {
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         console.log("Add response:", response.data);
//         await db.parcours.put(response.data.data);
//       } else if (change.type === "update") {
//         const remoteData = await axios
//           .get(`${API_BASE_URL}/parcours/${change.data.id}`, {
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//           })
//           .then((response) => response.data);

//         const resolvedData = handleConflict(change.data, remoteData);
//         const response = await axios.put(
//           `${API_BASE_URL}/parcours/${resolvedData.id}`,
//           resolvedData,
//           {
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         console.log("Update response:", response.data);
//         await db.parcours.update(resolvedData.id, resolvedData);
//       } else if (change.type === "delete") {
//         const response = await axios.delete(
//           `${API_BASE_URL}/parcours/${change.data.id}`,
//           {
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         console.log("Delete response:", response.data);
//         await db.parcours.delete(change.data.id);
//       }
//     } catch (error) {
//       console.error("Error syncing change:", change, error);
//     }
//   }
//   await db.offlineChanges.clear();
// };
/*********************************************************************************/
// import axios from "axios";
// import { API_BASE_URL } from "../constants/constante";
// import db from "../database/database";

// // Fonction pour récupérer les parcours
// export const fetchParcours = async (page, search, token) => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/parcours`, {
//       params: {
//         _page: page,
//         _limit: 5,
//         _q: search,
//       },
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     // Stocker les données dans Dexie
//     response.data.data.forEach(async (parcour) => {
//       await db.parcours.put({ ...parcour, version: parcour.version || 1 });
//     });

//     return {
//       data: response.data.data,
//       totalPages: Math.ceil(response.data.meta.pagination.total / 5),
//     };
//   } catch (error) {
//     console.error("Error fetching parcours:", error);

//     // En cas d'erreur, lire les données locales depuis Dexie
//     const localData = await db.parcours.toArray();
//     return {
//       data: localData,
//       totalPages: 1, // Ajustez totalPages selon vos besoins
//     };
//   }
// };

// // Fonction pour créer un parcours
// export const createPathway = async (pathwayData, token) => {
//   if (!navigator.onLine) {
//     await db.parcours.add({ ...pathwayData, version: 1 });
//     await db.offlineChanges.add({
//       type: "add",
//       data: { ...pathwayData, version: 1 },
//       timestamp: Date.now(),
//     });
//     return { status: "offline" };
//   }

//   try {
//     const response = await axios.post(
//       `${API_BASE_URL}/parcours`,
//       { data: pathwayData },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     return response.data;
//   } catch (error) {
//     console.error("Error creating pathway:", error);
//     throw error;
//   }
// };

// // Fonction pour mettre à jour un parcours
// export const updatePathway = async (id, pathwayData, token) => {
//   const localPathway = await db.parcours.get(id);

//   if (!navigator.onLine) {
//     await db.parcours.update(id, {
//       ...pathwayData,
//       version: localPathway.version + 1,
//     });
//     await db.offlineChanges.add({
//       type: "update",
//       data: { id, ...pathwayData, version: localPathway.version + 1 },
//       timestamp: Date.now(),
//     });
//     return { status: "offline" };
//   }

//   try {
//     const response = await axios.put(
//       `${API_BASE_URL}/parcours/${id}`,
//       { ...pathwayData, version: localPathway.version + 1 },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     await db.parcours.update(id, { version: localPathway.version + 1 });

//     return response.data;
//   } catch (error) {
//     console.error("Error updating pathway:", error);
//     throw error;
//   }
// };

// // Fonction pour supprimer un parcours
// export const deletePathway = async (id, token) => {
//   if (!navigator.onLine) {
//     await db.parcours.delete(id);
//     await db.offlineChanges.add({
//       type: "delete",
//       data: { id },
//       timestamp: Date.now(),
//     });
//     return { status: "offline" };
//   }

//   try {
//     const response = await axios.delete(`${API_BASE_URL}/parcours/${id}`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     return response.data;
//   } catch (error) {
//     console.error("Error deleting pathway:", error);
//     throw error;
//   }
// };

// // Fonction pour récupérer un parcours par ID
// export const getPathwayById = async (id, token) => {
//   if (!navigator.onLine) {
//     // const localData = await db.findOneParcour(id); // Utiliser la méthode findOneParcour
//     const localData = await db.parcours.get(parseInt(id)); // Assurez-vous que l'ID est bien un entier

//     console.log("this is id : " + id);
//     console.log("localData");
//     console.log(localData);
//     return { data: localData };
//   }
//   const response = await axios.get(`${API_BASE_URL}/parcours/${id}`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
//   return response.data;
// };
// const handleConflict = (localData, remoteData) => {
//   // Exemple simple: Dernière modification gagne
//   if (localData.version > remoteData.version) {
//     return localData;
//   } else {
//     return remoteData;
//   }
// };

// // Fonction pour synchroniser les modifications hors ligne
// export const syncOfflineChanges = async (token) => {
//   const offlineChanges = await db.offlineChanges.toArray();
//   for (const change of offlineChanges) {
//     try {
//       if (change.type === "add") {
//         await axios.post(
//           `${API_BASE_URL}/parcours`,
//           { data: change.data },
//           {
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//       } else if (change.type === "update") {
//         const remoteData = await axios
//           .get(`${API_BASE_URL}/parcours/${change.data.id}`, {
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//           })
//           .then((response) => response.data);

//         const resolvedData = handleConflict(change.data, remoteData);

//         await axios.put(
//           `${API_BASE_URL}/parcours/${resolvedData.id}`,
//           resolvedData,
//           {
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//       } else if (change.type === "delete") {
//         await axios.delete(`${API_BASE_URL}/parcours/${change.data.id}`, {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });
//       }
//     } catch (error) {
//       console.error("Error syncing change:", change, error);
//     }
//   }
//   await db.offlineChanges.clear();
// };

// import axios from "axios";
// import { API_BASE_URL } from "../constants/constante";
// import db from "../database/database";

// export const fetchParcours = async (page, search, token) => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/parcours`, {
//       params: {
//         _page: page,
//         _limit: 5,
//         _q: search,
//       },
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     // Stocker les données dans Dexie
//     response.data.data.forEach(async (parcour) => {
//       await db.parcours.put(parcour);
//     });

//     return {
//       data: response.data.data,
//       totalPages: Math.ceil(response.data.meta.pagination.total / 5),
//     };
//   } catch (error) {
//     console.error("Error fetching parcours:", error);

//     // En cas d'erreur, lire les données locales depuis Dexie
//     const localData = await db.parcours.toArray();
//     return {
//       data: localData,
//       totalPages: 1, // Ajustez totalPages selon vos besoins
//     };
//   }
// };
// export const createPathway = async (pathwayData, token) => {
//   try {
//     const response = await axios.post(
//       `${API_BASE_URL}/parcours`,
//       { data: pathwayData },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     console.log(response);
//     return response.data;
//   } catch (error) {
//     console.error("Error creating pathway:", error);
//     throw error;
//   }
// };

// // Update parcours
// export const updatePathway = async (id, pathwayData, token) => {
//   console.log(pathwayData);
//   const response = await axios.put(
//     `${API_BASE_URL}/parcours/${id}`,
//     { pathwayData: pathwayData },
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   );
//   return response.data;
// };

// export const getPathwayById = async (id, token) => {
//   const response = await axios.get(`${API_BASE_URL}/parcours/${id}`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
//   return response.data;
// };

// export const deletePathway = async (id, token) => {
//   try {
//     const response = await axios.delete(`${API_BASE_URL}/parcours/${id}`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error deleting pathway:", error);
//     throw error;
//   }
// };
