import React, { useState } from 'react';
import { UserRole } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'register' | 'forgot';
  onClose: () => void;
  onSuccess: (role: UserRole) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'login',
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('alan.turing@autodence.edu');
  const [password, setPassword] = useState('••••••••');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('teacher');
  const [loading, setLoading] = useState(false);

  // Sync mode when initialMode changes
  React.useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess(role);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div 
        className="bg-surface-container-lowest rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-2xl relative border border-outline-variant/30 transform transition-all animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-surface-container-high">
          <div>
            <h3 className="text-xl font-bold text-on-surface">
              {mode === 'login' ? 'Sign In to Autodence' : mode === 'register' ? 'Create Account' : 'Reset Password'}
            </h3>
            <p className="text-xs text-on-surface-variant mt-0.5">
              {mode === 'login' 
                ? 'Enter your institutional credentials to proceed'
                : mode === 'register'
                ? 'Register your biometric academic identity'
                : 'Enter your university email to receive a secure link'}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Portal selector for demo */}
        {mode !== 'forgot' && (
          <div className="mt-4 p-1.5 bg-surface-container-low rounded-xl flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                setRole('teacher');
                setEmail('alan.turing@autodence.edu');
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                role === 'teacher'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Faculty / Teacher
            </button>
            <button
              type="button"
              onClick={() => {
                setRole('student');
                setEmail('alex.rivera@autodence.edu');
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                role === 'student'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Student Portal
            </button>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          {mode === 'register' && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface-variant">Full Name</label>
              <input 
                type="text" 
                required
                placeholder="Prof. or Student Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-sm border-0 focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-on-surface-variant">University Email</label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-outline text-[18px]">
                mail
              </span>
              <input 
                type="email" 
                required
                placeholder="name@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-sm border-0 focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-on-surface-variant">Password</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] text-primary hover:underline font-medium"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-outline text-[18px]">
                  lock
                </span>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-sm border-0 focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 bg-primary text-white font-semibold text-sm rounded-xl shadow-md hover:bg-primary-container active:scale-[0.99] transition-all flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                <span>Authenticating...</span>
              </>
            ) : (
              <span>
                {mode === 'login' ? 'Continue' : mode === 'register' ? 'Register Account' : 'Send Reset Link'}
              </span>
            )}
          </button>
        </form>

        {/* Footer toggles */}
        <div className="mt-5 text-center text-xs text-on-surface-variant">
          {mode === 'login' ? (
            <p>
              Don't have an academic account?{' '}
              <button 
                onClick={() => setMode('register')} 
                className="text-primary font-semibold hover:underline"
              >
                Create Account
              </button>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <button 
                onClick={() => setMode('login')} 
                className="text-primary font-semibold hover:underline"
              >
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
