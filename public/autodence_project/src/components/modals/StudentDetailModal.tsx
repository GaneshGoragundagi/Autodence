import React from 'react';
import { Student } from '../../types';

interface StudentDetailModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleStatus: (studentId: string) => void;
  onEdit: (student: Student) => void;
  onSendMessage: (student: Student) => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  isOpen,
  onClose,
  onToggleStatus,
  onEdit,
  onSendMessage
}) => {
  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-surface-container-lowest rounded-2xl w-full max-w-lg shadow-2xl border border-outline-variant/30 overflow-hidden transform animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header Banner */}
        <div className="bg-gradient-to-r from-primary to-primary-container p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>

          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden ring-4 ring-white/30 shrink-0 bg-white/20">
              <img 
                src={student.avatar} 
                alt={student.name}
                className="w-full h-full object-cover"
              />
              <div 
                className={`absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full ring-2 ring-white ${
                  student.status === 'present' ? 'bg-status-present' : 'bg-status-absent'
                }`}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold">{student.name}</h3>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white">
                  {student.department} • {student.semester}
                </span>
              </div>
              <p className="text-xs text-white/80 mt-1 font-mono">
                USN: {student.usn}
              </p>
              <p className="text-xs text-white/70">
                {student.email}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-surface-container-low text-center">
              <span className="text-xs text-on-surface-variant font-medium">Overall Rate</span>
              <p className={`text-xl font-bold mt-0.5 ${
                student.attendanceRate < 75 ? 'text-status-absent' : 'text-status-present'
              }`}>
                {student.attendanceRate}%
              </p>
              <span className="text-[10px] text-on-surface-variant">
                {student.attendanceRate < 75 ? 'At Risk (< 75%)' : 'Above Target'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-surface-container-low text-center">
              <span className="text-xs text-on-surface-variant font-medium">Lectures Present</span>
              <p className="text-xl font-bold text-on-surface mt-0.5">
                {student.totalPresent}
              </p>
              <span className="text-[10px] text-status-present font-medium">Sessions</span>
            </div>

            <div className="p-3 rounded-xl bg-surface-container-low text-center">
              <span className="text-xs text-on-surface-variant font-medium">Lectures Absent</span>
              <p className="text-xl font-bold text-status-absent mt-0.5">
                {student.totalAbsent}
              </p>
              <span className="text-[10px] text-status-absent font-medium">Missed</span>
            </div>
          </div>

          {/* Biometric Telemetry */}
          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-fixed text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">face</span>
              </div>
              <div>
                <p className="text-xs font-semibold text-on-surface">AI Biometric Match Precision</p>
                <p className="text-[11px] text-on-surface-variant">
                  Latest Facial Embeddings • Confidence Score {student.confidenceScore || 95}%
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-status-present/15 text-status-present">
              Verified
            </span>
          </div>

          {/* Recent Attendance Log */}
          <div>
            <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider mb-2.5">
              Recent Session Records
            </h4>
            <div className="space-y-2">
              <div className="p-2.5 rounded-xl bg-surface-container-low flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-on-surface">Lecture #42: Binary Search Trees</p>
                  <p className="text-on-surface-variant text-[11px]">Today • 10:00 AM • Room 304B</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full font-semibold ${
                  student.status === 'present' 
                    ? 'bg-status-present/15 text-status-present'
                    : 'bg-status-absent/15 text-status-absent'
                }`}>
                  {student.status === 'present' ? 'Present (AI Scanned)' : 'Absent'}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-surface-container-low flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-on-surface">Lecture #41: AVL Tree Rotations</p>
                  <p className="text-on-surface-variant text-[11px]">Tue, Oct 22 • 10:00 AM</p>
                </div>
                <span className="px-2 py-0.5 rounded-full font-semibold bg-status-present/15 text-status-present">
                  Present (98% Conf)
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-surface-container-low flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-on-surface">Lecture #40: Hash Tables & Collisions</p>
                  <p className="text-on-surface-variant text-[11px]">Thu, Oct 17 • 10:00 AM</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full font-semibold ${
                  student.attendanceRate < 75 
                    ? 'bg-status-absent/15 text-status-absent' 
                    : 'bg-status-present/15 text-status-present'
                }`}>
                  {student.attendanceRate < 75 ? 'Absent' : 'Present'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => onToggleStatus(student.id)}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                student.status === 'present'
                  ? 'bg-status-absent/10 text-status-absent hover:bg-status-absent/20'
                  : 'bg-status-present/10 text-status-present hover:bg-status-present/20'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {student.status === 'present' ? 'cancel' : 'check_circle'}
              </span>
              <span>Mark as {student.status === 'present' ? 'Absent' : 'Present'}</span>
            </button>

            <button
              onClick={() => onSendMessage(student)}
              className="py-2.5 px-4 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">send</span>
              <span>Send Notice</span>
            </button>

            <button
              onClick={() => onEdit(student)}
              className="py-2.5 px-4 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-container transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">edit</span>
              <span>Edit</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
