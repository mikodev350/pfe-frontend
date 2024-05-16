// Function to check if the user is authenticated by checking the stored role
export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  // If a token is present, check if the role is 'STUDENT' or 'TEACHER'
  return token && (role === "STUDENT" || role === "TEACHER");
};

// Function to retrieve the user type from localStorage
export const getUserType = () => {
  // Retrieve the role from localStorage
  return localStorage.getItem("role");
};

// Function to get the stored token
export const getToken = () => {
  return localStorage.getItem("token");
};
