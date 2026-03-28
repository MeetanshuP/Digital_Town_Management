import { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import {
    MessageCircle,
    Trash2,
    Upload,
    Clock,
    Loader,
    CheckCircle,
    MapPin
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import toast from "react-hot-toast";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const Grievance = () => {

    const [form, setForm] = useState({
        subject: "",
        message: "",
        category: "general"
    });

    const [file, setFile] = useState(null);
    const [location, setLocation] = useState(null);
    const [grievances, setGrievances] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleGetLocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                try {
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
                    const data = await res.json();
                    setLocation({ lat, lng, address: data.display_name });
                } catch (e) {
                    setLocation({ lat, lng, address: "Location pinned" });
                }
            });
        }
    };

    function ChangeView({ center }) {
        const map = useMap();
        map.setView(center, 18); // Max detailed zoom when location is selected
        return null;
    }

    function LocationMarker() {
        useMapEvents({
            click(e) {
                const { lat, lng } = e.latlng;
                fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
                    .then(res => res.json())
                    .then(data => {
                        setLocation({ lat, lng, address: data.display_name });
                    })
                    .catch(() => {
                        setLocation({ lat, lng, address: "Location pinned" });
                    });
            },
        });

        return location === null ? null : (
            <Marker position={[location.lat, location.lng]}>
                <Popup>{location.address}</Popup>
            </Marker>
        );
    }

    const fetchGrievances = async () => {
        try {
            const res = await axios.get("/grievances");
            setGrievances(res.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load your past grievances.");
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

        if (!form.subject || !form.message) {
            toast.error("Please enter a subject and message.");
            return;
        }

        const tid = toast.loading("Submitting your grievance...");

        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("subject", form.subject);
            formData.append("message", form.message);
            formData.append("category", form.category);

            if (file) {
                formData.append("evidence", file);
            }
            if (location) {
                formData.append("location", JSON.stringify(location));
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
            setLocation(null);

            const fileInput = document.querySelector('input[type="file"]');
            if (fileInput) fileInput.value = "";

            toast.success("Grievance submitted successfully!", { id: tid });

        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to submit grievance", { id: tid });
        } finally {
            setLoading(false);
        }
    };

    const deleteGrievance = (id) => {
        toast((t) => (
            <div className="flex flex-col gap-2">
                <p className="font-semibold text-gray-800">Delete this grievance?</p>
                <div className="flex gap-2">
                    <button
                        onClick={async () => {
                            toast.dismiss(t.id);
                            try {
                                await axios.delete(`/grievances/${id}`);
                                setGrievances(prev => prev.filter(g => g._id !== id));
                                toast.success("Grievance deleted");
                            } catch (error) {
                                console.error(error);
                                toast.error("Failed to delete grievance");
                            }
                        }}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition"
                    >
                        Delete
                    </button>
                    <button onClick={() => toast.dismiss(t.id)} className="bg-gray-200 text-gray-800 px-3 py-1 rounded text-sm transition hover:bg-gray-300">
                        Cancel
                    </button>
                </div>
            </div>
        ), { id: `delete-${id}` });
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

    const handleGrievanceClick = (g) => {
        if (g.location) {
            setLocation({
                lat: g.location.lat,
                lng: g.location.lng,
                address: g.location.address
            });
            window.scrollTo({ top: 0, behavior: 'smooth' });
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



                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Attach Evidence (Optional)</label>
                                {!file ? (
                                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100/80 transition-colors">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <Upload className="w-8 h-8 mb-3 text-gray-400" />
                                            <p className="mb-1 text-sm text-gray-500"><span className="font-semibold text-orange-500">Click to upload</span> or drag and drop</p>
                                            <p className="text-xs text-gray-400">PNG, JPG or JPEG (MAX. 5MB)</p>
                                        </div>
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => setFile(e.target.files[0])}
                                        />
                                    </label>
                                ) : (
                                    <div className="relative group w-full h-48 sm:h-64 rounded-xl overflow-hidden shadow-sm border border-gray-200">
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt="Preview"
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setFile(null);
                                                    const fileInput = document.querySelector('input[type="file"]');
                                                    if (fileInput) fileInput.value = "";
                                                }}
                                                className="bg-red-500/90 text-white px-5 py-2.5 rounded-lg font-medium shadow-xl hover:bg-red-600 transition-colors flex items-center gap-2"
                                            >
                                                <Trash2 size={18} /> Remove Image
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Map Location Picker */}
                            <div className="border rounded-lg p-4 space-y-3 bg-gray-50">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-medium text-gray-700">Pin Location on Map</label>
                                    <button
                                        type="button"
                                        onClick={handleGetLocation}
                                        className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-md flex items-center gap-1 hover:bg-blue-200"
                                    >
                                        <MapPin size={14} /> Use My Location
                                    </button>
                                </div>
                                <div className="h-80 rounded-lg overflow-hidden border border-gray-300 relative z-0">
                                    <MapContainer center={[23.2156, 72.6369]} zoom={13} style={{ height: "100%", width: "100%" }}>
                                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                        <LocationMarker />
                                        {location && <ChangeView center={[location.lat, location.lng]} />}
                                    </MapContainer>
                                </div>
                                {location && (
                                    <p className="text-xs text-gray-500 mt-2">
                                        <span className="font-semibold text-gray-700">Address:</span> {location.address}
                                    </p>
                                )}
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
                                onClick={() => handleGrievanceClick(g)}
                                className="border rounded-lg p-3 mb-3 space-y-2 bg-white transition-all duration-300 ease-in-out hover:shadow-md hover:-translate-y-1 hover:scale-[1.01] cursor-pointer"
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

                                {g.location && (
                                    <p className="text-xs text-blue-600 flex items-center gap-1 bg-blue-50 p-1.5 rounded">
                                        <MapPin size={12} /> {g.location.address || "Location pinned"}
                                    </p>
                                )}

                                {g.evidence?.url && (
                                    <img
                                        src={g.evidence.url}
                                        alt="Evidence"
                                        className="w-full h-28 object-cover rounded-md"
                                    />
                                )}

                                <button
                                    onClick={(e) => { e.stopPropagation(); deleteGrievance(g._id); }}
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