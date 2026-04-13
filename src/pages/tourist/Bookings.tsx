import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Booking } from '../../types';
import StatusBadge from '../../components/shared/StatusBadge';
import { formatCurrency, formatDateTime } from '../../lib/utils';
import { Calendar, MapPin, MessageCircle, CreditCard, Loader2, CheckCircle, Star, AlertCircle, MapPinIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import PaymentModal from '../../components/tourist/PaymentModal';
import FeedbackModal from '../../components/tourist/FeedbackModal';

export default function Bookings() {
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBookingForPayment, setSelectedBookingForPayment] = useState<Booking | null>(null);
  const [selectedBookingForFeedback, setSelectedBookingForFeedback] = useState<Booking | null>(null);
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
          <span className="text-forest-600 text-sm font-medium">Loading your bookings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-forest-600 to-forest-700 rounded-2xl p-8 mb-8 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-forest-500 p-3 rounded-lg">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">My Bookings</h1>
              <p className="text-forest-100 text-sm mt-1">Manage all your tour bookings</p>
            </div>
          </div>
          <Link
            to="/tourist/search"
            className="bg-earth-500 hover:bg-earth-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-lg"
          >
            <MapPinIcon size={16} />
            Book New Trip
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      {myBookings.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-900">{myBookings.length}</p>
              </div>
              <div className="bg-forest-50 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-forest-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Completed</p>
                <p className="text-3xl font-bold text-gray-900">{myBookings.filter(b => b.status === 'completed').length}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Pending</p>
                <p className="text-3xl font-bold text-gray-900">{myBookings.filter(b => b.status === 'pending').length}</p>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Total Spent</p>
                <p className="text-3xl font-bold text-gray-900">{formatCurrency(myBookings.reduce((sum, b) => sum + b.totalPrice, 0))}</p>
              </div>
              <div className="bg-earth-50 p-3 rounded-lg">
                <CreditCard className="w-6 h-6 text-earth-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      <div>
        {myBookings.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
            {myBookings.map((booking) => {
              const guide = booking.guide;
              if (!guide) return null;

              return (
                <div key={booking.id} className={`bg-white rounded-2xl border-2 overflow-hidden hover:shadow-lg transition-all duration-300 ${getStatusColor(booking.status)}`}>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
                      {/* Guide Info */}
                      <div className="md:col-span-1">
                        <div className="flex items-start gap-4">
                          <img
                            src={guide.avatar || "https://ui-avatars.com/api/?name=" + guide.name}
                            alt={guide.name}
                            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                          />
                          <div>
                            <Link to={`/tourist/guide/${guide.id}`} className="hover:underline">
                              <h3 className="font-bold text-gray-900 text-lg">{guide.name}</h3>
                            </Link>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <MapPin size={14} className="mr-1" />
                              {guide.serviceArea || "No Area"}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Booking Details */}
                      <div className="md:col-span-2 grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">Booked On</p>
                          <div className="flex items-center gap-2 text-gray-900 font-semibold">
                            <Calendar size={16} className="text-forest-600" />
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
                      </div>

                      {/* Actions */}
                      <div className="md:col-span-1 flex flex-col gap-2">
                        {(booking.status === 'confirmed' || booking.status === 'pending') && booking.paymentStatus !== 'paid' ? (
                          <button
                            onClick={() => setSelectedBookingForPayment(booking)}
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-forest-600 to-forest-700 text-white text-sm font-semibold rounded-lg hover:shadow-md transition-all w-full"
                          >
                            <CreditCard size={16} />
                            Pay Now
                          </button>
                        ) : booking.paymentStatus === 'paid' ? (
                          <button
                            disabled
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-green-100 text-green-700 text-sm font-semibold rounded-lg cursor-not-allowed w-full"
                          >
                            <CheckCircle size={16} />
                            Payment Done
                          </button>
                        ) : null}
                        
                        {(booking.status === 'pending' || (booking.status === 'confirmed' && booking.paymentStatus !== 'paid')) && (
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors w-full"
                          >
                            Cancel Booking
                          </button>
                        )}
                        
                        {(booking.status === 'completed' || booking.paymentStatus === 'paid') && !booking.isReviewed && (
                          <button
                            onClick={() => setSelectedBookingForFeedback(booking)}
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-yellow-400 to-earth-400 text-white text-sm font-semibold rounded-lg hover:shadow-md transition-all w-full"
                          >
                            <Star size={16} />
                            Give Feedback
                          </button>
                        )}
                      </div>
                    </div>
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
            <p className="text-gray-500 text-sm mb-6">Start your adventure by discovering and booking with amazing guides</p>
            <Link to="/tourist/search" className="inline-block bg-forest-600 hover:bg-forest-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Find a Guide Now
            </Link>
          </div>
        )}
      </div>

      <PaymentModal
        isOpen={!!selectedBookingForPayment}
        booking={selectedBookingForPayment}
        onClose={() => setSelectedBookingForPayment(null)}
        onSuccess={() => {
          setSelectedBookingForPayment(null);
          fetchBookings();
        }}
      />

      <FeedbackModal
        isOpen={!!selectedBookingForFeedback}
        booking={selectedBookingForFeedback}
        onClose={() => setSelectedBookingForFeedback(null)}
        onSuccess={() => {
          setSelectedBookingForFeedback(null);
          fetchBookings();
        }}
      />
    </div>
  );
}
