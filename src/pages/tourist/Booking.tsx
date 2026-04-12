import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Guide } from '../../types';
import { Zap, CheckCircle, AlertCircle, MessageCircle, Loader2 } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

export default function BookingNew() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const guideId = searchParams.get('guideId');
  
  const [guide, setGuide] = useState<Guide | null>(null);
  const [isLoadingGuide, setIsLoadingGuide] = useState(true);

  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchGuideDetails = async () => {
      setIsLoadingGuide(true);
      try {
        const token = localStorage.getItem('tourmate_token');
        const response = await fetch('http://localhost:5066/api/users/guides', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const guides: Guide[] = await response.json();
          const foundGuide = guides.find(g => g.id.toString() === guideId);
          setGuide(foundGuide || null);
        }
      } catch (err) {
        console.error('Error fetching guide details:', err);
      } finally {
        setIsLoadingGuide(false);
      }
    };
    
    if (guideId) {
      fetchGuideDetails();
    } else {
      setIsLoadingGuide(false);
    }
  }, [guideId]);

  if (isLoadingGuide) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 text-forest-600 animate-spin mb-4" />
        <h2 className="text-xl font-medium text-gray-700">Loading Booking Details...</h2>
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Guide Not Found</h2>
        <p className="text-gray-500 mb-6">Please select a valid guide to book.</p>
        <button
          onClick={() => navigate('/tourist/search')}
          className="bg-forest-600 text-white px-6 py-2 rounded-lg hover:bg-forest-700"
        >
          Find a Guide
        </button>
      </div>
    );
  }

  const sessionPrice = guide.pricePerSession || 0;
  const serviceFee = sessionPrice * 0.05;
  const total = sessionPrice + serviceFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guide) return;
    
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('tourmate_token');
      const response = await fetch('http://localhost:5066/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          GuideId: guide.id,
          TotalPrice: total,
          Notes: notes
        })
      });

      if (response.ok) {
        navigate('/tourist/bookings');
      } else {
        console.error('Failed to create booking');
      }
    } catch (err) {
      console.error('Error submitting booking:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Instant Booking</h1>
        <p className="text-gray-500">Confirm your instant booking with {guide.name}.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Booking Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes for the Guide</label>
              <textarea
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-forest-500 focus:border-forest-600 sm:text-sm"
                placeholder="Tell the guide about your interests, group size, or specific places you want to visit..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !guide.isAvailable}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-forest-600 hover:bg-forest-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forest-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Zap size={18} />
              {isSubmitting ? 'Processing...' : guide.isAvailable ? 'Book Now' : 'Guide Unavailable'}
            </button>
          </form>

          {/* Summary Card */}
          <div className="bg-gray-50 p-6 rounded-xl h-fit">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-gray-900">Booking Summary</h3>
              <button
                onClick={() => navigate(`/tourist/chat?userId=${guide.id}`)}
                className="text-forest-600 hover:text-forest-700 bg-forest-50 hover:bg-forest-100 px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
              >
                <MessageCircle size={16} />
                Message Guide
              </button>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <img
                src={guide.avatar || `https://ui-avatars.com/api/?name=${guide.name}&background=CCC&color=fff`}
                alt={guide.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
              />
              <div>
                <div className="font-medium text-gray-900">{guide.name}</div>
                <div className="text-sm text-gray-500">{guide.serviceArea || guide.nationality}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-6 px-3 py-2 rounded-lg bg-white border border-gray-200">
              <div className={`w-2.5 h-2.5 rounded-full ${guide.isAvailable ? 'bg-green-500' : 'bg-gray-400'}`} />
              <span className={`text-sm font-medium ${guide.isAvailable ? 'text-green-700' : 'text-gray-500'}`}>
                {guide.isAvailable ? 'Available Now' : 'Currently Unavailable'}
              </span>
            </div>

            <div className="space-y-3 border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Session Price</span>
                <span className="font-medium text-gray-900">{formatCurrency(sessionPrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Service Fee (5%)</span>
                <span className="font-medium text-gray-900">{formatCurrency(serviceFee)}</span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
              <span className="font-bold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-forest-600">
                {formatCurrency(total)}
              </span>
            </div>

            <div className="mt-6 bg-blue-50 p-3 rounded-lg flex gap-3 items-start">
              <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700">
                Instant booking. The guide will be notified immediately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
