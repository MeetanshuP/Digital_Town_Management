import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance";
import { Trash2, Plus, Upload } from "lucide-react";
import toast from "react-hot-toast";

const AdminNews = () => {
    const [news, setNews] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const fetchNews = async () => {
        try {
            const res = await axios.get("/news");
            setNews(res.data.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load news");
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || !description) {
            toast.error("Title and description are required");
            return;
        }
        
        const tid = toast.loading(editingId ? "Updating news..." : "Adding news...");

        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);

            if (image) {
                formData.append("image", image);
            }

            if (editingId) {
                await axios.put(`/news/${editingId}`, formData);
                toast.success("News updated successfully!", { id: tid });
            } else {
                if (!image && !editingId) {
                    toast.error("Image is required", { id: tid });
                    setLoading(false);
                    return;
                }
                await axios.post("/news", formData);
                toast.success("News added successfully!", { id: tid });
            }

            setTitle("");
            setDescription("");
            setImage(null);
            setEditingId(null);
            
            const fileInput = document.querySelector('input[type="file"]');
            if (fileInput) fileInput.value = "";

            fetchNews();

        } catch (error) {
            console.error(error);
            toast.error("An error occurred. Please try again.", { id: tid });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id) => {
        toast((t) => (
            <div className="flex flex-col gap-2">
                <p className="font-semibold">Are you sure you want to delete this news?</p>
                <div className="flex gap-2">
                    <button
                        onClick={async () => {
                            toast.dismiss(t.id);
                            try {
                                await axios.delete(`/news/${id}`);
                                toast.success("News deleted successfully");
                                fetchNews();
                            } catch (error) {
                                console.error(error);
                                toast.error("Failed to delete news");
                            }
                        }}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm transition hover:bg-red-600"
                    >
                        Delete
                    </button>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="bg-gray-200 text-gray-800 px-3 py-1 rounded text-sm transition hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        ), { duration: Infinity });
    };

    return (
        <div className="space-y-8">

            <h1 className="text-2xl font-bold text-gray-800">
                News Management
            </h1>

            {/* Add News Form */}
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-xl shadow-sm border space-y-4"
            >
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Plus size={18} /> Add News
                </h2>

                <input
                    type="text"
                    placeholder="Title"
                    className="w-full border rounded-lg p-3"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <textarea
                    placeholder="Description"
                    className="w-full border rounded-lg p-3"
                    rows="4"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">News Image</label>
                    {!image ? (
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100/80 transition-colors">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 mb-3 text-gray-400" />
                                <p className="mb-1 text-sm text-gray-500"><span className="font-semibold text-blue-600">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-gray-400">PNG, JPG or JPEG (MAX. 5MB)</p>
                            </div>
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => setImage(e.target.files[0])}
                            />
                        </label>
                    ) : (
                        <div className="relative group w-full h-48 sm:h-64 rounded-xl overflow-hidden shadow-sm border border-gray-200">
                            <img
                                src={typeof image === "string" ? image : URL.createObjectURL(image)}
                                alt="Preview"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setImage(null);
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

                <div className="flex items-center gap-3">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-black text-white px-6 py-2 rounded-lg"
                    >
                        {loading ? "Processing..." : editingId ? "Update News" : "Add News"}
                    </button>

                    {editingId && (
                        <button
                            type="button"
                            onClick={() => {
                                setEditingId(null);
                                setTitle("");
                                setDescription("");
                                setImage(null);
                                const fileInput = document.querySelector('input[type="file"]');
                                if (fileInput) fileInput.value = "";
                            }}
                            className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            {/* News List */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.map((item) => (
                    <div
                        key={item._id}
                        className="bg-white rounded-xl shadow-sm border overflow-hidden"
                    >
                        <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-48 object-cover"
                        />

                        <div className="p-4 space-y-2">
                            <h3 className="font-bold text-lg">
                                {item.title}
                            </h3>

                            <p className="text-gray-600 text-sm">
                                {item.description}
                            </p>

                            <div className="flex items-center gap-4 mt-3">
                                <button
                                    onClick={() => {
                                        setEditingId(item._id);
                                        setTitle(item.title);
                                        setDescription(item.description);
                                    }}
                                    className="text-blue-600 text-sm font-medium"
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() => handleDelete(item._id)}
                                    className="flex items-center gap-2 text-red-600 text-sm font-medium"
                                >
                                    <Trash2 size={16} /> Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </div >
    );
};

export default AdminNews;