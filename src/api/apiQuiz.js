// src/api/fetchAll.js
import axios from "axios";
import { API_BASE_URL } from "../constants/constante";

export const postQuiz = async ({ token, form }) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const data = form;

  const response = await axios.post(`${API_BASE_URL}/quiz`, data, config);

  return response.data;
};
export const getQuiz = async ({ token, id }) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(`${API_BASE_URL}/quiz/${id}`, config);

  return response.data;
};

export const getQuizTest = async ({ token, id }) => {
  alert("Please enter");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(`${API_BASE_URL}/take-quiz/${id}`, config);

  return response.data;
};

export const getQuizzes = async ({ token }) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(`${API_BASE_URL}/my-quizzes`, config);

  return response.data;
};

export const deleteQuiz = async ({ token, id }) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/quiz/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to delete quiz", error);
    throw error;
  }
};
