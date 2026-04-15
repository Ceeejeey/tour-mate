import React, { useState, useEffect } from 'react';
import StatusBadge from '../../components/shared/StatusBadge';
import { formatCurrency, formatDateTime } from '../../lib/utils';
import { Search, Filter, Loader2, AlertCircle, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Bookings() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const token = localStorage.getItem('tourmate_token');

  useEffect(() => {
    if (token) {
      fetchBookings();
    }
  }, [token]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5066/api/bookings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }
      
      const data = await response.json();
      setBookings(data);
    } catch (err: any) {
      console.error('Error fetching bookings:', err);
      setError(err.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const searchId = booking.id ? booking.id.toString().toLowerCase() : '';
    const touristName = booking.tourist?.name ? booking.tourist.name.toLowerCase() : '';
    const guideName = booking.guide?.name ? booking.guide.name.toLowerCase() : '';
    
    const searchLower = searchTerm.toLowerCase();
    
    const matchesSearch = 
      searchId.includes(searchLower) || 
      touristName.includes(searchLower) || 
      guideName.includes(searchLower);
      
    const matchesStatus = statusFilter === 'all' || booking.status?.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 lg:p-8">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-forest-600 to-forest-700 rounded-2xl p-8 mb-8 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <div className="bg-forest-500 p-3 rounded-lg">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">All Bookings</h1>
            <p className="text-forest-100 text-sm mt-1">Monitor and manage all tour bookings on your platform</p>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search by ID or Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-all"
            />
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          </div>
          
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-forest-500 focus:border-transparent appearance-none bg-white transition-all"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-8 rounded-xl flex flex-col items-center justify-center">
          <AlertCircle className="h-10 w-10 mb-4 text-red-400" />
          <p className="font-medium text-lg">{error}</p>
          <button 
            onClick={fetchBookings}
            className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      ) : loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 flex flex-col items-center justify-center">
          <Loader2 className="h-10 w-10 text-forest-600 animate-spin mb-4" />
          <p className="text-gray-500 font-medium">Loading bookings...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-1">No bookings found</h3>
          <p className="text-gray-500">No bookings match your search criteria</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Booking ID</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Tourist</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Guide</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Booking Date</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Total Price</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-forest-50/30 transition-colors">
                    <td className="px-6 py-4 font-semibold text-gray-900">#{booking.id.toString()}</td>
                    <td className="px-6 py-4 text-gray-700">{booking.tourist?.name || 'N/A'}</td>
                    <td className="px-6 py-4 text-gray-700">{booking.guide?.name || 'N/A'}</td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {formatDateTime(booking.bookingDate)}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {formatCurrency(booking.totalPrice)}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={booking.status?.toLowerCase() || 'pending'} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
