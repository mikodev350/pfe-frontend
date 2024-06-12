import axios from "axios";
import { API_BASE_URL } from "../constants/constante";

export const sendFriendRequest = async (recipientId, token) => {
  const response = await axios.post(
    `${API_BASE_URL}/relation`,
    { recipientId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
export const cancelFriendRequest = async (recipientId, token) => {
  const response = await axios.delete(
    `${API_BASE_URL}/relation/${recipientId}`,

    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const acceptFriendRequest = async (recipientId, token) => {
  const response = await axios.put(
    `${API_BASE_URL}/relation`,
    { recipientId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
