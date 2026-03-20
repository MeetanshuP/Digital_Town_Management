import React, { useState, useEffect } from "react";
import { getNearbyPlaces, reverseGeocode } from "../services/placesApi";
import ServiceCard from "../components/ServiceCard";
import ServiceMap from "../components/ServiceMap";
import { PhoneCall } from "lucide-react";

const CITY_COORDS = {
    Ahmedabad: { lat: 23.0225, lng: 72.5714 },
    Gandhinagar: { lat: 23.2156, lng: 72.6369 },
    Surat: { lat: 21.1702, lng: 72.8311 }
};

const Services = () => {
    const [services, setServices] = useState([]);
    const [filteredServices, setFilteredServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeCategory, setActiveCategory] = useState("All");
    const [location, setLocation] = useState(null);
    const [locationError, setLocationError] = useState("");
    const [currentLatLng, setCurrentLatLng] = useState(CITY_COORDS.Gandhinagar);
    const [mapCenter, setMapCenter] = useState([23.2156, 72.6369]);
    const [selectedServiceId, setSelectedServiceId] = useState(null);
    const [selectedService, setSelectedService] = useState(null);

    const categories = ["All", "Health", "Education", "Government"];

    useEffect(() => {
        if (activeCategory === "All") {
            setFilteredServices(services);
        } else {
            setFilteredServices(
                services.filter((s) => s.category === activeCategory)
            );
        }
    }, [activeCategory, services]);

    useEffect(() => {
        if (!currentLatLng) return;

        fetchNearbyPlaces(
            currentLatLng.lat,
            currentLatLng.lng,
            activeCategory
        );
    }, [activeCategory, currentLatLng]);

    const handleUseLocation = () => {
        navigator.geolocation.getCurrentPosition(successLocation, errorLocation);
    };

    const successLocation = async (position) => {
        const { latitude, longitude } = position.coords;

        setCurrentLatLng({ lat: latitude, lng: longitude });
        setMapCenter([latitude, longitude]);

        try {
            const geoRes = await reverseGeocode(latitude, longitude);
            setLocation(geoRes.city || "Near you");

            await fetchNearbyPlaces(latitude, longitude, activeCategory);
        } catch {
            setLocationError("Failed to load nearby services");
        }
    };

    const errorLocation = () => {
        setLocationError("Location permission denied.");
    };

    const fetchNearbyPlaces = async (lat, lng, category = null) => {
        setLoading(true);
        try {
            const data = await getNearbyPlaces(lat, lng, category);
            setServices(data);
            setFilteredServices(data);
        } catch {
            setLocationError("Failed to load nearby services");
        } finally {
            setLoading(false);
        }
    };

    const handleManualLocationChange = async ({ lat, lng }) => {
        setCurrentLatLng({ lat, lng });
        setMapCenter([lat, lng]);
    };

    const handleServiceSelect = (id) => {
        setSelectedServiceId((prev) => (prev === id ? null : id));
    };

    const handleDirections = (service) => {
        setSelectedService(service);
    };

    return (
        <div className="space-y-8">

            {/* HEADER */}
            <div className="bg-blue-600 rounded-3xl p-10 text-white flex justify-between shadow-lg">
                <div>
                    <h1 className="text-4xl font-extrabold">
                        Local Services Directory
                    </h1>
                    <p className="text-blue-100">
                        Find essential services near you
                    </p>
                </div>
                <PhoneCall size={48} />
            </div>

            {/* FILTER + LOCATION BAR */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-gray-100">

                {/* Categories */}
                <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => {
                                setActiveCategory(cat);
                                setSelectedServiceId(null);
                            }}
                            className={`px-4 py-2 rounded-xl text-sm font-bold ${activeCategory === cat
                                ? "bg-blue-600 text-white"
                                : "bg-gray-50 text-gray-600"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Location Controls */}
                <div className="flex gap-2">

                    <select
                        onChange={(e) => handleCitySelect(e.target.value)}
                        className="px-4 py-2 rounded-xl border"
                    >
                        <option value="">Select City</option>
                        <option value="Ahmedabad">Ahmedabad</option>
                        <option value="Gandhinagar">Gandhinagar</option>
                        <option value="Surat">Surat</option>
                    </select>

                    <button
                        onClick={handleUseLocation}
                        className="px-4 py-2 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700"
                    >
                        Use My Location
                    </button>

                </div>
            </div>

            {/* MAIN GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">

                {/* LEFT SIDE */}
                <div className="md:col-span-1 space-y-4 max-h-[80vh] overflow-y-auto">

                    {filteredServices.map((service) => (
                        <div key={service._id}>
                            <ServiceCard
                                service={service}
                                isSelected={selectedServiceId === service._id}
                                onSelect={handleServiceSelect}
                            />

                            <button
                                onClick={() => handleDirections(service)}
                                className="mt-2 w-full bg-blue-600 text-white py-2 rounded-xl"
                            >
                                Get Directions
                            </button>
                        </div>
                    ))}
                </div>

                {/* RIGHT SIDE MAP */}
                <div className="md:col-span-2 h-[650px] sticky top-8">
                    <ServiceMap
                        services={filteredServices}
                        center={mapCenter}
                        userLocation={currentLatLng}
                        selectedService={selectedService}
                        selectedServiceId={selectedServiceId}
                        onUserLocationChange={handleManualLocationChange}
                    />
                </div>

            </div>
        </div>
    );
};

export default Services;