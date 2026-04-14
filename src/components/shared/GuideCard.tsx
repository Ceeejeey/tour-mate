import React from 'react';
import { Link } from 'react-router-dom';
import { Guide } from '../../types';
import StarRating from './StarRating';
import { MapPin, Languages, CheckCircle, NavigationOff, Navigation } from 'lucide-react';

// Repeated distance formula for display
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

interface GuideCardProps {
  guide: Guide;
  userLocation?: { lat: number, lng: number } | null;
}

export default function GuideCard({ guide, userLocation }: GuideCardProps) {
  const hasLocation = guide.latitude != null && guide.longitude != null && 
                      !(guide.latitude === 0 && guide.longitude === 0);
  
  let distanceDisplay = null;
  if (hasLocation && userLocation) {
    const dist = calculateDistance(userLocation.lat, userLocation.lng, guide.latitude as number, guide.longitude as number);
    distanceDisplay = dist < 1 ? "< 1 km" : `${dist.toFixed(1)} km`;
  }

  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-forest-100 overflow-hidden flex flex-col h-full relative">
      {!hasLocation && (
        <div className="absolute top-2 right-2 z-10 bg-red-100 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-red-700 shadow-sm border border-red-200">
          <NavigationOff size={12} className="opacity-70" />
          Location not shared
        </div>
      )}
      
      {distanceDisplay && (
        <div className="absolute top-2 right-2 z-10 bg-sky-100 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-sky-800 shadow-sm border border-sky-200">
          <Navigation size={12} className="opacity-70" />
          {distanceDisplay}
        </div>
      )}

      <div className="relative h-48 overflow-hidden">
        <img
          src={guide.avatar || 'https://via.placeholder.com/400x300'}
          alt={guide.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-forest-600 shadow-sm">
          ${guide.pricePerSession}/session
        </div>
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {guide.verified && (
            <div className="bg-blue-500/90 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1 shadow-sm w-fit">
              <CheckCircle size={12} /> Verified
            </div>
          )}
          <div className={`backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-sm w-fit ${guide.isAvailable ? 'bg-green-500/90 text-white' : 'bg-gray-600/90 text-white'}`}>
            <span className="relative flex h-1.5 w-1.5">
              {guide.isAvailable && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              )}
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
            </span>
            {guide.isAvailable ? 'Available' : 'Busy'}
          </div>
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{guide.name}</h3>
        </div>
        
        <div className="mb-3">
          <StarRating rating={guide.rating} count={guide.reviewCount} />
        </div>

        <div className="space-y-2 text-sm text-gray-600 mb-4 flex-grow">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-earth-400 flex-shrink-0" />
            <span className="truncate">{guide.serviceArea || 'Flexible'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Languages size={16} className="text-earth-400 flex-shrink-0" />
            <span className="truncate">{guide.languages ? guide.languages.join(', ') : 'Not specified'}</span>
          </div>
        </div>

        <div className="flex gap-2 mt-auto">
          <Link
            to={`/tourist/guide/${guide.id}`}
            className="flex-1 bg-white border border-forest-600 text-forest-600 py-2 rounded-lg text-sm font-medium hover:bg-forest-600/5 transition-colors text-center"
          >
            View Profile
          </Link>
          <Link
            to={`/tourist/guide/${guide.id}#book`}
            className="flex-1 bg-forest-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-forest-700 transition-colors text-center shadow-sm"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}
