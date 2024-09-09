import axios from "axios";
import { getToken } from "../util/authUtils";

const API_BASE_URL = "http://localhost:1337/api";

export const fetchStudents = async (searchValue = "", token) => {
  const params = {};

  if (searchValue) {
    params._q = searchValue; // Ajouter le paramètre de recherche si fourni
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/get-all-students`, {
      headers: {
        Authorization: `Bearer ${token}`, // Ajoutez le token pour l'autorisation
      },
      params,
    });
    console.log("response.data.students");

    console.log(response.data.students);

    return response.data.students; // Retourne la liste des étudiants
  } catch (error) {
    console.error("Failed to fetch students:", error);
    throw error;
  }
};

export const createGroup = async (groupData, token) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/groups`, groupData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.group;
  } catch (error) {
    console.error("Failed to create group:", error);
    throw error;
  }
};

export const updateGroup = async (id, groupData, token) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/groups/${id}`,
      groupData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.updatedGroup;
  } catch (error) {
    console.error("Failed to update group:", error);
    throw error;
  }
};

export const fetchGroups = async (token, searchValue = "") => {
  try {
    const params = {};

    if (searchValue) {
      params._q = searchValue; // Ajoute le paramètre de recherche si fourni
    }

    const response = await axios.get(`${API_BASE_URL}/groups`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params, // Passe les paramètres de recherche à la requête
    });

    return response.data.groups;
  } catch (error) {
    console.error("Failed to fetch groups:", error);
    throw error;
  }
};

export const fetchGroupById = async (id, token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/groups/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.group;
  } catch (error) {
    console.error("Failed to fetch group:", error);
    throw error;
  }
};

export const deleteGroup = async (id, token) => {
  try {
    await axios.delete(`${API_BASE_URL}/groups/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { message: "Group deleted successfully" };
  } catch (error) {
    console.error("Failed to delete group:", error);
    throw error;
  }
};

/***************************************************************************************/
/*******************fetchee notesss for teacher aand studentt ********************/
export const fetchNotes = async () => {
  const token = getToken();
  try {
    const response = await fetch(
      "http://localhost:1337/api/assignations-custom/notes",
      {
        headers: {
          Authorization: `Bearer ${token}`, // Ajoute le token si nécessaire
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des notes");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur dans fetchNotes:", error);
    throw error;
  }
};

/**************************************************************************************/
export const fetchRecentResources = async () => {
  try {
    const token = getToken();

    const response = await fetch(
      "http://localhost:1337/api/assignations-custom/recent",
      {
        headers: {
          Authorization: `Bearer ${token}`, // Ajoutez le token si nécessaire
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        "Erreur lors de la récupération des assignations récentes"
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur dans fetchRecentAssignments:", error);
    throw error;
  }
};
