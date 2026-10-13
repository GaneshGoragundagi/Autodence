import React from 'react';
import { ViewMode } from '../../types';

interface BottomNavProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onNavigate }) => {
  const tabs = [
    { id: 'dashboard' as ViewMode, label: 'Dashboard', icon: 'dashboard' },
    { id: 'ai-attendance' as ViewMode, label: 'AI Vision', icon: 'face' },
    { id: 'students' as ViewMode, label: 'Students', icon: 'group' },
    { id: 'weekly-analytics' as ViewMode, label: 'Analytics', icon: 'analytics' },
    { id: 'profile-settings' as ViewMode, label: 'Profile', icon: 'person' },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 pb-safe bg-surface/90 backdrop-blur-xl border-t border-outline-variant/30 shadow-[0_-2px_10px_rgba(0,0,0,0.03)] lg:hidden">
      <div className="flex justify-around items-center h-16 sm:h-20 px-2 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = currentView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 w-16 h-14 sm:h-16 transition-all rounded-xl select-none ${
                isActive
                  ? 'bg-primary-container text-white font-medium shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[22px]">{tab.icon}</span>
              <span className="text-[11px] leading-tight font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
