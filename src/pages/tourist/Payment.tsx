import React, { useEffect, useState } from 'react';
import { formatDateTime, formatCurrency } from '../../lib/utils';
import { CreditCard, Download, Loader2, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';

export default function TouristPayments() {
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem('tourmate_token');
      const res = await fetch('http://localhost:5066/api/payments/history', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        setPayments(data);
      } else {
        toast.error("Failed to load personal payments.");
      }
    } catch (e) {
      toast.error("Error loading payments.");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadReceipt = (payment: any) => {
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
    doc.text(`Receipt ID: ${payment.id}`, 20, 50);
    doc.text(`Booking ID: ${payment.bookingId}`, 20, 60);
    doc.text(`Guide: ${payment.booking?.guide?.name || "Your Guide"}`, 20, 70);
    doc.text(`Payment Date: ${new Date(payment.date).toLocaleString()}`, 20, 80);
    doc.text(`Amount Paid: ${formatCurrency(payment.amount)}`, 20, 90);
    doc.text(`Transaction: ${payment.method.toUpperCase()}`, 20, 100);
    
    // Status Badge
    doc.text(`Status: ${payment.status.toUpperCase()}`, 20, 110);
    
    // Footer
    doc.text('---------------------------------------------------------', 105, 120, { align: 'center' });
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text('Thank you for booking with TourMate!', 105, 130, { align: 'center' });

    doc.save(`Receipt_Booking_${payment.bookingId}.pdf`);
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-forest-600" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <CreditCard className="text-forest-600" />
          My Payments
        </h1>
        <p className="text-gray-500 mt-1">View your payment history and download receipts.</p>
      </div>

      <div className="space-y-4">
        {payments.length > 0 ? (
          payments.map((payment) => (
            <div key={payment.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                  <CreditCard size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Payment for Booking #{payment.bookingId}</h3>
                  <div className="flex items-center text-sm text-gray-500 mt-1 gap-2">
                    <Calendar size={14} />
                    {formatDateTime(payment.date)}
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium ml-2">
                      {payment.status}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-xl font-bold text-gray-900">{formatCurrency(payment.amount)}</div>
                  <div className="text-xs text-gray-500">{payment.method}</div>
                </div>
                <button
                  onClick={() => downloadReceipt(payment)}
                  className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 bg-white text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Download size={16} />
                  Receipt
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100/50">
            <p className="text-gray-500">You haven't made any payments yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
