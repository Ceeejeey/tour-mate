import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MOCK_GUIDES } from '../../data/mockData';
import { Calendar, DollarSign, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import { differenceInDays, parseISO, addDays } from 'date-fns';

export default function BookingNew() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const guideId = searchParams.get('guideId');
  const guide = MOCK_GUIDES.find(g => g.id === guideId);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!guide) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Guide Not Found</h2>
        <p className="text-gray-500 mb-6">Please select a valid guide to book.</p>
        <button
          onClick={() => navigate('/tourist/search')}
          className="bg-[#1E6B4A] text-white px-6 py-2 rounded-lg hover:bg-[#165a3d]"
        >
          Find a Guide
        </button>
      </div>
    );
  }

  const calculateTotal = () => {
    if (!startDate || !endDate) return 0;
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    const days = differenceInDays(end, start) + 1;
    return days > 0 ? days * guide.pricePerDay : 0;
  };

  const total = calculateTotal();
  const days = total / guide.pricePerDay;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/tourist/bookings');
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Book Your Trip</h1>
        <p className="text-gray-500">Complete the details below to request a booking with {guide.name}.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Booking Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-[#1E6B4A] focus:border-[#1E6B4A] sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  required
                  min={startDate || new Date().toISOString().split('T')[0]}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-[#1E6B4A] focus:border-[#1E6B4A] sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trip Notes</label>
              <textarea
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-[#1E6B4A] focus:border-[#1E6B4A] sm:text-sm"
                placeholder="Tell the guide about your interests, group size, or specific places you want to visit..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || total <= 0}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#1E6B4A] hover:bg-[#165a3d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1E6B4A] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Processing...' : 'Confirm Booking Request'}
            </button>
          </form>

          {/* Summary Card */}
          <div className="bg-gray-50 p-6 rounded-xl h-fit">
            <h3 className="font-bold text-gray-900 mb-4">Booking Summary</h3>
            
            <div className="flex items-center gap-4 mb-6">
              <img
                src={guide.avatar}
                alt={guide.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
              />
              <div>
                <div className="font-medium text-gray-900">{guide.name}</div>
                <div className="text-sm text-gray-500">{guide.serviceArea}</div>
              </div>
            </div>

            <div className="space-y-3 border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Price per day</span>
                <span className="font-medium text-gray-900">{formatCurrency(guide.pricePerDay)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Duration</span>
                <span className="font-medium text-gray-900">{days > 0 ? days : 0} days</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Service Fee</span>
                <span className="font-medium text-gray-900">{formatCurrency(total * 0.05)}</span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
              <span className="font-bold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-[#1E6B4A]">
                {formatCurrency(total + (total * 0.05))}
              </span>
            </div>

            <div className="mt-6 bg-blue-50 p-3 rounded-lg flex gap-3 items-start">
              <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700">
                You won't be charged yet. The guide has 24 hours to accept your request.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
