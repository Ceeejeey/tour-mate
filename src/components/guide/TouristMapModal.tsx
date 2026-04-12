import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { X, Navigation, Phone } from 'lucide-react';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const TouristIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface TouristMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  tourist: {
    name: string;
    phone?: string;
    latitude?: number;
    longitude?: number;
  };
}

export default function TouristMapModal({ isOpen, onClose, tourist }: TouristMapModalProps) {
  if (!isOpen) return null;

  // Simple fallbacks if no location
  const hasLocation = tourist.latitude !== undefined && tourist.longitude !== undefined;
  const lat = tourist.latitude || 0;
  const lng = tourist.longitude || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">{tourist.name}'s Location</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 bg-gray-50 flex gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1.5 font-medium">
            <Navigation size={16} className="text-forest-600" />
            {hasLocation ? `${lat.toFixed(4)}, ${lng.toFixed(4)}` : 'Location not provided'}
          </div>
          {tourist.phone && (
             <div className="flex items-center gap-1.5">
               <Phone size={16} className="text-forest-600" />
               {tourist.phone}
             </div>
          )}
        </div>

        <div className="h-[400px] md:h-[500px] w-full relative bg-gray-100">
          {hasLocation ? (
            <MapContainer 
              center={[lat, lng]} 
              zoom={15} 
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&amp;copy <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[lat, lng]} icon={TouristIcon}>
                <Popup>
                  <div className="font-semibold text-center">{tourist.name}</div>
                  <div className="text-sm text-gray-600 text-center mt-1">Tourist Location</div>
                </Popup>
              </Marker>
            </MapContainer>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
              <Navigation size={48} className="mb-4 opacity-50" />
              <p className="text-lg font-medium text-gray-600">Location Unavailable</p>
              <p className="mt-1 text-sm text-gray-500">This tourist hasn't shared their location.</p>
            </div>
          )}
        </div>

        {hasLocation && (
          <div className="p-4 border-t border-gray-100 bg-white flex justify-end">
            <a 
              href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 bg-forest-600 text-white font-medium rounded-xl hover:bg-forest-700 transition-colors shadow-sm flex items-center gap-2"
            >
              <Navigation size={18} />
              Open in Google Maps
            </a>
          </div>
        )}
      </div>
    </div>
  );
}