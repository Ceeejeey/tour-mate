import React from 'react';
import { Link } from 'react-router-dom';
import { MOCK_BOOKINGS, MOCK_REVIEWS } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { Users, Calendar, DollarSign, Star, TrendingUp, Clock } from 'lucide-react';
import { formatCurrency, formatDate } from '../../lib/utils';
import StatusBadge from '../../components/shared/StatusBadge';

export default function Dashboard() {
  const { user } = useAuth();
  
  // Filter data for the current guide (mocked as 'g1')
  const guideId = 'g1';
  const myBookings = MOCK_BOOKINGS.filter(b => b.guideId === guideId);
  const myReviews = MOCK_REVIEWS.filter(r => r.guideId === guideId);
  
  // Calculate stats
  const totalBookings = myBookings.length;
  const totalEarnings = myBookings
    .filter(b => b.status === 'completed')
    .reduce((sum, b) => sum + b.totalPrice, 0);
  const averageRating = myReviews.reduce((sum, r) => sum + r.rating, 0) / myReviews.length || 0;
  const pendingRequests = myBookings.filter(b => b.status === 'pending').length;

  const upcomingBookings = myBookings
    .filter(b => ['confirmed', 'pending'].includes(b.status))
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 5);

  const stats = [
    { label: 'Total Bookings', value: totalBookings, icon: Calendar, color: 'bg-blue-500' },
    { label: 'Total Earnings', value: formatCurrency(totalEarnings), icon: DollarSign, color: 'bg-green-500' },
    { label: 'Average Rating', value: averageRating.toFixed(1), icon: Star, color: 'bg-yellow-500' },
    { label: 'Pending Requests', value: pendingRequests, icon: Clock, color: 'bg-orange-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}</h1>
          <p className="text-gray-500">Here's what's happening with your tours today.</p>
        </div>
        <Link
          to="/guide/bookings"
          className="bg-[#1E6B4A] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#165a3d] transition-colors shadow-sm"
        >
          View All Bookings
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
            <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10 mr-4`}>
              <stat.icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Bookings */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-bold text-lg text-gray-900">Upcoming Bookings</h2>
            <Link to="/guide/bookings" className="text-sm text-[#1E6B4A] hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-gray-100">
            {upcomingBookings.length > 0 ? (
              upcomingBookings.map((booking) => (
                <div key={booking.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-gray-900 mb-1">
                        Booking #{booking.id.toUpperCase()}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-2 mb-2">
                        <Calendar size={14} />
                        {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Tourist ID: {booking.touristId}
                      </div>
                    </div>
                    <StatusBadge status={booking.status} />
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                No upcoming bookings found.
              </div>
            )}
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="font-bold text-lg text-gray-900">Recent Reviews</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {myReviews.slice(0, 3).map((review) => (
              <div key={review.id} className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <div className="bg-gray-100 h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">
                      {review.touristId.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-gray-900">Tourist {review.touristId}</span>
                  </div>
                  <div className="flex items-center text-yellow-400 text-xs">
                    <Star size={12} fill="currentColor" />
                    <span className="ml-1 text-gray-600">{review.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{review.comment}</p>
                <p className="text-xs text-gray-400 mt-2">{formatDate(review.date)}</p>
              </div>
            ))}
            {myReviews.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No reviews yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
