import React from 'react';
import { Calendar as CalendarIcon, MapPin, Clock } from 'lucide-react';

const EventCard = ({ event }) => {
    const getCategoryStyles = (cat) => {
        switch (cat) {
            case 'Festival': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'Meeting': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Health Camp': return 'bg-red-100 text-red-700 border-red-200';
            case 'Agri Fair': return 'bg-green-100 text-green-700 border-green-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const eventDate = new Date(event.date);

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center justify-center bg-gray-50 rounded-2xl p-4 min-w-[100px] border border-gray-100">
                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">{eventDate.toLocaleString('default', { month: 'short' })}</span>
                <span className="text-4xl font-black text-gray-800">{eventDate.getDate()}</span>
            </div>

            <div className="flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getCategoryStyles(event.category)}`}>
                        {event.category}
                    </span>
                </div>
                <h3 className="text-xl font-extrabold text-gray-800 mb-2">{event.title}</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{event.description}</p>

                <div className="flex flex-wrap gap-4 text-sm font-medium text-gray-500">
                    <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-purple-600" />
                        {event.location}
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock size={16} className="text-purple-600" />
                        {eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                </div>
            </div>

            <div className="flex items-center">
                <button className="w-full md:w-auto bg-gray-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-md">
                    Join Event
                </button>
            </div>
        </div>
    );
};

export default EventCard;