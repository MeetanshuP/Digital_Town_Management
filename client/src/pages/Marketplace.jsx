import React, { useState, useEffect } from "react";
import useNearbyPlaces from "../hooks/useLocationPlaces";
import ServiceMap from "../components/ServiceMap";
import ServiceCard from "../components/ServiceCard";
import { Search, MapPin } from "lucide-react";

const CITY_COORDS = {
    Ahmedabad: { lat: 23.0225, lng: 72.5714 },
    Gandhinagar: { lat: 23.2156, lng: 72.6369 },
    Surat: { lat: 21.1702, lng: 72.8311 }
};

const Marketplace = () => {

    const {
        places,
        loading,
        location,
        locationError,
        fetchNearbyPlaces,
        reverseGeocode,
        detectLocation
    } = useNearbyPlaces();

    const baseCategories = ["Retail", "Food_Dining", "Accommodation", "Transport"];
    const categories = ["All", ...baseCategories];

    const [currentLatLng, setCurrentLatLng] = useState(CITY_COORDS.Gandhinagar);
    const [mapCenter, setMapCenter] = useState([23.2156, 72.6369]);
    const [selectedPlaceId, setSelectedPlaceId] = useState(null);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [radius, setRadius] = useState(5000);
    const [activeCategory, setActiveCategory] = useState("All");

    useEffect(() => {
        if (!currentLatLng) return;

        fetchNearbyPlaces(
            currentLatLng.lat,
            currentLatLng.lng,
            activeCategory === "All" ? baseCategories.join(",") : activeCategory,
            radius
        );

    }, [currentLatLng, radius, activeCategory]);

    useEffect(() => {
        if (selectedPlaceId && places) {
            const stillExists = places.some(p => p._id === selectedPlaceId);
            if (!stillExists) {
                setSelectedPlaceId(null);
                setSelectedPlace(null);
            }
        }
    }, [places, selectedPlaceId]);

    const handleUseLocation = () => {

        detectLocation(successLocation, errorLocation);

    };

    const successLocation = async (position) => {

        const { latitude, longitude } = position.coords;

        setCurrentLatLng({
            lat: latitude,
            lng: longitude
        });

        setMapCenter([latitude, longitude]);
        setSelectedPlace(null);
        setSelectedPlaceId(null);

        await reverseGeocode(latitude, longitude);

        await fetchNearbyPlaces(latitude, longitude, activeCategory === "All" ? baseCategories.join(",") : activeCategory, radius);

    };

    const errorLocation = () => {

        console.log("Location permission denied");

    };

    const handleCitySelect = (city) => {

        if (!CITY_COORDS[city]) return;

        const { lat, lng } = CITY_COORDS[city];

        setCurrentLatLng({ lat, lng });
        setMapCenter([lat, lng]);
        setSelectedPlace(null);
        setSelectedPlaceId(null);

    };

    const handleManualLocationChange = async (newLatLng) => {

        const { lat, lng } = newLatLng;

        setCurrentLatLng({ lat, lng });
        setMapCenter([lat, lng]);
        setSelectedPlace(null);
        setSelectedPlaceId(null);

        await reverseGeocode(lat, lng);

    };

    const handlePlaceSelect = (id) => {
        setSelectedPlaceId(prev => prev === id ? null : id);
    };

    const handleMarkerClick = (id) => {
        setSelectedPlaceId(id);
        if (selectedPlace) {
            const newPlace = places.find(p => p._id === id);
            if (newPlace) setSelectedPlace(newPlace);
        }
    };

    const handleDirections = (place) => {
        setSelectedPlace(place);
    };

    useEffect(() => {
        const targetId = selectedPlaceId || selectedPlace?._id;
        if (targetId) {
            const el = document.getElementById(`service-card-${targetId}`);
            if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }
    }, [selectedPlaceId, selectedPlace]);

    return (

        <div className="space-y-8">

            <div className="bg-purple-600 rounded-3xl p-10 text-white flex items-center justify-between">

                <div>
                    <h1 className="text-4xl font-bold mb-2">
                        Nearby Markets
                    </h1>

                    <p className="text-purple-100">
                        Find markets and shopping areas near you.
                    </p>
                </div>

                <MapPin size={48} />

            </div>


            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-gray-100">

                <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => {
                                setActiveCategory(cat);
                                setSelectedPlace(null);
                                setSelectedPlaceId(null);
                            }}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${activeCategory === cat
                                ? "bg-purple-600 text-white shadow-md shadow-purple-200"
                                : "bg-gray-50 text-gray-600 hover:bg-purple-50 hover:text-purple-600"
                                }`}
                        >
                            {cat.replace("_", " ")}
                        </button>
                    ))}
                </div>

                <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-bold text-gray-600">Radius: {radius / 1000}km</label>
                        <input 
                            type="range" 
                            min="1" 
                            max="20" 
                            step="1" 
                            value={radius / 1000}
                            onChange={(e) => setRadius(parseInt(e.target.value) * 1000)}
                            className="w-24 accent-purple-600"
                        />
                    </div>

                    <select
                        onChange={(e) => handleCitySelect(e.target.value)}
                        className="px-4 py-2 border rounded-xl"
                    >
                        <option value="">Select City</option>
                        <option value="Ahmedabad">Ahmedabad</option>
                        <option value="Gandhinagar">Gandhinagar</option>
                        <option value="Surat">Surat</option>
                    </select>

                    <button
                        onClick={handleUseLocation}
                        className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
                    >
                        Use My Location
                    </button>
                </div>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">

                <div className="md:col-span-1 space-y-4 max-h-[80vh] overflow-y-auto">

                    {location && (
                        <p className="text-sm text-green-600">
                            Showing markets near: {location}
                        </p>
                    )}

                    {locationError && (
                        <p className="text-red-500 text-sm">
                            {locationError}
                        </p>
                    )}

                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        places.map(place => (
                            <div key={place._id} id={`service-card-${place._id}`}>
                                <ServiceCard
                                    service={place}
                                    isSelected={selectedPlaceId === place._id}
                                    onSelect={handlePlaceSelect}
                                    isRouteActive={selectedPlace?._id === place._id}
                                    onGetDirections={() => handleDirections(place)}
                                    onClearDirections={() => setSelectedPlace(null)}
                                />
                            </div>
                        ))
                    )}

                </div>

                <div className="md:col-span-2 h-[650px] sticky top-8">

                    <ServiceMap
                        services={places}
                        center={mapCenter}
                        userLocation={currentLatLng}
                        selectedService={selectedPlace}
                        selectedServiceId={selectedPlaceId}
                        onUserLocationChange={handleManualLocationChange}
                        onMarkerClick={handleMarkerClick}
                        radius={radius}
                    />

                </div>

            </div>

        </div>

    );

};

export default Marketplace;