import axios from "axios";
import { API_BASE_URL } from "../constants/constante";
import db from "../database/database";

// Gestion des conflits de données entre IndexedDB et le serveur
const handleConflict = (localData, remoteData) => {
  return new Date(localData.updatedAt) > new Date(remoteData.updatedAt)
    ? localData
    : remoteData;
};

// Ajout ou mise à jour des ressources dans IndexedDB
const addOrUpdateResourceInIndexedDB = async (resource) => {
  const existingResource = await db.resources.get(resource.id);
  if (!existingResource) {
    await db.resources.put({
      id: resource.id,
      nom: resource.nom,
      format: resource.format,
      parcours: resource.parcours ? resource.parcours : null,
      modules: resource.modules ? resource.modules : null,
      lessons: resource.lessons ? resource.lessons : null,
      note: resource.note,
      images: resource.images,
      audio: resource.audio,
      pdf: resource.pdf,
      video: resource.video,
      link: resource.link,
      referenceLivre: resource.referenceLivre,
      updatedAt: resource.updatedAt,
      createdAt: resource.createdAt,
    });
  } else {
    await db.resources.update(resource.id, resource);
  }
};

// Fonction pour récupérer les ressources
export const fetchResources = async (page, pageSize, sectionId, searchValue, token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/resources`, {
      params: {
        page,
        pageSize,
        _q: searchValue,
        section: sectionId,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    await db.transaction("rw", db.resources, async () => {
      for (const resource of response.data.data) {
        await addOrUpdateResourceInIndexedDB(resource);
      }
    });

    return {
      data: response.data.data,
      totalPages: Math.ceil(response.data.total / pageSize),
    };
  } catch (error) {
    console.error("Error fetching resources:", error);

    const localData = await db.resources
      .filter((resource) => resource.nom.includes(searchValue))
      .offset((page - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    const totalLocalDataCount = await db.resources
      .filter((resource) => resource.nom.includes(searchValue))
      .count();

    return {
      data: localData,
      totalPages: Math.ceil(totalLocalDataCount / pageSize),
    };
  }
};

// Fonction pour créer une ressource
export const saveResource = async (resourceData, token) => {
  const newData = {
    ...resourceData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  console.log("Creating resource:", newData);

  if (!navigator.onLine) {
    try {
      const id = await db.transaction("rw", [db.resources, db.offlineChanges], async () => {
        const id = await db.resources.add(newData);
        await db.offlineChanges.add({
          type: "add",
          data: { id, ...newData },
          timestamp: Date.now(),
        });
        console.log("Offline create added to offlineChanges:", newData);
        return id;
      });
      return { status: "offline", data: { id, ...newData } };
    } catch (error) {
      console.error("Error adding data to IndexedDB:", error);
      throw error;
    }
  } else {
    try {
      const response = await axios.post(`${API_BASE_URL}/resources`, newData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      await db.transaction("rw", [db.resources], async () => {
        await db.resources.add({ id: response.data.data.id, ...newData });
      });

      console.log("Resource created online and added to IndexedDB:", response.data.data);
      return { status: "success", data: response.data.data };
    } catch (error) {
      console.error("Error creating resource:", error);
      throw error;
    }
  }
};

// Fonction pour mettre à jour une ressource
export const updateResource = async (id, data, token) => {
  const updatedData = {
    ...data,
    updatedAt: new Date().toISOString(),
  };

  console.log("Updating resource:", updatedData);

  if (!navigator.onLine) {
    try {
      await db.transaction("rw", [db.resources, db.offlineChanges], async () => {
        const existingResource = await db.resources.get(Number(id));
        if (existingResource) {
          console.log("Existing resource found in IndexedDB:", existingResource);
          await db.resources.update(Number(existingResource.id), {
            ...existingResource,
            ...updatedData,
          });
          console.log("Resource updated in IndexedDB:", updatedData);

          await db.offlineChanges.add({
            type: "update",
            data: { id, ...updatedData },
            timestamp: Date.now(),
          });
          console.log("Offline update added to offlineChanges:", updatedData);
        } else {
          console.error("Resource not found in IndexedDB for update:", id);
        }
      });

      return { status: "offline", data: updatedData };
    } catch (error) {
      console.error("Error updating data in IndexedDB:", error);
      throw error;
    }
  } else {
    try {
      const response = await axios.put(`${API_BASE_URL}/resources/${id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      await db.transaction("rw", [db.resources], async () => {
        const existingResource = await db.resources.get(Number(id));
        if (existingResource) {
          console.log("Existing resource found in IndexedDB for online update:", existingResource);
          await db.resources.update(Number(id), updatedData);
          console.log("Resource updated in IndexedDB after online update:", updatedData);
        } else {
          console.error("Resource not found in IndexedDB for update:", id);
        }
      });

      console.log("Resource updated online:", response.data);
      return { status: "success", data: response.data };
    } catch (error) {
      console.error("Error updating resource:", error);
      throw error;
    }
  }
};

