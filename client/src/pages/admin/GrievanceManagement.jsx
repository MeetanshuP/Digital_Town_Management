import { useEffect, useState, useRef } from "react";
import axios from "../../utils/axiosInstance";
import { MapPin, Trash2 } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import toast from "react-hot-toast";

// Define colored icons for different statuses
const iconRed = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
const iconBlue = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
const iconGreen = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const getIconForStatus = (status) => {
  if (status === "resolved") return iconGreen;
  if (status === "in_progress") return iconBlue;
  return iconRed; // open
};
const GrievanceManagement = () => {

  const [grievances, setGrievances] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const markerRefs = useRef({});
  const listRefs = useRef({});

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

  const deleteGrievance = (id) => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <p className="font-semibold">Are you sure you want to delete this resolved grievance?</p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await axios.delete(`/grievances/${id}`);
                setGrievances(prev => prev.filter(g => g._id !== id));
                toast.success("Grievance deleted successfully");
              } catch (error) {
                console.error("Error deleting grievance:", error);
                toast.error("Failed to delete grievance");
              }
            }}
            className="bg-red-500 text-white px-3 py-1 rounded text-sm transition hover:bg-red-600"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-gray-200 text-gray-800 px-3 py-1 rounded text-sm transition hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  // Map Updater Component to handle flying to selected pin
  function MapUpdater({ selectedId, grievances, markerRefs }) {
    const map = useMap();
    useEffect(() => {
      if (selectedId) {
        const g = grievances.find(x => x._id === selectedId);
        if (g && g.location) {
          map.flyTo([g.location.lat, g.location.lng], 16, { animate: true, duration: 1.5 });
          setTimeout(() => {
            if (markerRefs.current[selectedId]) {
              markerRefs.current[selectedId].openPopup();
            }
          }, 300);
        }
      }
    }, [selectedId, map, grievances, markerRefs]);
    return null;
  }

  const handleListClick = (id) => {
    setSelectedId(id);
  };

  const handleMarkerClick = (id) => {
    setSelectedId(id);
    if (listRefs.current[id]) {
      listRefs.current[id].scrollIntoView({ behavior: 'smooth', block: 'center' });
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

      <div className="grid lg:grid-cols-2 gap-6 items-start">

        {/* Left Side: Grievance List */}
        <div className="space-y-4 overflow-y-auto pr-2 max-h-[800px]">

          {grievances.length === 0 && (
            <p className="text-gray-500">No grievances found.</p>
          )}

          {grievances.map(g => (

            <div
              key={g._id}
              ref={(el) => listRefs.current[g._id] = el}
              onClick={() => handleListClick(g._id)}
              className={`bg-white p-5 rounded-xl shadow-sm border cursor-pointer transition-colors ${selectedId === g._id ? 'border-orange-500 ring-2 ring-orange-200' : 'hover:border-gray-400'}`}
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

              {g.location && (
                <p className="text-sm text-blue-600 flex items-center gap-1 mt-2 bg-blue-50 p-2 rounded w-fit">
                  <MapPin size={16} /> 
                  {g.location.address || `Lat: ${g.location.lat}, Lng: ${g.location.lng}`}
                </p>
              )}

              {g.evidence?.url && (
                <div className="mt-4">
                  <img
                    src={g.evidence.url}
                    alt="Grievance Evidence"
                    className="w-full max-w-sm rounded-lg object-cover border border-gray-200"
                  />
                </div>
              )}

              <div className="flex justify-between items-center mt-4">
                <div className="flex gap-3">
                  {g.status === "open" && (
                    <button
                      onClick={(e) => { e.stopPropagation(); updateStatus(g._id, "in_progress"); }}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                    >
                      Mark In Progress
                    </button>
                  )}

                  {g.status === "in_progress" && (
                    <button
                      onClick={(e) => { e.stopPropagation(); updateStatus(g._id, "resolved"); }}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                    >
                      Mark Resolved
                    </button>
                  )}
                </div>

                {g.status === "resolved" && (
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteGrievance(g._id); }}
                    className="flex items-center gap-1 text-red-500 hover:text-red-700 text-sm transition"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                )}

              </div>

            </div>

          ))}

        </div>

        {/* Right Side: Admin Grievances Map Overview */}
        <div className="lg:sticky lg:top-24 h-[600px] w-full rounded-xl overflow-hidden border border-gray-300 shadow-sm relative z-0">
          <MapContainer center={[23.2156, 72.6369]} zoom={13} style={{ height: "100%", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapUpdater selectedId={selectedId} grievances={grievances} markerRefs={markerRefs} />
            
            {grievances.map(g => {
              if (g.location && g.location.lat && g.location.lng) {
                return (
                  <Marker 
                    key={`map-${g._id}`} 
                    position={[g.location.lat, g.location.lng]} 
                    icon={getIconForStatus(g.status)}
                    ref={(el) => markerRefs.current[g._id] = el}
                    eventHandlers={{
                      click: () => handleMarkerClick(g._id)
                    }}
                  >
                    <Popup>
                      <strong>{g.subject}</strong><br/>
                      Status: <span className="uppercase text-xs font-bold">{g.status.replace("_", " ")}</span><br/>
                      <span className="text-xs text-gray-500">{g.location.address || "Location pinned"}</span>
                    </Popup>
                  </Marker>
                );
              }
              return null;
            })}
          </MapContainer>
        </div>

      </div>

    </div>
  );
};

export default GrievanceManagement;