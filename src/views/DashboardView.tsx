import React, { useState } from 'react';
import { ViewMode, Course, AttendanceSession } from '../types';
import { useLiveClock } from '../hooks/useLiveClock';

interface DashboardViewProps {
  onNavigate: (view: ViewMode) => void;
  onLaunchAiVision: () => void;
  onSendReminders: () => void;
  onSelectWarningList: () => void;
  courses: Course[];
  recentSessions: AttendanceSession[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onLaunchAiVision,
  onSendReminders,
  onSelectWarningList,
  courses,
  recentSessions
}) => {
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || 'c-1');
  const [trendTab, setTrendTab] = useState<'thisWeek' | 'lastWeek'>('thisWeek');
  const [showClassMenu, setShowClassMenu] = useState(false);

  const selectedCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];

  // Live auto-updating date and semester clock
  const liveClock = useLiveClock();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const todayAbbr = dayNames[liveClock.dayOfWeek];

  const trendData = trendTab === 'thisWeek' 
    ? [
        { day: 'Mon', value: 92.0, height: '82%', isToday: todayAbbr === 'Mon' },
        { day: 'Tue', value: 95.0, height: '95%', isToday: todayAbbr === 'Tue' },
        { day: 'Wed', value: 88.0, height: '78%', isToday: todayAbbr === 'Wed' },
        { day: 'Thu', value: 90.6, height: '90%', isToday: todayAbbr === 'Thu' || (liveClock.dayOfWeek !== 1 && liveClock.dayOfWeek !== 2 && liveClock.dayOfWeek !== 3 && liveClock.dayOfWeek !== 5) },
        { day: 'Fri', value: liveClock.dayOfWeek >= 5 ? 88.4 : 0, height: liveClock.dayOfWeek >= 5 ? '86%' : '10%', isToday: todayAbbr === 'Fri', isPending: liveClock.dayOfWeek < 5 }
      ]
    : [
        { day: 'Mon', value: 90.0, height: '80%', isToday: false },
        { day: 'Tue', value: 91.5, height: '83%', isToday: false },
        { day: 'Wed', value: 93.0, height: '89%', isToday: false },
        { day: 'Thu', value: 89.0, height: '79%', isToday: false },
        { day: 'Fri', value: 86.5, height: '72%', isToday: false }
      ];

  return (
    <div className="flex flex-col w-full pb-12 space-y-6">
      {/* Top Greeting & Semester Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-secondary text-xs sm:text-sm font-medium mb-1 flex-wrap">
            <span className="material-symbols-outlined text-[16px] text-primary">calendar_today</span>
            <span className="font-semibold text-on-surface">{liveClock.dateString}</span>
            <span className="mx-1">•</span>
            <span className="text-primary font-bold">{liveClock.currentSemester}</span>
            <span className="mx-1">•</span>
            <span className="font-mono text-xs bg-surface-container px-2 py-0.5 rounded text-on-surface-variant flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-status-present animate-ping" />
              {liveClock.timeString}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-surface">
            Welcome, Prof. Alan Turing
          </h1>
        </div>

        {/* Class Selector Dropdown */}
        <div className="relative self-start sm:self-auto">
          <button 
            onClick={() => setShowClassMenu(!showClassMenu)}
            className="flex items-center gap-2.5 bg-surface-container-low p-2 rounded-xl shadow-xs border border-outline-variant/30 hover:bg-surface-container transition-all"
          >
            <div className="w-9 h-9 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-xs shrink-0">
              {selectedCourse?.code.slice(0, 2) || 'CS'}
            </div>
            <div className="text-left pr-2">
              <div className="text-[11px] text-secondary font-medium">Active Class</div>
              <div className="text-xs sm:text-sm font-semibold text-on-surface flex items-center gap-1">
                <span>{selectedCourse?.code}: {selectedCourse?.name.split('&')[0]}</span>
                <span className="material-symbols-outlined text-[18px] text-secondary">
                  expand_more
                </span>
              </div>
            </div>
          </button>

          {showClassMenu && (
            <div className="absolute right-0 mt-2 w-72 bg-surface-container-lowest rounded-xl shadow-xl z-20 py-1.5 border border-outline-variant/30">
              {courses.map((course) => (
                <button
                  key={course.id}
                  onClick={() => {
                    setSelectedCourseId(course.id);
                    setShowClassMenu(false);
                  }}
                  className={`w-full px-4 py-2.5 text-left text-xs flex items-center justify-between transition-colors ${
                    course.id === selectedCourse?.id
                      ? 'bg-primary/10 text-primary font-bold'
                      : 'text-on-surface hover:bg-surface-container-low'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-semibold">{course.code}: {course.name}</span>
                    <span className="text-[11px] text-on-surface-variant">
                      {course.semester} • {course.enrolledStudents} Students
                    </span>
                  </div>
                  {course.id === selectedCourse?.id && (
                    <span className="material-symbols-outlined text-[18px]">check</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Prominent AI Quick Action Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-primary text-white p-6 sm:p-8 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="absolute -right-10 -bottom-10 w-56 h-56 rounded-full bg-primary-container/40 blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-lg space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-white/15 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md">
            <span className="material-symbols-outlined text-[14px]">face</span>
            <span>AI Vision Engine Active</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Ready for today's lecture?
          </h2>
          <p className="text-sm text-white/85 leading-relaxed">
            Launch facial recognition telemetry to automatically log lecture attendance in seconds.
          </p>
        </div>

        <button 
          onClick={onLaunchAiVision}
          className="relative z-10 bg-white text-primary hover:bg-white/95 font-semibold px-6 py-3.5 rounded-xl shadow-md flex items-center gap-2.5 transition-all transform active:scale-95 shrink-0 group"
        >
          <span className="material-symbols-outlined text-[22px] group-hover:rotate-12 transition-transform">
            camera
          </span>
          <span className="text-sm">Mark Attendance with AI</span>
        </button>
      </div>

      {/* Summary Cards Bento Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-surface-container-low rounded-2xl p-4 sm:p-5 shadow-xs border border-outline-variant/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-secondary mb-3">
            <span className="text-xs font-semibold">Registered</span>
            <span className="material-symbols-outlined text-[22px]">group</span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl text-on-surface font-bold tabular-nums">
              {selectedCourse?.enrolledStudents || 64}
            </div>
            <div className="text-xs text-secondary mt-0.5">Total Students</div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-surface-container-low rounded-2xl p-4 sm:p-5 shadow-xs border border-outline-variant/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-status-present mb-3">
            <span className="text-xs font-semibold">Present Today</span>
            <span className="material-symbols-outlined text-[22px]">check_circle</span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl text-on-surface font-bold tabular-nums">58</div>
            <div className="text-xs text-status-present font-semibold mt-0.5">90.6% Attendance</div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-surface-container-low rounded-2xl p-4 sm:p-5 shadow-xs border border-outline-variant/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-status-absent mb-3">
            <span className="text-xs font-semibold">Absent Today</span>
            <span className="material-symbols-outlined text-[22px]">cancel</span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl text-on-surface font-bold tabular-nums">6</div>
            <div className="text-xs text-status-absent font-semibold mt-0.5">Requires follow-up</div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-surface-container-low rounded-2xl p-4 sm:p-5 shadow-xs border border-outline-variant/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-tertiary mb-3">
            <span className="text-xs font-semibold">Classes Held</span>
            <span className="material-symbols-outlined text-[22px]">school</span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl text-on-surface font-bold tabular-nums">42</div>
            <div className="text-xs text-secondary mt-0.5">Semester Total</div>
          </div>
        </div>
      </div>

      {/* Low-Attendance Warning Box (<75%) */}
      <div className="bg-error-container/40 rounded-2xl p-5 border border-error/20 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-error text-white flex items-center justify-center shrink-0 shadow-xs">
          <span className="material-symbols-outlined text-[22px]">warning</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <h3 className="text-sm sm:text-base font-bold text-on-error-container">
              Low Attendance Alert (&lt; 75%)
            </h3>
            <span className="text-xs text-error font-bold px-2 py-0.5 rounded-full bg-error/10 w-fit">
              3 Students Flagged
            </span>
          </div>
          <p className="text-xs sm:text-sm text-on-error-container/85 mt-1 leading-relaxed">
            Students Marcus Brody (68%), Sarah Jenkins (71%), and Leo Vance (64%) have dropped below the minimum threshold.
          </p>
          <div className="flex items-center gap-4 mt-3 flex-wrap">
            <button 
              onClick={onSelectWarningList}
              className="text-xs font-bold text-error hover:underline flex items-center gap-1"
            >
              <span>View Warning List</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
            <button 
              onClick={onSendReminders}
              className="text-xs font-semibold text-on-surface-variant hover:text-on-surface transition-colors"
            >
              Send Automated Reminders
            </button>
          </div>
        </div>
      </div>

      {/* Analytics Section: Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Attendance Trend Chart (Span 2) */}
        <div className="lg:col-span-2 bg-surface-container-low rounded-2xl p-5 shadow-xs border border-outline-variant/20 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-on-surface">Weekly Attendance Trend</h3>
              <p className="text-xs text-secondary">Average daily presence for CS-301</p>
            </div>
            <div className="flex items-center gap-1 bg-surface p-1 rounded-xl border border-outline-variant/30">
              <button 
                onClick={() => setTrendTab('thisWeek')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  trendTab === 'thisWeek' 
                    ? 'bg-primary text-white shadow-xs' 
                    : 'text-secondary hover:text-on-surface'
                }`}
              >
                This Week
              </button>
              <button 
                onClick={() => setTrendTab('lastWeek')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  trendTab === 'lastWeek' 
                    ? 'bg-primary text-white shadow-xs' 
                    : 'text-secondary hover:text-on-surface'
                }`}
              >
                Last Week
              </button>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-52 w-full flex items-end justify-between gap-2 sm:gap-4 pt-4 px-2 relative">
            {/* Background grid lines */}
            <div className="absolute inset-x-0 top-0 h-full flex flex-col justify-between pointer-events-none opacity-20">
              <div className="w-full h-px bg-outline" />
              <div className="w-full h-px bg-outline" />
              <div className="w-full h-px bg-outline" />
              <div className="w-full h-px bg-outline" />
            </div>

            {/* Bars */}
            {trendData.map((item, idx) => (
              <div 
                key={idx}
                className={`flex flex-col items-center gap-2 flex-1 z-10 group cursor-pointer ${
                  item.isPending ? 'opacity-40' : ''
                }`}
              >
                <div className="text-[11px] font-semibold text-secondary opacity-0 group-hover:opacity-100 transition-opacity tabular-nums">
                  {item.isPending ? '--' : `${item.value}%`}
                </div>
                <div 
                  className={`w-full max-w-[42px] transition-all rounded-t-xl relative flex items-end justify-center pb-2 ${
                    item.isToday 
                      ? 'bg-primary group-hover:bg-primary-container shadow-sm'
                      : item.isPending
                      ? 'bg-surface-container'
                      : 'bg-primary/25 group-hover:bg-primary'
                  }`}
                  style={{ height: item.height }}
                >
                  {!item.isPending && (
                    <div 
                      className={`w-2.5 h-2.5 rounded-full absolute -top-1 ${
                        item.isToday ? 'bg-white ring-2 ring-primary' : 'bg-primary'
                      }`}
                    />
                  )}
                </div>
                <span className={`text-xs ${
                  item.isToday ? 'text-primary font-bold' : 'text-secondary'
                }`}>
                  {item.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Present vs Absent Donut Chart Card */}
        <div className="bg-surface-container-low rounded-2xl p-5 shadow-xs border border-outline-variant/20 flex flex-col justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-on-surface">Today's Ratio</h3>
            <p className="text-xs text-secondary">Present vs. Absent Breakdown</p>
          </div>

          {/* Donut Chart Mockup using SVG */}
          <div className="flex items-center justify-center my-4 relative">
            <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 36 36">
              {/* Background red for absent */}
              <path
                className="text-status-absent"
                stroke="currentColor"
                strokeWidth="3.8"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              {/* Foreground teal for present (90.6%) */}
              <path
                className="text-status-present"
                stroke="currentColor"
                strokeWidth="3.8"
                strokeDasharray="90.6, 100"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-bold text-on-surface tabular-nums">90.6%</span>
              <span className="text-xs text-secondary font-medium">Present</span>
            </div>
          </div>

          <div className="flex items-center justify-around pt-2 border-t border-outline-variant/20">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-status-present" />
              <span className="text-xs font-semibold text-on-surface">Present (58)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-status-absent" />
              <span className="text-xs font-semibold text-on-surface">Absent (6)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Attendance Sessions List */}
      <div className="bg-surface-container-low rounded-2xl p-5 shadow-xs border border-outline-variant/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-on-surface">Recent Attendance Sessions</h3>
            <p className="text-xs text-secondary">Log history verified by AI Facial Scanner</p>
          </div>
          <button 
            onClick={() => onNavigate('attendance-records')}
            className="text-xs font-semibold text-primary hover:underline"
          >
            View All Sessions
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {recentSessions.map((session) => (
            <div 
              key={session.id}
              onClick={() => onNavigate('ai-attendance')}
              className="bg-surface rounded-xl p-4 flex items-center justify-between gap-3 border border-outline-variant/20 hover:border-primary/40 hover:bg-surface-bright transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                  session.verifiedByAi 
                    ? 'bg-primary-container/20 text-primary' 
                    : 'bg-surface-container text-secondary'
                }`}>
                  <span className="material-symbols-outlined text-[22px]">
                    {session.verifiedByAi ? 'face' : 'edit'}
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors truncate">
                    {session.title}
                  </div>
                  <div className="text-xs text-secondary flex items-center gap-2 mt-0.5 flex-wrap">
                    <span>{session.date}</span>
                    <span>•</span>
                    {session.verifiedByAi ? (
                      <span className="text-status-present font-semibold">
                        AI Verified ({session.confidenceScore}% confidence)
                      </span>
                    ) : (
                      <span className="text-secondary font-medium">
                        Manual Override Applied
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-bold text-on-surface tabular-nums">
                    {session.presentCount} / {session.totalCount}
                  </div>
                  <div className="text-xs text-status-present font-semibold">
                    {((session.presentCount / session.totalCount) * 100).toFixed(1)}% Present
                  </div>
                </div>
                <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-container text-on-surface group-hover:bg-primary group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
