import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Newspaper, MapPin, Sprout, MessageSquare, ShoppingBag, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ scale: 1.02 }}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer"
                        >
                            <div className={`${feature.color} text-white w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                                {React.cloneElement(feature.icon, { size: 24 })}
                            </div>
                            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                            <p className="text-gray-600 mb-4">Access detailed information and services for {feature.title.toLowerCase()} in your village.</p>
                            <Link to={feature.path} className="text-green-600 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                                Learn More <ArrowRight size={18} />
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;