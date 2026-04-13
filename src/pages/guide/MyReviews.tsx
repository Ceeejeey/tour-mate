import React, { useEffect, useState } from 'react';
import { Star, Calendar, User, MessageSquare, Loader2, AlertCircle, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

interface Review {
  id: number;
  touristId: number;
  touristName: string;
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
      const response = await fetch('http://localhost:5066/api/reviews/guide', {
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
          <span className="text-forest-600 text-sm font-medium">Loading your feedback...</span>
        </div>
      </div>
    );
  }

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length)
    : 0;

  const ratingDistribution = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length,
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-earth-600 to-earth-700 rounded-2xl p-8 mb-8 text-white shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-earth-500 p-3 rounded-lg">
            <Star className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold">My Feedback & Ratings</h1>
        </div>
        <p className="text-earth-100 text-sm">See what tourists are saying about your tour experiences</p>
      </div>

      {reviews.length > 0 && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Average Rating Card */}
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 shadow-sm border border-yellow-200">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-yellow-700 text-sm font-medium mb-1">Average Rating</p>
                  <div className="text-4xl font-bold text-gray-900">{averageRating.toFixed(1)}</div>
                </div>
                <div className="bg-yellow-500 p-3 rounded-lg">
                  <Star className="w-6 h-6 text-white fill-white" />
                </div>
              </div>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.round(averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
            </div>

            {/* Total Reviews Card */}
            <div className="bg-gradient-to-br from-forest-50 to-forest-100 rounded-xl p-6 shadow-sm border border-forest-200">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-forest-700 text-sm font-medium mb-1">Total Reviews</p>
                  <div className="text-4xl font-bold text-gray-900">{reviews.length}</div>
                </div>
                <div className="bg-forest-600 p-3 rounded-lg">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-xs text-forest-600">From satisfied tourists</p>
            </div>

            {/* 5-Star Reviews Card */}
            <div className="bg-gradient-to-br from-earth-50 to-earth-100 rounded-xl p-6 shadow-sm border border-earth-200">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-earth-700 text-sm font-medium mb-1">5-Star Reviews</p>
                  <div className="text-4xl font-bold text-gray-900">{ratingDistribution[5]}</div>
                </div>
                <div className="bg-earth-600 p-3 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-xs text-earth-600">{reviews.length > 0 ? ((ratingDistribution[5] / reviews.length) * 100).toFixed(0) : 0}% of all reviews</p>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Rating Distribution</h3>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-4">
                  <div className="flex items-center gap-1 w-12">
                    {Array.from({ length: rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-earth-400 to-earth-600 h-full transition-all"
                        style={{ width: `${reviews.length > 0 ? (ratingDistribution[rating as keyof typeof ratingDistribution] / reviews.length) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-600 w-8 text-right">
                    {ratingDistribution[rating as keyof typeof ratingDistribution]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
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
          <p className="text-gray-500 text-sm">When tourists complete their tours and make payments, they'll be able to leave feedback about your services</p>
        </div>
      ) : (
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Feedback</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
              <div key={review.id} className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-earth-200 transition-all duration-300">
                {/* Card Header */}
                <div className="bg-gradient-to-r from-earth-50 to-yellow-50 p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="bg-earth-100 p-2 rounded-lg shrink-0">
                        <User className="w-5 h-5 text-earth-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{review.touristName}</p>
                        <p className="text-xs text-gray-500 mt-0.5">Tourist</p>
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
        </div>
      )}
    </div>
  );
}
