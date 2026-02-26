import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from "../utils/axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSellerMode, setIsSellerMode] = useState(false);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
            // Validate token or fetch profile
            fetchProfile(token);
        } else {
            setLoading(false);
        }
    }, []);

    const toggleSellerMode = () => {
        setIsSellerMode(prev => !prev);
    };

    const fetchProfile = async (token) => {
        try {
            const res = await axios.get('/auth/profile', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser({
                ...res.data,
                role: res.data.role || 'user',
                serviceProviderStatus: res.data.serviceProviderStatus || 'NONE',
                sellerStatus: res.data.sellerStatus || 'none',
                roles: res.data.roles || [],
            });

        } catch (err) {
            sessionStorage.removeItem('token');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = (userData, token) => {
        sessionStorage.setItem('token', token);
        setUser({
            ...userData,
            role: userData.role || 'user',
            serviceProviderStatus: userData.serviceProviderStatus || 'NONE',
            sellerStatus: userData.sellerStatus || 'none',
            roles: userData.roles || [],
        });

    };

    const logout = () => {
        sessionStorage.removeItem('token');
        setUser(null);
    };

    const applyForServiceProvider = async (formData) => {
        const token = sessionStorage.getItem('token');

        const res = await axios.post(
            '/service-provider/apply',
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        setUser((prev) => ({
            ...prev,
            serviceProviderStatus: 'PENDING',
        }));

        return res.data;
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            logout,
            applyForServiceProvider,
            isSellerMode,
            toggleSellerMode
        }}>

            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
