import React from 'react';
import { Phone, MapPin, Info } from 'lucide-react';

const ServiceCard = ({ service, isSelected, onSelect, isRouteActive, onGetDirections, onClearDirections }) => {
    return (
        <div className={`bg-white rounded-2xl p-6 shadow-sm border transition-all flex flex-col h-full ${isSelected ? 'border-blue-500 shadow-md ring-1 ring-blue-100' : 'border-gray-100 hover:shadow-md'
            }`}>
            <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${isSelected ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-green-50 text-green-700 border-green-100'
                    }`}>
                    {service.category}
                </span>
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-2 truncate" title={service.name}>
                {service.name}
            </h3>

            {isSelected && (
                <div className="space-y-3 pt-4 border-t border-gray-50 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center text-gray-600">
                        <Phone size={16} className="mr-3 text-blue-600" />
                        <span className="text-sm font-medium">{service.contact || "No contact info"}</span>
                    </div>
                    {service.address && (
                        <div className="flex items-center text-gray-600">
                            <MapPin size={16} className="mr-3 text-blue-600" />
                            <span className="text-sm line-clamp-2">{service.address}</span>
                        </div>
                    )}
                    {service.metadata?.amenities?.length > 0 && (
                        <div className="pt-2">
                            <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Amenities</p>
                            <div className="flex flex-wrap gap-2">
                                {service.metadata.amenities.map((amenity, i) => (
                                    <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg font-medium">
                                        {amenity}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            <button
                onClick={() => onSelect(service._id)}
                className={`mt-4 w-full py-2 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${isSelected
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700'
                        : 'bg-gray-50 text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                    }`}
            >
                <Info size={16} />
                {isSelected ? 'Hide Details' : 'Details'}
            </button>

            {isSelected && (
                isRouteActive ? (
                    <button
                        onClick={onClearDirections}
                        className="mt-2 w-full bg-red-500 text-white py-2 rounded-xl text-sm font-bold hover:bg-red-600 transition-colors"
                    >
                        Clear Route
                    </button>
                ) : (
                    <button
                        onClick={onGetDirections}
                        className="mt-2 w-full bg-blue-600 text-white py-2 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors"
                    >
                        Get Directions
                    </button>
                )
            )}
        </div>
    );
};

export default ServiceCard;