import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Compass, Menu, X, LogOut, TreePine } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  const publicLinks = [
    { name: 'Home', path: '/tourist/home' },
    { name: 'Find Guides', path: '/tourist/search' },
  ];

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'guide') return '/guide/dashboard';
    if (user.role === 'admin') return '/admin/dashboard';
    return '/tourist/bookings';
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-forest-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2.5">
              <div className="bg-gradient-to-br from-forest-600 to-forest-700 p-1.5 rounded-lg shadow-sm">
                <Compass className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl text-forest-800">TourMate</span>
            </Link>
            <div className="hidden md:ml-8 md:flex md:space-x-1">
              {publicLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive(link.path)
                      ? "bg-forest-50 text-forest-700"
                      : "text-gray-500 hover:bg-forest-50/50 hover:text-forest-600"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to={getDashboardPath()}
                  className="flex items-center gap-2 bg-forest-50 text-forest-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-forest-100 transition-colors"
                >
                  <TreePine size={16} />
                  My Dashboard
                </Link>
                <div className="flex items-center gap-2 pl-3 border-l border-forest-100">
                  <img
                    className="h-8 w-8 rounded-full border-2 border-forest-200"
                    src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=2D8F5E&color=fff`}
                    alt={user?.name}
                  />
                  <span className="text-sm font-medium text-forest-700">{user?.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-forest-600 hover:text-forest-800 font-medium text-sm px-4 py-2 rounded-lg hover:bg-forest-50 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-forest-600 to-forest-700 text-white px-5 py-2 rounded-lg text-sm font-medium hover:from-forest-700 hover:to-forest-800 transition-all shadow-sm"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-gray-400 hover:text-forest-600 hover:bg-forest-50 transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-forest-100">
          <div className="pt-2 pb-3 space-y-1 px-3">
            {publicLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive(link.path)
                    ? "bg-forest-50 text-forest-700"
                    : "text-gray-500 hover:bg-forest-50/50 hover:text-forest-600"
                )}
              >
                {link.name}
              </Link>
            ))}
            {isAuthenticated && (
              <Link
                to={getDashboardPath()}
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-2.5 rounded-lg text-sm font-medium text-forest-600 bg-forest-50 hover:bg-forest-100"
              >
                My Dashboard
              </Link>
            )}
          </div>
          <div className="pt-3 pb-4 border-t border-forest-100 px-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3 px-2 py-2">
                <img
                  className="h-10 w-10 rounded-full border-2 border-forest-200"
                  src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=2D8F5E&color=fff`}
                  alt=""
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-forest-800 truncate">{user?.name}</div>
                  <div className="text-xs text-forest-400 truncate">{user?.email}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-500 rounded-lg"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full text-center px-4 py-2.5 rounded-lg text-sm font-medium text-forest-700 bg-forest-50 hover:bg-forest-100"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full text-center px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-forest-600 to-forest-700"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
