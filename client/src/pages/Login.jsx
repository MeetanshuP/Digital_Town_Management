import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const { login, user } = useAuth();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
    if (user) {
        if (user.role === 'admin') {
            navigate('/admin');
        } else {
            navigate('/');
        }
    }
    }, [user, navigate]);


    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setError('');
        try {
            const res = await axios.post('/api/auth/login', formData);
            login(res.data.user, res.data.token);
            // navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid Credentials');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                <div className="text-center mb-8">
                    <div className="bg-green-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <ShieldCheck className="text-green-600" size={32} />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
                    <p className="text-gray-600">Secure access to your village portal</p>
                </div>

                {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium">{error}</div>}

                <form onSubmit={onSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={onChange}
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={onChange}
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                // placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-200"
                    >
                        Login <ArrowRight size={20} />
                    </button>
                </form>

                <p className="text-center mt-8 text-gray-600">
                    New to the village?{' '}
                    <Link to="/register" className="text-green-600 font-bold hover:underline">
                        Register Here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;