import React from 'react';
import { AUTODENCE_LOGO_URL } from '../data/mockData';
import { UserRole } from '../types';

interface LandingViewProps {
  onSelectPortal: (portal: UserRole) => void;
  onOpenAuth: (mode: 'login' | 'register' | 'forgot') => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onSelectPortal,
  onOpenAuth
}) => {
  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-4rem)] bg-surface text-on-surface px-4 sm:px-6 py-6 sm:py-10 justify-between max-w-2xl mx-auto">
      {/* Hero Header & Brand Section */}
      <div className="flex flex-col items-center text-center gap-4 pt-4 sm:pt-8">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shadow-lg bg-surface-container flex items-center justify-center p-1.5 ring-4 ring-primary/10">
          <img 
            alt="Autodence Logo" 
            className="w-full h-full object-cover rounded-xl" 
            src={AUTODENCE_LOGO_URL} 
          />
        </div>

        <div className="flex flex-col gap-2 max-w-md">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-surface">
            Smarter Attendance. Powered by AI.
          </h1>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Revolutionizing academic roll call through instant, automated group-photo facial recognition. Skip the manual sheets and let AI log your classroom presence in seconds.
          </p>
        </div>

        {/* Primary Auth Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center w-full max-w-md mt-2">
          <button 
            onClick={() => onOpenAuth('login')}
            className="w-full sm:w-1/2 py-2.5 px-4 bg-primary text-white font-medium rounded-xl shadow-sm hover:bg-primary-container active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">login</span>
            <span>Login</span>
          </button>
          <button 
            onClick={() => onOpenAuth('register')}
            className="w-full sm:w-1/2 py-2.5 px-4 bg-surface-container-high text-on-surface font-medium rounded-xl hover:bg-surface-variant active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">person_add</span>
            <span>Create Account</span>
          </button>
        </div>
      </div>

      {/* Role Selection Portals */}
      <div className="flex flex-col gap-4 w-full max-w-md mx-auto my-8">
        <div className="text-center">
          <h2 className="text-lg font-bold text-on-surface">Select Your Portal</h2>
          <p className="text-xs text-on-surface-variant">Choose your authorized institution role</p>
        </div>

        {/* Teacher Portal Card */}
        <div 
          onClick={() => onSelectPortal('teacher')}
          className="group cursor-pointer bg-surface-container-low rounded-2xl p-5 shadow-sm hover:shadow-md border border-outline-variant/30 hover:border-primary/40 transition-all flex flex-col gap-3 relative overflow-hidden active:scale-[0.99]"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-10 -mt-10 pointer-events-none group-hover:scale-110 transition-transform" />
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-on-primary-fixed-variant shadow-xs shrink-0">
              <span className="material-symbols-outlined text-[26px]">badge</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-base font-bold text-on-surface">Teacher Portal</span>
              <span className="text-xs text-on-surface-variant truncate">
                Manage rosters, upload group captures & review logs
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-outline-variant/20">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary group-hover:translate-x-1 transition-transform">
              <span>Access Faculty Suite</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </span>
            <span className="w-2 h-2 rounded-full bg-status-present" title="Portal Operational" />
          </div>
        </div>

        {/* Student Portal Card */}
        <div 
          onClick={() => onSelectPortal('student')}
          className="group cursor-pointer bg-surface-container-low rounded-2xl p-5 shadow-sm hover:shadow-md border border-outline-variant/30 hover:border-primary/40 transition-all flex flex-col gap-3 relative overflow-hidden active:scale-[0.99]"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full -mr-10 -mt-10 pointer-events-none group-hover:scale-110 transition-transform" />
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed-variant shadow-xs shrink-0">
              <span className="material-symbols-outlined text-[26px]">school</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-base font-bold text-on-surface">Student Portal</span>
              <span className="text-xs text-on-surface-variant truncate">
                Track personal attendance rates & verify presence
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-outline-variant/20">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary group-hover:translate-x-1 transition-transform">
              <span>Access Student Dashboard</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </span>
            <span className="w-2 h-2 rounded-full bg-status-present" title="Portal Operational" />
          </div>
        </div>
      </div>

      {/* Footer Quick Links & Status */}
      <div className="flex justify-center items-center gap-3 py-4 text-xs text-on-surface-variant">
        <button 
          onClick={() => onOpenAuth('forgot')}
          className="hover:text-primary transition-colors font-medium"
        >
          Forgot Password?
        </button>
        <span className="text-surface-variant">•</span>
        <div className="flex items-center gap-1.5">
          <span>System Status:</span>
          <span className="text-status-present font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-status-present" />
            Operational
          </span>
        </div>
      </div>
    </div>
  );
};
