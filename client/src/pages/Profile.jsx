import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, LogOut, ShieldCheck, Briefcase } from 'lucide-react';
import axios from '../utils/axiosInstance';

const Profile = () => {

    const { user, logout, isSellerMode, toggleSellerMode } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleApplySeller = async () => {
        try {
            await axios.post('/seller/apply');
            alert('Seller application submitted');
            window.location.reload(); // refresh user state
        } catch (err) {
            alert(err.response?.data?.message || 'Error applying for seller');
        }
    };
    const handleToggleSeller = () => {
        if (!isSellerMode) {
            toggleSellerMode();
            navigate("/seller");
        } else {
            toggleSellerMode();
            navigate("/");
        }
    };
    {/* Seller Toggle */ }
    {
        user.sellerStatus === "approved" && (
            <button
                onClick={handleToggleSeller}
                className={`w-full px-6 py-3 rounded-xl font-medium transition ${isSellerMode
                    ? "bg-gray-200 text-gray-800"
                    : "bg-purple-600 text-white hover:bg-purple-700"
                    }`}
            >
                {isSellerMode
                    ? "Switch to Buyer Mode"
                    : "Switch to Seller Dashboard"}
            </button>
        )
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Please log in to view your profile</h2>
                    <Link to="/login" className="text-green-600 hover:underline">Go to Login</Link>
                </div>
            </div>
        );
    }
    //Debugging Purpose
    // console.log("USER OBJECT:", user);

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-green-600 h-32 relative">
                    <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                        <div className="w-32 h-32 bg-white rounded-full p-2 flex items-center justify-center shadow-md">
                            <div className="w-full h-full bg-green-100 rounded-full flex items-center justify-center">
                                <User size={64} className="text-green-600" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-20 pb-8 px-6 text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">
                        {user.firstName} {user.lastName}
                    </h1>
                    <p className="text-gray-500 mb-6">{user.email}</p>

                    <div className="flex flex-wrap justify-center gap-3 mb-8">
                        {user.role === 'admin' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                <ShieldCheck size={16} /> Admin
                            </span>
                        )}

                        {user.roles?.includes('seller') && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                                🛒 Seller
                            </span>
                        )}

                        {user.serviceProviderStatus === 'APPROVED' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                <Briefcase size={16} /> Service Provider
                            </span>
                        )}
                    </div>

                    <div className="border-t border-gray-100 pt-8 flex flex-col gap-4">
                        {user.role === 'user' && user.serviceProviderStatus === 'NONE' && (
                            <Link
                                to="/become-service-provider"
                                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
                            >
                                <Briefcase size={20} />
                                Become a Service Provider
                            </Link>
                        )}

                        {user.serviceProviderStatus === 'PENDING' && (
                            <div className="w-full bg-yellow-50 border border-yellow-200 text-yellow-800 px-6 py-3 rounded-xl flex items-center justify-center gap-2">
                                ⏳ Service Provider Application Under Review
                            </div>
                        )}
                        {/* Seller Application Section */}
                        {user.role === 'user' && !user.roles?.includes('seller') && user.sellerStatus === 'none' && (
                            <button
                                onClick={handleApplySeller}
                                className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition"
                            >
                                🛒 Become a Seller
                            </button>
                        )}

                        {user.sellerStatus === 'pending' && (
                            <div className="w-full bg-yellow-50 border border-yellow-200 text-yellow-800 px-6 py-3 rounded-xl text-center">
                                ⏳ Seller Application Under Review
                            </div>
                        )}

                        {user.sellerStatus === 'rejected' && (
                            <div className="w-full bg-red-50 border border-red-200 text-red-800 px-6 py-3 rounded-xl text-center">
                                ❌ Seller Application Rejected
                            </div>
                        )}

                        {/* Seller Toggle */}
                        {user.sellerStatus === "approved" && (
                            <button
                                onClick={handleToggleSeller}
                                className={`w-full px-6 py-3 rounded-xl font-medium transition ${isSellerMode
                                    ? "bg-gray-200 text-gray-800"
                                    : "bg-purple-600 text-white hover:bg-purple-700"
                                    }`}
                            >
                                {isSellerMode
                                    ? "Switch to Buyer Mode"
                                    : "Switch to Seller Dashboard"}
                            </button>
                        )}

                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 px-6 py-3 rounded-xl hover:bg-red-100 transition"
                        >
                            <LogOut size={20} />
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Additional Details Section - Can be expanded */}
            <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Details</h3>
                <div className="space-y-4">
                    <div className="flex justify-between py-2 border-b border-gray-50">
                        <span className="text-gray-500">First Name</span>
                        <span className="font-medium text-gray-900">{user.firstName}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-50">
                        <span className="text-gray-500">Last Name</span>
                        <span className="font-medium text-gray-900">{user.lastName}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-50">
                        <span className="text-gray-500">Role</span>
                        <span className="font-medium text-gray-900 capitalize">{user.role}</span>
                    </div>
                    <div className="flex justify-between py-2">
                        <span className="text-gray-500">Member Since</span>
                        <span className="font-medium text-gray-900">
                            {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
