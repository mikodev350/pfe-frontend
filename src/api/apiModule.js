import axios from "axios";
import { API_BASE_URL } from "../constants/constante";
import db from "../database/database";

const handleConflict = (localData, remoteData) => {
  console.log("localData" + localData);
  console.log(localData);

  console.log("remoteData" + remoteData);
  console.log(remoteData);

  if (new Date(localData.updatedAt) > new Date(remoteData.updatedAt)) {
    return localData;
  } else {
    return remoteData;
  }
};

const addOrUpdateModuleInIndexedDB = async (module) => {
  const existingModule = await db.modules.get(module.id);
  if (!existingModule) {
    await db.modules.put({
      id: module.id,
      nom: module.nom,
      parcour: module.parcour.id,
      updatedAt: module.updatedAt,
      createdAt: module.createdAt,
      // version: module.version || 1,
    });
  } else {
    await db.modules.update(module.id, {
      id: module.id,
      nom: module.nom,
      parcour: module.parcour.id,
      lessons: module.lessons,
      updatedAt: module.updatedAt,
      createdAt: module.createdAt,
      // version: module.version || 1,
    });
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

//     // Insert modules into IndexedDB only if they do not already exist
//     await db.transaction("rw", db.modules, async () => {
//       for (const module of response.data.data) {
//         await addOrUpdateModuleInIndexedDB(module);
//       }
//     });

//     return {
//       data: response.data.data,
//       totalPages: Math.ceil(response.data.meta.pagination.total / 5),
//     };
//   } catch (error) {
//     console.error("Error fetching modules:", error);

//     // Fetch local data from IndexedDB in case of error
//     const localData = await db.modules
//       .where("parcour")
//       .equals(Number(parcoursId))
//       .filter((module) => module.nom.includes(search))
//       .offset((page - 1) * 5)
//       .limit(5)
//       .toArray();

//     // Count the total number of local modules
//     const totalLocalDataCount = await db.modules
//       .where("parcour")
//       .equals(Number(parcoursId))
//       .filter((module) => module.nom.includes(search))
//       .count();

//     return {
//       data: localData,
//       totalPages: Math.ceil(totalLocalDataCount / 5),
//     };
//   }
// };

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
    console.log("response.data.data");

    console.log(response.data.data);
    // Insertion dans IndexedDB
    await db.transaction("rw", db.modules, async () => {
      for (const module of response.data.data) {
        await addOrUpdateModuleInIndexedDB(module);
      }
    });

    return {
      data: response.data.data,
      totalPages: Math.ceil(response.data.meta.pagination.total / 5),
    };
  } catch (error) {
    console.error("Error fetching modules:", error);

    console.log("====================================");
    console.log("recupertation du parcours id pour test ");
    console.log("====================================");
    console.log(parcoursId);
    console.log("====================================");
    console.log("====================================");
    // Récupération depuis IndexedDB en cas d'erreur
    const localData = await db.modules
      .where("parcour")
      .equals(Number(parcoursId))
      .filter((module) => module.nom.includes(search))
      .offset((page - 1) * 5)
      .limit(5)
      .toArray();

    const totalLocalDataCount = await db.modules
      .where("parcour")
      .equals(Number(parcoursId))
      .filter((module) => module.nom.includes(search))
      .count();

    console.log("====================================");
    console.log("after localData ");
    console.log("====================================");
    console.log(localData);
    console.log("====================================");
    console.log("====================================");
    return {
      data: localData,
      totalPages: Math.ceil(totalLocalDataCount / 5),
    };
  }
};
/***************************************************************************************/
// export const createModule = async (moduleData, token) => {
//   if (!navigator.onLine) {
//     const newData = {
//       ...moduleData,
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//     };
//     try {
//       const id = await db.modules.add(newData);
//       await db.offlineChanges.add({
//         type: "add",
//         data: { id, ...newData },
//         timestamp: Date.now(),
//       });
//       return { status: "offline" };
//     } catch (error) {
//       console.error("Error adding data to IndexedDB:", error);
//       throw error;
//     }
//   }

//   try {
//     const newData = {
//       ...moduleData,
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//     };
//     const response = await axios.post(
//       `${API_BASE_URL}/modules`,
//       { data: newData },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     try {
//       await db.modules.add({ id: response.data.data.id, ...newData });
//     } catch (error) {
//       console.error("Error adding data to IndexedDB:", error);
//       throw error;
//     }

