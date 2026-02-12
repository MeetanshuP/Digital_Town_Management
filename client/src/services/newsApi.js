import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + "/api/news";

export const fetchLocationBasedNews = async ({
    lat,
    lon,
    category
}) => {
    const response = await axios.get(`${API_BASE_URL}/location`, {
        params: { lat, lon, category }
    });

    return response.data;
};
