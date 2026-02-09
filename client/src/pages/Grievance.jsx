import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MessageSquare, Send, CheckCircle, Clock, AlertCircle, Camera } from 'lucide-react';
import ImageUpload from '../components/ImageUpload';

const Grievance = () => {
    const [grievances, setGrievances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        subject: '',
        message: '',
        category: 'general',
        evidence: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const categories = ['general', 'complaint', 'suggestion'];

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setSubmitting(true);
        try {
            const token = sessionStorage.getItem('token');
            if (!token) {
                setError('Please login to submit a grievance');
                setSubmitting(false);
                return;
            }
            const res = await axios.post('/api/grievances', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSuccess('Grievance submitted successfully!');
            setFormData({ subject: '', message: '', category: 'general' });
            // Refresh grievances list
            const updatedRes = await axios.get('/api/grievances', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setGrievances(updatedRes.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit grievance');
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        const fetchGrievances = async () => {
            try {
                const token = sessionStorage.getItem('token');
                if (!token) return setLoading(false);
                const res = await axios.get('/api/grievances', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setGrievances(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchGrievances();
    }, []);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Resolved': return <CheckCircle className="text-green-500" size={18} />;
            case 'In Progress': return <Clock className="text-blue-500" size={18} />;
            case 'Pending': return <AlertCircle className="text-amber-500" size={18} />;
            default: return null;
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-8">
                {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium">{error}</div>}
                {success && <div className="bg-green-50 text-green-600 p-4 rounded-xl mb-6 text-sm font-medium">{success}</div>}
                <div className="bg-amber-600 rounded-3xl p-10 text-white flex items-center justify-between overflow-hidden relative shadow-lg">
                    <div className="relative z-10">
                        <h1 className="text-3xl font-extrabold mb-2">Grievance & Feedback</h1>
                        <p className="text-amber-50 text-lg">Report issues and track resolution status in real-time.</p>
                    </div>
                    <div className="bg-white/10 p-6 rounded-full relative z-10">
                        <MessageSquare size={40} />
                    </div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <Send className="text-amber-600" size={20} /> Submit New Grievance
                    </h2>
                    <form onSubmit={onSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Issue Category</label>
                                <select name="category" value={formData.category} onChange={onChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 outline-none bg-white font-medium">
                                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Issue Title</label>
                                <input type="text" name="subject" value={formData.subject} onChange={onChange} placeholder="Short summary" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 outline-none" required />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Detailed Description</label>
                            <textarea name="message" value={formData.message} onChange={onChange} rows="4" placeholder="Explain the problem in detail..." className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 outline-none" required></textarea>
                        </div>
                        <div className="flex items-center gap-4">
                            <ImageUpload
                                onUpload={(url) =>
                                    setFormData((prev) => ({ ...prev, evidence: url }))
                                }
                            />
                            {formData.evidence && (
                                <p className="text-xs text-green-600 font-medium">
                                    ✅ Evidence uploaded successfully
                                </p>
                            )}
                        </div>
                        <button type="submit" disabled={submitting} className="bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-amber-100">
                            {submitting ? 'Submitting...' : 'Submit Complaint'}
                        </button>
                    </form>
                </div>
            </div>

            <div className="lg:col-span-1 space-y-6">
                <h2 className="text-xl font-bold text-gray-800 px-2">Recent Submissions</h2>
                {loading ? (
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-amber-600"></div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {grievances.length > 0 ? (
                            grievances.map(item => (
                                <div key={item._id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-amber-200 transition-all cursor-pointer">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-gray-800 text-sm">{item.title}</h3>
                                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 rounded-full">
                                            {getStatusIcon(item.status)}
                                            <span className="text-[10px] font-black uppercase text-gray-500">{item.status}</span>
                                        </div>
                                    </div>
                                    <p className="text-gray-500 text-xs line-clamp-2">{item.description}</p>
                                </div>
                            ))
                        ) : (
                            <div className="bg-white p-10 rounded-3xl border border-dashed border-gray-200 text-center">
                                <p className="text-gray-400 font-medium">No complaints found. Your submissions will appear here.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Grievance;