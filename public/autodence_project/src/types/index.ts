export type ViewMode = 
  | 'landing' 
  | 'dashboard' 
  | 'ai-attendance' 
  | 'students' 
  | 'weekly-analytics' 
  | 'profile-settings' 
  | 'attendance-records'
  | 'semester-reports'
  | 'notifications'
  | 'student-portal';

export type UserRole = 'teacher' | 'student';

export interface Student {
  id: string;
  name: string;
  usn: string;
  email: string;
  department: string;
  semester: string;
  avatar: string;
  attendanceRate: number; // percentage, e.g. 92.5
  totalPresent: number;
  totalAbsent: number;
  isAtRisk: boolean;
  status: 'present' | 'absent' | 'pending';
  lastSeen?: string;
  confidenceScore?: number;
}

export interface AttendanceSession {
  id: string;
  title: string;
  date: string;
  time: string;
  courseCode: string;
  courseName: string;
  presentCount: number;
  totalCount: number;
  confidenceScore: number;
  verifiedByAi: boolean;
  notes?: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  type: 'Lab' | 'Lecture' | 'Hands-on';
  enrolledStudents: number;
  semester: string;
  section: string;
  room: string;
  attendanceAvg: number;
}

export interface BoundingBox {
  id: string;
  studentName?: string;
  usn?: string;
  confidence: number;
  top: string;
  left: string;
  width: string;
  height: string;
  status: 'present' | 'absent';
  avatar?: string;
}

export interface UserProfile {
  name: string;
  facultyId: string;
  department: string;
  title: string;
  email: string;
  phone: string;
  office: string;
  avatar: string;
  threshold: number;
  autoAlerts: boolean;
  mentorEscalation: boolean;
  aiSensitivity: number;
  antiSpoofing: boolean;
  flagUncertainMatches: boolean;
  twoFactorEnabled: boolean;
}
