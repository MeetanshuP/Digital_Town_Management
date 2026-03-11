import React, { useState } from "react";
import PlaceCard from "./PlaceCard";
import PlacesMap from "./PlacesMap";

const PlacesLayout = ({
    title,
    places,
    loading,
    location,
    locationError,
    currentLatLng,
    detectLocation
}) => {

    const [selectedPlaceId, setSelectedPlaceId] = useState(null);

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">{title}</h1>

                <button
                    onClick={detectLocation}
                    className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700"
                >
                    Use My Location
                </button>
            </div>

            {/* Location Info */}
            {location && (
                <p className="text-green-600 text-sm">
                    Showing results near: {location}
                </p>
            )}

            {locationError && (
                <p className="text-red-500 text-sm">{locationError}</p>
            )}

            {/* Main Layout */}
            <div className="grid md:grid-cols-3 gap-8">

                {/* List */}
                <div className="space-y-4">

                    {loading ? (
                        <p>Loading...</p>
                    ) : places.length > 0 ? (
                        places.map((place) => (
                            <PlaceCard
                                key={place._id}
                                place={place}
                                isSelected={selectedPlaceId === place._id}
                                onSelect={setSelectedPlaceId}
                            />
                        ))
                    ) : (
                        <p>No places found nearby.</p>
                    )}

                </div>

                {/* Map */}
                <div className="md:col-span-2">

                    <PlacesMap
                        places={places}
                        center={
                            currentLatLng
                                ? [currentLatLng.lat, currentLatLng.lng]
                                : [23.2156, 72.6369] // fallback center
                        }
                        userLocation={currentLatLng}
                        selectedPlaceId={selectedPlaceId}
                    />

                </div>

            </div>

        </div>
    );
};

export default PlacesLayout;