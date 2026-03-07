import React from 'react';
import { Link } from 'react-router-dom';
import { MOCK_BOOKINGS, MOCK_GUIDES } from '../../data/mockData';
import StatusBadge from '../../components/shared/StatusBadge';
import { formatCurrency, formatDate } from '../../lib/utils';
import { Calendar, MapPin, MessageCircle, CreditCard } from 'lucide-react';

export default function Bookings() {
  // Filter bookings for the current mock user (t1)
  const myBookings = MOCK_BOOKINGS.filter(b => b.touristId === 't1');

  const getGuide = (id: string) => MOCK_GUIDES.find(g => g.id === id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
        <Link
          to="/tourist/search"
          className="bg-[#1E6B4A] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#165a3d] transition-colors"
        >
          Book New Trip
        </Link>
      </div>

      <div className="space-y-4">
        {myBookings.length > 0 ? (
          myBookings.map((booking) => {
            const guide = getGuide(booking.guideId);
            if (!guide) return null;

            return (
              <div key={booking.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Guide Info */}
                  <div className="flex items-start gap-4 md:w-1/4">
                    <img
                      src={guide.avatar}
                      alt={guide.name}
                      className="w-16 h-16 rounded-full object-cover border border-gray-200"
                    />
                    <div>
                      <h3 className="font-bold text-gray-900">{guide.name}</h3>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <MapPin size={14} className="mr-1" />
                        {guide.serviceArea}
                      </div>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Dates</div>
                      <div className="flex items-center gap-2 text-gray-900 font-medium">
                        <Calendar size={16} className="text-gray-400" />
                        <span>{formatDate(booking.startDate)} - {formatDate(booking.endDate)}</span>
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
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-[#1E6B4A] text-white text-sm font-medium rounded-lg hover:bg-[#165a3d]"
                      >
                        <CreditCard size={16} />
                        Pay Now
                      </Link>
                    )}
                    <Link
                      to="/tourist/chat"
                      className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50"
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
            <p className="text-gray-500 mb-4">You haven't booked any trips yet.</p>
            <Link to="/tourist/search" className="text-[#1E6B4A] font-medium hover:underline">
              Find a guide to get started
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
