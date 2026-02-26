import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";

const getStatusColor = (status) => {
    switch (status) {
        case "placed":
            return "bg-yellow-100 text-yellow-700";
        case "accepted":
            return "bg-blue-100 text-blue-700";
        case "completed":
            return "bg-green-100 text-green-700";
        case "cancelled_by_seller":
            return "bg-red-100 text-red-700";
        default:
            return "bg-gray-100 text-gray-700";
    }
};

const SellerOrders = () => {
    const [orders, setOrders] = useState([]);

    const fetchOrders = async () => {
        try {
            const res = await axios.get("/marketplace/orders/seller");
            setOrders(res.data);
        } catch (err) {
            console.error(err.response?.data || err.message);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const updateStatus = async (orderId, action) => {
        try {
            await axios.patch(`/marketplace/orders/${orderId}/${action}`);
            fetchOrders();
        } catch (err) {
            console.error(err.response?.data || err.message);
        }
    };

    const calculateTotal = (items) => {
        return items.reduce(
            (total, item) => total + item.quantity * item.priceAtPurchase,
            0
        );
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6">Seller Orders</h2>

            {orders.length === 0 && (
                <p className="text-gray-500">No orders yet.</p>
            )}

            <div className="space-y-6">
                {orders.map(order => (
                    <div key={order._id} className="bg-white p-6 rounded-xl shadow">

                        {/* Header */}
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h3 className="font-semibold text-lg">
                                    Order #{order._id.slice(-6)}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {new Date(order.createdAt).toLocaleString()}
                                </p>
                            </div>

                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                {order.status}
                            </span>
                        </div>

                        {/* Buyer Info */}
                        <div className="mb-4 text-sm text-gray-600">
                            <p>Buyer: {order.buyer?.name}</p>
                            <p>Email: {order.buyer?.email}</p>
                        </div>

                        {/* Items */}
                        <div className="space-y-4">
                            {order.items.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between border-b pb-3"
                                >
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={item.product?.image?.url}
                                            alt={item.product?.title}
                                            className="h-16 w-16 object-cover rounded"
                                        />
                                        <div>
                                            <p className="font-medium">
                                                {item.product?.title}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Qty: {item.quantity}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="font-medium">
                                        ₹{item.priceAtPurchase * item.quantity}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Total */}
                        <div className="flex justify-between items-center mt-4 font-semibold">
                            <span>Total</span>
                            <span>₹{calculateTotal(order.items)}</span>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2 mt-4">
                            {order.status === "placed" && (
                                <button
                                    onClick={() => updateStatus(order._id, "accept")}
                                    className="bg-green-600 text-white px-4 py-1 rounded text-sm"
                                >
                                    Accept
                                </button>
                            )}

                            {order.status === "accepted" && (
                                <button
                                    onClick={() => updateStatus(order._id, "complete")}
                                    className="bg-blue-600 text-white px-4 py-1 rounded text-sm"
                                >
                                    Complete
                                </button>
                            )}

                            {order.status !== "completed" && (
                                <button
                                    onClick={() => updateStatus(order._id, "cancel")}
                                    className="bg-red-600 text-white px-4 py-1 rounded text-sm"
                                >
                                    Cancel
                                </button>
                            )}

                            {order.cancellationRequest === "requested" && (
                                <>
                                    <button
                                        onClick={() => updateStatus(order._id, "approve-cancel")}
                                        className="bg-yellow-500 text-white px-4 py-1 rounded text-sm"
                                    >
                                        Approve Cancel
                                    </button>

                                    <button
                                        onClick={() => updateStatus(order._id, "reject-cancel")}
                                        className="bg-gray-600 text-white px-4 py-1 rounded text-sm"
                                    >
                                        Reject Cancel
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SellerOrders;