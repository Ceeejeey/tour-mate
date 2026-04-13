import React, { useState } from 'react';
import { Star, Loader2, X, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface FeedbackModalProps {
  booking: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function FeedbackModal({ booking, isOpen, onClose, onSuccess }: FeedbackModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setRating(0);
      setHoveredRating(0);
      setComment('');
      setShowSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen || !booking) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Please select a star rating.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('tourmate_token');
      const response = await fetch('http://localhost:5066/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          bookingId: booking.id,
          rating,
          comment
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit feedback');
      }

      setShowSuccess(true);
      toast.success('Feedback submitted successfully!');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center relative border border-gray-100">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
          <p className="text-gray-500 mb-8">
            Your feedback helps us improve the TourMate experience.
          </p>
          <button
            onClick={onSuccess}
            className="w-full py-3 px-4 bg-forest-600 text-white rounded-lg font-medium hover:bg-forest-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>

        <div className="p-6">
          <div className="text-center mb-6">
            <h2 className="font-bold text-xl text-gray-900 mb-2">Rate your Guide</h2>
            <p className="text-sm text-gray-500">How was your trip with {booking.guide?.name || "your guide"}?</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex justify-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    size={32}
                    fill={(hoveredRating || rating) >= star ? "#F59E0B" : "none"}
                    color={(hoveredRating || rating) >= star ? "#F59E0B" : "#D1D5DB"}
                    className="transition-colors"
                  />
                </button>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Share your experience (Optional)</label>
              <textarea
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="block w-full p-3 border border-gray-300 rounded-lg focus:ring-forest-500 focus:border-forest-600 resize-none"
                placeholder="What did you like? How can they improve?"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || rating === 0}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-forest-600 hover:bg-forest-700 disabled:opacity-70 transition-colors"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Submitting Feedback...
                </>
              ) : (
                'Submit Feedback'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
