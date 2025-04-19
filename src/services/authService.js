import axios from "axios";

const API_URL = `${"http://localhost:5000/api/auth"}`;

export const registerUser = async (userData) => {
    try {
        return await axios.post(`${API_URL}/register`, userData);
    } catch (error) {
        return error
    }
};

export const loginUser = async (userData) => {
    try {
        const res = await axios.post(`${API_URL}/login`, userData);
        localStorage.setItem("token", res.data.token);
        return res.data;
    } catch (error) {
        return error
    }
};

export const logoutUser = () => {
    localStorage.removeItem("token");
};
