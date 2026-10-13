import { Student, AttendanceSession, Course, UserProfile, BoundingBox } from '../types';

export const INITIAL_USER_PROFILE: UserProfile = {
  name: 'Prof. Alan Turing',
  facultyId: 'FAC-CSE-2019-042',
  department: 'Computer Science & Engineering',
  title: 'Associate Professor & Head of Lab',
  email: 'alan.turing@autodence.edu',
  phone: '+1 (555) 234-5678',
  office: 'Turing Block, Room 402',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBIJ3VHmL1X8F-WAPhqQpfOQsgotevfyBAiIa0-BftJk_7QtZ8RZA2WJgQBwieR7Drv0mAojH4GiYMOMsaNhNLov3CMavMhwNvW46yQJ9mlFjDjDPSrVmTWunfjR3LnQ7vx--S2TDURE3FN8AL_Nza02mwYSoxvzFIxTig8S0y7MTtdTjljoyKEvFkpIhJE6ut_OK3gk0KhkKSmmCPyVAMRCydRkA4ogxofWazhmEH63WM8lkBMXoH5tA',
  threshold: 75,
  autoAlerts: true,
  mentorEscalation: true,
  aiSensitivity: 85,
  antiSpoofing: true,
  flagUncertainMatches: true,
  twoFactorEnabled: true,
};

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 's-1',
    name: 'Alex Rivera',
    usn: '1BM21CS014',
    email: 'alex.rivera@autodence.edu',
    department: 'CSE',
    semester: '6th Sem',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDp-oIxFcLF60HOUylIJQ4LsOC0Yp1XKzpHoUHjo9NK8omz5jmA43Njgi6G34NtO4kkpTPgbI0f0jm2buOP48VH7GVC-6Jx_zYceJG1flnyrJ8YPyaBOBFTVO1bxQLlNaIlKv2qJRubEZlTRV_QokNxhlxOZ8KF6Ex-doP-34sQSNZKoJt3uNk0EKgHwC8-C0YCpiD4ctfHHQVGttYh7q1fT0Ym5H4t9cPfj5vztIf5BkwJnB5zKDu5KA',
    attendanceRate: 92.5,
    totalPresent: 74,
    totalAbsent: 6,
    isAtRisk: false,
    status: 'present',
    confidenceScore: 98,
    lastSeen: 'Today, 10:04 AM'
  },
  {
    id: 's-2',
    name: 'Samantha Wu',
    usn: '1BM21CS045',
    email: 'samantha.wu@autodence.edu',
    department: 'CSE',
    semester: '6th Sem',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJ1uDO7UqjbtNAvwgpwIBUhalBGs4_pRAZ-Tpmjnj94AdwC5CBORIhrN295uvJfJVWx7HFssamWNlf2q9DGWDLCv6KileIcQIcdu55tw65fRVoG5_N6z2F1FTGbfQdzEFg4iUhuNx8J_89XfOtgIZwGWjKPSHQSVCkbNPInao3WJ5va1MDSIqfoTrs3VCWRonsYZSKy2lrxlMyDyzow0T2ZmJepWLuffNF1hbFiDJ_QJoXMDhNHSwICA',
    attendanceRate: 95.0,
    totalPresent: 76,
    totalAbsent: 4,
    isAtRisk: false,
    status: 'present',
    confidenceScore: 95,
    lastSeen: 'Today, 10:02 AM'
  },
  {
    id: 's-3',
    name: 'Marcus Chen',
    usn: '1BM22EC042',
    email: 'marcus.chen@autodence.edu',
    department: 'ECE',
    semester: '4th Sem',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCu9yyw0TVoONLT5rSfC2gL-s4h28CH1rCQvE1gtX5B2u7dfrRZt0scpSsj-FFM93Vuo3L-SAnwL-rOXy4wEtYe3Ez3uQsNleMPM50n-ImToaP5rndSGwNZQUnO63F7O5GDUoM-Mul3cv59RpKF9FeEiGeOZzN7ZUbfFWw7ssQMzBuvedk3aKrtR5WZaehMV2_MEw93WIZXYffg27F8gjWdEj1SfhHH-TpaNMG6e9Tr2amdtoDDmNDBIg',
    attendanceRate: 68.0,
    totalPresent: 51,
    totalAbsent: 24,
    isAtRisk: true,
    status: 'absent',
    confidenceScore: 42,
    lastSeen: 'Oct 21, 10:15 AM'
  },
  {
    id: 's-4',
    name: 'Priya Sharma',
    usn: '1BM21CS089',
    email: 'priya.sharma@autodence.edu',
    department: 'CSE',
    semester: '6th Sem',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcY6B9tfpwmXDQWVur0ue_GikD-Oc16XgSs6nJbFW9IBlPYMiqJQnTGsvEIidhBODbMXS4dS18D5wYQ-3_U7ThiWFcqTqxgMah2oMvxSXYzIXRYUM6fkJVxrOEUdnb-jdBcdeMBhUuH2SVvp0kpM0gezQf3N20_f32WfHv-W7ulPf5X4HMpAEtTu4STg8oEnxud_LRhLu8WR3dHUjodv6MuvHZTCLEpRbQ32C1PvR1vnvOlg-kVEzBtw',
    attendanceRate: 96.0,
    totalPresent: 78,
    totalAbsent: 3,
    isAtRisk: false,
    status: 'present',
    confidenceScore: 99,
    lastSeen: 'Today, 10:01 AM'
  },
  {
    id: 's-5',
    name: 'Liam Johnson',
    usn: '1BM20ME021',
    email: 'liam.johnson@autodence.edu',
    department: 'ME',
    semester: '8th Sem',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAz7Raqmcyfe1R9wRGnABuf5UZJ8gYwXv9znyPsBs4rvWVe-wmtirpIiwg6Fqk-aienaGXCr25W03Xb9ltRAt8Y7DXQqIegdcHsCA-Flcpo1eRgkL2nnCxLZE9yPSElrgfSaMAu57Ap65iuIompnrc1W2dMeGsWrcAat5D1xoTHgIrXjNSrkbAUcuCWvfzE83Yc6kErxTfdL2vNZ-F08IYcedTCVx98dIHOKI5658xzdXuxC3C-h3C63A',
    attendanceRate: 85.0,
    totalPresent: 68,
    totalAbsent: 12,
    isAtRisk: false,
    status: 'present',
    confidenceScore: 91,
    lastSeen: 'Today, 10:06 AM'
  },
  {
    id: 's-6',
    name: 'Leo Vance',
    usn: '1BM22EC058',
    email: 'leo.vance@autodence.edu',
    department: 'ECE',
    semester: '4th Sem',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=256',
    attendanceRate: 64.0,
    totalPresent: 48,
    totalAbsent: 27,
    isAtRisk: true,
    status: 'absent',
    confidenceScore: 40,
    lastSeen: 'Oct 18, 11:30 AM'
  },
  {
    id: 's-7',
    name: 'Sana Khan',
    usn: '1BM22EC089',
    email: 'sana.khan@autodence.edu',
    department: 'ECE',
    semester: '4th Sem',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
    attendanceRate: 72.0,
    totalPresent: 54,
    totalAbsent: 21,
    isAtRisk: true,
    status: 'absent',
    confidenceScore: 68,
    lastSeen: 'Oct 21, 10:00 AM'
  },
  {
    id: 's-8',
    name: 'Devraj Roy',
    usn: '1BM22EC031',
    email: 'devraj.roy@autodence.edu',
    department: 'ECE',
    semester: '4th Sem',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
    attendanceRate: 73.5,
    totalPresent: 55,
    totalAbsent: 20,
    isAtRisk: true,
    status: 'absent',
    confidenceScore: 71,
    lastSeen: 'Oct 22, 10:00 AM'
  }
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'c-1',
    code: 'CS-301',
    name: 'Advanced Data Structures & Algorithms',
    type: 'Lab',
    enrolledStudents: 64,
    semester: 'Semester 6',
    section: 'Sec A',
    room: 'Room 304B',
    attendanceAvg: 91.4
  },
  {
    id: 'c-2',
    code: 'CS-304',
    name: 'Database Systems & Cloud Architecture',
    type: 'Lecture',
    enrolledStudents: 58,
    semester: 'Semester 4',
    section: 'Sec B',
    room: 'Hall Alpha',
    attendanceAvg: 88.0
  },
  {
    id: 'c-3',
    code: 'CS-307',
    name: 'AI & Machine Learning Laboratory',
    type: 'Hands-on',
    enrolledStudents: 32,
    semester: 'Semester 6',
    section: 'Sec A',
    room: 'GPU Lab 1',
    attendanceAvg: 95.5
  }
];

