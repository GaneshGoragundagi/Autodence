import React from 'react';
import { Course } from '../types';

interface SemesterReportsViewProps {
  courses: Course[];
  onExportReport: () => void;
}

export const SemesterReportsView: React.FC<SemesterReportsViewProps> = ({
  courses,
  onExportReport
}) => {
  return (
    <div className="flex flex-col w-full gap-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-surface">
            Semester Reports & Accreditation Audits
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant">
            Official University compliance summaries, attendance eligibility, and dean debarment registers
          </p>
        </div>

        <button 
          onClick={onExportReport}
          className="bg-primary hover:bg-primary-container text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xs flex items-center gap-2 self-start sm:self-auto transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">file_download</span>
          <span>Download Dean's Certified PDF</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 space-y-1">
          <span className="text-xs text-on-surface-variant font-semibold">Total Classes Tracked</span>
          <p className="text-3xl font-bold text-on-surface tabular-nums">128</p>
          <p className="text-xs text-status-present font-medium">100% Biometric Verification Rate</p>
        </div>

        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 space-y-1">
          <span className="text-xs text-on-surface-variant font-semibold">Debarment Flagged Students</span>
          <p className="text-3xl font-bold text-status-absent tabular-nums">4</p>
          <p className="text-xs text-status-absent font-medium">Tracking below mandatory 75% cutoff</p>
        </div>

        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 space-y-1">
          <span className="text-xs text-on-surface-variant font-semibold">Academic Integrity Index</span>
          <p className="text-3xl font-bold text-primary tabular-nums">99.8%</p>
          <p className="text-xs text-on-surface-variant font-medium">Anti-spoofing liveness verified</p>
        </div>
      </div>

      {/* Courses summary */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-outline-variant/30 space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-on-surface">Course-by-Course Compliance Register</h2>
        <div className="space-y-3">
          {courses.map((course) => (
            <div 
              key={course.id}
              className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-on-surface">{course.code}: {course.name}</span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-primary-fixed text-on-primary-fixed">
                    {course.section}
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Enrolled: {course.enrolledStudents} students • Faculty: Prof. Alan Turing • Minimum Threshold: 75%
                </p>
              </div>

              <div className="flex items-center gap-4 self-end sm:self-center">
                <span className="text-base font-bold text-status-present tabular-nums">
                  {course.attendanceAvg}% Avg
                </span>
                <button
                  onClick={onExportReport}
                  className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-colors"
                >
                  Generate Audit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
