import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapPin, ExternalLink } from "lucide-react";

const NearbyEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchNearbyEvents = async (lat, lng) => {
            try {
                const res = await axios.post("/api/events/nearby", {
                    lat,
                    lng
                });

                setEvents(res.data);
            } catch (err) {
                console.error(err);
                setError("Failed to load nearby events");
            } finally {
                setLoading(false);
            }
        };

        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser");
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                fetchNearbyEvents(latitude, longitude);
            },
            () => {
                setError("Location permission denied");
                setLoading(false);
            }
        );
    }, []);

    if (loading) {
        return <div className="py-10 text-center">Loading nearby events...</div>;
    }

    if (error) {
        return <div className="py-10 text-center text-red-500">{error}</div>;
    }

    if (events.length === 0) {
        return (
            <div className="py-10 text-center text-gray-400">
                No nearby events found.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {events.map(event => (
                <div
                    key={event.id}
                    className="bg-white rounded-2xl p-6 shadow border border-gray-100"
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">
                                {event.title}
                            </h3>

                            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                <MapPin size={14} />
                                {event.venue}, {event.city}
                            </p>

                            <p className="text-sm text-gray-500 mt-1">
                                {event.date} {event.time}
                            </p>
                        </div>

                        <a
                            href={event.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-700 transition"
                        >
                            View Event <ExternalLink size={14} />
                        </a>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default NearbyEvents;
