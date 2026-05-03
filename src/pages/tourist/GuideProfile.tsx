import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_REVIEWS } from '../../data/mockData';
import StarRating from '../../components/shared/StarRating';
import { MapPin, Languages, Zap, CheckCircle, MessageCircle, Shield, Award, Loader2, AlertCircle } from 'lucide-react';
import { Guide } from '../../types';
import NotFound from '../NotFound';
import { formatCurrency } from '../../lib/utils';
import toast from 'react-hot-toast';

export default function GuideProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [guide, setGuide] = useState<Guide | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Booking states
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasPendingBooking, setHasPendingBooking] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('tourmate_token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        
        // Fetch guide details
        const response = await fetch('http://localhost:5066/api/users/guides', { headers });
        if (response.ok) {
          const guides: Guide[] = await response.json();
          const found = guides.find(g => g.id.toString() === id);
          setGuide(found || null);
        }

        // If authenticated, check for pending bookings with this guide
        if (token && id) {
          const bookingsResponse = await fetch('http://localhost:5066/api/bookings', { headers });
          if (bookingsResponse.ok) {
            const bookings = await bookingsResponse.json();
            const pending = bookings.some(
              (b: any) => {
                const bGuideId = b.guideId || b.GuideId;
                const bStatus = b.status || b.Status;
                return bGuideId?.toString() === id && bStatus?.toLowerCase() === "pending";
              }
            );
            setHasPendingBooking(pending);
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) {
      fetchData();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 text-forest-600 animate-spin mb-4" />
        <h2 className="text-xl font-medium text-gray-700">Loading profile...</h2>
      </div>
    );
  }

  if (!guide) return <NotFound />;

  const reviews = MOCK_REVIEWS.filter(r => r.guideId === guide.id.toString());
  
  const sessionPrice = guide.pricePerSession || 0;
  const serviceFee = sessionPrice * 0.05;
  const total = sessionPrice + serviceFee;

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guide || hasPendingBooking) return;

    const token = localStorage.getItem('tourmate_token');
    if (!token) {
      navigate('/login');
      return;
    }

    setIsSubmitting(true);
    try {
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
        toast.success(`Successfully booked ${guide.name}!`);
        navigate('/tourist/bookings');
      } else {
        const errorData = await response.json().catch(() => null);
        toast.error(errorData?.message || 'Failed to create booking');
        console.error('Failed to create booking', errorData);
      }
    } catch (err) {
      toast.error('An error occurred. Please try again.');
      console.error('Error submitting booking:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {hasPendingBooking && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                You already have a pending booking request with this guide. Please wait for them to confirm before placing another booking.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="h-48 bg-forest-600/10 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
        </div>
        <div className="px-8 pb-8 relative">
          <div className="flex flex-col md:flex-row items-start md:items-end -mt-16 mb-6 gap-6">
            <img
              src={guide.avatar || `https://ui-avatars.com/api/?name=${guide.name}&background=CCC&color=fff`}
              alt={guide.name}
              className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover bg-white"
            />
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                <h1 className="text-3xl font-bold text-gray-900">{guide.name}</h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <CheckCircle size={12} className="mr-1" /> Verified Guide
                </span>
              </div>
              <div className="flex items-center gap-4 text-gray-600 mb-2">
                <div className="flex items-center gap-1">
                  <MapPin size={16} />
                  <span>{guide.serviceArea || guide.nationality || 'Global'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Languages size={16} />
                  <span>{guide.languages?.length ? guide.languages.join(', ') : 'English'}</span>
                </div>
              </div>
              <StarRating rating={guide.rating || 5} count={guide.reviewCount || 1} size={20} />
            </div>
            <div className="flex flex-col gap-3 w-full md:w-auto">
              <div className="text-right hidden md:block">
                <span className="text-3xl font-bold text-forest-600">{formatCurrency(sessionPrice)}</span>
                <span className="text-gray-500 text-sm">/session</span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    const token = localStorage.getItem('tourmate_token');
                    if(token) {
                      navigate(`/tourist/chat?userId=${guide.id}`);
                    } else {
                      navigate('/login');
                    }
                  }}
                  className="flex-1 md:flex-none px-6 py-2.5 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle size={18} />
                  Message Guide
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* About */}
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">About Me</h2>
            <p className="text-gray-600 leading-relaxed">{guide.bio || 'This guide has not added a bio yet.'}</p>
            
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 mb-2 text-gray-900 font-medium">
                  <Award className="text-earth-400" size={20} />
                  Experience
                </div>
                <p className="text-gray-600 text-sm">{guide.experience || 'Experienced Professional'}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 mb-2 text-gray-900 font-medium">
                  <Shield className="text-forest-600" size={20} />
                  Expertise
                </div>
                <div className="flex flex-wrap gap-2">
                  {(guide.skills && guide.skills.length > 0 ? guide.skills : ['Local Tours', 'History', 'Culture']).map(skill => (
                    <span key={skill} className="text-xs bg-white border border-gray-200 px-2 py-1 rounded-md text-gray-600">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Reviews */}
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Reviews ({reviews.length})</h2>
            <div className="space-y-6">
              {reviews.map(review => (
                <div key={review.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-200 h-10 w-10 rounded-full flex items-center justify-center text-gray-500 font-medium">
                        {review.touristId.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Tourist {review.touristId}</div>
                        <div className="text-xs text-gray-500">{review.date}</div>
                      </div>
                    </div>
                    <StarRating rating={review.rating} showCount={false} size={14} />
                  </div>
                  <p className="text-gray-600 text-sm mt-2">{review.comment}</p>
                </div>
              ))}
              {reviews.length === 0 && (
                <p className="text-gray-500 italic">No reviews yet.</p>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Booking Section directly integrated */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
            <h3 className="font-bold text-gray-900 mb-4 text-lg">Book this Guide</h3>

            <div className="flex items-center gap-3 mb-6 px-4 py-3 rounded-lg bg-gray-50 border border-gray-200">
              <div className={`w-3 h-3 rounded-full ${guide.isAvailable ? 'bg-green-500' : 'bg-gray-400'}`} />
              <span className={`font-medium ${guide.isAvailable ? 'text-green-700' : 'text-gray-500'}`}>
                {guide.isAvailable ? 'Available Now' : 'Currently Unavailable'}
              </span>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Session Price</span>
                <span className="font-medium text-gray-900">{formatCurrency(sessionPrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Service Fee (5%)</span>
                <span className="font-medium text-gray-900">{formatCurrency(serviceFee)}</span>
              </div>
              <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                <span className="font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-forest-600">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>

            <form onSubmit={handleBooking} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes for the Guide</label>
                <textarea
                  rows={3}
                  value={notes}
                  disabled={hasPendingBooking}
                  onChange={(e) => setNotes(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-forest-500 focus:border-forest-600 sm:text-sm disabled:bg-gray-100 disabled:text-gray-500"
                  placeholder="Tell the guide about your interests, group size, or places you want to visit..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !guide.isAvailable || hasPendingBooking}
                className={`w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl shadow-sm text-sm font-bold text-white transition-colors ${
                  (guide.isAvailable && !hasPendingBooking)
                    ? 'bg-forest-600 hover:bg-forest-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forest-500' 
                    : 'bg-gray-300 cursor-not-allowed opacity-75'
                }`}
              >
                <Zap size={18} />
                {isSubmitting ? 'Processing...' : hasPendingBooking ? 'Booking Pending' : guide.isAvailable ? 'Confirm Booking' : 'Guide Unavailable'}
              </button>
            </form>

            <div className="mt-4 bg-blue-50 p-3 rounded-lg flex gap-3 items-start">
              <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-800 leading-relaxed">
                {hasPendingBooking 
                  ? "You already have an active request. Wait for their response." 
                  : "Instant booking. The guide will be notified immediately upon your request."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
