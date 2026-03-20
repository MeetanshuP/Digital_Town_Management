import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
    MessageCircle,
    Menu,
    X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

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
        ...(user?.role === "admin"
            ? [{ icon: <ShieldCheck size={20} />, label: "Admin", path: "/admin" }]
            : [])
    ];

    return (
        <nav className="bg-white sticky top-0 z-50 px-6 py-4 flex justify-between items-center shadow-sm">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
                <button
                    className="md:hidden text-gray-600 hover:text-green-600 mr-2"
                    onClick={(e) => {
                        e.preventDefault();
                        toggleSidebar();
                    }}
                >
                    <Menu size={24} />
                </button>

                <div className="bg-green-600 p-2 rounded-lg">
                    <Sprout className="text-white" />
                </div>

                <span className="text-xl font-bold text-green-800">
                    VillageConnect
                </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex gap-6 items-center">
                {navItems.map((item, index) => (
                    <Link
                        key={index}
                        to={item.path}
                        className={`flex items-center gap-1 ${location.pathname === item.path
                                ? "text-green-600 font-semibold"
                                : "text-gray-600 hover:text-green-600"
                            }`}
                    >
                        {item.icon}
                        <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">

                {user ? (
                    <div className="hidden md:flex items-center gap-4">

                        <Link
                            to="/profile"
                            className="flex items-center gap-2 hover:bg-gray-50 p-1 rounded-lg transition-colors"
                        >
                            <div className="bg-green-100 p-1.5 rounded-full">
                                <User size={18} className="text-green-600" />
                            </div>

                            <span className="text-sm font-medium text-gray-700">
                                {user.firstName}
                            </span>
                        </Link>

                        {user.role === 'admin' && (
                            <span className="text-[10px] text-green-700 font-bold flex items-center gap-1">
                                <ShieldCheck size={12} /> ADMIN
                            </span>
                        )}

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-1 text-red-500 hover:text-red-700 text-sm"
                        >
                            <LogOut size={18} />
                        </button>

                    </div>
                ) : (
                    <Link
                        to="/login"
                        className="hidden md:flex items-center gap-1 bg-green-600 text-white px-4 py-2 rounded-full"
                    >
                        <User size={18} />
                        Login
                    </Link>
                )}

            </div>

            {/* Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={toggleSidebar}
                />
            )}

            {/* Mobile Sidebar */}
            <div
                className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 md:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >

                <div className="p-4 flex flex-col h-full">

                    {/* Sidebar Header */}
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-xl font-bold text-green-800">
                            Menu
                        </span>

                        <button
                            onClick={toggleSidebar}
                            className="text-gray-600 hover:text-red-500"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Sidebar Navigation */}
                    <div className="flex flex-col gap-4">
                        {navItems.map((item, index) => (
                            <Link
                                key={index}
                                to={item.path}
                                className={`flex items-center gap-3 p-2 rounded-lg ${location.pathname === item.path
                                        ? "text-green-600 bg-green-50"
                                        : "text-gray-700 hover:text-green-600 hover:bg-green-50"
                                    }`}
                                onClick={toggleSidebar}
                            >
                                {item.icon}
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        ))}
                    </div>

                    {/* Sidebar Bottom */}
                    {user ? (
                        <div className="mt-auto pt-6 border-t border-gray-100">

                            <Link
                                to="/profile"
                                className="flex items-center gap-2 mb-4 hover:bg-gray-50 p-2 rounded-lg"
                                onClick={toggleSidebar}
                            >
                                <div className="bg-green-100 p-1.5 rounded-full">
                                    <User size={18} className="text-green-600" />
                                </div>

                                <span className="text-sm font-medium text-gray-700">
                                    {user.firstName}
                                </span>
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 text-red-500 hover:text-red-700 p-2 rounded-lg"
                            >
                                <LogOut size={18} />
                                Logout
                            </button>

                        </div>
                    ) : (
                        <div className="mt-auto pt-6 border-t border-gray-100">
                            <Link
                                to="/login"
                                className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg w-full hover:bg-green-700"
                                onClick={toggleSidebar}
                            >
                                <User size={18} />
                                Login
                            </Link>
                        </div>
                    )}

                </div>

            </div>

        </nav>
    );
};

export default Navbar;