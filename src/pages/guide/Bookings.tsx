import React, { useState, useEffect } from 'react';
import { Booking } from '../../types';
import StatusBadge from '../../components/shared/StatusBadge';
import { formatCurrency, formatDateTime } from '../../lib/utils';
import { Check, X, Calendar, DollarSign, MessageCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
        fetchBookings(); // Refresh bookings
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to update booking status');
      }
    } catch (err) {
      toast.error('Error updating booking status');
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-forest-600" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Manage Bookings</h1>

      <div className="space-y-6">
        {bookings.length > 0 ? (
          bookings.map((booking) => {
            const tourist = booking.tourist;
            if (!tourist) return null;

            return (
              <div key={booking.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 flex flex-col lg:flex-row gap-6">
                  {/* Tourist Info */}
                  <div className="flex items-start gap-4 lg:w-1/4">
                    <img
                      src={tourist.avatar || "https://ui-avatars.com/api/?name=" + tourist.name}
                      alt={tourist.name}
                      className="w-12 h-12 rounded-full object-cover border border-gray-200"
                    />
                    <div>
                      <h3 className="font-bold text-gray-900">{tourist.name}</h3>
                      <div className="text-sm text-gray-500 mt-1">{tourist.phone || 'No Phone provided'}</div>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <Calendar size={16} />
                        <span className="text-sm font-medium">Booked On</span>
                      </div>
                      <div className="text-gray-900">
                        {formatDateTime(booking.bookingDate)}
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <DollarSign size={16} />
                        <span className="text-sm font-medium">Total Price</span>
                      </div>
                      <div className="text-gray-900 font-bold">
                        {formatCurrency(booking.totalPrice)}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <span className="text-sm font-medium">Status</span>
                      </div>
                      <StatusBadge status={booking.status} />
                    </div>

                    {booking.notes && (
                      <div className="sm:col-span-2 lg:col-span-3 bg-gray-50 p-3 rounded-lg text-sm text-gray-600 mt-2">
                        <span className="font-medium text-gray-900">Notes: </span>
                        {booking.notes}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 justify-center lg:w-48 border-t lg:border-t-0 lg:border-l border-gray-100 pt-4 lg:pt-0 lg:pl-6">
                    {booking.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(booking.id, 'confirmed')}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-forest-600 text-white text-sm font-medium rounded-lg hover:bg-forest-700 transition-colors"
                        >
                          <Check size={16} />
                          Accept
                        </button>
                        <button
                          onClick={() => handleStatusChange(booking.id, 'cancelled')}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors"
                        >
                          <X size={16} />
                          Decline
                        </button>
                      </>
                    )}
                    {booking.status === 'confirmed' && (
                      <button
                        onClick={() => handleStatusChange(booking.id, 'completed')}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <Check size={16} />
                        Mark Completed
                      </button>
                    )}
                    <Link
                      to="/guide/chat"
                      className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <MessageCircle size={16} />
                      Message
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
            <p className="text-gray-500">No bookings found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
