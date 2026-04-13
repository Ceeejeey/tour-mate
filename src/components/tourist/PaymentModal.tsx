import React, { useState } from 'react';
import { formatCurrency } from '../../lib/utils';
import { CreditCard, Lock, CheckCircle, Loader2, X, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';

interface PaymentModalProps {
  booking: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PaymentModal({ booking, isOpen, onClose, onSuccess }: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Form State
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardName, setCardName] = useState('');

  React.useEffect(() => {
    if (isOpen) {
      setShowSuccess(false);
      setCardNumber('');
      setExpiry('');
      setCvc('');
      setCardName('');
    }
  }, [isOpen]);

  if (!isOpen || !booking) return null;

  const downloadReceipt = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(34, 139, 34); // Forest Green
    doc.text('TourMate', 105, 20, { align: 'center' });
    
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Payment Receipt', 105, 30, { align: 'center' });
    
    // Divider
    doc.setFontSize(12);
    doc.text('---------------------------------------------------------', 105, 40, { align: 'center' });
    
    // Details
    doc.text(`Booking ID: ${booking.id}`, 20, 50);
    doc.text(`Guide: ${booking.guide?.name || "Your Guide"}`, 20, 60);
    doc.text(`Payment Date: ${new Date().toLocaleString()}`, 20, 70);
    doc.text(`Amount Paid: ${formatCurrency(booking.totalPrice)}`, 20, 80);
    doc.text(`Cardholder Name: ${cardName}`, 20, 90);
    
    // Status Badge
    doc.text(`Status: SUCCESS`, 20, 100);
    
    // Footer
    doc.text('---------------------------------------------------------', 105, 110, { align: 'center' });
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text('Thank you for booking with TourMate!', 105, 120, { align: 'center' });

    doc.save(`Receipt_Booking_${booking.id}.pdf`);
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      const token = localStorage.getItem('tourmate_token');
      const response = await fetch('http://localhost:5066/api/payments/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          bookingId: booking.id,
          amount: booking.totalPrice,
          cardNumber,
          expiryDate: expiry,
          cvv: cvc,
          cardholderName: cardName
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Payment failed');
      }

      setShowSuccess(true);
      toast.success("Payment successful!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to process payment.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center relative border border-gray-100">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-500 mb-8">
            Your payment for booking with {booking.guide?.name || "your guide"} has been processed successfully.
          </p>
          <div className="space-y-3">
            <button
              onClick={downloadReceipt}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-forest-600 text-white rounded-lg font-medium hover:bg-forest-700 transition-colors"
            >
              <Download size={18} />
              Download Receipt
            </button>
            <button
              onClick={onSuccess}
              className="w-full py-3 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
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
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-xl">Payment Details</h2>
            <div className="flex gap-2">
              <div className="h-6 w-10 bg-gray-200 rounded flex justify-center items-center text-[10px] text-gray-500">VISA</div>
              <div className="h-6 w-10 bg-gray-200 rounded flex justify-center items-center text-[10px] text-gray-500">MC</div>
            </div>
          </div>

          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100 flex justify-between items-center">
            <span className="text-gray-600 font-medium">Amount to Pay</span>
            <span className="text-xl font-bold text-forest-600">{formatCurrency(booking.totalPrice)}</span>
          </div>

          <form onSubmit={handlePayment} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Card Number (Sandbox)</label>
              <div className="relative">
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-forest-500 focus:border-forest-600"
                  placeholder="0000 0000 0000 0000"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  required
                />
                <CreditCard className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              </div>
              <p className="text-xs text-gray-400 mt-1">This is a testing environment, any valid combo accepted.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry</label>
                <input
                  type="text"
                  className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-forest-500 focus:border-forest-600"
                  placeholder="MM / YY"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                <input
                  type="text"
                  className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-forest-500 focus:border-forest-600"
                  placeholder="123"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
              <input
                type="text"
                className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-forest-500 focus:border-forest-600"
                placeholder="John Doe"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-forest-600 hover:bg-forest-700 disabled:opacity-70 transition-colors"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Processing...
                </>
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
    </div>
  );
}
