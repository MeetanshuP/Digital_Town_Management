import React, { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
  Polyline
} from "react-leaflet";
import L from "leaflet";

// Fix default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Change map center
const ChangeView = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);
  return null;
};

// Map click handler
const MapEvents = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng);
    },
  });
  return null;
};

const ServiceMap = ({
  services,
  center,
  userLocation,
  selectedServiceId,
  selectedService,
  onUserLocationChange,
  onMarkerClick,
  radius,
}) => {
  const map = useMap();
  const markerRefs = useRef({});

  // Route state
  const [routeCoords, setRouteCoords] = useState([]);

  // Fit map to search radius
  useEffect(() => {
    if (userLocation && radius) {
      const bounds = L.latLng(userLocation.lat, userLocation.lng).toBounds(radius * 2);
      map.fitBounds(bounds, { padding: [20, 20], animate: true, duration: 1.5 });
    }
  }, [userLocation, radius, map]);

  // User icon
  const userIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  // Focus selected service
  useEffect(() => {
    if (selectedServiceId && markerRefs.current[selectedServiceId]) {
      const selected = services.find((s) => s._id === selectedServiceId);

      if (selected) {
        const lat =
          selected.latitude ||
          selected.location?.coordinates?.[1];
        const lng =
          selected.longitude ||
          selected.location?.coordinates?.[0];

        if (lat && lng) {
          map.flyTo([lat, lng], 15, { duration: 1.5 });

          setTimeout(() => {
            markerRefs.current[selectedServiceId]?.openPopup();
          }, 500);
        }
      }
    }
  }, [selectedServiceId, services, map]);

  // ROUTE LOGIC (MAIN FEATURE)
  useEffect(() => {
    if (!userLocation || !selectedService) {
      setRouteCoords([]);
      return;
    }

    const fetchRoute = async () => {
      try {
        const lat = selectedService.latitude;
        const lng = selectedService.longitude;

        if (!lat || !lng) return;

        const url = `https://router.project-osrm.org/route/v1/driving/${userLocation.lng},${userLocation.lat};${lng},${lat}?overview=full&geometries=geojson`;

        const res = await fetch(url);
        const data = await res.json();

        if (data.routes && data.routes.length > 0) {
          const coords = data.routes[0].geometry.coordinates.map(
            (coord) => [coord[1], coord[0]]
          );

          setRouteCoords(coords);

          // Auto zoom to route
          const bounds = L.latLngBounds(coords);
          map.fitBounds(bounds, { padding: [50, 50], animate: true, duration: 1.5 });
        }
      } catch (err) {
        console.error("Route error:", err);
      }
    };

    fetchRoute();
  }, [userLocation, selectedService, map]);

  return (
    <>
      <ChangeView center={center} />
      <MapEvents onMapClick={onUserLocationChange} />

      <TileLayer
        attribution="© OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* User Marker */}
      {userLocation && (
        <Marker
          position={[userLocation.lat, userLocation.lng]}
          icon={userIcon}
          draggable={true}
          eventHandlers={{
            dragend: (e) => {
              const pos = e.target.getLatLng();
              onUserLocationChange(pos);
            },
          }}
        >
          <Popup>Your Location</Popup>
        </Marker>
      )}

      {/* Service Markers */}
      {services.map((service) => {
        const lat =
          service.latitude ||
          service.location?.coordinates?.[1];
        const lng =
          service.longitude ||
          service.location?.coordinates?.[0];

        if (!lat || !lng) return null;

        return (
          <Marker
            key={service._id}
            position={[lat, lng]}
            ref={(el) => {
              if (el) markerRefs.current[service._id] = el;
            }}
            eventHandlers={{
              click: () => onMarkerClick && onMarkerClick(service._id),
            }}
          >
            <Popup>
              <strong>{service.serviceName || service.name}</strong>
              <br />
              {service.address}
            </Popup>
          </Marker>
        );
      })}

      {/* ROUTE LINE */}
      {routeCoords.length > 0 && (
        <Polyline positions={routeCoords} color="blue" weight={5} />
      )}
    </>
  );
};

// Wrapper (unchanged except height fix)
const MapWrapper = (props) => {
  return (
    <MapContainer
      center={props.center}
      zoom={13}
      style={{ height: "100%", width: "100%", borderRadius: "1.5rem" }}
      className="shadow-xl border border-gray-100 sticky top-8"
    >
      <ServiceMap {...props} />
    </MapContainer>
  );
};

export default MapWrapper;