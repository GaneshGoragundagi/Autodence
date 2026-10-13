import React, { useState } from 'react';
import { ViewMode, UserRole } from '../../types';
import { AUTODENCE_ICON_URL } from '../../data/mockData';
import { useLiveClock } from '../../hooks/useLiveClock';

interface HeaderProps {
  currentView: ViewMode;
  userRole: UserRole;
  onNavigate: (view: ViewMode) => void;
  userName?: string;
  userAvatar?: string;
  unreadNotifications?: number;
  onOpenNotifications: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  userRole,
  onNavigate,
  userName = 'Prof. Alan Turing',
  userAvatar,
  unreadNotifications = 4,
  onOpenNotifications
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);

  const liveClock = useLiveClock();
  const currentSemester = liveClock.currentSemester;

  const getPageTitle = (view: ViewMode) => {
    switch (view) {
      case 'dashboard':
        return 'Dashboard';
      case 'ai-attendance':
        return 'Ai Attendance';
      case 'students':
        return 'Students';
      case 'weekly-analytics':
        return 'Weekly Analytics';
      case 'profile-settings':
        return 'Profile & Settings';
      case 'attendance-records':
        return 'Attendance Records';
      case 'semester-reports':
        return 'Semester Reports';
      case 'notifications':
        return 'Notifications';
      case 'student-portal':
        return 'Student Portal';
      default:
        return 'Autodence';
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 lg:left-72 z-30 h-16 bg-surface-container-lowest/95 backdrop-blur-xl border-b border-outline-variant/20 shadow-[0_1px_8px_rgba(0,0,0,0.03)] px-4 sm:px-6 flex items-center justify-between transition-all">
      {/* Left zone */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile brand & title */}
        <div className="flex items-center gap-2 lg:hidden">
          <img 
            alt="Autodence Logo" 
            className="h-7 w-auto object-contain cursor-pointer" 
            src={AUTODENCE_ICON_URL} 
            onClick={() => onNavigate('landing')}
          />
          <span className="font-semibold text-lg text-on-surface truncate">
            {getPageTitle(currentView)}
          </span>
        </div>

        {/* Desktop breadcrumb */}
        <div className="hidden lg:flex items-center gap-2 text-on-surface-variant text-sm font-medium">
          <span className="material-symbols-outlined text-[18px] text-primary">
            {userRole === 'student' ? 'badge' : 'school'}
          </span>
          <span>
            {userRole === 'student' 
              ? 'Student Attendance Portal' 
              : 'Department of Computer Science & Engineering'}
          </span>
          <span className="text-outline">•</span>
          <span className="text-primary font-semibold">{currentSemester}</span>
          <span className="text-outline">•</span>
          <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full font-semibold ${
            userRole === 'student'
              ? 'bg-cyan-500/10 text-cyan-700 border border-cyan-500/20'
              : 'bg-amber-500/10 text-amber-700 border border-amber-500/20'
          }`}>
            {userRole === 'student' ? 'Student Session' : 'Faculty Session'}
          </span>
        </div>
      </div>

      {/* Center & Right zone */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        {/* Desktop search bar */}
        <div className="relative hidden xl:flex items-center">
          <span className="material-symbols-outlined absolute left-3 text-outline text-[18px] pointer-events-none">
            search
          </span>
          <input
            type="text"
            placeholder="Search student roll, lecture, session..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64 bg-surface-container-low text-xs text-on-surface pl-9 pr-3 py-2 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-outline-variant transition-all"
          />
        </div>

        {/* Mobile search trigger */}
        <button
          onClick={() => setShowSearchModal(!showSearchModal)}
          className="xl:hidden w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors"
          aria-label="Search"
        >
          <span className="material-symbols-outlined text-[20px]">search</span>
        </button>

        {/* Notifications Bell */}
        <button
          onClick={onOpenNotifications}
          className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors"
          aria-label="Notifications"
        >
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          {unreadNotifications > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-status-absent ring-2 ring-surface-container-lowest" />
          )}
        </button>

        {/* User profile dropdown button */}
        <div 
          onClick={() => onNavigate('profile-settings')}
          className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-surface-container-high cursor-pointer group"
        >
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-on-surface leading-tight group-hover:text-primary transition-colors">
              {userName}
            </p>
            <p className="text-[11px] text-on-surface-variant leading-tight">
              {userRole === 'teacher' ? 'Dept. of CSE' : 'Student (1BM21CS014)'}
            </p>
          </div>
          <div className="w-8 h-8 rounded-full overflow-hidden bg-primary text-white flex items-center justify-center shadow-xs ring-2 ring-primary/20">
            {userAvatar ? (
              <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
            ) : (
              <span className="material-symbols-outlined text-[18px]">person</span>
            )}
          </div>
        </div>
      </div>

      {/* Mobile search dropdown */}
      {showSearchModal && (
        <div className="absolute top-16 left-0 right-0 p-3 bg-surface-container-lowest border-b border-outline-variant/20 shadow-md xl:hidden flex items-center gap-2">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline text-[18px]">
              search
            </span>
            <input
              type="text"
              autoFocus
              placeholder="Search students, classes, records..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-container-low text-sm text-on-surface pl-9 pr-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button 
            onClick={() => setShowSearchModal(false)}
            className="p-2 text-on-surface-variant text-sm font-medium"
          >
            Done
          </button>
        </div>
      )}
    </header>
  );
};
