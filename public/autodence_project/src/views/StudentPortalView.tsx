import React, { useState } from 'react';
import { Student } from '../types';

interface StudentPortalViewProps {
  currentStudent: Student;
  onSwitchStudent: (student: Student) => void;
  allStudents: Student[];
  onOpenCheckInModal: () => void;
}

export const StudentPortalView: React.FC<StudentPortalViewProps> = ({
  currentStudent,
  onSwitchStudent,
  allStudents,
  onOpenCheckInModal
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'history'>('overview');
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const [leaveReason, setLeaveReason] = useState('');
  const [leaveDate, setLeaveDate] = useState('2025-10-25');
  const [submittedLeave, setSubmittedLeave] = useState(false);

  const isAtRisk = currentStudent.attendanceRate < 75;

  return (
    <div className="flex flex-col w-full gap-6 pb-20">
      {/* Student Profile & Quick Switch Header */}
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
            </div>
            <p className="text-xs text-on-surface-variant font-mono mt-0.5">
              USN: {currentStudent.usn} • {currentStudent.email}
            </p>
          </div>
        </div>

        {/* Switch Persona for Demo Testing */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs text-on-surface-variant font-medium">Demo Persona:</span>
          <select
            value={currentStudent.id}
            onChange={(e) => {
              const selected = allStudents.find(s => s.id === e.target.value);
              if (selected) onSwitchStudent(selected);
            }}
            className="px-3 py-2 rounded-xl bg-surface-container-low text-xs font-semibold text-on-surface border border-outline-variant/30 outline-none"
          >
            {allStudents.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.attendanceRate}%)
              </option>
            ))}
          </select>
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
              Verified by AI Facial Scanner
            </p>
          </div>
          <span className="text-[11px] font-semibold text-status-present">
            Full physical presence recorded
          </span>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/30 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-on-surface-variant">Quick Actions</span>
            <span className="material-symbols-outlined text-secondary text-[22px]">bolt</span>
          </div>
          <div className="flex flex-col gap-2 my-1">
            <button
              onClick={onOpenCheckInModal}
              className="w-full py-2 px-3 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary-container transition-all flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">camera</span>
              <span>Test Facial Check-In</span>
            </button>
            <button
              onClick={() => setLeaveModalOpen(true)}
              className="w-full py-2 px-3 bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">edit_calendar</span>
              <span>Submit Leave Request</span>
            </button>
          </div>
        </div>
      </div>

      {/* Courses Breakdown */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-outline-variant/30 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-on-surface">Enrolled Course Attendance</h2>
          <span className="text-xs text-on-surface-variant font-medium">Fall 2025 Term</span>
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
                38 of 40 lectures attended • Last verified: Today 10:00 AM
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
                32 of 36 lectures attended • Last verified: Oct 22
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
                19 of 20 labs attended • Last verified: Oct 23
              </p>
            </div>
            <span className="text-base font-bold text-status-present tabular-nums">
              95.0%
            </span>
          </div>
        </div>
      </div>

      {/* Leave Request Modal */}
      {leaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-surface-container-lowest rounded-2xl w-full max-w-md p-6 space-y-4 border border-outline-variant/30 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container-high">
              <h3 className="text-base font-bold text-on-surface">Submit Absence Excuse / Leave</h3>
              <button 
                onClick={() => setLeaveModalOpen(false)}
                className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {submittedLeave ? (
              <div className="p-4 rounded-xl bg-status-present/10 text-status-present text-center space-y-2">
                <span className="material-symbols-outlined text-4xl">task_alt</span>
                <p className="text-sm font-bold">Leave Request Submitted</p>
                <p className="text-xs text-on-surface-variant">Sent to Prof. Alan Turing and Academic Mentor for review.</p>
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
                  <label className="text-xs font-semibold text-on-surface-variant">Absence Date</label>
                  <input
                    type="date"
                    required
                    value={leaveDate}
                    onChange={(e) => setLeaveDate(e.target.value)}
                    className="p-2.5 rounded-xl bg-surface-container-low text-xs border border-outline-variant/20 outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-on-surface-variant">Reason for Absence</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="e.g. Medical emergency, university tech fest hackathon..."
                    value={leaveReason}
                    onChange={(e) => setLeaveReason(e.target.value)}
                    className="p-2.5 rounded-xl bg-surface-container-low text-xs border border-outline-variant/20 outline-none resize-none"
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
