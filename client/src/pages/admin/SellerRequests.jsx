import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance";

const SellerRequests = () => {
    const [requests, setRequests] = useState([]);

    const fetchRequests = async () => {
        try {
            const res = await axios.get("/seller/pending");
            setRequests(res.data);
        } catch (err) {
            console.error(err.response?.data || err.message);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const approve = async (userId) => {
        try {
            await axios.patch(`/seller/approve/${userId}`);
            fetchRequests();
        } catch (err) {
            console.error(err.response?.data || err.message);
        }
    };

    const reject = async (userId) => {
        try {
            await axios.patch(`/seller/reject/${userId}`);
            fetchRequests();
        } catch (err) {
            console.error(err.response?.data || err.message);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Seller Applications</h2>

            {requests.length === 0 && (
                <p className="text-gray-500">No pending seller requests.</p>
            )}

            <div className="space-y-4">
                {requests.map(user => (
                    <div
                        key={user._id}
                        className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
                    >
                        <div>
                            <h3 className="font-semibold">
                                {user.firstName} {user.lastName}
                            </h3>
                            <p className="text-gray-500">{user.email}</p>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => approve(user._id)}
                                className="bg-green-600 text-white px-4 py-1 rounded"
                            >
                                Approve
                            </button>

                            <button
                                onClick={() => reject(user._id)}
                                className="bg-red-600 text-white px-4 py-1 rounded"
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SellerRequests;
