import React, { useState, useEffect } from 'react';
import { Student } from '../types';
import { useLiveClock } from '../hooks/useLiveClock';

interface StudentPortalViewProps {
  currentStudent: Student;
  onSwitchStudent: (student: Student) => void;
  allStudents: Student[];
  onOpenBiometricRegistration: () => void;
  onLogout: () => void;
}

export const StudentPortalView: React.FC<StudentPortalViewProps> = ({
  currentStudent,
  onSwitchStudent,
  allStudents,
  onOpenBiometricRegistration,
  onLogout
}) => {
  const liveClock = useLiveClock();

  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const [leaveReason, setLeaveReason] = useState('');
  const [leaveDate, setLeaveDate] = useState(liveClock.isoDateString);
  const [submittedLeave, setSubmittedLeave] = useState(false);

  // Automatically keep leave date synced to today's date if not modified
  useEffect(() => {
    if (!leaveReason) {
      setLeaveDate(liveClock.isoDateString);
    }
  }, [liveClock.isoDateString, leaveReason]);

  const isAtRisk = currentStudent.attendanceRate < 75;

  return (
    <div className="flex flex-col w-full gap-6 pb-20">
      {/* Real-time Campus Calendar & Security Status Bar */}
      <div className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 shadow-xs border border-outline-variant/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[22px]">calendar_today</span>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                Institutional Academic Calendar
              </span>
              <span className="w-2 h-2 rounded-full bg-status-present animate-ping" />
              <span className="text-[11px] text-on-surface-variant font-mono">
                Auto-updated
              </span>
            </div>
            <p className="text-base sm:text-lg font-bold text-on-surface">
              {liveClock.dateString}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto flex-wrap">
          <div className="bg-surface-container-low px-3.5 py-1.5 rounded-xl border border-outline-variant/30 text-right">
            <p className="text-[10px] uppercase font-semibold text-on-surface-variant">
              Live Session Clock
            </p>
            <p className="text-sm font-bold text-primary font-mono tabular-nums">
              {liveClock.timeString}
            </p>
          </div>
          <div className="bg-primary-fixed text-on-primary-fixed px-3 py-1.5 rounded-xl text-xs font-bold shrink-0">
            {liveClock.currentSemester}
          </div>
          <div className="bg-emerald-500/10 text-emerald-700 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-emerald-500/20">
            <span className="material-symbols-outlined text-[15px]">lock</span>
            <span>Student Authenticated</span>
          </div>
        </div>
      </div>

      {/* Student Profile Card */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-outline-variant/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden ring-4 ring-primary/20 shrink-0 bg-surface-container">
            <img 
              src={currentStudent.avatar} 
              alt={currentStudent.name}
              className="w-full h-full object-cover"
            />
            <div 
              className={`absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full ring-2 ring-white ${
                isAtRisk ? 'bg-status-absent' : 'bg-status-present'
              }`} 
            />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-on-surface">
                {currentStudent.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-fixed text-on-primary-fixed">
                {currentStudent.department} • {currentStudent.semester}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-surface-container-high text-on-surface flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">verified_user</span>
                <span>Verified Student ID</span>
              </span>
            </div>
            <p className="text-xs text-on-surface-variant font-mono mt-0.5">
              USN: {currentStudent.usn} • {currentStudent.email}
            </p>
          </div>
        </div>

        {/* Persona Switcher (For demo/testing between different student accounts) */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs text-on-surface-variant font-medium">Student Account:</span>
          <select
            value={currentStudent.id}
            onChange={(e) => {
              const selected = allStudents.find(s => s.id === e.target.value);
              if (selected) onSwitchStudent(selected);
            }}
            className="px-3 py-2 rounded-xl bg-surface-container-low text-xs font-semibold text-on-surface border border-outline-variant/30 outline-none focus:ring-2 focus:ring-primary"
          >
            {allStudents.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.attendanceRate}%)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Biometric Face ID Registration Card (Camera used ONLY for Registration time) */}
      <div className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 shadow-xs border border-outline-variant/30 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl">fingerprint</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-on-surface">
                  Biometric Facial ID Profile
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-status-present/10 text-status-present border border-status-present/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-status-present" />
                  <span>Enrolled & Active</span>
                </span>
              </div>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Camera access is used strictly during registration time to map your facial telemetry.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenBiometricRegistration}
            className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-white text-xs font-bold shadow-xs transition-all flex items-center gap-2 self-start sm:self-auto"
          >
            <span className="material-symbols-outlined text-[18px]">photo_camera</span>
            <span>Register / Update Face ID</span>
          </button>
        </div>

        {/* Biometric Metadata Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-900 shrink-0 border border-primary/30">
              <img 
                src={currentStudent.avatar} 
                alt="Enrolled Template" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div>
              <p className="text-xs font-semibold text-on-surface">Enrolled Face Vector</p>
              <p className="text-[11px] text-on-surface-variant font-mono">
                128 Node Vector Signature
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">security</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-on-surface">Anti-Spoofing Hash</p>
              <p className="text-[11px] text-on-surface-variant font-mono">
                SHA-256 #8F2B...E049
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-on-surface">Registration Timestamp</p>
              <p className="text-[11px] text-on-surface-variant font-mono">
                {liveClock.shortDateString} • Valid
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Stats Bento */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={`p-5 rounded-2xl border flex flex-col justify-between ${
          isAtRisk 
            ? 'bg-error-container/40 border-error/30' 
            : 'bg-surface-container-lowest border-outline-variant/30'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-on-surface-variant">Overall Attendance</span>
            <span className={`material-symbols-outlined text-[22px] ${
              isAtRisk ? 'text-status-absent' : 'text-status-present'
            }`}>
              {isAtRisk ? 'warning' : 'verified'}
            </span>
          </div>
          <div className="my-2">
            <p className={`text-3xl font-bold tabular-nums ${
              isAtRisk ? 'text-status-absent' : 'text-status-present'
            }`}>
              {currentStudent.attendanceRate}%
            </p>
            <p className="text-xs text-on-surface-variant mt-0.5">
              {isAtRisk ? 'Debarment Risk: Below 75% threshold' : 'Eligible for University Finals'}
            </p>
          </div>
          <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${isAtRisk ? 'bg-status-absent' : 'bg-status-present'}`} 
              style={{ width: `${Math.min(100, currentStudent.attendanceRate)}%` }} 
            />
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/30 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-on-surface-variant">Lectures Attended</span>
            <span className="material-symbols-outlined text-primary text-[22px]">check_circle</span>
          </div>
          <div className="my-2">
            <p className="text-3xl font-bold text-on-surface tabular-nums">
              {currentStudent.totalPresent}
            </p>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Verified by Faculty AI Camera Roster
            </p>
          </div>
          <span className="text-[11px] font-semibold text-status-present">
            Full physical presence recorded
          </span>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/30 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-on-surface-variant">Absence Excuses</span>
            <span className="material-symbols-outlined text-secondary text-[22px]">edit_calendar</span>
          </div>
          <div className="my-2">
            <p className="text-3xl font-bold text-on-surface tabular-nums">
              {currentStudent.totalAbsent}
            </p>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Recorded absent sessions
            </p>
          </div>
          <button
            onClick={() => setLeaveModalOpen(true)}
            className="w-full py-2 px-3 bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">post_add</span>
            <span>Submit Leave Request</span>
          </button>
        </div>
      </div>

      {/* Courses Breakdown */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-outline-variant/30 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-on-surface">Enrolled Course Attendance</h2>
          <span className="text-xs text-on-surface-variant font-medium">
            {liveClock.currentSemester} Term
          </span>
        </div>

        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-on-surface">CS-301: Advanced Data Structures</span>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-primary-fixed text-on-primary-fixed">
                  Prof. Alan Turing
                </span>
              </div>
              <p className="text-xs text-on-surface-variant mt-0.5">
                38 of 40 lectures attended • Last verified: Today, {liveClock.shortTimeString}
              </p>
            </div>
            <span className="text-base font-bold text-status-present tabular-nums">
              95.0%
            </span>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-on-surface">CS-304: Database Systems & Cloud Architecture</span>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-secondary-fixed text-on-secondary-fixed">
                  Prof. Grace Hopper
                </span>
              </div>
              <p className="text-xs text-on-surface-variant mt-0.5">
                32 of 36 lectures attended • Last verified: Yesterday
              </p>
            </div>
            <span className="text-base font-bold text-on-surface tabular-nums">
              88.8%
            </span>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-on-surface">CS-307: AI & Machine Learning Laboratory</span>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-tertiary-fixed text-on-tertiary-fixed">
                  Prof. John McCarthy
                </span>
              </div>
              <p className="text-xs text-on-surface-variant mt-0.5">
                19 of 20 labs attended • Last verified: 2 days ago
              </p>
            </div>
            <span className="text-base font-bold text-status-present tabular-nums">
              95.0%
            </span>
          </div>
        </div>
      </div>

      {/* Security & Access Isolation Policy Box */}
      <div className="bg-surface-container-low rounded-2xl p-5 border border-outline-variant/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-surface-container-highest text-on-surface-variant flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px]">shield</span>
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface">
              Institutional Security & Role-Based Access Isolation
            </p>
            <p className="text-[11px] text-on-surface-variant">
              Faculty administrative tools and student telemetry are strictly partitioned. Role crossover requires verified administrative credentials.
            </p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="px-4 py-2 rounded-xl bg-surface-container-highest hover:bg-error/10 hover:text-error text-xs font-semibold text-on-surface transition-colors flex items-center gap-1.5 self-start sm:self-auto shrink-0"
        >
          <span className="material-symbols-outlined text-[16px]">logout</span>
          <span>Secure Sign Out</span>
        </button>
      </div>

      {/* Leave Request Modal */}
      {leaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-surface-container-lowest rounded-2xl w-full max-w-md p-6 space-y-4 border border-outline-variant/30 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container-high">
              <h3 className="text-base font-bold text-on-surface">Submit Absence Excuse / Leave</h3>
              <button 
                onClick={() => setLeaveModalOpen(false)}
                className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {submittedLeave ? (
              <div className="p-4 rounded-xl bg-status-present/10 text-status-present text-center space-y-2">
                <span className="material-symbols-outlined text-4xl">task_alt</span>
                <p className="text-sm font-bold">Leave Request Submitted</p>
                <p className="text-xs text-on-surface-variant">
                  Sent to faculty and academic mentor for {leaveDate}.
                </p>
                <button
                  onClick={() => {
                    setSubmittedLeave(false);
                    setLeaveModalOpen(false);
                  }}
                  className="mt-2 px-4 py-2 bg-primary text-white rounded-xl text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            ) : (
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmittedLeave(true);
                }}
                className="space-y-4"
              >
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-on-surface-variant">
                    Absence Date (Auto-filled)
                  </label>
                  <input
                    type="date"
                    required
                    value={leaveDate}
                    onChange={(e) => setLeaveDate(e.target.value)}
                    className="p-2.5 rounded-xl bg-surface-container-low text-xs border border-outline-variant/20 outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-on-surface-variant">
                    Reason for Absence
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="e.g. Medical emergency, university tech fest hackathon..."
                    value={leaveReason}
                    onChange={(e) => setLeaveReason(e.target.value)}
                    className="p-2.5 rounded-xl bg-surface-container-low text-xs border border-outline-variant/20 outline-none resize-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setLeaveModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-on-surface-variant hover:bg-surface-container"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-container shadow-xs"
                  >
                    Send to Faculty
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
