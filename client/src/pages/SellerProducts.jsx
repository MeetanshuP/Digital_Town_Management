import React, { useEffect, useRef, useState } from "react";
import axios from "../utils/axiosInstance";

const SellerProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const fileInputRef = useRef(null);

    const [form, setForm] = useState({
        title: "",
        price: "",
        category: "fruits",
        image: null
    });

    const fetchProducts = async () => {
        try {
            const res = await axios.get("/marketplace/seller/products");
            setProducts(res.data);
        } catch (err) {
            console.error(err.response?.data || err.message);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setForm({ ...form, image: e.target.files[0] });
    };

    const validateForm = () => {
        if (!form.title.trim()) {
            alert("Title is required");
            return false;
        }

        if (!form.price || isNaN(form.price) || Number(form.price) <= 0) {
            alert("Enter a valid price");
            return false;
        }

        if (!form.image) {
            alert("Please select an image");
            return false;
        }

        return true;
    };

    const handleAddProduct = async () => {
        if (!validateForm()) return;

        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("title", form.title.trim());
            formData.append("price", Number(form.price));
            formData.append("category", form.category);
            formData.append("image", form.image);

            await axios.post("/marketplace/products", formData);

            // Reset form state
            setForm({
                title: "",
                price: "",
                category: "fruits",
                image: null
            });

            // Clear file input manually
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

            await fetchProducts();
        } catch (err) {
            alert(err.response?.data?.message || "Error adding product");
        } finally {
            setLoading(false);
        }
    };

    const toggleAvailability = async (productId, availability) => {
        try {
            await axios.patch(
                `/marketplace/products/${productId}/availability`,
                { availability }
            );
            fetchProducts();
        } catch (err) {
            console.error(err.response?.data || err.message);
        }
    };

    const deleteProduct = async (productId) => {
        try {
            await axios.delete(`/marketplace/products/${productId}`);
            fetchProducts();
        } catch (err) {
            console.error(err.response?.data || err.message);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6">My Products</h2>

            {/* Add Product Form */}
            <div className="bg-white p-6 rounded-xl shadow mb-8">
                <h3 className="font-semibold mb-4">Add Product</h3>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="Title"
                        className="border p-2 rounded"
                    />

                    <input
                        name="price"
                        type="number"
                        min="0"
                        value={form.price}
                        onChange={handleChange}
                        placeholder="Price"
                        className="border p-2 rounded"
                    />

                    <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className="border p-2 rounded"
                    >
                        <option value="fruits">Fruits</option>
                        <option value="vegetables">Vegetables</option>
                    </select>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        className="border p-2 rounded"
                    />
                </div>

                <button
                    onClick={handleAddProduct}
                    disabled={loading}
                    className={`mt-4 px-4 py-2 rounded text-white ${loading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-purple-600 hover:bg-purple-700"
                        }`}
                >
                    {loading ? "Adding..." : "Add Product"}
                </button>
            </div>

            {/* Product List */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {products.map((product) => (
                    <div key={product._id} className="bg-white p-4 rounded-xl shadow">
                        <img
                            src={product.image?.url}
                            alt={product.title}
                            className="h-40 w-full object-cover rounded mb-4"
                        />

                        <h4 className="font-semibold">{product.title}</h4>
                        <p className="text-gray-500">₹ {product.price}</p>

                        <p className="text-sm mt-2">
                            Status: {product.availability}
                        </p>

                        <div className="flex gap-2 mt-4">
                            <button
                                onClick={() =>
                                    toggleAvailability(
                                        product._id,
                                        product.availability === "available"
                                            ? "out_of_stock"
                                            : "available"
                                    )
                                }
                                className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                            >
                                Toggle Availability
                            </button>

                            <button
                                onClick={() => deleteProduct(product._id)}
                                className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SellerProducts;