import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    LogOut,
    User,
    Home,
    Newspaper,
    MapPin,
    Sprout,
    ShoppingBag,
    Calendar,
    ShieldCheck,
    MessageCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { icon: <Home size={20} />, label: 'Home', path: '/' },
        { icon: <Newspaper size={20} />, label: 'News', path: '/news' },
        { icon: <MapPin size={20} />, label: 'Services', path: '/services' },
        { icon: <ShoppingBag size={20} />, label: 'Market', path: '/marketplace' },
        { icon: <MessageCircle size={20} />, label: 'Grievance', path: '/grievance' },
        { icon: <Calendar size={20} />, label: 'Events', path: '/events' },
    ];

    return (
        <nav className="bg-white sticky top-0 z-50 px-6 py-4 flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-2">
                <div className="bg-green-600 p-2 rounded-lg">
                    <Sprout className="text-white" />
                </div>
                <span className="text-xl font-bold text-green-800">
                    VillageConnect
                </span>
            </div>

            <div className="hidden md:flex gap-6 items-center">
                {navItems.map((item, index) => (
                    <Link
                        key={index}
                        to={item.path}
                        className="flex items-center gap-1 text-gray-600 hover:text-green-600"
                    >
                        {item.icon}
                        <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                ))}
            </div>

            <div className="flex items-center gap-4">
                {user ? (
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col text-gray-700">
                            <div className="flex items-center gap-2">
                                <div className="bg-green-100 p-1.5 rounded-full">
                                    <User size={18} className="text-green-600" />
                                </div>
                                <span className="text-sm font-medium">
                                    {user.firstName}
                                </span>
                            </div>

                            {/* ADMIN */}
                            {user.role === 'admin' && (
                                <span className="text-[10px] text-green-700 font-bold flex items-center gap-1">
                                    <ShieldCheck size={12} /> ADMIN
                                </span>
                            )}

                            {/* SERVICE PROVIDER CTA */}
                           {user.role === 'user' && user.serviceProviderStatus === 'NONE' && (
                            <Link
                                to="/become-service-provider"
                                className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-100 px-2 py-1 rounded-full hover:bg-blue-100 transition"
                            >
                                ➕ Become Service Provider
                            </Link>
                        )}

                        {user.serviceProviderStatus === 'PENDING' && (
                            <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-yellow-700 bg-yellow-50 border border-yellow-100 px-2 py-1 rounded-full">
                                ⏳ Under Review
                            </span>
                        )}

                        {user.serviceProviderStatus === 'APPROVED' && (
                            <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 border border-green-100 px-2 py-1 rounded-full">
                                ✅ Service Provider
                            </span>
                        )}
                        </div>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-1 bg-red-50 text-red-600 px-4 py-2 rounded-full"
                        >
                            <LogOut size={18} />
                            Logout
                        </button>
                    </div>
                ) : (
                    <Link
                        to="/login"
                        className="flex items-center gap-1 bg-green-600 text-white px-4 py-2 rounded-full"
                    >
                        <User size={18} />
                        Login
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
