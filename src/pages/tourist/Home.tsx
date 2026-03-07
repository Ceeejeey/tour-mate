import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Users } from 'lucide-react';
import { MOCK_GUIDES } from '../../data/mockData';
import GuideCard from '../../components/shared/GuideCard';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/tourist/search?q=${searchQuery}`);
  };

  const featuredGuides = MOCK_GUIDES.slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[600px] flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src="https://picsum.photos/1920/1080?random=1"
            alt="Sri Lanka Landscape"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        <div className="relative z-10 max-w-4xl w-full px-4 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">
            Discover Sri Lanka with Local Experts
          </h1>
          <p className="text-xl md:text-2xl mb-8 font-light drop-shadow-md">
            Find and book the best tour guides for your next adventure.
          </p>

          <form onSubmit={handleSearch} className="bg-white p-4 rounded-2xl shadow-xl flex flex-col md:flex-row gap-4 max-w-3xl mx-auto">
            <div className="flex-1 flex items-center border-b md:border-b-0 md:border-r border-gray-200 px-4 py-2">
              <MapPin className="text-gray-400 mr-3" />
              <input
                type="text"
                placeholder="Where do you want to go?"
                className="w-full outline-none text-gray-700 placeholder-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex-1 flex items-center border-b md:border-b-0 md:border-r border-gray-200 px-4 py-2">
              <Calendar className="text-gray-400 mr-3" />
              <input
                type="text"
                placeholder="Dates"
                className="w-full outline-none text-gray-700 placeholder-gray-400"
                onFocus={(e) => (e.target.type = 'date')}
                onBlur={(e) => (e.target.type = 'text')}
              />
            </div>
            <button
              type="submit"
              className="bg-[#1E6B4A] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#165a3d] transition-colors flex items-center justify-center gap-2"
            >
              <Search size={20} />
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Featured Guides Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Guides</h2>
            <p className="text-gray-500">Top-rated local experts ready to show you around.</p>
          </div>
          <Link to="/tourist/search" className="text-[#1E6B4A] font-medium hover:underline hidden md:block">
            View all guides &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredGuides.map((guide) => (
            <GuideCard key={guide.id} guide={guide} />
          ))}
        </div>
        
        <div className="mt-8 text-center md:hidden">
          <Link to="/tourist/search" className="text-[#1E6B4A] font-medium hover:underline">
            View all guides &rarr;
          </Link>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose TourMate?</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              We make it easy to find reliable, knowledgeable, and friendly guides for your Sri Lankan journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="bg-[#1E6B4A]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="text-[#1E6B4A] h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Verified Guides</h3>
              <p className="text-gray-500">
                Every guide on our platform is vetted and verified to ensure your safety and satisfaction.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="bg-[#F5A623]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="text-[#F5A623] h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Easy Booking</h3>
              <p className="text-gray-500">
                Book your guide in just a few clicks. Manage your itinerary and payments seamlessly.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="text-blue-600 h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Local Experiences</h3>
              <p className="text-gray-500">
                Discover hidden gems and authentic local experiences that you won't find in guidebooks.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
