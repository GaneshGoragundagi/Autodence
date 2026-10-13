import React from 'react';
import { ViewMode, UserRole } from '../../types';
import { AUTODENCE_ICON_URL } from '../../data/mockData';

interface SidebarProps {
  currentView: ViewMode;
  userRole?: UserRole;
  onNavigate: (view: ViewMode) => void;
  onLogout: () => void;
  unreadNotifications?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  userRole = 'student',
  onNavigate,
  onLogout,
  unreadNotifications = 4
}) => {
  const teacherNavItems = [
    {
      id: 'dashboard' as ViewMode,
      label: 'Dashboard',
      icon: 'dashboard'
    },
    {
      id: 'ai-attendance' as ViewMode,
      label: 'AI Attendance Vision',
      icon: 'camera',
      hasActiveDot: true
    },
    {
      id: 'students' as ViewMode,
      label: 'Student Roster',
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
      label: 'Faculty Settings',
      icon: 'manage_accounts'
    }
  ];

  const studentNavItems = [
    {
      id: 'student-portal' as ViewMode,
      label: 'My Attendance Portal',
      icon: 'person',
      hasActiveDot: true
    },
    {
      id: 'notifications' as ViewMode,
      label: 'Campus Notifications',
      icon: 'notifications',
      badge: unreadNotifications
    },
    {
      id: 'profile-settings' as ViewMode,
      label: 'Profile & Security',
      icon: 'manage_accounts'
    }
  ];

  const navItems = userRole === 'student' ? studentNavItems : teacherNavItems;

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-inverse-surface text-inverse-on-surface z-40 flex flex-col justify-between py-6 border-r border-[#3e4660]/30 select-none hidden lg:flex">
      <div className="flex flex-col flex-1 min-h-0">
        {/* Brand header */}
        <div className="px-6 pb-6 flex items-center gap-3">
          <img 
            alt="Autodence Logo" 
            className="h-8 w-auto object-contain cursor-pointer" 
            src={AUTODENCE_ICON_URL} 
            onClick={() => onNavigate(userRole === 'student' ? 'student-portal' : 'dashboard')}
          />
          <div>
            <span 
              className="text-xl tracking-tight text-white font-bold cursor-pointer block leading-none"
              onClick={() => onNavigate(userRole === 'student' ? 'student-portal' : 'dashboard')}
            >
              Autodence
            </span>
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded mt-1 inline-block ${
              userRole === 'student'
                ? 'bg-cyan-500/20 text-cyan-300'
                : 'bg-amber-500/20 text-amber-300'
            }`}>
              {userRole === 'student' ? 'STUDENT PORTAL' : 'FACULTY PORTAL'}
            </span>
          </div>
          <span className="ml-auto bg-primary text-white text-[11px] font-semibold px-2 py-0.5 rounded">
            AI v2
          </span>
        </div>

        {/* Security Isolation Notice */}
        <div className="mx-3 mb-3 p-2.5 rounded-xl bg-white/5 border border-white/10 text-[11px] text-[#c1c6d5] flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px] text-cyan-400 shrink-0">
            lock
          </span>
          <span className="truncate">
            {userRole === 'student'
              ? 'Student Clearance (Isolated)'
              : 'Faculty Admin Clearance'}
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

      {/* Security & Logout */}
      <div className="px-3 pt-3 border-t border-white/10 space-y-2">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[#c1c6d5] hover:bg-error/20 hover:text-error transition-all text-sm font-medium"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          <span>Sign Out / Change Portal</span>
        </button>
      </div>
    </aside>
  );
};
