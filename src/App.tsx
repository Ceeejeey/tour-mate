import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/shared/Navbar';
import Footer from './components/shared/Footer';
import NotFound from './pages/NotFound';

// Auth Pages
import Login from './pages/auth/Login';
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
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    if (user.role === 'tourist') return <Navigate to="/tourist/home" replace />;
    if (user.role === 'guide') return <Navigate to="/guide/dashboard" replace />;
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

function AppRoutes() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FA]">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/tourist/home" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Tourist Routes */}
          <Route path="/tourist/home" element={<TouristHome />} />
          <Route path="/tourist/search" element={<TouristSearch />} />
          <Route path="/tourist/guide/:id" element={<GuideProfile />} />
          
          <Route path="/tourist/booking/new" element={
            <ProtectedRoute allowedRoles={['tourist']}>
              <BookingNew />
            </ProtectedRoute>
          } />
          <Route path="/tourist/bookings" element={
            <ProtectedRoute allowedRoles={['tourist']}>
              <TouristBookings />
            </ProtectedRoute>
          } />
          <Route path="/tourist/chat" element={
            <ProtectedRoute allowedRoles={['tourist']}>
              <TouristChat />
            </ProtectedRoute>
          } />
          <Route path="/tourist/payment" element={
            <ProtectedRoute allowedRoles={['tourist']}>
              <TouristPayment />
            </ProtectedRoute>
          } />
          <Route path="/tourist/profile" element={
            <ProtectedRoute allowedRoles={['tourist']}>
              <TouristProfile />
            </ProtectedRoute>
          } />

          {/* Guide Routes */}
          <Route path="/guide/dashboard" element={
            <ProtectedRoute allowedRoles={['guide']}>
              <GuideDashboard />
            </ProtectedRoute>
          } />
          <Route path="/guide/bookings" element={
            <ProtectedRoute allowedRoles={['guide']}>
              <GuideBookings />
            </ProtectedRoute>
          } />
          <Route path="/guide/profile" element={
            <ProtectedRoute allowedRoles={['guide']}>
              <GuideProfileEdit />
            </ProtectedRoute>
          } />
          <Route path="/guide/chat" element={
            <ProtectedRoute allowedRoles={['guide']}>
              <GuideChat />
            </ProtectedRoute>
          } />
          <Route path="/guide/earnings" element={
            <ProtectedRoute allowedRoles={['guide']}>
              <GuideEarnings />
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminUsers />
            </ProtectedRoute>
          } />
          <Route path="/admin/guides" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminGuides />
            </ProtectedRoute>
          } />
          <Route path="/admin/bookings" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminBookings />
            </ProtectedRoute>
          } />
          <Route path="/admin/payments" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminPayments />
            </ProtectedRoute>
          } />
          <Route path="/admin/feedback" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminFeedback />
            </ProtectedRoute>
          } />
          <Route path="/admin/complaints" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminComplaints />
            </ProtectedRoute>
          } />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
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
