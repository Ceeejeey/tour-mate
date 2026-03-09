import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';
import {
  Bell,
  LogOut,
  Sun,
  Leaf,
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface AppLayoutProps {
  children: React.ReactNode;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

function getSeasonalEmoji(): React.ReactNode {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return <Leaf size={18} className="text-forest-500" />;
  if (month >= 5 && month <= 8) return <Sun size={18} className="text-earth-400" />;
  return <Leaf size={18} className="text-earth-500" />;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const firstName = user?.name?.split(' ')[0] || 'Traveler';

  return (
    <div className="min-h-screen bg-forest-50/50">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      {/* Main Content Area */}
      <div
        className={cn(
          'transition-all duration-300 ease-in-out min-h-screen flex flex-col',
          sidebarCollapsed ? 'ml-[72px]' : 'ml-64'
        )}
      >
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-forest-100">
          <div className="flex items-center justify-between h-16 px-6">
            {/* Welcome & Greeting */}
            <div className="flex items-center gap-3">
              {getSeasonalEmoji()}
              <div>
                <h2 className="text-sm font-semibold text-forest-800">
                  {getGreeting()}, {firstName}!
                </h2>
                <p className="text-xs text-forest-500">
                  Ready for your next adventure?
                </p>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Notification Bell */}
              <button className="relative p-2 text-forest-500 hover:text-forest-700 hover:bg-forest-50 rounded-lg transition-colors">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-earth-400 rounded-full" />
              </button>

              {/* User Quick Info */}
              <div className="hidden sm:flex items-center gap-3 ml-2 pl-3 border-l border-forest-100">
                <img
                  className="h-8 w-8 rounded-full border-2 border-forest-200"
                  src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=2D8F5E&color=fff`}
                  alt={user?.name}
                />
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-forest-800">{user?.name}</p>
                  <p className="text-xs text-forest-400 capitalize">{user?.role}</p>
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="p-2 text-forest-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto app-scroll">
          {children}
        </main>
      </div>
    </div>
  );
}
