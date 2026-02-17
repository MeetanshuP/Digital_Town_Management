const axios = require("axios");

exports.getNearbyEvents = async (req, res) => {
    try {
        const { lat, lng } = req.body;

        if (!lat || !lng) {
            return res.status(400).json({
                message: "Latitude and Longitude are required"
            });
        }

        // Reverse geocoding using OpenStreetMap (FREE)
        const geoRes = await axios.get(
            "https://nominatim.openstreetmap.org/reverse",
            {
                params: {
                    lat,
                    lon: lng,
                    format: "json"
                }
            }
        );

        const city =
            geoRes.data.address.city ||
            geoRes.data.address.town ||
            geoRes.data.address.state;

        if (!city) {
            return res.status(400).json({
                message: "Unable to detect city"
            });
        }

        // Fetch events from Eventbrite
        const eventRes = await axios.get(
            "https://www.eventbriteapi.com/v3/events/search/",
            {
                headers: {
                    Authorization: `Bearer ${process.env.EVENTBRITE_API_KEY}`
                },
                params: {
                    "location.address": city,
                    "location.within": "50km",
                    sort_by: "date",
                    expand: "venue"
                }
            }
        );

        const events = eventRes.data.events || [];

        const formattedEvents = events.map(event => ({
            id: event.id,
            title: event.name?.text,
            description: event.description?.text,
            date: event.start?.local,
            venue: event.venue?.name,
            address: event.venue?.address?.localized_address_display,
            sourceUrl: event.url,
            source: "Eventbrite"
        }));

        return res.status(200).json(formattedEvents);

    } catch (error) {
        console.error("Eventbrite Error:", error.response?.data || error.message);

        return res.status(500).json({
            message: "Failed to fetch nearby events"
        });
    }
};
