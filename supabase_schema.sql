-- AUTODENCE Supabase (PostgreSQL) Schema
-- Run this in your Supabase Dashboard -> SQL Editor

-- 1. Branches table
CREATE TABLE IF NOT EXISTS public.branches (
    code TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Users table (authentication & base profile)
CREATE TABLE IF NOT EXISTS public.users (
    id BIGSERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (
        role IN ('student', 'teacher', 'admin')
    ),
    full_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Students profile table
CREATE TABLE IF NOT EXISTS public.students (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,
    usn TEXT UNIQUE NOT NULL,
    branch_code TEXT NOT NULL REFERENCES public.branches (code) ON UPDATE CASCADE,
    semester INT NOT NULL CHECK (semester BETWEEN 1 AND 8),
    section TEXT NOT NULL,
    profile_photo TEXT,
    face_registered INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Teachers profile table
CREATE TABLE IF NOT EXISTS public.teachers (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,
    employee_id TEXT UNIQUE NOT NULL,
    branch_code TEXT NOT NULL REFERENCES public.branches (code) ON UPDATE CASCADE,
    is_approved INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Subjects table
CREATE TABLE IF NOT EXISTS public.subjects (
    id BIGSERIAL PRIMARY KEY,
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    branch_code TEXT NOT NULL REFERENCES public.branches (code) ON UPDATE CASCADE,
    semester INT NOT NULL,
    UNIQUE (code, branch_code, semester)
);

-- 6. Attendance sessions table
CREATE TABLE IF NOT EXISTS public.attendance_sessions (
    id BIGSERIAL PRIMARY KEY,
    teacher_id BIGINT NOT NULL REFERENCES public.teachers (id),
    branch_code TEXT NOT NULL REFERENCES public.branches (code),
    semester INT NOT NULL,
    section TEXT NOT NULL,
    subject_name TEXT NOT NULL,
    session_date DATE NOT NULL,
    session_time TIME NOT NULL,
    classroom_photo TEXT,
    faces_detected INT DEFAULT 0,
    faces_matched INT DEFAULT 0,
    faces_unrecognized INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Attendance records table
CREATE TABLE IF NOT EXISTS public.attendance_records (
    id BIGSERIAL PRIMARY KEY,
    session_id BIGINT NOT NULL REFERENCES public.attendance_sessions (id) ON DELETE CASCADE,
    student_id BIGINT NOT NULL REFERENCES public.students (id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (
        status IN (
            'Present',
            'Absent',
            'Pending'
        )
    ),
    confidence DOUBLE PRECISION DEFAULT NULL,
    marking_method TEXT DEFAULT 'AI_Photo',
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (session_id, student_id)
);

-- 8. Correction requests table
CREATE TABLE IF NOT EXISTS public.correction_requests (
    id BIGSERIAL PRIMARY KEY,
    record_id BIGINT NOT NULL REFERENCES public.attendance_records (id) ON DELETE CASCADE,
    student_id BIGINT NOT NULL REFERENCES public.students (id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (
        status IN (
            'Pending',
            'Approved',
            'Rejected'
        )
    ),
    review_remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.attendance_sessions ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.correction_requests ENABLE ROW LEVEL SECURITY;

-- Allow anon/publishable key read and write operations
CREATE POLICY "Allow public read branches" ON public.branches FOR
SELECT USING (true);

CREATE POLICY "Allow public all users" ON public.users FOR ALL USING (true);

CREATE POLICY "Allow public all students" ON public.students FOR ALL USING (true);

CREATE POLICY "Allow public all teachers" ON public.teachers FOR ALL USING (true);

CREATE POLICY "Allow public all subjects" ON public.subjects FOR ALL USING (true);

CREATE POLICY "Allow public all sessions" ON public.attendance_sessions FOR ALL USING (true);

CREATE POLICY "Allow public all records" ON public.attendance_records FOR ALL USING (true);

CREATE POLICY "Allow public all disputes" ON public.correction_requests FOR ALL USING (true);

-- Seed initial branches
INSERT INTO
    public.branches (code, name)
VALUES (
        'CSE',
        'Computer Science and Engineering'
    ),
    (
        'ISE',
        'Information Science and Engineering'
    ),
    (
        'ECE',
        'Electronics and Communication Engineering'
    ),
    (
        'EEE',
        'Electrical and Electronics Engineering'
    ),
    (
        'ME',
        'Mechanical Engineering'
    ),
    ('CE', 'Civil Engineering'),
    (
        'AIML',
        'Artificial Intelligence and Machine Learning'
    ),
    (
        'OTHER',
        'Other Engineering Department'
    ) ON CONFLICT (code) DO NOTHING;

-- Seed standard institutional subjects
INSERT INTO
    public.subjects (
        code,
        name,
        branch_code,
        semester
    )
VALUES (
        'BCS501',
        'Software Engigineering and Project Management',
        'CSE',
        5
    ),
    (
        'BCS502',
        'Computer Networks',
        'CSE',
        5
    ),
    (
        'BCS503',
        'Theory of computation',
        'CSE',
        5
    ),
    (
        'BCSL504',
        'Web Technology Lab',
        'CSE',
        5
    ),
    (
        'BCS515B',
        'Artificial Intelligence',
        'CSE',
        5
    ),
    (
        '21EC62',
        'VLSI Design & Technology',
        'ECE',
        5
    ),
    (
        '21EC63',
        'Microcontrollers & Embedded Systems',
        'ECE',
        6
    ),
    (
        '21AI41',
        'Deep Learning & Neural Networks',
        'AIML',
        4
    ),
    (
        '21AI42',
        'Natural Language Processing',
        'AIML',
        4
    ),
    (
        '21IS41',
        'Software Engineering & Design',
        'ISE',
        4
    ),
    (
        '21IS42',
        'Web Development Frameworks',
        'ISE',
        4
    ) ON CONFLICT (code, branch_code, semester) DO NOTHING;