import React, { useState, useEffect } from 'react';

interface FacialCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName?: string;
  onSuccess: (name: string) => void;
}

export const FacialCheckInModal: React.FC<FacialCheckInModalProps> = ({
  isOpen,
  onClose,
  studentName = 'Alex Rivera',
  onSuccess
}) => {
  const [stage, setStage] = useState<'align' | 'scanning' | 'verified'>('align');
  const [matchScore, setMatchScore] = useState(98.4);

  useEffect(() => {
    if (isOpen) {
      setStage('align');
      const timer1 = setTimeout(() => {
        setStage('scanning');
      }, 800);
      const timer2 = setTimeout(() => {
        setStage('verified');
      }, 2400);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-surface-container-lowest rounded-2xl w-full max-w-sm p-6 space-y-4 border border-outline-variant/30 shadow-2xl text-center relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:text-on-surface z-20"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>

        <div>
          <h3 className="text-base font-bold text-on-surface">AI Facial Telemetry Scanner</h3>
          <p className="text-xs text-on-surface-variant">Real-time Biometric Liveness Verification</p>
        </div>

        {/* Viewfinder scanner box */}
        <div className="relative w-full h-64 rounded-2xl bg-slate-900 overflow-hidden flex items-center justify-center border-2 border-primary/40 shadow-inner">
          {/* Simulated webcam video feed */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center">
            <span className="material-symbols-outlined text-6xl text-primary/40">
              face_retouching_natural
            </span>
          </div>

          {/* Futuristic corner targeting brackets */}
          <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-primary" />
          <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-primary" />
          <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-primary" />
          <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-primary" />

          {/* Scanning sweep beam animation */}
          {stage === 'scanning' && (
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse top-1/2 -translate-y-1/2 shadow-[0_0_12px_#38bdf8]" />
          )}

          {/* Status overlay */}
          <div className="absolute bottom-3 inset-x-3 bg-black/60 backdrop-blur-md rounded-xl p-2.5 text-xs text-white">
            {stage === 'align' && (
              <span className="flex items-center justify-center gap-1.5 text-white/90">
                <span className="material-symbols-outlined text-[16px] text-primary">visibility</span>
                <span>Aligning face in target frame...</span>
              </span>
            )}
            {stage === 'scanning' && (
              <span className="flex items-center justify-center gap-1.5 text-cyan-300">
                <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
                <span>Extracting 128 biometric vector nodes...</span>
              </span>
            )}
            {stage === 'verified' && (
              <span className="flex items-center justify-center gap-1.5 text-status-present font-bold">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                <span>Face Identified: {matchScore}% Match!</span>
              </span>
            )}
          </div>
        </div>

        {stage === 'verified' ? (
          <div className="space-y-3 pt-1">
            <div className="p-3 rounded-xl bg-status-present/10 text-status-present">
              <p className="text-sm font-bold">Attendance Logged: {studentName}</p>
              <p className="text-[11px] text-on-surface-variant">
                CS-301 Lecture Session • Validated by Neural Net v4.2
              </p>
            </div>
            <button
              onClick={() => {
                onSuccess(studentName);
                onClose();
              }}
              className="w-full py-2.5 bg-primary hover:bg-primary-container text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
            >
              Done & Return
            </button>
          </div>
        ) : (
          <p className="text-xs text-on-surface-variant">
            Please look directly at camera in good lighting.
          </p>
        )}
      </div>
    </div>
  );
};
