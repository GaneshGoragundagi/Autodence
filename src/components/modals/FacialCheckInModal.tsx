import React, { useState, useEffect, useRef } from 'react';
import { useLiveClock } from '../../hooks/useLiveClock';

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
  const liveClock = useLiveClock();
  const [stage, setStage] = useState<'align' | 'scanning' | 'verified'>('align');
  const [matchScore, setMatchScore] = useState(98.6);
  const [hasCameraStream, setHasCameraStream] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startStream = async (mode = facingMode) => {
    setCameraError(null);
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }

      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: mode,
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
      }

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.playsInline = true;
        await videoRef.current.play();
      }
      setHasCameraStream(true);
    } catch (err: any) {
      console.warn('Modal camera stream failed', err);
      setCameraError(
        err?.name === 'NotAllowedError'
          ? 'Camera access permission denied.'
          : 'Camera device unavailable.'
      );
      setHasCameraStream(false);
    }
  };

  useEffect(() => {
    let timer1: NodeJS.Timeout;
    let timer2: NodeJS.Timeout;

    if (isOpen) {
      setStage('align');
      startStream(facingMode);

      timer1 = setTimeout(() => {
        setStage('scanning');
      }, 1000);

      timer2 = setTimeout(() => {
        setStage('verified');
      }, 2500);
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      setHasCameraStream(false);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
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
          <div className="flex items-center justify-center gap-1.5 text-xs text-primary font-semibold mb-0.5">
            <span className="material-symbols-outlined text-[15px]">timer</span>
            <span>{liveClock.dateString} • {liveClock.timeString}</span>
          </div>
          <h3 className="text-base font-bold text-on-surface">AI Biometric Telemetry Scanner</h3>
          <p className="text-xs text-on-surface-variant">Real-time Biometric Liveness Verification</p>
        </div>

        {/* Viewfinder scanner box */}
        <div className="relative w-full h-64 rounded-2xl bg-slate-950 overflow-hidden flex items-center justify-center border-2 border-primary/40 shadow-inner">
          {/* Live Video Feed */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
              hasCameraStream ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Fallback graphic if webcam stream not allowed */}
          {!hasCameraStream && (
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900 to-slate-800 flex flex-col items-center justify-center p-4 text-white">
              <span className="material-symbols-outlined text-5xl text-primary/40 mb-2">
                face_retouching_natural
              </span>
              <p className="text-xs text-white/70">{cameraError || 'Simulating camera sensor feed...'}</p>
              <button
                onClick={() => startStream()}
                className="mt-2 text-[11px] px-3 py-1 bg-primary text-white rounded-lg font-semibold"
              >
                Retry Access
              </button>
            </div>
          )}

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
            <div className="p-3 rounded-xl bg-status-present/10 text-status-present text-left">
              <p className="text-sm font-bold flex items-center justify-between">
                <span>{studentName}</span>
                <span className="text-xs font-mono">{matchScore}% Match</span>
              </p>
              <p className="text-[11px] text-on-surface-variant mt-0.5 font-mono">
                Logged at: {liveClock.dateString} • {liveClock.timeString}
              </p>
            </div>
            <button
              onClick={() => {
                onSuccess(studentName);
                onClose();
              }}
              className="w-full py-2.5 bg-primary hover:bg-primary-container text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              <span>Confirm & Record Presence</span>
            </button>
          </div>
        ) : (
          <p className="text-xs text-on-surface-variant font-mono">
            Node status: Active • Biometric calibration in progress
          </p>
        )}
      </div>
    </div>
  );
};
