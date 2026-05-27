import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

// REQUEST INTERCEPTOR
API.interceptors.request.use(
    (config) => {
        config.headers = config.headers || {};

        // token
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // ngrok header
        config.headers["ngrok-skip-browser-warning"] = "true";

        return config;
    },
    (error) => Promise.reject(error)
);

export default API;