// Fonction pour supprimer une ressource
export const deleteResource = async (id, token) => {
  if (!navigator.onLine) {
    try {
      await db.transaction("rw", [db.resources, db.offlineChanges], async () => {
        const existingResource = await db.resources.get(Number(id));
        if (existingResource) {
          console.log("Existing resource found in IndexedDB:", existingResource);
          await db.resources.delete(Number(id));
          console.log("Resource deleted in IndexedDB:", id);

          await db.offlineChanges.add({
            type: "delete",
            data: { id },
            timestamp: Date.now(),
          });
          console.log("Offline delete added to offlineChanges:", id);
        } else {
          console.error("Resource not found in IndexedDB for delete:", id);
        }
      });

      return { status: "offline", data: { id } };
    } catch (error) {
      console.error("Error deleting data in IndexedDB:", error);
      throw error;
    }
  } else {
    try {
      const response = await axios.delete(`${API_BASE_URL}/resources/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await db.transaction("rw", [db.resources], async () => {
        const existingResource = await db.resources.get(Number(id));
        if (existingResource) {
          console.log("Existing resource found in IndexedDB for online delete:", existingResource);
          await db.resources.delete(Number(id));
          console.log("Resource deleted in IndexedDB after online delete:", id);
        } else {
          console.error("Resource not found in IndexedDB for delete:", id);
        }
      });

      console.log("Resource deleted online:", response.data);
      return { status: "success", data: response.data };
    } catch (error) {
      console.error("Error deleting resource:", error);
      throw error;
    }
  }
};

// Fonction pour générer un lien de ressource
export const generateResourceLink = async (id, token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/resources-link/${id}/generate-link`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error generating resource link:", error);
    throw error;
  }
};

// Fonction pour récupérer une ressource par ID
export const getResourceById = async (id, token) => {
  try {
    if (!navigator.onLine) {
      console.log("Offline: Fetching resource from IndexedDB");
      const resource = await db.resources.get(Number(id));
      if (resource) {
        return resource;
      } else {
        throw new Error("Resource not found in IndexedDB");
      }
    }

    console.log("Online: Fetching resource from API");
    const response = await axios.get(`${API_BASE_URL}/resources/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching resource by ID:", error);
    throw error;
  }
};

// Fonction pour récupérer une ressource par token
export const getResourceByToken = async (resourceToken, tokenUser) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/resources-link/access/${resourceToken}`, {
      headers: {
        Authorization: `Bearer ${tokenUser}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching resource by token:", error);
    throw error;
  }
};

// Fonction pour cloner une ressource
export const cloneResource = async (id, token) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/resources-copy/clone/${id}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error cloning resource:", error);
    throw error;
  }
};

// Fonction pour synchroniser les changements hors ligne
export const syncOfflineChangesResource = async (token, queryClient) => {
  const offlineChanges = await db.offlineChanges.toArray();
  console.log("Syncing offline changes:", offlineChanges);

  for (const change of offlineChanges) {
    try {
      if (change.type === "add") {
        const response = await axios.post(`${API_BASE_URL}/resources`, change.data, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        await db.transaction("rw", [db.resources], async () => {
          await db.resources.put(response.data.data);
        });

        queryClient.setQueryData(["resources"], (oldData) => {
          return {
            ...oldData,
            data: [...oldData.data, response.data.data],
          };
        });

        console.log("Resource added and synced online:", response.data.data);
      } else if (change.type === "update") {
        const remoteData = await axios
          .get(`${API_BASE_URL}/resources/${change.data.id}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => response.data);

        const resolvedData = handleConflict(change.data, remoteData);

        const response = await axios.put(`${API_BASE_URL}/resources/${resolvedData.id}`, resolvedData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        await db.transaction("rw", [db.resources], async () => {
          const existingResource = await db.resources.get(Number(resolvedData.id));
          if (existingResource) {
            await db.resources.update(resolvedData.id, resolvedData);
            console.log("Resource updated in IndexedDB after sync:", resolvedData);
          } else {
            console.error("Resource not found in IndexedDB for update after sync:", resolvedData.id);
          }
        });

        queryClient.setQueryData(["resources"], (oldData) => {
          return {
            ...oldData,
            data: oldData.data.map((item) =>
              item.id === resolvedData.id ? resolvedData : item
            ),
          };
        });
      } else if (change.type === "delete") {
        await axios.delete(`${API_BASE_URL}/resources/${change.data.id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        await db.transaction("rw", [db.resources], async () => {
          const existingResource = await db.resources.get(Number(change.data.id));
          if (existingResource) {
            await db.resources.delete(Number(change.data.id));
            console.log("Resource deleted in IndexedDB after sync:", change.data.id);
          } else {
            console.error("Resource not found in IndexedDB for delete after sync:", change.data.id);
          }
        });

        queryClient.setQueryData(["resources"], (oldData) => {
          return {
            ...oldData,
            data: oldData.data.filter((item) => item.id !== change.data.id),
          };
        });
      }
    } catch (error) {
      console.error("Error syncing change:", change, error);
    }
  }
  await db.offlineChanges.clear();
  console.log("Offline changes cleared after sync");
};
