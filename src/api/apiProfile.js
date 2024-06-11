import axios from "axios";

import { API_BASE_URL } from "../constants/constante";

export const createEducation = async (educationData, token) => {
  const response = await axios.post(
    `${API_BASE_URL}/educations`,
    educationData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const createExperience = async (experienceData, token) => {
  const response = await axios.post(
    `${API_BASE_URL}/experiences`,
    experienceData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

/*****************************************************************************************/

export const getEducations = async (token) => {
  const response = await axios.get(`${API_BASE_URL}/educations`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getExperiences = async (token) => {
  const response = await axios.get(`${API_BASE_URL}/experiences`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
/******************************************************/
export const deleteEducation = async (id, token) => {
  const response = await axios.delete(`${API_BASE_URL}/educations/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteExperience = async (id, token) => {
  const response = await axios.delete(`${API_BASE_URL}/experiences/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
/*********************************************************************************************/

// Fonction pour mettre à jour une expérience
export const updateExperience = async (id, data, token) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/experiences/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating experience", error);
    throw error;
  }
};

// Fonction pour mettre à jour une éducation
export const updateEducation = async (id, data, token) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/educations/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating education", error);
    throw error;
  }
};

/***********************************************************************************************/
// Fonction pour obtenir la liste des éducations

// Fonction pour obtenir une seule éducation par ID
export const getEducation = async (id, token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/educations/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching education", error);
    throw error;
  }
};

export const getExperience = async (id, token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/experiences/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching experience", error);
    throw error;
  }
};

/*************************************************************************/
export const fetchUserProfile = async (idUser, token) => {
  const response = await axios.get(`${API_BASE_URL}/find-profile/${idUser}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const fetchMyProfile = async (token) => {
  const response = await axios.get(`${API_BASE_URL}/get-my-profile/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
