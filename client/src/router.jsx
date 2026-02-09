import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";



//importing components
import Navbar from "./components/Navbar";
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import News from './pages/News';
import Services from './pages/Services';
import BecomeServiceProvider from './pages/BecomeServiceProvider';
import Grievance from './pages/Grievance';
import Marketplace from './pages/Marketplace';
import Events from './pages/Events';

import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import ServiceProviderRequests from "./pages/admin/ServiceProviderRequests";
import GrievanceManagement from "./pages/admin/GrievanceManagement";
import AdminEvents from "./pages/admin/AdminEvents";

const Approutes = () => {
    const { user } = useAuth();
    const location = useLocation();
    const hideNavbarPaths = ['/login', '/register'];

    // Only show navbar if logged in AND not on login/register pages
    const showNavbar = user && !hideNavbarPaths.includes(location.pathname)
        && !location.pathname.startsWith('/admin');

    return (
        <div className="min-h-screen bg-gray-50">
            {showNavbar && <Navbar />}
            <main className={showNavbar ? 'container mx-auto px-4 py-8' : ''}>
                <Routes>
                    <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/news" element={<PrivateRoute><News /></PrivateRoute>} />
                    <Route path="/services" element={<PrivateRoute><Services /></PrivateRoute>} />
                    <Route path="/become-service-provider" element={<PrivateRoute><BecomeServiceProvider /></PrivateRoute>} />
                    <Route path="/grievance" element={<PrivateRoute><Grievance /></PrivateRoute>} />
                    <Route path="/marketplace" element={<PrivateRoute><Marketplace /></PrivateRoute>} />
                    <Route path="/events" element={<PrivateRoute><Events /></PrivateRoute>} />
                    <Route
                        path="/admin"
                        element={
                            <PrivateRoute role="admin">
                                <AdminLayout />
                            </PrivateRoute>
                        }
                    >
                        <Route index element={<Dashboard />} />
                        <Route path="service-providers" element={<ServiceProviderRequests />} />
                        <Route path="grievances" element={<GrievanceManagement />} />
                        <Route path="events" element={<AdminEvents />} />
                    </Route>
                </Routes>
            </main>
        </div>
    );
};

export default Approutes;