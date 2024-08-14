import axios from "axios";

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
/*********************************************/
