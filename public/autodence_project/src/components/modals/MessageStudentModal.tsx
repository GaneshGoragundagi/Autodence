import React, { useState } from 'react';
import { Student } from '../../types';

interface MessageStudentModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
  onSend: (recipient: string, message: string) => void;
}

export const MessageStudentModal: React.FC<MessageStudentModalProps> = ({
  student,
  isOpen,
  onClose,
  onSend
}) => {
  if (!isOpen || !student) return null;

  const defaultMsg = `Dear ${student.name}, your current attendance rate in CS-301 has dropped to ${student.attendanceRate}%, which is below the mandatory university threshold of 75%. Please attend upcoming consecutive lectures to avoid examination hall ticket debarment.`;
  const [message, setMessage] = useState(defaultMsg);
  const [notifyMentor, setNotifyMentor] = useState(true);
  const [channels, setChannels] = useState({
    sms: true,
    email: true,
    slack: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSend(student.name, message);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-surface-container-lowest rounded-2xl w-full max-w-md shadow-2xl border border-outline-variant/30 p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-surface-container-high">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-status-absent/15 text-status-absent flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">warning</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-on-surface">Send Attendance Warning</h3>
              <p className="text-xs text-on-surface-variant">Notice for {student.name} ({student.attendanceRate}%)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-on-surface-variant">Notice Body</label>
            <textarea
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="p-3 rounded-xl bg-surface-container-low text-on-surface text-xs leading-relaxed border-0 focus:ring-2 focus:ring-primary outline-none resize-none"
            />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-semibold text-on-surface-variant block">Dispatch Channels</span>
            <div className="grid grid-cols-3 gap-2">
              <label className="flex items-center gap-2 p-2 rounded-lg bg-surface-container-low text-xs cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={channels.sms} 
                  onChange={(e) => setChannels({...channels, sms: e.target.checked})}
                  className="rounded text-primary"
                />
                <span>SMS Alert</span>
              </label>
              <label className="flex items-center gap-2 p-2 rounded-lg bg-surface-container-low text-xs cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={channels.email} 
                  onChange={(e) => setChannels({...channels, email: e.target.checked})}
                  className="rounded text-primary"
                />
                <span>Email Digest</span>
              </label>
              <label className="flex items-center gap-2 p-2 rounded-lg bg-surface-container-low text-xs cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={channels.slack} 
                  onChange={(e) => setChannels({...channels, slack: e.target.checked})}
                  className="rounded text-primary"
                />
                <span>App Push</span>
              </label>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-surface-container-low flex items-center justify-between">
            <div className="flex flex-col pr-3">
              <span className="text-xs font-semibold text-on-surface">CC Academic Mentor & HOD</span>
              <span className="text-[11px] text-on-surface-variant">Escalate official regulatory copy</span>
            </div>
            <input 
              type="checkbox" 
              checked={notifyMentor} 
              onChange={(e) => setNotifyMentor(e.target.checked)}
              className="rounded text-primary w-4 h-4 cursor-pointer"
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
              className="px-5 py-2.5 rounded-xl bg-status-absent text-white text-xs font-semibold hover:opacity-90 shadow-sm transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">send</span>
              <span>Send Notice</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
