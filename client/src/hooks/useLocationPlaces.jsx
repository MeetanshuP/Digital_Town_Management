import { useState } from "react";
import axios from "../utils/axiosInstance";

const useNearbyPlaces = () => {

    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(false);
    const [location, setLocation] = useState(null);
    const [locationError, setLocationError] = useState("");

    const fetchNearbyPlaces = async (lat, lng, category = null) => {

        setLoading(true);

        try {
            const res = await axios.get("/places/nearby", {
                params: {
                    lat,
                    lng,
                    radius: 5000,
                    category: category !== "All" ? category : null
                }
            });

            setPlaces(res.data);

        } catch (err) {
            console.error(err);
            setLocationError("Failed to load nearby places");
        } finally {
            setLoading(false);
        }
    };

    const reverseGeocode = async (lat, lng) => {
        try {

            const geoRes = await axios.get(
                `/location/reverse-geocode?lat=${lat}&lon=${lng}`
            );

            const city = geoRes.data.city;

            setLocation(city || "Selected location");

        } catch (err) {

            console.error("Reverse geocode error:", err);
            setLocation("Selected location");

        }
    };

    const detectLocation = (successCallback, errorCallback) => {

        if (!navigator.geolocation) {
            setLocationError("Geolocation not supported");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            successCallback,
            errorCallback,
            { enableHighAccuracy: true }
        );
    };

    return {
        places,
        loading,
        location,
        locationError,
        fetchNearbyPlaces,
        reverseGeocode,
        detectLocation
    };
};

export default useNearbyPlaces;