import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { Search, ShoppingBag, Plus } from 'lucide-react';

const Marketplace = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get('/api/marketplace');
                setProducts(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    return (
        <div className="space-y-8">
            <div className="bg-indigo-600 rounded-3xl p-10 text-white flex items-center justify-between overflow-hidden relative shadow-lg">
                <div className="relative z-10">
                    <h1 className="text-4xl font-extrabold mb-2">Local Marketplace</h1>
                    <p className="text-indigo-100 text-lg">Buy and sell local products, handicrafts, and services within the community.</p>
                </div>
                <div className="bg-white/10 p-6 rounded-full relative z-10">
                    <ShoppingBag size={48} />
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search products, services, rentals..."
                        className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm"
                    />
                </div>
                <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-green-100 w-full md:w-auto justify-center">
                    <Plus size={20} /> List Your Item
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {products.length > 0 ? (
                        products.map(product => <ProductCard key={product._id} product={product} />)
                    ) : (
                        <div className="col-span-full py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                            <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
                            <h3 className="text-xl font-bold text-gray-400">No products listed yet.</h3>
                            <p className="text-gray-400 mt-2">Check back later or be the first to sell something!</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Marketplace;