export const INITIAL_SESSIONS: AttendanceSession[] = [
  {
    id: 'ses-42',
    title: 'Lecture #42: Binary Search Trees',
    date: 'Thursday, Oct 24, 2025',
    time: '10:00 AM - 11:30 AM',
    courseCode: 'CS-301',
    courseName: 'Data Structures',
    presentCount: 58,
    totalCount: 64,
    confidenceScore: 98.2,
    verifiedByAi: true
  },
  {
    id: 'ses-41',
    title: 'Lecture #41: AVL Tree Rotations',
    date: 'Tuesday, Oct 22, 2025',
    time: '10:00 AM - 11:30 AM',
    courseCode: 'CS-301',
    courseName: 'Data Structures',
    presentCount: 61,
    totalCount: 64,
    confidenceScore: 97.9,
    verifiedByAi: true
  },
  {
    id: 'ses-40',
    title: 'Lecture #40: Hash Tables & Collisions',
    date: 'Thursday, Oct 17, 2025',
    time: '10:00 AM - 11:30 AM',
    courseCode: 'CS-301',
    courseName: 'Data Structures',
    presentCount: 56,
    totalCount: 64,
    confidenceScore: 89.4,
    verifiedByAi: false,
    notes: 'Manual Override Applied by Faculty'
  }
];

