import React from 'react';
import { Phone, MapPin, Info } from 'lucide-react';

const ServiceCard = ({ service }) => {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider border border-green-100">
                    {service.category}
                </span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{service.name}</h3>
            <p className="text-gray-500 text-sm flex-grow mb-4">{service.description}</p>

            <div className="space-y-3 pt-4 border-t border-gray-50">
                <div className="flex items-center text-gray-600">
                    <Phone size={16} className="mr-3 text-green-600" />
                    <span className="text-sm font-medium">{service.contact}</span>
                </div>
                {service.address && (
                    <div className="flex items-center text-gray-600">
                        <MapPin size={16} className="mr-3 text-green-600" />
                        <span className="text-sm">{service.address}</span>
                    </div>
                )}
            </div>

            <button className="mt-6 w-full bg-gray-50 hover:bg-green-50 text-gray-700 hover:text-green-700 py-2 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2">
                <Info size={16} /> Details
            </button>
        </div>
    );
};

export default ServiceCard;