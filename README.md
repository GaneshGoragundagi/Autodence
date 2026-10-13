# Autodence — Smart AI Attendance Portal

Autodence is a computer-vision powered college attendance platform featuring branch isolation, secure role-based portals (Students & Faculty), and automated classroom group-photo facial recognition.

## 🚀 Quick Start

### 1. Requirements
- Python 3.9+
- Dependencies listed in `requirements.txt`

### 2. Run the Application
You can start the server with the Windows launcher:
```bat
run_app.bat
```
Or directly via Python:
```bash
python app.py
```
Then open your browser at **[http://127.0.0.1:5000](http://127.0.0.1:5000)**.

---

## 🔒 Mandatory Institutional Authentication
Autodence enforces secure institutional access:
- **Landing Gateway (`/`)**: Users must log in or register before accessing internal attendance dashboards or classroom tools.
- **Student Portal**: Authenticate via College USN or Institutional Email.
- **Teacher Portal**: Authenticate via Faculty Employee ID or Institutional Email.
- **Protected Routes**: All internal pages (`/student/*`, `/teacher/*`) require role-based session authentication.

---

## 👥 Demo Credentials

The database comes pre-seeded with sample users (or run `python seed_demo.py` anytime to reset):

### Student Account:
- **USN**: `1RV21CS001` (or Email: `rahul.cs21@college.edu`)
- **Password**: `password123`
- **Branch**: CSE (Sem 6, Sec A)

### Faculty / Teacher Account:
- **Employee ID**: `EMP1024` (or Email: `ramesh.cse@college.edu`)
- **Password**: `password123`
- **Branch**: CSE

---

## 📂 Project Structure

```
mini pro/
├── app.py                     # Main Flask Application & Route Controllers
├── database.py                # Database Access Layer (SQLite & Supabase support)
├── schema.sql                 # Institutional Schema (Branches, Users, Sessions, Disputes)
├── seed_demo.py               # Demo Database Seeder
├── face_engine.py             # OpenCV Facial Detection & Biometric Recognition
├── autodence.db               # SQLite Database File
├── requirements.txt           # Python Package Dependencies
├── run_app.bat                # Windows 1-Click Launch Script
├── push_to_github.bat         # Git Sync Helper
├── test_phase1.py             # Phase 1 Auth & Role Tests
├── test_full_suite.py         # End-to-End Test Suite
├── templates/                 # Jinja2 Templates
│   ├── base.html              # Layout, Navbar & Auth Context
│   ├── index.html             # Landing Page (Institutional Login & Register Gateway)
│   ├── login.html             # Dedicated Login Portal
│   ├── register_student.html  # Student Registration Portal
│   ├── register_teacher.html  # Faculty Registration Portal
│   ├── student_dashboard.html # Student Attendance Telemetry
│   ├── student_profile.html   # Student Profile Settings
│   ├── student_register_face.html # Facial Biometric Enrollment
│   ├── student_disputes.html  # Dispute Submission & Status
│   ├── teacher_dashboard.html # Faculty Roster & Low Attendance Tracking
│   ├── teacher_ai_attendance.html # AI Group Photo Attendance Capture
│   ├── teacher_review_attendance.html # AI Result Verification Screen
│   ├── teacher_history.html   # Session Archive
│   ├── teacher_session_detail.html # Attendance Session Details
│   └── teacher_corrections.html # Student Correction Review
└── static/
    ├── css/style.css          # Styling & Theme
    ├── images/logo.png        # Autodence Brand Logo
    └── uploads/
        ├── profiles/          # Registered Student Face Photos
        └── sessions/          # Classroom Group Photos
```

---

## 🧪 Running Automated Tests

```bash
python test_phase1.py
python test_full_suite.py
```
