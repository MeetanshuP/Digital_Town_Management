const axios = require("axios");

/**
 * Reverse geocode latitude & longitude
 * Returns normalized location data
 */
const getLocationFromCoordinates = async (lat, lon) => {
    if (!lat || !lon) {
        throw new Error("Latitude and longitude are required");
    }

    try {
        const response = await axios.get(
            "https://nominatim.openstreetmap.org/reverse",
            {
                params: {
                    lat,
                    lon,
                    format: "json"
                },
                headers: {
                    "User-Agent": "DigitalTownManagement/1.0 (student-project)"
                }
            }
        );

        const address = response.data.address || {};

        return {
            city:
                address.city ||
                address.town ||
                address.village ||
                null,
            state: address.state || null,
            country: address.country || null,
            postcode: address.postcode || null
        };

    } catch (error) {
        console.error("Location Service Error:", error.message);
        throw new Error("Failed to reverse geocode location");
    }
};

module.exports = {
    getLocationFromCoordinates
};
