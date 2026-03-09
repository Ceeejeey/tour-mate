import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Users, Map, Compass, TreePine, Mountain, Binoculars } from 'lucide-react';
import { MOCK_GUIDES } from '../../data/mockData';
import GuideCard from '../../components/shared/GuideCard';
import NearbyGuidesMap from '../../components/tourist/NearbyGuidesMap';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showMap, setShowMap] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/tourist/search?q=${searchQuery}`);
  };

  const featuredGuides = MOCK_GUIDES.slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://picsum.photos/1920/1080?random=1"
            alt="Sri Lanka Landscape"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-forest-900/60 via-forest-900/40 to-forest-900/70" />
        </div>
        
        {/* Decorative nature elements */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-forest-50/30 to-transparent" />
        
        <div className="relative z-10 max-w-4xl w-full px-4 text-center text-white">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Compass className="h-6 w-6 text-earth-400" />
            <span className="text-earth-300 font-medium tracking-wider uppercase text-sm">Explore Sri Lanka</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg leading-tight">
            Discover Sri Lanka with
            <span className="text-earth-400"> Local Experts</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 font-light drop-shadow-md text-forest-100">
            Find and book the best tour guides for your next adventure.
          </p>

          <form onSubmit={handleSearch} className="bg-white/95 backdrop-blur-sm p-3 rounded-2xl shadow-xl flex flex-col md:flex-row gap-3 max-w-3xl mx-auto border border-forest-200/20">
            <div className="flex-1 flex items-center px-4 py-2">
              <MapPin className="text-forest-400 mr-3 shrink-0" size={20} />
              <input
                type="text"
                placeholder="Where do you want to go?"
                className="w-full outline-none text-forest-800 placeholder-forest-300 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-forest-600 to-forest-700 text-white px-8 py-3 rounded-xl font-semibold hover:from-forest-700 hover:to-forest-800 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Search size={18} />
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Real-time Map Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="bg-white rounded-2xl shadow-sm border border-forest-100 p-6 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-forest-800 flex items-center gap-2">
                <Map className="text-forest-500" />
                Find Guides Nearby
              </h2>
              <p className="text-forest-400 mt-1">
                See available guides around your current location in real-time.
              </p>
            </div>
            <button
              onClick={() => setShowMap(!showMap)}
              className="bg-white border border-forest-300 text-forest-700 px-6 py-2 rounded-lg font-medium hover:bg-forest-50 transition-colors"
            >
              {showMap ? 'Hide Map' : 'Show Map'}
            </button>
          </div>

          {showMap ? (
            <NearbyGuidesMap />
          ) : (
            <div 
              className="h-64 bg-forest-50 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-forest-100/50 transition-colors border-2 border-dashed border-forest-200"
              onClick={() => setShowMap(true)}
            >
              <Map className="h-12 w-12 text-forest-200 mb-3" />
              <span className="text-forest-400 font-medium">Click to view nearby guides map</span>
            </div>
          )}
        </div>
      </section>

      {/* Featured Guides Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-forest-800 mb-2">Featured Guides</h2>
            <p className="text-forest-400">Top-rated local experts ready to show you around.</p>
          </div>
          <Link to="/tourist/search" className="text-forest-600 font-medium hover:text-forest-700 hover:underline hidden md:block transition-colors">
            View all guides &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredGuides.map((guide) => (
            <GuideCard key={guide.id} guide={guide} />
          ))}
        </div>
        
        <div className="mt-8 text-center md:hidden">
          <Link to="/tourist/search" className="text-forest-600 font-medium hover:underline">
            View all guides &rarr;
          </Link>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gradient-to-br from-forest-50 to-sand-100 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-3">
              <TreePine className="text-forest-500" size={20} />
              <span className="text-forest-500 font-medium text-sm uppercase tracking-wider">Why TourMate</span>
            </div>
            <h2 className="text-3xl font-bold text-forest-800 mb-4">Your Gateway to Authentic Adventures</h2>
            <p className="text-forest-400 max-w-2xl mx-auto">
              We make it easy to find reliable, knowledgeable, and friendly guides for your Sri Lankan journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-forest-100 text-center hover:shadow-md transition-shadow">
              <div className="bg-forest-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="text-forest-600 h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-forest-800 mb-3">Verified Guides</h3>
              <p className="text-forest-400">
                Every guide on our platform is vetted and verified to ensure your safety and satisfaction.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-forest-100 text-center hover:shadow-md transition-shadow">
              <div className="bg-earth-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Mountain className="text-earth-500 h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-forest-800 mb-3">Unique Experiences</h3>
              <p className="text-forest-400">
                Explore hidden trails, ancient ruins, and breathtaking landscapes with insider knowledge.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-forest-100 text-center hover:shadow-md transition-shadow">
              <div className="bg-sky-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Binoculars className="text-sky-500 h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-forest-800 mb-3">Local Discovery</h3>
              <p className="text-forest-400">
                Discover hidden gems and authentic local experiences that you won't find in guidebooks.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
