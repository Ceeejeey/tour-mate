import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MOCK_BOOKINGS, MOCK_GUIDES } from '../../data/mockData';
import { formatCurrency } from '../../lib/utils';
import { CreditCard, Lock, CheckCircle, Loader2 } from 'lucide-react';

export default function Payment() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bookingId = searchParams.get('bookingId');
  const booking = MOCK_BOOKINGS.find(b => b.id === bookingId);
  const guide = booking ? MOCK_GUIDES.find(g => g.id === booking.guideId) : null;

  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!booking || !guide) return <div className="p-8 text-center">Invalid booking details.</div>;

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(true);
    }, 2000);
  };

  if (showSuccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center border border-gray-100">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-500 mb-8">
            Your booking with {guide.name} has been confirmed. A receipt has been sent to your email.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/tourist/bookings')}
              className="w-full py-3 px-4 bg-[#1E6B4A] text-white rounded-lg font-medium hover:bg-[#165a3d] transition-colors"
            >
              View My Bookings
            </button>
            <button
              onClick={() => navigate('/tourist/home')}
              className="w-full py-3 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Secure Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {/* Payment Form */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-lg">Payment Details</h2>
              <div className="flex gap-2">
                <div className="h-6 w-10 bg-gray-100 rounded"></div>
                <div className="h-6 w-10 bg-gray-100 rounded"></div>
                <div className="h-6 w-10 bg-gray-100 rounded"></div>
              </div>
            </div>

            <form onSubmit={handlePayment} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                <div className="relative">
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-[#1E6B4A] focus:border-[#1E6B4A]"
                    placeholder="0000 0000 0000 0000"
                    required
                  />
                  <CreditCard className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiration Date</label>
                  <input
                    type="text"
                    className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-[#1E6B4A] focus:border-[#1E6B4A]"
                    placeholder="MM / YY"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                  <input
                    type="text"
                    className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-[#1E6B4A] focus:border-[#1E6B4A]"
                    placeholder="123"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                <input
                  type="text"
                  className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-[#1E6B4A] focus:border-[#1E6B4A]"
                  placeholder="John Doe"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#1E6B4A] hover:bg-[#165a3d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1E6B4A] disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin h-5 w-5" />
                    Processing...
                  </div>
                ) : (
                  `Pay ${formatCurrency(booking.totalPrice)}`
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                <Lock className="h-3 w-3" />
                Payments are secure and encrypted
              </div>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="md:col-span-1">
          <div className="bg-gray-50 p-6 rounded-2xl sticky top-24">
            <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
              <img
                src={guide.avatar}
                alt={guide.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <div className="font-medium text-sm">{guide.name}</div>
                <div className="text-xs text-gray-500">{guide.serviceArea}</div>
              </div>
            </div>
            
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatCurrency(booking.totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Service Fee</span>
                <span className="font-medium">{formatCurrency(0)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <span className="font-bold text-gray-900">Total</span>
              <span className="text-xl font-bold text-[#1E6B4A]">{formatCurrency(booking.totalPrice)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
