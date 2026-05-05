import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Guide } from '../../types';
import GuideCard from '../../components/shared/GuideCard';
import NearbyGuidesMap from '../../components/tourist/NearbyGuidesMap';
import { Filter, X, Loader2, Search as SearchIcon, Users, MapPin, DollarSign, Star, Crosshair } from 'lucide-react';
import toast from 'react-hot-toast';

// Haversine formula to calculate distance in km
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export default function FindGuides() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [minRating, setMinRating] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  
  // Location specific state
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [searchRadius, setSearchRadius] = useState<number>(50); // Default 50km
  const [filterByDistance, setFilterByDistance] = useState(false);

  const [allGuides, setAllGuides] = useState<Guide[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const token = localStorage.getItem('tourmate_token');
        const response = await fetch('http://localhost:5066/api/users/guides', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setAllGuides(data);
        } else {
          toast.error('Failed to load guides');
        }
      } catch (err) {
        console.error('Error fetching guides:', err);
        toast.error('Network error loading guides');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGuides();
  }, []);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setFilterByDistance(true);
        setIsLocating(false);
        toast.success('Location updated!');
      },
      (error) => {
        console.error('Error getting location:', error);
        toast.error('Unable to retrieve your location');
        setIsLocating(false);
      }
    );
  };

  // Extract unique languages
  const allLanguages = Array.from(new Set(allGuides.flatMap(g => g.languages || [])));

  const filteredGuides = allGuides.filter(guide => {
    const matchesQuery = guide.name.toLowerCase().includes(query.toLowerCase()) || 
                         (guide.serviceArea || '').toLowerCase().includes(query.toLowerCase());
    const matchesLanguage = selectedLanguages.length === 0 || 
                            selectedLanguages.some(lang => (guide.languages || []).includes(lang));
    const price = guide.pricePerSession || 0;
    const matchesPrice = price >= priceRange[0] && price <= priceRange[1];
    const rating = guide.rating || 0;
    const matchesRating = rating >= minRating;

    let matchesDistance = true;
    if (filterByDistance && userLocation) {
      if (guide.latitude == null || guide.longitude == null || (guide.latitude === 0 && guide.longitude === 0)) {
        // If guide has no location, they don't match the distance filter
        matchesDistance = false;
      } else {
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          guide.latitude,
          guide.longitude
        );
        matchesDistance = distance <= searchRadius;
      }
    }

    return matchesQuery && matchesLanguage && matchesPrice && matchesRating && matchesDistance;
  });

  const toggleLanguage = (lang: string) => {
    setSelectedLanguages(prev => 
      prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
    );
  };

  const handleClearFilters = () => {
    setQuery('');
    setSelectedLanguages([]);
    setPriceRange([0, 200]);
    setMinRating(0);
    setFilterByDistance(false);
  };

  return (
    <div className="min-h-screen bg-forest-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Premium Header */}
        <div className="bg-gradient-to-r from-forest-600 to-forest-700 rounded-2xl p-8 mb-8 text-white shadow-lg mt-8">
          <div className="flex items-center gap-4">
            <div className="bg-forest-500 p-3 rounded-lg">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Find Your Perfect Guide</h1>
              <p className="text-forest-100 text-sm mt-1">Discover amazing tour guides in your area</p>
            </div>
          </div>
        </div>

        {/* Interactive Guides Map */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-forest-50/50">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-forest-600" />
              Interactive Map
            </h2>
            <button 
              onClick={handleGetLocation}
              disabled={isLocating}
              className="flex items-center gap-2 px-4 py-2 bg-white text-forest-700 border border-forest-200 hover:bg-forest-50 rounded-lg text-sm font-medium transition-colors shadow-sm disabled:opacity-50"
            >
              {isLocating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Crosshair className="w-4 h-4" />}
              {userLocation ? 'Update Location' : 'Use My Location'}
            </button>
          </div>
          <div className="h-96">
            <NearbyGuidesMap 
              guides={filteredGuides} 
              userLocation={userLocation} 
              radius={filterByDistance ? searchRadius : undefined}
            />
          </div>
        </div>

        {/* Main Search & Filter Section */}
        <div className="flex flex-col md:flex-row gap-6 pb-12">
          {/* Filters Sidebar */}
          <div className={`md:w-80 flex-shrink-0 ${showFilters ? 'block' : 'hidden md:block'}`}>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 sticky top-24 overflow-hidden">
              {/* Filter Header */}
              <div className="bg-gradient-to-r from-forest-50 to-forest-100 px-6 py-4 border-b border-forest-100 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Filter size={18} className="text-forest-600" />
                  <h2 className="font-bold text-lg text-gray-900">Filters</h2>
                </div>
                <button 
                  onClick={() => setShowFilters(false)} 
                  className="md:hidden text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Search Box */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Search</label>
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-3 text-gray-400" size={16} />
                    <input
                      type="text"
                      placeholder="Name or location..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>

                {/* Distance Radius */}
                {userLocation && (
                  <div className="bg-sky-50 p-4 rounded-xl border border-sky-100">
                    <div className="flex items-center justify-between mb-3">
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                        <MapPin size={16} className="text-sky-600" />
                        Distance Radius
                      </label>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={filterByDistance} 
                          onChange={(e) => setFilterByDistance(e.target.checked)}
                          className="sr-only peer" 
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-sky-500"></div>
                      </label>
                    </div>
                    
                    {filterByDistance && (
                      <>
                        <div className="flex justify-between text-sm font-medium text-sky-900 mb-2">
                          <span>Radius:</span>
                          <span>{searchRadius} km</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="200"
                          step="1"
                          value={searchRadius}
                          onChange={(e) => setSearchRadius(parseInt(e.target.value))}
                          className="w-full h-2 bg-sky-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
                        />
                      </>
                    )}
                  </div>
                )}

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <DollarSign size={16} className="text-earth-600" />
                    Price per Session
                  </label>
                  <div className="bg-forest-50 rounded-lg p-3 mb-3">
                    <div className="flex justify-between text-sm font-medium text-gray-900">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    step="10"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-forest-600"
                  />
                </div>

                {/* Languages */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Filter size={16} className="text-forest-600" />
                    Languages
                  </label>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                    {allLanguages.map(lang => (
                      <label key={lang} className="flex items-center cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={selectedLanguages.includes(lang)}
                          onChange={() => toggleLanguage(lang)}
                          className="w-4 h-4 rounded border-gray-300 text-forest-600 focus:ring-forest-500"
                        />
                        <span className="ml-3 text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{lang}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Star size={16} className="text-sky-600" />
                    Minimum Rating
                  </label>
                  <div className="space-y-2">
                    {[4, 3, 2].map(rating => (
                      <label key={rating} className="flex items-center cursor-pointer group">
                        <input
                          type="radio"
                          name="rating"
                          checked={minRating === rating}
                          onChange={() => setMinRating(rating)}
                          className="w-4 h-4 border-gray-300 text-forest-600 focus:ring-forest-500"
                        />
                        <span className="ml-3 text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{rating}+ Stars</span>
                      </label>
                    ))}
                    <label className="flex items-center cursor-pointer group">
                      <input
                        type="radio"
                        name="rating"
                        checked={minRating === 0}
                        onChange={() => setMinRating(0)}
                        className="w-4 h-4 border-gray-300 text-forest-600 focus:ring-forest-500"
                      />
                      <span className="ml-3 text-sm text-gray-600 group-hover:text-gray-900 transition-colors">All Reviews</span>
                    </label>
                  </div>
                </div>

                {/* Clear Filters Button */}
                {(selectedLanguages.length > 0 || priceRange[1] < 200 || minRating > 0 || query || filterByDistance) && (
                  <button
                    onClick={handleClearFilters}
                    className="w-full py-2 px-4 bg-forest-50 hover:bg-forest-100 text-forest-700 font-medium rounded-lg transition-colors border border-forest-200"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden w-full mb-6 flex items-center justify-center gap-2 py-3 bg-forest-600 hover:bg-forest-700 text-white rounded-lg font-medium transition-colors shadow-sm"
            >
              <Filter size={18} />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>

            {/* Results Header */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Users size={20} className="text-forest-600" />
                {filteredGuides.length} {filteredGuides.length === 1 ? 'Guide' : 'Guides'} Found
              </h2>
            </div>

            {isLoading ? (
              <div className="flex h-64 items-center justify-center bg-white rounded-2xl border border-gray-100">
                <Loader2 className="h-10 w-10 animate-spin text-forest-600" />
              </div>
            ) : filteredGuides.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredGuides.map(guide => (
                  <GuideCard key={guide.id} guide={guide} userLocation={filterByDistance ? userLocation : null} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex justify-center mb-5">
                  <div className="bg-forest-50 p-4 rounded-full">
                    <SearchIcon className="w-8 h-8 text-forest-400" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No guides found</h3>
                <p className="text-gray-500 max-w-sm mx-auto mb-6">
                  {filterByDistance 
                    ? "There aren't any guides within your chosen radius. Try expanding the distance or clearing other filters."
                    : "We couldn't find any guides matching your criteria. Try adjusting your filters to see more results."}
                </p>
                <button
                  onClick={handleClearFilters}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-forest-600 hover:bg-forest-700 text-white rounded-lg font-medium transition-colors"
                >
                  <X size={16} />
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
