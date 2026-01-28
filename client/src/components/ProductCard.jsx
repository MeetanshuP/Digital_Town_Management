import React from 'react';
import { ShoppingCart, User, Tag } from 'lucide-react';

const ProductCard = ({ product }) => {
    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all group">
            <div className="h-48 bg-gray-100 relative overflow-hidden">
                <img
                    src={product.images?.[0] || 'https://images.unsplash.com/photo-1595246140625-573b715d11dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-700 rounded-full text-xs font-bold shadow-sm">
                        {product.category}
                    </span>
                </div>
            </div>

            <div className="p-5">
                <h3 className="text-lg font-bold text-gray-800 mb-1">{product.name}</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>

                <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-green-700">₹{product.price}</span>
                    <div className="flex items-center text-gray-400 text-xs">
                        <User size={14} className="mr-1" />
                        {product.seller?.name || 'Local Seller'}
                    </div>
                </div>

                <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-100">
                    <ShoppingCart size={18} /> Contact Seller
                </button>
            </div>
        </div>
    );
};

export default ProductCard;