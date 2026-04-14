import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { formatDateTime, formatCurrency } from '../../lib/utils';
import { CreditCard, Download, Calendar, TrendingUp, DollarSign, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';

interface Payment {
  id: number;
  amount: number;
  date: string;
  status: string;
  method: string;
  bookingId: number;
  booking?: {
    guide?: {
      name: string;
    };
  };
}

export default function TouristPayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('tourmate_token');
      const res = await fetch('http://localhost:5066/api/payments/history', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        setPayments(data);
      } else {
        toast.error("Failed to load payments");
      }
    } catch (e) {
      console.error(e);
      toast.error("Error loading payments");
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate monthly spending
  const monthlyData = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const monthName = d.toLocaleString('default', { month: 'short' });
    monthlyData.push({ name: monthName, amount: 0, transactions: 0 });
  }

  payments.forEach(payment => {
    const monthName = new Date(payment.date).toLocaleString('default', { month: 'short' });
    const existingMonth = monthlyData.find(m => m.name === monthName);
    if (existingMonth) {
      existingMonth.amount += payment.amount;
      existingMonth.transactions += 1;
    }
  });

  const totalSpent = payments.reduce((sum, p) => sum + p.amount, 0);
  const currentMonthSpent = monthlyData[monthlyData.length - 1]?.amount || 0;
  const previousMonthSpent = monthlyData[monthlyData.length - 2]?.amount || 0;
  const spendingGrowth = previousMonthSpent > 0 ? ((currentMonthSpent - previousMonthSpent) / previousMonthSpent * 100) : 0;

  const downloadReceipt = (payment: Payment) => {
    const doc = new jsPDF();
    
    doc.setFontSize(22);
    doc.setTextColor(45, 143, 94);
    doc.text('TourMate', 105, 20, { align: 'center' });
    
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Payment Receipt', 105, 30, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text('---------------------------------------------------------', 105, 40, { align: 'center' });
    
    doc.text(`Receipt ID: ${payment.id}`, 20, 50);
    doc.text(`Booking ID: ${payment.bookingId}`, 20, 60);
    doc.text(`Guide: ${payment.booking?.guide?.name || "Your Guide"}`, 20, 70);
    doc.text(`Payment Date: ${new Date(payment.date).toLocaleString()}`, 20, 80);
    doc.text(`Amount Paid: ${formatCurrency(payment.amount)}`, 20, 90);
    doc.text(`Transaction: ${payment.method.toUpperCase()}`, 20, 100);
    doc.text(`Status: ${payment.status.toUpperCase()}`, 20, 110);
    
    doc.text('---------------------------------------------------------', 105, 120, { align: 'center' });
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text('Thank you for booking with TourMate!', 105, 130, { align: 'center' });

    doc.save(`Receipt_Booking_${payment.bookingId}.pdf`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-sky-600 to-sky-700 rounded-2xl p-8 mb-8 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <div className="bg-sky-500 p-3 rounded-lg">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Payment History</h1>
            <p className="text-sky-100 text-sm mt-1">Track your tour bookings and expenses</p>
          </div>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Spent */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="bg-blue-500 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 ${spendingGrowth >= 0 ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
              {spendingGrowth >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownLeft size={12} />}
              {Math.abs(spendingGrowth).toFixed(0)}%
            </span>
          </div>
          <p className="text-blue-700 text-sm font-medium mb-1">Total Spent</p>
          <h3 className="text-3xl font-bold text-gray-900">{formatCurrency(totalSpent)}</h3>
          <p className="text-xs text-blue-700 mt-2">All-time expenses</p>
        </div>

        {/* This Month */}
        <div className="bg-gradient-to-br from-sky-50 to-sky-100 rounded-xl border-2 border-sky-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="bg-sky-600 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-sky-700 text-sm font-medium mb-1">This Month</p>
          <h3 className="text-3xl font-bold text-gray-900">{formatCurrency(currentMonthSpent)}</h3>
          <p className="text-xs text-sky-700 mt-2">Current month spending</p>
        </div>

        {/* Total Bookings */}
        <div className="bg-gradient-to-br from-earth-50 to-earth-100 rounded-xl border-2 border-earth-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="bg-earth-600 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-earth-700 text-sm font-medium mb-1">Total Bookings</p>
          <h3 className="text-3xl font-bold text-gray-900">{payments.length}</h3>
          <p className="text-xs text-earth-700 mt-2">Tours booked</p>
        </div>

        {/* Average Per Booking */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="bg-green-500 p-3 rounded-lg">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-green-700 text-sm font-medium mb-1">Average Per Booking</p>
          <h3 className="text-3xl font-bold text-gray-900">{payments.length > 0 ? formatCurrency(totalSpent / payments.length) : '$0'}</h3>
          <p className="text-xs text-green-700 mt-2">Average spending</p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">Monthly Spending Trend</h2>
            <p className="text-sm text-gray-500 mt-1">Your spending pattern over the past months</p>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0369A1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0369A1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="#6b7280" />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => value >= 1000 ? `$${(value / 1000).toFixed(1)}k` : `$${value}`} stroke="#6b7280" />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), 'Spending']}
                  cursor={{ fill: '#f3f4f6' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
                />
                <Area type="monotone" dataKey="amount" stroke="#0369A1" strokeWidth={2} fillOpacity={1} fill="url(#colorAmount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Quick Stats</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-6 border-b border-gray-100">
              <div>
                <p className="text-sm text-gray-500 mb-1">Highest Month</p>
                <p className="text-lg font-bold text-gray-900">
                  {formatCurrency(Math.max(...monthlyData.map(d => d.amount), 0))}
                </p>
              </div>
              <div className="bg-red-50 p-2 rounded-lg">
                <ArrowUpRight className="w-5 h-5 text-red-600" />
              </div>
            </div>

            <div className="flex items-center justify-between pb-6 border-b border-gray-100">
              <div>
                <p className="text-sm text-gray-500 mb-1">Avg Per Month</p>
                <p className="text-lg font-bold text-gray-900">
                  {formatCurrency(monthlyData.length > 0 ? totalSpent / monthlyData.length : 0)}
                </p>
              </div>
              <div className="bg-sky-50 p-2 rounded-lg">
                <DollarSign className="w-5 h-5 text-sky-600" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Payment Status</p>
                <p className="text-lg font-bold text-gray-900">Completed</p>
              </div>
              <div className="bg-green-50 p-2 rounded-lg">
                <CreditCard className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment History Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Payment Transactions</h2>
          <p className="text-sm text-gray-500 mt-1">All your booking payments</p>
        </div>
        
        {payments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 font-semibold text-gray-700">Date</th>
                  <th className="px-6 py-4 font-semibold text-gray-700">Booking ID</th>
                  <th className="px-6 py-4 font-semibold text-gray-700">Guide</th>
                  <th className="px-6 py-4 font-semibold text-gray-700">Method</th>
                  <th className="px-6 py-4 font-semibold text-gray-700 text-right">Amount</th>
                  <th className="px-6 py-4 font-semibold text-gray-700 text-center">Status</th>
                  <th className="px-6 py-4 font-semibold text-gray-700 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gradient-to-r hover:from-sky-50 hover:to-transparent transition-colors">
                    <td className="px-6 py-4 text-gray-900 font-medium">{formatDateTime(payment.date)}</td>
                    <td className="px-6 py-4 text-gray-600">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-100 text-gray-700">
                        #{payment.bookingId}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-900">
                      {payment.booking?.guide?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-gray-900">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 capitalize">
                        {payment.method}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-bold text-gray-900 text-base">{formatCurrency(payment.amount)}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
                        <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => downloadReceipt(payment)}
                        className="flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-semibold text-sky-700 hover:text-sky-900 hover:bg-sky-50 rounded-lg transition-colors"
                        title="Download receipt"
                      >
                        <Download size={14} />
                        Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-gray-100 p-4 rounded-lg">
                <CreditCard className="w-8 h-8 text-gray-400" />
              </div>
            </div>
            <p className="text-gray-600 font-medium mb-2">No payments yet</p>
            <p className="text-gray-500 text-sm">Book a tour to see your payment history</p>
          </div>
        )}
      </div>
    </div>
  );
}
