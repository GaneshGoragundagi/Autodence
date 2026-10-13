/**
 * Reactive and dynamic date/time utilities for Autodence
 */

export interface DynamicDateInfo {
  now: Date;
  dateString: string;          // e.g. "Monday, October 12, 2026"
  shortDateString: string;     // e.g. "Oct 12, 2026"
  isoDateString: string;       // e.g. "2026-10-12"
  timeString: string;          // e.g. "10:15:30 AM"
  shortTimeString: string;     // e.g. "10:15 AM"
  currentSemester: string;     // e.g. "Fall 2026"
  academicYear: string;        // e.g. "2026-2027"
  dayName: string;             // e.g. "Monday"
  dayOfWeek: number;           // 0-6
  weekRangeText: string;       // e.g. "Week 8 (Oct 12 - Oct 16, 2026)"
}

export function getDynamicDateInfo(date = new Date()): DynamicDateInfo {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-11
  
  const dateString = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(date);

  const shortDateString = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);

  const isoDateString = date.toISOString().slice(0, 10);

  const timeString = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  }).format(date);

  const shortTimeString = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).format(date);

  const currentSemester = (month >= 7 && month <= 11) 
    ? `Fall ${year}` 
    : (month <= 4) 
      ? `Spring ${year}` 
      : `Summer ${year}`;

  const academicYear = month >= 7 ? `${year}-${year + 1}` : `${year - 1}-${year}`;

  const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date);
  const dayOfWeek = date.getDay();

  // Compute Monday of current week
  const monday = new Date(date);
  const distToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  monday.setDate(date.getDate() + distToMonday);

  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);

  const monStr = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(monday);
  const friStr = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(friday);
  const weekRangeText = `Week 8 (${monStr} - ${friStr})`;

  return {
    now: date,
    dateString,
    shortDateString,
    isoDateString,
    timeString,
    shortTimeString,
    currentSemester,
    academicYear,
    dayName,
    dayOfWeek,
    weekRangeText
  };
}

export function formatRelativeSessionDate(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  if (daysAgo === 0) {
    return 'Today, ' + new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).format(new Date());
  }
  if (daysAgo === 1) {
    return 'Yesterday, 10:00 AM';
  }
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  }).format(d) + ', 10:00 AM';
}
