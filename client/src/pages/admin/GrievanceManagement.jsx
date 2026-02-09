import { useEffect, useState } from "react";
import axios from "axios";

const GrievanceManagement = () => {
  const [grievances, setGrievances] = useState([]);

  useEffect(() => {
    const fetchGrievances = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const res = await axios.get("/api/admin/grievances", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setGrievances(res.data);
      } catch (error) {
        console.error("Error fetching grievances:", error);
      }
    };
    fetchGrievances();
  }, []);

  const updateStatus = async (id, status) => {
    const token = sessionStorage.getItem('token');
    await axios.patch(`/api/admin/grievances/${id}`, { status }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setGrievances(prev =>
      prev.map(g => g._id === id ? { ...g, status } : g)
    );
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Grievances</h2>

      <div className="space-y-4">
        {grievances.map(g => (
          <div key={g._id} className="bg-white p-4 rounded shadow">
            <p className="font-semibold">{g.subject}</p>
            <p className="text-sm text-gray-500">{g.message}</p>

            <div className="flex gap-3 mt-3">
              <button onClick={() => updateStatus(g._id, "In Progress")}
                className="bg-blue-600 text-white px-3 py-1 rounded">
                In Progress
              </button>
              <button onClick={() => updateStatus(g._id, "Resolved")}
                className="bg-green-600 text-white px-3 py-1 rounded">
                Resolved
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GrievanceManagement;
