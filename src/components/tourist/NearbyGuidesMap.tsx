import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Guide } from '../../types';
import { Link } from 'react-router-dom';
import { MapPin, Navigation, Loader2 } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet icon not loading in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = new Icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const UserIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const GuideIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Component to recenter map when user location changes
function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom());
  }, [lat, lng, map]);
  return null;
}

export default function NearbyGuidesMap() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nearbyGuides, setNearbyGuides] = useState<Guide[]>([]);
  const [allGuides, setAllGuides] = useState<Guide[]>([]);

  // Default center (Colombo, Sri Lanka) if user location not found
  const defaultCenter = { lat: 6.9271, lng: 79.8612 };

  const fetchGuides = async () => {
    console.log('Fetching guides from API...');
    try {
      const token = localStorage.getItem('tourmate_token');
      const response = await fetch('http://localhost:5066/api/users/guides', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('API Response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('Raw guides data from API:', data);
        setAllGuides(data);
        return data;
      } else {
        console.error('Failed to fetch guides, response not OK');
      }
    } catch (err) {
      console.error('Error fetching guides:', err);
    }
    return [];
  };

  const getUserLocation = async () => {
    console.log('Getting user location...');
    setIsLoading(true);
    setError(null);

    const guides = await fetchGuides();
    console.log(`Fetched ${guides.length} total guides to map.`);

    if (!navigator.geolocation) {
      console.log('Geolocation not supported.');
      setError('Geolocation is not supported by your browser');
      setIsLoading(false);
      const filtered = guides.filter((g: Guide) => g.latitude != null && g.longitude != null);
      console.log('Guides with location (no user location):', filtered);
      setNearbyGuides(filtered);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log(`Successfully got user location: lat=${latitude}, lng=${longitude}`);
        setUserLocation({ lat: latitude, lng: longitude });
        findNearbyGuides(latitude, longitude, guides);
        setIsLoading(false);
      },
      (geoError) => {
        console.warn('Error getting geolocation:', geoError.message);
        setError('Unable to retrieve your location. Showing default view.');
        setIsLoading(false);
        // Still show guides even if user location fails
        const filtered = guides.filter((g: Guide) => g.latitude != null && g.longitude != null);
        console.log('Guides with location (fallback):', filtered);
        setNearbyGuides(filtered);
      }
    );
  };

  const findNearbyGuides = (lat: number, lng: number, guides: Guide[]) => {
    console.log('Filtering nearby guides relative to user coords...');
    // Simple distance calculation (Haversine not strictly needed for mock, but good practice)
    // For now, just showing all guides with coordinates as "nearby" is sufficient for the demo
    // In a real app, we'd filter by radius (e.g., 50km)
    
    // Ensure we parse latitude and longitude as numbers, just in case they're strings from API
    const guidesWithLocation = guides.filter(g => g.latitude != null && g.longitude != null).map(g => ({
      ...g,
      latitude: Number(g.latitude),
      longitude: Number(g.longitude)
    }));
    
    console.log('Guides with valid lat/lng before sorting:', guidesWithLocation);
    
    // Sort by distance (simple Euclidean approximation for small distances)
    const sortedGuides = guidesWithLocation.sort((a, b) => {
      const distA = Math.sqrt(Math.pow((a.latitude - lat), 2) + Math.pow((a.longitude - lng), 2));
      const distB = Math.sqrt(Math.pow((b.latitude - lat), 2) + Math.pow((b.longitude - lng), 2));
      return distA - distB;
    });

    console.log('Final sorted nearby guides:', sortedGuides);
    setNearbyGuides(sortedGuides);
  };

  useEffect(() => {
    // Initial load - try to get location or just show all
    getUserLocation();
  }, []);

  return (
    <div className="h-[600px] w-full relative rounded-xl overflow-hidden shadow-sm border border-gray-100">
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 z-[1000] flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="animate-spin text-forest-600" size={32} />
            <span className="text-gray-600 font-medium">Locating you...</span>
          </div>
        </div>
      )}

      {!isLoading && !userLocation && (
        <div className="absolute top-4 right-4 z-[1000]">
          <button
            onClick={getUserLocation}
            className="bg-white text-gray-700 px-4 py-2 rounded-lg shadow-md font-medium hover:bg-gray-50 flex items-center gap-2"
          >
            <Navigation size={16} />
            Find My Location
          </button>
        </div>
      )}

      <MapContainer
        center={[defaultCenter.lat, defaultCenter.lng]}
        zoom={9}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {userLocation && (
          <>
            <RecenterMap lat={userLocation.lat} lng={userLocation.lng} />
            <Marker position={[userLocation.lat, userLocation.lng]} icon={UserIcon}>
              <Popup>
                <div className="font-bold text-center">You are here</div>
              </Popup>
            </Marker>
          </>
        )}

        {nearbyGuides.map((guide) => (
          <Marker
            key={guide.id}
            position={[guide.latitude!, guide.longitude!]}
            icon={GuideIcon}
          >
            <Popup>
              <div className="min-w-[200px]">
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={guide.avatar}
                    alt={guide.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{guide.name}</h3>
                    <div className="flex items-center text-xs text-gray-500">
                      <MapPin size={10} className="mr-1" />
                      {guide.serviceArea}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mb-2 line-clamp-2">{guide.bio}</p>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-forest-600 text-sm">${guide.pricePerSession}/session</span>
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded">
                    ★ {guide.rating}
                  </span>
                </div>
                <Link
                  to={`/tourist/booking/new?guideId=${guide.id}`}
                  className="block w-full bg-forest-600 text-white text-center py-1.5 rounded text-xs font-medium hover:bg-forest-700 transition"
                >
                  Book Now
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
