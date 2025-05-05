"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const MapWrapper = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <>{children}</>;
};

const MapWithMarkers = (state:any) => {
    console.error(state)
    //let sta = state
  const [searchQuery, setSearchQuery] = useState("");
  const [searching,setSearching] =useState(false)
  const [searchResults, setSearchResults] = useState<{ 
    lat: number; 
    lng: number; 
    name: string 
  }[]>([]);

  const handleSearch = async () => {
    if(state.state==="") return alert("You must select state first!")
 
    setSearching(true)
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSearching(false)
      alert("Input Location")
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery+" "+state.state)}`
      );
      const data = await response.json();
      
      if (data.length > 0) {
        setSearching(false)
        const results = data.map((result: any) => ({
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lon),
          name: result.display_name
        }));
        setSearchResults(results);
      } else {
        setSearchResults([]);
        alert("No locations found");
        setSearching(false)
      }
    } catch (error) {
        setSearching(false)
      console.error("Error during geocoding:", error);
      alert("Error searching for location");
    }
  };

  const copyToClipboard = (latlng: { lat: number; lng: number }) => {
    const textToCopy = `Latitude: ${latlng.lat}, Longitude: ${latlng.lng}`;
    navigator.clipboard.writeText(textToCopy)
      .then(() => alert('Coordinates copied to clipboard!'))
      .catch((err) => console.error('Failed to copy coordinates: ', err));
  };

  return (
    
    <div className="h-[450px] w-[1300px] rounded-lg overflow-hidden relative">
      {/* Search Container - Increased z-index to 1000 */}

      <div className="absolute ml-10 top-5 left-5 z-[1000] bg-white p-2 rounded-lg shadow-md">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search Location (e.g., Lagos, Nigeria)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg w-64"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button 
            onClick={handleSearch}
            disabled={searching}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            
            {searching ? "Searching..." : "Search"}
          </Button>
        </div>
      </div>
      
      {/* Map Container - Ensure it doesn't create a new stacking context */}
      <div className="h-full w-full relative z-0">
        <MapWrapper>
          <MapContainer 
            center={[9.0820, 8.6753]}
            zoom={6}
            style={{ height: "90%", width: "100%", position: "relative" }}
            attributionControl={false}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {searchResults.map((location, index) => (
              <Marker 
                key={index} 
                position={[location.lat, location.lng]}
                eventHandlers={{
                  click: () => {
                    copyToClipboard({ lat: location.lat, lng: location.lng });
                  }
                }}
              >
                <Popup>
                  <div className="min-w-[150px]">
                    <h3 className="font-bold">{location.name}</h3>
                    <p>Lat: {location.lat.toFixed(4)}</p>
                    <p>Lng: {location.lng.toFixed(4)}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </MapWrapper>
      </div>
    </div>
  );
};

export default MapWithMarkers;