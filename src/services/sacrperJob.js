import API from "../api/sacrperApi";

// GET JOBS
export const getJobs = async () => {
    const res = await API.get("/scrape-jobs/list");
    return res.data;
};

// CREATE JOB
export const createJob = async (data) => {
    const res = await API.post("/scrape-jobs", data);
    return res.data;
};

// DELETE JOB
export const deleteJob = async (id) => {
    const res = await API.delete(`/scrape-jobs/${id}`);
    return res.data;
};

// RETRY JOB
export const retryJob = async (id) => {
    const res = await API.post(`/scrape-jobs/${id}/retry`);
    return res.data;
};

// JOB RESULTS
export const getJobResults = async (id) => {
    const res = await API.get(`/scrape-jobs/${id}`);
    return res.data;
};