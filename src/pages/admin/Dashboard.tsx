import React from 'react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { MOCK_BOOKINGS, MOCK_GUIDES, MOCK_TOURISTS, MOCK_PAYMENTS } from '../../data/mockData';
import { formatCurrency } from '../../lib/utils';
import { Users, Map, Calendar, DollarSign, Shield } from 'lucide-react';

export default function Dashboard() {
  const totalUsers = MOCK_TOURISTS.length;
  const totalGuides = MOCK_GUIDES.length;
  const totalBookings = MOCK_BOOKINGS.length;
  const totalRevenue = MOCK_PAYMENTS.reduce((sum, p) => sum + p.amount, 0);

  const monthlyBookings = MOCK_BOOKINGS.reduce((acc, booking) => {
    const month = new Date(booking.bookingDate).toLocaleString('default', { month: 'short' });
    const existing = acc.find(d => d.name === month);
    if (existing) {
      existing.bookings += 1;
    } else {
      acc.push({ name: month, bookings: 1 });
    }
    return acc;
  }, [] as { name: string; bookings: number }[]);

  const monthsOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  monthlyBookings.sort((a, b) => monthsOrder.indexOf(a.name) - monthsOrder.indexOf(b.name));

  const statusData = MOCK_BOOKINGS.reduce((acc, booking) => {
    const existing = acc.find(d => d.name === booking.status);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: booking.status, value: 1 });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  const COLORS = ['#4AADE5', '#2D8F5E', '#E8A838', '#E85D5D'];

  const stats = [
    { label: 'Total Tourists', value: totalUsers, icon: Users, lightBg: 'bg-sky-50', textColor: 'text-sky-600' },
    { label: 'Total Guides', value: totalGuides, icon: Map, lightBg: 'bg-forest-50', textColor: 'text-forest-600' },
    { label: 'Total Bookings', value: totalBookings, icon: Calendar, lightBg: 'bg-earth-50', textColor: 'text-earth-600' },
    { label: 'Total Revenue', value: formatCurrency(totalRevenue), icon: DollarSign, lightBg: 'bg-forest-50', textColor: 'text-forest-600' },
  ];

  return (
    <div className="p-6 lg:p-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Shield className="text-forest-500" size={20} />
          <span className="text-forest-500 text-sm font-medium">Admin Dashboard</span>
        </div>
        <h1 className="text-2xl font-bold text-forest-800">Platform Overview</h1>
        <p className="text-forest-400 mt-1">Monitor your platform's key metrics and performance.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-5 rounded-xl shadow-sm border border-forest-100 flex items-center hover:shadow-md transition-shadow">
            <div className={`p-3 rounded-xl ${stat.lightBg} mr-4`}>
              <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-forest-400">{stat.label}</p>
              <p className="text-2xl font-bold text-forest-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Bookings Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-forest-100">
          <h2 className="text-lg font-bold text-forest-800 mb-6">Monthly Bookings</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyBookings}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#D9EBDE" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#7FBA91' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#7FBA91' }} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid #D9EBDE', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}
                />
                <Line type="monotone" dataKey="bookings" stroke="#2D8F5E" strokeWidth={2} dot={{ r: 4, fill: '#2D8F5E' }} activeDot={{ r: 6, fill: '#1B5E3B' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Booking Status Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-forest-100">
          <h2 className="text-lg font-bold text-forest-800 mb-6">Booking Status Distribution</h2>
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
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid #D9EBDE', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
