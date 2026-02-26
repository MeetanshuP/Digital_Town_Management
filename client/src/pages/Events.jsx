import React, { useState, useEffect } from 'react';
import axios from "../utils/axiosInstance";
import EventCard from '../components/EventCard';
import NearbyEvents from '../components/NearbyEvents';
import { Calendar, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Events = () => {
    const { user } = useAuth();

    const [activeTab, setActiveTab] = useState("community");

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        eventDate: '',
        eventTime: ''
    });

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await axios.get('/events');
            setEvents(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const onChange = e =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        try {
            const token = sessionStorage.getItem('token');

            if (!token) {
                setError('Please login to create an event');
                setSubmitting(false);
                return;
            }

            await axios.post('/events', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setShowModal(false);
            setFormData({
                title: '',
                description: '',
                eventDate: '',
                eventTime: ''
            });

            fetchEvents();

        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create event');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-8">

            {/* Header Section */}
            <div className="bg-purple-600 rounded-3xl p-10 text-white flex items-center justify-between shadow-lg">
                <div>
                    <h1 className="text-4xl font-extrabold mb-2">
                        Community Calendar
                    </h1>
                    <p className="text-purple-100 text-lg">
                        Mark your dates for upcoming festivals and programs.
                    </p>
                </div>
                <Calendar size={48} />
            </div>

            {/* Tabs Section */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex gap-6 border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab("community")}
                        className={`pb-2 font-bold ${activeTab === "community"
                            ? "text-purple-600 border-b-2 border-purple-600"
                            : "text-gray-500"
                            }`}
                    >
                        Community Events
                    </button>

                    <button
                        onClick={() => setActiveTab("nearby")}
                        className={`pb-2 font-bold ${activeTab === "nearby"
                            ? "text-purple-600 border-b-2 border-purple-600"
                            : "text-gray-500"
                            }`}
                    >
                        Nearby Events
                    </button>
                </div>

                {user?.role === 'admin' && activeTab === "community" && (
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-purple-100 text-purple-700 px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-purple-200 transition-all"
                    >
                        <Plus size={20} /> Add Event
                    </button>
                )}
            </div>

            {/* Content Section */}
            {activeTab === "community" ? (
                loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {events.length > 0 ? (
                            events.map(event => (
                                <EventCard key={event._id} event={event} />
                            ))
                        ) : (
                            <div className="py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                                No upcoming events scheduled.
                            </div>
                        )}
                    </div>
                )
            ) : (
                <NearbyEvents />
            )}

            {/* Create Event Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
                        <h3 className="text-2xl font-bold text-gray-800 mb-6">
                            Create New Event
                        </h3>

                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={onSubmit} className="space-y-4">
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={onChange}
                                placeholder="Event Title"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
                            />

                            <div className="flex gap-4">
                                <input
                                    type="date"
                                    name="eventDate"
                                    value={formData.eventDate}
                                    onChange={onChange}
                                    required
                                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
                                />
                                <input
                                    type="time"
                                    name="eventTime"
                                    value={formData.eventTime}
                                    onChange={onChange}
                                    required
                                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
                                />
                            </div>

                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={onChange}
                                rows="3"
                                placeholder="Event details..."
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
                            />

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 font-bold text-gray-700 hover:bg-gray-50 transition-all"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-4 py-3 rounded-xl font-bold transition-all"
                                >
                                    {submitting ? 'Creating...' : 'Create Event'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Events;
