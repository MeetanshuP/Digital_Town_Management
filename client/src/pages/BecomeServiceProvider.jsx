import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Briefcase, MapPin, FileText, Award } from 'lucide-react';

const BecomeServiceProvider = () => {
    const { applyForServiceProvider } = useAuth();
    const navigate = useNavigate();
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);


    const [form, setForm] = useState({
        serviceCategory: '',
        serviceTitle: '',
        description: '',
        // experience: '',
        // location: '',
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
        const res = await applyForServiceProvider(form);
        setSuccess(res.message || 'Request submitted successfully');

        // optional: redirect after short delay
        setTimeout(() => {
            navigate('/');
        }, 1500);
    } catch (err) {
        setError(err.response?.data?.message || 'Submission failed');
    } finally {
        setSubmitting(false);
    }
};



    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg border border-gray-100">
                {/* Header */}
                <div className="bg-green-50 rounded-t-2xl px-6 py-5 border-b">
                    <h2 className="text-2xl font-bold text-green-700">
                        Become a Service Provider
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Share your skills and start serving your community
                    </p>
                </div>

                {/* Form */}
                {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm font-medium mb-4">
                    {error}
                </div>
                )}

                {success && (
                    <div className="bg-green-50 text-green-700 p-4 rounded-lg text-sm font-medium mb-4">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Service Category */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
                            <Briefcase size={16} /> Service Category
                        </label>
                        <select
                            name="serviceCategory"
                            value={form.serviceCategory}
                            required
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                        >
                            <option value="">Select Service</option>
                            <option>Electrician</option>
                            <option>Plumber</option>
                            <option>Cleaner</option>
                            <option>Mechanic</option>
                        </select>
                    </div>

                    {/* Service Title */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
                            <Award size={16} /> Service Title
                        </label>
                        <input
                            name="serviceTitle"
                            value={form.serviceTitle}
                            // placeholder="e.g. Certified Home Electrician"
                            required
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
                            <FileText size={16} /> Description
                        </label>
                        <textarea
                            name="description"
                            rows="4"
                            placeholder="Describe your service, experience, and skills"
                            required
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                        />
                    </div>

                    {/* Experience & Location */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">
                                Experience (Years)
                            </label>
                            <input
                                name="experience"
                                type="number"
                                min="0"
                                placeholder="e.g. 5"
                                required
                                onChange={handleChange}
                                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                            />
                        </div> */}

                        {/* <div>
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
                                <MapPin size={16} /> Location
                            </label>
                            <input
                                name="location"
                                placeholder="City / Area"
                                required
                                onChange={handleChange}
                                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                            />
                        </div> */}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-lg transition-all shadow-sm"
                    >
                        {submitting ? 'Submitting...' : 'Submit Application'}
                    </button>

                    <p className="text-xs text-gray-500 text-center mt-2">
                        Your application will be reviewed by the admin
                    </p>
                </form>
            </div>
        </div>
    );
};

export default BecomeServiceProvider;
