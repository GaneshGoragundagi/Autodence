import React, { useState } from 'react';
import { AttendanceSession } from '../types';

interface AttendanceRecordsViewProps {
  sessions: AttendanceSession[];
  onOpenSession: (session: AttendanceSession) => void;
  onLaunchNewSession: () => void;
}

export const AttendanceRecordsView: React.FC<AttendanceRecordsViewProps> = ({
  sessions,
  onOpenSession,
  onLaunchNewSession
}) => {
  const [filterCourse, setFilterCourse] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = sessions.filter(s => {
    const matchCourse = filterCourse === 'All' || s.courseCode === filterCourse;
    const matchSearch = s.title.toLowerCase().includes(search.toLowerCase()) || s.courseName.toLowerCase().includes(search.toLowerCase());
    return matchCourse && matchSearch;
  });

  return (
    <div className="flex flex-col w-full gap-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-surface">
            Attendance Records & Session Logs
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant">
            Historical biometric capture events, audit trails, and manual overrides
          </p>
        </div>

        <button 
          onClick={onLaunchNewSession}
          className="bg-primary hover:bg-primary-container text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xs flex items-center gap-2 self-start sm:self-auto transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          <span>Record New Session</span>
        </button>
      </div>

      {/* Filter and search */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[18px]">
            search
          </span>
          <input
            type="text"
            placeholder="Search by lecture name or topic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface-container-low text-xs pl-10 pr-4 py-2.5 rounded-xl border border-outline-variant/30 outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <select
          value={filterCourse}
          onChange={(e) => setFilterCourse(e.target.value)}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-surface-container-low text-xs font-semibold text-on-surface border border-outline-variant/30 outline-none"
        >
          <option value="All">All Courses</option>
          <option value="CS-301">CS-301: Data Structures</option>
          <option value="CS-304">CS-304: Database Systems</option>
          <option value="CS-307">CS-307: AI & ML Lab</option>
        </select>
      </div>

      {/* Sessions list */}
      <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-xs border border-outline-variant/30 space-y-3">
        {filtered.map((session) => (
          <div
            key={session.id}
            onClick={() => onOpenSession(session)}
            className="p-4 rounded-xl bg-surface-container-low hover:bg-surface-container flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-outline-variant/20 transition-all cursor-pointer group"
          >
            <div className="flex items-start sm:items-center gap-3.5">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                session.verifiedByAi 
                  ? 'bg-primary-fixed text-primary' 
                  : 'bg-surface-container-high text-secondary'
              }`}>
                <span className="material-symbols-outlined text-[22px]">
                  {session.verifiedByAi ? 'face' : 'edit_document'}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                    {session.title}
                  </h3>
                  <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold bg-primary-fixed text-on-primary-fixed">
                    {session.courseCode}
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  {session.date} • {session.time}
                  {session.notes && <span className="text-status-pending font-medium"> • {session.notes}</span>}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-5 border-t sm:border-t-0 pt-2 sm:pt-0 border-outline-variant/20">
              <div className="text-right">
                <span className="text-xs font-bold text-on-surface tabular-nums">
                  {session.presentCount} / {session.totalCount} Present
                </span>
                <p className="text-[11px] text-status-present font-semibold">
                  {((session.presentCount / session.totalCount) * 100).toFixed(1)}% Ratio
                </p>
              </div>

              <span className="material-symbols-outlined text-outline group-hover:text-on-surface text-[20px]">
                arrow_forward
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
