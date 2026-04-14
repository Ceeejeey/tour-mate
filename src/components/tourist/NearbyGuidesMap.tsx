import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Guide } from '../../types';
import { Link } from 'react-router-dom';
import { MapPin, Navigation, Star } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

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

function RecenterMap({ lat, lng, zoom }: { lat: number; lng: number, zoom?: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], zoom || map.getZoom());
  }, [lat, lng, zoom, map]);
  return null;
}

interface NearbyGuidesMapProps {
  guides: Guide[];
  userLocation: { lat: number; lng: number } | null;
  radius?: number; // In km
}

export default function NearbyGuidesMap({ guides, userLocation, radius = 5 }: NearbyGuidesMapProps) {
  // Default to Sri Lanka center if no location
  const centerLat = userLocation?.lat || 7.8731;
  const centerLng = userLocation?.lng || 80.7718;
  const defaultZoom = userLocation ? 12 : 7;

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-gray-200">
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={defaultZoom}
        style={{ width: '100%', height: '100%', zIndex: 1 }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <RecenterMap lat={centerLat} lng={centerLng} zoom={defaultZoom} />

        {/* User Location */}
        {userLocation && (
          <>
            <Marker position={[userLocation.lat, userLocation.lng]} icon={UserIcon}>
              <Popup>
                <div className="text-center">
                  <div className="font-bold text-gray-900 border-b pb-1 mb-1">Your Location</div>
                  <div className="text-xs text-gray-500">Searching {radius}km radius</div>
                </div>
              </Popup>
            </Marker>
            
            <Circle 
              center={[userLocation.lat, userLocation.lng]} 
              radius={radius * 1000} // Circle radius is in meters
              pathOptions={{ fillColor: '#2D8F5E', color: '#2D8F5E', weight: 1, fillOpacity: 0.1 }}
            />
          </>
        )}

        {/* Guide Markers */}
        {guides.map((guide) => {
          // Skip if missing valid coordinates
          if (guide.latitude == null || guide.longitude == null || 
              (guide.latitude === 0 && guide.longitude === 0)) {
            return null;
          }
          
          return (
            <Marker
              key={guide.id}
              position={[guide.latitude, guide.longitude]}
              icon={GuideIcon}
            >
              <Popup className="custom-popup">
                <div className="w-56 overflow-hidden rounded-lg">
                  <div className="h-24 overflow-hidden relative">
                    <img 
                      src={guide.avatar || 'https://via.placeholder.com/150'} 
                      alt={guide.name} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-white/90 px-2 py-0.5 rounded text-xs font-bold text-forest-700 shadow-sm backdrop-blur-sm">
                      ${guide.pricePerSession}/session
                    </div>
                  </div>
                  
                  <div className="p-3 bg-white">
                    <h3 className="font-bold text-gray-900 text-base mb-1 truncate">{guide.name}</h3>
                    
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <Star className="w-3.5 h-3.5 text-yellow-400 mr-1 fill-yellow-400" />
                      <span className="font-medium mr-1">{guide.rating || 'New'}</span>
                      <span className="text-gray-400 text-xs">({guide.reviewCount || 0} reviews)</span>
                    </div>

                    <div className="space-y-1 mb-3">
                      <div className="flex items-start text-xs text-gray-600">
                        <MapPin className="w-3.5 h-3.5 mr-1.5 mt-0.5 text-forest-600 flex-shrink-0" />
                        <span className="line-clamp-2">{guide.serviceArea || 'Location not specified'}</span>
                      </div>
                    </div>

                    <Link
                      to={`/tourist/guide/${guide.id}`}
                      className="block w-full py-2 bg-gradient-to-r from-forest-600 to-forest-700 hover:from-forest-700 hover:to-forest-800 text-white text-center rounded-lg text-sm font-medium transition-all shadow-sm"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
