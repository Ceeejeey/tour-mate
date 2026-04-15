import React, { useState, useEffect } from "react";
import StarRating from "../../components/shared/StarRating";
import { formatDate } from "../../lib/utils";
import { MessageSquare, Loader2, AlertCircle, Search } from "lucide-react";
import toast from 'react-hot-toast';

interface Review {
  id: number;
  date: string;
  touristName: string;
  guideName: string;
  rating: number;
  comment: string;
}

export default function Feedback() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      setError('');
      const token = localStorage.getItem('tourmate_token');
      const response = await fetch('http://localhost:5066/api/reviews/all', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      } else {
        setError('Failed to fetch reviews');
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('Network error while loading reviews');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredReviews = reviews.filter(review =>
    review.touristName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.guideName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.comment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-forest-600 to-forest-700 rounded-2xl p-8 mb-8 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <div className="bg-forest-500 p-3 rounded-lg">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">User Feedback</h1>
            <p className="text-forest-100 text-sm mt-1">Monitor ratings and reviews across the platform</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-8 flex gap-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search reviews by name or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-all"
          />
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-8 rounded-xl flex flex-col items-center justify-center">
          <AlertCircle className="h-10 w-10 mb-4 text-red-400" />
          <p className="font-medium text-lg">{error}</p>
          <button 
            onClick={fetchReviews}
            className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      ) : isLoading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 flex flex-col items-center justify-center">
          <Loader2 className="h-10 w-10 text-forest-600 animate-spin mb-4" />
          <p className="text-gray-500 font-medium">Loading reviews...</p>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-1">No reviews found</h3>
          <p className="text-gray-500">{searchTerm ? `No reviews matching "${searchTerm}"` : "No reviews submitted yet."}</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Tourist</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Guide</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Comment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredReviews.map((review) => (
                  <tr key={review.id} className="hover:bg-forest-50/30 transition-colors">
                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap text-sm">
                      {formatDate(review.date)}
                    </td>
                    <td className="px-6 py-4 text-gray-900 font-semibold whitespace-nowrap">
                      {review.touristName}
                    </td>
                    <td className="px-6 py-4 text-gray-700 whitespace-nowrap">
                      {review.guideName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StarRating
                        rating={review.rating}
                        showCount={false}
                        size={14}
                      />
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <p className="truncate max-w-md text-sm" title={review.comment}>
                        {review.comment}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
