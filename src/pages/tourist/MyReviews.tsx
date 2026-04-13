import React, { useEffect, useState } from 'react';
import { Star, Calendar, User, MessageSquare, Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface Review {
  id: number;
  guideId: number;
  guideName: string;
  rating: number;
  comment: string;
  createdAt: string;
  bookingId: number;
}

export default function MyReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch('http://localhost:5066/api/reviews/tourist', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('tourmate_token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch reviews');
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error(error);
      toast.error('Could not load your reviews');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-forest-600" />
          <span className="text-forest-600 text-sm font-medium">Loading your reviews...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-forest-600 to-forest-700 rounded-2xl p-8 mb-8 text-white shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-forest-500 p-3 rounded-lg">
            <Star className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold">My Posted Feedbacks</h1>
        </div>
        <p className="text-forest-100 text-sm">Share your experiences and help other travelers discover amazing guides</p>
      </div>

      {/* Stats Section */}
      {reviews.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Total Reviews</p>
                <p className="text-3xl font-bold text-gray-900">{reviews.length}</p>
              </div>
              <div className="bg-earth-50 p-4 rounded-lg">
                <MessageSquare className="w-6 h-6 text-earth-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Average Rating</p>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-bold text-gray-900">
                    {(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)}
                  </p>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.round(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reviews Grid */}
      {reviews.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-gray-100 p-4 rounded-lg">
              <AlertCircle className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          <p className="text-gray-600 text-lg font-medium mb-2">No reviews yet</p>
          <p className="text-gray-500 text-sm">Once you complete a tour and make a payment, you'll be able to leave feedback for your guide</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <div key={review.id} className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-forest-200 transition-all duration-300">
              {/* Card Header */}
              <div className="bg-gradient-to-r from-forest-50 to-earth-50 p-6 border-b border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="bg-forest-100 p-2 rounded-lg shrink-0">
                      <User className="w-5 h-5 text-forest-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{review.guideName}</p>
                      <p className="text-xs text-gray-500 mt-0.5">Tour Guide</p>
                    </div>
                  </div>
                </div>

                {/* Rating Stars */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 transition-all ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
                    />
                  ))}
                  <span className="ml-2 text-sm font-bold text-gray-900">{review.rating}/5</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6">
                {review.comment && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 leading-relaxed italic">"{review.comment}"</p>
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center space-x-2 text-xs text-gray-400 border-t border-gray-100 pt-4 mt-4">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
