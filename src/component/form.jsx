import React, { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
} from "react-leaflet";
import { gsap } from "gsap";
import L from "leaflet";

// Define stops with lat, lng and descriptions
const stops = [
  { lat: 51.505, lng: -0.09, name: "Stop 1", description: "This is Stop 1" },
  { lat: 51.515, lng: -0.1, name: "Stop 2", description: "This is Stop 2" },
  { lat: 51.525, lng: -0.11, name: "Stop 3", description: "This is Stop 3" },
];

const journeyPath = stops.map((stop) => [stop.lat, stop.lng]);

const AnimatedJourney = () => {
  const mapRef = useRef();
  const [pathVisible, setPathVisible] = useState(false);

  // Animate the path
  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
    tl.to(mapRef.current, { duration: 3, opacity: 1, ease: "power2.inOut" });

    stops.forEach((stop, index) => {
      tl.to(
        `#stop-${index}`,
        { duration: 0.5, scale: 1.2, opacity: 1, ease: "elastic.out" },
        `+=0.5`
      );
    });

    setPathVisible(true);
  }, []);

  return (
    <MapContainer
      center={stops[0]}
      zoom={13}
      style={{ height: "500px", width: "100%" }}
      ref={mapRef}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {pathVisible && <Polyline positions={journeyPath} color="blue" />}

      {stops.map((stop, index) => (
        <Marker
          key={index}
          position={[stop.lat, stop.lng]}
          id={`stop-${index}`}
          opacity={0}
          scale={0.5}
        >
          <Popup>
            <h3>{stop.name}</h3>
            <p>{stop.description}</p>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default AnimatedJourney;
