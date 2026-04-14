import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line, Area, AreaChart } from 'recharts';
import { formatCurrency, formatDateTime } from '../../lib/utils';
import { DollarSign, TrendingUp, Calendar, PieChart, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import toast from 'react-hot-toast';

interface Booking {
  id: number;
  bookingDate: string;
  totalPrice: number;
  status: string;
  paymentStatus: string;
}

export default function Earnings() {
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('tourmate_token');
      const response = await fetch('http://localhost:5066/api/bookings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setAllBookings(data);
      } else {
        toast.error('Failed to load bookings');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error fetching bookings');
    } finally {
      setIsLoading(false);
    }
  };

  // Only consider paid bookings as earnings
  const myBookings = allBookings.filter(b => b.paymentStatus === 'paid');

  // Get last 6 months to ensure a continuous trend including months with 0 earnings
  const monthlyData = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const monthName = d.toLocaleString('default', { month: 'short' });
    monthlyData.push({ name: monthName, amount: 0, bookings: 0 });
  }

  myBookings.forEach(booking => {
    const monthName = new Date(booking.bookingDate).toLocaleString('default', { month: 'short' });
    const existingMonth = monthlyData.find(m => m.name === monthName);
    if (existingMonth) {
      existingMonth.amount += booking.totalPrice;
      existingMonth.bookings += 1;
    }
  });

  const totalEarnings = myBookings.reduce((sum, b) => sum + b.totalPrice, 0);
  const currentMonthEarnings = monthlyData[monthlyData.length - 1]?.amount || 0;
  const previousMonthEarnings = monthlyData[monthlyData.length - 2]?.amount || 0;
  const monthlyGrowth = previousMonthEarnings > 0 ? ((currentMonthEarnings - previousMonthEarnings) / previousMonthEarnings * 100) : 0;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-earth-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-earth-600 to-earth-700 rounded-2xl p-8 mb-8 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <div className="bg-earth-500 p-3 rounded-lg">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Earnings & Analytics</h1>
            <p className="text-earth-100 text-sm mt-1">Track your income and tour performance</p>
          </div>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Earnings */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="bg-green-500 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 ${monthlyGrowth >= 0 ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
              {monthlyGrowth >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownLeft size={12} />}
              {Math.abs(monthlyGrowth).toFixed(0)}%
            </span>
          </div>
          <p className="text-green-700 text-sm font-medium mb-1">Total Earnings</p>
          <h3 className="text-3xl font-bold text-gray-900">{formatCurrency(totalEarnings)}</h3>
          <p className="text-xs text-green-700 mt-2">All time earnings</p>
        </div>

        {/* This Month */}
        <div className="bg-gradient-to-br from-earth-50 to-earth-100 rounded-xl border-2 border-earth-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="bg-earth-600 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-earth-700 text-sm font-medium mb-1">This Month</p>
          <h3 className="text-3xl font-bold text-gray-900">{formatCurrency(currentMonthEarnings)}</h3>
          <p className="text-xs text-earth-700 mt-2">Current month earnings</p>
        </div>

        {/* Paid Tours */}
        <div className="bg-gradient-to-br from-sky-50 to-sky-100 rounded-xl border-2 border-sky-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="bg-sky-600 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-sky-700 text-sm font-medium mb-1">Paid Tours</p>
          <h3 className="text-3xl font-bold text-gray-900">{myBookings.length}</h3>
          <p className="text-xs text-sky-700 mt-2">Successful payments</p>
        </div>

        {/* Average Per Tour */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border-2 border-purple-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="bg-purple-600 p-3 rounded-lg">
              <PieChart className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-purple-700 text-sm font-medium mb-1">Average Per Tour</p>
          <h3 className="text-3xl font-bold text-gray-900">{myBookings.length > 0 ? formatCurrency(totalEarnings / myBookings.length) : '$0'}</h3>
          <p className="text-xs text-purple-700 mt-2">Average earnings</p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">Monthly Earnings Trend</h2>
            <p className="text-sm text-gray-500 mt-1">Your earnings over the past months</p>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4922A" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#D4922A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="#6b7280" />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => value >= 1000 ? `$${(value / 1000).toFixed(1)}k` : `$${value}`} stroke="#6b7280" />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), 'Earnings']}
                  cursor={{ fill: '#f3f4f6' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
                />
                <Area type="monotone" dataKey="amount" stroke="#D4922A" strokeWidth={2} fillOpacity={1} fill="url(#colorAmount)" />
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
                <p className="text-sm text-gray-500 mb-1">Best Month</p>
                <p className="text-lg font-bold text-gray-900">
                  {formatCurrency(Math.max(...monthlyData.map(d => d.amount), 0))}
                </p>
              </div>
              <div className="bg-green-50 p-2 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
            </div>

            <div className="flex items-center justify-between pb-6 border-b border-gray-100">
              <div>
                <p className="text-sm text-gray-500 mb-1">Avg Per Month</p>
                <p className="text-lg font-bold text-gray-900">
                  {formatCurrency(monthlyData.length > 0 ? totalEarnings / monthlyData.length : 0)}
                </p>
              </div>
              <div className="bg-earth-50 p-2 rounded-lg">
                <DollarSign className="w-5 h-5 text-earth-600" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Success Rate</p>
                <p className="text-lg font-bold text-gray-900">100%</p>
              </div>
              <div className="bg-sky-50 p-2 rounded-lg">
                <Calendar className="w-5 h-5 text-sky-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Transaction History</h2>
          <p className="text-sm text-gray-500 mt-1">All your completed tour payments</p>
        </div>
        
        {myBookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 font-semibold text-gray-700">Date</th>
                  <th className="px-6 py-4 font-semibold text-gray-700">Booking ID</th>
                  <th className="px-6 py-4 font-semibold text-gray-700">Description</th>
                  <th className="px-6 py-4 font-semibold text-gray-700 text-right">Amount</th>
                  <th className="px-6 py-4 font-semibold text-gray-700 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {myBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gradient-to-r hover:from-forest-50 hover:to-transparent transition-colors">
                    <td className="px-6 py-4 text-gray-900 font-medium">{formatDateTime(booking.bookingDate)}</td>
                    <td className="px-6 py-4 text-gray-600">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-100 text-gray-700">
                        #{booking.id}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-900">
                      <span className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-earth-600 rounded-full"></div>
                        Tour Service Payment
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-bold text-gray-900 text-base">{formatCurrency(booking.totalPrice)}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
                        <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                        Paid
                      </span>
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
                <DollarSign className="w-8 h-8 text-gray-400" />
              </div>
            </div>
            <p className="text-gray-600 font-medium mb-2">No transactions yet</p>
            <p className="text-gray-500 text-sm">Once you complete tours, earnings will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}
