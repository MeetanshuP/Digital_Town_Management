import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, MessageSquare, Calendar, ArrowRight, LayoutDashboard } from 'lucide-react';

const Dashboard = () => {
    const adminFeatures = [
        { 
            title: 'Service Providers', 
            icon: <Users />, 
            path: '/admin/service-providers', 
            color: 'bg-blue-600',
            description: 'Manage verification requests and view all registered service providers.'
        },
        { 
            title: 'Grievance Management', 
            icon: <MessageSquare />, 
            path: '/admin/grievances', 
            color: 'bg-amber-600',
            description: 'Review and resolve complaints submitted by villagers.'
        },
        { 
            title: 'Event Management', 
            icon: <Calendar />, 
            path: '/admin/events', 
            color: 'bg-purple-600',
            description: 'Create, edit, and delete community events and announcements.'
        }
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-3 mb-8">
                <div className="bg-green-100 p-3 rounded-xl">
                    <LayoutDashboard className="text-green-700" size={32} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
                    <p className="text-gray-500">Overview of village administration</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {adminFeatures.map((feature, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer w-full flex flex-col items-start justify-between gap-6 h-full"
                    >
                        <div className="flex flex-col items-start gap-4 flex-1 w-full">
                            <div className={`${feature.color} text-white w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm`}>
                                {React.cloneElement(feature.icon, { size: 28 })}
                            </div>
                            <div className="w-full">
                                <h3 className="text-xl font-bold mb-2 text-gray-800">{feature.title}</h3>
                                <p className="text-gray-600 text-base leading-relaxed">{feature.description}</p>
                            </div>
                        </div>
                        
                        <div className="w-full mt-auto pt-4 border-t border-gray-50">
                            <Link to={feature.path} className="text-white bg-gray-900 hover:bg-gray-800 w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all text-sm">
                                Manage <ArrowRight size={18} />
                            </Link>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
