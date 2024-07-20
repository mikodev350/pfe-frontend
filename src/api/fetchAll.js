// src/api/fetchAll.js
import axios from "axios";
import { API_BASE_URL } from "../constants/constante";

export const fetchAllData = async (page, limit, query, token) => {
  const response = await axios.get(`${API_BASE_URL}/fetch-all/parcours-data`, {
    params: {
      _page: page,
      _limit: limit,
      _q: query,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
