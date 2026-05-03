import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';
import {
  MapPin,
  Home,
  Search,
  CalendarDays,
  MessageCircle,
  CreditCard,
  UserCircle,
  LayoutDashboard,
  Users,
  Map,
  Star,
  AlertTriangle,
  DollarSign,
  Compass,
  TreePine,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
}

const touristNav: NavItem[] = [
  { name: 'Home', path: '/tourist/home', icon: Home },
  { name: 'Find Guides', path: '/tourist/search', icon: Search },
  { name: 'My Bookings', path: '/tourist/bookings', icon: CalendarDays },
  { name: 'Messages', path: '/tourist/chat', icon: MessageCircle },
  { name: 'Payments', path: '/tourist/payment', icon: CreditCard },
  { name: 'My Reviews', path: '/tourist/reviews', icon: Star },
  { name: 'Complaints', path: '/tourist/complaints', icon: AlertTriangle },
  { name: 'Profile', path: '/tourist/profile', icon: UserCircle },
];

const guideNav: NavItem[] = [
  { name: 'Dashboard', path: '/guide/dashboard', icon: LayoutDashboard },
  { name: 'Bookings', path: '/guide/bookings', icon: CalendarDays },
  { name: 'Messages', path: '/guide/chat', icon: MessageCircle },
  { name: 'Earnings', path: '/guide/earnings', icon: DollarSign },
  { name: 'My Reviews', path: '/guide/reviews', icon: Star },
  { name: 'Complaints', path: '/guide/complaints', icon: AlertTriangle },
  { name: 'Profile', path: '/guide/profile', icon: UserCircle },
];

const adminNav: NavItem[] = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Users', path: '/admin/users', icon: Users },
  { name: 'Guides', path: '/admin/guides', icon: Map },
  { name: 'Bookings', path: '/admin/bookings', icon: CalendarDays },
  { name: 'Payments', path: '/admin/payments', icon: CreditCard },
  { name: 'Feedback', path: '/admin/feedback', icon: Star },
  { name: 'Complaints', path: '/admin/complaints', icon: AlertTriangle },
];

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { user } = useAuth();
  const location = useLocation();

  const navItems = user?.role === 'guide' ? guideNav : user?.role === 'admin' ? adminNav : touristNav;

  const isActive = (path: string) => location.pathname === path;

  const roleLabel = user?.role === 'guide' ? 'Tour Guide' : user?.role === 'admin' ? 'Administrator' : 'Explorer';

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 bottom-0 z-40 flex flex-col transition-all duration-300 ease-in-out',
        'bg-gradient-to-b from-forest-900 via-forest-800 to-forest-950',
        collapsed ? 'w-[72px]' : 'w-64'
      )}
    >
      {/* Logo Area */}
      <div className="flex items-center h-16 px-4 border-b border-white/10 shrink-0">
        <Link to="/" className="flex items-center gap-3 overflow-hidden">
          <div className="bg-earth-400 p-1.5 rounded-lg shrink-0">
            <Compass className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <span className="font-bold text-lg text-white whitespace-nowrap">
              TourMate
            </span>
          )}
        </Link>
      </div>

      {/* Nature Accent */}
      {!collapsed && (
        <div className="px-4 py-3 border-b border-white/10">
          <div className="flex items-center gap-2 text-forest-300 text-xs font-medium uppercase tracking-wider">
            <TreePine size={14} />
            <span>{roleLabel} Panel</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto sidebar-scroll py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              title={collapsed ? item.name : undefined}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group',
                active
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-forest-200 hover:bg-white/8 hover:text-white'
              )}
            >
              <item.icon
                size={20}
                className={cn(
                  'shrink-0 transition-colors',
                  active ? 'text-earth-400' : 'text-forest-300 group-hover:text-earth-300'
                )}
              />
              {!collapsed && <span>{item.name}</span>}
              {active && !collapsed && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-earth-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="border-t border-white/10 p-3 shrink-0">
        <div className={cn(
          'flex items-center gap-3 px-2 py-2 rounded-lg',
          collapsed ? 'justify-center' : ''
        )}>
          <img
            className="h-9 w-9 rounded-full border-2 border-earth-400/50 shrink-0"
            src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=2D8F5E&color=fff`}
            alt={user?.name}
          />
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-forest-300 truncate">{user?.email}</p>
            </div>
          )}
        </div>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 bg-forest-700 hover:bg-forest-600 text-white p-1 rounded-full shadow-md border border-forest-500 transition-colors z-50"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </aside>
  );
}
