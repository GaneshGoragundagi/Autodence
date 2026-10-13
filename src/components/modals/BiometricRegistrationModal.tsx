import React, { useState, useEffect, useRef } from 'react';
import { useLiveClock } from '../../hooks/useLiveClock';

interface BiometricRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  studentUsn: string;
  currentAvatar?: string;
  onRegistered: (newPhotoUrl: string, vectorCount: number) => void;
}

export const BiometricRegistrationModal: React.FC<BiometricRegistrationModalProps> = ({
  isOpen,
  onClose,
  studentName,
  studentUsn,
  currentAvatar,
  onRegistered
}) => {
  const liveClock = useLiveClock();
  const [stage, setStage] = useState<'idle' | 'scanning' | 'captured' | 'enrolled'>('idle');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [vectorNodes, setVectorNodes] = useState(128);
  const [qualityScore, setQualityScore] = useState(98.8);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async (mode = facingMode) => {
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
      setCameraActive(true);
    } catch (err: any) {
      console.warn('Registration camera failed:', err);
      setCameraError(
        err?.name === 'NotAllowedError'
          ? 'Camera permission was denied. Please allow camera access in browser settings.'
          : 'Unable to connect to camera device. Please check hardware connection.'
      );
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    if (isOpen) {
      setStage('idle');
      setCapturedImage(null);
      startCamera(facingMode);
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const handleCaptureAndExtract = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
        setCapturedImage(dataUrl);
        setStage('scanning');

        // Simulate 128-node neural vector extraction
        setTimeout(() => {
          setStage('captured');
          setQualityScore(+(97 + Math.random() * 2.8).toFixed(1));
        }, 1200);
      }
    } else {
      setStage('scanning');
      setTimeout(() => {
        setStage('captured');
        setQualityScore(98.4);
      }, 1000);
    }
  };

  const handleConfirmEnrollment = () => {
    setStage('enrolled');
    setTimeout(() => {
      onRegistered(capturedImage || currentAvatar || '', vectorNodes);
      onClose();
    }, 1000);
  };

  const toggleCameraFacing = () => {
    const next = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(next);
    startCamera(next);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-surface-container-lowest rounded-2xl w-full max-w-lg p-6 space-y-4 border border-outline-variant/30 shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-surface-container-high">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">badge</span>
              <h3 className="text-base font-bold text-on-surface">
                Student Biometric Face Registration
              </h3>
            </div>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Secure Enrollment • Generating 128-D Biometric Embedding
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Student Credential Header */}
        <div className="flex items-center justify-between bg-surface-container-low px-4 py-2.5 rounded-xl border border-outline-variant/20 text-xs">
          <div>
            <span className="font-semibold text-on-surface">{studentName}</span>
            <span className="text-on-surface-variant ml-2 font-mono">USN: {studentUsn}</span>
          </div>
          <span className="bg-primary-fixed text-on-primary-fixed px-2 py-0.5 rounded text-[11px] font-bold">
            {liveClock.currentSemester} Registration
          </span>
        </div>

        {/* Camera Viewport / Photo Review */}
        <div className="relative w-full h-72 sm:h-80 rounded-2xl bg-slate-950 overflow-hidden flex items-center justify-center border-2 border-primary/40 shadow-inner">
          {/* Hidden Canvas for Frame Capture */}
          <canvas ref={canvasRef} className="hidden" />

          {capturedImage ? (
            <img 
              src={capturedImage} 
              alt="Biometric Capture" 
              className="w-full h-full object-cover"
            />
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                cameraActive ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}

          {/* Camera Error / Fallback State */}
          {!cameraActive && !capturedImage && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white bg-slate-900 space-y-3">
              <span className="material-symbols-outlined text-5xl text-primary/60">
                photo_camera_front
              </span>
              <p className="text-sm font-semibold">Camera Access for Registration</p>
              <p className="text-xs text-white/70 max-w-sm">
                {cameraError || 'Camera permissions are required during registration time to capture facial vector landmarks.'}
              </p>
              <button
                onClick={() => startCamera()}
                className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary-container"
              >
                Access Camera Now
              </button>
            </div>
          )}

          {/* Biometric Scanning Overlay Reticle */}
          {cameraActive && !capturedImage && (
            <>
              {/* Corner targeting brackets */}
              <div className="absolute top-4 left-4 w-7 h-7 border-t-2 border-l-2 border-cyan-400 pointer-events-none" />
              <div className="absolute top-4 right-4 w-7 h-7 border-t-2 border-r-2 border-cyan-400 pointer-events-none" />
              <div className="absolute bottom-4 left-4 w-7 h-7 border-b-2 border-l-2 border-cyan-400 pointer-events-none" />
              <div className="absolute bottom-4 right-4 w-7 h-7 border-b-2 border-r-2 border-cyan-400 pointer-events-none" />

              {/* Target Oval */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-48 h-56 border-2 border-dashed border-cyan-400/80 rounded-full flex flex-col items-center justify-between p-3 bg-cyan-950/10 backdrop-blur-[1px]">
                  <span className="text-[10px] font-mono text-cyan-300 bg-black/60 px-2 py-0.5 rounded-full">
                    REGISTRATION FRAME
                  </span>
                  <span className="text-[11px] font-mono text-cyan-200 bg-black/60 px-2 py-0.5 rounded-full">
                    Center face & look straight
                  </span>
                </div>
              </div>

              {/* Top Status */}
              <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
                <span className="bg-black/60 px-2.5 py-1 rounded-lg text-[10px] font-mono text-white flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-status-present animate-ping" />
                  REGISTRATION SENSOR ACTIVE
                </span>
                <span className="bg-black/60 px-2.5 py-1 rounded-lg text-[10px] font-mono text-cyan-300">
                  {liveClock.timeString}
                </span>
              </div>
            </>
          )}

          {/* Extraction animation */}
          {stage === 'scanning' && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-white space-y-2">
              <span className="material-symbols-outlined text-4xl text-cyan-300 animate-spin">
                fingerprint
              </span>
              <p className="text-xs font-mono text-cyan-200">
                Extracting 128 Biometric Face Vector Landmarks...
              </p>
            </div>
          )}
        </div>

        {/* Stage Status / Quality Controls */}
        {stage === 'captured' && (
          <div className="p-3 bg-status-present/10 border border-status-present/30 rounded-xl text-status-present flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
              <div>
                <p className="text-xs font-bold">Biometric Template Generated</p>
                <p className="text-[11px] text-on-surface-variant font-mono">
                  128 Nodes Extracted • Quality: {qualityScore}%
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold bg-status-present/20 px-2 py-1 rounded">
              VERIFIED
            </span>
          </div>
        )}

        {stage === 'enrolled' && (
          <div className="p-3 bg-primary/10 border border-primary/30 rounded-xl text-primary text-center">
            <p className="text-xs font-bold">Registration Completed!</p>
            <p className="text-[11px] text-on-surface-variant">
              Biometric template stored securely in university directory.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          {capturedImage ? (
            <button
              type="button"
              onClick={() => {
                setCapturedImage(null);
                setStage('idle');
                startCamera(facingMode);
              }}
              className="px-4 py-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-xs font-semibold text-on-surface transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">refresh</span>
              <span>Retake Photo</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleCameraFacing}
                className="px-3 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-xs font-semibold text-on-surface border border-outline-variant/30 flex items-center gap-1 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">flip_camera_ios</span>
                <span>Switch Camera</span>
              </button>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-on-surface-variant hover:bg-surface-container transition-colors"
            >
              Cancel
            </button>

            {capturedImage ? (
              <button
                type="button"
                onClick={handleConfirmEnrollment}
                disabled={stage === 'enrolled'}
                className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">how_to_reg</span>
                <span>Save Biometric Registration</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCaptureAndExtract}
                disabled={!cameraActive}
                className={`px-5 py-2.5 rounded-xl text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 ${
                  cameraActive 
                    ? 'bg-primary hover:bg-primary-container active:scale-95'
                    : 'bg-primary/50 cursor-not-allowed'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">photo_camera</span>
                <span>Capture & Register Face</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
