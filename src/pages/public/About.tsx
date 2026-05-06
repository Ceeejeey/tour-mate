import React from 'react';
import { Compass, Users, Globe, Shield } from 'lucide-react';

export default function About() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-forest-900 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-forest-900/80 to-transparent z-10" />
        <img 
          src="https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80&w=2000" 
          alt="Sri Lanka Landscape" 
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 text-center">
          <h1 className="text-5xl font-extrabold tracking-tight mb-6">About TourMate</h1>
          <p className="text-xl text-forest-100 max-w-3xl mx-auto leading-relaxed">
            Connecting passionate travelers with authentic local experts to create unforgettable journeys across the pearl of the Indian Ocean.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-forest-900 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              At TourMate, we believe that the best way to experience a country is through the eyes of those who call it home. Our mission is to empower local guides by providing them with a platform to showcase their expertise, while giving tourists access to safe, reliable, and deeply authentic travel experiences.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              We strive to promote sustainable tourism that directly benefits local communities and preserves the rich cultural heritage and natural beauty of Sri Lanka.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-earth-50 p-6 rounded-2xl">
              <Users className="w-10 h-10 text-earth-600 mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">Community Driven</h3>
              <p className="text-gray-600 text-sm">Supporting local economies directly.</p>
            </div>
            <div className="bg-sky-50 p-6 rounded-2xl mt-8">
              <Globe className="w-10 h-10 text-sky-600 mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">Authentic Travel</h3>
              <p className="text-gray-600 text-sm">Real experiences, beyond the guidebooks.</p>
            </div>
            <div className="bg-forest-50 p-6 rounded-2xl -mt-8">
              <Shield className="w-10 h-10 text-forest-600 mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">Safe & Secure</h3>
              <p className="text-gray-600 text-sm">Verified guides and secure bookings.</p>
            </div>
            <div className="bg-yellow-50 p-6 rounded-2xl">
              <Compass className="w-10 h-10 text-yellow-600 mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">Expert Guidance</h3>
              <p className="text-gray-600 text-sm">Knowledgeable professionals at your service.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
