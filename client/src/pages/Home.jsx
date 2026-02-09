import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ArrowRight, Newspaper, MapPin, Sprout, MessageSquare, ShoppingBag, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
    const [recentEvents, setRecentEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await axios.get('/api/events');
                // Filter upcoming events and take top 2
                const upcoming = res.data
                    .filter(e => new Date(e.eventDate) >= new Date())
                    .slice(0, 2);
                setRecentEvents(upcoming);
            } catch (err) {
                console.error("Failed to fetch events", err);
            }
        };
        fetchEvents();
    }, []);

    const features = [
        { title: 'News & Alerts', icon: <Newspaper />, path: '/news', color: 'bg-blue-500' },
        { title: 'Local Directory', icon: <MapPin />, path: '/services', color: 'bg-red-500' },
        // { title: 'Grievance', icon: <MessageSquare />, path: '/grievance', color: 'bg-amber-500' },
        { title: 'Marketplace', icon: <ShoppingBag />, path: '/marketplace', color: 'bg-indigo-500' },
        { title: 'Events', icon: <Calendar />, path: '/events', color: 'bg-purple-500' },
    ];

    return (
        <div className="space-y-16">
            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden rounded-3xl">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
                        alt="Village"
                        className="w-full h-full object-cover brightness-50"
                    />
                </div>

                <div className="relative z-10 text-center text-white px-4 max-w-4xl">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-6xl font-extrabold mb-6"
                    >
                        Your Village, Digitally Connected
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl md:text-2xl mb-8 text-gray-200"
                    >
                        Access services, updates, and community support at your fingertips.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex gap-4 justify-center"
                    >
                        <Link to="/register" className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full font-bold text-lg flex items-center gap-2 transition-all">
                            Join Community <ArrowRight size={20} />
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Quick Services Grid */}
            <section>
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800">Our Services</h2>
                        <p className="text-gray-600">Explore what we have for you</p>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ scale: 1.01 }}
                            className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer w-full flex flex-col md:flex-row items-center md:items-start md:justify-between gap-6"
                        >
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 flex-1">
                                <div className={`${feature.color} text-white w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm`}>
                                    {React.cloneElement(feature.icon, { size: 32 })}
                                </div>
                                <div className="text-center md:text-left flex-1">
                                    <h3 className="text-2xl font-bold mb-2 text-gray-800">{feature.title}</h3>
                                    <p className="text-gray-600 text-lg mb-4">Access detailed information and services for {feature.title.toLowerCase()} in your village.</p>
                                    
                                    {/* Recent Events Preview */}
                                    {feature.title === 'Events' && recentEvents.length > 0 && (
                                        <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 mb-2">
                                            <h4 className="text-sm font-bold text-purple-800 mb-2 uppercase tracking-wide">Upcoming Events</h4>
                                            <div className="flex flex-col gap-3">
                                                {recentEvents.map(event => (
                                                    <div key={event._id} className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm">
                                                        <div>
                                                            <div className="font-bold text-gray-800">{event.title}</div>
                                                            <div className="text-xs text-gray-500">{new Date(event.eventDate).toLocaleDateString()}</div>
                                                        </div>
                                                        <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full font-bold">
                                                            {event.status}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-center h-full">
                                <Link to={feature.path} className="text-white bg-gray-900 hover:bg-gray-800 px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all">
                                    Explore <ArrowRight size={20} />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;