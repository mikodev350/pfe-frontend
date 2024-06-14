import axios from "axios";
import { API_BASE_URL } from "../constants/constante";

export const fetchSelfById = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response);

    if (response.status === 404) {
      return null;
    }

    if (response.status < 200 || response.status >= 300) {
      throw new Error(`Request failed with status: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error;
  }
};

export const updateUserById = async (id, userData, token) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/users/${id}`, userData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status < 200 || response.status >= 300) {
      throw new Error(`Request failed with status: ${response.status}`);
    }
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

/*************change the password **************/

export const changePassword = async (
  currentPassword,
  newPassword,
  passwordConfirmation,
  token
) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/change-password`,
      {
        currentPassword: currentPassword,
        password: newPassword,
        passwordConfirmation: passwordConfirmation,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status < 200 || response.status >= 300) {
      throw new Error(`Request failed with status: ${response.status}`);
    }

    // Password change was successful
    return response.data;
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
};
