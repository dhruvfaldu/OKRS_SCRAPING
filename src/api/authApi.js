import axios from "axios";

const API = axios.create({
  baseURL: "https://db95-2a09-bac5-3e0c-16b4-00-243-9d.ngrok-free.app/api",
  // Send cookies
});

// Request Interceptor
API.interceptors.request.use(
  (config) => {
    config.headers = config.headers || {};

    // ngrok header
    config.headers["ngrok-skip-browser-warning"] = "true";

    // Add token if available
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// REGISTER
export const registerUser = async (data) => {
  const res = await API.post("/auth/register", data);
  return res.data;
};

// LOGIN
export const loginUser = async (data) => {
  const res = await API.post("/auth/login", data);
  return res.data;
};

// LOGOUT
export const logoutUser = async () => {
  const res = await API.post("/auth/logout");
  return res.data;
};

// FORGOT PASSWORD
export const forgotPassword = async (data) => {
  const res = await API.post("/auth/forgot-password", data);
  return res.data;
};

// RESET PASSWORD
export const resetPassword = async (data) => {
  const res = await API.post("/auth/reset-password", data);
  return res.data;
};

export default API;