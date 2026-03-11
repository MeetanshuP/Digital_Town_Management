import React from "react";

const PlaceCard = ({ place, isSelected, onSelect }) => {
    return (
        <div
            onClick={() => onSelect(place._id)}
            className={`p-4 border rounded-xl cursor-pointer transition 
      ${isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}
        >
            <h3 className="font-semibold text-lg">{place.name}</h3>

            <p className="text-sm text-gray-500">{place.address}</p>

            {place.contact && (
                <p className="text-sm mt-1">📞 {place.contact}</p>
            )}

            {place.distance && (
                <p className="text-sm mt-2 text-gray-400">
                    {(place.distance / 1000).toFixed(2)} km away
                </p>
            )}
        </div>
    );
};

export default PlaceCard;