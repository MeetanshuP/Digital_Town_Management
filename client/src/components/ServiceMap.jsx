import React from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
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
  React.useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);
  return null;
};

const MapEvents = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng);
    },
  });
  return null;
};

const ServiceMap = ({ services, center, userLocation, selectedServiceId, onUserLocationChange }) => {
  const map = useMap();
  const markerRefs = React.useRef({});

  const userIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  React.useEffect(() => {
    if (selectedServiceId && markerRefs.current[selectedServiceId]) {
      const selectedService = services.find(s => s._id === selectedServiceId);
      if (selectedService) {
        const lat = selectedService.latitude || (selectedService.location?.coordinates && selectedService.location.coordinates[1]);
        const lng = selectedService.longitude || (selectedService.location?.coordinates && selectedService.location.coordinates[0]);

        if (lat && lng) {
          map.flyTo([lat, lng], 15, { animate: true, duration: 1.5 });
          setTimeout(() => {
            markerRefs.current[selectedServiceId]?.openPopup();
          }, 500);
        }
      }
    }
  }, [selectedServiceId, services, map]);

  return (
    <>
      <ChangeView center={center} />
      <MapEvents onMapClick={onUserLocationChange} />
      <TileLayer
        attribution='© OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {userLocation && (
        <Marker
          position={[userLocation.lat, userLocation.lng]}
          icon={userIcon}
          draggable={true}
          eventHandlers={{
            dragend: (e) => {
              const marker = e.target;
              const position = marker.getLatLng();
              onUserLocationChange(position);
            },
          }}
        >
          <Popup>
            <strong>Your Location</strong>
            <br />
            Drag me or click map to change site.
          </Popup>
        </Marker>
      )}

      {services.map((service) => {
        const lat = service.latitude || (service.location?.coordinates && service.location.coordinates[1]);
        const lng = service.longitude || (service.location?.coordinates && service.location.coordinates[0]);

        if (!lat || !lng) return null;

        return (
          <Marker
            key={service._id}
            position={[lat, lng]}
            ref={(el) => {
              if (el) markerRefs.current[service._id] = el;
            }}
          >
            <Popup>
              <div className="p-1 min-w-[200px]">
                <strong className="text-blue-600 font-bold text-lg block mb-1">
                  {service.serviceName || service.name}
                </strong>
                <div className="text-sm text-gray-600 space-y-1">
                  <p className="font-semibold text-blue-500 uppercase text-xs tracking-wider">
                    {service.category}
                  </p>
                  <p className="border-t border-gray-100 pt-1 mt-1">{service.address}</p>
                  {service.contact && (
                    <p className="flex items-center gap-1 text-gray-500 italic mt-1 font-medium">
                      📞 {service.contact}
                    </p>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
};

const MapWrapper = (props) => {
  return (
    <MapContainer
      center={props.center}
      zoom={13}
      style={{ height: "600px", width: "100%", borderRadius: "1.5rem" }}
      className="shadow-xl border border-gray-100 sticky top-8"
    >
      <ServiceMap {...props} />
    </MapContainer>
  );
}

export default MapWrapper;
