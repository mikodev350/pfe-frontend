import axios from "axios";
import { getToken } from "../util/authUtils";

const API_BASE_URL = "http://localhost:1337/api";

/*********************************************/

// Fetch all AnswerHistories
export const fetchAnswerHistories = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/answer-histories`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des AnswerHistories :",
      error
    );
    throw error;
  }
};

/*********************************************/

// Fetch a single AnswerHistory by ID
export const fetchAnswerHistoryById = async (id, token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/answer-histories/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'AnswerHistory :", error);
    throw error;
  }
};

/*********************************************/

// Create a new AnswerHistory
export const createAnswerHistory = async (answerHistoryData, token) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/answer-histories`,
      answerHistoryData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création de l'AnswerHistory :", error);
    throw error;
  }
};

/*********************************************/

export const checkDevoir = async (devoirId, token) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/reponse-etudiants/checkDevoir`,
      {
        params: {
          devoirId,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error checking devoir:", error);
    throw error;
  }
};
/*************************/
export const putDevoir = async (devoirId, answerHistoryData, token) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/reponse-etudiants/putDevoir?devoirId=${devoirId}`,
      answerHistoryData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du devoir :", error);
    throw error;
  }
};
/*********************************************/
export const fetchFilteredAnswerHistories = async (params) => {
  const token = getToken();
  const response = await axios.get(
    `${API_BASE_URL}/reponse-etudiants/filtered`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    }
  );

  console.log("response.data");

  console.log(response.data);

  return response.data;
};

/***************************************************************************/
export const sendAssignationNote = async (assignationId, note) => {
  try {
    // Récupérer le token pour l'authentification
    const token = getToken();

    // Préparer les données à envoyer
    const data = {
      assignationId: assignationId,
      note: note,
    };

    console.log("Données envoyées :", data);

    // Envoyer la requête POST pour assigner la note
    const response = await axios.post(
      `${API_BASE_URL}/assignations-custom/note`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      console.log("Note assignée avec succès:", response.data);
    } else {
      console.error("Erreur lors de l'assignation de la note:", response.data);
    }
  } catch (error) {
    console.error("Erreur lors de l'envoi de la requête:", error);
    throw error;
  }
};
