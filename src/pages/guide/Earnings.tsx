import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { MOCK_BOOKINGS } from '../../data/mockData';
import { formatCurrency, formatDateTime } from '../../lib/utils';
import { DollarSign, TrendingUp, Calendar } from 'lucide-react';

export default function Earnings() {
  const guideId = 'g1';
  const myBookings = MOCK_BOOKINGS.filter(b => b.guideId === guideId && b.status === 'completed');

  // Calculate monthly earnings
  const monthlyData = myBookings.reduce((acc, booking) => {
    const month = new Date(booking.bookingDate).toLocaleString('default', { month: 'short' });
    const existing = acc.find(d => d.name === month);
    if (existing) {
      existing.amount += booking.totalPrice;
      existing.bookings += 1;
    } else {
      acc.push({ name: month, amount: booking.totalPrice, bookings: 1 });
    }
    return acc;
  }, [] as { name: string; amount: number; bookings: number }[]);

  // Sort by month (mock logic, assumes current year/sequence)
  const monthsOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  monthlyData.sort((a, b) => monthsOrder.indexOf(a.name) - monthsOrder.indexOf(b.name));

  const totalEarnings = myBookings.reduce((sum, b) => sum + b.totalPrice, 0);
  const currentMonthEarnings = monthlyData[monthlyData.length - 1]?.amount || 0;

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Earnings & Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg text-green-600">
              <DollarSign size={24} />
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">+12% vs last month</span>
          </div>
          <p className="text-sm text-gray-500">Total Earnings</p>
          <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(totalEarnings)}</h3>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
              <Calendar size={24} />
            </div>
          </div>
          <p className="text-sm text-gray-500">This Month</p>
          <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(currentMonthEarnings)}</h3>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg text-purple-600">
              <TrendingUp size={24} />
            </div>
          </div>
          <p className="text-sm text-gray-500">Completed Tours</p>
          <h3 className="text-2xl font-bold text-gray-900">{myBookings.length}</h3>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Monthly Earnings</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} />
              <Tooltip 
                formatter={(value: number) => [formatCurrency(value), 'Earnings']}
                cursor={{ fill: '#f3f4f6' }}
              />
              <Bar dataKey="amount" fill="#2D8F5E" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="font-bold text-lg text-gray-900">Transaction History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Booking ID</th>
                <th className="px-6 py-3 font-medium">Description</th>
                <th className="px-6 py-3 font-medium text-right">Amount</th>
                <th className="px-6 py-3 font-medium text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {myBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-900">{formatDateTime(booking.bookingDate)}</td>
                  <td className="px-6 py-4 text-gray-500">#{booking.id.toUpperCase()}</td>
                  <td className="px-6 py-4 text-gray-900">Tour Service Payment</td>
                  <td className="px-6 py-4 text-right font-medium text-gray-900">
                    {formatCurrency(booking.totalPrice)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Paid
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
