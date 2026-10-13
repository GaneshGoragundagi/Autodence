import React, { useState } from 'react';
import { Student } from '../../types';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newStudent: Student) => void;
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({
  isOpen,
  onClose,
  onAdd
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [usn, setUsn] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('CSE');
  const [semester, setSemester] = useState('6th Sem');
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newStudent: Student = {
      id: `s-${Date.now()}`,
      name: name || 'New Student',
      usn: usn || `1BM23CS${Math.floor(100 + Math.random() * 900)}`,
      email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@autodence.edu`,
      department,
      semester,
      avatar,
      attendanceRate: 100,
      totalPresent: 1,
      totalAbsent: 0,
      isAtRisk: false,
      status: 'present',
      confidenceScore: 97,
      lastSeen: 'Just Enrolled'
    };

    onAdd(newStudent);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-surface-container-lowest rounded-2xl w-full max-w-md shadow-2xl border border-outline-variant/30 p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-surface-container-high">
          <div>
            <h3 className="text-lg font-bold text-on-surface">Enroll New Student</h3>
            <p className="text-xs text-on-surface-variant">Register student for biometric AI attendance tracking</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-4 p-3 rounded-xl bg-surface-container-low border border-outline-variant/20">
            <img 
              src={avatar} 
              alt="Student Avatar Preview" 
              className="w-14 h-14 rounded-full object-cover ring-2 ring-primary/20"
            />
            <div className="flex-1">
              <span className="text-xs font-semibold text-on-surface">Biometric Headshot</span>
              <p className="text-[11px] text-on-surface-variant">Default facial embedding active</p>
              <button
                type="button"
                onClick={() => {
                  const demoAvatars = [
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuDp-oIxFcLF60HOUylIJQ4LsOC0Yp1XKzpHoUHjo9NK8omz5jmA43Njgi6G34NtO4kkpTPgbI0f0jm2buOP48VH7GVC-6Jx_zYceJG1flnyrJ8YPyaBOBFTVO1bxQLlNaIlKv2qJRubEZlTRV_QokNxhlxOZ8KF6Ex-doP-34sQSNZKoJt3uNk0EKgHwC8-C0YCpiD4ctfHHQVGttYh7q1fT0Ym5H4t9cPfj5vztIf5BkwJnB5zKDu5KA',
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuCJ1uDO7UqjbtNAvwgpwIBUhalBGs4_pRAZ-Tpmjnj94AdwC5CBORIhrN295uvJfJVWx7HFssamWNlf2q9DGWDLCv6KileIcQIcdu55tw65fRVoG5_N6z2F1FTGbfQdzEFg4iUhuNx8J_89XfOtgIZwGWjKPSHQSVCkbNPInao3WJ5va1MDSIqfoTrs3VCWRonsYZSKy2lrxlMyDyzow0T2ZmJepWLuffNF1hbFiDJ_QJoXMDhNHSwICA',
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuCcY6B9tfpwmXDQWVur0ue_GikD-Oc16XgSs6nJbFW9IBlPYMiqJQnTGsvEIidhBODbMXS4dS18D5wYQ-3_U7ThiWFcqTqxgMah2oMvxSXYzIXRYUM6fkJVxrOEUdnb-jdBcdeMBhUuH2SVvp0kpM0gezQf3N20_f32WfHv-W7ulPf5X4HMpAEtTu4STg8oEnxud_LRhLu8WR3dHUjodv6MuvHZTCLEpRbQ32C1PvR1vnvOlg-kVEzBtw'
                  ];
                  const nextIdx = Math.floor(Math.random() * demoAvatars.length);
                  setAvatar(demoAvatars[nextIdx]);
                }}
                className="text-[11px] text-primary hover:underline font-semibold mt-1 inline-block"
              >
                Shuffle Demo Photo
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-on-surface-variant">Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Maya Lin"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-sm border-0 focus:ring-2 focus:ring-primary outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-on-surface-variant">USN / Roll Number</label>
              <input
                type="text"
                required
                placeholder="1BM22CS099"
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
              placeholder="student@autodence.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-sm border-0 focus:ring-2 focus:ring-primary outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-on-surface-variant">Semester</label>
            <input
              type="text"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-sm border-0 focus:ring-2 focus:ring-primary outline-none"
            />
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
              className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-container shadow-sm transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">person_add</span>
              <span>Register & Enroll</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
