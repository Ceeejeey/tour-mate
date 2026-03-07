import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_GUIDES, MOCK_REVIEWS } from '../../data/mockData';
import StarRating from '../../components/shared/StarRating';
import { MapPin, Languages, Calendar, CheckCircle, MessageCircle, Shield, Award } from 'lucide-react';
import NotFound from '../NotFound';

export default function GuideProfile() {
  const { id } = useParams();
  const guide = MOCK_GUIDES.find(g => g.id === id);
  const reviews = MOCK_REVIEWS.filter(r => r.guideId === id);

  if (!guide) return <NotFound />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="h-48 bg-[#1E6B4A]/10 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
        </div>
        <div className="px-8 pb-8 relative">
          <div className="flex flex-col md:flex-row items-start md:items-end -mt-16 mb-6 gap-6">
            <img
              src={guide.avatar}
              alt={guide.name}
              className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover"
            />
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                <h1 className="text-3xl font-bold text-gray-900">{guide.name}</h1>
                {guide.verified && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <CheckCircle size={12} className="mr-1" /> Verified Guide
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 text-gray-600 mb-2">
                <div className="flex items-center gap-1">
                  <MapPin size={16} />
                  <span>{guide.serviceArea}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Languages size={16} />
                  <span>{guide.languages.join(', ')}</span>
                </div>
              </div>
              <StarRating rating={guide.rating} count={guide.reviewCount} size={20} />
            </div>
            <div className="flex flex-col gap-3 w-full md:w-auto">
              <div className="text-right hidden md:block">
                <span className="text-3xl font-bold text-[#1E6B4A]">${guide.pricePerDay}</span>
                <span className="text-gray-500 text-sm">/day</span>
              </div>
              <div className="flex gap-3">
                <Link
                  to="/tourist/chat"
                  className="flex-1 md:flex-none px-6 py-2.5 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle size={18} />
                  Chat
                </Link>
                <Link
                  to={`/tourist/booking/new?guideId=${guide.id}`}
                  className="flex-1 md:flex-none px-6 py-2.5 bg-[#1E6B4A] text-white rounded-xl font-medium hover:bg-[#165a3d] transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <Calendar size={18} />
                  Book Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* About */}
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">About Me</h2>
            <p className="text-gray-600 leading-relaxed">{guide.bio}</p>
            
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 mb-2 text-gray-900 font-medium">
                  <Award className="text-[#F5A623]" size={20} />
                  Experience
                </div>
                <p className="text-gray-600 text-sm">{guide.experience}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 mb-2 text-gray-900 font-medium">
                  <Shield className="text-[#1E6B4A]" size={20} />
                  Expertise
                </div>
                <div className="flex flex-wrap gap-2">
                  {guide.skills.map(skill => (
                    <span key={skill} className="text-xs bg-white border border-gray-200 px-2 py-1 rounded-md text-gray-600">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Reviews */}
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Reviews ({reviews.length})</h2>
            <div className="space-y-6">
              {reviews.map(review => (
                <div key={review.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-200 h-10 w-10 rounded-full flex items-center justify-center text-gray-500 font-medium">
                        {review.touristId.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Tourist {review.touristId}</div>
                        <div className="text-xs text-gray-500">{review.date}</div>
                      </div>
                    </div>
                    <StarRating rating={review.rating} showCount={false} size={14} />
                  </div>
                  <p className="text-gray-600 text-sm mt-2">{review.comment}</p>
                </div>
              ))}
              {reviews.length === 0 && (
                <p className="text-gray-500 italic">No reviews yet.</p>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Availability & Booking Preview */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
            <h3 className="font-bold text-gray-900 mb-4">Availability</h3>
            {/* Mock Calendar Visualization */}
            <div className="grid grid-cols-7 gap-1 text-center text-sm mb-4">
              {['S','M','T','W','T','F','S'].map((d,i) => (
                <div key={i} className="text-gray-400 font-medium py-1">{d}</div>
              ))}
              {Array.from({ length: 30 }).map((_, i) => {
                const isAvailable = Math.random() > 0.3;
                return (
                  <div
                    key={i}
                    className={`aspect-square flex items-center justify-center rounded-md text-xs ${
                      isAvailable 
                        ? 'bg-green-50 text-green-700 hover:bg-green-100 cursor-pointer' 
                        : 'bg-gray-50 text-gray-300 cursor-not-allowed'
                    }`}
                  >
                    {i + 1}
                  </div>
                );
              })}
            </div>
            
            <div className="flex items-center gap-4 text-xs text-gray-500 mb-6">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-100 rounded-sm"></div> Available
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-gray-100 rounded-sm"></div> Booked
              </div>
            </div>

            <Link
              to={`/tourist/booking/new?guideId=${guide.id}`}
              className="w-full block text-center bg-[#1E6B4A] text-white py-3 rounded-xl font-bold hover:bg-[#165a3d] transition-colors shadow-sm"
            >
              Book {guide.name}
            </Link>
            <p className="text-center text-xs text-gray-400 mt-3">
              No payment required until booking is confirmed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
