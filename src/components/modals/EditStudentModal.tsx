import React, { useState } from 'react';
import { Student } from '../../types';

interface EditStudentModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: Student) => void;
}

export const EditStudentModal: React.FC<EditStudentModalProps> = ({
  student,
  isOpen,
  onClose,
  onSave
}) => {
  if (!isOpen || !student) return null;

  const [name, setName] = useState(student.name);
  const [usn, setUsn] = useState(student.usn);
  const [email, setEmail] = useState(student.email);
  const [department, setDepartment] = useState(student.department);
  const [semester, setSemester] = useState(student.semester);
  const [attendanceRate, setAttendanceRate] = useState(student.attendanceRate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...student,
      name,
      usn,
      email,
      department,
      semester,
      attendanceRate,
      isAtRisk: attendanceRate < 75
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
          <h3 className="text-lg font-bold text-on-surface">Edit Student Record</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-on-surface-variant">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-sm border-0 focus:ring-2 focus:ring-primary outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-on-surface-variant">USN / Roll No</label>
              <input
                type="text"
                required
                value={usn}
                onChange={(e) => setUsn(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-sm border-0 focus:ring-2 focus:ring-primary outline-none font-mono"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-on-surface-variant">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-sm border-0 focus:ring-2 focus:ring-primary outline-none"
              >
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
                <option value="ME">ME</option>
                <option value="ISE">ISE</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-on-surface-variant">University Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-sm border-0 focus:ring-2 focus:ring-primary outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-on-surface-variant">Semester</label>
              <input
                type="text"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-sm border-0 focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-on-surface-variant">Attendance Rate (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={attendanceRate}
                onChange={(e) => setAttendanceRate(parseFloat(e.target.value) || 0)}
                className="px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-sm border-0 focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-on-surface-variant hover:bg-surface-container transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-container shadow-sm transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
