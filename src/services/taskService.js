import axios from "axios";

const API_URL = `${"http://localhost:5000/tasks"}`;

const getAuthHeaders = () => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        return token ? { Authorization: `${token}` } : {};
    }
    return {};
};

export const fetchTasks = async () => {
    try {
        const response = await axios.get(API_URL, { headers: getAuthHeaders() });
        return response.data;
    } catch (error) {
        throw error.response?.data || "Error fetching tasks";
    }
};

export const addTask = async (taskData) => {
    try {
        const response = await axios.post(API_URL, taskData, { headers: getAuthHeaders() });
        return response.data;
    } catch (error) {
        throw error.response?.data || "Error adding task";
    }
};

export const updateTask = async (id, taskData) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, taskData, { headers: getAuthHeaders() });
        return response.data;
    } catch (error) {
        throw error.response?.data || "Error updating task";
    }
};

export const deletetask = async (id) => {
    try {
        await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeaders() });
    } catch (error) {
        throw error.response?.data || "Error deleting task";
    }
};
