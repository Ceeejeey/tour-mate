import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_REVIEWS } from '../../data/mockData';
import StarRating from '../../components/shared/StarRating';
import { MapPin, Languages, Zap, CheckCircle, MessageCircle, Shield, Award, Loader2, AlertCircle, Calendar, Users, Clock, Globe, Heart } from 'lucide-react';
import { Guide } from '../../types';
import NotFound from '../NotFound';
import { formatCurrency } from '../../lib/utils';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export default function GuideProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  
  const [guide, setGuide] = useState<Guide | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Booking states
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasPendingBooking, setHasPendingBooking] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [pendingBookingAction, setPendingBookingAction] = useState(false);
  const [touristsServed, setTouristsServed] = useState(0);
  const [joinedDate, setJoinedDate] = useState('Recently');

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
            
            // Real stats calculation
            const completedCount = bookings.filter(
              (b: any) => {
                const bGuideId = b.guideId || b.GuideId;
                const bStatus = b.status || b.Status;
                return bGuideId?.toString() === id && bStatus?.toLowerCase() === "completed";
              }
            ).length;
            setTouristsServed(completedCount);

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

        if (found?.createdAt) {
          const date = new Date(found.createdAt);
          setJoinedDate(date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));
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
  
  const TRAVEL_COVERS = [
    "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800",
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    "https://images.unsplash.com/photo-1530789253388-582c481c54b0",
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
    "https://images.unsplash.com/photo-1500835595336-7971e596db54"
  ];

  const coverImage = TRAVEL_COVERS[parseInt(guide.id.toString()) % TRAVEL_COVERS.length] + "?auto=format&fit=crop&q=80&w=1200";

  const sessionPrice = guide.pricePerSession || 0;
  const serviceFee = sessionPrice * 0.05;
  const total = sessionPrice + serviceFee;

  const hasValidLocation = (lat: any, lng: any) => {
    console.log('[DEBUG GuideProfile] Validating coordinates:', { lat, lng });
    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);
    
    if (!Number.isFinite(parsedLat) || !Number.isFinite(parsedLng)) {
      console.log('[DEBUG GuideProfile] Location invalid, not finite numbers');
      return false;
    }
    if (parsedLat === 0 && parsedLng === 0) {
      console.log('[DEBUG GuideProfile] Location invalid, coordinates are 0');
      return false;
    }
    return true;
  };

  const createBooking = async () => {
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

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guide || hasPendingBooking) return;

    const token = localStorage.getItem('tourmate_token');
    if (!token) {
      navigate('/login');
      return;
    }

    console.log('[DEBUG GuideProfile] Submit clicked. Current user object:', user);

    const currentLat = user?.latitude ?? (user as any)?.Latitude;
    const currentLng = user?.longitude ?? (user as any)?.Longitude;

    console.log('[DEBUG GuideProfile] Attempting to book with location:', { currentLat, currentLng });

    if (!hasValidLocation(currentLat, currentLng)) {
      console.log('[DEBUG GuideProfile] Location rejected, opening modal.');
      setPendingBookingAction(true);
      setIsLocationModalOpen(true);
      toast.error('Please share your location to continue booking.');
      return;
    }

    await createBooking();
  };

  const handleCaptureLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const token = localStorage.getItem('tourmate_token');
          const response = await fetch('http://localhost:5066/api/users/me/location', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ latitude, longitude })
          });

          if (!response.ok) {
            throw new Error('Failed to update location');
          }

          if (user) {
            updateUser({ ...user, latitude, longitude });
          }

          toast.success('Location saved. Completing your booking...');
          setIsLocationModalOpen(false);

          if (pendingBookingAction) {
            setPendingBookingAction(false);
            await createBooking();
          }
        } catch (err: any) {
          toast.error(err?.message || 'Failed to save location');
          console.error('Error updating location:', err);
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);
        toast.error('Unable to retrieve your location');
        console.error('Error getting location:', error);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-forest-50 to-white">
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
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-8 transform transition-all duration-300 hover:shadow-2xl">
        <div className="h-64 md:h-80 relative overflow-hidden">
          <img 
            src={coverImage} 
            alt="Cover" 
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute top-6 right-6">
            <button className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-all border border-white/30">
              <Heart size={20} />
            </button>
          </div>
        </div>
        
        <div className="px-8 pb-10 relative">
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="relative -mt-20 md:-mt-24 group">
              <img
                src={guide.avatar || `https://ui-avatars.com/api/?name=${guide.name}&background=CCC&color=fff`}
                alt={guide.name}
                className="w-40 h-40 md:w-48 md:h-48 rounded-3xl border-8 border-white shadow-2xl object-cover bg-white transform transition-transform duration-300 group-hover:scale-[1.02]"
              />
              <div className="absolute -bottom-2 -right-2 bg-green-500 border-4 border-white w-8 h-8 rounded-full shadow-lg" title="Online" />
            </div>
            
            <div className="flex-1 pt-4">
              <div className="flex flex-col md:flex-row md:items-center gap-3 mb-3">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">{guide.name}</h1>
                <div className="flex gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100 uppercase tracking-wider">
                    <CheckCircle size={14} className="mr-1.5" /> Verified
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-forest-50 text-forest-600 border border-forest-100 uppercase tracking-wider">
                    <Award size={14} className="mr-1.5" /> Pro Guide
                  </span>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-6 text-gray-600 font-medium mb-4">
                <div className="flex items-center gap-2 hover:text-forest-600 transition-colors">
                  <div className="p-1.5 bg-gray-100 rounded-lg"><MapPin size={18} /></div>
                  <span>{guide.serviceArea || guide.nationality || 'Global'}</span>
                </div>
                <div className="flex items-center gap-2 hover:text-forest-600 transition-colors">
                  <div className="p-1.5 bg-gray-100 rounded-lg"><Languages size={18} /></div>
                  <span>{guide.languages?.length ? guide.languages.join(', ') : 'English'}</span>
                </div>
                <div className="flex items-center gap-2 hover:text-forest-600 transition-colors">
                  <div className="p-1.5 bg-gray-100 rounded-lg"><Globe size={18} /></div>
                  <span>Local Expert</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <StarRating rating={guide.rating || 5} count={guide.reviewCount || 1} size={24} />
                <div className="h-4 w-px bg-gray-200 hidden md:block" />
                <span className="text-sm font-semibold text-gray-500 uppercase tracking-widest">{guide.reviewCount || 0} Total Reviews</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-4 w-full md:w-auto">
              <div className="bg-forest-50 p-4 rounded-2xl border border-forest-100 hidden md:block">
                <div className="text-right">
                  <span className="text-3xl font-black text-forest-700">{formatCurrency(sessionPrice)}</span>
                  <span className="text-forest-600/70 text-sm font-bold block">per session</span>
                </div>
              </div>
              <button
                onClick={() => {
                  const token = localStorage.getItem('tourmate_token');
                  if(token) {
                    navigate(`/tourist/chat?userId=${guide.id}`);
                  } else {
                    navigate('/login');
                  }
                }}
                className="w-full md:min-w-[200px] px-8 py-4 bg-white border-2 border-forest-600 rounded-2xl font-bold text-forest-700 hover:bg-forest-50 hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-3 group"
              >
                <MessageCircle size={20} className="group-hover:rotate-12 transition-transform" />
                Message Guide
              </button>
            </div>
          </div>
          
          {/* Quick Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-gray-100">
            {[
              { icon: <Clock className="text-earth-500" />, label: 'Experience', value: guide.experience || '3+ Years' },
              { icon: <Users className="text-sky-500" />, label: 'Tourists Served', value: `${touristsServed}+` },
              { icon: <Calendar className="text-forest-500" />, label: 'Joined', value: joinedDate },
              { icon: <Zap className="text-yellow-500" />, label: 'Response Time', value: '< 1 hour' }
            ].map((stat, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50/50 border border-transparent hover:border-gray-200 hover:bg-white hover:shadow-md transition-all group">
                <div className="p-3 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform">{stat.icon}</div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                  <p className="text-sm font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* About */}
          <section className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-forest-50 rounded-bl-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700 ease-out" />
            
            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
              <span className="w-8 h-1 bg-forest-600 rounded-full" />
              About Me
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg italic">
              "{guide.bio || 'This guide has not added a bio yet.'}"
            </p>
            
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-gradient-to-br from-earth-50 to-white rounded-2xl border border-earth-100 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-earth-100 rounded-xl text-earth-600">
                    <Award size={24} />
                  </div>
                  <h3 className="font-bold text-gray-900">Experience</h3>
                </div>
                <p className="text-gray-600 font-medium">{guide.experience || 'Experienced Professional'}</p>
              </div>
              
              <div className="p-6 bg-gradient-to-br from-forest-50 to-white rounded-2xl border border-forest-100 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-forest-100 rounded-xl text-forest-600">
                    <Shield size={24} />
                  </div>
                  <h3 className="font-bold text-gray-900">Expertise</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(guide.skills && guide.skills.length > 0 ? guide.skills : ['Local Tours', 'History', 'Culture']).map(skill => (
                    <span key={skill} className="text-xs font-bold bg-white border border-forest-100 px-3 py-1.5 rounded-full text-forest-700 shadow-sm uppercase tracking-wider">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Reviews */}
          <section className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                <span className="w-8 h-1 bg-earth-500 rounded-full" />
                Guest Reviews
              </h2>
              <div className="px-4 py-2 bg-gray-50 rounded-2xl border border-gray-100 text-sm font-bold text-gray-500">
                {reviews.length} total
              </div>
            </div>
            
            <div className="grid gap-8">
              {reviews.map(review => (
                <div key={review.id} className="group relative p-6 rounded-2xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-gradient-to-br from-earth-400 to-earth-600 h-14 w-14 rounded-2xl shadow-lg flex items-center justify-center text-white text-xl font-black">
                        {review.touristId.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-black text-gray-900 text-lg">Tourist {review.touristId}</div>
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                          <Calendar size={12} />
                          {review.date}
                        </div>
                      </div>
                    </div>
                    <div className="bg-white px-3 py-1.5 rounded-xl shadow-sm border border-gray-100">
                      <StarRating rating={review.rating} showCount={false} size={16} />
                    </div>
                  </div>
                  <p className="text-gray-600 text-lg leading-relaxed font-medium pl-2 border-l-4 border-earth-100">
                    "{review.comment}"
                  </p>
                </div>
              ))}
              {reviews.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                  <p className="text-gray-400 font-bold text-lg">No reviews yet. Be the first to book!</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Booking Section directly integrated */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-100 sticky top-24 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-forest-400 via-earth-400 to-sky-400" />
            
            <h3 className="font-black text-gray-900 mb-6 text-xl tracking-tight">Reserve Your Session</h3>

            <div className="flex items-center gap-3 mb-8 px-5 py-4 rounded-2xl bg-gray-50 border border-gray-200 shadow-inner">
              <div className={`w-3 h-3 rounded-full animate-pulse ${guide.isAvailable ? 'bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.6)]' : 'bg-gray-400'}`} />
              <span className={`font-black text-sm uppercase tracking-widest ${guide.isAvailable ? 'text-green-700' : 'text-gray-500'}`}>
                {guide.isAvailable ? 'Available Now' : 'Currently Unavailable'}
              </span>
            </div>

            <div className="space-y-4 mb-8 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-bold uppercase tracking-wider">Session Rate</span>
                <span className="font-black text-gray-900">{formatCurrency(sessionPrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-bold uppercase tracking-wider">Service Fee</span>
                <span className="font-black text-gray-900">{formatCurrency(serviceFee)}</span>
              </div>
              <div className="border-t border-gray-200 pt-5 mt-2 flex justify-between items-center">
                <span className="font-black text-gray-900 text-lg">Total Amount</span>
                <div className="text-right">
                  <span className="text-3xl font-black text-forest-600 block leading-none">
                    {formatCurrency(total)}
                  </span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-1">Inclusive of all taxes</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleBooking} className="space-y-6">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">Session Notes</label>
                <textarea
                  rows={4}
                  value={notes}
                  disabled={hasPendingBooking}
                  onChange={(e) => setNotes(e.target.value)}
                  className="block w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-forest-500/10 focus:border-forest-600 focus:bg-white sm:text-sm transition-all outline-none resize-none disabled:opacity-50 font-medium"
                  placeholder="E.g. We want to see the hidden waterfalls and try local street food..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !guide.isAvailable || hasPendingBooking}
                className={`group relative w-full overflow-hidden py-5 px-6 rounded-2xl shadow-xl text-base font-black text-white transition-all transform hover:-translate-y-1 active:translate-y-0 ${
                  (guide.isAvailable && !hasPendingBooking)
                    ? 'bg-forest-600 hover:shadow-forest-600/30' 
                    : 'bg-gray-300 cursor-not-allowed grayscale'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-forest-500 to-forest-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex justify-center items-center gap-3">
                  <Zap size={20} className="group-hover:animate-bounce" />
                  {isSubmitting ? 'Securing Booking...' : hasPendingBooking ? 'Booking Pending' : guide.isAvailable ? 'Confirm & Book Now' : 'Guide Unavailable'}
                </div>
              </button>
            </form>

            <div className="mt-6 bg-sky-50/50 p-4 rounded-2xl flex gap-4 items-start border border-sky-100">
              <div className="p-2 bg-white rounded-xl shadow-sm text-sky-600">
                <Shield size={18} />
              </div>
              <p className="text-xs text-sky-800 font-medium leading-relaxed">
                {hasPendingBooking 
                  ? "You have a pending request. The guide will respond shortly." 
                  : "Your payment is secured with our 100% Satisfaction Guarantee. The guide is notified instantly."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Location Modal */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 relative border border-gray-100 shadow-xl">
            <div className="flex items-start gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-forest-50 flex items-center justify-center">
                <MapPin className="h-5 w-5 text-forest-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Share Your Location</h2>
                <p className="text-sm text-gray-500 mt-1">
                  We need your current location so the guide can see where to meet you.
                </p>
              </div>
            </div>

            <div className="space-y-3 mt-6">
              <button
                onClick={handleCaptureLocation}
                disabled={isLocating}
                className="w-full flex items-center justify-center gap-2 bg-forest-600 text-white py-3 px-4 rounded-xl font-bold hover:bg-forest-700 disabled:opacity-50 transition-colors"
              >
                {isLocating ? <Loader2 className="w-5 h-5 animate-spin" /> : <MapPin className="w-5 h-5" />}
                {isLocating ? 'Locating...' : 'Share Current Location'}
              </button>
              
              <button
                onClick={() => {
                  setIsLocationModalOpen(false);
                  setPendingBookingAction(false);
                }}
                disabled={isLocating}
                className="w-full py-3 px-4 rounded-xl font-medium text-gray-600 border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Cancel Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);
}
