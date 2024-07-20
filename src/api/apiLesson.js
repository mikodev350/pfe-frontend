import axios from "axios";
import { API_BASE_URL } from "../constants/constante";
import db from "../database/database";

// Gestion des conflits de données entre IndexedDB et le serveur
const handleConflict = (localData, remoteData) => {
  return new Date(localData.updatedAt) > new Date(remoteData.updatedAt)
    ? localData
    : remoteData;
};

// Ajout ou mise à jour des leçons dans IndexedDB
const addOrUpdateLessonInIndexedDB = async (lesson) => {
  const existingLesson = await db.lessons.get(lesson.id);
  if (!existingLesson) {
    await db.lessons.put({
      id: lesson.id,
      nom: lesson.nom,
      module: lesson.module ? lesson.module : null,
      updatedAt: lesson.updatedAt,
      createdAt: lesson.createdAt,
      version: lesson.version || 1,
    });
  } else {
    await db.lessons.update(lesson.id, lesson);
  }
};

// Fonction pour récupérer les leçons
export const fetchLessons = async (page, token, search = "", moduleId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/lessons`, {
      params: {
        _page: page,
        _limit: 5,
        _q: search,
        module: moduleId,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    await db.transaction("rw", db.lessons, async () => {
      for (const lesson of response.data.data) {
        await addOrUpdateLessonInIndexedDB(lesson);
      }
    });

    return {
      data: response.data.data,
      totalPages: Math.ceil(response.data.meta.pagination.total / 5),
    };
  } catch (error) {
    console.error("Error fetching lessons:", error);

    const localData = await db.lessons
      .where("module")
      .equals(Number(moduleId))
      .filter((lesson) => lesson.nom.includes(search))
      .offset((page - 1) * 5)
      .limit(5)
      .toArray();

    const totalLocalDataCount = await db.lessons
      .where("module")
      .equals(Number(moduleId))
      .filter((lesson) => lesson.nom.includes(search))
      .count();

    return {
      data: localData,
      totalPages: Math.ceil(totalLocalDataCount / 5),
    };
  }
};

// Fonction pour créer une leçon
export const createLesson = async (lessonData, token) => {
  const newData = {
    nom: lessonData.nom,
    module: Number(lessonData.module),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  console.log("Creating lesson:", newData);

  if (!navigator.onLine) {
    try {
      const id = await db.transaction(
        "rw",
        [db.lessons, db.offlineChanges],
        async () => {
          const id = await db.lessons.add(newData);
          await db.offlineChanges.add({
            type: "add",
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
        `${API_BASE_URL}/lessons`,
        { data: newData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await db.transaction("rw", [db.lessons], async () => {
        await db.lessons.add({ id: response.data.data.id, ...newData });
      });

      console.log(
        "Lesson created online and added to IndexedDB:",
        response.data.data
      );
      return { status: "success", data: response.data.data };
    } catch (error) {
      console.error("Error creating lesson:", error);
      throw error;
    }
  }
};

// Fonction pour mettre à jour une leçon
export const updateLesson = async (id, lessonData, token) => {
  const updatedData = {
    ...lessonData,
    updatedAt: new Date().toISOString(),
  };

  console.log("Updating lesson:", updatedData);

  if (!navigator.onLine) {
    try {
      await db.transaction("rw", [db.lessons, db.offlineChanges], async () => {
        const existingLesson = await db.lessons.get(Number(id));
        if (existingLesson) {
          console.log("Existing lesson found in IndexedDB:", existingLesson);
          await db.lessons.update(Number(existingLesson.id), {
            id: existingLesson.id,
            module: existingLesson.module,
            updatedAt: updatedData.updatedAt,
            nom: updatedData.nom,
          });
          console.log("Lesson updated in IndexedDB:", updatedData);

          await db.offlineChanges.add({
            type: "update",
            data: { id, ...updatedData },
            timestamp: Date.now(),
          });
          console.log("Offline update added to offlineChanges:", updatedData);
        } else {
          console.error("Lesson not found in IndexedDB for update:", id);
        }
      });

      return { status: "offline", data: updatedData };
    } catch (error) {
      console.error("Error updating data in IndexedDB:", error);
      throw error;
    }
  } else {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/lessons/${id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await db.transaction("rw", [db.lessons], async () => {
        const existingLesson = await db.lessons.get(Number(id));
        if (existingLesson) {
          console.log(
            "Existing lesson found in IndexedDB for online update:",
            existingLesson
          );
          await db.lessons.update(Number(id), updatedData);
          console.log(
            "Lesson updated in IndexedDB after online update:",
            updatedData
          );
        } else {
          console.error("Lesson not found in IndexedDB for update:", id);
        }
      });

      console.log("Lesson updated online:", response.data.data);
      return { status: "success", data: response.data.data };
    } catch (error) {
      console.error("Error updating lesson:", error);
      throw error;
    }
  }
};

export const deleteLesson = async (id, token) => {
  if (!navigator.onLine) {
    try {
      await db.transaction("rw", [db.lessons, db.offlineChanges], async () => {
        const existingLesson = await db.lessons.get(Number(id));
        if (existingLesson) {
          console.log("Existing lesson found in IndexedDB:", existingLesson);
          await db.lessons.delete(Number(id));
          console.log("Lesson deleted in IndexedDB:", id);

          await db.offlineChanges.add({
            type: "delete",
            data: { id },
            timestamp: Date.now(),
          });
          console.log("Offline delete added to offlineChanges:", id);
        } else {
          console.error("Lesson not found in IndexedDB for delete:", id);
        }
      });

      return { status: "offline", data: { id } };
    } catch (error) {
      console.error("Error deleting data in IndexedDB:", error);
      throw error;
    }
  } else {
    try {
      const response = await axios.delete(`${API_BASE_URL}/lessons/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await db.transaction("rw", [db.lessons], async () => {
        const existingLesson = await db.lessons.get(Number(id));
        if (existingLesson) {
          console.log(
            "Existing lesson found in IndexedDB for online delete:",
            existingLesson
          );
          await db.lessons.delete(Number(id));
          console.log("Lesson deleted in IndexedDB after online delete:", id);
        } else {
          console.error("Lesson not found in IndexedDB for delete:", id);
        }
      });

      console.log("Lesson deleted online:", response.data);
      return { status: "success", data: response.data };
    } catch (error) {
      console.error("Error deleting lesson:", error);
      throw error;
    }
  }
};
/// Fonction pour synchroniser les changements hors ligne
export const syncOfflineChangesLesson = async (token, queryClient) => {
  const offlineChanges = await db.offlineChanges.toArray();
  console.log("Syncing offline changes:", offlineChanges);

  for (const change of offlineChanges) {
    try {
      if (change.type === "add") {
        const response = await axios.post(
          `${API_BASE_URL}/lessons`,
          { data: change.data },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        await db.transaction("rw", [db.lessons], async () => {
          await db.lessons.put(response.data.data);
        });

        queryClient.setQueryData(["lessons"], (oldData) => {
          return {
            ...oldData,
            data: [...oldData.data, response.data.data],
          };
        });

        console.log("Lesson added and synced online:", response.data.data);
      } else if (change.type === "update") {
        const remoteData = await axios
          .get(`${API_BASE_URL}/lessons/${change.data.id}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => response.data);

        const resolvedData = handleConflict(change.data, remoteData.data);

        const response = await axios.put(
          `${API_BASE_URL}/lessons/${resolvedData.id}`,
          resolvedData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        await db.transaction("rw", [db.lessons], async () => {
          const existingLesson = await db.lessons.get(Number(resolvedData.id));
          if (existingLesson) {
            await db.lessons.update(resolvedData.id, resolvedData);
            console.log(
              "Lesson updated in IndexedDB after sync:",
              resolvedData
            );
          } else {
            console.error(
              "Lesson not found in IndexedDB for update after sync:",
              resolvedData.id
            );
          }
        });

        queryClient.setQueryData(["lessons"], (oldData) => {
          return {
            ...oldData,
            data: oldData.data.map((item) =>
              item.id === resolvedData.id ? resolvedData : item
            ),
          };
        });
      } else if (change.type === "delete") {
        await axios.delete(`${API_BASE_URL}/lessons/${change.data.id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        await db.transaction("rw", [db.lessons], async () => {
          const existingLesson = await db.lessons.get(Number(change.data.id));
          if (existingLesson) {
            await db.lessons.delete(Number(change.data.id));
            console.log(
              "Lesson deleted in IndexedDB after sync:",
              change.data.id
            );
          } else {
            console.error(
              "Lesson not found in IndexedDB for delete after sync:",
              change.data.id
            );
          }
        });

        queryClient.setQueryData(["lessons"], (oldData) => {
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
