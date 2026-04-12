import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Booking } from '../../types';
import StatusBadge from '../../components/shared/StatusBadge';
import { formatCurrency, formatDateTime } from '../../lib/utils';
import { Calendar, MapPin, MessageCircle, CreditCard, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function Bookings() {
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

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
        setMyBookings(data);
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

  const handleCancelBooking = async (id: string) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    
    try {
      const token = localStorage.getItem('tourmate_token');
      const response = await fetch(`http://localhost:5066/api/bookings/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ Status: 'cancelled' })
      });
      
      if (response.ok) {
        toast.success('Booking cancelled successfully');
        fetchBookings();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to cancel booking');
      }
    } catch (err) {
      toast.error('Error cancelling booking');
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
        <Link
          to="/tourist/search"
          className="bg-forest-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-forest-700 transition-colors"
        >
          Book New Trip
        </Link>
      </div>

      <div className="space-y-4">
        {myBookings.length > 0 ? (
          myBookings.map((booking) => {
            const guide = booking.guide;
            if (!guide) return null;

            return (
              <div key={booking.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Guide Info */}
                  <div className="flex items-start gap-4 md:w-1/4">
                    <img
                      src={guide.avatar || "https://ui-avatars.com/api/?name=" + guide.name}
                      alt={guide.name}
                      className="w-16 h-16 rounded-full object-cover border border-gray-200"
                    />
                    <div>
                    <Link to={`/tourist/guide/${guide.id}`} className="hover:underline">
                      <h3 className="font-bold text-gray-900">{guide.name}</h3>
                    </Link>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <MapPin size={14} className="mr-1" />
                        {guide.serviceArea || "No Area Provided"}
                      </div>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Booked On</div>
                      <div className="flex items-center gap-2 text-gray-900 font-medium">
                        <Calendar size={16} className="text-gray-400" />
                        <span>{formatDateTime(booking.bookingDate)}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Price</div>
                      <div className="font-bold text-gray-900">{formatCurrency(booking.totalPrice)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Status</div>
                      <StatusBadge status={booking.status} />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex md:flex-col gap-2 justify-center md:w-40">
                    {booking.status === 'confirmed' && (
                      <Link
                        to={`/tourist/payment?bookingId=${booking.id}`}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-forest-600 text-white text-sm font-medium rounded-lg hover:bg-forest-700"
                      >
                        <CreditCard size={16} />
                        Pay Now
                      </Link>
                    )}
                    {(booking.status === 'pending' || booking.status === 'confirmed') && (
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
            <p className="text-gray-500 mb-4">You haven't booked any trips yet.</p>
            <Link to="/tourist/search" className="text-forest-600 font-medium hover:underline">
              Find a guide to get started
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