export const MOCK_BOUNDING_BOXES: BoundingBox[] = [
  {
    id: 'box-1',
    studentName: 'Alex Rivera',
    usn: '1BM21CS014',
    confidence: 98,
    top: '20%',
    left: '15%',
    width: '12%',
    height: '24%',
    status: 'present',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDp-oIxFcLF60HOUylIJQ4LsOC0Yp1XKzpHoUHjo9NK8omz5jmA43Njgi6G34NtO4kkpTPgbI0f0jm2buOP48VH7GVC-6Jx_zYceJG1flnyrJ8YPyaBOBFTVO1bxQLlNaIlKv2qJRubEZlTRV_QokNxhlxOZ8KF6Ex-doP-34sQSNZKoJt3uNk0EKgHwC8-C0YCpiD4ctfHHQVGttYh7q1fT0Ym5H4t9cPfj5vztIf5BkwJnB5zKDu5KA'
  },
  {
    id: 'box-2',
    studentName: 'Samantha Wu',
    usn: '1BM21CS045',
    confidence: 95,
    top: '24%',
    left: '32%',
    width: '12%',
    height: '25%',
    status: 'present',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJ1uDO7UqjbtNAvwgpwIBUhalBGs4_pRAZ-Tpmjnj94AdwC5CBORIhrN295uvJfJVWx7HFssamWNlf2q9DGWDLCv6KileIcQIcdu55tw65fRVoG5_N6z2F1FTGbfQdzEFg4iUhuNx8J_89XfOtgIZwGWjKPSHQSVCkbNPInao3WJ5va1MDSIqfoTrs3VCWRonsYZSKy2lrxlMyDyzow0T2ZmJepWLuffNF1hbFiDJ_QJoXMDhNHSwICA'
  },
  {
    id: 'box-3',
    studentName: 'Priya Sharma',
    usn: '1BM21CS089',
    confidence: 99,
    top: '18%',
    left: '50%',
    width: '12%',
    height: '24%',
    status: 'present',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcY6B9tfpwmXDQWVur0ue_GikD-Oc16XgSs6nJbFW9IBlPYMiqJQnTGsvEIidhBODbMXS4dS18D5wYQ-3_U7ThiWFcqTqxgMah2oMvxSXYzIXRYUM6fkJVxrOEUdnb-jdBcdeMBhUuH2SVvp0kpM0gezQf3N20_f32WfHv-W7ulPf5X4HMpAEtTu4STg8oEnxud_LRhLu8WR3dHUjodv6MuvHZTCLEpRbQ32C1PvR1vnvOlg-kVEzBtw'
  },
  {
    id: 'box-4',
    studentName: 'Unknown Student #3',
    usn: 'Unrecognized Face',
    confidence: 42,
    top: '30%',
    left: '75%',
    width: '13%',
    height: '27%',
    status: 'absent'
  }
];

export const CLASSROOM_PHOTO_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCN1oU35iWZ-yfBJyIZun9ScG0npks-Lr6LXfiYwu1Lr-2GYEj7i2QNqixA5OaHvqugIe5FqdXGWQq35eJ7LzJE5ynlsrN4FwWBm7GJ02UpXor96CK2O5qw0alrhtIfvmrfH_Sm1S1m6oBWHLBX4fxf_j9NpU1MRauk1_rtq80Get3zyuQthDIFH2p9camaxDk1_TDD62wEyb4i9TsG-ilsIN9ZBPEoIiKxcUK_dCaRDNw6B94QOP4HZw';

export const AUTODENCE_LOGO_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHfovfczzsplPIixxaGeYSLr1UqBqFBODRx0sNNhdrvV862Y8qVXOpKehb9wEEt6Pcx_JTPM9Os2DY4crpzABLA9qp_zXvxpwRonStK_E3B71jP_pHhU9bmCTSpkZ5nO8Fk9nXNoYkU_FrLEiFJSF3lr2qNC-wvVBCcSl3emoRDx0C_bPWJ25z9zM21J3-KrMDMDoMHBpglLjFeS3piLbcRdf6XQOtKbqRWoD5JaMSrpwA7sDUHO4l56vPnRPV0v8TH6Q';

export const AUTODENCE_ICON_URL = 'https://lh3.googleusercontent.com/aida/AEtjO1XBsaZaDcyfdgiHf9XrP6yrVmYihFi1XpLn7fPCSMJ7bHjkKY2EyzLrWroRXwQRz8okVwsiKMnbxS7GgobtkvMC9QFHkS9tlFD4tMkOFpvatATAv5Ue_Kh4ZpgvLxqI7ZQXIsLCYqEn2lTJCcZwbpCnz5Pu-mlJ87Sxt_KyOd5BwTPCcsMroauXbFL63qsO2iChLKHM7WGmJ6I92ui8k_0BUmD1JnN9kwZSVO0MVSX7PfkIsZNjvEOahEtI_LuK_e5KsMVJATUboYw';
