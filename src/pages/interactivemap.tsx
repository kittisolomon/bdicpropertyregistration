"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from '@changey/react-leaflet-markercluster';
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { useEffect, useState } from "react";

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Create a wrapper component
const MapWrapper = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <>{children}</>;
};
interface Location {
  _id: string;
  state: string;
  propertyName: string;
  propertyType: string;
  coordinates: {
    coordinates: [number, number];  // [lat, lng]
  };
}

interface InteractiveMapProps {
  loc: Location[];  // Array of location objects
}

const InteractiveMap = ({ loc }: InteractiveMapProps) => {
  // Sample data
  // const locations = [
  //   { id: 1, state: "abuja", name: "Abuja Gwagwalada", lat: 8.9328786, lng: 7.1012543 },
  //   { id: 2, state: "abuja", name: "Abuja WUSE 2", lat: 9.0787, lng: 7.4702 },
  //   { id: 3, state: "benue", name: "Gboko Makurdi", lat: 7.3368, lng: 9.0018 }
  // ];
  const locations = loc;
  // Group locations by state
  const groupedLocations: Record<string, typeof locations> = {};

  locations.forEach((location:any) => {
    if (!groupedLocations[location.state]) {
      groupedLocations[location.state] = [];
    }
    groupedLocations[location.state].push(location);
  });

  return (
    <div className="h-[450px] w-[1300px] rounded-lg overflow-hidden relative">
      <MapWrapper>
        <MapContainer
          center={[9.0820, 8.6753]}
          zoom={7}
          style={{ height: "100%", width: "100%" }}
          attributionControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Render MarkerClusterGroup for each state */}
          {Object.entries(groupedLocations).map(([state, locations]) => (
            <MarkerClusterGroup key={state}>
              {locations.map((location:any) => (
                <Marker key={location._id} position={[location.coordinates.coordinates[0], location.coordinates.coordinates[1]]}>
                  <Popup>
                    <div className="min-w-[150px]">
                      <h3 className="font-bold">{location.propertyName}</h3>
                      <p><b>Property Type: </b> {location.propertyType}</p>
                      <p><b>State:</b> {location.state}</p>
                      <p><b>Property:</b> {location.propertyName}</p>
                      <a href={`http://localhost:3000/property/${location._id}`} target="_blank" className="button" >View Property</a>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MarkerClusterGroup>
          ))}
          
        </MapContainer>
      </MapWrapper>
    </div>
  );
};

export default InteractiveMap;
