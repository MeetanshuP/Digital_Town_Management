import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix marker icon issue (VERY IMPORTANT)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const RouteMap = ({ userLocation, serviceLocation }) => {
    const [routeCoords, setRouteCoords] = useState([]);
    const [routeInfo, setRouteInfo] = useState(null);

    useEffect(() => {
        if (!userLocation || !serviceLocation) return;

        const fetchRoute = async () => {
            try {
                const url = `https://router.project-osrm.org/route/v1/driving/${userLocation.lng},${userLocation.lat};${serviceLocation.lng},${serviceLocation.lat}?overview=full&geometries=geojson`;

                const res = await fetch(url);
                const data = await res.json();

                if (data.routes && data.routes.length > 0) {
                    const route = data.routes[0];

                    // Convert coordinates to Leaflet format [lat, lng]
                    const coords = route.geometry.coordinates.map(coord => [
                        coord[1],
                        coord[0]
                    ]);

                    setRouteCoords(coords);

                    setRouteInfo({
                        distance: (route.distance / 1000).toFixed(2), // km
                        duration: (route.duration / 60).toFixed(0) // minutes
                    });
                }
            } catch (error) {
                console.error("Error fetching route:", error);
            }
        };

        fetchRoute();
    }, [userLocation, serviceLocation]);

    if (!userLocation || !serviceLocation) {
        return <p>Loading route...</p>;
    }

    return (
        <div>
            {/* Route Info */}
            {routeInfo && (
                <div style={{ marginBottom: "10px" }}>
                    <strong>Distance:</strong> {routeInfo.distance} km |{" "}
                    <strong>Time:</strong> {routeInfo.duration} mins
                </div>
            )}

            {/* Map */}
            <MapContainer
                center={[userLocation.lat, userLocation.lng]}
                zoom={13}
                style={{ height: "400px", width: "100%" }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* User Marker */}
                <Marker position={[userLocation.lat, userLocation.lng]}>
                    <Popup>Your Location</Popup>
                </Marker>

                {/* Service Marker */}
                <Marker position={[serviceLocation.lat, serviceLocation.lng]}>
                    <Popup>Service Location</Popup>
                </Marker>

                {/* Route Line */}
                {routeCoords.length > 0 && (
                    <Polyline positions={routeCoords} />
                )}
            </MapContainer>
        </div>
    );
};

export default RouteMap;