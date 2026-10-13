import React, { useState } from 'react';
import { 
  ViewMode, 
  UserRole, 
  Student, 
  Course, 
  AttendanceSession, 
  UserProfile 
} from './types';
import { 
  INITIAL_STUDENTS, 
  INITIAL_COURSES, 
  INITIAL_SESSIONS, 
  INITIAL_USER_PROFILE 
} from './data/mockData';

// Common Components
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { BottomNav } from './components/common/BottomNav';
import { Toast } from './components/common/Toast';

// Modals
import { AuthModal } from './components/modals/AuthModal';
import { StudentDetailModal } from './components/modals/StudentDetailModal';
import { EditStudentModal } from './components/modals/EditStudentModal';
import { AddStudentModal } from './components/modals/AddStudentModal';
import { MessageStudentModal } from './components/modals/MessageStudentModal';
import { ExportReportModal, CourseModal } from './components/modals/ExportReportModal';
import { FacialCheckInModal } from './components/modals/FacialCheckInModal';

// Views
import { LandingView } from './views/LandingView';
import { DashboardView } from './views/DashboardView';
import { AiVisionView } from './views/AiVisionView';
import { StudentsView } from './views/StudentsView';
import { AnalyticsView } from './views/AnalyticsView';
import { ProfileSettingsView } from './views/ProfileSettingsView';
import { StudentPortalView } from './views/StudentPortalView';
import { AttendanceRecordsView } from './views/AttendanceRecordsView';
import { SemesterReportsView } from './views/SemesterReportsView';
import { NotificationsView } from './views/NotificationsView';

