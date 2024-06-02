import axios from 'axios';

import { API_BASE_URL } from "../constants/constante";

export const uploadFile = async (file, token) => {
  const formData = new FormData();
  formData.append('files', file);

  try {
    const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};