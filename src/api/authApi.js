import axios from "axios";

const API = axios.create({
  baseURL: "https://moral-bullfrog-loyal.ngrok-free.app/api",
});


API.interceptors.request.use(
  (config) => {

    // Ensure headers object exists
    config.headers = config.headers || {};

    // Add ngrok header (must use bracket notation because of hyphens)
    config.headers["ngrok-skip-browser-warning"] = "true";

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