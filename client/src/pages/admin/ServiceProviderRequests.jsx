import { useEffect, useState } from "react";
import axios from "axios";

const ServiceProviderRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get("/api/admin/service-providers", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => setRequests(res.data))
      .catch(console.error);
  }, []);

  const handleAction = async (id, action) => {
    const token = localStorage.getItem('token');
    await axios.patch(`/api/admin/service-providers/${id}`, { action }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setRequests(prev => prev.filter(r => r._id !== id));
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Service Provider Requests</h2>

      <div className="space-y-4">
        {requests.map(req => (
          <div key={req._id} className="bg-white p-4 rounded shadow">
            <p><strong>{req.user.firstName}</strong></p>
            <p>{req.serviceCategory}</p>

            <div className="flex gap-4 mt-3">
              <button
                onClick={() => handleAction(req._id, "APPROVE")}
                className="bg-green-600 text-white px-4 py-1 rounded"
              >
                Approve
              </button>
              <button
                onClick={() => handleAction(req._id, "REJECT")}
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

export default ServiceProviderRequests;
