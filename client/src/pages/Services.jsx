import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ServiceCard from '../components/ServiceCard';
import { Search, Filter, PhoneCall } from 'lucide-react';
import ServiceMap from '../components/ServiceMap';

const CITY_COORDS = {
    Ahmedabad: { lat: 23.0225, lng: 72.5714 },
    Gandhinagar: { lat: 23.2156, lng: 72.6369 },
    Surat: { lat: 21.1702, lng: 72.8311 }
};

const Services = () => {
    const [services, setServices] = useState([]);
    const [filteredServices, setFilteredServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeCategory, setActiveCategory] = useState('All');
    const [location, setLocation] = useState(null);
    const [locationError, setLocationError] = useState("");
    const [currentLatLng, setCurrentLatLng] = useState(CITY_COORDS.Gandhinagar);
    const [mapCenter, setMapCenter] = useState([23.2156, 72.6369]); // default


    const categories = ['All', 'Health', 'Education', 'Government', 'On Demand'];

    useEffect(() => {
        if (activeCategory === 'All') {
            setFilteredServices(services);
        } else {
            setFilteredServices(services.filter(s => s.category === activeCategory));
        }
    }, [activeCategory, services]);

    const handleUseLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation not supported");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            successLocation,
            errorLocation,
            { enableHighAccuracy: true }
        );
    };

    useEffect(() => {
        if (!currentLatLng) return;

        fetchNearbyPlaces(
            currentLatLng.lat,
            currentLatLng.lng,
            activeCategory
        );
    }, [activeCategory, currentLatLng]);



    const handleCitySelect = (city) => {
        if (!CITY_COORDS[city]) return;

        const { lat, lng } = CITY_COORDS[city];
        setLocation(city);
        setLocationError("");
        setCurrentLatLng({ lat, lng });
        setMapCenter([lat, lng]);
        setSelectedServiceId(null);
        // The useEffect hook will detect changes to currentLatLng and activeCategory
        // and trigger fetchNearbyPlaces automatically.
    };



    const successLocation = async (position) => {
        const { latitude, longitude } = position.coords;

        setCurrentLatLng({ lat: latitude, lng: longitude });
        setMapCenter([latitude, longitude]);
        setSelectedServiceId(null);

        try {
            const geoRes = await axios.get(
                `/api/location/reverse-geocode?lat=${latitude}&lon=${longitude}`
            );

            const city = geoRes.data.city;

            setLocation(city || "Near you");

            await fetchNearbyPlaces(latitude, longitude, activeCategory);
        } catch (err) {
            setLocationError("Failed to load nearby services");
        }
    };


    const errorLocation = () => {
        setLocationError("Location permission denied. Please select city manually.");
    };

    const fetchNearbyPlaces = async (lat, lng, category = null) => {
        setLoading(true);
        try {
            const res = await axios.get("/api/places/nearby", {
                params: {
                    lat,
                    lng,
                    radius: 5000,
                    category: category !== "All" ? category : null
                }
            });

            setServices(res.data);
            setFilteredServices(res.data);
        } catch (err) {
            console.error(err);
            //  setLocation(city || "Near you");
            setLocationError("Failed to load nearby services");
        } finally {
            setLoading(false);
        }
    };





    const [selectedServiceId, setSelectedServiceId] = useState(null);

    const handleManualLocationChange = async (newLatLng) => {
        const { lat, lng } = newLatLng;
        setCurrentLatLng({ lat, lng });
        setMapCenter([lat, lng]);
        setSelectedServiceId(null);

        try {
            const geoRes = await axios.get(
                `/api/location/reverse-geocode?lat=${lat}&lon=${lng}`
            );
            const city = geoRes.data.city;
            setLocation(city || "Selected location");
        } catch (err) {
            console.error("Manual location change geocode error:", err);
            setLocation("Selected location");
        }
    };

    const handleServiceSelect = (id) => {
        setSelectedServiceId(prev => prev === id ? null : id);
    };

    return (
        <div className="space-y-8">
            <div className="bg-blue-600 rounded-3xl p-10 text-white flex items-center justify-between overflow-hidden relative shadow-lg">
                <div className="relative z-10">
                    <h1 className="text-4xl font-extrabold mb-2">Local Services Directory</h1>
                    <p className="text-blue-100 text-lg">Find essential services and contact details in your village.</p>
                </div>
                <div className="bg-white/10 p-6 rounded-full relative z-10">
                    <PhoneCall size={48} />
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => {
                                setActiveCategory(cat);
                                setSelectedServiceId(null);
                            }}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeCategory === cat
                                ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search services..."
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                </div>
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
                    className="px-4 py-2 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 transition-all"
                >
                    Use My Location
                </button>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                {/* Left Side: Services List (1/3) */}
                <div className="md:col-span-1 space-y-6">
                    {location && (
                        <p className="text-sm text-green-600 font-semibold italic">
                            Showing services near: {location}
                        </p>
                    )}

                    {locationError && (
                        <p className="text-sm text-red-500 font-semibold bg-red-50 p-3 rounded-xl border border-red-100">
                            {locationError}
                        </p>
                    )}

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2 custom-scrollbar">
                            {filteredServices.length > 0 ? (
                                filteredServices.map(service => (
                                    <div key={service._id} className="transition-all duration-300">
                                        <ServiceCard
                                            service={service}
                                            isSelected={selectedServiceId === service._id}
                                            onSelect={handleServiceSelect}
                                        />
                                    </div>
                                ))
                            ) : (
                                <div className="py-20 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                    <Filter size={40} className="mx-auto text-gray-300 mb-4" />
                                    <h3 className="text-lg font-bold text-gray-400">No services found.</h3>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Right Side: Map (2/3) */}
                <div className="md:col-span-2 sticky top-8">
                    <ServiceMap
                        services={filteredServices}
                        center={mapCenter}
                        userLocation={currentLatLng}
                        selectedServiceId={selectedServiceId}
                        onUserLocationChange={handleManualLocationChange}
                    />
                </div>
            </div>
        </div>
    );
};

export default Services;