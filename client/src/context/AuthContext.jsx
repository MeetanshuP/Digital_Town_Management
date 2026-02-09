import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
            // Validate token or fetch profile
            fetchProfile(token);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchProfile = async (token) => {
        try {
            const res = await axios.get('/api/auth/profile', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser({
                ...res.data,
                role: res.data.role || 'USER',
                serviceProviderStatus: res.data.serviceProviderStatus || 'NONE',
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
            role: userData.role || 'USER',
            serviceProviderStatus: userData.serviceProviderStatus || 'NONE',
        });
    };

    const logout = () => {
        sessionStorage.removeItem('token');
        setUser(null);
    };


   const applyForServiceProvider = async (formData) => {
        const token = sessionStorage.getItem('token');

        const res = await axios.post(
            '/api/service-provider/apply',
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
        <AuthContext.Provider value={{ user, loading, login, logout, applyForServiceProvider }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
