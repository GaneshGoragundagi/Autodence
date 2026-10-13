import React from 'react';
import { ViewMode } from '../../types';
import { AUTODENCE_ICON_URL } from '../../data/mockData';

interface SidebarProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  onLogout: () => void;
  unreadNotifications?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  onLogout,
  unreadNotifications = 4
}) => {
  const navItems = [
    {
      id: 'dashboard' as ViewMode,
      label: 'Dashboard',
      icon: 'dashboard'
    },
    {
      id: 'ai-attendance' as ViewMode,
      label: 'AI Attendance',
      icon: 'camera',
      hasActiveDot: true
    },
    {
      id: 'students' as ViewMode,
      label: 'Student Management',
      icon: 'group'
    },
    {
      id: 'attendance-records' as ViewMode,
      label: 'Attendance Records',
      icon: 'assignment_turned_in'
    },
    {
      id: 'weekly-analytics' as ViewMode,
      label: 'Weekly Analytics',
      icon: 'bar_chart'
    },
    {
      id: 'semester-reports' as ViewMode,
      label: 'Semester Reports',
      icon: 'description'
    },
    {
      id: 'notifications' as ViewMode,
      label: 'Notifications',
      icon: 'notifications',
      badge: unreadNotifications
    },
    {
      id: 'profile-settings' as ViewMode,
      label: 'Profile & Settings',
      icon: 'manage_accounts'
    }
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-inverse-surface text-inverse-on-surface z-40 flex flex-col justify-between py-6 border-r border-[#3e4660]/30 select-none hidden lg:flex">
      <div className="flex flex-col flex-1 min-h-0">
        {/* Brand header */}
        <div className="px-6 pb-6 flex items-center gap-3">
          <img 
            alt="Autodence Logo" 
            className="h-8 w-auto object-contain cursor-pointer" 
            src={AUTODENCE_ICON_URL} 
            onClick={() => onNavigate('landing')}
          />
          <span 
            className="text-xl tracking-tight text-white font-bold cursor-pointer"
            onClick={() => onNavigate('dashboard')}
          >
            Autodence
          </span>
          <span className="ml-auto bg-primary text-white text-[11px] font-semibold px-2 py-0.5 rounded">
            AI v2
          </span>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-3 overflow-y-auto space-y-1.5">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm font-medium text-left ${
                  isActive
                    ? 'bg-primary-container text-white font-semibold shadow-sm'
                    : 'text-[#c1c6d5] hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                <span className="truncate">{item.label}</span>
                {item.hasActiveDot && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-status-present shrink-0" />
                )}
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="ml-auto bg-error text-white text-[11px] font-bold px-1.5 py-0.2 rounded-full shrink-0">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Logout button */}
      <div className="px-3 pt-4 border-t border-white/10">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[#c1c6d5] hover:bg-white/10 hover:text-white transition-all text-sm font-medium"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
