import axios from "axios";
import { API_BASE_URL } from "../constants/constante";
import { toast } from "react-toastify";

// update the role
export const updateRole = async (type) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Token non trouvé. Veuillez vous reconnecter.");
    }

    const response = await axios.put(
      `${API_BASE_URL}/user-custom/update-role`,
      { type },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    localStorage.setItem("role", response.data.role.toUpperCase());
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const errorMessage =
        error.response.data.error.message || "Une erreur s'est produite";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } else {
      toast.error(error.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
    throw error;
  }
};

// API SignUp
export async function register(userData) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/local/register`,
      userData
    );
    localStorage.setItem("token", response.data.jwt);
    // console.log("====================================");
    // console.log(response.data.user.type);
    // console.log("====================================");
    // localStorage.setItem("role", response.data.user.type.toUpperCase());
    console.log(response);
    return { ...response.data };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const errorMessage =
        error.response.data.error.message || "Une erreur s'est produite";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } else {
      toast.error(error.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
    throw error;
  }
}

// API Login
export async function loginAPI(IdentifierData) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/local`,
      IdentifierData
    );

    alert("Success");
    localStorage.setItem("token", response.data.jwt);
    console.log("====================================");
    console.log(response.data.user.type.toUpperCase());
    console.log("====================================");
    localStorage.setItem("role", response.data.user.type.toUpperCase());
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const errorMessage =
        error.response.data.error.message || "Une erreur s'est produite";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } else {
      toast.error(error.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
    throw error;
  }
}
