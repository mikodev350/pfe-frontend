import axios from "axios";
import { API_BASE_URL } from "../constants/constante";

export const sendFriendRequest = async (recipientId, token) => {
  const response = await axios.post(
    `${API_BASE_URL}/invitations`,
    { recipientId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
