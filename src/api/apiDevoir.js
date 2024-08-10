import axios from "axios";

const API_BASE_URL = "http://localhost:1337/api";

export const fetchDevoirs = async (page, pageSize, searchValue, token) => {
  const params = {
    _page: page,
    _limit: pageSize,
    _q: searchValue,
  };

  const response = await axios.get(`${API_BASE_URL}/devoirs`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params,
  });

  return response.data;
};

export const createDevoir = async (devoir, token) => {
  const response = await axios.post(`${API_BASE_URL}/devoirs`, devoir, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateDevoir = async (id, devoir, token) => {
  const response = await axios.put(`${API_BASE_URL}/devoirs/${id}`, devoir, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteDevoir = async (id, token) => {
  const response = await axios.delete(`${API_BASE_URL}/devoirs/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const fetchDevoirById = async (id, token) => {
  console.log(token);
  const response = await axios.get(`${API_BASE_URL}/devoirs/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
