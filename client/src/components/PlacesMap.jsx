import React from "react";
import ServiceMap from "./ServiceMap";

const PlacesMap = ({
    places,
    center,
    userLocation,
    selectedPlaceId,
    onUserLocationChange
}) => {
    return (
        <ServiceMap
            services={places}
            center={center}
            userLocation={userLocation}
            selectedServiceId={selectedPlaceId}
            onUserLocationChange={onUserLocationChange}
        />
    );
};

export default PlacesMap;