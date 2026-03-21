import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/shared/Navbar';
import Footer from './components/shared/Footer';
import AppLayout from './components/shared/AppLayout';
import NotFound from './pages/NotFound';

// Auth Pages
import Login from './pages/auth/Login';
import AdminLogin from './pages/auth/AdminLogin';
import Register from './pages/auth/Register';

// Tourist Pages
import TouristHome from './pages/tourist/Home';
import TouristSearch from './pages/tourist/Search';
import GuideProfile from './pages/tourist/GuideProfile';
import BookingNew from './pages/tourist/Booking';
import TouristBookings from './pages/tourist/Bookings';
import TouristChat from './pages/tourist/Chat';
import TouristPayment from './pages/tourist/Payment';
import TouristProfile from './pages/tourist/Profile';

// Guide Pages
import GuideDashboard from './pages/guide/Dashboard';
import GuideBookings from './pages/guide/Bookings';
import GuideProfileEdit from './pages/guide/Profile';
import GuideChat from './pages/guide/Chat';
import GuideEarnings from './pages/guide/Earnings';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminGuides from './pages/admin/Guides';
import AdminBookings from './pages/admin/Bookings';
import AdminPayments from './pages/admin/Payments';
import AdminFeedback from './pages/admin/Feedback';
import AdminComplaints from './pages/admin/Complaints';

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-forest-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-forest-200 border-t-forest-600 rounded-full animate-spin" />
          <span className="text-forest-600 text-sm font-medium">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    if (user.role === 'tourist') return <Navigate to="/tourist/home" replace />;
    if (user.role === 'guide') return <Navigate to="/guide/dashboard" replace />;
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Layout wrapper for protected app pages (sidebar + header)
const DashboardRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  return (
    <ProtectedRoute allowedRoles={allowedRoles}>
      <AppLayout>{children}</AppLayout>
    </ProtectedRoute>
  );
};

// Public layout with Navbar + Footer
const PublicLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col min-h-screen bg-forest-50/30">
    <Navbar />
    <main className="flex-grow">{children}</main>
    <Footer />
  </div>
);

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes - website feel with Navbar + Footer */}
      <Route path="/" element={<Navigate to="/tourist/home" replace />} />
      <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
      <Route path="/admin/login" element={<PublicLayout><AdminLogin /></PublicLayout>} />
      <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />
      <Route path="/tourist/home" element={<PublicLayout><TouristHome /></PublicLayout>} />
      <Route path="/tourist/search" element={<PublicLayout><TouristSearch /></PublicLayout>} />
      <Route path="/tourist/guide/:id" element={<PublicLayout><GuideProfile /></PublicLayout>} />
      
      {/* Tourist Dashboard Routes - app layout with sidebar */}
      <Route path="/tourist/booking/new" element={
        <DashboardRoute allowedRoles={['tourist']}>
          <BookingNew />
        </DashboardRoute>
      } />
      <Route path="/tourist/bookings" element={
        <DashboardRoute allowedRoles={['tourist']}>
          <TouristBookings />
        </DashboardRoute>
      } />
      <Route path="/tourist/chat" element={
        <DashboardRoute allowedRoles={['tourist']}>
          <TouristChat />
        </DashboardRoute>
      } />
      <Route path="/tourist/payment" element={
        <DashboardRoute allowedRoles={['tourist']}>
          <TouristPayment />
        </DashboardRoute>
      } />
      <Route path="/tourist/profile" element={
        <DashboardRoute allowedRoles={['tourist']}>
          <TouristProfile />
        </DashboardRoute>
      } />

      {/* Guide Dashboard Routes - app layout with sidebar */}
      <Route path="/guide/dashboard" element={
        <DashboardRoute allowedRoles={['guide']}>
          <GuideDashboard />
        </DashboardRoute>
      } />
      <Route path="/guide/bookings" element={
        <DashboardRoute allowedRoles={['guide']}>
          <GuideBookings />
        </DashboardRoute>
      } />
      <Route path="/guide/profile" element={
        <DashboardRoute allowedRoles={['guide']}>
          <GuideProfileEdit />
        </DashboardRoute>
      } />
      <Route path="/guide/chat" element={
        <DashboardRoute allowedRoles={['guide']}>
          <GuideChat />
        </DashboardRoute>
      } />
      <Route path="/guide/earnings" element={
        <DashboardRoute allowedRoles={['guide']}>
          <GuideEarnings />
        </DashboardRoute>
      } />

      {/* Admin Dashboard Routes - app layout with sidebar */}
      <Route path="/admin/dashboard" element={
        <DashboardRoute allowedRoles={['admin']}>
          <AdminDashboard />
        </DashboardRoute>
      } />
      <Route path="/admin/users" element={
        <DashboardRoute allowedRoles={['admin']}>
          <AdminUsers />
        </DashboardRoute>
      } />
      <Route path="/admin/guides" element={
        <DashboardRoute allowedRoles={['admin']}>
          <AdminGuides />
        </DashboardRoute>
      } />
      <Route path="/admin/bookings" element={
        <DashboardRoute allowedRoles={['admin']}>
          <AdminBookings />
        </DashboardRoute>
      } />
      <Route path="/admin/payments" element={
        <DashboardRoute allowedRoles={['admin']}>
          <AdminPayments />
        </DashboardRoute>
      } />
      <Route path="/admin/feedback" element={
        <DashboardRoute allowedRoles={['admin']}>
          <AdminFeedback />
        </DashboardRoute>
      } />
      <Route path="/admin/complaints" element={
        <DashboardRoute allowedRoles={['admin']}>
          <AdminComplaints />
        </DashboardRoute>
      } />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}
