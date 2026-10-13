import React, { useState } from 'react';
import { UserProfile, Course } from '../types';
import { useLiveClock } from '../hooks/useLiveClock';

interface ProfileSettingsViewProps {
  userProfile: UserProfile;
  courses: Course[];
  userRole?: 'teacher' | 'student';
  student?: {
    id: string;
    name: string;
    usn: string;
    email: string;
    department: string;
    semester: string;
    avatar: string;
  };
  onSaveProfile: (profile: UserProfile) => void;
  onRequestCourse: () => void;
  onLogoutOtherSessions: () => void;
  onOpenBiometricRegistration?: () => void;
}

export const ProfileSettingsView: React.FC<ProfileSettingsViewProps> = ({
  userProfile,
  courses,
  userRole = 'teacher',
  student,
  onSaveProfile,
  onRequestCourse,
  onLogoutOtherSessions,
  onOpenBiometricRegistration
}) => {
  const liveClock = useLiveClock();
  const [activeTab, setActiveTab] = useState<'profile' | 'assignments' | 'thresholds' | 'ai' | 'security'>('profile');

  // Form states
  const [firstName, setFirstName] = useState(userProfile.name.split(' ')[1] || 'Alan');
  const [lastName, setLastName] = useState(userProfile.name.split(' ')[2] || 'Turing');
  const [title, setTitle] = useState(userProfile.title);
  const [email, setEmail] = useState(userProfile.email);
  const [phone, setPhone] = useState(userProfile.phone);
  const [office, setOffice] = useState(userProfile.office);
  const [avatar, setAvatar] = useState(userProfile.avatar);

  // Settings states
  const [threshold, setThreshold] = useState(userProfile.threshold);
  const [autoAlerts, setAutoAlerts] = useState(userProfile.autoAlerts);
  const [mentorEscalation, setMentorEscalation] = useState(userProfile.mentorEscalation);
  const [aiSensitivity, setAiSensitivity] = useState(userProfile.aiSensitivity);
  const [antiSpoofing, setAntiSpoofing] = useState(userProfile.antiSpoofing);
  const [flagUncertain, setFlagUncertain] = useState(userProfile.flagUncertainMatches);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onSaveProfile({
      ...userProfile,
      name: `Prof. ${firstName} ${lastName}`.trim(),
      title,
      email,
      phone,
      office,
      avatar,
      threshold,
      autoAlerts,
      mentorEscalation,
      aiSensitivity,
      antiSpoofing,
      flagUncertainMatches: flagUncertain
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatar(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (userRole === 'student') {
    return (
      <div className="flex flex-col w-full gap-6 pb-20">
        {/* Student Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-wider">
              <span>Student Account</span>
              <span className="text-outline">/</span>
              <span className="text-on-surface-variant">Security & Credentials</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-surface">
              Student Profile & Security
            </h1>
            <p className="text-xs sm:text-sm text-on-surface-variant max-w-3xl">
              View your academic identity, biometric face registration status, and account security controls.
            </p>
          </div>

          <div className="flex items-center gap-2.5 bg-surface-container px-4 py-2 rounded-full self-start md:self-auto shadow-xs border border-outline-variant/20">
            <span className="w-2 h-2 rounded-full bg-status-present" />
            <span className="text-xs text-on-surface font-semibold font-mono">
              Student Clearance (Isolated)
            </span>
          </div>
        </div>

        {/* Academic Identity Card */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-outline-variant/30 space-y-5">
          <h2 className="text-base font-bold text-on-surface">Academic Identity</h2>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden ring-4 ring-primary/20 bg-surface-container shrink-0">
              <img 
                src={student?.avatar || userProfile.avatar} 
                alt="Student Avatar" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div>
              <h3 className="text-lg font-bold text-on-surface">
                {student?.name || 'Alex Rivera'}
              </h3>
              <p className="text-xs text-on-surface-variant font-mono">
                USN: {student?.usn || '1BM21CS014'} • {student?.email || 'alex.rivera@autodence.edu'}
              </p>
              <p className="text-xs text-primary font-semibold mt-0.5">
                {student?.department || 'CSE'} • {student?.semester || 'Semester 6'}
              </p>
            </div>
          </div>
        </div>

        {/* Biometric Face ID Registration Card */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-outline-variant/30 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">badge</span>
                <h3 className="text-base font-bold text-on-surface">Biometric Face Registration</h3>
              </div>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Camera access is used during registration time to scan and encrypt your 128-node facial vector landmarks.
              </p>
            </div>

            {onOpenBiometricRegistration && (
              <button
                type="button"
                onClick={onOpenBiometricRegistration}
                className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs self-start sm:self-auto"
              >
                <span className="material-symbols-outlined text-[16px]">photo_camera</span>
                <span>Register Face ID (Camera)</span>
              </button>
            )}
          </div>

          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <p className="font-semibold text-on-surface">128-D Facial Embedding Active</p>
              <p className="text-on-surface-variant text-[11px] font-mono">
                SHA-256 Hash Verified • Registered for {liveClock.currentSemester} Term
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-status-present/10 text-status-present font-semibold text-[11px] flex items-center gap-1 self-start sm:self-auto">
              <span className="material-symbols-outlined text-[14px]">verified</span>
              <span>Biometrics Validated</span>
            </span>
          </div>
        </div>

        {/* Institutional RBAC Isolation Notice */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-outline-variant/30 space-y-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[22px]">lock</span>
            <h3 className="text-base font-bold text-on-surface">Institutional Role-Based Security</h3>
          </div>
          <p className="text-xs text-on-surface-variant">
            Under university IT security directives, Student accounts are isolated from Faculty administrative tools. Student permissions allow viewing personal attendance telemetry and submitting absence excuses. Faculty access requires separate institutional administrative authentication.
          </p>
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onLogoutOtherSessions}
              className="px-4 py-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-semibold rounded-xl transition-colors"
            >
              Terminate Other Sessions
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full gap-6 pb-20">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-wider">
            <span>Faculty Operations</span>
            <span className="text-outline">/</span>
            <span className="text-on-surface-variant">System Administration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-surface">
            Profile & System Settings
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant max-w-3xl">
            Manage your faculty credentials, academic class assignments, AI attendance threshold rules, and notification preferences.
          </p>
        </div>

        {/* Quick Meta Status Pill */}
        <div className="flex items-center gap-2.5 bg-surface-container px-4 py-2 rounded-full self-start md:self-auto shadow-xs border border-outline-variant/20">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-present opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-status-present" />
          </span>
          <span className="text-xs text-on-surface font-semibold">Node Sync Active • {liveClock.currentSemester}</span>
        </div>
      </div>

      {/* In-Page Tab Navigation */}
      <div className="w-full bg-surface-container-low rounded-xl p-1.5 flex items-center overflow-x-auto gap-1 shadow-xs border border-outline-variant/20">
        <button 
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'profile'
              ? 'bg-surface-container-lowest text-primary shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">person</span>
          <span>General Profile</span>
        </button>

        <button 
          onClick={() => setActiveTab('assignments')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'assignments'
              ? 'bg-surface-container-lowest text-primary shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">school</span>
          <span>Class & Subject Assignments</span>
        </button>

        <button 
          onClick={() => setActiveTab('thresholds')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'thresholds'
              ? 'bg-surface-container-lowest text-primary shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">tune</span>
          <span>Attendance Rules & Thresholds</span>
        </button>

        <button 
          onClick={() => setActiveTab('ai')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'ai'
              ? 'bg-surface-container-lowest text-primary shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
          <span>AI Model Preferences</span>
        </button>

        <button 
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'security'
              ? 'bg-surface-container-lowest text-primary shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">shield</span>
          <span>Security & Sessions</span>
        </button>
      </div>

      {/* Main Content Grid: 5 Cols Left, 7 Cols Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Faculty Profile Card (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-outline-variant/30 flex flex-col gap-6 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/5 rounded-full pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 relative">
              <div className="relative group shrink-0">
                <img 
                  src={avatar} 
                  alt="Prof. Alan Turing" 
                  className="w-24 h-24 rounded-2xl object-cover shadow-md ring-2 ring-primary/20"
                />
                <div className="absolute -bottom-1 -right-1 bg-status-present w-4 h-4 rounded-full shadow-xs ring-2 ring-surface-container-lowest" />
              </div>

              <div className="flex-1 text-center sm:text-left min-w-0">
                <div className="flex items-center justify-center sm:justify-start gap-1.5">
                  <h2 className="text-lg sm:text-xl font-bold text-on-surface truncate">
                    Prof. {firstName} {lastName}
                  </h2>
                  <span className="material-symbols-outlined text-primary text-[20px]" title="Faculty Verified">
                    verified
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant font-mono mt-0.5">
                  {userProfile.facultyId}
                </p>
                <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-lg bg-secondary-container/60 text-on-secondary-container text-xs font-semibold">
                  <span className="material-symbols-outlined text-[14px]">apartment</span>
                  <span>{userProfile.department}</span>
                </div>
              </div>
            </div>

            {/* Photo Actions */}
            <div className="flex items-center gap-2 pt-1">
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-semibold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-outline-variant/20"
              >
                <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                <span>Change Photo</span>
              </button>
              <button 
                type="button"
                onClick={() => setAvatar('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256')}
                className="bg-surface-container-low hover:bg-error-container hover:text-error text-on-surface-variant text-xs font-semibold py-2.5 px-3 rounded-xl transition-colors border border-outline-variant/20"
                title="Reset Photo"
              >
                <span className="material-symbols-outlined text-[18px]">delete</span>
              </button>
              <input 
                ref={fileInputRef} 
                type="file" 
                accept="image/*" 
                onChange={handlePhotoUpload} 
                className="hidden" 
              />
            </div>

            <div className="h-px bg-surface-variant/40" />

            {/* Profile Form */}
            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-on-surface-variant font-semibold">First Name</label>
                  <input 
                    type="text" 
                    value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-surface-container-low text-on-surface text-sm px-3.5 py-2.5 rounded-xl border border-outline-variant/20 focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-on-surface-variant font-semibold">Last Name</label>
                  <input 
                    type="text" 
                    value={lastName} 
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-surface-container-low text-on-surface text-sm px-3.5 py-2.5 rounded-xl border border-outline-variant/20 focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-on-surface-variant font-semibold">Academic Title</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-surface-container-low text-on-surface text-sm px-3.5 py-2.5 rounded-xl border border-outline-variant/20 focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-on-surface-variant font-semibold">Institutional Email</label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-outline text-[18px]">mail</span>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-surface-container-low text-on-surface text-sm pl-10 pr-3.5 py-2.5 rounded-xl border border-outline-variant/20 focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-on-surface-variant font-semibold">Phone Number</label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3 text-outline text-[18px]">call</span>
                    <input 
                      type="tel" 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-surface-container-low text-on-surface text-sm pl-10 pr-3.5 py-2.5 rounded-xl border border-outline-variant/20 focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-on-surface-variant font-semibold">Office Room</label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3 text-outline text-[18px]">location_on</span>
                    <input 
                      type="text" 
                      value={office} 
                      onChange={(e) => setOffice(e.target.value)}
                      className="w-full bg-surface-container-low text-on-surface text-sm pl-10 pr-3.5 py-2.5 rounded-xl border border-outline-variant/20 focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between gap-4">
                <span className="text-[11px] text-outline truncate">
                  All profile telemetry encrypted
                </span>
                <button 
                  type="submit"
                  className="bg-primary hover:bg-primary-container text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2 active:scale-95 shrink-0"
                >
                  <span className="material-symbols-outlined text-[18px]">save</span>
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>

          {/* Quick Faculty Credentials Card */}
          <div className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 shadow-xs border border-outline-variant/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[22px]">badge</span>
              </div>
              <div>
                <p className="text-xs font-bold text-on-surface">Digital Signature & Cert</p>
                <p className="text-[11px] text-on-surface-variant">SHA-256 Validated • Exp: Dec 2026</p>
              </div>
            </div>
            <button 
              type="button"
              onClick={() => alert('Certificate renewed with institutional authority!')}
              className="text-primary hover:text-on-primary-fixed-variant text-xs font-semibold"
            >
              Renew
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Configuration, Rules & Course Management (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* 1. Attendance Threshold Rules */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-outline-variant/30 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed">
                  <span className="material-symbols-outlined text-[20px]">equalizer</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-on-surface">Attendance Threshold Rules</h3>
                  <p className="text-xs text-on-surface-variant">Automated regulatory alerts for semester debarment prevention</p>
                </div>
              </div>
              <span className="bg-primary-fixed text-on-primary-fixed text-xs px-2.5 py-1 rounded-full font-bold">
                Mandatory {threshold}%
              </span>
            </div>

            <div className="bg-surface-container-low rounded-xl p-4 flex flex-col gap-2 border border-outline-variant/20 mt-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-on-surface">
                  Minimum Attendance Required
                </label>
                <div className="flex items-center gap-1 bg-surface-container-lowest px-3 py-1 rounded-lg shadow-2xs border border-outline-variant/20">
                  <span className="text-base font-bold text-primary tabular-nums">{threshold}</span>
                  <span className="text-xs font-semibold text-primary">%</span>
                </div>
              </div>

              <input 
                type="range"
                min="60"
                max="90"
                value={threshold}
                onChange={(e) => setThreshold(parseInt(e.target.value))}
                className="w-full accent-primary h-2 bg-surface-container rounded-lg cursor-pointer"
              />

              <div className="flex justify-between text-[11px] text-outline font-medium">
                <span>60% (Liberal)</span>
                <span>75% (Standard University Policy)</span>
                <span>90% (Strict)</span>
              </div>

              <p className="text-[11px] text-on-surface-variant mt-1 flex items-start gap-1">
                <span className="material-symbols-outlined text-[14px] text-status-pending shrink-0 mt-0.5">info</span>
                <span>Students falling below this threshold trigger automated warnings, parent email digests, and exam hall ticket holds.</span>
              </p>
            </div>

            {/* Toggles */}
            <div className="flex flex-col gap-2 pt-1">
              <div className="flex items-center justify-between p-2 rounded-xl hover:bg-surface-container-low transition-colors">
                <div className="flex flex-col pr-4">
                  <span className="text-xs font-semibold text-on-surface">
                    Send automated alerts to students below threshold
                  </span>
                  <span className="text-[11px] text-on-surface-variant">
                    Dispatches periodic notifications via Autodence Mobile App and SMS
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input 
                    type="checkbox" 
                    checked={autoAlerts} 
                    onChange={(e) => setAutoAlerts(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl hover:bg-surface-container-low transition-colors">
                <div className="flex flex-col pr-4">
                  <span className="text-xs font-semibold text-on-surface">
                    Notify academic mentor / HOD on consecutive absences &gt; 3 days
                  </span>
                  <span className="text-[11px] text-on-surface-variant">
                    Escalates chronic absenteeism telemetry directly to department head
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input 
                    type="checkbox" 
                    checked={mentorEscalation} 
                    onChange={(e) => setMentorEscalation(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>
            </div>
          </div>

          {/* 2. Class & Subject Assignments */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-outline-variant/30 flex flex-col gap-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed">
                  <span className="material-symbols-outlined text-[20px]">menu_book</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-on-surface">Class & Subject Assignments</h3>
                  <p className="text-xs text-on-surface-variant">Configured courses linked to AI lecture recognition scanners</p>
                </div>
              </div>
              <button 
                onClick={onRequestCourse}
                className="text-primary hover:bg-primary-fixed/40 text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1 transition-colors border border-outline-variant/30"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                <span>Request New Course</span>
              </button>
            </div>

            <div className="flex flex-col gap-3 mt-1">
              {courses.map((course) => (
                <div 
                  key={course.id}
                  className="bg-surface-container-low hover:bg-surface-container rounded-xl p-4 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-outline-variant/20"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                      {course.code.slice(0, 2)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-xs font-bold text-on-surface">{course.code}: {course.name}</h4>
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-status-present/15 text-status-present">
                          {course.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-on-surface-variant text-xs flex-wrap">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">groups</span>
                          <span>{course.enrolledStudents} Enrolled Students</span>
                        </span>
                        <span>•</span>
                        <span>{course.semester} • {course.section}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <span className="text-xs bg-surface-container-lowest px-2.5 py-1 rounded-lg text-on-surface font-semibold shadow-2xs border border-outline-variant/20">
                      {course.room}
                    </span>
                    <button className="p-1.5 text-outline hover:text-on-surface rounded-lg">
                      <span className="material-symbols-outlined text-[18px]">more_vert</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. AI Facial Recognition Sensitivity */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-outline-variant/30 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary-fixed-dim flex items-center justify-center text-on-primary-fixed">
                  <span className="material-symbols-outlined text-[20px]">face</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-on-surface">AI Facial Recognition Sensitivity</h3>
                  <p className="text-xs text-on-surface-variant">Calibrate confidence matrix for edge camera hardware</p>
                </div>
              </div>
              <span className="text-xs bg-secondary-fixed text-on-secondary-fixed px-2.5 py-1 rounded-full font-bold">
                Model v2.4
              </span>
            </div>

            <div className="bg-surface-container-low rounded-xl p-4 flex flex-col gap-2 border border-outline-variant/20 mt-1">
              <div className="flex justify-between items-center">
                <div>
                  <label className="text-xs font-semibold text-on-surface">Match Confidence Threshold</label>
                  <p className="text-[11px] text-on-surface-variant">Scores below trigger teacher override prompt</p>
                </div>
                <div className="flex items-center gap-1 bg-surface-container-lowest px-3 py-1 rounded-lg shadow-2xs border border-outline-variant/20">
                  <span className="text-base font-bold text-primary tabular-nums">{aiSensitivity}</span>
                  <span className="text-xs font-semibold text-primary">%</span>
                </div>
              </div>

              <input 
                type="range"
                min="70"
                max="98"
                value={aiSensitivity}
                onChange={(e) => setAiSensitivity(parseInt(e.target.value))}
                className="w-full accent-primary h-2 bg-surface-container rounded-lg cursor-pointer"
              />

              <div className="flex justify-between text-[11px] text-outline font-medium">
                <span>70% (Faster Match)</span>
                <span>85% (Recommended for 1080p Cameras)</span>
                <span>98% (High Precision)</span>
              </div>
            </div>

            {/* AI Toggles */}
            <div className="flex flex-col gap-2 pt-1">
              <div className="flex items-center justify-between p-2 rounded-xl hover:bg-surface-container-low transition-colors">
                <div className="flex flex-col pr-4">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-on-surface">
                      Strict Anti-Spoofing & Liveness Detection
                    </span>
                    <span className="bg-status-present/20 text-status-present text-[10px] px-1.5 py-0.2 rounded font-bold">
                      Active
                    </span>
                  </div>
                  <span className="text-[11px] text-on-surface-variant">
                    Prevents proxy attendance through printed photographs or 2D screen playback
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input 
                    type="checkbox" 
                    checked={antiSpoofing} 
                    onChange={(e) => setAntiSpoofing(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl hover:bg-surface-container-low transition-colors">
                <div className="flex flex-col pr-4">
                  <span className="text-xs font-semibold text-on-surface">
                    Flag uncertain face matches for teacher review before saving
                  </span>
                  <span className="text-[11px] text-on-surface-variant">
                    Places matches with 75%-84% confidence in a staging queue for verification
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input 
                    type="checkbox" 
                    checked={flagUncertain} 
                    onChange={(e) => setFlagUncertain(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>
            </div>
          </div>

          {/* 4. Account Security */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-outline-variant/30 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-surface-variant flex items-center justify-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-[20px]">lock_reset</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-on-surface">Account Security</h3>
                  <p className="text-xs text-on-surface-variant">Session control, authentication factors & password lifecycle</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-status-present text-[22px]">
                verified_user
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-1">
              <div className="bg-surface-container-low rounded-xl p-4 flex flex-col justify-between border border-outline-variant/20">
                <div>
                  <p className="text-xs text-outline font-semibold">Password Status</p>
                  <p className="text-xs font-bold text-on-surface mt-1">Updated 45 days ago</p>
                </div>
                <button 
                  onClick={() => alert('Password update link sent to your institutional email.')}
                  className="mt-4 text-primary text-xs font-bold hover:underline text-left"
                >
                  Change Password
                </button>
              </div>

              <div className="bg-surface-container-low rounded-xl p-4 flex flex-col justify-between border border-outline-variant/20">
                <div>
                  <p className="text-xs text-outline font-semibold">Two-Factor Auth</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="w-2 h-2 rounded-full bg-status-present" />
                    <p className="text-xs font-bold text-on-surface">Enabled</p>
                  </div>
                  <p className="text-[11px] text-on-surface-variant">Via Authenticator App</p>
                </div>
                <button 
                  onClick={() => alert('Opening two-factor security key settings.')}
                  className="mt-4 text-primary text-xs font-bold hover:underline text-left"
                >
                  Manage Keys
                </button>
              </div>

              <div className="bg-surface-container-low rounded-xl p-4 flex flex-col justify-between border border-outline-variant/20">
                <div>
                  <p className="text-xs text-outline font-semibold">Active Sessions</p>
                  <p className="text-xs font-bold text-on-surface mt-1">2 Desktop Devices</p>
                  <p className="text-[11px] text-on-surface-variant">Chrome OS • macOS Sonoma</p>
                </div>
                <button 
                  onClick={onLogoutOtherSessions}
                  className="mt-4 text-status-absent text-xs font-bold hover:underline text-left"
                >
                  Log out other devices
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
