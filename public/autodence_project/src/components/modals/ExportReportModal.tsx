import React, { useState } from 'react';
import { Course } from '../../types';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: 'csv' | 'pdf') => void;
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  isOpen,
  onClose,
  onExport
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-surface-container-lowest rounded-2xl w-full max-w-md shadow-2xl border border-outline-variant/30 p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-surface-container-high">
          <div>
            <h3 className="text-lg font-bold text-on-surface">Export Attendance Report</h3>
            <p className="text-xs text-on-surface-variant">Class Cohort: CS-301 • Week 8 Telemetry</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => {
              onExport('csv');
              onClose();
            }}
            className="w-full p-4 rounded-xl border border-outline-variant/40 hover:border-primary hover:bg-primary/5 transition-all text-left flex items-start gap-3.5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-status-present/15 text-status-present flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">table_view</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                Export as CSV (Raw Data)
              </h4>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Full student logs, session timestamps, and AI facial recognition match scores for spreadsheet analysis.
              </p>
            </div>
          </button>

          <button
            onClick={() => {
              onExport('pdf');
              onClose();
            }}
            className="w-full p-4 rounded-xl border border-outline-variant/40 hover:border-primary hover:bg-primary/5 transition-all text-left flex items-start gap-3.5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-status-absent/15 text-status-absent flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">picture_as_pdf</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                Formal Dean's PDF Audit Report
              </h4>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Formatted academic compliance certificate with SHA-256 digital signature and student debarment warning list.
              </p>
            </div>
          </button>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-on-surface-variant hover:bg-surface-container"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCourse: (newCourse: Course) => void;
}

export const CourseModal: React.FC<CourseModalProps> = ({
  isOpen,
  onClose,
  onAddCourse
}) => {
  if (!isOpen) return null;

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState<'Lecture' | 'Lab' | 'Hands-on'>('Lecture');
  const [room, setRoom] = useState('Room 304B');
  const [enrolledStudents, setEnrolledStudents] = useState(60);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCourse({
      id: `c-${Date.now()}`,
      code: code || 'CS-310',
      name: name || 'Applied Machine Learning',
      type,
      room,
      enrolledStudents,
      semester: 'Semester 6',
      section: 'Sec A',
      attendanceAvg: 90.0
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-surface-container-lowest rounded-2xl w-full max-w-md shadow-2xl border border-outline-variant/30 p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-surface-container-high">
          <h3 className="text-lg font-bold text-on-surface">Request Course Assignment</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-on-surface-variant">Course Code</label>
              <input
                type="text"
                required
                placeholder="e.g. CS-310"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-sm border-0 focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-on-surface-variant">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-sm border-0 focus:ring-2 focus:ring-primary outline-none"
              >
                <option value="Lecture">Lecture</option>
                <option value="Lab">Lab</option>
                <option value="Hands-on">Hands-on</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-on-surface-variant">Course Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Computer Networks & Security"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-sm border-0 focus:ring-2 focus:ring-primary outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-on-surface-variant">Lecture Room</label>
              <input
                type="text"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-sm border-0 focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-on-surface-variant">Enrolled Roster</label>
              <input
                type="number"
                value={enrolledStudents}
                onChange={(e) => setEnrolledStudents(parseInt(e.target.value) || 0)}
                className="px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-sm border-0 focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-on-surface-variant hover:bg-surface-container"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-container shadow-sm"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
