import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MOCK_BOOKINGS, MOCK_REVIEWS } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { Users, Calendar, DollarSign, Star, TrendingUp, Clock, MapPin, TreePine, Navigation, Loader2 } from 'lucide-react';
import { formatCurrency, formatDate, formatDateTime } from '../../lib/utils';
import StatusBadge from '../../components/shared/StatusBadge';

export default function Dashboard() {
  const { user } = useAuth();

  const guideId = 'g1';
  const myBookings = MOCK_BOOKINGS.filter(b => b.guideId === guideId);
  const myReviews = MOCK_REVIEWS.filter(r => r.guideId === guideId);

  const [isAvailable, setIsAvailable] = useState(true);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const totalBookings = myBookings.length;
  const totalEarnings = myBookings
    .filter(b => b.status === 'completed')
    .reduce((sum, b) => sum + b.totalPrice, 0);
  const averageRating = myReviews.reduce((sum, r) => sum + r.rating, 0) / myReviews.length || 0;
  const pendingRequests = myBookings.filter(b => b.status === 'pending').length;

  const upcomingBookings = myBookings
    .filter(b => ['confirmed', 'pending'].includes(b.status))
    .sort((a, b) => new Date(a.bookingDate).getTime() - new Date(b.bookingDate).getTime())
    .slice(0, 5);

  const stats = [
    { label: 'Total Bookings', value: totalBookings, icon: Calendar, color: 'bg-forest-500', lightBg: 'bg-forest-50', textColor: 'text-forest-600' },
    { label: 'Total Earnings', value: formatCurrency(totalEarnings), icon: DollarSign, color: 'bg-earth-500', lightBg: 'bg-earth-50', textColor: 'text-earth-600' },
    { label: 'Average Rating', value: averageRating.toFixed(1), icon: Star, color: 'bg-earth-400', lightBg: 'bg-earth-50', textColor: 'text-earth-500' },
    { label: 'Pending Requests', value: pendingRequests, icon: Clock, color: 'bg-sky-500', lightBg: 'bg-sky-50', textColor: 'text-sky-600' },
  ];

  const handleUpdateLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLocating(false);
      },
      () => {
        setLocationError('Unable to retrieve your location.');
        setIsLocating(false);
      }
    );
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TreePine className="text-forest-500" size={20} />
            <span className="text-forest-500 text-sm font-medium">Guide Dashboard</span>
          </div>
          <h1 className="text-2xl font-bold text-forest-800">Welcome back, {user?.name}</h1>
          <p className="text-forest-400 mt-1">Here's what's happening with your tours today.</p>
        </div>
        <Link
          to="/guide/bookings"
          className="bg-gradient-to-r from-forest-600 to-forest-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:from-forest-700 hover:to-forest-800 transition-all shadow-sm"
        >
          View All Bookings
        </Link>
      </div>

      {/* Availability & Location Card */}
      <div className="bg-white rounded-xl shadow-sm border border-forest-100 p-5 mb-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Availability Toggle */}
          <div className="flex items-center gap-4 md:border-r md:border-gray-200 md:pr-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">Your Status</h3>
              <p className="text-xs text-gray-400">Tourists can see when you're available</p>
            </div>
            <button
              onClick={() => setIsAvailable(!isAvailable)}
              className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${
                isAvailable ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
                  isAvailable ? 'translate-x-8' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-semibold ${isAvailable ? 'text-green-600' : 'text-gray-500'}`}>
              {isAvailable ? 'Available' : 'Unavailable'}
            </span>
          </div>

          {/* Location Update */}
          <div className="flex items-center gap-4 flex-1">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-700 mb-1">Current Location</h3>
              {location ? (
                <p className="text-xs text-gray-500">
                  <MapPin size={12} className="inline mr-1" />
                  {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                </p>
              ) : (
                <p className="text-xs text-gray-400">Location not set. Update to appear on the tourist map.</p>
              )}
              {locationError && (
                <p className="text-xs text-red-500 mt-1">{locationError}</p>
              )}
            </div>
            <button
              onClick={handleUpdateLocation}
              disabled={isLocating}
              className="flex items-center gap-2 px-4 py-2 bg-forest-50 text-forest-700 text-sm font-medium rounded-lg hover:bg-forest-100 transition-colors disabled:opacity-50"
            >
              {isLocating ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Navigation size={16} />
              )}
              {isLocating ? 'Locating...' : 'Update Location'}
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-5 rounded-xl shadow-sm border border-forest-100 flex items-center hover:shadow-md transition-shadow">
            <div className={`p-3 rounded-xl ${stat.lightBg} mr-4`}>
              <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-forest-400">{stat.label}</p>
              <p className="text-2xl font-bold text-forest-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Bookings */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-forest-100 overflow-hidden">
          <div className="p-5 border-b border-forest-50 flex justify-between items-center">
            <h2 className="font-bold text-lg text-forest-800">Upcoming Bookings</h2>
            <Link to="/guide/bookings" className="text-sm text-forest-600 hover:text-forest-700 hover:underline font-medium">View all</Link>
          </div>
          <div className="divide-y divide-forest-50">
            {upcomingBookings.length > 0 ? (
              upcomingBookings.map((booking) => (
                <div key={booking.id} className="p-5 hover:bg-forest-50/30 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-forest-800 mb-1">
                        Booking #{booking.id.toUpperCase()}
                      </div>
                      <div className="text-sm text-forest-400 flex items-center gap-2 mb-2">
                        <Calendar size={14} />
                        {formatDateTime(booking.bookingDate)}
                      </div>
                      <div className="text-sm text-forest-400">
                        Tourist ID: {booking.touristId}
                      </div>
                    </div>
                    <StatusBadge status={booking.status} />
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-forest-400">
                <MapPin className="h-8 w-8 text-forest-200 mx-auto mb-2" />
                No upcoming bookings found.
              </div>
            )}
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="bg-white rounded-xl shadow-sm border border-forest-100 overflow-hidden">
          <div className="p-5 border-b border-forest-50">
            <h2 className="font-bold text-lg text-forest-800">Recent Reviews</h2>
          </div>
          <div className="divide-y divide-forest-50">
            {myReviews.slice(0, 3).map((review) => (
              <div key={review.id} className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <div className="bg-forest-100 h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-forest-600">
                      {review.touristId.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-forest-700">Tourist {review.touristId}</span>
                  </div>
                  <div className="flex items-center text-earth-400 text-xs">
                    <Star size={12} fill="currentColor" />
                    <span className="ml-1 text-forest-500 font-medium">{review.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-forest-500 line-clamp-2">{review.comment}</p>
                <p className="text-xs text-forest-300 mt-2">{formatDate(review.date)}</p>
              </div>
            ))}
            {myReviews.length === 0 && (
              <div className="p-8 text-center text-forest-400">
                No reviews yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
