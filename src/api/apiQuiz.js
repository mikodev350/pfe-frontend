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
