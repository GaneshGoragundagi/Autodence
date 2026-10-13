"""
Seed demo data for Autodence with students, teachers, subjects, sessions, and attendance records.
"""
import os
from werkzeug.security import generate_password_hash
import database

def seed():
    # Remove existing DB if needed to recreate with clean updated schema
    if os.path.exists(database.DB_PATH):
        try:
            os.remove(database.DB_PATH)
        except Exception:
            pass

    database.init_db()

    # 1. Teachers
    t_pass = generate_password_hash('password123')
    database.register_teacher('Dr. Ramesh Sharma', 'EMP1024', 'ramesh.cse@college.edu', t_pass, 'CSE')
    database.register_teacher('Prof. Sunita Rao', 'EMP2048', 'sunita.ece@college.edu', t_pass, 'ECE')

    # 2. Students
    s_pass = generate_password_hash('password123')
    students_data = [
        ('Rahul Verma', '1RV21CS001', 'rahul.cs21@college.edu', 'CSE', 6, 'A'),
        ('Priya Nair', '1RV21CS002', 'priya.cs21@college.edu', 'CSE', 6, 'A'),
        ('Ananya Rao', '1RV21CS045', 'ananya.cs21@college.edu', 'CSE', 6, 'A'),
        ('Amit Kumar', '1RV21CS088', 'amit.cs21@college.edu', 'CSE', 6, 'A'),
        ('Vikram Seth', '1RV21EC010', 'vikram.ec21@college.edu', 'ECE', 6, 'A'),
        ('Sneha Kulkarni', '1RV21EC025', 'sneha.ec21@college.edu', 'ECE', 6, 'B'),
        ('Karthik Hegde', '1RV21AI005', 'karthik.ai21@college.edu', 'AIML', 4, 'A'),
        ('Bhavana Reddy', '1RV21IS012', 'bhavana.is21@college.edu', 'ISE', 4, 'A')
    ]

    for name, usn, email, branch, sem, sec in students_data:
        database.register_student(name, usn, email, s_pass, branch, sem, sec)

    # 3. Get Student IDs and Teacher IDs
    teacher_cse = database.get_user_by_email('ramesh.cse@college.edu')
    t_profile = database.get_teacher_by_user_id(teacher_cse['id'])
    teacher_id = t_profile['teacher_id']

    cse_students = database.get_students_filtered(branch_code='CSE', semester=6, section='A')
    s_map = {s['usn']: s['id'] for s in cse_students}

    # 4. Seed Attendance Sessions for CSE Sem 6-A
    # Session 1: Machine Learning
    records_1 = [
        {'student_id': s_map['1RV21CS001'], 'status': 'Present', 'confidence': 88.5, 'marking_method': 'AI_Photo'},
        {'student_id': s_map['1RV21CS002'], 'status': 'Present', 'confidence': 91.2, 'marking_method': 'AI_Photo'},
        {'student_id': s_map['1RV21CS045'], 'status': 'Absent', 'confidence': 24.0, 'marking_method': 'AI_Photo'},
        {'student_id': s_map['1RV21CS088'], 'status': 'Present', 'confidence': 85.0, 'marking_method': 'AI_Photo'}
    ]
    database.save_attendance_session(
        teacher_id=teacher_id,
        branch_code='CSE',
        semester=6,
        section='A',
        subject_name='Machine Learning',
        session_date='2026-10-10',
        session_time='09:30:00',
        photo_filename=None,
        records=records_1,
        faces_detected=4,
        faces_matched=3,
        faces_unrecognized=1
    )

    # Session 2: Database Management Systems
    records_2 = [
        {'student_id': s_map['1RV21CS001'], 'status': 'Present', 'confidence': 86.0, 'marking_method': 'AI_Photo'},
        {'student_id': s_map['1RV21CS002'], 'status': 'Present', 'confidence': 93.0, 'marking_method': 'AI_Photo'},
        {'student_id': s_map['1RV21CS045'], 'status': 'Absent', 'confidence': 15.0, 'marking_method': 'AI_Photo'},
        {'student_id': s_map['1RV21CS088'], 'status': 'Present', 'confidence': 89.0, 'marking_method': 'AI_Photo'}
    ]
    database.save_attendance_session(
        teacher_id=teacher_id,
        branch_code='CSE',
        semester=6,
        section='A',
        subject_name='Database Management Systems',
        session_date='2026-10-11',
        session_time='11:15:00',
        photo_filename=None,
        records=records_2,
        faces_detected=3,
        faces_matched=3,
        faces_unrecognized=0
    )

    # Session 3: Computer Networks
    records_3 = [
        {'student_id': s_map['1RV21CS001'], 'status': 'Present', 'confidence': 90.0, 'marking_method': 'AI_Photo'},
        {'student_id': s_map['1RV21CS002'], 'status': 'Present', 'confidence': 87.5, 'marking_method': 'AI_Photo'},
        {'student_id': s_map['1RV21CS045'], 'status': 'Present', 'confidence': 79.0, 'marking_method': 'AI_Photo'},
        {'student_id': s_map['1RV21CS088'], 'status': 'Absent', 'confidence': 30.0, 'marking_method': 'AI_Photo'}
    ]
    database.save_attendance_session(
        teacher_id=teacher_id,
        branch_code='CSE',
        semester=6,
        section='A',
        subject_name='Computer Networks',
        session_date='2026-10-12',
        session_time='14:00:00',
        photo_filename=None,
        records=records_3,
        faces_detected=3,
        faces_matched=3,
        faces_unrecognized=0
    )

    # Session 4: Cloud Computing Architecture
    records_4 = [
        {'student_id': s_map['1RV21CS001'], 'status': 'Present', 'confidence': 92.0, 'marking_method': 'AI_Photo'},
        {'student_id': s_map['1RV21CS002'], 'status': 'Present', 'confidence': 94.0, 'marking_method': 'AI_Photo'},
        {'student_id': s_map['1RV21CS045'], 'status': 'Absent', 'confidence': 20.0, 'marking_method': 'AI_Photo'},
        {'student_id': s_map['1RV21CS088'], 'status': 'Present', 'confidence': 88.0, 'marking_method': 'AI_Photo'}
    ]
    _, _, sess4_id = database.save_attendance_session(
        teacher_id=teacher_id,
        branch_code='CSE',
        semester=6,
        section='A',
        subject_name='Cloud Computing Architecture',
        session_date='2026-10-13',
        session_time='10:30:00',
        photo_filename=None,
        records=records_4,
        faces_detected=3,
        faces_matched=3,
        faces_unrecognized=0
    )

    # 5. Add a sample correction request for Ananya Rao for Session 1
    # Find record for Ananya in Session 1
    ananya_id = s_map['1RV21CS045']
    conn = database.get_db()
    rec = conn.execute(
        "SELECT id FROM attendance_records WHERE student_id = ? AND status = 'Absent' LIMIT 1",
        (ananya_id,)
    ).fetchone()
    conn.close()

    if rec:
        database.submit_correction_request(
            record_id=rec['id'],
            student_id=ananya_id,
            reason="I was present in the second row, but lighting was dim on my side of the classroom."
        )

    print("Demo dataset seeded successfully with sessions, records, and dispute tickets!")

if __name__ == '__main__':
    seed()
