import axios from "../utils/axiosInstance";

export const getAllGrievances = () => {
    return axios.get("/grievances");
};

export const getGrievanceById = (id) => {
    return axios.get(`/grievances/${id}`);
};

export const createGrievance = (formData) => {
    return axios.post("/grievances", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
};

export const updateGrievance = (id, data) => {
    return axios.put(`/grievances/${id}`, data);
};

export const deleteGrievance = (id) => {
    return axios.delete(`/grievances/${id}`);
};