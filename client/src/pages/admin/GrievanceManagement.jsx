import { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance";

const GrievanceManagement = () => {

  const [grievances, setGrievances] = useState([]);

  const fetchGrievances = async () => {
    try {

      const res = await axios.get("/admin/grievances");
      setGrievances(res.data);

    } catch (error) {
      console.error("Error fetching grievances:", error);
    }
  };

  useEffect(() => {
    fetchGrievances();
  }, []);

  const updateStatus = async (id, status) => {

    try {

      await axios.patch(`/admin/grievances/${id}`, { status });

      fetchGrievances();

    } catch (error) {
      console.error("Error updating status:", error);
    }

  };

  const statusStyles = {
    open: "bg-yellow-100 text-yellow-700",
    in_progress: "bg-blue-100 text-blue-700",
    resolved: "bg-green-100 text-green-700"
  };

  return (
    <div className="space-y-6">

      <h2 className="text-xl font-bold">
        Grievance Management
      </h2>

      <div className="space-y-4">

        {grievances.map(g => (

          <div
            key={g._id}
            className="bg-white p-5 rounded-xl shadow-sm border"
          >

            <div className="flex justify-between items-center">

              <p className="font-semibold">
                {g.subject}
              </p>

              <span
                className={`text-xs px-2 py-1 rounded ${statusStyles[g.status]}`}
              >
                {g.status.replace("_", " ")}
              </span>

            </div>

            <p className="text-sm text-gray-500 mt-2">
              {g.message}
            </p>

            {g.evidence?.url && (
              <div className="mt-4">
                <img
                  src={g.evidence.url}
                  alt="Grievance Evidence"
                  className="w-full max-w-sm rounded-lg object-cover border border-gray-200"
                />
              </div>
            )}

            <div className="flex gap-3 mt-4">

              {g.status === "open" && (
                <button
                  onClick={() => updateStatus(g._id, "in_progress")}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                >
                  In Progress
                </button>
              )}

              {g.status !== "resolved" && (
                <button
                  onClick={() => updateStatus(g._id, "resolved")}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                >
                  Resolved
                </button>
              )}

            </div>

          </div>

        ))}

      </div>

    </div>
  );
};

export default GrievanceManagement;