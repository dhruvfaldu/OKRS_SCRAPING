import axios from "axios";

const API = axios.create({
  baseURL: "http://3.111.193.73/api",
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // Ensure headers object exists
    config.headers = config.headers || {};

    // Add Authorization header
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    // Add ngrok header (must use bracket notation because of hyphens)
    config.headers["ngrok-skip-browser-warning"] = "true";

    return config;
  },
  (error) => Promise.reject(error)
);


export const getJobs = async () => {
  const res = await API.get("/scrape-jobs/list");
  return res.data;
};

export const createJob = async (data) => {
  const res = await API.post("/scrape-jobs", data);
  return res.data;
};

// export const updateJob = async (id, data) => {
//   const res = await API.put(`/jobs/${id}`, data);
//   return res.data;
// };

export const deleteJob = async (id) => {
  const res = await API.delete(`/scrape-jobs/${id}`);
  return res.data;
};

export const retryJob = async (id) => {
  const res = await API.post(`/scrape-jobs/${id}/retry`);
  return res.data;
};

export const getJobResults = async (id) => {
  const res = await API.get(`/scrape-jobs/${id}`);
  return res.data;
}

export default API;