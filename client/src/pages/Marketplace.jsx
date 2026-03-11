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

    const [currentLatLng, setCurrentLatLng] = useState(CITY_COORDS.Gandhinagar);
    const [mapCenter, setMapCenter] = useState([23.2156, 72.6369]);
    const [selectedPlaceId, setSelectedPlaceId] = useState(null);

    useEffect(() => {
        if (!currentLatLng) return;

        fetchNearbyPlaces(
            currentLatLng.lat,
            currentLatLng.lng,
            "Market"
        );

    }, [currentLatLng]);

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
        setSelectedPlaceId(null);

        await reverseGeocode(latitude, longitude);

        await fetchNearbyPlaces(latitude, longitude, "Market");

    };

    const errorLocation = () => {

        console.log("Location permission denied");

    };

    const handleCitySelect = (city) => {

        if (!CITY_COORDS[city]) return;

        const { lat, lng } = CITY_COORDS[city];

        setCurrentLatLng({ lat, lng });
        setMapCenter([lat, lng]);
        setSelectedPlaceId(null);

    };

    const handleManualLocationChange = async (newLatLng) => {

        const { lat, lng } = newLatLng;

        setCurrentLatLng({ lat, lng });
        setMapCenter([lat, lng]);
        setSelectedPlaceId(null);

        await reverseGeocode(lat, lng);

    };

    const handlePlaceSelect = (id) => {

        setSelectedPlaceId(prev => prev === id ? null : id);

    };

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


            <div className="flex gap-4 items-center bg-white p-4 rounded-2xl border">

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
                    className="px-4 py-2 bg-green-600 text-white rounded-xl"
                >
                    Use My Location
                </button>

            </div>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                <div className="space-y-4">

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
                            <ServiceCard
                                key={place._id}
                                service={place}
                                isSelected={selectedPlaceId === place._id}
                                onSelect={handlePlaceSelect}
                            />
                        ))
                    )}

                </div>


                <div className="md:col-span-2">

                    <ServiceMap
                        services={places}
                        center={mapCenter}
                        userLocation={currentLatLng}
                        selectedServiceId={selectedPlaceId}
                        onUserLocationChange={handleManualLocationChange}
                    />

                </div>

            </div>

        </div>

    );

};

export default Marketplace;