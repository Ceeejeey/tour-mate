import React, { useState } from 'react';
import { MOCK_BOOKINGS, MOCK_TOURISTS } from '../../data/mockData';
import StatusBadge from '../../components/shared/StatusBadge';
import { formatCurrency, formatDate } from '../../lib/utils';
import { Check, X, Calendar, User, DollarSign, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Bookings() {
  const guideId = 'g1'; // Mock current guide
  const [bookings, setBookings] = useState(
    MOCK_BOOKINGS.filter(b => b.guideId === guideId)
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
  );

  const handleStatusChange = (bookingId: string, newStatus: 'confirmed' | 'cancelled') => {
    setBookings(prev => 
      prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b)
    );
  };

  const getTourist = (id: string) => MOCK_TOURISTS.find(t => t.id === id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Manage Bookings</h1>

      <div className="space-y-6">
        {bookings.map((booking) => {
          const tourist = getTourist(booking.touristId);
          if (!tourist) return null;

          return (
            <div key={booking.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 flex flex-col lg:flex-row gap-6">
                {/* Tourist Info */}
                <div className="flex items-start gap-4 lg:w-1/4">
                  <img
                    src={tourist.avatar}
                    alt={tourist.name}
                    className="w-12 h-12 rounded-full object-cover border border-gray-200"
                  />
                  <div>
                    <h3 className="font-bold text-gray-900">{tourist.name}</h3>
                    <div className="text-sm text-gray-500">{tourist.nationality}</div>
                    <div className="text-sm text-gray-500 mt-1">{tourist.phone}</div>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <Calendar size={16} />
                      <span className="text-sm font-medium">Dates</span>
                    </div>
                    <div className="text-gray-900">
                      {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
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
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-[#1E6B4A] text-white text-sm font-medium rounded-lg hover:bg-[#165a3d] transition-colors"
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
        })}

        {bookings.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
            <p className="text-gray-500">No bookings found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
