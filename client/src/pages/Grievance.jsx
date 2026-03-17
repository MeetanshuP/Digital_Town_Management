import { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import {
    MessageCircle,
    Trash2,
    Upload,
    Clock,
    Loader,
    CheckCircle
} from "lucide-react";

const Grievance = () => {

    const [form, setForm] = useState({
        subject: "",
        message: "",
        category: "general"
    });

    const [file, setFile] = useState(null);
    const [grievances, setGrievances] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchGrievances = async () => {
        try {
            const res = await axios.get("/grievances");
            setGrievances(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchGrievances();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("subject", form.subject);
            formData.append("message", form.message);
            formData.append("category", form.category);

            if (file) {
                formData.append("evidence", file);
            }

            const res = await axios.post("/grievances", formData);
            const newGrievance = res.data.grievance;

            setGrievances(prev => [newGrievance, ...prev]);

            setForm({
                subject: "",
                message: "",
                category: "general"
            });

            setFile(null);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const deleteGrievance = async (id) => {
        if (!window.confirm("Delete grievance?")) return;

        try {
            await axios.delete(`/grievances/${id}`);
            setGrievances(prev => prev.filter(g => g._id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    const statusConfig = {
        open: {
            label: "Open",
            icon: Clock,
            className: "bg-yellow-100 text-yellow-700 border border-yellow-200"
        },
        in_progress: {
            label: "In Progress",
            icon: Loader,
            className: "bg-blue-100 text-blue-700 border border-blue-200"
        },
        resolved: {
            label: "Resolved",
            icon: CheckCircle,
            className: "bg-green-100 text-green-700 border border-green-200"
        }
    };

    return (
        <div className="space-y-8">

            {/* HEADER */}
            <div className="bg-orange-500 text-white rounded-xl p-6 flex justify-between items-center shadow">
                <div>
                    <h1 className="text-xl font-bold">
                        Grievance & Feedback
                    </h1>
                    <p className="text-sm opacity-90">
                        Report issues and track resolution status in real-time.
                    </p>
                </div>
                <MessageCircle size={28} />
            </div>

            <div className="grid md:grid-cols-3 gap-6">

                {/* LEFT SIDE FORM */}
                <div className="md:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm p-6">

                        <h2 className="text-lg font-semibold mb-4">
                            Submit New Grievance
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">

                            <input
                                name="subject"
                                placeholder="Issue Title"
                                value={form.subject}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-2"
                                required
                            />

                            <textarea
                                name="message"
                                placeholder="Detailed Description"
                                value={form.message}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-2"
                                rows="3"
                                required
                            />

                            <select
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-2"
                            >
                                <option value="general">General</option>
                                <option value="complaint">Complaint</option>
                                <option value="feedback">Feedback</option>
                                <option value="suggestion">Suggestion</option>
                            </select>

                            <div className="flex items-center gap-3">
                                <Upload size={18} />
                                <input
                                    type="file"
                                    onChange={(e) => setFile(e.target.files[0])}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg transition"
                            >
                                {loading ? "Submitting..." : "Submit Complaint"}
                            </button>

                        </form>

                    </div>
                </div>

                {/* RIGHT SIDE — MY GRIEVANCES */}
                <div className="space-y-4">

                    <div className="bg-white rounded-xl shadow-sm p-4">

                        <h3 className="font-semibold mb-3">
                            My Grievances
                        </h3>

                        {grievances.length === 0 && (
                            <p className="text-gray-500 text-sm">
                                No grievances submitted yet.
                            </p>
                        )}

                        {grievances.slice(0, 5).map(g => (

                            <div
                                key={g._id}
                                className="border rounded-lg p-3 mb-3 space-y-2 bg-white transition-all duration-300 ease-in-out hover:shadow-md hover:-translate-y-1 hover:scale-[1.01]"
                            >

                                <div className="flex justify-between items-center">
                                    <p className="text-sm font-medium">
                                        {g.subject}
                                    </p>

                                    {(() => {
                                        const status = statusConfig[g.status];
                                        const Icon = status.icon;

                                        return (
                                            <span className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${status.className}`}>
                                                <Icon size={12} />
                                                {status.label}
                                            </span>
                                        );
                                    })()}
                                </div>

                                <p className="text-xs text-gray-600">
                                    {g.message}
                                </p>

                                {g.evidence?.url && (
                                    <img
                                        src={g.evidence.url}
                                        alt="Evidence"
                                        className="w-full h-28 object-cover rounded-md"
                                    />
                                )}

                                <button
                                    onClick={() => deleteGrievance(g._id)}
                                    className="flex items-center gap-1 text-red-500 text-xs hover:text-red-700 transition"
                                >
                                    <Trash2 size={14} />
                                    Delete
                                </button>

                            </div>

                        ))}

                    </div>

                </div>

            </div>

        </div>
    );
};

export default Grievance;