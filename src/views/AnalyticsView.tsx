import React, { useState } from 'react';
import { Student } from '../types';
import { useLiveClock } from '../hooks/useLiveClock';

interface AnalyticsViewProps {
  onSendMessage: (student: Student) => void;
  onOpenExportModal: () => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  onSendMessage,
  onOpenExportModal
}) => {
  const liveClock = useLiveClock();
  const [isComparing, setIsComparing] = useState(false);
  const [selectedCohort, setSelectedCohort] = useState('CS-301: Data Structures & Algorithms - Sec A');
  const [selectedWeek, setSelectedWeek] = useState(liveClock.weekRangeText);
  const [hoveredDay, setHoveredDay] = useState<string | null>('Thu');

  // Automatic current telemetry window calculation
  const now = new Date();
  const currentDay = now.getDay();
  const monDate = new Date(now);
  monDate.setDate(now.getDate() - (currentDay === 0 ? 6 : currentDay - 1));
  const friDate = new Date(monDate);
  friDate.setDate(monDate.getDate() + 4);

  const formatShort = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const activeWindowText = `${formatShort(monDate)} – ${formatShort(friDate)}, ${now.getFullYear()}`;
  
  const month = now.getMonth();
  const year = now.getFullYear();
  const currentSemester = (month >= 7 && month <= 11) ? `Fall ${year}` : (month <= 4) ? `Spring ${year}` : `Summer ${year}`;

  const atRiskStudents: Student[] = [
    {
      id: 'at-1',
      name: 'Marcus Brody',
      usn: '1BM22EC042',
      email: 'marcus.brody@autodence.edu',
      department: 'ECE',
      semester: '4th Sem',
      avatar: '',
      attendanceRate: 68.0,
      totalPresent: 8,
      totalAbsent: 4,
      isAtRisk: true,
      status: 'absent'
    },
    {
      id: 'at-2',
      name: 'Leo Vance',
      usn: '1BM22EC058',
      email: 'leo.vance@autodence.edu',
      department: 'ECE',
      semester: '4th Sem',
      avatar: '',
      attendanceRate: 64.0,
      totalPresent: 7,
      totalAbsent: 5,
      isAtRisk: true,
      status: 'absent'
    },
    {
      id: 'at-3',
      name: 'Sana Khan',
      usn: '1BM22EC089',
      email: 'sana.khan@autodence.edu',
      department: 'ECE',
      semester: '4th Sem',
      avatar: '',
      attendanceRate: 72.0,
      totalPresent: 9,
      totalAbsent: 3,
      isAtRisk: true,
      status: 'absent'
    },
    {
      id: 'at-4',
      name: 'Devraj Roy',
      usn: '1BM22EC031',
      email: 'devraj.roy@autodence.edu',
      department: 'ECE',
      semester: '4th Sem',
      avatar: '',
      attendanceRate: 73.5,
      totalPresent: 9,
      totalAbsent: 3,
      isAtRisk: true,
      status: 'absent'
    }
  ];

  return (
    <div className="flex flex-col w-full gap-6 pb-20">
      {/* Header & Context Actions */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-primary text-xs font-bold uppercase tracking-wider mb-1">
            <span className="material-symbols-outlined text-[16px]">insights</span>
            <span>Telemetry & Cohort Diagnostics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-surface">
            Weekly Attendance Analytics
          </h1>
          <p className="text-sm text-on-surface-variant mt-0.5">
            Class-wide trends, session drop-offs, and subject-level performance metrics
          </p>
        </div>

        {/* Quick Action Toolbelt */}
        <div className="flex items-center gap-3 flex-wrap">
          <button 
            onClick={() => setIsComparing(!isComparing)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xs transition-all border border-outline-variant/30 ${
              isComparing 
                ? 'bg-primary text-white' 
                : 'bg-surface-container-lowest hover:bg-surface-container text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">compare_arrows</span>
            <span>{isComparing ? 'Comparing Active' : 'Compare vs Prev Week'}</span>
          </button>

          <button 
            onClick={onOpenExportModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-container text-white rounded-xl shadow-xs text-xs font-semibold transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Export Analytics</span>
          </button>
        </div>
      </div>

      {/* Interactive Filter Matrix Bar */}
      <div className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 shadow-xs border border-outline-variant/30">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-center">
          {/* Class Cohort */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">school</span>
              <span>Class Cohort</span>
            </label>
            <div className="relative">
              <select 
                value={selectedCohort}
                onChange={(e) => setSelectedCohort(e.target.value)}
                className="w-full bg-surface-container-low text-on-surface text-xs font-medium rounded-xl py-2.5 pl-3 pr-8 appearance-none focus:outline-none focus:bg-surface-container border border-outline-variant/20 cursor-pointer"
              >
                <option value="CS-301: Data Structures & Algorithms - Sec A">CS-301: Data Structures & Algorithms - Sec A</option>
                <option value="CS-304: Database Management Systems - Sec B">CS-304: Database Management Systems - Sec B</option>
                <option value="CS-307: Advanced Algorithmics Lab - Batch A1">CS-307: Advanced Algorithmics Lab - Batch A1</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-on-surface-variant pointer-events-none text-[20px]">
                expand_more
              </span>
            </div>
          </div>

          {/* Term / Cycle */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">event_note</span>
              <span>Term / Cycle</span>
            </label>
            <div className="relative">
              <select className="w-full bg-surface-container-low text-on-surface text-xs font-medium rounded-xl py-2.5 pl-3 pr-8 appearance-none focus:outline-none focus:bg-surface-container border border-outline-variant/20 cursor-pointer">
                <option>{currentSemester} • 6th Semester (UG)</option>
                <option>Previous Semester (Archived)</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-on-surface-variant pointer-events-none text-[20px]">
                expand_more
              </span>
            </div>
          </div>

          {/* Academic Week */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">view_week</span>
              <span>Academic Week</span>
            </label>
            <div className="relative">
              <select 
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(e.target.value)}
                className="w-full bg-surface-container-low text-on-surface text-xs font-medium rounded-xl py-2.5 pl-3 pr-8 appearance-none focus:outline-none focus:bg-surface-container border border-outline-variant/20 cursor-pointer"
              >
                <option value="Current Academic Week">Current Academic Week ({formatShort(monDate)} - {formatShort(friDate)})</option>
                <option value="Week 8">Week 8</option>
                <option value="Week 7">Week 7</option>
                <option value="Week 6">Week 6</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-on-surface-variant pointer-events-none text-[20px]">
                expand_more
              </span>
            </div>
          </div>

          {/* Date Range Telemetry Window */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">date_range</span>
              <span>Active Telemetry Window</span>
            </label>
            <div className="flex items-center justify-between bg-surface-container-low text-on-surface text-xs px-3.5 py-2.5 rounded-xl border border-outline-variant/20">
              <span className="font-semibold">{activeWindowText}</span>
              <span className="bg-primary/10 text-primary font-bold text-[11px] px-2 py-0.5 rounded">
                Active Sync
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Metric Deck */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-xs border border-outline-variant/30 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-on-surface-variant font-semibold">Weekly Average Attendance</span>
            <span className="p-1.5 rounded-lg bg-primary-fixed text-on-primary-fixed">
              <span className="material-symbols-outlined text-[18px]">query_stats</span>
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-on-surface tracking-tight tabular-nums">91.4%</span>
            <span className="inline-flex items-center text-xs font-bold text-status-present bg-status-present/10 px-2 py-0.5 rounded-full">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              <span>+3.2%</span>
            </span>
          </div>
          <p className="text-xs text-on-surface-variant mt-2 flex items-center gap-1">
            <span>Target benchmark:</span>
            <span className="font-semibold text-on-surface">75.0% minimum</span>
          </p>
        </div>

        {/* KPI 2 */}
        <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-xs border border-outline-variant/30 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-on-surface-variant font-semibold">Total Sessions Conducted</span>
            <span className="p-1.5 rounded-lg bg-surface-container text-on-surface-variant">
              <span className="material-symbols-outlined text-[18px]">co_present</span>
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-on-surface tracking-tight">12 Lectures</span>
          </div>
          <p className="text-xs text-status-present mt-2 flex items-center gap-1 font-semibold">
            <span className="material-symbols-outlined text-[14px]">check_circle</span>
            <span>100% of scheduled syllabus completed</span>
          </p>
        </div>

        {/* KPI 3 */}
        <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-xs border border-outline-variant/30 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-on-surface-variant font-semibold">Highest Attended Session</span>
            <span className="p-1.5 rounded-lg bg-secondary-fixed text-on-secondary-fixed">
              <span className="material-symbols-outlined text-[18px]">verified</span>
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-primary tracking-tight tabular-nums">96.8%</span>
            <span className="text-xs text-on-surface-variant font-medium">present</span>
          </div>
          <p className="text-xs text-on-surface-variant mt-2 truncate">
            <span className="font-semibold text-on-surface">CS-301 Lec #42</span> • Thursday 10:00 AM
          </p>
        </div>

        {/* KPI 4 */}
        <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-xs border border-outline-variant/30 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-on-surface-variant font-semibold">At-Risk Flagged Students</span>
            <span className="p-1.5 rounded-lg bg-status-pending/20 text-tertiary">
              <span className="material-symbols-outlined text-[18px]">warning</span>
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-status-pending tracking-tight">4 Students</span>
          </div>
          <p className="text-xs text-on-surface-variant mt-2 flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-status-absent" />
            <span>Tracking below the 75% baseline</span>
          </p>
        </div>
      </div>

      {/* Primary Analytics Grid: 8 Cols Left, 4 Cols Right */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: 8 Cols */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          {/* Daily Attendance Trend Chart Card */}
          <div className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 shadow-xs border border-outline-variant/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-on-surface">
                    Daily Attendance Trend
                  </h2>
                  <span className="text-[11px] font-semibold bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">
                    Mon – Fri Telemetry
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Automated high-speed camera verification count per daily session
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs text-on-surface-variant">
                <div className="flex items-center gap-1.5 font-semibold">
                  <span className="w-3 h-3 rounded-sm bg-primary" />
                  <span>Present Count</span>
                </div>
                <div className="flex items-center gap-1.5 font-semibold">
                  <span className="w-3 h-3 rounded-sm bg-surface-container-high" />
                  <span>Absent Count</span>
                </div>
              </div>
            </div>

            {/* SVG Composite Chart */}
            <div className="relative w-full pt-4">
              {/* Tooltip on Thursday Peak */}
              {hoveredDay === 'Thu' && (
                <div className="absolute top-2 right-[24%] z-10 bg-inverse-surface text-inverse-on-surface px-3 py-2 rounded-xl shadow-xl flex flex-col gap-0.5 border border-white/10 animate-in fade-in duration-150">
                  <p className="text-xs font-bold flex items-center gap-1.5 text-white">
                    <span className="w-2 h-2 rounded-full bg-status-present" />
                    <span>Thu, Oct 24 • 96.8%</span>
                  </p>
                  <p className="text-[11px] text-[#c1c6d5]">Present: 60 / Absent: 2</p>
                </div>
              )}

              <div className="w-full h-64">
                <svg className="w-full h-full overflow-visible" fill="none" viewBox="0 0 650 220" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="40" y1="20" x2="640" y2="20" stroke="#edeeef" strokeWidth="1" strokeDasharray="3 3" />
                  <text x="30" y="24" fill="#727784" textAnchor="end" className="text-[11px]">100%</text>

                  <line x1="40" y1="70" x2="640" y2="70" stroke="#edeeef" strokeWidth="1" strokeDasharray="3 3" />
                  <text x="30" y="74" fill="#727784" textAnchor="end" className="text-[11px]">85%</text>

                  {/* 75% Safe Threshold Line */}
                  <line x1="40" y1="110" x2="640" y2="110" stroke="#FF9F1C" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.8" />
                  <text x="30" y="114" fill="#FF9F1C" textAnchor="end" className="text-[11px] font-semibold">75% (Min)</text>

                  <line x1="40" y1="160" x2="640" y2="160" stroke="#edeeef" strokeWidth="1" strokeDasharray="3 3" />
                  <text x="30" y="164" fill="#727784" textAnchor="end" className="text-[11px]">60%</text>

                  {/* Mon Bars (X: 75) */}
                  <rect x="75" y="42" width="36" height="138" rx="4" fill="#e7e8e9" />
                  <rect x="75" y="55" width="36" height="125" rx="4" fill="#005ab4" />

                  {/* Tue Bars (X: 195) */}
                  <rect x="195" y="42" width="36" height="138" rx="4" fill="#e7e8e9" />
                  <rect x="195" y="66" width="36" height="114" rx="4" fill="#005ab4" />

                  {/* Wed Bars (X: 315) */}
                  <rect x="315" y="42" width="36" height="138" rx="4" fill="#e7e8e9" />
                  <rect x="315" y="49" width="36" height="131" rx="4" fill="#005ab4" />

                  {/* Thu Bars (X: 435) */}
                  <rect x="435" y="42" width="36" height="138" rx="4" fill="#e7e8e9" />
                  <rect x="435" y="38" width="36" height="142" rx="4" fill="#2EC4B6" />

                  {/* Fri Bars (X: 555) */}
                  <rect x="555" y="42" width="36" height="138" rx="4" fill="#e7e8e9" />
                  <rect x="555" y="80" width="36" height="100" rx="4" fill="#005ab4" />

                  {/* Spline curve */}
                  <path d="M 93 55 Q 150 63 213 66 T 333 49 T 453 38 T 573 80" fill="none" stroke="#005ab4" strokeWidth="3" strokeLinecap="round" />

                  {/* Spline node points */}
                  <circle cx="93" cy="55" r="4.5" fill="#ffffff" stroke="#005ab4" strokeWidth="2.5" />
                  <circle cx="213" cy="66" r="4.5" fill="#ffffff" stroke="#005ab4" strokeWidth="2.5" />
                  <circle cx="333" cy="49" r="4.5" fill="#ffffff" stroke="#005ab4" strokeWidth="2.5" />
                  <circle cx="453" cy="38" r="5" fill="#2EC4B6" stroke="#ffffff" strokeWidth="2" />
                  <circle cx="573" cy="80" r="4.5" fill="#ffffff" stroke="#005ab4" strokeWidth="2.5" />
                </svg>
              </div>

              {/* Bottom Axis Labels */}
              <div className="grid grid-cols-5 text-center pt-3 pl-8 text-xs text-on-surface">
                <div onMouseEnter={() => setHoveredDay('Mon')} className="cursor-pointer">
                  <p className="font-semibold">Mon</p>
                  <p className="text-[11px] text-on-surface-variant">Oct 21 • 92.0%</p>
                </div>
                <div onMouseEnter={() => setHoveredDay('Tue')} className="cursor-pointer">
                  <p className="font-semibold">Tue</p>
                  <p className="text-[11px] text-on-surface-variant">Oct 22 • 89.0%</p>
                </div>
                <div onMouseEnter={() => setHoveredDay('Wed')} className="cursor-pointer">
                  <p className="font-semibold">Wed</p>
                  <p className="text-[11px] text-on-surface-variant">Oct 23 • 94.0%</p>
                </div>
                <div onMouseEnter={() => setHoveredDay('Thu')} className="cursor-pointer">
                  <p className="font-bold text-status-present">Thu (Peak)</p>
                  <p className="text-[11px] text-status-present font-semibold">Oct 24 • 96.8%</p>
                </div>
                <div onMouseEnter={() => setHoveredDay('Fri')} className="cursor-pointer">
                  <p className="font-bold text-status-absent">Fri (Drop)</p>
                  <p className="text-[11px] text-on-surface-variant">Oct 25 • 85.2%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Subject-wise Attendance Breakdown */}
          <div className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 shadow-xs border border-outline-variant/30">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-on-surface">
                  Subject-wise Attendance Breakdown
                </h2>
                <p className="text-xs text-on-surface-variant">
                  Cross-curricular attendance comparison against regulatory department targets
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-surface-container text-on-surface-variant rounded-lg">
                All Curricula Active
              </span>
            </div>

            <div className="space-y-4">
              {/* Subject 1 */}
              <div className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/20">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                    <span className="text-sm font-bold text-on-surface">CS-301: Data Structures & Algorithms</span>
                    <span className="text-xs text-on-surface-variant">(4 Lectures/wk)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-primary tabular-nums">91.4%</span>
                    <span className="text-xs text-status-present font-semibold">+16.4% above min</span>
                  </div>
                </div>
                <div className="relative w-full bg-surface-container-highest h-3 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: '91.4%' }} />
                  <div className="absolute top-0 bottom-0 left-[75%] w-0.5 bg-status-pending z-10" />
                </div>
                <div className="flex justify-between items-center mt-1.5 text-xs text-on-surface-variant">
                  <span>57 of 62 Avg Enrolled Present</span>
                  <span className="text-status-pending font-semibold">Benchmark: 75.0%</span>
                </div>
              </div>

              {/* Subject 2 */}
              <div className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/20">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
                    <span className="text-sm font-bold text-on-surface">CS-304: Database Management Systems</span>
                    <span className="text-xs text-on-surface-variant">(4 Lectures/wk)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-on-surface tabular-nums">88.0%</span>
                    <span className="text-xs text-status-present font-semibold">+13.0% above min</span>
                  </div>
                </div>
                <div className="relative w-full bg-surface-container-highest h-3 rounded-full overflow-hidden">
                  <div className="h-full bg-secondary rounded-full transition-all duration-500" style={{ width: '88%' }} />
                  <div className="absolute top-0 bottom-0 left-[75%] w-0.5 bg-status-pending z-10" />
                </div>
                <div className="flex justify-between items-center mt-1.5 text-xs text-on-surface-variant">
                  <span>55 of 62 Avg Enrolled Present</span>
                  <span className="text-status-pending font-semibold">Benchmark: 75.0%</span>
                </div>
              </div>

              {/* Subject 3 */}
              <div className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/20">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-status-present" />
                    <span className="text-sm font-bold text-on-surface">CS-307: Advanced Algorithmics Laboratory</span>
                    <span className="text-xs text-on-surface-variant">(4 Practical slots/wk)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-status-present tabular-nums">95.5%</span>
                    <span className="text-xs text-status-present font-semibold">+20.5% above min</span>
                  </div>
                </div>
                <div className="relative w-full bg-surface-container-highest h-3 rounded-full overflow-hidden">
                  <div className="h-full bg-status-present rounded-full transition-all duration-500" style={{ width: '95.5%' }} />
                  <div className="absolute top-0 bottom-0 left-[75%] w-0.5 bg-status-pending z-10" />
                </div>
                <div className="flex justify-between items-center mt-1.5 text-xs text-on-surface-variant">
                  <span>59 of 62 Avg Enrolled Present</span>
                  <span className="text-status-pending font-semibold">Benchmark: 75.0%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Session-by-Session Heatmap */}
          <div className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 shadow-xs border border-outline-variant/30">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-on-surface">
                  Session-by-Session Granular Heatmap
                </h2>
                <p className="text-xs text-on-surface-variant">
                  Time-slot diagnostic logs verified via spatial camera recognition
                </p>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-on-surface-variant font-medium">
                <span className="inline-block w-2.5 h-2.5 rounded-sm bg-status-present" /> &gt;95%
                <span className="inline-block w-2.5 h-2.5 rounded-sm bg-primary" /> 90-95%
                <span className="inline-block w-2.5 h-2.5 rounded-sm bg-status-pending" /> 85-90%
                <span className="inline-block w-2.5 h-2.5 rounded-sm bg-status-absent" /> &lt;85%
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {/* Mon Slot */}
              <div className="bg-surface-container-low rounded-xl p-3 flex flex-col justify-between hover:bg-surface-container transition-all border border-outline-variant/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-on-surface">Mon</span>
                  <span className="text-[11px] text-on-surface-variant">10:00 AM</span>
                </div>
                <div className="my-2">
                  <p className="text-lg font-bold text-primary tabular-nums">92.0%</p>
                  <p className="text-[11px] text-on-surface-variant truncate">57 / 62 In-Seats</p>
                </div>
                <div className="w-full bg-primary h-1.5 rounded-full" />
                <span className="mt-2 text-[10px] font-semibold text-on-surface-variant">CS-301 Lec #39</span>
              </div>

              {/* Tue Slot */}
              <div className="bg-surface-container-low rounded-xl p-3 flex flex-col justify-between hover:bg-surface-container transition-all border border-outline-variant/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-on-surface">Tue</span>
                  <span className="text-[11px] text-on-surface-variant">11:30 AM</span>
                </div>
                <div className="my-2">
                  <p className="text-lg font-bold text-on-surface tabular-nums">89.0%</p>
                  <p className="text-[11px] text-on-surface-variant truncate">55 / 62 In-Seats</p>
                </div>
                <div className="w-full bg-status-pending h-1.5 rounded-full" />
                <span className="mt-2 text-[10px] font-semibold text-on-surface-variant">CS-304 Lec #28</span>
              </div>

              {/* Wed Slot */}
              <div className="bg-surface-container-low rounded-xl p-3 flex flex-col justify-between hover:bg-surface-container transition-all border border-outline-variant/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-on-surface">Wed</span>
                  <span className="text-[11px] text-on-surface-variant">10:00 AM</span>
                </div>
                <div className="my-2">
                  <p className="text-lg font-bold text-primary tabular-nums">94.0%</p>
                  <p className="text-[11px] text-on-surface-variant truncate">58 / 62 In-Seats</p>
                </div>
                <div className="w-full bg-primary h-1.5 rounded-full" />
                <span className="mt-2 text-[10px] font-semibold text-on-surface-variant">CS-301 Lec #40</span>
              </div>

              {/* Thu Slot */}
              <div className="bg-surface-container-low rounded-xl p-3 flex flex-col justify-between hover:bg-surface-container transition-all border border-outline-variant/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-status-present">Thu</span>
                  <span className="text-[11px] text-status-present font-semibold">10:00 AM</span>
                </div>
                <div className="my-2">
                  <p className="text-lg font-bold text-status-present tabular-nums">96.8%</p>
                  <p className="text-[11px] text-on-surface-variant truncate">60 / 62 In-Seats</p>
                </div>
                <div className="w-full bg-status-present h-1.5 rounded-full" />
                <span className="mt-2 text-[10px] font-bold text-status-present truncate">CS-301 #41 (Peak)</span>
              </div>

              {/* Fri Slot */}
              <div className="bg-surface-container-low rounded-xl p-3 flex flex-col justify-between hover:bg-surface-container transition-all border border-outline-variant/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-status-absent">Fri</span>
                  <span className="text-[11px] text-on-surface-variant">02:00 PM</span>
                </div>
                <div className="my-2">
                  <p className="text-lg font-bold text-status-absent tabular-nums">85.2%</p>
                  <p className="text-[11px] text-on-surface-variant truncate">52 / 62 In-Seats</p>
                </div>
                <div className="w-full bg-status-absent h-1.5 rounded-full" />
                <span className="mt-2 text-[10px] font-semibold text-status-absent truncate">CS-307 Lab #16 (Dip)</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: 4 Cols */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          {/* Low Attendance Monitoring Card */}
          <div className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 shadow-xs border border-outline-variant/30">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-status-absent text-[22px]">
                  emergency_home
                </span>
                <h2 className="text-base sm:text-lg font-bold text-on-surface">Low Attendance</h2>
              </div>
              <span className="bg-status-absent/10 text-status-absent text-xs px-2.5 py-0.5 rounded-full font-bold">
                &lt; 75% Critical
              </span>
            </div>
            <p className="text-xs text-on-surface-variant mb-4">
              Students below mandatory university attendance threshold for Week 8
            </p>

            {/* Students List */}
            <div className="space-y-3">
              {atRiskStudents.map((student) => (
                <div key={student.id} className="p-3 bg-surface-container-low rounded-xl flex flex-col gap-2 border border-outline-variant/20">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-status-absent/15 text-status-absent flex items-center justify-center font-bold text-xs">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-on-surface leading-tight">
                          {student.name}
                        </h4>
                        <p className="text-[11px] text-on-surface-variant font-mono">
                          USN: {student.usn}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-bold text-status-absent leading-none tabular-nums">
                        {student.attendanceRate}%
                      </span>
                      <p className="text-[11px] text-on-surface-variant">
                        {student.totalPresent}/12 sessions
                      </p>
                    </div>
                  </div>

                  <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-status-absent h-full rounded-full" 
                      style={{ width: `${student.attendanceRate}%` }} 
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-status-pending flex items-center gap-1 font-semibold">
                      <span className="material-symbols-outlined text-[14px]">flag</span>
                      <span>Needs {Math.ceil((75 - student.attendanceRate) / 2)} consecutive classes</span>
                    </span>
                    <button 
                      onClick={() => onSendMessage(student)}
                      className="text-primary hover:text-primary-container p-1 rounded transition-colors"
                      title="Send Notice"
                    >
                      <span className="material-symbols-outlined text-[18px]">outgoing_mail</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Interventions */}
            <div className="mt-4 pt-3 border-t border-outline-variant/20 space-y-2">
              <button 
                onClick={() => onSendMessage(atRiskStudents[0])}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-status-absent hover:opacity-90 text-white text-xs font-semibold rounded-xl shadow-xs transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
                <span>Send Automated Slack / SMS Reminder</span>
              </button>
              <button 
                onClick={onOpenExportModal}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-semibold rounded-xl transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">assignment_late</span>
                <span>Generate Official At-Risk Dean Report</span>
              </button>
            </div>
          </div>

          {/* Pattern Insight Card */}
          <div className="bg-gradient-to-br from-surface-container-lowest to-surface-container-low rounded-2xl p-5 sm:p-6 shadow-xs border border-outline-variant/30 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-3">
              <span className="p-1.5 rounded-lg bg-status-pending/20 text-tertiary">
                <span className="material-symbols-outlined text-[20px]">lightbulb</span>
              </span>
              <h3 className="text-base font-bold text-on-surface">Pattern Insight</h3>
            </div>

            <div className="bg-tertiary-fixed/30 p-3.5 rounded-xl mb-3 border border-tertiary-fixed/40">
              <p className="text-xs text-on-tertiary-fixed font-bold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-tertiary text-[18px]">south_east</span>
                <span>Friday Afternoon Drop Alert</span>
              </p>
              <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                Friday afternoon lectures show an <strong className="text-on-surface">11.2% dip</strong> compared to midweek averages. Peak engagement persists on Thursday morning cohorts.
              </p>
            </div>

            <div className="space-y-2 pt-1 text-xs text-on-surface-variant">
              <div className="flex items-center justify-between py-1 border-b border-outline-variant/20">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-primary">schedule</span>
                  <span>Optimal Session Window:</span>
                </span>
                <span className="font-semibold text-on-surface">Thu 10:00 - 11:00 AM</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-status-absent">timer_off</span>
                  <span>Severe Lateness Frequency:</span>
                </span>
                <span className="font-semibold text-on-surface">Mon 08:30 AM (9 flagged)</span>
              </div>
            </div>
          </div>

          {/* Autodence AI Sensor Node */}
          <div className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 shadow-xs border border-outline-variant/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[22px]">face_retouching_natural</span>
              </div>
              <div>
                <p className="text-xs font-bold text-on-surface">Autodence AI Sensor Node</p>
                <p className="text-[11px] text-status-present flex items-center gap-1 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-status-present" />
                  <span>99.82% Optical Precision</span>
                </p>
              </div>
            </div>
            <span className="text-[11px] font-semibold bg-surface-container text-on-surface-variant px-2.5 py-1 rounded-lg">
              L-302 Cam
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
