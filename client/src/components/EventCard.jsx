import React from 'react';
import { Calendar as CalendarIcon, MapPin, Clock } from 'lucide-react';

const EventCard = ({ event }) => {
    const [expanded, setExpanded] = React.useState(false);
    
    const getCategoryStyles = (cat) => {
        switch (cat) {
            case 'Festival': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'Meeting': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Health Camp': return 'bg-red-100 text-red-700 border-red-200';
            case 'Agri Fair': return 'bg-green-100 text-green-700 border-green-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'upcoming': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'completed': return 'bg-red-100 text-red-700 border-red-200';
            case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const eventDate = new Date(event.eventDate);

    return (
        <div className={`bg-white rounded-3xl p-6 shadow-sm border hover:shadow-lg transition-all flex flex-col gap-6 ${event.status === 'completed' ? 'border-red-200 shadow-red-100' : 'border-gray-100'}`}>
            <div className="flex gap-6 flex-col md:flex-row">
                 <div className="flex flex-col items-center justify-center bg-gray-50 rounded-2xl p-4 min-w-[100px] border border-gray-100 h-fit">
                    <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">{eventDate.toLocaleString('default', { month: 'short' })}</span>
                    <span className="text-4xl font-black text-gray-800">{eventDate.getDate()}</span>
                 </div>

                <div className="flex-grow">
                    <div className="flex justify-between items-start mb-2 gap-2">
                        <div className="flex gap-2">
                            {event.category && (
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getCategoryStyles(event.category)}`}>
                                    {event.category}
                                </span>
                            )}
                            {event.status && (
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusStyles(event.status)}`}>
                                    {event.status}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-between items-start gap-4 mb-2">
                        <h3 className="text-xl font-extrabold text-gray-800">{event.title}</h3>
                        <div className="flex items-center gap-1.5 text-sm font-semibold text-purple-700 bg-purple-50 px-3 py-1 rounded-lg shrink-0">
                            <Clock size={14} />
                            {event.eventTime ? (
                                new Date(`2000-01-01T${event.eventTime}`).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
                            ) : (
                                eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            )}
                        </div>
                    </div>
                    
                    <div className="mb-4">
                        <p className={`text-gray-500 text-base transition-all duration-300 ${expanded ? '' : 'line-clamp-2'}`}>
                            {event.description}
                        </p>
                        {event.description && event.description.length > 100 && (
                            <button 
                                onClick={() => setExpanded(!expanded)}
                                className="text-purple-600 text-xs font-bold mt-1 hover:underline focus:outline-none"
                            >
                                {expanded ? 'Show Less' : 'Read More'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventCard;
