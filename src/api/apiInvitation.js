import axios from "axios";
import { API_BASE_URL } from "../constants/constante";
import { getToken } from "../util/authUtils";

export const fetchPendingInvitations = async () => {
  // Mock data
  const mockData = [
    {
      id: 1,
      sender: {
        username: "john_doe",
        email: "john@example.com",
      },
      token: "token123",
    },
    {
      id: 2,
      sender: {
        username: "jane_doe",
        email: "jane@example.com",
      },
      token: "token456",
    },
  ];

  // Simulate a delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData);
    }, 1000);
  });
};
export const fetchInvitations = async () => {
  const token = getToken();
  const response = await axios.get(`${API_BASE_URL}/pending-relations`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log("====================================");
  console.log(response.data);
  console.log("====================================");
  return response.data;
};
export const acceptInvitation = async (token) => {
  // Simulate accepting the invitation
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (token === "token123" || token === "token456") {
        resolve({ message: "Invitation accepted" });
      } else {
        reject(new Error("Invalid token"));
      }
    }, 1000);
  });
};
