import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useMap } from "react-leaflet";

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

const ChangeView = ({ center }) => {
  const map = useMap();
  map.setView(center, 13);
  return null;
};

const ServiceMap = ({ services, center }) => {
  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        attribution='© OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {services.filter(
        (service) =>
          service.location &&
          Array.isArray(service.location.coordinates) &&
          service.location.coordinates.length === 2
      ).map((service) => (
        <Marker
          key={service._id}
          position={[
            service.location.coordinates[1], // lat
            service.location.coordinates[0], // lng
          ]}
        >
          <Popup>
            <strong>{service.name}</strong>
            <br />
            {service.address}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default ServiceMap;