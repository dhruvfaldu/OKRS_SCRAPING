import API from "../api/sacrperApi";

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