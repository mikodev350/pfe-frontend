import axios from "axios";

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

    return response.data.students; // Retourne la liste des étudiants
  } catch (error) {
    console.error("Failed to fetch students:", error);
    throw error;
  }
};
