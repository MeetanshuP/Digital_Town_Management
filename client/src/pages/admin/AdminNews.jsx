import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance";
import { Trash2, Plus } from "lucide-react";

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
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || !description) {
            alert("Title and description are required");
            return;
        }

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
            } else {
                if (!image) {
                    alert("Image is required");
                    return;
                }
                await axios.post("/news", formData);
            }

            setTitle("");
            setDescription("");
            setImage(null);
            setEditingId(null);

            fetchNews();

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this news?")) return;

        try {
            await axios.delete(`/news/${id}`);
            fetchNews();
        } catch (error) {
            console.error(error);
        }
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

                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                />

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