export default function App() {
  // Navigation & Role states
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [userRole, setUserRole] = useState<UserRole>('teacher');

  // Data states
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [sessions, setSessions] = useState<AttendanceSession[]>(INITIAL_SESSIONS);
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [currentStudent, setCurrentStudent] = useState<Student>(INITIAL_STUDENTS[0]);

  // Modal states
  const [authModal, setAuthModal] = useState<{ open: boolean; mode: 'login' | 'register' | 'forgot' }>({
    open: false,
    mode: 'login'
  });
  const [selectedStudentDetail, setSelectedStudentDetail] = useState<Student | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [messagingStudent, setMessagingStudent] = useState<Student | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isFacialCheckInOpen, setIsFacialCheckInOpen] = useState(false);

  // Toast state
  const [toast, setToast] = useState<{
    show: boolean;
    title: string;
    message: string;
    type: 'success' | 'warning' | 'info';
  }>({
    show: false,
    title: '',
    message: '',
    type: 'success'
  });

  const showToast = (title: string, message: string, type: 'success' | 'warning' | 'info' = 'success') => {
    setToast({ show: true, title, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 4500);
  };

  // Handlers
  const handleToggleStudentStatus = (studentId: string) => {
    setStudents(prev =>
      prev.map(s => {
        if (s.id === studentId) {
          const newStatus = s.status === 'present' ? 'absent' : 'present';
          const newRate = newStatus === 'present' 
            ? Math.min(100, +(s.attendanceRate + 1.2).toFixed(1))
            : Math.max(0, +(s.attendanceRate - 1.5).toFixed(1));
          return {
            ...s,
            status: newStatus,
            attendanceRate: newRate,
            isAtRisk: newRate < 75,
            totalPresent: newStatus === 'present' ? s.totalPresent + 1 : Math.max(0, s.totalPresent - 1),
            totalAbsent: newStatus === 'absent' ? s.totalAbsent + 1 : Math.max(0, s.totalAbsent - 1)
          };
        }
        return s;
      })
    );

    // Update detail modal if open
    if (selectedStudentDetail && selectedStudentDetail.id === studentId) {
      const nextStatus = selectedStudentDetail.status === 'present' ? 'absent' : 'present';
      setSelectedStudentDetail(prev => prev ? ({ ...prev, status: nextStatus }) : null);
    }

    showToast('Attendance Status Updated', 'Modified student record telemetry.', 'info');
  };

  const handleSaveStudent = (updatedStudent: Student) => {
    setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
    showToast('Student Record Saved', `${updatedStudent.name} updated successfully.`);
  };

  const handleAddStudent = (newStudent: Student) => {
    setStudents(prev => [newStudent, ...prev]);
    showToast('Student Enrolled', `${newStudent.name} enrolled with facial recognition telemetry.`);
  };

  const handleSaveAttendance = (summary: { present: number; absent: number; course: string }) => {
    const newSession: AttendanceSession = {
      id: `ses-${Date.now()}`,
      title: `Lecture #${sessions.length + 43}: Dynamic Programming & Recursion`,
      date: 'Today, 10:00 AM',
      time: '10:00 AM - 11:30 AM',
      courseCode: summary.course,
      courseName: 'Data Structures & Algorithms',
      presentCount: summary.present,
      totalCount: summary.present + summary.absent,
      confidenceScore: 98.6,
      verifiedByAi: true
    };

    setSessions(prev => [newSession, ...prev]);
    showToast(
      'Attendance Saved Successfully',
      `${summary.present} present, ${summary.absent} absent recorded for ${summary.course}.`,
      'success'
    );
  };

  const handleSendMessage = (recipient: string, message: string) => {
    showToast(
      'Attendance Warning Sent',
      `Notice dispatched to ${recipient} via SMS and Institutional Email.`,
      'warning'
    );
  };

  const handleExport = (format: 'csv' | 'pdf') => {
    if (format === 'csv') {
      const csvContent = "data:text/csv;charset=utf-8," + 
        "Name,USN,Department,Semester,AttendanceRate,Present,Absent\n" +
        students.map(s => `${s.name},${s.usn},${s.department},${s.semester},${s.attendanceRate}%,${s.totalPresent},${s.totalAbsent}`).join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `Autodence_CS301_Attendance_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('CSV Export Ready', 'Class roster and match confidence downloaded.');
    } else {
      window.print();
      showToast('Generating Dean PDF', 'Official Academic Compliance Report formatted for print/PDF.');
    }
  };

  const handleAddCourse = (course: Course) => {
    setCourses(prev => [...prev, course]);
    showToast('Course Assignment Requested', `${course.code}: ${course.name} queued for department dean approval.`);
  };

  // Render view router
  const renderViewContent = () => {
    switch (currentView) {
      case 'landing':
        return (
          <LandingView
            onSelectPortal={(role) => {
              setUserRole(role);
              if (role === 'teacher') {
                setCurrentView('dashboard');
              } else {
                setCurrentView('student-portal');
              }
            }}
            onOpenAuth={(mode) => setAuthModal({ open: true, mode })}
          />
        );

      case 'dashboard':
        return (
          <DashboardView
            courses={courses}
            recentSessions={sessions}
            onNavigate={(view) => setCurrentView(view)}
            onLaunchAiVision={() => setCurrentView('ai-attendance')}
            onSendReminders={() => setMessagingStudent(students[2])}
            onSelectWarningList={() => setCurrentView('students')}
          />
        );

      case 'ai-attendance':
        return (
          <AiVisionView
            students={students}
            onSaveAttendance={handleSaveAttendance}
          />
        );

      case 'students':
        return (
          <StudentsView
            students={students}
            onSelectStudent={(s) => setSelectedStudentDetail(s)}
            onEditStudent={(s) => setEditingStudent(s)}
            onOpenAddModal={() => setIsAddStudentOpen(true)}
          />
        );

      case 'weekly-analytics':
        return (
          <AnalyticsView
            onSendMessage={(s) => setMessagingStudent(s)}
            onOpenExportModal={() => setIsExportModalOpen(true)}
          />
        );

      case 'profile-settings':
        return (
          <ProfileSettingsView
            userProfile={userProfile}
            courses={courses}
            onSaveProfile={(p) => {
              setUserProfile(p);
              showToast('Profile Saved', 'System settings & attendance rules updated.');
            }}
            onRequestCourse={() => setIsCourseModalOpen(true)}
            onLogoutOtherSessions={() => {
              showToast('Sessions Terminated', 'All other desktop devices logged out successfully.');
            }}
          />
        );

      case 'student-portal':
        return (
          <StudentPortalView
            currentStudent={currentStudent}
            allStudents={students}
            onSwitchStudent={(s) => setCurrentStudent(s)}
            onOpenCheckInModal={() => setIsFacialCheckInOpen(true)}
          />
        );

      case 'attendance-records':
        return (
          <AttendanceRecordsView
            sessions={sessions}
            onOpenSession={(s) => {
              setCurrentView('ai-attendance');
            }}
            onLaunchNewSession={() => setCurrentView('ai-attendance')}
          />
        );

      case 'semester-reports':
        return (
          <SemesterReportsView
            courses={courses}
            onExportReport={() => setIsExportModalOpen(true)}
          />
        );

      case 'notifications':
        return (
          <NotificationsView
            onClearAll={() => {
              showToast('Notifications Cleared', 'All unread system telemetry alerts marked as read.');
            }}
            onNavigateAiVision={() => setCurrentView('ai-attendance')}
          />
        );

      default:
        return (
          <DashboardView
            courses={courses}
            recentSessions={sessions}
            onNavigate={(view) => setCurrentView(view)}
            onLaunchAiVision={() => setCurrentView('ai-attendance')}
            onSendReminders={() => setMessagingStudent(students[2])}
            onSelectWarningList={() => setCurrentView('students')}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-surface font-sans text-on-surface antialiased flex flex-col selection:bg-primary/20 selection:text-primary">
      {/* Toast Notification */}
      <Toast
        show={toast.show}
        title={toast.title}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast(prev => ({ ...prev, show: false }))}
      />

      {/* Modals */}
      <AuthModal
        isOpen={authModal.open}
        initialMode={authModal.mode}
        onClose={() => setAuthModal({ open: false, mode: 'login' })}
        onSuccess={(role) => {
          setUserRole(role);
          if (role === 'teacher') {
            setCurrentView('dashboard');
          } else {
            setCurrentView('student-portal');
          }
          showToast('Welcome to Autodence', `Signed in as ${role === 'teacher' ? 'Faculty' : 'Student'}.`);
        }}
      />

      <StudentDetailModal
        student={selectedStudentDetail}
        isOpen={Boolean(selectedStudentDetail)}
        onClose={() => setSelectedStudentDetail(null)}
        onToggleStatus={(id) => handleToggleStudentStatus(id)}
        onEdit={(student) => {
          setSelectedStudentDetail(null);
          setEditingStudent(student);
        }}
        onSendMessage={(student) => {
          setSelectedStudentDetail(null);
          setMessagingStudent(student);
        }}
      />

      <EditStudentModal
        student={editingStudent}
        isOpen={Boolean(editingStudent)}
        onClose={() => setEditingStudent(null)}
        onSave={handleSaveStudent}
      />

      <AddStudentModal
        isOpen={isAddStudentOpen}
        onClose={() => setIsAddStudentOpen(false)}
        onAdd={handleAddStudent}
      />

      <MessageStudentModal
        student={messagingStudent}
        isOpen={Boolean(messagingStudent)}
        onClose={() => setMessagingStudent(null)}
        onSend={handleSendMessage}
      />

      <ExportReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
      />

      <CourseModal
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
        onAddCourse={handleAddCourse}
      />

      <FacialCheckInModal
        isOpen={isFacialCheckInOpen}
        studentName={currentStudent.name}
        onClose={() => setIsFacialCheckInOpen(false)}
        onSuccess={(name) => {
          showToast('Biometric Match Verified', `Attendance recorded for ${name}.`);
        }}
      />

      {/* If Landing view is selected, show standalone clean landing screen */}
      {currentView === 'landing' ? (
        <main className="flex-1 flex flex-col justify-center items-center py-6 px-4">
          {renderViewContent()}
        </main>
      ) : (
        <>
          {/* Desktop Sidebar (hidden when on mobile or landing) */}
          <Sidebar
            currentView={currentView}
            onNavigate={(view) => setCurrentView(view)}
            onLogout={() => {
              setCurrentView('landing');
              showToast('Logged Out', 'You have been safely signed out of Autodence.');
            }}
          />

          {/* Top Header */}
          <Header
            currentView={currentView}
            userRole={userRole}
            userName={userRole === 'teacher' ? userProfile.name : currentStudent.name}
            userAvatar={userRole === 'teacher' ? userProfile.avatar : currentStudent.avatar}
            onNavigate={(view) => setCurrentView(view)}
            onOpenNotifications={() => setCurrentView('notifications')}
          />

          {/* Main Content Area */}
          <div className="flex-1 lg:pl-72 pt-16 flex flex-col">
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              {renderViewContent()}
            </main>

            {/* Mobile Bottom Navigation Bar (active on mobile screen widths) */}
            <BottomNav
              currentView={currentView}
              onNavigate={(view) => setCurrentView(view)}
            />
          </div>
        </>
      )}
    </div>
  );
}
