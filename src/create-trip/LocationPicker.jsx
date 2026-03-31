import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";
import "leaflet/dist/leaflet.css";

function MapClickHandler({ onSelect, setPosition }) {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;

      setPosition([lat, lng]);

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
          {
            headers: {
              "User-Agent": "travel-app",
            },
          }
        );

        const data = await res.json();

        const placeName = data.display_name;

        onSelect({
          name: placeName,
          lat,
          lng,
        });
      } catch (err) {
        console.error("Error fetching location:", err);
      }
    },
  });

  return null;
}

export default function LocationPicker({ onSelect }) {
  const [position, setPosition] = useState(null);

  return (
    <MapContainer
      center={[20.5937, 78.9629]} // India
      zoom={5}
      style={{ height: "400px", width: "100%", borderRadius: "12px" }}
    >
      <TileLayer
        attribution="© OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapClickHandler onSelect={onSelect} setPosition={setPosition} />

      {position && <Marker position={position} />}
    </MapContainer>
  );
}