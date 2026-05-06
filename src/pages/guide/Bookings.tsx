import React, { useState, useEffect } from 'react';
import { Booking } from '../../types';
import StatusBadge from '../../components/shared/StatusBadge';
import { formatCurrency, formatDateTime } from '../../lib/utils';
import { Check, X, Calendar, DollarSign, MessageCircle, Loader2, MapPin, AlertCircle, Users, TrendingUp, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import TouristMapModal from '../../components/guide/TouristMapModal';

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTouristForMap, setSelectedTouristForMap] = useState<any | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('tourmate_token');
      const response = await fetch('http://localhost:5066/api/bookings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      } else {
        toast.error('Failed to load bookings');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error fetching bookings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (bookingId: string, newStatus: 'confirmed' | 'cancelled' | 'completed') => {
    try {
      const token = localStorage.getItem('tourmate_token');
      const response = await fetch(`http://localhost:5066/api/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ Status: newStatus })
      });
      
      if (response.ok) {
        toast.success(`Booking ${newStatus === 'confirmed' ? 'accepted' : newStatus === 'cancelled' ? 'declined' : 'completed'} successfully`);
        fetchBookings();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to update booking status');
      }
    } catch (err) {
      toast.error('Error updating booking status');
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'bg-green-50 border-green-200';
      case 'confirmed': return 'bg-blue-50 border-blue-200';
      case 'pending': return 'bg-yellow-50 border-yellow-200';
      case 'cancelled': return 'bg-red-50 border-red-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-forest-600" />
          <span className="text-forest-600 text-sm font-medium">Loading bookings...</span>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Total Bookings', value: bookings.length, icon: Users, bg: 'bg-forest-50', color: 'text-forest-600' },
    { label: 'Total Revenue', value: formatCurrency(bookings.filter(b => b.status === 'completed').reduce((sum, b) => sum + b.totalPrice, 0)), icon: DollarSign, bg: 'bg-earth-50', color: 'text-earth-600' },
    { label: 'Completed', value: bookings.filter(b => b.status === 'completed').length, icon: Check, bg: 'bg-green-50', color: 'text-green-600' },
    { label: 'Pending Requests', value: bookings.filter(b => b.status === 'pending').length, icon: AlertCircle, bg: 'bg-yellow-50', color: 'text-yellow-600' },
  ];

  return (
    <div className="p-6 lg:p-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-earth-600 to-earth-700 rounded-2xl p-8 mb-8 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <div className="bg-earth-500 p-3 rounded-lg">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Manage Bookings</h1>
            <p className="text-earth-100 text-sm mt-1">View and manage tourist bookings for your tours</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {bookings.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.bg} p-3 rounded-lg`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bookings List */}
      <div>
        {bookings.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
            {bookings.map((booking) => {
              const tourist = booking.tourist;
              if (!tourist) return null;

              return (
                <div key={booking.id} className={`bg-white rounded-2xl border-2 overflow-hidden hover:shadow-lg transition-all duration-300 ${getStatusColor(booking.status)}`}>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
                      {/* Tourist Info */}
                      <div className="md:col-span-1">
                        <div className="flex items-start gap-4">
                          <img
                            src={tourist.avatar || "https://ui-avatars.com/api/?name=" + tourist.name}
                            alt={tourist.name}
                            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                          />
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg">{tourist.name}</h3>
                            <div className="text-sm text-gray-500 mt-1 flex flex-col gap-1">
                              <div className="flex items-center gap-1">
                                <Phone size={14} />
                                {tourist.phone || 'No Phone'}
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin size={14} />
                                {((tourist.latitude ?? (tourist as any).Latitude) != null && (tourist.longitude ?? (tourist as any).Longitude) != null && !((tourist.latitude ?? (tourist as any).Latitude) === 0 && (tourist.longitude ?? (tourist as any).Longitude) === 0)) ? `${(tourist.latitude ?? (tourist as any).Latitude).toFixed(4)}, ${(tourist.longitude ?? (tourist as any).Longitude).toFixed(4)}` : 'Location not provided'}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Booking Details */}
                      <div className="md:col-span-2 grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">Booking Date</p>
                          <div className="flex items-center gap-2 text-gray-900 font-semibold">
                            <Calendar size={16} className="text-earth-600" />
                            <span className="text-sm">{formatDateTime(booking.bookingDate)}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">Total Price</p>
                          <div className="font-bold text-gray-900 text-lg">{formatCurrency(booking.totalPrice)}</div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">Status</p>
                          <StatusBadge status={booking.status} />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">Payment</p>
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            booking.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                            booking.paymentStatus === 'refunded' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {booking.paymentStatus ? booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1) : 'Pending'}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="md:col-span-1 flex flex-col gap-2">
                        {booking.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(booking.id, 'confirmed')}
                              className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-forest-600 to-forest-700 text-white text-sm font-semibold rounded-lg hover:shadow-md transition-all w-full"
                            >
                              <Check size={16} />
                              Accept
                            </button>
                            <button
                              onClick={() => handleStatusChange(booking.id, 'cancelled')}
                              className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors w-full"
                            >
                              <X size={16} />
                              Decline
                            </button>
                          </>
                        )}
                        
                        {booking.status === 'confirmed' && (
                          <button
                            onClick={() => handleStatusChange(booking.id, 'completed')}
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-semibold rounded-lg hover:shadow-md transition-all w-full"
                          >
                            <Check size={16} />
                            Mark Completed
                          </button>
                        )}
                        
                        <Link
                          to="/guide/chat"
                          className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors w-full"
                        >
                          <MessageCircle size={16} />
                          Message
                        </Link>
                        
                        <button
                          onClick={() => setSelectedTouristForMap({
                            name: tourist.name,
                            phone: tourist.phone,
                            latitude: tourist.latitude ?? (tourist as any).Latitude,
                            longitude: tourist.longitude ?? (tourist as any).Longitude
                          })}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 border-2 border-indigo-100 text-sm font-medium rounded-lg hover:bg-indigo-100 transition-colors w-full"
                        >
                          <MapPin size={16} />
                          View Map
                        </button>
                      </div>
                    </div>

                    {/* Notes Section */}
                    {booking.notes && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-2">Notes</p>
                        <p className="text-sm text-gray-600 italic bg-gray-50 p-3 rounded-lg">{booking.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-100 p-16 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-gray-100 p-4 rounded-lg">
                <AlertCircle className="w-8 h-8 text-gray-400" />
              </div>
            </div>
            <p className="text-gray-600 text-lg font-medium mb-2">No bookings yet</p>
            <p className="text-gray-500 text-sm">When tourists book your tours, they will appear here</p>
          </div>
        )}
      </div>

      {selectedTouristForMap && (
        <TouristMapModal
          isOpen={!!selectedTouristForMap}
          onClose={() => setSelectedTouristForMap(null)}
          tourist={selectedTouristForMap}
        />
      )}
    </div>
  );
}