//     return response.data;
//   } catch (error) {
//     console.error("Error creating module:", error);
//     throw error;
//   }
// };

// Fonction pour créer un module
export const createModule = async (moduleData, token) => {
  console.log("====================================");
  console.log("this is the module ");
  console.log(moduleData);

  console.log("====================================");
  const newData = {
    nom: moduleData.nom,
    parcour: Number(moduleData.parcour),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  console.log("Creating module:", newData);

  if (!navigator.onLine) {
    try {
      const id = await db.transaction(
        "rw",
        [db.modules, db.offlineChanges],
        async () => {
          const id = await db.modules.add(newData);
          await db.offlineChanges.add({
            type: "add",
            dataBase: "module",
            data: { id, ...newData },
            timestamp: Date.now(),
          });
          console.log("Offline create added to offlineChanges:", newData);
          return id;
        }
      );
      return { status: "offline", data: { id, ...newData } };
    } catch (error) {
      console.error("Error adding data to IndexedDB:", error);
      throw error;
    }
  } else {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/modules`,
        { data: newData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await db.transaction("rw", [db.modules], async () => {
        await db.modules.add({ id: response.data.data.id, ...newData });
      });

      console.log(
        "Module created online and added to IndexedDB:",
        response.data.data
      );
      return { status: "success", data: response.data.data };
    } catch (error) {
      console.error("Error creating module:", error);
      throw error;
    }
  }
};
/*******************************************************************************************************************/

export const updateModule = async (id, moduleData, token) => {
  const updatedData = {
    ...moduleData,
    updatedAt: new Date().toISOString(),
  };

  if (!navigator.onLine) {
    try {
      await db.modules.update(Number(id), updatedData);
      await db.offlineChanges.add({
        type: "update",
        dataBase: "module",
        data: { id, ...updatedData },
        timestamp: Date.now(),
      });
      return { status: "offline", data: updatedData };
    } catch (error) {
      console.error("Error updating data in IndexedDB:", error);
      throw error;
    }
  } else {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/modules/${id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      try {
        await db.modules.update(Number(id), updatedData);
      } catch (error) {
        console.error("Error updating data in IndexedDB:", error);
        throw error;
      }

      return { status: "success", data: response.data.data };
    } catch (error) {
      console.error("Error updating module:", error);
      throw error;
    }
  }
};

export const deleteModule = async (id, token) => {
  if (!navigator.onLine) {
    try {
      await db.modules.delete(id);
      await db.offlineChanges.add({
        type: "delete",
        dataBase: "module",

        data: { id },
        timestamp: Date.now(),
      });
      return { status: "offline" };
    } catch (error) {
      console.error("Error deleting data in IndexedDB:", error);
      throw error;
    }
  }

  try {
    const response = await axios.delete(`${API_BASE_URL}/modules/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    try {
      await db.modules.delete(id);
    } catch (error) {
      console.error("Error deleting data in IndexedDB:", error);
      throw error;
    }

    return { status: "success", data: response.data };
  } catch (error) {
    console.error("Error deleting module:", error);
    throw error;
  }
};
/*************************************************************************************************************/
/*************************************************************************************************************/
export const syncOfflineChangesModule = async (token, queryClient, change) => {
  try {
    console.log("====================================");
    console.log(" this is changee dataa change");
    console.log(change);

    console.log("====================================");
    const data = change.data;
    if (change.type === "add") {
      const response = await axios.post(
        `${API_BASE_URL}/modules`,
        { data },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("====================================");
      console.log("response.data.data");
      console.log(response.data.data);

      console.log("====================================");
      await db.modules.put(response.data.data);
      queryClient.setQueryData(["modules"], (oldData) => {
        return {
          ...oldData,
          data: [...oldData.data, response.data.data],
        };
      });
    } else if (change.type === "update") {
      const remoteData = await axios
        .get(`${API_BASE_URL}/modules/${data.id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => response.data);

      const resolvedData = handleConflict(data, remoteData.data);
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
      queryClient.setQueryData(["modules"], (oldData) => {
        return {
          ...oldData,
          data: oldData.data.map((item) =>
            item.id === resolvedData.id ? resolvedData : item
          ),
        };
      });
    } else if (change.type === "delete") {
      await axios.delete(`${API_BASE_URL}/modules/${data.id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      await db.modules.delete(data.id);
      queryClient.setQueryData(["modules"], (oldData) => {
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

/*************************************************************************************************************************/

// export const syncOfflineChangesModule = async (token, queryClient) => {
//   const offlineChanges = await db.offlineChanges.toArray();

//   for (const change of offlineChanges) {
//     try {
//       if (change.type === "add") {
//         const response = await axios.post(
//           `${API_BASE_URL}/modules`,
//           { data: change.data },
//           {
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         console.log("====================================");
//         console.log("I AM HEERRR MOTHER FUCCKKERRRR");
//         console.log("====================================");
//         console.log(response.data.data);
//         console.log("====================================");
//         await db.modules.put(response.data.data);
//         queryClient.setQueryData(["modules"], (oldData) => {
//           return {
//             ...oldData,
//             data: [...oldData.data, response.data.data],
//           };
//         });
//         console.log("====================================");
//       } else if (change.type === "update") {
//         const remoteData = await axios
//           .get(`${API_BASE_URL}/modules/${change.data.id}`, {
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//           })
//           .then((response) => response.data);

//         const resolvedData = handleConflict(change.data, remoteData.data);

//         const response = await axios.put(
//           `${API_BASE_URL}/modules/${resolvedData.id}`,
//           resolvedData,
//           {
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         console.log("this is response");
//         console.log(response);
//         await db.modules.update(resolvedData.id, resolvedData);
//         queryClient.setQueryData(["modules"], (oldData) => {
//           return {
//             ...oldData,
//             data: oldData.data.map((item) =>
//               item.id === resolvedData.id ? resolvedData : item
//             ),
//           };
//         });
//       } else if (change.type === "delete") {
//         await axios.delete(`${API_BASE_URL}/modules/${change.data.id}`, {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         await db.modules.delete(change.data.id);
//         queryClient.setQueryData(["modules"], (oldData) => {
//           return {
//             ...oldData,
//             data: oldData.data.filter((item) => item.id !== change.data.id),
//           };
//         });
//       }

//       // Supprimer l'élément traité de offlineChanges
//       await db.offlineChanges.delete(change.id);
//     } catch (error) {
//       console.error("Error syncing change:", change, error);
//     }
//   }
// };
/***************************************************************************************************************/
// export const syncOfflineChangesModule = async (token, queryClient) => {
//   const offlineChanges = await db.offlineChanges.toArray();

//   for (const change of offlineChanges) {
//     try {
//       if (change.type === "add") {
//         const response = await axios.post(
//           `${API_BASE_URL}/modules`,
//           { data: change.data },
//           {
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         console.log("====================================");
//         console.log("I AM HEERRR MOTHER FUCCKKERRRR");
//         console.log("====================================");
//         console.log(response.data.data);
//         console.log("====================================");
//         await db.modules.put(response.data.data);
//         queryClient.setQueryData(["modules"], (oldData) => {
//           return {
//             ...oldData,
//             data: [...oldData.data, response.data.data],
//           };
//         });
//         console.log("====================================");
//         /*********************************************************************************/
//         /***************************************************************************************/
//       } else if (change.type === "update") {
//         const remoteData = await axios
//           .get(`${API_BASE_URL}/modules/${change.data.id}`, {
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//           })
//           .then((response) => response.data);

//         const resolvedData = handleConflict(change.data, remoteData.data);

//         // Use resolvedData directly instead of resolvedData.data
//         const response = await axios.put(
//           `${API_BASE_URL}/modules/${resolvedData.id}`,
//           resolvedData,
//           {
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         console.log("this is response");
//         console.log(response);
//         await db.modules.update(resolvedData.id, resolvedData);
//         queryClient.setQueryData(["modules"], (oldData) => {
//           return {
//             ...oldData,
//             data: oldData.data.map((item) =>
//               item.id === resolvedData.id ? resolvedData : item
//             ),
//           };
//         });
//       } else if (change.type === "delete") {
//         await axios.delete(`${API_BASE_URL}/modules/${change.data.id}`, {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         await db.modules.delete(change.data.id);
//         queryClient.setQueryData(["modules"], (oldData) => {
//           return {
//             ...oldData,
//             data: oldData.data.filter((item) => item.id !== change.data.id),
//           };
//         });
//       }
//             await db.offlineChanges.delete(change.id);

//     } catch (error) {
//       console.error("Error syncing change:", change, error);
//     }
//   }
//   // await db.offlineChanges.clear();
// };
