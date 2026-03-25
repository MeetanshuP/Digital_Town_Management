import axios from "../utils/axiosInstance";

export const getNearbyPlaces = async (lat, lng, category = null, radius = 5000) => {
    const res = await axios.get("/places/nearby", {
        params: {
            lat,
            lng,
            radius,
            category: category !== "All" ? category : null
        }
    });

    return res.data;
};

export const reverseGeocode = async (lat, lng) => {
    const res = await axios.get(
        `/location/reverse-geocode?lat=${lat}&lon=${lng}`
    );

    return res.data;
};