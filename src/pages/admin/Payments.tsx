import React, { useState, useEffect } from 'react';
import { formatCurrency, formatDateTime } from '../../lib/utils';
import { Download, Loader2, AlertCircle, CreditCard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Payment {
  id: number;
  bookingId: number;
  amount: number;
  date: string;
  status: string;
  method: string;
  booking?: {
    id: number;
    guideId: number;
    touristId: number;
    guide?: { name: string };
    tourist?: { name: string };
  };
}

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('tourmate_token');
      const response = await fetch('http://localhost:5066/api/payments/history', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch payments');
      }
      
      const data = await response.json();
      setPayments(data);
    } catch (err: any) {
      console.error('Error fetching payments:', err);
      setError(err.message || 'Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-forest-600 to-forest-700 rounded-2xl p-8 mb-8 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <div className="bg-forest-500 p-3 rounded-lg">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Transactions</h1>
            <p className="text-forest-100 text-sm mt-1">Track all payment transactions and platform revenue</p>
          </div>
        </div>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-8 rounded-xl flex flex-col items-center justify-center">
          <AlertCircle className="h-10 w-10 mb-4 text-red-400" />
          <p className="font-medium text-lg">{error}</p>
          <button 
            onClick={fetchPayments}
            className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      ) : loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 flex flex-col items-center justify-center">
          <Loader2 className="h-10 w-10 text-forest-600 animate-spin mb-4" />
          <p className="text-gray-500 font-medium">Loading payments...</p>
        </div>
      ) : payments.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center text-gray-500">
           No payments found.
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Transaction ID</th>
                <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Booking ID</th>
                <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Tourist</th>
                <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Guide</th>
                <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Method</th>
                <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-right">Amount</th>
                <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-forest-50/30 transition-colors">
                    <td className="px-6 py-4 font-semibold text-gray-900">#{payment.id.toString()}</td>
                    <td className="px-6 py-4 text-gray-600 text-sm">{formatDateTime(payment.date)}</td>
                    <td className="px-6 py-4 text-gray-600">#{payment.bookingId.toString()}</td>
                    <td className="px-6 py-4 text-gray-700 font-medium">{payment.booking?.tourist?.name || 'N/A'}</td>
                    <td className="px-6 py-4 text-gray-700 font-medium">{payment.booking?.guide?.name || 'N/A'}</td>
                    <td className="px-6 py-4 text-gray-600 capitalize text-sm">{payment.method.replace('_', ' ')}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900 text-right">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        payment.status === 'completed' ? 'bg-green-100 text-green-800' : 
                        payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {payment.status}
                      </span>
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
