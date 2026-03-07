import React from 'react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { MOCK_BOOKINGS, MOCK_GUIDES, MOCK_TOURISTS, MOCK_PAYMENTS } from '../../data/mockData';
import { formatCurrency } from '../../lib/utils';
import { Users, Map, Calendar, DollarSign } from 'lucide-react';

export default function Dashboard() {
  // KPI Data
  const totalUsers = MOCK_TOURISTS.length;
  const totalGuides = MOCK_GUIDES.length;
  const totalBookings = MOCK_BOOKINGS.length;
  const totalRevenue = MOCK_PAYMENTS.reduce((sum, p) => sum + p.amount, 0);

  // Chart Data: Monthly Bookings
  const monthlyBookings = MOCK_BOOKINGS.reduce((acc, booking) => {
    const month = new Date(booking.startDate).toLocaleString('default', { month: 'short' });
    const existing = acc.find(d => d.name === month);
    if (existing) {
      existing.bookings += 1;
    } else {
      acc.push({ name: month, bookings: 1 });
    }
    return acc;
  }, [] as { name: string; bookings: number }[]);

  // Sort months
  const monthsOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  monthlyBookings.sort((a, b) => monthsOrder.indexOf(a.name) - monthsOrder.indexOf(b.name));

  // Chart Data: Booking Status
  const statusData = MOCK_BOOKINGS.reduce((acc, booking) => {
    const existing = acc.find(d => d.name === booking.status);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: booking.status, value: 1 });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const stats = [
    { label: 'Total Tourists', value: totalUsers, icon: Users, color: 'bg-blue-500' },
    { label: 'Total Guides', value: totalGuides, icon: Map, color: 'bg-purple-500' },
    { label: 'Total Bookings', value: totalBookings, icon: Calendar, color: 'bg-orange-500' },
    { label: 'Total Revenue', value: formatCurrency(totalRevenue), icon: DollarSign, color: 'bg-green-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
            <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10 mr-4`}>
              <stat.icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Bookings Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Monthly Bookings</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyBookings}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="bookings" stroke="#1E6B4A" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Booking Status Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Booking Status Distribution</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
