import React from 'react';

interface ToastProps {
  show: boolean;
  title: string;
  message: string;
  type?: 'success' | 'warning' | 'info';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  show,
  title,
  message,
  type = 'success',
  onClose
}) => {
  if (!show) return null;

  return (
    <div className="fixed bottom-24 sm:bottom-8 right-4 sm:right-8 z-50 max-w-md bg-inverse-surface text-inverse-on-surface px-4 py-3.5 rounded-xl shadow-2xl flex items-center justify-between gap-3 border border-outline-variant/20 transition-all duration-300 transform translate-y-0 opacity-100">
      <div className="flex items-center gap-3 min-w-0">
        <span 
          className={`material-symbols-outlined shrink-0 text-[22px] ${
            type === 'success' ? 'text-status-present' : type === 'warning' ? 'text-status-pending' : 'text-primary'
          }`}
        >
          {type === 'success' ? 'verified' : type === 'warning' ? 'warning' : 'info'}
        </span>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-semibold text-white truncate">{title}</span>
          <span className="text-xs text-[#c1c6d5] truncate">{message}</span>
        </div>
      </div>
      <button 
        onClick={onClose}
        className="text-[#c1c6d5] hover:text-white p-1 rounded-lg transition-colors shrink-0"
        aria-label="Close notification"
      >
        <span className="material-symbols-outlined text-[18px]">close</span>
      </button>
    </div>
  );
};
