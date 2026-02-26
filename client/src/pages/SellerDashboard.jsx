import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import SellerProducts from "./SellerProducts";
import SellerOrders from "./SellerOrders";

const SellerDashboard = () => {
    const [tab, setTab] = useState("products");
    const { toggleSellerMode, logout } = useAuth();
    const navigate = useNavigate();

    const handleBackToBuyer = () => {
        toggleSellerMode();
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-white shadow p-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-purple-700">
                    Seller Dashboard
                </h1>

                <div className="flex gap-4">
                    <button
                        onClick={handleBackToBuyer}
                        className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                    >
                        Switch to Buyer Mode
                    </button>

                    <button
                        onClick={logout}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Logout
                    </button>
                </div>
            </div>

            <div className="flex gap-4 p-6">
                <button
                    onClick={() => setTab("products")}
                    className={`px-4 py-2 rounded ${tab === "products"
                        ? "bg-purple-600 text-white"
                        : "bg-gray-200"
                        }`}
                >
                    My Products
                </button>

                <button
                    onClick={() => setTab("orders")}
                    className={`px-4 py-2 rounded ${tab === "orders"
                        ? "bg-purple-600 text-white"
                        : "bg-gray-200"
                        }`}
                >
                    Orders
                </button>
            </div>

            <div className="px-6 pb-10">
                {tab === "products" && <SellerProducts />}
                {tab === "orders" && <SellerOrders />}
            </div>
        </div>
    );
};

export default SellerDashboard;