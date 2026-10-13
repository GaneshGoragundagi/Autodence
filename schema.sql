-- AUTODENCE SQLite Schema
PRAGMA foreign_keys = ON;

-- Branches table
CREATE TABLE IF NOT EXISTS branches (
    code TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users table (authentication & base profile)
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL COLLATE NOCASE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('student', 'teacher', 'admin')),
    full_name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Students profile table
CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE NOT NULL,
    usn TEXT UNIQUE NOT NULL COLLATE NOCASE,
    branch_code TEXT NOT NULL,
    semester INTEGER NOT NULL CHECK(semester BETWEEN 1 AND 8),
    section TEXT NOT NULL COLLATE NOCASE,
    profile_photo TEXT,
    face_registered INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (branch_code) REFERENCES branches(code) ON UPDATE CASCADE
);

-- Teachers profile table
CREATE TABLE IF NOT EXISTS teachers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE NOT NULL,
    employee_id TEXT UNIQUE NOT NULL COLLATE NOCASE,
    branch_code TEXT NOT NULL,
    is_approved INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (branch_code) REFERENCES branches(code) ON UPDATE CASCADE
);

-- Subjects table
CREATE TABLE IF NOT EXISTS subjects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    branch_code TEXT NOT NULL,
    semester INTEGER NOT NULL,
    UNIQUE(code, branch_code, semester),
    FOREIGN KEY (branch_code) REFERENCES branches(code) ON UPDATE CASCADE
);

-- Attendance sessions table
CREATE TABLE IF NOT EXISTS attendance_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    teacher_id INTEGER NOT NULL,
    branch_code TEXT NOT NULL,
    semester INTEGER NOT NULL,
    section TEXT NOT NULL,
    subject_name TEXT NOT NULL,
    session_date DATE NOT NULL,
    session_time TIME NOT NULL,
    classroom_photo TEXT,
    faces_detected INTEGER DEFAULT 0,
    faces_matched INTEGER DEFAULT 0,
    faces_unrecognized INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id),
    FOREIGN KEY (branch_code) REFERENCES branches(code)
);

-- Attendance records table
CREATE TABLE IF NOT EXISTS attendance_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER NOT NULL,
    student_id INTEGER NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('Present', 'Absent', 'Pending')),
    confidence REAL DEFAULT NULL,
    marking_method TEXT DEFAULT 'AI_Photo',
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(session_id, student_id),
    FOREIGN KEY (session_id) REFERENCES attendance_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Correction requests (dispute tickets by students)
CREATE TABLE IF NOT EXISTS correction_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    record_id INTEGER NOT NULL,
    student_id INTEGER NOT NULL,
    reason TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending' CHECK(status IN ('Pending', 'Approved', 'Rejected')),
    review_remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (record_id) REFERENCES attendance_records(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Seed initial branches
INSERT OR IGNORE INTO branches (code, name) VALUES
('CSE', 'Computer Science and Engineering'),
('ISE', 'Information Science and Engineering'),
('ECE', 'Electronics and Communication Engineering'),
('EEE', 'Electrical and Electronics Engineering'),
('ME', 'Mechanical Engineering'),
('CE', 'Civil Engineering'),
('AIML', 'Artificial Intelligence and Machine Learning'),
('OTHER', 'Other Engineering Department');

-- Seed standard institutional subjects
INSERT OR IGNORE INTO subjects (code, name, branch_code, semester) VALUES
('21CS61', 'Machine Learning', 'CSE', 6),
('21CS62', 'Database Management Systems', 'CSE', 6),
('21CS63', 'Computer Networks', 'CSE', 6),
('21CS64', 'Cloud Computing Architecture', 'CSE', 6),
('21EC61', 'Digital Signal Processing', 'ECE', 6),
('21EC62', 'VLSI Design & Technology', 'ECE', 6),
('21EC63', 'Microcontrollers & Embedded Systems', 'ECE', 6),
('21AI41', 'Deep Learning & Neural Networks', 'AIML', 4),
('21AI42', 'Natural Language Processing', 'AIML', 4),
('21IS41', 'Software Engineering & Design', 'ISE', 4),
('21IS42', 'Web Development Frameworks', 'ISE', 4);
