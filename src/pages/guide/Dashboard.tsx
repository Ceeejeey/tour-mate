import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MOCK_BOOKINGS, MOCK_REVIEWS } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { Users, Calendar, DollarSign, Star, TrendingUp, Clock, MapPin, TreePine, Navigation, Loader2 } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import { Guide } from '../../types';

export default function Dashboard() {
  const { user, updateUser } = useAuth();
  const guideUser = user as Guide | null;

  const guideId = user?.id || 'g1';
  const myBookings = MOCK_BOOKINGS.filter(b => b.guideId === guideId);
  const myReviews = MOCK_REVIEWS.filter(r => r.guideId === guideId);

  const [isAvailable, setIsAvailable] = useState(guideUser?.isAvailable || false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    guideUser?.latitude && guideUser?.longitude 
      ? { lat: guideUser.latitude, lng: guideUser.longitude } 
      : null
  );
  
  const [isLocating, setIsLocating] = useState(false);
  const [isStatusUpdating, setIsStatusUpdating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Sync state if user context updates remotely
  useEffect(() => {
    if (guideUser) {
      if (guideUser.isAvailable !== undefined) setIsAvailable(guideUser.isAvailable);
      if (guideUser.latitude && guideUser.longitude) {
        setLocation({ lat: guideUser.latitude, lng: guideUser.longitude });
      }
    }
  }, [guideUser]);

  const totalBookings = myBookings.length;
  const totalEarnings = myBookings
    .filter(b => b.status === 'completed')
    .reduce((sum, b) => sum + b.totalPrice, 0);
  const averageRating = myReviews.reduce((sum, r) => sum + r.rating, 0) / myReviews.length || 0;
  const pendingRequests = myBookings.filter(b => b.status === 'pending').length;

  const stats = [
    { label: 'Total Bookings', value: totalBookings, icon: Calendar, color: 'bg-forest-500', lightBg: 'bg-forest-50', textColor: 'text-forest-600' },
    { label: 'Total Earnings', value: formatCurrency(totalEarnings), icon: DollarSign, color: 'bg-earth-500', lightBg: 'bg-earth-50', textColor: 'text-earth-600' },
    { label: 'Average Rating', value: averageRating.toFixed(1), icon: Star, color: 'bg-earth-400', lightBg: 'bg-earth-50', textColor: 'text-earth-500' },
    { label: 'Pending Requests', value: pendingRequests, icon: Clock, color: 'bg-sky-500', lightBg: 'bg-sky-50', textColor: 'text-sky-600' },
  ];

  const handleToggleStatus = async () => {
    try {
      setIsStatusUpdating(true);
      const newStatus = !isAvailable;
      
      const token = localStorage.getItem('tourmate_token');
      const res = await fetch('http://localhost:5066/api/users/me/status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isAvailable: newStatus })
      });
      
      if (!res.ok) throw new Error("Failed to update status");
      
      setIsAvailable(newStatus);
      if (guideUser) {
        updateUser({ ...guideUser, isAvailable: newStatus });
      }
    } catch (err: any) {
      alert(err.message || 'Error updating status');
    } finally {
      setIsStatusUpdating(false);
    }
  };

  const handleUpdateLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const token = localStorage.getItem('tourmate_token');
          const res = await fetch('http://localhost:5066/api/users/me/location', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ latitude, longitude })
          });
          
          if (!res.ok) throw new Error("Failed to update location");
          
          setLocation({ lat: latitude, lng: longitude });
          if (guideUser) {
            updateUser({ ...guideUser, latitude, longitude });
          }
        } catch (err: any) {
          setLocationError('Failed to save location to the server.');
        } finally {
          setIsLocating(false);
        }
      },
      () => {
        setLocationError('Unable to retrieve your location.');
        setIsLocating(false);
      }
    );
  };

  return (
    <div className="p-6 lg:p-8">
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

      <div className="bg-white rounded-xl shadow-sm border border-forest-100 p-5 mb-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex items-center gap-4 md:border-r md:border-gray-200 md:pr-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">Your Status</h3>
              <p className="text-xs text-gray-400">Tourists can see when you're available</p>
            </div>
            <button
              onClick={handleToggleStatus}
              disabled={isStatusUpdating}
              className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${
                isAvailable ? 'bg-green-500' : 'bg-gray-300'
              } ${isStatusUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-5 rounded-xl shadow-sm border border-forest-100 flex items-center hover:shadow-md transition-shadow">
            <div className={`p-3 rounded-xl ${stat.lightBg} mr-4`}>
              <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
